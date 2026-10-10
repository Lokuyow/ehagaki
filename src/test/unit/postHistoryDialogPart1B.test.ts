import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/svelte';
import {
    PostHistoryDialog,
    cleanupPostHistoryDialogHarness,
    localSearchServiceMock,
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

async function openSearchBar(): Promise<HTMLInputElement> {
    await fireEvent.click(await screen.findByRole('button', { name: '検索' }));
    return screen.findByRole('searchbox', { name: '検索' }) as Promise<HTMLInputElement>;
}

async function findRepairButton(): Promise<HTMLElement> {
    return screen.findByRole('button', { name: '表示中の投稿付近を再取得' }) as Promise<HTMLElement>;
}

async function openFreshRepairButton(): Promise<HTMLElement> {
    // These repair fixtures first complete the empty open-time relay query.
    await waitFor(() => expect(repositoryMock.upsertFetchedEvents).toHaveBeenCalled());
    await waitFor(() => expect(screen.queryByText('リレーと同期中...')).toBeNull());
    return screen.findByRole('button', { name: '表示中の投稿付近を再取得' }) as Promise<HTMLElement>;
}

async function activateButton(button: HTMLElement): Promise<void> {
    button.focus();
    await fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
    await fireEvent.click(button);
}

describe('PostHistoryDialog', () => {
    beforeEach(() => {
        resetPostHistoryDialogHarness({ listingMode: 'page-adapter' });
    });

    afterEach(() => {
        cleanupPostHistoryDialogHarness();
    });

    it('[repair-disabled] 修復中は repair button を disabled にする', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({ eventId: 'repair-disabled-page', content: '一覧の投稿' }),
        ]);
        const repairTask = createDeferred<{
            status: 'success';
            addedCount: 1;
            updatedCount: 0;
            unchangedCount: 0;
            processedRangeCount: 1;
            processedRanges: [];
            attemptedRangeCount: 1;
            hadFailures: false;
        }>();
        relayFetchServiceMock.fetchLatest.mockReturnValueOnce({
            promise: Promise.resolve({
                status: 'success',
                events: [],
                fetchedAt: 1000,
                nextUntil: null,
                hasMore: false,
                relayUrls: ['wss://relay.example.com/'],
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
        repairServiceMock.refetchAroundCurrentView.mockReturnValueOnce({
            promise: repairTask.promise,
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
            expect(screen.getByText('一覧の投稿')).toBeTruthy();
        });

        const repairButton = await openFreshRepairButton();

        await waitFor(() => {
            expect(repairButton.hasAttribute('disabled')).toBe(false);
        });

        await activateButton(repairButton);

        await waitFor(() => {
            expect(screen.getByText('再取得中...')).toBeTruthy();
        });

        const statusToast = document.querySelector('.floating-message.anchor-bottom-right[role="status"]');
        expect(statusToast?.textContent).toContain('再取得中...');
        expect(statusToast?.querySelector('.info-icon')).toBeNull();
        expect(statusToast?.querySelector('.status-loading-placeholder .loader-container')).toBeTruthy();
        expect(statusToast?.closest('.post-history-heading')).toBeNull();
        expect(document.querySelector('.post-history-heading .status-loading-placeholder')).toBeNull();

        expect((await findRepairButton()).hasAttribute('disabled')).toBe(true);

        repairTask.resolve({
            status: 'success',
            addedCount: 1,
            updatedCount: 0,
            unchangedCount: 0,
            processedRangeCount: 1,
            processedRanges: [],
            attemptedRangeCount: 1,
            hadFailures: false,
        });
    });

    it('[repair-partial-no-changes] 再取得が内部 partial でも追加がなければ追加なしを表示する', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({ eventId: 'repair-partial-page', content: '一覧の投稿' }),
        ]);
        relayFetchServiceMock.fetchLatest.mockReturnValueOnce({
            promise: Promise.resolve({
                status: 'success',
                events: [],
                fetchedAt: 1000,
                nextUntil: null,
                hasMore: false,
                relayUrls: ['wss://relay.example.com/'],
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
                hadUnfinishedRanges: true,
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
            expect(screen.getByText('一覧の投稿')).toBeTruthy();
        });

        await waitFor(() => {
            expect(screen.queryByText('リレーと同期中...')).toBeNull();
        });

        const repairButton = await openFreshRepairButton();

        await waitFor(() => {
            expect(repairButton.hasAttribute('disabled')).toBe(false);
        });

        await activateButton(repairButton);

        await waitFor(() => {
            expect(repairServiceMock.refetchAroundCurrentView).toHaveBeenCalledTimes(1);
        });

        await waitFor(() => {
            const activeDialog = screen.getAllByRole('dialog').at(-1);
            expect(screen.getByText('追加なし')).toBeTruthy();
            expect(screen.queryByText('一部未確認')).toBeNull();
            expect(activeDialog ? within(activeDialog).queryByText('リレーとの同期が完了しました') : null).toBeNull();
        });
    });

    it('[repair-preferred-range] 通常モードの repair は current page 由来 preferred range を渡して再読み込みする', async () => {
        const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => undefined);
        const pubkeyHex = 'a'.repeat(64);
        const pagePost = createRecord({
            eventId: 'page-1',
            content: '一覧の投稿',
            createdAt: 1_700_000_100,
        });
        const expectedSince = pagePost.createdAt - 24 * 60 * 60;
        const expectedUntil = pagePost.createdAt + 24 * 60 * 60;
        let currentVisibleUntil = 1_700_000_050;

        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([pagePost]);
        visibleRangeRepositoryMock.get.mockImplementation(async () => ({
            pubkeyHex,
            kindsKey: '1,42,1111',
            visibleUntil: currentVisibleUntil,
            updatedAt: 1000,
        }));
        visibleRangeRepositoryMock.save.mockImplementation(async (input: Record<string, any>) => {
            currentVisibleUntil = input.visibleUntil;
            return {
                ...input,
                updatedAt: 2000,
            };
        });
        relayFetchServiceMock.fetchLatest.mockReturnValueOnce({
            promise: Promise.resolve({
                status: 'success',
                events: [],
                fetchedAt: 1000,
                nextUntil: null,
                hasMore: false,
                relayUrls: ['wss://relay.example.com/'],
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
        repairServiceMock.refetchAroundCurrentView.mockReturnValueOnce({
            promise: Promise.resolve({
                status: 'success',
                addedCount: 0,
                updatedCount: 0,
                unchangedCount: 0,
                processedRangeCount: 1,
                processedRanges: [{
                    source: 'preferred',
                    status: 'complete',
                    rangeUnit: 'custom',
                    since: expectedSince,
                    until: expectedUntil,
                }],
                attemptedRangeCount: 1,
                hadFailures: false,
                timing: {
                    primaryFetchDurationMs: 100,
                    primaryPersistDurationMs: 30,
                    primaryPersistAttemptCount: 1,
                },
            }),
            cancel: vi.fn(),
        });

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex,
                rxNostr: {} as any,
            },
        });

        await waitFor(() => {
            expect(screen.getByText('一覧の投稿')).toBeTruthy();
        });

        const repairButton = await openFreshRepairButton();

        await waitFor(() => {
            expect(repairButton.hasAttribute('disabled')).toBe(false);
        });

        const getPageCallCountBeforeRepair = repositoryMock.getPage.mock.calls.length;

        await activateButton(repairButton);

        await waitFor(() => {
            expect(repairServiceMock.refetchAroundCurrentView).toHaveBeenCalledTimes(1);
        });

        const repairParams = repairServiceMock.refetchAroundCurrentView.mock.calls.at(-1)?.[1];
        expect(repairParams).toEqual(expect.objectContaining({
            pubkeyHex,
            relayConfig: null,
            preferredRanges: [{
                kinds: [1, 42, 1111],
                rangeUnit: 'custom',
                since: expectedSince,
                until: expectedUntil,
                limit: 250,
            }],
            onProgress: expect.any(Function),
        }));

        await waitFor(() => {
            expect(repositoryMock.getPage.mock.calls.length).toBeGreaterThan(getPageCallCountBeforeRepair);
        });

        await waitFor(() => {
            const phases = debugSpy.mock.calls
                .filter(([message]) => message === 'post_history_manual_repair_phase')
                .map(([, telemetry]) => telemetry as Record<string, unknown>);
            expect(phases).toEqual(expect.arrayContaining([
                expect.objectContaining({ phase: 'primary-fetch', durationMs: 100 }),
                expect.objectContaining({ phase: 'primary-persist', durationMs: 30 }),
                expect.objectContaining({ phase: 'visible-range-state', durationMs: expect.any(Number) }),
                expect.objectContaining({ phase: 'visible-window-reload', durationMs: expect.any(Number) }),
                expect.objectContaining({ phase: 'relation-repair', durationMs: expect.any(Number) }),
                expect.objectContaining({ phase: 'badge-refresh', durationMs: expect.any(Number) }),
            ]));
        });
        debugSpy.mockRestore();
    });

    it('[repair-search-mode-disabled] 検索中は repair button を disabled にする', async () => {
        vi.useFakeTimers();
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getPage.mockResolvedValue([
            createRecord({ eventId: 'page-1', content: '一覧の投稿' }),
        ]);
        relayFetchServiceMock.fetchLatest.mockReturnValueOnce({
            promise: Promise.resolve({
                status: 'success',
                events: [],
                fetchedAt: 1000,
                nextUntil: null,
                hasMore: false,
                relayUrls: ['wss://relay.example.com/'],
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
        localSearchServiceMock.searchLocalPosts.mockResolvedValue({
            items: [createRecord({ eventId: 'search-hit', content: '検索一致' })],
            total: 1,
            hasNext: false,
        });

        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        const searchInput = await openSearchBar();
        await fireEvent.input(searchInput, { target: { value: '一致' } });
        await vi.advanceTimersByTimeAsync(250);

        await waitFor(() => {
            expect(localSearchServiceMock.searchLocalPosts).toHaveBeenCalled();
        });
        await screen.findByText('検索一致');
        await vi.advanceTimersByTimeAsync(1);
        expect(localSearchServiceMock.searchLocalPosts.mock.calls.at(-1)?.[0]).toMatchObject({
            pubkeyHex: 'a'.repeat(64),
            query: '一致',
            page: 1,
            pageSize: 50,
        });
        expect((await findRepairButton()).hasAttribute('disabled')).toBe(true);
        expect(repairServiceMock.refetchAroundCurrentView).not.toHaveBeenCalled();
    });

    it('[repair-empty-history-disabled] 表示中投稿がないと repair button を disabled にする', async () => {
        render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'a'.repeat(64),
                rxNostr: {} as any,
            },
        });

        expect((await findRepairButton()).hasAttribute('disabled')).toBe(true);
        expect(repairServiceMock.refetchAroundCurrentView).not.toHaveBeenCalled();
    });

});
