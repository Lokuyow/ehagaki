import { expect, test, type Locator } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { finalizeEvent, generateSecretKey, getPublicKey, nip19 } from 'nostr-tools';

let pageErrors: string[] = [];
test.beforeEach(async ({ context, page }) => {
    pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    context.on('page', opened => opened.on('pageerror', error => pageErrors.push(error.message)));
    await context.route('https://profiles.example/**', route => route.fulfill({
        contentType: 'image/png',
        path: fileURLToPath(new URL('../../../public/ehagaki_icon_x512.png', import.meta.url)),
    }));
});
test.afterEach(() => expect(pageErrors).toEqual([]));

for (const width of [360, 280]) test(`reply title toggles the direct parent from the shared DB at ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('post-history-dialog-playwright.html?notifications=1&container=1');
    await expect(page.locator('.notification-btn')).toBeVisible();
    const parentId = await page.evaluate(() => Reflect.get(window, '__NOTIFICATIONS__').addReplyWithParent());
    await page.locator('.notification-btn').click();
    const dialog = page.getByRole('dialog');
    const entry = dialog.locator('.notification-entry').filter({ hasText: 'Nested reply notification' });
    const toggle = entry.locator('.notification-reply-toggle');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(entry.getByText('Direct reply parent', { exact: true })).toHaveCount(0);
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(entry.getByText('Direct reply parent', { exact: true })).toBeVisible();
    const parentBounds = (await entry.locator('.notification-reply-parent').boundingBox())!;
    const toggleBounds = (await toggle.boundingBox())!;
    expect(parentBounds.y + parentBounds.height).toBeLessThanOrEqual(toggleBounds.y);
    await expect(entry.getByText('Original notification target', { exact: true })).toHaveCount(0);
    expect(await entry.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
    await page.screenshot({ path: info.outputPath(`notification-reply-parent-${width}.png`) });
    await toggle.click();
    await expect(entry.getByText('Direct reply parent', { exact: true })).toHaveCount(0);
    await toggle.focus(); await page.keyboard.press('Enter');
    await expect(entry.getByText('Direct reply parent', { exact: true })).toBeVisible();
    expect(await page.evaluate(id => Reflect.get(window, '__NOTIFICATIONS__').requests().flat().filter((filter: { ids?: string[] }) => filter.ids?.includes(id)).length, parentId)).toBe(0);
    await entry.locator('.notification-reply-parent').getByRole('button', { name: 'リプライ', exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.getByTestId('applied')).toHaveText('reply:Direct reply parent');
});

test('reply parent missing state offers retry and closing clears expansion', async ({ page }) => {
    await page.goto('post-history-dialog-playwright.html?notifications=1');
    await expect(page.locator('.notification-btn')).toBeVisible();
    const parentId = await page.evaluate(() => Reflect.get(window, '__NOTIFICATIONS__').addReplyWithParent(true));
    await page.locator('.notification-btn').click();
    const entry = page.getByRole('dialog').locator('.notification-entry').filter({ hasText: 'Nested reply notification' });
    const requests = () => page.evaluate(id => Reflect.get(window, '__NOTIFICATIONS__').requests().flat().filter((filter: { ids?: string[] }) => filter.ids?.includes(id)).length, parentId);
    expect(await requests()).toBe(0);
    await entry.getByRole('button', { name: '返信先を見る', exact: true }).click();
    await expect(entry.getByText('返信先が見つかりませんでした', { exact: true })).toBeVisible();
    expect(await requests()).toBe(1);
    await entry.getByRole('button', { name: '再試行', exact: true }).click();
    await expect.poll(requests).toBe(2);
    await page.getByRole('button', { name: '閉じる', exact: true }).click();
    await page.locator('.notification-btn').click();
    await expect(entry.locator('.notification-reply-toggle')).toHaveAttribute('aria-expanded', 'false');
});

test('a delayed content module leaves the 280px shell closable and reopens safely', async ({ page }, info) => {
    let release = () => {};
    const gate = new Promise<void>(resolve => release = resolve);
    await page.route('**/src/components/NotificationDialogContent.svelte*', async route => { await gate; await route.continue(); });
    await page.goto('post-history-dialog-playwright.html?notifications-host=1');
    const frame = page.frameLocator('iframe[title="Notifications in a narrow host"]');
    await frame.locator('.notification-btn').click();
    const dialog = frame.getByRole('dialog');
    await expect(dialog.locator('.notification-opening-placeholder')).toBeVisible();
    const hostHeight = await frame.locator('body').evaluate(node => node.ownerDocument.documentElement.clientHeight);
    const bounds = (await dialog.boundingBox())!;
    const hostBounds = (await page.locator('iframe').boundingBox())!;
    expect(bounds.y - hostBounds.y).toBeCloseTo(0, 0);
    expect(bounds.height).toBeCloseTo(hostHeight, 0);
    const closeButton = dialog.locator('.modal-close');
    await expect(closeButton).toBeVisible();
    const closeBounds = (await closeButton.boundingBox())!;
    expect(closeBounds.y + closeBounds.height).toBeCloseTo(bounds.y + bounds.height, 0);
    expect(await dialog.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
    await page.screenshot({ path: info.outputPath('notification-skeleton-280.png') });
    await dialog.getByRole('button', { name: '閉じる', exact: true }).first().click();
    await expect(dialog).toHaveCount(0);
    await frame.locator('.notification-btn').click();
    await expect(dialog.locator('.notification-opening-placeholder')).toBeVisible();
    release();
    await expect(dialog.getByText('A mention addressed to you', { exact: true })).toBeVisible();
    await expect(dialog.locator('.notification-opening-placeholder')).toHaveCount(0);
});

test('opening shows a noninteractive skeleton until local data renders without waiting for sync', async ({ page }, info) => {
    await page.setViewportSize({ width: 360, height: 844 });
    await page.goto('post-history-dialog-playwright.html?notifications=1&opening=delay');
    await page.locator('.notification-btn').click();
    const dialog = page.getByRole('dialog');
    const bounds = (await dialog.boundingBox())!;
    expect(bounds.y).toBeCloseTo(0, 0);
    expect(bounds.height).toBeCloseTo(844, 0);
    await expect(dialog.locator('.notification-opening-placeholder')).toBeVisible();
    await expect(dialog.getByRole('button', { name: '更新', exact: true })).toHaveCount(0);
    await expect(dialog.locator('.notification-viewport')).toHaveAttribute('aria-busy', 'true');
    expect(await dialog.evaluate(node => getComputedStyle(node).animationDuration)).toBe('0.25s');
    await page.screenshot({ path: info.outputPath('notification-skeleton-360.png') });
    const viewportTop = (await dialog.locator('.notification-viewport').boundingBox())!.y;
    await page.evaluate(() => Reflect.get(window, '__NOTIFICATIONS__').releaseInitialList());
    await expect(dialog.locator('.notification-opening-placeholder')).toHaveCount(0);
    await expect(dialog.getByText('A mention addressed to you', { exact: true })).toBeVisible();
    await expect(dialog.locator('.notification-viewport')).toHaveAttribute('aria-busy', 'false');
    expect((await dialog.locator('.notification-viewport').boundingBox())!.y).toBeCloseTo(viewportTop, 0);
    expect(await dialog.locator('.notification-list').evaluate(node => getComputedStyle(node).animationName)).toBe('none');
    await page.goBack();
    await expect(dialog).toHaveCount(0);
    await expect(page.locator('.notification-btn')).toBeFocused();
});

for (const mode of ['empty', 'fail']) test(`opening exits the skeleton for local ${mode} and honors reduced motion`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`post-history-dialog-playwright.html?notifications=1&opening=${mode}`);
    await page.locator('.notification-btn').click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.locator('.notification-opening-placeholder')).toHaveCount(0);
    await expect(dialog.locator('.notification-viewport')).toHaveAttribute('aria-busy', 'false');
    expect(await dialog.evaluate(node => getComputedStyle(node).animationName)).toBe('none');
    await dialog.getByRole('button', { name: '閉じる', exact: true }).first().click();
    await expect(dialog).toHaveCount(0);
});

for (const width of [360, 791]) test(`shared footer uses the available width at ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('post-history-dialog-playwright.html?notifications=1');
    await page.locator('.notification-btn').click();
    const card = page.getByRole('dialog').locator('.notification-post.plain').first();
    const footer = card.locator('.post-preview-footer');
    await expect(footer).toBeVisible();
    const size = (await footer.boundingBox())!;
    expect(size.height).toBeCloseTo(size.width < 320 ? 72 : 36, 0);
    expect(await card.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
    await expect(footer.getByRole('button', { name: '引用', exact: true })).toBeVisible();
    await expect(footer.getByRole('button', { name: 'アクションを表示', exact: true })).toBeVisible();
    for (const theme of ['light', 'dark']) {
        await page.evaluate(value => { document.documentElement.classList.remove('light', 'dark'); document.documentElement.classList.add(value); document.documentElement.style.colorScheme = value; }, theme);
        const surface = await page.getByRole('dialog').evaluate(node => getComputedStyle(node).backgroundColor);
        const buttons = footer.locator('button');
        for (const button of await buttons.all()) await expect(button).toHaveCSS('background-color', surface);
        await page.screenshot({ path: info.outputPath(`footer-${width}-${theme}.png`) });
    }
});

