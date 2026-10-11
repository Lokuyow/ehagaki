import { test, expect, chromium, type Page } from "@playwright/test";
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { resolve, sep } from "node:path";
import type { AddressInfo } from "node:net";
import { finalizeEvent, generateSecretKey, getPublicKey, type EventTemplate } from "nostr-tools";
import { UPLOAD_MEDIA_IMAGE_CACHE_NAME as bodyName, UPLOAD_MEDIA_IMAGE_META_CACHE_NAME as metaName,
    UPLOAD_MEDIA_IMAGE_SUPPORT_MESSAGE, UPLOAD_MEDIA_IMAGE_EVICT_MESSAGE } from "../../lib/uploadMediaImageCachePolicy";

test.use({ trace: "off" });
test.setTimeout(90_000);
const imageHash = "b".repeat(64), videoHash = "c".repeat(64), secondVideoHash = "e".repeat(64), audioHash = "d".repeat(64);
const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="teal"/></svg>');
async function fixture(base: "/" | "/ehagaki/") {
    const directory = resolve("node_modules/.cache/sw-update", base === "/" ? "root" : "pages");
    const counts = new Map<string, number>();
    let offline = false, deleted = false, workerVersion = 0, legacy = false;
    let video = Buffer.from([]), videoMime = "video/webm", videoExtension = "webm";
    const held = new Map<string, () => void>();
    const media = createServer((request, response) => {
        const url = new URL(request.url!, "http://localhost");
        counts.set(request.method + " " + url.pathname + url.search, (counts.get(request.method + " " + url.pathname + url.search) ?? 0) + 1);
        if (offline) { request.socket.destroy(); return; }
        if (url.searchParams.get("cors") !== "0") response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Headers", "Authorization");
        response.setHeader("Access-Control-Allow-Methods", "GET,DELETE,OPTIONS");
        if (request.method === "OPTIONS") { response.writeHead(204).end(); return; }
        if (url.pathname.startsWith("/list/")) {
            const origin = `http://127.0.0.1:${(media.address() as AddressInfo).port}`;
            const descriptors = [
                ...(!deleted ? [{ sha256: imageHash, type: "image/png", url: origin + "/" + imageHash + ".png", size: svg.length, uploaded: 123 }] : []),
                { sha256: videoHash, type: videoMime, url: origin + "/" + videoHash + "." + videoExtension },
                { sha256: secondVideoHash, type: videoMime, url: origin + "/" + secondVideoHash + "." + videoExtension },
                { sha256: audioHash, type: "audio/ogg", url: origin + "/" + audioHash + ".ogg" },
            ];
            response.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-store" });
            response.end(JSON.stringify(url.searchParams.has("cursor") ? [] : descriptors)); return;
        }
        if (request.method === "DELETE") { deleted = true; response.writeHead(204).end(); return; }
        const finish = () => {
            if (url.pathname.includes(videoHash) || url.pathname.includes(secondVideoHash)) {
                const match = request.headers.range?.match(/bytes=(\d+)-(\d*)/);
                const start = match ? Number(match[1]) : 0, end = match?.[2] ? Math.min(Number(match[2]), video.length - 1) : video.length - 1;
                const bytes = video.subarray(start, end + 1);
                response.writeHead(match ? 206 : 200, { "Content-Type": videoMime, "Accept-Ranges": "bytes", "Content-Length": bytes.length,
                    ...(match ? { "Content-Range": `bytes ${start}-${end}/${video.length}` } : {}) });
                response.end(bytes);
            } else {
                const error = url.searchParams.has("error");
                response.writeHead(error ? 503 : 200, { "Content-Type": error ? "text/plain" : "image/svg+xml", "Cache-Control": "public,max-age=3600" });
                response.end(error ? "error" : svg);
            }
            held.delete(url.search);
        };
        if (url.searchParams.has("hold")) held.set(url.search, finish); else finish();
    });
    await new Promise<void>((done) => media.listen(0, "127.0.0.1", done));
    const mediaOrigin = `http://127.0.0.1:${(media.address() as AddressInfo).port}`;
    const app = createServer((request, response) => {
        const pathname = new URL(request.url!, "http://localhost").pathname;
        if (!pathname.startsWith(base)) { response.writeHead(404).end(); return; }
        let path = decodeURIComponent(pathname.slice(base.length)) || "index.html";
        if (path === "monitor.html") { response.writeHead(200, { "Content-Type": "text/html" }).end("<html><body><main></main></body></html>"); return; }
        const fullPath = resolve(directory, path);
        if (!fullPath.startsWith(directory + sep) || !existsSync(fullPath)) { response.writeHead(404).end(); return; }
        const type = path.endsWith(".js") ? "text/javascript" : path.endsWith(".css") ? "text/css" : path.endsWith(".html") ? "text/html"
            : path.endsWith(".webmanifest") ? "application/manifest+json" : path.endsWith(".svg") ? "image/svg+xml" : "application/octet-stream";
        let bytes = readFileSync(fullPath);
        if (path === "sw.js") bytes = legacy ? Buffer.from("self.addEventListener('install',()=>self.skipWaiting()); self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));")
            : Buffer.concat([bytes, Buffer.from("\n// media fixture version " + workerVersion)]);
        response.writeHead(200, { "Content-Type": type, "Cache-Control": "no-store" }).end(bytes);
    });
    await new Promise<void>((done) => app.listen(0, "127.0.0.1", done));
    const origin = `http://127.0.0.1:${(app.address() as AddressInfo).port}`;
    return { origin, url: origin + base, mediaOrigin, counts, held,
        remote: (query = "") => mediaOrigin + "/" + imageHash + ".png" + query,
        proxy(query = "") { return origin + base + "__ehagaki-image/upload-media?url=" + encodeURIComponent(this.remote(query)) + "&server=" + encodeURIComponent(mediaOrigin); },
        setOffline(value: boolean) { offline = value; }, setLegacy(value: boolean) { legacy = value; workerVersion++; },
        setVideo(bytes: number[], mime: string) { video = Buffer.from(bytes); videoMime = mime; videoExtension = mime.includes("mp4") ? "mp4" : "webm"; },
        release() { [...held.values()].forEach((finish) => finish()); },
        async close() { this.release(); for (const server of [app, media]) { server.closeAllConnections(); await new Promise<void>((done) => server.close(() => done())); } },
    };
}
async function control(page: Page, f: Awaited<ReturnType<typeof fixture>>) {
    await page.goto(f.url + "monitor.html");
    await page.evaluate(async (url) => { await navigator.serviceWorker.register(url); await navigator.serviceWorker.ready; }, f.url + "sw.js");
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
}
async function workerMessage(page: Page, type: string, urls?: string[]) {
    return page.evaluate(({ type, urls }) => new Promise<unknown>((done) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = (event) => { channel.port1.close(); done(event.data); };
        navigator.serviceWorker.controller!.postMessage({ type, urls }, [channel.port2]);
    }), { type, urls });
}
let previewSequence = 0;
async function showImage(page: Page, url: string) {
    // A distinct local proxy request defeats browser decoded/HTTP cache reuse;
    // the remote URL and the SW Cache API key remain exactly the same.
    const proxy = new URL(url); proxy.searchParams.set("fixture-request", String(++previewSequence));
    return page.evaluate((src) => new Promise<boolean>((done) => {
        const image = document.createElement("img");
        image.referrerPolicy = "no-referrer";
        image.onload = () => done(true); image.onerror = () => done(false);
        image.src = src; document.querySelector("main")!.append(image);
    }), proxy.href);
}
async function keys(page: Page, name = bodyName) {
    return page.evaluate(async (cacheName) => (await (await caches.open(cacheName)).keys()).map((key) => key.url), name);
}
let recordedClip: Promise<{ bytes: number[]; mime: string }> | undefined;
async function createVideo(url: string) {
    // Windows WebKit has no canvas.captureStream. Record a deterministic MP4 in
    // Chromium and play the same encoded fixture in all three browser engines.
    recordedClip ??= (async () => {
        const browser = await chromium.launch();
        try {
            const page = await browser.newPage(); await page.goto(url);
            return await page.evaluate(async () => {
                const canvas = document.createElement("canvas"); canvas.width = 64; canvas.height = 64;
                const ctx = canvas.getContext("2d")!, stream = canvas.captureStream(10);
                const mime = "video/mp4";
                if (!MediaRecorder.isTypeSupported(mime)) throw new Error("MP4 recorder required for cross-engine video fixture");
                const recorder = new MediaRecorder(stream, { mimeType: mime }), chunks: BlobPart[] = [];
                const finished = new Promise<Blob>((done) => { recorder.ondataavailable = (event) => chunks.push(event.data); recorder.onstop = () => done(new Blob(chunks, { type: mime })); });
                recorder.start();
                for (let frame = 0; frame < 20; frame++) { ctx.fillStyle = frame % 2 ? "teal" : "white"; ctx.fillRect(0, 0, 64, 64); await new Promise((done) => setTimeout(done, 100)); }
                recorder.stop(); const blob = await finished; stream.getTracks().forEach((track) => track.stop());
                return { bytes: Array.from(new Uint8Array(await blob.arrayBuffer())), mime };
            });
        } finally { await browser.close(); }
    })();
    return recordedClip;
}
test.beforeEach(async ({ context }) => { await context.routeWebSocket("**/*", (socket) => socket.close()); });
for (const base of ["/", "/ehagaki/"] as const) {
    test(`${base} production SW image caching, CORS/opaque, offline, sharing and eviction`, async ({ page }) => {
        const f = await fixture(base);
        try {
            const failedRequests: string[] = [];
            page.on("requestfailed", (request) => { failedRequests.push(request.failure()?.errorText ?? "request failed"); });
            await control(page, f);
            expect(await workerMessage(page, UPLOAD_MEDIA_IMAGE_SUPPORT_MESSAGE)).toMatchObject({ supported: true, version: 1 });
            expect(await showImage(page, f.proxy()), JSON.stringify({ counts: [...f.counts], failedRequests })).toBe(true);
            await expect.poll(() => keys(page)).toEqual([f.remote()]);
            expect(await showImage(page, f.proxy())).toBe(true);
            expect(f.counts.get("GET /" + imageHash + ".png")).toBe(1);
            f.setOffline(true);
            expect(await showImage(page, f.proxy())).toBe(true);
            expect(f.counts.get("GET /" + imageHash + ".png")).toBe(1);
            f.setOffline(false);
            expect(await showImage(page, f.proxy("?cors=0"))).toBe(true);
            await expect.poll(() => keys(page)).toContain(f.remote("?cors=0"));
            expect(await page.evaluate(async ({ name, url }) => (await (await caches.open(name)).match(url))?.type, { name: bodyName, url: f.remote("?cors=0") })).toBe("opaque");
            expect(await showImage(page, f.proxy("?error=1"))).toBe(false);
            expect(await keys(page)).not.toContain(f.remote("?error=1"));
            const first = showImage(page, f.proxy("?hold=1")), second = showImage(page, f.proxy("?hold=1"));
            await expect.poll(() => f.held.size).toBe(1);
            expect(f.counts.get("GET /" + imageHash + ".png?hold=1")).toBe(1);
            expect(await workerMessage(page, UPLOAD_MEDIA_IMAGE_EVICT_MESSAGE, [f.remote("?hold=1")])).toMatchObject({ success: true });
            f.release(); expect(await first).toBe(true); expect(await second).toBe(true);
            // Wait for both body/metadata commits to settle via a later serialized eviction.
            expect(await workerMessage(page, UPLOAD_MEDIA_IMAGE_EVICT_MESSAGE, [f.remote(), f.remote("?cors=0")])).toMatchObject({ success: true });
            expect(await keys(page)).toEqual([]); expect(await keys(page, metaName)).toEqual([]);
            // The distinct local proxy URL forces an image request while retaining SW control.
            await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
            expect(await showImage(page, f.proxy()), JSON.stringify({ counts: [...f.counts], failedRequests })).toBe(true);
            expect(f.counts.get("GET /" + imageHash + ".png")).toBe(2);
        } finally { await f.close(); }
    });
    test(`${base} upgrades a controlled old worker without force-activating an update`, async ({ page }) => {
        const f = await fixture(base);
        try {
            f.setLegacy(true); await control(page, f);
            await page.evaluate(() => Reflect.set(window, "__oldWorker", navigator.serviceWorker.controller));
            f.setLegacy(false);
            await page.evaluate(async () => { await (await navigator.serviceWorker.getRegistration())!.update(); });
            await expect.poll(() => page.evaluate(async () => Boolean((await navigator.serviceWorker.getRegistration())?.waiting))).toBe(true);
            // The old controller is still active until explicit update application.
            expect(await page.evaluate(() => navigator.serviceWorker.controller === Reflect.get(window, "__oldWorker"))).toBe(true);
            await page.evaluate(async () => {
                const waiting = (await navigator.serviceWorker.getRegistration())?.waiting;
                if (!waiting) throw new Error("Expected an explicitly waiting production worker");
                waiting.postMessage({ type: "SKIP_WAITING" });
            });
            await page.waitForFunction(() => navigator.serviceWorker.controller !== Reflect.get(window, "__oldWorker"));
            expect(await workerMessage(page, UPLOAD_MEDIA_IMAGE_SUPPORT_MESSAGE)).toMatchObject({ supported: true });
            expect(await showImage(page, f.proxy())).toBe(true);
        } finally { await f.close(); }
    });
    test(`${base} settings media UI: lazy video, confirmation, responsive layout, focus and back`, async ({ page, context }, testInfo) => {
        const f = await fixture(base), key = generateSecretKey(), pubkey = getPublicKey(key);
        try {
            await page.exposeFunction("signFixtureEvent", (event: EventTemplate) => finalizeEvent(event, key));
            await page.addInitScript((pubkey) => {
                localStorage.setItem("nostr-accounts", JSON.stringify([{ pubkeyHex: pubkey, type: "nip07", addedAt: 1 }]));
                localStorage.setItem("nostr-active-account", pubkey);
                Reflect.set(window, "nostr", { getPublicKey: async () => pubkey, signEvent: (event: unknown) => Reflect.get(window, "signFixtureEvent")(event) });
                const fetchLocal = window.fetch.bind(window);
                window.fetch = (input, init) => {
                    const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url, location.href);
                    if (!["127.0.0.1", "localhost"].includes(url.hostname)) return Promise.reject(new Error("External fixture fetch disabled"));
                    return fetchLocal(input, init);
                };
            }, pubkey);
            await control(page, f);
            const clip = await createVideo(f.url + "monitor.html");
            f.setVideo(clip.bytes, clip.mime);
            await page.goto(f.url);
            const start = page.getByRole("button", { name: "はじめる" }); await start.click(); await expect(start).toBeHidden();
            await page.evaluate(async ({ server, pubkey }) => {
                const database = await new Promise<IDBDatabase>((done, reject) => { const request = indexedDB.open("eHagakiDB"); request.onsuccess = () => done(request.result); request.onerror = () => reject(request.error); });
                const transaction = database.transaction("uploadDestinations", "readwrite");
                const store = transaction.objectStore("uploadDestinations");
                store.clear();
                store.put({ id: "fixture", scopeKey: pubkey, pubkeyHex: pubkey, name: "Fixture media", protocol: "blossom", serverUrl: server,
                    presetId: "custom", isDefault: true, enabled: false, sortIndex: 0, createdAt: 1, updatedAt: 1, schemaVersion: 1, auth: { type: "blossom-bud11" },
                    capabilities: { maxUploadSize: null, supportedMimeTypes: [], supportsDelete: false, supportsList: false, supportsMirror: false, supportsMediaOptimization: false, authRequired: true, source: "preset" } });
                await new Promise<void>((done, reject) => { transaction.oncomplete = () => done(); transaction.onerror = () => reject(transaction.error); }); database.close();
            }, { server: f.mediaOrigin, pubkey });
            await page.locator(".settings-btn").click();
            await page.locator(".upload-destination-manage-btn").click();
            const entry = page.getByRole("button", { name: "アップロード済みメディア", exact: true });
            await entry.focus(); await page.keyboard.press("Enter");
            const dialog = page.getByRole("dialog", { name: "アップロード済みメディア", exact: true });
            await dialog.getByRole("combobox").selectOption("fixture");
            await expect(dialog.locator("article")).toHaveCount(3);
            await expect(dialog.locator("img")).toBeVisible();
            await expect.poll(() => keys(page)).toContain(f.remote());
            expect([...f.counts.keys()].some((url) => url.startsWith("GET /" + videoHash))).toBe(false);
            for (const width of [360, 320, 1100]) {
                await page.setViewportSize({ width, height: 850 });
                expect(await dialog.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
                await expect(dialog.getByRole("button", { name: "一覧を更新" })).toBeVisible();
            }
            await page.setViewportSize({ width: 360, height: 800 });
            await dialog.getByRole("button", { name: "動画を開く" }).first().click();
            const video = dialog.locator("video");
            await expect(video).toHaveCount(1);
            expect(await video.evaluate((node: HTMLVideoElement) => ({ autoplay: node.autoplay, preload: node.preload, inline: node.hasAttribute("playsinline") })))
                .toEqual({ autoplay: false, preload: "metadata", inline: true });
            await video.evaluate(async (node: HTMLVideoElement) => { await node.play(); });
            await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.currentTime)).toBeGreaterThan(0);
            await video.evaluate((node: HTMLVideoElement) => node.pause());
            await video.scrollIntoViewIfNeeded();
            await page.screenshot({ path: testInfo.outputPath("uploaded-media-video-360.png") });
            const released = await video.elementHandle();
            await dialog.getByRole("button", { name: "動画を開く" }).click();
            await expect(video).toHaveCount(1);
            expect(await released!.evaluate((node: HTMLVideoElement) => node.paused && !node.hasAttribute("src"))).toBe(true);
            await expect(video).toHaveAttribute("src", new RegExp(secondVideoHash));
            await dialog.getByRole("button", { name: "動画を閉じる" }).click({ timeout: 5000 });
            await expect(video).toHaveCount(0);
            expect((await keys(page)).some((url) => url.includes(videoHash))).toBe(false);
            const remove = dialog.locator('article[data-media-kind="image"]').getByRole("button", { name: "このサーバーから削除する" });
            await remove.click();
            const confirm = page.getByRole("alertdialog");
            await expect(confirm).toContainText(f.mediaOrigin);
            await confirm.getByRole("button", { name: "キャンセル" }).click();
            await expect(remove).toBeFocused(); expect(f.counts.get("DELETE /" + imageHash)).toBeUndefined();
            await remove.click(); await confirm.getByRole("button", { name: "このサーバーから削除する" }).click();
            await expect(dialog.locator("article")).toHaveCount(2);
            await expect.poll(() => keys(page)).not.toContain(f.remote());
            expect(f.counts.get("DELETE /" + imageHash)).toBe(1);
            await page.screenshot({ path: testInfo.outputPath("uploaded-media-360.png") });
            await page.evaluate(() => history.back());
            await expect(dialog).toBeHidden(); await expect(entry).toBeFocused();
            await expect(page.locator(".settings-dialog")).toBeVisible();
            await context.setOffline(true);
            await entry.click(); await expect(dialog).toBeVisible(); await context.setOffline(false);
            // The same full application runtime inside a 320px host iframe.
            await page.goto(f.url + "monitor.html");
            await page.evaluate((url) => {
                const frame = document.createElement("iframe"); frame.src = url;
                frame.style.cssText = "width:320px;height:720px;border:0";
                document.querySelector("main")!.append(frame);
            }, f.url);
            const frame = page.frameLocator("iframe");
            await expect(frame.locator(".settings-btn")).toBeVisible();
            const frameStart = frame.getByRole("button", { name: "はじめる" });
            if (await frameStart.isVisible()) await frameStart.click();
            await frame.locator(".settings-btn").click();
            await frame.locator(".upload-destination-manage-btn").click();
            await frame.getByRole("button", { name: "アップロード済みメディア", exact: true }).click();
            const embeddedDialog = frame.getByRole("dialog", { name: "アップロード済みメディア", exact: true });
            await embeddedDialog.getByRole("combobox").selectOption("fixture");
            await expect(embeddedDialog.locator("article")).toHaveCount(2);
            expect(await embeddedDialog.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
            await expect(embeddedDialog.getByRole("button", { name: "動画を開く" }).first()).toBeVisible();
            await page.screenshot({ path: testInfo.outputPath("uploaded-media-iframe-320.png") });
        } finally { await f.close(); }
    });
}
