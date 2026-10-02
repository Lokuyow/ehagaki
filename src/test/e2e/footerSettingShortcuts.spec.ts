import { test, expect } from "@playwright/test";

const emptySlots = { left: null, right: null };

async function setSlots(page: import("@playwright/test").Page, slots: { left: string | null; right: string | null }) {
    await page.evaluate((value) => localStorage.setItem("footerSettingShortcuts", JSON.stringify(value)), slots);
}

async function enterApp(page: import("@playwright/test").Page) {
    await page.goto("/");
    const start = page.getByRole("button", { name: "はじめる" });
    await start.waitFor({ state: "visible", timeout: 5000 }).catch(() => undefined);
    if (await start.isVisible()) {
        await start.click();
        await expect(start).toBeHidden();
    }
}

async function chooseShortcut(page: import("@playwright/test").Page, slot: "left" | "right", id: string) {
    await page.locator(".settings-btn").click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await page.locator(`#footer-shortcut-${slot}`).selectOption(id);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
}

test("keeps zero, one, and two explicit footer slots usable at the 360px standalone minimum", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 844 });
    for (const slots of [
        emptySlots,
        { left: "language", right: null },
        { left: null, right: "language" },
        { left: "language", right: "image-quality" },
    ]) {
        await page.addInitScript((value) => localStorage.setItem("footerSettingShortcuts", JSON.stringify(value)), slots);
        await enterApp(page);
        const footer = page.locator(".footer-bar");
        await expect(footer).toBeVisible();
        await expect(footer.locator(".footer-setting-shortcut-button")).toHaveCount(Number(!!slots.left) + Number(!!slots.right));
        await expect(page.locator(".login-btn")).toBeVisible();
        await expect(page.locator(".settings-btn")).toBeVisible();

        const geometry = await page.evaluate(() => {
            const footerElement = document.querySelector<HTMLElement>(".footer-bar")!;
            const bounds = footerElement.getBoundingClientRect();
            const controls = Array.from(footerElement.querySelectorAll<HTMLElement>(
                ".login-btn, .footer-setting-shortcut-button, .settings-btn",
            )).map((element) => {
                const rect = element.getBoundingClientRect();
                return { left: rect.left, right: rect.right, width: rect.width, height: rect.height };
            });
            return {
                viewportWidth: window.innerWidth,
                documentWidth: document.documentElement.scrollWidth,
                footer: { left: bounds.left, right: bounds.right, height: bounds.height },
                controls,
            };
        });
        expect(geometry.documentWidth).toBeLessThanOrEqual(geometry.viewportWidth);
        expect(geometry.footer.height).toBe(66);
        expect(geometry.controls).toHaveLength(2 + Number(!!slots.left) + Number(!!slots.right));
        for (const control of geometry.controls) {
            expect(control.left).toBeGreaterThanOrEqual(geometry.footer.left - 0.5);
            expect(control.right).toBeLessThanOrEqual(geometry.footer.right + 0.5);
            expect(control.width).toBeGreaterThanOrEqual(44);
            expect(control.height).toBeGreaterThanOrEqual(44);
        }
        await page.evaluate(() => localStorage.clear());
    }
});

