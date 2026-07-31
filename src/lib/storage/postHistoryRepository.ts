import Dexie, { cmp } from "dexie";
import {
    cloneNostrEvent,
    extractPostHistoryChannelReference,
    isSameSignedNostrEvent,
} from "../postHistoryEventUtils";
import {
    comparePostHistoryDeletionRequests,
    isPostHistoryDeletionTargetVerified,
    isSupportedPostHistoryDeletionTargetKind,
    POST_HISTORY_DELETION_REQUEST_SCHEMA_VERSION,
    toPostHistoryDeletionState,
} from "../postHistoryDeletionUtils";
import { markPostHistoryShouldReturnToLatestAfterLocalPost } from "../postHistoryLatestRequest";
import { extractPostHistoryMedia } from "../postHistoryMediaUtils";
import { RelayConfigUtils } from "../relayConfigUtils";
import type { NostrEvent } from "../types";
import { areStringArraysEqual } from "../utils/arrayEqualityUtils";
import type {
    PostHistoryDeletionRequestRecord,
    PostHistoryRecord,
    PostHistoryMediaRecord,
    EHagakiDB,
} from "./ehagakiDb";
import { ehagakiDb } from "./ehagakiDb";
import { POST_HISTORY_TIMELINE_INDEX } from "./ehagakiDbConstants";

export const POST_HISTORY_SCHEMA_VERSION = 2;

export type PostHistorySaveInput = {
    event: NostrEvent;
    acceptedRelays?: string[];
    relayHints?: string[];
    postedAt?: number;
};

export type PostHistoryPageOptions = PostHistoryRepositoryOptions & {
    page: number;
    pageSize: number;
};

export type PostHistoryVisibleQueryOptions = PostHistoryRepositoryOptions & {
    visibleUntil?: number | null;
};

export type PostHistoryTimelineCursor = Pick<
    PostHistoryRecord,
    "eventId" | "postedAt" | "createdAt"
>;

export type PostHistoryVisibleChunkOptions = PostHistoryVisibleQueryOptions & {
    limit: number;
};

export type PostHistoryVisibleChunkCursorOptions =
    PostHistoryVisibleChunkOptions & {
        cursor: PostHistoryTimelineCursor;
    };

export type PostHistoryVisibleChunkFromCreatedAtOptions =
    PostHistoryVisibleChunkOptions & {
        createdAt: number;
        query?: PostHistoryDateChunkQuery;
    };

export type PostHistoryDateChunkQuery = {
    contiguous?: boolean;
};

export type PostHistoryVisibleChunkAroundEventIdOptions =
    PostHistoryVisibleChunkOptions & {
        eventId: string;
        keepAbove?: number;
    };

export type PostHistorySparseChunkDirection = "latest" | "older" | "newer";

export type PostHistorySparseChunkOptions = PostHistoryRepositoryOptions & {
    visibleUntil: number;
    limit: number;
    direction: PostHistorySparseChunkDirection;
    cursor?: PostHistoryTimelineCursor;
};

export type PostHistoryFetchedEventItem = {
    event: NostrEvent;
    relayUrls?: string[];
};

export type PostHistoryUpsertFetchedEventsInput = {
    events: PostHistoryFetchedEventItem[];
    fetchedAt?: number;
};

export type PostHistoryUpsertFetchedEventsResult = {
    insertedCount: number;
    updatedCount: number;
    unchangedCount: number;
    appliedDeletionCount: number;
};

export type PostHistoryRepositoryOptions = {
    pubkeyHex?: string | null;
};

