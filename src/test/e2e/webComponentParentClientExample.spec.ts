import { test, expect } from "@playwright/test";
import { createServer, type Server } from "node:http";
import { extname, join, normalize } from "node:path";
import { access, readFile } from "node:fs/promises";
import { nip19 } from "nostr-tools";

let server: Server;
let origin = "";
const requests = new Set<string>();
const securityFixturePath = "/ehagaki/security-fixture.js";

declare global {
    interface Window {
        __securityFixtureLoaded?: boolean;
    }
}

function contentType(filePath: string): string {
    switch (extname(filePath)) {
        case ".html": return "text/html; charset=utf-8";
        case ".js": return "text/javascript; charset=utf-8";
        case ".css": return "text/css; charset=utf-8";
        case ".svg": return "image/svg+xml";
        case ".wasm": return "application/wasm";
        case ".png": return "image/png";
        default: return "application/octet-stream";
    }
}

function listen(value: Server): Promise<number> {
    return new Promise((resolve) => {
        value.listen(0, "127.0.0.1", () => {
            const address = value.address();
            resolve(typeof address === "object" && address ? address.port : 0);
        });
    });
}

function close(value: Server): Promise<void> {
    return new Promise((resolve, reject) => value.close((error) => error ? reject(error) : resolve()));
}

test.beforeAll(async () => {
    await access(join(process.cwd(), "dist", "web-component", "ehagaki-composer.js"));
    server = createServer(async (request, response) => {
        const pathname = new URL(request.url ?? "/", origin).pathname;
        requests.add(pathname);
        if (pathname === securityFixturePath) {
            response.writeHead(200, { "Content-Type": "text/javascript; charset=utf-8" });
            response.end(`
                window.__securityFixtureLoaded = true;
                class SecurityFixtureComposer extends HTMLElement {
                    whenReady() { return Promise.resolve(); }
                    setSettings() { return Promise.resolve([]); }
                    setContext() { return Promise.resolve(); }
                    connectedCallback() {
                        this.dispatchEvent(new CustomEvent("ehagaki-ready", { bubbles: true, composed: true, detail: { apiVersion: 999 } }));
                    }
                }
                customElements.define("ehagaki-composer", SecurityFixtureComposer);
            `);
            return;
        }
        if (!pathname.startsWith("/ehagaki/")) {
            response.writeHead(404).end();
            return;
        }
        const relativePath = pathname.slice("/ehagaki/".length) || "index.html";
        const siteRoot = normalize(join(process.cwd(), "dist"));
        const filePath = normalize(join(siteRoot, relativePath));
        if (!filePath.startsWith(siteRoot)) {
            response.writeHead(400).end();
            return;
        }
        try {
            const body = await readFile(filePath);
            response.writeHead(200, { "Content-Type": contentType(filePath) });
            response.end(body);
        } catch {
            response.writeHead(404).end();
        }
    });
    origin = `http://127.0.0.1:${await listen(server)}`;
});

test.beforeEach(() => requests.clear());

test.afterAll(async () => {
    await close(server);
});

