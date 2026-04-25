<script lang="ts">
    import { _ } from "svelte-i18n";
    import { Tooltip } from "bits-ui";
    import DOMPurify from "dompurify";
    import { nip19 } from "nostr-tools";
    import Button from "./Button.svelte";
    import type { ReplyQuoteMode, ReplyQuoteState } from "../lib/types";
    import { preventKeyboardFocusChange } from "../lib/utils/keyboardFocusUtils";

    interface Props {
        reference: ReplyQuoteState;
        mode: ReplyQuoteMode;
        onClear: () => void;
        quoteNotificationEnabled?: boolean;
        onToggleQuoteNotification?: (enabled: boolean) => void;
    }

    const LOADING_INDICATOR_DELAY_MS = 300;

    let {
        reference,
        mode,
        onClear,
        quoteNotificationEnabled = undefined,
        onToggleQuoteNotification = undefined,
    }: Props = $props();

    let expanded = $state(false);
    let showDelayedLoading = $state(false);

    let isReply = $derived(mode === "reply");

    let modeLabel = $derived(
        isReply ? $_("replyQuote.reply_label") : $_("replyQuote.quote_label"),
    );

    let authorDisplay = $derived.by(() => {
        if (!reference.authorPubkey) return "";
        if (reference.authorDisplayName) return reference.authorDisplayName;
        const npub = nip19.npubEncode(reference.authorPubkey);
        return npub.slice(0, 12) + "..." + npub.slice(-4);
    });

    let sanitizedContent = $derived.by(() => {
        if (!reference.referencedEvent?.content) return "";
        const raw = reference.referencedEvent.content;
        const clean = DOMPurify.sanitize(raw, {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: [],
        });
        return clean;
    });

    let canToggleExpand = $derived(!!sanitizedContent);

    let showLoadingStatus = $derived(reference.loading && showDelayedLoading);

    let showErrorStatus = $derived(!!reference.error);

    let showHeaderStatus = $derived(showLoadingStatus || showErrorStatus);

    let effectiveQuoteNotificationEnabled = $derived(
        quoteNotificationEnabled ?? reference.quoteNotificationEnabled,
    );

    let quoteNotificationAriaLabel = $derived(
        effectiveQuoteNotificationEnabled
            ? $_("replyQuote.disable_quote_notification")
            : $_("replyQuote.enable_quote_notification"),
    );

    let quoteNotificationTooltip = $derived(
        effectiveQuoteNotificationEnabled
            ? $_("replyQuote.quote_notification_on_tooltip")
            : $_("replyQuote.quote_notification_off_tooltip"),
    );

    let statusLabel = $derived(
        showErrorStatus
            ? $_("replyQuote.fetch_error")
            : $_("replyQuote.loading"),
    );

    let toggleAriaLabel = $derived(
        canToggleExpand
            ? expanded
                ? $_("replyQuote.collapse")
                : $_("replyQuote.expand")
            : modeLabel,
    );

    function handleCancel() {
        onClear();
        expanded = false;
    }

    function toggleExpand() {
        expanded = !expanded;
    }

    function toggleQuoteNotification() {
        onToggleQuoteNotification?.(!effectiveQuoteNotificationEnabled);
    }

    $effect(() => {
        if (!reference.loading) {
            showDelayedLoading = false;
            return;
        }

        showDelayedLoading = false;

        const timeoutId = setTimeout(() => {
            showDelayedLoading = true;
        }, LOADING_INDICATOR_DELAY_MS);

        return () => {
            clearTimeout(timeoutId);
        };
    });

    $effect(() => {
        if (!canToggleExpand && expanded) {
            expanded = false;
        }
    });
</script>

