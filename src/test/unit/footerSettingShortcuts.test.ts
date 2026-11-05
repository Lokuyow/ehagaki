import { beforeEach, describe, expect, it, vi } from "vitest";
import { normalizeFooterSettingShortcuts, parseFooterSettingShortcuts } from "../../lib/footerSettingShortcuts";
import { EMBED_SETTING_STORAGE_KEYS } from "../../lib/embedStorageKeys";

describe("footer setting shortcut normalization", () => {
    it('migrates the right slot once and preserves later explicit choices', () => {
        expect(parseFooterSettingShortcuts('{"left":"language","right":"image-quality"}'))
            .toEqual({ left: 'language', right: 'notifications' });
        expect(parseFooterSettingShortcuts('{"version":1,"left":null,"right":null}'))
            .toEqual({ left: null, right: null });
        expect(parseFooterSettingShortcuts('{"version":1,"left":"notifications","right":"language"}'))
            .toEqual({ left: 'notifications', right: 'language' });
    });
    it("defaults to notifications and handles malformed storage", () => {
        expect(parseFooterSettingShortcuts(null)).toEqual({ left: null, right: "notifications" });
        expect(parseFooterSettingShortcuts("{")).toEqual({ left: null, right: "notifications" });
        expect(parseFooterSettingShortcuts(JSON.stringify(["language"]))).toEqual({ left: null, right: "notifications" });
        expect(parseFooterSettingShortcuts(JSON.stringify({ id: "language" }))).toEqual({ left: null, right: "notifications" });
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
    it('does not enable notifications again after removal and reload', async () => {
        localStorage.setItem('footerSettingShortcuts', '{"left":"language","right":"image-quality"}');
        const { footerSettingShortcutsStore: store } = await import('../../stores/footerSettingShortcutsStore.svelte');
        expect(store.value).toEqual({ left: 'language', right: 'notifications' });
        store.set({ left: 'language', right: 'image-quality' });
        store.reload();
        expect(store.notificationsEnabled).toBe(false);
        expect(JSON.parse(localStorage.getItem('footerSettingShortcuts')!)).toEqual({ version: 1, left: 'language', right: 'image-quality' });
    });
    it('round-trips migrated iframe storage without replacing a later choice', async () => {
        const { footerSettingShortcutsStore: store } = await import('../../stores/footerSettingShortcutsStore.svelte');
        const { embedStorageService } = await import('../../lib/embedStorageService');
        embedStorageService.applySnapshotToLocalStorage({ footerSettingShortcuts: '{"left":"language","right":"video-quality"}' });
        store.reload();
        expect(store.value).toEqual({ left: 'language', right: 'notifications' });
        store.set({ left: 'notifications', right: 'video-quality' });
        const saved = localStorage.getItem('footerSettingShortcuts')!;
        embedStorageService.applySnapshotToLocalStorage({ footerSettingShortcuts: saved });
        store.reload();
        expect(store.value).toEqual({ left: 'notifications', right: 'video-quality' });
    });
    beforeEach(() => {
        localStorage.clear();
        vi.resetModules();
    });

    it("persists user changes, reloads canonical values, and does not delegate during reload repair", async () => {
        const { embedStorageService } = await import("../../lib/embedStorageService");
        const persist = vi.spyOn(embedStorageService, "persistLocalStorageKeys");
        const { footerSettingShortcutsStore } = await import("../../stores/footerSettingShortcutsStore.svelte");

        expect(footerSettingShortcutsStore.value).toEqual({ left: null, right: "notifications" });
        footerSettingShortcutsStore.set({ left: "reply-notification", right: "language" });
        expect(localStorage.getItem("footerSettingShortcuts")).toBe('{"version":1,"left":"reply-notification","right":"language"}');
        expect(persist).toHaveBeenCalledWith(["footerSettingShortcuts"]);

        localStorage.setItem("footerSettingShortcuts", '{"version":1,"left":"language","right":"language","extra":"theme-mode"}');
        persist.mockClear();
        footerSettingShortcutsStore.reload();
        expect(footerSettingShortcutsStore.value).toEqual({ left: "language", right: null });
        expect(localStorage.getItem("footerSettingShortcuts")).toBe('{"version":1,"left":"language","right":null}');
        expect(persist).not.toHaveBeenCalled();
        expect(EMBED_SETTING_STORAGE_KEYS).not.toContain("footerSettingShortcuts");
    });
});
