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

async function expectQualityRadiosOnOneLine(
    group: import("@playwright/test").Locator,
    expectedLabels: string[],
) {
    const radios = group.getByRole("radio");
    await expect(radios).toHaveCount(4);
    const geometry = await radios.evaluateAll((elements) => elements.map((element) => {
        const radio = element as HTMLElement;
        const rect = radio.getBoundingClientRect();
        return {
            label: radio.getAttribute("aria-label"),
            top: rect.top,
            width: rect.width,
            height: rect.height,
            whiteSpace: getComputedStyle(radio).whiteSpace,
        };
    }));
    expect(geometry.map((radio) => radio.label)).toEqual(expectedLabels);
    expect(Math.max(...geometry.map((radio) => radio.top)) - Math.min(...geometry.map((radio) => radio.top))).toBeLessThanOrEqual(1);
    for (const radio of geometry) {
        expect(radio.width).toBeGreaterThanOrEqual(44);
        expect(radio.height).toBeGreaterThanOrEqual(44);
        expect(radio.whiteSpace).toBe("nowrap");
    }
}

async function expectPopoverPaddingBalanced(popover: import("@playwright/test").Locator) {
    const geometry = await popover.evaluate((element) => {
        const style = getComputedStyle(element);
        const radios = Array.from(element.querySelectorAll<HTMLElement>('button[role="radio"]'));
        const rect = element.getBoundingClientRect();
        const borderLeft = Number.parseFloat(style.borderLeftWidth);
        const borderRight = Number.parseFloat(style.borderRightWidth);
        const leftInnerEdge = rect.left + borderLeft + Number.parseFloat(style.paddingLeft);
        const rightInnerEdge = rect.right - borderRight - Number.parseFloat(style.paddingRight);
        return {
            leftGap: radios[0]!.getBoundingClientRect().left - leftInnerEdge,
            rightGap: rightInnerEdge - radios[radios.length - 1]!.getBoundingClientRect().right,
        };
    });
    expect(geometry.leftGap).toBeGreaterThanOrEqual(-1);
    expect(geometry.rightGap).toBeGreaterThanOrEqual(-1);
    expect(Math.abs(geometry.leftGap - geometry.rightGap)).toBeLessThanOrEqual(3);
    expect(geometry.rightGap).toBeLessThanOrEqual(8);
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
        { left: "quote-notification", right: "reply-notification" },
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
        if (slots.left === "quote-notification" && slots.right === "reply-notification") {
            const pairGeometry = await page.locator(".footer-setting-shortcut-button").evaluateAll((buttons) => buttons.map((button) => {
                const rect = button.getBoundingClientRect();
                return { left: rect.left, right: rect.right, width: rect.width, height: rect.height };
            }));
            expect(pairGeometry).toHaveLength(2);
            expect(pairGeometry[0].right).toBeLessThanOrEqual(pairGeometry[1].left);
            expect(pairGeometry[1].left - pairGeometry[0].right).toBeGreaterThanOrEqual(5.5);
            const centeredInMiddleLane = await page.locator(".footer-setting-controls").evaluate((controls) => {
                const rect = controls.getBoundingClientRect();
                const buttons = Array.from(controls.querySelectorAll<HTMLElement>(".footer-setting-shortcut-button"));
                return Math.abs((buttons[0].getBoundingClientRect().left + buttons[1].getBoundingClientRect().right) / 2 - (rect.left + rect.right) / 2);
            });
            expect(centeredInMiddleLane).toBeLessThanOrEqual(6);
            for (const pair of pairGeometry) {
                expect(pair.width).toBe(72);
                expect(pair.height).toBe(50);
            }
        }
        await page.evaluate(() => localStorage.clear());
    }
});

