import { expect, test, type Page } from "@playwright/test";
import { finalizeEvent, generateSecretKey, getPublicKey, matchFilter, verifyEvent, type Filter, type EventTemplate } from "nostr-tools";
import { WebSocketServer } from "ws";
import type { AddressInfo } from "node:net";

test.use({ trace: "off" });
const externalUrl = "wss://external.example/";

async function fixture(page: Page, options: { externalOk?: boolean; localMode?: "accept" | "reject" | "auth" | "silent";
    localCount?: number; externalCount?: number; externalRead?: "accept" | "closed" | "silent" | "hold-older" } = {}) {
    const secret = generateSecretKey(), pubkey = getPublicKey(secret);
    const sign = (template: EventTemplate) => finalizeEvent(template, secret);
    // Keep the multi-page regression corpus outside the app's live forward subscription.
    const now = Math.floor(Date.now() / 1000) - (options.externalCount ? 300 : 10);
    const historyStep = options.externalCount ? 60 : 1;
    const localPost = sign({ kind: 1, created_at: now, tags: [], content: "Citrine local fixture" });
    const externalPost = sign({ kind: 1, created_at: now - 1, tags: [], content: "External history fixture" });
    const relayList = sign({ kind: 10002, created_at: now, tags: [["r", externalUrl]], content: "" });
    const localCorpus = options.localCount ? Array.from({ length: options.localCount }, (_, i) =>
        sign({ kind: 1, created_at: now - i * historyStep, tags: [], content: `Local pagination ${i}` })) : [localPost];
    const externalCorpus = options.externalCount ? [
        ...(options.localCount ? localCorpus.slice(0, options.externalCount) : Array.from({ length: options.externalCount }, (_, i) =>
            sign({ kind: 1, created_at: now - i * historyStep, tags: [], content: `External pagination ${i}` }))), relayList,
    ] : [externalPost, relayList];
    const localRequests: Filter[] = [], externalRequests: Filter[] = [];
    const localWrites: ReturnType<typeof sign>[] = [], externalWrites: ReturnType<typeof sign>[] = [];
    let externalRead = options.externalRead ?? "accept";
    const heldExternal: Array<() => void> = [];
    const server = new WebSocketServer({ host: "127.0.0.1", port: 0 });
    await new Promise<void>((resolve) => server.once("listening", resolve));
    const localUrl = `ws://127.0.0.1:${(server.address() as AddressInfo).port}/`;
    let stopped = false;
    server.on("connection", (socket) => {
        // Citrine v3.2.0 announces AUTH immediately, even for localhost REQ/EVENT without authentication.
        socket.send(JSON.stringify(["AUTH", "fixture-initial-challenge"]));
        socket.on("message", (raw) => {
        const message = JSON.parse(raw.toString());
        if (message[0] === "AUTH") throw new Error("local AUTH is outside scope");
        if (message[0] === "REQ") {
            localRequests.push(...message.slice(2));
            if (options.localMode === "auth") {
                socket.send(JSON.stringify(["CLOSED", message[1], "auth-required: fixture"])); return;
            }
            for (const filter of message.slice(2) as Filter[]) {
                localCorpus.filter(event => matchFilter(filter, event)).sort((a, b) => b.created_at - a.created_at)
                    .slice(0, filter.limit).forEach(event => socket.send(JSON.stringify(["EVENT", message[1], event])));
            }
            socket.send(JSON.stringify(["EOSE", message[1]]));
        }
        if (message[0] === "EVENT") {
            const event = message[1]; localWrites.push(event);
            if (options.localMode === "silent") return;
            const ok = (options.localMode ?? "accept") === "accept";
            if (ok && !localCorpus.some(item => item.id === event.id)) localCorpus.push(event);
            socket.send(JSON.stringify(["OK", event.id, ok, ok ? "" : `${options.localMode === "auth" ? "auth-required" : "restricted"}: fixture`]));
        }
        });
    });
    const stop = async () => {
        if (stopped) return; stopped = true;
        server.clients.forEach(socket => socket.terminate());
        await new Promise<void>((resolve) => server.close(() => resolve()));
    };
    await page.routeWebSocket(/^wss:\/\//, (socket) => socket.onMessage((raw) => {
        const message = JSON.parse(raw.toString());
        if (message[0] === "REQ") {
            externalRequests.push(...message.slice(2));
            const respond = () => {
            for (const filter of message.slice(2) as Filter[]) externalCorpus.filter(event => matchFilter(filter, event))
                .sort((a, b) => b.created_at - a.created_at).slice(0, filter.limit)
                .forEach(event => socket.send(JSON.stringify(["EVENT", message[1], event])));
            socket.send(JSON.stringify(["EOSE", message[1]]));
            };
            if (message.slice(2).some((filter: Filter) => filter.kinds?.includes(1))) {
                if (externalRead === "closed") { socket.send(JSON.stringify(["CLOSED", message[1], "error: fixture unavailable"])); return; }
                if (externalRead === "silent" || (externalRead === "hold-older"
                    && message.slice(2).some((filter: Filter) => filter.kinds?.includes(1) && filter.limit === 150 && filter.until !== undefined))) {
                    heldExternal.push(respond); return;
                }
            }
            respond();
        }
        if (message[0] === "EVENT") {
            externalWrites.push(message[1]);
            socket.send(JSON.stringify(["OK", message[1].id, options.externalOk ?? true, "fixture"]));
        }
    }));
    await page.route("https://**/*", async route => {
        if (route.request().url().startsWith("https://127.0.0.1:")) await route.continue();
        else await route.fulfill({ contentType: "application/json", body: "{}" });
    });
    await page.exposeFunction("fixtureSignEvent", sign);
    await page.addInitScript(({ pubkey, externalUrl }) => {
        localStorage.setItem("firstVisit", "1");
        localStorage.setItem("locale", "ja");
        localStorage.setItem("nostr-accounts", JSON.stringify([{ pubkeyHex: pubkey, type: "nip07", addedAt: 1 }]));
        localStorage.setItem("nostr-active-account", pubkey);
        localStorage.setItem(`nostr-relays-${pubkey}`, JSON.stringify({ [externalUrl]: { read: true, write: true } }));
        (window as any).nostr = { getPublicKey: async () => pubkey,
            signEvent: (event: EventTemplate) => (window as any).fixtureSignEvent(event) };
    }, { pubkey, externalUrl });
    await page.goto("./");
    await expect(page.locator(".post-history-btn")).toBeVisible();
    return { pubkey, sign, now, localUrl, localPost, externalPost, localCorpus, externalCorpus,
        localRequests, externalRequests, localWrites, externalWrites, stop,
        setExternalRead: (mode: typeof externalRead) => { externalRead = mode; },
        releaseExternal: () => { heldExternal.splice(0).forEach(respond => respond()); } };
}