export interface PostHistoryRepository {
    getByEventId(eventId: string): Promise<PostHistoryRecord | null>;
    getExistingEventIdsForPubkey(input: {
        pubkeyHex: string | null | undefined;
        eventIds: string[];
    }): Promise<string[]>;
    getAll(options: PostHistoryRepositoryOptions): Promise<PostHistoryRecord[]>;
    getPage(options: PostHistoryPageOptions): Promise<PostHistoryRecord[]>;
    getLatestVisibleChunk(options: PostHistoryVisibleChunkOptions): Promise<PostHistoryRecord[]>;
    getOlderVisibleChunk(options: PostHistoryVisibleChunkCursorOptions): Promise<PostHistoryRecord[]>;
    getNewerVisibleChunk(options: PostHistoryVisibleChunkCursorOptions): Promise<PostHistoryRecord[]>;
    getVisibleChunkFromCreatedAt(options: PostHistoryVisibleChunkFromCreatedAtOptions): Promise<PostHistoryRecord[]>;
    getVisibleChunkAroundEventId(options: PostHistoryVisibleChunkAroundEventIdOptions): Promise<PostHistoryRecord[]>;
    hasPostsBeforeCreatedAt(pubkeyHex: string | null | undefined, createdAt: number): Promise<boolean>;
    getSparseChunk(options: PostHistorySparseChunkOptions): Promise<PostHistoryRecord[]>;
    countForPubkey(pubkeyHex: string | null | undefined): Promise<number>;
    countVisibleForPubkey(pubkeyHex: string | null | undefined, visibleUntil?: number | null): Promise<number>;
    putPostedEvent(input: PostHistorySaveInput): Promise<void>;
    upsertFetchedEvents(input: PostHistoryUpsertFetchedEventsInput): Promise<PostHistoryUpsertFetchedEventsResult>;
    getOldestCreatedAt(pubkeyHex: string | null | undefined): Promise<number | null>;
    markDeleted(eventId: string, deletionEventId: string, deletedAt?: number): Promise<void>;
    deleteForPubkey(pubkeyHex: string | null | undefined): Promise<void>;
}

type NormalizedFetchedEventItem = {
    event: NostrEvent;
    relayUrls: string[];
};

function cloneMedia(media: PostHistoryMediaRecord[]): PostHistoryMediaRecord[] {
    return media.map((item) => ({ ...item }));
}

function normalizePageNumber(page: number): number {
    return Number.isFinite(page) ? Math.max(1, Math.trunc(page)) : 1;
}

function normalizePageSize(pageSize: number): number {
    return Number.isFinite(pageSize) ? Math.max(1, Math.trunc(pageSize)) : 50;
}

function normalizeVisibleUntil(visibleUntil: number | null | undefined): number | null {
    return Number.isFinite(visibleUntil)
        ? Math.trunc(visibleUntil ?? 0)
        : null;
}

function normalizeChunkLimit(limit: number): number {
    return Number.isFinite(limit) ? Math.max(1, Math.trunc(limit)) : 50;
}

function normalizeCreatedAtValue(createdAt: number): number {
    return Number.isFinite(createdAt) ? Math.trunc(createdAt) : 0;
}

function normalizePostHistoryDateChunkQuery(
    query: PostHistoryDateChunkQuery | undefined,
): { contiguous: boolean } {
    return {
        contiguous: query?.contiguous !== false,
    };
}

export function comparePostHistoryTimelineOrder(
    left: Pick<PostHistoryRecord, "eventId" | "postedAt" | "createdAt">,
    right: Pick<PostHistoryRecord, "eventId" | "postedAt" | "createdAt">,
): number {
    if (left.postedAt !== right.postedAt) {
        return right.postedAt - left.postedAt;
    }

    if (left.createdAt !== right.createdAt) {
        return right.createdAt - left.createdAt;
    }

    return cmp(right.eventId, left.eventId);
}

function isOlderThanTimelineCursor(
    record: PostHistoryRecord,
    cursor: PostHistoryTimelineCursor,
): boolean {
    return comparePostHistoryTimelineOrder(record, cursor) > 0;
}

function isNewerThanTimelineCursor(
    record: PostHistoryRecord,
    cursor: PostHistoryTimelineCursor,
): boolean {
    return comparePostHistoryTimelineOrder(record, cursor) < 0;
}

function sortPostHistoryRecords(records: PostHistoryRecord[]): PostHistoryRecord[] {
    return records.sort(comparePostHistoryTimelineOrder);
}

type PostHistoryTimelineKey = [string, number, number, string];

function toTimelineKey(
    pubkeyHex: string,
    cursor: PostHistoryTimelineCursor,
): PostHistoryTimelineKey {
    return [pubkeyHex, cursor.postedAt, cursor.createdAt, cursor.eventId];
}

function getTimelineBounds(pubkeyHex: string): {
    lower: [string];
    upper: [string, typeof Dexie.maxKey];
} {
    return {
        lower: [pubkeyHex],
        upper: [pubkeyHex, Dexie.maxKey],
    };
}

