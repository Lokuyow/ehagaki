<script lang="ts">
    import { _ } from "svelte-i18n";
    import { PublicKeyState } from "../lib/keyManager";
    import Dialog from "./Dialog.svelte";
    import Button from "./Button.svelte";

    export let secretKey: string;
    export let errorMessage: string = "";
    export let onClose: () => void;
    export let onSave: () => void;
    export let onNostrLogin: () => void;

    // ローディング状態管理
    let isNostrLoginLoading = false;

    // 公開鍵状態管理（リアクティブ）
    const publicKeyState = new PublicKeyState();

    // 入力を動的に監視してリアクティブに更新
    $: if (secretKey !== undefined) {
        publicKeyState.setNsec(secretKey);
    }

    // 公開鍵状態をサブスクライブして状態を取得
    $: isValid = false;
    $: npubValue = "";
    $: nprofileValue = "";

    // 各ストアをサブスクライブ
    $: publicKeyState.isValid.subscribe((val) => (isValid = val));
    $: publicKeyState.npub.subscribe((val) => (npubValue = val));
    $: publicKeyState.nprofile.subscribe((val) => (nprofileValue = val));

    // エラーメッセージの動的更新
    $: if (secretKey) {
        errorMessage = isValid ? "" : "invalid_secret";
    } else {
        errorMessage = "";
    }

    function handleClose() {
        onClose?.();
    }
    function handleSave() {
        onSave?.();
    }
    function handleClear() {
        secretKey = "";
    }
    function handleNostrLogin() {
        isNostrLoginLoading = true;
        console.log("Nostr Loginボタンクリック - ローディング開始");
        onNostrLogin?.();
    }
</script>

<Dialog
    show={true}
    {onClose}
    ariaLabel={$_("input_secret")}
    className="login-dialog"
>
    <Button
        className="nostr-login-button btn {isNostrLoginLoading
            ? 'loading'
            : ''}"
        on:click={handleNostrLogin}
        disabled={isNostrLoginLoading}
    >
        {#if isNostrLoginLoading}
            <div class="loading-spinner"></div>
            <span class="loading-text">{$_("loading")}...</span>
        {:else}
            Nostr Login
        {/if}
    </Button>

    <div class="divider">
        <span>{$_("or")}</span>
    </div>

    <h3>{$_("input_secret")}</h3>
    <input
        type="password"
        bind:value={secretKey}
        placeholder="nsec1…"
        class="secret-input"
        id="secretKey"
        name="secretKey"
    />

    <div class="dialog-info">
        {#if npubValue}
            <span class="pubkey-value" style="word-break:break-all"
                >{npubValue}</span
            >
        {/if}
        {#if nprofileValue}
            <span class="profilekey-value" style="word-break:break-all"
                >{nprofileValue}</span
            >
        {/if}
        {#if errorMessage}
            <p class="error-message">{$_(errorMessage)}</p>
        {/if}
    </div>
    <div class="dialog-buttons">
        <Button on:click={handleClose} className="cancel-btn btn-angular"
            >{$_("cancel")}</Button
        >
        <Button on:click={handleClear} className="clear-btn btn-angular"
            >{$_("clear")}</Button
        >
        <Button on:click={handleSave} className="save-btn btn-angular"
            >{$_("save")}</Button
        >
    </div>
</Dialog>

<style>
    h3 {
        margin: 0 0 16px 0;
    }
    .dialog-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 6px;
        width: 100%;
        height: 50px;
    }

    :global(.cancel-btn) {
        --btn-bg: var(--white);
        border: 1px solid #ccc;
        color: #3d3d3d;
        width: 100%;
    }

    :global(.clear-btn) {
        --btn-bg: var(--yellow);
        border: 1px solid #ccc;
        color: #3d3d3d;
        width: 100%;
    }

    :global(.save-btn) {
        --btn-bg: var(--theme);
        color: white;
        border: none;
        width: 100%;
    }

    .error-message {
        font-size: 1rem;
        color: #d32f2f;
        margin-top: 0.5rem;
    }

    .pubkey-value,
    .profilekey-value {
        align-self: flex-start;
        margin: 0;
        font-size: 0.85rem;
    }

    .secret-input {
        font-family: monospace;
        font-size: 1rem;
        padding: 0.6rem;
        background-color: var(--bg-input);
        border: 1px solid var(--border);
        width: 100%;
        height: 60px;
    }

    .dialog-info {
        width: 100%;
        margin: 20px 0;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        min-height: 86px;
        box-sizing: border-box;
        gap: 4px;
    }

    :global(.nostr-login-button) {
        --btn-bg: var(--nostr);
        color: white;
        border: none;
        height: 65px;
        width: 140px;
        margin-top: 32px;
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 0.2s ease-in-out;
        position: relative;
        overflow: hidden;
    }

    :global(.nostr-login-button.loading) {
        opacity: 0.8;
        cursor: not-allowed;
        background: var(--nostr) !important;
        color: white !important;
    }

    :global(.nostr-login-button.loading::before) {
        content: "";
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
        );
        animation: shimmer 1.5s infinite;
    }

    .loading-spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top: 2px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        flex-shrink: 0;
    }

    .loading-text {
        font-size: 0.95rem;
        opacity: 0.9;
        animation: pulse-text 1.5s ease-in-out infinite;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    @keyframes shimmer {
        0% {
            left: -100%;
        }
        100% {
            left: 100%;
        }
    }

    @keyframes pulse-text {
        0%,
        100% {
            opacity: 0.9;
        }
        50% {
            opacity: 0.6;
        }
    }

    :global(.nostr-login-button:hover:not(.loading)) {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(139, 69, 19, 0.3);
    }

    :global(.nostr-login-button:active:not(.loading)) {
        transform: translateY(0);
    }

    .divider {
        display: flex;
        align-items: center;
        text-align: center;
        margin: 32px 0;
        width: 90%;
    }

    .divider::before,
    .divider::after {
        content: "";
        flex: 1;
        height: 1px;
        background: var(--border);
    }

    .divider span {
        color: var(--text-light);
        padding: 0 16px;
        font-size: 1rem;
    }
</style>
