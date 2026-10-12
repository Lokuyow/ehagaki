import type { RxNostr } from "rx-nostr";
import { postHistoryLocalRelayService } from "./postHistoryLocalRelayService";
import type { RelayConfig } from "./types";
import type { PostHistoryRelayFetchResult } from "./postHistoryRelayFetchService";
import type { PostHistoryRelayCoverage } from "./postHistoryRelayCoverage";
import type { PostHistoryFetchedEventItem } from "./storage/postHistoryRepository";
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
    return persistPostHistoryAuthoredBatch(result.events, result.fetchedAt, result.relayFetchCoverage ?? [], scope, repository);
}

export async function persistPostHistoryAuthoredBatch(
    events: PostHistoryFetchedEventItem[], fetchedAt: number, coverage: PostHistoryRelayCoverage[],
    scope: Omit<PostHistoryCoverageWrite, "relays">,
    repository: Pick<PostHistoryRepository, "upsertFetchedEvents"> = postHistoryRepository,
): Promise<PostHistoryUpsertFetchedEventsResult> {
    if (!scope.isActive()) return EMPTY_POST_HISTORY_FETCH_SAVE;
    if (!events.length && !coverage.length) {
        const revision = await postHistoryRelayCoverageRepository.getLocalRevision(scope.ownerPubkeyHex);
        return { ...EMPTY_POST_HISTORY_FETCH_SAVE, applied: scope.isActive() && revision === scope.expectedRevision };
    }
    const result = await repository.upsertFetchedEvents({ events, fetchedAt,
        relayFetchCoverage: { ...scope, relays: coverage } });
    if (result.applied !== false && scope.isActive()) void postHistoryLocalRelayService.archiveAdoptedAuthored(events, scope);
    return result;
}
