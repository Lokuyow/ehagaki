import { expect, test } from "@playwright/test";
import { openSettingsToCategory } from "./settingsNavigation";

for (const surface of ["page", "iframe"] as const) {
    test(`opens the settings category with another dialog present (${surface})`, async ({ page }) => {
        const content = `
            <button class="settings-btn" onclick="document.querySelector('.settings-dialog').hidden = false">Settings</button>
            <div role="dialog" aria-label="Welcome">
                <button onclick="this.textContent = 'Wrong dialog'">表示</button>
            </div>
            <div role="dialog" aria-label="Settings" class="settings-dialog" hidden>
                <button onclick="this.textContent = 'Display category opened'">表示</button>
            </div>
        `;
        await page.setContent(surface === "page" ? content : '<iframe title="eHagaki"></iframe>');
        if (surface === "iframe") {
            await page.locator("iframe").evaluate((iframe, html) => {
                (iframe as HTMLIFrameElement).srcdoc = html;
            }, content);
        }
        const root = surface === "page" ? page : page.frameLocator("iframe");

        await openSettingsToCategory(root, "display");

        await expect(root.getByRole("dialog")).toHaveCount(2);
        await expect(root.getByRole("dialog", { name: "Settings", exact: true }))
            .toContainText("Display category opened");
        await expect(root.getByRole("dialog", { name: "Welcome", exact: true }))
            .toContainText("表示");
    });
}
