import { getEventHash as getRxNostrEventHash } from "@rx-nostr/crypto";
import { validateEvent, verifyEvent } from "nostr-tools";
import { extractDeletionTargetEventIds } from "./postHistoryDeletionUtils";
import {
    isPostHistoryRawEventConsistent,
    isSignedNostrEvent,
} from "./postHistoryEventUtils";
import {
    RAW_EVENT_VERIFICATION_RULE_VERSION,
    type RawEventVerificationState,
} from "./postHistoryRawEventVerification";
import type {
    PostHistoryDeletionRequestRecord,
    PostHistoryRecord,
} from "./storage/ehagakiDb";
import type { NostrEvent } from "./types";

export const POST_HISTORY_JSONL_CHUNK_SIZE = 1024 * 1024;
export const POST_HISTORY_LEGACY_WRITE_BATCH_SIZE = 100;

export type PostHistoryJsonlExportResult = {
    jsonl: string;
    exportedEventCount: number;
    exportedPostEventCount: number;
    exportedDeletionEventCount: number;
    skippedPostCount: number;
    missingDeletionRawEventCount: number;
    invalidDeletionRawEventCount: number;
    isPartial: boolean;
};

export type PostHistoryJsonlExportProgress =
    | { phase: "loading" }
    | { phase: "verifying"; processed: number; total: number }
    | { phase: "creating" };

export type PostHistoryVerificationStore<T extends {
    id: string;
    rawEvent: unknown;
    rawEventVerification?: RawEventVerificationState;
}> = {
    get(id: string): Promise<T | undefined>;
    update(
        id: string,
        changes: Pick<T, "rawEventVerification">,
    ): Promise<unknown>;
};

export type PostHistoryVerificationStores = {
    post: PostHistoryVerificationStore<PostHistoryRecord>;
    deletion: PostHistoryVerificationStore<PostHistoryDeletionRequestRecord>;
    transaction?: {
        post(run: () => Promise<void>): Promise<void>;
        deletion(run: () => Promise<void>): Promise<void>;
    };
};

export type PostHistoryJsonlExportEngineResult = {
    result: Omit<PostHistoryJsonlExportResult, "jsonl">;
    blob: Blob;
    jsonl?: string;
};

export type PostHistoryJsonlExportEngineOptions = {
    pubkeyHex: string;
    postRecords: PostHistoryRecord[];
    deletionRecords: PostHistoryDeletionRequestRecord[];
    verificationStores?: PostHistoryVerificationStores;
    onProgress?: (progress: PostHistoryJsonlExportProgress) => void;
    includeJsonl?: boolean;
};

type MutableRawVerificationRecord = {
    id: string;
    rawEvent: unknown;
    rawEventVerification?: RawEventVerificationState;
};

type MigrationItem =
    | { type: "post"; record: PostHistoryRecord }
    | { type: "deletion"; record: PostHistoryDeletionRequestRecord };

type MigrationWrite = {
    id: string;
    fingerprint: string;
    verification: RawEventVerificationState;
};

const VALID_RAW_EVENT_VERIFICATION: RawEventVerificationState = {
    status: "valid",
    ruleVersion: RAW_EVENT_VERIFICATION_RULE_VERSION,
};

const INVALID_RAW_EVENT_VERIFICATION: RawEventVerificationState = {
    status: "invalid",
    ruleVersion: RAW_EVENT_VERIFICATION_RULE_VERSION,
};

function isCurrentRawEventVerification(
    verification: MutableRawVerificationRecord["rawEventVerification"],
): boolean {
    return verification?.ruleVersion === RAW_EVENT_VERIFICATION_RULE_VERSION
        && (verification.status === "valid" || verification.status === "invalid");
}

function isCurrentValidRawEventVerification(
    verification: MutableRawVerificationRecord["rawEventVerification"],
): boolean {
    return verification?.status === "valid"
        && verification.ruleVersion === RAW_EVENT_VERIFICATION_RULE_VERSION;
}

function createRawFingerprint(rawEvent: unknown): string {
    if (isSignedNostrEvent(rawEvent)) {
        try {
            return `nostr:${getRxNostrEventHash(rawEvent as never)}\u0000${rawEvent.id}\u0000${rawEvent.sig}`;
        } catch {
            // A structurally malformed legacy value still needs a stable
            // comparison before its invalid migration result is written.
        }
    }

    try {
        return `raw:${JSON.stringify(rawEvent)}`;
    } catch {
        return "raw:unserializable";
    }
}