function matchesVisibleUntil(
    record: PostHistoryRecord,
    visibleUntil: number | null,
): boolean {
    return visibleUntil === null || record.createdAt >= visibleUntil;
}

function toPostedAtFromCreatedAt(createdAt: number): number {
    return Math.max(0, createdAt * 1000);
}

function toRecord(input: PostHistorySaveInput, now: () => number): PostHistoryRecord {
    const updatedAt = now();
    const event = input.event;
    const acceptedRelays = RelayConfigUtils.sanitizeExternalRelayUrls(input.acceptedRelays);
    const relayHints = RelayConfigUtils.sanitizeExternalRelayUrls([
        ...(input.relayHints ?? []),
        ...acceptedRelays,
    ], { limit: 3 });
    const channelReference = extractPostHistoryChannelReference(event);

    return {
        id: event.id,
        eventId: event.id,
        pubkeyHex: event.pubkey,
        kind: event.kind,
        content: event.content,
        tags: event.tags.map((tag) => [...tag]),
        createdAt: event.created_at,
        postedAt: input.postedAt ?? updatedAt,
        relayHints,
        acceptedRelays,
        media: extractPostHistoryMedia(event),
        rawEvent: cloneNostrEvent(event),
        ...(channelReference.channelEventId
            ? { channelEventId: channelReference.channelEventId }
            : {}),
        ...(channelReference.channelRelayHints
            ? { channelRelayHints: channelReference.channelRelayHints }
            : {}),
        updatedAt,
        schemaVersion: POST_HISTORY_SCHEMA_VERSION,
    };
}

function normalizeFetchedEventItems(
    items: PostHistoryFetchedEventItem[],
    console: Console,
): NormalizedFetchedEventItem[] {
    const normalized = new Map<string, NormalizedFetchedEventItem>();

    for (const item of items) {
        if (!item?.event?.id || !item.event.pubkey) {
            continue;
        }

        const relayUrls = RelayConfigUtils.sanitizeExternalRelayUrls(item.relayUrls);
        const existing = normalized.get(item.event.id);

        if (!existing) {
            normalized.set(item.event.id, {
                event: item.event,
                relayUrls,
            });
            continue;
        }

        if (!isSameSignedNostrEvent(existing.event, item.event)) {
            console.warn("post_history_fetched_event_conflict", item.event.id);
            continue;
        }

        existing.relayUrls = RelayConfigUtils.sanitizeExternalRelayUrls([
            ...existing.relayUrls,
            ...relayUrls,
        ]);
    }

    return Array.from(normalized.values());
}

async function getDeletionRequestsByTargetEventIds(
    db: Pick<EHagakiDB, "postHistoryDeletionRequests">,
    targetEventIds: string[],
): Promise<Map<string, PostHistoryDeletionRequestRecord[]>> {
    if (targetEventIds.length === 0) {
        return new Map();
    }

    const records = await db.postHistoryDeletionRequests
        .where("targetEventId")
        .anyOf(targetEventIds)
        .toArray();
    const grouped = new Map<string, PostHistoryDeletionRequestRecord[]>();

    for (const record of records) {
        const existing = grouped.get(record.targetEventId);
        if (existing) {
            existing.push(record);
            continue;
        }

        grouped.set(record.targetEventId, [record]);
    }

    return grouped;
}

function areMediaArraysEqual(left: PostHistoryMediaRecord[], right: PostHistoryMediaRecord[]): boolean {
    if (left.length !== right.length) {
        return false;
    }

    return left.every((item, index) => {
        const target = right[index];
        return item.url === target.url
            && item.mimeType === target.mimeType
            && item.alt === target.alt
            && item.blurhash === target.blurhash
            && item.dim === target.dim
            && item.size === target.size
            && item.uploadProtocol === target.uploadProtocol;
    });
}

