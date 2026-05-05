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
});