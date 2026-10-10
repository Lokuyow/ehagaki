import "fake-indexeddb/auto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { finalizeEvent, generateSecretKey, getPublicKey } from "nostr-tools";
import { buildRepostEvent, getRepostReference, verifyRepostTarget } from "../../lib/postRepostUtils";
import { PostRepostService } from "../../lib/postRepostService";
import { EHagakiDB } from "../../lib/storage/ehagakiDb";
import { DexiePostHistoryRepository } from "../../lib/storage/postHistoryRepository";
import { advancePostHistoryLocalRevision } from "../../lib/storage/postHistoryLocalWriteScope";
import { exportPostHistoryRecords } from "../../lib/postHistoryJsonlExportEngine";
import { PostHistoryLocalSearchService } from "../../lib/postHistoryLocalSearchService";
import { DexiePostHistoryAuthoredSyncStateRepository } from "../../lib/storage/postHistoryAuthoredSyncStateRepository";
import { DexiePostHistoryDeletionRequestsRepository } from "../../lib/storage/postHistoryDeletionRequestsRepository";
import { createPostHistoryRelatedTargetResolver } from "../../lib/postHistoryRelatedTargetResolver.svelte";
import type { AuthState, NostrEvent } from "../../lib/types";
import { createPlainNostrEventSnapshot } from "../../lib/postHistoryEventUtils";
import { DexiePostHistoryVisibleRangeRepository } from "../../lib/storage/postHistoryVisibleRangeRepository";
import { DexiePostHistoryImportedRangesRepository } from "../../lib/storage/postHistoryImportedRangesRepository";
import { DexiePostHistoryRelayCoverageRepository } from "../../lib/storage/postHistoryRelayCoverageRepository";

const relay = "wss://relay.example.com/";
const sign = (kind = 1, content = "original searchable post", tags: string[][] = []) =>
    createPlainNostrEventSnapshot(finalizeEvent({ kind, content, tags, created_at: 100 }, generateSecretKey()));
const dbs: EHagakiDB[] = [];
afterEach(async () => { await Promise.all(dbs.splice(0).map((db) => db.delete())); });
function repository() {
    const db = new EHagakiDB(`repost-test-${crypto.randomUUID()}`); dbs.push(db);
    return { db, repo: new DexiePostHistoryRepository(db) };
}
function outer(target: NostrEvent, content = "") { return sign(6, content, [["e", target.id, relay], ["p", target.pubkey]]); }

describe("kind 6 reference and wire policy", () => {
    it.each([{ tags: [] }, { tags: [["-"]] }])("always constructs empty content for target tags %j", ({ tags }) => {
        const target = sign(1, "private fixture body", tags);
        expect(buildRepostEvent(target, "a".repeat(64), relay, 200)).toEqual({
            kind: 6, pubkey: "a".repeat(64), created_at: 200, content: "",
            tags: [["e", target.id, relay], ["p", target.pubkey]],
        });
    });
    it("rejects unsupported, unsigned and mismatching targets", () => {
        const target = sign(); const ref = getRepostReference(outer(target))!;
        expect(verifyRepostTarget(sign(42))).toBeNull();
        expect(verifyRepostTarget({ ...target, sig: "0".repeat(128) })).toBeNull();
        expect(verifyRepostTarget(sign(), ref)).toBeNull();
        expect(verifyRepostTarget(target, { ...ref, authorHint: "a".repeat(64) })).toBeNull();
        expect(() => buildRepostEvent(target, target.pubkey, "javascript:invalid", 200)).toThrow();
    });
    it("merges same-ID references, rejects conflicting ones, and ignores all content", () => {
        const target = sign(); const event = outer(target, JSON.stringify(sign()));
        expect(getRepostReference({ ...event, tags: [...event.tags, ["e", target.id, "wss://other.example.com"]] })?.relayHints).toHaveLength(2);
        expect(getRepostReference({ ...event, tags: [...event.tags, ["e", "f".repeat(64), relay]] })).toBeNull();
        const ignoredContent = { ...event, content: "not JSON" };
        expect(getRepostReference(ignoredContent)).toEqual(getRepostReference(event));
    });
});

