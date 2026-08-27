import type { RxNostr } from "rx-nostr";
import {
    triggerPostHistoryChildInteractionDeletionLifecycle,
    type PostHistoryChildInteractionDeletionLifecycleTriggerResult,
} from "./postHistoryChildInteractionDeletionLifecycleTrigger";
import {
    POST_HISTORY_RELATION_REPAIR_KINDS,
    resolvePostHistoryRelationRefreshSignal,
    type PostHistoryRelationRefreshSource,
} from "./postHistoryRelationRefreshContracts";
import {
    postHistoryVisibleRangeChildInteractionRepairService,
    type PostHistoryVisibleRangeRelationRepairRequest,
    type PostHistoryVisibleRangeRelationRepairResult,
    type PostHistoryVisibleRangeRelationRepairTask,
} from "./postHistoryVisibleRangeChildInteractionRepairService";
import type { PostHistoryRecord } from "./storage/ehagakiDb";
import type { RelayConfig } from "./types";

export const POST_HISTORY_OLDER_REVEAL_RELATION_REPAIR_FRESHNESS_TTL_MS =
    5 * 60 * 1000;

export interface PostHistoryRelationRepairSummary {
    status: PostHistoryVisibleRangeRelationRepairResult["status"];
    savedDirectReplyCount: number;
}

export interface PostHistoryCurrentViewRelationRepairRequest {
    ownerPubkeyHex: string;
    rxNostr: RxNostr;
    visiblePosts: PostHistoryRecord[];
    isActive: () => boolean;
}

export interface PostHistoryVisibleRangeRelationRepairCoordinatorDeps {
    getShow: () => boolean;
    getPubkeyHex: () => string | null | undefined;
    getRxNostr: () => RxNostr | undefined;
    getRelayConfig: () => RelayConfig | null | undefined;
    getLoadedPosts: () => PostHistoryRecord[];
    onChildInteractionBadgeRefreshRequested: (
        posts: PostHistoryRecord[],
        parentEventIds: string[],
    ) => void | Promise<void>;
    onQuoteVisibleRangeRefreshRequested: (
        posts: PostHistoryRecord[],
    ) => void | Promise<void>;
    quoteVisibleRangeRepairExecutor?: (
        rxNostr: RxNostr,
        params: PostHistoryVisibleRangeRelationRepairRequest,
    ) => Promise<void>;
    relationRepairService?: Pick<
        typeof postHistoryVisibleRangeChildInteractionRepairService,
        "repairVisibleRangeRelations"
    >;
    triggerDeletionLifecycle?: (
        request: Parameters<typeof triggerPostHistoryChildInteractionDeletionLifecycle>[0],
    ) => Promise<PostHistoryChildInteractionDeletionLifecycleTriggerResult>;
    now?: () => number;
}

export function resolveVisibleOlderRevealChildInteractionRepairParentPosts(
    ownerPubkeyHex: string,
    candidatePosts: PostHistoryRecord[],
    currentVisiblePosts: Array<Pick<PostHistoryRecord, "eventId">>,
): PostHistoryRecord[] {
    const currentVisiblePostIds = new Set(
        currentVisiblePosts.map((post) => post.eventId),
    );
    const parentPostsByEventId = new Map<string, PostHistoryRecord>();

    for (const post of candidatePosts) {
        if (
            (post.kind !== 1 && post.kind !== 42)
            || post.pubkeyHex !== ownerPubkeyHex
            || !currentVisiblePostIds.has(post.eventId)
            || parentPostsByEventId.has(post.eventId)
        ) {
            continue;
        }

        parentPostsByEventId.set(post.eventId, post);
    }

    return Array.from(parentPostsByEventId.values());
}

