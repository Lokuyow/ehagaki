import { test, expect, type Page } from "@playwright/test";

const PLAYGROUND_PAGES = [
    { path: "/ehagaki/playground/index.html", tab: "はじめに", heading: "eHagakiの投稿欄を組み込んで試す" },
    { path: "/ehagaki/playground/iframe.html", tab: "iframe", heading: "iframe Playground" },
    { path: "/ehagaki/playground/full.html", tab: "Full", heading: "Full Web Component Playground" },
    { path: "/ehagaki/playground/lite.html", tab: "Lite", heading: "Host-owned Composer Lite Playground" },
] as const;

const LEGACY_REDIRECTS = [
    { from: "/ehagaki/embed-parent-client-example.html", to: "/ehagaki/playground/iframe.html" },
    { from: "/ehagaki/web-component-parent-client-example.html", to: "/ehagaki/playground/full.html" },
    { from: "/ehagaki/host-owned-composer-lite-example.html", to: "/ehagaki/playground/lite.html" },
] as const;

/**
 * This spec checks the host pages only. The embedded runtimes (iframe app,
 * Full / Lite distributions) and the CDN modules used by the iframe parent
 * sample are covered by their own specs, so keep this spec offline.
 */
async function blockEmbeddedRuntimes(page: Page): Promise<void> {
    await page.route("https://esm.sh/**", (route) => route.abort());
    await page.route("**/ehagaki/web-component/**", (route) => route.abort());
    await page.route(/\/ehagaki\/(?:\?.*)?$/, (route) => route.fulfill({
        status: 200,
        contentType: "text/html; charset=utf-8",
        body: "<!doctype html><title>stub</title>",
    }));
}

test.beforeEach(async ({ page }) => {
    await blockEmbeddedRuntimes(page);
});

test("redirects the legacy sample URLs and keeps the query and hash", async ({ page }) => {
    for (const { from, to } of LEGACY_REDIRECTS) {
        await page.goto(`${from}?manual=1&moduleUrl=https%3A%2F%2Fexample.invalid%2Fm.js#section`);
        await page.waitForURL((url) => url.pathname === to);
        const url = new URL(page.url());
        expect(url.pathname).toBe(to);
        expect(url.searchParams.get("manual")).toBe("1");
        expect(url.searchParams.get("moduleUrl")).toBe("https://example.invalid/m.js");
        expect(url.hash).toBe("#section");
    }
});

test("redirects the legacy sample URLs without scripts", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    try {
        for (const { from, to } of LEGACY_REDIRECTS) {
            await page.goto(from);
            await page.waitForURL((url) => url.pathname === to);
            expect(new URL(page.url()).pathname).toBe(to);
        }
    } finally {
        await context.close();
    }
});

test("links every playground page through the shared tabs", async ({ page }) => {
    for (const current of PLAYGROUND_PAGES) {
        await page.goto(current.path);
        await expect(page.getByRole("heading", { level: 1, name: current.heading })).toBeVisible();
        const tabs = page.getByRole("navigation", { name: "プレイグラウンドのページ" });
        await expect(tabs.getByRole("link")).toHaveCount(PLAYGROUND_PAGES.length);
        for (const target of PLAYGROUND_PAGES) {
            const link = tabs.getByRole("link", { name: target.tab, exact: true });
            expect(new URL((await link.getAttribute("href"))!, page.url()).pathname).toBe(target.path);
            if (target === current) {
                await expect(link).toHaveAttribute("aria-current", "page");
            } else {
                await expect(link).not.toHaveAttribute("aria-current", /.+/);
            }
        }
    }
});

test("opens each mode from the overview cards and the chooser", async ({ page }) => {
    await page.goto("/ehagaki/playground/index.html");
    for (const [label, path] of [
        ["iframeを試す", "/ehagaki/playground/iframe.html"],
        ["Fullを試す", "/ehagaki/playground/full.html"],
        ["Liteを試す", "/ehagaki/playground/lite.html"],
    ] as const) {
        await page.getByRole("link", { name: label }).click();
        await page.waitForURL((url) => url.pathname === path);
        await page.goBack();
    }
    const chooser = page.locator("#choose");
    await expect(chooser.getByRole("listitem")).toHaveCount(3);
});

test("switches the quick start code with the tab list", async ({ page }) => {
    await page.goto("/ehagaki/playground/index.html");
    const tabList = page.getByRole("tablist", { name: "方式" });
    const iframeTab = tabList.getByRole("tab", { name: "iframe" });
    const fullTab = tabList.getByRole("tab", { name: "Full" });
    const liteTab = tabList.getByRole("tab", { name: "Lite" });

    await expect(iframeTab).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("#code-iframe")).toBeVisible();
    await expect(page.locator("#code-full")).toBeHidden();

    await fullTab.click();
    await expect(fullTab).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("#code-full")).toBeVisible();
    await expect(page.locator("#code-iframe")).toBeHidden();
    await expect(page.locator("#code-full-text")).toContainText("ehagaki-composer.js");

    await fullTab.press("ArrowRight");
    await expect(liteTab).toBeFocused();
    await expect(liteTab).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("#code-lite-text")).toContainText("configureHostOwned");
});

test("fits the playground pages at the minimum supported width", async ({ page }) => {
    for (const width of [360, 768, 1280]) {
        await page.setViewportSize({ width, height: 800 });
        for (const { path } of PLAYGROUND_PAGES) {
            await page.goto(path);
            await page.evaluate(() => {
                for (const section of document.querySelectorAll<HTMLDetailsElement>("details")) {
                    section.open = true;
                }
            });
            const result = await page.evaluate(() => ({
                viewportWidth: window.innerWidth,
                documentScrollWidth: document.documentElement.scrollWidth,
                bodyScrollWidth: document.body.scrollWidth,
                overflowingControls: Array.from(document.querySelectorAll<HTMLElement>("button, a.pg-link-button, a.intro-link, input, select, textarea"))
                    .filter((element) => element.getClientRects().length > 0)
                    .filter((element) => element.getBoundingClientRect().right > window.innerWidth + 1
                        || element.scrollWidth > element.clientWidth + 1 && element.tagName === "BUTTON")
                    .map((element) => element.id || element.textContent?.trim() || element.tagName),
            }));
            expect(result.documentScrollWidth, `${path} at ${width}px`).toBeLessThanOrEqual(result.viewportWidth);
            expect(result.bodyScrollWidth, `${path} at ${width}px`).toBeLessThanOrEqual(result.viewportWidth);
            expect(result.overflowingControls, `${path} at ${width}px`).toEqual([]);
        }
    }
});
