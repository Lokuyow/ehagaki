export const UPLOAD_MEDIA_IMAGE_CACHE_NAME = "ehagaki-upload-media-images-v1";
export const UPLOAD_MEDIA_IMAGE_META_CACHE_NAME = "ehagaki-upload-media-image-meta-v1";
export const UPLOAD_MEDIA_IMAGE_CACHE_NAMES = [UPLOAD_MEDIA_IMAGE_CACHE_NAME, UPLOAD_MEDIA_IMAGE_META_CACHE_NAME] as const;
export const UPLOAD_MEDIA_IMAGE_LEGACY_CACHE_NAMES: readonly string[] = [];
export const UPLOAD_MEDIA_IMAGE_CACHE_VERSION = 1;
export const UPLOAD_MEDIA_IMAGE_CACHE_POLICY = {
    maxEntries: 64,
    maxReadableImageBytes: 10 * 1024 * 1024,
    maxReadableTotalBytes: 64 * 1024 * 1024,
    maxOpaqueEntries: 8,
    readableFreshMs: 24 * 60 * 60 * 1000,
    readableRetainMs: 7 * 24 * 60 * 60 * 1000,
    opaqueFreshMs: 60 * 60 * 1000,
    opaqueRetainMs: 24 * 60 * 60 * 1000,
    retryMs: 15 * 60 * 1000,
    touchMs: 60 * 60 * 1000,
} as const;
export const UPLOAD_MEDIA_IMAGE_SUPPORT_MESSAGE = "GET_UPLOAD_MEDIA_IMAGE_CACHE_SUPPORT";
export const UPLOAD_MEDIA_IMAGE_EVICT_MESSAGE = "EVICT_UPLOAD_MEDIA_IMAGES";
