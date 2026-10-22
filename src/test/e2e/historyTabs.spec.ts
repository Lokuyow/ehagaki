import { test, expect, type Page } from "@playwright/test";

const counters = (page: Page) => page.evaluate(() => Reflect.get(window, "__HISTORY_TAB_COUNTERS__") as { localReads: number; relayRequests: number });
async function dismissAndWaitForHistory(page: Page, action: () => Promise<unknown>) {
    const entry = await page.evaluate(() => history.state?.modalId as string | undefined);
    await action();
    await expect(page.getByRole("dialog", { name: "履歴", exact: true })).toHaveCount(0);
    await page.waitForFunction(id => history.state?.modalId !== id, entry);
}

test("saved Media survives refresh and activates Posts only after explicit selection", async ({ page }, testInfo) => {
    await page.addInitScript(() => localStorage.setItem("historyActiveTab", "media"));
    await page.goto("post-history-dialog-playwright.html?history-tabs=1");
    const dialog = page.getByRole("dialog", { name: "履歴", exact: true });
    const posts = dialog.getByRole("tab", { name: "ポスト", exact: true });
    const media = dialog.getByRole("tab", { name: "メディア", exact: true });
    await expect(media).toHaveAttribute("aria-selected", "true");
    await expect(dialog.locator(".media-management")).toBeVisible();
    expect(await counters(page)).toEqual({ localReads: 0, relayRequests: 0 });
    await media.focus();
    await page.keyboard.press("ArrowLeft");
    await expect(posts).toBeFocused();
    await expect(media).toHaveAttribute("aria-selected", "true");
    expect(await counters(page)).toEqual({ localReads: 0, relayRequests: 0 });
    await page.keyboard.press("Enter");
    await expect(posts).toHaveAttribute("aria-selected", "true");
    await expect(dialog.locator(".post-history-item").first()).toBeVisible();
    expect((await counters(page)).localReads).toBeGreaterThan(0);
    await expect(dialog.locator(".media-management")).toHaveCount(0);
    await media.click();
    await expect(dialog.locator(".post-history-container")).toHaveCount(0);
    await page.reload();
    await expect(media).toHaveAttribute("aria-selected", "true");
    await expect(dialog.locator(".media-management")).toBeVisible();
    expect(await counters(page)).toEqual({ localReads: 0, relayRequests: 0 });
    for (const width of [360, 1100]) {
        await page.setViewportSize({ width, height: 800 });
        expect(await dialog.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
        const rects = await dialog.getByRole("tab").evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().width));
        expect(rects[0]).toBeCloseTo(rects[1], 0);
        await page.screenshot({ path: testInfo.outputPath(`history-media-${width}.png`) });
    }
    await dismissAndWaitForHistory(page, () => dialog.getByRole("button", { name: "閉じる", exact: true }).click());
    await expect(page.getByTestId("history-launch")).toBeFocused();
    await page.getByTestId("history-launch").click();
    await expect(dialog).toBeVisible();
    await dismissAndWaitForHistory(page, () => page.keyboard.press("Escape"));
    await expect(page.getByTestId("history-launch")).toBeFocused();
    await page.getByTestId("history-launch").click();
    await expect(dialog).toBeVisible();
    await page.goBack();
    await expect(dialog).toHaveCount(0);
    await expect(page.getByTestId("history-launch")).toBeFocused();
});

