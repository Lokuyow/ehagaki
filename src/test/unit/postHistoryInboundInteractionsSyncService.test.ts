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

import { PostHistoryInboundInteractionsSyncService } from "../../lib/postHistoryInboundInteractionsSyncService";
import type { NostrEvent } from "../../lib/types";

const OWNER_PUBKEY = "a".repeat(64);
const PARENT_ID = "1".repeat(64);
const OTHER_PARENT_ID = "2".repeat(64);

function createEvent(overrides: Partial<NostrEvent> = {}): NostrEvent {
    return {
        id: "f".repeat(64),
        pubkey: "b".repeat(64),
        kind: 1,
        content: "reply",
        tags: [
            ["p", OWNER_PUBKEY],
            ["e", PARENT_ID, "", "reply"],
        ],
        created_at: 100,
        sig: "c".repeat(128),
        ...overrides,
    };
}

function createService(overrides: Record<string, any> = {}) {
    const postHistoryRepository = {
        getExistingEventIdsForPubkey: vi.fn(async ({ eventIds }: { eventIds: string[] }) =>
            eventIds.filter((eventId) => eventId === PARENT_ID)
        ),
    };
    const upsertChildInteractions = vi.fn(async () => ({
        insertedCount: 1,
        updatedCount: 0,
        unchangedCount: 0,
        ignoredCount: 0,
    }));
    const postHistoryReplyEventsRepository = {
        upsertChildInteractions,
        upsertDirectReplies: upsertChildInteractions,
    };
    const syncStateRepository = {
        get: vi.fn(async () => null),
        save: vi.fn(async (ownerPubkeyHex: string, patch: Record<string, any>) => ({
            ownerPubkeyHex,
            lastSyncedAt: patch.lastSyncedAt ?? null,
            lastSeenCreatedAt: patch.lastSeenCreatedAt ?? null,
            lastDialogRefreshAt: patch.lastDialogRefreshAt ?? null,
            saturated: patch.saturated ?? false,
            maybeIncomplete: patch.maybeIncomplete ?? false,
            updatedAt: 1_700_000_000_000,
            schemaVersion: 1,
        })),
    };
    const service = new PostHistoryInboundInteractionsSyncService({
        postHistoryRepository,
        postHistoryReplyEventsRepository,
        syncStateRepository,
        now: () => 1_700_000_000_000,
        setTimeoutFn: (() => 1) as any,
        clearTimeoutFn: vi.fn(),
        console: { warn: vi.fn(), error: vi.fn() },
        ...overrides,
    });

    return {
        service,
        postHistoryRepository,
        postHistoryReplyEventsRepository,
        syncStateRepository,
    };
}

