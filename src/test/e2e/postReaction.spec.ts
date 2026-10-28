import { expect, test, type Page } from '@playwright/test';

test.describe.configure({ mode: 'parallel' });

type State = { signs: number; sends: { eventId: string; kind: number; relays: string[] }[]; saveEntered: boolean;
    uploads: { width: number; height: number; type: string; size: number; lossless: boolean; alpha: number }[];
    gallery: { id: string; src: string; isPlaceholder: boolean; mimeType?: string; dim?: string }[];
    isUploading: boolean; freePlacement: boolean; wire: { content: string; emoji: string[][] } | null;
    fullscreen: { id: string; src: string }; inlineMedia: { id: string; src: string }[];
    result: { success: boolean; cacheSaved: boolean } | null; targetId?: string; canPost: boolean;
    status: { success: boolean; sending: boolean }; children: { parent: string; eventId: string }[]; authored: number };
type Harness = { targetId: string; relatedId: string; nextId: string; targetInput: string; profileName: string; profilePicture: string; read(): Promise<State>;
    switchTarget(): void; switchAccount(): void; destroy(): void; releaseSave(): void; retryPublish(): void; saveIncomingReaction(toRelated?: boolean): Promise<void>;
    startReaction(): void; cancelReaction(): void; removeImages(): void; addExistingImage(): void;
    selectInlineImage(): void;
    createImage(type: string, width: number, height: number): Promise<number[]> };
type HarnessWindow = Window & { __REACTION__: Harness };
const read = (page: Page) => page.evaluate(() => (window as unknown as HarnessWindow).__REACTION__.read());
async function open(page: Page, query = '') {
    await page.goto(`post-reaction-playwright.html${query}`);
    await page.waitForFunction(() => !!(window as unknown as HarnessWindow).__REACTION__);
    return page.evaluate(() => { const h = (window as unknown as HarnessWindow).__REACTION__; return { targetId: h.targetId, relatedId: h.relatedId, nextId: h.nextId, targetInput: h.targetInput, profileName: h.profileName, profilePicture: h.profilePicture }; });
}
async function chooseTarget(page: Page, input: string, card: 'main' | 'related' = 'main') {
    await page.getByTestId('open-target').click();
    await page.getByPlaceholder('note または nevent を入力').fill(input);
    const actions = page.getByRole('button', { name: 'リアクションする', exact: true });
    await expect(actions.first()).toBeVisible();
    await (card === 'related' ? actions.first() : actions.last()).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.locator('.tiptap-editor')).toBeFocused();
}

async function imagePayload(page: Page, type = 'image/png', width = 512, height = 512) {
    const bytes = await page.evaluate(async ({ type, width, height }) => (window as unknown as HarnessWindow).__REACTION__.createImage(type, width, height), { type, width, height });
    return { name: `reaction.${type.split('/')[1]}`, mimeType: type, buffer: Buffer.from(bytes) };
}
async function uploadedReaction(page: Page, free = false) {
    const h = await open(page, `?uploaded${free ? '&free' : ''}`);
    const url = h.profilePicture;
    await page.route('**/reaction-fixture-upload', route => route.fulfill({ status: 200, json: { url } }));
    await page.evaluate(() => (window as unknown as HarnessWindow).__REACTION__.startReaction());
    await expect(page.locator('[data-reaction-target-id]')).toHaveCount(1);
    return h;
}

