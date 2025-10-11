<script lang="ts">
    import { _ } from "svelte-i18n";
    import Dialog from "./Dialog.svelte";
    import Button from "./Button.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte"; // 追加: LoadingPlaceholderのインポート

    interface Props {
        show: boolean;
        onClose: () => void;
        onLogout: () => void;
        isLoggingOut?: boolean; // 追加: ログアウト中の状態
    }

    let { show, onClose, onLogout, isLoggingOut = false }: Props = $props(); // 追加: isLoggingOutのデフォルト値

    function handleLogout() {
        onLogout?.();
    }
</script>

<Dialog
    {show}
    useHistory={true}
    {onClose}
    ariaLabel={$_("logoutDialog.logout_confirmation")}
    className="logout-dialog"
>
    {#snippet children({ close })}
        <h2>{$_("logoutDialog.logout_confirmation")}</h2>
        <p>{$_("logoutDialog.logout_warning")}</p>
        <div class="dialog-buttons">
            <Button
                onClick={handleLogout}
                className="logout-btn {isLoggingOut ? 'loading' : ''}"
                variant="danger"
                shape="square"
                disabled={isLoggingOut}
            >
                {#if isLoggingOut}
                    <LoadingPlaceholder text={true} showLoader={true} />
                {:else}
                    {$_("logoutDialog.logout")}
                {/if}
            </Button>
            <Button
                onClick={close}
                className="cancel-btn"
                variant="secondary"
                shape="square"
                disabled={isLoggingOut}>{$_("logoutDialog.cancel")}</Button
            >
        </div>
    {/snippet}
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

            :global(.square) {
                background-color: whitesmoke;
            }
        }
    }
</style>
