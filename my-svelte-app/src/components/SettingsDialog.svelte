<script lang="ts">
    import { onMount } from "svelte";
    import { locale, _ } from "svelte-i18n";
    import Dialog from "./Dialog.svelte";
    import Button from "./Button.svelte";
    import { createEventDispatcher } from "svelte";

    export let show = false;
    export let onClose: () => void;

    const dispatch = createEventDispatcher();

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

    // 言語切替用関数をシンプル化
    function toggleLanguage() {
        const newLocale = $locale === "ja" ? "en" : "ja";
        locale.set(newLocale);
        // プレースホルダー更新はApp.svelteで行う
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
                    <span class="btn-text">{$_("change") || "変更"}</span>
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
            <span class="setting-label"
                >{$_("client_tag_label") ||
                    "投稿詳細にクライアント名をつける（Client tag）"}</span
            >
            <div class="setting-control">
                <label class="toggle-switch" for="client-tag-toggle">
                    <input
                        id="client-tag-toggle"
                        type="checkbox"
                        bind:checked={clientTagEnabled}
                    />
                    <span class="slider"></span>
                </label>
            </div>
        </div>

        <!-- リレー・プロフィール再取得セクション -->
        <div class="setting-section">
            <span class="setting-label"
                >{$_("refresh_relays_and_profile") ||
                    "リレーリスト・プロフィール再取得"}</span
            >
            <div class="setting-control">
                <Button
                    className="btn refresh-relays-profile-btn"
                    on:click={() => dispatch("refreshRelaysAndProfile")}
                    ariaLabel={$_("refresh_relays_and_profile") || "再取得"}
                >
                    <div
                        class="rotate-right-icon svg-icon"
                        aria-label="再取得"
                    ></div>
                    <span class="btn-text">{$_("refresh") || "更新"}</span>
                </Button>
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
        gap: 20px;
        width: 100%;
    }
    .setting-section {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    .setting-label {
        font-size: 1.1rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .setting-control {
        display: flex;
        align-items: center;
        height: fit-content;
        padding-left: 10px;
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

    .rotate-right-icon {
        mask-image: url("/ehagaki/icons/rotate-right-solid-full.svg");
    }

    .toggle-switch {
        position: relative;
        display: inline-block;
        width: 90px;
        height: 50px;
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
        background-color: #bbb;
        transition: 0.2s;
        border-radius: 50px;
    }
    .toggle-switch input:checked + .slider {
        background-color: var(--theme, #4caf50);
    }
    .slider:before {
        position: absolute;
        content: "";
        height: 40px;
        width: 40px;
        left: 5px;
        bottom: 5px;
        background-color: white;
        transition: 0.2s;
        border-radius: 50%;
    }
    .toggle-switch input:checked + .slider:before {
        transform: translateX(40px);
    }
</style>
