<script lang="ts">
    export let show: boolean;
    export let onReload: () => void;
    export let onCancel: () => void;
</script>

{#if show}
    <div class="sw-update-modal">
        <div class="sw-update-modal-content">
            <p>新しいバージョンが利用可能です。リロードしますか？</p>
            <div class="sw-update-modal-actions">
                <button class="sw-update-reload-btn" on:click={onReload}
                    >リロード</button
                >
                <button class="sw-update-cancel-btn" on:click={onCancel}
                    >キャンセル</button
                >
            </div>
        </div>
    </div>
{/if}

<style>
    .sw-update-modal {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2000;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: flex-end;
        pointer-events: auto;
    }
    .sw-update-modal-content {
        background: #fff;
        border-radius: 12px 12px 0 0;
        box-shadow: 0 -2px 16px #0003;
        padding: 24px 16px 16px 16px;
        width: 100%;
        max-width: 400px;
        margin-bottom: 0;
        text-align: center;
    }
    .sw-update-modal-actions {
        display: flex;
        justify-content: center;
        gap: 16px;
        margin-top: 16px;
    }
    .sw-update-reload-btn,
    .sw-update-cancel-btn {
        padding: 8px 24px;
        border-radius: 6px;
        border: none;
        font-size: 1rem;
        cursor: pointer;
        box-shadow: 0 1px 4px #0001;
        transition: background 0.2s;
    }
    .sw-update-reload-btn {
        background: #1976d2;
        color: #fff;
    }
    .sw-update-reload-btn:hover {
        background: #1565c0;
    }
    .sw-update-cancel-btn {
        background: #eee;
        color: #333;
    }
    .sw-update-cancel-btn:hover {
        background: #ddd;
    }
</style>