test('post footers keep actions on their own events without related counts or lists', async ({ page }, info) => {
    await page.setViewportSize({ width: 360, height: 844 });
    await page.goto('post-history-dialog-playwright.html?notifications=1');
    await page.locator('.notification-btn').waitFor({ state: 'attached' });
    await expect(page.locator('.notification-btn')).toBeVisible();
    await page.evaluate(() => Reflect.get(window, '__NOTIFICATIONS__').seedInteractions());
    await page.locator('.notification-btn').click();
    const dialog = page.getByRole('dialog');
    const target = dialog.locator('.notification-entry:has(.notification-reaction) .notification-post').first();
    await target.scrollIntoViewIfNeeded();
    await expect(target.locator('.post-preview-footer')).toHaveCount(1);
    await expect(target.getByRole('button', { name: '引用', exact: true })).toBeVisible();
    await expect(target.getByRole('button', { name: /返信 .*件を表示|リアクション .*件を表示/ })).toHaveCount(0);
    await expect(dialog.getByText('Shared footer child reply', { exact: true })).toHaveCount(0);
    await expect(dialog.locator('.notification-post .post-preview-reactions-panel')).toHaveCount(0);
    await target.getByRole('button', { name: 'アクションを表示', exact: true }).first().click();
    for (const [selector, filename] of [['.copy-icon', 'file_copy_'], ['.raw-json-icon', 'data_object_'], ['.broadcast-icon', 'cell_tower_'], ['.trash-icon', 'delete_forever_']]) {
        const icon = page.getByRole('menu').locator(selector);
        await expect(icon).toBeVisible();
        expect(await icon.evaluate(node => getComputedStyle(node).maskImage)).toContain(filename);
    }
    await expect(page.getByRole('menuitem', { name: '削除', exact: true })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: '関連イベントを確認', exact: true })).toHaveCount(0);
    await page.getByRole('menuitem', { name: /JSON/ }).click();
    await expect(page.getByRole('dialog').last().getByText(/Original notification target/)).toBeVisible();
    await page.keyboard.press('Escape');
    await page.screenshot({ path: info.outputPath('shared-footer-360.png') });
    await target.getByRole('button', { name: '引用', exact: true }).first().click();
    await expect(dialog).toHaveCount(0);
    await expect(page.getByTestId('applied')).toHaveText('quote:Original notification target');
});

test('opening, scrolling and reopening never read or fetch post replies or reactions', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 844 });
    await page.goto('post-history-dialog-playwright.html?notifications=1');
    await page.locator('.notification-btn').waitFor({ state: 'attached' });
    await expect(page.locator('.notification-btn')).toBeVisible();
    await page.evaluate(() => Reflect.get(window, '__NOTIFICATIONS__').seedInteractions());
    for (let index = 0; index < 2; index++) {
        await page.locator('.notification-btn').click();
        const dialog = page.getByRole('dialog');
        await expect(dialog.locator('.notification-entry')).toHaveCount(3);
        await dialog.locator('.notification-entry').last().scrollIntoViewIfNeeded();
        await expect(dialog.getByRole('button', { name: /返信 .*件を表示|リアクション .*件を表示/ })).toHaveCount(0);
        await expect(dialog.getByText('関連イベントを取得できませんでした', { exact: true })).toHaveCount(0);
        await dialog.getByRole('button', { name: '閉じる', exact: true }).click();
        await expect(dialog).toHaveCount(0);
    }
    expect(await page.evaluate(() => Reflect.get(window, '__NOTIFICATIONS__').relatedActivity())).toEqual({ childReads: 0, repairs: 0 });
    expect(await page.evaluate(() => Reflect.get(window, '__NOTIFICATIONS__').cachedChildCount())).toBe(2);
    expect(await page.evaluate(() => Reflect.get(window, '__NOTIFICATIONS__').requests().flat().some((filter: { kinds?: number[]; '#e'?: string[] }) => filter['#e'] && filter.kinds?.some(kind => [1, 42, 1111, 7].includes(kind))))).toBe(false);
});

