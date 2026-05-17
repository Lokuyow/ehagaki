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
import { writePostHistoryDialogScrollState } from '../../lib/postHistoryDialogScrollState';
import { markPostHistoryShouldReturnToLatestAfterLocalPost } from '../../lib/postHistoryLatestRequest';

function createMockRect(top: number, height: number) {
    return {
        top,
        bottom: top + height,
        left: 0,
        right: 320,
        width: 320,
        height,
        x: 0,
        y: top,
        toJSON: () => ({ top, height }),
    };
}

function mockHistoryItemLayout(container: HTMLDivElement): void {
    Object.defineProperty(container, 'getBoundingClientRect', {
        configurable: true,
        value: () => createMockRect(0, 320),
    });

    const items = Array.from(
        container.querySelectorAll<HTMLElement>('.post-history-item'),
    );
    for (const [index, item] of items.entries()) {
        Object.defineProperty(item, 'getBoundingClientRect', {
            configurable: true,
            value: () => createMockRect(index * 84 - container.scrollTop, 72),
        });
    }
}

function getJumpDateSubmitButton(): HTMLButtonElement {
    const button = document.querySelector('.post-history-utility-submit-button');
    if (!(button instanceof HTMLButtonElement)) {
        throw new Error('日付ジャンプの送信ボタンが見つかりません');
    }

    return button;
}

