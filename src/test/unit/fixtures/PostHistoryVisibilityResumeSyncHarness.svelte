<script lang="ts">
    import type { RxNostr } from "rx-nostr";
    import {
        usePostHistoryVisibilityResumeSync,
    } from "../../../lib/hooks/usePostHistoryVisibilityResumeSync.svelte";

    interface Props {
        isAuthenticated: boolean;
        pubkeyHex: string | null;
        reconciliationPubkeyHex: string | null;
        rxNostr: RxNostr | undefined;
        now: () => number;
        onSavedSelfPosts?: (eventIds: string[]) => void | Promise<void>;
    }

    let {
        isAuthenticated,
        pubkeyHex,
        reconciliationPubkeyHex,
        rxNostr,
        now,
        onSavedSelfPosts,
    }: Props = $props();

    usePostHistoryVisibilityResumeSync({
        getIsAuthenticated: () => isAuthenticated,
        getPubkeyHex: () => pubkeyHex,
        getRxNostr: () => rxNostr,
        getRelayConfig: () => null,
        getReconciliationPubkeyHex: () => reconciliationPubkeyHex,
        now: () => now(),
        onSavedSelfPosts: (eventIds) => onSavedSelfPosts?.(eventIds),
    });
</script>
