import Dexie from "dexie";
import { cloneNostrEvent, isSameSignedNostrEvent } from "../postHistoryEventUtils";
import { parseKind1ThreadReferences } from "../postHistoryNip10Utils";
import { RelayConfigUtils } from "../relayConfigUtils";
import type { NostrEvent } from "../types";
import {
    ehagakiDb,
    type EHagakiDB,
    type PostHistoryReplyEventRecord,
} from "./ehagakiDb";

export const POST_HISTORY_REPLY_EVENT_SCHEMA_VERSION = 1;

export interface PostHistoryReplyEventItem {
    event: NostrEvent;
    relayUrls?: string[];
}

export interface UpsertPostHistoryReplyEventsInput {
    parentEventId: string;
    events: PostHistoryReplyEventItem[];
    fetchedAt?: number;
}

export interface UpsertPostHistoryReplyEventsResult {
    insertedCount: number;
    updatedCount: number;
    unchangedCount: number;
    ignoredCount: number;
}

export interface PostHistoryReplyEventsRepository {
    getDirectReplies(parentEventId: string): Promise<PostHistoryReplyEventRecord[]>;
    upsertDirectReplies(input: UpsertPostHistoryReplyEventsInput): Promise<UpsertPostHistoryReplyEventsResult>;
    deleteForParent(parentEventId: string): Promise<void>;
}

function normalizeRelayUrls(relayUrls: string[] | undefined): string[] {
    return RelayConfigUtils.sanitizeExternalRelayUrls(
        relayUrls ?? [],
        { limit: RelayConfigUtils.EXTERNAL_INPUT_RELAY_LIMIT },
    );
}

function sortDirectReplies(records: PostHistoryReplyEventRecord[]): PostHistoryReplyEventRecord[] {
    return records.sort((left, right) => {
        if (left.createdAt !== right.createdAt) {
            return left.createdAt - right.createdAt;
        }

        return left.eventId.localeCompare(right.eventId);
    });
}

function areStringArraysEqual(left: string[] | undefined, right: string[] | undefined): boolean {
    const normalizedLeft = left ?? [];
    const normalizedRight = right ?? [];
    if (normalizedLeft.length !== normalizedRight.length) {
        return false;
    }

    return normalizedLeft.every((value, index) => value === normalizedRight[index]);
}

function areTagsEqual(left: string[][], right: string[][]): boolean {
    return left.length === right.length
        && left.every((tag, index) => areStringArraysEqual(tag, right[index]));
}

function hasMaterialReplyEventChanges(
    existingRecord: PostHistoryReplyEventRecord,
    nextRecord: PostHistoryReplyEventRecord,
): boolean {
    return existingRecord.parentEventId !== nextRecord.parentEventId
        || existingRecord.rootEventId !== nextRecord.rootEventId
        || existingRecord.authorPubkey !== nextRecord.authorPubkey
        || existingRecord.kind !== nextRecord.kind
        || existingRecord.content !== nextRecord.content
        || existingRecord.createdAt !== nextRecord.createdAt
        || !areStringArraysEqual(existingRecord.relayUrls, nextRecord.relayUrls)
        || !areStringArraysEqual(existingRecord.discoveredAs, nextRecord.discoveredAs)
        || !areTagsEqual(existingRecord.tags, nextRecord.tags)
        || !isSameSignedNostrEvent(existingRecord.rawEvent, nextRecord.rawEvent as NostrEvent);
}

export class DexiePostHistoryReplyEventsRepository implements PostHistoryReplyEventsRepository {
    constructor(
        private db: EHagakiDB = ehagakiDb,
        private now: () => number = Date.now,
        private console: Console = typeof globalThis.console !== "undefined"
            ? globalThis.console
            : { log: () => undefined, warn: () => undefined, error: () => undefined } as Console,
    ) { }

    async getDirectReplies(parentEventId: string): Promise<PostHistoryReplyEventRecord[]> {
        if (!parentEventId) {
            return [];
        }

        const records = await this.db.postHistoryReplyEvents
            .where("[parentEventId+createdAt]")
            .between([parentEventId, Dexie.minKey], [parentEventId, Dexie.maxKey])
            .toArray();

        return sortDirectReplies(records);
    }

