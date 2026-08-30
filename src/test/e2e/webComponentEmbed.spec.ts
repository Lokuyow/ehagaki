import { test, expect } from "@playwright/test";
import { createServer, type Server } from "node:http";
import { readFile, readdir } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { finalizeEvent, generateSecretKey, getPublicKey, nip19 } from "nostr-tools";
import { WebSocketServer, type WebSocket } from "ws";
import { ensureWebComponentE2EOutput } from "../../../scripts/ensureWebComponentE2EOutput.mjs";

declare global {
    interface Window {
        __componentOrigin: string;
        __webComponentRelayInterception?: {
            installedBeforeImport: boolean;
            importStartedAfterInstall: boolean;
            originalUrls: string[];
            mappedUrls: string[];
        };
    }
}

let componentServer: Server;
let hostServer: Server;
let componentOrigin = "";
let hostOrigin = "";
let relayServer: WebSocketServer;
let relayOrigin = "";
let relayConnectionCount = 0;
let relayPublishedEvents: Array<{ event: Record<string, unknown> }> = [];
let relayRequestsPaused = false;
let pendingRelayResponses: Array<() => void> = [];
const componentRequests = new Set<string>();
const hostRequests = new Set<string>();
const componentStoragePrefix = "ehagaki.web-component.v1:";
const testPubkeyHex = "11".repeat(32);

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

function listenWebSocketServer(server: WebSocketServer): Promise<number> {
    return new Promise((resolve, reject) => {
        const onError = (error: Error) => {
            server.off("listening", onListening);
            reject(error);
        };
        const onListening = () => {
            server.off("error", onError);
            const address = server.address();
            resolve(typeof address === "object" && address ? address.port : 0);
        };
        server.once("error", onError);
        server.once("listening", onListening);
    });
}

function closeWebSocketServer(server: WebSocketServer): Promise<void> {
    for (const client of server.clients) {
        client.terminate();
    }
    return new Promise((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve());
    });
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
    test.setTimeout(180_000);
    await ensureWebComponentE2EOutput();
    relayServer = new WebSocketServer({ host: "127.0.0.1", port: 0 });
    relayServer.on("connection", (socket: WebSocket) => {
        relayConnectionCount += 1;
        socket.on("message", (rawMessage) => {
            try {
                const message = JSON.parse(rawMessage.toString()) as unknown[];
                if (message[0] === "REQ" && typeof message[1] === "string") {
                    const sendEose = () => {
                        try {
                            socket.send(JSON.stringify(["EOSE", message[1]]));
                        } catch {
                            // A disconnected test client no longer needs its EOSE.
                        }
                    };
                    if (relayRequestsPaused) pendingRelayResponses.push(sendEose);
                    else sendEose();
                }
                if (
                    message[0] === "EVENT"
                    && typeof message[1] === "object"
                    && message[1] !== null
                    && !Array.isArray(message[1])
                ) {
                    const event = message[1] as Record<string, unknown>;
                    relayPublishedEvents.push({ event });
                    socket.send(JSON.stringify([
                        "OK",
                        typeof event.id === "string" ? event.id : "",
                        true,
                        "accepted",
                    ]));
                }
            } catch {
                // The relay only needs to accept the browser connection for this proof.
            }
        });
    });
    const relayPort = await listenWebSocketServer(relayServer);
    relayOrigin = `ws://127.0.0.1:${relayPort}`;
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
    relayConnectionCount = 0;
    relayPublishedEvents = [];
    relayRequestsPaused = false;
    pendingRelayResponses = [];
});

function releasePausedRelayRequests(): void {
    relayRequestsPaused = false;
    const responses = pendingRelayResponses;
    pendingRelayResponses = [];
    for (const respond of responses) respond();
}

test.afterAll(async () => {
    await Promise.all([
        componentServer && close(componentServer),
        hostServer && close(hostServer),
        relayServer && closeWebSocketServer(relayServer),
    ]);
});

test("keeps startup NIP-07 opt-in and preserves the existing ready path when absent", async ({ page }) => {
    await page.goto(hostOrigin);
    const result = await page.evaluate(async ({ componentOrigin }) => {
        const state = { getPublicKeyCalls: 0, readyEvents: 0 };
        window.nostr = {
            getPublicKey: async () => {
                state.getPublicKeyCalls += 1;
                return "12".repeat(32);
            },
            signEvent: async (event: unknown) => event,
        } as any;
        await import(`${componentOrigin}/ehagaki-composer.js`);
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            autoLogin: boolean;
            whenReady(): Promise<void>;
        };
        composer.addEventListener("ehagaki-ready", () => state.readyEvents += 1);
        document.body.append(composer);
        await composer.whenReady();
        return {
            ...state,
            autoLogin: composer.autoLogin,
            hasAccountStorage: Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index))
                .some((key) => key === "ehagaki.web-component.v1:nostr-accounts"),
        };
    }, { componentOrigin });

    expect(result).toEqual({
        getPublicKeyCalls: 0,
        readyEvents: 1,
        autoLogin: false,
        hasAccountStorage: false,
    });
});

test("Full Web Component does not expose the Lite preferred-height API", async ({ page }) => {
    await page.goto(hostOrigin);
    const result = await page.evaluate(async ({ componentOrigin }) => {
        await import(`${componentOrigin}/ehagaki-composer.js`);
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            whenReady(): Promise<void>;
            preferredHeight?: number | null;
        };
        let preferredHeightEvents = 0;
        composer.addEventListener("ehagaki-preferred-height-change", () => preferredHeightEvents += 1);
        document.body.append(composer);
        await composer.whenReady();
        return {
            hasPreferredHeightProperty: "preferredHeight" in composer,
            preferredHeight: composer.preferredHeight ?? null,
            preferredHeightEvents,
        };
    }, { componentOrigin });

    expect(result).toEqual({
        hasPreferredHeightProperty: false,
        preferredHeight: null,
        preferredHeightEvents: 0,
    });
});

test("exposes the common editor empty state API through the Full element", async ({ page }) => {
    await page.goto(hostOrigin);
    const initial = await page.evaluate(async ({ componentOrigin }) => {
        await import(`${componentOrigin}/ehagaki-composer.js`);
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            editorIsEmpty: boolean | null;
            whenReady(): Promise<void>;
            setContext(value: unknown): Promise<void>;
        };
        const changes: Array<{ isEmpty: boolean; bubbles: boolean; composed: boolean; keys: string[] }> = [];
        (window as any).__fullEditorEmptyChanges = changes;
        composer.addEventListener("ehagaki-editor-empty-change", (event) => {
            const customEvent = event as CustomEvent<{ isEmpty: boolean }>;
            changes.push({
                isEmpty: customEvent.detail.isEmpty,
                bubbles: customEvent.bubbles,
                composed: customEvent.composed,
                keys: Object.keys(customEvent.detail),
            });
        });
        const beforeConnection = composer.editorIsEmpty;
        document.body.append(composer);
        const duringConnectionBeforeReady = composer.editorIsEmpty;
        await composer.whenReady();
        return { beforeConnection, duringConnectionBeforeReady, atReady: composer.editorIsEmpty, changes };
    }, { componentOrigin });

    expect(initial).toEqual({
        beforeConnection: null,
        duringConnectionBeforeReady: null,
        atReady: true,
        changes: [{ isEmpty: true, bubbles: true, composed: true, keys: ["isEmpty"] }],
    });

    const composer = page.locator("ehagaki-composer");
    const editor = composer.locator(".tiptap-editor");
    await editor.click();
    await editor.pressSequentially("Full text");
    await expect.poll(() => composer.evaluate((element) => (element as any).editorIsEmpty)).toBe(false);
    await expect.poll(() => page.evaluate(() => (window as any).__fullEditorEmptyChanges.length)).toBe(2);

    await editor.press("ArrowLeft");
    await expect.poll(() => page.evaluate(() => (window as any).__fullEditorEmptyChanges.length)).toBe(2);

    await editor.press("ControlOrMeta+A");
    await editor.press("Backspace");
    // Clear the short test input through the editor's normal delete path. A
    // character-by-character fallback keeps this deterministic on mobile
    // projects where select-all chords are not exposed reliably.
    await editor.press("End");
    for (let index = 0; index < "Full text".length; index += 1) {
        await editor.press("Backspace");
    }
    await expect.poll(() => composer.evaluate((element) => (element as any).editorIsEmpty)).toBe(true);
    await expect.poll(() => page.evaluate(() => (window as any).__fullEditorEmptyChanges.length)).toBe(3);

    const result = await page.evaluate(async () => {
        const composer = document.querySelector("ehagaki-composer") as HTMLElement & {
            editorIsEmpty: boolean | null;
            setContext(value: unknown): Promise<void>;
            whenReady(): Promise<void>;
        };
        const events = (window as any).__fullEditorEmptyChanges as Array<{ isEmpty: boolean }>;
        await composer.setContext({ content: "programmatic content" });
        const nonEmpty = composer.editorIsEmpty;
        await composer.setContext({ content: "different content" });
        const sameStateCount = events.length;
        await composer.setContext({ content: null });
        const empty = composer.editorIsEmpty;
        const beforeDisconnectCount = events.length;
        composer.remove();
        const disconnected = composer.editorIsEmpty;
        document.body.append(composer);
        await composer.whenReady();
        return {
            nonEmpty,
            sameStateCount,
            empty,
            disconnected,
            reconnected: composer.editorIsEmpty,
            events: events.slice(beforeDisconnectCount).map((event) => event.isEmpty),
        };
    });

    expect(result).toEqual({
        nonEmpty: false,
        sameStateCount: 4,
        empty: true,
        disconnected: null,
        reconnected: true,
        events: [true],
    });
});

test("Full Web Component rejects ready when PostComponent loading fails", async ({ page }) => {
    await page.goto(hostOrigin);
    await page.route("**/PostComponent-*.js", (route) => route.abort());
    const result = await page.evaluate(async ({ componentOrigin }) => {
        await import(`${componentOrigin}/ehagaki-composer.js`);
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            editorIsEmpty: boolean | null;
            whenReady(): Promise<void>;
        };
        const initializationErrors: Array<{ code: string; message: string }> = [];
        composer.addEventListener("ehagaki-initialization-error", (event) => {
            const detail = (event as CustomEvent<{ code: string; message: string }>).detail;
            initializationErrors.push({ code: detail.code, message: detail.message });
        });
        document.body.append(composer);
        const ready = composer.whenReady().then(
            () => ({ status: "resolved" as const, errorName: null }),
            (error: Error) => ({ status: "rejected" as const, errorName: error.name }),
        );
        const result = await Promise.race([
            ready,
            new Promise<{ status: "pending"; errorName: null }>((resolve) => {
                window.setTimeout(() => resolve({ status: "pending", errorName: null }), 2_000);
            }),
        ]);
        return { result, initializationErrors, editorIsEmpty: composer.editorIsEmpty };
    }, { componentOrigin });

    expect(result).toEqual({
        result: { status: "rejected", errorName: "initialization_failed" },
        initializationErrors: [{
            code: "initialization_failed",
            message: "eHagaki Composer could not be initialized.",
        }],
        editorIsEmpty: null,
    });
});

