<script lang="ts">
  import { _ } from "svelte-i18n";
  import type { ProfileData } from "../lib/profileManager";

  export let profileData: ProfileData | null = null;
  export let profileLoaded = false;
  export let hasStoredKey = false;
  export let showLogoutDialog: () => void;
</script>

{#if hasStoredKey && profileLoaded}
  <div
    class="profile-display btn-pill"
    on:click={showLogoutDialog}
    on:keydown={(e) => e.key === "Enter" && showLogoutDialog()}
    role="button"
    tabindex="0"
  >
    <img
      src={profileData?.picture && profileData.picture !== ""
        ? profileData.picture
        : "/ehagaki/icons/circle-user-solid-full.svg"}
      alt={profileData?.name
        ? profileData.name
        : profileData?.npub
          ? profileData.npub
          : "User"}
      class="profile-picture"
    />
    <span class="profile-name">
      {profileData?.name && profileData.name !== ""
        ? profileData.name
        : profileData?.npub
          ? profileData.npub
          : "User"}
    </span>
  </div>
{/if}

<style>
  /* プロフィール表示のスタイル */
  .profile-display {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    z-index: 10;
    background: #fff;
    border: 1px solid #ccc;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    max-width: 140px;
  }

  .profile-display:hover {
    background: rgba(240, 240, 240, 0.9);
  }

  .profile-picture {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }

  .profile-name {
    font-size: 0.9em;
    font-weight: 500;
    color: #333;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
