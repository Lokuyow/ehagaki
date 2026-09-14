import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const rxNostrMock = vi.hoisted(() => ({
    emittedFilters: [] as any[],
    use: vi.fn(),
    createAllMessageObservable: vi.fn(),
    createAllErrorObservable: vi.fn(),
    createConnectionStateObservable: vi.fn(),
}));

const rxReqMock = vi.hoisted(() => ({
    emit: vi.fn((filter: any) => {
        rxNostrMock.emittedFilters.push(filter);
    }),
    over: vi.fn(),
}));

const createRxBackwardReqMock = vi.hoisted(() => vi.fn((_rxReqId?: string) => rxReqMock));

vi.mock("rx-nostr", () => ({
    createRxBackwardReq: createRxBackwardReqMock,
}));
vi.mock("../../lib/postHistoryRawEventVerification", () => ({
    RAW_EVENT_VERIFICATION_RULE_VERSION: 1,
    attestFullyVerifiedPostHistoryRawEvent: (event: unknown) => ({ event, attestation: {} }),
    isCurrentPostHistoryRawEventAttestation: () => true,
    usePostHistoryRelayEvents: (rxNostr: { use: Function }, rxReq: unknown, options: unknown) =>
        rxNostr.use(rxReq, options),
}));

import {
    POST_HISTORY_VISIBLE_RANGE_CHILD_INTERACTION_REPAIR_FETCH_LIMIT,
    PostHistoryVisibleRangeChildInteractionRepairService,
} from "../../lib/postHistoryVisibleRangeChildInteractionRepairService";
import type { NostrEvent } from "../../lib/types";
import {
    activateHostRelayConfig,
    deactivateHostRelayConfig,
} from "../../lib/hostRelayRuntime";

const OWNER = "a".repeat(64);

type Observer<T> = {
    next?: (value: T) => void;
    complete?: () => void;
    error?: (error: unknown) => void;
};

function createRxNostrHarness() {
    const eventObservers = new Set<Observer<any>>();
    const messageObservers = new Set<Observer<any>>();
    const errorObservers = new Set<Observer<any>>();
    const connectionStateObservers = new Set<Observer<any>>();
    const subscriptions = {
        events: vi.fn(),
        messages: vi.fn(),
        errors: vi.fn(),
        connectionStates: vi.fn(),
    };
    const rxNostr = {
        use: vi.fn(() => ({
            subscribe: (observer: Observer<any>) => {
                eventObservers.add(observer);
                return {
                    unsubscribe: () => {
                        eventObservers.delete(observer);
                        subscriptions.events();
                    },
                };
            },
        })),
        createAllMessageObservable: vi.fn(() => ({
            subscribe: (observer: Observer<any>) => {
                messageObservers.add(observer);
                return {
                    unsubscribe: () => {
                        messageObservers.delete(observer);
                        subscriptions.messages();
                    },
                };
            },
        })),
        createAllErrorObservable: vi.fn(() => ({
            subscribe: (observer: Observer<any>) => {
                errorObservers.add(observer);
                return {
                    unsubscribe: () => {
                        errorObservers.delete(observer);
                        subscriptions.errors();
                    },
                };
            },
        })),
        createConnectionStateObservable: vi.fn(() => ({
            subscribe: (observer: Observer<any>) => {
                connectionStateObservers.add(observer);
                return {
                    unsubscribe: () => {
                        connectionStateObservers.delete(observer);
                        subscriptions.connectionStates();
                    },
                };
            },
        })),
    };

    const currentSubId = (requestIndex = -1) => {
        const rxReqId = createRxBackwardReqMock.mock.calls.at(requestIndex)?.[0];
        return `${rxReqId}:0`;
    };

    return {
        rxNostr,
        subscriptions,
        emitEvent: (packet: any) => [...eventObservers].forEach((observer) => observer.next?.(packet)),
        complete: () => [...eventObservers].forEach((observer) => observer.complete?.()),
        fail: (error: unknown) => [...eventObservers].forEach((observer) => observer.error?.(error)),
        emitEose: (from: string, requestIndex = -1) => [...messageObservers].forEach((observer) => observer.next?.({
            type: "EOSE",
            from,
            subId: currentSubId(requestIndex),
            message: ["EOSE", currentSubId(requestIndex)],
        })),
        emitClosed: (from: string, notice = "blocked") => [...messageObservers].forEach((observer) => observer.next?.({
            type: "CLOSED",
            from,
            subId: currentSubId(),
            notice,
            message: ["CLOSED", currentSubId(), notice],
        })),
        emitRelayError: (from: string) => [...errorObservers].forEach((observer) => observer.next?.({ from, reason: new Error("relay error") })),
        emitDown: (from: string) => [...connectionStateObservers].forEach((observer) => observer.next?.({ from, state: "error" })),
    };
}

