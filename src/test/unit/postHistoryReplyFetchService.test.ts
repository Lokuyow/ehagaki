import { beforeEach, describe, expect, it, vi } from "vitest";

const rxNostrMock = vi.hoisted(() => ({
    emittedFilters: [] as any[],
    use: vi.fn(),
}));

const rxReqMock = vi.hoisted(() => ({
    emit: vi.fn((filter: any) => {
        rxNostrMock.emittedFilters.push(filter);
    }),
    over: vi.fn(),
}));

vi.mock("rx-nostr", () => ({
    createRxBackwardReq: vi.fn(() => rxReqMock),
}));

import { PostHistoryReplyFetchService } from "../../lib/postHistoryReplyFetchService";

function createEvent(overrides: Record<string, any> = {}) {
    return {
        id: "1".repeat(64),
        pubkey: "a".repeat(64),
        kind: 1,
        content: "reply",
        tags: [],
        created_at: 100,
        sig: "b".repeat(128),
        ...overrides,
    };
}

describe("PostHistoryReplyFetchService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        rxNostrMock.emittedFilters = [];
    });

    it("#e で広めに取得し、kind:1 / since / limit を指定する", async () => {
        const service = new PostHistoryReplyFetchService({
            now: () => 2000,
            setTimeoutFn: (() => 1) as any,
            clearTimeoutFn: vi.fn(),
        });
        const parentEventId = "2".repeat(64);
        const reply = createEvent({
            id: "3".repeat(64),
            created_at: 1_700_000_010,
        });
        rxNostrMock.use.mockReturnValue({
            subscribe: ({ next, complete }: Record<string, any>) => {
                next({ event: reply, from: "wss://relay.example.com" });
                complete();
                return { unsubscribe: vi.fn() };
            },
        });

        const task = service.fetchDirectReplies(rxNostrMock as any, {
            eventId: parentEventId,
            createdAt: 1_700_000_000,
            relayHints: ["wss://hint.example.com"],
            relayConfig: null,
        });

        await expect(task.promise).resolves.toMatchObject({
            fetchedAt: 2000,
            events: [
                {
                    event: reply,
                    relayUrls: ["wss://relay.example.com/"],
                },
            ],
        });
        expect(rxNostrMock.use).toHaveBeenCalledWith(rxReqMock, {
            on: { relays: ["wss://hint.example.com/"] },
        });
        expect(rxNostrMock.emittedFilters).toEqual([
            {
                kinds: [1],
                "#e": [parentEventId],
                since: 1_699_913_600,
                limit: 100,
            },
        ]);
        expect(rxReqMock.over).toHaveBeenCalled();
    });

    it("複数eventIdの#e batchとrelay上限を指定できる", async () => {
        const service = new PostHistoryReplyFetchService({
            now: () => 2000,
            setTimeoutFn: (() => 1) as any,
            clearTimeoutFn: vi.fn(),
        });
        const parentEventIds = ["2".repeat(64), "4".repeat(64)];
        const reply = createEvent({
            id: "5".repeat(64),
            created_at: 1_700_000_010,
        });
        rxNostrMock.use.mockReturnValue({
            subscribe: ({ next, complete }: Record<string, any>) => {
                next({ event: reply, from: "wss://relay-b.example.com" });
                complete();
                return { unsubscribe: vi.fn() };
            },
        });

        const task = service.fetchDirectReplies(rxNostrMock as any, {
            eventId: parentEventIds[0],
            eventIds: parentEventIds,
            createdAt: 1_700_000_000,
            relayHints: [
                "wss://relay-a.example.com",
                "wss://relay-b.example.com",
                "wss://relay-c.example.com",
            ],
            relayConfig: null,
            timeoutMs: 2000,
            relayLimit: 2,
        });

        await expect(task.promise).resolves.toMatchObject({
            fetchedAt: 2000,
            events: [
                {
                    event: reply,
                    relayUrls: ["wss://relay-b.example.com/"],
                },
            ],
        });
        expect(rxNostrMock.use).toHaveBeenCalledWith(rxReqMock, {
            on: {
                relays: [
                    "wss://relay-a.example.com/",
                    "wss://relay-b.example.com/",
                ],
            },
        });
        expect(rxNostrMock.emittedFilters).toEqual([
            {
                kinds: [1],
                "#e": parentEventIds,
                since: 1_699_913_600,
                limit: 100,
            },
        ]);
    });
});
