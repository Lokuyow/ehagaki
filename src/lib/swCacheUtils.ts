export interface LegacyCacheCleanupOptions {
    legacyPrecachePrefix: string;
    legacyProfileCacheNames: string[];
    legacyCustomEmojiCacheNames: string[];
}

export type CacheLookupSource = 'base-cors' | 'base-no-cors' | 'original';

export interface CacheLookupEntry {
    source: CacheLookupSource;
    request: Request;
}

export interface CacheLookupMatch {
    source: CacheLookupSource;
    response: Response;
}

export interface CacheLike {
    match: (request: Request) => Promise<Response | undefined>;
}

export interface RequestLike {
    url: string;
}

export function getLegacyCachesToDelete(
    cacheNames: string[],
    options: LegacyCacheCleanupOptions,
): string[] {
    return cacheNames.filter((name) =>
        name.startsWith(options.legacyPrecachePrefix) ||
        options.legacyProfileCacheNames.includes(name) ||
        options.legacyCustomEmojiCacheNames.includes(name),
    );
}

export function createBaseCacheLookupEntries(
    baseUrl: string,
    originalRequest: Request,
    createRequest: (url: string, options?: RequestInit) => Request,
): CacheLookupEntry[] {
    return [
        {
            source: 'base-cors',
            request: createRequest(baseUrl),
        },
        {
            source: 'base-no-cors',
            request: createRequest(baseUrl, { mode: 'no-cors' }),
        },
        {
            source: 'original',
            request: originalRequest,
        },
    ];
}

export async function matchCacheByPriority(
    cache: CacheLike,
    lookups: CacheLookupEntry[],
): Promise<CacheLookupMatch | null> {
    for (const lookup of lookups) {
        const response = await cache.match(lookup.request);
        if (response) {
            return {
                source: lookup.source,
                response,
            };
        }
    }

    return null;
}

export function getDuplicateProfileCacheRequests<TRequest extends RequestLike>(
    requests: TRequest[],
    getBaseUrl: (url: string) => string | null,
): TRequest[] {
    const baseUrls = new Set<string>();
    const queryRequests: TRequest[] = [];

    requests.forEach((request) => {
        const url = new URL(request.url);
        const baseUrl = getBaseUrl(request.url);
        if (!baseUrl) {
            return;
        }

        if (url.search) {
            queryRequests.push(request);
            return;
        }

        baseUrls.add(baseUrl);
    });

    return queryRequests.filter((request) => {
        const baseUrl = getBaseUrl(request.url);
        return Boolean(baseUrl && baseUrls.has(baseUrl));
    });
}