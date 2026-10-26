import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/svelte";
import { readable } from "svelte/store";
import { tick } from "svelte";
import { createDeferred } from "../deferredTestUtils";
import { mediaDestination, mediaItem, mediaPage, mediaPubkey } from "../uploadMediaManagementTestUtils";
import { mockAuthStoreModule } from "../mocks/storeModules";
import type { UploadMediaManagementView } from "../../lib/upload/uploadMediaManagementController";
import { UploadMediaError } from "../../lib/upload/mediaManagementTypes";
const mocked = vi.hoisted(() => ({ view: null as unknown as UploadMediaManagementView,
    copy: vi.fn(async () => true),
    controller: { activate: vi.fn(), suspend: vi.fn(), busy: false, configure: vi.fn(), configureSaved: vi.fn(async () => undefined), invalidate: vi.fn(), select: vi.fn(), load: vi.fn(), delete: vi.fn(async () => true) },
    viewers: [] as Array<{ options: { index?: number; dataSource?: Array<{ id?: string; src?: string; type?: string }> }; closed: boolean }> }));
vi.mock("svelte-i18n", () => ({ _: readable((key: string) => key) }));
vi.mock("../../lib/hooks/useDialogHistory.svelte", () => ({ useDialogHistory: vi.fn() }));
vi.mock("../../lib/utils/clipboardUtils", () => ({ tryCopyToClipboard: mocked.copy }));
vi.mock("../../lib/hooks/useUploadMediaManagement.svelte", () => ({ useUploadMediaManagement: () => ({ get value() { return mocked.view; }, controller: mocked.controller }) }));
vi.mock("../../lib/uploadMediaImageCacheClient", () => ({ supportsUploadMediaImageCache: vi.fn(async () => false), evictUploadMediaImages: vi.fn(async () => true) }));
vi.mock("../../lib/hooks/inViewportAction.svelte", () => ({ inViewportAction: (_node: unknown, params: { onEnterView: () => void }) => { queueMicrotask(params.onEnterView); return {}; } }));
vi.mock("photoswipe", () => ({
    default: class MockPhotoSwipe {
        closed = false;
        currIndex: number;
        element: HTMLElement | null = null;
        constructor(public options: { index?: number; mainClass?: string; dataSource?: Array<{ id?: string; src?: string; type?: string }> }) {
            this.currIndex = options.index ?? 0;
            mocked.viewers.push(this);
        }
        on() {}
        init() {
            const root = document.createElement("div");
            root.className = `pswp ${this.options.mainClass ?? ""}`.trim();
            document.body.appendChild(root);
            this.element = root;
        }
        close() { this.closed = true; }
        destroy() { this.element?.remove(); }
        goTo(index: number) { this.currIndex = index; }
    },
}));
vi.mock("../../lib/utils/fullscreenViewerUtils", () => ({
    buildFullscreenViewerDataSource: vi.fn(async (items: unknown[]) => items),
    createFullscreenVideoSlideElement: vi.fn(() => document.createElement("div")),
    pauseFullscreenVideoContent: vi.fn(),
}));
import UploadedMediaTabContent from "../../components/UploadedMediaTabContent.svelte";
import { supportsUploadMediaImageCache } from "../../lib/uploadMediaImageCacheClient";

