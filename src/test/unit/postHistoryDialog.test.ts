import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { readable } from 'svelte/store';
import { clearPersistedPostHistoryListingSnapshots } from '../../lib/hooks/usePostHistoryListing.svelte';
import { clearPersistedPostHistoryViewState } from '../../lib/postHistoryDialogViewState';

const mockTranslate = vi.hoisted(() => (key: string, options?: { values?: Record<string, unknown> }) => {
    const translations: Record<string, string> = {
        'postHistory.title': '投稿履歴',
        'postHistory.description': 'eHagakiで投稿に成功した履歴です。',
        'postHistory.search': '検索',
        'postHistory.searchPlaceholder': '投稿履歴を検索',
        'postHistory.searchNoResults': '一致する投稿はありません',
        'postHistory.searchResults': '検索結果',
        'postHistory.empty': '投稿履歴はありません',
        'postHistory.syncing': 'リレーと同期中...',
        'postHistory.synced': 'リレーとの同期が完了しました',
        'postHistory.syncFailed': 'リレーとの同期に失敗しました',
        'postHistory.noMorePosts': 'これ以上古い投稿はありません',
        'postHistory.copyNevent': 'neventをコピー',
        'postHistory.copied': 'コピーしました',
        'postHistory.copyFailed': 'コピーに失敗しました',
        'postHistory.expand': 'もっと見る',
        'postHistory.collapse': '折りたたむ',
        'postHistory.delete': '削除',
        'postHistory.deleteRequest': '削除リクエスト',
        'postHistory.deleteRequestTitle': '削除リクエストを送信',
        'postHistory.deleteRequestDescription': 'この投稿の削除リクエストをリレーへ送信します。',
        'postHistory.deleteRequestWarning': '削除はリレーへのリクエストであり、完全な削除は保証されません。',
        'postHistory.deleteConfirm': '送信',
        'postHistory.deleteCancel': 'キャンセル',
        'postHistory.deleteSending': '送信中',
        'postHistory.deleteFailed': '削除リクエストの送信に失敗しました',
        'postHistory.deletedBadge': '削除リクエスト済み',
        'postHistory.eventId': 'event id',
        'postHistory.media': 'メディア',
        'postHistory.mediaOpen': '開く',
        'postHistory.deleted': '削除済み',
        'postHistory.previousPage': '前へ',
        'postHistory.nextPage': '次へ',
        'postHistory.channel': 'チャンネル',
        'postHistory.channelLoading': '読み込み中...',
        'postHistory.channelUnknown': '不明',
        'replyQuote.reply_label': 'リプライ',
        'replyQuote.quote_label': '引用',
        'global.close': '閉じる',
    };

    if (key === 'postHistory.page') {
        return `${options?.values?.page} / ${options?.values?.total} ページ`;
    }

    return translations[key] || key;
});

const repositoryMock = vi.hoisted(() => ({
    getPage: vi.fn(),
    countForPubkey: vi.fn(),
    upsertFetchedEvents: vi.fn(),
}));

const relayFetchServiceMock = vi.hoisted(() => ({
    fetchLatest: vi.fn(),
}));

const clipboardMock = vi.hoisted(() => ({
    tryCopyToClipboard: vi.fn(),
}));

const postMediaCacheServiceMock = vi.hoisted(() => ({
    canUsePersistentCache: vi.fn(() => true),
    getCachedMediaDescriptorSnapshot: vi.fn().mockReturnValue(undefined),
    getCachedMediaObjectUrlSnapshot: vi.fn().mockReturnValue(null),
    prefetchCachedMediaDescriptors: vi.fn().mockResolvedValue(undefined),
    getCachedMediaDescriptor: vi.fn().mockResolvedValue(null),
    createCachedMediaObjectUrl: vi.fn().mockResolvedValue(null),
    fetchAndCacheMedia: vi.fn().mockResolvedValue(null),
    revokeObjectUrl: vi.fn(),
}));

const localSearchServiceMock = vi.hoisted(() => ({
    searchLocalPosts: vi.fn(),
}));

const postDeletionServiceMock = vi.hoisted(() => ({
    requestDeletion: vi.fn(),
}));

const channelContextServiceMock = vi.hoisted(() => ({
    resolveChannelContext: vi.fn(),
    resolveChannelMetadata: vi.fn(),
}));

const channelMetadataRepositoryMock = vi.hoisted(() => ({
    getMany: vi.fn(),
    upsertResolvedChannel: vi.fn(),
    shouldRefresh: vi.fn(),
    markFetchFailed: vi.fn(),
}));

const customEmojiImageMetaRepositoryMock = vi.hoisted(() => ({
    get: vi.fn(),
    getMany: vi.fn(),
    upsert: vi.fn(),
    touchMany: vi.fn(),
    prune: vi.fn(),
}));

const nostrUtilsMock = vi.hoisted(() => ({
    toNevent: vi.fn(() => 'nevent1mock'),
}));

const customEmojiMock = vi.hoisted(() => ({
    preloadCustomEmojiImage: vi.fn(),
    preloadCustomEmojiImageWithMeta: vi.fn(),
}));
const photoSwipeMock = vi.hoisted(() => {
    class MockPhotoSwipe {
        currIndex: number;
        element: HTMLElement | null = null;
        template: HTMLElement | null = null;
        private handlers = new Map<string, Array<(...args: any[]) => void>>();

        constructor(public options: Record<string, any>) {
            this.currIndex = options.index ?? 0;
        }

        on(eventName: string, handler: (...args: any[]) => void) {
            const currentHandlers = this.handlers.get(eventName) ?? [];
            currentHandlers.push(handler);
            this.handlers.set(eventName, currentHandlers);
        }

        init() {
            const root = document.createElement('div');
            root.className = `pswp ${this.options.mainClass ?? ''}`.trim();
            root.tabIndex = -1;
            document.body.appendChild(root);
            root.focus();
            this.element = root;
            this.template = root;
        }

        close() { }

        destroy() {
            this.element?.remove();
            this.element = null;
            this.template = null;
        }

        goTo(index: number) {
            this.currIndex = index;
        }
    }

    return { MockPhotoSwipe };
});

vi.mock('svelte-i18n', () => ({
    _: readable(mockTranslate),
}));

vi.mock('photoswipe', () => ({
    default: photoSwipeMock.MockPhotoSwipe,
}));

vi.mock('../../lib/utils/fullscreenViewerUtils', () => ({
    buildFullscreenViewerDataSource: vi.fn(async (items: Array<Record<string, any>>) => items),
    createFullscreenVideoSlideElement: vi.fn(() => document.createElement('div')),
    pauseFullscreenVideoContent: vi.fn(),
}));

vi.mock('../../lib/hooks/useDialogHistory.svelte', () => ({
    useDialogHistory: vi.fn(),
}));

vi.mock('../../lib/storage/postHistoryRepository', () => ({
    postHistoryRepository: repositoryMock,
}));

vi.mock('../../lib/postHistoryRelayFetchService', () => ({
    POST_HISTORY_INITIAL_FETCH_LIMIT: 200,
    POST_HISTORY_PAGE_SIZE: 50,
    POST_HISTORY_RELAY_FETCH_LIMIT: 200,
    postHistoryRelayFetchService: relayFetchServiceMock,
}));

vi.mock('../../lib/postHistoryLocalSearchService', () => ({
    postHistoryLocalSearchService: localSearchServiceMock,
}));

vi.mock('../../lib/postDeletionService', () => ({
    canRequestPostDeletion: (post: { pubkeyHex: string; deletedAt?: number; kind: number }, currentPubkey?: string | null) =>
        !!currentPubkey
        && post.pubkeyHex === currentPubkey
        && post.deletedAt === undefined
        && [1, 42].includes(post.kind),
    postDeletionService: postDeletionServiceMock,
}));

vi.mock('../../lib/storage/channelMetadataRepository', () => ({
    channelMetadataRepository: channelMetadataRepositoryMock,
}));

vi.mock('../../lib/storage/customEmojiImageMetaRepository', () => ({
    customEmojiImageMetaRepository: customEmojiImageMetaRepositoryMock,
}));

vi.mock('../../lib/channelContextService', () => ({
    ChannelContextService: vi.fn(() => channelContextServiceMock),
}));

