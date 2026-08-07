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
}

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
    if (
        !isImportCompatibleSignedEvent(rawEvent, 5)
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

    constructor(deps: PostHistoryJsonlExportServiceDeps = {}) {
        this.postHistoryRepository = deps.postHistoryRepository ?? postHistoryRepository;
        this.deletionRequestsRepository = deps.deletionRequestsRepository
            ?? postHistoryDeletionRequestsRepository;
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

            if (!isImportCompatibleSignedEvent(record.rawEvent, record.kind)) {
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
