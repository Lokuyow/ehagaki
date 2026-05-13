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
        'postHistory.openMenu': '投稿履歴メニューを開く',
        'postHistory.showSearch': '検索',
        'postHistory.hideSearch': '検索を閉じる',
        'postHistory.clearSearch': '検索をクリア',
        'postHistory.searchPlaceholder': '投稿履歴を検索',
        'postHistory.searchNoResults': '一致する投稿はありません',
        'postHistory.searchResults': '検索結果',
        'postHistory.visibleRange': `表示中: ${options?.values?.from}〜${options?.values?.to}`,
        'postHistory.visibleCountSummary': `${options?.values?.visible}件表示 / 全 ${options?.values?.total}件`,
        'postHistory.searchCountSummary': `${options?.values?.visible}件表示 / ${options?.values?.total}件一致`,
        'postHistory.loadOlder': 'さらに古い投稿を表示',
        'postHistory.loadNewer': '新しい投稿を表示',
        'postHistory.loadOlderSearchResults': 'さらに古い検索結果を表示',
        'postHistory.loadNewerSearchResults': '新しい検索結果を表示',
        'postHistory.returnToLatest': '最新へ戻る',
        'postHistory.jumpToDate': '日付へ移動',
        'postHistory.jumpToDateLabel': '日付',
        'postHistory.jumpToDateSubmit': 'この日付付近を表示',
        'postHistory.fetchOlderFromRelays': 'リレーから古い投稿を取得',
        'postHistory.localHistoryExhausted': 'ローカル履歴はここまでです',
        'postHistory.empty': '投稿履歴はありません',
        'postHistory.syncing': 'リレーと同期中...',
        'postHistory.synced': 'リレーとの同期が完了しました',
        'postHistory.syncFailed': 'リレーとの同期に失敗しました',
        'postHistory.repair': '表示中の投稿付近を再取得',
        'postHistory.repairing': '再取得中...',
        'postHistory.repairAdded': `${options?.values?.count}件の投稿を追加しました`,
        'postHistory.repairNoChanges': '追加できる投稿はありません',
        'postHistory.repairPartialFailure': '一部の取得に失敗しました。時間をおいて再実行してください。',
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
        'postHistory.deleteLocalHistory': 'ローカル投稿履歴を全削除',
        'postHistory.deleteLocalHistoryTitle': 'ローカル投稿履歴を全削除',
        'postHistory.deleteLocalHistoryDescription': 'ローカル履歴だけを削除します',
        'postHistory.deleteLocalHistoryConfirm': '全削除',
        'postHistory.deleteLocalHistoryCancel': 'キャンセル',
        'postHistory.deleteLocalHistorySuccess': 'ローカル投稿履歴を削除しました',
        'postHistory.deleteLocalHistoryFailed': 'ローカル投稿履歴の削除に失敗しました',
        'postHistory.deletedBadge': '削除リクエスト済み',
        'postHistory.eventId': 'event id',
        'postHistory.media': 'メディア',
        'postHistory.mediaOpen': '開く',
        'postHistory.deleted': '削除済み',
        'postHistory.firstPage': '最初のページ',
        'postHistory.previousPage': '前へ',
        'postHistory.nextPage': '次へ',
        'postHistory.lastPage': '最後のページ',
        'postHistory.channel': 'チャンネル',
        'postHistory.channelLoading': '読み込み中...',
        'postHistory.channelUnknown': '不明',
        'replyQuote.reply_label': 'リプライ',
        'replyQuote.quote_label': '引用',
        'common.cancel': 'キャンセル',
        'global.close': '閉じる',
    };

    if (key === 'postHistory.page') {
        return `${options?.values?.page} / ${options?.values?.total} ページ`;
    }

    return translations[key] || key;
});
const repositoryMock = vi.hoisted(() => ({
    getPage: vi.fn(),
    getVisiblePage: vi.fn(),
    getLatestVisibleChunk: vi.fn(),
    getOlderVisibleChunk: vi.fn(),
    getNewerVisibleChunk: vi.fn(),
    getVisibleChunkFromCreatedAt: vi.fn(),
    countForPubkey: vi.fn(),
    countVisibleForPubkey: vi.fn(),
    upsertFetchedEvents: vi.fn(),
    deleteForPubkey: vi.fn(),
}));

const visibleRangeRepositoryMock = vi.hoisted(() => ({
    get: vi.fn(),
    save: vi.fn(),
    clear: vi.fn(),
    clearForPubkey: vi.fn(),
}));

const repairCursorRepositoryMock = vi.hoisted(() => ({
    clearForPubkey: vi.fn(),
}));

const syncCoverageRepositoryMock = vi.hoisted(() => ({
    saveAttempt: vi.fn(),
    deleteForPubkey: vi.fn(),
}));

const relayFetchServiceMock = vi.hoisted(() => ({
    fetchLatest: vi.fn(),
}));