async function setUrl(page: Page, url: string) {
    await page.locator(".settings-btn").click();
    await page.getByLabel("ローカルリレーURL", { exact: true }).fill(url);
    await page.getByRole("button", { name: "設定を保存", exact: true }).click();
    await expect.poll(() => page.evaluate(() => localStorage.getItem("localRelayUrl"))).toBe(url);
    await page.keyboard.press("Escape");
}

async function posts(page: Page): Promise<Array<{ eventId: string; acceptedRelays: string[]; fetchedRelays?: string[]; relayHints: string[] }>> {
    return page.evaluate(() => new Promise((resolve, reject) => {
        const open = indexedDB.open("eHagakiDB");
        open.onerror = () => reject(open.error);
        open.onsuccess = () => {
            const db = open.result, read = db.transaction("postHistory").objectStore("postHistory").getAll();
            read.onsuccess = () => { resolve(read.result); db.close(); };
            read.onerror = () => { reject(read.error); db.close(); };
        };
    }));
}

async function historyMeta(page: Page): Promise<Array<{ key: string; value: any }>> {
    return page.evaluate(() => new Promise((resolve, reject) => {
        const open = indexedDB.open("eHagakiDB"); open.onerror = () => reject(open.error);
        open.onsuccess = () => {
            const db = open.result, read = db.transaction("meta").objectStore("meta").getAll();
            read.onsuccess = () => { resolve(read.result); db.close(); }; read.onerror = () => { reject(read.error); db.close(); };
        };
    }));
}

