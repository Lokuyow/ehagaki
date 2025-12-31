<script lang="ts">
    import { Popover } from "bits-ui";
    import { fly } from "svelte/transition";

    interface Props {
        /** ポップオーバーの表示位置 */
        side?: "top" | "bottom" | "left" | "right";
        /** トリガーからの距離（px） */
        sideOffset?: number;
        /** アクセシビリティ用ラベル */
        ariaLabel?: string;
        /** ポップオーバーのコンテンツ */
        children?: import("svelte").Snippet;
    }

    let {
        side = "bottom",
        sideOffset = 8,
        ariaLabel = "情報を表示",
        children,
    }: Props = $props();

    let open = $state(false);
</script>

<Popover.Root bind:open>
    <Popover.Trigger class="info-trigger" aria-label={ariaLabel}>
        <div class="info-icon svg-icon"></div>
    </Popover.Trigger>
    <Popover.Portal>
        <Popover.Content
            {side}
            {sideOffset}
            class="popover-content"
            forceMount
            trapFocus={false}
            onCloseAutoFocus={(e) => e.preventDefault()}
        >
            {#snippet child({ wrapperProps, props, open: isOpen })}
                {#if isOpen}
                    <div {...wrapperProps}>
                        <div
                            {...props}
                            class="popover-content"
                            transition:fly={{ y: -4, duration: 150 }}
                        >
                            <div class="popover-body">
                                <div class="popover-children">
                                    {@render children?.()}
                                </div>
                            </div>
                            <Popover.Arrow class="popover-arrow" />
                        </div>
                    </div>
                {/if}
            {/snippet}
        </Popover.Content>
    </Popover.Portal>
</Popover.Root>

<style>
    .info-trigger {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: none;
        padding: 4px;
        border-radius: 50%;
        cursor: pointer;
        transition: opacity 0.15s ease;
        opacity: 0.6;

        &:hover {
            opacity: 1;
        }
    }

    :global(button.info-trigger) {
        background: transparent;
    }

    .info-icon {
        mask-image: url("/icons/circle-info-solid-full.svg");
        width: 28px;
        height: 28px;
    }

    .popover-content {
        background: var(--dialog, #fff);
        color: var(--text, #000);
        border: 1px solid var(--border, #ccc);
        border-radius: 8px;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
        padding: 10px 12px;
        max-width: 320px;
        z-index: 100001;
        outline: none;
    }

    .popover-body {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        width: 100%;
    }

    .popover-children {
        padding: 0 2px;
        line-height: 1.4;
    }

    :global([data-popover-arrow]) {
        fill: var(--dialog, #fff);
        stroke: var(--border, #ccc);
        stroke-width: 1px;
    }
</style>
