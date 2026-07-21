<script lang="ts">
    import Button from "./Button.svelte";

    interface Props {
        count: number;
        selected: boolean;
        ariaLabel: string;
        onClick: () => void;
    }

    let { count, selected, ariaLabel, onClick }: Props = $props();
</script>

<Button
    type="button"
    class="post-preview-replies-badge-button"
    {ariaLabel}
    title={ariaLabel}
    contentLayout="icon"
    shape="circle"
    {selected}
    {onClick}
>
    <span class="post-preview-replies-badge" aria-hidden="true">{count}</span>
</Button>

<style>
    :global(.post-preview-replies-badge-button) {
        width: 36px;
        min-width: 36px;
        min-height: auto;
        color: var(--btn-post-preview-action);
        --btn-bg: var(--post-history-preview-footer-surface, var(--dialog-bg));
        background-color: var(
            --post-history-preview-footer-surface,
            var(--dialog-bg)
        );
    }

    .post-preview-replies-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        aspect-ratio: 1;
        width: 20px;
        height: 20px;
        border-radius: 999px;
        background: var(--btn-post-preview-action);
        color: var(--post-history-preview-footer-surface, var(--dialog-bg));
        font-size: 0.6875rem;
        font-weight: 700;
        line-height: 20px;
        text-align: center;
    }

    :global(
            .post-preview-replies-badge-button.selected
                .post-preview-replies-badge
        ) {
        background-color: var(--text-light);
    }

    @media (hover: hover) and (pointer: fine) {
        :global(
                .post-preview-replies-badge-button:hover:not(:disabled)
                    .post-preview-replies-badge
            ) {
            background-color: var(--text);
        }
    }
</style>
