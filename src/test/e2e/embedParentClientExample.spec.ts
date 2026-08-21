import { test, expect } from "@playwright/test";

test("preserves input URL queries when reloading the parent client iframe", async ({ page }) => {
    await page.goto("/ehagaki/embed-parent-client-example.html");

    const appUrl = new URL("/ehagaki/", page.url());
    appUrl.search = new URLSearchParams([
        ["quote", "A"],
        ["quote", "B"],
        ["content", "input content"],
        ["reply", "reply-value"],
        ["channel", "channel-value"],
        ["futureEmbedQuery", "preserve-me"],
        ["parentOrigin", "https://attacker.example"],
    ]).toString();

    await page.getByLabel("eHagaki URL").fill(appUrl.toString());
    await page.getByRole("button", { name: "iframe を再読み込み" }).click();

    const iframeUrl = new URL(await page.locator("#ehagaki-iframe").getAttribute("src") ?? "");
    expect(iframeUrl.origin).toBe(appUrl.origin);
    expect(iframeUrl.searchParams.getAll("quote")).toEqual(["A", "B"]);
    expect(iframeUrl.searchParams.get("content")).toBe("input content");
    expect(iframeUrl.searchParams.get("reply")).toBe("reply-value");
    expect(iframeUrl.searchParams.get("channel")).toBe("channel-value");
    expect(iframeUrl.searchParams.get("futureEmbedQuery")).toBe("preserve-me");
    expect(iframeUrl.searchParams.get("parentOrigin")).toBe(new URL(page.url()).origin);
});
