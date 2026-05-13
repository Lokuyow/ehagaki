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
    relayFetchServiceMock,
    repairServiceMock,
    repositoryMock,
    resetPostHistoryDialogHarness,
} from './postHistoryDialogTestHarness';

describe('PostHistoryDialog timeline relay flows', () => {
    beforeEach(() => {
        resetPostHistoryDialogHarness();
    });

    afterEach(() => {
        cleanupPostHistoryDialogHarness();
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
            expect(screen.getByText('リレーと同期中...')).toBeTruthy();
            expect(document.querySelector('.status-loading-placeholder .loader-container')).toBeTruthy();
        });

        expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledWith(
            {} as any,
            expect.objectContaining({
                pubkeyHex: PUBKEY_HEX,
                limit: 200,
            }),
        );

        view.unmount();
        expect(cancel).toHaveBeenCalledOnce();
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
            .mockResolvedValueOnce(50)
            .mockResolvedValueOnce(51)
            .mockResolvedValueOnce(51);
        repositoryMock.getLatestVisibleChunk
            .mockResolvedValueOnce(initialPosts)
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
            expect(screen.getByText('50件表示 / 全 50件')).toBeTruthy();
        });

        await waitFor(() => {
            expect(screen.queryByText('リレーと同期中...')).toBeNull();
        });

        await clickMenuAction('表示中の投稿付近を再取得');

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
            expect(screen.getByText('50件表示 / 全 51件')).toBeTruthy();
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
            expect(screen.getByText('1件の投稿を追加しました')).toBeTruthy();
            expect(screen.getByText('修復された投稿')).toBeTruthy();
        });

        view.unmount();
    });

    it('追加できる投稿はありません のメッセージが自動で消える', async () => {
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

        await clickMenuAction('表示中の投稿付近を再取得');

        await waitFor(() => {
            expect(screen.getByText('追加できる投稿はありません')).toBeTruthy();
        });

        await new Promise((resolve) => setTimeout(resolve, 4000));

        await waitFor(() => {
            expect(screen.queryByText('追加できる投稿はありません')).toBeNull();
        });

        view.unmount();
    });

    it('1件の投稿を追加しました のメッセージが自動で消える', async () => {
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
                hadFailures: false,
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

        await clickMenuAction('表示中の投稿付近を再取得');

        await waitFor(() => {
            expect(screen.getByText('1件の投稿を追加しました')).toBeTruthy();
        });

        await new Promise((resolve) => setTimeout(resolve, 4000));

        await waitFor(() => {
            expect(screen.queryByText('1件の投稿を追加しました')).toBeNull();
        });

        view.unmount();
    });

    it('一部の取得に失敗しました。時間をおいて再実行してください。 のメッセージが自動で消える', async () => {
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

        await clickMenuAction('表示中の投稿付近を再取得');

        await waitFor(() => {
            expect(screen.getByText('一部の取得に失敗しました。時間をおいて再実行してください。')).toBeTruthy();
        });

        await new Promise((resolve) => setTimeout(resolve, 4000));

        await waitFor(() => {
            expect(screen.queryByText('一部の取得に失敗しました。時間をおいて再実行してください。')).toBeNull();
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
            expect(screen.getByRole('button', { name: 'リレーから古い投稿を取得' })).toBeTruthy();
        });

        await fireEvent.click(screen.getByRole('button', { name: 'リレーから古い投稿を取得' }));

        await waitFor(() => {
            expect(relayFetchServiceMock.fetchLatest).toHaveBeenNthCalledWith(
                2,
                {} as any,
                expect.objectContaining({
                    pubkeyHex: PUBKEY_HEX,
                    limit: 200,
                    until: 150,
                }),
            );
            expect(screen.getByText('1件表示 / 全 2件')).toBeTruthy();
            expect(screen.getByRole('button', { name: 'さらに古い投稿を表示' })).toBeTruthy();
        });

        await fireEvent.click(screen.getByRole('button', { name: 'さらに古い投稿を表示' }));

        await waitFor(() => {
            expect(screen.getByText('追加取得した古い投稿')).toBeTruthy();
        });

        view.unmount();
    });

    it('inclusive nextUntil で進展が無いときは until-1 に逃がして再取得できる', async () => {
        const latest = createRecord({
            eventId: 'stall-latest',
            content: '現在の投稿',
            createdAt: 150,
            postedAt: Date.UTC(2024, 0, 3, 0, 0, 0),
        });
        const fetchedOlder = createRecord({
            eventId: 'stall-older',
            content: '逃がし後に取得した投稿',
            createdAt: 149,
            postedAt: Date.UTC(2024, 0, 2, 0, 0, 0),
        });

        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.countVisibleForPubkey
            .mockResolvedValueOnce(1)
            .mockResolvedValueOnce(1)
            .mockResolvedValueOnce(1)
            .mockResolvedValueOnce(2);
        repositoryMock.getLatestVisibleChunk
            .mockResolvedValueOnce([latest])
            .mockResolvedValueOnce([latest]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk
            .mockResolvedValueOnce([])
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
                    nextUntil: 150,
                    hasMore: true,
                    events: [
                        {
                            event: {
                                id: 'same-second-event'.repeat(4),
                                pubkey: PUBKEY_HEX,
                                kind: 1,
                                content: '同じ秒の既知投稿',
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
                    fetchedAt: 3000,
                    events: [
                        {
                            event: {
                                id: 'older-after-stall'.repeat(4),
                                pubkey: PUBKEY_HEX,
                                kind: 1,
                                content: '逃がし後に取得した投稿',
                                tags: [],
                                created_at: 149,
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
            expect(screen.getByRole('button', { name: 'リレーから古い投稿を取得' })).toBeTruthy();
        });

        await fireEvent.click(screen.getByRole('button', { name: 'リレーから古い投稿を取得' }));

        await waitFor(() => {
            expect(relayFetchServiceMock.fetchLatest).toHaveBeenNthCalledWith(
                2,
                {} as any,
                expect.objectContaining({
                    pubkeyHex: PUBKEY_HEX,
                    until: 150,
                }),
            );
            expect(screen.getByRole('button', { name: 'リレーから古い投稿を取得' })).toBeTruthy();
            expect(screen.queryByText('これ以上古い投稿はありません')).toBeNull();
        });

        await fireEvent.click(screen.getByRole('button', { name: 'リレーから古い投稿を取得' }));

        await waitFor(() => {
            expect(relayFetchServiceMock.fetchLatest).toHaveBeenNthCalledWith(
                3,
                {} as any,
                expect.objectContaining({
                    pubkeyHex: PUBKEY_HEX,
                    until: 149,
                }),
            );
            expect(screen.getByRole('button', { name: 'さらに古い投稿を表示' })).toBeTruthy();
        });

        await fireEvent.click(screen.getByRole('button', { name: 'さらに古い投稿を表示' }));

        await waitFor(() => {
            expect(screen.getByText('逃がし後に取得した投稿')).toBeTruthy();
        });

        view.unmount();
    });

    it('古い投稿取得中は heading loader を表示し、取得しても増えなければ noMorePosts を出す', async () => {
        const olderFetch = createDeferred<Record<string, unknown>>();

        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.countVisibleForPubkey
            .mockResolvedValueOnce(1)
            .mockResolvedValueOnce(1);
        repositoryMock.getLatestVisibleChunk
            .mockResolvedValueOnce([createRecord({ eventId: 'loader-latest', content: '現在の投稿' })])
            .mockResolvedValueOnce([createRecord({ eventId: 'loader-latest', content: '現在の投稿' })]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([]);
        relayFetchServiceMock.fetchLatest
            .mockReturnValueOnce({
                promise: Promise.resolve(createRelayFetchResult({
                    fetchedAt: 1000,
                    nextUntil: 149,
                    hasMore: true,
                    relayUrls: ['wss://relay.example.com/'],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: olderFetch.promise,
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
            expect(screen.getByRole('button', { name: 'リレーから古い投稿を取得' })).toBeTruthy();
        });

        await fireEvent.click(screen.getByRole('button', { name: 'リレーから古い投稿を取得' }));

        await waitFor(() => {
            expect(screen.getByText('リレーと同期中...')).toBeTruthy();
            expect(document.querySelector('.status-loading-placeholder .loader-container')).toBeTruthy();
            expect(screen.queryByText('これ以上古い投稿はありません')).toBeNull();
        });

        olderFetch.resolve(createRelayFetchResult({
            fetchedAt: 2000,
            relayUrls: ['wss://relay.example.com/'],
        }));

        await waitFor(() => {
            expect(screen.getByText('これ以上古い投稿はありません')).toBeTruthy();
        });

        view.unmount();
    });
});
