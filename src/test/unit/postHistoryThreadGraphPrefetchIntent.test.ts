import { describe, expect, it, vi } from "vitest";

vi.mock("svelte", async (importOriginal) => ({
    ...await importOriginal<typeof import("svelte")>(),
    onDestroy: vi.fn(),
}));

import type { PostHistoryChildInteractionRecord, PostHistoryRecord } from "../../lib/storage/ehagakiDb";
import type { NostrEvent } from "../../lib/types";
import { createPostHistoryThreadGraphHookHarness } from "../helpers/postHistoryThreadGraphHookHarness.svelte";

const anchorId = "1".repeat(64);
const childId = "2".repeat(64);
const grandchildId = "3".repeat(64);

function createPost(): PostHistoryRecord {
    return {
        id: anchorId,
        eventId: anchorId,
        pubkeyHex: "a".repeat(64),
        kind: 1,
        content: "anchor",
        tags: [],
        createdAt: 100,
        postedAt: 100_000,
        relayHints: [],
        acceptedRelays: [],
        fetchedRelays: [],
        media: [],
        rawEvent: null,
        updatedAt: 100_000,
        schemaVersion: 1,
    };
}

function createReplyEvent(eventId: string, parentEventId: string, createdAt: number): NostrEvent {
    return {
        id: eventId,
        pubkey: "b".repeat(64),
        kind: 1,
        content: eventId === childId ? "child" : "grandchild",
        tags: [["e", parentEventId, "", "reply"]],
        created_at: createdAt,
        sig: "f".repeat(128),
    };
}

function toRecord(event: NostrEvent, parentEventId: string, fetchedAt: number): PostHistoryChildInteractionRecord {
    return {
        id: event.id,
        eventId: event.id,
        parentEventId,
        authorPubkey: event.pubkey,
        kind: event.kind,
        content: event.content,
        tags: event.tags,
        createdAt: event.created_at,
        relayUrls: [],
        discoveredAs: ["direct-reply"],
        rawEvent: event,
        fetchedAt,
        updatedAt: fetchedAt,
        schemaVersion: 1,
    };
}

function createDeferred<T>() {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>((nextResolve) => {
        resolve = nextResolve;
    });
    return { promise, resolve };
}

function createGraph(cachedChildFetchedAt = Date.now()) {
    const post = createPost();
    const childEvent = createReplyEvent(childId, anchorId, 110);
    const grandchildEvent = createReplyEvent(grandchildId, childId, 120);
    const recordsByParent = new Map<string, PostHistoryChildInteractionRecord[]>([
        [anchorId, [toRecord(childEvent, anchorId, cachedChildFetchedAt)]],
    ]);
    const deferred = createDeferred<{
        status: "success";
        events: Array<{ parentEventId: string; event: NostrEvent; relayUrls: string[] }>;
        fetchedAt: number;
        relayUrls: string[];
    }>();
    const fetchDirectReplies = vi.fn((
        _rxNostr: unknown,
        _request: { parents?: Array<{ eventId: string }> },
    ) => ({
        promise: deferred.promise,
        cancel: vi.fn(),
    }));
    const upsertChildInteractions = vi.fn(async (input: {
        parentEventId: string;
        events: Array<{ event: NostrEvent; relayUrls?: string[] }>;
        fetchedAt?: number | null;
    }) => {
        const existing = recordsByParent.get(input.parentEventId) ?? [];
        const next = [...existing];
        for (const item of input.events) {
            if (!next.some((record) => record.eventId === item.event.id)) {
                next.push(toRecord(item.event, input.parentEventId, input.fetchedAt ?? 0));
            }
        }
        recordsByParent.set(input.parentEventId, next);
        return {
            insertedCount: input.events.length,
            updatedCount: 0,
            unchangedCount: 0,
            ignoredCount: 0,
        };
    });
    const harness = createPostHistoryThreadGraphHookHarness({
        getShow: () => true,
        getPubkeyHex: () => "a".repeat(64),
        getRxNostr: () => ({} as never),
        getRelayConfig: () => null,
        directReplyRecordsAdapterImpl: {
            getDirectReplyRecords: vi.fn(async (parentEventId: string) =>
                recordsByParent.get(parentEventId) ?? []),
        },
        reactionRecordsAdapterImpl: {
            getReactionRecords: vi.fn().mockResolvedValue([]),
        },
        childInteractionsRepositoryImpl: {
            upsertChildInteractions,
            deleteChildInteractionByEventId: vi.fn().mockResolvedValue(undefined),
        },
        deletionRequestsRepositoryImpl: {
            getDeletedTargets: vi.fn().mockResolvedValue(new Map()),
            upsertValidDeletionRequests: vi.fn().mockResolvedValue(undefined),
        },
        postHistoryRepositoryImpl: {
            getByEventId: vi.fn().mockResolvedValue(null),
        },
        profileSyncCoordinator: {
            ensureProfile: vi.fn(() => null),
            subscribe: vi.fn(() => vi.fn()),
            reset: vi.fn(),
            dispose: vi.fn(),
        },
        replyFetchService: {
            fetchDirectReplies,
        },
        deletionFetchService: {
            fetchDeletionRequests: vi.fn(() => ({
                promise: Promise.resolve({
                    status: "success",
                    events: [],
                    fetchedAt: 1000,
                    relayUrls: [],
                }),
                cancel: vi.fn(),
            })),
        } as never,
        relatedTargetResolver: {
            getScopeRevision: vi.fn(() => 0),
            getTargetSnapshot: vi.fn(() => null),
            ensureTarget: vi.fn(),
            invalidateScope: vi.fn(),
            reset: vi.fn(),
        } as never,
    });

    const resolvePrefetch = () => deferred.resolve({
        status: "success",
        events: [{
            parentEventId: childId,
            event: grandchildEvent,
            relayUrls: ["wss://relay.example.com"],
        }],
        fetchedAt: Date.now(),
        relayUrls: ["wss://relay.example.com"],
    });

    return {
        ...harness,
        post,
        fetchDirectReplies,
        resolvePrefetch,
    };
}

