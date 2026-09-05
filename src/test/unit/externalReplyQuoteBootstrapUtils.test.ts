import { describe, expect, it, vi } from 'vitest';

import { processReplyQuoteReference } from '../../lib/bootstrap/externalReplyQuoteBootstrapUtils';

describe('externalReplyQuoteBootstrapUtils', () => {
    it('参照イベントが見つからない時は reply quote error を設定する', async () => {
        const setReplyQuoteError = vi.fn();

        await processReplyQuoteReference({
            reference: {
                eventId: 'event-1',
                mode: 'reply',
                ownerToken: Symbol('owner'),
                relayHints: ['wss://relay.example.com/'],
                authorPubkey: null,
            },
            replyQuoteService: {
                fetchReferencedEvent: vi.fn(async () => null),
                extractThreadInfo: vi.fn(),
            },
            relayConfig: null,
            updateReferencedEvent: vi.fn(),
            setReplyQuoteError,
        });

        expect(setReplyQuoteError).toHaveBeenCalledWith(
            expect.objectContaining({ eventId: 'event-1', mode: 'reply' }),
            'Event not found',
        );
    });

    it('参照イベント取得後に thread info と通知受信者を初期化する', async () => {
        const event = {
            id: 'event-1',
            pubkey: 'author-pubkey',
            created_at: 1,
            kind: 1,
            tags: [],
            content: 'hello',
            sig: 'sig',
        };
        const threadInfo = {
            rootEventId: 'root-event-id',
            rootRelayHint: 'wss://relay.example.com/',
            rootPubkey: 'root-pubkey',
        };
        const updateReferencedEvent = vi.fn();
        const initializeReplyNotificationRecipients = vi.fn();
        const applyPreloadedAuthorPreviewPresentation = vi.fn();
        const preloadedProfiles = {
            'author-pubkey': {
                displayName: 'Host author',
                picture: 'https://example.com/author.png',
            },
        };

        await processReplyQuoteReference({
            reference: {
                eventId: 'event-1',
                mode: 'reply',
                ownerToken: Symbol('owner'),
                relayHints: ['wss://relay.example.com/'],
                authorPubkey: null,
            },
            replyQuoteService: {
                fetchReferencedEvent: vi.fn(async () => event),
                extractThreadInfo: vi.fn(() => threadInfo),
            },
            relayConfig: null,
            updateReferencedEvent,
            initializeReplyNotificationRecipients,
            preloadedProfiles,
            applyPreloadedAuthorPreviewPresentation,
            setReplyQuoteError: vi.fn(),
        });

        expect(updateReferencedEvent).toHaveBeenCalledWith(
            expect.objectContaining({ eventId: 'event-1', mode: 'reply' }),
            event,
            threadInfo,
        );
        expect(applyPreloadedAuthorPreviewPresentation).toHaveBeenCalledWith(
            [expect.objectContaining({ eventId: 'event-1', mode: 'reply' })],
            preloadedProfiles,
        );
        expect(updateReferencedEvent.mock.invocationCallOrder[0])
            .toBeLessThan(applyPreloadedAuthorPreviewPresentation.mock.invocationCallOrder[0]);
        expect(initializeReplyNotificationRecipients).toHaveBeenCalledWith(
            expect.objectContaining({ eventId: 'event-1', mode: 'reply' }),
            event,
        );
    });
});
