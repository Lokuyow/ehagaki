import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/svelte';
import { readable } from 'svelte/store';

const translateMock = vi.hoisted(() => (key: string) => {
    const translations: Record<string, string> = {
        'postHistory.mediaCached': 'キャッシュ済み',
        'postHistory.mediaNotCached': '未キャッシュ',
        'postHistory.mediaLoading': '読み込み中...',
        'videoNode.not_supported': 'video unsupported',
    };

    return translations[key] || key;
});

const postMediaCacheServiceMock = vi.hoisted(() => ({
    getCachedMediaDescriptor: vi.fn(),
    createCachedMediaObjectUrl: vi.fn(),
    fetchAndCacheMedia: vi.fn(),
    revokeObjectUrl: vi.fn(),
}));

vi.mock('svelte-i18n', () => ({
    _: readable(translateMock),
}));

vi.mock('../../lib/postMediaCacheService', () => ({
    postMediaCacheService: postMediaCacheServiceMock,
}));

import PostHistoryMediaList from '../../components/PostHistoryMediaList.svelte';

describe('PostHistoryMediaList', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('cached media は URL の代わりに直接表示する', async () => {
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

        const { container } = render(PostHistoryMediaList, {
            props: {
                media: [
                    {
                        url: 'https://example.com/video.mp4',
                        mimeType: 'video/mp4',
                    },
                ],
            },
        });

        await waitFor(() => {
            expect(container.querySelector('video')).toBeTruthy();
        });
        expect(
            vi.mocked(postMediaCacheServiceMock.createCachedMediaObjectUrl),
        ).toHaveBeenCalledWith('https://example.com/video.mp4');
        expect(screen.queryByRole('button')).toBeNull();
        expect(screen.getByRole('link').getAttribute('href')).toBe(
            'https://example.com/video.mp4',
        );
    });

    it('uncached media はプレースホルダー自体のクリックで再取得して保存する', async () => {
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

        await fireEvent.click(
            screen.getByRole('button', { name: 'uncached image' }),
        );

        expect(postMediaCacheServiceMock.fetchAndCacheMedia).toHaveBeenCalledWith({
            url: 'https://example.com/uncached.png',
            mimeType: 'image/png',
        });
        await waitFor(() => {
            expect(screen.getByAltText('uncached image')).toBeTruthy();
        });
        expect(
            vi.mocked(postMediaCacheServiceMock.createCachedMediaObjectUrl),
        ).toHaveBeenCalledWith('https://example.com/uncached.png');
    });
});