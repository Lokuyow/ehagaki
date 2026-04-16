import { describe, expect, it, vi } from 'vitest';

import type { Draft, MediaGalleryItem } from '../../lib/types';
import {
    applyDraftToComposer,
    buildDraftReplyQuoteData,
    createDraftSavePayload,
    extractMediaToGalleryHtml,
} from '../../lib/draftContentUtils';

function createReplyState() {
    return {
        mode: 'reply' as const,
        eventId: 'event-1',
        relayHints: ['wss://relay'],
        authorPubkey: 'author',
        authorDisplayName: 'author-name',
        referencedEvent: null,
        rootEventId: 'root-event',
        rootRelayHint: 'wss://root-relay',
        rootPubkey: 'root-pubkey',
        loading: false,
        error: null,
    };
}

function createQuoteState() {
    return {
        ...createReplyState(),
        mode: 'quote' as const,
        eventId: 'event-2',
    };
}

function createComposerState() {
    return {
        reply: createReplyState(),
        quotes: [createQuoteState()],
    };
}

function createEmptyComposerState() {
    return {
        reply: null,
        quotes: [],
    };
}

describe('buildDraftReplyQuoteData', () => {
    it('replyQuoteState がある場合に保存用データへ変換する', () => {
        expect(buildDraftReplyQuoteData(createComposerState())).toEqual({
            reply: {
                mode: 'reply',
                eventId: 'event-1',
                relayHints: ['wss://relay'],
                authorPubkey: 'author',
                authorDisplayName: 'author-name',
                referencedEvent: null,
                rootEventId: 'root-event',
                rootRelayHint: 'wss://root-relay',
                rootPubkey: 'root-pubkey',
            },
            quotes: [{
                mode: 'quote',
                eventId: 'event-2',
                relayHints: ['wss://relay'],
                authorPubkey: 'author',
                authorDisplayName: 'author-name',
                referencedEvent: null,
                rootEventId: 'root-event',
                rootRelayHint: 'wss://root-relay',
                rootPubkey: 'root-pubkey',
            }],
        });
    });

    it('replyQuoteState がない場合は undefined を返す', () => {
        expect(buildDraftReplyQuoteData(createEmptyComposerState())).toBeUndefined();
    });
});

describe('createDraftSavePayload', () => {
    it('空本文かつ非プレースホルダーメディアなしなら null を返す', () => {
        expect(createDraftSavePayload({
            htmlContent: '<p></p>',
            galleryItems: [{ id: 'ph', type: 'image', src: 'placeholder', isPlaceholder: true }],
            replyQuoteState: createEmptyComposerState(),
        })).toBeNull();
    });

    it('非プレースホルダーメディアと replyQuoteData を含む payload を返す', () => {
        const galleryItems: MediaGalleryItem[] = [
            { id: 'keep', type: 'image', src: 'https://example.com/a.jpg', isPlaceholder: false },
            { id: 'drop', type: 'image', src: 'placeholder', isPlaceholder: true },
        ];

        expect(createDraftSavePayload({
            htmlContent: '<p>body</p>',
            galleryItems,
            replyQuoteState: createComposerState(),
        })).toEqual({
            content: '<p>body</p>',
            galleryItems: [galleryItems[0]],
            replyQuoteData: {
                reply: {
                    mode: 'reply',
                    eventId: 'event-1',
                    relayHints: ['wss://relay'],
                    authorPubkey: 'author',
                    authorDisplayName: 'author-name',
                    referencedEvent: null,
                    rootEventId: 'root-event',
                    rootRelayHint: 'wss://root-relay',
                    rootPubkey: 'root-pubkey',
                },
                quotes: [{
                    mode: 'quote',
                    eventId: 'event-2',
                    relayHints: ['wss://relay'],
                    authorPubkey: 'author',
                    authorDisplayName: 'author-name',
                    referencedEvent: null,
                    rootEventId: 'root-event',
                    rootRelayHint: 'wss://root-relay',
                    rootPubkey: 'root-pubkey',
                }],
            },
        });
    });

    it('危険な HTML を保存前に sanitize する', () => {
        const payload = createDraftSavePayload({
            htmlContent: '<p>body</p><script>alert(1)</script><a href="javascript:alert(1)">danger</a><img src="javascript:alert(2)">',
            galleryItems: [],
            replyQuoteState: createEmptyComposerState(),
        });

        expect(payload).not.toBeNull();
        expect(payload?.content).toContain('<p>body</p>');
        expect(payload?.content).toContain('danger');
        expect(payload?.content).not.toContain('<script');
        expect(payload?.content).not.toContain('javascript:');
        expect(payload?.content).not.toContain('<img');
    });
});

