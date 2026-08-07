import { expect, test, type Download, type Page } from '@playwright/test';

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
    quotePostEventId: string;
    quoteContent: string;
    linkTargetUrl: string;
    linkPostEventId: string;
    replyParentEventId: string;
    replyContent: string;
    threadParentPostEventId: string;
    importPostContent: string;
    importEventJsonl: string;
    sparseVisiblePostContent: string;
    sparseStoredPostContent: string;
};

type HarnessWindow = Window & typeof globalThis & {
    __POST_HISTORY_HARNESS__?: HarnessState;
};

async function gotoHarness(page: Page) {
    await page.goto('post-history-dialog-playwright.html');
    await page.waitForFunction(() => Boolean((window as HarnessWindow).__POST_HISTORY_HARNESS__?.ready));
    return page.evaluate<HarnessState>(() => (window as HarnessWindow).__POST_HISTORY_HARNESS__ as HarnessState);
}

async function gotoSparseHarness(page: Page) {
    await page.goto('post-history-dialog-playwright.html?sparse=1');
    await page.waitForFunction(() => Boolean((window as HarnessWindow).__POST_HISTORY_HARNESS__?.ready));
    return page.evaluate<HarnessState>(() => (window as HarnessWindow).__POST_HISTORY_HARNESS__ as HarnessState);
}

async function gotoExportHarness(page: Page) {
    await page.goto('post-history-dialog-playwright.html?export=1');
    await page.waitForFunction(() => Boolean((window as HarnessWindow).__POST_HISTORY_HARNESS__?.ready));
    return page.evaluate<HarnessState>(() => (window as HarnessWindow).__POST_HISTORY_HARNESS__ as HarnessState);
}

async function readDownload(download: Download): Promise<string> {
    const stream = await download.createReadStream();
    if (!stream) {
        return '';
    }
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
    }
    return Buffer.concat(chunks).toString('utf-8');
}

