import { test, expect } from "@playwright/test";
import { finalizeEvent, generateSecretKey, nip19 } from "nostr-tools";

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
