import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import {
    PUBKEY_HEX,
    PostHistoryDialog,
    cleanupPostHistoryDialogHarness,
    clickMenuAction,
    createDeferred,
    createRecord,
    createRelayFetchResult,
    getHistoryContainer,
    jumpCacheAnchorRepositoryMock,
    openPostHistoryMenu,
    postMediaCacheServiceMock,
    relayFetchServiceMock,
    replyRepairServiceMock,
    repairServiceMock,
    repositoryMock,
    resetPostHistoryDialogHarness,
    visibleRangeRepositoryMock,
} from './postHistoryDialogTestHarness';
import { classifyPostHistoryInboundInteraction } from '../../lib/postHistoryInboundInteractionClassifier';
import { PostHistoryInboundReplyReconciliationService } from '../../lib/postHistoryInboundReplyReconciliationService';

async function clickEnabledMenuAction(name: string): Promise<void> {
    await openPostHistoryMenu();
    const item = await screen.findByRole('menuitem', { name });
    await waitFor(() => {
        expect(item.hasAttribute('data-disabled')).toBe(false);
    });
    item.focus();
    await fireEvent.keyDown(item, { key: 'Enter', code: 'Enter' });
    await fireEvent.click(item);
}

async function clickRelayFetchButton(): Promise<void> {
    await waitFor(() => {
        expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalled();
    });
    await new Promise((resolve) => setTimeout(resolve, 0));
    const button = await screen.findByRole('button', { name: 'リレーから続きを取得' });
    await waitFor(() => {
        expect(button.hasAttribute('disabled')).toBe(false);
    });
    await fireEvent.click(button);
}

