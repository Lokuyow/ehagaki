<script lang="ts">
    import { onMount, tick } from "svelte";
    import { locale, _ } from "svelte-i18n";
    import { Dialog, Switch } from "bits-ui";
    import Button from "./Button.svelte";
    import DialogWrapper from "./DialogWrapper.svelte";
    import InfoPopoverButton from "./InfoPopoverButton.svelte";
    import { authState } from "../stores/authStore.svelte";
    import {
        swVersionStore,
        fetchSwVersion,
        swNeedRefresh,
        handleSwUpdate,
    } from "../stores/swStore.svelte";
    import {
        writeRelaysStore,
        showRelaysStore,
        isSwUpdatingStore,
        loadRelayConfigFromStorage,
    } from "../stores/relayStore.svelte";
    import { darkModeStore } from "../stores/themeStore.svelte";
    import { settingsStore } from "../stores/settingsStore.svelte";
    import {
        uploadEndpoints,
        getCompressionLevels,
        SW_UPDATE_TIMEOUT,
    } from "../lib/constants";
    import {
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

    let clientTagEnabled = $state(settingsStore.clientTagEnabled);
    let darkMode = $state(darkModeStore.value);
    let hideMascot = $state(!settingsStore.showMascot);
    let hideFlavorText = $state(!settingsStore.showBalloonMessage);
    let effectiveHideFlavorText = $derived(hideMascot || hideFlavorText);

    // Store派生値
    let swVersion = $derived(swVersionStore.value);
    let writeRelays = $derived(writeRelaysStore.value);
    let showRelays = $derived(showRelaysStore.value);
    let isUpdating = $derived(isSwUpdatingStore.value);

    $effect(() => {
        if (darkMode !== darkModeStore.value) {
            darkModeStore.set(darkMode);
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

    onMount(() => {
        settingsStore.reload();
        clientTagEnabled = settingsStore.clientTagEnabled;
        darkMode = darkModeStore.value;
        hideMascot = !settingsStore.showMascot;
        hideFlavorText = !settingsStore.showBalloonMessage;
        fetchSwVersion();
        if (authState.value?.pubkey && authState.value?.isAuthenticated) {
            loadRelayConfigFromStorage(authState.value.pubkey);
        }
    });

    $effect(() => {
        clientTagEnabled = settingsStore.clientTagEnabled;
    });

    $effect(() => {
        if (clientTagEnabled !== settingsStore.clientTagEnabled) {
            settingsStore.clientTagEnabled = clientTagEnabled;
        }
    });

    $effect(() => {
        if (!hideMascot !== settingsStore.showMascot) {
            settingsStore.showMascot = !hideMascot;
        }
    });

    $effect(() => {
        if (!hideFlavorText !== settingsStore.showBalloonMessage) {
            settingsStore.showBalloonMessage = !hideFlavorText;
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

    function toggleLanguage() {
        settingsStore.locale = $locale === "ja" ? "en" : "ja";
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
                        data-relays="wss://relay.damus.io,wss://nos.lol,wss://nostr.bitcoiner.social,wss://relay.nostr.wirednet.jp,wss://yabu.me"
                    >
                        Support
                    </button>
                    <span class="divider"></span>
                    <button
                        class="view-btn"
                        data-title="Thanks for the Support!"
                        data-nzv-id="naddr1qqxnzde4xsunzwpnxymrgwpsqgswcsk8v4qck0deepdtluag3a9rh0jh2d0wh0w9g53qg8a9x2xqvqqrqsqqql8kt67m30"
                        data-zap-color-mode="true"
                        data-relay-urls="wss://relay.damus.io,wss://nos.lol,wss://nostr.bitcoiner.social,wss://relay.nostr.wirednet.jp,wss://yabu.me"
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
            selectedCompression={settingsStore.imageCompressionLevel}
            onCompressionChange={(value) =>
                (settingsStore.imageCompressionLevel = value)}
            {videoCompressionPairs}
            selectedVideoCompression={settingsStore.videoCompressionLevel}
            onVideoCompressionChange={(value) =>
                (settingsStore.videoCompressionLevel = value)}
        />

        <!-- アップロード先設定セクション -->
        <div class="setting-section">
            <div class="setting-row">
                <span class="setting-label"
                    >{$_("settingsDialog.upload_destination") ||
                        "アップロード先"}</span
                >
                <div class="setting-control">
                    <select
                        id="{uid}-endpoint"
                        bind:value={settingsStore.uploadEndpoint}
                    >
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
                        bind:checked={settingsStore.mediaFreePlacement}
                    >
                        <Switch.Thumb class="bui-switch-thumb" />
                    </Switch.Root>
                </div>
            </div>
        </div>

        <!-- ダークモード設定セクション -->
        <div class="setting-section">
            <div class="setting-row">
                <span class="setting-label"
                    >{$_("settingsDialog.dark_mode") || "ダークモード"}</span
                >
                <div class="setting-control">
                    <Switch.Root class="bui-switch" bind:checked={darkMode}>
                        <Switch.Thumb class="bui-switch-thumb" />
                    </Switch.Root>
                </div>
            </div>
        </div>

        <div class="hide-mascot-flavor-group">
            <div class="setting-section">
                <div class="setting-row setting-row-with-note">
                    <div class="setting-label-group">
                        <div class="setting-label-row">
                            <span class="setting-label"
                                >{$_("settingsDialog.hide_mascot_label") ||
                                    "左上マスコットを非表示"}</span
                            >
                            <InfoPopoverButton
                                side="top"
                                sideOffset={8}
                                ariaLabel={($_(
                                    "settingsDialog.hide_mascot_label",
                                ) || "左上マスコットを非表示") + "の説明"}
                            >
                                {$_("settingsDialog.hide_mascot_note") ||
                                    "オンにすると左上のマスコットを隠し、フレーバーテキストもあわせて非表示にします。"}
                            </InfoPopoverButton>
                        </div>
                    </div>
                    <div class="setting-control">
                        <Switch.Root
                            class="bui-switch"
                            bind:checked={hideMascot}
                        >
                            <Switch.Thumb class="bui-switch-thumb" />
                        </Switch.Root>
                    </div>
                </div>
            </div>

            <div class="setting-section">
                <div class="setting-row setting-row-with-note">
                    <div class="setting-label-group">
                        <div class="setting-label-row">
                            <span class="setting-label"
                                >{$_("settingsDialog.hide_flavor_text_label") ||
                                    "フレーバーテキストを非表示"}</span
                            >
                            <InfoPopoverButton
                                side="top"
                                sideOffset={8}
                                ariaLabel={($_(
                                    "settingsDialog.hide_flavor_text_label",
                                ) || "フレーバーテキストを非表示") + "の説明"}
                            >
                                {hideMascot
                                    ? $_(
                                          "settingsDialog.hide_flavor_text_note_included",
                                      ) ||
                                      "マスコットを非表示にしている間は、この設定も自動でオンになります。"
                                    : $_(
                                          "settingsDialog.hide_flavor_text_note",
                                      ) ||
                                      "オンにすると info のフレーバーテキストだけを隠します。success / error / tips は簡素な表示で残ります。"}
                            </InfoPopoverButton>
                        </div>
                    </div>
                    <div class="setting-control">
                        {#if hideMascot}
                            <Switch.Root
                                class="bui-switch"
                                checked={effectiveHideFlavorText}
                                disabled
                            >
                                <Switch.Thumb class="bui-switch-thumb" />
                            </Switch.Root>
                        {:else}
                            <Switch.Root
                                class="bui-switch"
                                bind:checked={hideFlavorText}
                            >
                                <Switch.Thumb class="bui-switch-thumb" />
                            </Switch.Root>
                        {/if}
                    </div>
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
        display: flex;
        flex-direction: column;
        gap: 26px;
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

    .setting-row-with-note {
        align-items: flex-start;
    }

    .setting-label-group {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
    }

    .setting-label-row {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
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
    :global(.bui-switch[data-disabled]) {
        cursor: not-allowed;
        opacity: 0.5;
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

    .hide-mascot-flavor-group {
        display: flex;
        flex-direction: column;
        gap: 4px;
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

    :global(.sw-update-btn:disabled) {
        opacity: 0.6;
    }
</style>