test("keeps authenticated left, history, and right controls in order at 360px", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 844 });
    await page.addInitScript((pubkey) => {
        localStorage.setItem("footerSettingShortcuts", JSON.stringify({ left: "image-quality", right: "video-quality" }));
        localStorage.setItem("nostr-accounts", JSON.stringify([{ pubkeyHex: pubkey, type: "nip07", addedAt: 1 }]));
        localStorage.setItem("nostr-active-account", pubkey);
        (window as any).nostr = {
            getPublicKey: async () => pubkey,
            signEvent: async (event: any) => ({ ...event, id: "22".repeat(32), sig: "33".repeat(64) }),
        };
    }, "22".repeat(32));
    await enterApp(page);
    const footer = page.locator(".footer-bar");
    const left = footer.locator(".footer-setting-shortcut-button").first();
    const history = footer.locator(".post-history-btn");
    const right = footer.locator(".footer-setting-shortcut-button").nth(1);
    await expect(left).toBeVisible();
    await expect(history).toBeVisible();
    await expect(right).toBeVisible();
    const order = await footer.evaluate((element) => {
        const controls = Array.from(element.querySelectorAll<HTMLElement>(
            ".footer-setting-shortcut-button, .post-history-btn",
        ));
        return controls.map((control) => ({
            className: control.className,
            rect: control.getBoundingClientRect().toJSON(),
        }));
    });
    expect(order.map(({ className }) => className.includes("post-history-btn"))).toEqual([false, true, false]);
    expect(order[0].rect.right).toBeLessThanOrEqual(order[1].rect.left);
    expect(order[1].rect.right).toBeLessThanOrEqual(order[2].rect.left);
    const leftGap = order[1].rect.left - order[0].rect.right;
    const rightGap = order[2].rect.left - order[1].rect.right;
    expect(leftGap).toBeGreaterThanOrEqual(11.5);
    expect(rightGap).toBeGreaterThanOrEqual(11.5);
    expect(Math.abs(leftGap - rightGap)).toBeLessThanOrEqual(1);
    expect(order[1].rect.width).toBeGreaterThan(order[0].rect.width);
    expect(order[1].rect.width).toBeGreaterThan(order[2].rect.width);
    for (const item of order) {
        expect(item.rect.width).toBeGreaterThanOrEqual(44);
        expect(item.rect.height).toBeGreaterThanOrEqual(44);
    }
    const allFooterControls = await footer.locator(
        ".profile-display, .footer-setting-shortcut-button, .post-history-btn, .settings-btn",
    ).evaluateAll((elements) => elements.map((element) => {
        const rect = element.getBoundingClientRect();
        return { left: rect.left, right: rect.right, width: rect.width, height: rect.height };
    }));
    const footerBounds = await footer.boundingBox();
    expect(footerBounds).not.toBeNull();
    for (const control of allFooterControls) {
        expect(control.left).toBeGreaterThanOrEqual(footerBounds!.x - 0.5);
        expect(control.right).toBeLessThanOrEqual(footerBounds!.x + footerBounds!.width + 0.5);
        expect(control.width).toBeGreaterThanOrEqual(44);
        expect(control.height).toBeGreaterThanOrEqual(44);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
});

test("cycles language, quality, and theme directly from Footer buttons", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 844 });
    await page.addInitScript(() => {
        localStorage.setItem("footerSettingShortcuts", JSON.stringify({ left: "language", right: "image-quality" }));
        localStorage.setItem("locale", "ja");
        localStorage.setItem("imageQualityLevel", "none");
    });
    await enterApp(page);

    const language = page.locator(".footer-setting-shortcut-button").nth(0);
    await expect(language).toHaveAttribute("aria-label", "言語: 日本語");
    await expect(language.locator(".shortcut-mask-icon")).toHaveClass(/language-icon/);
    await language.click();
    await expect.poll(() => page.evaluate(() => localStorage.getItem("locale"))).toBe("en");
    await expect(language).toHaveAttribute("aria-label", "Language: English");
    const feedback = page.locator(".floating-message");
    await expect(feedback).toContainText("Language: English");
    const feedbackGeometry = await feedback.evaluate((message) => {
        const rect = message.getBoundingClientRect();
        const footer = document.querySelector<HTMLElement>(".footer-bar")!.getBoundingClientRect();
        return {
            left: rect.left,
            right: rect.right,
            top: rect.top,
            bottom: rect.bottom,
            footerTop: footer.top,
            pointerEvents: getComputedStyle(message).pointerEvents,
            viewportWidth: window.innerWidth,
        };
    });
    expect(feedbackGeometry.left).toBeGreaterThanOrEqual(0);
    expect(feedbackGeometry.right).toBeLessThanOrEqual(feedbackGeometry.viewportWidth);
    expect(feedbackGeometry.top).toBeGreaterThanOrEqual(0);
    expect(feedbackGeometry.bottom).toBeLessThanOrEqual(feedbackGeometry.footerTop);
    expect(feedbackGeometry.pointerEvents).toBe("none");

    const quality = page.locator(".footer-setting-shortcut-button").nth(1);
    for (const expected of ["high", "medium", "low", "none"]) {
        await quality.click();
        await expect.poll(() => page.evaluate(() => localStorage.getItem("imageQualityLevel"))).toBe(expected);
    }

    await expect(language).not.toHaveAttribute("aria-pressed", /.+/);
    await expect(page.locator("[role=dialog], [role=menu], [role=radio]")).toHaveCount(0);
});

