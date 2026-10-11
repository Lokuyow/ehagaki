import { expect, test, type Page } from "@playwright/test";
import { finalizeEvent, generateSecretKey, getPublicKey, matchFilter, verifyEvent, type Filter, type EventTemplate } from "nostr-tools";
import { WebSocketServer } from "ws";
import type { AddressInfo } from "node:net";

test.use({ trace: "off" });
const externalUrl = "wss://external.example/";

async function fixture(page: Page, options: { externalOk?: boolean; localMode?: "accept" | "reject" | "auth" | "silent" } = {}) {
    const secret = generateSecretKey(), pubkey = getPublicKey(secret);
    const sign = (template: EventTemplate) => finalizeEvent(template, secret);
    const now = Math.floor(Date.now() / 1000) - 10;
    const localPost = sign({ kind: 1, created_at: now, tags: [], content: "Citrine local fixture" });
    const externalPost = sign({ kind: 1, created_at: now - 1, tags: [], content: "External history fixture" });
    const relayList = sign({ kind: 10002, created_at: now, tags: [["r", externalUrl]], content: "" });
    const localCorpus = [localPost];
    const externalCorpus = [externalPost, relayList];
    const localRequests: Filter[] = [], externalRequests: Filter[] = [];
    const localWrites: ReturnType<typeof sign>[] = [], externalWrites: ReturnType<typeof sign>[] = [];
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
            for (const filter of message.slice(2) as Filter[]) externalCorpus.filter(event => matchFilter(filter, event))
                .forEach(event => socket.send(JSON.stringify(["EVENT", message[1], event])));
            socket.send(JSON.stringify(["EOSE", message[1]]));
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
        localRequests, externalRequests, localWrites, externalWrites, stop };
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
        await older.click();
        await expect.poll(() => f.localRequests.filter(filter => filter.kinds?.includes(1)).length).toBeGreaterThan(authoredRequests);
        expect(f.localRequests.filter(filter => filter.kinds?.includes(1)).at(-1)).toMatchObject({ limit: 150 });
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
