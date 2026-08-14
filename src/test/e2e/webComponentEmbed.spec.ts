import { test, expect } from "@playwright/test";
import { createServer, type Server } from "node:http";
import { readFile, readdir } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { nip19 } from "nostr-tools";

declare global {
    interface Window {
        __componentOrigin: string;
    }
}

let componentServer: Server;
let hostServer: Server;
let componentOrigin = "";
let hostOrigin = "";
let ffmpegCompressionModulePath = "";
const componentRequests = new Set<string>();
const hostRequests = new Set<string>();

const sentinels = {
    locale: "host-locale",
    themeMode: "host-theme",
    darkMode: "host-dark",
    firstVisit: "host-first-visit",
    "nostr-accounts": "host-accounts",
    "nostr-active-account": "host-active",
    "__nostrlogin_accounts": "host-legacy-accounts",
    "__nostrlogin_nip46": "host-legacy-session",
    "nl-dark-mode": "host-legacy-theme",
};

function listen(server: Server): Promise<number> {
    return new Promise((resolve) => {
        server.listen(0, "127.0.0.1", () => {
            const address = server.address();
            resolve(typeof address === "object" && address ? address.port : 0);
        });
    });
}

function close(server: Server): Promise<void> {
    return new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}

function contentTypeFor(filePath: string): string {
    switch (extname(filePath)) {
        case ".js": return "text/javascript";
        case ".wasm": return "application/wasm";
        case ".svg": return "image/svg+xml";
        default: return "application/octet-stream";
    }
}

test.beforeAll(async () => {
    componentServer = createServer(async (request, response) => {
        const pathname = new URL(request.url ?? "/", componentOrigin).pathname;
        componentRequests.add(pathname);
        const relativePath = pathname === "/" ? "ehagaki-composer.js" : pathname.slice(1);
        const filePath = normalize(join(process.cwd(), "dist-web-component", relativePath));
        if (!filePath.startsWith(normalize(join(process.cwd(), "dist-web-component")))) {
            response.writeHead(400).end();
            return;
        }
        try {
            const body = await readFile(filePath);
            response.writeHead(200, {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": contentTypeFor(filePath),
            });
            response.end(body);
        } catch {
            response.writeHead(404).end();
        }
    });
    const componentPort = await listen(componentServer);
    componentOrigin = `http://127.0.0.1:${componentPort}`;
    const componentAssets = await readdir(join(process.cwd(), "dist-web-component", "assets"));
    const ffmpegCompressionAsset = componentAssets.find((asset) =>
        asset.startsWith("ffmpegCompression-") && asset.endsWith(".js"),
    );
    if (!ffmpegCompressionAsset) {
        throw new Error("Web Component FFmpeg compression asset was not emitted.");
    }
    ffmpegCompressionModulePath = `assets/${ffmpegCompressionAsset}`;

    hostServer = createServer((request, response) => {
        const pathname = new URL(request.url ?? "/", hostOrigin).pathname;
        hostRequests.add(pathname);
        if (pathname === "/host-sw.js") {
            response.writeHead(200, { "Content-Type": "text/javascript" });
            response.end(`let fetchCount = 0; self.addEventListener('install', () => self.skipWaiting()); self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim())); self.addEventListener('fetch', () => { fetchCount += 1; }); self.addEventListener('message', (event) => { if (event.data?.type === 'host-state') event.ports[0]?.postMessage({ controlled: true, fetchCount }); });`);
            return;
        }
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end(`<!doctype html><head><style>
          ehagaki-composer { display: block; height: 600px; }
          ehagaki-composer::part(header) { outline: 3px solid rgb(1, 2, 3); }
        </style></head><body><script>
          window.__componentOrigin = ${JSON.stringify(componentOrigin)};
          navigator.serviceWorker.register('/host-sw.js');
          for (const [key, value] of Object.entries(${JSON.stringify(sentinels)})) localStorage.setItem(key, value);
        </script><div id="host">host surface</div></body>`);
    });
    const hostPort = await listen(hostServer);
    hostOrigin = `http://127.0.0.1:${hostPort}`;

});

test.beforeEach(() => {
    componentRequests.clear();
    hostRequests.clear();
});

