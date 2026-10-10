import { expect, test, type Page } from "@playwright/test";

type State = { sends: number; signed: number; replyId?: string; quoteId?: string; deletionCount: number; deletionRequests: number;
    sentEvents: { id: string; kind: number; tags: string[][] }[];
    lastResult?: { success: boolean; error?: string }; rows: { id: string; kind: number; content: string; targetId?: string; targetKind?: number; channelEventId?: string; channelRelayHints?: string[] }[] };
type FixtureWindow = Window & { __REPOST__: { ready: boolean; targetId: string; targetInput: string; read(): Promise<State>; allowTarget(): void;
    deleteOnRelay(): void; rememberDeletion(): Promise<unknown>; nextTarget(): string; rejectNextPublish(): void;
    export(): Promise<string>; releaseHistory(): void; releasePublish(): void } };
const read = (page: Page) => page.evaluate(() => (window as unknown as FixtureWindow).__REPOST__.read());
async function open(page: Page, query = "") {
    const group = test.info().titlePath.find(title => /^target kind /.test(title));
    const kind = group?.split(" ")[2] ?? "1";
    const params = new URLSearchParams(`repost=1&target-kind=${kind}`);
    new URLSearchParams(query).forEach((value, key) => params.set(key, value));
    await page.goto(`post-history-dialog-playwright.html?${params}`);
    await page.waitForFunction(() => (window as unknown as FixtureWindow).__REPOST__?.ready);
}

