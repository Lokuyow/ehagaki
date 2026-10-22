import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it, vi } from "vitest";
import { finalizeEvent, generateSecretKey, getPublicKey } from "nostr-tools";
import { DexiePostHistoryDeletionRequestsRepository } from "../../lib/storage/postHistoryDeletionRequestsRepository";
import { DexiePostHistoryRepository } from "../../lib/storage/postHistoryRepository";
import { DexieSensitivePayloadRepository } from "../../lib/storage/sensitivePayloadRepository";
import { reconcileSensitivePayloadDeletionForCandidate } from "../../lib/storage/sensitivePayloadDeletionReconciler";
import { EHAGAKI_DB_NAME, EHagakiDB } from "../../lib/storage/ehagakiDb";
import type { NostrEvent } from "../../lib/types";

const dbNames = new Set<string>();

function createDb(): EHagakiDB {
    const db = new EHagakiDB(`${EHAGAKI_DB_NAME}-sensitive-payload-${Date.now()}-${Math.random()}`);
    dbNames.add(db.name);
    return db;
}

afterEach(async () => {
    for (const name of dbNames) await Dexie.delete(name);
    dbNames.clear();
});

describe("DexieSensitivePayloadRepository", () => {
    it("imported ordinary deletions never scan the author's history when no payload exists", async () => {
        const db = createDb();
        const key = generateSecretKey();
        const events = Array.from({ length: 100 }, (_, index) => finalizeEvent({
            kind: 1, content: `ordinary-${index}`, tags: [], created_at: 10 + index,
        }, key));
        const posts = new DexiePostHistoryRepository(db);
        await posts.upsertFetchedEvents({ events: events.map(event => ({ event })) });
        const deletions = events.slice(0, 20).map(event => finalizeEvent({
            kind: 5, content: "", tags: [["e", event.id], ["k", "1"]], created_at: 200,
        }, key));
        const where = vi.spyOn(db.postHistory, "where");
        const payloadGet = vi.spyOn(db.sensitivePayloads, "get");
        try {
            const result = await new DexiePostHistoryDeletionRequestsRepository(db).upsertImportedDeletionEvents({
                ownerPubkeyHex: events[0]!.pubkey, deletionEvents: deletions.map(event => ({ event })),
            });
            expect(result).toMatchObject({ insertedCount: 20, appliedDeletionCount: 20 });
            expect(where.mock.calls.filter(([index]) => typeof index === "string" && index === "pubkeyHex").length).toBe(0);
            for (const event of events.slice(0, 20)) expect(payloadGet).toHaveBeenCalledWith(event.id);
            await expect(db.sensitivePayloads.count()).resolves.toBe(0);
            const records = await db.postHistory.bulkGet(events.map(event => event.id));
            expect(records.filter(record => record?.deletedAt === 200_000)).toHaveLength(20);
        } finally { where.mockRestore(); payloadGet.mockRestore(); db.close(); }
    });
    it("atomically unions concurrent publish/fetch metadata across database connections", async () => {
        const db = createDb();
        const secondDb = new EHagakiDB(db.name);
        await Promise.all([db.open(), secondDb.open()]);
        const first = new DexieSensitivePayloadRepository(db, () => 1000);
        const second = new DexieSensitivePayloadRepository(secondDb, () => 2000);
        const payload = finalizeEvent({ kind: 36, content: "fixture", tags: [["k", "1"]], created_at: 10 }, generateSecretKey());
        await first.putCandidate({ event: payload, relayHints: ["wss://hint.example/"] });
        await Promise.all([
            first.putCandidate({ event: payload, acceptedRelays: ["wss://author.example/"] }),
            second.putCandidate({ event: payload, acceptedRelays: ["wss://recipient.example/"], fetchedRelays: ["wss://fetch.example/"] }),
        ]);
        const [record] = await first.getByIds([payload.id]);
        expect(new Set(record!.acceptedRelays)).toEqual(new Set(["wss://author.example/", "wss://recipient.example/"]));
        expect(record!.fetchedRelays).toEqual(["wss://fetch.example/"]);
        expect(new Set(record!.relayHints)).toEqual(new Set(["wss://hint.example/", "wss://author.example/", "wss://recipient.example/", "wss://fetch.example/"]));
        expect(record).toMatchObject({ createdAt: 1000, schemaVersion: 1, rawEvent: payload });
        await first.markDeleted({ id: payload.id, pubkeyHex: payload.pubkey, deletionEventId: "d".repeat(64), deletedAt: 3000 });
        await second.putCandidate({ event: payload, acceptedRelays: ["wss://late.example/"] });
        expect((await first.getByIds([payload.id]))[0]).toMatchObject({ deletedAt: 3000, acceptedRelays: record!.acceptedRelays });
        secondDb.close(); db.close();
    });
    it.each([
        ['payload', 'structure', 'deletion'], ['payload', 'deletion', 'structure'],
        ['deletion', 'structure', 'payload'], ['deletion', 'payload', 'structure'],
        ['structure', 'payload', 'deletion'], ['structure', 'deletion', 'payload'],
    ] as const)("reconciles payload-only deletion across %s → %s → %s without deleting its Structure", async (...order) => {
        const db = createDb();
        await db.open();
        const secretKey = generateSecretKey();
        const payload = finalizeEvent({ kind: 36, content: 'body', created_at: 10, tags: [['k', '1']] }, secretKey) as NostrEvent;
        const structure = finalizeEvent({ kind: 1, content: '', created_at: 11, tags: [['content-warning'], ['c', payload.id]] }, secretKey) as NostrEvent;
        const deletion = finalizeEvent({ kind: 5, content: '', created_at: 20, tags: [['e', payload.id], ['k', '36']] }, secretKey) as NostrEvent;
        const posts = new DexiePostHistoryRepository(db);
        const payloads = new DexieSensitivePayloadRepository(db);
        const deletions = new DexiePostHistoryDeletionRequestsRepository(db);
        const putPayload = () => payloads.putCandidate({ event: payload });
        const putStructure = async () => {
            const get = vi.spyOn(db.postHistory, "get");
            try {
                await posts.upsertFetchedEvents({ events: [{ event: structure, relayUrls: [] }] });
                expect(get).toHaveBeenCalledWith(structure.id);
            } finally { get.mockRestore(); }
        };
        const putDeletion = () => deletions.upsertImportedDeletionEvents({ ownerPubkeyHex: structure.pubkey, deletionEvents: [{ event: deletion }] });
        const where = vi.spyOn(db.postHistory, "where");
        const save = { payload: putPayload, structure: putStructure, deletion: putDeletion };
        try {
            for (const step of order) {
                where.mockClear();
                await save[step]();
                const scans = where.mock.calls.filter(([index]) => typeof index === "string" && index === "pubkeyHex").length;
                if (step === 'deletion') expect(scans).toBe(order.indexOf('payload') < order.indexOf('deletion') ? 1 : 0);
                if (step === 'payload') expect(scans).toBe(order.indexOf('deletion') < order.indexOf('payload') ? 1 : 0);
            }
            expect((await payloads.getByIds([payload.id]))[0]?.deletedAt).toBe(20_000);
            expect((await posts.getByEventId(structure.id))?.deletedAt).toBeUndefined();
            where.mockClear();
            await reconcileSensitivePayloadDeletionForCandidate(payload.id, db);
            expect(where.mock.calls.filter(([index]) => String(index) === "pubkeyHex")).toHaveLength(0);
        } finally { where.mockRestore(); }
        await putPayload();
        expect((await payloads.getByIds([payload.id]))[0]?.deletedAt).toBe(20_000);
        db.close();
    });
    it("keeps kind 36 as an auxiliary candidate, not a timeline post", async () => {
        const db = createDb();
        await db.open();
        const repository = new DexieSensitivePayloadRepository(db, () => 1000);
        const secretKey = generateSecretKey();
        const payload = finalizeEvent({
            kind: 36,
            content: "body",
            created_at: 10,
            tags: [["k", "1"]],
        }, secretKey) as NostrEvent;

        await repository.putCandidate({ event: payload, acceptedRelays: ["wss://relay.example.com/"] });

        await expect(db.postHistory.count()).resolves.toBe(0);
        await expect(repository.getByIds([payload.id])).resolves.toMatchObject([
            { id: payload.id, rawEvent: { content: "body" }, acceptedRelays: ["wss://relay.example.com/"] },
        ]);
        db.close();
    });

    it("does not apply an imported payload deletion until a valid Structure pair arrives", async () => {
        const db = createDb();
        await db.open();
        const secretKey = generateSecretKey();
        const pubkey = getPublicKey(secretKey);
        const payload = finalizeEvent({
            kind: 36,
            content: "body",
            created_at: 10,
            tags: [["k", "1"]],
        }, secretKey) as NostrEvent;
        const structure = finalizeEvent({
            kind: 1,
            content: "",
            created_at: 10,
            tags: [["content-warning", "reason"], ["c", payload.id]],
        }, secretKey) as NostrEvent;
        const deletion = finalizeEvent({
            kind: 5,
            content: "",
            created_at: 20,
            tags: [["e", structure.id], ["e", payload.id], ["k", "1"], ["k", "36"]],
        }, secretKey) as NostrEvent;
        const posts = new DexiePostHistoryRepository(db, () => 1000);
        const payloads = new DexieSensitivePayloadRepository(db, () => 1000);
        const deletions = new DexiePostHistoryDeletionRequestsRepository(db, () => 1000);

        await deletions.upsertImportedDeletionEvents({ ownerPubkeyHex: pubkey, deletionEvents: [{ event: deletion }] });
        await payloads.putCandidate({ event: payload });
        const candidate = await payloads.getByIds([payload.id]);
        expect(candidate[0]?.deletedAt).toBeUndefined();

        await posts.upsertFetchedEvents({ events: [{ event: structure, relayUrls: [] }] });

        await expect(payloads.getByIds([payload.id])).resolves.toMatchObject([
            { id: payload.id, deletedAt: 20_000, deletionEventId: deletion.id },
        ]);
        await expect(db.postHistory.get(structure.id)).resolves.toMatchObject({ deletedAt: 20_000 });
        db.close();
    });

    it("does not associate a candidate whose k tag disagrees with the Structure kind", async () => {
        const db = createDb();
        await db.open();
        const secretKey = generateSecretKey();
        const payload = finalizeEvent({
            kind: 36,
            content: "body",
            created_at: 10,
            tags: [["k", "42"]],
        }, secretKey) as NostrEvent;
        const structure = finalizeEvent({
            kind: 1,
            content: "",
            created_at: 10,
            tags: [["content-warning"], ["c", payload.id]],
        }, secretKey) as NostrEvent;
        const deletion = finalizeEvent({
            kind: 5,
            content: "",
            created_at: 20,
            tags: [["e", structure.id], ["e", payload.id], ["k", "1"], ["k", "36"]],
        }, secretKey) as NostrEvent;
        const posts = new DexiePostHistoryRepository(db, () => 1000);
        const payloads = new DexieSensitivePayloadRepository(db, () => 1000);
        const deletions = new DexiePostHistoryDeletionRequestsRepository(db, () => 1000);

        await deletions.upsertImportedDeletionEvents({
            ownerPubkeyHex: getPublicKey(secretKey),
            deletionEvents: [{ event: deletion }],
        });
        await payloads.putCandidate({ event: payload });
        await posts.upsertFetchedEvents({ events: [{ event: structure, relayUrls: [] }] });

        const cached = await payloads.getByIds([payload.id]);
        expect(cached[0]?.deletedAt).toBeUndefined();
        db.close();
    });
});
