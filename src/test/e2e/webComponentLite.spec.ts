import { test, expect } from "@playwright/test";
import { createServer, type Server } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { finalizeEvent, generateSecretKey, nip19 } from "nostr-tools";
import { ensureWebComponentE2EOutput } from "../../../scripts/ensureWebComponentE2EOutput.mjs";
import { POST_EDITOR_MIN_HEIGHT } from "../../lib/postLayoutUtils";

let componentServer: Server;
let hostServer: Server;
let componentOrigin = "";
let hostOrigin = "";
const componentStoragePrefix = "ehagaki.web-component.v1:";

function listen(server: Server): Promise<number> {
    return new Promise((resolve) => server.listen(0, "127.0.0.1", () => {
        const address = server.address();
        resolve(typeof address === "object" && address ? address.port : 0);
    }));
}

function close(server: Server): Promise<void> {
    return new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}

function contentType(filePath: string): string {
    if (extname(filePath) === ".js") return "text/javascript";
    if (extname(filePath) === ".svg") return "image/svg+xml";
    return "application/octet-stream";
}

test.beforeAll(async () => {
    test.setTimeout(180_000);
    await ensureWebComponentE2EOutput();
    componentServer = createServer(async (request, response) => {
        const pathname = new URL(request.url ?? "/", componentOrigin).pathname;
        const filePath = normalize(join(process.cwd(), "dist-web-component", pathname === "/" ? "ehagaki-composer.js" : pathname.slice(1)));
        if (!filePath.startsWith(normalize(join(process.cwd(), "dist-web-component")))) {
            response.writeHead(400).end();
            return;
        }
        try {
            const body = await readFile(filePath);
            response.writeHead(200, { "Access-Control-Allow-Origin": "*", "Content-Type": contentType(filePath), "Cache-Control": "no-store" }).end(body);
        } catch {
            response.writeHead(404).end();
        }
    });
    componentOrigin = `http://127.0.0.1:${await listen(componentServer)}`;
    hostServer = createServer((_request, response) => response.writeHead(200, { "Content-Type": "text/html" }).end("<!doctype html><body></body>"));
    hostOrigin = `http://127.0.0.1:${await listen(hostServer)}`;
});

test.afterAll(async () => {
    await Promise.all([close(componentServer), close(hostServer)]);
});

async function mountHostOwned(page: import("@playwright/test").Page) {
    return await page.evaluate(async ({ componentOrigin }) => {
        const suffix = "/host-owned";
        await import(`${componentOrigin}${suffix}/ehagaki-composer.js`);
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            assetBase: string;
            configureHostOwned(options: unknown): void;
            whenReady(): Promise<void>;
            setContext(value: unknown): Promise<void>;
            setSettings(value: unknown): Promise<unknown>;
            setCustomEmojis(value: unknown): Promise<void>;
        };
        composer.assetBase = `${componentOrigin}${suffix}/`;
        const events: string[] = [];
        for (const name of ["ehagaki-ready", "ehagaki-post-success", "ehagaki-post-error", "ehagaki-initialization-error"]) {
            composer.addEventListener(name, () => events.push(name));
        }
        const submitted: unknown[] = [];
        composer.configureHostOwned({
            submit: (output: unknown) => { submitted.push(output); return { eventId: "a".repeat(64) }; },
            uploadMedia: (file: File) => ({ url: `https://example.invalid/${file.name}` }),
            contentWarningEnabled: true,
            hashtagPinEnabled: true,
        });
        document.body.append(composer);
        await composer.whenReady();
        await composer.setSettings({ mediaFreePlacement: true, imageQualityLevel: "low", videoQualityLevel: "low" });
        await composer.setCustomEmojis([{ shortcode: "wave", url: "https://example.invalid/wave.webp" }]);
        await composer.setContext({ content: "#lite", reply: "note1zyg3zyg3zyg3zyg3zyg3zyg3zyg3zyg3zyg3zyg3zyg3zyg3zygsglnzgl", quotes: [] });
        return { events, assetBase: composer.assetBase };
    }, { componentOrigin });
}

test("Lite minimal configuration exposes only text composition and preserves success/failure content", async ({ page }) => {
    await page.goto(hostOrigin);
    await page.evaluate(async ({ componentOrigin }) => {
        await import(`${componentOrigin}/host-owned/ehagaki-composer.js`);
        const state = { outputs: [] as any[], errors: 0, successEvents: 0 };
        (window as any).__liteMinimalState = state;
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            configureHostOwned(value: unknown): void;
            whenReady(): Promise<void>;
        };
        composer.configureHostOwned({
            submit(output: unknown) {
                state.outputs.push(JSON.parse(JSON.stringify(output)));
                return { eventId: "b".repeat(64) };
            },
        });
        composer.addEventListener("ehagaki-post-success", () => state.successEvents += 1);
        document.body.append(composer);
        await composer.whenReady();
    }, { componentOrigin });

    const composer = page.locator("ehagaki-composer");
    await expect(composer.locator(".image-button")).toHaveCount(0);
    await expect(composer.locator(".custom-emoji-button")).toHaveCount(0);
    await expect(composer.locator(".footer-button-bar")).toHaveCount(1);
    await expect(composer.locator(".tiptap-editor")).not.toHaveAttribute("enterkeyhint", "send");
    await expect(composer.locator("#content-warning-reason-input")).toHaveCount(0);
    await expect(composer.locator(".button-group-right button")).toHaveCount(0);
    await composer.locator(".tiptap-editor").click();
    await composer.locator(".tiptap-editor").pressSequentially("minimal text");
    await composer.locator("button.post-button").click();
    await expect.poll(() => page.evaluate(() => (window as any).__liteMinimalState.outputs.length)).toBe(1);
    await expect(composer.locator(".tiptap-editor")).toHaveText("");
    expect(await page.evaluate(() => (window as any).__liteMinimalState.outputs[0])).toMatchObject({
        content: "minimal text",
        tags: [],
    });

    await composer.locator(".tiptap-editor").click();
    await composer.locator(".tiptap-editor").pressSequentially("second text");
    await expect(composer.locator("button.post-button")).toBeEnabled();
    await composer.locator("button.post-button").click();
    await expect.poll(() => page.evaluate(() => (window as any).__liteMinimalState.outputs.length)).toBe(2);
    await expect(composer.locator(".tiptap-editor")).toHaveText("");
    const repeatedSubmit = await page.evaluate(() => (window as any).__liteMinimalState);
    expect(repeatedSubmit.successEvents).toBe(2);
    expect(repeatedSubmit.outputs[1]).toMatchObject({
        content: "second text",
        tags: [],
    });

    await page.evaluate(async () => {
        const composer = document.querySelector("ehagaki-composer") as HTMLElement & {
            configureHostOwned(value: unknown): void;
            whenReady(): Promise<void>;
        };
        composer.remove();
        const replacement = document.createElement("ehagaki-composer") as HTMLElement & {
            configureHostOwned(value: unknown): void;
            whenReady(): Promise<void>;
        };
        replacement.configureHostOwned({
            submit() {
                (window as any).__liteMinimalState.errors += 1;
                throw new Error("expected host failure");
            },
        });
        document.body.append(replacement);
        await replacement.whenReady();
    });
    const replacement = page.locator("ehagaki-composer");
    await replacement.locator(".tiptap-editor").click();
    await replacement.locator(".tiptap-editor").pressSequentially("keep after failure");
    await replacement.locator("button.post-button").click();
    await expect.poll(() => page.evaluate(() => (window as any).__liteMinimalState.errors)).toBe(1);
    await expect(replacement.locator(".tiptap-editor")).toContainText("keep after failure");
});

