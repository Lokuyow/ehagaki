import { describe, expect, it, vi } from "vitest";
import type { RxNostr } from "rx-nostr";
import type { RelayConfig } from "../../lib/types";
import { PostHistoryLightweightSyncCoordinator } from "../../lib/postHistoryLightweightSyncCoordinator";
import { createAuthoredFetchResult, createInboundSyncResult } from "../postHistorySyncResultTestUtils";

const owner = "a".repeat(64);
const event = { id: "1".repeat(64), pubkey: owner, kind: 1, content: "synthetic", tags: [], created_at: 100, sig: "c".repeat(128) };
function harness() {
    let resolve!: (value: ReturnType<typeof createAuthoredFetchResult>) => void;
    const promise = new Promise<ReturnType<typeof createAuthoredFetchResult>>((done) => { resolve = done; });
    const cancel = vi.fn();
    const fetchLatest = vi.fn(() => ({ promise, cancel }));
    const upsertFetchedEvents = vi.fn(async (_input: unknown) => ({ insertedCount: 1, updatedCount: 0, unchangedCount: 0, appliedDeletionCount: 0 }));
    const saveLatestObservedCreatedAt = vi.fn(async () => null);
    const syncRecent = vi.fn(() => ({ promise: Promise.resolve(createInboundSyncResult()), cancel: vi.fn() }));
    const coordinator = new PostHistoryLightweightSyncCoordinator({ postHistoryRelayFetchService: { fetchLatest },
        postHistoryRepository: { upsertFetchedEvents }, authoredSyncStateRepository: { saveLatestObservedCreatedAt },
        postHistoryInboundInteractionsSyncService: { syncRecent } as any, now: () => 1000 });
    const runtime = {} as RxNostr;
    const request = { ownerPubkeyHex: owner, reason: "dialog-open-refresh" as const, since: 10, until: 200 };
    return { coordinator, runtime, request, fetchLatest, cancel, upsertFetchedEvents, syncRecent, saveLatestObservedCreatedAt,
        resolve: () => resolve(createAuthoredFetchResult(event, { relayFetchCoverage: [{ relayUrl: "wss://relay.example.com/", ranges: [{ since: 10, until: 200 }] }] })) };
}

