<script lang="ts">
  import { _ } from "svelte-i18n";
  import type { PostStatus } from "../lib/postManager";
  import { PostManager } from "../lib/postManager";
  import { FileUploadManager } from "../lib/fileUploadManager";
  import { getShareHandler } from "../lib/shareHandler";
  import { ImagePreviewManager } from "../lib/imagePreviewUtils";
  import { onMount, onDestroy } from "svelte";

  export let rxNostr: any;
  export let hasStoredKey: boolean;
  export let onPostSuccess: (() => void) | undefined;
  export let onUploadStatusChange: ((isUploading: boolean) => void) | undefined;

  // 投稿機能のための状態変数
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

  // 複数ファイルアップロード用の状態変数
  let uploadProgress = {
    total: 0,
    completed: 0,
    failed: 0,
    inProgress: false,
  };

  // 画像サイズ比較表示用（簡略化）
  let imageSizeInfo = "";
  let imageSizeInfoVisible = false;

  // マネージャーインスタンス
  const postManager = new PostManager(rxNostr);
  const shareHandler = getShareHandler();
  const imagePreviewManager = new ImagePreviewManager();

  // 共有画像を処理するハンドラー
  async function handleSharedImage(event: Event) {
    const detail = (event as CustomEvent)?.detail;

    if (detail && detail.file) {
      // showUploadingWhileを使って統一された状態管理でアップロード処理
      await showUploadingWhile(uploadFileInternal(detail.file), 3000);
    }
  }

  // アップロード状態管理用のヘルパー関数
  async function showUploadingWhile<T>(
    uploadPromise: Promise<T>,
    minDuration = 2500,
  ): Promise<T> {
    isUploading = true;
    if (onUploadStatusChange) onUploadStatusChange(true);

    const timer = new Promise<void>((resolve) =>
      setTimeout(resolve, minDuration),
    );

    try {
      const [result] = await Promise.all([uploadPromise, timer]);
      return result;
    } finally {
      isUploading = false;
      if (onUploadStatusChange) onUploadStatusChange(false);
    }
  }

  // 内部的なアップロード処理（状態管理なし）
  async function uploadFileInternal(
    file: File,
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    if (!file) {
      return { success: false, error: $_("no_file_selected") };
    }

    // ファイルタイプの検証をFileUploadManagerに委譲
    const validation = FileUploadManager.validateImageFile(file);
    if (!validation.isValid) {
      const errorMsg = $_(validation.errorMessage || "upload_failed");
      uploadErrorMessage = errorMsg;
      setTimeout(() => {
        uploadErrorMessage = "";
      }, 3000);
      return { success: false, error: errorMsg };
    }

    try {
      uploadErrorMessage = "";
      imageSizeInfoVisible = false;

      // ローカルストレージから設定されたエンドポイントを取得
      const endpoint = localStorage.getItem("uploadEndpoint") || "";

      // FileUploadManagerに処理を委譲
      const result = await FileUploadManager.uploadFile(file, endpoint);

      // サイズ情報を更新
      updateImageSizeInfo(result);

      if (result.success && result.url) {
        insertImageUrl(result.url);
        if (fileInput) {
          fileInput.value = "";
        }
        return { success: true, url: result.url };
      } else {
        const errorMsg = result.error || $_("upload_failed");
        uploadErrorMessage = errorMsg;
        setTimeout(() => {
          uploadErrorMessage = "";
        }, 3000);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      uploadErrorMessage = errorMsg;
      setTimeout(() => {
        uploadErrorMessage = "";
      }, 3000);
      return { success: false, error: errorMsg };
    }
  }

  // 複数ファイルのアップロード処理（新規）
  async function uploadMultipleFiles(files: FileList | File[]) {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    uploadProgress = {
      total: fileArray.length,
      completed: 0,
      failed: 0,
      inProgress: true,
    };

    await showUploadingWhile(uploadMultipleFilesInternal(fileArray), 1000);
  }

  // 内部的な複数ファイルアップロード処理
  async function uploadMultipleFilesInternal(files: File[]): Promise<void> {
    try {
      uploadErrorMessage = "";
      imageSizeInfoVisible = false;

      const endpoint = localStorage.getItem("uploadEndpoint") || "";
      const results = await FileUploadManager.uploadMultipleFiles(
        files,
        endpoint,
        (progress) => {
          uploadProgress = {
            ...uploadProgress,
            completed: progress.completed,
            failed: progress.failed,
          };
        },
      );

      const successResults = results.filter((r) => r.success);
      const failedResults = results.filter((r) => !r.success);

      if (successResults.length > 0) {
        // 成功した画像URLを挿入
        const urls = successResults.map((r) => r.url!).join("\n");
        insertImageUrl(urls);

        // サイズ情報を表示（最初の結果から）
        if (successResults[0]) {
          updateImageSizeInfo(successResults[0]);
        }
      }

      if (failedResults.length > 0) {
        const errorMsg = `${failedResults.length}個のファイルのアップロードに失敗しました`;
        uploadErrorMessage = errorMsg;
        setTimeout(() => {
          uploadErrorMessage = "";
        }, 5000);
      }

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      uploadErrorMessage = errorMsg;
      setTimeout(() => {
        uploadErrorMessage = "";
      }, 5000);
    } finally {
      uploadProgress = {
        total: 0,
        completed: 0,
        failed: 0,
        inProgress: false,
      };
    }
  }

  // ファイルアップロード処理（公開メソッド）
  async function uploadFile(file: File) {
    await showUploadingWhile(uploadFileInternal(file), 2500);
  }

  // コンポーネントマウント時の処理
  onMount(async () => {
    window.addEventListener(
      "shared-image-received",
      handleSharedImage as EventListener,
    );
  });

  // コンポーネント破棄時にクリーンアップ
  onDestroy(() => {
    window.removeEventListener(
      "shared-image-received",
      handleSharedImage as EventListener,
    );
    imagePreviewManager.cleanup();
  });

  // 画像サイズ情報を更新（新しいヘルパー関数）
  function updateImageSizeInfo(result: any) {
    if (
      result.wasCompressed &&
      result.sizeReduction &&
      result.compressionRatio
    ) {
      imageSizeInfo = `データ量: ${result.sizeReduction} （${result.compressionRatio}%）`;
      imageSizeInfoVisible = true;
    } else {
      imageSizeInfoVisible = false;
    }
  }

  // 画像URLを挿入
  function insertImageUrlImmediately(imageUrl: string) {
    const textArea = document.querySelector(
      ".post-input",
    ) as HTMLTextAreaElement;
    if (textArea) {
      const startPos = textArea.selectionStart || 0;
      const endPos = textArea.selectionEnd || 0;

      const beforeText = postContent.substring(0, startPos);
      const afterText = postContent.substring(endPos);

      const newText =
        beforeText +
        (beforeText.endsWith("\n") || beforeText === "" ? "" : "\n") +
        imageUrl +
        (afterText.startsWith("\n") || afterText === "" ? "" : "\n") +
        afterText;

      postContent = newText;

      // テキストエリアにフォーカスを戻す
      setTimeout(() => {
        textArea.focus();
        const newCursorPos =
          startPos +
          imageUrl.length +
          (beforeText.endsWith("\n") || beforeText === "" ? 0 : 1);
        textArea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    } else {
      // テキストエリアが見つからない場合は末尾に追加
      postContent +=
        (postContent.endsWith("\n") || postContent === "" ? "" : "\n") +
        imageUrl +
        "\n";
    }
  }

  // 画像URLを遅延挿入する新しい関数
  function insertImageUrl(imageUrl: string) {
    // 1秒後にURLを挿入
    setTimeout(() => {
      insertImageUrlImmediately(imageUrl);
    }, 1500);
  }

  // ファイル選択ダイアログを開く
  function openFileDialog() {
    if (fileInput) {
      fileInput.click();
    }
  }

  // ファイルが選択された時
  async function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      if (target.files.length === 1) {
        await uploadFile(target.files[0]);
      } else {
        await uploadMultipleFiles(target.files);
      }
    }
  }

  // ドラッグ＆ドロップイベント
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

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      if (event.dataTransfer.files.length === 1) {
        await uploadFile(event.dataTransfer.files[0]);
      } else {
        await uploadMultipleFiles(event.dataTransfer.files);
      }
    }
  }

  // 投稿送信処理（リファクタリング）
  async function submitPost() {
    if (postManager.containsSecretKey(postContent)) {
      pendingPostContent = postContent;
      showWarningDialog = true;
      return;
    }

    await executePost();
  }

  // 実際の投稿処理
  async function executePost() {
    const success = await postManager.submitPost(postContent, postStatus);

    if (success) {
      handlePostSuccess();
    }
  }

  // 投稿成功時の処理
  function handlePostSuccess() {
    postStatus = {
      ...postStatus,
      success: true,
      message: "post_success",
    };

    postContent = "";
    if (onPostSuccess) onPostSuccess();

    setTimeout(() => {
      postStatus = {
        ...postStatus,
        success: false,
        message: "",
      };
    }, 3000);
  }

  // ダイアログで「投稿」を選択した場合
  async function confirmPostSecretKey() {
    showWarningDialog = false;
    postContent = pendingPostContent;
    pendingPostContent = "";
    await executePost();
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
      message: "",
    };
  }

  // プレビュー用: postContentを画像とテキストに分割（遅延なし）
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

  <!-- アップロード進捗表示（新規） -->
  {#if uploadProgress.inProgress}
    <div class="upload-progress">
      <div class="progress-text">
        アップロード中: {uploadProgress.completed}/{uploadProgress.total}
        {#if uploadProgress.failed > 0}
          (失敗: {uploadProgress.failed})
        {/if}
      </div>
      <div class="progress-bar">
        <div
          class="progress-fill"
          style="width: {Math.round(
            (uploadProgress.completed / uploadProgress.total) * 100
          )}%"
        ></div>
      </div>
    </div>
  {/if}

  {#if uploadErrorMessage}
    <div class="upload-error">{uploadErrorMessage}</div>
  {/if}

  <!-- 画像サイズ比較表示（簡略化） -->
  {#if imageSizeInfoVisible}
    <div class="image-size-info">
      <span>{imageSizeInfo}</span>
    </div>
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
  .image-size-info {
    width: 100%;
    text-align: right;
    font-size: 0.88rem;
    color: #2e7d32;
    margin-bottom: 2px;
    margin-top: -4px;
    opacity: 0.8;
    user-select: none;
    letter-spacing: 0.01em;
  }

  /* 新規スタイル: アップロード進捗 */
  .upload-progress {
    width: 100%;
    margin-bottom: 10px;
  }

  .progress-text {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 4px;
    text-align: center;
  }

  .progress-bar {
    width: 100%;
    height: 4px;
    background-color: #e0e0e0;
    border-radius: 2px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background-color: #1da1f2;
    transition: width 0.3s ease;
  }
</style>
