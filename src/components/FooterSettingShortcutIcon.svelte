<script lang="ts">
    import type { FooterSettingShortcutId } from "../lib/footerSettingShortcuts";
    import { resolveAppAssetUrl } from "../lib/appAssetUrl";

    interface Props {
        shortcutId: FooterSettingShortcutId;
    }

    let { shortcutId }: Props = $props();
</script>

{#if shortcutId === "hide-mascot"}
    <img class="shortcut-icon mascot-icon" src={resolveAppAssetUrl("ehagaki_icon.svg")} alt="" aria-hidden="true" />
{:else}
    <span class="shortcut-icon shortcut-mask-icon" class:language-icon={shortcutId === "language"} class:image-icon={shortcutId === "image-quality"} class:video-icon={shortcutId === "video-quality"} class:theme-icon={shortcutId === "theme-mode"} class:media-icon={shortcutId === "media-free-placement"} class:flavor-icon={shortcutId === "hide-flavor-text"} class:quote-icon={shortcutId === "quote-notification"} class:reply-icon={shortcutId === "reply-notification"} class:client-tag-icon={shortcutId === "client-tag"} aria-hidden="true"></span>
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
    .media-icon { mask-image: url("/icons/open_with_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"); }
    .flavor-icon { mask-image: url("/icons/chat_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"); }
    .quote-icon { mask-image: url("/icons/format_quote_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"); }
    .reply-icon { mask-image: url("/icons/chat_bubble_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"); }
    .client-tag-icon { mask-image: url("/icons/label_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"); }
    .mascot-icon { object-fit: contain; filter: grayscale(1); }
</style>