describe('extractMediaToGalleryHtml', () => {
    it('HTML 内の画像と動画をギャラリーへ移して本文から除去する', () => {
        const addGalleryItem = vi.fn();
        const generateMediaItemId = vi.fn()
            .mockReturnValueOnce('media-1')
            .mockReturnValueOnce('media-2');

        const stripped = extractMediaToGalleryHtml({
            htmlContent: '<p>text</p><p><img src="https://example.com/a.jpg" alt="alt" dim="100x200"></p><video src="https://example.com/a.mp4"></video>',
            document,
            addGalleryItem,
            generateMediaItemId,
        });

        expect(addGalleryItem).toHaveBeenNthCalledWith(1, {
            id: 'media-1',
            type: 'image',
            src: 'https://example.com/a.jpg',
            isPlaceholder: false,
            blurhash: undefined,
            alt: 'alt',
            dim: '100x200',
        });
        expect(addGalleryItem).toHaveBeenNthCalledWith(2, {
            id: 'media-2',
            type: 'video',
            src: 'https://example.com/a.mp4',
            isPlaceholder: false,
        });
        expect(stripped).toContain('<p>text</p>');
        expect(stripped).not.toContain('<img');
        expect(stripped).not.toContain('<video');
    });

    it('危険な media src はギャラリーへ追加しない', () => {
        const addGalleryItem = vi.fn();

        const stripped = extractMediaToGalleryHtml({
            htmlContent: '<img src="javascript:alert(1)"><img src="https://example.com/a.jpg"><video src="data:text/html,<svg></svg>"></video>',
            document,
            addGalleryItem,
            generateMediaItemId: () => 'media-1',
        });

        expect(addGalleryItem).toHaveBeenCalledOnce();
        expect(addGalleryItem).toHaveBeenCalledWith({
            id: 'media-1',
            type: 'image',
            src: 'https://example.com/a.jpg',
            isPlaceholder: false,
            blurhash: undefined,
            alt: undefined,
            dim: undefined,
        });
        expect(stripped).not.toContain('javascript:');
        expect(stripped).not.toContain('data:text/html');
    });
});

describe('applyDraftToComposer', () => {
    it('ギャラリーモードでは galleryItems を復元し HTML 内メディアも抽出する', () => {
        const draft: Draft = {
            id: 'draft-1',
            content: '<p>body</p><img src="https://example.com/embedded.jpg">',
            preview: 'body',
            timestamp: 1,
            galleryItems: [{ id: 'stored', type: 'image', src: 'https://example.com/stored.jpg', isPlaceholder: false }],
            replyQuoteData: {
                reply: createReplyState(),
                quotes: [createQuoteState()],
            },
        };
        const clearGallery = vi.fn();
        const addGalleryItem = vi.fn();
        const loadDraftContent = vi.fn();
        const appendMediaToEditor = vi.fn();
        const restoreReplyQuote = vi.fn();
        const clearReplyQuote = vi.fn();

        applyDraftToComposer({
            draft,
            isGalleryMode: true,
            document,
            clearGallery,
            addGalleryItem,
            loadDraftContent,
            appendMediaToEditor,
            generateMediaItemId: () => 'generated-id',
            restoreReplyQuote,
            clearReplyQuote,
        });

        expect(clearGallery).toHaveBeenCalledOnce();
        expect(addGalleryItem).toHaveBeenCalledWith(draft.galleryItems![0]);
        expect(addGalleryItem).toHaveBeenCalledWith({
            id: 'generated-id',
            type: 'image',
            src: 'https://example.com/embedded.jpg',
            isPlaceholder: false,
            blurhash: undefined,
            alt: undefined,
            dim: undefined,
        });
        expect(loadDraftContent).toHaveBeenCalledWith('<p>body</p>');
        expect(appendMediaToEditor).not.toHaveBeenCalled();
        expect(restoreReplyQuote).toHaveBeenCalledWith(draft.replyQuoteData);
        expect(clearReplyQuote).not.toHaveBeenCalled();
    });

    it('フリーモードでは本文をそのまま読み込み galleryItems を append する', () => {
        const draft: Draft = {
            id: 'draft-2',
            content: '<p>body</p>',
            preview: 'body',
            timestamp: 1,
            galleryItems: [{ id: 'stored', type: 'image', src: 'https://example.com/stored.jpg', isPlaceholder: false }],
        };
        const loadDraftContent = vi.fn();
        const appendMediaToEditor = vi.fn();
        const clearReplyQuote = vi.fn();

        applyDraftToComposer({
            draft,
            isGalleryMode: false,
            document,
            clearGallery: vi.fn(),
            addGalleryItem: vi.fn(),
            loadDraftContent,
            appendMediaToEditor,
            generateMediaItemId: () => 'generated-id',
            restoreReplyQuote: vi.fn(),
            clearReplyQuote,
        });

        expect(loadDraftContent).toHaveBeenCalledWith('<p>body</p>');
        expect(appendMediaToEditor).toHaveBeenCalledWith(draft.galleryItems);
        expect(clearReplyQuote).toHaveBeenCalledOnce();
    });
});