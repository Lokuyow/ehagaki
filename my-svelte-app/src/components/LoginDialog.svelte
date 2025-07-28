<script lang="ts">
    import { _ } from "svelte-i18n";
    import { PublicKeyState } from "../lib/keyManager";

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

<div
    class="dialog-overlay"
    role="button"
    tabindex="0"
    aria-label="Close dialog"
    on:click={handleClose}
    on:keydown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClose();
    }}
>
    <div
        class="dialog"
        role="dialog"
        aria-modal="true"
        on:click|stopPropagation
        tabindex="0"
        on:keydown={(e) => {
            if (e.key === "Escape") handleClose();
        }}
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
            <button on:click={handleClose} class="cancel-btn"
                >{$_("cancel")}</button
            >
            <button on:click={handleClear} class="clear-btn"
                >{$_("clear")}</button
            >
            <button on:click={handleSave} class="save-btn">{$_("save")}</button>
        </div>
    </div>
</div>

<style>
    .dialog-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 100;
    }

    .dialog {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: white;
        color: #222;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        width: 90%;
        max-width: 500px;
    }
    .dialog-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 6px;
        margin-top: 1.5rem;
        width: 100%;
    }

    .cancel-btn {
        padding: 0.6rem 1.2rem;
        border: 1px solid #ccc;
        background-color: #f5f5f5;
        color: #333;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s;
        width: 100%;
        height: 60px;
    }
    .cancel-btn:hover {
        background-color: #e0e0e0;
    }

    .clear-btn {
        padding: 0.6rem 1.2rem;
        border: 1px solid #ccc;
        background-color: #fffbe6;
        color: #333;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s;
        width: 100%;
        height: 60px;
    }
    .clear-btn:hover {
        background-color: #ffe9b3;
    }

    .save-btn {
        padding: 0.6rem 1.2rem;
        background-color: #646cff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        width: 100%;
        height: 60px;
    }

    .save-btn:hover {
        background-color: #535bf2;
    }

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
        border-radius: 4px;
        width: 100%;
        height: 60px;
        box-sizing: border-box;
        margin-top: 0.5rem;
    }
</style>