function hasMaterialPostHistoryChanges(
    existingRecord: PostHistoryRecord,
    nextRecord: PostHistoryRecord,
): boolean {
    return existingRecord.kind !== nextRecord.kind
        || existingRecord.content !== nextRecord.content
        || existingRecord.createdAt !== nextRecord.createdAt
        || existingRecord.postedAt !== nextRecord.postedAt
        || existingRecord.deletedAt !== nextRecord.deletedAt
        || existingRecord.deletionEventId !== nextRecord.deletionEventId
        || existingRecord.channelEventId !== nextRecord.channelEventId
        || !isSameSignedNostrEvent(existingRecord.rawEvent, nextRecord.rawEvent as NostrEvent)
        || !areStringArraysEqual(existingRecord.relayHints, nextRecord.relayHints)
        || !areStringArraysEqual(existingRecord.acceptedRelays, nextRecord.acceptedRelays)
        || !areStringArraysEqual(existingRecord.fetchedRelays, nextRecord.fetchedRelays)
        || !areStringArraysEqual(existingRecord.channelRelayHints, nextRecord.channelRelayHints)
        || !areMediaArraysEqual(existingRecord.media, nextRecord.media)
        || existingRecord.tags.length !== nextRecord.tags.length
        || existingRecord.tags.some((tag, index) => !areStringArraysEqual(tag, nextRecord.tags[index]));
}

export class DexiePostHistoryRepository implements PostHistoryRepository {
    constructor(
        private db: EHagakiDB = ehagakiDb,
        private now: () => number = Date.now,
        private console: Console = typeof globalThis.console !== "undefined"
            ? globalThis.console
            : { log: () => undefined, warn: () => undefined, error: () => undefined } as Console,
    ) { }

    async getByEventId(eventId: string): Promise<PostHistoryRecord | null> {
        if (!eventId) return null;

        return await this.db.postHistory.get(eventId) ?? null;
    }

    async getExistingEventIdsForPubkey(input: {
        pubkeyHex: string | null | undefined;
        eventIds: string[];
    }): Promise<string[]> {
        if (!input.pubkeyHex || input.eventIds.length === 0) {
            return [];
        }

        const eventIds = Array.from(new Set(input.eventIds.filter((eventId) => !!eventId)));
        const records = await this.db.postHistory.bulkGet(eventIds);

        return records
            .filter((record): record is PostHistoryRecord =>
                !!record && record.pubkeyHex === input.pubkeyHex
            )
            .map((record) => record.eventId);
    }

    async getAll(options: PostHistoryRepositoryOptions): Promise<PostHistoryRecord[]> {
        if (!options.pubkeyHex) return [];

        const records = await this.db.postHistory
            .where("[pubkeyHex+postedAt]")
            .between([options.pubkeyHex, Dexie.minKey], [options.pubkeyHex, Dexie.maxKey])
            .reverse()
            .toArray();

        return sortPostHistoryRecords(records);
    }

    async getPage(options: PostHistoryPageOptions): Promise<PostHistoryRecord[]> {
        if (!options.pubkeyHex) return [];

        const page = normalizePageNumber(options.page);
        const pageSize = normalizePageSize(options.pageSize);
        const bounds = getTimelineBounds(options.pubkeyHex);

        return this.db.postHistory
            .where(POST_HISTORY_TIMELINE_INDEX)
            .between(bounds.lower, bounds.upper)
            .reverse()
            .offset((page - 1) * pageSize)
            .limit(pageSize)
            .toArray();
    }

    async getLatestVisibleChunk(
        options: PostHistoryVisibleChunkOptions,
    ): Promise<PostHistoryRecord[]> {
        if (!options.pubkeyHex) return [];

        const limit = normalizeChunkLimit(options.limit);
        const visibleUntil = normalizeVisibleUntil(options.visibleUntil);
        const bounds = getTimelineBounds(options.pubkeyHex);

        return this.db.postHistory
            .where(POST_HISTORY_TIMELINE_INDEX)
            .between(bounds.lower, bounds.upper)
            .reverse()
            .filter((record) => matchesVisibleUntil(record, visibleUntil))
            .limit(limit)
            .toArray();
    }

    async getOlderVisibleChunk(
        options: PostHistoryVisibleChunkCursorOptions,
    ): Promise<PostHistoryRecord[]> {
        if (!options.pubkeyHex) return [];

        const limit = normalizeChunkLimit(options.limit);
        const visibleUntil = normalizeVisibleUntil(options.visibleUntil);
        const bounds = getTimelineBounds(options.pubkeyHex);
        const cursorKey = toTimelineKey(options.pubkeyHex, options.cursor);

        return this.db.postHistory
            .where(POST_HISTORY_TIMELINE_INDEX)
            .between(bounds.lower, cursorKey, true, false)
            .reverse()
            .filter((record) => matchesVisibleUntil(record, visibleUntil))
            .limit(limit)
            .toArray();
    }

