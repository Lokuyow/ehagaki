<script lang="ts">
  import { onMount } from "svelte";
  import { createRxNostr, createRxForwardReq } from "rx-nostr";
  import { verifier } from "@rx-nostr/crypto";
  import "./i18n";
  import { _, locale } from "svelte-i18n";
  import languageIcon from "./assets/language-solid.svg";
  import { getPublicKey, nip19 } from "nostr-tools";

  let showDialog = false;
  let secretKey = "";
  let errorMessage = "";
  let hasStoredKey = false;
  let publicKeyHex = "";
  let publicKeyNpub = "";
  let publicKeyNprofile = "";

  // rxNostrインスタンスをグローバルに保持
  let rxNostr: ReturnType<typeof createRxNostr>;

  // 言語切替用
  function toggleLang() {
    locale.set($locale === "ja" ? "en" : "ja");
  }

  function validateSecretKey(key: string): boolean {
    return /^nsec1[023456789acdefghjklmnpqrstuvwxyz]{58,}$/.test(key);
  }

  function derivePublicKeyFromSecret(nsec: string): {
    hex: string;
    npub: string;
    nprofile: string;
  } {
    try {
      const { type, data } = nip19.decode(nsec);
      if (type !== "nsec") return { hex: "", npub: "", nprofile: "" };
      const hex = getPublicKey(data as Uint8Array);
      const npub = nip19.npubEncode(hex);
      const nprofile = nip19.nprofileEncode({ pubkey: hex, relays: [] });
      return { hex, npub, nprofile };
    } catch (e) {
      return { hex: "", npub: "", nprofile: "" };
    }
  }

  // リレーリストをローカルストレージに保存する関数
  function saveRelaysToLocalStorage(pubkeyHex: string, relays: any) {
    try {
      localStorage.setItem(`nostr-relays-${pubkeyHex}`, JSON.stringify(relays));
      console.log("リレーリストをローカルストレージに保存:", pubkeyHex);
    } catch (e) {
      console.error("リレーリストの保存に失敗:", e);
    }
  }

  // ローカルストレージからリレーリストを取得する関数
  function getRelaysFromLocalStorage(pubkeyHex: string): any {
    try {
      const relays = localStorage.getItem(`nostr-relays-${pubkeyHex}`);
      if (relays) {
        return JSON.parse(relays);
      }
    } catch (e) {
      console.error("リレーリストの取得に失敗:", e);
    }
    return null;
  }

  // ユーザーのリレーリストを取得する関数
  async function fetchUserRelays(pubkeyHex: string): Promise<boolean> {
    return new Promise((resolve) => {
      // まずkind 10002からリレーリストを取得
      const rxReq10002 = createRxForwardReq();
      let found10002 = false;

      const subscription10002 = rxNostr.use(rxReq10002).subscribe((packet) => {
        if (
          packet.event &&
          packet.event.kind === 10002 &&
          packet.event.pubkey === pubkeyHex
        ) {
          found10002 = true;
          try {
            // kind 10002からリレーと読み書き権限を取得
            const relayConfigs: { [url: string]: { read: boolean; write: boolean } } = {};
            
            packet.event.tags
              .filter((tag) => tag.length >= 2 && tag[0] === "r")
              .forEach((tag) => {
                const url = tag[1];
                let read = true;  // デフォルトは読み書き両方許可
                let write = true;
                
                // 明示的に指定されている場合
                if (tag.length > 2) {
                  // ["r", "wss://...", "read"] または ["r", "wss://...", "write"]
                  if (tag.length === 3) {
                    if (tag[2] === "read") {
                      write = false;
                    } else if (tag[2] === "write") {
                      read = false;
                    }
                  }
                  // ["r", "wss://...", "read", "write"] の形式も処理
                  else {
                    read = tag.includes("read");
                    write = tag.includes("write");
                  }
                }
                
                relayConfigs[url] = { read, write };
              });
            
            if (Object.keys(relayConfigs).length > 0) {
              rxNostr.setDefaultRelays(relayConfigs);
              console.log("Kind 10002からリレーを設定:", relayConfigs);
              // リレーリストをローカルストレージに保存
              saveRelaysToLocalStorage(pubkeyHex, relayConfigs);
              subscription10002.unsubscribe();
              resolve(true);
            }
          } catch (e) {
            console.error("Kind 10002のパースエラー:", e);
          }
        }
      });

      // kind 10002のイベントをリクエスト
      rxReq10002.emit({ authors: [pubkeyHex], kinds: [10002] });

      // 一定時間待機後、kind 10002が見つからなければkind 3を試す
      setTimeout(() => {
        subscription10002.unsubscribe();

        if (!found10002) {
          const rxReq3 = createRxForwardReq();

          const subscription3 = rxNostr.use(rxReq3).subscribe((packet) => {
            if (
              packet.event &&
              packet.event.kind === 3 &&
              packet.event.pubkey === pubkeyHex
            ) {
              try {
                const content = JSON.parse(packet.event.content);
                if (content.relays && Array.isArray(content.relays)) {
                  rxNostr.setDefaultRelays(content.relays);
                  console.log("Kind 3からリレーを設定:", content.relays);
                  // リレーリストをローカルストレージに保存
                  saveRelaysToLocalStorage(pubkeyHex, content.relays);
                  subscription3.unsubscribe();
                  resolve(true);
                }
              } catch (e) {
                console.error("Kind 3のパースエラー:", e);
              }
            }
          });

          // kind 3のイベントをリクエスト
          rxReq3.emit({ authors: [pubkeyHex], kinds: [3] });

          // 一定時間後にサブスクリプションを解除
          setTimeout(() => {
            subscription3.unsubscribe();
            resolve(false);
          }, 5000);
        }
      }, 5000);
    });
  }

  async function saveSecretKey() {
    if (!validateSecretKey(secretKey)) {
      errorMessage = "invalid_key";
      publicKeyHex = "";
      publicKeyNpub = "";
      publicKeyNprofile = "";
      return;
    }
    try {
      localStorage.setItem("nostr-secret-key", secretKey);
      hasStoredKey = true;
      showDialog = false;
      errorMessage = "";
      const { hex, npub, nprofile } = derivePublicKeyFromSecret(secretKey);
      publicKeyHex = hex;
      publicKeyNpub = npub;
      publicKeyNprofile = nprofile;

      // ログイン成功後、ユーザーのリレーリストを取得
      if (publicKeyHex) {
        await fetchUserRelays(publicKeyHex);
      }
    } catch (error) {
      errorMessage = "error_saving";
      publicKeyHex = "";
      publicKeyNpub = "";
      publicKeyNprofile = "";
      console.error("保存エラー:", error);
    }
  }

  $: if (secretKey && validateSecretKey(secretKey)) {
    const { hex, npub, nprofile } = derivePublicKeyFromSecret(secretKey);
    publicKeyHex = hex;
    publicKeyNpub = npub;
    publicKeyNprofile = nprofile;
  } else {
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

    // rxNostrインスタンスを初期化
    rxNostr = createRxNostr({ verifier });

    // ストアされた鍵がある場合は公開鍵を取得し、リレーリストを読み込む
    (async () => {
      if (storedKey && validateSecretKey(storedKey)) {
        const { hex } = derivePublicKeyFromSecret(storedKey);
        publicKeyHex = hex;

        if (publicKeyHex) {
          // ローカルストレージからリレーリストを取得
          const savedRelays = getRelaysFromLocalStorage(publicKeyHex);
          
          if (savedRelays) {
            // 保存済みのリレーリストがあればそれを使用
            rxNostr.setDefaultRelays(savedRelays);
            console.log("ローカルストレージのリレーリストを使用:", savedRelays);
          } else {
            // なければブートストラップリレーを設定してからユーザーのリレーを取得
            rxNostr.setDefaultRelays([
              "wss://purplepag.es/",
              "wss://directory.yabu.me/",
              "wss://indexer.coracle.social",
              "wss://user.kindpag.es/",
            ]);
            await fetchUserRelays(publicKeyHex);
          }
        }
      } else {
        // 秘密鍵がない場合はブートストラップリレーを設定
        rxNostr.setDefaultRelays([
          "wss://purplepag.es/",
          "wss://directory.yabu.me/",
          "wss://indexer.coracle.social",
          "wss://user.kindpag.es/",
        ]);
      }
    })();
  });
