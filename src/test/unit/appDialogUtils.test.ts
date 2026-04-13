import { describe, expect, it, vi } from 'vitest';

import {
    createDialogVisibilityHandlers,
    createDraftLimitConfirmHandlers,
    type PendingDraftContent,
} from '../../lib/appDialogUtils';
import type { DraftReplyQuoteData } from '../../lib/types';

function createReplyQuoteData(): DraftReplyQuoteData {
    return {
        mode: 'reply',
        eventId: 'event-1',
        relayHints: ['wss://relay.example.com'],
        authorPubkey: 'author-pubkey',
        authorDisplayName: 'author-name',
        referencedEvent: null,
        rootEventId: 'root-event-id',
        rootRelayHint: 'wss://root-relay.example.com',
        rootPubkey: 'root-pubkey',
    };
}

function createBooleanStore(initialValue = false) {
    let value = initialValue;

    return {
        get value() {
            return value;
        },
        set: (nextValue: boolean) => {
            value = nextValue;
        },
    };
}

function createPendingDraftStore(initialValue: PendingDraftContent | null = null) {
    let value = initialValue;

    return {
        get value() {
            return value;
        },
        set: (nextValue: typeof initialValue) => {
            value = nextValue;
        },
    };
}

describe('createDialogVisibilityHandlers', () => {
    it('open と close で dialog state を切り替える', () => {
        const store = createBooleanStore();
        const handlers = createDialogVisibilityHandlers(store);

        handlers.open();
        expect(store.value).toBe(true);

        handlers.close();
        expect(store.value).toBe(false);
    });

    it('handleOpenChange(false) で閉じ、true では変更しない', () => {
        const store = createBooleanStore(true);
        const handlers = createDialogVisibilityHandlers(store);

        handlers.handleOpenChange(true);
        expect(store.value).toBe(true);

        handlers.handleOpenChange(false);
        expect(store.value).toBe(false);
    });
});

describe('createDraftLimitConfirmHandlers', () => {
    it('stage で pending draft を保存して dialog を開く', () => {
        const pendingDraftContentStore = createPendingDraftStore();
        const showDraftLimitConfirmStore = createBooleanStore();
        const handlers = createDraftLimitConfirmHandlers({
            pendingDraftContentStore,
            showDraftLimitConfirmStore,
            saveDraftWithReplaceOldest: vi.fn(),
        });

        handlers.stage({
            content: '<p>draft</p>',
            galleryItems: [{ id: 'media-1', type: 'image', src: 'https://example.com/a.jpg', isPlaceholder: false }],
            replyQuoteData: createReplyQuoteData(),
        });

        expect(showDraftLimitConfirmStore.value).toBe(true);
        expect(pendingDraftContentStore.value).toEqual({
            content: '<p>draft</p>',
            galleryItems: [{ id: 'media-1', type: 'image', src: 'https://example.com/a.jpg', isPlaceholder: false }],
            replyQuoteData: createReplyQuoteData(),
        });
    });

    it('confirm で oldest draft を置換し state をクリアする', () => {
        const saveDraftWithReplaceOldest = vi.fn();
        const pendingDraftContentStore = createPendingDraftStore({
            content: '<p>draft</p>',
            galleryItems: [{ id: 'media-1', type: 'image', src: 'https://example.com/a.jpg', isPlaceholder: false }],
            replyQuoteData: createReplyQuoteData(),
        });
        const showDraftLimitConfirmStore = createBooleanStore(true);
        const handlers = createDraftLimitConfirmHandlers({
            pendingDraftContentStore,
            showDraftLimitConfirmStore,
            saveDraftWithReplaceOldest,
        });

        handlers.confirm();

        expect(saveDraftWithReplaceOldest).toHaveBeenCalledWith(
            '<p>draft</p>',
            [{ id: 'media-1', type: 'image', src: 'https://example.com/a.jpg', isPlaceholder: false }],
            createReplyQuoteData(),
        );
        expect(pendingDraftContentStore.value).toBeNull();
        expect(showDraftLimitConfirmStore.value).toBe(false);
    });

    it('cancel と close で pending state をクリアする', () => {
        const createHandlers = () => {
            const pendingDraftContentStore = createPendingDraftStore({
                content: '<p>draft</p>',
                galleryItems: [{ id: 'media-1', type: 'image', src: 'https://example.com/a.jpg', isPlaceholder: false }],
            });
            const showDraftLimitConfirmStore = createBooleanStore(true);

            return {
                pendingDraftContentStore,
                showDraftLimitConfirmStore,
                handlers: createDraftLimitConfirmHandlers({
                    pendingDraftContentStore,
                    showDraftLimitConfirmStore,
                    saveDraftWithReplaceOldest: vi.fn(),
                }),
            };
        };

        const canceled = createHandlers();
        canceled.handlers.cancel();
        expect(canceled.pendingDraftContentStore.value).toBeNull();
        expect(canceled.showDraftLimitConfirmStore.value).toBe(false);

        const dismissed = createHandlers();
        dismissed.handlers.handleOpenChange(false);
        expect(dismissed.pendingDraftContentStore.value).toBeNull();
        expect(dismissed.showDraftLimitConfirmStore.value).toBe(false);
    });
});