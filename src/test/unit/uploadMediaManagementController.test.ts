import { describe, expect, it, vi } from "vitest";
import { UploadMediaManagementController, emptyUploadMediaManagementView } from "../../lib/upload/uploadMediaManagementController";
import { UploadMediaError, type UploadMediaPage, type UploadMediaListParams, type UploadMediaDeleteParams } from "../../lib/upload/mediaManagementTypes";
import type { UploadProtocolAdapter } from "../../lib/types/upload";
import { mediaAuth, mediaDestination, mediaHash, mediaItem, mediaPage, mediaPubkey } from "../uploadMediaManagementTestUtils";
import { createDeferred } from "../deferredTestUtils";

function setup() {
    let view = emptyUploadMediaManagementView();
    const auth = { value: { isAuthenticated: true, pubkey: mediaPubkey } };
    const list = vi.fn(async (_params: UploadMediaListParams) => mediaPage());
    const remove = vi.fn(async (_params: UploadMediaDeleteParams): Promise<void> => undefined);
    const evict = vi.fn(async () => true);
    const adapter = { listMediaPage: list, deleteMedia: remove } as unknown as UploadProtocolAdapter;
    const controller = new UploadMediaManagementController({ auth, getAdapter: () => adapter, createAuth: () => mediaAuth(),
        evictImages: evict, onChange: (next) => { view = next; } });
    return { controller, auth, list, remove, evict, get view() { return view; } };
}
async function loaded(s: ReturnType<typeof setup>) {
    s.controller.configure(mediaPubkey, [mediaDestination()]);
    await vi.waitFor(() => expect(s.view.current?.loaded).toBe(true));
}
describe("uploaded-media operation ownership", () => {
    it("retains confirmed remote success when selection changes during local cleanup", async () => {
        const s = setup(), cleanup = createDeferred<boolean>(), a = mediaDestination(), b = mediaDestination("blossom", "other");
        b.isDefault = false;
        s.list.mockImplementation(async (params) => mediaPage(params.destination));
        s.controller.configure(mediaPubkey, [a, b]);
        await vi.waitFor(() => expect(s.view.current?.loaded).toBe(true));
        s.remove.mockImplementation(async (params) => { params.onDeleteDispatched?.(); });
        s.evict.mockImplementation(() => cleanup.promise);
        const pending = s.controller.delete(s.view.current!.items[0].id);
        await vi.waitFor(() => expect(s.evict).toHaveBeenCalledOnce());
        s.controller.select(b.id); s.controller.select(a.id);
        expect(s.view.current).toMatchObject({ items: [], error: null, notice: "deleted", needsRefresh: true });
        cleanup.resolve(true); await pending;
    });
    it.each([true, false])("preserves deletion uncertainty across server selection only after HTTP dispatch (%s)", async (dispatched) => {
        const s = setup(), deferred = createDeferred<void>(), a = mediaDestination(), b = mediaDestination("blossom", "other");
        b.isDefault = false;
        s.list.mockImplementation(async (params) => mediaPage(params.destination));
        s.controller.configure(mediaPubkey, [a, b]);
        await vi.waitFor(() => expect(s.view.current?.loaded).toBe(true));
        s.remove.mockImplementation((params) => { if (dispatched) params.onDeleteDispatched?.(); return deferred.promise; });
        const pending = s.controller.delete(s.view.current!.items[0].id);
        s.controller.select(b.id); s.controller.select(a.id);
        expect(s.view.current?.items).toHaveLength(1);
        expect(s.view.current?.error?.code ?? null).toBe(dispatched ? "unknownDelete" : null);
        expect(s.view.current?.needsRefresh).toBe(dispatched);
        deferred.resolve(); await pending;
        expect(s.remove).toHaveBeenCalledTimes(1);
    });
    it("stops further pagination after an invalid refreshed response while preserving visible items", async () => {
        const s = setup(); await loaded(s);
        s.list.mockRejectedValue(new UploadMediaError("invalidResponse"));
        await s.controller.load();
        expect(s.view.current).toMatchObject({ items: [expect.any(Object)], nextPage: null, needsRefresh: true, error: { code: "invalidResponse" } });
    });
    it("includes disabled destinations, excludes Custom HTTP and preserves in-memory pages across selection", async () => {
        const s = setup(), one = mediaDestination(), two = mediaDestination("nip96", "two");
        two.isDefault = false;
        s.list.mockImplementation(async () => mediaPage(s.list.mock.calls.length === 1 ? one : two));
        s.controller.configure(mediaPubkey, [mediaDestination("custom-http"), one, two]);
        await vi.waitFor(() => expect(s.view.current?.loaded).toBe(true));
        expect(s.view.destinations.map((d) => d.id)).toEqual([one.id, two.id]);
        s.controller.select(two.id);
        await vi.waitFor(() => expect(s.view.current?.loaded).toBe(true));
        s.controller.select(one.id);
        expect(s.view.current?.items).toHaveLength(1);
        expect(s.list).toHaveBeenCalledTimes(2);
    });
    it.each(["account", "logout", "close", "destination"])("rejects old results after %s invalidation, including A→B→A", async (reason) => {
        const s = setup(), deferred = createDeferred<UploadMediaPage>();
        s.list.mockImplementationOnce(() => deferred.promise);
        s.controller.configure(mediaPubkey, [mediaDestination()]);
        if (reason === "account") {
            s.auth.value.pubkey = "c".repeat(64);
            s.controller.configure(s.auth.value.pubkey, [mediaDestination()]);
            s.auth.value.pubkey = mediaPubkey;
            s.controller.configure(mediaPubkey, [mediaDestination()]);
        } else if (reason === "logout") {
            s.auth.value.isAuthenticated = false;
            s.controller.configure(null, []);
        } else if (reason === "destination") s.controller.configure(mediaPubkey, []);
        else s.controller.invalidate();
        deferred.resolve(mediaPage(mediaDestination(), [mediaItem(mediaDestination(), "video")]));
        await Promise.resolve(); await Promise.resolve();
        expect(s.view.current?.items.some((item) => item.kind === "video") ?? false).toBe(false);
    });
    it("separates successful DELETE from bounded local cleanup retry without persisting or replaying DELETE", async () => {
        const s = setup();
        s.evict.mockResolvedValue(false);
        const beforeStorage = localStorage.length;
        await loaded(s);
        expect(await s.controller.delete(s.view.current!.items[0].id)).toBe(true);
        expect(s.remove).toHaveBeenCalledTimes(1);
        expect(s.evict).toHaveBeenCalledTimes(2);
        expect(s.view.current).toMatchObject({ items: [], nextPage: null, needsRefresh: true, notice: "cacheCleanupFailed" });
        expect(localStorage.length).toBe(beforeStorage);
        await s.controller.load(true);
        expect(s.list.mock.calls.at(-1)?.[0]).toMatchObject({ page: null, context: null });
    });
    it("cleans all displayed image URLs with the same hash after confirmed remote success even after close", async () => {
        const s = setup(), done = createDeferred<void>();
        s.list.mockResolvedValue(mediaPage(mediaDestination(), [mediaItem(), { ...mediaItem(), id: "alias", url: "https://media.example/alias.png" }]));
        await loaded(s);
        s.remove.mockImplementation(() => done.promise);
        const operation = s.controller.delete(s.view.current!.items[0].id);
        s.controller.invalidate();
        done.resolve();
        expect(await operation).toBe(true);
        expect(s.evict).toHaveBeenCalledExactlyOnceWith([mediaItem().url, "https://media.example/alias.png"]);
        expect(s.view.current).toBeNull();
    });
    it.each(["forbidden", "unknownDelete"] as const)("keeps an item on %s and never automatically retries", async (code) => {
        const s = setup(); await loaded(s);
        s.remove.mockRejectedValue(new UploadMediaError(code));
        expect(await s.controller.delete(s.view.current!.items[0].id)).toBe(false);
        expect(s.view.current?.items).toHaveLength(1);
        expect(s.view.current?.error?.code).toBe(code);
        if (code === "unknownDelete") expect(s.view.current).toMatchObject({ needsRefresh: true, nextPage: null });
        expect(s.evict).not.toHaveBeenCalled();
        expect(s.remove).toHaveBeenCalledTimes(1);
    });
    it("does not clean image caches for video deletion or allow concurrent paging/delete", async () => {
        const s = setup(), done = createDeferred<void>();
        s.list.mockResolvedValue(mediaPage(mediaDestination(), [mediaItem(mediaDestination(), "video")]));
        await loaded(s); s.remove.mockImplementation(() => done.promise);
        const id = s.view.current!.items[0].id;
        const operation = s.controller.delete(id);
        await s.controller.load(true);
        expect(await s.controller.delete(id)).toBe(false);
        done.resolve(); await operation;
        expect(s.list).toHaveBeenCalledTimes(1);
        expect(s.remove).toHaveBeenCalledTimes(1);
        expect(s.evict).not.toHaveBeenCalled();
    });
    it("rejects a repeated cursor across pages and retains previous items for refresh", async () => {
        const s = setup(); await loaded(s);
        await s.controller.load(true);
        expect(s.view.current).toMatchObject({ items: [expect.any(Object)], nextPage: null, needsRefresh: true, error: { code: "invalidResponse" } });
    });
    it("resolves blossom.band from the captured account pubkey", async () => {
        const s = setup(), d = mediaDestination(); d.serverUrl = "https://blossom.band"; d.presetId = "blossom-band";
        s.controller.configure(mediaPubkey, [d]);
        expect(s.view.destinations[0].serverUrl).toMatch(/^https:\/\/npub1[a-z0-9]+\.blossom\.band/);
        expect(s.list.mock.calls[0]?.[0]).toMatchObject({ expectedPubkey: mediaPubkey, destination: { serverUrl: s.view.destinations[0].serverUrl } });
    });
});
