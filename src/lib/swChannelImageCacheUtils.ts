import {
    isChannelEventId,
    normalizeChannelPictureUrl,
} from "./channelPictureUrlUtils";
import type { ChannelImageCacheMetaRecord } from "./storage/ehagakiDb";
import type { ChannelImageMetaRepository } from "./swChannelImageMetaRepository";

export const CHANNEL_IMAGE_CACHE_NAME = "ehagaki-channel-images-v1";
export const CHANNEL_IMAGE_CACHE_META_SCHEMA_VERSION = 1;
export const CHANNEL_IMAGE_CACHE_MAX_READABLE_IMAGE_BYTES = 2 * 1024 * 1024;
// This is only the sum of readable (basic/CORS) responses with verified sizes.
// Opaque response bytes are unknowable and are controlled by a separate count.
export const CHANNEL_IMAGE_CACHE_MAX_READABLE_TOTAL_BYTES = 32 * 1024 * 1024;
export const CHANNEL_IMAGE_CACHE_MAX_OPAQUE_ENTRIES = 16;
export const CHANNEL_IMAGE_CACHE_MAX_ENTRIES = 128;
export const CHANNEL_IMAGE_CACHE_META_MAX_RECORDS = 128;
export const CHANNEL_IMAGE_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
export const CHANNEL_IMAGE_CACHE_RETRY_INTERVAL_MS = 15 * 60 * 1000;
export const CHANNEL_IMAGE_CACHE_ACCESS_TOUCH_INTERVAL_MS = 60 * 60 * 1000;

export interface ChannelImageFetchEventLike {
    request: Request;
    waitUntil: (promise: Promise<unknown>) => void;
}

interface ChannelImageCacheControllerDependencies {
    cacheStorage: CacheStorage;
    fetchRequest: (request: Request) => Promise<Response>;
    repository: ChannelImageMetaRepository;
    currentOrigin: string;
    basePath: string;
    now?: () => number;
    logger?: Pick<Console, "error">;
}

type ParsedProxyRequest =
    | { ok: true; eventId: string; normalizedUrl: string }
    | { ok: false };

