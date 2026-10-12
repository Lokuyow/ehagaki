import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/svelte";
import { readable } from "svelte/store";
import { tick } from "svelte";
import { createDeferred } from "../deferredTestUtils";
import { mediaDestination, mediaItem, mediaPage, mediaPubkey } from "../uploadMediaManagementTestUtils";
import { mockAuthStoreModule } from "../mocks/storeModules";
import type { UploadMediaManagementView } from "../../lib/upload/uploadMediaManagementController";
const mocked = vi.hoisted(() => ({ view: null as unknown as UploadMediaManagementView,
    controller: { configure: vi.fn(), invalidate: vi.fn(), select: vi.fn(), load: vi.fn(), delete: vi.fn(async () => true) } }));
vi.mock("svelte-i18n", () => ({ _: readable((key: string) => key) }));
vi.mock("../../lib/hooks/useDialogHistory.svelte", () => ({ useDialogHistory: vi.fn() }));
vi.mock("../../lib/hooks/useUploadMediaManagement.svelte", () => ({ useUploadMediaManagement: () => ({ get value() { return mocked.view; }, controller: mocked.controller }) }));
vi.mock("../../lib/uploadMediaImageCacheClient", () => ({ supportsUploadMediaImageCache: vi.fn(async () => false), evictUploadMediaImages: vi.fn(async () => true) }));
vi.mock("../../lib/hooks/inViewportAction.svelte", () => ({ inViewportAction: (_node: unknown, params: { onEnterView: () => void }) => { queueMicrotask(params.onEnterView); return {}; } }));
import UploadedMediaDialog from "../../components/UploadedMediaDialog.svelte";

beforeEach(() => {
    vi.clearAllMocks();
    mockAuthStoreModule.authState.value = { ...mockAuthStoreModule.authState.value, isAuthenticated: true, pubkey: mediaPubkey };
    const destination = mediaDestination();
    mocked.view = { destinations: [destination], selectedId: destination.id, current: { destination, ...mediaPage(destination, [mediaItem(), mediaItem(destination, "video", "c".repeat(64))]),
        loaded: true, loading: false, error: null, support: "supported", needsRefresh: false, deletingId: null, notice: null } };
});
describe("uploaded-media dialog", () => {
    it("does not let a previous session's completed deletion close a new confirmation", async () => {
        const deferred = createDeferred<boolean>();
        mocked.controller.delete.mockImplementationOnce(() => deferred.promise);
        const onClose = vi.fn(), { rerender } = render(UploadedMediaDialog, { show: true, onClose });
        await fireEvent.click(screen.getAllByRole("button", { name: "uploadedMedia.delete" })[0]);
        await fireEvent.click(screen.getByRole("alertdialog").querySelector(".danger") as HTMLButtonElement);
        await rerender({ show: false, onClose });
        await rerender({ show: true, onClose });
        await fireEvent.click(screen.getAllByRole("button", { name: "uploadedMedia.delete" })[0]);
        deferred.resolve(true); await Promise.resolve(); await tick();
        expect(screen.getByRole("alertdialog")).toBeTruthy();
        expect(mocked.controller.delete).toHaveBeenCalledTimes(1);
    });
    it("confirms the discovered endpoint rather than assuming the configured server is the delete endpoint", async () => {
        mocked.view.current!.context!.endpoint = "https://api.example/nip96";
        render(UploadedMediaDialog, { show: true, onClose: vi.fn() });
        await fireEvent.click(screen.getAllByRole("button", { name: "uploadedMedia.delete" })[0]);
        expect(screen.getByRole("alertdialog").textContent).toContain("https://api.example/nip96");
        expect(screen.getByRole("alertdialog").textContent).toContain(mediaItem().deleteId!.sha256);
    });
    it("shows media metadata as unknown and falls back to direct images with a cache notice", async () => {
        render(UploadedMediaDialog, { show: true, onClose: vi.fn() });
        expect(screen.getAllByText(/uploadedMedia.unknown/).length).toBeGreaterThan(0);
        await waitFor(() => expect(document.querySelector("img")?.src).toBe(mediaItem().url));
        expect(screen.getByText("uploadedMedia.cacheUnavailable")).toBeTruthy();
        expect(document.querySelector("img")?.hasAttribute("crossorigin")).toBe(false);
        expect(document.querySelector("video")).toBeNull();
    });
    it("creates just one video on user action and releases it on close", async () => {
        const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
        const load = vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => undefined);
        render(UploadedMediaDialog, { show: true, onClose: vi.fn() });
        await fireEvent.click(screen.getByText("uploadedMedia.openVideo"));
        const video = document.querySelector("video")!;
        expect(video.autoplay).toBe(false); expect(video.preload).toBe("metadata");
        expect(video.getAttribute("src")).toContain(".mp4");
        await fireEvent.click(screen.getByText("uploadedMedia.closeVideo"));
        expect(document.querySelector("video")).toBeNull(); expect(video.hasAttribute("src")).toBe(false);
        expect(pause).toHaveBeenCalled(); expect(load).toHaveBeenCalled();
        pause.mockRestore(); load.mockRestore();
    });
    it("cancels confirmation without deleting and confirms the actual server before deletion", async () => {
        render(UploadedMediaDialog, { show: true, onClose: vi.fn() });
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
});
