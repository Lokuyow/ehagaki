import { expect, test, type Page } from '@playwright/test';

type HarnessState = {
    ready: boolean;
    totalPosts: number;
    matchingPosts: number;
    jumpDate: string;
    initialMonthLabel: string;
    scrollTargetContent: string;
    scrollTargetMonthLabel: string;
    reactionPostEventId: string;
    plainPostEventId: string;
    scrolledReactionPostEventId: string;
    scrolledPlainPostEventId: string;
};

type HarnessWindow = Window & typeof globalThis & {
    __POST_HISTORY_HARNESS__?: HarnessState;
};

async function gotoHarness(page: Page) {
    await page.goto('post-history-dialog-playwright.html');
    await page.waitForFunction(() => Boolean((window as HarnessWindow).__POST_HISTORY_HARNESS__?.ready));
    return page.evaluate<HarnessState>(() => (window as HarnessWindow).__POST_HISTORY_HARNESS__ as HarnessState);
}

async function expectSummary(page: Page, total: number) {
    const summary = page.locator('.post-history-summary-count');
    await expect(summary).toBeVisible();
    await expect(summary).toContainText(`${total}件`);
}

async function expectCurrentMonthLabel(page: Page, label: string) {
    await expect(page.locator('.post-history-current-month')).toHaveText(label);
}

async function scrollPostIntoView(page: Page, content: string) {
    await page.getByText(content, { exact: true }).evaluate((element) => {
        element.closest('.post-history-item')?.scrollIntoView({ block: 'start' });
    });
}

async function scrollPostIntoViewByEventId(page: Page, eventId: string) {
    await page.locator(`.post-history-item[data-post-history-event-id="${eventId}"]`).evaluate((element) => {
        (element as HTMLElement).scrollIntoView({ block: 'start' });
    });
}

async function jumpToDate(page: Page, date: string) {
    const [year, month, day] = date.split('-');
    await page.getByRole('button', { name: '投稿履歴メニューを開く' }).click();
    await page.getByRole('menuitem', { name: '日付へ移動' }).click();
    await expect(page.locator('.post-history-date-picker-input')).toBeVisible();
    const yearSegment = page.locator('.post-history-date-picker-segment[data-segment="year"]');
    const monthSegment = page.locator('.post-history-date-picker-segment[data-segment="month"]');
    const daySegment = page.locator('.post-history-date-picker-segment[data-segment="day"]');

    await yearSegment.click();
    await page.keyboard.press('Control+a');
    await page.keyboard.type(String(Number(year)));
    await monthSegment.click();
    await page.keyboard.press('Control+a');
    await page.keyboard.type(String(Number(month)));
    await daySegment.click();
    await page.keyboard.press('Control+a');
    await page.keyboard.type(String(Number(day)));
    await page.getByRole('button', { name: 'この日付付近を表示' }).click();
}

async function expectVisiblePostCount(page: Page, count: number) {
    await expect(page.locator('.post-history-list li')).toHaveCount(count);
}

async function getFirstVisiblePostSnapshot(page: Page) {
    return page.locator('.post-history-container').evaluate((containerElement) => {
        const container = containerElement as HTMLDivElement;
        const containerRect = container.getBoundingClientRect();
        const items = Array.from(
            container.querySelectorAll<HTMLElement>('.post-history-item'),
        );
        const visibleEdgeTolerancePx = 1;
        const item = items.find((candidate) => {
            const rect = candidate.getBoundingClientRect();
            return (
                rect.bottom > containerRect.top + visibleEdgeTolerancePx &&
                rect.top < containerRect.bottom - visibleEdgeTolerancePx
            );
        });

        if (!item) {
            return null;
        }

        const rect = item.getBoundingClientRect();
        return {
            eventId: item.dataset.postHistoryEventId ?? '',
            offsetTop: rect.top - containerRect.top,
        };
    });
}

