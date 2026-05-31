import { beforeEach, describe, expect, it, vi } from "vitest";

const rxNostrMock = vi.hoisted(() => ({
    emittedFilters: [] as any[],
    use: vi.fn(),
}));

const rxReqMock = vi.hoisted(() => ({
    emit: vi.fn((filter: any) => {
        rxNostrMock.emittedFilters.push(filter);
    }),
    over: vi.fn(),
}));

vi.mock("rx-nostr", () => ({
    createRxBackwardReq: vi.fn(() => rxReqMock),
}));

import {
    POST_HISTORY_VISIBLE_RANGE_CHILD_INTERACTION_REPAIR_FETCH_LIMIT,
    PostHistoryVisibleRangeChildInteractionRepairService,
} from "../../lib/postHistoryVisibleRangeChildInteractionRepairService";
import type { NostrEvent } from "../../lib/types";

const OWNER = "a".repeat(64);

function createPost(eventId: string, kind = 1) {
    return {
        id: eventId,
        eventId,
        pubkeyHex: OWNER,
        kind,
        content: "post",
        tags: [],
        createdAt: 100,
        postedAt: 100_000,
        relayHints: [],
        acceptedRelays: [],
        media: [],
        rawEvent: {},
        updatedAt: 100_000,
        schemaVersion: 2,
    } as any;
}

function createReply(overrides: Partial<NostrEvent> = {}): NostrEvent {
    return {
        id: "3".repeat(64),
        pubkey: "b".repeat(64),
        kind: 1,
        content: "reply",
        tags: [],
        created_at: 101,
        sig: "d".repeat(128),
        ...overrides,
    };
}

function createReaction(overrides: Partial<NostrEvent> = {}): NostrEvent {
    return {
        id: "6".repeat(64),
        pubkey: "e".repeat(64),
        kind: 7,
        content: "+",
        tags: [],
        created_at: 102,
        sig: "f".repeat(128),
        ...overrides,
    };
}

