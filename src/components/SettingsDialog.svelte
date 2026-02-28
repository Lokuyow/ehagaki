<script lang="ts">
    import { onMount, tick } from "svelte";
    import { locale, _ } from "svelte-i18n";
    import { Dialog, Switch } from "bits-ui";
    import Button from "./Button.svelte";
    import DialogWrapper from "./DialogWrapper.svelte";
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
        mediaFreePlacementStore,
    } from "../stores/appStore.svelte";
    import {
        uploadEndpoints,
        getCompressionLevels,
        getDefaultEndpoint,
        STORAGE_KEYS,
        SW_UPDATE_TIMEOUT,
    } from "../lib/constants";
    import {
        initializeSettingsValues,
        handleServiceWorkerRefresh,
        chunkArray,
    } from "../lib/utils/appUtils";
    import type { SettingsDialogProps } from "../lib/types";
    import { nostrZapView } from "nostr-zap-view";
    import "nostr-zap";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import { useDialogHistory } from "../lib/hooks/useDialogHistory.svelte";
    import SettingsRelaySection from "./settings/SettingsRelaySection.svelte";
    import SettingsCompressionSection from "./settings/SettingsCompressionSection.svelte";

    let {
        show = $bindable(false),
        onClose,
        onRefreshRelaysAndProfile = () => {},
        selectedCompression = "medium",
        onSelectedCompressionChange = undefined,
        selectedEndpoint = "",
        onSelectedEndpointChange = undefined,
        onOpenWelcomeDialog = undefined,
    }: SettingsDialogProps = $props();

    // ダイアログを閉じるハンドラ
    function handleClose() {
        show = false;
        onClose?.();
    }

    // ブラウザ履歴統合
    useDialogHistory(() => show, handleClose, true);

    // ユニークID生成
    const uid = $props.id();

    // 圧縮設定候補（$locale変更時にラベルも更新）
    let compressionLevels = $derived(getCompressionLevels($_));
    let videoCompressionLevels = $derived(getCompressionLevels($_));

    // 圧縮レベルを2つずつペアにグループ化
    let compressionPairs = $derived(chunkArray(compressionLevels, 2));
    let videoCompressionPairs = $derived(chunkArray(videoCompressionLevels, 2));

    let clientTagEnabled = $state(true);
    let mediaFreePlacement = $state(false);
    let _selectedCompression: string = $state("");
    let _selectedVideoCompression: string = $state("medium");
    let _selectedEndpoint: string = $state("");
    let isInitialized = $state(false); // 初期化完了フラグ

    // propsから初期値を同期
    $effect(() => {
        if (!isInitialized) {
            _selectedCompression = selectedCompression;
            _selectedEndpoint = selectedEndpoint;
        }
    });

    // Store派生値
    let swVersion = $derived(swVersionStore.value);
    let writeRelays = $derived(writeRelaysStore.value);
    let showRelays = $derived(showRelaysStore.value);
    let isUpdating = $derived(isSwUpdatingStore.value);

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

    $effect(() => {
        if (isInitialized) {
            localStorage.setItem(
                STORAGE_KEYS.MEDIA_FREE_PLACEMENT,
                mediaFreePlacement ? "true" : "false",
            );
            mediaFreePlacementStore.set(mediaFreePlacement);
        }
    });

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

        // メディア自由配置モード設定の読み込み
        const savedMediaFreePlacement = localStorage.getItem(
            STORAGE_KEYS.MEDIA_FREE_PLACEMENT,
        );
        if (savedMediaFreePlacement !== null) {
            mediaFreePlacement = savedMediaFreePlacement !== "false";
        } else {
            // 初回: デフォルトOFF（ギャラリーモード）
            mediaFreePlacement = false;
            localStorage.setItem(STORAGE_KEYS.MEDIA_FREE_PLACEMENT, "false");
        }
        mediaFreePlacementStore.set(mediaFreePlacement);

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
        if (authState.value?.pubkey && authState.value?.isAuthenticated) {
            loadRelayConfigFromStorage(authState.value.pubkey);
        }
    });

    // showがtrueのたびにリレーリストを再取得、nostr-zap-view初期化
    $effect(() => {
        if (!show) {
            showRelaysStore.set(false);
            return;
        }
        // 認証済みの場合のみリレーリスト再取得
        if (authState.value?.pubkey && authState.value?.isAuthenticated) {
            loadRelayConfigFromStorage(authState.value.pubkey);
        }
        // nostr-zap-view初期化
        (async () => {
            await tick();
            nostrZapView();
            window.nostrZap?.initTargets();
        })();
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
</script>

<DialogWrapper
    bind:open={show}
    onOpenChange={(open) => !open && handleClose()}
    title={$_("settings") || "設定"}
    description={$_("settingsDialog.image_quality_setting")}
    contentClass="settings-dialog"
    footerVariant="close-button"
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
                    handleClose();
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

        <!-- 画像・動画圧縮設定セクション -->
        <SettingsCompressionSection
            {compressionPairs}
            selectedCompression={_selectedCompression}
            onCompressionChange={(value) => (_selectedCompression = value)}
            {videoCompressionPairs}
            selectedVideoCompression={_selectedVideoCompression}
            onVideoCompressionChange={(value) =>
                (_selectedVideoCompression = value)}
        />

        <!-- アップロード先設定セクション -->
        <div class="setting-section">
            <div class="setting-row">
                <span class="setting-label"
                    >{$_("settingsDialog.upload_destination") ||
                        "アップロード先"}</span
                >
                <div class="setting-control">
                    <select id="{uid}-endpoint" bind:value={_selectedEndpoint}>
                        {#each uploadEndpoints as ep}
                            <option value={ep.url}>{ep.label}</option>
                        {/each}
                    </select>
                </div>
            </div>
        </div>

        <!-- メディア自由配置モード設定セクション -->
        <div class="setting-section">
            <div class="setting-row">
                <span class="setting-label"
                    >{$_("settingsDialog.media_bottom_mode") ||
                        "メディア自由配置モード"}</span
                >
                <div class="setting-control">
                    <Switch.Root
                        class="bui-switch"
                        bind:checked={mediaFreePlacement}
                    >
                        <Switch.Thumb class="bui-switch-thumb" />
                    </Switch.Root>
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
                    <Switch.Root
                        class="bui-switch"
                        bind:checked={clientTagEnabled}
                    >
                        <Switch.Thumb class="bui-switch-thumb" />
                    </Switch.Root>
                </div>
            </div>
        </div>

        <!-- リレー・プロフィール再取得セクション -->
        <SettingsRelaySection
            {writeRelays}
            {showRelays}
            onToggleShowRelays={() => showRelaysStore.set(!showRelays)}
            {onRefreshRelaysAndProfile}
        />
    </div>

    {#snippet footer()}
        <Dialog.Close>
            {#snippet child({ props })}
                <Button
                    {...props}
                    className="modal-close"
                    variant="default"
                    shape="square"
                    ariaLabel="閉じる"
                >
                    <div class="xmark-icon svg-icon" aria-label="閉じる"></div>
                </Button>
            {/snippet}
        </Dialog.Close>
    {/snippet}
</DialogWrapper>

<style>
    /* SettingsDialog固有: paddingなしのdialog-content */
    :global(.settings-dialog .dialog-content) {
        padding: 0;
    }

    .xmark-icon {
        mask-image: url("/icons/xmark-solid-full.svg");
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
    .lang-icon-btn {
        mask-image: url("/icons/language-solid-full.svg");
    }
    select {
        padding: 6px;
        height: 50px;
        font-size: 1rem;
    }

    .rotate-right-icon {
        mask-image: url("/icons/rotate-right-solid-full.svg");
    }

    :global(.bui-switch) {
        position: relative;
        display: inline-block;
        width: 90px;
        height: 44px;
        background-color: var(--toggle-bg);
        opacity: 0.2;
        border-radius: 50px;
        border: none;
        padding: 0;
        cursor: pointer;
        transition: opacity 0.2s;
        flex-shrink: 0;
    }
    :global(.bui-switch[data-state="checked"]) {
        opacity: 1;
    }
    :global(.bui-switch-thumb) {
        position: absolute;
        display: block;
        height: 38px;
        width: 38px;
        left: 3px;
        bottom: 3px;
        background-color: var(--toggle-circle);
        transition: transform 0.2s cubic-bezier(0, 1, 0.5, 1);
        border-radius: 50%;
    }
    :global(.bui-switch[data-state="checked"] .bui-switch-thumb) {
        transform: translateX(46px);
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