async function getPostSnapshotByEventId(page: Page, eventId: string) {
    return page.locator('.post-history-container').evaluate((containerElement, targetEventId) => {
        const container = containerElement as HTMLDivElement;
        const item = container.querySelector<HTMLElement>(
            `.post-history-item[data-post-history-event-id="${targetEventId}"]`,
        );

        if (!item) {
            return null;
        }

        const containerRect = container.getBoundingClientRect();
        const rect = item.getBoundingClientRect();
        return {
            eventId: item.dataset.postHistoryEventId ?? '',
            offsetTop: rect.top - containerRect.top,
        };
    }, eventId);
}

async function getFooterActionPositions(page: Page, eventId: string) {
    const item = page.locator(`.post-history-item[data-post-history-event-id="${eventId}"]`);
    const repliesActionSlot = item.locator('.post-preview-footer-replies-slot');
    const quoteActionButton = item.getByRole('button', { name: '引用' });
    const menuActionButton = item.getByRole('button', { name: 'アクションを表示' });
    const reactionActionButton = item.locator('.post-preview-reactions-button');

    const repliesActionBox = await repliesActionSlot.boundingBox();
    const quoteActionBox = await quoteActionButton.boundingBox();
    const menuActionBox = await menuActionButton.boundingBox();

    expect(repliesActionBox).not.toBeNull();
    expect(quoteActionBox).not.toBeNull();
    expect(menuActionBox).not.toBeNull();

    return {
        repliesX: repliesActionBox!.x,
        quoteX: quoteActionBox!.x,
        menuX: menuActionBox!.x,
        hasReactionButton: await reactionActionButton.count() > 0,
    };
}

