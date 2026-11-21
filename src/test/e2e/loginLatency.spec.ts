import { test, expect, type Page } from '@playwright/test';
import { finalizeEvent, generateSecretKey, getPublicKey, nip19, verifyEvent, type EventTemplate, type Event as NostrEvent } from 'nostr-tools';
import { restoreMentionDraftFixture, saveMentionDraftFixture } from './mentionAvatarDraftFixture';

// Generate disposable credentials per test. Never include login fields or
// signing request bodies in traces, screenshots, videos, or attachments.
test.use({ trace: 'off', screenshot: 'off', video: 'off' });

async function submitSecret(page: Page, key: Uint8Array) {
    await page.locator('#secretKey').evaluate((input, value) => {
        (input as HTMLInputElement).value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }, nip19.nsecEncode(key));
    const started = Date.now();
    await page.locator('.save-btn').click();
    await expect(page.locator('.login-dialog')).toBeHidden();
    return started;
}

async function setup(page: Page, options: {
    timed?: boolean;
    extension?: boolean;
    rejectExtension?: boolean;
    profilePicture?: string;
    profileMissing?: boolean;
    mentions?: boolean;
    mentionDisplayName?: string;
    mentionPicture?: string;
} = {}) {
    const key = generateSecretKey();
    const owner = getPublicKey(key);
    const otherKey = generateSecretKey();
    const otherOwner = getPublicKey(otherKey);
    let holdRelays = true;
    let holdProfiles = true;
    let relayRequests = 0;
    let legacyRequests = 0;
    let profileRequests = 0;
    let followedProfileRequests = 0;
    let includeFollowedProfile = true;
    const firstFollowListTime = Math.floor(Date.now() / 1_000) - 10;
    const recipientRelay = 'wss://mention-read.example/';
    const pendingRelays: Array<() => void> = [];
    const pendingProfiles: Array<() => void> = [];
    const posts: Array<{ relay: string; event: NostrEvent }> = [];
    await page.addInitScript(mentions => {
        localStorage.setItem('firstVisit', '1');
        localStorage.setItem('locale', 'ja');
        if (mentions) localStorage.setItem('footerSettingShortcuts', JSON.stringify({ left: 'notifications', right: null }));
    }, !!options.mentions);
    if (options.extension || options.rejectExtension) {
        await page.exposeFunction('fixtureSignEvent', (template: EventTemplate) => finalizeEvent(template, key));
        await page.addInitScript(({ pubkey, reject }) => {
            window.nostr = {
                getPublicKey: async () => {
                    if (reject) throw new Error('Login declined');
                    return pubkey;
                },
                signEvent: (template: EventTemplate) => (window as unknown as { fixtureSignEvent(event: EventTemplate): Promise<NostrEvent> }).fixtureSignEvent(template),
            } as typeof window.nostr;
        }, { pubkey: owner, reject: options.rejectExtension === true });
    }
    await page.routeWebSocket(/^wss?:\/\//, socket => {
        const respond = (subscription: string, event?: NostrEvent) => {
            try {
                if (event) socket.send(JSON.stringify(['EVENT', subscription, event]));
                socket.send(JSON.stringify(['EOSE', subscription]));
            } catch { /* The previous runtime may already have closed this socket. */ }
        };
        socket.onMessage(raw => {
            const message = JSON.parse(raw.toString());
            if (message[0] === 'EVENT') {
                if (message[1].kind === 1) posts.push({ relay: socket.url(), event: message[1] });
                socket.send(JSON.stringify(['OK', message[1].id, true, '']));
                return;
            }
            if (message[0] !== 'REQ') return;
            const subscription = message[1] as string;
            const kind = message[2]?.kinds?.[0];
            const eventKey = message[2]?.authors?.[0] === otherOwner ? otherKey : key;
            // A queued REQ can cross a second boundary before this fixture
            // receives it. Match its until bound just as a real relay would.
            const createdAt = Math.min(Math.floor(Date.now() / 1000), message[2]?.until ?? Infinity);
            if (options.mentions && message[2]?.['#p']?.includes(otherOwner) && socket.url() === recipientRelay) {
                const event = posts.find(sent => sent.relay === recipientRelay
                    && sent.event.tags.some(tag => tag[0] === 'p' && tag[1] === otherOwner))?.event;
                respond(subscription, event);
                return;
            }
            if (kind === 10002) {
                relayRequests += 1;
                const event = finalizeEvent({ kind, created_at: createdAt, content: '',
                    tags: options.mentions && eventKey === otherKey
                        ? [['r', recipientRelay, 'read'], ['r', 'wss://other-write.example/', 'write']]
                        : [['r', 'wss://login-write.example']] }, eventKey);
                const send = () => respond(subscription, event);
                if (options.timed) setTimeout(send, 600);
                else if (holdRelays) pendingRelays.push(send);
                else send();
            } else if (kind === 3) {
                legacyRequests += 1;
                respond(subscription, finalizeEvent({ kind,
                    created_at: options.mentions ? firstFollowListTime + Number(!includeFollowedProfile) : createdAt,
                    tags: options.mentions && includeFollowedProfile && eventKey === key ? [['p', otherOwner]] : [],
                    content: JSON.stringify({ 'wss://legacy.example': { read: true, write: true } }) }, eventKey));
            } else if (kind === 0) {
                profileRequests += 1;
                const mentionProfile = options.mentions && eventKey === otherKey;
                if (eventKey === otherKey) followedProfileRequests += 1;
                const name = mentionProfile ? 'alice' : eventKey === key ? 'Delayed profile' : 'Other profile';
                const event = finalizeEvent({ kind, created_at: createdAt, tags: [],
                    content: JSON.stringify({ name, display_name: mentionProfile ? (options.mentionDisplayName ?? 'アリス Example') : name,
                        ...(mentionProfile ? { nip05: 'alice@example.com' } : {}),
                        picture: (eventKey === otherKey ? options.mentionPicture : undefined) ?? options.profilePicture ?? '' }) }, eventKey);
                const send = () => respond(subscription, options.profileMissing ? undefined : event);
                if (options.timed) setTimeout(send, 1200);
                else if (holdProfiles) pendingProfiles.push(send);
                else send();
            } else respond(subscription);
        });
    });
    await page.setViewportSize({ width: 360, height: 844 });
    await page.goto('/ehagaki/');
    // This is the initial Vite module load, before the measured login action.
    await expect(page.locator('.login-btn')).toBeVisible({ timeout: 15000 });
    const login = async () => {
        await page.locator('.login-btn').click();
        let started: number;
        if (options.extension) {
            started = Date.now();
            await page.locator('.nip07-login-button').click();
        } else {
            // Setting a password through evaluate keeps disposable credentials
            // out of Playwright's fill action diagnostics.
            started = await submitSecret(page, key);
        }
        await expect(page.locator('.login-dialog')).toBeHidden();
        return started;
    };
    return {
        owner, otherOwner, login, posts, recipientRelay,
        addAccount: async () => {
            await account(page).click();
            await page.locator('.add-account-btn').click();
            await submitSecret(page, otherKey);
        },
        counts: () => ({ relayRequests, legacyRequests, profileRequests, followedProfileRequests }),
        removeFollowedProfile: () => { includeFollowedProfile = false; },
        pauseRelays: () => { holdRelays = true; },
        releaseRelays: () => { holdRelays = false; pendingRelays.splice(0).forEach(send => send()); },
        releaseProfiles: () => { holdProfiles = false; pendingProfiles.splice(0).forEach(send => send()); },
    };
}

