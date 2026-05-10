import type { PostMediaKind } from '../postMediaCacheUtils';
import { inferPostMediaKind } from '../postMediaCacheUtils';
import { postMediaCacheService } from '../postMediaCacheService';
import type { PostHistoryMediaRecord } from '../storage/ehagakiDb';

export interface ResolvedPostHistoryMediaItem {
    url: string;
    alt?: string;
    mimeType?: string;
    blurhash?: string;
    dim?: string;
    kind: PostMediaKind;
    hasResolvedCache: boolean;
    cached: boolean;
    previewObjectUrl?: string;
    size?: number;
    uploadProtocol?: 'blossom' | 'nip96' | 'custom-http';
    source?: 'uploaded' | 'network';
    isLoadingPreview: boolean;
    isCaching: boolean;
    hasFetchFailed: boolean;
}

export function buildResolvedPostHistoryMediaBaseItem(
    media: PostHistoryMediaRecord,
): ResolvedPostHistoryMediaItem {
    return {
        url: media.url,
        alt: media.alt,
        mimeType: media.mimeType,
        blurhash: media.blurhash,
        dim: media.dim,
        kind: inferPostMediaKind({
            url: media.url,
            mimeType: media.mimeType,
        }),
        hasResolvedCache: false,
        cached: false,
        previewObjectUrl: undefined,
        size: media.size,
        uploadProtocol: media.uploadProtocol,
        source: undefined,
        isLoadingPreview: false,
        isCaching: false,
        hasFetchFailed: false,
    };
}

