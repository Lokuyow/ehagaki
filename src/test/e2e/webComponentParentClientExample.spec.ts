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

test("keeps the sample columns and panels content-sized", async ({ page }) => {
    for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
        await page.setViewportSize(viewport);
        await page.goto(`${origin}/ehagaki/web-component-parent-client-example.html`);

        const result = await page.evaluate(() => {
            const main = document.querySelector("main")!;
            const columns = [...document.querySelectorAll<HTMLElement>("main > .column")];
            const rightPanels = [...columns[1].querySelectorAll<HTMLElement>(":scope > .panel")];
            const comparisonPanel = rightPanels[2];
            const comparisonIntro = comparisonPanel.querySelector<HTMLElement>(":scope > div")!;
            const comparisonTable = comparisonPanel.querySelector<HTMLTableElement>(".comparison")!;
            const protocolPanel = rightPanels[3];
            const protocolHeading = protocolPanel.querySelector<HTMLElement>("h2")!;
            const protocolList = protocolPanel.querySelector<HTMLElement>(".api-list")!;
            const clearLog = document.querySelector<HTMLButtonElement>("#clear-log")!;
            const eventHeader = clearLog.parentElement!;
            const rect = (element: Element) => element.getBoundingClientRect().toJSON();
            return {
                viewportWidth: window.innerWidth,
                mainColumns: getComputedStyle(main).gridTemplateColumns,
                mainAlignItems: getComputedStyle(main).alignItems,
                columnHeights: columns.map((column) => column.getBoundingClientRect().height),
                panelGaps: rightPanels.slice(1).map((panel, index) => panel.getBoundingClientRect().top - rightPanels[index].getBoundingClientRect().bottom),
                comparisonGap: comparisonTable.getBoundingClientRect().top - comparisonIntro.getBoundingClientRect().bottom,
                protocolGap: protocolList.getBoundingClientRect().top - protocolHeading.getBoundingClientRect().bottom,
                clearLog: rect(clearLog),
                eventHeader: rect(eventHeader),
                eventPanel: rect(rightPanels[1]),
            };
        });

        expect(result.mainAlignItems).toBe("start");
        expect(result.columnHeights[1]).toBeLessThan(result.columnHeights[0]);
        expect(result.panelGaps.every((gap) => gap <= 20.5)).toBe(true);
        expect(result.comparisonGap).toBeLessThanOrEqual(20.5);
        expect(result.protocolGap).toBeLessThanOrEqual(20.5);
        expect(result.clearLog.width).toBeLessThan(result.eventPanel.width / 2);
        expect(result.clearLog.height).toBeLessThanOrEqual(60);
        expect(result.clearLog.top).toBeGreaterThanOrEqual(result.eventHeader.top - 1);
        if (result.viewportWidth > 980) {
            expect(result.mainColumns.split(" ")).toHaveLength(2);
        } else {
            expect(result.mainColumns.split(" ")).toHaveLength(1);
        }
    }
});

test("keeps the comparison table within the page viewport at mobile widths", async ({ page }) => {
    for (const width of [360, 390]) {
        await page.setViewportSize({ width, height: 844 });
        await page.goto(`${origin}/ehagaki/web-component-parent-client-example.html`);
        const result = await page.evaluate(() => ({
            viewportWidth: window.innerWidth,
            documentScrollWidth: document.documentElement.scrollWidth,
            bodyScrollWidth: document.body.scrollWidth,
            table: document.querySelector<HTMLTableElement>(".comparison")?.getBoundingClientRect().toJSON(),
        }));
        expect(result.documentScrollWidth, `document overflow at ${width}px`).toBeLessThanOrEqual(result.viewportWidth);
        expect(result.bodyScrollWidth, `body overflow at ${width}px`).toBeLessThanOrEqual(result.viewportWidth);
        expect(result.table?.right, `table overflow at ${width}px`).toBeLessThanOrEqual(width);
    }
});

