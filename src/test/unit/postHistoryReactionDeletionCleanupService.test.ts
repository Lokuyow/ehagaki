import { describe, expect, it, vi } from "vitest";
import { PostHistoryReactionDeletionCleanupService } from "../../lib/postHistoryReactionDeletionCleanupService";
import type { PostHistoryReplyEventRecord } from "../../lib/storage/ehagakiDb";
import type { NostrEvent } from "../../lib/types";

const PARENT_ID = "1".repeat(64);
const REACTION_ID = "2".repeat(64);
const REACTION_AUTHOR = "b".repeat(64);

function createReactionRecord(
    overrides: Partial<PostHistoryReplyEventRecord> = {},
): PostHistoryReplyEventRecord {
    return {
        id: REACTION_ID,
        eventId: REACTION_ID,
        parentEventId: PARENT_ID,
        authorPubkey: REACTION_AUTHOR,
        kind: 7,
        content: "+",
        tags: [["e", PARENT_ID], ["p", "a".repeat(64)]],
        createdAt: 100,
        relayUrls: ["wss://relay.example.com/"],
        discoveredAs: ["reaction"],
        rawEvent: {},
        fetchedAt: 100,
        updatedAt: 100,
        schemaVersion: 1,
        ...overrides,
    };
}

function createDeletionEvent(overrides: Partial<NostrEvent> = {}): NostrEvent {
    return {
        id: "d".repeat(64),
        pubkey: REACTION_AUTHOR,
        kind: 5,
        content: "",
        tags: [["e", REACTION_ID]],
        created_at: 200,
        sig: "e".repeat(128),
        ...overrides,
    };
}

function createService() {
    const reactionRecordsAdapter = {
        getReactionRecords: vi.fn(async () => [createReactionRecord()]),
    };
    const deletionFetchService = {
        fetchDeletionRequests: vi.fn(() => ({
            promise: Promise.resolve({
                status: "success" as const,
                events: [
                    {
                        event: createDeletionEvent(),
                        relayUrls: ["wss://relay.example.com/"],
                    },
                ],
                fetchedAt: 300,
                relayUrls: ["wss://relay.example.com/"],
            }),
            cancel: vi.fn(),
        })),
    };
    const deletionRequestsRepository = {
        getDeletedTargets: vi.fn(async () => new Map<string, Set<string>>()),
        upsertValidDeletionRequests: vi.fn(async () => ({
            insertedCount: 1,
            updatedCount: 0,
            unchangedCount: 0,
            ignoredCount: 0,
        })),
    };
    const childInteractionsRepository = {
        deleteChildInteractionByEventId: vi.fn(async () => undefined),
    };

    return {
        service: new PostHistoryReactionDeletionCleanupService({
            reactionRecordsAdapter,
            deletionFetchService,
            deletionRequestsRepository,
            childInteractionsRepository,
        }),
        reactionRecordsAdapter,
        deletionFetchService,
        deletionRequestsRepository,
        childInteractionsRepository,
    };
}

describe("PostHistoryReactionDeletionCleanupService", () => {
    it("保存済み tombstone がある reaction を fetch 前に cache から削除する", async () => {
        const {
            service,
            deletionFetchService,
            deletionRequestsRepository,
            childInteractionsRepository,
        } = createService();
        deletionRequestsRepository.getDeletedTargets.mockResolvedValueOnce(
            new Map([[REACTION_AUTHOR, new Set([REACTION_ID])]]),
        );

        const result = await service.cleanupReactionDeletions({} as any, {
            parentEventIds: [PARENT_ID],
        });

        expect(result).toMatchObject({
            status: "completed",
            checkedParentEventIds: [PARENT_ID],
            deletedReactionEventIds: [REACTION_ID],
            deletionConfirmationIncomplete: false,
        });
        expect(childInteractionsRepository.deleteChildInteractionByEventId).toHaveBeenCalledWith(
            REACTION_ID,
        );
        expect(deletionFetchService.fetchDeletionRequests).not.toHaveBeenCalled();
    });

    it("kind:5 fetch で確認できた reaction deletion を tombstone 保存後に purge する", async () => {
        const {
            service,
            deletionFetchService,
            deletionRequestsRepository,
            childInteractionsRepository,
        } = createService();
        deletionRequestsRepository.getDeletedTargets
            .mockResolvedValueOnce(new Map())
            .mockResolvedValueOnce(new Map([[REACTION_AUTHOR, new Set([REACTION_ID])]]));

        const result = await service.cleanupReactionDeletions({} as any, {
            parentEventIds: [PARENT_ID],
            relayConfig: { "wss://read.example.com/": { read: true, write: false } },
        });

        expect(result).toMatchObject({
            status: "completed",
            checkedParentEventIds: [PARENT_ID],
            deletedReactionEventIds: [REACTION_ID],
            deletionConfirmationIncomplete: false,
        });
        expect(deletionFetchService.fetchDeletionRequests).toHaveBeenCalledWith(
            {} as any,
            expect.objectContaining({
                relayConfig: { "wss://read.example.com/": { read: true, write: false } },
                targets: [expect.objectContaining({
                    event: expect.objectContaining({
                        id: REACTION_ID,
                        pubkey: REACTION_AUTHOR,
                    }),
                    relayUrls: ["wss://relay.example.com/"],
                })],
            }),
        );
        expect(deletionRequestsRepository.upsertValidDeletionRequests).toHaveBeenCalledWith(
            expect.objectContaining({
                targetEvents: [expect.objectContaining({ id: REACTION_ID })],
                deletionEvents: [expect.objectContaining({ event: createDeletionEvent() })],
                fetchedAt: 300,
            }),
        );
        expect(childInteractionsRepository.deleteChildInteractionByEventId).toHaveBeenCalledWith(
            REACTION_ID,
        );
    });

    it("admitted reaction ids だけを cleanup 対象にする", async () => {
        const { service, deletionFetchService } = createService();
        const otherReactionId = "3".repeat(64);
        const reactionRecordsAdapter = {
            getReactionRecords: vi.fn(async () => [
                createReactionRecord(),
                createReactionRecord({ id: otherReactionId, eventId: otherReactionId }),
            ]),
        };
        const filteredService = new PostHistoryReactionDeletionCleanupService({
            reactionRecordsAdapter,
            deletionFetchService,
            deletionRequestsRepository: {
                getDeletedTargets: vi.fn(async () => new Map<string, Set<string>>()),
                upsertValidDeletionRequests: vi.fn(async () => ({
                    insertedCount: 0,
                    updatedCount: 0,
                    unchangedCount: 0,
                    ignoredCount: 0,
                })),
            },
            childInteractionsRepository: {
                deleteChildInteractionByEventId: vi.fn(async () => undefined),
            },
        });

        await filteredService.cleanupReactionDeletions({} as any, {
            parentEventIds: [PARENT_ID],
            reactionEventIds: [REACTION_ID],
        });

        expect(deletionFetchService.fetchDeletionRequests).toHaveBeenCalledWith(
            {} as any,
            expect.objectContaining({
                targets: [expect.objectContaining({
                    event: expect.objectContaining({ id: REACTION_ID }),
                })],
            }),
        );
    });
});