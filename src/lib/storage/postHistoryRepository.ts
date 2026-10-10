import Dexie, { cmp } from "dexie";
import { isPostHistoryAuthoredKind } from "../postHistoryKinds";
import { createRepostTargetSnapshot, getRepostReference } from "../postRepostUtils";
import {
    cloneNostrEvent,
    extractPostHistoryChannelReference,
    isSameSignedNostrEvent,
    isPostHistoryRawEventConsistent,
} from "../postHistoryEventUtils";
import {
    comparePostHistoryDeletionRequests,
    isPostHistoryDeletionTargetVerified,
    isSupportedPostHistoryDeletionTargetKind,
    POST_HISTORY_DELETION_REQUEST_SCHEMA_VERSION,
    toPostHistoryDeletionState,
} from "../postHistoryDeletionUtils";
import { markPostHistoryShouldReturnToLatestAfterLocalPost } from "../postHistoryLatestRequest";
import { bumpPostHistorySearchRevision } from "../postHistoryLocalSearchRevision";
import { extractPostHistoryMedia } from "../postHistoryMediaUtils";
import { RelayConfigUtils } from "../relayConfigUtils";
import {
    attestFullyVerifiedPostHistoryRawEvent,
    isCurrentPostHistoryRawEventAttestation,
    RAW_EVENT_VERIFICATION_RULE_VERSION,
    type PostHistoryRawEventAttestation,
    type RawEventVerificationState,
} from "../postHistoryRawEventVerification";
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
import { DexiePostHistoryRelayCoverageRepository, PostHistoryCoverageStaleError, type PostHistoryCoverageWrite } from "./postHistoryRelayCoverageRepository";
import { reconcileSensitivePayloadDeletionForStructure } from "./sensitivePayloadDeletionReconciler";
import { assertPostHistoryLocalWriteCurrent, PostHistoryLocalWriteStaleError, type PostHistoryLocalWriteScope } from "./postHistoryLocalWriteScope";

export const POST_HISTORY_SCHEMA_VERSION = 2;

