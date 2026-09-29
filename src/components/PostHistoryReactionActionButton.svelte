<script lang="ts">
    import PostPreviewFooterActionButton from "./PostPreviewFooterActionButton.svelte";
    interface Props { count: number; expanded: boolean; ariaLabel: string; onToggle: () => void; }
    let { count, expanded, ariaLabel, onToggle }: Props = $props();
</script>

<PostPreviewFooterActionButton
    type="button"
    className="post-preview-reactions-button"
    ariaLabel={ariaLabel}
    shape="pill"
    selected={expanded}
    onClick={onToggle}
    tooltipContent={ariaLabel}
>
    <div class="favorite-icon svg-icon" aria-hidden="true"></div>
    <span>{count}</span>
</PostPreviewFooterActionButton>

<style>
    :global(.post-preview-reactions-button) {
        display: flex;
        align-items: stretch;
        gap: 4px;
        padding: 0;
        padding-inline: 6px;
    }

    :global(.post-preview-reactions-button .favorite-icon) {
        mask-image: url("/icons/favorite_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    :global(.post-preview-reactions-button span) {
        flex: 0 0 auto;
        line-height: 20px;
    }

    :global(.post-preview-reactions-button .svg-icon) {
        width: var(--post-history-preview-action-icon-size, 20px);
        height: var(--post-history-preview-action-icon-size, 20px);
    }
</style>