test("boots from production site output and exercises the public sample API", async ({ page }) => {
    await page.goto(`${origin}/ehagaki/web-component-parent-client-example.html`);

    await expect(page.locator("#module-url")).toHaveValue(`${origin}/ehagaki/web-component/ehagaki-composer.js`);
    await expect(page.locator("#asset-base")).toHaveValue(`${origin}/ehagaki/web-component/`);
    await expect(page.locator("#module-status")).toHaveText("module 未読み込み");
    await expect(page.locator("ehagaki-composer")).toHaveCount(0);
    await page.getByRole("button", { name: "Create / Mount" }).click();
    await expect(page.locator("#module-status")).toContainText("module loaded");
    await expect(page.locator("#ready-status")).toHaveText("whenReady(): resolved");
    await expect(page.locator("#component-status")).toHaveText("component mounted");
    await expect(page.locator("#module-url")).toBeDisabled();
    await expect(page.locator("ehagaki-composer")).toHaveCount(1);
    expect(requests).toContain("/ehagaki/web-component/ehagaki-composer.js");
    expect([...requests].some((path) => path.startsWith("/ehagaki/web-component/assets/"))).toBe(true);

    await page.getByRole("button", { name: "実行中に適用" }).click();
    await expect(page.locator("#component-status")).toContainText("locale");

    const reply = nip19.noteEncode("a".repeat(64));
    const quote = nip19.noteEncode("b".repeat(64));
    const secondQuote = nip19.noteEncode("c".repeat(64));
    await page.locator("#context-reply").fill(reply);
    await page.getByRole("button", { name: "replyを適用" }).click();
    await expect(page.locator("#component-status")).toHaveText("reply context: applied");
    await page.locator("#context-quote-one").fill(quote);
    await page.getByRole("button", { name: "quoteを適用" }).click();
    await expect(page.locator("#component-status")).toHaveText("quote context: applied");
    await page.locator("#context-quote-two").fill(secondQuote);
    await page.getByRole("button", { name: "multiple quote" }).click();
    await expect(page.locator("#component-status")).toHaveText("multiple quote context: applied");

    await page.getByRole("button", { name: "invalid contextを試す" }).click();
    await expect(page.locator("#component-status")).toContainText("invalid context: rejected");
    await expect(page.locator("#event-log")).toHaveValue(/ehagaki-composer-context-updated/);

    await page.locator("#style-background").fill("#fefefe");
    await page.locator("#style-part-outline").fill("rgb(1, 2, 3)");
    await page.getByRole("button", { name: "styleを適用" }).click();
    const styleResult = await page.locator("ehagaki-composer").evaluate((element) => {
        const shadow = element.shadowRoot!;
        const header = shadow.querySelector<HTMLElement>('[part~="header"]')!;
        return {
            background: getComputedStyle(element).getPropertyValue("--ehagaki-background").trim(),
            outline: getComputedStyle(header).outlineColor,
        };
    });
    expect(styleResult.background).toBe("#fefefe");
    expect(styleResult.outline).toBe("rgb(1, 2, 3)");
});

test("demonstrates second-instance rejection and recreation after destroy", async ({ page }) => {
    await page.goto(`${origin}/ehagaki/web-component-parent-client-example.html`);
    await page.getByRole("button", { name: "Create / Mount" }).click();
    await expect(page.locator("#ready-status")).toHaveText("whenReady(): resolved");

    await page.getByRole("button", { name: "2個目を生成" }).click();
    await expect(page.locator("#component-status")).toHaveText("2個目は inert: multiple_instances_unsupported");
    await expect(page.locator("#event-log")).toHaveValue(/multiple_instances_unsupported/);
    await expect(page.locator("ehagaki-composer")).toHaveCount(2);

    await page.getByRole("button", { name: "Destroy / Unmount" }).click();
    await expect(page.locator("#component-status")).toContainText("persistent settings remain");
    await page.getByRole("button", { name: "Create / Mount" }).click();
    await expect(page.locator("#component-status")).toHaveText("component mounted");
    await expect(page.locator("#ready-status")).toHaveText("whenReady(): resolved");

    await page.getByRole("button", { name: "Recreate" }).click();
    await expect(page.locator("#component-status")).toHaveText("component mounted");
    await expect(page.locator("ehagaki-composer")).toHaveCount(1);
});

test("does not import query-selected modules until an explicit Create action", async ({ page }) => {
    await page.goto(`${origin}/ehagaki/web-component-parent-client-example.html?moduleUrl=${encodeURIComponent(`${origin}${securityFixturePath}`)}`);

    await expect(page.locator("#module-url")).toHaveValue(`${origin}/ehagaki/web-component/ehagaki-composer.js`);
    await expect(page.locator("ehagaki-composer")).toHaveCount(0);
    expect(requests).not.toContain(securityFixturePath);
    expect(await page.evaluate(() => window.__securityFixtureLoaded === true)).toBe(false);

    await page.locator("#module-url").fill(`${origin}${securityFixturePath}`);
    await page.getByRole("button", { name: "Create / Mount" }).click();
    await expect(page.locator("#module-status")).toContainText("module loaded");
    await expect(page.locator("#module-url")).toBeDisabled();
    await expect(page.locator("#component-status")).toHaveText("component mounted");
    expect(requests).toContain(securityFixturePath);
    expect(await page.evaluate(() => window.__securityFixtureLoaded === true)).toBe(true);
});
