import { onMount } from "svelte";
import type { RxNostr } from "rx-nostr";
import {
    postHistoryInboundReplyReconciliationService,
    type PostHistoryInboundDirectReplyCandidate,
    type PostHistoryInboundReplyReconciliationResult,
    type PostHistoryInboundReplyReconciliationSession,
} from "../postHistoryInboundReplyReconciliationService";
import type { RelayConfig } from "../types";

interface UsePostHistoryInboundReplyReconciliationParams {
    getIsAuthenticated: () => boolean;
    getPubkeyHex: () => string | null | undefined;
    getRxNostr: () => RxNostr | undefined;
    getRelayConfig: () => RelayConfig | null | undefined;
    onSavedDirectReplies?: (parentEventIds: string[]) => void | Promise<void>;
}

function emptyResult(): PostHistoryInboundReplyReconciliationResult {
    return {
        savedParentEventIds: [],
        savedDirectReplyCount: 0,
        unresolvedParentEventIds: [],
    };
}

function canUseRxNostr(rxNostr: RxNostr | undefined): rxNostr is RxNostr {
    return !!rxNostr && typeof (rxNostr as { use?: unknown }).use === "function";
}

export function usePostHistoryInboundReplyReconciliation({
    getIsAuthenticated,
    getPubkeyHex,
    getRxNostr,
    getRelayConfig,
    onSavedDirectReplies = () => undefined,
}: UsePostHistoryInboundReplyReconciliationParams) {
    const state = $state({
        visible: false,
        activePubkeyHex: null as string | null,
    });
    let currentSession: PostHistoryInboundReplyReconciliationSession | null = null;

    function stopCurrentSession(): void {
        currentSession?.stop();
        currentSession = null;
        state.activePubkeyHex = null;
    }

    onMount(() => {
        function syncVisibility(): void {
            state.visible = document.visibilityState === "visible";
        }

        syncVisibility();
        document.addEventListener("visibilitychange", syncVisibility);

        return () => {
            document.removeEventListener("visibilitychange", syncVisibility);
            stopCurrentSession();
        };
    });

    $effect(() => {
        const visible = state.visible;
        const isAuthenticated = getIsAuthenticated();
        const ownerPubkeyHex = getPubkeyHex() ?? null;
        const rxNostr = getRxNostr();
        const relayConfig = getRelayConfig();

        if (!visible || !isAuthenticated || !ownerPubkeyHex || !canUseRxNostr(rxNostr)) {
            stopCurrentSession();
            return;
        }

        const session = postHistoryInboundReplyReconciliationService.createSession(rxNostr, {
            ownerPubkeyHex,
            relayConfig,
            onSavedDirectReplies,
        });
        currentSession = session;
        state.activePubkeyHex = ownerPubkeyHex;

        return () => {
            if (currentSession === session) {
                stopCurrentSession();
                return;
            }

            session.stop();
        };
    });

    return {
        state,
        reconcileDirectReplyCandidates: (
            candidates: PostHistoryInboundDirectReplyCandidate[],
        ) => currentSession?.reconcile(candidates) ?? Promise.resolve(emptyResult()),
        notifySelfPostsSaved: (eventIds: string[]) =>
            currentSession?.notifySelfPostsSaved(eventIds) ?? Promise.resolve(emptyResult()),
        stopCurrentSession,
    };
}
