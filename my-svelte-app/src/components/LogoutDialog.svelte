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
        <Button
            on:click={handleLogout}
            className="logout-btn"
            variant="danger"
            shape="square">{$_("logoutDialog.logout")}</Button
        >
        <Button
            on:click={close}
            className="cancel-btn"
            variant="secondary"
            shape="square">{$_("logoutDialog.cancel")}</Button
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
        gap: 12px;
        margin: 1.5rem 0;
        width: 100%;
        height: 50px;

        :global(button) {
            flex: 1;
        }
    }
</style>
