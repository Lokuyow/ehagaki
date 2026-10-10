import "fake-indexeddb/auto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { finalizeEvent, generateSecretKey, getPublicKey } from "nostr-tools";
import { buildRepostEvent, classifyRepostTargetKind, createRepostTargetSnapshot, getRepostReference, parseRepostReference, repostTargetToPost, verifyRepostTarget, verifySupportedRepostTarget } from "../../lib/postRepostUtils";
import { PostRepostService, type PrepareRepostTarget } from "../../lib/postRepostService";
import { EHagakiDB, ehagakiDb } from "../../lib/storage/ehagakiDb";
import { DexiePostHistoryRepository, postHistoryRepository } from "../../lib/storage/postHistoryRepository";
import { loadStoredRepostTarget } from "../../lib/hooks/usePostHistoryRepostPreviews.svelte";
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
const confirmedTarget: PrepareRepostTarget = async (event, relayHints) => ({ targetEventId: event.id,
    status: "resolved", event, profile: null, authorPubkey: event.pubkey, relayHints, errorCode: null, updatedAt: 0 });
const dbs: EHagakiDB[] = [];
afterEach(async () => { await Promise.all(dbs.splice(0).map((db) => db.delete())); });
function repository() {
    const db = new EHagakiDB(`repost-test-${crypto.randomUUID()}`); dbs.push(db);
    return { db, repo: new DexiePostHistoryRepository(db) };
}
function outer(target: NostrEvent, content = "") { return sign(6, content, [["e", target.id, relay], ["p", target.pubkey]]); }

