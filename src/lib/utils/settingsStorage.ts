import type { NavigatorAdapter, StorageAdapter } from "../types";
import {
    DEFAULT_CLIENT_TAG_ENABLED,
    DEFAULT_COMPRESSION_LEVEL,
    DEFAULT_MEDIA_FREE_PLACEMENT,
    DEFAULT_QUOTE_NOTIFICATION_ENABLED,
    DEFAULT_SHOW_FLAVOR_TEXT,
    DEFAULT_SHOW_MASCOT,
    STORAGE_KEYS,
    VALID_COMPRESSION_LEVELS,
    getDefaultEndpoint,
    uploadEndpoints,
} from "../constants";

export type SupportedLocale = "ja" | "en";
export type PreferenceSource =
    | "default"
    | "parentBootstrap"
    | "parentForced"
    | "parentDefault"
    | "user";
export type ThemeMode = "system" | "light" | "dark";
export type ManagedPreferenceKey =
    | "locale"
    | "uploadEndpoint"
    | "clientTagEnabled"
    | "quoteNotificationEnabled"
    | "imageCompressionLevel"
    | "videoCompressionLevel"
    | "mediaFreePlacement"
    | "darkMode"
    | "showMascot"
    | "showFlavorText";

type ReadWriteStorage = Pick<Storage, "getItem" | "setItem">;
type MutableStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

interface PreferenceMetadata {
    embedBootstrapApplied?: boolean;
    sources?: Partial<Record<ManagedPreferenceKey, PreferenceSource>>;
}

function isJapaneseLocale(locale: string | null | undefined): boolean {
    return typeof locale === "string" && locale.toLowerCase().startsWith("ja");
}

export function normalizeLocale(locale: string | null | undefined): SupportedLocale {
    return isJapaneseLocale(locale) ? "ja" : "en";
}

function readPreferenceMetadata(
    storage: Pick<Storage, "getItem"> | StorageAdapter,
): PreferenceMetadata {
    try {
        const stored = storage.getItem(STORAGE_KEYS.SETTINGS_PREFERENCE_METADATA);
        if (!stored) {
            return {};
        }

        const parsed = JSON.parse(stored) as PreferenceMetadata;
        if (typeof parsed !== "object" || parsed === null) {
            return {};
        }

        return {
            embedBootstrapApplied: parsed.embedBootstrapApplied === true,
            sources:
                parsed.sources && typeof parsed.sources === "object"
                    ? parsed.sources
                    : {},
        };
    } catch {
        return {};
    }
}

function writePreferenceMetadata(
    storage: ReadWriteStorage,
    metadata: PreferenceMetadata,
): void {
    storage.setItem(
        STORAGE_KEYS.SETTINGS_PREFERENCE_METADATA,
        JSON.stringify({
            embedBootstrapApplied: metadata.embedBootstrapApplied === true,
            sources: metadata.sources ?? {},
        }),
    );
}

function parseBooleanValue(
    value: string | null | undefined,
    defaultValue: boolean,
): boolean {
    if (value === null || value === undefined) {
        return defaultValue;
    }

    return value !== "false";
}

function getStoredBooleanPreference(
    storage: ReadWriteStorage,
    key: string,
    defaultValue: boolean,
): boolean {
    const storedValue = storage.getItem(key);
    if (storedValue === null) {
        storage.setItem(key, defaultValue ? "true" : "false");
        return defaultValue;
    }

    return parseBooleanValue(storedValue, defaultValue);
}

export function normalizeCompressionLevelPreference(
    value: string | null | undefined,
): string | null {
    if (!value) {
        return null;
    }

    const normalizedValue = value === "skip" ? "none" : value;
    return VALID_COMPRESSION_LEVELS.includes(
        normalizedValue as (typeof VALID_COMPRESSION_LEVELS)[number],
    )
        ? normalizedValue
        : null;
}

export function getPreferenceSource(
    storage: Pick<Storage, "getItem"> | StorageAdapter,
    key: ManagedPreferenceKey,
): PreferenceSource {
    return readPreferenceMetadata(storage).sources?.[key] ?? "default";
}

export function setPreferenceSource(
    storage: ReadWriteStorage,
    key: ManagedPreferenceKey,
    source: PreferenceSource,
): void {
    const metadata = readPreferenceMetadata(storage);
    writePreferenceMetadata(storage, {
        ...metadata,
        sources: {
            ...(metadata.sources ?? {}),
            [key]: source,
        },
    });
}

