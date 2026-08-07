import {
    buildPostHistoryDeletionRequestRecordId,
    comparePostHistoryDeletionRequests,
    isPostHistoryDeletionTargetVerified,
    isSupportedPostHistoryDeletionTargetKind,
    POST_HISTORY_DELETION_REQUEST_SCHEMA_VERSION,
    isValidDeletionRequestForTarget,
    toPostHistoryDeletionRequestReferenceRecord,
    toPostHistoryDeletionRequestRecord,
    toPostHistoryDeletionState,
} from "../postHistoryDeletionUtils";
import { RelayConfigUtils } from "../relayConfigUtils";
import type { NostrEvent } from "../types";
import { areStringArraysEqual } from "../utils/arrayEqualityUtils";
import { bumpPostHistorySearchRevision } from "../postHistoryLocalSearchRevision";
import {
    ehagakiDb,
    type EHagakiDB,
    type PostHistoryDeletionRequestRecord,
} from "./ehagakiDb";

export interface PostHistoryDeletionTarget {
    targetAuthorPubkey: string;
    targetEventId: string;
}

export interface PostHistoryDeletionRequestItem {
    event: NostrEvent;
    relayUrls?: string[];
}

export interface UpsertPostHistoryDeletionRequestsInput {
    targetEvents: NostrEvent[];
    deletionEvents: PostHistoryDeletionRequestItem[];
    fetchedAt?: number;
}

export interface UpsertPostHistoryDeletionRequestsResult {
    insertedCount: number;
    updatedCount: number;
    unchangedCount: number;
    ignoredCount: number;
}

export interface UpsertImportedPostHistoryDeletionEventsInput {
    ownerPubkeyHex: string;
    deletionEvents: NostrEvent[];
    fetchedAt?: number;
}

export interface UpsertImportedPostHistoryDeletionEventsResult {
    insertedCount: number;
    updatedCount: number;
    unchangedCount: number;
    ignoredCount: number;
    appliedDeletionCount: number;
}

export interface SaveLocalPostHistoryDeletionInput {
    targetEventId: string;
    deletionEvent: NostrEvent;
    deletedAt: number;
    relayUrls?: string[];
    fetchedAt?: number;
}

export interface PostHistoryDeletionRequestsRepository {
    getDeletedTargets(targets: PostHistoryDeletionTarget[]): Promise<Map<string, Set<string>>>;
    getAllForTargetAuthorPubkey(pubkeyHex: string | null | undefined): Promise<PostHistoryDeletionRequestRecord[]>;
    upsertValidDeletionRequests(input: UpsertPostHistoryDeletionRequestsInput): Promise<UpsertPostHistoryDeletionRequestsResult>;
    upsertImportedDeletionEvents(input: UpsertImportedPostHistoryDeletionEventsInput): Promise<UpsertImportedPostHistoryDeletionEventsResult>;
    saveLocalDeletion(input: SaveLocalPostHistoryDeletionInput): Promise<void>;
}

const NOSTR_EVENT_ID_PATTERN = /^[0-9a-f]{64}$/;
const NOSTR_KIND_TAG_PATTERN = /^(0|[1-9]\d{0,4})$/;

interface ImportedDeletionRequestCandidate {
    record: PostHistoryDeletionRequestRecord;
    shouldStoreWithoutTarget: boolean;
}

function parseNostrKindTagValue(value: unknown): number | null {
    if (typeof value !== "string" || !NOSTR_KIND_TAG_PATTERN.test(value)) {
        return null;
    }

    const kind = Number(value);
    return Number.isInteger(kind) && kind >= 0 && kind <= 65_535
        ? kind
        : null;
}

function shouldStoreImportedDeletionWithoutTarget(deletionEvent: NostrEvent): boolean {
    const kindTags = deletionEvent.tags.filter((tag) => tag[0] === "k");
    if (kindTags.length === 0) {
        return true;
    }

    const targetKinds = kindTags.map((tag) => parseNostrKindTagValue(tag[1]));
    if (targetKinds.some((kind) => kind === null)) {
        return true;
    }

    return targetKinds.some((kind) =>
        kind !== null && isSupportedPostHistoryDeletionTargetKind(kind));
}

