<script lang="ts">
    import { shortenProfileMentionLabel, type ProfileMentionCandidate, type ProfileMentionSource } from "../lib/profileMention";
    import { formatShortNpub } from "../lib/utils/nostrUtils";
    import SuggestionCommandList from "./SuggestionCommandList.svelte";
    import ProfileAvatar from "./ProfileAvatar.svelte";

    interface Props {
        items: ProfileMentionCandidate[];
        onSelect: (item: ProfileMentionCandidate) => void;
        readProfile?: ProfileMentionSource["readProfile"];
    }

    let { items, onSelect, readProfile }: Props = $props();
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
        {@const profile = readProfile?.(item.pubkey)}
        <span class="profile-mention-avatar" aria-hidden="true">
            <ProfileAvatar pubkeyHex={item.pubkey} displayName={profile?.displayName} name={profile?.name}
                src={profile?.picture} fallbackAriaLabel="" rootClassName="suggestion-mention-avatar-root"
                imageClassName="suggestion-mention-avatar-image" />
        </span>
        <span class="profile-mention-label">@{shortenProfileMentionLabel(item.label)}</span>
        <small>{formatShortNpub(item.pubkey)}</small>
    {/snippet}
</SuggestionCommandList>

<style>
    :global(.profile-mention-suggestion) {
        --suggestion-command-item-columns: 24px minmax(0, 1fr) auto;
    }

    .profile-mention-avatar {
        width: 24px;
        height: 24px;
        pointer-events: none;
    }

    .profile-mention-avatar :global(.suggestion-mention-avatar-root) {
        display: block;
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 50%;
    }

    .profile-mention-avatar :global(.suggestion-mention-avatar-image) {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .profile-mention-label {
        min-width: 0;
        max-width: 16rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 600;
    }

    small {
        opacity: 0.7;
    }
</style>