test("uses the internal theme surface even when the host forces a white background", async ({ page }) => {
    await page.goto(`${origin}/ehagaki/web-component-parent-client-example.html`);
    await expect(page.locator("#ready-status")).toHaveText("whenReady(): resolved");
    const result = await page.locator("ehagaki-composer").evaluate(async (element) => {
        const composer = element as HTMLElement & { setSettings(value: { themeMode: "light" | "dark" }): Promise<string[]> };
        const shadow = composer.shadowRoot!;
        const shell = shadow.querySelector<HTMLElement>('[part~="shell"]')!;
        const header = shadow.querySelector<HTMLElement>('[part~="header"]')!;
        const read = () => ({
            hostBackground: getComputedStyle(composer).backgroundColor,
            shellBackground: getComputedStyle(shell).backgroundColor,
            headerBackground: getComputedStyle(header).backgroundColor,
            shellColor: getComputedStyle(shell).color,
        });
        await composer.setSettings({ themeMode: "light" });
        const light = read();
        await composer.setSettings({ themeMode: "dark" });
        const dark = read();
        return { light, dark };
    });
    expect(result.light.hostBackground).toBe("rgb(255, 255, 255)");
    expect(result.light.shellBackground).not.toBe("rgba(0, 0, 0, 0)");
    expect(result.dark.shellBackground).not.toBe(result.light.shellBackground);
    expect(result.dark.shellBackground).not.toBe("rgba(0, 0, 0, 0)");
    expect(result.light.headerBackground).toBe("rgba(0, 0, 0, 0)");
    expect(result.dark.headerBackground).toBe("rgba(0, 0, 0, 0)");
    expect(result.light.shellColor).not.toBe(result.dark.shellColor);
});

test("keeps Web Component header controls responsive to component width", async ({ page }) => {
    for (const { label, viewport, mountWidth, expectedPadding, expandSample } of [
        {
            label: "wide viewport",
            viewport: { width: 1280, height: 900 },
            mountWidth: "600px",
            expectedPadding: 8,
        },
        {
            label: "narrow viewport",
            viewport: { width: 390, height: 844 },
            mountWidth: "100%",
            expectedPadding: 8,
        },
        {
            label: "wide component",
            viewport: { width: 1280, height: 900 },
            mountWidth: "900px",
            expectedPadding: 0,
            expandSample: true,
        },
    ]) {
        await page.setViewportSize(viewport);
        await page.goto(`${origin}/ehagaki/web-component-parent-client-example.html`);
        if (expandSample) {
            await page.locator("main").evaluate((main) => {
                (main as HTMLElement).style.gridTemplateColumns = "1fr";
            });
        }
        await page.locator("#component-mount").evaluate((mount, width) => {
            (mount as HTMLElement).style.width = width;
        }, mountWidth);
        await expect(page.locator("#ready-status")).toHaveText("whenReady(): resolved");

        const geometry = await page.locator("ehagaki-composer").evaluate((element) => {
            const shadow = element.shadowRoot!;
            const header = shadow.querySelector<HTMLElement>(".header-container")!;
            const mascot = shadow.querySelector<HTMLElement>(".site-icon")!;
            const rightButton = shadow.querySelector<HTMLElement>(".choose-target-button")!;
            const footer = shadow.querySelector<HTMLElement>(".footer-bar")!;
            const component = element.getBoundingClientRect();
            const toRect = (target: Element) => target.getBoundingClientRect().toJSON();
            return {
                viewportWidth: window.innerWidth,
                component: component.toJSON(),
                header: toRect(header),
                headerPaddingLeft: getComputedStyle(header).paddingLeft,
                headerPaddingRight: getComputedStyle(header).paddingRight,
                mascot: toRect(mascot),
                rightButton: toRect(rightButton),
                footer: toRect(footer),
                footerPaddingLeft: getComputedStyle(footer).paddingLeft,
                footerPaddingRight: getComputedStyle(footer).paddingRight,
                headerChildren: Array.from(header.querySelectorAll<HTMLElement>("*"))
                    .map((child) => toRect(child))
                    .filter((rect) => rect.width > 0 && rect.height > 0),
            };
        });

        expect(geometry.component.width < 801, `${label}: component width breakpoint`)
            .toBe(expectedPadding !== 0);
        expect(geometry.headerPaddingLeft, `${label}: header left padding`).toBe(`${expectedPadding}px`);
        expect(geometry.headerPaddingRight, `${label}: header right padding`).toBe(`${expectedPadding}px`);
        const mascotInset = geometry.mascot.left - geometry.component.left;
        const rightButtonInset = geometry.component.right - geometry.rightButton.right;
        expect(mascotInset, `${label}: mascot inset`).toBeGreaterThanOrEqual(expectedPadding);
        expect(rightButtonInset, `${label}: right button inset`).toBeGreaterThanOrEqual(expectedPadding);
        expect(mascotInset, `${label}: symmetric header edges`).toBeCloseTo(rightButtonInset, 0);
        if (expectedPadding !== 0) {
            expect(mascotInset, `${label}: mascot inset`).toBeCloseTo(expectedPadding, 0);
            expect(rightButtonInset, `${label}: right button inset`).toBeCloseTo(expectedPadding, 0);
        }
        expect(geometry.footerPaddingLeft, `${label}: footer left padding`).toBe("8px");
        expect(geometry.footerPaddingRight, `${label}: footer right padding`).toBe("8px");
        for (const rect of geometry.headerChildren) {
            expect(rect.left, `${label}: header child left edge`).toBeGreaterThanOrEqual(geometry.component.left - 0.5);
            expect(rect.right, `${label}: header child right edge`).toBeLessThanOrEqual(geometry.component.right + 0.5);
        }
    }
});

