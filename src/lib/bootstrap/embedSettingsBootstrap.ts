import { STORAGE_KEYS } from "../constants";
import {
    getEffectiveLocale,
    isValidUploadEndpoint,
    normalizeCompressionLevelPreference,
    normalizeLegacyCompressionLevelPreference,
    normalizeLocale,
    setClientTagEnabledPreference,
    setImageCompressionLevelPreference,
    setLocalePreference,
    setMediaFreePlacementPreference,
    setQuoteNotificationEnabledPreference,
    setShowFlavorTextPreference,
    setShowMascotPreference,
    setThemeModePreference,
    setVideoCompressionLevelPreference,
    type SupportedLocale,
    type ThemeMode,
} from "../utils/settingsStorage";

export const EMBED_SETTINGS_QUERY_KEYS = [
    "embedLocale",
    "embedTheme",
    "embedUploadEndpoint",
    "embedImageQuality",
    "embedVideoQuality",
    "embedImageCompression",
    "embedVideoCompression",
    "embedClientTag",
    "embedQuoteNotification",
    "embedMediaFreePlacement",
    "embedShowMascot",
    "embedShowFlavorText",
    "defaultLocale",
    "defaultTheme",
    "defaultUploadEndpoint",
    "defaultImageQuality",
    "defaultVideoQuality",
    "defaultImageCompression",
    "defaultVideoCompression",
    "defaultClientTag",
    "defaultQuoteNotification",
    "defaultMediaFreePlacement",
    "defaultShowMascot",
    "defaultShowFlavorText",
] as const;

interface NavigatorLike {
    language: string;
}

interface HistoryLike {
    replaceState: History["replaceState"];
}

interface LocationLike {
    search: string;
    pathname: string;
}

interface WindowLike {
    location: LocationLike;
    history: HistoryLike;
}

interface DocumentLike {
    documentElement: HTMLElement;
}

interface EmbedSettingsBootstrapOptions {
    storage?: Storage;
    navigatorObj?: NavigatorLike;
    documentObj?: DocumentLike;
    windowObj?: WindowLike;
    locationSearch?: string;
}

export interface ParsedEmbedSettings {
    locale?: SupportedLocale;
    themeMode?: ThemeMode;
    uploadEndpoint?: string;
    imageQualityLevel?: string;
    videoQualityLevel?: string;
    clientTagEnabled?: boolean;
    quoteNotificationEnabled?: boolean;
    mediaFreePlacement?: boolean;
    showMascot?: boolean;
    showFlavorText?: boolean;
}

type ParsedSettingsKey = keyof ParsedEmbedSettings;
type PersistedParsedSettingsKey = Exclude<ParsedSettingsKey, "uploadEndpoint">;

export interface EmbedUploadEndpointBootstrapPreference {
    endpoint: string;
    mode: "forced" | "default";
}

interface EmbedSettingsBootstrapResult {
    hasQueryParams: boolean;
    applied: boolean;
    appliedSettings: PersistedParsedSettingsKey[];
    parsedSettings: ParsedEmbedSettings;
    parsedDefaultSettings: ParsedEmbedSettings;
    uploadEndpointPreference: EmbedUploadEndpointBootstrapPreference | null;
}

const PERSISTED_PARSED_SETTINGS_KEYS: PersistedParsedSettingsKey[] = [
    "locale",
    "themeMode",
    "imageQualityLevel",
    "videoQualityLevel",
    "clientTagEnabled",
    "quoteNotificationEnabled",
    "mediaFreePlacement",
    "showMascot",
    "showFlavorText",
];

function parseBooleanParam(value: string | null): boolean | undefined {
    if (value === null) {
        return undefined;
    }

    const normalizedValue = value.trim().toLowerCase();
    if (["1", "true", "yes", "on"].includes(normalizedValue)) {
        return true;
    }

    if (["0", "false", "no", "off"].includes(normalizedValue)) {
        return false;
    }

    return undefined;
}

function parseThemeParam(value: string | null): ThemeMode | undefined {
    if (value === null) {
        return undefined;
    }

    const normalizedValue = value.trim().toLowerCase();
    if (
        normalizedValue === "system" ||
        normalizedValue === "light" ||
        normalizedValue === "dark"
    ) {
        return normalizedValue;
    }

    return undefined;
}