const relayOlder = (page: Page) => page.getByRole("button", { name: "リレーから続きを取得", exact: true });
async function returnToLatest(page: Page, firstContent: string) {
    await page.locator(".post-history-latest-button").click();
    await expect(page.getByText(firstContent, { exact: true })).toBeVisible();
    await expect.poll(() => page.locator(".post-history-container").evaluate(el => el.scrollTop)).toBe(0);
    // Observe the button's normal viewport reset before beginning the next gesture.
    await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
}
async function browseSavedThrough(page: Page, corpus: Array<{ id: string }>, end: number) {
    const order = new Map(corpus.map((event, index) => [event.id, index]));
    for (let step = 0; step < Math.ceil(corpus.length / 50) + 2; step++) {
        const ids = await page.locator(".post-history-item").evaluateAll(nodes => nodes.map(node => node.getAttribute("data-post-history-event-id")!));
        const oldest = Math.max(...ids.map(id => order.get(id) ?? -1));
        expect(ids.length).toBeLessThanOrEqual(150); expect(new Set(ids).size).toBe(ids.length);
        if (oldest >= end) {
            await expect(page.locator(`[data-post-history-event-id="${corpus[end].id}"]`)).toBeAttached(); return;
        }
        // Repeat a real approach to the bottom if an anchor-preserving commit was still in flight.
        await expect.poll(async () => {
            await page.locator(".post-history-container").evaluate(el => {
                el.scrollTop = Math.max(0, el.scrollHeight - el.clientHeight - 200);
                el.dispatchEvent(new Event("scroll", { bubbles: true }));
                el.scrollTop = el.scrollHeight; el.dispatchEvent(new Event("scroll", { bubbles: true }));
            });
            return page.locator(`[data-post-history-event-id="${corpus[oldest + 1].id}"]`).count();
        }).toBe(1);
        // The true frontier may now be in the window, but no earlier boundary may block this step.
        const nextIds = await page.locator(".post-history-item").evaluateAll(nodes => nodes.map(node => node.getAttribute("data-post-history-event-id")!));
        if (Math.max(...nextIds.map(id => order.get(id) ?? -1)) < end) await expect(relayOlder(page)).toHaveCount(0);
    }
    throw new Error("Saved history did not reach its established frontier");
}

test("external-only saved coverage survives reload and the next older REQ advances", async ({ page }) => {
    const f = await fixture(page, { externalCount: 650 });
    try {
        expect(await page.evaluate(() => localStorage.getItem("localRelayUrl"))).toBeFalsy();
        const corpus = f.externalCorpus.filter(event => event.kind === 1);
        await page.locator(".post-history-btn").click(); await expect(page.getByText("External pagination 49", { exact: true })).toBeVisible();
        await browseSavedThrough(page, corpus, 148); await expect(relayOlder(page)).toBeEnabled();
        await relayOlder(page).click(); await expect.poll(async () => (await posts(page)).length).toBe(299);
        await browseSavedThrough(page, corpus, 297);
        const older = () => f.externalRequests.filter(filter => filter.kinds?.includes(1) && filter.until !== undefined && filter.limit === 150);
        const first = older().at(-1)!; expect(first.until).toBe(f.now - 149 * 60);
        const coverageBefore = (await historyMeta(page)).find(row => row.key.startsWith("postHistoryRelayCoverage:"))!.value;
        await page.reload(); await page.locator(".post-history-btn").click();
        await expect(page.getByText("External pagination 49", { exact: true })).toBeVisible();
        await browseSavedThrough(page, corpus, 297); expect(older()).toHaveLength(1);
        expect(await posts(page)).toHaveLength(299);
        const coverageAfter = (await historyMeta(page)).find(row => row.key.startsWith("postHistoryRelayCoverage:"))!.value;
        expect(coverageAfter.relays[0].ranges[0].since).toBe(coverageBefore.relays[0].ranges[0].since);
        await expect(relayOlder(page)).toBeEnabled(); await relayOlder(page).click();
        await expect.poll(() => older().length).toBe(2);
        expect(older()[1].until).toBeLessThan(first.until!); expect(older()[1].since).toBeLessThan(first.since!);
        expect(f.localRequests).toHaveLength(0);
    } finally { await f.stop(); }
});

