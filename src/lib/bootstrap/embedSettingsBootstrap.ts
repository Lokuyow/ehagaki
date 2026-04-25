import {
    getEffectiveLocale,
    getPreferenceSource,
    hasAppliedEmbedBootstrap,
    isValidUploadEndpoint,
    markEmbedBootstrapApplied,
    normalizeCompressionLevelPreference,
    normalizeLocale,
    setClientTagEnabledPreference,
    setImageCompressionLevelPreference,
    setLocalePreference,
    setMediaFreePlacementPreference,
    setQuoteNotificationEnabledPreference,
    setShowBalloonMessagePreference,
    setShowMascotPreference,
    setThemeModePreference,
    setUploadEndpointPreference,
    setVideoCompressionLevelPreference,
    type SupportedLocale,
    type ThemeMode,
} from "../utils/settingsStorage";

export const EMBED_SETTINGS_QUERY_KEYS = [
    "embedLocale",
    "embedTheme",
    "embedUploadEndpoint",
    "embedImageCompression",
    "embedVideoCompression",
    "embedClientTag",
    "embedQuoteNotification",
    "embedMediaFreePlacement",
    "embedShowMascot",
    "embedShowBalloonMessage",
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

interface ParsedEmbedSettings {
    locale?: SupportedLocale;
    themeMode?: ThemeMode;
    uploadEndpoint?: string;
    imageCompressionLevel?: string;
    videoCompressionLevel?: string;
    clientTagEnabled?: boolean;
    quoteNotificationEnabled?: boolean;
    mediaFreePlacement?: boolean;
    showMascot?: boolean;
    showBalloonMessage?: boolean;
}

interface EmbedSettingsBootstrapResult {
    hasQueryParams: boolean;
    applied: boolean;
    parsedSettings: ParsedEmbedSettings;
}

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

function parseEmbedSettings(locationSearch: string): ParsedEmbedSettings {
    const params = new URLSearchParams(locationSearch);
    const locale = params.get("embedLocale");
    const uploadEndpoint = params.get("embedUploadEndpoint");

    return {
        locale: locale ? normalizeLocale(locale) : undefined,
        themeMode: parseThemeParam(params.get("embedTheme")),
        uploadEndpoint: isValidUploadEndpoint(uploadEndpoint)
            ? uploadEndpoint
            : undefined,
        imageCompressionLevel:
            normalizeCompressionLevelPreference(
                params.get("embedImageCompression"),
            ) ?? undefined,
        videoCompressionLevel:
            normalizeCompressionLevelPreference(
                params.get("embedVideoCompression"),
            ) ?? undefined,
        clientTagEnabled: parseBooleanParam(params.get("embedClientTag")),
        quoteNotificationEnabled: parseBooleanParam(
            params.get("embedQuoteNotification"),
        ),
        mediaFreePlacement: parseBooleanParam(
            params.get("embedMediaFreePlacement"),
        ),
        showMascot: parseBooleanParam(params.get("embedShowMascot")),
        showBalloonMessage: parseBooleanParam(
            params.get("embedShowBalloonMessage"),
        ),
    };
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

export function applyEmbedSettingsBootstrap({
    storage = localStorage,
    navigatorObj = navigator,
    documentObj = document,
    windowObj = window,
    locationSearch = window.location.search,
}: EmbedSettingsBootstrapOptions = {}): EmbedSettingsBootstrapResult {
    const hasQueryParams = hasEmbedSettingsQuery(locationSearch);
    const parsedSettings = parseEmbedSettings(locationSearch);

    if (!hasQueryParams) {
        applyDocumentLanguage(storage, navigatorObj, documentObj);
        return {
            hasQueryParams: false,
            applied: false,
            parsedSettings,
        };
    }

    const canApplyBootstrap = !hasAppliedEmbedBootstrap(storage);

    if (canApplyBootstrap) {
        if (
            parsedSettings.locale &&
            getPreferenceSource(storage, "locale") !== "user"
        ) {
            setLocalePreference(storage, parsedSettings.locale, "parentBootstrap");
        }

        if (
            parsedSettings.themeMode !== undefined &&
            getPreferenceSource(storage, "darkMode") !== "user"
        ) {
            setThemeModePreference(
                storage,
                parsedSettings.themeMode,
                "parentBootstrap",
            );
        }

        if (
            parsedSettings.uploadEndpoint &&
            getPreferenceSource(storage, "uploadEndpoint") !== "user"
        ) {
            setUploadEndpointPreference(
                storage,
                parsedSettings.uploadEndpoint,
                "parentBootstrap",
            );
        }

        if (
            parsedSettings.imageCompressionLevel &&
            getPreferenceSource(storage, "imageCompressionLevel") !== "user"
        ) {
            setImageCompressionLevelPreference(
                storage,
                parsedSettings.imageCompressionLevel,
                "parentBootstrap",
            );
        }

        if (
            parsedSettings.videoCompressionLevel &&
            getPreferenceSource(storage, "videoCompressionLevel") !== "user"
        ) {
            setVideoCompressionLevelPreference(
                storage,
                parsedSettings.videoCompressionLevel,
                "parentBootstrap",
            );
        }

        if (
            parsedSettings.clientTagEnabled !== undefined &&
            getPreferenceSource(storage, "clientTagEnabled") !== "user"
        ) {
            setClientTagEnabledPreference(
                storage,
                parsedSettings.clientTagEnabled,
                "parentBootstrap",
            );
        }

        if (
            parsedSettings.quoteNotificationEnabled !== undefined &&
            getPreferenceSource(storage, "quoteNotificationEnabled") !== "user"
        ) {
            setQuoteNotificationEnabledPreference(
                storage,
                parsedSettings.quoteNotificationEnabled,
                "parentBootstrap",
            );
        }

        if (
            parsedSettings.mediaFreePlacement !== undefined &&
            getPreferenceSource(storage, "mediaFreePlacement") !== "user"
        ) {
            setMediaFreePlacementPreference(
                storage,
                parsedSettings.mediaFreePlacement,
                "parentBootstrap",
            );
        }

        if (
            parsedSettings.showMascot !== undefined &&
            getPreferenceSource(storage, "showMascot") !== "user"
        ) {
            setShowMascotPreference(
                storage,
                parsedSettings.showMascot,
                "parentBootstrap",
            );
        }

        if (
            parsedSettings.showBalloonMessage !== undefined &&
            getPreferenceSource(storage, "showBalloonMessage") !== "user"
        ) {
            setShowBalloonMessagePreference(
                storage,
                parsedSettings.showBalloonMessage,
                "parentBootstrap",
            );
        }

        markEmbedBootstrapApplied(storage);
    }

    applyDocumentLanguage(storage, navigatorObj, documentObj);
    cleanupEmbedSettingsQueryParams(windowObj);

    return {
        hasQueryParams: true,
        applied: canApplyBootstrap,
        parsedSettings,
    };
}
