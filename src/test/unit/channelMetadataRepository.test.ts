import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it } from "vitest";
import { EHAGAKI_DB_NAME, EHagakiDB } from "../../lib/storage/ehagakiDb";
import {
    CHANNEL_METADATA_RETRY_INTERVAL_MS,
    CHANNEL_METADATA_TTL_MS,
    DexieChannelMetadataRepository,
} from "../../lib/storage/channelMetadataRepository";

const testDbNames = new Set<string>();

function createTestDb(): EHagakiDB {
    const name = `${EHAGAKI_DB_NAME}-channel-metadata-test-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    testDbNames.add(name);
    return new EHagakiDB(name);
}

afterEach(async () => {
    for (const name of testDbNames) {
        await Dexie.delete(name);
    }
    testDbNames.clear();
});

describe("DexieChannelMetadataRepository", () => {
    it("channel metadata を保存して複数取得できる", async () => {
        const db = createTestDb();
        const repository = new DexieChannelMetadataRepository(db, () => 1000);

        await repository.upsertResolvedChannel({
            channelEventId: "channel-1",
            name: "General",
            about: "Public chat",
            picture: "https://example.com/channel.png",
            relays: ["wss://channel-write.example.com"],
            relayHints: ["wss://hint.example.com"],
            creatorPubkey: "a".repeat(64),
            createEventCreatedAt: 100,
            metadataEventId: "m".repeat(64),
            metadataCreatedAt: 200,
        });
        await repository.upsertResolvedChannel({
            channelEventId: "channel-2",
            name: "Random",
            about: null,
            picture: null,
            relays: ["wss://random.example.com"],
            relayHints: ["wss://random-hint.example.com"],
            creatorPubkey: "b".repeat(64),
            createEventCreatedAt: 300,
        });

        await expect(repository.get("channel-1")).resolves.toEqual({
            channelEventId: "channel-1",
            name: "General",
            about: "Public chat",
            picture: "https://example.com/channel.png",
            relays: ["wss://channel-write.example.com/"],
            relayHints: ["wss://hint.example.com/"],
            creatorPubkey: "a".repeat(64),
            createEventCreatedAt: 100,
            metadataEventId: "m".repeat(64),
            metadataCreatedAt: 200,
            fetchedAt: 1000,
            lastFetchFailedAt: undefined,
        });
        await expect(repository.getMany(["channel-1", "channel-2"]))
            .resolves.toEqual([
                {
                    channelEventId: "channel-1",
                    name: "General",
                    about: "Public chat",
                    picture: "https://example.com/channel.png",
                    relays: ["wss://channel-write.example.com/"],
                    relayHints: ["wss://hint.example.com/"],
                    creatorPubkey: "a".repeat(64),
                    createEventCreatedAt: 100,
                    metadataEventId: "m".repeat(64),
                    metadataCreatedAt: 200,
                    fetchedAt: 1000,
                    lastFetchFailedAt: undefined,
                },
                {
                    channelEventId: "channel-2",
                    name: "Random",
                    about: null,
                    picture: null,
                    relays: ["wss://random.example.com/"],
                    relayHints: ["wss://random-hint.example.com/"],
                    creatorPubkey: "b".repeat(64),
                    createEventCreatedAt: 300,
                    metadataEventId: undefined,
                    metadataCreatedAt: undefined,
                    fetchedAt: 1000,
                    lastFetchFailedAt: undefined,
                },
            ]);

        db.close();
    });

    it("TTL 内は refresh 不要で TTL 超過後は refresh 対象になる", async () => {
        const db = createTestDb();
        const repository = new DexieChannelMetadataRepository(db, () => 1000);
        const record = await repository.upsertResolvedChannel({
            channelEventId: "channel-1",
            name: "General",
            about: null,
            picture: null,
            relays: [],
            relayHints: [],
            creatorPubkey: "a".repeat(64),
            createEventCreatedAt: 100,
        });

        expect(repository.shouldRefresh(record, 1000 + CHANNEL_METADATA_TTL_MS - 1)).toBe(false);
        expect(repository.shouldRefresh(record, 1000 + CHANNEL_METADATA_TTL_MS)).toBe(true);

        db.close();
    });

    it("取得失敗を記録して短時間 retry を抑制する", async () => {
        const db = createTestDb();
        const repository = new DexieChannelMetadataRepository(db, () => 1000);

        await repository.markFetchFailed("channel-1", 5000, ["wss://hint.example.com"]);

        const record = await repository.get("channel-1");
        expect(record).toEqual({
            channelEventId: "channel-1",
            name: null,
            about: null,
            picture: null,
            relays: [],
            relayHints: ["wss://hint.example.com/"],
            creatorPubkey: undefined,
            createEventCreatedAt: undefined,
            metadataEventId: undefined,
            metadataCreatedAt: undefined,
            fetchedAt: undefined,
            lastFetchFailedAt: 5000,
        });
        expect(repository.shouldRefresh(record, 5000 + CHANNEL_METADATA_RETRY_INTERVAL_MS - 1)).toBe(false);
        expect(repository.shouldRefresh(record, 5000 + CHANNEL_METADATA_RETRY_INTERVAL_MS)).toBe(true);

        db.close();
    });

    it("古い kind:41 由来 metadata では channel name を巻き戻さない", async () => {
        const db = createTestDb();
        let currentNow = 1000;
        const repository = new DexieChannelMetadataRepository(db, () => currentNow);

        await repository.upsertResolvedChannel({
            channelEventId: "channel-1",
            name: "Newest",
            about: "new",
            picture: null,
            relays: ["wss://newer.example.com"],
            relayHints: ["wss://newer-hint.example.com"],
            creatorPubkey: "a".repeat(64),
            createEventCreatedAt: 100,
            metadataEventId: "newer-metadata-id",
            metadataCreatedAt: 200,
        });

        currentNow = 2000;
        const result = await repository.upsertResolvedChannel({
            channelEventId: "channel-1",
            name: "Older",
            about: "old",
            picture: null,
            relays: ["wss://older.example.com"],
            relayHints: ["wss://older-hint.example.com"],
            creatorPubkey: "a".repeat(64),
            createEventCreatedAt: 100,
            metadataEventId: "older-metadata-id",
            metadataCreatedAt: 150,
        });

        expect(result).toEqual({
            channelEventId: "channel-1",
            name: "Newest",
            about: "new",
            picture: null,
            relays: ["wss://newer.example.com/"],
            relayHints: ["wss://older-hint.example.com/"],
            creatorPubkey: "a".repeat(64),
            createEventCreatedAt: 100,
            metadataEventId: "newer-metadata-id",
            metadataCreatedAt: 200,
            fetchedAt: 2000,
            lastFetchFailedAt: undefined,
        });

        db.close();
    });
});