test("keeps the normal app desktop header layout viewport-based", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    await page.waitForFunction(() => !!document.querySelector(".header-container"));
    await expect(page.locator(".header-container")).toHaveCSS("padding-left", "0px");
    await expect(page.locator(".header-container")).toHaveCSS("padding-right", "0px");
    await expect(page.locator(".header-container")).not.toHaveClass(/container-layout/);
});

test("boots from production site output and exercises the public sample API", async ({ page }) => {
    await page.goto(`${origin}/ehagaki/web-component-parent-client-example.html`);

    await expect(page.locator("#module-url")).toHaveValue(`${origin}/ehagaki/web-component/ehagaki-composer.js`);
    await expect(page.locator("#asset-base")).toHaveValue(`${origin}/ehagaki/web-component/`);
    await expect(page.locator("#module-status")).toHaveText("module loaded; reload to choose another implementation");
    await expect(page.locator("#ready-status")).toHaveText("whenReady(): resolved");
    await expect(page.locator("#component-status")).toHaveText("component mounted");
    await expect(page.locator("ehagaki-composer")).toHaveCount(1);
    for (const id of [
        "style-background",
        "style-text",
        "style-border",
        "style-link",
        "style-input",
        "style-footer",
        "style-dialog",
        "style-font",
        "style-part-outline",
    ]) {
        await expect(page.locator(`#${id}`)).toHaveValue("");
    }
    await expect(page.locator("#module-url")).toBeDisabled();
    expect(requests).toContain("/ehagaki/web-component/ehagaki-composer.js");
    expect([...requests].some((path) => path.startsWith("/ehagaki/web-component/assets/"))).toBe(true);

    const edgeClippingStyles = await page.locator("ehagaki-composer").evaluate((element) => {
        const hostStyle = getComputedStyle(element);
        const frameStyle = getComputedStyle(element.parentElement!);
        return {
            hostOverflowX: hostStyle.overflowX,
            hostOverflowY: hostStyle.overflowY,
            hostBorderRadius: hostStyle.borderRadius,
            frameBorderRadius: frameStyle.borderRadius,
        };
    });
    expect(edgeClippingStyles.hostOverflowX).toBe("visible");
    expect(edgeClippingStyles.hostOverflowY).toBe("visible");
    expect(edgeClippingStyles.hostBorderRadius).toBe("0px");
    expect(edgeClippingStyles.frameBorderRadius).toBe("18px");

    const initialStyleResult = await page.locator("ehagaki-composer").evaluate((element) => {
        const properties = [
            "--ehagaki-background",
            "--ehagaki-text",
            "--ehagaki-border",
            "--ehagaki-link",
            "--ehagaki-input-background",
            "--ehagaki-footer-background",
            "--ehagaki-dialog-background",
            "--ehagaki-font-family",
            "--sample-part-outline",
        ];
        return Object.fromEntries(properties.map((property) => [property, element.style.getPropertyValue(property)]));
    });
    expect(Object.values(initialStyleResult).every((value) => value === "")).toBe(true);

    await page.locator("#theme-mode").selectOption("light");
    await page.getByRole("button", { name: "実行中に適用" }).click();
    await expect(page.locator("#component-status")).toContainText("themeMode");
    const lightThemeResult = await page.locator("ehagaki-composer").evaluate((element) => {
        const appRoot = element.shadowRoot!.querySelector<HTMLElement>(".ehagaki-app-root")!;
        const appStyle = getComputedStyle(appRoot);
        return {
            lightHostClass: element.classList.contains("light"),
            appColor: appStyle.color,
            appBackground: appStyle.backgroundColor,
        };
    });
    expect(lightThemeResult.lightHostClass).toBe(true);
    expect(lightThemeResult.appColor).not.toBe("rgba(0, 0, 0, 0)");
    expect(lightThemeResult.appColor).not.toBe(lightThemeResult.appBackground);

    await page.locator("#theme-mode").selectOption("dark");
    await page.getByRole("button", { name: "実行中に適用" }).click();
    await expect(page.locator("#component-status")).toContainText("themeMode");
    const darkThemeResult = await page.locator("ehagaki-composer").evaluate((element) => {
        const shadow = element.shadowRoot!;
        const appRoot = shadow.querySelector<HTMLElement>(".ehagaki-app-root")!;
        const footer = shadow.querySelector<HTMLElement>(".footer-bar")!;
        const footerButton = footer.querySelector<HTMLElement>("button")!;
        const appStyle = getComputedStyle(appRoot);
        const footerStyle = getComputedStyle(footer);
        const buttonStyle = getComputedStyle(footerButton);
        return {
            darkHostClass: element.classList.contains("dark"),
            appColor: appStyle.color,
            appBackground: appStyle.backgroundColor,
            footerColor: footerStyle.color,
            footerBackground: footerStyle.backgroundColor,
            buttonColor: buttonStyle.color,
            buttonBackground: buttonStyle.backgroundColor,
        };
    });
    expect(darkThemeResult.darkHostClass).toBe(true);
    expect(darkThemeResult.appColor).not.toBe("rgba(0, 0, 0, 0)");
    expect(darkThemeResult.appColor).not.toBe(darkThemeResult.appBackground);
    expect(darkThemeResult.footerColor).not.toBe(darkThemeResult.footerBackground);
    expect(darkThemeResult.buttonColor).not.toBe(darkThemeResult.buttonBackground);

    await page.getByRole("button", { name: "ブルー" }).click();
    await expect(page.locator("#style-background")).toHaveValue("#f3f7fb");
    await expect(page.locator("#style-text")).toHaveValue("#1d2a36");
    const afterBluePresetOnly = await page.locator("ehagaki-composer").evaluate((element) => element.style.getPropertyValue("--ehagaki-background"));
    expect(afterBluePresetOnly).toBe("");

    await page.getByRole("button", { name: "ミント" }).click();
    await expect(page.locator("#style-background")).toHaveValue("#f4f8f5");
    await expect(page.locator("#style-text")).toHaveValue("#183028");
    await expect(page.locator("#style-border")).toHaveValue("#b8c7be");
    await expect(page.locator("#style-link")).toHaveValue("#28764f");
    await expect(page.locator("#style-input")).toHaveValue("#ffffff");
    await expect(page.locator("#style-footer")).toHaveValue("#e2ebe5");
    await expect(page.locator("#style-dialog")).toHaveValue("#ffffff");
    await expect(page.locator("#style-font")).toHaveValue("system-ui, sans-serif");
    await expect(page.locator("#style-part-outline")).toHaveValue("#28764f");
    const afterPresetOnly = await page.locator("ehagaki-composer").evaluate((element) => Object.fromEntries([
        "--ehagaki-background",
        "--ehagaki-text",
        "--ehagaki-border",
        "--ehagaki-link",
        "--ehagaki-input-background",
        "--ehagaki-footer-background",
        "--ehagaki-dialog-background",
        "--ehagaki-font-family",
        "--sample-part-outline",
    ].map((property) => [property, element.style.getPropertyValue(property)])));
    expect(Object.values(afterPresetOnly).every((value) => value === "")).toBe(true);

    await page.locator("#style-text").fill("#102030");
    await page.locator("#style-border").fill("");
    await page.locator("#style-part-outline").fill("rgb(1, 2, 3)");
    await page.getByRole("button", { name: "入力したカスタムCSSを適用" }).click();
    const partialStyleResult = await page.locator("ehagaki-composer").evaluate((element) => ({
        outline: getComputedStyle(element.shadowRoot!.querySelector<HTMLElement>('[part~="header"]')!).outlineColor,
        background: element.style.getPropertyValue("--ehagaki-background"),
        text: element.style.getPropertyValue("--ehagaki-text"),
        border: element.style.getPropertyValue("--ehagaki-border"),
        computedBackground: getComputedStyle(element).getPropertyValue("--ehagaki-background").trim(),
    }));
    expect(partialStyleResult.outline).toBe("rgb(1, 2, 3)");
    expect(partialStyleResult.background).toBe("#f4f8f5");
    expect(partialStyleResult.text).toBe("#102030");
    expect(partialStyleResult.border).toBe("");
    expect(partialStyleResult.computedBackground).toBe("#f4f8f5");

    await page.getByRole("button", { name: "デフォルトに戻す" }).click();
    const resetStyleResult = await page.locator("ehagaki-composer").evaluate((element) => {
        const properties = [
            "--ehagaki-background",
            "--ehagaki-text",
            "--ehagaki-border",
            "--ehagaki-link",
            "--ehagaki-input-background",
            "--ehagaki-footer-background",
            "--ehagaki-dialog-background",
            "--ehagaki-font-family",
            "--sample-part-outline",
        ];
        return {
            inlineProperties: Object.fromEntries(properties.map((property) => [property, element.style.getPropertyValue(property)])),
            rootOutline: document.documentElement.style.getPropertyValue("--sample-part-outline"),
        };
    });
    expect(Object.values(resetStyleResult.inlineProperties).every((value) => value === "")).toBe(true);
    expect(resetStyleResult.rootOutline).toBe("");
    for (const id of [
        "style-background",
        "style-text",
        "style-border",
        "style-link",
        "style-input",
        "style-footer",
        "style-dialog",
        "style-font",
        "style-part-outline",
    ]) {
        await expect(page.locator(`#${id}`)).toHaveValue("");
    }

    await page.getByRole("button", { name: "ダーク" }).click();
    await expect(page.locator("#style-background")).toHaveValue("#181a1b");
    await expect(page.locator("#style-text")).toHaveValue("#e8e8e8");
    const darkPresetOnly = await page.locator("ehagaki-composer").evaluate((element) => ({
        background: element.style.getPropertyValue("--ehagaki-background"),
        text: element.style.getPropertyValue("--ehagaki-text"),
    }));
    expect(darkPresetOnly).toEqual({ background: "", text: "" });
    await page.getByRole("button", { name: "入力したカスタムCSSを適用" }).click();
    const darkPresetResult = await page.locator("ehagaki-composer").evaluate((element) => {
        const appRoot = element.shadowRoot!.querySelector<HTMLElement>(".ehagaki-app-root")!;
        const style = getComputedStyle(appRoot);
        return {
            background: element.style.getPropertyValue("--ehagaki-background"),
            text: element.style.getPropertyValue("--ehagaki-text"),
            appColor: style.color,
            appBackground: style.backgroundColor,
        };
    });
    expect(darkPresetResult.background).toBe("#181a1b");
    expect(darkPresetResult.text).toBe("#e8e8e8");
    expect(darkPresetResult.appColor).not.toBe(darkPresetResult.appBackground);
    await page.getByRole("button", { name: "デフォルトに戻す" }).click();

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

});