test.afterAll(async () => {
    await Promise.all([close(componentServer), close(hostServer)]);
});

test("mounts across origins without touching host storage or registering an eHagaki Service Worker", async ({ page }) => {
    await page.goto(hostOrigin);
    await page.evaluate(async () => {
        await navigator.serviceWorker.ready;
        await new Promise<void>((resolve) => {
            if (navigator.serviceWorker.controller) resolve();
            else navigator.serviceWorker.addEventListener("controllerchange", () => resolve(), { once: true });
        });
        await import(`${window.__componentOrigin}/ehagaki-composer.js`);
        document.body.insertAdjacentHTML("beforeend", "<ehagaki-composer asset-base='" + window.__componentOrigin + "/' style='--ehagaki-footer-background: rgb(4, 5, 6)'></ehagaki-composer>");
    });

    const result = await page.evaluate(async ({ sentinels }) => {
        const composer = document.querySelector("ehagaki-composer") as HTMLElement & {
            whenReady(): Promise<void>;
            setSettings(value: { locale: "ja"; themeMode: "light" }): Promise<string[]>;
        };
        await composer.whenReady();
        const applied = await composer.setSettings({ locale: "ja", themeMode: "light" });
        const getHostState = () => new Promise<{ controlled: boolean; fetchCount: number }>((resolve) => {
            const channel = new MessageChannel();
            channel.port1.onmessage = (event) => resolve(event.data);
            navigator.serviceWorker.controller?.postMessage({ type: "host-state" }, [channel.port2]);
        });
        const beforeFetch = await getHostState();
        await fetch("/component-http-probe");
        const afterFetch = await getHostState();
        const raw = Object.fromEntries(Object.keys(sentinels).map((key) => [key, localStorage.getItem(key)]));
        const componentKeys = Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index))
            .filter((key): key is string => !!key && key.startsWith("ehagaki.web-component.v1:"));
        const registrations = await navigator.serviceWorker.getRegistrations();
        return {
            raw,
            componentKeys,
            applied,
            shadow: !!composer.shadowRoot,
            parts: ["shell", "header", "composer", "footer", "overlay-root"].every((part) => !!composer.shadowRoot?.querySelector(`[part~="${part}"]`)),
            headerOutline: getComputedStyle(composer.shadowRoot!.querySelector('[part~="header"]')!).outlineColor,
            footerBackground: getComputedStyle(composer.shadowRoot!.querySelector('[part~="footer"]')!).backgroundColor,
            serviceWorkerControlled: !!navigator.serviceWorker.controller,
            hostFetchObserved: afterFetch.fetchCount > beforeFetch.fetchCount,
            registrationCount: registrations.length,
        };
    }, { sentinels });

    expect(result.raw).toEqual(sentinels);
    expect(result.componentKeys).toContain("ehagaki.web-component.v1:locale");
    expect(result.applied).toContain("locale");
    expect(result.shadow).toBe(true);
    expect(result.parts).toBe(true);
    expect(result.headerOutline).toBe("rgb(1, 2, 3)");
    expect(result.footerBackground).toBe("rgb(4, 5, 6)");
    expect(result.serviceWorkerControlled).toBe(true);
    expect(result.hostFetchObserved).toBe(true);
    expect(result.registrationCount).toBe(1);
    await expect(page.locator("#host")).toHaveText("host surface");
});

