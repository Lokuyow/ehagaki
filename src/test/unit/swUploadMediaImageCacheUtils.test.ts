import { describe, expect, it, vi } from "vitest";
import { UploadMediaImageCacheController } from "../../lib/swUploadMediaImageCacheUtils";
import { buildUploadMediaImageProxyUrl } from "../../lib/uploadMediaImageUrl";
import { UPLOAD_MEDIA_IMAGE_CACHE_NAME as bodyName, UPLOAD_MEDIA_IMAGE_META_CACHE_NAME as metaName, UPLOAD_MEDIA_IMAGE_CACHE_POLICY as policy } from "../../lib/uploadMediaImageCachePolicy";
import { createDeferred } from "../deferredTestUtils";

class MemoryCache {
    entries = new Map<string, Response>();
    key(request: RequestInfo | URL) { return typeof request === "string" ? request : request instanceof URL ? request.href : request.url; }
    match = vi.fn(async (request: RequestInfo | URL) => this.entries.get(this.key(request))?.clone());
    matchAll = vi.fn(async () => [...this.entries.values()].map(response => response.clone()));
    put = vi.fn(async (request: RequestInfo | URL, response: Response) => { this.entries.set(this.key(request), response.clone()); });
    delete = vi.fn(async (request: RequestInfo | URL) => this.entries.delete(this.key(request)));
    keys = vi.fn(async () => [...this.entries.keys()].map((url) => new Request(url)));
}
function image(body = "image", headers = {}, status = 200) { return new Response(body, { status, headers: { "Content-Type": "image/png", ...headers } }); }
function opaque(): Response {
    const response = new Response("opaque");
    Object.defineProperty(response, "type", { value: "opaque" });
    response.clone = opaque;
    return response;
}
function setup(basePath = "/ehagaki/") {
    let now = 100000;
    const body = new MemoryCache(), meta = new MemoryCache();
    const storage = { open: vi.fn(async (name: string) => (name === bodyName ? body : meta) as unknown as Cache), delete: vi.fn(async () => true) };
    const fetchRequest = vi.fn(async (_request: Request) => image());
    const controller = new UploadMediaImageCacheController({ cacheStorage: storage as unknown as CacheStorage, fetchRequest,
        currentOrigin: "https://app.example", basePath, now: () => now });
    const url = "https://media.example/p.png?q=1";
    async function display(remoteUrl = url, destination = "image") {
        const pending: Promise<unknown>[] = [];
        const proxy = buildUploadMediaImageProxyUrl({ url: remoteUrl, serverUrl: "https://media.example",
            basePath, currentOrigin: "https://app.example" })!;
        const request = new Request(proxy);
        Object.defineProperty(request, "destination", { value: destination });
        const response = await controller.handle({ request, waitUntil: (promise) => { pending.push(promise); } });
        return { response, done: () => Promise.all(pending) };
    }
    return { controller, body, meta, storage, fetchRequest, display, url, advance: (ms: number) => { now += ms; } };
}
describe("upload-management image cache", () => {
    it("acknowledges eviction ahead of queued preview writes while finishing the active commit", async () => {
        const s = setup();
        const touchedUrl = 'https://media.example/touched.png';
        const activeUrl = 'https://media.example/active.png';
        await (await s.display()).done();
        await (await s.display(touchedUrl)).done();
        s.advance(policy.touchMs);
        const activeCommit = createDeferred<void>(), activeStarted = createDeferred<void>();
        const touchCommit = createDeferred<void>(), touchStarted = createDeferred<void>();
        const putBody = s.body.put.getMockImplementation()!;
        const putMeta = s.meta.put.getMockImplementation()!;
        s.body.put.mockImplementation(async (request, response) => {
            if (s.body.key(request) === activeUrl) { activeStarted.resolve(); await activeCommit.promise; }
            await putBody(request, response);
        });
        s.meta.put.mockImplementation(async (request, response) => {
            if (s.meta.key(request) === touchedUrl) { touchStarted.resolve(); await touchCommit.promise; }
            await putMeta(request, response);
        });
        const active = await s.display(activeUrl);
        await activeStarted.promise;
        const touch = await s.display(touchedUrl);
        let acknowledged = false;
        const eviction = s.controller.evict([s.url]).then(result => { acknowledged = result; });
        expect(s.body.entries.has(s.url)).toBe(true);
        activeCommit.resolve();
        await touchStarted.promise;
        try {
            await vi.waitFor(() => expect(acknowledged).toBe(true));
            expect(s.body.entries.has(s.url)).toBe(false);
            expect(s.meta.entries.has(s.url)).toBe(false);
            expect(s.body.entries.has(activeUrl)).toBe(true);
        } finally {
            touchCommit.resolve();
            await Promise.all([active.done(), touch.done(), eviction]);
        }
    });

    it("preserves entries being refreshed and displays a new response without storing when all slots are protected", async () => {
        const s = setup(), refresh = createDeferred<Response>();
        for (let index = 0; index < policy.maxEntries; index++) {
            const url = "https://media.example/protected" + index + ".png";
            s.body.entries.set(url, image());
            s.meta.entries.set(url, new Response(JSON.stringify({ schemaVersion: 1, url, responseType: "readable", verifiedSize: 5,
                fetchedAt: 100000, lastAttemptAt: 100000, lastAccessedAt: 100000 })));
        }
        s.advance(policy.readableFreshMs + 1);
        s.fetchRequest.mockImplementation((request) => request.url.includes("protected") ? refresh.promise : Promise.resolve(image("new")));
        const stale = await Promise.all([...s.body.entries.keys()].map((url) => s.display(url)));
        expect(s.fetchRequest).toHaveBeenCalledTimes(policy.maxEntries);
        const incoming = await s.display(); await incoming.done();
        expect(await incoming.response.text()).toBe("new");
        expect(s.body.entries.has(s.url)).toBe(false);
        expect(s.body.entries.size).toBe(policy.maxEntries);
        refresh.resolve(image()); await Promise.all(stale.map((result) => result.done()));
    });
    it("updates access metadata at most once per hour without re-fetching a fresh image", async () => {
        const s = setup(); await (await s.display()).done();
        const writes = s.meta.put.mock.calls.length;
        s.advance(policy.touchMs - 1); await (await s.display()).done();
        expect(s.meta.put).toHaveBeenCalledTimes(writes);
        s.advance(1); await (await s.display()).done();
        expect(s.meta.put).toHaveBeenCalledTimes(writes + 1);
        expect(s.fetchRequest).toHaveBeenCalledTimes(1);
    });
    it("keeps an existing pair coherent if metadata write, rollback and cleanup all fail", async () => {
        const s = setup(); await (await s.display()).done();
        s.advance(policy.readableFreshMs + 1);
        s.fetchRequest.mockImplementation(async () => image("replacement body"));
        s.meta.put.mockRejectedValue(new Error("metadata storage failure"));
        s.meta.delete.mockRejectedValue(new Error("metadata storage failure"));
        s.body.delete.mockRejectedValue(new Error("body storage failure"));
        s.body.put.mockImplementationOnce(async (request, response) => { s.body.entries.set(s.body.key(request), response.clone()); })
            .mockRejectedValue(new Error("rollback failure"));
        const result = await s.display(); await result.done();
        expect(await result.response.text()).toBe("image");
        expect(await (await s.body.match(s.url))!.text()).toBe("image");
        expect(await (await s.meta.match(s.url))!.json()).toMatchObject({ verifiedSize: 5 });
    });
    it.each(["/", "/ehagaki/"])("stores/reuses/offline displays independently of query variants under %s", async (basePath) => {
        const s = setup(basePath), first = await s.display(); await first.done();
        expect(await first.response.text()).toBe("image");
        s.fetchRequest.mockRejectedValue(new Error("offline"));
        expect(await (await s.display()).response.text()).toBe("image");
        expect(s.fetchRequest).toHaveBeenCalledTimes(1);
        expect((await s.display("https://media.example/p.png?q=2")).response.status).toBe(502);
        expect(s.body.entries.size).toBe(1);
        expect([...s.body.entries.keys()]).toEqual([s.url]);
    });
    it("shares simultaneous requests through completion of the cache commit", async () => {
        const s = setup(), response = createDeferred<Response>(), commit = createDeferred<void>();
        s.fetchRequest.mockImplementation(() => response.promise);
        s.body.put.mockImplementationOnce(async (request, value) => { await commit.promise; s.body.entries.set(s.body.key(request), value.clone()); });
        const a = s.display(), b = s.display();
        await vi.waitFor(() => expect(s.fetchRequest).toHaveBeenCalledTimes(1));
        response.resolve(image());
        const [one, two] = await Promise.all([a, b]);
        const three = await s.display();
        expect(await one.response.text()).toBe("image");
        expect(await two.response.text()).toBe("image");
        expect(s.fetchRequest).toHaveBeenCalledTimes(1);
        commit.resolve(); await Promise.all([one.done(), two.done(), three.done()]);
    });
    it("returns stale images first, suppresses repeated failed refreshes and expires old entries", async () => {
        const s = setup(), first = await s.display(); await first.done();
        s.advance(policy.readableFreshMs + 1);
        s.fetchRequest.mockRejectedValue(new Error("offline"));
        const stale = await s.display(); expect(await stale.response.text()).toBe("image"); await stale.done();
        expect(s.fetchRequest).toHaveBeenCalledTimes(3);
        await (await s.display()).done(); expect(s.fetchRequest).toHaveBeenCalledTimes(3);
        s.advance(policy.retryMs);
        await (await s.display()).done(); expect(s.fetchRequest).toHaveBeenCalledTimes(5);
        s.advance(policy.readableRetainMs);
        expect((await s.display()).response.status).toBe(502);
        expect(s.body.entries.size).toBe(0);
    });
    it.each(["open", "read", "write", "metadata"])("returns an intact network response despite cache %s failure", async (failure) => {
        const s = setup();
        if (failure === "open") s.storage.open.mockRejectedValue(new Error("quota"));
        if (failure === "read") s.body.match.mockRejectedValue(new Error("quota"));
        if (failure === "write") s.body.put.mockRejectedValue(new Error("quota"));
        if (failure === "metadata") s.meta.put.mockRejectedValue(new Error("quota"));
        const result = await s.display(); await result.done();
        expect(await result.response.text()).toBe("image");
        expect(s.body.entries.size).toBe(0);
    });
    it.each([
        () => image("html", { "Content-Type": "text/html" }),
        () => image("partial", {}, 206),
        () => image("error", {}, 503),
        () => image("private", { "Cache-Control": "no-store" }),
        () => image("large", { "Content-Length": String(policy.maxReadableImageBytes + 1) }),
    ])("displays but does not save a non-cacheable response", async (response) => {
        const s = setup(); s.fetchRequest.mockImplementation(async () => response());
        const result = await s.display(); await result.done();
        expect(s.body.entries.size).toBe(0);
        expect(await result.response.text()).not.toBe("");
    });
    it("bounds the clone read even when Content-Length understates the body", async () => {
        const s = setup();
        s.fetchRequest.mockImplementation(async () => new Response(new Uint8Array(policy.maxReadableImageBytes + 1), {
            headers: { "Content-Type": "image/png", "Content-Length": "1" },
        }));
        const result = await s.display(); await result.done();
        expect((await result.response.arrayBuffer()).byteLength).toBe(policy.maxReadableImageBytes + 1);
        expect(s.body.entries.size).toBe(0);
    });
    it("falls back to opaque only on CORS exception, caps opaque entries and uses shorter retention", async () => {
        const s = setup();
        s.fetchRequest.mockImplementation(async (request) => { if (request.mode === "cors") throw new Error("CORS"); return opaque(); });
        for (let index = 0; index < 9; index++) { await (await s.display("https://media.example/" + index + ".png")).done(); s.advance(1); }
        expect(s.body.entries.size).toBe(policy.maxOpaqueEntries);
        expect(s.body.entries.has("https://media.example/0.png")).toBe(false);
        expect(s.fetchRequest.mock.calls.every(([request]) => request.credentials === "omit" && request.referrerPolicy === "no-referrer")).toBe(true);
        s.advance(policy.opaqueRetainMs); await s.controller.reconcile();
        expect(s.body.entries.size).toBe(0);
    });
    it("enforces LRU count and readable bytes limits on activation", async () => {
        const s = setup();
        for (let index = 0; index < 66; index++) {
            const url = "https://media.example/" + index + ".png";
            s.body.entries.set(url, image());
            s.meta.entries.set(url, new Response(JSON.stringify({ schemaVersion: 1, url, responseType: "readable",
                verifiedSize: policy.maxReadableImageBytes, fetchedAt: 100000, lastAttemptAt: 100000, lastAccessedAt: 100000 + index })));
        }
        await s.controller.reconcile();
        expect(s.body.entries.size).toBe(6);
        expect(s.meta.entries.size).toBe(6);
        expect(s.body.entries.has("https://media.example/65.png")).toBe(true);
        // Small entries test the independent count limit.
        for (const [url] of s.meta.entries) s.meta.entries.set(url, new Response(JSON.stringify({ schemaVersion: 1, url, responseType: "readable",
            verifiedSize: 1, fetchedAt: 100000, lastAttemptAt: 100000, lastAccessedAt: 100000 })));
        for (let index = 0; index < 66; index++) await (await s.display("https://media.example/new" + index + ".png")).done();
        expect(s.body.entries.size).toBe(64); expect(s.meta.entries.size).toBe(64);
    });
    it("removes corrupt metadata and orphan body/metadata pairs", async () => {
        const s = setup();
        s.body.entries.set(s.url, image()); s.meta.entries.set(s.url, new Response("invalid JSON"));
        s.meta.entries.set("https://media.example/orphan.png", new Response("{}"));
        await s.controller.reconcile();
        expect(s.body.entries.size).toBe(0); expect(s.meta.entries.size).toBe(0);
    });
    it("invalidates in-flight responses so eviction acknowledgement cannot be followed by stale re-saving", async () => {
        const s = setup(), response = createDeferred<Response>();
        s.fetchRequest.mockImplementationOnce(() => response.promise);
        const pending = s.display();
        await vi.waitFor(() => expect(s.fetchRequest).toHaveBeenCalledTimes(1));
        expect(await s.controller.evict([s.url])).toBe(true);
        response.resolve(image("before deletion"));
        const result = await pending; await result.done();
        expect(s.body.entries.size).toBe(0); expect(s.meta.entries.size).toBe(0);
        await (await s.display()).done();
        expect(s.body.entries.size).toBe(1); expect(s.fetchRequest).toHaveBeenCalledTimes(2);
    });
    it("reports eviction failure separately and never routes a video through image fetch/cache", async () => {
        const s = setup(); await (await s.display()).done();
        s.meta.delete.mockRejectedValue(new Error("quota"));
        expect(await s.controller.evict([s.url])).toBe(false);
        expect((await s.display(s.url, "video")).response.status).toBe(400);
        expect(s.fetchRequest).toHaveBeenCalledTimes(1);
    });
});