test("cycles video quality none to high to medium to low and back", async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem("footerSettingShortcuts", JSON.stringify({ left: "video-quality", right: null }));
        localStorage.setItem("videoQualityLevel", "none");
    });
    await enterApp(page);
    const video = page.locator(".footer-setting-shortcut-button");
    for (const expected of ["high", "medium", "low", "none"]) {
        await video.click();
        await expect.poll(() => page.evaluate(() => localStorage.getItem("videoQualityLevel"))).toBe(expected);
    }
    await expect(video).not.toHaveAttribute("aria-pressed", /.+/);
});

test("cycles theme mode system to light to dark and back", async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem("footerSettingShortcuts", JSON.stringify({ left: "theme-mode", right: null }));
        localStorage.setItem("themeMode", "system");
    });
    await enterApp(page);
    const theme = page.locator(".footer-setting-shortcut-button");
    for (const expected of ["light", "dark", "system"]) {
        await theme.click();
        await expect.poll(() => page.evaluate(() => localStorage.getItem("themeMode"))).toBe(expected);
    }
    await expect(theme).not.toHaveAttribute("aria-pressed", /.+/);
    await expect(page.locator("[role=dialog], [role=menu], [role=radio]")).toHaveCount(0);
});

test("keeps direct Footer theme changes and SettingsDialog changes on the same canonical store", async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem("footerSettingShortcuts", JSON.stringify({ left: "theme-mode", right: null }));
        localStorage.setItem("themeMode", "system");
    });
    await enterApp(page);
    const theme = page.locator(".footer-setting-shortcut-button");
    await theme.click();
    await expect.poll(() => page.evaluate(() => localStorage.getItem("themeMode"))).toBe("light");
    await page.locator(".settings-btn").click();
    const group = page.getByRole("radiogroup", { name: "モード" });
    await expect(group.getByRole("radio", { name: "ライト" })).toHaveAttribute("aria-checked", "true");
    await group.getByRole("radio", { name: "ダーク" }).click();
    await page.keyboard.press("Escape");
    await expect.poll(() => page.evaluate(() => localStorage.getItem("themeMode"))).toBe("dark");
    await expect(theme).toHaveAttribute("aria-label", "モード: ダーク");
});