test('uploaded shortcode uses canonical wire, rejects whitespace and clears owned media after success', async ({ page }, testInfo) => {
    const h = await uploadedReaction(page, true);
    const editor = page.locator('.tiptap-editor');
    const selectAll = await page.evaluate(() =>
        /Mac|iP(hone|[oa]d)/.test(navigator.platform) ? 'Meta+A' : 'Control+A');
    await expect(page.locator('input[type=file]')).toHaveAttribute('accept', 'image/png,image/jpeg,image/webp,image/gif');
    await expect(page.locator('input[type=file]')).not.toHaveAttribute('multiple');
    await page.locator('input[type=file]').setInputFiles(await imagePayload(page));
    await expect.poll(async () => (await read(page)).isUploading).toBe(false);
    await editor.click(); await editor.pressSequentially('cat'); await expect(editor).toHaveText('cat');
    for (const text of [':blob:', '::blob::']) {
        // Keep selection and deletion on ProseMirror's keyboard input path.
        await editor.press(selectAll);
        await editor.press('Backspace');
        await expect(editor).toHaveText('');
        await editor.pressSequentially(text); await expect(editor).toHaveText(text);
        await expect(editor.locator('[data-custom-emoji]')).toHaveCount(0);
    }
    for (const text of ['cat', ':cat', 'cat:', ':cat:', '::cat::']) {
        await editor.fill(text); await expect.poll(async () => (await read(page)).canPost).toBe(true);
    }
    for (const text of ['cat ', ' cat', ' :cat: ', 'cat\u00a0', ':']) {
        await editor.fill(text); await expect(editor).toHaveText(text, { useInnerText: false });
        await expect.poll(async () => (await read(page)).canPost).toBe(false);
        expect((await read(page)).gallery).toHaveLength(1);
    }
    await editor.press(selectAll);
    await editor.press('Backspace');
    await expect(editor).toHaveText('');
    await editor.pressSequentially('https://invalid-shortcode.example/cat.png');
    await expect(editor).toHaveText('https://invalid-shortcode.example/cat.png');
    await expect.poll(async () => (await read(page)).canPost).toBe(false);
    expect((await read(page)).gallery).toHaveLength(1);
    await editor.fill('::cat::');
    expect((await read(page)).uploads[0]).toMatchObject({ width: 128, height: 128, type: 'image/png', alpha: 0 });
    expect((await read(page)).freePlacement).toBe(true);
    await page.setViewportSize({ width: 360, height: 800 });
    await expect(page.locator('.media-gallery')).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath('reaction-upload-360.png') });
    await page.getByRole('button', { name: '投稿', exact: true }).click();
    await expect.poll(async () => (await read(page)).wire?.content).toBe(':cat:');
    expect((await read(page)).wire?.emoji).toEqual([['emoji', 'cat', h.profilePicture]]);
    await expect(editor).toBeEmpty(); expect((await read(page)).gallery).toEqual([]);
});

test('placeholder permits shortcode editing, target change preserves upload, and image removal preserves long text', async ({ page }) => {
    const h = await open(page, '?uploaded');
    let release!: () => void;
    const wait = new Promise<void>(resolve => release = resolve);
    await page.route('**/reaction-fixture-upload', async route => { await wait; await route.fulfill({ json: { url: h.profilePicture } }).catch(() => {}); });
    await page.evaluate(() => (window as unknown as HarnessWindow).__REACTION__.startReaction());
    await page.locator('input[type=file]').setInputFiles(await imagePayload(page));
    await expect.poll(async () => (await read(page)).uploads.length).toBe(1);
    const editor = page.locator('.tiptap-editor'); await editor.fill('cat'); await expect(editor).toHaveText('cat');
    expect((await read(page)).canPost).toBe(false); expect((await read(page)).isUploading).toBe(true);
    await page.evaluate(() => (window as unknown as HarnessWindow).__REACTION__.switchTarget());
    release(); await expect.poll(async () => (await read(page)).canPost).toBe(true);
    expect((await read(page)).targetId).toBe(h.nextId);
    await page.evaluate(() => (window as unknown as HarnessWindow).__REACTION__.removeImages());
    await expect(editor).toHaveText('cat'); await expect.poll(async () => (await read(page)).canPost).toBe(false);
    await editor.fill('c'); await expect.poll(async () => (await read(page)).canPost).toBe(true);
    await editor.press('End'); await editor.pressSequentially('a'); await expect(editor).toHaveText('c');
});

