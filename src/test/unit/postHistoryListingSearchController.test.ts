import { beforeEach, describe, expect, it, vi } from 'vitest';

const searchMocks = vi.hoisted(() => ({
    searchLocalPosts: vi.fn(),
}));

vi.mock('../../lib/postHistoryLocalSearchService', () => ({
    postHistoryLocalSearchService: searchMocks,
}));

import {
    createPostHistoryListingSearchController,
    type PostHistoryListingSearchControllerDeps,
    type PostHistoryListingSearchState,
} from '../../lib/postHistoryListingSearchController';
import type { PostHistoryLocalLoadStatus } from '../../lib/hooks/usePostHistoryListing.svelte';
import type { PostHistoryRecord } from '../../lib/storage/ehagakiDb';

const OWNER = 'a'.repeat(64);

function post(eventId: string): PostHistoryRecord {
    return { eventId } as PostHistoryRecord;
}

function page(items: PostHistoryRecord[], total: number, hasNext: boolean) {
    return { items, total, hasNext };
}

function createHarness(overrides: Partial<PostHistoryListingSearchControllerDeps> = {}) {
    let searchLoadRequestId = 0;
    const statuses: PostHistoryLocalLoadStatus[] = [];
    const loading: boolean[] = [];
    const state: PostHistoryListingSearchState = {
        searchQuery: 'hello',
        searchPosts: [],
        searchTotalCount: 0,
        searchTotalCountKnown: false,
        searchHasNext: false,
        searchPage: 1,
    };
    const deps: PostHistoryListingSearchControllerDeps = {
        state,
        pageSize: 2,
        getShow: () => true,
        getPubkeyHex: () => OWNER,
        getSearchLoadRequestId: () => searchLoadRequestId,
        beginSearchLoadRequest: () => ++searchLoadRequestId,
        setSearchPageLoading: (value) => loading.push(value),
        setSearchResultStatus: (status) => statuses.push(status),
        hasCompletedFirstPostPaint: () => true,
        waitForFirstPostPaint: vi.fn(async () => true),
        ...overrides,
    };
    return {
        state,
        statuses,
        loading,
        controller: createPostHistoryListingSearchController(deps),
        bumpSearchLoadRequest: () => {
            searchLoadRequestId += 1;
        },
    };
}

describe('createPostHistoryListingSearchController', () => {
    beforeEach(() => {
        searchMocks.searchLocalPosts.mockReset();
    });

    it('1 ページ目で結果を置き換え、次ページでは重複を除いて追加する', async () => {
        const { state, statuses, loading, controller } = createHarness();
        searchMocks.searchLocalPosts
            .mockResolvedValueOnce(page([post('a'), post('b')], 4, true))
            .mockResolvedValueOnce(page([post('b'), post('c')], 4, false));

        await expect(controller.loadSearchPage(1, 'hello')).resolves.toBe(true);
        expect(state.searchPosts.map((item) => item.eventId)).toEqual(['a', 'b']);
        expect(state.searchTotalCount).toBe(4);
        expect(state.searchTotalCountKnown).toBe(true);
        expect(state.searchHasNext).toBe(true);

        await expect(controller.loadSearchPage(2, 'hello')).resolves.toBe(true);
        expect(state.searchPosts.map((item) => item.eventId)).toEqual(['a', 'b', 'c']);
        expect(state.searchPage).toBe(2);
        expect(state.searchHasNext).toBe(false);
        expect(statuses).toEqual(['loading', 'ready', 'loading', 'ready']);
        expect(loading).toEqual([true, false, true, false]);
    });

    it('クエリや公開鍵がなければ結果を空にして読み込まない', async () => {
        const { state, controller } = createHarness({ getPubkeyHex: () => null });
        state.searchPosts = [post('a')];
        state.searchTotalCount = 3;

        await expect(controller.loadSearchPage(1, 'hello')).resolves.toBe(false);

        expect(state.searchPosts).toEqual([]);
        expect(state.searchTotalCount).toBe(0);
        expect(searchMocks.searchLocalPosts).not.toHaveBeenCalled();
    });

    it('読み込み中に検索世代が進んだら結果を反映せず、読み込み中表示も残す', async () => {
        const harness = createHarness();
        searchMocks.searchLocalPosts.mockImplementation(async () => {
            harness.bumpSearchLoadRequest();
            return page([post('a')], 1, false);
        });

        await expect(harness.controller.loadSearchPage(1, 'hello')).resolves.toBe(false);

        expect(harness.state.searchPosts).toEqual([]);
        expect(harness.loading).toEqual([true]);
    });

    it('検索に失敗したら failed にする', async () => {
        const { statuses, loading, controller } = createHarness();
        searchMocks.searchLocalPosts.mockRejectedValue(new Error('boom'));

        await expect(controller.loadSearchPage(1, 'hello')).resolves.toBe(false);

        expect(statuses).toEqual(['loading', 'failed']);
        expect(loading).toEqual([true, false]);
    });

    it('総数を超えるページは反映せず、ready に戻す', async () => {
        const { state, statuses, controller } = createHarness();
        searchMocks.searchLocalPosts.mockResolvedValue(page([], 2, false));

        await expect(controller.loadSearchPage(5, 'hello')).resolves.toBe(false);

        expect(state.searchPage).toBe(1);
        expect(statuses).toEqual(['loading', 'ready']);
    });

    it('指定ページまでの結果を 1 ページ目から作り直す', async () => {
        const { state, controller } = createHarness();
        searchMocks.searchLocalPosts
            .mockResolvedValueOnce(page([post('a'), post('b')], 5, true))
            .mockResolvedValueOnce(page([post('c'), post('d')], 5, true))
            .mockResolvedValueOnce(page([post('e')], 5, false));

        await expect(controller.rebuildSearchResultsThroughPage(3, 'hello')).resolves.toBe(true);

        expect(searchMocks.searchLocalPosts.mock.calls.map(([input]) => input.page)).toEqual([1, 2, 3]);
        expect(state.searchPosts.map((item) => item.eventId)).toEqual(['a', 'b', 'c', 'd', 'e']);
        expect(state.searchPage).toBe(3);
        expect(state.searchHasNext).toBe(false);
    });

    it('isCurrentSearchLoad は世代、表示、公開鍵、クエリがすべて一致するときだけ真になる', () => {
        const { controller, bumpSearchLoadRequest } = createHarness();
        bumpSearchLoadRequest();

        expect(controller.isCurrentSearchLoad(1, 'hello', OWNER)).toBe(true);
        expect(controller.isCurrentSearchLoad(0, 'hello', OWNER)).toBe(false);
        expect(controller.isCurrentSearchLoad(1, 'other', OWNER)).toBe(false);
        expect(controller.isCurrentSearchLoad(1, 'hello', 'b'.repeat(64))).toBe(false);
    });
});
