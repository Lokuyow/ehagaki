import { beforeEach, describe, expect, it, vi } from "vitest";
import { finalizeEvent, generateSecretKey } from "nostr-tools";
import {
    bumpChannelMetadataSearchRevision,
    bumpPostHistorySearchRevision,
    resetPostHistoryLocalSearchRevisionsForTesting,
} from "../../lib/postHistoryLocalSearchRevision";
import type { ChannelMetadataCache } from "../../lib/storage/channelMetadataRepository";
import type { PostHistoryRecord, SensitivePayloadRecord } from "../../lib/storage/ehagakiDb";
import { PostHistoryLocalSearchService } from "../../lib/postHistoryLocalSearchService";
import type { PostHistorySearchScanChunkOptions } from "../../lib/storage/postHistoryRepository";
import type { NostrEvent } from "../../lib/types";

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

function createSearchRepository(getChunkItems: (options: { pubkeyHex?: string | null }) => Promise<PostHistoryRecord[]>) {
    return {
        getSearchScanChunk: async ({ pubkeyHex }: PostHistorySearchScanChunkOptions) => ({
            items: await getChunkItems({ pubkeyHex }), nextCursor: null, hasMore: false,
        }),
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

    it("publishes growing first-page previews before completion and shares the scan with late listeners and pages", async () => {
        const posts = Array.from({ length: 60 }, (_, index) => createRecord({ eventId: String(index), content: "alpha beta" }));
        let finish!: (chunk: { items: PostHistoryRecord[]; nextCursor: null; hasMore: boolean }) => void;
        const getSearchScanChunk = vi.fn()
            .mockResolvedValueOnce({ items: posts.slice(0, 20), nextCursor: posts[19], hasMore: true })
            .mockImplementationOnce(() => new Promise((resolve) => { finish = resolve; }));
        const service = new PostHistoryLocalSearchService({ getSearchScanChunk }, { getMany: vi.fn() });
        const onProgress = vi.fn();
        const options = { pubkeyHex: "a".repeat(64), query: "alpha beta", page: 1, pageSize: 50 };
        const first = service.searchLocalPosts({ ...options, onProgress });
        await vi.waitFor(() => expect(getSearchScanChunk).toHaveBeenCalledTimes(2));
        expect(onProgress).toHaveBeenCalledWith({ phase: "partial", items: posts.slice(0, 20) });
        const lateProgress = vi.fn();
        const late = service.searchLocalPosts({ ...options, query: " ALPHA   beta ", pageSize: 10, onProgress: lateProgress });
        const second = service.searchLocalPosts({ ...options, page: 2 });
        expect(lateProgress).toHaveBeenCalledWith({ phase: "partial", items: posts.slice(0, 10) });
        finish({ items: posts.slice(20), nextCursor: null, hasMore: false });
        await expect(first).resolves.toEqual({ items: posts.slice(0, 50), total: 60, hasNext: true });
        await expect(second).resolves.toEqual({ items: posts.slice(50), total: 60, hasNext: false });
        await expect(late).resolves.toMatchObject({ total: 60 });
        expect(onProgress.mock.calls.map(([progress]) => progress.items.length)).toEqual([20, 50]);
        await service.searchLocalPosts(options);
        expect(getSearchScanChunk).toHaveBeenCalledTimes(2);
    });

    it.each([0, 49, 50, 51])("keeps final count and paging correct for %i matches", async (count) => {
        const posts = Array.from({ length: count }, (_, index) => createRecord({ eventId: String(index), content: "alpha" }));
        const service = new PostHistoryLocalSearchService(createSearchRepository(vi.fn().mockResolvedValue(posts)), { getMany: vi.fn() });
        const onProgress = vi.fn();
        const result = await service.searchLocalPosts({ pubkeyHex: "a".repeat(64), query: "alpha", page: 1, pageSize: 50, onProgress });
        expect(result).toEqual({ items: posts.slice(0, 50), total: count, hasNext: count > 50 });
        expect(onProgress.mock.calls.map(([progress]) => progress.items.length)).toEqual(count ? [Math.min(count, 50)] : []);
    });

    it.each(["clear", "query", "account"])("stops a superseded scan after the pending batch (%s)", async (reason) => {
        const posts = [createRecord({ content: "alpha" })];
        let finish!: (chunk: { items: PostHistoryRecord[]; nextCursor: PostHistoryRecord; hasMore: boolean }) => void;
        const getSearchScanChunk = vi.fn()
            .mockResolvedValueOnce({ items: posts, nextCursor: posts[0], hasMore: true })
            .mockImplementationOnce(() => new Promise((resolve) => { finish = resolve; }))
            .mockResolvedValue({ items: [], nextCursor: null, hasMore: false });
        const service = new PostHistoryLocalSearchService({ getSearchScanChunk }, { getMany: vi.fn() });
        const onProgress = vi.fn();
        const options = { pubkeyHex: "a".repeat(64), query: "alpha", page: 1, pageSize: 50 };
        const first = service.searchLocalPosts({ ...options, onProgress });
        const cancelled = expect(first).rejects.toMatchObject({ name: "AbortError" });
        await vi.waitFor(() => expect(getSearchScanChunk).toHaveBeenCalledTimes(2));
        if (reason === "clear") service.clearCache();
        else await service.searchLocalPosts({ ...options, ...(reason === "query" ? { query: "beta" } : { pubkeyHex: "b".repeat(64) }) });
        finish({ items: posts, nextCursor: posts[0], hasMore: true });
        await cancelled;
        expect(onProgress).toHaveBeenCalledTimes(1);
        expect(getSearchScanChunk).toHaveBeenCalledTimes(reason === "clear" ? 2 : 3);
    });

    it("resets partial results before a revision retry and refreshes metadata for the new attempt", async () => {
        const pubkeyHex = "a".repeat(64);
        const firstPost = createRecord({ eventId: "old", content: "", channelEventId: "channel-1" });
        const newPost = createRecord({ eventId: "new", content: "", channelEventId: "channel-1" });
        let finish!: (chunk: { items: PostHistoryRecord[]; nextCursor: null; hasMore: boolean }) => void;
        const getSearchScanChunk = vi.fn()
            .mockResolvedValueOnce({ items: [firstPost], nextCursor: firstPost, hasMore: true })
            .mockImplementationOnce(() => new Promise((resolve) => { finish = resolve; }))
            .mockResolvedValueOnce({ items: [newPost], nextCursor: null, hasMore: false });
        const getMany = vi.fn().mockResolvedValue([createChannelMetadata({ name: "alpha" })]);
        const service = new PostHistoryLocalSearchService({ getSearchScanChunk }, { getMany });
        const onProgress = vi.fn();
        const pending = service.searchLocalPosts({ pubkeyHex, query: "alpha", page: 1, pageSize: 50, onProgress });
        await vi.waitFor(() => expect(getSearchScanChunk).toHaveBeenCalledTimes(2));
        bumpChannelMetadataSearchRevision();
        finish({ items: [firstPost], nextCursor: null, hasMore: false });
        await expect(pending).resolves.toEqual({ items: [newPost], total: 1, hasNext: false });
        expect(onProgress.mock.calls.map(([progress]) => [progress.phase, progress.items.map((post: PostHistoryRecord) => post.eventId)]))
            .toEqual([["partial", ["old"]], ["reset", []], ["partial", ["new"]]]);
        expect(getMany).toHaveBeenCalledTimes(2);
    });

    it("reuses channel metadata across batches while preserving metadata-only matches", async () => {
        const first = createRecord({ eventId: "first", content: "", channelEventId: "channel-1" });
        const second = createRecord({ eventId: "second", content: "", channelEventId: "channel-1" });
        const getSearchScanChunk = vi.fn()
            .mockResolvedValueOnce({ items: [first], nextCursor: first, hasMore: true })
            .mockResolvedValueOnce({ items: [second], nextCursor: null, hasMore: false });
        const getMany = vi.fn().mockResolvedValue([createChannelMetadata()]);
        const service = new PostHistoryLocalSearchService({ getSearchScanChunk }, { getMany });
        await expect(service.searchLocalPosts({ pubkeyHex: "a".repeat(64), query: "general public", page: 1, pageSize: 50 }))
            .resolves.toEqual({ items: [first, second], total: 2, hasNext: false });
        expect(getMany).toHaveBeenCalledTimes(1);
    });

    it("propagates a later batch failure after publishing the available results", async () => {
        const post = createRecord({ content: "alpha" });
        const getSearchScanChunk = vi.fn()
            .mockResolvedValueOnce({ items: [post], nextCursor: post, hasMore: true })
            .mockRejectedValueOnce(new Error("scan failed"));
        const onProgress = vi.fn();
        const service = new PostHistoryLocalSearchService({ getSearchScanChunk }, { getMany: vi.fn() });
        await expect(service.searchLocalPosts({ pubkeyHex: "a".repeat(64), query: "alpha", page: 1, pageSize: 50, onProgress }))
            .rejects.toThrow("scan failed");
        expect(onProgress).toHaveBeenCalledWith({ phase: "partial", items: [post] });
    });

    it("pubkey scoped の投稿だけを取得して cached channel metadata も検索対象に含める", async () => {
        const getChunkItems = vi.fn().mockResolvedValue([
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
            createSearchRepository(getChunkItems),
            { getMany },
        );

        const result = await service.searchLocalPosts({
            pubkeyHex: "a".repeat(64),
            query: "general public",
            page: 1,
            pageSize: 50,
        });

        expect(getChunkItems).toHaveBeenCalledWith({ pubkeyHex: "a".repeat(64) });
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
        const getChunkItems = vi.fn().mockResolvedValue([
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
            createSearchRepository(getChunkItems),
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
        const getChunkItems = vi.fn().mockResolvedValue(
            Array.from({ length: 55 }, (_, index) =>
                createRecord({
                    eventId: `event-${index + 1}`,
                    content: `alpha beta ${index + 1}`,
                    postedAt: 10_000 - index,
                }),
            ),
        );
        const service = new PostHistoryLocalSearchService(
            createSearchRepository(getChunkItems),
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
        expect(getChunkItems).toHaveBeenCalledTimes(1);
    });

    it("同じ revision の近接した page request は全件検索を共有する", async () => {
        let resolvePosts: ((posts: PostHistoryRecord[]) => void) | undefined;
        const getChunkItems = vi.fn().mockImplementation(() => new Promise<PostHistoryRecord[]>((resolve) => {
            resolvePosts = resolve;
        }));
        const getMany = vi.fn().mockResolvedValue([]);
        const service = new PostHistoryLocalSearchService(createSearchRepository(getChunkItems), { getMany });
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
        expect(getChunkItems).toHaveBeenCalledTimes(1);
        expect(getMany).toHaveBeenCalledTimes(0);
    });

    it("投稿または channel metadata revision の変更後は cache を再構築する", async () => {
        const pubkeyHex = "a".repeat(64);
        const getChunkItems = vi.fn().mockResolvedValue([
            createRecord({ content: "alpha" }),
        ]);
        const getMany = vi.fn().mockResolvedValue([]);
        const service = new PostHistoryLocalSearchService(createSearchRepository(getChunkItems), { getMany });
        const options = { pubkeyHex, query: "alpha", page: 1, pageSize: 50 };

        await service.searchLocalPosts(options);
        bumpPostHistorySearchRevision(pubkeyHex);
        await service.searchLocalPosts(options);
        bumpChannelMetadataSearchRevision();
        await service.searchLocalPosts(options);

        expect(getChunkItems).toHaveBeenCalledTimes(3);
    });

    it("clear 後に完了した古い request を resolved cache に復活させない", async () => {
        let resolvePosts: ((posts: PostHistoryRecord[]) => void) | undefined;
        const getChunkItems = vi.fn()
            .mockImplementationOnce(() => new Promise<PostHistoryRecord[]>((resolve) => {
                resolvePosts = resolve;
            }))
            .mockResolvedValueOnce([createRecord({ content: "alpha" })]);
        const service = new PostHistoryLocalSearchService(
            createSearchRepository(getChunkItems),
            { getMany: vi.fn().mockResolvedValue([]) },
        );
        const options = {
            pubkeyHex: "a".repeat(64),
            query: "alpha",
            page: 1,
            pageSize: 50,
        };

        const firstRequest = service.searchLocalPosts(options);
        const cancelled = expect(firstRequest).rejects.toMatchObject({ name: "AbortError" });
        service.clearCache();
        resolvePosts?.([createRecord({ content: "alpha" })]);
        await cancelled;
        await service.searchLocalPosts(options);

        expect(getChunkItems).toHaveBeenCalledTimes(2);
    });

    it("revision が連続して変わっても再構築は最大 2 回で cache しない", async () => {
        const pubkeyHex = "a".repeat(64);
        const getChunkItems = vi.fn().mockImplementation(async () => {
            bumpPostHistorySearchRevision(pubkeyHex);
            return [createRecord({ content: "alpha" })];
        });
        const service = new PostHistoryLocalSearchService(
            createSearchRepository(getChunkItems),
            { getMany: vi.fn().mockResolvedValue([]) },
        );
        const options = { pubkeyHex, query: "alpha", page: 1, pageSize: 50 };

        await expect(service.searchLocalPosts(options)).resolves.toMatchObject({ total: 1 });
        expect(getChunkItems).toHaveBeenCalledTimes(2);
        await service.searchLocalPosts(options);
        expect(getChunkItems).toHaveBeenCalledTimes(4);
    });

    it("retry 2 回目の同一 revision request は active in-flight Promise を共有する", async () => {
        const pubkeyHex = "a".repeat(64);
        let resolveFirstAttempt: ((posts: PostHistoryRecord[]) => void) | undefined;
        let resolveSecondAttempt: ((posts: PostHistoryRecord[]) => void) | undefined;
        const getChunkItems = vi.fn()
            .mockImplementationOnce(() => new Promise<PostHistoryRecord[]>((resolve) => {
                resolveFirstAttempt = resolve;
            }))
            .mockImplementationOnce(() => new Promise<PostHistoryRecord[]>((resolve) => {
                resolveSecondAttempt = resolve;
            }));
        const service = new PostHistoryLocalSearchService(
            createSearchRepository(getChunkItems),
            { getMany: vi.fn().mockResolvedValue([]) },
        );
        const options = { pubkeyHex, query: "alpha", page: 1, pageSize: 50 };

        const firstRequest = service.searchLocalPosts(options);
        bumpPostHistorySearchRevision(pubkeyHex);
        resolveFirstAttempt?.([createRecord({ content: "alpha result" })]);

        await vi.waitFor(() => {
            expect(getChunkItems).toHaveBeenCalledTimes(2);
        });
        const secondRequest = service.searchLocalPosts({
            ...options,
            query: "  ALPHA  ",
        });
        resolveSecondAttempt?.([createRecord({ content: "alpha result" })]);

        await expect(firstRequest).resolves.toMatchObject({
            total: 1,
            items: [expect.objectContaining({ content: "alpha result" })],
        });
        await expect(secondRequest).resolves.toMatchObject({
            total: 1,
            items: [expect.objectContaining({ content: "alpha result" })],
        });
        expect(getChunkItems).toHaveBeenCalledTimes(2);
    });

    it("6 万件を分割検索し、page 移動では再走査しない", async () => {
        const posts = Array.from({ length: 60_000 }, (_, index) => createRecord({
            eventId: String(index), content: 'alpha post', postedAt: 60_000 - index,
        }));
        const getSearchScanChunk = vi.fn(async ({ cursor, limit }: PostHistorySearchScanChunkOptions) => {
            const start = cursor ? Number(cursor.eventId) + 1 : 0;
            const items = posts.slice(start, start + limit);
            const last = items.at(-1);
            return { items, nextCursor: last ?? null, hasMore: start + items.length < posts.length };
        });
        const getMany = vi.fn().mockResolvedValue([]);
        const service = new PostHistoryLocalSearchService({ getSearchScanChunk }, { getMany });
        const options = { pubkeyHex: 'a'.repeat(64), query: 'alpha', pageSize: 50 };
        const first = await service.searchLocalPosts({ ...options, page: 1 });
        const reads = getSearchScanChunk.mock.calls.length;
        const second = await service.searchLocalPosts({ ...options, page: 2 });
        expect(first.total).toBe(60_000);
        expect(first.items).toHaveLength(50);
        expect(second.items[0]?.eventId).toBe('50');
        expect(reads).toBeGreaterThan(1);
        expect(getSearchScanChunk).toHaveBeenCalledTimes(reads);
        expect(getMany).not.toHaveBeenCalled();
    });

    it("空の query または pubkey なしなら検索しない", async () => {
        const getChunkItems = vi.fn();
        const getMany = vi.fn();
        const service = new PostHistoryLocalSearchService(
            createSearchRepository(getChunkItems),
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

        expect(getChunkItems).not.toHaveBeenCalled();
        expect(getMany).not.toHaveBeenCalled();
    });

    it("visibleUntil の有無に関係なく全保存投稿を検索対象にする", async () => {
        const getChunkItems = vi.fn().mockResolvedValue([
            createRecord({ eventId: "event-1", content: "visible post", createdAt: 1000 }),
            createRecord({ eventId: "event-2", content: "imported old post", createdAt: 100 }),
        ]);
        const service = new PostHistoryLocalSearchService(
            createSearchRepository(getChunkItems),
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
        expect(getChunkItems).toHaveBeenCalledWith({
            pubkeyHex: "a".repeat(64),
        });
    });

    it("pair検証済みpayload本文で検索し、結果には本文を投影しない", async () => {
        const secretKey = generateSecretKey();
        const payload = finalizeEvent({
            kind: 36,
            content: "hidden search phrase",
            created_at: 100,
            tags: [["k", "1"]],
        }, secretKey) as NostrEvent;
        const structure = finalizeEvent({
            kind: 1,
            content: "",
            created_at: 100,
            tags: [["content-warning", "Sensitive"], ["c", payload.id]],
        }, secretKey) as NostrEvent;
        const post = createRecord({
            eventId: structure.id,
            kind: 1,
            content: "",
            tags: structure.tags,
            pubkeyHex: structure.pubkey,
            createdAt: structure.created_at,
            rawEvent: structure,
        });
        const payloadRecord: SensitivePayloadRecord = {
            id: payload.id,
            pubkeyHex: payload.pubkey,
            structureKind: 1,
            rawEvent: payload,
            acceptedRelays: [],
            fetchedRelays: [],
            relayHints: [],
            createdAt: 100,
            updatedAt: 100,
            schemaVersion: 1,
        };
        const getByIds = vi.fn().mockResolvedValue([payloadRecord]);
        const service = new PostHistoryLocalSearchService(
            createSearchRepository(vi.fn().mockResolvedValue([post])),
            { getMany: vi.fn().mockResolvedValue([]) },
            { getByIds },
        );

        const result = await service.searchLocalPosts({
            pubkeyHex: structure.pubkey,
            query: "hidden search phrase",
            page: 1,
            pageSize: 50,
        });

        expect(getByIds).toHaveBeenCalledWith([payload.id]);
        expect(result.items).toHaveLength(1);
        expect(result.items[0]).toMatchObject({
            eventId: structure.id,
            content: "",
            rawEvent: structure,
        });
        expect(JSON.stringify(result.items[0])).not.toContain("hidden search phrase");
    });

    it("未associationのpayload candidateは本文検索へ昇格しない", async () => {
        const secretKey = generateSecretKey();
        const payload = finalizeEvent({
            kind: 36,
            content: "orphan-only phrase",
            created_at: 100,
            tags: [["k", "42"]],
        }, secretKey) as NostrEvent;
        const structure = finalizeEvent({
            kind: 1,
            content: "",
            created_at: 100,
            tags: [["content-warning"], ["c", payload.id]],
        }, secretKey) as NostrEvent;
        const post = createRecord({
            eventId: structure.id,
            kind: 1,
            content: "",
            tags: structure.tags,
            pubkeyHex: structure.pubkey,
            createdAt: structure.created_at,
            rawEvent: structure,
        });
        const unassociatedPayload: SensitivePayloadRecord = {
            id: payload.id,
            pubkeyHex: payload.pubkey,
            structureKind: 42,
            rawEvent: payload,
            acceptedRelays: [],
            fetchedRelays: [],
            relayHints: [],
            createdAt: 100,
            updatedAt: 100,
            schemaVersion: 1,
        };
        const service = new PostHistoryLocalSearchService(
            createSearchRepository(vi.fn().mockResolvedValue([post])),
            { getMany: vi.fn().mockResolvedValue([]) },
            { getByIds: vi.fn().mockResolvedValue([unassociatedPayload]) },
        );

        await expect(service.searchLocalPosts({
            pubkeyHex: structure.pubkey,
            query: "orphan-only phrase",
            page: 1,
            pageSize: 50,
        })).resolves.toMatchObject({ total: 0, items: [] });
    });
});
