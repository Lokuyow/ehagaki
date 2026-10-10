import { expect, test, type Page } from "@playwright/test";

type State = { sends: number; signed: number; replyId?: string; quoteId?: string; deletionCount: number;
    sentEvents: { id: string; kind: number; tags: string[][] }[];
    lastResult?: { success: boolean; error?: string }; rows: { id: string; kind: number; content: string; targetId?: string; targetKind?: number }[] };
type FixtureWindow = Window & { __REPOST__: { ready: boolean; targetId: string; targetInput: string; read(): Promise<State>; allowTarget(): void;
    deleteOnRelay(): void; nextTarget(): string; rejectNextPublish(): void } };
const read = (page: Page) => page.evaluate(() => (window as unknown as FixtureWindow).__REPOST__.read());
async function open(page: Page, query = "") {
    await page.goto(`post-history-dialog-playwright.html?repost=1${query}`);
    await page.waitForFunction(() => (window as unknown as FixtureWindow).__REPOST__?.ready);
}

for (const entry of ['history', 'Composer', 'resolved target'] as const) {
    test(`${entry} blocks a relay-only deletion before signing even with a verified target and relay hint`, async ({ page }) => {
        await open(page, entry === 'Composer' ? '&source=target' : entry === 'resolved target' ? '&external=import' : '');
        if (entry === 'Composer') {
            await page.locator('.composer-target-dialog input').fill(await page.evaluate(() => (window as unknown as FixtureWindow).__REPOST__.targetInput));
            await expect(page.locator('.composer-target-dialog')).toContainText('original searchable post');
        } else if (entry === 'resolved target') {
            await expect.poll(async () => (await read(page)).rows[0]?.targetKind).toBe(1);
        }
        expect((await read(page)).deletionCount).toBe(0);
        await page.evaluate(() => (window as unknown as FixtureWindow).__REPOST__.deleteOnRelay());
        const container = entry === 'Composer' ? page.locator('.composer-target-dialog') : page.locator('.post-history-item').first();
        await container.getByRole('button', { name: entry === 'resolved target' ? '元投稿の操作' : 'アクションを表示', exact: true }).click();
        await page.getByRole('menuitem', { name: 'リポスト', exact: true }).click();
        await expect.poll(async () => { const state = await read(page); return [state.lastResult?.success, state.signed, state.sends, state.deletionCount]; }).toEqual([false, 0, 0, 1]);
        expect((await read(page)).sentEvents.filter(event => event.kind === 6)).toHaveLength(0);
    });
}

for (const outcome of ['success', 'failure'] as const) {
    test(`a previous save failure remains retryable after another Repost's transient ${outcome}`, async ({ page }) => {
        await open(page, '&source=target&save-failure=1');
        const input = page.locator('.composer-target-dialog input');
        await input.fill(await page.evaluate(() => (window as unknown as FixtureWindow).__REPOST__.targetInput));
        await expect(page.locator('.composer-target-dialog')).toContainText('original searchable post');
        const repost = async () => {
            await page.locator('.composer-target-dialog').getByRole('button', { name: 'アクションを表示', exact: true }).click();
            await page.getByRole('menuitem', { name: 'リポスト', exact: true }).click();
        };
        await repost();
        await expect(page.getByRole('button', { name: '再保存', exact: true })).toBeVisible();
        const first = (await read(page)).sentEvents[0]!;
        const originalTarget = first.tags.find(tag => tag[0] === 'e')![1];
        await input.fill(await page.evaluate(() => (window as unknown as FixtureWindow).__REPOST__.nextTarget()));
        await expect(page.locator('.composer-target-dialog')).toContainText('another original post');
        if (outcome === 'failure') await page.evaluate(() => (window as unknown as FixtureWindow).__REPOST__.rejectNextPublish());
        await repost();
        await expect.poll(async () => { const state = await read(page); return [state.signed, state.sends, state.lastResult?.success]; }).toEqual([2, 2, outcome === 'success']);
        await expect(page.getByRole('button', { name: '再保存', exact: true })).toBeVisible();
        await expect(page.locator('.floating-message')).toHaveCount(0, { timeout: 7000 });
        await expect(page.getByRole('button', { name: '再保存', exact: true })).toBeVisible();
        await page.getByRole('button', { name: '再保存', exact: true }).click();
        await expect.poll(async () => (await read(page)).rows.some(row => row.id === first.id && row.targetId === originalTarget)).toBe(true);
        expect(await read(page)).toMatchObject({ signed: 2, sends: 2 });
    });
}

