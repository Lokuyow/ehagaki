import { getAppStorage } from "../lib/appStorage";
import { STORAGE_KEYS } from "../lib/constants";

export type HistoryTab = "posts" | "media";
let selected = $state<HistoryTab>("posts");
export const historyTabStore = {
    get value() { return selected; },
    restore(): HistoryTab {
        try {
            const value = getAppStorage().getItem(STORAGE_KEYS.HISTORY_ACTIVE_TAB);
            selected = value === "media" ? "media" : "posts";
        } catch { /* Keep the session choice when Storage is unavailable. */ }
        return selected;
    },
    select(value: HistoryTab): void {
        if (value !== "posts" && value !== "media") return;
        selected = value;
        try { getAppStorage().setItem(STORAGE_KEYS.HISTORY_ACTIVE_TAB, value); } catch { /* Session preference still applies. */ }
    },
};
