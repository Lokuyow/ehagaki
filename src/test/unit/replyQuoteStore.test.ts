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
    setReplyQuoteError,
    updateReferencedEvent,
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
        const [target] = setReplyQuote({
            reply: { eventId, relayHints: [], authorPubkey: directPubkey },
            quotes: [],
        });

        initializeReplyNotificationRecipients(target, {
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
        const [target] = setReplyQuote({
            reply: { eventId, relayHints: [], authorPubkey },
            quotes: [{
                eventId: '33'.repeat(32),
                relayHints: [],
                authorPubkey,
            }],
        });
        const cleanup = onReplyQuoteChanged(listener);

        updateAuthorProfile(target, authorPubkey, {
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
        updateAuthorProfile(target, authorPubkey, {
            displayName: 'Alice',
            picture: 'https://example.com/alice.png',
        });
        updateAuthorProfile(target, 'wrong-pubkey', {
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
        const [target] = setReplyQuote({
            reply: { eventId, relayHints: [], authorPubkey: directPubkey },
            quotes: [],
        });
        initializeReplyNotificationRecipients(target, {
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

        updateReplyNotificationRecipientProfile(target, recipientPubkey, {
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
        updateReplyNotificationRecipientProfile(target, recipientPubkey, {
            displayName: null,
            picture: 'https://example.com/recipient.png',
        });
        updateReplyNotificationRecipientProfile({
            ...target,
            eventId: 'wrong-event',
        }, recipientPubkey, {
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
        })).toEqual(expect.objectContaining({
            eventId: '55'.repeat(32),
            mode: 'quote',
            ownerToken: expect.any(Symbol),
        }));
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
        })).toBeNull();
        expect(listener).not.toHaveBeenCalled();
        cleanup();
    });

    it('同じreply eventIdの再選択後は古いhydrate成功・失敗を無視する', () => {
        const eventId = 'aa'.repeat(32);
        const [oldTarget] = setReplyQuote({
            reply: { eventId, relayHints: ['wss://old.example.com'], authorPubkey: null },
            quotes: [],
        });
        const [newTarget] = setReplyQuote({
            reply: { eventId, relayHints: ['wss://new.example.com'], authorPubkey: null },
            quotes: [],
        });
        const event = {
            id: eventId,
            pubkey: 'bb'.repeat(32),
            created_at: 1,
            kind: 1,
            tags: [],
            content: 'new',
            sig: 'sig',
        };
        const listener = vi.fn();
        const cleanup = onReplyQuoteChanged(listener);

        updateReferencedEvent(newTarget, event);
        listener.mockClear();
        setReplyQuoteError(oldTarget, 'Event not found');
        updateReferencedEvent(oldTarget, { ...event, content: 'old' });

        expect(replyQuoteState.value.reply).toMatchObject({
            relayHints: ['wss://new.example.com'],
            referencedEvent: event,
            loading: false,
            error: null,
        });
        expect(listener).not.toHaveBeenCalled();
        cleanup();
    });

    it('古いhydrate失敗後に同じeventIdを再選択して成功できる', () => {
        const eventId = 'ab'.repeat(32);
        const [oldTarget] = setReplyQuote({
            reply: { eventId, relayHints: [], authorPubkey: null },
            quotes: [],
        });
        setReplyQuoteError(oldTarget, 'Event not found');
        const [newTarget] = setReplyQuote({
            reply: { eventId, relayHints: [], authorPubkey: null },
            quotes: [],
        });
        const event = {
            id: eventId,
            pubkey: 'bc'.repeat(32),
            created_at: 1,
            kind: 1,
            tags: [],
            content: 'new success',
            sig: 'sig',
        };
        updateReferencedEvent(newTarget, event);

        expect(replyQuoteState.value.reply).toMatchObject({
            referencedEvent: event,
            loading: false,
            error: null,
        });
    });

    it('replyとquoteのmode変更では同じeventIdでも古いownerを適用しない', () => {
        const eventId = 'cc'.repeat(32);
        const [replyTarget] = setReplyQuote({
            reply: { eventId, relayHints: [], authorPubkey: null },
            quotes: [],
        });
        const [quoteTarget] = setReplyQuote({
            reply: null,
            quotes: [{ eventId, relayHints: [], authorPubkey: null }],
        });
        setReplyQuoteError(replyTarget, 'old reply error');
        expect(replyQuoteState.value.quotes[0].error).toBeNull();

        const [newReplyTarget] = setReplyQuote({
            reply: { eventId, relayHints: [], authorPubkey: null },
            quotes: [],
        });
        setReplyQuoteError(quoteTarget, 'old quote error');
        expect(replyQuoteState.value.reply?.error).toBeNull();
        expect(newReplyTarget.ownerToken).not.toBe(replyTarget.ownerToken);
    });

    it('clear・下書き復元後は以前のhydrate ownershipを失効させる', () => {
        const eventId = 'dd'.repeat(32);
        const [oldTarget] = setReplyQuote({
            reply: { eventId, relayHints: [], authorPubkey: null },
            quotes: [],
        });
        clearReplyQuote();
        setReplyQuote({
            reply: { eventId, relayHints: [], authorPubkey: null },
            quotes: [],
        });
        setReplyQuoteError(oldTarget, 'after clear');
        expect(replyQuoteState.value.reply?.error).toBeNull();

        restoreReplyQuote({
            reply: {
                mode: 'reply',
                eventId,
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
        setReplyQuoteError(oldTarget, 'after draft restore');
        expect(replyQuoteState.value.reply?.error).toBeNull();
    });

    it('古いownerによる通知recipient初期化とauthor/recipient profile反映を無視する', () => {
        const eventId = 'ee'.repeat(32);
        const authorPubkey = 'ff'.repeat(32);
        const recipientPubkey = '11'.repeat(32);
        const [oldTarget] = setReplyQuote({
            reply: { eventId, relayHints: [], authorPubkey },
            quotes: [],
        });
        const [newTarget] = setReplyQuote({
            reply: { eventId, relayHints: [], authorPubkey },
            quotes: [],
        });
        const event = {
            id: eventId,
            pubkey: authorPubkey,
            created_at: 1,
            kind: 1,
            tags: [['p', recipientPubkey]],
            content: '',
            sig: '',
        };
        initializeReplyNotificationRecipients(newTarget, event);
        initializeReplyNotificationRecipients(oldTarget, {
            ...event,
            tags: [['p', '22'.repeat(32)]],
        });
        updateAuthorProfile(oldTarget, authorPubkey, {
            displayName: 'Old',
            picture: null,
        });
        updateReplyNotificationRecipientProfile(oldTarget, recipientPubkey, {
            displayName: 'Old recipient',
            picture: null,
        });

        expect(replyQuoteState.value.reply).toMatchObject({
            authorDisplayName: null,
            replyNotificationRecipients: [{
                pubkey: recipientPubkey,
                displayName: null,
            }],
        });
    });
});