test("does not create a second primary while auto-mount waits for the module", async ({ page }) => {
    const moduleUrl = `${origin}/ehagaki/web-component/ehagaki-composer.js`;
    let releaseModule: () => void = () => undefined;
    let resolveModuleRequestStarted: () => void = () => undefined;
    const moduleRequestStarted = new Promise<void>((resolve) => {
        resolveModuleRequestStarted = resolve;
    });
    const moduleGate = new Promise<void>((resolve) => {
        releaseModule = resolve;
    });

    await page.route(moduleUrl, async (route) => {
        resolveModuleRequestStarted();
        await moduleGate;
        await route.continue();
    });

    try {
        await page.goto(`${origin}/ehagaki/web-component-parent-client-example.html`, { waitUntil: "commit" });
        await moduleRequestStarted;
        await page.getByRole("button", { name: "Create / Mount" }).click();
        releaseModule();

        await expect(page.locator("#module-status")).toContainText("module loaded");
        await expect(page.locator("#ready-status")).toHaveText("whenReady(): resolved");
        await expect(page.locator("#component-status")).toHaveText("component mounted");
        await expect(page.locator("ehagaki-composer")).toHaveCount(1);
        await expect(page.locator("#event-log")).not.toHaveValue(/multiple_instances_unsupported/);

        await page.locator("#theme-mode").selectOption("light");
        await page.getByRole("button", { name: "実行中に適用" }).click();
        await expect(page.locator("#component-status")).toContainText("themeMode");
        await expect(page.locator("ehagaki-composer")).toHaveCount(1);
    } finally {
        releaseModule();
        await page.unroute(moduleUrl);
    }
});

