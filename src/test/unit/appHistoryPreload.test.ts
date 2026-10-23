import { beforeEach, describe, expect, it, vi } from "vitest";
import { createDeferred } from "../deferredTestUtils";
import { getAppStorage } from "../../lib/appStorage";
import { createAppComponentLoaders, type AppComponentLoaderTargets } from "../../lib/appComponentLoaders";

const imports = vi.hoisted(() => new Map<string, { preload: ReturnType<typeof vi.fn>; load: ReturnType<typeof vi.fn> }>());
vi.mock("../../lib/appComponentLoader", () => ({
    createComponentLoader: (key: string) => {
        const load = vi.fn(async () => ({ status: "loaded", component: key }));
        const preload = vi.fn(() => load());
        imports.set(key, { load, preload });
        return Object.assign(load, { preload });
    },
}));

beforeEach(() => { imports.clear(); getAppStorage().removeItem("historyActiveTab"); });
function setup() {
    const targets: AppComponentLoaderTargets = {
        isStaleAssetReloadRequired: vi.fn(() => false), onLoadFailure: vi.fn(),
        setPostComponent: vi.fn(), setLoginDialogComponent: vi.fn(), setProfileComponent: vi.fn(),
        setSettingsDialogComponent: vi.fn(), setWelcomeDialogComponent: vi.fn(), setDraftListDialogComponent: vi.fn(),
        setPostHistoryDialogComponent: vi.fn(), setComposerTargetDialogComponent: vi.fn(), setCustomEmojiPickerComponent: vi.fn(),
    };
    return { targets, loaders: createAppComponentLoaders(targets) };
}
describe("history intent preloading", () => {
    it.each(["posts", "media"])("starts the saved %s tab alongside the shell, without delaying shell publication", async (tab) => {
        getAppStorage().setItem("historyActiveTab", tab);
        const { targets, loaders } = setup();
        const pendingTab = createDeferred<{ status: string; component: string }>();
        imports.get(`post-history-${tab}`)!.load.mockReturnValue(pendingTab.promise);
        await loaders.preloadPostHistoryDialog();
        expect(imports.get(`post-history-${tab}`)!.preload).toHaveBeenCalledOnce();
        expect(imports.get(`post-history-${tab === "posts" ? "media" : "posts"}`)!.load).not.toHaveBeenCalled();
        expect(targets.setPostHistoryDialogComponent).toHaveBeenCalledWith("post-history");
        expect(targets.onLoadFailure).not.toHaveBeenCalled();
        pendingTab.resolve({ status: "loaded", component: tab });
    });
    it("starts the selected tab for a direct open without an earlier intent event", async () => {
        const { loaders } = setup();
        await loaders.loadPostHistoryDialog();
        expect(imports.get("post-history-posts")!.preload).toHaveBeenCalledOnce();
        expect(imports.get("post-history-media")!.load).not.toHaveBeenCalled();
    });
    it("does not preload tab code while a stale asset reload is required", async () => {
        const { targets, loaders } = setup();
        vi.mocked(targets.isStaleAssetReloadRequired).mockReturnValue(true);
        await loaders.preloadPostHistoryDialog();
        expect(imports.get("post-history-posts")!.load).not.toHaveBeenCalled();
        expect(imports.get("post-history-media")!.load).not.toHaveBeenCalled();
    });
});
