<script lang="ts">
    import { _ } from "svelte-i18n";
    import Dialog from "./Dialog.svelte";
    import Button from "./Button.svelte";

    export let show = false;
    export let onClose: () => void;
    export let onLogout: () => void;

    function handleLogout() {
        onLogout?.();
    }
</script>

<Dialog
    bind:show
    useHistory={true}
    {onClose}
    ariaLabel={$_("logoutDialog.logout_confirmation")}
    className="logout-dialog"
    let:close
>
    <h2>{$_("logoutDialog.logout_confirmation")}</h2>
    <p>{$_("logoutDialog.logout_warning")}</p>
    <div class="dialog-buttons">
        <Button on:click={close} className="cancel-btn btn-angular"
            >{$_("logoutDialog.cancel")}</Button
        >
        <Button on:click={handleLogout} className="logout-btn btn-angular"
            >{$_("logoutDialog.logout")}</Button
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
        gap: 1rem;
        margin: 1.5rem 0;
        width: 100%;
        height: 50px;
    }

    :global(.cancel-btn) {
        --btn-bg: var(--white);
        border: 1px solid #ddd;
        color: #3d3d3d;
        width: 100%;
    }

    :global(.logout-btn) {
        --btn-bg: var(--red);
        color: #fff;
        border: none;
        width: 100%;
    }
</style>
