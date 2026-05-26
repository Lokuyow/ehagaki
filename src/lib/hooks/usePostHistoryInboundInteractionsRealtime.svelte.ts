import { onMount } from "svelte";
import type { RxNostr } from "rx-nostr";
import {
    postHistoryInboundInteractionsRealtimeService,
    type PostHistoryInboundInteractionsRealtimeSubscription,
} from "../postHistoryInboundInteractionsRealtimeService";
import { triggerPostHistoryReactionLifecycle } from "../postHistoryReactionLifecycleTrigger";
import type { RelayConfig } from "../types";
import type {
    PostHistoryInboundDirectReplyCandidate,
    PostHistoryInboundReplyReconciliationResult,
} from "../postHistoryInboundReplyReconciliationService";

interface UsePostHistoryInboundInteractionsRealtimeParams {
    getIsAuthenticated: () => boolean;
    getPubkeyHex: () => string | null | undefined;
    getRxNostr: () => RxNostr | undefined;
    getRelayConfig: () => RelayConfig | null | undefined;
    onSavedDirectReplies?: (parentEventIds: string[]) => void | Promise<void>;
    reconcileDirectReplyCandidates?: (
        candidates: PostHistoryInboundDirectReplyCandidate[],
    ) => Promise<PostHistoryInboundReplyReconciliationResult>;
}

function canUseRxNostr(rxNostr: RxNostr | undefined): rxNostr is RxNostr {
    return !!rxNostr && typeof (rxNostr as { use?: unknown }).use === "function";
}

export function usePostHistoryInboundInteractionsRealtime({
    getIsAuthenticated,
    getPubkeyHex,
    getRxNostr,
    getRelayConfig,
    onSavedDirectReplies = () => undefined,
    reconcileDirectReplyCandidates,
}: UsePostHistoryInboundInteractionsRealtimeParams) {
    const state = $state({
        visible: false,
        status: "idle" as "idle" | "subscribed",
        activePubkeyHex: null as string | null,
    });

    let currentSubscription: PostHistoryInboundInteractionsRealtimeSubscription | null = null;

    function stopCurrentSubscription(): void {
        currentSubscription?.stop();
        currentSubscription = null;
        state.status = "idle";
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
            stopCurrentSubscription();
        };
    });

    $effect(() => {
        const visible = state.visible;
        const isAuthenticated = getIsAuthenticated();
        const ownerPubkeyHex = getPubkeyHex() ?? null;
        const rxNostr = getRxNostr();
        const relayConfig = getRelayConfig();

        if (!visible || !isAuthenticated || !ownerPubkeyHex || !canUseRxNostr(rxNostr)) {
            stopCurrentSubscription();
            return;
        }

        const handleSavedDirectReplies = async (parentEventIds: string[]) => {
            await onSavedDirectReplies(parentEventIds);
            void triggerPostHistoryReactionLifecycle({
                source: "inbound-realtime",
                parentEventIds,
                rxNostr,
                relayConfig,
                isActive: () => (
                    state.visible
                    && getIsAuthenticated()
                    && getPubkeyHex() === ownerPubkeyHex
                    && getRxNostr() === rxNostr
                ),
            }).then((result) => {
                if (
                    result.status === "cancelled"
                    || result.deletedReactionEventIds.length === 0
                    || !state.visible
                    || !getIsAuthenticated()
                    || getPubkeyHex() !== ownerPubkeyHex
                    || getRxNostr() !== rxNostr
                ) {
                    return;
                }

                return Promise.resolve(onSavedDirectReplies(parentEventIds)).catch(() => undefined);
            }).catch(() => undefined);
        };

        const subscription = postHistoryInboundInteractionsRealtimeService.subscribe(rxNostr, {
            ownerPubkeyHex,
            relayConfig,
            onSavedDirectReplies: handleSavedDirectReplies,
            reconcileDirectReplyCandidates,
        });
        currentSubscription = subscription;
        state.status = "subscribed";
        state.activePubkeyHex = ownerPubkeyHex;

        return () => {
            if (currentSubscription === subscription) {
                stopCurrentSubscription();
                return;
            }

            subscription.stop();
        };
    });

    return {
        state,
        stopCurrentSubscription,
    };
}
