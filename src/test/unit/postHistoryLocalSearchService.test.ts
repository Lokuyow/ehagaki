import { beforeEach, describe, expect, it, vi } from "vitest";
import {
    bumpChannelMetadataSearchRevision,
    bumpPostHistorySearchRevision,
    resetPostHistoryLocalSearchRevisionsForTesting,
} from "../../lib/postHistoryLocalSearchRevision";
import { createPostHistorySearchRecord } from "../../lib/postHistorySearchIndex";
import type { ChannelMetadataCache } from "../../lib/storage/channelMetadataRepository";
import type { PostHistoryRecord } from "../../lib/storage/ehagakiDb";
import { PostHistoryLocalSearchService } from "../../lib/postHistoryLocalSearchService";

const PUBKEY = "a".repeat(64);

function createRecord(overrides: Partial<PostHistoryRecord> = {}): PostHistoryRecord {
    const eventId = overrides.eventId ?? "event-1";
    return {
        eventId,
        pubkeyHex: PUBKEY,
        kind: 1,
        content: "hello world",
        tags: [],
        createdAt: 100,
        postedAt: 200,
        relayHints: ["wss://hint.example.com/"],
        acceptedRelays: ["wss://accepted.example.com/"],
        media: [],
        rawEvent: {},
        updatedAt: 300,
        schemaVersion: 2,
        ...overrides,
        id: eventId,
    };
}

function createChannelMetadata(overrides: Partial<ChannelMetadataCache> = {}): ChannelMetadataCache {
    return {
        channelEventId: "channel-1",
        name: "General",
        about: "Public room",
        picture: null,
        relays: [],
        relayHints: [],
        ...overrides,
    };
}

function createService(records: PostHistoryRecord[]) {
    const getManyByEventIds = vi.fn(async ({ eventIds }: { eventIds: string[] }) => {
        const byId = new Map(records.map((record) => [record.eventId, record]));
        return eventIds.flatMap((eventId) => {
            const record = byId.get(eventId);
            return record ? [record] : [];
        });
    });
    const getForPubkey = vi.fn().mockResolvedValue(records.map(createPostHistorySearchRecord));
    const getMany = vi.fn().mockResolvedValue([]);
    return {
        service: new PostHistoryLocalSearchService(
            { getManyByEventIds },
            { getForPubkey },
            { getMany },
        ),
        getManyByEventIds,
        getForPubkey,
        getMany,
    };
}