test("tab roundtrip retains post search and page; close keeps existing search reset", async ({ page }) => {
    await page.goto("post-history-dialog-playwright.html?history-tabs=1");
    const dialog = page.getByRole("dialog", { name: "履歴", exact: true });
    const posts = dialog.getByRole("tab", { name: "ポスト", exact: true });
    const media = dialog.getByRole("tab", { name: "メディア", exact: true });
    await expect(dialog.locator(".post-history-item").first()).toBeVisible();
    await dialog.getByRole("button", { name: "検索", exact: true }).click();
    const closeIcon = dialog.locator(".post-history-search-close .xmark-icon");
    await expect(closeIcon).toBeVisible();
    await expect.poll(() => closeIcon.evaluate((node) => getComputedStyle(node).maskImage)).toContain(
        "close_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg",
    );
    const search = dialog.getByRole("searchbox", { name: "検索", exact: true });
    await search.fill("alpha");
    await expect(dialog.getByRole("button", { name: "さらに古い検索結果を表示" })).toBeVisible();
    await dialog.getByRole("button", { name: "さらに古い検索結果を表示" }).click();
    await expect(dialog.locator(".post-history-item")).toHaveCount(55);
    await expect(dialog.locator(".post-history-item").first()).toBeVisible();
    const firstId = await dialog.locator(".post-history-item").first().getAttribute("data-post-history-event-id");
    await media.click();
    await expect(search).toHaveCount(0);
    await posts.click();
    await expect(search).toHaveValue("alpha");
    await expect(dialog.locator(".post-history-item")).toHaveCount(55);
    await expect(dialog.locator(".post-history-item").first()).toHaveAttribute("data-post-history-event-id", firstId!);
    await dismissAndWaitForHistory(page, () => dialog.getByRole("button", { name: "閉じる", exact: true }).click());
    await page.getByTestId("history-launch").click();
    await expect(dialog.locator(".post-history-item").first()).toBeVisible();
    await expect(search).toHaveCount(0);
});

test("tab roundtrip preserves expanded text, date window and the visible scroll anchor", async ({ page }) => {
    await page.goto("post-history-dialog-playwright.html?history-tabs=1&long-preview=1");
    const dialog = page.getByRole("dialog", { name: "履歴", exact: true });
    const posts = dialog.getByRole("tab", { name: "ポスト", exact: true });
    const media = dialog.getByRole("tab", { name: "メディア", exact: true });
    const expand = dialog.getByRole("button", { name: "もっと見る", exact: true }).first();
    const expandedId = await expand.locator("xpath=ancestor::li").getAttribute("data-post-history-event-id");
    await expand.click();
    const expanded = dialog.locator(`.post-history-item[data-post-history-event-id="${expandedId}"]`);
    await expect(expanded.getByRole("button", { name: "折りたたむ", exact: true })).toBeVisible();
    await media.click(); await posts.click();
    await expect(expanded.getByRole("button", { name: "折りたたむ", exact: true })).toBeVisible();
    const date = await page.evaluate(() => (Reflect.get(window, "__POST_HISTORY_HARNESS__") as { jumpDate: string }).jumpDate);
    await dialog.locator(".post-history-heading-calendar-button").click();
    for (const [segment, value] of ["year", "month", "day"].map((part, index) => [part, date.split("-")[index]])) {
        await dialog.locator(`.post-history-date-picker-segment[data-segment="${segment}"]`).click();
        await page.keyboard.press("Control+a"); await page.keyboard.type(String(Number(value)));
    }
    await dialog.getByRole("button", { name: "この日付付近を表示" }).click();
    await expect(dialog.getByRole("button", { name: "新しい投稿を表示" })).toBeVisible();
    const ids = await dialog.locator(".post-history-item").evaluateAll(nodes => nodes.map(node => node.getAttribute("data-post-history-event-id")));
    await dialog.locator(".post-history-container").evaluate(node => { node.scrollTop = Math.min(250, node.scrollHeight - node.clientHeight); node.dispatchEvent(new Event("scroll")); });
    const anchor = await dialog.locator(".post-history-container").evaluate(root => {
        const top = root.getBoundingClientRect().top;
        const item = [...root.querySelectorAll(".post-history-item")].find(node => node.getBoundingClientRect().bottom > top)!;
        return { id: item.getAttribute("data-post-history-event-id"), offset: item.getBoundingClientRect().top - top };
    });
    await media.click(); await expect(dialog.locator(".post-history-container")).toHaveCount(0); await posts.click();
    await expect(dialog.getByRole("button", { name: "新しい投稿を表示" })).toBeVisible();
    expect(await dialog.locator(".post-history-item").evaluateAll(nodes => nodes.map(node => node.getAttribute("data-post-history-event-id")))).toEqual(ids);
    await expect.poll(() => dialog.locator(`.post-history-item[data-post-history-event-id="${anchor.id}"]`).evaluate((node, offset) =>
        Math.abs(node.getBoundingClientRect().top - node.closest(".post-history-container")!.getBoundingClientRect().top - offset), anchor.offset)).toBeLessThanOrEqual(2);
});