function makeTargetMap(targetEvents: NostrEvent[]): Map<string, NostrEvent> {
    const targetsByEventId = new Map<string, NostrEvent>();
    for (const event of targetEvents) {
        if (event?.id && event.pubkey) {
            targetsByEventId.set(event.id, event);
        }
    }

    return targetsByEventId;
}

function addDeletedTarget(
    map: Map<string, Set<string>>,
    record: Pick<PostHistoryDeletionRequestRecord, "targetAuthorPubkey" | "targetEventId">,
): void {
    const eventIds = map.get(record.targetAuthorPubkey) ?? new Set<string>();
    eventIds.add(record.targetEventId);
    map.set(record.targetAuthorPubkey, eventIds);
}

function hasMaterialDeletionRequestChanges(
    existingRecord: PostHistoryDeletionRequestRecord,
    nextRecord: PostHistoryDeletionRequestRecord,
): boolean {
    return existingRecord.targetAuthorPubkey !== nextRecord.targetAuthorPubkey
        || existingRecord.targetEventId !== nextRecord.targetEventId
        || existingRecord.deletionEventId !== nextRecord.deletionEventId
        || existingRecord.deletionEventPubkey !== nextRecord.deletionEventPubkey
        || isPostHistoryDeletionTargetVerified(existingRecord)
            !== isPostHistoryDeletionTargetVerified(nextRecord)
        || existingRecord.deletedAt !== nextRecord.deletedAt
        || existingRecord.reason !== nextRecord.reason
        || !areStringArraysEqual(existingRecord.relayUrls, nextRecord.relayUrls);
}

function mergeDeletionRequestRecord(
    existingRecord: PostHistoryDeletionRequestRecord,
    nextRecord: PostHistoryDeletionRequestRecord,
    now: () => number,
): PostHistoryDeletionRequestRecord {
    return {
        ...nextRecord,
        targetVerified: isPostHistoryDeletionTargetVerified(existingRecord)
            || isPostHistoryDeletionTargetVerified(nextRecord),
        relayUrls: RelayConfigUtils.sanitizeExternalRelayUrls([
            ...existingRecord.relayUrls,
            ...nextRecord.relayUrls,
        ]),
        fetchedAt: Math.max(existingRecord.fetchedAt, nextRecord.fetchedAt),
        updatedAt: now(),
        schemaVersion: POST_HISTORY_DELETION_REQUEST_SCHEMA_VERSION,
    };
}

export class DexiePostHistoryDeletionRequestsRepository implements PostHistoryDeletionRequestsRepository {
    constructor(
        private db: EHagakiDB = ehagakiDb,
        private now: () => number = Date.now,
    ) {}

    async getDeletedTargets(targets: PostHistoryDeletionTarget[]): Promise<Map<string, Set<string>>> {
        const deletedTargets = new Map<string, Set<string>>();
        const uniqueTargets = new Map<string, PostHistoryDeletionTarget>();
        for (const target of targets) {
            if (!target.targetAuthorPubkey || !target.targetEventId) {
                continue;
            }

            uniqueTargets.set(
                `${target.targetAuthorPubkey}:${target.targetEventId}`,
                target,
            );
        }

        for (const target of uniqueTargets.values()) {
            const records = await this.db.postHistoryDeletionRequests
                .where("[targetAuthorPubkey+targetEventId]")
                .equals([target.targetAuthorPubkey, target.targetEventId])
                .toArray();
            for (const record of records) {
                if (isPostHistoryDeletionTargetVerified(record)) {
                    addDeletedTarget(deletedTargets, record);
                }
            }
        }

        return deletedTargets;
    }