test("history menu publishes empty-content Repost and retains the snapshot after offline reload", async ({ page, context }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await open(page, "&protected=1");
    const normal = page.locator('.post-history-item').first();
    await normal.getByRole('button', { name: 'アクションを表示', exact: true }).click();
    await page.getByRole('menuitem', { name: 'リポスト', exact: true }).click();
    await expect.poll(async () => { const state = await read(page); return [
        state.rows.filter(row => row.kind === 6).length, state.signed, state.sends, state.lastResult?.error ?? null, errors,
    ]; }).toEqual([1, 1, 1, null, []]);
    const state = await read(page);
    expect(state.rows.find(row => row.kind === 6)).toMatchObject({ content: "", targetKind: 1 });
    expect(state.sends).toBe(1);
    await expect(page.locator('.post-history-repost')).toContainText('original searchable post');
    await context.setOffline(true);
    await page.getByRole('button', { name: '閉じる', exact: true }).first().click();
    await page.getByRole('button', { name: 'Open history' }).click();
    await expect(page.locator('.post-history-repost')).toContainText('original searchable post');
    await context.setOffline(false);
    await page.reload();
    await expect(page.locator('.post-history-repost')).toContainText('original searchable post');
    await page.locator('.post-history-repost').getByRole('button', { name: 'リポストの操作', exact: true }).click();
    await expect(page.getByRole('menuitem', { name: 'リポスト', exact: true })).toHaveCount(0);
    await page.keyboard.press('Escape');
    await page.locator('.post-history-repost').getByRole('button', { name: '元投稿の操作', exact: true }).click();
    await expect(page.getByRole('menuitem', { name: 'リポスト', exact: true })).toBeVisible();
});

test("Composer target uses the menu, persists only the outer row, and retries the same save", async ({ page }) => {
    await open(page, '&source=target&save-failure=1');
    await page.locator('.composer-target-dialog input').fill(await page.evaluate(() => (window as unknown as FixtureWindow).__REPOST__.targetInput));
    await expect(page.locator('.composer-target-dialog')).toContainText('original searchable post');
    await page.locator('.composer-target-dialog').getByRole('button', { name: 'アクションを表示', exact: true }).click();
    await page.getByRole('menuitem', { name: 'リポスト', exact: true }).click();
    await expect(page.getByRole('button', { name: '再保存', exact: true })).toBeVisible();
    await page.getByRole('button', { name: '閉じる', exact: true }).click();
    await page.getByRole('button', { name: 'Open history' }).click();
    await expect(page.getByRole('button', { name: '再保存', exact: true })).toBeVisible();
    const retryBox = await page.getByRole('button', { name: '再保存', exact: true }).boundingBox();
    const closeBox = await page.getByRole('button', { name: '閉じる', exact: true }).boundingBox();
    expect(retryBox!.y + retryBox!.height).toBeLessThanOrEqual(closeBox!.y);
    await page.getByRole('button', { name: '再保存', exact: true }).click();
    await expect(page.getByRole('button', { name: '再保存', exact: true })).toHaveCount(0);
    await expect.poll(async () => (await read(page)).rows.length).toBe(1);
    const state = await read(page);
    expect(state.rows[0]).toMatchObject({ kind: 6, content: '', targetKind: 1 });
    expect(state.sends).toBe(1); expect(state.signed).toBe(1);
});

test("reference-based import preserves unresolved outer and recovers on retry", async ({ page }) => {
    await open(page, '&external=import&missing=1&extra-author=1');
    await expect(page.locator('.post-history-repost')).toContainText('元投稿を取得できませんでした');
    expect((await read(page)).rows).toHaveLength(1);
    await expect(page.locator('.post-history-repost')).not.toContainText('opaque content');
    await page.evaluate(() => (window as unknown as FixtureWindow).__REPOST__.allowTarget());
    await page.locator('.post-history-repost').getByRole('button', { name: '再試行', exact: true }).click();
    await expect(page.locator('.post-history-repost')).toContainText('original searchable post');
    await expect.poll(async () => (await read(page)).rows[0]?.targetKind).toBe(1);
    expect((await read(page)).rows).toHaveLength(1);
});

test("Repost menus and content reflow in a 320px iframe", async ({ page }) => {
    await open(page, '&external=relay');
    await expect.poll(async () => (await read(page)).rows[0]?.targetKind).toBe(1);
    const url = page.url();
    await page.setContent(`<iframe title="Full history fixture" src="${url}" style="width:320px;height:650px;border:0"></iframe>`);
    const frame = page.frameLocator('iframe');
    await expect(frame.locator('.post-history-repost')).toContainText('original searchable post');
    await frame.getByRole('button', { name: '元投稿の操作', exact: true }).click();
    await expect(frame.getByRole('menuitem', { name: 'リポスト', exact: true })).toBeVisible();
    const overflow = await frame.locator('html').evaluate(element => element.scrollWidth > element.clientWidth);
    expect(overflow).toBe(false);
});

test("verified realtime outer resolves and persists its target without adding an authored target row", async ({ page }) => {
    await open(page, '&external=realtime');
    await expect(page.locator('.post-history-repost')).toContainText('original searchable post');
    await expect.poll(async () => (await read(page)).rows[0]?.targetKind).toBe(1);
    expect((await read(page)).rows).toHaveLength(1);
});

