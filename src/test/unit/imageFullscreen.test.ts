import { describe, expect, it, vi } from 'vitest';

import {
    buildFullscreenViewerDataSource,
    createFullscreenVideoSlideElement,
    pauseFullscreenVideoContent,
    resolveFullscreenVideoSize,
} from '../../lib/utils/fullscreenViewerUtils';

describe('fullscreenViewerUtils', () => {
    it('既存寸法がある画像はそのまま dataSource へ変換する', async () => {
        await expect(buildFullscreenViewerDataSource([
            {
                id: 'image-1',
                src: 'https://example.com/test.jpg',
                alt: 'test image',
                type: 'image',
                width: 1200,
                height: 800,
            },
        ])).resolves.toEqual([
            {
                id: 'image-1',
                src: 'https://example.com/test.jpg',
                alt: 'test image',
                type: 'image',
                width: 1200,
                height: 800,
            },
        ]);
    });

    it('動画は dim があればその寸法を dataSource に使う', async () => {
        await expect(buildFullscreenViewerDataSource([
            {
                id: 'video-1',
                src: 'https://example.com/test.mp4',
                alt: 'test video',
                type: 'video',
                dim: '720x1280',
            },
        ])).resolves.toEqual([
            {
                id: 'video-1',
                src: 'https://example.com/test.mp4',
                alt: 'test video',
                type: 'video',
                dim: '720x1280',
                width: 720,
                height: 1280,
            },
        ]);
    });

    it('動画 metadata から実寸を解決できる', async () => {
        const createVideo = () => {
            const video = {
                preload: '',
                muted: false,
                playsInline: false,
                videoWidth: 720,
                videoHeight: 1280,
                onloadedmetadata: null,
                onerror: null,
                load: vi.fn(),
                set src(_value: string) {
                    queueMicrotask(() => {
                        video.onloadedmetadata?.(new Event('loadedmetadata'));
                    });
                },
            } as unknown as HTMLVideoElement;

            return video;
        };

        await expect(resolveFullscreenVideoSize({
            id: 'video-2',
            src: 'https://example.com/vertical.mp4',
            alt: 'vertical video',
            type: 'video',
        }, createVideo)).resolves.toEqual({
            width: 720,
            height: 1280,
        });
    });

    it('寸法がない画像は Image factory から natural size を解決する', async () => {
        const createImage = () => {
            const image = {
                naturalWidth: 640,
                naturalHeight: 480,
                decoding: '',
                onload: null,
                onerror: null,
                set src(_value: string) {
                    queueMicrotask(() => {
                        image.onload?.(new Event('load'));
                    });
                },
            } as unknown as HTMLImageElement;

            return image;
        };

        await expect(buildFullscreenViewerDataSource([
            {
                id: 'image-2',
                src: 'https://example.com/test-2.jpg',
                alt: 'resolved image',
                type: 'image',
            },
        ], createImage)).resolves.toEqual([
            {
                id: 'image-2',
                src: 'https://example.com/test-2.jpg',
                alt: 'resolved image',
                type: 'image',
                width: 640,
                height: 480,
            },
        ]);
    });

    it('動画スライド要素を controls 付きで生成する', () => {
        const element = createFullscreenVideoSlideElement({
            id: 'video-1',
            src: 'https://example.com/test.mp4',
            alt: 'test video',
            type: 'video',
        });

        const videoElement = element.querySelector('video');
        expect(element.className).toBe('ehagaki-pswp-video-container');
        expect(videoElement).toBeTruthy();
        expect(videoElement?.getAttribute('src')).toBe('https://example.com/test.mp4');
        expect(videoElement?.hasAttribute('controls')).toBe(true);
        expect(videoElement?.hasAttribute('playsinline')).toBe(true);
    });

    it('active な動画 content を停止する', () => {
        const element = document.createElement('div');
        const videoElement = document.createElement('video');
        const pauseSpy = vi.spyOn(videoElement, 'pause');
        element.appendChild(videoElement);

        pauseFullscreenVideoContent({ element });

        expect(pauseSpy).toHaveBeenCalledOnce();
    });
});