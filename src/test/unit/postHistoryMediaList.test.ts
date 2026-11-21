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
    getCachedMediaDescriptorSnapshot: vi.fn(),
    getCachedMediaObjectUrlSnapshot: vi.fn(),
    prefetchCachedMediaDescriptors: vi.fn(),
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

let autoIntersect = true;

class MockIntersectionObserver {
    constructor(
        private callback: IntersectionObserverCallback,
    ) {
        intersectionObserverInstances.push(this);
    }

    disconnect = vi.fn();
    observe = vi.fn((target: Element) => {
        if (autoIntersect) queueMicrotask(() => this.intersect(target));
    });
    intersect(target: Element) {
        this.callback(
            [{ isIntersecting: true, target } as IntersectionObserverEntry],
            this as unknown as IntersectionObserver,
        );
    }
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
        vi.spyOn(HTMLCanvasElement.prototype, 'getContext')
            .mockReturnValue(null);
        intersectionObserverInstances.length = 0;
        autoIntersect = true;
        vi.mocked(postMediaCacheServiceMock.canUsePersistentCache).mockReturnValue(true);
        vi.mocked(postMediaCacheServiceMock.getCachedMediaDescriptorSnapshot).mockReturnValue(undefined);
        vi.mocked(postMediaCacheServiceMock.getCachedMediaObjectUrlSnapshot).mockReturnValue(null);
        vi.mocked(postMediaCacheServiceMock.prefetchCachedMediaDescriptors).mockResolvedValue(undefined);
        vi.stubGlobal(
            'IntersectionObserver',
            MockIntersectionObserver as unknown as typeof IntersectionObserver,
        );
        clipboardMock.tryCopyToClipboard.mockResolvedValue(true);
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it('画像と動画を入力順で同じギャラリーに表示し、動画は手動再生する', async () => {
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
                media: [media[1], media[0]],
            },
        });
        const initialVideoFrameStyle = container
            .querySelector('.post-history-video-media-frame')
            ?.getAttribute('style');

        await waitFor(() => {
            expect(screen.getByAltText('cached image')).toBeTruthy();
            expect(container.querySelector('video')).toBeTruthy();
        });
        expect(
            vi.mocked(postMediaCacheServiceMock.createCachedMediaObjectUrl),
        ).toHaveBeenCalledTimes(2);

        const gallery = container.querySelector('.media-gallery');
        expect(Array.from(gallery?.querySelectorAll('img, video') ?? [], element => element.tagName)).toEqual(['VIDEO', 'IMG']);
        const video = container.querySelector('video');
        expect(video?.hasAttribute('autoplay')).toBe(false);
        expect(video?.getAttribute('controls')).not.toBeNull();
        expect(video?.getAttribute('playsinline')).not.toBeNull();
        expect(video?.getAttribute('preload')).toBe('metadata');
        expect(
            container.querySelector('.post-history-video-media-frame')
                ?.getAttribute('style'),
        ).toBe(initialVideoFrameStyle);
        expect(
            container.querySelector('.post-history-media-placeholder-blurhash'),
        ).toBeNull();

        await rerender({
            media: [media[1], media[0]],
        });

        expect(
            vi.mocked(postMediaCacheServiceMock.createCachedMediaObjectUrl),
        ).toHaveBeenCalledTimes(2);
        expect(screen.getByAltText('cached image')).toBeTruthy();
    });

    it('descriptor と object url snapshot があれば初回描画から同期表示する', async () => {
        vi.mocked(postMediaCacheServiceMock.getCachedMediaDescriptorSnapshot)
            .mockReturnValue({
                cacheKey: 'https://example.com/snapshot.jpg',
                url: 'https://example.com/snapshot.jpg',
                mimeType: 'image/jpeg',
                size: 10,
                source: 'uploaded',
                kind: 'image',
            });
        vi.mocked(postMediaCacheServiceMock.getCachedMediaObjectUrlSnapshot)
            .mockReturnValue({
                cacheKey: 'https://example.com/snapshot.jpg',
                url: 'https://example.com/snapshot.jpg',
                mimeType: 'image/jpeg',
                size: 10,
                source: 'uploaded',
                kind: 'image',
                objectUrl: 'blob:snapshot-image',
            });

        const { container, unmount } = render(PostHistoryMediaList, {
            props: {
                media: [
                    {
                        url: 'https://example.com/snapshot.jpg',
                        mimeType: 'image/jpeg',
                        alt: 'snapshot image',
                    },
                ],
            },
        });

        await waitFor(() => {
            expect(screen.getByAltText('snapshot image')).toBeTruthy();
        });

        expect(screen.getByAltText('snapshot image').getAttribute('src')).toBe(
            'blob:snapshot-image',
        );
        expect(
            container.querySelector('.post-history-media-placeholder-blurhash'),
        ).toBeNull();
        expect(
            container.querySelector('.post-history-media-placeholder-loader'),
        ).toBeNull();
        expect(postMediaCacheServiceMock.getCachedMediaDescriptor).not.toHaveBeenCalled();
        expect(postMediaCacheServiceMock.createCachedMediaObjectUrl).not.toHaveBeenCalled();

        unmount();
        expect(postMediaCacheServiceMock.revokeObjectUrl).toHaveBeenCalledWith(
            'blob:snapshot-image',
        );
    });

    it('null descriptor snapshot の item は通常 resolve を省略して自動取得へ進む', async () => {
        vi.mocked(postMediaCacheServiceMock.getCachedMediaDescriptorSnapshot)
            .mockReturnValue(null);
        vi.mocked(postMediaCacheServiceMock.fetchAndCacheMedia)
            .mockResolvedValue(null);

        render(PostHistoryMediaList, {
            props: {
                media: [
                    {
                        url: 'https://example.com/snapshot-miss.png',
                        mimeType: 'image/png',
                        alt: 'snapshot miss image',
                    },
                ],
            },
        });

        await waitFor(() => {
            expect(postMediaCacheServiceMock.fetchAndCacheMedia).toHaveBeenCalledWith({
                url: 'https://example.com/snapshot-miss.png',
                mimeType: 'image/png',
            });
        });

        expect(postMediaCacheServiceMock.getCachedMediaDescriptor).not.toHaveBeenCalled();
    });

    it('初回に寸法不明だった画像と動画は後から判明した寸法で表示枠を変えない', async () => {
        vi.mocked(postMediaCacheServiceMock.getCachedMediaDescriptor)
            .mockResolvedValue(null);
        vi.mocked(postMediaCacheServiceMock.fetchAndCacheMedia)
            .mockImplementation(() => new Promise(() => undefined));

        const view = render(PostHistoryMediaList, {
            props: {
                media: [
                    {
                        url: 'https://example.com/unknown.jpg',
                        mimeType: 'image/jpeg',
                    },
                    {
                        url: 'https://example.com/unknown.mp4',
                        mimeType: 'video/mp4',
                    },
                ],
            },
        });

        await waitFor(() => {
            expect(
                view.container.querySelector('.post-history-video-media-frame'),
            ).toBeTruthy();
        });

        const imageFrame = view.container.querySelector(
            '.post-history-image-cell',
        );
        const videoFrame = view.container.querySelector(
            '.post-history-video-media-frame',
        );
        expect(imageFrame?.getAttribute('style')).toContain('--post-preview-gallery-aspect-ratio: 1');
        expect(videoFrame?.getAttribute('style')).toBeNull();

        await view.rerender({
            media: [
                {
                    url: 'https://example.com/unknown.jpg',
                    mimeType: 'image/jpeg',
                    dim: '1600x900',
                },
                {
                    url: 'https://example.com/unknown.mp4',
                    mimeType: 'video/mp4',
                    dim: '1920x1080',
                },
            ],
        });

        expect(
            view.container.querySelector('.post-history-image-cell')
                ?.getAttribute('style'),
        ).toContain('--post-preview-gallery-aspect-ratio: 1');
        expect(
            view.container.querySelector('.post-history-video-media-frame')
                ?.getAttribute('style'),
        ).toBeNull();
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

    it('cached だが object url 生成中の画像は透明レイアウトフレームのみを維持する', async () => {
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
                        dim: '40x511',
                    },
                ],
            },
        });

        await waitFor(() => {
            expect(postMediaCacheServiceMock.createCachedMediaObjectUrl).toHaveBeenCalled();
        });

        expect(screen.queryByAltText('cached loading image')).toBeNull();
        expect(container.querySelector('.post-history-media-placeholder')).toBeNull();
        const card = container.querySelector<HTMLElement>('.post-history-image-cell');
        expect(card?.style.getPropertyValue('--post-preview-gallery-aspect-ratio')).toBe(String(40 / 511));
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
                        dim: '1200x800',
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

        const card = container.querySelector<HTMLElement>('.post-history-image-cell');
        expect(card?.style.getPropertyValue('--post-preview-gallery-aspect-ratio')).toBe('1.5');
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

    it('複数画像の一部だけが失敗してもギャラリーの項目数を維持する', async () => {
        vi.mocked(postMediaCacheServiceMock.getCachedMediaDescriptor)
            .mockResolvedValue(null);
        vi.mocked(postMediaCacheServiceMock.fetchAndCacheMedia)
            .mockImplementation(async ({ url }: { url: string }) =>
                url.endsWith('/2.jpg')
                    ? null
                    : {
                          cacheKey: url,
                          url,
                          mimeType: 'image/jpeg',
                          size: 6,
                          source: 'network',
                          kind: 'image',
                      },
            );
        vi.mocked(postMediaCacheServiceMock.createCachedMediaObjectUrl)
            .mockImplementation(async (url: string) => ({
                cacheKey: url,
                url,
                mimeType: 'image/jpeg',
                size: 6,
                source: 'network',
                kind: 'image',
                objectUrl: `blob:${url}`,
            }));

        const { container } = render(PostHistoryMediaList, {
            props: {
                media: Array.from({ length: 4 }, (_, index) => ({
                    url: `https://example.com/${index + 1}.jpg`,
                    mimeType: 'image/jpeg',
                    alt: `image ${index + 1}`,
                })),
            },
        });

        await screen.findByRole('button', { name: '再取得して保存' });
        expect(container.querySelectorAll('.media-gallery')).toHaveLength(1);
        expect(container.querySelectorAll('.media-gallery-cell')).toHaveLength(4);
        expect(container.querySelectorAll(
            '.post-history-media-placeholder-failed',
        )).toHaveLength(1);
    });

    it('fetch が CORS で失敗した画像は元 URL を直接描画する', async () => {
        vi.mocked(postMediaCacheServiceMock.getCachedMediaDescriptor)
            .mockResolvedValue(null);
        vi.mocked(postMediaCacheServiceMock.fetchAndCacheMedia)
            .mockRejectedValue(new TypeError('Failed to fetch'));

        render(PostHistoryMediaList, {
            props: {
                media: [
                    {
                        url: 'https://example.com/cors-image.jpg',
                        mimeType: 'image/jpeg',
                        alt: 'cors image',
                    },
                ],
            },
        });

        await waitFor(() => {
            expect(
                postMediaCacheServiceMock.fetchAndCacheMedia,
            ).toHaveBeenCalledWith({
                url: 'https://example.com/cors-image.jpg',
                mimeType: 'image/jpeg',
            });
        });

        await waitFor(() => {
            expect(screen.getByAltText('cors image')).toBeTruthy();
        });

        expect(screen.getByAltText('cors image').getAttribute('src')).toBe(
            'https://example.com/cors-image.jpg',
        );
        expect(
            screen.queryByRole('button', { name: '再取得して保存' }),
        ).toBeNull();
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
            focusOrigin: expect.any(HTMLButtonElement),
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
        await waitFor(() => {
            expect(screen.getByText('URLをコピーしました')).toBeTruthy();
        });
        expect(onImageOpen).not.toHaveBeenCalled();
    });

    it('secure context でない場合は Cache API を使わず直接 URL を描画する', async () => {
        vi.mocked(postMediaCacheServiceMock.canUsePersistentCache).mockReturnValue(false);
        autoIntersect = false;

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

        await waitFor(() => expect(intersectionObserverInstances).toHaveLength(2));
        expect(container.querySelector('img, video')).toBeNull();
        for (const observer of intersectionObserverInstances) {
            observer.intersect(observer.observe.mock.calls[0][0]);
        }
        await waitFor(() => {
            expect(screen.getByAltText('direct image')).toBeTruthy();
            expect(screen.getByLabelText('direct video')).toBeTruthy();
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

    it('unsafe な media URL は表示対象から除外する', async () => {
        const { container } = render(PostHistoryMediaList, {
            props: {
                media: [
                    {
                        url: 'javascript:alert(1)',
                        mimeType: 'image/jpeg',
                        alt: 'unsafe image',
                    },
                    {
                        url: 'data:text/html,<svg></svg>',
                        mimeType: 'video/mp4',
                        alt: 'unsafe video',
                    },
                    {
                        url: 'https://example.com/safe-image.jpg',
                        mimeType: 'image/jpeg',
                        alt: 'safe image',
                    },
                ],
            },
        });

        await waitFor(() => {
            expect(container.querySelector('[title="safe image"]')).toBeTruthy();
        });

        expect(screen.queryByAltText('unsafe image')).toBeNull();
        expect(screen.queryByText('unsafe video')).toBeNull();
        expect(
            Array.from(container.querySelectorAll('[title]')).map((node) =>
                node.getAttribute('title'),
            ),
        ).toContain('safe image');
    });
});
