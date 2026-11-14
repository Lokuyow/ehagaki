import {
    clearPersistedPostHistoryViewStateForPubkey,
    writePersistedPostHistoryViewState,
} from "./postHistoryDialogViewState";
import {
    DEFAULT_PERSISTED_POST_HISTORY_LISTING_SNAPSHOT,
    clearPersistedPostHistoryListingSnapshotForPubkey,
    writePersistedListingSnapshot,
} from "./postHistoryListingSnapshot";
import type { PostHistoryRecord } from "./storage/ehagakiDb";

export function applyDeletedStateToPostHistoryRecords(
    items: PostHistoryRecord[],
    eventId: string,
    deletedAt: number,
    deletionEventId: string,
): PostHistoryRecord[] {
    return items.map((post) =>
        post.eventId === eventId
            ? {
                ...post,
                deletedAt,
                deletionEventId,
            }
            : post,
    );
}

export function clearPersistedPostHistoryListingStateAfterLocalDelete(
    pubkeyHex: string,
): void {
    clearPersistedPostHistoryViewStateForPubkey(pubkeyHex);
    clearPersistedPostHistoryListingSnapshotForPubkey(pubkeyHex);
}

export function writeEmptyPersistedPostHistoryListingStateAfterLocalDelete(
    pubkeyHex: string,
): void {
    writePersistedPostHistoryViewState(pubkeyHex, {
        currentPage: 1,
        searchPage: 1,
        searchInput: "",
        searchQuery: "",
    });
    writePersistedListingSnapshot(pubkeyHex, {
        ...DEFAULT_PERSISTED_POST_HISTORY_LISTING_SNAPSHOT,
        totalCount: 0,
        totalCountKnown: true,
        totalCountFailed: false,
    });
}
