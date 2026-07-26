import { describe, expect, it, vi } from "vitest";
import type {
    ChannelImageCacheMetaRecord,
    ChannelMetadataRecord,
} from "../../lib/storage/ehagakiDb";
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

    async match(request: RequestInfo | URL): Promise<Response | undefined> {
        return this.entries.get(this.key(request))?.clone();
    }

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
    readonly getChannelMetadata = vi.fn(async () => this.channel);
    readonly get = vi.fn(async (url: string) => this.metadata.get(url) ?? null);
    readonly getAll = vi.fn(async () => Array.from(this.metadata.values()));
    readonly put = vi.fn(async (record: ChannelImageCacheMetaRecord) => {
        this.metadata.set(record.url, { ...record });
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
        schemaVersion: 2,
        ...overrides,
    };
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
    const controller = new ChannelImageCacheController({
        cacheStorage: { open: vi.fn(async () => cache) } as unknown as CacheStorage,
        fetchRequest,
        repository,
        currentOrigin: origin,
        basePath,
        now: () => options.now ?? 100,
        logger: { error: vi.fn() },
    });
    return { cache, repository, fetchRequest, controller };
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
        null,
        verifiedChannel({ resolutionQuality: "verified-root-only" }),
        verifiedChannel({ picture: "https://images.example.com/other.png" }),
    ])("永続verified metadataと一致しなければfetchしない", async (channel) => {
        const { controller, repository, fetchRequest } = setup();
        repository.channel = channel;
        const { event } = eventFor();
        const response = await controller.handle(event);
        expect(response.status).toBe(403);
        expect(fetchRequest).not.toHaveBeenCalled();
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

    it("metadata保存失敗時は直前のCache entryをrollbackする", async () => {
        const { controller, repository, cache } = setup();
        repository.put.mockRejectedValue(new Error("idb failed"));
        const response = await controller.handle(eventFor().event);
        expect(await response.text()).toBe("image");
        expect(cache.put).toHaveBeenCalledTimes(1);
        expect(cache.delete).toHaveBeenCalledWith(imageUrl);
        expect(await cache.match(imageUrl)).toBeUndefined();
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
