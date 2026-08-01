import {
    channelMetadataRepository,
    type ChannelMetadataCache,
    type ChannelMetadataRepository,
} from "./storage/channelMetadataRepository";
import type { PostHistoryRecord } from "./storage/ehagakiDb";
import {
    postHistoryRepository,
    type PostHistoryRepository,
} from "./storage/postHistoryRepository";
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
    filteredPosts: PostHistoryRecord[];
};

type InFlightSearchEntry = {
    identity: symbol;
    runtimeCacheToken: number;
    pubkeyHex: string;
    normalizedQueryKey: string;
    revision: SearchRevisionSnapshot;
    promise: Promise<PostHistoryRecord[]>;
};

function normalizePageNumber(page: number): number {
    return Number.isFinite(page) ? Math.max(1, Math.trunc(page)) : 1;
}

function normalizePageSize(pageSize: number): number {
    return Number.isFinite(pageSize) ? Math.max(1, Math.trunc(pageSize)) : 50;
}

function normalizeQueryTokens(query: string): string[] {
    return query
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);
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

function areRevisionSnapshotsEqual(
    left: SearchRevisionSnapshot,
    right: SearchRevisionSnapshot,
): boolean {
    return left.postHistory === right.postHistory
        && left.channelMetadata === right.channelMetadata;
}

function buildSearchText(
    post: PostHistoryRecord,
    channelMetadata: ChannelMetadataCache | null,
): string {
    return [
        post.content,
        post.eventId,
        String(post.kind),
        post.tags.flat().join(" "),
        ...post.media.flatMap((media) => [media.url, media.alt ?? ""]),
        post.channelEventId ?? "",
        post.relayHints.join(" "),
        post.acceptedRelays.join(" "),
        post.fetchedRelays?.join(" ") ?? "",
        channelMetadata?.name ?? "",
        channelMetadata?.about ?? "",
    ]
        .join("\n")
        .toLowerCase();
}

function extractChannelEventIds(posts: PostHistoryRecord[]): string[] {
    return Array.from(
        new Set(
            posts
                .map((post) => post.channelEventId)
                .filter(
                    (channelEventId): channelEventId is string =>
                        typeof channelEventId === "string" &&
                        channelEventId.length > 0,
                ),
        ),
    );
}

export class PostHistoryLocalSearchService {
    private resolvedCacheEntry: ResolvedSearchCacheEntry | null = null;
    private inFlightEntry: InFlightSearchEntry | null = null;
    private runtimeCacheToken = 0;

    constructor(
        private postHistoryRepositoryImpl: Pick<PostHistoryRepository, "getAll"> =
            postHistoryRepository,
        private channelMetadataRepositoryImpl: Pick<
            ChannelMetadataRepository,
            "getMany"
        > = channelMetadataRepository,
    ) { }

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

    private async buildFilteredPosts(
        pubkeyHex: string,
        queryTokens: string[],
    ): Promise<PostHistoryRecord[]> {
        const posts = await this.postHistoryRepositoryImpl.getAll({ pubkeyHex });
        const channelEventIds = extractChannelEventIds(posts);
        const channelMetadataById = new Map<string, ChannelMetadataCache>();

        if (channelEventIds.length > 0) {
            const records = await this.channelMetadataRepositoryImpl.getMany(
                channelEventIds,
            );

            records.forEach((record) => {
                channelMetadataById.set(record.channelEventId, record);
            });
        }

        return posts.filter((post) => {
            const searchText = buildSearchText(
                post,
                post.channelEventId
                    ? channelMetadataById.get(post.channelEventId) ?? null
                    : null,
            );

            return queryTokens.every((token) => searchText.includes(token));
        });
    }

    private startFilteredPostsBuild(
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
            promise: Promise.resolve([] as PostHistoryRecord[]),
        } satisfies InFlightSearchEntry;

        entry.promise = (async () => {
            let attemptRevision = revision;

            for (let attempt = 0; attempt < 2; attempt += 1) {
                const filteredPosts = await this.buildFilteredPosts(pubkeyHex, queryTokens);
                const completedRevision = getRevisionSnapshot(pubkeyHex);
                const isStable = areRevisionSnapshotsEqual(
                    attemptRevision,
                    completedRevision,
                );

                if (
                    isStable
                    && this.inFlightEntry?.identity === identity
                    && this.runtimeCacheToken === runtimeCacheToken
                ) {
                    this.resolvedCacheEntry = {
                        pubkeyHex,
                        normalizedQueryKey,
                        revision: attemptRevision,
                        filteredPosts,
                    };
                }

                if (isStable || attempt === 1) {
                    return filteredPosts;
                }

                attemptRevision = completedRevision;
                if (
                    this.inFlightEntry?.identity === identity
                    && this.runtimeCacheToken === runtimeCacheToken
                ) {
                    entry.revision = attemptRevision;
                }
            }

            return [];
        })().finally(() => {
            if (this.inFlightEntry?.identity === identity) {
                this.inFlightEntry = null;
            }
        });
        this.inFlightEntry = entry;
        return entry;
    }

    async searchLocalPosts(
        options: SearchLocalPostsOptions,
    ): Promise<SearchLocalPostsResult> {
        const queryTokens = normalizeQueryTokens(options.query);
        if (!options.pubkeyHex || queryTokens.length === 0) {
            return {
                items: [],
                total: 0,
                hasNext: false,
            };
        }

        const page = normalizePageNumber(options.page);
        const pageSize = normalizePageSize(options.pageSize);
        const pubkeyHex = options.pubkeyHex;
        const normalizedQueryKey = getNormalizedQueryKey(queryTokens);
        const revision = getRevisionSnapshot(pubkeyHex);
        const resolvedCacheEntry = this.resolvedCacheEntry;
        const filteredPosts = resolvedCacheEntry
            && this.isResolvedCacheEntryCurrent(
                resolvedCacheEntry,
                pubkeyHex,
                normalizedQueryKey,
                revision,
            )
            ? resolvedCacheEntry.filteredPosts
            : await (() => {
                const inFlightEntry = this.inFlightEntry;
                const entry = inFlightEntry
                    && inFlightEntry.runtimeCacheToken === this.runtimeCacheToken
                    && inFlightEntry.pubkeyHex === pubkeyHex
                    && inFlightEntry.normalizedQueryKey === normalizedQueryKey
                    && areRevisionSnapshotsEqual(inFlightEntry.revision, revision)
                    ? inFlightEntry
                    : this.startFilteredPostsBuild(
                        pubkeyHex,
                        normalizedQueryKey,
                        queryTokens,
                        revision,
                    );
                return entry.promise;
            })();

        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        return {
            items: filteredPosts.slice(startIndex, endIndex),
            total: filteredPosts.length,
            hasNext: endIndex < filteredPosts.length,
        };
    }
}

export const postHistoryLocalSearchService =
    new PostHistoryLocalSearchService();
