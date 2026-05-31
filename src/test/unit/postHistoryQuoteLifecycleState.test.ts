import { describe, expect, it } from "vitest";
import { resolvePostHistoryQuoteLifecycleStatus } from "../../lib/postHistoryQuoteLifecycleState";

describe("resolvePostHistoryQuoteLifecycleStatus", () => {
    it("loading を最優先で返す", () => {
        expect(resolvePostHistoryQuoteLifecycleStatus([
            { eventId: "1", status: "resolved", event: {} as never, profile: null },
            { eventId: "2", status: "loading" },
            { eventId: "3", status: "deleted" },
        ])).toBe("loading");
    });

    it("resolved しかなければ null を返す", () => {
        expect(resolvePostHistoryQuoteLifecycleStatus([
            { eventId: "1", status: "resolved", event: {} as never, profile: null },
        ])).toBeNull();
    });

    it("error, deleted, not-found の優先順で返す", () => {
        expect(resolvePostHistoryQuoteLifecycleStatus([
            { eventId: "1", status: "not-found" },
            { eventId: "2", status: "deleted" },
            { eventId: "3", status: "error", errorCode: "fetch_failed" },
        ])).toBe("error");
    });
});