const account = (page: Page) => page.locator('.footer-bar .profile-display:not(.loading)');
const post = (page: Page) => page.locator('button.post-button');

for (const extension of [false, true]) {
    test(`${extension ? 'NIP-07' : 'secret-key'} login permits input before relay discovery and posting before profile retrieval`, async ({ page }) => {
        const app = await setup(page, { extension });
        await app.login();
        await expect(account(page)).toBeVisible();
        const editor = page.locator('.tiptap-editor');
        await editor.fill('Early login draft');
        await expect(editor).toHaveText('Early login draft');
        await expect.poll(() => app.counts().relayRequests).toBeGreaterThan(0);
        await expect(post(page)).toBeDisabled();
        app.releaseRelays();
        await expect(post(page)).toBeEnabled();
        await expect.poll(() => app.counts().profileRequests).toBeGreaterThan(0);
        await expect(account(page)).not.toHaveAttribute('aria-busy', 'true');
        if (!extension) {
            await post(page).click();
            await expect.poll(() => app.posts.length).toBeGreaterThan(0);
            for (const sent of app.posts) {
                expect(sent.event.pubkey).toBe(app.owner);
                expect(verifyEvent(sent.event)).toBe(true);
                expect(sent.relay).toMatch(/^wss:\/\/login-write\.example\/?$/);
            }
        }
        app.releaseProfiles();
        await expect(account(page)).toHaveAttribute('aria-label', 'プロフィール');
    });
}

