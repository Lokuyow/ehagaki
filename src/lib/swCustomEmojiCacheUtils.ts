interface CustomEmojiCacheLogger {
    warn: (...args: unknown[]) => void;
}

interface CacheWithPut {
    put: (request: Request, response: unknown) => Promise<void>;
}

interface CacheStorageLike {
    open: (cacheName: string) => Promise<CacheWithPut>;
}

export type CustomEmojiResponseCacheFailureReason =
    | 'http-error'
    | 'too-large'
    | 'invalid-content-type'
    | 'body-unreadable';

export type CustomEmojiResponseCacheAssessment =
    | { cacheable: true; response: Response }
    | { cacheable: false; reason: CustomEmojiResponseCacheFailureReason };

function matchesAscii(bytes: Uint8Array, offset: number, value: string): boolean {
    if (offset + value.length > bytes.byteLength) return false;

    for (let index = 0; index < value.length; index += 1) {
        if (bytes[offset + index] !== value.charCodeAt(index)) return false;
    }

    return true;
}

function isWebPResponseBody(buffer: ArrayBuffer): boolean {
    const bytes = new Uint8Array(buffer);
    if (bytes.byteLength < 20) return false;
    if (!matchesAscii(bytes, 0, 'RIFF') || !matchesAscii(bytes, 8, 'WEBP')) return false;

    const view = new DataView(buffer);
    if (view.getUint32(4, true) + 8 !== bytes.byteLength) return false;

    let offset = 12;
    let hasPrimaryImageChunk = false;
    while (offset + 8 <= bytes.byteLength) {
        const chunkSize = view.getUint32(offset + 4, true);
        const chunkEnd = offset + 8 + chunkSize;
        const paddedChunkEnd = chunkEnd + (chunkSize % 2);
        if (chunkEnd > bytes.byteLength || paddedChunkEnd > bytes.byteLength) return false;

        hasPrimaryImageChunk ||=
            matchesAscii(bytes, offset, 'VP8 ') ||
            matchesAscii(bytes, offset, 'VP8L') ||
            matchesAscii(bytes, offset, 'VP8X');
        offset = paddedChunkEnd;
    }

    return offset === bytes.byteLength && hasPrimaryImageChunk;
}

export async function prepareCustomEmojiResponseForCache(
    response: Response,
    maxImageBytes: number,
): Promise<CustomEmojiResponseCacheAssessment> {
    if (!response || response.type === 'opaque') {
        return { cacheable: false, reason: 'body-unreadable' };
    }
    if (!response.ok) {
        return { cacheable: false, reason: 'http-error' };
    }

    const contentLengthHeader = response.headers.get('Content-Length');
    if (contentLengthHeader !== null) {
        const contentLength = Number(contentLengthHeader);
        if (Number.isFinite(contentLength) && contentLength > maxImageBytes) {
            return { cacheable: false, reason: 'too-large' };
        }
    }

    let body: ArrayBuffer;
    try {
        body = await response.clone().arrayBuffer();
    } catch {
        return { cacheable: false, reason: 'body-unreadable' };
    }

    if (body.byteLength > maxImageBytes) {
        return { cacheable: false, reason: 'too-large' };
    }

    const contentType = response.headers.get('Content-Type')?.split(';', 1)[0]?.trim().toLowerCase() ?? '';
    const isWebPBody = isWebPResponseBody(body);

    if (isWebPBody) {
        if (contentType === 'image/webp') {
            return { cacheable: true, response };
        }

        const headers = new Headers(response.headers);
        headers.set('Content-Type', 'image/webp');
        headers.delete('Content-Encoding');
        headers.delete('Content-Length');
        return {
            cacheable: true,
            response: new Response(body, {
                status: response.status,
                statusText: response.statusText,
                headers,
            }),
        };
    }

    if (!contentType.startsWith('image/') || contentType === 'image/webp') {
        return { cacheable: false, reason: 'invalid-content-type' };
    }

    return { cacheable: true, response };
}

export async function cacheOpaqueCustomEmojiImage({
    cache,
    baseUrl,
    fetchRequest,
    createRequest,
}: {
    cache: CacheWithPut;
    baseUrl: string;
    fetchRequest: (request: Request) => Promise<{ type?: string; clone?: () => unknown } | null | undefined>;
    createRequest: (url: string, options?: RequestInit) => Request;
}): Promise<boolean> {
    const request = createRequest(baseUrl, {
        mode: 'no-cors',
        cache: 'reload',
    });
    const response = await fetchRequest(request);
    if (!response || response.type !== 'opaque') {
        return false;
    }

    await cache.put(
        createRequest(baseUrl, { mode: 'no-cors' }),
        typeof response.clone === 'function' ? response.clone() : response,
    );
    return true;
}

export async function cacheCustomEmojiImagesBatch({
    urls,
    cacheStorage,
    cacheName,
    fetchRequest,
    createRequest,
    getBaseUrl,
    maxImageBytes,
    cacheOpaqueImage,
    logger,
}: {
    urls: string[] | undefined;
    cacheStorage: CacheStorageLike;
    cacheName: string;
    fetchRequest: (request: Request) => Promise<unknown>;
    createRequest: (url: string, options?: RequestInit) => Request;
    getBaseUrl: (url: string) => string | null;
    maxImageBytes: number;
    cacheOpaqueImage: (cache: CacheWithPut, baseUrl: string) => Promise<boolean>;
    logger: CustomEmojiCacheLogger;
}): Promise<{ success: true; cached: number; failed: number }> {
    if (!Array.isArray(urls) || urls.length === 0) {
        return { success: true, cached: 0, failed: 0 };
    }

    const cache = await cacheStorage.open(cacheName);
    let cached = 0;
    let failed = 0;

    for (const rawUrl of [...new Set(urls)].slice(0, 300)) {
        let baseUrl: string | null;

        try {
            baseUrl = getBaseUrl(rawUrl);
        } catch {
            failed++;
            continue;
        }

        if (!baseUrl) {
            failed++;
            continue;
        }

        let request: Request;
        try {
            request = createRequest(baseUrl, {
                mode: 'cors',
                cache: 'reload',
            });
        } catch {
            failed++;
            continue;
        }
        let response: Response;
        try {
            response = await fetchRequest(request) as Response;
        } catch {
            try {
                if (await cacheOpaqueImage(cache, baseUrl)) {
                    cached++;
                } else {
                    failed++;
                }
            } catch (opaqueError) {
                failed++;
                logger.warn('カスタム絵文字画像のopaqueキャッシュ保存に失敗:', opaqueError, rawUrl);
            }
            continue;
        }

        const assessment = await prepareCustomEmojiResponseForCache(response, maxImageBytes);
        if (!assessment.cacheable) {
            failed++;
            continue;
        }

        try {
            await cache.put(createRequest(baseUrl), assessment.response);
            cached++;
        } catch (cacheError) {
            failed++;
            logger.warn('カスタム絵文字画像のキャッシュ保存に失敗:', cacheError, rawUrl);
        }
    }

    return { success: true, cached, failed };
}
