import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it } from "vitest";
import { EHAGAKI_DB_NAME, EHagakiDB } from "../../lib/storage/ehagakiDb";
import { DexiePostHistoryDirectReplyDeletionStateRepository } from "../../lib/storage/postHistoryDirectReplyDeletionStateRepository";

const testDbNames = new Set<string>();

function createRepository() {
    const name = `${EHAGAKI_DB_NAME}-direct-reply-state-${Date.now()}-${Math.random()}`;
    testDbNames.add(name);
    const db = new EHagakiDB(name);
    return {
        db,
        repository: new DexiePostHistoryDirectReplyDeletionStateRepository(db, () => 1000),
    };
}

afterEach(async () => {
    for (const name of testDbNames) {
        await Dexie.delete(name);
    }
    testDbNames.clear();
});

describe("DexiePostHistoryDirectReplyDeletionStateRepository", () => {
    it("request keyのkindをstateへ保存し、kind不一致inputを拒否する", async () => {
        const { db, repository } = createRepository();
        const parentEventId = "1".repeat(64);
        const replyEventId = "2".repeat(64);
        const requestKey = `${parentEventId}:${replyEventId}:42`;

        await expect(repository.saveMany([{
            requestKey,
            parentEventId,
            replyEventId,
            kind: 42,
        }])).resolves.toMatchObject([{ requestKey, kind: 42 }]);

        await expect(repository.saveMany([{
            requestKey,
            parentEventId,
            replyEventId,
            kind: 1,
        }])).resolves.toEqual([]);
        await expect(repository.getMany([requestKey])).resolves.toMatchObject([{
            requestKey,
            kind: 42,
        }]);

        db.close();
    });

    it("既存kind1 keyはkind省略inputでもkind1として維持する", async () => {
        const { db, repository } = createRepository();
        const parentEventId = "3".repeat(64);
        const replyEventId = "4".repeat(64);
        const requestKey = `${parentEventId}:${replyEventId}:1`;

        await expect(repository.saveMany([{
            requestKey,
            parentEventId,
            replyEventId,
        }])).resolves.toMatchObject([{ requestKey, kind: 1 }]);

        db.close();
    });
});
