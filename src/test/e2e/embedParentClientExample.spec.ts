import { test, expect } from "@playwright/test";
import { finalizeEvent, generateSecretKey, nip19 } from "nostr-tools";
import { WebSocketServer, type WebSocket } from "ws";

let relayServer: WebSocketServer;
let secondRelayServer: WebSocketServer;
let relayOrigin = "";
let secondRelayOrigin = "";
let relayTargetEvent: ReturnType<typeof finalizeEvent> | null = null;
let targetRequestCount = 0;
let timelineRequestCounts = [0, 0];
const firstTimelineEvent = finalizeEvent({
    kind: 1,
    content: "timeline from first test relay",
    tags: [],
    created_at: 100,
}, generateSecretKey());
const secondTimelineEvent = finalizeEvent({
    kind: 1,
    content: "timeline from second test relay",
    tags: [],
    created_at: 200,
}, generateSecretKey());

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

function attachRelayHandler(server: WebSocketServer, timelineEvent: ReturnType<typeof finalizeEvent>, relayIndex: number) {
    server.on("connection", (socket: WebSocket) => {
        socket.on("message", (rawMessage) => {
            try {
                const message = JSON.parse(rawMessage.toString()) as unknown[];
                if (message[0] !== "REQ" || typeof message[1] !== "string") {
                    return;
                }

                const subscriptionId = message[1];
                const filters = message.slice(2) as Array<{ ids?: unknown; kinds?: unknown }>;
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
                if (!requestsTarget && filters.some((filter) => Array.isArray(filter?.kinds) && filter.kinds.includes(1))) {
                    timelineRequestCounts[relayIndex] += 1;
                    socket.send(JSON.stringify(["EVENT", subscriptionId, timelineEvent]));
                }
                socket.send(JSON.stringify(["EOSE", subscriptionId]));
            } catch {
                // This deterministic relay only needs REQ/EOSE for the fixture.
            }
        });
    });
}

test.beforeAll(async () => {
    relayServer = new WebSocketServer({ host: "127.0.0.1", port: 0 });
    attachRelayHandler(relayServer, firstTimelineEvent, 0);
    const relayPort = await listenWebSocketServer(relayServer);
    relayOrigin = `ws://127.0.0.1:${relayPort}`;
    secondRelayServer = new WebSocketServer({ host: "127.0.0.1", port: 0 });
    attachRelayHandler(secondRelayServer, secondTimelineEvent, 1);
    const secondRelayPort = await listenWebSocketServer(secondRelayServer);
    secondRelayOrigin = `ws://127.0.0.1:${secondRelayPort}`;
});

test.beforeEach(() => {
    relayTargetEvent = null;
    targetRequestCount = 0;
    timelineRequestCounts = [0, 0];
});

test.afterAll(async () => {
    if (relayServer) {
        await closeWebSocketServer(relayServer);
    }
    if (secondRelayServer) {
        await closeWebSocketServer(secondRelayServer);
    }
});

test("loads and switches the configurable timeline relay without mixing events", async ({ page }) => {
    await page.goto("/ehagaki/public/embed-parent-client-example.html");
    const relayInput = page.getByLabel("タイムライン relay URL");

    await relayInput.fill(relayOrigin);
    await page.getByRole("button", { name: "タイムライン更新" }).click();
    await expect(page.locator(".timeline-content")).toContainText(firstTimelineEvent.content);
    await expect.poll(() => timelineRequestCounts[0]).toBeGreaterThanOrEqual(2);
    await expect(page.locator("#timeline-status")).toContainText(relayOrigin);

    await relayInput.fill(secondRelayOrigin);
    await page.getByRole("button", { name: "タイムライン更新" }).click();
    await expect(page.locator(".timeline-content")).toContainText(secondTimelineEvent.content);
    await expect(page.locator(".timeline-content")).not.toContainText(firstTimelineEvent.content);
    await expect.poll(() => timelineRequestCounts[1]).toBeGreaterThanOrEqual(2);
    await expect(page.locator("#timeline-status")).toContainText(secondRelayOrigin);
});

