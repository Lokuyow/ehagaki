<script lang="ts">
    import { _ } from "svelte-i18n";
    import DOMPurify from "dompurify";
    import { nip19 } from "nostr-tools";
    import {
        replyQuoteState,
        clearReplyQuote,
    } from "../stores/replyQuoteStore.svelte";

    let expanded = $state(false);

    let rqState = $derived(replyQuoteState.value);
    let isReply = $derived(rqState?.mode === "reply");

    let modeLabel = $derived(
        isReply ? $_("replyQuote.reply_label") : $_("replyQuote.quote_label"),
    );

    let authorDisplay = $derived.by(() => {
        if (!rqState?.authorPubkey) return "";
        // リアクティブな表示名を優先
        if (rqState.authorDisplayName) return rqState.authorDisplayName;
        // npub短縮表示にフォールバック
        const npub = nip19.npubEncode(rqState.authorPubkey);
        return npub.slice(0, 12) + "..." + npub.slice(-4);
    });

    let sanitizedContent = $derived.by(() => {
        if (!rqState?.referencedEvent?.content) return "";
        const raw = rqState.referencedEvent.content;
        // DOMPurifyでHTMLタグを完全除去（kind:1はプレーンテキスト）
        const clean = DOMPurify.sanitize(raw, {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: [],
        });
        return clean;
    });

    function handleCancel() {
        clearReplyQuote();
        expanded = false;
    }

    function toggleExpand() {
        expanded = !expanded;
    }
</script>

{#if rqState}
    <div
        class="reply-quote-preview"
        class:reply-preview={isReply}
        class:quote-preview={!isReply}
    >
        <div class="preview-header">
            <button
                class="preview-label"
                onclick={sanitizedContent ? toggleExpand : undefined}
                aria-expanded={expanded}
                aria-label={expanded
                    ? $_("replyQuote.collapse")
                    : $_("replyQuote.expand")}
            >
                <div
                    class="preview-mode-icon svg-icon"
                    class:reply-icon={isReply}
                    class:quote-icon={!isReply}
                ></div>
                <span class="mode-text">{modeLabel}</span>
                {#if authorDisplay}
                    <span class="author-name">{authorDisplay}</span>
                {/if}
            </button>
            <button
                class="cancel-button"
                onclick={handleCancel}
                title={$_("replyQuote.cancel")}
                aria-label={$_("replyQuote.cancel")}
            >
                <div class="close-icon svg-icon"></div>
            </button>
        </div>

        {#if rqState.loading}
            <div class="preview-loading">
                <span class="loading-text">{$_("replyQuote.loading")}</span>
            </div>
        {:else if rqState.error}
            <div class="preview-error">
                <span>{$_("replyQuote.fetch_error")}</span>
            </div>
        {:else if sanitizedContent}
            {#if expanded}
                <button
                    class="preview-content"
                    onclick={toggleExpand}
                    aria-expanded={true}
                    aria-label={$_("replyQuote.collapse")}
                >
                    <p class="content-text">{sanitizedContent}</p>
                </button>
            {/if}
        {/if}
    </div>
{/if}

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

    .reply-preview {
        margin-bottom: 4px;
    }

    .quote-preview {
        margin-top: 4px;
    }

    .preview-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .preview-label {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 2px;
        width: 100%;
        min-width: 0;
        padding-left: 10px;
        overflow: hidden;
        background: none;
        border: none;
        cursor: pointer;
        font: inherit;
        color: inherit;
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
        color: var(--text-light);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-left: 4px;
    }

    .cancel-button {
        height: 50px;
        width: 50px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .cancel-button:hover {
        background-color: var(--btn-bg);
    }

    .cancel-button .close-icon {
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
        padding: 4px 10px 10px 20px;
        margin: 0;
        background: none;
        border: none;
        text-align: left;
        cursor: pointer;
        color: var(--text);
        font: inherit;
        max-height: 200px;
        overflow-y: auto;
    }

    .content-text {
        margin: 0;
        white-space: pre-wrap;
        word-break: break-word;
        line-height: 1.4;
    }

    .preview-label,
    .preview-content {
        &:active:not(:disabled) {
            transform: scale(0.992);
        }
    }
</style>
