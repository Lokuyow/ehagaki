import { beforeEach, describe, expect, it, vi } from "vitest";
import { normalizeFooterSettingShortcuts, parseFooterSettingShortcuts } from "../../lib/footerSettingShortcuts";

describe("footer setting shortcut normalization", () => {
    it("uses an empty default and handles malformed storage", () => {
        expect(parseFooterSettingShortcuts(null)).toEqual([]);
        expect(parseFooterSettingShortcuts("{")).toEqual([]);
        expect(parseFooterSettingShortcuts(JSON.stringify({ id: "language" }))).toEqual([]);
    });

    it("removes unknown and duplicate IDs, applies canonical order, and keeps at most two", () => {
        expect(normalizeFooterSettingShortcuts([
            "reply-notification",
            "unknown",
            "language",
            "reply-notification",
            "image-quality",
        ])).toEqual(["language", "image-quality"]);
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

        expect(footerSettingShortcutsStore.value).toEqual([]);
        footerSettingShortcutsStore.set(["reply-notification", "language", "theme-mode"]);
        expect(localStorage.getItem("footerSettingShortcuts")).toBe('["language","theme-mode"]');
        expect(persist).toHaveBeenCalledWith(["footerSettingShortcuts"]);

        localStorage.setItem("footerSettingShortcuts", '["reply-notification","language","unknown"]');
        persist.mockClear();
        footerSettingShortcutsStore.reload();
        expect(footerSettingShortcutsStore.value).toEqual(["language", "reply-notification"]);
        expect(localStorage.getItem("footerSettingShortcuts")).toBe('["language","reply-notification"]');
        expect(persist).not.toHaveBeenCalled();
    });
});
