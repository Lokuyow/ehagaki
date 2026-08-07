import { getEventHash as getRxNostrEventHash } from "@rx-nostr/crypto";
import { validateEvent, verifyEvent } from "nostr-tools";
import {
    extractDeletionTargetEventIds,
} from "./postHistoryDeletionUtils";
import {
    isPostHistoryRawEventConsistent,
    isSignedNostrEvent,
} from "./postHistoryEventUtils";
import type { NostrEvent } from "./types";
import type {
    PostHistoryDeletionRequestRecord,
    PostHistoryRecord,
} from "./storage/ehagakiDb";
import {
    postHistoryDeletionRequestsRepository,
    type PostHistoryDeletionRequestsRepository,
} from "./storage/postHistoryDeletionRequestsRepository";
import {
    postHistoryRepository,
    type PostHistoryRepository,
} from "./storage/postHistoryRepository";
import {
    RAW_EVENT_VERIFICATION_RULE_VERSION,
} from "./postHistoryRawEventVerification";
import type {
    PostHistoryJsonlExportProgress,
    PostHistoryJsonlExportWorkerResponse,
} from "./postHistoryJsonlExportWorkerProtocol";

export interface PostHistoryJsonlExportResult {
    jsonl: string;
    exportedEventCount: number;
    exportedPostEventCount: number;
    exportedDeletionEventCount: number;
    skippedPostCount: number;
    missingDeletionRawEventCount: number;
    invalidDeletionRawEventCount: number;
    isPartial: boolean;
}

export interface PostHistoryJsonlExportServiceDeps {
    postHistoryRepository?: Pick<PostHistoryRepository, "getAll">;
    deletionRequestsRepository?: Pick<
        PostHistoryDeletionRequestsRepository,
        "getAllForTargetAuthorPubkey"
    >;
    workerFactory?: () => PostHistoryJsonlExportWorker;
}

export interface PostHistoryJsonlExportWorker {
    onmessage: ((event: MessageEvent<PostHistoryJsonlExportWorkerResponse>) => void) | null;
    onerror: ((event: ErrorEvent) => void) | null;
    postMessage(message: { type: "export"; pubkeyHex: string }): void;
    terminate(): void;
}

export type PostHistoryJsonlExportWorkerResult = {
    result: Omit<PostHistoryJsonlExportResult, "jsonl">;
    blob: Blob;
};

export type PostHistoryJsonlExportWorkerOptions = {
    onProgress?: (progress: PostHistoryJsonlExportProgress) => void;
    signal?: AbortSignal;
};

function isImportCompatibleSignedEvent(rawEvent: unknown, expectedKind: number): rawEvent is NostrEvent {
    if (!isSignedNostrEvent(rawEvent) || rawEvent.kind !== expectedKind) {
        return false;
    }

    try {
        return validateEvent(rawEvent as never) && verifyEvent(rawEvent as never);
    } catch {
        return false;
    }
}

function isCurrentValidRawEventVerification(
    verification: PostHistoryRecord["rawEventVerification"]
        | PostHistoryDeletionRequestRecord["rawEventVerification"],
): boolean {
    return verification?.status === "valid"
        && verification.ruleVersion === RAW_EVENT_VERIFICATION_RULE_VERSION;
}

function isLightweightImportCompatibleSignedEvent(
    rawEvent: unknown,
    expectedKind: number,
): rawEvent is NostrEvent {
    if (!isSignedNostrEvent(rawEvent) || rawEvent.kind !== expectedKind) {
        return false;
    }

    try {
        return validateEvent(rawEvent as never)
            && getRxNostrEventHash(rawEvent as never) === rawEvent.id;
    } catch {
        return false;
    }
}

function toExportableSignedEvent(event: NostrEvent): NostrEvent {
    return {
        id: event.id,
        pubkey: event.pubkey,
        created_at: event.created_at,
        kind: event.kind,
        tags: event.tags.map((tag) => [...tag]),
        content: event.content,
        sig: event.sig,
    };
}