for (const restart of ["reopen", "reload"] as const) {
    test(`local-first saved browsing survives ${restart} while external older is pending`, async ({ page }) => {
        const f = await fixture(page, { localCount: 650, externalCount: 650, externalRead: "hold-older" });
        try {
            await setUrl(page, f.localUrl); await page.locator(".post-history-btn").click();
            await expect(page.getByText("Local pagination 49", { exact: true })).toBeVisible();
            await browseSavedThrough(page, f.localCorpus, 148); await expect(relayOlder(page)).toBeEnabled(); await relayOlder(page).click();
            await expect.poll(async () => (await posts(page)).length).toBe(299); await browseSavedThrough(page, f.localCorpus, 297);
            const before = (await historyMeta(page)).find(row => row.key.startsWith("postHistoryLocalBrowsingRanges:"))!.value;
            const authoredOlder = () => f.localRequests.filter(filter => filter.kinds?.includes(1) && filter.until !== undefined && filter.limit === 150);
            const externalBefore = (await historyMeta(page)).find(row => row.key.startsWith("postHistoryRelayCoverage:"))!.value;
            expect(before.browsingRanges[0].since).toBeLessThan(externalBefore.relays[0].ranges[0].since);
            await returnToLatest(page, "Local pagination 0");
            // Latest navigation must keep the same committed browsing frontier.
            await browseSavedThrough(page, f.localCorpus, 297); expect(authoredOlder()).toHaveLength(1);
            await returnToLatest(page, "Local pagination 0");
            await f.stop(); // Restoring browsing cannot depend on a new successful local connection.
            if (restart === "reload") await page.reload(); else await page.keyboard.press("Escape");
            await page.locator(".post-history-btn").click(); await expect(page.getByText("Local pagination 49", { exact: true })).toBeVisible();
            await browseSavedThrough(page, f.localCorpus, 297); expect(authoredOlder()).toHaveLength(1);
            const after = (await historyMeta(page)).find(row => row.key.startsWith("postHistoryLocalBrowsingRanges:"))!.value;
            expect(after).toEqual(before);
            const externalAfter = (await historyMeta(page)).find(row => row.key.startsWith("postHistoryRelayCoverage:"))!.value;
            expect(externalAfter.relays[0].ranges[0].since).toBe(externalBefore.relays[0].ranges[0].since);
        } finally { await f.stop(); }
    });

    test(`a drained local continuation rechecks later older additions after ${restart}`, async ({ page }) => {
        const f = await fixture(page, { localCount: 60, externalRead: "closed" });
        try {
            await setUrl(page, f.localUrl); await page.locator(".post-history-btn").click();
            await expect(page.getByText("Local pagination 49", { exact: true })).toBeVisible(); await browseSavedThrough(page, f.localCorpus, 59);
            const record = (await historyMeta(page)).find(row => row.key.startsWith("postHistoryLocalBrowsingRanges:"))!.value;
            const authored = () => f.localRequests.filter(filter => filter.kinds?.includes(1)); const count = authored().length;
            await expect(relayOlder(page)).toBeEnabled(); await relayOlder(page).click(); expect(authored()).toHaveLength(count);
            await returnToLatest(page, "Local pagination 0");
            if (restart === "reload") await page.reload(); else await page.keyboard.press("Escape");
            f.localCorpus.push(...Array.from({ length: 25 }, (_, i) => f.sign({ kind: 1, created_at: f.now - 60 - i, tags: [], content: `Later older ${i}` })));
            await page.locator(".post-history-btn").click(); await expect(page.getByText("Local pagination 49", { exact: true })).toBeVisible();
            await browseSavedThrough(page, f.localCorpus, 59); await expect(relayOlder(page)).toBeEnabled(); await relayOlder(page).click();
            await expect(page.getByText("Later older 0", { exact: true })).toBeVisible(); await browseSavedThrough(page, f.localCorpus, 84);
            expect(await posts(page)).toHaveLength(85);
            const after = (await historyMeta(page)).find(row => row.key.startsWith("postHistoryLocalBrowsingRanges:"))!.value;
            expect(after.browsingRanges[0].since).toBeLessThan(record.browsingRanges[0].since);
            expect(after.browsingRanges[0].until).toBeGreaterThanOrEqual(record.browsingRanges[0].until);
            expect(authored().at(-1)?.until).toBe(record.resumeHint.nextUntil);
        } finally { await f.stop(); }
    });
}

