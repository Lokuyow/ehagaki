import { STORAGE_KEYS } from "./constants";

export const EMBED_SETTING_STORAGE_KEYS = [
    STORAGE_KEYS.LOCALE,
    STORAGE_KEYS.THEME_MODE,
    STORAGE_KEYS.DARK_MODE,
    STORAGE_KEYS.CLIENT_TAG_ENABLED,
    STORAGE_KEYS.QUOTE_NOTIFICATION_ENABLED,
    STORAGE_KEYS.REPLY_NOTIFICATION_ENABLED,
    STORAGE_KEYS.IMAGE_QUALITY_LEVEL,
    STORAGE_KEYS.VIDEO_QUALITY_LEVEL,
    STORAGE_KEYS.MEDIA_FREE_PLACEMENT,
    STORAGE_KEYS.SHOW_MASCOT,
    STORAGE_KEYS.SHOW_FLAVOR_TEXT,
    STORAGE_KEYS.SETTINGS_PREFERENCE_METADATA,
] as const;

export const LEGACY_EMBED_SETTING_STORAGE_KEYS = [
    STORAGE_KEYS.LEGACY_IMAGE_COMPRESSION_LEVEL,
    STORAGE_KEYS.LEGACY_VIDEO_COMPRESSION_LEVEL,
] as const;

export const EMBED_RUNTIME_STORAGE_KEYS = [
    STORAGE_KEYS.FIRST_VISIT,
    STORAGE_KEYS.SHARED_MEDIA_PROCESSED,
] as const;

export const EMBED_STORAGE_KEYS = [
    ...EMBED_SETTING_STORAGE_KEYS,
    ...LEGACY_EMBED_SETTING_STORAGE_KEYS,
    ...EMBED_RUNTIME_STORAGE_KEYS,
] as const;

const EMBED_STORAGE_KEY_SET = new Set<string>(EMBED_STORAGE_KEYS);

export function isAllowedEmbedStorageKey(key: string): boolean {
    return EMBED_STORAGE_KEY_SET.has(key);
}

export function filterAllowedEmbedStorageKeys(keys: string[]): string[] {
    return keys.filter(isAllowedEmbedStorageKey);
}

export function withSettingsPreferenceMetadata(keys: readonly string[]): string[] {
    return Array.from(new Set([
        ...keys,
        STORAGE_KEYS.SETTINGS_PREFERENCE_METADATA,
    ]));
}
