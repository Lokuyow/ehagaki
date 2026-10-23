import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/svelte";
import { tick } from "svelte";
import { createDeferred } from "../deferredTestUtils";
import { mediaDestination, mediaPage, mediaPubkey } from "../uploadMediaManagementTestUtils";
import { mockAuthStoreModule } from "../mocks/storeModules";
import { getAppStorage } from "../../lib/appStorage";
import { writePersistedPostHistoryViewState } from "../../lib/postHistoryDialogViewState";
import { postHistoryLocalRelayService } from "../../lib/postHistoryLocalRelayService";
import { settingsStore } from "../../stores/settingsStore.svelte";
import { resetPostHistoryDialogHarness, cleanupPostHistoryDialogHarness,
    repositoryMock, relayFetchServiceMock, profilesRepositoryMock, profileFetchDataMock,
    contextFetchServiceMock, replyFetchServiceMock, localSearchServiceMock, createRecord } from "./postHistoryDialogTestHarness";
import PostHistoryDialog from "../../components/PostHistoryDialog.svelte";
import UploadedMediaTabContentComponent from "../../components/UploadedMediaTabContent.svelte";
export const transformedMediaContent = UploadedMediaTabContentComponent;

const counters = vi.hoisted(() => ({ posts: 0, media: 0, live: 0, auth: 0,
    support: vi.fn(async () => false), list: vi.fn(), remove: vi.fn(),
    destinations: [] as unknown[], hold: null as Promise<void> | null }));
vi.mock("../../stores/uploadDestinationStore.svelte", () => ({ uploadDestinationStore: { get value() { return { destinations: counters.destinations }; } } }));
vi.mock("../../lib/upload/uploadAdapterRegistry", () => ({ getUploadAdapter: () => ({ listMediaPage: counters.list, deleteMedia: counters.remove }) }));
vi.mock("../../lib/nostrAuthService", () => ({ NostrAuthService: class { constructor() { counters.auth++; } } }));
vi.mock("../../lib/uploadMediaImageCacheClient", () => ({ supportsUploadMediaImageCache: counters.support, evictUploadMediaImages: vi.fn(async () => true) }));
vi.mock("dexie", async (importOriginal) => {
    const actual = await importOriginal<typeof import("dexie")>();
    return { ...actual, liveQuery: (...args: Parameters<typeof actual.liveQuery>) => { counters.live++; return actual.liveQuery(...args); } };
});
vi.mock("../../lib/appComponentLoader", async (importOriginal) => {
    const actual = await importOriginal<typeof import("../../lib/appComponentLoader")>();
    return { ...actual, createComponentLoader: (key: string, importer: () => Promise<{ default: any }>, options: any) => actual.createComponentLoader(key, async () => {
        const hold = counters.hold;
        const module = await importer();
        if (key === "post-history-posts" && hold) await hold;
        return { default: (...args: any[]) => {
            if (key === "post-history-posts") counters.posts++;
            if (key === "post-history-media") counters.media++;
            return module.default(...args);
        } };
    }, options) };
});

beforeEach(() => {
    resetPostHistoryDialogHarness();
    getAppStorage().removeItem("historyActiveTab");
    counters.posts = counters.media = counters.live = counters.auth = 0;
    counters.hold = null;
    counters.destinations = [mediaDestination()];
    counters.list.mockResolvedValue(mediaPage());
    counters.remove.mockResolvedValue(undefined);
    counters.support.mockResolvedValue(false);
    mockAuthStoreModule.authState.value = { ...mockAuthStoreModule.authState.value, isAuthenticated: true, pubkey: mediaPubkey };
});
afterEach(cleanupPostHistoryDialogHarness);
const open = () => render(PostHistoryDialog, { show: true, onClose: vi.fn(), pubkeyHex: mediaPubkey });
const tab = (name: "posts" | "media") => screen.getByRole("tab", { name: `postHistory.${name}Tab` });