</script>

{#if $locale}
  <main>
    <!-- 言語切替ボタン（トグル） -->
    <button class="lang-btn" on:click={toggleLang} aria-label="Change language">
      <img src={languageIcon} alt="Language" class="lang-icon" />
    </button>
    <button class="login-btn" on:click={showLoginDialog}>
      {hasStoredKey ? $_("logged_in") : $_("login")}
    </button>

    {#if showDialog}
      <div class="dialog-overlay">
        <div class="dialog">
          <h2>{$_("input_secret")}</h2>
          <p>{$_("input_nostr_secret")}</p>
          <input
            type="password"
            bind:value={secretKey}
            placeholder="nsec1~"
            class="secret-input"
          />
          {#if publicKeyNpub}
            <p>
              公開鍵(npub): <span style="word-break:break-all"
                >{publicKeyNpub}</span
              >
            </p>
          {/if}
          {#if publicKeyNprofile}
            <p>
              公開鍵(nprofile): <span style="word-break:break-all"
                >{publicKeyNprofile}</span
              >
            </p>
          {/if}
          {#if errorMessage}
            <p class="error-message">{$_(errorMessage)}</p>
          {/if}
          <div class="dialog-buttons">
            <button on:click={closeDialog} class="cancel-btn"
              >{$_("cancel")}</button
            >
            <button on:click={saveSecretKey} class="save-btn"
              >{$_("save")}</button
            >
          </div>
        </div>
      </div>
    {/if}

    <!-- サイトタイトル -->
    <h1 class="site-title">eHagaki</h1>

    <!-- 必要に応じて他のコンポーネントやUIをここに追加 -->
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

  .site-title {
    text-align: center;
    font-size: 2.5rem;
    margin: 2.5rem 0 1.5rem 0;
    font-weight: bold;
    letter-spacing: 0.08em;
    color: #646cff;
  }
</style>