test("outer and self-target raw JSON, reply, quote, resend and deletion keep their event IDs", async ({ page }) => {
    await open(page, '&external=import&self-target=1');
    const card = page.locator('.post-history-repost');
    await expect(card).toContainText('original searchable post');
    await expect.poll(async () => (await read(page)).rows[0]?.targetKind).toBe(1);
    const outer = (await read(page)).rows[0]!;
    await card.getByRole('button', { name: 'リプライ', exact: true }).click();
    await page.getByRole('button', { name: 'Open history' }).click();
    await card.getByRole('button', { name: '引用', exact: true }).click();
    await page.getByRole('button', { name: 'Open history' }).click();
    expect(await read(page)).toMatchObject({ replyId: outer.targetId, quoteId: outer.targetId });
    for (const [label, id, kind] of [['リポストの操作', outer.id, 6], ['元投稿の操作', outer.targetId, 1]] as const) {
        await card.getByRole('button', { name: label, exact: true }).click();
        await page.locator('[role="menu"][data-state="open"]').getByRole('menuitem', { name: 'イベントJSONを表示', exact: true }).click();
        const dialog = page.getByRole('dialog', { name: 'イベントJSON' });
        await expect(dialog).toBeVisible();
        const event = JSON.parse(await dialog.locator('.raw-json-content').innerText());
        expect(event).toMatchObject({ id, kind });
        await page.keyboard.press('Escape');
        await expect(dialog).toHaveCount(0);
        await card.getByRole('button', { name: label, exact: true }).click();
        await page.locator('[role="menu"][data-state="open"]').getByRole('menuitem', { name: 'ブロードキャスト', exact: true }).click();
        await expect.poll(async () => (await read(page)).sentEvents.some(event => event.id === id && event.kind === kind)).toBe(true);
    }
    await card.getByRole('button', { name: '元投稿の操作', exact: true }).click();
    await page.locator('[role="menu"][data-state="open"]').getByRole('menuitem', { name: '削除', exact: true }).click();
    await page.getByRole('alertdialog', { name: '削除リクエストを送信' }).getByRole('button', { name: '送信', exact: true }).click();
    await expect.poll(async () => { const state = await read(page); return [state.sentEvents.filter(event => event.kind === 5).length, state.deletionCount]; }).toEqual([1, 1]);
    await expect(card).toContainText('元投稿は削除済みです');
    expect((await read(page)).rows).toHaveLength(1);
    const deletion = (await read(page)).sentEvents.find(event => event.kind === 5)!;
    expect(deletion.tags).toContainEqual(['e', outer.targetId]);
    expect(deletion.tags).not.toContainEqual(['e', outer.id]);
    await card.getByRole('button', { name: 'リポストの操作', exact: true }).click();
    await page.locator('[role="menu"][data-state="open"]').getByRole('menuitem', { name: '削除', exact: true }).click();
    await page.getByRole('alertdialog', { name: '削除リクエストを送信' }).getByRole('button', { name: '送信', exact: true }).click();
    await expect.poll(async () => (await read(page)).sentEvents.filter(event => event.kind === 5).length).toBe(2);
    expect((await read(page)).sentEvents.filter(event => event.kind === 5)[1]?.tags).toContainEqual(['e', outer.id]);
});

test("360px CW and media preserve the gate, footer placement and keyboard menu focus in both themes", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await page.route('https://media.example.com/repost.png', route => route.fulfill({ contentType: 'image/png',
        body: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aLsQAAAAASUVORK5CYII=', 'base64') }));
    await open(page, '&external=import&cw=1');
    const card = page.locator('.post-history-repost');
    for (const theme of ['light', 'dark']) {
        await page.emulateMedia({ colorScheme: theme as 'light' | 'dark' });
        await expect(page.locator('html')).toHaveClass(new RegExp(theme));
        await expect(card.locator('.content-warning-prompt')).toBeVisible();
        await expect(card.locator('.post-preview-media')).toHaveCount(0);
        await card.getByRole('button', { name: '元投稿の操作', exact: true }).focus();
        await page.keyboard.press('Enter');
        const items = await page.getByRole('menuitem').allTextContents();
        expect(items.findIndex(text => text.trim() === 'リポスト')+1).toBe(items.findIndex(text => text.trim() === 'イベントJSONを表示'));
        await page.keyboard.press('Escape');
        await expect(card.getByRole('button', { name: '元投稿の操作', exact: true })).toBeFocused();
        expect(await page.locator('html').evaluate(element => element.scrollWidth > element.clientWidth)).toBe(false);
    }
    await expect(card.locator('.post-preview-footer').getByRole('button', { name: 'リポスト', exact: true })).toHaveCount(0);
    await card.getByRole('button', { name: '本文を表示', exact: true }).click();
    await expect(card).toContainText('long fixture text');
    await expect(card.locator('.post-preview-media')).toBeVisible();
});
