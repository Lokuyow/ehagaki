<script lang="ts">
    import type { Snippet } from "svelte";
    import { _ } from "svelte-i18n";
    import { Tooltip } from "bits-ui";
    import Button from "./Button.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import {
        contentWarningStore,
        contentWarningReasonStore,
        hashtagPinStore,
    } from "../stores/tagsStore.svelte";
    import { editorState, submitPost } from "../stores/editorStore.svelte";
    import { preventKeyboardFocusChange } from "../lib/utils/keyboardFocusUtils";
    import { getAppRuntimeEnvironment } from "../lib/appRuntimeEnvironment";
    import { usePostButtonLongPress } from "../lib/hooks/usePostButtonLongPress.svelte";
    import { settingsStore } from "../stores/settingsStore.svelte";

    interface Props {
        onUploadImage?: () => void;
        onPostButtonTap?: () => void;
        customEmojiPickerOpen?: boolean;
        onCustomEmojiPickerOpenChange?: (open: boolean) => void;
        hasPostingCapability?: boolean;
        showPostButton?: boolean;
        postLoading?: boolean;
        mediaEnabled?: boolean;
        customEmojiEnabled?: boolean;
        customEmojiAvailable?: boolean;
        contentWarningAvailable?: boolean;
        hashtagPinAvailable?: boolean;
    }

    interface TooltipButtonConfig {
        tooltip: string;
        ariaLabel: string;
        onClick: () => void;
        className?: string;
        selected?: boolean;
        pressed?: boolean;
        disabled?: boolean;
    }

    const overlayTarget = getAppRuntimeEnvironment().overlayTarget;
    const isHostOwnedLiteBuild = typeof __EHAGAKI_COMPOSER_LITE__ !== 'undefined' && __EHAGAKI_COMPOSER_LITE__;
    const PROGRESS_RING_CIRCUMFERENCE = 100.53; // 2π × 16px

    let {
        onUploadImage,
        onPostButtonTap,
        customEmojiPickerOpen = false,
        onCustomEmojiPickerOpenChange,
        hasPostingCapability = false,
        showPostButton = true,
        postLoading,
        mediaEnabled = true,
        customEmojiEnabled = true,
        customEmojiAvailable = true,
        contentWarningAvailable = true,
        hashtagPinAvailable = true,
    }: Props = $props();

    // エディタ状態を取得
    let postStatus = $derived(editorState.postStatus);
    let isUploading = $derived(editorState.isUploading);

    let mediaDisabled = $derived(
        !hasPostingCapability ||
            postStatus.sending ||
            editorState.isSubmitPending ||
            isUploading,
    );
    let postDisabled = $derived(
        !editorState.canPost ||
            editorState.isSubmitPending ||
            postStatus.sending ||
            !!postLoading ||
            isUploading ||
            !hasPostingCapability ||
            !!postStatus.completed,
    );

    // TOP uses shared delivery readiness; other surfaces retain their short hold.
    let isShowingLoader = $state(false);

    // 送信中のローダー表示管理
    $effect(() => {
        if (postLoading !== undefined) {
            isShowingLoader = postLoading;
            return;
        }
        if (postStatus.sending) {
            isShowingLoader = true;
        } else if (isShowingLoader) {
            // 送信完了したら0.4秒後にローダーを隠す
            const timer = setTimeout(() => {
                isShowingLoader = false;
            }, 400);
            return () => clearTimeout(timer);
        }
    });

    // Content Warning状態を取得
    let contentWarningActive = $derived(contentWarningStore.value);
    let failClosedContentWarning = $derived(
        settingsStore.failClosedContentWarning,
    );

    // Content Warningトグル
    function toggleContentWarning() {
        contentWarningStore.toggle();
        if (!contentWarningStore.value) {
            // disabledになった時はreasonをクリア
            contentWarningReasonStore.reset();
        }
    }

    // ハッシュタグピン留め状態を取得
    let hashtagPinActive = $derived(hashtagPinStore.value);

    // ハッシュタグピン留めトグル
    function toggleHashtagPin() {
        hashtagPinStore.toggle();
    }

    // 長押し投稿（タッチ操作）
    const longPress = usePostButtonLongPress({
        isDisabled: () => postDisabled,
        onComplete: () => submitPost(),
        onReleaseEarly: () => onPostButtonTap?.(),
    });

    let postTooltipOpen = $state(false);

    function preservePostPressFocus(event: Event) {
        // Posting must not suppress the active IME when viewport detection is
        // a false negative. Other toolbar buttons retain their existing policy.
        if (!isHostOwnedLiteBuild && event.target instanceof Element && event.target.closest('button.post-button')) {
            event.preventDefault();
        } else {
            preventKeyboardFocusChange(event);
        }
    }

    function startLongPress(event: PointerEvent) {
        longPress.start(event);
        if (longPress.ringVisible) {
            postTooltipOpen = false;
        }
    }

    function handlePostClick() {
        if (longPress.consumeSuppressedClick()) {
            return;
        }

        if (!postDisabled) {
            submitPost();
        }
    }

    function setCustomEmojiPickerOpen(open: boolean): void {
        onCustomEmojiPickerOpenChange?.(open);
    }
