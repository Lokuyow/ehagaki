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
            tags: [["e", parentEventId, "", "reply"]],
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
            tags: [["e", parentEventIds[0], "", "reply"]],
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

    it("kind 42 は要求した親ID・kind・channelが一致する返信だけを返す", async () => {
        const service = new PostHistoryReplyFetchService({
            now: () => 2000,
            setTimeoutFn: (() => 1) as any,
            clearTimeoutFn: vi.fn(),
        });
        const channelId = "6".repeat(64);
        const otherChannelId = "7".repeat(64);
        const parentEventId = "8".repeat(64);
        const validReply = createEvent({
            id: "9".repeat(64),
            kind: 42,
            tags: [
                ["e", channelId, "", "root"],
                ["e", parentEventId, "", "reply"],
            ],
        });
        const wrongChannelReply = createEvent({
            id: "a".repeat(64),
            kind: 42,
            tags: [
                ["e", otherChannelId, "", "root"],
                ["e", parentEventId, "", "reply"],
            ],
        });
        rxNostrMock.use.mockReturnValue({
            subscribe: ({ next, complete }: Record<string, any>) => {
                next({ event: validReply, from: "wss://relay.example.com" });
                next({ event: wrongChannelReply, from: "wss://relay.example.com" });
                complete();
                return { unsubscribe: vi.fn() };
            },
        });

        const task = service.fetchDirectReplies(rxNostrMock as any, {
            eventId: parentEventId,
            createdAt: 100,
            parents: [{
                eventId: parentEventId,
                eventKind: 42,
                channelEventId: channelId,
                createdAt: 100,
                relayHints: ["wss://relay.example.com"],
            }],
            relayConfig: null,
        });

        await expect(task.promise).resolves.toMatchObject({
            events: [{
                parentEventId,
                event: validReply,
            }],
        });
        expect(rxNostrMock.emittedFilters).toEqual([expect.objectContaining({
            kinds: [42],
            "#e": [parentEventId],
        })]);
    });

    it("errorとcancelを正常な0件取得から区別する", async () => {
        const service = new PostHistoryReplyFetchService({
            setTimeoutFn: (() => 1) as any,
            clearTimeoutFn: vi.fn(),
        });
        const parentEventId = "2".repeat(64);
        rxNostrMock.use.mockReturnValueOnce({
            subscribe: ({ error }: Record<string, any>) => {
                error(new Error("failed"));
                return { unsubscribe: vi.fn() };
            },
        });

        await expect(service.fetchDirectReplies(rxNostrMock as any, {
            eventId: parentEventId,
            createdAt: 100,
            relayConfig: null,
        }).promise).resolves.toMatchObject({ status: "failed", events: [] });

        rxNostrMock.use.mockReturnValueOnce({
            subscribe: () => ({ unsubscribe: vi.fn() }),
        });
        const cancelledTask = service.fetchDirectReplies(rxNostrMock as any, {
            eventId: parentEventId,
            createdAt: 100,
            relayConfig: null,
        });
        cancelledTask.cancel();
        await expect(cancelledTask.promise).resolves.toMatchObject({
            status: "cancelled",
            events: [],
        });
    });
});
