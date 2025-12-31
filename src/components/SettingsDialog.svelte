<script lang="ts">
    import { onMount, tick } from "svelte";
    import { locale, _ } from "svelte-i18n";
    import Dialog from "./Dialog.svelte";
    import Button from "./Button.svelte";
    import RadioButton from "./RadioButton.svelte";
    import {
        authState,
        swVersionStore,
        fetchSwVersion,
        swNeedRefresh,
        handleSwUpdate,
        writeRelaysStore,
        showRelaysStore,
        isSwUpdatingStore,
        loadRelayConfigFromStorage,
    } from "../stores/appStore.svelte";
    import {
        uploadEndpoints,
        getCompressionLevels,
        getVideoCompressionLevels,
        getDefaultEndpoint,
        STORAGE_KEYS,
        SW_UPDATE_TIMEOUT,
        COMPRESSION_OPTIONS_MAP,
        VIDEO_COMPRESSION_OPTIONS_MAP,
    } from "../lib/constants";
    import {
        initializeSettingsValues,
        handleServiceWorkerRefresh,
    } from "../lib/utils/appUtils";
    import type { SettingsDialogProps } from "../lib/types";
    import { nostrZapView } from "nostr-zap-view";
    import "nostr-zap";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import InfoPopoverButton from "./InfoPopoverButton.svelte";

    let {
        show = false,
        onClose,
        onRefreshRelaysAndProfile = () => {},
        selectedCompression = "medium",
        onSelectedCompressionChange = undefined,
        selectedEndpoint = "",
        onSelectedEndpointChange = undefined,
        onOpenWelcomeDialog = undefined,
    }: SettingsDialogProps = $props();

    // 圧縮設定候補（$locale変更時にラベルも更新）
    let compressionLevels = $derived(getCompressionLevels($_));
    let videoCompressionLevels = $derived(getVideoCompressionLevels($_));

    let clientTagEnabled = $state(true);
    let _selectedCompression: string = $state(selectedCompression);
    let _selectedVideoCompression: string = $state("medium");
    let _selectedEndpoint: string = $state(selectedEndpoint);
    let isInitialized = $state(false); // 初期化完了フラグ

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

    // localStorage保存処理（初期化完了後のみ）
    $effect(() => {
        if (isInitialized && _selectedCompression) {
            localStorage.setItem(
                STORAGE_KEYS.IMAGE_COMPRESSION_LEVEL,
                _selectedCompression,
            );
        }
    });

    $effect(() => {
        if (isInitialized && _selectedVideoCompression) {
            localStorage.setItem(
                STORAGE_KEYS.VIDEO_COMPRESSION_LEVEL,
                _selectedVideoCompression,
            );
        }
    });

    $effect(() => {
        if (isInitialized && _selectedEndpoint) {
            localStorage.setItem(
                STORAGE_KEYS.UPLOAD_ENDPOINT,
                _selectedEndpoint,
            );
        }
    });

    $effect(() => {
        if (isInitialized) {
            localStorage.setItem(
                STORAGE_KEYS.CLIENT_TAG_ENABLED,
                clientTagEnabled ? "true" : "false",
            );
        }
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

    // 設定の初期化処理
    function initializeSettings() {
        const settings = initializeSettingsValues({
            selectedEndpoint,
            selectedCompression,
        });
        _selectedEndpoint = settings.endpoint;
        clientTagEnabled = settings.clientTagEnabled;
        _selectedCompression = settings.compression;

        // 動画圧縮設定の初期化（既存の値がある場合はそれを使用、ない場合のみデフォルト値を設定）
        const savedVideoCompression = localStorage.getItem(
            STORAGE_KEYS.VIDEO_COMPRESSION_LEVEL,
        );
        if (savedVideoCompression) {
            // 旧バージョンからの移行: "skip" を "none" に変換
            if (savedVideoCompression === "skip") {
                _selectedVideoCompression = "none";
                localStorage.setItem(
                    STORAGE_KEYS.VIDEO_COMPRESSION_LEVEL,
                    "none",
                );
            } else {
                _selectedVideoCompression = savedVideoCompression;
            }
        } else {
            // 初回のみデフォルト値を設定
            _selectedVideoCompression = "medium";
            localStorage.setItem(
                STORAGE_KEYS.VIDEO_COMPRESSION_LEVEL,
                "medium",
            );
        }

        // 初期化完了をマーク
        isInitialized = true;
    }

    onMount(() => {
        initializeSettings();
        fetchSwVersion();
        // 初回のリレー読み込み（認証済みの場合のみ）
        if (authState.value?.pubkey && authState.value?.isAuthenticated) {
            loadRelayConfigFromStorage(authState.value.pubkey);
        }
    });

    // showがtrueのたびにリレーリストを再取得（認証済みの場合のみ）
    $effect(() => {
        if (
            show &&
            authState.value?.pubkey &&
            authState.value?.isAuthenticated
        ) {
            loadRelayConfigFromStorage(authState.value.pubkey);
        }
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
    showFooter={true}
>
    <div class="settings-header">
        <div class="first-row">
            <div class="site-title">
                <span class="site-name">eHagaki</span>
                <span class="cache-version"
                    >{swVersion ? `v${swVersion}` : ""}</span
                >
            </div>
            <div class="author-info">
                <span>{$_("settingsDialog.author_info") || "制作："}</span><a
                    href="https://lokuyow.github.io/"
                    target="_blank"
                    >{$_("settingsDialog.author_name") || " Lokuyow"}</a
                >
            </div>
        </div>
        <div class="second-row">
            <Button
                shape="circle"
                variant="default"
                className="help-btn"
                onClick={() => {
                    onClose();
                    onOpenWelcomeDialog?.();
                }}
                ariaLabel="Help"
            >
                <div class="help-icon svg-icon" aria-label="Help"></div>
            </Button>
            <Button
                shape="circle"
                variant="default"
                className="github-link-btn"
                onClick={() =>
                    window.open("https://github.com/Lokuyow/ehagaki", "_blank")}
                ariaLabel="GitHub Repository"
            >
                <div class="github-icon svg-icon" aria-label="GitHub"></div>
            </Button>
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
                    <span class="divider"></span>
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
    </div>

    <div class="modal-body">
        <!-- SW更新セクション -->
        {#if $swNeedRefresh}
            <div class="setting-section sw-update-section">
                <div class="setting-row">
                    <span class="setting-label sw-update-label">
                        {$_("settingsDialog.sw_update_available") ||
                            "アプリの更新があります"}
                    </span>
                    <div class="setting-control">
                        <Button
                            variant="primary"
                            shape="rounded"
                            className="sw-update-btn {isUpdating
                                ? 'loading'
                                : ''}"
                            onClick={handleSwRefresh}
                            disabled={isUpdating}
                            ariaLabel={$_("settingsDialog.update_app") ||
                                "アプリを更新"}
                        >
                            {#if isUpdating}
                                <LoadingPlaceholder
                                    showLoader={true}
                                    text={$_("settingsDialog.updating") ||
                                        "更新中..."}
                                />
                            {:else}
                                <div
                                    class="rotate-right-icon svg-icon"
                                    aria-label={$_("settingsDialog.refresh") ||
                                        "更新"}
                                ></div>
                                <span class="btn-text">
                                    {$_("settingsDialog.update_app") || "更新"}
                                </span>
                            {/if}
                        </Button>
                    </div>
                </div>
            </div>
        {/if}

        <!-- 言語設定セクション -->
        <div class="setting-section">
            <div class="setting-row">
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
        </div>

        <!-- 画像圧縮設定セクション -->
        <div class="setting-section">
            <div class="setting-row">
                <div class="setting-label-wrapper">
                    <span class="setting-label"
                        >{$_("settingsDialog.image_quality_setting")}</span
                    >
                    <InfoPopoverButton
                        side="bottom"
                        ariaLabel="画像圧縮設定の説明"
                    >
                        <table class="popover-table">
                            <thead>
                                <tr>
                                    <th
                                        >{$_(
                                            "settingsDialog.info_header_setting",
                                        )}</th
                                    >
                                    <th
                                        >{$_(
                                            "settingsDialog.info_header_pixels",
                                        )}</th
                                    >
                                    <th
                                        >{$_(
                                            "settingsDialog.info_header_quality",
                                        )}</th
                                    >
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{$_("settingsDialog.quality_high")}</td>
                                    <td
                                        >{COMPRESSION_OPTIONS_MAP.low
                                            .maxWidthOrHeight}px</td
                                    >
                                    <td
                                        >{Math.round(
                                            COMPRESSION_OPTIONS_MAP.low
                                                .initialQuality * 100,
                                        )}%</td
                                    >
                                </tr>
                                <tr>
                                    <td
                                        >{$_(
                                            "settingsDialog.quality_medium",
                                        )}</td
                                    >
                                    <td
                                        >{COMPRESSION_OPTIONS_MAP.medium
                                            .maxWidthOrHeight}px</td
                                    >
                                    <td
                                        >{Math.round(
                                            COMPRESSION_OPTIONS_MAP.medium
                                                .initialQuality * 100,
                                        )}%</td
                                    >
                                </tr>
                                <tr>
                                    <td>{$_("settingsDialog.quality_low")}</td>
                                    <td
                                        >{COMPRESSION_OPTIONS_MAP.high
                                            .maxWidthOrHeight}px</td
                                    >
                                    <td
                                        >{Math.round(
                                            COMPRESSION_OPTIONS_MAP.high
                                                .initialQuality * 100,
                                        )}%</td
                                    >
                                </tr>
                            </tbody>
                        </table>
                    </InfoPopoverButton>
                </div>
                <div class="setting-control radio-group">
                    {#each compressionLevels as level}
                        <RadioButton
                            value={level.value}
                            name="compression"
                            checked={_selectedCompression === level.value}
                            variant="default"
                            shape="rounded"
                            onChange={(value) => (_selectedCompression = value)}
                            ariaLabel={level.label}
                        >
                            {level.label}
                        </RadioButton>
                    {/each}
                </div>
            </div>
        </div>

        <!-- 動画圧縮設定セクション -->
        <div class="setting-section">
            <div class="setting-row">
                <div class="setting-label-wrapper">
                    <span class="setting-label"
                        >{$_("settingsDialog.video_quality_setting")}</span
                    >
                    <InfoPopoverButton
                        side="bottom"
                        ariaLabel="動画圧縮設定の説明"
                    >
                        <table class="popover-table">
                            <thead>
                                <tr>
                                    <th
                                        >{$_(
                                            "settingsDialog.info_header_setting",
                                        )}</th
                                    >
                                    <th
                                        >{$_(
                                            "settingsDialog.info_header_pixels",
                                        )}</th
                                    >
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{$_("settingsDialog.quality_high")}</td>
                                    <td
                                        >{VIDEO_COMPRESSION_OPTIONS_MAP.low
                                            .maxSize}px</td
                                    >
                                </tr>
                                <tr>
                                    <td
                                        >{$_(
                                            "settingsDialog.quality_medium",
                                        )}</td
                                    >
                                    <td
                                        >{VIDEO_COMPRESSION_OPTIONS_MAP.medium
                                            .maxSize}px</td
                                    >
                                </tr>
                                <tr>
                                    <td>{$_("settingsDialog.quality_low")}</td>
                                    <td
                                        >{VIDEO_COMPRESSION_OPTIONS_MAP.high
                                            .maxSize}px</td
                                    >
                                </tr>
                            </tbody>
                        </table>
                    </InfoPopoverButton>
                </div>
                <div class="setting-control radio-group">
                    {#each videoCompressionLevels as level}
                        <RadioButton
                            value={level.value}
                            name="videoCompression"
                            checked={_selectedVideoCompression === level.value}
                            variant="default"
                            shape="rounded"
                            onChange={(value) =>
                                (_selectedVideoCompression = value)}
                            ariaLabel={level.label}
                        >
                            {level.label}
                        </RadioButton>
                    {/each}
                </div>
            </div>
        </div>

        <!-- アップロード先設定セクション -->
        <div class="setting-section">
            <div class="setting-row">
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
        </div>

        <!-- client tag オプトアウト設定セクション -->
        <div class="setting-section">
            <div class="setting-row">
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
        </div>

        <!-- リレー・プロフィール再取得セクション -->
        <div class="setting-section">
            <div class="setting-row">
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
                    <div class="relay-list">
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
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        font-weight: bold;
        font-size: 1.3rem;
        width: 100%;
        padding: 8px 12px;
        gap: 2px;
        border-bottom: 1px solid var(--border-hr);
    }
    .first-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        gap: 10px;
    }
    .second-row {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        width: 100%;
        gap: 10px;
    }
    .site-title {
        display: flex;
        align-items: baseline;
        gap: 8px;
        .site-name {
            font-size: 1.5rem;
            font-weight: bold;
            letter-spacing: 0.5px;
        }
        .cache-version {
            font-size: 1rem;
            color: var(--text-light);
        }
    }
    :global(.github-link-btn.circle) {
        width: 38px;
        height: 38px;

        .github-icon {
            mask-image: url("/icons/github-mark.svg");
            width: 26px;
            height: 26px;
        }
    }
    :global(.help-btn.circle) {
        width: 38px;
        height: 38px;
        :global(.help-icon) {
            mask-image: url("/icons/circle-question-solid-full.svg");
            width: 30px;
            height: 30px;
        }
    }
    .zap-view-btn-group {
        display: inline-flex;
        height: 38px;

        .zap-btn,
        .view-btn {
            min-width: 70px;
        }

        .zap-btn {
            border-radius: 6px 0 0 6px;
            border-right-color: transparent;
            padding: 0 10px 0 13px;
        }

        .divider {
            width: 1px;
            background-color: var(--border);
        }

        .view-btn {
            border-radius: 0 6px 6px 0;
            border-left-color: transparent;
            padding: 0 14px 0 12px;
        }
    }

    .author-info {
        display: flex;
        align-items: center;
        font-size: 0.9375rem;
        color: var(--text-light);
        gap: 4px;
    }
    .author-info a {
        color: var(--text-light);
        text-decoration: underline;
    }

    .modal-body {
        padding: 16px;
        font-size: 1rem;
        display: flex;
        flex-direction: column;
        gap: 30px;
        width: 100%;
        overflow-y: auto;
    }
    .setting-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .setting-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .setting-label {
        font-size: 1.125rem;
        font-weight: 500;
        line-height: 1.3;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        white-space: pre-line;
        flex-shrink: 0;
    }

    .setting-label-wrapper {
        display: inline-flex;
        align-items: center;
    }

    .setting-control {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: fit-content;
    }

    .setting-info {
        margin-left: 10px;
    }

    :global(.info-trigger) {
        height: 40px;
        width: 40px;
    }

    :global(.popover-table) {
        border-collapse: collapse;
        font-size: 1rem;

        th,
        td {
            padding: 4px 8px;
            text-align: left;
        }

        th {
            font-weight: 600;
            border-bottom: 1px solid var(--border);
        }

        td {
            font-weight: normal;
        }
    }

    .radio-group {
        gap: 6px;
        flex-wrap: wrap;
        /* flex-shrink: 0; */

        :global(button) {
            font-size: 0.875rem;
            padding: 10px;
            min-height: 50px;
            min-width: 50px;
            font-weight: normal;
        }
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

    .relay-list {
        margin-left: 10px;

        ul {
            margin: 0;
            padding-left: 20px;
            font-size: 0.9375rem;
        }

        li {
            word-break: break-all;
            color: var(--text-light);
            margin: 6px 0;
        }
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
        color: gray;
    }

    .sw-update-section {
        border-radius: 8px;
        background: rgba(var(--theme-rgb), 0.05);
    }

    .sw-update-label {
        color: var(--theme);
        font-weight: 600;
    }

    :global(.sw-update-btn.primary) {
        height: 54px;
        width: auto;
        padding: 12px 10px 12px 8px;
        flex-shrink: 0;
    }

    :global(.sw-update-btn.loading) {
        :global(.square) {
            background-color: whitesmoke;
        }
    }

    :global(.sw-update-btn:disabled) {
        opacity: 0.6;
    }
</style>
