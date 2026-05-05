import { describe, expect, it, vi } from 'vitest';

import { findProfileImageCacheMatch } from '../../lib/swProfileImageCacheUtils';

describe('swProfileImageCacheUtils', () => {
    it('findProfileImageCacheMatch returns the first cached base response', async () => {
        const request = new Request('https://example.com/profile.jpg?profile=true');
        const cachedResponse = new Response('cached-profile');
        const cache = {
            match: vi.fn(async (targetRequest: Request) => {
                if (targetRequest.mode === 'cors' && targetRequest.url === 'https://example.com/profile.jpg') {
                    return cachedResponse;
                }

                return undefined;
            }),
        };

        const result = await findProfileImageCacheMatch({
            request,
            cache,
            getBaseUrl: (url) => {
                const parsed = new URL(url);
                return `${parsed.origin}${parsed.pathname}`;
            },
            createRequest: (url, options) => new Request(url, { method: 'GET', ...options }),
        });

        expect(result).toEqual({
            source: 'base-cors',
            response: cachedResponse,
        });
    });

    it('findProfileImageCacheMatch returns null when no base URL can be built', async () => {
        const cache = {
            match: vi.fn(),
        };

        const result = await findProfileImageCacheMatch({
            request: new Request('https://127.0.0.1/profile.jpg?profile=true'),
            cache,
            getBaseUrl: () => null,
            createRequest: (url, options) => new Request(url, { method: 'GET', ...options }),
        });

        expect(result).toBeNull();
        expect(cache.match).not.toHaveBeenCalled();
    });
});