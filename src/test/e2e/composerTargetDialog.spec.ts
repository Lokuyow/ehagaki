import { expect, test, type Page } from "@playwright/test";

type HarnessState = {
    ready: boolean;
    inputs: Record<
        | "kind1"
        | "kind40"
        | "kind42"
        | "stale"
        | "namelessChannel"
        | "longNameChannel"
        | "unsupported"
        | "nsec",
        string
    >;
    applications: Array<{ action: string; kind: number }>;
};

type HarnessWindow = Window & typeof globalThis & {
    __COMPOSER_TARGET_HARNESS__?: HarnessState;
};

async function gotoHarness(page: Page): Promise<HarnessState> {
    await page.goto("composer-target-dialog-playwright.html");
    await page.waitForFunction(() =>
        Boolean((window as HarnessWindow).__COMPOSER_TARGET_HARNESS__?.ready)
    );
    return page.evaluate(() =>
        (window as HarnessWindow).__COMPOSER_TARGET_HARNESS__ as HarnessState
    );
}

async function openDialog(page: Page): Promise<void> {
    await page.getByRole("button", { name: "宛先を指定" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByLabel("イベントID")).toBeFocused();
}

async function choose(
    page: Page,
    value: string,
    action: "返信する" | "引用する" | "投稿する",
): Promise<void> {
    await page.getByLabel("イベントID").fill(value);
    await page.getByRole("button", { name: action }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
}

test.describe("composer target dialog fixture", () => {
    test("ヘッダー最右からkind 1/40/42の全5操作を適用できる", async ({ page }) => {
        const harness = await gotoHarness(page);
        const headerButtons = page.locator(".header-actions button");
        await expect(headerButtons.last()).toHaveAttribute("aria-label", "宛先を指定");

        const cases = [
            [harness.inputs.kind1, "返信する"],
            [harness.inputs.kind1, "引用する"],
            [harness.inputs.kind40, "投稿する"],
            [harness.inputs.kind42, "返信する"],
            [harness.inputs.kind42, "引用する"],
        ] as const;
        for (const [input, action] of cases) {
            await openDialog(page);
            await choose(page, input, action);
        }

        await expect(page.getByLabel("適用結果")).toHaveText(
            "1:reply,1:quote,40:channel,42:reply,42:quote",
        );
    });

    test("unsupportedとnsecを拒否し、入力競合では新しい結果だけを表示する", async ({ page }) => {
        const harness = await gotoHarness(page);
        await openDialog(page);
        const input = page.getByLabel("イベントID");

        await input.fill(harness.inputs.unsupported);
        await expect(page.getByText("この形式にはまだ対応していません"))
            .toBeVisible();
        await input.fill(harness.inputs.nsec);
        await expect(page.getByText("秘密鍵は宛先として使用できません")).toBeVisible();

        await input.fill(harness.inputs.stale);
        await page.waitForTimeout(300);
        await input.fill(harness.inputs.kind40);
        await expect(page.getByRole("button", { name: "投稿する" })).toBeVisible();
        await page.waitForTimeout(750);
        await expect(page.getByRole("button", { name: "投稿する" })).toBeVisible();
        await expect(page.getByRole("button", { name: "返信する" })).toBeHidden();
    });

    test("320pxと375pxで横方向にはみ出さない", async ({ page }, testInfo) => {
        const harness = await gotoHarness(page);
        const widths = testInfo.project.name === "mobile-chromium"
            ? [320, 375]
            : [375];
        for (const width of widths) {
            await page.setViewportSize({ width, height: 720 });
            if (!(await page.getByRole("dialog").isVisible())) {
                await openDialog(page);
            }
            for (const [input, expectedName] of [
                [
                    harness.inputs.namelessChannel,
                    "ID: eeeeeeeeeeee...eeeeeeee",
                ],
                [
                    harness.inputs.longNameChannel,
                    "LongChannelName".repeat(40),
                ],
            ] as const) {
                await page.getByLabel("イベントID").fill(input);
                await expect(page.getByRole("button", { name: "投稿する" }))
                    .toBeVisible();
                await expect(page.locator(".channel-name")).toHaveText(expectedName);
                const overflow = await page.evaluate(() =>
                    document.documentElement.scrollWidth
                    - document.documentElement.clientWidth
                );
                expect(overflow).toBeLessThanOrEqual(0);
            }
        }
    });
});
