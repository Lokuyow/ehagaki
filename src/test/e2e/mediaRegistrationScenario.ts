import { expect, type Page, type TestInfo } from "@playwright/test";
import { finalizeEvent, generateSecretKey, getPublicKey, verifyEvent, type EventTemplate } from "nostr-tools";
import { hashPayload } from "nostr-tools/nip98";

export async function checkMediaRegistration(page: Page, testInfo: TestInfo, server: "yabu" | "nostrcheck", embedded: boolean) {
    const fixtureKey = generateSecretKey(), owner = getPublicKey(fixtureKey);
    const origin = server === "yabu" ? "https://share.yabu.me" : "https://nostrcheck.me";
    const endpoint = server === "yabu" ? "https://yabu.me/api/v2/media" : "https://cdn.nostrcheck.me/";
    const domain = server === "yabu" ? "yabu.me" : "nostrcheck.me";
    const en = server === "nostrcheck";
    let registered = false, deleted = false, registrationCount = 0, deleteCount = 0;
    const fixtureHash = "b".repeat(64);
    await page.exposeFunction("fixtureSignMediaRegistrationEvent", (event: EventTemplate) => finalizeEvent(event, fixtureKey));
    await page.route("**/.well-known/nostr/nip96.json", route => route.fulfill({ json: { api_url: endpoint } }));
    await page.route(`${origin}/api/v2/domains`, route => route.fulfill({ json: { availableDomains: { [domain]: {
        requireinvite: false, requirepayment: false, maxsatoshi: 0, minUsernameLength: 3, maxUsernameLength: 20,
    } } } }));
    await page.route(`${origin}/api/v2/register`, async route => {
        if (route.request().method() === "OPTIONS") {
            await route.fulfill({ status: 204, headers: { "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Authorization,Content-Type", "Access-Control-Allow-Methods": "POST" } });
            return;
        }
        registrationCount++;
        const request = route.request(), body = request.postDataJSON();
        const authorization = request.headers().authorization;
        const event = JSON.parse(Buffer.from(authorization.replace(/^Nostr /, ""), "base64").toString("utf8"));
        // Assert booleans to avoid putting authentication events or request bodies in failure reports.
        expect(request.method() === "POST" && body.pubkey === owner && body.domain === domain && !('password' in body)).toBe(true);
        expect(verifyEvent(event) && event.pubkey === owner && event.kind === 27235 && event.content === "").toBe(true);
        expect(event.tags.some((tag: string[]) => tag[0] === "u" && tag[1] === request.url())
            && event.tags.some((tag: string[]) => tag[0] === "method" && tag[1] === "POST")
            && event.tags.some((tag: string[]) => tag[0] === "payload" && tag[1] === hashPayload(body))).toBe(true);
        registered = true;
        await route.fulfill({ json: { status: "success", otc: false, payment_request: "", satoshi: 0 } });
    });
    await page.route(`${endpoint.replace(/\/$/, "")}/**`, async route => {
        if (route.request().method() !== "DELETE") { await route.fallback(); return; }
        deleteCount++; deleted = true;
        await route.fulfill({ json: { status: "success" } });
    });
    await page.route(`${endpoint}?*`, async route => {
        if (!registered) { await route.fulfill({ status: 401, json: { result: false, description: "Registration required" } }); return; }
        await route.fulfill({ json: { page: 0, count: 24, total: deleted ? 0 : 1, files: deleted ? [] : [{
            tags: [["ox", fixtureHash], ["url", `${origin}/fixture.png`], ["m", "image/png"], ["size", "1"]], created_at: 1_700_000_000,
        }] } });
    });
    await page.route(`${origin}/fixture.png`, route => route.fulfill({ status: 200, contentType: "image/png",
        body: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=", "base64") }));
    await page.setViewportSize({ width: 360, height: 850 });
    await page.goto(`post-history-dialog-playwright.html?${embedded ? "media-registration-host" : "media-registration"}=1&owner=${owner}&server=${server}&lang=${en ? "en&profile-fallback=1" : "ja"}`);
    const surface = embedded ? page.frameLocator("iframe") : page;
    const dialog = surface.getByRole("dialog", { name: en ? "History" : "履歴", exact: true });
    await dialog.getByRole("button", { name: en ? "Register with this server" : "このサーバーに登録", exact: true }).click();
    const input = dialog.getByRole("textbox", { name: en ? "Username" : "ユーザー名", exact: true });
    await expect(input).toHaveValue(en ? "fallback_name" : "表示名🎨");
    await expect(input).toBeFocused();
    const submit = dialog.getByRole("button", { name: en ? "Register and refresh list" : "登録して一覧を更新", exact: true });
    if (en) await expect(submit).toBeEnabled();
    else await expect(submit).toBeDisabled();
    await input.fill("fixture_name");
    await expect(submit).toBeEnabled();
    expect(await dialog.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
    for (const element of [input, submit]) {
        expect(await element.evaluate(node => { const bounds = node.getBoundingClientRect(); return bounds.left >= 0 && bounds.right <= window.innerWidth; })).toBe(true);
    }
    await page.screenshot({ path: testInfo.outputPath(`registration-${server}-${embedded ? "embedded280" : "standalone360"}.png`) });
    await submit.click();
    await expect(dialog.locator("article")).toHaveCount(1);
    await expect(dialog.locator(".media-list")).toBeFocused();
    expect(registrationCount === 1 && deleteCount === 0).toBe(true);
    await dialog.locator("article").getByRole("button", { name: en ? "Delete from this server" : "削除", exact: true }).click();
    const confirmation = surface.getByRole("alertdialog");
    await expect(confirmation).toBeVisible();
    expect(deleteCount).toBe(0);
    await confirmation.getByRole("button", { name: en ? "Delete from this server" : "削除", exact: true }).click();
    await expect(dialog.locator("article")).toHaveCount(0);
    expect(deleteCount).toBe(1);
}
