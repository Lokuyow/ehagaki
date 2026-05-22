import { describe, expect, it, vi } from "vitest";
import { PostHistoryVisibilityResumeSyncService } from "../../lib/postHistoryVisibilityResumeSyncService";
import type { NostrEvent } from "../../lib/types";

const OWNER_PUBKEY = "a".repeat(64);

function createEvent(overrides: Partial<NostrEvent> = {}): NostrEvent {
    return {
        id: "1".repeat(64),
        pubkey: OWNER_PUBKEY,
        kind: 1,
        content: "remote self post",
        tags: [],
        created_at: 100,
        sig: "c".repeat(128),
        ...overrides,
    };
}

function createAuthoredResult(event = createEvent()) {
    return {
        status: "success",
        events: [{ event, relayUrls: ["wss://relay.example.com/"] }],
        fetchedAt: 1_700_000_000_000,
        nextUntil: null,
        hasMore: false,
        relayUrls: ["wss://read.example.com/"],
        observedRelayUrls: ["wss://relay.example.com/"],
        rawCount: 1,
        uniqueCount: 1,
        duplicateCount: 0,
        perRelayCounts: [],
        oldestCreatedAt: event.created_at,
        newestCreatedAt: event.created_at,
        requestedRelayUrls: ["wss://read.example.com/"],
        eventRelayUrls: ["wss://relay.example.com/"],
        eoseRelayUrls: [],
        closedRelayUrls: [],
        errorRelayUrls: [],
        downRelayUrls: [],
        completedByRxNostr: true,
        completedByLocalTimeout: false,
        hasAnyRelayResponse: true,
        allRelaysFailed: false,
    } as const;
}

function createInboundResult() {
    return {
        status: "success",
        fetchedAt: 1_700_000_000_000,
        since: 50,
        limit: 150,
        relayUrls: [],
        rawCount: 0,
        uniqueCount: 0,
        saturated: false,
        maybeIncomplete: false,
        newestSeenCreatedAt: null,
        savedParentEventIds: [],
        savedDirectReplyCount: 0,
        classifications: {
            "direct-reply": 0,
            "direct-reply-candidate": 0,
            "mention-like": 0,
            reaction: 0,
            unsupported: 0,
        },
    } as const;
}

describe("PostHistoryVisibilityResumeSyncService", () => {
    it("runs authored and inbound backward resume syncs and notifies saved self posts", async () => {
        const selfPost = createEvent();
        const fetchLatest = vi.fn(() => ({
            promise: Promise.resolve(createAuthoredResult(selfPost)),
            cancel: vi.fn(),
        }));
        const syncRecent = vi.fn(() => ({
            promise: Promise.resolve(createInboundResult()),
            cancel: vi.fn(),
        }));
        const upsertFetchedEvents = vi.fn(async () => ({
            insertedCount: 1,
            updatedCount: 0,
            unchangedCount: 0,
        }));
        const reconcileDirectReplyCandidates = vi.fn();
        const onSavedSelfPosts = vi.fn();
        const service = new PostHistoryVisibilityResumeSyncService({
            postHistoryRelayFetchService: { fetchLatest } as any,
            postHistoryInboundInteractionsSyncService: { syncRecent } as any,
            postHistoryRepository: { upsertFetchedEvents } as any,
            console: { warn: vi.fn() },
        });

        const result = await service.syncAfterVisibilityResume({} as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
            hiddenAtSeconds: 200,
            relayConfig: null,
            reconcileDirectReplyCandidates,
            onSavedSelfPosts,
        }).promise;

        expect(fetchLatest).toHaveBeenCalledWith({} as any, {
            pubkeyHex: OWNER_PUBKEY,
            relayConfig: null,
            reason: "visibility-resume",
            since: 140,
        });
        expect(syncRecent).toHaveBeenCalledWith({} as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
            relayConfig: null,
            reason: "visibility-resume",
            reconcileDirectReplyCandidates,
        });
        expect(upsertFetchedEvents).toHaveBeenCalledWith({
            events: createAuthoredResult(selfPost).events,
            fetchedAt: 1_700_000_000_000,
        });
        expect(onSavedSelfPosts).toHaveBeenCalledWith([selfPost.id]);
        expect(result.savedSelfPostEventIds).toEqual([selfPost.id]);
    });

    it("cancels both resume tasks and does not save authored results afterwards", async () => {
        let resolveAuthored!: (value: ReturnType<typeof createAuthoredResult>) => void;
        const authoredPromise = new Promise<ReturnType<typeof createAuthoredResult>>((resolve) => {
            resolveAuthored = resolve;
        });
        const cancelAuthored = vi.fn();
        const cancelInbound = vi.fn();
        const upsertFetchedEvents = vi.fn();
        const service = new PostHistoryVisibilityResumeSyncService({
            postHistoryRelayFetchService: {
                fetchLatest: vi.fn(() => ({
                    promise: authoredPromise,
                    cancel: cancelAuthored,
                })),
            } as any,
            postHistoryInboundInteractionsSyncService: {
                syncRecent: vi.fn(() => ({
                    promise: Promise.resolve(createInboundResult()),
                    cancel: cancelInbound,
                })),
            } as any,
            postHistoryRepository: { upsertFetchedEvents } as any,
        });

        const task = service.syncAfterVisibilityResume({} as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
            hiddenAtSeconds: 200,
        });
        task.cancel();
        resolveAuthored(createAuthoredResult());
        await task.promise;

        expect(cancelAuthored).toHaveBeenCalledOnce();
        expect(cancelInbound).toHaveBeenCalledOnce();
        expect(upsertFetchedEvents).not.toHaveBeenCalled();
    });
});
