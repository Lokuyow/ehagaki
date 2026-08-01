import {
    channelMetadataRepository,
    type ChannelMetadataCache,
    type ChannelMetadataRepository,
} from "./storage/channelMetadataRepository";
import type { PostHistoryRecord, PostHistorySearchRecord } from "./storage/ehagakiDb";
import {
    postHistoryRepository,
    type PostHistoryRepository,
} from "./storage/postHistoryRepository";
import {
    postHistorySearchRepository,
    type DexiePostHistorySearchRepository,
} from "./storage/postHistorySearchRepository";
import {
    getChannelMetadataSearchRevision,
    getPostHistorySearchRevision,
} from "./postHistoryLocalSearchRevision";

export interface SearchLocalPostsOptions {
    pubkeyHex?: string | null;
    query: string;
    page: number;
    pageSize: number;
}

export interface SearchLocalPostsResult {
    items: PostHistoryRecord[];
    total: number;
    hasNext: boolean;
}

type SearchRevisionSnapshot = {
    postHistory: number;
    channelMetadata: number;
};

type ResolvedSearchCacheEntry = {
    pubkeyHex: string;
    normalizedQueryKey: string;
    revision: SearchRevisionSnapshot;
    matchedEventIds: string[];
};

type InFlightSearchEntry = {
    identity: symbol;
    runtimeCacheToken: number;
    pubkeyHex: string;
    normalizedQueryKey: string;
    revision: SearchRevisionSnapshot;
    promise: Promise<string[]>;
};

function normalizePageNumber(page: number): number {
    return Number.isFinite(page) ? Math.max(1, Math.trunc(page)) : 1;
}

function normalizePageSize(pageSize: number): number {
    return Number.isFinite(pageSize) ? Math.max(1, Math.trunc(pageSize)) : 50;
}

