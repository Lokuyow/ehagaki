import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { readable } from 'svelte/store';
import { vi } from 'vitest';
import { clearPersistedPostHistoryListingSnapshots } from '../../lib/hooks/usePostHistoryListing.svelte';
import { clearPersistedPostHistoryViewState } from '../../lib/postHistoryDialogViewState';

const hoisted = vi.hoisted(() => {
    const mockTranslate = (key: string, options?: { values?: Record<string, unknown> }) => {
        const translations: Record<string, string> = {
            'postHistory.title': '投稿履歴',
            'postHistory.description': 'eHagakiで投稿に成功した履歴です。',
            'postHistory.search': '検索',
            'postHistory.openMenu': '投稿履歴メニューを開く',
            'postHistory.showSearch': '検索',
            'postHistory.hideSearch': '検索を閉じる',
            'postHistory.searchPlaceholder': '投稿履歴を検索',
            'postHistory.visibleRange': `表示中: ${options?.values?.from}〜${options?.values?.to}`,
            'postHistory.visibleCountSummary': `${options?.values?.visible}件表示 / 全 ${options?.values?.total}件`,
            'postHistory.searchCountSummary': `${options?.values?.visible}件表示 / ${options?.values?.total}件一致`,
            'postHistory.loadOlder': 'さらに古い投稿を表示',
            'postHistory.loadNewer': '新しい投稿を表示',
            'postHistory.loadOlderSearchResults': 'さらに古い検索結果を表示',
            'postHistory.loadNewerSearchResults': '新しい検索結果を表示',
            'postHistory.returnToLatest': '最新へ戻る',
            'postHistory.jumpToOldest': '最古へ移動',
            'postHistory.jumpToDate': '日付へ移動',
            'postHistory.jumpToDateLabel': '日付',
            'postHistory.jumpToDateSubmit': 'この日付付近を表示',
            'postHistory.fetchOlderFromRelays': 'リレーから古い投稿を取得',
            'postHistory.fetchUnfetchedFromRelays': '未取得の投稿を取得',
            'postHistory.fetchOlderFromRelaysLoading': 'リレーから取得中...',
            'postHistory.remoteContinuationNotice': '未取得の投稿がまだある可能性があります。',
            'postHistory.repair': '表示中の投稿付近を再取得',
            'postHistory.repairing': '再取得中...',
            'postHistory.empty': '投稿履歴はありません',
            'postHistory.syncing': 'リレーと同期中...',
            'postHistory.synced': 'リレーとの同期が完了しました',
            'postHistory.syncFailed': 'リレーとの同期に失敗しました',
            'postHistory.noMorePosts': 'これ以上古い投稿はありません',
            'postHistory.repairAdded': `${options?.values?.count ?? 0}件の投稿を追加しました`,
            'postHistory.repairNoChanges': '追加できる投稿はありません',
            'postHistory.repairPartialFailure': '一部の取得に失敗しました。時間をおいて再実行してください。',
            'common.cancel': 'キャンセル',
            'global.close': '閉じる',
        };

        return translations[key] || key;
    };

    return {
        mockTranslate,
        repositoryMock: {
            getLatestVisibleChunk: vi.fn(),
            getOlderVisibleChunk: vi.fn(),
            getNewerVisibleChunk: vi.fn(),
            getVisibleChunkFromCreatedAt: vi.fn(),
            countForPubkey: vi.fn(),
            countVisibleForPubkey: vi.fn(),
            upsertFetchedEvents: vi.fn(),
            deleteForPubkey: vi.fn(),
        },
        visibleRangeRepositoryMock: {
            get: vi.fn(),
            save: vi.fn(),
            clearForPubkey: vi.fn(),
        },
        repairCursorRepositoryMock: {
            clearForPubkey: vi.fn(),
        },
        syncCoverageRepositoryMock: {
            saveAttempt: vi.fn(),
            deleteForPubkey: vi.fn(),
        },
        relayFetchServiceMock: {
            fetchLatest: vi.fn(),
        },
        repairServiceMock: {
            refetchAroundCurrentView: vi.fn(),
        },
        localSearchServiceMock: {
            searchLocalPosts: vi.fn(),
        },
        postMediaCacheServiceMock: {
            canUsePersistentCache: vi.fn(() => false),
            prefetchCachedMediaDescriptors: vi.fn().mockResolvedValue(undefined),
            getCachedMediaDescriptorSnapshot: vi.fn().mockReturnValue(undefined),
            getCachedMediaObjectUrlSnapshot: vi.fn().mockReturnValue(null),
            getCachedMediaDescriptor: vi.fn().mockResolvedValue(null),
            createCachedMediaObjectUrl: vi.fn().mockResolvedValue(null),
            fetchAndCacheMedia: vi.fn().mockResolvedValue(null),
            revokeObjectUrl: vi.fn(),
        },
        clipboardMock: {
            tryCopyToClipboard: vi.fn().mockResolvedValue(true),
        },
        postDeletionServiceMock: {
            requestDeletion: vi.fn(),
        },
        channelMetadataRepositoryMock: {
            getMany: vi.fn().mockResolvedValue([]),
            upsertResolvedChannel: vi.fn(),
            shouldRefresh: vi.fn().mockReturnValue(false),
            markFetchFailed: vi.fn(),
        },
        customEmojiImageMetaRepositoryMock: {
            get: vi.fn().mockResolvedValue(null),
            getMany: vi.fn().mockResolvedValue({}),
            upsert: vi.fn(),
            touchMany: vi.fn(),
            prune: vi.fn(),
        },
        customEmojiMock: {
            preloadCustomEmojiImage: vi.fn().mockResolvedValue(true),
            preloadCustomEmojiImageWithMeta: vi.fn().mockResolvedValue({
                ready: true,
                width: 120,
                height: 60,
                aspectRatio: 2,
            }),
        },
    };
});

