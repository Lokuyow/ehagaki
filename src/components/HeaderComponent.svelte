<script lang="ts">
    import { _ } from "svelte-i18n";
    import { Tooltip } from "bits-ui";
    import { editorState } from "../stores/editorStore.svelte";
    import Button from "./Button.svelte";
    import BalloonMessage from "./BalloonMessage.svelte";
    import { type BalloonMessage as BalloonMessageType } from "../lib/types";
    import { resolveCompactMessageText } from "../lib/utils/headerComponentUtils";
    import { preventKeyboardFocusChange } from "../lib/utils/keyboardFocusUtils";
    import { getAppRuntimeEnvironment } from "../lib/appRuntimeEnvironment";

    const OFFICIAL_EHAGAKI_URL = "https://lokuyow.github.io/ehagaki/";

    interface Props {
        onResetPostContent: () => void;
        onShowDraftList: () => void;
        onChooseTarget?: () => void;
        canResetPostContent?: boolean;
        balloonMessage?: BalloonMessageType | null;
        compactMessage?: BalloonMessageType | null;
        showMascot?: boolean;
        showFlavorText?: boolean;
    }

    let {
        onResetPostContent,
        onShowDraftList,
        onChooseTarget = () => undefined,
        canResetPostContent = undefined,
        balloonMessage = null,
        compactMessage = null,
        showMascot = true,
        showFlavorText = true,
    }: Props = $props();
    const runtimeEnvironment = getAppRuntimeEnvironment();
    const overlayTarget = runtimeEnvironment.overlayTarget;
    const isContainerLayout = runtimeEnvironment.layoutMode === "container";
    const isWebComponent = runtimeEnvironment.runtimeKind === "web-component";
    const isIframe = runtimeEnvironment.runtimeKind === "iframe";
    const siteIconHref = isWebComponent || isIframe
        ? OFFICIAL_EHAGAKI_URL
        : runtimeEnvironment.appHomeHref;

    let postStatus = $derived(editorState.postStatus);
    let isUploading = $derived(editorState.isUploading);
    let canPost = $derived(editorState.canPost);
    let canResetCurrentPostContent = $derived(canResetPostContent ?? canPost);
    const mascotOuterFill = "var(--mascot-accent-color, #3FB57E)";
    const mascotInnerFill = "var(--mascot-inner-color, #EDFCF5)";
    const mascotFaceFill = "var(--mascot-face-color, #4D524F)";
    let compactSuccessText = $derived(
        $_("balloonMessage.success.compact_post_success") || "投稿完了",
    );
    let compactMessageText = $derived(
        resolveCompactMessageText(compactMessage, compactSuccessText),
    );
</script>

<div
    class="header-container"
    class:container-layout={isContainerLayout}