test("auto-login persists NIP-07 and delays ready through authenticated bootstrap", async ({ page }) => {
    relayRequestsPaused = true;
    await page.goto(hostOrigin);
    await page.evaluate(async ({ componentOrigin, relayOrigin }) => {
        const state = {
            getPublicKeyCalls: 0,
            ready: false,
            readyEvents: 0,
        };
        (window as any).__autoLoginState = state;
        const nativeWebSocket = window.WebSocket;
        window.WebSocket = new Proxy(nativeWebSocket, {
            construct(target, args, newTarget) {
                const [, protocols] = args as [string | URL, string | string[] | undefined];
                return Reflect.construct(
                    target,
                    [relayOrigin, protocols].filter((value) => value !== undefined),
                    newTarget,
                );
            },
        });
        window.nostr = {
            getPublicKey: async () => {
                state.getPublicKeyCalls += 1;
                return "23".repeat(32);
            },
            signEvent: async (event: unknown) => event,
        } as any;
        await import(`${componentOrigin}/ehagaki-composer.js`);
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            autoLogin: boolean;
            whenReady(): Promise<void>;
        };
        composer.setAttribute("auto-login", "false");
        composer.addEventListener("ehagaki-ready", () => state.readyEvents += 1);
        document.body.append(composer);
        void composer.whenReady().then(() => {
            state.ready = true;
        });
    }, { componentOrigin, relayOrigin });

    await expect.poll(() => page.evaluate(() => (window as any).__autoLoginState.getPublicKeyCalls)).toBe(1);
    await expect.poll(() => pendingRelayResponses.length).toBeGreaterThan(0);
    expect(await page.evaluate(() => (window as any).__autoLoginState.ready)).toBe(false);

    releasePausedRelayRequests();
    await expect.poll(
        () => page.evaluate(() => (window as any).__autoLoginState.ready),
        // The authenticated normal-relay resolver makes bounded kind:10002 and
        // kind:3 attempts before it completes the delayed-ready contract.
        { timeout: 12_000 },
    ).toBe(true);
    const result = await page.evaluate(({ componentStoragePrefix }) => {
        const state = (window as any).__autoLoginState;
        const pubkeyHex = "23".repeat(32);
        return {
            ...state,
            autoLogin: (document.querySelector("ehagaki-composer") as any).autoLogin,
            accounts: JSON.parse(localStorage.getItem(`${componentStoragePrefix}nostr-accounts`) ?? "[]"),
            activePubkey: localStorage.getItem(`${componentStoragePrefix}nostr-active-account`),
            expectedPubkey: pubkeyHex,
        };
    }, { componentStoragePrefix });

    expect(result.getPublicKeyCalls).toBe(1);
    expect(result.readyEvents).toBe(1);
    expect(result.autoLogin).toBe(true);
    expect(result.accounts).toEqual([
        expect.objectContaining({ pubkeyHex: result.expectedPubkey, type: "nip07" }),
    ]);
    expect(result.activePubkey).toBe(result.expectedPubkey);
});

test("auto-login failure continues as guest without retry or initialization error", async ({ page }) => {
    await page.goto(hostOrigin);
    const result = await page.evaluate(async ({ componentOrigin, componentStoragePrefix }) => {
        const state = {
            getPublicKeyCalls: 0,
            readyEvents: 0,
            initializationErrors: 0,
            consoleErrors: [] as string[],
        };
        const originalConsoleError = console.error;
        console.error = (...args: unknown[]) => {
            state.consoleErrors.push(String(args[0]));
            originalConsoleError(...args);
        };
        window.nostr = {
            getPublicKey: async () => {
                state.getPublicKeyCalls += 1;
                throw new Error("user rejected");
            },
            signEvent: async (event: unknown) => event,
        } as any;
        await import(`${componentOrigin}/ehagaki-composer.js`);
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            whenReady(): Promise<void>;
        };
        composer.setAttribute("auto-login", "");
        composer.addEventListener("ehagaki-ready", () => state.readyEvents += 1);
        composer.addEventListener("ehagaki-initialization-error", () => state.initializationErrors += 1);
        document.body.append(composer);
        await composer.whenReady();
        await new Promise((resolve) => setTimeout(resolve, 50));
        return {
            ...state,
            accounts: localStorage.getItem(`${componentStoragePrefix}nostr-accounts`),
            visibleAutoLoginError: composer.shadowRoot?.textContent?.includes("自動ログイン失敗") ?? false,
        };
    }, { componentOrigin, componentStoragePrefix });

    expect(result.getPublicKeyCalls).toBe(1);
    expect(result.readyEvents).toBe(1);
    expect(result.initializationErrors).toBe(0);
    expect(result.accounts).toBeNull();
    expect(result.visibleAutoLoginError).toBe(false);
    expect(result.consoleErrors.some((message) => message.includes("NIP-07"))).toBe(false);
});

test("treats auto-login changes after connection as next-mount configuration", async ({ page }) => {
    await page.goto(hostOrigin);
    const result = await page.evaluate(async ({ componentOrigin, relayOrigin }) => {
        const state = { getPublicKeyCalls: 0 };
        const nativeWebSocket = window.WebSocket;
        window.WebSocket = new Proxy(nativeWebSocket, {
            construct(target, args, newTarget) {
                const [, protocols] = args as [string | URL, string | string[] | undefined];
                return Reflect.construct(
                    target,
                    [relayOrigin, protocols].filter((value) => value !== undefined),
                    newTarget,
                );
            },
        });
        window.nostr = {
            getPublicKey: async () => {
                state.getPublicKeyCalls += 1;
                return "34".repeat(32);
            },
            signEvent: async (event: unknown) => event,
        } as any;
        await import(`${componentOrigin}/ehagaki-composer.js`);
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            autoLogin: boolean;
            whenReady(): Promise<void>;
        };
        document.body.append(composer);
        await composer.whenReady();
        composer.autoLogin = true;
        await new Promise((resolve) => setTimeout(resolve, 50));
        const callsDuringCurrentMount = state.getPublicKeyCalls;
        composer.remove();
        document.body.append(composer);
        await composer.whenReady();
        return {
            callsDuringCurrentMount,
            callsAfterRemount: state.getPublicKeyCalls,
        };
    }, { componentOrigin, relayOrigin });

    expect(result).toEqual({
        callsDuringCurrentMount: 0,
        callsAfterRemount: 1,
    });
});

test("routes the real authenticated relay connection through the host WebSocket interceptor", async ({ page }) => {
    const originalRelayUrl = "wss://issue-89-test-relay.example";

    await page.goto(hostOrigin);
    await page.evaluate(async ({ componentOrigin, componentStoragePrefix, originalRelayUrl, relayOrigin, pubkeyHex }) => {
        const interceptionState = {
            installedBeforeImport: false,
            importStartedAfterInstall: false,
            originalUrls: [] as string[],
            mappedUrls: [] as string[],
        };
        const nativeWebSocket = window.WebSocket;
        window.WebSocket = new Proxy(nativeWebSocket, {
            construct(target, args, newTarget) {
                const [url, protocols] = args as [string | URL, string | string[] | undefined];
                const originalUrl = String(url);
                if (/^wss?:\/\//.test(originalUrl)) {
                    interceptionState.originalUrls.push(originalUrl);
                    interceptionState.mappedUrls.push(relayOrigin);
                    return Reflect.construct(
                        target,
                        [relayOrigin, protocols].filter((value) => value !== undefined),
                        newTarget,
                    );
                }
                return Reflect.construct(target, args, newTarget);
            },
        });
        interceptionState.installedBeforeImport = window.WebSocket !== nativeWebSocket;
        window.__webComponentRelayInterception = interceptionState;
        window.nostr = {
            getPublicKey: async () => pubkeyHex,
            signEvent: async (event: any) => ({ ...event, id: "66".repeat(32), sig: "77".repeat(64) }),
        };

        localStorage.setItem(
            `${componentStoragePrefix}nostr-accounts`,
            JSON.stringify([{ pubkeyHex, type: "nip07", addedAt: 1 }]),
        );
        localStorage.setItem(`${componentStoragePrefix}nostr-active-account`, pubkeyHex);
        localStorage.setItem(
            `${componentStoragePrefix}nostr-relays-${pubkeyHex}`,
            JSON.stringify({ [originalRelayUrl]: { read: true, write: true } }),
        );

        interceptionState.importStartedAfterInstall = interceptionState.installedBeforeImport;
        await import(`${componentOrigin}/ehagaki-composer.js`);
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            whenReady(): Promise<void>;
        };
        composer.style.width = "360px";
        composer.style.height = "600px";
        document.body.append(composer);
        await composer.whenReady();
    }, {
        componentOrigin,
        componentStoragePrefix,
        originalRelayUrl,
        relayOrigin,
        pubkeyHex: testPubkeyHex,
    });

    await expect.poll(() => page.evaluate(() => {
        const state = window.__webComponentRelayInterception;
        return state?.originalUrls ?? [];
    })).toContain(originalRelayUrl);
    await expect.poll(() => relayConnectionCount).toBeGreaterThan(0);

    const result = await page.evaluate(({ originalRelayUrl, relayOrigin }) => {
        const state = window.__webComponentRelayInterception!;
        const composer = document.querySelector("ehagaki-composer")!;
        return {
            installedBeforeImport: state.installedBeforeImport,
            importStartedAfterInstall: state.importStartedAfterInstall,
            interceptionCount: state.originalUrls.length,
            capturedRelayUrls: state.originalUrls,
            originalRelayCaptured: state.originalUrls.includes(originalRelayUrl),
            mappedRelayUrls: state.mappedUrls,
            expectedMappingCaptured: state.originalUrls.includes(originalRelayUrl)
                && state.mappedUrls[state.originalUrls.indexOf(originalRelayUrl)] === relayOrigin,
            sameWindowRealm: window.top === window
                && composer.ownerDocument.defaultView === window,
            iframeCount: document.querySelectorAll("iframe").length,
        };
    }, { originalRelayUrl, relayOrigin });

    expect(result.installedBeforeImport).toBe(true);
    expect(result.importStartedAfterInstall).toBe(true);
    expect(result.interceptionCount).toBeGreaterThan(0);
    expect(result.originalRelayCaptured).toBe(true);
    expect(result.expectedMappingCaptured).toBe(true);
    expect(result.capturedRelayUrls.every((url) => /^wss?:\/\//.test(url))).toBe(true);
    expect(result.mappedRelayUrls.every((url) => url === relayOrigin)).toBe(true);
    expect(relayConnectionCount).toBeGreaterThan(0);
    expect(result.sameWindowRealm).toBe(true);
    expect(result.iframeCount).toBe(0);
});

test("uses a preconnection Full relays property instead of saved user relays", async ({ page }) => {
    const savedUserRelay = "wss://saved-user-relay.example";
    const firstHostRelay = "wss://host-relay-one.example";
    const secondHostRelay = "wss://host-relay-two.example";

    await page.goto(hostOrigin);
    await page.evaluate(async ({
        componentOrigin,
        componentStoragePrefix,
        relayOrigin,
        pubkeyHex,
        savedUserRelay,
        firstHostRelay,
        secondHostRelay,
    }) => {
        const state = { originalUrls: [] as string[] };
        const nativeWebSocket = window.WebSocket;
        window.WebSocket = new Proxy(nativeWebSocket, {
            construct(target, args, newTarget) {
                const [url, protocols] = args as [string | URL, string | string[] | undefined];
                const originalUrl = String(url);
                if (/^wss?:\/\//.test(originalUrl)) {
                    state.originalUrls.push(originalUrl);
                    return Reflect.construct(
                        target,
                        [relayOrigin, protocols].filter((value) => value !== undefined),
                        newTarget,
                    );
                }
                return Reflect.construct(target, args, newTarget);
            },
        });
        window.nostr = {
            getPublicKey: async () => pubkeyHex,
            signEvent: async (event: unknown) => event,
        } as any;
        localStorage.setItem(
            `${componentStoragePrefix}nostr-accounts`,
            JSON.stringify([{ pubkeyHex, type: "nip07", addedAt: 1 }]),
        );
        localStorage.setItem(`${componentStoragePrefix}nostr-active-account`, pubkeyHex);
        localStorage.setItem(
            `${componentStoragePrefix}nostr-relays-${pubkeyHex}`,
            JSON.stringify({ [savedUserRelay]: { read: true, write: true } }),
        );

        await import(`${componentOrigin}/ehagaki-composer.js`);
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            relays?: ReadonlyArray<{ url: string; read: boolean; write: boolean }>;
            whenReady(): Promise<void>;
        };
        composer.relays = [{ url: firstHostRelay, read: true, write: true }];
        document.body.append(composer);
        await composer.whenReady();
        (window as any).__hostRelayPropertyState = { state, composer };
    }, {
        componentOrigin,
        componentStoragePrefix,
        relayOrigin,
        pubkeyHex: testPubkeyHex,
        savedUserRelay,
        firstHostRelay,
        secondHostRelay,
    });

    await expect.poll(() => page.evaluate(() =>
        (window as any).__hostRelayPropertyState.state.originalUrls,
    )).toContain(firstHostRelay);
    await page.evaluate(async (secondHostRelay) => {
        const runtime = (window as any).__hostRelayPropertyState;
        const composer = runtime.composer as HTMLElement & {
            relays?: ReadonlyArray<{ url: string; read: boolean; write: boolean }>;
            whenReady(): Promise<void>;
        };
        // This assignment deliberately leaves the active session intact.
        composer.relays = [{ url: secondHostRelay, read: true, write: true }];
        runtime.beforeRecreate = [...runtime.state.originalUrls];
        composer.remove();
        document.body.append(composer);
        await composer.whenReady();
        runtime.afterRecreate = runtime.state.originalUrls;
        runtime.publicRelays = composer.relays;
    }, secondHostRelay);
    await expect.poll(() => page.evaluate(() =>
        (window as any).__hostRelayPropertyState.afterRecreate,
    )).toContain(secondHostRelay);
    const result = await page.evaluate(() => {
        const runtime = (window as any).__hostRelayPropertyState;
        return {
            beforeRecreate: runtime.beforeRecreate,
            afterRecreate: runtime.afterRecreate,
            publicRelays: runtime.publicRelays,
        };
    });
    expect(result.beforeRecreate).toContain(firstHostRelay);
    expect(result.beforeRecreate).not.toContain(secondHostRelay);
    expect(result.afterRecreate).toContain(secondHostRelay);
    expect(result.afterRecreate).not.toContain(savedUserRelay);
    expect(result.publicRelays).toEqual([
        { url: `${secondHostRelay}/`, read: true, write: true },
    ]);
});