test("toggles boolean settings, keeps flavor preference latent while mascot is hidden, and reflects selection", async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem("footerSettingShortcuts", JSON.stringify({ left: "media-free-placement", right: "hide-flavor-text" }));
        localStorage.setItem("mediaFreePlacement", "false");
        localStorage.setItem("showMascot", "true");
        localStorage.setItem("showFlavorText", "true");
    });
    await enterApp(page);

    const media = page.locator(".footer-setting-shortcut-button").nth(0);
    await expect(media).toHaveAttribute("aria-pressed", "false");
    await media.click();
    await expect.poll(() => page.evaluate(() => localStorage.getItem("mediaFreePlacement"))).toBe("true");
    await expect(media).toHaveAttribute("aria-pressed", "true");

    const flavor = page.locator(".footer-setting-shortcut-button").nth(1);
    await expect(flavor.locator(".shortcut-mask-icon")).toHaveClass(/flavor-icon/);
    await flavor.click();
    await expect.poll(() => page.evaluate(() => localStorage.getItem("showFlavorText"))).toBe("false");
    await expect(flavor.locator(".shortcut-mask-icon")).toHaveClass(/flavor-hidden-icon/);
    await chooseShortcut(page, "left", "hide-mascot");
    const mascot = page.locator(".footer-setting-shortcut-button").nth(0);
    const latentFlavor = page.locator(".footer-setting-shortcut-button").nth(1);
    await mascot.click();
    await expect.poll(() => page.evaluate(() => localStorage.getItem("showMascot"))).toBe("false");
    await expect(latentFlavor).toBeDisabled();
    await expect(latentFlavor).toHaveAttribute("aria-pressed", "true");
    await expect(latentFlavor.locator(".shortcut-mask-icon")).toHaveClass(/flavor-hidden-icon/);
    await expect.poll(() => page.evaluate(() => localStorage.getItem("showFlavorText"))).toBe("false");
    await mascot.click();
    await expect.poll(() => page.evaluate(() => localStorage.getItem("showMascot"))).toBe("true");
    await expect(latentFlavor).toBeEnabled();
    await expect(latentFlavor).toHaveAttribute("aria-pressed", "true");
});

test("toggles quote, reply, and client-tag preferences with icon and aria-pressed state", async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem("quoteNotificationEnabled", "false");
        localStorage.setItem("replyNotificationEnabled", "false");
        localStorage.setItem("clientTagEnabled", "false");
    });
    await enterApp(page);

    const candidates = [
        { id: "quote-notification", key: "quoteNotificationEnabled", offIcon: "quote-icon", onIcon: "quote-icon" },
        { id: "reply-notification", key: "replyNotificationEnabled", offIcon: "reply-icon", onIcon: "reply-icon" },
        { id: "client-tag", key: "clientTagEnabled", offIcon: "client-tag-off-icon", onIcon: "client-tag-icon" },
    ];
    for (const candidate of candidates) {
        await chooseShortcut(page, "left", candidate.id);
        const button = page.locator(".footer-setting-shortcut-button");
        const mainIcon = button.locator(
            candidate.id === "quote-notification" || candidate.id === "reply-notification"
                ? ".composite-main"
                : ".shortcut-icon",
        );
        await expect(button).toHaveAttribute("aria-pressed", "false");
        await expect(mainIcon).toHaveClass(new RegExp(candidate.offIcon));
        if (candidate.id === "quote-notification" || candidate.id === "reply-notification") {
            await expect(button.locator(".notification-badge")).toHaveClass(/notification-off/);
        }
        await button.click();
        await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), candidate.key)).toBe("true");
        await expect(button).toHaveAttribute("aria-pressed", "true");
        await expect(button).not.toHaveClass(/selected/);
        await expect(mainIcon).toHaveClass(new RegExp(candidate.onIcon));
        if (candidate.id === "quote-notification" || candidate.id === "reply-notification") {
            await expect(button.locator(".notification-badge")).toHaveClass(/notification-on/);
        }
    }
});

