<script lang="ts">
  import { _ } from "svelte-i18n";
  import type { PostStatus } from "../lib/postManager";
  import { PostManager } from "../lib/postManager";
  import {
    FileUploadManager,
    type UploadInfoCallbacks,
  } from "../lib/fileUploadManager";
  import { ImagePreviewManager } from "../lib/imagePreviewUtils";
  import { onMount, onDestroy } from "svelte";

  export let rxNostr: any;
  export let hasStoredKey: boolean;
  export let onPostSuccess: (() => void) | undefined;
  export let onUploadStatusChange: ((isUploading: boolean) => void) | undefined;
  export let onImageSizeInfo:
    | ((info: string, visible: boolean) => void)
    | undefined;
  export let onUploadProgress: ((progress: any) => void) | undefined;

  // 投稿機能のための状態変数（UI状態管理をコンポーネントで完結）
  let postContent = "";
  let postStatus: PostStatus = {
    sending: false,
    success: false,
    error: false,
    message: "",
  };

  // 警告ダイアログ表示用
  let showWarningDialog = false;
  let pendingPostContent = "";

  // 画像アップロード関連
  let isUploading = false;
  let uploadErrorMessage = "";
  let dragOver = false;
  let fileInput: HTMLInputElement;

  // マネージャーインスタンス
  let postManager: PostManager;
  const imagePreviewManager = new ImagePreviewManager();

  // rxNostrが変更されたときにpostManagerを更新
  $: if (rxNostr) {
    if (!postManager) {
      postManager = new PostManager(rxNostr);
    } else {
      postManager.setRxNostr(rxNostr);
    }
  }

  // アップロード用コールバックを作成
  const uploadCallbacks: UploadInfoCallbacks = {
    onSizeInfo: onImageSizeInfo,
    onProgress: onUploadProgress,
  };

  // アップロード状態管理
  async function withUploadState<T>(
    uploadPromise: Promise<T>,
    minDuration = 2000,
  ): Promise<T> {
    isUploading = true;
    onUploadStatusChange?.(true);

    const timer = new Promise<void>((resolve) =>
      setTimeout(resolve, minDuration),
    );

    try {
      const [result] = await Promise.all([uploadPromise, timer]);
      return result;
    } finally {
      isUploading = false;
      onUploadStatusChange?.(false);
    }
  }

  // エラー表示の統一管理
  function showUploadError(message: string, duration = 3000) {
    uploadErrorMessage = message;
    setTimeout(() => {
      uploadErrorMessage = "";
    }, duration);
  }

  // ファイルアップロード処理（統合版）
  async function uploadFiles(files: File[] | FileList) {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    const endpoint = localStorage.getItem("uploadEndpoint") || "";

    await withUploadState(
      (async () => {
        try {
          uploadErrorMessage = "";

          let results;
          if (fileArray.length === 1) {
            // 単一ファイルの検証
            const validation = FileUploadManager.validateImageFile(
              fileArray[0],
            );
            if (!validation.isValid) {
              showUploadError($_(validation.errorMessage || "upload_failed"));
              return;
            }

            const result = await FileUploadManager.uploadFileWithCallbacks(
              fileArray[0],
              endpoint,
              uploadCallbacks,
            );
            results = [result];
          } else {
            // 複数ファイル
            results = await FileUploadManager.uploadMultipleFilesWithCallbacks(
              fileArray,
              endpoint,
              uploadCallbacks,
            );
          }

          const successResults = results.filter((r) => r.success);
          const failedResults = results.filter((r) => !r.success);

          if (successResults.length > 0) {
            const urls = successResults.map((r) => r.url!).join("\n");
            insertImageUrl(urls);
          }

          if (failedResults.length > 0) {
            const errorMsg =
              failedResults.length === 1
                ? failedResults[0].error || $_("upload_failed")
                : `${failedResults.length}個のファイルのアップロードに失敗しました`;
            showUploadError(errorMsg, 5000);
          }

          if (fileInput) fileInput.value = "";
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          showUploadError(errorMsg, 5000);
        }
      })(),
    );
  }

  // 共有画像を処理するハンドラー
  async function handleSharedImage(event: Event) {
    const detail = (event as CustomEvent)?.detail;
    if (detail?.file) {
      await uploadFiles([detail.file]);
    }
  }

  // 画像URLを挿入
  function insertImageUrl(imageUrl: string) {
    const textArea = document.querySelector(
      ".post-input",
    ) as HTMLTextAreaElement;

    if (textArea) {
      const startPos = textArea.selectionStart || 0;
      const endPos = textArea.selectionEnd || 0;
      const beforeText = postContent.substring(0, startPos);
      const afterText = postContent.substring(endPos);

      const needsNewlineBefore = beforeText && !beforeText.endsWith("\n");
      const needsNewlineAfter = afterText && !afterText.startsWith("\n");

      postContent =
        beforeText +
        (needsNewlineBefore ? "\n" : "") +
        imageUrl +
        (needsNewlineAfter ? "\n" : "") +
        afterText;

      // カーソル位置を調整
      setTimeout(() => {
        textArea.focus();
        const newCursorPos =
          startPos + imageUrl.length + (needsNewlineBefore ? 1 : 0);
        textArea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    } else {
      // フォールバック: 末尾に追加
      const needsNewline = postContent && !postContent.endsWith("\n");
      postContent += (needsNewline ? "\n" : "") + imageUrl + "\n";
    }
  }

  // ファイル選択・ドロップイベント統合
  function openFileDialog() {
    fileInput?.click();
  }

  async function handleFileSelect(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files?.length) {
      await uploadFiles(files);
    }
  }

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

    const files = event.dataTransfer?.files;
    if (files?.length) {
      await uploadFiles(files);
    }
  }

  // 投稿処理（状態管理をコンポーネント内で完結）
  async function submitPost() {
    if (!postManager) {
      console.error("PostManager is not initialized");
      return;
    }

    if (postManager.containsSecretKey(postContent)) {
      pendingPostContent = postContent;
      showWarningDialog = true;
      return;
    }
    await executePost();
  }

  async function executePost() {
    if (!postManager) {
      console.error("PostManager is not initialized");
      return;
    }

    // 送信開始状態を設定
    postStatus = {
      sending: true,
      success: false,
      error: false,
      message: "",
    };

    try {
      // PostManagerから結果を受け取る
      const result = await postManager.submitPost(postContent);

      if (result.success) {
        // 成功時の状態更新
        postStatus = {
          sending: false,
          success: true,
          error: false,
          message: "post_success",
        };
        resetPostContent();
        onPostSuccess?.();
        showSuccessMessage();
      } else {
        // エラー時の状態更新
        postStatus = {
          sending: false,
          success: false,
          error: true,
          message: result.error || "post_error",
        };
      }
    } catch (error) {
      // 予期しないエラーの処理
      postStatus = {
        sending: false,
        success: false,
        error: true,
        message: "post_error",
      };
      console.error("投稿処理でエラーが発生:", error);
    }
  }

  function resetPostContent() {
    postContent = "";
  }

  function showSuccessMessage() {
    setTimeout(() => {
      postStatus = { ...postStatus, success: false, message: "" };
    }, 3000);
  }

  // ダイアログ処理
  async function confirmPostSecretKey() {
    showWarningDialog = false;
    postContent = pendingPostContent;
    pendingPostContent = "";
    await executePost();
  }

  function cancelPostSecretKey() {
    showWarningDialog = false;
    pendingPostContent = "";
  }

  // ライフサイクル
  onMount(() => {
    window.addEventListener(
      "shared-image-received",
      handleSharedImage as EventListener,
    );
  });

  onDestroy(() => {
    window.removeEventListener(
      "shared-image-received",
      handleSharedImage as EventListener,
    );
    imagePreviewManager.cleanup();
  });

  // リアクティブ処理
  $: if (postContent && postStatus.error) {
    postStatus = { ...postStatus, error: false, message: "" };
  }

  $: contentParts = imagePreviewManager.parseContentWithImages(postContent);
