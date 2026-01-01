<script lang="ts">
    import { Popover } from "bits-ui";

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
        side = "top",
        sideOffset = 2,
        ariaLabel = "情報を表示",
        children,
    }: Props = $props();
</script>

<Popover.Root>
    <Popover.Trigger class="info-trigger" aria-label={ariaLabel}>
        <div class="info-icon svg-icon"></div>
    </Popover.Trigger>
    <Popover.Portal>
        <Popover.Content
            {side}
            {sideOffset}
            class="popover-content"
            trapFocus={false}
            onCloseAutoFocus={(e) => e.preventDefault()}
        >
            <div class="popover-body">
                <div class="popover-children">
                    {@render children?.()}
                </div>
            </div>
        </Popover.Content>
    </Popover.Portal>
</Popover.Root>

<style>
    :global(button.info-trigger) {
        background: transparent;
    }

    .info-icon {
        mask-image: url("/icons/circle-info-solid-full.svg");
        width: 28px;
        height: 28px;
    }

    :global(.popover-content) {
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

    :global(.popover-content[data-state="open"]) {
        animation: popover-in 150ms ease-out;
    }

    :global(.popover-content[data-state="closed"]) {
        animation: popover-out 100ms ease-in;
    }

    @keyframes popover-in {
        from {
            opacity: 0;
            transform: translateY(-4px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes popover-out {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-4px);
        }
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
</style>
