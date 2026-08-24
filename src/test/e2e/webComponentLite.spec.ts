import { test, expect } from "@playwright/test";
import { createServer, type Server } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { finalizeEvent, generateSecretKey, nip19 } from "nostr-tools";
import { ensureWebComponentE2EOutput } from "../../../scripts/ensureWebComponentE2EOutput.mjs";

let componentServer: Server;
let hostServer: Server;
let componentOrigin = "";
let hostOrigin = "";

function listen(server: Server): Promise<number> {
    return new Promise((resolve) => server.listen(0, "127.0.0.1", () => {
        const address = server.address();
        resolve(typeof address === "object" && address ? address.port : 0);
    }));
}

function close(server: Server): Promise<void> {
    return new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}

function contentType(filePath: string): string {
    if (extname(filePath) === ".js") return "text/javascript";
    if (extname(filePath) === ".svg") return "image/svg+xml";
    return "application/octet-stream";
}

test.beforeAll(async () => {
    test.setTimeout(180_000);
    await ensureWebComponentE2EOutput();
    componentServer = createServer(async (request, response) => {
        const pathname = new URL(request.url ?? "/", componentOrigin).pathname;
        const filePath = normalize(join(process.cwd(), "dist-web-component", pathname === "/" ? "ehagaki-composer.js" : pathname.slice(1)));
        if (!filePath.startsWith(normalize(join(process.cwd(), "dist-web-component")))) {
            response.writeHead(400).end();
            return;
        }
        try {
            const body = await readFile(filePath);
            response.writeHead(200, { "Access-Control-Allow-Origin": "*", "Content-Type": contentType(filePath), "Cache-Control": "no-store" }).end(body);
        } catch {
            response.writeHead(404).end();
        }
    });
    componentOrigin = `http://127.0.0.1:${await listen(componentServer)}`;
    hostServer = createServer((_request, response) => response.writeHead(200, { "Content-Type": "text/html" }).end("<!doctype html><body></body>"));
    hostOrigin = `http://127.0.0.1:${await listen(hostServer)}`;
});

test.afterAll(async () => {
    await Promise.all([close(componentServer), close(hostServer)]);
});

async function mountHostOwned(page: import("@playwright/test").Page, distribution: "full" | "lite") {
    return await page.evaluate(async ({ componentOrigin, distribution }) => {
        const suffix = distribution === "lite" ? "/host-owned" : "";
        await import(`${componentOrigin}${suffix}/ehagaki-composer.js`);
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            assetBase: string;
            configureHostOwned(options: unknown): void;
            whenReady(): Promise<void>;
            setContext(value: unknown): Promise<void>;
            setSettings(value: unknown): Promise<unknown>;
            setCustomEmojis(value: unknown): Promise<void>;
        };
        composer.assetBase = `${componentOrigin}${suffix}/`;
        const events: string[] = [];
        for (const name of ["ehagaki-ready", "ehagaki-post-success", "ehagaki-post-error", "ehagaki-initialization-error"]) {
            composer.addEventListener(name, () => events.push(name));
        }
        const submitted: unknown[] = [];
        composer.configureHostOwned({
            submit: (output: unknown) => { submitted.push(output); return { eventId: "a".repeat(64) }; },
            uploadMedia: (file: File) => ({ url: `https://example.invalid/${file.name}` }),
        });
        document.body.append(composer);
        await composer.whenReady();
        await composer.setSettings({ mediaFreePlacement: true, imageQualityLevel: "low", videoQualityLevel: "low" });
        await composer.setCustomEmojis([{ shortcode: "wave", url: "https://example.invalid/wave.webp" }]);
        await composer.setContext({ content: "#lite", reply: "note1zyg3zyg3zyg3zyg3zyg3zyg3zyg3zyg3zyg3zyg3zyg3zyg3zygsglnzgl", quotes: [] });
        return { events, assetBase: composer.assetBase };
    }, { componentOrigin, distribution });
}

