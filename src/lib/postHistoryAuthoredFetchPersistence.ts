import type { RxNostr } from "rx-nostr";
import type { RelayConfig } from "./types";
import type { PostHistoryRelayFetchResult } from "./postHistoryRelayFetchService";
import { getPostHistoryAuthoredRelayScopeKey } from "./postHistoryRelayResolver";
import { buildPostHistoryVisibleKindsKey } from "./storage/postHistoryVisibleRangeRepository";
import { postHistoryRelayCoverageRepository, type PostHistoryCoverageWrite } from "./storage/postHistoryRelayCoverageRepository";
import { postHistoryRepository, type PostHistoryRepository, type PostHistoryUpsertFetchedEventsResult } from "./storage/postHistoryRepository";

export const EMPTY_POST_HISTORY_FETCH_SAVE: PostHistoryUpsertFetchedEventsResult = {
    insertedCount: 0, updatedCount: 0, unchangedCount: 0, appliedDeletionCount: 0, applied: false,
};

export async function createPostHistoryAuthoredFetchScope(input: {
    ownerPubkeyHex: string;
    kinds: number[];
    rxNostr: RxNostr;
    relayConfig: RelayConfig | null | undefined;
    getRelayConfig: () => RelayConfig | null | undefined;
    isActive: () => boolean;
}): Promise<Omit<PostHistoryCoverageWrite, "relays">> {
    const relayScopeKey = getPostHistoryAuthoredRelayScopeKey(input.relayConfig);
    const expectedRevision = await postHistoryRelayCoverageRepository.getLocalRevision(input.ownerPubkeyHex);
    return {
        ownerPubkeyHex: input.ownerPubkeyHex,
        kindsKey: buildPostHistoryVisibleKindsKey(input.kinds), expectedRevision,
        isActive: () => input.isActive()
            && getPostHistoryAuthoredRelayScopeKey(input.getRelayConfig()) === relayScopeKey,
    };
}

export async function persistPostHistoryAuthoredFetch(
    result: PostHistoryRelayFetchResult,
    scope: Omit<PostHistoryCoverageWrite, "relays">,
    repository: Pick<PostHistoryRepository, "upsertFetchedEvents"> = postHistoryRepository,
): Promise<PostHistoryUpsertFetchedEventsResult> {
    if (!scope.isActive() || result.status === "cancelled") return EMPTY_POST_HISTORY_FETCH_SAVE;
    if (!result.events.length && !result.relayFetchCoverage?.length) {
        const revision = await postHistoryRelayCoverageRepository.getLocalRevision(scope.ownerPubkeyHex);
        return { ...EMPTY_POST_HISTORY_FETCH_SAVE, applied: scope.isActive() && revision === scope.expectedRevision };
    }
    return repository.upsertFetchedEvents({ events: result.events, fetchedAt: result.fetchedAt,
        relayFetchCoverage: { ...scope, relays: result.relayFetchCoverage ?? [] } });
}