async function readExportVerificationStates(page: Page): Promise<Array<{
    status?: string;
    ruleVersion?: number;
}>> {
    return page.evaluate(async () => {
        const openRequest = indexedDB.open('eHagakiDB');
        const database = await new Promise<IDBDatabase>((resolve, reject) => {
            openRequest.onsuccess = () => resolve(openRequest.result);
            openRequest.onerror = () => reject(openRequest.error);
        });
        try {
            const transaction = database.transaction(
                ['postHistory', 'postHistoryDeletionRequests'],
                'readonly',
            );
            const getAll = (storeName: string) => new Promise<any[]>((resolve, reject) => {
                const request = transaction.objectStore(storeName).getAll();
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
            const [posts, deletions] = await Promise.all([
                getAll('postHistory'),
                getAll('postHistoryDeletionRequests'),
            ]);
            return [...posts, ...deletions].map((record) => record.rawEventVerification);
        } finally {
            database.close();
        }
    });
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

async function expectReferenceLinkAttributes(
    link: ReturnType<Page['locator']>,
    href: string,
) {
    await expect(link).toHaveAttribute('href', href);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
}

async function expectNoHorizontalOverflow(
    locator: ReturnType<Page['locator']>,
) {
    const metrics = await locator.evaluate((element) => ({
        clientWidth: (element as HTMLElement).clientWidth,
        scrollWidth: (element as HTMLElement).scrollWidth,
    }));
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
}

function visiblePostHistoryActionMenu(page: Page) {
    return page.locator('.post-history-menu-content:visible').last();
}

async function expectTooltip(
    page: Page,
    trigger: ReturnType<Page['locator']>,
    text: string,
) {
    await trigger.hover();
    const tooltip = page.locator('.tooltip-content:visible').filter({ hasText: text });
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toHaveText(text);
    return tooltip;
}

test.describe('PostHistoryDialog Playwright', () => {
    test('JSONL export downloads signed post and deletion events from the current account', async ({ page }) => {
        await gotoExportHarness(page);

        await page.getByRole('button', { name: '投稿履歴メニューを開く' }).click();
        const downloadPromise = page.waitForEvent('download');
        await page.getByRole('menuitem', { name: 'JSONLをエクスポート' }).click();
        const download = await downloadPromise;
        expect(download.suggestedFilename()).toMatch(/^ehagaki-post-history-\d{4}-\d{2}-\d{2}\.jsonl$/);

        const content = await readDownload(download);
        const events = content.trim().split('\n').filter(Boolean).map((line) => JSON.parse(line));
        expect(events).toHaveLength(3);
        expect(events.map((event) => event.kind)).toEqual([1, 42, 5]);
        expect(content).not.toContain('schemaVersion');
        expect(content).not.toContain('relayHints');
        expect(content.endsWith('\n')).toBe(true);
        await expect(page.getByText(/投稿履歴を3件エクスポートしました/)).toBeVisible();
        await expect.poll(() => readExportVerificationStates(page)).toEqual([
            { status: 'valid', ruleVersion: 1 },
            { status: 'valid', ruleVersion: 1 },
            { status: 'valid', ruleVersion: 1 },
        ]);
    });

    test('desktop JSONL import saves a post and refreshes the local history', async ({ page, isMobile }) => {
        test.skip(isMobile, 'desktop only');

        const harness = await gotoHarness(page);
        await expectSummary(page, harness.totalPosts);

        await page.getByRole('button', { name: '投稿履歴メニューを開く' }).click();
        await page.getByRole('menuitem', { name: '投稿履歴を読み込む' }).click();

        const importDialog = page.locator('.post-history-import-dialog');
        await expect(importDialog).toBeVisible();
        await importDialog.locator('input[type="file"]').setInputFiles({
            name: 'post-history.jsonl',
            mimeType: 'application/x-ndjson',
            buffer: Buffer.from(harness.importEventJsonl),
        });

        await expect(importDialog.getByText('読み込みが完了しました')).toBeVisible();
        await expect(importDialog.getByText('新規追加').locator('..')).toContainText('1');
        await importDialog.getByRole('button', { name: '閉じる' }).click();

        await expectSummary(page, harness.totalPosts + 1);
        await expect(page.getByText(harness.importPostContent, { exact: true })).toBeVisible();
    });

    test('desktop JSONL import also starts from a file drop without child-element flicker', async ({ page, isMobile }) => {
        test.skip(isMobile, 'desktop only');

        const harness = await gotoHarness(page);
        await page.getByRole('button', { name: '投稿履歴メニューを開く' }).click();
        await page.getByRole('menuitem', { name: '投稿履歴を読み込む' }).click();

        const importDialog = page.locator('.post-history-import-dialog');
        const dropZone = importDialog.locator('.import-drop-zone');
        const chooseFileButton = importDialog.locator('button[aria-label="JSONLファイルを選択"]');
        await expect(dropZone).toContainText('JSONLファイルをここにドラッグ＆ドロップ');

        const initialUrl = page.url();
        const nonFileDefaultsPrevented = await dropZone.evaluate((element) => {
            const dataTransfer = new DataTransfer();
            dataTransfer.setData('text/uri-list', 'https://example.com/ignored');
            const dragOverEvent = new DragEvent('dragover', {
                bubbles: true,
                cancelable: true,
                dataTransfer,
            });
            const dropEvent = new DragEvent('drop', {
                bubbles: true,
                cancelable: true,
                dataTransfer,
            });
            element.dispatchEvent(dragOverEvent);
            element.dispatchEvent(dropEvent);
            return {
                dragOver: dragOverEvent.defaultPrevented,
                drop: dropEvent.defaultPrevented,
            };
        });
        expect(nonFileDefaultsPrevented).toEqual({ dragOver: true, drop: true });
        expect(page.url()).toBe(initialUrl);
        await expect(dropZone).toContainText('JSONLファイルをここにドラッグ＆ドロップ');

        await dropZone.evaluate((element, jsonl) => {
            const file = new File([jsonl], 'post-history.jsonl', {
                type: 'application/x-ndjson',
            });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            element.dispatchEvent(new DragEvent('dragenter', {
                bubbles: true,
                dataTransfer,
            }));
        }, harness.importEventJsonl);
        await expect(dropZone).toContainText('ここにドロップ');

        await chooseFileButton.evaluate((element) => {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(new File(['unused'], 'unused.jsonl'));
            element.dispatchEvent(new DragEvent('dragenter', {
                bubbles: true,
                dataTransfer,
            }));
            element.dispatchEvent(new DragEvent('dragleave', {
                bubbles: true,
                dataTransfer,
            }));
        });
        await expect(dropZone).toContainText('ここにドロップ');

        await dropZone.evaluate((element, jsonl) => {
            const file = new File([jsonl], 'post-history.jsonl', {
                type: 'application/x-ndjson',
            });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            element.dispatchEvent(new DragEvent('drop', {
                bubbles: true,
                dataTransfer,
            }));
        }, harness.importEventJsonl);

        await expect(importDialog.getByText('読み込みが完了しました')).toBeVisible();
        await expect(importDialog.getByText('新規追加').locator('..')).toContainText('1');
        await expect(dropZone).toContainText('JSONLファイルをここにドラッグ＆ドロップ');
    });

    test('saved posts outside the visible range can be viewed without changing the range', async ({ page }) => {
        const harness = await gotoSparseHarness(page);

        await expectSummary(page, harness.totalPosts);
        await expect(page.getByText(harness.sparseVisiblePostContent, { exact: true })).toBeVisible();
        await expect(page.getByText('保存済みの古い投稿を表示', { exact: true })).toBeVisible();

        await page.getByRole('button', { name: '保存済みの古い投稿を表示' }).click();

        await expect(page.getByText('保存済みの古い投稿を表示中です。', { exact: true })).toBeVisible();
        await expect(page.getByText(harness.sparseStoredPostContent, { exact: true })).toBeVisible();
        await page.getByRole('button', { name: '最新へ戻る' }).click();
        await expect(page.getByText(harness.sparseVisiblePostContent, { exact: true })).toBeVisible();
    });

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
        await expectVisiblePostCount(page, harness.matchingPosts);
        await expect(page.getByRole('button', { name: '新しい検索結果を表示' })).toHaveCount(0);
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

    test('quote preview uses the compact three-region footer without horizontal overflow', async ({ page }) => {
        const harness = await gotoHarness(page);
        const historyItem = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.quotePostEventId}"]`,
        );
        const relatedCard = historyItem
            .locator('.post-history-related-card')
            .filter({ hasText: harness.quoteContent });
        const footer = relatedCard.locator('.post-preview-footer');

        await expect(relatedCard).toBeVisible();
        await expect(footer).toHaveCount(1);
        await expect(footer.locator(':scope > .post-preview-footer-left')).toHaveCount(1);
        await expect(footer.locator(':scope > .post-preview-footer-actions')).toHaveCount(1);
        await expect(footer.locator(':scope > .post-preview-footer-right')).toHaveCount(1);

        const [cardBox, footerBox, menuBox, width] = await Promise.all([
            relatedCard.boundingBox(),
            footer.boundingBox(),
            footer.getByRole('button', { name: 'アクションを表示' }).boundingBox(),
            relatedCard.evaluate((element) => ({
                clientWidth: (element as HTMLElement).clientWidth,
                scrollWidth: (element as HTMLElement).scrollWidth,
            })),
        ]);

        expect(cardBox).not.toBeNull();
        expect(footerBox).not.toBeNull();
        expect(menuBox).not.toBeNull();
        expect(footerBox!.height).toBeGreaterThanOrEqual(27);
        expect(footerBox!.height).toBeLessThanOrEqual(29);
        expect(menuBox!.x + menuBox!.width).toBeLessThanOrEqual(cardBox!.x + cardBox!.width + 1);
        expect(width.scrollWidth).toBeLessThanOrEqual(width.clientWidth + 1);
    });

    test('post preview footer tooltips show the user-facing labels and close on menu open', async ({ page }) => {
        const harness = await gotoHarness(page);
        const replyItem = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.replyParentEventId}"]`,
        );
        const reactionItem = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.reactionPostEventId}"]`,
        );
        const replyButton = page.locator('.post-preview-replies-badge-button[aria-label*="返信"]').first();
        const quoteButton = replyItem.getByRole('button', { name: '引用' });
        const reactionButton = reactionItem.getByRole('button', { name: 'リアクション 1件を表示' });
        const menuButton = replyItem.locator('.post-preview-footer-right').getByRole('button', { name: 'アクションを表示' }).first();

        const expectedReplyLabel = await replyButton.getAttribute('aria-label');
        await expect(replyButton).toBeVisible();
        await expectTooltip(page, replyButton, expectedReplyLabel ?? '');
        await expectTooltip(page, quoteButton, '引用');
        await expectTooltip(page, reactionButton, 'リアクション 1件を表示');

        await replyButton.hover();
        const repliesTooltip = page.locator('.post-preview-tooltip-content:visible').filter({ hasText: expectedReplyLabel ?? '' });
        await expect(repliesTooltip).toHaveText(expectedReplyLabel ?? '');
        const repliesTooltipClasses = await repliesTooltip.evaluate((element) => Array.from(element.classList));
        expect(repliesTooltipClasses).toContain('post-preview-tooltip-content');
        const repliesTooltipZIndex = await repliesTooltip.evaluate((element) => getComputedStyle(element).zIndex);
        const dialogZIndex = await page.locator('.post-history-dialog').evaluate((element) => getComputedStyle(element).zIndex);
        expect(Number(repliesTooltipZIndex)).toBeGreaterThan(Number(dialogZIndex));
        await expect(replyButton).toHaveAttribute('aria-label', expectedReplyLabel ?? '');
        await expect(replyButton).not.toHaveAttribute('title');

        await replyButton.click();
        const replyCard = replyItem.locator('.post-history-related-card').filter({ hasText: harness.replyContent });
        await expect(replyCard).toBeVisible();

        await menuButton.focus();
        const tooltip = page.locator('.post-preview-tooltip-content:visible').filter({ hasText: 'アクションを表示' });
        await expect(tooltip).toHaveText('アクションを表示');
        const zIndexes = await Promise.all([
            tooltip.evaluate((element) => getComputedStyle(element).zIndex),
            page.locator('.post-history-dialog').evaluate((element) => getComputedStyle(element).zIndex),
        ]);
        expect(Number(zIndexes[0])).toBeGreaterThan(Number(zIndexes[1]));
        await expect(menuButton).toHaveAttribute('aria-label', 'アクションを表示');
        await expect(menuButton).not.toHaveAttribute('title');

        await menuButton.click();
        await expect(page.getByRole('menuitem', { name: 'イベントJSONを表示' })).toBeVisible();
        await expect(page.locator('.tooltip-content:visible')).toHaveCount(0);
    });

    test('related card menus have tooltips', async ({ page }) => {
        const harness = await gotoHarness(page);
        const quoteItem = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.quotePostEventId}"]`,
        );
        const quoteCard = quoteItem
            .locator('.post-history-related-card')
            .filter({ hasText: harness.quoteContent });
        await expectTooltip(
            page,
            quoteCard.getByRole('button', { name: 'アクションを表示' }),
            'アクションを表示',
        );

        const replyItem = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.replyParentEventId}"]`,
        );
        await page.locator('.post-preview-replies-badge-button[aria-label*="返信"]').first().click();
        const replyCard = replyItem
            .locator('.post-history-related-card')
            .filter({ hasText: harness.replyContent });
        await expectTooltip(
            page,
            replyCard.getByRole('button', { name: 'アクションを表示' }),
            'アクションを表示',
        );

        const relatedRepliesButton = page.locator('.post-preview-replies-badge-button[aria-label*="返信"]').last();
        const expectedRelatedReplyLabel = await relatedRepliesButton.getAttribute('aria-label');
        await expect(relatedRepliesButton).toBeVisible();
        await expectTooltip(page, relatedRepliesButton, expectedRelatedReplyLabel ?? '');
        await relatedRepliesButton.hover();
        const relatedRepliesTooltip = page.locator('.post-preview-tooltip-content:visible').filter({ hasText: expectedRelatedReplyLabel ?? '' });
        await expect(relatedRepliesTooltip).toHaveText(expectedRelatedReplyLabel ?? '');
        const relatedRepliesTooltipClasses = await relatedRepliesTooltip.evaluate((element) => Array.from(element.classList));
        expect(relatedRepliesTooltipClasses).toContain('post-preview-tooltip-content');
        const relatedRepliesTooltipZIndex = await relatedRepliesTooltip.evaluate((element) => getComputedStyle(element).zIndex);
        const dialogZIndexForRelated = await page.locator('.post-history-dialog').evaluate((element) => getComputedStyle(element).zIndex);
        expect(Number(relatedRepliesTooltipZIndex)).toBeGreaterThan(Number(dialogZIndexForRelated));
        await expect(relatedRepliesButton).toHaveAttribute('aria-label', expectedRelatedReplyLabel ?? '');
        await expect(relatedRepliesButton).not.toHaveAttribute('title');
    });

    test('desktop reference links open natively without toggling their parent previews', async ({
        page,
        isMobile,
    }) => {
        test.skip(isMobile, 'desktop only');
        await page.route('**/reference-link-target', (route) =>
            route.fulfill({
                contentType: 'text/html',
                body: '<title>Reference target</title>',
            }),
        );
        const harness = await gotoHarness(page);
        const historyItem = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.linkPostEventId}"]`,
        );
        const link = historyItem
            .locator('.post-history-preview-text a')
            .filter({ hasText: harness.linkTargetUrl });
        const expandButton = historyItem.getByRole('button', {
            name: 'もっと見る',
        });

        await expect(link).toBeVisible();
        await expectReferenceLinkAttributes(link, harness.linkTargetUrl);
        await expect(expandButton).toHaveAttribute('aria-expanded', 'false');
        await expectNoHorizontalOverflow(historyItem);

        const clickPopupPromise = page.waitForEvent('popup');
        await link.click();
        const clickPopup = await clickPopupPromise;
        await expect(clickPopup).toHaveURL(harness.linkTargetUrl);
        await clickPopup.close();
        await expect(expandButton).toHaveAttribute('aria-expanded', 'false');
        await expect(page.locator('.post-history-dialog')).toBeVisible();

        await link.focus();
        await expect(link).toBeFocused();
        const keyboardPopupPromise = page.waitForEvent('popup');
        await page.keyboard.press('Enter');
        const keyboardPopup = await keyboardPopupPromise;
        await expect(keyboardPopup).toHaveURL(harness.linkTargetUrl);
        await keyboardPopup.close();
        await expect(expandButton).toHaveAttribute('aria-expanded', 'false');
    });

    test('quote and thread graph related cards preserve reference links', async ({
        page,
    }) => {
        const harness = await gotoHarness(page);
        const quoteItem = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.quotePostEventId}"]`,
        );
        const quoteCard = quoteItem
            .locator('.post-history-related-card')
            .filter({ hasText: harness.quoteContent });
        const quoteLink = quoteCard.getByRole('link', {
            name: harness.linkTargetUrl,
        });
        await expectReferenceLinkAttributes(quoteLink, harness.linkTargetUrl);
        await expectNoHorizontalOverflow(quoteCard);

        const replyItem = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.replyParentEventId}"]`,
        );
        await replyItem
            .getByRole('button', { name: '返信 1件を表示' })
            .click();
        const replyCard = replyItem
            .locator('.post-history-related-card')
            .filter({ hasText: harness.replyContent });
        await expectReferenceLinkAttributes(
            replyCard.getByRole('link', { name: harness.linkTargetUrl }),
            harness.linkTargetUrl,
        );

        const threadParentItem = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.threadParentPostEventId}"]`,
        );
        await threadParentItem
            .getByRole('button', { name: '返信先を見る' })
            .click();
        const parentCard = threadParentItem
            .locator('.post-history-related-card')
            .filter({ hasText: harness.quoteContent });
        await expectReferenceLinkAttributes(
            parentCard.getByRole('link', { name: harness.linkTargetUrl }),
            harness.linkTargetUrl,
        );
    });

    test('normal post action menu keeps extracted actions and opens raw JSON on both browser sizes', async ({
        page,
    }) => {
        const harness = await gotoHarness(page);
        const postItem = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.plainPostEventId}"]`,
        );
        const actionTrigger = postItem
            .locator('.post-preview-footer-right')
            .getByRole('button', { name: 'アクションを表示' });

        await actionTrigger.click();
        const actionMenu = visiblePostHistoryActionMenu(page);
        await expect(actionMenu.getByRole('menuitem')).toHaveText([
            '返信 1件を表示',
            'イベントIDをコピー',
            'イベントJSONを表示',
            '削除',
        ]);

        await actionMenu
            .getByRole('menuitem', { name: 'イベントJSONを表示' })
            .click();
        const rawJsonDialog = page.getByRole('dialog', { name: 'イベントJSON' });
        await expect(rawJsonDialog).toBeVisible();
        await expect(rawJsonDialog.locator('.raw-json-content')).toHaveText('null');
        await expect(page.locator('.post-history-dialog')).toBeVisible();

        await page.locator('.dialog-overlay').last().click({ position: { x: 8, y: 8 } });
        await expect(rawJsonDialog).toHaveCount(0);
        await expect(page.locator('.post-history-dialog')).toBeVisible();
    });

    test('resolved quote preview action menu keeps the extracted actions usable', async ({
        page,
    }) => {
        const harness = await gotoHarness(page);
        const quoteItem = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.quotePostEventId}"]`,
        );
        const quoteCard = quoteItem
            .locator('.post-history-related-card')
            .filter({ hasText: harness.quoteContent });

        await expect(quoteCard).toBeVisible();
        await quoteCard
            .getByRole('button', { name: 'アクションを表示' })
            .click();
        const actionMenu = visiblePostHistoryActionMenu(page);
        await expect(actionMenu.getByRole('menuitem')).toHaveText([
            'イベントIDをコピー',
            'イベントJSONを表示',
            'ブロードキャスト',
        ]);
    });

    test('thread graph node action menu keeps raw JSON before copy', async ({
        page,
    }) => {
        const harness = await gotoHarness(page);
        const threadParentItem = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.threadParentPostEventId}"]`,
        );

        await threadParentItem
            .getByRole('button', { name: '返信先を見る' })
            .click();
        const parentCard = threadParentItem
            .locator('.post-history-related-card')
            .filter({ hasText: harness.quoteContent });
        await expect(parentCard).toBeVisible();
        await parentCard
            .getByRole('button', { name: 'アクションを表示' })
            .click();
        const actionMenu = visiblePostHistoryActionMenu(page);
        await expect(actionMenu.getByRole('menuitem')).toHaveText([
            '返信を確認',
            'イベントJSONを表示',
            'イベントIDをコピー',
            'ブロードキャスト',
        ]);
    });

    test('mobile reference link stays tappable without changing parent state or overflowing', async ({
        page,
        isMobile,
    }) => {
        test.skip(!isMobile, 'mobile only');
        await page.route('**/reference-link-target', (route) =>
            route.fulfill({
                contentType: 'text/html',
                body: '<title>Reference target</title>',
            }),
        );
        const harness = await gotoHarness(page);
        const historyItem = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.linkPostEventId}"]`,
        );
        const link = historyItem.getByRole('link', {
            name: harness.linkTargetUrl,
        });
        const expandButton = historyItem.getByRole('button', {
            name: 'もっと見る',
        });

        await expectReferenceLinkAttributes(link, harness.linkTargetUrl);
        await expect(expandButton).toHaveAttribute('aria-expanded', 'false');
        await expectNoHorizontalOverflow(historyItem);
        const popupPromise = page.waitForEvent('popup');
        await link.tap();
        const popup = await popupPromise;
        await popup.close();
        await expect(expandButton).toHaveAttribute('aria-expanded', 'false');
        await expect(page.locator('.post-history-dialog')).toBeVisible();
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

        const loadingQuote = page
            .locator(`.post-history-item[data-post-history-event-id="${harness.quotePostEventId}"]`)
            .locator('.post-history-quote-status-card');
        await expect(loadingQuote).toContainText('引用投稿を読み込み中...');
        const loadingQuoteMetrics = await loadingQuote.evaluate((element) => ({
            clientWidth: (element as HTMLElement).clientWidth,
            scrollWidth: (element as HTMLElement).scrollWidth,
        }));
        expect(loadingQuoteMetrics.scrollWidth).toBeLessThanOrEqual(
            loadingQuoteMetrics.clientWidth + 1,
        );

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
