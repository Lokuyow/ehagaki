import { createCorsRequest } from "./swUtilities";
import { normalizeUploadMediaImageUrl, isUploadMediaImageProxyUrl } from "./uploadMediaImageUrl";
import {
    UPLOAD_MEDIA_IMAGE_CACHE_NAME, UPLOAD_MEDIA_IMAGE_META_CACHE_NAME,
    UPLOAD_MEDIA_IMAGE_CACHE_POLICY as policy, UPLOAD_MEDIA_IMAGE_CACHE_VERSION,
    UPLOAD_MEDIA_IMAGE_LEGACY_CACHE_NAMES,
} from "./uploadMediaImageCachePolicy";

export interface UploadMediaImageMeta {
    schemaVersion: number;
    url: string;
    responseType: "readable" | "opaque";
    verifiedSize: number | null;
    fetchedAt: number;
    lastAttemptAt: number;
    lastAccessedAt: number;
}
interface FetchEventLike { request: Request; waitUntil: (promise: Promise<unknown>) => void }
interface Dependencies {
    cacheStorage: CacheStorage;
    fetchRequest: (request: Request) => Promise<Response>;
    currentOrigin: string;
    basePath: string;
    now?: () => number;
}
interface Flight { response: Promise<Response>; done: Promise<void>; invalidated: boolean }
interface CachePair { body: Cache; meta: Cache }

function errorResponse(status: number): Response {
    return new Response("Image preview unavailable", { status, headers: { "Cache-Control": "no-store" } });
}
function cacheKey(url: string): Request {
    return createCorsRequest(url, { credentials: "omit", referrerPolicy: "no-referrer" });
}
function validMeta(value: unknown, url: string): value is UploadMediaImageMeta {
    if (!value || typeof value !== "object") return false;
    const meta = value as UploadMediaImageMeta;
    return meta.schemaVersion === UPLOAD_MEDIA_IMAGE_CACHE_VERSION && meta.url === url
        && (meta.responseType === "opaque" ? meta.verifiedSize === null
            : meta.responseType === "readable" && Number.isSafeInteger(meta.verifiedSize)
                && meta.verifiedSize! >= 0 && meta.verifiedSize! <= policy.maxReadableImageBytes)
        && [meta.fetchedAt, meta.lastAttemptAt, meta.lastAccessedAt].every((n) => Number.isFinite(n) && n >= 0);
}
function retained(meta: UploadMediaImageMeta, now: number): boolean {
    return now - meta.fetchedAt < (meta.responseType === "opaque" ? policy.opaqueRetainMs : policy.readableRetainMs);
}

/** Owns only unauthenticated upload-management image previews, never videos. */
export class UploadMediaImageCacheController {
    private readonly inFlight = new Map<string, Flight>();
    private readonly evictions = new Map<string, Promise<boolean>>();
    private writes: Promise<void> = Promise.resolve();
    private reconciled = false;
    private reconciliation: Promise<void> | null = null;
    private readonly now: () => number;
    constructor(private readonly deps: Dependencies) { this.now = deps.now ?? Date.now; }

