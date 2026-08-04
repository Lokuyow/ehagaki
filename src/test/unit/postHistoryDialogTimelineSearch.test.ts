import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import {
    PUBKEY_HEX,
    PostHistoryDialog,
    cleanupPostHistoryDialogHarness,
    createDeferred,
    createRecord,
    getHistoryContainer,
    localSearchServiceMock,
    openSearchBar,
    postMediaCacheServiceMock,
    postHistoryJsonlImportServiceMock,
    relayFetchServiceMock,
    repositoryMock,
    replyRepairServiceMock,
    resetPostHistoryDialogHarness,
    waitForSearchDebounce,
} from './postHistoryDialogTestHarness';
import { readPersistedPostHistoryViewState } from '../../lib/postHistoryDialogViewState';

function controlAnimationFrames() {
    let nextId = 1;
    const callbacks = new Map<number, FrameRequestCallback>();
    const requestAnimationFrameSpy = vi
        .spyOn(window, 'requestAnimationFrame')
        .mockImplementation((callback: FrameRequestCallback) => {
            const id = nextId++;
            callbacks.set(id, callback);
            return id;
        });

    return {
        async flushFrame(): Promise<void> {
            const pending = [...callbacks.values()];
            callbacks.clear();
            pending.forEach((callback) => callback(0));
            await Promise.resolve();
            await Promise.resolve();
        },
        restore(): void {
            requestAnimationFrameSpy.mockRestore();
        },
    };
}

async function persistSearchSnapshot(
    query: string,
    post: ReturnType<typeof createRecord>,
): Promise<void> {
    localSearchServiceMock.searchLocalPosts.mockResolvedValue({
        items: [post],
        total: 1,
        hasNext: false,
    });
    const view = render(PostHistoryDialog, {
        props: {
            show: true,
            onClose: vi.fn(),
            pubkeyHex: PUBKEY_HEX,
        },
    });
    const searchInput = await openSearchBar();
    await fireEvent.input(searchInput, { target: { value: query } });
    await waitForSearchDebounce();
    await waitFor(() => {
        expect(screen.getByText(String(post.content))).toBeTruthy();
    });
    await fireEvent.click(screen.getByRole('button', { name: '閉じる' }));
    view.unmount();
}

