<script lang="ts">
  import { _ } from 'svelte-i18n';
  import type { ProfileData } from '../lib/profileManager';
  
  export let profileData: ProfileData | null = null;
  export let profileLoaded = false;
  export let hasStoredKey = false;
  export let showLoginDialog: () => void;
</script>

{#if hasStoredKey && profileLoaded && profileData?.picture}
  <div class="profile-display">
    <img 
      src={profileData.picture} 
      alt={profileData.name || "User"} 
      class="profile-picture" 
    />
    <span class="profile-name">{profileData.name || "User"}</span>
  </div>
{:else}
  <button class="login-btn" on:click={showLoginDialog}>
    {hasStoredKey ? $_("logged_in") : $_("login")}
  </button>
{/if}

<style>
  .login-btn {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 0.5em 1.2em;
    font-size: 1em;
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
    position: fixed;
    top: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 10;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 20px;
    padding: 5px 12px 5px 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
