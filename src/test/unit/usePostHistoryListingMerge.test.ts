import { describe, expect, it } from 'vitest';
import {
    mergeOlderVisiblePosts,
    POST_HISTORY_OLDER_REVEAL_REPLY_REPAIR_FRESHNESS_TTL_MS,
    resolveNewlyVisibleOlderPosts,
    resolveOlderRevealChildInteractionRepairNetworkParentIds,
    resolveVisibleOlderRevealChildInteractionRepairParentPosts,
} from '../../lib/hooks/usePostHistoryListing.svelte';

function createPost(index: number) {
    return {
        id: `event-${index}`,
        eventId: `event-${index}`,
        pubkeyHex: 'a'.repeat(64),
        kind: 1,
        content: `post-${index}`,
        tags: [],
        createdAt: 10_000 - index,
        postedAt: 10_000 - index,
        relayHints: [],
        acceptedRelays: [],
        media: [],
        rawEvent: {},
        updatedAt: 10_000 - index,
        schemaVersion: 2,
    };
}

describe('mergeOlderVisiblePosts', () => {
    it('beforeLength が maxVisiblePosts 未満で olderPosts が収まる場合は trim せず末尾追加する', () => {
        const currentPosts = Array.from({ length: 128 }, (_, index) => createPost(index));
        const olderPosts = Array.from({ length: 10 }, (_, index) => createPost(200 + index));

        const result = mergeOlderVisiblePosts({
            currentPosts,
            olderPosts,
            anchorEventId: currentPosts[80].eventId,
            maxVisiblePosts: 150,
            keepAbove: 50,
        });

        expect(result.posts).toHaveLength(138);
        expect(result.posts.slice(0, 128).map((post) => post.eventId)).toEqual(
            currentPosts.map((post) => post.eventId),
        );
        expect(result.posts.slice(128).map((post) => post.eventId)).toEqual(
            olderPosts.map((post) => post.eventId),
        );
        expect(result.didTrimForOlderAppend).toBe(false);
        expect(result.didDeferOlderPosts).toBe(false);
    });

    it('beforeLength が maxVisiblePosts 未満で olderPosts が収まりきらない場合は空き分だけ追加して defer する', () => {
        const currentPosts = Array.from({ length: 128 }, (_, index) => createPost(index));
        const olderPosts = Array.from({ length: 30 }, (_, index) => createPost(200 + index));

        const result = mergeOlderVisiblePosts({
            currentPosts,
            olderPosts,
            anchorEventId: currentPosts[80].eventId,
            maxVisiblePosts: 150,
            keepAbove: 50,
        });

        expect(result.posts).toHaveLength(150);
        expect(result.posts.slice(0, 128).map((post) => post.eventId)).toEqual(
            currentPosts.map((post) => post.eventId),
        );
        expect(result.posts.slice(128).map((post) => post.eventId)).toEqual(
            olderPosts.slice(0, 22).map((post) => post.eventId),
        );
        expect(result.didTrimForOlderAppend).toBe(false);
        expect(result.didDeferOlderPosts).toBe(true);
    });

    it('maxVisiblePosts を超える場合だけ anchor 保護 trim を行う', () => {
        const currentPosts = Array.from({ length: 150 }, (_, index) => createPost(index));
        const olderPosts = Array.from({ length: 20 }, (_, index) => createPost(300 + index));
        const anchor = currentPosts[120];

        const result = mergeOlderVisiblePosts({
            currentPosts,
            olderPosts,
            anchorEventId: anchor.eventId,
            maxVisiblePosts: 150,
            keepAbove: 50,
        });
        const anchorIndexAfterTrim = result.posts.findIndex(
            (post) => post.eventId === anchor.eventId,
        );

        expect(result.posts).toHaveLength(150);
        expect(anchorIndexAfterTrim).toBeGreaterThan(0);
        expect(anchorIndexAfterTrim).toBeLessThan(result.posts.length - 1);
        expect(result.posts[anchorIndexAfterTrim - 1]?.eventId).toBe(currentPosts[119].eventId);
        expect(result.posts[anchorIndexAfterTrim + 1]?.eventId).toBe(currentPosts[121].eventId);
        expect(result.posts.some((post) => post.eventId === olderPosts[0].eventId)).toBe(true);
        expect(result.didTrimForOlderAppend).toBe(true);
    });

    it('currentPosts が maxVisiblePosts 未満の場合は合計が上限を超えても既存投稿を trim しない', () => {
        const currentPosts = Array.from({ length: 149 }, (_, index) => createPost(index));
        const olderPosts = Array.from({ length: 5 }, (_, index) => createPost(400 + index));

        const result = mergeOlderVisiblePosts({
            currentPosts,
            olderPosts,
            anchorEventId: currentPosts[100].eventId,
            maxVisiblePosts: 150,
            keepAbove: 50,
        });

        expect(result.posts).toHaveLength(150);
        expect(result.posts.slice(0, 149).map((post) => post.eventId)).toEqual(
            currentPosts.map((post) => post.eventId),
        );
        expect(result.posts[149]?.eventId).toBe(olderPosts[0].eventId);
        expect(result.didTrimForOlderAppend).toBe(false);
        expect(result.didDeferOlderPosts).toBe(true);
    });

    it('anchor 保護 trim でも末尾の olderPosts を落とした場合は defer 扱いにする', () => {
        const currentPosts = Array.from({ length: 150 }, (_, index) => createPost(index));
        const olderPosts = Array.from({ length: 40 }, (_, index) => createPost(500 + index));

        const result = mergeOlderVisiblePosts({
            currentPosts,
            olderPosts,
            anchorEventId: currentPosts[20].eventId,
            maxVisiblePosts: 150,
            keepAbove: 50,
        });

        expect(result.posts.some((post) => post.eventId === currentPosts[20].eventId)).toBe(true);
        expect(result.didTrimForOlderAppend).toBe(true);
        expect(result.didDeferOlderPosts).toBe(true);
    });

    it('merge 前後の visible eventId 差分から newly visible older posts を取る', () => {
        const currentPosts = [createPost(1), createPost(2), createPost(3)];
        const olderPosts = [createPost(10), createPost(11)];

        const result = mergeOlderVisiblePosts({
            currentPosts,
            olderPosts,
            maxVisiblePosts: 5,
            keepAbove: 2,
        });

        expect(resolveNewlyVisibleOlderPosts(currentPosts, result.posts).map((post) => post.eventId)).toEqual(
            olderPosts.map((post) => post.eventId),
        );
    });

    it('newly visible posts から current visible な owner self direct-reply parents だけ残す', () => {
        const visibleSelf = createPost(10);
        const hiddenSelf = createPost(11);
        const visibleKind42 = {
            ...createPost(12),
            kind: 42,
        };
        const visibleOther = {
            ...createPost(13),
            pubkeyHex: 'b'.repeat(64),
        };

        const result = resolveVisibleOlderRevealChildInteractionRepairParentPosts(
            'a'.repeat(64),
            [visibleSelf, hiddenSelf, visibleKind42, visibleOther],
            [visibleSelf, visibleKind42, visibleOther],
        );

        expect(result).toEqual([visibleSelf, visibleKind42]);
    });

    it('older reveal network candidates は in-flight と freshness TTL を除外する', () => {
        const nowMs = 100_000;
        const freshCheckedAt = nowMs - (POST_HISTORY_OLDER_REVEAL_REPLY_REPAIR_FRESHNESS_TTL_MS - 1_000);
        const staleCheckedAt = nowMs - (POST_HISTORY_OLDER_REVEAL_REPLY_REPAIR_FRESHNESS_TTL_MS + 1_000);

        const result = resolveOlderRevealChildInteractionRepairNetworkParentIds(
            ['fresh-parent', 'stale-parent', 'unchecked-parent', 'inflight-parent'],
            new Map([
                ['fresh-parent', freshCheckedAt],
                ['stale-parent', staleCheckedAt],
            ]),
            new Set(['inflight-parent']),
            nowMs,
        );

        expect(result).toEqual(['stale-parent', 'unchecked-parent']);
    });
});