for (const targetKind of [1, 42, 1111]) {
const outerKind = targetKind === 1 ? 6 : 16;
test.describe(`target kind ${targetKind}`, () => {

test('supported target projection keeps channel enrichment, wire tags, menu layout and outer-only JSONL', async ({ page }) => {
    await open(page, '&external=import&missing-k=1');
    const card = page.locator('.post-history-repost');
    await expect(card).toContainText('original searchable post');
    await expect.poll(async () => (await read(page)).rows[0]?.targetKind).toBe(targetKind);
    const outer = (await read(page)).rows[0]!;
    expect(outer.channelEventId).toBeUndefined(); expect(outer.channelRelayHints).toBeUndefined();
    if (targetKind === 42) {
        await expect(card.locator('.repost-channel-row')).toContainText('Generic channel');
        await page.locator('.post-history-heading-search-button').click();
        await page.locator('.post-history-search-input').fill('Generic channel');
        await expect(card).toContainText('original searchable post');
    }
    await expect(card.locator(':scope > .post-preview-footer')).toHaveCount(0);
    const button = card.locator('.post-history-repost-label .post-history-menu-trigger');
    const box = await button.boundingBox();
    expect(box?.width).toBe(28); expect(box?.height).toBe(28);
    expect(await card.locator('.post-history-repost-icon').evaluate(el => getComputedStyle(el).maskImage)).toContain('repost.svg');
    const jsonl = await page.evaluate(() => (window as unknown as FixtureWindow).__REPOST__.export());
    const events = jsonl.trim().split('\n').map(line => JSON.parse(line));
    expect(events).toHaveLength(1); expect(events[0]).toMatchObject({ id: outer.id, kind: outerKind });
    expect(events[0].tags).toContainEqual(['e', outer.targetId, 'wss://relay.example.com/']);
    await card.getByRole('button', { name: '元投稿の操作', exact: true }).click();
    await page.getByRole('menuitem', { name: 'リポスト', exact: true }).click();
    await expect.poll(async () => (await read(page)).lastResult?.success).toBe(true);
    const sent = (await read(page)).sentEvents.find(event => event.kind === outerKind)!;
    expect(sent.tags).toContainEqual(['e', outer.targetId, 'wss://relay.example.com/']);
    if (targetKind !== 1) expect(sent.tags).toContainEqual(['k', String(targetKind)]);
    else expect(sent.tags.some(tag => tag[0] === 'k')).toBe(false);
});

test('history header controls and anchored status coexist with Repost sending and success feedback', async ({ page }, testInfo) => {
    await open(page, '&hold-history=1&hold-publish=1');
    const heading = page.locator('.post-history-heading');
    const status = page.locator('.floating-message.anchor-bottom-right');
    await expect(status).toContainText('リレーと同期中...');
    await expect(status).toBeVisible();
    await expect(heading.locator('.post-history-heading-calendar-button')).toBeVisible();
    await expect(heading.locator('.post-history-heading-search-button')).toBeVisible();
    await expect(heading.locator('.post-history-heading-refetch-button')).toBeDisabled();
    await expect(heading.locator('.post-history-summary-count')).toHaveCount(0);
    await heading.locator('.post-history-heading-menu-trigger').click();
    await expect(page.locator('.post-history-menu-summary')).toContainText('1件保存');
    await expect(page.getByRole('menuitem', { name: '検索', exact: true })).toHaveCount(0);
    await page.keyboard.press('Escape');

    const post = page.locator('.post-history-item').first();
    await post.getByRole('button', { name: 'アクションを表示', exact: true }).click();
    const items = await page.getByRole('menuitem').allTextContents();
    expect(items.findIndex(text => text.trim() === 'リポスト') + 1).toBe(items.findIndex(text => text.trim() === 'イベントJSONを表示'));
    await page.getByRole('menuitem', { name: 'リポスト', exact: true }).click();
    await expect(page.locator('.repost-message')).toHaveText('リポスト送信中…');
    await expect(page.locator('.repost-message')).toBeVisible();
    await expect.poll(async () => { const state = await read(page); return [state.signed, state.sends]; }).toEqual([1, 1]);
    await expect(status).toContainText('リレーと同期中...');
    await post.getByRole('button', { name: 'アクションを表示', exact: true }).click();
    await expect(page.getByRole('menuitem', { name: 'リポスト送信中…', exact: true })).toBeDisabled();
    await page.keyboard.press('Escape');

    await page.evaluate(() => (window as unknown as FixtureWindow).__REPOST__.releasePublish());
    await expect(page.locator('.repost-message')).toHaveText('リポストしました');
    await expect(page.locator('.repost-message')).toBeVisible();
    await expect(page.locator('.post-history-repost')).toContainText('original searchable post');
    await expect(status).toContainText('リレーと同期中...');
    const headingBox = await heading.boundingBox();
    const statusBox = await status.boundingBox();
    expect(statusBox!.y).toBeCloseTo(headingBox!.y + headingBox!.height + 8, 0);
    expect(statusBox!.x + statusBox!.width).toBeLessThanOrEqual(headingBox!.x + headingBox!.width);
    expect(await page.locator('html').evaluate(element => element.scrollWidth > element.clientWidth)).toBe(false);
    await page.screenshot({ path: testInfo.outputPath('history-header-repost-feedback.png') });

    await page.evaluate(() => (window as unknown as FixtureWindow).__REPOST__.releaseHistory());
    await expect(heading.locator('.post-history-heading-refetch-button')).toBeEnabled();
    await heading.locator('.post-history-heading-search-button').click();
    await page.locator('.post-history-search-input').fill('original searchable post');
    await expect(page.locator('.post-history-repost')).toContainText('original searchable post');
    await expect(page.locator('.post-preview-footer').getByRole('button', { name: 'リポスト', exact: true })).toHaveCount(0);
});

for (const entry of ['history', 'Composer'] as const) {
    for (const deleted of [false, true]) {
        test(`${entry} secret-key Repost publishes immediately without querying a slow relay (${deleted ? 'unknown deletion' : 'eligible'})`, async ({ page }) => {
            await open(page, '&transport=1' + (entry === 'Composer' ? '&source=target' : ''));
            if (entry === 'Composer') {
                await page.locator('.composer-target-dialog input').fill(await page.evaluate(() => (window as unknown as FixtureWindow).__REPOST__.targetInput));
                await expect(page.locator('.composer-target-dialog')).toContainText('original searchable post');
            }
            if (deleted) await page.evaluate(() => (window as unknown as FixtureWindow).__REPOST__.deleteOnRelay());
            const container = entry === 'Composer' ? page.locator('.composer-target-dialog') : page.locator('.post-history-item').first();
            await container.getByRole('button', { name: 'アクションを表示', exact: true }).click();
            await page.getByRole('menuitem', { name: 'リポスト', exact: true }).click();
            await expect.poll(async () => { const state = await read(page); return [state.lastResult?.success, state.signed, state.sends, state.deletionCount]; },
                { timeout: 3_000 }).toEqual([true, 1, 1, 0]);
            expect((await read(page)).deletionRequests).toBe(0);
            expect((await read(page)).rows.filter(row => row.kind === outerKind)).toHaveLength(1);
            expect((await read(page)).rows.find(row => row.kind === outerKind)).toMatchObject({ content: '', targetKind });
        });
    }
}

test('360px Repost publishes when deletion lookup relays would never respond', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await open(page, '&transport=1&silent=1');
    await page.locator('.post-history-item').first().getByRole('button', { name: 'アクションを表示', exact: true }).click();
    await page.getByRole('menuitem', { name: 'リポスト', exact: true }).click();
    await expect.poll(async () => (await read(page)).lastResult?.success, { timeout: 3_000 }).toBe(true);
    expect(await read(page)).toMatchObject({ signed: 1, sends: 1, deletionRequests: 0 });
    await expect(page.locator('.floating-message')).toContainText('リポストしました');
    const message = await page.locator('.floating-message-content').boundingBox();
    expect(message!.x).toBeGreaterThanOrEqual(0);
    expect(message!.x + message!.width).toBeLessThanOrEqual(360);
    expect(await page.locator('html').evaluate(element => element.scrollWidth > element.clientWidth)).toBe(false);
});

for (const entry of ['history', 'Composer', 'resolved target'] as const) {
    test(`${entry} blocks a locally known valid deletion before signing`, async ({ page }) => {
        await open(page, entry === 'Composer' ? '&source=target' : entry === 'resolved target' ? '&external=import' : '');
        if (entry === 'Composer') {
            await page.locator('.composer-target-dialog input').fill(await page.evaluate(() => (window as unknown as FixtureWindow).__REPOST__.targetInput));
            await expect(page.locator('.composer-target-dialog')).toContainText('original searchable post');
        } else if (entry === 'resolved target') {
            await expect.poll(async () => (await read(page)).rows[0]?.targetKind).toBe(targetKind);
        }
        expect((await read(page)).deletionCount).toBe(0);
        const container = entry === 'Composer' ? page.locator('.composer-target-dialog') : page.locator('.post-history-item').first();
        await container.getByRole('button', { name: entry === 'resolved target' ? '元投稿の操作' : 'アクションを表示', exact: true }).click();
        await page.evaluate(() => (window as unknown as FixtureWindow).__REPOST__.rememberDeletion());
        if (entry === 'resolved target') {
            // Saving a known deletion can remove the related card and its menu
            // before a click. Reopen to assert the persisted, stable UI state.
            await page.keyboard.press('Escape');
            await page.getByRole('button', { name: '閉じる', exact: true }).first().click();
            await page.getByRole('button', { name: 'Open history' }).click();
            await expect(container).toContainText('元投稿は削除済みです');
            await expect(container.getByRole('button', { name: '元投稿の操作', exact: true })).toHaveCount(0);
            expect(await read(page)).toMatchObject({ signed: 0, sends: 0, deletionCount: 1 });
            expect((await read(page)).rows.filter(row => row.kind === outerKind)).toHaveLength(1);
            return;
        }
        await page.getByRole('menuitem', { name: 'リポスト', exact: true }).click();
        await expect.poll(async () => { const state = await read(page); return [state.lastResult?.success, state.signed, state.sends, state.deletionCount]; }).toEqual([false, 0, 0, 1]);
        expect((await read(page)).sentEvents.filter(event => event.kind === outerKind)).toHaveLength(0);
    });
}

for (const entry of ['history', 'Composer', 'resolved target'] as const) {
    test(`${entry} publishes when a relay-only deletion has not been learned locally`, async ({ page }) => {
        await open(page, entry === 'Composer' ? '&source=target' : entry === 'resolved target' ? '&external=import' : '');
        if (entry === 'Composer') {
            await page.locator('.composer-target-dialog input').fill(await page.evaluate(() => (window as unknown as FixtureWindow).__REPOST__.targetInput));
            await expect(page.locator('.composer-target-dialog')).toContainText('original searchable post');
        } else if (entry === 'resolved target') {
            await expect.poll(async () => (await read(page)).rows[0]?.targetKind).toBe(targetKind);
        }
        const before = (await read(page)).rows.filter(row => row.kind === outerKind).length;
        await page.evaluate(() => (window as unknown as FixtureWindow).__REPOST__.deleteOnRelay());
        const container = entry === 'Composer' ? page.locator('.composer-target-dialog') : page.locator('.post-history-item').first();
        await container.getByRole('button', { name: entry === 'resolved target' ? '元投稿の操作' : 'アクションを表示', exact: true }).click();
        await page.getByRole('menuitem', { name: 'リポスト', exact: true }).click();
        await expect.poll(async () => (await read(page)).lastResult?.success).toBe(true);
        expect(await read(page)).toMatchObject({ signed: 1, sends: 1, deletionCount: 0 });
        expect((await read(page)).rows.filter(row => row.kind === outerKind)).toHaveLength(before + 1);
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
        state.rows.filter(row => row.kind === outerKind).length, state.signed, state.sends, state.lastResult?.error ?? null, errors,
    ]; }).toEqual([1, 1, 1, null, []]);
    const state = await read(page);
    expect(state.rows.find(row => row.kind === outerKind)).toMatchObject({ content: "", targetKind });
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
    expect(state.rows[0]).toMatchObject({ kind: outerKind, content: '', targetKind });
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
    await expect.poll(async () => (await read(page)).rows[0]?.targetKind).toBe(targetKind);
    expect((await read(page)).rows).toHaveLength(1);
});