</script>

<!-- 投稿入力エリア -->
<div class="post-container">
  <!-- 投稿ボタン・画像アップロードボタンを最上部に移動 -->
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

    <div class="buttons-container">
      <button
        class="image-button btn-round"
        disabled={!hasStoredKey || postStatus.sending || isUploading}
        on:click={openFileDialog}
        title={$_("upload_image")}
      >
        <img
          src="/ehagaki/icons/image-solid-full.svg"
          alt={$_("upload_image")}
        />
      </button>

      <button
        class="post-button btn-pill"
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

  <div class="post-preview">
    <div class="preview-content">
      {#if postContent.trim()}
        {#each contentParts as part}
          {#if part.type === "image"}
            <img src={part.value} alt="" class="preview-image" />
          {:else}
            {@html part.value.replace(/\n/g, "<br>")}
          {/if}
        {/each}
      {:else}
        <span class="preview-placeholder">{$_("preview")}</span>
      {/if}
    </div>
  </div>

  <!-- テキストエリア -->
  <div class="textarea-container" class:drag-over={dragOver}>
    <textarea
      id="post-input"
      name="postContent"
      class="post-input"
      bind:value={postContent}
      placeholder={$_("enter_your_text")}
      rows="5"
      disabled={postStatus.sending}
      on:dragover={handleDragOver}
      on:dragleave={handleDragLeave}
      on:drop={handleDrop}
    ></textarea>
  </div>

  <!-- ファイル入力（非表示）- multiple属性を追加 -->
  <input
    type="file"
    accept="image/*"
    multiple
    on:change={handleFileSelect}
    bind:this={fileInput}
    style="display: none;"
  />

  {#if uploadErrorMessage}
    <div class="upload-error">{uploadErrorMessage}</div>
  {/if}
</div>

{#if showWarningDialog}
  <div class="dialog-backdrop">
    <div class="dialog">
      <div class="dialog-title">{$_("warning")}</div>
      <div class="dialog-message">
        {$_("secret_key_detected")}
      </div>
      <div class="dialog-actions">
        <button class="dialog-cancel" on:click={cancelPostSecretKey}
          >{$_("cancel")}</button
        >
        <button class="dialog-confirm" on:click={confirmPostSecretKey}
          >{$_("post")}</button
        >
      </div>
    </div>
  </div>
{/if}

<style>
  .post-container {
    max-width: 600px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .post-preview {
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #f9f9f9;
    width: 100%;
    max-width: 600px;
    min-width: 300px;
    max-height: 300px;
    overflow: auto;
  }

  .preview-content {
    font-size: 0.9rem;
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
    border-radius: 8px;
    transition: border-color 0.2s;
  }

  .drag-over {
    border: 2px dashed #1da1f2;
    background-color: rgba(29, 161, 242, 0.05);
  }

  .post-input {
    width: 100%;
    max-width: 600px;
    min-width: 300px;
    max-height: 300px;
    min-height: 260px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    resize: vertical;
    font-family: inherit;
    font-size: 1.2rem;
    transition: border-color 0.2s;
  }

  .post-input:focus {
    outline: none;
    border-color: #1da1f2;
  }

  .post-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    height: 50px;
  }

  .buttons-container {
    display: flex;
    gap: 10px;
    align-items: center;
    height: 100%;
  }

  .image-button:hover:not(:disabled) {
    background-color: #e0e0e0;
  }

  .image-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .upload-error {
    color: #c62828;
    font-size: 0.9rem;
    margin-bottom: 10px;
    width: 100%;
    text-align: left;
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

  .post-button.btn-pill {
    background-color: #1da1f2;
    font-size: 1.1rem;
    font-weight: bold;
    width: 120px;
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
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
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

  .preview-image {
    max-width: 100%;
    max-height: 240px;
    display: block;
    margin: 8px 0;
    border-radius: 6px;
    box-shadow: 0 1px 4px #0001;
    background: #fff;
  }
</style>
