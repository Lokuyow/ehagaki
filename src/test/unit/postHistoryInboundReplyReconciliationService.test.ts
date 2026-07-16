import { describe, expect, it, vi } from "vitest";
import { classifyPostHistoryInboundInteraction } from "../../lib/postHistoryInboundInteractionClassifier";
import { PostHistoryInboundReplyReconciliationService } from "../../lib/postHistoryInboundReplyReconciliationService";
import type { NostrEvent } from "../../lib/types";

const OWNER_PUBKEY = "a".repeat(64);
const PARENT_ID = "1".repeat(64);

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

function createCandidate(event = createEvent()) {
    return {
        event,
        classification: classifyPostHistoryInboundInteraction({
            event,
            ownerPubkeyHex: OWNER_PUBKEY,
            ownerPostEventIds: new Set(),
        }),
        relayUrls: ["wss://relay.example.com"],
    };
}

function createDeferred<T>() {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>((nextResolve) => {
        resolve = nextResolve;
    });

    return { promise, resolve };
}

describe("PostHistoryInboundReplyReconciliationService", () => {
    it("keeps an unknown parent candidate pending until targeted self-parent resolve confirms it", async () => {
        const parentFetch = createDeferred<{ event: NostrEvent | null; relayUrl: string | null }>();
        const postHistoryRepository = {
            getExistingEventIdsForPubkey: vi.fn(async () => []),
            getByEventId: vi.fn(async (eventId: string) => eventId === PARENT_ID ? ({
                eventId,
                kind: 1,
                tags: [],
                createdAt: 90,
                relayHints: [],
                acceptedRelays: [],
            } as any) : null),
            upsertFetchedEvents: vi.fn(async () => ({
                insertedCount: 1,
                updatedCount: 0,
                unchangedCount: 0,
            })),
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
        const selfParentFetchService = {
            fetchSelfParent: vi.fn(() => ({
                promise: parentFetch.promise,
                cancel: vi.fn(),
            })),
        };
        const onSavedInboundInteractions = vi.fn();
        const session = new PostHistoryInboundReplyReconciliationService({
            postHistoryRepository,
            postHistoryChildInteractionsRepository,
            selfParentFetchService,
            now: () => 1_700_000_000_000,
            console: { warn: vi.fn(), error: vi.fn() },
        }).createSession({} as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
            onSavedInboundInteractions,
        });
        const candidate = createCandidate(createEvent({ id: "2".repeat(64) }));

        const result = await session.reconcile([candidate]);
        expect(result.unresolvedParentEventIds).toEqual([PARENT_ID]);
        expect(postHistoryChildInteractionsRepository.upsertDirectReplies).not.toHaveBeenCalled();

        parentFetch.resolve({
            event: createEvent({
                id: PARENT_ID,
                pubkey: OWNER_PUBKEY,
                content: "parent",
                tags: [],
            }),
            relayUrl: "wss://parent.example.com",
        });
        await parentFetch.promise;
        await Promise.resolve();
        await Promise.resolve();

        expect(postHistoryRepository.upsertFetchedEvents).toHaveBeenCalledWith({
            events: [{
                event: expect.objectContaining({ id: PARENT_ID, pubkey: OWNER_PUBKEY }),
                relayUrls: ["wss://parent.example.com"],
            }],
            fetchedAt: 1_700_000_000_000,
        });
        await vi.waitFor(() => {
            expect(postHistoryChildInteractionsRepository.upsertDirectReplies).toHaveBeenCalledWith({
                parentEventId: PARENT_ID,
                events: [{ event: candidate.event, relayUrls: candidate.relayUrls }],
                fetchedAt: 1_700_000_000_000,
            });
        });
        expect(onSavedInboundInteractions).toHaveBeenCalledWith([PARENT_ID]);
    });

    it("leaves targeted parent fetch null results unresolved without storing the candidate", async () => {
        const upsertChildInteractions = vi.fn();
        const postHistoryChildInteractionsRepository = {
            upsertChildInteractions,
            upsertDirectReplies: upsertChildInteractions,
        };
        const session = new PostHistoryInboundReplyReconciliationService({
            postHistoryRepository: {
                getExistingEventIdsForPubkey: vi.fn(async () => []),
                getByEventId: vi.fn(async () => null),
                upsertFetchedEvents: vi.fn(),
            },
            postHistoryChildInteractionsRepository,
            selfParentFetchService: {
                fetchSelfParent: vi.fn(() => ({
                    promise: Promise.resolve({ event: null, relayUrl: null }),
                    cancel: vi.fn(),
                })),
            },
            console: { warn: vi.fn(), error: vi.fn() },
        }).createSession({} as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
        });

        const result = await session.reconcile([createCandidate()]);
        await Promise.resolve();

        expect(result.unresolvedParentEventIds).toEqual([PARENT_ID]);
        expect(postHistoryChildInteractionsRepository.upsertDirectReplies).not.toHaveBeenCalled();
    });

    it("does not apply a stale targeted parent result after the owner session stops", async () => {
        const parentFetch = createDeferred<{ event: NostrEvent | null; relayUrl: string | null }>();
        const postHistoryRepository = {
            getExistingEventIdsForPubkey: vi.fn(async () => []),
            getByEventId: vi.fn(async () => null),
            upsertFetchedEvents: vi.fn(),
        };
        const upsertChildInteractions = vi.fn();
        const postHistoryChildInteractionsRepository = {
            upsertChildInteractions,
            upsertDirectReplies: upsertChildInteractions,
        };
        const session = new PostHistoryInboundReplyReconciliationService({
            postHistoryRepository,
            postHistoryChildInteractionsRepository,
            selfParentFetchService: {
                fetchSelfParent: vi.fn(() => ({
                    promise: parentFetch.promise,
                    cancel: vi.fn(),
                })),
            },
            console: { warn: vi.fn(), error: vi.fn() },
        }).createSession({} as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
        });

        await session.reconcile([createCandidate()]);
        session.stop();
        parentFetch.resolve({
            event: createEvent({
                id: PARENT_ID,
                pubkey: OWNER_PUBKEY,
                content: "parent",
                tags: [],
            }),
            relayUrl: "wss://parent.example.com",
        });
        await parentFetch.promise;
        await Promise.resolve();

        expect(postHistoryRepository.upsertFetchedEvents).not.toHaveBeenCalled();
        expect(postHistoryChildInteractionsRepository.upsertDirectReplies).not.toHaveBeenCalled();
    });

    it("keeps pending repository saves active across Dialog close while owner session stays active", async () => {
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
        const session = new PostHistoryInboundReplyReconciliationService({
            postHistoryRepository: {
                getExistingEventIdsForPubkey: vi.fn(async () => []),
                getByEventId: vi.fn(async (eventId: string) => eventId === PARENT_ID ? ({
                    eventId,
                    kind: 1,
                    tags: [],
                    createdAt: 90,
                    relayHints: [],
                    acceptedRelays: [],
                } as any) : null),
                upsertFetchedEvents: vi.fn(),
            },
            postHistoryChildInteractionsRepository,
            selfParentFetchService: {
                fetchSelfParent: vi.fn(() => ({
                    promise: new Promise<{ event: NostrEvent | null; relayUrl: string | null }>(
                        () => undefined,
                    ),
                    cancel: vi.fn(),
                })),
            },
            console: { warn: vi.fn(), error: vi.fn() },
        }).createSession({} as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
        });
        const candidate = createCandidate(createEvent({ id: "3".repeat(64) }));

        await session.reconcile([candidate]);
        await session.notifySelfPostsSaved([PARENT_ID]);

        expect(postHistoryChildInteractionsRepository.upsertDirectReplies).toHaveBeenCalledWith({
            parentEventId: PARENT_ID,
            events: [{ event: candidate.event, relayUrls: candidate.relayUrls }],
            fetchedAt: expect.any(Number),
        });
    });
});
