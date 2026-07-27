import { describe, expect, it, vi } from "vitest";
import type {
    ChannelImageCacheMetaRecord,
    ChannelMetadataRecord,
} from "../../lib/storage/ehagakiDb";
import { CHANNEL_METADATA_SCHEMA_VERSION } from "../../lib/channelMetadataConstants";
import {
    CHANNEL_IMAGE_CACHE_ACCESS_TOUCH_INTERVAL_MS,
    CHANNEL_IMAGE_CACHE_MAX_OPAQUE_ENTRIES,
    CHANNEL_IMAGE_CACHE_MAX_READABLE_TOTAL_BYTES,
    CHANNEL_IMAGE_CACHE_RETRY_INTERVAL_MS,
    CHANNEL_IMAGE_CACHE_TTL_MS,
    ChannelImageCacheController,
    isChannelImageProxyUrl,
} from "../../lib/swChannelImageCacheUtils";
import type { ChannelImageMetaRepository } from "../../lib/swChannelImageMetaRepository";

const origin = "https://app.example.com";
const basePath = "/ehagaki/";
const eventId = "a".repeat(64);
const imageUrl = "https://images.example.com/channel.png?q=1";

class MemoryCache {
    readonly entries = new Map<string, Response>();
    readonly put = vi.fn(async (request: RequestInfo | URL, response: Response) => {
        this.entries.set(this.key(request), response.clone());
    });
    readonly delete = vi.fn(async (request: RequestInfo | URL) =>
        this.entries.delete(this.key(request)));

    readonly match = vi.fn(async (request: RequestInfo | URL): Promise<Response | undefined> => {
        return this.entries.get(this.key(request))?.clone();
    });

    async keys(): Promise<Request[]> {
        return Array.from(this.entries.keys(), (url) => new Request(url));
    }

    private key(request: RequestInfo | URL): string {
        return typeof request === "string"
            ? request
            : request instanceof URL
                ? request.toString()
                : request.url;
    }
}

class MemoryRepository implements ChannelImageMetaRepository {
    channel: ChannelMetadataRecord | null = verifiedChannel();
    readonly metadata = new Map<string, ChannelImageCacheMetaRecord>();
    readonly getChannelMetadata = vi.fn(async (_eventId: string) => this.channel);
    readonly get = vi.fn(async (url: string) => this.metadata.get(url) ?? null);
    readonly getAll = vi.fn(async () => Array.from(this.metadata.values()));
    readonly put = vi.fn(async (record: ChannelImageCacheMetaRecord) => {
        this.metadata.set(record.url, { ...record });
    });
    readonly touchLastAccessedAt = vi.fn(async (url: string, accessedAt: number) => {
        const current = this.metadata.get(url);
        if (current && accessedAt > current.lastAccessedAt) {
            this.metadata.set(url, { ...current, lastAccessedAt: accessedAt });
        }
    });
    readonly markAttempt = vi.fn(async (url: string, attemptedAt: number) => {
        const current = this.metadata.get(url);
        if (current && attemptedAt > current.lastAttemptAt) {
            this.metadata.set(url, { ...current, lastAttemptAt: attemptedAt });
        }
    });
    readonly markAttemptAndAccess = vi.fn(async (url: string, attemptedAt: number) => {
        const current = this.metadata.get(url);
        if (current) {
            this.metadata.set(url, {
                ...current,
                lastAttemptAt: Math.max(current.lastAttemptAt, attemptedAt),
                lastAccessedAt: Math.max(current.lastAccessedAt, attemptedAt),
            });
        }
    });
    readonly delete = vi.fn(async (url: string) => {
        this.metadata.delete(url);
    });
}

function verifiedChannel(overrides: Partial<ChannelMetadataRecord> = {}): ChannelMetadataRecord {
    return {
        channelEventId: eventId,
        name: "General",
        about: null,
        picture: imageUrl,
        relays: [],
        relayHints: [],
        resolutionQuality: "verified-metadata",
        updatedAt: 1,
        schemaVersion: CHANNEL_METADATA_SCHEMA_VERSION,
        ...overrides,
    };
}

function channelWithRawSchemaVersion(schemaVersion: unknown): ChannelMetadataRecord {
    return {
        ...verifiedChannel(),
        schemaVersion,
    } as unknown as ChannelMetadataRecord;
}

function metadata(overrides: Partial<ChannelImageCacheMetaRecord> = {}): ChannelImageCacheMetaRecord {
    return {
        url: imageUrl,
        responseType: "readable",
        verifiedSize: 5,
        fetchedAt: 1,
        lastAttemptAt: 1,
        lastAccessedAt: 1,
        schemaVersion: 1,
        ...overrides,
    };
}

function attemptMetadata(
    overrides: Partial<ChannelImageCacheMetaRecord> = {},
): ChannelImageCacheMetaRecord {
    return metadata({
        responseType: null,
        verifiedSize: null,
        fetchedAt: null,
        ...overrides,
    });
}

function proxyRequest(url = imageUrl, id = eventId): Request {
    const proxy = new URL(`${origin}${basePath}__ehagaki-image/channel`);
    proxy.searchParams.set("eventId", id);
    proxy.searchParams.set("url", url);
    return new Request(proxy, { headers: { Accept: "image/*" } });
}

function setup(options: {
    now?: number;
    fetchRequest?: (request: Request) => Promise<Response>;
} = {}) {
    const cache = new MemoryCache();
    const repository = new MemoryRepository();
    const fetchRequest = vi.fn(options.fetchRequest ?? (async () => new Response("image", {
        status: 200,
        headers: { "Content-Type": "image/png" },
    })));
    const openCache = vi.fn(async () => cache);
    const logger = { error: vi.fn() };
    const controller = new ChannelImageCacheController({
        cacheStorage: { open: openCache } as unknown as CacheStorage,
        fetchRequest,
        repository,
        currentOrigin: origin,
        basePath,
        now: () => options.now ?? 100,
        logger,
    });
    return { cache, repository, fetchRequest, controller, openCache, logger };
}

