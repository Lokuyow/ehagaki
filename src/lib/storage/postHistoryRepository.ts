import Dexie from "dexie";
import {
    cloneNostrEvent,
    extractPostHistoryChannelReference,
    isSameSignedNostrEvent,
} from "../postHistoryEventUtils";
import { markPostHistoryShouldReturnToLatestAfterLocalPost } from "../postHistoryLatestRequest";
import { RelayConfigUtils } from "../relayConfigUtils";
import type { NostrEvent } from "../types";
import type { PostHistoryRecord, PostHistoryMediaRecord, EHagakiDB } from "./ehagakiDb";
import { ehagakiDb } from "./ehagakiDb";

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

export type PostHistoryVisiblePageOptions = PostHistoryVisibleQueryOptions & {
    page: number;
    pageSize: number;
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
    };

export type PostHistoryVisibleChunkAroundEventIdOptions =
    PostHistoryVisibleChunkOptions & {
        eventId: string;
        keepAbove?: number;
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
    getVisibleAll(options: PostHistoryVisibleQueryOptions): Promise<PostHistoryRecord[]>;
    getPage(options: PostHistoryPageOptions): Promise<PostHistoryRecord[]>;
    getVisiblePage(options: PostHistoryVisiblePageOptions): Promise<PostHistoryRecord[]>;
    getLatestVisibleChunk(options: PostHistoryVisibleChunkOptions): Promise<PostHistoryRecord[]>;
    getOlderVisibleChunk(options: PostHistoryVisibleChunkCursorOptions): Promise<PostHistoryRecord[]>;
    getNewerVisibleChunk(options: PostHistoryVisibleChunkCursorOptions): Promise<PostHistoryRecord[]>;
    getVisibleChunkFromCreatedAt(options: PostHistoryVisibleChunkFromCreatedAtOptions): Promise<PostHistoryRecord[]>;
    getVisibleChunkAroundEventId(options: PostHistoryVisibleChunkAroundEventIdOptions): Promise<PostHistoryRecord[]>;
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

function parseImetaTag(tag: string[]): PostHistoryMediaRecord | null {
    const fields = new Map<string, string>();

    for (const token of tag.slice(1)) {
        const separator = token.indexOf(" ");
        if (separator <= 0) continue;
        fields.set(token.slice(0, separator), token.slice(separator + 1));
    }

    const url = fields.get("url");
    if (!url) return null;

    const rawSize = fields.get("size");
    const size = rawSize ? Number(rawSize) : undefined;

    return {
        url,
        mimeType: fields.get("m") || undefined,
        alt: fields.get("alt") || undefined,
        blurhash: fields.get("blurhash") || undefined,
        dim: fields.get("dim") || undefined,
        size: Number.isFinite(size) && size! > 0 ? size : undefined,
        uploadProtocol: normalizeUploadProtocol(fields.get("uploadProtocol")),
    };
}

function normalizeUploadProtocol(value: string | undefined): PostHistoryMediaRecord["uploadProtocol"] {
    return value === "blossom" || value === "nip96" || value === "custom-http"
        ? value
        : undefined;
}

function inferMimeTypeFromUrl(url: string): string | undefined {
    const pathname = (() => {
        try {
            return new URL(url).pathname.toLowerCase();
        } catch {
            return url.toLowerCase();
        }
    })();

    if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) return "image/jpeg";
    if (pathname.endsWith(".png")) return "image/png";
    if (pathname.endsWith(".webp")) return "image/webp";
    if (pathname.endsWith(".gif")) return "image/gif";
    if (pathname.endsWith(".mp4")) return "video/mp4";
    if (pathname.endsWith(".webm")) return "video/webm";
    if (pathname.endsWith(".mov")) return "video/quicktime";
    return undefined;
}

