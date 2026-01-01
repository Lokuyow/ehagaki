<script lang="ts">
    import { _ } from "svelte-i18n";
    import { Dialog } from "bits-ui";
    import Button from "./Button.svelte";
    import DialogWrapper from "./DialogWrapper.svelte";
    import { useDialogHistory } from "../lib/hooks/useDialogHistory.svelte";

    interface Props {
        show?: boolean;
        onClose: () => void;
    }

    let { show = $bindable(false), onClose }: Props = $props();

    // ダイアログを閉じるハンドラ
    function handleClose() {
        show = false;
        onClose?.();
    }

    // ブラウザ履歴統合
    useDialogHistory(() => show, handleClose, true);
</script>

<DialogWrapper
    bind:open={show}
    onOpenChange={(open) => !open && handleClose()}
    title={$_("welcomeDialog.title")}
    description={$_("welcomeDialog.description")}
    contentClass="welcome-dialog"
>
    <div class="welcome-content">
        <div class="title-section">
            <img
                src="./ehagaki_icon.svg"
                alt="ehagaki icon"
                class="site-icon"
            />
            <h2>{$_("welcomeDialog.title")}</h2>
        </div>
        <p>{$_("welcomeDialog.description")}</p>
        <pre class="features">{$_("welcomeDialog.features")}</pre>
    </div>

    {#snippet footer()}
        <Dialog.Close>
            {#snippet child({ props })}
                <Button
                    {...props}
                    variant="primary"
                    shape="square"
                    className="get-started-btn"
                >
                    {$_("welcomeDialog.get_started")}
                </Button>
            {/snippet}
        </Dialog.Close>
    {/snippet}
</DialogWrapper>

<style>
    .welcome-content {
        text-align: center;
    }

    .title-section {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin: 20px 0 38px 0;
    }

    .site-icon {
        width: 38px;
        height: 38px;
    }

    h2 {
        color: var(--text-light);
        margin-bottom: 1rem;
        margin: 0;
    }

    p {
        font-size: 1.0625rem;
        margin-bottom: 1.5rem;
        line-height: 1.6;
        word-break: auto-phrase;
    }

    .features {
        text-align: left;
        white-space: pre-line;
        padding: 8px;
        border-radius: 8px;
        margin-bottom: 1rem;
        line-height: 1.6;
    }

    :global(.welcome-dialog .get-started-btn) {
        width: 100%;
        font-size: 1.0625rem;
    }

    :global(.welcome-dialog .get-started-btn:active) {
        transform: scale(1);
    }
</style>
