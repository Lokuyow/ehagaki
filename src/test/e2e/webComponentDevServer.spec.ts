import { test, expect } from "@playwright/test";
import { spawn, type ChildProcess } from "node:child_process";
import { rm, stat, utimes } from "node:fs/promises";
import { createServer } from "node:net";
import { join } from "node:path";

const host = "127.0.0.1";

async function reservePort(): Promise<number> {
    const server = createServer();
    await new Promise<void>((resolve, reject) => {
        server.once("error", reject);
        server.listen(0, host, () => resolve());
    });
    const address = server.address();
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    if (!address || typeof address === "string") {
        throw new Error("Could not reserve a TCP port for the Web Component dev server test.");
    }
    return address.port;
}

async function requestStatus(url: string): Promise<number> {
    try {
        return (await fetch(url)).status;
    } catch {
        return 0;
    }
}

function waitForExit(child: ChildProcess): Promise<void> {
    return new Promise((resolve) => child.once("exit", () => resolve()));
}

async function stopDevServer(child: ChildProcess): Promise<void> {
    if (child.exitCode !== null) return;
    const exited = waitForExit(child);
    child.kill("SIGINT");
    await Promise.race([
        exited,
        new Promise<void>((resolve) => setTimeout(resolve, 10_000)),
    ]);
    if (child.exitCode !== null) return;

    if (process.platform === "win32" && child.pid) {
        const taskkill = spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
            stdio: "ignore",
            windowsHide: true,
        });
        await new Promise<void>((resolve) => taskkill.once("exit", () => resolve()));
        return;
    }
    child.kill("SIGTERM");
    await exited;
}

test("serves the Web Component sample through the local dev proxy", async ({ page }) => {
    test.setTimeout(180_000);
    const appPort = await reservePort();
    const webComponentPort = await reservePort();
    const origin = `http://${host}:${appPort}`;
    const output: string[] = [];
    await rm(join(process.cwd(), "dist-web-component"), { recursive: true, force: true });
    const devServer = spawn(process.execPath, ["scripts/devWebComponentSample.mjs"], {
        cwd: process.cwd(),
        env: {
            ...process.env,
            EHAGAKI_WEB_COMPONENT_DEV_APP_PORT: String(appPort),
            EHAGAKI_WEB_COMPONENT_DEV_PORT: String(webComponentPort),
        },
        stdio: ["ignore", "pipe", "pipe"],
        windowsHide: true,
    });
    devServer.stdout?.on("data", (chunk) => output.push(String(chunk)));
    devServer.stderr?.on("data", (chunk) => output.push(String(chunk)));

    const webComponentResponses: Array<{ path: string; status: number }> = [];
    const failedWebComponentRequests: string[] = [];
    const consoleErrors: string[] = [];
    page.on("response", (response) => {
        const url = new URL(response.url());
        if (url.origin === origin && url.pathname.startsWith("/ehagaki/web-component/")) {
            webComponentResponses.push({ path: url.pathname, status: response.status() });
        }
    });
    page.on("requestfailed", (request) => {
        const url = new URL(request.url());
        if (url.origin === origin && url.pathname.startsWith("/ehagaki/web-component/")) {
            failedWebComponentRequests.push(url.pathname);
        }
    });
    page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
    });

    try {
        await expect.poll(
            () => requestStatus(`${origin}/ehagaki/web-component-parent-client-example.html`),
            { timeout: 120_000 },
        ).toBe(200);
        await expect.poll(
            () => requestStatus(`${origin}/ehagaki/web-component/ehagaki-composer.js`),
            { timeout: 30_000 },
        ).toBe(200);
        await expect.poll(() => output.join(""), { timeout: 30_000 }).toContain(
            `Vite dev server uses physical repository path ${process.cwd()}`,
        );

        await page.goto(`${origin}/ehagaki/web-component-parent-client-example.html`);
        await expect(page.locator("#module-url")).toHaveValue(`${origin}/ehagaki/web-component/ehagaki-composer.js`);
        await expect(page.locator("#asset-base")).toHaveValue(`${origin}/ehagaki/web-component/`);
        await expect(page.locator("#ready-status")).toHaveText("whenReady(): resolved");
        await page.waitForFunction(() => document.querySelector("ehagaki-composer")?.shadowRoot?.querySelector(".footer-bar"));

        const iconStatus = await page.evaluate(async () => (
            await fetch("./web-component/icons/add_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg")
        ).status);
        expect(iconStatus).toBe(200);
        expect(webComponentResponses.some(({ path, status }) => path.endsWith("/ehagaki-composer.js") && status === 200)).toBe(true);
        expect(webComponentResponses.some(({ path, status }) => path.includes("/assets/") && status === 200)).toBe(true);
        expect(webComponentResponses.some(({ path, status }) => path.includes("/icons/") && status === 200)).toBe(true);
        expect(webComponentResponses.some(({ status }) => status === 404)).toBe(false);
        expect(failedWebComponentRequests).toEqual([]);
        expect(consoleErrors.filter((message) => /404|module/i.test(message))).toEqual([]);

        const entryPath = join(process.cwd(), "src", "web-component", "entry.ts");
        const entryStat = await stat(entryPath);
        await expect.poll(() => (output.join("").match(/built in/g) ?? []).length, {
            timeout: 30_000,
        }).toBeGreaterThanOrEqual(2);
        const completedBuilds = (output.join("").match(/built in/g) ?? []).length;
        try {
            await utimes(entryPath, entryStat.atime, new Date(Date.now() + 2_000));
            await expect.poll(() => (output.join("").match(/built in/g) ?? []).length, {
                timeout: 60_000,
            }).toBeGreaterThan(completedBuilds);
        } finally {
            await utimes(entryPath, entryStat.atime, entryStat.mtime);
        }
    } finally {
        await stopDevServer(devServer);
        await expect.poll(() => requestStatus(`${origin}/ehagaki/web-component-parent-client-example.html`), {
            timeout: 10_000,
        }).toBe(0);
        if (devServer.exitCode !== 0 && devServer.exitCode !== null) {
            throw new Error(`dev:web-component exited unexpectedly: ${output.join("").slice(-4000)}`);
        }
    }
});
