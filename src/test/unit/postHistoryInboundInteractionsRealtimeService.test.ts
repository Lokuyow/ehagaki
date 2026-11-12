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
        rxNostrMock.emittedFilters.push(...(Array.isArray(filter) ? filter : [filter]));
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

import {
    POST_HISTORY_INBOUND_INTERACTIONS_REALTIME_QUEUE_LIMIT,
    PostHistoryInboundInteractionsRealtimeService,
} from "../../lib/postHistoryInboundInteractionsRealtimeService";
import type { NostrEvent } from "../../lib/types";
import { createEvent as createPostHistoryEvent } from "../postHistoryEventTestUtils";

const OWNER_PUBKEY = "a".repeat(64);
const PARENT_ID = "1".repeat(64);
const OTHER_PARENT_ID = "2".repeat(64);

function hexId(prefix: string, value: number): string {
    return `${prefix}${value.toString(16)}`.padStart(64, "0");
}

function reactionEvent(id: string, parentId: string, content = "+"): NostrEvent {
    return createEvent({
        id,
        kind: 7,
        content,
        tags: [
            ["e", parentId],
            ["p", OWNER_PUBKEY],
            ["k", "1"],
        ],
    });
}

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

function createService(overrides: Record<string, any> = {}) {
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
        ...overrides,
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
    it('retains history interaction processing with notifications disabled', async () => {
        let next!: (packet: unknown) => void;
        const upsert = vi.fn();
        rxNostrMock.use.mockReturnValue({ subscribe: (observer: any) => { next = observer.next; return { unsubscribe: vi.fn() }; } });
        const { service, postHistoryChildInteractionsRepository } = createService({ notificationRepository: { upsert } });
        const subscription = service.subscribe(rxNostrMock as any, { ownerPubkeyHex: OWNER_PUBKEY, includeNotifications: false });
        next({ event: createEvent(), from: 'wss://relay.example/' });
        await subscription.waitForIdle();
        expect(rxNostrMock.emittedFilters.map(filter => filter.kinds)).toEqual([[1, 42, 1111, 7], [1111]]);
        expect(upsert).not.toHaveBeenCalled();
        expect(postHistoryChildInteractionsRepository.upsertChildInteractions).toHaveBeenCalledTimes(1);
        subscription.stop();
    });
    it("persists mention-only notifications before the history classifier excludes them", async () => {
        const upsert = vi.fn(async () => undefined);
        let next!: (packet: unknown) => void;
        rxNostrMock.use.mockReturnValue({ subscribe: (observer: any) => { next = observer.next; return { unsubscribe: vi.fn() }; } });
        const { service, postHistoryChildInteractionsRepository } = createService({ notificationRepository: { upsert } });
        const subscription = service.subscribe(rxNostrMock as any, { ownerPubkeyHex: OWNER_PUBKEY });
        const mention = createEvent({ tags: [["p", OWNER_PUBKEY]], content: "mention only" });
        next({ event: mention, from: "wss://relay.example/" }); await subscription.waitForIdle();
        expect(upsert).toHaveBeenCalledWith(OWNER_PUBKEY, [{ event: mention, relayUrls: ["wss://relay.example/"] }], expect.any(Function));
        expect(postHistoryChildInteractionsRepository.upsertChildInteractions).not.toHaveBeenCalled();
        subscription.stop();
    });

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
        expect(rxReqMock.emit).toHaveBeenCalledTimes(1);
        expect(rxNostrMock.emittedFilters).toEqual([
            {
                kinds: [1, 6, 7, 16, 42, 1111],
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

    it("rejects a packet received before history clear while an earlier packet is still queued", async () => {
        const name = `realtime-queued-generation-${crypto.randomUUID()}`;
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
        const packetA = createEvent({ id: "3".repeat(64) });
        const packetB = createEvent({ id: "5".repeat(64) });
        const packetC = createEvent({ id: "6".repeat(64) });
        observerRef?.next?.({ event: packetA, from: "wss://relay.example.com" });
        await vi.waitFor(() => {
            expect(postHistoryRepository.getExistingEventIdsForPubkey).toHaveBeenCalledTimes(1);
        });
        observerRef?.next?.({ event: packetB, from: "wss://relay.example.com" });
        await clearPostHistoryDisplayForPubkey(dbB, OWNER_PUBKEY, () => 60);
        observerRef?.next?.({ event: packetB, from: "wss://second.example.com" });
        expect(reads).toBe(1);
        releaseFirstRead();
        await subscription.waitForIdle();
        await expect(dbA.postHistoryChildInteractions.toArray()).resolves.toEqual([]);

        observerRef?.next?.({ event: packetC, from: "wss://relay.example.com" });
        await subscription.waitForIdle();
        await expect(dbA.postHistoryChildInteractions.toArray()).resolves.toEqual([
            expect.objectContaining({ eventId: packetC.id }),
        ]);
        subscription.stop();
        dbA.close();
        dbB.close();
        await Dexie.delete(name);
    });

    it.each([
        ["reaction", reactionEvent(hexId("a", 1), PARENT_ID)],
        ["direct reply", createEvent()],
    ])("keeps sanitized relay URLs when a pending %s arrives more than once", async (_kind, event) => {
        let next!: (packet: unknown) => void;
        const upsert = vi.fn(async () => undefined);
        let generationReads = 0;
        rxNostrMock.use.mockReturnValue({
            subscribe: (observer: { next: (packet: unknown) => void }) => {
                next = observer.next;
                return { unsubscribe: vi.fn() };
            },
        });
        const { service, postHistoryChildInteractionsRepository } = createService({
            notificationRepository: { upsert },
            getChildWriteGeneration: () => {
                const generation = generationReads;
                generationReads += 1;
                return Promise.resolve(generation);
            },
        });
        const subscription = service.subscribe(rxNostrMock as any, { ownerPubkeyHex: OWNER_PUBKEY });
        const latest = { ...event };
        for (const from of [
            "wss://relay.example.com",
            "wss://relay.example.com/",
            "https://invalid.example.com",
            "wss://second.example.com",
            "wss://third.example.com",
            "wss://overflow.example.com",
        ]) {
            next({ event: from.startsWith("wss://overflow") ? latest : event, from });
        }
        const relayUrls = ["wss://relay.example.com/", "wss://second.example.com/", "wss://third.example.com/"];

        expect(subscription.pendingCount()).toBe(1);
        expect(generationReads).toBe(1);

        await subscription.waitForIdle();

        expect(upsert).toHaveBeenCalledOnce();
        expect(upsert).toHaveBeenCalledWith(
            OWNER_PUBKEY,
            [{ event: latest, relayUrls }],
            expect.any(Function),
        );
        expect(postHistoryChildInteractionsRepository.upsertChildInteractions).toHaveBeenCalledOnce();
        expect(postHistoryChildInteractionsRepository.upsertChildInteractions).toHaveBeenCalledWith({
            parentEventId: PARENT_ID,
            events: [{
                event: latest,
                relayUrls,
            }],
            expectedChildGeneration: 0,
            fetchedAt: 1_700_000_000_000,
        });
        subscription.stop();
    });

    it.each(["one", "distinct"])("bounds actual pending work for a flood targeting %s posts", async (targets) => {
        let next!: (packet: unknown) => void;
        const upsert = vi.fn(async (_owner: string, _items: Array<{ event: NostrEvent }>) => undefined);
        rxNostrMock.use.mockReturnValue({
            subscribe: (observer: { next: (packet: unknown) => void }) => {
                next = observer.next;
                return { unsubscribe: vi.fn() };
            },
        });
        const postHistoryRepository = {
            getExistingEventIdsForPubkey: vi.fn(async ({ eventIds }: { eventIds: string[] }) => eventIds),
            getByEventId: vi.fn(async (eventId: string) => ({
                eventId,
                kind: 1,
                tags: [] as string[][],
                createdAt: 90,
                relayHints: [] as string[],
                acceptedRelays: [] as string[],
            })),
        };
        const getChildWriteGeneration = vi.fn(async () => 0);
        const { service, postHistoryChildInteractionsRepository } = createService({
            notificationRepository: { upsert },
            postHistoryRepository,
            getChildWriteGeneration,
        });
        const subscription = service.subscribe(rxNostrMock as any, { ownerPubkeyHex: OWNER_PUBKEY });
        const limit = POST_HISTORY_INBOUND_INTERACTIONS_REALTIME_QUEUE_LIMIT;
        const events = Array.from({ length: limit + 10 }, (_, index) =>
            reactionEvent(hexId("b", index + 1), targets === "one" ? PARENT_ID : hexId("c", index + 1)),
        );
        for (const event of events) {
            next({ event, from: "wss://relay.example.com" });
        }
        // Duplicates can still contribute relay hints when the queue is full.
        next({ event: events[0], from: "wss://second.example.com" });

        expect(subscription.pendingCount()).toBe(limit);
        expect(getChildWriteGeneration).toHaveBeenCalledTimes(limit);

        await subscription.waitForIdle();

        expect(subscription.pendingCount()).toBe(0);
        expect(upsert.mock.calls.map(([, items]) => items[0].event.id)).toEqual(
            events.slice(0, limit).map(event => event.id),
        );
        expect(postHistoryChildInteractionsRepository.upsertChildInteractions).toHaveBeenCalledTimes(limit);
        expect(postHistoryChildInteractionsRepository.upsertChildInteractions).toHaveBeenNthCalledWith(1,
            expect.objectContaining({
                events: [{ event: events[0], relayUrls: ["wss://relay.example.com/", "wss://second.example.com/"] }],
            }),
        );

        next({ event: events[limit] });
        await subscription.waitForIdle();
        expect(postHistoryChildInteractionsRepository.upsertChildInteractions).toHaveBeenLastCalledWith(
            expect.objectContaining({ events: [{ event: events[limit] }] }),
        );
        subscription.stop();
    });

    it("does not upsert queued packets after stop, while a new subscription still can", async () => {
        const gates: Array<(value: number) => void> = [];
        let hangGenerations = true;
        const upsert = vi.fn(async () => undefined);
        const observers: Array<{ next?: (packet: unknown) => void }> = [];
        const unsubscribe = vi.fn();
        rxNostrMock.use.mockReturnValue({
            subscribe: (observer: { next?: (packet: unknown) => void }) => {
                observers.push(observer);
                return { unsubscribe };
            },
        });
        const { service, postHistoryChildInteractionsRepository } = createService({
            notificationRepository: { upsert },
            getChildWriteGeneration: () => hangGenerations
                ? new Promise<number>((resolve) => {
                    gates.push(resolve);
                })
                : Promise.resolve(0),
        });
        const subscription = service.subscribe(rxNostrMock as any, { ownerPubkeyHex: OWNER_PUBKEY });
        observers[0]?.next?.({
            event: reactionEvent(hexId("d", 1), hexId("e", 1)),
            from: "wss://relay.example.com",
        });
        await Promise.resolve();
        expect(upsert).not.toHaveBeenCalled();

        for (let index = 0; index < POST_HISTORY_INBOUND_INTERACTIONS_REALTIME_QUEUE_LIMIT + 5; index += 1) {
            observers[0]?.next?.({
                event: reactionEvent(hexId("d", index + 2), hexId("e", index + 2)),
                from: "wss://relay.example.com",
            });
        }
        expect(subscription.pendingCount()).toBe(POST_HISTORY_INBOUND_INTERACTIONS_REALTIME_QUEUE_LIMIT);

        subscription.stop();
        expect(unsubscribe).toHaveBeenCalledTimes(1);
        expect(subscription.pendingCount()).toBe(0);
        hangGenerations = false;
        for (const resolve of gates) resolve(0);
        await subscription.waitForIdle();

        expect(upsert).not.toHaveBeenCalled();
        expect(postHistoryChildInteractionsRepository.upsertChildInteractions).not.toHaveBeenCalled();

        const restarted = service.subscribe(rxNostrMock as any, { ownerPubkeyHex: OWNER_PUBKEY });
        const reply = createEvent({ id: hexId("f", 1) });
        observers[1]?.next?.({ event: reply, from: "wss://relay.example.com" });
        await restarted.waitForIdle();

        expect(upsert).toHaveBeenCalledTimes(1);
        expect(postHistoryChildInteractionsRepository.upsertChildInteractions).toHaveBeenCalledTimes(1);
        restarted.stop();
    });

    it("does not start a reply write if stopped while reading its parent", async () => {
        const parentReadStarted = Promise.withResolvers<void>();
        const releaseParentRead = Promise.withResolvers<void>();
        let next!: (packet: unknown) => void;
        rxNostrMock.use.mockReturnValue({
            subscribe: (observer: { next: (packet: unknown) => void }) => {
                next = observer.next;
                return { unsubscribe: vi.fn() };
            },
        });
        const { service, postHistoryChildInteractionsRepository } = createService({
            postHistoryRepository: {
                getExistingEventIdsForPubkey: async () => [PARENT_ID],
                getByEventId: async () => {
                    parentReadStarted.resolve();
                    await releaseParentRead.promise;
                    return { eventId: PARENT_ID, kind: 1, tags: [], createdAt: 90, relayHints: [], acceptedRelays: [] };
                },
            },
        });
        const subscription = service.subscribe(rxNostrMock as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
            includeNotifications: false,
        });
        next({ event: createEvent() });
        await parentReadStarted.promise;
        subscription.stop();
        releaseParentRead.resolve();
        await subscription.waitForIdle();

        expect(postHistoryChildInteractionsRepository.upsertChildInteractions).not.toHaveBeenCalled();
    });
});
