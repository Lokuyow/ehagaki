<script lang="ts">
    import type { RxNostr } from "rx-nostr";
    import {
        usePostHistoryAuthoredPostsRealtime,
    } from "../../../lib/hooks/usePostHistoryAuthoredPostsRealtime.svelte";
    import {
        usePostHistoryInboundInteractionsRealtime,
    } from "../../../lib/hooks/usePostHistoryInboundInteractionsRealtime.svelte";
    import {
        usePostHistoryVisibilityResumeSync,
    } from "../../../lib/hooks/usePostHistoryVisibilityResumeSync.svelte";

    interface Props {
        pubkeyHex: string;
        rxNostr: RxNostr;
        now: () => number;
    }

    let { pubkeyHex, rxNostr, now }: Props = $props();

    usePostHistoryVisibilityResumeSync({
        getIsAuthenticated: () => true,
        getPubkeyHex: () => pubkeyHex,
        getRxNostr: () => rxNostr,
        getRelayConfig: () => null,
        getReconciliationPubkeyHex: () => pubkeyHex,
        now: () => now(),
    });

    usePostHistoryAuthoredPostsRealtime({
        getIsAuthenticated: () => true,
        getPubkeyHex: () => pubkeyHex,
        getRxNostr: () => rxNostr,
        getRelayConfig: () => null,
    });

    usePostHistoryInboundInteractionsRealtime({
        getIsAuthenticated: () => true,
        getPubkeyHex: () => pubkeyHex,
        getRxNostr: () => rxNostr,
        getRelayConfig: () => null,
    });
</script>