>
    <div class="header-left">
        {#if showMascot}
            <a
                href={siteIconHref}
                class="site-icon-link"
                aria-label="ehagaki"
                target={isWebComponent ? "_blank" : undefined}
                rel={isWebComponent ? "noopener noreferrer" : undefined}
            >
                <svg
                    class="site-icon"
                    viewBox="0 0 700 700"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M85 0C93.2843 0 99.7748 6.86473 102.22 14.7798C108.523 35.179 127.531 50 150 50C172.469 50 191.477 35.179 197.78 14.7798C200.225 6.86473 206.716 0 215 0H285C293.284 0 299.775 6.86473 302.22 14.7798C308.523 35.179 327.531 50 350 50C372.469 50 391.477 35.179 397.78 14.7798C400.225 6.86473 406.716 0 415 0H485C493.284 0 499.775 6.86473 502.22 14.7798C508.523 35.179 527.531 50 550 50C572.469 50 591.477 35.179 597.78 14.7798C600.225 6.86473 606.716 0 615 0H685C693.284 0 700 6.71573 700 15V79C700 87.2843 693.135 93.7748 685.22 96.2204C664.821 102.523 650 121.531 650 144C650 166.469 664.821 185.477 685.22 191.78C693.135 194.225 700 200.716 700 209V279C700 287.284 693.135 293.775 685.22 296.22C664.821 302.523 650 321.531 650 344C650 366.469 664.821 385.477 685.22 391.78C693.135 394.225 700 400.716 700 409V479C700 487.284 693.135 493.775 685.22 496.22C664.821 502.523 650 521.531 650 544C650 566.469 664.821 585.477 685.22 591.78C693.135 594.225 700 600.716 700 609V685C700 693.284 693.284 700 685 700H615C606.716 700 600.225 693.135 597.78 685.22C591.477 664.821 572.469 650 550 650C527.531 650 508.523 664.821 502.22 685.22C499.775 693.135 493.284 700 485 700H415C406.716 700 400.225 693.135 397.78 685.22C391.477 664.821 372.469 650 350 650C327.531 650 308.523 664.821 302.22 685.22C299.775 693.135 293.284 700 285 700H215C206.716 700 200.225 693.135 197.78 685.22C191.477 664.821 172.469 650 150 650C127.531 650 108.523 664.821 102.22 685.22C99.7748 693.135 93.2843 700 85 700H15C6.71573 700 0 693.284 0 685V609C0 600.716 6.86473 594.225 14.7798 591.78C35.179 585.477 50 566.469 50 544C50 521.531 35.179 502.523 14.7798 496.22C6.86473 493.775 0 487.284 0 479V409C0 400.716 6.86473 394.225 14.7798 391.78C35.179 385.477 50 366.469 50 344C50 321.531 35.179 302.523 14.7798 296.22C6.86473 293.775 0 287.284 0 279V209C0 200.716 6.86473 194.225 14.7798 191.78C35.179 185.477 50 166.469 50 144C50 121.531 35.179 102.523 14.7798 96.2204C6.86473 93.7748 0 87.2843 0 79V15C0 6.71573 6.71573 0 15 0H85Z"
                        fill={mascotOuterFill}
                        data-mascot-part="outer"
                    />
                    <rect
                        x="90"
                        y="90"
                        width="520"
                        height="520"
                        rx="15"
                        fill={mascotInnerFill}
                        data-mascot-part="inner"
                    />
                    <path
                        d="M402.84 444.677C407.332 435.388 401.155 424.496 390.842 424.148C371.637 423.5 352.138 424.309 332.96 426.552C323.152 427.699 317.817 438.316 322.303 447.113V447.113C325.214 452.821 331.494 455.935 337.849 455.108C354.489 452.943 371.523 452.284 388.167 453.162C394.319 453.486 400.159 450.224 402.84 444.677V444.677Z"
                        fill={mascotFaceFill}
                        data-mascot-part="face"
                    />
                    <rect
                        width="46.7771"
                        height="133.689"
                        rx="23.3885"
                        transform="matrix(0.99863 -0.052336 0.048357 0.99883 155.532 284.427)"
                        fill={mascotFaceFill}
                        data-mascot-part="face"
                    />
                    <path
                        d="M499.352 306.026C499.43 293.111 509.963 282.607 522.878 282.564V282.564C535.793 282.521 546.199 292.955 546.12 305.87L545.591 392.817C545.512 405.731 534.979 416.235 522.064 416.279V416.279C509.149 416.322 498.744 405.887 498.822 392.973L499.352 306.026Z"
                        fill={mascotFaceFill}
                        data-mascot-part="face"
                    />
                </svg>
            </a>
        {/if}
        {#if showFlavorText && balloonMessage}
            <BalloonMessage
                type={balloonMessage.type}
                message={balloonMessage.message}
            />
        {/if}
        {#if (!showFlavorText || !showMascot) && compactMessage}
            <div class="compact-message {compactMessage.type}">
                <span class="compact-message-text">{compactMessageText}</span>
            </div>
        {/if}
    </div>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="header-actions"
        onmousedown={preventKeyboardFocusChange}
        ontouchstart={preventKeyboardFocusChange}
    >
        <Tooltip.Provider>
            <div class="buttons-container">
                <Tooltip.Root delayDuration={500}>
                    <Tooltip.Trigger>
                        {#snippet child({ props })}
                            {@const { onclick: tooltipOnclick, ...restProps } =
                                props}
                            <Button
                                variant="header"
                                shape="square"
                                contentLayout="icon"
                                className="clear-button"
                                disabled={!canResetCurrentPostContent ||
                                    postStatus.sending ||
                                    isUploading}
                                onClick={(e) => {
                                    onResetPostContent();
                                    if (typeof tooltipOnclick === "function") {
                                        tooltipOnclick(e);
                                    }
                                }}
                                ariaLabel={$_("postComponent.clear_editor")}
                                {...restProps}
                            >
                                <div class="trash-icon svg-icon"></div>
                            </Button>
                        {/snippet}
                    </Tooltip.Trigger>
                    <Tooltip.Portal to={overlayTarget}>
                        <Tooltip.Content sideOffset={8} class="tooltip-content">
                            {$_("postComponent.clear_editor")}
                        </Tooltip.Content>
                    </Tooltip.Portal>
                </Tooltip.Root>
                <Tooltip.Root delayDuration={500}>
                    <Tooltip.Trigger>
                        {#snippet child({ props })}
                            {@const { onclick: tooltipOnclick, ...restProps } =
                                props}
                            <Button
                                variant="header"
                                shape="square"
                                contentLayout="icon"
                                className="draft-list-button"
                                onClick={(e) => {
                                    onShowDraftList();
                                    if (typeof tooltipOnclick === "function") {
                                        tooltipOnclick(e);
                                    }
                                }}
                                ariaLabel={$_("draft.list_title") ||
                                    "下書き"}
                                {...restProps}
                            >
                                <div class="list-icon svg-icon"></div>
                            </Button>
                        {/snippet}
                    </Tooltip.Trigger>
                    <Tooltip.Portal to={overlayTarget}>
                        <Tooltip.Content sideOffset={8} class="tooltip-content">
                            {$_("draft.list_title") || "下書き"}
                        </Tooltip.Content>
                    </Tooltip.Portal>
                </Tooltip.Root>
                <Tooltip.Root delayDuration={500}>
                    <Tooltip.Trigger>
                        {#snippet child({ props })}
                            {@const { onclick: tooltipOnclick, ...restProps } =
                                props}
                            <Button
                                variant="header"
                                shape="square"
                                contentLayout="icon"
                                className="choose-target-button"
                                disabled={postStatus.sending || isUploading}
                                onClick={(e) => {
                                    onChooseTarget();
                                    if (typeof tooltipOnclick === "function") {
                                        tooltipOnclick(e);
                                    }
                                }}
                                ariaLabel={$_("composerTarget.title")}
                                {...restProps}
                            >
                                <div class="choose-target-icon svg-icon"></div>
                            </Button>
                        {/snippet}
                    </Tooltip.Trigger>
                    <Tooltip.Portal to={overlayTarget}>
                        <Tooltip.Content sideOffset={8} class="tooltip-content">
                            {$_("composerTarget.title")}
                        </Tooltip.Content>
                    </Tooltip.Portal>
                </Tooltip.Root>
            </div>
        </Tooltip.Provider>
    </div>
</div>

<style>
    .header-container {
        max-width: 800px;
        width: 100%;
        height: 58px;
        margin-bottom: 6px;
        padding: 0 8px;
        display: flex;
        align-items: center;

        @media (width >= 801px) {
            padding: 0;
        }

        @container (width < 801px) {
            &.container-layout {
                padding: 0 8px;
            }
        }
    }

    .header-left {
        display: flex;
        align-items: center;
        height: 100%;
        width: 100%;
        min-width: 0;
    }

    a.site-icon-link {
        display: flex;
        height: 100%;
    }

    .site-icon {
        --mascot-accent-color: var(--accent-color-custom, #3FB57E);
        --mascot-inner-color: var(--accent-color-custom-inner, #EDFCF5);
        --mascot-face-color: var(--accent-color-custom-face, #4D524F);
        width: 52px;
        height: 52px;
        margin-top: auto;
    }

    .compact-message {
        --compact-message-bg: color-mix(
            in srgb,
            var(--dialog-bg) 82%,
            var(--base) 18%
        );
        --compact-message-color: var(--text);
        --compact-message-border: var(--border-hr);
        display: flex;
        align-items: center;
        min-width: 0;
        max-width: min(100%, 280px);
        margin: 0 6px;
        padding: 8px 10px;
        background: var(--compact-message-bg);
        color: var(--compact-message-color);
        font-size: 1rem;
        line-height: 1.2;
        border: 1px solid var(--compact-message-border);
    }

    .compact-message.success {
        --compact-message-bg: var(--message-success-bg);
        --compact-message-color: var(--message-success-color);
        --compact-message-border: var(--message-success-border);
    }

    .compact-message.error,
    .compact-message.warning {
        --compact-message-bg: var(--message-error-bg);
        --compact-message-color: var(--message-error-color);
        --compact-message-border: var(--message-error-border);
    }

    .compact-message.tips {
        --compact-message-bg: var(--message-tips-bg);
        --compact-message-color: var(--message-tips-color);
        --compact-message-border: var(--message-tips-border);
    }

    .compact-message.flavor {
        --compact-message-bg: var(--message-flavor-bg);
        --compact-message-color: var(--message-flavor-color);
        --compact-message-border: var(--message-flavor-border);
    }

    .compact-message-text {
        min-width: 0;
        overflow-wrap: anywhere;
    }

    .header-actions {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: fit-content;
        height: 100%;
        margin-inline-start: auto;
    }

    .buttons-container {
        display: flex;
        gap: 4px;
        align-items: center;
        height: 100%;
    }

    :global(.header.clear-button),
    :global(.header.draft-list-button),
    :global(.header.choose-target-button) {
        width: 50px;
    }

    .trash-icon,
    .list-icon,
    .choose-target-icon {
        --icon-size: 30px;
    }

    .trash-icon {
        mask-image: url("/icons/delete_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .list-icon {
        mask-image: url("/icons/edit_note_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .choose-target-icon {
        mask-image: url("/icons/alternate_email_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
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
