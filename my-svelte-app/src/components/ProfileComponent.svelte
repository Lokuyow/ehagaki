<script lang="ts">
  import { _ } from "svelte-i18n";
  import type { ProfileData } from "../lib/profileManager";
  import Button from "./Button.svelte";

  export let profileData: ProfileData | null = null;
  export let profileLoaded = false;
  export let hasStoredKey = false;
  export let showLogoutDialog: () => void;
  export let isLoadingProfile = false; // 追加: プロフィール読み込み状態
</script>

{#if hasStoredKey}
  {#if isLoadingProfile}
    <!-- プロフィール読み込み中のプレースホルダー -->
    <Button className="profile-display btn-round loading" disabled={true}>
      <div class="profile-picture placeholder" aria-label="Loading"></div>
      <span class="profile-name placeholder-text">読み込み中...</span>
    </Button>
  {:else if profileLoaded}
    <!-- 既存のプロフィール表示 -->
    <Button className="profile-display btn-round" on:click={showLogoutDialog}>
      {#if profileData?.picture && profileData.picture !== ""}
        <img
          src={profileData.picture}
          alt={profileData?.name
            ? profileData.name
            : profileData?.npub
              ? profileData.npub
              : "User"}
          class="profile-picture"
        />
      {:else}
        <div class="profile-picture default svg-icon" aria-label="User"></div>
      {/if}
      <span class="profile-name">
        {profileData?.name && profileData.name !== ""
          ? profileData.name
          : profileData?.npub
            ? profileData.npub
            : "User"}
      </span>
    </Button>
  {/if}
{/if}

<style>
  /* プロフィール表示のスタイル */
  :global(.profile-display) {
    gap: 4px;
    padding: 0 10px;
    z-index: 10;
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
    font-size: 0.9em;
    font-weight: 500;
    color: var(--text);
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* プレースホルダー用のスタイルを追加 */
  :global(.profile-display.loading) {
    cursor: default;
    opacity: 0.7;
  }

  .profile-picture.placeholder {
    background: var(--border);
    border-radius: 50%;
    animation: pulse 1.5s ease-in-out infinite;
  }

  .placeholder-text {
    color: var(--text);
    opacity: 0.6;
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.6;
    }
    50% {
      opacity: 0.3;
    }
  }
</style>
