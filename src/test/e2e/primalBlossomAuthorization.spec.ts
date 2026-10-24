import { test, expect } from "@playwright/test";
import { finalizeEvent, generateSecretKey, getPublicKey, verifyEvent, type EventTemplate } from "nostr-tools";

// Sign only with an ephemeral fixture key; never persist authorization in traces.
test.use({ trace: "off", serviceWorkers: "block" });
const server = "https://blossom.primal.net";

for (const mode of ["normal", "snapshot", "unauthorized", "cors"] as const) {
    test(`custom Primal destination: ${mode}`, async ({ page, context }) => {
        const key = generateSecretKey(), pubkey = getPublicKey(key);
        const signedJson = new Map<string, string>();
        const actions: string[] = [];
        const removed = new Set<string>();
        const count = mode === "snapshot" ? 49 : 1;
        const descriptors = Array.from({ length: count }, (_, index) => {
            const sha256 = (index + 1).toString(16).padStart(64, "0");
            return { sha256, type: "image/png", url: `${server}/${sha256}.png`, size: 12, uploaded: 300 - index };
        });
        await page.exposeFunction("signPrimalFixture", (template: EventTemplate) => {
            const signed = finalizeEvent(template, key);
            signedJson.set(signed.id, JSON.stringify(signed));
            return signed;
        });
        await page.addInitScript((pubkey) => {
            localStorage.setItem("nostr-accounts", JSON.stringify([{ pubkeyHex: pubkey, type: "nip07", addedAt: 1 }]));
            localStorage.setItem("nostr-active-account", pubkey);
            localStorage.setItem("historyActiveTab", "media");
            Reflect.set(window, "nostr", { getPublicKey: async () => pubkey,
                signEvent: (template: unknown) => Reflect.get(window, "signPrimalFixture")(template) });
        }, pubkey);
        await context.routeWebSocket("**/*", socket => socket.close());
        await page.route("https://**/*", route => route.abort());
        await page.route(`${server}/**`, async route => {
            const request = route.request(), url = new URL(request.url());
            if (request.method() === "GET" && !url.pathname.startsWith("/list/")) {
                await route.fulfill({ contentType: "image/svg+xml", body: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"/>' });
                return;
            }
            const token = request.headers().authorization?.slice(6) ?? "";
            const bytes = Buffer.from(token, "base64");
            const event = JSON.parse(bytes.toString("utf8"));
            expect(token === bytes.toString("base64")).toBe(true);
            const signed = JSON.parse(signedJson.get(event.id)!);
            expect(event.id === signed.id && event.sig === signed.sig).toBe(true);
            expect(verifyEvent(event)).toBe(true);
            expect(event.kind).toBe(24242);
            expect(event.tags).toContainEqual(["server", "blossom.primal.net"]);
            expect(event.tags).toContainEqual(["expiration", String(event.created_at + 60)]);
            const action = request.method() === "DELETE" ? "delete" : "list";
            expect(event.tags).toContainEqual(["t", action]);
            actions.push(action);
            if (mode === "cors") { await route.abort("failed"); return; }
            if (mode === "unauthorized") { await route.fulfill({ status: 401 }); return; }
            if (action === "delete") {
                expect(event.tags).toContainEqual(["x", url.pathname.slice(1)]);
                removed.add(url.pathname.slice(1));
                await route.fulfill({ status: 204 });
            } else {
                expect(url.pathname).toBe(`/list/${pubkey}`);
                expect(url.searchParams.get("limit")).toBe("24");
                await route.fulfill({ json: descriptors.filter(item => !removed.has(item.sha256)) });
            }
        });
        await page.goto("./");
        const start = page.getByRole("button", { name: "はじめる", exact: true });
        await start.click();
        await expect(start).toBeHidden();
        await page.evaluate(async ({ server, pubkey }) => {
            const db = await new Promise<IDBDatabase>((resolve, reject) => {
                const request = indexedDB.open("eHagakiDB");
                request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
            });
            const tx = db.transaction("uploadDestinations", "readwrite"), store = tx.objectStore("uploadDestinations");
            store.clear();
            store.put({ id: "primal-custom", scopeKey: pubkey, pubkeyHex: pubkey, name: "My media server", protocol: "blossom",
                serverUrl: server, presetId: "custom", enabled: false, isDefault: true, sortIndex: 0,
                createdAt: 1, updatedAt: 1, schemaVersion: 1, auth: { type: "blossom-bud11" },
                capabilities: { maxUploadSize: null, supportedMimeTypes: [], supportsDelete: false, supportsList: false,
                    supportsMirror: false, supportsMediaOptimization: false, authRequired: true, source: "preset" } });
            await new Promise<void>((resolve, reject) => { tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error); });
            db.close();
        }, { server, pubkey });
        await page.reload();
        await page.getByRole("button", { name: "履歴", exact: true }).click();
        const dialog = page.getByRole("dialog", { name: "履歴", exact: true });
        await dialog.getByRole("tab", { name: "メディア", exact: true }).click();
        await dialog.getByRole("combobox").selectOption("primal-custom");
        if (mode === "unauthorized" || mode === "cors") {
            await expect(dialog.getByRole("alert")).toBeVisible();
            await expect(dialog.locator("article")).toHaveCount(0);
            expect(actions).toEqual(["list"]);
            return;
        }
        await expect(dialog.locator("article")).toHaveCount(Math.min(24, count));
        if (mode === "snapshot") {
            const more = dialog.getByRole("button", { name: "さらに読み込む", exact: true });
            for (const total of [48, 49]) { await more.click(); await expect(dialog.locator("article")).toHaveCount(total); }
            await expect(more).toHaveCount(0);
        }
        expect(actions).toEqual(["list"]);
        await dialog.locator("article").first().getByRole("button", { name: "削除", exact: true }).click();
        await page.getByRole("alertdialog").getByRole("button", { name: "削除", exact: true }).click();
        await expect(dialog.locator("article")).toHaveCount(count - 1);
        expect(actions).toEqual(["list", "delete"]);
    });
}