function fullyVerifyRawEvent(rawEvent: unknown): RawEventVerificationState {
    if (!isSignedNostrEvent(rawEvent)) {
        return { ...INVALID_RAW_EVENT_VERIFICATION };
    }

    try {
        return validateEvent(rawEvent as never)
            && verifyEvent({
                ...rawEvent,
                tags: rawEvent.tags.map((tag) => [...tag]),
            } as never)
            ? { ...VALID_RAW_EVENT_VERIFICATION }
            : { ...INVALID_RAW_EVENT_VERIFICATION };
    } catch {
        return { ...INVALID_RAW_EVENT_VERIFICATION };
    }
}

async function persistLegacyVerificationBatch<T extends MutableRawVerificationRecord>(
    records: MigrationWrite[],
    table: PostHistoryVerificationStore<T>,
): Promise<void> {
    for (const { id, fingerprint, verification } of records) {
        const current = await table.get(id);
        // The verification belongs to the fetched snapshot only. A concurrent
        // raw replacement must not receive the old snapshot's result.
        if (!current || createRawFingerprint(current.rawEvent) !== fingerprint) {
            continue;
        }

        await table.update(id, {
            rawEventVerification: verification,
        } as Pick<T, "rawEventVerification">);
    }
}

function createInMemoryVerificationStores(
    postRecords: PostHistoryRecord[],
    deletionRecords: PostHistoryDeletionRequestRecord[],
): PostHistoryVerificationStores {
    const createStore = <T extends MutableRawVerificationRecord>(records: T[]) => ({
        get: async (id: string) => records.find((record) => record.id === id),
        update: async (id: string, changes: Pick<T, "rawEventVerification">) => {
            const record = records.find((candidate) => candidate.id === id);
            if (record) {
                Object.assign(record, changes);
            }
        },
    });

    return {
        post: createStore(postRecords),
        deletion: createStore(deletionRecords),
    };
}

export async function migratePostHistoryLegacyVerifications(
    postRecords: PostHistoryRecord[],
    deletionRecords: PostHistoryDeletionRequestRecord[],
    stores: PostHistoryVerificationStores,
    onProgress?: (progress: PostHistoryJsonlExportProgress) => void,
): Promise<void> {
    const allRecords: MigrationItem[] = [
        ...postRecords.map((record) => ({ type: "post" as const, record })),
        ...deletionRecords.map((record) => ({ type: "deletion" as const, record })),
    ];
    const total = allRecords.length;
    let processed = 0;
    const verificationByFingerprint = new Map<string, RawEventVerificationState>();
    const postBatch: MigrationWrite[] = [];
    const deletionBatch: MigrationWrite[] = [];

    async function flushBatches(): Promise<void> {
        if (postBatch.length > 0) {
            const batch = postBatch.splice(0);
            const run = () => persistLegacyVerificationBatch(batch, stores.post);
            await (stores.transaction?.post ?? (async (callback: () => Promise<void>) => callback()))(run);
        }
        if (deletionBatch.length > 0) {
            const batch = deletionBatch.splice(0);
            const run = () => persistLegacyVerificationBatch(batch, stores.deletion);
            await (stores.transaction?.deletion ?? (async (callback: () => Promise<void>) => callback()))(run);
        }
    }

    onProgress?.({ phase: "verifying", processed, total });
    for (const item of allRecords) {
        if (!isCurrentRawEventVerification(item.record.rawEventVerification)) {
            const fingerprint = createRawFingerprint(item.record.rawEvent);
            const verification = verificationByFingerprint.get(fingerprint)
                ?? fullyVerifyRawEvent(item.record.rawEvent);
            verificationByFingerprint.set(fingerprint, verification);
            item.record.rawEventVerification = verification;
            const write = { id: item.record.id, fingerprint, verification };
            if (item.type === "post") {
                postBatch.push(write);
            } else {
                deletionBatch.push(write);
            }
        }

        processed += 1;
        if (processed % POST_HISTORY_LEGACY_WRITE_BATCH_SIZE === 0) {
            await flushBatches();
            onProgress?.({ phase: "verifying", processed, total });
        }
    }
    await flushBatches();
    onProgress?.({ phase: "verifying", processed: total, total });
}

function isLightweightValidNostrEvent(
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
    if (
        !isCurrentValidRawEventVerification(record.rawEventVerification)
        || !isLightweightValidNostrEvent(rawEvent, 5)
        || rawEvent.pubkey !== ownerPubkeyHex
        || record.targetAuthorPubkey !== ownerPubkeyHex
        || record.deletionEventPubkey !== ownerPubkeyHex
        || rawEvent.id !== record.deletionEventId
    ) {
        return false;
    }

    return extractDeletionTargetEventIds(rawEvent).includes(record.targetEventId);
}

