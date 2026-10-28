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
async function fixture(base: "/" | "/ehagaki/", listing?: "paged" | "snapshot") {
    const directory = resolve("node_modules/.cache/sw-update", base === "/" ? "root" : "pages");
    const counts = new Map<string, number>();
    const deletedHashes = new Set<string>();
    let offline = false, deleted = false, workerVersion = 0, legacy = false, repeatEnd = false;
    let holdDelete = false, deleteRelease: (() => void) | null = null;
    let holdList = false, listRelease: (() => void) | null = null, listError = 0;
    let signEvent: ((event: EventTemplate) => unknown) | undefined;
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
            if (listError) { response.writeHead(listError, { "Content-Type": "application/json" }).end("{}"); return; }
            const origin = `http://127.0.0.1:${(media.address() as AddressInfo).port}`;
            const descriptors = listing ? Array.from({ length: 231 }, (_, index) => {
                const sha256 = index === 0 ? imageHash : index.toString(16).padStart(64, "0");
                return { sha256, type: "image/png", url: `${origin}/${sha256}.png`, size: svg.length, uploaded: 300 - index };
            }).filter((item) => !deletedHashes.has(item.sha256)) : [
                ...(!deleted ? [{ sha256: imageHash, type: "image/png", url: origin + "/" + imageHash + ".png", size: svg.length, uploaded: 123 }] : []),
                { sha256: videoHash, type: videoMime, url: origin + "/" + videoHash + "." + videoExtension },
                { sha256: secondVideoHash, type: videoMime, url: origin + "/" + secondVideoHash + "." + videoExtension },
                { sha256: audioHash, type: "audio/ogg", url: origin + "/" + audioHash + ".ogg" },
            ];
            response.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-store" });
            const cursor = url.searchParams.get("cursor");
            const offset = cursor ? descriptors.findIndex((item) => item.sha256 === cursor) + 1 : 0;
            const items = listing === "snapshot" ? descriptors
                : listing === "paged" ? descriptors.slice(offset, offset + Number(url.searchParams.get("limit") ?? 24))
                : cursor && !repeatEnd ? [] : descriptors;
            const finish = () => { response.end(JSON.stringify(items)); listRelease = null; };
            if (holdList) listRelease = finish; else finish();
            return;
        }
        if (request.method === "DELETE") {
            const finish = () => { deleted = true; deletedHashes.add(url.pathname.slice(1)); response.writeHead(204).end(); deleteRelease = null; };
            if (holdDelete) deleteRelease = finish; else finish();
            return;
        }
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
        if (path === "__fixture-sign" && request.method === "POST" && signEvent) {
            let input = "";
            request.setEncoding("utf8");
            request.on("data", chunk => { input += chunk; });
            request.on("end", () => {
                try {
                    const signed = JSON.stringify(signEvent!(JSON.parse(input)));
                    response.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-store" }).end(signed);
                }
                catch { response.writeHead(400).end(); }
            });
            return;
        }
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
        setSigner(signer: (event: EventTemplate) => unknown) { signEvent = signer; },
        remote: (query = "") => mediaOrigin + "/" + imageHash + ".png" + query,
        proxy(query = "") { return origin + base + "__ehagaki-image/upload-media?url=" + encodeURIComponent(this.remote(query)) + "&server=" + encodeURIComponent(mediaOrigin); },
        setOffline(value: boolean) { offline = value; }, setLegacy(value: boolean) { legacy = value; workerVersion++; },
        setVideo(bytes: number[], mime: string) { video = Buffer.from(bytes); videoMime = mime; videoExtension = mime.includes("mp4") ? "mp4" : "webm"; },
        release() { [...held.values()].forEach((finish) => finish()); },
        holdDelete() { holdDelete = true; },
        holdList() { holdList = true; },
        releaseList() { holdList = false; listRelease?.(); },
        setListError(status: number) { listError = status; },
        repeatLastPage() { repeatEnd = true; },
        releaseDelete() { holdDelete = false; deleteRelease?.(); },
        async close() { this.releaseList(); this.releaseDelete(); this.release(); for (const server of [app, media]) { server.closeAllConnections(); await new Promise<void>((done) => server.close(() => done())); } },
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
async function openPaginationMedia(page: Page, f: Awaited<ReturnType<typeof fixture>>, withServiceWorker = true) {
    const key = generateSecretKey(), pubkey = getPublicKey(key);
    let signedLists = 0;
    f.setSigner((event: EventTemplate) => {
        if (event.tags.some((tag) => tag[0] === "t" && tag[1] === "list")) signedLists++;
        return finalizeEvent(event, key);
    });
    await page.addInitScript((pubkey) => {
        localStorage.setItem("nostr-accounts", JSON.stringify([{ pubkeyHex: pubkey, type: "nip07", addedAt: 1 }]));
        localStorage.setItem("nostr-active-account", pubkey);
        Reflect.set(window, "nostr", { getPublicKey: async () => pubkey, signEvent: async (event: unknown) => {
            const response = await fetch(new URL("__fixture-sign", location.href), {
                method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(event),
            });
            if (!response.ok) throw new Error("Fixture signer failed");
            return response.json();
        } });
        const fetchLocal = window.fetch.bind(window);
        window.fetch = (input, init) => {
            const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url, location.href);
            if (!["127.0.0.1", "localhost"].includes(url.hostname)) return Promise.reject(new Error("External fixture fetch disabled"));
            return fetchLocal(input, init);
        };
    }, pubkey);
    if (withServiceWorker) await control(page, f);
    await page.goto(f.url);
    const start = page.getByRole("button", { name: "はじめる" });
    await start.click(); await expect(start).toBeHidden();
    await page.evaluate(async ({ server, pubkey }) => {
        const database = await new Promise<IDBDatabase>((done, reject) => {
            const request = indexedDB.open("eHagakiDB"); request.onsuccess = () => done(request.result); request.onerror = () => reject(request.error);
        });
        const transaction = database.transaction("uploadDestinations", "readwrite");
        const store = transaction.objectStore("uploadDestinations"); store.clear();
        store.put({ id: "fixture", scopeKey: pubkey, pubkeyHex: pubkey, name: "Fixture media", protocol: "blossom", serverUrl: server,
            presetId: "custom", isDefault: true, enabled: false, sortIndex: 0, createdAt: 1, updatedAt: 1, schemaVersion: 1, auth: { type: "blossom-bud11" },
            capabilities: { maxUploadSize: null, supportedMimeTypes: [], supportsDelete: false, supportsList: false, supportsMirror: false, supportsMediaOptimization: false, authRequired: true, source: "preset" } });
        await new Promise<void>((done, reject) => { transaction.oncomplete = () => done(); transaction.onerror = () => reject(transaction.error); });
        database.close();
    }, { server: f.mediaOrigin, pubkey });
    await page.reload();
    await page.getByRole("button", { name: "履歴", exact: true }).click();
    const dialog = page.getByRole("dialog", { name: "履歴", exact: true });
    await dialog.getByRole("tab", { name: "メディア", exact: true }).click();
    await dialog.getByRole("combobox").selectOption("fixture");
    return { dialog, signedLists: () => signedLists, requests: () => [...f.counts]
        .filter(([url]) => url.startsWith("GET /list/" + pubkey)).reduce((sum, [, count]) => sum + count, 0) };
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
    test(`${base} media feedback floats without shifting the list`, async ({ page }, testInfo) => {
        const f = await fixture(base, "paged");
        try {
            const { dialog } = await openPaginationMedia(page, f);
            const list = dialog.locator(".media-list");
            const refresh = dialog.getByRole("button", { name: "一覧を更新", exact: true });
            const notice = page.locator(".floating-message").filter({ hasText: "このサーバーから削除しました。" });
            await expect(dialog.locator("article")).toHaveCount(24);
            for (const width of [360, 320, 1100]) {
                await page.setViewportSize({ width, height: 800 });
                const colorScheme = width === 360 ? "dark" : "light";
                await page.emulateMedia({ colorScheme, reducedMotion: width === 320 ? "reduce" : "no-preference" });
                await expect.poll(() => page.locator("html").evaluate(node => getComputedStyle(node).colorScheme)).toBe(colorScheme);
                const top = await list.evaluate(node => node.getBoundingClientRect().top);
                f.holdList();
                await refresh.click();
                const loading = page.locator(".floating-message .loader-container");
                await expect(loading).toBeVisible();
                expect(await list.evaluate(node => node.getBoundingClientRect().top)).toBeCloseTo(top, 0);
                f.releaseList();
                await expect(loading).toHaveCount(0);
                await expect(refresh).toBeEnabled();
                f.setListError(503);
                await refresh.click();
                const alert = page.locator(".floating-message[role=alert]");
                await expect(alert).toContainText("サーバーで処理に失敗しました。");
                await expect(alert).toBeVisible();
                expect(await list.evaluate(node => node.getBoundingClientRect().top)).toBeCloseTo(top, 0);
                expect(await alert.evaluate(node => ({ position: getComputedStyle(node).position,
                    pointerEvents: getComputedStyle(node).pointerEvents, left: node.getBoundingClientRect().left,
                    right: node.getBoundingClientRect().right })))
                    .toMatchObject({ position: "fixed", pointerEvents: "none" });
                const bounds = await alert.boundingBox();
                expect(bounds!.x).toBeGreaterThanOrEqual(0);
                expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
                f.setListError(0);
                await refresh.click();
                await expect(refresh).toBeEnabled();
                await expect(alert).toHaveCount(0);
                await dialog.locator("article").first().getByRole("button", { name: "削除", exact: true }).click();
                await page.getByRole("alertdialog").getByRole("button", { name: "削除", exact: true }).click();
                await expect(page.getByRole("alertdialog")).toBeHidden();
                await expect(notice).toBeVisible();
                expect(await list.evaluate(node => node.getBoundingClientRect().top)).toBeCloseTo(top, 0);
                await expect(dialog.getByText("このサーバーから削除しました。", { exact: true })).toHaveCount(0);
                if (width === 360) {
                    await page.screenshot({ path: testInfo.outputPath("media-feedback-360.png") });
                    await dialog.getByRole("tab", { name: "ポスト", exact: true }).click();
                    await expect(notice).toHaveCount(0);
                    await dialog.getByRole("tab", { name: "メディア", exact: true }).click();
                    await expect(notice).toHaveCount(0);
                } else {
                    await expect(notice).toHaveCount(0, { timeout: 5000 });
                    expect(await list.evaluate(node => node.getBoundingClientRect().top)).toBeCloseTo(top, 0);
                }
            }
            await page.goto(f.url + "monitor.html");
            await page.evaluate(url => {
                const frame = document.createElement("iframe"); frame.src = url;
                frame.style.cssText = "width:320px;height:720px;border:0";
                document.querySelector("main")!.append(frame);
            }, f.url);
            const frame = page.frameLocator("iframe");
            await expect(frame.locator(".settings-btn")).toBeVisible();
            const start = frame.getByRole("button", { name: "はじめる" });
            if (await start.isVisible()) await start.click();
            await frame.getByRole("button", { name: "履歴", exact: true }).click();
            const embedded = frame.getByRole("dialog", { name: "履歴", exact: true });
            await embedded.getByRole("tab", { name: "メディア", exact: true }).click();
            await embedded.getByRole("combobox").selectOption("fixture");
            await expect(embedded.locator("article")).toHaveCount(24);
            const top = await embedded.locator(".media-list").evaluate(node => node.getBoundingClientRect().top);
            await embedded.locator("article").first().getByRole("button", { name: "削除", exact: true }).click();
            await frame.getByRole("alertdialog").getByRole("button", { name: "削除", exact: true }).click();
            await expect(frame.getByRole("alertdialog")).toBeHidden();
            const embeddedNotice = frame.locator(".floating-message").filter({ hasText: "このサーバーから削除しました。" });
            await expect(embeddedNotice).toBeVisible();
            expect(await embedded.locator(".media-list").evaluate(node => node.getBoundingClientRect().top)).toBeCloseTo(top, 0);
            const bounds = await embeddedNotice.evaluate(node => ({ left: node.getBoundingClientRect().left,
                right: node.getBoundingClientRect().right }));
            expect(bounds.left).toBeGreaterThanOrEqual(0); expect(bounds.right).toBeLessThanOrEqual(320);
            await page.screenshot({ path: testInfo.outputPath("media-feedback-iframe-320.png") });
        } finally { await f.close(); }
    });
    for (const end of ["empty", "repeated"] as const) {
        test(`${base} media pagination ends without an error on an ${end} final response`, async ({ page }) => {
            const f = await fixture(base);
            if (end === "repeated") f.repeatLastPage();
            try {
                const { dialog, requests, signedLists } = await openPaginationMedia(page, f);
                const more = dialog.getByRole("button", { name: "さらに読み込む", exact: true });
                await expect(dialog.locator("article")).toHaveCount(3);
                await more.click();
                await expect(more).toHaveCount(0);
                await expect(page.getByRole("alert")).toHaveCount(0);
                await expect(dialog.locator("article")).toHaveCount(3);
                expect(requests()).toBe(2); expect(signedLists()).toBe(2);
                await dialog.getByRole("button", { name: "一覧を更新", exact: true }).click();
                await expect(more).toBeVisible();
                expect(requests()).toBe(3); expect(signedLists()).toBe(3);
            } finally { await f.close(); }
        });
    }
    for (const mode of ["paged", "snapshot"] as const) {
        test(`${base} media pagination: ${mode}, 231 items, refresh, tabs and deletion`, async ({ page }) => {
            // The paged case signs 15 listings plus DELETE and caches 231 real
            // previews. Bound each request separately and allow for the whole flow.
            test.setTimeout(180_000);
            const f = await fixture(base, mode);
            let listingActions = 0;
            let requestCount = () => 0;
            let signatureCount = () => 0;
            try {
                const { dialog, requests, signedLists } = await openPaginationMedia(page, f);
                requestCount = requests;
                signatureCount = signedLists;
                const more = dialog.getByRole("button", { name: "さらに読み込む", exact: true });
                const listingAction = async (action: () => Promise<unknown>) => {
                    listingActions++;
                    const response = page.waitForResponse(response => response.request().method() === 'GET'
                        && response.url().startsWith(f.mediaOrigin + '/list/'), { timeout: 30_000 });
                    await Promise.all([response, action()]);
                    // A response can arrive before loadPage's finally clears
                    // loading; start the next action only after that UI commit.
                    await expect(dialog.locator('.media-refresh-button')).toBeEnabled();
                };
                const loadMore = () => mode === 'paged' ? listingAction(() => more.click()) : more.click();
                await expect(dialog.locator("article")).toHaveCount(24);
                expect(requests()).toBe(1); expect(signedLists()).toBe(1);
                for (const count of [48, 72, 96, 120, 144, 168, 192, 216, 231]) {
                    await loadMore(); await expect(dialog.locator("article")).toHaveCount(count);
                }
                if (mode === "paged") await loadMore(); // Preserve the short-page cursor until an empty response.
                await expect(more).toHaveCount(0);
                const total = mode === "paged" ? 11 : 1;
                expect(requests()).toBe(total); expect(signedLists()).toBe(total);
                const refresh = dialog.getByRole("button", { name: "一覧を更新", exact: true });
                await listingAction(() => refresh.click()); await expect(dialog.locator("article")).toHaveCount(24);
                await loadMore(); await expect(dialog.locator("article")).toHaveCount(48);
                const beforeTabs = requests();
                await dialog.getByRole("tab", { name: "ポスト", exact: true }).click();
                await dialog.getByRole("tab", { name: "メディア", exact: true }).click();
                await expect(dialog.locator("article")).toHaveCount(48);
                expect(requests()).toBe(beforeTabs);
                await dialog.locator("article").first().getByRole("button", { name: "削除", exact: true }).click();
                await listingAction(() => page.getByRole("alertdialog").getByRole("button", { name: "削除", exact: true }).click());
                await expect(dialog.locator("article")).toHaveCount(24);
                await expect(more).toBeVisible();
                expect(f.counts.get("DELETE /" + imageHash)).toBe(1);
                expect(requests()).toBe(beforeTabs + 1);
                await expect(page.locator(".floating-message").filter({ hasText: "このサーバーから削除しました。" })).toBeVisible();
                await expect(dialog.locator("article").first().locator("img")).not.toHaveAttribute("src", new RegExp(imageHash));
                await loadMore(); await expect(dialog.locator("article")).toHaveCount(48);
                expect(requests()).toBe(beforeTabs + (mode === "paged" ? 2 : 1));
                expect(signedLists()).toBe(requests());
            } catch (error) {
                console.log('CI_METRICS ' + JSON.stringify({ testLine: test.info().line,
                    mediaListingActions: listingActions, mediaListingRequests: requestCount(), mediaListingSignatures: signatureCount() }));
                throw error;
            } finally { await f.close(); }
        });
    }
    for (const withServiceWorker of [true, false]) {
        test(`${base} media deletion ${withServiceWorker ? "with" : "without"} a Service Worker refreshes the list`, async ({ browser }) => {
            const f = await fixture(base);
            const context = await browser.newContext({ serviceWorkers: withServiceWorker ? "allow" : "block",
                locale: "ja-JP", viewport: { width: 360, height: 800 } });
            const page = await context.newPage();
            try {
                const { dialog, requests } = await openPaginationMedia(page, f, withServiceWorker);
                expect(await page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(withServiceWorker);
                await expect(dialog.locator("article")).toHaveCount(3);
                if (withServiceWorker) await expect.poll(() => keys(page)).toContain(f.remote());
                const beforeDelete = requests();
                await dialog.locator('article[data-media-kind="image"]').getByRole("button", { name: "削除", exact: true }).click();
                await page.getByRole("alertdialog").getByRole("button", { name: "削除", exact: true }).click();
                await expect(page.getByRole("alertdialog")).toBeHidden();
                await expect(dialog.locator('article[data-media-kind="image"]')).toHaveCount(0);
                await expect(page.locator(".floating-message").filter({ hasText: "このサーバーから削除しました。" })).toBeVisible();
                expect(requests()).toBe(beforeDelete + 1);
                await expect(page.locator(".floating-message").filter({ hasText: "local画像キャッシュの清掃に失敗しました" })).toHaveCount(0);
                expect(f.counts.get("DELETE /" + imageHash)).toBe(1);
                if (withServiceWorker) {
                    expect(await keys(page)).not.toContain(f.remote());
                    expect(await keys(page, metaName)).not.toContain(f.remote());
                }
            } finally { await context.close(); await f.close(); }
        });
    }
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
    test(`${base} history media UI: lazy video, confirmation, responsive layout, focus and back`, async ({ page, context }, testInfo) => {
        const f = await fixture(base), key = generateSecretKey(), pubkey = getPublicKey(key);
        try {
            await page.addInitScript(() => {
                Object.defineProperty(navigator, "clipboard", { configurable: true, value: {
                    writeText: async (text: string) => { Reflect.set(window, "__COPIED_MEDIA_URL__", text); },
                } });
            });
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
            await page.reload();
            const entry = page.getByRole("button", { name: "履歴", exact: true });
            await entry.focus(); await page.keyboard.press("Enter");
            const dialog = page.getByRole("dialog", { name: "履歴", exact: true });
            await dialog.getByRole("tab", { name: "メディア", exact: true }).click();
            const footerClose = dialog.getByRole("button", { name: "閉じる", exact: true });
            await expect(footerClose).toHaveText("");
            await expect(footerClose.locator(".svg-icon")).toBeVisible();
            await dialog.getByRole("combobox").selectOption("fixture");
            await expect(dialog.locator("article")).toHaveCount(3);
            await expect(dialog.locator("img")).toBeVisible();
            const imageCopy = dialog.locator('article[data-media-kind="image"]').getByRole("button", { name: "URLをコピー", exact: true });
            await imageCopy.focus();
            await page.keyboard.press("Enter");
            await expect.poll(() => page.evaluate(() => Reflect.get(window, "__COPIED_MEDIA_URL__"))).toBe(f.remote());
            await expect(page.locator(".ehagaki-pswp")).toHaveCount(0);
            await expect(dialog.locator("video")).toHaveCount(0);
            await expect(page.getByRole("status").filter({ hasText: "URLをコピーしました" })).toBeVisible();
            const copyIconUrl = await imageCopy.locator(".svg-icon").evaluate((node) => getComputedStyle(node).maskImage);
            expect(copyIconUrl).toContain(base + "icons/file_copy_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
            expect((await page.request.get(f.url + "icons/file_copy_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg")).ok()).toBe(true);
            const openImage = dialog.getByRole("button", { name: "画像を開く", exact: true });
            await openImage.click();
            const viewer = page.locator(".ehagaki-pswp");
            await expect(viewer).toBeVisible();
            await page.keyboard.press("Escape");
            await expect(viewer).toHaveCount(0);
            await expect(dialog).toBeVisible();
            await expect(openImage).toBeFocused();
            await expect(page.getByRole("status").filter({ hasText: "URLをコピーしました" })).toHaveCount(0);
            await expect(dialog.locator("time")).toHaveAttribute("datetime", "1970-01-01T00:02:03.000Z");
            await expect(dialog.locator("article").first()).toContainText(`${svg.length} B`);
            await expect(dialog.locator(".server-url")).toHaveCount(0);
            await expect(dialog.locator("article").first()).not.toContainText("アップロード日時");
            await expect(dialog.locator("article").first()).not.toContainText("blossom");
            await expect(dialog.locator("article").first()).not.toContainText(f.mediaOrigin);
            await expect.poll(() => keys(page)).toContain(f.remote());
            expect([...f.counts.keys()].some((url) => url.startsWith("GET /" + videoHash))).toBe(false);
            for (const colorScheme of ["light", "dark"] as const) {
                await page.emulateMedia({ colorScheme });
                await expect.poll(() => page.locator("html").evaluate((node) => getComputedStyle(node).colorScheme)).toBe(colorScheme);
                const colors = await dialog.evaluate((node) => ({
                    media: getComputedStyle(node.querySelector(".uploaded-media-content")!).backgroundColor,
                    settings: getComputedStyle(node).backgroundColor,
                }));
                expect(colors.media).toBe(colors.settings);
                expect(colors.media).not.toBe("rgba(0, 0, 0, 0)");
                await page.screenshot({ path: testInfo.outputPath(`media-background-${colorScheme}-360.png`) });
            }
            await page.emulateMedia({ colorScheme: "light" });
            for (const width of [360, 320, 1100]) {
                await page.setViewportSize({ width, height: 850 });
                expect(await dialog.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
                await expect(dialog.getByRole("button", { name: "一覧を更新" })).toBeVisible();
                const layout = await dialog.evaluate((node) => {
                    const tiles = [...node.querySelectorAll("article")].map((tile) => tile.getBoundingClientRect());
                    const image = node.querySelector("img")!.getBoundingClientRect();
                    const metadata = node.querySelector(".media-metadata")!.getBoundingClientRect();
                    const remove = node.querySelector(".media-delete-button")!.getBoundingClientRect();
                    const copy = node.querySelector(".media-copy-button")!.getBoundingClientRect();
                    return {
                        tileWidth: tiles[0].width, contentWidth: node.querySelector(".dialog-content")!.clientWidth,
                        sameRow: Math.abs(tiles[0].top - tiles[1].top) < 1,
                        columnGap: tiles[1].left - tiles[0].right,
                        rowGap: tiles[2].top - tiles[0].bottom,
                        imageFillsTile: Math.abs(image.width - tiles[0].width) < 1 && Math.abs(image.height - tiles[0].height) < 1,
                        metadataOverImage: metadata.top >= image.top && metadata.bottom <= image.bottom && metadata.right <= remove.left,
                        deleteOverBottomRight: remove.top >= image.top && Math.abs(remove.bottom - image.bottom) <= 4.5 && Math.abs(remove.right - image.right) <= 4.5,
                        copyOverTopRight: Math.abs(copy.top - image.top - 4) < 0.5 && Math.abs(copy.right - image.right + 4) < 0.5,
                    };
                });
                expect(layout.tileWidth).toBeCloseTo((layout.contentWidth - 2) / 2, 0);
                expect(layout.columnGap).toBeCloseTo(2, 0);
                expect(layout.rowGap).toBeCloseTo(2, 0);
                expect(layout).toMatchObject({ sameRow: true,
                    imageFillsTile: true, metadataOverImage: true, deleteOverBottomRight: true, copyOverTopRight: true });
                const deletionTargets = await dialog.locator("article .media-delete-button").evaluateAll((nodes) =>
                    nodes.map((node) => { const rect = node.getBoundingClientRect(); return { width: rect.width, height: rect.height }; }));
                expect(deletionTargets).toEqual(Array(3).fill({ width: 44, height: 44 }));
                expect(await dialog.locator("article .media-copy-button").evaluateAll((nodes) =>
                    nodes.map((node) => { const rect = node.getBoundingClientRect(); return { width: rect.width, height: rect.height }; })))
                    .toEqual(Array(3).fill({ width: 44, height: 44 }));
                const more = dialog.getByRole("button", { name: "さらに読み込む", exact: true });
                await more.scrollIntoViewIfNeeded();
                await expect(more).toBeVisible();
                expect(await dialog.evaluate((node) => {
                    const list = node.querySelector(".media-list")!, tail = node.querySelector(".list-end-actions")!;
                    return tail.getBoundingClientRect().top >= list.getBoundingClientRect().bottom;
                })).toBe(true);
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
            for (const width of [360, 320, 1100]) {
                await page.setViewportSize({ width, height: 800 });
                expect(await video.evaluate((node) => {
                    const tile = node.closest("article")!, playback = node.getBoundingClientRect();
                    const remove = tile.querySelector(".media-delete-button")!.getBoundingClientRect();
                    const close = tile.querySelector(".video-close")!.getBoundingClientRect();
                    const copy = tile.querySelector(".media-copy-button")!.getBoundingClientRect();
                    const imageTile = document.querySelector('article[data-media-kind="image"]')!;
                    const image = imageTile.querySelector("img")!.getBoundingClientRect();
                    const imageRemove = imageTile.querySelector(".media-delete-button")!.getBoundingClientRect();
                    return playback.height >= 204 && Math.abs(playback.top + 4 - close.top) < 0.5
                        && Math.abs(close.right - copy.right) < 0.5 && Math.abs(copy.top - close.bottom - 4) < 0.5
                        && remove.top >= copy.bottom + 3.5 && remove.bottom <= playback.bottom - 56
                        && Math.abs(imageRemove.bottom - image.bottom + 4) < 0.5;
                })).toBe(true);
                const videoCopy = dialog.locator("article.video-active .media-copy-button");
                await videoCopy.click();
                await expect.poll(() => page.evaluate(() => Reflect.get(window, "__COPIED_MEDIA_URL__")))
                    .toBe(await video.getAttribute("src"));
                await expect(video).toHaveCount(1);
                expect(await dialog.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
                await expect(page.getByRole("status").filter({ hasText: "URLをコピーしました" })).toHaveCount(0);
                await video.scrollIntoViewIfNeeded();
                await page.screenshot({ path: testInfo.outputPath(`uploaded-media-video-${width}.png`) });
            }
            await page.setViewportSize({ width: 360, height: 800 });
            await video.scrollIntoViewIfNeeded();
            await page.screenshot({ path: testInfo.outputPath("uploaded-media-video-360.png") });
            const released = await video.elementHandle();
            await expect(video).toHaveAttribute("src", new RegExp(videoHash));
            await dialog.locator('article[data-media-kind="video"]').nth(1).getByRole("button", { name: "動画を開く" }).click();
            await expect(video).toHaveCount(1);
            expect(await released!.evaluate((node: HTMLVideoElement) => node.paused && !node.hasAttribute("src"))).toBe(true);
            await expect(video).toHaveAttribute("src", new RegExp(secondVideoHash));
            await dialog.getByRole("button", { name: "動画を閉じる" }).click({ timeout: 5000 });
            await expect(video).toHaveCount(0);
            expect((await keys(page)).some((url) => url.includes(videoHash))).toBe(false);
            await dialog.getByRole("button", { name: "動画を開く" }).first().click();
            const suspendedVideo = await video.elementHandle();
            const listRequests = () => [...f.counts].filter(([url]) => url.startsWith("GET /list/" + pubkey))
                .reduce((total, [, count]) => total + count, 0);
            const listsBeforeSuspend = listRequests();
            expect(listsBeforeSuspend).toBeGreaterThan(0);
            await dialog.getByRole("tab", { name: "ポスト", exact: true }).click();
            await expect(dialog.locator(".media-management")).toHaveCount(0);
            expect(await suspendedVideo!.evaluate((node: HTMLVideoElement) => node.paused && !node.hasAttribute("src"))).toBe(true);
            await dialog.getByRole("tab", { name: "メディア", exact: true }).click();
            await expect(dialog.locator("article")).toHaveCount(3);
            await expect(video).toHaveCount(0);
            expect(listRequests()).toBe(listsBeforeSuspend);
            const remove = dialog.locator('article[data-media-kind="image"]').getByRole("button", { name: "削除" });
            await expect(remove).toHaveText("");
            const iconUrl = await remove.locator(".media-delete-icon").evaluate((node) => getComputedStyle(node).maskImage);
            expect(iconUrl).toContain(base + "icons/delete_forever_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
            const iconResponse = await page.request.get(f.url + "icons/delete_forever_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
            expect(iconResponse.ok()).toBe(true);
            await remove.click();
            const confirm = page.getByRole("alertdialog");
            await expect(confirm).toContainText(f.mediaOrigin);
            await confirm.getByRole("button", { name: "キャンセル" }).click();
            await expect(remove).toBeFocused(); expect(f.counts.get("DELETE /" + imageHash)).toBeUndefined();
            f.holdDelete();
            await remove.click(); await confirm.getByRole("button", { name: "削除" }).click();
            await expect.poll(() => f.counts.get("DELETE /" + imageHash)).toBe(1);
            await expect(dialog.getByRole("tab", { name: "ポスト", exact: true })).toBeDisabled();
            await expect(footerClose).toBeDisabled();
            await expect(dialog.getByRole("combobox")).toBeDisabled();
            await page.keyboard.press("Escape"); await expect(confirm).toBeVisible();
            await page.goBack(); await expect(confirm).toBeVisible(); await expect(dialog).toBeVisible();
            f.releaseDelete();
            await expect(confirm).toBeHidden();
            await expect(dialog.locator("article")).toHaveCount(2);
            await expect.poll(() => keys(page)).not.toContain(f.remote());
            await expect(page.locator(".floating-message").filter({ hasText: "このサーバーから削除しました。" })).toBeVisible();
            expect(f.counts.get("DELETE /" + imageHash)).toBe(1);
            await page.screenshot({ path: testInfo.outputPath("uploaded-media-360.png") });
            await page.evaluate(() => history.back());
            await expect(dialog).toBeHidden(); await expect(entry).toBeFocused();
            await expect(page.locator(".settings-dialog")).toHaveCount(0);
            await context.setOffline(true);
            await entry.click(); await expect(dialog).toBeVisible(); await context.setOffline(false);
            await footerClose.click(); await expect(dialog).toBeHidden(); await expect(entry).toBeFocused();
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
            await frame.getByRole("button", { name: "履歴", exact: true }).click();
            const embeddedDialog = frame.getByRole("dialog", { name: "履歴", exact: true });
            await embeddedDialog.getByRole("tab", { name: "メディア", exact: true }).click();
            await embeddedDialog.getByRole("combobox").selectOption("fixture");
            await expect(embeddedDialog.locator("article")).toHaveCount(2);
            expect(await embeddedDialog.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
            expect(await embeddedDialog.locator("article").evaluateAll((nodes) => {
                const first = nodes[0].getBoundingClientRect(), second = nodes[1].getBoundingClientRect();
                return Math.abs(first.top - second.top) < 1 && Math.abs(second.left - first.right - 2) < 0.5;
            })).toBe(true);
            await expect(embeddedDialog.getByRole("button", { name: "動画を開く" }).first()).toBeVisible();
            await embeddedDialog.getByRole("button", { name: "動画を開く" }).first().click();
            const embeddedVideo = embeddedDialog.locator("video");
            expect(await embeddedVideo.evaluate((node) => {
                const tile = node.closest("article")!;
                const close = tile.querySelector(".video-close")!.getBoundingClientRect();
                const copy = tile.querySelector(".media-copy-button")!.getBoundingClientRect();
                const remove = tile.querySelector(".media-delete-button")!.getBoundingClientRect();
                return node.getBoundingClientRect().height >= 204 && copy.top >= close.bottom + 4 && remove.top >= copy.bottom + 4;
            })).toBe(true);
            await embeddedDialog.locator("article.video-active .media-copy-button").click();
            await expect(embeddedVideo).toHaveCount(1);
            await embeddedDialog.getByRole("button", { name: "動画を閉じる" }).click();
            await expect(embeddedVideo).toHaveCount(0);
            await expect(frame.getByRole("status").filter({ hasText: "URLをコピーしました" })).toHaveCount(0);
            await page.screenshot({ path: testInfo.outputPath("uploaded-media-iframe-320.png") });
        } finally { await f.close(); }
    });
}
