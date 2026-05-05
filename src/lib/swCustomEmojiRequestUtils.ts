import {
    createBaseCacheLookupEntries,
    matchCacheByPriority,
    type CacheLike,
} from './swCacheUtils';

export async function resolveCustomEmojiImageRequestResponse({
    request,
    cache,
    getBaseUrl,
    createRequest,
    fetchRequest,
}: {
    request: Request;
    cache: CacheLike;
    getBaseUrl: (url: string) => string | null;
    createRequest: (url: string, options?: RequestInit) => Request;
    fetchRequest: (request: Request) => Promise<Response>;
}): Promise<Response> {
    const baseUrl = getBaseUrl(request.url);
    if (baseUrl) {
        const cachedMatch = await matchCacheByPriority(
            cache,
            createBaseCacheLookupEntries(baseUrl, request, createRequest),
        );
        if (cachedMatch) {
            return cachedMatch.response;
        }
    }

    return await fetchRequest(request);
}