test("publishes EVENT only through the configured Host write relay", async ({ page }) => {
    const savedUserRelay = "wss://saved-user-relay.example";
    const hostReadRelay = "wss://host-read-relay.example";
    const hostWriteRelay = "wss://host-write-relay.example";
    const content = "Host write relay e2e";
    const signingSecret = generateSecretKey();
    const pubkeyHex = getPublicKey(signingSecret);

    await page.goto(hostOrigin);
    await page.exposeFunction("__signHostRelayEvent", (event: Record<string, unknown>) =>
        finalizeEvent(event as any, signingSecret));
    await page.evaluate(async ({
        componentOrigin,
        componentStoragePrefix,
        relayOrigin,
        pubkeyHex,
        savedUserRelay,
        hostReadRelay,
        hostWriteRelay,
    }) => {
        const state = {
            originalUrls: [] as string[],
            eventDestinations: [] as string[],
        };
        const nativeWebSocket = window.WebSocket;
        window.WebSocket = new Proxy(nativeWebSocket, {
            construct(target, args, newTarget) {
                const [url, protocols] = args as [string | URL, string | string[] | undefined];
                const originalUrl = String(url);
                if (!/^wss?:\/\//.test(originalUrl)) {
                    return Reflect.construct(target, args, newTarget);
                }
                state.originalUrls.push(originalUrl);
                const socket = Reflect.construct(
                    target,
                    [relayOrigin, protocols].filter((value) => value !== undefined),
                    newTarget,
                ) as WebSocket;
                const send = socket.send.bind(socket);
                socket.send = ((data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
                    if (typeof data === "string" && data.startsWith('["EVENT",')) {
                        state.eventDestinations.push(originalUrl);
                    }
                    send(data);
                }) as typeof socket.send;
                return socket;
            },
        });
        window.nostr = {
            getPublicKey: async () => pubkeyHex,
            signEvent: async (event: Record<string, unknown>) =>
                (window as any).__signHostRelayEvent(event),
        } as any;
        localStorage.setItem(
            `${componentStoragePrefix}nostr-accounts`,
            JSON.stringify([{ pubkeyHex, type: "nip07", addedAt: 1 }]),
        );
        localStorage.setItem(`${componentStoragePrefix}nostr-active-account`, pubkeyHex);
        localStorage.setItem(
            `${componentStoragePrefix}nostr-relays-${pubkeyHex}`,
            JSON.stringify({ [savedUserRelay]: { read: true, write: true } }),
        );
        await import(`${componentOrigin}/ehagaki-composer.js`);
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            relays?: ReadonlyArray<{ url: string; read: boolean; write: boolean }>;
            whenReady(): Promise<void>;
        };
        composer.relays = [
            { url: hostReadRelay, read: true, write: false },
            { url: hostWriteRelay, read: false, write: true },
        ];
        document.body.append(composer);
        await composer.whenReady();
        (window as any).__hostRelayPublishState = state;
    }, {
        componentOrigin,
        componentStoragePrefix,
        relayOrigin,
        pubkeyHex,
        savedUserRelay,
        hostReadRelay,
        hostWriteRelay,
    });

    const composer = page.locator("ehagaki-composer");
    const editor = composer.locator(".tiptap-editor");
    await expect(editor).toBeVisible();
    await editor.click();
    await editor.pressSequentially(content);
    await composer.locator("button.post-button").click();

    await expect.poll(() => relayPublishedEvents.length).toBe(1);
    const result = await page.evaluate(() => (window as any).__hostRelayPublishState);
    expect(relayPublishedEvents[0]?.event.content).toBe(content);
    expect(result.eventDestinations).toEqual([hostWriteRelay]);
    expect(result.eventDestinations).not.toContain(hostReadRelay);
    expect(result.eventDestinations).not.toContain(savedUserRelay);
    expect(result.originalUrls).toContain(hostReadRelay);
    expect(result.originalUrls).not.toContain(savedUserRelay);
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
            publicPartCount: composer.shadowRoot?.querySelectorAll("[part]").length ?? 0,
            footerBackground: getComputedStyle(composer.shadowRoot!.querySelector('.footer-bar')!).backgroundColor,
            serviceWorkerControlled: !!navigator.serviceWorker.controller,
            hostFetchObserved: afterFetch.fetchCount > beforeFetch.fetchCount,
            registrationCount: registrations.length,
        };
    }, { sentinels });

    expect(result.raw).toEqual(sentinels);
    expect(result.componentKeys).toContain("ehagaki.web-component.v1:locale");
    expect(result.applied).toContain("locale");
    expect(result.shadow).toBe(true);
    expect(result.publicPartCount).toBe(0);
    expect(result.footerBackground).toBe("rgb(4, 5, 6)");
    expect(result.serviceWorkerControlled).toBe(true);
    expect(result.hostFetchObserved).toBe(true);
    expect(result.registrationCount).toBe(1);
    await expect(page.locator("#host")).toHaveText("host surface");
});