function errorResponse(status: number, message: string): Response {
    return new Response(message, {
        status,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
}

function sortByAccessThenUrl(
    first: ChannelImageCacheMetaRecord,
    second: ChannelImageCacheMetaRecord,
): number {
    const accessedOrder = first.lastAccessedAt - second.lastAccessedAt;
    if (accessedOrder !== 0) return accessedOrder;
    return first.url < second.url ? -1 : first.url > second.url ? 1 : 0;
}

export function isChannelImageProxyUrl(
    url: URL,
    currentOrigin: string,
    basePath: string,
): boolean {
    const normalizedBase = basePath.endsWith("/") ? basePath : `${basePath}/`;
    return url.origin === currentOrigin
        && url.pathname === `${normalizedBase}__ehagaki-image/channel`;
}

export class ChannelImageCacheController {
    private readonly now: () => number;
    private readonly logger: Pick<Console, "error">;
    private readonly inFlight = new Map<string, Promise<Response>>();

    constructor(private readonly deps: ChannelImageCacheControllerDependencies) {
        this.now = deps.now ?? Date.now;
        this.logger = deps.logger ?? console;
    }

    private parseProxyRequest(request: Request): ParsedProxyRequest {
        if (request.method !== "GET") return { ok: false };
        const url = new URL(request.url);
        if (!isChannelImageProxyUrl(url, this.deps.currentOrigin, this.deps.basePath)) {
            return { ok: false };
        }
        const eventId = url.searchParams.get("eventId") ?? "";
        const normalizedUrl = normalizeChannelPictureUrl(
            url.searchParams.get("url") ?? "",
            { currentOrigin: this.deps.currentOrigin },
        );
        if (!isChannelEventId(eventId) || !normalizedUrl) return { ok: false };
        return { ok: true, eventId, normalizedUrl };
    }

    private async authorize(eventId: string, normalizedUrl: string): Promise<boolean> {
        const channel = await this.deps.repository.getChannelMetadata(eventId);
        if (!channel || channel.resolutionQuality !== "verified-metadata") return false;
        const storedPicture = channel.picture
            ? normalizeChannelPictureUrl(channel.picture, {
                currentOrigin: this.deps.currentOrigin,
            })
            : null;
        return storedPicture === normalizedUrl;
    }

    async handle(event: ChannelImageFetchEventLike): Promise<Response> {
        const parsed = this.parseProxyRequest(event.request);
        if (!parsed.ok) return errorResponse(400, "Invalid channel image request");

        try {
            if (!await this.authorize(parsed.eventId, parsed.normalizedUrl)) {
                return errorResponse(403, "Channel image is not authorized");
            }
        } catch (error) {
            this.logger.error("Channel image authorization failed", error);
            return errorResponse(503, "Channel image authorization unavailable");
        }

        const cache = await this.deps.cacheStorage.open(CHANNEL_IMAGE_CACHE_NAME);
        let metadata: ChannelImageCacheMetaRecord | null = null;
        let cachedResponse: Response | undefined;
        try {
            [metadata, cachedResponse] = await Promise.all([
                this.deps.repository.get(parsed.normalizedUrl),
                cache.match(parsed.normalizedUrl),
            ]);
        } catch (error) {
            this.logger.error("Channel image cache lookup failed", error);
            return this.fetchWithoutSaving(parsed.normalizedUrl);
        }

        if (cachedResponse && !metadata) {
            await cache.delete(parsed.normalizedUrl).catch(() => false);
            cachedResponse = undefined;
        } else if (!cachedResponse && metadata?.responseType) {
            metadata = await this.resetMissingCacheMetadata(metadata);
        }

        const now = this.now();
        if (cachedResponse && metadata?.responseType && metadata.fetchedAt !== null) {
            event.waitUntil(this.touchMetadata(metadata, now));
            const isFresh = now - metadata.fetchedAt < CHANNEL_IMAGE_CACHE_TTL_MS;
            if (isFresh) return cachedResponse;

            const retrySuppressed = metadata.lastAttemptAt > metadata.fetchedAt
                && now - metadata.lastAttemptAt < CHANNEL_IMAGE_CACHE_RETRY_INTERVAL_MS;
            if (!retrySuppressed) {
                const refresh = this.getOrCreateInFlight(
                    parsed.normalizedUrl,
                    () => this.fetchAndStore(
                        parsed.normalizedUrl,
                        cache,
                        metadata,
                        true,
                    ),
                ).then(() => undefined).catch(() => undefined);
                event.waitUntil(refresh);
            }
            return cachedResponse;
        }

        if (
            metadata?.responseType === null
            && metadata.fetchedAt === null
            && now - metadata.lastAttemptAt < CHANNEL_IMAGE_CACHE_RETRY_INTERVAL_MS
        ) {
            return errorResponse(502, "Channel image fetch is temporarily suppressed");
        }

        try {
            const shared = await this.getOrCreateInFlight(
                parsed.normalizedUrl,
                () => this.fetchAndStore(
                    parsed.normalizedUrl,
                    cache,
                    metadata,
                    false,
                ),
            );
            return shared.clone();
        } catch {
            return errorResponse(502, "Channel image fetch failed");
        }
    }

    private getOrCreateInFlight(url: string, factory: () => Promise<Response>): Promise<Response> {
        const existing = this.inFlight.get(url);
        if (existing) return existing;

        const promise = factory().finally(() => {
            if (this.inFlight.get(url) === promise) this.inFlight.delete(url);
        });
        this.inFlight.set(url, promise);
        return promise;
    }

    private async fetchWithoutSaving(url: string): Promise<Response> {
        try {
            return await this.deps.fetchRequest(new Request(url, {
                mode: "cors",
                credentials: "omit",
                cache: "reload",
            }));
        } catch {
            return errorResponse(502, "Channel image fetch failed");
        }
    }

    private async fetchAndStore(
        url: string,
        cache: Cache,
        existingMetadata: ChannelImageCacheMetaRecord | null,
        hadCachedResponse: boolean,
    ): Promise<Response> {
        const attemptedAt = this.now();
        let response: Response;
        try {
            response = await this.deps.fetchRequest(new Request(url, {
                mode: "cors",
                credentials: "omit",
                cache: "reload",
            }));
        } catch {
            try {
                response = await this.deps.fetchRequest(new Request(url, {
                    mode: "no-cors",
                    credentials: "omit",
                    cache: "reload",
                }));
            } catch (error) {
                await this.recordFailedAttempt(
                    url,
                    existingMetadata,
                    attemptedAt,
                    hadCachedResponse,
                );
                throw error;
            }
        }

        if (response.type === "opaque") {
            await this.commitResponse({
                url,
                response,
                cache,
                metadata: {
                    url,
                    responseType: "opaque",
                    verifiedSize: null,
                    fetchedAt: attemptedAt,
                    lastAttemptAt: attemptedAt,
                    lastAccessedAt: attemptedAt,
                    schemaVersion: CHANNEL_IMAGE_CACHE_META_SCHEMA_VERSION,
                },
                existingMetadata,
                hadCachedResponse,
            });
            return response;
        }

        if (!response.ok) {
            await this.recordFailedAttempt(url, existingMetadata, attemptedAt, hadCachedResponse);
            throw new Error(`Channel image fetch returned ${response.status}`);
        }

        const contentType = response.headers.get("Content-Type")?.toLowerCase() ?? "";
        if (!contentType.startsWith("image/")) {
            await this.recordFailedAttempt(url, existingMetadata, attemptedAt, hadCachedResponse);
            return response;
        }

        const contentLength = Number(response.headers.get("Content-Length"));
        if (
            Number.isFinite(contentLength)
            && contentLength > CHANNEL_IMAGE_CACHE_MAX_READABLE_IMAGE_BYTES
        ) {
            await this.recordReadableWithoutCache(
                url,
                attemptedAt,
                null,
                existingMetadata,
                hadCachedResponse,
            );
            return response;
        }

        let verifiedSize: number;
        try {
            verifiedSize = (await response.clone().blob()).size;
        } catch {
            await this.recordFailedAttempt(url, existingMetadata, attemptedAt, hadCachedResponse);
            return response;
        }
        if (verifiedSize > CHANNEL_IMAGE_CACHE_MAX_READABLE_IMAGE_BYTES) {
            await this.recordReadableWithoutCache(
                url,
                attemptedAt,
                verifiedSize,
                existingMetadata,
                hadCachedResponse,
            );
            return response;
        }

        await this.commitResponse({
            url,
            response,
            cache,
            metadata: {
                url,
                responseType: "readable",
                verifiedSize,
                fetchedAt: attemptedAt,
                lastAttemptAt: attemptedAt,
                lastAccessedAt: attemptedAt,
                schemaVersion: CHANNEL_IMAGE_CACHE_META_SCHEMA_VERSION,
            },
            existingMetadata,
            hadCachedResponse,
        });
        return response;
    }

    private async commitResponse({
        url,
        response,
        cache,
        metadata,
        existingMetadata,
        hadCachedResponse,
    }: {
        url: string;
        response: Response;
        cache: Cache;
        metadata: ChannelImageCacheMetaRecord;
        existingMetadata: ChannelImageCacheMetaRecord | null;
        hadCachedResponse: boolean;
    }): Promise<void> {
        try {
            await cache.put(url, response.clone());
        } catch (error) {
            this.logger.error("Channel image cache write failed", error);
            await this.recordFailedAttempt(
                url,
                existingMetadata,
                metadata.lastAttemptAt,
                hadCachedResponse,
            );
            return;
        }

        try {
            await this.deps.repository.put(metadata);
        } catch (error) {
            this.logger.error("Channel image metadata write failed", error);
            await cache.delete(url).catch(() => false);
            await this.recordFailedAttempt(url, existingMetadata, metadata.lastAttemptAt, false);
            return;
        }

        await this.enforceLimits(cache, url);
    }

    private async recordReadableWithoutCache(
        url: string,
        attemptedAt: number,
        verifiedSize: number | null,
        existingMetadata: ChannelImageCacheMetaRecord | null,
        cacheExists: boolean,
    ): Promise<void> {
        if (cacheExists && existingMetadata?.responseType && existingMetadata.fetchedAt !== null) {
            await this.safePut({ ...existingMetadata, lastAttemptAt: attemptedAt });
            return;
        }
        await this.safePut({
            url,
            responseType: "readable",
            verifiedSize,
            fetchedAt: attemptedAt,
            lastAttemptAt: attemptedAt,
            lastAccessedAt: attemptedAt,
            schemaVersion: CHANNEL_IMAGE_CACHE_META_SCHEMA_VERSION,
        });
    }

    private async recordFailedAttempt(
        url: string,
        existingMetadata: ChannelImageCacheMetaRecord | null,
        attemptedAt: number,
        cacheExists: boolean,
    ): Promise<void> {
        if (cacheExists && existingMetadata?.responseType && existingMetadata.fetchedAt !== null) {
            await this.safePut({ ...existingMetadata, lastAttemptAt: attemptedAt });
            return;
        }
        await this.safePut({
            url,
            responseType: null,
            verifiedSize: null,
            fetchedAt: null,
            lastAttemptAt: attemptedAt,
            lastAccessedAt: existingMetadata?.lastAccessedAt ?? attemptedAt,
            schemaVersion: CHANNEL_IMAGE_CACHE_META_SCHEMA_VERSION,
        });
    }

    private async safePut(metadata: ChannelImageCacheMetaRecord): Promise<void> {
        try {
            await this.deps.repository.put(metadata);
        } catch (error) {
            this.logger.error("Channel image metadata update failed", error);
        }
    }

    private async touchMetadata(
        metadata: ChannelImageCacheMetaRecord,
        accessedAt: number,
    ): Promise<void> {
        if (
            accessedAt - metadata.lastAccessedAt
            < CHANNEL_IMAGE_CACHE_ACCESS_TOUCH_INTERVAL_MS
        ) return;
        await this.safePut({ ...metadata, lastAccessedAt: accessedAt });
    }

    private async resetMissingCacheMetadata(
        metadata: ChannelImageCacheMetaRecord,
    ): Promise<ChannelImageCacheMetaRecord> {
        const reset: ChannelImageCacheMetaRecord = {
            ...metadata,
            responseType: null,
            verifiedSize: null,
            fetchedAt: null,
        };
        await this.safePut(reset);
        return reset;
    }

    private async deletePair(cache: Cache, url: string): Promise<void> {
        await cache.delete(url).catch(() => false);
        await this.deps.repository.delete(url).catch(() => undefined);
    }

    private async enforceLimits(cache: Cache, currentUrl?: string): Promise<void> {
        const protectedUrls = new Set(this.inFlight.keys());
        if (currentUrl) protectedUrls.add(currentUrl);
        const records = (await this.deps.repository.getAll()).sort(sortByAccessThenUrl);
        const entries: ChannelImageCacheMetaRecord[] = [];
        for (const record of records) {
            if (await cache.match(record.url)) entries.push(record);
        }

        const evicted = new Set<string>();
        const evictOldest = async (
            candidates: ChannelImageCacheMetaRecord[],
        ): Promise<ChannelImageCacheMetaRecord | null> => {
            const victim = candidates.find((record) =>
                !protectedUrls.has(record.url) && !evicted.has(record.url));
            if (!victim) return null;
            evicted.add(victim.url);
            await this.deletePair(cache, victim.url);
            return victim;
        };

        while (entries.length - evicted.size > CHANNEL_IMAGE_CACHE_MAX_ENTRIES) {
            if (!await evictOldest(entries)) break;
        }

        const opaque = entries.filter((record) => record.responseType === "opaque");
        while (
            opaque.filter((record) => !evicted.has(record.url)).length
            > CHANNEL_IMAGE_CACHE_MAX_OPAQUE_ENTRIES
        ) {
            if (!await evictOldest(opaque)) break;
        }

        const readable = entries.filter((record) =>
            record.responseType === "readable" && record.verifiedSize !== null);
        let readableTotal = readable.reduce(
            (sum, record) => sum + (evicted.has(record.url) ? 0 : record.verifiedSize ?? 0),
            0,
        );
        while (readableTotal > CHANNEL_IMAGE_CACHE_MAX_READABLE_TOTAL_BYTES) {
            const victim = await evictOldest(readable);
            if (!victim) break;
            readableTotal -= victim.verifiedSize ?? 0;
        }

        const remainingMetadata = records.filter((record) => !evicted.has(record.url));
        while (remainingMetadata.length > CHANNEL_IMAGE_CACHE_META_MAX_RECORDS) {
            const victim = remainingMetadata.find((record) => !protectedUrls.has(record.url));
            if (!victim) break;
            remainingMetadata.splice(remainingMetadata.indexOf(victim), 1);
            await this.deletePair(cache, victim.url);
        }
    }

    async reconcile(): Promise<void> {
        const cache = await this.deps.cacheStorage.open(CHANNEL_IMAGE_CACHE_NAME);
        const records = await this.deps.repository.getAll();
        const byUrl = new Map(records.map((record) => [record.url, record]));
        for (const request of await cache.keys()) {
            if (!byUrl.has(request.url)) await cache.delete(request);
        }
        for (const record of records) {
            if (record.responseType && !await cache.match(record.url)) {
                await this.resetMissingCacheMetadata(record);
            }
        }
        await this.enforceLimits(cache);
    }
}
