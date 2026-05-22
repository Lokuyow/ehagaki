import { onMount } from "svelte";
import type { RxNostr } from "rx-nostr";
import type {
    PostHistoryInboundDirectReplyCandidate,
    PostHistoryInboundReplyReconciliationResult,
} from "../postHistoryInboundReplyReconciliationService";
import {
    postHistoryVisibilityResumeSyncService,
    type PostHistoryVisibilityResumeSyncTask,
} from "../postHistoryVisibilityResumeSyncService";
import type { RelayConfig } from "../types";

export const POST_HISTORY_VISIBILITY_RESUME_MIN_HIDDEN_SECONDS = 30;

interface UsePostHistoryVisibilityResumeSyncParams {
    getIsAuthenticated: () => boolean;
    getPubkeyHex: () => string | null | undefined;
    getRxNostr: () => RxNostr | undefined;
    getRelayConfig: () => RelayConfig | null | undefined;
    getReconciliationPubkeyHex: () => string | null | undefined;
    reconcileDirectReplyCandidates?: (
        candidates: PostHistoryInboundDirectReplyCandidate[],
    ) => Promise<PostHistoryInboundReplyReconciliationResult>;
    onSavedSelfPosts?: (eventIds: string[]) => void | Promise<void>;
    now?: () => number;
}

function canUseRxNostr(rxNostr: RxNostr | undefined): rxNostr is RxNostr {
    return !!rxNostr && typeof (rxNostr as { use?: unknown }).use === "function";
}

export function usePostHistoryVisibilityResumeSync({
    getIsAuthenticated,
    getPubkeyHex,
    getRxNostr,
    getRelayConfig,
    getReconciliationPubkeyHex,
    reconcileDirectReplyCandidates,
    onSavedSelfPosts = () => undefined,
    now = Date.now,
}: UsePostHistoryVisibilityResumeSyncParams) {
    const state = $state({
        visible: false,
        hiddenAtSeconds: null as number | null,
        pendingResumeSince: null as number | null,
        activePubkeyHex: null as string | null,
    });
    let currentTask: PostHistoryVisibilityResumeSyncTask | null = null;
    let requestGeneration = 0;

    function cancelCurrentSync(): void {
        requestGeneration += 1;
        currentTask?.cancel();
        currentTask = null;
    }

    function recordHiddenAt(): void {
        const hiddenAtSeconds = Math.max(0, Math.floor(now() / 1000));
        state.hiddenAtSeconds = hiddenAtSeconds;
        state.pendingResumeSince = null;
        state.visible = false;
        cancelCurrentSync();
    }

    function recordVisibleResume(): void {
        const hiddenAtSeconds = state.hiddenAtSeconds;
        const visibleAtSeconds = Math.max(0, Math.floor(now() / 1000));
        state.visible = true;
        state.hiddenAtSeconds = null;
        if (
            typeof hiddenAtSeconds === "number"
            && visibleAtSeconds - hiddenAtSeconds >= POST_HISTORY_VISIBILITY_RESUME_MIN_HIDDEN_SECONDS
        ) {
            state.pendingResumeSince = hiddenAtSeconds;
        }
    }

    onMount(() => {
        function syncVisibility(): void {
            if (document.visibilityState === "visible") {
                recordVisibleResume();
                return;
            }

            recordHiddenAt();
        }

        syncVisibility();
        document.addEventListener("visibilitychange", syncVisibility);

        return () => {
            document.removeEventListener("visibilitychange", syncVisibility);
            cancelCurrentSync();
        };
    });

    $effect(() => {
        const ownerPubkeyHex = getPubkeyHex() ?? null;
        if (ownerPubkeyHex === state.activePubkeyHex) {
            return;
        }

        cancelCurrentSync();
        state.activePubkeyHex = ownerPubkeyHex;
        state.pendingResumeSince = null;
    });

    $effect(() => {
        const visible = state.visible;
        const pendingResumeSince = state.pendingResumeSince;
        const isAuthenticated = getIsAuthenticated();
        const ownerPubkeyHex = getPubkeyHex() ?? null;
        const reconciliationPubkeyHex = getReconciliationPubkeyHex() ?? null;
        const rxNostr = getRxNostr();
        const relayConfig = getRelayConfig();

        if (
            !visible
            || typeof pendingResumeSince !== "number"
            || !isAuthenticated
            || !ownerPubkeyHex
            || reconciliationPubkeyHex !== ownerPubkeyHex
            || !canUseRxNostr(rxNostr)
        ) {
            return;
        }

        state.pendingResumeSince = null;
        cancelCurrentSync();
        const activeRequestGeneration = ++requestGeneration;
        const task = postHistoryVisibilityResumeSyncService.syncAfterVisibilityResume(rxNostr, {
            ownerPubkeyHex,
            relayConfig,
            hiddenAtSeconds: pendingResumeSince,
            reconcileDirectReplyCandidates,
            onSavedSelfPosts,
            isActive: () =>
                activeRequestGeneration === requestGeneration
                && state.visible
                && getIsAuthenticated()
                && getPubkeyHex() === ownerPubkeyHex
                && getRxNostr() === rxNostr
                && getReconciliationPubkeyHex() === ownerPubkeyHex,
        });
        currentTask = task;

        void task.promise.finally(() => {
            if (currentTask === task) {
                currentTask = null;
            }
        });

        return () => {
            if (currentTask === task) {
                cancelCurrentSync();
                return;
            }

            task.cancel();
        };
    });

    return {
        state,
        cancelCurrentSync,
    };
}