test("applies Accent/Base themes while preserving default and meaning colors", async ({ page }) => {
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
    });

    const readTheme = () => page.locator("ehagaki-composer").evaluate((element) => {
        const shadow = element.shadowRoot!;
        const shell = shadow.querySelector<HTMLElement>('.ehagaki-web-component-shell')!;
        const appRoot = shadow.querySelector<HTMLElement>(".ehagaki-app-root")!;
        const primary = shadow.querySelector<HTMLElement>("button.primary")!;
        const settingsButton = shadow.querySelector<HTMLElement>("button.settings-btn")!;
        const editor = shadow.querySelector<HTMLElement>(".editor-container")!;
        const footer = shadow.querySelector<HTMLElement>(".footer-bar")!;
        const buttonbar = shadow.querySelector<HTMLElement>(".footer-button-bar")!;
        const colorToPixel = (color: string) => {
            const canvas = document.createElement("canvas");
            canvas.width = 1;
            canvas.height = 1;
            const context = canvas.getContext("2d")!;
            context.fillStyle = color;
            context.fillRect(0, 0, 1, 1);
            return Array.from(context.getImageData(0, 0, 1, 1).data);
        };
        const style = getComputedStyle(element);
        return {
            accent: style.getPropertyValue("--accent-color").trim(),
            base: style.getPropertyValue("--base-color").trim(),
            shellBackground: getComputedStyle(shell).backgroundColor,
            shellPixel: colorToPixel(getComputedStyle(shell).backgroundColor),
            editorPixel: colorToPixel(getComputedStyle(editor).backgroundColor),
            footerPixel: colorToPixel(getComputedStyle(footer).backgroundColor),
            buttonbarPixel: colorToPixel(getComputedStyle(buttonbar).backgroundColor),
            primaryBackground: getComputedStyle(primary).backgroundColor,
            buttonPixel: colorToPixel(getComputedStyle(settingsButton).backgroundColor),
            textColor: getComputedStyle(appRoot).color,
            text: style.getPropertyValue("--text").trim(),
            link: style.getPropertyValue("--link").trim(),
            danger: style.getPropertyValue("--danger").trim(),
        };
    });

    const defaultLight = await readTheme();
    expect(defaultLight.shellPixel).toEqual([240, 240, 240, 255]);
    expect(defaultLight.buttonPixel).toEqual([255, 255, 255, 255]);
    expect(defaultLight.primaryBackground).not.toBe("rgba(0, 0, 0, 0)");

    await page.locator("ehagaki-composer").evaluate(async (element) => {
        await (element as HTMLElement & { setSettings(value: { themeMode: "dark" }): Promise<string[]> })
            .setSettings({ themeMode: "dark" });
    });
    const defaultDark = await readTheme();
    expect(defaultDark.shellPixel).toEqual([31, 31, 31, 255]);
    await page.locator("ehagaki-composer").evaluate(async (element) => {
        await (element as HTMLElement & { setSettings(value: { themeMode: "light" }): Promise<string[]> })
            .setSettings({ themeMode: "light" });
    });

    await page.locator("ehagaki-composer").evaluate((element) => {
        element.style.setProperty("--ehagaki-accent-color", "#c04444");
        element.style.setProperty("--ehagaki-base-color", "#d9e8f2");
    });
    const themedLight = await readTheme();
    expect(themedLight.accent.toLowerCase()).toContain("#c04444");
    expect(themedLight.base.toLowerCase()).toContain("#d9e8f2");
    expect(themedLight.shellPixel).not.toEqual(defaultLight.shellPixel);
    expect(themedLight.shellPixel).toEqual([242, 245, 246, 255]);
    expect(themedLight.editorPixel).toEqual([253, 254, 254, 255]);
    expect(themedLight.footerPixel).toEqual([219, 224, 227, 255]);
    expect(themedLight.buttonbarPixel).toEqual([242, 245, 246, 255]);
    expect(themedLight.primaryBackground).not.toBe(defaultLight.primaryBackground);
    expect(themedLight.buttonPixel).toEqual([246, 249, 252, 255]);
    expect(themedLight.text).toBe(defaultLight.text);
    expect(themedLight.link).toBe(defaultLight.link);
    expect(themedLight.danger).toBe(defaultLight.danger);

    await page.locator("ehagaki-composer").evaluate((element) => {
        element.style.setProperty("--ehagaki-background", "rgb(1, 2, 3)");
    });
    await expect.poll(() => page.locator("ehagaki-composer").evaluate((element) =>
        getComputedStyle(element.shadowRoot!.querySelector<HTMLElement>('.ehagaki-web-component-shell')!).backgroundColor,
    )).toBe("rgb(1, 2, 3)");

    await page.locator("ehagaki-composer").evaluate((element) => {
        element.style.removeProperty("--ehagaki-background");
    });
    await expect.poll(readTheme).toMatchObject({
        accent: "#c04444",
        base: "#d9e8f2",
    });

    const composer = page.locator("ehagaki-composer");
    await composer.evaluate(async (element) => {
        await (element as HTMLElement & { setSettings(value: { themeMode: "dark" }): Promise<string[]> })
            .setSettings({ themeMode: "dark" });
    });
    const themedDark = await readTheme();
    expect(themedDark.shellPixel).not.toEqual(themedLight.shellPixel);
    expect(themedDark.textColor).not.toBe(themedLight.textColor);
    expect(themedDark.buttonPixel).toEqual([91, 94, 96, 255]);
    expect(themedDark.danger).toBe(themedLight.danger);

    await composer.evaluate(async (element) => {
        element.style.removeProperty("--ehagaki-accent-color");
        element.style.removeProperty("--ehagaki-base-color");
        await (element as HTMLElement & { setSettings(value: { themeMode: "light" }): Promise<string[]> })
            .setSettings({ themeMode: "light" });
    });
    const standardLight = await readTheme();
    expect(standardLight.buttonPixel).toEqual(defaultLight.buttonPixel);
});

test("preserves Web Component detailed overrides and their existing dialog derivation", async ({ page }) => {
    await page.goto(hostOrigin);
    const result = await page.evaluate(async () => {
        await import(`${window.__componentOrigin}/ehagaki-composer.js`);
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            whenReady(): Promise<void>;
            setSettings(value: { themeMode: "light" }): Promise<string[]>;
        };
        document.body.append(composer);
        await composer.whenReady();
        await composer.setSettings({ themeMode: "light" });
        const overrides = {
            "--ehagaki-background": "rgb(1, 2, 3)",
            "--ehagaki-text": "rgb(4, 5, 6)",
            "--ehagaki-border": "rgb(7, 8, 9)",
            "--ehagaki-link": "rgb(10, 11, 12)",
            "--ehagaki-input-background": "rgb(13, 14, 15)",
            "--ehagaki-footer-background": "rgb(16, 17, 18)",
            "--ehagaki-dialog-background": "rgb(19, 20, 21)",
            "--ehagaki-font-family": "monospace",
        } as const;
        for (const [property, value] of Object.entries(overrides)) {
            composer.style.setProperty(property, value);
        }

        const shadow = composer.shadowRoot!;
        const shell = shadow.querySelector<HTMLElement>(".ehagaki-web-component-shell")!;
        const appRoot = shadow.querySelector<HTMLElement>(".ehagaki-app-root")!;
        const footer = shadow.querySelector<HTMLElement>(".footer-bar")!;
        const probe = document.createElement("div");
        const link = document.createElement("a");
        const input = document.createElement("input");
        const dialog = document.createElement("div");
        const dialogDerived = document.createElement("div");
        probe.style.cssText = "border: 1px solid var(--border); color: var(--text); font-family: inherit;";
        link.style.color = "var(--link)";
        input.style.background = "var(--bg-input)";
        dialog.style.background = "var(--dialog-bg)";
        dialogDerived.style.background = "var(--dialog-bg2)";
        appRoot.append(probe, link, input, dialog, dialogDerived);
        const colorToPixel = (color: string) => {
            const canvas = document.createElement("canvas");
            canvas.width = 1;
            canvas.height = 1;
            const context = canvas.getContext("2d")!;
            context.fillStyle = color;
            context.fillRect(0, 0, 1, 1);
            return Array.from(context.getImageData(0, 0, 1, 1).data);
        };
        const result = {
            shell: colorToPixel(getComputedStyle(shell).backgroundColor),
            text: getComputedStyle(appRoot).color,
            border: getComputedStyle(probe).borderTopColor,
            link: getComputedStyle(link).color,
            input: colorToPixel(getComputedStyle(input).backgroundColor),
            footer: colorToPixel(getComputedStyle(footer).backgroundColor),
            dialog: colorToPixel(getComputedStyle(dialog).backgroundColor),
            dialogDerived: colorToPixel(getComputedStyle(dialogDerived).backgroundColor),
            font: getComputedStyle(appRoot).fontFamily,
        };
        probe.remove();
        link.remove();
        input.remove();
        dialog.remove();
        dialogDerived.remove();
        return result;
    });

    expect(result.shell).toEqual([1, 2, 3, 255]);
    expect(result.text).toBe("rgb(4, 5, 6)");
    expect(result.border).toBe("rgb(7, 8, 9)");
    expect(result.link).toBe("rgb(10, 11, 12)");
    expect(result.input).toEqual([13, 14, 15, 255]);
    expect(result.footer).toEqual([16, 17, 18, 255]);
    expect(result.dialog).toEqual([19, 20, 21, 255]);
    expect(result.dialogDerived).toEqual([18, 19, 20, 255]);
    expect(result.font.toLowerCase()).toContain("monospace");
});