const repairServiceMock = vi.hoisted(() => ({
    refetchAroundCurrentView: vi.fn(),
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

vi.mock('../../lib/storage/postHistoryVisibleRangeRepository', async () => {
    const actual = await vi.importActual<typeof import('../../lib/storage/postHistoryVisibleRangeRepository')>('../../lib/storage/postHistoryVisibleRangeRepository');
    return {
        ...actual,
        postHistoryVisibleRangeRepository: visibleRangeRepositoryMock,
    };
});

vi.mock('../../lib/postHistoryRelayFetchService', () => ({
    POST_HISTORY_FETCH_KINDS: [1, 42],
    POST_HISTORY_INITIAL_FETCH_LIMIT: 200,
    POST_HISTORY_PAGE_SIZE: 50,
    POST_HISTORY_RELAY_FETCH_LIMIT: 200,
    postHistoryRelayFetchService: relayFetchServiceMock,
}));

vi.mock('../../lib/postHistoryCurrentViewRefetchService', () => ({
    postHistoryCurrentViewRefetchService: repairServiceMock,
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

async function openPostHistoryMenu(): Promise<void> {
    const trigger = await screen.findByRole('button', { name: '投稿履歴メニューを開く' });
    await fireEvent.click(trigger);
}

async function openSearchBar(): Promise<HTMLInputElement> {
    await openPostHistoryMenu();
    await fireEvent.click(await screen.findByRole('button', { name: '検索' }));
    return screen.findByRole('searchbox', { name: '検索' }) as Promise<HTMLInputElement>;
}

async function findRepairButton(): Promise<HTMLButtonElement> {
    const existing = screen.queryByRole('button', { name: /表示中の投稿付近を再取得|再取得中\.\.\./ });
    if (existing) {
        return existing as HTMLButtonElement;
    }

    await openPostHistoryMenu();
    return screen.findByRole('button', { name: /表示中の投稿付近を再取得|再取得中\.\.\./ }) as Promise<HTMLButtonElement>;
}

describe('PostHistoryDialog', () => {
    beforeEach(() => {
        clearPersistedPostHistoryListingSnapshots();
        clearPersistedPostHistoryViewState();
        vi.clearAllMocks();
        repositoryMock.getPage.mockResolvedValue([]);
        repositoryMock.getVisiblePage.mockImplementation(async ({ pubkeyHex, page, pageSize }: Record<string, any>) =>
            repositoryMock.getPage({ pubkeyHex, page, pageSize }),
        );
        repositoryMock.getLatestVisibleChunk.mockImplementation(async ({ pubkeyHex, visibleUntil, limit }: Record<string, any>) => {
            if (typeof visibleUntil === 'number') {
                return repositoryMock.getVisiblePage({
                    pubkeyHex,
                    visibleUntil,
                    page: 1,
                    pageSize: limit,
                });
            }

            return repositoryMock.getPage({
                pubkeyHex,
                page: 1,
                pageSize: limit,
            });
        });
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getVisibleChunkFromCreatedAt.mockImplementation(async ({ pubkeyHex, visibleUntil, limit }: Record<string, any>) =>
            repositoryMock.getLatestVisibleChunk({ pubkeyHex, visibleUntil, limit }),
        );
        repositoryMock.countForPubkey.mockResolvedValue(0);
        repositoryMock.countVisibleForPubkey.mockImplementation(async (pubkeyHex: string) =>
            repositoryMock.countForPubkey(pubkeyHex),
        );
        repositoryMock.upsertFetchedEvents.mockResolvedValue({
            insertedCount: 0,
            updatedCount: 0,
            unchangedCount: 0,
        });
        repositoryMock.deleteForPubkey.mockResolvedValue(undefined);
        visibleRangeRepositoryMock.get.mockResolvedValue(null);
        visibleRangeRepositoryMock.save.mockResolvedValue(null);
        visibleRangeRepositoryMock.clear.mockResolvedValue(undefined);
        visibleRangeRepositoryMock.clearForPubkey.mockResolvedValue(undefined);
        repairCursorRepositoryMock.clearForPubkey.mockResolvedValue(undefined);
        syncCoverageRepositoryMock.saveAttempt.mockResolvedValue(null);
        syncCoverageRepositoryMock.deleteForPubkey.mockResolvedValue(undefined);
        repairServiceMock.refetchAroundCurrentView.mockReturnValue({
            promise: Promise.resolve({
                status: 'success',
                addedCount: 0,
                updatedCount: 0,
                unchangedCount: 0,
                processedRangeCount: 0,
                processedRanges: [],
                attemptedRangeCount: 0,
                hadFailures: false,
            }),
            cancel: vi.fn(),
        });
        relayFetchServiceMock.fetchLatest.mockReturnValue({
            promise: Promise.resolve({
                status: 'cancelled',
                events: [],
                fetchedAt: 0,
                nextUntil: null,
                hasMore: false,
                relayUrls: [],
                observedRelayUrls: [],
                rawCount: 0,
                uniqueCount: 0,
                duplicateCount: 0,
                perRelayCounts: [],
                oldestCreatedAt: null,
                newestCreatedAt: null,
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

    it('[search-local] 検索 input からローカル検索へ切り替える', async () => {
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

        const searchInput = await openSearchBar();
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
            expect(screen.getByText('1件表示 / 1件一致')).toBeTruthy();
        });
    });

    it('[search-no-results] 検索結果 0 件では searchNoResults を表示し、検索入力を消すと通常表示へ戻る', async () => {
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

        const searchInput = await openSearchBar();
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

    it('[search-channel-nevent] 検索中も cached channel 名表示と nevent コピーを維持し、channel relay fetch はしない', async () => {
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

        const searchInput = await openSearchBar();
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

    it('[sync-upsert] 同期成功後に upsert して一覧を更新する', async () => {
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


});
