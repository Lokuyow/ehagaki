import { expect, test } from "@playwright/test";
declare global { interface Window { __deliveryHarness?: {
    start(): number; ack(index: number, relay: number, ok?: boolean, done?: boolean): void;
    observed(index: number): boolean; reset(): void;
} } }
test.use({ trace: "off" });
test("success balloon waits for full delivery or two seconds of stalled progress", async ({ page }) => {
    await page.goto("relay-delivery-playwright.html?mascot=1");
    await page.waitForFunction(() => !!window.__deliveryHarness);
    await page.evaluate(() => { window.__deliveryHarness!.start(); window.__deliveryHarness!.ack(0, 0); });
    await expect(page.locator(".mascot-progress-accessible")).toHaveAttribute("aria-valuenow", "33");
    const success = page.locator(".compact-message.success");
    await expect(success).toHaveCount(0);
    await expect(success).toBeVisible({ timeout: 3000 });
    expect(await page.evaluate(() => window.__deliveryHarness!.observed(0))).toBe(true);
    await page.evaluate(() => window.__deliveryHarness!.start());
    await expect(success).toHaveCount(0);
    await page.evaluate(() => { for (let i = 0; i < 3; i++) window.__deliveryHarness!.ack(1, i); });
    await expect(success).toBeVisible();
    await page.evaluate(() => window.__deliveryHarness!.reset());
});
for (const theme of ["light", "dark"]) for (const surface of ["standalone", "iframe", "container"]) {
    test(`mascot fills upward and restores normally (${theme}, ${surface})`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width: 360, height: 640 });
        await page.goto(`relay-delivery-playwright.html?mascot=1&theme=${theme}${surface === "iframe" ? "&frame=1" : surface === "container" ? "&container=1" : ""}`);
        const frame = surface === "iframe" ? page.frames().find(frame => frame.parentFrame())! : page.mainFrame();
        await frame.waitForFunction(() => !!window.__deliveryHarness);
        await frame.evaluate(() => window.__deliveryHarness!.start());
        const progress = frame.locator(".mascot-progress-accessible");
        const base = frame.locator(".mascot-progress-base");
        await expect(progress).toHaveAttribute("aria-valuenow", "0");
        await expect(base).toHaveCSS("opacity", "0.3");
        await expect(frame.locator(".relay-delivery-toast")).toHaveCount(0);
        await frame.evaluate(() => window.__deliveryHarness!.ack(0, 0));
        await expect(progress).toHaveAttribute("aria-valuenow", "33");
        await expect.poll(() => frame.locator(".mascot-progress-clip").evaluate(el => Number(getComputedStyle(el).transform.split(",").at(-1)?.replace(")", "")))).toBeCloseTo(700 * 2 / 3, 1);
        await page.screenshot({ path: testInfo.outputPath(`mascot-${theme}-${surface}.png`) });
        await expect(progress).toHaveCount(0, { timeout: 3000 });
        await expect(base).toHaveCSS("opacity", "1");
        await frame.evaluate(() => { window.__deliveryHarness!.ack(0, 1); window.__deliveryHarness!.ack(0, 2); });
        await expect(progress).toHaveCount(0);
    });
}
test("surface switching preserves lifetime and dismissal; latest delivery never falls back to older work", async ({ page }) => {
    await page.goto("relay-delivery-playwright.html?mascot=1");
    await page.waitForFunction(() => !!window.__deliveryHarness);
    await page.evaluate(() => { window.__deliveryHarness!.start(); window.__deliveryHarness!.ack(0, 0); window.__deliveryHarness!.start(); });
    const progress = page.locator(".mascot-progress-accessible");
    await expect(progress).toHaveAttribute("aria-valuenow", "0");
    await page.evaluate(() => window.__deliveryHarness!.ack(0, 1));
    await expect(progress).toHaveAttribute("aria-valuenow", "0");
    await page.getByRole("button", { name: "Open dialog" }).click();
    await expect(progress).toHaveCount(0);
    await expect(page.locator(".relay-delivery-toast")).toHaveCount(2);
    await page.locator(".relay-delivery-toast").last().click();
    await page.getByRole("button", { name: "Close dialog" }).click();
    await expect(progress).toHaveCount(0);
    await page.evaluate(() => { window.__deliveryHarness!.ack(1, 0); window.__deliveryHarness!.ack(1, 1); window.__deliveryHarness!.ack(1, 2); });
    await expect(progress).toHaveCount(0);
    await page.evaluate(() => window.__deliveryHarness!.reset());
    await page.getByRole("button", { name: "Toggle mascot" }).click();
    await page.evaluate(() => window.__deliveryHarness!.start());
    await expect(page.locator(".relay-delivery-toast")).toHaveCount(1);
    await page.evaluate(() => window.__deliveryHarness!.reset());
});
for (const theme of ["light", "dark"]) for (const surface of ["standalone", "iframe", "container"]) {
    test(`delivery progress is silent, bounded and dismissible (${theme}, ${surface})`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width: 360, height: 640 });
        const query = surface === "iframe" ? `?frame=1&theme=${theme}` : `?theme=${theme}${surface === "container" ? "&container=1" : ""}`;
        await page.goto(`relay-delivery-playwright.html${query}`);
        const frame = surface === "iframe" ? page.frames().find(frame => frame.parentFrame())! : page.mainFrame();
        await frame.waitForFunction(() => !!window.__deliveryHarness);
        expect(await frame.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe(theme);
        await frame.evaluate(() => window.__deliveryHarness!.start());
        const toast = frame.locator(".relay-delivery-toast");
        await expect(toast).toHaveCount(1);
        await expect(toast.locator('[role="progressbar"]')).toHaveAttribute("aria-valuenow", "0");
        await frame.evaluate(() => window.__deliveryHarness!.ack(0, 0));
        await expect(toast.locator('[role="progressbar"]')).toHaveAttribute("aria-valuenow", "33");
        expect(await toast.innerText()).toBe("");
        await expect.poll(() => toast.evaluate(element => {
            const fill = element.querySelector(".relay-delivery-fill")!.getBoundingClientRect();
            const track = element.querySelector(".relay-delivery-track")!.getBoundingClientRect();
            return Math.abs(fill.height / track.height - 1 / 3) < .015 && Math.abs(fill.bottom - track.bottom) < 1 && track.height > track.width;
        })).toBe(true);
        const measurements = await toast.evaluate(element => ({ rect: element.getBoundingClientRect().toJSON(),
            footer: document.querySelector(".footer-bar")!.getBoundingClientRect().toJSON(),
            viewport: [innerWidth, innerHeight, visualViewport?.width, visualViewport?.height, visualViewport?.offsetTop],
            style: element.parentElement?.getAttribute("style") }));
        await expect.poll(() => toast.evaluate(element => {
            const r = element.getBoundingClientRect();
            const footer = document.querySelector(".footer-bar")!.getBoundingClientRect();
            return r.right <= innerWidth && r.bottom <= footer.top - 10 && r.left >= 0 && r.top >= 0;
        }), { message: JSON.stringify(measurements) }).toBe(true);
        await page.screenshot({ path: testInfo.outputPath(`${surface}-${theme}.png`) });
        await frame.getByRole("textbox", { name: "Composer", exact: true }).focus();
        await toast.click();
        await expect(toast).toHaveCount(0);
        await expect(frame.getByRole("textbox", { name: "Composer", exact: true })).toBeFocused();
        expect(await frame.evaluate(() => window.__deliveryHarness!.observed(0))).toBe(true);
        await frame.evaluate(() => window.__deliveryHarness!.ack(0, 1));
        await expect(toast).toHaveCount(0);
        await frame.evaluate(() => { window.__deliveryHarness!.ack(0, 2); window.__deliveryHarness!.reset(); });
    });
}
test("modal placement preserves the dialog, focus, keyboard dismissal and session cleanup", async ({ page }) => {
    await page.goto("relay-delivery-playwright.html");
    await page.getByRole("button", { name: "Open dialog" }).click();
    const input = page.getByRole("textbox", { name: "Dialog input" });
    await input.focus();
    await page.evaluate(() => window.__deliveryHarness!.start());
    const dialog = page.getByRole("dialog");
    const toast = dialog.locator(".relay-delivery-toast");
    await expect(toast).toBeVisible();
    await expect.poll(() => toast.evaluate(element => {
        const r = element.getBoundingClientRect();
        const d = element.closest('[role="dialog"]')!.getBoundingClientRect();
        const f = element.closest('[role="dialog"]')!.querySelector(".dialog-footer")!.getBoundingClientRect();
        return { contained: r.left >= d.left && r.right <= d.right && r.top >= d.top && r.bottom <= f.top - 10 };
    })).toEqual({ contained: true });
    await toast.click(); await expect(dialog).toBeVisible(); await expect(input).toBeFocused();
    await page.evaluate(() => window.__deliveryHarness!.start());
    await expect(toast).toBeVisible(); await toast.focus(); await page.keyboard.press("Enter");
    await expect(toast).toHaveCount(0); await expect(dialog).toBeVisible();
    await page.evaluate(() => { for (let i = 0; i < 4; i++) window.__deliveryHarness!.start(); });
    await expect(toast).toHaveCount(3);
    await page.evaluate(() => window.__deliveryHarness!.reset()); await expect(toast).toHaveCount(0);
    await page.getByRole("button", { name: "Open confirmation" }).click();
    await page.evaluate(() => window.__deliveryHarness!.start());
    const confirmation = page.getByRole("alertdialog");
    const confirmationToast = confirmation.locator(".relay-delivery-toast");
    await expect(confirmationToast).toBeVisible();
    await expect.poll(() => confirmationToast.evaluate(element => {
        const r = element.getBoundingClientRect();
        const buttons = element.closest('[role="alertdialog"]')!.querySelector(".confirm-dialog-buttons")!.getBoundingClientRect();
        return r.bottom <= buttons.top - 10;
    })).toBe(true);
    await confirmationToast.click(); await expect(confirmation).toBeVisible();
    await page.evaluate(() => window.__deliveryHarness!.reset());
});
test("full completion, slow partial fade, reduced motion and visual viewport changes", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("relay-delivery-playwright.html");
    await page.waitForFunction(() => !!window.__deliveryHarness);
    await page.evaluate(() => { window.__deliveryHarness!.start(); for (let i = 0; i < 3; i++) window.__deliveryHarness!.ack(0, i); });
    const toast = page.locator(".relay-delivery-toast");
    await expect(toast).toHaveAttribute("data-delivery-state", "complete");
    await expect(toast.locator('[role="progressbar"]')).toHaveAttribute("aria-valuenow", "100");
    expect(await toast.evaluate(el => getComputedStyle(el).animationName)).toBe("none");
    await expect(toast).toHaveCount(0);
    await page.evaluate(() => {
        window.__deliveryHarness!.start(); window.__deliveryHarness!.ack(1, 0);
        Object.defineProperty(window.visualViewport!, "height", { configurable: true, value: 360 });
        window.visualViewport!.dispatchEvent(new Event("resize"));
    });
    await expect(toast).toBeVisible();
    await expect.poll(() => toast.evaluate(el => el.getBoundingClientRect().bottom <= 350)).toBe(true);
    await page.evaluate(() => { window.__deliveryHarness!.ack(1, 1, false); window.__deliveryHarness!.ack(1, 2, false); });
    await expect(toast).toHaveAttribute("data-delivery-state", "incomplete");
    await expect(toast.locator('[role="progressbar"]')).toHaveAttribute("aria-valuenow", "33");
    await expect(toast).toHaveClass(/fading/); await expect(toast).toHaveCount(0, { timeout: 3000 });
});
