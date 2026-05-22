import { onMount } from "svelte";
import type { RxNostr } from "rx-nostr";
import {
    POST_HISTORY_FOREGROUND_PERIODIC_SYNC_INTERVAL_MS,
    postHistoryForegroundPeriodicSyncService,
    type PostHistoryForegroundPeriodicSyncTask,
} from "../postHistoryForegroundPeriodicSyncService";
import {
    postHistoryLightweightSyncCoordinator,
} from "../postHistoryLightweightSyncCoordinator";
import type {
    PostHistoryInboundDirectReplyCandidate,
    PostHistoryInboundReplyReconciliationResult,
} from "../postHistoryInboundReplyReconciliationService";
import type { RelayConfig } from "../types";

interface UsePostHistoryForegroundPeriodicSyncParams {
    getIsAuthenticated: () => boolean;
    getPubkeyHex: () => string | null | undefined;
    getRxNostr: () => RxNostr | undefined;
    getRelayConfig: () => RelayConfig | null | undefined;
    getReconciliationPubkeyHex: () => string | null | undefined;
    reconcileDirectReplyCandidates?: (
        candidates: PostHistoryInboundDirectReplyCandidate[],
    ) => Promise<PostHistoryInboundReplyReconciliationResult>;
    onSavedSelfPosts?: (eventIds: string[]) => void | Promise<void>;
    setTimeoutFn?: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>;
    clearTimeoutFn?: (id: ReturnType<typeof setTimeout>) => void;
}

function canUseRxNostr(rxNostr: RxNostr | undefined): rxNostr is RxNostr {
    return !!rxNostr && typeof (rxNostr as { use?: unknown }).use === "function";
}

export function usePostHistoryForegroundPeriodicSync({
    getIsAuthenticated,
    getPubkeyHex,
    getRxNostr,
    getRelayConfig,
    getReconciliationPubkeyHex,
    reconcileDirectReplyCandidates,
    onSavedSelfPosts = () => undefined,
    setTimeoutFn = setTimeout,
    clearTimeoutFn = clearTimeout,
}: UsePostHistoryForegroundPeriodicSyncParams) {
    const state = $state({
        visible: false,
        activePubkeyHex: null as string | null,
    });
    let timerId: ReturnType<typeof setTimeout> | null = null;
    let currentTask: PostHistoryForegroundPeriodicSyncTask | null = null;
    let activeOwnerPubkeyHex: string | null = null;
    let sessionGeneration = 0;

    function clearTimer(): void {
        if (timerId === null) {
            return;
        }

        clearTimeoutFn(timerId);
        timerId = null;
    }

    function stopSession(): void {
        sessionGeneration += 1;
        clearTimer();
        currentTask?.cancel();
        currentTask = null;
        if (activeOwnerPubkeyHex) {
            postHistoryLightweightSyncCoordinator.cancelOwnerTasks(activeOwnerPubkeyHex);
        }
        activeOwnerPubkeyHex = null;
        state.activePubkeyHex = null;
    }

    function scheduleNextTick(params: {
        generation: number;
        ownerPubkeyHex: string;
        rxNostr: RxNostr;
    }): void {
        clearTimer();
        timerId = setTimeoutFn(() => {
            timerId = null;
            void runTick(params);
        }, POST_HISTORY_FOREGROUND_PERIODIC_SYNC_INTERVAL_MS);
    }

    async function runTick(params: {
        generation: number;
        ownerPubkeyHex: string;
        rxNostr: RxNostr;
    }): Promise<void> {
        const isActive = () =>
            params.generation === sessionGeneration
            && state.visible
            && getIsAuthenticated()
            && getPubkeyHex() === params.ownerPubkeyHex
            && getRxNostr() === params.rxNostr
            && getReconciliationPubkeyHex() === params.ownerPubkeyHex;
        if (!isActive()) {
            return;
        }

        const task = postHistoryForegroundPeriodicSyncService.sync(params.rxNostr, {
            ownerPubkeyHex: params.ownerPubkeyHex,
            relayConfig: getRelayConfig(),
            reconcileDirectReplyCandidates,
            onSavedSelfPosts,
            isActive,
        });
        currentTask = task;
        try {
            await task.promise;
        } finally {
            if (currentTask === task) {
                currentTask = null;
            }
            if (isActive()) {
                scheduleNextTick(params);
            }
        }
    }

    onMount(() => {
        function syncVisibility(): void {
            state.visible = document.visibilityState === "visible";
            if (!state.visible) {
                stopSession();
            }
        }

        syncVisibility();
        document.addEventListener("visibilitychange", syncVisibility);

        return () => {
            document.removeEventListener("visibilitychange", syncVisibility);
            stopSession();
        };
    });

    $effect(() => {
        const visible = state.visible;
        const isAuthenticated = getIsAuthenticated();
        const ownerPubkeyHex = getPubkeyHex() ?? null;
        const reconciliationPubkeyHex = getReconciliationPubkeyHex() ?? null;
        const rxNostr = getRxNostr();

        if (
            !visible
            || !isAuthenticated
            || !ownerPubkeyHex
            || reconciliationPubkeyHex !== ownerPubkeyHex
            || !canUseRxNostr(rxNostr)
        ) {
            stopSession();
            return;
        }

        stopSession();
        const generation = ++sessionGeneration;
        activeOwnerPubkeyHex = ownerPubkeyHex;
        state.activePubkeyHex = ownerPubkeyHex;
        scheduleNextTick({ generation, ownerPubkeyHex, rxNostr });

        return () => {
            if (generation === sessionGeneration) {
                stopSession();
            }
        };
    });

    return {
        state,
        stopSession,
    };
}