test("keeps authenticated left, history, and right controls in order at 360px", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 844 });
    await page.addInitScript((pubkey) => {
        localStorage.setItem("footerSettingShortcuts", JSON.stringify({ left: "quote-notification", right: "reply-notification" }));
        localStorage.setItem("quoteNotificationEnabled", "false");
        localStorage.setItem("replyNotificationEnabled", "false");
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
    expect(leftGap).toBeGreaterThanOrEqual(5.5);
    expect(rightGap).toBeGreaterThanOrEqual(5.5);
    expect(Math.abs(leftGap - rightGap)).toBeLessThanOrEqual(1);
    expect(order[0].rect.width).toBe(72);
    expect(order[2].rect.width).toBe(72);
    expect(order[0].rect.height).toBe(50);
    expect(order[1].rect.height).toBe(50);
    expect(order[2].rect.height).toBe(50);
    expect(order[1].rect.width).toBeGreaterThanOrEqual(44);
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

test("distributes authenticated Footer gaps evenly with variable-width shortcuts", async ({ page }) => {
    await page.setViewportSize({ width: 640, height: 844 });
    await page.addInitScript((pubkey) => {
        localStorage.setItem("nostr-accounts", JSON.stringify([{ pubkeyHex: pubkey, type: "nip07", addedAt: 1 }]));
        localStorage.setItem("nostr-active-account", pubkey);
        (window as any).nostr = {
            getPublicKey: async () => pubkey,
            signEvent: async (event: any) => ({ ...event, id: "22".repeat(32), sig: "33".repeat(64) }),
        };
    }, "22".repeat(32));
    await enterApp(page);

    const combinations = [
        { left: "language", right: "theme-mode", leftMin: 50, rightMin: 50 },
        { left: "quote-notification", right: "reply-notification", leftMin: 72, rightMin: 72 },
        { left: "language", right: "quote-notification", leftMin: 50, rightMin: 72 },
        { left: "image-quality", right: "theme-mode", leftMin: 58, rightMin: 50 },
    ];

    for (const combination of combinations) {
        await page.evaluate((slots) => localStorage.setItem("footerSettingShortcuts", JSON.stringify(slots)), {
            left: combination.left,
            right: combination.right,
        });
        await page.reload();
        await expect(page.locator(".footer-bar")).toBeVisible();
        const footer = page.locator(".footer-bar");
        const shortcuts = footer.locator(".footer-setting-shortcut-button");
        const history = footer.locator(".post-history-btn");
        await expect(shortcuts).toHaveCount(2);
        await expect(history).toBeVisible();
        const geometry = await footer.evaluate((element) => {
            const profile = element.querySelector<HTMLElement>(".profile-display")!.getBoundingClientRect();
            const settings = element.querySelector<HTMLElement>(".settings-btn")!.getBoundingClientRect();
            const buttons = Array.from(element.querySelectorAll<HTMLElement>(".footer-setting-shortcut-button"));
            const left = buttons[0]!.getBoundingClientRect();
            const middle = element.querySelector<HTMLElement>(".post-history-btn")!.getBoundingClientRect();
            const right = buttons[1]!.getBoundingClientRect();
            return {
                footerHeight: element.getBoundingClientRect().height,
                documentWidth: document.documentElement.scrollWidth,
                profileWidth: profile.width,
                settingsWidth: settings.width,
                history: { width: middle.width, height: middle.height },
                shortcutWidths: [left.width, right.width],
                gaps: [left.left - profile.right, middle.left - left.right, right.left - middle.right, settings.left - right.right],
            };
        });
        expect(geometry.footerHeight).toBe(66);
        expect(geometry.documentWidth).toBeLessThanOrEqual(640);
        expect(geometry.profileWidth).toBe(50);
        expect(geometry.settingsWidth).toBe(50);
        expect(geometry.history.height).toBe(50);
        expect(geometry.history.width).toBeLessThanOrEqual(200);
        expect(geometry.shortcutWidths[0]).toBeGreaterThanOrEqual(combination.leftMin);
        expect(geometry.shortcutWidths[1]).toBeGreaterThanOrEqual(combination.rightMin);
        for (const gap of geometry.gaps) expect(gap).toBeGreaterThan(0);
        const smallestGap = Math.min(...geometry.gaps);
        const largestGap = Math.max(...geometry.gaps);
        expect(smallestGap).toBeGreaterThan(12);
        expect(largestGap).toBeLessThanOrEqual(smallestGap * 1.25 + 2);
        expect(Math.abs(geometry.gaps[0] - geometry.gaps[1])).toBeLessThanOrEqual(smallestGap * 0.25 + 2);
        expect(Math.abs(geometry.gaps[2] - geometry.gaps[3])).toBeLessThanOrEqual(smallestGap * 0.25 + 2);
        await expect(shortcuts.first()).toBeVisible();
    }
});

test("keeps unauthenticated Footer shortcut spacing balanced without history", async ({ page }) => {
    await page.setViewportSize({ width: 640, height: 844 });
    await page.addInitScript(() => {
        localStorage.setItem("footerSettingShortcuts", JSON.stringify({ left: "language", right: "quote-notification" }));
    });
    await enterApp(page);
    await expect(page.locator(".login-btn")).toBeVisible();
    await expect(page.locator(".post-history-btn")).toHaveCount(0);
    const geometry = await page.locator(".footer-bar").evaluate((element) => {
        const login = element.querySelector<HTMLElement>(".login-btn")!.getBoundingClientRect();
        const settings = element.querySelector<HTMLElement>(".settings-btn")!.getBoundingClientRect();
        const shortcuts = Array.from(element.querySelectorAll<HTMLElement>(".footer-setting-shortcut-button"));
        const left = shortcuts[0]!.getBoundingClientRect();
        const right = shortcuts[1]!.getBoundingClientRect();
        return {
            footerHeight: element.getBoundingClientRect().height,
            documentWidth: document.documentElement.scrollWidth,
            gaps: [left.left - login.right, right.left - left.right, settings.left - right.right],
            widths: [left.width, right.width],
        };
    });
    expect(geometry.footerHeight).toBe(66);
    expect(geometry.documentWidth).toBeLessThanOrEqual(640);
    expect(geometry.widths[0]).toBe(50);
    expect(geometry.widths[1]).toBe(72);
    const smallestGap = Math.min(...geometry.gaps);
    const largestGap = Math.max(...geometry.gaps);
    expect(smallestGap).toBeGreaterThan(12);
    expect(largestGap).toBeLessThanOrEqual(smallestGap * 1.25 + 2);
});

test("keeps both quality pills and their popovers contained around history at 360px", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 844 });
    await page.addInitScript((pubkey) => {
        localStorage.setItem("footerSettingShortcuts", JSON.stringify({ left: "image-quality", right: "video-quality" }));
        localStorage.setItem("imageQualityLevel", "none");
        localStorage.setItem("videoQualityLevel", "none");
        localStorage.setItem("nostr-accounts", JSON.stringify([{ pubkeyHex: pubkey, type: "nip07", addedAt: 1 }]));
        localStorage.setItem("nostr-active-account", pubkey);
        (window as any).nostr = {
            getPublicKey: async () => pubkey,
            signEvent: async (event: any) => ({ ...event, id: "22".repeat(32), sig: "33".repeat(64) }),
        };
    }, "22".repeat(32));
    await enterApp(page);
    await page.getByRole("button", { name: "はじめる" }).click();

    const footer = page.locator(".footer-bar");
    const buttons = footer.locator(".footer-setting-shortcut-button");
    const history = footer.locator(".post-history-btn");
    await expect(buttons).toHaveCount(2);
    await expect(history).toBeVisible();
    const initial = await footer.evaluate((element) => {
        const footerRect = element.getBoundingClientRect();
        const controls = Array.from(element.querySelectorAll<HTMLElement>(".footer-setting-shortcut-button, .post-history-btn"));
        const rects = controls.map((control) => {
            const rect = control.getBoundingClientRect();
            return { left: rect.left, right: rect.right, width: rect.width, height: rect.height };
        });
        return { footerHeight: footerRect.height, documentWidth: document.documentElement.scrollWidth, rects };
    });
    expect(initial.footerHeight).toBe(66);
    expect(initial.documentWidth).toBeLessThanOrEqual(360);
    expect(initial.rects).toHaveLength(3);
    expect(initial.rects[0].width).toBeGreaterThanOrEqual(58);
    expect(initial.rects[0].width).toBe(initial.rects[2].width);
    expect(initial.rects[0].height).toBe(50);
    expect(initial.rects[1].height).toBe(50);
    expect(initial.rects[2].height).toBe(50);
    expect(initial.rects[1].left - initial.rects[0].right).toBeGreaterThanOrEqual(5.5);
    expect(initial.rects[2].left - initial.rects[1].right).toBeGreaterThanOrEqual(5.5);

    for (let index = 0; index < 2; index += 1) {
        const button = buttons.nth(index);
        const before = await button.boundingBox();
        await button.click();
        const popover = page.locator(".footer-setting-shortcut-popover").filter({ visible: true });
        await expect(popover).toBeVisible();
        await expect(popover.getByRole("radio")).toHaveCount(4);
        await expectPopoverPaddingBalanced(popover);
        const geometry = await popover.evaluate((element, index) => {
            const rect = element.getBoundingClientRect();
            const trigger = document.querySelectorAll<HTMLElement>(".footer-setting-shortcut-button")[index]!.getBoundingClientRect();
            return {
                popover: { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom },
                trigger: { left: trigger.left, right: trigger.right, top: trigger.top },
                viewportWidth: window.innerWidth,
                documentWidth: document.documentElement.scrollWidth,
            };
        }, index);
        expect(geometry.popover.left).toBeGreaterThanOrEqual(0);
        expect(geometry.popover.right).toBeLessThanOrEqual(360.5);
        expect(geometry.popover.bottom).toBeLessThanOrEqual(geometry.trigger.top);
        expect(geometry.documentWidth).toBeLessThanOrEqual(geometry.viewportWidth);
        expect(await button.boundingBox()).toEqual(before);
        await popover.getByRole("radio", { name: "高" }).click();
        await expect(popover).toBeHidden();
    }
});