test("Lite applies host default and forced colors without exposing the settings dialog", async ({ page }) => {
    await page.goto(hostOrigin);
    const result = await page.evaluate(async ({ componentOrigin }) => {
        await import(`${componentOrigin}/host-owned/ehagaki-composer.js`);
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            configureHostOwned(value: unknown): void;
            whenReady(): Promise<void>;
        };
        composer.configureHostOwned({ submit: () => undefined });
        composer.style.setProperty("--ehagaki-default-accent-color", "#ABCDEF");
        composer.style.setProperty("--ehagaki-default-base-color", "#CDEFAB");
        document.body.append(composer);
        await composer.whenReady();

        const readColors = () => {
            const style = getComputedStyle(composer);
            const themeTarget = composer.shadowRoot!.querySelector<HTMLElement>(".ehagaki-app-root")!;
            const colorToPixel = (color: string) => {
                const probe = document.createElement("div");
                probe.style.backgroundColor = color;
                probe.style.position = "absolute";
                probe.style.width = "1px";
                probe.style.height = "1px";
                themeTarget.append(probe);
                const resolvedColor = getComputedStyle(probe).backgroundColor;
                probe.remove();
                const canvas = document.createElement("canvas");
                canvas.width = 1;
                canvas.height = 1;
                const context = canvas.getContext("2d")!;
                context.fillStyle = resolvedColor;
                context.fillRect(0, 0, 1, 1);
                return Array.from(context.getImageData(0, 0, 1, 1).data);
            };
            const tokenPixel = (token: string) => {
                return colorToPixel(`var(${token})`);
            };
            return {
                accent: style.getPropertyValue("--accent-color").trim().toLowerCase(),
                base: style.getPropertyValue("--base-color").trim().toLowerCase(),
                settingsButtons: composer.shadowRoot!.querySelectorAll("button.settings-btn").length,
                buttonPixel: colorToPixel("var(--surface-button)"),
                backgroundPixel: tokenPixel("--surface-bg"),
                editorPixel: tokenPixel("--surface-editor"),
                footerPixel: tokenPixel("--surface-footer"),
                buttonbarPixel: tokenPixel("--footer-buttonbar-bg"),
            };
        };

        const defaults = readColors();
        composer.style.setProperty("--ehagaki-accent-color", "#345678");
        composer.style.setProperty("--ehagaki-base-color", "#456789");
        const forced = readColors();
        composer.style.removeProperty("--ehagaki-accent-color");
        composer.style.removeProperty("--ehagaki-base-color");
        const released = readColors();
        composer.style.setProperty("--ehagaki-default-accent-color", "#FEDCBA");
        composer.style.setProperty("--ehagaki-default-base-color", "#EDCBAF");
        const updatedDefaults = readColors();

        return { defaults, forced, released, updatedDefaults };
    }, { componentOrigin });

    expect(result.defaults).toMatchObject({
        accent: "#abcdef", base: "#cdefab", settingsButtons: 0,
        buttonPixel: [243, 251, 235, 255],
        backgroundPixel: [240, 246, 234, 255], editorPixel: [252, 254, 250, 255],
        footerPixel: [214, 226, 203, 255], buttonbarPixel: [240, 246, 234, 255],
    });
    expect(result.forced).toMatchObject({
        accent: "#345678", base: "#456789", settingsButtons: 0,
        buttonPixel: [210, 219, 227, 255],
        backgroundPixel: [215, 221, 227, 255], editorPixel: [244, 246, 248, 255],
        footerPixel: [168, 180, 191, 255], buttonbarPixel: [215, 221, 227, 255],
    });
    expect(result.released).toMatchObject({
        accent: "#abcdef", base: "#cdefab", settingsButtons: 0,
        buttonPixel: [243, 251, 235, 255],
        backgroundPixel: [240, 246, 234, 255], editorPixel: [252, 254, 250, 255],
        footerPixel: [214, 226, 203, 255], buttonbarPixel: [240, 246, 234, 255],
    });
    expect(result.updatedDefaults).toMatchObject({
        accent: "#fedcba", base: "#edcbaf", settingsButtons: 0,
        buttonPixel: [251, 243, 236, 255],
        backgroundPixel: [245, 239, 234, 255], editorPixel: [254, 252, 250, 255],
        footerPixel: [225, 214, 204, 255], buttonbarPixel: [245, 239, 234, 255],
    });
});

test("Lite custom emoji catalog controls the button and closes an open picker when cleared", async ({ page }) => {
    await page.goto(hostOrigin);
    await page.evaluate(async ({ componentOrigin }) => {
        await import(`${componentOrigin}/host-owned/ehagaki-composer.js`);
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            configureHostOwned(value: unknown): void;
            whenReady(): Promise<void>;
            setCustomEmojis(value: unknown): Promise<void>;
        };
        composer.configureHostOwned({ submit: () => undefined });
        document.body.append(composer);
        await composer.whenReady();
        (window as any).__liteEmojiComposer = composer;
    }, { componentOrigin });

    const composer = page.locator("ehagaki-composer");
    await expect(composer.locator(".custom-emoji-button")).toHaveCount(0);
    await page.evaluate(async () => await (window as any).__liteEmojiComposer.setCustomEmojis([
        { shortcode: "wave", url: "https://example.invalid/wave.webp" },
    ]));
    await expect(composer.locator(".custom-emoji-button")).toHaveCount(1);
    await composer.locator(".custom-emoji-button").click();
    await expect(composer.locator(".custom-emoji-picker-region")).toHaveCount(1);
    await page.evaluate(async () => await (window as any).__liteEmojiComposer.setCustomEmojis([]));
    await expect(composer.locator(".custom-emoji-button")).toHaveCount(0);
    await expect(composer.locator(".custom-emoji-picker-region")).toHaveCount(0);
    await page.evaluate(async () => await (window as any).__liteEmojiComposer.setCustomEmojis([
        { shortcode: "wave", url: "https://example.invalid/wave.webp" },
    ]));
    await expect(composer.locator(".custom-emoji-button")).toHaveCount(1);
});

