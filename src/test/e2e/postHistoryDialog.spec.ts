import { expect, test, type Page } from '@playwright/test';

type HarnessState = {
    ready: boolean;
    totalPosts: number;
    matchingPosts: number;
    jumpDate: string;
};

type HarnessWindow = Window & typeof globalThis & {
    __POST_HISTORY_HARNESS__?: HarnessState;
};

async function gotoHarness(page: Page) {
    await page.goto('post-history-dialog-playwright.html');
    await page.waitForFunction(() => Boolean((window as HarnessWindow).__POST_HISTORY_HARNESS__?.ready));
    return page.evaluate<HarnessState>(() => (window as HarnessWindow).__POST_HISTORY_HARNESS__ as HarnessState);
}

async function expectSummary(page: Page, options: { shown: number; total?: number; matching?: number }) {
    const summary = page.locator('.post-history-heading-summary');
    await expect(summary).toBeVisible();
    await expect(summary).toContainText(`${options.shown}`);
    if (options.total !== undefined) {
        await expect(summary).toContainText(`${options.total} 件`);
    }
    if (options.matching !== undefined) {
        await expect(summary).toContainText(`${options.matching} 件`);
    }
}

async function expectVisiblePostCount(page: Page, count: number) {
    await expect(page.locator('.post-history-list li')).toHaveCount(count);
}

test.describe('PostHistoryDialog Playwright', () => {
    test('desktop timeline browsing flow works in a real browser', async ({ page, isMobile }) => {
        test.skip(isMobile, 'desktop only');

        const harness = await gotoHarness(page);
        const dialog = page.locator('.post-history-dialog');
        await expect(dialog).toBeVisible();
        await expectSummary(page, { shown: 50, total: harness.totalPosts });
        await expectVisiblePostCount(page, 50);

        const viewport = page.viewportSize();
        const dialogBox = await dialog.boundingBox();
        expect(dialogBox).not.toBeNull();
        expect(dialogBox!.width).toBeLessThanOrEqual((viewport?.width ?? 0) - 16);

        await page.getByRole('button', { name: 'さらに古い投稿を表示' }).click();
        await expectSummary(page, { shown: harness.totalPosts, total: harness.totalPosts });
        await expectVisiblePostCount(page, harness.totalPosts);

        await page.getByRole('button', { name: '投稿履歴メニューを開く' }).click();
        await page.getByRole('button', { name: '検索' }).click();
        await page.getByRole('searchbox', { name: '検索' }).fill('alpha');
        await expectSummary(page, { shown: 50, matching: harness.matchingPosts });
        await expectVisiblePostCount(page, 50);

        await page.getByRole('button', { name: 'さらに古い検索結果を表示' }).click();
        await expectSummary(page, { shown: harness.matchingPosts - 50, matching: harness.matchingPosts });
        await expectVisiblePostCount(page, harness.matchingPosts - 50);

        await page.getByRole('button', { name: '新しい検索結果を表示' }).click();
        await expectSummary(page, { shown: 50, matching: harness.matchingPosts });
        await expectVisiblePostCount(page, 50);
    });

    test('mobile timeline controls stay usable and fit the viewport', async ({ page, isMobile }) => {
        test.skip(!isMobile, 'mobile only');

        const harness = await gotoHarness(page);
        const dialog = page.locator('.post-history-dialog');
        await expect(dialog).toBeVisible();
        await expectSummary(page, { shown: 50, total: harness.totalPosts });
        await expectVisiblePostCount(page, 50);

        const viewport = page.viewportSize();
        const dialogBox = await dialog.boundingBox();
        expect(dialogBox).not.toBeNull();
        expect(dialogBox!.x).toBeGreaterThanOrEqual(0);
        expect(dialogBox!.width).toBeLessThanOrEqual((viewport?.width ?? 0) + 1);

        const containerMetrics = await page.locator('.post-history-container').evaluate((element) => ({
            clientWidth: (element as HTMLDivElement).clientWidth,
            scrollWidth: (element as HTMLDivElement).scrollWidth,
        }));
        expect(containerMetrics.scrollWidth).toBeLessThanOrEqual(containerMetrics.clientWidth + 1);

        await page.getByRole('button', { name: '投稿履歴メニューを開く' }).click();
        await page.getByRole('button', { name: '日付へ移動' }).click();
        await page.getByLabel('日付').fill(harness.jumpDate);
        await page.getByRole('button', { name: 'この日付付近を表示' }).click();

        await expect(page.getByRole('button', { name: '最新へ戻る' })).toBeVisible();
        await expect(page.getByRole('button', { name: '新しい投稿を表示' })).toBeVisible();

        await page.getByRole('button', { name: '最新へ戻る' }).click();
        await expectSummary(page, { shown: 50, total: harness.totalPosts });
        await expectVisiblePostCount(page, 50);
    });
});