test("HTTPS tab uses the real loopback socket, merges history, keeps external refresh and survives a stopped relay", async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 360, height: 844 });
    const f = await fixture(page);
    try {
        expect(f.localRequests).toHaveLength(0);
        await setUrl(page, f.localUrl);
        expect(f.localRequests).toHaveLength(0); // Saving is syntax-only, not a connection check.
        await page.locator(".settings-btn").click();
        const input = page.getByLabel("ローカルリレーURL", { exact: true });
        await input.fill("https://localhost/invalid");
        await page.getByRole("button", { name: "設定を保存", exact: true }).click();
        await expect(input).toHaveAttribute("aria-invalid", "true");
        expect(await page.evaluate(() => localStorage.getItem("localRelayUrl"))).toBe(f.localUrl);
        await input.scrollIntoViewIfNeeded();
        const bounds = (await input.boundingBox())!;
        expect(bounds.x).toBeGreaterThanOrEqual(0); expect(bounds.x + bounds.width).toBeLessThanOrEqual(360);
        expect(bounds.height).toBeGreaterThanOrEqual(44);
        await page.screenshot({ path: testInfo.outputPath("local-relay-settings-360.png") });
        await page.keyboard.press("Escape");
        await page.reload();
        await expect(page.locator(".post-history-btn")).toBeVisible();
        expect(await page.evaluate(() => localStorage.getItem("localRelayUrl"))).toBe(f.localUrl);
        await page.locator(".post-history-btn").click();
        await expect(page.getByText(f.localPost.content, { exact: true })).toBeVisible();
        await expect(page.getByText(f.externalPost.content, { exact: true })).toBeVisible();
        await expect.poll(() => f.localWrites.some(event => event.id === f.externalPost.id)).toBe(true);
        expect(f.externalRequests.some(filter => filter.kinds?.includes(1))).toBe(true);
        await expect(page.locator(".post-history-heading-refetch-button")).toBeEnabled();
        const localCount = f.localRequests.length;
        await page.locator(".post-history-heading-refetch-button").click();
        await expect.poll(() => f.localRequests.length).toBeGreaterThan(localCount);
        await expect.poll(async () => (await posts(page)).length).toBe(2);
        expect(new Set((await posts(page)).map(post => post.eventId)).size).toBe(2);
        for (const post of await posts(page)) expect([...post.acceptedRelays, ...post.relayHints, ...(post.fetchedRelays ?? [])]).not.toContain(f.localUrl);
        expect(f.externalWrites.some(event => event.kind === 10002)).toBe(false);
        const older = page.getByRole("button", { name: "リレーから続きを取得", exact: true });
        await expect(older).toBeEnabled();
        const authoredRequests = f.localRequests.filter(filter => filter.kinds?.includes(1)).length;
        const externalBeforeOlder = f.externalRequests.filter(filter => filter.kinds?.includes(1)).length;
        await older.click();
        await expect.poll(() => f.externalRequests.filter(filter => filter.kinds?.includes(1)).length).toBeGreaterThan(externalBeforeOlder);
        expect(f.localRequests.filter(filter => filter.kinds?.includes(1))).toHaveLength(authoredRequests);
        await f.stop();
        const newPost = f.sign({ kind: 1, created_at: f.now - 2, tags: [], content: "External after Citrine stops" });
        f.externalCorpus.push(newPost);
        await expect(page.locator(".post-history-heading-refetch-button")).toBeEnabled();
        await page.locator(".post-history-heading-refetch-button").click();
        await expect.poll(async () => (await posts(page)).some(post => post.eventId === newPost.id)).toBe(true);
        await page.keyboard.press("Escape");
        await page.locator(".tiptap-editor").fill("Post while Citrine is stopped");
        await page.getByRole("button", { name: "投稿", exact: true }).click();
        await expect.poll(() => f.externalWrites.some(event => event.content === "Post while Citrine is stopped")).toBe(true);
        const event = f.externalWrites.find(event => event.content === "Post while Citrine is stopped")!;
        await expect.poll(async () => (await posts(page)).some(post => post.eventId === event.id)).toBe(true);
        await page.locator(".settings-btn").click();
        await page.getByRole("button", { name: "設定を解除", exact: true }).click();
        expect(await page.evaluate(() => localStorage.getItem("localRelayUrl"))).toBeNull();
    } finally { await f.stop(); }
});