export function hasAppliedEmbedBootstrap(
    storage: Pick<Storage, "getItem"> | StorageAdapter,
): boolean {
    return readPreferenceMetadata(storage).embedBootstrapApplied === true;
}

export function markEmbedBootstrapApplied(storage: ReadWriteStorage): void {
    const metadata = readPreferenceMetadata(storage);
    writePreferenceMetadata(storage, {
        ...metadata,
        embedBootstrapApplied: true,
    });
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
    return getStoredBooleanPreference(
        storage,
        STORAGE_KEYS.CLIENT_TAG_ENABLED,
        DEFAULT_CLIENT_TAG_ENABLED,
    );
}

export function getQuoteNotificationEnabledPreference(storage: ReadWriteStorage): boolean {
    return getStoredBooleanPreference(
        storage,
        STORAGE_KEYS.QUOTE_NOTIFICATION_ENABLED,
        DEFAULT_QUOTE_NOTIFICATION_ENABLED,
    );
}

export function getImageCompressionLevelPreference(
    storage: Pick<Storage, "getItem"> | StorageAdapter,
    selectedCompression?: string,
): string {
    return normalizeCompressionLevelPreference(storage.getItem(STORAGE_KEYS.IMAGE_COMPRESSION_LEVEL))
        ?? normalizeCompressionLevelPreference(selectedCompression)
        ?? DEFAULT_COMPRESSION_LEVEL;
}

