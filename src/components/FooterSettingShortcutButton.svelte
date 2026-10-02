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
    let accessibleName = $derived(
        isBooleanShortcut ? label : `${label}: ${currentValueLabel}`,
    );
    let feedbackMessage = $derived(`${label}: ${currentValueLabel}`);

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
                return $_(settingsStore.mediaFreePlacement ? "settingsDialog.footer_shortcut_on" : "settingsDialog.footer_shortcut_off") ?? "";
            case "hide-mascot":
                return $_(!settingsStore.showMascot ? "settingsDialog.footer_shortcut_on" : "settingsDialog.footer_shortcut_off") ?? "";
            case "hide-flavor-text":
                return $_(!settingsStore.showMascot || !settingsStore.showFlavorText ? "settingsDialog.footer_shortcut_on" : "settingsDialog.footer_shortcut_off") ?? "";
            case "quote-notification":
                return $_(settingsStore.quoteNotificationEnabled ? "settingsDialog.footer_shortcut_on" : "settingsDialog.footer_shortcut_off") ?? "";
            case "reply-notification":
                return $_(settingsStore.replyNotificationEnabled ? "settingsDialog.footer_shortcut_on" : "settingsDialog.footer_shortcut_off") ?? "";
            case "client-tag":
                return $_(settingsStore.clientTagEnabled ? "settingsDialog.footer_shortcut_on" : "settingsDialog.footer_shortcut_off") ?? "";
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
</script>

<Button
    className="footer-setting-shortcut-button"
    variant="default"
    shape="circle"
    contentLayout="icon"
    ariaLabel={accessibleName}
    aria-pressed={isBooleanShortcut ? active : undefined}
    disabled={disabled}
    selected={isBooleanShortcut && active}
    floatingMessage={feedbackMessage}
    floatingMessageVariant="container-top-right"
    onClick={handleClick}
>
    <FooterSettingShortcutIcon {shortcutId} />
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
</style>