test("shows natural localized FloatingMessages for both states of every boolean shortcut", async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem("footerSettingShortcuts", JSON.stringify({ left: null, right: "language" }));
        localStorage.setItem("mediaFreePlacement", "false");
        localStorage.setItem("showMascot", "true");
        localStorage.setItem("showFlavorText", "true");
        localStorage.setItem("quoteNotificationEnabled", "false");
        localStorage.setItem("replyNotificationEnabled", "false");
        localStorage.setItem("clientTagEnabled", "false");
        localStorage.setItem("locale", "ja");
    });
    await enterApp(page);

    const messages = {
        "media-free-placement": {
            ja: ["メディア自由配置", "メディア固定配置"],
            en: ["Free media placement", "Fixed media placement"],
        },
        "hide-mascot": {
            ja: ["きってんを非表示", "きってんを表示"],
            en: ["Hide mascot", "Show mascot"],
        },
        "hide-flavor-text": {
            ja: ["フレーバーテキストを非表示", "フレーバーテキストを表示"],
            en: ["Hide flavor text", "Show flavor text"],
        },
        "quote-notification": {
            ja: ["引用元の投稿者に通知", "引用元の投稿者に通知しない"],
            en: ["Notify the quoted author", "Don't notify the quoted author"],
        },
        "reply-notification": {
            ja: ["返信先以外にも通知", "返信先以外には通知しない"],
            en: ["Also notify people besides the person being replied to", "Notify only the person being replied to"],
        },
        "client-tag": {
            ja: ["投稿にクライアント名をつける", "投稿にクライアント名をつけない"],
            en: ["Add the client name to posts", "Don't add the client name to posts"],
        },
    } as const;

    for (const locale of ["ja", "en"] as const) {
        if (locale === "en") {
            await page.locator(".footer-setting-shortcut-button").nth(1).click();
            await expect.poll(() => page.evaluate(() => localStorage.getItem("locale"))).toBe("en");
        }

        for (const shortcutId of Object.keys(messages) as (keyof typeof messages)[]) {
            await chooseShortcut(page, "left", shortcutId);
            const button = page.locator(".footer-setting-shortcut-button").first();
            await button.click();
            await expect(page.getByRole("status").filter({ hasText: messages[shortcutId][locale][0] })).toBeVisible();
            await expect(button).toHaveAttribute("aria-pressed", "true");
            await button.click();
            await expect(page.getByRole("status").filter({ hasText: messages[shortcutId][locale][1] })).toBeVisible();
            await expect(button).toHaveAttribute("aria-pressed", "false");
        }
    }
});

test("updates boolean, theme, and quality presentation icons and compact labels", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 844 });
    await page.addInitScript(() => {
        localStorage.setItem("footerSettingShortcuts", JSON.stringify({ left: "media-free-placement", right: "theme-mode" }));
        localStorage.setItem("themeMode", "system");
        localStorage.setItem("mediaFreePlacement", "false");
        localStorage.setItem("imageQualityLevel", "none");
        localStorage.setItem("videoQualityLevel", "none");
    });
    await enterApp(page);
    const media = page.locator(".footer-setting-shortcut-button").nth(0);
    const theme = page.locator(".footer-setting-shortcut-button").nth(1);
    await expect(media).toHaveAttribute("aria-pressed", "false");
    await expect(media.locator(".shortcut-mask-icon")).toHaveClass(/media-icon/);
    await media.click();
    await expect(media.locator(".shortcut-mask-icon")).toHaveClass(/media-on-icon/);
    await expect(media).toHaveAttribute("aria-pressed", "true");
    for (const [value, className] of [["light", "theme-light-icon"], ["dark", "theme-dark-icon"], ["system", "theme-icon"]]) {
        await theme.click();
        await expect.poll(() => page.evaluate(() => localStorage.getItem("themeMode"))).toBe(value);
        await expect(theme.locator(".shortcut-mask-icon")).toHaveClass(new RegExp(className));
    }

    await chooseShortcut(page, "left", "image-quality");
    await chooseShortcut(page, "right", "video-quality");
    const qualityButtons = page.locator(".footer-setting-shortcut-button");
    await expect(qualityButtons.nth(0).locator(".quality-shortcut-label")).toHaveText("原");
    await expect(qualityButtons.nth(1).locator(".quality-shortcut-label")).toHaveText("原");
    await qualityButtons.nth(0).click();
    await qualityButtons.nth(1).click();
    await expect(qualityButtons.nth(0).locator(".quality-shortcut-label")).toHaveText("高");
    await expect(qualityButtons.nth(1).locator(".quality-shortcut-label")).toHaveText("高");
    await expect(qualityButtons.nth(0)).toHaveAttribute("aria-label", "画像品質: 高");
    await expect(qualityButtons.nth(1)).toHaveAttribute("aria-label", "動画品質: 高");
});

