<script lang="ts">
    import { onMount } from "svelte";
    import { locale, _ } from "svelte-i18n";
    import Dialog from "./Dialog.svelte";
    import Button from "./Button.svelte";
    import {
        authState,
        relayListUpdatedStore,
        swVersionStore,
        fetchSwVersion,
        swNeedRefresh,
        handleSwUpdate,
    } from "../lib/stores";
    import { get } from "svelte/store";
    import { uploadEndpoints, getCompressionLevels } from "../lib/constants";

    export let show = false;
    export let onClose: () => void;
    export let onRefreshRelaysAndProfile: () => void = () => {};

    // 圧縮設定候補（$locale変更時にラベルも更新）
    $: compressionLevels = getCompressionLevels($_);

    let selectedEndpoint: string;
    let clientTagEnabled = true;
    let selectedCompression: string;

    // swVersion from store
    let swVersion: string | null = null;
    swVersionStore.subscribe((v) => (swVersion = v));

    // SW更新状態
    let isUpdating = false;

    function handleSwRefresh() {
        isUpdating = true;
        handleSwUpdate();
        // ページがリロードされるまで少し待つ
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    // 投稿先リレー表示用
    let writeRelays: string[] = [];
    let showRelays = false;

    function getDefaultEndpoint(loc: string | null | undefined) {
        return loc === "ja"
            ? "https://yabu.me/api/v2/media"
            : "https://nostrcheck.me/api/v2/media";
    }

    function loadWriteRelays() {
        const pubkeyHex = get(authState).pubkey;
        if (!pubkeyHex) {
            writeRelays = [];
            return;
        }
        const relayKey = `nostr-relays-${pubkeyHex}`;
        try {
            const relays = JSON.parse(localStorage.getItem(relayKey) ?? "null");
            if (Array.isArray(relays)) {
                writeRelays = relays;
            } else if (relays && typeof relays === "object") {
                writeRelays = Object.entries(relays)
                    .filter(
                        ([, conf]) =>
                            conf &&
                            typeof conf === "object" &&
                            "write" in conf &&
                            (conf as { write?: boolean }).write,
                    )
                    .map(([url]) => url);
            } else {
                writeRelays = [];
            }
        } catch {
            writeRelays = [];
        }
    }

    onMount(() => {
        // アップロード先
        const storedLocale = localStorage.getItem("locale");
        const browserLocale = navigator.language;
        const effectiveLocale =
            storedLocale ||
            (browserLocale && browserLocale.startsWith("ja") ? "ja" : "en");
        const saved = localStorage.getItem("uploadEndpoint");
        selectedEndpoint =
            saved && uploadEndpoints.some((ep) => ep.url === saved)
                ? saved
                : getDefaultEndpoint(effectiveLocale);

        // client tag設定の初期化
        const clientTagSetting = localStorage.getItem("clientTagEnabled");
        clientTagEnabled =
            clientTagSetting === null ? true : clientTagSetting === "true";
        if (clientTagSetting === null) {
            localStorage.setItem("clientTagEnabled", "true");
        }

        // 圧縮設定の初期化
        selectedCompression =
            localStorage.getItem("imageCompressionLevel") || "medium";

        loadWriteRelays();
        fetchSwVersion();
    });

    // showがtrueのたびにリレーリストを再取得
    $: if (show) loadWriteRelays();

    // showがfalseになったらリレーリストの折り畳みも閉じる
    $: if (!show) showRelays = false;

    // $locale変更時、保存がなければデフォルトエンドポイントを再設定
    $: if ($locale && !localStorage.getItem("uploadEndpoint")) {
        selectedEndpoint = getDefaultEndpoint($locale);
    }

    // 設定変更時にlocalStorageへ保存
    $: selectedEndpoint &&
        localStorage.setItem("uploadEndpoint", selectedEndpoint);
    $: localStorage.setItem(
        "clientTagEnabled",
        clientTagEnabled ? "true" : "false",
    );
    $: selectedCompression &&
        localStorage.setItem("imageCompressionLevel", selectedCompression);

    function toggleLanguage() {
        locale.set($locale === "ja" ? "en" : "ja");
    }

    function onRelaysUpdated() {
        loadWriteRelays();
    }

    relayListUpdatedStore.subscribe(() => {
        setTimeout(loadWriteRelays, 0);
    });
</script>

<Dialog
    {show}
    {onClose}
    ariaLabel={$_("settings") || "設定"}
    className="settings-dialog"
    on:relays-updated={onRelaysUpdated}
>
    <div class="modal-header">
        <span>{$_("settings") || "設定"}</span>
        <Button
            className="modal-close btn-circle"
            on:click={onClose}
            ariaLabel={$_("close") || "閉じる"}
        >
            <div class="xmark-icon svg-icon" aria-label={$_("close") || "閉じる"}></div>
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
                        aria-label={$_("change") || "変更"}
                    ></div>
                    <span class="btn-text">{$_("change") || "変更"}</span>
                </Button>
            </div>
        </div>

        <!-- 画像圧縮設定セクション -->
        <div class="setting-section">
            <span class="setting-label"
                >{$_("compression_setting") || "画像圧縮設定"}</span
            >
            <div class="setting-control">
                <select
                    id="compression-select"
                    bind:value={selectedCompression}
                >
                    {#each compressionLevels as level}
                        <option value={level.value}>{level.label}</option>
                    {/each}
                </select>
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
                    on:click={() =>
                        onRefreshRelaysAndProfile &&
                        onRefreshRelaysAndProfile()}
                    ariaLabel={$_("refresh_relays_and_profile") || "再取得"}
                >
                    <div
                        class="rotate-right-icon svg-icon"
                        aria-label={$_("refresh") || "更新"}
                    ></div>
                    <span class="btn-text">{$_("refresh") || "更新"}</span>
                </Button>
            </div>

            <!-- 投稿先リレー表示セクション（折りたたみ対応） -->
            <div class="setting-info">
                <button
                    type="button"
                    class="relay-toggle-label"
                    on:click={() => (showRelays = !showRelays)}
                    aria-pressed={showRelays}
                    aria-label={$_("toggle_write_relays_list") || "投稿先リレーの表示切替"}
                    style="cursor:pointer; background:none; border:none; padding:0; font: inherit;"
                >
                    <span class="relay-toggle-icon" aria-label="toggle">
                        {#if showRelays}
                            ▼
                        {:else}
                            ▶
                        {/if}
                    </span>
                    {$_("write_relays_list") || "書き込み先リレーリスト"}
                </button>
                {#if showRelays}
                    <div class="setting-control relay-list">
                        {#if writeRelays.length > 0}
                            <ul>
                                {#each writeRelays as relay}
                                    <li>{relay}</li>
                                {/each}
                            </ul>
                        {:else}
                            <span style="color: #888;">{$_("no_relay_info") || "リレー情報なし"}</span>
                        {/if}
                    </div>
                {/if}
            </div>
        </div>

        <!-- SW更新セクション -->
        {#if $swNeedRefresh}
            <div class="setting-section sw-update-section">
                <span class="setting-label sw-update-label">
                    {$_("sw_update_available") || "アプリの更新があります"}
                </span>
                <div class="setting-control">
                    <Button
                        className="btn sw-update-btn"
                        on:click={handleSwRefresh}
                        disabled={isUpdating}
                        ariaLabel={$_("update_app") || "アプリを更新"}
                    >
                        <div
                            class="rotate-right-icon svg-icon"
                            aria-label={$_("refresh") || "更新"}
                        ></div>
                        <span class="btn-text">
                            {isUpdating
                                ? $_("updating") || "更新中..."
                                : $_("update_app") || "更新"}
                        </span>
                    </Button>
                </div>
            </div>
        {/if}
    </div>
    <div class="settings-footer">
        <div class="footer-left">
            <span class="site-name">eHagaki</span>
            <span class="cache-version">{swVersion ? `v${swVersion}` : ""}</span
            >
        </div>
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
        padding: 8px 16px;
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
        overflow-y: auto;
    }
    .setting-section {
        display: flex;
        flex-direction: column;
        gap: 4px;
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
    #compression-select {
        font-size: 1rem;
        min-width: 200px;
        height: 50px;
    }
    .settings-footer {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 8px 16px 12px 16px;
        border-top: 1px solid var(--border-hr);
        width: 100%;
    }
    .footer-left {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-right: auto;
        font-size: 1rem;
        color: var(--text-light);
        opacity: 0.8;
    }
    .site-name {
        font-weight: bold;
        letter-spacing: 0.5px;
    }
    .cache-version {
        font-size: 0.95em;
        color: var(--gray);
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
        height: 44px;
        transition: transform 0.2s cubic-bezier(0, 1, 0.5, 1);
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
        background-color: var(--toggle-bg);
        opacity: 0.2;
        transition: 0.2s;
        border-radius: 50px;
    }
    .toggle-switch input:checked + .slider {
        background-color: var(--toggle-bg);
        opacity: 1;
    }
    .slider:before {
        position: absolute;
        content: "";
        height: 38px;
        width: 38px;
        left: 3px;
        bottom: 3px;
        background-color: var(--toggle-circle);
        transition: transform 0.2s cubic-bezier(0, 1, 0.5, 1);
        border-radius: 50%;
    }
    .toggle-switch input:checked + .slider:before {
        transform: translateX(46px);
    }
    .setting-info {
        padding-left: 20px;
    }
    .relay-list ul {
        margin: 0;
        padding-left: 20px;
        font-size: 0.95rem;
    }
    .relay-list li {
        word-break: break-all;
        color: var(--text-light);
    }
    .relay-toggle-label {
        user-select: none;
        display: flex;
        align-items: center;
        height: 35px;
        gap: 6px;
        margin-right: auto;
        margin-left: 0;
    }
    .relay-toggle-icon {
        font-size: 1.2rem;
        color: var(--gray);
    }

    .sw-update-section {
        border: 1px solid var(--theme);
        border-radius: 8px;
        padding: 12px;
        background: rgba(var(--theme-rgb), 0.05);
    }

    .sw-update-label {
        color: var(--theme);
        font-weight: 600;
    }

    :global(.btn.sw-update-btn) {
        --btn-bg: var(--theme);
        color: white;
        min-width: 120px;

        :global(.svg-icon) {
            background-color: white;
        }

        :global(.btn-text) {
            color: white;
        }
    }

    :global(.sw-update-btn:disabled) {
        --btn-bg: var(--gray);
        opacity: 0.6;
    }
</style>
