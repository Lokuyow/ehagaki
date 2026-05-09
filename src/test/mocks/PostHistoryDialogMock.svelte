<script lang="ts">
    interface Props {
        show: boolean;
        onClose: () => void;
        onReplyPost?: (post: Record<string, unknown>) => void;
        onQuotePost?: (post: Record<string, unknown>) => void;
        pubkeyHex?: string | null;
        rxNostr?: unknown;
        relayConfig?: unknown;
    }

    let {
        show,
        onClose,
        onReplyPost = undefined,
        onQuotePost = undefined,
    }: Props = $props();

    const quotePost = {
        eventId: "history-quote-target",
        pubkeyHex: "a".repeat(64),
        kind: 1,
        content: "quote target",
        relayHints: ["wss://quote.example.com/"],
        acceptedRelays: ["wss://accepted.example.com/"],
        rawEvent: null,
    };
</script>

{#if show}
    <div data-testid="post-history-dialog-mock">
        <button
            type="button"
            data-testid="post-history-dialog-quote"
            onclick={() => onQuotePost?.(quotePost)}
        >
            quote
        </button>
        <button
            type="button"
            data-testid="post-history-dialog-close"
            onclick={onClose}
        >
            close
        </button>
        {#if onReplyPost}
            <button
                type="button"
                data-testid="post-history-dialog-reply"
                onclick={() => onReplyPost?.(quotePost)}
            >
                reply
            </button>
        {/if}
    </div>
{/if}