</script>

{#snippet tooltipButton(config: TooltipButtonConfig, icon: Snippet)}
    <Tooltip.Root delayDuration={500}>
        <Tooltip.Trigger>
            {#snippet child({ props })}
                {@const { onclick: tooltipOnclick, ...restProps } = props}
                <Button
                    variant="footer"
                    contentLayout="icon"
                    className={config.className}
                    selected={config.selected}
                    disabled={config.disabled}
                    aria-pressed={config.pressed}
                    onClick={(e) => {
                        config.onClick();
                        if (typeof tooltipOnclick === "function") {
                            tooltipOnclick(e);
                        }
                    }}
                    ariaLabel={config.ariaLabel}
                    {...restProps}
                >
                    {@render icon()}
                </Button>
            {/snippet}
        </Tooltip.Trigger>
        <Tooltip.Portal to={overlayTarget}>
            <Tooltip.Content sideOffset={8} class="tooltip-content">
                {config.tooltip}
            </Tooltip.Content>
        </Tooltip.Portal>
    </Tooltip.Root>
{/snippet}

{#snippet imageIcon()}
    <div class="image-icon svg-icon"></div>
{/snippet}

{#snippet contentWarningIcon()}
    <div
        class="content-warning-icon svg-icon"
        class:fail-closed-format={failClosedContentWarning}
    ></div>
{/snippet}

{#snippet hashtagPinIcon()}
    <div class="hashtag-pin-group">
        <div class="hashtag-icon svg-icon"></div>
        {#if hashtagPinActive}
            <div class="thumbtack-icon svg-icon"></div>
        {:else}
            <div class="thumbtack-slash-icon svg-icon"></div>
        {/if}
    </div>
{/snippet}

<div class="footer-button-bar" data-long-pressing={longPress.ringVisible}>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="button-container"
        onpointerdowncapture={preservePostPressFocus}
        ontouchstartcapture={preservePostPressFocus}
    >
        <div class="button-group-left">
            {#if mediaEnabled}
                {@render tooltipButton(
                    {
                        tooltip: $_("keyboardButtonBar.upload_image_tooltip"),
                        ariaLabel: $_("postComponent.upload_image"),
                        onClick: () => onUploadImage?.(),
                        className: "image-button",
                        disabled: mediaDisabled,
                    },
                    imageIcon,
                )}
            {/if}
            {#if customEmojiAvailable}
                <Button
                    variant="footer"
                    contentLayout="icon"
                    className="custom-emoji-button"
                    selected={customEmojiPickerOpen}
                    disabled={!customEmojiEnabled ||
                        postStatus.sending}
                    aria-expanded={customEmojiPickerOpen}
                    onClick={() => {
                        setCustomEmojiPickerOpen(!customEmojiPickerOpen);
                    }}
                    ariaLabel={$_("keyboardButtonBar.custom_emoji")}
                >
                    <div
                        class="custom-emoji-icon svg-icon"
                        class:active={customEmojiPickerOpen}
                    ></div>
                </Button>
            {/if}
        </div>
        <div class="button-group-center">
            {#if showPostButton}
                {#if longPress.ringVisible}
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
                                    (1 - longPress.progress)}px"
                            />
                        </svg>
                    </div>
                {/if}
                <Tooltip.Root
                    delayDuration={500}
                    bind:open={
                        () => postTooltipOpen,
                        (v) => {
                            if (!longPress.blocksTooltip || !v) postTooltipOpen = v;
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
                                contentLayout="icon"
                                className="post-button {isShowingLoader
                                    ? 'loading'
                                    : ''}"
                                disabled={postDisabled}
                                onClick={(e) => {
                                    if (typeof tooltipOnclick === "function") {
                                        tooltipOnclick(e);
                                    }
                                    handlePostClick();
                                }}
                                ariaLabel={$_("postComponent.post")}
                                {...restProps}
                                onpointerdown={(e) => {
                                    if (typeof tooltipPointerDown === "function")
                                        tooltipPointerDown(e);
                                    startLongPress(e);
                                }}
                                onpointerupcapture={longPress.preventCompletedReleaseDefault}
                                ontouchendcapture={longPress.preventCompletedReleaseDefault}
                                onpointerup={(e) => {
                                    if (typeof tooltipPointerUp === "function")
                                        tooltipPointerUp(e);
                                    longPress.cancel();
                                }}
                                onpointerleave={(e) => {
                                    if (typeof tooltipPointerLeave === "function")
                                        tooltipPointerLeave(e);
                                    longPress.cancel();
                                }}
                                onpointercancel={longPress.cancel}
                                oncontextmenu={(e) => e.preventDefault()}
                            >
                                {#if isShowingLoader}
                                    <LoadingPlaceholder
                                        showLoader={true}
                                        text={false}
                                        customClass="post-button-loading"
                                    />
                                {:else}
                                    <div class="svg-icon" class:plane-icon={editorState.submitIcon !== 'favorite'} class:favorite-icon={editorState.submitIcon === 'favorite'}></div>
                                {/if}
                            </Button>
                        {/snippet}
                    </Tooltip.Trigger>
                    <Tooltip.Portal to={overlayTarget}>
                        <Tooltip.Content sideOffset={8} class="tooltip-content">
                            {$_("keyboardButtonBar.post_tooltip")}
                        </Tooltip.Content>
                    </Tooltip.Portal>
                </Tooltip.Root>
            {/if}
        </div>
        <div class="button-group-right">
            {#if contentWarningAvailable}
                {@render tooltipButton(
                    {
                        tooltip: $_("keyboardButtonBar.content_warning_tooltip"),
                        ariaLabel: $_("keyboardButtonBar.content_warning_toggle"),
                        onClick: toggleContentWarning,
                        selected: contentWarningActive,
                        pressed: contentWarningActive,
                    },
                    contentWarningIcon,
                )}
            {/if}
            {#if hashtagPinAvailable}
                {@render tooltipButton(
                    {
                        tooltip: $_("keyboardButtonBar.hashtag_pin_tooltip"),
                        ariaLabel: $_("keyboardButtonBar.hashtag_pin_toggle"),
                        onClick: toggleHashtagPin,
                        selected: hashtagPinActive,
                        pressed: hashtagPinActive,
                    },
                    hashtagPinIcon,
                )}
            {/if}
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
        margin: auto;
        background: var(--footer-buttonbar-bg);
        position: var(--app-overlay-position);
        left: 0;
        right: 0;
        bottom: 0;
        /* 開閉時はキーボードに付いてスライドし、表示中のパン・高さ変化には即座に追従する */
        translate: 0 calc(-1 * var(--keyboard-button-bar-bottom));
        z-index: 98;
        transition: translate var(--keyboard-follow-duration)
            var(--keyboard-follow-easing);

        .image-icon {
            mask-image: url("/icons/image_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
            width: 36px;
            height: 36px;
        }

        .custom-emoji-icon {
            mask-image: url("/icons/sentiment_satisfied_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
            width: 32px;
            height: 32px;
        }

        .custom-emoji-icon.active {
            mask-image: url("/icons/sentiment_satisfied_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg");
        }

        /* postボタンは他より大きく見えるよう成長比と最小幅を優先 */
        :global(button.post-button) {
            flex: 2 1 0;
            width: clamp(40px, 24vw, 100px);
            height: var(--keyboard-button-bar-height);

            &:active {
                scale: 0.9;
                transition: scale 0.1s ease-in-out;
            }

            .favorite-icon {
                mask-image: url("/icons/favorite_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
                width: 34px;
                height: 34px;
            }

            .plane-icon {
                mask-image: url("/icons/paper-plane-solid-full.svg");
                width: 34px;
                height: 34px;
                margin-inline-end: 2px;
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
            mask-image: url("/icons/warning_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg");
        }

        .content-warning-icon.fail-closed-format {
            mask-image: url("/icons/visibility_off_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        }

        :global(.selected .content-warning-icon) {
            --svg: var(--danger);
        }

        .hashtag-pin-group {
            display: flex;
            align-items: center;

            .hashtag-icon {
                mask-image: url("/icons/tag_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
                width: 26px;
                height: 26px;
                margin-inline-end: -4px;
            }

            .thumbtack-icon {
                mask-image: url("/icons/keep_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
                width: 26px;
                height: 26px;
            }

            .thumbtack-slash-icon {
                mask-image: url("/icons/keep_off_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
                width: 26px;
                height: 26px;
            }
        }

        :global(.selected .hashtag-pin-group .hashtag-icon),
        :global(.selected .hashtag-pin-group .thumbtack-icon) {
            --svg: var(--theme);
        }
    }

    .footer-button-bar[data-long-pressing="true"] {
        z-index: 100;
    }

    @media (prefers-reduced-motion: reduce) {
        .footer-button-bar {
            transition: none;
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

    div.button-group-right {
        display: flex;
        align-items: center;
        justify-content: space-evenly;

        :global(.footer.selected:not(:disabled)) {
            background: var(--btn-bg);
        }
    }

    .progress-ring-container {
        position: absolute;
        bottom: calc(100% + 12px);
        left: 50%;
        translate: -50% 0;
        pointer-events: none;
        z-index: 99;
    }

    .progress-ring {
        display: block;
        rotate: -90deg;
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

    :global(.tooltip-content) {
        --tooltip-padding: 12px;
        --tooltip-font-size: 1rem;
        --tooltip-line-height: normal;
        --tooltip-z-index: 100;
        --tooltip-max-width: none;
        font-weight: 600;
    }
</style>
