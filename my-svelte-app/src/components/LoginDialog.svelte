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
            placeholder="nsec1~"
            class="secret-input"
        />
        {#if publicKeyNpub}
            <p class="pubkey-label">
                {$_("public_key_npub")}:
                <br>
                <span class="pubkey-value" style="word-break:break-all">{publicKeyNpub}</span>
            </p>
        {/if}
        {#if publicKeyNprofile}
            <p class="profilekey-label">
                {$_("public_key_nprofile")}:
                <br>
                <span class="profilekey-value" style="word-break:break-all">{publicKeyNprofile}</span>
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

    .pubkey-label,
    .profilekey-label {
        font-size: 0.92rem;
        margin-bottom: 0.2rem;
    }
    .pubkey-value,
    .profilekey-value {
        font-size: 0.85rem;
        color: #444;
    }
</style>
