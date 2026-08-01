import type {
    PostHistoryRecord,
    PostHistorySearchRecord,
} from "./storage/ehagakiDb";

export const POST_HISTORY_SEARCH_INDEX_FORMAT_VERSION = 1;
export const POST_HISTORY_SEARCH_INDEX_BATCH_SIZE = 500;
export const POST_HISTORY_SEARCH_INDEX_LEASE_MS = 10_000;

export type PostHistorySearchIndexCursor = Pick<
    PostHistoryRecord,
    "eventId" | "postedAt" | "createdAt"
>;

export type PostHistorySearchIndexState = {
    formatVersion: number;
    status: "clearing" | "building" | "ready";
    processedCount: number;
    cursor?: PostHistorySearchIndexCursor;
    leaseOwner?: string;
    leaseExpiresAt?: number;
};

export function getPostHistorySearchIndexMetaKey(pubkeyHex: string): string {
    return `postHistorySearchIndex:${pubkeyHex}`;
}

function joinStrings(values: Array<string | null | undefined>): string {
    return values.filter((value): value is string => typeof value === "string").join(" ");
}

export function createPostHistorySearchRecord(
    post: PostHistoryRecord,
): PostHistorySearchRecord {
    const searchText = [
        post.content,
        post.tags?.flat().join(" ") ?? "",
        ...(post.media ?? []).flatMap((media) => [media.url, media.alt ?? ""]),
        joinStrings(post.relayHints),
        joinStrings(post.acceptedRelays),
        joinStrings(post.fetchedRelays ?? []),
    ].join("\n").toLowerCase();

    return {
        eventId: post.eventId,
        pubkeyHex: post.pubkeyHex,
        postedAt: post.postedAt,
        createdAt: post.createdAt,
        kind: post.kind,
        searchText,
        ...(post.channelEventId ? { channelEventId: post.channelEventId } : {}),
    };
}
