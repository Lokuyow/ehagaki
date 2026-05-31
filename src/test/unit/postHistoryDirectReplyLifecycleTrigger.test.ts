import { beforeEach, describe, expect, it, vi } from "vitest";

const getDirectReplyRecordsMock = vi.hoisted(() => vi.fn());
const cleanupDirectReplyDeletionsMock = vi.hoisted(() => vi.fn());
const verifyConsistencyMock = vi.hoisted(() => vi.fn(async ({
    candidates,
    statesByRequestKey,
    deletionConfirmationIncomplete,
}: any) => ({
    deletedReplyEventIds: [],
    correctedRequestKeys: [],
    resolvedRequestKeys: deletionConfirmationIncomplete
        ? []
        : candidates.map((candidate: any) => candidate.requestKey),
    statePatches: deletionConfirmationIncomplete
        ? candidates.map((candidate: any) => ({
            requestKey: candidate.requestKey,
            parentEventId: candidate.parentEventId,
            replyEventId: candidate.replyEventId,
            replyAuthorPubkey: candidate.replyAuthorPubkey,
            source: statesByRequestKey.get(candidate.requestKey)?.source ?? "listing-current-view",
            status: "failed",
        }))
        : [],
})));
const getManyReplyStateMock = vi.hoisted(() => vi.fn(async () => [] as any[]));
const deleteManyReplyStateMock = vi.hoisted(() => vi.fn(async () => undefined));
const saveManyReplyStateMock = vi.hoisted(() => vi.fn(async (inputs: any[]) =>
    inputs.map((input) => ({
        replyAuthorPubkey: "a".repeat(64),
        ...input,
        kind: 1,
        attemptCount: input.attemptCount ?? 1,
        updatedAt: 100,
        schemaVersion: 1,
    }))
));
const reconcilePendingDeletionRequestsForRequestKeysMock = vi.hoisted(() => vi.fn(async () => undefined));

vi.mock("../../lib/postHistoryChildInteractionsAdapter", () => ({
    postHistoryReactionRecordsAdapter: { getReactionRecords: vi.fn() },
    postHistoryDirectReplyRecordsAdapter: {
        getDirectReplyRecords: getDirectReplyRecordsMock,
    },
}));

vi.mock("../../lib/postHistoryDirectReplyDeletionCleanupService", () => ({
    postHistoryDirectReplyDeletionCleanupService: {
        cleanupDirectReplyDeletions: cleanupDirectReplyDeletionsMock,
    },
}));

vi.mock("../../lib/postHistoryDirectReplyDeletionConsistencyService", () => ({
    postHistoryDirectReplyDeletionConsistencyService: {
        verifyConsistency: verifyConsistencyMock,
    },
}));

vi.mock("../../lib/storage/postHistoryDirectReplyDeletionStateRepository", () => ({
    postHistoryDirectReplyDeletionStateRepository: {
        getMany: getManyReplyStateMock,
        deleteMany: deleteManyReplyStateMock,
        saveMany: saveManyReplyStateMock,
    },
}));

vi.mock("../../lib/postHistoryPendingDeletionRequestsReconcile", () => ({
    reconcilePendingDeletionRequestsForRequestKeys:
        reconcilePendingDeletionRequestsForRequestKeysMock,
}));

import { triggerPostHistoryDirectReplyLifecycle } from "../../lib/postHistoryDirectReplyLifecycleTrigger";
import { resetInFlightPostHistoryDirectReplyLifecycleRequests } from "../../lib/postHistoryDirectReplyLifecycleState";

const PARENT_ID = "1".repeat(64);
const REPLY_ID = "2".repeat(64);

function createDeferred<T>() {
    let resolve!: (value: T | PromiseLike<T>) => void;
    const promise = new Promise<T>((nextResolve) => {
        resolve = nextResolve;
    });

    return { promise, resolve };
}

