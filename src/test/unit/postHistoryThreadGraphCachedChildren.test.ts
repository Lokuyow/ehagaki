import { describe, expect, it } from 'vitest';
import {
    applyCachedChildInteractionBatch,
    groupCachedChildInteractionRecords,
    resolveCachedReplyFetchedAt,
    resolveEffectiveDirectReplyFetchedAt,
    uniqueEventIds,
    type CachedChildInteractionBatchInput,
    type ThreadGraphCachedChildState,
} from '../../lib/postHistoryThreadGraphCachedChildren';
import { buildAnchorNodeKey, buildThreadGraphNode } from '../../lib/postHistoryThreadGraphUtils';
import type { PostHistoryChildInteractionRecord, PostHistoryRecord } from '../../lib/storage/ehagakiDb';
import type { PostHistoryDirectReplyFetchMetadata } from '../../lib/storage/postHistoryDirectReplyFetchMetadataRepository';
import type { NostrEvent } from '../../lib/types';

const OWNER = 'a'.repeat(64);
const REPLIER = 'b'.repeat(64);
const PARENT_ID = '1'.repeat(64);

function eventId(seed: string): string {
    return seed.repeat(64).slice(0, 64);
}

function createEvent(id: string, pubkey: string, createdAt: number, tags: string[][] = []): NostrEvent {
    return { id, pubkey, kind: 1, content: `content ${id.slice(0, 4)}`, tags, created_at: createdAt, sig: '' };
}

function createReplyRecord(
    id: string,
    createdAt: number,
    overrides: Partial<PostHistoryChildInteractionRecord> = {},
): PostHistoryChildInteractionRecord {
    return {
        id: `reply:${id}`,
        eventId: id,
        parentEventId: PARENT_ID,
        authorPubkey: REPLIER,
        kind: 1,
        content: 'reply',
        tags: [['e', PARENT_ID, '', 'reply']],
        createdAt,
        relayUrls: [],
        discoveredAs: ['reply'],
        rawEvent: null,
        fetchedAt: createdAt * 1000,
        updatedAt: createdAt * 1000,
        schemaVersion: 1,
        ...overrides,
    };
}

function createMetadata(
    overrides: Partial<PostHistoryDirectReplyFetchMetadata> = {},
): PostHistoryDirectReplyFetchMetadata {
    return {
        parentEventId: PARENT_ID,
        completeness: 'complete',
        fetchedAt: 9_000,
        requestStartedAt: 8_000,
        updatedAt: 9_000,
        schemaVersion: 1,
        ...overrides,
    };
}

function createState(overrides: Partial<ThreadGraphCachedChildState> = {}): ThreadGraphCachedChildState {
    return {
        nodesById: {},
        parentByChildId: {},
        childrenByParentId: {},
        expansionByAnchorNodeKey: {},
        reactionSummaryByParentId: {},
        reactionRecordsByParentId: {},
        reactionProfilesByPubkey: {},
        reactionReadModelByParentId: {},
        deletedEventIdsByPubkey: {},
        ...overrides,
    };
}

function createInput(overrides: Partial<CachedChildInteractionBatchInput> = {}): CachedChildInteractionBatchInput {
    const anchorNode = buildThreadGraphNode({
        event: createEvent(PARENT_ID, OWNER, 100),
        relayUrls: [],
        sources: ['anchor'],
    });
    return {
        postsByParentId: new Map([[PARENT_ID, { eventId: PARENT_ID } as PostHistoryRecord]]),
        targetParentIds: [PARENT_ID],
        anchorNodesByParentId: new Map([[PARENT_ID, anchorNode]]),
        reactionRecordsByParentId: new Map(),
        directReplyRecordsByParentId: new Map(),
        metadataByParentId: new Map(),
        metadataReadFailedParentIds: new Set(),
        cachedReactionProfilesByPubkey: {},
        knownNodeProfilesByPubkey: new Map(),
        ...overrides,
    };
}

const EXPANSION_KEY = buildAnchorNodeKey(PARENT_ID, PARENT_ID);