function eventFor(request = proxyRequest()) {
    const background: Promise<unknown>[] = [];
    return {
        event: {
            request,
            waitUntil: (promise: Promise<unknown>) => background.push(promise),
        },
        background,
    };
}

describe("swChannelImageCacheUtils", () => {
    it("base pathを含む完全一致pathだけをchannel proxyと判定する", () => {
        expect(isChannelImageProxyUrl(
            new URL(`${origin}/ehagaki/__ehagaki-image/channel`),
            origin,
            basePath,
        )).toBe(true);
        expect(isChannelImageProxyUrl(
            new URL(`${origin}/__ehagaki-image/channel`),
            origin,
            basePath,
        )).toBe(false);
    });

    it.each([
        ["recordなし", null],
        ["schemaVersion欠落", channelWithRawSchemaVersion(undefined)],
        ["schemaVersionがNaN", channelWithRawSchemaVersion(Number.NaN)],
        ["schemaVersionが文字列", channelWithRawSchemaVersion("2")],
        ["schemaVersionが非整数", channelWithRawSchemaVersion(CHANNEL_METADATA_SCHEMA_VERSION + 0.5)],
        ["schemaVersion不一致", verifiedChannel({ schemaVersion: CHANNEL_METADATA_SCHEMA_VERSION - 1 })],
        ["quality不一致", verifiedChannel({ resolutionQuality: "verified-root-only" })],
        ["picture不一致", verifiedChannel({ picture: "https://images.example.com/other.png" })],
    ])("%sならfetchもCache API参照もしない", async (_label, channel) => {
        const { controller, repository, fetchRequest, openCache } = setup();
        repository.channel = channel;
        const { event } = eventFor();
        const response = await controller.handle(event);
        expect(response.status).toBe(403);
        expect(fetchRequest).not.toHaveBeenCalled();
        expect(openCache).not.toHaveBeenCalled();
    });

    it("現行schemaVersionかつpicture一致なら認可して取得する", async () => {
        const { controller, repository, fetchRequest } = setup();
        repository.channel = verifiedChannel({ schemaVersion: CHANNEL_METADATA_SCHEMA_VERSION + 1 });
        expect((await controller.handle(eventFor().event)).status).toBe(200);
        expect(fetchRequest).toHaveBeenCalledTimes(1);
    });

    it("認可済みmissを保存し、表示Response bodyを未消費で返す", async () => {
        const { controller, repository, cache } = setup();
        const { event } = eventFor();
        const response = await controller.handle(event);
        expect(await response.text()).toBe("image");
        expect(await (await cache.match(imageUrl))?.text()).toBe("image");
        expect(repository.metadata.get(imageUrl)).toMatchObject({
            responseType: "readable",
            verifiedSize: 5,
        });
    });

    it("Content-Length超過はblob化も保存もせず元Responseを返す", async () => {
        const networkResponse = new Response("large", {
            status: 200,
            headers: {
                "Content-Type": "image/png",
                "Content-Length": String(3 * 1024 * 1024),
            },
        });
        const clone = vi.spyOn(networkResponse, "clone");
        const { controller, cache, fetchRequest } = setup({
            fetchRequest: async () => networkResponse,
        });
        const response = await controller.handle(eventFor().event);
        expect(await response.text()).toBe("large");
        expect(cache.put).not.toHaveBeenCalled();
        expect(fetchRequest).toHaveBeenCalledTimes(1);
        // One clone is for the consumer. Size verification did not clone/blob.
        expect(clone).toHaveBeenCalledTimes(1);
    });

    it("CORS fetchのthrow時だけopaque fallbackを保存する", async () => {
        const opaque = {
            type: "opaque",
            clone: () => opaque,
        } as unknown as Response;
        const { controller, repository, fetchRequest } = setup({
            fetchRequest: async (request) => {
                if (request.mode === "cors") throw new TypeError("CORS blocked");
                return opaque;
            },
        });
        const response = await controller.handle(eventFor().event);
        expect(response.type).toBe("opaque");
        expect(fetchRequest).toHaveBeenCalledTimes(2);
        expect(fetchRequest.mock.calls[0][0].mode).toBe("cors");
        expect(fetchRequest.mock.calls[1][0].mode).toBe("no-cors");
        expect(repository.metadata.get(imageUrl)).toMatchObject({
            responseType: "opaque",
            verifiedSize: null,
        });
    });

    it("stale再検証失敗では成功metadataとCache responseを維持しlastAttemptAtだけ更新する", async () => {
        const now = CHANNEL_IMAGE_CACHE_TTL_MS + 10;
        const { controller, repository, cache } = setup({
            now,
            fetchRequest: async () => { throw new TypeError("offline"); },
        });
        repository.metadata.set(imageUrl, metadata());
        cache.entries.set(imageUrl, new Response("stale", {
            headers: { "Content-Type": "image/png" },
        }));
        const { event, background } = eventFor();
        const response = await controller.handle(event);
        expect(await response.text()).toBe("stale");
        await Promise.all(background);

        expect(repository.metadata.get(imageUrl)).toEqual({
            ...metadata(),
            lastAttemptAt: now,
        });
        expect(await (await cache.match(imageUrl))?.text()).toBe("stale");
    });

    it("保留中touchが成功したstale再検証metadataを古い値へ戻さない", async () => {
        const options = {
            now: CHANNEL_IMAGE_CACHE_TTL_MS + 10,
            fetchRequest: async () => new Response("new-image", {
                headers: { "Content-Type": "image/png" },
            }),
        };
        const { controller, repository, cache } = setup(options);
        repository.metadata.set(imageUrl, metadata({
            lastAttemptAt: options.now - 1,
        }));
        cache.entries.set(imageUrl, new Response("stale"));

        let releaseTouch!: () => void;
        const pendingTouch = new Promise<void>((resolve) => { releaseTouch = resolve; });
        repository.touchLastAccessedAt.mockImplementationOnce(async (url, accessedAt) => {
            await pendingTouch;
            const current = repository.metadata.get(url);
            if (current && accessedAt > current.lastAccessedAt) {
                repository.metadata.set(url, { ...current, lastAccessedAt: accessedAt });
            }
        });

        const suppressed = eventFor();
        await controller.handle(suppressed.event);
        expect(repository.touchLastAccessedAt).toHaveBeenCalledTimes(1);

        options.now += CHANNEL_IMAGE_CACHE_RETRY_INTERVAL_MS + 1;
        const refresh = eventFor();
        await controller.handle(refresh.event);
        await Promise.all(refresh.background);
        const refreshedAt = options.now;

        releaseTouch();
        await Promise.all(suppressed.background);
        expect(repository.metadata.get(imageUrl)).toMatchObject({
            fetchedAt: refreshedAt,
            lastAttemptAt: refreshedAt,
            responseType: "readable",
            verifiedSize: 9,
        });
    });

    it("保留中touchがstale再検証失敗時のlastAttemptAtを古い値へ戻さない", async () => {
        const options = {
            now: CHANNEL_IMAGE_CACHE_TTL_MS + 10,
            fetchRequest: async () => { throw new TypeError("offline"); },
        };
        const { controller, repository, cache, fetchRequest } = setup(options);
        const successful = metadata({ lastAttemptAt: options.now - 1 });
        repository.metadata.set(imageUrl, successful);
        cache.entries.set(imageUrl, new Response("stale"));

        let releaseTouch!: () => void;
        const pendingTouch = new Promise<void>((resolve) => { releaseTouch = resolve; });
        repository.touchLastAccessedAt.mockImplementationOnce(async (url, accessedAt) => {
            await pendingTouch;
            const current = repository.metadata.get(url);
            if (current && accessedAt > current.lastAccessedAt) {
                repository.metadata.set(url, { ...current, lastAccessedAt: accessedAt });
            }
        });

        const suppressed = eventFor();
        await controller.handle(suppressed.event);
        options.now += CHANNEL_IMAGE_CACHE_RETRY_INTERVAL_MS + 1;
        const refresh = eventFor();
        await controller.handle(refresh.event);
        await Promise.all(refresh.background);
        expect(fetchRequest).toHaveBeenCalledTimes(2);
        const attemptedAt = options.now;

        releaseTouch();
        await Promise.all(suppressed.background);
        expect(repository.metadata.get(imageUrl)).toMatchObject({
            fetchedAt: successful.fetchedAt,
            lastAttemptAt: attemptedAt,
            responseType: successful.responseType,
            verifiedSize: successful.verifiedSize,
        });
    });

    it("同一URLの同時missを1 fetchへdedupeし各consumerへcloneを返す", async () => {
        let resolveFetch!: (response: Response) => void;
        const pending = new Promise<Response>((resolve) => { resolveFetch = resolve; });
        const { controller, fetchRequest, repository } = setup({
            fetchRequest: async () => pending,
        });
        const first = controller.handle(eventFor().event);
        const second = controller.handle(eventFor().event);
        await vi.waitFor(() => expect(fetchRequest).toHaveBeenCalledTimes(1));
        resolveFetch(new Response("shared", {
            headers: { "Content-Type": "image/png" },
        }));
        const [firstResponse, secondResponse] = await Promise.all([first, second]);
        expect(await firstResponse.text()).toBe("shared");
        expect(await secondResponse.text()).toBe("shared");
        expect(repository.getChannelMetadata).toHaveBeenCalledTimes(2);
    });

    it("初回missのCache保存後metadata保存中も孤立Cacheを削除せずin-flightを共有する", async () => {
        const { controller, fetchRequest, repository, cache } = setup();
        let releaseMetadataPut!: () => void;
        let notifyMetadataPutStarted!: () => void;
        const metadataPutStarted = new Promise<void>((resolve) => {
            notifyMetadataPutStarted = resolve;
        });
        const pendingMetadataPut = new Promise<void>((resolve) => {
            releaseMetadataPut = resolve;
        });
        repository.put.mockImplementationOnce(async (record) => {
            notifyMetadataPutStarted();
            await pendingMetadataPut;
            repository.metadata.set(record.url, { ...record });
        });

        const first = controller.handle(eventFor().event);
        await metadataPutStarted;
        expect(await cache.match(imageUrl)).toBeTruthy();
        expect(repository.metadata.has(imageUrl)).toBe(false);

        const second = controller.handle(eventFor().event);
        await vi.waitFor(() => expect(repository.get).toHaveBeenCalledTimes(2));
        expect(cache.delete).not.toHaveBeenCalled();

        releaseMetadataPut();
        const [firstResponse, secondResponse] = await Promise.all([first, second]);
        expect(await firstResponse.text()).toBe("image");
        expect(await secondResponse.text()).toBe("image");
        expect(fetchRequest).toHaveBeenCalledTimes(1);
        expect(await cache.match(imageUrl)).toBeTruthy();
        expect(repository.metadata.has(imageUrl)).toBe(true);
        expect(cache.delete).not.toHaveBeenCalled();
    });

    it("失敗したin-flight Promiseもfinallyで除去して次回試行を可能にする", async () => {
        const options = {
            now: 100,
            fetchRequest: async () => { throw new TypeError("offline"); },
        };
        const { controller, fetchRequest } = setup(options);
        expect((await controller.handle(eventFor().event)).status).toBe(502);
        expect(fetchRequest).toHaveBeenCalledTimes(2);

        options.now += CHANNEL_IMAGE_CACHE_RETRY_INTERVAL_MS + 1;
        expect((await controller.handle(eventFor().event)).status).toBe(502);
        expect(fetchRequest).toHaveBeenCalledTimes(4);
    });

    it("lastAccessedAtのIndexedDB更新を1時間単位にthrottleする", async () => {
        const options = { now: 2 };
        const { controller, repository, cache } = setup(options);
        repository.metadata.set(imageUrl, metadata());
        cache.entries.set(imageUrl, new Response("cached"));

        const first = eventFor();
        await controller.handle(first.event);
        await Promise.all(first.background);
        expect(repository.put).not.toHaveBeenCalled();

        options.now = CHANNEL_IMAGE_CACHE_ACCESS_TOUCH_INTERVAL_MS + 2;
        const second = eventFor();
        await controller.handle(second.event);
        await Promise.all(second.background);
        expect(repository.metadata.get(imageUrl)?.lastAccessedAt).toBe(options.now);
    });

    it("attempt-only metadataのネットワーク再試行時にattemptとaccessを同時更新する", async () => {
        const options = {
            now: CHANNEL_IMAGE_CACHE_RETRY_INTERVAL_MS + 10,
            fetchRequest: async () => { throw new TypeError("offline"); },
        };
        const { controller, repository } = setup(options);
        repository.metadata.set(imageUrl, attemptMetadata({
            lastAttemptAt: 1,
            lastAccessedAt: 2,
        }));

        expect((await controller.handle(eventFor().event)).status).toBe(502);
        expect(repository.markAttemptAndAccess).toHaveBeenCalledWith(imageUrl, options.now);
        expect(repository.metadata.get(imageUrl)).toMatchObject({
            lastAttemptAt: options.now,
            lastAccessedAt: options.now,
            responseType: null,
            fetchedAt: null,
        });
    });

    it("attempt-onlyのretry抑制中は1時間throttleを満たすaccessだけ更新する", async () => {
        const options = { now: CHANNEL_IMAGE_CACHE_ACCESS_TOUCH_INTERVAL_MS + 10 };
        const { controller, repository, fetchRequest } = setup(options);
        repository.metadata.set(imageUrl, attemptMetadata({
            lastAttemptAt: options.now - 1,
            lastAccessedAt: 1,
        }));

        const first = eventFor();
        expect((await controller.handle(first.event)).status).toBe(502);
        await Promise.all(first.background);
        expect(fetchRequest).not.toHaveBeenCalled();
        expect(repository.touchLastAccessedAt).toHaveBeenCalledTimes(1);
        expect(repository.metadata.get(imageUrl)?.lastAccessedAt).toBe(options.now);

        options.now += 100;
        const second = eventFor();
        expect((await controller.handle(second.event)).status).toBe(502);
        await Promise.all(second.background);
        expect(fetchRequest).not.toHaveBeenCalled();
        expect(repository.touchLastAccessedAt).toHaveBeenCalledTimes(1);
        expect(repository.metadata.get(imageUrl)?.lastAccessedAt)
            .toBe(options.now - 100);
    });

    it("最近アクセスしたattempt-only metadataをLRUから守りretry抑制を維持する", async () => {
        const activeUrl = "https://images.example.com/active-failure.png";
        const newUrl = "https://images.example.com/new-failure.png";
        const options = {
            now: 2 * CHANNEL_IMAGE_CACHE_ACCESS_TOUCH_INTERVAL_MS,
            fetchRequest: async () => { throw new TypeError("offline"); },
        };
        const { controller, repository, fetchRequest } = setup(options);
        repository.channel = verifiedChannel({ picture: activeUrl });
        repository.metadata.set(activeUrl, attemptMetadata({
            url: activeUrl,
            lastAttemptAt: options.now - 1,
            lastAccessedAt: 1,
        }));
        for (let index = 0; index < 127; index += 1) {
            const url = `https://images.example.com/unused-${String(index).padStart(3, "0")}.png`;
            repository.metadata.set(url, attemptMetadata({
                url,
                lastAttemptAt: 1,
                lastAccessedAt: index + 2,
            }));
        }

        const access = eventFor(proxyRequest(activeUrl));
        expect((await controller.handle(access.event)).status).toBe(502);
        await Promise.all(access.background);
        expect(fetchRequest).not.toHaveBeenCalled();

        options.now += 1;
        repository.channel = verifiedChannel({ picture: newUrl });
        expect((await controller.handle(eventFor(proxyRequest(newUrl)).event)).status).toBe(502);
        expect(repository.metadata.has(activeUrl)).toBe(true);
        expect(repository.metadata.has(
            "https://images.example.com/unused-000.png",
        )).toBe(false);

        repository.channel = verifiedChannel({ picture: activeUrl });
        const fetchCount = fetchRequest.mock.calls.length;
        expect((await controller.handle(eventFor(proxyRequest(activeUrl)).event)).status).toBe(502);
        expect(fetchRequest).toHaveBeenCalledTimes(fetchCount);
        expect(repository.metadata.has(activeUrl)).toBe(true);
    });

    it("metadata保存失敗時は直前のCache entryをrollbackする", async () => {
        const { controller, repository, cache } = setup();
        repository.put.mockRejectedValue(new Error("idb failed"));
        const response = await controller.handle(eventFor().event);
        expect(await response.text()).toBe("image");
        expect(cache.put).toHaveBeenCalledTimes(1);
        expect(cache.delete).toHaveBeenCalledWith(imageUrl);
        expect(await cache.match(imageUrl)).toBeUndefined();
    });

    it("stale再検証のmetadata保存失敗時は更新前Cache responseと成功metadataを復元する", async () => {
        const now = CHANNEL_IMAGE_CACHE_TTL_MS + 10;
        const { controller, repository, cache } = setup({
            now,
            fetchRequest: async () => new Response("fresh", {
                headers: { "Content-Type": "image/png" },
            }),
        });
        const previous = metadata();
        repository.metadata.set(imageUrl, previous);
        cache.entries.set(imageUrl, new Response("stale"));
        repository.put.mockImplementation(async (record) => {
            if (record.fetchedAt === now) throw new Error("idb failed");
            repository.metadata.set(record.url, { ...record });
        });

        const request = eventFor();
        expect(await (await controller.handle(request.event)).text()).toBe("stale");
        await Promise.all(request.background);

        expect(await (await cache.match(imageUrl))?.text()).toBe("stale");
        expect(repository.metadata.get(imageUrl)).toMatchObject({
            fetchedAt: previous.fetchedAt,
            responseType: previous.responseType,
            verifiedSize: previous.verifiedSize,
            lastAttemptAt: now,
        });
    });

    it("上限整理失敗でも保存済み画像を200で返す", async () => {
        const { controller, repository, cache, logger } = setup();
        repository.getAll.mockRejectedValueOnce(new Error("maintenance failed"));
        const response = await controller.handle(eventFor().event);
        expect(response.status).toBe(200);
        expect(await response.text()).toBe("image");
        expect(await (await cache.match(imageUrl))?.text()).toBe("image");
        expect(repository.metadata.get(imageUrl)?.responseType).toBe("readable");
        expect(logger.error).toHaveBeenCalledWith(
            "Channel image cache limit enforcement failed",
            expect.any(Error),
        );
    });

    it("attempt-only metadataの上限整理失敗でも502契約を維持する", async () => {
        const { controller, repository, logger } = setup({
            fetchRequest: async () => { throw new TypeError("offline"); },
        });
        repository.getAll.mockRejectedValueOnce(new Error("maintenance failed"));
        const response = await controller.handle(eventFor().event);
        expect(response.status).toBe(502);
        expect(repository.metadata.get(imageUrl)).toMatchObject({
            responseType: null,
            fetchedAt: null,
        });
        expect(logger.error).toHaveBeenCalledWith(
            "Channel image cache limit enforcement failed",
            expect.any(Error),
        );
    });

    it("129件の取得失敗でもattempt-only metadataをLRU順で128件以下に保つ", async () => {
        const options = {
            now: 1,
            fetchRequest: async () => { throw new TypeError("offline"); },
        };
        const { controller, repository, cache } = setup(options);
        for (let index = 0; index < 129; index += 1) {
            options.now = index + 1;
            const url = `https://images.example.com/failure-${String(index).padStart(3, "0")}.png`;
            repository.channel = verifiedChannel({ picture: url });
            expect((await controller.handle(eventFor(proxyRequest(url)).event)).status).toBe(502);
        }

        expect(repository.metadata.size).toBeLessThanOrEqual(128);
        expect(repository.metadata.has(
            "https://images.example.com/failure-000.png",
        )).toBe(false);
        expect(repository.metadata.has(
            "https://images.example.com/failure-128.png",
        )).toBe(true);
        expect(cache.put).not.toHaveBeenCalled();
        expect(cache.entries.size).toBe(0);
    });

    it("129件が同時in-flightでも完了後の最終上限整理を1回だけ実行する", async () => {
        const { controller, repository, cache } = setup({
            now: 1,
            fetchRequest: async () => { throw new TypeError("offline"); },
        });
        const channels = new Map<string, ChannelMetadataRecord>();
        repository.getChannelMetadata.mockImplementation(async (id) =>
            channels.get(id) ?? null);

        let getAllStarted = 0;
        let notifyAllStarted!: () => void;
        let releaseGetAll!: () => void;
        let notifyFinalCleanupStarted!: () => void;
        let releaseFinalCleanup!: () => void;
        const allStarted = new Promise<void>((resolve) => { notifyAllStarted = resolve; });
        const getAllGate = new Promise<void>((resolve) => { releaseGetAll = resolve; });
        const finalCleanupStarted = new Promise<void>((resolve) => {
            notifyFinalCleanupStarted = resolve;
        });
        const finalCleanupGate = new Promise<void>((resolve) => {
            releaseFinalCleanup = resolve;
        });
        repository.getAll.mockImplementation(async () => {
            getAllStarted += 1;
            if (getAllStarted === 129) notifyAllStarted();
            if (getAllStarted <= 129) await getAllGate;
            else {
                notifyFinalCleanupStarted();
                await finalCleanupGate;
            }
            return Array.from(repository.metadata.values());
        });

        const requests: Promise<Response>[] = [];
        const events: ReturnType<typeof eventFor>[] = [];
        for (let index = 0; index < 129; index += 1) {
            const id = index.toString(16).padStart(64, "0");
            const url = `https://images.example.com/concurrent-${String(index).padStart(3, "0")}.png`;
            channels.set(id, verifiedChannel({ channelEventId: id, picture: url }));
            const requestEvent = eventFor(proxyRequest(url, id));
            events.push(requestEvent);
            requests.push(controller.handle(requestEvent.event));
        }

        await allStarted;
        expect(repository.metadata.size).toBe(129);
        expect(cache.entries.size).toBe(0);
        releaseGetAll();

        await finalCleanupStarted;
        const responses = await Promise.all(requests);
        expect(responses.every((response) => response.status === 502)).toBe(true);
        expect(repository.metadata.size).toBe(129);
        const background = events.flatMap((requestEvent) => requestEvent.background);
        expect(background).toHaveLength(1);

        releaseFinalCleanup();
        await Promise.all(background);
        expect(repository.metadata.size).toBeLessThanOrEqual(128);
        expect(repository.metadata.has(
            "https://images.example.com/concurrent-000.png",
        )).toBe(false);
        expect(repository.getAll).toHaveBeenCalledTimes(130);
        expect(cache.entries.size).toBe(0);
    });

    it("final cleanup失敗を502 Responseへ伝播させない", async () => {
        const { controller, repository, logger, fetchRequest } = setup({
            now: 1,
            fetchRequest: async () => { throw new TypeError("offline"); },
        });
        const channels = new Map<string, ChannelMetadataRecord>();
        repository.getChannelMetadata.mockImplementation(async (id) =>
            channels.get(id) ?? null);

        let getAllStarted = 0;
        let notifyAllStarted!: () => void;
        let releaseGetAll!: () => void;
        const allStarted = new Promise<void>((resolve) => { notifyAllStarted = resolve; });
        const getAllGate = new Promise<void>((resolve) => { releaseGetAll = resolve; });
        repository.getAll.mockImplementation(async () => {
            getAllStarted += 1;
            if (getAllStarted === 129) notifyAllStarted();
            if (getAllStarted <= 129) {
                await getAllGate;
                return Array.from(repository.metadata.values());
            }
            if (getAllStarted === 130) throw new Error("final cleanup failed");
            return Array.from(repository.metadata.values());
        });

        const events: ReturnType<typeof eventFor>[] = [];
        const requests: Promise<Response>[] = [];
        for (let index = 0; index < 129; index += 1) {
            const id = (index + 256).toString(16).padStart(64, "0");
            const url = `https://images.example.com/final-error-${String(index).padStart(3, "0")}.png`;
            channels.set(id, verifiedChannel({ channelEventId: id, picture: url }));
            const requestEvent = eventFor(proxyRequest(url, id));
            events.push(requestEvent);
            requests.push(controller.handle(requestEvent.event));
        }

        await allStarted;
        releaseGetAll();
        const responses = await Promise.all(requests);
        expect(responses.every((response) => response.status === 502)).toBe(true);
        const background = events.flatMap((requestEvent) => requestEvent.background);
        expect(background).toHaveLength(1);
        await Promise.all(background);
        expect(repository.metadata.size).toBe(129);
        expect(logger.error).toHaveBeenCalledWith(
            "Channel image final cache limit enforcement failed",
            expect.any(Error),
        );
        expect(logger.error).toHaveBeenCalledTimes(1);

        const retryUrl = "https://images.example.com/final-error-000.png";
        const retryId = (256).toString(16).padStart(64, "0");
        const fetchCount = fetchRequest.mock.calls.length;
        const retryEvent = eventFor(proxyRequest(retryUrl, retryId));
        expect((await controller.handle(retryEvent.event)).status).toBe(502);
        expect(fetchRequest).toHaveBeenCalledTimes(fetchCount);
        expect(retryEvent.background).toHaveLength(2);
        await Promise.all(retryEvent.background);
        expect(repository.metadata.size).toBeLessThanOrEqual(128);
        expect(getAllStarted).toBe(131);
        expect(logger.error).toHaveBeenCalledTimes(1);
    });

    it("active解除がcleanupのfinally直前でもpending cleanupを再予約する", async () => {
        const options = { now: 1 };
        const { controller, repository, cache } = setup(options);
        const channels = new Map<string, ChannelMetadataRecord>();
        repository.getChannelMetadata.mockImplementation(async (id) =>
            channels.get(id) ?? null);

        let getAllCount = 0;
        let notifyInitialLimitsStarted!: () => void;
        let releaseInitialLimits!: () => void;
        let notifyFinalStarted!: () => void;
        let releaseFinalGetAll!: () => void;
        const initialLimitsStarted = new Promise<void>((resolve) => {
            notifyInitialLimitsStarted = resolve;
        });
        const initialLimitsGate = new Promise<void>((resolve) => {
            releaseInitialLimits = resolve;
        });
        const finalStarted = new Promise<void>((resolve) => { notifyFinalStarted = resolve; });
        const finalGetAllGate = new Promise<void>((resolve) => {
            releaseFinalGetAll = resolve;
        });
        repository.getAll.mockImplementation(async () => {
            getAllCount += 1;
            if (getAllCount === 129) notifyInitialLimitsStarted();
            if (getAllCount <= 129) await initialLimitsGate;
            else if (getAllCount === 130) {
                notifyFinalStarted();
                await finalGetAllGate;
            }
            return Array.from(repository.metadata.values());
        });

        const initialEvents: ReturnType<typeof eventFor>[] = [];
        const initialRequests: Promise<Response>[] = [];
        for (let index = 0; index < 129; index += 1) {
            const id = (index + 1024).toString(16).padStart(64, "0");
            const url = `https://images.example.com/reschedule-prepare-${String(index).padStart(3, "0")}.png`;
            channels.set(id, verifiedChannel({ channelEventId: id, picture: url }));
            const requestEvent = eventFor(proxyRequest(url, id));
            initialEvents.push(requestEvent);
            initialRequests.push(controller.handle(requestEvent.event));
        }
        await initialLimitsStarted;
        releaseInitialLimits();
        await finalStarted;
        expect((await Promise.all(initialRequests)).every((response) =>
            response.status === 200)).toBe(true);

        repository.metadata.clear();
        cache.entries.clear();
        channels.clear();
        const targetUrls: string[] = [];
        for (let index = 0; index < 129; index += 1) {
            const url = `https://images.example.com/reschedule-active-${String(index).padStart(3, "0")}.png`;
            repository.metadata.set(url, attemptMetadata({
                url,
                lastAttemptAt: options.now,
                lastAccessedAt: options.now,
            }));
            targetUrls.push(url);
        }

        type ControllerInternals = {
            retainActiveUrl: (url: string) => void;
            releaseActiveUrl: (
                url: string,
                registerBackground: (promise: Promise<unknown>) => void,
            ) => void;
            pendingFinalLimitCleanupCache: Cache | null;
        };
        const internals = controller as unknown as ControllerInternals;
        for (const url of targetUrls) internals.retainActiveUrl(url);
        const releaseBackground: Promise<unknown>[] = [];
        let pendingCache = internals.pendingFinalLimitCleanupCache;
        let releaseQueued = false;
        Object.defineProperty(internals, "pendingFinalLimitCleanupCache", {
            configurable: true,
            get: () => pendingCache,
            set: (value: Cache | null) => {
                pendingCache = value;
                if (value && !releaseQueued) {
                    releaseQueued = true;
                    // cleanupがpendingを戻してループを抜けた後、finallyより先にactiveを解除する。
                    // release側では既存cleanupが残っているため、ここでは再cleanupを開始できない。
                    queueMicrotask(() => {
                        for (const targetUrl of targetUrls) {
                            internals.releaseActiveUrl(
                                targetUrl,
                                (promise) => releaseBackground.push(promise),
                            );
                        }
                    });
                }
            },
        });

        releaseFinalGetAll();
        const firstCleanup = initialEvents.flatMap(
            (requestEvent) => requestEvent.background,
        )[0];
        await firstCleanup;
        expect(releaseBackground).toHaveLength(0);
        const background = initialEvents.flatMap(
            (requestEvent) => requestEvent.background,
        );
        expect(background).toHaveLength(2);
        await Promise.all(background);

        expect(repository.metadata.size).toBeLessThanOrEqual(128);
        expect(getAllCount).toBe(131);
    });

    it("final cleanup中に開始したactive URLを守り完了後に別のLRUを削除する", async () => {
        const options = {
            now: CHANNEL_IMAGE_CACHE_TTL_MS + 10,
            fetchRequest: async () => { throw new TypeError("offline"); },
        };
        const { controller, repository, cache } = setup(options);
        const channels = new Map<string, ChannelMetadataRecord>();
        repository.getChannelMetadata.mockImplementation(async (id) =>
            channels.get(id) ?? null);

        let getAllCount = 0;
        let notifyInitialLimitsStarted!: () => void;
        let releaseInitialLimits!: () => void;
        let notifyFinalStarted!: () => void;
        let releaseFinalGetAll!: () => void;
        const initialLimitsStarted = new Promise<void>((resolve) => {
            notifyInitialLimitsStarted = resolve;
        });
        const initialLimitsGate = new Promise<void>((resolve) => {
            releaseInitialLimits = resolve;
        });
        const finalStarted = new Promise<void>((resolve) => { notifyFinalStarted = resolve; });
        const finalGetAllGate = new Promise<void>((resolve) => {
            releaseFinalGetAll = resolve;
        });
        repository.getAll.mockImplementation(async () => {
            getAllCount += 1;
            if (getAllCount === 129) notifyInitialLimitsStarted();
            if (getAllCount <= 129) await initialLimitsGate;
            else if (getAllCount === 130) {
                notifyFinalStarted();
                await finalGetAllGate;
            }
            return Array.from(repository.metadata.values());
        });

        const initialEvents: ReturnType<typeof eventFor>[] = [];
        const initialRequests: Promise<Response>[] = [];
        for (let index = 0; index < 129; index += 1) {
            const id = (index + 512).toString(16).padStart(64, "0");
            const url = `https://images.example.com/prepare-${String(index).padStart(3, "0")}.png`;
            channels.set(id, verifiedChannel({ channelEventId: id, picture: url }));
            const requestEvent = eventFor(proxyRequest(url, id));
            initialEvents.push(requestEvent);
            initialRequests.push(controller.handle(requestEvent.event));
        }
        await initialLimitsStarted;
        releaseInitialLimits();
        await finalStarted;
        expect((await Promise.all(initialRequests)).every((response) =>
            response.status === 502)).toBe(true);

        repository.metadata.clear();
        cache.entries.clear();
        channels.clear();
        const staleUrl = "https://images.example.com/active-oldest.png";
        const staleId = "f".repeat(64);
        repository.metadata.set(staleUrl, metadata({
            url: staleUrl,
            fetchedAt: 1,
            lastAttemptAt: 1,
            lastAccessedAt: 0,
        }));
        cache.entries.set(staleUrl, new Response("stale", {
            headers: { "Content-Type": "image/png" },
        }));
        channels.set(staleId, verifiedChannel({ channelEventId: staleId, picture: staleUrl }));

        const attemptTargets: Array<{ id: string; url: string }> = [];
        for (let index = 0; index < 128; index += 1) {
            const id = (index + 768).toString(16).padStart(64, "0");
            const url = `https://images.example.com/active-attempt-${String(index).padStart(3, "0")}.png`;
            repository.metadata.set(url, attemptMetadata({
                url,
                lastAttemptAt: options.now - 1,
                lastAccessedAt: 1,
            }));
            channels.set(id, verifiedChannel({ channelEventId: id, picture: url }));
            attemptTargets.push({ id, url });
        }

        let activeLookupsStarted = 0;
        let notifyActiveLookupsStarted!: () => void;
        let releaseAttemptLookups!: () => void;
        let releaseStaleLookup!: () => void;
        const activeLookupsStartedPromise = new Promise<void>((resolve) => {
            notifyActiveLookupsStarted = resolve;
        });
        const attemptLookupGate = new Promise<void>((resolve) => {
            releaseAttemptLookups = resolve;
        });
        const staleLookupGate = new Promise<void>((resolve) => {
            releaseStaleLookup = resolve;
        });
        repository.get.mockImplementation(async (url) => {
            activeLookupsStarted += 1;
            if (activeLookupsStarted === 129) notifyActiveLookupsStarted();
            if (url === staleUrl) await staleLookupGate;
            else await attemptLookupGate;
            return repository.metadata.get(url) ?? null;
        });
        const attemptRequests = attemptTargets.map(({ id, url }) =>
            controller.handle(eventFor(proxyRequest(url, id)).event));
        const staleEvent = eventFor(proxyRequest(staleUrl, staleId));
        const staleRequest = controller.handle(staleEvent.event);

        await activeLookupsStartedPromise;
        releaseFinalGetAll();
        await Promise.all(initialEvents.flatMap((requestEvent) => requestEvent.background));
        expect(repository.metadata.has(staleUrl)).toBe(true);
        expect(await cache.match(staleUrl)).toBeTruthy();

        releaseAttemptLookups();
        expect((await Promise.all(attemptRequests)).every((response) =>
            response.status === 502)).toBe(true);
        releaseStaleLookup();
        expect(await (await staleRequest).text()).toBe("stale");
        await staleEvent.background[0];
        await Promise.all(staleEvent.background);

        expect(repository.metadata.has(staleUrl)).toBe(true);
        expect(await (await cache.match(staleUrl))?.text()).toBe("stale");
        expect(repository.metadata.get(staleUrl)).toMatchObject({
            fetchedAt: 1,
            responseType: "readable",
            verifiedSize: 5,
            lastAttemptAt: options.now,
        });
        expect(repository.metadata.has(
            "https://images.example.com/active-attempt-000.png",
        )).toBe(false);
        expect(repository.metadata.size).toBeLessThanOrEqual(128);
        expect(getAllCount).toBe(132);
    });

    it("同一時刻LRUはURLでtie-breakし、保存処理中URLをevictionしない", async () => {
        const { controller, repository, cache } = setup({ now: 10 });
        repository.channel = verifiedChannel({
            picture: "https://images.example.com/000.png",
        });
        for (let index = 1; index <= 128; index += 1) {
            const url = `https://images.example.com/${String(index).padStart(3, "0")}.png`;
            repository.metadata.set(url, metadata({ url, lastAccessedAt: 1 }));
            cache.entries.set(url, new Response("old", {
                headers: { "Content-Type": "image/png" },
            }));
        }
        const currentUrl = "https://images.example.com/000.png";
        await controller.handle(eventFor(proxyRequest(currentUrl)).event);
        expect(await cache.match(currentUrl)).toBeTruthy();
        expect(await cache.match("https://images.example.com/001.png")).toBeUndefined();
        expect(await cache.match("https://images.example.com/002.png")).toBeTruthy();
    });

    it("32 MiB定数はreadable確認済み合計専用として公開する", () => {
        expect(CHANNEL_IMAGE_CACHE_MAX_READABLE_TOTAL_BYTES).toBe(32 * 1024 * 1024);
    });

    it("reconciliationでreadable確認済み合計32 MiBをLRU削除する", async () => {
        const { controller, repository, cache } = setup();
        for (let index = 0; index < 17; index += 1) {
            const url = `https://images.example.com/readable-${index}.png`;
            repository.metadata.set(url, metadata({
                url,
                verifiedSize: 2 * 1024 * 1024,
                lastAccessedAt: index,
            }));
            cache.entries.set(url, new Response("small"));
        }
        await controller.reconcile();
        expect(await cache.match("https://images.example.com/readable-0.png"))
            .toBeUndefined();
        expect(repository.metadata.size).toBe(16);
    });

    it("reconciliationでopaqueを16件へ制限する", async () => {
        const { controller, repository, cache } = setup();
        for (let index = 0; index <= CHANNEL_IMAGE_CACHE_MAX_OPAQUE_ENTRIES; index += 1) {
            const url = `https://images.example.com/opaque-${index}.png`;
            repository.metadata.set(url, metadata({
                url,
                responseType: "opaque",
                verifiedSize: null,
                lastAccessedAt: index,
            }));
            cache.entries.set(url, new Response("small"));
        }
        await controller.reconcile();
        expect(await cache.match("https://images.example.com/opaque-0.png"))
            .toBeUndefined();
        expect(repository.metadata.size).toBe(CHANNEL_IMAGE_CACHE_MAX_OPAQUE_ENTRIES);
    });

    it("activate reconciliationでCacheのみとmetadataのみの孤立状態を修復する", async () => {
        const { controller, repository, cache } = setup();
        const cacheOnly = "https://images.example.com/cache-only.png";
        const metadataOnly = "https://images.example.com/meta-only.png";
        cache.entries.set(cacheOnly, new Response("orphan"));
        repository.metadata.set(metadataOnly, metadata({ url: metadataOnly }));

        await controller.reconcile();

        expect(await cache.match(cacheOnly)).toBeUndefined();
        expect(repository.metadata.get(metadataOnly)).toMatchObject({
            responseType: null,
            verifiedSize: null,
            fetchedAt: null,
        });
    });
});
