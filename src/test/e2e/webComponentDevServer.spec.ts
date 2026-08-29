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
        await expect(page.locator("#ready-status")).toContainText("whenReady(): resolved");
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

        webComponentResponses.length = 0;
        failedWebComponentRequests.length = 0;
        consoleErrors.length = 0;
        await page.goto(`${origin}/ehagaki/host-owned-composer-lite-example.html`);
        await expect(page.locator("#log")).toContainText("create configuration:");
        await expect(page.locator("#status")).toHaveText("ready | upload: off | CW: off | hashtag pin: off | bar: on | enter: newline | editor: legacy");
        await expect(page.locator("#mount-config-status")).toHaveText("ready | upload: off | CW: off | hashtag pin: off | bar: on | enter: newline | editor: legacy");
        await expect(page.locator("#editor-min-lines")).toHaveValue("");
        await expect(page.locator("#editor-max-lines")).toHaveValue("");
        await expect(page.locator("ehagaki-composer")).toBeVisible();
        const closedHostOwnedGeometry = await page.locator("ehagaki-composer").evaluate((element) => {
            const shadow = element.shadowRoot!;
            const content = shadow.querySelector<HTMLElement>(".main-content")!;
            const buttonBar = shadow.querySelector<HTMLElement>(".footer-button-bar")!;
            const component = element.getBoundingClientRect();
            const buttonBarRect = buttonBar.getBoundingClientRect();
            const mount = document.querySelector<HTMLElement>("#mount")!;
            const mountRect = mount.getBoundingClientRect();
            return {
                mountHeight: mountRect.height,
                composerHeight: component.height,
                topSpacing: getComputedStyle(content).paddingTop,
                buttonBarHeight: buttonBarRect.height,
                buttonBarBottom: buttonBarRect.bottom,
                componentBottom: component.bottom,
                mountBottom: mountRect.bottom,
                footerPresent: !!shadow.querySelector(".footer-bar"),
            };
        });
        expect(closedHostOwnedGeometry.topSpacing).toBe("0px");
        expect(closedHostOwnedGeometry.mountHeight).toBeGreaterThanOrEqual(460);
        expect(closedHostOwnedGeometry.composerHeight).toBeGreaterThanOrEqual(459);
        expect(Math.abs(closedHostOwnedGeometry.mountHeight - closedHostOwnedGeometry.composerHeight)).toBeLessThanOrEqual(2);
        expect(Math.abs(closedHostOwnedGeometry.componentBottom - closedHostOwnedGeometry.mountBottom)).toBeLessThanOrEqual(2);
        expect(closedHostOwnedGeometry.buttonBarHeight).toBe(50);
        expect(Math.abs(closedHostOwnedGeometry.buttonBarBottom - closedHostOwnedGeometry.componentBottom)).toBeLessThanOrEqual(1);
        expect(closedHostOwnedGeometry.footerPresent).toBe(false);
        await expect(page.locator("ehagaki-composer .image-button")).toHaveCount(0);
        await expect(page.locator("ehagaki-composer .custom-emoji-button")).toHaveCount(0);
        await expect(page.locator("ehagaki-composer .content-warning-icon")).toHaveCount(0);
        await expect(page.locator("ehagaki-composer .hashtag-icon")).toHaveCount(0);
        await page.locator("#upload-media").check();
        await page.locator("#content-warning").check();
        await page.locator("#hashtag-pin").check();
        await page.locator("#keyboard-bar").uncheck();
        await page.locator("#enter-behavior").selectOption("submit");
        await page.locator("#editor-min-lines").fill("1");
        await page.locator("#editor-max-lines").fill("3");
        await page.locator("#create-composer").click();
        await expect(page.locator("#status")).toHaveText("ready | upload: on | CW: on | hashtag pin: on | bar: off | enter: submit | editor: 1/3");
        await expect(page.locator("#log")).toContainText("\"upload\":\"on\"");
        await expect(page.locator("ehagaki-composer .footer-button-bar")).toHaveCount(0);
        await expect(page.locator("ehagaki-composer .image-button")).toHaveCount(0);
        await expect(page.locator("ehagaki-composer .custom-emoji-button")).toHaveCount(0);
        await expect(page.locator("ehagaki-composer .content-warning-icon")).toHaveCount(0);
        await expect(page.locator("ehagaki-composer .hashtag-icon")).toHaveCount(0);
        await page.locator("#set-custom-emojis").click();
        await expect(page.locator("#log")).toContainText("setCustomEmojis:");
        await expect(page.locator("ehagaki-composer .custom-emoji-button")).toHaveCount(0);
        await page.locator("#keyboard-bar").check();
        await page.locator("#create-composer").click();
        await expect(page.locator("#status")).toHaveText("ready | upload: on | CW: on | hashtag pin: on | bar: on | enter: submit | editor: 1/3");
        await expect(page.locator("ehagaki-composer .image-button")).toHaveCount(1);
        await page.locator("#set-custom-emojis").click();
        await expect(page.locator("ehagaki-composer .custom-emoji-button")).toHaveCount(1);
        await page.locator("ehagaki-composer .custom-emoji-button").click();
        await expect(page.locator("ehagaki-composer .emoji-button")).toHaveCount(3);
        const autoGrowPickerGeometry = await page.locator("ehagaki-composer").evaluate((element) => {
            const editor = element.shadowRoot!.querySelector<HTMLElement>(".tiptap-editor")!;
            const style = getComputedStyle(editor);
            return {
                height: editor.getBoundingClientRect().height,
                minHeight: Number.parseFloat(style.minHeight),
                maxHeight: Number.parseFloat(style.maxHeight),
            };
        });
        expect(autoGrowPickerGeometry.height).toBeCloseTo(autoGrowPickerGeometry.minHeight, 1);
        expect(autoGrowPickerGeometry.maxHeight).toBeGreaterThan(autoGrowPickerGeometry.minHeight);
        await expect.poll(() => page.locator("ehagaki-composer .emoji-button img").evaluateAll((images) => images.every((image) => {
            const img = image as HTMLImageElement;
            return img.complete && img.naturalWidth > 0;
        }))).toBe(true);
        await page.locator("ehagaki-composer .emoji-button[aria-label=':wave:']").click();
        await expect(page.locator("ehagaki-composer .custom-emoji-image")).toHaveCount(1);
        await page.locator("#remove-composer").click();
        await expect(page.locator("ehagaki-composer")).toHaveCount(0);
        await page.locator("#reconnect-composer").click();
        await expect(page.locator("#status")).toHaveText("ready | upload: on | CW: on | hashtag pin: on | bar: on | enter: submit | editor: 1/3");
        await expect(page.locator("ehagaki-composer .custom-emoji-button")).toHaveCount(1);
        await expect(page.locator("#log")).toContainText("\"sameInstance\":true");
        await page.locator("#clear-custom-emojis").click();
        await expect(page.locator("#log")).toContainText("clear custom emojis:");
        await expect(page.locator("ehagaki-composer .custom-emoji-button")).toHaveCount(0);
        await page.locator("#set-custom-emojis").click();
        await expect(page.locator("ehagaki-composer .custom-emoji-button")).toHaveCount(1);
        await page.locator("ehagaki-composer .custom-emoji-button").click();
        await expect(page.locator("ehagaki-composer .emoji-button img")).toHaveCount(3);
        await page.locator("#locale").selectOption("ja");
        await page.locator("#theme-mode").selectOption("dark");
        await page.locator("#apply-settings").click();
        await expect(page.locator("#log")).toContainText("setSettings applied:");
        await expect(page.locator("#log")).toContainText("locale");
        await page.locator("details").filter({ hasText: "Advanced: legacy compression keys" }).locator("summary").click();
        await page.locator("#legacy-image-quality").selectOption("low");
        await page.locator("#legacy-video-quality").selectOption("high");
        await page.locator("#apply-legacy-settings").click();
        await expect(page.locator("#log")).toContainText("setSettings legacy payload:");
        await expect(page.locator("#log")).toContainText("imageCompressionLevel");
        await page.locator("#context-content").fill("sample context body");
        await page.locator("#set-content").click();
        await page.locator("#set-reply").click();
        await page.locator("#set-single-quote").click();
        await expect(page.locator("#log")).toContainText("setContext content:");
        await expect(page.locator("#log")).toContainText("setContext reply:");
        await expect(page.locator("#log")).toContainText("setContext single quote:");
        await expect.poll(() => page.locator("ehagaki-composer").evaluate((element) => {
            const shadow = element.shadowRoot!;
            const icons = [
                shadow.querySelector<HTMLElement>("button.post-button .plane-icon"),
                shadow.querySelector<HTMLElement>(".content-warning-icon"),
                shadow.querySelector<HTMLElement>(".hashtag-icon"),
            ];
            return icons.map((icon) => icon ? getComputedStyle(icon).maskImage : "missing");
        })).toEqual(expect.arrayContaining([
            expect.stringContaining(`${origin}/ehagaki/web-component/host-owned/icons/`),
        ]));
        const sampleIconState = await page.locator("ehagaki-composer").evaluate((element) => {
            const shadow = element.shadowRoot!;
            const icons = [
                shadow.querySelector<HTMLElement>("button.post-button .plane-icon"),
                shadow.querySelector<HTMLElement>(".content-warning-icon"),
                shadow.querySelector<HTMLElement>(".hashtag-icon"),
            ];
            return icons.map((icon) => icon ? getComputedStyle(icon).maskImage : "missing");
        });
        expect(sampleIconState).toHaveLength(3);
        expect(sampleIconState.every((mask) => mask !== "none" && mask.includes(`${origin}/ehagaki/web-component/host-owned/icons/`))).toBe(true);
        expect(sampleIconState.every((mask) => !mask.includes(`${origin}/ehagaki/web-component/host-owned/assets/icons/`))).toBe(true);

        await page.locator("ehagaki-composer .content-warning-icon").click();
        await expect.poll(() => page.locator("ehagaki-composer").evaluate((element) => {
            const reason = element.shadowRoot!.querySelector<HTMLElement>(".reason-input-container");
            return reason?.getBoundingClientRect().height ?? 0;
        })).toBe(50);
        const hostOwnedWarningGeometry = await page.locator("ehagaki-composer").evaluate((element) => {
            const shadow = element.shadowRoot!;
            const reason = shadow.querySelector<HTMLElement>(".reason-input-container")!;
            const buttonBar = shadow.querySelector<HTMLElement>(".footer-button-bar")!;
            return {
                reasonBottom: reason.getBoundingClientRect().bottom,
                buttonBarTop: buttonBar.getBoundingClientRect().top,
            };
        });
        expect(Math.abs(hostOwnedWarningGeometry.reasonBottom - hostOwnedWarningGeometry.buttonBarTop)).toBeLessThanOrEqual(1);

        const sampleEditor = page.locator("ehagaki-composer .tiptap-editor");
        await sampleEditor.click();
        await sampleEditor.pressSequentially("host-owned sample body");
        await page.locator("#apply-reply-quotes").click();
        await expect(page.locator("#log")).toContainText("ehagaki-composer-context-updated");
        await page.locator("ehagaki-composer button.post-button").click();
        await expect(page.locator("#log")).toContainText("submit output:");
        await expect(page.locator("#last-submit-output")).toContainText("sample context body");
        await page.locator("#clear-log").click();
        await expect(page.locator("#log")).toHaveText("");
        const iconStatuses = await page.evaluate(async () => Promise.all([
            "paper-plane-solid-full.svg",
            "visibility_off_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg",
            "tag_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg",
        ].map(async (icon) => (await fetch(`./web-component/host-owned/icons/${icon}`)).status)));
        expect(iconStatuses).toEqual([200, 200, 200]);

        const sampleRequests = webComponentResponses.filter(({ path }) => path.includes("/ehagaki/web-component/host-owned/"));
        expect(sampleRequests.some(({ path, status }) => path.endsWith("/icons/paper-plane-solid-full.svg") && status === 200)).toBe(true);
        expect(sampleRequests.some(({ path }) => path.includes("/assets/icons/") && path.endsWith(".svg"))).toBe(false);
        expect(sampleRequests.some(({ status }) => status === 404)).toBe(false);
        expect(failedWebComponentRequests.filter((path) => path.includes("/host-owned/"))).toEqual([]);
        expect(consoleErrors.filter((message) => /404|initialization|module/i.test(message))).toEqual([]);

        const entryPath = join(process.cwd(), "src", "host-owned-composer-lite", "HostOwnedComposerLiteApp.svelte");
        const entryStat = await stat(entryPath);
        const fullOutputPath = join(process.cwd(), "dist-web-component", "ehagaki-composer.js");
        const liteOutputPath = join(process.cwd(), "dist-web-component", "host-owned", "ehagaki-composer.js");
        await stat(fullOutputPath);
        const liteOutputStat = await stat(liteOutputPath);
        await expect.poll(() => (output.join("").match(/built in/g) ?? []).length, {
            timeout: 30_000,
        }).toBeGreaterThanOrEqual(2);
        const completedBuilds = (output.join("").match(/built in/g) ?? []).length;
        try {
            await utimes(entryPath, entryStat.atime, new Date(Date.now() + 2_000));
            await expect.poll(() => (output.join("").match(/built in/g) ?? []).length, {
                timeout: 60_000,
            }).toBeGreaterThan(completedBuilds);
            const refreshedLiteOutput = await stat(liteOutputPath);
            expect(refreshedLiteOutput.mtimeMs).toBeGreaterThanOrEqual(liteOutputStat.mtimeMs);
            await stat(fullOutputPath);
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
