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
    import { authState } from "../stores/appStore.svelte";
    import { editorState } from "../stores/editorStore.svelte";

    interface Props {
        onUploadImage?: () => void;
    }

    let { onUploadImage }: Props = $props();

    // 認証状態を購読
    let hasStoredKey = $state(false);
    $effect(() => {
        const unsubscribe = authState.subscribe((val) => {
            hasStoredKey = val && val.isAuthenticated;
        });
        return unsubscribe;
    });

    // エディタ状態を取得
    let postStatus = $derived(editorState.postStatus);
    let isUploading = $derived(editorState.isUploading);

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
                        className="image-button"
                        disabled={!hasStoredKey ||
                            postStatus.sending ||
                            isUploading}
                        onClick={(e) => {
                            onUploadImage?.();
                            if (typeof tooltipOnclick === "function") {
                                tooltipOnclick(e);
                            }
                        }}
                        ariaLabel={$_("postComponent.upload_image")}
                        {...restProps}
                    >
                        <div class="image-icon svg-icon"></div>
                    </Button>
                {/snippet}
            </Tooltip.Trigger>
            <Tooltip.Portal>
                <Tooltip.Content sideOffset={8} class="tooltip-content">
                    {$_("keyboardButtonBar.upload_image_tooltip")}
                </Tooltip.Content>
            </Tooltip.Portal>
        </Tooltip.Root>
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

        .content-warning-icon {
            mask-image: url("/icons/eye-slash-solid-full.svg");
        }

        :global(.selected .content-warning-icon) {
            --svg: var(--danger);
        }

        .image-icon {
            mask-image: url("/icons/image-solid-full.svg");
            width: 36px;
            height: 36px;
        }
    }

    .button-container {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        gap: 8px;
        width: 100%;
    }

    :global(.footer-button-bar .footer) {
        width: 50px;
        height: 50px;
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
