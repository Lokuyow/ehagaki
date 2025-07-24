<script lang="ts">
  import { onMount } from "svelte";
  import { createRxNostr } from "rx-nostr";
  import { verifier, seckeySigner } from "@rx-nostr/crypto"; // seckeySigner を追加
  import "./i18n";
  import { _, locale } from "svelte-i18n";
  import languageIcon from "./assets/language-solid.svg";
  import { ProfileManager, type ProfileData } from "./lib/profileManager";
  import ProfileComponent from "./components/ProfileComponent.svelte";
  import LoginDialog from "./components/LoginDialog.svelte";
  import { keyManager } from "./lib/keyManager";
  import { RelayManager } from "./lib/relayManager";
  import { firstValueFrom } from "rxjs"; // 追加

  // UI状態管理
  let showDialog = false;
  let errorMessage = "";

  // 認証関連
  let secretKey = "";
  let hasStoredKey = false;

  // ユーザー公開鍵情報
  let publicKeyHex = "";
  let publicKeyNpub = "";
  let publicKeyNprofile = "";

  // プロフィール情報
  let profileData: ProfileData = {
    name: "",
    picture: "",
  };

  let profileLoaded = false;

  // Nostrクライアントインスタンス
  let rxNostr: ReturnType<typeof createRxNostr>;

  // プロフィールマネージャーインスタンス
  let profileManager: ProfileManager;

  // リレーマネージャーインスタンス
  let relayManager: RelayManager;

  // 投稿機能のための状態変数
  let postContent = "";
  let showPreview = true;
  let postStatus = {
    sending: false,
    success: false,
    error: false,
    message: ""
  };

  // 言語切替用
  function toggleLang() {
    locale.set($locale === "ja" ? "en" : "ja");
  }

  // Nostr関連の初期化処理
  async function initializeNostr(pubkeyHex?: string): Promise<void> {
    rxNostr = createRxNostr({ verifier });
    // プロフィールマネージャーの初期化
    profileManager = new ProfileManager(rxNostr);
    // リレーマネージャーの初期化
    relayManager = new RelayManager(rxNostr);

    if (pubkeyHex) {
      // ローカルストレージからリレーリストを取得
      const savedRelays = relayManager.getFromLocalStorage(pubkeyHex);

      if (savedRelays) {
        // 保存済みのリレーリストがあればそれを使用
        rxNostr.setDefaultRelays(savedRelays);
        console.log("ローカルストレージのリレーリストを使用:", savedRelays);
      } else {
        // なければブートストラップリレーを設定してからユーザーのリレーを取得
        relayManager.setBootstrapRelays();
        await relayManager.fetchUserRelays(pubkeyHex);
      }

      // プロフィール情報の取得
      const profile = await profileManager.fetchProfileData(pubkeyHex);
      if (profile) {
        profileData = profile;
        profileLoaded = true;
      }
    } else {
      // 秘密鍵がない場合はブートストラップリレーを設定
      relayManager.setBootstrapRelays();
    }
  }

  async function saveSecretKey() {
    if (!keyManager.isValidNsec(secretKey)) {
      errorMessage = "invalid_key";
      publicKeyHex = "";
      publicKeyNpub = "";
      publicKeyNprofile = "";
      return;
    }

    const success = keyManager.saveToStorage(secretKey);
    if (success) {
      hasStoredKey = true;
      showDialog = false;
      errorMessage = "";
      const { hex, npub, nprofile } = keyManager.derivePublicKey(secretKey);
      publicKeyHex = hex;
      publicKeyNpub = npub;
      publicKeyNprofile = nprofile;

      // ログイン成功後、ユーザーのリレーリストとプロフィールを取得
      if (publicKeyHex) {
        await relayManager.fetchUserRelays(publicKeyHex);
        const profile = await profileManager.fetchProfileData(publicKeyHex);
        if (profile) {
          profileData = profile;
          profileLoaded = true;
        }
      }
    } else {
      errorMessage = "error_saving";
      publicKeyHex = "";
      publicKeyNpub = "";
      publicKeyNprofile = "";
    }
  }

  $: if (secretKey && keyManager.isValidNsec(secretKey)) {
    const { hex, npub, nprofile } = keyManager.derivePublicKey(secretKey);
    publicKeyHex = hex;
    publicKeyNpub = npub;
    publicKeyNprofile = nprofile;
  } else if (secretKey) {
    publicKeyHex = "";
    publicKeyNpub = "";
    publicKeyNprofile = "";
  }

  function showLoginDialog() {
    showDialog = true;
  }

  function closeDialog() {
    showDialog = false;
    errorMessage = "";
  }

  // 投稿送信処理
  async function submitPost() {
    if (!postContent.trim()) return;
    
    // 認証済みか確認
    if (!hasStoredKey) {
      postStatus.error = true;
      postStatus.message = "login_required";
      return;
    }
    
    try {
      postStatus.sending = true;
      postStatus.success = false;
      postStatus.error = false;
      
      // 秘密鍵を取得
      const storedKey = keyManager.loadFromStorage();
      
      if (!storedKey) {
        postStatus.error = true;
        postStatus.message = "key_not_found";
        return;
      }
      
      // 秘密鍵でsignerを作成
      const signer = seckeySigner(storedKey);
      
      // kind=1のテキスト投稿を作成
      const event = {
        kind: 1,
        content: postContent,
        tags: [] // 必要に応じてタグを追加可能
      };
      
      // 秘密鍵で署名してイベントを送信
      await firstValueFrom(rxNostr.send(event, { signer }));
      
      // 送信成功
      postStatus.success = true;
      postStatus.message = "post_success";
      
      // 投稿内容をクリア
      postContent = "";
      
      // 成功メッセージをリセット（3秒後）
      setTimeout(() => {
        postStatus.success = false;
        postStatus.message = "";
      }, 3000);
      
    } catch (err) {
      // 送信エラー
      postStatus.error = true;
      postStatus.message = "post_error";
      console.error("投稿エラー:", err);
    } finally {
      postStatus.sending = false;
    }
  }

  // ロケール変更時にローカルストレージへ保存
  $: if ($locale) {
    localStorage.setItem("locale", $locale);
  }

  onMount(async () => {
    // ローカルストレージに保存されたロケールがあればそれをセット
    const storedLocale = localStorage.getItem("locale");
    if (storedLocale && storedLocale !== $locale) {
      locale.set(storedLocale);
    }

    // 秘密鍵の取得と検証
    const storedKey = keyManager.loadFromStorage();
    hasStoredKey = !!storedKey;

    // 公開鍵の取得とNostr初期化
    if (storedKey && keyManager.isValidNsec(storedKey)) {
      const { hex } = keyManager.derivePublicKey(storedKey);
      publicKeyHex = hex;
      await initializeNostr(hex);
    } else {
      await initializeNostr();
    }
  });