    private serialize<T>(operation: () => Promise<T>): Promise<T> {
        const result = this.writes.then(operation);
        this.writes = result.then(() => undefined, () => undefined);
        return result;
    }
    private async open(): Promise<CachePair> {
        const [body, meta] = await Promise.all([
            this.deps.cacheStorage.open(UPLOAD_MEDIA_IMAGE_CACHE_NAME),
            this.deps.cacheStorage.open(UPLOAD_MEDIA_IMAGE_META_CACHE_NAME),
        ]);
        return { body, meta };
    }
    private async readMeta(pair: CachePair, url: string): Promise<UploadMediaImageMeta | null> {
        const response = await pair.meta.match(cacheKey(url));
        if (!response) return null;
        let data: unknown;
        try { data = await response.json(); } catch { return null; }
        return validMeta(data, url) ? data : null;
    }
    private async putMeta(pair: CachePair, meta: UploadMediaImageMeta): Promise<void> {
        await pair.meta.put(cacheKey(meta.url), new Response(JSON.stringify(meta), { headers: { "Content-Type": "application/json" } }));
    }
    private async deletePair(pair: CachePair, url: string): Promise<void> {
        const results = await Promise.allSettled([pair.body.delete(cacheKey(url)), pair.meta.delete(cacheKey(url))]);
        if (results.some((result) => result.status === "rejected")) throw new Error("Cache cleanup failed");
    }
    private async touch(pair: CachePair, url: string, attempted = false): Promise<void> {
        await this.serialize(async () => {
            const current = await this.readMeta(pair, url);
            if (!current) return;
            const now = this.now();
            if (!attempted && now - current.lastAccessedAt < policy.touchMs) return;
            await this.putMeta(pair, { ...current, lastAccessedAt: Math.max(now, current.lastAccessedAt),
                lastAttemptAt: attempted ? Math.max(now, current.lastAttemptAt) : current.lastAttemptAt });
        });
    }
    async handle(event: FetchEventLike): Promise<Response> {
        const proxy = new URL(event.request.url);
        if (event.request.method !== "GET" || event.request.destination !== "image"
            || !isUploadMediaImageProxyUrl(proxy, this.deps.currentOrigin, this.deps.basePath)) return errorResponse(400);
        const server = proxy.searchParams.get("server") ?? "";
        const url = normalizeUploadMediaImageUrl(proxy.searchParams.get("url") ?? "", server, new URL(this.deps.currentOrigin).protocol);
        if (!url) return errorResponse(400);
        await this.evictions.get(url);
        let pair: CachePair | null = null;
        try {
            if (!this.reconciled) await this.reconcile();
            pair = await this.open();
            const [cached, meta] = await Promise.all([pair.body.match(cacheKey(url)), this.readMeta(pair, url)]);
            if (cached && meta && retained(meta, this.now())) {
                const freshness = meta.responseType === "opaque" ? policy.opaqueFreshMs : policy.readableFreshMs;
                if (this.now() - meta.fetchedAt < freshness) {
                    event.waitUntil(this.touch(pair, url).catch(() => undefined));
                    return cached;
                }
                if (meta.lastAttemptAt <= meta.fetchedAt || this.now() - meta.lastAttemptAt >= policy.retryMs) {
                    const refresh = this.flight(url, server, pair, event);
                    event.waitUntil(refresh.done);
                } else event.waitUntil(this.touch(pair, url).catch(() => undefined));
                return cached;
            }
            if ((cached || meta) && !this.inFlight.has(url)) {
                await this.serialize(() => this.deletePair(pair!, url));
            }
        } catch { pair = null; /* Cache failure must not turn a good network image into an error. */ }
        try { return (await this.flight(url, server, pair, event).response).clone(); }
        catch { return errorResponse(502); }
    }
    private flight(url: string, server: string, pair: CachePair | null, event: FetchEventLike): Flight {
        const existing = this.inFlight.get(url);
        if (existing) { event.waitUntil(existing.done); return existing; }
        const flight: Flight = { response: this.fetchImage(url), done: Promise.resolve(), invalidated: false };
        flight.done = flight.response.then(async (response) => {
            if (!pair || flight.invalidated) return;
            // A readable redirect target is checked with the same URL policy.
            if (response.url && !normalizeUploadMediaImageUrl(response.url, server, new URL(this.deps.currentOrigin).protocol)) return;
            await this.store(pair, url, response, flight);
        }).catch(async () => {
            if (pair && !flight.invalidated) await this.touch(pair, url, true).catch(() => undefined);
        }).finally(() => { if (this.inFlight.get(url) === flight) this.inFlight.delete(url); });
        this.inFlight.set(url, flight);
        event.waitUntil(flight.done);
        return flight;
    }
    private async fetchImage(url: string): Promise<Response> {
        try {
            return await this.deps.fetchRequest(createCorsRequest(url, {
                mode: "cors", cache: "reload", credentials: "omit", referrerPolicy: "no-referrer",
            }));
        } catch {
            return await this.deps.fetchRequest(createCorsRequest(url, {
                mode: "no-cors", cache: "reload", credentials: "omit", referrerPolicy: "no-referrer",
            }));
        }
    }
    private async verifiedSize(response: Response): Promise<number | null> {
        const length = Number(response.headers.get("Content-Length"));
        if (Number.isFinite(length) && length > policy.maxReadableImageBytes) return null;
        const reader = response.clone().body?.getReader();
        if (!reader) return 0;
        let size = 0;
        try {
            while (true) {
                const chunk = await reader.read();
                if (chunk.done) return size;
                size += chunk.value.byteLength;
                if (size > policy.maxReadableImageBytes) {
                    // Do not await cancellation of one branch of a tee while the display branch is active.
                    void reader.cancel().catch(() => undefined);
                    return null;
                }
            }
        } finally { reader.releaseLock(); }
    }
    private async store(pair: CachePair, url: string, response: Response, flight: Flight): Promise<void> {
        const opaque = response.type === "opaque";
        let size: number | null = null;
        if (!opaque) {
            if (response.status !== 200 || !/^image\/[a-z0-9!#$&^_.+-]+$/.test((response.headers.get("Content-Type") ?? "").split(";")[0].trim().toLowerCase())
                || /(?:^|,)\s*no-store(?:\s|,|$)/i.test(response.headers.get("Cache-Control") ?? "")) {
                await this.touch(pair, url, true).catch(() => undefined);
                return;
            }
            size = await this.verifiedSize(response);
            if (size === null) { await this.touch(pair, url, true).catch(() => undefined); return; }
        }
        await this.serialize(async () => {
            if (flight.invalidated) return;
            const now = this.now();
            const previous = await this.readMeta(pair, url);
            const rollback = previous ? await pair.body.match(cacheKey(url)) : undefined;
            const meta: UploadMediaImageMeta = {
                schemaVersion: UPLOAD_MEDIA_IMAGE_CACHE_VERSION, url, responseType: opaque ? "opaque" : "readable",
                verifiedSize: size, fetchedAt: now, lastAttemptAt: now, lastAccessedAt: now,
            };
            if (!await this.makeRoom(pair, meta) || flight.invalidated) return;
            // Remove the old commit marker before replacing its body. Even a
            // failed rollback/cleanup must not leave a new body paired with old size/TTL metadata.
            await pair.meta.delete(cacheKey(url));
            await pair.body.put(cacheKey(url), response.clone());
            try { await this.putMeta(pair, meta); }
            catch {
                if (rollback && previous) {
                    try { await pair.body.put(cacheKey(url), rollback); await this.putMeta(pair, previous); }
                    catch { await this.deletePair(pair, url).catch(() => undefined); }
                } else await this.deletePair(pair, url).catch(() => undefined);
            }
        });
    }
    private async records(pair: CachePair): Promise<UploadMediaImageMeta[]> {
        const records: UploadMediaImageMeta[] = [];
        for (const key of await pair.meta.keys()) {
            const meta = await this.readMeta(pair, key.url);
            if (!meta || !retained(meta, this.now()) || !await pair.body.match(cacheKey(key.url))) {
                if (!this.inFlight.has(key.url)) await this.deletePair(pair, key.url);
            } else records.push(meta);
        }
        for (const key of await pair.body.keys()) {
            if (!records.some((entry) => entry.url === key.url) && !this.inFlight.has(key.url)) await pair.body.delete(key);
        }
        return records.sort((a, b) => a.lastAccessedAt - b.lastAccessedAt || a.url.localeCompare(b.url));
    }
    private async makeRoom(pair: CachePair, incoming?: UploadMediaImageMeta): Promise<boolean> {
        const records = (await this.records(pair)).filter((record) => record.url !== incoming?.url);
        const over = () => {
            const all = incoming ? [...records, incoming] : records;
            return all.length > policy.maxEntries
                || all.filter((entry) => entry.responseType === "opaque").length > policy.maxOpaqueEntries
                || all.reduce((total, entry) => total + (entry.verifiedSize ?? 0), 0) > policy.maxReadableTotalBytes;
        };
        while (over()) {
            const index = records.findIndex((entry) => !this.inFlight.has(entry.url));
            if (index < 0) return false;
            await this.deletePair(pair, records[index].url);
            records.splice(index, 1);
        }
        return true;
    }
    async reconcile(): Promise<void> {
        if (this.reconciliation) return this.reconciliation;
        this.reconciliation = this.serialize(async () => {
            for (const name of UPLOAD_MEDIA_IMAGE_LEGACY_CACHE_NAMES) await this.deps.cacheStorage.delete(name);
            await this.makeRoom(await this.open());
            this.reconciled = true;
        }).finally(() => { this.reconciliation = null; });
        return this.reconciliation;
    }
    async evict(urls: string[]): Promise<boolean> {
        if (urls.length > policy.maxEntries || urls.some((url) => {
            try { const parsed = new URL(url); return !["http:", "https:"].includes(parsed.protocol) || Boolean(parsed.username || parsed.password); }
            catch { return true; }
        })) return false;
        const keys = [...new Set(urls.map((url) => { const parsed = new URL(url); parsed.hash = ""; return parsed.toString(); }))];
        for (const url of keys) {
            const flight = this.inFlight.get(url);
            if (flight) { flight.invalidated = true; this.inFlight.delete(url); }
        }
        const operation = this.serialize(async () => {
            const pair = await this.open();
            const results = await Promise.allSettled(keys.map((url) => this.deletePair(pair, url)));
            return results.every((result) => result.status === "fulfilled");
        }).catch(() => false);
        for (const key of keys) this.evictions.set(key, operation);
        try { return await operation; }
        finally { for (const key of keys) if (this.evictions.get(key) === operation) this.evictions.delete(key); }
    }
}
