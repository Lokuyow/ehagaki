import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FALLBACK_RELAYS } from "../../lib/relayLists";
import type { NostrEvent } from "../../lib/types";
import { createEvent as createPostHistoryEvent } from "../postHistoryEventTestUtils";

const createRxBackwardReqMock = vi.hoisted(() => vi.fn((_rxReqId?: string) => ({
    emit: vi.fn(),
    over: vi.fn(),
})));

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

import type { RxNostr } from "rx-nostr";
import {
    POST_HISTORY_BOOTSTRAP_FETCH_TIMEOUT_MS,
    POST_HISTORY_DIALOG_OPEN_REFRESH_LIMIT,
    POST_HISTORY_DIALOG_OPEN_REFRESH_MAX_RELAY_COUNT,
    POST_HISTORY_DIALOG_OPEN_REFRESH_TIMEOUT_MS,
    POST_HISTORY_FETCH_TIMEOUT_MS,
    PostHistoryRelayFetchService,
} from "../../lib/postHistoryRelayFetchService";
import { createMockConsole } from "../helpers";
import type { MockConsole } from "../helpers";
import {
    activateHostRelayConfig,
    deactivateHostRelayConfig,
} from "../../lib/hostRelayRuntime";

function createEvent(overrides: Partial<NostrEvent> = {}): NostrEvent {
    return createPostHistoryEvent({
        id: "a".repeat(64),
        pubkey: "b".repeat(64),
        kind: 1,
        content: "hello",
        tags: [],
        created_at: 100,
        sig: "c".repeat(128),
        ...overrides,
    });
}