const mockTranslate = hoisted.mockTranslate;
export const repositoryMock = hoisted.repositoryMock;
export const visibleRangeRepositoryMock = hoisted.visibleRangeRepositoryMock;
export const repairCursorRepositoryMock = hoisted.repairCursorRepositoryMock;
export const syncCoverageRepositoryMock = hoisted.syncCoverageRepositoryMock;
export const relayFetchServiceMock = hoisted.relayFetchServiceMock;
export const repairServiceMock = hoisted.repairServiceMock;
export const localSearchServiceMock = hoisted.localSearchServiceMock;
export const postMediaCacheServiceMock = hoisted.postMediaCacheServiceMock;
export const clipboardMock = hoisted.clipboardMock;
export const postDeletionServiceMock = hoisted.postDeletionServiceMock;
export const channelMetadataRepositoryMock = hoisted.channelMetadataRepositoryMock;
export const customEmojiImageMetaRepositoryMock = hoisted.customEmojiImageMetaRepositoryMock;
export const customEmojiMock = hoisted.customEmojiMock;

vi.mock('svelte-i18n', () => ({
    _: readable(hoisted.mockTranslate),
}));

vi.mock('photoswipe', () => ({
    default: class MockPhotoSwipe {
        constructor(public options: Record<string, unknown>) { }
        on() { }
        init() { }
        close() { }
        destroy() { }
        goTo() { }
    },
}));

vi.mock('../../lib/utils/fullscreenViewerUtils', () => ({
    buildFullscreenViewerDataSource: vi.fn(async (items: Array<Record<string, unknown>>) => items),
    createFullscreenVideoSlideElement: vi.fn(() => document.createElement('div')),
    pauseFullscreenVideoContent: vi.fn(),
}));

vi.mock('../../lib/hooks/useDialogHistory.svelte', () => ({
    useDialogHistory: vi.fn(),
}));

vi.mock('../../lib/storage/postHistoryRepository', () => ({
    postHistoryRepository: hoisted.repositoryMock,
}));

vi.mock('../../lib/storage/postHistoryVisibleRangeRepository', async () => {
    const actual = await vi.importActual<typeof import('../../lib/storage/postHistoryVisibleRangeRepository')>('../../lib/storage/postHistoryVisibleRangeRepository');
    return {
        ...actual,
        postHistoryVisibleRangeRepository: hoisted.visibleRangeRepositoryMock,
    };
});

vi.mock('../../lib/postHistoryRelayFetchService', () => ({
    POST_HISTORY_FETCH_KINDS: [1, 42],
    POST_HISTORY_BOOTSTRAP_FETCH_LIMIT: 150,
    POST_HISTORY_BOOTSTRAP_FETCH_TIMEOUT_MS: 20_000,
    POST_HISTORY_DIALOG_OPEN_REFRESH_LIMIT: 30,
    POST_HISTORY_DIALOG_OPEN_REFRESH_TIMEOUT_MS: 6_000,
    POST_HISTORY_DIALOG_OPEN_REFRESH_TTL_MS: 60_000,
    POST_HISTORY_OLDER_FETCH_LIMIT: 150,
    POST_HISTORY_OLDER_FETCH_TIMEOUT_MS: 25_000,
    POST_HISTORY_PAGE_SIZE: 50,
    POST_HISTORY_REPAIR_FETCH_LIMIT: 200,
    postHistoryRelayFetchService: hoisted.relayFetchServiceMock,
}));

vi.mock('../../lib/postHistoryCurrentViewRefetchService', () => ({
    postHistoryCurrentViewRefetchService: hoisted.repairServiceMock,
}));

