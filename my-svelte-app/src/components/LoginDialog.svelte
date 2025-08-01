<script lang="ts">
    import { _ } from "svelte-i18n";
    import { PublicKeyState } from "../lib/keyManager";
    import Dialog from "./Dialog.svelte";

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
    {#if npubValue}
        <p class="pubkey-label">
            {$_("public_key_npub")}:
            <br />
            <span class="pubkey-value" style="word-break:break-all"
                >{npubValue}</span
            >
        </p>
    {/if}
    {#if nprofileValue}
        <p class="profilekey-label">
            {$_("public_key_nprofile")}:
            <br />
            <span class="profilekey-value" style="word-break:break-all"
                >{nprofileValue}</span
            >
        </p>
    {/if}
    {#if errorMessage}
        <p class="error-message">{$_(errorMessage)}</p>
    {/if}
    <div class="dialog-buttons">
        <button on:click={handleClose} class="cancel-btn btn"
            >{$_("cancel")}</button
        >
        <button on:click={handleClear} class="clear-btn btn"
            >{$_("clear")}</button
        >
        <button on:click={handleSave} class="save-btn btn">{$_("save")}</button>
    </div>
</Dialog>

<style>
    .dialog-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 6px;
        margin-top: 1.5rem;
        width: 100%;
        height: 50px;
    }

    .cancel-btn {
        border: 1px solid #ccc;
        background-color: #f5f5f5;
        color: #333;
        width: 100%;
    }
    /* .cancel-btn:hover {
        background-color: #e0e0e0;
    } */

    .clear-btn {
        border: 1px solid #ccc;
        background-color: #fffbe6;
        color: #333;
        width: 100%;
    }
    /* .clear-btn:hover {
        background-color: #ffe9b3;
    } */

    .save-btn {
        background-color: #646cff;
        color: white;
        border: none;
        width: 100%;
    }

    /* .save-btn:hover {
        background-color: #535bf2;
    } */

    .error-message {
        font-size: 1rem;
        color: #d32f2f;
        margin-top: 0.5rem;
    }

    .pubkey-label,
    .profilekey-label {
        align-self: flex-start;
        font-size: 0.92rem;
        margin-bottom: 0.2rem;
    }
    .pubkey-value,
    .profilekey-value {
        font-size: 0.85rem;
        color: #444;
    }

    .secret-input {
        font-family: monospace;
        font-size: 1rem;
        padding: 0.6rem;
        border: 1px solid #ccc;
        width: 100%;
        height: 50px;
        margin-top: 0.5rem;
    }
</style>
