import { getAppStorage, EHAGAKI_WEB_COMPONENT_STORAGE_PREFIX } from "../lib/appStorage";
import { embedStorageService } from "../lib/embedStorageService";
import { STORAGE_KEYS } from "../lib/constants";
import {
    normalizeFooterSettingShortcuts,
    parseFooterSettingShortcuts,
    serializeFooterSettingShortcuts,
    type FooterSettingShortcutSlots,
} from "../lib/footerSettingShortcuts";

const appStorage = getAppStorage();
const storageKey = STORAGE_KEYS.FOOTER_SETTING_SHORTCUTS;
let selected = $state(parseFooterSettingShortcuts(appStorage.getItem(storageKey)));
let notificationsSelected = $derived(selected.left === 'notifications' || selected.right === 'notifications');

function repairStoredValue(): void {
    const raw = appStorage.getItem(storageKey);
    const normalized = parseFooterSettingShortcuts(raw);
    const canonical = serializeFooterSettingShortcuts(normalized);
    if (raw !== canonical) appStorage.setItem(storageKey, canonical);
}

repairStoredValue();

export const footerSettingShortcutsStore = {
    get value(): FooterSettingShortcutSlots {
        return selected;
    },
    get notificationsEnabled(): boolean {
        return notificationsSelected;
    },
    set(value: unknown): void {
        selected = normalizeFooterSettingShortcuts(value);
        const canonical = serializeFooterSettingShortcuts(selected);
        appStorage.setItem(storageKey, canonical);
        embedStorageService.persistLocalStorageKeys([storageKey]);
    },
    reload(): void {
        const raw = appStorage.getItem(storageKey);
        selected = parseFooterSettingShortcuts(raw);
        const canonical = serializeFooterSettingShortcuts(selected);
        if (raw !== canonical) appStorage.setItem(storageKey, canonical);
    },
};

export function watchFooterSettingShortcuts(): () => void {
    const reload = (event: StorageEvent) => {
        if (event.key === storageKey || event.key === `${EHAGAKI_WEB_COMPONENT_STORAGE_PREFIX}${storageKey}` || event.key === null)
            footerSettingShortcutsStore.reload();
    };
    window.addEventListener('storage', reload);
    return () => window.removeEventListener('storage', reload);
}
