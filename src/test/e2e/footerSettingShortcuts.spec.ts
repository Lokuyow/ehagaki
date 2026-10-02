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
        localStorage.setItem("footerSettingShortcuts", JSON.stringify({ left: "language", right: "image-quality" }));
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
    await flavor.click();
    await expect.poll(() => page.evaluate(() => localStorage.getItem("showFlavorText"))).toBe("false");
    await chooseShortcut(page, "left", "hide-mascot");
    const mascot = page.locator(".footer-setting-shortcut-button").nth(0);
    const latentFlavor = page.locator(".footer-setting-shortcut-button").nth(1);
    await mascot.click();
    await expect.poll(() => page.evaluate(() => localStorage.getItem("showMascot"))).toBe("false");
    await expect(latentFlavor).toBeDisabled();
    await expect(latentFlavor).toHaveAttribute("aria-pressed", "true");
    await expect.poll(() => page.evaluate(() => localStorage.getItem("showFlavorText"))).toBe("false");
    await mascot.click();
    await expect.poll(() => page.evaluate(() => localStorage.getItem("showMascot"))).toBe("true");
    await expect(latentFlavor).toBeEnabled();
    await expect(latentFlavor).toHaveAttribute("aria-pressed", "true");
});

test("toggles quote, reply, and client-tag preferences with selected and aria-pressed state", async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem("quoteNotificationEnabled", "false");
        localStorage.setItem("replyNotificationEnabled", "false");
        localStorage.setItem("clientTagEnabled", "false");
    });
    await enterApp(page);

    const candidates = [
        { id: "quote-notification", key: "quoteNotificationEnabled" },
        { id: "reply-notification", key: "replyNotificationEnabled" },
        { id: "client-tag", key: "clientTagEnabled" },
    ];
    for (const candidate of candidates) {
        await chooseShortcut(page, "left", candidate.id);
        const button = page.locator(".footer-setting-shortcut-button");
        await expect(button).toHaveAttribute("aria-pressed", "false");
        await button.click();
        await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), candidate.key)).toBe("true");
        await expect(button).toHaveAttribute("aria-pressed", "true");
        await expect(button).toHaveClass(/selected/);
    }
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

test("shows transparent grayscale mascot art in the Footer trigger and keeps normal SettingsDialog mascot icon", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("footerSettingShortcuts", JSON.stringify({ left: "hide-mascot", right: null })));
    await enterApp(page);

    const footerMascot = page.locator(".footer-setting-shortcut-button img.mascot-icon");
    await expect(footerMascot).toBeVisible();
    await expect(footerMascot).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(footerMascot).toHaveCSS("filter", "grayscale(1)");

    await page.getByRole("button", { name: "設定" }).click();
    await expect(page.locator(".footer-shortcut-settings img.mascot-icon")).toHaveCount(0);
    await expect(page.locator(".mascot-setting-icon")).toBeVisible();
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