test("keeps language direct and lets image quality be selected from its popover", async ({ page }) => {
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
    await expect(page.locator(".footer-setting-shortcut-popover")).toHaveCount(0);
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
    await quality.click();
    const englishPopover = page.locator(".footer-setting-shortcut-popover");
    await expect(englishPopover).toBeVisible();
    const englishGroup = page.getByRole("radiogroup", { name: "Image Quality" });
    await expectQualityRadiosOnOneLine(englishGroup, ["Original", "High", "Medium", "Low"]);
    await expectPopoverPaddingBalanced(englishPopover);
    const englishPopoverRect = await englishPopover.boundingBox();
    expect(englishPopoverRect!.x).toBeGreaterThanOrEqual(0);
    expect(englishPopoverRect!.x + englishPopoverRect!.width).toBeLessThanOrEqual(360.5);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
    await page.keyboard.press("Escape");
    await expect(englishPopover).toHaveCount(0);

    await language.click();
    await expect.poll(() => page.evaluate(() => localStorage.getItem("locale"))).toBe("ja");
    await expect(language).toHaveAttribute("aria-label", "言語: 日本語");

    const initialButtonRect = await quality.boundingBox();
    await quality.click();
    const popover = page.locator(".footer-setting-shortcut-popover");
    await expect(popover).toBeVisible();
    const group = page.getByRole("radiogroup", { name: "画像品質" });
    await expect(group.getByRole("radio")).toHaveCount(4);
    await expectQualityRadiosOnOneLine(group, ["オリジナル", "高", "中", "低"]);
    await expectPopoverPaddingBalanced(popover);
    await expect(group.getByRole("radio", { name: "オリジナル" })).toHaveAttribute("aria-checked", "true");
    await expect.poll(() => page.evaluate(() => localStorage.getItem("imageQualityLevel"))).toBe("none");
    await expect(quality).toHaveAttribute("aria-label", "画像品質: オリジナル");
    const radioRects = await group.getByRole("radio").evaluateAll((radios) => radios.map((radio) => {
        const rect = radio.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
    }));
    for (const rect of radioRects) {
        expect(rect.width).toBeGreaterThanOrEqual(44);
        expect(rect.height).toBeGreaterThanOrEqual(44);
    }
    expect(await quality.boundingBox()).toEqual(initialButtonRect);
    await group.getByRole("radio", { name: "低" }).click();
    await expect.poll(() => page.evaluate(() => localStorage.getItem("imageQualityLevel"))).toBe("low");
    await expect(popover).toHaveCount(0);
    await expect(quality.locator(".quality-shortcut-label")).toHaveText("低");
    await expect(quality).toHaveAttribute("aria-label", "画像品質: 低");
    expect(await quality.boundingBox()).toEqual(initialButtonRect);
    await expect(page.getByRole("status").filter({ hasText: "画像品質:" })).toHaveCount(0);

    await quality.focus();
    await page.keyboard.press("Enter");
    await expect(popover).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(popover).toHaveCount(0);

    await expect(language).not.toHaveAttribute("aria-pressed", /.+/);
    await expect(page.locator("[role=dialog], [role=menu], [role=radio]")).toHaveCount(0);
});