test("keeps the public sample container layout stable across destroy and recreate", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await page.goto(`${origin}/ehagaki/web-component-parent-client-example.html`);
    await expect(page.locator("#ready-status")).toHaveText("whenReady(): resolved");
    await expect.poll(() => page.locator("ehagaki-composer").evaluate((element) =>
        !!element.shadowRoot?.querySelector(".tiptap-editor"),
    )).toBe(true);
    const waitForStableEditorSurface = async () => {
        await page.waitForFunction(() => new Promise<boolean>((resolve) => {
            let previous = -1;
            let stableFrames = 0;
            const check = () => {
                const surface = document.querySelector("ehagaki-composer")
                    ?.shadowRoot?.querySelector<HTMLElement>(".tiptap-editor");
                const height = surface?.getBoundingClientRect().height ?? 0;
                stableFrames = Math.abs(height - previous) < 0.5 ? stableFrames + 1 : 0;
                previous = height;
                if (height > 0 && stableFrames >= 3) {
                    resolve(true);
                    return;
                }
                requestAnimationFrame(check);
            };
            check();
        }));
    };
    await waitForStableEditorSurface();
    const measure = () => page.locator("ehagaki-composer").evaluate((element) => {
        const shadow = element.shadowRoot!;
        const footer = shadow.querySelector<HTMLElement>(".footer-bar")!;
        const buttonBar = shadow.querySelector<HTMLElement>(".footer-button-bar")!;
        const component = element.getBoundingClientRect();
        const editorContainer = shadow.querySelector<HTMLElement>(".editor-container")!;
        const editorSurface = shadow.querySelector<HTMLElement>(".tiptap-editor")!;
        return {
            position: getComputedStyle(footer).position,
            component: { top: component.top, bottom: component.bottom, left: component.left, right: component.right },
            footer: footer.getBoundingClientRect().toJSON(),
            buttonBar: buttonBar.getBoundingClientRect().toJSON(),
            editorContainer: editorContainer.getBoundingClientRect().toJSON(),
            editorSurface: editorSurface.getBoundingClientRect().toJSON(),
        };
    });
    const first = await measure();
    await page.getByRole("button", { name: "Destroy / Unmount" }).click();
    await expect(page.locator("ehagaki-composer")).toHaveCount(0);
    await page.getByRole("button", { name: "Create / Mount" }).click();
    await expect(page.locator("#ready-status")).toHaveText("whenReady(): resolved");
    await expect.poll(() => page.locator("ehagaki-composer").evaluate((element) =>
        !!element.shadowRoot?.querySelector(".tiptap-editor"),
    )).toBe(true);
    await waitForStableEditorSurface();
    const second = await measure();

    await page.getByRole("button", { name: "Recreate" }).click();
    await expect(page.locator("#ready-status")).toHaveText("whenReady(): resolved");
    await expect.poll(() => page.locator("ehagaki-composer").evaluate((element) => {
        const shadow = element.shadowRoot;
        const editorContainer = shadow?.querySelector<HTMLElement>(".editor-container");
        const editorSurface = shadow?.querySelector<HTMLElement>(".tiptap-editor");
        return !!editorContainer
            && !!editorSurface
            && editorContainer.getBoundingClientRect().height > 0
            && editorSurface.getBoundingClientRect().height > 0;
    })).toBe(true);
    await waitForStableEditorSurface();
    const third = await measure();

    for (const snapshot of [first, second, third]) {
        expect(snapshot.position).toBe("absolute");
        for (const name of ["footer", "buttonBar"] as const) {
            expect(snapshot[name].left).toBeGreaterThanOrEqual(snapshot.component.left - 1);
            expect(snapshot[name].right).toBeLessThanOrEqual(snapshot.component.right + 1);
            expect(snapshot[name].bottom).toBeLessThanOrEqual(snapshot.component.bottom + 1);
            expect(snapshot[name].height).toBeGreaterThan(0);
        }
        expect(snapshot.editorContainer.height).toBeGreaterThan(0);
        expect(snapshot.editorSurface.height).toBeGreaterThan(0);
    }
    expect(second.editorSurface.height).toBeCloseTo(first.editorSurface.height, 0);
    expect(third.editorSurface.height).toBeCloseTo(first.editorSurface.height, 0);
    expect(pageErrors).toEqual([]);
});

