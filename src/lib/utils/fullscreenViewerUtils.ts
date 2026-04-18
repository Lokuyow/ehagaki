import type { FullscreenMediaItem } from '../types';
import { parseDimString } from './mediaNodeUtils';

export const FULLSCREEN_IMAGE_FALLBACK_SIZE = {
    width: 1600,
    height: 900,
} as const;

export const FULLSCREEN_VIDEO_FALLBACK_SIZE = {
    width: 1280,
    height: 720,
} as const;

type ImageFactory = () => HTMLImageElement;
type VideoFactory = () => HTMLVideoElement;

function resolveDimensionsFromItem(item: FullscreenMediaItem) {
    if (item.width && item.height) {
        return { width: item.width, height: item.height };
    }

    return parseDimString(item.dim);
}

export async function resolveFullscreenImageSize(
    item: FullscreenMediaItem,
    createImage: ImageFactory = () => new Image(),
): Promise<{ width: number; height: number }> {
    const resolvedDimensions = resolveDimensionsFromItem(item);
    if (resolvedDimensions) {
        return resolvedDimensions;
    }

    if (typeof Image === 'undefined') {
        return FULLSCREEN_IMAGE_FALLBACK_SIZE;
    }

    return await new Promise((resolve) => {
        const imageElement = createImage();
        imageElement.decoding = 'async';

        imageElement.onload = () => {
            resolve({
                width: imageElement.naturalWidth || FULLSCREEN_IMAGE_FALLBACK_SIZE.width,
                height: imageElement.naturalHeight || FULLSCREEN_IMAGE_FALLBACK_SIZE.height,
            });
        };

        imageElement.onerror = () => {
            resolve(FULLSCREEN_IMAGE_FALLBACK_SIZE);
        };

        imageElement.src = item.src;
    });
}

export async function resolveFullscreenVideoSize(
    item: FullscreenMediaItem,
    createVideo: VideoFactory = () => document.createElement('video'),
): Promise<{ width: number; height: number }> {
    const resolvedDimensions = resolveDimensionsFromItem(item);
    if (resolvedDimensions) {
        return resolvedDimensions;
    }

    if (typeof document === 'undefined') {
        return FULLSCREEN_VIDEO_FALLBACK_SIZE;
    }

    return await new Promise((resolve) => {
        const videoElement = createVideo();
        let resolved = false;

        const cleanup = () => {
            videoElement.onloadedmetadata = null;
            videoElement.onerror = null;
            videoElement.src = '';
            videoElement.load?.();
        };

        const finish = (size: { width: number; height: number }) => {
            if (resolved) {
                return;
            }

            resolved = true;
            cleanup();
            resolve(size);
        };

        videoElement.preload = 'metadata';
        videoElement.muted = true;
        videoElement.playsInline = true;

        videoElement.onloadedmetadata = () => {
            finish({
                width: videoElement.videoWidth || FULLSCREEN_VIDEO_FALLBACK_SIZE.width,
                height: videoElement.videoHeight || FULLSCREEN_VIDEO_FALLBACK_SIZE.height,
            });
        };

        videoElement.onerror = () => {
            finish(FULLSCREEN_VIDEO_FALLBACK_SIZE);
        };

        videoElement.src = item.src;
    });
}

export async function buildFullscreenViewerDataSource(
    items: FullscreenMediaItem[],
    createImage?: ImageFactory,
    createVideo?: VideoFactory,
) {
    return await Promise.all(
        items.map(async (item) => {
            if (item.type === 'video') {
                const size = await resolveFullscreenVideoSize(item, createVideo);

                return {
                    ...item,
                    type: 'video',
                    width: size.width,
                    height: size.height,
                };
            }

            const size = await resolveFullscreenImageSize(item, createImage);

            return {
                ...item,
                type: 'image',
                width: size.width,
                height: size.height,
            };
        }),
    );
}

export function createFullscreenVideoSlideElement(
    item: FullscreenMediaItem,
    doc: Document = document,
): HTMLDivElement {
    const container = doc.createElement('div');
    container.className = 'ehagaki-pswp-video-container';

    const videoElement = doc.createElement('video');
    videoElement.className = 'ehagaki-pswp-video';
    videoElement.src = item.src;
    videoElement.controls = true;
    videoElement.playsInline = true;
    videoElement.preload = 'metadata';

    if (item.alt) {
        videoElement.setAttribute('aria-label', item.alt);
    }

    const trackElement = doc.createElement('track');
    trackElement.kind = 'captions';
    videoElement.appendChild(trackElement);
    container.appendChild(videoElement);

    return container;
}

export function pauseFullscreenVideoContent(content: {
    element?: ParentNode | null;
}) {
    const videoElement = content.element?.querySelector?.('video');
    if (videoElement instanceof HTMLVideoElement) {
        videoElement.pause();
    }
}