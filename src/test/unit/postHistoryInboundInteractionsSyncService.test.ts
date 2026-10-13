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
vi.mock("../../lib/postHistoryRawEventVerification", () => ({
    RAW_EVENT_VERIFICATION_RULE_VERSION: 1,
    attestFullyVerifiedPostHistoryRawEvent: (event: unknown) => ({ event, attestation: {} }),
    isCurrentPostHistoryRawEventAttestation: () => true,
    usePostHistoryRelayEvents: (rxNostr: { use: Function }, rxReq: unknown, options: unknown) =>
        rxNostr.use(rxReq, options),
}));

import { PostHistoryInboundInteractionsSyncService } from "../../lib/postHistoryInboundInteractionsSyncService";
import { PostHistoryInboundReplyReconciliationService } from "../../lib/postHistoryInboundReplyReconciliationService";
import { EHagakiDB } from "../../lib/storage/ehagakiDb";
import { DexiePostHistoryChildInteractionsRepository } from "../../lib/storage/postHistoryChildInteractionsRepository";
import { clearPostHistoryDisplayForPubkey } from "../../lib/storage/postHistoryPersistenceCoordinator";
import { getPostHistoryChildWriteGeneration } from "../../lib/storage/postHistoryLocalWriteScope";
import type { NostrEvent } from "../../lib/types";
import Dexie from "dexie";

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
        getByEventId: vi.fn(async (eventId: string) => eventId === PARENT_ID ? ({
            eventId,
            kind: 1,
            tags: [],
            createdAt: 90,
            relayHints: [],
            acceptedRelays: [],
        } as any) : null),
    };
    const upsertChildInteractions = vi.fn(async () => ({
        insertedCount: 1,
        updatedCount: 0,
        unchangedCount: 0,
        ignoredCount: 0,
    }));
    const postHistoryChildInteractionsRepository = {
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
        postHistoryChildInteractionsRepository,
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
        postHistoryChildInteractionsRepository,
        syncStateRepository,
    };
}

