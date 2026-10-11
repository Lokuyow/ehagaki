<script lang="ts">
    import { _ } from 'svelte-i18n';
    import { nip19 } from 'nostr-tools';
    import type { ReactionComposerState } from '../stores/reactionComposerStore.svelte';
    import { buildComposerInteractionRenderModel } from '../lib/composerTargetRelatedPreview';
    import { buildPostContentRenderModel } from '../lib/postContentPreview';
    import { formatPostedAt } from '../lib/postHistoryDialogUtils';
    import { shortenMiddle } from '../lib/utils/textDisplayUtils';
    import ComposerContextPreviewShell from './ComposerContextPreviewShell.svelte';
    import PostContentPreview from './PostContentPreview.svelte';
    import type { PostContentEmojiLoadState, PostContentEmojiImageMeta } from '../lib/postContentPreview';
    import { useReactionTargetProfile, type ReactionTargetProfileService } from '../lib/hooks/useReactionTargetProfile.svelte';
    interface Props { target: ReactionComposerState; onClear: () => void;
        profileService?: ReactionTargetProfileService;
        emojiLoadStateByUrl?: Record<string, PostContentEmojiLoadState | undefined>;
        emojiImageMetaByUrl?: Record<string, PostContentEmojiImageMeta | undefined>; }
    let { target, onClear, profileService = undefined, emojiLoadStateByUrl = {}, emojiImageMetaByUrl = {} }: Props = $props();
    let expanded = $state(false);
    const author = useReactionTargetProfile({ getTarget: () => target, getProfileService: () => profileService });
    let authorDisplay = $derived(author.profile?.displayName?.trim() || author.profile?.name?.trim()
        || shortenMiddle(nip19.npubEncode(target.authorPubkey), 12, 4));
    let model = $derived([6, 7, 16].includes(target.kind) ? buildComposerInteractionRenderModel(target.event)
        : buildPostContentRenderModel({ kind: target.kind, sourceContent: target.event.content, tags: target.event.tags }));
    $effect(() => { target.ownerToken; expanded = false; });
</script>

<div class="reaction-target" data-reaction-target-id={target.eventId}>
    <ComposerContextPreviewShell previewClass="reaction-target-preview" modeIconClass="reaction-target-icon"
        modeLabel={$_('reaction.entry')} {authorDisplay} authorPicture={author.profile?.picture ?? ''}
        {expanded} canToggleExpand
        toggleAriaLabel={$_('reaction.target')} clearAriaLabel={$_('reaction.clear')}
        onToggle={() => expanded = !expanded} {onClear}>
        {#snippet content()}
            <div class="target-meta">
                <span>{target.kind === 6 ? $_('repost.entry') : target.kind === 16 ? $_('composerTarget.genericRepost')
                    : target.kind === 7 ? $_('composerTarget.reaction') : `kind ${target.kind}`}</span>
                <span>{formatPostedAt(target.event.created_at * 1000)}</span>
            </div>
            <PostContentPreview {model} contentWarningEventId={target.eventId} density="compact"
                {emojiLoadStateByUrl} {emojiImageMetaByUrl} />
        {/snippet}
    </ComposerContextPreviewShell>
</div>
<style>
    .reaction-target { width: 100%; max-width: 800px; min-width: 0; flex-shrink: 0; }
    :global(.reaction-target-preview) { --preview-meta-gap: 12px; }
    .target-meta { display: flex; flex-wrap: wrap; gap: 4px 8px; min-width: 0; overflow-wrap: anywhere; font-size: .85rem; }
    :global(.reaction-target-preview .reaction-target-icon) { mask-image: url('/icons/favorite_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg'); }
</style>
