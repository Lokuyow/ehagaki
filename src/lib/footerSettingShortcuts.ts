export const FOOTER_SETTING_SHORTCUTS = [
    { id: "language", labelKey: "settingsDialog.language", icon: "language" },
    { id: "image-quality", labelKey: "settingsDialog.image_quality_setting", icon: "image" },
    { id: "video-quality", labelKey: "settingsDialog.video_quality_setting", icon: "video" },
    { id: "theme-mode", labelKey: "settingsDialog.theme_mode", icon: "theme" },
    { id: "media-free-placement", labelKey: "settingsDialog.media_bottom_mode", icon: "media" },
    { id: "hide-mascot", labelKey: "settingsDialog.hide_mascot_label", icon: "mascot" },
    { id: "hide-flavor-text", labelKey: "settingsDialog.hide_flavor_text_label", icon: "flavor" },
    { id: "quote-notification", labelKey: "settingsDialog.quote_notification_label", icon: "quote" },
    { id: "reply-notification", labelKey: "settingsDialog.reply_notification_label", icon: "reply" },
    { id: "client-tag", labelKey: "settingsDialog.client_tag_label", icon: "client-tag" },
] as const;

export type FooterSettingShortcutId = (typeof FOOTER_SETTING_SHORTCUTS)[number]["id"];

const shortcutOrder = new Map<string, number>(
    FOOTER_SETTING_SHORTCUTS.map(({ id }, index) => [id, index]),
);

export function normalizeFooterSettingShortcuts(value: unknown): FooterSettingShortcutId[] {
    if (!Array.isArray(value)) return [];

    const selected = new Set<string>();
    for (const id of value) {
        if (typeof id === "string" && shortcutOrder.has(id)) selected.add(id);
    }

    return [...selected]
        .sort((left, right) => shortcutOrder.get(left)! - shortcutOrder.get(right)!)
        .slice(0, 2) as FooterSettingShortcutId[];
}

export function parseFooterSettingShortcuts(raw: string | null): FooterSettingShortcutId[] {
    if (raw === null) return [];
    try {
        return normalizeFooterSettingShortcuts(JSON.parse(raw));
    } catch {
        return [];
    }
}