test("demonstrates second-instance rejection and recreation after destroy", async ({ page }) => {
    await page.goto(`${origin}/ehagaki/web-component-parent-client-example.html`);
    await expect(page.locator("#ready-status")).toHaveText("whenReady(): resolved");

    await page.getByRole("button", { name: "2個目を生成" }).click();
    await expect(page.locator("#component-status")).toHaveText("2個目は inert: multiple_instances_unsupported");
    await expect(page.locator("#event-log")).toHaveValue(/multiple_instances_unsupported/);
    await expect(page.locator("ehagaki-composer")).toHaveCount(2);
    const secondInstanceStyles = await page.locator("ehagaki-composer").evaluateAll((elements) => elements.map((element) => ({
        background: element.style.getPropertyValue("--ehagaki-background"),
        partOutline: element.style.getPropertyValue("--sample-part-outline"),
    })));
    expect(secondInstanceStyles).toEqual([
        { background: "", partOutline: "" },
        { background: "", partOutline: "" },
    ]);

    await page.getByRole("button", { name: "Destroy / Unmount" }).click();
    await expect(page.locator("#component-status")).toContainText("persistent settings remain");
    await page.getByRole("button", { name: "Create / Mount" }).click();
    await expect(page.locator("#component-status")).toHaveText("component mounted");
    await expect(page.locator("#ready-status")).toHaveText("whenReady(): resolved");

    await page.getByRole("button", { name: "Recreate" }).click();
    await expect(page.locator("#component-status")).toHaveText("component mounted");
    await expect(page.locator("ehagaki-composer")).toHaveCount(1);

    await page.locator("#style-background").fill("#fefefe");
    await page.getByRole("button", { name: "入力したカスタムCSSを適用" }).click();
    await page.getByRole("button", { name: "Recreate" }).click();
    await expect(page.locator("#component-status")).toHaveText("component mounted");
    const recreatedStyle = await page.locator("ehagaki-composer").evaluate((element) => ({
        background: element.style.getPropertyValue("--ehagaki-background"),
        partOutline: element.style.getPropertyValue("--sample-part-outline"),
    }));
    expect(recreatedStyle).toEqual({ background: "", partOutline: "" });
});

