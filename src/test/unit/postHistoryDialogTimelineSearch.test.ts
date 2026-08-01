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
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getLatestVisibleChunk.mockResolvedValueOnce([
            createRecord({ eventId: 'search-reopen-normal', content: '検索復元前の通常一覧' }),
        ]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValueOnce([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValueOnce([]);
        localSearchServiceMock.searchLocalPosts.mockImplementation(
            async ({ page }: { page: number }) => ({
                items: [createRecord({
                    eventId: `search-reopen-hit-${page}`,
                    content: `reopen 検索結果 ${page}`,
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
            expect(screen.getByText('reopen 検索結果 1')).toBeTruthy();
            expect(screen.getByText('reopen 検索結果 2')).toBeTruthy();
        });

        expect(repositoryMock.getLatestVisibleChunk).not.toHaveBeenCalled();
        expect(localSearchServiceMock.searchLocalPosts).toHaveBeenCalledWith({
            pubkeyHex: PUBKEY_HEX,
            query: 'alpha',
            page: 2,
            pageSize: 50,
        });

        view.unmount();
    });
});
