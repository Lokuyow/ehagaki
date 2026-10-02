<script lang="ts">
    import { Popover, RadioGroup, Switch } from "bits-ui";
    import { _ } from "svelte-i18n";
    import Button from "./Button.svelte";
    import RadioButton from "./RadioButton.svelte";
    import FooterSettingShortcutIcon from "./FooterSettingShortcutIcon.svelte";
    import { getAppRuntimeEnvironment } from "../lib/appRuntimeEnvironment";
    import { getCompressionLevels } from "../lib/constants";
    import type { FooterSettingShortcutId } from "../lib/footerSettingShortcuts";
    import { settingsStore } from "../stores/settingsStore.svelte";
    import { themeModeStore } from "../stores/themeStore.svelte";

    interface Props {
        shortcutId: FooterSettingShortcutId;
        label: string;
        align?: "center" | "end";
    }

    let { shortcutId, label, align = "center" }: Props = $props();
    const overlayTarget = getAppRuntimeEnvironment().overlayTarget;
    let compressionLevels = $derived(getCompressionLevels($_));
    let effectiveHideFlavorText = $derived(
        !settingsStore.showMascot || !settingsStore.showFlavorText,
    );

    function setBoolean(value: boolean): void {
        switch (shortcutId) {
            case "media-free-placement": settingsStore.mediaFreePlacement = value; break;
            case "hide-mascot": settingsStore.showMascot = !value; break;
            case "hide-flavor-text": settingsStore.showFlavorText = !value; break;
            case "quote-notification": settingsStore.quoteNotificationEnabled = value; break;
            case "reply-notification": settingsStore.replyNotificationEnabled = value; break;
            case "client-tag": settingsStore.clientTagEnabled = value; break;
        }
    }
</script>

<Popover.Root>
    <Popover.Trigger>
        {#snippet child({ props })}
            <Button {...props} className="footer-setting-shortcut-button" variant="default" shape="circle" contentLayout="icon" ariaLabel={label}>
                <FooterSettingShortcutIcon {shortcutId} />
            </Button>
        {/snippet}
    </Popover.Trigger>
    <Popover.Portal to={overlayTarget}>
        <Popover.Content class="footer-setting-shortcut-popover" side="top" {align} sideOffset={8} collisionBoundary={overlayTarget.parentElement} aria-label={label}>
            {#if shortcutId === "language"}
                <RadioGroup.Root class="shortcut-radio-group" name="footer-shortcut-language" value={settingsStore.locale} aria-label={label} onValueChange={(value) => (settingsStore.locale = value)}>
                    <RadioButton value="ja" ariaLabel="日本語">日本語</RadioButton>
                    <RadioButton value="en" ariaLabel="English">English</RadioButton>
                </RadioGroup.Root>
            {:else if shortcutId === "image-quality" || shortcutId === "video-quality"}
                <RadioGroup.Root class="shortcut-radio-group" name={`footer-shortcut-${shortcutId}`} value={shortcutId === "image-quality" ? settingsStore.imageQualityLevel : settingsStore.videoQualityLevel} aria-label={label} onValueChange={(value) => {
                    if (shortcutId === "image-quality") settingsStore.imageQualityLevel = value;
                    else settingsStore.videoQualityLevel = value;
                }}>
                    {#each compressionLevels as level}
                        <RadioButton value={level.value} ariaLabel={level.label}>{level.label}</RadioButton>
                    {/each}
                </RadioGroup.Root>
            {:else if shortcutId === "theme-mode"}
                <RadioGroup.Root class="shortcut-radio-group" name="footer-shortcut-theme" value={themeModeStore.value} aria-label={label} onValueChange={(value) => themeModeStore.set(value as "system" | "light" | "dark")}>
                    <RadioButton value="system" ariaLabel={$_("settingsDialog.theme_system")}>{$_("settingsDialog.theme_system")}</RadioButton>
                    <RadioButton value="light" ariaLabel={$_("settingsDialog.theme_light")}>{$_("settingsDialog.theme_light")}</RadioButton>
                    <RadioButton value="dark" ariaLabel={$_("settingsDialog.theme_dark")}>{$_("settingsDialog.theme_dark")}</RadioButton>
                </RadioGroup.Root>
            {:else if shortcutId === "hide-flavor-text"}
                <div class="shortcut-switch-row">
                    <span>{label}</span>
                    <Switch.Root class="shortcut-switch" checked={effectiveHideFlavorText} disabled={!settingsStore.showMascot} aria-label={label} onCheckedChange={setBoolean}>
                        <Switch.Thumb class="shortcut-switch-thumb" />
                    </Switch.Root>
                </div>
                {#if !settingsStore.showMascot}<p class="shortcut-note">{$_("settingsDialog.hide_flavor_text_note_included")}</p>{/if}
            {:else}
                <div class="shortcut-switch-row">
                    <span>{label}</span>
                    <Switch.Root class="shortcut-switch" checked={shortcutId === "hide-mascot" ? !settingsStore.showMascot : shortcutId === "media-free-placement" ? settingsStore.mediaFreePlacement : shortcutId === "quote-notification" ? settingsStore.quoteNotificationEnabled : shortcutId === "reply-notification" ? settingsStore.replyNotificationEnabled : settingsStore.clientTagEnabled} aria-label={label} onCheckedChange={setBoolean}>
                        <Switch.Thumb class="shortcut-switch-thumb" />
                    </Switch.Root>
                </div>
            {/if}
        </Popover.Content>
    </Popover.Portal>
</Popover.Root>

<style>
    :global(button.footer-setting-shortcut-button) {
        width: 50px;
        height: 50px;
        min-width: 44px;
        min-height: 44px;
        flex: 0 0 50px;
        padding: 0;
    }
    :global(.footer-setting-shortcut-popover) {
        box-sizing: border-box;
        width: min(240px, var(--bits-popover-content-available-width, 240px));
        max-width: calc(100vw - 16px);
        padding: 12px;
        border: 1px solid var(--border);
        border-radius: 8px;
        background: var(--dialog-bg);
        color: var(--text);
        box-shadow: 0 6px 20px rgb(0 0 0 / 18%);
        z-index: 100001;
    }
    :global(.shortcut-radio-group) { display: flex; flex-wrap: wrap; gap: 6px; }
    :global(.footer-setting-shortcut-popover button[role="radio"]) {
        min-inline-size: 44px;
        min-block-size: 44px;
    }
    .shortcut-switch-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    :global(button.shortcut-switch) {
        position: relative;
        width: 56px;
        height: 32px;
        min-width: 44px;
        min-height: 44px;
        flex: 0 0 56px;
        border: 0;
        border-radius: 20px;
        background: var(--toggle-bg);
        padding: 6px;
    }
    :global(button.shortcut-switch[data-state="checked"]) { background: var(--theme); }
    :global(.shortcut-switch-thumb) { display: block; width: 20px; height: 20px; border-radius: 50%; background: white; transition: translate 120ms ease; }
    :global(button.shortcut-switch[data-state="checked"] .shortcut-switch-thumb) { translate: 24px 0; }
    :global(button.shortcut-switch[data-disabled]) { opacity: .5; }
    .shortcut-note { margin: 8px 0 0; color: var(--text-muted); font-size: .875rem; }
</style>
