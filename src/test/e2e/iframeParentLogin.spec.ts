import { test, expect, type Page, type WebSocketRoute } from '@playwright/test';
import { finalizeEvent, generateSecretKey, getPublicKey } from 'nostr-tools';

type PendingRequest = { socket: WebSocketRoute; id: string; author: string };

async function openParentLogin(page: Page, hostRelays = false) {
    // Keys stay in this test runner; the parent fixture only receives public keys.
    const keys = [generateSecretKey(), generateSecretKey()];
    const pubkeys = keys.map(getPublicKey);
    await page.exposeFunction('__signForIframe', (event: Parameters<typeof finalizeEvent>[0], index: number) =>
        finalizeEvent(event, keys[index]));
    const profiles = keys.map((key, index) => finalizeEvent({
        kind: 0, tags: [], created_at: Math.floor(Date.now() / 1000),
        content: JSON.stringify({ name: `iframe-account-${index + 1}`, display_name: `Iframe account ${index + 1}` }),
    }, key));
    const relayLists = keys.map(key => finalizeEvent({
        kind: 10002, tags: [['r', 'wss://login-write.example/', 'write']],
        created_at: Math.floor(Date.now() / 1000), content: '',
    }, key));
    let relaysReleased = false;
    let profilesReleased = false;
    const pendingRelays = new Set<PendingRequest>();
    const pendingProfiles = new Set<PendingRequest>();
    const publishedEventIds = new Set<string>();
    const reply = (request: PendingRequest, kind: 'relay' | 'profile') => {
        const index = pubkeys.indexOf(request.author);
        if (index >= 0) request.socket.send(JSON.stringify(['EVENT', request.id,
            kind === 'relay' ? relayLists[index] : profiles[index]]));
        request.socket.send(JSON.stringify(['EOSE', request.id]));
    };

    await page.route('https://**/*', route => route.abort());
    await page.addInitScript(() => {
        localStorage.setItem('firstVisit', '1');
        const NativeWebSocket = window.WebSocket;
        class ConnectingSocket extends EventTarget {
            readyState = 0;
            send() { throw new Error('Test socket is still connecting'); }
            close() { this.readyState = 3; this.dispatchEvent(new CloseEvent('close', { code: 1000 })); }
        }
        window.WebSocket = new Proxy(NativeWebSocket, {
            construct(target, args) {
                // A bootstrap relay never finishes the connection handshake.
                if (String(args[0]).includes('directory.yabu.me')) return new ConnectingSocket();
                return Reflect.construct(target, args);
            },
        });
    });
    await page.routeWebSocket(/^wss:\/\//, socket => {
        socket.onMessage(raw => {
            const message = JSON.parse(String(raw)) as unknown[];
            if (message[0] === 'EVENT') {
                const event = message[1] as { id: string };
                publishedEventIds.add(event.id);
                socket.send(JSON.stringify(['OK', event.id, true, '']));
                return;
            }
            if (message[0] === 'CLOSE') {
                for (const pending of [pendingRelays, pendingProfiles]) {
                    for (const request of pending) {
                        if (request.socket === socket && request.id === message[1]) pending.delete(request);
                    }
                }
                return;
            }
            if (message[0] !== 'REQ' || typeof message[1] !== 'string') return;
            const filter = message[2] as { kinds?: number[]; authors?: string[] };
            const request = { socket, id: message[1], author: filter.authors?.[0] ?? '' };
            if (filter.kinds?.includes(10002) && pubkeys.includes(request.author) && !hostRelays) {
                if (relaysReleased) reply(request, 'relay');
                else pendingRelays.add(request);
            } else if (filter.kinds?.includes(0) && pubkeys.includes(request.author)) {
                // Other relays connect successfully but withhold both profile and EOSE.
                if (profilesReleased) reply(request, 'profile');
                else pendingProfiles.add(request);
            } else socket.send(JSON.stringify(['EOSE', message[1]]));
        });
        socket.onClose(() => {
            for (const pending of [pendingRelays, pendingProfiles]) {
                for (const request of pending) if (request.socket === socket) pending.delete(request);
            }
        });
    });
    await page.route('**/iframe-login-parent.html', async route => {
        const child = new URL('/ehagaki/', route.request().url());
        child.searchParams.set('parentOrigin', child.origin);
        child.searchParams.set('embedLocale', 'ja');
        if (hostRelays) child.searchParams.set('hostRelayConfig', '1');
        await route.fulfill({ contentType: 'text/html', body: `<!doctype html><html><body>
<iframe id="child" src="${child}" style="width:360px;height:720px;border:0"></iframe>
<script>
const frame = document.querySelector('#child');
const pubkeys = ${JSON.stringify(pubkeys)};
const state = window.__parentLogin = { authRequests: 0, ready: 0, account: 0, loggedIn: false, authAt: 0, posted: 0 };
const post = (type, payload, requestId) => frame.contentWindow.postMessage({
  namespace: 'ehagaki.embed', version: 1, type, payload, ...(requestId ? { requestId } : {})
}, location.origin);
window.__login = (account = 0) => { state.account = account; state.loggedIn = true; post('auth.login', { pubkeyHex: pubkeys[account] }); };
window.__logout = () => { state.loggedIn = false; post('auth.logout', { pubkeyHex: pubkeys[state.account] }); };
window.addEventListener('message', async event => {
  if (event.source !== frame.contentWindow || event.origin !== location.origin) return;
  const m = event.data;
  if (m?.namespace !== 'ehagaki.embed' || m.version !== 1) return;
  if (m.type === 'relays.request') post('relays.set', [{ url: 'wss://login-host.example/', read: true, write: true }], m.requestId);
  if (m.type === 'ready') { state.ready++; if (state.loggedIn) post('auth.login', { pubkeyHex: pubkeys[state.account] }); }
  if (m.type === 'auth.request') {
    state.authRequests++; state.authAt = Date.now();
    post('auth.result', { pubkeyHex: pubkeys[state.account], capabilities: ['signEvent'] }, m.requestId);
  }
  if (m.type === 'rpc.request' && m.payload.method === 'signEvent') {
    const signed = await window.__signForIframe(m.payload.params.event, state.account);
    post('rpc.result', { result: signed }, m.requestId);
  }
  if (m.type === 'post.success') state.posted++;
  if (m.type === 'storage.get') post('storage.result', { timestamp: Date.now(), values: Object.fromEntries(m.payload.keys.map(key => [key, key === 'firstVisit' ? '1' : null])) }, m.requestId);
  if (m.type === 'storage.set') post('storage.result', { timestamp: Date.now(), applied: Object.keys(m.payload.values) }, m.requestId);
  if (m.type === 'storage.remove') post('storage.result', { timestamp: Date.now(), removed: m.payload.keys }, m.requestId);
  if (m.type === 'idb.getSnapshot') post('idb.result', { timestamp: Date.now(), store: m.payload.store, scopeKey: m.payload.scopeKey, records: [] }, m.requestId);
  if (m.type === 'idb.setSnapshot') post('idb.result', { timestamp: Date.now(), store: m.payload.store, scopeKey: m.payload.scopeKey, applied: true }, m.requestId);
});
</script></body></html>` });
    });
    await page.goto('/ehagaki/iframe-login-parent.html');
    const frame = page.frameLocator('#child');
    // Observe the initial guest/editor readiness before starting the measured
    // authentication. Cold Vite compilation is separate from relay latency.
    await frame.locator('.tiptap-editor').waitFor({ state: 'visible' });
    await frame.getByRole('button', { name: 'ログイン', exact: true }).waitFor({ state: 'visible' });
    await page.evaluate(() => (window as any).__login());
    return {
        frame,
        pendingRelays,
        pendingProfiles,
        publishedEventIds,
        releaseRelays() {
            relaysReleased = true;
            for (const request of pendingRelays) reply(request, 'relay');
            pendingRelays.clear();
        },
        releaseProfiles() {
            profilesReleased = true;
            for (const request of pendingProfiles) reply(request, 'profile');
            pendingProfiles.clear();
        },
    };
}