describe("PostHistoryInboundInteractionsSyncService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        rxNostrMock.emittedFilters = [];
    });

    it("#pでkind:1を取得し、owner-scoped parentがあるdirect replyだけ保存する", async () => {
        const directReply = createEvent({ id: "3".repeat(64), created_at: 1_700_000_100 });
        const mentionLike = createEvent({
            id: "4".repeat(64),
            tags: [
                ["p", OWNER_PUBKEY],
                ["e", OTHER_PARENT_ID, "", "reply"],
            ],
            created_at: 1_700_000_110,
        });
        rxNostrMock.use.mockReturnValue({
            subscribe: ({ next, complete }: Record<string, any>) => {
                next({ event: directReply, from: "wss://relay.example.com" });
                next({ event: mentionLike, from: "wss://relay.example.com" });
                complete();
                return { unsubscribe: vi.fn() };
            },
        });
        const { service, postHistoryReplyEventsRepository } = createService();

        const result = await service.syncRecent(rxNostrMock as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
            reason: "initial-dialog-bootstrap",
            relayConfig: { "wss://read.example.com/": { read: true, write: false } },
        }).promise;

        expect(rxNostrMock.emittedFilters).toEqual([{
            kinds: [1, 7],
            "#p": [OWNER_PUBKEY],
            since: 1_699_395_200,
            limit: 150,
        }]);
        expect(postHistoryReplyEventsRepository.upsertDirectReplies).toHaveBeenCalledWith({
            parentEventId: PARENT_ID,
            events: [{ event: directReply, relayUrls: ["wss://relay.example.com/"] }],
            fetchedAt: 1_700_000_000_000,
        });
        expect(result.classifications).toMatchObject({
            "direct-reply": 1,
            "direct-reply-candidate": 1,
        });
        expect(result.savedParentEventIds).toEqual([PARENT_ID]);
    });

    it("limit到達時はlastSeenCreatedAtを更新せずmaybeIncompleteを維持する", async () => {
        rxNostrMock.use.mockReturnValue({
            subscribe: ({ next, complete }: Record<string, any>) => {
                next(createPacket(createEvent({ id: "5".repeat(64), created_at: 1_700_000_100 })));
                next(createPacket(createEvent({ id: "6".repeat(64), created_at: 1_700_000_101 })));
                complete();
                return { unsubscribe: vi.fn() };
            },
        });
        const syncStateRepository = {
            get: vi.fn(async () => ({ lastSeenCreatedAt: 1_700_000_000 })),
            save: vi.fn(async (ownerPubkeyHex: string, patch: Record<string, any>) => ({
                ownerPubkeyHex,
                lastSyncedAt: patch.lastSyncedAt ?? null,
                lastSeenCreatedAt: patch.lastSeenCreatedAt ?? null,
                lastDialogRefreshAt: patch.lastDialogRefreshAt ?? null,
                saturated: patch.saturated ?? false,
                maybeIncomplete: patch.maybeIncomplete ?? false,
                updatedAt: 1_700_000_000_000,
                schemaVersion: 1,
            })),
        };
        const { service } = createService({ syncStateRepository });

        const result = await service.syncRecent(rxNostrMock as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
            reason: "dialog-open-refresh",
            relayConfig: null,
            limit: 2,
        }).promise;

        expect(result).toMatchObject({
            saturated: true,
            maybeIncomplete: true,
        });
        expect(syncStateRepository.save).toHaveBeenCalledWith(OWNER_PUBKEY, expect.objectContaining({
            lastSeenCreatedAt: undefined,
            saturated: true,
            maybeIncomplete: true,
        }));
    });

    it("mention-likeだけでlimit到達しても補完完了扱いにしない", async () => {
        rxNostrMock.use.mockReturnValue({
            subscribe: ({ next, complete }: Record<string, any>) => {
                next(createPacket(createEvent({
                    id: "7".repeat(64),
                    tags: [["p", OWNER_PUBKEY]],
                })));
                complete();
                return { unsubscribe: vi.fn() };
            },
        });
        const syncStateRepository = {
            get: vi.fn(async () => null),
            save: vi.fn(async (ownerPubkeyHex: string, patch: Record<string, any>) => ({
                ownerPubkeyHex,
                lastSyncedAt: patch.lastSyncedAt ?? null,
                lastSeenCreatedAt: patch.lastSeenCreatedAt ?? null,
                lastDialogRefreshAt: patch.lastDialogRefreshAt ?? null,
                saturated: patch.saturated ?? false,
                maybeIncomplete: patch.maybeIncomplete ?? false,
                updatedAt: 1_700_000_000_000,
                schemaVersion: 1,
            })),
        };
        const { service, postHistoryReplyEventsRepository } = createService({ syncStateRepository });

        const result = await service.syncRecent(rxNostrMock as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
            reason: "dialog-open-refresh",
            relayConfig: null,
            limit: 1,
        }).promise;

        expect(postHistoryReplyEventsRepository.upsertDirectReplies).not.toHaveBeenCalled();
        expect(result).toMatchObject({
            savedDirectReplyCount: 0,
            saturated: true,
            maybeIncomplete: true,
        });
    });

    it("dialog recent syncで取得したunknown parent reply候補をshared reconciliationへ渡す", async () => {
        const unknownParentReply = createEvent({
            id: "8".repeat(64),
            tags: [["p", OWNER_PUBKEY], ["e", OTHER_PARENT_ID, "", "reply"]],
        });
        rxNostrMock.use.mockReturnValue({
            subscribe: ({ next, complete }: Record<string, any>) => {
                next(createPacket(unknownParentReply));
                complete();
                return { unsubscribe: vi.fn() };
            },
        });
        const { service, postHistoryReplyEventsRepository } = createService();
        const reconcileDirectReplyCandidates = vi.fn(async () => ({
            savedParentEventIds: [OTHER_PARENT_ID],
            savedDirectReplyCount: 1,
            unresolvedParentEventIds: [],
        }));

        const result = await service.syncRecent(rxNostrMock as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
            reason: "dialog-open-refresh",
            relayConfig: null,
            reconcileDirectReplyCandidates,
        }).promise;

        expect(reconcileDirectReplyCandidates).toHaveBeenCalledWith([
            expect.objectContaining({
                event: unknownParentReply,
                classification: expect.objectContaining({
                    type: "direct-reply-candidate",
                    parentEventId: OTHER_PARENT_ID,
                }),
            }),
        ]);
        expect(postHistoryReplyEventsRepository.upsertDirectReplies).not.toHaveBeenCalled();
        expect(result.savedParentEventIds).toEqual([OTHER_PARENT_ID]);
    });

    it("他人と自分のkind:7 reactionをowner投稿向けrelated eventとして保存する", async () => {
        const externalReaction = createEvent({
            id: "9".repeat(64),
            kind: 7,
            content: "+",
            tags: [
                ["p", OWNER_PUBKEY],
                ["e", PARENT_ID],
            ],
            created_at: 1_700_000_120,
        });
        const selfReaction = createEvent({
            id: "a".repeat(64),
            pubkey: OWNER_PUBKEY,
            kind: 7,
            content: "👍",
            tags: [
                ["p", OWNER_PUBKEY],
                ["e", PARENT_ID],
            ],
            created_at: 1_700_000_121,
        });
        rxNostrMock.use.mockReturnValue({
            subscribe: ({ next, complete }: Record<string, any>) => {
                next(createPacket(externalReaction));
                next(createPacket(selfReaction));
                complete();
                return { unsubscribe: vi.fn() };
            },
        });
        const { service, postHistoryReplyEventsRepository } = createService();

        const result = await service.syncRecent(rxNostrMock as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
            reason: "dialog-open-refresh",
            relayConfig: null,
        }).promise;

        expect(postHistoryReplyEventsRepository.upsertDirectReplies).toHaveBeenCalledWith({
            parentEventId: PARENT_ID,
            events: [
                { event: selfReaction, relayUrls: ["wss://relay.example.com/"] },
                { event: externalReaction, relayUrls: ["wss://relay.example.com/"] },
            ],
            fetchedAt: 1_700_000_000_000,
        });
        expect(result.classifications).toMatchObject({
            reaction: 2,
        });
        expect(result.savedParentEventIds).toEqual([PARENT_ID]);
        expect(result.savedDirectReplyCount).toBe(0);
    });

    it("fetch後にlightweight sessionが失効した結果は保存、state更新、reconciliationへ流さない", async () => {
        let active = true;
        const getExistingStarted = createDeferred<void>();
        const getExistingFinished = createDeferred<string[]>();
        rxNostrMock.use.mockReturnValue({
            subscribe: ({ next, complete }: Record<string, any>) => {
                next(createPacket(createEvent({ id: "9".repeat(64) })));
                complete();
                return { unsubscribe: vi.fn() };
            },
        });
        const reconcileDirectReplyCandidates = vi.fn();
        const postHistoryRepository = {
            getExistingEventIdsForPubkey: vi.fn(async () => {
                getExistingStarted.resolve();
                return getExistingFinished.promise;
            }),
        };
        const { service, postHistoryReplyEventsRepository, syncStateRepository } =
            createService({ postHistoryRepository });

        const task = service.syncRecent(rxNostrMock as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
            reason: "visibility-resume",
            reconcileDirectReplyCandidates,
            isActive: () => active,
        });
        await getExistingStarted.promise;
        active = false;
        getExistingFinished.resolve([PARENT_ID]);

        const result = await task.promise;
        expect(result.status).toBe("cancelled");
        expect(reconcileDirectReplyCandidates).not.toHaveBeenCalled();
        expect(postHistoryReplyEventsRepository.upsertDirectReplies).not.toHaveBeenCalled();
        expect(syncStateRepository.save).not.toHaveBeenCalled();
    });
});

function createPacket(event: NostrEvent) {
    return {
        event,
        from: "wss://relay.example.com",
    };
}

function createDeferred<T>() {
    let resolve!: (value: T | PromiseLike<T>) => void;
    const promise = new Promise<T>((nextResolve) => {
        resolve = nextResolve;
    });

    return { promise, resolve };
}