test("Lite disabled CW and hashtag pin do not carry shared state into a new instance", async ({ page }) => {
    await page.goto(hostOrigin);
    await page.evaluate(async ({ componentOrigin }) => {
        await import(`${componentOrigin}/host-owned/ehagaki-composer.js`);
        const enabled = document.createElement("ehagaki-composer") as HTMLElement & {
            configureHostOwned(value: unknown): void;
            whenReady(): Promise<void>;
        };
        enabled.configureHostOwned({ submit: () => undefined, contentWarningEnabled: true, hashtagPinEnabled: true });
        document.body.append(enabled);
        await enabled.whenReady();
        (window as any).__liteEnabledComposer = enabled;
    }, { componentOrigin });
    const enabled = page.locator("ehagaki-composer");
    await expect(enabled.locator(".button-group-right button")).toHaveCount(2);
    await enabled.locator(".button-group-right button").nth(0).click();
    await enabled.locator("#content-warning-reason-input").fill("stale reason");
    await enabled.locator(".button-group-right button").nth(1).click();
    await enabled.evaluate((element) => element.remove());

    await page.evaluate(async () => {
        const disabled = document.createElement("ehagaki-composer") as HTMLElement & {
            configureHostOwned(value: unknown): void;
            whenReady(): Promise<void>;
        };
        (window as any).__liteDisabledOutputs = [];
        disabled.configureHostOwned({
            submit(output: unknown) {
                (window as any).__liteDisabledOutputs.push(JSON.parse(JSON.stringify(output)));
                return undefined;
            },
        });
        document.body.append(disabled);
        await disabled.whenReady();
    });
    const disabled = page.locator("ehagaki-composer");
    await expect(disabled.locator(".button-group-right button")).toHaveCount(0);
    await expect(disabled.locator("#content-warning-reason-input")).toHaveCount(0);
    await disabled.locator(".tiptap-editor").click();
    await disabled.locator(".tiptap-editor").pressSequentially("#example");
    await disabled.locator("button.post-button").click();
    await expect.poll(() => page.evaluate(() => (window as any).__liteDisabledOutputs.length)).toBe(1);
    const output = await page.evaluate(() => (window as any).__liteDisabledOutputs[0]);
    expect(output.tags).toContainEqual(["t", "example"]);
    expect(output.tags.some((tag: string[]) => tag[0] === "content-warning")).toBe(false);
    await expect(disabled.locator(".tiptap-editor")).toHaveText("");
});

test("Lite validates keyboard and editor auto-grow options without consuming configuration after invalid input", async ({ page }) => {
    await page.goto(hostOrigin);
    const result = await page.evaluate(async ({ componentOrigin }) => {
        await import(`${componentOrigin}/host-owned/ehagaki-composer.js`);
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            configureHostOwned(value: unknown): void;
        };
        const invalidBoolean = (() => {
            try {
                composer.configureHostOwned({ submit: () => undefined, keyboardButtonBarEnabled: "false" });
                return "accepted";
            } catch (error) {
                return (error as Error).name;
            }
        })();
        const invalidEnum = (() => {
            try {
                composer.configureHostOwned({ submit: () => undefined, enterKeyBehavior: "send" });
                return "accepted";
            } catch (error) {
                return (error as Error).name;
            }
        })();
        const invalidEditorOptions = [
            { editorMinLines: 1 },
            { editorMaxLines: 3 },
            { editorMinLines: 0, editorMaxLines: 1 },
            { editorMinLines: 1.5, editorMaxLines: 2 },
            { editorMinLines: 1, editorMaxLines: Number.POSITIVE_INFINITY },
            { editorMinLines: 3, editorMaxLines: 1 },
        ].map((options) => {
            try {
                composer.configureHostOwned({ submit: () => undefined, ...options });
                return "accepted";
            } catch (error) {
                return (error as Error).name;
            }
        });
        composer.configureHostOwned({
            submit: () => undefined,
            keyboardButtonBarEnabled: false,
            enterKeyBehavior: "submit",
            editorMinLines: 1,
            editorMaxLines: 1,
        });
        return { invalidBoolean, invalidEnum, invalidEditorOptions };
    }, { componentOrigin });
    expect(result).toEqual({
        invalidBoolean: "TypeError",
        invalidEnum: "TypeError",
        invalidEditorOptions: ["TypeError", "TypeError", "TypeError", "TypeError", "TypeError", "TypeError"],
    });
});

test("Lite auto-grows the editor by rendered lines and keeps overflow inside Tiptap", async ({ page }) => {
    await page.goto(hostOrigin);
    await page.evaluate(async ({ componentOrigin }) => {
        await import(`${componentOrigin}/host-owned/ehagaki-composer.js`);
        const state = { submitted: 0 };
        (window as any).__liteAutoGrowState = state;
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            assetBase: string;
            configureHostOwned(value: unknown): void;
            whenReady(): Promise<void>;
            setContext(value: unknown): Promise<void>;
        };
        composer.assetBase = `${componentOrigin}/host-owned/`;
        composer.style.cssText = "display: block; width: 360px; height: 640px;";
        composer.configureHostOwned({
            submit: () => {
                state.submitted += 1;
                return { eventId: "a".repeat(64) };
            },
            editorMinLines: 1,
            editorMaxLines: 3,
            keyboardButtonBarEnabled: false,
        });
        document.body.append(composer);
        await composer.whenReady();
        (window as any).__liteAutoGrowComposer = composer;
    }, { componentOrigin });

    const composer = page.locator("ehagaki-composer");
    const editor = composer.locator(".tiptap-editor");
    const measure = () => page.evaluate(() => {
        const root = document.querySelector("ehagaki-composer")?.shadowRoot!;
        const editor = root.querySelector<HTMLElement>(".tiptap-editor")!;
        const outer = root.querySelector<HTMLElement>(".composer-scroll-region")!;
        const paragraph = editor.querySelector("p");
        const range = document.createRange();
        if (paragraph) range.selectNodeContents(paragraph);
        const visualLines = new Set(Array.from(range.getClientRects()).map((rect) => Math.round(rect.top))).size;
        return {
            height: Math.round(editor.getBoundingClientRect().height * 100) / 100,
            lineHeight: Number.parseFloat(getComputedStyle(editor).lineHeight),
            clientHeight: editor.clientHeight,
            scrollHeight: editor.scrollHeight,
            visualLines,
            outerClientHeight: outer.clientHeight,
            outerScrollHeight: outer.scrollHeight,
        };
    });

    const empty = await measure();
    await editor.click();
    await editor.pressSequentially("one line");
    await expect.poll(measure).toMatchObject({ height: empty.height });

    await editor.press("Enter");
    await editor.pressSequentially("two lines");
    await expect.poll(measure).toMatchObject({
        height: Math.round((empty.height + empty.lineHeight) * 100) / 100,
    });

    await editor.press("Enter");
    await editor.pressSequentially("three lines");
    await expect.poll(measure).toMatchObject({
        height: Math.round((empty.height + empty.lineHeight * 2) * 100) / 100,
    });

    await editor.press("Enter");
    await editor.pressSequentially("four lines");
    await expect.poll(measure).toMatchObject({
        height: Math.round((empty.height + empty.lineHeight * 2) * 100) / 100,
    });
    expect(await measure()).toMatchObject({
        outerScrollHeight: expect.any(Number),
    });
    const explicitOverflow = await measure();
    expect(explicitOverflow.scrollHeight).toBeGreaterThan(explicitOverflow.clientHeight);
    expect(explicitOverflow.outerScrollHeight).toBeLessThanOrEqual(explicitOverflow.outerClientHeight + 1);

    await page.evaluate(async () => {
        await (window as any).__liteAutoGrowComposer.setContext({ content: "W".repeat(200) });
    });
    await expect.poll(measure).toMatchObject({
        height: Math.round((empty.height + empty.lineHeight * 2) * 100) / 100,
    });
    const softWrapped = await measure();
    expect(softWrapped.visualLines).toBeGreaterThanOrEqual(4);
    expect(softWrapped.scrollHeight).toBeGreaterThan(softWrapped.clientHeight);

    await page.evaluate(async () => {
        await (window as any).__liteAutoGrowComposer.setContext({ content: "delete me" });
    });
    await expect.poll(measure).toMatchObject({ height: empty.height });
    await editor.click();
    await editor.press("Control+A");
    await editor.press("Backspace");
    await expect.poll(measure).toMatchObject({ height: empty.height });

    await page.evaluate(async () => {
        await (window as any).__liteAutoGrowComposer.setContext({ content: "submit and clear" });
    });
    await editor.press("Control+Enter");
    await expect.poll(() => page.evaluate(() => (window as any).__liteAutoGrowState.submitted)).toBe(1);
    await expect.poll(measure).toMatchObject({ height: empty.height });
    await expect(editor).toHaveText("");
});

