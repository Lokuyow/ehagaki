import { describe, expect, it, vi } from "vitest";
import {
    PostHistoryDirectReplyDeletionCleanupService,
} from "../../lib/postHistoryDirectReplyDeletionCleanupService";
import {
    PostHistoryDirectReplyDeletionConsistencyService,
} from "../../lib/postHistoryDirectReplyDeletionConsistencyService";

const PARENT_ID = "1".repeat(64);
const REPLY_ID = "2".repeat(64);
const OTHER_REPLY_ID = "3".repeat(64);
const AUTHOR_PUBKEY = "a".repeat(64);
const REQUEST_KEY = `${PARENT_ID}:${REPLY_ID}:1111`;

function replyRecord(eventId: string) {
    return {
        eventId,
        parentEventId: PARENT_ID,
        authorPubkey: AUTHOR_PUBKEY,
        createdAt: 10,
        kind: 1111,
        tags: [],
        content: "reply",
        relayUrls: ["wss://relay.example"],
    } as any;
}

describe("PostHistoryDirectReplyDeletionCleanupService", () => {
    it("filters by replyEventIds and reports deletedReplyEventIds", async () => {
        const deleteChildInteractionByEventId = vi.fn(async () => undefined);
        const getDeletedTargets = vi.fn(async () => new Map([[AUTHOR_PUBKEY, new Set([REPLY_ID])]]));
        const fetchDeletionRequests = vi.fn();
        const service = new PostHistoryDirectReplyDeletionCleanupService({
            directReplyRecordsAdapter: {
                getDirectReplyRecords: vi.fn(async () => [replyRecord(REPLY_ID), replyRecord(OTHER_REPLY_ID)]),
            },
            deletionFetchService: { fetchDeletionRequests },
            deletionRequestsRepository: {
                getDeletedTargets,
                upsertValidDeletionRequests: vi.fn(),
            },
            childInteractionsRepository: { deleteChildInteractionByEventId },
        });

        const result = await service.cleanupDirectReplyDeletions({} as any, {
            parentEventIds: [PARENT_ID, PARENT_ID],
            replyEventIds: [REPLY_ID],
        });

        expect(getDeletedTargets).toHaveBeenCalledWith([
            { targetAuthorPubkey: AUTHOR_PUBKEY, targetEventId: REPLY_ID },
        ]);
        expect(deleteChildInteractionByEventId).toHaveBeenCalledWith(REPLY_ID);
        expect(fetchDeletionRequests).not.toHaveBeenCalled();
        expect(result).toEqual({
            status: "completed",
            checkedParentEventIds: [PARENT_ID],
            deletedReplyEventIds: [REPLY_ID],
            deletionConfirmationIncomplete: false,
        });
    });
});

describe("PostHistoryDirectReplyDeletionConsistencyService", () => {
    it("builds failed patches with reply field names", async () => {
        const service = new PostHistoryDirectReplyDeletionConsistencyService({
            directReplyRecordsAdapter: {
                getDirectReplyRecords: vi.fn(async () => [replyRecord(REPLY_ID)]),
            },
            deletionRequestsRepository: {
                getDeletedTargets: vi.fn(async () => new Map()),
            },
            childInteractionsRepository: {
                deleteChildInteractionByEventId: vi.fn(async () => undefined),
            },
        });

        const result = await service.verifyConsistency({
            candidates: [{
                requestKey: REQUEST_KEY,
                parentEventId: PARENT_ID,
                replyEventId: REPLY_ID,
                replyAuthorPubkey: AUTHOR_PUBKEY,
                kind: 1111,
            }],
            statesByRequestKey: new Map([[REQUEST_KEY, {
                requestKey: REQUEST_KEY,
                parentEventId: PARENT_ID,
                replyEventId: REPLY_ID,
                replyAuthorPubkey: AUTHOR_PUBKEY,
                kind: 1111 as const,
                source: "listing-current-view" as const,
                status: "processing" as const,
                attemptCount: 2,
                updatedAt: 100,
                schemaVersion: 1,
            }]]),
            deletionConfirmationIncomplete: true,
        });

        expect(result).toEqual({
            deletedReplyEventIds: [],
            correctedRequestKeys: [],
            resolvedRequestKeys: [],
            statePatches: [{
                requestKey: REQUEST_KEY,
                parentEventId: PARENT_ID,
                replyEventId: REPLY_ID,
                replyAuthorPubkey: AUTHOR_PUBKEY,
                source: "listing-current-view",
                status: "failed",
                attemptCount: 2,
            }],
        });
    });

    it("purges confirmed deletions and resolves the request", async () => {
        const deleteChildInteractionByEventId = vi.fn(async () => undefined);
        const service = new PostHistoryDirectReplyDeletionConsistencyService({
            directReplyRecordsAdapter: {
                getDirectReplyRecords: vi.fn(async () => [replyRecord(REPLY_ID)]),
            },
            deletionRequestsRepository: {
                getDeletedTargets: vi.fn(async () => new Map([[AUTHOR_PUBKEY, new Set([REPLY_ID])]])),
            },
            childInteractionsRepository: { deleteChildInteractionByEventId },
        });

        const result = await service.verifyConsistency({
            candidates: [{
                requestKey: REQUEST_KEY,
                parentEventId: PARENT_ID,
                replyEventId: REPLY_ID,
                replyAuthorPubkey: AUTHOR_PUBKEY,
                kind: 1111,
            }],
            statesByRequestKey: new Map([[REQUEST_KEY, {
                requestKey: REQUEST_KEY,
                parentEventId: PARENT_ID,
                replyEventId: REPLY_ID,
                replyAuthorPubkey: AUTHOR_PUBKEY,
                kind: 1111 as const,
                source: "listing-current-view" as const,
                status: "processing" as const,
                attemptCount: 1,
                updatedAt: 100,
                schemaVersion: 1,
            }]]),
        });

        expect(deleteChildInteractionByEventId).toHaveBeenCalledWith(REPLY_ID);
        expect(result.deletedReplyEventIds).toEqual([REPLY_ID]);
        expect(result.correctedRequestKeys).toEqual([REQUEST_KEY]);
        expect(result.resolvedRequestKeys).toEqual([REQUEST_KEY]);
    });
});
