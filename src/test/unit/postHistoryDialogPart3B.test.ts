import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import {
    PostHistoryDialog,
    channelContextServiceMock,
    channelMetadataRepositoryMock,
    cleanupPostHistoryDialogHarness,
    clipboardMock,
    customEmojiImageMetaRepositoryMock,
    customEmojiMock,
    localSearchServiceMock,
    nostrUtilsMock,
    postDeletionServiceMock,
    postMediaCacheServiceMock,
    relayFetchServiceMock,
    repairServiceMock,
    repositoryMock,
    resetPostHistoryDialogHarness,
    visibleRangeRepositoryMock,
} from './postHistoryDialogTestHarness';
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
    await fireEvent.click(await screen.findByRole('menuitem', { name: '検索' }));
    return screen.findByRole('searchbox', { name: '検索' }) as Promise<HTMLInputElement>;
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
        resetPostHistoryDialogHarness({ listingMode: 'page-adapter' });
    });

    afterEach(() => {
        cleanupPostHistoryDialogHarness();
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
            expect(screen.getByText('1件')).toBeTruthy();
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
        channelMetadataRepositoryMock.get.mockResolvedValue(
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
        );

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
            expect(channelContextServiceMock.resolveChannelMetadataWithInternalHints).not.toHaveBeenCalled();
        });

        const actionTrigger = screen.getAllByRole('button', { name: 'アクションを表示' })[0];
        await fireEvent.click(actionTrigger);
        await fireEvent.click(await screen.findByRole('menuitem', { name: 'neventをコピー' }));

        await waitFor(() => {
            expect(screen.queryByRole('menuitem', { name: 'neventをコピー' })).toBeNull();
        });

        expect(nostrUtilsMock.toNevent).toHaveBeenCalledWith(expect.objectContaining({
            eventId: 'channel-search',
            kind: 42,
        }));

        expect(await screen.findByText('コピーしました')).toBeTruthy();
        await fireEvent.click(actionTrigger);
        expect(await screen.findByRole('menuitem', { name: 'neventをコピー' })).toBeTruthy();
        expect(screen.queryByRole('menuitem', { name: 'コピーしました' })).toBeNull();
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
