<script lang="ts">
    import Button from "./Button.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import { t } from "svelte-i18n";
    export let show: boolean;
    export let needRefresh: boolean;
    export let onReload: () => void;
    export let onClose: () => void;

    let isReloading = false;

    function handleReload() {
        isReloading = true;
        onReload();
    }

    // デバッグ用のリアクティブ文
    $: {
        console.log("SwUpdateModal props:", {
            show,
            needRefresh,
        });
    }
</script>

{#if show}
    <div class="pwa-toast" role="alert">
        <div class="message">
            {#if needRefresh}
                <span>{$t("new_version_found")}</span>
            {/if}
        </div>
        <div class="buttons">
            <Button
                className="close-btn"
                on:click={onClose}
                ariaLabel={$t("close")}
            >
                {$t("close")}
            </Button>
            {#if needRefresh}
                <Button
                    className="reload-btn"
                    on:click={handleReload}
                    ariaLabel={$t("refresh")}
                >
                    {#if isReloading}
                        <LoadingPlaceholder
                            showSpinner={true}
                            showImage={false}
                            text=""
                            customClass="reload-btn-loading"
                        />
                    {:else}
                        {$t("refresh")}
                    {/if}
                </Button>
            {/if}
        </div>
    </div>
{/if}

<style>
    .pwa-toast {
        position: fixed;
        right: 12px;
        bottom: 70px;
        z-index: 3000;
        background: var(--bg-translucent);
        border-radius: 12px;
        padding: 16px;
        max-width: 320px;
        text-align: left;
        color: var(--text);
        opacity: 0.9;
    }

    .message {
        margin-bottom: 12px;
        font-size: 1rem;
    }

    .buttons {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
        height: 46px;
    }

    :global(.reload-btn),
    :global(.close-btn) {
        outline: none;
        border-radius: 6px;
        font-size: 0.9rem;
        width: 110px;
    }

    :global(.reload-btn) {
        --btn-bg: var(--theme);
        color: white;
    }

    :global(.reload-btn-loading.loading-placeholder) {
        gap: 6px;

        :global(.loading-spinner) {
            width: 16px;
            height: 16px;
        }

        :global(.placeholder-text) {
            font-size: 0.8rem;
            color: hsl(0, 0%, 90%);
        }
    }
</style>
