<script lang="ts">
    import { _ } from "svelte-i18n";
    import Button from "./Button.svelte";

    interface Props {
        expanded: boolean;
        controls: string;
        visible?: boolean;
        onToggle: () => void;
    }

    let { expanded, controls, visible = true, onToggle }: Props = $props();
</script>

<div class="post-preview-toggle-row" class:post-preview-toggle-hidden={!visible}>
    <Button
        type="button"
        class="post-preview-action-button post-preview-toggle-button"
        aria-expanded={expanded}
        aria-controls={controls}
        disabled={!visible}
        onClick={onToggle}
    >
        {expanded ? $_("postHistory.collapse") : $_("postHistory.expand")}
    </Button>
</div>

<style>
    .post-preview-toggle-row {
        display: flex;
        position: absolute;
        inset-inline-end: 0;
        inset-block-end: 0;
        z-index: 1;
        padding-inline-start: 12px;
        background: linear-gradient(90deg, transparent, var(--dialog-bg) 18%);

        &.post-preview-toggle-hidden {
            visibility: hidden;
            pointer-events: none;
        }

        :global(.ehagaki-app-root) & :global(button.post-preview-toggle-button),
        :global(.ehagaki-app-root) & :global(button.post-preview-toggle-button:hover) {
            color: var(--text-muted);
            font-size: 0.875rem;
            font-weight: normal;
            min-height: 24px;
            padding: 0;
            background: transparent;
        }

        @media (hover: hover) and (pointer: fine) {
            :global(.ehagaki-app-root) & :global(button.post-preview-toggle-button:hover) {
                text-decoration: underline;
            }
        }
    }
</style>
