import { locale as i18nLocale } from "svelte-i18n";
import type { EmbedSettingsSetPayload } from "../lib/embedProtocol";
import {
    getClientTagEnabledPreference,
    ensureUploadEndpointPreference,
    getEffectiveLocale,
    getImageCompressionLevelPreference,
    getMediaFreePlacementPreference,
    getQuoteNotificationEnabledPreference,
    getShowFlavorTextPreference,
    getShowMascotPreference,
    getUploadEndpointPreference,
    getVideoCompressionLevelPreference,
    hasStoredUploadEndpoint,
    setClientTagEnabledPreference,
    setImageCompressionLevelPreference,
    setLocalePreference,
    setMediaFreePlacementPreference,
    setQuoteNotificationEnabledPreference,
    setShowFlavorTextPreference,
    setShowMascotPreference,
    setUploadEndpointPreference,
    setVideoCompressionLevelPreference,
    consumeFirstVisit,
    isSharedMediaProcessed as readSharedMediaProcessed,
    markSharedMediaProcessed as writeSharedMediaProcessed,
    clearSharedMediaProcessed as removeSharedMediaProcessed,
    type SupportedLocale,
    type PreferenceSource,
} from "../lib/utils/settingsStorage";
import { themeModeStore } from "./themeStore.svelte";
import { mediaFreePlacementStore } from "./uploadStore.svelte";
import { STORAGE_KEYS } from "../lib/constants";
import { embedStorageService } from "../lib/embedStorageService";

interface SettingsState {
    locale: SupportedLocale;
    uploadEndpoint: string;
    clientTagEnabled: boolean;
    quoteNotificationEnabled: boolean;
    imageCompressionLevel: string;
    videoCompressionLevel: string;
    mediaFreePlacement: boolean;
    showMascot: boolean;
    showFlavorText: boolean;
}

function readSettingsState(): SettingsState {
    const effectiveLocale = getEffectiveLocale(localStorage, navigator);
    const uploadEndpoint = ensureUploadEndpointPreference(localStorage, effectiveLocale);

    return {
        locale: effectiveLocale,
        uploadEndpoint,
        clientTagEnabled: getClientTagEnabledPreference(localStorage),
        quoteNotificationEnabled: getQuoteNotificationEnabledPreference(localStorage),
        imageCompressionLevel: getImageCompressionLevelPreference(localStorage),
        videoCompressionLevel: getVideoCompressionLevelPreference(localStorage),
        mediaFreePlacement: getMediaFreePlacementPreference(localStorage),
        showMascot: getShowMascotPreference(localStorage),
        showFlavorText: getShowFlavorTextPreference(localStorage),
    };
}

const initialSettingsState = readSettingsState();
let settingsState = $state<SettingsState>(initialSettingsState);
mediaFreePlacementStore.set(initialSettingsState.mediaFreePlacement);

function updateMediaPlacement(enabled: boolean): void {
    mediaFreePlacementStore.set(enabled);
}

function persistSettingsKeys(keys: string[]): void {
    embedStorageService.persistLocalStorageKeys([
        ...keys,
        STORAGE_KEYS.SETTINGS_PREFERENCE_METADATA,
    ]);
}