test("layers Web Component user, default, and forced colors across updates and recreation", async ({ page }) => {
    await page.goto(hostOrigin);
    const result = await page.evaluate(async () => {
        const storagePrefix = "ehagaki.web-component.v1:";
        localStorage.setItem(`${storagePrefix}accentColor`, "#123456");
        localStorage.setItem(`${storagePrefix}baseColor`, "#234567");
        await import(`${window.__componentOrigin}/ehagaki-composer.js`);

        const readColors = (composer: HTMLElement) => {
            const style = getComputedStyle(composer);
            return {
                accent: style.getPropertyValue("--accent-color").trim().toLowerCase(),
                base: style.getPropertyValue("--base-color").trim().toLowerCase(),
            };
        };
        const readThemeUi = (composer: HTMLElement) => {
            const shadow = composer.shadowRoot!;
            const headerButton = shadow.querySelector<HTMLButtonElement>(".header-actions button")!;
            const settingsButton = shadow.querySelector<HTMLButtonElement>(".settings-btn")!;
            const mascotParts = Array.from(shadow.querySelectorAll<SVGElement>(".site-icon [data-mascot-part]"));
            const colorToPixel = (color: string) => {
                const canvas = document.createElement("canvas");
                canvas.width = 1;
                canvas.height = 1;
                const context = canvas.getContext("2d")!;
                context.fillStyle = color;
                context.fillRect(0, 0, 1, 1);
                return Array.from(context.getImageData(0, 0, 1, 1).data);
            };
            const settingsBackground = getComputedStyle(settingsButton).backgroundColor;
            return {
                headerBorder: getComputedStyle(headerButton).borderTopColor,
                mascotPixels: mascotParts.map((part) => colorToPixel(getComputedStyle(part).fill)),
                headerBackground: getComputedStyle(headerButton).backgroundColor,
                settingsBackground,
                buttonPixel: colorToPixel(settingsBackground),
            };
        };
        const create = async (defaults: { accent: string; base: string }) => {
            const composer = document.createElement("ehagaki-composer") as HTMLElement & {
                whenReady(): Promise<void>;
            };
            composer.style.setProperty("--ehagaki-default-accent-color", defaults.accent);
            composer.style.setProperty("--ehagaki-default-base-color", defaults.base);
            document.body.append(composer);
            await composer.whenReady();
            return composer;
        };

        const first = await create({ accent: "#ABCDEF", base: "#CDEFAB" });
        const user = readColors(first);
        const userUi = readThemeUi(first);
        first.style.setProperty("--ehagaki-accent-color", "#345678");
        first.style.setProperty("--ehagaki-base-color", "#456789");
        const forced = readColors(first);
        const forcedUi = readThemeUi(first);
        first.style.removeProperty("--ehagaki-accent-color");
        first.style.removeProperty("--ehagaki-base-color");
        const released = readColors(first);
        const releasedUi = readThemeUi(first);

        const settingsButton = first.shadowRoot!.querySelector<HTMLButtonElement>("button.settings-btn")!;
        settingsButton.click();
        await new Promise<void>((resolve) => {
            const waitForSettings = () => {
                if (first.shadowRoot!.querySelector("#accent-color-input")) {
                    resolve();
                    return;
                }
                setTimeout(waitForSettings, 10);
            };
            waitForSettings();
        });
        const accentInput = first.shadowRoot!.querySelector<HTMLInputElement>("#accent-color-input")!;
        const baseInput = first.shadowRoot!.querySelector<HTMLInputElement>("#base-color-input")!;
        accentInput.value = "#56789A";
        accentInput.dispatchEvent(new Event("input", { bubbles: true }));
        baseInput.value = "#6789AB";
        baseInput.dispatchEvent(new Event("input", { bubbles: true }));
        await new Promise<void>((resolve) => setTimeout(resolve, 0));

        const afterUserUpdate = readColors(first);
        const storedAfterUserUpdate = {
            accent: localStorage.getItem(`${storagePrefix}accentColor`),
            base: localStorage.getItem(`${storagePrefix}baseColor`),
        };

        first.remove();
        const second = await create({ accent: "#ABCDEF", base: "#CDEFAB" });
        const restoredColors = readColors(second);
        second.remove();
        localStorage.removeItem(`${storagePrefix}accentColor`);
        localStorage.removeItem(`${storagePrefix}baseColor`);
        const third = await create({ accent: "#ABCDEF", base: "#CDEFAB" });
        const defaultColors = readColors(third);
        const defaultUi = readThemeUi(third);
        third.style.setProperty("--ehagaki-default-accent-color", "#FEDCBA");
        third.style.setProperty("--ehagaki-default-base-color", "#EDCBAF");
        const updatedDefaults = readColors(third);
        const updatedDefaultUi = readThemeUi(third);
        third.style.removeProperty("--ehagaki-default-accent-color");
        third.style.removeProperty("--ehagaki-default-base-color");
        const standardColors = readColors(third);
        const standardUi = readThemeUi(third);

        return {
            user,
            userUi,
            forced,
            forcedUi,
            released,
            releasedUi,
            afterUserUpdate,
            storedAfterUserUpdate,
            restoredColors,
            defaultColors,
            defaultUi,
            updatedDefaults,
            updatedDefaultUi,
            standardColors,
            standardUi,
        };
    });

    expect(result.user).toMatchObject({ accent: "#123456", base: "#234567" });
    expect(result.userUi.headerBorder).toBe("rgb(18, 52, 86)");
    expect(result.userUi.mascotPixels).toEqual([
        [18, 52, 86, 255], [219, 225, 230, 255],
        [7, 21, 34, 255], [7, 21, 34, 255], [7, 21, 34, 255],
    ]);
    expect(result.userUi.headerBackground).toBe(result.userUi.settingsBackground);
    expect(result.userUi.buttonPixel).toEqual([202, 210, 219, 255]);
    expect(result.forced).toMatchObject({ accent: "#345678", base: "#456789" });
    expect(result.forcedUi.headerBorder).toBe("rgb(52, 86, 120)");
    expect(result.forcedUi.mascotPixels).toEqual([
        [52, 86, 120, 255], [225, 230, 235, 255],
        [21, 34, 48, 255], [21, 34, 48, 255], [21, 34, 48, 255],
    ]);
    expect(result.forcedUi.headerBackground).toBe(result.forcedUi.settingsBackground);
    expect(result.forcedUi.buttonPixel).toEqual([210, 219, 227, 255]);
    expect(result.released).toMatchObject({ accent: "#123456", base: "#234567" });
    expect(result.releasedUi).toEqual(result.userUi);
    expect(result.afterUserUpdate).toMatchObject({ accent: "#56789a", base: "#6789ab" });
    expect(result.storedAfterUserUpdate).toEqual({ accent: "#56789a", base: "#6789ab" });
    expect(result.restoredColors).toMatchObject({ accent: "#56789a", base: "#6789ab" });
    expect(result.defaultColors).toMatchObject({ accent: "#abcdef", base: "#cdefab" });
    expect(result.defaultUi.headerBorder).toBe("rgb(171, 205, 239)");
    expect(result.defaultUi.mascotPixels).toEqual([
        [171, 205, 239, 255], [242, 247, 253, 255],
        [68, 82, 96, 255], [68, 82, 96, 255], [68, 82, 96, 255],
    ]);
    expect(result.defaultUi.buttonPixel).toEqual([243, 251, 235, 255]);
    expect(result.updatedDefaults).toMatchObject({ accent: "#fedcba", base: "#edcbaf" });
    expect(result.updatedDefaultUi.headerBorder).toBe("rgb(254, 220, 186)");
    expect(result.updatedDefaultUi.mascotPixels).toEqual([
        [254, 220, 186, 255], [255, 250, 245, 255],
        [102, 88, 74, 255], [102, 88, 74, 255], [102, 88, 74, 255],
    ]);
    expect(result.updatedDefaultUi.buttonPixel).toEqual([251, 243, 236, 255]);
    expect(result.standardColors.accent).not.toBe("#fedcba");
    expect(result.standardColors.base).toBe("");
    expect(result.standardUi.headerBorder).toBe("rgb(229, 56, 56)");
    expect(result.standardUi.mascotPixels).toEqual([
        [63, 181, 126, 255], [237, 252, 245, 255],
        [77, 82, 79, 255], [77, 82, 79, 255], [77, 82, 79, 255],
    ]);
});

test("keeps bounded container layout inside the component while host page scrolls", async ({ page }) => {
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
                position: getComputedStyle(shadow.querySelector<HTMLElement>(".footer-bar")!).position,
                component: { top: componentRect.top, bottom: componentRect.bottom, left: componentRect.left, right: componentRect.right },
                footer: rect(".footer-bar"),
                buttonBar: rect(".footer-button-bar"),
                reason: rect(".reason-input-container"),
            };
        };

        const mount = document.querySelector<HTMLDivElement>("#mount")!;
        const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        const create = async () => {
            mount.replaceChildren();
            window.scrollTo(0, 0);
            const composer = document.createElement("ehagaki-composer") as HTMLElement & {
                whenReady(): Promise<void>;
            };
            composer.style.display = "block";
            composer.style.height = "100%";
            mount.append(composer);
            await composer.whenReady();
            const initial = measure(composer);
            const contentWarningToggle = composer.shadowRoot!.querySelector<HTMLElement>(".content-warning-icon")?.closest("button");
            if (contentWarningToggle && !contentWarningToggle.classList.contains("selected")) {
                contentWarningToggle.click();
            }
            await nextFrame();
            await nextFrame();
            const before = measure(composer);
            contentWarningToggle?.click();
            await nextFrame();
            await nextFrame();
            const off = measure(composer);
            window.scrollTo(0, 300);
            await nextFrame();
            const after = measure(composer);
            return { initial, before, off, after };
        };

        return create();
    });

    expect(result.initial.reason).toBeNull();
    expect(result.before.reason).not.toBeNull();
    expect(result.off.reason).toBeNull();
    expect(result.before.footer).not.toBeNull();
    expect(result.before.buttonBar).not.toBeNull();
    expect(result.before.position).toBe("absolute");
    for (const item of [result.before.footer, result.before.buttonBar, result.before.reason]) {
        expect(item!.left).toBeGreaterThanOrEqual(result.before.component.left - 1);
        expect(item!.right).toBeLessThanOrEqual(result.before.component.right + 1);
        expect(item!.bottom).toBeLessThanOrEqual(result.before.component.bottom + 1);
    }
    expect(result.after.footer!.top - result.before.footer!.top).toBeLessThan(-200);
});

test("preserves the connected component after hiding and redisplaying its parent", async ({ page }) => {
    await page.goto(hostOrigin);
    await page.evaluate(async () => {
        await import(`${window.__componentOrigin}/ehagaki-composer.js`);
        document.body.innerHTML = `
            <div id="mount-wrapper">
                <div id="mount" style="height: 420px; width: 360px"></div>
            </div>
        `;

        const mount = document.querySelector<HTMLDivElement>("#mount")!;
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            whenReady(): Promise<void>;
        };
        composer.style.display = "block";
        composer.style.height = "100%";
        mount.append(composer);
        await composer.whenReady();
        (window as Window & { __hiddenRedisplayComposer?: HTMLElement }).__hiddenRedisplayComposer = composer;
    });

    const composer = page.locator("ehagaki-composer");
    const editor = composer.locator(".tiptap-editor");
    await expect(editor).toBeVisible();
    await editor.click();
    await editor.pressSequentially("hidden parent keeps this draft");
    await expect(editor).toHaveText("hidden parent keeps this draft");

    const before = await composer.evaluate((element) => {
        const shadow = element.shadowRoot!;
        const rect = (selector: string) => shadow.querySelector<HTMLElement>(selector)!.getBoundingClientRect().toJSON();
        const component = element.getBoundingClientRect().toJSON();
        return {
            component,
            editor: rect(".tiptap-editor"),
            footer: rect(".footer-bar"),
            buttonBar: rect(".footer-button-bar"),
        };
    });

    await page.locator("#mount-wrapper").evaluate((wrapper) => {
        (wrapper as HTMLElement).style.display = "none";
    });
    await expect(page.locator("#mount-wrapper")).toBeHidden();
    expect(await composer.evaluate((element) => ({
        isConnected: element.isConnected,
        sameInstance: element === (window as Window & { __hiddenRedisplayComposer?: HTMLElement }).__hiddenRedisplayComposer,
        width: element.getBoundingClientRect().width,
        height: element.getBoundingClientRect().height,
    }))).toEqual({ isConnected: true, sameInstance: true, width: 0, height: 0 });

    await page.locator("#mount-wrapper").evaluate((wrapper) => {
        (wrapper as HTMLElement).style.display = "";
    });
    await expect(page.locator("#mount-wrapper")).toBeVisible();
    await expect(composer).toBeVisible();
    await expect(editor).toBeVisible();
    await expect(composer.locator(".ehagaki-web-component-shell")).toBeVisible();
    await expect(composer.locator(".footer-bar")).toBeVisible();
    await expect(composer.locator(".footer-button-bar")).toBeVisible();
    await expect.poll(() => composer.evaluate((element) => {
        const shadow = element.shadowRoot!;
        const component = element.getBoundingClientRect();
        const editorSurface = shadow.querySelector<HTMLElement>(".tiptap-editor")!.getBoundingClientRect();
        const footer = shadow.querySelector<HTMLElement>(".footer-bar")!.getBoundingClientRect();
        const buttonBar = shadow.querySelector<HTMLElement>(".footer-button-bar")!.getBoundingClientRect();
        return [component, editorSurface, footer, buttonBar].every((rect) =>
            rect.width > 0 && rect.height > 0
            && rect.left >= component.left - 1
            && rect.right <= component.right + 1
            && rect.top >= component.top - 1
            && rect.bottom <= component.bottom + 1,
        );
    })).toBe(true);

    expect(await composer.evaluate((element) => element === (window as Window & {
        __hiddenRedisplayComposer?: HTMLElement;
    }).__hiddenRedisplayComposer)).toBe(true);
    await expect(editor).toHaveText("hidden parent keeps this draft");
    await editor.press("End");
    await editor.pressSequentially(" and accepts more input");
    await expect(editor).toHaveText("hidden parent keeps this draft and accepts more input");

    const after = await composer.evaluate((element) => {
        const shadow = element.shadowRoot!;
        const rect = (selector: string) => shadow.querySelector<HTMLElement>(selector)!.getBoundingClientRect().toJSON();
        return {
            component: element.getBoundingClientRect().toJSON(),
            editor: rect(".tiptap-editor"),
            footer: rect(".footer-bar"),
            buttonBar: rect(".footer-button-bar"),
        };
    });
    expect(after.component.width).toBeCloseTo(before.component.width, 0);
    expect(after.component.height).toBeCloseTo(before.component.height, 0);
    expect(after.editor.height).toBeGreaterThan(0);
    expect(after.footer.height).toBeGreaterThan(0);
    expect(after.buttonBar.height).toBeGreaterThan(0);
});

