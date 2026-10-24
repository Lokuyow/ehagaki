import { describe, expect, it, vi } from "vitest";
import { UploadMediaManagementController, emptyUploadMediaManagementView } from "../../lib/upload/uploadMediaManagementController";
import { UploadMediaError, type UploadMediaPage, type UploadMediaListParams, type UploadMediaDeleteParams } from "../../lib/upload/mediaManagementTypes";
import type { UploadProtocolAdapter } from "../../lib/types/upload";
import { mediaAuth, mediaDestination, mediaHash, mediaItem, mediaPage, mediaPubkey } from "../uploadMediaManagementTestUtils";
import { createDeferred } from "../deferredTestUtils";

function setup(loadDestinations?: (pubkey: string) => Promise<ReturnType<typeof mediaDestination>[]>) {
    let view = emptyUploadMediaManagementView();
    const auth = { value: { isAuthenticated: true, pubkey: mediaPubkey } };
    const list = vi.fn(async (_params: UploadMediaListParams) => mediaPage());
    const remove = vi.fn(async (_params: UploadMediaDeleteParams): Promise<void> => undefined);
    const evict = vi.fn(async () => true);
    const adapter = { listMediaPage: list, deleteMedia: remove } as unknown as UploadProtocolAdapter;
    const createAuth = vi.fn(() => mediaAuth());
    const controller = new UploadMediaManagementController({ loadDestinations, auth, getAdapter: () => adapter, createAuth,
        evictImages: evict, onChange: (next) => { view = next; } });
    return { controller, auth, list, remove, evict, createAuth, get view() { return view; } };
}
async function loaded(s: ReturnType<typeof setup>) {
    s.controller.configure(mediaPubkey, [mediaDestination()]);
    await vi.waitFor(() => expect(s.view.current?.loaded).toBe(true));
}
describe("uploaded-media operation ownership", () => {
    it("loads saved destinations only on activation and rejects an old local configuration read", async () => {
        const gate = createDeferred<ReturnType<typeof mediaDestination>[]>();
        const read = vi.fn().mockReturnValueOnce(gate.promise).mockResolvedValue([mediaDestination()]);
        const s = setup(read);
        s.controller.suspend(); await s.controller.configureSaved(mediaPubkey);
        expect(read).not.toHaveBeenCalled();
        s.controller.activate(); const old = s.controller.configureSaved(mediaPubkey);
        expect(s.view.configuring).toBe(true);
        s.controller.suspend(); s.controller.activate();
        await s.controller.configureSaved(mediaPubkey);
        await vi.waitFor(() => expect(s.view.current?.loaded).toBe(true));
        gate.resolve([mediaDestination("nip96", "old")]); await old;
        expect(s.view.selectedId).toBe("blossom");
        s.controller.suspend(); s.controller.activate(); await s.controller.configureSaved(mediaPubkey);
        expect(read).toHaveBeenCalledTimes(2);
        expect(s.list).toHaveBeenCalledTimes(1);
    });
    it("does no inactive work and drops an old page after a tab roundtrip", async () => {
        const s = setup(), gate = createDeferred<UploadMediaPage>();
        s.controller.suspend();
        s.controller.configure(mediaPubkey, [mediaDestination()]);
        await s.controller.load();
        expect(s.list).not.toHaveBeenCalled();
        s.controller.activate();
        s.list.mockReturnValueOnce(gate.promise);
        const first = s.controller.load();
        const signal = s.list.mock.calls[0][0].signal!;
        s.controller.suspend();
        expect(signal.aborted).toBe(true);
        expect(s.view.current?.loading).toBe(false);
        s.controller.activate();
        await s.controller.load();
        gate.resolve(mediaPage(mediaDestination(), [mediaItem(mediaDestination(), "video")]));
        await first;
        expect(s.view.current?.items[0].kind).toBe("image");
        expect(s.list).toHaveBeenCalledTimes(2);
    });
    it("retains loaded items and pagination during suspension without fetching again", async () => {
        const s = setup(); await loaded(s);
        const page = s.view.current?.nextPage;
        s.controller.suspend(); s.controller.configure(mediaPubkey, [mediaDestination()]);
        s.controller.activate(); s.controller.configure(mediaPubkey, [mediaDestination()]);
        expect(s.view.current?.items).toHaveLength(1);
        expect(s.view.current?.nextPage).toEqual(page);
        expect(s.list).toHaveBeenCalledTimes(1);
    });

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
    it.each([true, false])("preserves deletion uncertainty after forced suspension only after HTTP dispatch (%s)", async (dispatched) => {
        const s = setup(), deferred = createDeferred<void>(), a = mediaDestination(), b = mediaDestination("blossom", "other");
        b.isDefault = false;
        s.list.mockImplementation(async (params) => mediaPage(params.destination));
        s.controller.configure(mediaPubkey, [a, b]);
        await vi.waitFor(() => expect(s.view.current?.loaded).toBe(true));
        s.remove.mockImplementation((params) => { if (dispatched) params.onDeleteDispatched?.(); return deferred.promise; });
        const pending = s.controller.delete(s.view.current!.items[0].id);
        s.controller.select(b.id);
        expect(s.view.selectedId).toBe(a.id);
        s.controller.suspend();
        s.controller.activate();
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

function snapshot(count = 231, destination = mediaDestination()): UploadMediaPage {
    return { ...mediaPage(destination, Array.from({ length: count }, (_, i) =>
        mediaItem(destination, "image", i.toString(16).padStart(64, "0")))), nextPage: null, localSnapshot: true,
        excludedCount: 3, invalidCount: 2 };
}

describe("controller-local Blossom snapshots", () => {
    it("reveals 231 unique items in 24-item steps without further I/O/auth, and stays exhausted", async () => {
        const s = setup(), page = snapshot();
        page.items.push(page.items[0]);
        s.list.mockResolvedValue(page);
        await loaded(s);
        expect(s.view.current).toMatchObject({ nextPage: null, hasMore: true, excludedCount: 3, invalidCount: 2 });
        expect(s.view.current?.items).toHaveLength(24);
        for (const count of [48, 72, 96, 120, 144, 168, 192, 216, 231]) {
            await s.controller.load(true);
            expect(s.view.current?.items).toHaveLength(count);
        }
        await Promise.all([s.controller.load(true), s.controller.load(true)]);
        expect(s.view.current).toMatchObject({ hasMore: false, excludedCount: 3, invalidCount: 2 });
        expect(s.view.current?.items).toHaveLength(231);
        expect(new Set(s.view.current?.items.map((item) => item.id)).size).toBe(231);
        expect(s.list).toHaveBeenCalledOnce();
        expect(s.createAuth).toHaveBeenCalledOnce();
    });
    it("switches from remote paging to a snapshot and filters already displayed items", async () => {
        const s = setup(), page = snapshot(60);
        s.list.mockResolvedValueOnce({ ...mediaPage(), items: page.items.slice(0, 24) }).mockResolvedValue(page);
        await loaded(s);
        await s.controller.load(true);
        expect(s.view.current?.items).toEqual(page.items.slice(0, 48));
        await s.controller.load(true);
        expect(s.view.current?.items).toEqual(page.items);
        expect(s.view.current?.hasMore).toBe(false);
        expect(s.list).toHaveBeenCalledTimes(2);
    });
    it("consumes a remainder once even when more is invoked concurrently", async () => {
        const s = setup(); s.list.mockResolvedValue(snapshot(60)); await loaded(s);
        await Promise.all([s.controller.load(true), s.controller.load(true), s.controller.load(true)]);
        expect(s.view.current?.items).toHaveLength(60);
        expect(new Set(s.view.current?.items.map((item) => item.id)).size).toBe(60);
        expect(s.view.current?.hasMore).toBe(false);
        expect(s.list).toHaveBeenCalledOnce();
    });
    it("rejects a delayed oversized page after a server A→B→A selection roundtrip", async () => {
        const s = setup(), gate = createDeferred<UploadMediaPage>(), a = mediaDestination(), b = mediaDestination("blossom", "other");
        s.list.mockImplementation(async (params) => mediaPage(params.destination));
        s.controller.configure(mediaPubkey, [a, b]);
        await vi.waitFor(() => expect(s.view.current?.loaded).toBe(true));
        s.list.mockReturnValueOnce(gate.promise);
        const pending = s.controller.load(true);
        s.controller.select(b.id);
        await vi.waitFor(() => expect(s.view.current?.loaded).toBe(true));
        s.controller.select(a.id);
        gate.resolve(snapshot(60)); await pending;
        expect(s.view.current?.items).toEqual([mediaItem(a)]);
        await s.controller.load(true);
        expect(s.view.current?.items).toEqual([mediaItem(a)]);
        expect(s.view.current?.error?.code).toBe("invalidResponse");
    });
    it.each([true, false])("discards the previous remainder as soon as refresh starts (success=%s)", async (success) => {
        const s = setup(), gate = createDeferred<UploadMediaPage>();
        s.list.mockResolvedValue(snapshot(60)); await loaded(s);
        s.list.mockReturnValueOnce(gate.promise);
        const refresh = s.controller.load();
        expect(s.view.current?.hasMore).toBe(false);
        await s.controller.load(true);
        if (success) gate.resolve({ ...snapshot(30), items: snapshot(30).items.map((item) => ({ ...item, id: "fresh:" + item.id })) });
        else gate.reject(new UploadMediaError("network"));
        await refresh;
        expect(s.view.current?.items).toHaveLength(24);
        if (success) {
            await s.controller.load(true);
            expect(s.view.current?.items).toHaveLength(30);
            expect(s.view.current?.items.every((item) => item.id.startsWith("fresh:"))).toBe(true);
        } else {
            expect(s.view.current).toMatchObject({ hasMore: false, needsRefresh: true, error: { code: "network" } });
        }
    });
    it.each(["success", "unknownDelete", "forbidden"] as const)("handles deletion %s without reviving a remainder", async (outcome) => {
        const s = setup(); s.list.mockResolvedValue(snapshot(60)); await loaded(s);
        s.evict.mockResolvedValue(false);
        if (outcome !== "success") s.remove.mockRejectedValue(new UploadMediaError(outcome));
        const deletedId = s.view.current!.items[0].id;
        await s.controller.delete(deletedId);
        expect(s.remove).toHaveBeenCalledOnce();
        if (outcome === "forbidden") {
            expect(s.view.current?.hasMore).toBe(true);
            await s.controller.load(true);
            expect(s.view.current?.items).toHaveLength(48);
            expect(s.view.current?.error).toBeNull();
            expect(s.list).toHaveBeenCalledOnce();
        } else {
            expect(s.view.current).toMatchObject({ hasMore: false, nextPage: null, needsRefresh: true });
            s.list.mockResolvedValue({ ...snapshot(0) });
            await s.controller.load(true);
            expect(s.list.mock.calls.at(-1)?.[0]).toMatchObject({ page: null, context: null });
            expect(s.view.current?.items).toEqual([]);
            if (outcome === "success") expect(s.evict).toHaveBeenCalledTimes(2);
        }
    });
    it("discards the remainder when a dispatched deletion is suspended", async () => {
        const s = setup(), gate = createDeferred<void>();
        s.list.mockResolvedValue(snapshot(60)); await loaded(s);
        s.remove.mockImplementation((params) => { params.onDeleteDispatched?.(); return gate.promise; });
        const pending = s.controller.delete(s.view.current!.items[0].id);
        s.controller.suspend(); s.controller.activate();
        expect(s.view.current).toMatchObject({ hasMore: false, needsRefresh: true, error: { code: "unknownDelete" } });
        gate.resolve(); await pending;
        expect(s.view.current?.hasMore).toBe(false);
    });
    it("keeps same-owner snapshots isolated across selection and tab suspension", async () => {
        const s = setup(), a = mediaDestination(), b = mediaDestination("blossom", "other");
        s.list.mockImplementation(async (params) => snapshot(60, params.destination));
        s.controller.configure(mediaPubkey, [a, b]);
        await vi.waitFor(() => expect(s.view.current?.loaded).toBe(true));
        s.controller.select(b.id);
        await vi.waitFor(() => expect(s.view.current?.loaded).toBe(true));
        await s.controller.load(true);
        s.controller.select(a.id); s.controller.suspend(); s.controller.activate();
        expect(s.view.current?.items).toHaveLength(24);
        await s.controller.load(true);
        expect(s.view.current?.items).toHaveLength(48);
        expect(s.view.current?.items.every((item) => item.destinationId === a.id)).toBe(true);
        s.controller.select(b.id);
        expect(s.view.current?.items).toHaveLength(48);
        expect(s.view.current?.items.every((item) => item.destinationId === b.id)).toBe(true);
        expect(s.list).toHaveBeenCalledTimes(2);
    });
    it.each(["account", "logout", "invalidate", "url", "protocol", "remove"])("drops snapshots and delayed results on %s, including A→B→A", async (reason) => {
        const s = setup(), old = snapshot(60), gate = createDeferred<UploadMediaPage>();
        s.list.mockResolvedValue(old); await loaded(s);
        s.list.mockReturnValueOnce(gate.promise).mockResolvedValue({ ...mediaPage(), items: [], nextPage: null });
        const pending = s.controller.load();
        const a = mediaDestination();
        if (reason === "account") {
            s.auth.value.pubkey = "c".repeat(64); s.controller.configure(s.auth.value.pubkey, [a]);
            s.auth.value.pubkey = mediaPubkey; s.controller.configure(mediaPubkey, [a]);
        } else if (reason === "logout") {
            s.auth.value.isAuthenticated = false; s.controller.configure(null, []);
        } else if (reason === "url" || reason === "protocol") {
            s.controller.configure(mediaPubkey, [{ ...a, ...(reason === "url" ? { serverUrl: "https://other.example" } : { protocol: "nip96" as const }) }]);
        } else if (reason === "remove") s.controller.configure(mediaPubkey, []);
        else s.controller.invalidate();
        gate.resolve(old); await pending;
        await s.controller.load(true);
        expect(s.view.current?.items ?? []).toEqual([]);
        expect(s.view.current?.hasMore ?? false).toBe(false);
    });
    it.each(["account", "logout", "inactive"])("does not reveal local data for an invalid owner: %s", async (reason) => {
        const s = setup(); s.list.mockResolvedValue(snapshot(60)); await loaded(s);
        if (reason === "account") s.auth.value.pubkey = "c".repeat(64);
        else if (reason === "logout") s.auth.value.isAuthenticated = false;
        else s.controller.suspend();
        await s.controller.load(true);
        expect(s.view.current?.items).toHaveLength(24);
        expect(s.list).toHaveBeenCalledOnce();
    });
    it("does not slice NIP-96 pages and sends their exact remote continuation", async () => {
        const s = setup(), destination = mediaDestination("nip96"), items = snapshot(30, destination).items;
        const nextPage = { protocol: "nip96" as const, page: 1, count: 30 };
        s.list.mockResolvedValueOnce({ ...mediaPage(destination, items), nextPage })
            .mockResolvedValueOnce({ ...mediaPage(destination, [mediaItem(destination)]), nextPage: null });
        s.controller.configure(mediaPubkey, [destination]);
        await vi.waitFor(() => expect(s.view.current?.loaded).toBe(true));
        expect(s.view.current?.items).toHaveLength(30);
        expect(s.view.current?.hasMore).toBe(true);
        await s.controller.load(true);
        expect(s.list.mock.calls[1][0]).toMatchObject({ page: nextPage });
        expect(s.view.current).toMatchObject({ hasMore: false, nextPage: null });
    });
});