function extractContentMedia(content: string, existingUrls: Set<string>): PostHistoryMediaRecord[] {
    const matches = content.match(/https?:\/\/[^\s<>"']+/g) ?? [];
    return matches
        .map((url) => url.replace(/[),.。、]+$/u, ""))
        .filter((url) => {
            if (existingUrls.has(url)) return false;
            return /\.(jpe?g|png|webp|gif|mp4|webm|mov)(?:$|[?#])/i.test(url);
        })
        .map((url) => ({
            url,
            mimeType: inferMimeTypeFromUrl(url),
        }));
}

export function extractPostHistoryMedia(event: Pick<NostrEvent, "content" | "tags">): PostHistoryMediaRecord[] {
    const media = event.tags
        .filter((tag) => tag[0] === "imeta")
        .map(parseImetaTag)
        .filter((item): item is PostHistoryMediaRecord => item !== null);
    const seenUrls = new Set(media.map((item) => item.url));
    media.push(...extractContentMedia(event.content, seenUrls));
    return media;
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

function comparePostHistoryTimelineOrder(
    left: Pick<PostHistoryRecord, "eventId" | "postedAt" | "createdAt">,
    right: Pick<PostHistoryRecord, "eventId" | "postedAt" | "createdAt">,
): number {
    if (left.postedAt !== right.postedAt) {
        return right.postedAt - left.postedAt;
    }

    if (left.createdAt !== right.createdAt) {
        return right.createdAt - left.createdAt;
    }

    return right.eventId.localeCompare(left.eventId);
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

function areStringArraysEqual(left: string[] | undefined, right: string[] | undefined): boolean {
    const normalizedLeft = left ?? [];
    const normalizedRight = right ?? [];
    if (normalizedLeft.length !== normalizedRight.length) {
        return false;
    }

    return normalizedLeft.every((value, index) => value === normalizedRight[index]);
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

    async getVisibleAll(options: PostHistoryVisibleQueryOptions): Promise<PostHistoryRecord[]> {
        if (!options.pubkeyHex) return [];

        const visibleUntil = normalizeVisibleUntil(options.visibleUntil);
        if (visibleUntil === null) {
            return this.getAll(options);
        }

        const records = await this.db.postHistory
            .where("[pubkeyHex+createdAt]")
            .between([options.pubkeyHex, visibleUntil], [options.pubkeyHex, Dexie.maxKey])
            .toArray();

        return sortPostHistoryRecords(records);
    }

    async getPage(options: PostHistoryPageOptions): Promise<PostHistoryRecord[]> {
        if (!options.pubkeyHex) return [];

        const page = normalizePageNumber(options.page);
        const pageSize = normalizePageSize(options.pageSize);

        return this.db.postHistory
            .where("[pubkeyHex+postedAt]")
            .between([options.pubkeyHex, Dexie.minKey], [options.pubkeyHex, Dexie.maxKey])
            .reverse()
            .offset((page - 1) * pageSize)
            .limit(pageSize)
            .toArray();
    }

    async getVisiblePage(options: PostHistoryVisiblePageOptions): Promise<PostHistoryRecord[]> {
        const page = normalizePageNumber(options.page);
        const pageSize = normalizePageSize(options.pageSize);
        const records = await this.getVisibleAll(options);

        return records.slice((page - 1) * pageSize, page * pageSize);
    }

    async getLatestVisibleChunk(
        options: PostHistoryVisibleChunkOptions,
    ): Promise<PostHistoryRecord[]> {
        const limit = normalizeChunkLimit(options.limit);
        const records = await this.getVisibleAll(options);

        return records.slice(0, limit);
    }

    async getOlderVisibleChunk(
        options: PostHistoryVisibleChunkCursorOptions,
    ): Promise<PostHistoryRecord[]> {
        const limit = normalizeChunkLimit(options.limit);
        const records = await this.getVisibleAll(options);

        return records.filter((record) =>
            isOlderThanTimelineCursor(record, options.cursor)
        ).slice(0, limit);
    }

    async getNewerVisibleChunk(
        options: PostHistoryVisibleChunkCursorOptions,
    ): Promise<PostHistoryRecord[]> {
        const limit = normalizeChunkLimit(options.limit);
        const records = await this.getVisibleAll(options);

        const newerRecords = records.filter((record) =>
            isNewerThanTimelineCursor(record, options.cursor)
        );

        return newerRecords.slice(Math.max(0, newerRecords.length - limit));
    }

    async getVisibleChunkFromCreatedAt(
        options: PostHistoryVisibleChunkFromCreatedAtOptions,
    ): Promise<PostHistoryRecord[]> {
        const limit = normalizeChunkLimit(options.limit);
        const targetCreatedAt = normalizeCreatedAtValue(options.createdAt);
        const records = await this.getVisibleAll(options);

        if (records.length === 0) {
            return [];
        }

        const anchorIndex = records.findIndex((record) =>
            record.createdAt <= targetCreatedAt
        );

        if (anchorIndex < 0) {
            return records.slice(Math.max(0, records.length - limit));
        }

        return records.slice(anchorIndex, anchorIndex + limit);
    }

    async getVisibleChunkAroundEventId(
        options: PostHistoryVisibleChunkAroundEventIdOptions,
    ): Promise<PostHistoryRecord[]> {
        const limit = normalizeChunkLimit(options.limit);
        const keepAbove = Number.isFinite(options.keepAbove)
            ? Math.max(0, Math.trunc(options.keepAbove ?? 0))
            : 0;
        const records = await this.getVisibleAll(options);
        const anchorIndex = records.findIndex(
            (record) => record.eventId === options.eventId,
        );

        if (anchorIndex < 0) {
            return [];
        }

        const maxStartIndex = Math.max(0, records.length - limit);
        const startIndex = Math.min(
            maxStartIndex,
            Math.max(0, anchorIndex - keepAbove),
        );

        return records.slice(startIndex, startIndex + limit);
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
            };
        }

        const fetchedAt = input.fetchedAt ?? this.now();
        const eventIds = normalizedItems.map((item) => item.event.id);
        let insertedCount = 0;
        let updatedCount = 0;
        let unchangedCount = 0;

        await this.db.transaction("rw", this.db.postHistory, async () => {
            const existingRecords = await this.db.postHistory.bulkGet(eventIds);
            const existingMap = new Map<string, PostHistoryRecord>();

            existingRecords.forEach((record) => {
                if (record) {
                    existingMap.set(record.eventId, record);
                }
            });

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

                const nextRecord = {
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
                } else if (hasMaterialPostHistoryChanges(existingRecord, nextRecord)) {
                    updatedCount += 1;
                } else {
                    unchangedCount += 1;
                }

                return nextRecord;
            });

            await this.db.postHistory.bulkPut(nextRecords);
        });

        return {
            insertedCount,
            updatedCount,
            unchangedCount,
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