test("supports bounded container and legacy viewport layout modes", async ({ page }) => {
    await page.goto(hostOrigin);
    const result = await page.evaluate(async () => {
        await import(`${window.__componentOrigin}/ehagaki-composer.js`);
        document.body.innerHTML = `
            <div id="before" style="height: 800px">before</div>
            <div id="mount" style="height: 420px; width: 360px"></div>
            <div id="after" style="height: 800px">after</div>
        `;

        const measure = (composer: HTMLElement) => {
            const shadow = composer.shadowRoot!;
            const rect = (selector: string) => {
                const element = shadow.querySelector<HTMLElement>(selector);
                if (!element) return null;
                const value = element.getBoundingClientRect();
                return { top: value.top, bottom: value.bottom, left: value.left, right: value.right };
            };
            const componentRect = composer.getBoundingClientRect();
            return {
                mode: (composer as HTMLElement & { layoutMode: string }).layoutMode,
                position: getComputedStyle(shadow.querySelector<HTMLElement>(".footer-bar")!).position,
                component: { top: componentRect.top, bottom: componentRect.bottom, left: componentRect.left, right: componentRect.right },
                footer: rect(".footer-bar"),
                buttonBar: rect(".footer-button-bar"),
                reason: rect(".reason-input-container"),
            };
        };

        const mount = document.querySelector<HTMLDivElement>("#mount")!;
        const create = async (mode?: "container" | "viewport") => {
            mount.replaceChildren();
            window.scrollTo(0, 0);
            const composer = document.createElement("ehagaki-composer") as HTMLElement & {
                whenReady(): Promise<void>;
                layoutMode: "container" | "viewport";
            };
            composer.style.display = "block";
            composer.style.height = "100%";
            if (mode) composer.setAttribute("layout-mode", mode);
            mount.append(composer);
            await composer.whenReady();
            const invalid = document.createElement("ehagaki-composer") as HTMLElement & { layoutMode: string };
            invalid.setAttribute("layout-mode", "unknown");
            const invalidMode = invalid.layoutMode;
            let mountedChangePosition: string | null = null;
            if (!mode) {
                composer.layoutMode = "viewport";
                mountedChangePosition = getComputedStyle(
                    composer.shadowRoot!.querySelector<HTMLElement>(".footer-bar")!,
                ).position;
                composer.layoutMode = "container";
            }
            const contentWarningToggle = composer.shadowRoot!.querySelector<HTMLElement>(".content-warning-icon")?.closest("button");
            if (contentWarningToggle && !contentWarningToggle.classList.contains("selected")) {
                contentWarningToggle.click();
            }
            await new Promise<void>((resolve) => setTimeout(resolve, 50));
            const before = measure(composer);
            window.scrollTo(0, 300);
            await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
            const after = measure(composer);
            return {
                before,
                after,
                invalidMode,
                mountedChangePosition,
                propertyMode: composer.layoutMode,
            };
        };

        const container = await create();
        const viewport = await create("viewport");
        return { container, viewport };
    });

    for (const mode of [result.container, result.viewport]) {
        expect(mode.before.reason).not.toBeNull();
        expect(mode.before.footer).not.toBeNull();
        expect(mode.before.buttonBar).not.toBeNull();
        expect(mode.invalidMode).toBe("container");
    }

    expect(result.container.before.mode).toBe("container");
    expect(result.container.before.position).toBe("absolute");
    expect(result.container.mountedChangePosition).toBe("absolute");
    expect(result.container.propertyMode).toBe("container");
    for (const item of [result.container.before.footer, result.container.before.buttonBar, result.container.before.reason]) {
        expect(item!.left).toBeGreaterThanOrEqual(result.container.before.component.left - 1);
        expect(item!.right).toBeLessThanOrEqual(result.container.before.component.right + 1);
        expect(item!.bottom).toBeLessThanOrEqual(result.container.before.component.bottom + 1);
    }
    expect(result.container.after.footer!.top - result.container.before.footer!.top).toBeLessThan(-200);

    expect(result.viewport.before.mode).toBe("viewport");
    expect(result.viewport.before.position).toBe("fixed");
    expect(result.viewport.propertyMode).toBe("viewport");
    expect(Math.abs(result.viewport.after.footer!.top - result.viewport.before.footer!.top)).toBeLessThan(2);
});

