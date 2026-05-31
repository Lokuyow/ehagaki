import { describe, expect, it } from "vitest";
import { createPostHistoryThreadGraphTaskTracker } from "../../lib/postHistoryThreadGraphTaskTracker";

describe("postHistoryThreadGraphTaskTracker", () => {
    it("graph request id を単調増加で管理する", () => {
        const tracker = createPostHistoryThreadGraphTaskTracker();

        expect(tracker.getRequestId()).toBe(0);
        expect(tracker.incrementRequestId()).toBe(1);
        expect(tracker.getRequestId()).toBe(1);
        expect(tracker.incrementRequestId()).toBe(2);
    });

    it("child request token を key ごとに保持し、削除と全消去ができる", () => {
        const tracker = createPostHistoryThreadGraphTaskTracker();

        const firstToken = tracker.createChildRequestToken("a");
        const secondToken = tracker.createChildRequestToken("b");

        expect(firstToken).toBe(1);
        expect(secondToken).toBe(2);
        expect(tracker.getChildRequestToken("a")).toBe(1);
        expect(tracker.getChildRequestToken("b")).toBe(2);

        tracker.deleteChildRequestToken("a");
        expect(tracker.getChildRequestToken("a")).toBeUndefined();

        tracker.clearChildRequestTokens();
        expect(tracker.getChildRequestToken("b")).toBeUndefined();
    });
});