test("preserves composer geometry after repeated destroy and recreate", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await page.goto(hostOrigin);
    const result = await page.evaluate(async () => {
        await import(`${window.__componentOrigin}/ehagaki-composer.js`);
        document.body.innerHTML = `
            <div style="height: 800px">before</div>
            <div id="mount" style="height: 420px; width: 360px"></div>
            <div style="height: 800px">after</div>
        `;

        const mount = document.querySelector<HTMLDivElement>("#mount")!;
        const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        const rect = (element: Element | null) => {
            if (!(element instanceof HTMLElement)) return null;
            const value = element.getBoundingClientRect();
            return {
                top: value.top,
                bottom: value.bottom,
                width: value.width,
                height: value.height,
            };
        };
        const measure = (composer: HTMLElement) => {
            const shadow = composer.shadowRoot!;
            return {
                component: rect(composer),
                main: rect(shadow.querySelector("main")),
                composerScrollRegion: rect(shadow.querySelector(".composer-scroll-region")),
                composerScrollContent: rect(shadow.querySelector(".composer-scroll-content")),
                postEditor: rect(shadow.querySelector("[data-post-editor-root]")),
                editorContainer: rect(shadow.querySelector(".editor-container")),
                editorSurface: rect(shadow.querySelector(".tiptap-editor")),
                footer: rect(shadow.querySelector(".footer-bar")),
                buttonBar: rect(shadow.querySelector(".footer-button-bar")),
            };
        };
        const create = async () => {
            mount.replaceChildren();
            const composer = document.createElement("ehagaki-composer") as HTMLElement & {
                whenReady(): Promise<void>;
            };
            composer.style.display = "block";
            composer.style.height = "100%";
            mount.append(composer);
            await composer.whenReady();
            for (let frame = 0; frame < 10; frame += 1) {
                await nextFrame();
            }
            return measure(composer);
        };

        const containerInitial = await create();
        const containerRecreated = await create();
        const containerRecreatedAgain = await create();
        return {
            containerInitial,
            containerRecreated,
            containerRecreatedAgain,
        };
    });

    const requiredGeometry = [
        "component",
        "main",
        "composerScrollRegion",
        "composerScrollContent",
        "postEditor",
        "editorContainer",
        "editorSurface",
        "footer",
        "buttonBar",
    ] as const;
    expect(pageErrors).toEqual([]);
    const assertGeometry = (label: string, snapshot: typeof result.containerInitial) => {
        for (const key of requiredGeometry) {
            expect(snapshot[key], `${label}: ${key} should be present`).not.toBeNull();
            expect(snapshot[key]!.height, `${label}: ${key} should retain a visible height`).toBeGreaterThan(0);
        }
    };
    const expectSameGeometry = (
        initial: typeof result.containerInitial,
        recreated: typeof result.containerInitial,
    ) => {
        for (const key of requiredGeometry) {
            expect(recreated[key]!.height, `${key} height should survive recreate`)
                .toBeCloseTo(initial[key]!.height, 0);
        }
    };

    for (const [label, snapshot] of Object.entries(result)) {
        assertGeometry(label, snapshot);
    }
    expectSameGeometry(result.containerInitial, result.containerRecreated);
    expectSameGeometry(result.containerInitial, result.containerRecreatedAgain);
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
        await new Promise<void>((resolve) => {
            const selectors = [
                "svg.site-icon",
                "a.site-icon-link",
                ".trash-icon",
                ".login-icon",
                ".settings-icon",
            ];
            const observer = new MutationObserver(() => {
                if (selectors.every((selector) => shadow.querySelector(selector))) {
                    observer.disconnect();
                    resolve();
                }
            });
            observer.observe(shadow, { childList: true, subtree: true });
            if (selectors.every((selector) => shadow.querySelector(selector))) {
                observer.disconnect();
                resolve();
            }
        });
        const mascot = shadow.querySelector<SVGElement>("svg.site-icon");
        const siteIconLink = shadow.querySelector<HTMLAnchorElement>("a.site-icon-link")!;
        const masks = [
            shadow.querySelector<HTMLElement>(".trash-icon")!,
            shadow.querySelector<HTMLElement>(".login-icon")!,
            shadow.querySelector<HTMLElement>(".settings-icon")!,
        ].map((icon) => getComputedStyle(icon).maskImage);
        return {
            hasInlineMascot: mascot !== null,
            masks,
            siteIconHrefAttribute: siteIconLink.getAttribute("href"),
            siteIconHref: siteIconLink.href,
            siteIconTarget: siteIconLink.getAttribute("target"),
            siteIconRel: siteIconLink.getAttribute("rel"),
        };
    });

    expect(result.hasInlineMascot).toBe(true);
    expect(result.siteIconHrefAttribute).toBe("https://lokuyow.github.io/ehagaki/");
    expect(result.siteIconHref).toBe("https://lokuyow.github.io/ehagaki/");
    expect(result.siteIconTarget).toBe("_blank");
    expect(result.siteIconRel).toBe("noopener noreferrer");
    expect(result.siteIconHref).not.toContain(hostOrigin);
    for (const mask of result.masks) {
        expect(mask).not.toBe("none");
        expect(mask).toContain(componentOrigin);
    }
    expect([...hostRequests].some((path) =>
        path.startsWith("/icons/"))).toBe(false);
    await expect.poll(
        () => [...componentRequests].some((path) => path.startsWith("/icons/")),
        { message: "component server should receive a request for an app-owned mask icon" },
    ).toBe(true);
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
        const secondReady = await second.whenReady().then(
            () => ({ resolved: true, errorName: null }),
            (error) => ({ resolved: false, errorName: error.name }),
        );
        first.remove();
        const replacement = document.createElement("ehagaki-composer") as HTMLElement & { whenReady(): Promise<void> };
        document.body.append(replacement);
        await replacement.whenReady();
        return { errors, secondReady, replacementReady: !!replacement.shadowRoot };
    });

    expect(result.errors).toEqual(["multiple_instances_unsupported"]);
    expect(result.secondReady).toEqual({ resolved: false, errorName: "multiple_instances_unsupported" });
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

test("applies the common desktop hover colors inside the Shadow DOM", async ({ page, isMobile }) => {
    test.skip(isMobile, "Common hover styles are intentionally disabled on touch projects.");
    await page.goto(hostOrigin);
    await page.evaluate(async () => {
        await import(`${window.__componentOrigin}/ehagaki-composer.js`);
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            whenReady(): Promise<void>;
            setSettings(value: { themeMode: "light" }): Promise<string[]>;
        };
        document.body.append(composer);
        await composer.whenReady();
        await composer.setSettings({ themeMode: "light" });
    });

    const settingsButton = page.locator("ehagaki-composer").locator("button.settings-btn");
    await expect(settingsButton).toBeVisible();
    const before = await settingsButton.evaluate((button) => {
        const icon = button.querySelector<HTMLElement>(".svg-icon")!;
        const buttonStyle = getComputedStyle(button);
        return {
            background: buttonStyle.backgroundColor,
            color: buttonStyle.color,
            iconBackground: getComputedStyle(icon).backgroundColor,
        };
    });
    await settingsButton.hover();
    const after = await settingsButton.evaluate((button) => {
        const icon = button.querySelector<HTMLElement>(".svg-icon")!;
        const buttonStyle = getComputedStyle(button);
        return {
            background: buttonStyle.backgroundColor,
            color: buttonStyle.color,
            iconBackground: getComputedStyle(icon).backgroundColor,
        };
    });
    expect(after.background).not.toBe(before.background);
    expect(after.color).not.toBe(before.color);
    expect(after.iconBackground).not.toBe(before.iconBackground);
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
        const overlay = shadow?.querySelector('.ehagaki-web-component-overlays');
        return !!overlay?.querySelector(".login-dialog");
    });

    await page.evaluate(() => {
        const shadow = document.querySelector("ehagaki-composer")!.shadowRoot!;
        const overlay = shadow.querySelector<HTMLElement>('.ehagaki-web-component-overlays')!;
        overlay.querySelector<HTMLDetailsElement>(".remote-signer-details")!.open = true;
    });
    await page.waitForFunction(() =>
        !!document.querySelector("ehagaki-composer")?.shadowRoot
            ?.querySelector('.ehagaki-web-component-overlays [data-testid="nostrconnect-regenerate"]'),
    );
    const lightResult = await page.evaluate(() => {
        const shadow = document.querySelector("ehagaki-composer")!.shadowRoot!;
        const overlay = shadow.querySelector<HTMLElement>('.ehagaki-web-component-overlays')!;
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
                '.ehagaki-web-component-overlays .login-dialog',
            )!,
        ).backgroundColor;
    });
    expect(darkDialogBackground).not.toBe(lightResult.dialogBackground);
});

test("offers NIP-07 and NIP-46 without rendering local nsec login UI", async ({ page }) => {
    await page.goto(hostOrigin);
    await page.evaluate(async (pubkeyHex) => {
        window.nostr = {
            getPublicKey: async () => pubkeyHex,
            signEvent: async (event: any) => ({ ...event, id: "66".repeat(32), sig: "77".repeat(64) }),
        };
        await import(`${window.__componentOrigin}/ehagaki-composer.js`);
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            whenReady(): Promise<void>;
        };
        composer.style.width = "360px";
        composer.style.height = "600px";
        document.body.append(composer);
        await composer.whenReady();
    }, testPubkeyHex);

    await page.waitForFunction(() =>
        !!document.querySelector("ehagaki-composer")?.shadowRoot?.querySelector("button.login-btn"),
    );
    await page.evaluate(() => {
        document.querySelector("ehagaki-composer")!.shadowRoot!
            .querySelector<HTMLButtonElement>("button.login-btn")!.click();
    });
    await page.waitForFunction(() =>
        !!document.querySelector("ehagaki-composer")?.shadowRoot
            ?.querySelector('.ehagaki-web-component-overlays .login-dialog'),
    );
    const result = await page.evaluate(() => {
        const composer = document.querySelector("ehagaki-composer")!;
        const shadow = composer.shadowRoot!;
        const overlay = shadow.querySelector<HTMLElement>('.ehagaki-web-component-overlays')!;
        const dialog = overlay.querySelector<HTMLElement>(".login-dialog")!;
        const componentRect = composer.getBoundingClientRect();
        const dialogRect = dialog.getBoundingClientRect();
        return {
            secretInputCount: dialog.querySelectorAll('#secretKey, input[placeholder="nsec1..."]').length,
            secretSectionCount: dialog.querySelectorAll(".secret-key-section").length,
            nip07Visible: !!dialog.querySelector(".nip07-login-button"),
            nip07Enabled: !dialog.querySelector<HTMLButtonElement>(".nip07-login-button")?.disabled,
            nip46Visible: !!dialog.querySelector(".nostrconnect-open-btn"),
            hasAddedWarning: /Web Component.*秘密鍵|秘密鍵.*入力しない/.test(dialog.textContent ?? ""),
            fitsComponent:
                dialogRect.left >= componentRect.left - 1
                && dialogRect.right <= componentRect.right + 1
                && dialogRect.top >= componentRect.top - 1
                && dialogRect.bottom <= componentRect.bottom + 1,
        };
    });

    expect(result).toEqual({
        secretInputCount: 0,
        secretSectionCount: 0,
        nip07Visible: true,
        nip07Enabled: true,
        nip46Visible: true,
        hasAddedWarning: false,
        fitsComponent: true,
    });
});

