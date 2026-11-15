import { describe, expect, it } from 'vitest';
import {
    buildChildrenPrefetchFetchRequest,
    groupVisibleDirectReplyItemsByParent,
    resolvePrefetchedChildrenLoaded,
    selectBatchDirectReplyItems,
} from '../../lib/postHistoryThreadGraphChildPrefetch';
import { buildThreadGraphNode } from '../../lib/postHistoryThreadGraphUtils';
import type { PostHistoryReplyFetchedEvent } from '../../lib/postHistoryReplyFetchService';
import type { NostrEvent } from '../../lib/types';

const OWNER = 'a'.repeat(64);
const REPLIER = 'b'.repeat(64);
const PARENT_A = '1'.repeat(64);
const PARENT_B = '2'.repeat(64);
const OUTSIDE = '9'.repeat(64);

function createEvent(id: string, createdAt: number, tags: string[][] = []): NostrEvent {
    return { id, pubkey: OWNER, kind: 1, content: 'content', tags, created_at: createdAt, sig: '' };
}

function fetched(id: string, parentEventId: string): PostHistoryReplyFetchedEvent {
    return {
        parentEventId,
        event: { ...createEvent(id, 200, [['e', parentEventId, '', 'reply']]), pubkey: REPLIER },
        relayUrls: [],
    };
}

describe('buildChildrenPrefetchFetchRequest', () => {
    it('バッチの親ごとの文脈と、最も古い作成時刻を持つ取得要求を作る', () => {
        const nodeA = buildThreadGraphNode({
            event: createEvent(PARENT_A, 150, [['e', OUTSIDE, 'wss://hint.example.com/', 'root']]),
            relayUrls: ['wss://node-a.example.com'],
            sources: ['anchor'],
        });
        const nodeB = buildThreadGraphNode({
            event: createEvent(PARENT_B, 120),
            relayUrls: [],
            sources: ['anchor'],
        });

        const request = buildChildrenPrefetchFetchRequest({
            batchEventIds: [PARENT_A, PARENT_B],
            batchNodes: [nodeA, nodeB],
            relayHints: ['wss://batch.example.com'],
            relayConfig: null,
        });

        expect(request.eventId).toBe(PARENT_A);
        expect(request.eventIds).toEqual([PARENT_A, PARENT_B]);
        expect(request.createdAt).toBe(120);
        expect(request.relayHints).toEqual(['wss://batch.example.com']);
        expect(request.relayConfig).toBeNull();
        expect(request.parents?.map((parent) => parent.eventId)).toEqual([PARENT_A, PARENT_B]);
        expect(request.parents?.[0]?.relayHints).toEqual(
            expect.arrayContaining(['wss://node-a.example.com', 'wss://hint.example.com/']),
        );
    });

    it('返信の親になれない kind のノードは文脈から外す', () => {
        const reactionNode = buildThreadGraphNode({
            event: { ...createEvent(PARENT_A, 100), kind: 7 },
            relayUrls: [],
            sources: ['anchor'],
        });

        const request = buildChildrenPrefetchFetchRequest({
            batchEventIds: [PARENT_A],
            batchNodes: [reactionNode],
            relayHints: [],
            relayConfig: null,
        });

        expect(request.parents).toEqual([]);
    });
});

describe('selectBatchDirectReplyItems', () => {
    it('バッチ外の親と、自分自身を親とする項目を除く', () => {
        const inBatch = fetched('3'.repeat(64), PARENT_A);
        const outside = fetched('4'.repeat(64), OUTSIDE);
        const selfReference = fetched(PARENT_B, PARENT_B);

        expect(selectBatchDirectReplyItems([inBatch, outside, selfReference], [PARENT_A, PARENT_B]))
            .toEqual([inBatch]);
    });
});

describe('groupVisibleDirectReplyItemsByParent', () => {
    it('表示対象の項目を、絞り込み前の項目から引いた親ごとにまとめる', () => {
        const replyA1 = fetched('3'.repeat(64), PARENT_A);
        const replyA2 = fetched('4'.repeat(64), PARENT_A);
        const replyB = fetched('5'.repeat(64), PARENT_B);
        const hidden = fetched('6'.repeat(64), PARENT_B);
        const unknown = { event: { id: '7'.repeat(64) } };

        const grouped = groupVisibleDirectReplyItemsByParent<{ event: { id: string } }>({
            batchEventIds: [PARENT_A, PARENT_B],
            directReplyItems: [replyA1, replyA2, replyB, hidden],
            visibleItems: [replyA1, replyB, replyA2, unknown],
        });

        expect(Array.from(grouped.keys())).toEqual([PARENT_A, PARENT_B]);
        expect(grouped.get(PARENT_A)).toEqual([replyA1, replyA2]);
        expect(grouped.get(PARENT_B)).toEqual([replyB]);
    });

    it('バッチ外の親に属する項目は含めない', () => {
        const outside = fetched('3'.repeat(64), OUTSIDE);

        const grouped = groupVisibleDirectReplyItemsByParent({
            batchEventIds: [PARENT_A],
            directReplyItems: [outside],
            visibleItems: [outside],
        });

        expect(grouped.size).toBe(0);
    });
});

describe('resolvePrefetchedChildrenLoaded', () => {
    it('完全な取得時刻があるか、表示中の子がいれば読み込み済みとする', () => {
        expect(resolvePrefetchedChildrenLoaded({ effectiveFetchedAt: 10, visibleChildCount: 0 })).toBe(true);
        expect(resolvePrefetchedChildrenLoaded({ effectiveFetchedAt: null, visibleChildCount: 2 })).toBe(true);
        expect(resolvePrefetchedChildrenLoaded({ effectiveFetchedAt: null, visibleChildCount: 0 })).toBe(false);
    });
});