test('notification headers omit labels and times and identify reposts and replies with SVG icons', async ({ page }, info) => {
    await page.setViewportSize({ width: 360, height: 844 });
    await page.goto('post-history-dialog-playwright.html?notifications=1');
    await expect(page.locator('.notification-btn')).toBeVisible();
    await page.evaluate(() => Reflect.get(window, '__NOTIFICATIONS__').addReply());
    await page.locator('.notification-btn').click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.locator('.notification-reaction time, .notification-actor time')).toHaveCount(0);
    await expect(dialog.getByText('リアクション', { exact: true })).toHaveCount(0);
    await expect(dialog.getByText('リポスト', { exact: true })).toHaveCount(0);
    await expect(dialog.getByText('返信', { exact: true })).toHaveCount(0);
    const repost = dialog.getByRole('img', { name: 'リポスト', exact: true });
    const reply = dialog.locator('.notification-reply-icon');
    const heart = dialog.locator('.notification-reaction .favorite-icon').first();
    const heartColor = await heart.evaluate(node => getComputedStyle(node).backgroundColor);
    await heart.locator('xpath=ancestor::button[1]').hover();
    await expect(heart).toHaveCSS('background-color', heartColor);
    await expect(repost).toBeVisible(); await expect(reply).toBeVisible();
    expect(await repost.evaluate(node => getComputedStyle(node).maskImage)).toContain('repost.svg');
    expect(await reply.evaluate(node => getComputedStyle(node).maskImage)).toContain('chat_bubble_');
    const mention = dialog.locator('.notification-entry').filter({ hasText: 'A mention addressed to you' });
    const mentionIcon = mention.locator('.notification-mention-icon');
    await expect(mentionIcon).toBeVisible();
    for (const pill of await dialog.locator('.notification-reply-label, .post-preview-reaction-chip').all()) {
        expect((await pill.boundingBox())!.height).toBeCloseTo(34, 0);
    }
    expect(await mention.evaluate(node => node.querySelector('.notification-post')!.getBoundingClientRect().left - node.getBoundingClientRect().left)).toBeCloseTo(16, 0);
    expect(await mentionIcon.evaluate(node => getComputedStyle(node).maskImage)).toContain('alternate_email_');
    await expect(mention.getByText('メンション', { exact: true })).toBeVisible();
    const quote = dialog.locator('.notification-entry').filter({ hasText: 'Quote notification text' });
    const quoteIcon = quote.locator('.notification-quote-icon');
    await expect(quoteIcon).toBeVisible();
    expect(await quote.evaluate(node => node.querySelector('.notification-post')!.getBoundingClientRect().left - node.getBoundingClientRect().left)).toBeCloseTo(16, 0);
    expect(await quoteIcon.evaluate(node => getComputedStyle(node).maskImage)).toContain('format_quote_');
    await expect(quote.getByText('引用', { exact: true })).toBeVisible();
    await expect(dialog.getByText('Reply notification text', { exact: true })).toBeVisible();
    const replyEntry = dialog.locator('.notification-entry').filter({ hasText: 'Reply notification text' });
    await expect(replyEntry.locator('.notification-reply-label')).toHaveText('リプライ');
    const replyCard = replyEntry.locator('.post-history-related-card');
    await expect(replyCard).toHaveCSS('border-inline-start-width', '0px');
    await expect(replyCard).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await page.screenshot({ path: info.outputPath('notification-headers-360.png') });
    await expect(dialog.getByRole('button', { name: '閉じる', exact: true })).toHaveCount(1);
    const bottomClose = dialog.locator('.modal-close');
    await expect(bottomClose).toBeVisible();
    const closeBounds = (await bottomClose.boundingBox())!;
    expect(closeBounds.y + closeBounds.height).toBeCloseTo(844, 0);
    await bottomClose.click();
    await expect(dialog).toHaveCount(0);
    await expect(page.locator('.notification-btn')).toBeFocused();
});

