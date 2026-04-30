import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { STORAGE_KEYS } from "../../lib/constants";
import { EHAGAKI_DB_NAME, EHagakiDB } from "../../lib/storage/ehagakiDb";
import {
    DexieHashtagHistoryRepository,
    MAX_HASHTAG_HISTORY,
} from "../../lib/storage/hashtagHistoryRepository";
import { MockStorage } from "../helpers";

const testDbNames = new Set<string>();

function createTestDb(): EHagakiDB {
    const name = `${EHAGAKI_DB_NAME}-hashtag-test-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    testDbNames.add(name);
    return new EHagakiDB(name);
}

describe("hashtagHistory", () => {
    let db: EHagakiDB;
    let storage: MockStorage;
    let nowValue: number;
    let repository: DexieHashtagHistoryRepository;

    beforeEach(() => {
        db = createTestDb();
        storage = new MockStorage();
        nowValue = 1000;
        repository = new DexieHashtagHistoryRepository(
            db,
            () => nowValue,
            () => storage,
        );
    });

    afterEach(async () => {
        vi.useRealTimers();
        db.close();
        for (const name of testDbNames) {
            await Dexie.delete(name);
        }
        testDbNames.clear();
        vi.restoreAllMocks();
    });

    describe("getAll", () => {
        it("IndexedDB が空の場合は空配列を返す", async () => {
            await expect(repository.getAll()).resolves.toEqual([]);
        });

        it("localStorage の旧履歴を IndexedDB に移行して削除する", async () => {
            storage.setItem(
                STORAGE_KEYS.HASHTAG_HISTORY,
                JSON.stringify([{ tag: "nostr", lastUsed: 500 }]),
            );

            await expect(repository.getAll()).resolves.toEqual([
                { tag: "nostr", lastUsed: 500, useCount: 1 },
            ]);
            expect(storage.getItem(STORAGE_KEYS.HASHTAG_HISTORY)).toBeNull();
            await expect(db.hashtagHistory.get("nostr")).resolves.toMatchObject({
                tag: "nostr",
                useCount: 1,
                lastUsed: 500,
            });
        });

        it("旧履歴の不正な JSON は空履歴として移行済みにする", async () => {
            storage.setItem(STORAGE_KEYS.HASHTAG_HISTORY, "invalid-json");

            await expect(repository.getAll()).resolves.toEqual([]);
            expect(storage.getItem(STORAGE_KEYS.HASHTAG_HISTORY)).toBeNull();
        });
    });

    describe("save", () => {
        it("新しいハッシュタグを IndexedDB に保存する", async () => {
            await repository.save(["nostr", "svelte"]);

            const history = await repository.getAll();
            expect(history.map((entry) => entry.tag).sort()).toEqual(["nostr", "svelte"]);
            expect(history.every((entry) => entry.useCount === 1)).toBe(true);
        });

        it("既存エントリは大文字小文字を無視して使用回数と lastUsed を更新する", async () => {
            await repository.save(["Nostr"]);
            nowValue = 2000;

            await repository.save(["nostr"]);

            await expect(repository.getAll()).resolves.toEqual([
                { tag: "Nostr", lastUsed: 2000, useCount: 2 },
            ]);
        });

        it("100件を超えた場合は低使用回数かつ古いエントリを削除する", async () => {
            for (let index = 1; index <= MAX_HASHTAG_HISTORY; index += 1) {
                nowValue = index * 1000;
                await repository.save([`tag${index}`]);
            }

            nowValue = 999999;
            await repository.save(["newtag"]);

            const history = await repository.getAll();
            expect(history).toHaveLength(MAX_HASHTAG_HISTORY);
            expect(history.map((entry) => entry.tag)).toContain("newtag");
            expect(history.map((entry) => entry.tag)).not.toContain("tag1");
        });

        it("空配列を渡しても何も変化しない", async () => {
            await repository.save([]);
            await expect(repository.getAll()).resolves.toEqual([]);
        });

        it("100文字を超えるハッシュタグは保存しない", async () => {
            await repository.save(["a".repeat(101)]);
            await expect(repository.getAll()).resolves.toEqual([]);
        });

        it("100文字以下のハッシュタグは保存する", async () => {
            await repository.save(["a".repeat(100)]);
            await expect(repository.getAll()).resolves.toHaveLength(1);
        });
    });

    describe("getSuggestions", () => {
        beforeEach(async () => {
            await repository.save(["apple"]);
            await repository.save(["amazon"]);
            await repository.save(["mastodon"]);
            await repository.save(["TypeScript"]);
            nowValue = 2000;
            await repository.save(["amazon"]);
            await repository.save(["apple"]);
            await repository.save(["apple"]);
        });

        it("履歴が空の場合は空配列を返す", async () => {
            const emptyDb = createTestDb();
            const emptyRepository = new DexieHashtagHistoryRepository(
                emptyDb,
                () => nowValue,
                () => new MockStorage(),
            );

            await expect(emptyRepository.getSuggestions("")).resolves.toEqual([]);
            emptyDb.close();
        });

        it("クエリが空の場合は使用回数順で返す", async () => {
            await expect(repository.getSuggestions("")).resolves.toEqual([
                "apple",
                "amazon",
                "mastodon",
                "TypeScript",
            ]);
        });

        it("文字一致と使用回数で複合的に並べる", async () => {
            await expect(repository.getSuggestions("a")).resolves.toEqual([
                "apple",
                "amazon",
                "mastodon",
            ]);
        });

        it("完全一致を使用回数より優先する", async () => {
            nowValue = 3000;
            await repository.save(["apple"]);
            await repository.save(["apple"]);

            await expect(repository.getSuggestions("amazon")).resolves.toEqual(["amazon"]);
        });

        it("大文字小文字を無視して比較する", async () => {
            await expect(repository.getSuggestions("type")).resolves.toContain("TypeScript");
        });

        it("一致しない場合は空配列を返す", async () => {
            await expect(repository.getSuggestions("zzz")).resolves.toEqual([]);
        });

        it("サジェストは最大5件まで返す", async () => {
            for (let index = 1; index <= 6; index += 1) {
                await repository.save([`extra${index}`]);
            }

            await expect(repository.getSuggestions("extra")).resolves.toHaveLength(5);
        });
    });
});
