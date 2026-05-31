import type { RxNostr } from "rx-nostr";
import {
    POST_HISTORY_INBOUND_INTERACTIONS_DIALOG_REFRESH_TTL_MS,
    postHistoryInboundInteractionsSyncService,
    type PostHistoryInboundInteractionsSyncTask,
} from "../postHistoryInboundInteractionsSyncService";
import { postHistoryLightweightSyncCoordinator } from "../postHistoryLightweightSyncCoordinator";
import {
    postHistoryInboundInteractionsSyncStateRepository,
} from "../storage/postHistoryInboundInteractionsSyncStateRepository";
import { triggerPostHistoryReactionLifecycle } from "../postHistoryReactionLifecycleTrigger";
import { triggerPostHistoryDirectReplyLifecycle } from "../postHistoryDirectReplyLifecycleTrigger";
import type { PostHistoryRecord } from "../storage/ehagakiDb";
import type { RelayConfig } from "../types";
import type {
    PostHistoryInboundDirectReplyCandidate,
    PostHistoryInboundReplyReconciliationResult,
} from "../postHistoryInboundReplyReconciliationService";

interface UsePostHistoryInboundInteractionsSyncParams {
    getShow: () => boolean;
    getPubkeyHex: () => string | null | undefined;
    getRxNostr: () => RxNostr | undefined;
    getRelayConfig: () => RelayConfig | null | undefined;
    getPosts: () => PostHistoryRecord[];
    onSavedInboundInteractions?: (parentEventIds: string[]) => void | Promise<void>;
    reconcileDirectReplyCandidates?: (
        candidates: PostHistoryInboundDirectReplyCandidate[],
    ) => Promise<PostHistoryInboundReplyReconciliationResult>;
}

function canUseRxNostr(rxNostr: RxNostr | undefined): rxNostr is RxNostr {
    return !!rxNostr && typeof (rxNostr as { use?: unknown }).use === "function";
}

export function usePostHistoryInboundInteractionsSync({
    getShow,
    getPubkeyHex,
    getRxNostr,
    getRelayConfig,
    getPosts,
    onSavedInboundInteractions = () => undefined,
    reconcileDirectReplyCandidates,
}: UsePostHistoryInboundInteractionsSyncParams) {
    const state = $state({
        status: "idle" as "idle" | "syncing",
        activePubkeyHex: null as string | null,
        hasStartedInitialDialogBootstrap: false,
    });

    let currentTask: PostHistoryInboundInteractionsSyncTask | null = null;
    let requestId = 0;

    function cancelCurrentSync(): void {
        requestId += 1;
        currentTask?.cancel();
        currentTask = null;
        state.status = "idle";
    }

    async function runSync(reason: "initial-dialog-bootstrap" | "dialog-open-refresh"): Promise<void> {
        const ownerPubkeyHex = getPubkeyHex();
        const rxNostr = getRxNostr();
        if (!getShow() || !ownerPubkeyHex || !canUseRxNostr(rxNostr) || getPosts().length === 0) {
            return;
        }

        if (reason === "dialog-open-refresh") {
            const syncState = await postHistoryInboundInteractionsSyncStateRepository.get(ownerPubkeyHex);
            if (
                typeof syncState?.lastDialogRefreshAt === "number"
                && Date.now() - syncState.lastDialogRefreshAt < POST_HISTORY_INBOUND_INTERACTIONS_DIALOG_REFRESH_TTL_MS
            ) {
                return;
            }
        }

        cancelCurrentSync();
        const activeRequestId = ++requestId;
        state.status = "syncing";
        const task = reason === "dialog-open-refresh"
            ? postHistoryLightweightSyncCoordinator.runInbound(rxNostr, {
                ownerPubkeyHex,
                relayConfig: getRelayConfig(),
                reason,
                reconcileDirectReplyCandidates,
            })
            : {
                ...postHistoryInboundInteractionsSyncService.syncRecent(rxNostr, {
                    ownerPubkeyHex,
                    relayConfig: getRelayConfig(),
                    reason,
                    reconcileDirectReplyCandidates,
                }),
                joinedExisting: false,
            };
        currentTask = task;

        const result = await task.promise;
        if (
            activeRequestId !== requestId
            || currentTask !== task
            || !getShow()
            || getPubkeyHex() !== ownerPubkeyHex
        ) {
            return;
        }

        currentTask = null;
        state.status = "idle";
        if (
            task.joinedExisting
            || result.status === "cancelled"
            || result.changedParentEventIds.length === 0
        ) {
            return;
        }

        await onSavedInboundInteractions(result.changedParentEventIds);

        void triggerPostHistoryReactionLifecycle({
            source: "dialog-inbound-sync",
            parentEventIds: result.changedParentEventIds,
            rxNostr,
            relayConfig: getRelayConfig(),
            isActive: () => (
                getShow()
                && getPubkeyHex() === ownerPubkeyHex
                && getRxNostr() === rxNostr
            ),
        }).then((lifecycleResult) => {
            if (
                lifecycleResult.status === "cancelled"
                || lifecycleResult.deletedReactionEventIds.length === 0
                || !getShow()
                || getPubkeyHex() !== ownerPubkeyHex
                || getRxNostr() !== rxNostr
            ) {
                return;
            }

            return Promise.resolve(
                onSavedInboundInteractions(result.changedParentEventIds),
            ).catch(() => undefined);
        }).catch(() => undefined);

        void triggerPostHistoryDirectReplyLifecycle({
            source: "dialog-inbound-sync",
            parentEventIds: result.changedParentEventIds,
            rxNostr,
            relayConfig: getRelayConfig(),
            isActive: () => (
                getShow()
                && getPubkeyHex() === ownerPubkeyHex
                && getRxNostr() === rxNostr
            ),
        }).then((lifecycleResult) => {
            if (
                lifecycleResult.status === "cancelled"
                || lifecycleResult.deletedReplyEventIds.length === 0
                || !getShow()
                || getPubkeyHex() !== ownerPubkeyHex
                || getRxNostr() !== rxNostr
            ) {
                return;
            }

            return Promise.resolve(
                onSavedInboundInteractions(result.changedParentEventIds),
            ).catch(() => undefined);
        }).catch(() => undefined);
    }

    async function runInitialDialogSync(): Promise<void> {
        const ownerPubkeyHex = getPubkeyHex();
        if (!ownerPubkeyHex) {
            return;
        }

        const syncState = await postHistoryInboundInteractionsSyncStateRepository.get(ownerPubkeyHex);
        await runSync(syncState?.lastSyncedAt ? "dialog-open-refresh" : "initial-dialog-bootstrap");
    }

    $effect(() => {
        const nextPubkeyHex = getPubkeyHex() ?? null;
        if (nextPubkeyHex === state.activePubkeyHex) {
            return;
        }

        cancelCurrentSync();
        state.activePubkeyHex = nextPubkeyHex;
        state.hasStartedInitialDialogBootstrap = false;
    });

    $effect(() => {
        if (!getShow()) {
            cancelCurrentSync();
            state.hasStartedInitialDialogBootstrap = false;
            return;
        }

        if (!getPubkeyHex() || !canUseRxNostr(getRxNostr()) || getPosts().length === 0) {
            return;
        }

        if (state.hasStartedInitialDialogBootstrap) {
            return;
        }

        state.hasStartedInitialDialogBootstrap = true;
        void runInitialDialogSync();
    });

    return {
        state,
        cancelCurrentSync,
        runSync,
    };
}