describe("PostHistoryRelayFetchService", () => {
    let service: PostHistoryRelayFetchService;
    let mockConsole: MockConsole;

    beforeEach(() => {
        vi.clearAllMocks();
        mockConsole = createMockConsole();
        service = new PostHistoryRelayFetchService({
            console: mockConsole,
            now: () => 9000,
            setTimeoutFn: vi.fn(() => 1 as unknown as ReturnType<typeof setTimeout>),
            clearTimeoutFn: vi.fn(),
        });
    });

    afterEach(() => deactivateHostRelayConfig());

    it("write relay と read relay を購読し、同一 eventId を relay ごとに集約する", async () => {
        const unsubscribe = vi.fn();
        const mockRxNostr: RxNostr = {
            use: vi.fn().mockReturnValue({
                subscribe: vi.fn((observer: any) => {
                    observer.next?.({
                        event: createEvent(),
                        from: "wss://relay-a.example.com",
                    });
                    observer.next?.({
                        event: createEvent(),
                        from: "wss://relay-b.example.com",
                    });
                    observer.complete?.();
                    return { unsubscribe };
                }),
            }),
        } as any;

        const result = await service.fetchLatest(mockRxNostr, {
            pubkeyHex: "b".repeat(64),
            relayConfig: {
                "wss://read.example.com/": { read: true, write: false },
                "wss://write.example.com/": { read: false, write: true },
            },
        }).promise;

        const rxReq = createRxBackwardReqMock.mock.results[0]?.value;

        expect(mockRxNostr.use).toHaveBeenCalledWith(expect.anything(), {
            on: { relays: ["wss://write.example.com/", "wss://read.example.com/"] },
        });
        expect(rxReq.emit).toHaveBeenCalledWith({
            authors: ["b".repeat(64)],
            kinds: [1, 42],
            limit: 150,
        });
        expect(rxReq.over).toHaveBeenCalledOnce();
        expect(result.status).toBe("success");
        expect(result.events).toHaveLength(1);
        expect(result.events[0].relayUrls).toEqual([
            "wss://relay-a.example.com/",
            "wss://relay-b.example.com/",
        ]);
        expect(result.nextUntil).toBe(100);
        expect(result.hasMore).toBe(false);
    });

    it("write-only relay でも fallback せず購読する", async () => {
        const mockRxNostr: RxNostr = {
            use: vi.fn().mockReturnValue({
                subscribe: vi.fn((observer: any) => {
                    observer.complete?.();
                    return { unsubscribe: vi.fn() };
                }),
            }),
        } as any;

        await service.fetchLatest(mockRxNostr, {
            pubkeyHex: "b".repeat(64),
            relayConfig: {
                "wss://write-only.example.com/": { read: false, write: true },
            },
        }).promise;

        expect(mockRxNostr.use).toHaveBeenCalledWith(expect.anything(), {
            on: { relays: ["wss://write-only.example.com/"] },
        });
    });

    it("read relay が無い場合は fallback relays を使う", async () => {
        const mockRxNostr: RxNostr = {
            use: vi.fn().mockReturnValue({
                subscribe: vi.fn((observer: any) => {
                    observer.complete?.();
                    return { unsubscribe: vi.fn() };
                }),
            }),
        } as any;

        await service.fetchLatest(mockRxNostr, {
            pubkeyHex: "b".repeat(64),
            relayConfig: null,
        }).promise;

        expect(mockRxNostr.use).toHaveBeenCalledWith(expect.anything(), {
            on: { relays: FALLBACK_RELAYS },
        });
    });

    it("Host read defaults are not truncated by dialog refresh limits", async () => {
        const hostConfig = Object.fromEntries(Array.from({ length: 6 }, (_, index) => [
            `wss://host-read-${index + 1}.example`,
            { read: true, write: false },
        ]));
        activateHostRelayConfig(hostConfig);
        const mockRxNostr: RxNostr = {
            use: vi.fn().mockReturnValue({
                subscribe: vi.fn((observer: any) => {
                    observer.complete?.();
                    return { unsubscribe: vi.fn() };
                }),
            }),
        } as any;

        await service.fetchLatest(mockRxNostr, {
            pubkeyHex: "b".repeat(64),
            relayConfig: hostConfig,
            reason: "dialog-open-refresh",
        }).promise;

        expect(mockRxNostr.use).toHaveBeenCalledWith(expect.anything(), {
            on: {
                relays: Array.from({ length: 6 }, (_, index) =>
                    `wss://host-read-${index + 1}.example/`),
            },
        });
    });

    it("nextUntil はイベントを返した relay ごとの oldestCreatedAt の最大値を使う", async () => {
        const mockRxNostr: RxNostr = {
            use: vi.fn().mockReturnValue({
                subscribe: vi.fn((observer: any) => {
                    observer.next?.({
                        event: createEvent({ id: "1".repeat(64), created_at: 1200 }),
                        from: "wss://relay-a.example.com",
                    });
                    observer.next?.({
                        event: createEvent({ id: "2".repeat(64), created_at: 1100 }),
                        from: "wss://relay-a.example.com",
                    });
                    observer.next?.({
                        event: createEvent({ id: "3".repeat(64), created_at: 1000 }),
                        from: "wss://relay-a.example.com",
                    });
                    observer.next?.({
                        event: createEvent({ id: "4".repeat(64), created_at: 500 }),
                        from: "wss://relay-b.example.com",
                    });
                    observer.complete?.();
                    return { unsubscribe: vi.fn() };
                }),
            }),
        } as any;

        const result = await service.fetchLatest(mockRxNostr, {
            pubkeyHex: "b".repeat(64),
            relayConfig: {
                "wss://relay-a.example.com/": { read: true, write: true },
                "wss://relay-b.example.com/": { read: true, write: true },
                "wss://relay-silent.example.com/": { read: true, write: true },
            },
            limit: 3,
        }).promise;

        expect(result.nextUntil).toBe(1000);
        expect(result.hasMore).toBe(true);
        expect(result.observedRelayUrls).toEqual([
            "wss://relay-a.example.com/",
            "wss://relay-b.example.com/",
        ]);
        expect(result.perRelayCounts).toEqual([
            {
                relayUrl: "wss://relay-a.example.com/",
                rawCount: 3,
                uniqueCount: 3,
            },
            {
                relayUrl: "wss://relay-b.example.com/",
                rawCount: 1,
                uniqueCount: 1,
            },
        ]);
    });

    it("perRelay rawCount が limit に達したら uniqueCount が足りなくても hasMore を維持する", async () => {
        const mockRxNostr: RxNostr = {
            use: vi.fn().mockReturnValue({
                subscribe: vi.fn((observer: any) => {
                    observer.next?.({
                        event: createEvent({ id: "1".repeat(64), created_at: 1200 }),
                        from: "wss://relay-a.example.com",
                    });
                    observer.next?.({
                        event: createEvent({ id: "1".repeat(64), created_at: 1200 }),
                        from: "wss://relay-a.example.com",
                    });
                    observer.next?.({
                        event: createEvent({ id: "1".repeat(64), created_at: 1200 }),
                        from: "wss://relay-a.example.com",
                    });
                    observer.complete?.();
                    return { unsubscribe: vi.fn() };
                }),
            }),
        } as any;

        const result = await service.fetchLatest(mockRxNostr, {
            pubkeyHex: "b".repeat(64),
            limit: 3,
        }).promise;

        expect(result.uniqueCount).toBe(1);
        expect(result.perRelayCounts).toEqual([
            {
                relayUrl: "wss://relay-a.example.com/",
                rawCount: 3,
                uniqueCount: 1,
            },
        ]);
        expect(result.hasMore).toBe(true);
        expect(result.nextUntil).toBe(1200);
    });

    it("cancel 時に購読を解除して cancelled を返す", async () => {
        const unsubscribe = vi.fn();
        const mockRxNostr: RxNostr = {
            use: vi.fn().mockReturnValue({
                subscribe: vi.fn(() => ({ unsubscribe })),
            }),
        } as any;

        const task = service.fetchLatest(mockRxNostr, {
            pubkeyHex: "b".repeat(64),
        });

        task.cancel();
        const result = await task.promise;

        expect(result.status).toBe("cancelled");
        expect(unsubscribe).toHaveBeenCalledOnce();
    });

    it("default の hard timeout は bootstrap timeout を使う", async () => {
        const mockRxNostr: RxNostr = {
            use: vi.fn().mockReturnValue({
                subscribe: vi.fn((observer: any) => {
                    observer.complete?.();
                    return { unsubscribe: vi.fn() };
                }),
            }),
        } as any;

        await service.fetchLatest(mockRxNostr, {
            pubkeyHex: "b".repeat(64),
        }).promise;

        expect(service["setTimeoutFn"]).toHaveBeenCalledWith(
            expect.any(Function),
            POST_HISTORY_BOOTSTRAP_FETCH_TIMEOUT_MS,
        );
        expect(POST_HISTORY_FETCH_TIMEOUT_MS).toBe(POST_HISTORY_BOOTSTRAP_FETCH_TIMEOUT_MS);
    });

    it("dialog-open-refresh は小さい limit と短い timeout と relay 上限を使う", async () => {
        const relayConfig = Object.fromEntries(
            Array.from({ length: POST_HISTORY_DIALOG_OPEN_REFRESH_MAX_RELAY_COUNT + 2 }, (_, index) => [
                `wss://relay-${index}.example.com/`,
                { read: true, write: true },
            ]),
        );
        const mockRxNostr: RxNostr = {
            use: vi.fn().mockReturnValue({
                subscribe: vi.fn((observer: any) => {
                    observer.complete?.();
                    return { unsubscribe: vi.fn() };
                }),
            }),
        } as any;

        await service.fetchLatest(mockRxNostr, {
            pubkeyHex: "b".repeat(64),
            relayConfig,
            reason: "dialog-open-refresh",
        }).promise;

        const rxReq = createRxBackwardReqMock.mock.results[0]?.value;

        expect(rxReq.emit).toHaveBeenCalledWith({
            authors: ["b".repeat(64)],
            kinds: [1, 42],
            limit: POST_HISTORY_DIALOG_OPEN_REFRESH_LIMIT,
        });
        expect(mockRxNostr.use).toHaveBeenCalledWith(expect.anything(), {
            on: {
                relays: [
                    "wss://relay-0.example.com/",
                    "wss://relay-1.example.com/",
                    "wss://relay-2.example.com/",
                    "wss://relay-3.example.com/",
                ],
            },
        });
        expect(service["setTimeoutFn"]).toHaveBeenCalledWith(
            expect.any(Function),
            POST_HISTORY_DIALOG_OPEN_REFRESH_TIMEOUT_MS,
        );
    });

    it("visibility-resume は dialog recent refresh と同じ小さい backward fetch 設定を使う", async () => {
        const mockRxNostr: RxNostr = {
            use: vi.fn().mockReturnValue({
                subscribe: vi.fn((observer: any) => {
                    observer.complete?.();
                    return { unsubscribe: vi.fn() };
                }),
            }),
        } as any;

        await service.fetchLatest(mockRxNostr, {
            pubkeyHex: "b".repeat(64),
            reason: "visibility-resume",
            since: 123,
        }).promise;

        const rxReq = createRxBackwardReqMock.mock.results[0]?.value;
        expect(rxReq.emit).toHaveBeenCalledWith({
            authors: ["b".repeat(64)],
            kinds: [1, 42],
            limit: POST_HISTORY_DIALOG_OPEN_REFRESH_LIMIT,
            since: 123,
        });
        expect(service["setTimeoutFn"]).toHaveBeenCalledWith(
            expect.any(Function),
            POST_HISTORY_DIALOG_OPEN_REFRESH_TIMEOUT_MS,
        );
    });

    it("repair-visible-range は req 単位で relay 応答と失敗を集計する", async () => {
        let messageObserver: any;
        let errorObserver: any;
        let connectionStateObserver: any;
        const unsubscribe = vi.fn();
        const mockRxNostr: RxNostr = {
            createAllMessageObservable: vi.fn().mockReturnValue({
                subscribe: vi.fn((observer: any) => {
                    messageObserver = observer;
                    return { unsubscribe: vi.fn() };
                }),
            }),
            createAllErrorObservable: vi.fn().mockReturnValue({
                subscribe: vi.fn((observer: any) => {
                    errorObserver = observer;
                    return { unsubscribe: vi.fn() };
                }),
            }),
            createConnectionStateObservable: vi.fn().mockReturnValue({
                subscribe: vi.fn((observer: any) => {
                    connectionStateObserver = observer;
                    return { unsubscribe: vi.fn() };
                }),
            }),
            use: vi.fn().mockReturnValue({
                subscribe: vi.fn((observer: any) => {
                    const rxReqId = createRxBackwardReqMock.mock.calls[0]?.[0];
                    expect(rxReqId).toMatch(/^post-history-repair-/);
                    observer.next?.({
                        event: createEvent({ id: "1".repeat(64), created_at: 1200 }),
                        from: "wss://relay-a.example.com",
                    });
                    messageObserver.next?.({
                        type: "EOSE",
                        subId: `${rxReqId}:0`,
                        from: "wss://relay-a.example.com",
                        message: ["EOSE", `${rxReqId}:0`],
                    });
                    messageObserver.next?.({
                        type: "CLOSED",
                        subId: `${rxReqId}:0`,
                        from: "wss://relay-b.example.com",
                        notice: "blocked",
                        message: ["CLOSED", `${rxReqId}:0`, "blocked"],
                    });
                    errorObserver.next?.({
                        from: "wss://relay-b.example.com",
                        reason: new Error("socket failed"),
                    });
                    connectionStateObserver.next?.({
                        from: "wss://relay-b.example.com",
                        state: "error",
                    });
                    observer.complete?.();
                    return { unsubscribe };
                }),
            }),
        } as any;

        const result = await service.fetchLatest(mockRxNostr, {
            pubkeyHex: "b".repeat(64),
            reason: "repair-visible-range",
            relayConfig: {
                "wss://relay-a.example.com/": { read: true, write: true },
                "wss://relay-b.example.com/": { read: true, write: true },
            },
        }).promise;

        expect(createRxBackwardReqMock).toHaveBeenCalledWith(expect.stringMatching(/^post-history-repair-/));
        expect(result).toEqual(expect.objectContaining({
            requestedRelayUrls: ["wss://relay-a.example.com/", "wss://relay-b.example.com/"],
            eventRelayUrls: ["wss://relay-a.example.com/"],
            eoseRelayUrls: ["wss://relay-a.example.com/"],
            closedRelayUrls: ["wss://relay-b.example.com/"],
            errorRelayUrls: ["wss://relay-b.example.com/"],
            downRelayUrls: ["wss://relay-b.example.com/"],
            completedByRxNostr: true,
            completedByLocalTimeout: false,
            hasAnyRelayResponse: true,
            allRelaysFailed: false,
        }));
    });

    it("全 relay が明確に失敗し EVENT/EOSE/NOTICE がなければ allRelaysFailed を返す", async () => {
        let errorObserver: any;
        let connectionStateObserver: any;
        const mockRxNostr: RxNostr = {
            createAllMessageObservable: vi.fn().mockReturnValue({
                subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })),
            }),
            createAllErrorObservable: vi.fn().mockReturnValue({
                subscribe: vi.fn((observer: any) => {
                    errorObserver = observer;
                    return { unsubscribe: vi.fn() };
                }),
            }),
            createConnectionStateObservable: vi.fn().mockReturnValue({
                subscribe: vi.fn((observer: any) => {
                    connectionStateObserver = observer;
                    return { unsubscribe: vi.fn() };
                }),
            }),
            use: vi.fn().mockReturnValue({
                subscribe: vi.fn((observer: any) => {
                    errorObserver.next?.({
                        from: "wss://relay-a.example.com",
                        reason: new Error("socket failed"),
                    });
                    connectionStateObserver.next?.({
                        from: "wss://relay-b.example.com",
                        state: "rejected",
                    });
                    observer.complete?.();
                    return { unsubscribe: vi.fn() };
                }),
            }),
        } as any;

        const result = await service.fetchLatest(mockRxNostr, {
            pubkeyHex: "b".repeat(64),
            reason: "repair-visible-range",
            relayConfig: {
                "wss://relay-a.example.com/": { read: true, write: true },
                "wss://relay-b.example.com/": { read: true, write: true },
            },
        }).promise;

        expect(result).toEqual(expect.objectContaining({
            eventRelayUrls: [],
            eoseRelayUrls: [],
            errorRelayUrls: ["wss://relay-a.example.com/"],
            downRelayUrls: ["wss://relay-b.example.com/"],
            hasAnyRelayResponse: false,
            allRelaysFailed: true,
            allCoverageRelaysFailed: true,
            coverageComplete: false,
        }));
    });

    it("write baseline EOSE の後も verified coverage stream が drain するまで確定せず read best-effort を解除する", async () => {
        let messageObserver: any;
        const subscriptions: Array<{ observer: any; options: any; unsubscribe: ReturnType<typeof vi.fn> }> = [];
        const mockRxNostr: RxNostr = {
            createAllMessageObservable: vi.fn().mockReturnValue({
                subscribe: vi.fn((observer: any) => {
                    messageObserver = observer;
                    return { unsubscribe: vi.fn() };
                }),
            }),
            createAllErrorObservable: vi.fn().mockReturnValue({ subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })) }),
            createConnectionStateObservable: vi.fn().mockReturnValue({ subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })) }),
            use: vi.fn((_request: unknown, options: unknown) => ({
                subscribe: vi.fn((observer: any) => {
                    const unsubscribe = vi.fn();
                    subscriptions.push({ observer, options, unsubscribe });
                    return { unsubscribe };
                }),
            })),
        } as any;

        const task = service.fetchLatest(mockRxNostr, {
            pubkeyHex: "b".repeat(64),
            reason: "repair-visible-range",
            relayConfig: {
                "wss://write.example.com/": { read: false, write: true },
                "wss://read.example.com/": { read: true, write: false },
            },
        });
        const coverageSubId = `${createRxBackwardReqMock.mock.calls[0][0]}:0`;
        let settled = false;
        void task.promise.then(() => { settled = true; });

        messageObserver.next({
            type: "EVENT",
            subId: coverageSubId,
            from: "wss://write.example.com",
            message: ["EVENT"],
        });
        messageObserver.next({
            type: "EOSE",
            subId: coverageSubId,
            from: "wss://write.example.com",
            message: ["EOSE", coverageSubId],
        });
        await Promise.resolve();

        expect(subscriptions.map((item) => item.options)).toEqual([
            { on: { relays: ["wss://write.example.com/"] } },
            { on: { relays: ["wss://read.example.com/"] } },
        ]);
        expect(subscriptions[1].unsubscribe).toHaveBeenCalledOnce();
        expect(settled).toBe(false);

        subscriptions[0].observer.next({
            event: createEvent({ id: "d".repeat(64) }),
            from: "wss://write.example.com",
        });
        subscriptions[0].observer.complete();

        await expect(task.promise).resolves.toEqual(expect.objectContaining({
            status: "success",
            coverageComplete: true,
            coverageSaturated: false,
            events: [expect.objectContaining({ event: expect.objectContaining({ id: "d".repeat(64) }) })],
        }));
    });

    it("auth-required CLOSED 後に baseline EOSE が届けば coverage success にする", async () => {
        let messageObserver: any;
        let coverageObserver: any;
        const mockRxNostr: RxNostr = {
            createAllMessageObservable: vi.fn().mockReturnValue({ subscribe: vi.fn((observer: any) => {
                messageObserver = observer;
                return { unsubscribe: vi.fn() };
            }) }),
            createAllErrorObservable: vi.fn().mockReturnValue({ subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })) }),
            createConnectionStateObservable: vi.fn().mockReturnValue({ subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })) }),
            use: vi.fn().mockReturnValue({ subscribe: vi.fn((observer: any) => {
                coverageObserver = observer;
                return { unsubscribe: vi.fn() };
            }) }),
        } as any;
        const task = service.fetchLatest(mockRxNostr, {
            pubkeyHex: "b".repeat(64),
            reason: "repair-visible-range",
            relayConfig: { "wss://write.example.com/": { read: false, write: true } },
        });
        const subId = `${createRxBackwardReqMock.mock.calls[0][0]}:0`;

        messageObserver.next({ type: "CLOSED", subId, from: "wss://write.example.com", notice: "auth-required: sign in", message: ["CLOSED"] });
        messageObserver.next({ type: "EOSE", subId, from: "wss://write.example.com", message: ["EOSE"] });
        coverageObserver.complete();

        await expect(task.promise).resolves.toEqual(expect.objectContaining({
            coverageComplete: true,
            coverageSaturated: false,
            closedRelayUrls: ["wss://write.example.com/"],
        }));
    });

    it("raw EVENT 250件・verified 249件では baseline saturation を返す", async () => {
        let messageObserver: any;
        let coverageObserver: any;
        const mockRxNostr: RxNostr = {
            createAllMessageObservable: vi.fn().mockReturnValue({ subscribe: vi.fn((observer: any) => { messageObserver = observer; return { unsubscribe: vi.fn() }; }) }),
            createAllErrorObservable: vi.fn().mockReturnValue({ subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })) }),
            createConnectionStateObservable: vi.fn().mockReturnValue({ subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })) }),
            use: vi.fn().mockReturnValue({ subscribe: vi.fn((observer: any) => { coverageObserver = observer; return { unsubscribe: vi.fn() }; }) }),
        } as any;
        const task = service.fetchLatest(mockRxNostr, {
            pubkeyHex: "b".repeat(64),
            reason: "repair-visible-range",
            relayConfig: { "wss://write.example.com/": { read: false, write: true } },
        });
        const subId = `${createRxBackwardReqMock.mock.calls[0][0]}:0`;
        for (let index = 0; index < 250; index += 1) {
            messageObserver.next({ type: "EVENT", subId, from: "wss://write.example.com", message: ["EVENT"] });
        }
        for (let index = 0; index < 249; index += 1) {
            coverageObserver.next({
                event: createEvent({ id: index.toString(16).padStart(64, "0") }),
                from: "wss://write.example.com",
            });
        }
        messageObserver.next({ type: "EOSE", subId, from: "wss://write.example.com", message: ["EOSE"] });
        coverageObserver.complete();

        await expect(task.promise).resolves.toEqual(expect.objectContaining({
            coverageComplete: true,
            coverageSaturated: true,
            hasMore: true,
            rawCount: 250,
            uniqueCount: 249,
        }));
    });

    it("Relayごとの count が limit 未満なら aggregate が 250 以上でも saturation にしない", async () => {
        let messageObserver: any;
        let coverageObserver: any;
        const mockRxNostr: RxNostr = {
            createAllMessageObservable: vi.fn().mockReturnValue({ subscribe: vi.fn((observer: any) => { messageObserver = observer; return { unsubscribe: vi.fn() }; }) }),
            createAllErrorObservable: vi.fn().mockReturnValue({ subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })) }),
            createConnectionStateObservable: vi.fn().mockReturnValue({ subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })) }),
            use: vi.fn().mockReturnValue({ subscribe: vi.fn((observer: any) => { coverageObserver = observer; return { unsubscribe: vi.fn() }; }) }),
        } as any;
        const task = service.fetchLatest(mockRxNostr, {
            pubkeyHex: "b".repeat(64),
            reason: "repair-visible-range",
            relayConfig: {
                "wss://write-a.example.com/": { read: false, write: true },
                "wss://write-b.example.com/": { read: false, write: true },
            },
        });
        const subId = `${createRxBackwardReqMock.mock.calls[0][0]}:0`;
        for (const relayUrl of ["wss://write-a.example.com", "wss://write-b.example.com"]) {
            for (let index = 0; index < 125; index += 1) {
                messageObserver.next({ type: "EVENT", subId, from: relayUrl, message: ["EVENT"] });
            }
            messageObserver.next({ type: "EOSE", subId, from: relayUrl, message: ["EOSE"] });
        }
        coverageObserver.complete();

        await expect(task.promise).resolves.toEqual(expect.objectContaining({
            rawCount: 250,
            coverageComplete: true,
            coverageSaturated: false,
            hasMore: false,
        }));
    });

    it("best-effort read Relay だけの saturation は coverage partial にしない", async () => {
        let messageObserver: any;
        const observers: any[] = [];
        const mockRxNostr: RxNostr = {
            createAllMessageObservable: vi.fn().mockReturnValue({ subscribe: vi.fn((observer: any) => { messageObserver = observer; return { unsubscribe: vi.fn() }; }) }),
            createAllErrorObservable: vi.fn().mockReturnValue({ subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })) }),
            createConnectionStateObservable: vi.fn().mockReturnValue({ subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })) }),
            use: vi.fn().mockReturnValue({ subscribe: vi.fn((observer: any) => {
                observers.push(observer);
                return { unsubscribe: vi.fn() };
            }) }),
        } as any;
        const task = service.fetchLatest(mockRxNostr, {
            pubkeyHex: "b".repeat(64),
            reason: "repair-visible-range",
            relayConfig: {
                "wss://write.example.com/": { read: false, write: true },
                "wss://read.example.com/": { read: true, write: false },
            },
        });
        const coverageSubId = `${createRxBackwardReqMock.mock.calls[0][0]}:0`;
        const bestEffortSubId = `${createRxBackwardReqMock.mock.calls[1][0]}:0`;
        for (let index = 0; index < 250; index += 1) {
            messageObserver.next({ type: "EVENT", subId: bestEffortSubId, from: "wss://read.example.com", message: ["EVENT"] });
        }
        messageObserver.next({ type: "EOSE", subId: coverageSubId, from: "wss://write.example.com", message: ["EOSE"] });
        observers[0].complete();

        await expect(task.promise).resolves.toEqual(expect.objectContaining({
            coverageComplete: true,
            coverageSaturated: false,
            hasMore: false,
            rawCount: 250,
        }));
    });

    it("best-effort EOSE は write coverage baseline の全明示失敗を隠さない", async () => {
        let messageObserver: any;
        let errorObserver: any;
        let connectionStateObserver: any;
        const observers: any[] = [];
        const mockRxNostr: RxNostr = {
            createAllMessageObservable: vi.fn().mockReturnValue({ subscribe: vi.fn((observer: any) => {
                messageObserver = observer;
                return { unsubscribe: vi.fn() };
            }) }),
            createAllErrorObservable: vi.fn().mockReturnValue({ subscribe: vi.fn((observer: any) => {
                errorObserver = observer;
                return { unsubscribe: vi.fn() };
            }) }),
            createConnectionStateObservable: vi.fn().mockReturnValue({ subscribe: vi.fn((observer: any) => {
                connectionStateObserver = observer;
                return { unsubscribe: vi.fn() };
            }) }),
            use: vi.fn().mockReturnValue({ subscribe: vi.fn((observer: any) => {
                observers.push(observer);
                return { unsubscribe: vi.fn() };
            }) }),
        } as any;
        const task = service.fetchLatest(mockRxNostr, {
            pubkeyHex: "b".repeat(64),
            reason: "repair-visible-range",
            relayConfig: {
                "wss://write.example.com/": { read: false, write: true },
                "wss://read.example.com/": { read: true, write: false },
            },
        });
        const coverageSubId = `${createRxBackwardReqMock.mock.calls[0][0]}:0`;
        const bestEffortSubId = `${createRxBackwardReqMock.mock.calls[1][0]}:0`;

        messageObserver.next({ type: "CLOSED", subId: coverageSubId, from: "wss://write.example.com", notice: "blocked", message: ["CLOSED"] });
        errorObserver.next({ from: "wss://write.example.com", reason: new Error("socket failed") });
        connectionStateObserver.next({ from: "wss://write.example.com", state: "error" });
        messageObserver.next({ type: "EOSE", subId: bestEffortSubId, from: "wss://read.example.com", message: ["EOSE"] });
        observers[0].complete();

        await expect(task.promise).resolves.toEqual(expect.objectContaining({
            events: [],
            coverageComplete: false,
            allCoverageRelaysFailed: true,
            hasAnyRelayResponse: true,
            eoseRelayUrls: ["wss://read.example.com/"],
        }));
    });

    it("cancel は coverage と best-effort の verified/raw telemetry subscriptions をすべて解除する", async () => {
        const rawUnsubscribe = vi.fn();
        const errorUnsubscribe = vi.fn();
        const connectionUnsubscribe = vi.fn();
        const verifiedUnsubscribes: ReturnType<typeof vi.fn>[] = [];
        const mockRxNostr: RxNostr = {
            createAllMessageObservable: vi.fn().mockReturnValue({ subscribe: vi.fn(() => ({ unsubscribe: rawUnsubscribe })) }),
            createAllErrorObservable: vi.fn().mockReturnValue({ subscribe: vi.fn(() => ({ unsubscribe: errorUnsubscribe })) }),
            createConnectionStateObservable: vi.fn().mockReturnValue({ subscribe: vi.fn(() => ({ unsubscribe: connectionUnsubscribe })) }),
            use: vi.fn().mockReturnValue({ subscribe: vi.fn(() => {
                const unsubscribe = vi.fn();
                verifiedUnsubscribes.push(unsubscribe);
                return { unsubscribe };
            }) }),
        } as any;
        const task = service.fetchLatest(mockRxNostr, {
            pubkeyHex: "b".repeat(64),
            reason: "repair-visible-range",
            relayConfig: {
                "wss://write.example.com/": { read: false, write: true },
                "wss://read.example.com/": { read: true, write: false },
            },
        });

        task.cancel();

        await expect(task.promise).resolves.toEqual(expect.objectContaining({ status: "cancelled" }));
        expect(verifiedUnsubscribes).toHaveLength(2);
        verifiedUnsubscribes.forEach((unsubscribe) => expect(unsubscribe).toHaveBeenCalledOnce());
        expect(rawUnsubscribe).toHaveBeenCalledOnce();
        expect(errorUnsubscribe).toHaveBeenCalledOnce();
        expect(connectionUnsubscribe).toHaveBeenCalledOnce();
    });

    it("repair baseline は write、無ければ read、無ければ fallback を使う", async () => {
        const requestedRelayGroups: string[][] = [];
        const mockRxNostr: RxNostr = {
            use: vi.fn((_request: unknown, options: { on?: { relays?: string[] } }) => ({
                subscribe: vi.fn((observer: any) => {
                    requestedRelayGroups.push(options.on?.relays ?? []);
                    observer.complete?.();
                    return { unsubscribe: vi.fn() };
                }),
            })),
        } as any;

        await service.fetchLatest(mockRxNostr, {
            pubkeyHex: "b".repeat(64),
            reason: "repair-visible-range",
            relayConfig: { "wss://read.example.com/": { read: true, write: false } },
        }).promise;
        await service.fetchLatest(mockRxNostr, {
            pubkeyHex: "b".repeat(64),
            reason: "repair-visible-range",
            relayConfig: null,
        }).promise;

        expect(requestedRelayGroups).toEqual([
            ["wss://read.example.com/"],
            FALLBACK_RELAYS,
        ]);
    });
});
