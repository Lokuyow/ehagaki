import { test, expect } from "@playwright/test";
import { nip19 } from "nostr-tools";

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
