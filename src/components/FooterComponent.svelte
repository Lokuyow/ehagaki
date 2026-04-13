<script lang="ts">
    import FooterInfoDisplay from "./FooterMiddleDisplay.svelte";
    import Button from "./Button.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import ProfileAvatar from "./ProfileAvatar.svelte";
    import { _ } from "svelte-i18n";
    import {
        profileDataStore,
        isLoadingProfileStore,
        profileLoadedStore,
    } from "../stores/profileStore.svelte";

    interface Props {
        isAuthenticated: boolean;
        isAuthInitialized: boolean;
        swNeedRefresh: boolean;
        onShowLoginDialog: () => void;
        onOpenSettingsDialog: () => void;
        onOpenLogoutDialog: () => void;
    }

    let {
        isAuthenticated,
        isAuthInitialized,
        swNeedRefresh,
        onShowLoginDialog,
        onOpenSettingsDialog,
        onOpenLogoutDialog,
    }: Props = $props();

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
                : "User";

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
        if (!pictureUrl) return false;
        try {
            const picUrl = new URL(pictureUrl, location.href);
            return picUrl.origin === location.origin;
        } catch (e) {
            return false;
        }
    }

    // プロフィール画像が同一オリジンかどうか（クロスオリジンなら SW の no-cors キャッシュと整合するため crossorigin を付けない）
    let isSameOriginPicture = $state(false);

    // プロフィールデータが変更されたら画像エラー状態をリセット
    $effect(() => {
        if (profileData?.picture) {
            // Service Workerでのキャッシュ処理をログ出力
            if (
                "serviceWorker" in navigator &&
                navigator.serviceWorker.controller &&
                profileData.picture.includes("profile=true")
            ) {
                console.log(
                    "Service Workerでプロフィール画像をキャッシュ処理予定:",
                    profileData.picture,
                );
            }

            // 同一オリジン判定（失敗時は外部オリジン扱い）
            isSameOriginPicture = isSameOriginPictureUrl(profileData.picture);
        } else {
            isSameOriginPicture = false;
        }
    });
</script>

<div class="footer-bar">
    {#if !isAuthInitialized}
        <Button
            shape="circle"
            className="profile-display loading"
            disabled={true}
        >
            <LoadingPlaceholder showLoader={true} />
        </Button>
    {:else if isAuthenticated && isLoadingProfile}
        <Button
            shape="circle"
            className="profile-display loading"
            disabled={true}
        >
            <LoadingPlaceholder showLoader={true} />
        </Button>
    {:else if isAuthenticated && (profileLoaded || isLoadingProfile)}
        <Button
            variant="default"
            shape="circle"
            className={`profile-display${isLoadingProfile ? " loading" : ""}`}
            disabled={isLoadingProfile}
            onClick={() => {
                if (!isLoadingProfile) onOpenLogoutDialog();
            }}
        >
            {#if isLoadingProfile}
                <LoadingPlaceholder showLoader={true} />
            {:else}
                <ProfileAvatar
                    src={profileData?.picture || ""}
                    alt={getProfileAlt()}
                    rootClassName="profile-picture"
                    imageClassName="profile-picture-image"
                    fallbackClassName="profile-picture-fallback"
                    fallbackAriaLabel="User"
                    onLoadingStatusChange={handleAvatarLoadingStatusChange}
                    crossorigin={isSameOriginPicture ? "anonymous" : undefined}
                    referrerpolicy={isSameOriginPicture
                        ? "no-referrer"
                        : undefined}
                />
            {/if}
        </Button>
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

    <FooterInfoDisplay />

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
        z-index: 99;
    }
    :global(.login-btn) {
        width: 140px;
        font-size: 1.1rem;
    }

    :global(.settings-btn.default) {
        width: 50px;
        height: 50px;
    }

    .settings-icon {
        mask-image: url("/icons/gear-solid-full.svg");
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
        animation: pulse 2600ms linear infinite;
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
    :global(.profile-display.loading) {
        opacity: 0.7;
        gap: 2px;
    }

    /* プロフィール表示のスタイル */
    :global(.profile-display.default) {
        width: 50px;
        height: 50px;
        z-index: 10;

        &:hover:not(:disabled) {
            filter: brightness(94%);
        }
    }

    :global(.profile-picture) {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        overflow: hidden;
    }

    :global(.profile-picture-image) {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
    }

    :global(.profile-picture-fallback) {
        width: 100%;
        height: 100%;
    }
</style>
