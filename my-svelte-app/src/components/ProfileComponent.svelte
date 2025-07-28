<script lang="ts">
  import { _ } from "svelte-i18n";
  import type { ProfileData } from "../lib/profileManager";

  export let profileData: ProfileData | null = null;
  export let profileLoaded = false;
  export let hasStoredKey = false;
  export let showLoginDialog: () => void;
  export let showLogoutDialog: () => void;
</script>

{#if hasStoredKey && profileLoaded}
  <div
    class="profile-display"
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
{:else}
  <button class="login-btn" on:click={showLoginDialog}>
    {hasStoredKey ? $_("logged_in") : $_("login")}
  </button>
{/if}

<style>
  .login-btn {
    width: 110px;
    height: 100%;
    padding: 0.5em 1.2em;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
    background: #646cff;
    color: #fff;
    cursor: pointer;
    z-index: 10;
    box-shadow: 0 2px 8px #0001;
    transition: background 0.2s;
  }
  .login-btn:hover {
    background: #535bf2;
  }

  /* プロフィール表示のスタイル */
  .profile-display {
    display: flex;
    align-items: center;
    gap: 4px;
    z-index: 10;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 20px;
    padding: 5px 12px 5px 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: background-color 0.2s;
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
