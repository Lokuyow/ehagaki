<script lang="ts">
    import { _ } from "svelte-i18n";
    import { Tooltip } from "bits-ui";
    import Button from "./Button.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import {
        contentWarningStore,
        contentWarningReasonStore,
        hashtagPinStore,
    } from "../stores/tagsStore.svelte";
    import { authState } from "../stores/authStore.svelte";
    import { editorState, submitPost } from "../stores/editorStore.svelte";
    import {
        triggerVibration,
        triggerProgressiveVibration,
        stopVibration,
    } from "../lib/utils/appDomUtils";
    import { preventKeyboardFocusChange } from "../lib/utils/keyboardFocusUtils";

    interface Props {
        onUploadImage?: () => void;
        onPostButtonTap?: () => void;
        customEmojiPickerOpen?: boolean;
        onCustomEmojiPickerOpenChange?: (open: boolean) => void;
    }

    let {
        onUploadImage,
        onPostButtonTap,
        customEmojiPickerOpen = false,
        onCustomEmojiPickerOpenChange,
    }: Props = $props();

    // 認証状態を $derived で参照（svelte/store subscribe パターンを廃止）
    let hasStoredKey = $derived(authState.value?.isAuthenticated ?? false);

    // エディタ状態を取得
    let postStatus = $derived(editorState.postStatus);
    let isUploading = $derived(editorState.isUploading);
    let canPost = $derived(editorState.canPost);

    // ローダーの表示状態（最低0.4秒表示）
    let isShowingLoader = $state(false);

    // 送信中のローダー表示管理
    $effect(() => {
        if (postStatus.sending) {
            isShowingLoader = true;
        } else if (isShowingLoader) {
            // 送信完了したら0.4秒後にローダーを隠す
            setTimeout(() => {
                isShowingLoader = false;
            }, 400);
        }
    });

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

    // ハッシュタグピン留め状態を取得
    let hashtagPinEnabled = $derived(hashtagPinStore.value);

    // ハッシュタグピン留めトグル
    function toggleHashtagPin() {
        hashtagPinStore.toggle();
    }

    // 長押し投稿の設定
    const LONG_PRESS_DURATION = 250; // 長押し必要時間 (ms)
    const CANCEL_REVERSE_DELAY = 150; // 巻き戻り開始までの遅延 (ms)
    const PROGRESS_RING_CIRCUMFERENCE = 100.53; // 2π × 16px

    let longPressProgress = $state(0); // 0〜1
    let showProgressRing = $state(false);
    let postTooltipOpen = $state(false);
    let postTooltipBlocked = false; // 長押し中はツールチップ開放をブロック
    let longPressAnimFrameId: number | null = null;
    let longPressCancelTimeoutId: ReturnType<typeof setTimeout> | null = null;
    let longPressStartTime = 0;
    let longPressCompleted = false;
    let lastVibrationTime = 0; // プログレッシブバイブのスロットリング用
    let ignoreNextPostClick = false;

    function isPostDisabled(): boolean {
        return (
            !canPost ||
            postStatus.sending ||
            isUploading ||
            !hasStoredKey ||
            !!postStatus.completed
        );
    }

    function startLongPress(event: PointerEvent) {
        ignoreNextPostClick = event.pointerType === "touch";
        if (event.pointerType !== "touch") return;
        if (isPostDisabled()) return;

        // キャンセルタイムアウトが残っていればクリア
        if (longPressCancelTimeoutId !== null) {
            clearTimeout(longPressCancelTimeoutId);
            longPressCancelTimeoutId = null;
        }

        longPressCompleted = false;
        longPressStartTime = performance.now();
        longPressProgress = 0;
        lastVibrationTime = 0;
        showProgressRing = true;
        postTooltipOpen = false;
        postTooltipBlocked = true;

        function animate(now: number) {
            const elapsed = now - longPressStartTime;
            const progress = Math.min(elapsed / LONG_PRESS_DURATION, 1);
            longPressProgress = progress;

            // プログレッシブバイブレーション: 間隔が60ms→20msに縮まり体感強度が増す
            const vibrationInterval = 60 - progress * 40;
            if (now - lastVibrationTime >= vibrationInterval) {
                triggerProgressiveVibration(progress);
                lastVibrationTime = now;
            }

            if (progress >= 1) {
                longPressCompleted = true;
                triggerVibration(120);
                submitPost();
                setTimeout(() => {
                    showProgressRing = false;
                    longPressProgress = 0;
                    postTooltipBlocked = false;
                }, 200);
                return;
            }

            longPressAnimFrameId = requestAnimationFrame(animate);
        }

        longPressAnimFrameId = requestAnimationFrame(animate);
    }

    function cancelLongPress() {
        if (longPressCompleted) return;
        if (!showProgressRing) return;

        // 長押し未完了で指を離した場合にTipsを表示
        onPostButtonTap?.();

        // 進行中のバイブレーションを即停止
        stopVibration();

        if (longPressAnimFrameId !== null) {
            cancelAnimationFrame(longPressAnimFrameId);
            longPressAnimFrameId = null;
        }

        const progressAtCancel = longPressProgress;

        // 0.15秒後に巻き戻り開始
        longPressCancelTimeoutId = setTimeout(() => {
            longPressCancelTimeoutId = null;
            const reverseStartTime = performance.now();
            const reverseDuration = progressAtCancel * LONG_PRESS_DURATION;

            function reverseAnimate(now: number) {
                const elapsed = now - reverseStartTime;
                const ratio =
                    reverseDuration > 0
                        ? Math.min(elapsed / reverseDuration, 1)
                        : 1;
                longPressProgress = progressAtCancel * (1 - ratio);

                if (ratio < 1) {
                    longPressAnimFrameId =
                        requestAnimationFrame(reverseAnimate);
                } else {
                    longPressProgress = 0;
                    longPressAnimFrameId = null;
                    showProgressRing = false;
                    postTooltipBlocked = false;
                }
            }

            if (reverseDuration > 0) {
                longPressAnimFrameId = requestAnimationFrame(reverseAnimate);
            } else {
                longPressProgress = 0;
                showProgressRing = false;
                postTooltipBlocked = false;
            }
        }, CANCEL_REVERSE_DELAY);
    }

    function setCustomEmojiPickerOpen(open: boolean): void {
        onCustomEmojiPickerOpenChange?.(open);
    }