test("cleans only legacy Web Component nsec state and restores the remaining NIP-07 account", async ({ page }) => {
    await page.goto(hostOrigin);
    const nsecPubkey = "aa".repeat(32);
    const nip46Pubkey = "bb".repeat(32);
    await page.evaluate(async ({ componentStoragePrefix, nsecPubkey, nip07Pubkey, nip46Pubkey }) => {
        window.nostr = {
            getPublicKey: async () => nip07Pubkey,
            signEvent: async (event: any) => ({ ...event, id: "88".repeat(32), sig: "99".repeat(64) }),
        };
        localStorage.setItem(
            `${componentStoragePrefix}nostr-accounts`,
            JSON.stringify([
                { pubkeyHex: nsecPubkey, type: "nsec", addedAt: 1 },
                { pubkeyHex: nip07Pubkey, type: "nip07", addedAt: 2 },
                { pubkeyHex: nip46Pubkey, type: "nip46", addedAt: 3 },
            ]),
        );
        localStorage.setItem(`${componentStoragePrefix}nostr-active-account`, nsecPubkey);
        localStorage.setItem(`${componentStoragePrefix}nostr-secret-key`, "legacy-component-credential");
        localStorage.setItem(`${componentStoragePrefix}nostr-secret-key-${nsecPubkey}`, "managed-component-credential");
        localStorage.setItem(`${componentStoragePrefix}nostr-nip46-session-${nip46Pubkey}`, "nip46-session-sentinel");
        localStorage.setItem(`${componentStoragePrefix}component-sentinel`, "keep");

        await import(`${window.__componentOrigin}/ehagaki-composer.js`);
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            whenReady(): Promise<void>;
        };
        document.body.append(composer);
        await composer.whenReady();
    }, {
        componentStoragePrefix,
        nsecPubkey,
        nip07Pubkey: testPubkeyHex,
        nip46Pubkey,
    });

    await page.waitForFunction(() =>
        !!document.querySelector("ehagaki-composer")?.shadowRoot?.querySelector(".profile-display"),
    );
    const result = await page.evaluate(({ componentStoragePrefix, nsecPubkey, nip46Pubkey, sentinels }) => ({
        accounts: JSON.parse(localStorage.getItem(`${componentStoragePrefix}nostr-accounts`) ?? "[]"),
        activeAccount: localStorage.getItem(`${componentStoragePrefix}nostr-active-account`),
        legacyCredential: localStorage.getItem(`${componentStoragePrefix}nostr-secret-key`),
        managedCredential: localStorage.getItem(`${componentStoragePrefix}nostr-secret-key-${nsecPubkey}`),
        nip46Session: localStorage.getItem(`${componentStoragePrefix}nostr-nip46-session-${nip46Pubkey}`),
        componentSentinel: localStorage.getItem(`${componentStoragePrefix}component-sentinel`),
        rawHostValues: Object.fromEntries(
            Object.keys(sentinels).map((key) => [key, localStorage.getItem(key)]),
        ),
    }), { componentStoragePrefix, nsecPubkey, nip46Pubkey, sentinels });

    expect(result.accounts).toEqual([
        { pubkeyHex: testPubkeyHex, type: "nip07", addedAt: 2 },
        { pubkeyHex: nip46Pubkey, type: "nip46", addedAt: 3 },
    ]);
    expect(result.activeAccount).toBe(testPubkeyHex);
    expect(result.legacyCredential).toBeNull();
    expect(result.managedCredential).toBeNull();
    expect(result.nip46Session).toBe("nip46-session-sentinel");
    expect(result.componentSentinel).toBe("keep");
    expect(result.rawHostValues).toEqual(sentinels);
});

test("keeps authenticated profile and post history dialogs inside the component", async ({ page }) => {
    await page.goto(hostOrigin);
    const result = await page.evaluate(async ({ componentStoragePrefix, testPubkeyHex }) => {
        window.nostr = {
            getPublicKey: async () => testPubkeyHex,
            signEvent: async (event: any) => ({ ...event, id: "22".repeat(32), sig: "33".repeat(64) }),
        };
        localStorage.setItem(
            `${componentStoragePrefix}nostr-accounts`,
            JSON.stringify([{ pubkeyHex: testPubkeyHex, type: "nip07", addedAt: 1 }]),
        );
        localStorage.setItem(`${componentStoragePrefix}nostr-active-account`, testPubkeyHex);
        await import(`${window.__componentOrigin}/ehagaki-composer.js`);
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            whenReady(): Promise<void>;
        };
        composer.style.width = "360px";
        composer.style.height = "520px";
        document.body.append(composer);
        await composer.whenReady();
        const shadow = composer.shadowRoot!;
        const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        for (let frame = 0; frame < 8; frame += 1) await nextFrame();
        const profileButton = shadow.querySelector<HTMLButtonElement>(".profile-display");
        if (!profileButton) throw new Error("authenticated profile button did not render");
        profileButton.click();
        for (let frame = 0; frame < 8; frame += 1) await nextFrame();
        const overlayRoot = shadow.querySelector<HTMLElement>('.ehagaki-web-component-overlays')!;
        const rect = (element: Element | null) => {
            if (!(element instanceof HTMLElement)) return null;
            const value = element.getBoundingClientRect();
            return { top: value.top, bottom: value.bottom, left: value.left, right: value.right };
        };
        const profileDialog = overlayRoot.querySelector<HTMLElement>(".profile-dialog");
        const profileOverlay = overlayRoot.querySelector<HTMLElement>(".dialog-overlay");
        const profileIds = Array.from(overlayRoot.querySelectorAll<HTMLElement>(".profile-info-text"));
        const profileCopyButtons = Array.from(overlayRoot.querySelectorAll<HTMLButtonElement>(".profile-info-content .copy-button"));
        const profile = {
            dialog: rect(profileDialog),
            overlay: rect(profileOverlay),
            wrapped: profileIds.some((element) => element.getBoundingClientRect().height > 20),
            idsFit: profileIds.every((element) => element.scrollWidth <= element.clientWidth),
            copyButtonsFit: profileCopyButtons.every((element) => element.getBoundingClientRect().width >= 40),
        };
        overlayRoot.querySelector<HTMLButtonElement>(".modal-close")?.click();
        for (let frame = 0; frame < 8; frame += 1) await nextFrame();
        const historyButton = shadow.querySelector<HTMLButtonElement>(".post-history-btn");
        if (!historyButton) throw new Error("post history button did not render");
        historyButton.click();
        for (let frame = 0; frame < 12; frame += 1) await nextFrame();
        const historyDialog = overlayRoot.querySelector<HTMLElement>(".post-history-dialog");
        const historyOverlay = overlayRoot.querySelector<HTMLElement>(".dialog-overlay");
        const historyList = overlayRoot.querySelector<HTMLElement>(".post-history-container");
        const historyFooter = overlayRoot.querySelector<HTMLElement>(".dialog-footer");
        const history = {
            dialog: rect(historyDialog),
            overlay: rect(historyOverlay),
            list: rect(historyList),
            footer: rect(historyFooter),
            listScrollHeight: historyList?.scrollHeight ?? 0,
            listClientHeight: historyList?.clientHeight ?? 0,
        };
        overlayRoot.querySelector<HTMLButtonElement>(".modal-close")?.click();
        for (let frame = 0; frame < 8; frame += 1) await nextFrame();
        return {
            component: rect(composer),
            profile,
            history,
        };
    }, { componentStoragePrefix, testPubkeyHex });

    expect(result.profile.dialog).not.toBeNull();
    expect(result.profile.overlay).not.toBeNull();
    expect(result.profile.wrapped).toBe(true);
    expect(result.profile.idsFit).toBe(true);
    expect(result.profile.copyButtonsFit).toBe(true);
    const component = result.component!;
    for (const surface of [result.profile.dialog, result.profile.overlay, result.history.dialog, result.history.overlay]) {
        expect(surface!.left).toBeGreaterThanOrEqual(component.left - 1);
        expect(surface!.right).toBeLessThanOrEqual(component.right + 1);
    }
    for (const surface of [result.profile.dialog, result.profile.overlay]) {
        expect(surface!.top).toBeGreaterThanOrEqual(component.top - 1);
        expect(surface!.bottom).toBeLessThanOrEqual(component.bottom + 1);
    }
    expect(result.history.dialog!.top).toBeCloseTo(component.top, 0);
    expect(result.history.dialog!.bottom).toBeCloseTo(component.bottom, 0);
    expect(result.history.footer!.bottom).toBeCloseTo(component.bottom, 0);
    expect(result.history.list!.bottom).toBeCloseTo(result.history.footer!.top, 0);
    expect(result.history.listScrollHeight).toBeLessThanOrEqual(result.history.listClientHeight + 1);
});

test("restores Web Component image focus without using browser history", async ({ page }) => {
    const imageBody = Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
        "base64",
    );
    await page.route("**/web-component-focus-image.jpg", (route) =>
        route.fulfill({
            status: 200,
            contentType: "image/png",
            body: imageBody,
        }),
    );
    await page.goto(hostOrigin);

    await page.evaluate(async () => {
        await import(`${window.__componentOrigin}/ehagaki-composer.js`);
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            whenReady(): Promise<void>;
        };
        composer.style.width = "360px";
        composer.style.height = "520px";
        document.body.append(composer);
        await composer.whenReady();
        const shadow = composer.shadowRoot!;
        // The public embed API has no media-insertion method; exercise the
        // component's real image-fullscreen ingress from a Shadow DOM image button.
        const imageButton = document.createElement("button");
        imageButton.type = "button";
        imageButton.className = "web-component-focus-image";
        imageButton.setAttribute("aria-label", "Focus image");
        const image = document.createElement("img");
        image.src = `${location.origin}/web-component-focus-image.jpg`;
        image.alt = "Focus image";
        imageButton.append(image);
        imageButton.addEventListener("click", () => {
            window.dispatchEvent(new CustomEvent("image-fullscreen-request", {
                detail: { src: image.src, alt: image.alt },
            }));
        });
        shadow.append(imageButton);
    });

    const composer = page.locator("ehagaki-composer");
    const image = composer.locator(".web-component-focus-image");
    await expect(composer.locator(".tiptap-editor")).toBeVisible();
    const beforeOpen = await page.evaluate(() => ({
        length: history.length,
        state: history.state,
    }));
    await image.focus();
    await expect(image).toBeFocused();
    await image.press("Enter");
    await expect(composer.locator(".ehagaki-pswp")).toBeVisible();
    const duringViewer = await page.evaluate(() => ({
        length: history.length,
        state: history.state,
    }));
    expect(duringViewer).toEqual(beforeOpen);

    await page.keyboard.press("Escape");
    await expect(composer.locator(".ehagaki-pswp")).toBeHidden();
    await expect(image).toBeFocused();
    const afterClose = await page.evaluate(() => ({
        length: history.length,
        state: history.state,
    }));
    expect(afterClose).toEqual(beforeOpen);
});