<div class="reply-quote-preview">
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="preview-header"
        onmousedown={preventKeyboardFocusChange}
        ontouchstart={preventKeyboardFocusChange}
    >
        <div class="preview-meta">
            <Button
                className="preview-label"
                variant="default"
                shape="square"
                onClick={canToggleExpand ? toggleExpand : undefined}
                aria-expanded={canToggleExpand ? expanded : undefined}
                ariaLabel={toggleAriaLabel}
            >
                <div
                    class="preview-mode-icon svg-icon"
                    class:reply-icon={isReply}
                    class:quote-icon={!isReply}
                ></div>
                <span class="mode-text">{modeLabel}</span>
            </Button>
            {#if !isReply}
                <Tooltip.Provider>
                    <Tooltip.Root delayDuration={500}>
                        <Tooltip.Trigger>
                            {#snippet child({ props })}
                                {@const {
                                    onclick: tooltipOnclick,
                                    ...restProps
                                } = props}
                                <Button
                                    className="quote-notification-button"
                                    variant="default"
                                    shape="square"
                                    onClick={(e) => {
                                        toggleQuoteNotification();
                                        if (
                                            typeof tooltipOnclick === "function"
                                        ) {
                                            tooltipOnclick(e);
                                        }
                                    }}
                                    aria-pressed={effectiveQuoteNotificationEnabled}
                                    ariaLabel={quoteNotificationAriaLabel}
                                    {...restProps}
                                >
                                    <div
                                        class="quote-notification-icon svg-icon"
                                        class:bell-solid-icon={effectiveQuoteNotificationEnabled}
                                        class:bell-regular-icon={!effectiveQuoteNotificationEnabled}
                                    ></div>
                                </Button>
                            {/snippet}
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                            <Tooltip.Content
                                sideOffset={8}
                                class="tooltip-content reply-quote-tooltip-content"
                            >
                                {quoteNotificationTooltip}
                            </Tooltip.Content>
                        </Tooltip.Portal>
                    </Tooltip.Root>
                </Tooltip.Provider>
            {/if}
            {#if authorDisplay}
                <span class="author-name">{authorDisplay}</span>
            {/if}
        </div>
        {#if showHeaderStatus}
            <div
                class="preview-status"
                class:loading-status={showLoadingStatus}
                class:error-status={showErrorStatus}
            >
                <span class="preview-status-text">{statusLabel}</span>
            </div>
        {/if}
        <Button
            className="cancel-button"
            variant="default"
            shape="square"
            onClick={handleCancel}
            title={$_("replyQuote.cancel")}
            ariaLabel={$_("replyQuote.cancel")}
        >
            <div class="close-icon svg-icon"></div>
        </Button>
    </div>

    {#if expanded}
        {#if sanitizedContent}
            <div class="preview-content">
                <p class="content-text">{sanitizedContent}</p>
            </div>
        {/if}
    {/if}
</div>

<style>
    .reply-quote-preview {
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
        align-items: center;
        gap: 12px;

        .preview-meta {
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 0;
            flex: 1;

            :global(.preview-label) {
                gap: 6px;
                height: 50px;
                min-width: fit-content;
                padding: 0 10px 0 10px;
                border-radius: 0 6px 6px 0;
            }

            :global(.quote-notification-button) {
                height: 100%;
                width: 46px;
                flex-shrink: 0;
            }
        }

        :global(.cancel-button) {
            height: 50px;
            width: 50px;
            padding: 2px;
            flex-shrink: 0;
        }
    }

    .preview-status {
        min-width: 0;
        max-width: 220px;
        flex-shrink: 1;
        text-align: right;
    }

    .preview-status-text {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 0.8rem;
    }

    .loading-status {
        color: var(--text-muted);
    }

    .error-status {
        color: var(--danger);
    }

    .preview-mode-icon {
        width: 28px;
        height: 28px;
        flex-shrink: 0;
    }

    .reply-icon {
        mask-image: url("/icons/reply-solid-full.svg");
    }

    .quote-icon {
        mask-image: url("/icons/quote-right-solid-full.svg");
    }

    .quote-notification-icon {
        width: 24px;
        height: 24px;
    }

    .bell-regular-icon {
        mask-image: url("/icons/bell-regular-full.svg");
    }

    .bell-solid-icon {
        mask-image: url("/icons/bell-solid-full.svg");
    }

    .mode-text {
        font-size: 1rem;
        font-weight: 600;
        color: var(--theme);
        white-space: nowrap;
        flex-shrink: 0;
    }

    .author-name {
        min-width: 0;
        color: var(--text-light);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    :global(.cancel-button .close-icon) {
        width: 30px;
        height: 30px;
        mask-image: url("/icons/xmark-solid-full.svg");
    }

    :global(.reply-quote-tooltip-content) {
        z-index: 10000;
        max-width: 240px;
        border-radius: 6px;
        padding: 6px 8px;
        background: var(--bg-modal);
        color: var(--text);
        border: 1px solid var(--border);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
        font-size: 0.8rem;
        line-height: 1.35;
    }

    .preview-content {
        display: block;
        width: 100%;
        padding: 10px 20px 10px 20px;
        margin: 0;
        text-align: left;
        color: var(--text);
        font: inherit;
    }

    .content-text {
        margin: 0;
        white-space: pre-wrap;
        word-break: break-word;
        line-height: 1.4;
    }
</style>
