import { expect, test } from "@playwright/test";
import { finalizeEvent, generateSecretKey, getPublicKey, verifyEvent, type EventTemplate } from "nostr-tools";

test.use({ trace: "off" });
for (const lang of ["ja", "en"] as const) {
    for (const phase of ["preparation", "response"] as const) {
        test(`keeps both lists when another relay stalls during ${phase} (${lang})`, async ({ page, baseURL }) => {
            const key = generateSecretKey(), owner = getPublicKey(key);
            await page.clock.install();
            await page.exposeFunction("fixtureSignUploadEvent", (template: EventTemplate) => finalizeEvent(template, key));
            await page.route("https://relay.example/", route => route.fulfill({ json: {} }));
            let releaseInfo: (() => Promise<void>) | undefined;
            await page.route("https://unavailable.example/", async route => {
                if (phase === "response") { await route.fulfill({ json: {} }); return; }
                await new Promise<void>(resolve => { releaseInfo = async () => { await route.fulfill({ json: {} }); resolve(); }; });
            });
            await page.route("**/.well-known/nostr/nip96.json", route => route.fulfill({ json: { api_url: "https://new-files.example/api" } }));
            const unavailableRequests: number[] = [];
            await page.routeWebSocket("wss://unavailable.example/**", socket => socket.onMessage(raw => {
                const message = JSON.parse(raw.toString());
                if (message[0] !== "REQ") return;
                const kind = message[2].kinds[0];
                unavailableRequests.push(kind);
                // An unverified newer event must never replace the healthy relay's list.
                const event = finalizeEvent({ kind, created_at: 200, content: "", tags: [["server", "https://invalid.example"]] }, key);
                socket.send(JSON.stringify(["EVENT", message[1], { ...event, sig: "0".repeat(128) }]));
                // No EOSE: this relay remains incomplete.
            }));
            await page.routeWebSocket("wss://relay.example/**", socket => socket.onMessage(raw => {
                const message = JSON.parse(raw.toString());
                if (message[0] !== "REQ") return;
                const kind = message[2].kinds[0];
                socket.send(JSON.stringify(["EVENT", message[1], finalizeEvent({ kind, created_at: 100, content: "",
                    tags: [["server", kind === 10063 ? "https://new-blossom.example" : "https://new-files.example"]],
                }, key)]));
                socket.send(JSON.stringify(["EOSE", message[1]]));
            }));
            await page.setViewportSize({ width: 360, height: 1000 });
            await page.goto(new URL(`upload-relay-sync-playwright.html?owner=${owner}&lang=${lang}&initial=1&cold=1&unavailable=1`, baseURL).href);
            await page.getByRole("button", { name: lang === "ja" ? "管理" : "Manage", exact: true }).click();
            await page.getByRole("button", { name: lang === "ja" ? "リレーから取得" : "Fetch from relays", exact: true }).click();
            await expect.poll(() => page.evaluate(() => window.uploadRelayVerifiedPreferenceCount())).toBe(2);
            if (phase === "preparation") await expect.poll(() => releaseInfo !== undefined).toBe(true);
            else await expect.poll(() => unavailableRequests.length).toBe(2);
            await page.clock.runFor(phase === "preparation" ? 10_000 : 4_000);
            const status = page.getByRole("status");
            await expect(status).toContainText(lang === "ja" ? "リレー同期に成功しました" : "Relay synchronization succeeded");
            await expect(status).toContainText(lang === "ja" ? "Blossom: 成功" : "Blossom: Succeeded");
            await expect(status).toContainText(lang === "ja" ? "NIP-96: 成功" : "NIP-96: Succeeded");
            await expect(status).not.toContainText(lang === "ja" ? "一部リレーは未完了" : "Some relays did not finish");
            const snapshot = await page.evaluate(() => window.uploadRelaySnapshot());
            expect(snapshot.filter(d => ["blossom", "nip96"].includes(d.protocol)).map(d => d.serverUrl).sort())
                .toEqual(["https://new-blossom.example", "https://new-files.example"]);
            expect(snapshot.filter(d => d.isDefault)).toHaveLength(1);
            await expect(page.getByRole("button", { name: lang === "ja" ? "リレーへ送信" : "Publish to relays", exact: true })).toBeEnabled();
            if (releaseInfo) {
                await releaseInfo();
                expect(unavailableRequests).toEqual([]);
                expect(await page.evaluate(() => window.uploadRelaySnapshot())).toEqual(snapshot);
            }
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        });
    }
}
test("fetches both lists on the first attempt after a cold NIP-42 handshake", async ({ page, baseURL }) => {
    const key = generateSecretKey(), owner = getPublicKey(key);
    await page.clock.install();
    await page.exposeFunction("fixtureSignUploadEvent", (template: EventTemplate) => finalizeEvent(template, key));
    await page.route("**/.well-known/nostr/nip96.json", route => route.fulfill({ json: { api_url: "https://yabu.me/api/v2/media" } }));
    let releaseAuth: (() => void) | undefined;
    const requests: number[] = [];
    await page.routeWebSocket("wss://relay.example/**", socket => {
        let authenticated = false;
        let pendingRequests = 0;
        socket.onMessage(raw => {
            const message = JSON.parse(raw.toString());
            if (message[0] === "AUTH") {
                const valid = verifyEvent(message[1]) && message[1].pubkey === owner && message[1].kind === 22242;
                releaseAuth = () => { authenticated = valid; socket.send(JSON.stringify(["OK", message[1].id, valid, ""])); };
            }
            if (message[0] !== "REQ") return;
            const kind = message[2].kinds[0];
            requests.push(kind);
            if (!authenticated) {
                socket.send(JSON.stringify(["CLOSED", message[1], "auth-required: fixture"]));
                if (++pendingRequests === 2) socket.send(JSON.stringify(["AUTH", "fixture-challenge"]));
                return;
            }
            socket.send(JSON.stringify(["EVENT", message[1], finalizeEvent({
                kind, created_at: 100, content: "", tags: [["server", kind === 10063 ? "https://blossom.example" : "https://share.yabu.me"]],
            }, key)]));
            socket.send(JSON.stringify(["EOSE", message[1]]));
        });
    });
    await page.goto(new URL(`upload-relay-sync-playwright.html?owner=${owner}&lang=ja&initial=1&auth=1`, baseURL).href);
    for (const reload of [false, true]) {
        if (reload) {
            releaseAuth = undefined;
            requests.length = 0;
            await page.reload();
        }
        await page.getByRole("button", { name: "管理", exact: true }).click();
        await page.getByRole("button", { name: "リレーから取得", exact: true }).click();
        await expect.poll(() => releaseAuth !== undefined).toBe(true);
        await page.clock.runFor(5_000);
        await expect(page.getByRole("button", { name: "リレー取得中", exact: true })).toBeDisabled();
        releaseAuth!();
        await expect(page.getByRole("status")).toContainText("リレー同期に成功しました");
        expect(requests.sort()).toEqual([10063, 10063, 10096, 10096]);
    }
});
test("fetches from an untouched default after cold NIP-11 initialization", async ({ page, baseURL }) => {
    const key = generateSecretKey(), owner = getPublicKey(key);
    await page.clock.install();
    await page.exposeFunction("fixtureSignUploadEvent", (template: EventTemplate) => finalizeEvent(template, key));
    let releaseInfo!: () => Promise<void>;
    let infoRequested = false;
    const requests: number[] = [];
    await page.route("https://relay.example/", async route => {
        infoRequested = true;
        await new Promise<void>(resolve => { releaseInfo = async () => { await route.fulfill({ json: {} }); resolve(); }; });
    });
    await page.route("**/.well-known/nostr/nip96.json", route => route.fulfill({ json: { api_url: "https://yabu.me/api/v2/media" } }));
    await page.routeWebSocket("wss://relay.example/**", socket => socket.onMessage(raw => {
        const message = JSON.parse(raw.toString());
        if (message[0] !== "REQ") return;
        const kind = message[2].kinds[0];
        requests.push(kind);
        if (kind === 10096) socket.send(JSON.stringify(["EVENT", message[1], finalizeEvent({
            kind, created_at: 100, content: "", tags: [["server", "https://share.yabu.me"]],
        }, key)]));
        socket.send(JSON.stringify(["EOSE", message[1]]));
    }));
    await page.goto(new URL(`upload-relay-sync-playwright.html?owner=${owner}&lang=ja&initial=1&cold=1`, baseURL).href);
    await page.getByRole("button", { name: "管理", exact: true }).click();
    await expect(page.locator(".destination-row")).toHaveCount(1);
    await expect(page.locator(".destination-row")).toContainText("share.yabu.me");
    await expect.poll(() => infoRequested).toBe(true);
    await page.getByRole("button", { name: "リレーから取得", exact: true }).click();
    await page.clock.runFor(5_000);
    expect(requests).toEqual([]);
    await expect(page.getByRole("button", { name: "リレー取得中", exact: true })).toBeDisabled();
    await releaseInfo();
    await expect.poll(() => requests.length).toBe(2);
    await expect(page.getByRole("status")).toContainText("NIP-96: 成功");
    await expect(page.getByRole("status")).toContainText("Blossom: スキップ");
});
for (const lang of ["ja", "en"] as const) {
    for (const surface of ["page", "shadow", "iframe"] as const) {
        test(`upload destination preset and custom form (${lang}, ${surface})`, async ({ page, baseURL }, testInfo) => {
            const owner = getPublicKey(generateSecretKey());
            await page.setViewportSize({ width: surface === "page" ? 360 : 320, height: 1000 });
            const url = new URL(`upload-relay-sync-playwright.html?owner=${owner}&lang=${lang}&surface=${surface}`, baseURL);
            if (surface === "iframe") url.searchParams.set("host", "1");
            await page.goto(url.href);
            const root = surface === "iframe" ? page.frameLocator("iframe") : page;
            await root.getByRole("button", { name: lang === "ja" ? "管理" : "Manage", exact: true }).click();
            await root.getByRole("button", { name: lang === "ja" ? "追加" : "Add", exact: true }).click();
            const preset = root.getByRole("combobox", { name: lang === "ja" ? "プリセット" : "Preset", exact: true });
            const protocol = root.getByRole("combobox", { name: "Protocol", exact: true });
            const input = root.getByLabel("URL", { exact: true });
            const save = root.getByRole("button", { name: lang === "ja" ? "保存" : "Save", exact: true });
            const assertLayout = async () => {
                const layout = await root.locator(".destination-form").evaluate(form => {
                    const rect = form.getBoundingClientRect();
                    const controls = Array.from(form.querySelectorAll('select, input:not([type="checkbox"])'))
                        .map(control => control.getBoundingClientRect());
                    return {
                        fits: rect.left >= 0 && rect.right <= form.ownerDocument.documentElement.clientWidth,
                        controlsFit: controls.every(control => control.left >= rect.left && control.right <= rect.right),
                        noOverlap: controls.every((control, index) => index === 0 || controls[index - 1].bottom <= control.top),
                        noOverflow: form.ownerDocument.documentElement.scrollWidth <= form.ownerDocument.documentElement.clientWidth,
                    };
                });
                expect(layout).toEqual({ fits: true, controlsFit: true, noOverlap: true, noOverflow: true });
                await expect(save).toBeVisible();
            };

            await expect(preset).toHaveValue("blossom-band");
            await expect(input).toHaveCount(0);
            await expect(protocol).toHaveCount(0);
            await expect(save).toBeEnabled();
            expect(await preset.locator("option").evaluateAll(options => options.map(option => (option as HTMLOptionElement).value)))
                .toEqual(["blossom-band", "cdn-nostrcheck-me", "nostr-download", "blossom-primal-net", "nostr-build", "nostrcheck-me", "share-yabu-me", "nostpic-com", "files-sovbit-host", "custom"]);
            await preset.focus();
            await preset.press("Tab");
            await expect(root.getByRole("checkbox", { name: lang === "ja" ? "有効" : "Enabled", exact: true })).toBeFocused();
            await assertLayout();
            if (lang === "ja") await page.screenshot({ path: testInfo.outputPath("upload-preset-form.png"), fullPage: true });

            await preset.selectOption("share-yabu-me");
            await expect(protocol).toHaveCount(0);
            await expect(input).toHaveCount(0);
            await preset.selectOption("custom");
            await expect(protocol).toHaveValue("nip96");
            await expect(input).toHaveValue("");
            await expect(save).toBeDisabled();
            await preset.focus();
            await preset.press("Tab");
            await expect(protocol).toBeFocused();
            await protocol.selectOption("custom-http");
            await input.fill("https://custom.example/upload");
            await assertLayout();
            if (lang === "ja") await page.screenshot({ path: testInfo.outputPath("upload-custom-form.png"), fullPage: true });
            await root.locator(".upload-destination-url-clear-button").click();
            await expect(protocol).toHaveValue("custom-http");
            await expect(input).toBeFocused();

            await preset.selectOption("blossom-band");
            await expect(protocol).toHaveCount(0);
            await save.click();
            const card = root.locator(".destination-row").filter({ hasText: "blossom.band" });
            await card.getByRole("button", { name: lang === "ja" ? "編集" : "Edit", exact: true }).click();
            await expect(preset).toHaveValue("blossom-band");
            await expect(protocol).toHaveCount(0);
            await expect(input).toHaveCount(0);
            await preset.selectOption("custom");
            await expect(preset).toHaveValue("custom");
            await expect(protocol).toHaveValue("blossom");
            await expect(input).toHaveValue("");
            await assertLayout();
        });
    }
}

