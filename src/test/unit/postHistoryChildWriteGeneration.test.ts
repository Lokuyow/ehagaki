import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it, vi } from "vitest";

import { EHagakiDB } from "../../lib/storage/ehagakiDb";
import { resetEhagakiDbOpenGateForTests } from "../../lib/storage/ehagakiDbOpenGate";
import {
    advancePostHistoryChildWriteGeneration,
    getPostHistoryChildWriteGeneration,
    POST_HISTORY_CHILD_WRITE_GENERATION_ID,
} from "../../lib/storage/postHistoryLocalWriteScope";
import { clearPostHistoryDisplayForPubkey } from "../../lib/storage/postHistoryPersistenceCoordinator";
import { DexiePostHistoryChildInteractionsRepository } from "../../lib/storage/postHistoryChildInteractionsRepository";
import type { NostrEvent } from "../../lib/types";

const names = new Set<string>();

afterEach(async () => {
    resetEhagakiDbOpenGateForTests();
    vi.restoreAllMocks();
    for (const name of names) await Dexie.delete(name);
    names.clear();
});

function databaseName(): string {
    const name = `child-generation-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    names.add(name);
    return name;
}

function childEvent(id: string, parentEventId: string): NostrEvent {
    return {
        id,
        pubkey: "b".repeat(64),
        kind: 1,
        content: "reply",
        created_at: 100,
        tags: [["e", parentEventId, "", "reply"], ["p", "a".repeat(64)]],
        sig: "c".repeat(128),
    };
}

describe("post history child write generation", () => {
    it("reads the stored generation without waiting for an unrelated transaction", async () => {
        const name = databaseName();
        const db = new EHagakiDB(name);
        await db.open();
        await db.postHistoryChildWriteGeneration.put({
            id: POST_HISTORY_CHILD_WRITE_GENERATION_ID,
            value: 4,
            updatedAt: 1,
        });
        let release: () => void = () => undefined;
        const hold = new Promise<void>((resolve) => {
            release = resolve;
        });
        const unrelated = db.transaction("rw", db.drafts, async () => {
            await hold;
        });
        await expect(getPostHistoryChildWriteGeneration(db)).resolves.toBe(4);
        release();
        await unrelated;
        db.close();
    });

    it("does not open a closed database just to read the initial generation", async () => {
        const db = new EHagakiDB(databaseName());
        await expect(getPostHistoryChildWriteGeneration(db)).resolves.toBe(0);
        expect(db.isOpen()).toBe(false);
    });

    it("rejects a write captured before another connection clears history", async () => {
        const name = databaseName();
        const tabA = new EHagakiDB(name);
        const tabB = new EHagakiDB(name);
        await tabA.open();
        await tabB.open();
        const expected = await getPostHistoryChildWriteGeneration(tabA);
        await clearPostHistoryDisplayForPubkey(tabB, "a".repeat(64), () => 20);
        const repository = new DexiePostHistoryChildInteractionsRepository(tabA);
        const parentEventId = "d".repeat(64);
        const result = await repository.upsertChildInteractions({
            parentEventId,
            events: [{ event: childEvent("e".repeat(64), parentEventId) }],
            expectedChildGeneration: expected,
        });
        expect(result.insertedCount).toBe(0);
        await expect(tabA.postHistoryChildInteractions.count()).resolves.toBe(0);
        await expect(getPostHistoryChildWriteGeneration(tabA)).resolves.toBe(expected + 1);
        tabA.close();
        tabB.close();
    });

    it("advances from the stored generation instead of an older cached value", async () => {
        const name = databaseName();
        const tabA = new EHagakiDB(name);
        const tabB = new EHagakiDB(name);
        await tabA.open();
        await tabB.open();
        await getPostHistoryChildWriteGeneration(tabA);
        await tabB.postHistoryChildWriteGeneration.put({
            id: POST_HISTORY_CHILD_WRITE_GENERATION_ID,
            value: 5,
            updatedAt: 1,
        });
        await advancePostHistoryChildWriteGeneration(tabA, 30);
        await expect(getPostHistoryChildWriteGeneration(tabB)).resolves.toBe(6);
        tabA.close();
        tabB.close();
    });

    it("does not keep a generation increment when the clear transaction aborts", async () => {
        const name = databaseName();
        const db = new EHagakiDB(name);
        await db.open();
        await expect(db.transaction("rw", db.postHistoryChildWriteGeneration, async () => {
            await advancePostHistoryChildWriteGeneration(db, 40);
            throw new Error("abort generation");
        })).rejects.toThrow("abort generation");
        await expect(getPostHistoryChildWriteGeneration(db)).resolves.toBe(0);
        db.close();
    });

    it("invalidates child writes when history is cleared without a saved parent post", async () => {
        const name = databaseName();
        const db = new EHagakiDB(name);
        await db.open();
        const expected = await getPostHistoryChildWriteGeneration(db);
        expect(await db.postHistory.count()).toBe(0);
        await clearPostHistoryDisplayForPubkey(db, "a".repeat(64), () => 50);
        const repository = new DexiePostHistoryChildInteractionsRepository(db);
        const parentEventId = "f".repeat(64);
        const result = await repository.upsertChildInteractions({
            parentEventId,
            events: [{ event: childEvent("1".repeat(64), parentEventId) }],
            expectedChildGeneration: expected,
        });
        expect(result.insertedCount).toBe(0);
        await expect(getPostHistoryChildWriteGeneration(db)).resolves.toBe(1);
        db.close();
    });
});
