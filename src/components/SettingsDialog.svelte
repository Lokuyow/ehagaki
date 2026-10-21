<script lang="ts">
    import { onMount, tick } from "svelte";
    import { locale, _ } from "svelte-i18n";
    import { Dialog, RadioGroup, Switch } from "bits-ui";
    import Button from "./Button.svelte";
    import DialogWrapper from "./DialogWrapper.svelte";
    import InfoPopoverButton from "./InfoPopoverButton.svelte";
    import { authState } from "../stores/authStore.svelte";
    import {
        swVersionStore,
        fetchSwVersion,
        swNeedRefresh,
        swUpdateStatus,
        dbUpgradeBlocked,
        handleSwUpdate,
    } from "../stores/swStore.svelte";
    import {
        requestStaleReloadPrompt,
        staleAssetReloadState,
    } from "../stores/staleAssetReloadStore.svelte";
    import {
        relayConfigStore,
        isSwUpdatingStore,
        loadRelayConfigFromStorage,
    } from "../stores/relayStore.svelte";
    import { themeModeStore } from "../stores/themeStore.svelte";
    import { footerSettingShortcutsStore } from "../stores/footerSettingShortcutsStore.svelte";
    import { FOOTER_SETTING_SHORTCUTS } from "../lib/footerSettingShortcuts";
    import { themeColorStore } from "../stores/themeColorStore.svelte";
    import { settingsStore } from "../stores/settingsStore.svelte";
    import { getCompressionLevels } from "../lib/constants";
    import {
        handleServiceWorkerRefresh,
        chunkArray,
    } from "../lib/utils/appUtils";
    import type { SettingsDialogProps } from "../lib/types";
    import { resolveAppAssetUrl } from "../lib/appAssetUrl";
    import { nostrZapView } from "nostr-zap-view";
    import "nostr-zap";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import { useDialogHistory } from "../lib/hooks/useDialogHistory.svelte";
    import SettingsRelaySection from "./settings/SettingsRelaySection.svelte";
    import SettingsLocalRelaySection from "./settings/SettingsLocalRelaySection.svelte";
    import { getAppRuntimeEnvironment } from "../lib/appRuntimeEnvironment";
    import SettingsCompressionSection from "./settings/SettingsCompressionSection.svelte";
    import SettingsUploadDestinationSection from "./settings/SettingsUploadDestinationSection.svelte";
    import RadioButton from "./RadioButton.svelte";
    import { normalizeHexColor } from "../lib/utils/settingsStorage";
    import {
        EXTERNAL_NOSTR_CLIENTS,
        normalizeExternalNostrClientUrlTemplate,
        type ExternalNostrClient,
    } from "../lib/postHistoryExternalClient";

    let {
        show = $bindable(false),
        onClose,
        onRefreshRelaysAndProfile = () => {},
        hostRelayConfigActive = false,
        onOpenWelcomeDialog = undefined,
        rxNostr = null,
    }: SettingsDialogProps = $props();

    type SettingsCategory = "display" | "post" | "media" | "nostr" | "about";

    const settingsCategories = [
        { id: "display", labelKey: "settingsDialog.category_display" },
        { id: "post", labelKey: "settingsDialog.category_post" },
        { id: "media", labelKey: "settingsDialog.category_media" },
        { id: "nostr", labelKey: "settingsDialog.category_nostr" },
        { id: "about", labelKey: "settingsDialog.category_about" },
    ] as const satisfies readonly { id: SettingsCategory; labelKey: string }[];

    let category = $state<SettingsCategory | null>(null);
    let categoryLabelKey = $derived(
        settingsCategories.find((item) => item.id === category)?.labelKey ?? "",
    );

    // ダイアログを閉じるハンドラ
    function handleClose() {
        category = null;
        show = false;
        onClose?.();
    }

    // ブラウザ履歴統合
    useDialogHistory(() => show, handleClose, true);

    // 圧縮設定候補（$locale変更時にラベルも更新）
    let compressionLevels = $derived(getCompressionLevels($_));
    let videoCompressionLevels = $derived(getCompressionLevels($_));

    // 圧縮レベルを2つずつペアにグループ化
    let compressionPairs = $derived(chunkArray(compressionLevels, 2));
    let videoCompressionPairs = $derived(chunkArray(videoCompressionLevels, 2));

    let clientTagEnabled = $state(settingsStore.clientTagEnabled);
    let externalNostrClient = $state<ExternalNostrClient>(
        settingsStore.externalNostrClient,
    );
    let externalNostrClientCustomUrl = $state(
        settingsStore.externalNostrClientCustomUrl,
    );
    let externalNostrClientCustomUrlError = $state<string | null>(null);
    let quoteNotificationEnabled = $state(
        settingsStore.quoteNotificationEnabled,
    );
    let replyNotificationEnabled = $state(
        settingsStore.replyNotificationEnabled,
    );
    const defaultAccentColor = "#1dbf73";
    const defaultBaseColorPickerValue = "#808080";
    let accentColorInput = $state(themeColorStore.accentColor ?? defaultAccentColor);
    let baseColorInput = $state(themeColorStore.baseColor ?? "");
    let accentColorError = $state<string | null>(null);
    let baseColorError = $state<string | null>(null);
    let effectiveHideFlavorText = $derived(
        !settingsStore.showMascot || !settingsStore.showFlavorText,
    );

    // Store派生値
    let swVersion = $derived(swVersionStore.value);
    let relayConfig = $derived(relayConfigStore.value);
    let isUpdating = $derived(isSwUpdatingStore.value);
    let isSwInstalling = $derived($swUpdateStatus === "installing");
    let isDbUpgradeBlocked = $derived($dbUpgradeBlocked);
    let isStaleAssetReloadRequired = $derived(
        staleAssetReloadState.required,
    );
    let canApplySwUpdate = $derived(
        isStaleAssetReloadRequired ||
            ($swUpdateStatus === "ready" && !isDbUpgradeBlocked),
    );

    function handleSwRefresh() {
        if (isStaleAssetReloadRequired) {
            requestStaleReloadPrompt();
            return;
        }
        handleServiceWorkerRefresh(
            handleSwUpdate,
            (value) => isSwUpdatingStore.set(value),
        );
    }

    onMount(() => {
        settingsStore.reload();
        clientTagEnabled = settingsStore.clientTagEnabled;
        externalNostrClient = settingsStore.externalNostrClient;
        externalNostrClientCustomUrl = settingsStore.externalNostrClientCustomUrl;
        quoteNotificationEnabled = settingsStore.quoteNotificationEnabled;
        replyNotificationEnabled = settingsStore.replyNotificationEnabled;
        themeColorStore.reload();
        accentColorInput = themeColorStore.accentColor ?? defaultAccentColor;
        baseColorInput = themeColorStore.baseColor ?? "";
        fetchSwVersion();
        if (!hostRelayConfigActive && authState.value?.pubkey && authState.value?.isAuthenticated) {
            loadRelayConfigFromStorage(authState.value.pubkey);
        }
    });

    $effect(() => {
        clientTagEnabled = settingsStore.clientTagEnabled;
    });

    $effect(() => {
        if (externalNostrClient !== settingsStore.externalNostrClient) {
            settingsStore.externalNostrClient = externalNostrClient;
        }
    });

    $effect(() => {
        if (
            externalNostrClientCustomUrl !==
            settingsStore.externalNostrClientCustomUrl
        ) {
            const normalizedUrl = normalizeExternalNostrClientUrlTemplate(
                externalNostrClientCustomUrl,
            );
            if (normalizedUrl) {
                settingsStore.externalNostrClientCustomUrl = normalizedUrl;
            }
        }
    });

    $effect(() => {
        quoteNotificationEnabled = settingsStore.quoteNotificationEnabled;
    });

    $effect(() => {
        replyNotificationEnabled = settingsStore.replyNotificationEnabled;
    });

    $effect(() => {
        if (clientTagEnabled !== settingsStore.clientTagEnabled) {
            settingsStore.clientTagEnabled = clientTagEnabled;
        }
    });

    $effect(() => {
        if (
            replyNotificationEnabled !== settingsStore.replyNotificationEnabled
        ) {
            settingsStore.replyNotificationEnabled = replyNotificationEnabled;
        }
    });

    $effect(() => {
        if (
            quoteNotificationEnabled !== settingsStore.quoteNotificationEnabled
        ) {
            settingsStore.quoteNotificationEnabled = quoteNotificationEnabled;
        }
    });

    // showがtrueのたびにリレーリストを再取得、nostr-zap-view初期化
    $effect(() => {
        if (!show) {
            category = null;
            return;
        }
        // 認証済みの場合のみリレーリスト再取得
        if (authState.value?.pubkey && authState.value?.isAuthenticated) {
            loadRelayConfigFromStorage(authState.value.pubkey);
        }
    });

    $effect(() => {
        if (!show || category !== "about") return;
        (async () => {
            await tick();
            nostrZapView();
            window.nostrZap?.initTargets();
        })();
    });

    function toggleLanguage() {
        settingsStore.locale = $locale === "ja" ? "en" : "ja";
    }

    function handleFooterShortcutChange(slot: "left" | "right", event: Event): void {
        const selectedId = (event.currentTarget as HTMLSelectElement).value;
        footerSettingShortcutsStore.set({
            ...footerSettingShortcutsStore.value,
            [slot]: selectedId || null,
        });
    }

    function handleExternalNostrClientCustomUrlInput(value: string): void {
        externalNostrClientCustomUrl = value;
        const normalizedUrl = normalizeExternalNostrClientUrlTemplate(value);
        externalNostrClientCustomUrlError = normalizedUrl
            ? null
            : $_("settingsDialog.external_nostr_client_invalid_url");
        if (normalizedUrl) {
            settingsStore.externalNostrClientCustomUrl = normalizedUrl;
        }
    }

    function handleColorInput(
        kind: "accent" | "base",
        value: string,
    ): void {
        if (kind === "accent") {
            accentColorInput = value;
        } else {
            baseColorInput = value;
        }

        const normalized = normalizeHexColor(value);
        if (!normalized) {
            return;
        }

        if (kind === "accent") {
            accentColorInput = themeColorStore.setAccentColor(normalized) ?? value;
            accentColorError = null;
        } else {
            baseColorInput = themeColorStore.setBaseColor(normalized) ?? value;
            baseColorError = null;
        }
    }

    function handleColorBlur(kind: "accent" | "base"): void {
        const value = kind === "accent" ? accentColorInput : baseColorInput;
        const appliedColor =
            kind === "accent"
                ? themeColorStore.accentColor
                : themeColorStore.baseColor;
        const isUnsetBase = kind === "base" && !value && !appliedColor;
        const error = isUnsetBase || normalizeHexColor(value)
            ? null
            : $_("settingsDialog.invalid_hex_color");
        if (kind === "accent") {
            accentColorError = error;
        } else {
            baseColorError = error;
        }
    }

    function handleColorPickerInput(kind: "accent" | "base", value: string): void {
        const normalized = normalizeHexColor(value);
        if (!normalized) {
            return;
        }
        if (kind === "accent") {
            accentColorInput = themeColorStore.setAccentColor(normalized) ?? normalized;
            accentColorError = null;
        } else {
            baseColorInput = themeColorStore.setBaseColor(normalized) ?? normalized;
            baseColorError = null;
        }
    }

    function resetThemeColors(): void {
        themeColorStore.reset();
        accentColorInput = defaultAccentColor;
        baseColorInput = "";
        accentColorError = null;
        baseColorError = null;
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
    {#if category === null}
        <div class="settings-header">
            <div class="first-row">
                <div class="site-title">
                    <span class="site-name">eHagaki</span>
                    <span class="cache-version"
                        >{swVersion ? `v${swVersion}` : ""}</span
                    >
                </div>
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
                    <div class="help-icon svg-icon" aria-hidden="true"></div>
                </Button>
            </div>
        </div>
    {/if}

    <div class="modal-body">
        {#if category}
            <div class="settings-category-back">
                <Button
                    variant="default"
                    shape="square"
                    contentLayout="icon"
                    className="settings-back-button"
                    ariaLabel={$_("settingsDialog.back")}
                    onClick={() => (category = null)}
                >
                    <span class="settings-back-icon svg-icon" aria-hidden="true"></span>
                </Button>
                <h2 class="settings-category-title">{$_(categoryLabelKey)}</h2>
            </div>
        {/if}
        {#if category === null}
        <!-- SW更新セクション -->
        {#if $swNeedRefresh || isStaleAssetReloadRequired}
            <div class="setting-section">
                <div class="setting-row sw-update-row">
                    <div class="setting-control">
                        <Button
                            variant="primary"
                            shape="rounded"
                            contentLayout="iconText"
                            className="sw-update-btn {isUpdating ||
                            (isSwInstalling && !isStaleAssetReloadRequired)
                                ? 'loading'
                                : ''}"
                            onClick={handleSwRefresh}
                            disabled={isUpdating || !canApplySwUpdate}
                            ariaLabel={isStaleAssetReloadRequired
                                ? $_("staleAsset.reload")
                                : $_("settingsDialog.update_app") ||
                                  "アプリを更新"}
                        >
                            {#if isUpdating ||
                            (isSwInstalling && !isStaleAssetReloadRequired)}
                                <LoadingPlaceholder
                                    showLoader={true}
                                    loaderSize={32}
                                    text={isSwInstalling
                                        ? $_(
                                              "settingsDialog.sw_update_installing_short",
                                          ) || "インストール中..."
                                        : $_("settingsDialog.updating") ||
                                          "更新中..."}
                                />
                            {:else}
                                <div
                                    class="rotate-right-icon svg-icon"
                                    aria-hidden="true"
                                ></div>
                                <span class="btn-text">
                                    {isStaleAssetReloadRequired
                                        ? $_("staleAsset.reload")
                                        : $_("settingsDialog.update_app") ||
                                          "更新"}
                                </span>
                            {/if}
                        </Button>
                    </div>
                </div>
            </div>
        {/if}

        <!-- 言語設定セクション -->
        <div class="setting-section">
            <div class="setting-row language-setting-row">
                <div class="setting-label-with-icon">
                    <span class="setting-label">{$_("settingsDialog.language_setting_label")}</span>
                </div>
                <div class="setting-control">
                    <Button
                        variant="default"
                        shape="rounded"
                        contentLayout="iconText"
                        className="lang-btn"
                        onClick={toggleLanguage}
                    >
                        <div
                            class="language-setting-icon setting-menu-icon setting-menu-mask-icon svg-icon"
                            aria-hidden="true"
                        ></div>
                        <span class="btn-text"
                            >{$_("settingsDialog.change") || "変更"}</span
                        >
                    </Button>
                </div>
            </div>
        </div>

        <nav class="settings-category-list" aria-label={$_("settings") || "設定"}>
            {#each settingsCategories as item (item.id)}
                <Button
                    variant="default"
                    shape="square"
                    className="settings-category-button"
                    onClick={() => (category = item.id)}
                >
                    <span class="settings-category-label">{$_(item.labelKey)}</span>
                    <span class="settings-category-chevron svg-icon" aria-hidden="true"></span>
                </Button>
            {/each}
        </nav>
        {/if}

        {#if category === "media"}
        <!-- 画像・動画圧縮設定セクション -->
        <SettingsCompressionSection
            {compressionPairs}
            selectedCompression={settingsStore.imageQualityLevel}
            onCompressionChange={(value) =>
                (settingsStore.imageQualityLevel = value)}
            {videoCompressionPairs}
            selectedVideoCompression={settingsStore.videoQualityLevel}
            onVideoCompressionChange={(value) =>
                (settingsStore.videoQualityLevel = value)}
        />

        <SettingsUploadDestinationSection {rxNostr} />
        {/if}

        {#if category === "display"}
        <!-- テーマ設定セクション -->
        <div class="setting-section">
            <div class="setting-row">
                <div class="setting-label-with-icon">
                    <span
                        class="setting-menu-icon setting-menu-mask-icon theme-setting-icon"
                        aria-hidden="true"
                    ></span>
                    <span id="theme-mode-label" class="setting-label"
                        >{$_("settingsDialog.theme_mode") || "カラーテーマ"}</span
                    >
                </div>
                <RadioGroup.Root
                    class="setting-control theme-mode-group"
                    name="themeMode"
                    orientation="horizontal"
                    value={themeModeStore.value}
                    aria-labelledby="theme-mode-label"
                    onValueChange={(value) => themeModeStore.set(value as "system" | "light" | "dark")}
                >
                    <RadioButton
                        value="system"
                        variant="default"
                        shape="rounded"
                        ariaLabel={$_("settingsDialog.theme_system") ||
                            "システム"}
                    >
                        {$_("settingsDialog.theme_system") || "システム"}
                    </RadioButton>
                    <RadioButton
                        value="light"
                        variant="default"
                        shape="rounded"
                        ariaLabel={$_("settingsDialog.theme_light") || "ライト"}
                    >
                        {$_("settingsDialog.theme_light") || "ライト"}
                    </RadioButton>
                    <RadioButton
                        value="dark"
                        variant="default"
                        shape="rounded"
                        ariaLabel={$_("settingsDialog.theme_dark") || "ダーク"}
                    >
                        {$_("settingsDialog.theme_dark") || "ダーク"}
                    </RadioButton>
                </RadioGroup.Root>
            </div>
        </div>

        {#if themeColorStore.isAvailable}
            <div class="setting-section color-settings-section">
                <span
                    class="setting-menu-icon setting-menu-mask-icon color-settings-icon"
                    aria-hidden="true"
                ></span>
                <div class="color-settings-content">
                    <div class="color-settings-heading-row">
                        <div class="setting-label-with-icon color-settings-heading">
                            <span class="setting-label">
                                {$_("settingsDialog.color")}
                            </span>
                        </div>
                        <Button
                            variant="default"
                            shape="rounded"
                            className="reset-theme-colors-btn"
                            onClick={resetThemeColors}
                        >
                            {$_("settingsDialog.reset_colors")}
                        </Button>
                    </div>
                    <div class="color-setting-row">
                        <div class="setting-label-group">
                            <label class="setting-label" for="accent-color-input">
                                {$_("settingsDialog.accent_color")}
                            </label>
                            <span class="setting-description">
                                {$_("settingsDialog.accent_color_description")}
                            </span>
                        </div>
                        <div class="color-setting-controls">
                            <input
                                aria-label={$_("settingsDialog.accent_color_picker")}
                                type="color"
                                value={normalizeHexColor(themeColorStore.accentColor) ?? defaultAccentColor}
                                oninput={(event) => handleColorPickerInput("accent", (event.currentTarget as HTMLInputElement).value)}
                            />
                            <input
                                id="accent-color-input"
                                aria-label={$_("settingsDialog.accent_color_hex")}
                                class="color-hex-input"
                                type="text"
                                inputmode="text"
                                autocomplete="off"
                                value={accentColorInput}
                                aria-invalid={accentColorError ? "true" : "false"}
                                oninput={(event) => handleColorInput("accent", (event.currentTarget as HTMLInputElement).value)}
                                onblur={() => handleColorBlur("accent")}
                            />
                        </div>
                    </div>
                    {#if accentColorError}
                        <span class="form-error" role="alert">{accentColorError}</span>
                    {/if}
                    <div class="color-setting-row">
                        <div class="setting-label-group">
                            <label class="setting-label" for="base-color-input">
                                {$_("settingsDialog.base_color")}
                            </label>
                            <span class="setting-description">
                                {$_("settingsDialog.base_color_description")}
                            </span>
                        </div>
                        <div class="color-setting-controls">
                            <input
                                aria-label={$_("settingsDialog.base_color_picker")}
                                type="color"
                                value={normalizeHexColor(themeColorStore.baseColor) ?? defaultBaseColorPickerValue}
                                oninput={(event) => handleColorPickerInput("base", (event.currentTarget as HTMLInputElement).value)}
                            />
                            <input
                                id="base-color-input"
                                aria-label={$_("settingsDialog.base_color_hex")}
                                class="color-hex-input"
                                type="text"
                                inputmode="text"
                                autocomplete="off"
                                placeholder="#RRGGBB"
                                value={baseColorInput}
                                aria-invalid={baseColorError ? "true" : "false"}
                                oninput={(event) => handleColorInput("base", (event.currentTarget as HTMLInputElement).value)}
                                onblur={() => handleColorBlur("base")}
                            />
                        </div>
                    </div>
                    {#if baseColorError}
                        <span class="form-error" role="alert">{baseColorError}</span>
                    {/if}
                </div>
            </div>
        {/if}
        {/if}

        {#if category === "media"}
        <!-- メディア自由配置モード設定セクション -->
        <div class="setting-section">
            <div class="setting-row">
                <div class="setting-label-with-icon">
                    <span
                        class="setting-menu-icon setting-menu-mask-icon media-placement-setting-icon"
                        aria-hidden="true"
                    ></span>
                    <span id="media-free-placement-label" class="setting-label"
                        >{$_("settingsDialog.media_bottom_mode") ||
                            "メディア自由配置モード"}</span
                    >
                </div>
                <div class="setting-control">
                    <Switch.Root
                        class="bui-switch"
                        bind:checked={settingsStore.mediaFreePlacement}
                        aria-labelledby="media-free-placement-label"
                    >
                        <Switch.Thumb class="bui-switch-thumb" />
                    </Switch.Root>
                </div>
            </div>
        </div>
        {/if}

        {#if category === "post"}
        <!-- client tag オプトアウト設定セクション -->
        <div class="setting-section">
            <div class="setting-row">
                <div class="setting-label-with-icon">
                    <span
                        class="setting-menu-icon setting-menu-mask-icon client-tag-setting-icon"
                        aria-hidden="true"
                    ></span>
                    <span id="client-tag-label" class="setting-label"
                        >{$_("settingsDialog.client_tag_label") ||
                            "投稿詳細にクライアント名をつける（Client tag）"}</span
                    >
                </div>
                <div class="setting-control">
                    <Switch.Root
                        class="bui-switch"
                        bind:checked={clientTagEnabled}
                        aria-labelledby="client-tag-label"
                    >
                        <Switch.Thumb class="bui-switch-thumb" />
                    </Switch.Root>
                </div>
            </div>
        </div>

        <div class="notification-group">
            <!-- 引用通知設定セクション -->
            <div class="setting-section">
                <div class="setting-row setting-row-with-note">
                    <div class="setting-label-group">
                        <div class="setting-label-row">
                            <div class="setting-label-with-icon">
                                <span
                                    class="setting-menu-icon setting-menu-mask-icon quote-setting-icon"
                                    aria-hidden="true"
                                ></span>
                                <span id="quote-notification-label" class="setting-label"
                                    >{$_(
                                        "settingsDialog.quote_notification_label",
                                    ) || "引用元の投稿者に通知"}</span
                                >
                            </div>
                            <InfoPopoverButton
                                side="top"
                                sideOffset={8}
                                ariaLabel={$_(
                                    "settingsDialog.quote_notification_description",
                                )}
                            >
                                {$_("settingsDialog.quote_notification_note") ||
                                    "引用投稿時、引用元の投稿者への通知をデフォルトで有効にします"}
                            </InfoPopoverButton>
                        </div>
                    </div>
                    <div class="setting-control">
                        <Switch.Root
                            class="bui-switch"
                            bind:checked={quoteNotificationEnabled}
                            aria-labelledby="quote-notification-label"
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
                            <div class="setting-label-with-icon">
                                <span
                                    class="setting-menu-icon setting-menu-mask-icon reply-setting-icon"
                                    aria-hidden="true"
                                ></span>
                                <span id="reply-notification-label" class="setting-label"
                                    >{$_(
                                        "settingsDialog.reply_notification_label",
                                    ) || "返信先以外にも通知"}</span
                                >
                            </div>
                            <InfoPopoverButton
                                side="top"
                                sideOffset={8}
                                ariaLabel={$_(
                                    "settingsDialog.reply_notification_description",
                                )}
                            >
                                {$_("settingsDialog.reply_notification_note") ||
                                    "リプライ時にリプライツリー内のほかの参加者をデフォルトで通知対象に含めます"}
                            </InfoPopoverButton>
                        </div>
                    </div>
                    <div class="setting-control">
                        <Switch.Root
                            class="bui-switch"
                            bind:checked={replyNotificationEnabled}
                            aria-labelledby="reply-notification-label"
                        >
                            <Switch.Thumb class="bui-switch-thumb" />
                        </Switch.Root>
                    </div>
                </div>
            </div>
        </div>

        <div class="setting-section">
            <div class="setting-row">
                <div class="setting-label-group">
                    <div class="setting-label-row">
                        <div class="setting-label-with-icon">
                            <span
                                class="setting-menu-icon setting-menu-mask-icon fail-closed-content-warning-setting-icon"
                                aria-hidden="true"
                            ></span>
                            <span id="fail-closed-content-warning-label" class="setting-label">
                                {$_("settingsDialog.fail_closed_content_warning_label")}
                            </span>
                        </div>
                        <InfoPopoverButton
                            side="top"
                            sideOffset={8}
                            ariaLabel={$_("settingsDialog.fail_closed_content_warning_info_label")}
                        >
                            {$_("settingsDialog.fail_closed_content_warning_info")}
                        </InfoPopoverButton>
                    </div>
                </div>
                <div class="setting-control">
                    <Switch.Root
                        class="bui-switch"
                        checked={settingsStore.failClosedContentWarning}
                        onCheckedChange={(checked) => (settingsStore.failClosedContentWarning = checked)}
                        aria-labelledby="fail-closed-content-warning-label"
                    >
                        <Switch.Thumb class="bui-switch-thumb" />
                    </Switch.Root>
                </div>
            </div>
        </div>
        {/if}

        {#if category === "display"}
        <!-- Footer shortcut slots -->
        <div class="setting-section footer-shortcut-settings">
            <div class="setting-label-with-icon footer-shortcuts-setting-heading">
                <span
                    class="setting-menu-icon setting-menu-mask-icon footer-shortcuts-setting-icon"
                    aria-hidden="true"
                ></span>
                <span class="setting-label">{$_("settingsDialog.footer_shortcuts")}</span>
            </div>
            <div class="footer-shortcut-slots">
                {#each ["left", "right"] as slot (slot)}
                    {@const side = slot as "left" | "right"}
                    <label class="footer-shortcut-slot" for={`footer-shortcut-${side}`}>
                        <span>{$_(`settingsDialog.footer_shortcuts_${side}`)}</span>
                        <select
                            id={`footer-shortcut-${side}`}
                            class="footer-shortcut-select"
                            value={footerSettingShortcutsStore.value[side] ?? ""}
                            onchange={(event) => handleFooterShortcutChange(side, event)}
                        >
                            <option value="">{$_("settingsDialog.footer_shortcuts_none")}</option>
                            {#each FOOTER_SETTING_SHORTCUTS as shortcut (shortcut.id)}
                                <option
                                    value={shortcut.id}
                                    disabled={shortcut.id === footerSettingShortcutsStore.value[side === "left" ? "right" : "left"]}
                                >{$_(shortcut.labelKey)}</option>
                            {/each}
                        </select>
                    </label>
                {/each}
            </div>
        </div>

        <div class="hide-mascot-flavor-group">
            <div class="setting-section">
                <div class="setting-row setting-row-with-note">
                    <div class="setting-label-group">
                        <div class="setting-label-row">
                            <div class="setting-label-with-icon">
                                <img
                                    class="setting-menu-icon mascot-setting-icon"
                                    src={resolveAppAssetUrl("ehagaki_icon.svg")}
                                    alt=""
                                    aria-hidden="true"
                                />
                                <span id="hide-mascot-label" class="setting-label"
                                    >{$_("settingsDialog.hide_mascot_label") ||
                                        "きってんを非表示"}</span
                                >
                            </div>
                            <InfoPopoverButton
                                side="top"
                                sideOffset={8}
                                ariaLabel={$_(
                                    "settingsDialog.hide_mascot_description",
                                )}
                            >
                                {$_("settingsDialog.hide_mascot_note") ||
                                    "オンにすると左上のマスコットを隠し、フレーバーテキストもあわせて非表示にします。"}
                            </InfoPopoverButton>
                        </div>
                    </div>
                    <div class="setting-control">
                        <Switch.Root
                            class="bui-switch"
                            checked={!settingsStore.showMascot}
                            onCheckedChange={(checked) => (settingsStore.showMascot = !checked)}
                            aria-labelledby="hide-mascot-label"
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
                            <div class="setting-label-with-icon">
                                <span
                                    class="setting-menu-icon setting-menu-mask-icon flavor-setting-icon"
                                    aria-hidden="true"
                                ></span>
                                <span id="hide-flavor-text-label" class="setting-label"
                                    >{$_("settingsDialog.hide_flavor_text_label") ||
                                        "フレーバーテキストを非表示"}</span
                                >
                            </div>
                            <InfoPopoverButton
                                side="top"
                                sideOffset={8}
                                ariaLabel={$_(
                                    "settingsDialog.hide_flavor_text_description",
                                )}
                            >
                                {!settingsStore.showMascot
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
                        {#if !settingsStore.showMascot}
                            <Switch.Root
                                class="bui-switch"
                                checked={effectiveHideFlavorText}
                                disabled
                                aria-labelledby="hide-flavor-text-label"
                            >
                                <Switch.Thumb class="bui-switch-thumb" />
                            </Switch.Root>
                        {:else}
                            <Switch.Root
                                class="bui-switch"
                                checked={effectiveHideFlavorText}
                                onCheckedChange={(checked) => (settingsStore.showFlavorText = !checked)}
                                aria-labelledby="hide-flavor-text-label"
                            >
                                <Switch.Thumb class="bui-switch-thumb" />
                            </Switch.Root>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
        {/if}

        {#if category === "nostr"}
        <SettingsRelaySection
            {relayConfig}
            {onRefreshRelaysAndProfile}
            {hostRelayConfigActive}
        />
        {#if getAppRuntimeEnvironment().runtimeKind === "standalone"}
            <SettingsLocalRelaySection />
        {/if}
        <div class="setting-section">
            <div class="setting-row setting-row-with-note">
                <div class="setting-label-group">
                    <div class="setting-label-row">
                        <div class="setting-label-with-icon">
                            <span
                                class="setting-menu-icon setting-menu-mask-icon external-nostr-client-setting-icon"
                                aria-hidden="true"
                            ></span>
                            <span
                                id="external-nostr-client-label"
                                class="setting-label"
                                >{$_("settingsDialog.external_nostr_client")}</span
                            >
                        </div>
                        <InfoPopoverButton
                            ariaLabel={$_(
                                "settingsDialog.external_nostr_client_description",
                            )}
                        >
                            {$_(
                                "settingsDialog.external_nostr_client_description",
                            )}
                        </InfoPopoverButton>
                    </div>
                </div>
                <select
                    class="setting-control external-nostr-client-select"
                    id="external-nostr-client-select"
                    value={externalNostrClient}
                    aria-labelledby="external-nostr-client-label"
                    onchange={(event) => {
                        externalNostrClient = (event.currentTarget as HTMLSelectElement)
                            .value as ExternalNostrClient;
                        externalNostrClientCustomUrlError = null;
                    }}
                >
                    {#each EXTERNAL_NOSTR_CLIENTS as client (client)}
                        <option value={client}>
                            {client === "custom"
                                ? $_("settingsDialog.external_nostr_client_custom")
                                : client === "nostter"
                                  ? "nostter"
                                : client === "njump"
                                  ? "njump"
                                  : client[0].toUpperCase() + client.slice(1)}
                        </option>
                    {/each}
                </select>
            </div>
            {#if externalNostrClient === "custom"}
                <div class="external-nostr-client-custom-url">
                    <label
                        for="external-nostr-client-custom-url-input"
                        class="setting-label"
                    >
                        {$_("settingsDialog.external_nostr_client_custom_url")}
                    </label>
                    <span
                        id="external-nostr-client-custom-url-description"
                        class="setting-description"
                    >
                        {$_(
                            "settingsDialog.external_nostr_client_custom_url_description",
                        )}
                    </span>
                    <input
                        id="external-nostr-client-custom-url-input"
                        type="url"
                        inputmode="url"
                        value={externalNostrClientCustomUrl}
                        aria-describedby="external-nostr-client-custom-url-description"
                        aria-invalid={externalNostrClientCustomUrlError
                            ? "true"
                            : "false"}
                        oninput={(event) =>
                            handleExternalNostrClientCustomUrlInput(
                                (event.currentTarget as HTMLInputElement).value,
                            )}
                    />
                    {#if externalNostrClientCustomUrlError}
                        <span class="form-error" role="alert">
                            {externalNostrClientCustomUrlError}
                        </span>
                    {/if}
                </div>
            {/if}
        </div>
        {:else if category === "about"}
        <div class="setting-section settings-about">
            <div class="setting-row">
                <span class="setting-label">{$_("settingsDialog.about_author_label")}</span>
                <div class="setting-control">
                    <a
                        class="settings-about-author-link"
                        href="https://lokuyow.github.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                        >{$_("settingsDialog.author_name")}</a
                    >
                </div>
            </div>
            <div class="setting-row">
                <span class="setting-label">{$_("settingsDialog.about_source_code_label")}</span>
                <div class="setting-control">
                    <Button
                        shape="circle"
                        variant="default"
                        className="github-link-btn"
                        onClick={() =>
                            window.open("https://github.com/Lokuyow/ehagaki", "_blank", "noopener")}
                        ariaLabel="GitHub Repository"
                    >
                        <div class="github-icon svg-icon" aria-hidden="true"></div>
                    </Button>
                </div>
            </div>
            <div class="setting-row">
                <span class="setting-label">{$_("settingsDialog.about_bitcoin_tip_label")}</span>
                <div class="setting-control">
                    <div class="zap-view-btn-group">
                        <button
                            class="zap-btn"
                            data-npub="npub1a3pvwe2p3v7mnjz6hle63r628wl9w567aw7u23fzqs062v5vqcqqu3sgh3"
                            data-note-id="naddr1qqxnzde4xsunzwpnxymrgwpsqgswcsk8v4qck0deepdtluag3a9rh0jh2d0wh0w9g53qg8a9x2xqvqqrqsqqql8kt67m30"
                            data-relays="wss://nos.lol,wss://nostr.bitcoiner.social,wss://relay.nostr.wirednet.jp,wss://yabu.me"
                        >
                            Support
                        </button>
                        <span class="divider"></span>
                        <button
                            class="view-btn"
                            data-title="Thanks for the Support!"
                            data-nzv-id="naddr1qqxnzde4xsunzwpnxymrgwpsqgswcsk8v4qck0deepdtluag3a9rh0jh2d0wh0w9g53qg8a9x2xqvqqrqsqqql8kt67m30"
                            data-zap-color-mode="true"
                            data-relay-urls="wss://nos.lol,wss://nostr.bitcoiner.social,wss://relay.nostr.wirednet.jp,wss://yabu.me"
                        >
                            View
                        </button>
                    </div>
                </div>
            </div>
        </div>
        {/if}
    </div>

    {#snippet footer()}
        <Dialog.Close>
            {#snippet child({ props })}
                <Button
                    {...props}
                    className="modal-close"
                    shape="square"
                    ariaLabel={$_("global.close")}
                >
                    <div class="xmark-icon svg-icon" aria-hidden="true"></div>
                </Button>
            {/snippet}
        </Dialog.Close>
    {/snippet}
</DialogWrapper>

<style>
    :global(.settings-dialog :where(button:not(.bui-switch))) {
        min-inline-size: 44px;
        min-block-size: 44px;
    }

    /* SettingsDialog固有: paddingなしのdialog-content */
    :global(.settings-dialog .dialog-content) {
        padding: 0;
    }

    :global(.settings-dialog .setting-label) {
        font-weight: normal;
    }

    .xmark-icon {
        mask-image: url("/icons/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
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
    :global(.github-link-btn.circle),
    :global(.help-btn.circle) {
        width: 44px;
        height: 44px;
        min-width: 44px;
        min-height: 44px;
        --btn-bg: var(--dialog-bg);
    }

    :global(.github-link-btn.circle) {
        .github-icon {
            mask-image: url("/icons/github-mark.svg");
            width: 26px;
            height: 26px;
        }
    }
    :global(.help-btn.circle) {
        :global(.help-icon) {
            mask-image: url("/icons/help_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg");
            width: 30px;
            height: 30px;
        }
    }
    .zap-view-btn-group {
        display: inline-flex;
        height: 44px;
        min-height: 44px;

        .zap-btn,
        .view-btn {
            min-width: 70px;
            min-height: 44px;
            height: 44px;
            background: var(--btn-bg);
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

    .language-setting-row .setting-label-with-icon {
        padding-inline-start: 12px;
    }

    .settings-category-list {
        display: flex;
        flex-direction: column;
        gap: 0;
    }

    :global(.settings-dialog button.settings-category-button) {
        width: 100%;
        justify-content: space-between;
        gap: 12px;
        min-height: 50px;
        height: 50px;
        padding-inline: 12px;
        border-radius: 0;
        border: none;
        font-weight: normal;
        --btn-bg: var(--dialog-bg);
        background-color: transparent;
        background-image: none;
    }

    @media (hover: hover) and (pointer: fine) {
        :global(.settings-dialog button.settings-category-button:hover:not(:disabled)) {
            background-color: var(--button-hover-bg);
            color: var(--button-hover-color);
        }

        :global(
                .settings-dialog
                    button.settings-category-button:hover:not(:disabled)
                    .settings-category-chevron
            ) {
            color: inherit;
            background-color: currentColor;
        }
    }

    .settings-category-label {
        min-width: 0;
        text-align: start;
        font-weight: normal;
    }

    .settings-category-chevron,
    .settings-back-icon {
        width: 24px;
        height: 24px;
        flex: 0 0 24px;
        background-color: currentColor;
    }

    .settings-category-chevron {
        color: var(--text-muted);
        --svg: var(--text-muted);
        mask-image: url("/icons/keyboard_arrow_right_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .settings-back-icon {
        mask-image: url("/icons/arrow_back_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    :global(.ehagaki-app-root .settings-dialog button.settings-back-button) {
        position: relative;
        display: inline-flex;
        width: 50px;
        height: 50px;
        min-width: 50px;
        min-height: 50px;
        flex: 0 0 50px;
        justify-content: flex-start;
        align-items: center;
        padding: 0;
        border: none;
        border-radius: 0;
        --btn-bg: transparent;
        background-color: transparent;
        background-image: none;
    }

    :global(.settings-category-back button.settings-back-button) .settings-back-icon {
        position: absolute;
        inset-inline-start: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 24px;
        height: 24px;
        inline-size: 24px;
        block-size: 24px;
        margin: 0;
        flex: none;
    }

    :global(.ehagaki-app-root .settings-dialog button.settings-back-button:hover:not(:disabled)),
    :global(.ehagaki-app-root .settings-dialog button.settings-back-button:active:not(:disabled)),
    :global(.ehagaki-app-root .settings-dialog button.settings-back-button:focus-visible) {
        --btn-bg: transparent;
        background-color: transparent;
        background-image: none;
        border: none;
    }

    .settings-category-back {
        display: flex;
        align-items: center;
        min-width: 0;
        min-height: 50px;
    }

    .settings-category-title {
        margin: 0;
        min-width: 0;
        font-size: 1.125rem;
        font-weight: 600;
        line-height: 1.3;
    }

    .settings-about-author-link {
        font-size: 1rem;
        color: var(--text-light);
        text-decoration: underline;
    }

    .modal-body {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 30px;
        width: 100%;
        overflow-y: auto;
    }
    .footer-shortcut-slots {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding-inline-start: calc(24px + var(--setting-label-icon-gap));
    }
    .footer-shortcut-slot { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .footer-shortcut-select {
        flex: 0 1 260px;
        min-width: 0;
        min-height: 44px;
        padding: 8px 32px 8px 10px;
        border: 1px solid var(--border);
        border-radius: 6px;
        background: var(--dialog-bg);
        color: var(--text);
    }
    .setting-label-with-icon {
        flex: 1 1 auto;
    }
    .language-setting-icon {
        mask-image: url("/icons/translate_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }
    .theme-setting-icon {
        mask-image: url("/icons/contrast_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg");
    }
    .media-placement-setting-icon {
        mask-image: url("/icons/open_with_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg");
    }
    .color-settings-icon {
        mask-image: url("/icons/colors_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg");
    }
    .external-nostr-client-setting-icon {
        mask-image: url("/icons/open_in_new_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }
    .footer-shortcuts-setting-icon {
        mask-image: url("/icons/vertical_align_bottom_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }
    .mascot-setting-icon {
        filter: grayscale(1);
        object-fit: contain;
    }
    .flavor-setting-icon {
        mask-image: url("/icons/chat_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg");
    }
    .quote-setting-icon {
        mask-image: url("/icons/format_quote_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }
    .reply-setting-icon {
        mask-image: url("/icons/chat_bubble_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }
    .client-tag-setting-icon {
        mask-image: url("/icons/label_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg");
    }
    .fail-closed-content-warning-setting-icon {
        mask-image: url("/icons/visibility_off_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }
    .setting-row-with-note {
        align-items: flex-start;
    }

    .setting-label-group,
    .hide-mascot-flavor-group,
    .notification-group {
        display: flex;
        flex-direction: column;
    }

    .setting-label-group {
        gap: 4px;
        min-width: 0;
        margin-block: auto;
    }

    .external-nostr-client-select {
        min-width: 160px;
        min-height: 44px;
        padding: 8px 32px 8px 10px;
        border: 1px solid var(--border);
        border-radius: 6px;
        background: var(--dialog-bg);
        color: var(--text);
        font: inherit;
    }

    .external-nostr-client-custom-url {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-top: 12px;
    }

    .external-nostr-client-custom-url input {
        width: 100%;
        min-height: 44px;
        padding: 8px 10px;
        border: 1px solid var(--border);
        border-radius: 6px;
        background: var(--dialog-bg);
        color: var(--text);
        font: inherit;
    }

    .external-nostr-client-custom-url input[aria-invalid="true"] {
        border-color: var(--danger);
    }

    .setting-description {
        color: var(--text-muted);
        font-size: 0.875rem;
        line-height: 1.4;
    }

    .form-error {
        color: var(--danger);
        font-size: 0.875rem;
        line-height: 1.4;
    }

    .setting-label-row {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
    }
    .setting-label-row .setting-label-with-icon {
        flex: 0 1 auto;
        max-width: calc(100% - 50px);
    }

    .rotate-right-icon {
        mask-image: url("/icons/refresh_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    :global(.bui-switch) {
        position: relative;
        display: inline-block;
        width: 90px;
        height: 44px;
        --btn-bg: var(--toggle-bg);
        background-color: var(--btn-bg);
        opacity: 0.2;
        border-radius: 50px;
        border: none;
        padding: 0;
        cursor: pointer;
        transition: opacity 0.2s;
        flex-shrink: 0;

        @media (hover: hover) and (pointer: fine) {
            &:hover:not(:disabled) {
                opacity: 0.15;
                background: var(--btn-bg);
                transition: none;
            }
        }
    }

    :global(button.bui-switch[data-state="checked"]) {
        opacity: 1;

        @media (hover: hover) and (pointer: fine) {
            &:hover:not(:disabled) {
                opacity: 0.9;
            }
        }
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
        translate: 0 0;
        transition: translate 0.2s cubic-bezier(0, 1, 0.5, 1);
        border-radius: 50%;
    }
    :global(.bui-switch[data-state="checked"] .bui-switch-thumb) {
        translate: 46px 0;
    }

    @media (prefers-reduced-motion: reduce) {
        :global(.bui-switch) {
            transition: none;
        }

        :global(.bui-switch-thumb) {
            transition: none;
        }
    }

    :global(.sw-update-btn.primary) {
        height: 54px;
        width: auto;
        padding: 12px 10px 12px 8px;
        flex-shrink: 0;
    }

    .sw-update-row {
        justify-content: flex-end;
    }

    :global(.sw-update-btn:disabled) {
        opacity: 0.6;
    }

    :global(.theme-mode-group) {
        display: flex;
        gap: 4px;
        flex-wrap: nowrap;

        :global(button) {
            min-width: 74px;
            min-height: 50px;
            padding: 8px 10px;
            font-size: 0.875rem;
            font-weight: normal;
        }
    }

    .color-settings-section {
        gap: 10px;
    }

    .color-settings-section {
        display: grid;
        grid-template-columns: 24px minmax(0, 1fr);
        column-gap: 16px;
        align-items: start;
    }

    .color-settings-content {
        display: flex;
        flex-direction: column;
        gap: 10px;
        min-width: 0;
    }

    .color-settings-heading-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        min-width: 0;
    }

    .color-settings-heading {
        min-height: 24px;
        flex: 1 1 auto;
        min-width: 0;
    }

    .color-setting-row,
    .color-setting-controls {
        display: flex;
        gap: 10px;
    }

    .color-setting-row {
        align-items: center;
        justify-content: space-between;
    }

    .color-setting-controls {
        align-items: center;
        flex-shrink: 0;
    }

    .color-setting-controls input[type="color"] {
        width: 44px;
        height: 44px;
        padding: 2px;
        border: 1px solid var(--border);
        border-radius: 6px;
        background: var(--dialog-bg);
        cursor: pointer;
    }

    .color-hex-input {
        width: 104px;
        min-height: 44px;
        padding: 8px 10px;
        border: 1px solid var(--border);
        border-radius: 6px;
        background: var(--dialog-bg);
        color: var(--text);
        font: inherit;
    }

    .color-hex-input[aria-invalid="true"] {
        border-color: var(--danger);
    }

    :global(.reset-theme-colors-btn.rounded) {
        flex-shrink: 0;
        min-height: 44px;
    }

    @media (max-width: 430px) {
        .color-setting-row {
            align-items: flex-start;
            flex-direction: column;
        }

        .color-setting-controls {
            align-self: flex-end;
        }
    }

    .footer-shortcut-settings {
        gap: 10px;
    }
</style>
