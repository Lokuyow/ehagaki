export interface ProfileImageFetchLogger {
    log: (...args: unknown[]) => void;
    warn: (...args: unknown[]) => void;
}

export interface ProfileImageResponseLike {
    ok?: boolean;
    type?: string;
    status?: number;
    statusText?: string;
    clone?: () => unknown;
}

interface CacheWithPut {
    put: (request: Request, response: unknown) => Promise<void>;
}

interface CacheStorageLike {
    open: (cacheName: string) => Promise<CacheWithPut>;
}

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    return String(error);
}

export async function fetchAndCacheOpaqueProfileImageResponse({
    baseUrl,
    cacheStorage,
    cacheName,
    fetchRequest,
    createRequest,
    logger,
}: {
    baseUrl: string;
    cacheStorage: CacheStorageLike;
    cacheName: string;
    fetchRequest: (request: Request) => Promise<ProfileImageResponseLike | null | undefined>;
    createRequest: (url: string, options?: RequestInit) => Request;
    logger: ProfileImageFetchLogger;
}): Promise<ProfileImageResponseLike | null> {
    const profileFetchRequest = createRequest(baseUrl, {
        mode: 'no-cors',
        cache: 'reload',
    });
    const response = await fetchRequest(profileFetchRequest);
    if (!response || response.type !== 'opaque') {
        return null;
    }

    const cache = await cacheStorage.open(cacheName);
    const cacheKey = createRequest(baseUrl, { mode: 'no-cors' });
    try {
        await cache.put(
            cacheKey,
            typeof response.clone === 'function' ? response.clone() : response,
        );
        logger.log('プロフィール画像をopaqueキャッシュに保存完了:', baseUrl);
    } catch (cacheError) {
        logger.warn('プロフィール画像のopaqueキャッシュ保存に失敗:', cacheError, baseUrl);
    }

    return response;
}

export async function fetchAndCacheProfileImageResponse({
    request,
    isOnline,
    normalizeProfileImageUrl,
    getBaseUrl,
    createRequest,
    fetchRequest,
    cacheStorage,
    cacheName,
    fetchOpaqueProfileImage,
    logger,
}: {
    request: Request;
    isOnline?: boolean;
    normalizeProfileImageUrl: (url: string) => string | null;
    getBaseUrl: (url: string) => string | null;
    createRequest: (url: string, options?: RequestInit) => Request;
    fetchRequest: (request: Request) => Promise<ProfileImageResponseLike | null | undefined>;
    cacheStorage: CacheStorageLike;
    cacheName: string;
    fetchOpaqueProfileImage: (baseUrl: string) => Promise<ProfileImageResponseLike | null>;
    logger: ProfileImageFetchLogger;
}): Promise<ProfileImageResponseLike | null> {
    if (isOnline === false) {
        return null;
    }

    let baseUrl: string | null = null;
    try {
        const normalizedUrl = normalizeProfileImageUrl(request.url);
        baseUrl = getBaseUrl(request.url);
        if (!normalizedUrl || !baseUrl) {
            logger.warn('プロフィール画像 URL を拒否:', request.url);
            return null;
        }

        const profileFetchRequest = createRequest(baseUrl, {
            mode: 'cors',
            cache: 'reload',
        });

        logger.log('プロフィール画像をネットワークから取得中:', baseUrl);
        const response = await fetchRequest(profileFetchRequest);

        if (response && response.ok && response.type !== 'opaque') {
            const cache = await cacheStorage.open(cacheName);
            const cacheKey = createRequest(baseUrl);

            try {
                await cache.put(
                    cacheKey,
                    typeof response.clone === 'function' ? response.clone() : response,
                );
                logger.log('プロフィール画像をキャッシュに保存完了:', baseUrl);
            } catch (cacheError) {
                logger.warn('プロフィール画像のキャッシュ保存に失敗:', cacheError, baseUrl);
            }

            return response;
        }

        logger.warn(
            'プロフィール画像の取得に失敗または非OKレスポンス:',
            response && response.type,
            response && response.status,
            response && response.statusText,
        );
    } catch (networkError) {
        logger.log('プロフィール画像のネットワークエラー:', getErrorMessage(networkError));
        if (baseUrl) {
            return await fetchOpaqueProfileImage(baseUrl);
        }
    }

    return null;
}