import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/svelte';
import { readable } from 'svelte/store';

const translateMock = vi.hoisted(() => (key: string) => {
    const translations: Record<string, string> = {
        'postHistory.mediaCached': 'キャッシュ済み',
        'postHistory.mediaNotCached': '未キャッシュ',
        'postHistory.mediaFetchAndCache': '再取得して保存',
        'postHistory.mediaLoading': '読み込み中...',
        'postHistory.mediaLoadFailed': '読み込みに失敗しました',
        'postHistory.mediaOpen': '開く',
        'imageContextMenu.copyUrl': 'URLをコピー',
        'imageContextMenu.copySuccess': 'URLをコピーしました',
        'imageContextMenu.copyFailed': 'コピーに失敗しました',
        'videoContextMenu.copyUrl': 'URLをコピー',
        'videoContextMenu.copySuccess': 'URLをコピーしました',
        'videoContextMenu.copyFailed': 'コピーに失敗しました',
        'videoNode.not_supported': 'video unsupported',
    };

    return translations[key] || key;
});

const postMediaCacheServiceMock = vi.hoisted(() => ({
    canUsePersistentCache: vi.fn(),
    getCachedMediaDescriptor: vi.fn(),
    createCachedMediaObjectUrl: vi.fn(),
    fetchAndCacheMedia: vi.fn(),
    revokeObjectUrl: vi.fn(),
}));

const clipboardMock = vi.hoisted(() => ({
    tryCopyToClipboard: vi.fn(),
}));

const intersectionObserverInstances = vi.hoisted(
    () => [] as MockIntersectionObserver[],
);

class MockIntersectionObserver {
    constructor(
        private callback: IntersectionObserverCallback,
    ) {
        intersectionObserverInstances.push(this);
    }

    disconnect = vi.fn();
    observe = vi.fn((target: Element) => {
        queueMicrotask(() => {
            this.callback(
                [
                    {
                        isIntersecting: true,
                        target,
                    } as IntersectionObserverEntry,
                ],
                this as unknown as IntersectionObserver,
            );
        });
    });
    takeRecords = vi.fn(() => []);
    unobserve = vi.fn();
    root = null;
    rootMargin = '';
    thresholds = [];
}

vi.mock('svelte-i18n', () => ({
    _: readable(translateMock),
}));

vi.mock('../../lib/postMediaCacheService', () => ({
    postMediaCacheService: postMediaCacheServiceMock,
}));

vi.mock('../../lib/utils/clipboardUtils', () => clipboardMock);

import PostHistoryMediaList from '../../components/PostHistoryMediaList.svelte';

