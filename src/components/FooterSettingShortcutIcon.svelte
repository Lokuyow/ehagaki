<script lang="ts">
    import type { FooterSettingShortcutId } from "../lib/footerSettingShortcuts";
    import { resolveAppAssetUrl } from "../lib/appAssetUrl";

    interface Props {
        shortcutId: FooterSettingShortcutId;
        active?: boolean;
        stateValue?: string;
    }

    let { shortcutId, active = false, stateValue = "system" }: Props = $props();

    let mascotSource = $derived(
        resolveAppAssetUrl(active ? "icons/ehagaki_icon_frame.svg" : "ehagaki_icon.svg"),
    );
    let iconClass = $derived(getIconClass());

    function getIconClass(): string {
        switch (shortcutId) {
            case "language":
                return "language-icon";
            case "image-quality":
                return "image-icon";
            case "video-quality":
                return "video-icon";
            case "theme-mode":
                return stateValue === "light"
                    ? "theme-light-icon"
                    : stateValue === "dark"
                      ? "theme-dark-icon"
                      : "theme-icon";
            case "media-free-placement":
                return active ? "media-on-icon" : "media-icon";
            case "hide-mascot":
                return "";
            case "hide-flavor-text":
                return active ? "flavor-hidden-icon" : "flavor-icon";
            case "quote-notification":
                return "quote-icon";
            case "reply-notification":
                return "reply-icon";
            case "client-tag":
                return active ? "client-tag-icon" : "client-tag-off-icon";
        }
    }
</script>

{#if shortcutId === "hide-mascot"}
    <img class="shortcut-icon mascot-icon" src={mascotSource} alt="" aria-hidden="true" />
{:else if shortcutId === "quote-notification" || shortcutId === "reply-notification"}
    <span class="paired-icons" aria-hidden="true">
        <span class="shortcut-icon shortcut-mask-icon {iconClass} paired-main-icon"></span>
        <span class="shortcut-icon shortcut-mask-icon paired-notification-icon" class:notification-on={active} class:notification-off={!active}></span>
    </span>
{:else}
    <span class="shortcut-icon shortcut-mask-icon {iconClass}" aria-hidden="true"></span>
{/if}

<style>
    .shortcut-icon {
        display: block;
        width: 24px;
        height: 24px;
        flex: 0 0 24px;
    }

    .shortcut-mask-icon {
        background-color: var(--text, currentColor);
        mask-size: contain;
        mask-position: center;
        mask-repeat: no-repeat;
    }

    .language-icon { mask-image: url("/icons/translate_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"); }
    .image-icon { mask-image: url("/icons/image_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"); }
    .video-icon { mask-image: url("/icons/movie_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"); }
    .theme-icon { mask-image: url("/icons/contrast_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"); }
    .theme-light-icon { mask-image: url("/icons/light_mode_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"); }
    .theme-dark-icon { mask-image: url("/icons/dark_mode_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"); }
    .media-icon { mask-image: url("/icons/page_footer_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"); }
    .media-on-icon { mask-image: url("/icons/open_with_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"); }
    .flavor-icon { mask-image: url("/icons/chat_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"); }
    .flavor-hidden-icon { mask-image: url("/icons/chat_error_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"); }
    .quote-icon { mask-image: url("/icons/format_quote_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"); }
    .reply-icon { mask-image: url("/icons/chat_bubble_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"); }
    .client-tag-icon { mask-image: url("/icons/label_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"); }
    .client-tag-off-icon { mask-image: url("/icons/label_off_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"); }
    .mascot-icon { object-fit: contain; filter: grayscale(1); }

    .paired-icons {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        width: 52px;
        height: 24px;
        flex: 0 0 52px;
    }
    .notification-on { mask-image: url("/icons/notifications_active_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"); }
    .notification-off { mask-image: url("/icons/notifications_off_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"); }
</style>
