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

import { PostHistorySelfParentFetchService } from "../../lib/postHistorySelfParentFetchService";

const OWNER_PUBKEY = "a".repeat(64);
const PARENT_ID = "1".repeat(64);

describe("PostHistorySelfParentFetchService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        rxNostrMock.emittedFilters = [];
    });

    it("uses an authored backward id lookup for a targeted parent resolve", async () => {
        rxNostrMock.use.mockReturnValue({
            subscribe: vi.fn(({ complete }) => {
                complete();
                return { unsubscribe: vi.fn() };
            }),
        });
        const service = new PostHistorySelfParentFetchService({
            setTimeoutFn: (() => 1) as any,
            clearTimeoutFn: vi.fn(),
            console: { warn: vi.fn(), error: vi.fn() },
        });

        await service.fetchSelfParent(rxNostrMock as any, {
            parentEventId: PARENT_ID,
            ownerPubkeyHex: OWNER_PUBKEY,
            relayConfig: null,
        }).promise;

        expect(rxNostrMock.emittedFilters).toEqual([{
            ids: [PARENT_ID],
            authors: [OWNER_PUBKEY],
            kinds: [1, 42],
        }]);
    });
});
