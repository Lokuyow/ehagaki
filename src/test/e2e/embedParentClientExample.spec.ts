import { test, expect } from "@playwright/test";
import { finalizeEvent, generateSecretKey, nip19 } from "nostr-tools";
import { WebSocketServer, type WebSocket } from "ws";

let relayServer: WebSocketServer;
let relayOrigin = "";
let relayTargetEvent: ReturnType<typeof finalizeEvent> | null = null;
let targetRequestCount = 0;

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

test.beforeAll(async () => {
    relayServer = new WebSocketServer({ host: "127.0.0.1", port: 0 });
    relayServer.on("connection", (socket: WebSocket) => {
        socket.on("message", (rawMessage) => {
            try {
                const message = JSON.parse(rawMessage.toString()) as unknown[];
                if (message[0] !== "REQ" || typeof message[1] !== "string") {
                    return;
                }

                const subscriptionId = message[1];
                const filters = message.slice(2) as Array<{ ids?: unknown }>;
                const requestsTarget = !!relayTargetEvent && filters.some((filter) =>
                    Array.isArray(filter?.ids) && filter.ids.includes(relayTargetEvent?.id),
                );
                if (requestsTarget && relayTargetEvent) {
                    targetRequestCount += 1;
                    socket.send(JSON.stringify([
                        "EVENT",
                        subscriptionId,
                        relayTargetEvent,
                    ]));
                }
                socket.send(JSON.stringify(["EOSE", subscriptionId]));
            } catch {
                // This deterministic relay only needs REQ/EOSE for the fixture.
            }
        });
    });
    const relayPort = await listenWebSocketServer(relayServer);
    relayOrigin = `ws://127.0.0.1:${relayPort}`;
});

test.beforeEach(() => {
    relayTargetEvent = null;
    targetRequestCount = 0;
});

test.afterAll(async () => {
    if (relayServer) {
        await closeWebSocketServer(relayServer);
    }
});

test("uses an edited URL as the source of truth after an iframe context update", async ({ page }) => {
    const previousQuote = nip19.noteEncode("1".repeat(64));
    const quotes = [
        nip19.noteEncode("a".repeat(64)),
        nip19.noteEncode("b".repeat(64)),
    ];

    await page.goto("/ehagaki/public/embed-parent-client-example.html");
    const initialFrame = page.frameLocator("#ehagaki-iframe");
    await expect(initialFrame.locator(".tiptap-editor")).toBeVisible();

    const childFrame = page.frames().find((frame) => frame !== page.mainFrame());
    if (!childFrame) {
        throw new Error("initial iframe did not start");
    }
    await childFrame.evaluate((quote) => {
        window.parent.postMessage({
            namespace: "ehagaki.embed",
            version: 1,
            type: "composer.contextUpdated",
            payload: {
                timestamp: Date.now(),
                reply: null,
                quotes: [quote],
            },
        }, window.location.origin);
    }, previousQuote);
    await expect(page.locator("#timeline-selection")).toContainText("quote: 1 件");

    const appUrl = new URL("/ehagaki/", page.url());
    appUrl.search = new URLSearchParams([
        ["quote", quotes[0]],
        ["quote", quotes[1]],
        ["content", "input content"],
        ["embedLocale", "en"],
        ["defaultTheme", "dark"],
        ["embedShowFlavorText", "false"],
        ["futureEmbedQuery", "preserve-me"],
        ["parentOrigin", "https://attacker.example"],
    ]).toString();

    await page.getByLabel("eHagaki URL").fill(appUrl.toString());
    await page.getByRole("button", { name: "iframe を再読み込み" }).click();

    const iframeUrl = new URL(await page.locator("#ehagaki-iframe").getAttribute("src") ?? "");
    expect(iframeUrl.origin).toBe(appUrl.origin);
    expect(iframeUrl.searchParams.getAll("quote")).toEqual(quotes);
    expect(iframeUrl.searchParams.get("content")).toBe("input content");
    expect(iframeUrl.searchParams.get("embedLocale")).toBe("en");
    expect(iframeUrl.searchParams.get("defaultTheme")).toBe("dark");
    expect(iframeUrl.searchParams.get("embedShowFlavorText")).toBe("false");
    expect(iframeUrl.searchParams.get("futureEmbedQuery")).toBe("preserve-me");
    expect(iframeUrl.searchParams.get("parentOrigin")).toBe(new URL(page.url()).origin);

    const reloadedFrame = page.frameLocator("#ehagaki-iframe");
    await expect(reloadedFrame.locator(".reply-quote-preview")).toHaveCount(2);
});

