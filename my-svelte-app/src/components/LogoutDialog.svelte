<script lang="ts">
    import { _ } from "svelte-i18n";
    import Dialog from "./Dialog.svelte";
    import Button from "./Button.svelte";

    export let show = false;
    export let onClose: () => void;
    export let onLogout: () => void;
</script>

<Dialog
    {show}
    {onClose}
    ariaLabel={$_("logout_confirmation")}
    className="logout-dialog"
>
    <h2>{$_("logout_confirmation")}</h2>
    <p>{$_("logout_warning")}</p>
    <div class="dialog-buttons">
        <Button on:click={onClose} className="cancel-btn btn"
            >{$_("cancel")}</Button
        >
        <Button on:click={onLogout} className="logout-btn btn"
            >{$_("logout")}</Button
        >
    </div>
</Dialog>

<style>
    .dialog-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin: 1.5rem 0;
        width: 100%;
        height: 50px;
    }

    :global(.cancel-btn) {
        background-color: #f5f5f5;
        border: 1px solid #ddd;
        color: #3d3d3d;
        width: 100%;
    }

    :global(.logout-btn) {
        background-color: #d32f2f;
        color: #fff;
        border: none;
        width: 100%;
    }
</style>
