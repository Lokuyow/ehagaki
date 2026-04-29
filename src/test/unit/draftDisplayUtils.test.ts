import { describe, expect, it } from 'vitest';

import { createDraftListDisplay, type DraftContextLabels } from '../../lib/draftDisplayUtils';
import type { Draft, DraftReplyQuoteEntryData, NostrEvent } from '../../lib/types';

const labels: DraftContextLabels = {
    channel: 'チャンネル',
    reply: 'リプライ',
    quote: '引用',
    image: '[画像]',
    video: '[動画]',
};

function createEvent(content: string): NostrEvent {
    return {
        id: 'event-id',
        pubkey: 'pubkey',
        created_at: 1,
        kind: 1,
        tags: [],
        content,
        sig: 'sig',
    };
}

function createReference(
    mode: 'reply' | 'quote',
    overrides: Partial<DraftReplyQuoteEntryData> = {},
): DraftReplyQuoteEntryData {
    return {
        mode,
        eventId: `${mode}-event`,
        relayHints: ['wss://relay.example.com'],
        authorPubkey: null,
        quoteNotificationEnabled: false,
        authorDisplayName: `${mode}-author`,
        referencedEvent: createEvent(`${mode} body`),
        rootEventId: null,
        rootRelayHint: null,
        rootPubkey: null,
        ...overrides,
    };
}

describe('createDraftListDisplay', () => {
    it('channel, reply, quote の順でタイトルと context rows を生成する', () => {
        const draft: Draft = {
            id: 'draft-1',
            content: '<p>draft body</p>',
            preview: 'draft body [リプライ][引用]#General',
            timestamp: 1,
            channelData: {
                eventId: 'channel-event',
                relayHints: ['wss://channel.example.com'],
                name: 'General',
                about: 'channel about',
                picture: null,
            },
            replyQuoteData: {
                reply: createReference('reply'),
                quotes: [createReference('quote')],
            },
        };

        const display = createDraftListDisplay(draft, labels, document);

        expect(display.title).toBe('チャンネル: General / リプライ: reply-author / 引用: quote-author');
        expect(display.bodyPreview).toBe('draft body');
        expect(display.contexts).toEqual([
            {
                kind: 'channel',
                label: 'チャンネル',
                name: 'General',
                detail: 'channel about',
            },
            {
                kind: 'reply',
                label: 'リプライ',
                name: 'reply-author',
                detail: 'reply body',
            },
            {
                kind: 'quote',
                label: '引用',
                name: 'quote-author',
                detail: 'quote body',
            },
        ]);
    });

    it('複数 quote を省略せずにすべて表示する', () => {
        const draft: Draft = {
            id: 'draft-2',
            content: '<p></p>',
            preview: '[引用]',
            timestamp: 1,
            replyQuoteData: {
                reply: null,
                quotes: [
                    createReference('quote', { eventId: 'quote-1', authorDisplayName: 'Alice' }),
                    createReference('quote', { eventId: 'quote-2', authorDisplayName: 'Bob' }),
                ],
            },
        };

        const display = createDraftListDisplay(draft, labels, document);

        expect(display.title).toBe('引用: Alice / 引用: Bob');
        expect(display.contexts.map((context) => context.name)).toEqual(['Alice', 'Bob']);
        expect(display.bodyPreview).toBe('');
    });

    it('context がない場合は本文とメディアから title を作る', () => {
        const draft: Draft = {
            id: 'draft-3',
            content: '<p>Hello</p>',
            preview: 'Hello [画像]',
            timestamp: 1,
            galleryItems: [
                {
                    id: 'image-1',
                    type: 'image',
                    src: 'https://example.com/a.jpg',
                    isPlaceholder: false,
                },
            ],
        };

        const display = createDraftListDisplay(draft, labels, document);

        expect(display.title).toBe('Hello [画像]');
        expect(display.contexts).toEqual([]);
    });
});