describe('PostHistoryDialog timeline navigation', () => {
    beforeEach(() => {
        resetPostHistoryDialogHarness();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
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
            expect(document.querySelector('.post-history-summary-count')?.textContent).toBe('4件');
            expect(document.querySelector('.post-history-summary-range')).toBeNull();
        });

        view.unmount();
    });

    it('先頭付近の投稿に応じて月ラベルを更新し、件数は総件数だけを表示する', async () => {
        vi.useFakeTimers();
        vi.setSystemTime(Date.UTC(2024, 4, 15, 12, 0, 0));
        vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
            callback(0);
            return 1;
        });
        vi.stubGlobal('cancelAnimationFrame', vi.fn());

        const mayPostedAt = Date.UTC(2024, 4, 3, 0, 0, 0);
        const decemberPostedAt = Date.UTC(2023, 11, 20, 0, 0, 0);

        repositoryMock.countForPubkey.mockResolvedValue(2);
        repositoryMock.getLatestVisibleChunk.mockResolvedValueOnce([
            createRecord({
                eventId: 'month-current-year',
                content: '今年の5月投稿',
                createdAt: Math.floor(mayPostedAt / 1000),
                postedAt: mayPostedAt,
            }),
            createRecord({
                eventId: 'month-previous-year',
                content: '前年の12月投稿',
                createdAt: Math.floor(decemberPostedAt / 1000),
                postedAt: decemberPostedAt,
            }),
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
            expect(screen.getByText('今年の5月投稿')).toBeTruthy();
        });

        const historyContainer = getHistoryContainer();
        mockHistoryItemLayout(historyContainer);

        await fireEvent.scroll(historyContainer);

        await waitFor(() => {
            expect(screen.getByRole('heading', { level: 3, name: '5/3(金)' })).toBeTruthy();
            expect(document.querySelector('.post-history-summary-count')?.textContent).toBe('2件');
            expect(document.querySelector('.post-history-summary-range')).toBeNull();
        });

        await fireEvent.click(document.querySelector('.post-history-current-month') as HTMLElement);

        await waitFor(() => {
            expect(screen.getByLabelText('日付')).toBeTruthy();
        });

        await fireEvent.click(document.querySelector('.post-history-current-month') as HTMLElement);

        await waitFor(() => {
            expect(screen.queryByLabelText('日付')).toBeNull();
        });

        await clickMenuAction('日付へ移動');

        await waitFor(() => {
            expect(screen.getByLabelText('日付')).toBeTruthy();
        });

        await clickMenuAction('日付へ移動');

        await waitFor(() => {
            expect(screen.queryByLabelText('日付')).toBeNull();
        });

        historyContainer.scrollTop = 84;
        await fireEvent.scroll(historyContainer);

        await waitFor(() => {
            expect(screen.getByRole('heading', { level: 3, name: '2023/12' })).toBeTruthy();
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
        await fireEvent.click(await screen.findByRole('menuitem', { name: '日付へ移動' }));
        await fireEvent.input(screen.getByLabelText('日付'), {
            target: { value: '2024-01-01' },
        });
        await fireEvent.click(getJumpDateSubmitButton());

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

    it('最新ページでも最上部でなければ最新へ戻るで最上部へスクロールする', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(2);
        repositoryMock.getLatestVisibleChunk.mockResolvedValueOnce([
            createRecord({ eventId: 'latest-page-newest', content: '最新ページの新しい投稿' }),
            createRecord({
                eventId: 'latest-page-older',
                content: '最新ページの古い投稿',
                createdAt: 1_704_240_000,
                postedAt: Date.UTC(2024, 0, 2, 0, 0, 0),
            }),
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
            expect(screen.getByText('最新ページの古い投稿')).toBeTruthy();
        });

        const historyContainer = getHistoryContainer();
        Object.defineProperty(historyContainer, 'clientHeight', {
            configurable: true,
            value: 320,
        });
        Object.defineProperty(historyContainer, 'scrollHeight', {
            configurable: true,
            value: 720,
        });
        historyContainer.scrollTop = 120;
        await fireEvent.scroll(historyContainer);

        const returnToLatestButton = await screen.findByRole('button', { name: '最新へ戻る' });
        await fireEvent.click(returnToLatestButton);

        await waitFor(() => {
            expect(historyContainer.scrollTop).toBe(0);
            expect(repositoryMock.getLatestVisibleChunk).toHaveBeenCalledTimes(1);
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

        const historyContainer = getHistoryContainer();
        Object.defineProperty(historyContainer, 'scrollHeight', {
            configurable: true,
            value: 720,
        });

        await openPostHistoryMenu();
        await fireEvent.click(await screen.findByRole('menuitem', { name: '最古へ移動' }));

        await waitFor(() => {
            expect(screen.getByText('最古投稿')).toBeTruthy();
            expect(historyContainer.scrollTop).toBe(720);
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

    it('最後のページでも最下部でなければメニューの最古へ移動で最下部へスクロールする', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(2);
        repositoryMock.getLatestVisibleChunk.mockResolvedValueOnce([
            createRecord({ eventId: 'last-page-newest', content: '最後ページの新しい投稿' }),
            createRecord({
                eventId: 'last-page-oldest',
                content: '最後ページの古い投稿',
                createdAt: 1_704_067_200,
                postedAt: Date.UTC(2023, 11, 31, 0, 0, 0),
            }),
        ]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValueOnce([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValueOnce([]);

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('最後ページの古い投稿')).toBeTruthy();
        });

        const historyContainer = getHistoryContainer();
        Object.defineProperty(historyContainer, 'clientHeight', {
            configurable: true,
            value: 320,
        });
        Object.defineProperty(historyContainer, 'scrollHeight', {
            configurable: true,
            value: 720,
        });
        historyContainer.scrollTop = 120;
        await fireEvent.scroll(historyContainer);

        await openPostHistoryMenu();
        const jumpToOldestItem = await screen.findByRole('menuitem', { name: '最古へ移動' });
        expect(jumpToOldestItem.getAttribute('aria-disabled')).not.toBe('true');
        await fireEvent.click(jumpToOldestItem);

        await waitFor(() => {
            expect(historyContainer.scrollTop).toBe(720);
            expect(repositoryMock.getVisibleChunkFromCreatedAt).not.toHaveBeenCalled();
        });

        view.unmount();
    });

    it('古い投稿が尽きても terminal noMorePosts は表示しない', async () => {
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
            expect(screen.getByText('少し古い投稿')).toBeTruthy();
            expect(screen.queryByText('これ以上古い投稿はありません')).toBeNull();
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

    it('新しい投稿を追加表示しても現在見ている投稿のスクロール位置を維持する', async () => {
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
        const newerAvailability = createDeferred<ReturnType<typeof createRecord>[]>();

        repositoryMock.countForPubkey.mockResolvedValue(4);
        repositoryMock.getLatestVisibleChunk.mockResolvedValueOnce([newest, middle]);
        repositoryMock.getVisibleChunkFromCreatedAt.mockResolvedValueOnce([older, oldest]);
        repositoryMock.getNewerVisibleChunk
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([middle])
            .mockReturnValueOnce(newerChunk.promise)
            .mockReturnValueOnce(newerAvailability.promise);
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
        await fireEvent.click(getJumpDateSubmitButton());

        await waitFor(() => {
            expect(screen.getByText('古い投稿')).toBeTruthy();
            expect(screen.getByRole('button', { name: '新しい投稿を表示' })).toBeTruthy();
        });

        await new Promise((resolve) => setTimeout(resolve, 20));

        const historyContainer = getHistoryContainer();
        historyContainer.scrollTop = 240;
        const rect = (top: number, height: number) => ({
            x: 0,
            y: top,
            top,
            left: 0,
            right: 320,
            bottom: top + height,
            width: 320,
            height,
            toJSON: () => ({}),
        });
        const getBoundingClientRectSpy = vi
            .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
            .mockImplementation(function (this: HTMLElement) {
                if (this.classList.contains('post-history-container')) {
                    return rect(0, 600) as DOMRect;
                }

                const eventId = this.dataset.postHistoryEventId;
                const hasNewerPosts = screen.queryByText('最新投稿') !== null;
                const scrollOffset = historyContainer.scrollTop - 240;
                if (eventId === 'scroll-older') {
                    return rect(
                        (hasNewerPosts ? 320 : 120) - scrollOffset,
                        80,
                    ) as DOMRect;
                }
                if (eventId === 'scroll-oldest') {
                    return rect(
                        (hasNewerPosts ? 420 : 220) - scrollOffset,
                        80,
                    ) as DOMRect;
                }
                if (eventId === 'scroll-newest') {
                    return rect(120 - scrollOffset, 80) as DOMRect;
                }
                if (eventId === 'scroll-middle') {
                    return rect(220 - scrollOffset, 80) as DOMRect;
                }

                return rect(0, 0) as DOMRect;
            });

        await fireEvent.click(screen.getByRole('button', { name: '新しい投稿を表示' }));

        expect(screen.getByText('古い投稿')).toBeTruthy();
        expect(historyContainer.scrollTop).toBe(240);

        newerChunk.resolve([newest, middle]);
        await Promise.resolve();

        expect(screen.queryByText('最新投稿')).toBeNull();
        expect(historyContainer.scrollTop).toBe(240);

        newerAvailability.resolve([]);

        await waitFor(() => {
            expect(screen.getByText('最新投稿')).toBeTruthy();
        });
        await new Promise((resolve) => setTimeout(resolve, 20));

        expect(historyContainer.scrollTop).toBe(440);
        getBoundingClientRectSpy.mockRestore();
        view.unmount();
    });

    it('150件表示中に新しい投稿を追加すると古い投稿だけを50件捨てる', async () => {
        const createTimelinePost = (index: number) =>
            createRecord({
                eventId: `window-post-${index}`,
                content: `投稿 ${index}`,
                createdAt: 2_000 - index,
                postedAt: Date.UTC(2024, 0, 1, 0, 0, 0) - index,
            });
        const latestPosts = Array.from({ length: 50 }, (_, index) =>
            createTimelinePost(index),
        );
        const currentWindowPosts = Array.from({ length: 150 }, (_, index) =>
            createTimelinePost(index + 50),
        );
        const newerPosts = Array.from({ length: 50 }, (_, index) =>
            createTimelinePost(index),
        );

        repositoryMock.countForPubkey.mockResolvedValue(200);
        repositoryMock.getLatestVisibleChunk.mockResolvedValueOnce(latestPosts);
        repositoryMock.getVisibleChunkFromCreatedAt.mockResolvedValueOnce(currentWindowPosts);
        repositoryMock.getNewerVisibleChunk
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([createTimelinePost(49)])
            .mockResolvedValueOnce(newerPosts)
            .mockResolvedValueOnce([]);
        repositoryMock.getOlderVisibleChunk
            .mockResolvedValueOnce([createTimelinePost(100)])
            .mockResolvedValueOnce([createTimelinePost(200)])
            .mockResolvedValueOnce([createTimelinePost(200)]);

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('投稿 0')).toBeTruthy();
        });

        await clickMenuAction('日付へ移動');
        await fireEvent.input(screen.getByLabelText('日付'), {
            target: { value: '2024-01-01' },
        });
        await fireEvent.click(getJumpDateSubmitButton());

        await waitFor(() => {
            expect(screen.getByText('投稿 50')).toBeTruthy();
            expect(screen.getByText('投稿 199')).toBeTruthy();
            expect(screen.getByRole('button', { name: '新しい投稿を表示' })).toBeTruthy();
        });

        await fireEvent.click(screen.getByRole('button', { name: '新しい投稿を表示' }));

        await waitFor(() => {
            expect(screen.getByText('投稿 0')).toBeTruthy();
            expect(screen.getByText('投稿 149')).toBeTruthy();
        });

        expect(screen.queryByText('投稿 150')).toBeNull();
        expect(screen.queryByText('投稿 199')).toBeNull();
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
        await fireEvent.click(getJumpDateSubmitButton());

        await waitFor(() => {
            expect(screen.getByText('古い投稿')).toBeTruthy();
            expect(screen.getByText('最古投稿')).toBeTruthy();
        });

        writePostHistoryDialogScrollState({
            pubkeyHex: PUBKEY_HEX,
            mode: 'normal',
            anchor: {
                eventId: 'restore-older',
                offsetTop: 96,
            },
            savedAt: 1234,
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

    it('close 後に reopen すると保存したアンカー位置へ戻る', async () => {
        const newest = createRecord({
            eventId: 'anchor-newest',
            content: 'アンカー最新投稿',
            createdAt: 1_704_326_400,
            postedAt: Date.UTC(2024, 0, 3, 0, 0, 0),
        });
        const middle = createRecord({
            eventId: 'anchor-middle',
            content: 'アンカー中間投稿',
            createdAt: 1_704_240_000,
            postedAt: Date.UTC(2024, 0, 2, 0, 0, 0),
        });
        const older = createRecord({
            eventId: 'anchor-older',
            content: 'アンカー対象投稿',
            createdAt: 1_704_153_600,
            postedAt: Date.UTC(2024, 0, 1, 0, 0, 0),
        });

        repositoryMock.countForPubkey.mockResolvedValue(3);
        repositoryMock.getLatestVisibleChunk.mockResolvedValueOnce([newest, middle, older]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);

        const firstView = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
            },
        });

        await waitFor(() => {
            expect(
                document.querySelector(
                    '[data-post-history-event-id="anchor-older"]',
                ),
            ).toBeTruthy();
        });

        writePostHistoryDialogScrollState({
            pubkeyHex: PUBKEY_HEX,
            mode: 'normal',
            anchor: {
                eventId: 'anchor-older',
                offsetTop: 48,
            },
            savedAt: 5678,
        });
        firstView.unmount();
        repositoryMock.getLatestVisibleChunk.mockClear();

        const secondView = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
            },
        });

        const historyContainer = getHistoryContainer();
        historyContainer.scrollTop = 0;
        const rect = (top: number, height: number) => ({
            x: 0,
            y: top,
            top,
            left: 0,
            right: 320,
            bottom: top + height,
            width: 320,
            height,
            toJSON: () => ({}),
        });
        const getBoundingClientRectSpy = vi
            .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
            .mockImplementation(function (this: HTMLElement) {
                if (this.classList.contains('post-history-container')) {
                    return rect(0, 320) as DOMRect;
                }

                if (this.dataset.postHistoryEventId === 'anchor-older') {
                    return rect(168 - historyContainer.scrollTop, 72) as DOMRect;
                }

                return rect(0, 72) as DOMRect;
            });

        await waitFor(() => {
            expect(historyContainer.scrollTop).toBe(120);
        });
        expect(repositoryMock.getLatestVisibleChunk).not.toHaveBeenCalled();

        getBoundingClientRectSpy.mockRestore();
        secondView.unmount();
    });

    it('保存アンカーがある reopen ではローカルに新しい投稿があっても前回 window を維持する', async () => {
        const localNewPost = createRecord({
            eventId: 'local-new-post',
            content: 'ローカル保存済みの新規投稿',
            createdAt: 1_704_412_800,
            postedAt: Date.UTC(2024, 0, 4, 0, 0, 0),
        });
        const newest = createRecord({
            eventId: 'local-restore-newest',
            content: '既存最新投稿',
            createdAt: 1_704_326_400,
            postedAt: Date.UTC(2024, 0, 3, 0, 0, 0),
        });
        const older = createRecord({
            eventId: 'local-restore-older',
            content: '前回アンカー投稿',
            createdAt: 1_704_153_600,
            postedAt: Date.UTC(2024, 0, 1, 0, 0, 0),
        });

        repositoryMock.countForPubkey.mockResolvedValue(3);
        repositoryMock.getLatestVisibleChunk
            .mockResolvedValueOnce([newest, older]);
        repositoryMock.getNewerVisibleChunk
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([localNewPost])
            .mockResolvedValueOnce([localNewPost]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);

        const firstView = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
            },
        });

        await waitFor(() => {
            expect(
                document.querySelector(
                    '[data-post-history-event-id="local-restore-older"]',
                ),
            ).toBeTruthy();
        });

        writePostHistoryDialogScrollState({
            pubkeyHex: PUBKEY_HEX,
            mode: 'normal',
            anchor: {
                eventId: 'local-restore-older',
                offsetTop: 80,
            },
            savedAt: 9012,
        });
        firstView.unmount();
        repositoryMock.getLatestVisibleChunk.mockClear();

        const secondView = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
            },
        });

        await waitFor(() => {
            expect(
                document.querySelector(
                    '[data-post-history-event-id="local-restore-older"]',
                ),
            ).toBeTruthy();
            expect(screen.getByRole('button', { name: '新しい投稿を表示' })).toBeTruthy();
        });
        expect(screen.queryByText('ローカル保存済みの新規投稿')).toBeNull();
        expect(repositoryMock.getLatestVisibleChunk).not.toHaveBeenCalled();

        secondView.unmount();
    });

    it('閉じた後のローカル投稿 marker があれば reopen で最新チャンクを即時表示する', async () => {
        const previousLatest = createRecord({
            eventId: 'marker-previous-latest',
            content: '投稿前の最新投稿',
            createdAt: 1_704_326_400,
            postedAt: Date.UTC(2024, 0, 3, 0, 0, 0),
        });
        const localNewPost = createRecord({
            eventId: 'marker-local-new-post',
            content: '投稿直後に表示するローカル投稿',
            createdAt: 1_704_412_800,
            postedAt: Date.UTC(2024, 0, 4, 0, 0, 0),
        });

        repositoryMock.countForPubkey.mockResolvedValue(2);
        repositoryMock.getLatestVisibleChunk
            .mockResolvedValueOnce([previousLatest])
            .mockResolvedValueOnce([localNewPost, previousLatest]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);

        const firstView = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('投稿前の最新投稿')).toBeTruthy();
        });
        firstView.unmount();

        markPostHistoryShouldReturnToLatestAfterLocalPost({
            pubkeyHex: PUBKEY_HEX,
            eventId: 'marker-local-new-post',
            requestedAt: 10_000,
        });

        const secondView = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('投稿直後に表示するローカル投稿')).toBeTruthy();
            expect(screen.getByText('投稿前の最新投稿')).toBeTruthy();
        });
        expect(screen.queryByRole('button', { name: '新しい投稿を表示' })).toBeNull();
        expect(repositoryMock.getLatestVisibleChunk).toHaveBeenCalledTimes(2);

        secondView.unmount();
    });

    it('古い投稿位置を閉じた後にローカル投稿 marker があれば最新表示を優先する', async () => {
        const previousLatest = createRecord({
            eventId: 'marker-old-window-previous-latest',
            content: '投稿前の5/16投稿',
            createdAt: 1_747_417_200,
            postedAt: Date.UTC(2026, 4, 16, 12, 0, 0),
        });
        const oldAnchor = createRecord({
            eventId: 'marker-old-window-anchor',
            content: '保存していた5/12投稿',
            createdAt: 1_747_072_800,
            postedAt: Date.UTC(2026, 4, 12, 12, 0, 0),
        });
        const localNewPost = createRecord({
            eventId: 'marker-old-window-local-new-post',
            content: '投稿後に優先表示するローカル投稿',
            createdAt: 1_747_503_600,
            postedAt: Date.UTC(2026, 4, 17, 12, 0, 0),
        });

        repositoryMock.countForPubkey.mockResolvedValue(3);
        repositoryMock.getLatestVisibleChunk
            .mockResolvedValueOnce([previousLatest])
            .mockResolvedValueOnce([localNewPost, previousLatest]);
        repositoryMock.getVisibleChunkFromCreatedAt.mockResolvedValueOnce([oldAnchor]);
        repositoryMock.getNewerVisibleChunk
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([previousLatest])
            .mockResolvedValueOnce([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);

        const firstView = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('投稿前の5/16投稿')).toBeTruthy();
        });

        await clickMenuAction('日付へ移動');
        await fireEvent.input(screen.getByLabelText('日付'), {
            target: { value: '2026-05-12' },
        });
        await fireEvent.click(getJumpDateSubmitButton());

        await waitFor(() => {
            expect(screen.getByText('保存していた5/12投稿')).toBeTruthy();
        });

        writePostHistoryDialogScrollState({
            pubkeyHex: PUBKEY_HEX,
            mode: 'normal',
            anchor: {
                eventId: 'marker-old-window-anchor',
                offsetTop: 64,
            },
            savedAt: 10_000,
        });
        firstView.unmount();

        markPostHistoryShouldReturnToLatestAfterLocalPost({
            pubkeyHex: PUBKEY_HEX,
            eventId: 'marker-old-window-local-new-post',
            requestedAt: 10_001,
        });
        repositoryMock.getLatestVisibleChunk.mockClear();

        const secondView = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('投稿後に優先表示するローカル投稿')).toBeTruthy();
            expect(screen.getByText('投稿前の5/16投稿')).toBeTruthy();
        });
        expect(screen.queryByText('保存していた5/12投稿')).toBeNull();
        expect(screen.queryByRole('button', { name: '新しい投稿を表示' })).toBeNull();
        expect(repositoryMock.getLatestVisibleChunk).toHaveBeenCalledTimes(1);

        secondView.unmount();
    });

    it.each([
        {
            label: '5/12',
            dateInput: '2026-05-12',
            anchorEventId: 'restore-2026-05-12-anchor',
            anchorContent: '2026/5/12 の保存アンカー投稿',
            olderContent: '2026/5/12 の次の投稿',
            anchorCreatedAt: 1_747_072_800,
            anchorPostedAt: Date.UTC(2026, 4, 12, 12, 0, 0),
        },
        {
            label: '3/27',
            dateInput: '2026-03-27',
            anchorEventId: 'restore-2026-03-27-anchor',
            anchorContent: '2026/3/27 の保存アンカー投稿',
            olderContent: '2026/3/27 の次の投稿',
            anchorCreatedAt: 1_743_078_600,
            anchorPostedAt: Date.UTC(2026, 2, 27, 12, 0, 0),
        },
    ])(
        '$label 表示後の reopen は新しいローカル投稿があっても保存アンカーへ復元する',
        async ({
            dateInput,
            anchorEventId,
            anchorContent,
            olderContent,
            anchorCreatedAt,
            anchorPostedAt,
        }) => {
            const latest = createRecord({
                eventId: 'restore-2026-05-16-latest',
                content: '2026/5/16 の最新寄り投稿',
                createdAt: 1_747_417_200,
                postedAt: Date.UTC(2026, 4, 16, 12, 0, 0),
            });
            const anchor = createRecord({
                eventId: anchorEventId,
                content: anchorContent,
                createdAt: anchorCreatedAt,
                postedAt: anchorPostedAt,
            });
            const older = createRecord({
                eventId: `${anchorEventId}-older`,
                content: olderContent,
                createdAt: anchorCreatedAt - 60,
                postedAt: anchorPostedAt - 60_000,
            });

            repositoryMock.countForPubkey.mockResolvedValue(2617);
            repositoryMock.getLatestVisibleChunk.mockResolvedValueOnce([latest]);
            repositoryMock.getVisibleChunkFromCreatedAt.mockResolvedValueOnce([anchor, older]);
            repositoryMock.getNewerVisibleChunk
                .mockResolvedValueOnce([])
                .mockResolvedValueOnce([latest])
                .mockResolvedValueOnce([latest]);
            repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);

            const firstView = render(PostHistoryDialog, {
                props: {
                    show: true,
                    onClose: vi.fn(),
                    pubkeyHex: PUBKEY_HEX,
                },
            });

            await waitFor(() => {
                expect(screen.getByText('2026/5/16 の最新寄り投稿')).toBeTruthy();
            });

            await clickMenuAction('日付へ移動');
            await fireEvent.input(screen.getByLabelText('日付'), {
                target: { value: dateInput },
            });
            await fireEvent.click(getJumpDateSubmitButton());

            await waitFor(() => {
                expect(screen.getByText(anchorContent)).toBeTruthy();
                expect(screen.getByText(olderContent)).toBeTruthy();
            });

            writePostHistoryDialogScrollState({
                pubkeyHex: PUBKEY_HEX,
                mode: 'normal',
                anchor: {
                    eventId: anchorEventId,
                    offsetTop: 64,
                },
                savedAt: anchorCreatedAt,
            });
            firstView.unmount();
            repositoryMock.getLatestVisibleChunk.mockClear();

            const secondView = render(PostHistoryDialog, {
                props: {
                    show: true,
                    onClose: vi.fn(),
                    pubkeyHex: PUBKEY_HEX,
                },
            });

            await waitFor(() => {
                expect(screen.getByText(anchorContent)).toBeTruthy();
                expect(screen.getByText(olderContent)).toBeTruthy();
                expect(screen.getByRole('button', { name: '新しい投稿を表示' })).toBeTruthy();
            });
            expect(screen.queryByText('2026/5/16 の最新寄り投稿')).toBeNull();
            expect(repositoryMock.getLatestVisibleChunk).not.toHaveBeenCalled();

            secondView.unmount();
        },
    );

    it('保存アンカーが snapshot にない場合は DB からアンカー周辺 window を読み直す', async () => {
        const anchor = createRecord({
            eventId: 'db-anchor-post',
            content: 'DBから復元したアンカー投稿',
            createdAt: 1_704_153_600,
            postedAt: Date.UTC(2024, 0, 1, 0, 0, 0),
        });
        const older = createRecord({
            eventId: 'db-anchor-older-post',
            content: 'DBから復元した周辺投稿',
            createdAt: 1_704_153_540,
            postedAt: Date.UTC(2023, 11, 31, 23, 59, 0),
        });

        repositoryMock.countForPubkey.mockResolvedValue(200);
        repositoryMock.getVisibleChunkAroundEventId.mockResolvedValueOnce([anchor, older]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([createRecord({
            eventId: 'db-anchor-newer-post',
            content: 'DB上の新しい投稿',
            createdAt: 1_704_240_000,
            postedAt: Date.UTC(2024, 0, 2, 0, 0, 0),
        })]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);

        writePostHistoryDialogScrollState({
            pubkeyHex: PUBKEY_HEX,
            mode: 'normal',
            anchor: {
                eventId: 'db-anchor-post',
                offsetTop: 40,
            },
            savedAt: 1111,
        });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('DBから復元したアンカー投稿')).toBeTruthy();
            expect(screen.getByText('DBから復元した周辺投稿')).toBeTruthy();
            expect(screen.getByRole('button', { name: '新しい投稿を表示' })).toBeTruthy();
        });
        expect(repositoryMock.getLatestVisibleChunk).not.toHaveBeenCalled();
        expect(repositoryMock.getVisibleChunkAroundEventId).toHaveBeenCalledWith({
            pubkeyHex: PUBKEY_HEX,
            visibleUntil: null,
            eventId: 'db-anchor-post',
            limit: 150,
            keepAbove: 50,
        });

        view.unmount();
    });

    it('保存アンカーが DB から復元不能な場合だけ最新表示へ fallback する', async () => {
        const latest = createRecord({
            eventId: 'missing-anchor-latest-post',
            content: '復元不能時だけ表示する最新投稿',
            createdAt: 1_704_326_400,
            postedAt: Date.UTC(2024, 0, 3, 0, 0, 0),
        });

        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getVisibleChunkAroundEventId.mockResolvedValueOnce([]);
        repositoryMock.getLatestVisibleChunk.mockResolvedValueOnce([latest]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);

        writePostHistoryDialogScrollState({
            pubkeyHex: PUBKEY_HEX,
            mode: 'normal',
            anchor: {
                eventId: 'deleted-anchor-post',
                offsetTop: 80,
            },
            savedAt: 2222,
        });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('復元不能時だけ表示する最新投稿')).toBeTruthy();
        });
        expect(repositoryMock.getLatestVisibleChunk).toHaveBeenCalledTimes(1);

        view.unmount();
    });
});