export type PostHistorySaveInput = {
    event: NostrEvent;
    attestation?: PostHistoryRawEventAttestation;
    acceptedRelays?: string[];
    relayHints?: string[];
    postedAt?: number;
    repostTarget?: { event: NostrEvent; relayHints?: string[] };
    localWriteScope?: PostHistoryLocalWriteScope;
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

export type PostHistoryOlderVisiblePostsOptions = PostHistoryVisibleQueryOptions & {
    cursor: PostHistoryTimelineCursor;
};

export type PostHistoryVisibleChunkFromCreatedAtOptions =
    PostHistoryVisibleChunkOptions & {
        createdAt: number;
        query?: PostHistoryDateChunkQuery;
    };

export type PostHistoryOldestVisibleChunkOptions =
    PostHistoryVisibleChunkOptions & {
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
    attestation?: PostHistoryRawEventAttestation;
    relayUrls?: string[];
};

export type PostHistoryUpsertFetchedEventsInput = {
    events: PostHistoryFetchedEventItem[];
    fetchedAt?: number;
    relayFetchCoverage?: PostHistoryCoverageWrite;
    localWriteScope?: PostHistoryLocalWriteScope;
};

export type PostHistoryUpsertFetchedEventsResult = {
    insertedCount: number;
    updatedCount: number;
    unchangedCount: number;
    appliedDeletionCount: number;
    /** False when a scoped authored fetch was invalidated before commit. */
    applied?: boolean;
};

export type PostHistoryRepositoryOptions = {
    pubkeyHex?: string | null;
};

export type PostHistorySearchScanChunkOptions = PostHistoryRepositoryOptions & {
    cursor?: PostHistoryTimelineCursor;
    limit: number;
};

export interface PostHistorySearchScanChunk {
    items: PostHistoryRecord[];
    nextCursor: PostHistoryTimelineCursor | null;
    hasMore: boolean;
}

export interface PostHistoryRepository {
    getByEventId(eventId: string): Promise<PostHistoryRecord | null>;
    getExistingEventIdsForPubkey(input: {
        pubkeyHex: string | null | undefined;
        eventIds: string[];
    }): Promise<string[]>;
    getAll(options: PostHistoryRepositoryOptions): Promise<PostHistoryRecord[]>;
    getSearchScanChunk(options: PostHistorySearchScanChunkOptions): Promise<PostHistorySearchScanChunk>;
    getPage(options: PostHistoryPageOptions): Promise<PostHistoryRecord[]>;
    getLatestVisibleChunk(options: PostHistoryVisibleChunkOptions): Promise<PostHistoryRecord[]>;
    getOlderVisibleChunk(options: PostHistoryVisibleChunkCursorOptions): Promise<PostHistoryRecord[]>;
    hasOlderVisiblePosts(options: PostHistoryOlderVisiblePostsOptions): Promise<boolean>;
    getNewerVisibleChunk(options: PostHistoryVisibleChunkCursorOptions): Promise<PostHistoryRecord[]>;
    getOldestVisibleChunk(options: PostHistoryOldestVisibleChunkOptions): Promise<PostHistoryRecord[]>;
    getVisibleChunkFromCreatedAt(options: PostHistoryVisibleChunkFromCreatedAtOptions): Promise<PostHistoryRecord[]>;
    getVisibleChunkAroundEventId(options: PostHistoryVisibleChunkAroundEventIdOptions): Promise<PostHistoryRecord[]>;
    hasPostsBeforeCreatedAt(pubkeyHex: string | null | undefined, createdAt: number): Promise<boolean>;
    getSparseChunk(options: PostHistorySparseChunkOptions): Promise<PostHistoryRecord[]>;
    countForPubkey(pubkeyHex: string | null | undefined): Promise<number>;
    countVisibleForPubkey(pubkeyHex: string | null | undefined, visibleUntil?: number | null): Promise<number>;
    putPostedEvent(input: PostHistorySaveInput): Promise<void>;
    attachRepostTarget(input: { outerEventId: string; target: NostrEvent; relayHints?: string[]; localWriteScope: PostHistoryLocalWriteScope }): Promise<boolean>;
    upsertFetchedEvents(input: PostHistoryUpsertFetchedEventsInput): Promise<PostHistoryUpsertFetchedEventsResult>;
    getOldestCreatedAt(pubkeyHex: string | null | undefined): Promise<number | null>;
    markDeleted(eventId: string, deletionEventId: string, deletedAt?: number): Promise<void>;
    deleteForPubkey(pubkeyHex: string | null | undefined): Promise<void>;
    deleteLocalHistoryForPubkey(pubkeyHex: string | null | undefined): Promise<void>;
}

type NormalizedFetchedEventItem = {
    event: NostrEvent;
    attestation?: PostHistoryRawEventAttestation;
    relayUrls: string[];
};

const VALID_RAW_EVENT_VERIFICATION: RawEventVerificationState = {
    status: "valid",
    ruleVersion: RAW_EVENT_VERIFICATION_RULE_VERSION,
};

function isCurrentValidRawEventVerification(
    verification: PostHistoryRecord["rawEventVerification"],
): boolean {
    return verification?.status === "valid"
        && verification.ruleVersion === RAW_EVENT_VERIFICATION_RULE_VERSION;
}

function ensureAttestedEvent(
    event: NostrEvent,
    attestation: PostHistoryRawEventAttestation | undefined,
): { event: NostrEvent; attestation: PostHistoryRawEventAttestation } | null {
    if (isCurrentPostHistoryRawEventAttestation(event, attestation)) {
        return { event, attestation: attestation! };
    }

    return attestFullyVerifiedPostHistoryRawEvent(event);
}

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

function isSupportedPost(record: PostHistoryRecord): boolean {
    return isPostHistoryAuthoredKind(record.kind);
}

function matchesVisibleUntil(
    record: PostHistoryRecord,
    visibleUntil: number | null,
): boolean {
    return isSupportedPost(record) && (visibleUntil === null || record.createdAt >= visibleUntil);
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
        media: event.kind === 6 ? [] : extractPostHistoryMedia(event),
        rawEvent: cloneNostrEvent(event),
        rawEventVerification: { ...VALID_RAW_EVENT_VERIFICATION },
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
                ...(item.attestation ? { attestation: item.attestation } : {}),
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
        if (!existing.attestation && item.attestation) {
            existing.attestation = item.attestation;
        }
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
        || existingRecord.rawEventVerification?.status
            !== nextRecord.rawEventVerification?.status
        || existingRecord.rawEventVerification?.ruleVersion
            !== nextRecord.rawEventVerification?.ruleVersion
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

        const record = await this.db.postHistory.get(eventId);
        return record && isSupportedPost(record) ? record : null;
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
                !!record && isSupportedPost(record) && record.pubkeyHex === input.pubkeyHex
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

        return sortPostHistoryRecords(records.filter(isSupportedPost));
    }

    async getSearchScanChunk(
        options: PostHistorySearchScanChunkOptions,
    ): Promise<PostHistorySearchScanChunk> {
        if (!options.pubkeyHex) return { items: [], nextCursor: null, hasMore: false };

        const limit = normalizeChunkLimit(options.limit);
        const bounds = getTimelineBounds(options.pubkeyHex);
        const upper = options.cursor
            ? toTimelineKey(options.pubkeyHex, options.cursor)
            : bounds.upper;
        // Apply kind filtering after the bounded read so Dexie can use getAll.
        // The continuation belongs to the raw batch, including unsupported kinds.
        const records = await this.db.postHistory
            .where(POST_HISTORY_TIMELINE_INDEX)
            .between(bounds.lower, upper, true, !options.cursor)
            .reverse()
            .limit(limit)
            .toArray();
        const last = records.at(-1);

        return {
            items: records.filter(isSupportedPost),
            nextCursor: last
                ? { postedAt: last.postedAt, createdAt: last.createdAt, eventId: last.eventId }
                : null,
            hasMore: records.length === limit,
        };
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
            .filter(isSupportedPost)
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

    async hasOlderVisiblePosts(options: PostHistoryOlderVisiblePostsOptions): Promise<boolean> {
        if (!options.pubkeyHex) return false;

        const visibleUntil = normalizeVisibleUntil(options.visibleUntil);
        const older = this.db.postHistory
            .where(POST_HISTORY_TIMELINE_INDEX)
            .between(getTimelineBounds(options.pubkeyHex).lower,
                toTimelineKey(options.pubkeyHex, options.cursor), true, false);
        let collection = older;
        if (visibleUntil !== null) {
            const visible = this.db.postHistory
                .where("[pubkeyHex+createdAt]")
                .between([options.pubkeyHex, visibleUntil], [options.pubkeyHex, Dexie.maxKey]);
            // Unfiltered counts use IndexedDB's index keys, without loading post
            // bodies. Check the smaller side of the intersection: avoid scanning
            // either a large saved tail or a large already-visible history.
            const [olderCount, visibleCount] = await Promise.all([older.count(), visible.count()]);
            if (olderCount === 0 || visibleCount === 0) return false;
            collection = visibleCount <= olderCount ? visible : older;
        }

        return (await collection
            .filter((record) => matchesVisibleUntil(record, visibleUntil) && isOlderThanTimelineCursor(record, options.cursor))
            .first()) !== undefined;
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

    async getOldestVisibleChunk(
        options: PostHistoryOldestVisibleChunkOptions,
    ): Promise<PostHistoryRecord[]> {
        if (!options.pubkeyHex) return [];

        const limit = normalizeChunkLimit(options.limit);
        const query = normalizePostHistoryDateChunkQuery(options.query);
        const visibleUntil = query.contiguous
            ? normalizeVisibleUntil(options.visibleUntil)
            : null;
        const bounds = getTimelineBounds(options.pubkeyHex);
        if (visibleUntil !== null) {
            const visibleRecords = await this.db.postHistory
                .where("[pubkeyHex+createdAt]")
                .between(
                    [options.pubkeyHex, visibleUntil],
                    [options.pubkeyHex, Dexie.maxKey],
                )
                .toArray();

            return visibleRecords.filter(isSupportedPost)
                .sort(comparePostHistoryTimelineOrder)
                .slice(-limit);
        }

        const oldestRecords = await this.db.postHistory
            .where(POST_HISTORY_TIMELINE_INDEX)
            .between(bounds.lower, bounds.upper)
            .filter(isSupportedPost)
            .limit(limit)
            .toArray();

        return oldestRecords.reverse();
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
            .filter(isSupportedPost)
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
            isSupportedPost(record) && record.createdAt < visibleUntil
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

        const bounds = getTimelineBounds(options.pubkeyHex);
        const cursorKey = cursor
            ? toTimelineKey(options.pubkeyHex, cursor)
            : null;
        const range = options.direction === "latest"
            ? this.db.postHistory
                .where(POST_HISTORY_TIMELINE_INDEX)
                .between(bounds.lower, bounds.upper)
            : options.direction === "older"
                ? this.db.postHistory
                    .where(POST_HISTORY_TIMELINE_INDEX)
                    .between(bounds.lower, cursorKey!, true, false)
                : this.db.postHistory
                    .where(POST_HISTORY_TIMELINE_INDEX)
                    .between(cursorKey!, bounds.upper, false, true);

        const records = await (
            options.direction === "newer"
                ? range
                : range.reverse()
        )
            .filter(matchesSparseRange)
            .limit(limit)
            .toArray();

        // The timeline index already contains the complete tie-breaker. Keep
        // the display order (newest first) while avoiding a second same-
        // postedAt group scan and JavaScript-side re-sort.
        return options.direction === "newer"
            ? records.reverse()
            : records;
    }

    async countForPubkey(pubkeyHex: string | null | undefined): Promise<number> {
        if (!pubkeyHex) return 0;

        return this.db.postHistory
            .where("pubkeyHex")
            .equals(pubkeyHex)
            .filter(isSupportedPost)
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
            .filter(isSupportedPost)
            .count();
    }

    async putPostedEvent(input: PostHistorySaveInput): Promise<void> {
        const verified = ensureAttestedEvent(input.event, input.attestation);
        if (!verified) {
            throw new Error("invalid_post_history_raw_event");
        }

        const reference = getRepostReference(verified.event);
        const target = input.repostTarget
            ? reference && createRepostTargetSnapshot(input.repostTarget.event, input.repostTarget.relayHints, reference)
            : null;
        if (input.repostTarget && !target) throw new Error("invalid_repost_target");
        if (input.localWriteScope && input.localWriteScope.ownerPubkeyHex !== verified.event.pubkey) {
            throw new Error("invalid_post_history_owner");
        }
        await this.db.transaction("rw", this.db.postHistory, this.db.meta, async () => {
            await assertPostHistoryLocalWriteCurrent(this.db, input.localWriteScope);
            const existing = await this.db.postHistory.get(verified.event.id);
            await this.db.postHistory.put({ ...toRecord({ ...input, event: verified.event }, this.now),
                ...(verified.event.kind === 6 && existing ? {
                    postedAt: existing.postedAt, fetchedRelays: existing.fetchedRelays,
                    deletedAt: existing.deletedAt, deletionEventId: existing.deletionEventId,
                } : {}),
                ...(target ? { repostTarget: target } : existing?.repostTarget && reference
                    && createRepostTargetSnapshot(existing.repostTarget.rawEvent, existing.repostTarget.relayHints, reference)
                    ? { repostTarget: existing.repostTarget } : {}) });
            await assertPostHistoryLocalWriteCurrent(this.db, input.localWriteScope);
        });
        bumpPostHistorySearchRevision(verified.event.pubkey);
        markPostHistoryShouldReturnToLatestAfterLocalPost({
            pubkeyHex: verified.event.pubkey,
            eventId: verified.event.id,
        });
    }

    async attachRepostTarget(input: { outerEventId: string; target: NostrEvent; relayHints?: string[]; localWriteScope: PostHistoryLocalWriteScope }): Promise<boolean> {
        let changed = false;
        await this.db.transaction("rw", this.db.postHistory, this.db.meta, async () => {
            await assertPostHistoryLocalWriteCurrent(this.db, input.localWriteScope);
            const outer = await this.db.postHistory.get(input.outerEventId);
            if (!outer || outer.pubkeyHex !== input.localWriteScope.ownerPubkeyHex || outer.deletedAt !== undefined) return;
            if (!isPostHistoryRawEventConsistent(outer.rawEvent, outer) || !attestFullyVerifiedPostHistoryRawEvent(outer.rawEvent)) return;
            const reference = getRepostReference(outer);
            if (!reference) return;
            const target = createRepostTargetSnapshot(input.target, input.relayHints, reference);
            if (!target) throw new Error("invalid_repost_target");
            if (outer.repostTarget && isSameSignedNostrEvent(outer.repostTarget.rawEvent, target.rawEvent)
                && areStringArraysEqual(outer.repostTarget.relayHints, target.relayHints)) return;
            await this.db.postHistory.update(outer.id, { repostTarget: target, updatedAt: this.now() });
            await assertPostHistoryLocalWriteCurrent(this.db, input.localWriteScope);
            changed = true;
        });
        if (changed) bumpPostHistorySearchRevision(input.localWriteScope.ownerPubkeyHex);
        return changed;
    }

    async upsertFetchedEvents(input: PostHistoryUpsertFetchedEventsInput): Promise<PostHistoryUpsertFetchedEventsResult> {
        const normalizedItems = normalizeFetchedEventItems(input.events, this.console)
            .flatMap((item) => {
                const verified = ensureAttestedEvent(item.event, item.attestation);
                if (!verified) {
                    this.console.warn("post_history_invalid_fetched_event", item.event.id);
                    return [];
                }

                return [{ ...item, event: verified.event, attestation: verified.attestation }];
            });
        if (normalizedItems.length === 0 && !input.relayFetchCoverage && !input.localWriteScope) {
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
        const changedPubkeys = new Set<string>();

        const coverageRepository = new DexiePostHistoryRelayCoverageRepository(this.db, this.now);
        try {
            await this.db.transaction(
                "rw",
                [this.db.postHistory, this.db.postHistoryDeletionRequests, this.db.sensitivePayloads,
                    ...(input.relayFetchCoverage || input.localWriteScope ? [this.db.meta] : [])],
                async () => {
                    await assertPostHistoryLocalWriteCurrent(this.db, input.localWriteScope);
                    if (input.relayFetchCoverage && !await coverageRepository.isCurrent(input.relayFetchCoverage)) {
                        throw new PostHistoryCoverageStaleError();
                    }
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
                        const replaceRawEvent = !existingRecord
                            || !rawEventChanged
                            || !isCurrentValidRawEventVerification(
                                existingRecord.rawEventVerification,
                            );

                        if (rawEventChanged) {
                            this.console.warn("post_history_raw_event_conflict", item.event.id);
                        }

                        const channelReference = !replaceRawEvent && existingRecord
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
                            kind: !replaceRawEvent && existingRecord ? existingRecord.kind : item.event.kind,
                            content: !replaceRawEvent && existingRecord ? existingRecord.content : item.event.content,
                            tags: !replaceRawEvent && existingRecord
                                ? existingRecord.tags.map((tag) => [...tag])
                                : item.event.tags.map((tag) => [...tag]),
                            createdAt: !replaceRawEvent && existingRecord ? existingRecord.createdAt : item.event.created_at,
                            postedAt: existingRecord?.postedAt ?? toPostedAtFromCreatedAt(item.event.created_at),
                            relayHints,
                            acceptedRelays: existingRecord?.acceptedRelays ?? [],
                            ...(fetchedRelays.length > 0 ? { fetchedRelays } : {}),
                            media: item.event.kind === 6 ? [] : !replaceRawEvent && existingRecord
                                ? cloneMedia(existingRecord.media)
                                : extractPostHistoryMedia(item.event),
                            rawEvent: !replaceRawEvent && existingRecord
                                ? existingRecord.rawEvent
                                : cloneNostrEvent(item.event),
                            rawEventVerification: !replaceRawEvent && existingRecord
                                ? existingRecord.rawEventVerification
                                : { ...VALID_RAW_EVENT_VERIFICATION },
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
                            ...(existingRecord?.repostTarget && getRepostReference(item.event)
                                && createRepostTargetSnapshot(existingRecord.repostTarget.rawEvent, existingRecord.repostTarget.relayHints, getRepostReference(item.event))
                                ? { repostTarget: existingRecord.repostTarget } : {}),
                            schemaVersion: POST_HISTORY_SCHEMA_VERSION,
                        } satisfies PostHistoryRecord;

                        let didMateriallyChange = false;
                        if (!existingRecord) {
                            insertedCount += 1;
                            didMateriallyChange = true;
                        } else if (hasMaterialPostHistoryChanges(existingRecord, baseRecord)) {
                            updatedCount += 1;
                            didMateriallyChange = true;
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
                            if (didMateriallyChange) {
                                changedPubkeys.add(baseRecord.pubkeyHex);
                            }
                            return baseRecord;
                        }

                        appliedDeletionCount += 1;
                        changedPubkeys.add(baseRecord.pubkeyHex);
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
                    if (input.relayFetchCoverage) {
                        await coverageRepository.record(input.relayFetchCoverage);
                        if (!await coverageRepository.isCurrent(input.relayFetchCoverage)) throw new PostHistoryCoverageStaleError();
                    }
                    await assertPostHistoryLocalWriteCurrent(this.db, input.localWriteScope);
                },
            );

        } catch (error) {
            if (error instanceof PostHistoryLocalWriteStaleError) return {
                insertedCount: 0, updatedCount: 0, unchangedCount: 0, appliedDeletionCount: 0, applied: false,
            };
            throw error;
        }

        for (const item of normalizedItems) {
            try {
                await reconcileSensitivePayloadDeletionForStructure(
                    item.event.id,
                    this.db,
                    this.now,
                );
            } catch {
                this.console.warn(
                    "post_history_sensitive_payload_deletion_reconcile_failed",
                    item.event.id,
                );
            }
        }

        changedPubkeys.forEach(bumpPostHistorySearchRevision);

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
            .filter(isSupportedPost)
            .first();

        return oldestRecord?.createdAt ?? null;
    }

    async markDeleted(eventId: string, deletionEventId: string, deletedAt: number = this.now()): Promise<void> {
        let changedPubkeyHex: string | null = null;
        await this.db.transaction("rw", this.db.postHistory, async () => {
            const record = await this.db.postHistory.get(eventId);
            if (
                !record
                || (
                    record.deletedAt === deletedAt
                    && record.deletionEventId === deletionEventId
                )
            ) {
                return;
            }

            await this.db.postHistory.put({
                ...record,
                deletedAt,
                deletionEventId,
                updatedAt: this.now(),
            });
            changedPubkeyHex = record.pubkeyHex;
        });

        if (changedPubkeyHex) {
            bumpPostHistorySearchRevision(changedPubkeyHex);
        }
    }

    async deleteForPubkey(pubkeyHex: string | null | undefined): Promise<void> {
        if (!pubkeyHex) return;

        const deletedCount = await this.db.transaction("rw", this.db.postHistory, this.db.meta, async () => {
            await new DexiePostHistoryRelayCoverageRepository(this.db, this.now).clearForPubkey(pubkeyHex);
            return this.db.postHistory.where("pubkeyHex").equals(pubkeyHex).delete();
        });
        if (deletedCount > 0) {
            bumpPostHistorySearchRevision(pubkeyHex);
        }
    }

    async deleteLocalHistoryForPubkey(
        pubkeyHex: string | null | undefined,
    ): Promise<void> {
        if (!pubkeyHex) return;

        let deletedPostHistoryCount = 0;
        let deletedPayloadCount = 0;
        await this.db.transaction(
            "rw",
            this.db.postHistory,
            this.db.postHistoryChildInteractions,
            this.db.sensitivePayloads,
            this.db.meta,
            async () => {
                await new DexiePostHistoryRelayCoverageRepository(this.db, this.now).clearForPubkey(pubkeyHex);
                deletedPayloadCount = await this.db.sensitivePayloads
                    .where("pubkeyHex")
                    .equals(pubkeyHex)
                    .delete();
                const firstPostHistoryRecord = await this.db.postHistory
                    .orderBy("pubkeyHex")
                    .first();
                if (!firstPostHistoryRecord) {
                    return;
                }

                const lastPostHistoryRecord = await this.db.postHistory
                    .orderBy("pubkeyHex")
                    .last();
                const canClearEntirePostHistory =
                    firstPostHistoryRecord.pubkeyHex === pubkeyHex
                    && lastPostHistoryRecord?.pubkeyHex === pubkeyHex;

                if (canClearEntirePostHistory) {
                    await this.db.postHistoryChildInteractions.clear();
                    await this.db.postHistory.clear();
                    // The first record proved that at least one record existed.
                    deletedPostHistoryCount = 1;
                    return;
                }

                const parentEventIds = (await this.db.postHistory
                    .where("pubkeyHex")
                    .equals(pubkeyHex)
                    .primaryKeys()).map(String);

                if (parentEventIds.length > 0) {
                    await this.db.postHistoryChildInteractions
                        .where("parentEventId")
                        .anyOf(parentEventIds)
                        .delete();
                }

                deletedPostHistoryCount = await this.db.postHistory
                    .where("pubkeyHex")
                    .equals(pubkeyHex)
                    .delete();
            },
        );

        // Keep the search revision outside the transaction so it only advances
        // after IndexedDB has committed successfully.
        if (deletedPostHistoryCount > 0 || deletedPayloadCount > 0) {
            bumpPostHistorySearchRevision(pubkeyHex);
        }
    }
}

export const postHistoryRepository = new DexiePostHistoryRepository();
