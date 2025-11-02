<script lang="ts">
    import { _ } from "svelte-i18n";
    import { PublicKeyState } from "../lib/keyManager";
    import Dialog from "./Dialog.svelte";
    import Button from "./Button.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";

    interface Props {
        show: boolean;
        secretKey: string;
        onClose: () => void;
        onSave: () => void;
        onNostrLogin: () => void;
        isLoadingNostrLogin?: boolean;
    }

    let {
        show,
        secretKey = $bindable(),
        onClose,
        onSave,
        onNostrLogin,
        isLoadingNostrLogin = false,
    }: Props = $props();

    // --- 公開鍵状態管理 ---
    const publicKeyState = new PublicKeyState();

    // --- エラーメッセージ管理 ---
    let inputEl: HTMLInputElement | null = $state(null);

    // --- 秘密鍵入力の監視と公開鍵状態の更新 ---
    $effect(() => {
        if (secretKey !== undefined) {
            publicKeyState.setNsec(secretKey);
            // 入力値が空の場合のみエラーをクリア
            if (inputEl) {
                if (!secretKey) {
                    inputEl.setCustomValidity("");
                }
            }
        }
    });

    // --- 公開鍵状態のサブスクライブ ---
    let isValid = $state(false);

    let npubValue = $state("");

    let nprofileValue = $state("");

    $effect(() => {
        publicKeyState.isValid.subscribe((val) => (isValid = val));
    });
    $effect(() => {
        publicKeyState.npub.subscribe((val) => (npubValue = val));
    });
    $effect(() => {
        publicKeyState.nprofile.subscribe((val) => (nprofileValue = val));
    });

    // --- UIイベントハンドラ ---
    function handleSave() {
        if (inputEl) {
            const validity = inputEl.validity;
            const value = inputEl.value ?? "";

            // バリデーションはsave時のみ
            if (validity.valueMissing) {
                inputEl.setCustomValidity($_("loginDialog.secret_required"));
                inputEl.reportValidity();
                return;
            }

            // nsec1で始まるかチェック
            if (!value.startsWith("nsec1")) {
                inputEl.setCustomValidity(
                    $_("loginDialog.secret_must_start_nsec1"),
                );
                inputEl.reportValidity();
                return;
            }

            // 長さのチェック
            if (value.length !== 63) {
                if (value.length < 63) {
                    inputEl.setCustomValidity(
                        $_("loginDialog.secret_too_short"),
                    );
                } else {
                    inputEl.setCustomValidity(
                        $_("loginDialog.secret_too_long"),
                    );
                }
                inputEl.reportValidity();
                return;
            }

            // PublicKeyStateの検証結果をチェック
            if (!isValid) {
                inputEl.setCustomValidity($_("loginDialog.invalid_secret"));
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
    // 新しいフォームsubmit用ハンドラ
    function handleFormSubmit(event: Event) {
        event.preventDefault();
        handleSave();
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
    {show}
    useHistory={true}
    {onClose}
    ariaLabel={$_("loginDialog.input_secret")}
    className="login-dialog"
    showFooter={true}
>
    {#snippet children()}
        <Button
            variant="default"
            shape="rounded"
            className="nostr-login-button {isLoadingNostrLogin
                ? 'loading'
                : ''}"
            onClick={handleNostrLogin}
            disabled={isLoadingNostrLogin}
        >
            {#if isLoadingNostrLogin}
                <LoadingPlaceholder
                    text={true}
                    showLoader={true}
                    customClass="nostr-login-placeholder"
                />
            {:else}
                <img
                    src="./icons/nostr-login.svg"
                    alt="nostr-login"
                    class="nostr-login-icon"
                />
                <span class="btn-text">Nostr Login</span>
            {/if}
        </Button>

        <div class="divider">
            <span>{$_("loginDialog.or")}</span>
        </div>

        <h3>{$_("loginDialog.input_secret")}</h3>
        <form onsubmit={handleFormSubmit}>
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
                title={$_("loginDialog.hint_input_secret")}
                onkeydown={(e) => {
                    if (e.key === "Enter") handleSave();
                }}
                oninput={() => {
                    // 入力時はエラーをクリアするだけ
                    if (inputEl) inputEl.setCustomValidity("");
                }}
            />

            <div class="dialog-buttons">
                <Button
                    variant="warning"
                    shape="square"
                    type="button"
                    onClick={handleClear}
                    className="clear-btn">{$_("loginDialog.clear")}</Button
                >
                <Button
                    variant="primary"
                    shape="square"
                    type="submit"
                    className="save-btn">{$_("loginDialog.save")}</Button
                >
            </div>
        </form>
    {/snippet}
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
        height: 54px;

        :global(button) {
            flex: 1;
        }
    }
    /* トースト用スタイル */
    .toast {
        position: fixed;
        top: 0px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        width: 100%;
        max-width: 500px;
        background: var(--dialog);
        color: var(--text);
        border-radius: 0 0 10px 10px;
        z-index: 101;
        font-size: 0.9375rem;
        line-height: 1.2;
        word-break: break-all;
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
        opacity: 0.9;
        padding: 8px 14px 14px 14px;
        margin-bottom: 8px;
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
        background-color: var(--btn-bg);
        border: none;
        width: 100%;
        height: 60px;
    }

    :global(.nostr-login-button.default) {
        height: 74px;
        flex-shrink: 0;
        margin-top: 26px;
        margin-bottom: 8px;
        padding: 12px 24px 12px 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        position: relative;
        overflow: hidden;
        border-radius: 8px;
        .nostr-login-icon {
            width: 34px;
            height: 34px;
            margin-right: 4px;
        }

        .btn-text {
            font-size: 1.125rem;
        }
    }

    :global(.nostr-login-button.loading) {
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