describe('PostHistoryDialog timeline relay flows', () => {
    beforeEach(() => {
        resetPostHistoryDialogHarness();
    });

    afterEach(() => {
        cleanupPostHistoryDialogHarness();
    });

    it('inbound recent pending reply is saved when authored dialog-open-refresh stores its self parent later', async () => {
        const parentEventId = '1'.repeat(64);
        const replyEvent = {
            id: '2'.repeat(64),
            pubkey: 'b'.repeat(64),
            kind: 1,
            content: 'recent unknown parent reply',
            tags: [
                ['p', PUBKEY_HEX],
                ['e', parentEventId, '', 'reply'],
            ],
            created_at: 1_700_000_010,
            sig: 'c'.repeat(128),
        };
        const selfParent = {
            id: parentEventId,
            pubkey: PUBKEY_HEX,
            kind: 1,
            content: 'remote parent',
            tags: [],
            created_at: 1_700_000_000,
            sig: 'd'.repeat(128),
        };
        const upsertChildInteractions = vi.fn(async () => ({
            insertedCount: 1,
            updatedCount: 0,
            unchangedCount: 0,
            ignoredCount: 0,
        }));
        const replyEventsRepository = {
            upsertChildInteractions,
            upsertDirectReplies: upsertChildInteractions,
        };
        const session = new PostHistoryInboundReplyReconciliationService({
            postHistoryRepository: {
                getExistingEventIdsForPubkey: vi.fn(async () => []),
                upsertFetchedEvents: vi.fn(),
            },
            postHistoryChildInteractionsRepository: replyEventsRepository,
            selfParentFetchService: {
                fetchSelfParent: vi.fn(() => ({
                    promise: new Promise<{ event: typeof selfParent | null; relayUrl: string | null }>(
                        () => undefined,
                    ),
                    cancel: vi.fn(),
                })),
            },
            console: { warn: vi.fn(), error: vi.fn() },
        }).createSession({} as any, {
            ownerPubkeyHex: PUBKEY_HEX,
        });
        await session.reconcile([{
            event: replyEvent,
            classification: classifyPostHistoryInboundInteraction({
                event: replyEvent,
                ownerPubkeyHex: PUBKEY_HEX,
                ownerPostEventIds: new Set(),
            }),
        }]);

        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([
            createRecord({ eventId: 'local-parent', content: 'local history' }),
        ]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        repositoryMock.upsertFetchedEvents.mockResolvedValue({
            insertedCount: 1,
            updatedCount: 0,
            unchangedCount: 0,
        });
        relayFetchServiceMock.fetchLatest.mockReturnValue({
            promise: Promise.resolve(createRelayFetchResult({
                events: [{ event: selfParent, relayUrls: ['wss://relay.example.com/'] }],
                fetchedAt: 1_700_000_020_000,
            })),
            cancel: vi.fn(),
        });

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
                notifySavedAuthoredPosts: (eventIds: string[]) =>
                    session.notifySelfPostsSaved(eventIds),
            },
        });

        await waitFor(() => {
            expect(replyEventsRepository.upsertDirectReplies).toHaveBeenCalledWith({
                parentEventId,
                events: [{ event: replyEvent }],
                fetchedAt: expect.any(Number),
            });
        });
    });

    it('ローカル履歴を即表示しつつ自動同期を開始し、close で cancel する', async () => {
        const cancel = vi.fn();
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getLatestVisibleChunk.mockResolvedValueOnce([
            createRecord({ eventId: 'sync-local', content: 'ローカル履歴' }),
        ]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValueOnce([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValueOnce([]);
        relayFetchServiceMock.fetchLatest.mockReturnValue({
            promise: new Promise(() => undefined),
            cancel,
        });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('ローカル履歴')).toBeTruthy();
            expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalled();
            expect(screen.getByText('リレーと同期中...')).toBeTruthy();
        });

        expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledWith(
            {} as any,
            expect.objectContaining({
                pubkeyHex: PUBKEY_HEX,
                reason: 'dialog-open-refresh',
                limit: 30,
                timeoutMs: 6000,
            }),
        );

        view.unmount();
        expect(cancel).toHaveBeenCalledOnce();
    });

    it('前回表示 snapshot があっても open 時にローカル履歴を読み直して送信済み投稿を即表示する', async () => {
        const oldPost = createRecord({
            eventId: 'snapshot-old',
            content: '前回表示済みの投稿',
            createdAt: 100,
            postedAt: 100_000,
        });
        const newPost = createRecord({
            eventId: 'local-new',
            content: '送信直後の投稿',
            createdAt: 200,
            postedAt: 200_000,
        });

        repositoryMock.countForPubkey
            .mockResolvedValueOnce(1)
            .mockResolvedValue(2);
        repositoryMock.getLatestVisibleChunk
            .mockResolvedValueOnce([oldPost])
            .mockResolvedValue([newPost, oldPost]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        relayFetchServiceMock.fetchLatest.mockReturnValue({
            promise: new Promise(() => undefined),
            cancel: vi.fn(),
        });

        const firstView = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('前回表示済みの投稿')).toBeTruthy();
        });
        firstView.unmount();

        const secondView = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('送信直後の投稿')).toBeTruthy();
        });
        expect(repositoryMock.getLatestVisibleChunk).toHaveBeenCalledTimes(2);

        secondView.unmount();
    });

    it('media descriptor prefetch が未解決でもローカル履歴を表示する', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([
            createRecord({
                eventId: 'prefetch-local',
                content: 'prefetchを待たずに表示',
                media: [{ url: 'https://example.com/image.webp' }],
            }),
        ]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        postMediaCacheServiceMock.canUsePersistentCache.mockReturnValue(true);
        postMediaCacheServiceMock.prefetchCachedMediaDescriptors.mockReturnValue(
            new Promise(() => undefined),
        );
        relayFetchServiceMock.fetchLatest.mockReturnValue({
            promise: new Promise(() => undefined),
            cancel: vi.fn(),
        });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('prefetchを待たずに表示')).toBeTruthy();
        });

        view.unmount();
    });

    it('dialog-open-refresh は TTL 中の再オープンでは繰り返さない', async () => {
        const post = createRecord({
            eventId: 'ttl-local',
            content: 'TTL対象の投稿',
        });
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([post]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        relayFetchServiceMock.fetchLatest.mockReturnValue({
            promise: Promise.resolve(createRelayFetchResult({ fetchedAt: 1000 })),
            cancel: vi.fn(),
        });

        const firstView = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledTimes(1);
        });
        firstView.unmount();

        const secondView = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('TTL対象の投稿')).toBeTruthy();
        });
        expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledTimes(1);

        secondView.unmount();
    });

    it('dialog-open-refresh は保守的継続時だけ notice を出し、close 後も既存 cursor から続ける', async () => {
        const nowSpy = vi.spyOn(Date, 'now').mockReturnValue(1000);
        const post = createRecord({
            eventId: 'cursor-local',
            content: 'cursor対象の投稿',
        });
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.countVisibleForPubkey.mockResolvedValue(1);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([post]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        repositoryMock.upsertFetchedEvents.mockResolvedValue({
            insertedCount: 0,
            updatedCount: 0,
            unchangedCount: 0,
        });
        relayFetchServiceMock.fetchLatest
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 1000,
                    hasMore: true,
                    nextUntil: 150,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 2000,
                    hasMore: true,
                    nextUntil: 300,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 3000,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            });

        try {
            const onClose = vi.fn();
            const { rerender } = render(PostHistoryDialog, {
                props: {
                    show: true,
                    onClose,
                    pubkeyHex: PUBKEY_HEX,
                    rxNostr: {} as any,
                },
            });

            const relayFetchButton = await screen.findByRole('button', { name: 'リレーから続きを取得' });
            await waitFor(() => {
                expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledTimes(1);
                expect(relayFetchButton.hasAttribute('disabled')).toBe(false);
                expect(screen.queryByText('未取得の投稿がまだある可能性があります。')).toBeNull();
            });

            await rerender({
                show: false,
                onClose,
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            });

            nowSpy.mockReturnValue(200_000);
            await rerender({
                show: true,
                onClose,
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            });

            await waitFor(() => {
                expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledTimes(2);
                expect(screen.getByRole('button', { name: 'リレーから続きを取得' })).toBeTruthy();
                expect(screen.queryByText('未取得の投稿がまだある可能性があります。')).toBeNull();
            });

            await rerender({
                show: false,
                onClose,
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            });

            nowSpy.mockReturnValue(200_001);
            await rerender({
                show: true,
                onClose,
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            });

            await waitFor(() => {
                expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledTimes(2);
                expect(screen.getByRole('button', { name: 'リレーから続きを取得' })).toBeTruthy();
                expect(screen.queryByText('未取得の投稿がまだある可能性があります。')).toBeNull();
            });

            await clickRelayFetchButton();

            await waitFor(() => {
                expect(relayFetchServiceMock.fetchLatest).toHaveBeenNthCalledWith(
                    3,
                    {} as any,
                    expect.objectContaining({
                        pubkeyHex: PUBKEY_HEX,
                        reason: 'older-backfill',
                        since: 0,
                        until: 149,
                    }),
                );
                expect(screen.queryByText('未取得の投稿がまだある可能性があります。')).toBeNull();
            });
        } finally {
            nowSpy.mockRestore();
        }
    });

    it('初回リレー同期は relay ごとの進行差が残る範囲を表示対象にしない', async () => {
        let visibleUntil: number | null = null;
        const latest = createRecord({
            eventId: 'initial-visible',
            content: '初回表示できる投稿',
            createdAt: 200,
            postedAt: Date.UTC(2024, 0, 3, 0, 0, 0),
        });
        const hiddenOlder = createRecord({
            eventId: 'initial-hidden',
            content: '初回ではまだ表示しない投稿',
            createdAt: 100,
            postedAt: Date.UTC(2024, 0, 2, 0, 0, 0),
        });

        visibleRangeRepositoryMock.get.mockImplementation(async () =>
            visibleUntil === null
                ? null
                : {
                    pubkeyHex: PUBKEY_HEX,
                    kindsKey: '1,42',
                    visibleUntil,
                    updatedAt: 1000,
                },
        );
        visibleRangeRepositoryMock.save.mockImplementation(async (range: {
            pubkeyHex: string;
            kindsKey: string;
            visibleUntil: number | null;
        }) => {
            visibleUntil = range.visibleUntil;
            return {
                ...range,
                updatedAt: 1000,
            };
        });
        repositoryMock.countForPubkey.mockResolvedValue(0);
        repositoryMock.countVisibleForPubkey.mockImplementation(async (_pubkeyHex: string, rangeUntil?: number | null) =>
            rangeUntil === 180 ? 1 : 2,
        );
        repositoryMock.getByEventId.mockResolvedValue(null);
        repositoryMock.getLatestVisibleChunk.mockImplementation(async (options: {
            visibleUntil?: number | null;
        }) => options.visibleUntil === 180 ? [latest] : []);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        repositoryMock.upsertFetchedEvents.mockResolvedValue({
            insertedCount: 2,
            updatedCount: 0,
            unchangedCount: 0,
        });
        relayFetchServiceMock.fetchLatest.mockReturnValueOnce({
            promise: Promise.resolve(createRelayFetchResult({
                fetchedAt: 1000,
                nextUntil: 180,
                oldestCreatedAt: 100,
                hasMore: true,
                events: [
                    {
                        event: {
                            id: latest.eventId,
                            pubkey: PUBKEY_HEX,
                            kind: 1,
                            content: latest.content,
                            tags: [],
                            created_at: latest.createdAt,
                            sig: 'c'.repeat(128),
                        },
                        relayUrls: ['wss://relay-a.example.com/'],
                    },
                    {
                        event: {
                            id: hiddenOlder.eventId,
                            pubkey: PUBKEY_HEX,
                            kind: 1,
                            content: hiddenOlder.content,
                            tags: [],
                            created_at: hiddenOlder.createdAt,
                            sig: 'd'.repeat(128),
                        },
                        relayUrls: ['wss://relay-b.example.com/'],
                    },
                ],
                relayUrls: [
                    'wss://relay-a.example.com/',
                    'wss://relay-b.example.com/',
                ],
            })),
            cancel: vi.fn(),
        });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(visibleRangeRepositoryMock.save).toHaveBeenCalledWith({
                pubkeyHex: PUBKEY_HEX,
                kindsKey: '1,42',
                visibleUntil: 180,
            });
            expect(screen.getByText('初回表示できる投稿')).toBeTruthy();
            expect(screen.queryByText('初回ではまだ表示しない投稿')).toBeNull();
            expect(screen.getByText('1件')).toBeTruthy();
        });

        view.unmount();
    });

    it('再取得 progress 中に総件数 summary を更新し、完了後に最新 window を再読込する', async () => {
        const initialPosts = Array.from({ length: 50 }, (_, index) => createRecord({
            eventId: `repair-initial-${index}`,
            content: `既存投稿 ${index + 1}`,
            createdAt: 1_704_326_400 - index,
            postedAt: Date.UTC(2024, 0, 2, 3, 4, 0) - index,
        }));
        const repairedPost = createRecord({
            eventId: 'repair-added',
            content: '修復された投稿',
            createdAt: 1_704_326_500,
            postedAt: Date.UTC(2024, 0, 3, 3, 4, 0),
        });
        const repairComplete = createDeferred<{
            status: 'success';
            addedCount: number;
            updatedCount: number;
            unchangedCount: number;
            processedRangeCount: number;
            processedRanges: any[];
            attemptedRangeCount: number;
            hadFailures: boolean;
        }>();

        repositoryMock.countForPubkey
            .mockResolvedValueOnce(50)
            .mockResolvedValueOnce(51)
            .mockResolvedValueOnce(51);
        repositoryMock.getLatestVisibleChunk
            .mockResolvedValueOnce(initialPosts)
            .mockResolvedValueOnce([repairedPost, ...initialPosts.slice(0, 49)]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([initialPosts.at(-1)]);
        relayFetchServiceMock.fetchLatest.mockReturnValueOnce({
            promise: Promise.resolve(createRelayFetchResult({ fetchedAt: 500 })),
            cancel: vi.fn(),
        });
        repairServiceMock.refetchAroundCurrentView.mockReturnValueOnce({
            promise: repairComplete.promise,
            cancel: vi.fn(),
        });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('50件')).toBeTruthy();
        });

        await waitFor(() => {
            expect(screen.queryByText('リレーと同期中...')).toBeNull();
        });

        await clickEnabledMenuAction('表示中の投稿付近を再取得');

        await waitFor(() => {
            expect(repairServiceMock.refetchAroundCurrentView).toHaveBeenCalledTimes(1);
        });

        const repairParams = repairServiceMock.refetchAroundCurrentView.mock.calls.at(-1)?.[1];
        await repairParams.onProgress({
            insertedCount: 1,
            updatedCount: 0,
            unchangedCount: 0,
            processedRangeCount: 1,
            attemptedRangeCount: 1,
            addedCount: 1,
            totalUpdatedCount: 0,
            totalUnchangedCount: 0,
        });

        await waitFor(() => {
            expect(screen.getByText('51件')).toBeTruthy();
        });

        repairComplete.resolve({
            status: 'success',
            addedCount: 1,
            updatedCount: 0,
            unchangedCount: 0,
            processedRangeCount: 1,
            processedRanges: [],
            attemptedRangeCount: 1,
            hadFailures: false,
        });

        await waitFor(() => {
            expect(screen.getByText('1件追加')).toBeTruthy();
            expect(screen.getByText('修復された投稿')).toBeTruthy();
        });

        view.unmount();
    });

    it('表示中付近の再取得中もローカル履歴ナビゲーション行を維持し、ボタンだけ無効化する', async () => {
        const visiblePost = createRecord({
            eventId: 'repair-visible',
            content: '表示中の投稿',
            createdAt: 200,
            postedAt: Date.UTC(2024, 0, 2, 3, 4, 0),
        });
        const olderPost = createRecord({
            eventId: 'repair-older',
            content: 'さらに古い投稿',
            createdAt: 100,
            postedAt: Date.UTC(2024, 0, 1, 3, 4, 0),
        });
        const repairComplete = createDeferred<{
            status: 'success';
            addedCount: number;
            updatedCount: number;
            unchangedCount: number;
            processedRangeCount: number;
            processedRanges: any[];
            attemptedRangeCount: number;
            hadFailures: boolean;
        }>();

        repositoryMock.countForPubkey.mockResolvedValue(2);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([visiblePost]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([olderPost]);
        relayFetchServiceMock.fetchLatest.mockReturnValue({
            promise: Promise.resolve(createRelayFetchResult({ status: 'success', fetchedAt: 1000 })),
            cancel: vi.fn(),
        });
        repairServiceMock.refetchAroundCurrentView.mockReturnValueOnce({
            promise: repairComplete.promise,
            cancel: vi.fn(),
        });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        const loadOlderButton = await screen.findByRole('button', { name: 'さらに古い投稿を表示' });
        await waitFor(() => {
            expect(loadOlderButton.hasAttribute('disabled')).toBe(false);
            expect(document.querySelector('.post-history-nav-row-bottom')).toBeTruthy();
        });

        await waitFor(() => {
            expect(screen.queryByText('リレーと同期中...')).toBeNull();
        });

        await clickEnabledMenuAction('表示中の投稿付近を再取得');

        await waitFor(() => {
            expect(repairServiceMock.refetchAroundCurrentView).toHaveBeenCalledTimes(1);
            expect(document.querySelector('.post-history-nav-row-bottom')).toBeTruthy();
            expect(screen.getByRole('button', { name: 'さらに古い投稿を表示' }).hasAttribute('disabled')).toBe(true);
        });

        view.unmount();
    });

    it('normal local older reveal は newly visible self kind:1 だけ reply repair し、表示は repair 完了を待たない', async () => {
        const visiblePost = createRecord({
            eventId: 'local-older-visible',
            content: '表示中の投稿',
            createdAt: 200,
            postedAt: Date.UTC(2024, 0, 2, 3, 4, 0),
        });
        const olderSelfKind1 = createRecord({
            eventId: 'local-older-self-kind1',
            content: 'self kind1 older',
            createdAt: 190,
            postedAt: Date.UTC(2024, 0, 2, 3, 3, 0),
        });
        const olderSelfKind42 = createRecord({
            eventId: 'local-older-self-kind42',
            content: 'self kind42 older',
            kind: 42,
            createdAt: 180,
            postedAt: Date.UTC(2024, 0, 2, 3, 2, 0),
        });
        const olderOtherKind1 = createRecord({
            eventId: 'local-older-other-kind1',
            content: 'other kind1 older',
            pubkeyHex: 'b'.repeat(64),
            createdAt: 170,
            postedAt: Date.UTC(2024, 0, 2, 3, 1, 0),
        });
        const repairComplete = createDeferred<{
            status: 'success';
            targetParentEventIds: string[];
            checkedParentEventIds: string[];
            savedParentEventIds: string[];
            savedDirectReplyCount: number;
            attemptedChunkCount: number;
            saturatedChunkCount: number;
            incompleteParentEventIds: string[];
            deletionConfirmationIncomplete: boolean;
        }>();
        const cancel = vi.fn();

        repositoryMock.countForPubkey.mockResolvedValue(4);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([visiblePost]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([
            olderSelfKind1,
            olderSelfKind42,
            olderOtherKind1,
        ]);
        relayFetchServiceMock.fetchLatest.mockReturnValue({
            promise: Promise.resolve(createRelayFetchResult({ status: 'success', fetchedAt: 1000 })),
            cancel: vi.fn(),
        });
        replyRepairServiceMock.repairVisibleRangeChildInteractions.mockReturnValueOnce({
            promise: repairComplete.promise,
            cancel,
        });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.queryByText('リレーと同期中...')).toBeNull();
        });

        await fireEvent.click(
            await screen.findByRole('button', { name: 'さらに古い投稿を表示' }),
        );

        await waitFor(() => {
            expect(screen.getByText('self kind1 older')).toBeTruthy();
            expect(screen.getByText('self kind42 older')).toBeTruthy();
            expect(screen.getByText('other kind1 older')).toBeTruthy();
            expect(replyRepairServiceMock.repairVisibleRangeChildInteractions).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({
                    ownerPubkeyHex: PUBKEY_HEX,
                    visiblePosts: [olderSelfKind1],
                }),
            );
        });

        view.unmount();

        expect(cancel).toHaveBeenCalledTimes(1);
    });

    it('self repairがpartialでも表示中の既知kind:1 self postsをreply repairする', async () => {
        const visiblePost = createRecord({
            eventId: 'repair-partial-visible',
            content: '表示中の投稿',
        });
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([visiblePost]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        relayFetchServiceMock.fetchLatest.mockReturnValue({
            promise: Promise.resolve(createRelayFetchResult({ status: 'success', fetchedAt: 1000 })),
            cancel: vi.fn(),
        });
        repairServiceMock.refetchAroundCurrentView.mockReturnValueOnce({
            promise: Promise.resolve({
                status: 'partial',
                addedCount: 0,
                updatedCount: 0,
                unchangedCount: 0,
                processedRangeCount: 1,
                processedRanges: [],
                attemptedRangeCount: 1,
                hadFailures: true,
                fetchFailed: false,
                hadTimeout: false,
                hadUnfinishedRanges: true,
            }),
            cancel: vi.fn(),
        });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.queryByText('リレーと同期中...')).toBeNull();
        });
        await clickEnabledMenuAction('表示中の投稿付近を再取得');

        await waitFor(() => {
            expect(replyRepairServiceMock.repairVisibleRangeChildInteractions).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({
                    ownerPubkeyHex: PUBKEY_HEX,
                    visiblePosts: [visiblePost],
                }),
            );
        });

        view.unmount();
    });

    it('self repairがtimeoutでもrequestが有効なら既存表示postsをreply repairする', async () => {
        const visiblePost = createRecord({
            eventId: 'repair-timeout-visible',
            content: 'timeout後も表示中',
        });
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([visiblePost]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        relayFetchServiceMock.fetchLatest.mockReturnValue({
            promise: Promise.resolve(createRelayFetchResult({ status: 'success', fetchedAt: 1000 })),
            cancel: vi.fn(),
        });
        repairServiceMock.refetchAroundCurrentView.mockReturnValueOnce({
            promise: Promise.resolve({
                status: 'partial',
                addedCount: 0,
                updatedCount: 0,
                unchangedCount: 0,
                processedRangeCount: 1,
                processedRanges: [],
                attemptedRangeCount: 1,
                hadFailures: false,
                fetchFailed: false,
                hadTimeout: true,
                hadUnfinishedRanges: false,
            }),
            cancel: vi.fn(),
        });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.queryByText('リレーと同期中...')).toBeNull();
        });
        await clickEnabledMenuAction('表示中の投稿付近を再取得');

        await waitFor(() => {
            expect(replyRepairServiceMock.repairVisibleRangeChildInteractions).toHaveBeenCalledTimes(1);
        });

        view.unmount();
    });

    it('self repairがcancelledならreply repairを起動しない', async () => {
        const visiblePost = createRecord({
            eventId: 'repair-cancelled-visible',
            content: 'cancelled',
        });
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([visiblePost]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        relayFetchServiceMock.fetchLatest.mockReturnValue({
            promise: Promise.resolve(createRelayFetchResult({ status: 'success', fetchedAt: 1000 })),
            cancel: vi.fn(),
        });
        repairServiceMock.refetchAroundCurrentView.mockReturnValueOnce({
            promise: Promise.resolve({
                status: 'cancelled',
                addedCount: 0,
                updatedCount: 0,
                unchangedCount: 0,
                processedRangeCount: 0,
                processedRanges: [],
                attemptedRangeCount: 0,
                hadFailures: false,
                fetchFailed: false,
                hadTimeout: false,
                hadUnfinishedRanges: false,
            }),
            cancel: vi.fn(),
        });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.queryByText('リレーと同期中...')).toBeNull();
        });
        await clickEnabledMenuAction('表示中の投稿付近を再取得');

        await waitFor(() => {
            expect(repairServiceMock.refetchAroundCurrentView).toHaveBeenCalledTimes(1);
        });
        expect(replyRepairServiceMock.repairVisibleRangeChildInteractions).not.toHaveBeenCalled();

        view.unmount();
    });

    it('self repair完了前にDialogが閉じてstaleになった場合はreply repairを起動しない', async () => {
        const visiblePost = createRecord({
            eventId: 'repair-stale-visible',
            content: 'stale',
        });
        const repairComplete = createDeferred<any>();
        const cancel = vi.fn();
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([visiblePost]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        relayFetchServiceMock.fetchLatest.mockReturnValue({
            promise: Promise.resolve(createRelayFetchResult({ status: 'success', fetchedAt: 1000 })),
            cancel: vi.fn(),
        });
        repairServiceMock.refetchAroundCurrentView.mockReturnValueOnce({
            promise: repairComplete.promise,
            cancel,
        });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.queryByText('リレーと同期中...')).toBeNull();
        });
        await clickEnabledMenuAction('表示中の投稿付近を再取得');
        await view.rerender({ show: false });
        repairComplete.resolve({
            status: 'success',
            addedCount: 0,
            updatedCount: 0,
            unchangedCount: 0,
            processedRangeCount: 0,
            processedRanges: [],
            attemptedRangeCount: 0,
            hadFailures: false,
            fetchFailed: false,
            hadTimeout: false,
            hadUnfinishedRanges: false,
        });

        await waitFor(() => {
            expect(cancel).toHaveBeenCalled();
        });
        expect(replyRepairServiceMock.repairVisibleRangeChildInteractions).not.toHaveBeenCalled();

        view.unmount();
    });

    it('relay older-backfill が timeout でも newly visible older self kind:1 が materialized したら reply repair を起動する', async () => {
        const latest = createRecord({
            eventId: 'relay-timeout-latest',
            content: '現在の投稿',
            createdAt: 200,
            postedAt: Date.UTC(2024, 0, 2, 3, 4, 0),
        });
        const fetchedOlder = createRecord({
            eventId: 'relay-timeout-older',
            content: 'relay timeout older',
            createdAt: 190,
            postedAt: Date.UTC(2024, 0, 2, 3, 3, 0),
        });
        let allowOlderChunk = false;

        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([latest]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockImplementation(async (options: {
            cursor?: { eventId: string };
            limit?: number;
        }) => {
            if (
                allowOlderChunk
                && options.cursor?.eventId === latest.eventId
                && options.limit === 50
            ) {
                return [fetchedOlder];
            }

            return [];
        });
        repositoryMock.upsertFetchedEvents.mockImplementationOnce(async () => {
            allowOlderChunk = true;
            return {
                insertedCount: 1,
                updatedCount: 0,
                unchangedCount: 0,
            };
        });
        relayFetchServiceMock.fetchLatest
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    status: 'success',
                    fetchedAt: 1000,
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    status: 'timeout',
                    fetchedAt: 2000,
                    oldestCreatedAt: fetchedOlder.createdAt,
                    newestCreatedAt: fetchedOlder.createdAt,
                    events: [{
                        event: {
                            id: 'relay-timeout-older-event'.padEnd(64, 'r'),
                            pubkey: PUBKEY_HEX,
                            kind: 1,
                            content: fetchedOlder.content,
                            tags: [],
                            created_at: fetchedOlder.createdAt,
                            sig: 'd'.repeat(128),
                        },
                        relayUrls: ['wss://relay.example.com/'],
                    }],
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'リレーから続きを取得' })).toBeTruthy();
        });

        await clickRelayFetchButton();

        await waitFor(() => {
            expect(screen.getByText('relay timeout older')).toBeTruthy();
            expect(replyRepairServiceMock.repairVisibleRangeChildInteractions).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({
                    ownerPubkeyHex: PUBKEY_HEX,
                    visiblePosts: [fetchedOlder],
                }),
            );
        });

        view.unmount();
    });

    it('追加なし のメッセージが自動で消える', async () => {
        const initialPosts = [createRecord({ eventId: 'repair-none', content: '既存投稿', createdAt: 1_704_326_400, postedAt: Date.UTC(2024, 0, 2, 3, 4, 0) })];

        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue(initialPosts);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        relayFetchServiceMock.fetchLatest.mockReturnValue({
            promise: Promise.resolve(createRelayFetchResult({ status: 'success', fetchedAt: 1000 })),
            cancel: vi.fn(),
        });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('既存投稿')).toBeTruthy();
        });

        await waitFor(() => {
            expect(screen.queryByText('リレーと同期中...')).toBeNull();
        });

        await clickEnabledMenuAction('表示中の投稿付近を再取得');

        await waitFor(() => {
            expect(screen.getByText('追加なし')).toBeTruthy();
        });

        await new Promise((resolve) => setTimeout(resolve, 4000));

        await waitFor(() => {
            expect(screen.queryByText('追加なし')).toBeNull();
        });

        view.unmount();
    });

    it('1件追加 のメッセージが自動で消える', async () => {
        const initialPosts = [createRecord({ eventId: 'repair-added', content: '既存投稿', createdAt: 1_704_326_400, postedAt: Date.UTC(2024, 0, 2, 3, 4, 0) })];

        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue(initialPosts);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        relayFetchServiceMock.fetchLatest.mockReturnValue({
            promise: Promise.resolve(createRelayFetchResult({ status: 'success', fetchedAt: 1000 })),
            cancel: vi.fn(),
        });
        repairServiceMock.refetchAroundCurrentView.mockReturnValueOnce({
            promise: Promise.resolve({
                status: 'success',
                addedCount: 1,
                updatedCount: 0,
                unchangedCount: 0,
                processedRangeCount: 1,
                processedRanges: [],
                attemptedRangeCount: 1,
                hadFailures: true,
                fetchFailed: true,
                hadUnfinishedRanges: true,
            }),
            cancel: vi.fn(),
        });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.queryByText('リレーと同期中...')).toBeNull();
        });

        await clickEnabledMenuAction('表示中の投稿付近を再取得');

        await waitFor(() => {
            expect(screen.getByText('1件追加')).toBeTruthy();
        });

        await new Promise((resolve) => setTimeout(resolve, 4000));

        await waitFor(() => {
            expect(screen.queryByText('1件追加')).toBeNull();
        });

        view.unmount();
    });

    it('同期完了メッセージは自動で消える', async () => {
        vi.useFakeTimers();
        repositoryMock.countForPubkey.mockResolvedValue(0);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        repositoryMock.upsertFetchedEvents.mockResolvedValue({
            insertedCount: 1,
            updatedCount: 0,
            unchangedCount: 0,
        });
        relayFetchServiceMock.fetchLatest.mockReturnValue({
            promise: Promise.resolve(createRelayFetchResult({
                status: 'success',
                events: [createRecord({ eventId: 'sync-success', content: '同期成功' })],
                fetchedAt: 1000,
            })),
            cancel: vi.fn(),
        });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.queryByText('リレーと同期中...')).toBeNull();
        });

        await waitFor(() => {
            expect(screen.getByText('リレーとの同期が完了しました')).toBeTruthy();
        });

        await vi.advanceTimersByTimeAsync(3500);

        await waitFor(() => {
            expect(screen.queryByText('リレーとの同期が完了しました')).toBeNull();
        });

        view.unmount();
    });

    it('同期失敗メッセージは自動で消える', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(0);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        relayFetchServiceMock.fetchLatest.mockReturnValue({
            promise: Promise.resolve(createRelayFetchResult({
                status: 'error',
                events: [],
                fetchedAt: 1000,
            })),
            cancel: vi.fn(),
        });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.queryByText('リレーと同期中...')).toBeNull();
        });

        await waitFor(() => {
            expect(screen.getByText('リレーから取得できませんでした')).toBeTruthy();
        });

        await new Promise((resolve) => setTimeout(resolve, 4000));

        await waitFor(() => {
            expect(screen.queryByText('リレーから取得できませんでした')).toBeNull();
        });

        view.unmount();
    });

    it('一部未確認 のメッセージが自動で消える', async () => {
        const initialPosts = [createRecord({ eventId: 'repair-failure', content: '既存投稿', createdAt: 1_704_326_400, postedAt: Date.UTC(2024, 0, 2, 3, 4, 0) })];

        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue(initialPosts);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        relayFetchServiceMock.fetchLatest.mockReturnValue({
            promise: Promise.resolve(createRelayFetchResult({ status: 'success', fetchedAt: 1000 })),
            cancel: vi.fn(),
        });
        repairServiceMock.refetchAroundCurrentView.mockReturnValueOnce({
            promise: Promise.resolve({
                status: 'success',
                addedCount: 0,
                updatedCount: 0,
                unchangedCount: 0,
                processedRangeCount: 0,
                processedRanges: [],
                attemptedRangeCount: 1,
                hadFailures: true,
                hadUnfinishedRanges: true,
            }),
            cancel: vi.fn(),
        });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.queryByText('リレーと同期中...')).toBeNull();
        });

        await clickEnabledMenuAction('表示中の投稿付近を再取得');

        await waitFor(() => {
            expect(screen.getByText('一部未確認')).toBeTruthy();
        });

        await new Promise((resolve) => setTimeout(resolve, 4000));

        await waitFor(() => {
            expect(screen.queryByText('一部未確認')).toBeNull();
        });

        view.unmount();
    });

    it('全体取得失敗なら取得失敗を表示する', async () => {
        const initialPosts = [createRecord({ eventId: 'repair-fetch-failed', content: '既存投稿', createdAt: 1_704_326_400, postedAt: Date.UTC(2024, 0, 2, 3, 4, 0) })];

        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue(initialPosts);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        relayFetchServiceMock.fetchLatest.mockReturnValue({
            promise: Promise.resolve(createRelayFetchResult({ status: 'success', fetchedAt: 1000 })),
            cancel: vi.fn(),
        });
        repairServiceMock.refetchAroundCurrentView.mockReturnValueOnce({
            promise: Promise.resolve({
                status: 'partial',
                addedCount: 0,
                updatedCount: 0,
                unchangedCount: 0,
                processedRangeCount: 1,
                processedRanges: [],
                attemptedRangeCount: 1,
                hadFailures: true,
                hadFetchError: true,
                fetchFailed: true,
                hadUnfinishedRanges: false,
            }),
            cancel: vi.fn(),
        });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.queryByText('リレーと同期中...')).toBeNull();
        });

        await clickEnabledMenuAction('表示中の投稿付近を再取得');

        await waitFor(() => {
            expect(screen.getByText('取得失敗')).toBeTruthy();
        });

        view.unmount();
    });

    it('保存処理例外なら取得失敗を表示する', async () => {
        const initialPosts = [createRecord({ eventId: 'repair-save-failed', content: '既存投稿', createdAt: 1_704_326_400, postedAt: Date.UTC(2024, 0, 2, 3, 4, 0) })];

        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue(initialPosts);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        relayFetchServiceMock.fetchLatest.mockReturnValue({
            promise: Promise.resolve(createRelayFetchResult({ status: 'success', fetchedAt: 1000 })),
            cancel: vi.fn(),
        });
        repairServiceMock.refetchAroundCurrentView.mockReturnValueOnce({
            promise: Promise.reject(new Error('db failed')),
            cancel: vi.fn(),
        });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.queryByText('リレーと同期中...')).toBeNull();
        });

        await clickEnabledMenuAction('表示中の投稿付近を再取得');

        await waitFor(() => {
            expect(screen.getByText('取得失敗')).toBeTruthy();
        });

        view.unmount();
    });

    it('初期 timeout で nextUntil が残っていれば古い投稿の取得を継続でき、追加後はローカル older load で表示する', async () => {
        const latest = createRecord({
            eventId: 'timeout-latest',
            content: '現在の投稿',
            createdAt: 150,
            postedAt: Date.UTC(2024, 0, 3, 0, 0, 0),
        });
        const fetchedOlder = createRecord({
            eventId: 'timeout-older',
            content: '追加取得した古い投稿',
            createdAt: 140,
            postedAt: Date.UTC(2024, 0, 2, 0, 0, 0),
        });

        repositoryMock.countForPubkey
            .mockResolvedValueOnce(1)
            .mockResolvedValueOnce(1)
            .mockResolvedValueOnce(1)
            .mockResolvedValueOnce(2)
            .mockResolvedValue(2);
        repositoryMock.countVisibleForPubkey
            .mockResolvedValueOnce(1)
            .mockResolvedValueOnce(2);
        repositoryMock.getLatestVisibleChunk
            .mockResolvedValueOnce([latest])
            .mockResolvedValueOnce([latest]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([fetchedOlder])
            .mockResolvedValueOnce([fetchedOlder])
            .mockResolvedValueOnce([]);
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
                promise: Promise.resolve(createRelayFetchResult({
                    status: 'timeout',
                    fetchedAt: 1000,
                    nextUntil: 150,
                    events: [
                        {
                            event: {
                                id: 'timeout-event'.repeat(4),
                                pubkey: PUBKEY_HEX,
                                kind: 1,
                                content: '途中まで取得した投稿',
                                tags: [],
                                created_at: 150,
                                sig: 'c'.repeat(128),
                            },
                            relayUrls: ['wss://relay.example.com/'],
                        },
                    ],
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 2000,
                    events: [
                        {
                            event: {
                                id: 'older-event'.repeat(4),
                                pubkey: PUBKEY_HEX,
                                kind: 1,
                                content: '追加取得した古い投稿',
                                tags: [],
                                created_at: 140,
                                sig: 'd'.repeat(128),
                            },
                            relayUrls: ['wss://relay.example.com/'],
                        },
                    ],
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'リレーから続きを取得' })).toBeTruthy();
        });

        await clickRelayFetchButton();

        await waitFor(() => {
            expect(relayFetchServiceMock.fetchLatest).toHaveBeenNthCalledWith(
                2,
                {} as any,
                expect.objectContaining({
                    pubkeyHex: PUBKEY_HEX,
                    limit: 150,
                    since: 0,
                    until: 149,
                }),
            );
            expect(screen.getByText('追加取得した古い投稿')).toBeTruthy();
        });

        view.unmount();
    });

    it('nextUntil が visibleUntil より新しい場合は visibleUntil を上限に older-backfill を開始する', async () => {
        let visibleUntil: number | null = 100;
        const latest = createRecord({
            eventId: 'clamp-latest',
            content: '現在の投稿',
            createdAt: 150,
            postedAt: Date.UTC(2024, 0, 3, 0, 0, 0),
        });

        visibleRangeRepositoryMock.get.mockImplementation(async () =>
            visibleUntil === null
                ? null
                : {
                    pubkeyHex: PUBKEY_HEX,
                    kindsKey: '1,42',
                    visibleUntil,
                    updatedAt: 1000,
                },
        );
        visibleRangeRepositoryMock.save.mockImplementation(async (range: {
            pubkeyHex: string;
            kindsKey: string;
            visibleUntil: number | null;
        }) => {
            visibleUntil = range.visibleUntil;
            return {
                ...range,
                updatedAt: 1000,
            };
        });

        repositoryMock.countVisibleForPubkey.mockResolvedValue(1);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([latest]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        repositoryMock.upsertFetchedEvents.mockResolvedValue({
            insertedCount: 0,
            updatedCount: 0,
            unchangedCount: 0,
        });

        relayFetchServiceMock.fetchLatest
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 1000,
                    hasMore: true,
                    nextUntil: 500,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 2000,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'リレーから続きを取得' })).toBeTruthy();
        });

        await clickRelayFetchButton();

        await waitFor(() => {
            expect(relayFetchServiceMock.fetchLatest).toHaveBeenNthCalledWith(
                2,
                {} as any,
                expect.objectContaining({
                    pubkeyHex: PUBKEY_HEX,
                    reason: 'older-backfill',
                    since: 0,
                    until: 99,
                }),
            );
        });

        view.unmount();
    });

    it('日付ジャンプで frontier より古い sparse window を表示中はその最古投稿を上限に older-backfill を開始する', async () => {
        let visibleUntil: number | null = 100;
        const latest = createRecord({
            eventId: 'sparse-window-latest',
            content: '現在の投稿',
            createdAt: 150,
            postedAt: Date.UTC(2024, 0, 3, 0, 0, 0),
        });
        const sparseJumpAnchor = createRecord({
            eventId: 'sparse-window-anchor',
            content: '日付ジャンプ先の投稿',
            createdAt: 50,
            postedAt: Date.UTC(2023, 0, 1, 0, 0, 0),
        });

        visibleRangeRepositoryMock.get.mockImplementation(async () =>
            visibleUntil === null
                ? null
                : {
                    pubkeyHex: PUBKEY_HEX,
                    kindsKey: '1,42',
                    visibleUntil,
                    updatedAt: 1000,
                },
        );
        visibleRangeRepositoryMock.save.mockImplementation(async (range: {
            pubkeyHex: string;
            kindsKey: string;
            visibleUntil: number | null;
        }) => {
            visibleUntil = range.visibleUntil;
            return {
                ...range,
                updatedAt: 1000,
            };
        });

        repositoryMock.countVisibleForPubkey.mockResolvedValue(1);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([latest]);
        repositoryMock.getVisibleChunkFromCreatedAt.mockResolvedValueOnce([
            sparseJumpAnchor,
        ]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        repositoryMock.upsertFetchedEvents.mockResolvedValue({
            insertedCount: 0,
            updatedCount: 0,
            unchangedCount: 0,
        });

        relayFetchServiceMock.fetchLatest
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 1000,
                    hasMore: true,
                    nextUntil: 500,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 2000,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('現在の投稿')).toBeTruthy();
        });

        await clickMenuAction('日付へ移動');
        await fireEvent.input(screen.getByLabelText('日付'), {
            target: { value: '2023-01-01' },
        });
        await fireEvent.click(
            document.querySelector('.post-history-utility-submit-button') as HTMLButtonElement,
        );

        await waitFor(() => {
            expect(screen.getByText('日付ジャンプ先の投稿')).toBeTruthy();
        });

        await clickRelayFetchButton();

        await waitFor(() => {
            expect(relayFetchServiceMock.fetchLatest).toHaveBeenNthCalledWith(
                2,
                {} as any,
                expect.objectContaining({
                    pubkeyHex: PUBKEY_HEX,
                    reason: 'older-backfill',
                    since: 0,
                    until: 49,
                }),
            );
        });

        view.unmount();
    });

    it('visibleUntil が null でも sparse window 表示中は stale nextUntil ではなく現在表示最古から older-backfill する', async () => {
        const latest = createRecord({
            eventId: 'sparse-null-visible-latest',
            content: '現在の投稿',
            createdAt: 150,
            postedAt: Date.UTC(2024, 0, 3, 0, 0, 0),
        });
        const sparseJumpAnchor = createRecord({
            eventId: 'sparse-null-visible-anchor',
            content: '日付ジャンプ先の投稿',
            createdAt: 50,
            postedAt: Date.UTC(2023, 0, 1, 0, 0, 0),
        });

        repositoryMock.countVisibleForPubkey.mockResolvedValue(1);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([latest]);
        repositoryMock.getVisibleChunkFromCreatedAt.mockResolvedValueOnce([
            sparseJumpAnchor,
        ]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        repositoryMock.upsertFetchedEvents.mockResolvedValue({
            insertedCount: 0,
            updatedCount: 0,
            unchangedCount: 0,
        });
        jumpCacheAnchorRepositoryMock.getForPubkey.mockResolvedValue([
            {
                centerCreatedAt: 50,
                radiusSec: 86_400,
                fetchedAt: Date.now(),
            },
        ]);

        relayFetchServiceMock.fetchLatest
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 1000,
                    hasMore: true,
                    nextUntil: 500,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 2000,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('現在の投稿')).toBeTruthy();
        });

        await clickMenuAction('日付へ移動');
        await fireEvent.input(screen.getByLabelText('日付'), {
            target: { value: '2023-01-01' },
        });
        await fireEvent.click(
            document.querySelector('.post-history-utility-submit-button') as HTMLButtonElement,
        );

        await waitFor(() => {
            expect(screen.getByText('日付ジャンプ先の投稿')).toBeTruthy();
        });

        await clickRelayFetchButton();

        await waitFor(() => {
            expect(relayFetchServiceMock.fetchLatest).toHaveBeenNthCalledWith(
                2,
                {} as any,
                expect.objectContaining({
                    pubkeyHex: PUBKEY_HEX,
                    reason: 'older-backfill',
                    since: 0,
                    until: 49,
                }),
            );
        });

        view.unmount();
    });

    it('sparse window 表示中の older-backfill で取得した古い投稿を即時表示する', async () => {
        let visibleUntil: number | null = 100;
        const latest = createRecord({
            eventId: 'sparse-materialize-latest',
            content: '現在の投稿',
            createdAt: 150,
            postedAt: Date.UTC(2024, 0, 3, 0, 0, 0),
        });
        const sparseJumpAnchor = createRecord({
            eventId: 'sparse-materialize-anchor',
            content: '日付ジャンプ先の投稿',
            createdAt: 50,
            postedAt: Date.UTC(2023, 0, 1, 0, 0, 0),
        });
        const fetchedOlder = createRecord({
            eventId: 'sparse-materialize-fetched-older',
            content: '取得できた古い投稿',
            createdAt: 45,
            postedAt: Date.UTC(2022, 11, 31, 12, 0, 0),
        });

        visibleRangeRepositoryMock.get.mockImplementation(async () =>
            visibleUntil === null
                ? null
                : {
                    pubkeyHex: PUBKEY_HEX,
                    kindsKey: '1,42',
                    visibleUntil,
                    updatedAt: 1000,
                },
        );
        visibleRangeRepositoryMock.save.mockImplementation(async (range: {
            pubkeyHex: string;
            kindsKey: string;
            visibleUntil: number | null;
        }) => {
            visibleUntil = range.visibleUntil;
            return {
                ...range,
                updatedAt: 1000,
            };
        });

        repositoryMock.countVisibleForPubkey.mockResolvedValue(1);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([latest]);
        repositoryMock.getVisibleChunkFromCreatedAt
            .mockResolvedValueOnce([sparseJumpAnchor])
            .mockResolvedValueOnce([fetchedOlder]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        repositoryMock.upsertFetchedEvents.mockResolvedValue({
            insertedCount: 1,
            updatedCount: 0,
            unchangedCount: 0,
        });

        relayFetchServiceMock.fetchLatest
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 1000,
                    hasMore: true,
                    nextUntil: 500,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 2000,
                    events: [
                        {
                            event: {
                                id: fetchedOlder.eventId,
                                pubkey: PUBKEY_HEX,
                                kind: fetchedOlder.kind,
                                content: fetchedOlder.content,
                                tags: [],
                                created_at: fetchedOlder.createdAt,
                                sig: 'f'.repeat(128),
                            },
                            relayUrls: ['wss://relay.example.com/'],
                        },
                    ],
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('現在の投稿')).toBeTruthy();
        });

        await clickMenuAction('日付へ移動');
        await fireEvent.input(screen.getByLabelText('日付'), {
            target: { value: '2023-01-01' },
        });
        await fireEvent.click(
            document.querySelector('.post-history-utility-submit-button') as HTMLButtonElement,
        );

        await waitFor(() => {
            expect(screen.getByText('日付ジャンプ先の投稿')).toBeTruthy();
        });

        await clickRelayFetchButton();

        await waitFor(() => {
            expect(screen.getByText('取得できた古い投稿')).toBeTruthy();
        });

        view.unmount();
    });

    it('1回目 changed=false、2回目 changed=true かつ pageSize 到達なら同一クリック内で2回fetchして停止する', async () => {
        const initialWindowSeconds = 12 * 60 * 60;
        const latest = createRecord({
            eventId: 'window-latest',
            content: '現在の投稿',
            createdAt: 1_700_000_000,
            postedAt: Date.UTC(2024, 0, 3, 0, 0, 0),
        });
        const firstUntil = latest.createdAt - 1;
        const firstSince = firstUntil - initialWindowSeconds;
        const secondUntil = firstSince - 1;
        const fetchedCreatedAt = secondUntil - 60;
        const fetchedOlderPosts = Array.from({ length: 50 }, (_, index) => createRecord({
            eventId: `window-older-${index}`,
            content: `空振り後に取得した古い投稿 ${index + 1}`,
            createdAt: fetchedCreatedAt - index,
            postedAt: Date.UTC(2023, 11, 31, 0, 0, 0) - index,
        }));
        let allowOlderChunk = false;

        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.countVisibleForPubkey.mockImplementation(async (_pubkeyHex: string, visibleUntil?: number | null) =>
            typeof visibleUntil === 'number' && visibleUntil <= fetchedCreatedAt ? 51 : 1,
        );
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([latest]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockImplementation(async (options: {
            cursor?: { eventId: string };
            limit?: number;
            visibleUntil?: number | null;
        }) => {
            if (
                allowOlderChunk &&
                options.cursor?.eventId === 'window-latest' &&
                options.limit === 50 &&
                typeof options.visibleUntil === 'number' &&
                options.visibleUntil <= fetchedCreatedAt
            ) {
                return fetchedOlderPosts;
            }

            return [];
        });
        repositoryMock.upsertFetchedEvents.mockImplementationOnce(async () => {
            allowOlderChunk = true;
            return {
                insertedCount: fetchedOlderPosts.length,
                updatedCount: 0,
                unchangedCount: 0,
            };
        });
        relayFetchServiceMock.fetchLatest
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 1000,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 2000,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 3000,
                    oldestCreatedAt: fetchedCreatedAt,
                    newestCreatedAt: fetchedCreatedAt,
                    events: [
                        {
                            event: {
                                id: 'window-older-event'.repeat(4),
                                pubkey: PUBKEY_HEX,
                                kind: 1,
                                content: fetchedOlderPosts[0].content,
                                tags: [],
                                created_at: fetchedCreatedAt,
                                sig: 'd'.repeat(128),
                            },
                            relayUrls: ['wss://relay.example.com/'],
                        },
                    ],
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'リレーから続きを取得' })).toBeTruthy();
        });

        await clickRelayFetchButton();

        await waitFor(() => {
            const firstBackfillCall = relayFetchServiceMock.fetchLatest.mock.calls[1]?.[1] as {
                since?: number;
                until?: number;
            };
            const secondBackfillCall = relayFetchServiceMock.fetchLatest.mock.calls[2]?.[1] as {
                since?: number;
                until?: number;
            };

            expect(relayFetchServiceMock.fetchLatest).toHaveBeenNthCalledWith(
                2,
                {} as any,
                expect.objectContaining({
                    reason: 'older-backfill',
                    since: firstSince,
                    until: firstUntil,
                }),
            );
            expect(secondBackfillCall.until).toBeLessThanOrEqual(firstBackfillCall.until ?? Number.MAX_SAFE_INTEGER);
            expect(secondBackfillCall.since).toBeLessThan(firstBackfillCall.since ?? Number.MAX_SAFE_INTEGER);
        });

        view.unmount();
    });

    it('2回連続 changed=false の場合は最大試行回数に到達して停止し、ボタンを再有効化する', async () => {
        const initialWindowSeconds = 12 * 60 * 60;
        const latest = createRecord({
            eventId: 'auto-retry-empty-latest',
            content: '現在の投稿',
            createdAt: 1_700_000_000,
            postedAt: Date.UTC(2024, 0, 3, 0, 0, 0),
        });
        const firstUntil = latest.createdAt - 1;
        const firstSince = firstUntil - initialWindowSeconds;

        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.countVisibleForPubkey.mockResolvedValue(1);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([latest]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        relayFetchServiceMock.fetchLatest
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 1000,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 2000,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 3000,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 4000,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 5000,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 6000,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'リレーから続きを取得' })).toBeTruthy();
        });

        await clickRelayFetchButton();

        await waitFor(() => {
            expect(relayFetchServiceMock.fetchLatest).toHaveBeenNthCalledWith(
                2,
                {} as any,
                expect.objectContaining({ since: firstSince, until: firstUntil }),
            );
            expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledTimes(7);
        });

        await waitFor(() => {
            expect(relayFetchServiceMock.fetchLatest.mock.calls.length).toBeGreaterThanOrEqual(7);
        });

        view.unmount();
    });

    it('timeout/error では自動追加探索しない', async () => {
        const latest = createRecord({
            eventId: 'auto-retry-timeout-latest',
            content: '現在の投稿',
            createdAt: 1_700_000_000,
            postedAt: Date.UTC(2024, 0, 3, 0, 0, 0),
        });

        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.countVisibleForPubkey.mockResolvedValue(1);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([latest]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        relayFetchServiceMock.fetchLatest
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 1000,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    status: 'timeout',
                    fetchedAt: 2000,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    status: 'error',
                    fetchedAt: 3000,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'リレーから続きを取得' })).toBeTruthy();
        });

        await clickRelayFetchButton();

        await waitFor(() => {
            expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledTimes(2);
        });

        await clickRelayFetchButton();

        await waitFor(() => {
            expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledTimes(3);
        });

        view.unmount();
    });

    it('changed=true でも追加数が pageSize 未満なら同一クリック内で次 window を取得する', async () => {
        const initialWindowSeconds = 12 * 60 * 60;
        const latestCreatedAt = 1_700_000_000;
        const firstUntil = latestCreatedAt - 1;
        const firstSince = firstUntil - initialWindowSeconds;
        const secondUntil = firstSince - 1;
        const secondSince = secondUntil - (initialWindowSeconds * 2);
        const firstFetchedCreatedAt = firstUntil - 10;
        const secondFetchedCreatedAt = secondUntil - 10;
        const latest = createRecord({
            eventId: 'small-batch-latest',
            content: '現在の投稿',
            createdAt: latestCreatedAt,
            postedAt: Date.UTC(2024, 0, 3, 0, 0, 0),
        });
        const firstBatchPosts = Array.from({ length: 4 }, (_, index) => createRecord({
            eventId: `small-batch-first-${index}`,
            content: `小分け取得1-${index + 1}`,
            createdAt: firstFetchedCreatedAt - index,
            postedAt: Date.UTC(2024, 0, 2, 0, 0, 0) - index,
        }));
        const secondBatchPosts = Array.from({ length: 50 }, (_, index) => createRecord({
            eventId: `small-batch-second-${index}`,
            content: `小分け取得2-${index + 1}`,
            createdAt: secondFetchedCreatedAt - index,
            postedAt: Date.UTC(2024, 0, 1, 0, 0, 0) - index,
        }));
        let olderChunkPhase: 'first' | 'second' = 'first';

        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.countVisibleForPubkey
            .mockResolvedValueOnce(1)
            .mockResolvedValueOnce(5)
            .mockResolvedValueOnce(5)
            .mockResolvedValueOnce(55)
            .mockResolvedValue(55);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([latest]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockImplementation(async (options: {
            cursor?: { eventId: string };
            limit?: number;
            visibleUntil?: number | null;
        }) => {
            if (
                options.cursor?.eventId !== 'small-batch-latest' ||
                options.limit !== 50 ||
                typeof options.visibleUntil !== 'number'
            ) {
                return [];
            }

            if (
                olderChunkPhase === 'first' &&
                options.visibleUntil <= firstFetchedCreatedAt
            ) {
                olderChunkPhase = 'second';
                return firstBatchPosts;
            }

            if (
                olderChunkPhase === 'second' &&
                options.visibleUntil <= secondFetchedCreatedAt
            ) {
                return secondBatchPosts;
            }

            return [];
        });
        repositoryMock.upsertFetchedEvents
            .mockResolvedValueOnce({
                insertedCount: firstBatchPosts.length,
                updatedCount: 0,
                unchangedCount: 0,
            })
            .mockResolvedValueOnce({
                insertedCount: secondBatchPosts.length,
                updatedCount: 0,
                unchangedCount: 0,
            });

        relayFetchServiceMock.fetchLatest
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 1000,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 2000,
                    oldestCreatedAt: firstFetchedCreatedAt,
                    newestCreatedAt: firstFetchedCreatedAt,
                    events: [
                        {
                            event: {
                                id: 'small-batch-first-event'.repeat(4),
                                pubkey: PUBKEY_HEX,
                                kind: 1,
                                content: firstBatchPosts[0].content,
                                tags: [],
                                created_at: firstFetchedCreatedAt,
                                sig: 'd'.repeat(128),
                            },
                            relayUrls: ['wss://relay.example.com/'],
                        },
                    ],
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 3000,
                    oldestCreatedAt: secondFetchedCreatedAt,
                    newestCreatedAt: secondFetchedCreatedAt,
                    events: [
                        {
                            event: {
                                id: 'small-batch-second-event'.repeat(4),
                                pubkey: PUBKEY_HEX,
                                kind: 1,
                                content: secondBatchPosts[0].content,
                                tags: [],
                                created_at: secondFetchedCreatedAt,
                                sig: 'e'.repeat(128),
                            },
                            relayUrls: ['wss://relay.example.com/'],
                        },
                    ],
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'リレーから続きを取得' })).toBeTruthy();
        });

        await clickRelayFetchButton();

        await waitFor(() => {
            expect(relayFetchServiceMock.fetchLatest).toHaveBeenNthCalledWith(
                2,
                {} as any,
                expect.objectContaining({ since: firstSince, until: firstUntil }),
            );
            expect(relayFetchServiceMock.fetchLatest).toHaveBeenNthCalledWith(
                3,
                {} as any,
                expect.objectContaining({ since: secondSince, until: secondUntil }),
            );
        });

        view.unmount();
    });

    it('1回目 changed=true かつ pageSize 以上追加できた場合は追加探索しない', async () => {
        const latest = createRecord({
            eventId: 'auto-retry-changed-latest',
            content: '現在の投稿',
            createdAt: 150,
            postedAt: Date.UTC(2024, 0, 3, 0, 0, 0),
        });
        const fetchedOlderPosts = Array.from({ length: 50 }, (_, index) => createRecord({
            eventId: `auto-retry-changed-older-${index}`,
            content: `1回目で追加された古い投稿 ${index + 1}`,
            createdAt: 140 - index,
            postedAt: Date.UTC(2024, 0, 2, 0, 0, 0) - index,
        }));
        let allowOlderChunk = false;

        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.countVisibleForPubkey
            .mockResolvedValueOnce(1)
            .mockResolvedValueOnce(51)
            .mockResolvedValue(51);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([latest]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockImplementation(async (options: {
            cursor?: { eventId: string };
            limit?: number;
        }) => {
            if (
                allowOlderChunk &&
                options.cursor?.eventId === 'auto-retry-changed-latest' &&
                options.limit === 50
            ) {
                return fetchedOlderPosts;
            }

            return [];
        });
        repositoryMock.upsertFetchedEvents.mockImplementationOnce(async () => {
            allowOlderChunk = true;
            return {
                insertedCount: fetchedOlderPosts.length,
                updatedCount: 0,
                unchangedCount: 0,
            };
        });

        relayFetchServiceMock.fetchLatest
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 1000,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 2000,
                    oldestCreatedAt: 140,
                    newestCreatedAt: 140,
                    events: [
                        {
                            event: {
                                id: 'auto-retry-changed-event'.repeat(4),
                                pubkey: PUBKEY_HEX,
                                kind: 1,
                                content: fetchedOlderPosts[0].content,
                                tags: [],
                                created_at: 140,
                                sig: 'd'.repeat(128),
                            },
                            relayUrls: ['wss://relay.example.com/'],
                        },
                    ],
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'リレーから続きを取得' })).toBeTruthy();
        });

        await clickRelayFetchButton();

        await waitFor(() => {
            expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledTimes(2);
            expect(document.querySelectorAll('.post-history-item').length).toBeGreaterThan(1);
        });

        view.unmount();
    });

    it('古い投稿取得で取得最古まで表示範囲を広げ、limit 到達時は同じ範囲内を続ける', async () => {
        let visibleUntil: number | null = null;
        const initialWindowSeconds = 12 * 60 * 60;
        const latestCreatedAt = 1_700_000_000;
        const firstUntil = latestCreatedAt - 1;
        const firstSince = firstUntil - initialWindowSeconds;
        const fetchedCreatedAt = latestCreatedAt - (2 * 60 * 60);
        const latest = createRecord({
            eventId: 'visible-latest',
            content: '現在の投稿',
            createdAt: latestCreatedAt,
            postedAt: Date.UTC(2024, 0, 3, 0, 0, 0),
        });
        const fetchedOlder = createRecord({
            eventId: 'visible-older',
            content: 'limit 継続範囲で取得した古い投稿',
            createdAt: fetchedCreatedAt,
            postedAt: Date.UTC(2024, 0, 2, 0, 0, 0),
        });

        visibleRangeRepositoryMock.get.mockImplementation(async () =>
            visibleUntil === null
                ? null
                : {
                    pubkeyHex: PUBKEY_HEX,
                    kindsKey: '1,42',
                    visibleUntil,
                    updatedAt: 1000,
                },
        );
        visibleRangeRepositoryMock.save.mockImplementation(async (range: {
            pubkeyHex: string;
            kindsKey: string;
            visibleUntil: number | null;
        }) => {
            visibleUntil = range.visibleUntil;
            return {
                ...range,
                updatedAt: 1000,
            };
        });
        repositoryMock.countVisibleForPubkey.mockImplementation(async (_pubkeyHex: string, rangeUntil?: number | null) =>
            rangeUntil === latestCreatedAt ? 1 : 2,
        );
        repositoryMock.getLatestVisibleChunk
            .mockResolvedValueOnce([latest])
            .mockResolvedValueOnce([latest]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockImplementation(async (options: {
            visibleUntil?: number | null;
            cursor?: { eventId: string };
        }) => {
            if (
                options.visibleUntil === fetchedCreatedAt &&
                options.cursor?.eventId === 'visible-latest'
            ) {
                return [fetchedOlder];
            }

            return [];
        });
        repositoryMock.upsertFetchedEvents
            .mockResolvedValueOnce({
                insertedCount: 0,
                updatedCount: 0,
                unchangedCount: 1,
            })
            .mockResolvedValueOnce({
                insertedCount: 1,
                updatedCount: 0,
                unchangedCount: 1,
            });
        relayFetchServiceMock.fetchLatest
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 1000,
                    nextUntil: latestCreatedAt,
                    oldestCreatedAt: latestCreatedAt,
                    hasMore: true,
                    events: [
                        {
                            event: {
                                id: 'visible-boundary'.repeat(4),
                                pubkey: PUBKEY_HEX,
                                kind: 1,
                                content: '現在の投稿',
                                tags: [],
                                created_at: latestCreatedAt,
                                sig: 'c'.repeat(128),
                            },
                            relayUrls: ['wss://relay-a.example.com/'],
                        },
                    ],
                    relayUrls: ['wss://relay-a.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 2000,
                    nextUntil: fetchedCreatedAt,
                    oldestCreatedAt: fetchedCreatedAt,
                    hasMore: true,
                    events: [
                        {
                            event: {
                                id: 'visible-older'.repeat(4),
                                pubkey: PUBKEY_HEX,
                                kind: 1,
                                content: 'limit 継続範囲で取得した古い投稿',
                                tags: [],
                                created_at: fetchedCreatedAt,
                                sig: 'd'.repeat(128),
                            },
                            relayUrls: ['wss://relay-b.example.com/'],
                        },
                    ],
                    relayUrls: [
                        'wss://relay-a.example.com/',
                        'wss://relay-b.example.com/',
                    ],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 3000,
                    relayUrls: ['wss://relay-a.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 4000,
                    relayUrls: ['wss://relay-a.example.com/'],
                })),
                cancel: vi.fn(),
            });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'リレーから続きを取得' })).toBeTruthy();
        });

        await clickRelayFetchButton();

        await waitFor(() => {
            expect(visibleRangeRepositoryMock.save).toHaveBeenLastCalledWith({
                pubkeyHex: PUBKEY_HEX,
                kindsKey: '1,42',
                visibleUntil: fetchedCreatedAt,
            });
            expect(repositoryMock.countVisibleForPubkey).toHaveBeenCalledWith(
                PUBKEY_HEX,
                fetchedCreatedAt,
            );
            expect(repositoryMock.getOlderVisibleChunk).toHaveBeenCalledWith(
                expect.objectContaining({
                    pubkeyHex: PUBKEY_HEX,
                    visibleUntil: fetchedCreatedAt,
                    cursor: expect.objectContaining({
                        eventId: 'visible-latest',
                    }),
                }),
            );
            expect(screen.getByText('limit 継続範囲で取得した古い投稿')).toBeTruthy();
            expect(relayFetchServiceMock.fetchLatest).toHaveBeenNthCalledWith(
                3,
                {} as any,
                expect.objectContaining({
                    pubkeyHex: PUBKEY_HEX,
                    since: firstSince,
                    until: fetchedCreatedAt - 1,
                }),
            );
        });

        view.unmount();
    });

    it('hitLimit でも残り window が小さい場合は同一 window continuation を行わない', async () => {
        const initialWindowSeconds = 12 * 60 * 60;
        const latestCreatedAt = 1_700_000_000;
        const firstUntil = latestCreatedAt - 1;
        const firstSince = firstUntil - initialWindowSeconds;
        const secondUntil = firstSince - 1;
        const fetchedCreatedAt = firstSince + (5 * 60);

        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.countVisibleForPubkey
            .mockResolvedValueOnce(1)
            .mockResolvedValueOnce(1)
            .mockResolvedValue(1);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([
            createRecord({
                eventId: 'small-window-latest',
                content: '現在の投稿',
                createdAt: latestCreatedAt,
            }),
        ]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        repositoryMock.upsertFetchedEvents.mockResolvedValue({
            insertedCount: 0,
            updatedCount: 0,
            unchangedCount: 1,
        });

        relayFetchServiceMock.fetchLatest
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 1000,
                    hasMore: true,
                    nextUntil: latestCreatedAt,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 2000,
                    hasMore: true,
                    nextUntil: fetchedCreatedAt,
                    oldestCreatedAt: fetchedCreatedAt,
                    events: [
                        {
                            event: {
                                id: 'small-window-known'.repeat(4),
                                pubkey: PUBKEY_HEX,
                                kind: 1,
                                content: '同一窓の既知投稿',
                                tags: [],
                                created_at: fetchedCreatedAt,
                                sig: 'c'.repeat(128),
                            },
                            relayUrls: ['wss://relay.example.com/'],
                        },
                    ],
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 3000,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'リレーから続きを取得' })).toBeTruthy();
        });

        await clickRelayFetchButton();

        await waitFor(() => {
            expect(relayFetchServiceMock.fetchLatest).toHaveBeenNthCalledWith(
                2,
                {} as any,
                expect.objectContaining({
                    pubkeyHex: PUBKEY_HEX,
                    since: firstSince,
                    until: firstUntil,
                }),
            );
            expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledTimes(2);
        });

        view.unmount();
    });

    it('リレー取得で投稿を追加した後は取得ボタンではなく追加分が見えるスクロール位置に戻す', async () => {
        let allowOlderChunk = false;
        const latest = createRecord({
            eventId: 'scroll-latest',
            content: '現在の投稿',
            createdAt: 150,
            postedAt: Date.UTC(2024, 0, 3, 0, 0, 0),
        });
        const fetchedOlder = createRecord({
            eventId: 'scroll-older',
            content: 'スクロール後に見える投稿',
            createdAt: 140,
            postedAt: Date.UTC(2024, 0, 2, 0, 0, 0),
        });

        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.countVisibleForPubkey
            .mockResolvedValueOnce(1)
            .mockResolvedValueOnce(1)
            .mockResolvedValueOnce(2)
            .mockResolvedValue(2);
        repositoryMock.getLatestVisibleChunk
            .mockResolvedValue([latest]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockImplementation(async (options: {
            cursor?: { eventId: string };
            limit?: number;
        }) => {
            if (
                allowOlderChunk &&
                options.cursor?.eventId === 'scroll-latest' &&
                options.limit === 50
            ) {
                getHistoryContainer().scrollTop = 999;
                return [fetchedOlder];
            }

            return [];
        });
        repositoryMock.upsertFetchedEvents.mockImplementationOnce(async () => {
            allowOlderChunk = true;
            return {
                insertedCount: 1,
                updatedCount: 0,
                unchangedCount: 0,
            };
        });
        relayFetchServiceMock.fetchLatest
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 1000,
                    nextUntil: 150,
                    hasMore: true,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 2000,
                    events: [
                        {
                            event: {
                                id: 'scroll-older-event'.repeat(4),
                                pubkey: PUBKEY_HEX,
                                kind: 1,
                                content: 'スクロール後に見える投稿',
                                tags: [],
                                created_at: 140,
                                sig: 'd'.repeat(128),
                            },
                            relayUrls: ['wss://relay.example.com/'],
                        },
                    ],
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'リレーから続きを取得' })).toBeTruthy();
        });

        const historyContainer = getHistoryContainer();
        historyContainer.scrollTop = 120;
        await clickRelayFetchButton();

        await waitFor(() => {
            expect(screen.getByText('スクロール後に見える投稿')).toBeTruthy();
            expect(historyContainer.scrollTop).toBe(120);
        });

        view.unmount();
    });

    it('リレー取得前に下端付近でも最下部へ自動追従しない', async () => {
        let allowOlderChunk = false;
        const latest = createRecord({
            eventId: 'scroll-bottom-latest',
            content: '現在の投稿',
            createdAt: 150,
            postedAt: Date.UTC(2024, 0, 3, 0, 0, 0),
        });
        const fetchedOlder = createRecord({
            eventId: 'scroll-bottom-older',
            content: '下端追従で見える古い投稿',
            createdAt: 140,
            postedAt: Date.UTC(2024, 0, 2, 0, 0, 0),
        });

        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.countVisibleForPubkey
            .mockResolvedValueOnce(1)
            .mockResolvedValueOnce(1)
            .mockResolvedValueOnce(2)
            .mockResolvedValue(2);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([latest]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockImplementation(async (options: {
            cursor?: { eventId: string };
            limit?: number;
        }) => {
            if (
                allowOlderChunk &&
                options.cursor?.eventId === 'scroll-bottom-latest' &&
                options.limit === 50
            ) {
                return [fetchedOlder];
            }

            return [];
        });
        repositoryMock.upsertFetchedEvents.mockImplementationOnce(async () => {
            allowOlderChunk = true;
            return {
                insertedCount: 1,
                updatedCount: 0,
                unchangedCount: 0,
            };
        });
        relayFetchServiceMock.fetchLatest
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 1000,
                    nextUntil: 150,
                    hasMore: true,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 2000,
                    events: [
                        {
                            event: {
                                id: 'scroll-bottom-older-event'.repeat(4),
                                pubkey: PUBKEY_HEX,
                                kind: 1,
                                content: '下端追従で見える古い投稿',
                                tags: [],
                                created_at: 140,
                                sig: 'd'.repeat(128),
                            },
                            relayUrls: ['wss://relay.example.com/'],
                        },
                    ],
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'リレーから続きを取得' })).toBeTruthy();
        });

        const historyContainer = getHistoryContainer();
        let dynamicScrollHeight = 1000;
        Object.defineProperty(historyContainer, 'clientHeight', {
            configurable: true,
            get: () => 300,
        });
        Object.defineProperty(historyContainer, 'scrollHeight', {
            configurable: true,
            get: () => dynamicScrollHeight,
        });
        historyContainer.scrollTop = 700;

        repositoryMock.getOlderVisibleChunk.mockImplementation(async (options: {
            cursor?: { eventId: string };
            limit?: number;
        }) => {
            if (
                allowOlderChunk &&
                options.cursor?.eventId === 'scroll-bottom-latest' &&
                options.limit === 50
            ) {
                dynamicScrollHeight = 1300;
                return [fetchedOlder];
            }

            return [];
        });

        await clickRelayFetchButton();

        await waitFor(() => {
            expect(screen.getByText('下端追従で見える古い投稿')).toBeTruthy();
            expect(historyContainer.scrollTop).toBe(700);
        });

        view.unmount();
    });

    it('anchor が取れる場合は older-backfill 後に anchor 復元を優先する', async () => {
        let allowOlderChunk = false;
        const latest = createRecord({
            eventId: 'anchor-restore-latest',
            content: 'アンカー対象の投稿',
            createdAt: 200,
            postedAt: Date.UTC(2024, 0, 3, 0, 0, 0),
        });
        const second = createRecord({
            eventId: 'anchor-restore-second',
            content: '2件目の投稿',
            createdAt: 190,
            postedAt: Date.UTC(2024, 0, 2, 23, 0, 0),
        });
        const fetchedOlder = createRecord({
            eventId: 'anchor-restore-older',
            content: '追加された古い投稿',
            createdAt: 180,
            postedAt: Date.UTC(2024, 0, 2, 22, 0, 0),
        });

        repositoryMock.countForPubkey.mockResolvedValue(2);
        repositoryMock.countVisibleForPubkey
            .mockResolvedValueOnce(2)
            .mockResolvedValueOnce(2)
            .mockResolvedValueOnce(3)
            .mockResolvedValue(3);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([latest, second]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockImplementation(async (options: {
            cursor?: { eventId: string };
            limit?: number;
        }) => {
            if (
                allowOlderChunk &&
                options.cursor?.eventId === 'anchor-restore-second' &&
                options.limit === 50
            ) {
                return [fetchedOlder];
            }

            return [];
        });
        repositoryMock.upsertFetchedEvents.mockImplementationOnce(async () => {
            allowOlderChunk = true;
            return {
                insertedCount: 1,
                updatedCount: 0,
                unchangedCount: 0,
            };
        });
        relayFetchServiceMock.fetchLatest
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 1000,
                    nextUntil: 200,
                    hasMore: true,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 2000,
                    events: [
                        {
                            event: {
                                id: 'anchor-restore-older-event'.repeat(4),
                                pubkey: PUBKEY_HEX,
                                kind: 1,
                                content: '追加された古い投稿',
                                tags: [],
                                created_at: 180,
                                sig: 'd'.repeat(128),
                            },
                            relayUrls: ['wss://relay.example.com/'],
                        },
                    ],
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'リレーから続きを取得' })).toBeTruthy();
            expect(screen.getByText('アンカー対象の投稿')).toBeTruthy();
        });

        const historyContainer = getHistoryContainer();
        const containerRect = {
            x: 0,
            y: 0,
            top: 0,
            left: 0,
            right: 320,
            bottom: 320,
            width: 320,
            height: 320,
            toJSON: () => ({}),
        };
        vi.spyOn(historyContainer, 'getBoundingClientRect').mockReturnValue(containerRect as DOMRect);
        let anchorTop = 20;
        const items = Array.from(
            historyContainer.querySelectorAll<HTMLElement>('[data-post-history-event-id]'),
        );
        if (items.length > 0) {
            vi.spyOn(items[0], 'getBoundingClientRect').mockImplementation(() => ({
                ...containerRect,
                top: anchorTop,
                bottom: anchorTop + 60,
                height: 60,
            }) as DOMRect);
        }
        historyContainer.scrollTop = 300;
        const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => undefined);

        repositoryMock.getOlderVisibleChunk.mockImplementation(async (options: {
            cursor?: { eventId: string };
            limit?: number;
        }) => {
            if (
                allowOlderChunk &&
                options.cursor?.eventId === 'anchor-restore-second' &&
                options.limit === 50
            ) {
                anchorTop = 60;
                return [fetchedOlder];
            }

            return [];
        });

        await clickRelayFetchButton();

        await waitFor(() => {
            expect(screen.getByText('追加された古い投稿')).toBeTruthy();
            expect(screen.getByText('アンカー対象の投稿')).toBeTruthy();
            expect(historyContainer.scrollTop).toBe(340);
        });
        const scrollSummaryCall = debugSpy.mock.calls.find(
            ([label]) => label === 'post_history_older_backfill_scroll',
        );
        expect(scrollSummaryCall?.[1]).toEqual(expect.objectContaining({
            anchorEventId: 'anchor-restore-latest',
            didFollowBottom: false,
            didRestoreAnchor: true,
            didPreserveScrollTop: false,
        }));
        debugSpy.mockRestore();

        view.unmount();
    });

    it('anchor が取れない場合は previousScrollTop を維持する', async () => {
        let allowOlderChunk = false;
        const latest = createRecord({
            eventId: 'preserve-scroll-latest',
            content: '現在の投稿',
            createdAt: 150,
            postedAt: Date.UTC(2024, 0, 3, 0, 0, 0),
        });
        const fetchedOlder = createRecord({
            eventId: 'preserve-scroll-older',
            content: '追加取得した古い投稿',
            createdAt: 140,
            postedAt: Date.UTC(2024, 0, 2, 0, 0, 0),
        });

        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.countVisibleForPubkey
            .mockResolvedValueOnce(1)
            .mockResolvedValueOnce(1)
            .mockResolvedValueOnce(2)
            .mockResolvedValue(2);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([latest]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockImplementation(async (options: {
            cursor?: { eventId: string };
            limit?: number;
        }) => {
            if (
                allowOlderChunk &&
                options.cursor?.eventId === 'preserve-scroll-latest' &&
                options.limit === 50
            ) {
                return [fetchedOlder];
            }

            return [];
        });
        repositoryMock.upsertFetchedEvents.mockImplementationOnce(async () => {
            allowOlderChunk = true;
            return {
                insertedCount: 1,
                updatedCount: 0,
                unchangedCount: 0,
            };
        });
        relayFetchServiceMock.fetchLatest
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 1000,
                    nextUntil: 150,
                    hasMore: true,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 2000,
                    events: [
                        {
                            event: {
                                id: 'preserve-scroll-older-event'.repeat(4),
                                pubkey: PUBKEY_HEX,
                                kind: 1,
                                content: '追加取得した古い投稿',
                                tags: [],
                                created_at: 140,
                                sig: 'd'.repeat(128),
                            },
                            relayUrls: ['wss://relay.example.com/'],
                        },
                    ],
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'リレーから続きを取得' })).toBeTruthy();
        });

        const historyContainer = getHistoryContainer();
        historyContainer.scrollTop = 222;

        await clickRelayFetchButton();

        await waitFor(() => {
            expect(screen.getByText('追加取得した古い投稿')).toBeTruthy();
            expect(historyContainer.scrollTop).toBe(222);
        });

        view.unmount();
    });

    it('older-backfill で即時表示しきれない古い投稿がある場合は直後に さらに古い投稿を表示 ボタンへ切り替わる', async () => {
        const initialPosts = Array.from({ length: 128 }, (_, index) => createRecord({
            eventId: `initial-${index}`,
            content: `初期投稿 ${index + 1}`,
            createdAt: 2_000 - index,
            postedAt: Date.UTC(2024, 0, 3, 0, 0, 0) - index,
        }));
        const relayOlderPosts = Array.from({ length: 30 }, (_, index) => createRecord({
            eventId: `relay-older-${index}`,
            content: `取得済み古い投稿 ${index + 1}`,
            createdAt: 1_800 - index,
            postedAt: Date.UTC(2024, 0, 1, 0, 0, 0) - index,
        }));
        let allowBackfillOlderChunk = false;

        repositoryMock.countForPubkey.mockResolvedValue(158);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue(initialPosts);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockImplementation(async (options: {
            cursor?: { eventId: string };
            limit?: number;
        }) => {
            if (
                allowBackfillOlderChunk &&
                options.limit === 50 &&
                options.cursor?.eventId === initialPosts[127].eventId
            ) {
                return relayOlderPosts;
            }

            if (allowBackfillOlderChunk && options.limit === 1) {
                return [relayOlderPosts[22]];
            }

            return [];
        });
        repositoryMock.upsertFetchedEvents.mockImplementationOnce(async () => {
            allowBackfillOlderChunk = true;
            return {
                insertedCount: relayOlderPosts.length,
                updatedCount: 0,
                unchangedCount: 0,
            };
        });

        relayFetchServiceMock.fetchLatest
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 1000,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 2000,
                    events: relayOlderPosts.map((post, index) => ({
                        event: {
                            id: `relay-older-event-${index}`.padEnd(64, 'r'),
                            pubkey: PUBKEY_HEX,
                            kind: 1,
                            content: post.content,
                            tags: [],
                            created_at: post.createdAt,
                            sig: 'd'.repeat(128),
                        },
                        relayUrls: ['wss://relay.example.com/'],
                    })),
                    oldestCreatedAt: relayOlderPosts[relayOlderPosts.length - 1].createdAt,
                    newestCreatedAt: relayOlderPosts[0].createdAt,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'リレーから続きを取得' })).toBeTruthy();
        });

        await clickRelayFetchButton();

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'さらに古い投稿を表示' })).toBeTruthy();
            expect(document.querySelectorAll('.post-history-item')).toHaveLength(150);
            expect(screen.getByText('取得済み古い投稿 22')).toBeTruthy();
        });

        view.unmount();
    });

    it('limit 到達で進展が無いときは oldestCreatedAt - 1 に逃がして再取得できる', async () => {
        const initialWindowSeconds = 12 * 60 * 60;
        const latestCreatedAt = 1_700_000_000;
        const firstUntil = latestCreatedAt - 1;
        const firstSince = firstUntil - initialWindowSeconds;
        const sameSecondCreatedAt = latestCreatedAt - 100;
        const escapedCreatedAt = sameSecondCreatedAt - 1;
        const latest = createRecord({
            eventId: 'stall-latest',
            content: '現在の投稿',
            createdAt: latestCreatedAt,
            postedAt: Date.UTC(2024, 0, 3, 0, 0, 0),
        });
        const fetchedOlder = createRecord({
            eventId: 'stall-older',
            content: '逃がし後に取得した投稿',
            createdAt: escapedCreatedAt,
            postedAt: Date.UTC(2024, 0, 2, 0, 0, 0),
        });

        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.countVisibleForPubkey
            .mockResolvedValueOnce(1)
            .mockResolvedValueOnce(1)
            .mockResolvedValueOnce(1)
            .mockResolvedValueOnce(51);
        repositoryMock.getLatestVisibleChunk
            .mockResolvedValueOnce([latest])
            .mockResolvedValueOnce([latest]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockImplementation(async (_options: {
            cursor?: { eventId: string };
            limit?: number;
        }) => {
            if (_options.cursor?.eventId === 'stall-latest' && _options.limit === 50) {
                return [fetchedOlder];
            }

            return [];
        });
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
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 1000,
                    nextUntil: latestCreatedAt,
                    hasMore: true,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 2000,
                    nextUntil: sameSecondCreatedAt,
                    hasMore: true,
                    events: [
                        {
                            event: {
                                id: 'same-second-event'.repeat(4),
                                pubkey: PUBKEY_HEX,
                                kind: 1,
                                content: '同じ秒の既知投稿',
                                tags: [],
                                created_at: sameSecondCreatedAt,
                                sig: 'c'.repeat(128),
                            },
                            relayUrls: ['wss://relay.example.com/'],
                        },
                    ],
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 3000,
                    events: [
                        {
                            event: {
                                id: 'older-after-stall'.repeat(4),
                                pubkey: PUBKEY_HEX,
                                kind: 1,
                                content: '逃がし後に取得した投稿',
                                tags: [],
                                created_at: escapedCreatedAt,
                                sig: 'd'.repeat(128),
                            },
                            relayUrls: ['wss://relay.example.com/'],
                        },
                    ],
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'リレーから続きを取得' })).toBeTruthy();
        });

        await clickRelayFetchButton();

        await waitFor(() => {
            expect(relayFetchServiceMock.fetchLatest).toHaveBeenNthCalledWith(
                2,
                {} as any,
                expect.objectContaining({
                    pubkeyHex: PUBKEY_HEX,
                    since: firstSince,
                    until: firstUntil,
                }),
            );
            expect(relayFetchServiceMock.fetchLatest).toHaveBeenNthCalledWith(
                3,
                {} as any,
                expect.objectContaining({
                    pubkeyHex: PUBKEY_HEX,
                    since: firstSince,
                    until: sameSecondCreatedAt - 1,
                }),
            );
            expect(screen.getByText('逃がし後に取得した投稿')).toBeTruthy();
        });

        view.unmount();
    });

    it('古い投稿取得中は heading loader を表示し、0件でもリレー取得ボタンを残す', async () => {
        const olderFetch = createDeferred<Record<string, unknown>>();
        const latest = createRecord({
            eventId: 'loader-latest',
            content: '現在の投稿',
            createdAt: 1_700_000_000,
        });

        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.countVisibleForPubkey
            .mockResolvedValueOnce(1)
            .mockResolvedValueOnce(1)
            .mockResolvedValue(1);
        repositoryMock.getLatestVisibleChunk
            .mockResolvedValueOnce([latest])
            .mockResolvedValueOnce([latest]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        relayFetchServiceMock.fetchLatest
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 1000,
                    nextUntil: latest.createdAt,
                    hasMore: true,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: olderFetch.promise,
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 2100,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 2200,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 2300,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 2400,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 2500,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'リレーから続きを取得' })).toBeTruthy();
        });

        await clickRelayFetchButton();

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'リレーから取得中...' }).hasAttribute('disabled')).toBe(true);
            expect(document.querySelector('.post-history-nav-loading-placeholder .loader-container')).toBeTruthy();
            expect(screen.getByText('リレーと同期中...')).toBeTruthy();
            expect(document.querySelector('.status-loading-placeholder .loader-container')).toBeTruthy();
            expect(screen.queryByText('これ以上古い投稿はありません')).toBeNull();
        });

        olderFetch.resolve(createRelayFetchResult({
            fetchedAt: 2000,
            relayUrls: ['wss://relay.example.com/'],
        }));

        await waitFor(() => {
            expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledTimes(7);
            expect(screen.getByRole('button', { name: 'リレーから続きを取得' })).toBeTruthy();
            expect(screen.queryByText('これ以上古い投稿はありません')).toBeNull();
        });

        view.unmount();
    });
});
