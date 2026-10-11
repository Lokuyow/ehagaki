import "fake-indexeddb/auto";
import Dexie from "dexie";
import { finalizeEvent, generateSecretKey } from "nostr-tools";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createPlainNostrEventSnapshot, isPostHistoryRawEventConsistent } from "../../lib/postHistoryEventUtils";
import { EHagakiDB, type PostHistoryChildInteractionRecord, type PostHistoryRecord } from "../../lib/storage/ehagakiDb";
import { DexiePostHistoryChildInteractionsRepository } from "../../lib/storage/postHistoryChildInteractionsRepository";
import type { NostrEvent } from "../../lib/types";

const oldParent = "1".repeat(64), newParent = "2".repeat(64);
const databases: EHagakiDB[] = [];
const sign = (kind: number, tags: string[][] = []): NostrEvent =>
    finalizeEvent({ kind, tags, content: "+", created_at: 100 }, generateSecretKey());

function setup() {
    const db = new EHagakiDB(`saved-reaction-repair-${crypto.randomUUID()}`);
    databases.push(db);
    return { db, repository: new DexiePostHistoryChildInteractionsRepository(db, () => 1000) };
}

function record(event: NostrEvent, parentEventId = oldParent): PostHistoryChildInteractionRecord {
    return { id: event.id, eventId: event.id, parentEventId, authorPubkey: event.pubkey, kind: event.kind,
        content: event.content, tags: event.tags.map(tag => [...tag]), createdAt: event.created_at,
        relayUrls: ["wss://provenance.example/"], discoveredAs: ["reaction"], rawEvent: createPlainNostrEventSnapshot(event),
        fetchedAt: 123, updatedAt: 456, schemaVersion: 1 };
}

function post(event: NostrEvent): PostHistoryRecord {
    return { id: event.id, eventId: event.id, pubkeyHex: event.pubkey, kind: event.kind,
        content: event.content, tags: event.tags, createdAt: event.created_at, postedAt: 100_000,
        relayHints: [], acceptedRelays: [], media: [], rawEvent: createPlainNostrEventSnapshot(event), updatedAt: 456, schemaVersion: 2 };
}

afterEach(async () => {
    vi.restoreAllMocks();
    for (const db of databases) { db.close(); await Dexie.delete(db.name); }
    databases.length = 0;
});

