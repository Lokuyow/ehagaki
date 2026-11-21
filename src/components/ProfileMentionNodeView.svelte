<script lang="ts">
    import type { NodeViewProps } from "@tiptap/core";
    import { untrack } from "svelte";
    import { NodeViewWrapper } from "svelte-tiptap";
    import ProfileAvatar from "./ProfileAvatar.svelte";
    import {
        parseProfileMentionUri,
        shortenProfileMentionLabel,
        type ProfileMentionSource,
    } from "../lib/profileMention";

    let { node, extension }: NodeViewProps = $props();
    const profileSource: ProfileMentionSource | undefined = $derived(extension.options.profileSource);
    const mention = $derived(parseProfileMentionUri(node.attrs.uri));
    const label = $derived(shortenProfileMentionLabel(node.attrs.label));
    const profile = $derived(mention ? profileSource?.readProfile(mention.pubkey) : null);

    $effect(() => {
        if (!mention || !profileSource) return;
        const target = mention;
        const load = profileSource.getInlineLoader();
        const controller = new AbortController();
        untrack(() => { void load(target, controller.signal).catch(() => undefined); });
        return () => controller.abort();
    });
</script>

<NodeViewWrapper as="span" class="editor-profile-mention" data-nostr-mention={node.attrs.uri} contenteditable="false">
    {#if mention && profileSource}
        <span class="mention-avatar" aria-hidden="true">
            <ProfileAvatar pubkeyHex={mention.pubkey} displayName={profile?.displayName} name={profile?.name}
                src={profile?.picture} fallbackAriaLabel="" rootClassName="inline-mention-avatar-root"
                imageClassName="inline-mention-avatar-image" />
        </span>
    {/if}<span>@{label}</span>
</NodeViewWrapper>

<style>
    .mention-avatar {
        display: inline-block;
        width: var(--post-editor-line-height, 1.5em);
        height: var(--post-editor-line-height, 1.5em);
        margin-inline-end: 0.25em;
        vertical-align: top;
        pointer-events: none;
    }

    .mention-avatar :global(.inline-mention-avatar-root) {
        display: block;
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 50%;
    }

    .mention-avatar :global(.inline-mention-avatar-image) {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
</style>