describe("repost persistence and interoperability", () => {
    it("saves both events atomically, keeps target out of timeline, and preserves snapshot across echo", async () => {
        const { db, repo } = repository(); const target = sign(); const event = outer(target);
        await repo.putPostedEvent({ event, repostTarget: { event: target, relayHints: [relay] } });
        await repo.upsertFetchedEvents({ events: [{ event, relayUrls: [relay] }] });
        expect(await db.postHistory.count()).toBe(1);
        expect((await repo.getLatestVisibleChunk({ pubkeyHex: event.pubkey, limit: 50 }))[0]?.repostTarget?.rawEvent).toEqual(target);
        expect(await repo.getByEventId(target.id)).toBeNull();
        const bad = outer(sign());
        await expect(repo.putPostedEvent({ event: bad, repostTarget: { event: target } })).rejects.toThrow();
        expect(await repo.getByEventId(bad.id)).toBeNull();
    });
    it.each(["", "invalid JSON", "embedded"])("stores opaque content %s without deriving a target", async (content) => {
        const { repo } = repository(); const target = sign();
        const event = outer(target, content === "embedded" ? JSON.stringify(target) : content);
        await repo.upsertFetchedEvents({ events: [{ event }] });
        const record = await repo.getByEventId(event.id);
        expect(record?.content).toBe(event.content);
        expect(record?.media).toEqual([]);
        expect(record?.repostTarget).toBeUndefined();
        await repo.attachRepostTarget({ outerEventId: event.id, target, relayHints: [relay],
            localWriteScope: { ownerPubkeyHex: event.pubkey, expectedRevision: 0, isActive: () => true } });
        expect((await repo.getByEventId(event.id))?.repostTarget?.rawEvent).toEqual(target);
    });
    it("does not recreate local history after its revision changed", async () => {
        const { db, repo } = repository(); const target = sign(); const event = outer(target);
        await repo.upsertFetchedEvents({ events: [{ event }] });
        await db.transaction("rw", db.meta, () => advancePostHistoryLocalRevision(db, event.pubkey, 200));
        await expect(repo.attachRepostTarget({ outerEventId: event.id, target,
            localWriteScope: { ownerPubkeyHex: event.pubkey, expectedRevision: 0, isActive: () => true } })).rejects.toThrow();
        expect((await repo.getByEventId(event.id))?.repostTarget).toBeUndefined();
    });
    it("does not resurrect a removed outer and rejects a mismatching owner", async () => {
        const { db, repo } = repository(); const target = sign(); const event = outer(target);
        const scope = { ownerPubkeyHex: event.pubkey, expectedRevision: 0, isActive: () => true };
        await repo.upsertFetchedEvents({ events: [{ event }] });
        await db.postHistory.delete(event.id);
        expect(await repo.attachRepostTarget({ outerEventId: event.id, target, localWriteScope: scope })).toBe(false);
        expect(await db.postHistory.count()).toBe(0);
        await expect(repo.putPostedEvent({ event, localWriteScope: { ...scope, ownerPubkeyHex: target.pubkey } })).rejects.toThrow("invalid_post_history_owner");
    });
    it("invalidates a built search projection when a verified snapshot arrives", async () => {
        const { repo } = repository(); const target = sign(); const event = outer(target);
        await repo.upsertFetchedEvents({ events: [{ event }] });
        const search = new PostHistoryLocalSearchService(repo);
        const query = { pubkeyHex: event.pubkey, query: "searchable", page: 1, pageSize: 50 };
        expect((await search.searchLocalPosts(query)).total).toBe(0);
        await repo.attachRepostTarget({ outerEventId: event.id, target,
            localWriteScope: { ownerPubkeyHex: event.pubkey, expectedRevision: 0, isActive: () => true } });
        expect((await search.searchLocalPosts(query)).items.map(record => record.eventId)).toEqual([event.id]);
    });
    it("searches verified original content as one outer result and exports only signed outer", async () => {
        const { repo } = repository(); const target = sign(); const event = outer(target, "embedded-only-token");
        await repo.putPostedEvent({ event, repostTarget: { event: target, relayHints: [relay] } });
        const search = new PostHistoryLocalSearchService(repo);
        const results = await search.searchLocalPosts({ pubkeyHex: event.pubkey, query: "searchable", page: 1, pageSize: 50 });
        expect(results.items.map((record) => record.eventId)).toEqual([event.id]);
        expect((await search.searchLocalPosts({ pubkeyHex: event.pubkey, query: "embedded-only-token", page: 1, pageSize: 50 })).total).toBe(0);
        const exported = await exportPostHistoryRecords(event.pubkey, results.items, [], { includeJsonl: true });
        expect(exported.jsonl?.trim().split("\n").map((line) => JSON.parse(line))).toEqual([event]);
    });
    it("does not reuse pre-Repost sync completion metadata", async () => {
        const { db } = repository(); const owner = sign().pubkey;
        await db.meta.put({ key: `postHistoryAuthoredSyncState:${owner}`, updatedAt: 1, value: { completedThroughTimestamp: 999 } });
        const state = new DexiePostHistoryAuthoredSyncStateRepository(db);
        expect(await state.get(owner)).toBeNull();
        await state.save(owner, { completedThroughTimestamp: 200 });
        expect(await db.meta.get(`postHistoryAuthoredSyncState:${owner}:1,6,42,1111`)).toBeDefined();
    });
    it("preserves legacy browsing ranges without claiming kind 6 relay coverage", async () => {
        const { db } = repository(); const owner = sign().pubkey;
        const visible = new DexiePostHistoryVisibleRangeRepository(db);
        await visible.save({ pubkeyHex: owner, kindsKey: "1,42,1111", visibleUntil: 200 });
        await new DexiePostHistoryImportedRangesRepository(db).record({ ownerPubkeyHex: owner,
            expectedRevision: 0, isActive: () => true, kindsKey: "1,42,1111", range: { since: 1, until: 200 } });
        expect(await visible.get(owner, "1,6,42,1111")).toMatchObject({ kindsKey: "1,6,42,1111", visibleUntil: 200 });
        expect((await new DexiePostHistoryImportedRangesRepository(db).get(owner, "1,6,42,1111")).ranges).toEqual([{ since: 1, until: 200 }]);
        expect((await new DexiePostHistoryRelayCoverageRepository(db).get(owner, "1,6,42,1111")).relays).toEqual([]);
    });
    it("can persist a valid self-target deletion without inserting its target into history", async () => {
        const { db } = repository(); const key = generateSecretKey();
        const target = finalizeEvent({ kind: 1, created_at: 100, content: "self target", tags: [] }, key);
        const deletion = finalizeEvent({ kind: 5, created_at: 200, content: "", tags: [["e", target.id], ["k", "1"]] }, key);
        const deletions = new DexiePostHistoryDeletionRequestsRepository(db);
        await deletions.saveLocalDeletion({ targetEvent: target, targetEventId: target.id, deletionEvent: deletion, deletedAt: 200 });
        expect(await db.postHistory.count()).toBe(0);
        expect((await deletions.getDeletedTargets([{ targetAuthorPubkey: target.pubkey, targetEventId: target.id }])).get(target.pubkey)?.has(target.id)).toBe(true);
    });
});