describe('スレッドグラフのキャッシュ補助', () => {
    it('uniqueEventIds は重複を除き、最初に現れた順序を保つ', () => {
        expect(uniqueEventIds(['b', 'a', 'b', 'c', 'a'])).toEqual(['b', 'a', 'c']);
    });

    it('resolveEffectiveDirectReplyFetchedAt は完全な取得のときだけ時刻を返す', () => {
        expect(resolveEffectiveDirectReplyFetchedAt({ completeness: 'complete', fetchedAt: 5 })).toBe(5);
        expect(resolveEffectiveDirectReplyFetchedAt({ completeness: 'partial', fetchedAt: 5 })).toBeNull();
        expect(resolveEffectiveDirectReplyFetchedAt(null)).toBeNull();
    });

    it('resolveCachedReplyFetchedAt は最も新しい取得時刻を返し、記録がなければ null を返す', () => {
        expect(resolveCachedReplyFetchedAt([
            createReplyRecord(eventId('2'), 10, { fetchedAt: 300 }),
            createReplyRecord(eventId('3'), 11, { fetchedAt: 700 }),
        ])).toBe(700);
        expect(resolveCachedReplyFetchedAt([])).toBeNull();
    });

    it('groupCachedChildInteractionRecords は対象の親だけを集め、作成時刻とIDの順に並べる', () => {
        const otherParent = eventId('9');
        const grouped = groupCachedChildInteractionRecords([
            createReplyRecord(eventId('4'), 30),
            createReplyRecord(eventId('3'), 10),
            createReplyRecord(eventId('2'), 10),
            createReplyRecord(eventId('5'), 5, { parentEventId: otherParent }),
        ], [PARENT_ID]);

        expect([...grouped.keys()]).toEqual([PARENT_ID]);
        expect(grouped.get(PARENT_ID)?.map((record) => record.eventId)).toEqual([
            eventId('2'),
            eventId('3'),
            eventId('4'),
        ]);
    });
});