function createControllableTimers() {
    const callbacks: Array<() => void> = [];
    return {
        callbacks,
        setTimeoutFn: ((callback: () => void) => {
            callbacks.push(callback);
            return callbacks.length;
        }) as any,
    };
}

function emitDuplicateReplyEvents(
    harness: ReturnType<typeof createRxNostrHarness>,
    from: string,
    count: number,
) {
    const event = createReply();
    for (let index = 0; index < count; index += 1) {
        harness.emitEvent({ event, from });
    }
}

function createPost(eventId: string, kind = 1) {
    return {
        id: eventId,
        eventId,
        pubkeyHex: OWNER,
        kind,
        content: "post",
        tags: kind === 42 ? [["e", "9".repeat(64), "", "root"]] : [],
        createdAt: 100,
        postedAt: 100_000,
        relayHints: [],
        acceptedRelays: [],
        media: [],
        rawEvent: {},
        updatedAt: 100_000,
        schemaVersion: 2,
    } as any;
}

function createReply(overrides: Partial<NostrEvent> = {}): NostrEvent {
    return {
        id: "3".repeat(64),
        pubkey: "b".repeat(64),
        kind: 1,
        content: "reply",
        tags: [],
        created_at: 101,
        sig: "d".repeat(128),
        ...overrides,
    };
}

function createReaction(overrides: Partial<NostrEvent> = {}): NostrEvent {
    return {
        id: "6".repeat(64),
        pubkey: "e".repeat(64),
        kind: 7,
        content: "+",
        tags: [],
        created_at: 102,
        sig: "f".repeat(128),
        ...overrides,
    };
}

