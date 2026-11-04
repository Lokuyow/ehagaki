import { expect, test, type Locator } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { finalizeEvent, generateSecretKey, getPublicKey } from 'nostr-tools';

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
    await expect(custom.locator('.post-preview-reaction-avatar-image')).toHaveCount(3);
    await expect(custom.locator('.notification-reaction time')).toBeVisible();
    await expect(custom.locator('.post-preview-reaction-count')).toHaveText(['2', '1']);
    await expect(custom.getByText('Original notification target', { exact: true })).toBeVisible();
    await expect(custom.getByRole('button', { name: 'リアクションする' })).toHaveCount(0);
    await page.screenshot({ path: info.outputPath('reaction-360.png') });
});

test('keeps an incompatible reaction separate without hiding the valid target', async ({ page }) => {
    await page.goto('post-history-dialog-playwright.html?notifications=1');
    await expect(page.getByRole('button', { name: '通知（未読あり）' })).toBeVisible();
    await page.evaluate(() => Reflect.get(window, '__NOTIFICATIONS__').addMismatchedReaction());
    await page.getByRole('button', { name: '通知（未読あり）' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Original notification target', { exact: true })).toHaveCount(3);
    const reactions = dialog.locator('.notification-entry:has(.notification-reaction)');
    await expect(reactions).toHaveCount(2);
    await expect(reactions.filter({ hasText: 'Original notification target' })).toHaveCount(1);
    await expect(reactions.getByRole('button', { name: '再試行', exact: true })).toHaveCount(1);
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
    await expect(page.getByRole('dialog').getByText('Original notification target', { exact: true })).toHaveCount(3);
    const stored = await page.evaluate(() => Reflect.get(window, '__NOTIFICATIONS__').storage());
    expect(stored.event?.rawEvent.content).toBe('Original notification target');
    expect(stored.notifications).toHaveLength(4);
    for (const notification of stored.notifications) expect(notification).not.toHaveProperty('event');
    await page.reload();
    await page.getByRole('button', { name: '通知', exact: true }).click();
    await expect(page.getByRole('dialog').getByText('Original notification target', { exact: true })).toHaveCount(3);
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
    await expectRoundNotification(embedded.getByRole('button', { name: '通知（未読あり）' }));
    const boxes = await embedded.locator('.footer-bar button').evaluateAll(nodes => nodes.map(node => {
        const box = node.getBoundingClientRect(); return { left: box.left, right: box.right, width: box.width };
    }));
    expect(boxes).toHaveLength(5);
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

test('opening notifications clears unread saved beyond the first local page without fetching more', async ({ page }) => {
    const url = 'post-history-dialog-playwright.html?notifications=1';
    await page.goto(url);
    await page.waitForFunction(() => Reflect.has(window, '__NOTIFICATIONS__'));
    await page.evaluate(() => (window as any).__NOTIFICATIONS__.addOlder(101));
    await page.getByRole('button', { name: '通知（未読あり）', exact: true }).click();
    await expect(page.getByRole('dialog').locator('.notification-entry')).toHaveCount(100);
    await expect(page.locator('.notification-badge')).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => (window as any).__NOTIFICATIONS__.unread())).toBe(false);
    // Even an older event arriving while the inbox is open must not leave the badge on.
    await page.evaluate(() => (window as any).__NOTIFICATIONS__.addOlder(102));
    await expect.poll(() => page.evaluate(() => (window as any).__NOTIFICATIONS__.unread())).toBe(false);
    expect(await page.evaluate(() => (window as any).__NOTIFICATIONS__.requests()
        .flat().some((filter: { since?: number }) => filter.since === 0))).toBe(false);
    await page.getByRole('dialog').getByRole('button', { name: '閉じる', exact: true }).click();
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
