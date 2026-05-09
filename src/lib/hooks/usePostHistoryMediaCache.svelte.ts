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
    isCaching: boolean;
}

export function usePostHistoryMediaCache(params: {
    getMedia: () => PostHistoryMediaRecord[];
}) {
    const state = $state({
        items: [] as ResolvedPostHistoryMediaItem[],
    });
    const activeObjectUrls = new Map<string, string>();
    let resolutionVersion = 0;

    function invalidatePendingResolution(): void {
        resolutionVersion += 1;
    }

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
            isCaching: false,
        };
    }

    function updateItem(
        url: string,
        updater: (item: ResolvedPostHistoryMediaItem) => ResolvedPostHistoryMediaItem,
    ): void {
        state.items = state.items.map((item) =>
            item.url === url ? updater(item) : item,
        );
    }

    async function applyCachedState(params: {
        url: string;
        descriptor: {
            mimeType?: string;
            kind: PostMediaKind;
            size: number;
            source: 'uploaded' | 'network';
        };
        loadPreview: boolean;
    }): Promise<void> {
        const { url, descriptor, loadPreview } = params;

        if (loadPreview && (descriptor.kind === 'image' || descriptor.kind === 'video')) {
            const cached = await postMediaCacheService.createCachedMediaObjectUrl(url);
            if (cached) {
                revokeTrackedObjectUrl(url);
                activeObjectUrls.set(url, cached.objectUrl);
                updateItem(url, (item) => ({
                    ...item,
                    cached: true,
                    previewObjectUrl: cached.objectUrl,
                    mimeType: cached.mimeType,
                    kind: cached.kind,
                    size: cached.size,
                    source: cached.source,
                    isLoadingPreview: false,
                    isCaching: false,
                }));
                return;
            }
        }

        revokeTrackedObjectUrl(url);
        updateItem(url, (item) => ({
            ...item,
            cached: true,
            previewObjectUrl: undefined,
            mimeType: descriptor.mimeType,
            kind: descriptor.kind,
            size: descriptor.size,
            source: descriptor.source,
            isLoadingPreview: false,
            isCaching: false,
        }));
    }

    async function fetchAndCacheMedia(url: string): Promise<void> {
        const target = state.items.find((item) => item.url === url);
        if (!target || target.cached || target.isCaching) {
            return;
        }

        invalidatePendingResolution();
        updateItem(url, (item) => ({ ...item, isCaching: true }));

        try {
            const cached = await postMediaCacheService.fetchAndCacheMedia({
                url,
                mimeType: target.mimeType,
            });
            if (!cached) {
                updateItem(url, (item) => ({ ...item, isCaching: false }));
                return;
            }

            await applyCachedState({
                url,
                descriptor: cached,
                loadPreview: cached.kind === 'image' || cached.kind === 'video',
            });
        } catch {
            updateItem(url, (item) => ({ ...item, isCaching: false }));
        }
    }

    $effect(() => {
        const mediaItems = params.getMedia();
        const currentResolutionVersion = ++resolutionVersion;
        let cancelled = false;
        const nextObjectUrls = new Map<string, string>();

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

                    if (descriptor.kind !== 'image' && descriptor.kind !== 'video') {
                        return {
                            ...baseItem,
                            cached: true,
                            kind: descriptor.kind,
                            mimeType: descriptor.mimeType,
                            size: descriptor.size,
                            source: descriptor.source,
                        } satisfies ResolvedPostHistoryMediaItem;
                    }

                    const cachedMedia = await postMediaCacheService.createCachedMediaObjectUrl(
                        media.url,
                    );
                    if (!cachedMedia) {
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
                            cachedMedia.objectUrl,
                        );
                        return baseItem;
                    }

                    nextObjectUrls.set(media.url, cachedMedia.objectUrl);
                    return {
                        ...baseItem,
                        cached: true,
                        previewObjectUrl: cachedMedia.objectUrl,
                        kind: cachedMedia.kind,
                        mimeType: cachedMedia.mimeType,
                        size: cachedMedia.size,
                        source: cachedMedia.source,
                    } satisfies ResolvedPostHistoryMediaItem;
                }),
            );

            if (cancelled || currentResolutionVersion !== resolutionVersion) {
                for (const objectUrl of nextObjectUrls.values()) {
                    postMediaCacheService.revokeObjectUrl(objectUrl);
                }
                return;
            }

            revokeAllObjectUrls();
            for (const [url, objectUrl] of nextObjectUrls) {
                activeObjectUrls.set(url, objectUrl);
            }
            state.items = resolvedItems;
        })();

        return () => {
            cancelled = true;
            if (currentResolutionVersion === resolutionVersion) {
                resolutionVersion += 1;
            }
            revokeAllObjectUrls();
        };
    });

    return {
        state,
        fetchAndCacheMedia,
    };
}