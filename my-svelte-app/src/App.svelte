<script lang="ts">
  import { onMount } from "svelte";
  import { createRxNostr, createRxForwardReq } from "rx-nostr";
  import { verifier } from "@rx-nostr/crypto";
  import svelteLogo from "./assets/svelte.svg";
  import viteLogo from "/vite.svg";
  import Counter from "./lib/Counter.svelte";
  import "./i18n";
  import { _, locale } from "svelte-i18n";
  import languageIcon from "./assets/language-solid.svg";

  let showDialog = false;
  let secretKey = "";
  let errorMessage = "";
  let hasStoredKey = false;

  // 言語切替用
  function toggleLang() {
    locale.set($locale === "ja" ? "en" : "ja");
  }

  function validateSecretKey(key: string): boolean {
    return /^nsec1[023456789acdefghjklmnpqrstuvwxyz]{58,}$/.test(key);
  }

  function saveSecretKey() {
    if (!validateSecretKey(secretKey)) {
      errorMessage = "invalid_key";
      return;
    }
    try {
      localStorage.setItem("nostr-secret-key", secretKey);
      hasStoredKey = true;
      showDialog = false;
      errorMessage = "";
    } catch (error) {
      errorMessage = "error_saving";
      console.error("保存エラー:", error);
    }
  }

  function showLoginDialog() {
    showDialog = true;
  }

  function closeDialog() {
    showDialog = false;
    errorMessage = "";
  }

  // ロケール変更時にローカルストレージへ保存
  $: if ($locale) {
    localStorage.setItem("locale", $locale);
  }

  onMount(() => {
    // ローカルストレージに保存されたロケールがあればそれをセット
    const storedLocale = localStorage.getItem("locale");
    if (storedLocale && storedLocale !== $locale) {
      locale.set(storedLocale);
    }

    const storedKey = localStorage.getItem("nostr-secret-key");
    hasStoredKey = !!storedKey;

    const rxNostr = createRxNostr({ verifier });
    rxNostr.setDefaultRelays([
      "wss://purplepag.es/",
      "wss://directory.yabu.me/",
      "wss://user.kindpag.es/",
    ]);
    const rxReq = createRxForwardReq();

    const subscription = rxNostr.use(rxReq).subscribe((packet) => {
      console.log(packet);
    });

    rxReq.emit({ kinds: [1] });

    const timer = setTimeout(() => {
      subscription.unsubscribe();
    }, 10 * 1000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  });
</script>

{#if $locale}
<main>
  <!-- 言語切替ボタン（トグル） -->
  <button class="lang-btn" on:click={toggleLang} aria-label="Change language">
    <img src={languageIcon} alt="Language" class="lang-icon" />
  </button>
  <button class="login-btn" on:click={showLoginDialog}>
    {hasStoredKey ? $_('logged_in') : $_('login')}
  </button>

  {#if showDialog}
    <div class="dialog-overlay">
      <div class="dialog">
        <h2>{$_('input_secret')}</h2>
        <p>{$_('input_nostr_secret')}</p>
        <input
          type="password"
          bind:value={secretKey}
          placeholder="nsec1~"
          class="secret-input"
        />
        {#if errorMessage}
          <p class="error-message">{$_(errorMessage)}</p>
        {/if}
        <div class="dialog-buttons">
          <button on:click={closeDialog} class="cancel-btn">{$_('cancel')}</button>
          <button on:click={saveSecretKey} class="save-btn">{$_('save')}</button>
        </div>
      </div>
    </div>
  {/if}

  <div>
    <a href="https://vite.dev" target="_blank" rel="noreferrer">
      <img src={viteLogo} class="logo" alt="Vite Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>
  <h1>Vite + Svelte</h1>

  <div class="card">
    <Counter />
  </div>

  <p>
    Check out <a
      href="https://github.com/sveltejs/kit#readme"
      target="_blank"
      rel="noreferrer">SvelteKit</a
    >, the official Svelte app framework powered by Vite!
  </p>

  <p class="read-the-docs">Click on the Vite and Svelte logos to learn more</p>
</main>
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
  
  /* ダイアログのスタイル */
  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }
  
  .dialog {
    background-color: white;
    color: #222;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    width: 90%;
    max-width: 500px;
  }
  
  .secret-input {
    width: 100%;
    padding: 0.8rem;
    margin: 1rem 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .dialog-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  .cancel-btn {
    padding: 0.6rem 1.2rem;
    border: 1px solid #ccc;
    background-color: #f5f5f5;
    color: #333;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s;
  }
  .cancel-btn:hover {
    background-color: #e0e0e0;
  }
  
  .save-btn {
    padding: 0.6rem 1.2rem;
    background-color: #646cff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .save-btn:hover {
    background-color: #535bf2;
  }
  
  .error-message {
    color: #d32f2f;
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }
  
  main {
    position: relative;
  }
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }

  .lang-btn {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 12;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    padding: 6px;
    cursor: pointer;
    box-shadow: 0 2px 8px #0001;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s, box-shadow 0.1s, transform 0.1s;
  }
  .lang-btn:hover {
    background: #f0f0f0;
  }
  .lang-btn:active {
    background: #e0e0e0;
    box-shadow: 0 1px 2px #0002;
    transform: scale(0.94);
  }
  .lang-icon {
    width: 24px;
    height: 24px;
    display: block;
  }
</style>