test("Lite publishes the measured preferred height before ready and reacts to ReasonInput", async ({ page }) => {
    await page.goto(hostOrigin);
    const initial = await page.evaluate(async ({ componentOrigin }) => {
        await import(`${componentOrigin}/host-owned/ehagaki-composer.js`);
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            assetBase: string;
            preferredHeight: number | null;
            configureHostOwned(value: unknown): void;
            whenReady(): Promise<void>;
        };
        composer.assetBase = `${componentOrigin}/host-owned/`;
        composer.style.cssText = "display: block; width: 320px; height: 640px;";
        const preferredEvents: number[] = [];
        let preferredHeightAtReady: number | null = null;
        composer.addEventListener("ehagaki-preferred-height-change", (event) => {
            const height = (event as CustomEvent<{ height: number }>).detail.height;
            preferredEvents.push(height);
            composer.style.height = `${height}px`;
        });
        composer.addEventListener("ehagaki-ready", () => {
            preferredHeightAtReady = composer.preferredHeight;
        });
        composer.configureHostOwned({
            submit: () => undefined,
            contentWarningEnabled: true,
            editorMinLines: 1,
            editorMaxLines: 3,
        });
        document.body.append(composer);
        await composer.whenReady();
        const surface = composer.shadowRoot!.querySelector<HTMLElement>(".composer-scroll-content")!;
        return {
            preferredHeight: composer.preferredHeight,
            preferredHeightAtReady,
            preferredEvents,
            expectedHeight: Math.ceil(surface.getBoundingClientRect().height + 50),
        };
    }, { componentOrigin });

    expect(initial.preferredHeight).toBeGreaterThan(0);
    expect(Number.isInteger(initial.preferredHeight)).toBe(true);
    expect(initial.preferredHeight).toBe(initial.expectedHeight);
    expect(initial.preferredHeightAtReady).toBe(initial.preferredHeight);
    expect(initial.preferredEvents).toEqual([initial.preferredHeight]);

    const composer = page.locator("ehagaki-composer");
    const waitForPreferredHeight = () => page.evaluate(() => new Promise<number>((resolve) => {
        const element = document.querySelector("ehagaki-composer")!;
        element.addEventListener("ehagaki-preferred-height-change", (event) => {
            resolve((event as CustomEvent<{ height: number }>).detail.height);
        }, { once: true });
    }));

    const showReasonInput = waitForPreferredHeight();
    await composer.locator(".button-group-right button").first().click();
    const withReasonInput = await showReasonInput;
    expect(withReasonInput).toBe(initial.preferredHeight! + 50);

    const hideReasonInput = waitForPreferredHeight();
    await composer.locator(".button-group-right button").first().click();
    expect(await hideReasonInput).toBe(initial.preferredHeight);
});

test("Lite keeps an explicit auto-grow range while the emoji picker makes the Composer overflow", async ({ page }) => {
    await page.goto(hostOrigin);
    await page.evaluate(async ({ componentOrigin }) => {
        await import(`${componentOrigin}/host-owned/ehagaki-composer.js`);
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            assetBase: string;
            configureHostOwned(value: unknown): void;
            whenReady(): Promise<void>;
            setContext(value: unknown): Promise<void>;
            setCustomEmojis(value: unknown): Promise<void>;
        };
        composer.assetBase = `${componentOrigin}/host-owned/`;
        composer.style.cssText = "display: block; width: 360px; height: 132px;";
        composer.configureHostOwned({
            submit: () => undefined,
            editorMinLines: 1,
            editorMaxLines: 3,
        });
        document.body.append(composer);
        await composer.whenReady();
        await composer.setCustomEmojis([{ shortcode: "wave", url: "https://example.invalid/wave.webp" }]);
        await composer.setContext({ content: "one\ntwo\nthree\nfour" });
    }, { componentOrigin });

    const composer = page.locator("ehagaki-composer");
    const beforePicker = await composer.evaluate((element) => {
        const editor = element.shadowRoot!.querySelector<HTMLElement>(".tiptap-editor")!;
        const style = getComputedStyle(editor);
        return {
            height: editor.getBoundingClientRect().height,
            minHeight: Number.parseFloat(style.minHeight),
            maxHeight: Number.parseFloat(style.maxHeight),
        };
    });
    expect(beforePicker.height).toBeCloseTo(beforePicker.maxHeight, 1);
    await composer.locator(".custom-emoji-button").click();
    await expect(composer.locator(".custom-emoji-picker-region")).toHaveCount(1);
    const afterPicker = await composer.evaluate((element) => {
        const shadow = element.shadowRoot!;
        const editor = shadow.querySelector<HTMLElement>(".tiptap-editor")!;
        const outer = shadow.querySelector<HTMLElement>(".composer-scroll-region")!;
        const style = getComputedStyle(editor);
        return {
            height: editor.getBoundingClientRect().height,
            minHeight: Number.parseFloat(style.minHeight),
            maxHeight: Number.parseFloat(style.maxHeight),
            outerClientHeight: outer.clientHeight,
            outerScrollHeight: outer.scrollHeight,
        };
    });
    expect(afterPicker.height).toBeCloseTo(beforePicker.height, 1);
    expect(afterPicker.minHeight).toBe(beforePicker.minHeight);
    expect(afterPicker.maxHeight).toBe(beforePicker.maxHeight);
    expect(afterPicker.outerScrollHeight).toBeGreaterThan(afterPicker.outerClientHeight);
});