test("preserves reply selection and iframe preview when refreshing the same relay", async ({ page }) => {
    await page.goto("/ehagaki/public/embed-parent-client-example.html");
    const frame = page.frameLocator("#ehagaki-iframe");
    await expect(frame.locator(".tiptap-editor")).toBeVisible();

    const relayInput = page.getByLabel("タイムライン relay URL");
    await relayInput.fill(relayOrigin);
    await page.getByRole("button", { name: "タイムライン更新" }).click();
    await expect(page.locator(".timeline-content")).toContainText(firstTimelineEvent.content);

    await page.getByRole("button", { name: "reply テスト" }).click();
    await expect(page.locator("#timeline-selection")).not.toContainText("reply: なし");
    await expect(frame.locator(".reply-quote-preview")).toHaveCount(1);

    await relayInput.fill(relayOrigin);
    await page.getByRole("button", { name: "タイムライン更新" }).click();
    await expect(page.locator(".timeline-content")).toContainText(firstTimelineEvent.content);
    await expect(page.locator("#timeline-selection")).not.toContainText("reply: なし");
    await expect(frame.locator(".reply-quote-preview")).toHaveCount(1);
});

test("uses the active timeline relay in nevent hints and stores unique relay suggestions", async ({ page }) => {
    await page.goto("/ehagaki/public/embed-parent-client-example.html");
    const relayInput = page.getByLabel("タイムライン relay URL");
    await relayInput.fill(secondRelayOrigin);
    await page.getByRole("button", { name: "タイムライン更新" }).click();
    await expect(page.locator(".timeline-content")).toContainText(secondTimelineEvent.content);

    await page.getByRole("button", { name: "reply テスト" }).click();
    const log = await page.locator("#event-log").inputValue();
    const encodedReference = log.match(/nevent1[0-9a-z]+/)?.[0];
    expect(encodedReference).toBeTruthy();
    expect(nip19.decode(encodedReference as string)).toMatchObject({
        type: "nevent",
        data: { relays: [secondRelayOrigin] },
    });

    await relayInput.fill(relayOrigin);
    await page.getByRole("button", { name: "タイムライン更新" }).click();
    await expect(page.locator(".timeline-content")).toContainText(firstTimelineEvent.content);
    await relayInput.fill(relayOrigin);
    await page.getByRole("button", { name: "タイムライン更新" }).click();

    const savedHistory = await page.evaluate(() =>
        JSON.parse(localStorage.getItem("ehagaki.parent-client-sample.timeline-relays") ?? "null"),
    );
    expect(savedHistory).toEqual([relayOrigin, secondRelayOrigin, "wss://nos.lol"]);

    await page.reload();
    await expect(page.locator("#timeline-relay-suggestions option")).toHaveCount(3);
    expect(await page.locator("#timeline-relay-suggestions option").evaluateAll((options) =>
        options.map((option) => option.getAttribute("value")),
    )).toEqual(["wss://nos.lol", relayOrigin, secondRelayOrigin]);
});

test("rejects invalid timeline relay URLs without falling back to nos.lol", async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem("ehagaki.parent-client-sample.timeline-relays", "not-json");
    });
    await page.goto("/ehagaki/public/embed-parent-client-example.html");
    const relayInput = page.getByLabel("タイムライン relay URL");
    await expect(relayInput).toHaveValue("wss://nos.lol");
    expect(await page.locator("#timeline-relay-suggestions option").evaluateAll((options) =>
        options.map((option) => option.getAttribute("value")),
    )).toEqual(["wss://nos.lol"]);
    await relayInput.fill("https://example.com/relay");
    await page.getByRole("button", { name: "タイムライン更新" }).click();

    await expect(page.locator("#timeline-status")).toContainText("ws:// または wss://");
    expect(await page.locator("#timeline-relay").inputValue()).toBe("https://example.com/relay");
    expect(timelineRequestCounts).toEqual([0, 0]);
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

