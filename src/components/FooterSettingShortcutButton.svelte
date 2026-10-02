<script lang="ts">
    import { _ } from "svelte-i18n";
    import Button from "./Button.svelte";
    import FooterSettingShortcutIcon from "./FooterSettingShortcutIcon.svelte";
    import { getCompressionLevels } from "../lib/constants";
    import {
        FOOTER_SETTING_SHORTCUTS,
        type FooterSettingShortcutId,
    } from "../lib/footerSettingShortcuts";
    import { settingsStore } from "../stores/settingsStore.svelte";
    import { themeModeStore } from "../stores/themeStore.svelte";

    interface Props {
        shortcutId: FooterSettingShortcutId;
    }

    let { shortcutId }: Props = $props();
    let label = $derived(
        $_(FOOTER_SETTING_SHORTCUTS.find((item) => item.id === shortcutId)!.labelKey) ?? shortcutId,
    );
    let isBooleanShortcut = $derived(
        shortcutId !== "language" &&
            shortcutId !== "image-quality" &&
            shortcutId !== "video-quality" &&
            shortcutId !== "theme-mode",
    );
    let active = $derived(getActiveState());
    let disabled = $derived(
        shortcutId === "hide-flavor-text" && !settingsStore.showMascot,
    );
    let currentValueLabel = $derived(getCurrentValueLabel());
    let compactQualityLabel = $derived(getCompactQualityLabel());
    let accessibleName = $derived(
        isBooleanShortcut ? label : `${label}: ${currentValueLabel}`,
    );
    let feedbackMessage = $derived(
        isBooleanShortcut ? currentValueLabel : `${label}: ${currentValueLabel}`,
    );

    function getCurrentValueLabel(): string {
        switch (shortcutId) {
            case "language":
                return settingsStore.locale === "ja"
                    ? $_("settingsDialog.footer_shortcut_japanese")!
                    : $_("settingsDialog.footer_shortcut_english")!;
            case "image-quality":
                return getCompressionLevels($_).find(
                    (level) => level.value === settingsStore.imageQualityLevel,
                )?.label ?? "";
            case "video-quality":
                return getCompressionLevels($_).find(
                    (level) => level.value === settingsStore.videoQualityLevel,
                )?.label ?? "";
            case "theme-mode":
                return $_(`settingsDialog.theme_${themeModeStore.value}`) ?? "";
            case "media-free-placement":
                return $_(settingsStore.mediaFreePlacement ? "settingsDialog.footer_shortcut_media_free" : "settingsDialog.footer_shortcut_media_fixed") ?? "";
            case "hide-mascot":
                return $_(settingsStore.showMascot ? "settingsDialog.footer_shortcut_mascot_show" : "settingsDialog.footer_shortcut_mascot_hide") ?? "";
            case "hide-flavor-text":
                return $_(!settingsStore.showMascot || !settingsStore.showFlavorText ? "settingsDialog.footer_shortcut_flavor_hide" : "settingsDialog.footer_shortcut_flavor_show") ?? "";
            case "quote-notification":
                return $_(settingsStore.quoteNotificationEnabled ? "settingsDialog.footer_shortcut_quote_notify" : "settingsDialog.footer_shortcut_quote_silent") ?? "";
            case "reply-notification":
                return $_(settingsStore.replyNotificationEnabled ? "settingsDialog.footer_shortcut_reply_notify_others" : "settingsDialog.footer_shortcut_reply_notify_only_target") ?? "";
            case "client-tag":
                return $_(settingsStore.clientTagEnabled ? "settingsDialog.footer_shortcut_client_tag_add" : "settingsDialog.footer_shortcut_client_tag_skip") ?? "";
        }
    }

    function getActiveState(): boolean {
        switch (shortcutId) {
            case "language":
            case "image-quality":
            case "video-quality":
            case "theme-mode":
                return false;
            case "media-free-placement":
                return settingsStore.mediaFreePlacement;
            case "hide-mascot":
                return !settingsStore.showMascot;
            case "hide-flavor-text":
                return !settingsStore.showMascot || !settingsStore.showFlavorText;
            case "quote-notification":
                return settingsStore.quoteNotificationEnabled;
            case "reply-notification":
                return settingsStore.replyNotificationEnabled;
            case "client-tag":
                return settingsStore.clientTagEnabled;
        }
    }

    function handleClick(): void {
        switch (shortcutId) {
            case "language":
                settingsStore.locale = settingsStore.locale === "ja" ? "en" : "ja";
                break;
            case "image-quality":
                settingsStore.imageQualityLevel = getNextQuality(settingsStore.imageQualityLevel);
                break;
            case "video-quality":
                settingsStore.videoQualityLevel = getNextQuality(settingsStore.videoQualityLevel);
                break;
            case "theme-mode":
                themeModeStore.set(
                    themeModeStore.value === "system"
                        ? "light"
                        : themeModeStore.value === "light"
                          ? "dark"
                          : "system",
                );
                break;
            case "media-free-placement":
                settingsStore.mediaFreePlacement = !settingsStore.mediaFreePlacement;
                break;
            case "hide-mascot":
                settingsStore.showMascot = !settingsStore.showMascot;
                break;
            case "hide-flavor-text":
                if (settingsStore.showMascot) {
                    settingsStore.showFlavorText = !settingsStore.showFlavorText;
                }
                break;
            case "quote-notification":
                settingsStore.quoteNotificationEnabled = !settingsStore.quoteNotificationEnabled;
                break;
            case "reply-notification":
                settingsStore.replyNotificationEnabled = !settingsStore.replyNotificationEnabled;
                break;
            case "client-tag":
                settingsStore.clientTagEnabled = !settingsStore.clientTagEnabled;
                break;
        }
    }

    function getNextQuality(current: string): string {
        const cycle = ["none", "high", "medium", "low"];
        const index = cycle.indexOf(current);
        return cycle[(index + 1 + cycle.length) % cycle.length];
    }

    function getCompactQualityLabel(): string {
        const quality = shortcutId === "image-quality"
            ? settingsStore.imageQualityLevel
            : settingsStore.videoQualityLevel;
        const labels: Record<string, { ja: string; en: string }> = {
            none: { ja: "原", en: "O" },
            high: { ja: "高", en: "H" },
            medium: { ja: "中", en: "M" },
            low: { ja: "低", en: "L" },
        };
        return labels[quality]?.[settingsStore.locale === "ja" ? "ja" : "en"] ?? "";
    }