describe("kind 6 reference and wire policy", () => {
    it.each([true, false])("allows extra valid p tags and checks the verified target author (target first: %s)", (targetFirst) => {
        const target = sign(); const other = sign().pubkey;
        const authors = targetFirst ? [target.pubkey, other] : [other, target.pubkey];
        const reference = getRepostReference(outer(target));
        const multi = getRepostReference({ kind: 6, tags: [["e", target.id, relay], ...authors.map(pubkey => ["p", pubkey])] });
        expect(multi).not.toBeNull();
        expect(verifyRepostTarget(target, multi)).not.toBeNull();
        expect(verifyRepostTarget(target, { ...reference!, authorHint: null, authorHints: [other, sign().pubkey] })).toBeNull();
    });
    it.each([{ tags: [] }, { tags: [["-"]] }])("always constructs empty content for target tags %j", ({ tags }) => {
        const target = sign(1, "private fixture body", tags);
        expect(buildRepostEvent(target, "a".repeat(64), relay, 200)).toEqual({
            kind: 6, pubkey: "a".repeat(64), created_at: 200, content: "",
            tags: [["e", target.id, relay], ["p", target.pubkey]],
        });
    });
    it("rejects unsupported, unsigned and mismatching targets", () => {
        const target = sign(); const ref = getRepostReference(outer(target))!;
        expect(() => buildRepostEvent(sign(40), target.pubkey, relay, 200)).toThrow();
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

describe("Generic Repost references and supported target projection", () => {
    it.each([42, 1111])("builds kind 16 for %s without copying target tags", (kind) => {
        const target = sign(kind, "body", [["e", "b".repeat(64), relay, "root"], ["k", "1"], ["-"], ["content-warning", "CW"]]);
        expect(buildRepostEvent(target, "a".repeat(64), relay, 200, ["client", "eHagaki"])).toEqual({
            kind: 16, content: "", pubkey: "a".repeat(64), created_at: 200,
            tags: [["e", target.id, relay], ["p", target.pubkey], ["k", String(kind)], ["client", "eHagaki"]],
        });
    });
    it.each(["0", "1", "42", "1111", "65535"])("accepts canonical k %s and its duplicates", (value) => {
        const target = sign(Number(value));
        const ref = getRepostReference({ kind: 16, tags: [["e", target.id], ["k", value], ["k", value]] });
        expect(ref?.targetKindHint).toBe(Number(value));
        expect(verifyRepostTarget(target, ref)).not.toBeNull();
    });
    it.each(["", "-1", "-0", "+42", "42.0", "4.2e1", " 42", "42 ", "42\n", "\t42", "0x2a", "4_2", "042", "00", "65536", "9007199254740991", "NaN"])("rejects noncanonical or out-of-range k %j", (value) => {
        expect(parseRepostReference({ kind: 16, tags: [["e", "a".repeat(64)], ["k", value]] }).status).toBe("invalid-reference");
    });
    it("permits missing k, rejects conflicting k/e/p and distinguishes a-only references", () => {
        const target = sign(42);
        const tags = [["e", target.id, relay], ["p", target.pubkey]];
        expect(getRepostReference({ kind: 16, tags })?.targetKindHint).toBeNull();
        expect(getRepostReference({ kind: 16, tags: [...tags, ["a", "30023:author:name"]] })).not.toBeNull();
        for (const extra of [[["k", "42"], ["k", "1111"]], [["k"]], [["e", sign().id]], [["p", "invalid"]]]) {
            expect(parseRepostReference({ kind: 16, tags: [...tags, ...extra] }).status).toBe("invalid-reference");
        }
        expect(parseRepostReference({ kind: 16, tags: [["a", "30023:author:name"]] }).status).toBe("unsupported-reference");
        expect(verifyRepostTarget(target, { ...getRepostReference({ kind: 16, tags })!, targetKindHint: 1111 })).toBeNull();
    });
    it.each([
        [6, 1, "supported"], [6, 42, "outer-target-kind-mismatch"], [6, 1111, "outer-target-kind-mismatch"],
        [16, 1, "outer-target-kind-mismatch"], [16, 20, "unsupported-target-kind"],
        [16, 42, "supported"], [16, 1111, "supported"],
    ] as const)("separates integrity from classification for %s -> %s (%s)", async (outerKind, targetKind, classification) => {
        const { repo } = repository(); const target = sign(targetKind, "target-only-token");
        const event = sign(outerKind, JSON.stringify(target), [["e", target.id], ["p", target.pubkey], ...(outerKind === 16 ? [["k", String(targetKind)]] : [])]);
        const ref = getRepostReference(event)!;
        expect(verifyRepostTarget(target, ref)).not.toBeNull();
        expect(classifyRepostTargetKind(ref.outerKind, target.kind)).toBe(classification);
        expect(!!verifySupportedRepostTarget(target, ref)).toBe(classification === "supported");
        expect(!!createRepostTargetSnapshot(target, [], ref)).toBe(classification === "supported");
        await repo.upsertFetchedEvents({ events: [{ event }] });
        if (classification !== "supported") {
            await expect(repo.attachRepostTarget({ outerEventId: event.id, target,
                localWriteScope: { ownerPubkeyHex: event.pubkey, expectedRevision: 0, isActive: () => true } })).rejects.toThrow("invalid_repost_target");
            expect((await repo.getByEventId(event.id))?.repostTarget).toBeUndefined();
            const search = new PostHistoryLocalSearchService(repo);
            expect((await search.searchLocalPosts({ pubkeyHex: event.pubkey, query: "target-only-token", page: 1, pageSize: 50 })).total).toBe(0);
            expect((await exportPostHistoryRecords(event.pubkey, [ (await repo.getByEventId(event.id))! ], [], { includeJsonl: true })).jsonl?.trim()).toBe(JSON.stringify(event));
        }
    });
    it.each([42, 1111])("persists %s snapshot across echo, searches target and exports only outer", async (kind) => {
        const { db, repo } = repository(); const target = sign(kind);
        const event = sign(16, "opaque-only-token", [["e", target.id, relay], ["p", target.pubkey], ["k", String(kind)]]);
        await repo.putPostedEvent({ event, repostTarget: { event: target, relayHints: [relay] } });
        await repo.upsertFetchedEvents({ events: [{ event, relayUrls: [relay] }] });
        const record = (await repo.getByEventId(event.id))!;
        expect(record.repostTarget?.rawEvent).toEqual(target);
        expect(record.media).toEqual([]);
        expect(await db.postHistory.count()).toBe(1);
        const search = new PostHistoryLocalSearchService(repo);
        expect((await search.searchLocalPosts({ pubkeyHex: event.pubkey, query: "searchable", page: 1, pageSize: 50 })).items.map(post => post.eventId)).toEqual([event.id]);
        expect((await search.searchLocalPosts({ pubkeyHex: event.pubkey, query: "opaque-only-token", page: 1, pageSize: 50 })).total).toBe(0);
        expect((await exportPostHistoryRecords(event.pubkey, [record], [], { includeJsonl: true })).jsonl?.trim()).toBe(JSON.stringify(event));
    });
    it("enriches channel search through the target projection without channel fields on outer", async () => {
        const { repo } = repository(); const channelId = "b".repeat(64);
        const target = sign(42, "channel body", [["e", channelId, "wss://channel.example.com/", "root"]]);
        const event = sign(16, "", [["e", target.id, relay], ["k", "42"]]);
        await repo.putPostedEvent({ event, repostTarget: { event: target, relayHints: [relay] } });
        const getMany = vi.fn(async () => [{ channelEventId: channelId, name: "enriched room", about: "room topic", picture: null, relays: [], relayHints: [] }]);
        const search = new PostHistoryLocalSearchService(repo, { getMany } as never);
        expect((await search.searchLocalPosts({ pubkeyHex: event.pubkey, query: "enriched room", page: 1, pageSize: 50 })).total).toBe(1);
        expect(getMany).toHaveBeenCalledWith([channelId]);
        expect(repostTargetToPost(target, [relay])).toMatchObject({ channelEventId: channelId, channelRelayHints: ["wss://channel.example.com/"] });
        const record = (await repo.getByEventId(event.id))!;
        expect(record.channelEventId).toBeUndefined(); expect(record.channelRelayHints).toBeUndefined();
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
        await db.meta.put({ key: `postHistoryAuthoredSyncState:${owner}:1,6,42,1111`, updatedAt: 1,
            value: { completedThroughTimestamp: 999, pendingCatchupSinceTimestamp: 900, cooldownUntil: 999999 } });
        const state = new DexiePostHistoryAuthoredSyncStateRepository(db);
        expect(await state.get(owner)).toBeNull();
        await state.save(owner, { completedThroughTimestamp: 200 });
        expect(await db.meta.get(`postHistoryAuthoredSyncState:${owner}:1,6,16,42,1111`)).toBeDefined();
    });
    it.each(["1,42,1111", "1,6,42,1111"])("preserves %s browsing ranges without claiming kind 16 relay coverage", async (oldKey) => {
        const { db } = repository(); const owner = sign().pubkey;
        const visible = new DexiePostHistoryVisibleRangeRepository(db);
        await visible.save({ pubkeyHex: owner, kindsKey: oldKey, visibleUntil: 200 });
        await new DexiePostHistoryImportedRangesRepository(db).record({ ownerPubkeyHex: owner,
            expectedRevision: 0, isActive: () => true, kindsKey: oldKey, range: { since: 1, until: 200 } });
        const coverage = new DexiePostHistoryRelayCoverageRepository(db);
        await coverage.record({ ownerPubkeyHex: owner, expectedRevision: 0, isActive: () => true,
            kindsKey: oldKey, relays: [{ relayUrl: relay, ranges: [{ since: 1, until: 200 }] }] });
        expect(await visible.get(owner, "1,6,16,42,1111")).toMatchObject({ kindsKey: "1,6,16,42,1111", visibleUntil: 200 });
        expect((await new DexiePostHistoryImportedRangesRepository(db).get(owner, "1,6,16,42,1111")).ranges).toEqual([{ since: 1, until: 200 }]);
        expect((await new DexiePostHistoryRelayCoverageRepository(db).get(owner, "1,6,16,42,1111")).relays).toEqual([]);
    });
    it("prefers current visible range, merges valid old imported ranges and rejects stale old ranges", async () => {
        const { db } = repository(); const owner = sign().pubkey;
        const visible = new DexiePostHistoryVisibleRangeRepository(db);
        for (const [key, until] of [["1,42,1111", 100], ["1,6,42,1111", 200], ["1,6,16,42,1111", 300]] as const) {
            await visible.save({ pubkeyHex: owner, kindsKey: key, visibleUntil: until });
        }
        expect((await visible.get(owner, "1,6,16,42,1111"))?.visibleUntil).toBe(300);
        await visible.clear(owner, "1,6,16,42,1111");
        expect((await visible.get(owner, "1,6,16,42,1111"))?.visibleUntil).toBe(200);
        const imported = new DexiePostHistoryImportedRangesRepository(db);
        for (const [key, range] of [["1,42,1111", { since: 1, until: 100 }], ["1,6,42,1111", { since: 101, until: 200 }]] as const) {
            await imported.record({ ownerPubkeyHex: owner, expectedRevision: 0, isActive: () => true, kindsKey: key, range });
        }
        expect((await imported.get(owner, "1,6,16,42,1111")).ranges).toEqual([{ since: 1, until: 200 }]);
        await db.transaction("rw", db.meta, () => advancePostHistoryLocalRevision(db, owner, 300));
        expect((await imported.get(owner, "1,6,16,42,1111")).ranges).toEqual([]);
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
        const createSender = vi.fn(() => ({ sendEvent }));
        const repost = new PostRepostService({ authStateStore: auth, getNip07Signer: () => ({ signEvent }),
            getWriteRelays: () => [relay], getClientTag: () => null, getLocalRevision: async () => 0,
            saveHistory, createSender });
        return { repost, auth, signEvent, sendEvent, createSender, saveHistory };
    }
    function preparation(target: NostrEvent, deletionEvents: NostrEvent[] = [], status: "success" | "timeout" | "error" = "success") {
        const { db, repo } = repository();
        const deletions = new DexiePostHistoryDeletionRequestsRepository(db);
        const fetchEventById = vi.fn(() => ({ promise: Promise.resolve({ event: target, relayUrl: relay }), cancel: vi.fn() }));
        const fetchDeletionRequests = vi.fn(() => ({ promise: Promise.resolve({ status,
            events: deletionEvents.map(event => ({ event, relayUrls: [relay] })), fetchedAt: 200, relayUrls: [relay] }), cancel: vi.fn() }));
        const rx = {} as never;
        const resolver = createPostHistoryRelatedTargetResolver({ getShow: () => true, getRxNostr: () => rx,
            getRelayConfig: () => ({ [relay]: { read: true, write: true } }), postHistoryRepositoryImpl: repo,
            contextFetchService: { fetchEventById }, deletionFetchService: { fetchDeletionRequests },
            deletionRequestsRepositoryImpl: deletions,
            profileSyncCoordinator: { ensureProfile: () => null, subscribe: () => () => undefined, reset() {} } as never });
        const descriptor = { targetEventId: target.id, authorHint: target.pubkey, relationKind: "repost", scopeKey: "send" };
        const prepareTarget: PrepareRepostTarget = (event, relayHints) => resolver.prepareRepostTarget({ ...descriptor, relayHints }, event);
        return { db, repo, deletions, resolver, descriptor, prepareTarget, fetchEventById, fetchDeletionRequests };
    }
    it.each(["Composer", "history", "resolved Repost target"])("blocks %s with a known local valid deletion before signing", async (entry) => {
        const key = generateSecretKey(); const target = createPlainNostrEventSnapshot(finalizeEvent({ kind: 1, content: "target", tags: [], created_at: 100 }, key));
        const deletion = createPlainNostrEventSnapshot(finalizeEvent({ kind: 5, content: "", tags: [["e", target.id], ["k", "1"]], created_at: 200 }, key));
        const setup = preparation(target, [deletion]);
        if (entry === "history") await setup.repo.putPostedEvent({ event: target, relayHints: [relay] });
        if (entry === "resolved Repost target") {
            // Resolve first without a tombstone, then make the relay-only deletion available.
            setup.fetchDeletionRequests.mockReturnValueOnce({ promise: Promise.resolve({ status: "success", events: [], fetchedAt: 100, relayUrls: [relay] }), cancel: vi.fn() });
            await setup.resolver.ensureTarget({ ...setup.descriptor, relayHints: [relay] });
        }
        await setup.deletions.upsertValidDeletionRequests({ targetEvents: [target],
            deletionEvents: [{ event: deletion, relayUrls: [relay] }], fetchedAt: 200 });
        const { repost, signEvent, sendEvent, createSender } = service();
        expect(await repost.repost({ target, relayHints: [relay], rxNostr: {} as never, prepareTarget: setup.prepareTarget })).toMatchObject({ success: false });
        expect(signEvent).not.toHaveBeenCalled(); expect(sendEvent).not.toHaveBeenCalled();
        expect(createSender).not.toHaveBeenCalled();
        expect((await setup.deletions.getDeletedTargets([{ targetAuthorPubkey: target.pubkey, targetEventId: target.id }])).get(target.pubkey)?.has(target.id)).toBe(true);
        expect(setup.fetchEventById).toHaveBeenCalledTimes(entry === "resolved Repost target" ? 1 : 0);
        setup.resolver.reset();
    });
    it.each([true, false])("prepares provenance without fetching deletion requests (hint present: %s)", async (hasHint) => {
        const target = sign(); const setup = preparation(target); const { repost, signEvent, sendEvent } = service();
        expect(await repost.repost({ target, relayHints: hasHint ? [relay] : [], rxNostr: {} as never, prepareTarget: setup.prepareTarget })).toMatchObject({ success: true, historySaved: true });
        expect(signEvent).toHaveBeenCalledTimes(1); expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(setup.fetchEventById).toHaveBeenCalledTimes(hasHint ? 0 : 1);
        expect(setup.fetchDeletionRequests).not.toHaveBeenCalled();
        setup.resolver.reset();
    });
    it.each(["timeout", "error"] as const)("signs and publishes despite an incomplete background deletion lookup (%s)", async (status) => {
        const target = sign(); const setup = preparation(target, [], status); const { repost, signEvent, sendEvent } = service();
        await setup.repo.putPostedEvent({ event: target, relayHints: [relay] });
        await setup.resolver.ensureTarget({ ...setup.descriptor, relayHints: [relay] });
        expect(await repost.repost({ target, relayHints: [relay], rxNostr: {} as never, prepareTarget: setup.prepareTarget })).toMatchObject({ success: true, historySaved: true });
        expect(signEvent).toHaveBeenCalledTimes(1); expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(setup.fetchDeletionRequests).toHaveBeenCalledTimes(1);
        setup.resolver.reset();
    });
    it("ignores deletion requests with an invalid signature, a different author or a different target", async () => {
        const key = generateSecretKey(); const target = createPlainNostrEventSnapshot(finalizeEvent({ kind: 1, content: "target", tags: [], created_at: 100 }, key));
        const deletion = finalizeEvent({ kind: 5, content: "", tags: [["e", target.id]], created_at: 200 }, key);
        const setup = preparation(target, [{ ...deletion, sig: "0".repeat(128) }, sign(5, "", [["e", target.id]]),
            finalizeEvent({ kind: 5, content: "", tags: [["e", sign().id]], created_at: 200 }, key)]);
        await setup.deletions.upsertValidDeletionRequests({ targetEvents: [target], deletionEvents: [
            { event: { ...deletion, sig: "0".repeat(128) } }, { event: sign(5, "", [["e", target.id]]) },
            { event: finalizeEvent({ kind: 5, content: "", tags: [["e", sign().id]], created_at: 200 }, key) },
        ], fetchedAt: 200 });
        const { repost, signEvent, sendEvent } = service();
        expect((await repost.repost({ target, relayHints: [relay], rxNostr: {} as never, prepareTarget: setup.prepareTarget })).success).toBe(true);
        expect(signEvent).toHaveBeenCalledTimes(1); expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(await setup.db.postHistoryDeletionRequests.count()).toBe(0);
        setup.resolver.reset();
    });
    it.each([false, true])("does not wait for a preview deletion check and still respects scope cancellation (%s)", async (cancel) => {
        const target = sign(); const setup = preparation(target);
        await setup.repo.putPostedEvent({ event: target, relayHints: [relay] });
        let finish!: (result: { status: "success" | "cancelled"; events: []; fetchedAt: number; relayUrls: string[] }) => void;
        const promise = new Promise<{ status: "success" | "cancelled"; events: []; fetchedAt: number; relayUrls: string[] }>(resolve => { finish = resolve; });
        setup.fetchDeletionRequests.mockReturnValueOnce({ promise: promise as never,
            cancel: vi.fn(() => finish({ status: "cancelled", events: [], fetchedAt: 0, relayUrls: [relay] })) });
        await setup.resolver.ensureTarget({ ...setup.descriptor, relayHints: [relay] });
        await vi.waitFor(() => expect(setup.fetchDeletionRequests).toHaveBeenCalledTimes(1));
        const { repost, signEvent, sendEvent } = service();
        const prepareTarget = vi.fn((event, hints) => {
            const prepared = setup.prepareTarget(event, hints);
            if (cancel) setup.resolver.invalidateScope(setup.descriptor.scopeKey);
            return prepared;
        });
        const operation = repost.repost({ target, relayHints: [relay], rxNostr: {} as never, prepareTarget });
        expect((await operation).success).toBe(!cancel);
        expect(setup.fetchDeletionRequests).toHaveBeenCalledTimes(1);
        expect(signEvent).toHaveBeenCalledTimes(cancel ? 0 : 1); expect(sendEvent).toHaveBeenCalledTimes(cancel ? 0 : 1);
        finish({ status: "success", events: [], fetchedAt: 0, relayUrls: [relay] });
        setup.resolver.reset();
    });
    it("does not wait for a different author hint's in-flight deletion check", async () => {
        const target = sign(); const setup = preparation(target);
        let finish!: () => void;
        setup.fetchDeletionRequests.mockReturnValueOnce({ promise: new Promise(resolve => {
            finish = () => resolve({ status: "success", events: [], fetchedAt: 0, relayUrls: [relay] });
        }), cancel: vi.fn() });
        const quote = setup.resolver.ensureTarget({ ...setup.descriptor, relationKind: "quote", scopeKey: "quote", authorHint: sign().pubkey });
        await vi.waitFor(() => expect(setup.fetchDeletionRequests).toHaveBeenCalledTimes(1));
        const snapshot = await setup.prepareTarget(target, [relay]);
        expect(snapshot?.status).toBe("resolved");
        expect(setup.fetchDeletionRequests).toHaveBeenCalledTimes(1);
        finish(); await quote;
        setup.resolver.reset();
    });
    it("obtains a missing relay hint without waiting for a preview's pending deletion check", async () => {
        const target = sign(); const setup = preparation(target);
        let finish!: () => void;
        setup.fetchDeletionRequests.mockReturnValueOnce({ promise: new Promise(resolve => {
            finish = () => resolve({ status: "success", events: [], fetchedAt: 0, relayUrls: [relay] });
        }), cancel: vi.fn() });
        const preview = setup.resolver.ensureTarget({ ...setup.descriptor, relationKind: "quote", scopeKey: "preview" });
        await vi.waitFor(() => expect(setup.fetchDeletionRequests).toHaveBeenCalledTimes(1));
        const { repost, signEvent, sendEvent } = service();
        const result = await repost.repost({ target, relayHints: [], rxNostr: {} as never, prepareTarget: setup.prepareTarget });
        expect(result.success).toBe(true);
        expect(signEvent).toHaveBeenCalledTimes(1); expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(setup.fetchEventById).toHaveBeenCalledTimes(1);
        expect(setup.fetchDeletionRequests).toHaveBeenCalledTimes(1);
        finish(); await preview;
        setup.resolver.reset();
    });
    it("shares an existing target fetch for missing provenance without waiting for deletion discovery", async () => {
        const target = sign(); const setup = preparation(target);
        let finish!: () => void;
        setup.fetchEventById.mockReturnValueOnce({ promise: new Promise(resolve => {
            finish = () => resolve({ event: target, relayUrl: relay });
        }), cancel: vi.fn() });
        const preview = setup.resolver.ensureTarget({ ...setup.descriptor, scopeKey: "preview" });
        await vi.waitFor(() => expect(setup.fetchEventById).toHaveBeenCalledTimes(1));
        const { repost, signEvent, sendEvent } = service();
        const prepareTarget = vi.fn(setup.prepareTarget);
        const operation = repost.repost({ target, relayHints: [], rxNostr: {} as never, prepareTarget });
        await vi.waitFor(() => expect(prepareTarget).toHaveBeenCalledTimes(1));
        finish();
        expect((await operation).success).toBe(true);
        expect(signEvent).toHaveBeenCalledTimes(1); expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(setup.fetchEventById).toHaveBeenCalledTimes(1);
        expect(setup.fetchDeletionRequests).not.toHaveBeenCalled();
        await preview;
        setup.resolver.reset();
    });
    it.each([1, 42, 1111])("retries the original kind %s outer/target pair without signing or publishing again", async (kind) => {
        const saved = vi.fn().mockRejectedValueOnce(new Error("quota")).mockResolvedValue(undefined);
        const { repost, signEvent, sendEvent } = service(saved); const target = sign(kind);
        const result = await repost.repost({ target, relayHints: [relay], rxNostr: {} as never, prepareTarget: confirmedTarget });
        expect(result).toMatchObject({ success: true, historySaved: false });
        expect(result.retryInput?.event.content).toBe("");
        expect(result.retryInput?.repostTarget?.event).toEqual(target);
        expect(await repost.retrySave(result.retryInput!)).toBe(true);
        expect(saved.mock.calls[0]?.[0]).toBe(saved.mock.calls[1]?.[0]);
        expect(signEvent).toHaveBeenCalledTimes(1); expect(sendEvent).toHaveBeenCalledTimes(1);
    });
    it.each([1, 42, 1111])("blocks concurrent kind %s execution and stops when the session changes during signing", async (kind) => {
        const { repost, auth, signEvent, sendEvent } = service();
        let finish: (event: NostrEvent) => void = () => undefined;
        signEvent.mockImplementationOnce(() => new Promise((resolve) => { finish = resolve; }));
        const target = sign(kind); const pending = repost.repost({ target, relayHints: [relay], rxNostr: {} as never, prepareTarget: confirmedTarget });
        await vi.waitFor(() => expect(signEvent).toHaveBeenCalledTimes(1));
        expect((await repost.repost({ target, relayHints: [relay], rxNostr: {} as never, prepareTarget: confirmedTarget })).error).toBe("repost_busy");
        auth.value = { ...auth.value, isAuthenticated: false };
        finish(sign()); expect((await pending).success).toBe(false); expect(sendEvent).not.toHaveBeenCalled();
    });
    it("requires a target relay before signing", async () => {
        const { repost, signEvent } = service();
        expect((await repost.repost({ target: sign(), relayHints: [], rxNostr: {} as never, prepareTarget: confirmedTarget })).error).toBe("repost_relay_missing");
        expect(signEvent).not.toHaveBeenCalled();
    });
    it("requires the resolver's send preparation even when a relay hint is already available", async () => {
        const { repost, signEvent, sendEvent } = service();
        expect((await repost.repost({ target: sign(), relayHints: [relay], rxNostr: {} as never,
            prepareTarget: undefined as never })).success).toBe(false);
        expect(signEvent).not.toHaveBeenCalled(); expect(sendEvent).not.toHaveBeenCalled();
    });
    it.each((["nip07", "nip46", "parentClient", "nsec"] as const).flatMap(type => [1, 42, 1111].map(kind => ({ type, kind }))))("supports $type signing target kind $kind without the composer", async ({ type, kind }) => {
        const key = generateSecretKey(); const pubkey = getPublicKey(key);
        const signEvent = vi.fn(async template => createPlainNostrEventSnapshot(finalizeEvent(template, key)));
        const signer = { signEvent };
        const sendEvent = vi.fn(async (event: NostrEvent, _options?: unknown) => ({ success: true, eventId: event.id, acceptedRelays: [relay] }));
        const saveHistory = vi.fn();
        const repost = new PostRepostService({ authStateStore: { value: { type, pubkey, isAuthenticated: true } as AuthState },
            getNip07Signer: () => signer, getNip46Signer: async () => signer, getParentClientSigner: () => signer,
            keyManager: { getFromStore: () => "fixture-key-reference" } as never, seckeySignerFn: () => signer,
            getWriteRelays: () => [relay], getClientTag: () => ["client", "eHagaki"], getLocalRevision: async () => 0,
            saveHistory, createSender: () => ({ sendEvent }) });
        expect(await repost.repost({ target: sign(kind), relayHints: [], rxNostr: {} as never, prepareTarget: (event) => confirmedTarget(event, [relay]) })).toMatchObject({ success: true, historySaved: true });
        expect(signEvent).toHaveBeenCalledTimes(1);
        expect(saveHistory.mock.calls[0]?.[0].event).toMatchObject({ kind: kind === 1 ? 6 : 16, content: "" });
        expect(saveHistory.mock.calls[0]?.[0].event.tags).toContainEqual(["client", "eHagaki"]);
        expect(sendEvent.mock.calls[0]?.[1]).toEqual({ targetRelays: [relay], includeDefaultWriteRelays: false });
    });
    it.each([1, 42, 1111])("rejects a signer that changes the kind %s signed template", async (kind) => {
        const { repost, signEvent, sendEvent } = service();
        signEvent.mockImplementationOnce(async () => sign(6, "unexpected content"));
        expect((await repost.repost({ target: sign(kind), relayHints: [relay], rxNostr: {} as never, prepareTarget: confirmedTarget })).success).toBe(false);
        expect(sendEvent).not.toHaveBeenCalled();
    });
    it("preserves publication outcomes and does not save a failed publish", async () => {
        const { repost, sendEvent, saveHistory } = service();
        sendEvent.mockResolvedValueOnce({ success: false, error: "post_timeout" } as never);
        expect(await repost.repost({ target: sign(), relayHints: [relay], rxNostr: {} as never, prepareTarget: confirmedTarget })).toEqual({ success: false, error: "post_timeout" });
        expect(saveHistory).not.toHaveBeenCalled();
    });
    it("saves a published pair for the captured author even when the session changes during publish", async () => {
        const { repost, auth, sendEvent, saveHistory } = service(); const owner = auth.value.pubkey;
        sendEvent.mockImplementationOnce(async event => {
            auth.value = { ...auth.value, pubkey: sign().pubkey };
            return { success: true, eventId: event.id, acceptedRelays: [relay] };
        });
        expect((await repost.repost({ target: sign(), relayHints: [relay], rxNostr: {} as never, prepareTarget: confirmedTarget })).historySaved).toBe(true);
        expect(saveHistory.mock.calls[0]?.[0]).toMatchObject({ event: { pubkey: owner }, localWriteScope: { ownerPubkeyHex: owner } });
    });
});

describe("single related-target resolver for Reposts", () => {
    it.each(["author", "kind-hint", "outer-kind"])("reads a shared verified snapshot independently of another outer's %s mismatch", async (mismatch) => {
        const target = sign(42); const key = generateSecretKey();
        const good = createPlainNostrEventSnapshot(finalizeEvent({ kind: 16, created_at: 100, content: "",
            tags: [["e", target.id, relay], ["p", target.pubkey], ["k", "42"]] }, key));
        const bad = createPlainNostrEventSnapshot(finalizeEvent({ kind: mismatch === "outer-kind" ? 6 : 16, created_at: 200, content: "",
            tags: [["e", target.id], ["p", mismatch === "author" ? sign().pubkey : target.pubkey],
                ["k", mismatch === "kind-hint" ? "1111" : "42"]] }, key));
        try {
            await postHistoryRepository.putPostedEvent({ event: good, repostTarget: { event: target, relayHints: [relay] } });
            await postHistoryRepository.upsertFetchedEvents({ events: [{ event: bad }] });
            const candidate = await loadStoredRepostTarget({ sourceEventId: bad.id, targetEventId: target.id,
                scopeKey: "shared", relationKind: "repost" });
            expect(candidate && createPlainNostrEventSnapshot(candidate.event)).toEqual(target);
            expect(candidate?.relayHints).toEqual([relay]);
            expect(verifySupportedRepostTarget(candidate?.event, getRepostReference(bad)!)).toBeNull();
            expect(verifySupportedRepostTarget(candidate?.event, getRepostReference(good)!)).not.toBeNull();
            expect((await postHistoryRepository.getByEventId(bad.id))?.repostTarget).toBeUndefined();
        } finally {
            await ehagakiDb.postHistory.bulkDelete([good.id, bad.id]);
        }
    });
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
    it.each([1, 20, 42, 1111])("keeps a valid kind %s quote cache when an outer-specific Repost classification rejects it", async (kind) => {
        const target = sign(kind); const { resolver, fetch, descriptor } = resolverFor(target);
        const quote = { ...descriptor, relationKind: "quote", scopeKey: "quotes" };
        expect((await resolver.ensureTarget(quote))?.event).toEqual(target);
        expect((await resolver.ensureTarget(descriptor))?.event).toEqual(target);
        const ref = getRepostReference({ kind: kind === 1 ? 16 : 6, tags: [["e", target.id]] })!;
        expect(verifySupportedRepostTarget(resolver.getTargetSnapshot(target.id)?.event, ref)).toBeNull();
        expect(verifyRepostTarget(resolver.getTargetSnapshot(target.id)?.event)).not.toBeNull();
        expect((await resolver.ensureTarget(quote))?.status).toBe("resolved");
        expect(fetch).toHaveBeenCalledTimes(1);
        resolver.reset();
    });
});