for (const [externalOk, localMode] of [[true, "accept"], [true, "reject"], [true, "auth"], [true, "silent"], [false, "accept"], [false, "reject"]] as const) {
    test(`external=${externalOk}, local=${localMode} preserves delivery success and exact signed event`, async ({ page }) => {
        const f = await fixture(page, { externalOk, localMode });
        try {
            await setUrl(page, f.localUrl);
            if (externalOk && localMode === "auth") {
                await page.locator(".post-history-btn").click();
                await expect(page.getByText(f.externalPost.content, { exact: true })).toBeVisible();
                expect((await posts(page)).some(post => post.eventId === f.localPost.id)).toBe(false);
                expect(f.externalRequests.some(filter => filter.kinds?.includes(1))).toBe(true);
                await page.keyboard.press("Escape");
            }
            const content = "Signed browser fixture";
            await page.locator(".tiptap-editor").fill(content);
            await page.getByRole("button", { name: "投稿", exact: true }).click();
            await expect.poll(() => f.externalWrites.filter(event => event.content === content).length).toBe(1);
            const external = f.externalWrites.find(event => event.content === content)!;
            expect(verifyEvent(external)).toBe(true);
            if (externalOk) {
                await expect.poll(() => f.localWrites.filter(event => event.content === content).length).toBe(1);
                expect(f.localWrites.find(event => event.id === external.id)).toEqual(JSON.parse(JSON.stringify(external)));
                await expect.poll(async () => (await posts(page)).some(post => post.eventId === external.id)).toBe(true);
            }
            else {
                await expect(page.getByRole("button", { name: "投稿", exact: true })).toBeEnabled();
                expect((await posts(page)).some(post => post.eventId === external.id)).toBe(false);
                await expect(page.locator(".tiptap-editor")).toContainText(content);
                expect(f.localWrites).toHaveLength(0);
            }
            expect(external.tags.flat().includes(f.localUrl)).toBe(false);
        } finally { await f.stop(); }
    });
}

for (const externalRead of ["closed", "silent"] as const) {
    test(`local-only pagination restores and browses 360 posts while external is ${externalRead}`, async ({ page }) => {
        await page.setViewportSize({ width: 360, height: 844 });
        const f = await fixture(page, { localCount: 360, externalRead });
        try {
            await setUrl(page, f.localUrl);
            await page.locator(".post-history-btn").click();
            await expect(page.getByText("Local pagination 49", { exact: true })).toBeVisible();
            // Use the real clear action, including its DB revision, before restoring.
            await page.getByRole("button", { name: "投稿履歴メニューを開く" }).click();
            await page.getByRole("menuitem", { name: "保存済み投稿履歴をクリア" }).click();
            await page.getByRole("button", { name: "クリアする", exact: true }).click();
            await expect(page.getByRole("alertdialog", { name: "保存済み投稿履歴をクリア", exact: true })).toHaveCount(0);
            await expect.poll(async () => (await posts(page)).length).toBe(0);
            await page.keyboard.press("Escape");
            await page.locator(".post-history-btn").click();
            await expect(page.getByText("Local pagination 49", { exact: true })).toBeVisible();
            const seen = new Set<string>();
            const authored = () => f.localRequests.filter(filter => filter.kinds?.includes(1));
            let oldest = -1;
            for (let i = 0; i < 15 && oldest < 359; i++) {
                const ids = await page.locator(".post-history-item").evaluateAll(nodes => nodes.map(node => node.getAttribute("data-post-history-event-id")!));
                ids.forEach(id => seen.add(id));
                expect(ids.length).toBeLessThanOrEqual(150); expect(new Set(ids).size).toBe(ids.length);
                const texts = await page.locator(".post-history-item").allTextContents();
                oldest = Math.max(...texts.flatMap(text => [...text.matchAll(/Local pagination (\d+)/g)].map(match => Number(match[1]))));
                if (oldest === 359) break;
                // Contiguous browsing uses the existing IntersectionObserver,
                // rather than a manual "show older" button, in Chromium.
                await page.locator(".post-history-container").evaluate(element => { element.scrollTop = element.scrollHeight; });
                const localOlder = page.getByRole("button", { name: "さらに古い投稿を表示", exact: true });
                const relayOlder = page.getByRole("button", { name: "リレーから続きを取得", exact: true });
                await expect.poll(async () => (await page.getByText(`Local pagination ${oldest + 1}`, { exact: true }).count())
                    || (await relayOlder.count()) || (await localOlder.count())).toBeGreaterThan(0);
                if (!await page.getByText(`Local pagination ${oldest + 1}`, { exact: true }).count()) {
                    const action = await localOlder.count() ? localOlder : relayOlder;
                    await expect(action).toBeEnabled(); await action.click();
                }
                await expect(page.getByText(`Local pagination ${oldest + 1}`, { exact: true })).toBeVisible();
            }
            expect(oldest).toBe(359); expect(seen.size).toBe(360);
            expect(await posts(page)).toHaveLength(360);
            const untils = authored().flatMap(filter => filter.until === undefined ? [] : [filter.until]);
            expect(untils).toHaveLength(2);
            expect(untils[1]).toBeLessThan(untils[0]);
            for (const post of await posts(page)) expect([...post.acceptedRelays, ...post.relayHints, ...(post.fetchedRelays ?? [])]).not.toContain(f.localUrl);
            expect(f.externalRequests.some(filter => filter.kinds?.includes(1))).toBe(true);
            const count = authored().length;
            if (externalRead === "silent") {
                // A late bootstrap peer may adopt rows but must retain the older window.
                f.releaseExternal();
                await expect.poll(async () => (await posts(page)).some(post => post.eventId === f.externalPost.id)).toBe(true);
                await expect(page.getByText("Local pagination 359", { exact: true })).toBeVisible();
            }
            const relayOlder = page.getByRole("button", { name: "リレーから続きを取得", exact: true });
            if (await relayOlder.count()) {
                const before = f.externalRequests.filter(filter => filter.kinds?.includes(1)).length;
                await expect(relayOlder).toBeEnabled(); await relayOlder.click();
                await expect.poll(() => f.externalRequests.filter(filter => filter.kinds?.includes(1)).length).toBeGreaterThan(before);
                expect(f.externalRequests.filter(filter => filter.kinds?.includes(1)).at(-1)?.until).toBe(f.now - 49);
            }
            expect(authored()).toHaveLength(count); // Exhausted local continuation never starts again.
        } finally { await f.stop(); }
    });
}

