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
import {
    persistAllEmbedSettingKeys,
    persistChangedEmbedSettingKeys,
} from "../lib/embedSettingsPersistence";

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

type DirectSettingKey = Exclude<keyof SettingsState, "locale">;

interface DirectSettingDescriptor<K extends DirectSettingKey> {
    storageKeys: readonly string[];
    apply: (value: SettingsState[K], source: PreferenceSource) => SettingsState[K];
    afterApply?: (value: SettingsState[K]) => void;
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

const directSettingDescriptors: {
    [K in DirectSettingKey]: DirectSettingDescriptor<K>;
} = {
    uploadEndpoint: {
        storageKeys: [STORAGE_KEYS.UPLOAD_ENDPOINT],
        apply: (value: string, source: PreferenceSource) =>
            setUploadEndpointPreference(localStorage, value, source),
    },
    clientTagEnabled: {
        storageKeys: [STORAGE_KEYS.CLIENT_TAG_ENABLED],
        apply: (value: boolean, source: PreferenceSource) =>
            setClientTagEnabledPreference(localStorage, value, source),
    },
    quoteNotificationEnabled: {
        storageKeys: [STORAGE_KEYS.QUOTE_NOTIFICATION_ENABLED],
        apply: (value: boolean, source: PreferenceSource) =>
            setQuoteNotificationEnabledPreference(localStorage, value, source),
    },
    imageCompressionLevel: {
        storageKeys: [STORAGE_KEYS.IMAGE_COMPRESSION_LEVEL],
        apply: (value: string, source: PreferenceSource) =>
            setImageCompressionLevelPreference(localStorage, value, source),
    },
    videoCompressionLevel: {
        storageKeys: [STORAGE_KEYS.VIDEO_COMPRESSION_LEVEL],
        apply: (value: string, source: PreferenceSource) =>
            setVideoCompressionLevelPreference(localStorage, value, source),
    },
    mediaFreePlacement: {
        storageKeys: [STORAGE_KEYS.MEDIA_FREE_PLACEMENT],
        apply: (value: boolean, source: PreferenceSource) =>
            setMediaFreePlacementPreference(localStorage, value, source),
        afterApply: updateMediaPlacement,
    },
    showMascot: {
        storageKeys: [STORAGE_KEYS.SHOW_MASCOT],
        apply: (value: boolean, source: PreferenceSource) =>
            setShowMascotPreference(localStorage, value, source),
    },
    showFlavorText: {
        storageKeys: [STORAGE_KEYS.SHOW_FLAVOR_TEXT],
        apply: (value: boolean, source: PreferenceSource) =>
            setShowFlavorTextPreference(localStorage, value, source),
    },
};

const parentDirectSettingKeys: DirectSettingKey[] = [
    "uploadEndpoint",
    "imageCompressionLevel",
    "videoCompressionLevel",
    "clientTagEnabled",
    "quoteNotificationEnabled",
    "mediaFreePlacement",
    "showMascot",
    "showFlavorText",
];

function persistDirectSettingKey(key: DirectSettingKey): void {
    persistChangedEmbedSettingKeys(directSettingDescriptors[key].storageKeys);
}

function getDirectSettingDescriptor<K extends DirectSettingKey>(
    key: K,
): DirectSettingDescriptor<K> {
    return directSettingDescriptors[key] as DirectSettingDescriptor<K>;
}

function applyLocaleSetting(
    value: string,
    {
        source = "user",
        refreshUploadEndpoint = true,
        syncDocumentLang = false,
    }: {
        source?: PreferenceSource;
        refreshUploadEndpoint?: boolean;
        syncDocumentLang?: boolean;
    } = {},
): SupportedLocale {
    const hadStoredEndpoint = hasStoredUploadEndpoint(localStorage);
    const nextLocale = setLocalePreference(localStorage, value, source);
    settingsState.locale = nextLocale;

    if (!hadStoredEndpoint && refreshUploadEndpoint) {
        settingsState.uploadEndpoint = ensureUploadEndpointPreference(
            localStorage,
            nextLocale,
        );
    }

    if (syncDocumentLang) {
        document.documentElement.lang = nextLocale;
    }

    i18nLocale.set(nextLocale);
    return nextLocale;
}

function applyDirectSetting<K extends DirectSettingKey>(
    key: K,
    value: SettingsState[K],
    source: PreferenceSource = "user",
): SettingsState[K] {
    const descriptor = getDirectSettingDescriptor(key);
    const nextValue = descriptor.apply(value, source);
    (settingsState as SettingsState)[key] = nextValue;
    descriptor.afterApply?.(nextValue);
    return nextValue;
}

function applyParentDirectSetting<K extends DirectSettingKey>(
    payload: EmbedSettingsSetPayload,
    key: K,
    source: PreferenceSource,
    applied: string[],
): void {
    const value = payload[key];
    if (value === undefined) {
        return;
    }

    applyDirectSetting(key, value as SettingsState[K], source);
    applied.push(key);
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
        applyLocaleSetting(value);
        persistChangedEmbedSettingKeys([
            STORAGE_KEYS.LOCALE,
            STORAGE_KEYS.UPLOAD_ENDPOINT,
        ]);
    },

