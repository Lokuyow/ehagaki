<script lang="ts">
    import { _ } from "svelte-i18n";
    import Dialog from "./Dialog.svelte";
    import Button from "./Button.svelte";

    interface Props {
        show?: boolean;
        onClose: () => void;
    }

    let { show = false, onClose }: Props = $props();
</script>

<Dialog
    {show}
    {onClose}
    ariaLabel={$_("welcomeDialog.title")}
    showFooter={true}
    className="welcome-dialog"
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
        <Button
            variant="primary"
            shape="square"
            onClick={onClose}
            className="get-started-btn"
        >
            {$_("welcomeDialog.get_started")}
        </Button>
    {/snippet}
</Dialog>

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

    :global(.welcome-dialog) {
        :global(.dialog-footer) {
            height: 58px;
            border: none;
        }

        :global(.get-started-btn) {
            width: 100%;
            font-size: 1.0625rem;
            &:active {
                transform: scale(1);
            }
        }
    }
</style>