function hasEmbedSettingsQuery(locationSearch: string): boolean {
    const params = new URLSearchParams(locationSearch);
    return EMBED_SETTINGS_QUERY_KEYS.some((key) => params.has(key));
}

function parseSettingsFromParams(
    params: URLSearchParams,
    prefix: "embed" | "default",
): ParsedEmbedSettings {
    const locale = params.get(`${prefix}Locale`);
    const uploadEndpoint = params.get(`${prefix}UploadEndpoint`);

    return {
        locale: locale ? normalizeLocale(locale) : undefined,
        themeMode: parseThemeParam(params.get(`${prefix}Theme`)),
        uploadEndpoint: isValidUploadEndpoint(uploadEndpoint)
            ? uploadEndpoint
            : undefined,
        imageQualityLevel:
            normalizeCompressionLevelPreference(
                params.get(`${prefix}ImageQuality`),
            )
            ?? normalizeLegacyCompressionLevelPreference(
                params.get(`${prefix}ImageCompression`),
            )
            ?? undefined,
        videoQualityLevel:
            normalizeCompressionLevelPreference(
                params.get(`${prefix}VideoQuality`),
            )
            ?? normalizeLegacyCompressionLevelPreference(
                params.get(`${prefix}VideoCompression`),
            )
            ?? undefined,
        clientTagEnabled: parseBooleanParam(params.get(`${prefix}ClientTag`)),
        quoteNotificationEnabled: parseBooleanParam(
            params.get(`${prefix}QuoteNotification`),
        ),
        mediaFreePlacement: parseBooleanParam(
            params.get(`${prefix}MediaFreePlacement`),
        ),
        showMascot: parseBooleanParam(params.get(`${prefix}ShowMascot`)),
        showFlavorText: parseBooleanParam(
            params.get(`${prefix}ShowFlavorText`),
        ),
    };
}

function parseEmbedSettings(locationSearch: string): ParsedEmbedSettings {
    return parseSettingsFromParams(new URLSearchParams(locationSearch), "embed");
}

function parseDefaultSettings(locationSearch: string): ParsedEmbedSettings {
    return parseSettingsFromParams(new URLSearchParams(locationSearch), "default");
}

function cleanupEmbedSettingsQueryParams(windowObj: WindowLike): void {
    const params = new URLSearchParams(windowObj.location.search);
    let changed = false;

    for (const key of EMBED_SETTINGS_QUERY_KEYS) {
        if (!params.has(key)) {
            continue;
        }

        params.delete(key);
        changed = true;
    }

    if (!changed) {
        return;
    }

    const nextUrl = params.toString()
        ? `${windowObj.location.pathname}?${params.toString()}`
        : windowObj.location.pathname;
    windowObj.history.replaceState({}, "", nextUrl);
}

function applyDocumentLanguage(
    storage: Storage,
    navigatorObj: NavigatorLike,
    documentObj?: DocumentLike,
): void {
    if (!documentObj) {
        return;
    }

    documentObj.documentElement.lang = getEffectiveLocale(storage, navigatorObj);
}

function isPreferenceStored(storage: Storage, key: PersistedParsedSettingsKey): boolean {
    switch (key) {
        case "locale":
            return storage.getItem(STORAGE_KEYS.LOCALE) === "ja"
                || storage.getItem(STORAGE_KEYS.LOCALE) === "en";
        case "themeMode":
            return storage.getItem(STORAGE_KEYS.THEME_MODE) !== null
                || storage.getItem(STORAGE_KEYS.DARK_MODE) !== null;
        case "imageQualityLevel":
            return normalizeCompressionLevelPreference(
                storage.getItem(STORAGE_KEYS.IMAGE_QUALITY_LEVEL),
            ) !== null
                || normalizeLegacyCompressionLevelPreference(
                    storage.getItem(STORAGE_KEYS.LEGACY_IMAGE_COMPRESSION_LEVEL),
                ) !== null;
        case "videoQualityLevel":
            return normalizeCompressionLevelPreference(
                storage.getItem(STORAGE_KEYS.VIDEO_QUALITY_LEVEL),
            ) !== null
                || normalizeLegacyCompressionLevelPreference(
                    storage.getItem(STORAGE_KEYS.LEGACY_VIDEO_COMPRESSION_LEVEL),
                ) !== null;
        case "clientTagEnabled":
            return storage.getItem(STORAGE_KEYS.CLIENT_TAG_ENABLED) !== null;
        case "quoteNotificationEnabled":
            return storage.getItem(STORAGE_KEYS.QUOTE_NOTIFICATION_ENABLED) !== null;
        case "mediaFreePlacement":
            return storage.getItem(STORAGE_KEYS.MEDIA_FREE_PLACEMENT) !== null;
        case "showMascot":
            return storage.getItem(STORAGE_KEYS.SHOW_MASCOT) !== null;
        case "showFlavorText":
            return storage.getItem(STORAGE_KEYS.SHOW_FLAVOR_TEXT) !== null;
    }
}

