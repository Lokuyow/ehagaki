<script lang="ts">
    export let show: boolean;
    export let offlineReady: boolean;
    export let needRefresh: boolean;
    export let onReload: () => void;
    export let onClose: () => void;

    // デバッグ用のリアクティブ文
    $: {
        console.log("SwUpdateModal props:", { show, offlineReady, needRefresh });
    }
</script>

{#if show}
    <div class="pwa-toast" role="alert">
        <div class="message">
            {#if offlineReady}
                <span>アプリはオフラインで利用可能です</span>
            {:else if needRefresh}
                <span>新しいコンテンツが利用可能です。更新ボタンをクリックして更新してください。</span>
            {/if}
        </div>
        <div class="buttons">
            {#if needRefresh}
                <button class="reload-btn" on:click={onReload}>
                    更新
                </button>
            {/if}
            <button class="close-btn" on:click={onClose}>
                閉じる
            </button>
        </div>
    </div>
{/if}

<style>
    .pwa-toast {
        position: fixed;
        right: 16px;
        bottom: 88px;
        z-index: 3000;
        background: var(--bg-footer, white);
        border: 1px solid var(--border, #8885);
        border-radius: 12px;
        box-shadow: 0 4px 16px var(--shadow, rgba(0, 0, 0, 0.15));
        padding: 16px;
        max-width: 320px;
        text-align: left;
        color: var(--text, black);
    }

    .message {
        margin-bottom: 12px;
        font-size: 0.95rem;
    }

    .buttons {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
    }

    .reload-btn, .close-btn {
        border: 1px solid var(--border, #8885);
        outline: none;
        border-radius: 6px;
        padding: 6px 12px;
        cursor: pointer;
        font-size: 0.9rem;
        background: var(--bg-button, white);
        color: var(--text, black);
        transition: background-color 0.2s;
    }

    .reload-btn {
        background: var(--theme, #2b664b);
        color: white;
        border-color: var(--theme, #2b664b);
    }

    .reload-btn:hover {
        opacity: 0.9;
    }

    .close-btn:hover {
        background: var(--bg-hover, #f5f5f5);
    }
</style>