    async upsertDirectReplies(input: UpsertPostHistoryReplyEventsInput): Promise<UpsertPostHistoryReplyEventsResult> {
        if (!input.parentEventId || input.events.length === 0) {
            return {
                insertedCount: 0,
                updatedCount: 0,
                unchangedCount: 0,
                ignoredCount: input.events.length,
            };
        }

        const fetchedAt = input.fetchedAt ?? this.now();
        let ignoredCount = 0;
        const normalizedItems = new Map<string, PostHistoryReplyEventItem>();

        for (const item of input.events) {
            if (!item?.event?.id || item.event.kind !== 1) {
                ignoredCount += 1;
                continue;
            }

            const references = parseKind1ThreadReferences(item.event);
            if (references.parentId !== input.parentEventId) {
                ignoredCount += 1;
                continue;
            }

            const existing = normalizedItems.get(item.event.id);
            if (existing && !isSameSignedNostrEvent(existing.event, item.event)) {
                this.console.warn("post_history_reply_event_conflict", item.event.id);
                ignoredCount += 1;
                continue;
            }

            normalizedItems.set(item.event.id, {
                event: item.event,
                relayUrls: normalizeRelayUrls([
                    ...(existing?.relayUrls ?? []),
                    ...(item.relayUrls ?? []),
                ]),
            });
        }

        const items = Array.from(normalizedItems.values());
        if (items.length === 0) {
            return {
                insertedCount: 0,
                updatedCount: 0,
                unchangedCount: 0,
                ignoredCount,
            };
        }

        const eventIds = items.map((item) => item.event.id);
        let insertedCount = 0;
        let updatedCount = 0;
        let unchangedCount = 0;

        await this.db.transaction("rw", this.db.postHistoryReplyEvents, async () => {
            const existingRecords = await this.db.postHistoryReplyEvents.bulkGet(eventIds);
            const existingMap = new Map<string, PostHistoryReplyEventRecord>();
            existingRecords.forEach((record) => {
                if (record) {
                    existingMap.set(record.eventId, record);
                }
            });

            const nextRecords = items.map((item) => {
                const existingRecord = existingMap.get(item.event.id);
                const references = parseKind1ThreadReferences(item.event);
                const relayUrls = normalizeRelayUrls([
                    ...(existingRecord?.relayUrls ?? []),
                    ...(item.relayUrls ?? []),
                ]);
                const nextRecord = {
                    id: item.event.id,
                    eventId: item.event.id,
                    parentEventId: input.parentEventId,
                    ...(references.rootId ? { rootEventId: references.rootId } : {}),
                    authorPubkey: item.event.pubkey,
                    kind: item.event.kind,
                    content: item.event.content,
                    tags: item.event.tags.map((tag) => [...tag]),
                    createdAt: item.event.created_at,
                    relayUrls,
                    discoveredAs: ["direct-reply"],
                    rawEvent: cloneNostrEvent(item.event),
                    fetchedAt,
                    updatedAt: this.now(),
                    schemaVersion: POST_HISTORY_REPLY_EVENT_SCHEMA_VERSION,
                } satisfies PostHistoryReplyEventRecord;

                if (!existingRecord) {
                    insertedCount += 1;
                } else if (hasMaterialReplyEventChanges(existingRecord, nextRecord)) {
                    updatedCount += 1;
                } else {
                    unchangedCount += 1;
                }

                return nextRecord;
            });

            await this.db.postHistoryReplyEvents.bulkPut(nextRecords);
        });

        return {
            insertedCount,
            updatedCount,
            unchangedCount,
            ignoredCount,
        };
    }

    async deleteForParent(parentEventId: string): Promise<void> {
        if (!parentEventId) {
            return;
        }

        await this.db.postHistoryReplyEvents
            .where("parentEventId")
            .equals(parentEventId)
            .delete();
    }
}

export const postHistoryReplyEventsRepository =
    new DexiePostHistoryReplyEventsRepository();