test("does not auto-import query-selected modules outside manual mode", async ({ page }) => {
    await page.goto(`${origin}/ehagaki/web-component-parent-client-example.html?moduleUrl=${encodeURIComponent(`${origin}${securityFixturePath}`)}`);

    await expect(page.locator("#module-url")).toHaveValue(`${origin}/ehagaki/web-component/ehagaki-composer.js`);
    await expect(page.locator("#module-status")).toContainText("module loaded");
    await expect(page.locator("#ready-status")).toHaveText("whenReady(): resolved");
    await expect(page.locator("ehagaki-composer")).toHaveCount(1);
    expect(requests).not.toContain(securityFixturePath);
    expect(await page.evaluate(() => window.__securityFixtureLoaded === true)).toBe(false);
});

test("keeps arbitrary module loading explicit in manual mode", async ({ page }) => {
    await page.goto(`${origin}/ehagaki/web-component-parent-client-example.html?manual=1`);

    await expect(page.locator("#module-status")).toHaveText("module 未読み込み");
    await expect(page.locator("ehagaki-composer")).toHaveCount(0);
    await expect(page.locator("#module-url")).toBeEditable();
    expect(requests).not.toContain("/ehagaki/web-component/ehagaki-composer.js");
    expect(await page.evaluate(() => window.__securityFixtureLoaded === true)).toBe(false);

    await page.locator("#module-url").fill(`${origin}${securityFixturePath}`);
    await page.getByRole("button", { name: "Create / Mount" }).click();
    await expect(page.locator("#module-status")).toContainText("module loaded");
    await expect(page.locator("#module-url")).toBeDisabled();
    await expect(page.locator("#component-status")).toHaveText("component mounted");
    expect(requests).toContain(securityFixturePath);
    expect(await page.evaluate(() => window.__securityFixtureLoaded === true)).toBe(true);
});