vi.mock('../../lib/postHistoryLocalSearchService', () => ({
    postHistoryLocalSearchService: hoisted.localSearchServiceMock,
}));

vi.mock('../../lib/postDeletionService', () => ({
    canRequestPostDeletion: () => true,
    postDeletionService: hoisted.postDeletionServiceMock,
}));

vi.mock('../../lib/storage/channelMetadataRepository', () => ({
    channelMetadataRepository: hoisted.channelMetadataRepositoryMock,
}));

vi.mock('../../lib/storage/customEmojiImageMetaRepository', () => ({
    customEmojiImageMetaRepository: hoisted.customEmojiImageMetaRepositoryMock,
}));

vi.mock('../../lib/channelContextService', () => ({
    ChannelContextService: vi.fn(() => ({
        resolveChannelContext: vi.fn(),
        resolveChannelMetadata: vi.fn(),
    })),
}));

vi.mock('../../lib/customEmoji', async () => {
    const actual = await vi.importActual<typeof import('../../lib/customEmoji')>('../../lib/customEmoji');
    return {
        ...actual,
        preloadCustomEmojiImage: hoisted.customEmojiMock.preloadCustomEmojiImage,
        preloadCustomEmojiImageWithMeta: hoisted.customEmojiMock.preloadCustomEmojiImageWithMeta,
    };
});

vi.mock('../../lib/utils/clipboardUtils', () => hoisted.clipboardMock);

vi.mock('../../lib/postMediaCacheService', () => ({
    postMediaCacheService: hoisted.postMediaCacheServiceMock,
}));

import PostHistoryDialogComponent from '../../components/PostHistoryDialog.svelte';

export const PostHistoryDialog = PostHistoryDialogComponent;

export const PUBKEY_HEX = 'a'.repeat(64);

export function createRecord(overrides: Record<string, unknown> = {}) {
    return {
        id: 'event-1',
        eventId: 'b'.repeat(64),
        pubkeyHex: PUBKEY_HEX,
        kind: 1,
        content: '投稿本文',
        tags: [],
        createdAt: 1_700_000_000,
        postedAt: Date.UTC(2024, 0, 2, 3, 4, 0),
        relayHints: [],
        acceptedRelays: [],
        media: [],
        rawEvent: {},
        updatedAt: Date.UTC(2024, 0, 2, 3, 4, 0),
        schemaVersion: 2,
        ...overrides,
    };
}

export function createDeferred<T>() {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (reason?: unknown) => void;
    const promise = new Promise<T>((nextResolve, nextReject) => {
        resolve = nextResolve;
        reject = nextReject;
    });

    return {
        promise,
        resolve,
        reject,
    };
}

export function createRelayFetchResult(overrides: Record<string, unknown> = {}) {
    return {
        status: 'success',
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
        ...overrides,
    };
}

export async function openPostHistoryMenu(): Promise<void> {
    const trigger = await screen.findByRole('button', { name: '投稿履歴メニューを開く' });
    await fireEvent.click(trigger);
}

export async function openSearchBar(): Promise<HTMLInputElement> {
    await openPostHistoryMenu();
    await fireEvent.click(await screen.findByRole('menuitem', { name: '検索' }));
    return screen.findByRole('searchbox', { name: '検索' }) as Promise<HTMLInputElement>;
}

export async function clickMenuAction(name: string): Promise<void> {
    await openPostHistoryMenu();
    await fireEvent.click(await screen.findByRole('menuitem', { name }));
}

export function getHistoryContainer(): HTMLDivElement {
    const historyContainer = document.querySelector('.post-history-container');
    if (!(historyContainer instanceof HTMLDivElement)) {
        throw new Error('post-history-container が見つかりません');
    }

    return historyContainer;
}

export async function waitForSearchDebounce(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
}

export function resetPostHistoryDialogHarness(): void {
    clearPersistedPostHistoryListingSnapshots();
    clearPersistedPostHistoryViewState();
    vi.clearAllMocks();

    repositoryMock.getLatestVisibleChunk.mockResolvedValue([]);
    repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
    repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
    repositoryMock.getVisibleChunkFromCreatedAt.mockResolvedValue([]);
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
        promise: Promise.resolve(createRelayFetchResult({ status: 'cancelled' })),
        cancel: vi.fn(),
    });

    localSearchServiceMock.searchLocalPosts.mockResolvedValue({
        items: [],
        total: 0,
        hasNext: false,
    });
}

export function cleanupPostHistoryDialogHarness(): void {
    cleanup();
    clearPersistedPostHistoryListingSnapshots();
    clearPersistedPostHistoryViewState();
    vi.useRealTimers();
}

export {
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor,
};