function compareExportEvents(left: NostrEvent, right: NostrEvent): number {
    if (left.created_at !== right.created_at) {
        return left.created_at - right.created_at;
    }

    return left.id === right.id ? 0 : left.id < right.id ? -1 : 1;
}

function hasRawDeletionEvent(record: PostHistoryDeletionRequestRecord): boolean {
    return record.rawEvent !== null && record.rawEvent !== undefined;
}

function isConsistentDeletionEvent(
    record: PostHistoryDeletionRequestRecord,
    rawEvent: unknown,
    ownerPubkeyHex: string,
): rawEvent is NostrEvent {
    if (!isSignedNostrEvent(rawEvent)) {
        return false;
    }
    const isValid = isCurrentValidRawEventVerification(record.rawEventVerification)
        ? isLightweightImportCompatibleSignedEvent(rawEvent, 5)
        : isImportCompatibleSignedEvent(rawEvent, 5);
    if (!isValid
        || rawEvent.pubkey !== ownerPubkeyHex
        || record.targetAuthorPubkey !== ownerPubkeyHex
        || record.deletionEventPubkey !== ownerPubkeyHex
        || rawEvent.id !== record.deletionEventId
    ) {
        return false;
    }

    return extractDeletionTargetEventIds(rawEvent).includes(record.targetEventId);
}

function createEmptyResult(): PostHistoryJsonlExportResult {
    return {
        jsonl: "",
        exportedEventCount: 0,
        exportedPostEventCount: 0,
        exportedDeletionEventCount: 0,
        skippedPostCount: 0,
        missingDeletionRawEventCount: 0,
        invalidDeletionRawEventCount: 0,
        isPartial: false,
    };
}

export class PostHistoryJsonlExportService {
    private readonly postHistoryRepository: Pick<PostHistoryRepository, "getAll">;
    private readonly deletionRequestsRepository: Pick<
        PostHistoryDeletionRequestsRepository,
        "getAllForTargetAuthorPubkey"
    >;
    private readonly workerFactory: () => PostHistoryJsonlExportWorker;

    constructor(deps: PostHistoryJsonlExportServiceDeps = {}) {
        this.postHistoryRepository = deps.postHistoryRepository ?? postHistoryRepository;
        this.deletionRequestsRepository = deps.deletionRequestsRepository
            ?? postHistoryDeletionRequestsRepository;
        this.workerFactory = deps.workerFactory ?? (() =>
            new Worker(
                new URL("./postHistoryJsonlExportWorker.ts", import.meta.url),
                { type: "module" },
            ));
    }

    exportForPubkeyInWorker(
        pubkeyHex: string | null | undefined,
        options: PostHistoryJsonlExportWorkerOptions = {},
    ): Promise<PostHistoryJsonlExportWorkerResult> {
        if (!pubkeyHex) {
            const { jsonl: _jsonl, ...result } = createEmptyResult();
            return Promise.resolve({
                result,
                blob: new Blob([], { type: "application/x-ndjson;charset=utf-8" }),
            });
        }

        return new Promise((resolve, reject) => {
            const worker = this.workerFactory();
            let settled = false;
            const cleanup = () => {
                worker.onmessage = null;
                worker.onerror = null;
                options.signal?.removeEventListener("abort", onAbort);
                worker.terminate();
            };
            const fail = (error: Error) => {
                if (settled) return;
                settled = true;
                cleanup();
                reject(error);
            };
            const onAbort = () => fail(new DOMException("Export aborted", "AbortError"));

            if (options.signal?.aborted) {
                onAbort();
                return;
            }

            options.signal?.addEventListener("abort", onAbort, { once: true });
            worker.onmessage = (event) => {
                const message = event.data;
                if (message.type === "progress") {
                    options.onProgress?.(message.progress);
                    return;
                }
                if (message.type === "error") {
                    fail(new Error(message.message));
                    return;
                }
                if (message.type === "complete") {
                    if (settled) return;
                    settled = true;
                    cleanup();
                    resolve({ result: message.result, blob: message.blob });
                }
            };
            worker.onerror = () => fail(new Error("post_history_export_worker_failed"));
            worker.postMessage({ type: "export", pubkeyHex });
        });
    }

