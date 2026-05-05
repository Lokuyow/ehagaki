import { describe, expect, it, vi } from 'vitest';

import { createPersistedDraft } from '../../lib/draftPersistenceUtils';
import type { DraftChannelData, DraftReplyQuoteData, MediaGalleryItem } from '../../lib/types';

describe('draftPersistenceUtils', () => {
    it('createPersistedDraft は preview builder の結果と payload を使って Draft を組み立てる', () => {
        const galleryItems: MediaGalleryItem[] = [
            { id: 'image-1', type: 'image', src: 'https://example.com/image.jpg', isPlaceholder: false },
        ];
        const channelData: DraftChannelData = {
            eventId: 'channel-1',
            relayHints: ['wss://relay.example.com'],
            name: 'General',
            about: 'about',
            picture: 'https://example.com/channel.png',
        };
        const replyQuoteData: DraftReplyQuoteData = {
            mode: 'reply',
            eventId: 'event-1',
            relayHints: ['wss://relay.example.com'],
            authorPubkey: 'author-pubkey',
            quoteNotificationEnabled: false,
            authorDisplayName: 'author-name',
            referencedEvent: null,
            rootEventId: 'root-event-id',
            rootRelayHint: 'wss://root-relay.example.com',
            rootPubkey: 'root-pubkey',
        };
        const buildPreview = vi.fn(() => 'preview text');

        const draft = createPersistedDraft({
            id: 'draft-1',
            htmlContent: '<p>本文</p>',
            timestamp: 123,
            galleryItems,
            replyQuoteData,
            channelData,
            buildPreview,
        });

        expect(buildPreview).toHaveBeenCalledWith('<p>本文</p>', galleryItems, replyQuoteData, channelData);
        expect(draft).toEqual({
            id: 'draft-1',
            content: '<p>本文</p>',
            preview: 'preview text',
            timestamp: 123,
            galleryItems,
            replyQuoteData,
            channelData,
        });
    });

    it('createPersistedDraft は空の optional field を undefined に正規化する', () => {
        const draft = createPersistedDraft({
            id: 'draft-2',
            htmlContent: '<p>本文</p>',
            timestamp: 456,
            galleryItems: [],
            buildPreview: () => 'preview text',
        });

        expect(draft).toEqual({
            id: 'draft-2',
            content: '<p>本文</p>',
            preview: 'preview text',
            timestamp: 456,
            galleryItems: undefined,
            channelData: undefined,
            replyQuoteData: undefined,
        });
    });
});