test("Lite keyboard options hide the bar and submit plain Enter repeatedly", async ({ page }) => {
    await page.goto(hostOrigin);
    await page.evaluate(async ({ componentOrigin }) => {
        await import(`${componentOrigin}/host-owned/ehagaki-composer.js`);
        const state = { outputs: [] as any[] };
        (window as any).__liteKeyboardState = state;
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            configureHostOwned(value: unknown): void;
            whenReady(): Promise<void>;
        };
        composer.configureHostOwned({
            submit(output: unknown) {
                state.outputs.push(JSON.parse(JSON.stringify(output)));
                return { eventId: "c".repeat(64) };
            },
            keyboardButtonBarEnabled: false,
            enterKeyBehavior: "submit",
        });
        document.body.append(composer);
        await composer.whenReady();
    }, { componentOrigin });

    const composer = page.locator("ehagaki-composer");
    await expect(composer.locator(".footer-button-bar")).toHaveCount(0);
    await expect(composer.locator(".tiptap-editor")).toHaveAttribute("enterkeyhint", "send");
    const layout = await composer.evaluate((element) => {
        const style = getComputedStyle(element.shadowRoot!.querySelector<HTMLElement>(".ehagaki-web-component-shell")!);
        return {
            barHeight: style.getPropertyValue("--keyboard-button-bar-height").trim(),
            reservedHeight: style.getPropertyValue("--composer-bottom-reserved-height").trim(),
            reasonBottom: style.getPropertyValue("--reason-input-bottom").trim(),
        };
    });
    expect(layout).toEqual({ barHeight: "0px", reservedHeight: "0px", reasonBottom: "0px" });

    const editor = composer.locator(".tiptap-editor");
    await editor.click();
    await page.clock.install();
    // Keep the ContentTrackingExtension's 300ms timer pending while the real
    // keyboard path receives Enter, so this cannot pass because of elapsed time
    // between separate Playwright actions.
    await editor.pressSequentially("first post");
    await editor.press("Enter");
    await expect.poll(() => page.evaluate(() => (window as any).__liteKeyboardState.outputs.length)).toBe(1);
    await expect(editor).toHaveText("");

    await editor.pressSequentially("second post");
    await editor.press("Enter");
    await expect.poll(() => page.evaluate(() => (window as any).__liteKeyboardState.outputs.length)).toBe(2);
    await expect(editor).toHaveText("");

    const waitForContentTracking = () => page.evaluate(() => new Promise<void>((resolve) => {
        window.addEventListener("editor-content-changed", () => resolve(), { once: true });
    }));
    let contentTracking = waitForContentTracking();
    await editor.pressSequentially("line one");
    await page.clock.fastForward(300);
    await contentTracking;
    // Playwright's mobile device emulation does not provide a physical
    // keyboard. Dispatch the modifier explicitly to test the handler contract
    // consistently across Chromium and WebKit.
    await page.evaluate(() => {
        const editor = document.querySelector("ehagaki-composer")?.shadowRoot?.querySelector<HTMLElement>(".tiptap-editor");
        editor?.dispatchEvent(new KeyboardEvent("keydown", {
            key: "Enter",
            bubbles: true,
            cancelable: true,
            shiftKey: true,
        }));
    });
    await expect.poll(() => page.evaluate(() => (window as any).__liteKeyboardState.outputs.length)).toBe(2);
    await expect(editor).toContainText("line one");
    await editor.press("Enter");
    await expect.poll(() => page.evaluate(() => (window as any).__liteKeyboardState.outputs.length)).toBe(3);
    await expect(editor).toHaveText("");
});

test("Lite default newline mode keeps Enter as a newline and Ctrl+Enter as submit", async ({ page }) => {
    await page.goto(hostOrigin);
    await page.evaluate(async ({ componentOrigin }) => {
        await import(`${componentOrigin}/host-owned/ehagaki-composer.js`);
        const state = { outputs: [] as unknown[] };
        (window as any).__liteDefaultKeyboardState = state;
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            configureHostOwned(value: unknown): void;
            whenReady(): Promise<void>;
        };
        composer.configureHostOwned({
            submit(output: unknown) {
                state.outputs.push(output);
                return { eventId: "d".repeat(64) };
            },
        });
        document.body.append(composer);
        await composer.whenReady();
    }, { componentOrigin });

    const composer = page.locator("ehagaki-composer");
    const editor = composer.locator(".tiptap-editor");
    await editor.click();
    const waitForContentTracking = () => page.evaluate(() => new Promise<void>((resolve) => {
        window.addEventListener("editor-content-changed", () => resolve(), { once: true });
    }));
    let contentTracking = waitForContentTracking();
    await editor.pressSequentially("newline text");
    await contentTracking;
    contentTracking = waitForContentTracking();
    await editor.press("Enter");
    await contentTracking;
    await expect(composer.locator(".tiptap-editor > p")).toHaveCount(2);
    await expect.poll(() => page.evaluate(() => (window as any).__liteDefaultKeyboardState.outputs.length)).toBe(0);

    await editor.press("Control+Enter");
    await expect.poll(() => page.evaluate(() => (window as any).__liteDefaultKeyboardState.outputs.length)).toBe(1);
    await expect(editor).toHaveText("");
});

test("Lite requires pre-connect Host-owned configuration without making assetBase a hard error", async ({ page }) => {
    await page.goto(hostOrigin);
    const result = await page.evaluate(async ({ componentOrigin }) => {
        await import(`${componentOrigin}/host-owned/ehagaki-composer.js`);
        const composer = document.createElement("ehagaki-composer") as HTMLElement & { whenReady(): Promise<void> };
        const events: string[] = [];
        composer.addEventListener("ehagaki-initialization-error", () => events.push("error"));
        document.body.append(composer);
        const rejected = await composer.whenReady().then(() => false, () => true);
        return { rejected, events };
    }, { componentOrigin });
    expect(result).toEqual({ rejected: true, events: ["error"] });
});

test("Lite ignores auto-login while preserving Host-owned ready", async ({ page }) => {
    await page.goto(hostOrigin);
    const result = await page.evaluate(async ({ componentOrigin }) => {
        let getPublicKeyCalls = 0;
        window.nostr = {
            getPublicKey: async () => {
                getPublicKeyCalls += 1;
                return "ab".repeat(32);
            },
            signEvent: async (event: unknown) => event,
        } as any;
        await import(`${componentOrigin}/host-owned/ehagaki-composer.js`);
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            autoLogin: boolean;
            configureHostOwned(options: unknown): void;
            whenReady(): Promise<void>;
        };
        composer.setAttribute("auto-login", "");
        let readyEvents = 0;
        composer.addEventListener("ehagaki-ready", () => readyEvents += 1);
        composer.configureHostOwned({ submit: () => undefined });
        document.body.append(composer);
        await composer.whenReady();
        return { autoLogin: composer.autoLogin, getPublicKeyCalls, readyEvents };
    }, { componentOrigin });

    expect(result).toEqual({ autoLogin: true, getPublicKeyCalls: 0, readyEvents: 1 });
});

test("Lite configuration is immutable and aborts host work when disconnected", async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto(hostOrigin);
    await page.evaluate(async ({ componentOrigin }) => {
        await import(`${componentOrigin}/host-owned/ehagaki-composer.js`);
        const state = { uploadCalls: 0, aborted: false, resolveUpload: null as ((value: unknown) => void) | null };
        (window as any).__liteAbortState = state;
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            configureHostOwned(value: unknown): void;
            whenReady(): Promise<void>;
            setSettings(value: unknown): Promise<unknown>;
        };
        const options = {
            submit: () => ({ eventId: "a".repeat(64) }),
            uploadMedia: (_file: File, _metadata: unknown, { signal }: { signal: AbortSignal }) => {
                state.uploadCalls += 1;
                signal.addEventListener("abort", () => { state.aborted = true; }, { once: true });
                return new Promise((resolve) => { state.resolveUpload = resolve; });
            },
        };
        composer.configureHostOwned(options);
        let secondConfigure = "resolved";
        try { composer.configureHostOwned(options); } catch (error) { secondConfigure = (error as Error).name; }
        document.body.append(composer);
        await composer.whenReady();
        await composer.setSettings({ imageCompressionLevel: "none" });
        (window as any).__liteSecondConfigure = secondConfigure;
    }, { componentOrigin });
    expect(await page.evaluate(() => (window as any).__liteSecondConfigure)).toBe("InvalidStateError");
    const composer = page.locator("ehagaki-composer");
    await composer.locator('input[type="file"]').setInputFiles({
        name: "pending.png",
        mimeType: "image/png",
        buffer: Buffer.alloc(21 * 1024),
    });
    await expect.poll(() => page.evaluate(() => (window as any).__liteAbortState.uploadCalls)).toBe(1);
    await composer.evaluate((element) => element.remove());
    await expect.poll(() => page.evaluate(() => (window as any).__liteAbortState.aborted)).toBe(true);
});