describe("PostHistoryLocalSearchService", () => {
    beforeEach(() => resetPostHistoryLocalSearchRevisionsForTesting());

    it("検索専用 record と channel metadata を横断して検索し、表示ページだけを hydrate する", async () => {
        const first = createRecord({
            eventId: "ABC-123",
            kind: 42,
            content: "Hello World",
            tags: [["t", "Topic"]],
            media: [{ url: "https://example.com/IMAGE.JPG", alt: "Hero Banner" }],
            fetchedRelays: ["wss://Fetched.example.com/"],
            channelEventId: "channel-1",
        });
        const second = createRecord({ eventId: "event-2", content: "other" });
        const { service, getManyByEventIds, getForPubkey, getMany } = createService([first, second]);
        getMany.mockResolvedValueOnce([createChannelMetadata()]);

        await expect(service.searchLocalPosts({
            pubkeyHex: PUBKEY,
            query: "hello abc-123 42 topic hero fetched general public",
            page: 1,
            pageSize: 50,
        })).resolves.toMatchObject({ total: 1, items: [expect.objectContaining({ eventId: "ABC-123" })] });

        expect(getForPubkey).toHaveBeenCalledWith(PUBKEY);
        expect(getMany).toHaveBeenCalledWith(["channel-1"]);
        expect(getManyByEventIds).toHaveBeenCalledWith({ pubkeyHex: PUBKEY, eventIds: ["ABC-123"] });
    });

    it("空白区切り AND で検索し、軽量 index の順を保ってページングする", async () => {
        const records = Array.from({ length: 55 }, (_, index) => createRecord({
            eventId: `event-${index + 1}`,
            content: `alpha beta ${index + 1}`,
            postedAt: 10_000 - index,
        }));
        const { service, getForPubkey, getManyByEventIds } = createService(records);
        const first = await service.searchLocalPosts({ pubkeyHex: PUBKEY, query: " alpha   beta ", page: 1, pageSize: 50 });
        const second = await service.searchLocalPosts({ pubkeyHex: PUBKEY, query: "alpha beta", page: 2, pageSize: 50 });

        expect(first.items).toHaveLength(50);
        expect(second.items.map((record) => record.eventId)).toEqual(["event-51", "event-52", "event-53", "event-54", "event-55"]);
        expect(second).toMatchObject({ total: 55, hasNext: false });
        expect(getForPubkey).toHaveBeenCalledTimes(1);
        expect(getManyByEventIds).toHaveBeenCalledTimes(2);
    });

    it("post または channel metadata revision の変更後は ID cache を再構築する", async () => {
        const { service, getForPubkey } = createService([createRecord({ content: "alpha" })]);
        const options = { pubkeyHex: PUBKEY, query: "alpha", page: 1, pageSize: 50 };
        await service.searchLocalPosts(options);
        bumpPostHistorySearchRevision(PUBKEY);
        await service.searchLocalPosts(options);
        bumpChannelMetadataSearchRevision();
        await service.searchLocalPosts(options);
        expect(getForPubkey).toHaveBeenCalledTimes(3);
    });

    it("削除状態だけが変わった場合も ID cache を再利用しつつ fresh record を返す", async () => {
        const record = createRecord({ eventId: "deleted-event", content: "alpha" });
        const getManyByEventIds = vi.fn()
            .mockResolvedValueOnce([record])
            .mockResolvedValueOnce([{ ...record, deletedAt: 999, deletionEventId: "d".repeat(64) }]);
        const getForPubkey = vi.fn().mockResolvedValue([createPostHistorySearchRecord(record)]);
        const service = new PostHistoryLocalSearchService(
            { getManyByEventIds },
            { getForPubkey },
            { getMany: vi.fn().mockResolvedValue([]) },
        );
        const options = { pubkeyHex: PUBKEY, query: "alpha", page: 1, pageSize: 50 };

        await service.searchLocalPosts(options);
        const refreshed = await service.searchLocalPosts(options);

        expect(getForPubkey).toHaveBeenCalledTimes(1);
        expect(refreshed.items[0]).toMatchObject({ deletedAt: 999 });
    });

    it("同じ revision の近接 page request は軽量 index 走査を共有する", async () => {
        let resolveRecords: ((records: ReturnType<typeof createPostHistorySearchRecord>[]) => void) | undefined;
        const first = createRecord({ eventId: "event-1", content: "alpha" });
        const second = createRecord({ eventId: "event-2", content: "alpha" });
        const getForPubkey = vi.fn(() => new Promise<ReturnType<typeof createPostHistorySearchRecord>[]>((resolve) => {
            resolveRecords = resolve;
        }));
        const getManyByEventIds = vi.fn(async ({ eventIds }: { eventIds: string[] }) =>
            eventIds.map((eventId) => eventId === first.eventId ? first : second)
        );
        const service = new PostHistoryLocalSearchService(
            { getManyByEventIds },
            { getForPubkey },
            { getMany: vi.fn().mockResolvedValue([]) },
        );
        const options = { pubkeyHex: PUBKEY, query: "alpha", pageSize: 1 };
        const firstPage = service.searchLocalPosts({ ...options, page: 1 });
        const secondPage = service.searchLocalPosts({ ...options, page: 2 });
        resolveRecords?.([createPostHistorySearchRecord(first), createPostHistorySearchRecord(second)]);

        await expect(firstPage).resolves.toMatchObject({ items: [expect.objectContaining({ eventId: "event-1" })] });
        await expect(secondPage).resolves.toMatchObject({ items: [expect.objectContaining({ eventId: "event-2" })] });
        expect(getForPubkey).toHaveBeenCalledTimes(1);
    });

    it("6万件でも page 移動では full record 全件取得も軽量 index 再走査もしない", async () => {
        const records = Array.from({ length: 60_000 }, (_, index) => createRecord({
            eventId: `event-${index}`,
            content: `alpha post ${index}`,
            postedAt: 60_000 - index,
        }));
        const { service, getForPubkey, getManyByEventIds } = createService(records);
        await service.searchLocalPosts({ pubkeyHex: PUBKEY, query: "alpha", page: 1, pageSize: 50 });
        const second = await service.searchLocalPosts({ pubkeyHex: PUBKEY, query: "alpha", page: 2, pageSize: 50 });

        expect(second.items).toHaveLength(50);
        expect(second.items[0]?.eventId).toBe("event-50");
        expect(getForPubkey).toHaveBeenCalledTimes(1);
        expect(getManyByEventIds).toHaveBeenCalledTimes(2);
        expect(getManyByEventIds.mock.calls.every(([input]) => input.eventIds.length <= 50)).toBe(true);
    });

    it("空 query または pubkey なしでは index と正本を読まない", async () => {
        const { service, getForPubkey, getManyByEventIds } = createService([]);
        await expect(service.searchLocalPosts({ pubkeyHex: null, query: "alpha", page: 1, pageSize: 50 }))
            .resolves.toEqual({ items: [], total: 0, hasNext: false });
        await expect(service.searchLocalPosts({ pubkeyHex: PUBKEY, query: "  ", page: 1, pageSize: 50 }))
            .resolves.toEqual({ items: [], total: 0, hasNext: false });
        expect(getForPubkey).not.toHaveBeenCalled();
        expect(getManyByEventIds).not.toHaveBeenCalled();
    });
});
