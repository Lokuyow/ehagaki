import { beforeEach, describe, expect, it, vi } from "vitest";

const rxNostrMock = vi.hoisted(() => ({
    emittedFilters: [] as any[],
    use: vi.fn(),
}));

const rxReqMock = vi.hoisted(() => ({
    emit: vi.fn((filter: any) => {
        rxNostrMock.emittedFilters.push(filter);
    }),
}));

vi.mock("rx-nostr", () => ({
    createRxForwardReq: vi.fn(() => rxReqMock),
}));

import { PostHistoryAuthoredPostsRealtimeService } from "../../lib/postHistoryAuthoredPostsRealtimeService";
import { PostHistoryInboundInteractionsRealtimeService } from "../../lib/postHistoryInboundInteractionsRealtimeService";
import { PostHistoryInboundReplyReconciliationService } from "../../lib/postHistoryInboundReplyReconciliationService";
import type { NostrEvent } from "../../lib/types";

const OWNER_PUBKEY = "a".repeat(64);

function createEvent(overrides: Partial<NostrEvent> = {}): NostrEvent {
    return {
        id: "f".repeat(64),
        pubkey: OWNER_PUBKEY,
        kind: 1,
        content: "self post",
        tags: [],
        created_at: 100,
        sig: "c".repeat(128),
        ...overrides,
    };
}

describe("PostHistoryAuthoredPostsRealtimeService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        rxNostrMock.emittedFilters = [];
    });

    it("uses a forward self-authored post subscription with since and upserts received self posts", async () => {
        let observer: Record<string, any> = {};
        rxNostrMock.use.mockReturnValue({
            subscribe: vi.fn((nextObserver) => {
                observer = nextObserver;
                return { unsubscribe: vi.fn() };
            }),
        });
        const postHistoryRepository = {
            upsertFetchedEvents: vi.fn(async () => ({
                insertedCount: 1,
                updatedCount: 0,
                unchangedCount: 0,
            })),
        };
        const onSavedSelfPosts = vi.fn();
        const service = new PostHistoryAuthoredPostsRealtimeService({
            postHistoryRepository,
            now: () => 1_700_000_000_000,
            console: { warn: vi.fn(), error: vi.fn() },
        });
        const event = createEvent({ id: "1".repeat(64), kind: 42 });

        const subscription = service.subscribe(rxNostrMock as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
            relayConfig: { "wss://read.example.com/": { read: true, write: false } },
            onSavedSelfPosts,
        });
        observer.next({ event, from: "wss://relay.example.com" });
        await subscription.waitForIdle();

        expect(rxNostrMock.emittedFilters).toEqual([{
            authors: [OWNER_PUBKEY],
            kinds: [1, 42],
            since: 1_699_999_940,
        }]);
        expect(postHistoryRepository.upsertFetchedEvents).toHaveBeenCalledWith({
            events: [{ event, relayUrls: ["wss://relay.example.com/"] }],
            fetchedAt: 1_700_000_000_000,
        });
        expect(onSavedSelfPosts).toHaveBeenCalledWith([event.id]);
    });

    it("saves an inbound realtime reply when self-authored realtime stores the parent later", async () => {
        const observers: Array<Record<string, any>> = [];
        rxNostrMock.use.mockReturnValue({
            subscribe: vi.fn((observer) => {
                observers.push(observer);
                return { unsubscribe: vi.fn() };
            }),
        });
        const parentEventId = "1".repeat(64);
        const replyEvent = {
            ...createEvent({
                id: "2".repeat(64),
                pubkey: "b".repeat(64),
                content: "unknown parent reply",
                tags: [
                    ["p", OWNER_PUBKEY],
                    ["e", parentEventId, "", "reply"],
                ],
            }),
        };
        const upsertChildInteractions = vi.fn(async () => ({
            insertedCount: 1,
            updatedCount: 0,
            unchangedCount: 0,
            ignoredCount: 0,
        }));
        const replyEventsRepository = {
            upsertChildInteractions,
            upsertDirectReplies: upsertChildInteractions,
        };
        const reconciliation = new PostHistoryInboundReplyReconciliationService({
            postHistoryRepository: {
                getExistingEventIdsForPubkey: vi.fn(async () => []),
                upsertFetchedEvents: vi.fn(),
            },
            postHistoryReplyEventsRepository: replyEventsRepository,
            selfParentFetchService: {
                fetchSelfParent: vi.fn(() => ({
                    promise: new Promise<{ event: NostrEvent | null; relayUrl: string | null }>(
                        () => undefined,
                    ),
                    cancel: vi.fn(),
                })),
            },
            now: () => 1_700_000_000_000,
            console: { warn: vi.fn(), error: vi.fn() },
        }).createSession({} as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
        });
        const inboundSubscription = new PostHistoryInboundInteractionsRealtimeService({
            postHistoryRepository: {
                getExistingEventIdsForPubkey: vi.fn(async () => []),
            },
            postHistoryReplyEventsRepository: replyEventsRepository,
            now: () => 1_700_000_000_000,
            console: { warn: vi.fn(), error: vi.fn() },
        }).subscribe(rxNostrMock as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
            reconcileDirectReplyCandidates: (candidates) => reconciliation.reconcile(candidates),
        });
        const selfPostsSubscription = new PostHistoryAuthoredPostsRealtimeService({
            postHistoryRepository: {
                upsertFetchedEvents: vi.fn(async () => ({
                    insertedCount: 1,
                    updatedCount: 0,
                    unchangedCount: 0,
                })),
            },
            now: () => 1_700_000_000_000,
            console: { warn: vi.fn(), error: vi.fn() },
        }).subscribe(rxNostrMock as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
            onSavedSelfPosts: async (eventIds) => {
                await reconciliation.notifySelfPostsSaved(eventIds);
            },
        });

        observers[0]?.next({ event: replyEvent, from: "wss://reply.example.com" });
        await inboundSubscription.waitForIdle();
        expect(replyEventsRepository.upsertDirectReplies).not.toHaveBeenCalled();

        observers[1]?.next({
            event: createEvent({ id: parentEventId, content: "remote parent" }),
            from: "wss://parent.example.com",
        });
        await selfPostsSubscription.waitForIdle();

        expect(replyEventsRepository.upsertDirectReplies).toHaveBeenCalledWith({
            parentEventId,
            events: [{ event: replyEvent, relayUrls: ["wss://reply.example.com"] }],
            fetchedAt: 1_700_000_000_000,
        });
    });
});
