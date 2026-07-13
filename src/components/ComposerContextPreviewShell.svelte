<script lang="ts">
    import type { Snippet } from "svelte";
    import Button from "./Button.svelte";
    import { preventKeyboardFocusChange } from "../lib/utils/keyboardFocusUtils";

    interface Props {
        previewClass: string;
        modeIconClass: string;
        modeLabel: string;
        expanded: boolean;
        toggleAriaLabel: string;
        clearAriaLabel: string;
        clearTitle?: string;
        canToggleExpand?: boolean;
        onToggle?: () => void;
        onClear: () => void;
        meta?: Snippet;
        status?: Snippet;
        content?: Snippet;
        headerExtra?: Snippet;
    }

    let {
        previewClass,
        modeIconClass,
        modeLabel,
        expanded,
        toggleAriaLabel,
        clearAriaLabel,
        clearTitle = clearAriaLabel,
        canToggleExpand = false,
        onToggle = undefined,
        onClear,
        meta,
        status,
        content,
        headerExtra,
    }: Props = $props();
</script>

<div class={`composer-context-preview-shell ${previewClass}`}>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="preview-header"
        onmousedown={preventKeyboardFocusChange}
        ontouchstart={preventKeyboardFocusChange}
    >
        <div class="preview-header-main">
            <div class="preview-meta">
                <Button
                    className="preview-label"
                    variant="default"
                    shape="square"
                    onClick={canToggleExpand ? onToggle : undefined}
                    aria-expanded={canToggleExpand ? expanded : undefined}
                    ariaLabel={toggleAriaLabel}
                >
                    <div
                        class={`preview-mode-icon ${modeIconClass} svg-icon`}
                    ></div>
                    <span class="mode-text">{modeLabel}</span>
                </Button>
                {@render meta?.()}
            </div>
            {@render status?.()}
            <Button
                className="cancel-button"
                variant="default"
                shape="square"
                onClick={onClear}
                title={clearTitle}
                ariaLabel={clearAriaLabel}
            >
                <div class="close-icon svg-icon"></div>
            </Button>
        </div>
        {@render headerExtra?.()}
    </div>

    {#if expanded}
        <div class="preview-content">
            {@render content?.()}
        </div>
    {/if}
</div>

<style>
    .composer-context-preview-shell {
        --preview-meta-gap: 8px;
        --preview-content-display: block;
        --preview-content-gap: 0;
        --preview-content-padding: 10px 20px 10px 20px;

        display: flex;
        flex-direction: column;
        border-left: 3px solid var(--theme);
        background-color: var(--bg-input);
        max-width: 800px;
        width: 100%;
        font-size: 1rem;
        flex-shrink: 0;
    }

    .preview-header {
        display: flex;
        flex-direction: column;
    }

    .preview-header-main {
        display: flex;
        align-items: stretch;
        gap: 12px;
    }

    .preview-meta {
        display: flex;
        align-items: center;
        gap: var(--preview-meta-gap);
        min-width: 0;
        flex: 1;
    }

    .preview-meta :global(.preview-label) {
        gap: 6px;
        height: 50px;
        min-width: fit-content;
        padding: 0 10px 0 10px;
        border-radius: 0 6px 6px 0;
    }

    .preview-header :global(.cancel-button) {
        height: 50px;
        width: 50px;
        padding: 2px;
        flex-shrink: 0;
    }

    .preview-mode-icon.reply-icon {
        width: 24px;
        height: 24px;
        flex-shrink: 0;
    }

    .mode-text {
        font-size: 1rem;
        font-weight: 600;
        color: var(--theme);
        white-space: nowrap;
        flex-shrink: 0;
    }

    .preview-header :global(.cancel-button .close-icon) {
        width: 30px;
        height: 30px;
        mask-image: url("/icons/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .preview-content {
        display: var(--preview-content-display);
        gap: var(--preview-content-gap);
        width: 100%;
        padding: var(--preview-content-padding);
        text-align: left;
        color: var(--text);
        font: inherit;
    }
</style>
