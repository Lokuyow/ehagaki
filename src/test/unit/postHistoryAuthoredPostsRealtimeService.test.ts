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
});
