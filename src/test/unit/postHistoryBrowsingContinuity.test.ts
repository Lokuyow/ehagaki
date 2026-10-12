import { describe, expect, it } from "vitest";
import { getPostHistoryBrowsingContinuity, getPostHistoryOlderUncoveredRange } from "../../lib/postHistoryBrowsingContinuity";

describe("local history browsing continuity", () => {
    it("uses local evidence only for browsing and retains gaps and external planning inputs", () => {
        const quorum = [{ since: 200, until: 300 }], restored = [{ since: 100, until: 149 }];
        const local = [{ since: 150, until: 199 }, { since: 10, until: 20 }];
        expect(getPostHistoryBrowsingContinuity(quorum, restored, local)).toEqual([
            { since: 10, until: 20 }, { since: 100, until: 300 },
        ]);
        expect(getPostHistoryBrowsingContinuity(quorum, restored)).toEqual([
            { since: 100, until: 149 }, { since: 200, until: 300 },
        ]);
        expect(getPostHistoryOlderUncoveredRange(getPostHistoryBrowsingContinuity(quorum, restored), 200, 1000))
            .toEqual({ since: 150, until: 199 });
    });
    it("joins adjacent relay and backup ranges without filling disconnected holes", () => {
        const relay = [{ since: 200, until: 300 }];
        expect(getPostHistoryBrowsingContinuity(relay, [{ since: 100, until: 199 }, { since: 10, until: 20 }]))
            .toEqual([{ since: 10, until: 20 }, { since: 100, until: 300 }]);
        expect(relay).toEqual([{ since: 200, until: 300 }]);
    });
    it("queries only the hole before the next older component", () => {
        const ranges = [{ since: 100, until: 200 }, { since: 10, until: 80 }];
        expect(getPostHistoryOlderUncoveredRange(ranges, 100, 1000)).toEqual({ since: 81, until: 99 });
        expect(getPostHistoryOlderUncoveredRange(ranges, 60, 1000)).toEqual({ since: 0, until: 9 });
        expect(getPostHistoryOlderUncoveredRange(ranges, 90, 1000, 50)).toEqual({ since: 81, until: 90 });
    });
    it("keeps an unresolved saturated second and permits fetching before the backup", () => {
        expect(getPostHistoryOlderUncoveredRange([{ since: 101, until: 200 }], 100, 20))
            .toEqual({ since: 80, until: 100 });
        expect(getPostHistoryOlderUncoveredRange([{ since: 0, until: 200 }], 100, 20)).toBeNull();
    });
});
