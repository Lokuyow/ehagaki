<script lang="ts">
    import { onMount } from "svelte";
    import { locale, _ } from "svelte-i18n";
    import Dialog from "./Dialog.svelte";
    import Button from "./Button.svelte";
    import { placeholderTextStore } from "../lib/stores";

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
    let clientTagEnabled: boolean = true;

    onMount(() => {
        // アップロード先
        const storedLocale = localStorage.getItem("locale");
        const browserLocale = navigator.language;
        const effectiveLocale =
            storedLocale ||
            (browserLocale && browserLocale.startsWith("ja") ? "ja" : "en");
        const saved = localStorage.getItem("uploadEndpoint");
        if (saved && uploadEndpoints.some((ep) => ep.url === saved)) {
            selectedEndpoint = saved;
        } else {
            selectedEndpoint = getDefaultEndpoint(effectiveLocale);
        }
        // client tag設定の初期化
        const clientTagSetting = localStorage.getItem("clientTagEnabled");
        if (clientTagSetting === null) {
            clientTagEnabled = true;
            localStorage.setItem("clientTagEnabled", "true");
        } else {
            clientTagEnabled = clientTagSetting === "true";
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

    $: localStorage.setItem(
        "clientTagEnabled",
        clientTagEnabled ? "true" : "false",
    );

    // 言語切替用関数を修正
    function toggleLanguage() {
        const newLocale = $locale === "ja" ? "en" : "ja";
        locale.set(newLocale);
        // 少し遅延させてi18nの更新を待つ
        setTimeout(() => {
            updatePlaceholderText();
        }, 100);
    }

    function updatePlaceholderText() {
        const newText = $_("enter_your_text") || "テキストを入力してください";
        placeholderTextStore.set(newText);
    }

    // 言語変更を監視してプレースホルダーを更新（初回読み込み用）
    $: if ($locale) {
        // 初期化時とロケール変更時にプレースホルダーを更新
        setTimeout(() => {
            updatePlaceholderText();
        }, 50);
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

        <!-- client tag オプトアウト設定セクション -->
        <div class="setting-section">
            <span class="setting-label">{$_("client_tag_label") || "投稿詳細にクライアント名をつける（Client tag）"}</span>
            <div class="setting-control">
                <label class="toggle-switch">
                    <input type="checkbox" bind:checked={clientTagEnabled} />
                    <span class="slider"></span>
                </label>
                <span style="margin-left:8px;">
                    {clientTagEnabled ? "ON" : "OFF"}
                </span>
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
        color: var(--text-light);
        font-weight: bold;
        font-size: 1.3rem;
        width: 100%;
        padding: 12px 16px;
        border-bottom: 1px solid var(--border-hr);
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
        border-top: 1px solid var(--border-hr);
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

    .toggle-switch {
        position: relative;
        display: inline-block;
        width: 48px;
        height: 28px;
    }
    .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: 0.2s;
        border-radius: 28px;
    }
    .toggle-switch input:checked + .slider {
        background-color: var(--theme, #4caf50);
    }
    .slider:before {
        position: absolute;
        content: "";
        height: 20px;
        width: 20px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: 0.2s;
        border-radius: 50%;
    }
    .toggle-switch input:checked + .slider:before {
        transform: translateX(20px);
    }
</style>
