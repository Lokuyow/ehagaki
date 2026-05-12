import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import {
    PUBKEY_HEX,
    PostHistoryDialog,
    cleanupPostHistoryDialogHarness,
    createRecord,
    localSearchServiceMock,
    openSearchBar,
    postMediaCacheServiceMock,
    relayFetchServiceMock,
    repositoryMock,
    resetPostHistoryDialogHarness,
    waitForSearchDebounce,
} from './postHistoryDialogTestHarness';

describe('PostHistoryDialog timeline search', () => {
    beforeEach(() => {
        resetPostHistoryDialogHarness();
    });

    afterEach(() => {
        cleanupPostHistoryDialogHarness();
    });

    it('検索結果は古い側と新しい側へローカル移動する', async () => {
        repositoryMock.countForPubkey.mockResolvedValue(1);
        repositoryMock.getLatestVisibleChunk.mockResolvedValueOnce([
            createRecord({ eventId: 'search-normal', content: '通常一覧' }),
        ]);
        repositoryMock.getNewerVisibleChunk.mockResolvedValueOnce([]);
        repositoryMock.getOlderVisibleChunk.mockResolvedValueOnce([]);
        localSearchServiceMock.searchLocalPosts.mockImplementation(
            async ({ page }: { page: number }) => ({
                items: [createRecord({ eventId: `search-page-${page}`, content: `search-page-${page}` })],
                total: 51,
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
            expect(screen.getByText('search-page-2')).toBeTruthy();
            expect(screen.getByRole('button', { name: '新しい検索結果を表示' })).toBeTruthy();
        });

        await fireEvent.click(screen.getByRole('button', { name: '新しい検索結果を表示' }));

        await waitFor(() => {
            expect(localSearchServiceMock.searchLocalPosts).toHaveBeenLastCalledWith({
                pubkeyHex: PUBKEY_HEX,
                query: 'alpha',
                page: 1,
                pageSize: 50,
            });
            expect(screen.getByText('search-page-1')).toBeTruthy();
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
                .toHaveBeenLastCalledWith(['https://example.com/media-2.jpg']);
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
        });

        view.unmount();
    });
});