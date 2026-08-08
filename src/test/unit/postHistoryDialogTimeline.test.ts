import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import {
    PUBKEY_HEX,
    PostHistoryDialog,
    clickMenuAction,
    cleanupPostHistoryDialogHarness,
    createRelayFetchResult,
    createDeferred,
    createRecord,
    getHistoryContainer,
    jumpCacheAnchorRepositoryMock,
    localSearchServiceMock,
    openPostHistoryMenu,
    openSearchBar,
    postMediaCacheServiceMock,
    replyRepairServiceMock,
    repositoryMock,
    resetPostHistoryDialogHarness,
    relayFetchServiceMock,
    visibleRangeRepositoryMock,
    waitForSearchDebounce,
} from './postHistoryDialogTestHarness';
import {
    readPostHistoryDialogScrollState,
    writePostHistoryDialogScrollState,
} from '../../lib/postHistoryDialogScrollState';
import { readPersistedPostHistoryViewState } from '../../lib/postHistoryDialogViewState';
import { readPersistedPostHistoryListingSnapshotForPubkey } from '../../lib/hooks/usePostHistoryListing.svelte';
import { markPostHistoryShouldReturnToLatestAfterLocalPost } from '../../lib/postHistoryLatestRequest';
import { bumpPostHistorySearchRevision } from '../../lib/postHistoryLocalSearchRevision';

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

