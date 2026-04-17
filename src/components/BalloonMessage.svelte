<script lang="ts">
    import type { BalloonMessageType } from "../lib/types";

    interface Props {
        type?: BalloonMessageType;
        message?: string;
    }

    let { type = "success", message = "" }: Props = $props();

    // <wbr>のみを許可するサニタイズ：テキストをHTMLエスケープしてから<wbr>だけ復元する
    function sanitizeForWbr(text: string): string {
        return text
            .split("<wbr>")
            .map((part) =>
                part
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;"),
            )
            .join("<wbr>");
    }

    let safeMessage = $derived(sanitizeForWbr(message));
</script>

<div class="balloon-message-wrapper {type}">
    <div class="balloon-message">{@html safeMessage}</div>
</div>

<style>
    /* --- カラープロパティ定義 --- */
    :root {
        /* success */
        --balloon-success-bg: hsl(200, 39%, 96%);
        --balloon-success-color: hsl(210, 60%, 40%);
        --balloon-success-border: hsl(210, 48%, 70%);
        /* error */
        --balloon-error-bg: hsl(351, 99%, 96%);
        --balloon-error-color: hsl(351, 99%, 32%);
        --balloon-error-border: hsl(351, 99%, 70%);
        /* warning */
        --balloon-warning-bg: hsl(38, 100%, 95%);
        --balloon-warning-color: hsl(30, 90%, 35%);
        --balloon-warning-border: hsl(38, 90%, 65%);
        /* flavor */
        --balloon-flavor-bg: hsl(125, 39%, 94%);
        --balloon-flavor-color: hsl(123, 46%, 32%);
        --balloon-flavor-border: hsl(125, 39%, 70%);
        /* tips */
        --balloon-tips-bg: hsl(270, 50%, 96%);
        --balloon-tips-color: hsl(270, 55%, 38%);
        --balloon-tips-border: hsl(270, 45%, 70%);
    }
    .balloon-message-wrapper {
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
        margin-left: 6px;
        margin-right: 4px;
        z-index: 2;
        pointer-events: none;
    }
    .balloon-message {
        position: relative;
        background: #fff;
        border: 2px solid #e0e0e0;
        border-radius: 16px;
        max-width: 150px;
        height: fit-content;
        padding: 6px 8px;
        font-size: 1rem;
        line-height: 1.2;
        color: #333;
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
        transform: translateY(-50%);
        border-style: solid;
        border-width: 4px 8px 4px 0;
        border-color: transparent #fff transparent transparent;
        z-index: 2;
    }
    .balloon-message::before {
        content: "";
        position: absolute;
        top: 50%;
        left: -10px;
        transform: translateY(-50%);
        border-style: solid;
        border-width: 6px 10px 6px 0;
        border-color: transparent; /* 外側黒 */
        z-index: 1;
    }
    /* --- 各typeの色に合わせて内側三角形の色を調整 --- */
    .balloon-message-wrapper.error .balloon-message::after {
        border-color: transparent var(--balloon-error-bg) transparent
            transparent;
    }
    .balloon-message-wrapper.error .balloon-message::before {
        border-color: transparent var(--balloon-error-border) transparent
            transparent;
    }
    .balloon-message-wrapper.success .balloon-message::after {
        border-color: transparent var(--balloon-success-bg) transparent
            transparent;
    }
    .balloon-message-wrapper.success .balloon-message::before {
        border-color: transparent var(--balloon-success-border) transparent
            transparent;
    }
    .balloon-message-wrapper.flavor .balloon-message::after {
        border-color: transparent var(--balloon-flavor-bg) transparent
            transparent;
    }
    .balloon-message-wrapper.flavor .balloon-message::before {
        border-color: transparent var(--balloon-flavor-border) transparent
            transparent;
    }
    /* 外側三角形（before）は黒で共通 */
    .balloon-message-wrapper.error .balloon-message {
        background: var(--balloon-error-bg);
        color: var(--balloon-error-color);
        border-color: var(--balloon-error-border);
    }
    .balloon-message-wrapper.success .balloon-message {
        background: var(--balloon-success-bg);
        color: var(--balloon-success-color);
        border-color: var(--balloon-success-border);
    }
    .balloon-message-wrapper.flavor .balloon-message {
        background: var(--balloon-flavor-bg);
        color: var(--balloon-flavor-color);
        border-color: var(--balloon-flavor-border);
    }
    .balloon-message-wrapper.warning .balloon-message::after {
        border-color: transparent var(--balloon-warning-bg) transparent
            transparent;
    }
    .balloon-message-wrapper.warning .balloon-message::before {
        border-color: transparent var(--balloon-warning-border) transparent
            transparent;
    }
    .balloon-message-wrapper.warning .balloon-message {
        background: var(--balloon-warning-bg);
        color: var(--balloon-warning-color);
        border-color: var(--balloon-warning-border);
    }
    .balloon-message-wrapper.tips .balloon-message::after {
        border-color: transparent var(--balloon-tips-bg) transparent transparent;
    }
    .balloon-message-wrapper.tips .balloon-message::before {
        border-color: transparent var(--balloon-tips-border) transparent
            transparent;
    }
    .balloon-message-wrapper.tips .balloon-message {
        background: var(--balloon-tips-bg);
        color: var(--balloon-tips-color);
        border-color: var(--balloon-tips-border);
    }
</style>
