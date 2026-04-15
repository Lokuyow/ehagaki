import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
    clearReplyQuote,
    clearReplyReference,
    onReplyQuoteChanged,
    removeQuoteReference,
    replyQuoteState,
    restoreReplyQuote,
    setReplyQuote,
} from '../../stores/replyQuoteStore.svelte';

describe('replyQuoteStore', () => {
    beforeEach(() => {
        clearReplyQuote();
    });

    it('setReplyQuote で変更通知を送る', () => {
        const listener = vi.fn();
        const cleanup = onReplyQuoteChanged(listener);

        setReplyQuote({
            reply: {
                eventId: '11'.repeat(32),
                relayHints: ['wss://relay.example.com'],
                authorPubkey: '22'.repeat(32),
            },
            quotes: [],
        });

        expect(listener).toHaveBeenCalledWith(replyQuoteState.value);
        cleanup();
    });

    it('clearReplyReference と removeQuoteReference で変更通知を送る', () => {
        const listener = vi.fn();
        const cleanup = onReplyQuoteChanged(listener);

        setReplyQuote({
            reply: {
                eventId: '11'.repeat(32),
                relayHints: ['wss://relay.example.com'],
                authorPubkey: '22'.repeat(32),
            },
            quotes: [
                {
                    eventId: '33'.repeat(32),
                    relayHints: [],
                    authorPubkey: null,
                },
            ],
        });
        listener.mockClear();

        clearReplyReference();
        expect(listener).toHaveBeenCalledTimes(1);
        expect(replyQuoteState.value.reply).toBeNull();

        listener.mockClear();
        removeQuoteReference('33'.repeat(32));
        expect(listener).toHaveBeenCalledTimes(1);
        expect(replyQuoteState.value.quotes).toHaveLength(0);
        cleanup();
    });

    it('restoreReplyQuote で変更通知を送る', () => {
        const listener = vi.fn();
        const cleanup = onReplyQuoteChanged(listener);

        restoreReplyQuote({
            reply: {
                mode: 'reply',
                eventId: '11'.repeat(32),
                relayHints: [],
                authorPubkey: null,
                authorDisplayName: null,
                referencedEvent: null,
                rootEventId: null,
                rootRelayHint: null,
                rootPubkey: null,
            },
            quotes: [],
        });

        expect(listener).toHaveBeenCalledWith(replyQuoteState.value);
        cleanup();
    });
});