import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EHAGAKI_DB_NAME, EHagakiDB } from "../../lib/storage/ehagakiDb";
import {
    DexiePostHistoryDirectReplyFetchMetadataRepository,
} from "../../lib/storage/postHistoryDirectReplyFetchMetadataRepository";

const testDbNames = new Set<string>();

function createTestDb(): EHagakiDB {
    const name = EHAGAKI_DB_NAME
        + "-direct-reply-fetch-meta-"
        + Date.now()
        + "-"
        + Math.random();
    testDbNames.add(name);
    return new EHagakiDB(name);
}

afterEach(async () => {
    for (const name of testDbNames) {
        await Dexie.delete(name);
    }
    testDbNames.clear();
});

describe("DexiePostHistoryDirectReplyFetchMetadataRepository", () => {
    it("partial状態をrepository再生成後も復元する", async () => {
        const db = createTestDb();
        const parentEventId = "1".repeat(64);
        const repository = new DexiePostHistoryDirectReplyFetchMetadataRepository(
            db,
            () => 3000,
        );

        await repository.save({
            parentEventId,
            completeness: "partial",
            fetchedAt: 2000,
            requestStartedAt: 1000,
        });

        const recreated = new DexiePostHistoryDirectReplyFetchMetadataRepository(db);
        await expect(recreated.get(parentEventId)).resolves.toMatchObject({
            parentEventId,
            completeness: "partial",
            fetchedAt: 2000,
            requestStartedAt: 1000,
            updatedAt: 3000,
        });
        db.close();
    });

    it("partial後の新しいsuccessでcompleteへ戻す", async () => {
        const db = createTestDb();
        const parentEventId = "2".repeat(64);
        const repository = new DexiePostHistoryDirectReplyFetchMetadataRepository(db);

        await repository.save({
            parentEventId,
            completeness: "partial",
            fetchedAt: 2000,
            requestStartedAt: 1000,
        });
        await repository.save({
            parentEventId,
            completeness: "complete",
            fetchedAt: 3000,
            requestStartedAt: 2000,
        });

        await expect(repository.get(parentEventId)).resolves.toMatchObject({
            completeness: "complete",
            fetchedAt: 3000,
            requestStartedAt: 2000,
        });
        db.close();
    });

    it("新しいcompleteを古いpartialで上書きしない", async () => {
        const db = createTestDb();
        const parentEventId = "3".repeat(64);
        const repository = new DexiePostHistoryDirectReplyFetchMetadataRepository(db);

        await repository.save({
            parentEventId,
            completeness: "complete",
            fetchedAt: 4000,
            requestStartedAt: 3000,
        });
        await repository.save({
            parentEventId,
            completeness: "partial",
            fetchedAt: 5000,
            requestStartedAt: 2000,
        });

        await expect(repository.get(parentEventId)).resolves.toMatchObject({
            completeness: "complete",
            fetchedAt: 4000,
            requestStartedAt: 3000,
        });
        db.close();
    });

    it("開始時刻が同じ場合もcompleteをpartialより優先する", async () => {
        const db = createTestDb();
        const parentEventId = "4".repeat(64);
        const repository = new DexiePostHistoryDirectReplyFetchMetadataRepository(db);

        await repository.save({
            parentEventId,
            completeness: "complete",
            fetchedAt: 4000,
            requestStartedAt: 3000,
        });
        await repository.save({
            parentEventId,
            completeness: "partial",
            fetchedAt: 5000,
            requestStartedAt: 3000,
        });

        await expect(repository.get(parentEventId)).resolves.toMatchObject({
            completeness: "complete",
            fetchedAt: 4000,
        });
        db.close();
    });

    it("複数 parent の metadata を bulkGet 一回で読み、無効な値を除外する", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryDirectReplyFetchMetadataRepository(db);
        const firstParentEventId = "5".repeat(64);
        const secondParentEventId = "6".repeat(64);
        const missingParentEventId = "7".repeat(64);
        await repository.save({
            parentEventId: firstParentEventId,
            completeness: "complete",
            fetchedAt: 1000,
            requestStartedAt: 900,
        });
        await repository.save({
            parentEventId: secondParentEventId,
            completeness: "partial",
            fetchedAt: 1100,
            requestStartedAt: 1000,
        });

        const bulkGetSpy = vi.spyOn(db.meta, "bulkGet");
        await expect(repository.getForParentEventIds([
            firstParentEventId,
            secondParentEventId,
            missingParentEventId,
            firstParentEventId,
        ])).resolves.toMatchObject([
            { parentEventId: firstParentEventId, completeness: "complete" },
            { parentEventId: secondParentEventId, completeness: "partial" },
        ]);
        expect(bulkGetSpy).toHaveBeenCalledTimes(1);

        db.close();
    });
});
