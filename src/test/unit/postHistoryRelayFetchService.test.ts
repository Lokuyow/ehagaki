import { beforeEach, describe, expect, it, vi } from "vitest";
import { FALLBACK_RELAYS } from "../../lib/constants";

const createRxBackwardReqMock = vi.hoisted(() => vi.fn(() => ({
    emit: vi.fn(),
    over: vi.fn(),
})));

vi.mock("rx-nostr", () => ({
    createRxBackwardReq: createRxBackwardReqMock,
}));

import type { RxNostr } from "rx-nostr";
import {
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

    it("read relay を優先して購読し、同一 eventId を relay ごとに集約する", async () => {
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
            on: { relays: ["wss://read.example.com/"] },
        });
        expect(rxReq.emit).toHaveBeenCalledWith({
            authors: ["b".repeat(64)],
            kinds: [1, 42],
            limit: 200,
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

    it("default の hard timeout は 60000ms を使う", async () => {
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
            POST_HISTORY_FETCH_TIMEOUT_MS,
        );
    });
});
