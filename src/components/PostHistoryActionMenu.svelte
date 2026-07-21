<script lang="ts">
    import { DropdownMenu } from "bits-ui";
    import type { Snippet } from "svelte";

    interface Props {
        open?: boolean;
        onOpenChange?: (open: boolean) => void;
        triggerAriaLabel: string;
        triggerClassName?: string;
        align?: "start" | "center" | "end";
        timestamp?: string;
        items?: Snippet;
    }

    let {
        open = false,
        onOpenChange = undefined,
        triggerAriaLabel,
        triggerClassName = "",
        align = "start",
        timestamp = undefined,
        items = undefined,
    }: Props = $props();

    function handleOpenChange(nextOpen: boolean): void {
        onOpenChange?.(nextOpen);
    }
</script>

<DropdownMenu.Root {open} onOpenChange={handleOpenChange}>
    <DropdownMenu.Trigger
        class={`menu-trigger post-history-menu-trigger ${triggerClassName} ${open ? "is-open" : ""}`.trim()}
        aria-label={triggerAriaLabel}
    >
        <div class="more-icon svg-icon"></div>
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
        <DropdownMenu.Content
            side="bottom"
            {align}
            sideOffset={8}
            class="post-history-menu-content"
            trapFocus={false}
            preventScroll={false}
            onCloseAutoFocus={(event: Event) => event.preventDefault()}
        >
            <div class="post-history-menu-body">
                {#if timestamp}
                    <div class="post-history-menu-timestamp">{timestamp}</div>
                    <DropdownMenu.Separator
                        class="post-history-menu-separator"
                    />
                {/if}
                {@render items?.()}
            </div>
        </DropdownMenu.Content>
    </DropdownMenu.Portal>
</DropdownMenu.Root>

<style>
    :global(.post-history-menu-trigger) {
        aspect-ratio: 1;
        border-radius: 50%;
        color: var(--btn-post-preview-action);
        --btn-bg: var(--post-history-preview-footer-surface, var(--dialog-bg));
        background-color: var(
            --post-history-preview-footer-surface,
            var(--dialog-bg)
        );
    }

    :global(.post-history-menu-trigger .more-icon) {
        width: 22px;
        height: 22px;
        mask-image: url("/icons/more_vert_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        --svg: currentColor;
    }

    :global(.post-history-menu-trigger.post-history-heading-menu-trigger) {
        min-height: 50px;
        padding: 0;
        border-radius: 0;
        --btn-bg: var(--dialog-bg);
        background-color: var(--dialog-bg);
        color: var(--text-muted);
    }

    :global(
            .post-history-menu-trigger.post-history-heading-menu-trigger
                .more-icon
        ) {
        width: 28px;
        height: 28px;
    }

    :global(.post-history-menu-content) {
        background: var(--dialog-bg, #fff);
        color: var(--text, #000);
        border: 1px solid var(--border, #ccc);
        border-radius: 10px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
        padding: 8px;
        min-width: 180px;
        z-index: 102;
        outline: none;
        --post-history-menu-action-hover-bg: color-mix(
            in srgb,
            var(--dialog-bg),
            var(--border) 12%
        );
        --post-history-menu-action-hover-color: var(--text);
        --post-history-menu-action-danger-hover-bg: color-mix(
            in srgb,
            var(--dialog-bg),
            var(--danger) 12%
        );
    }

    :global(:root.light .post-history-menu-content) {
        --post-history-menu-action-hover-bg: color-mix(
            in srgb,
            var(--dialog-bg),
            black 6%
        );
        --post-history-menu-action-hover-color: color-mix(
            in srgb,
            var(--text),
            black 6%
        );
    }

    :global(:root.dark .post-history-menu-content) {
        --post-history-menu-action-hover-bg: color-mix(
            in srgb,
            var(--dialog-bg),
            white 10%
        );
        --post-history-menu-action-hover-color: color-mix(
            in srgb,
            var(--text),
            white 10%
        );
    }

    :global(.post-history-menu-body) {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 2px;
    }

    :global(.post-history-menu-timestamp) {
        width: fit-content;
        margin-inline: auto;
        color: var(--text-muted);
        font-size: 0.875rem;
        line-height: 1.35;
        user-select: text;
        white-space: nowrap;
    }

    :global(.post-history-menu-content[data-state="open"]) {
        animation: post-history-menu-popover-in 150ms ease-out;
    }

    :global(.post-history-menu-content[data-state="closed"]) {
        animation: post-history-menu-popover-out 100ms ease-in;
    }

    :global(.post-history-menu-content .post-history-menu-separator) {
        height: 1px;
        margin: 4px 0;
        background: var(--border-hr);
    }

    :global(.post-history-menu-content .menu-action-button) {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 10px;
        width: 100%;
        min-height: 40px;
        padding: 10px 12px;
        border: none;
        border-radius: 6px;
        background-color: transparent;
        color: inherit;
        font: inherit;
        text-align: left;
        cursor: pointer;
    }

    :global(.post-history-menu-content .menu-action-button-danger) {
        color: var(--danger);
        --svg: currentColor;
    }

    :global(
            .post-history-menu-content
                .menu-action-button[data-highlighted]:not([data-disabled])
        ) {
        background-color: var(--post-history-menu-action-hover-bg);
        color: var(--post-history-menu-action-hover-color);
        --svg: currentColor;
    }

    :global(
            .post-history-menu-content
                .menu-action-button-danger[data-highlighted]:not(
                    [data-disabled]
                )
        ) {
        background-color: var(--post-history-menu-action-danger-hover-bg);
        color: var(--danger);
        --svg: currentColor;
    }

    @media (hover: hover) and (pointer: fine) {
        :global(
                .post-history-menu-content
                    .menu-action-button:hover:not([data-disabled])
            ) {
            background-color: var(--post-history-menu-action-hover-bg);
            color: var(--post-history-menu-action-hover-color);
            --svg: currentColor;
        }

        :global(
                .post-history-menu-content
                    .menu-action-button-danger:hover:not([data-disabled])
            ) {
            background-color: var(--post-history-menu-action-danger-hover-bg);
            color: var(--danger);
            --svg: currentColor;
        }
    }

    :global(.post-history-menu-content .menu-action-button[data-disabled]) {
        opacity: 0.55;
        cursor: not-allowed;
    }

    :global(.post-history-menu-content .menu-action-button .svg-icon) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
    }

    @keyframes post-history-menu-popover-in {
        from {
            opacity: 0;
            translate: 0 -4px;
        }
        to {
            opacity: 1;
            translate: 0 0;
        }
    }

    @keyframes post-history-menu-popover-out {
        from {
            opacity: 1;
            translate: 0 0;
        }
        to {
            opacity: 0;
            translate: 0 -4px;
        }
    }
</style>
