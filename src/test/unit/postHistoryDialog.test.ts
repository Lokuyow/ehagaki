import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/svelte';
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
        'postHistory.visibleCountSummary': `${options?.values?.total}件`,
        'postHistory.searchCountSummary': `${options?.values?.total}件`,
        'postHistory.loadOlder': 'さらに古い投稿を表示',
        'postHistory.loadNewer': '新しい投稿を表示',
        'postHistory.loadOlderSearchResults': 'さらに古い検索結果を表示',
        'postHistory.loadNewerSearchResults': '新しい検索結果を表示',
        'postHistory.returnToLatest': '最新へ戻る',
        'postHistory.jumpToOldest': '最古へ移動',
        'postHistory.jumpToDate': '日付へ移動',
        'postHistory.jumpToDateLabel': '日付',
        'postHistory.jumpToDateSubmit': 'この日付付近を表示',
        'postHistory.fetchOlderFromRelays': 'リレーから続きを取得',
        'postHistory.fetchUnfetchedFromRelays': '未取得の投稿を取得',
        'postHistory.empty': '投稿履歴はありません',
        'postHistory.syncing': 'リレーと同期中...',
        'postHistory.synced': 'リレーとの同期が完了しました',
        'postHistory.syncFailed': 'リレーから取得できませんでした',
        'postHistory.repair': '表示中の投稿付近を再取得',
        'postHistory.repairing': '再取得中...',
        'postHistory.repairAdded': `${options?.values?.count}件追加`,
        'postHistory.repairNoChanges': '追加なし',
        'postHistory.repairPartialFailure': '一部未確認',
        'postHistory.repairFetchFailed': '取得失敗',
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
        'postHistory.deleteLocalHistoryDescription': 'このアカウントのローカル履歴だけを削除します',
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
        'postHistory.showReplyTarget': '返信先を見る',
        'postHistory.hideReplyTarget': '返信先を隠す',
        'postHistory.replyTargetDeleted': '返信先削除済み',
        'postHistory.contextLoading': '関連投稿を読み込み中...',
        'postHistory.contextNotFound': '返信先が見つかりませんでした',
        'postHistory.contextFetchFailed': '関連投稿を取得できませんでした',
        'postHistory.contextRetry': '再試行',
        'postHistory.checkReplies': '返信を確認',
        'postHistory.checkingReplies': '返信を確認中',
        'postHistory.recheckReplies': '返信を再確認',
        'postHistory.showReplies': '返信を表示',
        'postHistory.showRepliesWithCount': `返信 ${options?.values?.count}件を表示`,
        'postHistory.hideReplies': '返信を隠す',
        'postHistory.repliesLoading': '返信を取得中...',
        'postHistory.repliesNotFound': 'この範囲では返信が見つかりませんでした',
        'postHistory.repliesFetchFailed': '返信を取得できませんでした',
        'postHistory.directReply': '返信',
        'postHistory.ownReply': '自分の返信',
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
    getByEventId: vi.fn(),
    getPage: vi.fn(),
    getVisiblePage: vi.fn(),
    getLatestVisibleChunk: vi.fn(),
    getOlderVisibleChunk: vi.fn(),
    getNewerVisibleChunk: vi.fn(),
    getVisibleChunkFromCreatedAt: vi.fn(),
    countForPubkey: vi.fn(),
    countVisibleForPubkey: vi.fn(),
    getOldestCreatedAt: vi.fn(),
    upsertFetchedEvents: vi.fn(),
    deleteForPubkey: vi.fn(),
}));

const replyEventsRepositoryMock = vi.hoisted(() => ({
    getDirectReplies: vi.fn(),
    upsertDirectReplies: vi.fn(),
    deleteByEventId: vi.fn(),
}));

const deletionRequestsRepositoryMock = vi.hoisted(() => ({
    getDeletedTargets: vi.fn(),
    upsertValidDeletionRequests: vi.fn(),
}));

const replyFetchServiceMock = vi.hoisted(() => ({
    fetchDirectReplies: vi.fn(),
}));

const contextFetchServiceMock = vi.hoisted(() => ({
    fetchEventById: vi.fn(),
}));

