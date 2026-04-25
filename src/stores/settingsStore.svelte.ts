import { locale as i18nLocale } from "svelte-i18n";
import {
    getClientTagEnabledPreference,
    ensureUploadEndpointPreference,
    getEffectiveLocale,
    getImageCompressionLevelPreference,
    getMediaFreePlacementPreference,
    getQuoteNotificationEnabledPreference,
    getShowBalloonMessagePreference,
    getShowMascotPreference,
    getUploadEndpointPreference,
    getVideoCompressionLevelPreference,
    hasStoredUploadEndpoint,
    setClientTagEnabledPreference,
    setImageCompressionLevelPreference,
    setLocalePreference,
    setMediaFreePlacementPreference,
    setQuoteNotificationEnabledPreference,
    setShowBalloonMessagePreference,
    setShowMascotPreference,
    setUploadEndpointPreference,
    setVideoCompressionLevelPreference,
    consumeFirstVisit,
    isSharedMediaProcessed as readSharedMediaProcessed,
    markSharedMediaProcessed as writeSharedMediaProcessed,
    clearSharedMediaProcessed as removeSharedMediaProcessed,
    type SupportedLocale,
} from "../lib/utils/settingsStorage";
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
    showBalloonMessage: boolean;
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
        showBalloonMessage: getShowBalloonMessagePreference(localStorage),
    };
}

let settingsState = $state<SettingsState>(readSettingsState());
mediaFreePlacementStore.set(settingsState.mediaFreePlacement);

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

    get showBalloonMessage(): boolean {
        return settingsState.showBalloonMessage;
    },

    set showBalloonMessage(value: boolean) {
        settingsState.showBalloonMessage = setShowBalloonMessagePreference(
            localStorage,
            value,
        );
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
