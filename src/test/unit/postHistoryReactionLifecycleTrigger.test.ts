import { beforeEach, describe, expect, it, vi } from "vitest";

const cleanupReactionDeletionsMock = vi.hoisted(() => vi.fn());

vi.mock("../../lib/postHistoryReactionDeletionCleanupService", () => ({
    postHistoryReactionDeletionCleanupService: {
        cleanupReactionDeletions: cleanupReactionDeletionsMock,
    },
}));

import { triggerPostHistoryReactionLifecycle } from "../../lib/postHistoryReactionLifecycleTrigger";

const PARENT_ID = "1".repeat(64);

describe("triggerPostHistoryReactionLifecycle", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        cleanupReactionDeletionsMock.mockResolvedValue({
            status: "completed",
            checkedParentEventIds: [PARENT_ID],
            deletedReactionEventIds: [],
            deletionConfirmationIncomplete: false,
        });
    });

    it("rxNostr が無いときは orchestrator を呼ばずに no-op で返す", async () => {
        const result = await triggerPostHistoryReactionLifecycle({
            source: "dialog-inbound-sync",
            parentEventIds: [PARENT_ID],
        });

        expect(cleanupReactionDeletionsMock).not.toHaveBeenCalled();
        expect(result).toMatchObject({
            source: "dialog-inbound-sync",
            status: "completed",
            checkedParentEventIds: [PARENT_ID],
            deletedReactionEventIds: [],
        });
    });

    it("parent ids を正規化して single orchestrator に委譲する", async () => {
        const rxNostr = { use: vi.fn() } as any;

        await triggerPostHistoryReactionLifecycle({
            source: "listing-current-view",
            parentEventIds: [PARENT_ID, "", PARENT_ID],
            rxNostr,
            relayConfig: { "wss://read.example.com/": { read: true, write: false } },
        });

        expect(cleanupReactionDeletionsMock).toHaveBeenCalledWith(
            rxNostr,
            expect.objectContaining({
                parentEventIds: [PARENT_ID],
                relayConfig: { "wss://read.example.com/": { read: true, write: false } },
            }),
        );
    });
});