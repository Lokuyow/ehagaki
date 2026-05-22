import "fake-indexeddb/auto";
import { afterEach, describe, expect, it } from "vitest";
import { EHagakiDB } from "../../lib/storage/ehagakiDb";
import {
    DexiePostHistoryAuthoredSyncStateRepository,
} from "../../lib/storage/postHistoryAuthoredSyncStateRepository";

const OWNER_PUBKEY = "a".repeat(64);

function createTestDb(): EHagakiDB {
    return new EHagakiDB(`PostHistoryAuthoredSyncState-${Date.now()}-${Math.random()}`);
}

describe("DexiePostHistoryAuthoredSyncStateRepository", () => {
    const dbs: EHagakiDB[] = [];

    afterEach(async () => {
        await Promise.all(dbs.splice(0).map((db) => db.delete()));
    });

    it("keeps completion boundary, observed event time, and pending catchup separately", async () => {
        const db = createTestDb();
        dbs.push(db);
        const repository = new DexiePostHistoryAuthoredSyncStateRepository(db, () => 1_000);

        const state = await repository.save(OWNER_PUBKEY, {
            completedThroughTimestamp: 900,
            latestObservedCreatedAt: 750,
            lastPeriodicSyncAt: 990,
            saturated: true,
            maybeIncomplete: true,
            pendingCatchup: {
                since: 100,
                until: 900,
                targetUpperBoundTimestamp: 900,
                cursorUntil: 700,
                boundaryMaybeIncomplete: false,
            },
        });

        expect(state).toMatchObject({
            ownerPubkeyHex: OWNER_PUBKEY,
            completedThroughTimestamp: 900,
            latestObservedCreatedAt: 750,
            pendingCatchup: {
                targetUpperBoundTimestamp: 900,
                cursorUntil: 700,
            },
            updatedAt: 1_000,
        });

        await repository.saveLatestObservedCreatedAt(OWNER_PUBKEY, 740);
        await repository.saveLatestObservedCreatedAt(OWNER_PUBKEY, 800);

        expect(await repository.get(OWNER_PUBKEY)).toMatchObject({
            completedThroughTimestamp: 900,
            latestObservedCreatedAt: 800,
        });
    });
});
