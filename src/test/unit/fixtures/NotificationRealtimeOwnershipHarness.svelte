<script lang="ts">
    import type { RxNostr } from 'rx-nostr';
    import type { RelayConfig } from '../../../lib/types';
    import { usePostHistoryInboundInteractionsRealtime } from '../../../lib/hooks/usePostHistoryInboundInteractionsRealtime.svelte';
    let { owner, runtime, relays, enabled = true, authenticated = true }: {
        owner: string; runtime: RxNostr; relays: RelayConfig; enabled?: boolean; authenticated?: boolean;
    } = $props();
    usePostHistoryInboundInteractionsRealtime({ getPubkeyHex: () => owner, getRxNostr: () => runtime,
        getRelayConfig: () => relays, getNotificationsEnabled: () => enabled, getIsAuthenticated: () => authenticated });
</script>
