import { describe, expect, it, vi } from 'vitest';

import {
    fetchAndCacheOpaqueProfileImageResponse,
    fetchAndCacheProfileImageResponse,
} from '../../lib/swProfileImageFetchUtils';

describe('swProfileImageFetchUtils', () => {
    it('fetchAndCacheProfileImageResponse skips network fetch when offline', async () => {
        const fetchRequest = vi.fn();

        const result = await fetchAndCacheProfileImageResponse({
            request: new Request('https://example.com/profile.jpg?profile=true'),
            isOnline: false,
            normalizeProfileImageUrl: vi.fn(),
            getBaseUrl: vi.fn(),
            createRequest: (url, options) => new Request(url, { method: 'GET', ...options }),
            fetchRequest,
            cacheStorage: {
                open: vi.fn(),
            },
            cacheName: 'profile-cache',
            fetchOpaqueProfileImage: vi.fn(),
            logger: {
                log: vi.fn(),
                warn: vi.fn(),
            },
        });

        expect(result).toBeNull();
        expect(fetchRequest).not.toHaveBeenCalled();
    });

    it('fetchAndCacheProfileImageResponse caches successful cors responses', async () => {
        const cache = {
            put: vi.fn().mockResolvedValue(undefined),
        };
        const cacheStorage = {
            open: vi.fn().mockResolvedValue(cache),
        };
        const response = new Response('image', {
            status: 200,
            headers: { 'Content-Type': 'image/jpeg' },
        });

        const result = await fetchAndCacheProfileImageResponse({
            request: new Request('https://example.com/profile.jpg?profile=true'),
            isOnline: true,
            normalizeProfileImageUrl: vi.fn(() => 'https://example.com/profile.jpg'),
            getBaseUrl: vi.fn(() => 'https://example.com/profile.jpg'),
            createRequest: (url, options) => new Request(url, { method: 'GET', ...options }),
            fetchRequest: vi.fn().mockResolvedValue(response),
            cacheStorage,
            cacheName: 'profile-cache',
            fetchOpaqueProfileImage: vi.fn(),
            logger: {
                log: vi.fn(),
                warn: vi.fn(),
            },
        });

        expect(result).toBe(response);
        expect(cacheStorage.open).toHaveBeenCalledWith('profile-cache');
        expect(cache.put).toHaveBeenCalledTimes(1);
        expect(cache.put.mock.calls[0][0].url).toBe('https://example.com/profile.jpg');
        expect(cache.put.mock.calls[0][0].mode).toBe('cors');
    });

    it('fetchAndCacheProfileImageResponse returns null for non-ok opaque responses', async () => {
        const result = await fetchAndCacheProfileImageResponse({
            request: new Request('https://example.com/profile.jpg?profile=true'),
            isOnline: true,
            normalizeProfileImageUrl: vi.fn(() => 'https://example.com/profile.jpg'),
            getBaseUrl: vi.fn(() => 'https://example.com/profile.jpg'),
            createRequest: (url, options) => new Request(url, { method: 'GET', ...options }),
            fetchRequest: vi.fn().mockResolvedValue({
                ok: false,
                type: 'opaque',
                status: 0,
                statusText: '',
                clone: vi.fn(() => ({ type: 'opaque' })),
            }),
            cacheStorage: {
                open: vi.fn(),
            },
            cacheName: 'profile-cache',
            fetchOpaqueProfileImage: vi.fn(),
            logger: {
                log: vi.fn(),
                warn: vi.fn(),
            },
        });

        expect(result).toBeNull();
    });

    it('fetchAndCacheProfileImageResponse falls back to opaque cache after network errors', async () => {
        const opaqueResponse = {
            type: 'opaque',
            clone: vi.fn(() => ({ type: 'opaque' })),
        };
        const fetchOpaqueProfileImage = vi.fn().mockResolvedValue(opaqueResponse);

        const result = await fetchAndCacheProfileImageResponse({
            request: new Request('https://example.com/profile.jpg?profile=true'),
            isOnline: true,
            normalizeProfileImageUrl: vi.fn(() => 'https://example.com/profile.jpg'),
            getBaseUrl: vi.fn(() => 'https://example.com/profile.jpg'),
            createRequest: (url, options) => new Request(url, { method: 'GET', ...options }),
            fetchRequest: vi.fn().mockRejectedValue(new TypeError('Failed to fetch')),
            cacheStorage: {
                open: vi.fn(),
            },
            cacheName: 'profile-cache',
            fetchOpaqueProfileImage,
            logger: {
                log: vi.fn(),
                warn: vi.fn(),
            },
        });

        expect(result).toBe(opaqueResponse);
        expect(fetchOpaqueProfileImage).toHaveBeenCalledWith('https://example.com/profile.jpg');
    });

    it('fetchAndCacheOpaqueProfileImageResponse stores opaque responses with no-cors cache keys', async () => {
        const cache = {
            put: vi.fn().mockResolvedValue(undefined),
        };
        const cacheStorage = {
            open: vi.fn().mockResolvedValue(cache),
        };
        const opaqueResponse = {
            type: 'opaque',
            clone: vi.fn(() => ({ type: 'opaque' })),
        };

        const result = await fetchAndCacheOpaqueProfileImageResponse({
            baseUrl: 'https://example.com/profile.jpg',
            cacheStorage,
            cacheName: 'profile-cache',
            fetchRequest: vi.fn().mockResolvedValue(opaqueResponse),
            createRequest: (url, options) => new Request(url, { method: 'GET', ...options }),
            logger: {
                log: vi.fn(),
                warn: vi.fn(),
            },
        });

        expect(result).toBe(opaqueResponse);
        expect(cache.put).toHaveBeenCalledTimes(1);
        expect(cache.put.mock.calls[0][0].url).toBe('https://example.com/profile.jpg');
        expect(cache.put.mock.calls[0][0].mode).toBe('no-cors');
    });
});