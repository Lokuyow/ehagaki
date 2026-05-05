interface CustomEmojiCacheLogger {
    warn: (...args: unknown[]) => void;
}

interface CacheWithPut {
    put: (request: Request, response: unknown) => Promise<void>;
}

interface CacheStorageLike {
    open: (cacheName: string) => Promise<CacheWithPut>;
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
    isCacheableCustomEmojiResponse,
    cacheOpaqueImage,
    logger,
}: {
    urls: string[] | undefined;
    cacheStorage: CacheStorageLike;
    cacheName: string;
    fetchRequest: (request: Request) => Promise<unknown>;
    createRequest: (url: string, options?: RequestInit) => Request;
    getBaseUrl: (url: string) => string | null;
    isCacheableCustomEmojiResponse: (response: Response) => Promise<boolean>;
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
        let baseUrl: string | null = null;

        try {
            baseUrl = getBaseUrl(rawUrl);
            if (!baseUrl) {
                failed++;
                continue;
            }

            const request = createRequest(baseUrl, {
                mode: 'cors',
                cache: 'reload',
            });
            const response = await fetchRequest(request);
            if (await isCacheableCustomEmojiResponse(response as Response)) {
                await cache.put(
                    createRequest(baseUrl),
                    typeof (response as { clone?: () => unknown }).clone === 'function'
                        ? (response as { clone: () => unknown }).clone()
                        : response,
                );
                cached++;
            } else {
                failed++;
            }
        } catch {
            try {
                if (baseUrl && await cacheOpaqueImage(cache, baseUrl)) {
                    cached++;
                } else {
                    failed++;
                }
            } catch (opaqueError) {
                failed++;
                logger.warn('カスタム絵文字画像のopaqueキャッシュ保存に失敗:', opaqueError, rawUrl);
            }
        }
    }

    return { success: true, cached, failed };
}