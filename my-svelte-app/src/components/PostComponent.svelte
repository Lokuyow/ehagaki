<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';
  import type { PostStatus } from '../lib/postManager';
  import { PostManager } from '../lib/postManager';
  
  export let rxNostr: any;
  export let hasStoredKey: boolean;
  
  // 投稿機能のための状態変数
  let postContent = "";
  let postStatus: PostStatus = {
    sending: false,
    success: false,
    error: false,
    message: ""
  };
  
  const dispatch = createEventDispatcher();
  
  // 警告ダイアログ表示用
  let showWarningDialog = false;
  let pendingPostContent = "";

  // 投稿送信処理
  async function submitPost() {
    // nsec1~が含まれているかチェック
    if (/nsec1[0-9a-zA-Z]+/.test(postContent)) {
      pendingPostContent = postContent;
      showWarningDialog = true;
      return;
    }
    
    // PostManagerインスタンスをここで生成
    const postManager = new PostManager(rxNostr);
    const success = await postManager.submitPost(postContent, postStatus);
    
    if (success) {
      // Svelteのリアクティビティを強制更新するため、オブジェクトを再代入
      postStatus = {
        ...postStatus,
        success: true,
        message: "post_success"
      };
      
      // 投稿内容をクリア
      postContent = "";
      
      // 親コンポーネントに投稿成功を通知
      dispatch('postsuccess');
      
      // 成功メッセージを3秒後に消す
      setTimeout(() => {
        postStatus = {
          ...postStatus,
          success: false,
          message: ""
        };
      }, 3000);
    }
  }

  // ダイアログで「投稿」を選択した場合
  async function confirmPostSecretKey() {
    showWarningDialog = false;
    postContent = pendingPostContent;
    pendingPostContent = "";
    // nsec1~が含まれていても投稿処理を実行
    const postManager = new PostManager(rxNostr);
    const success = await postManager.submitPost(postContent, postStatus);
    if (success) {
      postStatus = {
        ...postStatus,
        success: true,
        message: "post_success"
      };
      postContent = "";
      dispatch('postsuccess');
      setTimeout(() => {
        postStatus = {
          ...postStatus,
          success: false,
          message: ""
        };
      }, 3000);
    }
  }

  // ダイアログで「キャンセル」を選択した場合
  function cancelPostSecretKey() {
    showWarningDialog = false;
    pendingPostContent = "";
  }

  // 投稿内容が変更された場合のみエラー状態をリセット
  $: if (postContent && postStatus.error) {
    postStatus = {
      ...postStatus,
      error: false,
      message: ""
    };
  }
</script>

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

{#if showWarningDialog}
  <div class="dialog-backdrop">
    <div class="dialog">
      <div class="dialog-title">{$_("warning")}</div>
      <div class="dialog-message">
        {$_("secret_key_detected")}
      </div>
      <div class="dialog-actions">
        <button class="dialog-cancel" on:click={cancelPostSecretKey}>{$_("cancel")}</button>
        <button class="dialog-confirm" on:click={confirmPostSecretKey}>{$_("post")}</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .post-container {
    max-width: 600px;
    width: 100%;
    margin: 20px auto;
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

  /* ダイアログスタイル */
  .dialog-backdrop {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: #0006;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .dialog {
    background: #fff;
    border-radius: 8px;
    padding: 24px 20px;
    box-shadow: 0 2px 16px #0002;
    min-width: 300px;
    max-width: 90vw;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .dialog-title {
    font-weight: bold;
    font-size: 1.1rem;
    color: #c62828;
  }
  .dialog-message {
    color: #333;
    font-size: 1rem;
  }
  .dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
  .dialog-cancel {
    background: #eee;
    color: #333;
    border: none;
    border-radius: 4px;
    padding: 6px 16px;
    cursor: pointer;
  }
  .dialog-confirm {
    background: #1da1f2;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 6px 16px;
    cursor: pointer;
  }
  .dialog-cancel:hover {
    background: #ddd;
  }
  .dialog-confirm:hover {
    background: #1a91da;
  }
</style>
