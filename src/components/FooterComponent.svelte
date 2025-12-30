<script lang="ts">
    import FooterInfoDisplay from "./FooterMiddleDisplay.svelte";
    import Button from "./Button.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import { _ } from "svelte-i18n";
    import {
        profileDataStore,
        isLoadingProfileStore,
        profileLoadedStore,
    } from "../stores/appStore.svelte";

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

    let footerInfoDisplayRef: any = $state();

    // プロフィール画像読み込みエラー状態
    let imageLoadError = $state(false);

    // プロフィール画像のaltテキスト取得
    const getProfileAlt = () =>
        profileData?.name
            ? profileData.name
            : profileData?.npub
              ? profileData.npub
              : "User";

    // 画像読み込みエラーハンドラ
    function handleImageError(event: Event) {
        console.log("プロフィール画像の読み込みに失敗しました:", event);
        imageLoadError = true;

        // Service Workerが利用可能な場合、キャッシュの問題かどうかをチェック
        if (
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
            imageLoadError = false;

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
            {:else if profileData?.picture && !imageLoadError}
                <img
                    src={profileData.picture}
                    alt={getProfileAlt()}
                    class="profile-picture"
                    loading="lazy"
                    {...isSameOriginPicture
                        ? {
                              crossorigin: "anonymous",
                              referrerpolicy: "no-referrer",
                          }
                        : {}}
                    onerror={handleImageError}
                />
            {:else}
                <div
                    class="profile-picture default svg-icon"
                    aria-label="User"
                ></div>
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

    .profile-picture {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
    }

    .profile-picture.default {
        mask-image: url("/icons/circle-user-solid-full.svg");
        width: 100%;
        height: 100%;
    }
</style>
