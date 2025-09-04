<script lang="ts">
    import { _ } from "svelte-i18n";
    import { PublicKeyState } from "../lib/keyManager";
    import Dialog from "./Dialog.svelte";
    import Button from "./Button.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";

    export let secretKey: string;
    export let errorMessage: string = "";
    export let onClose: () => void;
    export let onSave: () => void;
    export let onNostrLogin: () => void;
    export let isLoadingNostrLogin: boolean = false;

    // --- 公開鍵状態管理 ---
    const publicKeyState = new PublicKeyState();

    // --- 秘密鍵入力の監視と公開鍵状態の更新 ---
    $: if (secretKey !== undefined) {
        publicKeyState.setNsec(secretKey);
        // 入力または programmatic な変更があったらエラーメッセージを消す
        errorMessage = "";
    }

    // --- 公開鍵状態のサブスクライブ ---
    $: isValid = false;
    $: npubValue = "";
    $: nprofileValue = "";
    $: publicKeyState.isValid.subscribe((val) => (isValid = val));
    $: publicKeyState.npub.subscribe((val) => (npubValue = val));
    $: publicKeyState.nprofile.subscribe((val) => (nprofileValue = val));

    // --- UIイベントハンドラ ---
    function handleSave() {
        if (!secretKey) {
            // 未入力時は新しいメッセージキーをセット
            errorMessage = "secret_required";
            return;
        }
        if (!isValid) {
            errorMessage = "invalid_secret";
            return;
        }
        errorMessage = ""; // 成功時はエラーを消す
        onSave?.();
    }
    function handleClear() {
        secretKey = "";
        errorMessage = "";
    }
    function handleNostrLogin() {
        // Nostr ログイン開始時に既存のエラーメッセージを消す
        errorMessage = "";
        onNostrLogin?.();
    }
</script>

<Dialog
    show={true}
    {onClose}
    ariaLabel={$_("input_secret")}
    className="login-dialog"
    showFooter={true}
>
    <Button
        className="nostr-login-button btn {isLoadingNostrLogin
            ? 'loading'
            : ''}"
        on:click={handleNostrLogin}
        disabled={isLoadingNostrLogin}
    >
        {#if isLoadingNostrLogin}
            <LoadingPlaceholder
                text={$_("loading")}
                showImage={false}
                showSpinner={true}
                customClass="nostr-login-placeholder"
            />
        {:else}
            <img
                src="/ehagaki/icons/nostr-login.svg"
                alt="nostr-login"
                class="nostr-login-icon"
            />
            <span class="btn-text">Nostr Login</span>
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
        autocomplete="current-password"
        required
        on:input={() => (errorMessage = "")}
        on:keydown={(e) => {
            if (e.key === "Enter") handleSave();
        }}
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
        gap: 8px;
        width: 100%;
        height: 50px;
    }

    :global(.cancel-btn) {
        --btn-bg: var(--white);
        border: 1px solid hsl(0, 0%, 92%);
        color: #3d3d3d;
        width: 100%;
    }

    :global(.clear-btn) {
        --btn-bg: hsl(58, 99%, 68%);
        border: none;
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
        font-size: 1.2rem;
        font-weight: 500;
        color: var(--text-red);
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
        border: 1px solid var(--btn-border);
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
        color: var(--text-light);
        height: 65px;
        margin-top: 44px;
        margin-bottom: 16px;
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        position: relative;
        overflow: hidden;
    }

    .nostr-login-icon {
        width: 32px;
        height: 32px;
        margin-right: 4px;
        flex-shrink: 0;
        display: inline-block;
    }

    :global(.nostr-login-button.loading) {
        opacity: 0.8;
        cursor: not-allowed;
    }

    /* shimmer animation for button loading (if needed) */
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

    .divider {
        display: flex;
        align-items: center;
        text-align: center;
        margin: 32px 0;
        width: 100%;
    }

    .divider::before,
    .divider::after {
        content: "";
        flex: 1;
        height: 1px;
        background: var(--border-hr);
    }

    .divider span {
        color: var(--text-light);
        padding: 0 16px;
        font-size: 1rem;
    }
</style>
