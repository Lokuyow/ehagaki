<script lang="ts">
    import { onMount } from "svelte";
    import { locale, _ } from "svelte-i18n";

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

    // 言語切替用関数を追加
    function toggleLanguage() {
        locale.set($locale === "ja" ? "en" : "ja");
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
            <span>{$_("settings") || "設定"}</span>
            <button
                class="modal-close btn-round"
                on:click={onClose}
                aria-label="閉じる">&times;</button
            >
        </div>
        <div class="modal-body">
            <!-- 言語設定セクション -->
            <div class="setting-section">
                <span class="setting-label">
                    Language
                    <div class="lang-icon-label"></div>
                </span>
                <div class="setting-control">
                    <button class="lang-btn btn" on:click={toggleLanguage}>
                        <span>{$locale === "ja" ? "日本語" : "English"}</span>
                    </button>
                </div>
            </div>

            <!-- アップロード先設定セクション -->
            <div class="setting-section">
                <span class="setting-label"
                    >{$_("upload_destination") || "アップロード先"}</span
                >
                <div class="setting-control">
                    <select id="endpoint-select" bind:value={selectedEndpoint}>
                        {#each uploadEndpoints as ep}
                            <option value={ep.url}>{ep.label}</option>
                        {/each}
                    </select>
                </div>
            </div>
        </div>
        <!-- GitHub リンク追加 -->
        <div class="settings-footer">
            <a
                href="https://github.com/Lokuyow/ehagaki"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Repository"
                class="github-link"
            >
                <div class="github-icon" aria-label="GitHub"></div>
            </a>
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
        font-size: 2rem;
        cursor: pointer;
        color: #888;
        padding: 0 4px;
        line-height: 1;
    }
    .modal-body {
        padding: 16px;
        font-size: 1rem;
        color: #222;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
    .setting-section {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    .setting-label {
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .lang-icon-label {
        width: 32px;
        height: 32px;
        vertical-align: middle;
        /* SVGマスク表示に変更 */
        mask-image: url("/ehagaki/icons/language-solid.svg");
        mask-repeat: no-repeat;
        mask-size: contain;
        mask-position: center;
        background-color: var(--svg);
        display: inline-block;
    }
    .setting-control {
        display: flex;
        align-items: center;
        height: 50px;
    }
    .lang-btn {
        background: #3b3b3b;
        border: 1px solid #ddd;
        width: 120px;
    }
    .lang-btn:hover {
        background: #797979;
    }
    select {
        padding: 6px;
        border-radius: 4px;
        border: 1px solid #ddd;
        min-width: 200px;
        height: 50px;
    }
    #endpoint-select {
        font-size: 1rem;
    }
    .settings-footer {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 8px 16px 12px 16px;
        border-top: 1px solid #eee;
        margin-top: 8px;
    }
    .github-link {
        display: inline-flex;
        align-items: center;
        text-decoration: none;
    }
    .github-icon {
        width: 38px;
        height: 38px;
        mask-image: url("/ehagaki/icons/github-mark.svg");
        mask-repeat: no-repeat;
        mask-size: contain;
        mask-position: center;
        background-color: var(--svg);
        display: block;
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