test("Lite does not flow into account, history, or relay state", async ({ page }) => {
    await page.goto(hostOrigin);
    await page.evaluate(({ componentStoragePrefix }) => {
        localStorage.setItem(`${componentStoragePrefix}nostr-accounts`, JSON.stringify([{ pubkeyHex: "f".repeat(64), type: "nip07" }]));
        localStorage.setItem(`${componentStoragePrefix}nostr-active-account`, "f".repeat(64));
        localStorage.setItem(`${componentStoragePrefix}nostr-relays-f${"f".repeat(63)}`, JSON.stringify({ "wss://example.invalid": { read: true, write: true } }));
    }, { componentStoragePrefix });
    await mountHostOwned(page);
    const state = await page.evaluate(() => ({
        postHistory: document.querySelector("ehagaki-composer")?.shadowRoot?.querySelectorAll(".post-history-btn").length ?? 0,
        login: document.querySelector("ehagaki-composer")?.shadowRoot?.querySelectorAll("button.login-btn").length ?? 0,
        placeholder: document.querySelector("ehagaki-composer")?.shadowRoot?.querySelectorAll(".editor-account-placeholder").length ?? 0,
    }));
    expect(state).toEqual({ postHistory: 0, login: 0, placeholder: 0 });
});

test("Lite keeps the explicit distribution asset base and lifecycle", async ({ page }) => {
    await page.goto(hostOrigin);
    const lite = await mountHostOwned(page);
    expect(lite.events).toContain("ehagaki-ready");
    expect(lite.assetBase).toBe(`${componentOrigin}/host-owned/`);
});

test("Lite keeps the Host-owned public contract across context, submission, media, and reconnect", async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto(hostOrigin);
    const replyEvent = finalizeEvent({ kind: 1, content: "preloaded Lite reply", tags: [], created_at: 1 }, generateSecretKey());
    const quoteEvent = finalizeEvent({ kind: 1, content: "preloaded Lite quote", tags: [], created_at: 2 }, generateSecretKey());
    const reply = nip19.noteEncode(replyEvent.id);
    const quote = nip19.noteEncode(quoteEvent.id);
    const channel = nip19.noteEncode("d".repeat(64));
    await page.evaluate(async ({ componentOrigin, reply, quote, channel, replyEvent, quoteEvent }) => {
        await import(`${componentOrigin}/host-owned/ehagaki-composer.js`);
        const state = { outputs: [] as any[], uploads: 0, events: [] as string[] };
        (window as any).__liteContractState = state;
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            assetBase: string;
            configureHostOwned(value: unknown): void;
            whenReady(): Promise<void>;
            setContext(value: unknown): Promise<void>;
            setSettings(value: unknown): Promise<unknown>;
            setCustomEmojis(value: unknown): Promise<void>;
        };
        composer.assetBase = `${componentOrigin}/host-owned/`;
        composer.style.width = "360px";
        composer.style.height = "640px";
        composer.configureHostOwned({
            contentWarningEnabled: true,
            hashtagPinEnabled: true,
            submit(output: unknown) {
                state.outputs.push(JSON.parse(JSON.stringify(output)));
                return { eventId: "c".repeat(64) };
            },
            uploadMedia(file: File) {
                state.uploads += 1;
                return { url: `https://host.example/${file.name}`, imeta: { m: file.type, size: String(file.size) } };
            },
        });
        for (const name of ["ehagaki-ready", "ehagaki-post-success", "ehagaki-post-error", "ehagaki-composer-context-updated"]) {
            composer.addEventListener(name, () => state.events.push(name));
        }
        const context = composer.setContext({
            content: "Lite seeded #context",
            reply,
            quotes: [quote],
            channel: {
                reference: channel,
                name: "Lite channel",
                about: "Host supplied channel preview",
            },
            preloadedEvents: { [replyEvent.id]: replyEvent, [quoteEvent.id]: quoteEvent },
        });
        document.body.append(composer);
        await composer.whenReady();
        await context;
        await composer.setSettings({ mediaFreePlacement: true, imageCompressionLevel: "none", videoCompressionLevel: "none" });
        await composer.setCustomEmojis([{ shortcode: "wave", url: "https://example.invalid/wave.webp" }]);
    }, { componentOrigin, reply, quote, channel, replyEvent, quoteEvent });

    const composer = page.locator("ehagaki-composer");
    await expect(composer.locator(".tiptap-editor")).toContainText("Lite seeded #context");
    await composer.locator(".reply-quote-preview").first().getByRole("button").first().click();
    await composer.locator(".reply-quote-preview").last().getByRole("button").first().click();
    await expect(composer.locator(".reply-quote-preview").first()).toContainText("preloaded Lite reply");
    await expect(composer.locator(".reply-quote-preview").last()).toContainText("preloaded Lite quote");
    await expect(composer.locator(".channel-context-preview")).toContainText("Lite channel");
    const closedGeometry = await composer.evaluate((element) => {
        const shadow = element.shadowRoot!;
        const component = element.getBoundingClientRect();
        const bar = shadow.querySelector<HTMLElement>(".footer-button-bar")!;
        const region = shadow.querySelector<HTMLElement>(".composer-scroll-region")!;
        return {
            footerPresent: !!shadow.querySelector(".footer-bar"),
            barBottom: bar.getBoundingClientRect().bottom,
            componentBottom: component.bottom,
            regionHeight: region.getBoundingClientRect().height,
        };
    });
    expect(closedGeometry.footerPresent).toBe(false);
    expect(Math.abs(closedGeometry.barBottom - closedGeometry.componentBottom)).toBeLessThanOrEqual(1);
    expect(closedGeometry.regionHeight).toBeGreaterThan(POST_EDITOR_MIN_HEIGHT);
    await composer.locator(".tiptap-editor").click();
    await composer.locator(".tiptap-editor").pressSequentially(" body #LiteTag ");
    await composer.locator(".button-group-right button").nth(0).click();
    await composer.locator("#content-warning-reason-input").fill("Lite CW");
    const warningGeometry = await composer.evaluate((element) => {
        const shadow = element.shadowRoot!;
        const reason = shadow.querySelector<HTMLElement>(".reason-input-container")!;
        const bar = shadow.querySelector<HTMLElement>(".footer-button-bar")!;
        return { reasonBottom: reason.getBoundingClientRect().bottom, barTop: bar.getBoundingClientRect().top };
    });
    expect(Math.abs(warningGeometry.reasonBottom - warningGeometry.barTop)).toBeLessThanOrEqual(1);
    await composer.locator(".custom-emoji-button").click();
    await composer.locator(".emoji-button[aria-label=':wave:']").click();
    await composer.locator('input[type="file"]').setInputFiles({
        name: "lite-media.png",
        mimeType: "image/png",
        buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64"),
    });
    await expect.poll(() => page.evaluate(() => (window as any).__liteContractState.uploads)).toBe(1);
    await composer.locator("button.post-button").click();
    await expect.poll(() => page.evaluate(() => (window as any).__liteContractState.outputs.length)).toBe(1);

    const result = await page.evaluate(async () => {
        const state = (window as any).__liteContractState;
        const current = document.querySelector("ehagaki-composer") as HTMLElement & { whenReady(): Promise<void> };
        current.remove();
        document.body.append(current);
        await current.whenReady();
        return state;
    });
    expect(result.events).toEqual(expect.arrayContaining([
        "ehagaki-ready",
        "ehagaki-composer-context-updated",
        "ehagaki-post-success",
    ]));
    expect(result.outputs[0]).toMatchObject({
        content: expect.stringContaining("#LiteTag"),
        context: {
            reply: { eventId: replyEvent.id },
            quotes: [{ eventId: quoteEvent.id }],
        },
    });
    expect(result.outputs[0].tags).toEqual(expect.arrayContaining([
        ["t", "litetag"],
        ["content-warning", "Lite CW"],
        ["emoji", "wave", "https://example.invalid/wave.webp"],
        expect.arrayContaining(["imeta", "url https://host.example/lite-media.png", "m image/png"]),
    ]));
});

