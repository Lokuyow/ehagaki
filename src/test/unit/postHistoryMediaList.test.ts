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

function expectSingleImageLayoutFrameContract(layoutFrame: Element | null): void {
    expect(layoutFrame).toBeTruthy();
    expect(layoutFrame?.getAttribute('style')).toContain('width: 100%');
    expect(layoutFrame?.getAttribute('style')).toContain('max-height: 300px');
    expect(layoutFrame?.getAttribute('style')).toContain('min-height: 100px');
    expect(layoutFrame?.getAttribute('style')).toContain('padding: 0');
}

function expectTallSingleImageLayoutFrameContract(layoutFrame: Element | null): void {
    expectSingleImageLayoutFrameContract(layoutFrame);
    expect(layoutFrame?.getAttribute('style')).toContain('aspect-ratio: 100 / 300');
}

function expectSingleImageObjectFitContract(image: HTMLElement): void {
    expect(image.getAttribute('style')).toContain('position: absolute');
    expect(image.getAttribute('style')).toContain('inset: 0');
    expect(image.getAttribute('style')).toContain('object-fit: cover');
    expect(image.getAttribute('style')).toContain('object-position: center');
}

describe('PostHistoryMediaList', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        vi.spyOn(HTMLCanvasElement.prototype, 'getContext')
            .mockReturnValue(null);
        intersectionObserverInstances.length = 0;
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

    it('1枚の画像は最小操作領域を確保しつつアスペクト比を保つ', async () => {
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

        const image = screen.getByAltText('single image');
        const surface = screen.getByRole('button', {
            name: '開く single image',
        });
        const frame = surface.parentElement;
        const layoutFrame = surface.querySelector(
            '.post-history-single-image-layout-frame',
        );

        expect(frame).toBeTruthy();
        expect(layoutFrame).toBeTruthy();
        expect(frame?.getAttribute('style')).toContain(
            'width: max(min(100%, 450px), min(100%, 150px))',
        );
        expect(surface.getAttribute('style')).toContain('width: 100%');
        expect(surface.getAttribute('style')).toContain('min-height: 100px');
        expect(layoutFrame?.getAttribute('style')).toContain(
            'aspect-ratio: 1200 / 800',
        );
        expectSingleImageLayoutFrameContract(layoutFrame);
        expect(image.getAttribute('width')).toBe('1200');
        expect(image.getAttribute('height')).toBe('800');
        expect(
            surface.querySelector('.post-history-image-placeholder-single'),
        ).toBeNull();
        expectSingleImageObjectFitContract(image);
    });

    it('1枚の縦長画像はステージ幅を確保しつつ実画像の比率を保つ', async () => {
        vi.mocked(postMediaCacheServiceMock.getCachedMediaDescriptor)
            .mockResolvedValue({
                cacheKey: 'https://example.com/tall.webp',
                url: 'https://example.com/tall.webp',
                mimeType: 'image/webp',
                size: 10,
                source: 'uploaded',
                kind: 'image',
            });
        vi.mocked(postMediaCacheServiceMock.createCachedMediaObjectUrl)
            .mockResolvedValue({
                cacheKey: 'https://example.com/tall.webp',
                url: 'https://example.com/tall.webp',
                mimeType: 'image/webp',
                size: 10,
                source: 'uploaded',
                kind: 'image',
                objectUrl: 'blob:tall-image',
            });

        render(PostHistoryMediaList, {
            props: {
                media: [
                    {
                        url: 'https://example.com/tall.webp',
                        mimeType: 'image/webp',
                        alt: 'tall image',
                        dim: '40x511',
                    },
                ],
            },
        });

        await waitFor(() => {
            expect(screen.getByAltText('tall image')).toBeTruthy();
        });

        const image = screen.getByAltText('tall image');
        const surface = screen.getByRole('button', {
            name: '開く tall image',
        });
        const frame = surface.parentElement;
        const layoutFrame = surface.querySelector(
            '.post-history-single-image-layout-frame',
        );

        expect(frame).toBeTruthy();
        expect(layoutFrame).toBeTruthy();
        expect(frame?.getAttribute('style')).toContain(
            'width: max(min(100%, 23.483366px), min(100%, 100px))',
        );
        expectTallSingleImageLayoutFrameContract(layoutFrame);
        expect(image.getAttribute('width')).toBe('40');
        expect(image.getAttribute('height')).toBe('511');
        expectSingleImageObjectFitContract(image);
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

    it('縦長の単一画像はキャッシュ判定中も300pxステージ契約を維持する', async () => {
        vi.mocked(postMediaCacheServiceMock.getCachedMediaDescriptor)
            .mockImplementation(() => new Promise(() => undefined));

        const { container } = render(PostHistoryMediaList, {
            props: {
                media: [
                    {
                        url: 'https://example.com/tall-loading.webp',
                        mimeType: 'image/webp',
                        alt: 'tall loading image',
                        blurhash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
                        dim: '40x511',
                    },
                ],
            },
        });

        await waitFor(() => {
            expect(
                container.querySelector('.post-history-media-placeholder-blurhash'),
            ).toBeTruthy();
        });

        const frame = container.querySelector(
            '.post-history-image-surface-frame-single',
        );
        const placeholder = container.querySelector(
            '.post-history-image-placeholder-single',
        );
        const layoutFrame = container.querySelector(
            '.post-history-single-image-layout-frame',
        );

        expect(frame?.getAttribute('style')).toContain(
            'width: max(min(100%, 23.483366px), min(100%, 100px))',
        );
        expect(placeholder).toBeTruthy();
        expectTallSingleImageLayoutFrameContract(layoutFrame);
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
            expect(
                screen.getByRole('button', { name: '開く cached loading image' }),
            ).toBeTruthy();
        });

        expect(screen.queryByAltText('cached loading image')).toBeNull();
        expect(
            container.querySelector('.post-history-media-placeholder-blurhash'),
        ).toBeNull();
        expect(
            container.querySelector('.post-history-image-placeholder-single'),
        ).toBeNull();
        expectTallSingleImageLayoutFrameContract(
            container.querySelector('.post-history-single-image-layout-frame'),
        );
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

        const placeholder = container.querySelector(
            '.post-history-image-placeholder-single',
        );
        const layoutFrame = container.querySelector(
            '.post-history-single-image-layout-frame',
        );

        expect(placeholder).toBeTruthy();
        expect(layoutFrame?.getAttribute('style')).toContain(
            'aspect-ratio: 1200 / 800',
        );
        expectSingleImageLayoutFrameContract(layoutFrame);
    });

    it('横長の単一画像プレースホルダーは最低高さ相当の幅を確保する', async () => {
        vi.mocked(postMediaCacheServiceMock.getCachedMediaDescriptor)
            .mockResolvedValue(null);
        vi.mocked(postMediaCacheServiceMock.fetchAndCacheMedia)
            .mockImplementation(() => new Promise(() => undefined));

        const { container } = render(PostHistoryMediaList, {
            props: {
                media: [
                    {
                        url: 'https://example.com/wide-loading.png',
                        mimeType: 'image/png',
                        alt: 'wide loading image',
                        dim: '4000x500',
                    },
                ],
            },
        });

        await waitFor(() => {
            expect(postMediaCacheServiceMock.fetchAndCacheMedia).toHaveBeenCalledWith({
                url: 'https://example.com/wide-loading.png',
                mimeType: 'image/png',
            });
        });

        const frame = container.querySelector(
            '.post-history-image-surface-frame-single',
        );
        const placeholder = container.querySelector(
            '.post-history-image-placeholder-single',
        );
        const layoutFrame = container.querySelector(
            '.post-history-single-image-layout-frame',
        );

        expect(frame).toBeTruthy();
        expect(frame?.getAttribute('style')).toContain(
            'width: max(min(100%, 2400px), min(100%, 800px))',
        );
        expect(placeholder).toBeTruthy();
        expect(layoutFrame?.getAttribute('style')).toContain(
            'aspect-ratio: 4000 / 500',
        );
        expectSingleImageLayoutFrameContract(layoutFrame);
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
