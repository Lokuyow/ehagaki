import { STORAGE_KEYS } from "../lib/constants";
import { getAppRuntimeEnvironment } from "../lib/appRuntimeEnvironment";
import { getAppStorage } from "../lib/appStorage";
import {
    clearThemeColorPreferences,
    getThemeColorPreferences,
    setThemeColorPreference,
    type ThemeColors,
} from "../lib/utils/settingsStorage";

function isStandaloneThemeColorTarget(): boolean {
    const runtimeEnvironment = getAppRuntimeEnvironment();
    return runtimeEnvironment.layoutMode === "viewport"
        && runtimeEnvironment.window?.top === runtimeEnvironment.window;
}

function readThemeColors(): ThemeColors {
    return isStandaloneThemeColorTarget()
        ? getThemeColorPreferences(getAppStorage())
        : { accentColor: null, baseColor: null };
}

function applyThemeColors(colors: ThemeColors): void {
    if (!isStandaloneThemeColorTarget()) {
        return;
    }

    const style = getAppRuntimeEnvironment().styleTarget.style;
    if (colors.accentColor) {
        style.setProperty("--accent-color", colors.accentColor);
    } else {
        style.removeProperty("--accent-color");
    }

    if (colors.baseColor) {
        style.setProperty("--base-color", colors.baseColor);
    } else {
        style.removeProperty("--base-color");
    }
}

const initialThemeColors = readThemeColors();
let themeColors = $state<ThemeColors>(initialThemeColors);
applyThemeColors(initialThemeColors);

function setThemeColor(
    key: "accentColor" | "baseColor",
    storageKey: typeof STORAGE_KEYS.ACCENT_COLOR | typeof STORAGE_KEYS.BASE_COLOR,
    value: string,
): string | null {
    if (!isStandaloneThemeColorTarget()) {
        return null;
    }

    const normalized = setThemeColorPreference(getAppStorage(), storageKey, value);
    if (!normalized) {
        return null;
    }

    themeColors = { ...themeColors, [key]: normalized };
    applyThemeColors(themeColors);
    return normalized;
}

/**
 * Standalone-only user color preferences. These deliberately do not use the
 * embed settings persistence path, so hosts retain control of embed colors.
 */
export const themeColorStore = {
    get isAvailable(): boolean {
        return isStandaloneThemeColorTarget();
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
    reset(): void {
        if (!isStandaloneThemeColorTarget()) {
            return;
        }
        clearThemeColorPreferences(getAppStorage());
        themeColors = { accentColor: null, baseColor: null };
        applyThemeColors(themeColors);
    },
    reload(): void {
        themeColors = readThemeColors();
        applyThemeColors(themeColors);
    },
};
