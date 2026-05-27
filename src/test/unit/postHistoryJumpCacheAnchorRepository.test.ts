import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it } from "vitest";
import { EHAGAKI_DB_NAME, EHagakiDB } from "../../lib/storage/ehagakiDb";
import {
    DexiePostHistoryJumpCacheAnchorRepository,
} from "../../lib/storage/postHistoryJumpCacheAnchorRepository";

const testDbNames = new Set<string>();

function createTestDb(): EHagakiDB {
    const name = `${EHAGAKI_DB_NAME}-post-history-jump-cache-anchor-test-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    testDbNames.add(name);
    return new EHagakiDB(name);
}

afterEach(async () => {
    for (const name of testDbNames) {
        await Dexie.delete(name);
    }
    testDbNames.clear();
});

describe("DexiePostHistoryJumpCacheAnchorRepository", () => {
    it("anchor を追加して近接判定できる", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryJumpCacheAnchorRepository(
            db,
            () => 1_000,
        );
        const pubkeyHex = "a".repeat(64);

        await repository.addForPubkey({
            pubkeyHex,
            centerCreatedAt: 1_700_000_000,
            radiusSec: 3 * 24 * 60 * 60,
        });

        await expect(repository.hasNearbyAnchorForPubkey({
            pubkeyHex,
            targetCreatedAt: 1_700_100_000,
        })).resolves.toBe(true);
        await expect(repository.hasNearbyAnchorForPubkey({
            pubkeyHex,
            targetCreatedAt: 1_701_000_000,
        })).resolves.toBe(false);

        db.close();
    });

    it("近接anchor追加時は統合し、frontier接続で削除とfrontier前進を返す", async () => {
        const db = createTestDb();
        let nowMs = 10_000;
        const repository = new DexiePostHistoryJumpCacheAnchorRepository(
            db,
            () => nowMs,
        );
        const pubkeyHex = "a".repeat(64);

        await repository.addForPubkey({
            pubkeyHex,
            centerCreatedAt: 1_000,
            radiusSec: 100,
            fetchedAt: nowMs,
        });
        nowMs += 100;
        const merged = await repository.addForPubkey({
            pubkeyHex,
            centerCreatedAt: 1_050,
            radiusSec: 120,
            fetchedAt: nowMs,
        });

        expect(merged).toHaveLength(1);
        expect(merged[0]).toMatchObject({
            centerCreatedAt: 1_050,
            radiusSec: 120,
        });

        const reconciled = await repository.reconcileWithFrontier({
            pubkeyHex,
            frontierVisibleUntil: 1_130,
            toleranceSec: 10,
        });

        expect(reconciled.nextVisibleUntil).toBe(930);
        expect(reconciled.removedCount).toBe(1);
        expect(reconciled.anchors).toEqual([]);

        db.close();
    });

    it("TTL切れanchorを除外し、clearForPubkeyで削除できる", async () => {
        const db = createTestDb();
        let nowMs = 10_000;
        const repository = new DexiePostHistoryJumpCacheAnchorRepository(
            db,
            () => nowMs,
        );
        const pubkeyHex = "a".repeat(64);

        await repository.addForPubkey({
            pubkeyHex,
            centerCreatedAt: 100,
            radiusSec: 10,
            fetchedAt: nowMs,
            ttlMs: 50,
        });
        nowMs += 100;

        await expect(repository.getForPubkey(pubkeyHex, { ttlMs: 50 })).resolves.toEqual([]);

        await repository.addForPubkey({
            pubkeyHex,
            centerCreatedAt: 200,
            radiusSec: 10,
            fetchedAt: nowMs,
        });
        await repository.clearForPubkey(pubkeyHex);

        await expect(repository.getForPubkey(pubkeyHex)).resolves.toEqual([]);

        db.close();
    });
});
