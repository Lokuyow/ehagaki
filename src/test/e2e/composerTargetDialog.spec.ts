import { expect, test, type Page } from "@playwright/test";
import { nip19 } from "nostr-tools";

type HarnessState = {
    ready: boolean;
    inputs: Record<
        | "kind1"
        | "sensitive"
        | "sensitivePayload"
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
        | "nsec"
        | "repost6" | "repost16" | "repostTo6" | "repostTo16" | "reaction7" | "emojiReaction" | "channelReaction"
        | "missingReaction" | "heldReaction" | "invalidReaction" | "markerReaction",
        string
    >;
    oversizedPostContentLength: number;
    linkTargetUrl: string;
    resolverEventIds: string[];
    cancelledResolverEventIds: string[];
    relatedFetchIds: string[];
    relatedCancelledIds: string[];
    applications: Array<{ action: string; kind: number; eventId: string }>;
};

type HarnessWindow = Window & typeof globalThis & {
    __COMPOSER_TARGET_HARNESS__?: HarnessState & {
        seedReactionFixtures: () => Promise<void>;
        releaseStaleResolver: () => void;
        recoverRelated: () => void;
        releaseRelated: () => void;
    };
};

async function gotoHarness(page: Page): Promise<HarnessState> {
    await page.goto("composer-target-dialog-playwright.html");
    await page.waitForFunction(() =>
        Boolean((window as HarnessWindow).__COMPOSER_TARGET_HARNESS__?.ready)
    );
    return page.evaluate(() => {
        const harness = (window as HarnessWindow).__COMPOSER_TARGET_HARNESS__!;
        return {
            ready: harness.ready,
            inputs: harness.inputs,
            oversizedPostContentLength: harness.oversizedPostContentLength,
            linkTargetUrl: harness.linkTargetUrl,
            resolverEventIds: harness.resolverEventIds,
            cancelledResolverEventIds: harness.cancelledResolverEventIds,
            relatedFetchIds: harness.relatedFetchIds,
            relatedCancelledIds: harness.relatedCancelledIds,
            applications: harness.applications,
        };
    });
}

async function openDialog(page: Page, language: "ja" | "en" = "ja"): Promise<void> {
    const labels = language === "en"
        ? { title: "Choose target", input: "Event ID" }
        : { title: "宛先を指定", input: "イベントID" };
    await page.getByRole("button", { name: labels.title }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByLabel(labels.input)).toBeFocused();
}

