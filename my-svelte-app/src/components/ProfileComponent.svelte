<script lang="ts">
  import { _ } from "svelte-i18n";
  import type { ProfileData } from "../lib/profileManager";
  import Button from "./Button.svelte";

  export let profileData: ProfileData | null = null;
  export let profileLoaded = false;
  export let hasStoredKey = false;
  export let showLogoutDialog: () => void;
</script>

{#if hasStoredKey && profileLoaded}
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

<style>
  /* プロフィール表示のスタイル */
  :global(.profile-display) {
    gap: 4px;
    padding: 0 10px;
    z-index: 10;
    max-width: 140px;
  }

  .profile-picture {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }

  .profile-picture.default {
    /* SVGマスク表示に変更 */
    mask-image: url("/ehagaki/icons/circle-user-solid-full.svg");
    background-size: cover;
    background-position: center;
  }

  .profile-name {
    font-size: 0.9em;
    font-weight: 500;
    color: var(--text);
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
