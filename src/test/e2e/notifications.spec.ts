import { expect, test, type Locator } from '@playwright/test';
import { fileURLToPath } from 'node:url';

test.beforeEach(async ({ context }) => {
    await context.route('https://profiles.example/**', route => route.fulfill({
        contentType: 'image/png',
        path: fileURLToPath(new URL('../../../public/ehagaki_icon_x512.png', import.meta.url)),
    }));
});

async function expectContainedActorAvatar(dialog: Locator) {
    const actor = dialog.locator('.notification-actor');
    await expect(actor).toContainText('Fixture sender');
    const image = actor.locator('img[data-avatar-image]');
    await expect.poll(() => image.evaluate(node => (node as HTMLImageElement).naturalWidth)).toBe(512);
    const bounds = await image.evaluate(node => {
        const image = node.getBoundingClientRect();
        const avatar = node.parentElement!.getBoundingClientRect();
        const actor = node.closest('.notification-actor')!.getBoundingClientRect();
        return {
            image: { left: image.left, top: image.top, right: image.right, bottom: image.bottom, width: image.width, height: image.height },
            avatar: { left: avatar.left, top: avatar.top, right: avatar.right, bottom: avatar.bottom, width: avatar.width, height: avatar.height },
            actor: { left: actor.left, top: actor.top, right: actor.right, bottom: actor.bottom },
        };
    });
    expect(bounds.image.width).toBeCloseTo(24);
    expect(bounds.image.height).toBeCloseTo(24);
    expect(bounds.avatar.width).toBeCloseTo(24);
    expect(bounds.avatar.height).toBeCloseTo(24);
    for (const container of [bounds.avatar, bounds.actor]) {
        expect(bounds.image.left).toBeGreaterThanOrEqual(container.left);
        expect(bounds.image.top).toBeGreaterThanOrEqual(container.top);
        expect(bounds.image.right).toBeLessThanOrEqual(container.right);
        expect(bounds.image.bottom).toBeLessThanOrEqual(container.bottom);
    }
}

test('notifications persist read state, render quotes, and hand reply/reaction to the composer', async ({ page }, info) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('post-history-dialog-playwright.html?notifications=1');
    const button = page.getByRole('button', { name: '通知（未読あり）', exact: true });
    await expect(button).toBeVisible();
    await expect(page.locator('.notification-badge')).toBeVisible();
    await button.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('A mention addressed to you', { exact: true })).toBeVisible();
    await expect(dialog.getByText('Quote notification text', { exact: true })).toBeVisible();
    await expect(dialog.getByText('Original notification target', { exact: true }).first()).toBeVisible();
    await expectContainedActorAvatar(dialog);
    await expect(page.locator('.notification-badge')).toHaveCount(0);
    await page.evaluate(() => (window as any).__NOTIFICATIONS__.add());
    await expect(dialog.getByText('New incoming notification', { exact: true })).toBeVisible();
    await expect.poll(() => page.evaluate(() => (window as any).__NOTIFICATIONS__.unread())).toBe(false);
    const mention = dialog.locator('.notification-entry').filter({ hasText: 'A mention addressed to you' });
    await mention.getByRole('button', { name: 'リプライ', exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.getByTestId('applied')).toHaveText('reply:A mention addressed to you');
    await page.getByRole('button', { name: '通知', exact: true }).click();
    await page.getByRole('dialog').locator('.notification-entry').filter({ hasText: 'A mention addressed to you' })
        .getByRole('button', { name: 'リアクションする', exact: true }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByTestId('applied')).toHaveText('reaction:A mention addressed to you');
    await page.evaluate(() => (window as any).__NOTIFICATIONS__.replay());
    await expect(page.locator('.notification-badge')).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => (window as any).__NOTIFICATIONS__.count())).toBe(5);
    await page.getByRole('button', { name: '通知', exact: true }).click();
    await expect(page.getByRole('dialog').locator('.notification-entry')).toHaveCount(5);
    await expect(page.getByRole('dialog').getByText('Original notification target', { exact: true })).toHaveCount(3);
    await page.screenshot({ path: info.outputPath('notifications-360.png') });
    await page.goBack();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByRole('button', { name: '通知', exact: true })).toBeFocused();
});

