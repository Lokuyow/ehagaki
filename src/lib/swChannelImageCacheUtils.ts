import {
    isChannelEventId,
    normalizeChannelPictureUrl,
} from "./channelPictureUrlUtils";
import { isCurrentChannelMetadataSchemaVersion } from "./channelMetadataConstants";
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

type RegisterBackground = (promise: Promise<unknown>) => void;

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
    private readonly activeUrls = new Map<string, number>();
    private readonly evictionReservations = new Map<string, Promise<void>>();
    private pendingFinalLimitCleanupCache: Cache | null = null;
    private finalLimitCleanup: Promise<void> | null = null;

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
        if (
            !channel
            || !isCurrentChannelMetadataSchemaVersion(channel.schemaVersion)
            || channel.resolutionQuality !== "verified-metadata"
        ) return false;
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

        const registerBackground = (promise: Promise<unknown>) => event.waitUntil(promise);
        this.retainActiveUrl(parsed.normalizedUrl);
        try {
            return await this.handleAuthorized(
                event,
                parsed.normalizedUrl,
                registerBackground,
            );
        } finally {
            this.releaseActiveUrl(parsed.normalizedUrl, registerBackground);
        }
    }

    private async handleAuthorized(
        event: ChannelImageFetchEventLike,
        normalizedUrl: string,
        registerBackground: RegisterBackground,
    ): Promise<Response> {
        await this.waitForEviction(normalizedUrl);
        const cache = await this.deps.cacheStorage.open(CHANNEL_IMAGE_CACHE_NAME);
        let metadata: ChannelImageCacheMetaRecord | null = null;
        let cachedResponse: Response | undefined;
        try {
            [metadata, cachedResponse] = await Promise.all([
                this.deps.repository.get(normalizedUrl),
                cache.match(normalizedUrl),
            ]);
        } catch (error) {
            this.logger.error("Channel image cache lookup failed", error);
            return this.fetchWithoutSaving(normalizedUrl);
        }

        if (cachedResponse && !metadata) {
            const pending = this.inFlight.get(normalizedUrl);
            if (pending) {
                try {
                    return (await pending).clone();
                } catch {
                    try {
                        [metadata, cachedResponse] = await Promise.all([
                            this.deps.repository.get(normalizedUrl),
                            cache.match(normalizedUrl),
                        ]);
                    } catch (error) {
                        this.logger.error("Channel image cache recheck failed", error);
                        return this.fetchWithoutSaving(normalizedUrl);
                    }
                }
            }
        }

        if (cachedResponse && !metadata) {
            await cache.delete(normalizedUrl).catch(() => false);
            cachedResponse = undefined;
        } else if (!cachedResponse && metadata?.responseType) {
            metadata = await this.resetMissingCacheMetadata(metadata);
        }

        const now = this.now();
        if (cachedResponse && metadata?.responseType && metadata.fetchedAt !== null) {
            const isFresh = now - metadata.fetchedAt < CHANNEL_IMAGE_CACHE_TTL_MS;
            if (isFresh) {
                event.waitUntil(this.touchMetadata(metadata, now));
                return cachedResponse;
            }

            const retrySuppressed = metadata.lastAttemptAt > metadata.fetchedAt
                && now - metadata.lastAttemptAt < CHANNEL_IMAGE_CACHE_RETRY_INTERVAL_MS;
            if (!retrySuppressed) {
                const rollbackResponse = cachedResponse.clone();
                const refresh = this.getOrCreateInFlight(
                    normalizedUrl,
                    () => this.fetchAndStore(
                        normalizedUrl,
                        cache,
                        metadata,
                        rollbackResponse,
                    ),
                    registerBackground,
                ).then(() => undefined).catch(() => undefined);
                event.waitUntil(refresh);
            } else {
                event.waitUntil(this.touchMetadata(metadata, now));
            }
            return cachedResponse;
        }

        if (
            metadata?.responseType === null
            && metadata.fetchedAt === null
            && now - metadata.lastAttemptAt < CHANNEL_IMAGE_CACHE_RETRY_INTERVAL_MS
        ) {
            event.waitUntil(this.touchMetadata(metadata, now));
            return errorResponse(502, "Channel image fetch is temporarily suppressed");
        }

        try {
            const shared = await this.getOrCreateInFlight(
                normalizedUrl,
                () => this.fetchAndStore(
                    normalizedUrl,
                    cache,
                    metadata,
                    null,
                ),
                registerBackground,
            );
            return shared.clone();
        } catch {
            return errorResponse(502, "Channel image fetch failed");
        }
    }

    private getOrCreateInFlight(
        url: string,
        factory: () => Promise<Response>,
        registerBackground: RegisterBackground,
    ): Promise<Response> {
        const existing = this.inFlight.get(url);
        if (existing) return existing;

        const promise = factory().finally(() => {
            if (this.inFlight.get(url) === promise) this.inFlight.delete(url);
            this.scheduleFinalLimitCleanupIfNeeded(registerBackground);
        });
        this.inFlight.set(url, promise);
        return promise;
    }

    private retainActiveUrl(url: string): void {
        this.activeUrls.set(url, (this.activeUrls.get(url) ?? 0) + 1);
    }

    private releaseActiveUrl(
        url: string,
        registerBackground: RegisterBackground,
    ): void {
        const count = this.activeUrls.get(url) ?? 0;
        if (count <= 1) this.activeUrls.delete(url);
        else this.activeUrls.set(url, count - 1);
        this.scheduleFinalLimitCleanupIfNeeded(registerBackground);
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
        rollbackResponse: Response | null,
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
                    cache,
                    existingMetadata,
                    attemptedAt,
                    rollbackResponse !== null,
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
                    lastAccessedAt: Math.max(
                        attemptedAt,
                        existingMetadata?.lastAccessedAt ?? attemptedAt,
                    ),
                    schemaVersion: CHANNEL_IMAGE_CACHE_META_SCHEMA_VERSION,
                },
                existingMetadata,
                rollbackResponse,
            });
            return response;
        }

        if (!response.ok) {
            await this.recordFailedAttempt(
                url,
                cache,
                existingMetadata,
                attemptedAt,
                rollbackResponse !== null,
            );
            throw new Error(`Channel image fetch returned ${response.status}`);
        }

        const contentType = response.headers.get("Content-Type")?.toLowerCase() ?? "";
        if (!contentType.startsWith("image/")) {
            await this.recordFailedAttempt(
                url,
                cache,
                existingMetadata,
                attemptedAt,
                rollbackResponse !== null,
            );
            return response;
        }

        const contentLength = Number(response.headers.get("Content-Length"));
        if (
            Number.isFinite(contentLength)
            && contentLength > CHANNEL_IMAGE_CACHE_MAX_READABLE_IMAGE_BYTES
        ) {
            await this.recordReadableWithoutCache(
                url,
                cache,
                attemptedAt,
                null,
                existingMetadata,
                rollbackResponse !== null,
            );
            return response;
        }

        let verifiedSize: number;
        try {
            verifiedSize = (await response.clone().blob()).size;
        } catch {
            await this.recordFailedAttempt(
                url,
                cache,
                existingMetadata,
                attemptedAt,
                rollbackResponse !== null,
            );
            return response;
        }
        if (verifiedSize > CHANNEL_IMAGE_CACHE_MAX_READABLE_IMAGE_BYTES) {
            await this.recordReadableWithoutCache(
                url,
                cache,
                attemptedAt,
                verifiedSize,
                existingMetadata,
                rollbackResponse !== null,
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
                lastAccessedAt: Math.max(
                    attemptedAt,
                    existingMetadata?.lastAccessedAt ?? attemptedAt,
                ),
                schemaVersion: CHANNEL_IMAGE_CACHE_META_SCHEMA_VERSION,
            },
            existingMetadata,
            rollbackResponse,
        });
        return response;
    }

    private async commitResponse({
        url,
        response,
        cache,
        metadata,
        existingMetadata,
        rollbackResponse,
    }: {
        url: string;
        response: Response;
        cache: Cache;
        metadata: ChannelImageCacheMetaRecord;
        existingMetadata: ChannelImageCacheMetaRecord | null;
        rollbackResponse: Response | null;
    }): Promise<void> {
        try {
            await cache.put(url, response.clone());
        } catch (error) {
            this.logger.error("Channel image cache write failed", error);
            await this.recordFailedAttempt(
                url,
                cache,
                existingMetadata,
                metadata.lastAttemptAt,
                rollbackResponse !== null,
            );
            return;
        }

        try {
            await this.deps.repository.put(metadata);
        } catch (error) {
            this.logger.error("Channel image metadata write failed", error);
            if (rollbackResponse) {
                try {
                    await cache.put(url, rollbackResponse.clone());
                } catch (rollbackError) {
                    this.logger.error("Channel image stale cache rollback failed", rollbackError);
                    await cache.delete(url).catch((deleteError) => {
                        this.logger.error(
                            "Channel image inconsistent cache cleanup failed",
                            deleteError,
                        );
                        return false;
                    });
                }
                await this.markAttempt(url, metadata.lastAttemptAt);
                await this.enforceLimitsBestEffort(cache, url);
            } else {
                await cache.delete(url).catch(() => false);
                await this.recordFailedAttempt(
                    url,
                    cache,
                    existingMetadata,
                    metadata.lastAttemptAt,
                    false,
                );
            }
            return;
        }

        await this.enforceLimitsBestEffort(cache, url);
    }

    private async recordReadableWithoutCache(
        url: string,
        cache: Cache,
        attemptedAt: number,
        verifiedSize: number | null,
        existingMetadata: ChannelImageCacheMetaRecord | null,
        cacheExists: boolean,
    ): Promise<void> {
        if (cacheExists && existingMetadata?.responseType && existingMetadata.fetchedAt !== null) {
            await this.markAttempt(url, attemptedAt);
            await this.enforceLimitsBestEffort(cache, url);
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
        await this.enforceLimitsBestEffort(cache, url);
    }

    private async recordFailedAttempt(
        url: string,
        cache: Cache,
        existingMetadata: ChannelImageCacheMetaRecord | null,
        attemptedAt: number,
        cacheExists: boolean,
    ): Promise<void> {
        if (cacheExists && existingMetadata?.responseType && existingMetadata.fetchedAt !== null) {
            await this.markAttempt(url, attemptedAt);
            await this.enforceLimitsBestEffort(cache, url);
            return;
        }
        if (
            existingMetadata?.responseType === null
            && existingMetadata.fetchedAt === null
        ) {
            await this.markAttemptAndAccess(url, attemptedAt);
            await this.enforceLimitsBestEffort(cache, url);
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
        await this.enforceLimitsBestEffort(cache, url);
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
        try {
            await this.deps.repository.touchLastAccessedAt(metadata.url, accessedAt);
        } catch (error) {
            this.logger.error("Channel image metadata touch failed", error);
        }
    }

    private async markAttempt(url: string, attemptedAt: number): Promise<void> {
        try {
            await this.deps.repository.markAttempt(url, attemptedAt);
        } catch (error) {
            this.logger.error("Channel image metadata attempt update failed", error);
        }
    }

    private async markAttemptAndAccess(url: string, attemptedAt: number): Promise<void> {
        try {
            await this.deps.repository.markAttemptAndAccess(url, attemptedAt);
        } catch (error) {
            this.logger.error("Channel image metadata attempt/access update failed", error);
        }
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

    private reserveEviction(
        url: string,
        currentUrl?: string,
    ): (() => void) | null {
        if (this.isUrlProtected(url, currentUrl) || this.evictionReservations.has(url)) {
            return null;
        }
        let resolve!: () => void;
        const completion = new Promise<void>((complete) => { resolve = complete; });
        this.evictionReservations.set(url, completion);
        return () => {
            if (this.evictionReservations.get(url) === completion) {
                this.evictionReservations.delete(url);
            }
            resolve();
        };
    }

    private async waitForEviction(url: string): Promise<void> {
        let eviction = this.evictionReservations.get(url);
        while (eviction) {
            await eviction;
            eviction = this.evictionReservations.get(url);
        }
    }

    private async enforceLimitsBestEffort(cache: Cache, currentUrl?: string): Promise<void> {
        try {
            if (!await this.enforceLimits(cache, currentUrl)) {
                this.pendingFinalLimitCleanupCache = cache;
            }
        } catch (error) {
            this.logger.error("Channel image cache limit enforcement failed", error);
        }
    }

    private scheduleFinalLimitCleanupIfNeeded(
        registerBackground: RegisterBackground,
    ): void {
        const cleanup = this.startFinalLimitCleanupIfNeeded();
        if (cleanup) registerBackground(cleanup);
    }

    private startFinalLimitCleanupIfNeeded(): Promise<void> | null {
        if (
            this.inFlight.size !== 0
            || this.activeUrls.size !== 0
            || !this.pendingFinalLimitCleanupCache
            || this.finalLimitCleanup
        ) return null;

        const cleanup = (async () => {
            while (
                this.inFlight.size === 0
                && this.activeUrls.size === 0
                && this.pendingFinalLimitCleanupCache
            ) {
                const cache = this.pendingFinalLimitCleanupCache;
                this.pendingFinalLimitCleanupCache = null;
                try {
                    if (!await this.enforceLimits(cache)) {
                        this.pendingFinalLimitCleanupCache = cache;
                    }
                } catch (error) {
                    if (!this.pendingFinalLimitCleanupCache) {
                        this.pendingFinalLimitCleanupCache = cache;
                    }
                    this.logger.error("Channel image final cache limit enforcement failed", error);
                    break;
                }
            }
        })().finally(() => {
            if (this.finalLimitCleanup === cleanup) this.finalLimitCleanup = null;
        });
        this.finalLimitCleanup = cleanup;
        return cleanup;
    }

    private isUrlProtected(url: string, currentUrl?: string): boolean {
        return url === currentUrl
            || this.activeUrls.has(url)
            || this.inFlight.has(url);
    }

    private async enforceLimits(cache: Cache, currentUrl?: string): Promise<boolean> {
        const records = (await this.deps.repository.getAll()).sort(sortByAccessThenUrl);
        const entries: ChannelImageCacheMetaRecord[] = [];
        for (const record of records) {
            if (await cache.match(record.url)) entries.push(record);
        }

        const evicted = new Set<string>();
        const evictOldest = async (
            candidates: ChannelImageCacheMetaRecord[],
        ): Promise<ChannelImageCacheMetaRecord | null> => {
            for (const candidate of candidates) {
                if (evicted.has(candidate.url)) continue;
                const releaseReservation = this.reserveEviction(
                    candidate.url,
                    currentUrl,
                );
                if (!releaseReservation) continue;
                evicted.add(candidate.url);
                try {
                    await this.deletePair(cache, candidate.url);
                    return candidate;
                } finally {
                    releaseReservation();
                }
            }
            return null;
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
            const victim = await evictOldest(remainingMetadata);
            if (!victim) break;
            remainingMetadata.splice(remainingMetadata.indexOf(victim), 1);
        }
        const remainingEntries = entries.filter((record) => !evicted.has(record.url));
        const remainingReadableTotal = remainingEntries.reduce(
            (sum, record) => sum + (
                record.responseType === "readable" ? record.verifiedSize ?? 0 : 0
            ),
            0,
        );
        return remainingEntries.length <= CHANNEL_IMAGE_CACHE_MAX_ENTRIES
            && remainingEntries.filter((record) => record.responseType === "opaque").length
                <= CHANNEL_IMAGE_CACHE_MAX_OPAQUE_ENTRIES
            && remainingReadableTotal <= CHANNEL_IMAGE_CACHE_MAX_READABLE_TOTAL_BYTES
            && remainingMetadata.length <= CHANNEL_IMAGE_CACHE_META_MAX_RECORDS;
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