function createEmptyResult(): Omit<PostHistoryJsonlExportResult, "jsonl"> {
    return {
        exportedEventCount: 0,
        exportedPostEventCount: 0,
        exportedDeletionEventCount: 0,
        skippedPostCount: 0,
        missingDeletionRawEventCount: 0,
        invalidDeletionRawEventCount: 0,
        isPartial: false,
    };
}

function createJsonlBlob(
    events: NostrEvent[],
    includeJsonl: boolean,
): { blob: Blob; jsonl?: string } {
    if (events.length === 0) {
        return {
            blob: new Blob([], { type: "application/x-ndjson;charset=utf-8" }),
            ...(includeJsonl ? { jsonl: "" } : {}),
        };
    }

    const chunks: string[] = [];
    let chunk = "";
    for (const event of events) {
        const line = `${JSON.stringify(event)}\n`;
        if (chunk.length > 0 && chunk.length + line.length > POST_HISTORY_JSONL_CHUNK_SIZE) {
            chunks.push(chunk);
            chunk = "";
        }
        chunk += line;
    }
    if (chunk.length > 0) {
        chunks.push(chunk);
    }

    return {
        blob: new Blob(chunks, { type: "application/x-ndjson;charset=utf-8" }),
        ...(includeJsonl ? { jsonl: chunks.join("") } : {}),
    };
}

export async function exportPostHistoryRecords(
    pubkeyHex: string,
    postRecords: PostHistoryRecord[],
    deletionRecords: PostHistoryDeletionRequestRecord[],
    options: Pick<PostHistoryJsonlExportEngineOptions, "onProgress" | "includeJsonl"> = {},
): Promise<PostHistoryJsonlExportEngineResult> {
    const result = createEmptyResult();
    const postEvents: NostrEvent[] = [];
    const deletionEvents: NostrEvent[] = [];
    const exportablePostEventIds = new Set<string>();
    const validDeletionTargetEventIds = new Set<string>();
    const deletionTargetsWithUnavailableRawEvent = new Set<string>();
    const scopedPostRecords = postRecords.filter((record) => record.pubkeyHex === pubkeyHex);
    const scopedDeletionRecords = deletionRecords.filter(
        (record) => record.targetAuthorPubkey === pubkeyHex,
    );

    for (const record of scopedPostRecords) {
        if (record.kind !== 1 && record.kind !== 42) {
            continue;
        }
        if (
            !isCurrentValidRawEventVerification(record.rawEventVerification)
            || !isPostHistoryRawEventConsistent(record.rawEvent, record)
            || !isLightweightValidNostrEvent(record.rawEvent, record.kind)
        ) {
            result.skippedPostCount += 1;
            continue;
        }

        postEvents.push(toExportableSignedEvent(record.rawEvent));
        exportablePostEventIds.add(record.eventId);
        result.exportedPostEventCount += 1;
    }

    const deletionRecordsByEventId = new Map<string, PostHistoryDeletionRequestRecord[]>();
    for (const record of scopedDeletionRecords) {
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

    const unrecoverableDeletedPostEventIds = new Set<string>();
    for (const record of scopedPostRecords) {
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
    result.isPartial = result.skippedPostCount > 0
        || result.missingDeletionRawEventCount > 0
        || result.invalidDeletionRawEventCount > 0;

    options.onProgress?.({ phase: "creating" });
    const serialized = createJsonlBlob(events, options.includeJsonl === true);
    return { result, ...serialized };
}

export async function runPostHistoryJsonlExportEngine(
    options: PostHistoryJsonlExportEngineOptions,
): Promise<PostHistoryJsonlExportEngineResult> {
    const scopedPostRecords = options.postRecords.filter(
        (record) => record.pubkeyHex === options.pubkeyHex,
    );
    const scopedDeletionRecords = options.deletionRecords.filter(
        (record) => record.targetAuthorPubkey === options.pubkeyHex,
    );
    const stores = options.verificationStores
        ?? createInMemoryVerificationStores(scopedPostRecords, scopedDeletionRecords);

    await migratePostHistoryLegacyVerifications(
        scopedPostRecords,
        scopedDeletionRecords,
        stores,
        options.onProgress,
    );
    return exportPostHistoryRecords(
        options.pubkeyHex,
        scopedPostRecords,
        scopedDeletionRecords,
        options,
    );
}
