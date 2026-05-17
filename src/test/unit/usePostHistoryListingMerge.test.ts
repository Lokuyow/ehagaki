import { describe, expect, it } from 'vitest';
import { mergeOlderVisiblePosts } from '../../lib/hooks/usePostHistoryListing.svelte';

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

        const result = mergeOlderVisiblePosts({
            currentPosts,
            olderPosts,
            anchorEventId: currentPosts[120].eventId,
            maxVisiblePosts: 150,
            keepAbove: 50,
        });

        expect(result.posts).toHaveLength(150);
        expect(result.posts.some((post) => post.eventId === currentPosts[120].eventId)).toBe(true);
        expect(result.didTrimForOlderAppend).toBe(true);
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
});
