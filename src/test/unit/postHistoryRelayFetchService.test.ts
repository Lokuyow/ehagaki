import { beforeEach, describe, expect, it, vi } from "vitest";
import { FALLBACK_RELAYS } from "../../lib/constants";

const createRxBackwardReqMock = vi.hoisted(() => vi.fn((_rxReqId?: string) => ({
    emit: vi.fn(),
    over: vi.fn(),
})));

vi.mock("rx-nostr", () => ({
    createRxBackwardReq: createRxBackwardReqMock,
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

function createEvent(overrides: Record<string, any> = {}) {
    return {
        id: "a".repeat(64),
        pubkey: "b".repeat(64),
        kind: 1,
        content: "hello",
        tags: [],
        created_at: 100,
        sig: "c".repeat(128),
        ...overrides,
    };
}

describe("PostHistoryRelayFetchService", () => {
    let service: PostHistoryRelayFetchService;
    let mockConsole: Console;

    beforeEach(() => {
        vi.clearAllMocks();
        mockConsole = {
            log: vi.fn(),
            warn: vi.fn(),
            error: vi.fn(),
        } as unknown as Console;
        service = new PostHistoryRelayFetchService({
            console: mockConsole,
            now: () => 9000,
            setTimeoutFn: vi.fn(() => 1 as unknown as ReturnType<typeof setTimeout>),
            clearTimeoutFn: vi.fn(),
        });
    });

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
        }));
    });
});