describe('applyCachedChildInteractionBatch', () => {
    it('キャッシュ済みの返信をノード・親子関係・展開状態へ反映する', () => {
        const older = createReplyRecord(eventId('2'), 10, { fetchedAt: 400 });
        const newer = createReplyRecord(eventId('3'), 20, { fetchedAt: 600 });
        const current = createState();

        const next = applyCachedChildInteractionBatch(current, createInput({
            directReplyRecordsByParentId: new Map([[PARENT_ID, [newer, older]]]),
        }));

        expect(Object.keys(next.nodesById).sort()).toEqual(
            [PARENT_ID, older.eventId, newer.eventId].sort(),
        );
        expect(next.parentByChildId).toEqual({
            [older.eventId]: PARENT_ID,
            [newer.eventId]: PARENT_ID,
        });
        expect(next.childrenByParentId[PARENT_ID]).toEqual([older.eventId, newer.eventId]);
        expect(next.expansionByAnchorNodeKey[EXPANSION_KEY]).toMatchObject({
            loadedChildren: true,
            loadingChildren: false,
            lastFetchedChildrenAt: 600,
        });
        expect(current.nodesById).toEqual({});
    });

    it('削除済みの返信は取り込まない', () => {
        const deleted = createReplyRecord(eventId('2'), 10);
        const kept = createReplyRecord(eventId('3'), 20);

        const next = applyCachedChildInteractionBatch(
            createState({ deletedEventIdsByPubkey: { [REPLIER]: { [deleted.eventId]: true } } }),
            createInput({
                directReplyRecordsByParentId: new Map([[PARENT_ID, [deleted, kept]]]),
            }),
        );

        expect(next.nodesById[deleted.eventId]).toBeUndefined();
        expect(next.childrenByParentId[PARENT_ID]).toEqual([kept.eventId]);
    });

    it('既存の子のうち、削除済みのノードを子の一覧から外す', () => {
        const existing = createReplyRecord(eventId('2'), 10);
        const existingNode = buildThreadGraphNode({
            event: createEvent(existing.eventId, REPLIER, 10),
            relayUrls: [],
            sources: ['reply-db'],
        });

        const next = applyCachedChildInteractionBatch(
            createState({
                nodesById: { [existing.eventId]: existingNode },
                childrenByParentId: { [PARENT_ID]: [existing.eventId] },
                deletedEventIdsByPubkey: { [REPLIER]: { [existing.eventId]: true } },
            }),
            createInput(),
        );

        expect(next.childrenByParentId[PARENT_ID]).toEqual([]);
    });

    it('返信もメタデータもなければ展開状態を変えず、同じオブジェクトを返す', () => {
        const current = createState();

        const next = applyCachedChildInteractionBatch(current, createInput());

        expect(next.expansionByAnchorNodeKey).toBe(current.expansionByAnchorNodeKey);
    });

    it('部分的な取得で返信が 0 件なら、子を未読み込みの状態に戻す', () => {
        const next = applyCachedChildInteractionBatch(createState(), createInput({
            metadataByParentId: new Map([[PARENT_ID, createMetadata({ completeness: 'partial' })]]),
        }));

        expect(next.expansionByAnchorNodeKey[EXPANSION_KEY]).toMatchObject({
            loadedChildren: false,
            loadingChildren: false,
            revalidatingChildren: false,
            childrenError: null,
            lastFetchedChildrenAt: null,
        });
    });

    it('完全な取得のメタデータがあれば、その取得時刻を使う', () => {
        const next = applyCachedChildInteractionBatch(createState(), createInput({
            directReplyRecordsByParentId: new Map([
                [PARENT_ID, [createReplyRecord(eventId('2'), 10, { fetchedAt: 400 })]],
            ]),
            metadataByParentId: new Map([[PARENT_ID, createMetadata({ fetchedAt: 9_000 })]]),
        }));

        expect(next.expansionByAnchorNodeKey[EXPANSION_KEY]?.lastFetchedChildrenAt).toBe(9_000);
    });

    it('メタデータの読み取りに失敗した親は取得時刻を未確定にする', () => {
        const next = applyCachedChildInteractionBatch(createState(), createInput({
            directReplyRecordsByParentId: new Map([
                [PARENT_ID, [createReplyRecord(eventId('2'), 10, { fetchedAt: 400 })]],
            ]),
            metadataReadFailedParentIds: new Set([PARENT_ID]),
        }));

        expect(next.expansionByAnchorNodeKey[EXPANSION_KEY]).toMatchObject({
            loadedChildren: true,
            lastFetchedChildrenAt: null,
        });
    });

    it('対象の親ごとにリアクションの集計と読み取りモデルを作り直す', () => {
        const current = createState();

        const next = applyCachedChildInteractionBatch(current, createInput());

        expect(next.reactionRecordsByParentId[PARENT_ID]).toEqual([]);
        expect(next.reactionSummaryByParentId[PARENT_ID]).toBeDefined();
        expect(next.reactionReadModelByParentId[PARENT_ID]).toBeDefined();
        expect(next.reactionSummaryByParentId).not.toBe(current.reactionSummaryByParentId);
    });

    it('アンカーノードが渡されなかった親は読み飛ばす', () => {
        const current = createState();

        const next = applyCachedChildInteractionBatch(current, createInput({
            anchorNodesByParentId: new Map(),
            directReplyRecordsByParentId: new Map([
                [PARENT_ID, [createReplyRecord(eventId('2'), 10)]],
            ]),
        }));

        expect(next.nodesById).toBe(current.nodesById);
        expect(next.parentByChildId).toBe(current.parentByChildId);
        expect(next.childrenByParentId).toBe(current.childrenByParentId);
    });

    it('既知のプロフィールを同じ著者のノードへ反映する', () => {
        const reply = createReplyRecord(eventId('2'), 10);
        const profile = { name: 'replier' } as NonNullable<
            ThreadGraphCachedChildState['nodesById'][string]['profile']
        >;

        const next = applyCachedChildInteractionBatch(createState(), createInput({
            directReplyRecordsByParentId: new Map([[PARENT_ID, [reply]]]),
            knownNodeProfilesByPubkey: new Map([[REPLIER, profile]]),
        }));

        expect(next.nodesById[reply.eventId]?.profile).toEqual(profile);
        expect(next.nodesById[PARENT_ID]?.profile).toBeNull();
    });
});
