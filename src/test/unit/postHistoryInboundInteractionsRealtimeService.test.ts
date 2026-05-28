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

import { PostHistoryInboundInteractionsRealtimeService } from "../../lib/postHistoryInboundInteractionsRealtimeService";
import type { NostrEvent } from "../../lib/types";

const OWNER_PUBKEY = "a".repeat(64);
const PARENT_ID = "1".repeat(64);
const OTHER_PARENT_ID = "2".repeat(64);

function createEvent(overrides: Partial<NostrEvent> = {}): NostrEvent {
    return {
        id: "f".repeat(64),
        pubkey: "b".repeat(64),
        kind: 1,
        content: "reply",
        tags: [
            ["p", OWNER_PUBKEY],
            ["e", PARENT_ID, "", "reply"],
        ],
        created_at: 100,
        sig: "c".repeat(128),
        ...overrides,
    };
}

function createService() {
    const postHistoryRepository = {
        getExistingEventIdsForPubkey: vi.fn(async ({ eventIds }: { eventIds: string[] }) =>
            eventIds.filter((eventId) => eventId === PARENT_ID)
        ),
    };
    const upsertChildInteractions = vi.fn(async () => ({
        insertedCount: 1,
        updatedCount: 0,
        unchangedCount: 0,
        ignoredCount: 0,
    }));
    const postHistoryChildInteractionsRepository = {
        upsertChildInteractions,
        upsertDirectReplies: upsertChildInteractions,
    };
    const service = new PostHistoryInboundInteractionsRealtimeService({
        postHistoryRepository,
        postHistoryChildInteractionsRepository,
        now: () => 1_700_000_000_000,
        console: { warn: vi.fn(), error: vi.fn() },
    });

    return {
        service,
        postHistoryRepository,
        postHistoryChildInteractionsRepository,
    };
}

function openSubscription(observer: Record<string, any>, unsubscribe = vi.fn()) {
    rxNostrMock.use.mockReturnValue({
        subscribe: vi.fn(() => ({ unsubscribe })),
    });
    const { service, postHistoryRepository, postHistoryChildInteractionsRepository } = createService();
    const onSavedInboundInteractions = vi.fn();
    const subscription = service.subscribe(rxNostrMock as any, {
        ownerPubkeyHex: OWNER_PUBKEY,
        relayConfig: { "wss://read.example.com/": { read: true, write: false } },
        onSavedInboundInteractions,
    });
    const subscribeObserver = rxNostrMock.use.mock.results[0]?.value.subscribe.mock.calls[0]?.[0];
    Object.assign(observer, subscribeObserver);

    return {
        subscription,
        postHistoryRepository,
        postHistoryChildInteractionsRepository,
        onSavedInboundInteractions,
    };
}

describe("PostHistoryInboundInteractionsRealtimeService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        rxNostrMock.emittedFilters = [];
    });

    it("uses a forward #p kind:1 subscription with since and saves owner direct replies", async () => {
        const observer: Record<string, any> = {};
        const directReply = createEvent({ id: "3".repeat(64) });
        const {
            subscription,
            postHistoryRepository,
            postHistoryChildInteractionsRepository,
            onSavedInboundInteractions,
        } = openSubscription(observer);

        observer.next({ event: directReply, from: "wss://relay.example.com" });
        await subscription.waitForIdle();

        expect(rxNostrMock.emittedFilters).toEqual([{
            kinds: [1, 7],
            "#p": [OWNER_PUBKEY],
            since: 1_699_999_940,
        }]);
        expect(postHistoryRepository.getExistingEventIdsForPubkey).toHaveBeenCalledWith({
            pubkeyHex: OWNER_PUBKEY,
            eventIds: [PARENT_ID],
        });
        expect(postHistoryChildInteractionsRepository.upsertDirectReplies).toHaveBeenCalledWith({
            parentEventId: PARENT_ID,
            events: [{
                event: directReply,
                relayUrls: ["wss://relay.example.com/"],
            }],
            fetchedAt: 1_700_000_000_000,
        });
        expect(onSavedInboundInteractions).toHaveBeenCalledWith([PARENT_ID]);
    });

    it("keeps mention-like events out of reply storage", async () => {
        const observer: Record<string, any> = {};
        const { subscription, postHistoryChildInteractionsRepository, onSavedInboundInteractions } =
            openSubscription(observer);

        observer.next({
            event: createEvent({
                id: "4".repeat(64),
                tags: [
                    ["p", OWNER_PUBKEY],
                    ["e", OTHER_PARENT_ID, "", "reply"],
                ],
            }),
            from: "wss://relay.example.com",
        });
        await subscription.waitForIdle();

        expect(postHistoryChildInteractionsRepository.upsertDirectReplies).not.toHaveBeenCalled();
        expect(onSavedInboundInteractions).not.toHaveBeenCalled();
    });

    it("自分が自分の投稿へ付けたkind:7 reactionも保存して通知する", async () => {
        const observer: Record<string, any> = {};
        const selfReaction = createEvent({
            id: "6".repeat(64),
            pubkey: OWNER_PUBKEY,
            kind: 7,
            content: "+",
            tags: [
                ["p", OWNER_PUBKEY],
                ["e", PARENT_ID],
            ],
        });
        const {
            subscription,
            postHistoryRepository,
            postHistoryChildInteractionsRepository,
            onSavedInboundInteractions,
        } = openSubscription(observer);

        observer.next({ event: selfReaction, from: "wss://relay.example.com" });
        await subscription.waitForIdle();

        expect(postHistoryRepository.getExistingEventIdsForPubkey).toHaveBeenCalledWith({
            pubkeyHex: OWNER_PUBKEY,
            eventIds: [PARENT_ID],
        });
        expect(postHistoryChildInteractionsRepository.upsertDirectReplies).toHaveBeenCalledWith({
            parentEventId: PARENT_ID,
            events: [{
                event: selfReaction,
                relayUrls: ["wss://relay.example.com/"],
            }],
            fetchedAt: 1_700_000_000_000,
        });
        expect(onSavedInboundInteractions).toHaveBeenCalledWith([PARENT_ID]);
    });

    it("unsubscribes and does not save packets queued after stop", async () => {
        const observer: Record<string, any> = {};
        const unsubscribe = vi.fn();
        const { subscription, postHistoryChildInteractionsRepository } =
            openSubscription(observer, unsubscribe);

        subscription.stop();
        observer.next({ event: createEvent({ id: "5".repeat(64) }) });
        await subscription.waitForIdle();

        expect(unsubscribe).toHaveBeenCalledTimes(1);
        expect(postHistoryChildInteractionsRepository.upsertDirectReplies).not.toHaveBeenCalled();
    });
});
