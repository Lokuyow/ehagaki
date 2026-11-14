import type { RxNostr } from "rx-nostr";
import {
    postHistoryCurrentViewRefetchService,
    type PostHistoryCurrentViewRefetchTask,
} from "./postHistoryCurrentViewRefetchService";
import {
    buildPostHistoryManualRepairRelationPhases,
    buildPostHistoryRepairPreferredRanges,
    reportPostHistoryManualRepairPhase,
    resolvePostHistoryManualRepairFailure,
    resolvePostHistoryManualRepairResultMessage,
    summarizePostHistoryManualRepairFetchCounts,
    type PostHistoryManualRepairPhase,
} from "./postHistoryListingRepair";
import type {
    PostHistoryCurrentViewRelationRepairRequest,
    PostHistoryRelationRepairSummary,
} from "./postHistoryVisibleRangeRelationRepairCoordinator";
import type { PostHistoryRecord } from "./storage/ehagakiDb";
import type { RelayConfig } from "./types";

export type PostHistoryCurrentViewRefetchMessageValues = Record<
    string,
    string | number | boolean | Date | null | undefined
>;

/** The slice of the listing hook's reactive state that manual repair reads and writes. */
export interface PostHistoryListingRepairState {
    currentViewRefetchStatus: "idle" | "refetching";
    currentViewRefetchMessageKey: string | null;
    currentViewRefetchMessageValues: PostHistoryCurrentViewRefetchMessageValues | null;
    readonly searchQuery: string;
    readonly searchPage: number;
    readonly loadedPosts: PostHistoryRecord[];
    readonly hasNewerLocal: boolean;
}

export interface PostHistoryListingRepairControllerDeps {
    state: PostHistoryListingRepairState;
    getShow: () => boolean;
    getPubkeyHex: () => string | null | undefined;
    getRxNostr: () => RxNostr | undefined;
    getRelayConfig: () => RelayConfig | null | undefined;
    canRefetchAroundCurrentView: () => boolean;
    clearContiguousProgress: () => void;
    refreshVisibleUntil: (pubkeyHex: string) => Promise<number | null>;
    startLocalRepairRead: (bounds: { since: number; until: number }) => unknown;
    /**
     * Re-read the visible floor after the primary refetch. The listing hook
     * applies it only while its own generation and this repair task are current.
     */
    extendVisibleUntilAfterRefetch: (
        pubkeyHex: string,
        isCurrentRepairTask: () => boolean,
    ) => Promise<unknown>;
    rebuildSearchResultsThroughPage: (page: number, query: string) => Promise<unknown>;
    loadLatestVisiblePosts: (options: { skipTotalCountRefresh: boolean }) => Promise<unknown>;
    reloadVisibleWindowFromCurrentNewest: (
        options: { skipTotalCountRefresh: boolean },
    ) => Promise<unknown>;
    repairCurrentViewRelations: (
        request: PostHistoryCurrentViewRelationRepairRequest,
    ) => Promise<PostHistoryRelationRepairSummary>;
    cancelCurrentViewRelationRepair: () => void;
    refreshTotalCount: (options: { force: boolean }) => void;
}

/**
 * Manual repair of the visible range ("refetch around current view"): owns the
 * running refetch task and the auto-hiding result message. Listing state stays
 * in the hook and is reached through deps.
 */