const deletionFetchServiceMock = vi.hoisted(() => ({
    fetchDeletionRequests: vi.fn(),
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
    locale: readable('ja'),
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

vi.mock('../../lib/hooks/usePostHistoryContext.svelte', () => ({
    usePostHistoryContext: vi.fn(() => {
        throw new Error('legacy usePostHistoryContext should not run in graph path');
    }),
}));

vi.mock('../../lib/hooks/usePostHistoryReplies.svelte', () => ({
    usePostHistoryReplies: vi.fn(() => {
        throw new Error('legacy usePostHistoryReplies should not run in graph path');
    }),
}));

vi.mock('../../lib/storage/postHistoryRepository', () => ({
    postHistoryRepository: repositoryMock,
}));

vi.mock('../../lib/storage/postHistoryReplyEventsRepository', () => ({
    postHistoryReplyEventsRepository: replyEventsRepositoryMock,
}));

vi.mock('../../lib/storage/postHistoryDeletionRequestsRepository', () => ({
    postHistoryDeletionRequestsRepository: deletionRequestsRepositoryMock,
}));

vi.mock('../../lib/postHistoryReplyFetchService', () => ({
    POST_HISTORY_DIRECT_REPLY_FETCH_LIMIT: 100,
    POST_HISTORY_DIRECT_REPLY_FETCH_LOOKBACK_SECONDS: 86_400,
    postHistoryReplyFetchService: replyFetchServiceMock,
}));

vi.mock('../../lib/postHistoryContextFetchService', () => ({
    postHistoryContextFetchService: contextFetchServiceMock,
}));

vi.mock('../../lib/postHistoryDeletionFetchService', () => ({
    postHistoryDeletionFetchService: deletionFetchServiceMock,
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
    POST_HISTORY_BOOTSTRAP_FETCH_LIMIT: 150,
    POST_HISTORY_BOOTSTRAP_FETCH_TIMEOUT_MS: 20_000,
    POST_HISTORY_DIALOG_OPEN_REFRESH_LIMIT: 30,
    POST_HISTORY_DIALOG_OPEN_REFRESH_TIMEOUT_MS: 6_000,
    POST_HISTORY_DIALOG_OPEN_REFRESH_TTL_MS: 60_000,
    POST_HISTORY_OLDER_FETCH_LIMIT: 150,
    POST_HISTORY_OLDER_FETCH_TIMEOUT_MS: 25_000,
    POST_HISTORY_PAGE_SIZE: 50,
    POST_HISTORY_REPAIR_FETCH_LIMIT: 250,
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
    ChannelContextService: vi.fn(function () { return channelContextServiceMock; }),
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

function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function createMockRect(top: number, height: number): DOMRect {
    return {
        x: 0,
        y: top,
        top,
        left: 0,
        right: 320,
        bottom: top + height,
        width: 320,
        height,
        toJSON: () => ({}),
    } as DOMRect;
}

function createReplyContextRecords() {
    const replyId = '2'.repeat(64);
    const rootId = '3'.repeat(64);
    const parentRecord = createRecord({
        eventId: replyId,
        pubkeyHex: 'd'.repeat(64),
        content: '返信先の投稿',
        rawEvent: {
            id: replyId,
            pubkey: 'd'.repeat(64),
            kind: 1,
            content: '返信先の投稿',
            tags: [],
            created_at: 1_699_999_000,
            sig: 'e'.repeat(128),
        },
    });
    const post = createRecord({
        eventId: '1'.repeat(64),
        rawEvent: {
            id: '1'.repeat(64),
            pubkey: 'a'.repeat(64),
            kind: 1,
            content: '自分の返信',
            tags: [
                ['e', rootId, 'wss://root.example.com/', 'root'],
                ['e', replyId, 'wss://reply.example.com/', 'reply'],
            ],
            created_at: 1_700_000_000,
            sig: 'c'.repeat(128),
        },
        content: '自分の返信',
        tags: [
            ['e', rootId, 'wss://root.example.com/', 'root'],
            ['e', replyId, 'wss://reply.example.com/', 'reply'],
        ],
    });

    return { parentRecord, post, replyId };
}

function createDirectReplyEventRecord(overrides: Record<string, any> = {}) {
    const parentEventId = '1'.repeat(64);
    const eventId = overrides.eventId ?? '4'.repeat(64);
    const authorPubkey = overrides.authorPubkey ?? 'd'.repeat(64);
    const rawEvent = overrides.rawEvent ?? {
        id: eventId,
        pubkey: authorPubkey,
        kind: 1,
        content: overrides.content ?? '他人からの返信',
        tags: [['e', parentEventId, 'wss://parent.example.com/', 'reply']],
        created_at: overrides.createdAt ?? 1_700_000_010,
        sig: 'f'.repeat(128),
    };

    return {
        id: eventId,
        eventId,
        parentEventId,
        authorPubkey,
        kind: 1,
        content: rawEvent.content,
        tags: rawEvent.tags,
        createdAt: rawEvent.created_at,
        relayUrls: ['wss://relay.example.com/'],
        discoveredAs: ['direct-reply'],
        rawEvent,
        fetchedAt: 1_700_000_020,
        updatedAt: 1_700_000_020,
        schemaVersion: 1,
        ...overrides,
    };
}

function createDeletionEvent(overrides: Record<string, any> = {}) {
    const targetEventId = overrides.targetEventId ?? '4'.repeat(64);
    const pubkey = overrides.pubkey ?? 'd'.repeat(64);
    return {
        id: overrides.id ?? '7'.repeat(64),
        pubkey,
        kind: 5,
        content: overrides.content ?? '',
        tags: overrides.tags ?? [['e', targetEventId], ['k', '1']],
        created_at: overrides.createdAt ?? 1_700_000_040,
        sig: overrides.sig ?? 'a'.repeat(128),
    };
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
    await fireEvent.click(await screen.findByRole('menuitem', { name: '検索' }));
    return screen.findByRole('searchbox', { name: '検索' }) as Promise<HTMLInputElement>;
}

async function toggleSearchFromMenu(): Promise<void> {
    await openPostHistoryMenu();
    await fireEvent.click(await screen.findByRole('menuitem', { name: '検索' }));
}

async function findRepairButton(): Promise<HTMLElement> {
    const existing = screen.queryByRole('menuitem', { name: /表示中の投稿付近を再取得|再取得中\.\.\./ });
    if (existing) {
        return existing as HTMLElement;
    }

    await openPostHistoryMenu();
    return screen.findByRole('menuitem', { name: /表示中の投稿付近を再取得|再取得中\.\.\./ }) as Promise<HTMLElement>;
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
        repositoryMock.getByEventId.mockResolvedValue(null);
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
        replyEventsRepositoryMock.getDirectReplies.mockResolvedValue([]);
        replyEventsRepositoryMock.upsertDirectReplies.mockResolvedValue({
            insertedCount: 0,
            updatedCount: 0,
            unchangedCount: 0,
            ignoredCount: 0,
        });
        replyEventsRepositoryMock.deleteByEventId.mockResolvedValue(undefined);
        deletionRequestsRepositoryMock.getDeletedTargets.mockResolvedValue(new Map());
        deletionRequestsRepositoryMock.upsertValidDeletionRequests.mockResolvedValue({
            insertedCount: 0,
            updatedCount: 0,
            unchangedCount: 0,
            ignoredCount: 0,
        });
        replyFetchServiceMock.fetchDirectReplies.mockReturnValue({
            promise: Promise.resolve({
                events: [],
                fetchedAt: 0,
                relayUrls: [],
            }),
            cancel: vi.fn(),
        });
        contextFetchServiceMock.fetchEventById.mockReturnValue({
            promise: Promise.resolve({
                event: null,
                relayUrl: null,
            }),
            cancel: vi.fn(),
        });
        deletionFetchServiceMock.fetchDeletionRequests.mockReturnValue({
            promise: Promise.resolve({
                events: [],
                fetchedAt: 0,
                relayUrls: [],
            }),
            cancel: vi.fn(),
        });
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

    it('[empty-history] 空の投稿履歴を表示する', async () => {
        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await waitFor(() => {
            expect(repositoryMock.countForPubkey).toHaveBeenCalledWith('a'.repeat(64));
            expect(repositoryMock.getLatestVisibleChunk).toHaveBeenCalledWith({
                pubkeyHex: 'a'.repeat(64),
                limit: 50,
                visibleUntil: null,
            });
            expect(screen.queryByRole('searchbox', { name: '検索' })).toBeNull();
            expect(screen.getByText('投稿履歴はありません')).toBeTruthy();
        });
    });

    it('[repair-menu-button] post-history-heading のメニュー内に repair button を表示する', async () => {
        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        const repairButton = await findRepairButton();
        const heading = document.body.querySelector('.post-history-heading');
        const headingActions = document.body.querySelector('.post-history-heading-actions');

        expect(heading).toBeTruthy();
        expect(headingActions?.textContent).not.toContain('表示中の投稿付近を再取得');
        expect(repairButton).toBeTruthy();
    });

    it('[reply-context] 履歴内の返信投稿の上に返信先を表示し、再表示時は取得済み event を再利用する', async () => {
        const { parentRecord, post, replyId } = createReplyContextRecords();

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getByEventId.mockImplementation(async (eventId: string) =>
            eventId === replyId ? parentRecord : null,
        );

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await fireEvent.click(await screen.findByRole('button', { name: '返信先を見る' }));
        expect(screen.queryByText('関連投稿を読み込み中...')).toBeNull();

        await waitFor(() => {
            expect(screen.getByText('返信先の投稿')).toBeTruthy();
        });

        const relatedContent = screen.getByText('返信先の投稿');
        const currentContent = screen.getByText('自分の返信');
        expect(
            relatedContent.compareDocumentPosition(currentContent) &
            Node.DOCUMENT_POSITION_FOLLOWING,
        ).toBeTruthy();
        expect(screen.queryByRole('button', { name: '会話の最初を見る' })).toBeNull();
        expect(screen.queryByRole('button', { name: '親投稿を見る' })).toBeNull();
        expect(repositoryMock.getByEventId).toHaveBeenCalledTimes(1);

        await fireEvent.click(await screen.findByRole('button', { name: '返信先を隠す' }));

        await waitFor(() => {
            expect(screen.queryByText('返信先の投稿')).toBeNull();
        });

        await fireEvent.click(await screen.findByRole('button', { name: '返信先を見る' }));
        expect(screen.queryByText('関連投稿を読み込み中...')).toBeNull();

        await waitFor(() => {
            expect(screen.getByText('返信先の投稿')).toBeTruthy();
        });
        expect(repositoryMock.getByEventId).toHaveBeenCalledTimes(1);
        expect(repositoryMock.upsertFetchedEvents).not.toHaveBeenCalled();
    });

    it('[reply-context-scroll] 返信先の展開と折りたたみで起点投稿の表示位置を維持する', async () => {
        const { parentRecord, post, replyId } = createReplyContextRecords();

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getByEventId.mockImplementation(async (eventId: string) =>
            eventId === replyId ? parentRecord : null,
        );

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await screen.findByText('自分の返信');
        const historyContainer = document.querySelector('.post-history-container') as HTMLDivElement;
        historyContainer.scrollTop = 100;
        const getBoundingClientRectSpy = vi
            .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
            .mockImplementation(function (this: HTMLElement) {
                if (this.classList.contains('post-history-container')) {
                    return createMockRect(0, 600);
                }

                if (
                    this.dataset.postHistoryThreadAnchorScopeId === post.eventId &&
                    this.dataset.postHistoryThreadAnchorEventId === post.eventId
                ) {
                    const hasParent = screen.queryByText('返信先の投稿') !== null;
                    const scrollOffset = historyContainer.scrollTop - 100;
                    return createMockRect((hasParent ? 260 : 160) - scrollOffset, 80);
                }

                return createMockRect(0, 0);
            });

        await fireEvent.click(await screen.findByRole('button', { name: '返信先を見る' }));
        await waitFor(() => {
            expect(screen.getByText('返信先の投稿')).toBeTruthy();
            expect(historyContainer.scrollTop).toBe(200);
        });

        await fireEvent.click(await screen.findByRole('button', { name: '返信先を隠す' }));
        await waitFor(() => {
            expect(screen.queryByText('返信先の投稿')).toBeNull();
            expect(historyContainer.scrollTop).toBe(100);
        });

        getBoundingClientRectSpy.mockRestore();
    });

    it('[reply-context-nip09] 既存tombstoneがある返信先は削除済みラベルを表示しparent cardを表示しない', async () => {
        const { parentRecord, post, replyId } = createReplyContextRecords();
        const deletedTargets = new Map<string, Set<string>>([
            [parentRecord.pubkeyHex, new Set([replyId])],
        ]);

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getByEventId.mockImplementation(async (eventId: string) =>
            eventId === replyId ? parentRecord : null,
        );
        deletionRequestsRepositoryMock.getDeletedTargets.mockResolvedValue(deletedTargets);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await fireEvent.click(await screen.findByRole('button', { name: '返信先を見る' }));

        await waitFor(() => {
            expect(screen.queryByText('返信先の投稿')).toBeNull();
            expect(screen.getByText('返信先削除済み')).toBeTruthy();
        });
        expect(screen.queryByText('返信先が見つかりませんでした')).toBeNull();
        expect(screen.queryByRole('button', { name: '返信先削除済み' })).toBeNull();
        expect(screen.queryByRole('button', { name: '返信先を隠す' })).toBeNull();
        expect(deletionFetchServiceMock.fetchDeletionRequests).not.toHaveBeenCalled();
        expect(repositoryMock.upsertFetchedEvents).not.toHaveBeenCalled();
    });

    it('[reply-context-nip09] postHistory側で削除済みの返信先は削除済みラベルを表示する', async () => {
        const { parentRecord, post, replyId } = createReplyContextRecords();
        const deletedParentRecord = {
            ...parentRecord,
            deletedAt: 1_700_000_100,
            deletionEventId: 'delete-event-id',
        };

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getByEventId.mockImplementation(async (eventId: string) =>
            eventId === replyId ? deletedParentRecord : null,
        );

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await fireEvent.click(await screen.findByRole('button', { name: '返信先を見る' }));

        await waitFor(() => {
            expect(screen.queryByText('返信先の投稿')).toBeNull();
            expect(screen.getByText('返信先削除済み')).toBeTruthy();
        });
        expect(deletionFetchServiceMock.fetchDeletionRequests).not.toHaveBeenCalled();
        expect(repositoryMock.upsertFetchedEvents).not.toHaveBeenCalled();
    });

    it('[reply-context-nip09] cached parentNodeが既存tombstoneに一致する場合は再表示せず削除済みにする', async () => {
        const { parentRecord, post, replyId } = createReplyContextRecords();
        const deletedTargets = new Map<string, Set<string>>();

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getByEventId.mockResolvedValue(null);
        deletionRequestsRepositoryMock.getDeletedTargets.mockImplementation(async () => deletedTargets);
        contextFetchServiceMock.fetchEventById.mockReturnValue({
            promise: Promise.resolve({
                event: parentRecord.rawEvent,
                relayUrl: 'wss://relay.example.com/',
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

        await fireEvent.click(await screen.findByRole('button', { name: '返信先を見る' }));
        await waitFor(() => {
            expect(screen.getByText('返信先の投稿')).toBeTruthy();
        });

        await fireEvent.click(await screen.findByRole('button', { name: '返信先を隠す' }));
        await waitFor(() => {
            expect(screen.queryByText('返信先の投稿')).toBeNull();
        });

        deletedTargets.set(parentRecord.pubkeyHex, new Set([replyId]));
        await fireEvent.click(await screen.findByRole('button', { name: '返信先を見る' }));

        await waitFor(() => {
            expect(screen.queryByText('返信先の投稿')).toBeNull();
            expect(screen.getByText('返信先削除済み')).toBeTruthy();
        });
        expect(contextFetchServiceMock.fetchEventById).toHaveBeenCalledTimes(1);
    });

    it('[reply-context-nip09] cached parentNodeにvalid kind:5が後から見つかる場合は削除済みにする', async () => {
        const { parentRecord, post, replyId } = createReplyContextRecords();
        const deletedTargets = new Map<string, Set<string>>();
        let deletionFetchReturnsDeletion = false;

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getByEventId.mockResolvedValue(null);
        deletionRequestsRepositoryMock.getDeletedTargets.mockImplementation(async () => deletedTargets);
        deletionRequestsRepositoryMock.upsertValidDeletionRequests.mockImplementation(async ({ targetEvents, deletionEvents }: any) => {
            for (const item of deletionEvents) {
                for (const targetEvent of targetEvents) {
                    const hasTargetTag = item.event.tags.some((tag: string[]) =>
                        tag[0] === 'e' && tag[1] === targetEvent.id,
                    );
                    if (item.event.kind === 5 && item.event.pubkey === targetEvent.pubkey && hasTargetTag) {
                        const eventIds = deletedTargets.get(targetEvent.pubkey) ?? new Set<string>();
                        eventIds.add(targetEvent.id);
                        deletedTargets.set(targetEvent.pubkey, eventIds);
                    }
                }
            }
            return {
                insertedCount: deletionEvents.length,
                updatedCount: 0,
                unchangedCount: 0,
                ignoredCount: 0,
            };
        });
        contextFetchServiceMock.fetchEventById.mockReturnValue({
            promise: Promise.resolve({
                event: parentRecord.rawEvent,
                relayUrl: 'wss://relay.example.com/',
            }),
            cancel: vi.fn(),
        });
        deletionFetchServiceMock.fetchDeletionRequests.mockImplementation(() => ({
            promise: Promise.resolve({
                events: deletionFetchReturnsDeletion
                    ? [{
                        event: createDeletionEvent({
                            targetEventId: replyId,
                            pubkey: parentRecord.pubkeyHex,
                        }),
                        relayUrls: ['wss://relay.example.com/'],
                    }]
                    : [],
                fetchedAt: 1_700_000_050,
                relayUrls: ['wss://relay.example.com/'],
            }),
            cancel: vi.fn(),
        }));

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await fireEvent.click(await screen.findByRole('button', { name: '返信先を見る' }));
        await waitFor(() => {
            expect(screen.getByText('返信先の投稿')).toBeTruthy();
        });

        await fireEvent.click(await screen.findByRole('button', { name: '返信先を隠す' }));
        await waitFor(() => {
            expect(screen.queryByText('返信先の投稿')).toBeNull();
        });

        deletionFetchReturnsDeletion = true;
        await fireEvent.click(await screen.findByRole('button', { name: '返信先を見る' }));

        await waitFor(() => {
            expect(screen.queryByText('返信先の投稿')).toBeNull();
            expect(screen.getByText('返信先削除済み')).toBeTruthy();
        });
        expect(contextFetchServiceMock.fetchEventById).toHaveBeenCalledTimes(1);
        expect(deletionRequestsRepositoryMock.upsertValidDeletionRequests).toHaveBeenCalledWith(expect.objectContaining({
            targetEvents: [parentRecord.rawEvent],
            deletionEvents: [expect.objectContaining({
                event: expect.objectContaining({ kind: 5, pubkey: parentRecord.pubkeyHex }),
            })],
        }));
    });

    it('[reply-context-delete] 表示中の返信先が削除成功扱いになるとparent cardを消して削除済みラベルを表示する', async () => {
        const { parentRecord, post, replyId } = createReplyContextRecords();
        const ownParentRecord = {
            ...parentRecord,
            pubkeyHex: 'a'.repeat(64),
            content: '削除対象返信先',
            rawEvent: {
                ...parentRecord.rawEvent,
                pubkey: 'a'.repeat(64),
                content: '削除対象返信先',
            },
        };

        repositoryMock.getPage.mockResolvedValue([ownParentRecord, post]);
        repositoryMock.countForPubkey.mockResolvedValue(2);
        repositoryMock.getByEventId.mockImplementation(async (eventId: string) =>
            eventId === replyId ? ownParentRecord : null,
        );
        postDeletionServiceMock.requestDeletion.mockResolvedValue({
            success: true,
            eventId: 'delete-event-id',
            deletionEventId: 'delete-event-id',
            deletedAt: 1_700_000_100,
            deletionEvent: createDeletionEvent({
                targetEventId: replyId,
                pubkey: ownParentRecord.pubkeyHex,
            }),
        });

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onReplyPost: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await screen.findByText('自分の返信');
        const replyHistoryItem = document.querySelector(`[data-post-history-event-id="${post.eventId}"]`);
        expect(replyHistoryItem).toBeTruthy();
        const replyQueries = within(replyHistoryItem as HTMLElement);

        await fireEvent.click(await replyQueries.findByRole('button', { name: '返信先を見る' }));
        await waitFor(() => {
            expect(replyQueries.getByText('削除対象返信先')).toBeTruthy();
        });

        const parentHistoryItem = document.querySelector(`[data-post-history-event-id="${replyId}"]`);
        expect(parentHistoryItem).toBeTruthy();
        await fireEvent.click(within(parentHistoryItem as HTMLElement).getByRole('button', { name: 'アクションを表示' }));
        await fireEvent.click(await screen.findByRole('menuitem', { name: '削除' }));
        await fireEvent.click(await screen.findByRole('button', { name: '送信' }));

        await waitFor(() => {
            expect(replyQueries.queryByText('削除対象返信先')).toBeNull();
            expect(replyQueries.getByText('返信先削除済み')).toBeTruthy();
        });
        expect(repositoryMock.upsertFetchedEvents).not.toHaveBeenCalled();
    });

    it('[reply-context-nip09] pubkey不一致のkind:5は返信先を削除済み扱いにしない', async () => {
        const { parentRecord, post, replyId } = createReplyContextRecords();

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getByEventId.mockImplementation(async (eventId: string) =>
            eventId === replyId ? parentRecord : null,
        );
        deletionFetchServiceMock.fetchDeletionRequests.mockReturnValue({
            promise: Promise.resolve({
                events: [{
                    event: createDeletionEvent({
                        targetEventId: replyId,
                        pubkey: '9'.repeat(64),
                    }),
                    relayUrls: ['wss://relay.example.com/'],
                }],
                fetchedAt: 1_700_000_050,
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

        await fireEvent.click(await screen.findByRole('button', { name: '返信先を見る' }));

        await waitFor(() => {
            expect(screen.getByText('返信先の投稿')).toBeTruthy();
        });
        expect(screen.queryByText('返信先削除済み')).toBeNull();
        expect(screen.getByRole('button', { name: '返信先を隠す' })).toBeTruthy();
        expect(deletionRequestsRepositoryMock.upsertValidDeletionRequests).toHaveBeenCalled();
    });

    it('[reply-context-nip09] network取得した返信先にvalid kind:5があれば保存して表示しない', async () => {
        const { parentRecord, post, replyId } = createReplyContextRecords();
        const deletedTargets = new Map<string, Set<string>>();

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getByEventId.mockResolvedValue(null);
        deletionRequestsRepositoryMock.getDeletedTargets.mockImplementation(async () => deletedTargets);
        deletionRequestsRepositoryMock.upsertValidDeletionRequests.mockImplementation(async ({ targetEvents, deletionEvents }: any) => {
            for (const item of deletionEvents) {
                for (const targetEvent of targetEvents) {
                    const hasTargetTag = item.event.tags.some((tag: string[]) =>
                        tag[0] === 'e' && tag[1] === targetEvent.id,
                    );
                    if (item.event.kind === 5 && item.event.pubkey === targetEvent.pubkey && hasTargetTag) {
                        const eventIds = deletedTargets.get(targetEvent.pubkey) ?? new Set<string>();
                        eventIds.add(targetEvent.id);
                        deletedTargets.set(targetEvent.pubkey, eventIds);
                    }
                }
            }
            return {
                insertedCount: 1,
                updatedCount: 0,
                unchangedCount: 0,
                ignoredCount: 0,
            };
        });
        contextFetchServiceMock.fetchEventById.mockReturnValue({
            promise: Promise.resolve({
                event: parentRecord.rawEvent,
                relayUrl: 'wss://relay.example.com/',
            }),
            cancel: vi.fn(),
        });
        deletionFetchServiceMock.fetchDeletionRequests.mockReturnValue({
            promise: Promise.resolve({
                events: [{
                    event: createDeletionEvent({
                        targetEventId: replyId,
                        pubkey: parentRecord.pubkeyHex,
                    }),
                    relayUrls: ['wss://relay.example.com/'],
                }],
                fetchedAt: 1_700_000_050,
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

        await fireEvent.click(await screen.findByRole('button', { name: '返信先を見る' }));

        await waitFor(() => {
            expect(screen.queryByText('返信先の投稿')).toBeNull();
            expect(screen.getByText('返信先削除済み')).toBeTruthy();
        });
        expect(screen.queryByText('返信先が見つかりませんでした')).toBeNull();
        expect(screen.queryByRole('button', { name: '返信先削除済み' })).toBeNull();
        expect(screen.queryByRole('button', { name: '返信先を隠す' })).toBeNull();
        expect(contextFetchServiceMock.fetchEventById).toHaveBeenCalled();
        expect(deletionRequestsRepositoryMock.upsertValidDeletionRequests).toHaveBeenCalledWith(expect.objectContaining({
            targetEvents: [parentRecord.rawEvent],
            deletionEvents: [expect.objectContaining({
                event: expect.objectContaining({ kind: 5, pubkey: parentRecord.pubkeyHex }),
            })],
        }));
        expect(repositoryMock.upsertFetchedEvents).not.toHaveBeenCalled();
    });

    it('[reply-context-nip09] 取得失敗時は返信先削除済みと誤表示しない', async () => {
        const { post } = createReplyContextRecords();

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getByEventId.mockResolvedValue(null);
        contextFetchServiceMock.fetchEventById.mockReturnValue({
            promise: Promise.resolve({
                event: null,
                relayUrl: null,
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

        await fireEvent.click(await screen.findByRole('button', { name: '返信先を見る' }));

        await waitFor(() => {
            expect(screen.getByText('返信先が見つかりませんでした')).toBeTruthy();
        });
        expect(screen.queryByText('返信先削除済み')).toBeNull();
        expect(screen.getByRole('button', { name: '返信先を隠す' })).toBeTruthy();
    });

    it('[reply-context-loading] 400ms以内に返信先を解決できた場合はローダーを表示しない', async () => {
        const { parentRecord, post, replyId } = createReplyContextRecords();
        const deferredRecord = createDeferred<any>();
        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getByEventId.mockImplementation((eventId: string) =>
            eventId === replyId ? deferredRecord.promise : Promise.resolve(null),
        );

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await fireEvent.click(await screen.findByRole('button', { name: '返信先を見る' }));

        expect(screen.queryByText('関連投稿を読み込み中...')).toBeNull();
        await wait(350);
        expect(screen.queryByText('関連投稿を読み込み中...')).toBeNull();

        deferredRecord.resolve(parentRecord);
        await waitFor(() => {
            expect(screen.getByText('返信先の投稿')).toBeTruthy();
        });

        await wait(80);
        expect(screen.queryByText('関連投稿を読み込み中...')).toBeNull();
    });

    it('[reply-context-loading] 400msを超えても取得中の場合だけローダーを表示する', async () => {
        const { parentRecord, post, replyId } = createReplyContextRecords();
        const deferredRecord = createDeferred<any>();
        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getByEventId.mockImplementation((eventId: string) =>
            eventId === replyId ? deferredRecord.promise : Promise.resolve(null),
        );

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await fireEvent.click(await screen.findByRole('button', { name: '返信先を見る' }));

        await wait(350);
        expect(screen.queryByText('関連投稿を読み込み中...')).toBeNull();

        await wait(80);
        expect(screen.getByText('関連投稿を読み込み中...')).toBeTruthy();

        deferredRecord.resolve(parentRecord);
        await waitFor(() => {
            expect(screen.getByText('返信先の投稿')).toBeTruthy();
        });
        expect(screen.queryByText('関連投稿を読み込み中...')).toBeNull();
    });

    it('[reply-context-loading] loading中に閉じるとtimerを消し、完了後の再表示はローダーなしでeventを再利用する', async () => {
        const { parentRecord, post, replyId } = createReplyContextRecords();
        const deferredRecord = createDeferred<any>();
        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getByEventId.mockImplementation((eventId: string) =>
            eventId === replyId ? deferredRecord.promise : Promise.resolve(null),
        );

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await fireEvent.click(await screen.findByRole('button', { name: '返信先を見る' }));
        await wait(350);
        await fireEvent.click(await screen.findByRole('button', { name: '返信先を隠す' }));

        await wait(120);
        expect(screen.queryByText('関連投稿を読み込み中...')).toBeNull();

        deferredRecord.resolve(parentRecord);
        await waitFor(() => {
            expect(screen.queryByText('返信先の投稿')).toBeNull();
        });
        expect(repositoryMock.getByEventId).toHaveBeenCalledTimes(1);

        await fireEvent.click(await screen.findByRole('button', { name: '返信先を見る' }));
        expect(screen.queryByText('関連投稿を読み込み中...')).toBeNull();
        await waitFor(() => {
            expect(screen.getByText('返信先の投稿')).toBeTruthy();
        });
        expect(repositoryMock.getByEventId).toHaveBeenCalledTimes(1);
    });

    it('[reply-context-loading] dialog close時にtimerとvisual loading stateをcleanupする', async () => {
        const { post, replyId } = createReplyContextRecords();
        const deferredRecord = createDeferred<any>();
        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getByEventId.mockImplementation((eventId: string) =>
            eventId === replyId ? deferredRecord.promise : Promise.resolve(null),
        );

        const { rerender } = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await fireEvent.click(await screen.findByRole('button', { name: '返信先を見る' }));
        await wait(350);

        await rerender({
            show: false,
            onClose: vi.fn(),
            pubkeyHex: 'a'.repeat(64),
        });
        await wait(120);

        expect(screen.queryByText('関連投稿を読み込み中...')).toBeNull();
        expect(screen.queryByText('返信先の投稿')).toBeNull();
    });

    it('[thread-graph-parent] 関連イベントからさらに返信先を1段ずつ展開できる', async () => {
        const parentEventId = '2'.repeat(64);
        const grandParentEventId = '5'.repeat(64);
        const post = createRecord({
            eventId: '1'.repeat(64),
            rawEvent: {
                id: '1'.repeat(64),
                pubkey: 'a'.repeat(64),
                kind: 1,
                content: '自分の返信',
                tags: [['e', parentEventId, 'wss://parent.example.com/', 'reply']],
                created_at: 1_700_000_000,
                sig: 'c'.repeat(128),
            },
            content: '自分の返信',
            tags: [['e', parentEventId, 'wss://parent.example.com/', 'reply']],
            media: [],
        });
        const parentEvent = {
            id: parentEventId,
            pubkey: 'd'.repeat(64),
            kind: 1,
            content: '他人の返信先',
            tags: [['e', grandParentEventId, 'wss://grand.example.com/', 'reply']],
            created_at: 1_699_999_000,
            sig: 'e'.repeat(128),
        };
        const grandParentEvent = {
            id: grandParentEventId,
            pubkey: 'e'.repeat(64),
            kind: 1,
            content: '返信先のさらに返信先',
            tags: [],
            created_at: 1_699_998_000,
            sig: 'f'.repeat(128),
        };

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getByEventId.mockResolvedValue(null);
        contextFetchServiceMock.fetchEventById.mockImplementation((_rxNostr: any, params: any) => ({
            promise: Promise.resolve({
                event: params.eventId === parentEventId ? parentEvent : grandParentEvent,
                relayUrl: 'wss://relay.example.com/',
            }),
            cancel: vi.fn(),
        }));

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await fireEvent.click(await screen.findByRole('button', { name: '返信先を見る' }));
        await waitFor(() => {
            expect(screen.getByText('他人の返信先')).toBeTruthy();
        });

        await fireEvent.click(screen.getByRole('button', { name: '返信先を見る' }));
        await waitFor(() => {
            expect(screen.getByText('返信先のさらに返信先')).toBeTruthy();
        });
        expect(contextFetchServiceMock.fetchEventById).toHaveBeenCalledTimes(2);
        expect(repositoryMock.upsertFetchedEvents).not.toHaveBeenCalled();
    });

    it('[thread-graph-parent-scroll] 関連node内の返信先展開で起点nodeの表示位置を維持する', async () => {
        const parentEventId = '2'.repeat(64);
        const grandParentEventId = '5'.repeat(64);
        const post = createRecord({
            eventId: '1'.repeat(64),
            rawEvent: {
                id: '1'.repeat(64),
                pubkey: 'a'.repeat(64),
                kind: 1,
                content: '自分の返信',
                tags: [['e', parentEventId, 'wss://parent.example.com/', 'reply']],
                created_at: 1_700_000_000,
                sig: 'c'.repeat(128),
            },
            content: '自分の返信',
            tags: [['e', parentEventId, 'wss://parent.example.com/', 'reply']],
            media: [],
        });
        const parentEvent = {
            id: parentEventId,
            pubkey: 'd'.repeat(64),
            kind: 1,
            content: '他人の返信先',
            tags: [['e', grandParentEventId, 'wss://grand.example.com/', 'reply']],
            created_at: 1_699_999_000,
            sig: 'e'.repeat(128),
        };
        const grandParentEvent = {
            id: grandParentEventId,
            pubkey: 'e'.repeat(64),
            kind: 1,
            content: '返信先のさらに返信先',
            tags: [],
            created_at: 1_699_998_000,
            sig: 'f'.repeat(128),
        };

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getByEventId.mockResolvedValue(null);
        contextFetchServiceMock.fetchEventById.mockImplementation((_rxNostr: any, params: any) => ({
            promise: Promise.resolve({
                event: params.eventId === parentEventId ? parentEvent : grandParentEvent,
                relayUrl: 'wss://relay.example.com/',
            }),
            cancel: vi.fn(),
        }));

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await fireEvent.click(await screen.findByRole('button', { name: '返信先を見る' }));
        await waitFor(() => {
            expect(screen.getByText('他人の返信先')).toBeTruthy();
        });

        const historyContainer = document.querySelector('.post-history-container') as HTMLDivElement;
        historyContainer.scrollTop = 100;
        const getBoundingClientRectSpy = vi
            .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
            .mockImplementation(function (this: HTMLElement) {
                if (this.classList.contains('post-history-container')) {
                    return createMockRect(0, 600);
                }

                if (
                    this.dataset.postHistoryThreadAnchorScopeId === post.eventId &&
                    this.dataset.postHistoryThreadAnchorEventId === parentEventId
                ) {
                    const hasGrandParent = screen.queryByText('返信先のさらに返信先') !== null;
                    const scrollOffset = historyContainer.scrollTop - 100;
                    return createMockRect((hasGrandParent ? 320 : 220) - scrollOffset, 80);
                }

                return createMockRect(0, 0);
            });

        await fireEvent.click(screen.getByRole('button', { name: '返信先を見る' }));
        await waitFor(() => {
            expect(screen.getByText('返信先のさらに返信先')).toBeTruthy();
            expect(historyContainer.scrollTop).toBe(200);
        });

        getBoundingClientRectSpy.mockRestore();
    });

    it('[thread-graph-dedupe] 同じ関連eventに複数経路で到達しても一度だけ表示する', async () => {
        const parentEventId = '2'.repeat(64);
        const post = createRecord({
            eventId: '1'.repeat(64),
            rawEvent: {
                id: '1'.repeat(64),
                pubkey: 'a'.repeat(64),
                kind: 1,
                content: '自分の返信',
                tags: [['e', parentEventId, 'wss://parent.example.com/', 'reply']],
                created_at: 1_700_000_000,
                sig: 'c'.repeat(128),
            },
            content: '自分の返信',
            tags: [['e', parentEventId, 'wss://parent.example.com/', 'reply']],
            media: [],
        });
        const parentEvent = {
            id: parentEventId,
            pubkey: 'd'.repeat(64),
            kind: 1,
            content: '循環する関連投稿B',
            tags: [['e', post.eventId, 'wss://anchor.example.com/', 'reply']],
            created_at: 1_699_999_000,
            sig: 'e'.repeat(128),
        };
        const parentReplyRecord = createDirectReplyEventRecord({
            eventId: parentEventId,
            parentEventId: post.eventId,
            content: '循環する関連投稿B',
            rawEvent: parentEvent,
        });
        const storedRepliesByParent = new Map<string, any[]>();

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getByEventId.mockResolvedValue(null);
        contextFetchServiceMock.fetchEventById.mockImplementation((_rxNostr: any, params: any) => ({
            promise: Promise.resolve({
                event: params.eventId === parentEventId ? parentEvent : post.rawEvent,
                relayUrl: 'wss://relay.example.com/',
            }),
            cancel: vi.fn(),
        }));
        replyEventsRepositoryMock.getDirectReplies.mockImplementation(async (parentId: string) =>
            storedRepliesByParent.get(parentId) ?? [],
        );
        replyEventsRepositoryMock.upsertDirectReplies.mockImplementation(async ({ parentEventId, events }: any) => {
            storedRepliesByParent.set(parentEventId, events.map(() => parentReplyRecord));
            return {
                insertedCount: events.length,
                updatedCount: 0,
                unchangedCount: 0,
                ignoredCount: 0,
            };
        });
        replyFetchServiceMock.fetchDirectReplies.mockReturnValue({
            promise: Promise.resolve({
                events: [{ event: parentEvent, relayUrls: ['wss://relay.example.com/'] }],
                fetchedAt: 1_700_000_030,
                relayUrls: ['wss://relay.example.com/'],
            }),
            cancel: vi.fn(),
        });

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onReplyPost: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await fireEvent.click(await screen.findByRole('button', { name: '返信先を見る' }));
        await waitFor(() => {
            expect(screen.getByText('循環する関連投稿B')).toBeTruthy();
        });

        const historyItem = document.querySelector(`[data-post-history-event-id="${post.eventId}"]`);
        expect(historyItem).toBeTruthy();
        const footer = (historyItem as HTMLElement).querySelector('.post-preview-footer');
        expect(footer).toBeTruthy();
        await fireEvent.click(within(footer as HTMLElement).getByRole('button', { name: '返信を確認' }));
        await waitFor(() => {
            expect(replyFetchServiceMock.fetchDirectReplies).toHaveBeenCalled();
        });
        expect(screen.getAllByText('循環する関連投稿B')).toHaveLength(1);
        expect(screen.getAllByText('自分の返信')).toHaveLength(1);
        expect(repositoryMock.upsertFetchedEvents).not.toHaveBeenCalled();
    });

    it('[thread-graph-children] 関連返信イベントからさらにdirect repliesを確認できる', async () => {
        const parentEventId = '1'.repeat(64);
        const replyBEventId = '4'.repeat(64);
        const replyCEventId = '6'.repeat(64);
        const replyDEventId = '8'.repeat(64);
        const post = createRecord({
            eventId: parentEventId,
            rawEvent: {
                id: parentEventId,
                pubkey: 'a'.repeat(64),
                kind: 1,
                content: '親投稿A',
                tags: [],
                created_at: 1_700_000_000,
                sig: 'c'.repeat(128),
            },
            content: '親投稿A',
            tags: [],
            media: [],
        });
        const replyB = createDirectReplyEventRecord({
            eventId: replyBEventId,
            parentEventId,
            content: '他人からの返信B',
            rawEvent: {
                id: replyBEventId,
                pubkey: 'd'.repeat(64),
                kind: 1,
                content: '他人からの返信B',
                tags: [['e', parentEventId, 'wss://parent.example.com/', 'reply']],
                created_at: 1_700_000_010,
                sig: 'f'.repeat(128),
            },
        });
        const replyC = createDirectReplyEventRecord({
            eventId: replyCEventId,
            parentEventId: replyBEventId,
            authorPubkey: 'e'.repeat(64),
            content: '返信Bへの返信C',
            rawEvent: {
                id: replyCEventId,
                pubkey: 'e'.repeat(64),
                kind: 1,
                content: '返信Bへの返信C',
                tags: [['e', replyBEventId, 'wss://reply.example.com/', 'reply']],
                created_at: 1_700_000_020,
                sig: 'b'.repeat(128),
            },
        });
        const replyD = createDirectReplyEventRecord({
            eventId: replyDEventId,
            parentEventId,
            authorPubkey: 'f'.repeat(64),
            content: '子返信なしD',
            rawEvent: {
                id: replyDEventId,
                pubkey: 'f'.repeat(64),
                kind: 1,
                content: '子返信なしD',
                tags: [['e', parentEventId, 'wss://parent.example.com/', 'reply']],
                created_at: 1_700_000_015,
                sig: 'd'.repeat(128),
            },
        });
        const storedRepliesByParent = new Map<string, any[]>();

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        replyEventsRepositoryMock.getDirectReplies.mockImplementation(async (parentId: string) =>
            storedRepliesByParent.get(parentId) ?? [],
        );
        replyEventsRepositoryMock.upsertDirectReplies.mockImplementation(async ({ parentEventId, events }: any) => {
            storedRepliesByParent.set(parentEventId, events.map((item: any) =>
                item.event.id === replyBEventId
                    ? replyB
                    : item.event.id === replyDEventId
                        ? replyD
                        : replyC,
            ));
            return {
                insertedCount: events.length,
                updatedCount: 0,
                unchangedCount: 0,
                ignoredCount: 0,
            };
        });
        replyFetchServiceMock.fetchDirectReplies.mockImplementation((_rxNostr: any, params: any) => ({
            promise: Promise.resolve({
                events: params.eventId === parentEventId
                    ? [
                        { event: replyB.rawEvent, relayUrls: ['wss://relay.example.com/'] },
                        { event: replyD.rawEvent, relayUrls: ['wss://relay.example.com/'] },
                    ]
                    : params.eventId === replyBEventId
                        ? [{ event: replyC.rawEvent, relayUrls: ['wss://relay.example.com/'] }]
                        : [],
                fetchedAt: 1_700_000_030,
                relayUrls: ['wss://relay.example.com/'],
            }),
            cancel: vi.fn(),
        }));

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onReplyPost: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await fireEvent.click(await screen.findByRole('button', { name: '返信を確認' }));
        await waitFor(() => {
            expect(screen.getByText('他人からの返信B')).toBeTruthy();
            expect(screen.getByText('子返信なしD')).toBeTruthy();
        });
        expect(screen.queryByRole('button', { name: '返信先を見る' })).toBeNull();
        await waitFor(() => {
            expect(screen.getByRole('button', { name: '返信 1件を表示' })).toBeTruthy();
        });
        expect(
            within(screen.getByRole('button', { name: '返信 1件を表示' }))
                .getByText('1'),
        ).toBeTruthy();
        expect(
            within(screen.getByRole('button', { name: '返信 1件を表示' }))
                .getByText('1')
                .closest('.post-preview-replies-icon-wrapper'),
        ).toBeTruthy();
        expect(screen.queryByText('返信Bへの返信C')).toBeNull();
        expect(
            Array.from(document.querySelectorAll('.post-preview-replies-count'))
                .map((element) => element.textContent),
        ).not.toContain('0');

        await fireEvent.click(screen.getByRole('button', { name: '返信 1件を表示' }));
        await waitFor(() => {
            expect(screen.getByText('返信Bへの返信C')).toBeTruthy();
        });
        expect(replyFetchServiceMock.fetchDirectReplies).toHaveBeenCalledTimes(2);
        expect(repositoryMock.upsertFetchedEvents).not.toHaveBeenCalled();
    });

    it('[thread-graph-children-prefetch] cache済み子返信countをnetworkより先にbadgeへ反映する', async () => {
        const parentEventId = '1'.repeat(64);
        const replyBEventId = '4'.repeat(64);
        const replyCEventId = '6'.repeat(64);
        const post = createRecord({
            eventId: parentEventId,
            rawEvent: {
                id: parentEventId,
                pubkey: 'a'.repeat(64),
                kind: 1,
                content: '親投稿A',
                tags: [],
                created_at: 1_700_000_000,
                sig: 'c'.repeat(128),
            },
            content: '親投稿A',
            tags: [],
            media: [],
        });
        const replyB = createDirectReplyEventRecord({
            eventId: replyBEventId,
            parentEventId,
            content: '他人からの返信B',
            rawEvent: {
                id: replyBEventId,
                pubkey: 'd'.repeat(64),
                kind: 1,
                content: '他人からの返信B',
                tags: [['e', parentEventId, 'wss://parent.example.com/', 'reply']],
                created_at: 1_700_000_010,
                sig: 'f'.repeat(128),
            },
        });
        const cachedReplyC = createDirectReplyEventRecord({
            eventId: replyCEventId,
            parentEventId: replyBEventId,
            authorPubkey: 'e'.repeat(64),
            content: 'cache済み孫返信C',
            rawEvent: {
                id: replyCEventId,
                pubkey: 'e'.repeat(64),
                kind: 1,
                content: 'cache済み孫返信C',
                tags: [['e', replyBEventId, 'wss://reply.example.com/', 'reply']],
                created_at: 1_700_000_020,
                sig: 'b'.repeat(128),
            },
        });
        const storedRepliesByParent = new Map<string, any[]>([
            [replyBEventId, [cachedReplyC]],
        ]);

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        replyEventsRepositoryMock.getDirectReplies.mockImplementation(async (parentId: string) =>
            storedRepliesByParent.get(parentId) ?? [],
        );
        replyEventsRepositoryMock.upsertDirectReplies.mockImplementation(async ({ parentEventId, events }: any) => {
            storedRepliesByParent.set(parentEventId, events.map((item: any) =>
                item.event.id === replyBEventId ? replyB : cachedReplyC,
            ));
            return {
                insertedCount: events.length,
                updatedCount: 0,
                unchangedCount: 0,
                ignoredCount: 0,
            };
        });
        replyFetchServiceMock.fetchDirectReplies.mockImplementation((_rxNostr: any, params: any) => ({
            promise: Promise.resolve({
                events: params.eventId === parentEventId
                    ? [{ event: replyB.rawEvent, relayUrls: ['wss://relay.example.com/'] }]
                    : [],
                fetchedAt: 1_700_000_030,
                relayUrls: ['wss://relay.example.com/'],
            }),
            cancel: vi.fn(),
        }));

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onReplyPost: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await fireEvent.click(await screen.findByRole('button', { name: '返信を確認' }));
        await waitFor(() => {
            expect(screen.getByText('他人からの返信B')).toBeTruthy();
            expect(screen.getByRole('button', { name: '返信 1件を表示' })).toBeTruthy();
        });
        expect(screen.queryByText('cache済み孫返信C')).toBeNull();
        expect(replyFetchServiceMock.fetchDirectReplies).toHaveBeenCalledTimes(1);
    });

    it('[thread-graph-children-prefetch] 表示済み子nodeの返信有無確認はconcurrency上限内で実行する', async () => {
        const parentEventId = '1'.repeat(64);
        const childIds = ['4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd'].map((value) => value.repeat(64));
        const post = createRecord({
            eventId: parentEventId,
            rawEvent: {
                id: parentEventId,
                pubkey: 'a'.repeat(64),
                kind: 1,
                content: '親投稿A',
                tags: [],
                created_at: 1_700_000_000,
                sig: 'c'.repeat(128),
            },
            content: '親投稿A',
            tags: [],
            media: [],
        });
        const childRecords = childIds.map((eventId, index) =>
            createDirectReplyEventRecord({
                eventId,
                parentEventId,
                authorPubkey: `${index + 2}`.repeat(64).slice(0, 64),
                content: `返信${index + 1}`,
                rawEvent: {
                    id: eventId,
                    pubkey: `${index + 2}`.repeat(64).slice(0, 64),
                    kind: 1,
                    content: `返信${index + 1}`,
                    tags: [['e', parentEventId, 'wss://parent.example.com/', 'reply']],
                    created_at: 1_700_000_010 + index,
                    sig: 'f'.repeat(128),
                },
            }));
        const storedRepliesByParent = new Map<string, any[]>();
        const deferredByBatchKey = new Map<string, ReturnType<typeof createDeferred<any>>>();
        let activePrefetchCount = 0;
        let maxActivePrefetchCount = 0;
        const startedPrefetchBatches: string[][] = [];

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        replyEventsRepositoryMock.getDirectReplies.mockImplementation(async (parentId: string) =>
            storedRepliesByParent.get(parentId) ?? [],
        );
        replyEventsRepositoryMock.upsertDirectReplies.mockImplementation(async ({ parentEventId, events }: any) => {
            storedRepliesByParent.set(parentEventId, events.map((item: any) =>
                childRecords.find((record) => record.eventId === item.event.id) ?? item,
            ));
            return {
                insertedCount: events.length,
                updatedCount: 0,
                unchangedCount: 0,
                ignoredCount: 0,
            };
        });
        replyFetchServiceMock.fetchDirectReplies.mockImplementation((_rxNostr: any, params: any) => {
            if (params.eventId === parentEventId) {
                return {
                    promise: Promise.resolve({
                        events: childRecords.map((record) => ({
                            event: record.rawEvent,
                            relayUrls: ['wss://relay.example.com/'],
                        })),
                        fetchedAt: 1_700_000_030,
                        relayUrls: ['wss://relay.example.com/'],
                    }),
                    cancel: vi.fn(),
                };
            }

            const eventIds = params.eventIds ?? [params.eventId];
            activePrefetchCount += 1;
            maxActivePrefetchCount = Math.max(maxActivePrefetchCount, activePrefetchCount);
            startedPrefetchBatches.push(eventIds);
            const deferred = createDeferred<any>();
            deferredByBatchKey.set(eventIds.join(','), deferred);
            return {
                promise: deferred.promise.then(() => {
                    activePrefetchCount -= 1;
                    return {
                        events: [],
                        fetchedAt: 1_700_000_040,
                        relayUrls: ['wss://relay.example.com/'],
                    };
                }),
                cancel: vi.fn(),
            };
        });

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onReplyPost: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await fireEvent.click(await screen.findByRole('button', { name: '返信を確認' }));
        await waitFor(() => {
            expect(screen.getByText('返信1')).toBeTruthy();
            expect(startedPrefetchBatches).toHaveLength(2);
        });
        expect(startedPrefetchBatches[0]).toHaveLength(4);
        expect(startedPrefetchBatches[1]).toHaveLength(4);
        expect(maxActivePrefetchCount).toBeLessThanOrEqual(2);

        deferredByBatchKey.get(startedPrefetchBatches[0].join(','))?.resolve(null);
        await waitFor(() => {
            expect(startedPrefetchBatches).toHaveLength(3);
        });
        expect(startedPrefetchBatches[2]).toHaveLength(2);
        expect(maxActivePrefetchCount).toBeLessThanOrEqual(2);

        for (const deferred of deferredByBatchKey.values()) {
            deferred.resolve(null);
        }
        await waitFor(() => {
            expect(startedPrefetchBatches).toHaveLength(3);
        });
        for (const deferred of deferredByBatchKey.values()) {
            deferred.resolve(null);
        }
        await waitFor(() => {
            expect(activePrefetchCount).toBe(0);
        });
        expect(maxActivePrefetchCount).toBeLessThanOrEqual(2);
        expect(screen.queryByText('この範囲では返信が見つかりませんでした')).toBeNull();
    });

    it('[thread-graph-children-renderable] path内へ戻る子候補だけなら件数バッジとactive状態を出さない', async () => {
        const parentEventId = '1'.repeat(64);
        const replyBEventId = '4'.repeat(64);
        const post = createRecord({
            eventId: parentEventId,
            rawEvent: {
                id: parentEventId,
                pubkey: 'a'.repeat(64),
                kind: 1,
                content: '親投稿A',
                tags: [],
                created_at: 1_700_000_000,
                sig: 'c'.repeat(128),
            },
            content: '親投稿A',
            tags: [],
            media: [],
        });
        const replyB = createDirectReplyEventRecord({
            eventId: replyBEventId,
            parentEventId,
            content: '循環候補の返信B',
            rawEvent: {
                id: replyBEventId,
                pubkey: 'd'.repeat(64),
                kind: 1,
                content: '循環候補の返信B',
                tags: [['e', parentEventId, 'wss://parent.example.com/', 'reply']],
                created_at: 1_700_000_010,
                sig: 'f'.repeat(128),
            },
        });
        const anchorAsReplyToB = createDirectReplyEventRecord({
            eventId: parentEventId,
            parentEventId: replyBEventId,
            authorPubkey: 'a'.repeat(64),
            content: '親投稿A',
            rawEvent: {
                ...post.rawEvent,
                tags: [['e', replyBEventId, 'wss://reply.example.com/', 'reply']],
            },
        });
        const storedRepliesByParent = new Map<string, any[]>();

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        replyEventsRepositoryMock.getDirectReplies.mockImplementation(async (parentId: string) =>
            storedRepliesByParent.get(parentId) ?? [],
        );
        replyEventsRepositoryMock.upsertDirectReplies.mockImplementation(async ({ parentEventId, events }: any) => {
            storedRepliesByParent.set(parentEventId, events.map((item: any) =>
                item.event.id === replyBEventId ? replyB : anchorAsReplyToB,
            ));
            return {
                insertedCount: events.length,
                updatedCount: 0,
                unchangedCount: 0,
                ignoredCount: 0,
            };
        });
        replyFetchServiceMock.fetchDirectReplies.mockImplementation((_rxNostr: any, params: any) => ({
            promise: Promise.resolve({
                events: params.eventId === parentEventId
                    ? [{ event: replyB.rawEvent, relayUrls: ['wss://relay.example.com/'] }]
                    : [{ event: anchorAsReplyToB.rawEvent, relayUrls: ['wss://relay.example.com/'] }],
                fetchedAt: 1_700_000_030,
                relayUrls: ['wss://relay.example.com/'],
            }),
            cancel: vi.fn(),
        }));

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onReplyPost: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await fireEvent.click(await screen.findByRole('button', { name: '返信を確認' }));
        await waitFor(() => {
            expect(screen.getByText('循環候補の返信B')).toBeTruthy();
        });
        await waitFor(() => {
            expect(replyFetchServiceMock.fetchDirectReplies).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({ eventId: replyBEventId }),
            );
        });

        const replyBCard = screen.getByText('循環候補の返信B').closest('.post-history-related-card');
        expect(replyBCard).toBeTruthy();
        await waitFor(() => {
            expect(within(replyBCard as HTMLElement)
                .getByRole('button', { name: '返信を再確認' })).toBeTruthy();
        });
        const replyBRepliesButton = within(replyBCard as HTMLElement)
            .getByRole('button', { name: '返信を再確認' });
        expect(within(replyBRepliesButton).queryByText('0')).toBeNull();
        expect(replyBRepliesButton.classList.contains('selected')).toBe(false);

        await fireEvent.click(replyBRepliesButton);
        await waitFor(() => {
            expect(replyFetchServiceMock.fetchDirectReplies).toHaveBeenCalledTimes(3);
        });
        expect(screen.getAllByText('親投稿A')).toHaveLength(1);
        expect(replyBRepliesButton.classList.contains('selected')).toBe(false);
    });

    it('[thread-graph-children-renderable] path外の子候補だけを件数と表示対象にする', async () => {
        const parentEventId = '1'.repeat(64);
        const replyBEventId = '4'.repeat(64);
        const replyCEventId = '6'.repeat(64);
        const post = createRecord({
            eventId: parentEventId,
            rawEvent: {
                id: parentEventId,
                pubkey: 'a'.repeat(64),
                kind: 1,
                content: '親投稿A',
                tags: [],
                created_at: 1_700_000_000,
                sig: 'c'.repeat(128),
            },
            content: '親投稿A',
            tags: [],
            media: [],
        });
        const replyB = createDirectReplyEventRecord({
            eventId: replyBEventId,
            parentEventId,
            content: '子返信B',
            rawEvent: {
                id: replyBEventId,
                pubkey: 'd'.repeat(64),
                kind: 1,
                content: '子返信B',
                tags: [['e', parentEventId, 'wss://parent.example.com/', 'reply']],
                created_at: 1_700_000_010,
                sig: 'f'.repeat(128),
            },
        });
        const anchorAsReplyToB = createDirectReplyEventRecord({
            eventId: parentEventId,
            parentEventId: replyBEventId,
            authorPubkey: 'a'.repeat(64),
            content: '親投稿A',
            rawEvent: {
                ...post.rawEvent,
                tags: [['e', replyBEventId, 'wss://reply.example.com/', 'reply']],
            },
        });
        const replyC = createDirectReplyEventRecord({
            eventId: replyCEventId,
            parentEventId: replyBEventId,
            authorPubkey: 'e'.repeat(64),
            content: '表示できる孫返信C',
            rawEvent: {
                id: replyCEventId,
                pubkey: 'e'.repeat(64),
                kind: 1,
                content: '表示できる孫返信C',
                tags: [['e', replyBEventId, 'wss://reply.example.com/', 'reply']],
                created_at: 1_700_000_020,
                sig: 'b'.repeat(128),
            },
        });
        const storedRepliesByParent = new Map<string, any[]>();

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        replyEventsRepositoryMock.getDirectReplies.mockImplementation(async (parentId: string) =>
            storedRepliesByParent.get(parentId) ?? [],
        );
        replyEventsRepositoryMock.upsertDirectReplies.mockImplementation(async ({ parentEventId, events }: any) => {
            storedRepliesByParent.set(parentEventId, events.map((item: any) =>
                item.event.id === replyBEventId
                    ? replyB
                    : item.event.id === replyCEventId
                        ? replyC
                        : anchorAsReplyToB,
            ));
            return {
                insertedCount: events.length,
                updatedCount: 0,
                unchangedCount: 0,
                ignoredCount: 0,
            };
        });
        replyFetchServiceMock.fetchDirectReplies.mockImplementation((_rxNostr: any, params: any) => ({
            promise: Promise.resolve({
                events: params.eventId === parentEventId
                    ? [{ event: replyB.rawEvent, relayUrls: ['wss://relay.example.com/'] }]
                    : [
                        { event: anchorAsReplyToB.rawEvent, relayUrls: ['wss://relay.example.com/'] },
                        { event: replyC.rawEvent, relayUrls: ['wss://relay.example.com/'] },
                    ],
                fetchedAt: 1_700_000_030,
                relayUrls: ['wss://relay.example.com/'],
            }),
            cancel: vi.fn(),
        }));

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onReplyPost: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await fireEvent.click(await screen.findByRole('button', { name: '返信を確認' }));
        await waitFor(() => {
            expect(screen.getByText('子返信B')).toBeTruthy();
        });
        await waitFor(() => {
            expect(screen.getByRole('button', { name: '返信 1件を表示' })).toBeTruthy();
        });
        const replyBCard = screen.getByText('子返信B').closest('.post-history-related-card');
        expect(replyBCard).toBeTruthy();
        expect(
            within(within(replyBCard as HTMLElement).getByRole('button', { name: '返信 1件を表示' }))
                .getByText('1'),
        ).toBeTruthy();

        await fireEvent.click(within(replyBCard as HTMLElement).getByRole('button', { name: '返信 1件を表示' }));
        await waitFor(() => {
            expect(screen.getByText('表示できる孫返信C')).toBeTruthy();
        });
        expect(screen.getAllByText('親投稿A')).toHaveLength(1);
    });

    it('[direct-replies] 投稿に付いた直接リプライを本文とアクション行の下に表示し、履歴本体には混ぜない', async () => {
        const post = createRecord({
            eventId: '1'.repeat(64),
            rawEvent: {
                id: '1'.repeat(64),
                pubkey: 'a'.repeat(64),
                kind: 1,
                content: '自分の投稿',
                tags: [],
                created_at: 1_700_000_000,
                sig: 'c'.repeat(128),
            },
            content: '自分の投稿',
            tags: [],
            media: [],
        });
        const otherReply = createDirectReplyEventRecord({
            eventId: '4'.repeat(64),
            content: '他人からの返信',
            rawEvent: {
                id: '4'.repeat(64),
                pubkey: 'd'.repeat(64),
                kind: 1,
                content: '他人からの返信',
                tags: [['e', '1'.repeat(64), 'wss://parent.example.com/', 'reply']],
                created_at: 1_700_000_010,
                sig: 'f'.repeat(128),
            },
        });
        const ownReply = createDirectReplyEventRecord({
            eventId: '5'.repeat(64),
            authorPubkey: 'a'.repeat(64),
            content: '自分の返信本文',
            rawEvent: {
                id: '5'.repeat(64),
                pubkey: 'a'.repeat(64),
                kind: 1,
                content: '自分の返信本文',
                tags: [['e', '1'.repeat(64), 'wss://parent.example.com/', 'reply']],
                created_at: 1_700_000_020,
                sig: 'e'.repeat(128),
            },
        });
        let storedReplies: any[] = [];

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        replyEventsRepositoryMock.getDirectReplies.mockImplementation(async () => storedReplies);
        replyEventsRepositoryMock.upsertDirectReplies.mockImplementation(async () => {
            storedReplies = [otherReply, ownReply];
            return {
                insertedCount: 2,
                updatedCount: 0,
                unchangedCount: 0,
                ignoredCount: 0,
            };
        });
        replyFetchServiceMock.fetchDirectReplies.mockReturnValue({
            promise: Promise.resolve({
                events: [
                    { event: otherReply.rawEvent, relayUrls: ['wss://relay.example.com/'] },
                    { event: ownReply.rawEvent, relayUrls: ['wss://relay.example.com/'] },
                ],
                fetchedAt: 1_700_000_030,
                relayUrls: ['wss://relay.example.com/'],
            }),
            cancel: vi.fn(),
        });

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onReplyPost: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        expect(screen.queryByRole('button', { name: '返信を表示' })).toBeNull();
        const checkRepliesButton = await screen.findByRole('button', { name: '返信を確認' });
        expect(checkRepliesButton.querySelector('.find_in_page-icon')).toBeTruthy();
        expect(document.body.querySelector('.forum-icon')).toBeNull();
        expect(document.body.querySelector('.question-answer-icon')).toBeNull();

        await fireEvent.click(checkRepliesButton);

        await waitFor(() => {
            expect(screen.getByText('他人からの返信')).toBeTruthy();
            expect(screen.getByText('自分の返信本文')).toBeTruthy();
        });

        expect(screen.queryByText('返信')).toBeNull();
        expect(screen.queryByText('自分の返信')).toBeNull();
        expect(screen.getByText('1件')).toBeTruthy();
        expect(repositoryMock.upsertFetchedEvents).not.toHaveBeenCalled();
        expect(replyEventsRepositoryMock.upsertDirectReplies).toHaveBeenCalledWith(expect.objectContaining({
            parentEventId: '1'.repeat(64),
        }));

        const currentContent = screen.getByText('自分の投稿');
        const firstReply = screen.getByText('他人からの返信');
        expect(
            currentContent.compareDocumentPosition(firstReply) &
            Node.DOCUMENT_POSITION_FOLLOWING,
        ).toBeTruthy();

        await fireEvent.click(await screen.findByRole('button', { name: '返信を隠す' }));
        await waitFor(() => {
            expect(screen.queryByText('他人からの返信')).toBeNull();
        });
        expect(screen.getByRole('button', { name: '返信 2件を表示' })).toBeTruthy();
    });

    it('[direct-replies] 返信確認loading中はアイコンボタン内にテキストなしのローダーだけを表示する', async () => {
        const post = createRecord({
            eventId: '1'.repeat(64),
            rawEvent: {
                id: '1'.repeat(64),
                pubkey: 'a'.repeat(64),
                kind: 1,
                content: '自分の投稿',
                tags: [],
                created_at: 1_700_000_000,
                sig: 'c'.repeat(128),
            },
            content: '自分の投稿',
            tags: [],
            media: [],
        });
        const deferredFetch = createDeferred<any>();

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        replyFetchServiceMock.fetchDirectReplies.mockReturnValue({
            promise: deferredFetch.promise,
            cancel: vi.fn(),
        });

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onReplyPost: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await fireEvent.click(await screen.findByRole('button', { name: '返信を確認' }));

        await waitFor(() => {
            const loadingButton = screen.getByRole('button', { name: '返信を確認中' });
            expect(loadingButton.querySelector('.post-preview-replies-spinner')).toBeTruthy();
            expect(loadingButton.querySelector('.find_in_page-icon')).toBeNull();
            expect(loadingButton.textContent?.trim()).toBe('');
        });
        expect(screen.queryByText('返信を取得中...')).toBeNull();

        deferredFetch.resolve({
            events: [],
            fetchedAt: 1_700_000_030,
            relayUrls: ['wss://relay.example.com/'],
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: '返信を再確認' })).toBeTruthy();
        });
        expect(screen.queryByText('この範囲では返信が見つかりませんでした')).toBeNull();
        expect(screen.queryByRole('button', { name: '再試行' })).toBeNull();
        expect(screen.getByRole('button', { name: '返信を再確認' }).querySelector('.post-preview-replies-count')).toBeNull();
    });

    it('[direct-replies] 投稿成功した自分のdirect replyをloaded済み一覧と件数バッジへ即時反映する', async () => {
        const parentEventId = '1'.repeat(64);
        const post = createRecord({
            eventId: parentEventId,
            rawEvent: {
                id: parentEventId,
                pubkey: 'a'.repeat(64),
                kind: 1,
                content: '親投稿A',
                tags: [],
                created_at: 1_700_000_000,
                sig: 'c'.repeat(128),
            },
            content: '親投稿A',
            tags: [],
            media: [],
        });
        const firstReply = createDirectReplyEventRecord({
            eventId: '4'.repeat(64),
            content: '既存返信B',
            rawEvent: {
                id: '4'.repeat(64),
                pubkey: 'd'.repeat(64),
                kind: 1,
                content: '既存返信B',
                tags: [['e', parentEventId, 'wss://parent.example.com/', 'reply']],
                created_at: 1_700_000_010,
                sig: 'f'.repeat(128),
            },
        });
        const postedReplyEvent = {
            id: '6'.repeat(64),
            pubkey: 'a'.repeat(64),
            kind: 1,
            content: '新規返信C',
            tags: [['e', parentEventId, 'wss://parent.example.com/', 'reply']],
            created_at: 1_700_000_020,
            sig: 'e'.repeat(128),
        };
        let storedReplies: any[] = [];

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        replyEventsRepositoryMock.getDirectReplies.mockImplementation(async () => storedReplies);
        replyEventsRepositoryMock.upsertDirectReplies.mockImplementation(async ({ events }: any) => {
            for (const item of events) {
                const event = item.event;
                if (!storedReplies.some((reply) => reply.eventId === event.id)) {
                    storedReplies = [
                        ...storedReplies,
                        createDirectReplyEventRecord({
                            eventId: event.id,
                            authorPubkey: event.pubkey,
                            content: event.content,
                            rawEvent: event,
                            createdAt: event.created_at,
                        }),
                    ];
                }
            }
            return {
                insertedCount: events.length,
                updatedCount: 0,
                unchangedCount: 0,
                ignoredCount: 0,
            };
        });
        replyFetchServiceMock.fetchDirectReplies.mockReturnValue({
            promise: Promise.resolve({
                events: [{ event: firstReply.rawEvent, relayUrls: ['wss://relay.example.com/'] }],
                fetchedAt: 1_700_000_030,
                relayUrls: ['wss://relay.example.com/'],
            }),
            cancel: vi.fn(),
        });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onReplyPost: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await fireEvent.click(await screen.findByRole('button', { name: '返信を確認' }));
        await waitFor(() => {
            expect(screen.getByText('既存返信B')).toBeTruthy();
            expect(screen.getByRole('button', { name: '返信を隠す' }).querySelector('.post-preview-replies-count')?.textContent).toBe('1');
        });

        await view.rerender({
            show: true,
            onClose: vi.fn(),
            onReplyPost: vi.fn(),
            pubkeyHex: 'a'.repeat(64),
            rxNostr: {} as any,
            latestPostedEvent: postedReplyEvent,
        });

        await waitFor(() => {
            expect(screen.getByText('新規返信C')).toBeTruthy();
            expect(screen.getByRole('button', { name: '返信を隠す' }).querySelector('.post-preview-replies-count')?.textContent).toBe('2');
        });
        expect(screen.getAllByText('既存返信B')).toHaveLength(1);
        expect(replyEventsRepositoryMock.upsertDirectReplies).toHaveBeenLastCalledWith(expect.objectContaining({
            parentEventId,
            events: [expect.objectContaining({ event: postedReplyEvent })],
        }));
        expect(repositoryMock.upsertFetchedEvents).not.toHaveBeenCalled();
    });

    it('[direct-replies] loaded済み一覧の再確認で新規replyだけをmergeし、既存replyを重複させない', async () => {
        const parentEventId = '1'.repeat(64);
        const post = createRecord({
            eventId: parentEventId,
            rawEvent: {
                id: parentEventId,
                pubkey: 'a'.repeat(64),
                kind: 1,
                content: '親投稿A',
                tags: [],
                created_at: 1_700_000_000,
                sig: 'c'.repeat(128),
            },
            content: '親投稿A',
            tags: [],
            media: [],
        });
        const firstReply = createDirectReplyEventRecord({
            eventId: '4'.repeat(64),
            content: '既存返信B',
            rawEvent: {
                id: '4'.repeat(64),
                pubkey: 'd'.repeat(64),
                kind: 1,
                content: '既存返信B',
                tags: [['e', parentEventId, 'wss://parent.example.com/', 'reply']],
                created_at: 1_700_000_010,
                sig: 'f'.repeat(128),
            },
        });
        const newReply = createDirectReplyEventRecord({
            eventId: '6'.repeat(64),
            authorPubkey: 'a'.repeat(64),
            content: '新規返信C',
            rawEvent: {
                id: '6'.repeat(64),
                pubkey: 'a'.repeat(64),
                kind: 1,
                content: '新規返信C',
                tags: [['e', parentEventId, 'wss://parent.example.com/', 'reply']],
                created_at: 1_700_000_020,
                sig: 'e'.repeat(128),
            },
        });
        let storedReplies: any[] = [];
        let fetchCount = 0;

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        replyEventsRepositoryMock.getDirectReplies.mockImplementation(async () => storedReplies);
        replyEventsRepositoryMock.upsertDirectReplies.mockImplementation(async ({ events }: any) => {
            for (const item of events) {
                const event = item.event;
                if (!storedReplies.some((reply) => reply.eventId === event.id)) {
                    storedReplies = [
                        ...storedReplies,
                        event.id === firstReply.eventId ? firstReply : newReply,
                    ];
                }
            }
            return {
                insertedCount: events.length,
                updatedCount: 0,
                unchangedCount: 0,
                ignoredCount: 0,
            };
        });
        replyFetchServiceMock.fetchDirectReplies.mockImplementation(() => {
            fetchCount += 1;
            const events = fetchCount === 1
                ? [{ event: firstReply.rawEvent, relayUrls: ['wss://relay.example.com/'] }]
                : [
                    { event: firstReply.rawEvent, relayUrls: ['wss://relay.example.com/'] },
                    { event: newReply.rawEvent, relayUrls: ['wss://relay.example.com/'] },
                ];
            return {
                promise: Promise.resolve({
                    events,
                    fetchedAt: 1_700_000_030 + fetchCount,
                    relayUrls: ['wss://relay.example.com/'],
                }),
                cancel: vi.fn(),
            };
        });

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onReplyPost: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await fireEvent.click(await screen.findByRole('button', { name: '返信を確認' }));
        await waitFor(() => {
            expect(screen.getByText('既存返信B')).toBeTruthy();
        });

        await fireEvent.click(screen.getByRole('button', { name: '返信を隠す' }));
        await waitFor(() => {
            expect(screen.queryByText('既存返信B')).toBeNull();
            expect(screen.getByRole('button', { name: '返信 1件を表示' })).toBeTruthy();
        });

        await fireEvent.click(screen.getByRole('button', { name: '返信 1件を表示' }));
        await waitFor(() => {
            expect(screen.getByText('既存返信B')).toBeTruthy();
            expect(screen.getByText('新規返信C')).toBeTruthy();
            expect(screen.getByRole('button', { name: '返信を隠す' }).querySelector('.post-preview-replies-count')?.textContent).toBe('2');
        });
        expect(screen.getAllByText('既存返信B')).toHaveLength(1);
        expect(replyFetchServiceMock.fetchDirectReplies).toHaveBeenCalledTimes(2);
        expect(screen.queryByText('この範囲では返信が見つかりませんでした')).toBeNull();
        expect(screen.queryByRole('button', { name: '再試行' })).toBeNull();
        expect(screen.queryByText('0')).toBeNull();
    });

    it('[direct-replies-nip09] validなkind:5がある返信を表示と件数から除外する', async () => {
        const parentEventId = '1'.repeat(64);
        const post = createRecord({
            eventId: parentEventId,
            rawEvent: {
                id: parentEventId,
                pubkey: 'a'.repeat(64),
                kind: 1,
                content: '親投稿A',
                tags: [],
                created_at: 1_700_000_000,
                sig: 'c'.repeat(128),
            },
            content: '親投稿A',
            tags: [],
            media: [],
        });
        const deletedReply = createDirectReplyEventRecord({
            eventId: '4'.repeat(64),
            content: '削除済み返信B',
            rawEvent: {
                id: '4'.repeat(64),
                pubkey: 'd'.repeat(64),
                kind: 1,
                content: '削除済み返信B',
                tags: [['e', parentEventId, 'wss://parent.example.com/', 'reply']],
                created_at: 1_700_000_010,
                sig: 'f'.repeat(128),
            },
        });
        const remainingReply = createDirectReplyEventRecord({
            eventId: '6'.repeat(64),
            content: '残る返信C',
            rawEvent: {
                id: '6'.repeat(64),
                pubkey: 'e'.repeat(64),
                kind: 1,
                content: '残る返信C',
                tags: [['e', parentEventId, 'wss://parent.example.com/', 'reply']],
                created_at: 1_700_000_020,
                sig: 'b'.repeat(128),
            },
        });
        const deletedTargets = new Map<string, Set<string>>();

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        deletionRequestsRepositoryMock.getDeletedTargets.mockImplementation(async () => deletedTargets);
        deletionRequestsRepositoryMock.upsertValidDeletionRequests.mockImplementation(async ({ targetEvents, deletionEvents }: any) => {
            for (const item of deletionEvents) {
                for (const targetEvent of targetEvents) {
                    const hasTargetTag = item.event.tags.some((tag: string[]) =>
                        tag[0] === 'e' && tag[1] === targetEvent.id,
                    );
                    if (item.event.kind === 5 && item.event.pubkey === targetEvent.pubkey && hasTargetTag) {
                        const eventIds = deletedTargets.get(targetEvent.pubkey) ?? new Set<string>();
                        eventIds.add(targetEvent.id);
                        deletedTargets.set(targetEvent.pubkey, eventIds);
                    }
                }
            }
            return {
                insertedCount: 1,
                updatedCount: 0,
                unchangedCount: 0,
                ignoredCount: 0,
            };
        });
        let storedReplies: any[] = [];
        replyEventsRepositoryMock.getDirectReplies.mockImplementation(async () => storedReplies);
        replyEventsRepositoryMock.upsertDirectReplies.mockImplementation(async ({ events }: any) => {
            storedReplies = events.map((item: any) =>
                item.event.id === remainingReply.eventId ? remainingReply : deletedReply,
            );
            return {
                insertedCount: events.length,
                updatedCount: 0,
                unchangedCount: 0,
                ignoredCount: 0,
            };
        });
        replyFetchServiceMock.fetchDirectReplies.mockReturnValue({
            promise: Promise.resolve({
                events: [
                    { event: deletedReply.rawEvent, relayUrls: ['wss://relay.example.com/'] },
                    { event: remainingReply.rawEvent, relayUrls: ['wss://relay.example.com/'] },
                ],
                fetchedAt: 1_700_000_030,
                relayUrls: ['wss://relay.example.com/'],
            }),
            cancel: vi.fn(),
        });
        deletionFetchServiceMock.fetchDeletionRequests.mockReturnValue({
            promise: Promise.resolve({
                events: [{
                    event: createDeletionEvent({
                        targetEventId: deletedReply.eventId,
                        pubkey: deletedReply.authorPubkey,
                    }),
                    relayUrls: ['wss://relay.example.com/'],
                }],
                fetchedAt: 1_700_000_050,
                relayUrls: ['wss://relay.example.com/'],
            }),
            cancel: vi.fn(),
        });

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onReplyPost: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await fireEvent.click(await screen.findByRole('button', { name: '返信を確認' }));

        await waitFor(() => {
            expect(screen.queryByText('削除済み返信B')).toBeNull();
            expect(screen.getByText('残る返信C')).toBeTruthy();
            expect(screen.getByRole('button', { name: '返信を隠す' }).querySelector('.post-preview-replies-count')?.textContent).toBe('1');
        });
        expect(replyEventsRepositoryMock.deleteByEventId).toHaveBeenCalledWith(deletedReply.eventId);
        expect(replyEventsRepositoryMock.upsertDirectReplies).toHaveBeenCalledWith(expect.objectContaining({
            events: [expect.objectContaining({ event: remainingReply.rawEvent })],
        }));
    });

    it('[direct-replies-nip09] pubkey不一致のkind:5は削除済み扱いにしない', async () => {
        const parentEventId = '1'.repeat(64);
        const post = createRecord({
            eventId: parentEventId,
            rawEvent: {
                id: parentEventId,
                pubkey: 'a'.repeat(64),
                kind: 1,
                content: '親投稿A',
                tags: [],
                created_at: 1_700_000_000,
                sig: 'c'.repeat(128),
            },
            content: '親投稿A',
            tags: [],
            media: [],
        });
        const reply = createDirectReplyEventRecord({
            eventId: '4'.repeat(64),
            content: '表示される返信B',
            rawEvent: {
                id: '4'.repeat(64),
                pubkey: 'd'.repeat(64),
                kind: 1,
                content: '表示される返信B',
                tags: [['e', parentEventId, 'wss://parent.example.com/', 'reply']],
                created_at: 1_700_000_010,
                sig: 'f'.repeat(128),
            },
        });

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        replyEventsRepositoryMock.getDirectReplies.mockImplementation(async () => [reply]);
        replyEventsRepositoryMock.upsertDirectReplies.mockResolvedValue({
            insertedCount: 1,
            updatedCount: 0,
            unchangedCount: 0,
            ignoredCount: 0,
        });
        replyFetchServiceMock.fetchDirectReplies.mockReturnValue({
            promise: Promise.resolve({
                events: [{ event: reply.rawEvent, relayUrls: ['wss://relay.example.com/'] }],
                fetchedAt: 1_700_000_030,
                relayUrls: ['wss://relay.example.com/'],
            }),
            cancel: vi.fn(),
        });
        deletionFetchServiceMock.fetchDeletionRequests.mockReturnValue({
            promise: Promise.resolve({
                events: [{
                    event: createDeletionEvent({
                        targetEventId: reply.eventId,
                        pubkey: '9'.repeat(64),
                    }),
                    relayUrls: ['wss://relay.example.com/'],
                }],
                fetchedAt: 1_700_000_050,
                relayUrls: ['wss://relay.example.com/'],
            }),
            cancel: vi.fn(),
        });

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onReplyPost: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await fireEvent.click(await screen.findByRole('button', { name: '返信を確認' }));

        await waitFor(() => {
            expect(screen.getByText('表示される返信B')).toBeTruthy();
            expect(screen.getByRole('button', { name: '返信を隠す' }).querySelector('.post-preview-replies-count')?.textContent).toBe('1');
        });
    });

    it('[direct-replies-nip09] DB cache上のtombstoneでcached replyを非表示にし0バッジを出さない', async () => {
        const parentEventId = '1'.repeat(64);
        const post = createRecord({
            eventId: parentEventId,
            rawEvent: {
                id: parentEventId,
                pubkey: 'a'.repeat(64),
                kind: 1,
                content: '親投稿A',
                tags: [],
                created_at: 1_700_000_000,
                sig: 'c'.repeat(128),
            },
            content: '親投稿A',
            tags: [],
            media: [],
        });
        const deletedReply = createDirectReplyEventRecord({
            eventId: '4'.repeat(64),
            content: 'cached削除済み返信B',
            rawEvent: {
                id: '4'.repeat(64),
                pubkey: 'd'.repeat(64),
                kind: 1,
                content: 'cached削除済み返信B',
                tags: [['e', parentEventId, 'wss://parent.example.com/', 'reply']],
                created_at: 1_700_000_010,
                sig: 'f'.repeat(128),
            },
        });
        const deletedTargets = new Map<string, Set<string>>([
            [deletedReply.authorPubkey, new Set([deletedReply.eventId])],
        ]);

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        deletionRequestsRepositoryMock.getDeletedTargets.mockResolvedValue(deletedTargets);
        replyEventsRepositoryMock.getDirectReplies.mockImplementation(async () => [deletedReply]);
        replyFetchServiceMock.fetchDirectReplies.mockReturnValue({
            promise: Promise.resolve({
                events: [{ event: deletedReply.rawEvent, relayUrls: ['wss://relay.example.com/'] }],
                fetchedAt: 1_700_000_030,
                relayUrls: ['wss://relay.example.com/'],
            }),
            cancel: vi.fn(),
        });

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onReplyPost: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await fireEvent.click(await screen.findByRole('button', { name: '返信を確認' }));

        await waitFor(() => {
            expect(screen.queryByText('cached削除済み返信B')).toBeNull();
            expect(screen.getByRole('button', { name: '返信を再確認' })).toBeTruthy();
        });
        expect(screen.getByRole('button', { name: '返信を再確認' }).querySelector('.post-preview-replies-count')).toBeNull();
        expect(screen.queryByText('この範囲では返信が見つかりませんでした')).toBeNull();
        expect(screen.queryByRole('button', { name: '再試行' })).toBeNull();
        expect(replyEventsRepositoryMock.deleteByEventId).toHaveBeenCalledWith(deletedReply.eventId);
        expect(replyEventsRepositoryMock.upsertDirectReplies).toHaveBeenCalledWith(expect.objectContaining({
            events: [],
        }));
    });

    it('[direct-replies-delete] 削除済みdirect replyをgraph stateと再取得mergeから除外する', async () => {
        const parentEventId = '1'.repeat(64);
        const replyBEventId = '4'.repeat(64);
        const replyCEventId = '6'.repeat(64);
        const parentPost = createRecord({
            eventId: parentEventId,
            rawEvent: {
                id: parentEventId,
                pubkey: 'a'.repeat(64),
                kind: 1,
                content: '親投稿A',
                tags: [],
                created_at: 1_700_000_000,
                sig: 'c'.repeat(128),
            },
            content: '親投稿A',
            tags: [],
            media: [],
        });
        const replyBRecord = createRecord({
            eventId: replyBEventId,
            id: replyBEventId,
            rawEvent: {
                id: replyBEventId,
                pubkey: 'a'.repeat(64),
                kind: 1,
                content: '削除対象返信B',
                tags: [['e', parentEventId, 'wss://parent.example.com/', 'reply']],
                created_at: 1_700_000_010,
                sig: 'b'.repeat(128),
            },
            content: '削除対象返信B',
            tags: [['e', parentEventId, 'wss://parent.example.com/', 'reply']],
            createdAt: 1_700_000_010,
            postedAt: Date.UTC(2024, 0, 2, 3, 5, 0),
            media: [],
        });
        const replyB = createDirectReplyEventRecord({
            eventId: replyBEventId,
            authorPubkey: 'a'.repeat(64),
            content: '削除対象返信B',
            rawEvent: replyBRecord.rawEvent,
        });
        const replyC = createDirectReplyEventRecord({
            eventId: replyCEventId,
            content: '残る返信C',
            rawEvent: {
                id: replyCEventId,
                pubkey: 'd'.repeat(64),
                kind: 1,
                content: '残る返信C',
                tags: [['e', parentEventId, 'wss://parent.example.com/', 'reply']],
                created_at: 1_700_000_020,
                sig: 'f'.repeat(128),
            },
        });
        let storedReplies: any[] = [];
        let deletedReplyB = false;
        let fetchCount = 0;

        repositoryMock.getPage.mockResolvedValue([parentPost, replyBRecord]);
        repositoryMock.countForPubkey.mockResolvedValue(2);
        repositoryMock.getByEventId.mockImplementation(async (eventId: string) => {
            if (eventId === replyBEventId && deletedReplyB) {
                return { ...replyBRecord, deletedAt: 1_700_000_100 };
            }

            return eventId === replyBEventId ? replyBRecord : null;
        });
        replyEventsRepositoryMock.getDirectReplies.mockImplementation(async () => storedReplies);
        replyEventsRepositoryMock.deleteByEventId.mockImplementation(async (eventId: string) => {
            storedReplies = storedReplies.filter((reply) => reply.eventId !== eventId);
        });
        replyEventsRepositoryMock.upsertDirectReplies.mockImplementation(async ({ events }: any) => {
            for (const item of events) {
                const event = item.event;
                if (!storedReplies.some((reply) => reply.eventId === event.id)) {
                    storedReplies = [
                        ...storedReplies,
                        event.id === replyBEventId ? replyB : replyC,
                    ];
                }
            }
            return {
                insertedCount: events.length,
                updatedCount: 0,
                unchangedCount: 0,
                ignoredCount: 0,
            };
        });
        replyFetchServiceMock.fetchDirectReplies.mockImplementation(() => {
            fetchCount += 1;
            return {
                promise: Promise.resolve({
                    events: [
                        { event: replyB.rawEvent, relayUrls: ['wss://relay.example.com/'] },
                        { event: replyC.rawEvent, relayUrls: ['wss://relay.example.com/'] },
                    ],
                    fetchedAt: 1_700_000_030 + fetchCount,
                    relayUrls: ['wss://relay.example.com/'],
                }),
                cancel: vi.fn(),
            };
        });
        postDeletionServiceMock.requestDeletion.mockImplementation(async () => {
            deletedReplyB = true;
            return {
                success: true,
                eventId: 'delete-event-id',
                deletionEventId: 'delete-event-id',
                deletedAt: 1_700_000_100,
            };
        });

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onReplyPost: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await screen.findByText('親投稿A');
        const parentHistoryItem = document.querySelector(`[data-post-history-event-id="${parentEventId}"]`);
        expect(parentHistoryItem).toBeTruthy();
        const parentQueries = within(parentHistoryItem as HTMLElement);

        await fireEvent.click(await parentQueries.findByRole('button', { name: '返信を確認' }));
        await waitFor(() => {
            expect(screen.getAllByText('削除対象返信B')).toHaveLength(2);
            expect(screen.getByText('残る返信C')).toBeTruthy();
            expect(parentQueries.getByRole('button', { name: '返信を隠す' }).querySelector('.post-preview-replies-count')?.textContent).toBe('2');
        });

        const replyHistoryItem = document.querySelector(`[data-post-history-event-id="${replyBEventId}"]`);
        expect(replyHistoryItem).toBeTruthy();
        await fireEvent.click(within(replyHistoryItem as HTMLElement).getByRole('button', { name: 'アクションを表示' }));
        await fireEvent.click(await screen.findByRole('menuitem', { name: '削除' }));
        await fireEvent.click(await screen.findByRole('button', { name: '送信' }));

        await waitFor(() => {
            expect(replyEventsRepositoryMock.deleteByEventId).toHaveBeenCalledWith(replyBEventId);
            expect(screen.getAllByText('削除対象返信B')).toHaveLength(1);
            expect(screen.getByText('残る返信C')).toBeTruthy();
            expect(parentQueries.getByRole('button', { name: '返信を隠す' }).querySelector('.post-preview-replies-count')?.textContent).toBe('1');
        });

        await fireEvent.click(parentQueries.getByRole('button', { name: '返信を隠す' }));
        await waitFor(() => {
            expect(parentQueries.getByRole('button', { name: '返信 1件を表示' })).toBeTruthy();
        });

        await fireEvent.click(parentQueries.getByRole('button', { name: '返信 1件を表示' }));
        await waitFor(() => {
            expect(fetchCount).toBe(2);
            expect(screen.getAllByText('削除対象返信B')).toHaveLength(1);
            expect(screen.getByText('残る返信C')).toBeTruthy();
            expect(parentQueries.getByRole('button', { name: '返信を隠す' }).querySelector('.post-preview-replies-count')?.textContent).toBe('1');
        });
        expect(screen.queryByText('この範囲では返信が見つかりませんでした')).toBeNull();
        expect(screen.queryByRole('button', { name: '再試行' })).toBeNull();
        expect(screen.queryByText('0')).toBeNull();
        expect(repositoryMock.upsertFetchedEvents).not.toHaveBeenCalled();
    });

    it('[search-toggle] メニューの検索ボタンで検索バーを表示し、閉じると検索状態をクリアする', async () => {
        vi.useFakeTimers();
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

        expect(screen.queryByRole('searchbox', { name: '検索' })).toBeNull();

        const searchInput = await openSearchBar();
        await fireEvent.input(searchInput, { target: { value: '一致' } });
        await vi.advanceTimersByTimeAsync(250);

        await waitFor(() => {
            expect(localSearchServiceMock.searchLocalPosts).toHaveBeenCalledWith({
                pubkeyHex: 'a'.repeat(64),
                query: '一致',
                page: 1,
                pageSize: 50,
            });
        });

        await toggleSearchFromMenu();

        await waitFor(() => {
            expect(screen.queryByRole('searchbox', { name: '検索' })).toBeNull();
            expect(screen.queryByText('一致する投稿はありません')).toBeNull();
            expect(screen.getByText('投稿履歴はありません')).toBeTruthy();
        });

        const reopenedSearchInput = await openSearchBar();
        await fireEvent.input(reopenedSearchInput, { target: { value: '一致' } });
        await vi.advanceTimersByTimeAsync(250);

        await waitFor(() => {
            expect(localSearchServiceMock.searchLocalPosts).toHaveBeenLastCalledWith({
                pubkeyHex: 'a'.repeat(64),
                query: '一致',
                page: 1,
                pageSize: 50,
            });
        });

        await fireEvent.click(screen.getByRole('button', { name: '検索を閉じる' }));

        await waitFor(() => {
            expect(screen.queryByRole('searchbox', { name: '検索' })).toBeNull();
            expect(screen.queryByText('一致する投稿はありません')).toBeNull();
            expect(screen.getByText('投稿履歴はありません')).toBeTruthy();
        });
    });

    it('[delete-local-history] ローカル投稿履歴削除は ConfirmDialog を経由し、削除後に空状態へ戻す', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({ eventId: 'local-history-post', content: '削除対象' }),
        ]);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await waitFor(() => {
            expect(screen.getByText('削除対象')).toBeTruthy();
        });

        await openPostHistoryMenu();
        await fireEvent.click(await screen.findByRole('menuitem', { name: 'ローカル投稿履歴を全削除' }));

        expect(repositoryMock.deleteForPubkey).not.toHaveBeenCalled();
        expect(await screen.findAllByText('このアカウントのローカル履歴だけを削除します')).toHaveLength(2);

        repositoryMock.countForPubkey.mockResolvedValue(0);
        repositoryMock.getPage.mockResolvedValue([]);

        await fireEvent.click(screen.getByRole('button', { name: '全削除' }));

        await waitFor(() => {
            expect(repositoryMock.deleteForPubkey).toHaveBeenCalledWith('a'.repeat(64));
            expect(visibleRangeRepositoryMock.clearForPubkey).toHaveBeenCalledWith('a'.repeat(64));
            expect(screen.getByText('投稿履歴はありません')).toBeTruthy();
            expect(screen.queryByText('削除対象')).toBeNull();
        });
    });


});
