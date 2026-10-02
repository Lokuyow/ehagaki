import { getAppStorage } from "../lib/appStorage";
import { embedStorageService } from "../lib/embedStorageService";
import { STORAGE_KEYS } from "../lib/constants";
import {
    normalizeFooterSettingShortcuts,
    parseFooterSettingShortcuts,
    type FooterSettingShortcutId,
} from "../lib/footerSettingShortcuts";

const appStorage = getAppStorage();
const storageKey = STORAGE_KEYS.FOOTER_SETTING_SHORTCUTS;
let selected = $state(parseFooterSettingShortcuts(appStorage.getItem(storageKey)));

function repairStoredValue(): void {
    const raw = appStorage.getItem(storageKey);
    const normalized = parseFooterSettingShortcuts(raw);
    const canonical = JSON.stringify(normalized);
    if (raw !== canonical) appStorage.setItem(storageKey, canonical);
}

repairStoredValue();

export const footerSettingShortcutsStore = {
    get value(): FooterSettingShortcutId[] {
        return selected;
    },
    set(value: readonly string[]): void {
        selected = normalizeFooterSettingShortcuts(value);
        const canonical = JSON.stringify(selected);
        appStorage.setItem(storageKey, canonical);
        embedStorageService.persistLocalStorageKeys([storageKey]);
    },
    reload(): void {
        const raw = appStorage.getItem(storageKey);
        selected = parseFooterSettingShortcuts(raw);
        const canonical = JSON.stringify(selected);
        if (raw !== canonical) appStorage.setItem(storageKey, canonical);
    },
};