for (const type of ['image/jpeg', 'image/webp']) test(`actual ${type} encoder retains aspect ratio and lossless WebP`, async ({ page }) => {
    await uploadedReaction(page);
    await page.locator('input[type=file]').setInputFiles(await imagePayload(page, type, 256, 512));
    await expect.poll(async () => (await read(page)).isUploading).toBe(false);
    const result = (await read(page)).uploads[0]; expect(result).toMatchObject({ type, width: 128, height: 256 });
    if (type === 'image/webp') { expect(result.lossless).toBe(true); expect(result.alpha).toBe(0); }
});

test('JPEG EXIF orientation is retained when resizing from oriented dimensions', async ({ page }) => {
    await uploadedReaction(page);
    const payload = await imagePayload(page, 'image/jpeg', 512, 256);
    // APP1: Exif, little-endian TIFF, one SHORT Orientation entry = 6 (90 degrees).
    const orientation = Buffer.from([255, 225, 0, 34, 69, 120, 105, 102, 0, 0, 73, 73, 42, 0, 8, 0, 0, 0,
        1, 0, 18, 1, 3, 0, 1, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0]);
    payload.buffer = Buffer.concat([payload.buffer.subarray(0, 2), orientation, payload.buffer.subarray(2)]);
    await page.locator('input[type=file]').setInputFiles(payload);
    await expect.poll(async () => (await read(page)).isUploading).toBe(false);
    expect((await read(page)).uploads[0]).toMatchObject({ type: 'image/jpeg', width: 128, height: 256 });
});

test('cancel in free placement preserves original inline media and restores the uploaded image as normal media', async ({ page }) => {
    await uploadedReaction(page, true);
    await page.evaluate(() => (window as unknown as HarnessWindow).__REACTION__.cancelReaction());
    await page.locator('input[type=file]').setInputFiles(await imagePayload(page, 'image/png', 64, 64));
    await expect.poll(async () => (await read(page)).isUploading).toBe(false);
    const originalImage = page.locator('.tiptap-editor img').first(); await expect(originalImage).toBeVisible();
    await page.evaluate(() => (window as unknown as HarnessWindow).__REACTION__.startReaction());
    await expect(originalImage).toBeVisible(); expect((await read(page)).gallery).toEqual([]);
    const h = await page.evaluate(() => (window as unknown as HarnessWindow).__REACTION__.profilePicture);
    await page.route('**/reaction-fixture-upload', route => route.fulfill({ json: { url: h } }));
    await page.locator('input[type=file]').setInputFiles(await imagePayload(page));
    await expect.poll(async () => (await read(page)).gallery.filter(item => !item.isPlaceholder).length).toBe(1);
    expect((await read(page)).canPost).toBe(false);
    await page.evaluate(() => (window as unknown as HarnessWindow).__REACTION__.cancelReaction());
    await expect(page.locator('.tiptap-editor img')).toHaveCount(2); expect((await read(page)).gallery).toEqual([]);
    expect((await read(page)).freePlacement).toBe(true);
});

test('old upload cannot reenter a new Reaction session after cancel', async ({ page }) => {
    const h = await open(page, '?uploaded&free');
    let release!: () => void; const wait = new Promise<void>(resolve => release = resolve);
    await page.route('**/reaction-fixture-upload', async route => { await wait; await route.fulfill({ json: { url: h.profilePicture } }).catch(() => {}); });
    await page.evaluate(() => (window as unknown as HarnessWindow).__REACTION__.startReaction());
    await page.locator('input[type=file]').setInputFiles(await imagePayload(page));
    await expect.poll(async () => (await read(page)).uploads.length).toBe(1);
    await page.evaluate(() => { const h = (window as unknown as HarnessWindow).__REACTION__; h.cancelReaction(); h.startReaction(); });
    await expect.poll(async () => (await read(page)).isUploading).toBe(false); release();
    await page.locator('.tiptap-editor').fill('c'); await page.locator('.tiptap-editor').pressSequentially('a');
    await expect(page.locator('.tiptap-editor')).toHaveText('c'); expect((await read(page)).gallery).toEqual([]);
});

