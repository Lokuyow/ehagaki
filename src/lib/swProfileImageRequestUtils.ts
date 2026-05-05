export type ProfileImageRequestResultSource =
    | 'policy-blocked'
    | 'cache'
    | 'network'
    | 'fallback';

export interface ProfileImageRequestResult {
    source: ProfileImageRequestResultSource;
    response: Response;
}

interface ProfileImageRequestLogger {
    log: (...args: unknown[]) => void;
    warn: (...args: unknown[]) => void;
    error: (...args: unknown[]) => void;
}

export async function resolveProfileImageRequestResult({
    request,
    normalizeProfileImageUrl,
    handleProfileImageCache,
    fetchAndCacheProfileImage,
    createTransparentImageResponse,
}: {
    request: Request;
    normalizeProfileImageUrl: (url: string) => string | null;
    handleProfileImageCache: (request: Request) => Promise<Response | null>;
    fetchAndCacheProfileImage: (request: Request) => Promise<Response | null>;
    createTransparentImageResponse: (statusCode?: number) => Response;
}): Promise<ProfileImageRequestResult> {
    const normalizedUrl = normalizeProfileImageUrl(request.url);
    if (!normalizedUrl) {
        return {
            source: 'policy-blocked',
            response: createTransparentImageResponse(),
        };
    }

    const cached = await handleProfileImageCache(request);
    if (cached) {
        return {
            source: 'cache',
            response: cached,
        };
    }

    const networkResponse = await fetchAndCacheProfileImage(request);
    if (networkResponse) {
        return {
            source: 'network',
            response: networkResponse,
        };
    }

    return {
        source: 'fallback',
        response: createTransparentImageResponse(),
    };
}

export async function processServiceWorkerProfileImageRequest({
    request,
    logger,
    normalizeProfileImageUrl,
    handleProfileImageCache,
    fetchAndCacheProfileImage,
    createTransparentImageResponse,
}: {
    request: Request;
    logger: ProfileImageRequestLogger;
    normalizeProfileImageUrl: (url: string) => string | null;
    handleProfileImageCache: (request: Request) => Promise<Response | null>;
    fetchAndCacheProfileImage: (request: Request) => Promise<Response | null>;
    createTransparentImageResponse: (statusCode?: number) => Response;
}): Promise<Response> {
    try {
        logger.log('プロフィール画像リクエスト処理開始:', request.url);

        const result = await resolveProfileImageRequestResult({
            request,
            normalizeProfileImageUrl,
            handleProfileImageCache,
            fetchAndCacheProfileImage,
            createTransparentImageResponse,
        });

        if (result.source === 'policy-blocked') {
            logger.warn('プロフィール画像 URL がポリシー外のため transparent image を返却:', request.url);
            return result.response;
        }

        if (result.source === 'cache') {
            logger.log('プロフィール画像をキャッシュから返却:', request.url);
            return result.response;
        }

        if (result.source === 'network') {
            logger.log('プロフィール画像をネットワークから返却:', request.url);
            return result.response;
        }

        logger.log('フォールバック画像を返却:', request.url);
        return result.response;
    } catch (error) {
        logger.error('プロフィール画像処理エラー:', error);
        return createTransparentImageResponse(404);
    }
}