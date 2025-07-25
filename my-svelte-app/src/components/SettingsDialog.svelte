<script lang="ts">
    import { onMount } from "svelte";
    import { locale, _ } from "svelte-i18n"; // ← 追加

    export let show = false;
    export let onClose: () => void;

    // アップロード先候補
    const uploadEndpoints = [
        { label: "yabu.me", url: "https://yabu.me/api/v2/media" },
        { label: "nostpic.com", url: "https://nostpic.com/api/v2/media" },
        { label: "nostrcheck.me", url: "https://nostrcheck.me/api/v2/media" },
        {
            label: "nostr.build",
            url: "https://nostr.build/api/v2/nip96/upload",
        },
    ];

    function getDefaultEndpoint(loc: string | null | undefined) {
        if (loc === "ja") return "https://yabu.me/api/v2/media";
        return "https://nostrcheck.me/api/v2/media";
    }

    let selectedEndpoint: string;

    onMount(() => {
        // ブラウザの言語設定から初期アップロードエンドポイントを設定
        const storedLocale = localStorage.getItem("locale");
        const browserLocale = navigator.language;
        const effectiveLocale =
            storedLocale ||
            (browserLocale && browserLocale.startsWith("ja") ? "ja" : "en");

        // ローカルストレージからエンドポイントを取得
        const saved = localStorage.getItem("uploadEndpoint");
        if (saved && uploadEndpoints.some((ep) => ep.url === saved)) {
            selectedEndpoint = saved;
        } else {
            // 言語設定に基づいて適切なエンドポイントを設定
            selectedEndpoint = getDefaultEndpoint(effectiveLocale);
        }
    });

    $: if ($locale) {
        const saved = localStorage.getItem("uploadEndpoint");
        if (!saved) {
            selectedEndpoint = getDefaultEndpoint($locale);
        }
    }

    $: if (selectedEndpoint) {
        localStorage.setItem("uploadEndpoint", selectedEndpoint);
    }
</script>

{#if show}
    <button
        type="button"
        class="modal-backdrop"
        aria-label="設定ダイアログを閉じる"
        on:click={onClose}
        tabindex="0"
    ></button>
    <div class="modal-dialog" role="dialog" aria-modal="true">
        <div class="modal-header">
            <span>{$_('upload_destination_settings') || 'アップロード先設定'}</span>
            <button class="modal-close" on:click={onClose} aria-label="閉じる"
                >&times;</button
            >
        </div>
        <div class="modal-body">
            <label for="endpoint-select">{$_('upload_destination') || 'アップロード先'}:</label>
            <select
                id="endpoint-select"
                bind:value={selectedEndpoint}
                style="margin-left: 8px;"
            >
                {#each uploadEndpoints as ep}
                    <option value={ep.url}>{ep.label}</option>
                {/each}
            </select>
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        inset: 0;
        background: #0006;
        z-index: 1000;
    }
    .modal-dialog {
        position: fixed;
        top: 50%;
        left: 50%;
        z-index: 1001;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 24px #0002;
        transform: translate(-50%, -50%);
        min-width: 320px;
        max-width: 90vw;
        padding: 0;
        animation: fadeIn 0.2s;
        color: #222;
    }
    .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        border-bottom: 1px solid #eee;
        font-weight: bold;
        font-size: 1.1rem;
        color: #222;
    }
    .modal-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #888;
        padding: 0 4px;
        line-height: 1;
    }
    .modal-body {
        padding: 16px;
        font-size: 1rem;
        display: flex;
        align-items: center;
        color: #222;
    }
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translate(-50%, -46%);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%);
        }
    }
</style>