test("non-advancing saturated second stops local continuation without certifying that second", async ({ page }) => {
    const f = await fixture(page, { localCount: 151, externalRead: "closed" });
    try {
        // Latest50 has a completed range; older boundary contains >limit at one second.
        f.localCorpus.splice(50);
        f.localCorpus.push(...Array.from({ length: 160 }, (_, i) => f.sign({ kind: 1,
            created_at: f.now - 50, tags: [], content: `Dense unresolved ${i}` })));
        await setUrl(page, f.localUrl); await page.locator(".post-history-btn").click();
        await expect(page.getByText("Local pagination 49", { exact: true })).toBeVisible();
        await expect(page.getByText("リレーと同期中...", { exact: true })).toHaveCount(0);
        const button = page.getByRole("button", { name: "リレーから続きを取得", exact: true });
        const authored = () => f.localRequests.filter(filter => filter.kinds?.includes(1));
        await expect(button).toBeEnabled(); await button.click();
        await expect.poll(() => authored().length).toBe(2);
        await expect(button).toBeEnabled(); await button.click();
        await expect.poll(() => f.externalRequests.filter(filter => filter.kinds?.includes(1)).length).toBeGreaterThan(1);
        expect(authored()).toHaveLength(2);
        expect(await page.locator(".post-history-item").allTextContents()).not.toEqual(expect.arrayContaining([expect.stringContaining("Dense unresolved")]));
        expect(await page.locator(".post-history-item").count()).toBe(50);
        await expect(button).toBeEnabled(); await button.click(); expect(authored()).toHaveLength(2);
        const record = (await historyMeta(page)).find(row => row.key.startsWith("postHistoryLocalBrowsingRanges:"))!.value;
        expect(record.browsingRanges[0].since).toBe(f.now - 49);
        expect(record.resumeHint.nextUntil).toBe(f.now - 50);
        await page.keyboard.press("Escape"); await page.locator(".post-history-btn").click();
        await expect(page.getByText("Local pagination 49", { exact: true })).toBeVisible();
        await expect.poll(() => authored().some(filter => filter.limit === 30)).toBe(true);
        await expect(page.getByText("リレーと同期中...", { exact: true })).toHaveCount(0);
        const olderBounds = () => authored().filter(filter => filter.until === f.now - 50 && filter.limit === 150);
        await expect(button).toBeEnabled(); await button.click(); await expect.poll(() => olderBounds().length).toBe(2);
        for (let i = 0; i < 2; i++) { await expect(button).toBeEnabled(); await button.click(); }
        expect(olderBounds()).toHaveLength(2); // One finite recheck per new session, then the existing guard stops again.
        expect((await historyMeta(page)).find(row => row.key.startsWith("postHistoryLocalBrowsingRanges:"))!.value.browsingRanges[0].since).toBe(f.now - 49);
    } finally { await f.stop(); }
});