    get uploadEndpoint(): string {
        return settingsState.uploadEndpoint;
    },

    set uploadEndpoint(value: string) {
        applyDirectSetting("uploadEndpoint", value);
        persistDirectSettingKey("uploadEndpoint");
    },

    get clientTagEnabled(): boolean {
        return settingsState.clientTagEnabled;
    },

    set clientTagEnabled(value: boolean) {
        applyDirectSetting("clientTagEnabled", value);
        persistDirectSettingKey("clientTagEnabled");
    },

    get quoteNotificationEnabled(): boolean {
        return settingsState.quoteNotificationEnabled;
    },

    set quoteNotificationEnabled(value: boolean) {
        applyDirectSetting("quoteNotificationEnabled", value);
        persistDirectSettingKey("quoteNotificationEnabled");
    },

    get imageCompressionLevel(): string {
        return settingsState.imageCompressionLevel;
    },

    set imageCompressionLevel(value: string) {
        applyDirectSetting("imageCompressionLevel", value);
        persistDirectSettingKey("imageCompressionLevel");
    },

    get videoCompressionLevel(): string {
        return settingsState.videoCompressionLevel;
    },

    set videoCompressionLevel(value: string) {
        applyDirectSetting("videoCompressionLevel", value);
        persistDirectSettingKey("videoCompressionLevel");
    },

    get mediaFreePlacement(): boolean {
        return settingsState.mediaFreePlacement;
    },

    set mediaFreePlacement(value: boolean) {
        applyDirectSetting("mediaFreePlacement", value);
        persistDirectSettingKey("mediaFreePlacement");
    },

    get showMascot(): boolean {
        return settingsState.showMascot;
    },

    set showMascot(value: boolean) {
        applyDirectSetting("showMascot", value);
        persistDirectSettingKey("showMascot");
    },

    get showFlavorText(): boolean {
        return settingsState.showFlavorText;
    },

    set showFlavorText(value: boolean) {
        applyDirectSetting("showFlavorText", value);
        persistDirectSettingKey("showFlavorText");
    },

    applyParentSettings(
        payload: EmbedSettingsSetPayload,
        source: PreferenceSource = "parentForced",
    ): string[] {
        const applied: string[] = [];

        if (payload.locale !== undefined) {
            applyLocaleSetting(payload.locale, {
                source,
                refreshUploadEndpoint: payload.uploadEndpoint === undefined,
                syncDocumentLang: true,
            });
            applied.push("locale");
        }

        if (payload.themeMode !== undefined) {
            themeModeStore.set(payload.themeMode, source);
            applied.push("themeMode");
        }

        parentDirectSettingKeys.forEach((key) => {
            applyParentDirectSetting(payload, key, source, applied);
        });

        if (applied.length > 0) {
            persistAllEmbedSettingKeys();
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
