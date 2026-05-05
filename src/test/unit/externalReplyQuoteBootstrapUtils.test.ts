import { describe, expect, it, vi } from 'vitest';

import { processReplyQuoteReference } from '../../lib/bootstrap/externalReplyQuoteBootstrapUtils';

describe('externalReplyQuoteBootstrapUtils', () => {
    it('参照イベントが見つからない時は reply quote error を設定する', async () => {
        const setReplyQuoteError = vi.fn();

        await processReplyQuoteReference({
            reference: {
                eventId: 'event-1',
                relayHints: ['wss://relay.example.com/'],
                authorPubkey: null,
            },
            replyQuoteService: {
                fetchReferencedEvent: vi.fn(async () => null),
                extractThreadInfo: vi.fn(),
            },
            relayConfig: null,
            updateReferencedEvent: vi.fn(),
            updateAuthorDisplayName: vi.fn(),
            setReplyQuoteError,
        });

        expect(setReplyQuoteError).toHaveBeenCalledWith('event-1', 'Event not found');
    });

    it('参照イベント取得後に thread info と displayName を反映する', async () => {
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
        const updateAuthorDisplayName = vi.fn();

        await processReplyQuoteReference({
            reference: {
                eventId: 'event-1',
                relayHints: ['wss://relay.example.com/'],
                authorPubkey: null,
            },
            replyQuoteService: {
                fetchReferencedEvent: vi.fn(async () => event),
                extractThreadInfo: vi.fn(() => threadInfo),
            },
            relayProfileService: {
                fetchProfileRealtime: vi.fn(async () => ({
                    name: 'Author Name',
                    displayName: '',
                })),
            } as never,
            relayConfig: null,
            updateReferencedEvent,
            updateAuthorDisplayName,
            setReplyQuoteError: vi.fn(),
        });

        expect(updateReferencedEvent).toHaveBeenCalledWith('event-1', event, threadInfo);
        expect(updateAuthorDisplayName).toHaveBeenCalledWith('event-1', 'Author Name');
    });
});