describe("saved Reaction NIP-25 repair", () => {
    it("repairs every cached reaction before reading the new parent, preserves provenance and leaves no old copy", async () => {
        const { db, repository } = setup();
        const event = sign(7, [["e", oldParent, "", "reply"], ["e", newParent]]);
        const original = record(event);
        await db.postHistoryChildInteractions.put(original);
        const where = vi.spyOn(db.postHistoryChildInteractions, "where");
        const fullTableRead = vi.spyOn(db.postHistoryChildInteractions, "toArray");
        expect(await repository.getChildInteractionsForParents([newParent])).toEqual([
            { ...original, parentEventId: newParent, updatedAt: 1000 },
        ]);
        expect(where).toHaveBeenCalledWith("kind");
        expect(fullTableRead).not.toHaveBeenCalled();
        expect(await repository.getReactionInteractions(oldParent)).toEqual([]);
        expect(await db.postHistoryChildInteractions.count()).toBe(1);
        const reloaded = new DexiePostHistoryChildInteractionsRepository(db, () => 2000);
        expect(await reloaded.getReactionInteractions(newParent)).toEqual([
            { ...original, parentEventId: newParent, updatedAt: 1000 },
        ]);
    });

    it("shares the initial repair between reads and upserts", async () => {
        const { db, repository } = setup();
        const event = sign(7, [["e", oldParent, "", "reply"], ["e", newParent]]);
        await db.postHistoryChildInteractions.put(record(event));
        const where = vi.spyOn(db.postHistoryChildInteractions, "where");
        const [old, current] = await Promise.all([
            repository.getReactionInteractions(oldParent), repository.getReactionInteractions(newParent),
            repository.upsertChildInteractions({ parentEventId: newParent, events: [{ event }], fetchedAt: null }),
        ]);
        expect(old).toEqual([]);
        expect(current).toHaveLength(1);
        expect(where.mock.calls.filter(([index]) => String(index) === "kind")).toHaveLength(1);
        expect(await db.postHistoryChildInteractions.count()).toBe(1);
    });

    it("deletes a structurally matching raw event with a tampered signature instead of reparenting it", async () => {
        const { db, repository } = setup();
        const event = sign(7, [["e", oldParent, "", "reply"], ["e", newParent]]);
        event.sig = "0".repeat(128);
        const saved = record(event);
        expect(isPostHistoryRawEventConsistent(saved.rawEvent, { ...saved, pubkeyHex: saved.authorPubkey })).toBe(true);
        await db.postHistoryChildInteractions.put(saved);
        expect(await repository.getReactionInteractions(newParent)).toEqual([]);
        expect(await repository.getReactionInteractions(oldParent)).toEqual([]);
        expect(await db.postHistoryChildInteractions.get(event.id)).toBeUndefined();
    });

    it.each(["hash", "structure", "missing-raw", "invalid-reference", "unsupported-reference"])("removes %s failures without touching other kinds", async failure => {
        const { db, repository } = setup();
        const tags = failure === "invalid-reference" ? [["e", newParent], ["e", "invalid"]]
            : failure === "unsupported-reference" ? [["a", "30023:x:y"]] : [["e", newParent]];
        const event = sign(7, tags);
        if (failure === "hash") event.id = "0".repeat(64);
        const saved = record(event);
        if (failure === "structure") saved.content = "different";
        if (failure === "missing-raw") saved.rawEvent = null;
        const reply = record(sign(1, [["e", newParent, "", "reply"]]));
        const main = post(sign(1));
        await db.postHistoryChildInteractions.bulkPut([saved, reply]);
        await db.postHistory.put(main);
        expect(await repository.getReactionInteractions(newParent)).toEqual([]);
        expect(await db.postHistoryChildInteractions.get(saved.id)).toBeUndefined();
        expect(await db.postHistoryChildInteractions.get(reply.id)).toEqual(reply);
        expect(await db.postHistory.get(main.id)).toEqual(main);
    });

    it.each(["author", "kind"])("removes a fully signed reference contradicting a known target's %s", async mismatch => {
        const { db, repository } = setup();
        const target = sign(1);
        const event = sign(7, [["e", oldParent, "", "reply"], ["e", target.id, "",
            mismatch === "author" ? "a".repeat(64) : target.pubkey], ["k", mismatch === "kind" ? "42" : "1"]]);
        await db.postHistory.put(post(target));
        await db.postHistoryChildInteractions.put(record(event));
        expect(await repository.getReactionInteractions(target.id)).toEqual([]);
        expect(await db.postHistoryChildInteractions.get(event.id)).toBeUndefined();
    });

    it("rolls back removal and reassignment together and retries after a failed repair", async () => {
        const { db, repository } = setup();
        const valid = record(sign(7, [["e", oldParent, "", "reply"], ["e", newParent]]));
        const invalid = record(sign(7));
        await db.postHistoryChildInteractions.bulkPut([valid, invalid]);
        vi.spyOn(db.postHistoryChildInteractions, "bulkPut").mockRejectedValueOnce(new Error("repair write failed"));
        await expect(repository.getReactionInteractions(newParent)).rejects.toThrow("repair write failed");
        expect(await db.postHistoryChildInteractions.bulkGet([valid.id, invalid.id])).toEqual([valid, invalid]);
        expect(await repository.getReactionInteractions(newParent)).toEqual([
            { ...valid, parentEventId: newParent, updatedAt: 1000 },
        ]);
        expect(await db.postHistoryChildInteractions.get(invalid.id)).toBeUndefined();
    });

    it("removes a contradictory cached reaction when a related target becomes known after initial repair", async () => {
        const { db, repository } = setup();
        const event = sign(7, [["e", newParent], ["k", "1"]]);
        await db.postHistoryChildInteractions.put(record(event));
        expect(await repository.getReactionInteractions(newParent)).toHaveLength(1);
        expect(await repository.getChildInteractionsForParents([newParent], [
            { eventId: newParent, targetKind: 42 },
        ])).toEqual([]);
        expect(await db.postHistoryChildInteractions.get(event.id)).toBeUndefined();
    });
});