test('notification images are compact and can be expanded independently', async ({ page }, info) => {
    await page.setViewportSize({ width: 360, height: 844 });
    await page.goto('post-history-dialog-playwright.html?notifications=1');
    await expect(page.locator('.notification-btn')).toBeVisible();
    await page.evaluate(() => Reflect.get(window, '__NOTIFICATIONS__').addImagePosts());
    await page.locator('.notification-btn').click();
    const dialog = page.getByRole('dialog');
    const article = dialog.locator('.notification-entry').filter({ hasText: 'MANY-ARTICLE-IMAGES' });
    const note = dialog.locator('.notification-entry').filter({ hasText: 'MANY-NOTE-IMAGES' });
    await expect(article.locator('.post-history-image-cell')).toHaveCount(3);
    await expect(note.locator('.post-history-image-cell')).toHaveCount(3);
    const toggle = article.getByRole('button', { name: '画像をすべて表示（8枚）' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.click();
    await expect(article.locator('.post-history-image-cell')).toHaveCount(8);
    await expect(note.locator('.post-history-image-cell')).toHaveCount(3);
    const hide = article.getByRole('button', { name: '画像を収納' });
    await expect(hide).toHaveAttribute('aria-expanded', 'true');
    await hide.focus();
    await page.keyboard.press('Enter');
    await expect(article.locator('.post-history-image-cell')).toHaveCount(3);
    await expect(article.getByRole('button', { name: '画像をすべて表示（8枚）' })).toBeFocused();
    await expect(note.getByRole('button', { name: 'リプライ' })).toBeVisible();
    expect(await dialog.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
    await page.screenshot({ path: info.outputPath('notification-images-360.png') });
    await article.locator('.post-history-media-surface').first().click();
    const viewer = page.locator('.pswp');
    await expect(viewer.locator('.pswp__counter')).toHaveText('1 / 8');
    await page.keyboard.press('ArrowRight');
    await expect(viewer.locator('.pswp__counter')).toHaveText('2 / 8');
    await page.keyboard.press('Escape');
    await expect(viewer).toHaveCount(0);
});

test('image controls fit inside a 280px embedded notification dialog', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 850 });
    await page.goto('post-history-dialog-playwright.html?notifications-host=1');
    const frame = page.frameLocator('iframe[title="Notifications in a narrow host"]');
    await expect(frame.locator('.notification-btn')).toBeVisible();
    await frame.locator('.footer-bar').evaluate(element => Reflect.get(element.ownerDocument.defaultView!, '__NOTIFICATIONS__').addImagePosts());
    await frame.locator('.notification-btn').click();
    const dialog = frame.getByRole('dialog');
    const article = dialog.locator('.notification-entry').filter({ hasText: 'MANY-ARTICLE-IMAGES' });
    await expect(article.locator('.post-history-image-cell')).toHaveCount(3);
    await article.getByRole('button', { name: '画像をすべて表示（8枚）' }).click();
    await expect(article.locator('.post-history-image-cell')).toHaveCount(8);
    expect(await dialog.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
    await article.getByRole('button', { name: '画像を収納' }).click();
    await expect(article.locator('.post-history-image-cell')).toHaveCount(3);
    expect(await dialog.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
});

test('collapses and independently expands long kind 1 and NIP-23 notification posts', async ({ page }, info) => {
    await page.setViewportSize({ width: 360, height: 844 });
    await page.goto('post-history-dialog-playwright.html?notifications=1');
    await expect(page.locator('.notification-btn')).toBeVisible();
    await page.evaluate(() => Reflect.get(window, '__NOTIFICATIONS__').addLongPosts());
    await page.locator('.notification-btn').click();
    const dialog = page.getByRole('dialog');
    const note = dialog.locator('.notification-entry').filter({ hasText: 'LONG-NOTE-START' });
    const article = dialog.locator('.notification-entry').filter({ hasText: 'LONG-ARTICLE-START' });
    const warning = dialog.locator('.notification-entry:has(button:text-is("本文を表示"))');
    await expect(note).toHaveCount(1); await expect(article).toHaveCount(1); await expect(warning).toHaveCount(1);
    const noteText = note.locator('.post-history-preview-text');
    const articleText = article.locator('.post-history-preview-text');
    const noteToggle = note.getByRole('button', { name: 'もっと見る' });
    const articleToggle = article.getByRole('button', { name: 'もっと見る' });
    await expect(noteToggle).toBeVisible(); await expect(articleToggle).toBeVisible();
    expect(await noteToggle.getAttribute('aria-controls')).not.toBe(await articleToggle.getAttribute('aria-controls'));
    const noteHeight = await noteText.evaluate(node => node.getBoundingClientRect().height);
    const articleHeight = await articleText.evaluate(node => node.getBoundingClientRect().height);
    expect(await noteText.evaluate(node => node.scrollHeight)).toBeGreaterThan(noteHeight);
    expect(await articleText.evaluate(node => node.scrollHeight)).toBeGreaterThan(articleHeight);
    await noteToggle.click();
    await expect(note.getByRole('button', { name: '折りたたむ' })).toHaveAttribute('aria-expanded', 'true');
    expect(await noteText.evaluate(node => node.getBoundingClientRect().height)).toBeGreaterThan(noteHeight);
    await expect(articleToggle).toHaveAttribute('aria-expanded', 'false');
    await articleToggle.click();
    expect(await articleText.evaluate(node => node.getBoundingClientRect().height)).toBeGreaterThan(articleHeight);
    await note.getByRole('button', { name: '折りたたむ' }).click();
    await expect(noteToggle).toHaveAttribute('aria-expanded', 'false');
    await article.getByRole('button', { name: '折りたたむ' }).click();
    await warning.getByRole('button', { name: '本文を表示' }).click();
    await expect(dialog.locator('.notification-entry').filter({ hasText: 'LONG-CW-START' }).getByRole('button', { name: 'もっと見る' })).toBeVisible();
    await expect(note.getByRole('button', { name: 'リプライ' })).toBeVisible();
    await page.screenshot({ path: info.outputPath('notification-long-posts-360.png') });
});

test('long notification posts remain usable in a 280px embedded host', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 850 });
    await page.goto('post-history-dialog-playwright.html?notifications-host=1');
    const frame = page.frameLocator('iframe[title="Notifications in a narrow host"]');
    await expect(frame.locator('.notification-btn')).toBeVisible();
    await frame.locator('.footer-bar').evaluate(element => Reflect.get(element.ownerDocument.defaultView!, '__NOTIFICATIONS__').addLongPosts());
    await frame.locator('.notification-btn').click();
    const dialog = frame.getByRole('dialog');
    const article = dialog.locator('.notification-entry').filter({ hasText: 'LONG-ARTICLE-START' });
    const toggle = article.getByRole('button', { name: 'もっと見る' });
    await expect(toggle).toBeVisible();
    expect(await dialog.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
    await toggle.click();
    await expect(article.getByRole('button', { name: '折りたたむ' })).toHaveAttribute('aria-expanded', 'true');
    expect(await dialog.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
});

test('groups reactions to the same target with actor icons, counts, custom emoji and one preview', async ({ page }, info) => {
    await page.setViewportSize({ width: 360, height: 844 });
    await page.goto('post-history-dialog-playwright.html?notifications=1');
    await page.getByRole('button', { name: '通知（未読あり）' }).click();
    await page.evaluate(() => Reflect.get(window, '__NOTIFICATIONS__').addReaction());
    await page.evaluate(() => Reflect.get(window, '__NOTIFICATIONS__').addGroupedReaction());
    const dialog = page.getByRole('dialog');
    const reactions = dialog.locator('.notification-entry:has(.notification-reaction)');
    await expect(reactions).toHaveCount(1);
    const custom = reactions.filter({ has: page.locator('img[alt=":demo:"]') });
    await expect(custom).toHaveCount(1);
    await expect(custom.locator('.notification-reaction .post-preview-reaction-avatar-image')).toHaveCount(3);
    await expect(custom.locator('.notification-reaction time')).toHaveCount(0);
    await expect(custom.locator('.notification-reaction .post-preview-reaction-count')).toHaveText(['2', '1']);
    await expect(custom.getByText('Original notification target', { exact: true })).toBeVisible();
    await expect(custom.getByRole('button', { name: 'リアクションする' })).toHaveCount(1);
    await page.screenshot({ path: info.outputPath('reaction-360.png') });
});

for (const width of [360, 280]) test(`combines reposts and reactions in one target card at ${width}px`, async ({ page }, info) => {
    if (width === 280) {
        await page.setViewportSize({ width: 800, height: 850 });
        await page.goto('post-history-dialog-playwright.html?notifications-host=1');
    } else {
        await page.setViewportSize({ width, height: 844 });
        await page.goto('post-history-dialog-playwright.html?notifications=1');
    }
    const content = width === 280 ? page.frameLocator('iframe[title="Notifications in a narrow host"]') : page;
    await content.locator('.notification-btn').waitFor({ state: 'attached' });
    await content.locator('body').evaluate(async node => {
        const api = Reflect.get(node.ownerDocument.defaultView!, '__NOTIFICATIONS__');
        await api.addRepost(); await api.addReaction();
    });
    await content.locator('.notification-btn').click();
    const dialog = content.getByRole('dialog');
    const combined = dialog.locator('.notification-entry:has(.notification-actor):has(.notification-reaction)');
    await expect(combined).toHaveCount(1);
    await expect(combined.locator('.notification-reposter')).toHaveCount(2);
    await expect(combined.locator('.notification-repost-icon')).toHaveCount(1);
    await expect(combined.locator('.notification-actor')).toHaveText('');
    await expect(combined.locator('.single-actor-name')).toHaveCount(0);
    const repostStyle = await combined.locator('.notification-repost-chip').evaluate(node => ({ radius: getComputedStyle(node).borderRadius, background: getComputedStyle(node).backgroundColor }));
    const reactionStyle = await combined.locator('.notification-reaction .post-preview-reaction-chip').first().evaluate(node => ({ radius: getComputedStyle(node).borderRadius, background: getComputedStyle(node).backgroundColor }));
    expect(repostStyle).toEqual(reactionStyle);
    await expect(combined.locator('.notification-reaction .post-preview-reaction-avatar-image')).toHaveCount(2);
    await expect(combined.locator('img[alt=":demo:"]')).toBeVisible();
    await expect(combined.getByText('Original notification target', { exact: true })).toHaveCount(1);
    await expect(combined.locator('.post-preview-footer')).toHaveCount(1);
    await expect(dialog.locator('.notification-entry').first()).toHaveAttribute('data-notification-target', await combined.getAttribute('data-notification-target') as string);
    expect(await dialog.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
    await page.screenshot({ path: info.outputPath(`combined-${width}.png`) });
    await dialog.getByRole('button', { name: '閉じる', exact: true }).click();
    await content.locator('body').evaluate(node => Reflect.get(node.ownerDocument.defaultView!, '__NOTIFICATIONS__').replay());
    await content.locator('.notification-btn').click();
    await expect(combined.locator('.notification-reposter')).toHaveCount(2);
    await expect(combined.getByText('Original notification target', { exact: true })).toHaveCount(1);
    expect(await content.locator('body').evaluate(node => Reflect.get(node.ownerDocument.defaultView!, '__NOTIFICATIONS__').relatedActivity())).toEqual({ childReads: 0, repairs: 0 });
    await expect.poll(() => content.locator('body').evaluate(node => Reflect.get(node.ownerDocument.defaultView!, '__NOTIFICATIONS__').unread())).toBe(false);
});

for (const width of [791, 360, 280]) test(`long actor names stay on one line inside notification pills at ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width: width === 280 ? 800 : width, height: 850 });
    await page.goto(width === 280 ? 'post-history-dialog-playwright.html?notifications-host=1' : 'post-history-dialog-playwright.html?notifications=1');
    const content = width === 280 ? page.frameLocator('iframe[title="Notifications in a narrow host"]') : page;
    await content.locator('.notification-btn').waitFor({ state: 'attached' });
    const longName = '寿限無 '.repeat(60) + '\n' + 'LongUnbrokenName'.repeat(60);
    await content.locator('body').evaluate((node, name) => Reflect.get(node.ownerDocument.defaultView!, '__NOTIFICATIONS__').setActorName(name), longName);
    await content.locator('.notification-btn').click();
    const dialog = content.getByRole('dialog');
    for (const selector of ['.notification-repost-name', '.single-actor-name']) {
        const name = dialog.locator(selector).first();
        await expect(name).toHaveText(longName);
        await expect(name).toHaveCSS('white-space', 'nowrap');
        await expect(name).toHaveCSS('text-overflow', 'ellipsis');
        expect(await name.evaluate(node => node.scrollWidth > node.clientWidth)).toBe(true);
        const chip = name.locator('..');
        const box = (await chip.boundingBox())!;
        expect(box.height).toBeLessThanOrEqual(40);
        const avatar = (await chip.locator('[data-avatar-image]').first().boundingBox())!;
        expect(avatar.width).toBeCloseTo(26, 0);
        expect(avatar.height).toBeCloseTo(26, 0);
    }
    expect(await dialog.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
    await page.screenshot({ path: info.outputPath(`actor-name-${width}.png`) });
    await dialog.locator('.single-actor-name').click();
    await expect(content.getByLabel('イベントID', { exact: true })).toBeVisible();
});

for (const width of [360, 280]) test(`live receiving keeps the head and shares one subscription at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width: width === 280 ? 800 : width, height: 850 });
    await page.goto(width === 280 ? 'post-history-dialog-playwright.html?notifications-host=1' : 'post-history-dialog-playwright.html?notifications=1');
    const content = width === 280 ? page.frameLocator('iframe[title="Notifications in a narrow host"]') : page;
    const api = (action: 'live' | 'count') => content.locator('body').evaluate((node, action) => {
        const harness = Reflect.get(node.ownerDocument.defaultView!, '__NOTIFICATIONS__');
        return action === 'live' ? harness.addLive(1) : harness.liveSubscriptions();
    }, action);
    await content.locator('.notification-btn').waitFor({ state: 'attached' });
    await expect.poll(() => api('count')).toBe(1);
    await content.locator('.notification-btn').click();
    const dialog = content.getByRole('dialog');
    await expect(dialog.locator('.notification-entry')).toHaveCount(3);
    await api('live');
    await expect(dialog.getByText('Live notification 1', { exact: true })).toHaveCount(1);
    expect(await dialog.locator('.dialog-content').evaluate(node => node.scrollTop)).toBe(0);
    await dialog.getByRole('button', { name: '閉じる', exact: true }).click();
    expect(await api('count')).toBe(1);
    await api('live');
    await expect(content.locator('.notification-badge')).toBeVisible();
    await content.locator('.notification-btn').click();
    await expect(dialog.getByText('Live notification 3', { exact: true })).toHaveCount(1);
    await expect(content.locator('.notification-badge')).toHaveCount(0);
    expect(await api('count')).toBe(1);
});

