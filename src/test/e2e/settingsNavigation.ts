import type { FrameLocator, Page } from "@playwright/test";

export const SETTINGS_CATEGORY_LABELS = {
    display: { ja: "表示", en: "Display" },
    post: { ja: "投稿", en: "Posting" },
    media: { ja: "メディア", en: "Media" },
    nostr: { ja: "Nostr", en: "Nostr" },
    about: { ja: "情報", en: "About" },
} as const;

export type SettingsCategoryId = keyof typeof SETTINGS_CATEGORY_LABELS;

type SettingsRoot = Page | FrameLocator;

export function settingsCategoryLabel(
    categoryId: SettingsCategoryId,
    locale: "ja" | "en" = "ja",
): string {
    return SETTINGS_CATEGORY_LABELS[categoryId][locale];
}

export async function openSettingsCategory(
    root: SettingsRoot,
    categoryId: SettingsCategoryId,
    locale: "ja" | "en" = "ja",
): Promise<void> {
    const name = settingsCategoryLabel(categoryId, locale);
    await root
        .getByRole("dialog")
        .getByRole("button", { name, exact: true })
        .evaluate((button) => (button as HTMLButtonElement).click());
}

export async function openSettingsToCategory(
    root: SettingsRoot,
    categoryId: SettingsCategoryId,
    locale: "ja" | "en" = "ja",
): Promise<void> {
    await root
        .locator("button.settings-btn")
        .evaluate((button) => (button as HTMLButtonElement).click());
    await root.getByRole("dialog").waitFor({ state: "visible" });
    await openSettingsCategory(root, categoryId, locale);
}

/** Open the display category inside a Web Component shadow root (settings already open). */
export function clickSettingsDisplayCategoryInShadowRoot(shadowRoot: ShadowRoot): void {
    const button = shadowRoot.querySelector<HTMLButtonElement>(
        ".settings-category-list .settings-category-button",
    );
    if (!button) {
        throw new Error("settings display category button not found");
    }
    button.click();
}
