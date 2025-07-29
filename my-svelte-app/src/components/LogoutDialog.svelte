<script lang="ts">
    import { _ } from "svelte-i18n";

    export let show = false;
    export let onClose: () => void;
    export let onLogout: () => void;
</script>

{#if show}
    <div
        class="dialog-overlay"
        role="presentation"
        on:click={onClose}
        on:keydown={(e) => {
            if (e.key === "Enter" || e.key === " ") onClose();
        }}
    >
        <div
            class="dialog"
            role="dialog"
            aria-modal="true"
            tabindex="0"
            on:click|stopPropagation
            on:keydown={(e) => {
                /* Prevent propagation for keyboard events as well */
            }}
        >
            <h2>{$_("logout_confirmation")}</h2>
            <p>{$_("logout_warning")}</p>

            <div class="dialog-buttons">
                <button on:click={onClose} class="cancel-btn btn"
                    >{$_("cancel")}</button
                >
                <button on:click={onLogout} class="logout-btn btn"
                    >{$_("logout")}</button
                >
            </div>
        </div>
    </div>
{/if}

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
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        width: 90%;
        max-width: 500px;
    }

    .dialog-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
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
    .cancel-btn:hover {
        background-color: #e0e0e0;
    }

    .logout-btn {
        background-color: #d32f2f;
        color: white;
        border: none;
        width: 100%;
    }

    .logout-btn:hover {
        background-color: #b71c1c;
    }
</style>
