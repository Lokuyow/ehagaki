<script lang="ts">
    import type { RxNostr } from "rx-nostr";
    import { usePostHistoryRelatedReactions } from "../../../lib/hooks/usePostHistoryRelatedReactions.svelte";
    import type { PostHistoryRelatedReactionCardTarget } from "../../../lib/hooks/usePostHistoryRelatedReactions.svelte";
    import type { RelayConfig } from "../../../lib/types";

    interface Props {
        show: boolean;
        pubkeyHex: string;
        rxNostr: RxNostr;
        relayConfig: RelayConfig;
        targets: PostHistoryRelatedReactionCardTarget[];
    }

    let { show, pubkeyHex, rxNostr, relayConfig, targets }: Props = $props();
    const state = usePostHistoryRelatedReactions({
        getShow: () => show,
        getPubkeyHex: () => pubkeyHex,
        getRxNostr: () => rxNostr,
        getRelayConfig: () => relayConfig,
        getTargets: () => targets,
        profileSync: {
            subscribe: () => () => undefined,
            ensureProfile: () => null,
        } as any,
    });
</script>

{#if show}
    {#each targets as target, index (index)}
        <output data-testid={`reaction-${target.eventId}`}>
            {state.isLoaded(target.eventId) ? state.getReadModel(target.eventId)?.totalCount ?? 0 : "loading"}
        </output>
    {/each}
{/if}
