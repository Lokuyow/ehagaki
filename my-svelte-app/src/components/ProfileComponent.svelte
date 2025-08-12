<script lang="ts">
  import { _ } from "svelte-i18n";
  import type { ProfileData } from "../lib/profileManager";
  import Button from "./Button.svelte";
  import LoadingPlaceholder from "./LoadingPlaceholder.svelte";

  export let profileData: ProfileData | null = null;
  export const profileLoaded = false;
  export let hasStoredKey = false;
  export let showLogoutDialog: () => void;
  export let isLoadingProfile = false;

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
    padding: 0 10px;
    z-index: 10;
    width: 140px;
  }

  .profile-picture {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }

  .profile-picture.default {
    mask-image: url("/ehagaki/icons/circle-user-solid-full.svg");
  }

  .profile-name {
    font-size: 1em;
    font-weight: 500;
    color: var(--text);
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
