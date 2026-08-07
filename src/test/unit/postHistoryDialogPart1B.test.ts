import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/svelte';
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

async function openFreshRepairButton(): Promise<HTMLElement> {
    const trigger = await screen.findByRole('button', { name: '投稿履歴メニューを開く' });
    if (trigger.getAttribute('aria-expanded') === 'true') {
        await fireEvent.click(trigger);
    }

    await openPostHistoryMenu();
    return screen.findByRole('menuitem', { name: /表示中の投稿付近を再取得|再取得中\.\.\./ }) as Promise<HTMLElement>;
}

async function activateMenuItem(item: HTMLElement): Promise<void> {
    item.focus();
    await fireEvent.keyDown(item, { key: 'Enter', code: 'Enter' });
    await fireEvent.click(item);
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
            expect(repairButton.hasAttribute('data-disabled')).toBe(false);
        });

        await activateMenuItem(repairButton);

        await waitFor(() => {
            expect(screen.getByText('再取得中...')).toBeTruthy();
        });

        expect((await findRepairButton()).hasAttribute('data-disabled')).toBe(true);

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

    it('[repair-partial-failure] 再取得が部分失敗なら failure 文言を表示する', async () => {
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
            expect(repairButton.hasAttribute('data-disabled')).toBe(false);
        });

        await activateMenuItem(repairButton);

        await waitFor(() => {
            expect(repairServiceMock.refetchAroundCurrentView).toHaveBeenCalledTimes(1);
        });

        await waitFor(() => {
            const activeDialog = screen.getAllByRole('dialog').at(-1);
            expect(screen.getByText('一部未確認')).toBeTruthy();
            expect(activeDialog ? within(activeDialog).queryByText('リレーとの同期が完了しました') : null).toBeNull();
        });
    });

    it('[repair-preferred-range] 通常モードの repair は current page 由来 preferred range を渡して再読み込みする', async () => {
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
            kindsKey: '1,42',
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
            expect(repairButton.hasAttribute('data-disabled')).toBe(false);
        });

        const getPageCallCountBeforeRepair = repositoryMock.getPage.mock.calls.length;

        await activateMenuItem(repairButton);

        await waitFor(() => {
            expect(repairServiceMock.refetchAroundCurrentView).toHaveBeenCalledTimes(1);
        });

        const repairParams = repairServiceMock.refetchAroundCurrentView.mock.calls.at(-1)?.[1];
        expect(repairParams).toEqual(expect.objectContaining({
            pubkeyHex,
            relayConfig: null,
            preferredRanges: [{
                kinds: [1, 42],
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
    });

    it('[repair-search-mode-disabled] 検索中は repair button を disabled にする', async () => {
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
        await new Promise((resolve) => setTimeout(resolve, 300));

        await waitFor(() => {
            expect(localSearchServiceMock.searchLocalPosts).toHaveBeenCalled();
        });
        expect(localSearchServiceMock.searchLocalPosts.mock.calls.at(-1)?.[0]).toMatchObject({
            pubkeyHex: 'a'.repeat(64),
            query: '一致',
            page: 1,
            pageSize: 50,
        });
        expect((await findRepairButton()).hasAttribute('data-disabled')).toBe(true);
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

        expect((await findRepairButton()).hasAttribute('data-disabled')).toBe(true);
        expect(repairServiceMock.refetchAroundCurrentView).not.toHaveBeenCalled();
    });


});
