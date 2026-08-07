/// <reference lib="webworker" />

import { getEventHash as getRxNostrEventHash } from "@rx-nostr/crypto";
import { validateEvent, verifyEvent } from "nostr-tools";
import { extractDeletionTargetEventIds } from "./postHistoryDeletionUtils";
import {
    isPostHistoryRawEventConsistent,
    isSignedNostrEvent,
} from "./postHistoryEventUtils";
import type {
    PostHistoryJsonlExportResult,
} from "./postHistoryJsonlExportService";
import {
    RAW_EVENT_VERIFICATION_RULE_VERSION,
    type RawEventVerificationState,
} from "./postHistoryRawEventVerification";
import type {
    PostHistoryJsonlExportProgress,
    PostHistoryJsonlExportWorkerRequest,
    PostHistoryJsonlExportWorkerResponse,
} from "./postHistoryJsonlExportWorkerProtocol";
import type {
    PostHistoryDeletionRequestRecord,
    PostHistoryRecord,
} from "./storage/ehagakiDb";
import { ehagakiDb } from "./storage/ehagakiDb";
import type { NostrEvent } from "./types";

const LEGACY_WRITE_BATCH_SIZE = 100;
const JSONL_CHUNK_SIZE = 1024 * 1024;

const VALID_RAW_EVENT_VERIFICATION: RawEventVerificationState = {
    status: "valid",
    ruleVersion: RAW_EVENT_VERIFICATION_RULE_VERSION,
};

const INVALID_RAW_EVENT_VERIFICATION: RawEventVerificationState = {
    status: "invalid",
    ruleVersion: RAW_EVENT_VERIFICATION_RULE_VERSION,
};

type MutableRawVerificationRecord = {
    id: string;
    rawEvent: unknown;
    rawEventVerification?: RawEventVerificationState;
};

type MigrationItem =
    | { type: "post"; record: PostHistoryRecord }
    | { type: "deletion"; record: PostHistoryDeletionRequestRecord };

function send(message: PostHistoryJsonlExportWorkerResponse): void {
    self.postMessage(message);
}

function sendProgress(progress: PostHistoryJsonlExportProgress): void {
    send({ type: "progress", progress });
}

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
            // comparison before we write its invalid migration result.
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
    records: Array<{ record: T; fingerprint: string; verification: RawEventVerificationState }>,
    table: {
        get(id: string): Promise<T | undefined>;
        update(id: string, changes: Pick<T, "rawEventVerification">): Promise<unknown>;
    },
): Promise<void> {
    for (const { record, fingerprint, verification } of records) {
        const current = await table.get(record.id);
        if (!current || createRawFingerprint(current.rawEvent) !== fingerprint) {
            continue;
        }

        await table.update(record.id, {
            rawEventVerification: verification,
        } as Pick<T, "rawEventVerification">);
    }
}

