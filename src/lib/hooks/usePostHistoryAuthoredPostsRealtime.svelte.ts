import { onMount } from "svelte";
import type { RxNostr } from "rx-nostr";
import {
    postHistoryAuthoredPostsRealtimeService,
    type PostHistoryAuthoredPostsRealtimeSubscription,
} from "../postHistoryAuthoredPostsRealtimeService";
import type { RelayConfig } from "../types";

interface UsePostHistoryAuthoredPostsRealtimeParams {
    getIsAuthenticated: () => boolean;
    getPubkeyHex: () => string | null | undefined;
    getRxNostr: () => RxNostr | undefined;
    getRelayConfig: () => RelayConfig | null | undefined;
    onSavedSelfPosts?: (eventIds: string[]) => void | Promise<void>;
}

function canUseRxNostr(rxNostr: RxNostr | undefined): rxNostr is RxNostr {
    return !!rxNostr && typeof (rxNostr as { use?: unknown }).use === "function";
}

export function usePostHistoryAuthoredPostsRealtime({
    getIsAuthenticated,
    getPubkeyHex,
    getRxNostr,
    getRelayConfig,
    onSavedSelfPosts = () => undefined,
}: UsePostHistoryAuthoredPostsRealtimeParams) {
    const state = $state({
        visible: false,
        status: "idle" as "idle" | "subscribed",
        activePubkeyHex: null as string | null,
    });
    let currentSubscription: PostHistoryAuthoredPostsRealtimeSubscription | null = null;

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

        const subscription = postHistoryAuthoredPostsRealtimeService.subscribe(rxNostr, {
            ownerPubkeyHex,
            relayConfig,
            onSavedSelfPosts,
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