test('uses a retained kind 3 response after one three-second discovery timeout', async ({ page }) => {
    const app = await setup(page);
    await app.login();
    await expect(account(page)).toBeVisible();
    await page.locator('.tiptap-editor').fill('Fallback draft');
    await expect.poll(() => app.counts().legacyRequests).toBeGreaterThan(0);
    await expect(post(page)).toBeDisabled();
    await expect(post(page)).toBeEnabled({ timeout: 4500 });
    await post(page).click();
    await expect.poll(() => app.posts.length).toBeGreaterThan(0);
    expect(app.posts.every(sent => /^wss:\/\/legacy\.example\/?$/.test(sent.relay))).toBe(true);
});

test('restores a saved secret-key account without waiting for its profile or rediscovering its relays', async ({ page }) => {
    const app = await setup(page);
    await app.login();
    app.releaseRelays();
    await page.locator('.tiptap-editor').fill('Before reload');
    await expect(post(page)).toBeEnabled();
    await expect.poll(() => hasStoredFollowList(page, app.owner)).toBe(true);
    const legacyCount = app.counts().legacyRequests;
    await page.reload();
    await expect(account(page)).toBeVisible({ timeout: 15_000 });
    await page.locator('.tiptap-editor').fill('Restored draft');
    await expect(post(page)).toBeEnabled();
    expect(app.counts().legacyRequests).toBe(legacyCount);
});

function hasStoredFollowList(page: Page, pubkey: string): Promise<boolean> {
    return page.evaluate(owner => new Promise<boolean>(resolve => {
        const open = indexedDB.open('eHagakiDB');
        open.onupgradeneeded = () => open.transaction?.abort();
        open.onerror = () => resolve(false);
        open.onsuccess = () => {
            const db = open.result;
            if (!db.objectStoreNames.contains('followLists')) {
                db.close();
                resolve(false);
                return;
            }
            const get = db.transaction('followLists').objectStore('followLists').get(owner);
            get.onerror = () => { db.close(); resolve(false); };
            get.onsuccess = () => { db.close(); resolve(Boolean(get.result)); };
        };
    }), pubkey);
}

test('searches saved mentions and delivers a tagged post to the recipient notifications', async ({ page }) => {
    const app = await setup(page, { mentions: true });
    await app.login();
    app.releaseRelays();
    await expect.poll(() => hasStoredFollowList(page, app.owner)).toBe(true);
    await expect.poll(() => app.counts().followedProfileRequests).toBeGreaterThan(0);

    const editor = page.locator('.tiptap-editor');
    const popup = page.locator('.profile-mention-suggestion-popover');
    await editor.fill('@alice@example.com');
    await expect(editor.locator('[data-decoration-id]')).toHaveText('@alice@example.com');
    await expect(popup).toHaveCount(0);
    app.releaseProfiles();
    await expect(popup.getByText('@アリス Example', { exact: true })).toBeVisible({ timeout: 12_000 });
    const requests = app.counts().followedProfileRequests;
    for (const query of ['@alice', '@アリス Example', '@alice@example.com']) {
        await editor.fill(query);
        await expect(popup.getByText('@アリス Example', { exact: true })).toBeVisible();
    }
    expect(app.counts().followedProfileRequests).toBe(requests);

    await editor.press('Enter');
    await expect(editor.locator('[data-nostr-mention]')).toHaveText('@アリス Example');

    for (const pointer of [
        nip19.npubEncode(app.otherOwner),
        nip19.nprofileEncode({ pubkey: app.otherOwner, relays: ['wss://mention-hint.example/'] }),
    ]) {
        await page.getByRole('button', { name: '宛先を指定' }).click();
        const dialog = page.getByRole('dialog', { name: '宛先を指定' });
        await dialog.locator('input').fill(pointer);
        await dialog.getByRole('button', { name: 'メンション', exact: true }).click();
        await expect(dialog).toBeHidden();
    }
    await expect(editor.locator('[data-nostr-mention]')).toHaveCount(3);
    await editor.press('End');
    await page.keyboard.insertText(` 直接貼り付け nostr:${nip19.npubEncode(app.otherOwner)}`);
    await post(page).click();
    await expect.poll(() => app.posts.map(sent => sent.relay)).toEqual(expect.arrayContaining([
        'wss://login-write.example/', app.recipientRelay,
    ]));
    const sent = app.posts.find(publication => publication.relay === app.recipientRelay)!.event;
    expect(verifyEvent(sent)).toBe(true);
    expect(sent.tags.filter(tag => tag[0] === 'p')).toEqual([['p', app.otherOwner]]);
    expect(sent.content).toContain(`直接貼り付け nostr:${nip19.npubEncode(app.otherOwner)}`);

    await page.locator('.post-history-btn').click();
    const history = page.getByRole('dialog', { name: '履歴' });
    await expect(history.getByRole('link', { name: '@アリス Example' }).first()).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(history).toBeHidden();

    await app.addAccount();
    await expect(page.getByRole('button', { name: '通知（未読あり）' })).toBeVisible({ timeout: 15_000 });
    await page.getByRole('button', { name: '通知（未読あり）' }).click();
    const notifications = page.getByRole('dialog', { name: '通知' });
    const row = notifications.locator('.notification-entry').filter({ hasText: '直接貼り付け' });
    await expect(row.getByText('メンション', { exact: true })).toBeVisible();
    await expect(row.getByRole('link', { name: '@アリス Example' }).first()).toBeVisible();
});

