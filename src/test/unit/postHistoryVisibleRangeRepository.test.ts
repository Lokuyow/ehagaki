import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it } from "vitest";
import { EHAGAKI_DB_NAME, EHagakiDB } from "../../lib/storage/ehagakiDb";
import {
    DexiePostHistoryVisibleRangeRepository,
    buildPostHistoryVisibleKindsKey,
} from "../../lib/storage/postHistoryVisibleRangeRepository";

const testDbNames = new Set<string>();

function createTestDb(): EHagakiDB {
    const name = `${EHAGAKI_DB_NAME}-post-history-visible-range-test-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    testDbNames.add(name);
    return new EHagakiDB(name);
}

afterEach(async () => {
    for (const name of testDbNames) {
        await Dexie.delete(name);
    }
    testDbNames.clear();
});

describe("DexiePostHistoryVisibleRangeRepository", () => {
    it("meta store に visibleUntil を保存して取得できる", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryVisibleRangeRepository(db, () => 9000);
        const kindsKey = buildPostHistoryVisibleKindsKey([42, 1, 1]);

        const saved = await repository.save({
            pubkeyHex: "a".repeat(64),
            kindsKey,
            visibleUntil: 1000,
        });

        await expect(repository.get("a".repeat(64), kindsKey)).resolves.toEqual(saved);

        db.close();
    });

    it("clear 後は visible range を返さない", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryVisibleRangeRepository(db, () => 9001);
        const kindsKey = buildPostHistoryVisibleKindsKey([1, 42]);

        await repository.save({
            pubkeyHex: "a".repeat(64),
            kindsKey,
            visibleUntil: 800,
        });
        await repository.clear("a".repeat(64), kindsKey);

        await expect(repository.get("a".repeat(64), kindsKey)).resolves.toBeNull();

        db.close();
    });

    it("clearForPubkey は指定 pubkey の visible range だけを削除する", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryVisibleRangeRepository(db, () => 9002);
        const kindsKey = buildPostHistoryVisibleKindsKey([1, 42]);
        const pubkey = "a".repeat(64);
        const otherPubkey = "b".repeat(64);

        await repository.save({
            pubkeyHex: pubkey,
            kindsKey,
            visibleUntil: 800,
        });
        await repository.save({
            pubkeyHex: otherPubkey,
            kindsKey,
            visibleUntil: 900,
        });

        await repository.clearForPubkey(pubkey);

        await expect(repository.get(pubkey, kindsKey)).resolves.toBeNull();
        await expect(repository.get(otherPubkey, kindsKey)).resolves.toMatchObject({
            pubkeyHex: otherPubkey,
            visibleUntil: 900,
        });

        db.close();
    });
});
