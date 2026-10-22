import "fake-indexeddb/auto";
import { finalizeEvent } from "nostr-tools";
import type { EventPacket } from "rx-nostr";
import { Subject } from "rxjs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("svelte", async (importOriginal) => ({
    ...await importOriginal<typeof import("svelte")>(),
    onDestroy: vi.fn(),
}));

import { LocalRelayTransport } from "../../lib/localRelayTransport";
import { PostHistoryAuthoredPostsRealtimeService } from "../../lib/postHistoryAuthoredPostsRealtimeService";
import type { PostHistoryDeletionFetchResult } from "../../lib/postHistoryDeletionFetchService";
import { PostHistoryDirectReplyRepairSaveService } from "../../lib/postHistoryDirectReplyRepairSaveService";
import { postHistoryLocalRelayService } from "../../lib/postHistoryLocalRelayService";
import { createPostHistoryRelatedTargetResolver } from "../../lib/postHistoryRelatedTargetResolver.svelte";
import { PostHistoryVisibleRangeChildInteractionRepairService } from "../../lib/postHistoryVisibleRangeChildInteractionRepairService";
import { ehagakiDb, EHagakiDB } from "../../lib/storage/ehagakiDb";
import { postHistoryChildInteractionsRepository } from "../../lib/storage/postHistoryChildInteractionsRepository";
import { postHistoryDeletionRequestsRepository } from "../../lib/storage/postHistoryDeletionRequestsRepository";
import { clearPostHistoryDisplayForPubkey } from "../../lib/storage/postHistoryPersistenceCoordinator";
import { postHistoryRepository } from "../../lib/storage/postHistoryRepository";
import type { NostrEvent } from "../../lib/types";
import { createDeferred } from "../deferredTestUtils";
import { createMockRxNostr } from "../helpers";
import { createPostHistoryThreadGraphHookHarness } from "../helpers/postHistoryThreadGraphHookHarness.svelte";

// Synthetic events only; no external relay or user database is used.
const sign = (time: number, tags: string[][] = [], kind = 1): NostrEvent =>
    finalizeEvent({ kind, created_at: time, tags, content: `fixture-${time}` }, new Uint8Array(32).fill(7));
const owner = sign(100).pubkey;
const relayUrl = "wss://relay.example.com/";
const cleanups: Array<() => void> = [];
let otherTab: EHagakiDB;

beforeEach(async () => {
    await ehagakiDb.open();
    otherTab = new EHagakiDB(ehagakiDb.name);
    await otherTab.open();
});

afterEach(async () => {
    for (const cleanup of cleanups.splice(0).reverse()) cleanup();
    postHistoryLocalRelayService.cancelSession();
    vi.restoreAllMocks();
    otherTab.close();
    ehagakiDb.close();
    await ehagakiDb.delete();
});

function relayPackets() {
    const packets = new Subject<EventPacket>();
    const rxNostr = createMockRxNostr();
    vi.mocked(rxNostr.use).mockReturnValue(packets.asObservable());
    cleanups.push(() => packets.complete());
    return {
        rxNostr,
        complete: () => packets.complete(),
        receive: (event: NostrEvent) => packets.next({
            type: "EVENT", from: relayUrl, subId: "fixture:0",
            message: ["EVENT", "fixture:0", event], event,
        }),
    };
}