test('refreshes the mention candidates from Settings after a follow is removed', async ({ page }) => {
    const app = await setup(page, { mentions: true });
    await app.login();
    app.releaseRelays();
    app.releaseProfiles();
    await expect.poll(() => hasStoredFollowList(page, app.owner)).toBe(true);
    const editor = page.locator('.tiptap-editor');
    const popup = page.locator('.profile-mention-suggestion-popover');
    await editor.fill('@');
    await expect(popup).toHaveCount(0);
    await editor.fill('@npub');
    await expect(popup.locator('[role="option"]').first()).toBeVisible();
    await editor.fill('@');
    await expect(popup).toHaveCount(0);

    app.removeFollowedProfile();
    const earlierRequests = app.counts().legacyRequests;
    await page.getByRole('button', { name: '設定', exact: true }).click();
    const settings = page.getByRole('dialog', { name: 'settings', exact: true });
    await settings.getByRole('button', { name: 'Nostr', exact: true }).click();
    const refresh = settings.getByRole('button', { name: 'リレーリスト・プロフィール・フォローリスト再取得' });
    await refresh.click();
    await expect.poll(() => app.counts().legacyRequests).toBeGreaterThan(earlierRequests);
    await expect(refresh).toBeEnabled();
    await page.keyboard.press('Escape');
    await expect(settings).toBeHidden();

    await editor.fill('@a');
    await expect(popup).toHaveCount(0);
});