    async getNewerVisibleChunk(
        options: PostHistoryVisibleChunkCursorOptions,
    ): Promise<PostHistoryRecord[]> {
        if (!options.pubkeyHex) return [];

        const limit = normalizeChunkLimit(options.limit);
        const visibleUntil = normalizeVisibleUntil(options.visibleUntil);
        const bounds = getTimelineBounds(options.pubkeyHex);
        const cursorKey = toTimelineKey(options.pubkeyHex, options.cursor);

        const records = await this.db.postHistory
            .where(POST_HISTORY_TIMELINE_INDEX)
            .between(cursorKey, bounds.upper, false, true)
            .filter((record) => matchesVisibleUntil(record, visibleUntil))
            .limit(limit)
            .toArray();

        return records.reverse();
    }

    async getVisibleChunkFromCreatedAt(
        options: PostHistoryVisibleChunkFromCreatedAtOptions,
    ): Promise<PostHistoryRecord[]> {
        if (!options.pubkeyHex) return [];

        const limit = normalizeChunkLimit(options.limit);
        const targetCreatedAt = normalizeCreatedAtValue(options.createdAt);
        const query = normalizePostHistoryDateChunkQuery(options.query);
        const visibleUntil = query.contiguous
            ? normalizeVisibleUntil(options.visibleUntil)
            : null;
        const bounds = getTimelineBounds(options.pubkeyHex);

        return this.db.transaction("r", this.db.postHistory, async () => {
            const anchor = await this.db.postHistory
                .where(POST_HISTORY_TIMELINE_INDEX)
                .between(bounds.lower, bounds.upper)
                .reverse()
                .filter((record) =>
                    matchesVisibleUntil(record, visibleUntil)
                    && record.createdAt <= targetCreatedAt
                )
                .first();

            if (!anchor) {
                const oldestRecords = await this.db.postHistory
                    .where(POST_HISTORY_TIMELINE_INDEX)
                    .between(bounds.lower, bounds.upper)
                    .filter((record) => matchesVisibleUntil(record, visibleUntil))
                    .limit(limit)
                    .toArray();

                return oldestRecords.reverse();
            }

            if (limit === 1) {
                return [anchor];
            }

            const olderRecords = await this.db.postHistory
                .where(POST_HISTORY_TIMELINE_INDEX)
                .between(bounds.lower, toTimelineKey(options.pubkeyHex!, anchor), true, false)
                .reverse()
                .filter((record) => matchesVisibleUntil(record, visibleUntil))
                .limit(limit - 1)
                .toArray();

            return [anchor, ...olderRecords];
        });
    }

    async getVisibleChunkAroundEventId(
        options: PostHistoryVisibleChunkAroundEventIdOptions,
    ): Promise<PostHistoryRecord[]> {
        if (!options.pubkeyHex) return [];

        const limit = normalizeChunkLimit(options.limit);
        const keepAbove = Number.isFinite(options.keepAbove)
            ? Math.min(limit - 1, Math.max(0, Math.trunc(options.keepAbove ?? 0)))
            : 0;
        const visibleUntil = normalizeVisibleUntil(options.visibleUntil);
        const bounds = getTimelineBounds(options.pubkeyHex);

        return this.db.transaction("r", this.db.postHistory, async () => {
            const anchor = await this.db.postHistory.get(options.eventId);
            if (
                !anchor
                || anchor.pubkeyHex !== options.pubkeyHex
                || !matchesVisibleUntil(anchor, visibleUntil)
            ) {
                return [];
            }

            const anchorKey = toTimelineKey(options.pubkeyHex!, anchor);
            const newerAscending = keepAbove === 0
                ? []
                : await this.db.postHistory
                    .where(POST_HISTORY_TIMELINE_INDEX)
                    .between(anchorKey, bounds.upper, false, true)
                    .filter((record) => matchesVisibleUntil(record, visibleUntil))
                    .limit(keepAbove)
                    .toArray();
            const olderLimit = limit - 1 - newerAscending.length;
            const olderRecords = olderLimit === 0
                ? []
                : await this.db.postHistory
                    .where(POST_HISTORY_TIMELINE_INDEX)
                    .between(bounds.lower, anchorKey, true, false)
                    .reverse()
                    .filter((record) => matchesVisibleUntil(record, visibleUntil))
                    .limit(olderLimit)
                    .toArray();
            const missingCount = limit - 1 - newerAscending.length - olderRecords.length;

            if (missingCount > 0) {
                const newerBoundary = newerAscending[newerAscending.length - 1] ?? anchor;
                const additionalNewer = await this.db.postHistory
                    .where(POST_HISTORY_TIMELINE_INDEX)
                    .between(
                        toTimelineKey(options.pubkeyHex!, newerBoundary),
                        bounds.upper,
                        false,
                        true,
                    )
                    .filter((record) => matchesVisibleUntil(record, visibleUntil))
                    .limit(missingCount)
                    .toArray();
                newerAscending.push(...additionalNewer);
            }

            return [
                ...newerAscending.reverse(),
                anchor,
                ...olderRecords,
            ];
        });
    }

