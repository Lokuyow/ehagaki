import { describe, expect, it, vi } from "vitest";

vi.mock("svelte", async (importOriginal) => ({
    ...await importOriginal<typeof import("svelte")>(),
    onDestroy: vi.fn(),
}));

import type { PostHistoryRelatedTargetSnapshot } from "../../lib/postHistoryRelatedTargetResolver.svelte";
import type { PostHistoryRecord } from "../../lib/storage/ehagakiDb";
import type { NostrEvent } from "../../lib/types";
import { createPostHistoryThreadGraphHookHarness } from "../helpers/postHistoryThreadGraphHookHarness.svelte";

const channelId = "c".repeat(64);
const otherChannelId = "d".repeat(64);
const parentId = "1".repeat(64);
const childId = "2".repeat(64);

function createKind42Record(input: {
    eventId: string;
    channelEventId: string;
    parentEventId?: string;
}): PostHistoryRecord {
    const tags = [
        ["e", input.channelEventId, "wss://channel.example.com", "root"],
        ...(input.parentEventId
            ? [["e", input.parentEventId, "wss://parent.example.com", "reply"]]
            : []),
    ];
    return {
        id: input.eventId,
        eventId: input.eventId,
        pubkeyHex: "a".repeat(64),
        kind: 42,
        content: input.eventId === childId ? "child" : "parent",
        tags,
        createdAt: 100,
        postedAt: 100_000,
        relayHints: [],
        acceptedRelays: [],
        fetchedRelays: [],
        media: [],
        rawEvent: null,
        channelEventId: input.channelEventId,
        updatedAt: 100_000,
        schemaVersion: 1,
    };
}

function createKind1Record(eventId: string): PostHistoryRecord {
    return {
        ...createKind42Record({ eventId, channelEventId: channelId }),
        kind: 1,
        tags: [],
        channelEventId: undefined,
    };
}

function toEvent(record: PostHistoryRecord): NostrEvent {
    return {
        id: record.eventId,
        pubkey: record.pubkeyHex,
        kind: record.kind,
        content: record.content,
        tags: record.tags,
        created_at: record.createdAt,
        sig: "f".repeat(128),
    };
}

function createGraph(options: {
    snapshot?: PostHistoryRelatedTargetSnapshot | null;
    ensureSnapshot?: PostHistoryRelatedTargetSnapshot | null;
} = {}) {
    const ensureTarget = vi.fn().mockResolvedValue(options.ensureSnapshot ?? null);
    const harness = createPostHistoryThreadGraphHookHarness({
        getShow: () => true,
        getPubkeyHex: () => "a".repeat(64),
        getRxNostr: () => ({} as never),
        getRelayConfig: () => null,
        directReplyRecordsAdapterImpl: {
            getDirectReplyRecords: vi.fn().mockResolvedValue([]),
        },
        reactionRecordsAdapterImpl: {
            getReactionRecords: vi.fn().mockResolvedValue([]),
        },
        deletionRequestsRepositoryImpl: {
            getDeletedTargets: vi.fn().mockResolvedValue(new Map()),
            upsertValidDeletionRequests: vi.fn().mockResolvedValue(undefined),
        },
        childInteractionsRepositoryImpl: {
            upsertChildInteractions: vi.fn().mockResolvedValue(undefined),
            deleteChildInteractionByEventId: vi.fn().mockResolvedValue(undefined),
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
        relatedTargetResolver: {
            getScopeRevision: vi.fn(() => 0),
            getTargetSnapshot: vi.fn(() => options.snapshot ?? null),
            ensureTarget,
            invalidateScope: vi.fn(),
            reset: vi.fn(),
        } as never,
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
    });
    return { ...harness, ensureTarget };
}

describe("post history thread graph parent relation state", () => {
    it("同一channelのkind 42 parentだけを表示する", async () => {
        const parent = createKind42Record({ eventId: parentId, channelEventId: channelId });
        const child = createKind42Record({
            eventId: childId,
            channelEventId: channelId,
            parentEventId: parentId,
        });
        const { graph, dispose } = createGraph();

        await graph.loadCachedChildInteractionStateForPosts([parent, child]);
        graph.toggleParent(child);

        await vi.waitFor(() => {
            const state = graph.getAnchorState(child);
            expect(state.parentExpansion.visibleParent).toBe(true);
            expect(state.parentNode?.eventId).toBe(parentId);
            expect(state.parentNodeState?.node.eventId).toBe(parentId);
        });
        dispose();
    });

    it.each([
        ["wrong kind", createKind1Record(parentId)],
        ["wrong channel", createKind42Record({ eventId: parentId, channelEventId: otherChannelId })],
    ])("%s parentがnodesByIdにあっても非表示へ戻す", async (_label, parent) => {
        const child = createKind42Record({
            eventId: childId,
            channelEventId: channelId,
            parentEventId: parentId,
        });
        const { graph, dispose } = createGraph();

        await graph.loadCachedChildInteractionStateForPosts([parent, child]);
        graph.toggleParent(child);

        await vi.waitFor(() => {
            const state = graph.getAnchorState(child);
            expect(state.parentExpansion).toMatchObject({
                visibleParent: false,
                loadingParent: false,
                revalidatingParent: false,
                showParentLoadingIndicator: false,
                parentDeleted: false,
                parentMissing: false,
            });
            expect(state.parentNode).toBeNull();
            expect(state.parentNodeState).toBeNull();
        });
        dispose();
    });

    it("network revalidateのrelation不一致でも既存parent cardを表示し続けない", async () => {
        const parent = createKind42Record({ eventId: parentId, channelEventId: channelId });
        const child = createKind42Record({
            eventId: childId,
            channelEventId: channelId,
            parentEventId: parentId,
        });
        const wrongNetworkParent = createKind42Record({
            eventId: parentId,
            channelEventId: otherChannelId,
        });
        const snapshot = {
            status: "resolved",
            targetEventId: parentId,
            event: toEvent(wrongNetworkParent),
            relayHints: [],
            authorPubkey: wrongNetworkParent.pubkeyHex,
            profile: null,
            updatedAt: 2000,
            errorCode: null,
        } satisfies PostHistoryRelatedTargetSnapshot;
        const { graph, dispose, ensureTarget } = createGraph({ ensureSnapshot: snapshot });

        await graph.loadCachedChildInteractionStateForPosts([parent, child]);
        graph.toggleParent(child);

        await vi.waitFor(() => {
            expect(ensureTarget).toHaveBeenCalled();
            const state = graph.getAnchorState(child);
            expect(state.parentExpansion.visibleParent).toBe(false);
            expect(state.parentExpansion.parentDeleted).toBe(false);
            expect(state.parentExpansion.parentMissing).toBe(false);
            expect(state.parentNodeState).toBeNull();
        });
        dispose();
    });
});
