import { expect, type Page, type TestInfo } from "@playwright/test";
import { finalizeEvent, generateSecretKey, getPublicKey, type EventTemplate } from "nostr-tools";

export async function checkNostrBuildMediaHelp(page: Page, testInfo: TestInfo, lang: "ja" | "en", embedded: boolean) {
    const fixtureKey = generateSecretKey(), owner = getPublicKey(fixtureKey);
    const endpoint = "https://nostr.build/api/v2/nip96/upload";
    let listingSupported = false, listRequests = 0;
    await page.exposeFunction("fixtureSignMediaRegistrationEvent", (event: EventTemplate) => finalizeEvent(event, fixtureKey));
    await page.route("**/.well-known/nostr/nip96.json", route => route.fulfill({ json: {
        api_url: new URL(route.request().url()).hostname === "nostr.build" ? endpoint : "https://yabu.me/api/v2/media",
    } }));
    await page.route(`${endpoint}?*`, async route => {
        listRequests++;
        await route.fulfill(listingSupported
            ? { json: { page: 0, count: 24, total: 0, files: [] } }
            : { status: 405, json: { status: "error", message: "Method not allowed" } });
    });
    await page.route("https://yabu.me/api/v2/media?*", route => route.fulfill({ status: 503, json: {} }));
    // Keep official-link verification local, including a popup's initial navigation.
    await page.context().route(/^https:\/\/(?:account\.nostr\.build\/|nostr\.build\/delete\/)/,
        route => route.fulfill({ contentType: "text/html", body: "<!doctype html><title>Official link fixture</title>" }));
    await page.setViewportSize({ width: 360, height: 850 });
    await page.goto(`post-history-dialog-playwright.html?${embedded ? "media-registration-host" : "media-registration"}=1&media-host-width=320&owner=${owner}&server=nostr-build&lang=${lang}`);
    const surface = embedded ? page.frameLocator("iframe") : page;
    const dialog = surface.getByRole("dialog", { name: lang === "ja" ? "履歴" : "History", exact: true });
    const help = dialog.locator(".nostr-build-help");
    const explanation = lang === "ja"
        ? "nostr.buildはNIP-96での一覧取得に対応していません。メディアの管理・削除は公式ページをご利用ください。"
        : "nostr.build does not support listing media through NIP-96. Use the official pages to manage or delete your media.";
    await expect(help).toContainText(explanation);
    await expect(surface.locator(".floating-message[role=alert]")).toHaveCount(0);
    expect(await dialog.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
    expect(await help.evaluate(node => {
        const bounds = node.getBoundingClientRect();
        return node.scrollWidth <= node.clientWidth && bounds.left >= 0 && bounds.right <= window.innerWidth;
    })).toBe(true);
    const refresh = dialog.getByRole("button", { name: lang === "ja" ? "一覧を更新" : "Refresh list", exact: true });
    const account = help.getByRole("link", { name: lang === "ja" ? "アカウント管理（公式）" : "Account management (official)", exact: true });
    const deleteFree = help.getByRole("link", { name: lang === "ja" ? "無料アップロードの削除（公式）" : "Delete free uploads (official)", exact: true });
    await refresh.focus();
    await page.keyboard.press("Tab");
    await expect(account).toBeFocused();
    for (const [link, url] of [[account, "https://account.nostr.build/"], [deleteFree, "https://nostr.build/delete/"]] as const) {
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAttribute("rel", "noopener noreferrer");
        expect(await link.evaluate(node => {
            const bounds = node.getBoundingClientRect();
            return bounds.left >= 0 && bounds.right <= window.innerWidth && bounds.height >= 44;
        })).toBe(true);
        const popupPromise = page.waitForEvent("popup");
        if (link === account) await page.keyboard.press("Enter");
        else await link.click();
        const popup = await popupPromise;
        await expect(popup).toHaveURL(url);
        await popup.close();
    }
    await account.focus();
    await page.keyboard.press("Tab");
    await expect(deleteFree).toBeFocused();
    await page.screenshot({ path: testInfo.outputPath(`nostr-build-${lang}-${embedded ? "iframe320" : "standalone360"}.png`) });
    const attempts = listRequests;
    await refresh.click();
    await expect.poll(() => listRequests).toBe(attempts + 1);
    await expect(help).toBeVisible();
    const select = dialog.getByRole("combobox");
    const originalId = await select.inputValue();
    const otherId = await select.locator("option").evaluateAll((nodes, selected) =>
        (nodes as HTMLOptionElement[]).find(node => node.value !== selected)!.value, originalId);
    await select.selectOption(otherId);
    await expect(help).toHaveCount(0);
    await expect(surface.getByRole("alert")).toContainText(lang === "ja" ? "サーバーで処理に失敗しました。" : "The server could not complete the request.");
    await select.selectOption(originalId);
    await expect(help).toBeVisible();
    listingSupported = true;
    await refresh.click();
    await expect(help).toHaveCount(0);
    await expect(dialog.getByText(lang === "ja" ? "画像・動画がありません。" : "No images or videos.", { exact: true })).toBeVisible();
    await expect(surface.getByRole("alert")).toHaveCount(0);
}