test('free-placement Reaction fullscreen keeps inline and temporary Gallery identities through navigation', async ({ page }) => {
    const h = await uploadedReaction(page, true);
    await page.evaluate(() => (window as unknown as HarnessWindow).__REACTION__.cancelReaction());
    await page.locator('input[type=file]').setInputFiles(await imagePayload(page, 'image/png', 64, 64));
    await expect.poll(async () => (await read(page)).isUploading).toBe(false);
    const inline = (await read(page)).inlineMedia[0];
    expect(inline.id).toBeTruthy(); expect(inline.src).toBe(h.profilePicture);
    await page.evaluate(() => (window as unknown as HarnessWindow).__REACTION__.startReaction());
    const gallerySrc = `${h.profilePicture}?reaction-emoji=1`;
    await page.route('**/reaction-fixture-upload', route => route.fulfill({ json: { url: gallerySrc } }));
    await page.locator('input[type=file]').setInputFiles(await imagePayload(page));
    await expect.poll(async () => (await read(page)).isUploading).toBe(false);
    const gallery = (await read(page)).gallery[0];
    expect(gallery.id).not.toBe(inline.id); expect(gallery.src).toBe(gallerySrc);
    await expect(page.locator('.tiptap-editor img')).toBeVisible();
    await expect(page.locator('.media-gallery img')).toBeVisible();
    expect((await read(page)).freePlacement).toBe(true);

    const viewer = page.locator('.ehagaki-pswp');
    async function expectActiveImage(item: { id: string; src: string }, counter: string) {
        await expect(viewer).toBeVisible();
        await expect(viewer.locator('.pswp__counter')).toHaveText(counter);
        await expect.poll(() => viewer.locator('img.pswp__img:not(.pswp__img--placeholder)').evaluateAll(images => images
            .filter(image => { const rect = image.getBoundingClientRect(); return rect.left < innerWidth / 2 && rect.right > innerWidth / 2; })
            .map(image => (image as HTMLImageElement).src))).toEqual([item.src]);
        expect((await read(page)).fullscreen).toEqual(item);
    }
    // Node selection and the image button's fullscreen click are distinct existing gestures.
    await page.evaluate(() => (window as unknown as HarnessWindow).__REACTION__.selectInlineImage());
    await page.locator('.tiptap-editor .editor-image-button').click();
    await expectActiveImage(inline, '1 / 2');
    await viewer.getByRole('button', { name: '次のメディア', exact: true }).click();
    await expectActiveImage({ id: gallery.id, src: gallery.src }, '2 / 2');
    await viewer.getByRole('button', { name: '前のメディア', exact: true }).click();
    await expectActiveImage(inline, '1 / 2');
    await page.keyboard.press('Escape'); await expect(viewer).toBeHidden();
    await page.locator('.media-gallery').getByRole('button', { name: gallery.src, exact: true }).click();
    await expectActiveImage({ id: gallery.id, src: gallery.src }, '2 / 2');
    await page.keyboard.press('Escape'); await expect(viewer).toBeHidden();
    expect((await read(page)).freePlacement).toBe(true);
    expect((await read(page)).inlineMedia).toEqual([inline]);
});
test('main target commits mode, preserves invalid input, supports undo/redo and sends one Unicode value', async ({ page }) => {
    const h = await open(page, '?invalid');
    await chooseTarget(page, h.targetInput);
    const editor = page.locator('.tiptap-editor'); await expect(editor).toHaveText('AB');
    await expect.poll(async () => (await read(page)).canPost).toBe(false);
    await editor.fill('👍🏽'); await expect.poll(async () => (await read(page)).canPost).toBe(true);
    const modifier = await page.evaluate(() => /Mac|iP(hone|[oa]d)/.test(navigator.platform) ? 'Meta' : 'Control');
    await editor.press(`${modifier}+z`); await expect(editor).toHaveText('AB');
    await expect.poll(async () => (await read(page)).canPost).toBe(false);
    await editor.press(`${modifier}+Shift+z`); await expect(editor).toHaveText('👍🏽');
    await editor.press('End'); await editor.pressSequentially('A'); await expect(editor).toHaveText('👍🏽');
    await page.getByRole('button', { name: '投稿', exact: true }).click();
    await expect.poll(async () => (await read(page)).children.length).toBe(1);
    const state = await read(page); expect(state.children[0].parent).toBe(h.targetId); expect(state.signs).toBe(1);
    expect(state.authored).toBe(1); expect(state.sends.every(event => event.kind === 7)).toBe(true);
    await expect(page.locator('[data-reaction-target-id]')).toHaveCount(0); await expect(editor).toBeEmpty();
    await page.getByTestId('open-history').click();
    const count = page.getByRole('button', { name: 'リアクション 1件を表示', exact: true });
    await expect(count).toBeVisible(); await count.click();
    expect((await read(page)).targetId).toBeUndefined();
    await expect(page.getByRole('button', { name: 'リアクションする', exact: true }).first()).toBeVisible();
});
for (const kind of [6, 7, 16]) {
    test(`kind ${kind} main and related actions retain their own identity`, async ({ page }) => {
        const h = await open(page, `?kind=${kind}`); await chooseTarget(page, h.targetInput);
        await expect(page.locator('[data-reaction-target-id]')).toHaveAttribute('data-reaction-target-id', h.targetId);
        if (kind !== 7) await expect(page.locator('.reaction-target-preview')).not.toContainText('Original fixture');
        await page.getByRole('button', { name: 'リアクションを解除', exact: true }).click();
        await chooseTarget(page, h.targetInput, 'related');
        await expect(page.locator('[data-reaction-target-id]')).toHaveAttribute('data-reaction-target-id', h.relatedId);
    });
}
test('Post History outer and original actions preserve identity; Custom Emoji sends through the picker', async ({ page }) => {
    const h = await open(page, '?kind=6'); await page.getByTestId('open-history').click();
    await page.getByRole('button', { name: 'リアクションする', exact: true }).last().click();
    await expect(page.locator('[data-reaction-target-id]')).toHaveAttribute('data-reaction-target-id', h.targetId);
    await page.getByRole('button', { name: 'リアクションを解除', exact: true }).click();
    await page.getByTestId('open-history').click();
    await page.locator('.post-history-repost .post-history-related-card')
        .getByRole('button', { name: 'リアクションする', exact: true }).click();
    await expect(page.locator('[data-reaction-target-id]')).toHaveAttribute('data-reaction-target-id', h.relatedId);
    await page.getByRole('button', { name: 'カスタム絵文字', exact: true }).click();
    await page.getByRole('option', { name: ':blob:', exact: true }).click();
    await page.getByRole('button', { name: '投稿', exact: true }).click();
    await expect.poll(async () => (await read(page)).children[0]?.parent).toBe(h.relatedId);
    expect((await read(page)).signs).toBe(1);
});
for (const count of [0, 1]) {
    test(`kind 42 quote with ${count} reactions keeps the heart and count independent`, async ({ page }) => {
        const h = await open(page, '?quote-kind42&hold-reactions');
        await page.getByTestId('open-history').click();
        const quoteCard = page.locator('.post-preview-quotes .post-history-related-card');
        await expect(quoteCard).toBeVisible();
        const heart = quoteCard.getByRole('button', { name: 'リアクションする', exact: true });
        await expect(heart).toBeVisible();
        await expect(quoteCard.locator('.post-preview-reply-action-cell button')).toHaveCount(0);
        await expect(quoteCard.locator('.post-preview-quote-action-cell button')).toHaveCount(0);
        await expect(quoteCard.locator('.post-preview-reactions-button')).toHaveCount(0);
        await expect(quoteCard.locator('.post-preview-reaction-chip')).toHaveCount(0);
        if (count > 0) {
            await page.evaluate(() => (window as unknown as HarnessWindow).__REACTION__.saveIncomingReaction(true));
            const countButton = quoteCard.getByRole('button', { name: 'リアクション 1件を表示', exact: true });
            await expect(countButton).toHaveText('1');
            await expect(heart).toBeVisible();
            await countButton.click();
            await expect(quoteCard.locator('.post-preview-reaction-chip')).toHaveCount(1);
            await expect(page.getByRole('dialog')).toBeVisible();
            expect((await read(page)).targetId).toBeUndefined();
            await quoteCard.getByRole('button', { name: 'リアクションを隠す', exact: true }).click();
            await expect(quoteCard.locator('.post-preview-reaction-chip')).toHaveCount(0);
        }
        await heart.click();
        await expect(page.getByRole('dialog')).toHaveCount(0);
        await expect(page.locator('[data-reaction-target-id]')).toHaveAttribute('data-reaction-target-id', h.relatedId);
        await expect(page.locator('.tiptap-editor')).toBeFocused();
    });
}

