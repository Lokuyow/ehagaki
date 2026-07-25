<script lang="ts">
    import { _ } from "svelte-i18n";
    import Button from "./Button.svelte";

    interface Props {
        expanded: boolean;
        controls: string;
        onToggle: () => void;
    }

    let { expanded, controls, onToggle }: Props = $props();
</script>

<div class="post-preview-toggle-row">
    <Button
        type="button"
        class="post-preview-action-button post-preview-toggle-button"
        aria-expanded={expanded}
        aria-controls={controls}
        onClick={onToggle}
    >
        {expanded ? $_("postHistory.collapse") : $_("postHistory.expand")}
    </Button>
</div>

<style>
    .post-preview-toggle-row {
        display: flex;

        :global(:root) & :global(button.post-preview-toggle-button),
        :global(:root) & :global(button.post-preview-toggle-button:hover) {
            color: var(--text-muted);
            font-size: 0.875rem;
            font-weight: normal;
            min-height: 24px;
            padding: 0;
            background: transparent;
        }

        @media (hover: hover) and (pointer: fine) {
            :global(:root) & :global(button.post-preview-toggle-button:hover) {
                text-decoration: underline;
            }
        }
    }
</style>
