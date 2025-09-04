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

  // プロフィール画像のpreload処理
  function preloadProfileImage(src: string) {
    if (!src) return;

    // プロフィール画像のプリロード（Service Workerでキャッシュされる）
    const img = new Image();
    img.src = src;
  }

  // プロフィールデータが変更された時にプリロード
  $: if (profileData?.picture) {
    preloadProfileImage(profileData.picture);
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
      {#if profileData?.picture}
        <img
          src={profileData.picture}
          alt={getProfileAlt()}
          class="profile-picture"
          loading="lazy"
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
    gap: 4px;
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