test.describe('PostHistoryDialog Playwright', () => {
    test('desktop timeline browsing flow works in a real browser', async ({ page, isMobile }) => {
        test.skip(isMobile, 'desktop only');

        const harness = await gotoHarness(page);
        const dialog = page.locator('.post-history-dialog');
        await expect(dialog).toBeVisible();
        await expectSummary(page, harness.totalPosts);
        await expectCurrentMonthLabel(page, harness.initialMonthLabel);
        await expect(page.locator('.post-history-summary-range')).toHaveCount(0);
        await expectVisiblePostCount(page, 50);

        const viewport = page.viewportSize();
        const dialogBox = await dialog.boundingBox();
        expect(dialogBox).not.toBeNull();
        expect(dialogBox!.width).toBeLessThanOrEqual((viewport?.width ?? 0) - 16);

        await page.getByRole('button', { name: 'さらに古い投稿を表示' }).click();
        await expectSummary(page, harness.totalPosts);
        await expectVisiblePostCount(page, harness.totalPosts);
        await scrollPostIntoView(page, harness.scrollTargetContent);
        await expectCurrentMonthLabel(page, harness.scrollTargetMonthLabel);

        await page.getByRole('button', { name: '投稿履歴メニューを開く' }).click();
        await page.getByRole('menuitem', { name: '検索' }).click();
        await page.getByRole('searchbox', { name: '検索' }).fill('alpha');
        await expectSummary(page, harness.matchingPosts);
        await expectVisiblePostCount(page, 50);

        await page.getByRole('button', { name: 'さらに古い検索結果を表示' }).click();
        await expectSummary(page, harness.matchingPosts);
        await expectVisiblePostCount(page, harness.matchingPosts - 50);

        await page.getByRole('button', { name: '新しい検索結果を表示' }).click();
        await expectSummary(page, harness.matchingPosts);
        await expectVisiblePostCount(page, 50);
    });

    test('desktop newer prepend keeps the current post anchored', async ({ page, isMobile }) => {
        test.skip(isMobile, 'desktop only');

        const harness = await gotoHarness(page);

        await jumpToDate(page, harness.jumpDate);

        const newerButton = page.getByRole('button', { name: '新しい投稿を表示' });
        await expect(newerButton).toBeVisible();
        const before = await getFirstVisiblePostSnapshot(page);
        expect(before).not.toBeNull();

        await newerButton.click();

        await expectSummary(page, harness.totalPosts);
        await expectVisiblePostCount(page, 64);
        const after = await getPostSnapshotByEventId(page, before!.eventId);
        expect(after).not.toBeNull();
        expect(after!.eventId).toBe(before!.eventId);
        expect(Math.abs(after!.offsetTop - before!.offsetTop)).toBeLessThanOrEqual(1);
    });

    test('reaction button presence does not shift other footer actions', async ({ page, isMobile }) => {
        test.skip(isMobile, 'desktop only');

        const harness = await gotoHarness(page);

        const reactionPost = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.reactionPostEventId}"]`,
        );
        const plainPost = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.plainPostEventId}"]`,
        );

        await expect(reactionPost.locator('.post-preview-reactions-button')).toHaveCount(1);
        await expect(plainPost.locator('.post-preview-reactions-button')).toHaveCount(0);

        const topReactionPositions = await getFooterActionPositions(page, harness.reactionPostEventId);
        const topPlainPositions = await getFooterActionPositions(page, harness.plainPostEventId);

        expect(topReactionPositions.hasReactionButton).toBe(true);
        expect(topPlainPositions.hasReactionButton).toBe(false);
        expect(Math.abs(topReactionPositions.repliesX - topPlainPositions.repliesX)).toBeLessThanOrEqual(1);
        expect(Math.abs(topReactionPositions.quoteX - topPlainPositions.quoteX)).toBeLessThanOrEqual(1);
        expect(Math.abs(topReactionPositions.menuX - topPlainPositions.menuX)).toBeLessThanOrEqual(1);

        await scrollPostIntoViewByEventId(page, harness.scrolledReactionPostEventId);

        const scrolledReactionPositions = await getFooterActionPositions(page, harness.scrolledReactionPostEventId);
        const scrolledPlainPositions = await getFooterActionPositions(page, harness.scrolledPlainPostEventId);

        expect(scrolledReactionPositions.hasReactionButton).toBe(true);
        expect(scrolledPlainPositions.hasReactionButton).toBe(false);
        expect(Math.abs(scrolledReactionPositions.repliesX - scrolledPlainPositions.repliesX)).toBeLessThanOrEqual(1);
        expect(Math.abs(scrolledReactionPositions.quoteX - scrolledPlainPositions.quoteX)).toBeLessThanOrEqual(1);
        expect(Math.abs(scrolledReactionPositions.menuX - scrolledPlainPositions.menuX)).toBeLessThanOrEqual(1);
    });

    test('mobile timeline controls stay usable and fit the viewport', async ({ page, isMobile }) => {
        test.skip(!isMobile, 'mobile only');

        const harness = await gotoHarness(page);
        const dialog = page.locator('.post-history-dialog');
        await expect(dialog).toBeVisible();
        await expectSummary(page, harness.totalPosts);
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

        await jumpToDate(page, harness.jumpDate);

        await expect(page.getByRole('button', { name: '最新へ戻る' })).toBeVisible();
        await expect(page.getByRole('button', { name: '新しい投稿を表示' })).toBeVisible();

        await page.getByRole('button', { name: '最新へ戻る' }).click();
        await expectSummary(page, harness.totalPosts);
        await expectVisiblePostCount(page, 50);
    });

    test('per-post delete action opens the confirm dialog and closes the menu', async ({ page, isMobile }) => {
        test.skip(isMobile, 'desktop only');

        await gotoHarness(page);

        const postActionTrigger = page.getByRole('button', { name: 'アクションを表示' }).first();
        await postActionTrigger.click();
        await page.getByRole('menuitem', { name: '削除' }).click();

        await expect(
            page.locator('.delete-confirm-description').filter({
                hasText: 'この投稿の削除リクエストをリレーへ送信します。',
            }),
        ).toBeVisible();
        await expect(page.getByRole('menuitem', { name: '削除' })).toHaveCount(0);
    });
});
