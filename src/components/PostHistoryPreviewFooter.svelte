<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        formattedDate: string;
        density?: "regular" | "compact";
        dimmed?: boolean;
        leftExtras?: Snippet;
        actions?: Snippet;
        trailing?: Snippet;
    }

    let {
        formattedDate,
        density = "regular",
        dimmed = false,
        leftExtras = undefined,
        actions = undefined,
        trailing = undefined,
    }: Props = $props();
</script>

<div
    class={`post-preview-footer post-preview-footer-${density} ${dimmed ? "is-dimmed" : ""}`.trim()}
>
    <div class="post-preview-footer-left">
        <span class="post-preview-date">{formattedDate}</span>
        {@render leftExtras?.()}
    </div>
    <div class="post-preview-footer-actions">
        {@render actions?.()}
    </div>
    <div class="post-preview-footer-right">
        {@render trailing?.()}
    </div>
</div>

<style>
    .post-preview-footer {
        display: flex;
        align-items: stretch;
        justify-content: space-between;
        height: var(--post-history-preview-footer-height);
        color: var(--btn-post-preview-action);
        --post-history-preview-footer-surface: var(--dialog-bg);
    }

    .post-preview-footer-regular {
        --post-history-preview-footer-height: 36px;
        padding-inline-start: 1rem;
    }

    .post-preview-footer-compact {
        --post-history-preview-footer-height: 28px;
        --post-history-preview-footer-surface: var(
            --post-history-related-card-bg,
            var(--dialog-bg)
        );
    }

    .post-preview-footer.is-dimmed {
        opacity: 0.65;
    }

    .post-preview-footer-left,
    .post-preview-footer-actions,
    .post-preview-footer-right {
        display: flex;
        align-items: stretch;
    }

    .post-preview-footer-left {
        align-items: center;
        justify-content: flex-start;
        min-width: 0;
    }

    .post-preview-footer-regular .post-preview-footer-left {
        min-width: 80px;
    }

    .post-preview-footer-actions {
        justify-content: center;
        flex: 1 0 auto;
    }

    .post-preview-footer-regular .post-preview-footer-actions {
        justify-content: space-around;
    }

    .post-preview-footer-right {
        align-items: center;
        justify-content: flex-end;
        flex: 0 0 auto;
    }

    .post-preview-date {
        overflow: hidden;
        color: var(--text-muted);
        font-size: 0.875rem;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .post-preview-footer-regular .post-preview-date {
        font-size: 0.9375rem;
    }

    :global(.post-preview-footer-replies-slot) {
        display: flex;
        align-items: stretch;
        justify-content: center;
        flex: 0 0 36px;
        min-width: 36px;
    }

    :global(.post-history-action-button),
    :global(.post-preview-reactions-button) {
        min-height: auto;
        color: var(--btn-post-preview-action);
        --btn-bg: var(--post-history-preview-footer-surface);
        background-color: var(--post-history-preview-footer-surface);
    }
</style>
