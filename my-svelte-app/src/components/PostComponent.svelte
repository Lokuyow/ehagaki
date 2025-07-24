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
  
  // 投稿送信処理
  async function submitPost() {
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
</style>