</script>

<Button
    className="footer-setting-shortcut-button {shortcutId === 'image-quality' || shortcutId === 'video-quality' ? 'quality-shortcut' : shortcutId === 'quote-notification' || shortcutId === 'reply-notification' ? 'pair-shortcut' : ''}"
    variant="default"
    shape="circle"
    contentLayout="icon"
    ariaLabel={accessibleName}
    aria-pressed={isBooleanShortcut ? active : undefined}
    disabled={disabled}
    floatingMessage={feedbackMessage}
    floatingMessageVariant="container-top-right"
    onClick={handleClick}
>
    {#if shortcutId === "image-quality" || shortcutId === "video-quality"}
        <span class="quality-shortcut-content" aria-hidden="true">
            <FooterSettingShortcutIcon {shortcutId} />
            <span class="quality-shortcut-label">{compactQualityLabel}</span>
        </span>
    {:else}
        <FooterSettingShortcutIcon {shortcutId} active={active} stateValue={shortcutId === "theme-mode" ? themeModeStore.value : undefined} />
    {/if}
</Button>

<style>
    :global(button.footer-setting-shortcut-button) {
        width: 50px;
        height: 50px;
        min-width: 44px;
        min-height: 44px;
        flex: 0 0 50px;
        padding: 0;
    }

    :global(button.footer-setting-shortcut-button.quality-shortcut) {
        width: auto;
        min-width: 58px;
        height: 50px;
        flex: 0 0 auto;
        padding: 0 7px;
        border-radius: 25px;
        gap: 4px;
    }

    :global(button.footer-setting-shortcut-button.pair-shortcut) {
        width: 72px;
        min-width: 72px;
        height: 50px;
        min-height: 44px;
        flex: 0 0 72px;
        padding: 0 10px;
        border-radius: 25px;
    }

    .quality-shortcut-content {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        white-space: nowrap;
    }

    .quality-shortcut-label {
        min-width: 0.85em;
        font-size: 0.875rem;
        line-height: 1;
    }
</style>