test("keyboard Enter and Space each directly change a shortcut once without opening an overlay", async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem("footerSettingShortcuts", JSON.stringify({ left: "language", right: null }));
        localStorage.setItem("locale", "ja");
    });
    await enterApp(page);
    const button = page.locator(".footer-setting-shortcut-button");
    await button.focus();
    await page.keyboard.press("Enter");
    await expect.poll(() => page.evaluate(() => localStorage.getItem("locale"))).toBe("en");
    await page.keyboard.press("Space");
    await expect.poll(() => page.evaluate(() => localStorage.getItem("locale"))).toBe("ja");
    await expect(page.locator("[role=dialog], [role=menu], [role=radio], .footer-setting-shortcut-popover")).toHaveCount(0);
});

test("keeps full mascot transparent and verifies the frame-only SVG has a transparent hole", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("footerSettingShortcuts", JSON.stringify({ left: "hide-mascot", right: null })));
    await enterApp(page);

    const footerMascot = page.locator(".footer-setting-shortcut-button img.mascot-icon");
    await expect(footerMascot).toBeVisible();
    await expect(footerMascot).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(footerMascot).toHaveCSS("filter", "grayscale(1)");
    await expect(page.locator(".footer-setting-shortcut-button")).toHaveAttribute("aria-pressed", "false");

    await page.locator(".footer-setting-shortcut-button").click();
    const frameMascot = page.locator(".footer-setting-shortcut-button img.mascot-icon");
    await expect(frameMascot).toHaveAttribute("src", /ehagaki_icon_frame\.svg/);
    await expect(frameMascot).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(frameMascot).toHaveCSS("filter", "grayscale(1)");
    await expect(page.locator(".footer-setting-shortcut-button")).toHaveAttribute("aria-pressed", "true");
    const framePixels = await frameMascot.evaluate(async (element) => {
        const image = new Image();
        image.src = (element as HTMLImageElement).src;
        await image.decode();
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext("2d")!;
        context.drawImage(image, 0, 0);
        return {
            width: image.naturalWidth,
            height: image.naturalHeight,
            centerAlpha: context.getImageData(32, 32, 1, 1).data[3],
            frameAlpha: context.getImageData(7, 32, 1, 1).data[3],
        };
    });
    expect(framePixels).toEqual({ width: 64, height: 64, centerAlpha: 0, frameAlpha: 255 });

    await page.locator(".footer-setting-shortcut-button").click();
    await expect(page.locator(".footer-setting-shortcut-button img.mascot-icon")).toHaveAttribute("src", /ehagaki_icon\.svg/);
    await expect(page.locator(".footer-setting-shortcut-button")).toHaveAttribute("aria-pressed", "false");

    await page.getByRole("button", { name: "設定" }).click();
    await expect(page.locator(".footer-shortcut-settings img.mascot-icon")).toHaveCount(0);
    await expect(page.locator(".mascot-setting-icon")).toBeVisible();
    await expect(page.locator(".mascot-setting-icon")).toHaveCSS("filter", "grayscale(1)");
});

test("SettingsDialog edits both slots, disables only a duplicate in the opposite select, and syncs the Footer", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("footerSettingShortcuts", JSON.stringify(emptySlots)));
    await enterApp(page);
    await page.getByRole("button", { name: "設定" }).click();
    const left = page.getByRole("combobox", { name: "左側" });
    const right = page.getByRole("combobox", { name: "右側" });
    await left.selectOption("language");
    await expect(right.locator('option[value="language"]')).toHaveAttribute("disabled", "");
    await right.selectOption("image-quality");
    await expect.poll(() => page.evaluate(() => localStorage.getItem("footerSettingShortcuts")))
        .toBe('{"left":"language","right":"image-quality"}');
    await page.getByRole("button", { name: "閉じる" }).click();
    await expect(page.locator(".footer-setting-shortcut-button")).toHaveCount(2);
    await expect(page.locator(".footer-setting-shortcut-button").first()).toHaveAttribute("aria-label", "言語: 日本語");
});