export function usePostHistoryMediaCache(params: {
    getMedia: () => PostHistoryMediaRecord[];
}) {
    const state = $state({
        items: [] as ResolvedPostHistoryMediaItem[],
    });
    const activeObjectUrls = new Map<string, string>();
    let resolutionVersion = 0;

    function toDirectDisplayItem(
        media: PostHistoryMediaRecord,
    ): ResolvedPostHistoryMediaItem {
        const baseItem = buildResolvedPostHistoryMediaBaseItem(media);

        if (baseItem.kind !== 'image' && baseItem.kind !== 'video') {
            return {
                ...baseItem,
                hasResolvedCache: true,
            };
        }

        return {
            ...baseItem,
            hasResolvedCache: true,
            cached: true,
            previewObjectUrl: media.url,
        };
    }

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
            updateItem(url, (item) => ({
                ...item,
                hasResolvedCache: true,
                cached: true,
                previewObjectUrl: undefined,
                mimeType: descriptor.mimeType,
                kind: descriptor.kind,
                size: descriptor.size,
                source: descriptor.source,
                isLoadingPreview: true,
                isCaching: false,
                hasFetchFailed: false,
            }));

            const cached = await postMediaCacheService.createCachedMediaObjectUrl(url);
            if (cached) {
                revokeTrackedObjectUrl(url);
                activeObjectUrls.set(url, cached.objectUrl);
                updateItem(url, (item) => ({
                    ...item,
                    hasResolvedCache: true,
                    cached: true,
                    previewObjectUrl: cached.objectUrl,
                    mimeType: cached.mimeType,
                    kind: cached.kind,
                    size: cached.size,
                    source: cached.source,
                    isLoadingPreview: false,
                    isCaching: false,
                    hasFetchFailed: false,
                }));
                return;
            }
        }

        revokeTrackedObjectUrl(url);
        updateItem(url, (item) => ({
            ...item,
            hasResolvedCache: true,
            cached: true,
            previewObjectUrl: undefined,
            mimeType: descriptor.mimeType,
            kind: descriptor.kind,
            size: descriptor.size,
            source: descriptor.source,
            isLoadingPreview: false,
            isCaching: false,
            hasFetchFailed: false,
        }));
    }

    async function fetchAndCacheMedia(url: string): Promise<void> {
        const target = state.items.find((item) => item.url === url);
        if (!target || target.cached || target.isCaching) {
            return;
        }

        invalidatePendingResolution();
        updateItem(url, (item) => ({
            ...item,
            isCaching: true,
            hasFetchFailed: false,
        }));

        try {
            const cached = await postMediaCacheService.fetchAndCacheMedia({
                url,
                mimeType: target.mimeType,
            });
            if (!cached) {
                updateItem(url, (item) => ({
                    ...item,
                    isCaching: false,
                    hasFetchFailed: true,
                }));
                return;
            }

            await applyCachedState({
                url,
                descriptor: cached,
                loadPreview: cached.kind === 'image' || cached.kind === 'video',
            });
        } catch {
            updateItem(url, (item) => ({
                ...item,
                isCaching: false,
                hasFetchFailed: true,
            }));
        }
    }

    $effect(() => {
        const mediaItems = params.getMedia();
        const currentResolutionVersion = ++resolutionVersion;
        let cancelled = false;
        const nextObjectUrls = new Map<string, string>();

        if (!postMediaCacheService.canUsePersistentCache()) {
            revokeAllObjectUrls();
            state.items = mediaItems.map(toDirectDisplayItem);

            return () => {
                cancelled = true;
                if (currentResolutionVersion === resolutionVersion) {
                    resolutionVersion += 1;
                }
                revokeAllObjectUrls();
            };
        }

        revokeAllObjectUrls();
        state.items = mediaItems.map(buildResolvedPostHistoryMediaBaseItem);

        void (async () => {
            await Promise.all(
                mediaItems.map(async (media) => {
                    const descriptor = await postMediaCacheService.getCachedMediaDescriptor(
                        media.url,
                    );
                    if (cancelled || currentResolutionVersion !== resolutionVersion) {
                        return;
                    }

                    if (!descriptor) {
                        updateItem(media.url, (item) => ({
                            ...item,
                            hasResolvedCache: true,
                        }));
                        return;
                    }

                    if (descriptor.kind !== 'image' && descriptor.kind !== 'video') {
                        updateItem(media.url, (item) => ({
                            ...item,
                            hasResolvedCache: true,
                            cached: true,
                            kind: descriptor.kind,
                            mimeType: descriptor.mimeType,
                            size: descriptor.size,
                            source: descriptor.source,
                        }));
                        return;
                    }

                    updateItem(media.url, (item) => ({
                        ...item,
                        hasResolvedCache: true,
                        cached: true,
                        previewObjectUrl: undefined,
                        kind: descriptor.kind,
                        mimeType: descriptor.mimeType,
                        size: descriptor.size,
                        source: descriptor.source,
                        isLoadingPreview: true,
                        isCaching: false,
                        hasFetchFailed: false,
                    }));

                    const cachedMedia = await postMediaCacheService.createCachedMediaObjectUrl(
                        media.url,
                    );
                    if (cancelled || currentResolutionVersion !== resolutionVersion) {
                        if (cachedMedia) {
                            postMediaCacheService.revokeObjectUrl(
                                cachedMedia.objectUrl,
                            );
                        }
                        return;
                    }

                    if (!cachedMedia) {
                        revokeTrackedObjectUrl(media.url);
                        updateItem(media.url, (item) => ({
                            ...item,
                            hasResolvedCache: true,
                            cached: true,
                            kind: descriptor.kind,
                            mimeType: descriptor.mimeType,
                            size: descriptor.size,
                            source: descriptor.source,
                            previewObjectUrl: undefined,
                            isLoadingPreview: false,
                        }));
                        return;
                    }

                    revokeTrackedObjectUrl(media.url);
                    activeObjectUrls.set(media.url, cachedMedia.objectUrl);
                    updateItem(media.url, (item) => ({
                        ...item,
                        hasResolvedCache: true,
                        cached: true,
                        previewObjectUrl: cachedMedia.objectUrl,
                        kind: cachedMedia.kind,
                        mimeType: cachedMedia.mimeType,
                        size: cachedMedia.size,
                        source: cachedMedia.source,
                        isLoadingPreview: false,
                        isCaching: false,
                        hasFetchFailed: false,
                    }));
                }),
            );
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