function applySetting(
    storage: Storage,
    key: PersistedParsedSettingsKey,
    value: ParsedEmbedSettings[ParsedSettingsKey],
    source: "parentForced" | "parentDefault",
): boolean {
    if (value === undefined) {
        return false;
    }

    switch (key) {
        case "locale":
            setLocalePreference(storage, value as SupportedLocale, source);
            return true;
        case "themeMode":
            setThemeModePreference(storage, value as ThemeMode, source);
            return true;
        case "imageQualityLevel":
            setImageCompressionLevelPreference(storage, value as string, source);
            return true;
        case "videoQualityLevel":
            setVideoCompressionLevelPreference(storage, value as string, source);
            return true;
        case "clientTagEnabled":
            setClientTagEnabledPreference(storage, value as boolean, source);
            return true;
        case "quoteNotificationEnabled":
            setQuoteNotificationEnabledPreference(storage, value as boolean, source);
            return true;
        case "mediaFreePlacement":
            setMediaFreePlacementPreference(storage, value as boolean, source);
            return true;
        case "showMascot":
            setShowMascotPreference(storage, value as boolean, source);
            return true;
        case "showFlavorText":
            setShowFlavorTextPreference(storage, value as boolean, source);
            return true;
    }
}

export function applyEmbedSettingsBootstrap({
    storage = localStorage,
    navigatorObj = navigator,
    documentObj = document,
    windowObj = window,
    locationSearch = window.location.search,
}: EmbedSettingsBootstrapOptions = {}): EmbedSettingsBootstrapResult {
    const hasQueryParams = hasEmbedSettingsQuery(locationSearch);
    const parsedSettings = parseEmbedSettings(locationSearch);
    const parsedDefaultSettings = parseDefaultSettings(locationSearch);
    const uploadEndpointPreference =
        parsedSettings.uploadEndpoint !== undefined
            ? {
                endpoint: parsedSettings.uploadEndpoint,
                mode: "forced" as const,
            }
            : parsedDefaultSettings.uploadEndpoint !== undefined
                ? {
                    endpoint: parsedDefaultSettings.uploadEndpoint,
                    mode: "default" as const,
                }
                : null;

    if (!hasQueryParams) {
        applyDocumentLanguage(storage, navigatorObj, documentObj);
        return {
            hasQueryParams: false,
            applied: false,
            appliedSettings: [],
            parsedSettings,
            parsedDefaultSettings,
            uploadEndpointPreference,
        };
    }

    const appliedSettings: PersistedParsedSettingsKey[] = [];

    for (const key of PERSISTED_PARSED_SETTINGS_KEYS) {
        if (applySetting(storage, key, parsedSettings[key], "parentForced")) {
            appliedSettings.push(key);
            continue;
        }

        if (
            !isPreferenceStored(storage, key)
            && applySetting(storage, key, parsedDefaultSettings[key], "parentDefault")
        ) {
            appliedSettings.push(key);
        }
    }

    applyDocumentLanguage(storage, navigatorObj, documentObj);
    cleanupEmbedSettingsQueryParams(windowObj);

    return {
        hasQueryParams: true,
        applied: appliedSettings.length > 0,
        appliedSettings,
        parsedSettings,
        parsedDefaultSettings,
        uploadEndpointPreference,
    };
}
