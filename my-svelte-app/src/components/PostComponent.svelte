<script lang="ts">
  import { _ } from 'svelte-i18n';
  import type { PostStatus } from '../lib/postManager';
  import { PostManager } from '../lib/postManager';
  import { FileUploadManager } from '../lib/fileUploadManager';
  
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
  
  // 親から受け取るコールバック
  export let onPostSuccess: (() => void) | undefined;

  // 警告ダイアログ表示用
  let showWarningDialog = false;
  let pendingPostContent = "";

  // 画像アップロード関連
  let isUploading = false;
  let uploadErrorMessage = "";
  let dragOver = false;

  // 画像URLを投稿内容に挿入
  function insertImageUrl(imageUrl: string) {
    // カーソル位置にURLを挿入
    const textArea = document.querySelector('.post-input') as HTMLTextAreaElement;
    if (textArea) {
      const startPos = textArea.selectionStart || 0;
      const endPos = textArea.selectionEnd || 0;
      
      const beforeText = postContent.substring(0, startPos);
      const afterText = postContent.substring(endPos);
      
      // URLの前後に改行を入れる（必要に応じて調整）
      const newText = beforeText + 
                      (beforeText.endsWith('\n') || beforeText === '' ? '' : '\n') + 
                      imageUrl + 
                      (afterText.startsWith('\n') || afterText === '' ? '' : '\n') + 
                      afterText;
      
      postContent = newText;
      
      // テキストエリアにフォーカスを戻す
      setTimeout(() => {
        textArea.focus();
        const newCursorPos = startPos + imageUrl.length + (beforeText.endsWith('\n') || beforeText === '' ? 0 : 1);
        textArea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    } else {
      // テキストエリアが見つからない場合は末尾に追加
      postContent += (postContent.endsWith('\n') || postContent === '' ? '' : '\n') + imageUrl + '\n';
    }
  }

  // ファイルアップロード処理
  async function uploadFile(file: File) {
    if (!file) return;
    
    // 画像ファイルかどうかをチェック
    if (!file.type.startsWith('image/')) {
      uploadErrorMessage = $_('only_images_allowed');
      setTimeout(() => {
        uploadErrorMessage = "";
      }, 3000);
      return;
    }
    
    try {
      isUploading = true;
      uploadErrorMessage = "";
      
      const result = await FileUploadManager.uploadFile(file);
      
      if (result.success && result.url) {
        // 成功したらURLを挿入
        insertImageUrl(result.url);
      } else {
        uploadErrorMessage = result.error || $_('upload_failed');
        setTimeout(() => {
          uploadErrorMessage = "";
        }, 3000);
      }
    } catch (error) {
      console.error("Upload error:", error);
      uploadErrorMessage = error instanceof Error ? error.message : String(error);
      setTimeout(() => {
        uploadErrorMessage = "";
      }, 3000);
    } finally {
      isUploading = false;
    }
  }

  // ドラッグアンドドロップイベント
  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    dragOver = true;
  }

  function handleDragLeave() {
    dragOver = false;
  }

  async function handleDrop(event: DragEvent) {
    event.preventDefault();
    dragOver = false;
    
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      await uploadFile(event.dataTransfer.files[0]);
    }
  }

  // ファイル選択ダイアログを開く
  function openFileDialog() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        uploadFile(target.files[0]);
      }
    };
    fileInput.click();
  }

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
      if (onPostSuccess) onPostSuccess();

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
      if (onPostSuccess) onPostSuccess();
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

  <!-- テキストエリアにドラッグアンドドロップ機能を追加 -->
  <div class="textarea-container" class:drag-over={dragOver}>
    <textarea
      class="post-input"
      bind:value={postContent}
      placeholder={$_("enter_your_text")}
      rows="5"
      disabled={postStatus.sending || isUploading}
      on:dragover={handleDragOver}
      on:dragleave={handleDragLeave}
      on:drop={handleDrop}
    ></textarea>
    {#if isUploading}
      <div class="upload-overlay">
        <span class="loading-indicator"></span>
        <span>{$_("uploading")}...</span>
      </div>
    {/if}
  </div>

  {#if uploadErrorMessage}
    <div class="upload-error">{uploadErrorMessage}</div>
  {/if}

  <div class="post-actions">
    <div class="action-buttons">
      <button 
        class="upload-button" 
        on:click={openFileDialog}
        disabled={!hasStoredKey || postStatus.sending || isUploading}
        title={$_("upload_image")}
        aria-label={$_("upload_image")}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
      </button>
    </div>
    
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

  .textarea-container {
    position: relative;
    width: 100%;
    margin-bottom: 10px;
    border-radius: 8px;
    transition: border-color 0.2s;
  }

  .drag-over {
    border: 2px dashed #1da1f2;
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
    box-sizing: border-box;
    transition: border-color 0.2s;
  }

  .post-input:focus {
    outline: none;
    border-color: #1da1f2;
  }

  .upload-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    z-index: 5;
  }

  .post-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  
  .action-buttons {
    display: flex;
    gap: 8px;
  }
  
  .upload-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background-color: #f0f0f0;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .upload-button:hover:not(:disabled) {
    background-color: #e0e0e0;
  }
  
  .upload-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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
  
  .upload-error {
    color: #c62828;
    font-size: 0.9rem;
    margin-bottom: 10px;
    width: 100%;
    text-align: left;
  }

  .loading-indicator {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid rgba(29, 161, 242, 0.3);
    border-radius: 50%;
    border-top-color: #1da1f2;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 8px;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
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