describe("PostHistoryVisibleRangeChildInteractionRepairService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        rxNostrMock.emittedFilters = [];
    });

    it("visible kind:1 parentを#e filterで取得し、direct replyとreactionを保存へ渡す", async () => {
        const kind1Parent = "1".repeat(64);
        const kind42Parent = "2".repeat(64);
        const upsertChildInteractions = vi.fn(async () => ({
            insertedCount: 1,
            updatedCount: 0,
            unchangedCount: 0,
            ignoredCount: 0,
        }));
        const saveRepairDirectReplies = vi.fn(() => ({
            promise: Promise.resolve({
                status: "saved",
                savedParentEventIds: [kind1Parent],
                savedDirectReplyCount: 1,
                deletedEventIds: [],
                deletionConfirmationIncomplete: false,
            }),
            cancel: vi.fn(),
        }));
        const service = new PostHistoryVisibleRangeChildInteractionRepairService({
            directReplySaveService: { saveRepairDirectReplies } as any,
            childInteractionsRepository: { upsertChildInteractions } as any,
            setTimeoutFn: (() => 1) as any,
            clearTimeoutFn: vi.fn(),
            now: () => 500,
        });
        rxNostrMock.use.mockReturnValue({
            subscribe: ({ next, complete }: Record<string, any>) => {
                next({
                    event: createReply({
                        tags: [["e", kind1Parent, "", "reply"]],
                    }),
                    from: "wss://relay.example.com",
                });
                next({
                    event: createReply({
                        id: "4".repeat(64),
                        tags: [
                            ["e", kind1Parent, "", "root"],
                            ["e", "5".repeat(64), "", "reply"],
                        ],
                    }),
                    from: "wss://relay.example.com",
                });
                next({
                    event: createReaction({
                        tags: [["e", kind1Parent, "", "reply"]],
                    }),
                    from: "wss://relay.example.com",
                });
                next({
                    event: createReaction({
                        id: "7".repeat(64),
                        tags: [["e", "8".repeat(64), "", "reply"]],
                    }),
                    from: "wss://relay.example.com",
                });
                complete();
                return { unsubscribe: vi.fn() };
            },
        });

        const result = await service.repairVisibleRangeChildInteractions(rxNostrMock as any, {
            ownerPubkeyHex: OWNER,
            visiblePosts: [createPost(kind1Parent), createPost(kind42Parent, 42)],
            relayConfig: null,
        }).promise;

        expect(rxNostrMock.emittedFilters).toEqual([{
            kinds: [1, 7],
            "#e": [kind1Parent],
            limit: POST_HISTORY_VISIBLE_RANGE_CHILD_INTERACTION_REPAIR_FETCH_LIMIT,
        }]);
        expect(rxNostrMock.emittedFilters[0]).not.toHaveProperty("since");
        expect(rxNostrMock.emittedFilters[0]).not.toHaveProperty("until");
        expect(rxNostrMock.emittedFilters[0]).not.toHaveProperty("#p");
        expect(saveRepairDirectReplies).toHaveBeenCalledWith(rxNostrMock, expect.objectContaining({
            items: [{
                parentEventId: kind1Parent,
                event: expect.objectContaining({ id: "3".repeat(64) }),
                relayUrls: ["wss://relay.example.com/"],
            }],
        }));
        expect(upsertChildInteractions).toHaveBeenCalledTimes(1);
        expect(upsertChildInteractions).toHaveBeenCalledWith({
            parentEventId: kind1Parent,
            events: [{
                event: expect.objectContaining({ id: "6".repeat(64), kind: 7 }),
                relayUrls: ["wss://relay.example.com/"],
            }],
            fetchedAt: 500,
        });
        expect(result).toMatchObject({
            targetParentEventIds: [kind1Parent],
            checkedParentEventIds: [kind1Parent],
            savedParentEventIds: [kind1Parent],
            savedDirectReplyCount: 1,
            incompleteParentEventIds: [],
        });
    });

    it("candidate fetch が error の parent は unchecked/incomplete として返す", async () => {
        const kind1Parent = "1".repeat(64);
        const saveRepairDirectReplies = vi.fn(() => ({
            promise: Promise.resolve({
                status: "saved",
                savedParentEventIds: [],
                savedDirectReplyCount: 0,
                deletedEventIds: [],
                deletionConfirmationIncomplete: false,
            }),
            cancel: vi.fn(),
        }));
        const service = new PostHistoryVisibleRangeChildInteractionRepairService({
            directReplySaveService: { saveRepairDirectReplies } as any,
            setTimeoutFn: (() => 1) as any,
            clearTimeoutFn: vi.fn(),
        });
        rxNostrMock.use.mockReturnValue({
            subscribe: ({ error }: Record<string, any>) => {
                error(new Error("fetch failed"));
                return { unsubscribe: vi.fn() };
            },
        });

        const result = await service.repairVisibleRangeChildInteractions(rxNostrMock as any, {
            ownerPubkeyHex: OWNER,
            visiblePosts: [createPost(kind1Parent)],
            relayConfig: null,
        }).promise;

        expect(saveRepairDirectReplies).not.toHaveBeenCalled();
        expect(result).toMatchObject({
            status: "partial",
            targetParentEventIds: [kind1Parent],
            checkedParentEventIds: [],
            incompleteParentEventIds: [kind1Parent],
        });
    });

    it("150件を30件chunkに分けて最大visible parent範囲だけ取得する", async () => {
        const service = new PostHistoryVisibleRangeChildInteractionRepairService({
            directReplySaveService: {
                saveRepairDirectReplies: vi.fn(),
            } as any,
            setTimeoutFn: (() => 1) as any,
            clearTimeoutFn: vi.fn(),
        });
        rxNostrMock.use.mockReturnValue({
            subscribe: ({ complete }: Record<string, any>) => {
                complete();
                return { unsubscribe: vi.fn() };
            },
        });
        const visiblePosts = Array.from({ length: 151 }, (_, index) =>
            createPost(index.toString(16).padStart(64, "0"))
        );

        const result = await service.repairVisibleRangeChildInteractions(rxNostrMock as any, {
            ownerPubkeyHex: OWNER,
            visiblePosts,
            relayConfig: null,
        }).promise;

        expect(result.targetParentEventIds).toHaveLength(150);
        expect(rxNostrMock.emittedFilters).toHaveLength(5);
        expect(rxNostrMock.emittedFilters.every((filter) => filter["#e"].length === 30)).toBe(true);
    });

    it("relationKinds が quote のみなら child interaction repair を reply/reaction 無効で起動する", async () => {
        const service = new PostHistoryVisibleRangeChildInteractionRepairService();
        const internalRepair = vi.fn(() => ({
            promise: Promise.resolve({
                status: "success",
                targetParentEventIds: [],
                checkedParentEventIds: [],
                savedParentEventIds: [],
                savedDirectReplyCount: 0,
                attemptedChunkCount: 0,
                saturatedChunkCount: 0,
                incompleteParentEventIds: [],
                deletionConfirmationIncomplete: false,
            }),
            cancel: vi.fn(),
        }));
        (service as any).repairVisibleRangeChildInteractionsInternal = internalRepair;

        const result = await service.repairVisibleRangeRelations(rxNostrMock as any, {
            ownerPubkeyHex: OWNER,
            visiblePosts: [createPost("1".repeat(64)), createPost("2".repeat(64), 42)],
            relationKinds: ["quote"],
            relayConfig: null,
        }).promise;

        expect(internalRepair).toHaveBeenCalledWith(
            rxNostrMock,
            expect.objectContaining({
                relationKinds: ["quote"],
            }),
            {
                includeDirectReplies: false,
                includeReactions: false,
            },
        );
        expect(result.relationKinds).toEqual(["quote"]);
    });

    it("quote executor が指定されていれば relation-aware repair 完了後に実行される", async () => {
        const service = new PostHistoryVisibleRangeChildInteractionRepairService();
        (service as any).repairVisibleRangeChildInteractionsInternal = vi.fn(() => ({
            promise: Promise.resolve({
                status: "success",
                targetParentEventIds: ["1".repeat(64)],
                checkedParentEventIds: ["1".repeat(64)],
                savedParentEventIds: [],
                savedDirectReplyCount: 0,
                attemptedChunkCount: 1,
                saturatedChunkCount: 0,
                incompleteParentEventIds: [],
                deletionConfirmationIncomplete: false,
            }),
            cancel: vi.fn(),
        }));
        const quoteExecutor = vi.fn(async () => undefined);

        const result = await service.repairVisibleRangeRelations(rxNostrMock as any, {
            ownerPubkeyHex: OWNER,
            visiblePosts: [createPost("1".repeat(64))],
            relationKinds: ["reply", "reaction", "quote"],
            quoteVisibleRangeRepairExecutor: quoteExecutor,
            relayConfig: null,
        }).promise;

        expect(quoteExecutor).toHaveBeenCalledTimes(1);
        expect(result.quoteRepairApplied).toBe(true);
    });

    it("quote executor が未指定なら quoteRepairApplied は false のまま", async () => {
        const service = new PostHistoryVisibleRangeChildInteractionRepairService();
        (service as any).repairVisibleRangeChildInteractionsInternal = vi.fn(() => ({
            promise: Promise.resolve({
                status: "success",
                targetParentEventIds: ["1".repeat(64)],
                checkedParentEventIds: ["1".repeat(64)],
                savedParentEventIds: [],
                savedDirectReplyCount: 0,
                attemptedChunkCount: 1,
                saturatedChunkCount: 0,
                incompleteParentEventIds: [],
                deletionConfirmationIncomplete: false,
            }),
            cancel: vi.fn(),
        }));

        const result = await service.repairVisibleRangeRelations(rxNostrMock as any, {
            ownerPubkeyHex: OWNER,
            visiblePosts: [createPost("1".repeat(64))],
            relationKinds: ["reply", "reaction", "quote"],
            relayConfig: null,
        }).promise;

        expect(result.quoteRepairApplied).toBe(false);
    });

    it("child interaction repair が cancelled の場合は quote executor を呼ばない", async () => {
        const service = new PostHistoryVisibleRangeChildInteractionRepairService();
        (service as any).repairVisibleRangeChildInteractionsInternal = vi.fn(() => ({
            promise: Promise.resolve({
                status: "cancelled",
                targetParentEventIds: ["1".repeat(64)],
                checkedParentEventIds: [],
                savedParentEventIds: [],
                savedDirectReplyCount: 0,
                attemptedChunkCount: 0,
                saturatedChunkCount: 0,
                incompleteParentEventIds: ["1".repeat(64)],
                deletionConfirmationIncomplete: false,
            }),
            cancel: vi.fn(),
        }));
        const quoteExecutor = vi.fn(async () => undefined);

        const result = await service.repairVisibleRangeRelations(rxNostrMock as any, {
            ownerPubkeyHex: OWNER,
            visiblePosts: [createPost("1".repeat(64))],
            relationKinds: ["quote"],
            quoteVisibleRangeRepairExecutor: quoteExecutor,
            relayConfig: null,
        }).promise;

        expect(quoteExecutor).not.toHaveBeenCalled();
        expect(result.quoteRepairApplied).toBe(false);
    });
});
