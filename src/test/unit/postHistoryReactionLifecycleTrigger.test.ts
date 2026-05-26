import { beforeEach, describe, expect, it, vi } from "vitest";

const getReactionRecordsMock = vi.hoisted(() => vi.fn());
const cleanupReactionDeletionsMock = vi.hoisted(() => vi.fn());
const saveManyReactionStateMock = vi.hoisted(() => vi.fn(async (inputs: any[]) =>
    inputs.map((input) => ({
        ...input,
        kind: 7,
        updatedAt: 100,
        schemaVersion: 1,
    }))
));
const reconcilePendingDeletionRequestsForRequestKeysMock = vi.hoisted(() => vi.fn(async () => undefined));

vi.mock("../../lib/postHistoryReplyEventsAdapter", () => ({
    postHistoryReactionRecordsAdapter: {
        getReactionRecords: getReactionRecordsMock,
    },
}));

vi.mock("../../lib/postHistoryReactionDeletionCleanupService", () => ({
    postHistoryReactionDeletionCleanupService: {
        cleanupReactionDeletions: cleanupReactionDeletionsMock,
    },
}));

vi.mock("../../lib/storage/postHistoryReactionDeletionStateRepository", () => ({
    postHistoryReactionDeletionStateRepository: {
        saveMany: saveManyReactionStateMock,
    },
}));

vi.mock("../../lib/postHistoryPendingDeletionRequestsReconcile", () => ({
    reconcilePendingDeletionRequestsForRequestKeys:
        reconcilePendingDeletionRequestsForRequestKeysMock,
}));

import { triggerPostHistoryReactionLifecycle } from "../../lib/postHistoryReactionLifecycleTrigger";
import { resetInFlightPostHistoryReactionLifecycleRequests } from "../../lib/postHistoryReactionLifecycleState";

const PARENT_ID = "1".repeat(64);
const REACTION_ID = "2".repeat(64);

function createDeferred<T>() {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (reason?: unknown) => void;
    const promise = new Promise<T>((nextResolve, nextReject) => {
        resolve = nextResolve;
        reject = nextReject;
    });

    return { promise, resolve, reject };
}

describe("triggerPostHistoryReactionLifecycle", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        resetInFlightPostHistoryReactionLifecycleRequests();
        getReactionRecordsMock.mockResolvedValue([{
            eventId: REACTION_ID,
        }]);
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

        expect(getReactionRecordsMock).toHaveBeenCalledWith(PARENT_ID);
        expect(cleanupReactionDeletionsMock).not.toHaveBeenCalled();
        expect(saveManyReactionStateMock).not.toHaveBeenCalled();
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
                reactionEventIds: [REACTION_ID],
                relayConfig: { "wss://read.example.com/": { read: true, write: false } },
            }),
        );
        expect(saveManyReactionStateMock.mock.calls.map(([inputs]) => inputs[0].status)).toEqual([
            "pending",
            "processing",
            "success",
        ]);
    });

    it("同一 requestKey が in-flight の間は二重 cleanup を起動しない", async () => {
        const deferred = createDeferred<{
            status: "completed";
            checkedParentEventIds: string[];
            deletedReactionEventIds: string[];
            deletionConfirmationIncomplete: boolean;
        }>();
        cleanupReactionDeletionsMock.mockReturnValueOnce(deferred.promise);

        const firstPromise = triggerPostHistoryReactionLifecycle({
            source: "inbound-realtime",
            parentEventIds: [PARENT_ID],
            rxNostr: { use: vi.fn() } as any,
        });
        await Promise.resolve();
        const secondPromise = triggerPostHistoryReactionLifecycle({
            source: "listing-current-view",
            parentEventIds: [PARENT_ID],
            rxNostr: { use: vi.fn() } as any,
        });

        deferred.resolve({
            status: "completed",
            checkedParentEventIds: [PARENT_ID],
            deletedReactionEventIds: [REACTION_ID],
            deletionConfirmationIncomplete: false,
        });

        const [firstResult, secondResult] = await Promise.all([
            firstPromise,
            secondPromise,
        ]);

        expect(cleanupReactionDeletionsMock).toHaveBeenCalledTimes(1);
        expect(firstResult.deletedReactionEventIds).toEqual([REACTION_ID]);
        expect(secondResult).toMatchObject({
            status: "completed",
            deletedReactionEventIds: [],
        });
    });

    it("partial cleanup は failed 遷移として記録する", async () => {
        cleanupReactionDeletionsMock.mockResolvedValueOnce({
            status: "partial",
            checkedParentEventIds: [PARENT_ID],
            deletedReactionEventIds: [],
            deletionConfirmationIncomplete: true,
        });

        await triggerPostHistoryReactionLifecycle({
            source: "dialog-inbound-save",
            parentEventIds: [PARENT_ID],
            rxNostr: { use: vi.fn() } as any,
        });

        expect(saveManyReactionStateMock.mock.calls.map(([inputs]) => inputs[0].status)).toEqual([
            "pending",
            "processing",
            "failed",
        ]);
    });
});