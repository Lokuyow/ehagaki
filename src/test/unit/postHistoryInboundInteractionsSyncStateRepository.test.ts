import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it } from "vitest";
import { EHAGAKI_DB_NAME, EHagakiDB } from "../../lib/storage/ehagakiDb";
import { DexiePostHistoryInboundInteractionsSyncStateRepository } from "../../lib/storage/postHistoryInboundInteractionsSyncStateRepository";

const testDbNames = new Set<string>();

function createTestDb(): EHagakiDB {
    const name = `${EHAGAKI_DB_NAME}-inbound-sync-state-test-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    testDbNames.add(name);
    return new EHagakiDB(name);
}

afterEach(async () => {
    for (const name of testDbNames) {
        await Dexie.delete(name);
    }
    testDbNames.clear();
});

describe("DexiePostHistoryInboundInteractionsSyncStateRepository", () => {
    it("meta storeにowner別sync stateを保存し、undefined patchでは既存値を消さない", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryInboundInteractionsSyncStateRepository(db, () => 1000);
        const ownerPubkeyHex = "a".repeat(64);

        await repository.save(ownerPubkeyHex, {
            lastSyncedAt: 900,
            lastSeenCreatedAt: 800,
            lastDialogRefreshAt: 700,
            saturated: true,
            maybeIncomplete: true,
        });
        await repository.save(ownerPubkeyHex, {
            lastSyncedAt: 1000,
            saturated: false,
        });

        await expect(repository.get(ownerPubkeyHex)).resolves.toMatchObject({
            ownerPubkeyHex,
            lastSyncedAt: 1000,
            lastSeenCreatedAt: 800,
            lastDialogRefreshAt: 700,
            saturated: false,
            maybeIncomplete: true,
            updatedAt: 1000,
        });

        db.close();
    });
});
