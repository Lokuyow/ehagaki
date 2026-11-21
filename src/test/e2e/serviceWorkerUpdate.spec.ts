import { test, expect, type Page } from '@playwright/test';
import { createServer, type ServerResponse } from 'node:http';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import type { AddressInfo } from 'node:net';
import { build as buildBrowserProbe } from 'esbuild';
import { HASHED_PRECACHE_ASSET_PATTERN } from '../../lib/swPrecacheInstall';
import { finalizeEvent, generateSecretKey } from 'nostr-tools';
import { EHAGAKI_DB_NAME } from '../../lib/storage/ehagakiDbConstants';
import type { runJsonlImportWorkerProbe } from './jsonlImportWorkerProbe';
import { CUSTOM_EMOJI_IMAGE_CACHE_POLICY, PROFILE_IMAGE_CACHE_POLICY } from '../../lib/swImageCachePolicy';
import { restoreMentionDraftFixture, saveMentionDraftFixture } from './mentionAvatarDraftFixture';

const manifestPattern = /\[\{"revision":(?:null|"[^"]*"),"url":"[^"]+"\}(?:,\{"revision":(?:null|"[^"]*"),"url":"[^"]+"\})*\]/;
interface Entry { url: string; revision: string | null }

// Hold the metadata commit in the built worker without holding the browser's
// Cache API itself. The network and independent reads remain available.
const holdImageCacheWrites = `
    const testCachePut = Cache.prototype.put;
    const testHeldWrites = new Map();
    Cache.prototype.put = async function(request, response) {
        const url = new URL(request instanceof Request ? request.url : request, self.location.href);
        const key = url.searchParams.get('url');
        if (url.hostname === 'ehagaki.invalid' && key?.endsWith('-held.svg')) {
            await new Promise(resolve => testHeldWrites.set(key, resolve));
        }
        return testCachePut.call(this, request, response);
    };
    self.addEventListener('message', event => {
        if (event.data?.type !== 'TEST_HELD_IMAGE_WRITES') return;
        if (event.data.release) {
            for (const release of testHeldWrites.values()) release();
            testHeldWrites.clear();
        }
        event.ports[0].postMessage(testHeldWrites.size);
    });
`;

async function createFixture(basePath: '/' | '/ehagaki/', options: { holdImageWrites?: boolean } = {}) {
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
        if (options.holdImageWrites && /^cache-test-[\w-]+\.svg$/.test(path)) {
            requests.push({ url: path, bytes: 0 });
            send(response, Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="17" height="7"/>'), 'image/svg+xml');
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
            const code = worker.replace(manifestText, JSON.stringify(manifest))
                + (options.holdImageWrites ? holdImageCacheWrites : '') + `\n// fixture version ${version}\n`;
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

let sharedMediaProbeScript: Promise<string> | undefined;

function getSharedMediaProbeScript(): Promise<string> {
    sharedMediaProbeScript ??= buildBrowserProbe({
        entryPoints: [resolve('src/test/e2e/swSharedMediaProbe.ts')],
        bundle: true,
        format: 'iife',
        platform: 'browser',
        target: 'es2022',
        write: false,
    }).then(({ outputFiles }) => {
        const script = outputFiles[0]?.text;
        if (!script) throw new Error('failed to build the Service Worker media probe');
        return script;
    });
    return sharedMediaProbeScript;
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
    // Use only synthetic accounts and no external network services.
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

test('restores the saved account while v1.32.0 history conversion is still pending', async ({ page }) => {
    const fixture = await createFixture('/ehagaki/');
    const event = finalizeEvent({ kind: 1, content: 'saved history', tags: [], created_at: 123 }, generateSecretKey());
    const cachedName = 'Saved migration test profile';
    try {
        await page.goto(`${fixture.url}sw-monitor.html`);
        await page.evaluate(async ({ name, version, event, cachedName }) => {
            localStorage.setItem('firstVisit', '1');
            localStorage.setItem('nostr-accounts', JSON.stringify([{ pubkeyHex: event.pubkey, type: 'nip07', addedAt: 1 }]));
            localStorage.setItem('nostr-active-account', event.pubkey);
            await new Promise<void>((resolve, reject) => {
                const request = indexedDB.open(name, version);
                request.onupgradeneeded = () => {
                    const db = request.result;
                    db.createObjectStore('postHistory', { keyPath: 'id' }).put({
                        id: event.id, eventId: event.id, pubkeyHex: event.pubkey, rawEvent: event,
                        content: event.content, tags: event.tags, createdAt: event.created_at,
                    });
                    db.createObjectStore('profiles', { keyPath: 'pubkeyHex' }).put({
                        pubkeyHex: event.pubkey, displayName: cachedName,
                        pictureUrl: new URL('ehagaki_ogp.webp', location.href).href,
                        fetchedAt: Date.now(),
                    });
                    db.createObjectStore('relayConfigs', { keyPath: 'pubkeyHex' }).put({
                        pubkeyHex: event.pubkey, config: { 'wss://migration-test.example/': { read: true, write: true } },
                    });
                };
                request.onsuccess = () => { request.result.close(); resolve(); };
                request.onerror = () => reject(request.error);
            });
        }, { name: EHAGAKI_DB_NAME, version: 170, event, cachedName });
        await page.addInitScript((pubkey) => {
            Reflect.set(window, 'nostr', {
                getPublicKey: async () => pubkey,
                signEvent: async () => { throw new Error('unexpected fixture signing request'); },
            });
            const getAll = IDBObjectStore.prototype.getAll;
            IDBObjectStore.prototype.getAll = function (...args) {
                const request = getAll.apply(this, args);
                if (this.name === 'postHistory' && this.transaction.objectStoreNames.contains('eventStoreMigration')) {
                    // Pause delivery of the migration's read result. Its readonly
                    // transaction can finish, so unrelated stores stay accessible.
                    Object.defineProperty(request, 'onsuccess', {
                        set(handler: EventListener) {
                            request.addEventListener('success', (event) => {
                                Reflect.set(window, '__resumeHistoryMigration', () => handler.call(request, event));
                            }, { once: true });
                        },
                    });
                    IDBObjectStore.prototype.getAll = getAll;
                }
                return request;
            };
        }, event.pubkey);

        await page.goto(fixture.url);
        await page.waitForFunction(() => typeof Reflect.get(window, '__resumeHistoryMigration') === 'function');
        await expect(page.locator('.footer-bar .profile-display')).not.toHaveClass(/\bloading\b/);
        await expect(page.locator('.footer-bar').getByRole('img', { name: cachedName })).toBeVisible();

        await page.evaluate(() => Reflect.get(window, '__resumeHistoryMigration')());
        await expect.poll(() => page.evaluate(async ({ name, id }) => {
            const db = await new Promise<IDBDatabase>((resolve, reject) => {
                const request = indexedDB.open(name);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
            try {
                return await new Promise<string | undefined>((resolve, reject) => {
                    const request = db.transaction('events').objectStore('events').get(id);
                    request.onsuccess = () => resolve(request.result?.rawEvent?.content);
                    request.onerror = () => reject(request.error);
                });
            } finally { db.close(); }
        }, { name: EHAGAKI_DB_NAME, id: event.id })).toBe(event.content);
    } finally { await fixture.close(); }
});

test('restores a mention avatar from the production profile image cache offline', async ({ page, context }) => {
    const fixture = await createFixture('/ehagaki/', { holdImageWrites: true });
    try {
        const picture = `${fixture.url}cache-test-mention-avatar.svg`;
        await page.addInitScript(() => {
            localStorage.setItem('firstVisit', '1');
            localStorage.setItem('locale', 'ja');
        });
        await page.goto(fixture.url);
        await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
        const editor = page.locator('.tiptap-editor');
        await expect(editor).toBeVisible();
        await page.waitForFunction(async name => (await indexedDB.databases()).some(db => db.name === name && db.version),
            EHAGAKI_DB_NAME);
        await saveMentionDraftFixture(page, { pubkey: 'a'.repeat(64), picture });
        await restoreMentionDraftFixture(page);
        const avatar = editor.locator('.inline-mention-avatar-image');
        const naturalWidth = () => avatar.evaluate(node => (node as HTMLImageElement).naturalWidth);
        await expect.poll(naturalWidth).toBe(17);
        await expect.poll(() => page.evaluate(async ({ name, picture }) => {
            const cache = await caches.open(name);
            return (await cache.keys()).some(key => key.url === picture);
        }, { name: PROFILE_IMAGE_CACHE_POLICY.bodyName, picture })).toBe(true);

        await context.setOffline(true);
        await page.reload();
        await expect(editor).toBeVisible();
        await expect(avatar).toHaveCount(0);
        await restoreMentionDraftFixture(page);
        await expect.poll(naturalWidth).toBe(17);
    } finally {
        await context.setOffline(false);
        await fixture.close();
    }
});

for (const basePath of ['/ehagaki/', '/'] as const) {
    test(`${basePath} serves independent image hits and direct fallback while cache writes are held`, async ({ page }) => {
        const fixture = await createFixture(basePath, { holdImageWrites: true });
        try {
            await page.goto(`${fixture.url}sw-monitor.html`);
            await page.evaluate(async () => {
                await navigator.serviceWorker.register('./sw.js');
                await navigator.serviceWorker.ready;
            });
            await page.waitForFunction(() => !!navigator.serviceWorker.controller);
            const imageUrl = (name: string, profile = false) =>
                `${fixture.url}cache-test-${name}.svg${profile ? '?profile=true' : ''}`;
            const show = async (url: string, id: string) => {
                await page.evaluate(({ url, id }) => {
                    const image = document.createElement('img');
                    image.dataset.testid = id;
                    image.src = url;
                    document.body.append(image);
                }, { url, id });
                await expect.poll(() => page.getByTestId(id).evaluate(
                    image => (image as HTMLImageElement).naturalWidth,
                )).toBe(17);
            };
            const heldWrites = (release = false) => page.evaluate(release => new Promise<number>(resolve => {
                const channel = new MessageChannel();
                channel.port1.onmessage = event => { channel.port1.close(); resolve(event.data); };
                navigator.serviceWorker.controller!.postMessage({ type: 'TEST_HELD_IMAGE_WRITES', release }, [channel.port2]);
            }), release);
            const cacheEmoji = (url: string) => page.evaluate(url => new Promise<void>(resolve => {
                const channel = new MessageChannel();
                channel.port1.onmessage = () => { channel.port1.close(); resolve(); };
                navigator.serviceWorker.controller!.postMessage({ action: 'cacheCustomEmojiImages', urls: [url] }, [channel.port2]);
            }), url);
            await cacheEmoji(imageUrl('emoji'));
            await show(imageUrl('avatar', true), 'seed-avatar');
            await expect.poll(() => page.evaluate(async ({ name, url }) =>
                (await (await caches.open(name)).keys()).some(key => key.url === url),
            { name: PROFILE_IMAGE_CACHE_POLICY.bodyName, url: imageUrl('avatar') })).toBe(true);
            const emojiWrite = cacheEmoji(imageUrl('emoji-held'));
            // The cold avatar itself must display before its cache write finishes.
            await show(imageUrl('avatar-held', true), 'cold-avatar');
            await expect.poll(() => heldWrites()).toBe(2);
            try {
                const before = fixture.requests.length;
                await show(imageUrl('emoji'), 'cached-emoji');
                await show(imageUrl('avatar', true) + '&revision=2', 'cached-avatar');
                expect(fixture.requests.slice(before)).toEqual([]);
                // A plain image URL also represents the media tab's direct fallback.
                await show(imageUrl('upload-fallback'), 'direct-media');
                expect(fixture.requests.at(-1)?.url).toBe('cache-test-upload-fallback.svg');
                expect(await heldWrites()).toBe(2);
            } finally {
                await heldWrites(true);
                await emojiWrite;
            }
        } finally {
            await fixture.close();
        }
    });

    test(`${basePath} keeps bounded image caches across a Service Worker update and offline display`, async ({ page, context }) => {
        const fixture = await createFixture(basePath);
        try {
            await enterApp(page, fixture.url);
            const monitor = await context.newPage();
            await monitor.goto(`${fixture.url}sw-monitor.html`);
            const retained = await monitor.evaluate(async policies => {
                Reflect.set(window, '__previousController', navigator.serviceWorker.controller);
                const urls = [];
                for (const [index, policy] of policies.entries()) {
                    await caches.delete(policy.metadataName);
                    const cache = await caches.open(policy.bodyName);
                    const publicUrl = new URL(`cache-probe-${index}.svg`, location.href);
                    if (index === 1) publicUrl.searchParams.set('raw', 'true');
                    const oversizeUrl = new URL(`cache-probe-${index}-oversize.svg`, location.href);
                    await cache.put(oversizeUrl.href, new Response(new Uint8Array(policy.maxImageBytes + 1)));
                    await cache.put(publicUrl.href, new Response(
                        '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="7"/>',
                        { headers: { 'Content-Type': 'image/svg+xml' } },
                    ));
                    const key = publicUrl.href;
                    if (index === 0) publicUrl.searchParams.set('profile', 'true');
                    urls.push({ request: publicUrl.href, key, oversize: oversizeUrl.href, cacheName: policy.bodyName });
                }
                return urls;
            }, [PROFILE_IMAGE_CACHE_POLICY, CUSTOM_EMOJI_IMAGE_CACHE_POLICY]);
            fixture.update();
            await startUpdate(page);
            await waitForWaiting(page);
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'load' }),
                page.getByRole('button', { name: 'アプリを更新' }).click(),
            ]);
            await monitor.waitForFunction(() => navigator.serviceWorker.controller !== null
                && navigator.serviceWorker.controller !== Reflect.get(window, '__previousController'));

            fixture.setOffline(true);
            for (const entry of retained) {
                const result = await monitor.evaluate(async entry => {
                    const cache = await caches.open(entry.cacheName);
                    const urls = (await cache.keys()).map(key => key.url);
                    return {
                        cached: urls.includes(entry.key),
                        oversized: urls.includes(entry.oversize),
                    };
                }, entry);
                expect(result).toEqual({ cached: true, oversized: false });
                await monitor.evaluate(url => {
                    document.querySelector('[data-testid="offline-cache-probe"]')?.remove();
                    const image = document.createElement('img');
                    image.dataset.testid = 'offline-cache-probe';
                    image.src = url;
                    document.body.append(image);
                }, entry.request);
                await expect.poll(() => monitor.getByTestId('offline-cache-probe').evaluate(
                    image => (image as HTMLImageElement).naturalWidth,
                )).toBe(13);
            }
        } finally {
            await fixture.close();
        }
    });

    test(`${basePath} loads the production JSONL verifier Worker online and offline`, async ({page}) => {
        const fixture = await createFixture(basePath);
        try {
            await enterApp(page, fixture.url);
            const entry = fixture.entries.find(entry=>/postHistoryJsonlVerificationWorker-bridge-.*\.js$/.test(entry.url));
            expect(entry).toBeDefined();
            expect(entry!.revision).toBeNull();
            const {outputFiles}=await buildBrowserProbe({entryPoints:[resolve('src/test/e2e/jsonlImportWorkerProbe.ts')],bundle:true,format:'iife',platform:'browser',target:'es2022',write:false,define:{'import.meta.url':'location.href'}});
            await page.addScriptTag({content:outputFiles[0].text});
            const event=finalizeEvent({kind:1,content:'signed fixture',tags:[],created_at:123},generateSecretKey());
            const input={workerURL:new URL(entry!.url,fixture.url).href,events:[event,{...event,id:'0'.repeat(64)},{...event,sig:'g'.repeat(128)},event]};
            for(const offline of [false,true]) {
                fixture.setOffline(offline);
                const result=await page.evaluate(async input=>{
                    const probe=Reflect.get(window,'__JSONL_WORKER_PROBE__') as typeof runJsonlImportWorkerProbe;
                    return probe(input.workerURL,input.events);
                },input);
                expect(result).toEqual({workerCount:4,results:[true,false,false,true]});
            }
        } finally {await fixture.close();}
    });
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

    test(`${basePath} round-trips a share-target File through the production Service Worker MessageChannel`, async ({ page }) => {
        const fixture = await createFixture(basePath);
        try {
            await page.addInitScript(() => {
                if (!('serviceWorker' in navigator)) return;
                navigator.serviceWorker.addEventListener('message', (event: MessageEvent<unknown>) => {
                    const message = event.data;
                    if (
                        typeof message === 'object'
                        && message !== null
                        && 'type' in message
                        && message.type === 'SHARED_MEDIA'
                    ) {
                        event.stopImmediatePropagation();
                    }
                });
            });
            await enterApp(page, fixture.url);
            await page.addScriptTag({ content: await getSharedMediaProbeScript() });

            const controllerUrl = await page.evaluate(
                () => navigator.serviceWorker.controller?.scriptURL ?? null,
            );
            expect(controllerUrl).toBe(`${new URL(fixture.url).origin}${basePath}sw.js`);

            const postResult = await page.evaluate(async () => {
                const file = new File(
                    [new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])],
                    'service-worker-roundtrip.png',
                    { type: 'image/png', lastModified: 1_700_000_000_000 },
                );
                const formData = new FormData();
                formData.append('media', file, file.name);
                formData.append('title', 'Service Worker File round-trip');

                const response = await fetch(new URL('upload', window.location.href), {
                    method: 'POST',
                    body: formData,
                });
                return {
                    status: response.status,
                    redirected: response.redirected,
                    url: response.url,
                };
            });

            expect(postResult.status).toBe(200);
            expect(postResult.redirected).toBe(true);
            expect(new URL(postResult.url).searchParams.get('shared')).toBe('true');

            const directResponse = await page.evaluate(async () => {
                return await window.__swSharedMediaProbe.requestSharedMediaFromServiceWorker();
            });
            expect(directResponse).toMatchObject({
                received: true,
                firstImageIsFile: true,
                fileName: 'service-worker-roundtrip.png',
                fileType: 'image/png',
                fileSize: 8,
            });
            expect(directResponse.shareId).toBeTruthy();
            if (!directResponse.shareId) {
                throw new Error('Service Worker shared media response has no shareId');
            }

            const fallbackResult = await page.evaluate(async (shareId) => {
                return await window.__swSharedMediaProbe.getSharedMediaWithFallback(shareId);
            }, directResponse.shareId);
            expect(fallbackResult.databaseRecordDeleted).toBe(true);
            expect(fallbackResult).toMatchObject({
                received: true,
                firstImageIsFile: true,
                fileName: 'service-worker-roundtrip.png',
                fileType: 'image/png',
                fileSize: 8,
                shareId: directResponse.shareId,
            });
        } finally { await fixture.close(); }
    });
}
