<script lang="ts">
  import { _ } from "svelte-i18n";
  import type { ProfileData } from "../lib/profileManager";
  import Button from "./Button.svelte";
  import LoadingPlaceholder from "./LoadingPlaceholder.svelte";

  export let profileData: ProfileData | null = null;
  export const profileLoaded = false;
  export let hasStoredKey = false;
  export let showLogoutDialog: () => void;
  export let isLoadingProfile: boolean = false;

  // プロフィール画像読み込みエラー状態
  let imageLoadError = false;

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
    console.log('プロフィール画像の読み込みに失敗しました:', event);
    imageLoadError = true;
  }

  // プロフィールデータが変更されたら画像エラー状態をリセット
  $: if (profileData?.picture) {
    imageLoadError = false;
  }
</script>

{#if hasStoredKey}
  <Button
    className={`profile-display btn-round${isLoadingProfile ? " loading" : ""}`}
    disabled={isLoadingProfile}
    on:click={() => {
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
          on:error={handleImageError}
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
  :global(.profile-display) {
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
    mask-image: url("/ehagaki/icons/circle-user-solid-full.svg");
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