    async hasPostsBeforeCreatedAt(
        pubkeyHex: string | null | undefined,
        createdAt: number,
    ): Promise<boolean> {
        if (!pubkeyHex || !Number.isFinite(createdAt)) return false;

        return await this.db.postHistory
            .where("[pubkeyHex+createdAt]")
            .between(
                [pubkeyHex, Dexie.minKey],
                [pubkeyHex, Math.trunc(createdAt)],
                true,
                false,
            )
            .limit(1)
            .count() > 0;
    }

    async getSparseChunk(
        options: PostHistorySparseChunkOptions,
    ): Promise<PostHistoryRecord[]> {
        if (!options.pubkeyHex || !Number.isFinite(options.visibleUntil)) {
            return [];
        }

        const limit = normalizeChunkLimit(options.limit);
        const visibleUntil = Math.trunc(options.visibleUntil);
        if (options.direction !== "latest" && !options.cursor) {
            return [];
        }

        const cursor = options.cursor;
        const matchesSparseRange = (record: PostHistoryRecord): boolean =>
            record.createdAt < visibleUntil
            && (
                options.direction === "latest"
                || (
                    options.direction === "older"
                    && !!cursor
                    && isOlderThanTimelineCursor(record, cursor)
                )
                || (
                    options.direction === "newer"
                    && !!cursor
                    && isNewerThanTimelineCursor(record, cursor)
                )
            );

        const lowerPostedAt = options.direction === "newer" && cursor
            ? cursor.postedAt
            : Dexie.minKey;
        const upperPostedAt = options.direction === "older" && cursor
            ? cursor.postedAt
            : Dexie.maxKey;
        const postedAtRange = this.db.postHistory
            .where("[pubkeyHex+postedAt]")
            .between(
                [options.pubkeyHex, lowerPostedAt],
                [options.pubkeyHex, upperPostedAt],
                true,
                true,
            );
        const candidates = await (
            options.direction === "newer"
                ? postedAtRange
                : postedAtRange.reverse()
        )
            .filter(matchesSparseRange)
            .limit(limit)
            .toArray();

        if (candidates.length === 0) {
            return [];
        }

        const boundaryPostedAt = candidates[candidates.length - 1]!.postedAt;
        const boundaryRecords = candidates.length < limit
            ? []
            : await this.db.postHistory
                .where("[pubkeyHex+postedAt]")
                .equals([options.pubkeyHex, boundaryPostedAt])
                .filter(matchesSparseRange)
                .toArray();
        const recordsByEventId = new Map<string, PostHistoryRecord>();
        for (const record of [...candidates, ...boundaryRecords]) {
            recordsByEventId.set(record.eventId, record);
        }
        const records = sortPostHistoryRecords(Array.from(recordsByEventId.values()));

        return options.direction === "newer"
            ? records.slice(Math.max(0, records.length - limit))
            : records.slice(0, limit);
    }

    async countForPubkey(pubkeyHex: string | null | undefined): Promise<number> {
        if (!pubkeyHex) return 0;

        return this.db.postHistory
            .where("pubkeyHex")
            .equals(pubkeyHex)
            .count();
    }