for (const width of [360, 280]) test(`live notifications preserve reading position beyond the local window at ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width: width === 280 ? 800 : width, height: 850 });
    await page.goto(width === 280 ? 'post-history-dialog-playwright.html?notifications-host=1' : 'post-history-dialog-playwright.html?notifications=1');
    const content = width === 280 ? page.frameLocator('iframe[title="Notifications in a narrow host"]') : page;
    await content.locator('.notification-btn').waitFor({ state: 'attached' });
    await content.locator('body').evaluate(node => Reflect.get(node.ownerDocument.defaultView!, '__NOTIFICATIONS__').addOlder(100));
    await content.locator('.notification-btn').click();
    const dialog = content.getByRole('dialog');
    await expect(dialog.locator('.notification-entry')).toHaveCount(99);
    const anchor = dialog.locator('.notification-entry').filter({ hasText: 'Older notification 95' });
    await anchor.scrollIntoViewIfNeeded();
    const top = (await anchor.boundingBox())!.y;
    const requests = await content.locator('body').evaluate(node => Reflect.get(node.ownerDocument.defaultView!, '__NOTIFICATIONS__').requests().length);
    await content.locator('body').evaluate(node => Reflect.get(node.ownerDocument.defaultView!, '__NOTIFICATIONS__').addLive(1));
    // Wait for the local snapshot to reach the DOM before measuring its geometry.
    await dialog.getByText('Live notification 1', { exact: true }).waitFor({ state: 'attached' });
    await expect(anchor).toBeVisible();
    await expect.poll(async () => Math.abs((await anchor.boundingBox())!.y - top)).toBeLessThanOrEqual(1);
    expect(await dialog.locator('.notification-entry').count()).toBeGreaterThan(99);
    expect(await content.locator('body').evaluate(node => Reflect.get(node.ownerDocument.defaultView!, '__NOTIFICATIONS__').requests().length)).toBe(requests);
    await page.screenshot({ path: info.outputPath(`live-scroll-${width}.png`) });
});

test('new reactions retain a visible grouped card even when its newest notification ID changes', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 650 });
    await page.goto('post-history-dialog-playwright.html?notifications=1');
    await page.locator('.notification-btn').waitFor({ state: 'attached' });
    await expect.poll(() => page.evaluate(() => Reflect.get(window, '__NOTIFICATIONS__').liveSubscriptions())).toBe(1);
    await page.evaluate(() => Reflect.get(window, '__NOTIFICATIONS__').addOlder(30));
    await page.locator('.notification-btn').click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Older notification 29', { exact: true })).toHaveCount(1);
    const card = dialog.locator('.notification-entry:has(.notification-reaction)');
    await card.scrollIntoViewIfNeeded();
    await card.evaluate(node => { const root = node.closest('.dialog-content')!; root.scrollTop += node.getBoundingClientRect().top - root.getBoundingClientRect().top + 4; });
    const top = (await card.boundingBox())!.y;
    const oldKey = await card.getAttribute('data-notification-id');
    await page.evaluate(() => Reflect.get(window, '__NOTIFICATIONS__').addLive(1, true));
    await expect(card).not.toHaveAttribute('data-notification-id', oldKey!);
    // Scroll offsets may be rounded to physical pixels in WebKit.
    await expect.poll(async () => Math.abs((await card.boundingBox())!.y - top)).toBeLessThanOrEqual(1);
    await expect.poll(() => page.evaluate(() => Reflect.get(window, '__NOTIFICATIONS__').unread())).toBe(false);
});

for (const kind of [6, 7]) for (const multiple of [false, true]) test(`actor selection opens target input for kind ${kind}, multiple=${multiple}`, async ({ page }, info) => {
    await page.setViewportSize({ width: 360, height: 844 });
    await page.goto('post-history-dialog-playwright.html?notifications=1');
    await page.locator('.notification-btn').waitFor({ state: 'attached' });
    if (multiple) await page.evaluate(value => {
        const api = Reflect.get(window, '__NOTIFICATIONS__');
        return value === 6 ? api.addRepost() : api.addGroupedReaction();
    }, kind);
    const sources = await page.evaluate(() => Reflect.get(window, '__NOTIFICATIONS__').sourceEvents()) as Array<{ id: string; pubkey: string; kind: number }>;
    await page.locator('.notification-btn').click();
    const prefix = kind === 6 ? '.notification-actor' : '.notification-reaction';
    const chip = page.locator(`${prefix} .post-preview-reaction-chip`).first();
    if (!multiple) await expect(chip).toContainText('Fixture sender');
    const button = multiple ? chip.locator('button[data-notification-event]').first() : chip;
    const id = await button.getAttribute('data-notification-event');
    const source = sources.find(event => event.id === id)!;
    expect(source.kind).toBe(kind);
    await page.screenshot({ path: info.outputPath(`actor-${kind}-${multiple}.png`) });
    await button.focus(); await page.keyboard.press('Enter');
    await expect(page.locator('.notification-list')).toHaveCount(0);
    const input = page.getByLabel('イベントID', { exact: true });
    await expect(input).toBeVisible();
    const pointer = nip19.decode((await input.inputValue()).replace(/^nostr:/, ''));
    expect(pointer.type).toBe('nevent');
    expect(pointer.data).toMatchObject({ id: source.id, author: source.pubkey, kind });
});

test('keeps an incompatible reaction separate without hiding the valid target', async ({ page }) => {
    await page.goto('post-history-dialog-playwright.html?notifications=1');
    await expect(page.getByRole('button', { name: '通知（未読あり）' })).toBeVisible();
    await page.evaluate(() => Reflect.get(window, '__NOTIFICATIONS__').addMismatchedReaction());
    await page.getByRole('button', { name: '通知（未読あり）' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Original notification target', { exact: true })).toHaveCount(2);
    const reactions = dialog.locator('.notification-entry:has(.notification-reaction)');
    await expect(reactions).toHaveCount(2);
    await expect(reactions.filter({ hasText: 'Original notification target' })).toHaveCount(1);
    const incompatible = reactions.filter({ hasNot: page.locator('.notification-post') });
    await expect(incompatible).toHaveCount(1);
    await expect(incompatible.getByRole('button', { name: '再試行', exact: true })).toHaveCount(1);
});

test('centers history with a shortcut on either side at desktop, phone, and embedded widths', async ({ page }) => {
    for (const width of [800, 360, 280]) {
        await page.setViewportSize({ width: 800, height: 850 });
        if (width === 280) {
            await page.goto('post-history-dialog-playwright.html?notifications-host=1');
        } else {
            await page.setViewportSize({ width, height: 850 });
            await page.goto('post-history-dialog-playwright.html?notifications=1');
        }
        const frame = width === 280 ? page.frameLocator('iframe[title="Notifications in a narrow host"]') : page;
        const footer = frame.locator('.footer-bar');
        await expect(footer).toBeVisible();
        for (const slots of [{ left: null, right: 'notifications' }, { left: 'notifications', right: null },
            { left: null, right: 'quote-notification' }, { left: 'image-quality', right: null }]) {
            await footer.evaluate((element, value) => {
                const view = element.ownerDocument.defaultView!;
                Reflect.get(view, '__NOTIFICATIONS__').setShortcuts(value);
            }, slots);
            const geometry = await footer.evaluate(element => {
                const rect = element.getBoundingClientRect();
                const history = element.querySelector<HTMLElement>('.post-history-btn')!.getBoundingClientRect();
                const buttons = Array.from(element.querySelectorAll<HTMLElement>('button')).map(button => {
                    const box = button.getBoundingClientRect();
                    return { left: box.left, right: box.right };
                });
                return { offset: Math.abs((history.left + history.right - rect.left - rect.right) / 2), buttons,
                    left: rect.left, right: rect.right, scrollWidth: element.ownerDocument.documentElement.scrollWidth,
                    viewportWidth: element.ownerDocument.documentElement.clientWidth };
            });
            expect(geometry.offset, `${width}: ${JSON.stringify(slots)} ${JSON.stringify(geometry)}`).toBeLessThanOrEqual(1);
            expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.viewportWidth);
            for (const button of geometry.buttons) {
                expect(button.left).toBeGreaterThanOrEqual(geometry.left - 0.5);
                expect(button.right).toBeLessThanOrEqual(geometry.right + 0.5);
            }
            for (let i = 1; i < geometry.buttons.length; i++) expect(geometry.buttons[i]!.left).toBeGreaterThanOrEqual(geometry.buttons[i - 1]!.right - 0.5);
        }
    }
});

test('upgrades a v18 history and read notification without resetting data or refetching the target', async ({ page }) => {
    const ownerKey = generateSecretKey(), authorKey = generateSecretKey(), owner = getPublicKey(ownerKey);
    const now = Math.floor(Date.now() / 1000);
    const original = finalizeEvent({ kind: 1, content: 'Original notification target', tags: [], created_at: now - 10 }, ownerKey);
    const incoming = [finalizeEvent({ kind: 7, content: '+', tags: [['p', owner], ['e', original.id]], created_at: now }, authorKey)];
    await page.route('**/migration-seed.html', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>migration fixture</title>' }));
    await page.goto('migration-seed.html');
    await page.evaluate(async fixture => {
        const schemaUrl = new URL('src/lib/swIndexedDbSchema.ts', location.href).href;
        const { ensureCurrentEHagakiDbSchema } = await import(/* @vite-ignore */ schemaUrl);
        localStorage.setItem('notificationPublicFixture', JSON.stringify(fixture));
        const db = await new Promise<IDBDatabase>((resolve, reject) => {
            const opening = indexedDB.open('eHagakiDB', 180);
            opening.onupgradeneeded = () => {
                ensureCurrentEHagakiDbSchema(opening.result, 'sharedMedia', opening.transaction);
                opening.result.deleteObjectStore('events');
                opening.result.deleteObjectStore('eventStoreMigration');
            };
            opening.onsuccess = () => resolve(opening.result); opening.onerror = () => reject(opening.error);
        });
        await new Promise<void>((resolve, reject) => {
            const tx = db.transaction(['postHistory', 'notifications'], 'readwrite');
            const event = fixture.original;
            tx.objectStore('postHistory').put({ id: event.id, eventId: event.id, pubkeyHex: event.pubkey, kind: event.kind,
                content: event.content, tags: event.tags, rawEvent: event, createdAt: event.created_at, postedAt: 12345,
                acceptedRelays: ['wss://accepted.example/'], fetchedRelays: ['wss://fixture.example/'], relayHints: [], media: [], updatedAt: 1, schemaVersion: 1 });
            for (const event of fixture.incoming) tx.objectStore('notifications').put({ id: `${fixture.owner}:${event.id}`,
                ownerPubkeyHex: fixture.owner, eventId: event.id, event, createdAt: event.created_at,
                receivedAt: 456, unread: 0, relayUrls: ['wss://fixture.example/'] });
            tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error);
        }); db.close();
    }, { owner, original, incoming });
    await page.goto('post-history-dialog-playwright.html?notifications=1');
    await page.getByRole('button', { name: '通知', exact: true }).click();
    await expect(page.getByRole('dialog').getByText('Original notification target', { exact: true })).toBeVisible();
    const saved = await page.evaluate(() => Reflect.get(window, '__NOTIFICATIONS__').storage());
    expect(saved.event?.rawEvent).toEqual(JSON.parse(JSON.stringify(original)));
    expect(saved.notifications).toMatchObject([{ unread: 0, receivedAt: 456 }]);
    expect(saved.notifications[0]).not.toHaveProperty('event');
    expect(await page.evaluate(() => Reflect.get(window, '__NOTIFICATIONS__').requests().flat()
        .filter((filter: { ids?: string[] }) => filter.ids?.length).length)).toBe(0);
});

test('notification targets survive reload and are read from the shared event store without another target REQ', async ({ page }) => {
    await page.goto('post-history-dialog-playwright.html?notifications=1');
    await page.getByRole('button', { name: '通知（未読あり）' }).click();
    await expect(page.getByRole('dialog').getByText('Original notification target', { exact: true })).toHaveCount(2);
    const stored = await page.evaluate(() => Reflect.get(window, '__NOTIFICATIONS__').storage());
    expect(stored.event?.rawEvent.content).toBe('Original notification target');
    expect(stored.notifications).toHaveLength(4);
    for (const notification of stored.notifications) expect(notification).not.toHaveProperty('event');
    await page.reload();
    await page.getByRole('button', { name: '通知', exact: true }).click();
    await expect(page.getByRole('dialog').getByText('Original notification target', { exact: true })).toHaveCount(2);
    const targetRequests = await page.evaluate(() => {
        const fixture = JSON.parse(localStorage.getItem('notificationPublicFixture')!);
        const harness = Reflect.get(window, '__NOTIFICATIONS__');
        return harness.requests().flat().filter((filter: { ids?: string[] }) => filter.ids?.includes(fixture.original.id)).length;
    });
    expect(targetRequests).toBe(0);
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
    expect(bounds.image.width).toBeCloseTo(26);
    expect(bounds.image.height).toBeCloseTo(26);
    expect(bounds.avatar.width).toBeCloseTo(26);
    expect(bounds.avatar.height).toBeCloseTo(26);
    for (const container of [bounds.avatar, bounds.actor]) {
        expect(bounds.image.left).toBeGreaterThanOrEqual(container.left);
        expect(bounds.image.top).toBeGreaterThanOrEqual(container.top);
        expect(bounds.image.right).toBeLessThanOrEqual(container.right);
        expect(bounds.image.bottom).toBeLessThanOrEqual(container.bottom);
    }
}

async function expectRoundNotification(button: Locator) {
    const box = await button.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeCloseTo(box!.height);
    expect(box!.width).toBeGreaterThanOrEqual(44);
}

test('notifications persist read state, render quotes, and hand reply/reaction to the composer', async ({ page }, info) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('post-history-dialog-playwright.html?notifications=1');
    await page.waitForFunction(() => Reflect.has(window, '__NOTIFICATIONS__'));
    const button = page.getByRole('button', { name: '通知（未読あり）', exact: true });
    await expect(button).toBeVisible();
    await expectRoundNotification(button);
    await expect(page.locator('.notification-badge')).toBeVisible();
    await button.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('A mention addressed to you', { exact: true })).toBeVisible();
    await expect(dialog.getByText('Quote notification text', { exact: true })).toBeVisible();
    await expect(dialog.getByText('Original notification target', { exact: true }).first()).toBeVisible();
    const targets = dialog.locator('.notification-post.plain .post-history-related-card');
    await expect(targets).toHaveCount(3);
    for (const target of await targets.all()) {
        await expect(target).toHaveCSS('border-inline-start-width', '0px');
        await expect(target).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
        const lefts = await target.evaluate(node => ['.post-history-related-author', '.post-history-preview-text', '.post-preview-date']
            .map(selector => node.querySelector(selector)!.getBoundingClientRect().left));
        expect(lefts[1]).toBeCloseTo(lefts[0], 0);
        expect(lefts[2]).toBeCloseTo(lefts[0], 0);
    }
    const quote = dialog.locator('.notification-entry').filter({ hasText: 'Quote notification text' })
        .locator('.notification-post').last().locator('.post-history-related-card');
    await expect(quote).toHaveCSS('border-inline-start-width', '2px');
    for (const text of ['Quote notification text', 'A mention addressed to you']) {
        const source = dialog.locator('.notification-entry').filter({ hasText: text }).locator('.notification-post').first();
        await expect(source).toHaveClass(/\bplain\b/);
    }
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
    await expect(page.getByRole('dialog').locator('.notification-entry')).toHaveCount(4);
    await expect(page.getByRole('dialog').getByText('Original notification target', { exact: true })).toHaveCount(2);
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
    await expectRoundNotification(embedded.getByRole('button', { name: '通知（未読あり）' }));
    const boxes = await embedded.locator('.footer-bar button').evaluateAll(nodes => nodes.map(node => {
        const box = node.getBoundingClientRect(); return { left: box.left, right: box.right, width: box.width };
    }));
    expect(boxes).toHaveLength(5);
    for (const box of boxes) { expect(box.left).toBeGreaterThanOrEqual(0); expect(box.right).toBeLessThanOrEqual(280); expect(box.width).toBeGreaterThan(20); }
    for (let index = 1; index < boxes.length; index++) expect(boxes[index]!.left).toBeGreaterThanOrEqual(boxes[index - 1]!.right);
    await embedded.getByRole('button', { name: '通知（未読あり）' }).click();
    await expect(embedded.getByRole('dialog')).toBeVisible();
    await expect(embedded.getByRole('dialog').locator('.notification-entry')).toHaveCount(3);
    await expect(embedded.getByRole('dialog').getByText('Original notification target', { exact: true })).toHaveCount(2);
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
    await expect(page.getByRole('dialog').locator('.notification-entry')).toHaveCount(3);
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
    await page.getByRole('dialog').getByRole('button', { name: '閉じる', exact: true }).first().click();
    const second = await context.newPage(); await second.goto(url);
    await expect(second.getByRole('button', { name: '通知', exact: true })).toBeVisible();
    await second.evaluate(() => (window as any).__NOTIFICATIONS__.add());
    await expect(page.locator('.notification-badge')).toBeVisible();
    await page.getByRole('button', { name: '通知（未読あり）' }).click();
    await expect(page.getByRole('dialog').locator('.notification-entry')).toHaveCount(5);
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
    await expect(unavailable).toHaveCount(1);
    await expect(unavailable.first().getByRole('button', { name: '再試行', exact: true })).toBeVisible();
    await unavailable.first().getByRole('button', { name: '再試行', exact: true }).click();
    await expect(dialog.locator('.notification-entry')).toHaveCount(3);
});

test('opening notifications clears unread saved beyond the first local page without fetching more', async ({ page }) => {
    const url = 'post-history-dialog-playwright.html?notifications=1';
    await page.goto(url);
    await page.waitForFunction(() => Reflect.has(window, '__NOTIFICATIONS__'));
    await page.evaluate(() => (window as any).__NOTIFICATIONS__.addOlder(101));
    await page.getByRole('button', { name: '通知（未読あり）', exact: true }).click();
    await expect(page.getByRole('dialog').locator('.notification-entry')).toHaveCount(99);
    await expect(page.locator('.notification-badge')).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => (window as any).__NOTIFICATIONS__.unread())).toBe(false);
    // Even an older event arriving while the inbox is open must not leave the badge on.
    await page.evaluate(() => (window as any).__NOTIFICATIONS__.addOlder(102));
    await expect.poll(() => page.evaluate(() => (window as any).__NOTIFICATIONS__.unread())).toBe(false);
    expect(await page.evaluate(() => (window as any).__NOTIFICATIONS__.requests()
        .flat().some((filter: { since?: number }) => filter.since === 0))).toBe(false);
    await page.getByRole('dialog').getByRole('button', { name: '閉じる', exact: true }).first().click();
    await page.reload();
    await expect(page.getByRole('button', { name: '通知', exact: true })).toBeVisible();
    expect(await page.evaluate(() => (window as any).__NOTIFICATIONS__.count())).toBe(106);
});

test('notification slots control traffic, persist removal, and close an open dialog when disabled', async ({ page, context }) => {
    const url = 'post-history-dialog-playwright.html?notifications=1';
    await page.goto(url);
    await expect(page.locator('.notification-btn')).toBeVisible();
    const set = (slots: { left: string | null; right: string | null }) => page.evaluate(value => (window as any).__NOTIFICATIONS__.setShortcuts(value), slots);
    const kinds = () => page.evaluate(() => (window as any).__NOTIFICATIONS__.requests().flatMap((filters: any[]) => filters.flatMap(filter => filter.kinds ?? [])));
    await expect.poll(kinds).toContain(6);
    await set({ left: 'notifications', right: 'image-quality' });
    const bell = (await page.locator('.notification-btn').boundingBox())!;
    const history = (await page.locator('.post-history-btn').boundingBox())!;
    expect(bell.x + bell.width).toBeLessThanOrEqual(history.x);
    await set({ left: 'image-quality', right: 'video-quality' });
    await expect(page.locator('.notification-btn')).toHaveCount(0);
    await page.reload();
    await expect(page.locator('.post-history-btn')).toBeVisible();
    await expect.poll(kinds).toContain(7);
    expect(await kinds()).not.toContain(6);
    expect(await kinds()).not.toContain(16);
    const second = await context.newPage();
    await second.goto(url);
    await expect(second.locator('.post-history-btn')).toBeVisible();
    await second.evaluate(() => (window as any).__NOTIFICATIONS__.setShortcuts({ left: null, right: 'notifications' }));
    await expect(page.locator('.notification-btn')).toBeVisible();
    await expect.poll(kinds).toContain(6);
    await page.locator('.notification-btn').click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await set({ left: null, right: 'video-quality' });
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.locator('.notification-btn')).toHaveCount(0);
});
