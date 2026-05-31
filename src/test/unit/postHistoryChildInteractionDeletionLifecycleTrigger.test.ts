import { describe, expect, it, vi } from "vitest";

const triggerReactionLifecycleMock = vi.hoisted(() => vi.fn());
const triggerDirectReplyLifecycleMock = vi.hoisted(() => vi.fn());

vi.mock("../../lib/postHistoryReactionLifecycleTrigger", () => ({
    triggerPostHistoryReactionLifecycle: triggerReactionLifecycleMock,
}));

vi.mock("../../lib/postHistoryDirectReplyLifecycleTrigger", () => ({
    triggerPostHistoryDirectReplyLifecycle: triggerDirectReplyLifecycleMock,
}));

import { triggerPostHistoryChildInteractionDeletionLifecycle } from "../../lib/postHistoryChildInteractionDeletionLifecycleTrigger";

describe("triggerPostHistoryChildInteractionDeletionLifecycle", () => {
    it("reaction と reply の結果を 1 つにまとめる", async () => {
        triggerReactionLifecycleMock.mockResolvedValueOnce({
            source: "dialog-inbound-save",
            status: "completed",
            checkedParentEventIds: ["parent-1"],
            deletedReactionEventIds: ["reaction-1"],
            deletionConfirmationIncomplete: false,
        });
        triggerDirectReplyLifecycleMock.mockResolvedValueOnce({
            source: "dialog-inbound-save",
            status: "partial",
            checkedParentEventIds: ["parent-1", "parent-2"],
            deletedReplyEventIds: ["reply-1"],
            deletionConfirmationIncomplete: true,
        });

        const result = await triggerPostHistoryChildInteractionDeletionLifecycle({
            source: "dialog-inbound-save",
            parentEventIds: ["parent-1"],
            rxNostr: { use: vi.fn() } as any,
        });

        expect(triggerReactionLifecycleMock).toHaveBeenCalledTimes(1);
        expect(triggerDirectReplyLifecycleMock).toHaveBeenCalledTimes(1);
        expect(result).toMatchObject({
            source: "dialog-inbound-save",
            status: "partial",
            checkedParentEventIds: ["parent-1", "parent-2"],
            deletedReactionEventIds: ["reaction-1"],
            deletedReplyEventIds: ["reply-1"],
            deletionConfirmationIncomplete: true,
        });
    });
});