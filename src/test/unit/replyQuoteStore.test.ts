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
    initializeReplyNotificationRecipients,
    updateAuthorProfile,
    updateReplyNotificationRecipientProfile,
    setReplyNotificationRecipientEnabled,
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
        expect(replyQuoteState.value.reply?.authorPicture).toBeNull();
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

    it('リプライの継承pタグだけを通知候補にして個別に切り替える', () => {
        const eventId = '11'.repeat(32);
        const directPubkey = '22'.repeat(32);
        const recipientPubkey = '33'.repeat(32);
        setReplyQuote({
            reply: { eventId, relayHints: [], authorPubkey: directPubkey },
            quotes: [],
        });

        initializeReplyNotificationRecipients(eventId, {
            id: eventId,
            pubkey: directPubkey,
            created_at: 1,
            kind: 1,
            tags: [['p', directPubkey], ['p', recipientPubkey], ['p', recipientPubkey]],
            content: '',
            sig: '',
        });
        setReplyNotificationRecipientEnabled(eventId, recipientPubkey, true);

        expect(replyQuoteState.value.reply?.replyNotificationRecipients).toEqual([
            { pubkey: recipientPubkey, displayName: null, picture: null, enabled: true },
        ]);
    });

    it('作者プロフィールをevent IDとpubkeyが一致する場合だけ一括更新する', () => {
        const eventId = '11'.repeat(32);
        const authorPubkey = '22'.repeat(32);
        const listener = vi.fn();
        setReplyQuote({
            reply: { eventId, relayHints: [], authorPubkey },
            quotes: [{
                eventId: '33'.repeat(32),
                relayHints: [],
                authorPubkey,
            }],
        });
        const cleanup = onReplyQuoteChanged(listener);

        updateAuthorProfile(eventId, authorPubkey, {
            displayName: ' Alice ',
            picture: ' https://example.com/alice.png ',
        });

        expect(replyQuoteState.value.reply).toMatchObject({
            authorDisplayName: 'Alice',
            authorPicture: 'https://example.com/alice.png',
        });
        expect(replyQuoteState.value.quotes[0]).toMatchObject({
            authorDisplayName: null,
            authorPicture: null,
        });
        expect(listener).toHaveBeenCalledOnce();

        listener.mockClear();
        updateAuthorProfile(eventId, authorPubkey, {
            displayName: 'Alice',
            picture: 'https://example.com/alice.png',
        });
        updateAuthorProfile(eventId, 'wrong-pubkey', {
            displayName: 'Wrong',
            picture: null,
        });
        expect(listener).not.toHaveBeenCalled();
        cleanup();
    });

    it('通知対象プロフィールを一括更新しenabledを維持する', () => {
        const eventId = '11'.repeat(32);
        const directPubkey = '22'.repeat(32);
        const recipientPubkey = '33'.repeat(32);
        setReplyQuote({
            reply: { eventId, relayHints: [], authorPubkey: directPubkey },
            quotes: [],
        });
        initializeReplyNotificationRecipients(eventId, {
            id: eventId,
            pubkey: directPubkey,
            created_at: 1,
            kind: 1,
            tags: [['p', recipientPubkey]],
            content: '',
            sig: '',
        });
        const listener = vi.fn();
        const cleanup = onReplyQuoteChanged(listener);

        updateReplyNotificationRecipientProfile(eventId, recipientPubkey, {
            displayName: '   ',
            picture: ' https://example.com/recipient.png ',
        });

        expect(replyQuoteState.value.reply?.replyNotificationRecipients).toEqual([{
            pubkey: recipientPubkey,
            displayName: null,
            picture: 'https://example.com/recipient.png',
            enabled: false,
        }]);
        expect(listener).toHaveBeenCalledOnce();

        listener.mockClear();
        updateReplyNotificationRecipientProfile(eventId, recipientPubkey, {
            displayName: null,
            picture: 'https://example.com/recipient.png',
        });
        updateReplyNotificationRecipientProfile('wrong-event', recipientPubkey, {
            displayName: 'Wrong',
            picture: null,
        });
        expect(listener).not.toHaveBeenCalled();
        cleanup();
    });

    it('下書きのpicture欠落と空白をnullへ正規化する', () => {
        restoreReplyQuote({
            reply: {
                mode: 'reply',
                eventId: '11'.repeat(32),
                relayHints: [],
                authorPubkey: '22'.repeat(32),
                authorDisplayName: '   ',
                authorPicture: '   ',
                replyNotificationRecipients: [{
                    pubkey: '33'.repeat(32),
                    displayName: ' Bob ',
                    enabled: true,
                }],
                referencedEvent: null,
                rootEventId: null,
                rootRelayHint: null,
                rootPubkey: null,
            },
            quotes: [],
        });

        expect(replyQuoteState.value.reply).toMatchObject({
            authorDisplayName: null,
            authorPicture: null,
            replyNotificationRecipients: [{
                pubkey: '33'.repeat(32),
                displayName: 'Bob',
                picture: null,
                enabled: true,
            }],
        });
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
