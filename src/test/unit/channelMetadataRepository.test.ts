import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it } from "vitest";
import { EHAGAKI_DB_NAME, EHagakiDB } from "../../lib/storage/ehagakiDb";
import {
    CHANNEL_METADATA_RETRY_INTERVAL_MS,
    CHANNEL_METADATA_TTL_MS,
    DexieChannelMetadataRepository,
    type UpsertResolvedChannelInput,
} from "../../lib/storage/channelMetadataRepository";

const testDbNames = new Set<string>();

function createTestDb(): EHagakiDB {
    const name = `${EHAGAKI_DB_NAME}-channel-metadata-test-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    testDbNames.add(name);
    return new EHagakiDB(name);
}

function metadataInput(
    overrides: Partial<Extract<UpsertResolvedChannelInput, { quality: "verified-metadata" }>> = {},
): Extract<UpsertResolvedChannelInput, { quality: "verified-metadata" }> {
    return {
        channelEventId: "channel-1",
        quality: "verified-metadata",
        metadataLookup: "complete",
        name: "General",
        about: "Public chat",
        picture: null,
        relays: ["wss://channel-write.example.com"],
        verifiedSourceRelays: ["wss://source.example.com"],
        creatorPubkey: "a".repeat(64),
        createEventCreatedAt: 100,
        metadataEventId: "m".repeat(64),
        metadataCreatedAt: 200,
        ...overrides,
    };
}

afterEach(async () => {
    for (const name of testDbNames) await Dexie.delete(name);
    testDbNames.clear();
});

describe("DexieChannelMetadataRepository", () => {
    it("検証済み metadata と品質・試行時刻を保存する", async () => {
        const db = createTestDb();
        const repository = new DexieChannelMetadataRepository(db, () => 1000);
        const record = await repository.upsertResolvedChannel(metadataInput());

        expect(record).toEqual({
            channelEventId: "channel-1",
            name: "General",
            about: "Public chat",
            picture: null,
            relays: ["wss://channel-write.example.com/"],
            relayHints: ["wss://source.example.com/"],
            creatorPubkey: "a".repeat(64),
            createEventCreatedAt: 100,
            metadataEventId: "m".repeat(64),
            metadataCreatedAt: 200,
            resolutionQuality: "verified-metadata",
            verifiedRootAt: 1000,
            verifiedMetadataAt: 1000,
            lastResolutionAttemptAt: 1000,
            lastResolutionAttemptStatus: "complete",
            fetchedAt: undefined,
            lastFetchFailedAt: undefined,
        });
        await expect(repository.getMany(["channel-1", "channel-1"]))
            .resolves.toEqual([record]);
        db.close();
    });

    it("有効な空フィールドも verified metadata として24時間TTLを持つ", async () => {
        const db = createTestDb();
        const repository = new DexieChannelMetadataRepository(db, () => 1000);
        const record = await repository.upsertResolvedChannel(metadataInput({
            name: null,
            about: null,
            picture: null,
            relays: [],
            metadataEventId: undefined,
            metadataCreatedAt: undefined,
        }));

        expect(record.resolutionQuality).toBe("verified-metadata");
        expect(repository.shouldRefresh(record, 1000 + CHANNEL_METADATA_TTL_MS - 1)).toBe(false);
        expect(repository.shouldRefresh(record, 1000 + CHANNEL_METADATA_TTL_MS)).toBe(true);
        db.close();
    });

    it("失敗を記録して既存の検証済み値と検証時刻を維持する", async () => {
        const db = createTestDb();
        let now = 1000;
        const repository = new DexieChannelMetadataRepository(db, () => now);
        await repository.upsertResolvedChannel(metadataInput());

        now = 5000;
        await repository.markFetchFailed("channel-1");
        const record = await repository.get("channel-1");

        expect(record).toMatchObject({
            name: "General",
            relays: ["wss://channel-write.example.com/"],
            relayHints: ["wss://source.example.com/"],
            resolutionQuality: "verified-metadata",
            verifiedMetadataAt: 1000,
            lastResolutionAttemptAt: 5000,
            lastResolutionAttemptStatus: "failed",
        });
        expect(repository.shouldRefresh(record, 5000 + CHANNEL_METADATA_RETRY_INTERVAL_MS - 1)).toBe(false);
        expect(repository.shouldRefresh(record, 5000 + CHANNEL_METADATA_RETRY_INTERVAL_MS)).toBe(true);
        db.close();
    });

    it("verified metadata をroot-onlyまたは不完全な古い結果で降格しない", async () => {
        const db = createTestDb();
        let now = 1000;
        const repository = new DexieChannelMetadataRepository(db, () => now);
        await repository.upsertResolvedChannel(metadataInput({
            name: "Newest",
            relays: ["wss://newer.example.com"],
            metadataEventId: "d".repeat(64),
        }));

        now = 2000;
        const rootOnly = await repository.upsertResolvedChannel({
            channelEventId: "channel-1",
            quality: "verified-root-only",
            metadataLookup: "incomplete",
            verifiedSourceRelays: ["wss://new-root-source.example.com"],
            creatorPubkey: "a".repeat(64),
            createEventCreatedAt: 100,
        });
        expect(rootOnly).toMatchObject({
            name: "Newest",
            relays: ["wss://newer.example.com/"],
            resolutionQuality: "verified-metadata",
            verifiedMetadataAt: 1000,
            lastResolutionAttemptStatus: "incomplete",
        });

        now = 3000;
        const older = await repository.upsertResolvedChannel(metadataInput({
            name: "Older",
            relays: ["wss://older.example.com"],
            metadataLookup: "incomplete",
            metadataEventId: "c".repeat(64),
            metadataCreatedAt: 150,
        }));
        expect(older).toMatchObject({
            name: "Newest",
            relays: ["wss://newer.example.com/"],
            metadataEventId: "d".repeat(64),
            metadataCreatedAt: 200,
            verifiedMetadataAt: 1000,
            lastResolutionAttemptStatus: "incomplete",
        });
        db.close();
    });

    it("新しいkind 41だけを適用し、同時刻は辞書順で小さいIDを採用する", async () => {
        const db = createTestDb();
        let now = 1000;
        const repository = new DexieChannelMetadataRepository(db, () => now);
        await repository.upsertResolvedChannel(metadataInput({
            name: "Initial",
            metadataEventId: "d".repeat(64),
        }));

        now = 2000;
        const tieWinner = await repository.upsertResolvedChannel(metadataInput({
            name: "Tie winner",
            metadataEventId: "c".repeat(64),
        }));
        expect(tieWinner.name).toBe("Tie winner");
        expect(tieWinner.metadataEventId).toBe("c".repeat(64));

        now = 2500;
        const sameEvent = await repository.upsertResolvedChannel(metadataInput({
            name: "Tie winner",
            metadataEventId: "c".repeat(64),
        }));
        expect(sameEvent.name).toBe("Tie winner");
        expect(sameEvent.verifiedMetadataAt).toBe(2500);

        now = 3000;
        const tieLoser = await repository.upsertResolvedChannel(metadataInput({
            name: "Tie loser",
            metadataEventId: "e".repeat(64),
        }));
        expect(tieLoser.name).toBe("Tie winner");
        expect(tieLoser.verifiedMetadataAt).toBe(2500);

        now = 4000;
        const newer = await repository.upsertResolvedChannel(metadataInput({
            name: "Newer",
            metadataEventId: "f".repeat(64),
            metadataCreatedAt: 300,
        }));
        expect(newer.name).toBe("Newer");
        expect(newer.verifiedMetadataAt).toBe(4000);
        db.close();
    });

    it("並行保存でも古いkind 41で新しいmetadataを巻き戻さない", async () => {
        const db = createTestDb();
        let now = 1000;
        const repository = new DexieChannelMetadataRepository(db, () => now);
        await repository.upsertResolvedChannel(metadataInput({
            name: "Initial",
            metadataCreatedAt: 100,
        }));

        now = 2000;
        await Promise.all([
            repository.upsertResolvedChannel(metadataInput({
                name: "Newest concurrent",
                metadataEventId: "n".repeat(64),
                metadataCreatedAt: 300,
            })),
            repository.upsertResolvedChannel(metadataInput({
                name: "Older concurrent",
                metadataEventId: "o".repeat(64),
                metadataCreatedAt: 150,
            })),
        ]);

        await expect(repository.get("channel-1")).resolves.toMatchObject({
            name: "Newest concurrent",
            metadataEventId: "n".repeat(64),
            metadataCreatedAt: 300,
        });
        db.close();
    });
    it("root-onlyからmetadataへ昇格する", async () => {
        const db = createTestDb();
        let now = 1000;
        const repository = new DexieChannelMetadataRepository(db, () => now);
        const rootOnly = await repository.upsertResolvedChannel({
            channelEventId: "channel-1",
            quality: "verified-root-only",
            metadataLookup: "complete",
            verifiedSourceRelays: ["wss://root.example.com"],
            creatorPubkey: "a".repeat(64),
            createEventCreatedAt: 100,
        });
        expect(rootOnly.resolutionQuality).toBe("verified-root-only");
        expect(repository.shouldRefresh(rootOnly, 1000 + CHANNEL_METADATA_RETRY_INTERVAL_MS - 1)).toBe(false);

        now = 2000;
        const promoted = await repository.upsertResolvedChannel(metadataInput());
        expect(promoted.resolutionQuality).toBe("verified-metadata");
        expect(promoted.name).toBe("General");
        db.close();
    });

    it("v1をstale seedとして読み、root-onlyでは昇格せずmetadataで昇格する", async () => {
        const db = createTestDb();
        await db.channelMetadata.put({
            channelEventId: "channel-1",
            name: "Legacy",
            about: null,
            picture: null,
            relays: ["wss://legacy-write.example.com/"],
            relayHints: ["wss://legacy-hint.example.com/"],
            fetchedAt: 900,
            updatedAt: 900,
            schemaVersion: 1,
        });
        let now = 1000;
        const repository = new DexieChannelMetadataRepository(db, () => now);
        const legacy = await repository.get("channel-1");
        expect(legacy?.resolutionQuality).toBe("legacy-seed");
        expect(repository.shouldRefresh(legacy, now)).toBe(true);

        const rootOnly = await repository.upsertResolvedChannel({
            channelEventId: "channel-1",
            quality: "verified-root-only",
            metadataLookup: "complete",
            verifiedSourceRelays: ["wss://verified-source.example.com"],
            creatorPubkey: "a".repeat(64),
            createEventCreatedAt: 100,
        });
        expect(rootOnly).toMatchObject({
            name: "Legacy",
            resolutionQuality: "legacy-seed",
        });

        now = 2000;
        const promoted = await repository.upsertResolvedChannel(metadataInput());
        expect(promoted).toMatchObject({
            name: "General",
            resolutionQuality: "verified-metadata",
            relayHints: ["wss://source.example.com/"],
        });
        expect(promoted.relayHints).not.toContain("wss://legacy-hint.example.com/");
        db.close();
    });
});