describe("scoped lightweight authored synchronization", () => {
    it("rejects a catchup page whose history revision changed before transport", async () => {
        const h = harness();
        const task = h.coordinator.runAuthored(h.runtime, { ...h.request,
            reason: "dialog-open-catchup", expectedLocalRevision: -1 });
        expect((await task.promise).fetchResult.status).toBe("cancelled");
        expect(h.fetchLatest).not.toHaveBeenCalled();
        expect(h.upsertFetchedEvents).not.toHaveBeenCalled();
    });
    it("owner cancellation also invalidates a lease before its source has started", async () => {
        const h = harness();
        const task = h.coordinator.runAuthored(h.runtime, h.request);
        h.coordinator.cancelOwnerTasks(owner);
        expect((await task.promise).fetchResult.status).toBe("cancelled");
        expect(h.fetchLatest).not.toHaveBeenCalled();
        expect(h.upsertFetchedEvents).not.toHaveBeenCalled();
    });
    it("shares identical owner/runtime/query leases and saves/notifies once", async () => {
        const h = harness(); const firstSaved = vi.fn(); const nextSaved = vi.fn();
        const first = h.coordinator.runAuthored(h.runtime, { ...h.request, onSavedSelfPosts: firstSaved });
        const next = h.coordinator.runAuthored(h.runtime, { ...h.request, onSavedSelfPosts: nextSaved });
        await vi.waitFor(() => expect(h.fetchLatest).toHaveBeenCalledOnce());
        h.resolve(); await Promise.all([first.promise, next.promise]);
        expect(next.joinedExisting).toBe(true);
        expect(h.upsertFetchedEvents).toHaveBeenCalledOnce(); expect(firstSaved).toHaveBeenCalledOnce(); expect(nextSaved).not.toHaveBeenCalled();
        expect(h.upsertFetchedEvents.mock.calls[0][0]).toMatchObject({ relayFetchCoverage: {
            ownerPubkeyHex: owner, kindsKey: "1,42,1111", expectedRevision: expect.any(Number), relays: expect.any(Array),
        } });
    });
    it.each(["range", "reason", "runtime", "kinds", "config"])("does not share different %s conditions", async (difference) => {
        const h = harness();
        const first = h.coordinator.runAuthored(h.runtime, h.request);
        const request = { ...h.request, ...(difference === "range" ? { since: 20 } : {}),
            ...(difference === "reason" ? { reason: "foreground-periodic" as const } : {}),
            ...(difference === "kinds" ? { kinds: [1] } : {}),
            ...(difference === "config" ? { relayConfig: { "wss://other.example.com/": { read: true, write: false } } } : {}) };
        const next = h.coordinator.runAuthored(difference === "runtime" ? {} as RxNostr : h.runtime, request);
        await vi.waitFor(() => expect(h.fetchLatest).toHaveBeenCalledTimes(2));
        h.resolve(); await Promise.all([first.promise, next.promise]);
        expect(next.joinedExisting).toBe(false);
    });
    it("keeps a valid joined lease alive when the starter closes", async () => {
        const h = harness(); const starterSaved = vi.fn(); const joinedSaved = vi.fn();
        const starter = h.coordinator.runAuthored(h.runtime, { ...h.request, onSavedSelfPosts: starterSaved });
        const joined = h.coordinator.runAuthored(h.runtime, { ...h.request, onSavedSelfPosts: joinedSaved });
        await vi.waitFor(() => expect(joined.joinedExisting).toBe(true));
        starter.cancel(); h.resolve(); await joined.promise;
        expect(h.cancel).not.toHaveBeenCalled(); expect(starterSaved).not.toHaveBeenCalled(); expect(joinedSaved).toHaveBeenCalledOnce();
        expect(h.upsertFetchedEvents).toHaveBeenCalledOnce();
        expect(h.coordinator.isForegroundPeriodicCooldownActive(owner, "authored", 1001)).toBe(true);
    });
    it("drops a cancelled pending starter before transport and permits the next session", async () => {
        const h = harness(); const first = h.coordinator.runAuthored(h.runtime, h.request); first.cancel();
        const next = h.coordinator.runAuthored(h.runtime, h.request);
        await vi.waitFor(() => expect(h.fetchLatest).toHaveBeenCalledOnce());
        h.resolve(); await next.promise;
        expect((await first.promise).fetchResult.status).toBe("cancelled"); expect(next.joinedExisting).toBe(false);
    });
    it("owner cancellation suppresses a late source completion and all side effects", async () => {
        const h = harness(); const saved = vi.fn();
        const task = h.coordinator.runAuthored(h.runtime, { ...h.request, onSavedSelfPosts: saved });
        await vi.waitFor(() => expect(h.fetchLatest).toHaveBeenCalledOnce());
        h.coordinator.cancelOwnerTasks(owner); h.resolve();
        expect((await task.promise).fetchResult.status).toBe("cancelled");
        expect(h.upsertFetchedEvents).not.toHaveBeenCalled(); expect(saved).not.toHaveBeenCalled(); expect(h.saveLatestObservedCreatedAt).not.toHaveBeenCalled();
    });
    it("config/account/session generations invalidate a result even after A to B to A", async () => {
        const h = harness(); let generation = 0;
        const task = h.coordinator.runAuthored(h.runtime, { ...h.request, isActive: () => generation === 0 });
        await vi.waitFor(() => expect(h.fetchLatest).toHaveBeenCalledOnce());
        generation += 2; h.resolve();
        expect((await task.promise).fetchResult.status).toBe("cancelled"); expect(h.upsertFetchedEvents).not.toHaveBeenCalled();
    });
    it.each([null, undefined])("invalidates a query when current relay config is cleared to %s", async (cleared) => {
        const h = harness(); const saved = vi.fn();
        let relayConfig: RelayConfig | null | undefined = { "wss://original.example.com/": { read: true, write: true } };
        const task = h.coordinator.runAuthored(h.runtime, { ...h.request, relayConfig,
            getRelayConfig: () => relayConfig, onSavedSelfPosts: saved });
        await vi.waitFor(() => expect(h.fetchLatest).toHaveBeenCalledOnce());
        relayConfig = cleared; h.resolve();
        expect((await task.promise).fetchResult.status).toBe("cancelled");
        expect(h.upsertFetchedEvents).not.toHaveBeenCalled(); expect(saved).not.toHaveBeenCalled();
        expect(h.saveLatestObservedCreatedAt).not.toHaveBeenCalled();
    });
    it("inbound deduplication remains separate from the authored query lane", async () => {
        const h = harness();
        const first = h.coordinator.runInbound(h.runtime, h.request);
        const next = h.coordinator.runInbound(h.runtime, h.request);
        const authored = h.coordinator.runAuthored(h.runtime, h.request);
        await vi.waitFor(() => expect(h.fetchLatest).toHaveBeenCalledOnce()); h.resolve();
        await Promise.all([first.promise, next.promise, authored.promise]);
        expect(next.joinedExisting).toBe(true); expect(h.syncRecent).toHaveBeenCalledOnce();
    });
});