describe('PostHistoryMediaList', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        intersectionObserverInstances.length = 0;
        vi.mocked(postMediaCacheServiceMock.canUsePersistentCache).mockReturnValue(true);
        vi.stubGlobal(
            'IntersectionObserver',
            MockIntersectionObserver as unknown as typeof IntersectionObserver,
        );
        clipboardMock.tryCopyToClipboard.mockResolvedValue(true);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('cached media は画像グリッドと動画カードに分けて表示する', async () => {
        vi.mocked(postMediaCacheServiceMock.getCachedMediaDescriptor)
            .mockImplementation(async (url: string) => {
                if (url.endsWith('.jpg')) {
                    return {
                        cacheKey: 'https://example.com/image.jpg',
                        url,
                        mimeType: 'image/jpeg',
                        size: 10,
                        source: 'uploaded',
                        kind: 'image',
                    };
                }

                if (url.endsWith('.mp4')) {
                    return {
                        cacheKey: 'https://example.com/video.mp4',
                        url,
                        mimeType: 'video/mp4',
                        size: 20,
                        source: 'uploaded',
                        kind: 'video',
                    };
                }

                return null;
            });
        vi.mocked(postMediaCacheServiceMock.createCachedMediaObjectUrl)
            .mockImplementation(async (url: string) => {
                if (url.endsWith('.jpg')) {
                    return {
                        cacheKey: 'https://example.com/image.jpg',
                        url,
                        mimeType: 'image/jpeg',
                        size: 10,
                        source: 'uploaded',
                        kind: 'image',
                        objectUrl: 'blob:image-preview',
                    };
                }

                if (url.endsWith('.mp4')) {
                    return {
                        cacheKey: 'https://example.com/video.mp4',
                        url,
                        mimeType: 'video/mp4',
                        size: 20,
                        source: 'uploaded',
                        kind: 'video',
                        objectUrl: 'blob:video-preview',
                    };
                }

                return null;
            });

        const media = [
            {
                url: 'https://example.com/image.jpg',
                mimeType: 'image/jpeg',
                alt: 'cached image',
                blurhash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
            },
            {
                url: 'https://example.com/video.mp4',
                mimeType: 'video/mp4',
                alt: 'cached video',
                blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.',
            },
        ];

        const { container, rerender } = render(PostHistoryMediaList, {
            props: {
                media,
            },
        });

        await waitFor(() => {
            expect(screen.getByAltText('cached image')).toBeTruthy();
            expect(container.querySelector('video')).toBeTruthy();
        });
        expect(
            vi.mocked(postMediaCacheServiceMock.createCachedMediaObjectUrl),
        ).toHaveBeenCalledTimes(2);

        const video = container.querySelector('video');
        expect(video?.getAttribute('controls')).not.toBeNull();
        expect(video?.getAttribute('playsinline')).not.toBeNull();
        expect(video?.getAttribute('preload')).toBe('metadata');
        expect(
            container.querySelector('.post-history-media-placeholder-blurhash'),
        ).toBeNull();

        await rerender({
            media,
        });

        expect(
            vi.mocked(postMediaCacheServiceMock.createCachedMediaObjectUrl),
        ).toHaveBeenCalledTimes(2);
        expect(screen.getByAltText('cached image')).toBeTruthy();
    });

    it('1枚の画像は 420px を上限にしてアスペクト比を保つ', async () => {
        vi.mocked(postMediaCacheServiceMock.getCachedMediaDescriptor)
            .mockResolvedValue({
                cacheKey: 'https://example.com/single.jpg',
                url: 'https://example.com/single.jpg',
                mimeType: 'image/jpeg',
                size: 10,
                source: 'uploaded',
                kind: 'image',
            });
        vi.mocked(postMediaCacheServiceMock.createCachedMediaObjectUrl)
            .mockResolvedValue({
                cacheKey: 'https://example.com/single.jpg',
                url: 'https://example.com/single.jpg',
                mimeType: 'image/jpeg',
                size: 10,
                source: 'uploaded',
                kind: 'image',
                objectUrl: 'blob:single-image',
            });

        render(PostHistoryMediaList, {
            props: {
                media: [
                    {
                        url: 'https://example.com/single.jpg',
                        mimeType: 'image/jpeg',
                        alt: 'single image',
                        dim: '1200x800',
                    },
                ],
            },
        });

        await waitFor(() => {
            expect(screen.getByAltText('single image')).toBeTruthy();
        });

        const surface = screen.getByRole('button', {
            name: '開く single image',
        });

        expect(surface.getAttribute('style')).toContain('aspect-ratio: 1200 / 800');
        expect(surface.getAttribute('style')).toContain('width: min(100%, 630px)');
        expect(surface.getAttribute('style')).toContain('max-height: 420px');
    });

    it('4枚の画像は少し横長の比率で表示する', async () => {
        vi.mocked(postMediaCacheServiceMock.getCachedMediaDescriptor)
            .mockImplementation(async (url: string) => ({
                cacheKey: url,
                url,
                mimeType: 'image/jpeg',
                size: 10,
                source: 'uploaded',
                kind: 'image',
            }));
        vi.mocked(postMediaCacheServiceMock.createCachedMediaObjectUrl)
            .mockImplementation(async (url: string) => ({
                cacheKey: url,
                url,
                mimeType: 'image/jpeg',
                size: 10,
                source: 'uploaded',
                kind: 'image',
                objectUrl: `blob:${url.split('/').at(-1)}`,
            }));

        render(PostHistoryMediaList, {
            props: {
                media: [
                    {
                        url: 'https://example.com/1.jpg',
                        mimeType: 'image/jpeg',
                        alt: 'image 1',
                    },
                    {
                        url: 'https://example.com/2.jpg',
                        mimeType: 'image/jpeg',
                        alt: 'image 2',
                    },
                    {
                        url: 'https://example.com/3.jpg',
                        mimeType: 'image/jpeg',
                        alt: 'image 3',
                    },
                    {
                        url: 'https://example.com/4.jpg',
                        mimeType: 'image/jpeg',
                        alt: 'image 4',
                    },
                ],
            },
        });

        await waitFor(() => {
            expect(screen.getByAltText('image 1')).toBeTruthy();
        });

        const surface = screen.getByRole('button', {
            name: '開く image 1',
        });

        expect(surface.getAttribute('style')).toContain('aspect-ratio: 4 / 3');
        expect(surface.getAttribute('style')).toContain('width: 100%');
    });

    it('キャッシュ判定中でも blurhash プレースホルダーと alt を表示ヒントに使う', async () => {
        vi.mocked(postMediaCacheServiceMock.getCachedMediaDescriptor)
            .mockImplementation(() => new Promise(() => undefined));

        const { container } = render(PostHistoryMediaList, {
            props: {
                media: [
                    {
                        url: 'https://example.com/loading.jpg',
                        mimeType: 'image/jpeg',
                        alt: 'loading image alt',
                        blurhash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
                        dim: '1200x800',
                    },
                ],
            },
        });

        await waitFor(() => {
            expect(
                container.querySelector('.post-history-media-placeholder-blurhash'),
            ).toBeTruthy();
        });

        const placeholder = container.querySelector(
            '.post-history-media-placeholder-blurhash',
        ) as HTMLElement | null;

        expect(placeholder?.getAttribute('title')).toBe('loading image alt');
        expect(placeholder?.getAttribute('aria-label')).toContain(
            'loading image alt',
        );
    });

    it('cached だが object url 生成中の画像は blurhash プレースホルダーを維持する', async () => {
        vi.mocked(postMediaCacheServiceMock.getCachedMediaDescriptor)
            .mockResolvedValue({
                cacheKey: 'https://example.com/cached-loading.jpg',
                url: 'https://example.com/cached-loading.jpg',
                mimeType: 'image/jpeg',
                size: 12,
                source: 'uploaded',
                kind: 'image',
            });
        vi.mocked(postMediaCacheServiceMock.createCachedMediaObjectUrl)
            .mockImplementation(() => new Promise(() => undefined));

        const { container } = render(PostHistoryMediaList, {
            props: {
                media: [
                    {
                        url: 'https://example.com/cached-loading.jpg',
                        mimeType: 'image/jpeg',
                        alt: 'cached loading image',
                        blurhash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
                    },
                ],
            },
        });

        await waitFor(() => {
            expect(
                screen.getByRole('button', { name: '開く cached loading image' }),
            ).toBeTruthy();
            expect(
                container.querySelector('.post-history-media-placeholder-blurhash'),
            ).toBeTruthy();
        });

        expect(screen.queryByAltText('cached loading image')).toBeNull();
    });

    it('未キャッシュでも blurhash があればプレースホルダー背景を維持する', async () => {
        vi.mocked(postMediaCacheServiceMock.getCachedMediaDescriptor)
            .mockResolvedValue(null);
        vi.mocked(postMediaCacheServiceMock.fetchAndCacheMedia)
            .mockImplementation(() => new Promise(() => undefined));

        const { container } = render(PostHistoryMediaList, {
            props: {
                media: [
                    {
                        url: 'https://example.com/uncached-blurhash.png',
                        mimeType: 'image/png',
                        alt: 'uncached blurhash image',
                        blurhash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
                    },
                ],
            },
        });

        await waitFor(() => {
            expect(postMediaCacheServiceMock.fetchAndCacheMedia).toHaveBeenCalledWith({
                url: 'https://example.com/uncached-blurhash.png',
                mimeType: 'image/png',
            });
            expect(
                container.querySelector('.post-history-media-placeholder-blurhash'),
            ).toBeTruthy();
        });
    });

    it('可視範囲に入った uncached media は自動取得して保存する', async () => {
        vi.mocked(postMediaCacheServiceMock.getCachedMediaDescriptor)
            .mockResolvedValue(null);
        vi.mocked(postMediaCacheServiceMock.fetchAndCacheMedia)
            .mockResolvedValue({
                cacheKey: 'https://example.com/uncached.png',
                url: 'https://example.com/uncached.png',
                mimeType: 'image/png',
                size: 6,
                source: 'network',
                kind: 'image',
            });
        vi.mocked(postMediaCacheServiceMock.createCachedMediaObjectUrl)
            .mockResolvedValue({
                cacheKey: 'https://example.com/uncached.png',
                url: 'https://example.com/uncached.png',
                mimeType: 'image/png',
                size: 6,
                source: 'network',
                kind: 'image',
                objectUrl: 'blob:uncached-image',
            });

        render(PostHistoryMediaList, {
            props: {
                media: [
                    {
                        url: 'https://example.com/uncached.png',
                        mimeType: 'image/png',
                        alt: 'uncached image',
                    },
                ],
            },
        });

        await waitFor(() => {
            expect(postMediaCacheServiceMock.fetchAndCacheMedia).toHaveBeenCalledWith({
                url: 'https://example.com/uncached.png',
                mimeType: 'image/png',
            });
        });
        await waitFor(() => {
            expect(screen.getByAltText('uncached image')).toBeTruthy();
        });
        expect(
            vi.mocked(postMediaCacheServiceMock.createCachedMediaObjectUrl),
        ).toHaveBeenCalledWith('https://example.com/uncached.png');
    });

    it('取得失敗時は再取得ボタンを表示し、押下で再試行できる', async () => {
        vi.mocked(postMediaCacheServiceMock.getCachedMediaDescriptor)
            .mockResolvedValue(null);
        vi.mocked(postMediaCacheServiceMock.fetchAndCacheMedia)
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce({
                cacheKey: 'https://example.com/retry.png',
                url: 'https://example.com/retry.png',
                mimeType: 'image/png',
                size: 6,
                source: 'network',
                kind: 'image',
            });
        vi.mocked(postMediaCacheServiceMock.createCachedMediaObjectUrl)
            .mockResolvedValue({
                cacheKey: 'https://example.com/retry.png',
                url: 'https://example.com/retry.png',
                mimeType: 'image/png',
                size: 6,
                source: 'network',
                kind: 'image',
                objectUrl: 'blob:retry-image',
            });

        render(PostHistoryMediaList, {
            props: {
                media: [
                    {
                        url: 'https://example.com/retry.png',
                        mimeType: 'image/png',
                        alt: 'retry image',
                        blurhash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
                    },
                ],
            },
        });

        const retryButton = await screen.findByRole('button', {
            name: '再取得して保存',
        });
        expect(
            document.querySelector('.post-history-media-placeholder-blurhash'),
        ).toBeTruthy();
        await fireEvent.click(retryButton);

        expect(postMediaCacheServiceMock.fetchAndCacheMedia).toHaveBeenCalledTimes(2);
        await waitFor(() => {
            expect(screen.getByAltText('retry image')).toBeTruthy();
        });
    });

    it('画像クリック時は fullscreen 用コールバックへ同一投稿の画像だけを渡す', async () => {
        vi.mocked(postMediaCacheServiceMock.getCachedMediaDescriptor)
            .mockImplementation(async (url: string) => {
                if (url.endsWith('.jpg')) {
                    return {
                        cacheKey: 'https://example.com/image.jpg',
                        url,
                        mimeType: 'image/jpeg',
                        size: 10,
                        source: 'uploaded',
                        kind: 'image',
                    };
                }

                return {
                    cacheKey: 'https://example.com/video.mp4',
                    url,
                    mimeType: 'video/mp4',
                    size: 20,
                    source: 'uploaded',
                    kind: 'video',
                };
            });
        vi.mocked(postMediaCacheServiceMock.createCachedMediaObjectUrl)
            .mockImplementation(async (url: string) => {
                if (url.endsWith('.jpg')) {
                    return {
                        cacheKey: 'https://example.com/image.jpg',
                        url,
                        mimeType: 'image/jpeg',
                        size: 10,
                        source: 'uploaded',
                        kind: 'image',
                        objectUrl: 'blob:image-preview',
                    };
                }

                return {
                    cacheKey: 'https://example.com/video.mp4',
                    url,
                    mimeType: 'video/mp4',
                    size: 20,
                    source: 'uploaded',
                    kind: 'video',
                    objectUrl: 'blob:video-preview',
                };
            });

        const onImageOpen = vi.fn();

        render(PostHistoryMediaList, {
            props: {
                media: [
                    {
                        url: 'https://example.com/image.jpg',
                        mimeType: 'image/jpeg',
                        alt: 'open image',
                    },
                    {
                        url: 'https://example.com/video.mp4',
                        mimeType: 'video/mp4',
                        alt: 'open video',
                    },
                ],
                onImageOpen,
            },
        });

        await waitFor(() => {
            expect(screen.getByAltText('open image')).toBeTruthy();
        });

        await fireEvent.click(screen.getByAltText('open image'));

        expect(onImageOpen).toHaveBeenCalledWith({
            index: 0,
            mediaList: [
                {
                    id: 'https://example.com/image.jpg',
                    src: 'https://example.com/image.jpg',
                    alt: 'open image',
                    type: 'image',
                    dim: undefined,
                },
            ],
        });
    });

    it('画像の URL コピーボタン押下は fullscreen 起動へ伝播しない', async () => {
        vi.mocked(postMediaCacheServiceMock.getCachedMediaDescriptor)
            .mockResolvedValue({
                cacheKey: 'https://example.com/image.jpg',
                url: 'https://example.com/image.jpg',
                mimeType: 'image/jpeg',
                size: 10,
                source: 'uploaded',
                kind: 'image',
            });
        vi.mocked(postMediaCacheServiceMock.createCachedMediaObjectUrl)
            .mockResolvedValue({
                cacheKey: 'https://example.com/image.jpg',
                url: 'https://example.com/image.jpg',
                mimeType: 'image/jpeg',
                size: 10,
                source: 'uploaded',
                kind: 'image',
                objectUrl: 'blob:image-preview',
            });

        const onImageOpen = vi.fn();

        render(PostHistoryMediaList, {
            props: {
                media: [
                    {
                        url: 'https://example.com/image.jpg',
                        mimeType: 'image/jpeg',
                        alt: 'copy target image',
                    },
                ],
                onImageOpen,
            },
        });

        await waitFor(() => {
            expect(screen.getByAltText('copy target image')).toBeTruthy();
        });

        await fireEvent.click(screen.getByRole('button', { name: 'URLをコピー' }));

        expect(clipboardMock.tryCopyToClipboard).toHaveBeenCalledWith(
            'https://example.com/image.jpg',
            'URL',
            navigator,
            window,
        );
        expect(onImageOpen).not.toHaveBeenCalled();
    });

    it('secure context でない場合は Cache API を使わず直接 URL を描画する', async () => {
        vi.mocked(postMediaCacheServiceMock.canUsePersistentCache).mockReturnValue(false);

        const { container } = render(PostHistoryMediaList, {
            props: {
                media: [
                    {
                        url: 'https://example.com/direct-image.jpg',
                        mimeType: 'image/jpeg',
                        alt: 'direct image',
                    },
                    {
                        url: 'https://example.com/direct-video.mp4',
                        mimeType: 'video/mp4',
                        alt: 'direct video',
                    },
                ],
            },
        });

        await waitFor(() => {
            expect(screen.getByAltText('direct image')).toBeTruthy();
            expect(screen.getByText('direct video')).toBeTruthy();
        });

        expect(postMediaCacheServiceMock.getCachedMediaDescriptor).not.toHaveBeenCalled();
        expect(postMediaCacheServiceMock.fetchAndCacheMedia).not.toHaveBeenCalled();
        expect(screen.getByAltText('direct image').getAttribute('src')).toBe(
            'https://example.com/direct-image.jpg',
        );
        expect(container.querySelector('video')?.getAttribute('src')).toBe(
            'https://example.com/direct-video.mp4',
        );
    });
});