async function setJumpDateValue(date: string): Promise<void> {
    const [year, month, day] = date.split('-');
    const yearSegment = document.querySelector('.post-history-date-picker-segment[data-segment="year"]');
    const monthSegment = document.querySelector('.post-history-date-picker-segment[data-segment="month"]');
    const daySegment = document.querySelector('.post-history-date-picker-segment[data-segment="day"]');

    if (!(yearSegment instanceof HTMLElement)
        || !(monthSegment instanceof HTMLElement)
        || !(daySegment instanceof HTMLElement)) {
        throw new Error('日付ピッカーの入力セグメントが見つかりません');
    }

    await fireEvent.click(yearSegment);
    for (const digit of year) {
        await fireEvent.keyDown(yearSegment, { key: digit });
    }

    await fireEvent.click(monthSegment);
    for (const digit of String(Number(month))) {
        await fireEvent.keyDown(monthSegment, { key: digit });
    }

    await fireEvent.click(daySegment);
    for (const digit of String(Number(day))) {
        await fireEvent.keyDown(daySegment, { key: digit });
    }
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

    it('連続範囲の末尾で保存済みの古い投稿を明示的に表示し、relay を呼ばない', async () => {
        const newest = createRecord({
            eventId: 'boundary-newest',
            content: '連続範囲の投稿',
            createdAt: 1_700,
            postedAt: 1_700_000,
        });
        const savedOlder = createRecord({
            eventId: 'boundary-saved-older',
            content: 'インポートした古い投稿',
            createdAt: 900,
            postedAt: 900_000,
        });

        visibleRangeRepositoryMock.get.mockResolvedValue({
            pubkeyHex: PUBKEY_HEX,
            kindsKey: '1,42',
            visibleUntil: 1_000,
            updatedAt: 1,
        });
        repositoryMock.countForPubkey.mockResolvedValue(2);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([newest]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        repositoryMock.hasPostsBeforeCreatedAt.mockResolvedValue(true);
        repositoryMock.getSparseChunk.mockImplementation(async ({ direction, cursor }: Record<string, any>) => {
            if (direction === 'latest') return [savedOlder];
            if (direction === 'older') return [];
            return cursor?.eventId === savedOlder.eventId ? [] : [];
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
            expect(screen.getByText('この先には未取得の期間がある可能性があります。保存済みの古い投稿を表示できます。')).toBeTruthy();
            expect(screen.getByRole('button', { name: 'リレーから続きを取得' })).toBeTruthy();
            expect(screen.getByRole('button', { name: '保存済みの古い投稿を表示' })).toBeTruthy();
            expect(document.querySelector('.post-history-summary-count')?.textContent).toBe('2件');
        });

        await fireEvent.click(screen.getByRole('button', { name: '保存済みの古い投稿を表示' }));

        await waitFor(() => {
            expect(screen.getByText('インポートした古い投稿')).toBeTruthy();
            expect(screen.getByText('保存済みの古い投稿を表示中です。')).toBeTruthy();
            expect(screen.queryByText('連続範囲の投稿')).toBeNull();
        });
        expect(visibleRangeRepositoryMock.save).not.toHaveBeenCalled();

        view.unmount();
    });

    it('最終通常ページのremainingだけをqueryし、到達済み後のavailability older queryを省略する', async () => {
        const newest = createRecord({
            eventId: 'bounded-newest',
            content: 'bounded newest',
            createdAt: 2_000,
            postedAt: 2_000_000,
        });
        const older = createRecord({
            eventId: 'bounded-older',
            content: 'bounded older',
            createdAt: 1_000,
            postedAt: 1_000_000,
        });

        visibleRangeRepositoryMock.get.mockResolvedValue({
            pubkeyHex: PUBKEY_HEX,
            kindsKey: '1,42',
            visibleUntil: 1_500,
            updatedAt: 1,
        });
        repositoryMock.countForPubkey.mockResolvedValue(2);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([newest]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk
            .mockResolvedValueOnce([older])
            .mockResolvedValueOnce([older]);

        const view = render(PostHistoryDialog, {
            props: { show: true, onClose: vi.fn(), pubkeyHex: PUBKEY_HEX },
        });

        await waitFor(() => {
            expect(screen.getByText('bounded newest')).toBeTruthy();
            expect(screen.getByRole('button', { name: 'さらに古い投稿を表示' })).toBeTruthy();
        });
        await fireEvent.click(screen.getByRole('button', { name: 'さらに古い投稿を表示' }));

        await waitFor(() => expect(screen.getByText('bounded older')).toBeTruthy());
        expect(repositoryMock.getOlderVisibleChunk).toHaveBeenCalledTimes(2);
        expect(repositoryMock.getOlderVisibleChunk.mock.calls[1]?.[0]).toEqual(
            expect.objectContaining({ limit: 1 }),
        );

        view.unmount();
    });

    it('remainingが0と確定した場合はolder availabilityを再走査しない', async () => {
        const newest = createRecord({
            eventId: 'zero-remaining-newest',
            content: 'zero remaining newest',
            createdAt: 2_000,
            postedAt: 2_000_000,
        });
        const staleAvailabilityPost = createRecord({
            eventId: 'zero-remaining-stale',
            content: 'stale availability result',
            createdAt: 1_000,
            postedAt: 1_000_000,
        });

        visibleRangeRepositoryMock.get.mockResolvedValue({
            pubkeyHex: PUBKEY_HEX,
            kindsKey: '1,42',
            visibleUntil: 1_500,
            updatedAt: 1,
        });
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([newest]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([staleAvailabilityPost]);

        const view = render(PostHistoryDialog, {
            props: { show: true, onClose: vi.fn(), pubkeyHex: PUBKEY_HEX },
        });

        await waitFor(() => {
            expect(screen.getByText('zero remaining newest')).toBeTruthy();
            expect(screen.getByRole('button', { name: 'さらに古い投稿を表示' })).toBeTruthy();
        });
        await fireEvent.click(screen.getByRole('button', { name: 'さらに古い投稿を表示' }));
        await waitFor(() => expect(screen.queryByText('stale availability result')).toBeNull());

        // The original availability probe is the only older scan; the
        // remaining count lets the click skip both the older page and probe.
        expect(repositoryMock.getOlderVisibleChunk).toHaveBeenCalledTimes(1);
        view.unmount();
    });

    it('revisionまたはvisible件数が変わった進捗は再baseし、older投稿を誤って消費しない', async () => {
        const newest = createRecord({
            eventId: 'stale-progress-newest',
            content: 'stale progress newest',
            createdAt: 2_000,
            postedAt: 2_000_000,
        });
        const older = createRecord({
            eventId: 'stale-progress-older',
            content: 'stale progress older',
            createdAt: 1_000,
            postedAt: 1_000_000,
        });

        visibleRangeRepositoryMock.get.mockResolvedValue({
            pubkeyHex: PUBKEY_HEX,
            kindsKey: '1,42',
            visibleUntil: 1_500,
            updatedAt: 1,
        });
        repositoryMock.countForPubkey.mockResolvedValue(2);
        repositoryMock.countVisibleForPubkey.mockResolvedValue(3);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([newest]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([older]);

        const view = render(PostHistoryDialog, {
            props: { show: true, onClose: vi.fn(), pubkeyHex: PUBKEY_HEX },
        });
        await waitFor(() => {
            expect(screen.getByText('stale progress newest')).toBeTruthy();
            expect(screen.getByRole('button', { name: 'さらに古い投稿を表示' })).toBeTruthy();
        });

        bumpPostHistorySearchRevision(PUBKEY_HEX);
        await fireEvent.click(screen.getByRole('button', { name: 'さらに古い投稿を表示' }));

        await waitFor(() => {
            expect(repositoryMock.getLatestVisibleChunk).toHaveBeenCalledTimes(2);
            expect(screen.getByText('stale progress newest')).toBeTruthy();
        });
        expect(repositoryMock.getOlderVisibleChunk).toHaveBeenCalledTimes(2);
        view.unmount();
    });

    it('ページング途中にvisibleUntilが古い方向へ更新された場合は再baseして見落とさない', async () => {
        const newest = createRecord({
            eventId: 'frontier-rebase-newest',
            content: 'frontier rebase newest',
            createdAt: 2_000,
            postedAt: 2_000_000,
        });
        const older = createRecord({
            eventId: 'frontier-rebase-older',
            content: 'frontier rebase older',
            createdAt: 1_000,
            postedAt: 1_000_000,
        });
        let visibleUntil = 1_500;

        visibleRangeRepositoryMock.get.mockImplementation(async () => ({
            pubkeyHex: PUBKEY_HEX,
            kindsKey: '1,42',
            visibleUntil,
            updatedAt: 1,
        }));
        repositoryMock.countForPubkey.mockResolvedValue(2);
        repositoryMock.countVisibleForPubkey.mockResolvedValue(2);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([newest]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([older]);

        const view = render(PostHistoryDialog, {
            props: { show: true, onClose: vi.fn(), pubkeyHex: PUBKEY_HEX },
        });
        await waitFor(() => {
            expect(screen.getByText('frontier rebase newest')).toBeTruthy();
            expect(screen.getByRole('button', { name: 'さらに古い投稿を表示' })).toBeTruthy();
        });

        visibleUntil = 1_400;
        await fireEvent.click(screen.getByRole('button', { name: 'さらに古い投稿を表示' }));

        await waitFor(() => {
            expect(repositoryMock.getLatestVisibleChunk).toHaveBeenCalledTimes(2);
            expect(screen.queryByText('frontier rebase older')).toBeNull();
        });
        expect(repositoryMock.getOlderVisibleChunk).toHaveBeenCalledTimes(2);
        view.unmount();
    });

    it('数値の visibleUntil で日付ジャンプした後は jump 用 sparse 経路で前後移動する', async () => {
        const newest = createRecord({
            eventId: 'jump-route-newest',
            content: 'jump route 最新',
            createdAt: 1_700_000_000,
            postedAt: 1_700_000_000_000,
        });
        const jumpTarget = createRecord({
            eventId: 'jump-route-target',
            content: 'jump route 対象',
            createdAt: 1_600_000_000,
            postedAt: 1_600_000_000_000,
        });
        const older = createRecord({
            eventId: 'jump-route-older',
            content: 'jump route 古い投稿',
            createdAt: 1_599_900_000,
            postedAt: 1_599_900_000_000,
        });

        visibleRangeRepositoryMock.get.mockResolvedValue({
            pubkeyHex: PUBKEY_HEX,
            kindsKey: '1,42',
            visibleUntil: 1_650_000_000,
            updatedAt: 1,
        });
        repositoryMock.countForPubkey.mockResolvedValue(3);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([newest]);
        repositoryMock.getVisibleChunkFromCreatedAt
            .mockResolvedValueOnce([newest])
            .mockResolvedValueOnce([jumpTarget])
            .mockResolvedValueOnce([older]);
        repositoryMock.getNewerVisibleChunk.mockImplementation(async ({ cursor }: { cursor: { eventId: string } }) =>
            cursor.eventId === newest.eventId ? [] : [newest],
        );
        repositoryMock.getOlderVisibleChunk.mockImplementation(async ({ cursor }: { cursor: { eventId: string } }) =>
            cursor.eventId === jumpTarget.eventId ? [older] : [],
        );
        jumpCacheAnchorRepositoryMock.hasNearbyAnchorForPubkey.mockResolvedValue(true);

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
            },
        });

        await waitFor(() => expect(screen.getByText('jump route 最新')).toBeTruthy());
        await clickMenuAction('日付へ移動');
        await setJumpDateValue('2020-09-13');
        await fireEvent.click(getJumpDateSubmitButton());

        await waitFor(() => {
            expect(screen.getByText('jump route 対象')).toBeTruthy();
            expect(screen.getByRole('button', { name: 'さらに古い投稿を表示' })).toBeTruthy();
        });
        await fireEvent.click(screen.getByRole('button', { name: 'さらに古い投稿を表示' }));

        await waitFor(() => {
            expect(screen.getByText('jump route 古い投稿')).toBeTruthy();
            expect(repositoryMock.getVisibleChunkFromCreatedAt).toHaveBeenLastCalledWith(
                expect.objectContaining({
                    pubkeyHex: PUBKEY_HEX,
                    createdAt: jumpTarget.createdAt - 1,
                    query: { contiguous: false },
                }),
            );
            expect(screen.getByRole('button', { name: '新しい投稿を表示' })).toBeTruthy();
        });
        await fireEvent.click(screen.getByRole('button', { name: '新しい投稿を表示' }));

        await waitFor(() => expect(screen.getByText('jump route 最新')).toBeTruthy());
        expect(repositoryMock.getSparseChunk).not.toHaveBeenCalled();

        await fireEvent.click(screen.getByRole('button', { name: '最新へ戻る' }));
        await waitFor(() => expect(screen.getByText('jump route 最新')).toBeTruthy());

        view.unmount();
    });

    it('jump sparse では jump cache anchor があってもローカル最古へ移動し、リレー修復しない', async () => {
        const newest = createRecord({
            eventId: 'jump-oldest-newest',
            content: 'jump oldest 最新',
            createdAt: 1_700_000_000,
            postedAt: 1_700_000_000_000,
        });
        const jumpTarget = createRecord({
            eventId: 'jump-oldest-target',
            content: 'jump oldest 対象',
            createdAt: 1_600_000_000,
            postedAt: 1_600_000_000_000,
        });
        const older = createRecord({
            eventId: 'jump-oldest-older',
            content: 'jump oldest 古い投稿',
            createdAt: 1_599_900_000,
            postedAt: 1_599_900_000_000,
        });
        const oldest = createRecord({
            eventId: 'jump-oldest-oldest',
            content: 'jump oldest 最古投稿',
            createdAt: 1_500_000_000,
            postedAt: 1_500_000_000_000,
        });

        visibleRangeRepositoryMock.get.mockResolvedValue({
            pubkeyHex: PUBKEY_HEX,
            kindsKey: '1,42',
            visibleUntil: 1_650_000_000,
            updatedAt: 1,
        });
        repositoryMock.countForPubkey.mockResolvedValue(4);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([newest]);
        repositoryMock.getVisibleChunkFromCreatedAt.mockImplementation(async ({
            createdAt,
            query,
        }: Record<string, any>) => {
            if (createdAt === 0 && query?.contiguous === false) {
                return [oldest];
            }
            return query?.contiguous === false ? [jumpTarget] : [newest];
        });
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockImplementation(async ({
            cursor,
            visibleUntil,
        }: Record<string, any>) => (
            cursor?.eventId === jumpTarget.eventId && visibleUntil === null
                ? [older]
                : []
        ));
        jumpCacheAnchorRepositoryMock.getForPubkey.mockResolvedValue([{
            centerCreatedAt: 1_600_000_000,
            radiusSec: 86_400,
            fetchedAt: Date.now(),
        }]);
        jumpCacheAnchorRepositoryMock.hasNearbyAnchorForPubkey.mockResolvedValue(true);

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => expect(screen.getByText('jump oldest 最新')).toBeTruthy());
        await waitFor(() => expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalled());
        relayFetchServiceMock.fetchLatest.mockClear();
        await clickMenuAction('日付へ移動');
        await setJumpDateValue('2020-09-13');
        await fireEvent.click(getJumpDateSubmitButton());
        await waitFor(() => expect(screen.getByText('jump oldest 対象')).toBeTruthy());

        const historyContainer = getHistoryContainer();
        Object.defineProperty(historyContainer, 'clientHeight', {
            configurable: true,
            value: 320,
        });
        Object.defineProperty(historyContainer, 'scrollHeight', {
            configurable: true,
            value: 720,
        });
        historyContainer.scrollTop = 0;
        await fireEvent.scroll(historyContainer);

        await openPostHistoryMenu();
        await fireEvent.click(await screen.findByRole('menuitem', { name: '最古へ移動' }));

        await waitFor(() => {
            expect(screen.getByText('jump oldest 最古投稿')).toBeTruthy();
            expect(historyContainer.scrollTop).toBe(720);
        });
        expect(repositoryMock.getOlderVisibleChunk).toHaveBeenCalledWith(
            expect.objectContaining({
                pubkeyHex: PUBKEY_HEX,
                visibleUntil: null,
                cursor: expect.objectContaining({ eventId: jumpTarget.eventId }),
                limit: 1,
            }),
        );
        expect(repositoryMock.getVisibleChunkFromCreatedAt).toHaveBeenCalledWith(
            expect.objectContaining({
                pubkeyHex: PUBKEY_HEX,
                createdAt: 0,
                query: { contiguous: false },
            }),
        );
        expect(repositoryMock.getOlderVisibleChunk).toHaveBeenLastCalledWith(
            expect.objectContaining({
                pubkeyHex: PUBKEY_HEX,
                visibleUntil: null,
                cursor: expect.objectContaining({ eventId: oldest.eventId }),
                limit: 1,
            }),
        );
        await openPostHistoryMenu();
        expect((await screen.findByRole('menuitem', { name: '最古へ移動' }))
            .getAttribute('aria-disabled')).toBe('true');
        expect(relayFetchServiceMock.fetchLatest).not.toHaveBeenCalled();

        view.unmount();
    });

    it('saved sparse でも最古へ移動すると absolute local oldest へ移動し source を維持する', async () => {
        const newest = createRecord({
            eventId: 'saved-oldest-newest',
            content: 'saved oldest 最新',
            createdAt: 1_700,
            postedAt: 1_700_000,
        });
        const savedFirst = createRecord({
            eventId: 'saved-oldest-first',
            content: 'saved oldest first',
            createdAt: 900,
            postedAt: 900_000,
        });
        const savedOlder = createRecord({
            eventId: 'saved-oldest-older',
            content: 'saved oldest older',
            createdAt: 800,
            postedAt: 800_000,
        });
        const oldest = createRecord({
            eventId: 'saved-oldest-oldest',
            content: 'saved oldest 最古投稿',
            createdAt: 700,
            postedAt: 700_000,
        });

        visibleRangeRepositoryMock.get.mockResolvedValue({
            pubkeyHex: PUBKEY_HEX,
            kindsKey: '1,42',
            visibleUntil: 1_000,
            updatedAt: 1,
        });
        repositoryMock.countForPubkey.mockResolvedValue(4);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([newest]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        repositoryMock.hasPostsBeforeCreatedAt.mockResolvedValue(true);
        repositoryMock.getSparseChunk.mockImplementation(async ({
            direction,
            cursor,
        }: Record<string, any>) => {
            if (direction === 'latest') return [savedFirst];
            if (direction === 'older' && cursor?.eventId === savedFirst.eventId) {
                return [savedOlder];
            }
            return [];
        });
        repositoryMock.getVisibleChunkFromCreatedAt.mockResolvedValue([oldest]);

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('saved oldest 最新')).toBeTruthy();
            expect(screen.getByRole('button', { name: '保存済みの古い投稿を表示' })).toBeTruthy();
        });
        await waitFor(() => expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalled());
        relayFetchServiceMock.fetchLatest.mockClear();
        await fireEvent.click(screen.getByRole('button', { name: '保存済みの古い投稿を表示' }));
        await waitFor(() => expect(screen.getByText('saved oldest first')).toBeTruthy());

        const historyContainer = getHistoryContainer();
        Object.defineProperty(historyContainer, 'clientHeight', {
            configurable: true,
            value: 320,
        });
        Object.defineProperty(historyContainer, 'scrollHeight', {
            configurable: true,
            value: 720,
        });
        historyContainer.scrollTop = 0;
        await fireEvent.scroll(historyContainer);

        await openPostHistoryMenu();
        await fireEvent.click(await screen.findByRole('menuitem', { name: '最古へ移動' }));

        await waitFor(() => {
            expect(screen.getByText('saved oldest 最古投稿')).toBeTruthy();
            expect(historyContainer.scrollTop).toBe(720);
        });
        expect(repositoryMock.getVisibleChunkFromCreatedAt).toHaveBeenCalledWith(
            expect.objectContaining({
                pubkeyHex: PUBKEY_HEX,
                createdAt: 0,
                visibleUntil: 1_000,
                query: { contiguous: false },
            }),
        );
        expect(repositoryMock.getSparseChunk).toHaveBeenLastCalledWith(
            expect.objectContaining({
                pubkeyHex: PUBKEY_HEX,
                cursor: expect.objectContaining({ eventId: oldest.eventId }),
                direction: 'older',
                limit: 1,
            }),
        );
        await openPostHistoryMenu();
        expect((await screen.findByRole('menuitem', { name: '最古へ移動' }))
            .getAttribute('aria-disabled')).toBe('true');
        expect(relayFetchServiceMock.fetchLatest).not.toHaveBeenCalled();

        view.unmount();
    });

    it('visibleUntil が null の日付ジャンプ後も jump 用 sparse 経路で古い投稿を読む', async () => {
        const newest = createRecord({
            eventId: 'jump-null-newest',
            content: 'null frontier 最新',
            createdAt: 1_700_000_000,
            postedAt: 1_700_000_000_000,
        });
        const jumpTarget = createRecord({
            eventId: 'jump-null-target',
            content: 'null frontier 対象',
            createdAt: 1_600_000_000,
            postedAt: 1_600_000_000_000,
        });
        const older = createRecord({
            eventId: 'jump-null-older',
            content: 'null frontier 古い投稿',
            createdAt: 1_599_900_000,
            postedAt: 1_599_900_000_000,
        });

        repositoryMock.countForPubkey.mockResolvedValue(3);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([newest]);
        repositoryMock.getVisibleChunkFromCreatedAt
            .mockResolvedValueOnce([newest])
            .mockResolvedValueOnce([jumpTarget])
            .mockResolvedValueOnce([older]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([newest]);
        repositoryMock.getOlderVisibleChunk.mockImplementation(async ({ cursor }: { cursor: { eventId: string } }) =>
            cursor.eventId === jumpTarget.eventId ? [older] : [],
        );
        jumpCacheAnchorRepositoryMock.hasNearbyAnchorForPubkey.mockResolvedValue(true);

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
            },
        });

        await waitFor(() => expect(screen.getByText('null frontier 最新')).toBeTruthy());
        await clickMenuAction('日付へ移動');
        await setJumpDateValue('2020-09-13');
        await fireEvent.click(getJumpDateSubmitButton());
        await waitFor(() => expect(screen.getByText('null frontier 対象')).toBeTruthy());
        await fireEvent.click(screen.getByRole('button', { name: 'さらに古い投稿を表示' }));

        await waitFor(() => expect(screen.getByText('null frontier 古い投稿')).toBeTruthy());
        expect(repositoryMock.getVisibleChunkFromCreatedAt).toHaveBeenLastCalledWith(
            expect.objectContaining({
                pubkeyHex: PUBKEY_HEX,
                createdAt: jumpTarget.createdAt - 1,
                visibleUntil: null,
                query: { contiguous: false },
            }),
        );
        expect(repositoryMock.getSparseChunk).not.toHaveBeenCalled();

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
        await setJumpDateValue('2024-01-01');
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

    it('古すぎる日付ジャンプで contiguous miss したら sparse relay 取得して anchor を保存する', async () => {
        const newest = createRecord({
            eventId: 'jump-sparse-newest',
            content: '最新投稿',
            createdAt: 1_704_326_400,
            postedAt: Date.UTC(2024, 0, 3, 0, 0, 0),
        });
        const oldestVisible = createRecord({
            eventId: 'jump-sparse-oldest-visible',
            content: '今見えている最古投稿',
            createdAt: 1_704_067_200,
            postedAt: Date.UTC(2023, 11, 31, 0, 0, 0),
        });
        const fetchedAroundTarget = createRecord({
            eventId: 'jump-sparse-fetched-target',
            content: '日付周辺で取得した投稿',
            createdAt: 1_695_000_000,
            postedAt: Date.UTC(2023, 8, 30, 0, 0, 0),
        });

        repositoryMock.countForPubkey.mockResolvedValue(2);
        repositoryMock.getLatestVisibleChunk.mockResolvedValueOnce([newest, oldestVisible]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        repositoryMock.getVisibleChunkFromCreatedAt
            .mockResolvedValueOnce([newest, oldestVisible])
            .mockResolvedValueOnce([fetchedAroundTarget]);
        repositoryMock.upsertFetchedEvents.mockResolvedValue({
            insertedCount: 1,
            updatedCount: 0,
            unchangedCount: 0,
        });

        jumpCacheAnchorRepositoryMock.hasNearbyAnchorForPubkey.mockResolvedValue(false);
        jumpCacheAnchorRepositoryMock.addForPubkey.mockResolvedValue([
            {
                centerCreatedAt: 1_695_000_000,
                radiusSec: 3 * 24 * 60 * 60,
                fetchedAt: 2000,
            },
        ]);

        relayFetchServiceMock.fetchLatest.mockImplementation(
            (_rxNostr: any, request: { reason?: string }) => {
                if (request.reason !== 'repair-visible-range') {
                    return {
                        promise: Promise.resolve(createRelayFetchResult({
                            status: 'cancelled',
                        })),
                        cancel: vi.fn(),
                    };
                }

                return {
                    promise: Promise.resolve(createRelayFetchResult({
                        fetchedAt: 2000,
                        relayUrls: ['wss://relay.example.com/'],
                        events: [
                            {
                                event: {
                                    id: 'jump-sparse-fetched-event'.repeat(4),
                                    pubkey: PUBKEY_HEX,
                                    kind: 1,
                                    content: '日付周辺で取得した投稿',
                                    tags: [],
                                    created_at: 1_695_000_000,
                                    sig: 'c'.repeat(128),
                                },
                                relayUrls: ['wss://relay.example.com/'],
                            },
                        ],
                    })),
                    cancel: vi.fn(),
                };
            },
        );

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

        await clickMenuAction('日付へ移動');
        await setJumpDateValue('2023-10-01');
        await fireEvent.click(getJumpDateSubmitButton());

        await waitFor(() => {
            expect(screen.getByText('日付周辺で取得した投稿')).toBeTruthy();
            expect(jumpCacheAnchorRepositoryMock.addForPubkey).toHaveBeenCalledWith(
                expect.objectContaining({
                    pubkeyHex: PUBKEY_HEX,
                    centerCreatedAt: expect.any(Number),
                }),
            );
            expect(repositoryMock.getVisibleChunkFromCreatedAt).toHaveBeenLastCalledWith(
                expect.objectContaining({
                    pubkeyHex: PUBKEY_HEX,
                    query: {
                        contiguous: false,
                    },
                }),
            );
            expect(relayFetchServiceMock.fetchLatest).toHaveBeenCalledWith(
                {} as any,
                expect.objectContaining({
                    reason: 'repair-visible-range',
                    pubkeyHex: PUBKEY_HEX,
                }),
            );
            expect(replyRepairServiceMock.repairVisibleRangeRelations).toHaveBeenCalledWith(
                expect.any(Object),
                expect.objectContaining({
                    ownerPubkeyHex: PUBKEY_HEX,
                    visiblePosts: [fetchedAroundTarget],
                }),
            );
        });

        view.unmount();
    });

    it('日付ジャンプで表示した sparse 投稿数が右上の件数表示に反映される', async () => {
        const newest = createRecord({
            eventId: 'jump-summary-newest',
            content: '最新投稿',
            createdAt: 1_779_874_028,
            postedAt: Date.UTC(2026, 4, 14, 0, 47, 8),
        });
        const oldestVisible = createRecord({
            eventId: 'jump-summary-oldest-visible',
            content: '今見えている最古投稿',
            createdAt: 1_779_757_267,
            postedAt: Date.UTC(2026, 4, 12, 16, 21, 7),
        });
        const sparseTarget = createRecord({
            eventId: 'jump-summary-sparse-target',
            content: 'ジャンプ先投稿',
            createdAt: 1_735_397_555,
            postedAt: Date.UTC(2024, 11, 28, 0, 12, 35),
        });

        repositoryMock.countForPubkey
            .mockResolvedValue(32)
            .mockResolvedValueOnce(15)
            .mockResolvedValueOnce(32);
        repositoryMock.getLatestVisibleChunk.mockResolvedValueOnce([newest, oldestVisible]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        repositoryMock.getVisibleChunkFromCreatedAt
            .mockResolvedValueOnce([newest, oldestVisible])
            .mockResolvedValueOnce([sparseTarget]);

        jumpCacheAnchorRepositoryMock.hasNearbyAnchorForPubkey.mockResolvedValue(true);

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
            expect(document.querySelector('.post-history-summary-count')?.textContent).toBe('15件');
        });

        await clickMenuAction('日付へ移動');
        await setJumpDateValue('2024-12-28');
        await fireEvent.click(getJumpDateSubmitButton());

        await waitFor(() => {
            expect(screen.getByText('ジャンプ先投稿')).toBeTruthy();
            expect(document.querySelector('.post-history-summary-count')?.textContent).toBe('32件');
        });

        view.unmount();
    });

    it('日付ジャンプの relay 取得が target miss のまま終了した場合は最古へフォールバックしない', async () => {
        const newest = createRecord({
            eventId: 'jump-miss-no-fallback-newest',
            content: '最新投稿',
            createdAt: 1_704_326_400,
            postedAt: Date.UTC(2024, 0, 3, 0, 0, 0),
        });
        const oldestVisible = createRecord({
            eventId: 'jump-miss-no-fallback-oldest-visible',
            content: '今見えている最古投稿',
            createdAt: 1_704_067_200,
            postedAt: Date.UTC(2023, 11, 31, 0, 0, 0),
        });

        repositoryMock.countForPubkey.mockResolvedValue(2);
        repositoryMock.getLatestVisibleChunk.mockResolvedValueOnce([newest, oldestVisible]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        repositoryMock.getVisibleChunkFromCreatedAt
            .mockResolvedValueOnce([newest, oldestVisible])
            .mockResolvedValueOnce([newest, oldestVisible]);
        repositoryMock.upsertFetchedEvents.mockResolvedValue({
            insertedCount: 0,
            updatedCount: 0,
            unchangedCount: 0,
        });

        jumpCacheAnchorRepositoryMock.hasNearbyAnchorForPubkey.mockResolvedValue(false);

        relayFetchServiceMock.fetchLatest.mockImplementation(
            (_rxNostr: any, request: { reason?: string }) => {
                if (request.reason !== 'repair-visible-range') {
                    return {
                        promise: Promise.resolve(createRelayFetchResult({
                            status: 'cancelled',
                        })),
                        cancel: vi.fn(),
                    };
                }

                return {
                    promise: Promise.resolve(createRelayFetchResult({
                        status: 'timeout',
                        fetchedAt: 2000,
                        relayUrls: ['wss://relay.example.com/'],
                        events: [],
                    })),
                    cancel: vi.fn(),
                };
            },
        );

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
            expect(screen.getByText('今見えている最古投稿')).toBeTruthy();
        });

        await clickMenuAction('日付へ移動');
        await setJumpDateValue('2023-10-01');
        await fireEvent.click(getJumpDateSubmitButton());

        await waitFor(() => {
            expect(screen.getByText('最新投稿')).toBeTruthy();
            expect(screen.getByText('今見えている最古投稿')).toBeTruthy();
            expect(repositoryMock.getVisibleChunkFromCreatedAt).toHaveBeenLastCalledWith(
                expect.objectContaining({
                    pubkeyHex: PUBKEY_HEX,
                    query: {
                        contiguous: false,
                    },
                }),
            );
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

    it('saved sparse を閉じて reopen すると最新 contiguous chunk から開き直し、saved sparse window を復元しない', async () => {
        const newest = createRecord({
            eventId: 'saved-reopen-newest',
            content: 'saved reopen 最新',
            createdAt: 1_700,
            postedAt: 1_700_000,
        });
        const savedOlder = createRecord({
            eventId: 'saved-reopen-sparse',
            content: 'saved reopen sparse',
            createdAt: 900,
            postedAt: 900_000,
        });
        const onClose = vi.fn();

        visibleRangeRepositoryMock.get.mockResolvedValue({
            pubkeyHex: PUBKEY_HEX,
            kindsKey: '1,42',
            visibleUntil: 1_000,
            updatedAt: 1,
        });
        repositoryMock.countForPubkey.mockResolvedValue(2);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([newest]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        repositoryMock.getVisibleChunkAroundEventId.mockResolvedValue([]);
        repositoryMock.hasPostsBeforeCreatedAt.mockResolvedValue(true);
        repositoryMock.getSparseChunk.mockImplementation(async ({ direction }: Record<string, any>) => {
            if (direction === 'latest') {
                return [savedOlder];
            }

            return [];
        });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose,
                pubkeyHex: PUBKEY_HEX,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('saved reopen 最新')).toBeTruthy();
            expect(screen.getByRole('button', { name: '保存済みの古い投稿を表示' })).toBeTruthy();
        });

        await fireEvent.click(screen.getByRole('button', { name: '保存済みの古い投稿を表示' }));

        await waitFor(() => {
            expect(screen.getByText('saved reopen sparse')).toBeTruthy();
            expect(screen.getByText('保存済みの古い投稿を表示中です。')).toBeTruthy();
        });

        writePostHistoryDialogScrollState({
            pubkeyHex: PUBKEY_HEX,
            mode: 'normal',
            anchor: {
                eventId: savedOlder.eventId,
                offsetTop: 64,
            },
            savedAt: 1234,
        });

        repositoryMock.getLatestVisibleChunk.mockClear();
        repositoryMock.getSparseChunk.mockClear();
        repositoryMock.getVisibleChunkAroundEventId.mockClear();
        repositoryMock.countForPubkey.mockClear();
        repositoryMock.hasPostsBeforeCreatedAt.mockClear();

        await fireEvent.click(screen.getByRole('button', { name: '閉じる' }));
        await waitFor(() => {
            expect(onClose).toHaveBeenCalledTimes(1);
        });

        await view.rerender({
            show: false,
            onClose,
            pubkeyHex: PUBKEY_HEX,
        });
        await view.rerender({
            show: true,
            onClose,
            pubkeyHex: PUBKEY_HEX,
        });

        await waitFor(() => {
            expect(screen.getByText('saved reopen 最新')).toBeTruthy();
            expect(screen.queryByText('saved reopen sparse')).toBeNull();
            expect(screen.queryByText('保存済みの古い投稿を表示中です。')).toBeNull();
            expect(screen.getByText('この先には未取得の期間がある可能性があります。保存済みの古い投稿を表示できます。')).toBeTruthy();
        });

        expect(repositoryMock.getLatestVisibleChunk).toHaveBeenCalledTimes(1);
        expect(repositoryMock.getSparseChunk).not.toHaveBeenCalled();
        expect(repositoryMock.getVisibleChunkAroundEventId).not.toHaveBeenCalled();
        await waitFor(() => {
            expect(repositoryMock.countForPubkey).toHaveBeenCalledTimes(1);
        });
        expect(repositoryMock.hasPostsBeforeCreatedAt).toHaveBeenCalledWith(
            PUBKEY_HEX,
            1_000,
        );

        view.unmount();
    });

    it('jump sparse を閉じて reopen すると jump window を復元せず最新 contiguous chunk から開く', async () => {
        const newest = createRecord({
            eventId: 'jump-reopen-newest',
            content: 'jump reopen 最新',
            createdAt: 1_700_000_000,
            postedAt: 1_700_000_000_000,
        });
        const jumpTarget = createRecord({
            eventId: 'jump-reopen-target',
            content: 'jump reopen 対象',
            createdAt: 1_600_000_000,
            postedAt: 1_600_000_000_000,
        });
        const onClose = vi.fn();

        visibleRangeRepositoryMock.get.mockResolvedValue({
            pubkeyHex: PUBKEY_HEX,
            kindsKey: '1,42',
            visibleUntil: 1_650_000_000,
            updatedAt: 1,
        });
        repositoryMock.countForPubkey.mockResolvedValue(3);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([newest]);
        repositoryMock.getVisibleChunkFromCreatedAt
            .mockResolvedValueOnce([newest])
            .mockResolvedValueOnce([jumpTarget]);
        repositoryMock.getNewerVisibleChunk.mockImplementation(async ({ cursor }: { cursor: { eventId: string } }) =>
            cursor.eventId === jumpTarget.eventId ? [newest] : [],
        );
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        repositoryMock.getVisibleChunkAroundEventId.mockResolvedValue([]);
        jumpCacheAnchorRepositoryMock.hasNearbyAnchorForPubkey.mockResolvedValue(true);

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose,
                pubkeyHex: PUBKEY_HEX,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('jump reopen 最新')).toBeTruthy();
        });

        await clickMenuAction('日付へ移動');
        await setJumpDateValue('2020-09-13');
        await fireEvent.click(getJumpDateSubmitButton());

        await waitFor(() => {
            expect(screen.getByText('jump reopen 対象')).toBeTruthy();
            expect(screen.getByRole('button', { name: '最新へ戻る' })).toBeTruthy();
        });

        writePostHistoryDialogScrollState({
            pubkeyHex: PUBKEY_HEX,
            mode: 'normal',
            anchor: {
                eventId: jumpTarget.eventId,
                offsetTop: 72,
            },
            savedAt: 5678,
        });

        repositoryMock.getLatestVisibleChunk.mockClear();
        repositoryMock.getVisibleChunkFromCreatedAt.mockClear();
        repositoryMock.getVisibleChunkAroundEventId.mockClear();
        repositoryMock.countForPubkey.mockClear();

        await fireEvent.click(screen.getByRole('button', { name: '閉じる' }));
        await waitFor(() => {
            expect(onClose).toHaveBeenCalledTimes(1);
        });

        await view.rerender({
            show: false,
            onClose,
            pubkeyHex: PUBKEY_HEX,
        });
        await view.rerender({
            show: true,
            onClose,
            pubkeyHex: PUBKEY_HEX,
        });

        await waitFor(() => {
            expect(screen.getByText('jump reopen 最新')).toBeTruthy();
            expect(screen.queryByText('jump reopen 対象')).toBeNull();
            expect(screen.queryByRole('button', { name: '最新へ戻る' })).toBeNull();
        });

        expect(repositoryMock.getLatestVisibleChunk).toHaveBeenCalledTimes(1);
        expect(repositoryMock.getVisibleChunkFromCreatedAt).not.toHaveBeenCalled();
        expect(repositoryMock.getVisibleChunkAroundEventId).not.toHaveBeenCalled();
        await waitFor(() => {
            expect(repositoryMock.countForPubkey).toHaveBeenCalledTimes(1);
        });

        view.unmount();
    });

    it('saved sparse を基礎状態として検索中に閉じても次回は検索を復元せず最新 contiguous chunk から開く', async () => {
        const newest = createRecord({
            eventId: 'saved-search-close-newest',
            content: 'saved search close 最新',
            createdAt: 1_700,
            postedAt: 1_700_000,
        });
        const savedOlder = createRecord({
            eventId: 'saved-search-close-sparse',
            content: 'saved search close sparse',
            createdAt: 900,
            postedAt: 900_000,
        });
        const searchHit = createRecord({
            eventId: 'saved-search-close-hit',
            content: 'saved search close 検索結果',
            createdAt: 850,
            postedAt: 850_000,
        });
        const onClose = vi.fn();

        visibleRangeRepositoryMock.get.mockResolvedValue({
            pubkeyHex: PUBKEY_HEX,
            kindsKey: '1,42',
            visibleUntil: 1_000,
            updatedAt: 1,
        });
        repositoryMock.countForPubkey.mockResolvedValue(2);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([newest]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        repositoryMock.getVisibleChunkAroundEventId.mockResolvedValue([]);
        repositoryMock.hasPostsBeforeCreatedAt.mockResolvedValue(true);
        repositoryMock.getSparseChunk.mockImplementation(async ({ direction }: Record<string, any>) => {
            if (direction === 'latest') {
                return [savedOlder];
            }

            return [];
        });
        localSearchServiceMock.searchLocalPosts.mockResolvedValue({
            items: [searchHit],
            total: 1,
            hasNext: false,
        });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose,
                pubkeyHex: PUBKEY_HEX,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('saved search close 最新')).toBeTruthy();
            expect(screen.getByRole('button', { name: '保存済みの古い投稿を表示' })).toBeTruthy();
        });

        writePostHistoryDialogScrollState({
            pubkeyHex: PUBKEY_HEX,
            mode: 'normal',
            anchor: {
                eventId: newest.eventId,
                offsetTop: 40,
            },
            savedAt: 100,
        });

        await fireEvent.click(screen.getByRole('button', { name: '保存済みの古い投稿を表示' }));
        await waitFor(() => {
            expect(screen.getByText('saved search close sparse')).toBeTruthy();
        });

        const searchInput = await openSearchBar();
        await fireEvent.input(searchInput, { target: { value: 'alpha' } });
        await waitForSearchDebounce();

        await waitFor(() => {
            expect(screen.getByText('saved search close 検索結果')).toBeTruthy();
        });

        writePostHistoryDialogScrollState({
            pubkeyHex: PUBKEY_HEX,
            mode: 'search',
            searchQuery: 'alpha',
            anchor: {
                eventId: searchHit.eventId,
                offsetTop: 24,
            },
            savedAt: 101,
        });

        repositoryMock.getLatestVisibleChunk.mockClear();
        repositoryMock.getSparseChunk.mockClear();
        repositoryMock.getVisibleChunkAroundEventId.mockClear();
        repositoryMock.countForPubkey.mockClear();
        localSearchServiceMock.searchLocalPosts.mockClear();

        await fireEvent.click(screen.getByRole('button', { name: '閉じる' }));
        await waitFor(() => {
            expect(onClose).toHaveBeenCalledTimes(1);
        });

        expect(readPersistedPostHistoryViewState(PUBKEY_HEX)).toEqual({
            currentPage: 1,
            searchPage: 1,
            searchInput: '',
            searchQuery: '',
        });
        expect(readPersistedPostHistoryListingSnapshotForPubkey(PUBKEY_HEX)).toMatchObject({
            loadedPosts: [],
            searchPosts: [],
            searchTotalCount: 0,
            searchHasNext: false,
        });
        expect(readPostHistoryDialogScrollState({ pubkeyHex: PUBKEY_HEX, mode: 'normal' })).toBeNull();
        expect(readPostHistoryDialogScrollState({ pubkeyHex: PUBKEY_HEX, mode: 'search', searchQuery: 'alpha' })).toBeNull();

        await view.rerender({
            show: false,
            onClose,
            pubkeyHex: PUBKEY_HEX,
        });
        await view.rerender({
            show: true,
            onClose,
            pubkeyHex: PUBKEY_HEX,
        });

        await waitFor(() => {
            expect(screen.getByText('saved search close 最新')).toBeTruthy();
            expect(screen.queryByText('saved search close 検索結果')).toBeNull();
            expect(screen.queryByRole('searchbox', { name: '検索' })).toBeNull();
        });

        expect(repositoryMock.getLatestVisibleChunk).toHaveBeenCalledTimes(1);
        expect(repositoryMock.getSparseChunk).not.toHaveBeenCalled();
        expect(repositoryMock.getVisibleChunkAroundEventId).not.toHaveBeenCalled();
        await waitFor(() => {
            expect(repositoryMock.countForPubkey).toHaveBeenCalledTimes(1);
        });
        expect(localSearchServiceMock.searchLocalPosts).not.toHaveBeenCalled();

        view.unmount();
    });

    it('jump sparse を基礎状態として検索中に閉じても次回は検索を復元せず最新 contiguous chunk から開く', async () => {
        const newest = createRecord({
            eventId: 'jump-search-close-newest',
            content: 'jump search close 最新',
            createdAt: 1_700_000_000,
            postedAt: 1_700_000_000_000,
        });
        const jumpTarget = createRecord({
            eventId: 'jump-search-close-target',
            content: 'jump search close 対象',
            createdAt: 1_600_000_000,
            postedAt: 1_600_000_000_000,
        });
        const searchHit = createRecord({
            eventId: 'jump-search-close-hit',
            content: 'jump search close 検索結果',
            createdAt: 1_599_999_999,
            postedAt: 1_599_999_999_000,
        });
        const onClose = vi.fn();

        visibleRangeRepositoryMock.get.mockResolvedValue({
            pubkeyHex: PUBKEY_HEX,
            kindsKey: '1,42',
            visibleUntil: 1_650_000_000,
            updatedAt: 1,
        });
        repositoryMock.countForPubkey.mockResolvedValue(3);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([newest]);
        repositoryMock.getVisibleChunkFromCreatedAt
            .mockResolvedValueOnce([newest])
            .mockResolvedValueOnce([jumpTarget]);
        repositoryMock.getNewerVisibleChunk.mockImplementation(async ({ cursor }: { cursor: { eventId: string } }) =>
            cursor.eventId === jumpTarget.eventId ? [newest] : [],
        );
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        repositoryMock.getVisibleChunkAroundEventId.mockResolvedValue([]);
        jumpCacheAnchorRepositoryMock.hasNearbyAnchorForPubkey.mockResolvedValue(true);
        localSearchServiceMock.searchLocalPosts.mockResolvedValue({
            items: [searchHit],
            total: 1,
            hasNext: false,
        });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose,
                pubkeyHex: PUBKEY_HEX,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('jump search close 最新')).toBeTruthy();
        });

        writePostHistoryDialogScrollState({
            pubkeyHex: PUBKEY_HEX,
            mode: 'normal',
            anchor: {
                eventId: newest.eventId,
                offsetTop: 44,
            },
            savedAt: 200,
        });

        await clickMenuAction('日付へ移動');
        await setJumpDateValue('2020-09-13');
        await fireEvent.click(getJumpDateSubmitButton());

        await waitFor(() => {
            expect(screen.getByText('jump search close 対象')).toBeTruthy();
        });

        const searchInput = await openSearchBar();
        await fireEvent.input(searchInput, { target: { value: 'beta' } });
        await waitForSearchDebounce();

        await waitFor(() => {
            expect(screen.getByText('jump search close 検索結果')).toBeTruthy();
        });

        writePostHistoryDialogScrollState({
            pubkeyHex: PUBKEY_HEX,
            mode: 'search',
            searchQuery: 'beta',
            anchor: {
                eventId: searchHit.eventId,
                offsetTop: 28,
            },
            savedAt: 201,
        });

        repositoryMock.getLatestVisibleChunk.mockClear();
        repositoryMock.getSparseChunk.mockClear();
        repositoryMock.getVisibleChunkAroundEventId.mockClear();
        repositoryMock.getVisibleChunkFromCreatedAt.mockClear();
        repositoryMock.countForPubkey.mockClear();
        localSearchServiceMock.searchLocalPosts.mockClear();

        await fireEvent.click(screen.getByRole('button', { name: '閉じる' }));
        await waitFor(() => {
            expect(onClose).toHaveBeenCalledTimes(1);
        });

        expect(readPersistedPostHistoryViewState(PUBKEY_HEX)).toEqual({
            currentPage: 1,
            searchPage: 1,
            searchInput: '',
            searchQuery: '',
        });
        expect(readPostHistoryDialogScrollState({ pubkeyHex: PUBKEY_HEX, mode: 'normal' })).toBeNull();
        expect(readPostHistoryDialogScrollState({ pubkeyHex: PUBKEY_HEX, mode: 'search', searchQuery: 'beta' })).toBeNull();

        await view.rerender({
            show: false,
            onClose,
            pubkeyHex: PUBKEY_HEX,
        });
        await view.rerender({
            show: true,
            onClose,
            pubkeyHex: PUBKEY_HEX,
        });

        await waitFor(() => {
            expect(screen.getByText('jump search close 最新')).toBeTruthy();
            expect(screen.queryByText('jump search close 検索結果')).toBeNull();
            expect(screen.queryByText('jump search close 対象')).toBeNull();
        });

        expect(repositoryMock.getLatestVisibleChunk).toHaveBeenCalledTimes(1);
        expect(repositoryMock.getSparseChunk).not.toHaveBeenCalled();
        expect(repositoryMock.getVisibleChunkAroundEventId).not.toHaveBeenCalled();
        expect(repositoryMock.getVisibleChunkFromCreatedAt).not.toHaveBeenCalled();
        await waitFor(() => {
            expect(repositoryMock.countForPubkey).toHaveBeenCalledTimes(1);
        });
        expect(localSearchServiceMock.searchLocalPosts).not.toHaveBeenCalled();

        view.unmount();
    });

    it('saved sparse 読み込み中に close と reopen を挟んでも遅延結果を次回一覧へ適用しない', async () => {
        const newest = createRecord({
            eventId: 'saved-stale-newest',
            content: 'saved stale 最新',
            createdAt: 1_700,
            postedAt: 1_700_000,
        });
        const staleSparse = createRecord({
            eventId: 'saved-stale-sparse',
            content: 'saved stale sparse',
            createdAt: 900,
            postedAt: 900_000,
        });
        const sparseDeferred = createDeferred<any[]>();
        const onClose = vi.fn();

        visibleRangeRepositoryMock.get.mockResolvedValue({
            pubkeyHex: PUBKEY_HEX,
            kindsKey: '1,42',
            visibleUntil: 1_000,
            updatedAt: 1,
        });
        repositoryMock.countForPubkey.mockResolvedValue(2);
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([newest]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        repositoryMock.hasPostsBeforeCreatedAt.mockResolvedValue(true);
        repositoryMock.getSparseChunk.mockImplementation(({ direction }: Record<string, any>) => {
            if (direction === 'latest') {
                return sparseDeferred.promise;
            }

            return Promise.resolve([]);
        });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose,
                pubkeyHex: PUBKEY_HEX,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('saved stale 最新')).toBeTruthy();
            expect(screen.getByRole('button', { name: '保存済みの古い投稿を表示' })).toBeTruthy();
        });

        await fireEvent.click(screen.getByRole('button', { name: '保存済みの古い投稿を表示' }));
        await waitFor(() => {
            expect(repositoryMock.getSparseChunk).toHaveBeenCalledTimes(1);
        });

        repositoryMock.getLatestVisibleChunk.mockClear();

        await fireEvent.click(screen.getByRole('button', { name: '閉じる' }));
        await waitFor(() => {
            expect(onClose).toHaveBeenCalledTimes(1);
        });

        await view.rerender({
            show: false,
            onClose,
            pubkeyHex: PUBKEY_HEX,
        });
        await view.rerender({
            show: true,
            onClose,
            pubkeyHex: PUBKEY_HEX,
        });

        await waitFor(() => {
            expect(screen.getByText('saved stale 最新')).toBeTruthy();
            expect(repositoryMock.getLatestVisibleChunk).toHaveBeenCalledTimes(1);
        });

        sparseDeferred.resolve([staleSparse]);
        await Promise.resolve();
        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(screen.getByText('saved stale 最新')).toBeTruthy();
        expect(screen.queryByText('saved stale sparse')).toBeNull();

        view.unmount();
    });

    it('A から B へ切り替えて B の最新取得待ち中でも A の state を B の snapshot へ混在させない', async () => {
        const otherPubkeyHex = 'b'.repeat(64);
        const accountALatest = createRecord({
            eventId: 'account-switch-a-newest',
            content: 'account switch A 最新',
            createdAt: 1_700,
            postedAt: 1_700_000,
        });
        const accountASavedOlder = createRecord({
            eventId: 'account-switch-a-sparse',
            content: 'account switch A sparse',
            createdAt: 900,
            postedAt: 900_000,
        });
        const staleBLatest = createRecord({
            eventId: 'account-switch-b-stale',
            content: 'account switch B stale',
            createdAt: 2_600,
            postedAt: 2_600_000,
        });
        const accountBLatest = createRecord({
            eventId: 'account-switch-b-newest',
            content: 'account switch B 最新',
            createdAt: 2_700,
            postedAt: 2_700_000,
        });
        const onClose = vi.fn();
        const firstBLatestDeferred = createDeferred<any[]>();
        const secondBLatestDeferred = createDeferred<any[]>();
        let bLatestRequestCount = 0;

        visibleRangeRepositoryMock.get.mockImplementation(async (pubkeyHex: string) =>
            pubkeyHex === PUBKEY_HEX
                ? {
                    pubkeyHex: PUBKEY_HEX,
                    kindsKey: '1,42',
                    visibleUntil: 1_000,
                    updatedAt: 1,
                }
                : null,
        );
        repositoryMock.countForPubkey.mockImplementation(async (pubkeyHex: string) =>
            pubkeyHex === PUBKEY_HEX ? 2 : 1,
        );
        repositoryMock.getLatestVisibleChunk.mockImplementation(({ pubkeyHex }: Record<string, any>) => {
            if (pubkeyHex === PUBKEY_HEX) {
                return Promise.resolve([accountALatest]);
            }

            bLatestRequestCount += 1;
            return bLatestRequestCount === 1
                ? firstBLatestDeferred.promise
                : secondBLatestDeferred.promise;
        });
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        repositoryMock.getVisibleChunkAroundEventId.mockResolvedValue([]);
        repositoryMock.hasPostsBeforeCreatedAt.mockImplementation(async (pubkeyHex: string, visibleUntil: number) =>
            pubkeyHex === PUBKEY_HEX && visibleUntil === 1_000,
        );
        repositoryMock.getSparseChunk.mockImplementation(async ({ pubkeyHex, direction }: Record<string, any>) => {
            if (pubkeyHex === PUBKEY_HEX && direction === 'latest') {
                return [accountASavedOlder];
            }

            return [];
        });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose,
                pubkeyHex: PUBKEY_HEX,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('account switch A 最新')).toBeTruthy();
            expect(screen.getByRole('button', { name: '保存済みの古い投稿を表示' })).toBeTruthy();
        });

        await fireEvent.click(screen.getByRole('button', { name: '保存済みの古い投稿を表示' }));
        await waitFor(() => {
            expect(screen.getByText('account switch A sparse')).toBeTruthy();
        });

        repositoryMock.getLatestVisibleChunk.mockClear();

        await view.rerender({
            show: true,
            onClose,
            pubkeyHex: otherPubkeyHex,
        });

        await waitFor(() => {
            expect(screen.queryByText('account switch A 最新')).toBeNull();
            expect(screen.queryByText('account switch A sparse')).toBeNull();
        });

        expect(readPersistedPostHistoryListingSnapshotForPubkey(otherPubkeyHex)).toMatchObject({
            loadedPosts: [],
            searchPosts: [],
            totalCount: 0,
        });
        await waitFor(() => {
            expect(repositoryMock.getLatestVisibleChunk).toHaveBeenCalledWith(
                expect.objectContaining({
                    pubkeyHex: otherPubkeyHex,
                }),
            );
        });

        await fireEvent.click(screen.getByRole('button', { name: '閉じる' }));
        await waitFor(() => {
            expect(onClose).toHaveBeenCalledTimes(1);
        });

        expect(readPersistedPostHistoryListingSnapshotForPubkey(otherPubkeyHex)).toMatchObject({
            loadedPosts: [],
            searchPosts: [],
            totalCount: 0,
        });

        await view.rerender({
            show: false,
            onClose,
            pubkeyHex: otherPubkeyHex,
        });
        await view.rerender({
            show: true,
            onClose,
            pubkeyHex: otherPubkeyHex,
        });

        await waitFor(() => {
            expect(repositoryMock.getLatestVisibleChunk).toHaveBeenCalledTimes(2);
            expect(screen.queryByText('account switch A sparse')).toBeNull();
        });

        firstBLatestDeferred.resolve([staleBLatest]);
        await Promise.resolve();
        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(screen.queryByText('account switch B stale')).toBeNull();
        expect(readPersistedPostHistoryListingSnapshotForPubkey(otherPubkeyHex)).toMatchObject({
            loadedPosts: [],
            searchPosts: [],
            totalCount: 0,
        });

        secondBLatestDeferred.resolve([accountBLatest]);

        await waitFor(() => {
            expect(screen.getByText('account switch B 最新')).toBeTruthy();
            expect(screen.queryByText('account switch A 最新')).toBeNull();
        });

        await waitFor(() => {
            expect(readPersistedPostHistoryListingSnapshotForPubkey(otherPubkeyHex)).toMatchObject({
                loadedPosts: [expect.objectContaining({ eventId: accountBLatest.eventId })],
                searchPosts: [],
                totalCount: 1,
            });
        });

        await view.rerender({
            show: true,
            onClose,
            pubkeyHex: PUBKEY_HEX,
        });

        await waitFor(() => {
            expect(screen.getByText('account switch A 最新')).toBeTruthy();
            expect(screen.queryByText('account switch B 最新')).toBeNull();
        });

        expect(readPersistedPostHistoryListingSnapshotForPubkey(PUBKEY_HEX).loadedPosts).not.toContainEqual(
            expect.objectContaining({ eventId: accountBLatest.eventId }),
        );

        view.unmount();
    });

    it('sparse 表示中に別アカウントへ切り替えても古い window や scroll anchor を引き継がない', async () => {
        const otherPubkeyHex = 'b'.repeat(64);
        const accountALatest = createRecord({
            eventId: 'account-a-newest',
            content: 'account A 最新',
            createdAt: 1_700,
            postedAt: 1_700_000,
        });
        const accountASavedOlder = createRecord({
            eventId: 'account-a-sparse',
            content: 'account A sparse',
            createdAt: 900,
            postedAt: 900_000,
        });
        const accountBLatest = createRecord({
            eventId: 'account-b-newest',
            content: 'account B 最新',
            createdAt: 2_700,
            postedAt: 2_700_000,
        });

        visibleRangeRepositoryMock.get.mockImplementation(async (pubkeyHex: string) =>
            pubkeyHex === PUBKEY_HEX
                ? {
                    pubkeyHex: PUBKEY_HEX,
                    kindsKey: '1,42',
                    visibleUntil: 1_000,
                    updatedAt: 1,
                }
                : null,
        );
        repositoryMock.countForPubkey.mockImplementation(async (pubkeyHex: string) =>
            pubkeyHex === PUBKEY_HEX ? 2 : 1,
        );
        repositoryMock.getLatestVisibleChunk.mockImplementation(async ({ pubkeyHex }: Record<string, any>) =>
            pubkeyHex === PUBKEY_HEX ? [accountALatest] : [accountBLatest],
        );
        repositoryMock.getNewerVisibleChunk.mockResolvedValue([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValue([]);
        repositoryMock.getVisibleChunkAroundEventId.mockResolvedValue([]);
        repositoryMock.hasPostsBeforeCreatedAt.mockImplementation(async (pubkeyHex: string, visibleUntil: number) =>
            pubkeyHex === PUBKEY_HEX && visibleUntil === 1_000,
        );
        repositoryMock.getSparseChunk.mockImplementation(async ({ pubkeyHex, direction }: Record<string, any>) => {
            if (pubkeyHex === PUBKEY_HEX && direction === 'latest') {
                return [accountASavedOlder];
            }

            return [];
        });

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('account A 最新')).toBeTruthy();
            expect(screen.getByRole('button', { name: '保存済みの古い投稿を表示' })).toBeTruthy();
        });

        await fireEvent.click(screen.getByRole('button', { name: '保存済みの古い投稿を表示' }));
        await waitFor(() => {
            expect(screen.getByText('account A sparse')).toBeTruthy();
        });

        writePostHistoryDialogScrollState({
            pubkeyHex: PUBKEY_HEX,
            mode: 'normal',
            anchor: {
                eventId: accountASavedOlder.eventId,
                offsetTop: 64,
            },
            savedAt: 4321,
        });

        repositoryMock.getLatestVisibleChunk.mockClear();
        repositoryMock.getSparseChunk.mockClear();
        repositoryMock.getVisibleChunkAroundEventId.mockClear();
        repositoryMock.countForPubkey.mockClear();

        await view.rerender({
            show: true,
            onClose: vi.fn(),
            pubkeyHex: otherPubkeyHex,
        });

        await waitFor(() => {
            expect(screen.getByText('account B 最新')).toBeTruthy();
            expect(screen.queryByText('account A sparse')).toBeNull();
        });

        expect(repositoryMock.getLatestVisibleChunk).toHaveBeenCalledWith(
            expect.objectContaining({
                pubkeyHex: otherPubkeyHex,
            }),
        );
        expect(repositoryMock.getSparseChunk).not.toHaveBeenCalled();
        expect(repositoryMock.getVisibleChunkAroundEventId).not.toHaveBeenCalled();
        await waitFor(() => {
            expect(repositoryMock.countForPubkey).toHaveBeenCalledWith(otherPubkeyHex);
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

    it('visibleUntil 未確定かつ jump cache anchor がある場合は最古へ移動を無効化する', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(2);
        repositoryMock.getLatestVisibleChunk.mockResolvedValueOnce([
            createRecord({ eventId: 'jump-guard-newest', content: '最新投稿' }),
            createRecord({ eventId: 'jump-guard-older', content: '古い投稿', createdAt: 1_704_153_600 }),
        ]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValueOnce([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValueOnce([
            createRecord({ eventId: 'jump-guard-older-local', content: 'さらに古い投稿' }),
        ]);
        jumpCacheAnchorRepositoryMock.getForPubkey.mockResolvedValueOnce([
            {
                centerCreatedAt: 1_700_000_000,
                radiusSec: 86_400,
                fetchedAt: Date.now(),
            },
        ]);

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('古い投稿')).toBeTruthy();
        });

        await openPostHistoryMenu();
        const jumpToOldestItem = await screen.findByRole('menuitem', { name: '最古へ移動' });
        expect(jumpToOldestItem.getAttribute('aria-disabled')).toBe('true');

        await fireEvent.click(jumpToOldestItem);

        await waitFor(() => {
            expect(repositoryMock.getVisibleChunkFromCreatedAt).not.toHaveBeenCalledWith(
                expect.objectContaining({
                    pubkeyHex: PUBKEY_HEX,
                    createdAt: 0,
                }),
            );
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

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'さらに古い投稿を表示' })).toBeTruthy();
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
        await setJumpDateValue('2024-01-01');
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
        await setJumpDateValue('2024-01-01');
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
        await setJumpDateValue('2024-01-01');
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
        await setJumpDateValue('2026-05-12');
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
        await waitFor(() => {
            expect(screen.queryByRole('button', { name: '新しい投稿を表示' })).toBeNull();
        });
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
            await setJumpDateValue(dateInput);
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
