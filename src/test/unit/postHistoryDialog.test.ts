import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { readable } from 'svelte/store';

const mockTranslate = vi.hoisted(() => (key: string, options?: { values?: Record<string, unknown> }) => {
    const translations: Record<string, string> = {
        'postHistory.title': '投稿履歴',
        'postHistory.description': 'eHagakiで投稿に成功した履歴です。',
        'postHistory.empty': '投稿履歴はありません',
        'postHistory.syncing': 'リレーと同期中...',
        'postHistory.synced': 'リレーとの同期が完了しました',
        'postHistory.syncFailed': 'リレーとの同期に失敗しました',
        'postHistory.noMorePosts': 'これ以上古い投稿はありません',
        'postHistory.copyNevent': 'neventをコピー',
        'postHistory.copied': 'コピーしました',
        'postHistory.copyFailed': 'コピーに失敗しました',
        'postHistory.eventId': 'event id',
        'postHistory.media': 'メディア',
        'postHistory.deleted': '削除済み',
        'postHistory.previousPage': '前へ',
        'postHistory.nextPage': '次へ',
        'postHistory.channel': 'チャンネル',
        'postHistory.channelLoading': '読み込み中...',
        'postHistory.channelUnknown': '不明',
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

const nostrUtilsMock = vi.hoisted(() => ({
    toNevent: vi.fn(() => 'nevent1mock'),
}));

vi.mock('svelte-i18n', () => ({
    _: readable(mockTranslate),
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

vi.mock('../../lib/storage/channelMetadataRepository', () => ({
    channelMetadataRepository: channelMetadataRepositoryMock,
}));

vi.mock('../../lib/channelContextService', () => ({
    ChannelContextService: vi.fn(() => channelContextServiceMock),
}));

vi.mock('../../lib/utils/clipboardUtils', () => clipboardMock);

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

describe('PostHistoryDialog', () => {
    beforeEach(() => {
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
    });

    it('空の投稿履歴を表示する', async () => {
        render(PostHistoryDialog, {
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
            expect(screen.getByText('投稿履歴はありません')).toBeTruthy();
        });
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
            expect(screen.getByText(/投稿本文 https:\/\/example.com\/image.jpg/)).toBeTruthy();
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
            expect(screen.getByText(/投稿本文 https:\/\/example.com\/image.jpg/)).toBeTruthy();
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
            expect(screen.getByText(/投稿本文 https:\/\/example.com\/image.jpg/)).toBeTruthy();
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
            expect(screen.getByText(/投稿本文 https:\/\/example.com\/image.jpg/)).toBeTruthy();
        });

        expect(repositoryMock.upsertFetchedEvents).not.toHaveBeenCalled();
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
            expect(screen.getByText(/投稿本文 https:\/\/example.com\/image.jpg/)).toBeTruthy();
            expect(screen.queryByText('メディア: image 1')).toBeNull();
        });

        await fireEvent.click(screen.getByRole('button', { name: 'neventをコピー' }));

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

        await fireEvent.click(screen.getByRole('button', { name: 'neventをコピー' }));

        expect(screen.getByText('コピーに失敗しました')).toBeTruthy();
    });
});
