<script lang="ts">
    import type { ProfileMentionCandidate } from "../lib/profileMention";
    import { formatShortNpub } from "../lib/utils/nostrUtils";
    import SuggestionCommandList from "./SuggestionCommandList.svelte";

    interface Props {
        items: ProfileMentionCandidate[];
        onSelect: (item: ProfileMentionCandidate) => void;
    }

    let { items, onSelect }: Props = $props();
    let list: ReturnType<typeof SuggestionCommandList<ProfileMentionCandidate>> | undefined = $state();

    export function moveDown(): void {
        list?.moveDown();
    }

    export function moveUp(): void {
        list?.moveUp();
    }

    export function confirmSelection(): boolean {
        return list?.confirmSelection() ?? false;
    }

    export function resetIndex(): void {
        list?.resetIndex();
    }
</script>

<SuggestionCommandList
    bind:this={list}
    {items}
    getKey={item => item.pubkey}
    getValue={item => item.pubkey}
    {onSelect}
    rootClass="profile-mention-suggestion"
    itemClass="profile-mention-suggestion-item"
>
    {#snippet children(item)}
        <span class="profile-mention-label">@{item.label}</span>
        <small>{formatShortNpub(item.pubkey)}</small>
    {/snippet}
</SuggestionCommandList>

<style>
    :global(.profile-mention-suggestion) {
        --suggestion-command-item-columns: minmax(0, 1fr) auto;
    }

    .profile-mention-label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 600;
    }

    small {
        opacity: 0.7;
    }
</style>
