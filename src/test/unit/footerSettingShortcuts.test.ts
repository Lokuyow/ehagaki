import { beforeEach, describe, expect, it, vi } from "vitest";
import { normalizeFooterSettingShortcuts, parseFooterSettingShortcuts } from "../../lib/footerSettingShortcuts";
import { EMBED_SETTING_STORAGE_KEYS } from "../../lib/embedStorageKeys";

describe("footer setting shortcut normalization", () => {
    it("uses an empty default and handles malformed storage", () => {
        expect(parseFooterSettingShortcuts(null)).toEqual({ left: null, right: null });
        expect(parseFooterSettingShortcuts("{")).toEqual({ left: null, right: null });
        expect(parseFooterSettingShortcuts(JSON.stringify(["language"]))).toEqual({ left: null, right: null });
        expect(parseFooterSettingShortcuts(JSON.stringify({ id: "language" }))).toEqual({ left: null, right: null });
    });

    it("normalizes each slot independently and clears a duplicate from the right slot", () => {
        expect(normalizeFooterSettingShortcuts({
            left: "reply-notification",
            right: "language",
            extra: "image-quality",
        })).toEqual({ left: "reply-notification", right: "language" });
        expect(normalizeFooterSettingShortcuts({ left: "unknown", right: "image-quality" }))
            .toEqual({ left: null, right: "image-quality" });
        expect(normalizeFooterSettingShortcuts({ left: "language", right: "language" }))
            .toEqual({ left: "language", right: null });
    });
});

describe("footerSettingShortcutsStore", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.resetModules();
    });

    it("persists user changes, reloads canonical values, and does not delegate during reload repair", async () => {
        const { embedStorageService } = await import("../../lib/embedStorageService");
        const persist = vi.spyOn(embedStorageService, "persistLocalStorageKeys");
        const { footerSettingShortcutsStore } = await import("../../stores/footerSettingShortcutsStore.svelte");

        expect(footerSettingShortcutsStore.value).toEqual({ left: null, right: null });
        footerSettingShortcutsStore.set({ left: "reply-notification", right: "language" });
        expect(localStorage.getItem("footerSettingShortcuts")).toBe('{"left":"reply-notification","right":"language"}');
        expect(persist).toHaveBeenCalledWith(["footerSettingShortcuts"]);

        localStorage.setItem("footerSettingShortcuts", '{"left":"language","right":"language","extra":"theme-mode"}');
        persist.mockClear();
        footerSettingShortcutsStore.reload();
        expect(footerSettingShortcutsStore.value).toEqual({ left: "language", right: null });
        expect(localStorage.getItem("footerSettingShortcuts")).toBe('{"left":"language","right":null}');
        expect(persist).not.toHaveBeenCalled();
        expect(EMBED_SETTING_STORAGE_KEYS).not.toContain("footerSettingShortcuts");
    });
});
