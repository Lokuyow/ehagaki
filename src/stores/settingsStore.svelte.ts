import { locale as i18nLocale } from "svelte-i18n";
import type { EmbedSettingsSetPayload } from "../lib/embedProtocol";
import {
    getClientTagEnabledPreference,
    getEffectiveLocale,
    getImageCompressionLevelPreference,
    getMediaFreePlacementPreference,
    getQuoteNotificationEnabledPreference,
    getShowFlavorTextPreference,
    getShowMascotPreference,
    getVideoCompressionLevelPreference,
    normalizeLegacyCompressionLevelPreference,
    setClientTagEnabledPreference,
    setImageCompressionLevelPreference,
    setLocalePreference,
    setMediaFreePlacementPreference,
    setQuoteNotificationEnabledPreference,
    setShowFlavorTextPreference,
    setShowMascotPreference,
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
    clientTagEnabled: boolean;
    quoteNotificationEnabled: boolean;
    imageQualityLevel: string;
    videoQualityLevel: string;
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

    return {
        locale: effectiveLocale,
        clientTagEnabled: getClientTagEnabledPreference(localStorage),
        quoteNotificationEnabled: getQuoteNotificationEnabledPreference(localStorage),
        imageQualityLevel: getImageCompressionLevelPreference(localStorage),
        videoQualityLevel: getVideoCompressionLevelPreference(localStorage),
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
    imageQualityLevel: {
        storageKeys: [
            STORAGE_KEYS.IMAGE_QUALITY_LEVEL,
            STORAGE_KEYS.LEGACY_IMAGE_COMPRESSION_LEVEL,
        ],
        apply: (value: string, source: PreferenceSource) =>
            setImageCompressionLevelPreference(localStorage, value, source),
    },
    videoQualityLevel: {
        storageKeys: [
            STORAGE_KEYS.VIDEO_QUALITY_LEVEL,
            STORAGE_KEYS.LEGACY_VIDEO_COMPRESSION_LEVEL,
        ],
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
    "imageQualityLevel",
    "videoQualityLevel",
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
        syncDocumentLang = false,
    }: {
        source?: PreferenceSource;
        syncDocumentLang?: boolean;
    } = {},
): SupportedLocale {
    const nextLocale = setLocalePreference(localStorage, value, source);
    settingsState.locale = nextLocale;

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
        persistChangedEmbedSettingKeys([STORAGE_KEYS.LOCALE]);
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

    get imageQualityLevel(): string {
        return settingsState.imageQualityLevel;
    },

    set imageQualityLevel(value: string) {
        applyDirectSetting("imageQualityLevel", value);
        persistDirectSettingKey("imageQualityLevel");
    },

    get videoQualityLevel(): string {
        return settingsState.videoQualityLevel;
    },

    set videoQualityLevel(value: string) {
        applyDirectSetting("videoQualityLevel", value);
        persistDirectSettingKey("videoQualityLevel");
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
                syncDocumentLang: true,
            });
            applied.push("locale");
        }

        if (payload.themeMode !== undefined) {
            themeModeStore.set(payload.themeMode, source);
            applied.push("themeMode");
        }

        if (
            payload.imageQualityLevel === undefined
            && payload.imageCompressionLevel !== undefined
        ) {
            payload = {
                ...payload,
                imageQualityLevel:
                    normalizeLegacyCompressionLevelPreference(
                        payload.imageCompressionLevel,
                    ) as EmbedSettingsSetPayload["imageQualityLevel"],
            };
        }

        if (
            payload.videoQualityLevel === undefined
            && payload.videoCompressionLevel !== undefined
        ) {
            payload = {
                ...payload,
                videoQualityLevel:
                    normalizeLegacyCompressionLevelPreference(
                        payload.videoCompressionLevel,
                    ) as EmbedSettingsSetPayload["videoQualityLevel"],
            };
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