export function resolveOlderRevealChildInteractionRepairNetworkParentIds(
    parentEventIds: string[],
    freshnessByParentId: ReadonlyMap<string, number>,
    inFlightParentIds: ReadonlySet<string>,
    nowMs: number,
    freshnessTtlMs = POST_HISTORY_OLDER_REVEAL_RELATION_REPAIR_FRESHNESS_TTL_MS,
): string[] {
    return parentEventIds.filter((eventId) => {
        if (inFlightParentIds.has(eventId)) {
            return false;
        }

        const checkedAt = freshnessByParentId.get(eventId);
        return typeof checkedAt !== "number"
            || nowMs - checkedAt >= freshnessTtlMs;
    });
}

function toSummary(
    result: PostHistoryVisibleRangeRelationRepairResult,
    isActive: boolean,
): PostHistoryRelationRepairSummary {
    return {
        status: isActive ? result.status : "cancelled",
        savedDirectReplyCount: result.savedDirectReplyCount,
    };
}

export function createPostHistoryVisibleRangeRelationRepairCoordinator({
    getShow,
    getPubkeyHex,
    getRxNostr,
    getRelayConfig,
    getLoadedPosts,
    onChildInteractionBadgeRefreshRequested,
    onQuoteVisibleRangeRefreshRequested,
    quoteVisibleRangeRepairExecutor,
    relationRepairService = postHistoryVisibleRangeChildInteractionRepairService,
    triggerDeletionLifecycle = triggerPostHistoryChildInteractionDeletionLifecycle,
    now = Date.now,
}: PostHistoryVisibleRangeRelationRepairCoordinatorDeps) {
    let currentViewRelationRepairTask: PostHistoryVisibleRangeRelationRepairTask | null = null;
    let currentViewRepairRunId = 0;
    let olderRevealRepairScopeId = 0;
    let disposed = false;
    const olderRevealRelationRepairTasks = new Set<PostHistoryVisibleRangeRelationRepairTask>();
    const olderRevealFreshnessByParentId = new Map<string, number>();
    const olderRevealInFlightParentIds = new Set<string>();

    function isCurrentViewRepairActive(
        runId: number,
        isActive: () => boolean,
    ): boolean {
        return !disposed && runId === currentViewRepairRunId && isActive();
    }

    function isOlderRevealRepairScopeActive(
        scopeId: number,
        pubkeyHex: string,
        rxNostr: RxNostr,
    ): boolean {
        return (
            !disposed
            && scopeId === olderRevealRepairScopeId
            && getShow()
            && getPubkeyHex() === pubkeyHex
            && getRxNostr() === rxNostr
        );
    }

    function requestChildInteractionBadgeRefresh(
        parentEventIds: string[],
    ): void {
        const posts = getLoadedPosts();
        if (posts.length === 0 || parentEventIds.length === 0) {
            return;
        }

        void Promise.resolve(
            onChildInteractionBadgeRefreshRequested(posts, parentEventIds),
        ).catch(() => undefined);
    }

    async function refreshChildInteractionBadges(
        parentEventIds: string[],
    ): Promise<void> {
        const posts = getLoadedPosts();
        if (posts.length === 0 || parentEventIds.length === 0) {
            return;
        }

        await onChildInteractionBadgeRefreshRequested(posts, parentEventIds);
    }

    function requestQuoteVisibleRangeRefresh(posts: PostHistoryRecord[]): void {
        if (posts.length === 0) {
            return;
        }

        void Promise.resolve(
            onQuoteVisibleRangeRefreshRequested(posts),
        ).catch(() => undefined);
    }

    async function dispatchRelationRepairRefreshSignal(params: {
        source: PostHistoryRelationRefreshSource;
        result: PostHistoryVisibleRangeRelationRepairResult;
        quoteRefreshPosts: PostHistoryRecord[];
        isActive: () => boolean;
        awaitBadgeRefresh: boolean;
    }): Promise<void> {
        if (!params.isActive()) {
            return;
        }

        const signal = resolvePostHistoryRelationRefreshSignal(params.source, {
            relationKinds: params.result.relationKinds,
            savedParentEventIds: params.result.savedParentEventIds,
            checkedParentEventIds: params.result.checkedParentEventIds,
            quoteRepairApplied: params.result.quoteRepairApplied,
            status: params.result.status,
        });

        if (signal.shouldRefreshQuotePreviews && params.isActive()) {
            requestQuoteVisibleRangeRefresh(params.quoteRefreshPosts);
        }

        if (signal.parentEventIds.length === 0 || !params.isActive()) {
            return;
        }

        if (params.awaitBadgeRefresh) {
            await refreshChildInteractionBadges(signal.parentEventIds);
            return;
        }

        requestChildInteractionBadgeRefresh(signal.parentEventIds);
    }

    function startRelationAwareVisibleRangeRepair(
        request: PostHistoryCurrentViewRelationRepairRequest,
    ): PostHistoryVisibleRangeRelationRepairTask {
        return relationRepairService.repairVisibleRangeRelations(request.rxNostr, {
            ownerPubkeyHex: request.ownerPubkeyHex,
            visiblePosts: request.visiblePosts,
            relationKinds: POST_HISTORY_RELATION_REPAIR_KINDS,
            quoteVisibleRangeRepairExecutor,
            relayConfig: getRelayConfig(),
            isActive: request.isActive,
        });
    }

    function scheduleChildInteractionDeletionRefresh(
        source: "listing-current-view" | "listing-older-reveal",
        parentEventIds: string[],
        rxNostr: RxNostr,
        isActive: () => boolean,
    ): void {
        if (parentEventIds.length === 0) {
            return;
        }

        void triggerDeletionLifecycle({
            source,
            parentEventIds,
            rxNostr,
            relayConfig: getRelayConfig(),
            isActive,
        }).then((result) => {
            if (
                result.status === "cancelled"
                || (result.deletedReactionEventIds.length === 0
                    && result.deletedReplyEventIds.length === 0)
                || !isActive()
            ) {
                return;
            }

            requestChildInteractionBadgeRefresh(result.checkedParentEventIds);
        }).catch(() => undefined);
    }

    async function repairCurrentView(
        request: PostHistoryCurrentViewRelationRepairRequest,
    ): Promise<PostHistoryRelationRepairSummary> {
        if (request.visiblePosts.length === 0) {
            return {
                status: "success",
                savedDirectReplyCount: 0,
            };
        }

        const runId = ++currentViewRepairRunId;
        const isActive = () => isCurrentViewRepairActive(runId, request.isActive);

        scheduleChildInteractionDeletionRefresh(
            "listing-current-view",
            request.visiblePosts.map((post) => post.eventId),
            request.rxNostr,
            isActive,
        );

        const relationRepairTask = startRelationAwareVisibleRangeRepair({
            ...request,
            isActive,
        });
        currentViewRelationRepairTask = relationRepairTask;

        try {
            const result = await relationRepairTask.promise;
            const active = isActive();
            if (
                currentViewRelationRepairTask === relationRepairTask
            ) {
                currentViewRelationRepairTask = null;
            }

            if (result.status === "cancelled" || !active) {
                return toSummary(result, false);
            }

            await dispatchRelationRepairRefreshSignal({
                source: "listing-manual-refetch",
                result,
                quoteRefreshPosts: request.visiblePosts,
                isActive,
                awaitBadgeRefresh: true,
            });
            return toSummary(result, isActive());
        } catch (error) {
            if (currentViewRelationRepairTask === relationRepairTask) {
                currentViewRelationRepairTask = null;
            }
            throw error;
        }
    }

    async function repairJump(
        request: PostHistoryCurrentViewRelationRepairRequest,
    ): Promise<void> {
        if (request.visiblePosts.length === 0) {
            return;
        }

        try {
            scheduleChildInteractionDeletionRefresh(
                "listing-current-view",
                request.visiblePosts.map((post) => post.eventId),
                request.rxNostr,
                request.isActive,
            );

            const relationRepairTask = startRelationAwareVisibleRangeRepair(request);
            const result = await relationRepairTask.promise;
            if (result.status === "cancelled" || !request.isActive()) {
                return;
            }

            await dispatchRelationRepairRefreshSignal({
                source: "listing-current-view",
                result,
                quoteRefreshPosts: request.visiblePosts,
                isActive: request.isActive,
                awaitBadgeRefresh: true,
            });
        } catch {
            // Jump repair is intentionally background-only. Keep failures out of
            // the fire-and-forget caller while leaving manual repair errors visible.
        }
    }

    function scheduleOlderRevealRepair(candidatePosts: PostHistoryRecord[]): void {
        const pubkeyHex = getPubkeyHex();
        const rxNostr = getRxNostr();
        const scopeId = olderRevealRepairScopeId;
        if (!pubkeyHex || candidatePosts.length === 0) {
            return;
        }

        const visibleParentPosts =
            resolveVisibleOlderRevealChildInteractionRepairParentPosts(
                pubkeyHex,
                candidatePosts,
                getLoadedPosts(),
            );
        if (visibleParentPosts.length === 0) {
            return;
        }

        const visibleParentEventIds = visibleParentPosts.map((post) => post.eventId);

        if (!rxNostr) {
            return;
        }

        const isActive = () => isOlderRevealRepairScopeActive(
            scopeId,
            pubkeyHex,
            rxNostr,
        );
        scheduleChildInteractionDeletionRefresh(
            "listing-older-reveal",
            visibleParentEventIds,
            rxNostr,
            isActive,
        );

        const networkParentIds =
            resolveOlderRevealChildInteractionRepairNetworkParentIds(
                visibleParentEventIds,
                olderRevealFreshnessByParentId,
                olderRevealInFlightParentIds,
                now(),
            );
        const networkParentIdSet = new Set(networkParentIds);
        const networkParentPosts = visibleParentPosts.filter((post) =>
            networkParentIdSet.has(post.eventId)
        );
        if (networkParentPosts.length === 0) {
            return;
        }

        networkParentPosts.forEach((post) => {
            olderRevealInFlightParentIds.add(post.eventId);
        });

        const relationRepairTask = startRelationAwareVisibleRangeRepair({
            ownerPubkeyHex: pubkeyHex,
            rxNostr,
            visiblePosts: networkParentPosts,
            isActive,
        });
        olderRevealRelationRepairTasks.add(relationRepairTask);

        void relationRepairTask.promise
            .then((result) => {
                if (!isActive() || result.status === "cancelled") {
                    return;
                }

                void dispatchRelationRepairRefreshSignal({
                    source: "listing-older-reveal",
                    result,
                    quoteRefreshPosts: networkParentPosts,
                    isActive,
                    awaitBadgeRefresh: false,
                });

                if (result.checkedParentEventIds.length > 0) {
                    result.checkedParentEventIds.forEach((eventId) => {
                        olderRevealFreshnessByParentId.set(eventId, now());
                    });
                }
            })
            .catch(() => undefined)
            .finally(() => {
                if (scopeId !== olderRevealRepairScopeId) {
                    return;
                }

                olderRevealRelationRepairTasks.delete(relationRepairTask);
                networkParentPosts.forEach((post) => {
                    olderRevealInFlightParentIds.delete(post.eventId);
                });
            });
    }

    function cancelCurrentViewRepair(): void {
        currentViewRepairRunId += 1;
        currentViewRelationRepairTask?.cancel();
        currentViewRelationRepairTask = null;
    }

    function resetOlderRevealRepairContext(): void {
        olderRevealRepairScopeId += 1;
        olderRevealRelationRepairTasks.forEach((task) => task.cancel());
        olderRevealRelationRepairTasks.clear();
        olderRevealFreshnessByParentId.clear();
        olderRevealInFlightParentIds.clear();
    }

    function resetAllRepairs(): void {
        cancelCurrentViewRepair();
        resetOlderRevealRepairContext();
    }

    function dispose(): void {
        disposed = true;
        resetAllRepairs();
    }

    return {
        repairCurrentView,
        repairJump,
        scheduleOlderRevealRepair,
        cancelCurrentViewRepair,
        resetOlderRevealRepairContext,
        resetAllRepairs,
        dispose,
    };
}
