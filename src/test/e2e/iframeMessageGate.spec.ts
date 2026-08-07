import { expect, test, type Page } from "@playwright/test";

type HarnessWindow = Window & typeof globalThis & {
    __IFRAME_MESSAGE_GATE_HARNESS__: {
        sendValidContext: () => void;
        sendInvalidEnvelopeContext: () => void;
        sendSiblingContext: () => void;
        sendWrongOriginContext: () => void;
        sendSiblingStorageResult: () => void;
        sendStorageResult: () => void;
    };
};

async function callHarness(
    page: Page,
    action: keyof HarnessWindow["__IFRAME_MESSAGE_GATE_HARNESS__"],
): Promise<void> {
    await page.evaluate((name) => {
        (window as HarnessWindow).__IFRAME_MESSAGE_GATE_HARNESS__[name]();
    }, action);
}

test.describe("iframe message trust gate", () => {
    test("actual parent sourceだけがvalid envelopeをcomposer context serviceへ届ける", async ({ page }) => {
        await page.goto("iframe-message-gate-playwright.html");
        await expect(page.getByLabel("Harness ready")).toHaveText("true");

        const target = page.frameLocator('iframe[title="iframe-message-gate-target"]');
        await expect(target.getByLabel("Child ready")).toHaveText("true");

        await callHarness(page, "sendInvalidEnvelopeContext");
        await callHarness(page, "sendValidContext");
        await expect(target.getByLabel("Composer count")).toHaveText("1");

        await callHarness(page, "sendSiblingContext");
        await expect(page.getByLabel("Sibling send status")).toHaveText("sent");
        await callHarness(page, "sendValidContext");
        await expect(target.getByLabel("Composer count")).toHaveText("2");
    });

    test("trusted origin不一致のchildはactual parentからのmessageをroutingしない", async ({ page }) => {
        await page.goto("iframe-message-gate-playwright.html");
        await expect(page.getByLabel("Harness ready")).toHaveText("true");

        const target = page.frameLocator('iframe[title="iframe-message-gate-wrong-origin-target"]');
        await expect(target.getByLabel("Child ready")).toHaveText("true");
        await callHarness(page, "sendWrongOriginContext");
        await expect(target.getByLabel("Composer count")).toHaveText("0");
    });

    test("wrong source storage responseはpendingを消費せずparent responseでresolveする", async ({ page }) => {
        await page.goto("iframe-message-gate-playwright.html");
        await expect(page.getByLabel("Harness ready")).toHaveText("true");

        const target = page.frameLocator('iframe[title="iframe-message-gate-target"]');
        await target.getByRole("button", { name: "Request storage" }).click();
        await expect(page.getByLabel("Storage request ID")).not.toBeEmpty();

        await callHarness(page, "sendSiblingStorageResult");
        await expect(page.getByLabel("Sibling send status")).toHaveText("sent");
        await callHarness(page, "sendStorageResult");
        await expect(target.getByLabel("Storage result")).toHaveText("en");
    });
});
