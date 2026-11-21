import type { CacheRetentionLimits } from './cacheRetention';

export interface ServiceWorkerImageCachePolicy extends CacheRetentionLimits {
    bodyName: string;
    metadataName: string;
    maxImageBytes: number;
}

export const PROFILE_IMAGE_CACHE_POLICY: ServiceWorkerImageCachePolicy = {
    bodyName: 'ehagaki-profile-images-v2',
    metadataName: 'ehagaki-profile-image-meta-v1',
    maxEntries: 128,
    maxReadableBytes: 32 * 1024 * 1024,
    maxOpaqueEntries: 8,
    maxImageBytes: 2 * 1024 * 1024,
};

export const CUSTOM_EMOJI_IMAGE_CACHE_POLICY: ServiceWorkerImageCachePolicy = {
    bodyName: 'ehagaki-custom-emoji-images-v3',
    metadataName: 'ehagaki-custom-emoji-image-meta-v1',
    maxEntries: 300,
    maxReadableBytes: 64 * 1024 * 1024,
    maxOpaqueEntries: 8,
    maxImageBytes: 10 * 1024 * 1024,
};
