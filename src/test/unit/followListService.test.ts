import "fake-indexeddb/auto";
import { finalizeEvent, generateSecretKey, getPublicKey } from "nostr-tools";
import type { EventPacket, RxNostr, RxReq } from "rx-nostr";
import { Observable } from "rxjs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createFollowListSession } from "../../lib/followListService";
import type { RelayQueryPolicy } from "../../lib/relay/query";
import { EHagakiDB } from "../../lib/storage/ehagakiDb";
import type { NostrEvent } from "../../lib/types";

const { transport, getProfiles, getCachedProfiles, getReactiveEntry } = vi.hoisted(() => ({
    transport: vi.fn(),
    getProfiles: vi.fn().mockResolvedValue({}),
    getCachedProfiles: vi.fn().mockResolvedValue({}),
    getReactiveEntry: vi.fn(),
}));
vi.mock("../../lib/relay/query", () => ({ useRelayQuery: transport }));
vi.mock("../../lib/profileMetadataCache.svelte", () => ({
    profileMetadataCache: { getCachedProfiles, getProfiles, getReactiveEntry },
}));
vi.mock("../../lib/storage/profilesRepository", () => ({
    profilesRepository: { bulkGetRecords: vi.fn().mockResolvedValue([]) },
}));

const runtime = { getDefaultRelays: () => ({}) } as unknown as RxNostr;
const alice = "a".repeat(64);
const bob = "b".repeat(64);
const databases: EHagakiDB[] = [];
const transports: AbortController[] = [];

function session(owner: string, db: EHagakiDB) {
    const abort = new AbortController();
    transports.push(abort);
    return { abort, service: createFollowListSession(runtime, owner, abort.signal, db) };
}

function createDatabase() {
    const db = new EHagakiDB(`follow-list-${crypto.randomUUID()}`);
    databases.push(db);
    return db;
}

function serve(events: NostrEvent[], complete = true) {
    transport.mockImplementation((_runtime: unknown, request: RxReq, _options: unknown, policy: RelayQueryPolicy<EventPacket>) =>
        new Observable<EventPacket>(subscriber => request.getReqPacketObservable().subscribe(() => {
            for (const event of events) subscriber.next({ event } as EventPacket);
            policy.onEnd?.({ reason: complete ? "complete" : "timeout", complete, eoseRelays: [] });
            subscriber.complete();
        })));
}

afterEach(async () => {
    for (const controller of transports.splice(0)) controller.abort();
    for (const db of databases.splice(0)) await db.delete();
    vi.clearAllMocks();
});

describe("follow list", () => {
    it("picks the latest valid kind 3, searches three local metadata fields, and skips a repeat automatic fetch", async () => {
        const key = generateSecretKey();
        const owner = getPublicKey(key);
        const follow = (created_at: number, pubkey: string, signer = key) =>
            finalizeEvent({ kind: 3, created_at, tags: [["p", pubkey]], content: "" }, signer);
        const latest = follow(3, alice);
        const tied = follow(3, bob);
        const expected = latest.id < tied.id ? latest : tied;
        const expectedContact = expected.tags[0]![1];
        serve([follow(1, bob), tied, follow(4, bob, generateSecretKey()),
            { ...follow(5, bob), sig: "0".repeat(128) }, latest]);
        getReactiveEntry.mockImplementation(pubkey => pubkey === expectedContact
            ? { profile: { name: "alice", displayName: "アリス Example", nip05: "alice@example.com" } } : null);
        const db = createDatabase();
        const { service } = session(owner, db);
        await expect(service.refresh(false)).resolves.toBe("updated");
        await expect(db.followLists.get(owner)).resolves.toMatchObject({ event: { id: expected.id } });
        const calls = transport.mock.calls.length;
        for (const query of ["alice", "アリス EXAMPLE", "alice@example.com"]) {
            expect(service.getSuggestions(query)).toMatchObject([{ pubkey: expectedContact, label: "アリス Example" }]);
        }
        expect(service.getSuggestions("someone else")).toEqual([]);
        expect(service.getSuggestions("")).toEqual([]);
        expect(service.getSuggestions(" \u3000")).toEqual([]);
        const restored = session(owner, db).service;
        await expect(restored.refresh(false)).resolves.toBe("updated");
        expect(transport).toHaveBeenCalledTimes(calls);

        const emptyList = finalizeEvent({ kind: 3, created_at: 6, tags: [], content: "" }, key);
        serve([emptyList]);
        await expect(restored.refresh(true)).resolves.toBe("updated");
        expect(restored.getSuggestions("")).toEqual([]);
        await expect(db.followLists.get(owner)).resolves.toMatchObject({ event: { id: emptyList.id, tags: [] } });
    });

    it("retries a failed first fetch, persists confirmed absence and isolates account records", async () => {
        const db = createDatabase();
        serve([], false);
        const first = session(alice, db).service;
        await expect(first.refresh(false)).resolves.toBe("unavailable");
        await expect(db.followLists.get(alice)).resolves.toBeUndefined();
        serve([]);
        await expect(first.refresh(false)).resolves.toBe("not-found");
        await expect(db.followLists.get(alice)).resolves.toEqual({ ownerPubkey: alice, event: null });
        await expect(db.followLists.get(bob)).resolves.toBeUndefined();
        await expect(session(alice, db).service.refresh(false)).resolves.toBe("not-found");
        expect(transport).toHaveBeenCalledTimes(2);
    });
});
