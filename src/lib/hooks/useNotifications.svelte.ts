import { onMount } from 'svelte';
import { liveQuery } from 'dexie';
import type { RxNostr } from 'rx-nostr';
import type { RelayConfig } from '../types';
import { notificationRepository } from '../storage/notificationRepository';
import { notificationStore } from '../../stores/notificationStore.svelte';
import { syncNotifications } from '../notificationSyncService';
import { getPostHistoryAuthoredRelayScopeKey } from '../postHistoryRelayResolver';
import type { PostHistoryInboundInteractionsSyncRequest } from '../postHistoryInboundInteractionsSyncService';

export function useNotifications(params: {
    getOwner: () => string | null;
    getRxNostr: () => RxNostr | undefined;
    getRelayConfig: () => RelayConfig | null | undefined;
    reconcileDirectReplyCandidates?: PostHistoryInboundInteractionsSyncRequest['reconcileDirectReplyCandidates'];
}) {
    let visible = $state(false);
    onMount(() => {
        const sync = () => { visible = document.visibilityState === 'visible'; };
        sync(); document.addEventListener('visibilitychange', sync);
        return () => { document.removeEventListener('visibilitychange', sync); };
    });
    $effect(() => {
        const owner = params.getOwner();
        notificationStore.selectAccount(owner);
        if (!owner) return;
        const subscription = liveQuery(() => notificationRepository.hasUnread(owner)).subscribe({
            next: value => notificationStore.update(owner, value),
            error: () => { /* The dialog offers retry; keep previously displayed data. */ },
        });
        return () => subscription.unsubscribe();
    });
    $effect(() => {
        const owner = params.getOwner(), runtime = params.getRxNostr(), config = params.getRelayConfig();
        const scope = getPostHistoryAuthoredRelayScopeKey(config);
        if (!visible || !owner || !runtime || typeof runtime.use !== 'function') return;
        let active = true;
        const task = syncNotifications(runtime, { ownerPubkeyHex: owner, relayConfig: config,
            reconcileDirectReplyCandidates: params.reconcileDirectReplyCandidates,
            isActive: () => active && visible && params.getOwner() === owner && params.getRxNostr() === runtime
                && getPostHistoryAuthoredRelayScopeKey(params.getRelayConfig()) === scope });
        void task.promise.catch(() => undefined);
        return () => { active = false; task.cancel(); };
    });
}
