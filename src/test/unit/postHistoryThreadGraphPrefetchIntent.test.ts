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
const channelId = "4".repeat(64);

function createPost(kind: 1 | 42 = 1): PostHistoryRecord {
    return {
        id: anchorId,
        eventId: anchorId,
        pubkeyHex: "a".repeat(64),
        kind,
        content: "anchor",
        tags: kind === 42 ? [["e", channelId, "", "root"]] : [],
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

function createReplyEvent(
    eventId: string,
    parentEventId: string,
    createdAt: number,
    kind: 1 | 42 = 1,
): NostrEvent {
    return {
        id: eventId,
        pubkey: "b".repeat(64),
        kind,
        content: eventId === childId ? "child" : "grandchild",
        tags: kind === 42
            ? [
                ["e", channelId, "", "root"],
                ["e", parentEventId, "", "reply"],
            ]
            : [["e", parentEventId, "", "reply"]],
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
    let reject!: (reason?: unknown) => void;
    const promise = new Promise<T>((nextResolve, nextReject) => {
        resolve = nextResolve;
        reject = nextReject;
    });
    return { promise, resolve, reject };
}

function createGraph(
    cachedChildFetchedAt = Date.now(),
    childCacheProbe?: ReturnType<typeof createDeferred<PostHistoryChildInteractionRecord[]>>,
    eventKind: 1 | 42 = 1,
) {
    const post = createPost(eventKind);
    const childEvent = createReplyEvent(childId, anchorId, 110, eventKind);
    const grandchildEvent = createReplyEvent(grandchildId, childId, 120, eventKind);
    const recordsByParent = new Map<string, PostHistoryChildInteractionRecord[]>([
        [anchorId, [toRecord(childEvent, anchorId, cachedChildFetchedAt)]],
    ]);
    const metadataByParent = new Map<string, {
        parentEventId: string;
        completeness: "complete" | "partial";
        fetchedAt: number;
        requestStartedAt: number;
        updatedAt: number;
        schemaVersion: number;
    }>();
    const saveFetchMetadata = vi.fn(async (input: {
        parentEventId: string;
        completeness: "complete" | "partial";
        fetchedAt: number;
        requestStartedAt: number;
    }) => {
        const metadata = {
            ...input,
            updatedAt: input.fetchedAt,
            schemaVersion: 1,
        };
        metadataByParent.set(input.parentEventId, metadata);
        return metadata;
    });
    const getFetchMetadata = vi.fn(async (parentEventId: string) =>
        metadataByParent.get(parentEventId) ?? null);
    let childCacheProbePending = !!childCacheProbe;
    const getDirectReplyRecords = vi.fn(async (parentEventId: string) => {
        if (parentEventId === childId && childCacheProbe && childCacheProbePending) {
            childCacheProbePending = false;
            return childCacheProbe.promise;
        }
        return recordsByParent.get(parentEventId) ?? [];
    });

    const deferred = createDeferred<{
        status: "success" | "partial" | "failed" | "cancelled";
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
            getDirectReplyRecords,
        },
        reactionRecordsAdapterImpl: {
            getReactionRecords: vi.fn().mockResolvedValue([]),
        },
        childInteractionsRepositoryImpl: {
            upsertChildInteractions,
            deleteChildInteractionByEventId: vi.fn().mockResolvedValue(undefined),
        },
        directReplyFetchMetadataRepositoryImpl: {
            get: getFetchMetadata,
            save: saveFetchMetadata,
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

    const resolvePrefetch = (options: {
        status?: "success" | "partial" | "failed" | "cancelled";
        events?: Array<{ parentEventId: string; event: NostrEvent; relayUrls: string[] }>;
    } = {}) => deferred.resolve({
        status: options.status ?? "success",
        events: options.events ?? [{
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
        getDirectReplyRecords,
        resolvePrefetch,
        getFetchMetadata,
        saveFetchMetadata,
        metadataByParent,
    };
}

function countFetchCallsForParent(
    input: ReturnType<typeof createGraph>,
    parentEventId: string,
): number {
    return input.fetchDirectReplies.mock.calls.filter((call) =>
        call[1]?.parents?.some((parent) => parent.eventId === parentEventId)).length;
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
    it("cache probe中の手動展開を予約へjoinし、probe後に1回だけREQする", async () => {
        const cacheProbe = createDeferred<PostHistoryChildInteractionRecord[]>();
        const harness = createGraph(Date.now(), cacheProbe);

        await harness.graph.loadCachedChildInteractionStateForPosts([harness.post]);
        harness.graph.toggleChildren(harness.post);
        await vi.waitFor(() => {
            expect(harness.getDirectReplyRecords).toHaveBeenCalledWith(childId);
        });

        harness.graph.toggleNodeChildren(harness.post, childId);
        expect(harness.fetchDirectReplies).not.toHaveBeenCalled();
        cacheProbe.resolve([]);

        await vi.waitFor(() => {
            expect(harness.fetchDirectReplies).toHaveBeenCalledTimes(1);
        });
        harness.resolvePrefetch();
        await vi.waitFor(() => {
            const childState = harness.graph.getAnchorState(harness.post).replyNodeStates[0];
            expect(childState?.repliesActionState.visible).toBe(true);
            expect(childState?.replyNodeStates[0]?.node.eventId).toBe(grandchildId);
        });
        harness.dispose();
    });

    it("cache probe中に開いて閉じた手動意図を完了後も維持する", async () => {
        const cacheProbe = createDeferred<PostHistoryChildInteractionRecord[]>();
        const harness = createGraph(Date.now(), cacheProbe);

        await harness.graph.loadCachedChildInteractionStateForPosts([harness.post]);
        harness.graph.toggleChildren(harness.post);
        await vi.waitFor(() => {
            expect(harness.getDirectReplyRecords).toHaveBeenCalledWith(childId);
        });
        harness.graph.toggleNodeChildren(harness.post, childId);
        harness.graph.toggleNodeChildren(harness.post, childId);
        cacheProbe.resolve([]);
        await vi.waitFor(() => expect(harness.fetchDirectReplies).toHaveBeenCalledTimes(1));
        harness.resolvePrefetch();

        await vi.waitFor(() => {
            const childState = harness.graph.getAnchorState(harness.post).replyNodeStates[0];
            expect(childState?.repliesActionState.visible).toBe(false);
            expect(childState?.repliesActionState.replyCount).toBe(1);
        });
        harness.dispose();
    });

    it("cache probe hitなら手動展開を保持し、network REQを発行しない", async () => {
        const cacheProbe = createDeferred<PostHistoryChildInteractionRecord[]>();
        const harness = createGraph(Date.now(), cacheProbe);

        await harness.graph.loadCachedChildInteractionStateForPosts([harness.post]);
        harness.graph.toggleChildren(harness.post);
        await vi.waitFor(() => {
            expect(harness.getDirectReplyRecords).toHaveBeenCalledWith(childId);
        });
        harness.graph.toggleNodeChildren(harness.post, childId);
        cacheProbe.resolve([
            toRecord(createReplyEvent(grandchildId, childId, 120), childId, Date.now()),
        ]);

        await vi.waitFor(() => {
            const childState = harness.graph.getAnchorState(harness.post).replyNodeStates[0];
            expect(childState?.repliesActionState.visible).toBe(true);
            expect(childState?.replyNodeStates[0]?.node.eventId).toBe(grandchildId);
        });
        expect(harness.fetchDirectReplies).not.toHaveBeenCalled();
        harness.dispose();
    });

    it("cache probe失敗後は予約を解放し、手動操作で再取得できる", async () => {
        const cacheProbe = createDeferred<PostHistoryChildInteractionRecord[]>();
        const harness = createGraph(Date.now(), cacheProbe);

        await harness.graph.loadCachedChildInteractionStateForPosts([harness.post]);
        harness.graph.toggleChildren(harness.post);
        await vi.waitFor(() => {
            expect(harness.getDirectReplyRecords).toHaveBeenCalledWith(childId);
        });
        cacheProbe.reject(new Error("cache probe failed"));
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(harness.fetchDirectReplies).not.toHaveBeenCalled();

        harness.graph.toggleNodeChildren(harness.post, childId);
        await vi.waitFor(() => expect(harness.fetchDirectReplies).toHaveBeenCalledTimes(1));
        harness.resolvePrefetch();
        harness.dispose();
    });

    it("reset中に完了したcache probeからREQを開始しない", async () => {
        const cacheProbe = createDeferred<PostHistoryChildInteractionRecord[]>();
        const harness = createGraph(Date.now(), cacheProbe);

        await harness.graph.loadCachedChildInteractionStateForPosts([harness.post]);
        harness.graph.toggleChildren(harness.post);
        await vi.waitFor(() => {
            expect(harness.getDirectReplyRecords).toHaveBeenCalledWith(childId);
        });
        harness.graph.resetState();
        cacheProbe.resolve([]);
        await Promise.resolve();
        await Promise.resolve();

        expect(harness.fetchDirectReplies).not.toHaveBeenCalled();
        harness.dispose();
    });

    it("partial metadataはfreshなreply recordがあっても再検証を要求する", async () => {
        const harness = createGraph(Date.now());
        harness.metadataByParent.set(anchorId, {
            parentEventId: anchorId,
            completeness: "partial",
            fetchedAt: Date.now(),
            requestStartedAt: Date.now(),
            updatedAt: Date.now(),
            schemaVersion: 1,
        });

        await harness.graph.loadCachedChildInteractionStateForPosts([harness.post]);
        harness.graph.toggleChildren(harness.post);

        await vi.waitFor(() => {
            expect(harness.fetchDirectReplies.mock.calls[0]?.[1]?.parents?.[0]?.eventId)
                .toBe(anchorId);
        });
        harness.dispose();
    });

    it("0件のpartial結果も親metadataへ保存する", async () => {
        const harness = createGraph(0);
        await harness.graph.loadCachedChildInteractionStateForPosts([harness.post]);
        harness.graph.toggleChildren(harness.post);
        await vi.waitFor(() => expect(harness.fetchDirectReplies).toHaveBeenCalledTimes(1));

        harness.resolvePrefetch({ status: "partial", events: [] });
        await vi.waitFor(() => {
            expect(harness.saveFetchMetadata).toHaveBeenCalledWith(expect.objectContaining({
                parentEventId: anchorId,
                completeness: "partial",
            }));
        });
        harness.dispose();
    });

    it("0件のsuccess結果をcompleteとして保存する", async () => {
        const harness = createGraph(0);
        await harness.graph.loadCachedChildInteractionStateForPosts([harness.post]);
        harness.graph.toggleChildren(harness.post);
        await vi.waitFor(() => expect(harness.fetchDirectReplies).toHaveBeenCalledTimes(1));

        harness.resolvePrefetch({ status: "success", events: [] });
        await vi.waitFor(() => {
            expect(harness.saveFetchMetadata).toHaveBeenCalledWith(expect.objectContaining({
                parentEventId: anchorId,
                completeness: "complete",
            }));
        });
        harness.dispose();
    });

    it.each(["failed", "cancelled"] as const)(
        "%s結果では親metadataを更新しない",
        async (status) => {
            const harness = createGraph(0);
            await harness.graph.loadCachedChildInteractionStateForPosts([harness.post]);
            harness.graph.toggleChildren(harness.post);
            await vi.waitFor(() => expect(harness.fetchDirectReplies).toHaveBeenCalledTimes(1));

            harness.resolvePrefetch({ status, events: [] });
            await Promise.resolve();
            await Promise.resolve();
            expect(harness.saveFetchMetadata).not.toHaveBeenCalled();
            harness.dispose();
        },
    );
    it("eventを含むpartial結果も親metadataへ保存する", async () => {
        const harness = createGraph();
        await startChildPrefetch(harness);

        harness.resolvePrefetch({ status: "partial" });
        await vi.waitFor(() => {
            expect(harness.saveFetchMetadata).toHaveBeenCalledWith(expect.objectContaining({
                parentEventId: childId,
                completeness: "partial",
            }));
        });
        harness.dispose();
    });

    it("partial metadataはgraph再表示相当のreset後も再取得を許可する", async () => {
        const harness = createGraph(0);
        await harness.graph.loadCachedChildInteractionStateForPosts([harness.post]);
        harness.graph.toggleChildren(harness.post);
        await vi.waitFor(() => expect(harness.fetchDirectReplies).toHaveBeenCalledTimes(1));
        harness.resolvePrefetch({ status: "partial", events: [] });
        await vi.waitFor(() => expect(harness.saveFetchMetadata).toHaveBeenCalled());

        harness.graph.resetState();
        await harness.graph.loadCachedChildInteractionStateForPosts([harness.post]);
        harness.graph.toggleChildren(harness.post);
        await vi.waitFor(() => expect(countFetchCallsForParent(harness, anchorId)).toBe(2));
        harness.dispose();
    });

    it("complete metadataはgraph再表示相当のreset後にTTLを有効にする", async () => {
        const harness = createGraph(0);
        await harness.graph.loadCachedChildInteractionStateForPosts([harness.post]);
        harness.graph.toggleChildren(harness.post);
        await vi.waitFor(() => expect(harness.fetchDirectReplies).toHaveBeenCalledTimes(1));
        harness.resolvePrefetch({ status: "success", events: [] });
        await vi.waitFor(() => expect(harness.saveFetchMetadata).toHaveBeenCalled());

        harness.graph.resetState();
        await harness.graph.loadCachedChildInteractionStateForPosts([harness.post]);
        harness.graph.toggleChildren(harness.post);
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(countFetchCallsForParent(harness, anchorId)).toBe(1);
        harness.dispose();
    });

    it("kind 42 direct replyも同じparent completeness metadataを使用する", async () => {
        const harness = createGraph(0, undefined, 42);
        await harness.graph.loadCachedChildInteractionStateForPosts([harness.post]);
        harness.graph.toggleChildren(harness.post);
        await vi.waitFor(() => expect(harness.fetchDirectReplies).toHaveBeenCalledTimes(1));

        harness.resolvePrefetch({ status: "partial", events: [] });
        await vi.waitFor(() => {
            expect(harness.saveFetchMetadata).toHaveBeenCalledWith(expect.objectContaining({
                parentEventId: anchorId,
                completeness: "partial",
            }));
        });
        harness.dispose();
    });

    it("cancelled prefetch完了後は予約を解放して再度手動取得できる", async () => {
        const harness = createGraph();
        await startChildPrefetch(harness);
        harness.resolvePrefetch({ status: "cancelled", events: [] });
        await new Promise((resolve) => setTimeout(resolve, 0));

        harness.graph.toggleNodeChildren(harness.post, childId);
        await vi.waitFor(() => expect(harness.fetchDirectReplies).toHaveBeenCalledTimes(2));
        expect(harness.saveFetchMetadata).not.toHaveBeenCalled();
        harness.dispose();
    });
});