test("loads app-owned icons from the component asset base instead of the host", async ({ page }) => {
    await page.goto(hostOrigin);
    const result = await page.evaluate(async () => {
        await import(`${window.__componentOrigin}/ehagaki-composer.js`);
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            whenReady(): Promise<void>;
        };
        composer.setAttribute("asset-base", `${window.__componentOrigin}/`);
        document.body.append(composer);
        await composer.whenReady();
        const shadow = composer.shadowRoot!;
        const logo = shadow.querySelector<HTMLImageElement>("img.site-icon")!;
        await new Promise<void>((resolve, reject) => {
            if (logo.complete && logo.naturalWidth > 0) {
                resolve();
                return;
            }
            logo.addEventListener("load", () => resolve(), { once: true });
            logo.addEventListener("error", () => reject(new Error("logo failed to load")), { once: true });
        });
        const masks = [
            shadow.querySelector<HTMLElement>(".trash-icon")!,
            shadow.querySelector<HTMLElement>(".login-icon")!,
            shadow.querySelector<HTMLElement>(".settings-icon")!,
        ].map((icon) => getComputedStyle(icon).maskImage);
        return { logoSrc: logo.src, naturalWidth: logo.naturalWidth, masks };
    });

    expect(result.logoSrc.startsWith(componentOrigin)).toBe(true);
    expect(result.naturalWidth).toBeGreaterThan(0);
    for (const mask of result.masks) {
        expect(mask).not.toBe("none");
        expect(mask).toContain(componentOrigin);
    }
    expect([...hostRequests].some((path) =>
        path === "/ehagaki_icon.svg" || path.startsWith("/icons/"))).toBe(false);
    expect(componentRequests).toContain("/ehagaki_icon.svg");
    expect([...componentRequests].some((path) => path.startsWith("/icons/"))).toBe(true);
});

test("rejects a second connected component and releases the slot after disconnect", async ({ page }) => {
    await page.goto(hostOrigin);
    const result = await page.evaluate(async () => {
        await import(`${window.__componentOrigin}/ehagaki-composer.js`);
        const first = document.createElement("ehagaki-composer") as HTMLElement & { whenReady(): Promise<void> };
        document.body.append(first);
        await first.whenReady();
        const second = document.createElement("ehagaki-composer") as HTMLElement & { whenReady(): Promise<void> };
        const errors: string[] = [];
        second.addEventListener("ehagaki-initialization-error", (event) => errors.push((event as CustomEvent).detail.code));
        document.body.append(second);
        await second.whenReady().then(() => "resolved", (error) => error.name);
        first.remove();
        const replacement = document.createElement("ehagaki-composer") as HTMLElement & { whenReady(): Promise<void> };
        document.body.append(replacement);
        await replacement.whenReady();
        return { errors, replacementReady: !!replacement.shadowRoot };
    });

    expect(result.errors).toEqual(["multiple_instances_unsupported"]);
    expect(result.replacementReady).toBe(true);
});

test("applies Button variants and host theme classes inside the Shadow DOM", async ({ page }) => {
    await page.goto(hostOrigin);
    await page.evaluate(async () => {
        await import(`${window.__componentOrigin}/ehagaki-composer.js`);
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            whenReady(): Promise<void>;
            setSettings(value: { themeMode: "light" | "dark" }): Promise<string[]>;
        };
        document.body.append(composer);
        await composer.whenReady();
    });
    await page.waitForFunction(() => {
        const shadow = document.querySelector("ehagaki-composer")?.shadowRoot;
        return !!shadow?.querySelector("button.primary.content-iconText")
            && !!shadow.querySelector("button.default")
            && !!shadow.querySelector(".footer-bar button");
    });

    const result = await page.evaluate(async () => {
        const composer = document.querySelector("ehagaki-composer") as HTMLElement & {
            setSettings(value: { themeMode: "light" | "dark" }): Promise<string[]>;
        };
        const shadow = composer.shadowRoot!;
        const primary = shadow.querySelector<HTMLButtonElement>("button.primary.content-iconText")!;
        const defaultButton = shadow.querySelector<HTMLButtonElement>("button.default")!;
        primary.querySelector(".svg-icon")!.classList.remove("login-icon");
        defaultButton.classList.remove("circle", "square", "content-icon");

        await composer.setSettings({ themeMode: "light" });
        const appRoot = shadow.querySelector<HTMLElement>(".ehagaki-app-root")!;
        const lightAppTextColor = getComputedStyle(appRoot).color;
        const lightHostClass = composer.classList.contains("light");

        await composer.setSettings({ themeMode: "dark" });
        const darkAppTextColor = getComputedStyle(appRoot).color;

        return {
            primaryPadding: getComputedStyle(primary).padding,
            primaryFontWeight: getComputedStyle(primary).fontWeight,
            primaryIconWidth: getComputedStyle(primary.querySelector(".svg-icon")!).width,
            defaultPadding: getComputedStyle(defaultButton).padding,
            lightHostClass,
            darkHostClass: composer.classList.contains("dark"),
            lightAppTextColor,
            darkAppTextColor,
        };
    });

    expect(result.primaryPadding).toBe("12px 18px 12px 14px");
    expect(result.primaryFontWeight).toBe("500");
    expect(result.primaryIconWidth).toBe("28px");
    expect(result.defaultPadding).toBe("8px 12px");
    expect(result.lightHostClass).toBe(true);
    expect(result.darkHostClass).toBe(true);
    expect(result.lightAppTextColor).not.toBe("rgba(0, 0, 0, 0)");
    expect(result.darkAppTextColor).not.toBe(result.lightAppTextColor);
});