test("Repost menus and content reflow in a 320px iframe", async ({ page }) => {
    await open(page, '&external=relay');
    await expect.poll(async () => (await read(page)).rows[0]?.targetKind).toBe(targetKind);
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
    await expect.poll(async () => (await read(page)).rows[0]?.targetKind).toBe(targetKind);
    expect((await read(page)).rows).toHaveLength(1);
});

test("outer and self-target raw JSON, reply, quote, resend and deletion keep their event IDs", async ({ page }) => {
    await open(page, '&external=import&self-target=1');
    const card = page.locator('.post-history-repost');
    await expect(card).toContainText('original searchable post');
    await expect.poll(async () => (await read(page)).rows[0]?.targetKind).toBe(targetKind);
    const outer = (await read(page)).rows[0]!;
    await card.getByRole('button', { name: 'リプライ', exact: true }).click();
    await page.getByRole('button', { name: 'Open history' }).click();
    await card.getByRole('button', { name: '引用', exact: true }).click();
    await page.getByRole('button', { name: 'Open history' }).click();
    expect(await read(page)).toMatchObject({ replyId: outer.targetId, quoteId: outer.targetId });
    for (const [label, id, kind] of [['リポストの操作', outer.id, outerKind], ['元投稿の操作', outer.targetId, targetKind]] as const) {
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

});
}