describe('PostHistoryDialog timeline search', () => {
    beforeEach(() => {
        resetPostHistoryDialogHarness();
    });

    it('検索結果の古いページ追加後も既存投稿のコンテナ内位置を維持する', async () => {
        let layoutShift = 0;
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getLatestVisibleChunk.mockResolvedValueOnce([
            createRecord({ eventId: 'search-scroll-normal', content: '通常一覧' }),
        ]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValueOnce([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValueOnce([]);
        localSearchServiceMock.searchLocalPosts.mockImplementation(
            async ({ page }: { page: number }) => {
                if (page === 2) {
                    layoutShift = 40;
                }

                return {
                    items: [createRecord({
                        eventId: `search-scroll-page-${page}`,
                        content: `search-scroll-page-${page}`,
                    })],
                    total: 100,
                    hasNext: page === 1,
                };
            },
        );

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
            },
        });

        const searchInput = await openSearchBar();
        await fireEvent.input(searchInput, { target: { value: 'alpha' } });
        await waitForSearchDebounce();
        await waitFor(() => {
            expect(screen.getByText('search-scroll-page-1')).toBeTruthy();
        });

        const container = getHistoryContainer();
        container.scrollTop = 20;
        Object.defineProperty(container, 'getBoundingClientRect', {
            configurable: true,
            value: () => ({ top: 0, bottom: 320 }),
        });
        const firstItem = container.querySelector<HTMLElement>('[data-post-history-event-id="search-scroll-page-1"]');
        expect(firstItem).not.toBeNull();
        Object.defineProperty(firstItem, 'getBoundingClientRect', {
            configurable: true,
            value: () => ({
                top: 40 + layoutShift - container.scrollTop,
                bottom: 100 + layoutShift - container.scrollTop,
            }),
        });

        const beforeOffset = firstItem!.getBoundingClientRect().top - container.getBoundingClientRect().top;
        await fireEvent.click(screen.getByRole('button', { name: 'さらに古い検索結果を表示' }));

        await waitFor(() => {
            expect(screen.getByText('search-scroll-page-2')).toBeTruthy();
        });

        const afterOffset = firstItem!.getBoundingClientRect().top - container.getBoundingClientRect().top;
        expect(afterOffset).toBe(beforeOffset);
        view.unmount();
    });

    it('存在しない検索ページの結果では表示・ページ状態を維持し、loadingを解除する', async () => {
        vi.useFakeTimers();
        const secondPage = createDeferred<{
            items: ReturnType<typeof createRecord>[];
            total: number;
            hasNext: boolean;
        }>();
        localSearchServiceMock.searchLocalPosts.mockImplementation(
            ({ page }: { page: number }) => page === 1
                ? Promise.resolve({
                    items: [createRecord({ eventId: 'missing-page-1', content: '検索1ページ目' })],
                    total: 51,
                    hasNext: true,
                })
                : secondPage.promise,
        );

        const view = render(PostHistoryDialog, {
            props: { show: true, onClose: vi.fn(), pubkeyHex: PUBKEY_HEX },
        });
        const searchInput = await openSearchBar();
        await fireEvent.input(searchInput, { target: { value: 'alpha' } });
        await vi.advanceTimersByTimeAsync(300);
        await vi.advanceTimersByTimeAsync(0);
        await waitFor(() => {
            expect(screen.getByText('検索1ページ目')).toBeTruthy();
            expect(screen.getByRole('button', { name: 'さらに古い検索結果を表示' })).toBeTruthy();
        });

        await fireEvent.click(screen.getByRole('button', { name: 'さらに古い検索結果を表示' }));
        expect(getHistoryContainer().getAttribute('aria-busy')).toBe('true');

        secondPage.resolve({
            items: [createRecord({ eventId: 'missing-page-2', content: '存在しないページの結果' })],
            total: 1,
            hasNext: false,
        });
        await vi.advanceTimersByTimeAsync(0);
        await waitFor(() => {
            expect(screen.getByText('検索1ページ目')).toBeTruthy();
            expect(screen.queryByText('存在しないページの結果')).toBeNull();
            expect(getHistoryContainer().getAttribute('aria-busy')).toBe('false');
        });

        await vi.advanceTimersByTimeAsync(200);
        expect(document.querySelector('.post-history-list-loading')).toBeNull();
        expect(screen.getByRole('button', { name: 'さらに古い検索結果を表示' })).toBeTruthy();
        view.unmount();
    });

    it('200ms超の初回ローカル読込だけspinnerを表示し、完了後に解除する', async () => {
        vi.useFakeTimers();
        const deferredPosts = createDeferred<ReturnType<typeof createRecord>[]>();
        repositoryMock.getLatestVisibleChunk.mockReturnValue(deferredPosts.promise);

        const view = render(PostHistoryDialog, {
            props: { show: true, onClose: vi.fn(), pubkeyHex: PUBKEY_HEX },
        });

        await vi.advanceTimersByTimeAsync(200);
        expect(document.querySelector('.post-history-list-loading')).not.toBeNull();
        expect(getHistoryContainer().getAttribute('aria-busy')).toBe('true');

        deferredPosts.resolve([]);
        await vi.advanceTimersByTimeAsync(0);
        await vi.runAllTicks();
        expect(screen.getByText('投稿履歴はありません')).toBeTruthy();
        expect(document.querySelector('.post-history-list-loading')).toBeNull();
        expect(getHistoryContainer().getAttribute('aria-busy')).toBe('false');

        view.unmount();
        vi.clearAllTimers();
    });

    it('インポート後は読み込み済み検索範囲を先頭から再構築する', async () => {
        const existingPosts = Array.from({ length: 51 }, (_, index) =>
            createRecord({
                eventId: `import-search-${index + 1}`,
                content: `import-search-${index + 1}`,
            }),
        );
        const importedPost = createRecord({
            eventId: 'import-search-newest',
            content: 'import-search-newest',
        });
        let searchablePosts = [...existingPosts];

        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getLatestVisibleChunk.mockResolvedValueOnce([
            createRecord({ eventId: 'import-search-normal', content: '通常一覧' }),
        ]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValueOnce([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValueOnce([]);
        localSearchServiceMock.searchLocalPosts.mockImplementation(
            async ({ page }: { page: number }) => ({
                items: searchablePosts.slice((page - 1) * 50, page * 50),
                total: searchablePosts.length,
                hasNext: page * 50 < searchablePosts.length,
            }),
        );
        postHistoryJsonlImportServiceMock.importFile.mockImplementation(async () => {
            searchablePosts = [importedPost, ...existingPosts];
            return {
                status: 'completed',
                insertedPostCount: 1,
                updatedPostCount: 0,
                appliedDeletionPostCount: 0,
            };
        });

        const view = render(PostHistoryDialog, {
            props: { show: true, onClose: vi.fn(), pubkeyHex: PUBKEY_HEX },
        });
        const searchInput = await openSearchBar();
        await fireEvent.input(searchInput, { target: { value: 'alpha' } });
        await waitForSearchDebounce();
        await fireEvent.click(await screen.findByRole('button', { name: 'さらに古い検索結果を表示' }));
        await waitFor(() => {
            expect(screen.getByText('import-search-51')).toBeTruthy();
        });

        await fireEvent.click(await screen.findByRole('button', { name: '投稿履歴メニューを開く' }));
        await fireEvent.click(await screen.findByRole('menuitem', { name: 'インポート' }));
        await screen.findAllByRole('heading', { name: '投稿履歴をインポート' });
        const input = document.querySelector('.import-file-input');
        expect(input).toBeInstanceOf(HTMLInputElement);
        await fireEvent.change(input as HTMLInputElement, {
            target: {
                files: [new File(['{}'], 'history.jsonl', { type: 'application/json' })],
            },
        });

        await waitFor(() => {
            expect(screen.getByText('import-search-newest')).toBeTruthy();
            expect(document.querySelectorAll('.post-history-item')).toHaveLength(52);
        });

        expect(Array.from(document.querySelectorAll<HTMLElement>('.post-history-item'))
            .map((item) => item.dataset.postHistoryEventId))
            .toEqual(searchablePosts.map((post) => post.eventId));
        expect(localSearchServiceMock.searchLocalPosts).toHaveBeenLastCalledWith({
            pubkeyHex: PUBKEY_HEX,
            query: 'alpha',
            page: 2,
            pageSize: 50,
        });
        view.unmount();
    });

    it('遅延した検索ページの取得中は次ページを開始せず、staleな結果を適用しない', async () => {
        const secondPage = createDeferred<{
            items: ReturnType<typeof createRecord>[];
            total: number;
            hasNext: boolean;
        }>();
        localSearchServiceMock.searchLocalPosts.mockImplementation(
            async ({ page, query }: { page: number; query: string }) => {
                if (query === 'beta') {
                    return {
                        items: [createRecord({ eventId: 'beta-search', content: 'beta-search' })],
                        total: 1,
                        hasNext: false,
                    };
                }
                if (page === 2) {
                    return secondPage.promise;
                }
                return {
                    items: [createRecord({ eventId: 'alpha-search-1', content: 'alpha-search-1' })],
                    total: 101,
                    hasNext: true,
                };
            },
        );

        const view = render(PostHistoryDialog, {
            props: { show: true, onClose: vi.fn(), pubkeyHex: PUBKEY_HEX },
        });
        const searchInput = await openSearchBar();
        await fireEvent.input(searchInput, { target: { value: 'alpha' } });
        await waitForSearchDebounce();
        const loadOlderButton = await screen.findByRole('button', { name: 'さらに古い検索結果を表示' });
        await fireEvent.click(loadOlderButton);
        await fireEvent.click(loadOlderButton);

        expect(localSearchServiceMock.searchLocalPosts).toHaveBeenCalledTimes(2);
        expect(localSearchServiceMock.searchLocalPosts).toHaveBeenLastCalledWith({
            pubkeyHex: PUBKEY_HEX,
            query: 'alpha',
            page: 2,
            pageSize: 50,
        });

        await fireEvent.input(searchInput, { target: { value: 'beta' } });
        await waitForSearchDebounce();
        secondPage.resolve({
            items: [createRecord({ eventId: 'alpha-search-2', content: 'alpha-search-2' })],
            total: 101,
            hasNext: true,
        });

        await waitFor(() => {
            expect(screen.getByText('beta-search')).toBeTruthy();
            expect(screen.queryByText('alpha-search-2')).toBeNull();
            expect(screen.queryByRole('button', { name: 'さらに古い検索結果を表示' })).toBeNull();
        });
        view.unmount();
    });

    it('検索開始時は一覧を維持し、最新検索だけがloadingを終了する', async () => {
        const alphaSearch = createDeferred<{
            items: ReturnType<typeof createRecord>[];
            total: number;
            hasNext: boolean;
        }>();
        const betaSearch = createDeferred<{
            items: ReturnType<typeof createRecord>[];
            total: number;
            hasNext: boolean;
        }>();
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getLatestVisibleChunk.mockResolvedValueOnce([
            createRecord({ eventId: 'search-loading-normal', content: '検索前の一覧' }),
        ]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValueOnce([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValueOnce([]);
        localSearchServiceMock.searchLocalPosts.mockImplementation(
            async ({ query }: { query: string }) =>
                query === 'alpha' ? alphaSearch.promise : betaSearch.promise,
        );

        const view = render(PostHistoryDialog, {
            props: { show: true, onClose: vi.fn(), pubkeyHex: PUBKEY_HEX },
        });
        const searchInput = await openSearchBar();

        await fireEvent.input(searchInput, { target: { value: 'alpha' } });
        await waitForSearchDebounce();
        expect(searchInput.getAttribute('aria-busy')).toBe('true');
        expect(searchInput.hasAttribute('disabled')).toBe(false);
        expect(screen.getByText('検索前の一覧')).toBeTruthy();
        const inputWrapper = searchInput.closest('.post-history-search-input-wrapper');
        const leadingIcon = inputWrapper?.querySelector('.post-history-search-leading');
        expect(inputWrapper).not.toBeNull();
        expect(leadingIcon?.querySelector('.post-history-search-spinner')).not.toBeNull();
        expect(leadingIcon?.querySelector('.search-icon')).toBeNull();

        await fireEvent.input(searchInput, { target: { value: 'beta' } });
        await waitForSearchDebounce();
        alphaSearch.resolve({
            items: [createRecord({ eventId: 'alpha-result', content: 'alpha-result' })],
            total: 1,
            hasNext: false,
        });
        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(searchInput.getAttribute('aria-busy')).toBe('true');
        expect(screen.queryByText('alpha-result')).toBeNull();

        betaSearch.resolve({
            items: [createRecord({ eventId: 'beta-result', content: 'beta-result' })],
            total: 1,
            hasNext: false,
        });
        await waitFor(() => {
            expect(screen.getByText('beta-result')).toBeTruthy();
            expect(searchInput.getAttribute('aria-busy')).toBe('false');
            expect(inputWrapper?.contains(searchInput)).toBe(true);
            expect(leadingIcon?.querySelector('.post-history-search-spinner')).toBeNull();
            expect(leadingIcon?.querySelector('.search-icon')).not.toBeNull();
        });

        view.unmount();
    });

    it('debounce中は虫眼鏡を維持し、検索終了時にloadingを解除する', async () => {
        const search = createDeferred<{
            items: ReturnType<typeof createRecord>[];
            total: number;
            hasNext: boolean;
        }>();
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getLatestVisibleChunk.mockResolvedValueOnce([
            createRecord({ eventId: 'search-debounce-normal', content: '通常一覧' }),
        ]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValueOnce([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValueOnce([]);
        localSearchServiceMock.searchLocalPosts.mockReturnValue(search.promise);

        const view = render(PostHistoryDialog, {
            props: { show: true, onClose: vi.fn(), pubkeyHex: PUBKEY_HEX },
        });
        const searchInput = await openSearchBar();
        await fireEvent.input(searchInput, { target: { value: 'alpha' } });

        expect(searchInput.getAttribute('aria-busy')).toBe('false');
        const inputWrapper = searchInput.closest('.post-history-search-input-wrapper');
        const leadingIcon = inputWrapper?.querySelector('.post-history-search-leading');
        expect(inputWrapper).not.toBeNull();
        expect(leadingIcon?.querySelector('.search-icon')).not.toBeNull();
        expect(leadingIcon?.querySelector('.post-history-search-spinner')).toBeNull();

        await waitForSearchDebounce();
        expect(searchInput.getAttribute('aria-busy')).toBe('true');

        search.resolve({
            items: [],
            total: 0,
            hasNext: false,
        });
        await waitFor(() => {
            expect(searchInput.getAttribute('aria-busy')).toBe('false');
            expect(inputWrapper?.contains(searchInput)).toBe(true);
            expect(leadingIcon?.querySelector('.search-icon')).not.toBeNull();
        });

        view.unmount();
    });

    afterEach(() => {
        cleanupPostHistoryDialogHarness();
    });

    it('メニューから検索バーを開くと検索入力欄へフォーカスする', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getLatestVisibleChunk.mockResolvedValueOnce([
            createRecord({ eventId: 'search-focus-normal', content: '通常一覧' }),
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

        const searchInput = await openSearchBar();

        await waitFor(() => {
            expect(document.activeElement).toBe(searchInput);
        });

        view.unmount();
    });

    it('検索結果は古い側へ順番に追加し、新しい検索結果ボタンを表示しない', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getLatestVisibleChunk.mockResolvedValueOnce([
            createRecord({ eventId: 'search-normal', content: '通常一覧' }),
        ]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValueOnce([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValueOnce([]);
        localSearchServiceMock.searchLocalPosts.mockImplementation(
            async ({ page }: { page: number }) => ({
                items: [createRecord({ eventId: `search-page-${page}`, content: `search-page-${page}` })],
                total: 101,
                hasNext: page < 3,
            }),
        );

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
            },
        });

        const searchInput = await openSearchBar();
        await fireEvent.input(searchInput, { target: { value: 'alpha' } });
        await waitForSearchDebounce();

        await waitFor(() => {
            expect(screen.getByText('search-page-1')).toBeTruthy();
            expect(screen.getByRole('button', { name: 'さらに古い検索結果を表示' })).toBeTruthy();
        });

        await fireEvent.click(screen.getByRole('button', { name: 'さらに古い検索結果を表示' }));

        await waitFor(() => {
            expect(localSearchServiceMock.searchLocalPosts).toHaveBeenLastCalledWith({
                pubkeyHex: PUBKEY_HEX,
                query: 'alpha',
                page: 2,
                pageSize: 50,
            });
            expect(screen.getByText('search-page-1')).toBeTruthy();
            expect(screen.getByText('search-page-2')).toBeTruthy();
            expect(screen.queryByRole('button', { name: '新しい検索結果を表示' })).toBeNull();
        });

        await fireEvent.click(screen.getByRole('button', { name: 'さらに古い検索結果を表示' }));

        await waitFor(() => {
            expect(localSearchServiceMock.searchLocalPosts).toHaveBeenLastCalledWith({
                pubkeyHex: PUBKEY_HEX,
                query: 'alpha',
                page: 3,
                pageSize: 50,
            });
            expect(screen.getByText('search-page-1')).toBeTruthy();
            expect(screen.getByText('search-page-2')).toBeTruthy();
            expect(screen.getByText('search-page-3')).toBeTruthy();
            expect(screen.queryByRole('button', { name: 'さらに古い検索結果を表示' })).toBeNull();
        });

        view.unmount();
    });

    it('検索結果の media prefetch を更新し、検索語変更時は 1 ページ目へ戻す', async () => {
        postMediaCacheServiceMock.canUsePersistentCache.mockReturnValue(true);

        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getLatestVisibleChunk.mockResolvedValueOnce([
            createRecord({ eventId: 'search-prefetch-normal', content: '通常一覧' }),
        ]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValueOnce([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValueOnce([]);
        localSearchServiceMock.searchLocalPosts.mockImplementation(
            async ({ page, query }: { page: number; query: string }) => {
                if (query === 'beta') {
                    return {
                        items: [createRecord({ eventId: 'beta-1', content: 'beta-1' })],
                        total: 1,
                        hasNext: false,
                    };
                }

                return {
                    items: [createRecord({
                        eventId: `${query}-${page}`,
                        content: `${query}-${page}`,
                        media: [
                            {
                                url: `https://example.com/${query}-${page}.jpg`,
                                mimeType: 'image/jpeg',
                            },
                        ],
                    })],
                    total: 51,
                    hasNext: page === 1,
                };
            },
        );

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
            },
        });

        const searchInput = await openSearchBar();
        await fireEvent.input(searchInput, { target: { value: 'media' } });
        await waitForSearchDebounce();

        await waitFor(() => {
            expect(postMediaCacheServiceMock.prefetchCachedMediaDescriptors)
                .toHaveBeenLastCalledWith(['https://example.com/media-1.jpg']);
            expect(screen.getByText('media-1')).toBeTruthy();
        });

        await fireEvent.click(screen.getByRole('button', { name: 'さらに古い検索結果を表示' }));

        await waitFor(() => {
            expect(postMediaCacheServiceMock.prefetchCachedMediaDescriptors)
                .toHaveBeenLastCalledWith([
                    'https://example.com/media-1.jpg',
                    'https://example.com/media-2.jpg',
                ]);
            expect(screen.getByText('media-2')).toBeTruthy();
        });

        await fireEvent.input(searchInput, { target: { value: 'beta' } });
        await waitForSearchDebounce();

        await waitFor(() => {
            expect(localSearchServiceMock.searchLocalPosts).toHaveBeenLastCalledWith({
                pubkeyHex: PUBKEY_HEX,
                query: 'beta',
                page: 1,
                pageSize: 50,
            });
            expect(screen.getByText('beta-1')).toBeTruthy();
        });

        view.unmount();
    });

    it('保存済み検索結果を再表示した場合も double RAF 後に media prefetch を一度だけ実行する', async () => {
        postMediaCacheServiceMock.canUsePersistentCache.mockReturnValue(true);
        const mediaUrl = 'https://example.com/restored-search.jpg';
        const savedSearchPost = createRecord({
            eventId: 'restored-search-media',
            content: '保存済み検索結果',
            media: [{ url: mediaUrl, mimeType: 'image/jpeg' }],
        });
        const searchResult = {
            items: [savedSearchPost],
            total: 1,
            hasNext: false,
        };
        repositoryMock.getLatestVisibleChunk.mockResolvedValue([]);
        localSearchServiceMock.searchLocalPosts.mockResolvedValue(searchResult);

        const firstView = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
            },
        });
        const searchInput = await openSearchBar();
        await fireEvent.input(searchInput, { target: { value: 'restored' } });
        await waitForSearchDebounce();
        await waitFor(() => {
            expect(screen.getByText('保存済み検索結果')).toBeTruthy();
        });
        await fireEvent.click(screen.getByRole('button', { name: '閉じる' }));
        firstView.unmount();

        postMediaCacheServiceMock.prefetchCachedMediaDescriptors.mockClear();
        const animationFrames = controlAnimationFrames();
        try {
            const restoredSearchRequest = createDeferred<typeof searchResult>();
            localSearchServiceMock.searchLocalPosts.mockReturnValue(restoredSearchRequest.promise);
            const secondView = render(PostHistoryDialog, {
                props: {
                    show: true,
                    onClose: vi.fn(),
                    pubkeyHex: PUBKEY_HEX,
                },
            });

            await waitFor(() => {
                expect(screen.getByText('保存済み検索結果')).toBeTruthy();
            });
            expect(postMediaCacheServiceMock.prefetchCachedMediaDescriptors).not.toHaveBeenCalled();

            await waitFor(() => {
                expect(localSearchServiceMock.searchLocalPosts).toHaveBeenCalled();
            });
            await Promise.resolve();
            await Promise.resolve();
            await Promise.resolve();

            await animationFrames.flushFrame();
            expect(postMediaCacheServiceMock.prefetchCachedMediaDescriptors).not.toHaveBeenCalled();

            await animationFrames.flushFrame();
            await waitFor(() => {
                expect(postMediaCacheServiceMock.prefetchCachedMediaDescriptors)
                    .toHaveBeenCalledTimes(1);
                expect(postMediaCacheServiceMock.prefetchCachedMediaDescriptors)
                    .toHaveBeenCalledWith([mediaUrl]);
            });

            restoredSearchRequest.resolve(searchResult);
            await waitFor(() => {
                expect(screen.getByText('保存済み検索結果')).toBeTruthy();
            });
            expect(postMediaCacheServiceMock.prefetchCachedMediaDescriptors)
                .toHaveBeenCalledTimes(1);
            secondView.unmount();
        } finally {
            animationFrames.restore();
        }
    });

    it('保存済み検索snapshotのdouble RAF中にquery変更・closeを行うと古いprefetchを開始しない', async () => {
        postMediaCacheServiceMock.canUsePersistentCache.mockReturnValue(true);
        const alphaUrl = 'https://example.com/snapshot-alpha.jpg';
        const alphaPost = createRecord({
            eventId: 'snapshot-alpha',
            content: 'snapshot alpha',
            media: [{ url: alphaUrl, mimeType: 'image/jpeg' }],
        });
        await persistSearchSnapshot('alpha', alphaPost);

        const alphaRequest = createDeferred<{
            items: ReturnType<typeof createRecord>[];
            total: number;
            hasNext: boolean;
        }>();
        localSearchServiceMock.searchLocalPosts.mockReturnValue(alphaRequest.promise);
        postMediaCacheServiceMock.prefetchCachedMediaDescriptors.mockClear();
        const animationFrames = controlAnimationFrames();
        try {
            const view = render(PostHistoryDialog, {
                props: {
                    show: true,
                    onClose: vi.fn(),
                    pubkeyHex: PUBKEY_HEX,
                },
            });
            await waitFor(() => expect(screen.getByText('snapshot alpha')).toBeTruthy());
            await waitFor(() => {
                expect(localSearchServiceMock.searchLocalPosts).toHaveBeenCalled();
            });
            await Promise.resolve();
            await Promise.resolve();
            await Promise.resolve();
            await animationFrames.flushFrame();

            const searchInput = await openSearchBar();
            await fireEvent.input(searchInput, { target: { value: 'beta' } });
            await waitForSearchDebounce();
            await animationFrames.flushFrame();
            expect(postMediaCacheServiceMock.prefetchCachedMediaDescriptors).not.toHaveBeenCalled();

            await view.rerender({
                show: false,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
            });
            await animationFrames.flushFrame();
            expect(postMediaCacheServiceMock.prefetchCachedMediaDescriptors).not.toHaveBeenCalled();
            alphaRequest.resolve({ items: [alphaPost], total: 1, hasNext: false });
            view.unmount();
        } finally {
            animationFrames.restore();
        }
    });

    it('保存済み検索snapshotのdouble RAF中にpubkeyを変更すると旧pubkeyのprefetchを開始しない', async () => {
        postMediaCacheServiceMock.canUsePersistentCache.mockReturnValue(true);
        const alphaPost = createRecord({
            eventId: 'snapshot-pubkey-alpha',
            content: 'snapshot pubkey alpha',
            media: [{ url: 'https://example.com/snapshot-pubkey-alpha.jpg', mimeType: 'image/jpeg' }],
        });
        await persistSearchSnapshot('alpha', alphaPost);

        const alphaRequest = createDeferred<{
            items: ReturnType<typeof createRecord>[];
            total: number;
            hasNext: boolean;
        }>();
        localSearchServiceMock.searchLocalPosts.mockReturnValue(alphaRequest.promise);
        postMediaCacheServiceMock.prefetchCachedMediaDescriptors.mockClear();
        const animationFrames = controlAnimationFrames();
        try {
            const view = render(PostHistoryDialog, {
                props: {
                    show: true,
                    onClose: vi.fn(),
                    pubkeyHex: PUBKEY_HEX,
                },
            });
            await waitFor(() => expect(screen.getByText('snapshot pubkey alpha')).toBeTruthy());
            await waitFor(() => {
                expect(localSearchServiceMock.searchLocalPosts).toHaveBeenCalled();
            });
            await Promise.resolve();
            await Promise.resolve();
            await Promise.resolve();
            await animationFrames.flushFrame();

            await view.rerender({
                show: true,
                onClose: vi.fn(),
                pubkeyHex: 'b'.repeat(64),
            });
            await animationFrames.flushFrame();
            expect(postMediaCacheServiceMock.prefetchCachedMediaDescriptors).not.toHaveBeenCalled();
            alphaRequest.resolve({ items: [alphaPost], total: 1, hasNext: false });
            view.unmount();
        } finally {
            animationFrames.restore();
        }
    });

    it('保存済み検索snapshotの再構築結果が異なるmedia URLなら現在結果だけを追加prefetchする', async () => {
        postMediaCacheServiceMock.canUsePersistentCache.mockReturnValue(true);
        const oldUrl = 'https://example.com/snapshot-old.jpg';
        const newUrl = 'https://example.com/snapshot-new.jpg';
        const oldPost = createRecord({
            eventId: 'snapshot-old',
            content: 'snapshot old',
            media: [{ url: oldUrl, mimeType: 'image/jpeg' }],
        });
        const newPost = createRecord({
            eventId: 'snapshot-new',
            content: 'snapshot new',
            media: [{ url: newUrl, mimeType: 'image/jpeg' }],
        });
        await persistSearchSnapshot('alpha', oldPost);

        const rebuiltRequest = createDeferred<{
            items: ReturnType<typeof createRecord>[];
            total: number;
            hasNext: boolean;
        }>();
        localSearchServiceMock.searchLocalPosts.mockReturnValue(rebuiltRequest.promise);
        postMediaCacheServiceMock.prefetchCachedMediaDescriptors.mockClear();
        const animationFrames = controlAnimationFrames();
        try {
            const view = render(PostHistoryDialog, {
                props: {
                    show: true,
                    onClose: vi.fn(),
                    pubkeyHex: PUBKEY_HEX,
                },
            });
            await waitFor(() => expect(screen.getByText('snapshot old')).toBeTruthy());
            await waitFor(() => {
                expect(localSearchServiceMock.searchLocalPosts).toHaveBeenCalled();
            });
            await Promise.resolve();
            await Promise.resolve();
            await Promise.resolve();
            await animationFrames.flushFrame();
            await animationFrames.flushFrame();
            await waitFor(() => {
                expect(postMediaCacheServiceMock.prefetchCachedMediaDescriptors)
                    .toHaveBeenCalledWith([oldUrl]);
            });

            rebuiltRequest.resolve({ items: [newPost], total: 1, hasNext: false });
            await waitFor(() => {
                expect(screen.getByText('snapshot new')).toBeTruthy();
                expect(postMediaCacheServiceMock.prefetchCachedMediaDescriptors)
                    .toHaveBeenCalledWith([newUrl]);
            });
            expect(postMediaCacheServiceMock.prefetchCachedMediaDescriptors)
                .toHaveBeenCalledTimes(2);
            view.unmount();
        } finally {
            animationFrames.restore();
        }
    });

    it('検索中の古い側移動は relay older fetch を呼ばずローカル検索ページだけ進める', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getLatestVisibleChunk.mockResolvedValueOnce([
            createRecord({ eventId: 'search-relay-normal', content: '通常一覧' }),
        ]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValueOnce([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValueOnce([]);
        localSearchServiceMock.searchLocalPosts.mockImplementation(
            async ({ page }: { page: number }) => ({
                items: [createRecord({
                    eventId: `search-page-${page}`,
                    content: `search-page-${page}`,
                })],
                total: 60,
                hasNext: page === 1,
            }),
        );

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
            },
        });

        const searchInput = await openSearchBar();
        await fireEvent.input(searchInput, { target: { value: 'alpha' } });
        await waitForSearchDebounce();

        await fireEvent.click(screen.getByRole('button', { name: 'さらに古い検索結果を表示' }));

        await waitFor(() => {
            expect(localSearchServiceMock.searchLocalPosts).toHaveBeenLastCalledWith({
                pubkeyHex: PUBKEY_HEX,
                query: 'alpha',
                page: 2,
                pageSize: 50,
            });
            expect(screen.getByText('search-page-2')).toBeTruthy();
            expect(relayFetchServiceMock.fetchLatest).not.toHaveBeenCalled();
            expect(replyRepairServiceMock.repairVisibleRangeChildInteractions).not.toHaveBeenCalled();
        });

        view.unmount();
    });

    it('検索結果投稿のメニューから投稿の日付へ飛ぶと検索を閉じて通常履歴へ移動する', async () => {
        const jumpCreatedAt = 1_690_100_000;

        repositoryMock.countForPubkey.mockResolvedValue(2);
        repositoryMock.getLatestVisibleChunk.mockResolvedValueOnce([
            createRecord({ eventId: 'normal-timeline', content: '通常履歴' }),
        ]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValueOnce([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValueOnce([]);
        localSearchServiceMock.searchLocalPosts.mockResolvedValue({
            items: [
                createRecord({
                    eventId: 'search-hit',
                    content: '検索ヒット',
                    createdAt: jumpCreatedAt,
                }),
            ],
            total: 1,
            hasNext: false,
        });
        repositoryMock.getVisibleChunkFromCreatedAt.mockResolvedValueOnce([
            createRecord({
                eventId: 'jumped-timeline',
                content: '日付ジャンプ後',
                createdAt: jumpCreatedAt,
            }),
        ]);

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
            },
        });

        const searchInput = await openSearchBar();
        await fireEvent.input(searchInput, { target: { value: 'hit' } });
        await waitForSearchDebounce();

        await waitFor(() => {
            expect(screen.getByText('検索ヒット')).toBeTruthy();
        });

        const actionTrigger = screen.getAllByRole('button', { name: 'アクションを表示' })[0];
        await fireEvent.click(actionTrigger);
        await fireEvent.click(await screen.findByRole('menuitem', { name: '投稿の日付へ飛ぶ' }));

        await waitFor(() => {
            expect(repositoryMock.getVisibleChunkFromCreatedAt).toHaveBeenCalledWith({
                pubkeyHex: PUBKEY_HEX,
                visibleUntil: null,
                createdAt: jumpCreatedAt,
                limit: 50,
            });
            expect(screen.queryByRole('searchbox', { name: '検索' })).toBeNull();
            expect(screen.getByText('日付ジャンプ後')).toBeTruthy();
        });

        view.unmount();
    });

    it('contiguous 表示中の検索を閉じて reopen した場合は既存の検索復元を維持する', async () => {
        let searchDataRevision = 0;
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getLatestVisibleChunk.mockResolvedValueOnce([
            createRecord({ eventId: 'search-reopen-normal', content: '検索復元前の通常一覧' }),
        ]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValueOnce([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValueOnce([]);
        localSearchServiceMock.searchLocalPosts.mockImplementation(
            async ({ page }: { page: number }) => ({
                items: searchDataRevision === 0
                    ? [createRecord({
                        eventId: `search-reopen-hit-${page}`,
                        content: `reopen 検索結果 ${page}`,
                    })]
                    : page === 1
                        ? [
                            createRecord({
                                eventId: 'search-reopen-newest-hit',
                                content: 'reopen 新しい先頭結果',
                            }),
                            createRecord({
                                eventId: 'search-reopen-hit-1',
                                content: 'reopen 検索結果 1',
                            }),
                        ]
                        : [createRecord({
                            eventId: 'search-reopen-hit-2',
                            content: 'reopen 検索結果 2',
                        })],
                total: 100,
                hasNext: page === 1,
            }),
        );

        const onClose = vi.fn();
        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose,
                pubkeyHex: PUBKEY_HEX,
            },
        });

        const searchInput = await openSearchBar();
        await fireEvent.input(searchInput, { target: { value: 'alpha' } });
        await waitForSearchDebounce();

        await waitFor(() => {
            expect(screen.getByText('reopen 検索結果 1')).toBeTruthy();
        });

        await fireEvent.click(screen.getByRole('button', { name: 'さらに古い検索結果を表示' }));
        await waitFor(() => {
            expect(screen.getByText('reopen 検索結果 2')).toBeTruthy();
        });

        repositoryMock.getLatestVisibleChunk.mockClear();
        localSearchServiceMock.searchLocalPosts.mockClear();

        await fireEvent.click(screen.getByRole('button', { name: '閉じる' }));
        await waitFor(() => {
            expect(onClose).toHaveBeenCalledTimes(1);
        });
        searchDataRevision = 1;

        expect(readPersistedPostHistoryViewState(PUBKEY_HEX)).toEqual({
            currentPage: 1,
            searchPage: 2,
            searchInput: 'alpha',
            searchQuery: 'alpha',
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
            expect(screen.getByText('reopen 新しい先頭結果')).toBeTruthy();
            expect(screen.getByText('reopen 検索結果 1')).toBeTruthy();
            expect(screen.getByText('reopen 検索結果 2')).toBeTruthy();
        });

        expect(repositoryMock.getLatestVisibleChunk).not.toHaveBeenCalled();
        expect(localSearchServiceMock.searchLocalPosts.mock.calls.map(([args]) => args.page))
            .toEqual([1, 2]);
        expect(screen.queryByText('reopen 検索結果 3')).toBeNull();
        expect(
            [...document.querySelectorAll<HTMLElement>('.post-history-item')]
                .map((element) => element.dataset.postHistoryEventId),
        ).toEqual([
            'search-reopen-newest-hit',
            'search-reopen-hit-1',
            'search-reopen-hit-2',
        ]);

        view.unmount();
    });

    it('検索終了時に検索読み込みを無効化し、通常履歴の古い投稿表示を制限しない', async () => {
        const delayedPage = createDeferred<{
            items: ReturnType<typeof createRecord>[];
            total: number;
            hasNext: boolean;
        }>();
        repositoryMock.countForPubkey.mockResolvedValue(2);
        repositoryMock.getLatestVisibleChunk.mockResolvedValueOnce([
            createRecord({ eventId: 'search-close-newest', content: '通常の最新投稿' }),
        ]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValueOnce([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValueOnce([
            createRecord({ eventId: 'search-close-older', content: '通常の古い投稿' }),
        ]);
        localSearchServiceMock.searchLocalPosts.mockImplementation(
            async ({ page }: { page: number }) => page === 1
                ? {
                    items: [createRecord({ eventId: 'search-close-page-1', content: '検索結果1' })],
                    total: 100,
                    hasNext: true,
                }
                : delayedPage.promise,
        );

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
            },
        });

        const searchInput = await openSearchBar();
        await fireEvent.input(searchInput, { target: { value: 'alpha' } });
        await waitForSearchDebounce();
        await waitFor(() => {
            expect(screen.getByText('検索結果1')).toBeTruthy();
        });

        await fireEvent.click(screen.getByRole('button', { name: 'さらに古い検索結果を表示' }));
        await waitFor(() => {
            expect(localSearchServiceMock.searchLocalPosts).toHaveBeenLastCalledWith({
                pubkeyHex: PUBKEY_HEX,
                query: 'alpha',
                page: 2,
                pageSize: 50,
            });
        });

        await fireEvent.click(screen.getByRole('button', { name: '検索を閉じる' }));
        const loadOlderButton = await screen.findByRole('button', { name: 'さらに古い投稿を表示' });
        expect(loadOlderButton.hasAttribute('disabled')).toBe(false);
        expect(screen.getByText('通常の最新投稿')).toBeTruthy();

        delayedPage.resolve({
            items: [createRecord({ eventId: 'search-close-page-2', content: '遅延検索結果2' })],
            total: 100,
            hasNext: false,
        });
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(screen.queryByText('遅延検索結果2')).toBeNull();
        expect(screen.getByText('通常の最新投稿')).toBeTruthy();

        view.unmount();
    });

    it('検索入力を空にした時も遅延検索結果を通常履歴へ適用しない', async () => {
        const delayedPage = createDeferred<{
            items: ReturnType<typeof createRecord>[];
            total: number;
            hasNext: boolean;
        }>();
        repositoryMock.countForPubkey.mockResolvedValue(2);
        repositoryMock.getLatestVisibleChunk.mockResolvedValueOnce([
            createRecord({ eventId: 'search-clear-newest', content: '空検索の通常最新投稿' }),
        ]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValueOnce([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValueOnce([
            createRecord({ eventId: 'search-clear-older', content: '空検索の通常古い投稿' }),
        ]);
        localSearchServiceMock.searchLocalPosts.mockImplementation(
            async ({ page }: { page: number }) => page === 1
                ? {
                    items: [createRecord({ eventId: 'search-clear-page-1', content: '空検索前の結果' })],
                    total: 100,
                    hasNext: true,
                }
                : delayedPage.promise,
        );

        const view = render(PostHistoryDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                pubkeyHex: PUBKEY_HEX,
            },
        });
        const searchInput = await openSearchBar();
        await fireEvent.input(searchInput, { target: { value: 'alpha' } });
        await waitForSearchDebounce();
        await waitFor(() => expect(screen.getByText('空検索前の結果')).toBeTruthy());
        await fireEvent.click(screen.getByRole('button', { name: 'さらに古い検索結果を表示' }));
        await waitFor(() => expect(localSearchServiceMock.searchLocalPosts).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 })));

        await fireEvent.input(searchInput, { target: { value: '' } });
        await waitForSearchDebounce();
        const loadOlderButton = await screen.findByRole('button', { name: 'さらに古い投稿を表示' });
        expect(loadOlderButton.hasAttribute('disabled')).toBe(false);
        expect(screen.getByText('空検索の通常最新投稿')).toBeTruthy();

        delayedPage.resolve({
            items: [createRecord({ eventId: 'search-clear-page-2', content: '適用されない遅延結果' })],
            total: 100,
            hasNext: false,
        });
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(screen.queryByText('適用されない遅延結果')).toBeNull();
        expect(screen.getByText('空検索の通常最新投稿')).toBeTruthy();

        view.unmount();
    });
});
