import type { NavigatorAdapter, StorageAdapter } from "../types";
import {
    DEFAULT_CLIENT_TAG_ENABLED,
    DEFAULT_COMPRESSION_LEVEL,
    DEFAULT_MEDIA_FREE_PLACEMENT,
    STORAGE_KEYS,
    getDefaultEndpoint,
    uploadEndpoints,
} from "../constants";

export type SupportedLocale = "ja" | "en";

type ReadWriteStorage = Pick<Storage, "getItem" | "setItem">;

function isJapaneseLocale(locale: string | null | undefined): boolean {
    return typeof locale === "string" && locale.toLowerCase().startsWith("ja");
}

export function normalizeLocale(locale: string | null | undefined): SupportedLocale {
    return isJapaneseLocale(locale) ? "ja" : "en";
}

export function getStoredLocalePreference(
    storage: Pick<Storage, "getItem"> | StorageAdapter,
): SupportedLocale | null {
    const storedLocale = storage.getItem(STORAGE_KEYS.LOCALE);
    return storedLocale === "ja" || storedLocale === "en" ? storedLocale : null;
}

export function getEffectiveLocale(
    storage: Pick<Storage, "getItem"> | StorageAdapter,
    navigator: NavigatorAdapter,
): SupportedLocale {
    return getStoredLocalePreference(storage) ?? normalizeLocale(navigator.language);
}

export function isValidUploadEndpoint(endpoint: string | null | undefined): endpoint is string {
    return !!endpoint && uploadEndpoints.some((candidate) => candidate.url === endpoint);
}

export function hasStoredUploadEndpoint(
    storage: Pick<Storage, "getItem"> | StorageAdapter,
): boolean {
    return isValidUploadEndpoint(storage.getItem(STORAGE_KEYS.UPLOAD_ENDPOINT));
}

export function getUploadEndpointPreference(
    storage: Pick<Storage, "getItem"> | StorageAdapter,
    locale: string | null | undefined,
    selectedEndpoint?: string,
): string {
    const storedEndpoint = storage.getItem(STORAGE_KEYS.UPLOAD_ENDPOINT);
    if (isValidUploadEndpoint(storedEndpoint)) {
        return storedEndpoint;
    }

    if (isValidUploadEndpoint(selectedEndpoint)) {
        return selectedEndpoint;
    }

    return getDefaultEndpoint(locale);
}

export function ensureUploadEndpointPreference(
    storage: ReadWriteStorage,
    locale: string | null | undefined,
    selectedEndpoint?: string,
): string {
    const endpoint = getUploadEndpointPreference(storage, locale, selectedEndpoint);
    storage.setItem(STORAGE_KEYS.UPLOAD_ENDPOINT, endpoint);
    return endpoint;
}

export function getClientTagEnabledPreference(storage: ReadWriteStorage): boolean {
    const storedValue = storage.getItem(STORAGE_KEYS.CLIENT_TAG_ENABLED);
    if (storedValue === null) {
        storage.setItem(
            STORAGE_KEYS.CLIENT_TAG_ENABLED,
            DEFAULT_CLIENT_TAG_ENABLED ? "true" : "false",
        );
        return DEFAULT_CLIENT_TAG_ENABLED;
    }

    return storedValue === "true";
}

export function getImageCompressionLevelPreference(
    storage: Pick<Storage, "getItem"> | StorageAdapter,
    selectedCompression?: string,
): string {
    return (
        storage.getItem(STORAGE_KEYS.IMAGE_COMPRESSION_LEVEL) ||
        selectedCompression ||
        DEFAULT_COMPRESSION_LEVEL
    );
}

export function getVideoCompressionLevelPreference(storage: ReadWriteStorage): string {
    const storedValue = storage.getItem(STORAGE_KEYS.VIDEO_COMPRESSION_LEVEL);

    if (storedValue === "skip") {
        storage.setItem(STORAGE_KEYS.VIDEO_COMPRESSION_LEVEL, "none");
        return "none";
    }

    if (storedValue) {
        return storedValue;
    }

    storage.setItem(STORAGE_KEYS.VIDEO_COMPRESSION_LEVEL, DEFAULT_COMPRESSION_LEVEL);
    return DEFAULT_COMPRESSION_LEVEL;
}

export function getMediaFreePlacementPreference(storage: ReadWriteStorage): boolean {
    const storedValue = storage.getItem(STORAGE_KEYS.MEDIA_FREE_PLACEMENT);

    if (storedValue === null) {
        storage.setItem(
            STORAGE_KEYS.MEDIA_FREE_PLACEMENT,
            DEFAULT_MEDIA_FREE_PLACEMENT ? "true" : "false",
        );
        return DEFAULT_MEDIA_FREE_PLACEMENT;
    }

    return storedValue !== "false";
}

export function setLocalePreference(storage: ReadWriteStorage, locale: string): SupportedLocale {
    const normalizedLocale = normalizeLocale(locale);
    storage.setItem(STORAGE_KEYS.LOCALE, normalizedLocale);
    return normalizedLocale;
}

export function setUploadEndpointPreference(storage: ReadWriteStorage, endpoint: string): string {
    const nextEndpoint = isValidUploadEndpoint(endpoint)
        ? endpoint
        : getDefaultEndpoint("ja");

    storage.setItem(STORAGE_KEYS.UPLOAD_ENDPOINT, nextEndpoint);
    return nextEndpoint;
}

export function setImageCompressionLevelPreference(storage: ReadWriteStorage, value: string): string {
    storage.setItem(STORAGE_KEYS.IMAGE_COMPRESSION_LEVEL, value);
    return value;
}

export function setVideoCompressionLevelPreference(storage: ReadWriteStorage, value: string): string {
    const normalizedValue = value === "skip" ? "none" : value;
    storage.setItem(STORAGE_KEYS.VIDEO_COMPRESSION_LEVEL, normalizedValue);
    return normalizedValue;
}

export function setClientTagEnabledPreference(storage: ReadWriteStorage, enabled: boolean): boolean {
    storage.setItem(STORAGE_KEYS.CLIENT_TAG_ENABLED, enabled ? "true" : "false");
    return enabled;
}

export function setMediaFreePlacementPreference(storage: ReadWriteStorage, enabled: boolean): boolean {
    storage.setItem(STORAGE_KEYS.MEDIA_FREE_PLACEMENT, enabled ? "true" : "false");
    return enabled;
}

export function isFirstVisit(storage: Pick<Storage, "getItem">): boolean {
    return storage.getItem(STORAGE_KEYS.FIRST_VISIT) !== "1";
}

export function consumeFirstVisit(storage: ReadWriteStorage): boolean {
    const firstVisit = isFirstVisit(storage);
    if (firstVisit) {
        storage.setItem(STORAGE_KEYS.FIRST_VISIT, "1");
    }
    return firstVisit;
}

export function isSharedMediaProcessed(storage: Pick<Storage, "getItem">): boolean {
    return storage.getItem(STORAGE_KEYS.SHARED_MEDIA_PROCESSED) === "1";
}

export function markSharedMediaProcessed(storage: ReadWriteStorage): void {
    storage.setItem(STORAGE_KEYS.SHARED_MEDIA_PROCESSED, "1");
}

export function clearSharedMediaProcessed(
    storage: Pick<Storage, "removeItem">,
): void {
    storage.removeItem(STORAGE_KEYS.SHARED_MEDIA_PROCESSED);
}