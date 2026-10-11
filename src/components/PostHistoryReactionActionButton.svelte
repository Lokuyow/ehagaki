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
    <span>{count}</span>
</PostPreviewFooterActionButton>

<style>
    :global(.post-preview-reactions-button) {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 0;
        padding-inline: 6px;
    }

    :global(.post-preview-reactions-button span) {
        flex: 0 0 auto;
        line-height: 20px;
    }

    :global(.post-preview-reactions-button.selected) {
        --btn-bg: var(--post-history-preview-footer-surface, var(--dialog-bg));
        color: var(--text-light);
    }
</style>