test('Reaction shares Reply button, badge and composer profile geometry', async ({ page }) => {
    const h = await open(page, '?compare-reply');
    await page.evaluate(() => { document.documentElement.classList.add('dark'); document.documentElement.classList.remove('light'); document.documentElement.style.colorScheme = 'dark'; });
    await page.getByTestId('open-history').click();
    await page.evaluate(() => (window as unknown as HarnessWindow).__REACTION__.saveIncomingReaction());
    const footer = page.locator('.post-history-item .post-preview-footer').last();
    const count = page.getByRole('button', { name: 'リアクション 1件を表示', exact: true });
    await expect(count).toBeVisible();
    await expect(page.locator('.floating-message')).toHaveCount(0);
    for (const width of [800, 360, 320]) {
        await page.setViewportSize({ width, height: 900 });
        const geometry = await footer.evaluate(element => {
            const size = (selector: string) => {
                const node = element.querySelector<HTMLElement>(selector)!;
                const { width, height } = node.getBoundingClientRect();
                return { width, height, fontSize: getComputedStyle(node).fontSize, borderRadius: getComputedStyle(node).borderRadius };
            };
            return { reply: size('.post-preview-reply-button-slot button'), heart: size('.reaction-compose-button'),
                replyIcon: size('.reply-icon'), heartIcon: size('.reaction-compose-icon'),
                replyCount: size('.post-preview-footer-replies-slot button'), reactionCount: size('.post-preview-reactions-button'),
                replyBadge: size('.post-preview-footer-replies-slot .post-preview-replies-badge'), reactionBadge: size('.post-preview-reactions-button span') };
        });
        expect(geometry.heart).toEqual(geometry.reply);
        expect(geometry.heartIcon).toEqual(geometry.replyIcon);
        expect(geometry.reactionCount).toEqual(geometry.replyCount);
        expect(geometry.reactionBadge).toEqual(geometry.replyBadge);
        await footer.screenshot({ path: test.info().outputPath(`reaction-footer-${width}.png`) });
    }
    await page.getByRole('button', { name: 'リアクションする', exact: true }).last().click();
    const preview = page.locator('.reaction-target-preview');
    await expect(preview.locator('.author-name')).toHaveText(h.profileName);
    await expect(preview.locator('.author-profile img[data-avatar-image]')).toHaveAttribute('src', `${h.profilePicture}?profile=true`);
    await expect.poll(() => preview.locator('.author-profile img[data-avatar-image]').evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
    await expect(page.locator('.tiptap-editor .is-editor-empty')).toHaveAttribute('data-placeholder', 'いまどうしてる？');
    for (const width of [800, 360, 320]) {
        await page.setViewportSize({ width, height: 900 });
        const reply = await page.locator('.reply-quote-preview').boundingBox();
        const reaction = await preview.boundingBox();
        expect(reaction!.width).toBe(reply!.width);
        expect(reaction!.height).toBe(reply!.height);
        const avatars = await page.locator('.author-profile > .reply-quote-profile-avatar').evaluateAll(elements => elements.map(element => {
            const { width, height } = element.getBoundingClientRect(); return { width, height };
        }));
        expect(avatars).toEqual([{ width: 36, height: 36 }, { width: 36, height: 36 }]);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        await page.screenshot({ path: test.info().outputPath(`reaction-composer-${width}.png`) });
    }
});

for (const change of ['switchTarget', 'switchAccount', 'destroy'] as const) {
    test(`ACK then ${change} saves old target without changing current UI`, async ({ page }) => {
        const h = await open(page, '?hold-save'); await chooseTarget(page, h.targetInput);
        await page.locator('.tiptap-editor').fill('+'); await page.getByRole('button', { name: '投稿', exact: true }).click();
        await expect.poll(async () => (await read(page)).saveEntered).toBe(true);
        await page.evaluate(action => { const h = (window as unknown as HarnessWindow).__REACTION__; h[action](); h.releaseSave(); }, change);
        await expect.poll(async () => (await read(page)).children[0]?.parent).toBe(h.targetId);
        const state = await read(page); expect(state.result).toBeNull(); expect(state.status.success).toBe(false);
        expect(state.signs).toBe(1);
        if (change === 'switchTarget') { expect(state.targetId).toBe(h.nextId); await expect(page.locator('.tiptap-editor')).toHaveText('+'); }
    });
}
test('failed publish retains input; local save retry never publishes twice', async ({ page }) => {
    const h = await open(page, '?reject&fail-save'); await chooseTarget(page, h.targetInput);
    await page.locator('.tiptap-editor').fill('あ'); await page.getByRole('button', { name: '投稿', exact: true }).click();
    await expect.poll(async () => (await read(page)).status.sending).toBe(false);
    await expect(page.locator('.tiptap-editor')).toHaveText('あ');
    await page.evaluate(() => (window as unknown as HarnessWindow).__REACTION__.retryPublish());
    await page.getByRole('button', { name: '投稿', exact: true }).click();
    await expect(page.getByTestId('retry-save')).toBeVisible(); const before = await read(page);
    await page.getByTestId('retry-save').click(); await expect.poll(async () => (await read(page)).children.length).toBe(1);
    const after = await read(page); expect(after.signs).toBe(before.signs); expect(after.sends).toEqual(before.sends);
});
test('essential controls reflow at 360px and a 320px embed-width container', async ({ page }) => {
    const h = await open(page); await chooseTarget(page, h.targetInput);
    for (const width of [360, 320]) {
        await page.setViewportSize({ width, height: 720 });
        const clear = page.getByRole('button', { name: 'リアクションを解除', exact: true }); await expect(clear).toBeVisible();
        const box = await clear.boundingBox(); expect(box!.x + box!.width).toBeLessThanOrEqual(width);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        await page.screenshot({ path: test.info().outputPath(`reaction-${width}.png`) });
    }
});
test('Post History outer count reloads local cache without waiting for a held relay query', async ({ page }) => {
    await open(page, '?kind=6&hold-reactions'); await page.getByTestId('open-history').click();
    await expect(page.getByRole('button', { name: 'リアクションする', exact: true }).last()).toBeVisible();
    await page.evaluate(() => (window as unknown as HarnessWindow).__REACTION__.saveIncomingReaction());
    const count = page.getByRole('button', { name: 'リアクション 1件を表示', exact: true });
    await expect(count).toBeVisible(); await expect(count).toHaveText('1'); await count.click();
    expect((await read(page)).targetId).toBeUndefined();
});
test('320px keeps the heart, local count and post menu separate', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await open(page, '?kind=6&hold-reactions'); await page.getByTestId('open-history').click();
    await expect(page.getByRole('button', { name: 'リアクションする', exact: true }).first()).toBeVisible();
    await page.evaluate(() => (window as unknown as HarnessWindow).__REACTION__.saveIncomingReaction(true));
    const footer = page.locator('.post-preview-footer').first();
    const count = footer.getByRole('button', { name: 'リアクション 1件を表示', exact: true }); await expect(count).toBeVisible();
    const heartBox = await footer.getByRole('button', { name: 'リアクションする', exact: true }).boundingBox();
    const countBox = await count.boundingBox();
    const menuBox = await footer.locator('.post-preview-footer-right button').boundingBox();
    expect(heartBox!.x + heartBox!.width - countBox!.x).toBeLessThan(0.001);
    expect(countBox!.x + countBox!.width - menuBox!.x).toBeLessThan(0.001);
});
test('invalid target signature keeps the originating dialog and input intact', async ({ page }) => {
    const h = await open(page, '?invalid&bad-apply');
    await page.getByTestId('open-target').click(); await page.getByPlaceholder('note または nevent を入力').fill(h.targetInput);
    await page.getByRole('button', { name: 'リアクションする', exact: true }).click();
    await expect(page.getByRole('dialog')).toBeVisible(); await expect(page.locator('.tiptap-editor')).toHaveText('AB');
    await expect(page.locator('[data-reaction-target-id]')).toHaveCount(0);
    expect((await read(page)).signs).toBe(0);
});
for (const kind of [42, 1111]) {
    test(`kind ${kind} target sends a reaction to the main identity`, async ({ page }) => {
        const h = await open(page, `?kind=${kind}`); await chooseTarget(page, h.targetInput);
        await page.locator('.tiptap-editor').fill('+'); await page.getByRole('button', { name: '投稿', exact: true }).click();
        await expect.poll(async () => (await read(page)).children[0]?.parent).toBe(h.targetId);
    });
}