for (const lang of ["ja", "en"] as const) {
    for (const surface of ["page", "shadow", "iframe"] as const) {
        test(`two-button upload relay sync and partial results (${lang}, ${surface})`, async ({ page, baseURL }, testInfo) => {
            const key = generateSecretKey(), owner = getPublicKey(key);
            const requests: number[] = [];
            const publications: { kind: number; tags: string[][]; verified: boolean }[] = [];
            let uploaded = false;
            let emptyBlossom = false;
            await page.exposeFunction("fixtureSignUploadEvent", (template: EventTemplate) => finalizeEvent(template, key));
            await page.route("**/.well-known/nostr/nip96.json", route => route.fulfill({ json: { api_url: new URL("/api", route.request().url()).href }, headers: { "Access-Control-Allow-Origin": "*" } }));
            await page.route("https://new-files.example/api", async route => {
                const request = route.request();
                if (request.method() === "OPTIONS") {
                    await route.fulfill({ status: 204, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Authorization", "Access-Control-Allow-Methods": "POST" } });
                    return;
                }
                const auth = request.headers().authorization;
                const event = JSON.parse(Buffer.from(auth.slice("Nostr ".length), "base64").toString());
                expect(verifyEvent(event)).toBe(true);
                expect(event.kind).toBe(27235);
                expect(event.tags).toContainEqual(["u", "https://new-files.example/api"]);
                expect(event.tags).toContainEqual(["method", "POST"]);
                expect(request.method()).toBe("POST");
                uploaded = true;
                await route.fulfill({ json: { status: "success", nip94_event: { tags: [["url", "https://new-files.example/fixture.png"]] } }, headers: { "Access-Control-Allow-Origin": "*" } });
            });
            await page.route("https://new-files.example/fixture.png", route => route.fulfill({ status: 200, contentType: "image/png", headers: { "Access-Control-Allow-Origin": "*" } }));
            await page.routeWebSocket("wss://relay.example/**", socket => socket.onMessage(raw => {
                const message = JSON.parse(raw.toString());
                if (message[0] === "REQ") {
                    const kind = message[2].kinds[0];
                    requests.push(kind);
                    if (kind === 10063 && emptyBlossom) {
                        const stale = finalizeEvent({ kind, created_at: 50, content: "", tags: [["server", "https://stale-blossom.example"]] }, key);
                        socket.send(JSON.stringify(["EVENT", message[1], stale]));
                    }
                    const event = finalizeEvent({ kind, created_at: emptyBlossom && kind === 10063 ? 150 : 100, content: "",
                        tags: emptyBlossom && kind === 10063 ? [] : [["server", kind === 10063 ? "https://new-blossom.example" : "https://new-files.example"]] }, key);
                    socket.send(JSON.stringify(["EVENT", message[1], event]));
                    socket.send(JSON.stringify(["EOSE", message[1]]));
                }
                if (message[0] === "EVENT") {
                    const event = message[1];
                    publications.push({ kind: event.kind, tags: event.tags, verified: verifyEvent(event) });
                    socket.send(JSON.stringify(["OK", event.id, event.kind !== 10096, "fixture result"]));
                }
            }));
            const url = new URL(`upload-relay-sync-playwright.html?owner=${owner}&lang=${lang}&surface=${surface}`, baseURL).href;
            await page.setViewportSize({ width: surface === "page" ? 360 : 320, height: 1000 });
            if (surface === "iframe") {
                // The fixture actually runs in a child document at its own origin.
                await page.goto(url + "&host=1");
                await page.frameLocator("iframe").locator("button").first().waitFor();
            } else await page.goto(url);
            const root = surface === "iframe" ? page.frameLocator("iframe") : page;
            await root.getByRole("button", { name: lang === "ja" ? "管理" : "Manage", exact: true }).click();
            const fetchButton = root.getByRole("button", { name: lang === "ja" ? "リレーから取得" : "Fetch from relays", exact: true });
            const publishButton = root.getByRole("button", { name: lang === "ja" ? "リレーへ送信" : "Publish to relays", exact: true });
            await expect(fetchButton).toHaveCount(1);
            await expect(publishButton).toHaveCount(1);
            await fetchButton.click();
            await expect(root.getByRole("status")).toContainText(lang === "ja" ? "リレー同期に成功しました" : "Relay synchronization succeeded");
            expect(requests.sort()).toEqual([10063, 10096]);
            await publishButton.click();
            await expect(root.getByRole("status")).toContainText(lang === "ja" ? "リレー同期は部分成功です" : "Relay synchronization partially succeeded");
            expect(publications).toEqual([
                { kind: 10063, tags: [["server", "https://new-blossom.example"]], verified: true },
                { kind: 10096, tags: [["server", "https://new-files.example"]], verified: true },
            ]);
            await expect(fetchButton).toBeEnabled();
            await expect(publishButton).toBeEnabled();
            const documentRoot = surface === "iframe" ? page.frames().find(frame => frame.parentFrame() === page.mainFrame())! : page;
            const snapshot = await documentRoot.evaluate(() => window.uploadRelaySnapshot());
            expect(snapshot.find(destination => destination.protocol === "nip96")?.nip96UrlMode).toBe("discovery");
            expect(snapshot.find(destination => destination.id === "custom-http")?.serverUrl).toBe("https://files.example/api");
            expect(snapshot.filter(destination => destination.isDefault)).toHaveLength(1);
            const nip96Card = root.locator(".destination-row").filter({ hasText: "new-files.example" });
            await nip96Card.getByRole("button", { name: lang === "ja" ? "編集" : "Edit", exact: true }).click();
            await expect(root.getByLabel("URL", { exact: true })).toHaveValue("https://new-files.example");
            await root.getByRole("button", { name: lang === "ja" ? "保存" : "Save", exact: true }).click();
            await expect(root.getByRole("button", { name: lang === "ja" ? "保存" : "Save", exact: true })).toHaveCount(0);
            const resaved = await documentRoot.evaluate(() => window.uploadRelaySnapshot());
            expect(resaved.find(destination => destination.protocol === "nip96")).toMatchObject({
                serverUrl: "https://new-files.example/", nip96UrlMode: "discovery",
            });
            await nip96Card.getByRole("button", { name: lang === "ja" ? "既定" : "Default", exact: true }).click();
            expect(await documentRoot.evaluate(() => window.uploadRelayFixtureImage())).toBe(true);
            expect(uploaded).toBe(true);
            emptyBlossom = true;
            await fetchButton.click();
            await expect(root.getByRole("status")).toContainText(lang === "ja" ? "空リストのため設定を保持しました" : "Empty list; settings preserved");
            const afterEmptyList = await documentRoot.evaluate(() => window.uploadRelaySnapshot());
            expect(afterEmptyList.find(destination => destination.protocol === "blossom"))
                .toEqual(snapshot.find(destination => destination.protocol === "blossom") && {
                    ...snapshot.find(destination => destination.protocol === "blossom"), isDefault: false,
                });
            const geometry = await documentRoot.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }));
            expect(geometry.scroll).toBeLessThanOrEqual(geometry.width);
            await expect(publishButton).toBeInViewport();
            if (lang === "ja") await page.screenshot({ path: testInfo.outputPath("upload-relay-sync.png"), fullPage: true });
        });
    }
}
