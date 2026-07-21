<script lang="ts">
    import type { BalloonMessageType } from "../lib/types";
    import { sanitizeHtmlAllowingWbr } from "../lib/utils/htmlSanitizer";

    interface Props {
        type?: BalloonMessageType;
        message?: string;
    }

    let { type = "success", message = "" }: Props = $props();

    let safeMessage = $derived(sanitizeHtmlAllowingWbr(message));
</script>

<div class="balloon-message-wrapper {type}">
    <div class="balloon-message">{@html safeMessage}</div>
</div>

<style>
    .balloon-message-wrapper {
        --balloon-bg: var(--message-success-bg);
        --balloon-color: var(--message-success-color);
        --balloon-border: var(--message-success-border);
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
        margin-left: 6px;
        margin-right: 4px;
        z-index: 2;
        pointer-events: none;
    }
    .balloon-message-wrapper.success {
        --balloon-bg: var(--message-success-bg);
        --balloon-color: var(--message-success-color);
        --balloon-border: var(--message-success-border);
    }
    .balloon-message-wrapper.error {
        --balloon-bg: var(--message-error-bg);
        --balloon-color: var(--message-error-color);
        --balloon-border: var(--message-error-border);
    }
    .balloon-message-wrapper.warning {
        --balloon-bg: var(--message-warning-bg);
        --balloon-color: var(--message-warning-color);
        --balloon-border: var(--message-warning-border);
    }
    .balloon-message-wrapper.flavor {
        --balloon-bg: var(--message-flavor-bg);
        --balloon-color: var(--message-flavor-color);
        --balloon-border: var(--message-flavor-border);
    }
    .balloon-message-wrapper.tips {
        --balloon-bg: var(--message-tips-bg);
        --balloon-color: var(--message-tips-color);
        --balloon-border: var(--message-tips-border);
    }
    .balloon-message {
        position: relative;
        background: var(--balloon-bg);
        border: 2px solid var(--balloon-border);
        border-radius: 16px;
        max-width: 150px;
        height: fit-content;
        padding: 6px 8px;
        font-size: 1rem;
        line-height: 1.2;
        color: var(--balloon-color);
        margin: auto 0 auto 8px;
    }
    .balloon-message-wrapper.flavor .balloon-message {
        font-size: 0.875rem;
    }
    /* --- ここから二重線しっぽ --- */
    .balloon-message::after {
        content: "";
        position: absolute;
        top: 50%;
        left: -7px;
        translate: 0 -50%;
        border-style: solid;
        border-width: 4px 8px 4px 0;
        border-color: transparent var(--balloon-bg) transparent transparent;
        z-index: 2;
    }
    .balloon-message::before {
        content: "";
        position: absolute;
        top: 50%;
        left: -10px;
        translate: 0 -50%;
        border-style: solid;
        border-width: 6px 10px 6px 0;
        border-color: transparent var(--balloon-border) transparent transparent;
        z-index: 1;
    }
</style>
