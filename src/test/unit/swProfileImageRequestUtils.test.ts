import { describe, expect, it, vi } from 'vitest';

import {
    processServiceWorkerProfileImageRequest,
    resolveProfileImageRequestResult,
} from '../../lib/swProfileImageRequestUtils';

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

    it('processServiceWorkerProfileImageRequest は network response を返して log する', async () => {
        const network = new Response('network', { status: 200 });
        const logger = {
            log: vi.fn(),
            warn: vi.fn(),
            error: vi.fn(),
        };

        const result = await processServiceWorkerProfileImageRequest({
            request: new Request('https://example.com/image.jpg?profile=true'),
            logger,
            normalizeProfileImageUrl: vi.fn(() => 'https://example.com/image.jpg'),
            handleProfileImageCache: vi.fn(async () => null),
            fetchAndCacheProfileImage: vi.fn(async () => network),
            createTransparentImageResponse: vi.fn(),
        });

        expect(result).toBe(network);
        expect(logger.log).toHaveBeenCalledWith(
            'プロフィール画像リクエスト処理開始:',
            'https://example.com/image.jpg?profile=true',
        );
        expect(logger.log).toHaveBeenCalledWith(
            'プロフィール画像をネットワークから返却:',
            'https://example.com/image.jpg?profile=true',
        );
    });

    it('processServiceWorkerProfileImageRequest は policy-blocked 時に warning を出す', async () => {
        const transparent = new Response(null, { status: 200 });
        const logger = {
            log: vi.fn(),
            warn: vi.fn(),
            error: vi.fn(),
        };

        const result = await processServiceWorkerProfileImageRequest({
            request: new Request('https://127.0.0.1/image.jpg?profile=true'),
            logger,
            normalizeProfileImageUrl: vi.fn(() => null),
            handleProfileImageCache: vi.fn(),
            fetchAndCacheProfileImage: vi.fn(),
            createTransparentImageResponse: vi.fn(() => transparent),
        });

        expect(result).toBe(transparent);
        expect(logger.warn).toHaveBeenCalledWith(
            'プロフィール画像 URL がポリシー外のため transparent image を返却:',
            'https://127.0.0.1/image.jpg?profile=true',
        );
    });

    it('processServiceWorkerProfileImageRequest は error 時に 404 transparent image を返す', async () => {
        const logger = {
            log: vi.fn(),
            warn: vi.fn(),
            error: vi.fn(),
        };
        const createTransparentImageResponse = vi.fn((statusCode?: number) =>
            new Response(null, { status: statusCode ?? 200 }),
        );
        const failure = new Error('cache failed');

        const result = await processServiceWorkerProfileImageRequest({
            request: new Request('https://example.com/image.jpg?profile=true'),
            logger,
            normalizeProfileImageUrl: vi.fn(() => 'https://example.com/image.jpg'),
            handleProfileImageCache: vi.fn(async () => {
                throw failure;
            }),
            fetchAndCacheProfileImage: vi.fn(),
            createTransparentImageResponse,
        });

        expect(result.status).toBe(404);
        expect(logger.error).toHaveBeenCalledWith('プロフィール画像処理エラー:', failure);
        expect(createTransparentImageResponse).toHaveBeenCalledWith(404);
    });
});