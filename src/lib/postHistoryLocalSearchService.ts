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
    constructor(
        private postHistoryRepositoryImpl: Pick<PostHistoryRepository, "getAll"> =
            postHistoryRepository,
        private channelMetadataRepositoryImpl: Pick<
            ChannelMetadataRepository,
            "getMany"
        > = channelMetadataRepository,
    ) { }

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
        const posts = await this.postHistoryRepositoryImpl.getAll({
            pubkeyHex: options.pubkeyHex,
        });
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

        const filteredPosts = posts.filter((post) => {
            const searchText = buildSearchText(
                post,
                post.channelEventId
                    ? channelMetadataById.get(post.channelEventId) ?? null
                    : null,
            );

            return queryTokens.every((token) => searchText.includes(token));
        });

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