test("Lite requires pre-connect Host-owned configuration without making assetBase a hard error", async ({ page }) => {
    await page.goto(hostOrigin);
    const result = await page.evaluate(async ({ componentOrigin }) => {
        await import(`${componentOrigin}/host-owned/ehagaki-composer.js`);
        const composer = document.createElement("ehagaki-composer") as HTMLElement & { whenReady(): Promise<void> };
        const events: string[] = [];
        composer.addEventListener("ehagaki-initialization-error", () => events.push("error"));
        document.body.append(composer);
        const rejected = await composer.whenReady().then(() => false, () => true);
        return { rejected, events };
    }, { componentOrigin });
    expect(result).toEqual({ rejected: true, events: ["error"] });
});

test("full Host-owned and Lite Host-owned keep the public lifecycle and explicit distribution asset base", async ({ page }) => {
    await page.goto(hostOrigin);
    const full = await mountHostOwned(page, "full");
    expect(full.events).toContain("ehagaki-ready");
    expect(full.assetBase).toBe(`${componentOrigin}/`);
    // A distribution choice is document-scoped. Use a fresh document for Lite.
    await page.goto(hostOrigin);
    const lite = await mountHostOwned(page, "lite");
    expect(lite.events).toContain("ehagaki-ready");
    expect(lite.assetBase).toBe(`${componentOrigin}/host-owned/`);
});

test("Lite keeps the Host-owned public contract across context, submission, media, and reconnect", async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto(hostOrigin);
    const replyEvent = finalizeEvent({ kind: 1, content: "preloaded Lite reply", tags: [], created_at: 1 }, generateSecretKey());
    const quoteEvent = finalizeEvent({ kind: 1, content: "preloaded Lite quote", tags: [], created_at: 2 }, generateSecretKey());
    const reply = nip19.noteEncode(replyEvent.id);
    const quote = nip19.noteEncode(quoteEvent.id);
    await page.evaluate(async ({ componentOrigin, reply, quote, replyEvent, quoteEvent }) => {
        await import(`${componentOrigin}/host-owned/ehagaki-composer.js`);
        const state = { outputs: [] as any[], uploads: 0, events: [] as string[] };
        (window as any).__liteContractState = state;
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            assetBase: string;
            configureHostOwned(value: unknown): void;
            whenReady(): Promise<void>;
            setContext(value: unknown): Promise<void>;
            setSettings(value: unknown): Promise<unknown>;
            setCustomEmojis(value: unknown): Promise<void>;
        };
        composer.assetBase = `${componentOrigin}/host-owned/`;
        composer.style.width = "360px";
        composer.style.height = "640px";
        composer.configureHostOwned({
            submit(output: unknown) {
                state.outputs.push(JSON.parse(JSON.stringify(output)));
                return { eventId: "c".repeat(64) };
            },
            uploadMedia(file: File) {
                state.uploads += 1;
                return { url: `https://host.example/${file.name}`, imeta: { m: file.type, size: String(file.size) } };
            },
        });
        for (const name of ["ehagaki-ready", "ehagaki-post-success", "ehagaki-post-error", "ehagaki-composer-context-updated"]) {
            composer.addEventListener(name, () => state.events.push(name));
        }
        const context = composer.setContext({
            content: "Lite seeded #context",
            reply,
            quotes: [quote],
            preloadedEvents: { [replyEvent.id]: replyEvent, [quoteEvent.id]: quoteEvent },
        });
        document.body.append(composer);
        await composer.whenReady();
        await context;
        await composer.setSettings({ mediaFreePlacement: true, imageCompressionLevel: "none", videoCompressionLevel: "none" });
        await composer.setCustomEmojis([{ shortcode: "wave", url: "https://example.invalid/wave.webp" }]);
    }, { componentOrigin, reply, quote, replyEvent, quoteEvent });

    const composer = page.locator("ehagaki-composer");
    await expect(composer.locator(".tiptap-editor")).toContainText("Lite seeded #context");
    await composer.locator(".tiptap-editor").click();
    await composer.locator(".tiptap-editor").pressSequentially(" body #LiteTag ");
    await composer.locator(".button-group-right button").nth(0).click();
    await composer.locator("#content-warning-reason-input").fill("Lite CW");
    await composer.locator(".custom-emoji-button").click();
    await composer.locator(".emoji-button[aria-label=':wave:']").click();
    await composer.locator('input[type="file"]').setInputFiles({
        name: "lite-media.png",
        mimeType: "image/png",
        buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64"),
    });
    await expect.poll(() => page.evaluate(() => (window as any).__liteContractState.uploads)).toBe(1);
    await composer.locator("button.post-button").click();
    await expect.poll(() => page.evaluate(() => (window as any).__liteContractState.outputs.length)).toBe(1);

    const result = await page.evaluate(async () => {
        const state = (window as any).__liteContractState;
        const current = document.querySelector("ehagaki-composer") as HTMLElement & { whenReady(): Promise<void> };
        current.remove();
        document.body.append(current);
        await current.whenReady();
        return state;
    });
    expect(result.events).toEqual(expect.arrayContaining([
        "ehagaki-ready",
        "ehagaki-composer-context-updated",
        "ehagaki-post-success",
    ]));
    expect(result.outputs[0]).toMatchObject({
        content: expect.stringContaining("#LiteTag"),
        context: {
            reply: { eventId: replyEvent.id },
            quotes: [{ eventId: quoteEvent.id }],
        },
    });
    expect(result.outputs[0].tags).toEqual(expect.arrayContaining([
        ["t", "litetag"],
        ["content-warning", "Lite CW"],
        ["emoji", "wave", "https://example.invalid/wave.webp"],
    ]));
});

