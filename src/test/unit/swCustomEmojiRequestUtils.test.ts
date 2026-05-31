import { describe, expect, it, vi } from 'vitest';

import { resolveCustomEmojiImageRequestResponse } from '../../lib/swCustomEmojiRequestUtils';

describe('swCustomEmojiRequestUtils', () => {
    it('resolveCustomEmojiImageRequestResponse prefers cached base responses', async () => {
        const request = new Request('https://example.com/emoji.webp?size=small');
        const cachedResponse = new Response('cached-emoji');
        const cache = {
            match: vi.fn(async (targetRequest: Request) => {
                if (targetRequest.mode === 'cors' && targetRequest.url === 'https://example.com/emoji.webp') {
                    return cachedResponse;
                }

                return undefined;
            }),
        };
        const fetchRequest = vi.fn();

        const result = await resolveCustomEmojiImageRequestResponse({
            request,
            cache,
            getBaseUrl: (url) => {
                const parsed = new URL(url);
                return `${parsed.origin}${parsed.pathname}`;
            },
            createRequest: (url, options) => new Request(url, { method: 'GET', ...options }),
            fetchRequest,
        });

        expect(result).toBe(cachedResponse);
        expect(fetchRequest).not.toHaveBeenCalled();
    });

    it('resolveCustomEmojiImageRequestResponse falls back to fetch when cache misses', async () => {
        const request = new Request('https://example.com/emoji.webp?size=small');
        const networkResponse = new Response('emoji-network');
        const fetchRequest = vi.fn().mockResolvedValue(networkResponse);

        const result = await resolveCustomEmojiImageRequestResponse({
            request,
            cache: {
                match: vi.fn().mockResolvedValue(undefined),
            },
            getBaseUrl: (url) => {
                const parsed = new URL(url);
                return `${parsed.origin}${parsed.pathname}`;
            },
            createRequest: (url, options) => new Request(url, { method: 'GET', ...options }),
            fetchRequest,
        });

        expect(result).toBe(networkResponse);
        expect(fetchRequest).toHaveBeenCalledWith(request);
    });

    it('resolveCustomEmojiImageRequestResponse can match cache for query-dependent URLs', async () => {
        const request = new Request(
            'https://github.com/invertedtriangle358/images/blob/main/EMOJI/%E3%81%9B%E3%82%84%E3%81%8B%E3%81%A6%E9%A7%86%E5%8B%95%E9%96%8B%E7%99%BA.png?raw=true',
        );
        const cachedResponse = new Response('cached-emoji');
        const cache = {
            match: vi.fn(async (targetRequest: Request) => {
                if (
                    targetRequest.mode === 'cors' &&
                    targetRequest.url ===
                    'https://github.com/invertedtriangle358/images/blob/main/EMOJI/%E3%81%9B%E3%82%84%E3%81%8B%E3%81%A6%E9%A7%86%E5%8B%95%E9%96%8B%E7%99%BA.png?raw=true'
                ) {
                    return cachedResponse;
                }

                return undefined;
            }),
        };
        const fetchRequest = vi.fn();

        const result = await resolveCustomEmojiImageRequestResponse({
            request,
            cache,
            getBaseUrl: (url) => {
                const parsed = new URL(url);
                parsed.hash = '';
                return parsed.toString();
            },
            createRequest: (url, options) => new Request(url, { method: 'GET', ...options }),
            fetchRequest,
        });

        expect(result).toBe(cachedResponse);
        expect(fetchRequest).not.toHaveBeenCalled();
    });
});