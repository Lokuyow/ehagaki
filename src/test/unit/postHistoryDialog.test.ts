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
        'postHistory.replyTarget': '返信先',
        'postHistory.contextLoading': '関連投稿を読み込み中...',
        'postHistory.contextNotFound': '関連投稿が見つかりませんでした',
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
}));

const replyFetchServiceMock = vi.hoisted(() => ({
    fetchDirectReplies: vi.fn(),
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

vi.mock('../../lib/storage/postHistoryRepository', () => ({
    postHistoryRepository: repositoryMock,
}));

vi.mock('../../lib/storage/postHistoryReplyEventsRepository', () => ({
    postHistoryReplyEventsRepository: replyEventsRepositoryMock,
}));

vi.mock('../../lib/postHistoryReplyFetchService', () => ({
    POST_HISTORY_DIRECT_REPLY_FETCH_LIMIT: 100,
    POST_HISTORY_DIRECT_REPLY_FETCH_LOOKBACK_SECONDS: 86_400,
    postHistoryReplyFetchService: replyFetchServiceMock,
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
        replyFetchServiceMock.fetchDirectReplies.mockReturnValue({
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
        expect(checkRepliesButton.querySelector('.pageview-icon')).toBeTruthy();
        expect(document.body.querySelector('.forum-icon')).toBeNull();
        expect(document.body.querySelector('.question-answer-icon')).toBeNull();

        await fireEvent.click(checkRepliesButton);

        await waitFor(() => {
            expect(screen.getByText('他人からの返信')).toBeTruthy();
            expect(screen.getByText('自分の返信本文')).toBeTruthy();
        });

        expect(screen.getByText('返信')).toBeTruthy();
        expect(screen.getByText('自分の返信')).toBeTruthy();
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
            expect(loadingButton.querySelector('.pageview-icon')).toBeNull();
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
