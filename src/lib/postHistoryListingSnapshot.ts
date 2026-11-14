import { registerClearPersistedPostHistoryListingSnapshots } from "./postHistoryListingSnapshotCleanup";
import type { PostHistoryRecord } from "./storage/ehagakiDb";

export interface PersistedPostHistoryListingSnapshot {
    coverageAnchorCreatedAt?: number | null;
    loadedPosts: PostHistoryRecord[];
    searchPosts: PostHistoryRecord[];
    searchQuery: string;
    totalCount: number;
    totalCountKnown?: boolean;
    totalCountFailed?: boolean;
    searchTotalCount: number;
    searchTotalCountKnown?: boolean;
    searchHasNext: boolean;
    hasMoreRemote: boolean;
    nextUntil: number | null;
    lastDialogOpenRefreshAt: number | null;
    visibleUntil: number | null;
    hasJumpCacheAnchors: boolean;
    hasOlderLocal: boolean;
    hasNewerLocal: boolean;
}

export const DEFAULT_PERSISTED_POST_HISTORY_LISTING_SNAPSHOT: PersistedPostHistoryListingSnapshot = {
    loadedPosts: [],
    searchPosts: [],
    searchQuery: "",
    totalCount: 0,
    totalCountKnown: false,
    totalCountFailed: false,
    searchTotalCount: 0,
    searchTotalCountKnown: false,
    searchHasNext: false,
    hasMoreRemote: false,
    nextUntil: null,
    lastDialogOpenRefreshAt: null,
    visibleUntil: null,
    hasJumpCacheAnchors: false,
    hasOlderLocal: false,
    hasNewerLocal: false,
};

const persistedListingSnapshotByPubkey = new Map<
    string,
    PersistedPostHistoryListingSnapshot
>();

export function resolveListingSnapshotKey(
    pubkeyHex: string | null | undefined,
): string | null {
    if (typeof pubkeyHex !== "string") {
        return null;
    }

    const normalizedPubkeyHex = pubkeyHex.trim();
    return normalizedPubkeyHex.length > 0 ? normalizedPubkeyHex : null;
}

function cloneListingSnapshot(
    snapshot: PersistedPostHistoryListingSnapshot,
): PersistedPostHistoryListingSnapshot {
    return {
        loadedPosts: [...snapshot.loadedPosts],
        searchPosts: [...snapshot.searchPosts],
        searchQuery: snapshot.searchQuery ?? "",
        totalCount: snapshot.totalCount,
        // Older in-memory snapshots did not distinguish a zero count from an
        // unavailable count. A positive legacy value is safe to preserve; a
        // legacy zero is deliberately treated as unknown until refreshed.
        totalCountKnown: snapshot.totalCountKnown ?? snapshot.totalCount > 0,
        totalCountFailed: snapshot.totalCountFailed ?? false,
        searchTotalCount: snapshot.searchTotalCount,
        searchTotalCountKnown: snapshot.searchTotalCountKnown ?? snapshot.searchTotalCount > 0,
        searchHasNext: snapshot.searchHasNext,
        hasMoreRemote: snapshot.hasMoreRemote,
        nextUntil: snapshot.nextUntil,
        lastDialogOpenRefreshAt: snapshot.lastDialogOpenRefreshAt,
        visibleUntil: snapshot.visibleUntil,
        coverageAnchorCreatedAt: snapshot.coverageAnchorCreatedAt ?? null,
        hasJumpCacheAnchors: snapshot.hasJumpCacheAnchors ?? false,
        hasOlderLocal: snapshot.hasOlderLocal,
        hasNewerLocal: snapshot.hasNewerLocal,
    };
}

export function readPersistedListingSnapshot(
    pubkeyHex: string | null | undefined,
): PersistedPostHistoryListingSnapshot {
    const key = resolveListingSnapshotKey(pubkeyHex);
    if (!key) {
        return cloneListingSnapshot(
            DEFAULT_PERSISTED_POST_HISTORY_LISTING_SNAPSHOT,
        );
    }

    return cloneListingSnapshot(
        persistedListingSnapshotByPubkey.get(key) ??
        DEFAULT_PERSISTED_POST_HISTORY_LISTING_SNAPSHOT,
    );
}

export function readPersistedPostHistoryListingSnapshotForPubkey(
    pubkeyHex: string | null | undefined,
): PersistedPostHistoryListingSnapshot {
    return readPersistedListingSnapshot(pubkeyHex);
}

export function writePersistedListingSnapshot(
    pubkeyHex: string | null | undefined,
    snapshot: PersistedPostHistoryListingSnapshot,
): void {
    const key = resolveListingSnapshotKey(pubkeyHex);
    if (!key) {
        return;
    }

    persistedListingSnapshotByPubkey.set(key, cloneListingSnapshot(snapshot));
}

export function clearPersistedPostHistoryListingSnapshots(): void {
    persistedListingSnapshotByPubkey.clear();
}

registerClearPersistedPostHistoryListingSnapshots(
    clearPersistedPostHistoryListingSnapshots,
);

export function clearPersistedPostHistoryListingSnapshotForPubkey(
    pubkeyHex: string | null | undefined,
): void {
    const key = resolveListingSnapshotKey(pubkeyHex);
    if (!key) {
        return;
    }

    persistedListingSnapshotByPubkey.delete(key);
}
