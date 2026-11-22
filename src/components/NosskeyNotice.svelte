<script lang="ts">
    import { _ } from "svelte-i18n";
    import Button from "./Button.svelte";
    import { nosskey } from "../lib/nosskeyService.svelte";

    interface Props {
        onReconnect?: () => void;
        reconnecting?: boolean;
    }

    let { onReconnect, reconnecting = false }: Props = $props();

    const accountHelpNotices = ["no_key", "identity_mismatch", "signing_failed", "passkey_failed", "passkey_prf_unavailable"];
</script>

{#if nosskey.state.notice && !nosskey.state.visible}
    <div class="nosskey-notice-box" role="alert">
        <p class="nosskey-notice-message">{$_(`nosskey.${nosskey.state.notice}`)}</p>
        <div class="nosskey-notice-actions">
            {#if accountHelpNotices.includes(nosskey.state.notice)}
                <a class="nosskey-notice-link" href="https://nosskey.app/" target="_blank" rel="noopener noreferrer">
                    <span>{$_("nosskey.open_site")}</span>
                    <span class="open-icon svg-icon" aria-hidden="true"></span>
                </a>
            {/if}
            {#if nosskey.state.notice === "identity_mismatch" && onReconnect}
                <Button variant="primary" shape="rounded" className="nosskey-notice-button"
                    disabled={reconnecting} onClick={onReconnect}>{$_("nosskey.reconnect")}</Button>
            {/if}
            <Button variant="secondary" shape="rounded" className="nosskey-notice-button"
                onClick={nosskey.clearNotice}>{$_("global.close")}</Button>
        </div>
    </div>
{/if}

<style>
    .nosskey-notice-box {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px 12px;
        width: 100%;
        padding: 10px 12px;
        box-sizing: border-box;
        border-radius: 8px;
        background: var(--balloon-error-bg, hsl(351, 99%, 96%));
        border: 1px solid var(--balloon-error-border, hsl(351, 99%, 70%));
        color: var(--balloon-error-color, hsl(351, 99%, 32%));
    }

    .nosskey-notice-message {
        flex: 1 1 220px;
        min-width: 0;
        margin: 0;
        font-size: 0.95rem;
        line-height: 1.5;
        overflow-wrap: anywhere;
    }

    .nosskey-notice-actions {
        flex: 1 0 auto;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
    }

    .nosskey-notice-link {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        min-height: 40px;
        margin-inline-end: auto;
        color: inherit;
        font-weight: 600;
        text-decoration: underline;
        text-underline-offset: 2px;
    }

    .open-icon {
        --icon-size: 18px;
        background-color: currentColor;
        mask-image: url("/icons/open_in_new_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    :global(.nosskey-notice-actions .nosskey-notice-button) {
        min-height: 40px;
        padding: 4px 14px;
        font-size: 0.95rem;
    }
</style>
