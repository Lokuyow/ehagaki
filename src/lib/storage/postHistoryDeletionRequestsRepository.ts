import {
    buildPostHistoryDeletionRequestRecordId,
    toPostHistoryDeletionRequestRecord,
} from "../postHistoryDeletionUtils";
import { RelayConfigUtils } from "../relayConfigUtils";
import type { NostrEvent } from "../types";
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

export interface PostHistoryDeletionRequestsRepository {
    getDeletedTargets(targets: PostHistoryDeletionTarget[]): Promise<Map<string, Set<string>>>;
    upsertValidDeletionRequests(input: UpsertPostHistoryDeletionRequestsInput): Promise<UpsertPostHistoryDeletionRequestsResult>;
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

function areStringArraysEqual(left: string[] | undefined, right: string[] | undefined): boolean {
    const normalizedLeft = left ?? [];
    const normalizedRight = right ?? [];
    if (normalizedLeft.length !== normalizedRight.length) {
        return false;
    }

    return normalizedLeft.every((value, index) => value === normalizedRight[index]);
}

function hasMaterialDeletionRequestChanges(
    existingRecord: PostHistoryDeletionRequestRecord,
    nextRecord: PostHistoryDeletionRequestRecord,
): boolean {
    return existingRecord.targetAuthorPubkey !== nextRecord.targetAuthorPubkey
        || existingRecord.targetEventId !== nextRecord.targetEventId
        || existingRecord.deletionEventId !== nextRecord.deletionEventId
        || existingRecord.deletionEventPubkey !== nextRecord.deletionEventPubkey
        || existingRecord.deletedAt !== nextRecord.deletedAt
        || existingRecord.reason !== nextRecord.reason
        || !areStringArraysEqual(existingRecord.relayUrls, nextRecord.relayUrls);
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
                addDeletedTarget(deletedTargets, record);
            }
        }

        return deletedTargets;
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

                const mergedRecord = {
                    ...record,
                    relayUrls: RelayConfigUtils.sanitizeExternalRelayUrls([
                        ...existingRecord.relayUrls,
                        ...record.relayUrls,
                    ]),
                    fetchedAt: Math.max(existingRecord.fetchedAt, record.fetchedAt),
                    updatedAt: this.now(),
                };
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
}

export const postHistoryDeletionRequestsRepository =
    new DexiePostHistoryDeletionRequestsRepository();
