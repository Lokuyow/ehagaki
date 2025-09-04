<script lang="ts">
    import { _ } from "svelte-i18n";
    import { PublicKeyState } from "../lib/keyManager";
    import Dialog from "./Dialog.svelte";
    import Button from "./Button.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";

    export let secretKey: string;
    export let onClose: () => void;
    export let onSave: () => void;
    export let onNostrLogin: () => void;
    export let isLoadingNostrLogin: boolean = false;

    // --- 公開鍵状態管理 ---
    const publicKeyState = new PublicKeyState();

    // --- エラーメッセージ管理 ---
    let inputEl: HTMLInputElement | null = null;

    // --- 秘密鍵入力の監視と公開鍵状態の更新 ---
    $: if (secretKey !== undefined) {
        publicKeyState.setNsec(secretKey);
        // 入力値が空の場合のみエラーをクリア
        if (inputEl) {
            if (!secretKey) {
                inputEl.setCustomValidity("");
            }
        }
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
        if (inputEl) {
            const validity = inputEl.validity;
            const value = inputEl.value ?? "";

            // バリデーションはsave時のみ
            if (validity.valueMissing) {
                inputEl.setCustomValidity($_("secret_required"));
                inputEl.reportValidity();
                return;
            }

            // nsec1で始まるかチェック
            if (!value.startsWith("nsec1")) {
                inputEl.setCustomValidity($_("secret_must_start_nsec1"));
                inputEl.reportValidity();
                return;
            }

            // 長さのチェック
            if (value.length !== 63) {
                if (value.length < 63) {
                    inputEl.setCustomValidity($_("secret_too_short"));
                } else {
                    inputEl.setCustomValidity($_("secret_too_long"));
                }
                inputEl.reportValidity();
                return;
            }

            // PublicKeyStateの検証結果をチェック
            if (!isValid) {
                inputEl.setCustomValidity($_("invalid_secret"));
                inputEl.reportValidity();
                return;
            }

            inputEl.setCustomValidity("");
        }
        onSave?.();
    }
    function handleClear() {
        secretKey = "";
        if (inputEl) inputEl.setCustomValidity("");
    }
    function handleNostrLogin() {
        onNostrLogin?.();
    }
</script>

<!-- npubまたはnprofileのいずれかが存在する場合、1つのトースト要素でまとめて表示 -->
{#if npubValue || nprofileValue}
    <div class="toast npub-toast">
        {#if npubValue}
            <div>
                <span style="word-break:break-all">{npubValue}</span>
            </div>
        {/if}
        {#if nprofileValue}
            <div>
                <span style="word-break:break-all">{nprofileValue}</span>
            </div>
        {/if}
    </div>
{/if}

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
    <form on:submit|preventDefault={handleSave}>
        <input
            type="password"
            bind:value={secretKey}
            placeholder="nsec1…"
            class="secret-input"
            id="secretKey"
            name="secretKey"
            autocomplete="current-password"
            required
            minlength="63"
            maxlength="63"
            bind:this={inputEl}
            title={$_("hint_input_secret")}
            on:keydown={(e) => {
                if (e.key === "Enter") handleSave();
            }}
            on:input={() => {
                // 入力時はエラーをクリアするだけ
                if (inputEl) inputEl.setCustomValidity("");
            }}
        />

        <div class="dialog-buttons">
            <Button
                type="button"
                on:click={handleClear}
                className="clear-btn btn-angular">{$_("clear")}</Button
            >
            <Button type="submit" className="save-btn btn-angular"
                >{$_("save")}</Button
            >
        </div>
    </form>
</Dialog>

<style>
    h3 {
        margin: 0 0 16px 0;
    }
    form {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
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

    /* トースト用スタイル */
    .toast {
        position: fixed;
        top: 0px;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        max-width: 500px;
        background: var(--dialog);
        color: var(--text-light);
        padding: 4px 10px 10px 10px;
        border-radius: 0 0 6px 6px;
        z-index: 101;
        font-size: 0.96rem;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
        opacity: 0.8;
        margin-bottom: 8px;
        word-break: break-all;
        animation: toast-fadein 0.3s;
    }
    @keyframes toast-fadein {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
        }
        to {
            opacity: 0.98;
            transform: translateX(-50%) translateY(0);
        }
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