async function choose(
    page: Page,
    value: string,
    action: "リプライ" | "引用" | "投稿する",
): Promise<void> {
    await page.getByLabel("イベントID").fill(value);
    await page.getByRole("button", { name: action }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
}

async function expectTooltip(
    page: Page,
    trigger: ReturnType<Page["locator"]>,
    text: string,
) {
    await trigger.hover();
    await expect(page.locator('.tooltip-content:visible')).toHaveText(text);
}

test.describe("composer target dialog fixture", () => {
    for (const key of ['reaction7', 'missingReaction', 'invalidReaction'] as const) {
        for (const [action, label] of [['reply', 'リプライ'], ['quote', '引用'], ['reaction', 'リアクションする']] as const) {
            test(`kind 7 applies ${action} to the input event with ${key}`, async ({ page }) => {
                const harness = await gotoHarness(page);
                await openDialog(page);
                await page.getByLabel('イベントID').fill(harness.inputs[key]);
                const dialog = page.getByRole('dialog', { name: '宛先を指定' });
                // The outer footer follows the related card and keeps the selected reaction as its target.
                await dialog.getByRole('button', { name: label, exact: true }).last().click();
                await expect(dialog).toBeHidden();
                const applications = await page.evaluate(() => (window as HarnessWindow).__COMPOSER_TARGET_HARNESS__!.applications);
                const pointer = nip19.decode(harness.inputs[key]);
                expect(applications).toEqual([{ action, kind: 7,
                    eventId: pointer.type === 'note' ? pointer.data : '' }]);
            });
        }
    }

    test('kind 7 offers Repost and author-only deletion', async ({ page }) => {
        const harness = await gotoHarness(page);
        await openDialog(page);
        await page.getByLabel('イベントID').fill(harness.inputs.reaction7);
        await page.getByRole('button', { name: 'アクションを表示', exact: true }).click();
        await expect(page.getByRole('menuitem', { name: '削除', exact: true })).toHaveCount(0);
        await page.getByRole('menuitem', { name: 'リポスト', exact: true }).click();
        const pointer = nip19.decode(harness.inputs.reaction7);
        await expect.poll(() => page.evaluate(() =>
            (window as unknown as { __COMPOSER_TARGET_HARNESS__: { reposts: string[] } }).__COMPOSER_TARGET_HARNESS__.reposts,
        )).toEqual([pointer.type === 'note' ? pointer.data : '']);
        await page.evaluate(() => (window as unknown as {
            __COMPOSER_TARGET_HARNESS__: { useReactionOwner: (owner: boolean) => void };
        }).__COMPOSER_TARGET_HARNESS__.useReactionOwner(true));
        await page.getByRole('button', { name: 'アクションを表示', exact: true }).click();
        await page.getByRole('menuitem', { name: '削除', exact: true }).click();
        await expect(page.getByRole('alertdialog')).toBeVisible();
        await page.getByRole('alertdialog').getByRole('button', { name: 'キャンセル', exact: true }).click();
        await expect(page.getByRole('dialog', { name: '宛先を指定' })).toBeVisible();
    });

    for (const key of ["repost6", "repost16", "repostTo6", "repostTo16", "reaction7", "markerReaction", "channelReaction"] as const) {
        test(`Repost and Reaction preserve main identity and only show a direct related card: ${key}`, async ({ page }) => {
            await page.emulateMedia({ colorScheme: "dark" });
            const harness = await gotoHarness(page);
            await openDialog(page);
            await page.getByLabel("イベントID").fill(harness.inputs[key]);
            const reaction = key === "reaction7" || key === "markerReaction" || key === "channelReaction";
            const main = page.locator(reaction ? ".composer-target-reaction-preview" : ".composer-target-repost-preview");
            const related = page.locator(reaction ? ".composer-target-reaction-preview" : ".post-history-repost");
            await expect(main.locator(".interaction-author")).toContainText("Outer fixture author");
            await expect(main.locator(".interaction-author .composer-target-avatar")).toBeVisible();
            await expect(page.locator(".target-preview, .composer-target-related-preview")).toHaveCount(0);
            if (reaction) {
                await expect(main.locator(".composer-target-reaction-label")).toContainText("リアクション");
                await expect(main.locator("h3, .related-kind")).toHaveCount(0);
            } else {
                await expect(main.locator(".post-history-repost-label")).toContainText("リポスト");
                await expect(main.locator(".related-kind")).toHaveCount(0);
            }
            await expect(related).toContainText("Related fixture author");
            await expect(related.locator(".post-history-related-card")).toHaveCount(1);
            await expect(main).not.toContainText("Nested JSON must stay hidden");
            await expect(related).not.toContainText("Nested JSON must stay hidden");
            await expect(related.locator("a, .post-preview-media-item")).toHaveCount(0);
            await expect(main.getByRole("button", { name: "リプライ", exact: true })).toHaveCount(0);
            await expect(main.getByRole("button", { name: "引用", exact: true })).toHaveCount(0);
            if (reaction) await expect(main.locator(".composer-target-reaction-label .favorite-icon")).toHaveCount(1);
            else await expect(main).toContainText("リポスト");
            if (key === "reaction7" || key === "markerReaction") await expect(related).toContainText("👀");
            if (key === "repost16" || key === "channelReaction") await expect(main.locator(".repost-channel-row, .related-channel-row")).toContainText("Related fixture channel");
            const menu = main.getByRole("button", { name: "アクションを表示" });
            await menu.focus();
            await expect(menu).toBeFocused();
            await menu.press("Enter");
            await page.getByRole("menuitem", { name: "イベントJSONを表示" }).click();
            const decoded = nip19.decode(harness.inputs[key]);
            const expectedId = decoded.type === "note" ? decoded.data : decoded.type === "nevent" ? decoded.data.id : "";
            const raw = page.getByRole("dialog", { name: "イベントJSON" });
            await expect(raw).toContainText(`"id": "${expectedId}"`);
            await page.keyboard.press("Escape");
            await expect(raw).toBeHidden();
            await expect(page.getByRole("dialog", { name: "宛先を指定" })).toBeVisible();
        });
    }

    test("Repost and Reaction related cards reflow with accessible actions", async ({ page }, testInfo) => {
        await page.emulateMedia({ colorScheme: "dark" });
        const harness = await gotoHarness(page);
        await openDialog(page);
        await page.getByLabel("イベントID").fill(harness.inputs.repost16);
        await expect(page.locator(".repost-channel-row")).toContainText("Related fixture channel");
        await page.screenshot({ path: testInfo.outputPath("composer-repost-history-style.png") });
        for (const width of [360, 320]) {
            await page.setViewportSize({ width, height: 720 });
            const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth
                || Array.from(document.querySelectorAll(".target-preview, .composer-target-related-preview, .post-history-repost, .post-history-related-card"))
                    .some(element => element.scrollWidth > element.clientWidth + 1));
            expect(overflow).toBe(false);
            await page.screenshot({ path: testInfo.outputPath(`composer-repost-history-style-${width}.png`) });
        }
        await page.getByLabel("イベントID").fill(harness.inputs.reaction7);
        await expect(page.locator(".composer-target-reaction-label .favorite-icon")).toHaveCount(1);
        for (const width of [360, 320]) {
            await page.setViewportSize({ width, height: 720 });
            const overflow = await page.locator(".composer-target-reaction-preview").evaluate(element =>
                element.scrollWidth > element.clientWidth + 1 || document.documentElement.scrollWidth > window.innerWidth);
            expect(overflow).toBe(false);
            const footer = page.locator('.composer-target-reaction-preview + .post-preview-footer');
            for (const name of ['リプライ', '引用', 'リアクションする']) {
                const button = footer.getByRole('button', { name, exact: true });
                await expect(button).toBeVisible();
                const bounds = await button.boundingBox();
                expect(bounds).not.toBeNull();
                expect(bounds!.x).toBeGreaterThanOrEqual(0);
                expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
            }
            await page.getByRole("dialog", { name: "宛先を指定" }).screenshot({ path: testInfo.outputPath(`composer-reaction-history-style-${width}.png`) });
        }
        await page.getByRole("button", { name: "アクションを表示" }).click();
        await page.getByRole("menuitem", { name: "イベントJSONを表示" }).click();
        const raw = page.getByRole("dialog", { name: "イベントJSON" });
        await expect(raw).toContainText('"kind": 7');
        await expect(raw).toContainText('"content": "👍"');
        await expect(raw).toBeVisible();
        await page.keyboard.press("Escape");
        await expect(raw).toBeHidden();
        await expect(page.getByRole("dialog", { name: "宛先を指定" })).toBeVisible();
    });

    test("related loading, cancellation, invalid references and retry leave the main target intact", async ({ page }) => {
        const harness = await gotoHarness(page);
        await openDialog(page);
        await page.getByLabel("イベントID").fill(harness.inputs.heldReaction);
        await expect(page.locator(".composer-target-reaction-preview")).toContainText("参照先を取得中");
        await expect(page.locator(".composer-target-reaction-label .favorite-icon")).toHaveCount(1);
        await page.getByLabel("イベントID").fill(harness.inputs.invalidReaction);
        await expect(page.locator(".composer-target-reaction-preview")).toContainText("検証できませんでした");
        await page.evaluate(() => (window as HarnessWindow).__COMPOSER_TARGET_HARNESS__!.releaseRelated());
        await expect(page.getByText("Released related fixture", { exact: true })).toHaveCount(0);
        expect(await page.evaluate(() => (window as HarnessWindow).__COMPOSER_TARGET_HARNESS__!.relatedFetchIds.length)).toBe(1);
        expect(await page.evaluate(() => (window as HarnessWindow).__COMPOSER_TARGET_HARNESS__!.relatedCancelledIds.length)).toBe(1);
        await page.getByLabel("イベントID").fill(harness.inputs.missingReaction);
        await expect(page.locator(".composer-target-reaction-label .favorite-icon")).toHaveCount(1);
        await expect(page.locator(".composer-target-reaction-preview")).toContainText("取得できませんでした");
        await page.evaluate(() => (window as HarnessWindow).__COMPOSER_TARGET_HARNESS__!.recoverRelated());
        const retryButton = page.getByRole("button", { name: "再試行", exact: true });
        for (const width of [360, 320]) {
            await page.setViewportSize({ width, height: 720 });
            const overlapsFooter = await retryButton.evaluate((button) => {
                const footer = document.querySelector<HTMLElement>(
                    ".composer-target-content > .post-preview-footer",
                );
                if (!footer) throw new Error("main target footer is missing");
                const retry = button.getBoundingClientRect();
                const footerRect = footer.getBoundingClientRect();
                return retry.left < footerRect.right
                    && retry.right > footerRect.left
                    && retry.top < footerRect.bottom
                    && retry.bottom > footerRect.top;
            });
            expect(overlapsFooter, `Retry overlaps footer at ${width}px`).toBe(false);
        }
        await retryButton.click();
        await expect(page.locator(".composer-target-reaction-preview")).toContainText("Recovered related fixture");
    });

    test("custom emoji Reaction uses the existing image loader", async ({ page }) => {
        await page.route("https://example.com/reaction-party.png", route => route.fulfill({
            contentType: "image/svg+xml", body: '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="24"><rect width="512" height="24" fill="red"/></svg>',
        }));
        const harness = await gotoHarness(page);
        await openDialog(page);
        await page.getByLabel("イベントID").fill(harness.inputs.emojiReaction);
        await expect(page.locator(".composer-target-reaction-label .favorite-icon")).toHaveCount(1);
        await expect(page.locator(".composer-target-reaction-preview")).toContainText("Related fixture body");
        for (const width of [360, 320]) {
            await page.setViewportSize({ width, height: 720 });
            const overflow = await page.locator(".composer-target-reaction-preview").evaluate(element =>
                element.scrollWidth > element.clientWidth + 1 || document.documentElement.scrollWidth > window.innerWidth);
            expect(overflow).toBe(false);
        }
    });
    test("解決済みkind 1/42のリアクション詳細を既存アクション列で表示する", async ({ page }) => {
        let emojiRequests = 0;
        await page.route("https://example.com/reaction-party.png", async (route) => {
            emojiRequests += 1;
            await route.fulfill({
                status: 200,
                contentType: "image/png",
                body: Buffer.from(
                    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jW9sAAAAASUVORK5CYII=",
                    "base64",
                ),
            });
        });
        const harness = await gotoHarness(page);
        await page.evaluate(async () => {
            await (window as HarnessWindow).__COMPOSER_TARGET_HARNESS__!.seedReactionFixtures();
        });
        await page.setViewportSize({ width: 320, height: 780 });
        await openDialog(page);

        const targetPreview = page.locator(".target-preview");
        const reactionButton = (label: "表示" | "隠す") => page.getByRole("button", {
            name: label === "表示" ? "リアクション 2件を表示" : "リアクションを隠す",
        });
        const expectNoHorizontalOverflow = async () => {
            const dimensions = await targetPreview.evaluate((element) => ({
                clientWidth: element.clientWidth,
                scrollWidth: element.scrollWidth,
            }));
            expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
        };

        await page.getByLabel("イベントID").fill(harness.inputs.kind1);
        await expect(reactionButton("表示")).toBeVisible();
        await expect(page.getByRole("button", { name: "リプライ" })).toBeVisible();
        await expect(page.getByRole("button", { name: "引用" })).toBeVisible();
        await expectNoHorizontalOverflow();
        const widthBeforeExpand = await targetPreview.evaluate((element) => element.clientWidth);
        expect(emojiRequests).toBe(0);

        await reactionButton("表示").click();
        const details = page.locator(".post-preview-reactions-panel");
        await expect(details).toBeVisible();
        await expect(details.locator(".post-preview-reaction-chip")).toHaveCount(2);
        await expect(details.locator(".post-preview-reaction-symbol")).toBeVisible();
        await expect(details.getByRole("img", { name: ":party:" })).toBeVisible();
        await expect(details.locator(".post-preview-reaction-actor")).toHaveCount(2);
        await expect(reactionButton("隠す")).toBeVisible();
        await expectNoHorizontalOverflow();
        expect(await targetPreview.evaluate((element) => element.clientWidth)).toBe(widthBeforeExpand);
        expect(emojiRequests).toBeGreaterThan(0);

        // Switching target clears the previous target's expanded detail state.
        await page.getByLabel("イベントID").fill(harness.inputs.kind42);
        await expect(reactionButton("表示")).toBeVisible();
        await expect(reactionButton("隠す")).toHaveCount(0);
        await expect(page.locator(".post-preview-reactions-panel")).toHaveCount(0);
        await expectNoHorizontalOverflow();
        await reactionButton("表示").click();
        await expect(details).toBeVisible();
        await expect(details.locator(".post-preview-reaction-chip")).toHaveCount(2);
        await expect(details.locator(".post-preview-reaction-symbol")).toBeVisible();
        await expect(details.getByRole("img", { name: ":party:" })).toBeVisible();
        await expect(details.locator(".post-preview-reaction-actor")).toHaveCount(2);
        await expect(page.getByRole("button", { name: "リプライ" })).toBeVisible();
        await expect(page.getByRole("button", { name: "引用" })).toBeVisible();
        await expectNoHorizontalOverflow();

        await reactionButton("隠す").click();
        await expect(page.locator(".post-preview-reactions-panel")).toHaveCount(0);
    });

    test("standalone uses the shared Base button surface and effective Accent border", async ({ page }) => {
        await gotoHarness(page);
        await page.evaluate(() => {
            document.documentElement.style.setProperty("--accent-color-user", "#123456");
            document.documentElement.style.setProperty("--base-color-user", "#234567");
        });

        const result = await page.evaluate(() => {
            const headerButton = document.querySelector<HTMLButtonElement>(".header-actions button")!;
            const colorToPixel = (color: string) => {
                const canvas = document.createElement("canvas");
                canvas.width = 1;
                canvas.height = 1;
                const context = canvas.getContext("2d")!;
                context.fillStyle = color;
                context.fillRect(0, 0, 1, 1);
                return Array.from(context.getImageData(0, 0, 1, 1).data);
            };
            return {
                headerBorder: getComputedStyle(headerButton).borderTopColor,
                headerBackground: getComputedStyle(headerButton).backgroundColor,
                buttonPixel: colorToPixel(getComputedStyle(headerButton).backgroundColor),
            };
        });

        expect(result.headerBorder).toBe("rgb(18, 52, 86)");
        expect(result.buttonPixel).toEqual([202, 210, 219, 255]);
    });

    test("ヘッダー最右からkind 1/40/42の全5操作を適用できる", async ({ page }) => {
        const harness = await gotoHarness(page);
        const headerButtons = page.locator(".header-actions button");
        await expect(headerButtons.last()).toHaveAttribute("aria-label", "宛先を指定");

        const cases = [
            [harness.inputs.kind1, "リプライ"],
            [harness.inputs.kind1, "引用"],
            [harness.inputs.kind40, "投稿する"],
            [harness.inputs.kind42, "リプライ"],
            [harness.inputs.kind42, "引用"],
        ] as const;
        for (const [input, action] of cases) {
            await openDialog(page);
            await choose(page, input, action);
        }

        await expect(page.getByLabel("適用結果")).toHaveText(
            "1:reply,1:quote,40:channel,42:reply,42:quote",
        );
    });

    test("Sensitive Structureのreply/quoteはStructure IDを使い、kind 36 payloadはtargetにしない", async ({ page }) => {
        const harness = await gotoHarness(page);
        for (const action of ["リプライ", "引用"] as const) {
            await openDialog(page);
            await page.getByLabel("イベントID").fill(harness.inputs.sensitive);
            await expect(page.getByRole("button", { name: action })).toBeVisible();
            await expect(page.locator(".content-warning-prompt")).toBeVisible();
            await page.getByRole("button", { name: action }).click();
            await expect(page.getByRole("dialog")).toBeHidden();
            const lastApplication = await page.evaluate(() =>
                (window as any).__COMPOSER_TARGET_HARNESS__.applications.at(-1),
            );
            expect(lastApplication).toEqual({
                action: action === "リプライ" ? "reply" : "quote",
                kind: 1,
                eventId: "d".repeat(64),
            });
        }

        await openDialog(page);
        await page.getByLabel("イベントID").fill(harness.inputs.sensitivePayload);
        await expect(page.getByText("この種類のイベントはまだ宛先に指定できません")).toBeVisible();
        await expect(page.getByRole("button", { name: "リプライ" })).toBeHidden();
        await expect(page.getByRole("button", { name: "引用" })).toBeHidden();
        await expect(page.getByLabel("適用結果")).toHaveText("1:reply,1:quote");
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

        const initialResolverCount = await page.evaluate(() =>
            (window as HarnessWindow).__COMPOSER_TARGET_HARNESS__!.resolverEventIds.length,
        );
        await input.fill(harness.inputs.stale);
        await expect.poll(() => page.evaluate(() =>
            (window as HarnessWindow).__COMPOSER_TARGET_HARNESS__!.resolverEventIds.length,
        )).toBe(initialResolverCount + 1);
        const staleEventId = await page.evaluate(() =>
            (window as HarnessWindow).__COMPOSER_TARGET_HARNESS__!.resolverEventIds.at(-1),
        );
        await input.fill(harness.inputs.kind40);
        const publishButton = page.getByRole("button", { name: "投稿する" });
        await expect(publishButton).toBeVisible();
        await expect.poll(() => page.evaluate(() =>
            (window as HarnessWindow).__COMPOSER_TARGET_HARNESS__!.cancelledResolverEventIds,
        )).toContain(staleEventId);
        await page.evaluate(() =>
            (window as HarnessWindow).__COMPOSER_TARGET_HARNESS__!.releaseStaleResolver(),
        );
        await expect(publishButton).toBeVisible();
        await expect(page.getByRole("button", { name: "リプライ" })).toBeHidden();
    });

    test("フッターメニューからJSON子ダイアログを開閉して親を維持する", async ({
        page,
    }) => {
        const harness = await gotoHarness(page);
        await openDialog(page);
        await page.getByLabel("イベントID").fill(harness.inputs.kind1);

        await expect(page.locator(".post-preview-date")).not.toBeEmpty();
        await expect(page.getByRole("button", { name: "リプライ" })).toBeVisible();
        await expect(page.getByRole("button", { name: "引用" })).toBeVisible();
        await page.getByRole("button", { name: "アクションを表示" }).click();
        await expect(page.getByRole("menuitem", { name: "イベントJSONを表示" }))
            .toBeVisible();
        await expect(page.getByRole("menuitem", { name: /コピー/ })).toHaveCount(0);
        await page.getByRole("menuitem", { name: "イベントJSONを表示" }).click();

        const rawJsonDialog = page.getByRole("dialog", { name: "イベントJSON" });
        await expect(rawJsonDialog).toBeVisible();
        await expect(rawJsonDialog).toContainText('"kind": 1');
        await expect(page.getByRole("dialog", { name: "宛先を指定" })).toBeVisible();
        await rawJsonDialog.getByRole("button", { name: "閉じる" }).click();
        await expect(rawJsonDialog).toBeHidden();
        await expect(page.getByRole("dialog", { name: "宛先を指定" })).toBeVisible();
    });

    test("宛先指定フッターの各操作とメニューにツールチップを表示する", async ({
        page,
    }) => {
        const harness = await gotoHarness(page);
        await openDialog(page);
        await page.getByLabel("イベントID").fill(harness.inputs.kind1);

        await expectTooltip(page, page.getByRole("button", { name: "リプライ" }), "リプライ");
        await expectTooltip(page, page.getByRole("button", { name: "引用" }), "引用");
        const menu = page.getByRole("button", { name: "アクションを表示" });
        await menu.focus();
        await expect(page.locator('.tooltip-content:visible').filter({ hasText: "アクションを表示" })).toHaveText("アクションを表示");
        await expect(menu).not.toHaveAttribute("title");
        await menu.click();
        await expect(page.getByRole("menuitem", { name: "イベントJSONを表示" })).toBeVisible();
        await expect(page.locator('.tooltip-content:visible')).toHaveCount(0);

        await page.getByRole("menuitem", { name: "イベントJSONを表示" }).press("Escape");
        await page.getByLabel("イベントID").fill(harness.inputs.kind40);
        await expectTooltip(page, page.getByRole("button", { name: "投稿する" }), "投稿する");
    });

    test("英語ロケールのアクションメニューはShow actionsになる", async ({ page }) => {
        await page.addInitScript(() => localStorage.setItem("locale", "en"));
        const harness = await gotoHarness(page);
        await openDialog(page, "en");
        await page.getByLabel("Event ID").fill(harness.inputs.kind1);
        const menu = page.getByRole("button", { name: "Show actions" });
        await expect(menu).toHaveAttribute("aria-label", "Show actions");
        await expectTooltip(page, menu, "Show actions");
    });

    test("desktopと代表mobile幅で投稿履歴型のフッター配置とsurfaceを維持する", async ({
        page,
    }, testInfo) => {
        const harness = await gotoHarness(page);
        const width = testInfo.project.name === "desktop-chromium" ? 900 : 320;
        if (testInfo.project.name === "desktop-chromium") {
            await page.evaluate(() => {
                document.documentElement.classList.add("light");
            });
        }
        await page.setViewportSize({ width, height: 720 });
        await openDialog(page);
        for (const input of [harness.inputs.kind1, harness.inputs.kind42]) {
            await page.getByLabel("イベントID").fill(input);
            await expect(page.getByRole("button", { name: "リプライ" }))
                .toBeVisible();

            const geometry = await page.locator(".target-preview").evaluate((card) => {
                const footer = card.querySelector<HTMLElement>(".post-preview-footer")!;
                const date = card.querySelector<HTMLElement>(".post-preview-date")!;
                const actions = footer.querySelector<HTMLElement>(
                    ":scope > .post-preview-footer-actions",
                )!;
                const replyGroup = actions.querySelector<HTMLElement>(
                    ":scope > .post-preview-action-buttons-group",
                )!;
                const replyCell = replyGroup.querySelector<HTMLElement>(
                    ":scope > .post-preview-reply-action-cell",
                )!;
                const quoteCell = replyGroup.querySelector<HTMLElement>(
                    ":scope > .post-preview-quote-action-cell",
                )!;
                const reactionCell = replyGroup.querySelector<HTMLElement>(
                    ":scope > .post-preview-reaction-action-cell",
                )!;
                const reply = replyCell.querySelector<HTMLElement>(
                    "button[aria-label='リプライ']",
                )!;
                const repliesSlot = replyCell.querySelector<HTMLElement>(
                    ".post-preview-footer-replies-slot",
                )!;
                const quote = quoteCell.querySelector<HTMLElement>(
                    "button[aria-label='引用']",
                )!;
                const reaction = reactionCell.querySelector<HTMLElement>(
                    ".reaction-compose-button",
                )!;
                const reactionSlot = reactionCell.querySelector<HTMLElement>(
                    ".post-preview-footer-reaction-slot",
                )!;
                const menu = card.querySelector<HTMLElement>(
                    ".post-history-menu-trigger",
                )!;
                const dialog = card.closest<HTMLElement>("[role='dialog']")!;
                const toRect = (element: Element) => {
                    const rect = element.getBoundingClientRect();
                    return {
                        left: rect.left,
                        right: rect.right,
                        width: rect.width,
                        height: rect.height,
                        top: rect.top,
                        bottom: rect.bottom,
                    };
                };
                return {
                    card: toRect(card),
                    footer: toRect(footer),
                    date: toRect(date),
                    actions: toRect(actions),
                    reply: toRect(reply),
                    quote: toRect(quote),
                    reaction: toRect(reaction),
                    replyCell: toRect(replyCell),
                    quoteCell: toRect(quoteCell),
                    reactionCell: toRect(reactionCell),
                    repliesSlot: toRect(repliesSlot),
                    reactionSlot: toRect(reactionSlot),
                    menu: toRect(menu),
                    dialog: toRect(dialog),
                    structure: {
                        directCellCount: replyGroup.querySelectorAll(
                            ":scope > .post-preview-action-cell",
                        ).length,
                        cellsInExpectedOrder: replyGroup.children[0] === replyCell
                            && replyGroup.children[1] === quoteCell
                            && replyGroup.children[2] === reactionCell,
                        replyGroupContainsQuote: replyGroup.contains(quote),
                        repliesSlotIsEmpty: repliesSlot.childElementCount === 0,
                        reactionSlotIsEmpty: reactionSlot.childElementCount === 0,
                        reactionActionCount: reactionCell.querySelectorAll(
                            ".reaction-compose-button",
                        ).length,
                    },
                    backgrounds: {
                        card: getComputedStyle(card).backgroundColor,
                        reply: getComputedStyle(reply).backgroundColor,
                        quote: getComputedStyle(quote).backgroundColor,
                        menu: getComputedStyle(menu).backgroundColor,
                    },
                    viewportWidth: window.innerWidth,
                    viewportHeight: window.innerHeight,
                    horizontalOverflow:
                        document.documentElement.scrollWidth -
                        document.documentElement.clientWidth,
                    previewOverflow: card.scrollWidth - card.clientWidth,
                };
            });

            expect(geometry.structure.directCellCount).toBe(3);
            expect(geometry.structure.cellsInExpectedOrder).toBe(true);
            expect(geometry.structure.replyGroupContainsQuote).toBe(true);
            expect(geometry.structure.repliesSlotIsEmpty).toBe(true);
            expect(geometry.structure.reactionSlotIsEmpty).toBe(true);
            expect(geometry.structure.reactionActionCount).toBe(1);
            expect(geometry.footer.left).toBeGreaterThanOrEqual(geometry.card.left);
            expect(geometry.footer.right).toBeLessThanOrEqual(geometry.card.right);
            expect(geometry.footer.bottom - geometry.footer.top).toBe(36);
            expect(geometry.horizontalOverflow).toBeLessThanOrEqual(0);
            expect(geometry.previewOverflow).toBeLessThanOrEqual(1);
            expect(geometry.date.right).toBeLessThanOrEqual(geometry.actions.left);
            expect(geometry.actions.right).toBeLessThanOrEqual(geometry.menu.left);
            for (const button of [geometry.reply, geometry.quote, geometry.reaction]) {
                expect(button.width).toBeGreaterThanOrEqual(35);
                expect(button.width).toBeLessThanOrEqual(37);
                expect(button.height).toBeGreaterThanOrEqual(35);
                expect(button.height).toBeLessThanOrEqual(37);
                expect(button.left).toBeGreaterThanOrEqual(geometry.footer.left);
                expect(button.right).toBeLessThanOrEqual(geometry.footer.right);
                expect(button.top).toBeGreaterThanOrEqual(geometry.footer.top);
                expect(button.bottom).toBeLessThanOrEqual(geometry.footer.bottom);
            }
            expect(geometry.reply.left).toBeLessThan(geometry.quote.left);
            expect(geometry.replyCell.left).toBeLessThan(geometry.quoteCell.left);
            expect(geometry.quoteCell.left).toBeLessThan(geometry.reactionCell.left);
            expect(geometry.reply.right).toBeLessThanOrEqual(geometry.quote.left);
            expect(geometry.quote.right).toBeLessThanOrEqual(geometry.reactionCell.right);
            expect(geometry.quote.right).toBeLessThanOrEqual(geometry.reaction.left);
            expect(geometry.reaction.right).toBeLessThanOrEqual(geometry.reactionCell.right);
            expect(geometry.actions.left).toBeGreaterThanOrEqual(0);
            expect(geometry.menu.right).toBeLessThanOrEqual(geometry.viewportWidth);
            expect(geometry.dialog.top).toBeGreaterThanOrEqual(0);
            expect(geometry.dialog.bottom).toBeLessThanOrEqual(
                geometry.viewportHeight,
            );
            expect(geometry.backgrounds.reply).toBe(geometry.backgrounds.card);
            expect(geometry.backgrounds.quote).toBe(geometry.backgrounds.card);
            expect(geometry.backgrounds.menu).toBe(geometry.backgrounds.card);

            await page.screenshot({
                path: testInfo.outputPath(
                    `composer-target-footer-${testInfo.project.name}-${input === harness.inputs.kind1 ? "kind1" : "kind42"}.png`,
                ),
                fullPage: false,
            });
        }

        if (testInfo.project.name === "desktop-chromium") {
            await page.setViewportSize({ width: 320, height: 720 });
            for (const input of [harness.inputs.kind1, harness.inputs.kind42]) {
                await page.getByLabel("イベントID").fill(input);
                const previewOverflow = await page.locator(".target-preview").evaluate(
                    (preview) => preview.scrollWidth - preview.clientWidth,
                );
                expect(previewOverflow).toBeLessThanOrEqual(1);
            }
        }

        await page.getByLabel("イベントID").fill(harness.inputs.kind40);
        const channelButton = page.getByRole("button", { name: "投稿する" });
        await expect(channelButton).toBeVisible();
        const channelGeometry = await page.locator(".target-preview").evaluate((card) => {
            const footer = card.querySelector<HTMLElement>(".post-preview-footer")!;
            const actions = footer.querySelector<HTMLElement>(
                ":scope > .post-preview-footer-actions",
            )!;
            const button = actions.querySelector<HTMLElement>(
                "button[aria-label='投稿する']",
            )!;
            const toRect = (element: Element) => {
                const rect = element.getBoundingClientRect();
                return { left: rect.left, width: rect.width };
            };
            return {
                actions: toRect(actions),
                button: toRect(button),
                background: getComputedStyle(button).backgroundColor,
                cardBackground: getComputedStyle(card).backgroundColor,
            };
        });
        expect(
            Math.abs(
                channelGeometry.button.left + channelGeometry.button.width / 2
                    - (channelGeometry.actions.left + channelGeometry.actions.width / 2),
            ),
        ).toBeLessThanOrEqual(1);
        expect(channelGeometry.background).toBe(channelGeometry.cardBackground);

        if (testInfo.project.name === "desktop-chromium") {
            const normalBackground = await channelButton.evaluate(
                (button) => getComputedStyle(button).backgroundColor,
            );
            await channelButton.hover();
            await expect.poll(() => channelButton.evaluate(
                (button) => getComputedStyle(button).backgroundColor,
            )).not.toBe(normalBackground);
        }
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

        const toggleRow = page.locator(".post-preview-toggle-row");
        const assertToggleRemainsBetweenTextAndMedia = async () => {
            const placement = await toggleRow.evaluate((element) => ({
                position: getComputedStyle(element).position,
                previousClass: element.previousElementSibling?.className ?? "",
                nextClass: element.nextElementSibling?.className ?? "",
                bottom: element.getBoundingClientRect().bottom,
                mediaTop: element.nextElementSibling?.getBoundingClientRect().top ?? 0,
            }));
            expect(placement.position).toBe("static");
            expect(placement.previousClass).toContain("post-preview-content");
            expect(placement.nextClass).toContain("post-preview-media");
            expect(placement.bottom).toBeLessThanOrEqual(placement.mediaTop + 1);
        };
        const expandButton = page.getByRole("button", { name: "もっと見る" });
        await expect(expandButton).toBeVisible();
        await assertToggleRemainsBetweenTextAndMedia();
        const overflow = await page.locator(".target-preview").evaluate(
            (element) => element.scrollWidth - element.clientWidth,
        );
        expect(overflow).toBeLessThanOrEqual(1);
        await expandButton.click();
        const collapseButton = page.getByRole("button", { name: "折りたたむ" });
        await expect(collapseButton).toHaveAttribute("aria-expanded", "true");
        await assertToggleRemainsBetweenTextAndMedia();
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

        // Images become actionable in fetch-completion order. Keep the same
        // opener even when an earlier image finishes loading after this one.
        const firstImage = page.getByRole("button", { name: "開く preview-media-1.jpg", exact: true });
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
        const toggleRow = page.locator(".post-preview-toggle-row");
        const readTogglePlacement = () => toggleRow.evaluate((element) => ({
            position: getComputedStyle(element).position,
            rowTop: element.getBoundingClientRect().top,
            textBottom: element.parentElement
                ?.querySelector(".event-content")
                ?.getBoundingClientRect().bottom ?? 0,
        }));
        const collapsedPlacement = await readTogglePlacement();
        expect(collapsedPlacement.position).toBe("static");
        expect(collapsedPlacement.rowTop).toBeGreaterThanOrEqual(collapsedPlacement.textBottom - 1);
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
        const expandedPlacement = await readTogglePlacement();
        expect(expandedPlacement.position).toBe("static");
        expect(expandedPlacement.rowTop).toBeGreaterThanOrEqual(expandedPlacement.textBottom - 1);
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
