<script lang="ts">
    import { _ } from "svelte-i18n";
    import { Dialog } from "bits-ui";
    import { PublicKeyState } from "../lib/keyManager.svelte";
    import { BUNKER_REGEX } from "../lib/nip46Service";
    import Button from "./Button.svelte";
    import DialogWrapper from "./DialogWrapper.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import { useDialogHistory } from "../lib/hooks/useDialogHistory.svelte";

    interface Props {
        show: boolean;
        secretKey: string;
        onClose: () => void;
        onSave: () => void;
        onNip07Login: () => void;
        onNip46Login: (bunkerUrl: string) => Promise<string | undefined>;
        isNip07ExtensionAvailable?: boolean;
        isLoadingNip07?: boolean;
        isLoadingNip46?: boolean;
    }

    let {
        show = $bindable(false),
        secretKey = $bindable(),
        onClose,
        onSave,
        onNip07Login,
        onNip46Login,
        isNip07ExtensionAvailable = false,
        isLoadingNip07 = false,
        isLoadingNip46 = false,
    }: Props = $props();

    // ダイアログを閉じるハンドラ
    function handleClose() {
        show = false;
        onClose?.();
    }

    // ブラウザ履歴統合
    useDialogHistory(() => show, handleClose, true);

    // --- NIP-07拡張機能の利用可能状態（App.svelteからpropとして受取）
    let isNip07Available = $derived(isNip07ExtensionAvailable);

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

    // --- 公開鍵状態を $derived で直接参照（svelte/store subscribe パターンを廃止）---
    let isValid = $derived(publicKeyState.isValid);
    let npubValue = $derived(publicKeyState.npub);
    let nprofileValue = $derived(publicKeyState.nprofile);

    // --- UIイベントハンドラ ---
    function handleSave() {
        if (inputEl) {
            const validity = inputEl.validity;
            const value = inputEl.value ?? "";

            // バリデーションはsave時のみ
            if (validity.valueMissing) {
                inputEl.setCustomValidity(
                    $_("loginDialog.secret_key_required"),
                );
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
    function handleNip07Login() {
        onNip07Login?.();
    }

    // --- NIP-46 bunker URL ---
    let bunkerUrl = $state("");
    let bunkerInputEl: HTMLInputElement | null = $state(null);

    async function handleNip46Login() {
        if (bunkerInputEl) {
            const trimmed = bunkerInputEl.value.trim();
            bunkerUrl = trimmed;

            if (bunkerInputEl.validity.valueMissing) {
                bunkerInputEl.setCustomValidity(
                    $_("loginDialog.bunker_url_required"),
                );
                bunkerInputEl.reportValidity();
                return;
            }

            if (bunkerInputEl.validity.patternMismatch) {
                bunkerInputEl.setCustomValidity(
                    $_("loginDialog.bunker_invalid"),
                );
                bunkerInputEl.reportValidity();
                return;
            }

            bunkerInputEl.setCustomValidity("");
        }

        const trimmed = bunkerUrl.trim();
        const errorMsg = await onNip46Login?.(trimmed);
        if (errorMsg && bunkerInputEl) {
            const localizedMessage =
                errorMsg === "Invalid bunker URL"
                    ? $_("loginDialog.bunker_invalid")
                    : errorMsg;
            bunkerInputEl.setCustomValidity(localizedMessage);
            bunkerInputEl.reportValidity();
            return;
        }
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

<DialogWrapper
    bind:open={show}
    onOpenChange={(open) => !open && handleClose()}
    title={$_("loginDialog.input_secret")}
    description={$_("loginDialog.hint_input_secret")}
    contentClass="login-dialog"
    footerVariant="close-button"
>
    <Button
        variant="primary"
        shape="rounded"
        className="nip07-login-button u-control {isLoadingNip07
            ? 'loading'
            : ''}"
        onClick={handleNip07Login}
        disabled={isLoadingNip07 || !isNip07Available}
    >
        {#if isLoadingNip07}
            <LoadingPlaceholder
                text={true}
                showLoader={true}
                customClass="nip07-login-placeholder"
            />
        {:else}
            <div class="extension-icon svg-icon"></div>
            <span class="btn-text"
                >{$_("loginDialog.login_with_extension")}</span
            >
        {/if}
    </Button>

    <div class="divider">
        <span>or</span>
    </div>

    <div class="bunker-section">
        <div class="bunker-heading-row">
            <div class="vault-icon svg-icon" aria-hidden="true"></div>
            <h3>{$_("loginDialog.bunker_input_title")}</h3>
        </div>
        <div class="bunker-input-row">
            <input
                type="password"
                bind:value={bunkerUrl}
                placeholder="bunker://..."
                class="bunker-input u-control"
                required
                pattern={BUNKER_REGEX.source}
                bind:this={bunkerInputEl}
                disabled={isLoadingNip46}
                oninput={() => {
                    if (bunkerInputEl) bunkerInputEl.setCustomValidity("");
                }}
            />
            <Button
                variant="primary"
                shape="square"
                onClick={handleNip46Login}
                disabled={isLoadingNip46}
                className="bunker-connect-btn u-control {isLoadingNip46
                    ? 'loading'
                    : ''}"
            >
                {#if isLoadingNip46}
                    <LoadingPlaceholder
                        text={true}
                        showLoader={true}
                        customClass="bunker-connect-placeholder"
                    />
                {:else}
                    {$_("loginDialog.bunker_connect")}
                {/if}
            </Button>
        </div>
    </div>

    <div class="divider">
        <span>or</span>
    </div>

    <div class="secret-key-section">
        <div class="secret-heading-row">
            <div class="secret-icon svg-icon"></div>
            <h3>{$_("loginDialog.input_secret")}</h3>
        </div>

        <form novalidate onsubmit={handleFormSubmit}>
            <input
                type="text"
                name="username"
                autocomplete="username"
                style="display: none;"
                aria-hidden="true"
            />
            <div class="secret-input-row">
                <input
                    type="password"
                    bind:value={secretKey}
                    placeholder="nsec1..."
                    class="secret-input u-control"
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

                <Button
                    variant="primary"
                    shape="square"
                    type="submit"
                    className="save-btn u-control"
                >
                    {$_("loginDialog.save")}
                </Button>
            </div>
        </form>
    </div>

    {#snippet footer()}
        <Dialog.Close>
            {#snippet child({ props })}
                <Button
                    {...props}
                    className="modal-close"
                    variant="default"
                    shape="square"
                    ariaLabel="閉じる"
                >
                    <div class="xmark-icon svg-icon" aria-label="閉じる"></div>
                </Button>
            {/snippet}
        </Dialog.Close>
    {/snippet}
</DialogWrapper>

<style>
    .xmark-icon {
        mask-image: url("/icons/xmark-solid-full.svg");
    }

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
        flex: 1;
    }

    /* NIP-07拡張機能ログインボタン */
    .svg-icon.extension-icon {
        mask-image: url("/icons/puzzle-piece-solid-full.svg");
        width: 32px;
        height: 32px;
    }

    /* 秘密鍵入力のアイコンとレイアウト */
    .secret-input-row {
        display: flex;
        gap: 8px;
        width: 100%;
        align-items: center;
    }

    .secret-heading-row {
        display: flex;
        gap: 6px;
        justify-content: center;
        align-items: center;
        width: 100%;
        margin: 0 0 8px 0;
    }

    .secret-heading-row h3 {
        margin: 0;
    }

    .bunker-heading-row {
        display: flex;
        gap: 6px;
        align-items: center;
        justify-content: center;
        width: 100%;
        margin: 0 0 8px 0;
    }

    .bunker-heading-row h3 {
        margin: 0;
    }

    .secret-icon {
        mask-image: url("/icons/key-solid-full.svg");
        width: 28px;
        height: 28px;
        flex: 0 0 28px;
        display: inline-block;
        vertical-align: middle;
    }

    :global(.nip07-login-button.primary) {
        height: 70px;
        flex-shrink: 0;
        margin-top: 26px;
        margin-bottom: 8px;
        position: relative;
        overflow: hidden;
        border-radius: 8px;

        .btn-text {
            font-size: 1.125rem;
        }
    }

    :global(.nip07-login-button.loading) {
        cursor: not-allowed;
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

    /* NIP-46 bunker URL入力 */
    .bunker-section,
    .secret-key-section {
        width: 100%;
        min-height: 54px;
    }

    .bunker-input-row {
        display: flex;
        gap: 8px;
        width: 100%;
    }

    .bunker-input {
        font-family: monospace;
        font-size: 0.875rem;
        padding: 0.6rem;
        background-color: var(--btn-bg);
        border: none;
        flex: 1;
        min-width: 0;
    }

    :global(button.primary.square.bunker-connect-btn) {
        flex-shrink: 0;
        padding: 12px 18px 12px 16px;
    }

    .vault-icon {
        mask-image: url("/icons/vault-solid-full.svg");
        width: 30px;
        height: 30px;
        padding: 12px 18px 12px 16px;
        display: inline-block;
        vertical-align: middle;
    }

    /* 共通コントロール高さ 54px */
    :global(input.u-control, button.u-control) {
        height: 54px;
        min-height: 54px;
        min-width: 120px;
        display: inline-flex;
        align-items: center;
        box-sizing: border-box;
    }
</style>
