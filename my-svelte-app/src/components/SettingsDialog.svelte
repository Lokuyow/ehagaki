<script lang="ts">
    import { onMount } from "svelte";
    import { locale, _ } from "svelte-i18n";
    import Dialog from "./Dialog.svelte";
    import Button from "./Button.svelte";

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

<Dialog
    {show}
    {onClose}
    ariaLabel={$_("settings") || "設定"}
    className="settings-dialog"
>
    <div class="modal-header">
        <span>{$_("settings") || "設定"}</span>
        <Button
            className="modal-close btn-circle"
            on:click={onClose}
            ariaLabel="閉じる"
        >
            <div class="xmark-icon svg-icon" aria-label="閉じる"></div>
        </Button>
    </div>
    <div class="modal-body">
        <!-- 言語設定セクション -->
        <div class="setting-section">
            <span class="setting-label"> Language/言語 </span>
            <div class="setting-control">
                <Button className="lang-btn btn" on:click={toggleLanguage}>
                    <div
                        class="lang-icon-btn svg-icon"
                        aria-label="Language"
                    ></div>
                </Button>
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
    <div class="settings-footer">
        <a
            href="https://github.com/Lokuyow/ehagaki"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            class="github-link"
        >
            <div class="github-icon svg-icon" aria-label="GitHub"></div>
        </a>
    </div>
</Dialog>

<style>
    :global(.dialog.settings-dialog) {
        padding: 0;
    }
    .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        border-bottom: 1px solid var(--hr-border);
        font-weight: bold;
        font-size: 1.1rem;
        width: 100%;
    }
    :global(.modal-close) {
        background: none;
        border: none;
        padding: 0 4px;
        line-height: 1;
    }
    .xmark-icon {
        mask-image: url("/ehagaki/icons/xmark-solid-full.svg");
    }
    .modal-body {
        padding: 16px;
        font-size: 1rem;
        display: flex;
        flex-direction: column;
        gap: 16px;
        width: 100%;
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

    .setting-control {
        display: flex;
        align-items: center;
        height: 50px;
    }
    :global(.lang-btn) {
        width: 100px;
    }

    .lang-icon-btn {
        width: 32px;
        height: 32px;
        mask-image: url("/ehagaki/icons/language-solid-full.svg");
    }

    select {
        padding: 6px;
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
        border-top: 1px solid var(--hr-border);
        margin-top: 8px;
        width: 100%;
    }
    .github-link {
        display: inline-flex;
        align-items: center;
        text-decoration: none;
    }
    .github-icon {
        mask-image: url("/ehagaki/icons/github-mark.svg");
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