export function getVideoCompressionLevelPreference(storage: ReadWriteStorage): string {
    const storedValue = normalizeCompressionLevelPreference(
        storage.getItem(STORAGE_KEYS.VIDEO_COMPRESSION_LEVEL),
    );

    if (storage.getItem(STORAGE_KEYS.VIDEO_COMPRESSION_LEVEL) === "skip") {
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
    return getStoredBooleanPreference(
        storage,
        STORAGE_KEYS.MEDIA_FREE_PLACEMENT,
        DEFAULT_MEDIA_FREE_PLACEMENT,
    );
}

export function getShowMascotPreference(storage: ReadWriteStorage): boolean {
    return getStoredBooleanPreference(
        storage,
        STORAGE_KEYS.SHOW_MASCOT,
        DEFAULT_SHOW_MASCOT,
    );
}

export function getShowFlavorTextPreference(storage: ReadWriteStorage): boolean {
    return getStoredBooleanPreference(
        storage,
        STORAGE_KEYS.SHOW_FLAVOR_TEXT,
        DEFAULT_SHOW_FLAVOR_TEXT,
    );
}

export function getStoredDarkModePreference(
    storage: Pick<Storage, "getItem"> | StorageAdapter,
): boolean | null {
    const storedValue = storage.getItem(STORAGE_KEYS.DARK_MODE);
    if (storedValue === null) {
        return null;
    }

    return storedValue === "true";
}

export function normalizeThemeModePreference(
    value: string | null | undefined,
): ThemeMode | null {
    return value === "system" || value === "light" || value === "dark"
        ? value
        : null;
}

export function getStoredThemeModePreference(storage: MutableStorage): ThemeMode {
    const storedMode = normalizeThemeModePreference(
        storage.getItem(STORAGE_KEYS.THEME_MODE),
    );

    if (storedMode) {
        if (storage.getItem(STORAGE_KEYS.DARK_MODE) !== null) {
            storage.removeItem(STORAGE_KEYS.DARK_MODE);
        }
        return storedMode;
    }

    if (storage.getItem(STORAGE_KEYS.THEME_MODE) !== null) {
        storage.setItem(STORAGE_KEYS.THEME_MODE, "system");
        storage.removeItem(STORAGE_KEYS.DARK_MODE);
        return "system";
    }

    const legacyDarkMode = getStoredDarkModePreference(storage);
    if (legacyDarkMode !== null) {
        const migratedMode = legacyDarkMode ? "dark" : "light";
        storage.setItem(STORAGE_KEYS.THEME_MODE, migratedMode);
        storage.removeItem(STORAGE_KEYS.DARK_MODE);
        return migratedMode;
    }

    storage.setItem(STORAGE_KEYS.THEME_MODE, "system");
    return "system";
}

export function setLocalePreference(
    storage: ReadWriteStorage,
    locale: string,
    source: PreferenceSource = "user",
): SupportedLocale {
    const normalizedLocale = normalizeLocale(locale);
    storage.setItem(STORAGE_KEYS.LOCALE, normalizedLocale);
    setPreferenceSource(storage, "locale", source);
    return normalizedLocale;
}

export function setUploadEndpointPreference(
    storage: ReadWriteStorage,
    endpoint: string,
    source: PreferenceSource = "user",
): string {
    const nextEndpoint = isValidUploadEndpoint(endpoint)
        ? endpoint
        : getDefaultEndpoint("ja");

    storage.setItem(STORAGE_KEYS.UPLOAD_ENDPOINT, nextEndpoint);
    setPreferenceSource(storage, "uploadEndpoint", source);
    return nextEndpoint;
}

export function setImageCompressionLevelPreference(
    storage: ReadWriteStorage,
    value: string,
    source: PreferenceSource = "user",
): string {
    const normalizedValue = normalizeCompressionLevelPreference(value) ?? DEFAULT_COMPRESSION_LEVEL;
    storage.setItem(STORAGE_KEYS.IMAGE_COMPRESSION_LEVEL, normalizedValue);
    setPreferenceSource(storage, "imageCompressionLevel", source);
    return normalizedValue;
}

export function setVideoCompressionLevelPreference(
    storage: ReadWriteStorage,
    value: string,
    source: PreferenceSource = "user",
): string {
    const normalizedValue = normalizeCompressionLevelPreference(value) ?? DEFAULT_COMPRESSION_LEVEL;
    storage.setItem(STORAGE_KEYS.VIDEO_COMPRESSION_LEVEL, normalizedValue);
    setPreferenceSource(storage, "videoCompressionLevel", source);
    return normalizedValue;
}

export function setClientTagEnabledPreference(
    storage: ReadWriteStorage,
    enabled: boolean,
    source: PreferenceSource = "user",
): boolean {
    storage.setItem(STORAGE_KEYS.CLIENT_TAG_ENABLED, enabled ? "true" : "false");
    setPreferenceSource(storage, "clientTagEnabled", source);
    return enabled;
}

export function setQuoteNotificationEnabledPreference(
    storage: ReadWriteStorage,
    enabled: boolean,
    source: PreferenceSource = "user",
): boolean {
    storage.setItem(STORAGE_KEYS.QUOTE_NOTIFICATION_ENABLED, enabled ? "true" : "false");
    setPreferenceSource(storage, "quoteNotificationEnabled", source);
    return enabled;
}

export function setMediaFreePlacementPreference(
    storage: ReadWriteStorage,
    enabled: boolean,
    source: PreferenceSource = "user",
): boolean {
    storage.setItem(STORAGE_KEYS.MEDIA_FREE_PLACEMENT, enabled ? "true" : "false");
    setPreferenceSource(storage, "mediaFreePlacement", source);
    return enabled;
}

export function setShowMascotPreference(
    storage: ReadWriteStorage,
    enabled: boolean,
    source: PreferenceSource = "user",
): boolean {
    storage.setItem(STORAGE_KEYS.SHOW_MASCOT, enabled ? "true" : "false");
    setPreferenceSource(storage, "showMascot", source);
    return enabled;
}

export function setShowFlavorTextPreference(
    storage: ReadWriteStorage,
    enabled: boolean,
    source: PreferenceSource = "user",
): boolean {
    storage.setItem(STORAGE_KEYS.SHOW_FLAVOR_TEXT, enabled ? "true" : "false");
    setPreferenceSource(storage, "showFlavorText", source);
    return enabled;
}

export function setDarkModePreference(
    storage: MutableStorage,
    enabled: boolean,
    source: PreferenceSource = "user",
): boolean {
    storage.setItem(STORAGE_KEYS.THEME_MODE, enabled ? "dark" : "light");
    storage.removeItem(STORAGE_KEYS.DARK_MODE);
    setPreferenceSource(storage, "darkMode", source);
    return enabled;
}

export function setThemeModePreference(
    storage: MutableStorage,
    mode: string,
    source: PreferenceSource = "user",
): ThemeMode {
    const normalizedMode = normalizeThemeModePreference(mode) ?? "system";
    storage.setItem(STORAGE_KEYS.THEME_MODE, normalizedMode);
    storage.removeItem(STORAGE_KEYS.DARK_MODE);
    setPreferenceSource(storage, "darkMode", source);
    return normalizedMode;
}

export function clearDarkModePreference(
    storage: Pick<Storage, "getItem" | "setItem" | "removeItem">,
    source: PreferenceSource = "user",
): void {
    storage.removeItem(STORAGE_KEYS.DARK_MODE);
    storage.setItem(STORAGE_KEYS.THEME_MODE, "system");
    setPreferenceSource(storage, "darkMode", source);
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
