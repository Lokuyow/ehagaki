import type { PostMediaKind } from '../postMediaCacheUtils';
import { inferPostMediaKind } from '../postMediaCacheUtils';
import { postMediaCacheService } from '../postMediaCacheService';
import type { PostHistoryMediaRecord } from '../storage/ehagakiDb';

export interface ResolvedPostHistoryMediaItem {
    url: string;
    alt?: string;
    mimeType?: string;
    kind: PostMediaKind;
    cached: boolean;
    previewObjectUrl?: string;
    size?: number;
    source?: 'uploaded' | 'network';
    isLoadingPreview: boolean;
}

export function usePostHistoryMediaCache(params: {
    getMedia: () => PostHistoryMediaRecord[];
}) {
    const state = $state({
        items: [] as ResolvedPostHistoryMediaItem[],
    });
    const activeObjectUrls = new Map<string, string>();

    function revokeTrackedObjectUrl(url: string): void {
        const objectUrl = activeObjectUrls.get(url);
        if (!objectUrl) {
            return;
        }

        postMediaCacheService.revokeObjectUrl(objectUrl);
        activeObjectUrls.delete(url);
    }

    function revokeAllObjectUrls(): void {
        for (const objectUrl of activeObjectUrls.values()) {
            postMediaCacheService.revokeObjectUrl(objectUrl);
        }
        activeObjectUrls.clear();
    }

    function toBaseItem(
        media: PostHistoryMediaRecord,
    ): ResolvedPostHistoryMediaItem {
        return {
            url: media.url,
            alt: media.alt,
            mimeType: media.mimeType,
            kind: inferPostMediaKind({
                url: media.url,
                mimeType: media.mimeType,
            }),
            cached: false,
            isLoadingPreview: false,
        };
    }

    async function loadCachedVideo(url: string): Promise<void> {
        const targetIndex = state.items.findIndex((item) => item.url === url);
        if (targetIndex < 0) {
            return;
        }

        const target = state.items[targetIndex];
        if (
            !target.cached ||
            target.kind !== 'video' ||
            target.previewObjectUrl ||
            target.isLoadingPreview
        ) {
            return;
        }

        state.items = state.items.map((item, index) =>
            index === targetIndex
                ? { ...item, isLoadingPreview: true }
                : item,
        );

        const cached = await postMediaCacheService.createCachedMediaObjectUrl(url);
        if (!cached) {
            state.items = state.items.map((item, index) =>
                index === targetIndex
                    ? { ...item, isLoadingPreview: false }
                    : item,
            );
            return;
        }

        revokeTrackedObjectUrl(url);
        activeObjectUrls.set(url, cached.objectUrl);
        state.items = state.items.map((item, index) =>
            index === targetIndex
                ? {
                    ...item,
                    cached: true,
                    previewObjectUrl: cached.objectUrl,
                    mimeType: cached.mimeType,
                    kind: cached.kind,
                    size: cached.size,
                    source: cached.source,
                    isLoadingPreview: false,
                }
                : item,
        );
    }

    $effect(() => {
        const mediaItems = params.getMedia();
        let cancelled = false;

        revokeAllObjectUrls();
        state.items = mediaItems.map(toBaseItem);

        void (async () => {
            const resolvedItems = await Promise.all(
                mediaItems.map(async (media) => {
                    const baseItem = toBaseItem(media);
                    const descriptor = await postMediaCacheService.getCachedMediaDescriptor(
                        media.url,
                    );
                    if (!descriptor) {
                        return baseItem;
                    }

                    if (descriptor.kind !== 'image') {
                        return {
                            ...baseItem,
                            cached: true,
                            kind: descriptor.kind,
                            mimeType: descriptor.mimeType,
                            size: descriptor.size,
                            source: descriptor.source,
                        } satisfies ResolvedPostHistoryMediaItem;
                    }

                    const cachedImage = await postMediaCacheService.createCachedMediaObjectUrl(
                        media.url,
                    );
                    if (!cachedImage) {
                        return {
                            ...baseItem,
                            cached: true,
                            kind: descriptor.kind,
                            mimeType: descriptor.mimeType,
                            size: descriptor.size,
                            source: descriptor.source,
                        } satisfies ResolvedPostHistoryMediaItem;
                    }

                    if (cancelled) {
                        postMediaCacheService.revokeObjectUrl(
                            cachedImage.objectUrl,
                        );
                        return baseItem;
                    }

                    activeObjectUrls.set(media.url, cachedImage.objectUrl);
                    return {
                        ...baseItem,
                        cached: true,
                        previewObjectUrl: cachedImage.objectUrl,
                        kind: cachedImage.kind,
                        mimeType: cachedImage.mimeType,
                        size: cachedImage.size,
                        source: cachedImage.source,
                    } satisfies ResolvedPostHistoryMediaItem;
                }),
            );

            if (cancelled) {
                return;
            }

            state.items = resolvedItems;
        })();

        return () => {
            cancelled = true;
            revokeAllObjectUrls();
        };
    });

    return {
        state,
        loadCachedVideo,
    };
}