describe("Repost signing, publishing and save retry", () => {
    function service(saveHistory = vi.fn().mockResolvedValue(undefined)) {
        const key = generateSecretKey(); const auth = { value: { type: "nip07", isAuthenticated: true, pubkey: getPublicKey(key) } as AuthState };
        const signEvent = vi.fn(async (template): Promise<NostrEvent> => createPlainNostrEventSnapshot(finalizeEvent(template, key)));
        const sendEvent = vi.fn(async (event) => ({ success: true, eventId: event.id, acceptedRelays: [relay] }));
        const repost = new PostRepostService({ authStateStore: auth, getNip07Signer: () => ({ signEvent }),
            getWriteRelays: () => [relay], getClientTag: () => null, getLocalRevision: async () => 0,
            isTargetDeleted: async () => false,
            saveHistory, createSender: () => ({ sendEvent }) });
        return { repost, auth, signEvent, sendEvent, saveHistory };
    }
    it("retries exactly the original outer/target pair without signing or publishing again", async () => {
        const saved = vi.fn().mockRejectedValueOnce(new Error("quota")).mockResolvedValue(undefined);
        const { repost, signEvent, sendEvent } = service(saved); const target = sign();
        const result = await repost.repost({ target, relayHints: [relay], rxNostr: {} as never });
        expect(result).toMatchObject({ success: true, historySaved: false });
        expect(result.retryInput?.event.content).toBe("");
        expect(result.retryInput?.repostTarget?.event).toEqual(target);
        expect(await repost.retrySave(result.retryInput!)).toBe(true);
        expect(saved.mock.calls[0]?.[0]).toBe(saved.mock.calls[1]?.[0]);
        expect(signEvent).toHaveBeenCalledTimes(1); expect(sendEvent).toHaveBeenCalledTimes(1);
    });
    it("blocks concurrent execution and stops when the session changes during signing", async () => {
        const { repost, auth, signEvent, sendEvent } = service();
        let finish: (event: NostrEvent) => void = () => undefined;
        signEvent.mockImplementationOnce(() => new Promise((resolve) => { finish = resolve; }));
        const target = sign(); const pending = repost.repost({ target, relayHints: [relay], rxNostr: {} as never });
        await vi.waitFor(() => expect(signEvent).toHaveBeenCalledTimes(1));
        expect((await repost.repost({ target, relayHints: [relay], rxNostr: {} as never })).error).toBe("repost_busy");
        auth.value = { ...auth.value, isAuthenticated: false };
        finish(sign()); expect((await pending).success).toBe(false); expect(sendEvent).not.toHaveBeenCalled();
    });
    it("requires a target relay before signing", async () => {
        const { repost, signEvent } = service();
        expect((await repost.repost({ target: sign(), relayHints: [], rxNostr: {} as never })).error).toBe("repost_relay_missing");
        expect(signEvent).not.toHaveBeenCalled();
    });
    it.each(["nip07", "nip46", "parentClient", "nsec" ] as const)("supports the existing %s signer without the composer", async (type) => {
        const key = generateSecretKey(); const pubkey = getPublicKey(key);
        const signEvent = vi.fn(async template => createPlainNostrEventSnapshot(finalizeEvent(template, key)));
        const signer = { signEvent };
        const sendEvent = vi.fn(async (event: NostrEvent, _options?: unknown) => ({ success: true, eventId: event.id, acceptedRelays: [relay] }));
        const saveHistory = vi.fn();
        const repost = new PostRepostService({ authStateStore: { value: { type, pubkey, isAuthenticated: true } as AuthState },
            getNip07Signer: () => signer, getNip46Signer: async () => signer, getParentClientSigner: () => signer,
            keyManager: { getFromStore: () => "fixture-key-reference" } as never, seckeySignerFn: () => signer,
            getWriteRelays: () => [relay], getClientTag: () => ["client", "eHagaki"], getLocalRevision: async () => 0,
            isTargetDeleted: async () => false, saveHistory, createSender: () => ({ sendEvent }) });
        expect(await repost.repost({ target: sign(), relayHints: [], resolveRelayHint: async () => [relay], rxNostr: {} as never })).toMatchObject({ success: true, historySaved: true });
        expect(signEvent).toHaveBeenCalledTimes(1);
        expect(saveHistory.mock.calls[0]?.[0].event.tags).toContainEqual(["client", "eHagaki"]);
        expect(sendEvent.mock.calls[0]?.[1]).toEqual({ targetRelays: [relay], includeDefaultWriteRelays: false });
    });
    it("rejects a signer that changes the signed template", async () => {
        const { repost, signEvent, sendEvent } = service();
        signEvent.mockImplementationOnce(async () => sign(6, "unexpected content"));
        expect((await repost.repost({ target: sign(), relayHints: [relay], rxNostr: {} as never })).success).toBe(false);
        expect(sendEvent).not.toHaveBeenCalled();
    });
    it("preserves publication outcomes and does not save a failed publish", async () => {
        const { repost, sendEvent, saveHistory } = service();
        sendEvent.mockResolvedValueOnce({ success: false, error: "post_timeout" } as never);
        expect(await repost.repost({ target: sign(), relayHints: [relay], rxNostr: {} as never })).toEqual({ success: false, error: "post_timeout" });
        expect(saveHistory).not.toHaveBeenCalled();
    });
    it("saves a published pair for the captured author even when the session changes during publish", async () => {
        const { repost, auth, sendEvent, saveHistory } = service(); const owner = auth.value.pubkey;
        sendEvent.mockImplementationOnce(async event => {
            auth.value = { ...auth.value, pubkey: sign().pubkey };
            return { success: true, eventId: event.id, acceptedRelays: [relay] };
        });
        expect((await repost.repost({ target: sign(), relayHints: [relay], rxNostr: {} as never })).historySaved).toBe(true);
        expect(saveHistory.mock.calls[0]?.[0]).toMatchObject({ event: { pubkey: owner }, localWriteScope: { ownerPubkeyHex: owner } });
    });
});

