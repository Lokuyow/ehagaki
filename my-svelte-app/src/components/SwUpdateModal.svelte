<script lang="ts">
    import Button from "./Button.svelte";
    export let show: boolean;
    export let needRefresh: boolean;
    export let onReload: () => void;
    export let onClose: () => void;

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
                <span
                    >新しいコンテンツが利用可能です。更新ボタンをクリックして更新してください。</span
                >
            {/if}
        </div>
        <div class="buttons">
            <Button className="close-btn" on:click={onClose} ariaLabel="閉じる">
                閉じる
            </Button>
            {#if needRefresh}
                <Button
                    className="reload-btn"
                    on:click={onReload}
                    ariaLabel="更新"
                >
                    更新
                </Button>
            {/if}
        </div>
    </div>
{/if}

<style>
    .pwa-toast {
        position: fixed;
        right: 16px;
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
        font-size: 0.95rem;
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
        padding: 6px 12px;
        font-size: 0.9rem;
        width: 110px;
    }

    :global(.reload-btn) {
        --btn-bg: var(--theme);
        color: white;
    }
</style>
