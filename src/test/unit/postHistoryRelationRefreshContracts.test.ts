import { describe, expect, it } from "vitest";
import {
    POST_HISTORY_RELATION_REPAIR_KINDS,
    normalizePostHistoryRelationKinds,
    resolvePostHistoryRelationRefreshSignal,
} from "../../lib/postHistoryRelationRefreshContracts";

describe("postHistoryRelationRefreshContracts", () => {
    it("normalizes relation kinds and removes duplicates", () => {
        const kinds = normalizePostHistoryRelationKinds([
            "reply",
            "reaction",
            "quote",
            "reaction",
        ]);

        expect(kinds).toEqual(["reply", "reaction", "quote"]);
    });

    it("uses default relation kinds when omitted", () => {
        expect(normalizePostHistoryRelationKinds(undefined)).toEqual(
            POST_HISTORY_RELATION_REPAIR_KINDS,
        );
    });

    it("emits quote refresh signal only when quote repair is applied", () => {
        const signal = resolvePostHistoryRelationRefreshSignal("listing-current-view", {
            status: "success",
            relationKinds: ["reply", "reaction", "quote"],
            savedParentEventIds: ["p1", "p1", "p2"],
            checkedParentEventIds: ["p1", "p2"],
            quoteRepairApplied: true,
        });

        expect(signal.parentEventIds).toEqual(["p1", "p2"]);
        expect(signal.shouldRefreshQuotePreviews).toBe(true);
    });

    it("does not emit quote refresh signal when quote relation is not requested", () => {
        const signal = resolvePostHistoryRelationRefreshSignal("listing-manual-refetch", {
            status: "partial",
            relationKinds: ["reply", "reaction"],
            savedParentEventIds: ["p1"],
            checkedParentEventIds: ["p1"],
            quoteRepairApplied: true,
        });

        expect(signal.shouldRefreshQuotePreviews).toBe(false);
        expect(signal.parentEventIds).toEqual(["p1"]);
    });
});