test('authenticates before silent relays finish and posts before profile retrieval finishes', async ({ page, browserName }) => {
    const host = await openParentLogin(page);
    await expect(host.frame.locator('.profile-display:not(.loading)')).toBeVisible();
    const visibleAt = Date.now();
    const editor = host.frame.locator('.tiptap-editor');
    await editor.fill('draft while relay discovery is pending');
    const submit = host.frame.getByRole('button', { name: '投稿', exact: true });
    await expect(submit).toBeDisabled();
    await host.frame.getByRole('button', { name: 'プロフィール', exact: true }).click();
    await expect(host.frame.getByRole('dialog')).toContainText('npub1');
    await page.keyboard.press('Escape');
    await expect.poll(() => host.pendingRelays.size).toBeGreaterThan(0);
    host.releaseRelays();
    await expect(submit).toBeEnabled();
    const postingAt = Date.now();
    await expect.poll(() => host.pendingProfiles.size).toBeGreaterThan(0);
    const state = await page.evaluate(() => (window as any).__parentLogin);
    expect(state.authRequests).toBe(1);
    expect(state.ready).toBeGreaterThanOrEqual(2);
    // Another ready/auth.login echo must not invalidate the established runtime.
    await page.evaluate(() => (window as any).__login());
    await expect(submit).toBeEnabled();
    expect(await page.evaluate(() => (window as any).__parentLogin.authRequests)).toBe(1);
    await submit.click();
    await expect.poll(() => page.evaluate(() => (window as any).__parentLogin.posted)).toBe(1);
    expect(host.publishedEventIds.size).toBeGreaterThan(0);
    host.releaseProfiles();
    await host.frame.getByRole('button', { name: 'プロフィール', exact: true }).click();
    await expect(host.frame.getByRole('dialog')).toContainText('Iframe account 1');
    console.info('iframe login phases (ms)', { browserName, authenticated: visibleAt - state.authAt,
        postingReady: postingAt - state.authAt, profileUpdated: Date.now() - state.authAt });
});