test("selects video quality directly and follows the canonical setting", async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem("footerSettingShortcuts", JSON.stringify({ left: "video-quality", right: null }));
        localStorage.setItem("videoQualityLevel", "none");
    });
    await enterApp(page);
    const video = page.locator(".footer-setting-shortcut-button");
    await video.click();
    const popover = page.locator(".footer-setting-shortcut-popover");
    await expect(popover).toBeVisible();
    const group = page.getByRole("radiogroup", { name: "動画品質" });
    await expect(group.getByRole("radio")).toHaveCount(4);
    await expect(group.getByRole("radio", { name: "オリジナル" })).toHaveAttribute("aria-checked", "true");
    await group.getByRole("radio", { name: "低" }).click();
    await expect.poll(() => page.evaluate(() => localStorage.getItem("videoQualityLevel"))).toBe("low");
    await expect(popover).toHaveCount(0);
    await expect(video.locator(".quality-shortcut-label")).toHaveText("低");
    await expect(video).toHaveAttribute("aria-label", "動画品質: 低");
    await expect(video).not.toHaveAttribute("aria-pressed", /.+/);
});

test("opens the quality popover from the keyboard and supports radio arrow navigation", async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem("footerSettingShortcuts", JSON.stringify({ left: "image-quality", right: null }));
        localStorage.setItem("imageQualityLevel", "none");
    });
    await enterApp(page);
    const button = page.locator(".footer-setting-shortcut-button");
    const popover = page.locator(".footer-setting-shortcut-popover");
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(popover).toBeVisible();
    const group = page.getByRole("radiogroup", { name: "画像品質" });
    const original = group.getByRole("radio", { name: "オリジナル" });
    await expect(original).toHaveAttribute("aria-checked", "true");
    await original.focus();
    await page.keyboard.press("ArrowDown");
    await expect.poll(() => page.evaluate(() => localStorage.getItem("imageQualityLevel"))).toBe("high");
    await expect(popover).toBeVisible();
    const high = group.getByRole("radio", { name: "高" });
    await expect(high).toHaveAttribute("aria-checked", "true");
    await page.keyboard.press("ArrowDown");
    await expect.poll(() => page.evaluate(() => localStorage.getItem("imageQualityLevel"))).toBe("medium");
    await expect(popover).toBeVisible();
    const medium = group.getByRole("radio", { name: "中" });
    await expect(medium).toHaveAttribute("aria-checked", "true");
    await page.keyboard.press("ArrowDown");
    await expect.poll(() => page.evaluate(() => localStorage.getItem("imageQualityLevel"))).toBe("low");
    await expect(popover).toBeVisible();
    const low = group.getByRole("radio", { name: "低" });
    await expect(low).toHaveAttribute("aria-checked", "true");
    await low.focus();
    await page.keyboard.press("Space");
    await expect(popover).toHaveCount(0);
    await expect(button).toHaveAttribute("aria-label", "画像品質: 低");
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

