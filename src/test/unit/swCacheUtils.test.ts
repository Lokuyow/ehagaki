import { describe, expect, it, vi } from 'vitest';

import {
    createBaseCacheLookupEntries,
    getDuplicateProfileCacheRequests,
    getLegacyCachesToDelete,
    matchCacheByPriority,
} from '../../lib/swCacheUtils';

describe('swCacheUtils', () => {
    it('getLegacyCachesToDelete は legacy cache だけを返す', () => {
        const result = getLegacyCachesToDelete(
            [
                'ehagaki-cache-1.2.0',
                'ehagaki-profile-images',
                'ehagaki-custom-emoji-images',
                'ehagaki-profile-images-v2',
                'workbox-precache-v2-example',
            ],
            {
                legacyPrecachePrefix: 'ehagaki-cache-',
                legacyProfileCacheNames: ['ehagaki-profile-images'],
                legacyCustomEmojiCacheNames: ['ehagaki-custom-emoji-images'],
            },
        );

        expect(result).toEqual([
            'ehagaki-cache-1.2.0',
            'ehagaki-profile-images',
            'ehagaki-custom-emoji-images',
        ]);
    });

    it('createBaseCacheLookupEntries は cors, no-cors, original の順で lookup を作る', () => {
        const originalRequest = new Request('https://example.com/image.png?profile=true');

        const lookups = createBaseCacheLookupEntries(
            'https://example.com/image.png',
            originalRequest,
            (url, options) => new Request(url, options),
        );

        expect(lookups.map((lookup) => lookup.source)).toEqual([
            'base-cors',
            'base-no-cors',
            'original',
        ]);
        expect(lookups[0].request.mode).toBe('cors');
        expect(lookups[1].request.mode).toBe('no-cors');
        expect(lookups[2].request).toBe(originalRequest);
    });

    it('matchCacheByPriority は最初に見つかった response と source を返す', async () => {
        const originalRequest = new Request('https://example.com/image.png?profile=true');
        const baseRequest = new Request('https://example.com/image.png');
        const opaqueRequest = new Request('https://example.com/image.png', { mode: 'no-cors' });
        const opaqueResponse = new Response('opaque');
        const cache = {
            match: vi.fn(async (request: Request) => {
                if (request === baseRequest) {
                    return undefined;
                }
                if (request === opaqueRequest) {
                    return opaqueResponse;
                }
                return undefined;
            }),
        };

        const result = await matchCacheByPriority(cache, [
            { source: 'base-cors', request: baseRequest },
            { source: 'base-no-cors', request: opaqueRequest },
            { source: 'original', request: originalRequest },
        ]);

        expect(result).toEqual({
            source: 'base-no-cors',
            response: opaqueResponse,
        });
        expect(cache.match).toHaveBeenCalledTimes(2);
        expect(cache.match.mock.calls[0][0].url).toBe(baseRequest.url);
        expect(cache.match.mock.calls[0][0].mode).toBe('cors');
        expect(cache.match.mock.calls[1][0].url).toBe(opaqueRequest.url);
        expect(cache.match.mock.calls[1][0].mode).toBe('no-cors');
    });

    it('getDuplicateProfileCacheRequests は base URL がある query 付き request だけを返す', () => {
        const requests = [
            { url: 'https://example.com/a.png' },
            { url: 'https://example.com/a.png?profile=true' },
            { url: 'https://example.com/b.png?profile=true' },
            { url: 'https://example.com/c.png' },
        ];

        const result = getDuplicateProfileCacheRequests(
            requests,
            (url) => {
                const parsed = new URL(url);
                return `${parsed.origin}${parsed.pathname}`;
            },
        );

        expect(result).toEqual([
            { url: 'https://example.com/a.png?profile=true' },
        ]);
    });
});