export function createPostHistoryListingRepairController(
    deps: PostHistoryListingRepairControllerDeps,
) {
    const { state, getShow, getPubkeyHex, getRxNostr, getRelayConfig } = deps;
    let currentViewRefetchTask: PostHistoryCurrentViewRefetchTask | null = null;
    let currentViewRefetchMessageClearTimeout: ReturnType<typeof setTimeout> | null = null;

    function cancelCurrentViewRefetch(): void {
        currentViewRefetchTask?.cancel();
        currentViewRefetchTask = null;
        deps.cancelCurrentViewRelationRepair();
        if (state.currentViewRefetchStatus === "refetching") {
            state.currentViewRefetchStatus = "idle";
        }
        clearCurrentViewRefetchMessageClearTimeout();
    }

    function clearCurrentViewRefetchMessageClearTimeout(): void {
        if (currentViewRefetchMessageClearTimeout !== null) {
            clearTimeout(currentViewRefetchMessageClearTimeout);
            currentViewRefetchMessageClearTimeout = null;
        }
    }

    function clearCurrentViewRefetchFeedback(): void {
        state.currentViewRefetchMessageKey = null;
        state.currentViewRefetchMessageValues = null;
        clearCurrentViewRefetchMessageClearTimeout();
    }

    function scheduleCurrentViewRefetchMessageClearIfNeeded(): void {
        clearCurrentViewRefetchMessageClearTimeout();

        const autoHideMessageKeys = new Set([
            "postHistory.repairNoChanges",
            "postHistory.repairAdded",
            "postHistory.repairChildInteractionsAdded",
            "postHistory.repairFetchFailed",
        ]);

        if (!autoHideMessageKeys.has(state.currentViewRefetchMessageKey ?? "")) {
            return;
        }

        currentViewRefetchMessageClearTimeout = setTimeout(() => {
            if (state.currentViewRefetchMessageKey !== null && autoHideMessageKeys.has(state.currentViewRefetchMessageKey)) {
                state.currentViewRefetchMessageKey = null;
                state.currentViewRefetchMessageValues = null;
            }
            currentViewRefetchMessageClearTimeout = null;
        }, 3500);
    }

    function buildCurrentPagePreferredRanges() {
        if (state.searchQuery) {
            return [];
        }

        return buildPostHistoryRepairPreferredRanges(state.loadedPosts);
    }

    async function refetchAroundCurrentView(): Promise<void> {
        deps.clearContiguousProgress();
        const pubkeyHex = getPubkeyHex();
        const rxNostr = getRxNostr();
        if (!pubkeyHex || !rxNostr || !deps.canRefetchAroundCurrentView()) {
            return;
        }

        const preferredRanges = buildCurrentPagePreferredRanges();
        if (preferredRanges.length === 0) {
            return;
        }

        clearCurrentViewRefetchFeedback();
        state.currentViewRefetchStatus = "refetching";
        let reportedFailurePhase: PostHistoryManualRepairPhase | null = null;
        const initialVisibleRangeStateStartedAt = Date.now();
        try {
            await deps.refreshVisibleUntil(pubkeyHex);
            reportPostHistoryManualRepairPhase({
                phase: "visible-range-state",
                startedAt: initialVisibleRangeStateStartedAt,
            });
        } catch (error) {
            reportPostHistoryManualRepairPhase({
                phase: "visible-range-state",
                startedAt: initialVisibleRangeStateStartedAt,
                error,
            });
            state.currentViewRefetchStatus = "idle";
            state.currentViewRefetchMessageKey = "postHistory.repairFetchFailed";
            state.currentViewRefetchMessageValues = null;
            scheduleCurrentViewRefetchMessageClearIfNeeded();
            return;
        }

        let task: PostHistoryCurrentViewRefetchTask;
        const primaryFetchStartedAt = Date.now();
        try {
            task = postHistoryCurrentViewRefetchService.refetchAroundCurrentView(rxNostr, {
                pubkeyHex,
                relayConfig: getRelayConfig(),
                preferredRanges,
                getRelayConfig,
                isActive: () => getShow() && getPubkeyHex() === pubkeyHex && getRxNostr() === rxNostr,
                onProgress: async () => undefined,
            });
        } catch (error) {
            reportPostHistoryManualRepairPhase({
                phase: "primary-fetch",
                startedAt: primaryFetchStartedAt,
                error,
            });
            state.currentViewRefetchStatus = "idle";
            state.currentViewRefetchMessageKey = "postHistory.repairFetchFailed";
            state.currentViewRefetchMessageValues = null;
            scheduleCurrentViewRefetchMessageClearIfNeeded();
            return;
        }
        currentViewRefetchTask = task;
        deps.startLocalRepairRead({
            since: Math.min(...preferredRanges.map((range) => range.since)),
            until: Math.max(...preferredRanges.map((range) => range.until)),
        });
        let primaryRefetchReloadCompleted = false;
        let activePhaseStartedAt = primaryFetchStartedAt;

        try {
            const result = await task.promise;
            if (currentViewRefetchTask !== task) {
                return;
            }

            reportPostHistoryManualRepairPhase({
                phase: "primary-fetch",
                startedAt: primaryFetchStartedAt,
                durationMs: result.timing?.primaryFetchDurationMs ?? 0,
                counts: summarizePostHistoryManualRepairFetchCounts(result),
            });
            if ((result.timing?.primaryPersistAttemptCount ?? 0) > 0) {
                reportPostHistoryManualRepairPhase({
                    phase: "primary-persist",
                    startedAt: primaryFetchStartedAt,
                    durationMs: result.timing?.primaryPersistDurationMs ?? 0,
                    counts: {
                        persistedRangeCount: result.timing?.primaryPersistAttemptCount ?? 0,
                    },
                });
            }

            if (!getShow() || result.status === "cancelled") {
                currentViewRefetchTask = null;
                state.currentViewRefetchStatus = "idle";
                return;
            }

            const visibleRangeStateStartedAt = Date.now();
            activePhaseStartedAt = visibleRangeStateStartedAt;
            try {
                const taskAtExtend = currentViewRefetchTask;
                await deps.extendVisibleUntilAfterRefetch(
                    pubkeyHex,
                    () => taskAtExtend === currentViewRefetchTask,
                );
                reportPostHistoryManualRepairPhase({
                    phase: "visible-range-state",
                    startedAt: visibleRangeStateStartedAt,
                    counts: { processedRangeCount: result.processedRangeCount },
                });
            } catch (error) {
                reportedFailurePhase = "visible-range-state";
                reportPostHistoryManualRepairPhase({
                    phase: "visible-range-state",
                    startedAt: visibleRangeStateStartedAt,
                    error,
                    counts: { processedRangeCount: result.processedRangeCount },
                });
                throw error;
            }

            const visibleWindowReloadStartedAt = Date.now();
            activePhaseStartedAt = visibleWindowReloadStartedAt;
            try {
                if (state.searchQuery) {
                    await deps.rebuildSearchResultsThroughPage(
                        state.searchPage,
                        state.searchQuery,
                    );
                } else if (state.loadedPosts.length === 0 || !state.hasNewerLocal) {
                    await deps.loadLatestVisiblePosts({ skipTotalCountRefresh: true });
                } else {
                    await deps.reloadVisibleWindowFromCurrentNewest({ skipTotalCountRefresh: true });
                }
                reportPostHistoryManualRepairPhase({
                    phase: "visible-window-reload",
                    startedAt: visibleWindowReloadStartedAt,
                    counts: { processedRangeCount: result.processedRangeCount },
                });
            } catch (error) {
                reportedFailurePhase = "visible-window-reload";
                reportPostHistoryManualRepairPhase({
                    phase: "visible-window-reload",
                    startedAt: visibleWindowReloadStartedAt,
                    error,
                    counts: { processedRangeCount: result.processedRangeCount },
                });
                throw error;
            }
            primaryRefetchReloadCompleted = true;

            let childInteractionRepairResult: PostHistoryRelationRepairSummary | null = null;
            if (
                currentViewRefetchTask === task
                && getShow()
                && getPubkeyHex() === pubkeyHex
                && getRxNostr() === rxNostr
                && state.loadedPosts.length > 0
            ) {
                const relationRepairStartedAt = Date.now();
                activePhaseStartedAt = relationRepairStartedAt;
                childInteractionRepairResult =
                    await deps.repairCurrentViewRelations({
                        ownerPubkeyHex: pubkeyHex,
                        rxNostr,
                        visiblePosts: state.loadedPosts,
                        isActive: () =>
                            currentViewRefetchTask === task
                            && getShow()
                            && getPubkeyHex() === pubkeyHex
                            && getRxNostr() === rxNostr,
                    });
                if (
                    currentViewRefetchTask !== task
                    || childInteractionRepairResult.status === "cancelled"
                    || !getShow()
                ) {
                    return;
                }
                for (const phase of buildPostHistoryManualRepairRelationPhases(
                    childInteractionRepairResult,
                    relationRepairStartedAt,
                )) {
                    reportPostHistoryManualRepairPhase(phase);
                }
            }

            if (
                currentViewRefetchTask !== task
                || !getShow()
                || getPubkeyHex() !== pubkeyHex
                || getRxNostr() !== rxNostr
            ) {
                return;
            }

            if (!state.searchQuery) {
                deps.refreshTotalCount({ force: true });
            }

            currentViewRefetchTask = null;
            state.currentViewRefetchStatus = "idle";

            const message = resolvePostHistoryManualRepairResultMessage(
                result,
                childInteractionRepairResult?.savedDirectReplyCount ?? 0,
            );
            state.currentViewRefetchMessageKey = message.key;
            state.currentViewRefetchMessageValues = message.values;

            scheduleCurrentViewRefetchMessageClearIfNeeded();
        } catch (error) {
            if (currentViewRefetchTask !== task) {
                return;
            }

            if (!reportedFailurePhase) {
                const failure = resolvePostHistoryManualRepairFailure({
                    error,
                    activePhaseStartedAt,
                    primaryRefetchReloadCompleted,
                });
                reportPostHistoryManualRepairPhase({
                    phase: failure.phase,
                    startedAt: failure.startedAt,
                    error,
                    errorClass: failure.errorClass,
                });
            }

            if (
                primaryRefetchReloadCompleted
                && !state.searchQuery
                && getShow()
                && getPubkeyHex() === pubkeyHex
                && getRxNostr() === rxNostr
            ) {
                deps.refreshTotalCount({ force: true });
            }

            currentViewRefetchTask = null;
            state.currentViewRefetchStatus = "idle";
            state.currentViewRefetchMessageKey = primaryRefetchReloadCompleted
                ? "postHistory.repairNoChanges"
                : "postHistory.repairFetchFailed";
            state.currentViewRefetchMessageValues = null;
            scheduleCurrentViewRefetchMessageClearIfNeeded();
        }
    }

    return {
        cancelCurrentViewRefetch,
        clearCurrentViewRefetchFeedback,
        scheduleCurrentViewRefetchMessageClearIfNeeded,
        refetchAroundCurrentView,
    };
}