describe("history tabs", () => {
    it("covers a pending tab import without the generic loading text and keeps close accessible", async () => {
        const gate = createDeferred<void>(); counters.hold = gate.promise;
        const view = open();
        await tick();
        expect(document.querySelector(".history-opening-placeholder")).toBeTruthy();
        expect(screen.queryByText("loadingPlaceholder.loading")).toBeNull();
        expect(document.querySelector(".history-tab-viewport")?.getAttribute("aria-busy")).toBe("true");
        await fireEvent.click(screen.getByRole("button", { name: "閉じる" }));
        gate.resolve(); await tick();
        expect(document.querySelector(".history-opening-placeholder")).toBeNull();
        expect(counters.posts).toBe(0);
        view.unmount();
    });
    it("replaces a failed import with retry and restarts the opening presentation", async () => {
        const gate = createDeferred<void>(); counters.hold = gate.promise;
        const onLoadFailure = vi.fn();
        const view = render(PostHistoryDialog, { show: true, onClose: vi.fn(), pubkeyHex: mediaPubkey, onLoadFailure });
        await tick();
        gate.reject(new Error("temporary import failure"));
        const retry = await screen.findByRole("button", { name: "uploadedMedia.refresh" });
        expect(document.querySelector(".history-opening-placeholder")).toBeNull();
        expect(onLoadFailure).toHaveBeenCalledOnce();
        counters.hold = null;
        await fireEvent.click(retry);
        await waitFor(() => expect(counters.posts).toBe(1));
        await waitFor(() => expect(document.querySelector(".history-tab-viewport")?.getAttribute("aria-busy")).toBe("false"));
        view.unmount();
    });
    it.each([50, 300])("reveals initial posts at %ims without waiting for counts or relay work", async (delay) => {
        vi.useFakeTimers();
        const gate = createDeferred<ReturnType<typeof createRecord>[]>();
        const count = createDeferred<number>();
        repositoryMock.getLatestVisibleChunk.mockReturnValueOnce(gate.promise);
        repositoryMock.countForPubkey.mockReturnValue(count.promise);
        const post = createRecord({ content: "opening ready post" });
        const view = open();
        try {
            await vi.advanceTimersByTimeAsync(0);
            expect(document.querySelector(".history-opening-placeholder")).toBeTruthy();
            await vi.advanceTimersByTimeAsync(delay);
            expect(document.querySelector(".post-history-list-loading")).toBeNull();
            gate.resolve([post]);
            await vi.advanceTimersByTimeAsync(0);
            expect(document.querySelector(".history-opening-placeholder")).toBeNull();
            expect(screen.getByText(post.content)).toBeTruthy();
            expect(document.querySelector(".history-tab-viewport")?.getAttribute("aria-busy")).toBe("false");
            expect(document.querySelector(".history-tab-panels")).toHaveProperty("inert", false);
        } finally {
            count.resolve(1); view.unmount(); vi.useRealTimers();
        }
    });
    it.each(["empty", "failed"])("finishes the opening presentation for %s local history", async (result) => {
        if (result === "failed") repositoryMock.getLatestVisibleChunk.mockRejectedValueOnce(new Error("read failed"));
        const view = open();
        await waitFor(() => expect(document.querySelector(".history-tab-viewport")?.getAttribute("aria-busy")).toBe("false"));
        expect(document.querySelector(".history-opening-placeholder")).toBeNull();
        if (result === "failed") expect(screen.queryByText("投稿履歴はありません")).toBeNull();
        else expect(screen.getByText("投稿履歴はありません")).toBeTruthy();
        view.unmount();
    });
    it.each(["empty", "failed"])("reveals a restored search after its %s result and permits clearing it", async (result) => {
        writePersistedPostHistoryViewState(mediaPubkey, { searchInput: "missing", searchQuery: "missing" });
        const gate = createDeferred<{ items: ReturnType<typeof createRecord>[]; total: number; hasNext: boolean }>();
        localSearchServiceMock.searchLocalPosts.mockReturnValueOnce(gate.promise);
        const view = open();
        await waitFor(() => expect(localSearchServiceMock.searchLocalPosts).toHaveBeenCalledOnce());
        expect(repositoryMock.getLatestVisibleChunk).not.toHaveBeenCalled();
        expect(document.querySelector(".history-opening-placeholder")).toBeTruthy();
        expect(document.querySelector(".history-tab-panels")).toHaveProperty("inert", true);
        if (result === "failed") gate.reject(new Error("search failed"));
        else gate.resolve({ items: [], total: 0, hasNext: false });
        await waitFor(() => expect(document.querySelector(".history-tab-viewport")?.getAttribute("aria-busy")).toBe("false"));
        expect(document.querySelector(".history-opening-placeholder")).toBeNull();
        expect(document.querySelector(".history-tab-panels")).toHaveProperty("inert", false);
        expect(repositoryMock.getLatestVisibleChunk).not.toHaveBeenCalled();
        if (result === "empty") expect(screen.getByText("一致する投稿はありません")).toBeTruthy();
        else expect(screen.queryByText("一致する投稿はありません")).toBeNull();
        await fireEvent.click(screen.getByRole("button", { name: "検索" }));
        expect(screen.getByRole("searchbox", { name: "検索" })).toHaveProperty("value", "missing");
        await fireEvent.click(document.querySelector(".post-history-search-close")!);
        await waitFor(() => expect(repositoryMock.getLatestVisibleChunk).toHaveBeenCalledOnce());
        expect(await screen.findByText("投稿履歴はありません")).toBeTruthy();
        view.unmount();
    });
    it.each(["empty", "failed"])("covers the first media request and reveals its %s result", async (result) => {
        getAppStorage().setItem("historyActiveTab", "media");
        const gate = createDeferred<ReturnType<typeof mediaPage>>();
        counters.list.mockReturnValueOnce(gate.promise);
        const view = open();
        await waitFor(() => expect(counters.list).toHaveBeenCalledOnce());
        expect(document.querySelector(".history-opening-placeholder")).toBeTruthy();
        expect(document.querySelector(".media-management .loading-placeholder")).toBeNull();
        if (result === "failed") gate.reject(new Error("media failed"));
        else gate.resolve(mediaPage(undefined, []));
        await waitFor(() => expect(document.querySelector(".history-opening-placeholder")).toBeNull());
        if (result === "failed") expect(screen.getByRole("alert")).toBeTruthy();
        else expect(screen.getByText("uploadedMedia.empty")).toBeTruthy();
        expect(counters.posts).toBe(0);
        view.unmount();
    });
    it.each([null, "invalid"])("defaults to posts for %s and does no media work", async (stored) => {
        if (stored) getAppStorage().setItem("historyActiveTab", stored);
        open();
        await waitFor(() => expect(counters.posts).toBe(1));
        expect(tab("posts").getAttribute("aria-selected")).toBe("true");
        expect(counters.media).toBe(0);
        expect(counters.list).not.toHaveBeenCalled();
        expect(counters.auth).toBe(0);
        expect(counters.support).not.toHaveBeenCalled();
    });
    it("opens saved media without constructing or running any post consumer", async () => {
        getAppStorage().setItem("historyActiveTab", "media");
        settingsStore.setLocalRelayUrl("ws://127.0.0.1:4869/");
        postHistoryLocalRelayService.configureSession({ ownerPubkeyHex: mediaPubkey, url: settingsStore.localRelayUrl, isActive: () => true });
        const localRead = vi.spyOn(postHistoryLocalRelayService, "read").mockReturnValue({ cancel: vi.fn(), promise: Promise.resolve(null) });
        const view = render(PostHistoryDialog, { show: true, onClose: vi.fn(), pubkeyHex: mediaPubkey, rxNostr: {} as import("rx-nostr").RxNostr });
        try {
            await waitFor(() => expect(counters.list).toHaveBeenCalledTimes(1));
            expect(counters.posts).toBe(0);
            expect(counters.live).toBe(0);
            for (const fn of [repositoryMock.getPage, repositoryMock.getLatestVisibleChunk, repositoryMock.countForPubkey,
                relayFetchServiceMock.fetchLatest, profilesRepositoryMock.get, profileFetchDataMock,
                contextFetchServiceMock.fetchEventById, replyFetchServiceMock.fetchDirectReplies]) expect(fn).not.toHaveBeenCalled();
            expect(localRead).not.toHaveBeenCalled();
            await fireEvent.click(tab("posts"));
            await waitFor(() => expect(counters.posts).toBe(1));
            await waitFor(() => expect(repositoryMock.getLatestVisibleChunk).toHaveBeenCalled());
            expect(counters.live).toBeGreaterThan(0);
            await waitFor(() => expect(localRead).toHaveBeenCalled());
            expect(document.querySelector(".media-management")).toBeNull();
        } finally {
            view.unmount(); localRead.mockRestore();
            postHistoryLocalRelayService.cancelSession(); settingsStore.setLocalRelayUrl("");
        }
    });
    it("persists media selection and retains visited owners without inactive DOM or repeated list/support requests", async () => {
        const { unmount } = open();
        await waitFor(() => expect(counters.posts).toBe(1));
        await fireEvent.click(tab("media"));
        await waitFor(() => expect(counters.list).toHaveBeenCalledTimes(1));
        expect(getAppStorage().getItem("historyActiveTab")).toBe("media");
        expect(document.querySelector(".post-history-heading")).toBeNull();
        await fireEvent.click(tab("posts"));
        await fireEvent.click(tab("media"));
        await tick();
        expect(counters.posts).toBe(1); expect(counters.media).toBe(1);
        expect(counters.list).toHaveBeenCalledTimes(1); expect(counters.support).toHaveBeenCalledTimes(1);
        unmount();
        open();
        await waitFor(() => expect(counters.media).toBe(2));
        expect(tab("media").getAttribute("aria-selected")).toBe("true");
        expect(counters.posts).toBe(1);
    });
    it("does not instantiate an inactive tab when its delayed import finishes", async () => {
        const gate = createDeferred<void>(); counters.hold = gate.promise;
        open();
        await fireEvent.click(tab("media"));
        await waitFor(() => expect(counters.media).toBe(1));
        gate.resolve(); await tick();
        expect(counters.posts).toBe(0);
        await fireEvent.click(tab("posts"));
        await waitFor(() => expect(counters.posts).toBe(1));
    });
    it("discards a suspended local read without starting counts or related requests, then resumes with a fresh read", async () => {
        const oldRead = createDeferred<ReturnType<typeof createRecord>[]>();
        const stale = createRecord({ content: "discarded suspended local read" });
        const fresh = createRecord({ eventId: "b".repeat(64), content: "fresh activated local read" });
        repositoryMock.getLatestVisibleChunk.mockReturnValueOnce(oldRead.promise).mockResolvedValue([fresh]);
        open();
        await waitFor(() => expect(repositoryMock.getLatestVisibleChunk).toHaveBeenCalledTimes(1));
        await fireEvent.click(tab("media"));
        oldRead.resolve([stale]); await tick();
        expect(repositoryMock.countForPubkey).not.toHaveBeenCalled();
        expect(relayFetchServiceMock.fetchLatest).not.toHaveBeenCalled();
        expect(contextFetchServiceMock.fetchEventById).not.toHaveBeenCalled();
        expect(replyFetchServiceMock.fetchDirectReplies).not.toHaveBeenCalled();
        await fireEvent.click(tab("posts"));
        await screen.findByText(fresh.content);
        expect(screen.queryByText(stale.content)).toBeNull();
        expect(repositoryMock.getLatestVisibleChunk).toHaveBeenCalledTimes(2);
    });
    it("drops delayed imports across close and account A-B-A", async () => {
        const gate = createDeferred<void>(); counters.hold = gate.promise;
        const view = open();
        await view.rerender({ show: true, onClose: vi.fn(), pubkeyHex: "c".repeat(64) });
        await view.rerender({ show: true, onClose: vi.fn(), pubkeyHex: mediaPubkey });
        gate.resolve();
        await waitFor(() => expect(counters.posts).toBe(1));
        await waitFor(() => expect(repositoryMock.getLatestVisibleChunk).toHaveBeenCalledTimes(1));
        expect(repositoryMock.getLatestVisibleChunk).toHaveBeenCalledWith(expect.objectContaining({ pubkeyHex: mediaPubkey }));
        view.unmount();
        const closedGate = createDeferred<void>(); counters.hold = closedGate.promise;
        const closed = open();
        await fireEvent.click(screen.getByRole("button", { name: "閉じる" }));
        closedGate.resolve(); await tick();
        expect(counters.posts).toBe(1);
        closed.unmount();
    });
    it("keeps the session tab choice when Storage fails", async () => {
        const write = vi.spyOn(getAppStorage(), "setItem").mockImplementation(() => { throw new Error("Storage unavailable"); });
        try {
            open(); await waitFor(() => expect(counters.posts).toBe(1));
            await fireEvent.click(tab("media"));
            await waitFor(() => expect(counters.media).toBe(1));
            expect(tab("media").getAttribute("aria-selected")).toBe("true");
        } finally { write.mockRestore(); }
    });
    it("forced account invalidation overrides an in-flight delete without leaking its result", async () => {
        getAppStorage().setItem("historyActiveTab", "media");
        const gate = createDeferred<void>();
        counters.remove.mockImplementation(async (params) => { params.onDeleteDispatched?.(); await gate.promise; });
        const view = open();
        await fireEvent.click(await screen.findByRole("button", { name: "uploadedMedia.delete" }));
        await fireEvent.click(screen.getByRole("alertdialog").querySelector(".danger")!);
        const oldSignal = counters.remove.mock.calls[0][0].signal as AbortSignal;
        mockAuthStoreModule.authState.value.pubkey = "c".repeat(64);
        await view.rerender({ show: true, onClose: vi.fn(), pubkeyHex: "c".repeat(64) });
        expect(oldSignal.aborted).toBe(true);
        await waitFor(() => expect(counters.list).toHaveBeenCalledTimes(2));
        gate.resolve(); await tick();
        expect(document.querySelectorAll("article")).toHaveLength(1);
        expect(screen.queryByText("uploadedMedia.deleted")).toBeNull();
        expect(counters.remove).toHaveBeenCalledTimes(1);
        expect(getAppStorage().getItem("historyActiveTab")).toBe("media");
    });
    it("blocks switching and dismissal during delete, then releases the guard", async () => {
        getAppStorage().setItem("historyActiveTab", "media");
        const gate = createDeferred<void>(); counters.remove.mockReturnValue(gate.promise);
        const onClose = vi.fn();
        const view = render(PostHistoryDialog, { show: true, onClose, pubkeyHex: mediaPubkey });
        await fireEvent.click(await screen.findByRole("button", { name: "uploadedMedia.delete" }));
        await fireEvent.click(screen.getByRole("alertdialog").querySelector(".danger")!);
        expect(tab("posts").hasAttribute("disabled")).toBe(true);
        const close = screen.getByRole("button", { name: "閉じる" });
        expect(close.hasAttribute("disabled")).toBe(true);
        await view.rerender({ show: true, onClose, pubkeyHex: mediaPubkey, rxNostr: {} as any });
        expect(counters.remove.mock.calls[0][0].signal.aborted).toBe(false);
        expect(close.hasAttribute("disabled")).toBe(true);
        await fireEvent.click(tab("posts")); await fireEvent.click(close);
        expect(onClose).not.toHaveBeenCalled();
        gate.resolve();
        await waitFor(() => expect(close.hasAttribute("disabled")).toBe(false));
        expect(counters.remove).toHaveBeenCalledTimes(1);
    });
    it("keeps the history dialog open when Escape is pressed during media fullscreen", async () => {
        class ImmediateIntersectionObserver {
            readonly root = null;
            readonly rootMargin = "";
            readonly thresholds = [0];
            constructor(private callback: IntersectionObserverCallback) {}
            observe() {
                this.callback([{ isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
            }
            unobserve() {}
            disconnect() {}
            takeRecords() { return []; }
        }
        const original = globalThis.IntersectionObserver;
        vi.stubGlobal("IntersectionObserver", ImmediateIntersectionObserver);
        getAppStorage().setItem("historyActiveTab", "media");
        const onClose = vi.fn();
        try {
            render(PostHistoryDialog, { show: true, onClose, pubkeyHex: mediaPubkey });
            await fireEvent.click(await screen.findByRole("button", { name: "uploadedMedia.openImage" }));
            await waitFor(() => expect(document.querySelector(".ehagaki-pswp")).toBeTruthy());
            await fireEvent.keyDown(document, { key: "Escape" });
            expect(onClose).not.toHaveBeenCalled();
            expect(screen.getByRole("dialog", { name: "投稿履歴" })).toBeTruthy();
        } finally {
            vi.stubGlobal("IntersectionObserver", original);
        }
    });
});