test("applies Button styles inside a Portal dialog in the Shadow DOM", async ({ page }) => {
    await page.goto(hostOrigin);
    await page.evaluate(async () => {
        await import(`${window.__componentOrigin}/ehagaki-composer.js`);
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            whenReady(): Promise<void>;
            setSettings(value: { themeMode: "light" | "dark" }): Promise<string[]>;
        };
        document.body.append(composer);
        await composer.whenReady();
        await composer.setSettings({ themeMode: "light" });
        composer.shadowRoot!.querySelector<HTMLButtonElement>("button.login-btn")!.click();
    });
    await page.waitForFunction(() => {
        const shadow = document.querySelector("ehagaki-composer")?.shadowRoot;
        const overlay = shadow?.querySelector('[part~="overlay-root"]');
        return !!overlay?.querySelector(".login-dialog");
    });

    await page.evaluate(() => {
        const shadow = document.querySelector("ehagaki-composer")!.shadowRoot!;
        const overlay = shadow.querySelector<HTMLElement>('[part~="overlay-root"]')!;
        overlay.querySelector<HTMLDetailsElement>(".remote-signer-details")!.open = true;
    });
    await page.waitForFunction(() =>
        !!document.querySelector("ehagaki-composer")?.shadowRoot
            ?.querySelector('[part~="overlay-root"] [data-testid="nostrconnect-regenerate"]'),
    );
    const lightResult = await page.evaluate(() => {
        const shadow = document.querySelector("ehagaki-composer")!.shadowRoot!;
        const overlay = shadow.querySelector<HTMLElement>('[part~="overlay-root"]')!;
        const primary = overlay.querySelector<HTMLButtonElement>(
            '[data-testid="nostrconnect-regenerate"]',
        )!;
        const secondary = overlay.querySelector<HTMLButtonElement>(
            ".nostrconnect-relay-editor-actions button.secondary",
        )!;
        return {
            dialogInOverlay: overlay.contains(primary) && overlay.contains(secondary),
            primaryPadding: getComputedStyle(primary).padding,
            primaryBackground: getComputedStyle(primary).backgroundColor,
            secondaryPadding: getComputedStyle(secondary).padding,
            secondaryBorderTopWidth: getComputedStyle(secondary).borderTopWidth,
            secondaryBackground: getComputedStyle(secondary).backgroundColor,
            dialogBackground: getComputedStyle(
                overlay.querySelector<HTMLElement>(".login-dialog")!,
            ).backgroundColor,
        };
    });

    expect(lightResult.dialogInOverlay).toBe(true);
    expect(lightResult.primaryPadding).toBe("8px 12px");
    expect(lightResult.primaryBackground).not.toBe("rgba(0, 0, 0, 0)");
    expect(lightResult.secondaryPadding).toBe("8px 12px");
    expect(lightResult.secondaryBorderTopWidth).toBe("1px");

    const darkDialogBackground = await page.evaluate(async () => {
        const composer = document.querySelector("ehagaki-composer") as HTMLElement & {
            setSettings(value: { themeMode: "dark" }): Promise<string[]>;
        };
        await composer.setSettings({ themeMode: "dark" });
        return getComputedStyle(
            composer.shadowRoot!.querySelector<HTMLElement>(
                '[part~="overlay-root"] .login-dialog',
            )!,
        ).backgroundColor;
    });
    expect(darkDialogBackground).not.toBe(lightResult.dialogBackground);
});