describe("PostHistoryInboundInteractionsSyncService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        rxNostrMock.emittedFilters = [];
    });

    it("sync saves the trailing target only and rejects invalid or mismatched Reaction references", async () => {
        const tags = [
            [["e", OTHER_PARENT_ID, "", "reply"], ["p", "b".repeat(64)], ["e", PARENT_ID, "", OWNER_PUBKEY], ["p", OWNER_PUBKEY], ["k", "1"]],
            [["e", PARENT_ID, "", "reply"], ["e", OTHER_PARENT_ID], ["p", OWNER_PUBKEY]],
            [["e", PARENT_ID], ["e", "invalid"], ["p", OWNER_PUBKEY]],
            [["e", PARENT_ID], ["p", OWNER_PUBKEY], ["p", "invalid"]],
            [["e", PARENT_ID], ["p", OWNER_PUBKEY], ["k", "42"]],
            [["e", PARENT_ID], ["p", OWNER_PUBKEY], ["p", "b".repeat(64)]],
        ];
        const events = tags.map((tags, index) => createEvent({ kind: 7, id: String(index + 3).repeat(64), tags }));
        rxNostrMock.use.mockReturnValue({ subscribe: ({ next, complete }: Record<string, any>) => {
            events.forEach(event => next(createPacket(event))); complete(); return { unsubscribe: vi.fn() };
        } });
        const { service, postHistoryChildInteractionsRepository } = createService();
        const result = await service.syncRecent(rxNostrMock as any, {
            ownerPubkeyHex: OWNER_PUBKEY, reason: "dialog-open-refresh", relayConfig: null,
        }).promise;
        expect(postHistoryChildInteractionsRepository.upsertChildInteractions).toHaveBeenCalledOnce();
        expect(postHistoryChildInteractionsRepository.upsertChildInteractions).toHaveBeenCalledWith({
            parentEventId: PARENT_ID, events: [{ event: events[0], relayUrls: ["wss://relay.example.com/"] }],
            expectedChildGeneration: 0,
            fetchedAt: 1_700_000_000_000,
        });
        expect(result.changedParentEventIds).toEqual([PARENT_ID]);
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
        const { service, postHistoryChildInteractionsRepository } = createService();

        const result = await service.syncRecent(rxNostrMock as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
            reason: "initial-dialog-bootstrap",
            relayConfig: { "wss://read.example.com/": { read: true, write: false } },
        }).promise;

        expect(rxNostrMock.use).toHaveBeenCalledWith(expect.anything(), {
            on: { relays: ["wss://read.example.com/"] },
        });
        expect(rxNostrMock.emittedFilters).toEqual([
            {
                kinds: [1, 7, 42, 1111],
                "#p": [OWNER_PUBKEY],
                since: 1_699_395_200,
                limit: 150,
            },
            {
                kinds: [1111],
                "#P": [OWNER_PUBKEY],
                since: 1_699_395_200,
                limit: 150,
            },
        ]);
        expect(postHistoryChildInteractionsRepository.upsertDirectReplies).toHaveBeenCalledWith({
            parentEventId: PARENT_ID,
            events: [{ event: directReply, relayUrls: ["wss://relay.example.com/"] }],
            expectedChildGeneration: 0,
            fetchedAt: 1_700_000_000_000,
        });
        expect(result.classifications).toMatchObject({
            "direct-reply": 1,
            "direct-reply-candidate": 1,
        });
        expect(result.changedParentEventIds).toEqual([PARENT_ID]);
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
        const { service, postHistoryChildInteractionsRepository } = createService({ syncStateRepository });

        const result = await service.syncRecent(rxNostrMock as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
            reason: "dialog-open-refresh",
            relayConfig: null,
            limit: 1,
        }).promise;

        expect(postHistoryChildInteractionsRepository.upsertDirectReplies).not.toHaveBeenCalled();
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
        const { service, postHistoryChildInteractionsRepository } = createService();
        const reconcileDirectReplyCandidates = vi.fn(async () => ({
            changedParentEventIds: [OTHER_PARENT_ID],
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
                expectedChildGeneration: 0,
                classification: expect.objectContaining({
                    type: "direct-reply-candidate",
                    parentEventId: OTHER_PARENT_ID,
                }),
            }),
        ]);
        expect(postHistoryChildInteractionsRepository.upsertDirectReplies).not.toHaveBeenCalled();
        expect(result.changedParentEventIds).toEqual([OTHER_PARENT_ID]);
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
        const { service, postHistoryChildInteractionsRepository } = createService();

        const result = await service.syncRecent(rxNostrMock as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
            reason: "dialog-open-refresh",
            relayConfig: null,
        }).promise;

        expect(postHistoryChildInteractionsRepository.upsertDirectReplies).toHaveBeenCalledWith({
            parentEventId: PARENT_ID,
            events: [
                { event: selfReaction, relayUrls: ["wss://relay.example.com/"] },
                { event: externalReaction, relayUrls: ["wss://relay.example.com/"] },
            ],
            expectedChildGeneration: 0,
            fetchedAt: 1_700_000_000_000,
        });
        expect(result.classifications).toMatchObject({
            reaction: 2,
        });
        expect(result.changedParentEventIds).toEqual([PARENT_ID]);
        expect(result.savedDirectReplyCount).toBe(0);
    });

    it("root付きkind:7 reactionは返信先イベントへ保存する", async () => {
        const threadedReaction = createEvent({
            id: "b".repeat(64),
            kind: 7,
            content: "🍬",
            tags: [
                ["e", OTHER_PARENT_ID, "wss://root.example.com", "root", OWNER_PUBKEY],
                ["p", OWNER_PUBKEY],
                ["e", PARENT_ID, "wss://reply.example.com", OWNER_PUBKEY],
            ],
            created_at: 1_700_000_122,
        });
        rxNostrMock.use.mockReturnValue({
            subscribe: ({ next, complete }: Record<string, any>) => {
                next(createPacket(threadedReaction));
                complete();
                return { unsubscribe: vi.fn() };
            },
        });
        const { service, postHistoryChildInteractionsRepository } = createService();

        const result = await service.syncRecent(rxNostrMock as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
            reason: "dialog-open-refresh",
            relayConfig: null,
        }).promise;

        expect(postHistoryChildInteractionsRepository.upsertDirectReplies).toHaveBeenCalledWith({
            parentEventId: PARENT_ID,
            events: [
                { event: threadedReaction, relayUrls: ["wss://relay.example.com/"] },
            ],
            expectedChildGeneration: 0,
            fetchedAt: 1_700_000_000_000,
        });
        expect(result.classifications).toMatchObject({
            reaction: 1,
        });
        expect(result.changedParentEventIds).toEqual([PARENT_ID]);
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
        const { service, postHistoryChildInteractionsRepository, syncStateRepository } =
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
        expect(postHistoryChildInteractionsRepository.upsertDirectReplies).not.toHaveBeenCalled();
        expect(syncStateRepository.save).not.toHaveBeenCalled();
    });

    it("keeps the sync-start generation through reconciliation and does not save that reply after a clear", async () => {
        const name = `sync-known-generation-${crypto.randomUUID()}`;
        const dbA = new EHagakiDB(name);
        const dbB = new EHagakiDB(name);
        await dbA.open();
        await dbB.open();
        const repository = new DexiePostHistoryChildInteractionsRepository(dbA);
        const upsert = vi.spyOn(repository, "upsertChildInteractions");
        const parentRecord = {
            eventId: PARENT_ID,
            kind: 1,
            tags: [] as string[][],
            createdAt: 90,
            relayHints: [] as string[],
            acceptedRelays: [] as string[],
        };
        const reply = createEvent({ id: "3".repeat(64) });
        let reads = 0;
        let releaseRead: () => void = () => undefined;
        const readGate = new Promise<void>((resolve) => {
            releaseRead = resolve;
        });
        rxNostrMock.use.mockReturnValue({
            subscribe: ({ next, complete }: Record<string, any>) => {
                next(createPacket(reply));
                complete();
                return { unsubscribe: vi.fn() };
            },
        });
        const onSavedInboundInteractions = vi.fn();
        const session = new PostHistoryInboundReplyReconciliationService({
            postHistoryRepository: {
                getExistingEventIdsForPubkey: vi.fn(async () => [PARENT_ID]),
                getByEventId: vi.fn(async () => parentRecord as any),
                upsertFetchedEvents: vi.fn(),
            },
            postHistoryChildInteractionsRepository: repository,
            now: () => 1_700_000_000_000,
            console: { warn: vi.fn(), error: vi.fn() },
        }).createSession({} as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
            onSavedInboundInteractions,
        });
        const { service } = createService({
            getChildWriteGeneration: () => getPostHistoryChildWriteGeneration(dbA),
            postHistoryChildInteractionsRepository: repository,
            postHistoryRepository: {
                getExistingEventIdsForPubkey: vi.fn(async () => {
                    reads += 1;
                    await readGate;
                    return [PARENT_ID];
                }),
                getByEventId: vi.fn(async () => parentRecord as any),
            },
        });
        const task = service.syncRecent(rxNostrMock as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
            reason: "dialog-open-refresh",
            relayConfig: null,
            reconcileDirectReplyCandidates: (candidates) => session.reconcile(candidates),
        });
        await vi.waitFor(() => expect(reads).toBe(1));
        await clearPostHistoryDisplayForPubkey(dbB, OWNER_PUBKEY, () => 60);
        releaseRead();
        await task.promise;
        expect(upsert).toHaveBeenCalledWith(expect.objectContaining({
            parentEventId: PARENT_ID,
            expectedChildGeneration: 0,
            events: [expect.objectContaining({ event: expect.objectContaining({ id: reply.id }) })],
        }));
        await expect(dbA.postHistoryChildInteractions.count()).resolves.toBe(0);
        expect(onSavedInboundInteractions).not.toHaveBeenCalled();
        session.stop();
        dbA.close();
        dbB.close();
        await Dexie.delete(name);
    });

    it("does not save a pre-clear pending reply after the missing parent is resolved", async () => {
        const name = `sync-pending-generation-${crypto.randomUUID()}`;
        const dbA = new EHagakiDB(name);
        const dbB = new EHagakiDB(name);
        await dbA.open();
        await dbB.open();
        const repository = new DexiePostHistoryChildInteractionsRepository(dbA);
        const upsert = vi.spyOn(repository, "upsertChildInteractions");
        const reply = createEvent({
            id: "5".repeat(64),
            tags: [["p", OWNER_PUBKEY], ["e", OTHER_PARENT_ID, "", "reply"]],
        });
        rxNostrMock.use.mockReturnValue({
            subscribe: ({ next, complete }: Record<string, any>) => {
                next(createPacket(reply));
                complete();
                return { unsubscribe: vi.fn() };
            },
        });
        const parentFetch = createDeferred<{ event: NostrEvent | null; relayUrl: string | null }>();
        const onSavedInboundInteractions = vi.fn();
        const session = new PostHistoryInboundReplyReconciliationService({
            postHistoryRepository: {
                getExistingEventIdsForPubkey: vi.fn(async () => []),
                getByEventId: vi.fn(async (eventId: string) => eventId === OTHER_PARENT_ID ? ({
                    eventId,
                    kind: 1,
                    tags: [] as string[][],
                    createdAt: 90,
                    relayHints: [] as string[],
                    acceptedRelays: [] as string[],
                } as any) : null),
                upsertFetchedEvents: vi.fn(async () => ({
                    insertedCount: 1,
                    updatedCount: 0,
                    unchangedCount: 0,
                    appliedDeletionCount: 0,
                })),
            },
            postHistoryChildInteractionsRepository: repository,
            selfParentFetchService: {
                fetchSelfParent: vi.fn(() => ({
                    promise: parentFetch.promise,
                    cancel: vi.fn(),
                })),
            },
            now: () => 1_700_000_000_000,
            console: { warn: vi.fn(), error: vi.fn() },
        }).createSession({} as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
            onSavedInboundInteractions,
        });
        const { service } = createService({
            getChildWriteGeneration: () => getPostHistoryChildWriteGeneration(dbA),
            postHistoryChildInteractionsRepository: repository,
            postHistoryRepository: {
                getExistingEventIdsForPubkey: vi.fn(async () => []),
                getByEventId: vi.fn(async () => null),
            },
        });
        await service.syncRecent(rxNostrMock as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
            reason: "dialog-open-refresh",
            relayConfig: null,
            reconcileDirectReplyCandidates: (candidates) => session.reconcile(candidates),
        }).promise;
        expect(upsert).not.toHaveBeenCalled();
        await clearPostHistoryDisplayForPubkey(dbB, OWNER_PUBKEY, () => 60);
        parentFetch.resolve({
            event: createEvent({
                id: OTHER_PARENT_ID,
                pubkey: OWNER_PUBKEY,
                content: "other parent",
                tags: [],
            }),
            relayUrl: "wss://parent.example.com",
        });
        await vi.waitFor(() => {
            expect(upsert).toHaveBeenCalledWith(expect.objectContaining({
                expectedChildGeneration: 0,
            }));
        });
        await expect(dbA.postHistoryChildInteractions.count()).resolves.toBe(0);
        expect(onSavedInboundInteractions).not.toHaveBeenCalled();
        session.stop();
        dbA.close();
        dbB.close();
        await Dexie.delete(name);
    });

    it("saves a reply from a sync that starts after history is cleared", async () => {
        const name = `sync-after-clear-${crypto.randomUUID()}`;
        const dbA = new EHagakiDB(name);
        const dbB = new EHagakiDB(name);
        await dbA.open();
        await dbB.open();
        await clearPostHistoryDisplayForPubkey(dbB, OWNER_PUBKEY, () => 60);
        const repository = new DexiePostHistoryChildInteractionsRepository(dbA);
        const reply = createEvent({ id: "6".repeat(64), created_at: 120 });
        rxNostrMock.use.mockReturnValue({
            subscribe: ({ next, complete }: Record<string, any>) => {
                next(createPacket(reply));
                complete();
                return { unsubscribe: vi.fn() };
            },
        });
        const parentRecord = {
            eventId: PARENT_ID,
            kind: 1,
            tags: [] as string[][],
            createdAt: 90,
            relayHints: [] as string[],
            acceptedRelays: [] as string[],
        };
        const onSavedInboundInteractions = vi.fn();
        const session = new PostHistoryInboundReplyReconciliationService({
            postHistoryRepository: {
                getExistingEventIdsForPubkey: vi.fn(async () => [PARENT_ID]),
                getByEventId: vi.fn(async () => parentRecord as any),
                upsertFetchedEvents: vi.fn(),
            },
            postHistoryChildInteractionsRepository: repository,
            now: () => 1_700_000_000_000,
            console: { warn: vi.fn(), error: vi.fn() },
        }).createSession({} as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
            onSavedInboundInteractions,
        });
        const { service } = createService({
            getChildWriteGeneration: () => getPostHistoryChildWriteGeneration(dbA),
            postHistoryChildInteractionsRepository: repository,
            postHistoryRepository: {
                getExistingEventIdsForPubkey: vi.fn(async () => [PARENT_ID]),
                getByEventId: vi.fn(async () => parentRecord as any),
            },
        });
        await service.syncRecent(rxNostrMock as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
            reason: "dialog-open-refresh",
            relayConfig: null,
            reconcileDirectReplyCandidates: (candidates) => session.reconcile(candidates),
        }).promise;
        await expect(dbA.postHistoryChildInteractions.toArray()).resolves.toEqual([
            expect.objectContaining({ eventId: reply.id }),
        ]);
        expect(onSavedInboundInteractions).toHaveBeenCalledWith([PARENT_ID]);
        session.stop();
        dbA.close();
        dbB.close();
        await Dexie.delete(name);
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