    async getAllForTargetAuthorPubkey(
        pubkeyHex: string | null | undefined,
    ): Promise<PostHistoryDeletionRequestRecord[]> {
        if (!pubkeyHex) {
            return [];
        }

        return this.db.postHistoryDeletionRequests
            .where("targetAuthorPubkey")
            .equals(pubkeyHex)
            .toArray();
    }

    async saveLocalDeletion(input: SaveLocalPostHistoryDeletionInput): Promise<void> {
        const deletionEvent = input.deletionEvent;
        if (
            !input.targetEventId
            || deletionEvent.kind !== 5
            || !NOSTR_EVENT_ID_PATTERN.test(deletionEvent.id)
        ) {
            throw new Error("invalid_local_deletion_event");
        }

        const fetchedAt = input.fetchedAt ?? this.now();
        let changedPubkeyHex: string | null = null;

        await this.db.transaction(
            "rw",
            this.db.postHistoryDeletionRequests,
            this.db.postHistory,
            async () => {
                const targetRecord = await this.db.postHistory.get(input.targetEventId);
                if (
                    !targetRecord
                    || !isSupportedPostHistoryDeletionTargetKind(targetRecord.kind)
                    || !isValidDeletionRequestForTarget(deletionEvent, {
                        id: targetRecord.eventId,
                        pubkey: targetRecord.pubkeyHex,
                    })
                ) {
                    throw new Error("local_deletion_target_not_found");
                }

                const nextRecord = toPostHistoryDeletionRequestReferenceRecord({
                    deletionEvent,
                    targetEventId: targetRecord.eventId,
                    targetVerified: true,
                    relayUrls: input.relayUrls,
                    fetchedAt,
                }, this.now);
                const existingRecord = await this.db.postHistoryDeletionRequests.get(
                    nextRecord.id,
                );
                const mergedRecord = existingRecord
                    ? mergeDeletionRequestRecord(existingRecord, nextRecord, this.now)
                    : nextRecord;

                await this.db.postHistoryDeletionRequests.put(mergedRecord);

                if (
                    targetRecord.deletedAt !== input.deletedAt
                    || targetRecord.deletionEventId !== deletionEvent.id
                ) {
                    await this.db.postHistory.put({
                        ...targetRecord,
                        deletedAt: input.deletedAt,
                        deletionEventId: deletionEvent.id,
                        updatedAt: this.now(),
                    });
                    changedPubkeyHex = targetRecord.pubkeyHex;
                }
            },
        );

        if (changedPubkeyHex) {
            bumpPostHistorySearchRevision(changedPubkeyHex);
        }
    }

