import { nip19 } from 'nostr-tools';
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
        'postHistory.broadcast': 'ブロードキャスト',
        'postHistory.broadcastSent': 'ブロードキャストしました',
        'postHistory.broadcastFailed': 'ブロードキャストに失敗しました',
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
        'postHistory.deleteLocalHistory': '保存済み投稿履歴をクリア',
        'postHistory.deleteLocalHistoryTitle': '保存済み投稿履歴をクリア',
        'postHistory.deleteLocalHistoryDescription': 'このアカウントについて、この端末に保存された投稿履歴、関連キャッシュ、表示位置の記録をクリアします。Nostrリレー上の投稿は削除されません。投稿履歴は、後で同期や再取得によって再び表示される場合があります。',
        'postHistory.deleteLocalHistoryConfirm': 'クリアする',
        'postHistory.deleteLocalHistoryCancel': 'キャンセル',
        'postHistory.deleteLocalHistorySuccess': '保存済み投稿履歴をクリアしました',
        'postHistory.deleteLocalHistoryFailed': '保存済み投稿履歴のクリアに失敗しました',
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
        'postHistory.quoteLoading': '引用投稿を読み込み中...',
        'postHistory.quoteNotFound': '引用投稿が見つかりませんでした',
        'postHistory.quoteFetchFailed': '引用投稿を取得できませんでした',
        'postHistory.quoteDeleted': '引用元削除済み',
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
        'postHistory.showReactionsWithCount': `リアクション ${options?.values?.count}件を表示`,
        'postHistory.hideReactions': 'リアクションを隠す',
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
    getExistingEventIdsForPubkey: vi.fn(),
    getOldestCreatedAt: vi.fn(),
    upsertFetchedEvents: vi.fn(),
    deleteForPubkey: vi.fn(),
}));

const replyEventsRepositoryMock = vi.hoisted(() => {
    const getChildInteractions = vi.fn();
    const getDirectReplyInteractions = vi.fn();
    const getReactionInteractions = vi.fn();
    const upsertChildInteractions = vi.fn();
    const deleteChildInteractionByEventId = vi.fn();
    const deleteChildInteractionsForPostHistoryPubkey = vi.fn();

    return {
        getChildInteractions,
        getDirectReplyInteractions,
        getReactionInteractions,
        upsertChildInteractions,
        deleteChildInteractionByEventId,
        deleteChildInteractionsForPostHistoryPubkey,
        getRelatedEvents: getChildInteractions,
        getDirectReplies: getDirectReplyInteractions,
        upsertDirectReplies: upsertChildInteractions,
        deleteByEventId: deleteChildInteractionByEventId,
        deleteForPostHistoryPubkey: deleteChildInteractionsForPostHistoryPubkey,
    };
});

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

const profilesRepositoryMock = vi.hoisted(() => ({
    get: vi.fn(),
}));

const profileFetchDataMock = vi.hoisted(() => vi.fn());

const visibleRangeRepositoryMock = vi.hoisted(() => ({
    get: vi.fn(),
    save: vi.fn(),
    clear: vi.fn(),
    clearForPubkey: vi.fn(),
}));

const inboundInteractionsSyncStateRepositoryMock = vi.hoisted(() => ({
    get: vi.fn(),
    save: vi.fn(),
    clearForPubkey: vi.fn(),
}));

