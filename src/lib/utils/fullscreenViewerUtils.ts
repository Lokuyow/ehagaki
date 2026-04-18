import type { FullscreenMediaItem } from '../types';

export const FULLSCREEN_IMAGE_FALLBACK_SIZE = {
    width: 1600,
    height: 900,
} as const;

export const FULLSCREEN_VIDEO_FALLBACK_SIZE = {
    width: 1280,
    height: 720,
} as const;

type ImageFactory = () => HTMLImageElement;

export async function resolveFullscreenImageSize(
    item: FullscreenMediaItem,
    createImage: ImageFactory = () => new Image(),
): Promise<{ width: number; height: number }> {
    if (item.width && item.height) {
        return { width: item.width, height: item.height };
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

export async function buildFullscreenViewerDataSource(
    items: FullscreenMediaItem[],
    createImage?: ImageFactory,
) {
    return await Promise.all(
        items.map(async (item) => {
            if (item.type === 'video') {
                return {
                    ...item,
                    type: 'video',
                    width: item.width ?? FULLSCREEN_VIDEO_FALLBACK_SIZE.width,
                    height: item.height ?? FULLSCREEN_VIDEO_FALLBACK_SIZE.height,
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