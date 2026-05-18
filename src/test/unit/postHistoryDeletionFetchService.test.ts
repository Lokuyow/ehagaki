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

import { PostHistoryDeletionFetchService } from "../../lib/postHistoryDeletionFetchService";

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

describe("PostHistoryDeletionFetchService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        rxNostrMock.emittedFilters = [];
    });

    it("reply候補をpubkeyごとにgroup化し、kind:5 / authors / #e を指定する", async () => {
        const service = new PostHistoryDeletionFetchService({
            now: () => 2000,
            setTimeoutFn: (() => 1) as any,
            clearTimeoutFn: vi.fn(),
        });
        const deletionEvent = createEvent({
            id: "9".repeat(64),
            pubkey: "a".repeat(64),
            kind: 5,
            tags: [["e", "1".repeat(64)]],
            created_at: 1_700_000_010,
        });
        rxNostrMock.use.mockReturnValue({
            subscribe: ({ next, complete }: Record<string, any>) => {
                next({ event: deletionEvent, from: "wss://relay.example.com" });
                complete();
                return { unsubscribe: vi.fn() };
            },
        });

        const task = service.fetchDeletionRequests(rxNostrMock as any, {
            targets: [
                { event: createEvent({ id: "1".repeat(64), pubkey: "a".repeat(64) }) },
                { event: createEvent({ id: "2".repeat(64), pubkey: "a".repeat(64) }) },
                { event: createEvent({ id: "3".repeat(64), pubkey: "b".repeat(64) }) },
            ],
            relayHints: ["wss://hint.example.com"],
            relayConfig: null,
        });

        await expect(task.promise).resolves.toMatchObject({
            fetchedAt: 2000,
            events: [
                {
                    event: deletionEvent,
                    relayUrls: ["wss://relay.example.com/"],
                },
            ],
        });
        expect(rxNostrMock.use).toHaveBeenCalledWith(rxReqMock, {
            on: { relays: ["wss://hint.example.com/"] },
        });
        expect(rxNostrMock.emittedFilters).toEqual([
            {
                kinds: [5],
                authors: ["a".repeat(64)],
                "#e": ["1".repeat(64), "2".repeat(64)],
            },
            {
                kinds: [5],
                authors: ["b".repeat(64)],
                "#e": ["3".repeat(64)],
            },
        ]);
        expect(rxReqMock.over).toHaveBeenCalled();
    });
});