test("Lite rejects setContext before changing context while Host submit is pending", async ({ page }) => {
    await page.goto(hostOrigin);
    const reply = nip19.noteEncode("b".repeat(64));
    const channel = nip19.noteEncode("c".repeat(64));
    await page.evaluate(async ({ componentOrigin, reply, channel }) => {
        await import(`${componentOrigin}/host-owned/ehagaki-composer.js`);
        const state = {
            submitStarted: false,
            submitted: null as any,
            resolveSubmit: null as ((value: unknown) => void) | null,
            events: [] as string[],
        };
        (window as any).__litePendingSubmitState = state;
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            configureHostOwned(value: unknown): void;
            whenReady(): Promise<void>;
            setContext(value: unknown): Promise<void>;
            setSettings(value: unknown): Promise<unknown>;
        };
        composer.configureHostOwned({
            submit(output: unknown) {
                state.submitStarted = true;
                state.submitted = JSON.parse(JSON.stringify(output));
                return new Promise((resolve) => { state.resolveSubmit = resolve; });
            },
        });
        composer.addEventListener("ehagaki-post-success", () => state.events.push("success"));
        document.body.append(composer);
        await composer.whenReady();
        await composer.setSettings({ imageCompressionLevel: "none", videoCompressionLevel: "none" });
        await composer.setContext({
            content: "before pending submit",
            reply,
            quotes: [],
            channel: { reference: channel, name: "before channel", about: "before channel about" },
        });
    }, { componentOrigin, reply, channel });

    const composer = page.locator("ehagaki-composer");
    await expect(composer.locator(".tiptap-editor")).toContainText("before pending submit");
    await expect(composer.locator(".reply-quote-preview")).toHaveCount(1);
    await expect(composer.locator(".channel-context-preview")).toContainText("before channel");
    await composer.locator("button.post-button").click();
    await expect.poll(() => page.evaluate(() => (window as any).__litePendingSubmitState.submitStarted)).toBe(true);

    const pending = await page.evaluate(async () => {
        const composer = document.querySelector("ehagaki-composer") as HTMLElement & {
            setContext(value: unknown): Promise<void>;
        };
        const result = await composer.setContext({
            content: "must not apply while pending",
            reply: null,
            quotes: [],
            channel: null,
        }).then(
            () => "resolved",
            (error: Error) => error.message,
        );
        const shadow = composer.shadowRoot!;
        return {
            result,
            content: shadow.querySelector(".tiptap-editor")?.textContent ?? "",
            replies: shadow.querySelectorAll(".reply-quote-preview").length,
            channel: shadow.querySelector(".channel-context-preview")?.textContent ?? "",
            submitted: (window as any).__litePendingSubmitState.submitted,
        };
    });
    expect(pending.result).toBe("submission_in_progress");
    expect(pending.content).toContain("before pending submit");
    expect(pending.replies).toBe(1);
    expect(pending.channel).toContain("before channel");
    expect(pending.submitted.content).toContain("before pending submit");

    await page.evaluate(() => {
        (window as any).__litePendingSubmitState.resolveSubmit({ eventId: "d".repeat(64) });
    });
    await expect.poll(() => page.evaluate(() => (window as any).__litePendingSubmitState.events)).toContain("success");
    await expect(composer.locator(".tiptap-editor")).toHaveText("");
    await expect(composer.locator(".reply-quote-preview")).toHaveCount(0);
    await expect(composer.locator(".channel-context-preview")).toContainText("before channel");
});

test("Lite ignores a stale upload completion after reconnect", async ({ page }) => {
    await page.goto(hostOrigin);
    await page.evaluate(async ({ componentOrigin }) => {
        await import(`${componentOrigin}/host-owned/ehagaki-composer.js`);
        const state = {
            uploads: [] as string[],
            deferred: {} as Record<string, (value: unknown) => void>,
        };
        (window as any).__liteStaleUploadState = state;
        const composer = document.createElement("ehagaki-composer") as HTMLElement & {
            configureHostOwned(value: unknown): void;
            whenReady(): Promise<void>;
            setSettings(value: unknown): Promise<unknown>;
        };
        composer.configureHostOwned({
            submit: () => ({ eventId: "a".repeat(64) }),
            uploadMedia(file: File) {
                state.uploads.push(file.name);
                return new Promise((resolve) => { state.deferred[file.name] = resolve; });
            },
        });
        document.body.append(composer);
        await composer.whenReady();
        await composer.setSettings({ imageCompressionLevel: "none", mediaFreePlacement: true });
        (window as any).__liteStaleUploadComposer = composer;
    }, { componentOrigin });
    const png = {
        name: "stale.png",
        mimeType: "image/png",
        buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64"),
    };
    const composer = page.locator("ehagaki-composer");
    await composer.locator('input[type="file"]').setInputFiles(png);
    await expect.poll(() => page.evaluate(() => (window as any).__liteStaleUploadState.uploads.length)).toBe(1);
    await composer.evaluate((element) => element.remove());
    await page.evaluate(async () => {
        const composer = (window as any).__liteStaleUploadComposer as HTMLElement & {
            whenReady(): Promise<void>;
            setSettings(value: unknown): Promise<unknown>;
        };
        document.body.append(composer);
        await composer.whenReady();
        await composer.setSettings({ imageCompressionLevel: "none", mediaFreePlacement: true });
    });
    await page.locator("ehagaki-composer").locator('input[type="file"]').setInputFiles({ ...png, name: "current.png" });
    await expect.poll(() => page.evaluate(() => (window as any).__liteStaleUploadState.uploads.length)).toBe(2);
    await page.evaluate(() => (window as any).__liteStaleUploadState.deferred["stale.png"]({
        url: "https://host.example/stale.png",
        imeta: { m: "image/png", alt: "stale" },
    }));
    await expect(page.locator("ehagaki-composer img[src='https://host.example/stale.png']")).toHaveCount(0);
    await page.evaluate(() => (window as any).__liteStaleUploadState.deferred["current.png"]({
        url: "https://host.example/current.png",
        imeta: { m: "image/png", alt: "current" },
    }));
    await expect(page.locator("ehagaki-composer img[src='https://host.example/current.png']")).toHaveCount(1);
});