test("external pagination continues when the configured local relay rejects reads", async ({ page }) => {
    const f = await fixture(page, { localCount: 360, localMode: "auth" });
    try {
        f.externalCorpus.push(...f.localCorpus);
        await setUrl(page, f.localUrl); await page.locator(".post-history-btn").click();
        await expect(page.getByText("Local pagination 0", { exact: true })).toBeVisible();
        const button = page.getByRole("button", { name: "リレーから続きを取得", exact: true });
        let oldest = 0;
        for (let i = 0; i < 5; i++) {
            const texts = await page.locator(".post-history-item").allTextContents();
            oldest = Math.max(...texts.flatMap(text => [...text.matchAll(/Local pagination (\d+)/g)].map(match => Number(match[1]))));
            await page.locator(".post-history-container").evaluate(element => { element.scrollTop = element.scrollHeight; });
            const next = page.getByText(`Local pagination ${oldest + 1}`, { exact: true });
            await expect.poll(async () => (await next.count()) || (await button.count())).toBeGreaterThan(0);
            if (!await next.count()) break;
        }
        await expect(button).toBeEnabled(); await button.click();
        await expect.poll(async () => (await posts(page)).length).toBeGreaterThan(150);
        await expect(page.getByText(`Local pagination ${oldest + 1}`, { exact: true })).toBeVisible();
        expect(f.externalRequests.some(filter => filter.kinds?.includes(1) && filter.since !== undefined)).toBe(true);
    } finally { await f.stop(); }
});

test("a history clear in another tab invalidates live local continuity and cursor", async ({ page, context }) => {
    const f = await fixture(page, { localCount: 360, externalRead: "closed" });
    const other = await context.newPage();
    try {
        await other.routeWebSocket(/^wss:\/\//, socket => socket.onMessage(raw => {
            const message = JSON.parse(raw.toString());
            if (message[0] === "REQ") socket.send(JSON.stringify(["EOSE", message[1]]));
        }));
        await other.route("https://**/*", async route => {
            if (route.request().url().startsWith("https://127.0.0.1:")) await route.continue();
            else await route.fulfill({ contentType: "application/json", body: "{}" });
        });
        await setUrl(page, f.localUrl); await page.locator(".post-history-btn").click();
        await expect(page.getByText("Local pagination 49", { exact: true })).toBeVisible();
        await page.locator(".post-history-container").evaluate(element => { element.scrollTop = element.scrollHeight; });
        await expect(page.getByText("Local pagination 99", { exact: true })).toBeVisible();
        await other.goto(new URL("./", page.url()).href);
        await other.evaluate(async owner => {
            const moduleUrl = new URL("src/lib/storage/postHistoryRepository.ts", location.href).href;
            const { postHistoryRepository } = await import(/* @vite-ignore */ moduleUrl);
            await postHistoryRepository.deleteLocalHistoryForPubkey(owner);
        }, f.pubkey);
        await expect.poll(async () => (await posts(page)).length).toBe(0);
        const button = page.getByRole("button", { name: "リレーから続きを取得", exact: true });
        await expect(button).toBeEnabled();
        const before = f.localRequests.filter(filter => filter.kinds?.includes(1)).length;
        await button.click();
        await expect.poll(() => f.localRequests.filter(filter => filter.kinds?.includes(1)).length).toBe(before + 1);
        expect(f.localRequests.filter(filter => filter.kinds?.includes(1)).at(-1)?.until).toBeUndefined();
        await expect.poll(async () => (await posts(page)).length).toBe(150);
    } finally { await other.close(); await f.stop(); }
});