vi.mock('../../lib/customEmoji', async () => {
    const actual = await vi.importActual<typeof import('../../lib/customEmoji')>('../../lib/customEmoji');
    return {
        ...actual,
        preloadCustomEmojiImage: customEmojiMock.preloadCustomEmojiImage,
        preloadCustomEmojiImageWithMeta: customEmojiMock.preloadCustomEmojiImageWithMeta,
    };
});

vi.mock('../../lib/utils/clipboardUtils', () => clipboardMock);

vi.mock('../../lib/postMediaCacheService', () => ({
    postMediaCacheService: postMediaCacheServiceMock,
}));

vi.mock('../../lib/utils/nostrUtils', async () => {
    const actual = await vi.importActual<typeof import('../../lib/utils/nostrUtils')>('../../lib/utils/nostrUtils');
    return {
        ...actual,
        toNevent: nostrUtilsMock.toNevent,
    };
});

import PostHistoryDialog from '../../components/PostHistoryDialog.svelte';

function createRecord(overrides: Record<string, any> = {}) {
    return {
        id: 'event-1',
        eventId: 'b'.repeat(64),
        pubkeyHex: 'a'.repeat(64),
        kind: 1,
        content: '投稿本文\nhttps://example.com/image.jpg',
        tags: [],
        createdAt: 1_700_000_000,
        postedAt: Date.UTC(2024, 0, 2, 3, 4, 0),
        relayHints: ['wss://hint.example.com/'],
        acceptedRelays: ['wss://accepted.example.com/'],
        media: [
            {
                url: 'https://example.com/image.jpg',
                mimeType: 'image/jpeg',
            },
        ],
        rawEvent: {},
        updatedAt: Date.UTC(2024, 0, 2, 3, 4, 0),
        schemaVersion: 2,
        ...overrides,
    };
}

function createDeferred<T>() {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>((resolvePromise) => {
        resolve = resolvePromise;
    });

    return { promise, resolve };
}

function expectDefaultMediaReplacement(): void {
    expect(screen.getByText('投稿本文')).toBeTruthy();
    expect(screen.getByTitle('image.jpg')).toBeTruthy();
    expect(screen.queryByText('https://example.com/image.jpg')).toBeNull();
}

