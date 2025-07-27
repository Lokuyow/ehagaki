<script lang="ts">
  import { onMount } from "svelte";
  import { createRxNostr } from "rx-nostr";
  import { verifier } from "@rx-nostr/crypto";
  import "./i18n";
  import { _, locale } from "svelte-i18n";
  import settingsIcon from "./assets/gear-solid-full.svg";
  import { ProfileManager, type ProfileData } from "./lib/profileManager";
  import ProfileComponent from "./components/ProfileComponent.svelte";
  import LoginDialog from "./components/LoginDialog.svelte";
  import { keyManager } from "./lib/keyManager";
  import { RelayManager } from "./lib/relayManager";
  import PostComponent from "./components/PostComponent.svelte";
  import SettingsDialog from "./components/SettingsDialog.svelte";
  import LogoutDialog from "./components/LogoutDialog.svelte"; // 追加
  import { FileUploadManager } from "./lib/fileUploadManager";

  // UI状態管理
  let showDialog = false;
  let errorMessage = "";
  let showLogoutDialog = false; // 追加

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

  // 共有画像処理のための変数
  let sharedImage: File | null = null;
  let processingSharedImage = false;

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

  // ログアウトダイアログの表示・非表示制御
  function openLogoutDialog() {
    showLogoutDialog = true;
  }

  function closeLogoutDialog() {
    showLogoutDialog = false;
  }

  // ログアウト処理
  function logout() {
    // localeとuploadEndpoint以外のlocalStorageを削除
    const localeValue = localStorage.getItem("locale");
    const uploadEndpointValue = localStorage.getItem("uploadEndpoint");
    localStorage.clear();
    if (localeValue !== null) localStorage.setItem("locale", localeValue);
    if (uploadEndpointValue !== null)
      localStorage.setItem("uploadEndpoint", uploadEndpointValue);

    // 状態をリセット
    hasStoredKey = false;
    secretKey = "";
    publicKeyHex = "";
    publicKeyNpub = "";
    publicKeyNprofile = "";
    profileData = { name: "", picture: "" };
    profileLoaded = false;

    // ダイアログを閉じる
    showLogoutDialog = false;
  }

  // 設定ダイアログ状態
  let showSettings = false;

  function openSettings() {
    showSettings = true;
  }
  function closeSettings() {
    showSettings = false;
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

    // Service Workerのメッセージを受け取るリスナーを設定
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", async (event) => {
        console.log("メッセージを受信:", event.data);
        if (event.data && event.data.image) {
          // Service Workerから画像を受信
          sharedImage = event.data.image;
          if (sharedImage) {
            await handleSharedImage(sharedImage);
          }
        }
      });

      // URLパラメータで共有から開かれたか確認
      if (FileUploadManager.checkIfOpenedFromShare()) {
        console.log("共有から開かれました、画像データを取得中...");
        processingSharedImage = true;

        // Service Workerからキャッシュされた画像を取得
        const sharedImageData =
          await FileUploadManager.getSharedImageFromServiceWorker();
        if (sharedImageData && sharedImageData.image) {
          console.log(
            "共有された画像を取得しました:",
            sharedImageData.metadata,
          );
          sharedImage = sharedImageData.image;
          // null チェックを追加
          if (sharedImage) {
            await handleSharedImage(sharedImage);
          }
        } else {
          console.log("共有された画像が見つかりませんでした");
        }

        processingSharedImage = false;

        // URLからクエリパラメータを削除
        const url = new URL(window.location.href);
        url.search = "";
        window.history.replaceState({}, document.title, url.toString());
      }
    }
  });

  // 共有された画像を処理する関数
  async function handleSharedImage(image: File) {
    try {
      console.log("共有画像を処理しています:", image.name);

      // ここで画像アップロード処理を実行
      // 例: フォーム入力の自動化や、アップロード関数の呼び出し
      // 実際の実装はアプリの構造に依存するため、適切に修正してください
      
      // タイトル入力フィールドにフォーカス
      setTimeout(() => {
        const titleInput = document.getElementById("post-title");
        if (titleInput) {
          titleInput.focus();
        }
      }, 500);
      
      // ファイル選択UIに画像をセット
      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      if (fileInput) {
        // ファイル選択要素に画像をセット
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(image);
        fileInput.files = dataTransfer.files;

        // change イベントを発火させる
        const event = new Event("change", { bubbles: true });
        fileInput.dispatchEvent(event);
      }

      // または、直接アップロード関数を呼び出す例:
      // const result = await FileUploadManager.uploadFile(image);
      // if (result.success) {
      //   console.log('共有画像のアップロードに成功:', result.url);
      //   // UIを更新...
      // }
    } catch (error) {
      console.error("共有画像の処理中にエラーが発生しました:", error);
    }
  }
</script>

{#if $locale}
  <main>
    <!-- ヘッダー領域 -->
    <div class="header">
      <ProfileComponent
        {profileData}
        {profileLoaded}
        {hasStoredKey}
        {showLoginDialog}
        showLogoutDialog={openLogoutDialog}
      />
      <button class="settings-btn" on:click={openSettings} aria-label="設定">
        <img src={settingsIcon} alt="Settings" class="settings-icon" />
      </button>
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

    <!-- ログアウトダイアログ -->
    {#if showLogoutDialog}
      <LogoutDialog
        show={showLogoutDialog}
        onClose={closeLogoutDialog}
        onLogout={logout}
      />
    {/if}

    <!-- 設定ダイアログ -->
    <SettingsDialog show={showSettings} onClose={closeSettings} />

    <!-- メインコンテンツ -->
    <div class="main-content">
      <!-- 投稿コンポーネントを使用 -->
      <PostComponent
        {rxNostr}
        {hasStoredKey}
        onPostSuccess={() => {
          // 必要に応じて投稿成功時の処理を追加
        }}
      />
    </div>
    <!-- 必要に応じて他のコンポーネントやUIをここに追加 -->

    {#if processingSharedImage}
      <div class="loading-overlay">
        <p>共有された画像を処理しています...</p>
      </div>
    {/if}
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
    padding: 8px 8px 0 8px;
    box-sizing: border-box;
    background: transparent;
  }
  .settings-btn {
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
  .settings-btn:hover {
    background: #f0f0f0;
  }
  .settings-btn:active {
    background: #e0e0e0;
    box-shadow: 0 1px 2px #0002;
    transform: scale(0.94);
  }
  .settings-icon {
    width: 24px;
    height: 24px;
    display: block;
  }
  .main-content {
    margin-top: 10px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
</style>