    async exportForPubkey(
        pubkeyHex: string | null | undefined,
    ): Promise<PostHistoryJsonlExportResult> {
        if (!pubkeyHex) {
            return createEmptyResult();
        }

        const result = createEmptyResult();
        const postEvents: NostrEvent[] = [];
        const deletionEvents: NostrEvent[] = [];
        const exportablePostEventIds = new Set<string>();
        const validDeletionTargetEventIds = new Set<string>();
        const deletionTargetsWithUnavailableRawEvent = new Set<string>();
        const postRecords = await this.postHistoryRepository.getAll({ pubkeyHex });

        for (const record of postRecords) {
            if (record.kind !== 1 && record.kind !== 42) {
                continue;
            }

            if (record.pubkeyHex !== pubkeyHex) {
                continue;
            }

            if (!isPostHistoryRawEventConsistent(record.rawEvent, record)) {
                result.skippedPostCount += 1;
                continue;
            }

            const isValid = isCurrentValidRawEventVerification(
                record.rawEventVerification,
            )
                ? isLightweightImportCompatibleSignedEvent(record.rawEvent, record.kind)
                : isImportCompatibleSignedEvent(record.rawEvent, record.kind);
            if (!isValid) {
                result.skippedPostCount += 1;
                continue;
            }

            postEvents.push(toExportableSignedEvent(record.rawEvent));
            exportablePostEventIds.add(record.eventId);
            result.exportedPostEventCount += 1;
        }

        const deletionRecords = await this.deletionRequestsRepository
            .getAllForTargetAuthorPubkey(pubkeyHex);
        const deletionRecordsByEventId = new Map<string, PostHistoryDeletionRequestRecord[]>();
        for (const record of deletionRecords) {
            const records = deletionRecordsByEventId.get(record.deletionEventId) ?? [];
            records.push(record);
            deletionRecordsByEventId.set(record.deletionEventId, records);
        }

        for (const records of deletionRecordsByEventId.values()) {
            const validRecord = records.find((record) =>
                isConsistentDeletionEvent(record, record.rawEvent, pubkeyHex));
            if (validRecord) {
                const deletionEvent = toExportableSignedEvent(validRecord.rawEvent as NostrEvent);
                deletionEvents.push(deletionEvent);
                for (const targetEventId of extractDeletionTargetEventIds(deletionEvent)) {
                    validDeletionTargetEventIds.add(targetEventId);
                }
                result.exportedDeletionEventCount += 1;
                continue;
            }

            for (const record of records) {
                deletionTargetsWithUnavailableRawEvent.add(record.targetEventId);
            }

            if (records.every((record) => !hasRawDeletionEvent(record))) {
                result.missingDeletionRawEventCount += 1;
            } else {
                result.invalidDeletionRawEventCount += 1;
            }
        }

        // Older eHagaki versions persisted the post's deletion state without
        // saving the signed kind 5 raw event. Count those states as partial as
        // well, unless the exported kind 5 actually references this post.
        const unrecoverableDeletedPostEventIds = new Set<string>();
        for (const record of postRecords) {
            if (
                (record.kind !== 1 && record.kind !== 42)
                || record.deletedAt === undefined
                || !exportablePostEventIds.has(record.eventId)
                || validDeletionTargetEventIds.has(record.eventId)
                || deletionTargetsWithUnavailableRawEvent.has(record.eventId)
            ) {
                continue;
            }

            unrecoverableDeletedPostEventIds.add(record.eventId);
        }
        result.missingDeletionRawEventCount += unrecoverableDeletedPostEventIds.size;

        postEvents.sort(compareExportEvents);
        deletionEvents.sort(compareExportEvents);
        const events = [...postEvents, ...deletionEvents];
        result.exportedEventCount = events.length;
        result.jsonl = events.length > 0
            ? `${events.map((event) => JSON.stringify(event)).join("\n")}\n`
            : "";
        result.isPartial = result.skippedPostCount > 0
            || result.missingDeletionRawEventCount > 0
            || result.invalidDeletionRawEventCount > 0;
        return result;
    }
}

export const postHistoryJsonlExportService = new PostHistoryJsonlExportService();