    async countVisibleForPubkey(pubkeyHex: string | null | undefined, visibleUntil?: number | null): Promise<number> {
        if (!pubkeyHex) return 0;

        const normalizedVisibleUntil = normalizeVisibleUntil(visibleUntil);
        if (normalizedVisibleUntil === null) {
            return this.countForPubkey(pubkeyHex);
        }

        return this.db.postHistory
            .where("[pubkeyHex+createdAt]")
            .between([pubkeyHex, normalizedVisibleUntil], [pubkeyHex, Dexie.maxKey])
            .count();
    }

    async putPostedEvent(input: PostHistorySaveInput): Promise<void> {
        await this.db.postHistory.put(toRecord(input, this.now));
        markPostHistoryShouldReturnToLatestAfterLocalPost({
            pubkeyHex: input.event.pubkey,
            eventId: input.event.id,
        });
    }

    async upsertFetchedEvents(input: PostHistoryUpsertFetchedEventsInput): Promise<PostHistoryUpsertFetchedEventsResult> {
        const normalizedItems = normalizeFetchedEventItems(input.events, this.console);
        if (normalizedItems.length === 0) {
            return {
                insertedCount: 0,
                updatedCount: 0,
                unchangedCount: 0,
                appliedDeletionCount: 0,
            };
        }

        const fetchedAt = input.fetchedAt ?? this.now();
        const eventIds = normalizedItems.map((item) => item.event.id);
        let insertedCount = 0;
        let updatedCount = 0;
        let unchangedCount = 0;
        let appliedDeletionCount = 0;

        await this.db.transaction(
            "rw",
            this.db.postHistory,
            this.db.postHistoryDeletionRequests,
            async () => {
                const existingRecords = await this.db.postHistory.bulkGet(eventIds);
                const existingMap = new Map<string, PostHistoryRecord>();
                const deletionRequestsByTargetEventId = await getDeletionRequestsByTargetEventIds(
                    this.db,
                    eventIds,
                );

                existingRecords.forEach((record) => {
                    if (record) {
                        existingMap.set(record.eventId, record);
                    }
                });

                const verifiedRequestUpdates: PostHistoryDeletionRequestRecord[] = [];
                const nextRecords = normalizedItems.map((item) => {
                    const existingRecord = existingMap.get(item.event.id);
                    const fetchedRelays = RelayConfigUtils.sanitizeExternalRelayUrls([
                        ...(existingRecord?.fetchedRelays ?? []),
                        ...item.relayUrls,
                    ]);
                    const rawEventChanged = !!existingRecord
                        && !isSameSignedNostrEvent(existingRecord.rawEvent, item.event);

                    if (rawEventChanged) {
                        this.console.warn("post_history_raw_event_conflict", item.event.id);
                    }

                    const channelReference = rawEventChanged && existingRecord
                        ? {
                            channelEventId: existingRecord.channelEventId,
                            channelRelayHints: existingRecord.channelRelayHints,
                        }
                        : extractPostHistoryChannelReference(item.event);
                    const relayHints = RelayConfigUtils.sanitizeExternalRelayUrls([
                        ...(existingRecord?.relayHints ?? []),
                        ...item.relayUrls,
                        ...(existingRecord?.acceptedRelays ?? []),
                    ], { limit: RelayConfigUtils.EXTERNAL_INPUT_RELAY_LIMIT });

                    const baseRecord = {
                        id: item.event.id,
                        eventId: item.event.id,
                        pubkeyHex: existingRecord?.pubkeyHex ?? item.event.pubkey,
                        kind: rawEventChanged && existingRecord ? existingRecord.kind : item.event.kind,
                        content: rawEventChanged && existingRecord ? existingRecord.content : item.event.content,
                        tags: rawEventChanged && existingRecord
                            ? existingRecord.tags.map((tag) => [...tag])
                            : item.event.tags.map((tag) => [...tag]),
                        createdAt: rawEventChanged && existingRecord ? existingRecord.createdAt : item.event.created_at,
                        postedAt: existingRecord?.postedAt ?? toPostedAtFromCreatedAt(item.event.created_at),
                        relayHints,
                        acceptedRelays: existingRecord?.acceptedRelays ?? [],
                        ...(fetchedRelays.length > 0 ? { fetchedRelays } : {}),
                        media: rawEventChanged && existingRecord
                            ? cloneMedia(existingRecord.media)
                            : extractPostHistoryMedia(item.event),
                        rawEvent: rawEventChanged && existingRecord
                            ? existingRecord.rawEvent
                            : cloneNostrEvent(item.event),
                        fetchedAt,
                        lastSeenAt: fetchedAt,
                        ...(channelReference.channelEventId
                            ? { channelEventId: channelReference.channelEventId }
                            : existingRecord?.channelEventId
                                ? { channelEventId: existingRecord.channelEventId }
                                : {}),
                        ...(channelReference.channelRelayHints
                            ? { channelRelayHints: channelReference.channelRelayHints }
                            : existingRecord?.channelRelayHints
                                ? { channelRelayHints: [...existingRecord.channelRelayHints] }
                                : {}),
                        ...(existingRecord?.deletedAt !== undefined ? { deletedAt: existingRecord.deletedAt } : {}),
                        ...(existingRecord?.deletionEventId
                            ? { deletionEventId: existingRecord.deletionEventId }
                            : {}),
                        updatedAt: this.now(),
                        schemaVersion: POST_HISTORY_SCHEMA_VERSION,
                    } satisfies PostHistoryRecord;

                    if (!existingRecord) {
                        insertedCount += 1;
                    } else if (hasMaterialPostHistoryChanges(existingRecord, baseRecord)) {
                        updatedCount += 1;
                    } else {
                        unchangedCount += 1;
                    }

                    const applicableRequests = (deletionRequestsByTargetEventId.get(item.event.id) ?? [])
                        .flatMap((request) => {
                            const targetMatches = isSupportedPostHistoryDeletionTargetKind(
                                baseRecord.kind,
                            )
                                && baseRecord.pubkeyHex === request.targetAuthorPubkey
                                && baseRecord.pubkeyHex === request.deletionEventPubkey;
                            if (!targetMatches) {
                                return [];
                            }

                            if (!isPostHistoryDeletionTargetVerified(request)) {
                                const verifiedRequest = {
                                    ...request,
                                    targetVerified: true,
                                    updatedAt: this.now(),
                                    schemaVersion: POST_HISTORY_DELETION_REQUEST_SCHEMA_VERSION,
                                } satisfies PostHistoryDeletionRequestRecord;
                                verifiedRequestUpdates.push(verifiedRequest);
                                return [verifiedRequest];
                            }

                            return [request];
                        })
                        .sort(comparePostHistoryDeletionRequests);
                    if (baseRecord.deletedAt !== undefined || applicableRequests.length === 0) {
                        return baseRecord;
                    }

                    appliedDeletionCount += 1;
                    return {
                        ...baseRecord,
                        ...toPostHistoryDeletionState(applicableRequests[0]),
                        updatedAt: this.now(),
                    } satisfies PostHistoryRecord;
                });

                if (verifiedRequestUpdates.length > 0) {
                    await this.db.postHistoryDeletionRequests.bulkPut(verifiedRequestUpdates);
                }
                await this.db.postHistory.bulkPut(nextRecords);
            },
        );

        return {
            insertedCount,
            updatedCount,
            unchangedCount,
            appliedDeletionCount,
        };
    }

    async getOldestCreatedAt(pubkeyHex: string | null | undefined): Promise<number | null> {
        if (!pubkeyHex) return null;

        const oldestRecord = await this.db.postHistory
            .where("[pubkeyHex+createdAt]")
            .between([pubkeyHex, Dexie.minKey], [pubkeyHex, Dexie.maxKey])
            .first();

        return oldestRecord?.createdAt ?? null;
    }

    async markDeleted(eventId: string, deletionEventId: string, deletedAt: number = this.now()): Promise<void> {
        await this.db.postHistory.update(eventId, {
            deletedAt,
            deletionEventId,
            updatedAt: this.now(),
        });
    }

    async deleteForPubkey(pubkeyHex: string | null | undefined): Promise<void> {
        if (!pubkeyHex) return;

        await this.db.postHistory
            .where("pubkeyHex")
            .equals(pubkeyHex)
            .delete();
    }
}

export const postHistoryRepository = new DexiePostHistoryRepository();