const authoredSyncStateRepositoryMock = vi.hoisted(() => ({
    get: vi.fn(),
    save: vi.fn(),
    saveLatestObservedCreatedAt: vi.fn(),
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

vi.mock('../../lib/storage/postHistoryChildInteractionsRepository', () => ({
    postHistoryChildInteractionsRepository: replyEventsRepositoryMock,
}));

vi.mock('../../lib/storage/postHistoryInboundInteractionsSyncStateRepository', () => ({
    postHistoryInboundInteractionsSyncStateRepository: inboundInteractionsSyncStateRepositoryMock,
}));

vi.mock('../../lib/storage/postHistoryAuthoredSyncStateRepository', () => ({
    postHistoryAuthoredSyncStateRepository: authoredSyncStateRepositoryMock,
}));

vi.mock('../../lib/storage/postHistoryDeletionRequestsRepository', () => ({
    postHistoryDeletionRequestsRepository: deletionRequestsRepositoryMock,
}));

vi.mock('../../lib/storage/profilesRepository', () => ({
    profilesRepository: profilesRepositoryMock,
}));

vi.mock('../../lib/profileManager', () => ({
    ProfileManager: vi.fn().mockImplementation(function () {
        return {
            fetchProfileData: profileFetchDataMock,
        };
    }),
}));

vi.mock('../../lib/profileMetadataCache.svelte', () => ({
    profileMetadataCache: {
        getProfile: profileFetchDataMock,
        getProfiles: vi.fn(async (pubkeys: string[]) => {
            const entries = await Promise.all(pubkeys.map(async (pubkey) => {
                const profile = await profileFetchDataMock(pubkey, {});
                return [pubkey, profile ?? null] as const;
            }));
            return Object.fromEntries(entries);
        }),
        subscribe: vi.fn(() => vi.fn()),
    },
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

function createQuoteNoteUri(eventId: string): string {
    return `nostr:${nip19.noteEncode(eventId)}`;
}

function createQuoteNeventUri(
    eventId: string,
    authorPubkey?: string,
    relayHints: string[] = [],
): string {
    return `nostr:${nip19.neventEncode({
        id: eventId,
        author: authorPubkey,
        relays: relayHints.length > 0 ? relayHints : undefined,
    })}`;
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

async function findHistoryItem(eventId: string): Promise<HTMLElement> {
    let historyItem: HTMLElement | null = null;

    await waitFor(() => {
        historyItem = document.querySelector(
            `[data-post-history-event-id="${eventId}"]`,
        ) as HTMLElement | null;
        expect(historyItem).toBeTruthy();
    });

    if (!historyItem) {
        throw new Error(`History item not found: ${eventId}`);
    }

    return historyItem;
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

function createQuoteContextRecords(
    overrides: {
        postId?: string;
        postContent?: string;
        quoteId?: string;
        quoteContent?: string;
        quoteAuthorPubkey?: string;
        quoteRelayHint?: string;
        includeAuthorHint?: boolean;
    } = {},
) {
    const quoteId = overrides.quoteId ?? '6'.repeat(64);
    const quoteAuthorPubkey = overrides.quoteAuthorPubkey ?? 'e'.repeat(64);
    const quoteRelayHint = overrides.quoteRelayHint ?? 'wss://quote.example.com/';
    const quoteContent = overrides.quoteContent ?? '引用元の投稿';
    const quoteTag = [
        'q',
        quoteId,
        quoteRelayHint,
        ...(overrides.includeAuthorHint === false ? [] : [quoteAuthorPubkey]),
    ];
    const quotedRecord = createRecord({
        eventId: quoteId,
        pubkeyHex: quoteAuthorPubkey,
        content: quoteContent,
        tags: [],
        rawEvent: {
            id: quoteId,
            pubkey: quoteAuthorPubkey,
            kind: 1,
            content: quoteContent,
            tags: [],
            created_at: 1_699_999_500,
            sig: '8'.repeat(128),
        },
    });
    const post = createRecord({
        eventId: overrides.postId ?? '5'.repeat(64),
        content: overrides.postContent ?? '自分の引用',
        rawEvent: {
            id: overrides.postId ?? '5'.repeat(64),
            pubkey: 'a'.repeat(64),
            kind: 1,
            content: overrides.postContent ?? '自分の引用',
            tags: [quoteTag],
            created_at: 1_700_000_000,
            sig: '9'.repeat(128),
        },
        tags: [quoteTag],
    });

    return {
        quotedRecord,
        post,
        quoteId,
        quoteAuthorPubkey,
    };
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

function createProfile(overrides: Record<string, any> = {}) {
    return {
        name: overrides.name ?? '',
        displayName: overrides.displayName ?? 'Thread User',
        picture: overrides.picture ?? '',
        npub: overrides.npub ?? 'npub1threaduser',
        nprofile: overrides.nprofile ?? 'nprofile1threaduser',
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

function mockCachedImagePreviews(entries: Record<string, string>): void {
    postMediaCacheServiceMock.getCachedMediaDescriptor.mockImplementation(async (url: string) => {
        if (!(url in entries)) {
            return null;
        }

        return {
            cacheKey: url,
            url,
            mimeType: 'image/jpeg',
            size: 10,
            source: 'uploaded',
            kind: 'image',
        };
    });

    postMediaCacheServiceMock.createCachedMediaObjectUrl.mockImplementation(async (url: string) => {
        const objectUrl = entries[url];
        if (!objectUrl) {
            return null;
        }

        return {
            cacheKey: url,
            url,
            mimeType: 'image/jpeg',
            size: 10,
            source: 'uploaded',
            kind: 'image',
            objectUrl,
        };
    });
}

async function openPostHistoryMenu(): Promise<void> {
    const trigger = await screen.findByRole('button', { name: '投稿履歴メニューを開く' });
    await fireEvent.click(trigger);
}

async function openPostActionMenu(container?: HTMLElement): Promise<void> {
    const preferredTrigger = container
        ? container.querySelector('.post-history-thread-anchor-post .post-preview-footer-right .post-history-menu-trigger')
        : document.querySelector('.post-history-thread-anchor-post .post-preview-footer-right .post-history-menu-trigger');
    if (preferredTrigger instanceof HTMLElement) {
        await fireEvent.click(preferredTrigger);
        return;
    }

    const queries = container ? within(container) : screen;
    await fireEvent.click(await queries.findByRole('button', { name: 'アクションを表示' }));
}

async function findPostRepliesMenuAction(
    name: string | RegExp = '返信を確認',
    container?: HTMLElement,
): Promise<HTMLElement> {
    const existing = screen.queryByRole('menuitem', { name });
    if (existing) {
        return existing as HTMLElement;
    }

    await openPostActionMenu(container);
    return screen.findByRole('menuitem', { name }) as Promise<HTMLElement>;
}

async function clickPostRepliesMenuAction(
    name: string | RegExp = '返信を確認',
    container?: HTMLElement,
): Promise<void> {
    await fireEvent.click(await findPostRepliesMenuAction(name, container));
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
        repositoryMock.getExistingEventIdsForPubkey.mockResolvedValue([]);
        repositoryMock.upsertFetchedEvents.mockResolvedValue({
            insertedCount: 0,
            updatedCount: 0,
            unchangedCount: 0,
        });
        repositoryMock.deleteForPubkey.mockResolvedValue(undefined);
        replyEventsRepositoryMock.getChildInteractions.mockResolvedValue([]);
        replyEventsRepositoryMock.getDirectReplies.mockResolvedValue([]);
        replyEventsRepositoryMock.upsertDirectReplies.mockResolvedValue({
            insertedCount: 0,
            updatedCount: 0,
            unchangedCount: 0,
            ignoredCount: 0,
        });
        replyEventsRepositoryMock.deleteByEventId.mockResolvedValue(undefined);
        replyEventsRepositoryMock.deleteForPostHistoryPubkey.mockResolvedValue(undefined);
        deletionRequestsRepositoryMock.getDeletedTargets.mockResolvedValue(new Map());
        deletionRequestsRepositoryMock.upsertValidDeletionRequests.mockResolvedValue({
            insertedCount: 0,
            updatedCount: 0,
            unchangedCount: 0,
            ignoredCount: 0,
        });
        profilesRepositoryMock.get.mockResolvedValue(null);
        profileFetchDataMock.mockImplementation(async (pubkeyHex: string) =>
            profilesRepositoryMock.get(pubkeyHex),
        );
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
        inboundInteractionsSyncStateRepositoryMock.get.mockResolvedValue(null);
        inboundInteractionsSyncStateRepositoryMock.save.mockResolvedValue({});
        inboundInteractionsSyncStateRepositoryMock.clearForPubkey.mockResolvedValue(undefined);
        authoredSyncStateRepositoryMock.clearForPubkey.mockResolvedValue(undefined);
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

    it('[broadcast-menu-related-other-author] 他人の関連投稿にもブロードキャストメニューを表示する', async () => {
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
        const relatedText = await screen.findByText('返信先の投稿');
        const relatedNode = relatedText.closest('.post-history-thread-node-anchor');
        expect(relatedNode).toBeTruthy();

        await fireEvent.click(
            within(relatedNode as HTMLElement).getByRole('button', {
                name: 'アクションを表示',
            }),
        );

        expect(await screen.findByRole('menuitem', { name: 'ブロードキャスト' })).toBeTruthy();
    });

    it('[quote-preview-cache-first] qタグ付き投稿の下に引用プレビューを自動表示し、履歴DBを優先する', async () => {
        const quoteId = '6'.repeat(64);
        const quoteUri = createQuoteNoteUri(quoteId);
        const { quotedRecord, post } = createQuoteContextRecords({
            quoteId,
            postContent: ['前文', quoteUri, '後文'].join('\n'),
        });

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getByEventId.mockImplementation(async (eventId: string) =>
            eventId === quoteId ? quotedRecord : null,
        );

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        const historyItem = await findHistoryItem(post.eventId);
        const queries = within(historyItem);

        await waitFor(() => {
            expect(queries.getByText('引用元の投稿')).toBeTruthy();
        });

        const quotedContent = queries.getByText('引用元の投稿');
        const historyText = historyItem.textContent ?? '';
        expect(historyText).toContain('前文');
        expect(historyText).toContain('後文');
        expect(historyText).not.toContain(quoteUri);
        expect(queries.getByLabelText('postHistory.mediaNotCached image.jpg')).toBeTruthy();
        expect(historyText.indexOf('前文')).toBeLessThan(historyText.indexOf(quotedContent.textContent ?? ''));
        expect(contextFetchServiceMock.fetchEventById).not.toHaveBeenCalled();
        expect(repositoryMock.getByEventId).toHaveBeenCalledTimes(1);
    });

    it('[quote-preview-dedupe] 同じ引用先を複数投稿が参照しても1回だけ取得する', async () => {
        const quoteId = '6'.repeat(64);
        const { quotedRecord, post: firstPost } = createQuoteContextRecords({
            postId: '5'.repeat(64),
            postContent: '自分の引用その1',
            quoteId,
        });
        const { post: secondPost } = createQuoteContextRecords({
            postId: '7'.repeat(64),
            postContent: '自分の引用その2',
            quoteId,
        });

        repositoryMock.getPage.mockResolvedValue([firstPost, secondPost]);
        repositoryMock.countForPubkey.mockResolvedValue(2);
        repositoryMock.getByEventId.mockResolvedValue(null);
        contextFetchServiceMock.fetchEventById.mockReturnValue({
            promise: Promise.resolve({
                event: quotedRecord.rawEvent,
                relayUrl: 'wss://quote.example.com/',
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

        const firstHistoryItem = await findHistoryItem(firstPost.eventId);
        const secondHistoryItem = await findHistoryItem(secondPost.eventId);

        await waitFor(() => {
            expect(within(firstHistoryItem).getByText('引用元の投稿')).toBeTruthy();
            expect(within(secondHistoryItem).getByText('引用元の投稿')).toBeTruthy();
        });

        expect(repositoryMock.getByEventId).toHaveBeenCalledTimes(1);
        expect(contextFetchServiceMock.fetchEventById).toHaveBeenCalledTimes(1);
    });

    it('[quote-preview-nip09] tombstone がある引用先は削除済みラベルを表示する', async () => {
        const quoteId = '6'.repeat(64);
        const quoteUri = createQuoteNoteUri(quoteId);
        const { post, quoteAuthorPubkey } = createQuoteContextRecords({
            quoteId,
            postContent: quoteUri,
        });
        const deletedTargets = new Map<string, Set<string>>([
            [quoteAuthorPubkey, new Set([quoteId])],
        ]);

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getByEventId.mockResolvedValue(null);
        deletionRequestsRepositoryMock.getDeletedTargets.mockResolvedValue(deletedTargets);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        const historyItem = await findHistoryItem(post.eventId);
        const queries = within(historyItem);

        await waitFor(() => {
            expect(queries.getByText('引用元削除済み')).toBeTruthy();
        });

        expect(historyItem.textContent).not.toContain(quoteUri);
        expect(queries.queryByText('引用元の投稿')).toBeNull();
        expect(contextFetchServiceMock.fetchEventById).not.toHaveBeenCalled();
    });

    it('[quote-preview-not-found] qタグ対象が見つからない場合は未検出ラベルを表示する', async () => {
        const quoteId = '6'.repeat(64);
        const quoteUri = createQuoteNeventUri(quoteId, undefined, ['wss://quote.example.com/']);
        const { post } = createQuoteContextRecords({
            quoteId,
            postContent: quoteUri,
            includeAuthorHint: false,
        });

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

        const historyItem = await findHistoryItem(post.eventId);
        const queries = within(historyItem);

        await waitFor(() => {
            expect(queries.getByText('引用投稿が見つかりませんでした')).toBeTruthy();
        });

        expect(historyItem.textContent).not.toContain(quoteUri);
        expect(queries.queryByText('引用元削除済み')).toBeNull();
    });

    it('[quote-preview-loading] 引用読込中は inline quote URI を表示せず loading ラベルを出す', async () => {
        const quoteId = '8'.repeat(64);
        const quoteUri = createQuoteNeventUri(quoteId, 'e'.repeat(64), ['wss://quote.example.com/']);
        const deferred = createDeferred<{ event: null; relayUrl: string | null }>();
        const { post } = createQuoteContextRecords({
            quoteId,
            postContent: ['導入', quoteUri, '末尾'].join('\n'),
        });

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getByEventId.mockResolvedValue(null);
        contextFetchServiceMock.fetchEventById.mockReturnValue({
            promise: deferred.promise,
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

        const historyItem = await findHistoryItem(post.eventId);
        const queries = within(historyItem);

        await waitFor(() => {
            expect(queries.getByText('引用投稿を読み込み中...')).toBeTruthy();
        });

        expect(historyItem.textContent).toContain('導入');
        expect(historyItem.textContent).toContain('末尾');
        expect(historyItem.textContent).not.toContain(quoteUri);

        deferred.resolve({
            event: null,
            relayUrl: null,
        });
    });

    it('[quote-preview-retry] 引用取得失敗時は retry を表示し、再試行で解決できる', async () => {
        const quoteId = '9'.repeat(64);
        const quoteUri = createQuoteNoteUri(quoteId);
        const { quotedRecord, post } = createQuoteContextRecords({
            quoteId,
            postContent: quoteUri,
        });

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getByEventId.mockResolvedValue(null);
        contextFetchServiceMock.fetchEventById
            .mockReturnValueOnce({
                promise: new Promise((_resolve, reject) => {
                    setTimeout(() => reject(new Error('fetch failed')), 0);
                }),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve({
                    event: quotedRecord.rawEvent,
                    relayUrl: 'wss://quote.example.com/',
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

        const historyItem = await findHistoryItem(post.eventId);
        const queries = within(historyItem);

        await waitFor(() => {
            expect(queries.getByText('引用投稿を取得できませんでした')).toBeTruthy();
        });

        expect(historyItem.textContent).not.toContain(quoteUri);
        await fireEvent.click(queries.getByRole('button', { name: '再試行' }));

        await waitFor(() => {
            expect(queries.getByText('引用元の投稿')).toBeTruthy();
        });

        expect(contextFetchServiceMock.fetchEventById).toHaveBeenCalledTimes(2);
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

        const view = render(PostHistoryDialog, {
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

    it('[reply-context-cache-first] cached parentはdeletion fetch完了前に表示する', async () => {
        const { parentRecord, post, replyId } = createReplyContextRecords();
        const deferredDeletion = createDeferred<any>();

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getByEventId.mockImplementation(async (eventId: string) =>
            eventId === replyId ? parentRecord : null,
        );
        deletionFetchServiceMock.fetchDeletionRequests.mockReturnValue({
            promise: deferredDeletion.promise,
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
            expect(deletionFetchServiceMock.fetchDeletionRequests).toHaveBeenCalled();
            expect(screen.getByText('返信先の投稿')).toBeTruthy();
            const toggleButton = screen.getByRole('button', { name: '返信先を隠す' });
            expect(toggleButton).toBeTruthy();
            expect((toggleButton as HTMLButtonElement).disabled).toBe(false);
            expect(toggleButton.querySelector('.post-history-thread-action-spinner')).toBeNull();
        });
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
        const toggleButton = screen.getByRole('button', { name: '返信先を隠す' });
        expect((toggleButton as HTMLButtonElement).disabled).toBe(false);
        expect(toggleButton.querySelector('.post-history-thread-action-spinner')).toBeNull();
        await wait(350);
        expect(screen.queryByText('関連投稿を読み込み中...')).toBeNull();

        deferredRecord.resolve(parentRecord);
        await waitFor(() => {
            expect(screen.getByText('返信先の投稿')).toBeTruthy();
        });

        await wait(80);
        expect(screen.queryByText('関連投稿を読み込み中...')).toBeNull();
    });

    it('[reply-context-loading] 400msを超えても取得中の場合はカード側ローダーを表示しない', async () => {
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
        expect(screen.queryByText('関連投稿を読み込み中...')).toBeNull();
        expect(
            screen
                .getByRole('button', { name: '返信先を隠す' })
                .querySelector('.post-history-thread-action-spinner'),
        ).toBeTruthy();

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

    it('[thread-graph-parent-media] 返信先カードで既存メディア表示を再利用する', async () => {
        const parentEventId = '2'.repeat(64);
        const parentImageUrl = 'https://example.com/parent-related.jpg';
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
            content: '他人の返信先\n' + parentImageUrl,
            tags: [
                ['imeta', `url ${parentImageUrl}`, 'm image/jpeg', 'alt 返信先画像'],
            ],
            created_at: 1_699_999_000,
            sig: 'e'.repeat(128),
        };

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getByEventId.mockResolvedValue(null);
        contextFetchServiceMock.fetchEventById.mockImplementation((_rxNostr: any, params: any) => ({
            promise: Promise.resolve({
                event: params.eventId === parentEventId ? parentEvent : null,
                relayUrl: 'wss://relay.example.com/',
            }),
            cancel: vi.fn(),
        }));
        mockCachedImagePreviews({
            [parentImageUrl]: 'blob:parent-related-image',
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
            expect(screen.getByText('他人の返信先')).toBeTruthy();
            expect(screen.getByAltText('返信先画像')).toBeTruthy();
        });
        expect(screen.queryByText(parentImageUrl)).toBeNull();
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
        await clickPostRepliesMenuAction('返信を確認', historyItem as HTMLElement);
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
        const replyImageUrl = 'https://example.com/reply-related.jpg';
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
                tags: [
                    ['e', parentEventId, 'wss://parent.example.com/', 'reply'],
                    ['imeta', `url ${replyImageUrl}`, 'm image/jpeg', 'alt 返信画像'],
                ],
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
        mockCachedImagePreviews({
            [replyImageUrl]: 'blob:reply-related-image',
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

        await clickPostRepliesMenuAction();
        await waitFor(() => {
            expect(screen.getByText('他人からの返信B')).toBeTruthy();
            expect(screen.getByText('子返信なしD')).toBeTruthy();
            expect(screen.getByAltText('返信画像')).toBeTruthy();
        });
        expect(screen.queryByText(replyImageUrl)).toBeNull();
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
                .closest('.post-preview-replies-badge'),
        ).toBeTruthy();
        expect(screen.queryByText('返信Bへの返信C')).toBeNull();
        expect(
            Array.from(document.querySelectorAll('.post-preview-replies-badge'))
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

        await clickPostRepliesMenuAction();
        await waitFor(() => {
            expect(screen.getByText('他人からの返信B')).toBeTruthy();
            expect(screen.getByRole('button', { name: '返信 1件を表示' })).toBeTruthy();
        });
        expect(screen.queryByText('cache済み孫返信C')).toBeNull();
        expect(replyFetchServiceMock.fetchDirectReplies).toHaveBeenCalledTimes(1);
        await waitFor(() => {
            expect(profileFetchDataMock).toHaveBeenCalledWith(
                'e'.repeat(64),
                expect.objectContaining({
                    additionalRelays: ['wss://relay.example.com/'],
                    forceRefresh: false,
                    allowBackgroundRefresh: true,
                }),
            );
        });
    });

    it('[inbound-realtime] open dialog reloads the visible post badge after a saved direct reply signal', async () => {
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
        const realtimeReply = createDirectReplyEventRecord({
            eventId: '4'.repeat(64),
            parentEventId,
            content: 'realtimeで保存された返信',
        });
        let storedReplies: any[] = [];

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        replyEventsRepositoryMock.getDirectReplies.mockImplementation(async (parentId: string) =>
            parentId === parentEventId ? storedReplies : [],
        );

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onReplyPost: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        expect(await findPostRepliesMenuAction()).toBeTruthy();
        storedReplies = [realtimeReply];

        await view.rerender({
            show: true,
            onClose: vi.fn(),
            onReplyPost: vi.fn(),
            pubkeyHex: 'a'.repeat(64),
            inboundInteractionSave: {
                revision: 1,
                parentEventIds: [parentEventId],
            },
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: '返信 1件を表示' })).toBeTruthy();
        });
    });

    it('[reply-badge-preload] visible posts load cached direct reply badges without an explicit signal', async () => {
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
        const cachedReply = createDirectReplyEventRecord({
            eventId: '4'.repeat(64),
            parentEventId,
            content: '保存済み返信',
        });

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        replyEventsRepositoryMock.getDirectReplies.mockImplementation(async (parentId: string) =>
            parentId === parentEventId ? [cachedReply] : [],
        );

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onReplyPost: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: '返信 1件を表示' })).toBeTruthy();
        });
        expect(replyFetchServiceMock.fetchDirectReplies).not.toHaveBeenCalled();
    });

    it('[reply-badge-preload] scrollでは確認済みvisible parentを再読込しない', async () => {
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

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        replyEventsRepositoryMock.getDirectReplies.mockResolvedValue([]);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onReplyPost: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await findPostRepliesMenuAction();
        await wait(0);
        const replyReadsBeforeScroll =
            replyEventsRepositoryMock.getDirectReplies.mock.calls.length;

        const historyContainer = document.querySelector('.post-history-container') as HTMLDivElement;
        historyContainer.scrollTop = 160;
        await fireEvent.scroll(historyContainer);
        await wait(0);

        expect(replyEventsRepositoryMock.getDirectReplies).toHaveBeenCalledTimes(
            replyReadsBeforeScroll,
        );
    });

    it('[reply-badge-preload] visible posts追加時は新規visible parentだけを確認する', async () => {
        const firstParentEventId = '1'.repeat(64);
        const secondParentEventId = '2'.repeat(64);
        const firstPost = createRecord({
            eventId: firstParentEventId,
            content: '新しい投稿',
            createdAt: 1_700_000_100,
            postedAt: Date.UTC(2024, 0, 3, 3, 4, 0),
            rawEvent: {
                id: firstParentEventId,
                pubkey: 'a'.repeat(64),
                kind: 1,
                content: '新しい投稿',
                tags: [],
                created_at: 1_700_000_100,
                sig: 'c'.repeat(128),
            },
        });
        const secondPost = createRecord({
            eventId: secondParentEventId,
            content: '古い投稿',
            createdAt: 1_700_000_000,
            postedAt: Date.UTC(2024, 0, 2, 3, 4, 0),
            rawEvent: {
                id: secondParentEventId,
                pubkey: 'a'.repeat(64),
                kind: 1,
                content: '古い投稿',
                tags: [],
                created_at: 1_700_000_000,
                sig: 'd'.repeat(128),
            },
        });

        repositoryMock.getPage.mockResolvedValue([firstPost]);
        repositoryMock.countForPubkey.mockResolvedValue(2);
        repositoryMock.getOlderVisibleChunk.mockImplementation(async ({ cursor }: Record<string, any>) => {
            if (cursor?.eventId === firstParentEventId) {
                return [secondPost];
            }

            return [];
        });
        replyEventsRepositoryMock.getDirectReplies.mockResolvedValue([]);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onReplyPost: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await screen.findByText('新しい投稿');
        expect(replyEventsRepositoryMock.getDirectReplies).toHaveBeenCalledTimes(1);

        await fireEvent.click(await screen.findByRole('button', { name: 'さらに古い投稿を表示' }));

        await waitFor(() => {
            expect(screen.getByText('古い投稿')).toBeTruthy();
        });

        await waitFor(() => {
            expect(replyEventsRepositoryMock.getDirectReplies).toHaveBeenCalledTimes(2);
        });
        expect(replyEventsRepositoryMock.getDirectReplies.mock.calls).toEqual([
            [firstParentEventId],
            [secondParentEventId],
        ]);
    });

    it('[reply-badge-preload] cached reply badge からの表示切り替えでは再読込しない', async () => {
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
        const cachedReply = createDirectReplyEventRecord({
            content: 'cacheから即表示される返信',
            fetchedAt: Date.now(),
        });

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        replyEventsRepositoryMock.getDirectReplies.mockResolvedValue([cachedReply]);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onReplyPost: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: '返信 1件を表示' })).toBeTruthy();
        });
        expect(replyEventsRepositoryMock.getDirectReplies).toHaveBeenCalledTimes(1);

        await fireEvent.click(screen.getByRole('button', { name: '返信 1件を表示' }));

        await waitFor(() => {
            expect(screen.getByText('cacheから即表示される返信')).toBeTruthy();
        });

        expect(replyEventsRepositoryMock.getDirectReplies).toHaveBeenCalledTimes(2);
    });

    it('[reply-badge-preload] cached reaction summary をfooterで表示して集約パネルを開ける', async () => {
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
        const favoriteReaction = createDirectReplyEventRecord({
            eventId: '4'.repeat(64),
            authorPubkey: 'e'.repeat(64),
            kind: 7,
            content: '+',
            discoveredAs: ['reaction'],
            rawEvent: {
                id: '4'.repeat(64),
                pubkey: 'd'.repeat(64),
                kind: 7,
                content: '+',
                tags: [
                    ['p', 'a'.repeat(64)],
                    ['e', parentEventId],
                ],
                created_at: 1_700_000_010,
                sig: 'f'.repeat(128),
            },
        });
        const thumbsUpReaction = createDirectReplyEventRecord({
            eventId: '5'.repeat(64),
            authorPubkey: 'f'.repeat(64),
            kind: 7,
            content: '👍',
            discoveredAs: ['reaction'],
            rawEvent: {
                id: '5'.repeat(64),
                pubkey: 'e'.repeat(64),
                kind: 7,
                content: '👍',
                tags: [
                    ['p', 'a'.repeat(64)],
                    ['e', parentEventId],
                ],
                created_at: 1_700_000_011,
                sig: 'f'.repeat(128),
            },
        });
        const secondFavoriteReaction = createDirectReplyEventRecord({
            eventId: '6'.repeat(64),
            authorPubkey: 'f'.repeat(64),
            kind: 7,
            content: '+',
            discoveredAs: ['reaction'],
            rawEvent: {
                id: '6'.repeat(64),
                pubkey: 'f'.repeat(64),
                kind: 7,
                content: '+',
                tags: [
                    ['p', 'a'.repeat(64)],
                    ['e', parentEventId],
                ],
                created_at: 1_700_000_012,
                sig: 'f'.repeat(128),
            },
        });

        profilesRepositoryMock.get.mockImplementation(async (pubkey: string) => {
            if (pubkey === 'e'.repeat(64)) {
                return createProfile({
                    displayName: 'Alice',
                    name: 'alice',
                    picture: 'https://example.com/alice.png',
                });
            }

            if (pubkey === 'f'.repeat(64)) {
                return createProfile({
                    displayName: 'Bob',
                    name: 'bob',
                    picture: 'https://example.com/bob.png',
                });
            }

            return null;
        });

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        replyEventsRepositoryMock.getChildInteractions.mockResolvedValue([
            favoriteReaction,
            thumbsUpReaction,
            secondFavoriteReaction,
        ]);

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onReplyPost: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        const reactionButton = await screen.findByRole('button', {
            name: 'リアクション 3件を表示',
        });
        expect(replyEventsRepositoryMock.getChildInteractions).toHaveBeenCalledWith(parentEventId);
        expect(screen.queryByText('👍')).toBeNull();

        await fireEvent.click(reactionButton);

        await waitFor(() => {
            expect(screen.getByText('👍')).toBeTruthy();
        });
        expect(screen.queryByText('+')).toBeNull();
        expect(document.body.querySelectorAll('.post-preview-reaction-chip')).toHaveLength(2);
        expect(Array.from(document.body.querySelectorAll('.post-preview-reaction-count')).map((node) =>
            node.textContent?.trim(),
        )).toEqual(['2', '1']);
        await waitFor(() => {
            expect(Array.from(document.body.querySelectorAll('.post-preview-reaction-actor')).map((node) =>
                node.getAttribute('title'),
            )).toEqual(['Alice', 'Bob', 'Bob']);
        });
    });

    it('[reaction-custom-emoji-loading] 展開した reaction panel で custom emoji を preload して placeholder から画像へ切り替える', async () => {
        const parentEventId = '1'.repeat(64);
        const emojiUrl = 'https://example.com/blobcat.webp';
        const deferred = createDeferred<{
            ready: boolean;
            width?: number;
            height?: number;
            aspectRatio?: number;
        }>();
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
        const customEmojiReaction = createDirectReplyEventRecord({
            eventId: '4'.repeat(64),
            kind: 7,
            content: ':blobcat:',
            discoveredAs: ['reaction'],
            rawEvent: {
                id: '4'.repeat(64),
                pubkey: 'd'.repeat(64),
                kind: 7,
                content: ':blobcat:',
                tags: [
                    ['p', 'a'.repeat(64)],
                    ['e', parentEventId],
                    ['emoji', 'blobcat', emojiUrl],
                ],
                created_at: 1_700_000_010,
                sig: 'f'.repeat(128),
            },
        });

        customEmojiMock.preloadCustomEmojiImageWithMeta.mockReturnValueOnce(
            deferred.promise,
        );
        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        replyEventsRepositoryMock.getChildInteractions.mockResolvedValue([
            customEmojiReaction,
        ]);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onReplyPost: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        const reactionButton = await screen.findByRole('button', {
            name: 'リアクション 1件を表示',
        });

        await fireEvent.click(reactionButton);

        await waitFor(() => {
            expect(customEmojiMock.preloadCustomEmojiImageWithMeta).toHaveBeenCalledWith(
                emojiUrl,
            );
            expect(document.querySelector('.post-preview-reaction-emoji-placeholder')).toBeTruthy();
            expect(screen.queryByRole('img', { name: ':blobcat:' })).toBeNull();
            expect(screen.queryByText(':blobcat:')).toBeNull();
        });

        deferred.resolve({
            ready: true,
            width: 120,
            height: 60,
            aspectRatio: 2,
        });

        await waitFor(() => {
            const slot = document.querySelector(
                '.post-preview-reaction-emoji-slot',
            ) as HTMLSpanElement | null;
            expect(screen.getByRole('img', { name: ':blobcat:' })).toBeTruthy();
            expect(document.querySelector('.post-preview-reaction-emoji-placeholder')).toBeNull();
            expect(slot?.getAttribute('style')).toContain('36px');
            expect(slot?.getAttribute('style')).toContain('height: 18px');
        });
    });

    it('[reaction-custom-emoji-fallback] custom emoji preload 失敗時は shortcode のまま表示する', async () => {
        const parentEventId = '1'.repeat(64);
        const emojiUrl = 'https://example.com/party.webp';
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
        const customEmojiReaction = createDirectReplyEventRecord({
            eventId: '5'.repeat(64),
            kind: 7,
            content: ':party:',
            discoveredAs: ['reaction'],
            rawEvent: {
                id: '5'.repeat(64),
                pubkey: 'd'.repeat(64),
                kind: 7,
                content: ':party:',
                tags: [
                    ['p', 'a'.repeat(64)],
                    ['e', parentEventId],
                    ['emoji', 'party', emojiUrl],
                ],
                created_at: 1_700_000_011,
                sig: 'f'.repeat(128),
            },
        });

        customEmojiMock.preloadCustomEmojiImageWithMeta.mockResolvedValueOnce({
            ready: false,
        });
        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        replyEventsRepositoryMock.getChildInteractions.mockResolvedValue([
            customEmojiReaction,
        ]);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onReplyPost: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await fireEvent.click(await screen.findByRole('button', {
            name: 'リアクション 1件を表示',
        }));

        await waitFor(() => {
            expect(customEmojiMock.preloadCustomEmojiImageWithMeta).toHaveBeenCalledWith(
                emojiUrl,
            );
            expect(screen.getByText(':party:')).toBeTruthy();
            expect(document.querySelector('.post-preview-reaction-emoji-slot')).toBeNull();
        });
    });

    it('[reply-badge-preload] dialog reopenではvisible parentを再確認する', async () => {
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

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        replyEventsRepositoryMock.getDirectReplies.mockResolvedValue([]);

        const firstView = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onReplyPost: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await findPostRepliesMenuAction();
        expect(replyEventsRepositoryMock.getDirectReplies).toHaveBeenCalledTimes(1);

        firstView.unmount();

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onReplyPost: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await findPostRepliesMenuAction();
        expect(replyEventsRepositoryMock.getDirectReplies).toHaveBeenCalledTimes(2);
    });

    it('[inbound-realtime] dialog-open-refresh中の返信通知でも表示中投稿を維持してbadgeだけ更新する', async () => {
        const parentEventId = '1'.repeat(64);
        const post = createRecord({
            eventId: parentEventId,
            rawEvent: {
                id: parentEventId,
                pubkey: 'a'.repeat(64),
                kind: 1,
                content: 'open refresh中の親投稿',
                tags: [],
                created_at: 1_700_000_000,
                sig: 'c'.repeat(128),
            },
            content: 'open refresh中の親投稿',
            tags: [],
            media: [],
        });
        const realtimeReply = createDirectReplyEventRecord({
            eventId: '5'.repeat(64),
            parentEventId,
            content: 'open refresh中に保存された返信',
        });
        let storedReplies: any[] = [];

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        replyEventsRepositoryMock.getDirectReplies.mockImplementation(async (parentId: string) =>
            parentId === parentEventId ? storedReplies : [],
        );
        relayFetchServiceMock.fetchLatest.mockReturnValue({
            promise: new Promise(() => undefined),
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

        await openPostActionMenu();
        await waitFor(() => {
            expect(screen.getByText('open refresh中の親投稿')).toBeTruthy();
            expect(screen.getByText('リレーと同期中...')).toBeTruthy();
            expect(screen.getByRole('menuitem', { name: '返信を確認' })).toBeTruthy();
        });

        storedReplies = [realtimeReply];
        await view.rerender({
            show: true,
            onClose: vi.fn(),
            onReplyPost: vi.fn(),
            pubkeyHex: 'a'.repeat(64),
            rxNostr: {} as any,
            inboundInteractionSave: {
                revision: 1,
                parentEventIds: [parentEventId],
            },
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: '返信 1件を表示' })).toBeTruthy();
        });
        expect(screen.getAllByText('open refresh中の親投稿')).toHaveLength(1);
        expect(screen.queryByText('open refresh中に保存された返信')).toBeNull();
        expect(screen.getByText('リレーと同期中...')).toBeTruthy();
    });

    it('[inbound-realtime] closed dialog ignores saved reply and authored post UI signals', async () => {
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
        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        replyEventsRepositoryMock.getDirectReplies.mockResolvedValue([]);

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onReplyPost: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });
        expect(await findPostRepliesMenuAction()).toBeTruthy();
        const replyReadsBeforeCloseSignal = replyEventsRepositoryMock.getDirectReplies.mock.calls.length;
        const pageReadsBeforeCloseSignal = repositoryMock.getPage.mock.calls.length;

        await view.rerender({
            show: false,
            onClose: vi.fn(),
            onReplyPost: vi.fn(),
            pubkeyHex: 'a'.repeat(64),
            inboundInteractionSave: {
                revision: 1,
                parentEventIds: [parentEventId],
            },
            authoredSelfPostSave: {
                revision: 1,
                eventIds: [parentEventId],
            },
        });
        await Promise.resolve();

        expect(replyEventsRepositoryMock.getDirectReplies).toHaveBeenCalledTimes(replyReadsBeforeCloseSignal);
        expect(repositoryMock.getPage).toHaveBeenCalledTimes(pageReadsBeforeCloseSignal);
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

        await clickPostRepliesMenuAction();
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

    it('[thread-graph-children-prefetch] 既にloadedな親を開いた直後に子cardの孫返信badgeをcacheから反映する', async () => {
        const parentEventId = '1'.repeat(64);
        const childEventId = '4'.repeat(64);
        const grandchildEventId = '6'.repeat(64);
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
        const childReply = createDirectReplyEventRecord({
            eventId: childEventId,
            parentEventId,
            content: '子返信B',
            rawEvent: {
                id: childEventId,
                pubkey: 'd'.repeat(64),
                kind: 1,
                content: '子返信B',
                tags: [['e', parentEventId, 'wss://parent.example.com/', 'reply']],
                created_at: 1_700_000_010,
                sig: 'f'.repeat(128),
            },
        });
        const grandchildReply = createDirectReplyEventRecord({
            eventId: grandchildEventId,
            parentEventId: childEventId,
            authorPubkey: 'e'.repeat(64),
            content: '孫返信C',
            rawEvent: {
                id: grandchildEventId,
                pubkey: 'e'.repeat(64),
                kind: 1,
                content: '孫返信C',
                tags: [['e', childEventId, 'wss://reply.example.com/', 'reply']],
                created_at: 1_700_000_020,
                sig: 'b'.repeat(128),
            },
        });

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        replyEventsRepositoryMock.getDirectReplies.mockImplementation(async (parentId: string) => {
            if (parentId === parentEventId) {
                return [childReply];
            }

            if (parentId === childEventId) {
                return [grandchildReply];
            }

            return [];
        });

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onReplyPost: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
            },
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: '返信 1件を表示' })).toBeTruthy();
        });

        await fireEvent.click(screen.getByRole('button', { name: '返信 1件を表示' }));
        await waitFor(() => {
            expect(screen.getByText('子返信B')).toBeTruthy();
        });

        const childCard = screen.getByText('子返信B').closest('.post-history-related-card');
        expect(childCard).toBeTruthy();
        await waitFor(() => {
            expect(
                within(childCard as HTMLElement)
                    .getByRole('button', { name: '返信 1件を表示' }),
            ).toBeTruthy();
        });

        expect(replyFetchServiceMock.fetchDirectReplies).not.toHaveBeenCalled();
    });

    it('[thread-graph-children-prefetch] cache未登録の他人孫返信もrelayConfig付きprefetchでbadge表示する', async () => {
        const parentEventId = '1'.repeat(64);
        const childEventId = '4'.repeat(64);
        const grandchildEventId = '6'.repeat(64);
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
        const childReply = createDirectReplyEventRecord({
            eventId: childEventId,
            parentEventId,
            authorPubkey: 'd'.repeat(64),
            content: '子返信B',
            rawEvent: {
                id: childEventId,
                pubkey: 'd'.repeat(64),
                kind: 1,
                content: '子返信B',
                tags: [['e', parentEventId, 'wss://parent.example.com/', 'reply']],
                created_at: 1_700_000_010,
                sig: 'f'.repeat(128),
            },
        });
        const grandchildReply = createDirectReplyEventRecord({
            eventId: grandchildEventId,
            parentEventId: childEventId,
            authorPubkey: 'f'.repeat(64),
            content: '未保存の他人孫返信C',
            rawEvent: {
                id: grandchildEventId,
                pubkey: 'f'.repeat(64),
                kind: 1,
                content: '未保存の他人孫返信C',
                tags: [['e', childEventId, 'wss://reply.example.com/', 'reply']],
                created_at: 1_700_000_020,
                sig: 'b'.repeat(128),
            },
        });
        const storedRepliesByParent = new Map<string, any[]>([
            [parentEventId, [childReply]],
        ]);

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        replyEventsRepositoryMock.getDirectReplies.mockImplementation(async (parentId: string) =>
            storedRepliesByParent.get(parentId) ?? [],
        );
        replyEventsRepositoryMock.upsertDirectReplies.mockImplementation(async ({ parentEventId, events }: any) => {
            storedRepliesByParent.set(parentEventId, events.map((item: any) =>
                item.event.id === childEventId
                    ? childReply
                    : grandchildReply,
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
                        events: [{
                            event: childReply.rawEvent,
                            relayUrls: ['wss://relay.example.com/'],
                        }],
                        fetchedAt: 1_700_000_030,
                        relayUrls: ['wss://relay.example.com/'],
                    }),
                    cancel: vi.fn(),
                };
            }

            const hasEventIds = Array.isArray(params.eventIds) && params.eventIds.includes(childEventId);
            if (hasEventIds && params.relayConfig) {
                return {
                    promise: Promise.resolve({
                        events: [{
                            event: grandchildReply.rawEvent,
                            relayUrls: ['wss://remote.example/'],
                        }],
                        fetchedAt: 1_700_000_040,
                        relayUrls: ['wss://remote.example/'],
                    }),
                    cancel: vi.fn(),
                };
            }

            return {
                promise: Promise.resolve({
                    events: [],
                    fetchedAt: 1_700_000_040,
                    relayUrls: [],
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
                relayConfig: {
                    'wss://remote.example/': { read: true, write: false },
                },
            },
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: '返信 1件を表示' })).toBeTruthy();
        });

        await fireEvent.click(screen.getByRole('button', { name: '返信 1件を表示' }));
        await waitFor(() => {
            expect(screen.getByText('子返信B')).toBeTruthy();
        });

        const childCard = screen.getByText('子返信B').closest('.post-history-related-card');
        expect(childCard).toBeTruthy();
        await waitFor(() => {
            expect(
                within(childCard as HTMLElement)
                    .getByRole('button', { name: '返信 1件を表示' }),
            ).toBeTruthy();
        });
    });

    it('[thread-graph-children-prefetch] cache未登録の他人孫返信を短いprefetch条件で取りこぼさずbadge表示する', async () => {
        const parentEventId = '1'.repeat(64);
        const childEventId = '4'.repeat(64);
        const grandchildEventId = '6'.repeat(64);
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
        const childReply = createDirectReplyEventRecord({
            eventId: childEventId,
            parentEventId,
            authorPubkey: 'd'.repeat(64),
            content: '子返信B',
            rawEvent: {
                id: childEventId,
                pubkey: 'd'.repeat(64),
                kind: 1,
                content: '子返信B',
                tags: [['e', parentEventId, 'wss://parent.example.com/', 'reply']],
                created_at: 1_700_000_010,
                sig: 'f'.repeat(128),
            },
        });
        const grandchildReply = createDirectReplyEventRecord({
            eventId: grandchildEventId,
            parentEventId: childEventId,
            authorPubkey: 'f'.repeat(64),
            content: '未保存の他人孫返信C',
            rawEvent: {
                id: grandchildEventId,
                pubkey: 'f'.repeat(64),
                kind: 1,
                content: '未保存の他人孫返信C',
                tags: [['e', childEventId, 'wss://reply.example.com/', 'reply']],
                created_at: 1_700_000_020,
                sig: 'b'.repeat(128),
            },
        });

        const storedRepliesByParent = new Map<string, any[]>([
            [parentEventId, [childReply]],
        ]);

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        replyEventsRepositoryMock.getDirectReplies.mockImplementation(async (parentId: string) =>
            storedRepliesByParent.get(parentId) ?? [],
        );
        replyEventsRepositoryMock.upsertDirectReplies.mockImplementation(async ({ parentEventId, events }: any) => {
            storedRepliesByParent.set(parentEventId, events.map((item: any) =>
                item.event.id === childEventId
                    ? childReply
                    : grandchildReply,
            ));
            const hasGrandchild = events.some((item: any) => item.event.id === grandchildEventId);
            return {
                insertedCount: hasGrandchild ? 1 : events.length,
                updatedCount: 0,
                unchangedCount: 0,
                ignoredCount: 0,
            };
        });
        replyFetchServiceMock.fetchDirectReplies.mockImplementation((_rxNostr: any, params: any) => {
            if (Array.isArray(params.eventIds) && params.eventIds.includes(childEventId)) {
                const canDiscoverGrandchild = !params.timeoutMs && !params.relayLimit;
                return {
                    promise: Promise.resolve({
                        events: canDiscoverGrandchild
                            ? [{ event: grandchildReply.rawEvent, relayUrls: ['wss://remote.example/'] }]
                            : [],
                        fetchedAt: 1_700_000_040,
                        relayUrls: ['wss://remote.example/'],
                    }),
                    cancel: vi.fn(),
                };
            }

            return {
                promise: Promise.resolve({
                    events: [],
                    fetchedAt: 1_700_000_040,
                    relayUrls: [],
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

        await waitFor(() => {
            expect(screen.getByRole('button', { name: '返信 1件を表示' })).toBeTruthy();
        });

        await fireEvent.click(screen.getByRole('button', { name: '返信 1件を表示' }));
        await waitFor(() => {
            expect(screen.getByText('子返信B')).toBeTruthy();
        });

        const childCard = screen.getByText('子返信B').closest('.post-history-related-card');
        expect(childCard).toBeTruthy();
        await waitFor(() => {
            expect(
                within(childCard as HTMLElement)
                    .getByRole('button', { name: '返信 1件を表示' }),
            ).toBeTruthy();
        });
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

        await clickPostRepliesMenuAction();
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
        expect((replyBCard as HTMLElement).querySelector('.post-preview-replies-badge-button')).toBeNull();

        await fireEvent.click(
            within(replyBCard as HTMLElement)
                .getByRole('button', { name: 'アクションを表示' }),
        );
        const replyBRepliesAction = await screen.findByRole('menuitem', {
            name: '返信を再確認',
        });
        expect(replyBRepliesAction.querySelector('.find_in_page-icon')).toBeTruthy();

        await fireEvent.click(replyBRepliesAction);
        await waitFor(() => {
            expect(replyFetchServiceMock.fetchDirectReplies).toHaveBeenCalledTimes(3);
        });
        expect(screen.getAllByText('親投稿A')).toHaveLength(1);
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

        await clickPostRepliesMenuAction();
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
        const checkRepliesAction = await findPostRepliesMenuAction();
        expect(screen.queryByRole('button', { name: '返信を確認' })).toBeNull();
        expect(checkRepliesAction.querySelector('.find_in_page-icon')).toBeTruthy();
        expect(document.body.querySelector('.forum-icon')).toBeNull();
        expect(document.body.querySelector('.question-answer-icon')).toBeNull();

        await fireEvent.click(checkRepliesAction);

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

    it('[direct-replies] 返信確認loading中はfooterに返信バッジを出さずmenu項目だけをdisabled表示する', async () => {
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

        await clickPostRepliesMenuAction();
        await openPostActionMenu();

        await waitFor(() => {
            const loadingAction = screen.getByRole('menuitem', { name: '返信を確認中' });
            expect(loadingAction.getAttribute('data-disabled')).not.toBeNull();
            expect(loadingAction.querySelector('.find_in_page-icon')).toBeTruthy();
        });
        expect(screen.queryByRole('button', { name: '返信を確認中' })).toBeNull();
        expect(screen.queryByText('返信を取得中...')).toBeNull();

        deferredFetch.resolve({
            events: [],
            fetchedAt: 1_700_000_030,
            relayUrls: ['wss://relay.example.com/'],
        });

        await waitFor(() => {
            expect(screen.getByRole('menuitem', { name: '返信を再確認' })).toBeTruthy();
        });
        expect(screen.queryByText('この範囲では返信が見つかりませんでした')).toBeNull();
        expect(screen.queryByRole('button', { name: '再試行' })).toBeNull();
        expect(screen.queryByRole('button', { name: '返信を再確認' })).toBeNull();
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

        await clickPostRepliesMenuAction();
        await waitFor(() => {
            expect(screen.getByText('既存返信B')).toBeTruthy();
            expect(screen.getByRole('button', { name: '返信を隠す' }).querySelector('.post-preview-replies-badge')?.textContent).toBe('1');
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
            expect(screen.getByRole('button', { name: '返信を隠す' }).querySelector('.post-preview-replies-badge')?.textContent).toBe('2');
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

        await clickPostRepliesMenuAction();
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
            expect(screen.getByRole('button', { name: '返信を隠す' }).querySelector('.post-preview-replies-badge')?.textContent).toBe('2');
        });
        expect(screen.getAllByText('既存返信B')).toHaveLength(1);
        expect(replyFetchServiceMock.fetchDirectReplies).toHaveBeenCalledTimes(2);
        expect(screen.queryByText('この範囲では返信が見つかりませんでした')).toBeNull();
        expect(screen.queryByRole('button', { name: '再試行' })).toBeNull();
        expect(screen.queryByText('0')).toBeNull();
    });

    it('[direct-replies-cache-first] cached repliesはdeletion fetch完了前に表示する', async () => {
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
        const cachedReply = createDirectReplyEventRecord({
            content: 'cacheから即表示される返信',
            fetchedAt: Date.now(),
        });
        const deferredDeletion = createDeferred<any>();

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        replyEventsRepositoryMock.getDirectReplies.mockResolvedValue([cachedReply]);
        deletionFetchServiceMock.fetchDeletionRequests.mockReturnValue({
            promise: deferredDeletion.promise,
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

        await clickPostRepliesMenuAction();

        await waitFor(() => {
            expect(deletionFetchServiceMock.fetchDeletionRequests).toHaveBeenCalled();
            expect(screen.getByText('cacheから即表示される返信')).toBeTruthy();
            expect(screen.getByRole('button', { name: '返信を隠す' }).querySelector('.post-preview-replies-badge')?.textContent).toBe('1');
        });
        expect(replyFetchServiceMock.fetchDirectReplies).not.toHaveBeenCalled();
    });

    it('[direct-replies-cache-first] profile fetch未解決でもcached reply本文を表示する', async () => {
        const parentEventId = '1'.repeat(64);
        const deferredProfile = createDeferred<any>();
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
        const cachedReply = createDirectReplyEventRecord({
            content: 'profile待ちでも見える返信',
            fetchedAt: Date.now(),
        });

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        replyEventsRepositoryMock.getDirectReplies.mockResolvedValue([cachedReply]);
        profileFetchDataMock.mockReturnValue(deferredProfile.promise);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onReplyPost: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await clickPostRepliesMenuAction();

        await waitFor(() => {
            expect(profileFetchDataMock).toHaveBeenCalled();
            expect(screen.getByText('profile待ちでも見える返信')).toBeTruthy();
        });
        expect(screen.queryByText('Profile Loaded User')).toBeNull();

        deferredProfile.resolve(createProfile({ displayName: 'Profile Loaded User' }));
        await waitFor(() => {
            expect(screen.getByText('Profile Loaded User')).toBeTruthy();
        });
        expect(replyFetchServiceMock.fetchDirectReplies).not.toHaveBeenCalled();
    });

    it('[direct-replies-cache-first] cached profile hitも追加操作なしで表示中cardへmergeする', async () => {
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
        const cachedReply = createDirectReplyEventRecord({
            content: 'cached profileの返信',
            fetchedAt: Date.now(),
        });

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        replyEventsRepositoryMock.getDirectReplies.mockResolvedValue([cachedReply]);
        profilesRepositoryMock.get.mockResolvedValue(createProfile({ displayName: 'Cached Profile User' }));

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onReplyPost: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await clickPostRepliesMenuAction();

        await waitFor(() => {
            expect(screen.getByText('cached profileの返信')).toBeTruthy();
            expect(screen.getByText('Cached Profile User')).toBeTruthy();
        });
    });

    it('[direct-replies-cache-first] 同じpubkeyの複数nodeへprofileをmergeする', async () => {
        const parentEventId = '1'.repeat(64);
        const sharedPubkey = 'd'.repeat(64);
        const deferredProfile = createDeferred<any>();
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
            authorPubkey: sharedPubkey,
            content: '同じ作者の返信1',
            fetchedAt: Date.now(),
        });
        const secondReply = createDirectReplyEventRecord({
            eventId: '6'.repeat(64),
            authorPubkey: sharedPubkey,
            content: '同じ作者の返信2',
            rawEvent: {
                id: '6'.repeat(64),
                pubkey: sharedPubkey,
                kind: 1,
                content: '同じ作者の返信2',
                tags: [['e', parentEventId, 'wss://parent.example.com/', 'reply']],
                created_at: 1_700_000_020,
                sig: 'f'.repeat(128),
            },
            fetchedAt: Date.now(),
        });

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        replyEventsRepositoryMock.getDirectReplies.mockResolvedValue([firstReply, secondReply]);
        profileFetchDataMock.mockReturnValue(deferredProfile.promise);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onReplyPost: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await clickPostRepliesMenuAction();
        await waitFor(() => {
            expect(screen.getByText('同じ作者の返信1')).toBeTruthy();
            expect(screen.getByText('同じ作者の返信2')).toBeTruthy();
        });

        deferredProfile.resolve(createProfile({ displayName: 'Shared Profile User' }));
        await waitFor(() => {
            expect(screen.getAllByText('Shared Profile User')).toHaveLength(2);
        });
        expect(
            profileFetchDataMock.mock.calls.filter(([pubkey]) => pubkey === sharedPubkey),
        ).toHaveLength(1);
    });

    it('[direct-replies-cache-first] dialog close後にprofile fetchが解決しても閉じたgraphへ反映しない', async () => {
        const parentEventId = '1'.repeat(64);
        const deferredProfile = createDeferred<any>();
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
        const cachedReply = createDirectReplyEventRecord({
            content: 'close前の返信',
            fetchedAt: Date.now(),
        });

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        replyEventsRepositoryMock.getDirectReplies.mockResolvedValue([cachedReply]);
        profileFetchDataMock.mockReturnValue(deferredProfile.promise);

        const { rerender } = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onReplyPost: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await clickPostRepliesMenuAction();
        await waitFor(() => {
            expect(screen.getByText('close前の返信')).toBeTruthy();
            expect(profileFetchDataMock).toHaveBeenCalled();
        });

        await rerender({
            show: false,
            onClose: vi.fn(),
            onReplyPost: vi.fn(),
            pubkeyHex: 'a'.repeat(64),
            rxNostr: {} as any,
        });
        deferredProfile.resolve(createProfile({ displayName: 'Closed Profile User' }));
        await wait(20);

        expect(screen.queryByText('Closed Profile User')).toBeNull();
    });

    it('[direct-replies-revalidate] TTL内の再表示では再取得しない', async () => {
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
        const cachedReply = createDirectReplyEventRecord({
            content: 'TTL内の返信',
            fetchedAt: Date.now(),
        });

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        replyEventsRepositoryMock.getDirectReplies.mockResolvedValue([cachedReply]);

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onReplyPost: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        await clickPostRepliesMenuAction();
        await waitFor(() => {
            expect(screen.getByText('TTL内の返信')).toBeTruthy();
        });
        await fireEvent.click(screen.getByRole('button', { name: '返信を隠す' }));
        await waitFor(() => {
            expect(screen.getByRole('button', { name: '返信 1件を表示' })).toBeTruthy();
        });
        await fireEvent.click(screen.getByRole('button', { name: '返信 1件を表示' }));

        await waitFor(() => {
            expect(screen.getByText('TTL内の返信')).toBeTruthy();
        });
        expect(replyFetchServiceMock.fetchDirectReplies).not.toHaveBeenCalled();
    });

    it('[direct-replies-revalidate] TTL切れでは即表示しつつbackground revalidateで新規replyをmergeする', async () => {
        const parentEventId = '1'.repeat(64);
        const newReplyEventId = '6'.repeat(64);
        const deferredFetch = createDeferred<any>();
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
        const cachedReply = createDirectReplyEventRecord({
            content: 'TTL切れcached返信',
            fetchedAt: Date.now() - 6 * 60 * 1_000,
        });
        const newReply = createDirectReplyEventRecord({
            eventId: newReplyEventId,
            authorPubkey: 'e'.repeat(64),
            content: 'backgroundで増えた返信',
            rawEvent: {
                id: newReplyEventId,
                pubkey: 'e'.repeat(64),
                kind: 1,
                content: 'backgroundで増えた返信',
                tags: [['e', parentEventId, 'wss://parent.example.com/', 'reply']],
                created_at: 1_700_000_020,
                sig: 'f'.repeat(128),
            },
        });
        let storedReplies = [cachedReply];

        repositoryMock.getPage.mockResolvedValue([post]);
        repositoryMock.countForPubkey.mockResolvedValue(1);
        replyEventsRepositoryMock.getDirectReplies.mockImplementation(async () => storedReplies);
        replyEventsRepositoryMock.upsertDirectReplies.mockImplementation(async ({ events }: any) => {
            for (const item of events) {
                if (item.event.id === newReplyEventId && !storedReplies.some((reply) => reply.eventId === newReplyEventId)) {
                    storedReplies = [...storedReplies, newReply];
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

        await clickPostRepliesMenuAction();

        await waitFor(() => {
            expect(screen.getByText('TTL切れcached返信')).toBeTruthy();
            expect(replyFetchServiceMock.fetchDirectReplies).toHaveBeenCalled();
        });
        expect(screen.queryByText('backgroundで増えた返信')).toBeNull();

        deferredFetch.resolve({
            events: [
                { event: cachedReply.rawEvent, relayUrls: ['wss://relay.example.com/'] },
                { event: newReply.rawEvent, relayUrls: ['wss://relay.example.com/'] },
            ],
            fetchedAt: Date.now(),
            relayUrls: ['wss://relay.example.com/'],
        });

        await waitFor(() => {
            expect(screen.getByText('TTL切れcached返信')).toBeTruthy();
            expect(screen.getByText('backgroundで増えた返信')).toBeTruthy();
            expect(screen.getByRole('button', { name: '返信を隠す' }).querySelector('.post-preview-replies-badge')?.textContent).toBe('2');
        });
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

        await clickPostRepliesMenuAction();

        await waitFor(() => {
            expect(screen.queryByText('削除済み返信B')).toBeNull();
            expect(screen.getByText('残る返信C')).toBeTruthy();
            expect(screen.getByRole('button', { name: '返信を隠す' }).querySelector('.post-preview-replies-badge')?.textContent).toBe('1');
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

        await clickPostRepliesMenuAction();

        await waitFor(() => {
            expect(screen.getByText('表示される返信B')).toBeTruthy();
            expect(screen.getByRole('button', { name: '返信を隠す' }).querySelector('.post-preview-replies-badge')?.textContent).toBe('1');
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

        await clickPostRepliesMenuAction();

        await waitFor(() => {
            expect(screen.queryByText('cached削除済み返信B')).toBeNull();
        });
        expect(await findPostRepliesMenuAction('返信を再確認')).toBeTruthy();
        expect(screen.queryByRole('button', { name: '返信を再確認' })).toBeNull();
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

        await clickPostRepliesMenuAction('返信を確認', parentHistoryItem as HTMLElement);
        await waitFor(() => {
            expect(screen.getAllByText('削除対象返信B')).toHaveLength(2);
            expect(screen.getByText('残る返信C')).toBeTruthy();
            expect(parentQueries.getByRole('button', { name: '返信を隠す' }).querySelector('.post-preview-replies-badge')?.textContent).toBe('2');
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
            expect(parentQueries.getByRole('button', { name: '返信を隠す' }).querySelector('.post-preview-replies-badge')?.textContent).toBe('1');
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
            expect(parentQueries.getByRole('button', { name: '返信を隠す' }).querySelector('.post-preview-replies-badge')?.textContent).toBe('1');
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

    it('[delete-local-history] 保存済み投稿履歴クリアは ConfirmDialog を経由し、同期進捗を維持して空状態へ戻す', async () => {
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
        await fireEvent.click(await screen.findByRole('menuitem', { name: '保存済み投稿履歴をクリア' }));

        expect(repositoryMock.deleteForPubkey).not.toHaveBeenCalled();
        expect(await screen.findByText('保存済み投稿履歴をクリア')).toBeTruthy();
        const descriptions = await screen.findAllByText(/Nostrリレー上の投稿は削除されません/);
        expect(descriptions).toHaveLength(2);
        expect(descriptions[0]?.textContent).toContain('後で同期や再取得によって再び表示される場合があります');
        expect(screen.queryByText(/同期記録/)).toBeNull();
        expect(screen.queryByText(/元に戻せません/)).toBeNull();

        repositoryMock.countForPubkey.mockResolvedValue(0);
        repositoryMock.getPage.mockResolvedValue([]);

        await fireEvent.click(screen.getByRole('button', { name: 'クリアする' }));

        await waitFor(() => {
            expect(repositoryMock.deleteForPubkey).toHaveBeenCalledWith('a'.repeat(64));
            expect(replyEventsRepositoryMock.deleteForPostHistoryPubkey).toHaveBeenCalledWith('a'.repeat(64));
            expect(visibleRangeRepositoryMock.clearForPubkey).toHaveBeenCalledWith('a'.repeat(64));
            expect(authoredSyncStateRepositoryMock.clearForPubkey).not.toHaveBeenCalled();
            expect(inboundInteractionsSyncStateRepositoryMock.clearForPubkey).not.toHaveBeenCalled();
            expect(screen.getByText('投稿履歴はありません')).toBeTruthy();
            expect(screen.queryByText('削除対象')).toBeNull();
        });
    });

});
