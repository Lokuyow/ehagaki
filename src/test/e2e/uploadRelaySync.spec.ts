import { expect, test } from "@playwright/test";
import { finalizeEvent, generateSecretKey, getPublicKey, verifyEvent, type EventTemplate } from "nostr-tools";

test.use({ trace: "off" });
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