test("applies a signed preloaded event through the iframe composer context protocol", async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem("firstVisit", "1");
    });

    const event = finalizeEvent({
        kind: 1,
        content: "iframe preloaded reply",
        tags: [],
        created_at: 1,
    }, generateSecretKey());
    const reply = nip19.neventEncode({ id: event.id, author: event.pubkey });

    await page.goto("/ehagaki/public/embed-parent-client-example.html");
    const frame = page.frameLocator("#ehagaki-iframe");
    await expect(frame.locator(".tiptap-editor")).toBeVisible();

    const applied = await page.evaluate(async ({ reply, event }) => {
        const iframe = document.querySelector<HTMLIFrameElement>("#ehagaki-iframe");
        const contentWindow = iframe?.contentWindow;
        if (!iframe || !contentWindow) {
            throw new Error("iframe did not start");
        }

        const requestId = "e2e-preloaded-context";
        const targetOrigin = new URL(iframe.src).origin;
        const result = new Promise<unknown>((resolve, reject) => {
            const timeoutId = window.setTimeout(() => {
                window.removeEventListener("message", onMessage);
                reject(new Error("contextApplied was not received"));
            }, 10_000);
            function onMessage(messageEvent: MessageEvent) {
                if (
                    messageEvent.source !== contentWindow
                    || messageEvent.origin !== targetOrigin
                    || messageEvent.data?.type !== "composer.contextApplied"
                    || messageEvent.data?.requestId !== requestId
                ) {
                    return;
                }
                window.clearTimeout(timeoutId);
                window.removeEventListener("message", onMessage);
                resolve(messageEvent.data);
            }
            window.addEventListener("message", onMessage);
        });

        contentWindow.postMessage({
            namespace: "ehagaki.embed",
            version: 1,
            type: "composer.setContext",
            requestId,
            payload: {
                reply,
                preloadedEvents: { [event.id]: event },
            },
        }, targetOrigin);

        return await result;
    }, { reply, event });

    expect(applied).toMatchObject({
        type: "composer.contextApplied",
        requestId: "e2e-preloaded-context",
    });
    const preview = frame.locator(".reply-quote-preview");
    await expect(preview).toHaveCount(1);
    await preview.locator(".preview-label").click();
    await expect(preview).toContainText("iframe preloaded reply");
});