describe("PostHistoryVisibleRangeChildInteractionRepairService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        rxNostrMock.emittedFilters = [];
        createRxBackwardReqMock.mockClear();
        rxNostrMock.createAllMessageObservable.mockReturnValue({
            subscribe: () => ({ unsubscribe: vi.fn() }),
        });
        rxNostrMock.createAllErrorObservable.mockReturnValue({
            subscribe: () => ({ unsubscribe: vi.fn() }),
        });
        rxNostrMock.createConnectionStateObservable.mockReturnValue({
            subscribe: () => ({ unsubscribe: vi.fn() }),
        });
    });

    afterEach(() => deactivateHostRelayConfig());

    it("visible kind:1 parentを#e filterで取得し、direct replyとreactionを保存へ渡す", async () => {
        const kind1Parent = "1".repeat(64);
        const harness = createRxNostrHarness();
        const upsertChildInteractions = vi.fn(async () => ({
            insertedCount: 1,
            updatedCount: 0,
            unchangedCount: 0,
            ignoredCount: 0,
        }));
        const saveRepairDirectReplies = vi.fn(() => ({
            promise: Promise.resolve({
                status: "saved",
                savedParentEventIds: [kind1Parent],
                savedDirectReplyCount: 1,
                deletedEventIds: [],
                deletionConfirmationIncomplete: false,
            }),
            cancel: vi.fn(),
        }));
        const service = new PostHistoryVisibleRangeChildInteractionRepairService({
            directReplySaveService: { saveRepairDirectReplies } as any,
            childInteractionsRepository: { upsertChildInteractions } as any,
            setTimeoutFn: (() => 1) as any,
            clearTimeoutFn: vi.fn(),
            now: () => 500,
        });
        const task = service.repairVisibleRangeChildInteractions(harness.rxNostr as any, {
            ownerPubkeyHex: OWNER,
            visiblePosts: [createPost(kind1Parent)],
            relayConfig: { "wss://relay.example.com": { read: true, write: false } },
        });
        harness.emitEvent({
            event: createReply({ tags: [["e", kind1Parent, "", "reply"]] }),
            from: "wss://relay.example.com",
        });
        harness.emitEvent({
            event: createReply({
                id: "4".repeat(64),
                tags: [["e", kind1Parent, "", "root"], ["e", "5".repeat(64), "", "reply"]],
            }),
            from: "wss://relay.example.com",
        });
        harness.emitEvent({
            event: createReaction({ tags: [["e", kind1Parent, "", "reply"]] }),
            from: "wss://relay.example.com",
        });
        harness.emitEvent({
            event: createReaction({
                id: "7".repeat(64),
                tags: [["e", "8".repeat(64), "", "reply"]],
            }),
            from: "wss://relay.example.com",
        });
        harness.emitEose("wss://relay.example.com");
        harness.complete();
        const result = await task.promise;

        expect(rxNostrMock.emittedFilters).toEqual([
            {
                kinds: [1, 7],
                "#e": [kind1Parent],
                limit: POST_HISTORY_VISIBLE_RANGE_CHILD_INTERACTION_REPAIR_FETCH_LIMIT,
            },
        ]);
        expect(rxNostrMock.emittedFilters[0]).not.toHaveProperty("since");
        expect(rxNostrMock.emittedFilters[0]).not.toHaveProperty("until");
        expect(rxNostrMock.emittedFilters[0]).not.toHaveProperty("#p");
        expect(saveRepairDirectReplies).toHaveBeenCalledWith(harness.rxNostr, expect.objectContaining({
            items: [{
                parentEventId: kind1Parent,
                event: expect.objectContaining({ id: "3".repeat(64) }),
                relayUrls: ["wss://relay.example.com/"],
            }],
        }));
        expect(upsertChildInteractions).toHaveBeenCalledTimes(1);
        expect(upsertChildInteractions).toHaveBeenCalledWith({
            parentEventId: kind1Parent,
            events: [{
                event: expect.objectContaining({ id: "6".repeat(64), kind: 7 }),
                relayUrls: ["wss://relay.example.com/"],
            }],
            fetchedAt: 500,
        });
        expect({
            ...result,
            checkedParentEventIds: [...result.checkedParentEventIds].sort(),
        }).toMatchObject({
            targetParentEventIds: [kind1Parent],
            checkedParentEventIds: [kind1Parent],
            savedParentEventIds: [kind1Parent],
            savedDirectReplyCount: 1,
            incompleteParentEventIds: [],
        });
    });

    it("candidate fetch が error の parent は unchecked/incomplete として返す", async () => {
        const kind1Parent = "1".repeat(64);
        const saveRepairDirectReplies = vi.fn(() => ({
            promise: Promise.resolve({
                status: "saved",
                savedParentEventIds: [],
                savedDirectReplyCount: 0,
                deletedEventIds: [],
                deletionConfirmationIncomplete: false,
            }),
            cancel: vi.fn(),
        }));
        const service = new PostHistoryVisibleRangeChildInteractionRepairService({
            directReplySaveService: { saveRepairDirectReplies } as any,
            setTimeoutFn: (() => 1) as any,
            clearTimeoutFn: vi.fn(),
        });
        rxNostrMock.use.mockReturnValue({
            subscribe: ({ error }: Record<string, any>) => {
                error(new Error("fetch failed"));
                return { unsubscribe: vi.fn() };
            },
        });

        const result = await service.repairVisibleRangeChildInteractions(rxNostrMock as any, {
            ownerPubkeyHex: OWNER,
            visiblePosts: [createPost(kind1Parent)],
            relayConfig: null,
        }).promise;

        expect(saveRepairDirectReplies).not.toHaveBeenCalled();
        expect(result).toMatchObject({
            status: "partial",
            targetParentEventIds: [kind1Parent],
            checkedParentEventIds: [],
            incompleteParentEventIds: [kind1Parent],
        });
    });

    it("baseline EOSE 後に hint だけが deadline を迎えても checked とする", async () => {
        const harness = createRxNostrHarness();
        const timers = createControllableTimers();
        const service = new PostHistoryVisibleRangeChildInteractionRepairService({
            setTimeoutFn: timers.setTimeoutFn,
            clearTimeoutFn: vi.fn(),
        });
        const post = createPost("1".repeat(64));
        post.relayHints = ["wss://hint.example.com"];

        const task = service.repairVisibleRangeChildInteractions(harness.rxNostr as any, {
            ownerPubkeyHex: OWNER,
            visiblePosts: [post],
            relayConfig: { "wss://baseline.example.com": { read: true, write: false } },
        });
        harness.emitEose("wss://baseline.example.com");
        timers.callbacks[0]?.();

        await expect(task.promise).resolves.toMatchObject({
            status: "success",
            checkedParentEventIds: [post.eventId],
            incompleteParentEventIds: [],
        });
        expect(harness.rxNostr.use).toHaveBeenCalledWith(expect.anything(), {
            on: {
                relays: [
                    "wss://baseline.example.com/",
                    "wss://hint.example.com/",
                ],
            },
        });
    });

    it("複数 baseline の一部が EOSE を返さなければ partial とする", async () => {
        const harness = createRxNostrHarness();
        const timers = createControllableTimers();
        const service = new PostHistoryVisibleRangeChildInteractionRepairService({
            setTimeoutFn: timers.setTimeoutFn,
            clearTimeoutFn: vi.fn(),
        });
        const post = createPost("1".repeat(64));
        const task = service.repairVisibleRangeChildInteractions(harness.rxNostr as any, {
            ownerPubkeyHex: OWNER,
            visiblePosts: [post],
            relayConfig: {
                "wss://baseline-a.example.com": { read: true, write: false },
                "wss://baseline-b.example.com": { read: true, write: false },
            },
        });
        harness.emitEose("wss://baseline-a.example.com");
        timers.callbacks[0]?.();

        await expect(task.promise).resolves.toMatchObject({
            status: "partial",
            checkedParentEventIds: [],
            incompleteParentEventIds: [post.eventId],
        });
    });

    it("auth-required CLOSED の後に同じ baseline が EOSE を返せば success とする", async () => {
        const harness = createRxNostrHarness();
        const service = new PostHistoryVisibleRangeChildInteractionRepairService({
            setTimeoutFn: (() => 1) as any,
            clearTimeoutFn: vi.fn(),
        });
        const post = createPost("1".repeat(64));
        const task = service.repairVisibleRangeChildInteractions(harness.rxNostr as any, {
            ownerPubkeyHex: OWNER,
            visiblePosts: [post],
            relayConfig: { "wss://baseline.example.com": { read: true, write: false } },
        });
        harness.emitClosed("wss://baseline.example.com", "auth-required: challenge");
        harness.emitEose("wss://baseline.example.com");
        harness.complete();

        await expect(task.promise).resolves.toMatchObject({
            status: "success",
            checkedParentEventIds: [post.eventId],
        });
    });

    it.each(["CLOSED", "error", "down"] as const)(
        "baseline Relay が %s のまま EOSE なしで終端すれば partial とする",
        async (terminal) => {
            const harness = createRxNostrHarness();
            const service = new PostHistoryVisibleRangeChildInteractionRepairService({
                setTimeoutFn: (() => 1) as any,
                clearTimeoutFn: vi.fn(),
            });
            const post = createPost("1".repeat(64));
            const task = service.repairVisibleRangeChildInteractions(harness.rxNostr as any, {
                ownerPubkeyHex: OWNER,
                visiblePosts: [post],
                relayConfig: { "wss://baseline.example.com": { read: true, write: false } },
            });
            if (terminal === "CLOSED") {
                harness.emitClosed("wss://baseline.example.com");
            } else if (terminal === "error") {
                harness.emitRelayError("wss://baseline.example.com");
            } else {
                harness.emitDown("wss://baseline.example.com");
            }
            harness.complete();

            await expect(task.promise).resolves.toMatchObject({
                status: "partial",
                checkedParentEventIds: [],
                incompleteParentEventIds: [post.eventId],
            });
        },
    );

    it("EVENT を保存しても baseline EOSE がなければ unchecked のままにする", async () => {
        const harness = createRxNostrHarness();
        const timers = createControllableTimers();
        const saveRepairDirectReplies = vi.fn(() => ({
            promise: Promise.resolve({
                status: "saved",
                savedParentEventIds: ["1".repeat(64)],
                savedDirectReplyCount: 1,
                deletedEventIds: [],
                deletionConfirmationIncomplete: false,
            }),
            cancel: vi.fn(),
        }));
        const service = new PostHistoryVisibleRangeChildInteractionRepairService({
            directReplySaveService: { saveRepairDirectReplies } as any,
            setTimeoutFn: timers.setTimeoutFn,
            clearTimeoutFn: vi.fn(),
        });
        const post = createPost("1".repeat(64));
        const task = service.repairVisibleRangeChildInteractions(harness.rxNostr as any, {
            ownerPubkeyHex: OWNER,
            visiblePosts: [post],
            relayConfig: { "wss://baseline.example.com": { read: true, write: false } },
        });
        harness.emitEvent({
            event: createReply({ tags: [["e", post.eventId, "", "reply"]] }),
            from: "wss://baseline.example.com",
        });
        timers.callbacks[0]?.();

        await expect(task.promise).resolves.toMatchObject({
            status: "partial",
            checkedParentEventIds: [],
            savedDirectReplyCount: 1,
        });
    });

    it("EVENT がなくても baseline EOSE なら checked とする", async () => {
        const harness = createRxNostrHarness();
        const service = new PostHistoryVisibleRangeChildInteractionRepairService({
            setTimeoutFn: (() => 1) as any,
            clearTimeoutFn: vi.fn(),
        });
        const post = createPost("1".repeat(64));
        const task = service.repairVisibleRangeChildInteractions(harness.rxNostr as any, {
            ownerPubkeyHex: OWNER,
            visiblePosts: [post],
            relayConfig: { "wss://baseline.example.com": { read: true, write: false } },
        });
        harness.emitEose("wss://baseline.example.com");
        harness.complete();

        await expect(task.promise).resolves.toMatchObject({
            status: "success",
            checkedParentEventIds: [post.eventId],
        });
    });

    it("Relay ごとの count が limit 未満なら aggregate raw count が limit 以上でも saturation にしない", async () => {
        const harness = createRxNostrHarness();
        const service = new PostHistoryVisibleRangeChildInteractionRepairService({
            setTimeoutFn: (() => 1) as any,
            clearTimeoutFn: vi.fn(),
        });
        const post = createPost("1".repeat(64));
        const task = service.repairVisibleRangeChildInteractions(harness.rxNostr as any, {
            ownerPubkeyHex: OWNER,
            visiblePosts: [post],
            relayConfig: {
                "wss://baseline-a.example.com": { read: true, write: false },
                "wss://baseline-b.example.com": { read: true, write: false },
            },
        });
        emitDuplicateReplyEvents(harness, "wss://baseline-a.example.com", 125);
        emitDuplicateReplyEvents(harness, "wss://baseline-b.example.com", 125);
        harness.emitEose("wss://baseline-a.example.com");
        harness.emitEose("wss://baseline-b.example.com");
        harness.complete();

        await expect(task.promise).resolves.toMatchObject({
            status: "success",
            saturatedChunkCount: 0,
            checkedParentEventIds: [post.eventId],
        });
        expect(harness.rxNostr.use).toHaveBeenCalledTimes(1);
    });

    it("coverage Relay が limit に達し fallback 後も saturated なら partial とする", async () => {
        const harness = createRxNostrHarness();
        const service = new PostHistoryVisibleRangeChildInteractionRepairService({
            setTimeoutFn: (() => 1) as any,
            clearTimeoutFn: vi.fn(),
        });
        const post = createPost("1".repeat(64));
        const task = service.repairVisibleRangeChildInteractions(harness.rxNostr as any, {
            ownerPubkeyHex: OWNER,
            visiblePosts: [post],
            relayConfig: { "wss://baseline.example.com": { read: true, write: false } },
        });
        emitDuplicateReplyEvents(harness, "wss://baseline.example.com", 250);
        harness.emitEose("wss://baseline.example.com");
        harness.complete();

        await vi.waitFor(() => expect(harness.rxNostr.use).toHaveBeenCalledTimes(2));
        emitDuplicateReplyEvents(harness, "wss://baseline.example.com", 250);
        harness.emitEose("wss://baseline.example.com");
        harness.complete();

        await expect(task.promise).resolves.toMatchObject({
            status: "partial",
            checkedParentEventIds: [],
            incompleteParentEventIds: [post.eventId],
        });
    });

    it("saturated initial chunk の partial は fallback が全 parent を確認できれば回復する", async () => {
        const harness = createRxNostrHarness();
        const service = new PostHistoryVisibleRangeChildInteractionRepairService({
            setTimeoutFn: (() => 1) as any,
            clearTimeoutFn: vi.fn(),
        });
        const posts = Array.from({ length: 30 }, (_, index) =>
            createPost(index.toString(16).padStart(64, "0"))
        );
        const task = service.repairVisibleRangeChildInteractions(harness.rxNostr as any, {
            ownerPubkeyHex: OWNER,
            visiblePosts: posts,
            relayConfig: { "wss://baseline.example.com": { read: true, write: false } },
        });

        emitDuplicateReplyEvents(harness, "wss://baseline.example.com", 250);
        harness.complete();

        await vi.waitFor(() => expect(harness.rxNostr.use).toHaveBeenCalledTimes(3));
        harness.emitEose("wss://baseline.example.com", 1);
        harness.emitEose("wss://baseline.example.com", 2);
        harness.complete();

        await vi.waitFor(() => expect(harness.rxNostr.use).toHaveBeenCalledTimes(4));
        harness.emitEose("wss://baseline.example.com", 3);
        harness.complete();

        await expect(task.promise).resolves.toMatchObject({
            status: "success",
            checkedParentEventIds: posts.map((post) => post.eventId),
            incompleteParentEventIds: [],
        });
    });

    it("hint-only Relay の saturation は coverage success を partial にしない", async () => {
        const harness = createRxNostrHarness();
        const service = new PostHistoryVisibleRangeChildInteractionRepairService({
            setTimeoutFn: (() => 1) as any,
            clearTimeoutFn: vi.fn(),
        });
        const post = createPost("1".repeat(64));
        post.relayHints = ["wss://hint.example.com"];
        const task = service.repairVisibleRangeChildInteractions(harness.rxNostr as any, {
            ownerPubkeyHex: OWNER,
            visiblePosts: [post],
            relayConfig: { "wss://baseline.example.com": { read: true, write: false } },
        });
        emitDuplicateReplyEvents(harness, "wss://hint.example.com", 250);
        harness.emitEose("wss://baseline.example.com");
        harness.complete();

        await vi.waitFor(() => expect(harness.rxNostr.use).toHaveBeenCalledTimes(2));
        harness.emitEose("wss://baseline.example.com");
        harness.complete();

        await expect(task.promise).resolves.toMatchObject({
            status: "success",
            checkedParentEventIds: [post.eventId],
        });
    });

    it("standalone は read baseline、write-only destination、上限付き hints を分ける", () => {
        const service = new PostHistoryVisibleRangeChildInteractionRepairService();
        const post = createPost("1".repeat(64));
        post.relayHints = Array.from({ length: 10 }, (_, index) =>
            `wss://hint-${index + 1}.example.com`
        );

        expect((service as any).resolveRelayPlan([post], {
            "wss://read.example.com": { read: true, write: false },
            "wss://write.example.com": { read: false, write: true },
        })).toEqual({
            coverageRelayUrls: ["wss://read.example.com/"],
            destinationRelayUrls: [
                "wss://read.example.com/",
                "wss://write.example.com/",
                ...Array.from({ length: 8 }, (_, index) =>
                    `wss://hint-${index + 1}.example.com/`
                ),
            ],
        });
        expect((service as any).resolveRelayPlan([post], {
            "wss://write.example.com": { read: false, write: true },
        }).coverageRelayUrls).toEqual(["wss://write.example.com/"]);
        expect((service as any).resolveRelayPlan([createPost("2".repeat(64))], null)
            .coverageRelayUrls).not.toEqual([]);
    });

    it("Host の全 read defaults を coverage とし、hint failure だけでは partial にしない", async () => {
        activateHostRelayConfig({
            "wss://host-a.example.com": { read: true, write: false },
            "wss://host-b.example.com": { read: true, write: false },
        });
        const harness = createRxNostrHarness();
        const service = new PostHistoryVisibleRangeChildInteractionRepairService({
            setTimeoutFn: (() => 1) as any,
            clearTimeoutFn: vi.fn(),
        });
        const post = createPost("1".repeat(64));
        post.relayHints = ["wss://hint.example.com"];
        const task = service.repairVisibleRangeChildInteractions(harness.rxNostr as any, {
            ownerPubkeyHex: OWNER,
            visiblePosts: [post],
            relayConfig: null,
        });
        harness.emitRelayError("wss://hint.example.com");
        harness.emitEose("wss://host-a.example.com");
        harness.emitEose("wss://host-b.example.com");
        harness.complete();

        await expect(task.promise).resolves.toMatchObject({
            status: "success",
            checkedParentEventIds: [post.eventId],
        });
        expect(harness.rxNostr.use).toHaveBeenCalledWith(expect.anything(), {
            on: {
                relays: [
                    "wss://host-a.example.com/",
                    "wss://host-b.example.com/",
                    "wss://hint.example.com/",
                ],
            },
        });
    });

    it("cancel は telemetry を含む subscription を解除し、late packet を無効化する", async () => {
        const harness = createRxNostrHarness();
        const service = new PostHistoryVisibleRangeChildInteractionRepairService({
            setTimeoutFn: (() => 1) as any,
            clearTimeoutFn: vi.fn(),
        });
        const post = createPost("1".repeat(64));
        const task = service.repairVisibleRangeChildInteractions(harness.rxNostr as any, {
            ownerPubkeyHex: OWNER,
            visiblePosts: [post],
            relayConfig: { "wss://baseline.example.com": { read: true, write: false } },
        });
        task.cancel();
        harness.emitEose("wss://baseline.example.com");
        harness.complete();

        await expect(task.promise).resolves.toMatchObject({
            status: "cancelled",
            checkedParentEventIds: [],
        });
        expect(harness.subscriptions.events).toHaveBeenCalledTimes(1);
        expect(harness.subscriptions.messages).toHaveBeenCalledTimes(1);
        expect(harness.subscriptions.errors).toHaveBeenCalledTimes(1);
        expect(harness.subscriptions.connectionStates).toHaveBeenCalledTimes(1);
    });

    it("150件を30件chunkに分けて最大visible parent範囲だけ取得する", async () => {
        const service = new PostHistoryVisibleRangeChildInteractionRepairService({
            directReplySaveService: {
                saveRepairDirectReplies: vi.fn(),
            } as any,
            setTimeoutFn: (() => 1) as any,
            clearTimeoutFn: vi.fn(),
        });
        rxNostrMock.use.mockReturnValue({
            subscribe: ({ complete }: Record<string, any>) => {
                complete();
                return { unsubscribe: vi.fn() };
            },
        });
        const visiblePosts = Array.from({ length: 151 }, (_, index) =>
            createPost(index.toString(16).padStart(64, "0"))
        );

        const result = await service.repairVisibleRangeChildInteractions(rxNostrMock as any, {
            ownerPubkeyHex: OWNER,
            visiblePosts,
            relayConfig: null,
        }).promise;

        expect(result.targetParentEventIds).toHaveLength(150);
        expect(rxNostrMock.emittedFilters).toHaveLength(5);
        expect(rxNostrMock.emittedFilters.every((filter) => filter["#e"].length === 30)).toBe(true);
    });

    it("relationKinds が quote のみなら child interaction repair を reply/reaction 無効で起動する", async () => {
        const service = new PostHistoryVisibleRangeChildInteractionRepairService();
        const internalRepair = vi.fn(() => ({
            promise: Promise.resolve({
                status: "success",
                targetParentEventIds: [],
                checkedParentEventIds: [],
                savedParentEventIds: [],
                savedDirectReplyCount: 0,
                attemptedChunkCount: 0,
                saturatedChunkCount: 0,
                incompleteParentEventIds: [],
                deletionConfirmationIncomplete: false,
            }),
            cancel: vi.fn(),
        }));
        (service as any).repairVisibleRangeChildInteractionsInternal = internalRepair;

        const result = await service.repairVisibleRangeRelations(rxNostrMock as any, {
            ownerPubkeyHex: OWNER,
            visiblePosts: [createPost("1".repeat(64)), createPost("2".repeat(64), 42)],
            relationKinds: ["quote"],
            relayConfig: null,
        }).promise;

        expect(internalRepair).toHaveBeenCalledWith(
            rxNostrMock,
            expect.objectContaining({
                relationKinds: ["quote"],
            }),
            {
                includeDirectReplies: false,
                includeReactions: false,
            },
        );
        expect(result.relationKinds).toEqual(["quote"]);
    });

    it("quote executor が指定されていれば relation-aware repair 完了後に実行される", async () => {
        const service = new PostHistoryVisibleRangeChildInteractionRepairService();
        (service as any).repairVisibleRangeChildInteractionsInternal = vi.fn(() => ({
            promise: Promise.resolve({
                status: "success",
                targetParentEventIds: ["1".repeat(64)],
                checkedParentEventIds: ["1".repeat(64)],
                savedParentEventIds: [],
                savedDirectReplyCount: 0,
                attemptedChunkCount: 1,
                saturatedChunkCount: 0,
                incompleteParentEventIds: [],
                deletionConfirmationIncomplete: false,
            }),
            cancel: vi.fn(),
        }));
        const quoteExecutor = vi.fn(async () => undefined);

        const result = await service.repairVisibleRangeRelations(rxNostrMock as any, {
            ownerPubkeyHex: OWNER,
            visiblePosts: [createPost("1".repeat(64))],
            relationKinds: ["reply", "reaction", "quote"],
            quoteVisibleRangeRepairExecutor: quoteExecutor,
            relayConfig: null,
        }).promise;

        expect(quoteExecutor).toHaveBeenCalledTimes(1);
        expect(result.quoteRepairApplied).toBe(true);
    });

    it("quote executor が未指定なら quoteRepairApplied は false のまま", async () => {
        const service = new PostHistoryVisibleRangeChildInteractionRepairService();
        (service as any).repairVisibleRangeChildInteractionsInternal = vi.fn(() => ({
            promise: Promise.resolve({
                status: "success",
                targetParentEventIds: ["1".repeat(64)],
                checkedParentEventIds: ["1".repeat(64)],
                savedParentEventIds: [],
                savedDirectReplyCount: 0,
                attemptedChunkCount: 1,
                saturatedChunkCount: 0,
                incompleteParentEventIds: [],
                deletionConfirmationIncomplete: false,
            }),
            cancel: vi.fn(),
        }));

        const result = await service.repairVisibleRangeRelations(rxNostrMock as any, {
            ownerPubkeyHex: OWNER,
            visiblePosts: [createPost("1".repeat(64))],
            relationKinds: ["reply", "reaction", "quote"],
            relayConfig: null,
        }).promise;

        expect(result.quoteRepairApplied).toBe(false);
    });

    it("child interaction repair が cancelled の場合は quote executor を呼ばない", async () => {
        const service = new PostHistoryVisibleRangeChildInteractionRepairService();
        (service as any).repairVisibleRangeChildInteractionsInternal = vi.fn(() => ({
            promise: Promise.resolve({
                status: "cancelled",
                targetParentEventIds: ["1".repeat(64)],
                checkedParentEventIds: [],
                savedParentEventIds: [],
                savedDirectReplyCount: 0,
                attemptedChunkCount: 0,
                saturatedChunkCount: 0,
                incompleteParentEventIds: ["1".repeat(64)],
                deletionConfirmationIncomplete: false,
            }),
            cancel: vi.fn(),
        }));
        const quoteExecutor = vi.fn(async () => undefined);

        const result = await service.repairVisibleRangeRelations(rxNostrMock as any, {
            ownerPubkeyHex: OWNER,
            visiblePosts: [createPost("1".repeat(64))],
            relationKinds: ["quote"],
            quoteVisibleRangeRepairExecutor: quoteExecutor,
            relayConfig: null,
        }).promise;

        expect(quoteExecutor).not.toHaveBeenCalled();
        expect(result.quoteRepairApplied).toBe(false);
    });
});
