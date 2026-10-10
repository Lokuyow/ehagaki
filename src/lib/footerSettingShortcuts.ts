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
    { id: "fail-closed-content-warning", labelKey: "settingsDialog.fail_closed_content_warning_shortcut_label", icon: "content-warning" },
] as const;

export type FooterSettingShortcutId = (typeof FOOTER_SETTING_SHORTCUTS)[number]["id"];

export interface FooterSettingShortcutSlots {
    left: FooterSettingShortcutId | null;
    right: FooterSettingShortcutId | null;
}

export const EMPTY_FOOTER_SETTING_SHORTCUTS: FooterSettingShortcutSlots = {
    left: null,
    right: null,
};

const knownShortcutIds = new Set<string>(
    FOOTER_SETTING_SHORTCUTS.map(({ id }) => id),
);

function normalizeId(value: unknown): FooterSettingShortcutId | null {
    return typeof value === "string" && knownShortcutIds.has(value)
        ? value as FooterSettingShortcutId
        : null;
}

export function normalizeFooterSettingShortcuts(value: unknown): FooterSettingShortcutSlots {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return { ...EMPTY_FOOTER_SETTING_SHORTCUTS };
    }

    const slots = value as Record<string, unknown>;
    const left = normalizeId(slots.left);
    let right = normalizeId(slots.right);
    if (left !== null && left === right) right = null;
    return { left, right };
}

export function parseFooterSettingShortcuts(raw: string | null): FooterSettingShortcutSlots {
    if (raw === null) return { ...EMPTY_FOOTER_SETTING_SHORTCUTS };
    try {
        return normalizeFooterSettingShortcuts(JSON.parse(raw));
    } catch {
        return { ...EMPTY_FOOTER_SETTING_SHORTCUTS };
    }
}
