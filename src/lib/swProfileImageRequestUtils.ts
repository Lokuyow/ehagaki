export type ProfileImageRequestResultSource =
    | 'policy-blocked'
    | 'cache'
    | 'network'
    | 'fallback';

export interface ProfileImageRequestResult {
    source: ProfileImageRequestResultSource;
    response: Response;
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