</script>

{#if $locale}
  <main>
    <!-- ヘッダー領域 -->
    <div class="header">
      <button class="lang-btn" on:click={toggleLang} aria-label="Change language">
        <img src={languageIcon} alt="Language" class="lang-icon" />
      </button>
      <ProfileComponent
        {profileData}
        {profileLoaded}
        {hasStoredKey}
        {showLoginDialog}
      />
    </div>

    {#if showDialog}
      <LoginDialog
        bind:secretKey
        {publicKeyNpub}
        {publicKeyNprofile}
        {errorMessage}
        onClose={closeDialog}
        onSave={saveSecretKey}
      />
    {/if}

    <!-- メインコンテンツ -->
    <div class="main-content">
      <!-- 投稿入力エリア -->
      <div class="post-container">
        <div class="post-preview">
          <div class="preview-content">
            {#if postContent.trim()}
              {postContent}
            {:else}
              <span class="preview-placeholder">{$_("preview")}</span>
            {/if}
          </div>
        </div>

        <textarea
          class="post-input"
          bind:value={postContent}
          placeholder={$_("enter_your_text")}
          rows="5"
          disabled={postStatus.sending}
        ></textarea>

        <div class="post-actions">
          {#if postStatus.error}
            <div class="post-status error">
              {$_(postStatus.message)}
            </div>
          {/if}
          
          {#if postStatus.success}
            <div class="post-status success">
              {$_(postStatus.message)}
            </div>
          {/if}
          
          <button
            class="post-button"
            disabled={!postContent.trim() || postStatus.sending || !hasStoredKey}
            on:click={submitPost}
          >
            {#if postStatus.sending}
              {$_("posting")}...
            {:else}
              {$_("post")}
            {/if}
          </button>
        </div>
      </div>
    </div>
    <!-- 必要に応じて他のコンポーネントやUIをここに追加 -->
  </main>
{/if}

<style>
  main {
    position: relative;
  }
  .header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding: 16px 8px 0 8px;
    box-sizing: border-box;
    background: transparent;
  }
  .lang-btn {
    position: static;
    /* 位置をheader内に */
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
    transition:
      background 0.2s,
      box-shadow 0.1s,
      transform 0.1s;
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
  .main-content {
    margin-top: 24px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* 投稿エリアのスタイル */
  .post-container {
    max-width: 600px;
    width: 100%;
    margin: 20px auto;
    /* padding: 0 15px; */
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .post-preview {
    margin-bottom: 10px;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #f9f9f9;
    width: 100%;
    max-width: 600px;
    min-width: 300px;
    box-sizing: border-box;
  }

  .preview-content {
    white-space: pre-wrap;
    word-break: break-word;
    color: #222;
    min-height: 1.5em;
    position: relative;
  }
  .preview-placeholder {
    color: #bbb;
    font-style: italic;
    user-select: none;
    pointer-events: none;
  }

  .post-input {
    width: 100%;
    max-width: 600px;
    min-width: 300px;
    min-height: 120px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    resize: vertical;
    font-family: inherit;
    font-size: 1rem;
    margin-bottom: 10px;
    box-sizing: border-box;
  }

  .post-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .post-status {
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 0.9rem;
  }

  .post-status.error {
    background-color: #ffebee;
    color: #c62828;
  }

  .post-status.success {
    background-color: #e8f5e9;
    color: #2e7d32;
  }

  .post-button {
    padding: 8px 20px;
    background-color: #1da1f2;
    color: white;
    border: none;
    border-radius: 20px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
    min-width: 100px;
  }

  .post-button:hover:not(:disabled) {
    background-color: #1a91da;
  }

  .post-button:disabled {
    background-color: #9ad4f9;
    cursor: not-allowed;
  }
</style>
