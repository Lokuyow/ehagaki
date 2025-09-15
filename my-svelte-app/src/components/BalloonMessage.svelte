<script lang="ts">
    interface Props {
        type?: "success" | "error" | "info"; // infoを追加
        message?: string;
    }

    let { type = "success", message = "" }: Props = $props();
</script>

<div class="balloon-message-wrapper {type}">
    <div class="balloon-message">{message}</div>
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
        /* info */
        --balloon-info-bg: hsl(125, 39%, 94%);
        --balloon-info-color: hsl(123, 46%, 32%);
        --balloon-info-border: hsl(125, 39%, 70%);
    }
    .balloon-message-wrapper {
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
        margin-left: 2px;
        margin-right: 6px;
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
        font-size: 1.125rem;
        color: #333;
        margin: auto 0 auto 8px;
    }
    .balloon-message-wrapper.info .balloon-message {
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
    .balloon-message-wrapper.info .balloon-message::after {
        border-color: transparent var(--balloon-info-bg) transparent transparent;
    }
    .balloon-message-wrapper.info .balloon-message::before {
        border-color: transparent var(--balloon-info-border) transparent
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
    .balloon-message-wrapper.info .balloon-message {
        background: var(--balloon-info-bg);
        color: var(--balloon-info-color);
        border-color: var(--balloon-info-border);
    }
</style>