    async upsertValidDeletionRequests(
        input: UpsertPostHistoryDeletionRequestsInput,
    ): Promise<UpsertPostHistoryDeletionRequestsResult> {
        if (input.targetEvents.length === 0 || input.deletionEvents.length === 0) {
            return {
                insertedCount: 0,
                updatedCount: 0,
                unchangedCount: 0,
                ignoredCount: input.deletionEvents.length,
            };
        }

        const targetsByEventId = makeTargetMap(input.targetEvents);
        const fetchedAt = input.fetchedAt ?? this.now();
        const nextRecordsById = new Map<string, PostHistoryDeletionRequestRecord>();
        let ignoredCount = 0;

        for (const item of input.deletionEvents) {
            const targetEventIds = item.event.tags
                .filter((tag) => tag[0] === "e" && typeof tag[1] === "string")
                .map((tag) => tag[1]);
            let matched = false;
            for (const targetEventId of targetEventIds) {
                const targetEvent = targetsByEventId.get(targetEventId);
                if (!targetEvent) {
                    continue;
                }

                const existing = nextRecordsById.get(buildPostHistoryDeletionRequestRecordId(
                    targetEvent.pubkey,
                    targetEvent.id,
                    item.event.id,
                ));
                const record = toPostHistoryDeletionRequestRecord({
                    deletionEvent: item.event,
                    targetEvent,
                    relayUrls: RelayConfigUtils.sanitizeExternalRelayUrls([
                        ...(existing?.relayUrls ?? []),
                        ...(item.relayUrls ?? []),
                    ]),
                    fetchedAt,
                }, this.now);
                if (!record) {
                    continue;
                }

                nextRecordsById.set(record.id, record);
                matched = true;
            }

            if (!matched) {
                ignoredCount += 1;
            }
        }

        const nextRecords = Array.from(nextRecordsById.values());
        if (nextRecords.length === 0) {
            return {
                insertedCount: 0,
                updatedCount: 0,
                unchangedCount: 0,
                ignoredCount,
            };
        }

        let insertedCount = 0;
        let updatedCount = 0;
        let unchangedCount = 0;
        await this.db.transaction("rw", this.db.postHistoryDeletionRequests, async () => {
            const existingRecords = await this.db.postHistoryDeletionRequests.bulkGet(
                nextRecords.map((record) => record.id),
            );
            const existingRecordsById = new Map<string, PostHistoryDeletionRequestRecord>();
            existingRecords.forEach((record) => {
                if (record) {
                    existingRecordsById.set(record.id, record);
                }
            });

            const mergedRecords = nextRecords.map((record) => {
                const existingRecord = existingRecordsById.get(record.id);
                if (!existingRecord) {
                    insertedCount += 1;
                    return record;
                }

                const mergedRecord = mergeDeletionRequestRecord(
                    existingRecord,
                    record,
                    this.now,
                );
                if (hasMaterialDeletionRequestChanges(existingRecord, mergedRecord)) {
                    updatedCount += 1;
                } else {
                    unchangedCount += 1;
                }

                return mergedRecord;
            });

            await this.db.postHistoryDeletionRequests.bulkPut(mergedRecords);
        });

        return {
            insertedCount,
            updatedCount,
            unchangedCount,
            ignoredCount,
        };
    }

