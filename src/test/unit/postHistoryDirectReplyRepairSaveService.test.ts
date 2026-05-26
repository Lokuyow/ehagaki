import { describe, expect, it, vi } from "vitest";
import { PostHistoryDirectReplyRepairSaveService } from "../../lib/postHistoryDirectReplyRepairSaveService";
import type { NostrEvent } from "../../lib/types";

const PARENT_ID = "1".repeat(64);
const REPLY_ID = "2".repeat(64);
const REPLY_AUTHOR = "b".repeat(64);

function createReply(overrides: Partial<NostrEvent> = {}): NostrEvent {
    return {
        id: REPLY_ID,
        pubkey: REPLY_AUTHOR,
        kind: 1,
        content: "reply",
        tags: [["e", PARENT_ID, "", "reply"]],
        created_at: 100,
        sig: "c".repeat(128),
        ...overrides,
    };
}

function createService(overrides: Record<string, any> = {}) {
    const deletionFetchService: any = {
        fetchDeletionRequests: vi.fn(() => ({
            promise: Promise.resolve({
                status: "success" as const,
                events: [],
                fetchedAt: 200,
                relayUrls: [],
            }),
            cancel: vi.fn(),
        })),
    };
    const deletionRequestsRepository = {
        getDeletedTargets: vi.fn(async () => new Map<string, Set<string>>()),
        upsertValidDeletionRequests: vi.fn(async () => ({
            insertedCount: 0,
            updatedCount: 0,
            unchangedCount: 0,
            ignoredCount: 0,
        })),
    };
    const replyEventsRepository = {
        upsertDirectReplies: vi.fn(async () => ({
            insertedCount: 1,
            updatedCount: 0,
            unchangedCount: 0,
            ignoredCount: 0,
        })),
        deleteByEventId: vi.fn(async () => undefined),
    };

    return {
        service: new PostHistoryDirectReplyRepairSaveService({
            deletionFetchService,
            deletionRequestsRepository,
            replyEventsRepository,
            now: () => 300,
            ...overrides,
        }),
        deletionFetchService,
        deletionRequestsRepository,
        replyEventsRepository,
    };
}

describe("PostHistoryDirectReplyRepairSaveService", () => {
    it("保存済みdeletion requestがあるreplyをrepair保存前に除外してcacheも削除する", async () => {
        const { service, deletionFetchService, deletionRequestsRepository, replyEventsRepository } =
            createService();
        deletionRequestsRepository.getDeletedTargets.mockResolvedValueOnce(
            new Map([[REPLY_AUTHOR, new Set([REPLY_ID])]]),
        );

        const result = await service.saveRepairDirectReplies({} as any, {
            items: [{ parentEventId: PARENT_ID, event: createReply() }],
        }).promise;

        expect(result).toMatchObject({
            savedParentEventIds: [],
            savedDirectReplyCount: 0,
            deletedEventIds: [REPLY_ID],
        });
        expect(replyEventsRepository.deleteByEventId).toHaveBeenCalledWith(REPLY_ID);
        expect(replyEventsRepository.upsertDirectReplies).not.toHaveBeenCalled();
        expect(deletionFetchService.fetchDeletionRequests).not.toHaveBeenCalled();
    });

    it("repair中のkind:5確認で削除済みになったreplyを保存しない", async () => {
        const { service, deletionRequestsRepository, replyEventsRepository } = createService();
        deletionRequestsRepository.getDeletedTargets
            .mockResolvedValueOnce(new Map())
            .mockResolvedValueOnce(new Map([[REPLY_AUTHOR, new Set([REPLY_ID])]]));

        const result = await service.saveRepairDirectReplies({} as any, {
            items: [{ parentEventId: PARENT_ID, event: createReply() }],
        }).promise;

        expect(result).toMatchObject({
            savedParentEventIds: [],
            deletedEventIds: [REPLY_ID],
            deletionConfirmationIncomplete: false,
        });
        expect(replyEventsRepository.deleteByEventId).toHaveBeenCalledWith(REPLY_ID);
        expect(replyEventsRepository.upsertDirectReplies).not.toHaveBeenCalled();
    });

    it("deletion確認timeoutはtelemetryに残し、既知tombstoneのないreplyは保存する", async () => {
        const { service, deletionFetchService, replyEventsRepository } = createService();
        deletionFetchService.fetchDeletionRequests.mockReturnValueOnce({
            promise: Promise.resolve({
                status: "timeout",
                events: [],
                fetchedAt: 200,
                relayUrls: [],
            }),
            cancel: vi.fn(),
        });

        const result = await service.saveRepairDirectReplies({} as any, {
            items: [{ parentEventId: PARENT_ID, event: createReply() }],
        }).promise;

        expect(result).toMatchObject({
            savedParentEventIds: [PARENT_ID],
            savedDirectReplyCount: 1,
            deletionConfirmationIncomplete: true,
        });
        expect(replyEventsRepository.upsertDirectReplies).toHaveBeenCalledWith(
            expect.objectContaining({
                parentEventId: PARENT_ID,
                events: [expect.objectContaining({
                    event: expect.objectContaining({ id: REPLY_ID }),
                })],
                fetchedAt: 300,
            }),
        );
    });

    it("既存replyが unchanged のみなら saved 件数に含めない", async () => {
        const { service, replyEventsRepository } = createService();
        replyEventsRepository.upsertDirectReplies.mockResolvedValueOnce({
            insertedCount: 0,
            updatedCount: 0,
            unchangedCount: 1,
            ignoredCount: 0,
        });

        const result = await service.saveRepairDirectReplies({} as any, {
            items: [{ parentEventId: PARENT_ID, event: createReply() }],
        }).promise;

        expect(result).toMatchObject({
            savedParentEventIds: [],
            savedDirectReplyCount: 0,
        });
        expect(replyEventsRepository.upsertDirectReplies).toHaveBeenCalledWith(
            expect.objectContaining({
                parentEventId: PARENT_ID,
            }),
        );
    });
});