</script>

<div class="footer-button-bar">
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="button-container"
        onpointerdowncapture={preventKeyboardFocusChange}
        ontouchstartcapture={preventKeyboardFocusChange}
    >
        <div class="button-group-left">
            <Tooltip.Root delayDuration={500}>
                <Tooltip.Trigger>
                    {#snippet child({ props })}
                        {@const { onclick: tooltipOnclick, ...restProps } =
                            props}
                        <Button
                            variant="footer"
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
            <Button
                variant="footer"
                className="custom-emoji-button"
                selected={customEmojiPickerOpen}
                disabled={!hasStoredKey}
                onClick={() => {
                    setCustomEmojiPickerOpen(!customEmojiPickerOpen);
                }}
                ariaLabel={$_("keyboardButtonBar.custom_emoji")}
            >
                <div class="custom-emoji-icon svg-icon"></div>
            </Button>
        </div>
        <div class="button-group-center">
            {#if showProgressRing}
                <div class="progress-ring-container">
                    <svg
                        class="progress-ring"
                        width="52"
                        height="52"
                        viewBox="-6 -6 52 52"
                        aria-hidden="true"
                    >
                        <circle
                            class="progress-ring-bg"
                            cx="20"
                            cy="20"
                            r="16"
                        />
                        <circle
                            class="progress-ring-bar"
                            cx="20"
                            cy="20"
                            r="16"
                            style="stroke-dashoffset: {PROGRESS_RING_CIRCUMFERENCE *
                                (1 - longPressProgress)}px"
                        />
                    </svg>
                </div>
            {/if}
            <Tooltip.Root
                delayDuration={500}
                bind:open={
                    () => postTooltipOpen,
                    (v) => {
                        if (!postTooltipBlocked || !v) postTooltipOpen = v;
                    }
                }
            >
                <Tooltip.Trigger>
                    {#snippet child({ props })}
                        {@const {
                            onclick: tooltipOnclick,
                            onpointerdown: tooltipPointerDown,
                            onpointerup: tooltipPointerUp,
                            onpointerleave: tooltipPointerLeave,
                            ...restProps
                        } = props}
                        <Button
                            variant="primary"
                            className="post-button {isShowingLoader
                                ? 'loading'
                                : ''}"
                            disabled={!canPost ||
                                postStatus.sending ||
                                isUploading ||
                                !hasStoredKey ||
                                postStatus.completed}
                            onClick={(e) => {
                                if (typeof tooltipOnclick === "function") {
                                    tooltipOnclick(e);
                                }

                                if (ignoreNextPostClick) {
                                    ignoreNextPostClick = false;
                                    return;
                                }

                                if (!isPostDisabled()) {
                                    submitPost();
                                }
                            }}
                            ariaLabel={$_("postComponent.post")}
                            {...restProps}
                            onpointerdown={(e) => {
                                if (typeof tooltipPointerDown === "function")
                                    tooltipPointerDown(e);
                                startLongPress(e);
                            }}
                            onpointerup={(e) => {
                                if (typeof tooltipPointerUp === "function")
                                    tooltipPointerUp(e);
                                cancelLongPress();
                            }}
                            onpointerleave={(e) => {
                                if (typeof tooltipPointerLeave === "function")
                                    tooltipPointerLeave(e);
                                cancelLongPress();
                            }}
                            onpointercancel={cancelLongPress}
                            oncontextmenu={(e) => e.preventDefault()}
                        >
                            {#if isShowingLoader}
                                <LoadingPlaceholder
                                    showLoader={true}
                                    text={false}
                                    customClass="post-button-loading"
                                />
                            {:else}
                                <div class="plane-icon svg-icon"></div>
                            {/if}
                        </Button>
                    {/snippet}
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content sideOffset={8} class="tooltip-content">
                        {$_("keyboardButtonBar.post_tooltip")}
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </div>
        <div class="button-group-right">
            <Tooltip.Root delayDuration={500}>
                <Tooltip.Trigger>
                    {#snippet child({ props })}
                        {@const { onclick: tooltipOnclick, ...restProps } =
                            props}
                        <Button
                            variant="footer"
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
            <Tooltip.Root delayDuration={500}>
                <Tooltip.Trigger>
                    {#snippet child({ props })}
                        {@const { onclick: tooltipOnclick, ...restProps } =
                            props}
                        <Button
                            variant="footer"
                            selected={hashtagPinEnabled}
                            onClick={(e) => {
                                toggleHashtagPin();
                                if (typeof tooltipOnclick === "function") {
                                    tooltipOnclick(e);
                                }
                            }}
                            ariaLabel={$_(
                                "keyboardButtonBar.hashtag_pin_toggle",
                            )}
                            {...restProps}
                        >
                            <div class="hashtag-pin-group">
                                <div class="hashtag-icon svg-icon"></div>
                                {#if hashtagPinEnabled}
                                    <div class="thumbtack-icon svg-icon"></div>
                                {:else}
                                    <div
                                        class="thumbtack-slash-icon svg-icon"
                                    ></div>
                                {/if}
                            </div>
                        </Button>
                    {/snippet}
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content sideOffset={8} class="tooltip-content">
                        {$_("keyboardButtonBar.hashtag_pin_tooltip")}
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </div>
    </div>
</div>

<style>
    .footer-button-bar {
        display: flex;
        align-items: center;
        width: 100%;
        max-width: 800px;
        height: var(--keyboard-button-bar-height);
        padding: 0 8px;
        margin: auto;
        background: var(--bg-buttonbar);
        position: var(--app-overlay-position);
        left: 0;
        right: 0;
        bottom: var(--keyboard-button-bar-bottom);
        z-index: 98;
        transition: bottom 0.2s ease;

        .image-icon {
            mask-image: url("/icons/image-solid-full.svg");
            width: 36px;
            height: 36px;
        }

        .custom-emoji-icon {
            mask-image: url("/icons/face-smile-solid-full.svg");
            width: 32px;
            height: 32px;
        }

        /* postボタンは他より大きく見えるよう成長比と最小幅を優先 */
        :global(button.post-button) {
            flex: 2 1 0;
            width: clamp(40px, 22vw, 100px);
            height: var(--keyboard-button-bar-height);
            padding: 0 6px;
            border-radius: 4px;

            &:active {
                transform: scale(0.9);
                transition: transform 0.1s ease-in-out;
            }

            .plane-icon {
                mask-image: url("/icons/paper-plane-solid-full.svg");
                width: 34px;
                height: 34px;
                margin-right: 2px;
                margin-top: 2px;
            }
        }

        :global(.post-button-loading) {
            background-color: var(--theme);
            padding: 0;
            height: 100%;

            :global(.square) {
                background-color: var(--svg);
            }
        }

        .content-warning-icon {
            mask-image: url("/icons/eye-slash-solid-full.svg");
        }

        :global(.selected .content-warning-icon) {
            --svg: var(--danger);
        }

        .hashtag-pin-group {
            display: flex;
            align-items: center;

            .hashtag-icon {
                mask-image: url("/icons/hashtag-solid-full.svg");
                width: 26px;
                height: 26px;
                margin-right: -4px;
            }

            .thumbtack-icon {
                mask-image: url("/icons/thumbtack-solid-full.svg");
                width: 26px;
                height: 26px;
            }

            .thumbtack-slash-icon {
                mask-image: url("/icons/thumbtack-slash-solid-full.svg");
                width: 26px;
                height: 26px;
            }
        }

        :global(.selected .hashtag-pin-group .hashtag-icon),
        :global(.selected .hashtag-pin-group .thumbtack-icon) {
            --svg: var(--theme);
        }
    }

    .button-container {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        width: 100%;
    }

    /* flexアイテムが縮小できるようにmin-widthを0にする */
    .button-group-left,
    .button-group-center,
    .button-group-right {
        min-width: 0;
    }

    .button-group-left {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }

    .button-group-center {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .button-group-right {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }

    .progress-ring-container {
        position: absolute;
        bottom: calc(100% + 12px);
        left: 50%;
        transform: translateX(-50%);
        pointer-events: none;
        z-index: 99;
    }

    .progress-ring {
        display: block;
        transform: rotate(-90deg);
    }

    .progress-ring-bg {
        fill: none;
        stroke: rgb(128, 128, 128);
        stroke-width: 12;
    }

    .progress-ring-bar {
        fill: none;
        stroke: var(--theme);
        stroke-width: 12;
        stroke-dasharray: 100.53px;
    }

    :global(.footer-button-bar .footer) {
        width: 50px;
        height: var(--keyboard-button-bar-height);
    }

    :global(:root .footer-button-bar button.custom-emoji-button.selected) {
        filter: none;
    }

    :global(
            :root.light .footer-button-bar button.custom-emoji-button.selected
        ) {
        --btn-bg: rgba(0, 0, 0, 0.12);
        --svg: hsl(0, 0%, 18%);
    }

    :global(:root.dark .footer-button-bar button.custom-emoji-button.selected) {
        --btn-bg: rgba(255, 255, 255, 0.18);
        --svg: hsl(0, 0%, 100%);
    }

    :global(
            :root.light
                .footer-button-bar
                button.custom-emoji-button.selected:hover
        ) {
        --btn-bg: rgba(0, 0, 0, 0.12);
        --svg: hsl(0, 0%, 18%);
    }

    :global(
            :root.dark
                .footer-button-bar
                button.custom-emoji-button.selected:hover
        ) {
        --btn-bg: rgba(255, 255, 255, 0.18);
        --svg: hsl(0, 0%, 100%);
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
