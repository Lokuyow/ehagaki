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
    },

    get uploadEndpoint(): string {
        return settingsState.uploadEndpoint;
    },

    set uploadEndpoint(value: string) {
        settingsState.uploadEndpoint = setUploadEndpointPreference(localStorage, value);
    },

    get clientTagEnabled(): boolean {
        return settingsState.clientTagEnabled;
    },

    set clientTagEnabled(value: boolean) {
        settingsState.clientTagEnabled = setClientTagEnabledPreference(localStorage, value);
    },

    get quoteNotificationEnabled(): boolean {
        return settingsState.quoteNotificationEnabled;
    },

    set quoteNotificationEnabled(value: boolean) {
        settingsState.quoteNotificationEnabled = setQuoteNotificationEnabledPreference(
            localStorage,
            value,
        );
    },

    get imageCompressionLevel(): string {
        return settingsState.imageCompressionLevel;
    },

    set imageCompressionLevel(value: string) {
        settingsState.imageCompressionLevel = setImageCompressionLevelPreference(
            localStorage,
            value,
        );
    },

    get videoCompressionLevel(): string {
        return settingsState.videoCompressionLevel;
    },

    set videoCompressionLevel(value: string) {
        settingsState.videoCompressionLevel = setVideoCompressionLevelPreference(
            localStorage,
            value,
        );
    },

    get mediaFreePlacement(): boolean {
        return settingsState.mediaFreePlacement;
    },

    set mediaFreePlacement(value: boolean) {
        settingsState.mediaFreePlacement = setMediaFreePlacementPreference(localStorage, value);
        updateMediaPlacement(settingsState.mediaFreePlacement);
    },

    get showMascot(): boolean {
        return settingsState.showMascot;
    },

    set showMascot(value: boolean) {
        settingsState.showMascot = setShowMascotPreference(localStorage, value);
    },

    get showFlavorText(): boolean {
        return settingsState.showFlavorText;
    },

    set showFlavorText(value: boolean) {
        settingsState.showFlavorText = setShowFlavorTextPreference(
            localStorage,
            value,
        );
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

        return applied;
    },
};

export function consumeFirstVisitFlag(): boolean {
    return consumeFirstVisit(localStorage);
}

export function isSharedMediaProcessed(): boolean {
    return readSharedMediaProcessed(localStorage);
}

export function markSharedMediaProcessed(): void {
    writeSharedMediaProcessed(localStorage);
}

export function clearSharedMediaProcessed(): void {
    removeSharedMediaProcessed(localStorage);
}
