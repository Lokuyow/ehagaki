import { describe, expect, it, vi } from 'vitest';

import {
    processServiceWorkerProfileImageRequest,
    resolveProfileImageRequestResult,
} from '../../lib/swProfileImageRequestUtils';
import { createMockConsole } from '../helpers';

const profileImageUrl = 'https://example.com/image.jpg?profile=true';
const loopbackProfileImageUrl = 'https://127.0.0.1/image.jpg?profile=true';

const createProfileImageRequest = (url: string = profileImageUrl) => new Request(url);

const createResolveProfileImageRequestResultArgs = ({
    request = createProfileImageRequest(),
    normalizeProfileImageUrl = vi.fn(() => profileImageUrl),
    handleProfileImageCache = vi.fn(async () => null),
    fetchAndCacheProfileImage = vi.fn(async () => null),
    createTransparentImageResponse = vi.fn(),
}: {
    request?: Request;
    normalizeProfileImageUrl?: any;
    handleProfileImageCache?: any;
    fetchAndCacheProfileImage?: any;
    createTransparentImageResponse?: any;
} = {}) => ({
    request,
    normalizeProfileImageUrl,
    handleProfileImageCache,
    fetchAndCacheProfileImage,
    createTransparentImageResponse,
});

const createProcessServiceWorkerProfileImageRequestArgs = ({
    request = createProfileImageRequest(),
    logger = createMockConsole(),
    normalizeProfileImageUrl = vi.fn(() => profileImageUrl),
    handleProfileImageCache = vi.fn(async () => null),
    fetchAndCacheProfileImage = vi.fn(async () => null),
    createTransparentImageResponse = vi.fn(),
}: {
    request?: Request;
    logger?: ReturnType<typeof createMockConsole>;
    normalizeProfileImageUrl?: any;
    handleProfileImageCache?: any;
    fetchAndCacheProfileImage?: any;
    createTransparentImageResponse?: any;
} = {}) => ({
    request,
    logger,
    normalizeProfileImageUrl,
    handleProfileImageCache,
    fetchAndCacheProfileImage,
    createTransparentImageResponse,
});

describe('swProfileImageRequestUtils', () => {
    it('ポリシー外 URL では transparent image を返す', async () => {
        const transparent = new Response(null, { status: 200 });

        const result = await resolveProfileImageRequestResult(
            createResolveProfileImageRequestResultArgs({
                request: createProfileImageRequest(loopbackProfileImageUrl),
                normalizeProfileImageUrl: vi.fn(() => null),
                createTransparentImageResponse: vi.fn(() => transparent),
            }),
        );

        expect(result).toEqual({
            source: 'policy-blocked',
            response: transparent,
        });
    });

    it('cache hit を優先して返す', async () => {
        const cached = new Response('cached', { status: 200 });

        const result = await resolveProfileImageRequestResult(
            createResolveProfileImageRequestResultArgs({
                handleProfileImageCache: vi.fn(async () => cached),
            }),
        );

        expect(result).toEqual({
            source: 'cache',
            response: cached,
        });
    });

    it('cache miss 時は network response を返す', async () => {
        const network = new Response('network', { status: 200 });

        const result = await resolveProfileImageRequestResult(
            createResolveProfileImageRequestResultArgs({
                fetchAndCacheProfileImage: vi.fn(async () => network),
            }),
        );

        expect(result).toEqual({
            source: 'network',
            response: network,
        });
    });

    it('cache も network も無い時は fallback を返す', async () => {
        const transparent = new Response(null, { status: 200 });

        const result = await resolveProfileImageRequestResult(
            createResolveProfileImageRequestResultArgs({
                fetchAndCacheProfileImage: vi.fn(async () => null),
                createTransparentImageResponse: vi.fn(() => transparent),
            }),
        );

        expect(result).toEqual({
            source: 'fallback',
            response: transparent,
        });
    });

    it('processServiceWorkerProfileImageRequest は network response を返して log する', async () => {
        const network = new Response('network', { status: 200 });
        const logger = createMockConsole();

        const result = await processServiceWorkerProfileImageRequest(
            createProcessServiceWorkerProfileImageRequestArgs({
                logger,
                fetchAndCacheProfileImage: vi.fn(async () => network),
            }),
        );

        expect(result).toBe(network);
        expect(logger.log).toHaveBeenCalledWith(
            'プロフィール画像リクエスト処理開始:',
            profileImageUrl,
        );
        expect(logger.log).toHaveBeenCalledWith(
            'プロフィール画像をネットワークから返却:',
            profileImageUrl,
        );
    });

    it('processServiceWorkerProfileImageRequest は policy-blocked 時に warning を出す', async () => {
        const transparent = new Response(null, { status: 200 });
        const logger = createMockConsole();

        const result = await processServiceWorkerProfileImageRequest(
            createProcessServiceWorkerProfileImageRequestArgs({
                request: createProfileImageRequest(loopbackProfileImageUrl),
                logger,
                normalizeProfileImageUrl: vi.fn(() => null),
                createTransparentImageResponse: vi.fn(() => transparent),
            }),
        );

        expect(result).toBe(transparent);
        expect(logger.warn).toHaveBeenCalledWith(
            'プロフィール画像 URL がポリシー外のため transparent image を返却:',
            loopbackProfileImageUrl,
        );
    });

    it('processServiceWorkerProfileImageRequest は error 時に 404 transparent image を返す', async () => {
        const logger = createMockConsole();
        const createTransparentImageResponse = vi.fn((statusCode?: number) =>
            new Response(null, { status: statusCode ?? 200 }),
        );
        const failure = new Error('cache failed');

        const result = await processServiceWorkerProfileImageRequest(
            createProcessServiceWorkerProfileImageRequestArgs({
                logger,
                handleProfileImageCache: vi.fn(async () => {
                    throw failure;
                }),
                createTransparentImageResponse,
            }),
        );

        expect(result.status).toBe(404);
        expect(logger.error).toHaveBeenCalledWith('プロフィール画像処理エラー:', failure);
        expect(createTransparentImageResponse).toHaveBeenCalledWith(404);
    });
});