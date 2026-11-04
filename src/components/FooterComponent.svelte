<script lang="ts">
    import FooterInfoDisplay from "./FooterMiddleDisplay.svelte";
    import Button from "./Button.svelte";
    import FooterSettingShortcutButton from "./FooterSettingShortcutButton.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import ProfileAvatar from "./ProfileAvatar.svelte";
    import { authState } from "../stores/authStore.svelte";
    import { _ } from "svelte-i18n";
    import {
        profileDataStore,
        isLoadingProfileStore,
        profileLoadedStore,
    } from "../stores/profileStore.svelte";
    import { isSameOriginProfilePictureUrl } from "../lib/profilePictureUrlUtils";
    import { footerSettingShortcutsStore } from "../stores/footerSettingShortcutsStore.svelte";

    import { notificationStore } from "../stores/notificationStore.svelte";
    import { resolveAppAssetUrl } from "../lib/appAssetUrl";
    interface Props {
        isAuthenticated: boolean;
        isAuthInitialized: boolean;
        isSwitchingAccount: boolean;
        profilePending?: boolean;
        swNeedRefresh: boolean;
        onShowLoginDialog: () => void;
        onPreloadPostHistoryDialog?: () => void;
        onOpenPostHistoryDialog: (trigger?: HTMLElement) => void;
        onOpenNotificationDialog?: (trigger: HTMLElement) => void;
        onOpenSettingsDialog: () => void;
        onOpenLogoutDialog: () => void;
    }

    let {
        isAuthenticated,
        isAuthInitialized,
        isSwitchingAccount,
        profilePending = false,
        swNeedRefresh,
        onShowLoginDialog,
        onPreloadPostHistoryDialog = undefined,
        onOpenPostHistoryDialog,
        onOpenNotificationDialog,
        onOpenSettingsDialog,
        onOpenLogoutDialog,
    }: Props = $props();

    let compact = $state(false);
    function observeFooter(node: HTMLElement) {
        compact = node.clientWidth > 0 && node.clientWidth <= 336;
        if (typeof ResizeObserver === "undefined") return;
        const observer = new ResizeObserver(([entry]) => { compact = entry.contentRect.width <= 320; });
        observer.observe(node);
        return () => observer.disconnect();
    }

    // ストアから直接プロフィール情報を取得
    let profileData = $derived(profileDataStore.value);
    let isLoadingProfile = $derived(isLoadingProfileStore.value);
    let profileLoaded = $derived(profileLoadedStore.value);

    // プロフィール画像のaltテキスト取得
    const getProfileAlt = () =>
        profileData?.displayName
            ? profileData.displayName
            : profileData?.name
              ? profileData.name
              : profileData?.npub
                ? profileData.npub
                : $_("profileDialog.profile_image_alt");

    let settingsButtonAriaLabel = $derived(
        swNeedRefresh
            ? `${$_("settingsDialog.info_header_setting")}, ${$_("settingsDialog.sw_update_available")}`
            : $_("settingsDialog.info_header_setting"),
    );

    function handleAvatarLoadingStatusChange(
        status: "loading" | "loaded" | "error",
    ) {
        if (
            status === "error" &&
            profileData?.picture &&
            "serviceWorker" in navigator &&
            navigator.serviceWorker.controller
        ) {
            console.log("Service Workerによるキャッシュ処理の可能性があります");
        }
    }

    // 同一オリジン判定（外部テストからも利用できる純粋関数としてエクスポート）
    export function isSameOriginPictureUrl(
        pictureUrl: string | undefined | null,
    ): boolean {
        return isSameOriginProfilePictureUrl(pictureUrl);
    }

    function handlePostHistoryIntent(): void {
        onPreloadPostHistoryDialog?.();
    }
</script>

