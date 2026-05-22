import { describe, expect, it, vi } from "vitest";
import { PostHistoryLightweightSyncCoordinator } from "../../lib/postHistoryLightweightSyncCoordinator";
import type { NostrEvent } from "../../lib/types";

const OWNER_PUBKEY = "a".repeat(64);
const OTHER_OWNER_PUBKEY = "b".repeat(64);

function createDeferred<T>() {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>((nextResolve) => {
        resolve = nextResolve;
    });

    return { promise, resolve };
}

function createEvent(): NostrEvent {
    return {
        id: "1".repeat(64),
        pubkey: OWNER_PUBKEY,
        kind: 1,
        content: "authored",
        tags: [],
        created_at: 100,
        sig: "c".repeat(128),
    };
}

function createAuthoredResult(event = createEvent()) {
    return {
        status: "success",
        events: [{ event, relayUrls: [] }],
        fetchedAt: 1000,
        nextUntil: null,
        hasMore: false,
        relayUrls: [],
        observedRelayUrls: [],
        rawCount: 1,
        uniqueCount: 1,
        duplicateCount: 0,
        perRelayCounts: [],
        oldestCreatedAt: event.created_at,
        newestCreatedAt: event.created_at,
        requestedRelayUrls: [],
        eventRelayUrls: [],
        eoseRelayUrls: [],
        closedRelayUrls: [],
        errorRelayUrls: [],
        downRelayUrls: [],
        completedByRxNostr: true,
        completedByLocalTimeout: false,
        hasAnyRelayResponse: true,
        allRelaysFailed: false,
    } as const;
}

function createInboundResult() {
    return {
        status: "success",
        fetchedAt: 1000,
        since: 10,
        limit: 100,
        relayUrls: [],
        rawCount: 0,
        uniqueCount: 0,
        saturated: false,
        maybeIncomplete: false,
        newestSeenCreatedAt: null,
        savedParentEventIds: [],
        savedDirectReplyCount: 0,
        classifications: {
            "direct-reply": 0,
            "direct-reply-candidate": 0,
            "mention-like": 0,
            reaction: 0,
            unsupported: 0,
        },
    } as const;
}

describe("PostHistoryLightweightSyncCoordinator", () => {
    it("dedupes same-owner authored lightweight sync across reasons and fires save side effects once", async () => {
        const deferred = createDeferred<ReturnType<typeof createAuthoredResult>>();
        const fetchLatest = vi.fn(() => ({
            promise: deferred.promise,
            cancel: vi.fn(),
        }));
        const upsertFetchedEvents = vi.fn(async () => ({
            insertedCount: 1,
            updatedCount: 0,
            unchangedCount: 0,
        }));
        const onResumeSaved = vi.fn();
        const onDialogSaved = vi.fn();
        const coordinator = new PostHistoryLightweightSyncCoordinator({
            postHistoryRelayFetchService: { fetchLatest } as any,
            postHistoryInboundInteractionsSyncService: { syncRecent: vi.fn() } as any,
            postHistoryRepository: { upsertFetchedEvents } as any,
        });

        const resume = coordinator.runAuthored({} as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
            reason: "visibility-resume",
            onSavedSelfPosts: onResumeSaved,
        });
        const dialog = coordinator.runAuthored({} as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
            reason: "dialog-open-refresh",
            onSavedSelfPosts: onDialogSaved,
        });
        deferred.resolve(createAuthoredResult());
        await Promise.all([resume.promise, dialog.promise]);

        expect(fetchLatest).toHaveBeenCalledOnce();
        expect(dialog.joinedExisting).toBe(true);
        expect(upsertFetchedEvents).toHaveBeenCalledOnce();
        expect(onResumeSaved).toHaveBeenCalledOnce();
        expect(onDialogSaved).not.toHaveBeenCalled();
    });

    it("dedupes same-owner inbound lightweight sync, allows authored in parallel, and restarts after completion", async () => {
        const inboundDeferred = createDeferred<ReturnType<typeof createInboundResult>>();
        const syncRecent = vi.fn(() => ({
            promise: inboundDeferred.promise,
            cancel: vi.fn(),
        }));
        const fetchLatest = vi.fn(() => ({
            promise: Promise.resolve(createAuthoredResult()),
            cancel: vi.fn(),
        }));
        const coordinator = new PostHistoryLightweightSyncCoordinator({
            postHistoryRelayFetchService: { fetchLatest } as any,
            postHistoryInboundInteractionsSyncService: { syncRecent } as any,
            postHistoryRepository: {
                upsertFetchedEvents: vi.fn(async () => ({
                    insertedCount: 0,
                    updatedCount: 0,
                    unchangedCount: 1,
                })),
            } as any,
        });

        const dialog = coordinator.runInbound({} as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
            reason: "dialog-open-refresh",
        });
        const resume = coordinator.runInbound({} as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
            reason: "visibility-resume",
        });
        const authored = coordinator.runAuthored({} as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
            reason: "visibility-resume",
        });
        const otherOwner = coordinator.runInbound({} as any, {
            ownerPubkeyHex: OTHER_OWNER_PUBKEY,
            reason: "visibility-resume",
        });

        expect(syncRecent).toHaveBeenCalledTimes(2);
        expect(resume.joinedExisting).toBe(true);
        expect(fetchLatest).toHaveBeenCalledOnce();
        inboundDeferred.resolve(createInboundResult());
        await Promise.all([dialog.promise, resume.promise, authored.promise, otherOwner.promise]);

        coordinator.runInbound({} as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
            reason: "visibility-resume",
        });
        expect(syncRecent).toHaveBeenCalledTimes(3);
    });

    it("drops a cancelled starter from the authored in-flight map", () => {
        const fetchLatest = vi.fn(() => ({
            promise: new Promise<ReturnType<typeof createAuthoredResult>>(() => undefined),
            cancel: vi.fn(),
        }));
        const coordinator = new PostHistoryLightweightSyncCoordinator({
            postHistoryRelayFetchService: { fetchLatest } as any,
            postHistoryInboundInteractionsSyncService: { syncRecent: vi.fn() } as any,
            postHistoryRepository: { upsertFetchedEvents: vi.fn() } as any,
        });

        const first = coordinator.runAuthored({} as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
            reason: "dialog-open-refresh",
        });
        first.cancel();
        const next = coordinator.runAuthored({} as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
            reason: "visibility-resume",
        });

        expect(next.joinedExisting).toBe(false);
        expect(fetchLatest).toHaveBeenCalledTimes(2);
    });
});
