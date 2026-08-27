import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EHAGAKI_DB_NAME, EHagakiDB } from "../../lib/storage/ehagakiDb";
import { DexiePostHistoryReactionDeletionStateRepository } from "../../lib/storage/postHistoryReactionDeletionStateRepository";

const testDbNames = new Set<string>();

function createRepository() {
    const name = `${EHAGAKI_DB_NAME}-reaction-state-${Date.now()}-${Math.random()}`;
    testDbNames.add(name);
    const db = new EHagakiDB(name);
    return {
        db,
        repository: new DexiePostHistoryReactionDeletionStateRepository(db, () => 1000),
    };
}

afterEach(async () => {
    for (const name of testDbNames) {
        await Dexie.delete(name);
    }
    testDbNames.clear();
});

describe("DexiePostHistoryReactionDeletionStateRepository", () => {
    it("複数 parent の deletion state を prefix query 一回で取得する", async () => {
        const { db, repository } = createRepository();
        const firstParentEventId = "1".repeat(64);
        const secondParentEventId = "2".repeat(64);
        const firstReactionEventId = "3".repeat(64);
        const secondReactionEventId = "4".repeat(64);
        await repository.saveMany([
            {
                requestKey: `${firstParentEventId}:${firstReactionEventId}`,
                parentEventId: firstParentEventId,
                reactionEventId: firstReactionEventId,
            },
            {
                requestKey: `${secondParentEventId}:${secondReactionEventId}`,
                parentEventId: secondParentEventId,
                reactionEventId: secondReactionEventId,
            },
        ]);

        const whereSpy = vi.spyOn(db.meta, "where");
        await expect(repository.getForParentEventIds([
            firstParentEventId,
            secondParentEventId,
            firstParentEventId,
        ])).resolves.toMatchObject([
            {
                parentEventId: firstParentEventId,
                reactionEventId: firstReactionEventId,
            },
            {
                parentEventId: secondParentEventId,
                reactionEventId: secondReactionEventId,
            },
        ]);
        expect(whereSpy).toHaveBeenCalledTimes(1);

        db.close();
    });
});