    async upsertImportedDeletionEvents(
        input: UpsertImportedPostHistoryDeletionEventsInput,
    ): Promise<UpsertImportedPostHistoryDeletionEventsResult> {
        const fetchedAt = input.fetchedAt ?? this.now();
        const candidatesById = new Map<string, ImportedDeletionRequestCandidate>();
        const candidateDeletionEventIds = new Set<string>();
        let ignoredCount = 0;

        for (const deletionEvent of input.deletionEvents) {
            if (
                deletionEvent.kind !== 5
                || deletionEvent.pubkey !== input.ownerPubkeyHex
                || !NOSTR_EVENT_ID_PATTERN.test(deletionEvent.id)
            ) {
                ignoredCount += 1;
                continue;
            }

            const targetEventIds = deletionEvent.tags
                .filter((tag) => tag[0] === "e"
                    && typeof tag[1] === "string"
                    && NOSTR_EVENT_ID_PATTERN.test(tag[1]))
                .map((tag) => tag[1]);
            const uniqueTargetEventIds = Array.from(new Set(targetEventIds));
            if (uniqueTargetEventIds.length === 0) {
                ignoredCount += 1;
                continue;
            }

            const shouldStoreWithoutTarget = shouldStoreImportedDeletionWithoutTarget(
                deletionEvent,
            );
            candidateDeletionEventIds.add(deletionEvent.id);
            for (const targetEventId of uniqueTargetEventIds) {
                const record = toPostHistoryDeletionRequestReferenceRecord({
                    deletionEvent,
                    targetEventId,
                    targetVerified: false,
                    relayUrls: [],
                    fetchedAt,
                }, this.now);
                candidatesById.set(record.id, {
                    record,
                    shouldStoreWithoutTarget,
                });
            }
        }

        const candidates = Array.from(candidatesById.values());
        if (candidates.length === 0) {
            return {
                insertedCount: 0,
                updatedCount: 0,
                unchangedCount: 0,
                ignoredCount,
                appliedDeletionCount: 0,
            };
        }

        let insertedCount = 0;
        let updatedCount = 0;
        let unchangedCount = 0;
        let appliedDeletionCount = 0;

        await this.db.transaction(
            "rw",
            this.db.postHistoryDeletionRequests,
            this.db.postHistory,
            async () => {
                const existingRecords = await this.db.postHistoryDeletionRequests.bulkGet(
                    candidates.map((candidate) => candidate.record.id),
                );
                const targetEventIds = Array.from(new Set(
                    candidates.map((candidate) => candidate.record.targetEventId),
                ));
                const targetRecords = await this.db.postHistory.bulkGet(targetEventIds);
                const targetRecordsById = new Map(
                    targetRecords
                        .filter((record) => !!record)
                        .map((record) => [record!.eventId, record!] as const),
                );
                const mergedRecords: PostHistoryDeletionRequestRecord[] = [];
                const storedDeletionEventIds = new Set<string>();

                candidates.forEach((candidate, index) => {
                    const { record } = candidate;
                    const targetRecord = targetRecordsById.get(record.targetEventId);
                    if (
                        (targetRecord
                            && !isSupportedPostHistoryDeletionTargetKind(targetRecord.kind))
                        || (!targetRecord && !candidate.shouldStoreWithoutTarget)
                    ) {
                        return;
                    }

                    const targetMatches = !!targetRecord
                        && isSupportedPostHistoryDeletionTargetKind(targetRecord.kind)
                        && targetRecord.pubkeyHex === record.targetAuthorPubkey
                        && targetRecord.pubkeyHex === record.deletionEventPubkey;
                    const nextRecord = {
                        ...record,
                        targetVerified: targetMatches,
                    };
                    storedDeletionEventIds.add(record.deletionEventId);
                    const existingRecord = existingRecords[index];
                    if (!existingRecord) {
                        insertedCount += 1;
                        mergedRecords.push(nextRecord);
                        return;
                    }

                    const mergedRecord = mergeDeletionRequestRecord(
                        existingRecord,
                        nextRecord,
                        this.now,
                    );
                    if (hasMaterialDeletionRequestChanges(existingRecord, mergedRecord)) {
                        updatedCount += 1;
                    } else {
                        unchangedCount += 1;
                    }
                    mergedRecords.push(mergedRecord);
                });

                for (const deletionEventId of candidateDeletionEventIds) {
                    if (!storedDeletionEventIds.has(deletionEventId)) {
                        ignoredCount += 1;
                    }
                }

                if (mergedRecords.length > 0) {
                    await this.db.postHistoryDeletionRequests.bulkPut(mergedRecords);
                }

                for (const targetEventId of targetEventIds) {
                    const targetRecord = targetRecordsById.get(targetEventId);
                    if (
                        !targetRecord
                        || !isSupportedPostHistoryDeletionTargetKind(targetRecord.kind)
                        || targetRecord.deletedAt !== undefined
                    ) {
                        continue;
                    }

                    const deletionRequests = await this.db.postHistoryDeletionRequests
                        .where("targetEventId")
                        .equals(targetEventId)
                        .toArray();
                    const applicableRequest = deletionRequests
                        .filter((record) => isPostHistoryDeletionTargetVerified(record)
                            && record.targetAuthorPubkey === targetRecord.pubkeyHex
                            && record.deletionEventPubkey === targetRecord.pubkeyHex)
                        .sort(comparePostHistoryDeletionRequests)[0];
                    if (!applicableRequest) {
                        continue;
                    }

                    const deletionState = toPostHistoryDeletionState(applicableRequest);
                    await this.db.postHistory.update(targetEventId, {
                        ...deletionState,
                        updatedAt: this.now(),
                    });
                    appliedDeletionCount += 1;
                }
            },
        );

        return {
            insertedCount,
            updatedCount,
            unchangedCount,
            ignoredCount,
            appliedDeletionCount,
        };
    }
}

export const postHistoryDeletionRequestsRepository =
    new DexiePostHistoryDeletionRequestsRepository();
