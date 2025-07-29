<script lang="ts">
  import { _ } from "svelte-i18n";
  import type { PostStatus } from "../lib/postManager";
  import { PostManager } from "../lib/postManager";
  import { FileUploadManager } from "../lib/fileUploadManager";
  import { getShareHandler } from "../lib/shareHandler";
  import { onMount, onDestroy } from "svelte";

  export let rxNostr: any;
  export let hasStoredKey: boolean;

  // 投稿機能のための状態変数
  let postContent = "";
  let postStatus: PostStatus = {
    sending: false,
    success: false,
    error: false,
    message: "",
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
  let fileInput: HTMLInputElement;

  // 画像サイズ比較表示用
  let originalImageSize = 0;
  let compressedImageSize = 0;
  let originalImageType = "";
  let compressedImageType = "";
  let imageSizeInfoVisible = false;

  // 遅延表示用の状態
  let delayedImages: Record<string, boolean> = {};
  let delayedTimeouts: Record<string, any> = {};

  // ShareHandlerインスタンス（シングルトン）
  const shareHandler = getShareHandler();

  // 共有画像を処理するハンドラー（簡素化）
  function handleSharedImage(event: Event) {
    const detail = (event as CustomEvent)?.detail;
    console.log("PostComponent: 共有画像を受信しました", detail?.file?.name);

    if (detail && detail.file) {
      // 受信した共有画像を自動的にアップロード処理
      uploadFile(detail.file);

      // デバッグ情報を表示
      console.log("PostComponent: 共有画像アップロード処理開始", {
        name: detail.file.name,
        size: `${Math.round(detail.file.size / 1024)}KB`,
        type: detail.file.type,
        metadata: detail.metadata,
      });
    }
  }

  // コンポーネントマウント時にイベントリスナーを追加
  onMount(() => {
    console.log(
      "PostComponent: shared-image-receivedイベントリスナーを登録します",
    );
    window.addEventListener(
      "shared-image-received",
      handleSharedImage as EventListener,
    );
  });

  // コンポーネント破棄時にイベントリスナーを削除
  onDestroy(() => {
    console.log(
      "PostComponent: shared-image-receivedイベントリスナーを削除します",
    );
    window.removeEventListener(
      "shared-image-received",
      handleSharedImage as EventListener,
    );

    // タイマーをクリア
    for (const key in delayedTimeouts) {
      clearTimeout(delayedTimeouts[key]);
    }
  });

  // 画像URLを投稿内容に挿入
  function insertImageUrl(imageUrl: string) {
    // カーソル位置にURLを挿入
    const textArea = document.querySelector(
      ".post-input",
    ) as HTMLTextAreaElement;
    if (textArea) {
      const startPos = textArea.selectionStart || 0;
      const endPos = textArea.selectionEnd || 0;

      const beforeText = postContent.substring(0, startPos);
      const afterText = postContent.substring(endPos);

      // URLの前後に改行を入れる（必要に応じて調整）
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

  // ファイル選択ダイアログを開く
  function openFileDialog() {
    if (fileInput) {
      fileInput.click();
    }
  }

  // ファイルが選択された時
  async function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      await uploadFile(target.files[0]);
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

    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      await uploadFile(event.dataTransfer.files[0]);
    }
  }

  // ファイルアップロード処理
  async function uploadFile(file: File) {
    if (!file) return;

    // 画像ファイルかどうかをチェック
    if (!file.type.startsWith("image/")) {
      uploadErrorMessage = $_("only_images_allowed");
      setTimeout(() => {
        uploadErrorMessage = "";
      }, 3000);
      return;
    }

    try {
      isUploading = true;
      uploadErrorMessage = "";

      // サイズ情報初期化
      originalImageSize = file.size;
      originalImageType = file.type;
      compressedImageSize = 0;
      compressedImageType = "";
      imageSizeInfoVisible = false;

      // ローカルストレージから設定されたエンドポイントを取得
      const endpoint = localStorage.getItem("uploadEndpoint") || "";

      // FileUploadManager.uploadFileを使ってアップロード
      const result = await FileUploadManager.uploadFile(file, endpoint);

      // 圧縮情報を取得して表示
      if (result.originalSize) originalImageSize = result.originalSize;
      if (result.compressedSize) compressedImageSize = result.compressedSize;
      if (result.originalType) originalImageType = result.originalType;
      if (result.compressedType) compressedImageType = result.compressedType;
      imageSizeInfoVisible = result.wasCompressed || false;

      if (result.success && result.url) {
        // 成功したらURLを挿入
        insertImageUrl(result.url);
        // 入力をリセット
        if (fileInput) {
          fileInput.value = "";
        }
      } else {
        uploadErrorMessage = result.error || $_("upload_failed");
        setTimeout(() => {
          uploadErrorMessage = "";
        }, 3000);
      }
    } catch (error) {
      console.error("Upload error:", error);
      uploadErrorMessage =
        error instanceof Error ? error.message : String(error);
      setTimeout(() => {
        uploadErrorMessage = "";
      }, 3000);
    } finally {
      isUploading = false;
    }
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
        message: "post_success",
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
          message: "",
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

  // 画像URLの正規表現
  const imageUrlRegex = /(https?:\/\/[^\s]+?\.(?:png|jpe?g|gif|webp|svg))/gi;

  // プレビュー用: postContentを画像とテキストに分割して表示するための関数
  function parseContentWithImages(content: string) {
    const parts: Array<{ type: "image" | "text"; value: string }> = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    imageUrlRegex.lastIndex = 0;
    while ((match = imageUrlRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          value: content.slice(lastIndex, match.index),
        });
      }
      parts.push({ type: "image", value: match[0] });
      lastIndex = imageUrlRegex.lastIndex;
    }
    if (lastIndex < content.length) {
      parts.push({ type: "text", value: content.slice(lastIndex) });
    }
    return parts;
  }

  // 画像遅延表示用

  // postContentが変わるたびにdelayedImagesを初期化
  $: {
    const parts = parseContentWithImages(postContent);
    // 画像URLごとに遅延状態を管理
    for (const part of parts) {
      if (part.type === "image" && !delayedImages[part.value]) {
        delayedImages[part.value] = false;
        // 1秒後に表示
        if (delayedTimeouts[part.value])
          clearTimeout(delayedTimeouts[part.value]);
        delayedTimeouts[part.value] = setTimeout(() => {
          delayedImages = { ...delayedImages, [part.value]: true };
        }, 1000);
      }
    }
    // 不要なタイムアウトをクリア
    for (const key in delayedImages) {
      if (!parts.some((p) => p.type === "image" && p.value === key)) {
        if (delayedTimeouts[key]) clearTimeout(delayedTimeouts[key]);
        delete delayedImages[key];
        delete delayedTimeouts[key];
      }
    }
  }

  // コンポーネント破棄時にタイマーをクリア
  onDestroy(() => {
    for (const key in delayedTimeouts) {
      clearTimeout(delayedTimeouts[key]);
    }
  });
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
        {#each parseContentWithImages(postContent) as part}
          {#if part.type === "image"}
            {#if delayedImages[part.value]}
              <img src={part.value} alt="" class="preview-image" />
            {:else}
              <span class="preview-image-placeholder"></span>
            {/if}
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

  <!-- ファイル入力（非表示） -->
  <input
    type="file"
    accept="image/*"
    on:change={handleFileSelect}
    bind:this={fileInput}
    style="display: none;"
  />

  {#if uploadErrorMessage}
    <div class="upload-error">{uploadErrorMessage}</div>
  {/if}

  <!-- 画像サイズ比較表示 -->
  {#if imageSizeInfoVisible}
    <div class="image-size-info">
      <span>
        データ量: {Math.round(originalImageSize / 1024)}KB → {Math.round(
          compressedImageSize / 1024,
        )}KB （{originalImageSize > 0
          ? Math.round((compressedImageSize / originalImageSize) * 100)
          : 0}%）
      </span>
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
  }

  .post-preview {
    margin-bottom: 6px;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #f9f9f9;
    width: 100%;
    max-width: 600px;
    min-width: 300px;
    max-height: 300px;
    overflow: auto; /* ← 追加: スクロールバー表示 */
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
    to {
      transform: rotate(360deg);
    }
  }

  .post-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    height: 50px;
    margin-bottom: 10px;
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

  .preview-image-placeholder {
    display: inline-block;
    width: 100%;
    height: 120px;
    background: #f3f3f3;
    border-radius: 6px;
    margin: 8px 0;
    box-shadow: 0 1px 4px #0001;
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
</style>