test('invalidates a pending profile on logout and accepts login of the same account again', async ({ page }) => {
    const host = await openParentLogin(page);
    await expect(host.frame.locator('.profile-display:not(.loading)')).toBeVisible();
    await expect.poll(() => host.pendingRelays.size).toBeGreaterThan(0);
    host.releaseRelays();
    await expect.poll(() => host.pendingProfiles.size).toBeGreaterThan(0);
    await page.evaluate(() => (window as any).__logout());
    await expect(host.frame.getByRole('button', { name: 'ログイン', exact: true })).toBeVisible();
    host.releaseProfiles();
    await expect(host.frame.locator('.profile-display')).toHaveCount(0);
    await page.evaluate(() => (window as any).__login());
    await expect(host.frame.locator('.profile-display:not(.loading)')).toBeVisible();
    await host.frame.getByRole('button', { name: 'プロフィール', exact: true }).click();
    await expect(host.frame.getByRole('dialog')).toContainText('Iframe account 1');
    expect(await page.evaluate(() => (window as any).__parentLogin.authRequests)).toBe(2);
});

test('keeps the latest parent account when it changes during relay preparation', async ({ page }) => {
    const host = await openParentLogin(page);
    await expect.poll(() => host.pendingRelays.size).toBeGreaterThan(0);
    await page.evaluate(() => (window as any).__login(1));
    host.releaseRelays();
    await expect.poll(() => page.evaluate(() => (window as any).__parentLogin.authRequests)).toBe(2);
    await expect.poll(() => host.pendingProfiles.size).toBeGreaterThan(0);
    host.releaseProfiles();
    await host.frame.getByRole('button', { name: 'プロフィール', exact: true }).click();
    await expect(host.frame.getByRole('dialog')).toContainText('Iframe account 2');
    await expect(host.frame.getByRole('dialog')).not.toContainText('Iframe account 1');
});

test('uses Host Relay Config without waiting for a profile response', async ({ page }) => {
    const host = await openParentLogin(page, true);
    await expect(host.frame.locator('.profile-display:not(.loading)')).toBeVisible();
    await host.frame.locator('.tiptap-editor').fill('host relay draft');
    await expect(host.frame.getByRole('button', { name: '投稿', exact: true })).toBeEnabled();
    await expect.poll(() => host.pendingProfiles.size).toBeGreaterThan(0);
    expect(host.pendingRelays.size).toBe(0);
    expect(await page.evaluate(() => (window as any).__parentLogin.authRequests)).toBe(1);
});