test("applies iframe color defaults, persists user colors, and releases runtime forces", async ({ page }) => {
    await page.goto("/ehagaki/embed-parent-client-example.html");

    const appUrl = new URL("/ehagaki/", page.url());
    appUrl.searchParams.set("defaultAccentColor", "#ABCDEF");
    appUrl.searchParams.set("defaultBaseColor", "#CDEFAB");
    await page.getByLabel("eHagaki URL").fill(appUrl.toString());
    await page.getByRole("button", { name: "iframe を再読み込み" }).click();

    const frame = page.frameLocator("#ehagaki-iframe");
    await expect(frame.locator(".tiptap-editor")).toBeVisible();
    const readFrameColors = () => frame.locator("html").evaluate((html) => ({
        accent: getComputedStyle(html).getPropertyValue("--accent-color").trim().toLowerCase(),
        base: getComputedStyle(html).getPropertyValue("--base-color").trim().toLowerCase(),
    }));
    const readFrameThemeUi = () => frame.locator("html").evaluate((html) => {
        const headerButton = html.querySelector<HTMLButtonElement>(".header-actions button")!;
        const settingsButton = html.querySelector<HTMLButtonElement>(".settings-btn")!;
        const mascot = html.querySelector<SVGElement>(".site-icon path")!;
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
            mascotFill: getComputedStyle(mascot).fill,
            headerBackground: getComputedStyle(headerButton).backgroundColor,
            settingsBackground,
            buttonPixel: colorToPixel(settingsBackground),
        };
    });

    await expect.poll(readFrameColors).toMatchObject({ accent: "#abcdef", base: "#cdefab" });
    const defaultUi = await readFrameThemeUi();
    expect(defaultUi.headerBorder).toBe("rgb(171, 205, 239)");
    expect(defaultUi.mascotFill).toBe("rgb(171, 205, 239)");
    expect(defaultUi.headerBackground).toBe(defaultUi.settingsBackground);
    expect(defaultUi.buttonPixel).toEqual([243, 251, 235, 255]);

    await frame.locator("button.settings-btn").evaluate((button) => (button as HTMLButtonElement).click());
    await expect(frame.locator("#accent-color-input")).toBeAttached();
    await page.evaluate(() => {
        localStorage.setItem("ehagaki.embed.storage.v1:accentColor", "#112233");
        localStorage.setItem("ehagaki.embed.storage.v1:baseColor", "#223344");
    });
    await page.getByRole("button", { name: "iframe を再読み込み" }).click();
    await expect(frame.locator(".tiptap-editor")).toBeVisible();
    await expect.poll(readFrameColors).toMatchObject({ accent: "#112233", base: "#223344" });
    const userUi = await readFrameThemeUi();
    expect(userUi.headerBorder).toBe("rgb(17, 34, 51)");
    expect(userUi.mascotFill).toBe("rgb(17, 34, 51)");
    expect(userUi.headerBackground).toBe(userUi.settingsBackground);
    expect(userUi.buttonPixel).toEqual([202, 206, 210, 255]);

    await page.evaluate(() => {
        const iframe = document.querySelector<HTMLIFrameElement>("#ehagaki-iframe")!;
        iframe.contentWindow!.postMessage({
            namespace: "ehagaki.embed",
            version: 1,
            type: "settings.set",
            requestId: "e2e-force-colors",
            payload: { accentColor: "#345678", baseColor: "#456789" },
        }, new URL(iframe.src).origin);
    });
    await expect.poll(readFrameColors).toMatchObject({ accent: "#345678", base: "#456789" });
    const forcedUi = await readFrameThemeUi();
    expect(forcedUi.headerBorder).toBe("rgb(52, 86, 120)");
    expect(forcedUi.mascotFill).toBe("rgb(52, 86, 120)");
    expect(forcedUi.headerBackground).toBe(forcedUi.settingsBackground);
    expect(forcedUi.buttonPixel).toEqual([210, 219, 227, 255]);
    await expect.poll(() => page.evaluate(() => ({
        accent: localStorage.getItem("ehagaki.embed.storage.v1:accentColor"),
        base: localStorage.getItem("ehagaki.embed.storage.v1:baseColor"),
    }))).toEqual({ accent: "#112233", base: "#223344" });

    await page.evaluate(() => {
        const iframe = document.querySelector<HTMLIFrameElement>("#ehagaki-iframe")!;
        iframe.contentWindow!.postMessage({
            namespace: "ehagaki.embed",
            version: 1,
            type: "settings.set",
            requestId: "e2e-release-colors",
            payload: { accentColor: null, baseColor: null },
        }, new URL(iframe.src).origin);
    });
    await expect.poll(readFrameColors).toMatchObject({ accent: "#112233", base: "#223344" });
    await expect.poll(readFrameThemeUi).toEqual(userUi);
});
