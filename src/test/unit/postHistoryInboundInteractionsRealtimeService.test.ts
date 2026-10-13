import { beforeEach, describe, expect, it, vi } from "vitest";
import Dexie from "dexie";
import { EHagakiDB } from "../../lib/storage/ehagakiDb";
import { getPostHistoryChildWriteGeneration } from "../../lib/storage/postHistoryLocalWriteScope";
import { clearPostHistoryDisplayForPubkey } from "../../lib/storage/postHistoryPersistenceCoordinator";
import { DexiePostHistoryChildInteractionsRepository } from "../../lib/storage/postHistoryChildInteractionsRepository";

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
vi.mock("../../lib/postHistoryRawEventVerification", () => ({
    RAW_EVENT_VERIFICATION_RULE_VERSION: 1,
    attestFullyVerifiedPostHistoryRawEvent: (event: unknown) => ({ event, attestation: {} }),
    isCurrentPostHistoryRawEventAttestation: () => true,
    usePostHistoryRelayEvents: (rxNostr: { use: Function }, rxReq: unknown, options: unknown) =>
        rxNostr.use(rxReq, options),
}));

import { PostHistoryInboundInteractionsRealtimeService } from "../../lib/postHistoryInboundInteractionsRealtimeService";
import type { NostrEvent } from "../../lib/types";
import { createEvent as createPostHistoryEvent } from "../postHistoryEventTestUtils";

const OWNER_PUBKEY = "a".repeat(64);
const PARENT_ID = "1".repeat(64);
const OTHER_PARENT_ID = "2".repeat(64);

function createEvent(overrides: Partial<NostrEvent> = {}): NostrEvent {
    return createPostHistoryEvent({
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
    });
}

function createService() {
    const postHistoryRepository = {
        getExistingEventIdsForPubkey: vi.fn(async ({ eventIds }: { eventIds: string[] }) =>
            eventIds.filter((eventId) => eventId === PARENT_ID)
        ),
        getByEventId: vi.fn(async (eventId: string) => eventId === PARENT_ID ? ({
            eventId,
            kind: 1,
            tags: [],
            createdAt: 90,
            relayHints: [],
            acceptedRelays: [],
        } as any) : null),
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

    it("realtime saves the trailing target only and rejects invalid or mismatched Reaction references", async () => {
        const observer: Record<string, any> = {};
        const { subscription, postHistoryChildInteractionsRepository, onSavedInboundInteractions } = openSubscription(observer);
        const tags = [
            [["e", OTHER_PARENT_ID, "", "reply"], ["p", "b".repeat(64)], ["e", PARENT_ID, "", OWNER_PUBKEY], ["p", OWNER_PUBKEY], ["k", "1"]],
            [["e", PARENT_ID, "", "reply"], ["e", OTHER_PARENT_ID], ["p", OWNER_PUBKEY]],
            [["e", PARENT_ID], ["e", "invalid"], ["p", OWNER_PUBKEY]],
            [["e", PARENT_ID], ["p", OWNER_PUBKEY], ["p", "invalid"]],
            [["e", PARENT_ID], ["p", OWNER_PUBKEY], ["k", "42"]],
            [["e", PARENT_ID], ["p", OWNER_PUBKEY], ["p", "b".repeat(64)]],
        ];
        const events = tags.map((tags, index) => createEvent({ kind: 7, id: String(index + 3).repeat(64), tags }));
        events.forEach(event => observer.next({ event, from: "wss://relay.example.com" }));
        await subscription.waitForIdle();
        expect(postHistoryChildInteractionsRepository.upsertChildInteractions).toHaveBeenCalledOnce();
        expect(postHistoryChildInteractionsRepository.upsertChildInteractions).toHaveBeenCalledWith({
            parentEventId: PARENT_ID, events: [{ event: events[0], relayUrls: ["wss://relay.example.com/"] }],
            expectedChildGeneration: 0,
            fetchedAt: 1_700_000_000_000,
        });
        expect(onSavedInboundInteractions).toHaveBeenCalledOnce();
        subscription.stop();
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

        expect(rxNostrMock.use).toHaveBeenCalledWith(expect.anything(), {
            on: { relays: ["wss://read.example.com/"] },
        });
        expect(rxNostrMock.emittedFilters).toEqual([
            {
                kinds: [1, 7, 42, 1111],
                "#p": [OWNER_PUBKEY],
                since: 1_699_999_940,
            },
            {
                kinds: [1111],
                "#P": [OWNER_PUBKEY],
                since: 1_699_999_940,
            },
        ]);
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
            expectedChildGeneration: 0,
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
            expectedChildGeneration: 0,
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

    it("reads a fresh generation after history clear so a later packet can be saved", async () => {
        const name = `realtime-generation-${crypto.randomUUID()}`;
        const dbA = new EHagakiDB(name);
        const dbB = new EHagakiDB(name);
        await dbA.open();
        await dbB.open();
        const repository = new DexiePostHistoryChildInteractionsRepository(dbA);
        let releaseFirstRead: () => void = () => undefined;
        const firstRead = new Promise<void>((resolve) => {
            releaseFirstRead = resolve;
        });
        let reads = 0;
        const postHistoryRepository = {
            getExistingEventIdsForPubkey: vi.fn(async () => {
                reads += 1;
                if (reads === 1) await firstRead;
                return [PARENT_ID];
            }),
            getByEventId: vi.fn(async () => ({
                eventId: PARENT_ID,
                kind: 1,
                pubkeyHex: OWNER_PUBKEY,
                tags: [] as string[][],
                createdAt: 90,
                relayHints: [] as string[],
                acceptedRelays: [] as string[],
                fetchedRelays: [] as string[],
            }) as any),
        };
        const service = new PostHistoryInboundInteractionsRealtimeService({
            postHistoryRepository,
            postHistoryChildInteractionsRepository: repository,
            getChildWriteGeneration: () => getPostHistoryChildWriteGeneration(dbA),
            now: () => 1_700_000_000_000,
            console: { warn: vi.fn(), error: vi.fn() },
        });
        let observerRef: { next?: (packet: unknown) => void } | undefined;
        rxNostrMock.use.mockReturnValue({
            subscribe: vi.fn((observer: { next?: (packet: unknown) => void }) => {
                observerRef = observer;
                return { unsubscribe: vi.fn() };
            }),
        });
        const subscription = service.subscribe(rxNostrMock as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
            relayConfig: { "wss://read.example.com/": { read: true, write: false } },
        });
        observerRef?.next?.({
            event: createEvent({ id: "3".repeat(64) }),
            from: "wss://relay.example.com",
        });
        await vi.waitFor(() => {
            expect(postHistoryRepository.getExistingEventIdsForPubkey).toHaveBeenCalled();
        });
        await clearPostHistoryDisplayForPubkey(dbB, OWNER_PUBKEY, () => 60);
        releaseFirstRead();
        await subscription.waitForIdle();
        await expect(dbA.postHistoryChildInteractions.count()).resolves.toBe(0);

        observerRef?.next?.({
            event: createEvent({ id: "4".repeat(64) }),
            from: "wss://relay.example.com",
        });
        await subscription.waitForIdle();
        await expect(dbA.postHistoryChildInteractions.count()).resolves.toBe(1);
        subscription.stop();
        dbA.close();
        dbB.close();
        await Dexie.delete(name);
    });
});