test("keeps the normal app Portal Button scope", async ({ page }) => {
    await page.goto("/");
    await page.waitForFunction(() =>
        document.body.classList.contains("ehagaki-app-root")
            && !!document.querySelector(".welcome-dialog button.primary"),
    );

    const result = await page.evaluate(() => {
        const primary = document.querySelector<HTMLButtonElement>(
            ".welcome-dialog button.primary",
        )!;
        return {
            inBody: document.body.contains(primary),
            buttonBackground: getComputedStyle(primary).getPropertyValue("--btn-bg"),
            background: getComputedStyle(primary).backgroundColor,
        };
    });
    expect(result.inBody).toBe(true);
    expect(result.buttonBackground).toBe("hsl(152, 74%, 43%)");
    expect(result.background).toBe("rgb(29, 191, 115)");
});

test("queues setContext before ready and applies content and reply atomically", async ({ page }) => {
    await page.goto(hostOrigin);
    const reply = nip19.noteEncode("a".repeat(64));
    await page.evaluate(async () => {
        await import(`${window.__componentOrigin}/ehagaki-composer.js`);
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            whenReady(): Promise<void>;
            setContext(value: unknown): Promise<void>;
        };
        const queued = composer.setContext({ content: "queued context" });
        document.body.append(composer);
        await composer.whenReady();
        await queued;

    });

    await page.waitForFunction(() =>
        document.querySelector("ehagaki-composer")?.shadowRoot?.querySelector(".tiptap-editor"),
    );
    const result = await page.evaluate(async ({ reply }) => {
        const composer = document.querySelector("ehagaki-composer") as HTMLElement & {
            setContext(value: unknown): Promise<void>;
        };
        const shadow = composer.shadowRoot!;
        const contentAfterQueue = shadow.querySelector(".tiptap-editor")?.textContent;
        await composer.setContext({ reply });
        const replyApplied = !!shadow.querySelector(".reply-quote-preview");

        const invalidResult = await composer.setContext({
            content: "must not be applied",
            reply: "invalid reference",
        }).then(
            () => "resolved",
            (error: Error) => error.name,
        );
        return {
            contentAfterQueue,
            replyApplied,
            invalidResult,
            contentAfterInvalid: shadow.querySelector(".tiptap-editor")?.textContent,
        };
    }, { reply });

    expect(result.contentAfterQueue).toContain("queued context");
    expect(result.replyApplied).toBe(true);
    expect(result.invalidResult).toBe("EmbedComposerContextValidationError");
    expect(result.contentAfterInvalid).toContain("queued context");
    expect(result.contentAfterInvalid).not.toContain("must not be applied");
});

test("loads the FFmpeg class worker, core, and WASM from a cross-origin Web Component build", async ({ page }) => {
    await page.goto(hostOrigin);
    const result = await page.evaluate(async (ffmpegModulePath) => {
        await import(`${window.__componentOrigin}/ehagaki-composer.js`);
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            whenReady(): Promise<void>;
            assetBase: string | null;
        };
        composer.assetBase = `${window.__componentOrigin}/`;
        document.body.append(composer);
        await composer.whenReady();

        const module = await import(`${window.__componentOrigin}/${ffmpegModulePath}`) as {
            FFmpegCompression: new () => { loadFFmpeg(): Promise<void>; cleanup(): Promise<void>; isLoaded: boolean };
        };
        const compression = new module.FFmpegCompression();
        const loadResult = await Promise.race([
            compression.loadFFmpeg().then(() => "loaded"),
            new Promise<string>((resolve) => setTimeout(() => resolve("timed-out"), 10_000)),
        ]);
        const loaded = compression.isLoaded;
        await compression.cleanup();
        return { loaded, loadResult };
    }, ffmpegCompressionModulePath);

    expect(result.loaded).toBe(true);
    expect(result.loadResult).toBe("loaded");
    expect([...componentRequests]).toContain(`/${ffmpegCompressionModulePath}`);
    expect([...componentRequests].some((path) => /^\/assets\/worker-.*\.js$/.test(path))).toBe(true);
    expect(componentRequests).toContain("/ffmpeg-core/ffmpeg-core.js");
    expect(componentRequests).toContain("/ffmpeg-core/ffmpeg-core.wasm");
});