for (const free of [false, true]) test(`image URL reaction paste sends original URL, free placement=${free}`, async ({ page }) => {
    const h = await open(page, `?uploaded${free ? '&free' : ''}`);
    await page.evaluate(() => (window as unknown as HarnessWindow).__REACTION__.startReaction());
    const editor = page.locator('.tiptap-editor');
    const paste = async (text: string) => editor.evaluate((element, value) => {
        const data = new DataTransfer(); data.setData('text/plain', value);
        const event = new Event('paste', { bubbles: true, cancelable: true });
        Object.defineProperty(event, 'clipboardData', { value: data }); element.dispatchEvent(event);
    }, text);
    await editor.click();
    await paste(`${h.profilePicture} ${h.profilePicture}?second=1`);
    await expect.poll(async () => (await read(page)).gallery.length).toBe(2);
    expect((await read(page)).canPost).toBe(false);
    await page.evaluate(() => (window as unknown as HarnessWindow).__REACTION__.removeImages());
    await paste(h.profilePicture);
    await expect.poll(async () => (await read(page)).gallery.length).toBe(1);
    await expect(editor).toHaveText('');
    await editor.fill('url_cat');
    await expect.poll(async () => (await read(page)).canPost).toBe(true);
    await page.getByRole('button', { name: '投稿', exact: true }).click();
    await expect.poll(async () => (await read(page)).wire?.content).toBe(':url_cat:');
    expect((await read(page)).wire?.emoji).toEqual([['emoji', 'url_cat', h.profilePicture]]);
    expect((await read(page)).uploads).toEqual([]);
    expect((await read(page)).gallery).toEqual([]);
});