test("hydrates a preload-free reply sent once with auth.login on the first ready", async ({ page }) => {
    const event = finalizeEvent({
        kind: 1,
        content: "ready race relay event",
        tags: [],
        created_at: 5,
    }, generateSecretKey());
    relayTargetEvent = event;
    const parentPubkeyHex = "12".repeat(32);
    const reply = nip19.neventEncode({
        id: event.id,
        author: event.pubkey,
        relays: [relayOrigin],
    });

    await page.addInitScript(({ relayOrigin }) => {
        const NativeWebSocket = window.WebSocket;
        class RoutedWebSocket extends NativeWebSocket {
            constructor(url: string | URL, protocols?: string | string[]) {
                super(relayOrigin, protocols as string | string[]);
            }
        }
        window.WebSocket = RoutedWebSocket as typeof window.WebSocket;
    }, { relayOrigin });

    await page.route("**/e2e-embed-ready-parent.html", async (route) => {
        const childUrl = new URL("/ehagaki/", route.request().url());
        childUrl.searchParams.set("parentOrigin", childUrl.origin);
        await route.fulfill({
            contentType: "text/html",
            body: `<!doctype html>
<html lang="ja"><head><style>
html, body { margin: 0; height: 100%; }
#child { display: block; width: 100%; height: 100vh; border: 0; }
</style></head><body>
<iframe id="child" src="${childUrl.toString()}"></iframe>
<script>
localStorage.setItem("firstVisit", "1");
const iframe = document.querySelector("#child");
const state = window.__readyRaceState = {
  readyCount: 0,
  setContextSendCount: 0,
  appliedRequestIds: [],
  authRequestCount: 0,
};
const post = (type, payload, requestId) => iframe.contentWindow.postMessage({
  namespace: "ehagaki.embed",
  version: 1,
  type,
  ...(requestId ? { requestId } : {}),
  ...(payload === undefined ? {} : { payload }),
}, location.origin);
window.addEventListener("message", (event) => {
  if (event.source !== iframe.contentWindow || event.origin !== location.origin) return;
  const message = event.data;
  if (message?.namespace !== "ehagaki.embed" || message?.version !== 1) return;
  if (message.type === "ready") {
    state.readyCount += 1;
    if (state.setContextSendCount === 0) {
      post("auth.login", { pubkeyHex: ${JSON.stringify(parentPubkeyHex)} });
      state.setContextSendCount += 1;
      post("composer.setContext", { reply: ${JSON.stringify(reply)} }, "ready-race-context");
    }
    return;
  }
  if (message.type === "auth.request") {
    state.authRequestCount += 1;
    post("auth.result", {
      pubkeyHex: ${JSON.stringify(parentPubkeyHex)},
      capabilities: message.payload.capabilities,
    }, message.requestId);
    return;
  }
  if (message.type === "storage.get") {
    const values = Object.fromEntries(message.payload.keys.map((key) => [key, null]));
    post("storage.result", { timestamp: Date.now(), values }, message.requestId);
    return;
  }
  if (message.type === "storage.set") {
    post("storage.result", {
      timestamp: Date.now(),
      applied: Object.keys(message.payload.values),
    }, message.requestId);
    return;
  }
  if (message.type === "storage.remove") {
    post("storage.result", {
      timestamp: Date.now(),
      removed: message.payload.keys,
    }, message.requestId);
    return;
  }
  if (message.type === "idb.getSnapshot") {
    post("idb.result", {
      timestamp: Date.now(),
      store: message.payload.store,
      scopeKey: message.payload.scopeKey,
      records: [],
    }, message.requestId);
    return;
  }
  if (message.type === "composer.contextApplied") {
    state.appliedRequestIds.push(message.requestId);
  }
});
</script>
</body></html>`,
        });
    });

    await page.goto("/ehagaki/e2e-embed-ready-parent.html");
    const frame = page.frameLocator("#child");
    await expect(frame.locator(".tiptap-editor")).toBeVisible();

    await expect.poll(() => page.evaluate(() => ({
        readyCount: (window as any).__readyRaceState.readyCount,
        setContextSendCount: (window as any).__readyRaceState.setContextSendCount,
        authRequestCount: (window as any).__readyRaceState.authRequestCount,
        appliedRequestIds: (window as any).__readyRaceState.appliedRequestIds,
    }))).toMatchObject({
        readyCount: expect.any(Number),
        setContextSendCount: 1,
        authRequestCount: 1,
        appliedRequestIds: ["ready-race-context"],
    });
    await expect.poll(() => page.evaluate(() =>
        (window as any).__readyRaceState.readyCount,
    )).toBeGreaterThanOrEqual(2);
    await expect.poll(() => targetRequestCount).toBeGreaterThanOrEqual(1);

    const preview = frame.locator(".reply-quote-preview");
    await expect(preview).toHaveCount(1);
    await preview.locator(".preview-label").click();
    await expect(preview).toContainText("ready race relay event");
    await expect(preview).not.toContainText("イベントの取得に失敗しました");
    expect(await page.evaluate(() => (window as any).__readyRaceState.setContextSendCount)).toBe(1);
});

test("only replaces initial settings queries after the settings UI changes", async ({ page }) => {
    await page.goto("/ehagaki/embed-parent-client-example.html");

    const appUrl = new URL("/ehagaki/", page.url());
    appUrl.search = new URLSearchParams([
        ["embedLocale", "en"],
        ["defaultTheme", "dark"],
        ["embedShowFlavorText", "false"],
    ]).toString();
    await page.getByLabel("eHagaki URL").fill(appUrl.toString());

    let iframeUrl = new URL(await page.locator("#iframe-src").textContent() ?? "");
    expect(iframeUrl.searchParams.get("embedLocale")).toBe("en");
    expect(iframeUrl.searchParams.get("defaultTheme")).toBe("dark");
    expect(iframeUrl.searchParams.get("embedShowFlavorText")).toBe("false");

    await page.getByLabel("locale").selectOption("ja");
    iframeUrl = new URL(await page.locator("#iframe-src").textContent() ?? "");
    expect(iframeUrl.searchParams.get("defaultLocale")).toBe("ja");
    expect(iframeUrl.searchParams.has("embedLocale")).toBe(false);
    expect(iframeUrl.searchParams.get("embedShowFlavorText")).toBe("false");
});
