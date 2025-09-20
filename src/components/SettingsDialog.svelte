<script lang="ts">
    import { onMount, tick } from "svelte";
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
        writeRelaysStore,
        showRelaysStore,
        isSwUpdatingStore,
    } from "../stores/appStore.svelte";
    import {
        uploadEndpoints,
        getCompressionLevels,
        getDefaultEndpoint,
        STORAGE_KEYS,
        SW_UPDATE_TIMEOUT,
        RELAY_LIST_REFRESH_DELAY,
    } from "../lib/constants";
    import {
        loadWriteRelaysFromStorage,
        initializeSettingsValues,
        handleServiceWorkerRefresh,
    } from "../lib/utils/appUtils";
    import type { SettingsDialogProps } from "../lib/types";
    import { nostrZapView } from "nostr-zap-view";
    import "nostr-zap";

    let {
        show = false,
        onClose,
        onRefreshRelaysAndProfile = () => {},
        selectedCompression = "medium",
        onSelectedCompressionChange = undefined,
        selectedEndpoint = "",
        onSelectedEndpointChange = undefined,
    }: SettingsDialogProps = $props();

    // 圧縮設定候補（$locale変更時にラベルも更新）
    let compressionLevels = $derived(getCompressionLevels($_));

    let clientTagEnabled = $state(true);
    let _selectedCompression: string = $state(selectedCompression);
    let _selectedEndpoint: string = $state(selectedEndpoint);

    // 直接同期処理（$effectを使用）
    $effect(() => {
        const externalValue = selectedCompression;
        if (externalValue !== undefined && externalValue !== "") {
            _selectedCompression = externalValue;
        }
    });

    $effect(() => {
        if (
            onSelectedCompressionChange &&
            _selectedCompression !== selectedCompression
        ) {
            onSelectedCompressionChange(_selectedCompression);
        }
    });

    $effect(() => {
        const externalValue = selectedEndpoint;
        if (externalValue !== undefined && externalValue !== "") {
            _selectedEndpoint = externalValue;
        }
    });

    $effect(() => {
        if (
            onSelectedEndpointChange &&
            _selectedEndpoint !== selectedEndpoint
        ) {
            onSelectedEndpointChange(_selectedEndpoint);
        }
    });

    // localStorage保存処理
    $effect(() => {
        if (_selectedCompression) {
            localStorage.setItem(
                STORAGE_KEYS.IMAGE_COMPRESSION_LEVEL,
                _selectedCompression,
            );
        }
    });

    $effect(() => {
        if (_selectedEndpoint) {
            localStorage.setItem(
                STORAGE_KEYS.UPLOAD_ENDPOINT,
                _selectedEndpoint,
            );
        }
    });

    $effect(() => {
        localStorage.setItem(
            STORAGE_KEYS.CLIENT_TAG_ENABLED,
            clientTagEnabled ? "true" : "false",
        );
    });

    // swVersion from store
    let swVersion: string | null = $state(null);
    swVersionStore.subscribe((v) => (swVersion = v));

    function handleSwRefresh() {
        handleServiceWorkerRefresh(
            handleSwUpdate,
            (value) => isSwUpdatingStore.set(value),
            {
                timeout: SW_UPDATE_TIMEOUT,
            },
        );
    }

    function loadWriteRelays() {
        const relays = loadWriteRelaysFromStorage(authState.value.pubkey);
        writeRelaysStore.set(relays);
    }

    // 設定の初期化処理
    function initializeSettings() {
        const settings = initializeSettingsValues({
            selectedEndpoint,
            selectedCompression,
        });
        _selectedEndpoint = settings.endpoint;
        clientTagEnabled = settings.clientTagEnabled;
        _selectedCompression = settings.compression;
    }

    onMount(() => {
        initializeSettings();
        loadWriteRelays();
        fetchSwVersion();
    });

    // showがtrueのたびにリレーリストを再取得
    $effect(() => {
        if (show) loadWriteRelays();
    });
    // showがtrueのたびにnostr-zap-viewを再初期化
    $effect(() => {
        if (show) {
            (async () => {
                await tick();
                nostrZapView();
                if (window.nostrZap) {
                    window.nostrZap.initTargets();
                }
            })();
        }
    });
    // showがfalseになったらリレーリストの折り畳みも閉じる
    $effect(() => {
        if (!show) showRelaysStore.set(false);
    });
    // $locale変更時、保存がなければデフォルトエンドポイントを再設定
    $effect(() => {
        if ($locale && !localStorage.getItem(STORAGE_KEYS.UPLOAD_ENDPOINT)) {
            _selectedEndpoint = getDefaultEndpoint($locale);
        }
    });

    function toggleLanguage() {
        locale.set($locale === "ja" ? "en" : "ja");
    }

    function onRelaysUpdated() {
        loadWriteRelays();
    }

    relayListUpdatedStore.subscribe(() => {
        setTimeout(loadWriteRelays, RELAY_LIST_REFRESH_DELAY);
    });

    // Store values for template
    let writeRelays = $derived(writeRelaysStore.value);
    let showRelays = $derived(showRelaysStore.value);
    let isUpdating = $derived(isSwUpdatingStore.value);