function normalizeQueryTokens(query: string): string[] {
    return query.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

function getNormalizedQueryKey(queryTokens: string[]): string {
    return queryTokens.join(" ");
}

function getRevisionSnapshot(pubkeyHex: string): SearchRevisionSnapshot {
    return {
        postHistory: getPostHistorySearchRevision(pubkeyHex),
        channelMetadata: getChannelMetadataSearchRevision(),
    };
}

function areRevisionSnapshotsEqual(left: SearchRevisionSnapshot, right: SearchRevisionSnapshot): boolean {
    return left.postHistory === right.postHistory
        && left.channelMetadata === right.channelMetadata;
}

function extractChannelEventIds(records: PostHistorySearchRecord[]): string[] {
    return Array.from(new Set(records.flatMap((record) => record.channelEventId ? [record.channelEventId] : [])));
}

function createChannelSearchText(channelMetadata: ChannelMetadataCache): string {
    return [channelMetadata.name ?? "", channelMetadata.about ?? ""].join("\n").toLowerCase();
}

function matchesQuery(
    record: PostHistorySearchRecord,
    queryTokens: string[],
    channelSearchText: string | undefined,
): boolean {
    const eventId = record.eventId.toLowerCase();
    const kind = String(record.kind);
    const channelEventId = record.channelEventId?.toLowerCase();
    return queryTokens.every((token) =>
        record.searchText.includes(token)
        || eventId.includes(token)
        || kind.includes(token)
        || channelEventId?.includes(token) === true
        || channelSearchText?.includes(token) === true
    );
}

export class PostHistoryLocalSearchService {
    private resolvedCacheEntry: ResolvedSearchCacheEntry | null = null;
    private inFlightEntry: InFlightSearchEntry | null = null;
    private runtimeCacheToken = 0;

    constructor(
        private postHistoryRepositoryImpl: Pick<PostHistoryRepository, "getManyByEventIds"> = postHistoryRepository,
        private postHistorySearchRepositoryImpl: Pick<DexiePostHistorySearchRepository, "getForPubkey"> = postHistorySearchRepository,
        private channelMetadataRepositoryImpl: Pick<ChannelMetadataRepository, "getMany"> = channelMetadataRepository,
    ) {}

    clearCache(): void {
        this.resolvedCacheEntry = null;
        this.inFlightEntry = null;
        this.runtimeCacheToken += 1;
    }

    private isResolvedCacheEntryCurrent(
        entry: ResolvedSearchCacheEntry,
        pubkeyHex: string,
        normalizedQueryKey: string,
        revision: SearchRevisionSnapshot,
    ): boolean {
        return entry.pubkeyHex === pubkeyHex
            && entry.normalizedQueryKey === normalizedQueryKey
            && areRevisionSnapshotsEqual(entry.revision, revision);
    }

    private async buildMatchedEventIds(pubkeyHex: string, queryTokens: string[]): Promise<string[]> {
        const records = await this.postHistorySearchRepositoryImpl.getForPubkey(pubkeyHex);
        const channelMetadataById = new Map<string, string>();
        const channelEventIds = extractChannelEventIds(records);
        if (channelEventIds.length > 0) {
            const metadata = await this.channelMetadataRepositoryImpl.getMany(channelEventIds);
            metadata.forEach((record) => {
                channelMetadataById.set(record.channelEventId, createChannelSearchText(record));
            });
        }

        return records
            .filter((record) => matchesQuery(
                record,
                queryTokens,
                record.channelEventId ? channelMetadataById.get(record.channelEventId) : undefined,
            ))
            .map((record) => record.eventId);
    }

    private startMatchedEventIdsBuild(
        pubkeyHex: string,
        normalizedQueryKey: string,
        queryTokens: string[],
        revision: SearchRevisionSnapshot,
    ): InFlightSearchEntry {
        const identity = Symbol("post-history-local-search");
        const runtimeCacheToken = this.runtimeCacheToken;
        const entry = {
            identity,
            runtimeCacheToken,
            pubkeyHex,
            normalizedQueryKey,
            revision,
            promise: Promise.resolve([] as string[]),
        } satisfies InFlightSearchEntry;

        entry.promise = (async () => {
            let attemptRevision = revision;
            for (let attempt = 0; attempt < 2; attempt += 1) {
                const matchedEventIds = await this.buildMatchedEventIds(pubkeyHex, queryTokens);
                const completedRevision = getRevisionSnapshot(pubkeyHex);
                const isStable = areRevisionSnapshotsEqual(attemptRevision, completedRevision);
                if (isStable && this.inFlightEntry?.identity === identity && this.runtimeCacheToken === runtimeCacheToken) {
                    this.resolvedCacheEntry = {
                        pubkeyHex,
                        normalizedQueryKey,
                        revision: attemptRevision,
                        matchedEventIds,
                    };
                }
                if (isStable || attempt === 1) return matchedEventIds;

                attemptRevision = completedRevision;
                if (this.inFlightEntry?.identity === identity && this.runtimeCacheToken === runtimeCacheToken) {
                    entry.revision = attemptRevision;
                }
            }
            return [];
        })().finally(() => {
            if (this.inFlightEntry?.identity === identity) this.inFlightEntry = null;
        });
        this.inFlightEntry = entry;
        return entry;
    }

    async searchLocalPosts(options: SearchLocalPostsOptions): Promise<SearchLocalPostsResult> {
        const queryTokens = normalizeQueryTokens(options.query);
        if (!options.pubkeyHex || queryTokens.length === 0) {
            return { items: [], total: 0, hasNext: false };
        }

        const page = normalizePageNumber(options.page);
        const pageSize = normalizePageSize(options.pageSize);
        const pubkeyHex = options.pubkeyHex;
        const normalizedQueryKey = getNormalizedQueryKey(queryTokens);
        const revision = getRevisionSnapshot(pubkeyHex);
        const resolvedCacheEntry = this.resolvedCacheEntry;
        const matchedEventIds = resolvedCacheEntry
            && this.isResolvedCacheEntryCurrent(resolvedCacheEntry, pubkeyHex, normalizedQueryKey, revision)
            ? resolvedCacheEntry.matchedEventIds
            : await (() => {
                const inFlightEntry = this.inFlightEntry;
                const entry = inFlightEntry
                    && inFlightEntry.runtimeCacheToken === this.runtimeCacheToken
                    && inFlightEntry.pubkeyHex === pubkeyHex
                    && inFlightEntry.normalizedQueryKey === normalizedQueryKey
                    && areRevisionSnapshotsEqual(inFlightEntry.revision, revision)
                    ? inFlightEntry
                    : this.startMatchedEventIdsBuild(pubkeyHex, normalizedQueryKey, queryTokens, revision);
                return entry.promise;
            })();

        const startIndex = (page - 1) * pageSize;
        const pageEventIds = matchedEventIds.slice(startIndex, startIndex + pageSize);
        const records = await this.postHistoryRepositoryImpl.getManyByEventIds({ pubkeyHex, eventIds: pageEventIds });
        const recordsByEventId = new Map(records.map((record) => [record.eventId, record]));
        return {
            items: pageEventIds.flatMap((eventId) => {
                const record = recordsByEventId.get(eventId);
                return record ? [record] : [];
            }),
            total: matchedEventIds.length,
            hasNext: startIndex + pageSize < matchedEventIds.length,
        };
    }
}

export const postHistoryLocalSearchService = new PostHistoryLocalSearchService();
