<script lang="ts">
    import { _ } from "svelte-i18n";
    import { Tooltip } from "bits-ui";
    import Button from "./Button.svelte";
    import {
        contentWarningStore,
        contentWarningReasonStore,
    } from "../stores/tagsStore.svelte";
    import {
        bottomPositionStore,
        setupViewportListener,
    } from "../stores/uiStore.svelte";

    // Content Warning状態を取得
    let contentWarningEnabled = $derived(contentWarningStore.value);

    // Content Warningトグル
    function toggleContentWarning() {
        contentWarningStore.toggle();
        if (!contentWarningStore.value) {
            // disabledになった時はreasonをクリア
            contentWarningReasonStore.reset();
        }
    }

    // キーボード追従のための位置調整（共有ストアから取得）
    let bottomPosition = $derived(bottomPositionStore.value);

    // ボタン押下時にフォーカスを奪わない（キーボードを閉じさせない）
    function preventFocusLoss(event: Event) {
        event.preventDefault();
    }

    // visualViewportの監視を開始
    $effect(() => {
        return setupViewportListener();
    });
</script>

<div class="footer-button-bar" style="bottom: {bottomPosition}px;">
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="button-container"
        onmousedown={preventFocusLoss}
        ontouchstart={preventFocusLoss}
    >
        <Tooltip.Root delayDuration={500}>
            <Tooltip.Trigger>
                {#snippet child({ props })}
                    {@const { onclick: tooltipOnclick, ...restProps } = props}
                    <Button
                        variant="footer"
                        shape="square"
                        selected={contentWarningEnabled}
                        onClick={(e) => {
                            toggleContentWarning();
                            if (typeof tooltipOnclick === "function") {
                                tooltipOnclick(e);
                            }
                        }}
                        ariaLabel={$_(
                            "keyboardButtonBar.content_warning_toggle",
                        )}
                        {...restProps}
                    >
                        <div class="content-warning-icon svg-icon"></div>
                    </Button>
                {/snippet}
            </Tooltip.Trigger>
            <Tooltip.Portal>
                <Tooltip.Content sideOffset={8} class="tooltip-content">
                    {$_("keyboardButtonBar.content_warning_tooltip")}
                </Tooltip.Content>
            </Tooltip.Portal>
        </Tooltip.Root>
    </div>
</div>

<style>
    .footer-button-bar {
        display: flex;
        align-items: center;
        width: 100%;
        max-width: 800px;
        height: 50px;
        padding: 0 8px;
        margin: auto;
        background: var(--bg-buttonbar);
        position: fixed;
        left: 0;
        right: 0;
        z-index: 98;
        transition: bottom 0.2s ease;
    }

    .button-container {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 8px;
        width: auto;
    }

    :global(.footer-button-bar .footer) {
        width: 50px;
        height: 50px;
    }

    .content-warning-icon {
        mask-image: url("/icons/eye-slash-solid-full.svg");
    }

    :global(.tooltip-content) {
        background: var(--dialog);
        color: var(--text);
        border: 1px solid var(--border);
        border-radius: 6px;
        padding: 12px;
        font-size: 1rem;
        font-weight: 600;
        z-index: 100;
    }
</style>