describe('PostHistoryDialog', () => {
    beforeEach(() => {
        clearPersistedPostHistoryListingSnapshots();
        clearPersistedPostHistoryViewState();
        vi.clearAllMocks();
        repositoryMock.getPage.mockResolvedValue([]);
        repositoryMock.countForPubkey.mockResolvedValue(0);
        repositoryMock.upsertFetchedEvents.mockResolvedValue({
            insertedCount: 0,
            updatedCount: 0,
            unchangedCount: 0,
        });
        relayFetchServiceMock.fetchLatest.mockReturnValue({
            promise: Promise.resolve({
                status: 'cancelled',
                events: [],
                fetchedAt: 0,
                nextUntil: null,
                hasMore: false,
                relayUrls: [],
            }),
            cancel: vi.fn(),
        });
        clipboardMock.tryCopyToClipboard.mockResolvedValue(true);
        postMediaCacheServiceMock.getCachedMediaDescriptorSnapshot.mockReturnValue(undefined);
        postMediaCacheServiceMock.getCachedMediaObjectUrlSnapshot.mockReturnValue(null);
        postMediaCacheServiceMock.prefetchCachedMediaDescriptors.mockResolvedValue(undefined);
        localSearchServiceMock.searchLocalPosts.mockResolvedValue({
            items: [],
            total: 0,
            hasNext: false,
        });
        postDeletionServiceMock.requestDeletion.mockResolvedValue({
            success: true,
            eventId: 'delete-event-id',
            deletionEventId: 'delete-event-id',
            deletedAt: 1234,
        });
        channelMetadataRepositoryMock.getMany.mockResolvedValue([]);
        channelMetadataRepositoryMock.upsertResolvedChannel.mockImplementation(async (input: Record<string, any>) => ({
            channelEventId: input.channelEventId,
            name: input.name ?? null,
            about: input.about ?? null,
            picture: input.picture ?? null,
            relays: input.relays ?? [],
            relayHints: input.relayHints ?? [],
            creatorPubkey: input.creatorPubkey,
            createEventCreatedAt: input.createEventCreatedAt,
            metadataEventId: input.metadataEventId,
            metadataCreatedAt: input.metadataCreatedAt,
            fetchedAt: 1000,
        }));
        channelMetadataRepositoryMock.shouldRefresh.mockReturnValue(true);
        channelMetadataRepositoryMock.markFetchFailed.mockResolvedValue(undefined);
        customEmojiImageMetaRepositoryMock.get.mockResolvedValue(null);
        customEmojiImageMetaRepositoryMock.getMany.mockResolvedValue({});
        customEmojiImageMetaRepositoryMock.upsert.mockResolvedValue(null);
        customEmojiImageMetaRepositoryMock.touchMany.mockResolvedValue(undefined);
        customEmojiImageMetaRepositoryMock.prune.mockResolvedValue(undefined);
        channelContextServiceMock.resolveChannelContext.mockResolvedValue({
            eventId: 'channel-id',
            relayHints: ['wss://channel.example.com/'],
            name: 'general',
            about: null,
            picture: null,
        });
        channelContextServiceMock.resolveChannelMetadata.mockResolvedValue({
            channelEventId: 'channel-id',
            relayHints: ['wss://channel.example.com/'],
            channelRelays: ['wss://channel-write.example.com/'],
            name: 'general',
            about: null,
            picture: null,
            creatorPubkey: 'c'.repeat(64),
            createEventCreatedAt: 100,
            metadataEventId: 'm'.repeat(64),
            metadataCreatedAt: 200,
        });
        nostrUtilsMock.toNevent.mockReturnValue('nevent1mock');
        customEmojiMock.preloadCustomEmojiImage.mockResolvedValue(true);
        customEmojiMock.preloadCustomEmojiImageWithMeta.mockResolvedValue({
            ready: true,
            width: 120,
            height: 60,
            aspectRatio: 2,
        });
    });

    afterEach(() => {
        clearPersistedPostHistoryListingSnapshots();
        clearPersistedPostHistoryViewState();
        vi.useRealTimers();
    });

    it('空の投稿履歴を表示する', async () => {
        const { container } = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await waitFor(() => {
            expect(repositoryMock.countForPubkey).toHaveBeenCalledWith('a'.repeat(64));
            expect(repositoryMock.getPage).toHaveBeenCalledWith({
                pubkeyHex: 'a'.repeat(64),
                page: 1,
                pageSize: 50,
            });
            expect(screen.getByRole('searchbox', { name: '検索' })).toBeTruthy();
            expect(screen.getByText('投稿履歴はありません')).toBeTruthy();
        });
    });

    it('長い投稿本文は折りたたみ表示し、ボタンで展開できる', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                eventId: 'long-post',
                content: [
                    'line1',
                    'line2',
                    'line3',
                    'line4',
                    'line5',
                    'line6 https://example.com/image.jpg',
                ].join('\n'),
                media: [
                    {
                        url: 'https://example.com/image.jpg',
                        mimeType: 'image/jpeg',
                    },
                ],
            }),
        ]);

        const { container } = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        const toggleButton = await screen.findByRole('button', {
            name: 'もっと見る',
        });

        expect(toggleButton).toBeTruthy();
        expect(screen.getByTitle('image.jpg')).toBeTruthy();
        await fireEvent.click(toggleButton);
        expect(screen.getByRole('button', { name: '折りたたむ' })).toBeTruthy();
        await fireEvent.click(screen.getByRole('button', { name: '折りたたむ' }));
        expect(screen.getByRole('button', { name: 'もっと見る' })).toBeTruthy();
    });

    it('メディアのみの投稿では本文プレビュー要素を表示しない', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                eventId: 'media-only',
                content: [
                    'https://example.com/image-1.jpg',
                    'https://example.com/image-2.jpg',
                ].join('\n'),
                media: [
                    {
                        url: 'https://example.com/image-1.jpg',
                        mimeType: 'image/jpeg',
                    },
                    {
                        url: 'https://example.com/image-2.jpg',
                        mimeType: 'image/jpeg',
                    },
                ],
            }),
        ]);

        const { container } = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await waitFor(() => {
            expect(screen.getByTitle('image-1.jpg')).toBeTruthy();
            expect(screen.getByTitle('image-2.jpg')).toBeTruthy();
        });

        expect(container.querySelector('.post-history-preview-text')).toBeNull();
        expect(screen.getByTitle('image-1.jpg')).toBeTruthy();
        expect(screen.getByTitle('image-2.jpg')).toBeTruthy();
    });

    it('現在表示中ページの media URL を descriptor prefetch する', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(60);
        repositoryMock.getPage.mockImplementation(({ page }: { page: number }) => Promise.resolve(
            page === 1
                ? [createRecord({
                    eventId: 'prefetch-page-1',
                    content: '1ページ目',
                    media: [
                        {
                            url: 'https://example.com/page-1.jpg',
                            mimeType: 'image/jpeg',
                        },
                    ],
                })]
                : [createRecord({
                    eventId: 'prefetch-page-2',
                    content: '2ページ目',
                    media: [
                        {
                            url: 'https://example.com/page-2.jpg',
                            mimeType: 'image/jpeg',
                        },
                    ],
                })],
        ));

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await waitFor(() => {
            expect(postMediaCacheServiceMock.prefetchCachedMediaDescriptors)
                .toHaveBeenLastCalledWith(['https://example.com/page-1.jpg']);
            expect(screen.getByText('1ページ目')).toBeTruthy();
        });

        await fireEvent.click(await screen.findByRole('button', { name: '次へ' }));

        await waitFor(() => {
            expect(postMediaCacheServiceMock.prefetchCachedMediaDescriptors)
                .toHaveBeenLastCalledWith(['https://example.com/page-2.jpg']);
            expect(screen.getByText('2ページ目')).toBeTruthy();
        });
    });

    it('次ページの描画完了まで現在ページの scrollTop を維持する', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(60);
        const secondPageDeferred = createDeferred<ReturnType<typeof createRecord>[]>();
        repositoryMock.getPage.mockImplementation(({ page }: { page: number }) => (
            page === 1
                ? Promise.resolve([
                    createRecord({
                        eventId: 'scroll-page-1',
                        content: '1ページ目',
                    }),
                ])
                : secondPageDeferred.promise
        ));

        const { container } = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await waitFor(() => {
            expect(screen.getByText('1ページ目')).toBeTruthy();
        });

        const historyContainer = document.querySelector('.post-history-container');
        expect(historyContainer).toBeTruthy();
        if (!(historyContainer instanceof HTMLDivElement)) {
            throw new Error('post-history-container が見つかりません');
        }

        historyContainer.scrollTop = 240;

        await fireEvent.click(await screen.findByRole('button', { name: '次へ' }));

        expect(screen.getByText('1ページ目')).toBeTruthy();
        expect(historyContainer.scrollTop).toBe(240);

        secondPageDeferred.resolve([
            createRecord({
                eventId: 'scroll-page-2',
                content: '2ページ目',
            }),
        ]);

        await waitFor(() => {
            expect(screen.getByText('2ページ目')).toBeTruthy();
        });

        expect(historyContainer.scrollTop).toBe(0);
    });

    it('fullscreen viewer 内の操作では投稿履歴ダイアログを閉じない', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                eventId: 'fullscreen-safe',
                content: 'fullscreen target',
                media: [
                    {
                        url: 'https://example.com/image.jpg',
                        mimeType: 'image/jpeg',
                    },
                ],
            }),
        ]);

        const onClose = vi.fn();

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose,
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await screen.findByText('fullscreen target');

        const fullscreenRoot = document.createElement('div');
        fullscreenRoot.className = 'ehagaki-pswp';
        const fullscreenButton = document.createElement('button');
        fullscreenButton.type = 'button';
        fullscreenRoot.appendChild(fullscreenButton);
        document.body.appendChild(fullscreenRoot);

        try {
            await fireEvent.pointerDown(fullscreenButton);
            await fireEvent.pointerUp(fullscreenButton);
            await fireEvent.click(fullscreenButton);
            await new Promise((resolve) => setTimeout(resolve, 40));

            expect(onClose).not.toHaveBeenCalled();
            expect(screen.getByRole('searchbox', { name: '検索' })).toBeTruthy();
        } finally {
            fullscreenRoot.remove();
        }
    });

    it('fullscreen viewer 表示中は外側へフォーカスが逃げない', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                eventId: 'focus-safe',
                content: 'focus target',
                media: [
                    {
                        url: 'https://example.com/image.jpg',
                        mimeType: 'image/jpeg',
                    },
                ],
            }),
        ]);
        vi.mocked(postMediaCacheServiceMock.getCachedMediaDescriptor).mockResolvedValue({
            cacheKey: 'https://example.com/image.jpg',
            url: 'https://example.com/image.jpg',
            mimeType: 'image/jpeg',
            size: 10,
            source: 'uploaded',
            kind: 'image',
        });
        vi.mocked(postMediaCacheServiceMock.createCachedMediaObjectUrl).mockResolvedValue({
            cacheKey: 'https://example.com/image.jpg',
            url: 'https://example.com/image.jpg',
            mimeType: 'image/jpeg',
            size: 10,
            source: 'uploaded',
            kind: 'image',
            objectUrl: 'blob:image-preview',
        });

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await screen.findByText('focus target');
        await waitFor(() => {
            expect(screen.getByRole('button', { name: '開く image.jpg' })).toBeTruthy();
        });
        await fireEvent.click(screen.getByRole('button', { name: '開く image.jpg' }));
        await waitFor(() => {
            expect(document.querySelector('.ehagaki-pswp')).toBeTruthy();
        });

        const outsideButton = document.createElement('button');
        outsideButton.type = 'button';
        outsideButton.textContent = 'outside';
        document.body.appendChild(outsideButton);

        try {
            outsideButton.focus();

            await waitFor(() => {
                expect(document.activeElement).toBe(outsideButton);
            });
        } finally {
            outsideButton.remove();
        }
    });

    it('reply/quote callback がある場合は preview 下に両方のボタンを表示し、折りたたみボタンと共存する', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                eventId: 'replyable-post',
                content: [
                    'line1',
                    'line2',
                    'line3',
                    'line4',
                    'line5',
                    'line6',
                ].join('\n'),
                media: [],
            }),
        ]);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onReplyPost: vi.fn(),
                onQuotePost: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        expect(await screen.findByRole('button', { name: 'リプライ' })).toBeTruthy();
        expect(screen.getByRole('button', { name: '引用' })).toBeTruthy();
        expect(screen.getByRole('button', { name: 'もっと見る' })).toBeTruthy();
    });

    it('リプライボタン押下で callback 実行後にダイアログを閉じる', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                eventId: 'reply-target',
                content: '返信したい投稿',
                media: [],
            }),
        ]);
        const onClose = vi.fn();
        const onReplyPost = vi.fn();

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose,
                onReplyPost,
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await screen.findByText('返信したい投稿');
        await fireEvent.click(await screen.findByRole('button', { name: 'リプライ' }));

        expect(onReplyPost).toHaveBeenCalledWith(
            expect.objectContaining({ eventId: 'reply-target' }),
        );
        expect(onClose).toHaveBeenCalledOnce();
    });

    it('引用ボタン押下で callback 実行後にダイアログを閉じる', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                eventId: 'quote-target',
                content: '引用したい投稿',
                media: [],
            }),
        ]);
        const onClose = vi.fn();
        const onQuotePost = vi.fn();

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose,
                onQuotePost,
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await screen.findByText('引用したい投稿');
        await fireEvent.click(await screen.findByRole('button', { name: '引用' }));

        expect(onQuotePost).toHaveBeenCalledWith(
            expect.objectContaining({ eventId: 'quote-target' }),
        );
        expect(onClose).toHaveBeenCalledOnce();
    });

    it('投稿日時が 24 時間以内なら時刻のみを表示する', async () => {
        vi.useFakeTimers();
        const now = Date.UTC(2025, 0, 1, 12, 0, 0);
        vi.setSystemTime(now);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                eventId: 'recent',
                postedAt: now - 60 * 60 * 1000,
                content: '最近の投稿',
                media: [],
            }),
        ]);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        const expected = new Intl.DateTimeFormat(undefined, {
            hour: 'numeric',
            minute: '2-digit',
        }).format(new Date(now - 60 * 60 * 1000));

        await waitFor(() => {
            expect(screen.getByText(expected)).toBeTruthy();
            expect(screen.getByText('最近の投稿')).toBeTruthy();
        });
    });

    it('投稿日時が 1 年以内なら月日時刻を表示する', async () => {
        vi.useFakeTimers();
        const now = Date.UTC(2025, 0, 1, 12, 0, 0);
        vi.setSystemTime(now);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                eventId: 'within-year',
                postedAt: now - 100 * 24 * 60 * 60 * 1000,
                content: '1 年以内の投稿',
                media: [],
            }),
        ]);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        const expected = new Intl.DateTimeFormat(undefined, {
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        }).format(new Date(now - 100 * 24 * 60 * 60 * 1000));

        await waitFor(() => {
            expect(screen.getByText(expected)).toBeTruthy();
            expect(screen.getByText('1 年以内の投稿')).toBeTruthy();
        });
    });

    it('保存済み emoji tag から custom emoji を描画し、同一 URL は一度だけ preload する', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(2);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                eventId: 'emoji-post-1',
                content: 'one :blobcat:',
                tags: [['emoji', 'blobcat', 'https://example.com/blobcat.webp']],
                media: [],
            }),
            createRecord({
                eventId: 'emoji-post-2',
                content: 'two :blobcat:',
                tags: [['emoji', 'blobcat', 'https://example.com/blobcat.webp']],
                media: [],
            }),
        ]);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await waitFor(() => {
            expect(customEmojiMock.preloadCustomEmojiImageWithMeta).toHaveBeenCalledTimes(1);
            expect(customEmojiMock.preloadCustomEmojiImageWithMeta).toHaveBeenCalledWith(
                'https://example.com/blobcat.webp',
            );
        });

        const images = await screen.findAllByRole('img', { name: ':blobcat:' });
        expect(images).toHaveLength(2);
    });

    it('loading 中は shortcode ではなく placeholder を表示し、保存済み寸法から幅を確保する', async () => {
        const deferred = createDeferred<{
            ready: boolean;
            width: number;
            height: number;
            aspectRatio: number;
        }>();
        customEmojiMock.preloadCustomEmojiImageWithMeta.mockReturnValue(deferred.promise);
        customEmojiImageMetaRepositoryMock.getMany.mockResolvedValue({
            'https://example.com/blobcat.webp': {
                url: 'https://example.com/blobcat.webp',
                width: 60,
                height: 30,
                aspectRatio: 2,
                fetchedAt: 1000,
                lastAccessedAt: 1000,
                updatedAt: 1000,
                schemaVersion: 1,
            },
        });
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                eventId: 'emoji-loading',
                content: 'loading :blobcat:',
                tags: [['emoji', 'blobcat', 'https://example.com/blobcat.webp']],
                media: [],
            }),
        ]);

        const { container } = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await waitFor(() => {
            expect(customEmojiMock.preloadCustomEmojiImageWithMeta).toHaveBeenCalledWith(
                'https://example.com/blobcat.webp',
            );
            expect(customEmojiImageMetaRepositoryMock.getMany).toHaveBeenCalledWith([
                'https://example.com/blobcat.webp',
            ]);
        });

        await waitFor(() => {
            const slot = document.querySelector('.post-history-custom-emoji-slot');
            expect(slot).toBeTruthy();
            expect(slot?.getAttribute('style')).toContain('60px');
            expect(screen.queryByRole('img', { name: ':blobcat:' })).toBeNull();
            expect(screen.queryByText(':blobcat:')).toBeNull();
        });

        deferred.resolve({
            ready: true,
            width: 120,
            height: 60,
            aspectRatio: 2,
        });
    });

    it('custom emoji の preload に失敗した場合は shortcode のまま表示する', async () => {
        customEmojiMock.preloadCustomEmojiImageWithMeta.mockResolvedValue({
            ready: false,
        });
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                eventId: 'emoji-failed',
                content: 'broken :blobcat:',
                tags: [['emoji', 'blobcat', 'https://example.com/blobcat.webp']],
                media: [],
            }),
        ]);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await waitFor(() => {
            expect(customEmojiMock.preloadCustomEmojiImageWithMeta).toHaveBeenCalledWith(
                'https://example.com/blobcat.webp',
            );
        });

        expect(screen.queryByRole('img', { name: ':blobcat:' })).toBeNull();
        expect(screen.getByText(':blobcat:')).toBeTruthy();
    });

    it('検索 input からローカル検索へ切り替える', async () => {
        vi.useFakeTimers();
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({ eventId: 'normal', content: '通常一覧' }),
        ]);
        localSearchServiceMock.searchLocalPosts.mockResolvedValue({
            items: [
                createRecord({
                    eventId: 'search-hit',
                    content: 'needle result',
                    media: [],
                }),
            ],
            total: 1,
            hasNext: false,
        });

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        const searchInput = await screen.findByRole('searchbox', { name: '検索' });
        await fireEvent.input(searchInput, { target: { value: '  needle  ' } });
        await vi.advanceTimersByTimeAsync(250);

        await waitFor(() => {
            expect(localSearchServiceMock.searchLocalPosts).toHaveBeenCalledWith({
                pubkeyHex: 'a'.repeat(64),
                query: 'needle',
                page: 1,
                pageSize: 50,
            });
            expect(screen.getByText('needle result')).toBeTruthy();
            expect(screen.queryByText('通常一覧')).toBeNull();
            expect(screen.getByText('検索結果')).toBeTruthy();
        });
    });

    it('検索結果ページの media URL も descriptor prefetch する', async () => {
        vi.useFakeTimers();
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({ eventId: 'normal', content: '通常一覧', media: [] }),
        ]);
        localSearchServiceMock.searchLocalPosts.mockResolvedValue({
            items: [
                createRecord({
                    eventId: 'search-media',
                    content: 'search media',
                    media: [
                        {
                            url: 'https://example.com/search-media.jpg',
                            mimeType: 'image/jpeg',
                        },
                    ],
                }),
            ],
            total: 1,
            hasNext: false,
        });

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        const searchInput = await screen.findByRole('searchbox', { name: '検索' });
        await fireEvent.input(searchInput, { target: { value: 'media' } });
        await vi.advanceTimersByTimeAsync(250);

        await waitFor(() => {
            expect(postMediaCacheServiceMock.prefetchCachedMediaDescriptors)
                .toHaveBeenLastCalledWith(['https://example.com/search-media.jpg']);
            expect(screen.getByText('search media')).toBeTruthy();
        });

        vi.useRealTimers();
    });

    it('検索結果 0 件では searchNoResults を表示し、検索入力を消すと通常表示へ戻る', async () => {
        vi.useFakeTimers();
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({ eventId: 'normal', content: '通常一覧', media: [] }),
        ]);
        localSearchServiceMock.searchLocalPosts.mockResolvedValue({
            items: [],
            total: 0,
            hasNext: false,
        });

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        const searchInput = await screen.findByRole('searchbox', { name: '検索' });
        await fireEvent.input(searchInput, { target: { value: 'nomatch' } });
        await vi.advanceTimersByTimeAsync(250);

        await waitFor(() => {
            expect(screen.getByText('一致する投稿はありません')).toBeTruthy();
            expect(screen.queryByText('投稿履歴はありません')).toBeNull();
        });

        await fireEvent.input(searchInput, { target: { value: '' } });
        await vi.advanceTimersByTimeAsync(250);

        await waitFor(() => {
            expect(screen.getByText('通常一覧')).toBeTruthy();
            expect(screen.queryByText('一致する投稿はありません')).toBeNull();
            expect(localSearchServiceMock.searchLocalPosts).toHaveBeenCalledTimes(1);
        });
    });

    it('検索語が変わったら searchPage を 1 に戻す', async () => {
        vi.useFakeTimers();
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({ eventId: 'normal', content: '通常一覧', media: [] }),
        ]);
        localSearchServiceMock.searchLocalPosts.mockImplementation(
            async ({ query, page }: { query: string; page: number }) => ({
                items: [
                    createRecord({
                        eventId: `${query}-${page}`,
                        content: `${query}-${page}`,
                        media: [],
                    }),
                ],
                total: query === 'alpha' ? 60 : 1,
                hasNext: query === 'alpha' && page === 1,
            }),
        );

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        const searchInput = await screen.findByRole('searchbox', { name: '検索' });
        await fireEvent.input(searchInput, { target: { value: 'alpha' } });
        await vi.advanceTimersByTimeAsync(250);

        await waitFor(() => {
            expect(screen.getByText('alpha-1')).toBeTruthy();
        });

        await fireEvent.click(screen.getByRole('button', { name: '次へ' }));

        await waitFor(() => {
            expect(localSearchServiceMock.searchLocalPosts).toHaveBeenLastCalledWith({
                pubkeyHex: 'a'.repeat(64),
                query: 'alpha',
                page: 2,
                pageSize: 50,
            });
            expect(screen.getByText('alpha-2')).toBeTruthy();
        });

        await fireEvent.input(searchInput, { target: { value: 'beta' } });
        await vi.advanceTimersByTimeAsync(250);

        await waitFor(() => {
            expect(localSearchServiceMock.searchLocalPosts).toHaveBeenLastCalledWith({
                pubkeyHex: 'a'.repeat(64),
                query: 'beta',
                page: 1,
                pageSize: 50,
            });
            expect(screen.getByText('beta-1')).toBeTruthy();
        });
    });

    it('検索中の next は relay older fetch を呼ばずローカル検索ページだけ進める', async () => {
        vi.useFakeTimers();
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({ eventId: 'normal', content: '通常一覧', media: [] }),
        ]);
        relayFetchServiceMock.fetchLatest.mockReturnValue({
            promise: Promise.resolve({
                status: 'success',
                events: [],
                fetchedAt: 0,
                nextUntil: 149,
                hasMore: true,
                relayUrls: [],
            }),
            cancel: vi.fn(),
        });
        localSearchServiceMock.searchLocalPosts.mockImplementation(
            async ({ page }: { page: number }) => ({
                items: [
                    createRecord({
                        eventId: `search-page-${page}`,
                        content: `search-page-${page}`,
                        media: [],
                    }),
                ],
                total: 60,
                hasNext: page === 1,
            }),
        );

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        const searchInput = await screen.findByRole('searchbox', { name: '検索' });
        await waitFor(() => {
            expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledTimes(1);
        });

        await fireEvent.input(searchInput, { target: { value: 'alpha' } });
        await vi.advanceTimersByTimeAsync(250);

        await waitFor(() => {
            expect(screen.getByText('search-page-1')).toBeTruthy();
        });

        await fireEvent.click(screen.getByRole('button', { name: '次へ' }));

        await waitFor(() => {
            expect(localSearchServiceMock.searchLocalPosts).toHaveBeenLastCalledWith({
                pubkeyHex: 'a'.repeat(64),
                query: 'alpha',
                page: 2,
                pageSize: 50,
            });
            expect(screen.getByText('search-page-2')).toBeTruthy();
            expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledTimes(1);
        });
    });

    it('検索中も cached channel 名表示と nevent コピーを維持し、channel relay fetch はしない', async () => {
        vi.useFakeTimers();
        repositoryMock.countForPubkey.mockResolvedValue(0);
        repositoryMock.getPage.mockResolvedValue([]);
        localSearchServiceMock.searchLocalPosts.mockResolvedValue({
            items: [
                createRecord({
                    eventId: 'channel-search',
                    kind: 42,
                    content: 'channel hit',
                    media: [],
                    channelEventId: 'channel-id',
                    channelRelayHints: ['wss://channel.example.com/'],
                }),
            ],
            total: 1,
            hasNext: false,
        });
        channelMetadataRepositoryMock.getMany.mockResolvedValue([
            {
                channelEventId: 'channel-id',
                name: 'cached-general',
                about: null,
                picture: null,
                relays: ['wss://channel-write.example.com/'],
                relayHints: ['wss://channel.example.com/'],
                creatorPubkey: 'c'.repeat(64),
                createEventCreatedAt: 100,
                metadataEventId: 'm'.repeat(64),
                metadataCreatedAt: 200,
                fetchedAt: 1000,
            },
        ]);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        const searchInput = await screen.findByRole('searchbox', { name: '検索' });
        await fireEvent.input(searchInput, { target: { value: 'channel' } });
        await vi.advanceTimersByTimeAsync(250);

        await waitFor(() => {
            expect(screen.getByText('cached-general')).toBeTruthy();
            expect(channelContextServiceMock.resolveChannelMetadata).not.toHaveBeenCalled();
        });

        const actionTrigger = screen.getAllByRole('button', { name: 'アクションを表示' })[0];
        await fireEvent.click(actionTrigger);
        await fireEvent.click(await screen.findByRole('button', { name: 'neventをコピー' }));

        expect(nostrUtilsMock.toNevent).toHaveBeenCalledWith(expect.objectContaining({
            eventId: 'channel-search',
            kind: 42,
        }));
        expect(screen.getByText('コピーしました')).toBeTruthy();
    });

    it('ローカル履歴を即表示しつつ自動取得を開始する', async () => {
        const cancel = vi.fn();
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([createRecord()]);
        relayFetchServiceMock.fetchLatest.mockReturnValue({
            promise: new Promise(() => undefined),
            cancel,
        });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expectDefaultMediaReplacement();
            expect(screen.getByText('リレーと同期中...')).toBeTruthy();
        });

        const nextButton = screen.getByRole('button', { name: '次へ' });
        expect(nextButton.querySelector('.dialog-page-loading-placeholder')).toBeNull();
        expect(nextButton.textContent).toContain('次へ');

        expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledWith(
            {} as any,
            expect.objectContaining({
                pubkeyHex: 'a'.repeat(64),
                limit: 200,
            }),
        );

        view.unmount();
        expect(cancel).toHaveBeenCalledOnce();
    });

    it('同期成功後に upsert して一覧を更新する', async () => {
        repositoryMock.upsertFetchedEvents.mockResolvedValueOnce({
            insertedCount: 1,
            updatedCount: 0,
            unchangedCount: 0,
        });
        repositoryMock.countForPubkey
            .mockResolvedValueOnce(0)
            .mockResolvedValueOnce(1);
        repositoryMock.getPage
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([createRecord()]);
        relayFetchServiceMock.fetchLatest.mockReturnValue({
            promise: Promise.resolve({
                status: 'success',
                events: [
                    {
                        event: {
                            id: 'b'.repeat(64),
                            pubkey: 'a'.repeat(64),
                            kind: 1,
                            content: '投稿本文',
                            tags: [],
                            created_at: 1_700_000_000,
                            sig: 'c'.repeat(128),
                        },
                        relayUrls: ['wss://relay.example.com/'],
                    },
                ],
                fetchedAt: 5000,
                nextUntil: 1_699_999_999,
                hasMore: true,
                relayUrls: ['wss://relay.example.com/'],
            }),
            cancel: vi.fn(),
        });

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(repositoryMock.upsertFetchedEvents).toHaveBeenCalledWith({
                events: [
                    {
                        event: expect.objectContaining({ id: 'b'.repeat(64) }),
                        relayUrls: ['wss://relay.example.com/'],
                    },
                ],
                fetchedAt: 5000,
            });
            expect(screen.getByText('リレーとの同期が完了しました')).toBeTruthy();
            expectDefaultMediaReplacement();
        });
    });

    it('同期成功でも実質変更がなければ synced を表示しない', async () => {
        repositoryMock.countForPubkey
            .mockResolvedValueOnce(1)
            .mockResolvedValueOnce(1);
        repositoryMock.getPage
            .mockResolvedValueOnce([createRecord()])
            .mockResolvedValueOnce([createRecord()]);
        relayFetchServiceMock.fetchLatest.mockReturnValue({
            promise: Promise.resolve({
                status: 'success',
                events: [
                    {
                        event: {
                            id: 'b'.repeat(64),
                            pubkey: 'a'.repeat(64),
                            kind: 1,
                            content: '投稿本文',
                            tags: [],
                            created_at: 1_700_000_000,
                            sig: 'c'.repeat(128),
                        },
                        relayUrls: ['wss://relay.example.com/'],
                    },
                ],
                fetchedAt: 5000,
                nextUntil: null,
                hasMore: false,
                relayUrls: ['wss://relay.example.com/'],
            }),
            cancel: vi.fn(),
        });

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(repositoryMock.upsertFetchedEvents).toHaveBeenCalledOnce();
            expect(screen.queryByText('リレーとの同期が完了しました')).toBeNull();
            expectDefaultMediaReplacement();
        });
    });

    it('同期失敗でも既存一覧を維持する', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([createRecord()]);
        relayFetchServiceMock.fetchLatest.mockReturnValue({
            promise: Promise.resolve({
                status: 'error',
                events: [],
                fetchedAt: 5000,
                nextUntil: null,
                hasMore: false,
                relayUrls: [],
            }),
            cancel: vi.fn(),
        });

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('リレーとの同期に失敗しました')).toBeTruthy();
            expectDefaultMediaReplacement();
        });

        expect(repositoryMock.upsertFetchedEvents).not.toHaveBeenCalled();
    });

    it('初期同期が timeout でも失敗表示を出さず既存一覧を維持する', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([createRecord()]);
        relayFetchServiceMock.fetchLatest.mockReturnValue({
            promise: Promise.resolve({
                status: 'timeout',
                events: [],
                fetchedAt: 5000,
                nextUntil: null,
                hasMore: false,
                relayUrls: ['wss://relay.example.com/'],
            }),
            cancel: vi.fn(),
        });

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expectDefaultMediaReplacement();
            expect(screen.queryByText('リレーとの同期に失敗しました')).toBeNull();
        });

        expect(repositoryMock.upsertFetchedEvents).not.toHaveBeenCalled();
    });

    it('初期同期が timeout でも nextUntil があれば次へで追加取得を継続できる', async () => {
        let countCall = 0;
        repositoryMock.countForPubkey.mockImplementation(async () => {
            countCall += 1;
            return countCall >= 4 ? 51 : 50;
        });
        repositoryMock.getPage.mockImplementation(async ({ page }: { page: number }) => (
            page === 2
                ? [createRecord({ eventId: 'page-2', content: '2ページ目' })]
                : [createRecord({ eventId: 'page-1', content: '1ページ目' })]
        ));
        repositoryMock.upsertFetchedEvents
            .mockResolvedValueOnce({
                insertedCount: 0,
                updatedCount: 0,
                unchangedCount: 1,
            })
            .mockResolvedValueOnce({
                insertedCount: 1,
                updatedCount: 0,
                unchangedCount: 0,
            });
        relayFetchServiceMock.fetchLatest
            .mockReturnValueOnce({
                promise: Promise.resolve({
                    status: 'timeout',
                    events: [
                        {
                            event: {
                                id: 'timeout-event'.repeat(4),
                                pubkey: 'a'.repeat(64),
                                kind: 1,
                                content: '途中まで取得した投稿',
                                tags: [],
                                created_at: 150,
                                sig: 'c'.repeat(128),
                            },
                            relayUrls: ['wss://relay.example.com/'],
                        },
                    ],
                    fetchedAt: 1000,
                    nextUntil: 149,
                    hasMore: false,
                    relayUrls: ['wss://relay.example.com/'],
                }),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve({
                    status: 'success',
                    events: [
                        {
                            event: {
                                id: 'older-event'.repeat(4),
                                pubkey: 'a'.repeat(64),
                                kind: 1,
                                content: '2ページ目',
                                tags: [],
                                created_at: 140,
                                sig: 'd'.repeat(128),
                            },
                            relayUrls: ['wss://relay.example.com/'],
                        },
                    ],
                    fetchedAt: 2000,
                    nextUntil: null,
                    hasMore: false,
                    relayUrls: ['wss://relay.example.com/'],
                }),
                cancel: vi.fn(),
            });

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        const nextButton = await screen.findByRole('button', { name: '次へ' });

        await waitFor(() => {
            expect(screen.queryByText('リレーとの同期に失敗しました')).toBeNull();
            expect(nextButton).toHaveProperty('disabled', false);
        });

        await fireEvent.click(nextButton);

        await waitFor(() => {
            expect(relayFetchServiceMock.fetchLatest).toHaveBeenNthCalledWith(
                2,
                {} as any,
                expect.objectContaining({
                    pubkeyHex: 'a'.repeat(64),
                    limit: 200,
                    until: 149,
                }),
            );
            expect(screen.getByText('2 / 2 ページ')).toBeTruthy();
        });
    });

    it('close 後に reopen すると同期状態を初期化して再試行する', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(0);
        repositoryMock.getPage.mockResolvedValue([]);
        relayFetchServiceMock.fetchLatest
            .mockReturnValueOnce({
                promise: Promise.resolve({
                    status: 'error',
                    events: [],
                    fetchedAt: 1000,
                    nextUntil: null,
                    hasMore: false,
                    relayUrls: [],
                }),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve({
                    status: 'success',
                    events: [],
                    fetchedAt: 2000,
                    nextUntil: null,
                    hasMore: false,
                    relayUrls: [],
                }),
                cancel: vi.fn(),
            });

        const onClose = vi.fn();
        const { rerender } = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose,
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('リレーとの同期に失敗しました')).toBeTruthy();
        });

        await rerender({
            show: false,
            onClose,
            pubkeyHex: 'a'.repeat(64),
            rxNostr: {} as any,
        });

        await rerender({
            show: true,
            onClose,
            pubkeyHex: 'a'.repeat(64),
            rxNostr: {} as any,
        });

        await waitFor(() => {
            expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledTimes(2);
            expect(screen.queryByText('リレーとの同期に失敗しました')).toBeNull();
        });
    });

    it('ページ送りボタンが動作し、前後の disabled 状態が切り替わる', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(60);
        repositoryMock.getPage.mockImplementation(({ page }: { page: number }) => Promise.resolve(
            page === 1
                ? [createRecord({ eventId: 'page-1', content: '1ページ目' })]
                : [createRecord({ eventId: 'page-2', content: '2ページ目' })],
        ));

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        const previousButton = await screen.findByRole('button', { name: '前へ' });
        const nextButton = await screen.findByRole('button', { name: '次へ' });

        await waitFor(() => {
            expect(previousButton).toHaveProperty('disabled', true);
            expect(nextButton).toHaveProperty('disabled', false);
            expect(screen.getByText('1 / 2 ページ')).toBeTruthy();
        });

        await fireEvent.click(nextButton);

        await waitFor(() => {
            expect(repositoryMock.getPage).toHaveBeenLastCalledWith({
                pubkeyHex: 'a'.repeat(64),
                page: 2,
                pageSize: 50,
            });
            expect(screen.getByText('2 / 2 ページ')).toBeTruthy();
            expect(previousButton).toHaveProperty('disabled', false);
            expect(nextButton).toHaveProperty('disabled', true);
        });
    });

    it('ページ送り後に投稿履歴のスクロール位置を先頭に戻す', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(60);
        repositoryMock.getPage.mockImplementation(({ page }: { page: number }) => Promise.resolve(
            page === 1
                ? [createRecord({ eventId: 'page-1', content: '1ページ目' })]
                : [createRecord({ eventId: 'page-2', content: '2ページ目' })],
        ));

        const { container } = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        let postHistoryContainer: HTMLDivElement | null = null;
        const nextButton = await screen.findByRole('button', { name: '次へ' });

        await waitFor(() => {
            postHistoryContainer = document.querySelector('.post-history-container') as HTMLDivElement;
            expect(postHistoryContainer).toBeTruthy();
            expect(nextButton).toHaveProperty('disabled', false);
            expect(screen.getByText('1 / 2 ページ')).toBeTruthy();
        });

        postHistoryContainer!.scrollTop = 123;

        await fireEvent.click(nextButton);

        await waitFor(() => {
            expect(screen.getByText('2 / 2 ページ')).toBeTruthy();
            expect(postHistoryContainer!.scrollTop).toBe(0);
        });
    });

    it('close 後に reopen するとページ位置を復元して前回ページを即表示する', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(60);
        const deferredReopenPage = createDeferred<ReturnType<typeof createRecord>[]>();
        let page2RequestCount = 0;
        repositoryMock.getPage.mockImplementation(({ page }: { page: number }) => {
            if (page === 1) {
                return Promise.resolve([
                    createRecord({ eventId: 'page-1', content: '1ページ目' }),
                ]);
            }

            if (page === 2) {
                page2RequestCount += 1;

                if (page2RequestCount === 1) {
                    return Promise.resolve([
                        createRecord({ eventId: 'page-2', content: '2ページ目' }),
                    ]);
                }

                return deferredReopenPage.promise;
            }

            return Promise.resolve([]);
        });

        const onClose = vi.fn();
        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose,
                pubkeyHex: 'a'.repeat(64),
            },
        });

        const nextButton = await screen.findByRole('button', { name: '次へ' });

        let postHistoryContainer: HTMLDivElement | null = null;
        await waitFor(() => {
            postHistoryContainer = document.querySelector('.post-history-container') as HTMLDivElement;
            expect(postHistoryContainer).toBeTruthy();
            expect(nextButton).toHaveProperty('disabled', false);
            expect(screen.getByText('1 / 2 ページ')).toBeTruthy();
        });

        await fireEvent.click(nextButton);

        await waitFor(() => {
            expect(screen.getByText('2 / 2 ページ')).toBeTruthy();
        });

        view.unmount();

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose,
                pubkeyHex: 'a'.repeat(64),
            },
        });

        expect(screen.getByText('2 / 2 ページ')).toBeTruthy();
        expect(screen.getByText('2ページ目')).toBeTruthy();

        deferredReopenPage.resolve([
            createRecord({ eventId: 'page-2', content: '2ページ目' }),
        ]);
    });

    it('次ページに必要な件数が足りない場合は until 付きで古い投稿を追加取得する', async () => {
        repositoryMock.countForPubkey
            .mockResolvedValueOnce(50)
            .mockResolvedValueOnce(50)
            .mockResolvedValueOnce(50)
            .mockResolvedValueOnce(51)
            .mockResolvedValueOnce(51);
        repositoryMock.getPage
            .mockResolvedValueOnce([createRecord({ eventId: 'page-1', content: '1ページ目' })])
            .mockResolvedValueOnce([createRecord({ eventId: 'page-1', content: '1ページ目' })])
            .mockResolvedValueOnce([createRecord({ eventId: 'page-2', content: '2ページ目' })]);
        relayFetchServiceMock.fetchLatest
            .mockReturnValueOnce({
                promise: Promise.resolve({
                    status: 'success',
                    events: [],
                    fetchedAt: 1000,
                    nextUntil: 149,
                    hasMore: true,
                    relayUrls: ['wss://relay.example.com/'],
                }),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve({
                    status: 'success',
                    events: [
                        {
                            event: {
                                id: 'c'.repeat(64),
                                pubkey: 'a'.repeat(64),
                                kind: 1,
                                content: '2ページ目',
                                tags: [],
                                created_at: 140,
                                sig: 'd'.repeat(128),
                            },
                            relayUrls: ['wss://relay.example.com/'],
                        },
                    ],
                    fetchedAt: 2000,
                    nextUntil: null,
                    hasMore: false,
                    relayUrls: ['wss://relay.example.com/'],
                }),
                cancel: vi.fn(),
            });

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        const nextButton = await screen.findByRole('button', { name: '次へ' });

        await waitFor(() => {
            expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledTimes(1);
        });

        repositoryMock.upsertFetchedEvents.mockResolvedValueOnce({
            insertedCount: 1,
            updatedCount: 0,
            unchangedCount: 0,
        });
        await fireEvent.click(nextButton);

        await waitFor(() => {
            expect(relayFetchServiceMock.fetchLatest).toHaveBeenNthCalledWith(
                2,
                {} as any,
                expect.objectContaining({
                    pubkeyHex: 'a'.repeat(64),
                    limit: 200,
                    until: 149,
                }),
            );
            expect(repositoryMock.upsertFetchedEvents).toHaveBeenCalledWith({
                events: [
                    {
                        event: expect.objectContaining({ id: 'c'.repeat(64) }),
                        relayUrls: ['wss://relay.example.com/'],
                    },
                ],
                fetchedAt: 2000,
            });
            expect(screen.getByText('2 / 2 ページ')).toBeTruthy();
        });
    });

    it('古い投稿をリレーから取得中は次へボタンにローダーを表示する', async () => {
        const olderFetch = createDeferred<{
            status: 'success';
            events: any[];
            fetchedAt: number;
            nextUntil: null;
            hasMore: false;
            relayUrls: string[];
        }>();
        repositoryMock.countForPubkey
            .mockResolvedValueOnce(50)
            .mockResolvedValueOnce(50)
            .mockResolvedValueOnce(50);
        repositoryMock.getPage.mockResolvedValue([createRecord({ eventId: 'page-1', content: '1ページ目' })]);
        relayFetchServiceMock.fetchLatest
            .mockReturnValueOnce({
                promise: Promise.resolve({
                    status: 'success',
                    events: [],
                    fetchedAt: 1000,
                    nextUntil: 149,
                    hasMore: true,
                    relayUrls: ['wss://relay.example.com/'],
                }),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: olderFetch.promise,
                cancel: vi.fn(),
            });

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        const nextButton = await screen.findByRole('button', { name: '次へ' });

        await waitFor(() => {
            expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledTimes(1);
        });

        await fireEvent.click(nextButton);

        await waitFor(() => {
            expect(nextButton).toHaveProperty('disabled', true);
            expect(nextButton.querySelector('.dialog-page-loading-placeholder')).toBeTruthy();
            expect(nextButton.querySelector('.loader-container')).toBeTruthy();
            expect(nextButton.textContent).not.toContain('次へ');
        });

        olderFetch.resolve({
            status: 'success',
            events: [],
            fetchedAt: 2000,
            nextUntil: null,
            hasMore: false,
            relayUrls: [],
        });
    });

    it('古い投稿を追加取得しても件数が足りなければ noMorePosts を表示する', async () => {
        repositoryMock.countForPubkey
            .mockResolvedValueOnce(50)
            .mockResolvedValueOnce(50)
            .mockResolvedValueOnce(50)
            .mockResolvedValueOnce(50)
            .mockResolvedValueOnce(50);
        repositoryMock.getPage.mockResolvedValue([createRecord({ eventId: 'page-1', content: '1ページ目' })]);
        relayFetchServiceMock.fetchLatest
            .mockReturnValueOnce({
                promise: Promise.resolve({
                    status: 'success',
                    events: [],
                    fetchedAt: 1000,
                    nextUntil: 149,
                    hasMore: true,
                    relayUrls: ['wss://relay.example.com/'],
                }),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve({
                    status: 'success',
                    events: [],
                    fetchedAt: 2000,
                    nextUntil: null,
                    hasMore: false,
                    relayUrls: ['wss://relay.example.com/'],
                }),
                cancel: vi.fn(),
            });

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        const nextButton = await screen.findByRole('button', { name: '次へ' });

        await fireEvent.click(nextButton);

        await waitFor(() => {
            expect(screen.getByText('これ以上古い投稿はありません')).toBeTruthy();
            expect(screen.getByText('1 / 1 ページ')).toBeTruthy();
        });
    });

    it('投稿履歴一覧を表示し、neventコピー成功を表示する', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([createRecord()]);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await waitFor(() => {
            expectDefaultMediaReplacement();
            expect(screen.queryByText('メディア: image 1')).toBeNull();
        });

        const actionTrigger = screen.getAllByRole('button', { name: 'アクションを表示' })[0];
        await fireEvent.click(actionTrigger);
        await fireEvent.click(await screen.findByRole('button', { name: 'neventをコピー' }));

        expect(nostrUtilsMock.toNevent).toHaveBeenCalledWith(expect.objectContaining({
            eventId: 'b'.repeat(64),
            authorPubkey: 'a'.repeat(64),
            kind: 1,
            acceptedRelays: ['wss://accepted.example.com/'],
            relayHints: ['wss://hint.example.com/'],
        }));
        expect(clipboardMock.tryCopyToClipboard).toHaveBeenCalledWith(
            'nevent1mock',
            'nevent',
            navigator,
            window,
        );
        expect(screen.getByText('コピーしました')).toBeTruthy();
    });

    it('自分の投稿にだけ削除ボタンを表示する', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(2);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({ eventId: 'mine', content: '自分の投稿', media: [] }),
            createRecord({
                eventId: 'other',
                pubkeyHex: 'b'.repeat(64),
                content: '他人の投稿',
                media: [],
            }),
        ]);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await waitFor(() => {
            expect(screen.getByText('自分の投稿')).toBeTruthy();
            expect(screen.getByText('他人の投稿')).toBeTruthy();
        });

        expect(screen.getAllByRole('button', { name: 'アクションを表示' })).toHaveLength(2);

        const actionTriggers = screen.getAllByRole('button', { name: 'アクションを表示' });
        await fireEvent.click(actionTriggers[0]);
        expect(await screen.findByRole('button', { name: '削除' })).toBeTruthy();
    });

    it('deletedAt がある投稿では削除状態を表示し、削除ボタンを出さない', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                eventId: 'deleted-post',
                content: '削除済み投稿',
                media: [],
                deletedAt: 999,
                deletionEventId: 'delete-event-id',
            }),
        ]);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await waitFor(() => {
            expect(screen.getAllByText('削除リクエスト済み')).toHaveLength(2);
        });

        expect(screen.queryByRole('button', { name: '削除' })).toBeNull();
    });

    it('削除ボタンで確認ダイアログを開き、理由入力欄を表示しない', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({ eventId: 'delete-target', content: '削除対象本文', media: [] }),
        ]);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await screen.findByText('削除対象本文');
        const actionTrigger = screen.getAllByRole('button', { name: 'アクションを表示' })[0];
        await fireEvent.click(actionTrigger);
        await fireEvent.click(await screen.findByRole('button', { name: '削除' }));

        await waitFor(() => {
            expect(screen.getAllByText('この投稿の削除リクエストをリレーへ送信します。').length).toBeGreaterThan(0);
            expect(screen.getByText('削除はリレーへのリクエストであり、完全な削除は保証されません。')).toBeTruthy();
            expect(screen.getAllByText('削除対象本文').length).toBeGreaterThan(0);
        });

        expect(screen.queryByRole('textbox')).toBeNull();
    });

    it('削除確認後に service を呼び、削除状態表示へ切り替える', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({ eventId: 'delete-target', content: '削除対象本文', media: [] }),
        ]);
        postDeletionServiceMock.requestDeletion.mockResolvedValue({
            success: true,
            eventId: 'delete-event-id',
            deletionEventId: 'delete-event-id',
            deletedAt: 4567,
        });

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await screen.findByText('削除対象本文');
        const actionTrigger = screen.getAllByRole('button', { name: 'アクションを表示' })[0];
        await fireEvent.click(actionTrigger);
        await fireEvent.click(await screen.findByRole('button', { name: '削除' }));
        await fireEvent.click(await screen.findByRole('button', { name: '送信' }));

        await waitFor(() => {
            expect(postDeletionServiceMock.requestDeletion).toHaveBeenCalledWith({
                post: expect.objectContaining({ eventId: 'delete-target' }),
                rxNostr: {},
            });
            expect(screen.getAllByText('削除リクエスト済み')).toHaveLength(2);
        });
    });

    it('削除送信失敗時に deleteFailed を表示する', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({ eventId: 'delete-target', content: '削除対象本文', media: [] }),
        ]);
        postDeletionServiceMock.requestDeletion.mockResolvedValue({
            success: false,
            error: 'post_error',
        });

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await screen.findByText('削除対象本文');
        const actionTrigger = screen.getAllByRole('button', { name: 'アクションを表示' })[0];
        await fireEvent.click(actionTrigger);
        await fireEvent.click(await screen.findByRole('button', { name: '削除' }));
        await fireEvent.click(await screen.findByRole('button', { name: '送信' }));

        await waitFor(() => {
            expect(screen.getAllByText('削除リクエストの送信に失敗しました')).toHaveLength(2);
        });
    });

    it('channelMetadata cache 済みなら service を呼ばず channel 名を表示する', async () => {
        channelMetadataRepositoryMock.getMany.mockResolvedValue([
            {
                channelEventId: 'channel-id',
                name: 'cached-general',
                about: null,
                picture: null,
                relays: ['wss://channel-write.example.com/'],
                relayHints: ['wss://channel.example.com/'],
                creatorPubkey: 'c'.repeat(64),
                createEventCreatedAt: 100,
                metadataEventId: 'm'.repeat(64),
                metadataCreatedAt: 200,
                fetchedAt: 1000,
            },
        ]);
        channelMetadataRepositoryMock.shouldRefresh.mockReturnValue(false);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                eventId: 'channel-post',
                kind: 42,
                content: 'channel post',
                media: [],
                channelEventId: 'channel-id',
                channelRelayHints: ['wss://channel.example.com/'],
            }),
        ]);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(channelMetadataRepositoryMock.getMany).toHaveBeenCalledWith(['channel-id']);
            expect(channelContextServiceMock.resolveChannelMetadata).not.toHaveBeenCalled();
            expect(screen.getByText('cached-general')).toBeTruthy();
        });

        const channelRow = screen.getByText('cached-general').closest('.post-history-channel-row');
        expect(channelRow?.parentElement?.classList.contains('post-preview-header')).toBe(true);
    });

    it('未取得 channel だけ service で解決して保存し、同じ channelEventId の fetch を重複させない', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(2);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                eventId: 'channel-post-1',
                kind: 42,
                content: 'first channel post',
                media: [],
                channelEventId: 'channel-id',
                channelRelayHints: ['wss://channel.example.com/'],
            }),
            createRecord({
                eventId: 'channel-post-2',
                kind: 42,
                content: 'second channel post',
                media: [],
                channelEventId: 'channel-id',
                channelRelayHints: ['wss://channel.example.com/'],
            }),
        ]);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(channelContextServiceMock.resolveChannelMetadata).toHaveBeenCalledTimes(1);
            expect(channelMetadataRepositoryMock.upsertResolvedChannel).toHaveBeenCalledTimes(1);
            expect(screen.getAllByText('general').length).toBeGreaterThan(0);
        });
    });

    it('channel metadata 取得失敗時は失敗を記録して unknown を表示する', async () => {
        channelContextServiceMock.resolveChannelMetadata.mockRejectedValueOnce(new Error('fetch failed'));
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                eventId: 'channel-post',
                kind: 42,
                content: 'channel post',
                media: [],
                channelEventId: 'channel-id',
                channelRelayHints: ['wss://channel.example.com/'],
            }),
        ]);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(channelMetadataRepositoryMock.markFetchFailed).toHaveBeenCalledWith(
                'channel-id',
                expect.any(Number),
                expect.any(Array),
            );
            expect(screen.getByText('不明')).toBeTruthy();
        });
    });

    it('unmount 時に進行中の同期を cleanup する', async () => {
        const cancel = vi.fn();
        repositoryMock.countForPubkey.mockResolvedValue(0);
        repositoryMock.getPage.mockResolvedValue([]);
        relayFetchServiceMock.fetchLatest.mockReturnValue({
            promise: new Promise(() => undefined),
            cancel,
        });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        view.unmount();
        expect(cancel).toHaveBeenCalledOnce();
    });

    it('neventコピー失敗を表示する', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({
                content: '投稿本文',
                media: [],
                relayHints: [],
                acceptedRelays: [],
            }),
        ]);
        clipboardMock.tryCopyToClipboard.mockResolvedValue(false);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await waitFor(() => {
            expect(screen.getByText('投稿本文')).toBeTruthy();
        });

        const actionTrigger = screen.getAllByRole('button', { name: 'アクションを表示' })[0];
        await fireEvent.click(actionTrigger);
        await fireEvent.click(await screen.findByRole('button', { name: 'neventをコピー' }));

        expect(screen.getByText('コピーに失敗しました')).toBeTruthy();
    });
});
