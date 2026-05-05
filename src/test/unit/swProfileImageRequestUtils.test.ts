import { describe, expect, it, vi } from 'vitest';

import { resolveProfileImageRequestResult } from '../../lib/swProfileImageRequestUtils';

describe('swProfileImageRequestUtils', () => {
    it('ポリシー外 URL では transparent image を返す', async () => {
        const transparent = new Response(null, { status: 200 });

        const result = await resolveProfileImageRequestResult({
            request: new Request('https://127.0.0.1/image.jpg?profile=true'),
            normalizeProfileImageUrl: vi.fn(() => null),
            handleProfileImageCache: vi.fn(),
            fetchAndCacheProfileImage: vi.fn(),
            createTransparentImageResponse: vi.fn(() => transparent),
        });

        expect(result).toEqual({
            source: 'policy-blocked',
            response: transparent,
        });
    });

    it('cache hit を優先して返す', async () => {
        const cached = new Response('cached', { status: 200 });

        const result = await resolveProfileImageRequestResult({
            request: new Request('https://example.com/image.jpg?profile=true'),
            normalizeProfileImageUrl: vi.fn(() => 'https://example.com/image.jpg'),
            handleProfileImageCache: vi.fn(async () => cached),
            fetchAndCacheProfileImage: vi.fn(),
            createTransparentImageResponse: vi.fn(),
        });

        expect(result).toEqual({
            source: 'cache',
            response: cached,
        });
    });

    it('cache miss 時は network response を返す', async () => {
        const network = new Response('network', { status: 200 });

        const result = await resolveProfileImageRequestResult({
            request: new Request('https://example.com/image.jpg?profile=true'),
            normalizeProfileImageUrl: vi.fn(() => 'https://example.com/image.jpg'),
            handleProfileImageCache: vi.fn(async () => null),
            fetchAndCacheProfileImage: vi.fn(async () => network),
            createTransparentImageResponse: vi.fn(),
        });

        expect(result).toEqual({
            source: 'network',
            response: network,
        });
    });

    it('cache も network も無い時は fallback を返す', async () => {
        const transparent = new Response(null, { status: 200 });

        const result = await resolveProfileImageRequestResult({
            request: new Request('https://example.com/image.jpg?profile=true'),
            normalizeProfileImageUrl: vi.fn(() => 'https://example.com/image.jpg'),
            handleProfileImageCache: vi.fn(async () => null),
            fetchAndCacheProfileImage: vi.fn(async () => null),
            createTransparentImageResponse: vi.fn(() => transparent),
        });

        expect(result).toEqual({
            source: 'fallback',
            response: transparent,
        });
    });
});