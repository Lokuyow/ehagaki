import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
    addQuoteReference,
    clearReplyQuote,
    clearReplyReference,
    onReplyQuoteChanged,
    removeQuoteReference,
    replyQuoteState,
    restoreReplyQuote,
    setQuoteNotificationEnabled,
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
                quoteNotificationEnabled: false,
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

    it('古い下書きのquoteNotificationEnabled未指定はfalseで復元する', () => {
        restoreReplyQuote({
            reply: null,
            quotes: [
                {
                    mode: 'quote',
                    eventId: '33'.repeat(32),
                    relayHints: [],
                    authorPubkey: null,
                    authorDisplayName: null,
                    referencedEvent: null,
                    rootEventId: null,
                    rootRelayHint: null,
                    rootPubkey: null,
                },
            ],
        });

        expect(replyQuoteState.value.quotes[0].quoteNotificationEnabled).toBe(false);
    });

    it('setQuoteNotificationEnabled で quote の通知状態だけを更新する', () => {
        const listener = vi.fn();
        const cleanup = onReplyQuoteChanged(listener);
        const quoteEventId = '33'.repeat(32);

        setReplyQuote({
            reply: {
                eventId: '11'.repeat(32),
                relayHints: [],
                authorPubkey: '22'.repeat(32),
            },
            quotes: [
                {
                    eventId: quoteEventId,
                    relayHints: [],
                    authorPubkey: '44'.repeat(32),
                },
            ],
        });
        listener.mockClear();

        setQuoteNotificationEnabled(quoteEventId, true);

        expect(replyQuoteState.value.reply?.quoteNotificationEnabled).toBe(false);
        expect(replyQuoteState.value.quotes[0].quoteNotificationEnabled).toBe(true);
        expect(listener).toHaveBeenCalledWith(replyQuoteState.value);
        cleanup();
    });

    it('addQuoteReference は既存 state を保持したまま quote を追加し、重複は無視する', () => {
        const listener = vi.fn();
        const cleanup = onReplyQuoteChanged(listener);

        setReplyQuote({
            reply: {
                eventId: '11'.repeat(32),
                relayHints: ['wss://reply.example.com'],
                authorPubkey: '22'.repeat(32),
            },
            quotes: [
                {
                    eventId: '33'.repeat(32),
                    relayHints: ['wss://quote-1.example.com'],
                    authorPubkey: '44'.repeat(32),
                },
            ],
        });
        listener.mockClear();

        expect(addQuoteReference({
            eventId: '55'.repeat(32),
            relayHints: ['wss://quote-2.example.com'],
            authorPubkey: '66'.repeat(32),
        })).toBe(true);
        expect(replyQuoteState.value.reply?.eventId).toBe('11'.repeat(32));
        expect(replyQuoteState.value.quotes.map((quote) => quote.eventId)).toEqual([
            '33'.repeat(32),
            '55'.repeat(32),
        ]);
        expect(listener).toHaveBeenCalledTimes(1);

        listener.mockClear();
        expect(addQuoteReference({
            eventId: '55'.repeat(32),
            relayHints: ['wss://quote-2.example.com'],
            authorPubkey: '66'.repeat(32),
        })).toBe(false);
        expect(listener).not.toHaveBeenCalled();
        cleanup();
    });
});
