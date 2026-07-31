import { beforeEach, describe, expect, it, vi } from "vitest";
import {
    bumpChannelMetadataSearchRevision,
    bumpPostHistorySearchRevision,
    resetPostHistoryLocalSearchRevisionsForTesting,
} from "../../lib/postHistoryLocalSearchRevision";
import type { ChannelMetadataCache } from "../../lib/storage/channelMetadataRepository";
import type { PostHistoryRecord } from "../../lib/storage/ehagakiDb";
import { PostHistoryLocalSearchService } from "../../lib/postHistoryLocalSearchService";

function createRecord(overrides: Partial<PostHistoryRecord> = {}): PostHistoryRecord {
    return {
        id: overrides.eventId ?? "event-1",
        eventId: "event-1",
        pubkeyHex: "a".repeat(64),
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
    };
}

function createChannelMetadata(
    overrides: Partial<ChannelMetadataCache> = {},
): ChannelMetadataCache {
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

describe("PostHistoryLocalSearchService", () => {
    beforeEach(() => {
        resetPostHistoryLocalSearchRevisionsForTesting();
    });

    it("pubkey scoped の投稿だけを取得して cached channel metadata も検索対象に含める", async () => {
        const getAll = vi.fn().mockResolvedValue([
            createRecord({
                eventId: "event-1",
                content: "first post",
                channelEventId: "channel-1",
            }),
            createRecord({
                eventId: "event-2",
                content: "second post",
                channelEventId: "channel-2",
            }),
        ]);
        const getMany = vi.fn().mockResolvedValue([
            createChannelMetadata({
                channelEventId: "channel-1",
                name: "General",
                about: "Public room",
            }),
        ]);
        const service = new PostHistoryLocalSearchService(
            { getAll },
            { getMany },
        );

        const result = await service.searchLocalPosts({
            pubkeyHex: "a".repeat(64),
            query: "general public",
            page: 1,
            pageSize: 50,
        });

        expect(getAll).toHaveBeenCalledWith({ pubkeyHex: "a".repeat(64) });
        expect(getMany).toHaveBeenCalledWith(["channel-1", "channel-2"]);
        expect(result).toEqual({
            items: [
                expect.objectContaining({
                    eventId: "event-1",
                }),
            ],
            total: 1,
            hasNext: false,
        });
    });

    it("content, eventId, kind, tags, media, relay fields を大小文字無視で検索できる", async () => {
        const getAll = vi.fn().mockResolvedValue([
            createRecord({
                eventId: "ABC-123",
                kind: 42,
                content: "Hello World",
                tags: [["t", "Topic"], ["p", "PubKey"]],
                media: [
                    {
                        url: "https://example.com/IMAGE.JPG",
                        alt: "Hero Banner",
                    },
                ],
                relayHints: ["wss://RelayHint.example.com/"],
                acceptedRelays: ["wss://Accepted.example.com/"],
                fetchedRelays: ["wss://Fetched.example.com/"],
            }),
        ]);
        const service = new PostHistoryLocalSearchService(
            { getAll },
            { getMany: vi.fn().mockResolvedValue([]) },
        );

        await expect(
            service.searchLocalPosts({
                pubkeyHex: "a".repeat(64),
                query: "hello",
                page: 1,
                pageSize: 50,
            }),
        ).resolves.toMatchObject({
            total: 1,
            items: [expect.objectContaining({ eventId: "ABC-123" })],
        });
        await expect(
            service.searchLocalPosts({
                pubkeyHex: "a".repeat(64),
                query: "abc-123",
                page: 1,
                pageSize: 50,
            }),
        ).resolves.toMatchObject({ total: 1 });
        await expect(
            service.searchLocalPosts({
                pubkeyHex: "a".repeat(64),
                query: "42",
                page: 1,
                pageSize: 50,
            }),
        ).resolves.toMatchObject({ total: 1 });
        await expect(
            service.searchLocalPosts({
                pubkeyHex: "a".repeat(64),
                query: "topic",
                page: 1,
                pageSize: 50,
            }),
        ).resolves.toMatchObject({ total: 1 });
        await expect(
            service.searchLocalPosts({
                pubkeyHex: "a".repeat(64),
                query: "hero banner",
                page: 1,
                pageSize: 50,
            }),
        ).resolves.toMatchObject({ total: 1 });
        await expect(
            service.searchLocalPosts({
                pubkeyHex: "a".repeat(64),
                query: "fetched.example.com",
                page: 1,
                pageSize: 50,
            }),
        ).resolves.toMatchObject({ total: 1 });
    });

    it("空白区切り AND で検索し、50 件単位でページングする", async () => {
        const getAll = vi.fn().mockResolvedValue(
            Array.from({ length: 55 }, (_, index) =>
                createRecord({
                    eventId: `event-${index + 1}`,
                    content: `alpha beta ${index + 1}`,
                    postedAt: 10_000 - index,
                }),
            ),
        );
        const service = new PostHistoryLocalSearchService(
            { getAll },
            { getMany: vi.fn().mockResolvedValue([]) },
        );

        const firstPage = await service.searchLocalPosts({
            pubkeyHex: "a".repeat(64),
            query: " alpha   beta ",
            page: 1,
            pageSize: 50,
        });
        const secondPage = await service.searchLocalPosts({
            pubkeyHex: "a".repeat(64),
            query: "alpha beta",
            page: 2,
            pageSize: 50,
        });

        expect(firstPage.total).toBe(55);
        expect(firstPage.items).toHaveLength(50);
        expect(firstPage.hasNext).toBe(true);
        expect(secondPage.items).toHaveLength(5);
        expect(secondPage.items[0]?.eventId).toBe("event-51");
        expect(secondPage.hasNext).toBe(false);
        expect(getAll).toHaveBeenCalledTimes(1);
    });

    it("同じ revision の近接した page request は全件検索を共有する", async () => {
        let resolvePosts: ((posts: PostHistoryRecord[]) => void) | undefined;
        const getAll = vi.fn().mockImplementation(() => new Promise<PostHistoryRecord[]>((resolve) => {
            resolvePosts = resolve;
        }));
        const getMany = vi.fn().mockResolvedValue([]);
        const service = new PostHistoryLocalSearchService({ getAll }, { getMany });
        const options = {
            pubkeyHex: "a".repeat(64),
            query: "alpha",
            pageSize: 1,
        };

        const firstPage = service.searchLocalPosts({ ...options, page: 1 });
        const secondPage = service.searchLocalPosts({ ...options, page: 2 });
        resolvePosts?.([
            createRecord({ eventId: "event-1", content: "alpha first" }),
            createRecord({ eventId: "event-2", content: "alpha second" }),
        ]);

        await expect(firstPage).resolves.toMatchObject({
            total: 2,
            items: [expect.objectContaining({ eventId: "event-1" })],
        });
        await expect(secondPage).resolves.toMatchObject({
            total: 2,
            items: [expect.objectContaining({ eventId: "event-2" })],
        });
        expect(getAll).toHaveBeenCalledTimes(1);
        expect(getMany).toHaveBeenCalledTimes(0);
    });

    it("投稿または channel metadata revision の変更後は cache を再構築する", async () => {
        const pubkeyHex = "a".repeat(64);
        const getAll = vi.fn().mockResolvedValue([
            createRecord({ content: "alpha" }),
        ]);
        const getMany = vi.fn().mockResolvedValue([]);
        const service = new PostHistoryLocalSearchService({ getAll }, { getMany });
        const options = { pubkeyHex, query: "alpha", page: 1, pageSize: 50 };

        await service.searchLocalPosts(options);
        bumpPostHistorySearchRevision(pubkeyHex);
        await service.searchLocalPosts(options);
        bumpChannelMetadataSearchRevision();
        await service.searchLocalPosts(options);

        expect(getAll).toHaveBeenCalledTimes(3);
    });

    it("clear 後に完了した古い request を resolved cache に復活させない", async () => {
        let resolvePosts: ((posts: PostHistoryRecord[]) => void) | undefined;
        const getAll = vi.fn()
            .mockImplementationOnce(() => new Promise<PostHistoryRecord[]>((resolve) => {
                resolvePosts = resolve;
            }))
            .mockResolvedValueOnce([createRecord({ content: "alpha" })]);
        const service = new PostHistoryLocalSearchService(
            { getAll },
            { getMany: vi.fn().mockResolvedValue([]) },
        );
        const options = {
            pubkeyHex: "a".repeat(64),
            query: "alpha",
            page: 1,
            pageSize: 50,
        };

        const firstRequest = service.searchLocalPosts(options);
        service.clearCache();
        resolvePosts?.([createRecord({ content: "alpha" })]);
        await firstRequest;
        await service.searchLocalPosts(options);

        expect(getAll).toHaveBeenCalledTimes(2);
    });

    it("revision が連続して変わっても再構築は最大 2 回で cache しない", async () => {
        const pubkeyHex = "a".repeat(64);
        const getAll = vi.fn().mockImplementation(async () => {
            bumpPostHistorySearchRevision(pubkeyHex);
            return [createRecord({ content: "alpha" })];
        });
        const service = new PostHistoryLocalSearchService(
            { getAll },
            { getMany: vi.fn().mockResolvedValue([]) },
        );
        const options = { pubkeyHex, query: "alpha", page: 1, pageSize: 50 };

        await expect(service.searchLocalPosts(options)).resolves.toMatchObject({ total: 1 });
        expect(getAll).toHaveBeenCalledTimes(2);
        await service.searchLocalPosts(options);
        expect(getAll).toHaveBeenCalledTimes(4);
    });

    it("6 万件でも page 移動では全件取得・metadata 取得・検索構築を再実行しない", async () => {
        const posts = Array.from({ length: 60_000 }, (_, index) =>
            createRecord({
                eventId: `event-${index}`,
                content: `alpha post ${index}`,
                postedAt: 60_000 - index,
            }),
        );
        const getAll = vi.fn().mockResolvedValue(posts);
        const getMany = vi.fn().mockResolvedValue([]);
        const service = new PostHistoryLocalSearchService({ getAll }, { getMany });
        const options = {
            pubkeyHex: "a".repeat(64),
            query: "alpha",
            pageSize: 50,
        };

        const firstPage = await service.searchLocalPosts({ ...options, page: 1 });
        const secondPage = await service.searchLocalPosts({ ...options, page: 2 });

        expect(firstPage.items).toHaveLength(50);
        expect(secondPage.items).toHaveLength(50);
        expect(secondPage.items[0]?.eventId).toBe("event-50");
        expect(getAll).toHaveBeenCalledTimes(1);
        expect(getMany).toHaveBeenCalledTimes(0);
    });

    it("空の query または pubkey なしなら検索しない", async () => {
        const getAll = vi.fn();
        const getMany = vi.fn();
        const service = new PostHistoryLocalSearchService(
            { getAll },
            { getMany },
        );

        await expect(
            service.searchLocalPosts({
                pubkeyHex: null,
                query: "hello",
                page: 1,
                pageSize: 50,
            }),
        ).resolves.toEqual({ items: [], total: 0, hasNext: false });
        await expect(
            service.searchLocalPosts({
                pubkeyHex: "a".repeat(64),
                query: "   ",
                page: 1,
                pageSize: 50,
            }),
        ).resolves.toEqual({ items: [], total: 0, hasNext: false });

        expect(getAll).not.toHaveBeenCalled();
        expect(getMany).not.toHaveBeenCalled();
    });

    it("visibleUntil の有無に関係なく全保存投稿を検索対象にする", async () => {
        const getAll = vi.fn().mockResolvedValue([
            createRecord({ eventId: "event-1", content: "visible post", createdAt: 1000 }),
            createRecord({ eventId: "event-2", content: "imported old post", createdAt: 100 }),
        ]);
        const service = new PostHistoryLocalSearchService(
            { getAll },
            { getMany: vi.fn().mockResolvedValue([]) },
        );

        const result = await service.searchLocalPosts({
            pubkeyHex: "a".repeat(64),
            query: "old",
            page: 1,
            pageSize: 50,
        });

        expect(result).toMatchObject({
            total: 1,
            items: [expect.objectContaining({ eventId: "event-2" })],
            hasNext: false,
        });
        expect(getAll).toHaveBeenCalledWith({
            pubkeyHex: "a".repeat(64),
        });
    });
});
