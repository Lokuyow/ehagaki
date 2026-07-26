import { expect, test, type Page } from "@playwright/test";

type HarnessState = {
    ready: boolean;
    inputs: Record<
        | "kind1"
        | "kind40"
        | "kind42"
        | "stale"
        | "wrappingPost"
        | "linkPost"
        | "exactlyFiveLinePost"
        | "oversizedPost"
        | "mediaPost"
        | "whitespacePost"
        | "namelessChannel"
        | "longNameChannel"
        | "unsupported"
        | "nsec",
        string
    >;
    oversizedPostContentLength: number;
    linkTargetUrl: string;
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

    test("長文末尾の4画像と動画を共通配置で表示し、狭幅でもはみ出さない", async ({
        page,
    }) => {
        await page.route("**/preview-media-*", (route) => route.abort());
        const harness = await gotoHarness(page);
        await page.setViewportSize({ width: 320, height: 720 });
        await openDialog(page);
        await page.getByLabel("イベントID").fill(harness.inputs.mediaPost);

        const previewContent = page.locator(".event-content");
        await expect(previewContent).toBeVisible();
        expect(await previewContent.textContent()).toHaveLength(2_000);

        const rows = page.locator(".post-history-image-row");
        await expect(rows).toHaveCount(2);
        await expect(rows.nth(0).locator(".post-history-image-cell"))
            .toHaveCount(2);
        await expect(rows.nth(1).locator(".post-history-image-cell"))
            .toHaveCount(2);
        await expect(page.locator(".post-history-video-card")).toHaveCount(1);
        await expect(page.locator("video[autoplay]")).toHaveCount(0);

        const overflow = await page.locator(".target-preview").evaluate(
            (element) => element.scrollWidth - element.clientWidth,
        );
        expect(overflow).toBeLessThanOrEqual(1);
    });

    test("画像ビューアーをEscapeと戻るで閉じ、起点へフォーカスを戻す", async ({
        page,
    }) => {
        const imageBody = Buffer.from(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
            "base64",
        );
        await page.route("**/preview-media-*.jpg", (route) =>
            route.fulfill({
                status: 200,
                contentType: "image/png",
                body: imageBody,
            }),
        );
        await page.route("**/preview-media-video.mp4", (route) => route.abort());
        const harness = await gotoHarness(page);
        await openDialog(page);
        await page.getByLabel("イベントID").fill(harness.inputs.mediaPost);

        const firstImage = page.locator(".post-history-image-surface").first();
        await expect(firstImage).toBeVisible();
        await firstImage.focus();
        await firstImage.press("Enter");
        await expect(page.locator(".ehagaki-pswp")).toBeVisible();
        await page.keyboard.press("Escape");
        await expect(page.locator(".ehagaki-pswp")).toBeHidden();
        await expect(page.getByRole("dialog")).toBeVisible();
        await expect(firstImage).toBeFocused();

        await firstImage.press("Enter");
        await expect(page.locator(".ehagaki-pswp")).toBeVisible();
        await page.goBack();
        await expect(page.locator(".ehagaki-pswp")).toBeHidden();
        await expect(page.getByRole("dialog")).toBeVisible();
        await expect(firstImage).toBeFocused();
    });

    test("実際の折り返しとResizeObserver再計測に応じて展開ボタンを切り替える", async ({
        page,
    }) => {
        const harness = await gotoHarness(page);
        await page.setViewportSize({ width: 375, height: 720 });
        await openDialog(page);
        await page
            .getByLabel("イベントID")
            .fill(harness.inputs.wrappingPost);

        const previewContent = page.locator(".event-content");
        const expandButton = page.getByRole("button", { name: "もっと見る" });
        await expect(expandButton).toBeVisible();
        await expect(expandButton).toHaveAttribute("aria-expanded", "false");
        const controlledId = await expandButton.getAttribute("aria-controls");
        expect(controlledId).toBeTruthy();
        await expect(page.locator(`#${controlledId}`)).toHaveCount(1);
        await expect(previewContent).toHaveCSS("overflow", "hidden");
        await expect
            .poll(() =>
                previewContent.evaluate(
                    (element) => element.scrollHeight > element.clientHeight,
                ),
            )
            .toBe(true);

        await page.setViewportSize({ width: 900, height: 720 });
        await expect(expandButton).toBeHidden();
        await expect
            .poll(() =>
                previewContent.evaluate(
                    (element) => element.scrollHeight === element.clientHeight,
                ),
            )
            .toBe(true);

        await page.setViewportSize({ width: 375, height: 720 });
        await expect(expandButton).toBeVisible();
        await expandButton.click();
        const collapseButton = page.getByRole("button", {
            name: "折りたたむ",
        });
        await expect(collapseButton).toHaveAttribute("aria-expanded", "true");
        await expect(previewContent).not.toHaveCSS("overflow", "hidden");
        await expect
            .poll(() =>
                previewContent.evaluate(
                    (element) => element.scrollHeight === element.clientHeight,
                ),
            )
            .toBe(true);

        await collapseButton.click();
        await expect(expandButton).toHaveAttribute("aria-expanded", "false");
        await expect(previewContent).toHaveCSS("overflow", "hidden");
        await expect
            .poll(() =>
                previewContent.evaluate(
                    (element) => element.scrollHeight > element.clientHeight,
                ),
            )
            .toBe(true);
    });

    test("投稿参照リンクは折りたたみ前後で属性と親ダイアログ状態を維持する", async ({
        page,
    }, testInfo) => {
        await page.route("**/reference-link-target", (route) =>
            route.fulfill({
                contentType: "text/html",
                body: "<title>Reference target</title>",
            }),
        );
        const harness = await gotoHarness(page);
        await page.setViewportSize({ width: 375, height: 720 });
        await openDialog(page);
        await page.getByLabel("イベントID").fill(harness.inputs.linkPost);

        const dialog = page.getByRole("dialog");
        const preview = dialog.locator(".event-content");
        const link = preview.getByRole("link", {
            name: harness.linkTargetUrl,
        });
        const expandButton = dialog.getByRole("button", {
            name: "もっと見る",
        });
        await expect(link).toHaveAttribute("href", harness.linkTargetUrl);
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAttribute("rel", "noopener noreferrer");
        await expect(expandButton).toHaveAttribute("aria-expanded", "false");

        const popupPromise = page.waitForEvent("popup");
        if (testInfo.project.name === "mobile-chromium") {
            await link.tap();
        } else {
            await link.click();
        }
        const popup = await popupPromise;
        await popup.close();
        await expect(dialog).toBeVisible();
        await expect(expandButton).toHaveAttribute("aria-expanded", "false");

        await expandButton.click();
        await expect(
            dialog.getByRole("button", { name: "折りたたむ" }),
        ).toHaveAttribute("aria-expanded", "true");
        await expect(link).toBeVisible();
        const overflow = await preview.evaluate(
            (element) => element.scrollWidth - element.clientWidth,
        );
        expect(overflow).toBeLessThanOrEqual(1);
    });

    test("ちょうど5行の投稿には展開ボタンを表示しない", async ({
        page,
    }) => {
        const harness = await gotoHarness(page);
        await page.setViewportSize({ width: 375, height: 720 });
        await openDialog(page);
        await page
            .getByLabel("イベントID")
            .fill(harness.inputs.exactlyFiveLinePost);

        const previewContent = page.locator(".event-content");
        await expect(previewContent).toBeVisible();
        await expect(
            page.getByRole("button", { name: "もっと見る" }),
        ).toBeHidden();
        await expect
            .poll(() =>
                previewContent.evaluate((element) => {
                    const lineHeight = Number.parseFloat(
                        getComputedStyle(element).lineHeight,
                    );
                    return Math.round(element.scrollHeight / lineHeight);
                }),
            )
            .toBe(5);
    });

    test("描画上限超過contentは展開時だけ全文をDOMへ配置する", async ({
        page,
    }) => {
        const harness = await gotoHarness(page);
        await openDialog(page);
        await page
            .getByLabel("イベントID")
            .fill(harness.inputs.oversizedPost);

        const previewContent = page.locator(".event-content");
        const expandButton = page.getByRole("button", { name: "もっと見る" });
        await expect(expandButton).toBeVisible();
        await expect
            .poll(() =>
                previewContent.evaluate(
                    (element) => element.textContent?.length ?? 0,
                ),
            )
            .toBeLessThan(harness.oversizedPostContentLength);

        await expandButton.click();
        await expect
            .poll(() =>
                previewContent.evaluate(
                    (element) => element.textContent?.length ?? 0,
                ),
            )
            .toBe(harness.oversizedPostContentLength);

        await page.getByRole("button", { name: "折りたたむ" }).click();
        await expect
            .poll(() =>
                previewContent.evaluate(
                    (element) => element.textContent?.length ?? 0,
                ),
            )
            .toBeLessThan(harness.oversizedPostContentLength);
    });

    test("先頭2000文字が空白でも同じトグルDOMとフォーカスを維持して展開・再折りたたみできる", async ({
        page,
    }) => {
        const harness = await gotoHarness(page);
        await openDialog(page);
        await page
            .getByLabel("イベントID")
            .fill(harness.inputs.whitespacePost);

        const expandButton = page.getByRole("button", { name: "もっと見る" });
        const controlledId = await expandButton.getAttribute("aria-controls");
        expect(controlledId).toBeTruthy();
        const collapsedTarget = page.locator(`#${controlledId}`);
        await expect(collapsedTarget).toHaveCount(1);
        await expect(collapsedTarget).toHaveAttribute("hidden", "");
        expect(await collapsedTarget.boundingBox()).toBeNull();

        await expandButton.evaluate((element) => {
            element.setAttribute("data-focus-regression-node", "retained");
        });
        await expandButton.focus();
        await expandButton.press("Enter");

        const collapseButton = page.getByRole("button", { name: "折りたたむ" });
        await expect(collapseButton).toBeFocused();
        await expect(collapseButton).toHaveAttribute(
            "data-focus-regression-node",
            "retained",
        );
        await expect(page.getByText("Whitespace tail content")).toBeVisible();
        await expect(page.locator(`#${controlledId}`)).toHaveCount(1);

        await collapseButton.press("Enter");

        await expect(expandButton).toBeFocused();
        await expect(expandButton).toHaveAttribute(
            "data-focus-regression-node",
            "retained",
        );
        await expect(page.getByText("Whitespace tail content")).toBeHidden();
        await expect(page.locator(`#${controlledId}`)).toHaveAttribute(
            "hidden",
            "",
        );
    });

    test("スマートフォンの短い内容は上寄せし、長い内容はviewport全高を使う", async ({
        page,
    }, testInfo) => {
        const harness = await gotoHarness(page);
        const isMobile = testInfo.project.name === "mobile-chromium";
        await page.setViewportSize({
            width: isMobile ? 375 : 900,
            height: 720,
        });
        await openDialog(page);

        const centerRatio = await page.getByRole("dialog").evaluate((dialog) => {
            const rect = dialog.getBoundingClientRect();
            return (rect.top + rect.height / 2) / window.innerHeight;
        });
        expect(centerRatio).toBeCloseTo(isMobile ? 0.43 : 0.5, 2);

        if (!isMobile) return;

        await page.setViewportSize({ width: 375, height: 480 });
        await page.getByLabel("イベントID").fill(harness.inputs.oversizedPost);
        const expandButton = page.getByRole("button", { name: "もっと見る" });
        await expect(expandButton).toBeVisible();
        await expandButton.click();

        const geometry = await page.getByRole("dialog").evaluate((dialog) => {
            const rect = dialog.getBoundingClientRect();
            const content = dialog.querySelector<HTMLElement>(".dialog-content");
            const footer = dialog.querySelector<HTMLElement>(".dialog-footer");
            return {
                top: rect.top,
                bottom: rect.bottom,
                height: rect.height,
                viewportTop: window.visualViewport?.offsetTop ?? 0,
                viewportHeight: window.visualViewport?.height ?? window.innerHeight,
                contentClientHeight: content?.clientHeight ?? 0,
                contentScrollHeight: content?.scrollHeight ?? 0,
                footerTop: footer?.getBoundingClientRect().top ?? 0,
                footerBottom: footer?.getBoundingClientRect().bottom ?? 0,
            };
        });
        const viewportBottom = geometry.viewportTop + geometry.viewportHeight;
        const oldMaximumHeight = geometry.viewportHeight * 0.86 - 24;
        expect(geometry.top).toBeGreaterThanOrEqual(geometry.viewportTop + 12);
        expect(geometry.bottom).toBeLessThanOrEqual(
            viewportBottom - 12,
        );
        expect(geometry.height).toBeGreaterThan(oldMaximumHeight);
        expect(geometry.contentScrollHeight).toBeGreaterThan(
            geometry.contentClientHeight,
        );
        expect(geometry.footerTop).toBeGreaterThanOrEqual(geometry.top);
        expect(geometry.footerBottom).toBeLessThanOrEqual(geometry.bottom);

        const autoPanGeometry = await page.getByRole("dialog").evaluate((dialog) => {
            const viewportTop = 231;
            const viewportHeight = 314;
            const rootStyle = document.documentElement.style;
            rootStyle.setProperty("--mobile-dialog-viewport-top", `${viewportTop}px`);
            rootStyle.setProperty("--mobile-dialog-viewport-height", `${viewportHeight}px`);
            rootStyle.setProperty(
                "--mobile-dialog-center-y",
                `${viewportTop + viewportHeight * 0.43}px`,
            );
            const rect = dialog.getBoundingClientRect();
            return {
                top: rect.top,
                bottom: rect.bottom,
                viewportTop,
                viewportHeight,
            };
        });
        expect(autoPanGeometry.top).toBeGreaterThanOrEqual(
            autoPanGeometry.viewportTop + 12,
        );
        expect(autoPanGeometry.bottom).toBeLessThanOrEqual(
            autoPanGeometry.viewportTop + autoPanGeometry.viewportHeight - 12,
        );
    });
});
