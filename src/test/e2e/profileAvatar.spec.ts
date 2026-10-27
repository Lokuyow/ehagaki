import { expect, test } from '@playwright/test';

test('generated avatars agree across sizes, reply, kind7, related cards and footer; recover and persist', async ({page}) => {
    await page.setViewportSize({width: 360, height: 800});
    await page.route('**/broken-avatar.png*', route => route.fulfill({status: 404, body: ''}));
    await page.goto('profile-avatar-playwright.html');
    const icons = page.locator('.profile-avatar-initial');
    await expect(icons).toHaveCount(7);
    await expect(page.locator('.profile-picture .profile-avatar-initial')).toBeVisible();
    const sources = await icons.evaluateAll(nodes => nodes.map(n => (n as HTMLImageElement).src));
    expect(new Set(sources).size).toBe(1);
    expect(decodeURIComponent(sources[0])).toContain('>山</text>');
    for (const icon of await icons.all()) {
        await expect(icon).toHaveJSProperty('complete', true);
        expect(await icon.evaluate(n => (n as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    }
    await page.getByRole('button', {name: 'Theme', exact: true}).click();
    expect(await icons.first().getAttribute('src')).toBe(sources[0]);
    await page.getByRole('button', {name: 'Broken image'}).click();
    await expect(page.locator('.profile-picture')).toHaveAttribute('data-status', 'error');
    await expect(page.locator('.profile-picture .profile-avatar-initial')).toBeVisible();
    await page.getByRole('button', {name: 'Valid image'}).click();
    await expect(page.locator('.profile-picture')).toHaveAttribute('data-status', 'loaded');
    await expect(page.locator('.profile-picture-image')).toBeVisible();
    await expect(page.locator('.profile-picture .profile-avatar-initial')).toBeHidden();
    await page.getByLabel('Name', {exact: true}).fill('👩🏽‍💻 Test');
    await expect.poll(async () => decodeURIComponent(await icons.first().getAttribute('src') ?? '')).toContain('>👩🏽‍💻</text>');
    await page.getByRole('button', {name: 'Switch account'}).click();
    await expect.poll(async () => decodeURIComponent(await icons.first().getAttribute('src') ?? '')).toContain('#123456');
    await page.getByLabel('Name', {exact: true}).fill('');
    await expect.poll(async () => decodeURIComponent(await icons.first().getAttribute('src') ?? '')).toMatch(/>[a-z0-9]<\/text>/);
    const saved = await page.evaluate(() => localStorage.getItem('profile-fallback-avatars-v1'));
    expect(saved).toBeTruthy();
    await page.reload();
    await expect(icons).toHaveCount(7);
    expect(await icons.first().getAttribute('src')).toBe(sources[0]);
    expect(await page.evaluate(() => localStorage.getItem('profile-fallback-avatars-v1'))).toBe(saved);
    await page.screenshot({path: '/tmp/profile-avatar-preview.png', fullPage: true});
});

test('mounts the app and preserves generated initials without Intl.Segmenter', async ({page}) => {
    await page.setViewportSize({width: 360, height: 800});
    await page.addInitScript(() => {
        Object.defineProperty(Intl, 'Segmenter', {value: undefined, configurable: true});
    });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('./');
    await expect(page.locator('.footer-bar .login-btn')).toBeVisible();
    await expect(page.locator('.tiptap-editor')).toBeAttached();

    await page.goto('profile-avatar-playwright.html');
    const icons = page.locator('.profile-avatar-initial');
    await expect(icons).toHaveCount(7);
    for (const character of ['山', '👩🏽‍💻', 'e\u0301', '🇯🇵']) {
        await page.getByLabel('Name', {exact: true}).fill(`${character} Test`);
        await expect.poll(async () => decodeURIComponent(await icons.first().getAttribute('src') ?? ''))
            .toContain(`>${character}</text>`);
    }
    await page.reload();
    await expect(icons).toHaveCount(7);
    await expect(page.locator('.profile-picture .profile-avatar-initial')).toBeVisible();
    expect(await page.evaluate(() => typeof Intl.Segmenter)).toBe('undefined');
    expect(errors).toEqual([]);
});
