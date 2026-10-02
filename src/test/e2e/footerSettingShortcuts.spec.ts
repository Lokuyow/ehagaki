import { test, expect } from "@playwright/test";

test("keeps zero, one, and two footer shortcuts usable at the 360px standalone minimum", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 844 });

    for (const shortcuts of [[], ["language"], ["language", "image-quality"]]) {
        await page.addInitScript((selection) => {
            localStorage.setItem("footerSettingShortcuts", JSON.stringify(selection));
        }, shortcuts);
        await page.goto("/");
        const footer = page.locator(".footer-bar");
        await expect(footer).toBeVisible();
        await expect(footer.locator(".footer-setting-shortcut-button")).toHaveCount(shortcuts.length);
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
                footer: { left: bounds.left, right: bounds.right },
                controls,
            };
        });

        expect(geometry.documentWidth).toBeLessThanOrEqual(geometry.viewportWidth);
        expect(geometry.controls).toHaveLength(2 + shortcuts.length);
        for (const control of geometry.controls) {
            expect(control.left).toBeGreaterThanOrEqual(geometry.footer.left - 0.5);
            expect(control.right).toBeLessThanOrEqual(geometry.footer.right + 0.5);
            expect(control.width).toBeGreaterThanOrEqual(44);
            expect(control.height).toBeGreaterThanOrEqual(44);
        }
    }
});

test("opens a language shortcut by keyboard and restores focus when dismissed", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 844 });
    await page.addInitScript(() => localStorage.setItem("footerSettingShortcuts", '["language"]'));
    await page.goto("/");
    await page.getByRole("button", { name: "はじめる" }).click();

    const trigger = page.getByRole("button", { name: "言語" });
    await expect(trigger).toBeVisible();
    await trigger.focus();
    await trigger.press("Enter");

    const languageGroup = page.getByRole("radiogroup", { name: "言語" });
    await expect(languageGroup).toBeVisible();
    await expect(page.getByRole("radio", { name: "日本語" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(languageGroup).toBeHidden();
    await expect(trigger).toBeFocused();
});

test("keeps theme mode in sync between the Footer shortcut and SettingsDialog", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 844 });
    await page.addInitScript(() => localStorage.setItem("footerSettingShortcuts", '["theme-mode"]'));
    await page.goto("/");
    await page.getByRole("button", { name: "はじめる" }).click();

    const footerTheme = page.getByRole("button", { name: "モード" });
    await footerTheme.click();
    await page.getByRole("radio", { name: "ダーク" }).click();
    await page.keyboard.press("Escape");

    await page.getByRole("button", { name: "設定" }).click();
    const settingsTheme = page.getByRole("radiogroup", { name: "モード" });
    await expect(settingsTheme.getByRole("radio", { name: "ダーク" })).toHaveAttribute("aria-checked", "true");
    await settingsTheme.getByRole("radio", { name: "ライト" }).click();
    await page.getByRole("button", { name: "閉じる" }).click();

    await footerTheme.click();
    await expect(page.getByRole("radiogroup", { name: "モード" }).getByRole("radio", { name: "ライト" })).toHaveAttribute("aria-checked", "true");
});

test("preserves the flavor preference while mascot hiding forces the effective switch on", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("footerSettingShortcuts", '["hide-flavor-text","hide-mascot"]'));
    await page.goto("/");
    await page.getByRole("button", { name: "はじめる" }).click();

    const hideMascot = page.getByRole("button", { name: "きってんを非表示" });
    const hideFlavor = page.getByRole("button", { name: "フレーバーテキストを非表示" });
    await hideFlavor.click();
    await page.getByRole("switch", { name: "フレーバーテキストを非表示" }).click();
    await page.keyboard.press("Escape");

    await hideMascot.click();
    await page.getByRole("switch", { name: "きってんを非表示" }).click();
    await page.keyboard.press("Escape");

    await hideFlavor.click();
    const forcedFlavorSwitch = page.getByRole("switch", { name: "フレーバーテキストを非表示" });
    await expect(forcedFlavorSwitch).toHaveAttribute("aria-checked", "true");
    await expect(forcedFlavorSwitch).toBeDisabled();
    await expect(page.getByText("マスコットを非表示にしている間は、この設定も自動でオンになります。")).toBeVisible();
    await page.keyboard.press("Escape");

    await hideMascot.click();
    await page.getByRole("switch", { name: "きってんを非表示" }).click();
    await page.keyboard.press("Escape");
    await hideFlavor.click();
    await expect(page.getByRole("switch", { name: "フレーバーテキストを非表示" })).toHaveAttribute("aria-checked", "true");
});

test("keeps mascot SVG backgrounds transparent in both shortcut surfaces", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("footerSettingShortcuts", '["hide-mascot"]'));
    await page.goto("/");
    await page.getByRole("button", { name: "はじめる" }).click();

    const footerMascot = page.getByRole("button", { name: "きってんを非表示" }).locator("img.mascot-icon");
    await expect(footerMascot).toBeVisible();
    await expect(footerMascot).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(footerMascot).toHaveCSS("filter", "grayscale(1)");

    await page.getByRole("button", { name: "設定" }).click();
    const settingsMascot = page.locator(".footer-shortcut-settings img.mascot-icon");
    await settingsMascot.scrollIntoViewIfNeeded();
    await expect(settingsMascot).toBeVisible();
    await expect(settingsMascot).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(settingsMascot).toHaveCSS("filter", "grayscale(1)");
});

test("gives every Footer shortcut radio button a 44px minimum target", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "はじめる" }).click();

    const candidates = [
        { id: "language", label: "言語" },
        { id: "image-quality", label: "画像品質" },
        { id: "video-quality", label: "動画品質" },
        { id: "theme-mode", label: "モード" },
    ];

    for (const candidate of candidates) {
        await page.evaluate((id) => localStorage.setItem("footerSettingShortcuts", JSON.stringify([id])), candidate.id);
        await page.reload();
        const trigger = page.getByRole("button", { name: candidate.label });
        await trigger.click();
        const group = page.getByRole("radiogroup", { name: candidate.label });
        await expect(group).toBeVisible();
        const sizes = await group.getByRole("radio").evaluateAll((radios) => radios.map((radio) => {
            const bounds = radio.getBoundingClientRect();
            return { width: bounds.width, height: bounds.height };
        }));
        expect(sizes.length).toBeGreaterThan(0);
        for (const size of sizes) {
            expect(size.width).toBeGreaterThanOrEqual(44);
            expect(size.height).toBeGreaterThanOrEqual(44);
        }
        await page.keyboard.press("Escape");
    }
});
