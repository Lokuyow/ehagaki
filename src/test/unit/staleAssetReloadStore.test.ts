import { beforeEach, describe, expect, it, vi } from "vitest";

describe("stale asset reload state", () => {
    beforeEach(() => {
        vi.resetModules();
    });

    it("stale状態と一回性prompt revisionを分離する", async () => {
        const store = await import("../../stores/staleAssetReloadStore.svelte");

        expect(store.staleAssetReloadState.required).toBe(false);
        expect(store.markStaleAssetReloadRequired()).toBe(true);
        expect(store.markStaleAssetReloadRequired()).toBe(false);
        expect(store.staleAssetReloadState.required).toBe(true);

        expect(store.requestStaleReloadPrompt()).toBe(1);
        expect(store.requestStaleReloadPrompt()).toBe(2);
        expect(store.staleAssetReloadState.required).toBe(true);
    });

    it("vite:preloadErrorはstale時だけ抑止してpromptを要求する", async () => {
        const store = await import("../../stores/staleAssetReloadStore.svelte");
        const { handleStaleAssetPreloadError } = await import(
            "../../lib/staleAssetPreloadError"
        );
        const normalEvent = new Event("vite:preloadError", {
            cancelable: true,
        });

        expect(handleStaleAssetPreloadError(normalEvent)).toBe(false);
        expect(normalEvent.defaultPrevented).toBe(false);

        store.markStaleAssetReloadRequired();
        const staleEvent = Object.assign(
            new Event("vite:preloadError", { cancelable: true }),
            { payload: new TypeError("Failed to fetch dynamically imported module") },
        );
        expect(handleStaleAssetPreloadError(staleEvent)).toBe(true);
        expect(staleEvent.defaultPrevented).toBe(true);
        expect(store.staleAssetReloadState.promptRevision).toBe(1);
    });
});

