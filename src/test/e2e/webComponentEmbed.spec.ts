import { test, expect } from "@playwright/test";
import { createServer, type Server } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

declare global {
    interface Window {
        __componentOrigin: string;
    }
}

let componentServer: Server;
let hostServer: Server;
let componentOrigin = "";
let hostOrigin = "";

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

test.beforeAll(async () => {
    componentServer = createServer(async (request, response) => {
        const pathname = new URL(request.url ?? "/", componentOrigin).pathname;
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
                "Content-Type": extname(filePath) === ".js" ? "text/javascript" : "application/octet-stream",
            });
            response.end(body);
        } catch {
            response.writeHead(404).end();
        }
    });
    const componentPort = await listen(componentServer);
    componentOrigin = `http://127.0.0.1:${componentPort}`;

    hostServer = createServer((request, response) => {
        const pathname = new URL(request.url ?? "/", hostOrigin).pathname;
        if (pathname === "/host-sw.js") {
            response.writeHead(200, { "Content-Type": "text/javascript" });
            response.end(`let fetchCount = 0; self.addEventListener('install', () => self.skipWaiting()); self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim())); self.addEventListener('fetch', () => { fetchCount += 1; }); self.addEventListener('message', (event) => { if (event.data?.type === 'host-state') event.ports[0]?.postMessage({ controlled: true, fetchCount }); });`);
            return;
        }
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end(`<!doctype html><body><script>
          window.__componentOrigin = ${JSON.stringify(componentOrigin)};
          navigator.serviceWorker.register('/host-sw.js');
          for (const [key, value] of Object.entries(${JSON.stringify(sentinels)})) localStorage.setItem(key, value);
        </script><div id="host">host surface</div></body>`);
    });
    const hostPort = await listen(hostServer);
    hostOrigin = `http://127.0.0.1:${hostPort}`;

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
        document.body.insertAdjacentHTML("beforeend", "<ehagaki-composer asset-base='" + window.__componentOrigin + "/'></ehagaki-composer>");
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
            parts: ["shell", "overlay-root"].every((part) => !!composer.shadowRoot?.querySelector(`[part~="${part}"]`)),
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
    expect(result.serviceWorkerControlled).toBe(true);
    expect(result.hostFetchObserved).toBe(true);
    expect(result.registrationCount).toBe(1);
    await expect(page.locator("#host")).toHaveText("host surface");
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