test('notification controls reflow in a 280px embedded viewport with both shortcuts', async ({ page }, info) => {
    await page.setViewportSize({ width: 800, height: 850 });
    await page.goto('post-history-dialog-playwright.html?notifications-host=1');
    const embedded = page.frameLocator('iframe[title="Notifications in a narrow host"]');
    await expect(embedded.getByRole('button', { name: '通知（未読あり）' })).toBeVisible();
    const boxes = await embedded.locator('.footer-bar button').evaluateAll(nodes => nodes.map(node => {
        const box = node.getBoundingClientRect(); return { left: box.left, right: box.right, width: box.width };
    }));
    expect(boxes).toHaveLength(6);
    for (const box of boxes) { expect(box.left).toBeGreaterThanOrEqual(0); expect(box.right).toBeLessThanOrEqual(280); expect(box.width).toBeGreaterThan(20); }
    for (let index = 1; index < boxes.length; index++) expect(boxes[index]!.left).toBeGreaterThanOrEqual(boxes[index - 1]!.right);
    await embedded.getByRole('button', { name: '通知（未読あり）' }).click();
    await expect(embedded.getByRole('dialog')).toBeVisible();
    await expect(embedded.getByRole('dialog').locator('.notification-entry')).toHaveCount(4);
    await expect(embedded.getByRole('dialog').getByText('Original notification target', { exact: true })).toHaveCount(3);
    await expectContainedActorAvatar(embedded.getByRole('dialog'));
    expect(await embedded.getByRole('dialog').evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
    await page.screenshot({ path: info.outputPath('notifications-280.png') });
    await embedded.getByRole('dialog').getByRole('button', { name: '閉じる', exact: true }).first().click();
    await expect(embedded.getByRole('dialog')).toHaveCount(0);
});

test('read state survives reloads and is shared across tabs, while hidden dialogs leave arrivals unread', async ({ page, context }) => {
    const url = 'post-history-dialog-playwright.html?notifications=1';
    await page.goto(url);
    await page.getByRole('button', { name: '通知（未読あり）' }).click();
    await expect(page.getByRole('dialog').locator('.notification-entry')).toHaveCount(4);
    await expect.poll(() => page.evaluate(() => (window as any).__NOTIFICATIONS__.unread())).toBe(false);
    await page.evaluate(() => {
        Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
        document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.evaluate(() => (window as any).__NOTIFICATIONS__.add());
    await expect(page.getByRole('dialog').getByText('New incoming notification', { exact: true })).toBeVisible();
    expect(await page.evaluate(() => (window as any).__NOTIFICATIONS__.unread())).toBe(true);
    await page.evaluate(() => {
        Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
        document.dispatchEvent(new Event('visibilitychange'));
    });
    await expect.poll(() => page.evaluate(() => (window as any).__NOTIFICATIONS__.unread())).toBe(false);
    await page.getByRole('dialog').getByRole('button', { name: '閉じる', exact: true }).click();
    const second = await context.newPage(); await second.goto(url);
    await expect(second.getByRole('button', { name: '通知', exact: true })).toBeVisible();
    await second.evaluate(() => (window as any).__NOTIFICATIONS__.add());
    await expect(page.locator('.notification-badge')).toBeVisible();
    await page.getByRole('button', { name: '通知（未読あり）' }).click();
    await expect(page.getByRole('dialog').locator('.notification-entry')).toHaveCount(6);
    await expect(second.locator('.notification-badge')).toHaveCount(0);
    await page.reload();
    await expect(page.getByRole('button', { name: '通知', exact: true })).toBeVisible();
    expect(await page.evaluate(() => (window as any).__NOTIFICATIONS__.count())).toBe(6);
});

test('unavailable targets retain the incoming notification and offer retry', async ({ page }) => {
    await page.goto('post-history-dialog-playwright.html?notifications=1&missing=1');
    await page.getByRole('button', { name: '通知（未読あり）' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Quote notification text', { exact: true })).toBeVisible();
    const unavailable = dialog.locator('.notification-entry').filter({ hasText: '元の投稿を表示できません' });
    await expect(unavailable).toHaveCount(2);
    await expect(unavailable.first().getByRole('button', { name: '再試行', exact: true })).toBeVisible();
    await unavailable.first().getByRole('button', { name: '再試行', exact: true }).click();
    await expect(dialog.locator('.notification-entry')).toHaveCount(4);
});
