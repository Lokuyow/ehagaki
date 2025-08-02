<script lang="ts">
  import { _ } from "svelte-i18n";
  import type { PostStatus } from "../lib/postManager";
  import { PostManager } from "../lib/postManager";
  import {
    FileUploadManager,
    type UploadInfoCallbacks,
  } from "../lib/fileUploadManager";
  import ContentPreview from "./ContentPreview.svelte";
  import { onMount, onDestroy } from "svelte";
  import Button from "./Button.svelte";

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

  // 画像アップロード関連
  let isUploading = false;
  let uploadErrorMessage = "";
  let dragOver = false;
  let fileInput: HTMLInputElement;

  // マネージャーインスタンス
  let postManager: PostManager;

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

    const startTime = Date.now();

    try {
      const result = await uploadPromise;

      // アップロード完了後、最小時間が経過していない場合は遅延を追加
      const elapsedTime = Date.now() - startTime;
      const remainingTime = minDuration - elapsedTime;

      if (remainingTime > 0) {
        await new Promise<void>((resolve) =>
          setTimeout(resolve, remainingTime),
        );
      }

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

    const results = await withUploadState(
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
              return null;
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

          return results;
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          showUploadError(errorMsg, 5000);
          return null;
        }
      })(),
    );

    // 遅延処理完了後にURL挿入とエラー処理を実行
    if (results) {
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
    }

    if (fileInput) fileInput.value = "";
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
  });

  // リアクティブ処理
  $: if (postContent && postStatus.error) {
    postStatus = { ...postStatus, error: false, message: "" };
  }
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
      <Button
        className="image-button btn"
        disabled={!hasStoredKey || postStatus.sending || isUploading}
        on:click={openFileDialog}
        ariaLabel={$_("upload_image")}
      >
        <div class="image-icon svg-icon"></div>
      </Button>

      <Button
        className="post-button btn"
        disabled={!postContent.trim() || postStatus.sending || !hasStoredKey}
        on:click={submitPost}
        ariaLabel={$_("post")}
      >
        <div class="plane-icon svg-icon"></div>
      </Button>
    </div>
  </div>

  <!-- 入力＋プレビューラッパー -->
  <div class="input-preview-wrapper">
    <ContentPreview content={postContent} />

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

<style>
  .post-container {
    max-width: 600px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .post-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    padding: 0 10px;
  }

  .buttons-container {
    display: flex;
    gap: 6px;
    align-items: center;
    height: 60px;
  }

  :global(.post-button) {
    font-size: 1.1rem;
    font-weight: bold;
    border: 1px solid var(--hagaki);
    width: 54px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .plane-icon {
    mask-image: url("/ehagaki/icons/paper-plane-solid-full.svg");
  }
  .image-icon {
    mask-image: url("/ehagaki/icons/image-solid-full.svg");
    width: 30px;
    height: 30px;
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

  :global(.image-button) {
    width: 54px;
    border: 1px solid var(--hagaki);
  }

  .upload-error {
    color: #c62828;
    font-size: 0.9rem;
    margin-bottom: 10px;
    width: 100%;
    text-align: left;
  }

  .input-preview-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 200px;
  }

  .textarea-container {
    flex: 1 1 60%;
    min-height: 120px;
    position: relative;
    width: 100%;
    height: 100%;
    transition: border-color 0.2s;
  }

  .drag-over {
    border: 2px dashed #1da1f2;
    background-color: rgba(29, 161, 242, 0.05);
  }

  .post-input {
    background: var(--input-bg);
    width: 100%;
    max-width: 600px;
    min-width: 300px;
    min-height: 80px;
    height: 100%;
    padding: 10px;
    border: 1px solid var(--border);
    resize: vertical;
    font-family: inherit;
    font-size: 1.2rem;
    transition: border-color 0.2s;
  }

  .post-input:focus {
    outline: none;
    border-color: var(--hagaki);
  }
</style>
