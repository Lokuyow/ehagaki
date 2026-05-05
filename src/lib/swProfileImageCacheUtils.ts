import {
    createBaseCacheLookupEntries,
    matchCacheByPriority,
    type CacheLike,
    type CacheLookupMatch,
} from './swCacheUtils';

export async function findProfileImageCacheMatch({
    request,
    cache,
    getBaseUrl,
    createRequest,
}: {
    request: Request;
    cache: CacheLike;
    getBaseUrl: (url: string) => string | null;
    createRequest: (url: string, options?: RequestInit) => Request;
}): Promise<CacheLookupMatch | null> {
    const baseUrl = getBaseUrl(request.url);
    if (!baseUrl) {
        return null;
    }

    return await matchCacheByPriority(
        cache,
        createBaseCacheLookupEntries(baseUrl, request, createRequest),
    );
}