describe("single related-target resolver for Reposts", () => {
    function resolverFor(target: NostrEvent, deleted = new Map<string, Set<string>>()) {
        const fetch = vi.fn(() => ({ promise: Promise.resolve({ event: target, relayUrl: relay }), cancel: vi.fn() }));
        const resolver = createPostHistoryRelatedTargetResolver({ getShow: () => true, getRxNostr: () => ({} as never),
            getRelayConfig: () => null, postHistoryRepositoryImpl: { getByEventId: async () => null },
            contextFetchService: { fetchEventById: fetch },
            profileSyncCoordinator: { ensureProfile: () => null, subscribe: () => () => undefined, reset: () => undefined } as never,
            deletionRequestsRepositoryImpl: { getDeletedTargets: async () => deleted, upsertValidDeletionRequests: vi.fn() },
            deletionFetchService: { fetchDeletionRequests: () => ({ promise: Promise.resolve({ status: "success" as const, events: [], fetchedAt: 0, relayUrls: [] }), cancel: () => undefined }) } });
        const descriptor = { targetEventId: target.id, relationKind: "repost", scopeKey: "reposts", authorHint: target.pubkey };
        return { resolver, fetch, descriptor };
    }
    it("deduplicates target fetching and validates the candidate independently of author hints", async () => {
        const target = sign(); const { resolver, fetch, descriptor } = resolverFor(target);
        const [first, second] = await Promise.all([resolver.ensureTarget({ ...descriptor, authorHint: "f".repeat(64) }), resolver.ensureTarget(descriptor)]);
        expect(fetch).toHaveBeenCalledTimes(1); expect(first?.event).toEqual(target); expect(second?.event).toEqual(target);
        resolver.reset();
    });
    it("rechecks a cached Repost target after a snapshot-only local deletion", async () => {
        const target = sign(); const deleted = new Map<string, Set<string>>();
        const { resolver, fetch, descriptor } = resolverFor(target, deleted);
        expect((await resolver.ensureTarget(descriptor))?.status).toBe("resolved");
        deleted.set(target.pubkey, new Set([target.id]));
        expect(await resolver.ensureTarget(descriptor)).toMatchObject({ status: "deleted", event: null });
        expect(fetch).toHaveBeenCalledTimes(1);
        resolver.reset();
    });
    it("keeps a valid other-kind quote cache when a Repost reference asks for the same ID", async () => {
        const target = sign(42); const { resolver, fetch, descriptor } = resolverFor(target);
        const quote = { ...descriptor, relationKind: "quote", scopeKey: "quotes" };
        expect((await resolver.ensureTarget(quote))?.event).toEqual(target);
        expect((await resolver.retryTarget(descriptor))?.event).toEqual(target);
        expect(verifyRepostTarget(resolver.getTargetSnapshot(target.id)?.event)).toBeNull();
        expect((await resolver.ensureTarget(quote))?.status).toBe("resolved");
        expect(fetch).toHaveBeenCalledTimes(1);
        resolver.reset();
    });
});