test("Lite rejects a full/Lite dual import deterministically", async ({ page }) => {
    await page.goto(hostOrigin);
    const result = await page.evaluate(async ({ componentOrigin }) => {
        await import(`${componentOrigin}/ehagaki-composer.js`);
        return await import(`${componentOrigin}/host-owned/ehagaki-composer.js`).then(
            () => "resolved",
            (error) => String(error.message),
        );
    }, { componentOrigin });
    expect(result).toContain("Cannot import the host-owned-lite");
});

test("Lite Resource Timing keeps initial media code lazy and resolves every capability from its own distribution", async ({ page, browserName, isMobile }) => {
    test.skip(browserName !== "chromium" || isMobile, "The controlled native-AAC-unavailable path requires desktop Chromium WebCodecs.");
    test.setTimeout(90_000);
    await page.goto(hostOrigin);
    await mountHostOwned(page, "lite");
    const initial = await page.evaluate(() => performance.getEntriesByType("resource").map((entry) => entry.name));
    for (const capability of ["HostOwnedCustomEmojiPicker-", "browser-image-compression-", "mediabunnyCompression-", "mediabunny-aac-encoder-"]) {
        expect(initial.some((url) => url.includes(capability))).toBe(false);
    }
    await page.locator("ehagaki-composer").evaluate((element) => {
        const button = element.shadowRoot?.querySelector<HTMLButtonElement>(".custom-emoji-button");
        button?.click();
    });
    await expect.poll(() => page.evaluate(() => performance.getEntriesByType("resource").map((entry) => entry.name)))
        .toContainEqual(expect.stringContaining("/host-owned/assets/HostOwnedCustomEmojiPicker-"));
    await page.evaluate(async () => {
        const composer = document.querySelector("ehagaki-composer") as HTMLElement & {
            setSettings(value: unknown): Promise<unknown>;
        };
        await composer.setSettings({ imageCompressionLevel: "low", videoCompressionLevel: "low" });
    });
    await page.locator("ehagaki-composer").locator('input[type="file"]').setInputFiles({
        name: "large-image.png",
        mimeType: "image/png",
        buffer: Buffer.alloc(21 * 1024),
    });
    await expect.poll(() => page.evaluate(() => performance.getEntriesByType("resource").map((entry) => entry.name)))
        .toContainEqual(expect.stringContaining("/host-owned/assets/browser-image-compression-"));
    const imageResources = await page.evaluate(() => performance.getEntriesByType("resource").map((entry) => entry.name));

    // Use a new document for each media boundary so a pending previous handoff
    // and its cache state cannot conceal the next dynamic import.
    await page.goto(hostOrigin);
    await mountHostOwned(page, "lite");
    await page.evaluate(async () => {
        const composer = document.querySelector("ehagaki-composer") as HTMLElement & {
            setSettings(value: unknown): Promise<unknown>;
        };
        await composer.setSettings({ videoCompressionLevel: "low" });
    });
    await page.locator("ehagaki-composer").locator('input[type="file"]').setInputFiles({
        name: "large-video.mp4",
        mimeType: "video/mp4",
        buffer: Buffer.alloc(201 * 1024),
    });
    await expect.poll(() => page.evaluate(() => performance.getEntriesByType("resource").map((entry) => entry.name)))
        .toContainEqual(expect.stringContaining("/host-owned/assets/mediabunnyCompression-"));
    const videoResources = await page.evaluate(() => performance.getEntriesByType("resource").map((entry) => entry.name));

    await page.goto(hostOrigin);
    await mountHostOwned(page, "lite");
    await page.evaluate(async () => {
        const composer = document.querySelector("ehagaki-composer") as HTMLElement & {
            setSettings(value: unknown): Promise<unknown>;
        };
        await composer.setSettings({ videoCompressionLevel: "low" });
    });
    const aacConditionStarted = await page.evaluate(async () => {
        if (!window.MediaRecorder || !("AudioEncoder" in window)) return false;
        const nativeAudioEncoder = (window as any).AudioEncoder;
        class NativeAacUnsupported extends nativeAudioEncoder {
            static isConfigSupported = async (config: unknown) => ({ supported: false, config });
        }
        Object.defineProperty(window, "AudioEncoder", { configurable: true, value: NativeAacUnsupported });

        const canvas = document.createElement("canvas");
        canvas.width = 640;
        canvas.height = 360;
        const context = canvas.getContext("2d")!;
        const audioContext = new AudioContext();
        const destination = audioContext.createMediaStreamDestination();
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        gain.gain.value = 0.001;
        oscillator.connect(gain).connect(destination);
        oscillator.start();
        const stream = new MediaStream([
            ...canvas.captureStream(30).getVideoTracks(),
            ...destination.stream.getAudioTracks(),
        ]);
        const chunks: Blob[] = [];
        const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp8,opus", videoBitsPerSecond: 4_000_000 });
        const stopped = new Promise<void>((resolve) => recorder.addEventListener("stop", () => resolve(), { once: true }));
        recorder.addEventListener("dataavailable", (event) => chunks.push(event.data));
        recorder.start();
        const pixels = context.createImageData(160, 90);
        context.imageSmoothingEnabled = false;
        for (let frame = 0; frame < 90; frame += 1) {
            crypto.getRandomValues(pixels.data);
            context.putImageData(pixels, 0, 0);
            context.drawImage(canvas, 0, 0, 160, 90, 0, 0, 640, 360);
            await new Promise((resolve) => setTimeout(resolve, 30));
        }
        recorder.stop();
        await stopped;
        oscillator.stop();
        await audioContext.close();
        const file = new File(chunks, "aac-fallback.webm", { type: "video/webm" });
        if (file.size <= 200 * 1024) return false;
        const input = document.querySelector("ehagaki-composer")?.shadowRoot?.querySelector<HTMLInputElement>('input[type="file"]');
        if (!input) return false;
        const transfer = new DataTransfer();
        transfer.items.add(file);
        input.files = transfer.files;
        input.dispatchEvent(new Event("change", { bubbles: true }));
        return true;
    });
    expect(aacConditionStarted).toBe(true);
    await expect.poll(() => page.evaluate(() => performance.getEntriesByType("resource").map((entry) => entry.name)))
        .toContainEqual(expect.stringContaining("/host-owned/assets/mediabunny-aac-encoder-"));
    const resources = [
        ...initial,
        ...imageResources,
        ...videoResources,
        ...await page.evaluate(() => performance.getEntriesByType("resource").map((entry) => entry.name)),
    ];
    const componentResources = resources.filter((url) => url.startsWith(componentOrigin));
    expect(componentResources.length).toBeGreaterThan(0);
    expect(componentResources.every((url) => url.startsWith(`${componentOrigin}/host-owned/`))).toBe(true);
    expect(resources.every((url) => !url.startsWith(`${hostOrigin}/assets/`))).toBe(true);
    expect(resources.every((url) => !url.startsWith(`${componentOrigin}/assets/`))).toBe(true);
});
