<script lang="ts">
    import { _ } from "svelte-i18n";
    import { PublicKeyState } from "../lib/keyManager";
    import Dialog from "./Dialog.svelte";
    import Button from "./Button.svelte";

    export let secretKey: string;
    export let errorMessage: string = "";
    export let onClose: () => void;
    export let onSave: () => void;

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
</script>

<Dialog
    show={true}
    {onClose}
    ariaLabel={$_("input_secret")}
    className="login-dialog"
>
    <h2>{$_("input_secret")}</h2>
    <p>{$_("input_nostr_secret")}</p>
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
        <Button on:click={handleClose} className="cancel-btn btn"
            >{$_("cancel")}</Button
        >
        <Button on:click={handleClear} className="clear-btn btn"
            >{$_("clear")}</Button
        >
        <Button on:click={handleSave} className="save-btn btn"
            >{$_("save")}</Button
        >
    </div>
</Dialog>

<style>
    h2 {
        color: var(--text-light);
    }
    .dialog-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 6px;
        width: 100%;
        height: 50px;
    }

    :global(.cancel-btn) {
        border: 1px solid #ccc;
        background-color: #f5f5f5;
        color: #3D3D3D;
        width: 100%;
    }

    :global(.clear-btn) {
        border: 1px solid #ccc;
        background-color: #fffbe6;
        color: #3D3D3D;
        width: 100%;
    }

    :global(.save-btn) {
        background-color: #646cff;
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
        margin-top: 0.5rem;
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
</style>