test('keeps long mention names compact in the suggestions and editor', async ({ page }) => {
    const prefix = `${'寿限無'.repeat(7)}寿限👩🏽‍💻`;
    await routeMentionAvatar(page);
    const app = await setup(page, { mentions: true, mentionPicture: mentionAvatarUrl,
        mentionDisplayName: `${prefix}${'限無'.repeat(300)}検索用末尾` });
    await app.login();
    app.releaseRelays();
    app.releaseProfiles();

    const editor = page.locator('.tiptap-editor');
    const choice = page.locator('.profile-mention-suggestion-popover').getByRole('option');
    await expect.poll(() => app.counts().followedProfileRequests).toBeGreaterThan(0);
    await editor.fill('@検索用末尾');
    await expect(choice).toContainText(`@${prefix}…`, { timeout: 12_000 });
    const choiceAvatar = choice.locator('.suggestion-mention-avatar-image');
    await expect(choiceAvatar).toHaveAttribute('src', mentionAvatarUrl + '?profile=true');
    await expect.poll(() => choiceAvatar.evaluate(img => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    const requests = app.counts().followedProfileRequests;

    for (const width of [360, 1103]) {
        await page.setViewportSize({ width, height: 844 });
        await expect.poll(() => choice.evaluate(row => {
            const bounds = row.getBoundingClientRect();
            const key = row.querySelector('small')!.getBoundingClientRect();
            const icon = row.querySelector('.suggestion-mention-avatar-image')!.getBoundingClientRect();
            return bounds.left >= 0 && bounds.right <= window.innerWidth
                && icon.width === 24 && key.width > 0 && key.right <= bounds.right && row.scrollWidth <= row.clientWidth;
        })).toBe(true);
    }

    await editor.fill('＠');
    await expect(choice).toHaveCount(0);
    await editor.fill('＠寿限無');
    await expect(choice).toContainText(`@${prefix}…`);
    await editor.press('Enter');
    await expect(editor.locator('.editor-profile-mention')).toHaveText(`@${prefix}…`);
    await expect(editor.locator('.inline-mention-avatar-image')).toBeVisible();
    expect(app.counts().followedProfileRequests).toBe(requests);
});

const mentionAvatarUrl = 'https://avatar.example/mention-icon.svg';

async function routeMentionAvatar(page: Page) {
    await page.route(url => url.origin + url.pathname === mentionAvatarUrl, route => route.fulfill({
        contentType: 'image/svg+xml',
        body: '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17"><rect width="17" height="17" fill="green"/></svg>',
    }));
}

for (const mode of ['insertion', 'draft restoration'] as const) {
    test(`loads and saves an uncached mention avatar after ${mode}`, async ({ page }) => {
        await routeMentionAvatar(page);
        const app = await setup(page, { mentionPicture: mentionAvatarUrl });
        await app.login();
        app.releaseRelays();
        app.releaseProfiles();
        await expect.poll(() => hasStoredFollowList(page, app.owner)).toBe(true);
        await saveMentionDraftFixture(page, { owner: app.owner, pubkey: app.otherOwner });
        expect(app.counts().followedProfileRequests).toBe(0);

        if (mode === 'insertion') {
            await page.getByRole('button', { name: '宛先を指定' }).click();
            const target = page.getByRole('dialog', { name: '宛先を指定' });
            await target.locator('input').fill(nip19.npubEncode(app.otherOwner));
            await target.getByRole('button', { name: 'メンション', exact: true }).click();
        } else {
            await restoreMentionDraftFixture(page);
        }
        const editor = page.locator('.tiptap-editor');
        const avatar = editor.locator('.inline-mention-avatar-image');
        await expect(avatar).toHaveAttribute('src', mentionAvatarUrl + '?profile=true');
        await expect.poll(() => avatar.evaluate(img => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
        expect(app.counts().followedProfileRequests).toBeGreaterThan(0);
        await expect.poll(() => page.evaluate(pubkey => new Promise<string | undefined>((resolve, reject) => {
            const open = indexedDB.open('eHagakiDB');
            open.onerror = () => reject(open.error);
            open.onsuccess = () => {
                const db = open.result;
                const get = db.transaction('profiles').objectStore('profiles').get(pubkey);
                get.onsuccess = () => { db.close(); resolve(get.result?.pictureUrl); };
                get.onerror = () => { db.close(); reject(get.error); };
            };
        }), app.otherOwner)).toBe(mentionAvatarUrl + '?profile=true');

        const requests = app.counts().followedProfileRequests;
        await editor.fill('');
        await restoreMentionDraftFixture(page);
        await expect(avatar).toBeVisible();
        expect(app.counts().followedProfileRequests).toBe(requests);
    });
}

test('records login visibility and posting latency with controlled relay and profile delays', async ({ page }, testInfo) => {
    const app = await setup(page, { timed: true });
    const started = await app.login();
    await page.locator('.tiptap-editor').fill('Latency measurement draft');
    await expect(account(page)).toBeVisible();
    const visibleMs = Date.now() - started;
    await expect(post(page)).toBeEnabled();
    const postingMs = Date.now() - started;
    console.info('[login-latency]', JSON.stringify({ visibleMs, postingMs }));
    await testInfo.attach('login-latency', {
        body: JSON.stringify({ visibleMs, postingMs, relayDelayMs: 600, profileDelayMs: 1200 }),
        contentType: 'application/json',
    });
});

test('keeps the new account initialization alive when deleting an inactive account and ignores its late profile', async ({ page }) => {
    const app = await setup(page);
    await app.login();
    app.releaseRelays();
    await page.locator('.tiptap-editor').fill('Account switch draft');
    await expect(post(page)).toBeEnabled();
    await expect.poll(() => app.counts().profileRequests).toBeGreaterThan(0);
    app.pauseRelays();
    await app.addAccount();
    await expect(account(page)).toBeVisible();
    await expect(post(page)).toBeDisabled();
    await account(page).click();
    await page.locator('.account-row').first().locator('.account-logout-button').click();
    await expect(page.locator('.account-row')).toHaveCount(1);
    app.releaseRelays();
    app.releaseProfiles();
    await expect(page.locator('.profile-name')).toHaveText('Other profile');
    await expect(page.locator('.current-account-section')).toContainText(nip19.npubEncode(app.otherOwner));
    await page.keyboard.press('Escape');
    await expect(post(page)).toBeEnabled();
    await post(page).click();
    await expect.poll(() => app.posts.length).toBeGreaterThan(0);
    expect(app.posts.every(sent => sent.event.pubkey === app.otherOwner && verifyEvent(sent.event))).toBe(true);
});

test('keeps a secret-key account preparation alive after another extension login is rejected', async ({ page }) => {
    const app = await setup(page, { rejectExtension: true });
    await app.login();
    app.releaseRelays();
    await page.locator('.tiptap-editor').fill('Preserved draft');
    await expect(post(page)).toBeEnabled();
    app.pauseRelays();
    await app.addAccount();
    await expect(account(page)).toBeVisible();
    await expect(post(page)).toBeDisabled();

    await account(page).click();
    await page.locator('.add-account-btn').click();
    await page.locator('.nip07-login-button').click();
    await expect(page.getByText('ブラウザ拡張機能でのログインに失敗しました', { exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('.login-dialog')).toBeHidden();
    await expect(page.locator('.tiptap-editor')).toHaveText('Preserved draft');
    await expect(post(page)).toBeDisabled();

    app.releaseRelays();
    await expect(post(page)).toBeEnabled();
    await post(page).click();
    await expect.poll(() => app.posts.length).toBeGreaterThan(0);
    expect(app.posts.every(sent => sent.event.pubkey === app.otherOwner && verifyEvent(sent.event))).toBe(true);
});

test('a successful extension login supersedes a pending secret-key account preparation', async ({ page }) => {
    const app = await setup(page, { extension: true });
    await app.login();
    app.releaseRelays();
    await page.locator('.tiptap-editor').fill('Replacement draft');
    await expect(post(page)).toBeEnabled();
    app.pauseRelays();
    await app.addAccount();
    await expect(post(page)).toBeDisabled();

    await account(page).click();
    await page.locator('.add-account-btn').click();
    await page.locator('.nip07-login-button').click();
    await expect(page.locator('.login-dialog')).toBeHidden();
    app.releaseRelays();
    app.releaseProfiles();
    await expect(post(page)).toBeEnabled();
    await post(page).click();
    await expect.poll(() => app.posts.length).toBeGreaterThan(0);
    expect(app.posts.every(sent => sent.event.pubkey === app.owner && verifyEvent(sent.event))).toBe(true);
    await account(page).click();
    await expect(page.locator('.profile-name')).toHaveText('Delayed profile');
});

test('pulses the default account icon through profile and image loading without blocking posting', async ({ page }, testInfo) => {
    const avatarUrl = 'https://avatar.example/login.svg';
    const pendingImages: import('@playwright/test').Route[] = [];
    let imagesReleased = false;
    const deliverImage = (route: import('@playwright/test').Route) => route.fulfill({
        contentType: 'image/svg+xml', headers: { 'cache-control': 'public, max-age=600' },
        body: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><circle cx="24" cy="24" r="24" fill="#2563eb"/><circle cx="24" cy="18" r="8" fill="white"/><path d="M10 42a14 14 0 0 1 28 0" fill="white"/></svg>',
    });
    await page.route('https://avatar.example/**', route => {
        if (imagesReleased) return deliverImage(route);
        pendingImages.push(route);
    });
    const app = await setup(page, { profilePicture: avatarUrl });
    await app.login();
    const fallback = page.locator('.footer-bar .profile-avatar-fallback');
    const avatar = page.locator('.footer-bar [data-avatar-root]');
    const editorFallback = page.locator('.editor-account-placeholder-fallback');
    await expect(editorFallback).toHaveAttribute('data-loading', 'true');
    await expect(editorFallback).toBeHidden();
    const placeholderPosition = () => page.locator('.tiptap-editor p').evaluate(el =>
        getComputedStyle(el, '::before').paddingLeft);
    const initialPadding = await placeholderPosition();
    await expect(fallback).toHaveAttribute('data-loading', 'true');
    await expect(avatar).toHaveAttribute('aria-busy', 'true');
    expect(await fallback.evaluate(el => getComputedStyle(el).animationName)).toContain('profile-avatar-loading-pulse');
    await expect(account(page)).toBeEnabled();
    await page.locator('.footer-bar').screenshot({ path: testInfo.outputPath('avatar-pending.png') });

    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(await fallback.evaluate(el => getComputedStyle(el).animationName)).toBe('none');
    await expect(fallback).toBeVisible();
    await expect(avatar).toHaveAttribute('aria-busy', 'true');
    await page.emulateMedia({ reducedMotion: 'no-preference' });

    app.releaseRelays();
    app.releaseProfiles();
    await expect.poll(() => pendingImages.length).toBeGreaterThan(0);
    await expect(fallback).toHaveAttribute('data-loading', 'true');
    await expect(editorFallback).toHaveAttribute('data-loading', 'true');
    await expect(editorFallback).toBeHidden();
    await expect.poll(placeholderPosition).toBe(initialPadding);
    await page.locator('.footer-bar').screenshot({ path: testInfo.outputPath('avatar-image-pending.png') });
    await page.locator('.tiptap-editor').fill('Image pending draft');
    await expect(post(page)).toBeEnabled();

    imagesReleased = true;
    await Promise.all(pendingImages.splice(0).map(deliverImage));
    await expect(page.locator('.footer-bar .profile-picture-image')).toBeVisible();
    await expect(avatar).not.toHaveAttribute('aria-busy');
    await expect(fallback).toBeHidden();
    await page.locator('.footer-bar').screenshot({ path: testInfo.outputPath('avatar-loaded.png') });
});

test('never paints an editor fallback while restoring a saved avatar on reload or revisit', async ({ page }) => {
    await page.addInitScript(() => {
        const observation = { frames: 0, visibleFallbackFrames: 0 };
        (window as unknown as { avatarObservation: typeof observation }).avatarObservation = observation;
        const sample = () => {
            const fallback = document.querySelector('.editor-account-placeholder-fallback');
            if (fallback) {
                observation.frames++;
                const style = getComputedStyle(fallback);
                if (style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0
                    && fallback.getBoundingClientRect().width > 0) observation.visibleFallbackFrames++;
            }
            requestAnimationFrame(sample);
        };
        requestAnimationFrame(sample);
    });
    await page.route('https://avatar.example/**', route => route.fulfill({
        contentType: 'image/svg+xml',
        body: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="48" height="48" fill="blue"/></svg>',
    }));
    const app = await setup(page, { profilePicture: 'https://avatar.example/saved.svg' });
    await app.login();
    app.releaseRelays();
    app.releaseProfiles();
    const image = page.locator('.editor-account-placeholder-image');
    await expect(image).toBeVisible();
    for (const navigation of ['reload', 'revisit']) {
        if (navigation === 'reload') await page.reload();
        else {
            await page.goto('about:blank');
            await page.goto('/ehagaki/');
        }
        await expect(image).toBeVisible();
        await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => resolve())));
        const observation = await page.evaluate(() =>
            (window as unknown as { avatarObservation: { frames: number; visibleFallbackFrames: number } }).avatarObservation);
        expect(observation.frames).toBeGreaterThan(0);
        expect(observation.visibleFallbackFrames).toBe(0);
    }
});

for (const outcome of ['missing', 'image-error'] as const) {
    test(`stops the account icon pulse when the profile is ${outcome}`, async ({ page }) => {
        await page.route('https://avatar.example/**', route => route.fulfill({ status: 404, body: '' }));
        const app = await setup(page, {
            profileMissing: outcome === 'missing',
            profilePicture: outcome === 'image-error' ? 'https://avatar.example/missing.png' : '',
        });
        await app.login();
        const fallback = page.locator('.footer-bar .profile-avatar-fallback');
        await expect(fallback).toHaveAttribute('data-loading', 'true');
        app.releaseRelays();
        app.releaseProfiles();
        await expect(fallback).not.toHaveAttribute('data-loading');
        await expect(fallback).toBeVisible();
        await expect(page.locator('.editor-account-placeholder-fallback')).toBeVisible();
        await expect(page.locator('.footer-bar [data-avatar-root]')).not.toHaveAttribute('aria-busy');
        await expect(account(page)).toBeEnabled();
    });
}