test("Sensitive CW Footer shortcut and SettingsDialog share the canonical setting", async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem("footerSettingShortcuts", JSON.stringify({ left: "fail-closed-content-warning", right: null }));
        localStorage.setItem("failClosedContentWarning", "false");
    });
    await enterApp(page);

    const shortcut = page.locator(".footer-setting-shortcut-button");
    await expect(shortcut).toHaveAttribute("aria-pressed", "false");
    await expect(shortcut).toHaveAttribute("aria-label", "CW送信形式");
    await expect(shortcut.locator(".content-warning-standard-icon")).toBeVisible();
    await shortcut.click();
    await expect.poll(() => page.evaluate(() => localStorage.getItem("failClosedContentWarning"))).toBe("true");
    await expect(shortcut).toHaveAttribute("aria-pressed", "true");
    await expect(shortcut.locator(".content-warning-hidden-icon")).toBeVisible();

    await page.locator(".settings-btn").click();
    const setting = page.getByRole("switch", { name: "対応クライアントでのみCW本文を表示" });
    await expect(setting).toHaveAttribute("aria-checked", "true");
    const infoButton = page.getByRole("button", { name: "CW設定の詳細" });
    await infoButton.click();
    await expect(page.getByText(/通常のNIP-36 Content Warningでは、CWに対応していないクライアントで本文がそのまま表示されます/)).toBeVisible();
    await expect(page.getByText(/CW本文を別のkind 36 eventに分けて送信し/)).toBeVisible();
    await expect(page.getByText(/全文検索で見つからないことがあります/)).toBeVisible();
    await page.keyboard.press("Escape");

    await setting.click();
    await expect.poll(() => page.evaluate(() => localStorage.getItem("failClosedContentWarning"))).toBe("false");
    await expect(shortcut).toHaveAttribute("aria-pressed", "false");
    await expect(shortcut.locator(".content-warning-standard-icon")).toBeVisible();
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
        const isPair = candidate.id === "quote-notification" || candidate.id === "reply-notification";
        const mainIcon = button.locator(isPair ? ".paired-main-icon" : ".shortcut-icon");
        await expect(button).toHaveAttribute("aria-pressed", "false");
        await expect(mainIcon).toHaveClass(new RegExp(candidate.offIcon));
        let buttonGeometry: { width: number; height: number } | undefined;
        let mainClasses: string | undefined;
        if (isPair) {
            const notificationIcon = button.locator(".paired-notification-icon");
            await expect(notificationIcon).toHaveClass(/notification-off/);
            const geometry = await button.evaluate((element) => {
                const buttonRect = element.getBoundingClientRect();
                const mainRect = element.querySelector<HTMLElement>(".paired-main-icon")!.getBoundingClientRect();
                const notificationRect = element.querySelector<HTMLElement>(".paired-notification-icon")!.getBoundingClientRect();
                const wrapper = element.querySelector<HTMLElement>(".paired-icons")!;
                return {
                    button: { width: buttonRect.width, height: buttonRect.height },
                    main: { left: mainRect.left, right: mainRect.right, width: mainRect.width, height: mainRect.height },
                    notification: { left: notificationRect.left, right: notificationRect.right, width: notificationRect.width, height: notificationRect.height },
                    wrapperDisplay: getComputedStyle(wrapper).display,
                    wrapperDirection: getComputedStyle(wrapper).flexDirection,
                    wrapperGap: getComputedStyle(wrapper).columnGap,
                    mainMask: getComputedStyle(element.querySelector<HTMLElement>(".paired-main-icon")!).maskImage,
                    notificationMask: getComputedStyle(element.querySelector<HTMLElement>(".paired-notification-icon")!).maskImage,
                };
            });
            buttonGeometry = geometry.button;
            mainClasses = await mainIcon.getAttribute("class") ?? undefined;
            expect(geometry.button).toEqual({ width: 72, height: 50 });
            expect(geometry.main.width).toBe(24);
            expect(geometry.main.height).toBe(24);
            expect(geometry.notification.width).toBe(24);
            expect(geometry.notification.height).toBe(24);
            expect(geometry.main.right).toBeLessThan(geometry.notification.left);
            expect(geometry.notification.left - geometry.main.right).toBe(4);
            expect(geometry.wrapperDisplay).toBe("flex");
            expect(geometry.wrapperDirection).toBe("row");
            expect(geometry.wrapperGap).toBe("4px");
            expect(geometry.mainMask).toContain(candidate.id === "quote-notification" ? "format_quote" : "chat_bubble");
            expect(geometry.notificationMask).toContain("notifications_off");
        }
        await expect(button).not.toHaveClass(/selected/);
        const previousMainClasses = mainClasses;
        const previousButtonGeometry = buttonGeometry;
        await button.click();
        await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), candidate.key)).toBe("true");
        await expect(button).toHaveAttribute("aria-pressed", "true");
        await expect(button).not.toHaveClass(/selected/);
        await expect(mainIcon).toHaveClass(new RegExp(candidate.onIcon));
        if (isPair) {
            await expect(button.locator(".paired-notification-icon")).toHaveClass(/notification-on/);
            const onState = await button.evaluate((element) => {
                const rect = element.getBoundingClientRect();
                const main = element.querySelector<HTMLElement>(".paired-main-icon")!;
                const notification = element.querySelector<HTMLElement>(".paired-notification-icon")!;
                return {
                    button: { width: rect.width, height: rect.height },
                    mainClasses: main.className,
                    mainMask: getComputedStyle(main).maskImage,
                    notificationMask: getComputedStyle(notification).maskImage,
                };
            });
            expect(onState.button).toEqual(previousButtonGeometry);
            expect(onState.mainClasses).toBe(previousMainClasses);
            expect(onState.mainMask).toContain(candidate.id === "quote-notification" ? "format_quote" : "chat_bubble");
            expect(onState.notificationMask).toContain("notifications_active");
            await expect(button).not.toHaveClass(/selected/);
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
    await page.getByRole("radio", { name: "高" }).click();
    await qualityButtons.nth(1).click();
    await page.getByRole("radio", { name: "高" }).click();
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

test("aligns Footer shortcut slots with its icon heading without narrow dialog overflow", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("footerSettingShortcuts", JSON.stringify(emptySlots)));
    await enterApp(page);

    for (const width of [360, 320]) {
        await page.setViewportSize({ width, height: 844 });
        await page.getByRole("button", { name: "設定", exact: true }).click();
        const dialog = page.getByRole("dialog");
        const headingLabel = dialog.locator(".footer-shortcuts-setting-heading .setting-label");
        const headingIcon = dialog.locator(".footer-shortcuts-setting-icon");
        const left = dialog.locator("#footer-shortcut-left");
        const right = dialog.locator("#footer-shortcut-right");
        await expect(headingLabel).toHaveText("フッターショートカット");
        await expect(headingIcon).toBeVisible();
        await expect(dialog.locator("select.footer-shortcut-select")).toHaveCount(2);
        await expect(left).toHaveAccessibleName("左側");
        await expect(right).toHaveAccessibleName("右側");

        const geometry = await dialog.evaluate((dialogElement) => {
            const getRect = (selector: string) => {
                const rect = dialogElement.querySelector<HTMLElement>(selector)!.getBoundingClientRect();
                return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height };
            };
            const headingIcon = dialogElement.querySelector<HTMLElement>(".footer-shortcuts-setting-icon")!;
            const referenceIcon = dialogElement.querySelector<HTMLElement>(".client-tag-setting-icon")!;
            const heading = dialogElement.querySelector<HTMLElement>(".footer-shortcuts-setting-heading .setting-label")!;
            const leftSlot = dialogElement.querySelector<HTMLElement>("#footer-shortcut-left")!.closest<HTMLElement>(".footer-shortcut-slot")!;
            const rightSlot = dialogElement.querySelector<HTMLElement>("#footer-shortcut-right")!.closest<HTMLElement>(".footer-shortcut-slot")!;
            const leftLabel = leftSlot.querySelector<HTMLElement>("span")!;
            const rightLabel = rightSlot.querySelector<HTMLElement>("span")!;
            const iconStyle = getComputedStyle(headingIcon);
            const dialogRect = dialogElement.getBoundingClientRect();
            return {
                icon: getRect(".footer-shortcuts-setting-icon"),
                referenceIcon: (() => {
                    const rect = referenceIcon.getBoundingClientRect();
                    return { width: rect.width, height: rect.height };
                })(),
                iconMask: iconStyle.maskImage,
                heading: getRect(".footer-shortcuts-setting-heading .setting-label"),
                headingRow: getRect(".footer-shortcuts-setting-heading"),
                leftSlot: (() => { const rect = leftSlot.getBoundingClientRect(); return { left: rect.left, right: rect.right }; })(),
                rightSlot: (() => { const rect = rightSlot.getBoundingClientRect(); return { left: rect.left, right: rect.right }; })(),
                leftSelect: getRect("#footer-shortcut-left"),
                rightSelect: getRect("#footer-shortcut-right"),
                leftLabel: { left: leftLabel.getBoundingClientRect().left, right: leftLabel.getBoundingClientRect().right },
                rightLabel: { left: rightLabel.getBoundingClientRect().left, right: rightLabel.getBoundingClientRect().right },
                dialog: { left: dialogRect.left, right: dialogRect.right, width: dialogRect.width, clientWidth: dialogElement.clientWidth, scrollWidth: dialogElement.scrollWidth },
                documentWidth: document.documentElement.scrollWidth,
                viewportWidth: window.innerWidth,
            };
        });

        expect(geometry.icon.width).toBe(geometry.referenceIcon.width);
        expect(geometry.icon.height).toBe(geometry.referenceIcon.height);
        expect(geometry.icon.width).toBe(24);
        expect(geometry.iconMask).toContain("vertical_align_bottom_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        expect(Math.abs((geometry.icon.top + geometry.icon.bottom) / 2 - (geometry.heading.top + geometry.heading.bottom) / 2)).toBeLessThanOrEqual(1);
        expect(Math.abs(geometry.heading.left - geometry.leftSlot.left)).toBeLessThanOrEqual(1);
        expect(Math.abs(geometry.heading.left - geometry.rightSlot.left)).toBeLessThanOrEqual(1);
        expect(Math.abs(geometry.leftSlot.left - geometry.rightSlot.left)).toBeLessThanOrEqual(1);
        expect(Math.abs(geometry.heading.left - geometry.leftLabel.left)).toBeLessThanOrEqual(1);
        expect(Math.abs(geometry.heading.left - geometry.rightLabel.left)).toBeLessThanOrEqual(1);
        for (const [select, slot] of [[geometry.leftSelect, geometry.leftSlot], [geometry.rightSelect, geometry.rightSlot]] as const) {
            expect(select.width).toBeGreaterThanOrEqual(120);
            expect(select.left).toBeGreaterThanOrEqual(slot.left);
            expect(select.right).toBeLessThanOrEqual(slot.right);
            expect(select.left).toBeGreaterThanOrEqual(geometry.dialog.left);
            expect(select.right).toBeLessThanOrEqual(geometry.dialog.right);
        }
        expect(geometry.dialog.scrollWidth).toBeLessThanOrEqual(geometry.dialog.clientWidth);
        expect(geometry.documentWidth).toBeLessThanOrEqual(geometry.viewportWidth);

        await left.selectOption("language");
        await expect(right.locator('option[value="language"]')).toHaveAttribute("disabled", "");
        await expect(dialog.locator("select.footer-shortcut-select")).toHaveCount(2);
        await page.getByRole("button", { name: "閉じる" }).click();
        await expect(page.locator(".footer-setting-shortcut-button")).toHaveCount(1);
        await expect(page.locator(".footer-setting-shortcut-button")).toHaveAttribute("aria-label", "言語: 日本語");
        await page.getByRole("button", { name: "設定", exact: true }).click();
        await page.locator("#footer-shortcut-left").selectOption("");
        await page.getByRole("button", { name: "閉じる" }).click();
        await expect(page.locator(".footer-setting-shortcut-button")).toHaveCount(0);
    }
});
