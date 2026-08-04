import { describe, expect, it, vi } from "vitest";

import { createDeferred } from "../deferredTestUtils";
import { createComponentLoader } from "../../lib/appComponentLoader";

describe("createComponentLoader", () => {
    it("preload と通常 open は同じ import Promise を共有する", async () => {
        const importDeferred = createDeferred<{ default: string }>();
        const importer = vi.fn(() => importDeferred.promise);
        const loader = createComponentLoader("post-history", importer);

        const preloadPromise = loader.preload();
        const loadPromise = loader();

        expect(importer).toHaveBeenCalledOnce();
        expect(loadPromise).toBe(preloadPromise);

        importDeferred.resolve({ default: "component" });

        await expect(preloadPromise).resolves.toEqual({
            status: "loaded",
            component: "component",
        });
        await expect(loadPromise).resolves.toEqual({
            status: "loaded",
            component: "component",
        });
    });

    it("stale 中は silent preload を開始せず、通常 load は再試行できる", async () => {
        let stale = true;
        const importer = vi.fn(() => Promise.resolve({ default: "component" }));
        const loader = createComponentLoader("post-history", importer, {
            isStale: () => stale,
        });

        await expect(loader.preload()).resolves.toMatchObject({
            status: "failed",
            failureKind: "stale",
        });
        expect(importer).not.toHaveBeenCalled();

        stale = false;
        await expect(loader()).resolves.toEqual({
            status: "loaded",
            component: "component",
        });
        expect(importer).toHaveBeenCalledOnce();
    });

    it("preload 中に stale へ変化した成功結果は component として適用しない", async () => {
        let stale = false;
        const importDeferred = createDeferred<{ default: string }>();
        const loader = createComponentLoader(
            "post-history",
            () => importDeferred.promise,
            { isStale: () => stale },
        );

        const preloadPromise = loader.preload();
        stale = true;
        importDeferred.resolve({ default: "stale-component" });

        await expect(preloadPromise).resolves.toMatchObject({
            status: "failed",
            failureKind: "stale",
        });

        stale = false;
        await expect(loader()).resolves.toEqual({
            status: "loaded",
            component: "stale-component",
        });
    });

    it("silent preload の transient failure 後は通常 open で再試行する", async () => {
        const importer = vi.fn()
            .mockRejectedValueOnce(new Error("temporary"))
            .mockResolvedValueOnce({ default: "component" });
        const loader = createComponentLoader("post-history", importer);

        await expect(loader.preload()).resolves.toMatchObject({
            status: "failed",
            failureKind: "transient",
        });
        await expect(loader()).resolves.toEqual({
            status: "loaded",
            component: "component",
        });
        expect(importer).toHaveBeenCalledTimes(2);
    });

    it("成功時はcomponentとPromiseをcacheする", async () => {
        const component = { id: "lazy-component" };
        const importer = vi.fn(async () => ({ default: component }));
        const loadComponent = createComponentLoader("settings", importer);

        await expect(loadComponent()).resolves.toEqual({
            status: "loaded",
            component,
        });
        await expect(loadComponent()).resolves.toEqual({
            status: "loaded",
            component,
        });

        expect(importer).toHaveBeenCalledTimes(1);
    });

    it("同時loadは同じin-flight Promiseを共有する", async () => {
        const deferred = createDeferred<{ default: { id: string } }>();
        const importer = vi.fn(() => deferred.promise);
        const loadComponent = createComponentLoader("profile", importer);

        const first = loadComponent();
        const second = loadComponent();

        expect(first).toBe(second);
        deferred.resolve({ default: { id: "profile" } });
        await expect(first).resolves.toMatchObject({ status: "loaded" });
        expect(importer).toHaveBeenCalledOnce();
    });

    it("通常loadの失敗後はPromise cacheを解除して再試行できる", async () => {
        const importer = vi
            .fn()
            .mockRejectedValueOnce(new Error("temporary"))
            .mockResolvedValueOnce({ default: { id: "recovered" } });
        const loadComponent = createComponentLoader("draft-list", importer);

        await expect(loadComponent()).resolves.toMatchObject({
            status: "failed",
            componentKey: "draft-list",
            failureKind: "transient",
        });
        await expect(loadComponent()).resolves.toEqual({
            status: "loaded",
            component: { id: "recovered" },
        });

        expect(importer).toHaveBeenCalledTimes(2);
    });

    it("importerの同期throwもresolved failureへ変換する", async () => {
        const importer = vi.fn(() => {
            throw new Error("synchronous importer failure");
        });
        const loadComponent = createComponentLoader("settings", importer);

        await expect(loadComponent()).resolves.toMatchObject({
            status: "failed",
            componentKey: "settings",
            failureKind: "transient",
        });
        expect(importer).toHaveBeenCalledOnce();
    });

    it("失敗時点でstaleならstale failureとして返す", async () => {
        const importer = vi.fn().mockRejectedValue(new Error("missing chunk"));
        const loadComponent = createComponentLoader("composer-target", importer, {
            isStale: () => true,
        });

        await expect(loadComponent()).resolves.toMatchObject({
            status: "failed",
            componentKey: "composer-target",
            failureKind: "stale",
        });
    });

    it("defaultがundefinedならloaded結果を返さない", async () => {
        const importer = vi.fn(async () => ({ default: undefined }));
        const loadComponent = createComponentLoader("settings", importer);

        await expect(loadComponent()).resolves.toMatchObject({
            status: "failed",
            failureKind: "transient",
        });
    });

    it("eager import失敗は作成直後から処理され、次回に再試行できる", async () => {
        const importer = vi
            .fn()
            .mockRejectedValueOnce(new Error("eager failure"))
            .mockResolvedValueOnce({ default: { id: "post" } });
        const loadComponent = createComponentLoader("post", importer, {
            eager: true,
        });

        expect(importer).toHaveBeenCalledOnce();
        await expect(loadComponent()).resolves.toMatchObject({
            status: "failed",
            componentKey: "post",
        });
        await expect(loadComponent()).resolves.toEqual({
            status: "loaded",
            component: { id: "post" },
        });
        expect(importer).toHaveBeenCalledTimes(2);
    });
});
