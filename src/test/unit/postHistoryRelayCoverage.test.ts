import { describe, expect, it } from "vitest";
import { mergePostHistoryCoverageRanges, getPostHistoryQuorumCoverage, getPostHistoryConnectedCoverageUntil,
    derivePostHistoryRelayFetchCoverage, type PostHistoryRelayOutcome } from "../../lib/postHistoryRelayCoverage";

const urls = Array.from({ length: 6 }, (_, i) => `wss://relay-${i}.example.com/`);
const range = { since: 10, until: 20 };
const outcome = (overrides: Partial<PostHistoryRelayOutcome> = {}): PostHistoryRelayOutcome => ({
    relayUrl: urls[0], eoseReceived: true, verificationDrained: true, termination: "eose",
    rawCount: 0, saturated: false, oldestCreatedAt: null, ...overrides,
});

describe("post history relay query coverage", () => {
    it.each([[1, 1], [2, 1], [3, 2], [4, 2], [5, 3], [6, 3]])("requires ceil(%i / 2) distinct relay votes", (total, required) => {
        const relays = urls.slice(0, required).map((relayUrl) => ({ relayUrl, ranges: [range] }));
        expect(getPostHistoryQuorumCoverage(relays, urls.slice(0, total))).toEqual([range]);
        expect(getPostHistoryQuorumCoverage(relays.slice(0, -1), urls.slice(0, total))).toEqual([]);
    });
    it("merges overlap and inclusive one-second adjacency but retains real gaps", () => {
        expect(mergePostHistoryCoverageRanges([{ since: 15, until: 25 }, range,
            { since: 26, until: 30 }, { since: 32, until: 40 }])).toEqual([
            { since: 10, until: 30 }, { since: 32, until: 40 },
        ]);
    });
    it("counts each relay once and reevaluates the current canonical set", () => {
        const relays = [{ relayUrl: urls[0], ranges: [range, range] }, { relayUrl: urls[0], ranges: [range] }];
        expect(getPostHistoryQuorumCoverage(relays, urls.slice(0, 3))).toEqual([]);
        expect(getPostHistoryQuorumCoverage(relays, [urls[0], urls[0], urls[1]])).toEqual([range]);
        expect(getPostHistoryQuorumCoverage(relays, [urls[1]])).toEqual([]);
        expect(getPostHistoryQuorumCoverage(relays, [])).toEqual([]);
    });
    it("computes pointwise quorum where the supporting majority changes", () => {
        expect(getPostHistoryQuorumCoverage([
            { relayUrl: urls[0], ranges: [{ since: 1, until: 5 }] },
            { relayUrl: urls[1], ranges: [{ since: 1, until: 10 }] },
            { relayUrl: urls[2], ranges: [{ since: 6, until: 10 }] },
        ], urls.slice(0, 3))).toEqual([{ since: 1, until: 10 }]);
    });
    it("connects a chain without jumping a missing or saturated second", () => {
        const ranges = [{ since: 1, until: 5 }, { since: 6, until: 10 }, { since: 12, until: 20 }];
        expect(getPostHistoryConnectedCoverageUntil(ranges, 10)).toBe(1);
        expect(getPostHistoryConnectedCoverageUntil(ranges, 20)).toBe(12);
        expect(getPostHistoryConnectedCoverageUntil(ranges, 11)).toBe(11);
    });
    it("EOSE with zero or only known events is bounded query evidence, not completeness", () => {
        expect(derivePostHistoryRelayFetchCoverage({ ...range, oldestCreatedAt: null,
            outcomes: [outcome()], cancelled: false })).toEqual([{ relayUrl: urls[0], ranges: [range] }]);
        expect(derivePostHistoryRelayFetchCoverage({ ...range, oldestCreatedAt: 15,
            outcomes: [outcome({ rawCount: 1, oldestCreatedAt: 15 })], cancelled: false }))
            .toEqual([{ relayUrl: urls[0], ranges: [range] }]);
    });
    it.each([
        { eoseReceived: false }, { verificationDrained: false }, { termination: "timeout" as const },
        { termination: "error" as const }, { termination: "cancelled" as const },
    ])("does not certify an unfinished relay: %j", (overrides) => {
        expect(derivePostHistoryRelayFetchCoverage({ ...range, oldestCreatedAt: 15,
            outcomes: [outcome(overrides)], cancelled: false })).toEqual([]);
    });
    it("keeps the saturated oldest second uncovered even with EOSE", () => {
        expect(derivePostHistoryRelayFetchCoverage({ ...range, oldestCreatedAt: 15,
            outcomes: [outcome({ saturated: true, rawCount: 3, oldestCreatedAt: 15 })], cancelled: false }))
            .toEqual([{ relayUrl: urls[0], ranges: [{ since: 16, until: 20 }] }]);
        expect(derivePostHistoryRelayFetchCoverage({ ...range, oldestCreatedAt: null,
            outcomes: [outcome({ saturated: true })], cancelled: false })).toEqual([]);
    });
    it("head queries only cover the observed finite tail; an empty head covers no history", () => {
        expect(derivePostHistoryRelayFetchCoverage({ until: 20, oldestCreatedAt: 15,
            outcomes: [outcome()], cancelled: false })).toEqual([{ relayUrl: urls[0], ranges: [{ since: 15, until: 20 }] }]);
        expect(derivePostHistoryRelayFetchCoverage({ until: 20, oldestCreatedAt: null,
            outcomes: [outcome()], cancelled: false })).toEqual([]);
    });
    it("explicit cancellation suppresses even previously drained relay evidence", () => {
        expect(derivePostHistoryRelayFetchCoverage({ ...range, oldestCreatedAt: 15,
            outcomes: [outcome()], cancelled: true })).toEqual([]);
    });
});
