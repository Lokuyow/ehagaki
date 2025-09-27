<script lang="ts">
  import { _ } from "svelte-i18n";
  import type { ProfileData } from "../lib/types";
  import Button from "./Button.svelte";
  import LoadingPlaceholder from "./LoadingPlaceholder.svelte";

  export const profileLoaded = false;
  interface Props {
    profileData?: ProfileData | null;
    hasStoredKey?: boolean;
    showLogoutDialog: () => void;
    isLoadingProfile?: boolean;
  }

  let {
    profileData = null,
    hasStoredKey = false,
    showLogoutDialog,
    isLoadingProfile = false,
  }: Props = $props();

  // プロフィール画像読み込みエラー状態
  let imageLoadError = $state(false);

  // プロフィール画像のaltテキスト取得
  const getProfileAlt = () =>
    profileData?.name
      ? profileData.name
      : profileData?.npub
        ? profileData.npub
        : "User";

  // プロフィール名取得
  const getProfileName = () =>
    profileData?.name && profileData.name !== ""
      ? profileData.name
      : profileData?.npub
        ? profileData.npub
        : "User";

  // 画像読み込みエラーハンドラ
  function handleImageError(event: Event) {
    console.log("プロフィール画像の読み込みに失敗しました:", event);
    imageLoadError = true;

    // Service Workerが利用可能な場合、キャッシュの問題かどうかをチェック
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      console.log("Service Workerによるキャッシュ処理の可能性があります");
    }
  }

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
    }
  });
</script>

{#if hasStoredKey}
  <Button
    variant="default"
    shape="pill"
    className={`profile-display${isLoadingProfile ? " loading" : ""}`}
    disabled={isLoadingProfile}
    onClick={() => {
      if (!isLoadingProfile) showLogoutDialog();
    }}
  >
    {#if isLoadingProfile}
      <LoadingPlaceholder text={$_("loading")} showImage={true} />
    {:else}
      {#if profileData?.picture && !imageLoadError}
        <img
          src={profileData.picture}
          alt={getProfileAlt()}
          class="profile-picture"
          loading="lazy"
          crossorigin="anonymous"
          referrerpolicy="no-referrer"
          onerror={handleImageError}
        />
      {:else}
        <div class="profile-picture default svg-icon" aria-label="User"></div>
      {/if}
      <span class="profile-name">{getProfileName()}</span>
    {/if}
  </Button>
{/if}

<style>
  /* プロフィール表示のスタイル */
  :global(.default.pill.profile-display) {
    gap: 6px;
    padding: 0 10px 0 4px;
    z-index: 10;
    border: none;
  }

  .profile-picture {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    object-fit: cover;
  }

  .profile-picture.default {
    mask-image: url("/icons/circle-user-solid-full.svg");
    width: 42px;
    height: 42px;
  }

  .profile-name {
    font-size: 1rem;
    font-weight: 500;
    color: var(--text);
    max-width: 85px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