test("keeps a large Web Component post history list scrolling above its footer", async ({ page }) => {
    await page.goto(hostOrigin);
    const result = await page.evaluate(async ({ componentStoragePrefix, testPubkeyHex }) => {
        window.nostr = {
            getPublicKey: async () => testPubkeyHex,
            signEvent: async (event: any) => ({ ...event, id: "44".repeat(32), sig: "55".repeat(64) }),
        };
        localStorage.setItem(
            `${componentStoragePrefix}nostr-accounts`,
            JSON.stringify([{ pubkeyHex: testPubkeyHex, type: "nip07", addedAt: 1 }]),
        );
        localStorage.setItem(`${componentStoragePrefix}nostr-active-account`, testPubkeyHex);
        await import(`${window.__componentOrigin}/ehagaki-composer.js`);
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            whenReady(): Promise<void>;
            setSettings(value: { themeMode: "light" }): Promise<string[]>;
        };
        composer.style.width = "360px";
        composer.style.height = "520px";
        document.body.append(composer);
        await composer.whenReady();
        await composer.setSettings({ themeMode: "light" });
        const shadow = composer.shadowRoot!;
        const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        for (let frame = 0; frame < 8; frame += 1) await nextFrame();
        const postHistoryButton = shadow.querySelector<HTMLButtonElement>(".post-history-btn");
        const settingsButton = shadow.querySelector<HTMLButtonElement>(".settings-btn")!;
        const profileButton = shadow.querySelector<HTMLButtonElement>(".profile-display");
        if (!postHistoryButton || !profileButton) {
            throw new Error("authenticated footer buttons did not render");
        }
        composer.style.setProperty("--ehagaki-base-color", "#d9e8f2");
        await nextFrame();
        const profileStyle = getComputedStyle(profileButton);
        const buttonColors = {
            postHistory: getComputedStyle(postHistoryButton).backgroundColor,
            settings: getComputedStyle(settingsButton).backgroundColor,
            profile: profileStyle.backgroundColor,
            profileToken: profileStyle.getPropertyValue("--btn-bg").trim(),
            profileEditorToken: profileStyle.getPropertyValue("--surface-editor").trim(),
            postHistoryToken: getComputedStyle(postHistoryButton).getPropertyValue("--btn-bg").trim(),
        };

        const now = Date.now();
        const records = Array.from({ length: 70 }, (_, index) => {
            const postedAt = now - index * 24 * 60 * 60 * 1000;
            return {
                id: `web-component-post-${index}`,
                eventId: `${index.toString(16).padStart(62, "0")}aa`,
                pubkeyHex: testPubkeyHex,
                kind: 1,
                content: `web component post ${index + 1}`,
                tags: [],
                createdAt: Math.floor(postedAt / 1000),
                postedAt,
                relayHints: [],
                acceptedRelays: [],
                media: [],
                rawEvent: null,
                fetchedAt: postedAt,
                lastSeenAt: postedAt,
                updatedAt: postedAt,
                schemaVersion: 2,
            };
        });
        await new Promise<void>((resolve, reject) => {
            const request = indexedDB.open("eHagakiDB");
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const database = request.result;
                const transaction = database.transaction("postHistory", "readwrite");
                transaction.onerror = () => reject(transaction.error);
                transaction.oncomplete = () => {
                    database.close();
                    resolve();
                };
                const store = transaction.objectStore("postHistory");
                store.clear();
                for (const record of records) store.put(record);
            };
        });

        shadow.querySelector<HTMLButtonElement>(".post-history-btn")?.click();
        for (let frame = 0; frame < 120; frame += 1) {
            await nextFrame();
            const list = shadow.querySelector<HTMLElement>(".post-history-container");
            if ((list?.scrollHeight ?? 0) > (list?.clientHeight ?? 0)) break;
        }
        const overlayRoot = shadow.querySelector<HTMLElement>('.ehagaki-web-component-overlays')!;
        const list = overlayRoot.querySelector<HTMLElement>(".post-history-container")!;
        const footer = overlayRoot.querySelector<HTMLElement>(".dialog-footer")!;
        const dialog = overlayRoot.querySelector<HTMLElement>(".post-history-dialog")!;
        const overlay = overlayRoot.querySelector<HTMLElement>(".dialog-overlay")!;
        const componentRect = composer.getBoundingClientRect();
        const rect = (element: Element) => {
            const value = element.getBoundingClientRect();
            return { top: value.top, bottom: value.bottom, left: value.left, right: value.right };
        };
        const beforeScroll = {
            component: rect(composer),
            dialog: rect(dialog),
            overlay: rect(overlay),
            list: rect(list),
            footer: rect(footer),
            scrollHeight: list.scrollHeight,
            clientHeight: list.clientHeight,
            footerTop: footer.getBoundingClientRect().top,
        };
        list.scrollTop = list.scrollHeight;
        list.dispatchEvent(new Event("scroll", { bubbles: true }));
        for (let frame = 0; frame < 8; frame += 1) await nextFrame();
        return {
            beforeScroll,
            afterScroll: {
                list: rect(list),
                footer: rect(footer),
                scrollTop: list.scrollTop,
                footerTop: footer.getBoundingClientRect().top,
            },
            componentRect,
            buttonColors,
        };
    }, { componentStoragePrefix, testPubkeyHex });

    const component = result.beforeScroll.component;
    expect(result.beforeScroll.scrollHeight).toBeGreaterThan(result.beforeScroll.clientHeight);
    for (const surface of [result.beforeScroll.dialog, result.beforeScroll.overlay]) {
        expect(surface.left).toBeGreaterThanOrEqual(component.left - 1);
        expect(surface.right).toBeLessThanOrEqual(component.right + 1);
        expect(surface.top).toBeGreaterThanOrEqual(component.top - 1);
        expect(surface.bottom).toBeLessThanOrEqual(component.bottom + 1);
    }
    expect(result.beforeScroll.dialog.top).toBeCloseTo(component.top, 0);
    expect(result.beforeScroll.dialog.bottom).toBeCloseTo(component.bottom, 0);
    expect(result.beforeScroll.list.bottom).toBeLessThanOrEqual(result.beforeScroll.footer.top + 1);
    expect(result.beforeScroll.footer.bottom).toBeCloseTo(component.bottom, 0);
    expect(result.afterScroll.scrollTop).toBeGreaterThan(0);
    expect(result.afterScroll.list.bottom).toBeCloseTo(result.beforeScroll.list.bottom, 0);
    expect(result.afterScroll.footer.bottom).toBeCloseTo(component.bottom, 0);
    expect(result.afterScroll.footerTop).toBeCloseTo(result.beforeScroll.footerTop, 0);
    expect(result.buttonColors.postHistory).toBe(result.buttonColors.settings);
    expect(result.buttonColors.profileToken).toBe(result.buttonColors.profileEditorToken);
    expect(result.buttonColors.profileToken).not.toBe(result.buttonColors.postHistoryToken);
    expect(result.buttonColors.postHistory).not.toBe(result.buttonColors.profile);
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
            buttonBackground: getComputedStyle(primary).getPropertyValue("--btn-bg").trim(),
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

test("uses a verified preloaded event in Direct Web Component setContext", async ({ page }) => {
    await page.goto(hostOrigin);
    const event = finalizeEvent({
        kind: 1,
        content: "web component preloaded reply",
        tags: [],
        created_at: 1,
    }, generateSecretKey());
    const reply = nip19.neventEncode({ id: event.id, author: event.pubkey });
    const invalidEvent = { ...event, sig: "0".repeat(128) };

    const result = await page.evaluate(async ({ reply, event }) => {
        await import(`${window.__componentOrigin}/ehagaki-composer.js`);
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            whenReady(): Promise<void>;
            setContext(value: unknown): Promise<void>;
        };
        document.body.append(composer);
        await composer.whenReady();
        await composer.setContext({
            reply,
            preloadedEvents: { [event.id]: event },
        });
        return {
            previewCount: composer.shadowRoot?.querySelectorAll(".reply-quote-preview").length ?? 0,
        };
    }, { reply, event });

    expect(result.previewCount).toBe(1);
    const welcomeButton = page.locator("ehagaki-composer").locator(".welcome-dialog button.primary");
    if (await welcomeButton.isVisible()) {
        await welcomeButton.click();
    }
    await page.locator("ehagaki-composer").locator(".reply-quote-preview .preview-label").click();
    await page.waitForFunction(
        ({ content }) => document.querySelector("ehagaki-composer")
            ?.shadowRoot?.textContent?.includes(content),
        { content: event.content },
    );

    const invalidResult = await page.evaluate(async ({ reply, invalidEvent }) => {
        const composer = document.querySelector("ehagaki-composer") as HTMLElement & {
            setContext(value: unknown): Promise<void>;
        };
        return await composer.setContext({
            reply,
            preloadedEvents: { [invalidEvent.id]: invalidEvent },
        }).then(
            () => "resolved",
            (error: Error) => error.name,
        );
    }, { reply, invalidEvent });
    expect(invalidResult).toBe("resolved");
});



test("Full self-publish does not expose Host-owned methods", async ({ page }) => {
    await page.goto(hostOrigin);
    const result = await page.evaluate(async ({ componentOrigin }) => {
        await import(`${componentOrigin}/ehagaki-composer.js`);
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            whenReady(): Promise<void>;
            setContext(value: unknown): Promise<void>;
        };
        const initializationErrors: string[] = [];
        composer.addEventListener("ehagaki-initialization-error", (event) => {
            initializationErrors.push((event as CustomEvent).detail?.code ?? "unknown");
        });
        document.body.append(composer);
        await composer.whenReady();
        return {
            configureHostOwned: typeof (composer as any).configureHostOwned,
            setCustomEmojis: typeof (composer as any).setCustomEmojis,
            initializationErrors,
        };
    }, { componentOrigin });
    expect(result).toEqual({
        configureHostOwned: "undefined",
        setCustomEmojis: "undefined",
        initializationErrors: [],
    });
});
