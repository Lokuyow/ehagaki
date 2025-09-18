<script lang="ts">
    import ProfileComponent from "./ProfileComponent.svelte";
    import FooterInfoDisplay from "./FooterInfoDisplay.svelte";
    import Button from "./Button.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import { _ } from "svelte-i18n";

    interface Props {
        isAuthenticated: boolean;
        isAuthInitialized: boolean;
        isLoadingProfile: boolean;
        profileLoaded: boolean;
        profileData: any;
        swNeedRefresh: boolean;
        onShowLoginDialog: () => void;
        onOpenSettingsDialog: () => void;
        onOpenLogoutDialog: () => void;
    }

    let {
        isAuthenticated,
        isAuthInitialized,
        isLoadingProfile,
        profileLoaded,
        profileData,
        swNeedRefresh,
        onShowLoginDialog,
        onOpenSettingsDialog,
        onOpenLogoutDialog,
    }: Props = $props();

    let footerInfoDisplayRef: any = $state();

    // 外部から呼び出せるようにメソッドをexport
    export function updateProgress(progress: number) {
        footerInfoDisplayRef?.updateProgress(progress);
    }
    export function reset() {
        footerInfoDisplayRef?.reset();
    }
</script>

<div class="footer-bar">
    {#if !isAuthInitialized}
        <Button
            shape="pill"
            className="profile-display loading"
            disabled={true}
        >
            <LoadingPlaceholder text="" showImage={true} />
        </Button>
    {:else if isAuthenticated && isLoadingProfile}
        <Button
            shape="pill"
            className="profile-display loading"
            disabled={true}
        >
            <LoadingPlaceholder text="" showImage={true} />
        </Button>
    {:else if isAuthenticated && (profileLoaded || isLoadingProfile)}
        <ProfileComponent
            {profileData}
            hasStoredKey={isAuthenticated}
            {isLoadingProfile}
            showLogoutDialog={onOpenLogoutDialog}
        />
    {:else if !isLoadingProfile && !isAuthenticated}
        <Button
            className="login-btn"
            variant="primary"
            shape="pill"
            onClick={onShowLoginDialog}
        >
            {$_("app.login")}
        </Button>
    {/if}

    <FooterInfoDisplay bind:this={footerInfoDisplayRef} />

    <Button
        variant="default"
        shape="circle"
        className="settings-btn {swNeedRefresh ? 'has-update' : ''}"
        onClick={onOpenSettingsDialog}
        ariaLabel="設定"
    >
        <div class="settings-icon svg-icon" aria-label="Settings"></div>
        {#if swNeedRefresh}
            <div class="update-indicator"></div>
        {/if}
    </Button>
</div>

<style>
    .footer-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        max-width: 800px;
        height: 66px;
        gap: 12px;
        margin: auto;
        padding: 8px;
        background: var(--bg-footer);
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        box-shadow: 0 -2px 8px var(--shadow);
        z-index: 99;
    }
    :global(.login-btn) {
        width: 140px;
        font-size: 1.1rem;
    }
    .settings-icon {
        mask-image: url("/ehagaki/icons/gear-solid-full.svg");
    }
    :global(.settings-btn.has-update) {
        position: relative;
    }
    .update-indicator {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 10px;
        height: 10px;
        background: var(--theme);
        border-radius: 50%;
        animation: pulse 2500ms cubic-bezier(0.3, 1, 0.5, 1) infinite;
    }
    @keyframes pulse {
        50% {
            opacity: 0;
        }
    }
    :global(.profile-display.loading) {
        opacity: 0.7;
        gap: 2px;
    }
</style>
