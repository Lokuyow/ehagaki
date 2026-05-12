import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it } from "vitest";
import { EHAGAKI_DB_NAME, EHagakiDB } from "../../lib/storage/ehagakiDb";
import { DexiePostHistoryRepairCursorRepository } from "../../lib/storage/postHistoryRepairCursorRepository";

const testDbNames = new Set<string>();

function createTestDb(): EHagakiDB {
    const name = `${EHAGAKI_DB_NAME}-post-history-repair-cursor-test-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    testDbNames.add(name);
    return new EHagakiDB(name);
}

afterEach(async () => {
    for (const name of testDbNames) {
        await Dexie.delete(name);
    }
    testDbNames.clear();
});

describe("DexiePostHistoryRepairCursorRepository", () => {
    it("clearForPubkey は指定 pubkey の repair cursor だけを削除する", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryRepairCursorRepository(db, () => 9000);
        const pubkey = "a".repeat(64);
        const otherPubkey = "b".repeat(64);

        await repository.save({
            pubkeyHex: pubkey,
            targetOldestCreatedAt: 1000,
            nextUntil: 900,
        });
        await repository.save({
            pubkeyHex: otherPubkey,
            targetOldestCreatedAt: 2000,
            nextUntil: 1900,
        });

        await repository.clearForPubkey(pubkey);

        await expect(repository.get(pubkey)).resolves.toBeNull();
        await expect(repository.get(otherPubkey)).resolves.toMatchObject({
            pubkeyHex: otherPubkey,
            targetOldestCreatedAt: 2000,
            nextUntil: 1900,
        });

        db.close();
    });
});
