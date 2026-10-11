import { expect, test, type FrameLocator, type Page } from "@playwright/test";

type ScanWindow = Window & { __POST_HISTORY_HARNESS__?: { ready: boolean }; __POST_HISTORY_FULL_SCAN__?: {
    held: number; releasedHeld: number; relayUrls: string[]; closeParent: () => void; readCount: () => Promise<number>;
    releaseRelay: (url: string) => void; authenticateRelay: (url: string) => void;
} };
async function openDialog(page: Page | FrameLocator) {
    await page.getByRole("button", { name: "投稿履歴メニューを開く", exact: true }).click();
    await page.getByRole("menuitem", { name: "リレーから全件取得", exact: true }).click();
    const dialog = page.locator(".post-history-full-scan-dialog"); await expect(dialog).toBeVisible();
    await expect(page.locator(".post-history-heading-status-placeholder")).not.toBeVisible();
    return dialog;
}
async function open(page: Page, scenario = "completed", extra = "") {
    await page.goto(`post-history-dialog-playwright.html?full-scan=${scenario}${extra}`);
    await page.waitForFunction(() => (window as ScanWindow).__POST_HISTORY_HARNESS__?.ready);
    await expect(page.locator(".post-history-item").first()).toBeVisible();
    const before = await page.evaluate(() => (window as ScanWindow).__POST_HISTORY_FULL_SCAN__!.readCount());
    const dialog = await openDialog(page);
    return { before, dialog };
}
test("full scan: completes with actual summary and preserves the displayed window", async ({ page }) => {
    const { before, dialog } = await open(page);
    const ids = await page.locator(".post-history-item").evaluateAll((items) => items.map((item) => item.getAttribute("data-post-history-event-id")));
    const description = dialog.locator(".scan-heading p");
    await expect(description).toHaveText(/リレーから、自分の過去の投稿をできるだけ取得して保存します。\s+閉じると中止しますが、保存済みの投稿は残ります。/);
    await expect(description).toHaveCSS("white-space", "pre-line");
    await dialog.getByRole("button", { name: "取得開始", exact: true }).click();
    await expect(dialog.getByRole("status")).toContainText("対象リレーの走査が終了しました");
    await expect(dialog).toContainText("2 / 2"); await expect(dialog.getByRole("progressbar")).toHaveCount(0);
    await expect(dialog.locator(".scan-relay-row")).toHaveCount(2);
    for (const row of await dialog.locator(".scan-relay-row").all()) {
        await expect(row.locator(".scan-relay-state")).toHaveText("完了");
        await expect(row.locator(".scan-relay-count")).toHaveText("2");
    }
    expect(await dialog.textContent()).not.toMatch(/%|推定残り時間/);
    await expect.poll(() => page.evaluate(() => (window as ScanWindow).__POST_HISTORY_FULL_SCAN__!.readCount())).toBe(before + 2);
    await dialog.getByRole("button", { name: "閉じる", exact: true }).click();
    await expect(dialog).not.toBeVisible();
    expect(await page.locator(".post-history-item").evaluateAll((items) => items.map((item) => item.getAttribute("data-post-history-event-id")))).toEqual(ids);
});
test("full scan: four workers keep relay rows independent through queued, AUTH and final states", async ({ page }, testInfo) => {
    const { dialog } = await open(page, "relay-progress");
    await dialog.getByRole("button", { name: "取得開始", exact: true }).click();
    const rows = dialog.locator(".scan-relay-row");
    await expect(rows).toHaveCount(5);
    await expect(rows.nth(0).locator(".scan-relay-state")).toHaveText("取得中…");
    await expect(rows.nth(1).locator(".scan-relay-state")).toHaveText("取得中…");
    await expect(rows.nth(2).locator(".scan-relay-state")).toHaveText("取得中…");
    await expect(rows.nth(3).locator(".scan-relay-state")).toHaveText("取得中…");
    await expect(rows.nth(4).locator(".scan-relay-state")).toHaveText("順番待ち");
    await expect(dialog).toContainText("0 / 5");
    await page.evaluate(() => { const scan = (window as ScanWindow).__POST_HISTORY_FULL_SCAN__!; scan.releaseRelay(scan.relayUrls[0]); });
    await expect(rows.nth(0).locator(".scan-relay-state")).toHaveText("完了");
    await expect(rows.nth(0).locator(".scan-relay-count")).toHaveText("2");
    await expect(rows.nth(4).locator(".scan-relay-state")).toHaveText("取得中…");
    await page.evaluate(() => { const scan = (window as ScanWindow).__POST_HISTORY_FULL_SCAN__!; scan.releaseRelay(scan.relayUrls[1]); });
    await expect(rows.nth(1).locator(".scan-relay-state")).toHaveText("認証中…");
    await expect(rows.nth(1).locator(".scan-relay-count")).toHaveText("0");
    await expect(rows.nth(0).locator(".scan-relay-count")).toHaveText("2");
    await rows.last().scrollIntoViewIfNeeded();
    await expect(rows.last()).toBeInViewport();
    await page.screenshot({ path: testInfo.outputPath("relay-progress-auth.png") });
    await page.evaluate(() => { const scan = (window as ScanWindow).__POST_HISTORY_FULL_SCAN__!; scan.releaseRelay(scan.relayUrls[2]); });
    await expect(rows.nth(2).locator(".scan-relay-state")).toHaveText("投稿なし");
    await expect(rows.nth(2).locator(".scan-relay-count")).toHaveText("0");
    for (const index of [3, 4]) {
        await page.evaluate((relayIndex) => { const scan = (window as ScanWindow).__POST_HISTORY_FULL_SCAN__!; scan.releaseRelay(scan.relayUrls[relayIndex]); }, index);
        await expect(rows.nth(index).locator(".scan-relay-state")).toHaveText("完了");
        await expect(rows.nth(index).locator(".scan-relay-count")).toHaveText("2");
    }
    await expect(rows.nth(1).locator(".scan-relay-state")).toHaveText("認証中…");
    await expect(dialog.getByRole("status")).toHaveText("リレーの認証を待っています…");
    await page.evaluate(() => { const scan = (window as ScanWindow).__POST_HISTORY_FULL_SCAN__!; scan.authenticateRelay(scan.relayUrls[1]); });
    await expect(rows.nth(1).locator(".scan-relay-state")).toHaveText("完了");
    await expect(rows.nth(1).locator(".scan-relay-count")).toHaveText("1");
    await expect(dialog.getByRole("status")).toContainText("対象リレーの走査が終了しました");
    await expect(dialog).toContainText("5 / 5");
    expect(await rows.locator(".scan-relay-count").allTextContents()).toEqual(["2", "1", "0", "2", "2"]);
    await page.screenshot({ path: testInfo.outputPath("relay-progress-final.png") });
});
test("full scan: an ambiguous-only relay completes with an accessible explanation while real failures stay visible", async ({ page }) => {
    for (const [scenario, expected] of [["timeout", "時間切れ"], ["partial", "接続エラー"]]) {
        const { dialog } = await open(page, scenario);
        await dialog.getByRole("button", { name: "取得開始", exact: true }).click();
        await expect(dialog.getByRole("status")).toContainText("一部のリレーまたは範囲が未完了");
        const rows = dialog.locator(".scan-relay-row");
        await expect(rows.nth(1).locator(".scan-relay-state-line > span")).toHaveText(expected);
        await expect(rows.nth(0).locator(".scan-relay-state")).toHaveText("完了");
        await expect(rows.nth(0).locator(".scan-relay-count")).toHaveText("2");
        await expect(rows.nth(1).locator(".scan-relay-count")).toHaveText("0");
    }
    const { dialog } = await open(page, "ambiguous");
    await dialog.getByRole("button", { name: "取得開始", exact: true }).click();
    await expect(dialog.getByRole("status")).toContainText("対象リレーの走査が終了しました");
    const rows = dialog.locator(".scan-relay-row");
    await expect(rows.locator(".scan-relay-state > .scan-relay-state-line > span")).toHaveText(["完了", "完了"]);
    await expect(rows.nth(0).getByRole("button", { name: "取得結果の補足情報を表示" })).toBeVisible();
    await expect(rows.nth(1).getByRole("button", { name: "取得結果の補足情報を表示" })).toHaveCount(0);
    const rowHeights = await rows.evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().height));
    expect(Math.abs(rowHeights[0] - rowHeights[1])).toBeLessThanOrEqual(1);
    await expect(rows.locator(".scan-relay-reason")).toHaveCount(0);
    await expect(dialog).not.toContainText("取得境界を解消できない範囲");
    const totals = dialog.locator(".scan-results section").nth(1).locator("dl div");
    await expect(totals.nth(2).locator("dd")).toHaveText("2");
    await expect(totals.nth(3).locator("dd")).toHaveText("0");
    const trigger = rows.first().getByRole("button", { name: "取得結果の補足情報を表示" });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const popover = page.locator(".popover-content").filter({ hasText: "取得結果について" });
    await expect(popover).toBeVisible();
    await expect(popover).toContainText("このリレーの取得処理は最後まで完了しました。");
    await expect(popover).toContainText("一部の時間範囲では、すべての投稿を取得できたことを厳密には確認できませんでした。");
    await expect(popover).toContainText("通信エラーではないため、eHagaki では「完了」と表示しています。");
    await page.keyboard.press("Escape");
    await expect(popover).toBeHidden();

    await page.setViewportSize({ width: 320, height: 720 });
    const widths = await dialog.evaluate((element) => ({
        dialogClient: element.clientWidth, dialogScroll: element.scrollWidth,
        documentClient: document.documentElement.clientWidth, documentScroll: document.documentElement.scrollWidth,
    }));
    expect(widths.dialogScroll).toBeLessThanOrEqual(widths.dialogClient);
    expect(widths.documentScroll).toBeLessThanOrEqual(widths.documentClient);
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(popover).toBeVisible();
    const popoverBounds = await popover.boundingBox();
    expect(popoverBounds).not.toBeNull();
    expect(popoverBounds!.x).toBeGreaterThanOrEqual(0);
    expect(popoverBounds!.x + popoverBounds!.width).toBeLessThanOrEqual(widths.documentClient);
    expect(popoverBounds!.y).toBeGreaterThanOrEqual(0);
    expect(popoverBounds!.y + popoverBounds!.height).toBeLessThanOrEqual(720);
});
test("full scan: partial and failure are distinct", async ({ page }) => {
    for (const scenario of ["partial", "failed"]) {
        const { dialog } = await open(page, scenario);
        await dialog.getByRole("button", { name: "取得開始", exact: true }).click();
        await expect(dialog.getByRole("status")).toContainText(scenario === "partial" ? "一部のリレーまたは範囲が未完了" : "リレーから取得できませんでした");
    }
});
test("full scan: explicit cancel and Escape keep committed posts", async ({ page }) => {
    for (const operation of ["cancel", "escape"]) {
        const { before, dialog } = await open(page, "hold");
        await dialog.getByRole("button", { name: "取得開始", exact: true }).click();
        await page.waitForFunction(() => (window as ScanWindow).__POST_HISTORY_FULL_SCAN__!.held > 0);
        await expect(dialog.getByRole("button", { name: "取得開始", exact: true })).toBeDisabled();
        const start = dialog.getByRole("button", { name: "取得開始", exact: true });
        const cancel = dialog.getByRole("button", { name: "取得を中止", exact: true });
        const close = dialog.getByRole("button", { name: "閉じる", exact: true });
        for (const button of [start, cancel, close]) {
            const geometry = await button.evaluate((element) => {
                const bounds = element.getBoundingClientRect();
                return { width: bounds.width, height: bounds.height, borderRadius: getComputedStyle(element).borderRadius };
            });
            expect(Math.min(geometry.width, geometry.height)).toBeGreaterThanOrEqual(50);
            expect(geometry.borderRadius).toBe("0px");
        }
        const statusLayout = await dialog.locator(".scan-status").evaluate((element) => {
            const loader = element.querySelector(".loading-placeholder")!;
            const graphic = loader.querySelector(".loader-container")!;
            const label = element.querySelector(":scope > span")!;
            return { loaderWidth: loader.getBoundingClientRect().width, graphicRight: graphic.getBoundingClientRect().right,
                labelLeft: label.getBoundingClientRect().left };
        });
        expect(statusLayout.loaderWidth).toBeLessThan(40);
        expect(statusLayout.labelLeft).toBeGreaterThanOrEqual(statusLayout.graphicRight);
        if (operation === "cancel") {
            await dialog.getByRole("button", { name: "取得を中止", exact: true }).click();
            await expect(dialog.getByRole("status")).toContainText("取得を中止しました");
            await expect(dialog.locator(".scan-relay-row")).toHaveCount(2);
            await expect(dialog.locator(".scan-relay-state")).toHaveText(["中止", "中止"]);
            expect(await dialog.locator(".scan-relay-count").allTextContents()).toEqual(["2", "2"]);
        } else {
            await page.keyboard.press("Escape"); await expect(dialog).not.toBeVisible();
        }
        await expect.poll(() => page.evaluate(() => (window as ScanWindow).__POST_HISTORY_FULL_SCAN__!.readCount())).toBe(before + 2);
    }
});
test("full scan: parent close releases the scan and reopening starts idle", async ({ page }) => {
    const { dialog } = await open(page, "hold");
    await dialog.getByRole("button", { name: "取得開始", exact: true }).click();
    await page.waitForFunction(() => (window as ScanWindow).__POST_HISTORY_FULL_SCAN__!.held === 2);
    await page.evaluate(() => (window as ScanWindow).__POST_HISTORY_FULL_SCAN__!.closeParent());
    await page.waitForFunction(() => (window as ScanWindow).__POST_HISTORY_FULL_SCAN__!.releasedHeld === 2);
    await expect(dialog).not.toBeVisible();
    await page.getByTestId("post-history-reopen").click();
    const reopened = await openDialog(page);
    await expect(reopened.getByRole("status")).toHaveCount(0);
    await expect(reopened.getByRole("button", { name: "取得開始", exact: true })).toBeEnabled();
});
test("full scan: keeps the current search page after saving", async ({ page }) => {
    const { dialog } = await open(page);
    await dialog.getByRole("button", { name: "閉じる", exact: true }).click();
    await page.getByRole("button", { name: "検索", exact: true }).click();
    await page.getByRole("searchbox", { name: "検索" }).fill("alpha");
    await expect(page.locator(".post-history-item")).toHaveCount(50);
    await page.getByRole("button", { name: "さらに古い検索結果を表示" }).click();
    await expect(page.locator(".post-history-item")).toHaveCount(55);
    const ids = await page.locator(".post-history-item").evaluateAll((items) => items.map((item) => item.getAttribute("data-post-history-event-id")));
    await openDialog(page); await dialog.getByRole("button", { name: "取得開始", exact: true }).click();
    await expect(dialog.getByRole("status")).toContainText("対象リレーの走査が終了しました");
    await dialog.getByRole("button", { name: "閉じる", exact: true }).click();
    await expect(page.locator(".post-history-item")).toHaveCount(55);
    expect(await page.locator(".post-history-item").evaluateAll((items) => items.map((item) => item.getAttribute("data-post-history-event-id")))).toEqual(ids);
});
test("full scan: preserves 150 loaded rows and the scroll anchor", async ({ page }) => {
    const { dialog } = await open(page, "completed", "&infinite-scroll=1");
    await dialog.getByRole("button", { name: "閉じる", exact: true }).click();
    await expect(dialog).not.toBeVisible();
    const container = page.locator(".post-history-container");
    await container.evaluate((element) => { (element as HTMLElement).style.height = `${element.clientHeight}px`; });
    await container.evaluate(async (element) => {
        let height = element.clientHeight; let stable = 0;
        for (let frame = 0; frame < 60 && stable < 8; frame++) {
            await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
            stable = element.clientHeight === height ? stable + 1 : 0; height = element.clientHeight;
        }
    });
    for (const count of [100, 150]) {
        await container.evaluate((element) => { element.scrollTop = element.scrollHeight; element.dispatchEvent(new Event("scroll", { bubbles: true })); });
        await expect(page.locator(".post-history-item")).toHaveCount(count);
    }
    await container.evaluate((element) => { element.scrollTop = element.scrollHeight / 2; element.dispatchEvent(new Event("scroll", { bubbles: true })); });
    const ids = await page.locator(".post-history-item").evaluateAll((items) => items.map((item) => item.getAttribute("data-post-history-event-id")));
    const scrollTop = await container.evaluate((element) => element.scrollTop);
    await openDialog(page); await dialog.getByRole("button", { name: "取得開始", exact: true }).click();
    await expect(dialog.getByRole("status")).toContainText("対象リレーの走査が終了しました");
    await dialog.getByRole("button", { name: "閉じる", exact: true }).click();
    await expect(page.locator(".post-history-item")).toHaveCount(150);
    expect(await page.locator(".post-history-item").evaluateAll((items) => items.map((item) => item.getAttribute("data-post-history-event-id")))).toEqual(ids);
    await expect.poll(async () => Math.abs(await container.evaluate((element) => element.scrollTop) - scrollTop)).toBeLessThanOrEqual(2);
});
test("full scan: 320px and 360px presentation contain essential actions", async ({ page }, testInfo) => {
    for (const width of [320, 360]) {
        await page.setViewportSize({ width, height: 720 });
        const { dialog } = await open(page, "relay-width");
        await dialog.getByRole("button", { name: "取得開始", exact: true }).click();
        await expect(dialog.getByRole("status")).toContainText("対象リレーの走査が終了しました");
        await expect(dialog.getByRole("button", { name: "取得開始", exact: true })).toBeVisible();
        const geometry = await dialog.evaluate((element) => ({ width: element.clientWidth, scrollWidth: element.scrollWidth, left: element.getBoundingClientRect().left, right: element.getBoundingClientRect().right }));
        expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.width); expect(geometry.left).toBeGreaterThanOrEqual(0); expect(geometry.right).toBeLessThanOrEqual(width);
        await expect(dialog.locator(".scan-relay-row")).toHaveCount(3);
        const relayGeometry = await dialog.locator(".scan-relays").evaluate((element) => ({ width: element.clientWidth, scroll: element.scrollWidth }));
        expect(relayGeometry.scroll).toBeLessThanOrEqual(relayGeometry.width);
        const host = dialog.locator(".scan-relay-host").last();
        expect(await host.evaluate((element) => getComputedStyle(element).textOverflow)).toBe("ellipsis");
        expect(await host.textContent()).not.toContain("/relay-path");
        await dialog.locator(".scan-relay-row").last().scrollIntoViewIfNeeded();
        await expect(dialog.locator(".scan-relay-row").last()).toBeInViewport();
        await page.screenshot({ path: testInfo.outputPath(`full-scan-${width}.png`) });
    }
    const childUrl = page.url();
    const hostUrl = new URL("full-scan-embed-host.html", childUrl).href;
    await page.route(hostUrl, (route) => route.fulfill({ contentType: "text/html",
        body: '<meta name="viewport" content="width=device-width,initial-scale=1"><iframe title="320px embedded history" style="width:320px;height:720px;border:0"></iframe>' }));
    await page.setViewportSize({ width: 1000, height: 900 }); await page.goto(hostUrl);
    await page.locator("iframe").evaluate((frame, url) => { (frame as HTMLIFrameElement).src = url; }, childUrl);
    const frame = page.frameLocator("iframe");
    await expect.poll(() => frame.locator("body").evaluate(() => (window as ScanWindow).__POST_HISTORY_HARNESS__?.ready)).toBe(true);
    const embedded = await openDialog(frame);
    await embedded.getByRole("button", { name: "取得開始", exact: true }).click();
    await expect(embedded.getByRole("status")).toContainText("対象リレーの走査が終了しました");
    const bounds = await embedded.evaluate((element) => ({ width: element.clientWidth, scroll: element.scrollWidth,
        left: element.getBoundingClientRect().left, right: element.getBoundingClientRect().right }));
    expect(bounds.scroll).toBeLessThanOrEqual(bounds.width); expect(bounds.left).toBeGreaterThanOrEqual(0); expect(bounds.right).toBeLessThanOrEqual(320);
    await expect(embedded.locator(".scan-relay-row")).toHaveCount(3);
    await embedded.locator(".scan-relay-row").last().scrollIntoViewIfNeeded();
    await expect(embedded.locator(".scan-relay-row").last()).toBeInViewport();
    await expect(embedded.getByRole("button", { name: "閉じる", exact: true })).toBeVisible();
    await page.locator("iframe").screenshot({ path: testInfo.outputPath("full-scan-iframe-320.png") });
});