{#snippet notificationShortcut()}
    {#if isAuthenticated && onOpenNotificationDialog}
        <Button variant="default" shape="circle" contentLayout="icon" className="notification-btn footer-setting-shortcut-button"
            onClick={(event) => onOpenNotificationDialog?.(event.currentTarget as HTMLElement)}
            ariaLabel={$_(notificationStore.hasUnread ? "notifications.openUnread" : "notifications.open")}>
            <div class="notification-icon svg-icon" aria-hidden="true"
                style:mask-image={`url("${resolveAppAssetUrl('icons/notifications_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg')}")`}></div>
            {#if notificationStore.hasUnread}<span class="notification-badge" aria-hidden="true"></span>{/if}
        </Button>
    {/if}
{/snippet}

<div class="footer-bar" class:compact {@attach observeFooter}>
    {#if isSwitchingAccount}
        <Button
            variant="default"
            shape="circle"
            className="profile-display loading"
            disabled={true}
            aria-busy="true"
            ariaLabel={$_("profileDialog.switching_account")}
        >
            <LoadingPlaceholder
                showLoader={true}
                variant="spinner"
                loaderSize={24}
            />
        </Button>
    {:else if !isAuthInitialized}
        <Button
            variant="default"
            shape="circle"
            className="profile-display loading"
            onClick={onOpenLogoutDialog}
            ariaLabel={$_("profileDialog.title")}
        >
            <LoadingPlaceholder
                showLoader={true}
                variant="spinner"
                loaderSize={24}
            />
        </Button>
    {:else if isAuthenticated && isLoadingProfile}
        <Button
            variant="default"
            shape="circle"
            className="profile-display loading"
            onClick={onOpenLogoutDialog}
            ariaLabel={$_("profileDialog.title")}
        >
            <LoadingPlaceholder
                showLoader={true}
                variant="spinner"
                loaderSize={24}
            />
        </Button>
    {:else if isAuthenticated && profileLoaded}
        <Button
            variant="default"
            shape="circle"
            className="profile-display"
            onClick={onOpenLogoutDialog}
            ariaLabel={$_("profileDialog.title")}
        >
            <ProfileAvatar
                pubkeyHex={authState.value.pubkey}
                displayName={profileData?.displayName} name={profileData?.name}
                showLoadingIndicator
                pending={profilePending}
                src={profileData?.picture || ""}
                alt={getProfileAlt()}
                rootClassName="profile-picture"
                imageClassName="profile-picture-image"
                fallbackClassName="profile-picture-fallback"
                fallbackAriaLabel={$_("profileDialog.profile_image_fallback")}
                onLoadingStatusChange={handleAvatarLoadingStatusChange}
            />
        </Button>
    {:else if !isLoadingProfile && !isAuthenticated}
        <Button
            className="login-btn"
            variant="primary"
            shape="pill"
            contentLayout="iconText"
            onClick={onShowLoginDialog}
        >
            <div class="login-icon svg-icon"></div>
            <span class="btn-text">{$_("app.login")}</span>
        </Button>
    {/if}

    <FooterInfoDisplay>
        {#snippet fallback()}
            <div class="footer-setting-controls"
                class:single-shortcut={isAuthenticated && !!footerSettingShortcutsStore.value.left !== !!footerSettingShortcutsStore.value.right}
                class:left-shortcut={!!footerSettingShortcutsStore.value.left}
                class:right-shortcut={!!footerSettingShortcutsStore.value.right}>
                {#if footerSettingShortcutsStore.value.left}
                    {#if footerSettingShortcutsStore.value.left === 'notifications'}
                        {@render notificationShortcut()}
                    {:else}
                        <FooterSettingShortcutButton shortcutId={footerSettingShortcutsStore.value.left} />
                    {/if}
                {/if}
                {#if isAuthenticated}
                    <Button
                        variant="default"
                        shape="pill"
                        contentLayout="icon"
                        className="post-history-btn"
                        onmouseenter={handlePostHistoryIntent}
                        onfocus={handlePostHistoryIntent}
                        onpointerdown={handlePostHistoryIntent}
                        onClick={(event) => onOpenPostHistoryDialog(event.currentTarget as HTMLElement)}
                        ariaLabel={$_("postHistory.open")}
                    >
                        <div class="post-history-icon svg-icon" aria-hidden="true"></div>
                    </Button>
                {/if}
                {#if footerSettingShortcutsStore.value.right}
                    {#if footerSettingShortcutsStore.value.right === 'notifications'}
                        {@render notificationShortcut()}
                    {:else}
                        <FooterSettingShortcutButton shortcutId={footerSettingShortcutsStore.value.right} />
                    {/if}
                {/if}
            </div>
        {/snippet}
    </FooterInfoDisplay>

    <Button
        variant="default"
        shape="circle"
        contentLayout="icon"
        className="settings-btn {swNeedRefresh ? 'has-update' : ''}"
        onClick={onOpenSettingsDialog}
        ariaLabel={settingsButtonAriaLabel}
    >
        <div class="settings-icon svg-icon" aria-hidden="true"></div>
        {#if swNeedRefresh}
            <div class="update-indicator"></div>
        {/if}
    </Button>
</div>

<style>
    :global(:root.light .ehagaki-app-root :where(.footer-bar button):not(.login-btn):not(.profile-display)),
    :global(:host(.light) .ehagaki-app-root :where(.footer-bar button):not(.login-btn):not(.profile-display)) {
        --btn-bg: var(--base-color-surface-button, var(--surface-editor));
    }
    :global(:root.light .ehagaki-app-root .footer-bar button.profile-display),
    :global(:host(.light) .ehagaki-app-root .footer-bar button.profile-display) {
        --btn-bg: var(--surface-editor);
    }
    .footer-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        max-width: 800px;
        height: var(--footer-height);
        gap: 6px;
        margin: auto;
        padding: 8px;
        background: var(--bg-footer);
        position: var(--app-overlay-position);
        left: 0;
        right: 0;
        bottom: var(--footer-bottom);
        z-index: 99;
        transition: bottom 0.2s ease;
    }

    :global(.login-btn) {
        width: 140px;
        font-size: 1.1rem;
        min-width: 50px;

        .login-icon {
            mask-image: url("/icons/login_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
            width: 24px;
            height: 24px;
        }
    }

    :global(.settings-btn.default),
    :global(button.profile-display.default) {
        width: 50px;
        height: 50px;
    }

    .settings-icon {
        mask-image: url("/icons/settings_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }
    .post-history-icon {
        mask-image: url("/icons/history_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }
    .footer-setting-controls {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        gap: 6px;
        flex: 1 1 auto;
        min-width: 0;
        height: 100%;
    }
    .footer-setting-controls.single-shortcut {
        --shortcut-space: 72px;
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(44px, min(200px, calc(100% - 2 * var(--shortcut-space) - 12px))) minmax(0, 1fr);
    }
    .single-shortcut :global(.post-history-btn.default) {
        grid-column: 2;
        grid-row: 1;
        width: 100%;
    }
    .single-shortcut :global(.footer-setting-shortcut-button) {
        grid-row: 1;
        justify-self: center;
    }
    .single-shortcut.left-shortcut :global(.footer-setting-shortcut-button) { grid-column: 1; }
    .single-shortcut.right-shortcut :global(.footer-setting-shortcut-button) { grid-column: 3; }
    .compact .footer-setting-controls.single-shortcut { --shortcut-space: 44px; }
    :global(.post-history-btn.default) {
        background-color: var(--btn-bg);
        max-width: 200px;
        height: 50px;
        flex: 1 1 auto;
        min-width: 0;

        :global(.svg-icon) {
            width: 32px;
            height: 32px;
        }
    }
    .compact .footer-setting-controls { gap: 4px; }
    .compact :global(.footer-setting-controls button.footer-setting-shortcut-button),
    .compact :global(.footer-setting-controls button.post-history-btn),
    .compact :global(.footer-setting-controls button.notification-btn) {
        width: 32px; min-width: 0; flex: 1 1 32px; padding-inline: 0;
    }
    .compact .single-shortcut :global(button.post-history-btn) { width: 100%; }
    .compact :global(.footer-setting-controls .quality-shortcut-label) { display: none; }
    .compact :global(.footer-setting-controls .svg-icon) { width: 24px; height: 24px; }
    .compact :global(.footer-setting-controls .paired-icons) { width: 30px; flex-basis: 30px; gap: 2px; }
    .compact :global(.footer-setting-controls .paired-icons .svg-icon) { width: 14px; height: 20px; }
    :global(.notification-btn.default) { position: relative; width: 50px; height: 50px; min-width: 50px; flex: 0 0 50px; padding: 0; }
    .compact :global(.footer-setting-controls button.notification-btn) { width: 44px; height: 44px; min-width: 44px; flex: 0 0 44px; }
    .notification-icon { width: 24px; height: 24px; }
    .notification-badge { position: absolute; inset: 5px 5px auto auto; width: 9px; height: 9px;
        border-radius: 50%; background: var(--theme); pointer-events: none; }
    :global(.settings-btn.has-update) {
        position: relative;
    }
    .update-indicator {
        position: absolute;
        inset: 8px 8px auto auto;
        width: 10px;
        height: 10px;
        background: var(--theme);
        border-radius: 50%;
        animation: pulse 2600ms linear infinite;
    }

    @media (prefers-reduced-motion: reduce) {
        .footer-bar {
            transition: none;
        }

        .update-indicator {
            animation: none;
            opacity: 1;
        }
    }

    @keyframes pulse {
        0% {
            opacity: 1;
            animation-timing-function: cubic-bezier(
                0.4,
                0.1,
                0.8,
                0.6
            ); /* 滅 */
        }
        50% {
            opacity: 0;
            animation-timing-function: cubic-bezier(0, 0.8, 0.5, 1); /* 点 */
        }
        100% {
            opacity: 1;
        }
    }
    /* :global(.profile-display.loading) {
        gap: 2px;
    } */

    /* プロフィール表示のスタイル */
    :global(button.profile-display.default) {
        flex: 0 0 auto;
        z-index: 10;

        @media (hover: hover) and (pointer: fine) {
            &:hover:not(:disabled) {
                opacity: 0.85;
                background: var(--btn-bg);
            }
        }
    }

    :global(.profile-picture),
    :global(.profile-picture-image),
    :global(.profile-picture-fallback) {
        width: 100%;
        height: 100%;
    }

    :global(.profile-picture),
    :global(.profile-picture-image) {
        border-radius: 50%;
    }

    :global(.profile-picture) {
        overflow: hidden;
    }

    :global(.profile-picture-image) {
        object-fit: cover;
    }
</style>