export const settingsStore = {
    get value(): SettingsState {
        return settingsState;
    },

    reload(): void {
        settingsState = readSettingsState();
        updateMediaPlacement(settingsState.mediaFreePlacement);
        i18nLocale.set(settingsState.locale);
    },

    get locale(): SupportedLocale {
        return settingsState.locale;
    },

    set locale(value: string) {
        const hadStoredEndpoint = hasStoredUploadEndpoint(localStorage);
        const nextLocale = setLocalePreference(localStorage, value);
        settingsState.locale = nextLocale;

        if (!hadStoredEndpoint) {
            settingsState.uploadEndpoint = ensureUploadEndpointPreference(
                localStorage,
                nextLocale,
            );
        }

        i18nLocale.set(nextLocale);
        persistSettingsKeys([STORAGE_KEYS.LOCALE, STORAGE_KEYS.UPLOAD_ENDPOINT]);
    },

    get uploadEndpoint(): string {
        return settingsState.uploadEndpoint;
    },

    set uploadEndpoint(value: string) {
        settingsState.uploadEndpoint = setUploadEndpointPreference(localStorage, value);
        persistSettingsKeys([STORAGE_KEYS.UPLOAD_ENDPOINT]);
    },

    get clientTagEnabled(): boolean {
        return settingsState.clientTagEnabled;
    },

    set clientTagEnabled(value: boolean) {
        settingsState.clientTagEnabled = setClientTagEnabledPreference(localStorage, value);
        persistSettingsKeys([STORAGE_KEYS.CLIENT_TAG_ENABLED]);
    },

    get quoteNotificationEnabled(): boolean {
        return settingsState.quoteNotificationEnabled;
    },

    set quoteNotificationEnabled(value: boolean) {
        settingsState.quoteNotificationEnabled = setQuoteNotificationEnabledPreference(
            localStorage,
            value,
        );
        persistSettingsKeys([STORAGE_KEYS.QUOTE_NOTIFICATION_ENABLED]);
    },

    get imageCompressionLevel(): string {
        return settingsState.imageCompressionLevel;
    },

    set imageCompressionLevel(value: string) {
        settingsState.imageCompressionLevel = setImageCompressionLevelPreference(
            localStorage,
            value,
        );
        persistSettingsKeys([STORAGE_KEYS.IMAGE_COMPRESSION_LEVEL]);
    },

    get videoCompressionLevel(): string {
        return settingsState.videoCompressionLevel;
    },

    set videoCompressionLevel(value: string) {
        settingsState.videoCompressionLevel = setVideoCompressionLevelPreference(
            localStorage,
            value,
        );
        persistSettingsKeys([STORAGE_KEYS.VIDEO_COMPRESSION_LEVEL]);
    },

    get mediaFreePlacement(): boolean {
        return settingsState.mediaFreePlacement;
    },

    set mediaFreePlacement(value: boolean) {
        settingsState.mediaFreePlacement = setMediaFreePlacementPreference(localStorage, value);
        updateMediaPlacement(settingsState.mediaFreePlacement);
        persistSettingsKeys([STORAGE_KEYS.MEDIA_FREE_PLACEMENT]);
    },

    get showMascot(): boolean {
        return settingsState.showMascot;
    },

    set showMascot(value: boolean) {
        settingsState.showMascot = setShowMascotPreference(localStorage, value);
        persistSettingsKeys([STORAGE_KEYS.SHOW_MASCOT]);
    },

    get showFlavorText(): boolean {
        return settingsState.showFlavorText;
    },

    set showFlavorText(value: boolean) {
        settingsState.showFlavorText = setShowFlavorTextPreference(
            localStorage,
            value,
        );
        persistSettingsKeys([STORAGE_KEYS.SHOW_FLAVOR_TEXT]);
    },

    applyParentSettings(
        payload: EmbedSettingsSetPayload,
        source: PreferenceSource = "parentForced",
    ): string[] {
        const applied: string[] = [];

        if (payload.locale !== undefined) {
            const hadStoredEndpoint = hasStoredUploadEndpoint(localStorage);
            const nextLocale = setLocalePreference(localStorage, payload.locale, source);
            settingsState.locale = nextLocale;
            document.documentElement.lang = nextLocale;
            i18nLocale.set(nextLocale);
            applied.push("locale");

            if (!hadStoredEndpoint && payload.uploadEndpoint === undefined) {
                settingsState.uploadEndpoint = ensureUploadEndpointPreference(
                    localStorage,
                    nextLocale,
                );
            }
        }

        if (payload.themeMode !== undefined) {
            themeModeStore.set(payload.themeMode, source);
            applied.push("themeMode");
        }

        if (payload.uploadEndpoint !== undefined) {
            settingsState.uploadEndpoint = setUploadEndpointPreference(
                localStorage,
                payload.uploadEndpoint,
                source,
            );
            applied.push("uploadEndpoint");
        }

        if (payload.imageCompressionLevel !== undefined) {
            settingsState.imageCompressionLevel = setImageCompressionLevelPreference(
                localStorage,
                payload.imageCompressionLevel,
                source,
            );
            applied.push("imageCompressionLevel");
        }

        if (payload.videoCompressionLevel !== undefined) {
            settingsState.videoCompressionLevel = setVideoCompressionLevelPreference(
                localStorage,
                payload.videoCompressionLevel,
                source,
            );
            applied.push("videoCompressionLevel");
        }

        if (payload.clientTagEnabled !== undefined) {
            settingsState.clientTagEnabled = setClientTagEnabledPreference(
                localStorage,
                payload.clientTagEnabled,
                source,
            );
            applied.push("clientTagEnabled");
        }

        if (payload.quoteNotificationEnabled !== undefined) {
            settingsState.quoteNotificationEnabled = setQuoteNotificationEnabledPreference(
                localStorage,
                payload.quoteNotificationEnabled,
                source,
            );
            applied.push("quoteNotificationEnabled");
        }

        if (payload.mediaFreePlacement !== undefined) {
            settingsState.mediaFreePlacement = setMediaFreePlacementPreference(
                localStorage,
                payload.mediaFreePlacement,
                source,
            );
            updateMediaPlacement(settingsState.mediaFreePlacement);
            applied.push("mediaFreePlacement");
        }

        if (payload.showMascot !== undefined) {
            settingsState.showMascot = setShowMascotPreference(
                localStorage,
                payload.showMascot,
                source,
            );
            applied.push("showMascot");
        }

        if (payload.showFlavorText !== undefined) {
            settingsState.showFlavorText = setShowFlavorTextPreference(
                localStorage,
                payload.showFlavorText,
                source,
            );
            applied.push("showFlavorText");
        }

        if (applied.length > 0) {
            embedStorageService.persistLocalStorageKeys([
                STORAGE_KEYS.LOCALE,
                STORAGE_KEYS.THEME_MODE,
                STORAGE_KEYS.DARK_MODE,
                STORAGE_KEYS.UPLOAD_ENDPOINT,
                STORAGE_KEYS.CLIENT_TAG_ENABLED,
                STORAGE_KEYS.QUOTE_NOTIFICATION_ENABLED,
                STORAGE_KEYS.IMAGE_COMPRESSION_LEVEL,
                STORAGE_KEYS.VIDEO_COMPRESSION_LEVEL,
                STORAGE_KEYS.MEDIA_FREE_PLACEMENT,
                STORAGE_KEYS.SHOW_MASCOT,
                STORAGE_KEYS.SHOW_FLAVOR_TEXT,
                STORAGE_KEYS.SETTINGS_PREFERENCE_METADATA,
            ]);
        }

        return applied;
    },

    applyStoredSnapshot(): void {
        settingsStore.reload();
        themeModeStore.reload();
    },
};

export function consumeFirstVisitFlag(): boolean {
    const result = consumeFirstVisit(localStorage);
    embedStorageService.persistLocalStorageKeys([STORAGE_KEYS.FIRST_VISIT]);
    return result;
}

export function isSharedMediaProcessed(): boolean {
    return readSharedMediaProcessed(localStorage);
}

export function markSharedMediaProcessed(): void {
    writeSharedMediaProcessed(localStorage);
    embedStorageService.persistLocalStorageKeys([STORAGE_KEYS.SHARED_MEDIA_PROCESSED]);
}

export function clearSharedMediaProcessed(): void {
    removeSharedMediaProcessed(localStorage);
    embedStorageService.persistLocalStorageKeys([STORAGE_KEYS.SHARED_MEDIA_PROCESSED]);
}
