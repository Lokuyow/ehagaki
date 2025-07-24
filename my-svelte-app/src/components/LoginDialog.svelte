<script lang="ts">
    import { _ } from "svelte-i18n";

    export let secretKey: string;
    export let publicKeyNpub: string = "";
    export let publicKeyNprofile: string = "";
    export let errorMessage: string = "";
    export let onClose: () => void;
    export let onSave: () => void;

    function handleClose() {
        onClose?.();
    }
    function handleSave() {
        onSave?.();
    }
</script>

<div class="dialog-overlay">
    <div class="dialog">
        <h2>{$_("input_secret")}</h2>
        <p>{$_("input_nostr_secret")}</p>
        <input
            type="password"
            bind:value={secretKey}
            placeholder="nsec1~"
            class="secret-input"
        />
        {#if publicKeyNpub}
            <p>
                公開鍵(npub): <span style="word-break:break-all"
                    >{publicKeyNpub}</span
                >
            </p>
        {/if}
        {#if publicKeyNprofile}
            <p>
                公開鍵(nprofile): <span style="word-break:break-all"
                    >{publicKeyNprofile}</span
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
        background-color: white;
        color: #222;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        width: 90%;
        max-width: 500px;
    }

    .secret-input {
        width: 100%;
        padding: 0.8rem;
        margin: 1rem 0;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 1rem;
    }

    .dialog-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 1.5rem;
    }

    .cancel-btn {
        padding: 0.6rem 1.2rem;
        border: 1px solid #ccc;
        background-color: #f5f5f5;
        color: #333;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s;
    }
    .cancel-btn:hover {
        background-color: #e0e0e0;
    }

    .save-btn {
        padding: 0.6rem 1.2rem;
        background-color: #646cff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .save-btn:hover {
        background-color: #535bf2;
    }

    .error-message {
        color: #d32f2f;
        font-size: 0.9rem;
        margin-top: 0.5rem;
    }
</style>
