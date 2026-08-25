import { STORAGE_KEYS } from "../lib/constants";
import { getAppRuntimeEnvironment } from "../lib/appRuntimeEnvironment";
import { getAppStorage } from "../lib/appStorage";
import { persistChangedEmbedSettingKeys } from "../lib/embedSettingsPersistence";
import {
    clearThemeColorPreferences,
    getThemeColorPreferences,
    normalizeHexColor,
    setThemeColorPreference,
    type ThemeColors,
} from "../lib/utils/settingsStorage";

export interface ExternalThemeColorLayers {
    forcedAccentColor?: string | null;
    forcedBaseColor?: string | null;
    defaultAccentColor?: string | null;
    defaultBaseColor?: string | null;
}

let externalThemeColorLayers: Required<ExternalThemeColorLayers> = {
    forcedAccentColor: null,
    forcedBaseColor: null,
    defaultAccentColor: null,
    defaultBaseColor: null,
};

function readInitialExternalColor(property: string): string | null {
    const value = getAppRuntimeEnvironment().themeTarget.style.getPropertyValue(property);
    return normalizeHexColor(value) ?? null;
}

externalThemeColorLayers = {
    forcedAccentColor: readInitialExternalColor("--accent-color-forced"),
    forcedBaseColor: readInitialExternalColor("--base-color-forced"),
    defaultAccentColor: readInitialExternalColor("--accent-color-external-default"),
    defaultBaseColor: readInitialExternalColor("--base-color-external-default"),
};

function readThemeColors(): ThemeColors {
    return getThemeColorPreferences(getAppStorage());
}

function setOrRemoveStyleProperty(
    style: CSSStyleDeclaration,
    property: string,
    value: string | null,
): void {
    if (value) {
        style.setProperty(property, value);
    } else {
        style.removeProperty(property);
    }
}

function applyThemeColors(colors: ThemeColors): void {
    const style = getAppRuntimeEnvironment().themeTarget.style;
    setOrRemoveStyleProperty(style, "--accent-color-user", colors.accentColor);
    setOrRemoveStyleProperty(style, "--base-color-user", colors.baseColor);
    setOrRemoveStyleProperty(
        style,
        "--accent-color-forced",
        externalThemeColorLayers.forcedAccentColor,
    );
    setOrRemoveStyleProperty(
        style,
        "--base-color-forced",
        externalThemeColorLayers.forcedBaseColor,
    );
    setOrRemoveStyleProperty(
        style,
        "--accent-color-external-default",
        externalThemeColorLayers.defaultAccentColor,
    );
    setOrRemoveStyleProperty(
        style,
        "--base-color-external-default",
        externalThemeColorLayers.defaultBaseColor,
    );
}

function normalizeExternalColor(value: string | null | undefined): string | null {
    if (value === null || value === undefined) {
        return null;
    }

    const normalized = normalizeHexColor(value);
    if (!normalized) {
        throw new Error("invalid_theme_color");
    }
    return normalized;
}

const initialThemeColors = readThemeColors();
let themeColors = $state<ThemeColors>(initialThemeColors);
applyThemeColors(initialThemeColors);

function setThemeColor(
    key: "accentColor" | "baseColor",
    storageKey: typeof STORAGE_KEYS.ACCENT_COLOR | typeof STORAGE_KEYS.BASE_COLOR,
    value: string,
): string | null {
    const normalized = setThemeColorPreference(getAppStorage(), storageKey, value);
    if (!normalized) {
        return null;
    }

    themeColors = { ...themeColors, [key]: normalized };
    applyThemeColors(themeColors);
    persistChangedEmbedSettingKeys([storageKey]);
    return normalized;
}

/** User color preferences plus non-persistent external display layers. */
export const themeColorStore = {
    get isAvailable(): boolean {
        return true;
    },
    get accentColor(): string | null {
        return themeColors.accentColor;
    },
    get baseColor(): string | null {
        return themeColors.baseColor;
    },
    setAccentColor(value: string): string | null {
        return setThemeColor("accentColor", STORAGE_KEYS.ACCENT_COLOR, value);
    },
    setBaseColor(value: string): string | null {
        return setThemeColor("baseColor", STORAGE_KEYS.BASE_COLOR, value);
    },
    setExternalLayers(layers: ExternalThemeColorLayers): void {
        externalThemeColorLayers = {
            forcedAccentColor: normalizeExternalColor(layers.forcedAccentColor),
            forcedBaseColor: normalizeExternalColor(layers.forcedBaseColor),
            defaultAccentColor: normalizeExternalColor(layers.defaultAccentColor),
            defaultBaseColor: normalizeExternalColor(layers.defaultBaseColor),
        };
        applyThemeColors(themeColors);
    },
    applyExternalSettings(
        layers: Pick<ExternalThemeColorLayers, "forcedAccentColor" | "forcedBaseColor">,
    ): string[] {
        const nextForcedAccentColor = layers.forcedAccentColor === undefined
            ? externalThemeColorLayers.forcedAccentColor
            : normalizeExternalColor(layers.forcedAccentColor);
        const nextForcedBaseColor = layers.forcedBaseColor === undefined
            ? externalThemeColorLayers.forcedBaseColor
            : normalizeExternalColor(layers.forcedBaseColor);
        externalThemeColorLayers = {
            ...externalThemeColorLayers,
            forcedAccentColor: nextForcedAccentColor,
            forcedBaseColor: nextForcedBaseColor,
        };
        applyThemeColors(themeColors);
        return [
            ...(layers.forcedAccentColor !== undefined ? ["accentColor"] : []),
            ...(layers.forcedBaseColor !== undefined ? ["baseColor"] : []),
        ];
    },
    reset(): void {
        clearThemeColorPreferences(getAppStorage());
        themeColors = { accentColor: null, baseColor: null };
        applyThemeColors(themeColors);
        persistChangedEmbedSettingKeys([
            STORAGE_KEYS.ACCENT_COLOR,
            STORAGE_KEYS.BASE_COLOR,
        ]);
    },
    reload(): void {
        themeColors = readThemeColors();
        applyThemeColors(themeColors);
    },
};
