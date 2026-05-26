import { describe, expect, it, vi } from "vitest";
import {
    PostHistoryReactionDeletionConsistencyService,
} from "../../lib/postHistoryReactionDeletionConsistencyService";

const PARENT_ID = "1".repeat(64);
const REACTION_ID = "2".repeat(64);
const AUTHOR_PUBKEY = "a".repeat(64);
const REQUEST_KEY = `${PARENT_ID}:${REACTION_ID}:7`;

function createStateRecord(status: "pending" | "processing" | "success" | "failed") {
    return {
        requestKey: REQUEST_KEY,
        parentEventId: PARENT_ID,
        reactionEventId: REACTION_ID,
        reactionAuthorPubkey: AUTHOR_PUBKEY,
        kind: 7 as const,
        source: "listing-current-view" as const,
        status,
        attemptCount: 1,
        deletionConfirmed: false,
        consistencyStatus: "processing-allowed" as const,
        verifiedAt: null,
        updatedAt: 100,
        schemaVersion: 1,
    };
}

describe("PostHistoryReactionDeletionConsistencyService", () => {
    it("deletion request が確認できた row は purge して success-deleted に収束させる", async () => {
        const deleteChildInteractionByEventId = vi.fn(async () => undefined);
        const service = new PostHistoryReactionDeletionConsistencyService({
            reactionRecordsAdapter: {
                getReactionRecords: vi.fn(async () => [{
                    eventId: REACTION_ID,
                    authorPubkey: AUTHOR_PUBKEY,
                } as any]),
            },
            deletionRequestsRepository: {
                getDeletedTargets: vi.fn(async () => new Map([
                    [AUTHOR_PUBKEY, new Set([REACTION_ID])],
                ])),
            },
            childInteractionsRepository: {
                deleteChildInteractionByEventId,
            },
        });

        const result = await service.verifyConsistency({
            candidates: [{
                requestKey: REQUEST_KEY,
                parentEventId: PARENT_ID,
                reactionEventId: REACTION_ID,
                reactionAuthorPubkey: AUTHOR_PUBKEY,
                kind: 7,
            }],
            statesByRequestKey: new Map([
                [REQUEST_KEY, createStateRecord("processing")],
            ]),
        });

        expect(deleteChildInteractionByEventId).toHaveBeenCalledWith(REACTION_ID);
        expect(result.deletedReactionEventIds).toEqual([REACTION_ID]);
        expect(result.statePatches).toEqual([
            expect.objectContaining({
                requestKey: REQUEST_KEY,
                status: "success",
                deletionConfirmed: true,
                consistencyStatus: "success-deleted",
            }),
        ]);
    });

    it("deletion confirmation が incomplete なら tombstone 未確認 row を retryable-failed に戻す", async () => {
        const deleteChildInteractionByEventId = vi.fn(async () => undefined);
        const service = new PostHistoryReactionDeletionConsistencyService({
            reactionRecordsAdapter: {
                getReactionRecords: vi.fn(async () => [{
                    eventId: REACTION_ID,
                    authorPubkey: AUTHOR_PUBKEY,
                } as any]),
            },
            deletionRequestsRepository: {
                getDeletedTargets: vi.fn(async () => new Map()),
            },
            childInteractionsRepository: {
                deleteChildInteractionByEventId,
            },
        });

        const result = await service.verifyConsistency({
            candidates: [{
                requestKey: REQUEST_KEY,
                parentEventId: PARENT_ID,
                reactionEventId: REACTION_ID,
                reactionAuthorPubkey: AUTHOR_PUBKEY,
                kind: 7,
            }],
            statesByRequestKey: new Map([
                [REQUEST_KEY, createStateRecord("processing")],
            ]),
            deletionConfirmationIncomplete: true,
        });

        expect(deleteChildInteractionByEventId).not.toHaveBeenCalled();
        expect(result.deletedReactionEventIds).toEqual([]);
        expect(result.statePatches).toEqual([
            expect.objectContaining({
                requestKey: REQUEST_KEY,
                status: "failed",
                deletionConfirmed: false,
                consistencyStatus: "retryable-failed",
            }),
        ]);
    });
});