describe("post history write generations across connections", () => {
    it("rejects queued pre-clear posts but keeps new posts from the same realtime subscription", async () => {
        const relay = relayPackets();
        const savedFirstPost = createDeferred<void>();
        const releaseQueue = createDeferred<void>();
        cleanups.push(() => releaseQueue.resolve());
        const first = sign(100), queued = sign(101), fresh = sign(102);
        const onSavedSelfPosts = vi.fn(async (ids: string[]) => {
            if (ids.includes(first.id)) {
                savedFirstPost.resolve();
                await releaseQueue.promise;
            }
        });
        const subscription = new PostHistoryAuthoredPostsRealtimeService().subscribe(relay.rxNostr, {
            ownerPubkeyHex: owner, onSavedSelfPosts,
        });
        cleanups.push(() => subscription.stop());
        relay.receive(first);
        await savedFirstPost.promise;
        relay.receive(queued);
        await clearPostHistoryDisplayForPubkey(otherTab, owner, Date.now);
        relay.receive(fresh);
        releaseQueue.resolve();
        await subscription.waitForIdle();

        expect((await ehagakiDb.postHistory.toArray()).map(post => post.eventId)).toEqual([fresh.id]);
        expect(onSavedSelfPosts.mock.calls.map(([ids]) => ids)).toEqual([[first.id], [fresh.id]]);
    });

    it("rejects replies fetched by a repair that started before another connection cleared history", async () => {
        const parent = sign(100);
        const reply = sign(101, [["e", parent.id, "", "root"], ["p", owner]]);
        await postHistoryRepository.upsertFetchedEvents({ events: [{ event: parent }] });
        const posts = await postHistoryRepository.getAll({ pubkeyHex: owner });
        const relay = relayPackets();
        const directReplySaveService = new PostHistoryDirectReplyRepairSaveService({
            deletionFetchService: {
                fetchDeletionRequests: () => ({
                    promise: Promise.resolve({ status: "success", events: [], fetchedAt: 200, relayUrls: [] }),
                    cancel: vi.fn(),
                }),
            },
        });
        const service = new PostHistoryVisibleRangeChildInteractionRepairService({ directReplySaveService });
        const task = service.repairVisibleRangeChildInteractions(relay.rxNostr, {
            ownerPubkeyHex: owner, visiblePosts: posts,
            relayConfig: { [relayUrl]: { read: true, write: false } },
        });
        cleanups.push(() => task.cancel());
        await clearPostHistoryDisplayForPubkey(otherTab, owner, Date.now);
        relay.receive(reply);
        relay.complete();
        const result = await task.promise;

        expect(result.savedDirectReplyCount).toBe(0);
        expect(await ehagakiDb.postHistory.count()).toBe(0);
        expect(await ehagakiDb.postHistoryChildInteractions.count()).toBe(0);

        await postHistoryRepository.upsertFetchedEvents({ events: [{ event: parent }] });
        const freshRelay = relayPackets();
        const freshTask = service.repairVisibleRangeChildInteractions(freshRelay.rxNostr, {
            ownerPubkeyHex: owner, visiblePosts: posts,
            relayConfig: { [relayUrl]: { read: true, write: false } },
        });
        cleanups.push(() => freshTask.cancel());
        freshRelay.receive(reply);
        freshRelay.complete();
        expect((await freshTask.promise).savedDirectReplyCount).toBe(1);
        expect(await ehagakiDb.postHistoryChildInteractions.count()).toBe(1);
    });

    it.each([
        { surface: "thread", clearDuringFetch: false },
        { surface: "related", clearDuringFetch: false },
        { surface: "thread", clearDuringFetch: true },
        { surface: "related", clearDuringFetch: true },
    ])("$surface deletion archival respects a history clear during fetch: $clearDuringFetch", async ({ surface, clearDuringFetch }) => {
        const parent = sign(100);
        const reply = sign(101, [["e", parent.id, "", "root"], ["p", owner]]);
        const deletion = sign(102, [["e", parent.id], ["k", "1"]], 5);
        await postHistoryRepository.upsertFetchedEvents({ events: [{ event: parent }, { event: reply }] });
        await ehagakiDb.postHistoryWriteGeneration.put({ id: owner, value: 4, updatedAt: 1 });
        const store = vi.spyOn(LocalRelayTransport.prototype, "storeSignedEvents").mockReturnValue({
            promise: Promise.resolve(true), cancel: vi.fn(),
        });
        const archive = vi.spyOn(postHistoryLocalRelayService, "archiveAdoptedAuthored");
        postHistoryLocalRelayService.configureSession({ ownerPubkeyHex: owner, url: "ws://127.0.0.1:4869/", isActive: () => true });
        const relay = relayPackets();
        const deletionFetchStarted = createDeferred<void>();
        const deletionResult = createDeferred<PostHistoryDeletionFetchResult>();
        const deletionFetchService = {
            fetchDeletionRequests: () => {
                deletionFetchStarted.resolve();
                return { promise: deletionResult.promise, cancel: vi.fn() };
            },
        };
        const profileSyncCoordinator = {
            ensureProfile: () => null, subscribe: () => () => undefined,
            reset: vi.fn(), dispose: vi.fn(),
        };
        const resolver = createPostHistoryRelatedTargetResolver({
            getShow: () => true, getRxNostr: () => relay.rxNostr, getRelayConfig: () => null,
            profileSyncCoordinator, deletionFetchService,
        });
        cleanups.push(() => resolver.reset());

        let surfaceTask: Promise<unknown>;
        if (surface === "thread") {
            const parentSnapshot = {
                targetEventId: parent.id, status: "resolved" as const, event: parent,
                profile: null, authorPubkey: owner, relayHints: [relayUrl],
                errorCode: null, updatedAt: Date.now(),
            };
            const { graph, dispose } = createPostHistoryThreadGraphHookHarness({
                getShow: () => true, getPubkeyHex: () => owner,
                getRxNostr: () => relay.rxNostr, getRelayConfig: () => null,
                profileSyncCoordinator, deletionFetchService,
                postHistoryRepositoryImpl: postHistoryRepository,
                deletionRequestsRepositoryImpl: postHistoryDeletionRequestsRepository,
                childInteractionsRepositoryImpl: postHistoryChildInteractionsRepository,
                directReplyRecordsAdapterImpl: { getDirectReplyRecords: async () => [] },
                reactionRecordsAdapterImpl: { getReactionRecords: async () => [] },
                relatedTargetResolver: {
                    ...resolver,
                    getTargetSnapshot: eventId => eventId === parent.id ? parentSnapshot : null,
                },
            });
            cleanups.push(() => { graph.resetState(); dispose(); });
            const posts = await postHistoryRepository.getAll({ pubkeyHex: owner });
            await graph.loadCachedChildInteractionStateForPosts(posts);
            const replyPost = posts.find(post => post.eventId === reply.id);
            if (!replyPost) throw new Error("Missing reply fixture");
            surfaceTask = graph.toggleParent(replyPost);
        } else {
            surfaceTask = resolver.ensureTarget({ targetEventId: parent.id, relationKind: "quote", scopeKey: "fixture" });
        }

        await deletionFetchStarted.promise;
        if (clearDuringFetch) {
            await clearPostHistoryDisplayForPubkey(otherTab, owner, Date.now);
            await postHistoryRepository.upsertFetchedEvents({ events: [{ event: parent }] });
        }
        deletionResult.resolve({
            status: "success", events: [{ event: deletion, relayUrls: [relayUrl] }],
            fetchedAt: 200, relayUrls: [relayUrl],
        });
        await surfaceTask;
        await vi.waitFor(() => expect(archive).toHaveBeenCalled());
        await Promise.all(archive.mock.results.map(result => result.type === "return" ? result.value : undefined));
        if (clearDuringFetch) {
            expect(store).not.toHaveBeenCalled();
        } else {
            expect(store.mock.calls.flatMap(([, events]) => events.map(event => event.id))).toContain(deletion.id);
        }
    });
});