test("Lite rejects a full/Lite dual import deterministically", async ({ page }) => {
    await page.goto(hostOrigin);
    const result = await page.evaluate(async ({ componentOrigin }) => {
        await import(`${componentOrigin}/ehagaki-composer.js`);
        return await import(`${componentOrigin}/host-owned/ehagaki-composer.js`).then(
            () => "resolved",
            (error) => String(error.message),
        );
    }, { componentOrigin });
    expect(result).toContain("Cannot import the host-owned-lite");
});

test("Lite Resource Timing keeps initial media code lazy and resolves every capability from its own distribution", async ({ page, browserName, isMobile }) => {
    test.skip(browserName !== "chromium" || isMobile, "The controlled native-AAC-unavailable path requires desktop Chromium WebCodecs.");
    test.setTimeout(90_000);
    await page.goto(hostOrigin);
    await mountHostOwned(page);
    const initial = await page.evaluate(() => performance.getEntriesByType("resource").map((entry) => entry.name));
    for (const capability of ["HostOwnedCustomEmojiPicker-", "browser-image-compression-", "mediabunnyCompression-", "mediabunny-aac-encoder-"]) {
        expect(initial.some((url) => url.includes(capability))).toBe(false);
    }
    await page.locator("ehagaki-composer").evaluate((element) => {
        const button = element.shadowRoot?.querySelector<HTMLButtonElement>(".custom-emoji-button");
        button?.click();
    });
    await expect.poll(() => page.evaluate(() => performance.getEntriesByType("resource").map((entry) => entry.name)))
        .toContainEqual(expect.stringContaining("/host-owned/assets/HostOwnedCustomEmojiPicker-"));
    await page.evaluate(async () => {
        const composer = document.querySelector("ehagaki-composer") as HTMLElement & {
            setSettings(value: unknown): Promise<unknown>;
        };
        await composer.setSettings({ imageCompressionLevel: "low", videoCompressionLevel: "low" });
    });
    await page.locator("ehagaki-composer").locator('input[type="file"]').setInputFiles({
        name: "large-image.png",
        mimeType: "image/png",
        buffer: Buffer.alloc(21 * 1024),
    });
    await expect.poll(() => page.evaluate(() => performance.getEntriesByType("resource").map((entry) => entry.name)))
        .toContainEqual(expect.stringContaining("/host-owned/assets/browser-image-compression-"));
    const imageResources = await page.evaluate(() => performance.getEntriesByType("resource").map((entry) => entry.name));

    // Use a new document for each media boundary so a pending previous handoff
    // and its cache state cannot conceal the next dynamic import.
    await page.goto(hostOrigin);
    await mountHostOwned(page);
    await page.evaluate(async () => {
        const composer = document.querySelector("ehagaki-composer") as HTMLElement & {
            setSettings(value: unknown): Promise<unknown>;
        };
        await composer.setSettings({ videoCompressionLevel: "low" });
    });
    await page.locator("ehagaki-composer").locator('input[type="file"]').setInputFiles({
        name: "large-video.mp4",
        mimeType: "video/mp4",
        buffer: Buffer.alloc(201 * 1024),
    });
    await expect.poll(() => page.evaluate(() => performance.getEntriesByType("resource").map((entry) => entry.name)))
        .toContainEqual(expect.stringContaining("/host-owned/assets/mediabunnyCompression-"));
    const videoResources = await page.evaluate(() => performance.getEntriesByType("resource").map((entry) => entry.name));

    await page.goto(hostOrigin);
    await mountHostOwned(page);
    await page.evaluate(async () => {
        const composer = document.querySelector("ehagaki-composer") as HTMLElement & {
            setSettings(value: unknown): Promise<unknown>;
        };
        await composer.setSettings({ videoCompressionLevel: "low" });
    });
    const aacConditionStarted = await page.evaluate(async () => {
        if (!window.MediaRecorder || !("AudioEncoder" in window)) return false;
        const nativeAudioEncoder = (window as any).AudioEncoder;
        class NativeAacUnsupported extends nativeAudioEncoder {
            static isConfigSupported = async (config: unknown) => ({ supported: false, config });
        }
        Object.defineProperty(window, "AudioEncoder", { configurable: true, value: NativeAacUnsupported });

        const canvas = document.createElement("canvas");
        canvas.width = 640;
        canvas.height = 360;
        const context = canvas.getContext("2d")!;
        const audioContext = new AudioContext();
        const destination = audioContext.createMediaStreamDestination();
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        gain.gain.value = 0.001;
        oscillator.connect(gain).connect(destination);
        oscillator.start();
        const stream = new MediaStream([
            ...canvas.captureStream(30).getVideoTracks(),
            ...destination.stream.getAudioTracks(),
        ]);
        const chunks: Blob[] = [];
        const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp8,opus", videoBitsPerSecond: 4_000_000 });
        const stopped = new Promise<void>((resolve) => recorder.addEventListener("stop", () => resolve(), { once: true }));
        recorder.addEventListener("dataavailable", (event) => chunks.push(event.data));
        recorder.start();
        const pixels = context.createImageData(160, 90);
        context.imageSmoothingEnabled = false;
        for (let frame = 0; frame < 90; frame += 1) {
            crypto.getRandomValues(pixels.data);
            context.putImageData(pixels, 0, 0);
            context.drawImage(canvas, 0, 0, 160, 90, 0, 0, 640, 360);
            await new Promise((resolve) => setTimeout(resolve, 30));
        }
        recorder.stop();
        await stopped;
        oscillator.stop();
        await audioContext.close();
        const file = new File(chunks, "aac-fallback.webm", { type: "video/webm" });
        if (file.size <= 200 * 1024) return false;
        const input = document.querySelector("ehagaki-composer")?.shadowRoot?.querySelector<HTMLInputElement>('input[type="file"]');
        if (!input) return false;
        const transfer = new DataTransfer();
        transfer.items.add(file);
        input.files = transfer.files;
        input.dispatchEvent(new Event("change", { bubbles: true }));
        return true;
    });
    expect(aacConditionStarted).toBe(true);
    await expect.poll(() => page.evaluate(() => performance.getEntriesByType("resource").map((entry) => entry.name)))
        .toContainEqual(expect.stringContaining("/host-owned/assets/mediabunny-aac-encoder-"));
    const resources = [
        ...initial,
        ...imageResources,
        ...videoResources,
        ...await page.evaluate(() => performance.getEntriesByType("resource").map((entry) => entry.name)),
    ];
    const componentResources = resources.filter((url) => url.startsWith(componentOrigin));
    expect(componentResources.length).toBeGreaterThan(0);
    expect(componentResources.every((url) => url.startsWith(`${componentOrigin}/host-owned/`))).toBe(true);
    expect(resources.every((url) => !url.startsWith(`${hostOrigin}/assets/`))).toBe(true);
    expect(resources.every((url) => !url.startsWith(`${componentOrigin}/assets/`))).toBe(true);
});