</script>

<Dialog
    {show}
    useHistory={true}
    {onClose}
    ariaLabel={$_("settings") || "設定"}
    className="settings-dialog"
    on:relays-updated={onRelaysUpdated}
    showFooter={true}
>
    <div class="settings-header">
        <div class="site-title">
            <a
                href="https://github.com/Lokuyow/ehagaki"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Repository"
                class="github-link"
            >
                <div class="github-icon svg-icon" aria-label="GitHub"></div>
            </a>
            <span class="site-name">eHagaki</span>
            <span class="cache-version">{swVersion ? `v${swVersion}` : ""}</span
            >
        </div>

        <div>
            <div class="zap-view-btn-group">
                <button
                    class="zap-btn"
                    data-npub="npub1a3pvwe2p3v7mnjz6hle63r628wl9w567aw7u23fzqs062v5vqcqqu3sgh3"
                    data-note-id="naddr1qqxnzde4xsunzwpnxymrgwpsqgswcsk8v4qck0deepdtluag3a9rh0jh2d0wh0w9g53qg8a9x2xqvqqrqsqqql8kt67m30"
                    data-relays="wss://relay.nostr.band,wss://relay.damus.io,wss://nos.lol,wss://nostr.bitcoiner.social,wss://relay.nostr.wirednet.jp,wss://yabu.me"
                >
                    Support
                </button>
                <button
                    class="view-btn"
                    data-title="Thanks for the Support!"
                    data-nzv-id="naddr1qqxnzde4xsunzwpnxymrgwpsqgswcsk8v4qck0deepdtluag3a9rh0jh2d0wh0w9g53qg8a9x2xqvqqrqsqqql8kt67m30"
                    data-zap-color-mode="true"
                    data-relay-urls="wss://relay.nostr.band,wss://relay.damus.io,wss://nos.lol,wss://nostr.bitcoiner.social,wss://relay.nostr.wirednet.jp,wss://yabu.me"
                >
                    View
                </button>
            </div>
        </div>
    </div>

    <div class="modal-body">
        <!-- SW更新セクション -->
        {#if $swNeedRefresh}
            <div class="setting-section sw-update-section">
                <span class="setting-label sw-update-label">
                    {$_("settingsDialog.sw_update_available") ||
                        "アプリの更新があります"}
                </span>
                <div class="setting-control">
                    <Button
                        variant="primary"
                        shape="rounded"
                        className="sw-update-btn"
                        onClick={handleSwRefresh}
                        disabled={isUpdating}
                        ariaLabel={$_("settingsDialog.update_app") ||
                            "アプリを更新"}
                    >
                        <div
                            class="rotate-right-icon svg-icon"
                            aria-label={$_("settingsDialog.refresh") || "更新"}
                        ></div>
                        <span class="btn-text">
                            {isUpdating
                                ? $_("settingsDialog.updating") || "更新中..."
                                : $_("settingsDialog.update_app") || "更新"}
                        </span>
                    </Button>
                </div>
            </div>
        {/if}

        <!-- 言語設定セクション -->
        <div class="setting-section">
            <span class="setting-label"> Language/言語 </span>
            <div class="setting-control">
                <Button
                    variant="default"
                    shape="rounded"
                    className="lang-btn"
                    onClick={toggleLanguage}
                >
                    <div
                        class="lang-icon-btn svg-icon"
                        aria-label={$_("settingsDialog.change") || "変更"}
                    ></div>
                    <span class="btn-text"
                        >{$_("settingsDialog.change") || "変更"}</span
                    >
                </Button>
            </div>
        </div>

        <!-- 画像圧縮設定セクション -->
        <div class="setting-section">
            <span class="setting-label"
                >{$_("settingsDialog.compression_setting") ||
                    "画像圧縮設定"}</span
            >
            <div class="setting-control">
                <select
                    id="compression-select"
                    bind:value={_selectedCompression}
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
                >{$_("settingsDialog.upload_destination") ||
                    "アップロード先"}</span
            >
            <div class="setting-control">
                <select id="endpoint-select" bind:value={_selectedEndpoint}>
                    {#each uploadEndpoints as ep}
                        <option value={ep.url}>{ep.label}</option>
                    {/each}
                </select>
            </div>
        </div>

        <!-- client tag オプトアウト設定セクション -->
        <div class="setting-section">
            <span class="setting-label"
                >{$_("settingsDialog.client_tag_label") ||
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
                >{$_("settingsDialog.refresh_relays_and_profile") ||
                    "リレーリスト・プロフィール再取得"}</span
            >
            <div class="setting-control">
                <Button
                    variant="default"
                    shape="rounded"
                    className="refresh-relays-profile-btn"
                    onClick={() =>
                        onRefreshRelaysAndProfile &&
                        onRefreshRelaysAndProfile()}
                    ariaLabel={$_(
                        "settingsDialog.refresh_relays_and_profile",
                    ) || "再取得"}
                >
                    <div
                        class="rotate-right-icon svg-icon"
                        aria-label={$_("settingsDialog.refresh") || "更新"}
                    ></div>
                    <span class="btn-text"
                        >{$_("settingsDialog.refresh") || "更新"}</span
                    >
                </Button>
            </div>

            <!-- 投稿先リレー表示セクション（折りたたみ対応） -->
            <div class="setting-info">
                <button
                    type="button"
                    class="relay-toggle-label"
                    onclick={() => showRelaysStore.set(!showRelays)}
                    aria-pressed={showRelays}
                    aria-label={$_("settingsDialog.toggle_write_relays_list") ||
                        "投稿先リレーの表示切替"}
                    style="cursor:pointer; background:none; border:none; padding:0; font: inherit;"
                >
                    <span class="relay-toggle-icon" aria-label="toggle">
                        {#if showRelays}
                            ▼
                        {:else}
                            ▶
                        {/if}
                    </span>
                    {$_("settingsDialog.write_relays_list") ||
                        "書き込み先リレーリスト"}
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
                            <span style="color: #888;"
                                >{$_("settingsDialog.no_relay_info") ||
                                    "リレー情報なし"}</span
                            >
                        {/if}
                    </div>
                {/if}
            </div>
        </div>
    </div>
</Dialog>

<style>
    :global(.settings-dialog .dialog-content) {
        padding: 0;
    }
    .settings-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: var(--text-light);
        font-weight: bold;
        font-size: 1.3rem;
        width: 100%;
        padding: 12px 0;
        border-bottom: 1px solid var(--border-hr);
    }
    .site-title {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-right: auto;
        font-size: 1.3rem;
        color: var(--text);
        opacity: 0.8;
    }
    .github-link {
        display: inline-flex;
        align-items: center;
        text-decoration: none;
        padding: 8px;

        .github-icon {
            mask-image: url("/icons/github-mark.svg");
        }
    }
    .zap-view-btn-group {
        display: inline-flex;
        height: 35px;
        margin: 0 8px;

        .zap-btn,
        .view-btn {
            color: var(--text-light);
            min-width: 70px;
        }

        .zap-btn {
            border-radius: 6px 0 0 6px;
            border-right: 1px solid var(--border);
            padding: 0 10px 0 13px;
        }

        .view-btn {
            border-radius: 0 6px 6px 0;
            border-left: 1px solid var(--border);
            padding: 0 14px 0 12px;
        }
    }
    .modal-body {
        padding: 16px;
        font-size: 1rem;
        display: flex;
        flex-direction: column;
        gap: 24px;
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
        mask-image: url("/icons/language-solid-full.svg");
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
    .site-name {
        font-weight: bold;
        letter-spacing: 0.5px;
    }
    .cache-version {
        font-size: 0.9375rem;
        color: var(--text-light);
    }
    .rotate-right-icon {
        mask-image: url("/icons/rotate-right-solid-full.svg");
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
        height: fit-content;
        gap: 6px;
        margin-right: auto;
        margin-left: 0;
    }
    .relay-toggle-icon {
        font-size: 1.2rem;
        color: var(--gray);
    }

    .sw-update-section {
        border-radius: 8px;
        background: rgba(var(--theme-rgb), 0.05);
    }

    .sw-update-label {
        color: var(--theme);
        font-weight: 600;
    }

    :global(.sw-update-btn:disabled) {
        opacity: 0.6;
    }
</style>
