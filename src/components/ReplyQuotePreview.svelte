<script lang="ts">
    import { _ } from "svelte-i18n";
    import DOMPurify from "dompurify";
    import { nip19 } from "nostr-tools";
    import Button from "./Button.svelte";
    import type { ReplyQuoteMode, ReplyQuoteState } from "../lib/types";

    interface Props {
        reference: ReplyQuoteState;
        mode: ReplyQuoteMode;
        onClear: () => void;
    }

    let { reference, mode, onClear }: Props = $props();

    let expanded = $state(false);

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

    function handleCancel() {
        onClear();
        expanded = false;
    }

    function toggleExpand() {
        expanded = !expanded;
    }
</script>

<div class="reply-quote-preview">
    <div class="preview-header">
        <div class="preview-meta">
            <Button
                className="preview-label"
                variant="default"
                shape="square"
                onClick={sanitizedContent ? toggleExpand : undefined}
                aria-expanded={expanded}
                ariaLabel={expanded
                    ? $_("replyQuote.collapse")
                    : $_("replyQuote.expand")}
            >
                <div
                    class="preview-mode-icon svg-icon"
                    class:reply-icon={isReply}
                    class:quote-icon={!isReply}
                ></div>
                <span class="mode-text">{modeLabel}</span>
            </Button>
            {#if authorDisplay}
                <span class="author-name">{authorDisplay}</span>
            {/if}
        </div>
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

    {#if reference.loading}
        <div class="preview-loading">
            <span class="loading-text">{$_("replyQuote.loading")}</span>
        </div>
    {:else if reference.error}
        <div class="preview-error">
            <span>{$_("replyQuote.fetch_error")}</span>
        </div>
    {:else if sanitizedContent}
        {#if expanded}
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
        justify-content: space-between;
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
            }
        }

        :global(.cancel-button) {
            height: 50px;
            width: 50px;
            padding: 2px;
            flex-shrink: 0;
        }
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

    .preview-loading {
        padding: 4px 0;
    }

    .loading-text {
        color: var(--text-muted);
        font-size: 0.8rem;
    }

    .preview-error {
        padding: 4px 0;
        color: var(--danger);
        font-size: 0.8rem;
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