for (const [outerKind, targetKind, message] of [
    [6, 42, '元投稿の参照情報を確認できませんでした'],
    [16, 1, '元投稿の参照情報を確認できませんでした'],
    [16, 20, 'この元投稿のkindには対応していません'],
] as const) {
    test(`${outerKind} -> ${targetKind} preserves outer management without a target projection`, async ({ page }) => {
        await open(page, `&external=import&target-kind=${targetKind}&outer-kind=${outerKind}`);
        const card = page.locator('.post-history-repost');
        await expect(card).toContainText(message);
        await expect(card).not.toContainText('original searchable post');
        await expect(card.getByRole('button', { name: '元投稿の操作', exact: true })).toHaveCount(0);
        expect((await read(page)).rows).toHaveLength(1);
        expect((await read(page)).rows[0]?.targetId).toBeUndefined();
        await card.getByRole('button', { name: 'リポストの操作', exact: true }).click();
        await page.getByRole('menuitem', { name: 'イベントJSONを表示', exact: true }).click();
        const raw = JSON.parse(await page.locator('.raw-json-content').innerText());
        expect(raw).toMatchObject({ kind: outerKind, content: 'opaque content must never appear' });
    });
}

test('kind 40 Composer target keeps its existing menu without a Repost action', async ({ page }) => {
    await open(page, '&source=target&target-kind=40');
    await page.locator('.composer-target-dialog input').fill(await page.evaluate(() => (window as unknown as FixtureWindow).__REPOST__.targetInput));
    await page.locator('.composer-target-dialog').getByRole('button', { name: 'アクションを表示', exact: true }).click();
    await expect(page.getByRole('menuitem', { name: 'リポスト', exact: true })).toHaveCount(0);
});