beforeEach(() => {
    vi.clearAllMocks();
    mocked.copy.mockResolvedValue(true);
    vi.mocked(supportsUploadMediaImageCache).mockResolvedValue(false);
    mocked.viewers.length = 0;
    mockAuthStoreModule.authState.value = { ...mockAuthStoreModule.authState.value, isAuthenticated: true, pubkey: mediaPubkey };
    const destination = mediaDestination();
    mocked.view = { destinations: [destination], selectedId: destination.id, current: { destination, ...mediaPage(destination, [mediaItem(), mediaItem(destination, "video", "c".repeat(64))]),
        loaded: true, loading: false, error: null, support: "supported", hasMore: true, needsRefresh: false, deletingId: null, notice: null } };
});
describe("uploaded-media content", () => {
    it.each(["https://nostr.build", "https://nostr.build/", "https://nostr.build/api/v2/nip96/upload", "https://nostr.build/api/v2/nip96/upload/"])("explains NIP-96 listing HTTP 405 for %s with actionable official links", async (serverUrl) => {
        const current = mocked.view.current!;
        current.destination = { ...mediaDestination("nip96"), serverUrl, name: "Renamed destination", presetId: "custom" };
        current.error = new UploadMediaError("unavailable", 405);
        current.loaded = false; current.items = [];
        render(UploadedMediaTabContent, { show: true });
        const help = await screen.findByRole("status");
        expect(help.textContent).toContain("uploadedMedia.nostrBuild.unavailable");
        expect(document.querySelector(".media-management")!.contains(help)).toBe(true);
        for (const [key, url] of [["account", "https://account.nostr.build/"], ["deleteFree", "https://nostr.build/delete/"]]) {
            const link = screen.getByRole("link", { name: `uploadedMedia.nostrBuild.${key}` });
            expect(link.getAttribute("href")).toBe(url);
            expect(link.getAttribute("target")).toBe("_blank");
            expect(link.getAttribute("rel")).toBe("noopener noreferrer");
        }
        expect(screen.queryByRole("alert")).toBeNull();
        await fireEvent.click(screen.getByRole("button", { name: "uploadedMedia.refresh" }));
        expect(mocked.controller.load).toHaveBeenCalledTimes(1);
    });
    it.each([
        ["https://nostr.build.example/api/v2/nip96/upload", "nip96", "unavailable", 405],
        ["https://other.example", "nip96", "unavailable", 405],
        ["https://nostr.build/other-api", "nip96", "unavailable", 405],
        ["http://nostr.build", "nip96", "unavailable", 405],
        ["https://nostr.build:8443", "nip96", "unavailable", 405],
        ["https://nostr.build", "blossom", "unavailable", 405],
        ["https://nostr.build", "nip96", "unavailable", 404],
        ["https://nostr.build", "nip96", "unavailable", undefined],
        ["https://nostr.build", "nip96", "authentication", 401],
        ["https://nostr.build", "nip96", "payment", 402],
        ["https://nostr.build", "nip96", "forbidden", 403],
        ["https://nostr.build", "nip96", "invalidResponse", 405],
        ["https://nostr.build", "nip96", "serverError", 503],
        ["https://nostr.build", "nip96", "network", undefined],
    ] as const)("retains generic errors for %s (%s, %s/%s)", async (serverUrl, protocol, code, status) => {
        mocked.view.current!.destination = { ...mediaDestination(protocol), serverUrl, name: "nostr.build", presetId: "nostr-build" };
        mocked.view.current!.error = new UploadMediaError(code, status);
        render(UploadedMediaTabContent, { show: true });
        expect((await screen.findByRole("alert")).textContent).toContain(`uploadedMedia.errors.${code}`);
        expect(screen.queryByRole("link", { name: "uploadedMedia.nostrBuild.account" })).toBeNull();
    });
    it.each(["image", "video"] as const)("copies the original %s URL without opening media", async (kind) => {
        if (kind === "image") vi.mocked(supportsUploadMediaImageCache).mockResolvedValue(true);
        render(UploadedMediaTabContent, { show: true });
        const item = mocked.view.current!.items.find((entry) => entry.kind === kind)!;
        if (kind === "image") await waitFor(() => {
            const src = document.querySelector("img")?.getAttribute("src");
            expect(src).toBeTruthy();
            expect(src).not.toBe(item.url);
        });
        await fireEvent.click(screen.getByRole("button", { name: `${kind}ContextMenu.copyUrl` }));
        expect(mocked.copy).toHaveBeenCalledWith(item.url, "URL", navigator, window);
        expect(await screen.findByText(`${kind}ContextMenu.copySuccess`)).toBeTruthy();
        expect(mocked.viewers).toHaveLength(0);
        expect(document.querySelector("video")).toBeNull();
        expect(mocked.controller.delete).not.toHaveBeenCalled();
    });
    it("disables URL copying when the media URL is missing", async () => {
        mocked.view.current!.items[0].url = null;
        render(UploadedMediaTabContent, { show: true });
        const button = screen.getByRole("button", { name: "imageContextMenu.copyUrl" }) as HTMLButtonElement;
        expect(button.disabled).toBe(true);
        await fireEvent.click(button);
        expect(mocked.copy).not.toHaveBeenCalled();
        expect(screen.queryByText("imageContextMenu.copySuccess")).toBeNull();
    });
    it("does not report success when copying fails", async () => {
        mocked.copy.mockResolvedValue(false);
        render(UploadedMediaTabContent, { show: true });
        await fireEvent.click(screen.getByRole("button", { name: "imageContextMenu.copyUrl" }));
        await tick();
        expect(mocked.copy).toHaveBeenCalledTimes(1);
        expect(screen.queryByText("imageContextMenu.copySuccess")).toBeNull();
    });
    it("keeps an active video open when its URL is copied", async () => {
        const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
        const load = vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => undefined);
        render(UploadedMediaTabContent, { show: true });
        await fireEvent.click(screen.getByRole("button", { name: "uploadedMedia.openVideo" }));
        const video = document.querySelector("video");
        await fireEvent.click(screen.getByRole("button", { name: "videoContextMenu.copyUrl" }));
        expect(await screen.findByText("videoContextMenu.copySuccess")).toBeTruthy();
        expect(document.querySelector("video")).toBe(video);
        expect(screen.getByRole("button", { name: "uploadedMedia.closeVideo" })).toBeTruthy();
        pause.mockRestore(); load.mockRestore();
    });
    it.each([ ["https://nostpic.com/api/v2/media", false, "unavailable"], ["https://nostpic.com", false, "unavailable"], ["https://nostpic.com/api/v2/media", true, "invalidResponse"], ["https://nostpic.com.example/api", false, "invalidResponse"], ["https://media.example", false, "invalidResponse"] ] as const)("shows listing error for %s (loaded: %s)", async (serverUrl, loaded, errorKey) => {
        mocked.view.current!.destination.serverUrl = serverUrl;
        mocked.view.current!.destination.presetId = undefined;
        mocked.view.current!.loaded = loaded;
        mocked.view.current!.error = new UploadMediaError("invalidResponse");
        render(UploadedMediaTabContent, { show: true });
        const message = await screen.findByRole("alert");
        expect(message.textContent).toContain(`uploadedMedia.errors.${errorKey}`);
        expect(message.classList.contains("floating-message")).toBe(true);
        expect(document.querySelector(".media-management [role=alert]")).toBeNull();
    });
    it("shows deletion feedback outside the list and does not replay it after reopening", async () => {
        mocked.view.current!.notice = "deleted";
        const { rerender } = render(UploadedMediaTabContent, { show: true });
        const message = await screen.findByRole("status");
        expect(message.textContent).toContain("uploadedMedia.deleted");
        expect(document.querySelector(".uploaded-media-content")!.contains(message)).toBe(false);
        await rerender({ show: false });
        await waitFor(() => expect(screen.queryByText("uploadedMedia.deleted")).toBeNull());
        await rerender({ show: true });
        expect(screen.queryByText("uploadedMedia.deleted")).toBeNull();
    });
    it("keeps cache-cleanup failure feedback in the same floating notification", async () => {
        mocked.view.current!.notice = "cacheCleanupFailed";
        render(UploadedMediaTabContent, { show: true });
        expect((await screen.findByRole("status")).textContent).toContain("uploadedMedia.cacheCleanupFailed");
        expect(document.querySelector(".media-management .floating-message")).toBeNull();
    });
    it.each([true, false])("floats reloading feedback only for an already loaded list (loaded: %s)", async (loaded) => {
        mocked.view.current!.loading = true;
        mocked.view.current!.loaded = loaded;
        render(UploadedMediaTabContent, { show: true });
        await tick();
        if (loaded) {
            const message = await screen.findByRole("status");
            expect(message.querySelector(".loader-container")).toBeTruthy();
            expect(document.querySelector(".media-management .loading-placeholder")).toBeNull();
        } else {
            expect(document.querySelector(".media-management .loading-placeholder")).toBeTruthy();
            expect(screen.queryByRole("status")).toBeNull();
        }
    });
    it("retains error details and retry time in the floating alert", async () => {
        const retryAt = Date.now() + 60_000;
        mocked.view.current!.error = new UploadMediaError("rateLimited", 429, "Safe diagnostic", retryAt);
        render(UploadedMediaTabContent, { show: true });
        const message = await screen.findByRole("alert");
        expect(message.textContent).toContain("uploadedMedia.errors.rateLimited");
        expect(message.textContent).toContain("uploadedMedia.retryAfter");
        expect(message.textContent).toContain("Safe diagnostic");
    });
    it("does not let a previous session's completed deletion close a new confirmation", async () => {
        const deferred = createDeferred<boolean>();
        mocked.controller.delete.mockImplementationOnce(() => deferred.promise);
        const { rerender } = render(UploadedMediaTabContent, { show: true });
        await fireEvent.click(screen.getAllByRole("button", { name: "uploadedMedia.delete" })[0]);
        await fireEvent.click(screen.getByRole("alertdialog").querySelector(".danger") as HTMLButtonElement);
        await rerender({ show: false });
        await rerender({ show: true });
        await fireEvent.click(screen.getAllByRole("button", { name: "uploadedMedia.delete" })[0]);
        deferred.resolve(true); await Promise.resolve(); await tick();
        expect(screen.getByRole("alertdialog")).toBeTruthy();
        expect(mocked.controller.delete).toHaveBeenCalledTimes(1);
    });
    it("confirms the discovered endpoint rather than assuming the configured server is the delete endpoint", async () => {
        mocked.view.current!.context!.endpoint = "https://api.example/nip96";
        render(UploadedMediaTabContent, { show: true });
        await fireEvent.click(screen.getAllByRole("button", { name: "uploadedMedia.delete" })[0]);
        expect(screen.getByRole("alertdialog").textContent).toContain("https://api.example/nip96");
        expect(screen.getByRole("alertdialog").textContent).toContain(mediaItem().deleteId!.sha256);
    });
    it("shows unknown values without metadata labels and falls back to direct images without a cache notice", async () => {
        render(UploadedMediaTabContent, { show: true });
        expect(screen.getAllByText(/uploadedMedia.unknown/).length).toBeGreaterThan(0);
        const article = document.querySelector("article")!;
        expect(article.textContent).not.toContain("uploadedMedia.date");
        expect(article.textContent).not.toContain("uploadedMedia.size");
        expect(article.textContent).not.toContain("media.example");
        expect(article.textContent).not.toContain("blossom");
        await waitFor(() => expect(document.querySelector("img")?.src).toBe(mediaItem().url));
        expect(screen.queryByText("uploadedMedia.cacheUnavailable")).toBeNull();
        expect(document.querySelector("img")?.hasAttribute("crossorigin")).toBe(false);
        expect(document.querySelector("video")).toBeNull();
    });
    it.each([[0, "0 B"], [111, "111 B"], [1536, "1.5 KB"], [1572864, "1.5 MB"], [1610612736, "1.5 GB"]])("displays the timestamp and a compact size for %s bytes", (bytes, expected) => {
        mocked.view.current!.items[0].uploadedAt = 1_700_000_000;
        mocked.view.current!.items[0].size = bytes as number;
        render(UploadedMediaTabContent, { show: true });
        const article = document.querySelector("article")!;
        expect(article.querySelector("time")?.textContent).toBe(new Date(1_700_000_000_000).toLocaleString(undefined,
            { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }));
        expect(article.querySelector("time")?.dateTime).toBe("2023-11-14T22:13:20.000Z");
        expect(article.textContent).toContain(expected);
        expect(article.textContent).not.toContain("uploadedMedia.date");
        expect(article.textContent).not.toContain("uploadedMedia.size");
    });
    it("creates just one video on user action and releases it on close", async () => {
        const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
        const load = vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => undefined);
        render(UploadedMediaTabContent, { show: true });
        await fireEvent.click(screen.getByRole("button", { name: "uploadedMedia.openVideo" }));
        const video = document.querySelector("video")!;
        expect(video.autoplay).toBe(false); expect(video.preload).toBe("metadata");
        expect(video.getAttribute("src")).toContain(".mp4");
        await fireEvent.click(screen.getByRole("button", { name: "uploadedMedia.closeVideo" }));
        expect(document.querySelector("video")).toBeNull(); expect(video.hasAttribute("src")).toBe(false);
        expect(pause).toHaveBeenCalled(); expect(load).toHaveBeenCalled();
        pause.mockRestore(); load.mockRestore();
    });
    it("cancels confirmation without deleting and confirms the actual server before deletion", async () => {
        render(UploadedMediaTabContent, { show: true });
        const buttons = screen.getAllByRole("button", { name: "uploadedMedia.delete" });
        await fireEvent.click(buttons[0]);
        const alert = screen.getByRole("alertdialog");
        expect(alert.textContent).toContain("https://media.example");
        await fireEvent.click(screen.getByText("common.cancel"));
        expect(mocked.controller.delete).not.toHaveBeenCalled();
        await fireEvent.click(buttons[0]);
        const confirm = screen.getByRole("alertdialog").querySelector(".danger") as HTMLButtonElement;
        await fireEvent.click(confirm);
        expect(mocked.controller.delete).toHaveBeenCalledWith(mediaItem().id);
    });
    it("opens loaded images in the fullscreen viewer at the selected image", async () => {
        const second = mediaItem(mediaDestination(), "image", "d".repeat(64));
        mocked.view.current!.items = [mediaItem(), second, mediaItem(mediaDestination(), "video", "c".repeat(64))];
        render(UploadedMediaTabContent, { show: true });
        const openButtons = await screen.findAllByRole("button", { name: "uploadedMedia.openImage" });
        expect(openButtons).toHaveLength(2);
        await fireEvent.click(openButtons[1]);
        await waitFor(() => expect(document.querySelector(".ehagaki-pswp")).toBeTruthy());
        expect(mocked.viewers[0]?.options.index).toBe(1);
        expect(mocked.viewers[0]?.options.dataSource).toEqual([
            expect.objectContaining({ id: mediaItem().id, src: mediaItem().url, type: "image" }),
            expect.objectContaining({ id: second.id, src: second.url, type: "image" }),
        ]);
        await fireEvent.click(screen.getByRole("button", { name: "uploadedMedia.refresh" }));
        await waitFor(() => expect(mocked.viewers[0]?.closed).toBe(true));
    });
    it("does not open fullscreen from video playback or deletion", async () => {
        const missing = { ...mediaItem(mediaDestination(), "image", "e".repeat(64)), url: null };
        mocked.view.current!.items = [mediaItem(), missing, mediaItem(mediaDestination(), "video", "c".repeat(64))];
        render(UploadedMediaTabContent, { show: true });
        expect(await screen.findAllByRole("button", { name: "uploadedMedia.openImage" })).toHaveLength(1);
        await fireEvent.click(screen.getByRole("button", { name: "uploadedMedia.openVideo" }));
        await fireEvent.click(screen.getAllByRole("button", { name: "uploadedMedia.delete" })[0]);
        expect(document.querySelector(".ehagaki-pswp")).toBeNull();
        expect(mocked.viewers).toHaveLength(0);
    });
});