async function startChildPrefetch(input: ReturnType<typeof createGraph>): Promise<void> {
    await input.graph.loadCachedChildInteractionStateForPosts([input.post]);
    input.graph.toggleChildren(input.post);
    await vi.waitFor(() => {
        expect(input.fetchDirectReplies).toHaveBeenCalledTimes(1);
        expect(input.fetchDirectReplies.mock.calls[0]?.[1]?.parents?.[0]?.eventId).toBe(childId);
    });
}

describe("post history child prefetch reveal intent", () => {
    it("prefetch中の手動展開を保持し、重複REQなしで取得後に表示する", async () => {
        const harness = createGraph();
        await startChildPrefetch(harness);

        harness.graph.toggleNodeChildren(harness.post, childId);
        expect(harness.fetchDirectReplies).toHaveBeenCalledTimes(1);
        harness.resolvePrefetch();

        await vi.waitFor(() => {
            const childState = harness.graph.getAnchorState(harness.post).replyNodeStates[0];
            expect(childState?.repliesActionState.visible).toBe(true);
            expect(childState?.replyNodeStates[0]?.node.eventId).toBe(grandchildId);
        });
        expect(harness.fetchDirectReplies).toHaveBeenCalledTimes(1);
        harness.dispose();
    });

    it("prefetchだけでは取得後も自動展開しない", async () => {
        const harness = createGraph();
        await startChildPrefetch(harness);

        harness.resolvePrefetch();

        await vi.waitFor(() => {
            const childState = harness.graph.getAnchorState(harness.post).replyNodeStates[0];
            expect(childState?.repliesActionState.replyCount).toBe(1);
            expect(childState?.repliesActionState.visible).toBe(false);
            expect(childState?.replyNodeStates).toEqual([]);
        });
        harness.dispose();
    });

    it("prefetch中に手動展開してから閉じた場合は完了後も再展開しない", async () => {
        const harness = createGraph();
        await startChildPrefetch(harness);

        harness.graph.toggleNodeChildren(harness.post, childId);
        harness.graph.toggleNodeChildren(harness.post, childId);
        harness.resolvePrefetch();

        await vi.waitFor(() => {
            const childState = harness.graph.getAnchorState(harness.post).replyNodeStates[0];
            expect(childState?.repliesActionState.replyCount).toBe(1);
            expect(childState?.repliesActionState.visible).toBe(false);
        });
        expect(harness.fetchDirectReplies).toHaveBeenCalledTimes(1);
        harness.dispose();
    });

    it("partial cacheを再読込した場合はfresh扱いせずnetwork revalidationできる", async () => {
        const harness = createGraph(0);

        await harness.graph.loadCachedChildInteractionStateForPosts([harness.post]);
        harness.graph.toggleChildren(harness.post);

        await vi.waitFor(() => {
            expect(harness.fetchDirectReplies).toHaveBeenCalledTimes(1);
            expect(harness.fetchDirectReplies.mock.calls[0]?.[1]?.parents?.[0]?.eventId)
                .toBe(anchorId);
        });
        expect(harness.graph.getAnchorState(harness.post).repliesActionState.visible).toBe(true);
        harness.dispose();
    });
});
