import { getPostHistoryAuthoredRelayScopeKey } from "../postHistoryRelayResolver";
import { onMount } from "svelte";
import type { RxNostr } from "rx-nostr";
import {
    postHistoryInboundInteractionsRealtimeService,
    type PostHistoryInboundInteractionsRealtimeSubscription,
} from "../postHistoryInboundInteractionsRealtimeService";
import { triggerPostHistoryChildInteractionDeletionLifecycle } from "../postHistoryChildInteractionDeletionLifecycleTrigger";
import type { RelayConfig } from "../types";
import type {
    PostHistoryInboundDirectReplyCandidate,
    PostHistoryInboundReplyReconciliationResult,
} from "../postHistoryInboundReplyReconciliationService";

interface UsePostHistoryInboundInteractionsRealtimeParams {
    getNotificationsEnabled?: () => boolean;
    getIsAuthenticated: () => boolean;
    getPubkeyHex: () => string | null | undefined;
    getRxNostr: () => RxNostr | undefined;
    getRelayConfig: () => RelayConfig | null | undefined;
    onSavedInboundInteractions?: (parentEventIds: string[]) => void | Promise<void>;
    reconcileDirectReplyCandidates?: (
        candidates: PostHistoryInboundDirectReplyCandidate[],
    ) => Promise<PostHistoryInboundReplyReconciliationResult>;
}

function canUseRxNostr(rxNostr: RxNostr | undefined): rxNostr is RxNostr {
    return !!rxNostr && typeof (rxNostr as { use?: unknown }).use === "function";
}

export function usePostHistoryInboundInteractionsRealtime({
    getNotificationsEnabled = () => true,
    getIsAuthenticated,
    getPubkeyHex,
    getRxNostr,
    getRelayConfig,
    onSavedInboundInteractions = () => undefined,
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
        const includeNotifications = getNotificationsEnabled();

        if (!visible || !isAuthenticated || !ownerPubkeyHex || !canUseRxNostr(rxNostr)) {
            stopCurrentSubscription();
            return;
        }

        let active = true;
        const scope = getPostHistoryAuthoredRelayScopeKey(relayConfig);
        const owned = () => active && state.visible && getIsAuthenticated()
            && getPubkeyHex() === ownerPubkeyHex && getRxNostr() === rxNostr
            && getNotificationsEnabled() === includeNotifications
            && getPostHistoryAuthoredRelayScopeKey(getRelayConfig()) === scope;
        const handleSavedInboundInteractions = async (parentEventIds: string[]) => {
            if (!owned()) return;
            await onSavedInboundInteractions(parentEventIds);
            if (!owned()) return;
            void triggerPostHistoryChildInteractionDeletionLifecycle({
                source: "inbound-realtime",
                parentEventIds,
                rxNostr,
                relayConfig,
                isActive: owned,
            }).then((result) => {
                if (
                    result.status === "cancelled"
                    || (
                        result.deletedReactionEventIds.length === 0
                        && result.deletedReplyEventIds.length === 0
                    )
                    || !owned()
                ) {
                    return;
                }

                return Promise.resolve(onSavedInboundInteractions(parentEventIds)).catch(() => undefined);
            }).catch(() => undefined);
        };

        const subscription = postHistoryInboundInteractionsRealtimeService.subscribe(rxNostr, {
            includeNotifications,
            isActive: owned,
            ownerPubkeyHex,
            relayConfig,
            onSavedInboundInteractions: handleSavedInboundInteractions,
            reconcileDirectReplyCandidates,
        });
        currentSubscription = subscription;
        state.status = "subscribed";
        state.activePubkeyHex = ownerPubkeyHex;

        return () => {
            active = false;
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
