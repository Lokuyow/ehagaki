import { test, expect, type Page } from '@playwright/test';
import { createServer, type ServerResponse } from 'node:http';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import type { AddressInfo } from 'node:net';
import { HASHED_PRECACHE_ASSET_PATTERN } from '../../lib/swPrecacheInstall';

const manifestPattern = /\[\{"revision":(?:null|"[^"]*"),"url":"[^"]+"\}(?:,\{"revision":(?:null|"[^"]*"),"url":"[^"]+"\})*\]/;
interface Entry { url: string; revision: string | null }

async function createFixture(basePath: '/' | '/ehagaki/') {
    const directory = resolve('node_modules/.cache/sw-update', basePath === '/' ? 'root' : 'pages');
    const worker = readFileSync(resolve(directory, 'sw.js'), 'utf8');
    const manifestText = worker.match(manifestPattern)?.[0];
    if (!manifestText) throw new Error('missing production precache manifest');
    const entries = JSON.parse(manifestText) as Entry[];
    const bodies = new Map(entries.map((entry) => [entry.url, readFileSync(resolve(directory, entry.url))]));
    const probes = Array.from({ length: 8 }, (_, index) => `assets/sw-probe-${index}-AbCd000${index}.js`);
    probes.forEach((url) => bodies.set(url, Buffer.from(`/* ${url} */`)));
    let version = 0;
    let legacy = true;
    let additions = false;
    let changedHtml = false;
    let failProbe = false;
    let holdProbes = false;
    let offline = false;
    let activeProbes = 0;
    let peakProbes = 0;
    const held = new Map<string, () => void>();
    const requests: Array<{ url: string; bytes: number }> = [];

    const send = (response: ServerResponse, bytes: Buffer, type: string, status = 200) => {
        response.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
        response.end(bytes);
    };
    const server = createServer((request, response) => {
        if (offline) { request.socket.destroy(); return; }
        const pathname = new URL(request.url!, 'http://localhost').pathname;
        if (!pathname.startsWith(basePath)) { response.writeHead(404).end(); return; }
        let path = pathname.slice(basePath.length);
        if (!path) path = 'index.html';
        if (path === 'sw-monitor.html') {
            send(response, Buffer.from('<html><body>SW cache inspection</body></html>'), 'text/html');
            return;
        }
        if (path === 'sw.js') {
            const manifest = entries.map((entry) => ({ ...entry }));
            if (legacy) for (const entry of manifest) {
                if (HASHED_PRECACHE_ASSET_PATTERN.test(entry.url)) {
                    entry.revision = createHash('md5').update(bodies.get(entry.url)!).digest('hex');
                }
            }
            if (changedHtml) manifest.find((entry) => entry.url === 'index.html')!.revision = 'changed-html';
            if (additions) manifest.push(...probes.map((url) => ({ url, revision: null })));
            const code = worker.replace(manifestText, JSON.stringify(manifest)) + `\n// fixture version ${version}\n`;
            send(response, Buffer.from(code), 'text/javascript');
            return;
        }
        const body = bodies.get(path);
        if (!body) { response.writeHead(404).end(); return; }
        const isProbe = probes.includes(path);
        const type = path.endsWith('.js') ? 'text/javascript' : path.endsWith('.css') ? 'text/css'
            : path.endsWith('.html') ? 'text/html' : path.endsWith('.webmanifest') ? 'application/manifest+json'
            : path.endsWith('.svg') ? 'image/svg+xml' : path.endsWith('.png') ? 'image/png' : 'application/octet-stream';
        const finish = () => {
            const bytes = changedHtml && path === 'index.html' ? Buffer.concat([body, Buffer.from('<!-- changed -->')]) : body;
            requests.push({ url: path, bytes: bytes.length });
            send(response, bytes, type, isProbe && failProbe ? 503 : 200);
            if (isProbe) activeProbes--;
            held.delete(path);
        };
        if (isProbe) {
            activeProbes++;
            peakProbes = Math.max(peakProbes, activeProbes);
        }
        if (isProbe && holdProbes) held.set(path, finish);
        else finish();
    });
    await new Promise<void>((ready) => server.listen(0, '127.0.0.1', ready));
    const origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    return {
        url: `${origin}${basePath}`, entries, probes, requests, held,
        get peakProbes() { return peakProbes; },
        update(options: { additions?: boolean; changedHtml?: boolean; fail?: boolean; hold?: boolean } = {}) {
            version++;
            legacy = false;
            additions = options.additions ?? additions;
            changedHtml = options.changedHtml ?? changedHtml;
            failProbe = options.fail ?? false;
            holdProbes = options.hold ?? false;
            peakProbes = 0;
            requests.length = 0;
        },
        release() { holdProbes = false; Array.from(held.values()).forEach((finish) => finish()); },
        setOffline(value: boolean) { offline = value; },
        async close() {
            this.release();
            server.closeAllConnections();
            await new Promise<void>((done) => server.close(() => done()));
        },
    };
}

async function enterApp(page: Page, url: string) {
    await page.goto(url);
    await page.getByRole('button', { name: 'はじめる' }).click();
    await expect(page.getByRole('button', { name: 'はじめる' })).toBeHidden();
    await page.evaluate(async () => { await navigator.serviceWorker.ready; });
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
    // Reopen the installed app, as on a subsequent visit with an active worker.
    await page.reload();
    await page.locator('.settings-btn').click();
    await expect(page.locator('.settings-dialog')).toBeVisible();
}

async function startUpdate(page: Page) {
    await page.evaluate(async () => {
        const registration = await navigator.serviceWorker.getRegistration();
        if (!registration) throw new Error('missing SW registration');
        Reflect.set(window, '__previousController', navigator.serviceWorker.controller);
        // Firefox's update() can wait for install completion. Observe its start
        // instead so held responses can be released by the test in every engine.
        await new Promise<void>((started, reject) => {
            registration.addEventListener('updatefound', () => started(), { once: true });
            const completion = registration.update();
            Reflect.set(window, '__updateCompletion', completion);
            void completion.catch(reject);
        });
    });
}

async function waitForWaiting(page: Page) {
    // Join the update job started before the held responses were released.
    await page.evaluate(async () => { await Reflect.get(window, '__updateCompletion'); });
    await page.waitForFunction(async () => Boolean((await navigator.serviceWorker.getRegistration())?.waiting));
}

async function cacheKeys(page: Page) {
    const name = await page.evaluate(async () => {
        const registration = await navigator.serviceWorker.getRegistration();
        if (!registration) throw new Error('missing precache registration');
        return `workbox-precache-v2-${registration.scope}`;
    });
    return page.evaluate(async (name) => {
        return (await (await caches.open(name)).keys()).map((key) => key.url);
    }, name);
}

test.beforeEach(async ({ context }) => {
    // No accounts, relays, or external destinations are involved.
    // Network interception can bypass native SW navigation in Firefox/WebKit.
    // Block external app fetches without intercepting same-origin SW requests.
    await context.addInitScript(() => {
        const originalFetch = window.fetch.bind(window);
        window.fetch = (input, options) => {
            const url = new URL(input instanceof Request ? input.url : String(input), location.href);
            if (url.origin !== location.origin) return Promise.reject(new Error('external fetch disabled in SW fixture'));
            return originalFetch(input, options);
        };
    });
    await context.routeWebSocket('**/*', (socket) => socket.close());
});

for (const basePath of ['/ehagaki/', '/'] as const) {
    test(`${basePath} migrates old keys, installs in parallel, applies only on user action, and restarts offline`, async ({ page, context }, testInfo) => {
        const fixture = await createFixture(basePath);
        try {
            await enterApp(page, fixture.url);
            // Inspect storage from a stable document while the app itself reloads.
            const monitor = await context.newPage();
            await monitor.goto(`${fixture.url}sw-monitor.html`);
            const oldKeys = await cacheKeys(page);
            expect(oldKeys.some((key) => key.includes('/assets/') && key.includes('__WB_REVISION__'))).toBe(true);
            fixture.update({ additions: true, hold: true });
            const started = performance.now();
            await startUpdate(page);
            // Chromium can queue one of the four issued fetches before HTTP delivery.
            // Unit coverage proves four active jobs; here prove concurrent network work.
            await expect.poll(() => fixture.held.size).toBeGreaterThan(1);
            expect(fixture.held.size).toBeLessThanOrEqual(4);
            const updateButton = page.getByRole('button', { name: 'アプリを更新' });
            await expect(updateButton).toBeDisabled();
            await expect(updateButton).toContainText('インストール中');
            expect(await page.evaluate(() => navigator.serviceWorker.controller === Reflect.get(window, '__previousController'))).toBe(true);
            fixture.release();
            await waitForWaiting(page);
            const waitingKeys = await cacheKeys(page);
            expect(oldKeys.every((key) => waitingKeys.includes(key))).toBe(true);
            await expect(updateButton).toBeEnabled();
            expect(fixture.peakProbes).toBeGreaterThan(1);
            expect(fixture.peakProbes).toBeLessThanOrEqual(4);
            expect(fixture.requests.map((request) => request.url).sort()).toEqual([...fixture.probes].sort());
            expect(await page.evaluate(() => navigator.serviceWorker.controller === Reflect.get(window, '__previousController'))).toBe(true);
            await testInfo.attach('update-metrics', { contentType: 'application/json', body: JSON.stringify({
                basePath, browser: testInfo.project.name, requests: fixture.requests.length,
                transferredBytes: fixture.requests.reduce((total, request) => total + request.bytes, 0),
                // Includes the deliberately held responses; no duration threshold is asserted.
                elapsedMs: performance.now() - started,
            }) });
            await Promise.all([page.waitForNavigation({ waitUntil: 'load' }), updateButton.click()]);
            await page.locator('.settings-btn').click();
            await expect(page.locator('.settings-dialog')).toBeVisible();
            const installedKeys = await cacheKeys(monitor);
            expect(installedKeys.filter((key) => key.includes('/assets/') && key.includes('__WB_REVISION__'))).toEqual([]);
            // Root manifest icons can appear as both relative and absolute URLs.
            // Compare the same canonical keys that Workbox deduplicates.
            const expectedKeys = new Set([...fixture.entries, ...fixture.probes.map((url) => ({ url, revision: null }))]
                .map((entry) => {
                    const url = new URL(entry.url, fixture.url);
                    if (entry.revision) url.searchParams.set('__WB_REVISION__', entry.revision);
                    return url.href;
                }));
            expect(installedKeys.sort()).toEqual([...expectedKeys].sort());
            // Refuse every origin request, allowing native SW handling in all
            // engines (Playwright WebKit's offline flag fails before SW dispatch).
            fixture.setOffline(true);
            await page.close();
            const reopened = await context.newPage();
            await reopened.goto(fixture.url, { waitUntil: 'domcontentloaded' });
            await reopened.locator('.settings-btn').click();
            await expect(reopened.locator('.settings-dialog')).toBeVisible();
            await expect(reopened.getByRole('button', { name: 'アプリを更新' })).toHaveCount(0);
            fixture.setOffline(false);

            // A new SW script with an identical manifest must transfer no assets.
            fixture.update();
            await startUpdate(reopened);
            await waitForWaiting(reopened);
            expect(fixture.requests).toEqual([]);
        } finally { await fixture.close(); }
    });

    test(`${basePath} fails an update without deleting the active worker's cache`, async ({ page, context }) => {
        const fixture = await createFixture(basePath);
        try {
            await enterApp(page, fixture.url);
            const oldKeys = await cacheKeys(page);
            fixture.update({ additions: true, changedHtml: true, fail: true });
            await startUpdate(page);
            await page.waitForFunction(async () => {
                const registration = await navigator.serviceWorker.getRegistration();
                return registration && !registration.installing && !registration.waiting;
            });
            expect(await page.evaluate(() => navigator.serviceWorker.controller === Reflect.get(window, '__previousController'))).toBe(true);
            const remainingKeys = await cacheKeys(page);
            expect(oldKeys.every((key) => remainingKeys.includes(key))).toBe(true);
            await expect(page.getByRole('button', { name: 'アプリを更新' })).toHaveCount(0);
            fixture.setOffline(true);
            await page.close();
            const reopened = await context.newPage();
            await reopened.goto(fixture.url, { waitUntil: 'domcontentloaded' });
            await reopened.locator('.settings-btn').click();
            await expect(reopened.locator('.settings-dialog')).toBeVisible();
        } finally { await fixture.close(); }
    });
}
