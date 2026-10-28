import "fake-indexeddb/auto";
import { finalizeEvent, generateSecretKey } from "nostr-tools";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
vi.mock("svelte", async original => ({ ...await original<typeof import("svelte")>(), onDestroy: vi.fn() }));
vi.mock("../../lib/profileMetadataCache.svelte", () => ({ profileMetadataCache: { getProfiles: async () => ({}), subscribe: () => () => {} } }));
import { ehagakiDb } from "../../lib/storage/ehagakiDb";
import { postHistoryRepository } from "../../lib/storage/postHistoryRepository";
import { postHistoryChildInteractionsRepository as children } from "../../lib/storage/postHistoryChildInteractionsRepository";
import { createPostHistoryThreadGraphHookHarness } from "../helpers/postHistoryThreadGraphHookHarness.svelte";
import type { RelatedEventsResult } from "../../lib/postHistoryRelatedEventsFetchService";

const key = generateSecretKey();
const parent = finalizeEvent({ kind: 1, content: "parent", tags: [], created_at: 100 }, key);
const reply = finalizeEvent({ kind: 1, content: "reply", tags: [["e", parent.id, "", "reply"]], created_at: 101 }, key);
const reaction = finalizeEvent({ kind: 7, content: "+", tags: [["e", parent.id], ["p", parent.pubkey]], created_at: 102 }, key);
let dispose: (() => void) | undefined;
beforeEach(async () => {
    await ehagakiDb.postHistory.clear(); await ehagakiDb.postHistoryChildInteractions.clear(); await ehagakiDb.postHistoryDeletionRequests.clear();
    await postHistoryRepository.upsertFetchedEvents({ events: [{ event: parent }] });
});
afterEach(() => { dispose?.(); dispose = undefined; });
async function setup() {
    const post = (await postHistoryRepository.getByEventId(parent.id))!;
    let resolve!: (result: RelatedEventsResult) => void;
    const pending = new Promise<RelatedEventsResult>(r => { resolve = r; });
    const cancel = vi.fn();
    const fetch = vi.fn(() => ({ promise: pending, cancel }));
    const onDeletedPost = vi.fn();
    const rx = {} as never;
    const harness = createPostHistoryThreadGraphHookHarness({
        getShow: () => true, getPubkeyHex: () => parent.pubkey, getRxNostr: () => rx, getRelayConfig: () => null,
        relatedEventsFetch: fetch, onDeletedPost,
        profileSyncCoordinator: { subscribe: () => () => {}, ensureProfile: () => null } as any,
    });
    dispose = harness.dispose;
    return { ...harness, post, resolve, fetch, cancel, onDeletedPost };
}
function result(overrides: Partial<RelatedEventsResult> = {}): RelatedEventsResult {
    return { status: "partial", events: [{ event: reply, relayUrls: [] }, { event: reaction, relayUrls: [] }],
        deletions: [], targets: [parent, reply, reaction], fetchedAt: Date.now(), repliesComplete: false, ...overrides };
}
describe("manual related event refresh", () => {
    it("shares an in-flight check, applies partial results, opens replies, and always fetches again", async () => {
        const h = await setup();
        const task = h.graph.refreshRelatedEvents(h.post);
        expect(h.graph.refreshRelatedEvents(h.post)).toBe(task);
        expect(h.graph.getAnchorState(h.post).relatedEventsStatus).toBe("loading");
        await vi.waitFor(() => expect(h.fetch).toHaveBeenCalledTimes(1));
        h.resolve(result()); await task;
        expect(h.graph.getAnchorState(h.post)).toMatchObject({ relatedEventsStatus: "partial", repliesActionState: { visible: true, replyCount: 1 }, reactionSummary: { totalCount: 1 } });
        const again = h.graph.refreshRelatedEvents(h.post); await again;
        expect(h.fetch).toHaveBeenCalledTimes(2);
        h.graph.toggleChildren(h.post);
        expect(h.graph.getAnchorState(h.post).repliesActionState.visible).toBe(false);
    });
    it("removes deleted cached reactions and new replies while ignoring another author's deletion", async () => {
        await children.upsertChildInteractions({ parentEventId: parent.id, events: [{ event: reaction }] });
        const h = await setup(); const task = h.graph.refreshRelatedEvents(h.post);
        await vi.waitFor(() => expect(h.fetch).toHaveBeenCalled());
        const deletion = finalizeEvent({ kind: 5, content: "", tags: [["e", reaction.id], ["e", reply.id]], created_at: 103 }, key);
        const invalid = finalizeEvent({ kind: 5, content: "", tags: [["e", parent.id]], created_at: 103 }, generateSecretKey());
        h.resolve(result({ deletions: [{ event: deletion, relayUrls: [] }, { event: invalid, relayUrls: [] }] })); await task;
        expect(await children.getChildInteractions(parent.id)).toEqual([]);
        expect(h.graph.getAnchorState(h.post).reactionSummary.totalCount).toBe(0);
        expect(h.onDeletedPost).not.toHaveBeenCalledWith(parent.id, expect.anything(), expect.anything());
        expect((await postHistoryRepository.getByEventId(parent.id))?.deletedAt).toBeUndefined();
    });
    it("updates the original post deletion", async () => {
        const h = await setup(); const task = h.graph.refreshRelatedEvents(h.post);
        await vi.waitFor(() => expect(h.fetch).toHaveBeenCalled());
        const deletion = finalizeEvent({ kind: 5, content: "", tags: [["e", parent.id]], created_at: 104 }, key);
        h.resolve(result({ deletions: [{ event: deletion, relayUrls: [] }] })); await task;
        expect((await postHistoryRepository.getByEventId(parent.id))?.deletedAt).toBe(104_000);
        expect(h.onDeletedPost).toHaveBeenCalledWith(parent.id, 104_000, deletion.id);
    });
    it("releases the request on close and does not save late results", async () => {
        const h = await setup(); const task = h.graph.refreshRelatedEvents(h.post);
        await vi.waitFor(() => expect(h.fetch).toHaveBeenCalled());
        h.graph.cancelCurrentGraphFetches(); h.resolve(result()); await task;
        expect(h.cancel).toHaveBeenCalled(); expect(await children.getChildInteractions(parent.id)).toEqual([]);
    });
});
