<script lang="ts">
    import type { RxNostr } from "rx-nostr";
    import {
        usePostHistoryForegroundPeriodicSync,
    } from "../../../lib/hooks/usePostHistoryForegroundPeriodicSync.svelte";

    interface Props {
        isAuthenticated: boolean;
        pubkeyHex: string | null;
        reconciliationPubkeyHex: string | null;
        rxNostr: RxNostr | undefined;
    }

    let {
        isAuthenticated,
        pubkeyHex,
        reconciliationPubkeyHex,
        rxNostr,
    }: Props = $props();

    usePostHistoryForegroundPeriodicSync({
        getIsAuthenticated: () => isAuthenticated,
        getPubkeyHex: () => pubkeyHex,
        getRxNostr: () => rxNostr,
        getRelayConfig: () => null,
        getReconciliationPubkeyHex: () => reconciliationPubkeyHex,
    });
</script>

