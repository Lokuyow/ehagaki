<script lang="ts">
    import { _ } from "svelte-i18n";
    import { Tooltip } from "bits-ui";
    import { nip19 } from "nostr-tools";
    import Button from "./Button.svelte";
    import ComposerContextPreviewShell from "./ComposerContextPreviewShell.svelte";
    import ProfileAvatar from "./ProfileAvatar.svelte";
    import type { ReplyQuoteMode, ReplyQuoteState } from "../lib/types";
    import { sanitizePlainText } from "../lib/utils/domSanitizer";
    import { shortenMiddle } from "../lib/utils/textDisplayUtils";

    interface Props {
        reference: ReplyQuoteState;
        mode: ReplyQuoteMode;
        onClear: () => void;
        quoteNotificationEnabled?: boolean;
        onToggleQuoteNotification?: (enabled: boolean) => void;
        onToggleReplyNotification?: (pubkey: string, enabled: boolean) => void;
    }

    const LOADING_INDICATOR_DELAY_MS = 300;

    let {
        reference,
        mode,
        onClear,
        quoteNotificationEnabled = undefined,
        onToggleQuoteNotification = undefined,
        onToggleReplyNotification = undefined,
    }: Props = $props();

    let expanded = $state(false);
    let showDelayedLoading = $state(false);

    let isReply = $derived(mode === "reply");

    let modeLabel = $derived(
        isReply ? $_("replyQuote.reply_label") : $_("replyQuote.quote_label"),
    );

    let modeIconClass = $derived(isReply ? "reply-icon" : "quote-icon");

    let authorDisplay = $derived.by(() => {
        if (!reference.authorPubkey) return "";
        if (reference.authorDisplayName) return reference.authorDisplayName;
        const npub = nip19.npubEncode(reference.authorPubkey);
        return shortenMiddle(npub, 12, 4);
    });

    let sanitizedContent = $derived.by(() => {
        if (!reference.referencedEvent?.content) return "";
        const raw = reference.referencedEvent.content;
        return sanitizePlainText(raw);
    });

    let canToggleExpand = $derived(!!sanitizedContent);

    let showLoadingStatus = $derived(reference.loading && showDelayedLoading);

    let showErrorStatus = $derived(!!reference.error);

    let showHeaderStatus = $derived(showLoadingStatus || showErrorStatus);

    let effectiveQuoteNotificationEnabled = $derived(
        quoteNotificationEnabled ?? reference.quoteNotificationEnabled,
    );

    let replyNotificationRecipients = $derived(
        isReply ? (reference.replyNotificationRecipients ?? []) : [],
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

    function getRecipientDisplay(recipient: {
        pubkey: string;
        displayName: string | null;
    }): string {
        if (recipient.displayName) return recipient.displayName;
        return shortenMiddle(nip19.npubEncode(recipient.pubkey), 12, 4);
    }

    function getReplyNotificationAriaLabel(recipient: {
        pubkey: string;
        displayName: string | null;
        enabled: boolean;
    }): string {
        const display = getRecipientDisplay(recipient);
        return recipient.enabled
            ? `${display}: ${$_("replyQuote.disable_reply_notification")}`
            : `${display}: ${$_("replyQuote.enable_reply_notification")}`;
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

<ComposerContextPreviewShell
    previewClass="reply-quote-preview"
    {modeIconClass}
    {modeLabel}
    {expanded}
    {canToggleExpand}
    {toggleAriaLabel}
    clearAriaLabel={$_("replyQuote.cancel")}
    onToggle={toggleExpand}
    onClear={handleCancel}
>
    {#snippet meta()}
        {#if !isReply}
            <Tooltip.Provider>
                <Tooltip.Root delayDuration={500}>
                    <Tooltip.Trigger>
                        {#snippet child({ props })}
                            {@const { onclick: tooltipOnclick, ...restProps } =
                                props}
                            <Button
                                className="quote-notification-button"
                                variant="default"
                                shape="square"
                                onClick={(e) => {
                                    toggleQuoteNotification();
                                    if (typeof tooltipOnclick === "function") {
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
            <span class="author-profile">
                <ProfileAvatar
                    src={reference.authorPicture ?? ""}
                    alt=""
                    rootClassName="reply-quote-profile-avatar"
                    imageClassName="reply-quote-profile-avatar-image"
                    fallbackClassName="reply-quote-profile-avatar-fallback"
                    fallbackAriaLabel=""
                />
                <span class="author-name">{authorDisplay}</span>
            </span>
        {/if}
    {/snippet}

    {#snippet headerExtra()}
        {#if replyNotificationRecipients.length > 0}
            <Tooltip.Provider>
                <div class="reply-notification-recipients">
                    {#each replyNotificationRecipients as recipient (recipient.pubkey)}
                        <Tooltip.Root delayDuration={500}>
                            <Tooltip.Trigger>
                                {#snippet child({ props })}
                                    {@const {
                                        onclick: tooltipOnclick,
                                        ...restProps
                                    } = props}
                                    <Button
                                        className="reply-notification-recipient"
                                        variant="default"
                                        onClick={(e) => {
                                            onToggleReplyNotification?.(
                                                recipient.pubkey,
                                                !recipient.enabled,
                                            );
                                            if (
                                                typeof tooltipOnclick ===
                                                "function"
                                            ) {
                                                tooltipOnclick(e);
                                            }
                                        }}
                                        aria-pressed={recipient.enabled}
                                        ariaLabel={getReplyNotificationAriaLabel(
                                            recipient,
                                        )}
                                        {...restProps}
                                    >
                                        <div
                                            class="reply-notification-icon svg-icon"
                                            class:bell-solid-icon={recipient.enabled}
                                            class:bell-regular-icon={!recipient.enabled}
                                        ></div>
                                        <ProfileAvatar
                                            src={recipient.picture ?? ""}
                                            alt=""
                                            rootClassName="reply-quote-profile-avatar"
                                            imageClassName="reply-quote-profile-avatar-image"
                                            fallbackClassName="reply-quote-profile-avatar-fallback"
                                            fallbackAriaLabel=""
                                        />
                                        <span
                                            class="reply-notification-recipient-name"
                                        >
                                            {getRecipientDisplay(recipient)}
                                        </span>
                                    </Button>
                                {/snippet}
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                                <Tooltip.Content
                                    sideOffset={8}
                                    class="tooltip-content reply-quote-tooltip-content"
                                >
                                    {recipient.enabled
                                        ? $_(
                                              "replyQuote.reply_notification_on_tooltip",
                                          )
                                        : $_(
                                              "replyQuote.reply_notification_off_tooltip",
                                          )}
                                </Tooltip.Content>
                            </Tooltip.Portal>
                        </Tooltip.Root>
                    {/each}
                </div>
            </Tooltip.Provider>
        {/if}
    {/snippet}

    {#snippet status()}
        {#if showHeaderStatus}
            <div
                class="preview-status"
                class:loading-status={showLoadingStatus}
                class:error-status={showErrorStatus}
            >
                <span class="preview-status-text">{statusLabel}</span>
            </div>
        {/if}
    {/snippet}

    {#snippet content()}
        {#if sanitizedContent}
            <p class="content-text">{sanitizedContent}</p>
        {/if}
    {/snippet}
</ComposerContextPreviewShell>

<style>
    :global(.reply-quote-preview) {
        --preview-meta-gap: 12px;
        --preview-content-padding: 10px 20px 10px 20px;
    }

    :global(.reply-quote-preview .quote-notification-button) {
        height: 100%;
        width: 46px;
        flex-shrink: 0;
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

    :global(.reply-quote-preview .reply-icon) {
        mask-image: url("/icons/chat_bubble_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg");
    }

    :global(.reply-quote-preview .quote-icon) {
        mask-image: url("/icons/format_quote_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg");
    }

    .quote-notification-icon {
        width: 24px;
        height: 24px;
    }

    .reply-notification-recipients {
        display: flex;
        flex-wrap: wrap;
        gap: 4px 6px;
        padding: 4px 10px;
    }

    :global(.reply-notification-recipient) {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
        max-width: 100%;
        height: 36px;
        border-radius: 6px;
        padding: 0 9px;
        background: color-mix(in srgb, var(--bg-input) 82%, var(--theme));
        color: var(--text-light);
    }

    :global(.reply-quote-profile-avatar) {
        width: 24px;
        height: 24px;
        flex: 0 0 auto;
        overflow: hidden;
        border-radius: 50%;
    }

    :global(.reply-quote-profile-avatar-image),
    :global(.reply-quote-profile-avatar-fallback) {
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }

    :global(.reply-quote-profile-avatar-image) {
        display: block;
        object-fit: cover;
    }

    :global(:root.light .reply-notification-recipient[aria-pressed="true"]) {
        background-color: color-mix(in srgb, var(--btn-bg), black 18%);
        color: var(--text);
    }

    :global(:root.dark .reply-notification-recipient[aria-pressed="true"]) {
        background-color: color-mix(in srgb, var(--btn-bg), white 22%);
        color: var(--text);
    }

    .reply-notification-recipient-name {
        min-width: 0;
        max-width: 160px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 0.85rem;
    }

    .reply-notification-icon {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
    }

    .bell-regular-icon {
        mask-image: url("/icons/notifications_off_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .bell-solid-icon {
        mask-image: url("/icons/notifications_active_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .author-profile {
        display: flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
        overflow: hidden;
    }

    .author-name {
        min-width: 0;
        color: var(--text-light);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    :global(.reply-quote-tooltip-content) {
        z-index: 10000;
        max-width: 240px;
        border-radius: 6px;
        padding: 6px 8px;
        background: var(--dialog-bg);
        color: var(--text);
        border: 1px solid var(--border);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
        font-size: 0.8rem;
        line-height: 1.35;
    }

    .content-text {
        margin: 0;
        white-space: pre-wrap;
        word-break: break-word;
        line-height: 1.4;
    }
</style>