async function migrateLegacyVerifications(
    postRecords: PostHistoryRecord[],
    deletionRecords: PostHistoryDeletionRequestRecord[],
): Promise<void> {
    const allRecords: MigrationItem[] = [
        ...postRecords.map((record) => ({ type: "post" as const, record })),
        ...deletionRecords.map((record) => ({ type: "deletion" as const, record })),
    ];
    const total = allRecords.length;
    let processed = 0;
    const verificationByFingerprint = new Map<string, RawEventVerificationState>();
    const postBatch: Array<{
        record: PostHistoryRecord;
        fingerprint: string;
        verification: RawEventVerificationState;
    }> = [];
    const deletionBatch: Array<{
        record: PostHistoryDeletionRequestRecord;
        fingerprint: string;
        verification: RawEventVerificationState;
    }> = [];

    async function flushBatches(): Promise<void> {
        if (postBatch.length > 0) {
            const batch = postBatch.splice(0);
            await ehagakiDb.transaction("rw", ehagakiDb.postHistory, () =>
                persistLegacyVerificationBatch(batch, ehagakiDb.postHistory));
        }
        if (deletionBatch.length > 0) {
            const batch = deletionBatch.splice(0);
            await ehagakiDb.transaction("rw", ehagakiDb.postHistoryDeletionRequests, () =>
                persistLegacyVerificationBatch(batch, ehagakiDb.postHistoryDeletionRequests));
        }
    }

    sendProgress({ phase: "verifying", processed, total });
    for (const item of allRecords) {
        if (!isCurrentRawEventVerification(item.record.rawEventVerification)) {
            const fingerprint = createRawFingerprint(item.record.rawEvent);
            const verification = verificationByFingerprint.get(fingerprint)
                ?? fullyVerifyRawEvent(item.record.rawEvent);
            verificationByFingerprint.set(fingerprint, verification);
            if (item.type === "post") {
                item.record.rawEventVerification = verification;
                postBatch.push({
                    record: item.record,
                    fingerprint,
                    verification,
                });
            } else {
                item.record.rawEventVerification = verification;
                deletionBatch.push({
                    record: item.record,
                    fingerprint,
                    verification,
                });
            }
        }

        processed += 1;
        if (processed % LEGACY_WRITE_BATCH_SIZE === 0) {
            await flushBatches();
            sendProgress({ phase: "verifying", processed, total });
        }
    }
    await flushBatches();
    sendProgress({ phase: "verifying", processed: total, total });
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

function createJsonlBlob(events: NostrEvent[]): Blob {
    if (events.length === 0) {
        return new Blob([], { type: "application/x-ndjson;charset=utf-8" });
    }

    const chunks: string[] = [];
    let chunk = "";
    for (const event of events) {
        const line = `${JSON.stringify(event)}\n`;
        if (chunk.length > 0 && chunk.length + line.length > JSONL_CHUNK_SIZE) {
            chunks.push(chunk);
            chunk = "";
        }
        chunk += line;
    }
    if (chunk.length > 0) {
        chunks.push(chunk);
    }
    return new Blob(chunks, { type: "application/x-ndjson;charset=utf-8" });
}

async function exportForPubkey(pubkeyHex: string): Promise<{
    result: Omit<PostHistoryJsonlExportResult, "jsonl">;
    blob: Blob;
}> {
    sendProgress({ phase: "loading" });
    const [postRecords, deletionRecords] = await Promise.all([
        ehagakiDb.postHistory.where("pubkeyHex").equals(pubkeyHex).toArray(),
        ehagakiDb.postHistoryDeletionRequests
            .where("targetAuthorPubkey")
            .equals(pubkeyHex)
            .toArray(),
    ]);
    await migrateLegacyVerifications(postRecords, deletionRecords);

    const result = createEmptyResult();
    const postEvents: NostrEvent[] = [];
    const deletionEvents: NostrEvent[] = [];
    const exportablePostEventIds = new Set<string>();
    const validDeletionTargetEventIds = new Set<string>();
    const deletionTargetsWithUnavailableRawEvent = new Set<string>();

    for (const record of postRecords) {
        if (record.kind !== 1 && record.kind !== 42) {
            continue;
        }
        if (!isCurrentValidRawEventVerification(record.rawEventVerification)
            || !isPostHistoryRawEventConsistent(record.rawEvent, record)
            || !isLightweightValidNostrEvent(record.rawEvent, record.kind)) {
            result.skippedPostCount += 1;
            continue;
        }

        postEvents.push(toExportableSignedEvent(record.rawEvent));
        exportablePostEventIds.add(record.eventId);
        result.exportedPostEventCount += 1;
    }

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
    result.isPartial = result.skippedPostCount > 0
        || result.missingDeletionRawEventCount > 0
        || result.invalidDeletionRawEventCount > 0;

    sendProgress({ phase: "creating" });
    return { result, blob: createJsonlBlob(events) };
}

self.addEventListener("message", (message: MessageEvent<PostHistoryJsonlExportWorkerRequest>) => {
    if (message.data?.type !== "export") {
        return;
    }

    void exportForPubkey(message.data.pubkeyHex)
        .then(({ result, blob }) => send({ type: "complete", result, blob }))
        .catch((error: unknown) => send({
            type: "error",
            message: error instanceof Error ? error.message : "post_history_export_worker_failed",
        }));
});

export {};