describe("triggerPostHistoryDirectReplyLifecycle", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        resetInFlightPostHistoryDirectReplyLifecycleRequests();
        getDirectReplyRecordsMock.mockResolvedValue([{
            eventId: REPLY_ID,
            authorPubkey: "a".repeat(64),
        }]);
        getManyReplyStateMock.mockResolvedValue([]);
        cleanupDirectReplyDeletionsMock.mockResolvedValue({
            status: "completed",
            checkedParentEventIds: [PARENT_ID],
            deletedReplyEventIds: [],
            deletionConfirmationIncomplete: false,
        });
    });

    it("rxNostr が無いときは orchestrator を呼ばずに no-op で返す", async () => {
        const result = await triggerPostHistoryDirectReplyLifecycle({
            source: "dialog-inbound-sync",
            parentEventIds: [PARENT_ID],
        });

        expect(getDirectReplyRecordsMock).toHaveBeenCalledWith(PARENT_ID);
        expect(cleanupDirectReplyDeletionsMock).not.toHaveBeenCalled();
        expect(saveManyReplyStateMock).not.toHaveBeenCalled();
        expect(result).toMatchObject({
            source: "dialog-inbound-sync",
            status: "completed",
            checkedParentEventIds: [PARENT_ID],
            deletedReplyEventIds: [],
        });
    });

    it("parent ids を正規化して single orchestrator に委譲する", async () => {
        const rxNostr = { use: vi.fn() } as any;

        await triggerPostHistoryDirectReplyLifecycle({
            source: "listing-current-view",
            parentEventIds: [PARENT_ID, "", PARENT_ID],
            rxNostr,
            relayConfig: { "wss://read.example.com/": { read: true, write: false } },
        });

        expect(cleanupDirectReplyDeletionsMock).toHaveBeenCalledWith(
            rxNostr,
            expect.objectContaining({
                parentEventIds: [PARENT_ID],
                replyEventIds: [REPLY_ID],
                relayConfig: { "wss://read.example.com/": { read: true, write: false } },
            }),
        );
        expect(saveManyReplyStateMock.mock.calls.map(([inputs]) => inputs[0].status)).toEqual([
            "pending",
            "processing",
        ]);
        expect(deleteManyReplyStateMock).toHaveBeenCalledWith([
            `${PARENT_ID}:${REPLY_ID}:1`,
        ]);
    });

    it("同一 requestKey が in-flight の間は二重 cleanup を起動しない", async () => {
        const deferred = createDeferred<{
            status: "completed";
            checkedParentEventIds: string[];
            deletedReplyEventIds: string[];
            deletionConfirmationIncomplete: boolean;
        }>();
        cleanupDirectReplyDeletionsMock.mockReturnValueOnce(deferred.promise);

        const firstPromise = triggerPostHistoryDirectReplyLifecycle({
            source: "inbound-realtime",
            parentEventIds: [PARENT_ID],
            rxNostr: { use: vi.fn() } as any,
        });
        await Promise.resolve();
        const secondPromise = triggerPostHistoryDirectReplyLifecycle({
            source: "listing-current-view",
            parentEventIds: [PARENT_ID],
            rxNostr: { use: vi.fn() } as any,
        });

        deferred.resolve({
            status: "completed",
            checkedParentEventIds: [PARENT_ID],
            deletedReplyEventIds: [REPLY_ID],
            deletionConfirmationIncomplete: false,
        });

        const [firstResult, secondResult] = await Promise.all([firstPromise, secondPromise]);

        expect(cleanupDirectReplyDeletionsMock).toHaveBeenCalledTimes(1);
        expect(firstResult.deletedReplyEventIds).toEqual([REPLY_ID]);
        expect(secondResult).toMatchObject({
            status: "completed",
            deletedReplyEventIds: [],
        });
    });

    it("partial cleanup は failed 遷移として記録する", async () => {
        cleanupDirectReplyDeletionsMock.mockResolvedValueOnce({
            status: "partial",
            checkedParentEventIds: [PARENT_ID],
            deletedReplyEventIds: [],
            deletionConfirmationIncomplete: true,
        });

        await triggerPostHistoryDirectReplyLifecycle({
            source: "dialog-inbound-save",
            parentEventIds: [PARENT_ID],
            rxNostr: { use: vi.fn() } as any,
        });

        expect(saveManyReplyStateMock.mock.calls.map(([inputs]) => inputs[0].status)).toEqual([
            "pending",
            "processing",
            "failed",
        ]);
    });

    it("retry cooldown 中の failed request は再実行しない", async () => {
        getManyReplyStateMock.mockResolvedValueOnce([{
            requestKey: `${PARENT_ID}:${REPLY_ID}:1`,
            parentEventId: PARENT_ID,
            replyEventId: REPLY_ID,
            replyAuthorPubkey: "a".repeat(64),
            kind: 1,
            source: "listing-current-view",
            status: "failed",
            attemptCount: 1,
            updatedAt: Date.now(),
            schemaVersion: 1,
        }]);

        const result = await triggerPostHistoryDirectReplyLifecycle({
            source: "listing-current-view",
            parentEventIds: [PARENT_ID],
            rxNostr: { use: vi.fn() } as any,
        });

        expect(cleanupDirectReplyDeletionsMock).not.toHaveBeenCalled();
        expect(saveManyReplyStateMock).not.toHaveBeenCalled();
        expect(result.status).toBe("completed");
    });
});
