import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import {
    PUBKEY_HEX,
    PostHistoryDialog,
    clickMenuAction,
    cleanupPostHistoryDialogHarness,
    createDeferred,
    createRecord,
    getHistoryContainer,
    openPostHistoryMenu,
    postMediaCacheServiceMock,
    repositoryMock,
    resetPostHistoryDialogHarness,
    relayFetchServiceMock,
} from './postHistoryDialogTestHarness';

describe('PostHistoryDialog timeline navigation', () => {
    beforeEach(() => {
        resetPostHistoryDialogHarness();
    });

    afterEach(() => {
        cleanupPostHistoryDialogHarness();
    });

    it('通常一覧で古い投稿を追加表示する', async () => {
        const newest = createRecord({
            eventId: 'timeline-newest',
            content: '最新投稿',
            createdAt: 1_704_326_400,
            postedAt: Date.UTC(2024, 0, 3, 0, 0, 0),
        });
        const middle = createRecord({
            eventId: 'timeline-middle',
            content: '中間投稿',
            createdAt: 1_704_240_000,
            postedAt: Date.UTC(2024, 0, 2, 0, 0, 0),
        });
        const older = createRecord({
            eventId: 'timeline-older',
            content: '古い投稿',
            createdAt: 1_704_153_600,
            postedAt: Date.UTC(2024, 0, 1, 0, 0, 0),
        });
        const oldest = createRecord({
            eventId: 'timeline-oldest',
            content: '最古投稿',
            createdAt: 1_704_067_200,
            postedAt: Date.UTC(2023, 11, 31, 0, 0, 0),
        });

        repositoryMock.countForPubkey.mockResolvedValue(4);
        repositoryMock.getLatestVisibleChunk.mockResolvedValueOnce([newest, middle]);
        repositoryMock.getNewerVisibleChunk
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([]);
        repositoryMock.getOlderVisibleChunk
            .mockResolvedValueOnce([older])
            .mockResolvedValueOnce([older, oldest])
            .mockResolvedValueOnce([]);

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('最新投稿')).toBeTruthy();
            expect(screen.getByRole('button', { name: 'さらに古い投稿を表示' })).toBeTruthy();
        });

        await fireEvent.click(screen.getByRole('button', { name: 'さらに古い投稿を表示' }));

        await waitFor(() => {
            expect(screen.getByText('古い投稿')).toBeTruthy();
            expect(screen.getByText('最古投稿')).toBeTruthy();
            expect(screen.getByText('4件表示 / 全 4件')).toBeTruthy();
        });

        view.unmount();
    });

    it('日付へ移動したあと最新へ戻れる', async () => {
        const newest = createRecord({
            eventId: 'jump-newest',
            content: '最新投稿',
            createdAt: 1_704_326_400,
            postedAt: Date.UTC(2024, 0, 3, 0, 0, 0),
        });
        const middle = createRecord({
            eventId: 'jump-middle',
            content: '中間投稿',
            createdAt: 1_704_240_000,
            postedAt: Date.UTC(2024, 0, 2, 0, 0, 0),
        });
        const older = createRecord({
            eventId: 'jump-older',
            content: '古い投稿',
            createdAt: 1_704_153_600,
            postedAt: Date.UTC(2024, 0, 1, 0, 0, 0),
        });
        const oldest = createRecord({
            eventId: 'jump-oldest',
            content: '最古投稿',
            createdAt: 1_704_067_200,
            postedAt: Date.UTC(2023, 11, 31, 0, 0, 0),
        });

        repositoryMock.countForPubkey.mockResolvedValue(4);
        repositoryMock.getLatestVisibleChunk
            .mockResolvedValueOnce([newest, middle])
            .mockResolvedValueOnce([newest, middle]);
        repositoryMock.getVisibleChunkFromCreatedAt.mockResolvedValueOnce([older, oldest]);
        repositoryMock.getNewerVisibleChunk
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([middle])
            .mockResolvedValueOnce([]);
        repositoryMock.getOlderVisibleChunk
            .mockResolvedValueOnce([older])
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([older]);

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('最新投稿')).toBeTruthy();
        });

        await openPostHistoryMenu();
        await fireEvent.click(await screen.findByRole('button', { name: '日付へ移動' }));
        await fireEvent.input(screen.getByLabelText('日付'), {
            target: { value: '2024-01-01' },
        });
        await fireEvent.click(screen.getByRole('button', { name: 'この日付付近を表示' }));

        await waitFor(() => {
            expect(screen.getByText('古い投稿')).toBeTruthy();
            expect(screen.getByRole('button', { name: '最新へ戻る' })).toBeTruthy();
            expect(screen.getByRole('button', { name: '新しい投稿を表示' })).toBeTruthy();
        });

        await fireEvent.click(screen.getByRole('button', { name: '最新へ戻る' }));

        await waitFor(() => {
            expect(screen.getByText('最新投稿')).toBeTruthy();
            expect(screen.getByText('中間投稿')).toBeTruthy();
            expect(screen.queryByText('最古投稿')).toBeNull();
        });

        view.unmount();
    });

    it('メニューの最古へ移動はリレー同期せずローカル最古ページへ移動する', async () => {
        const newest = createRecord({
            eventId: 'oldest-menu-newest',
            content: '最新投稿',
            createdAt: 1_704_326_400,
            postedAt: Date.UTC(2024, 0, 3, 0, 0, 0),
        });
        const middle = createRecord({
            eventId: 'oldest-menu-middle',
            content: '中間投稿',
            createdAt: 1_704_240_000,
            postedAt: Date.UTC(2024, 0, 2, 0, 0, 0),
        });
        const older = createRecord({
            eventId: 'oldest-menu-older',
            content: '古い投稿',
            createdAt: 1_704_153_600,
            postedAt: Date.UTC(2024, 0, 1, 0, 0, 0),
        });
        const oldest = createRecord({
            eventId: 'oldest-menu-oldest',
            content: '最古投稿',
            createdAt: 1_704_067_200,
            postedAt: Date.UTC(2023, 11, 31, 0, 0, 0),
        });

        repositoryMock.countForPubkey.mockResolvedValue(4);
        repositoryMock.getLatestVisibleChunk.mockResolvedValueOnce([newest, middle]);
        repositoryMock.getVisibleChunkFromCreatedAt.mockResolvedValueOnce([older, oldest]);
        repositoryMock.getNewerVisibleChunk
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([middle]);
        repositoryMock.getOlderVisibleChunk
            .mockResolvedValueOnce([older])
            .mockResolvedValueOnce([]);

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('最新投稿')).toBeTruthy();
        });

        await openPostHistoryMenu();
        await fireEvent.click(await screen.findByRole('button', { name: '最古へ移動' }));

        await waitFor(() => {
            expect(screen.getByText('最古投稿')).toBeTruthy();
            expect(repositoryMock.getVisibleChunkFromCreatedAt).toHaveBeenCalledWith(
                expect.objectContaining({
                    pubkeyHex: PUBKEY_HEX,
                    createdAt: 0,
                }),
            );
            expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledTimes(1);
        });

        view.unmount();
    });

    it('ローカル履歴が尽きたら exhausted state を表示する', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(2);
        repositoryMock.getLatestVisibleChunk.mockResolvedValueOnce([
            createRecord({ eventId: 'exhausted-newest', content: '最新投稿' }),
            createRecord({ eventId: 'exhausted-older', content: '少し古い投稿', createdAt: 1_704_153_600 }),
        ]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValueOnce([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValueOnce([]);

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('ローカル履歴はここまでです')).toBeTruthy();
        });

        view.unmount();
    });

    it('現在表示中の media URL を descriptor prefetch し、古い投稿の追加後に更新する', async () => {
        postMediaCacheServiceMock.canUsePersistentCache.mockReturnValue(true);

        const latest = createRecord({
            eventId: 'prefetch-latest',
            content: '最新メディア投稿',
            media: [
                {
                    url: 'https://example.com/latest.jpg',
                    mimeType: 'image/jpeg',
                },
            ],
        });
        const older = createRecord({
            eventId: 'prefetch-older',
            content: '古いメディア投稿',
            createdAt: 1_699_999_999,
            postedAt: Date.UTC(2024, 0, 1, 0, 0, 0),
            media: [
                {
                    url: 'https://example.com/older.jpg',
                    mimeType: 'image/jpeg',
                },
            ],
        });

        repositoryMock.countForPubkey.mockResolvedValue(2);
        repositoryMock.getLatestVisibleChunk.mockResolvedValueOnce([latest]);
        repositoryMock.getNewerVisibleChunk
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([]);
        repositoryMock.getOlderVisibleChunk
            .mockResolvedValueOnce([older])
            .mockResolvedValueOnce([older])
            .mockResolvedValueOnce([]);

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
            },
        });

        await waitFor(() => {
            expect(postMediaCacheServiceMock.prefetchCachedMediaDescriptors)
                .toHaveBeenLastCalledWith(['https://example.com/latest.jpg']);
            expect(screen.getByText('最新メディア投稿')).toBeTruthy();
        });

        await fireEvent.click(screen.getByRole('button', { name: 'さらに古い投稿を表示' }));

        await waitFor(() => {
            expect(postMediaCacheServiceMock.prefetchCachedMediaDescriptors)
                .toHaveBeenLastCalledWith([
                    'https://example.com/latest.jpg',
                    'https://example.com/older.jpg',
                ]);
            expect(screen.getByText('古いメディア投稿')).toBeTruthy();
        });

        view.unmount();
    });

    it('新しい投稿の描画が完了するまでは scrollTop を維持し、完了後に先頭へ戻す', async () => {
        const newest = createRecord({
            eventId: 'scroll-newest',
            content: '最新投稿',
            createdAt: 1_704_326_400,
            postedAt: Date.UTC(2024, 0, 3, 0, 0, 0),
        });
        const middle = createRecord({
            eventId: 'scroll-middle',
            content: '中間投稿',
            createdAt: 1_704_240_000,
            postedAt: Date.UTC(2024, 0, 2, 0, 0, 0),
        });
        const older = createRecord({
            eventId: 'scroll-older',
            content: '古い投稿',
            createdAt: 1_704_153_600,
            postedAt: Date.UTC(2024, 0, 1, 0, 0, 0),
        });
        const oldest = createRecord({
            eventId: 'scroll-oldest',
            content: '最古投稿',
            createdAt: 1_704_067_200,
            postedAt: Date.UTC(2023, 11, 31, 0, 0, 0),
        });
        const newerChunk = createDeferred<ReturnType<typeof createRecord>[]>();

        repositoryMock.countForPubkey.mockResolvedValue(4);
        repositoryMock.getLatestVisibleChunk.mockResolvedValueOnce([newest, middle]);
        repositoryMock.getVisibleChunkFromCreatedAt.mockResolvedValueOnce([older, oldest]);
        repositoryMock.getNewerVisibleChunk
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([middle])
            .mockReturnValueOnce(newerChunk.promise)
            .mockResolvedValueOnce([]);
        repositoryMock.getOlderVisibleChunk
            .mockResolvedValueOnce([older])
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([older]);

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('最新投稿')).toBeTruthy();
        });

        await clickMenuAction('日付へ移動');
        await fireEvent.input(screen.getByLabelText('日付'), {
            target: { value: '2024-01-01' },
        });
        await fireEvent.click(screen.getByRole('button', { name: 'この日付付近を表示' }));

        await waitFor(() => {
            expect(screen.getByText('古い投稿')).toBeTruthy();
            expect(screen.getByRole('button', { name: '新しい投稿を表示' })).toBeTruthy();
        });

        await new Promise((resolve) => setTimeout(resolve, 20));

        const historyContainer = getHistoryContainer();
        historyContainer.scrollTop = 240;

        await fireEvent.click(screen.getByRole('button', { name: '新しい投稿を表示' }));

        expect(screen.getByText('古い投稿')).toBeTruthy();
        expect(historyContainer.scrollTop).toBe(240);

        newerChunk.resolve([newest, middle]);

        await waitFor(() => {
            expect(screen.getByText('最新投稿')).toBeTruthy();
        });
        await new Promise((resolve) => setTimeout(resolve, 20));

        expect(historyContainer.scrollTop).toBe(0);
        view.unmount();
    });

    it('close 後に reopen すると前回の visible window を即時復元する', async () => {
        const newest = createRecord({
            eventId: 'restore-newest',
            content: '最新投稿',
            createdAt: 1_704_326_400,
            postedAt: Date.UTC(2024, 0, 3, 0, 0, 0),
        });
        const middle = createRecord({
            eventId: 'restore-middle',
            content: '中間投稿',
            createdAt: 1_704_240_000,
            postedAt: Date.UTC(2024, 0, 2, 0, 0, 0),
        });
        const older = createRecord({
            eventId: 'restore-older',
            content: '古い投稿',
            createdAt: 1_704_153_600,
            postedAt: Date.UTC(2024, 0, 1, 0, 0, 0),
        });
        const oldest = createRecord({
            eventId: 'restore-oldest',
            content: '最古投稿',
            createdAt: 1_704_067_200,
            postedAt: Date.UTC(2023, 11, 31, 0, 0, 0),
        });

        repositoryMock.countForPubkey.mockResolvedValue(4);
        repositoryMock.getLatestVisibleChunk.mockResolvedValueOnce([newest, middle]);
        repositoryMock.getVisibleChunkFromCreatedAt.mockResolvedValueOnce([older, oldest]);
        repositoryMock.getNewerVisibleChunk
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([middle]);
        repositoryMock.getOlderVisibleChunk
            .mockResolvedValueOnce([older])
            .mockResolvedValueOnce([]);

        const onClose = vi.fn();
        const firstView = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose,
                pubkeyHex: PUBKEY_HEX,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('最新投稿')).toBeTruthy();
        });

        await clickMenuAction('日付へ移動');
        await fireEvent.input(screen.getByLabelText('日付'), {
            target: { value: '2024-01-01' },
        });
        await fireEvent.click(screen.getByRole('button', { name: 'この日付付近を表示' }));

        await waitFor(() => {
            expect(screen.getByText('古い投稿')).toBeTruthy();
            expect(screen.getByText('最古投稿')).toBeTruthy();
        });

        firstView.unmount();
        repositoryMock.getLatestVisibleChunk.mockClear();

        const secondView = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose,
                pubkeyHex: PUBKEY_HEX,
            },
        });

        expect(screen.getByText('古い投稿')).toBeTruthy();
        expect(screen.getByText('最古投稿')).toBeTruthy();
        expect(repositoryMock.getLatestVisibleChunk).not.toHaveBeenCalled();

        secondView.unmount();
    });
});
