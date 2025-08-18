<script lang="ts">
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import { EditorContent } from "svelte-tiptap";
  import { PostManager } from "../lib/postManager";
  import {
    FileUploadManager,
    type UploadInfoCallbacks,
  } from "../lib/fileUploadManager";
  import { containsSecretKey } from "../lib/utils";
  import { createEditorStore } from "../lib/editorStore";
  import {
    insertImagesToEditor,
    extractContentWithImages,
  } from "../lib/editorUtils";
  import {
    placeholderTextStore,
    editorState,
    updateEditorContent,
    updatePostStatus,
    updateUploadState,
    resetEditorState,
  } from "../lib/editorStore";
  import Button from "./Button.svelte";
  import Dialog from "./Dialog.svelte";

  export let rxNostr: any;
  export let hasStoredKey: boolean;
  export let onPostSuccess: (() => void) | undefined;
  export let onUploadStatusChange: ((isUploading: boolean) => void) | undefined;
  export let onUploadProgress: ((progress: any) => void) | undefined;

  let editor: any;
  let dragOver = false;
  let fileInput: HTMLInputElement;

  let postManager: PostManager;
  let showSecretKeyDialog = false;
  let pendingPost = "";

  // ストアから状態を取得
  $: postStatus = $editorState.postStatus;
  $: uploadErrorMessage = $editorState.uploadErrorMessage;

  // --- PostManager初期化 ---
  $: if (rxNostr) {
    if (!postManager) {
      postManager = new PostManager(rxNostr);
    } else {
      postManager.setRxNostr(rxNostr);
    }
  }

  // --- Editor初期化・クリーンアップ ---
  // 画像ノードが含まれているか判定する共通関数
  function hasImageInDoc(doc: any): boolean {
    let found = false;
    if (doc) {
      doc.descendants((node: any) => {
        if (node.type?.name === "image") found = true;
      });
    }
    return found;
  }

  onMount(() => {
    const initialPlaceholder =
      $_("enter_your_text") || "テキストを入力してください";
    editor = createEditorStore(initialPlaceholder);

    const handleContentUpdate = (event: CustomEvent) => {
      const plainText = event.detail.plainText;
      let hasImage = false;
      if ($editor) {
        hasImage = hasImageInDoc($editor.state?.doc);
      }
      updateEditorContent(plainText, hasImage);
    };
    window.addEventListener(
      "editor-content-changed",
      handleContentUpdate as EventListener,
    );

    return () => {
      window.removeEventListener(
        "editor-content-changed",
        handleContentUpdate as EventListener,
      );
      try {
        if (editor) {
          let currentEditor: any;
          const unsub = (editor as any).subscribe
            ? (editor as any).subscribe((v: any) => (currentEditor = v))
            : null;
          if (typeof unsub === "function") unsub();
          if (currentEditor && typeof currentEditor.destroy === "function")
            currentEditor.destroy();
          if (typeof (editor as any).destroy === "function")
            (editor as any).destroy();
        }
      } catch (e) {
        console.warn("Editor cleanup failed:", e);
      }
    };
  });

  // --- ファイルアップロード関連 ---
  const uploadCallbacks: UploadInfoCallbacks = { onProgress: onUploadProgress };

  async function withUploadState<T>(
    uploadPromise: Promise<T>,
    minDuration = 1500,
  ): Promise<T> {
    updateUploadState(true);
    onUploadStatusChange?.(true);
    try {
      const result = await uploadPromise;
      await new Promise<void>((resolve) => setTimeout(resolve, minDuration));
      return result;
    } finally {
      updateUploadState(false);
      onUploadStatusChange?.(false);
    }
  }

  function showUploadError(message: string, duration = 3000) {
    updateUploadState($editorState.isUploading, message);
    setTimeout(() => updateUploadState($editorState.isUploading, ""), duration);
  }

  export async function uploadFiles(files: File[] | FileList) {
    const fileArray = Array.from(files);
    if (!fileArray.length) return;
    const endpoint = localStorage.getItem("uploadEndpoint") || "";
    const results = await withUploadState(
      (async () => {
        updateUploadState(true, "");
        try {
          if (fileArray.length === 1) {
            const validation = FileUploadManager.validateImageFile(
              fileArray[0],
            );
            if (!validation.isValid) {
              showUploadError($_(validation.errorMessage || "upload_failed"));
              return null;
            }
            return [
              await FileUploadManager.uploadFileWithCallbacks(
                fileArray[0],
                endpoint,
                uploadCallbacks,
              ),
            ];
          }
          return await FileUploadManager.uploadMultipleFilesWithCallbacks(
            fileArray,
            endpoint,
            uploadCallbacks,
          );
        } catch (error) {
          showUploadError(
            error instanceof Error ? error.message : String(error),
            5000,
          );
          return null;
        }
      })(),
    );

    if (results) {
      const successUrls: string[] = [];
      const failedResults = [];
      for (let i = 0; i < results.length; i++) {
        const r = results[i];
        if (r.success && r.url) {
          successUrls.push(r.url);
        } else if (!r.success) {
          failedResults.push(r);
        }
      }
      if (successUrls.length) {
        insertImagesToEditor($editor, successUrls);
      }
      if (failedResults.length)
        showUploadError(
          failedResults.length === 1
            ? failedResults[0].error || $_("upload_failed")
            : `${failedResults.length}個のファイルのアップロードに失敗しました`,
          5000,
        );
    }
    if (fileInput) fileInput.value = "";
  }

  // --- 投稿処理 ---
  export async function submitPost() {
    if (!postManager) return console.error("PostManager is not initialized");
    const postContent = extractContentWithImages($editor) || "";
    if (containsSecretKey(postContent)) {
      pendingPost = postContent;
      showSecretKeyDialog = true;
      return;
    }
    await executePost(postContent);
  }

  async function executePost(content?: string) {
    if (!postManager) return console.error("PostManager is not initialized");
    const postContent = content || extractContentWithImages($editor) || "";

    updatePostStatus({
      sending: true,
      success: false,
      error: false,
      message: "",
    });
    try {
      const result = await postManager.submitPost(postContent);
      if (result.success) {
        updatePostStatus({
          sending: false,
          success: true,
          error: false,
          message: "post_success",
        });
        resetPostContent();
        onPostSuccess?.();
      } else {
        updatePostStatus({
          sending: false,
          success: false,
          error: true,
          message: result.error || "post_error",
        });
      }
    } catch (error) {
      updatePostStatus({
        sending: false,
        success: false,
        error: true,
        message: "post_error",
      });
      console.error("投稿処理でエラーが発生:", error);
    }
  }

  export function resetPostContent() {
    resetEditorState();
    if ($editor) {
      $editor.chain().clearContent().run();
    }
  }

  // --- シークレットキー警告ダイアログ ---
  async function confirmSendWithSecretKey() {
    showSecretKeyDialog = false;
    await executePost(pendingPost);
    pendingPost = "";
  }
  function cancelSendWithSecretKey() {
    showSecretKeyDialog = false;
    pendingPost = "";
  }

  // --- UIイベントハンドラ ---
  function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      uploadFiles(input.files);
    }
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    const dt = event.dataTransfer;
    // データ転送の types に内部ノード用の MIME type が含まれている場合は内部ドラッグと判断
    const isInternalDrag =
      !!dt &&
      Array.from(dt.types || []).some((t) => t === "application/x-tiptap-node");
    if (!isInternalDrag) {
      dragOver = true;
    } else {
      // 内部ドラッグの場合は dragOver を有効にしない（既に true の場合は解除）
      dragOver = false;
    }
  }

  function handleDragLeave(event: DragEvent) {
    event.preventDefault();
    const dt = event.dataTransfer;
    const isInternalDrag =
      !!dt &&
      Array.from(dt.types || []).some((t) => t === "application/x-tiptap-node");
    if (!isInternalDrag) {
      dragOver = false;
    }
    // 内部ドラッグなら何もしない（エディター内の移動と見なす）
  }

  async function handleDrop(event: DragEvent) {
    event.preventDefault();
    dragOver = false;

    // エディター内での画像移動の場合はエディター側で処理
    const dragData = event.dataTransfer?.getData("application/x-tiptap-node");
    if (dragData) {
      // エディター内部の画像移動なので、ここでは何もしない
      return;
    }

    // 外部ファイルドロップの場合のみファイルアップロード処理
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      await uploadFiles(event.dataTransfer.files);
    }
  }

  // タッチイベントハンドラーを追加
  function handleTouchStart(event: TouchEvent) {
    // 画像以外の領域でのタッチも通常通り処理（PC/スマホ共通）
    // 何もせず通過
  }

  function handleTouchMove(event: TouchEvent) {
    const target = event.target as HTMLElement;
    if (
      target &&
      target.closest('.editor-image-button[data-dragging="true"]')
    ) {
      // ドラッグ中の画像の場合のみスクロールを防止
      event.preventDefault();
      return false;
    }
    // その他の場合は通常のスクロールを許可
  }

  function handleTouchEnd(event: TouchEvent) {
    dragOver = false;

    // ドロップゾーンのクリーンアップ（改善版）
    const dropZones = document.querySelectorAll(".drop-zone-indicator");
    dropZones.forEach((zone) => {
      // ホバー状態をクリア
      zone.classList.remove("drop-zone-hover");
      zone.classList.add("drop-zone-fade-out");
    });

    // フェードアウト後に削除
    setTimeout(() => {
      dropZones.forEach((zone) => {
        if (zone.parentNode) {
          zone.parentNode.removeChild(zone);
        }
      });
    }, 300);
  }

  function handleEditorKeydown(event: KeyboardEvent) {
    if (
      (event.ctrlKey || event.metaKey) &&
      (event.key === "Enter" || event.key === "NumpadEnter")
    ) {
      event.preventDefault();
      const content = extractContentWithImages($editor) || "";
      if (!postStatus.sending && content.trim() && hasStoredKey) submitPost();
    }
  }

  // --- リアクティブ: エディタ・プレースホルダー・エラー ---
  $: if (
    $editor &&
    extractContentWithImages($editor) !== $editorState.content
  ) {
    if (postStatus.error) {
      updatePostStatus({ ...postStatus, error: false, message: "" });
    }
  }
  $: if ($placeholderTextStore && editor) {
    setTimeout(() => {
      if (editor.updatePlaceholder) {
        editor.updatePlaceholder($placeholderTextStore);
      }
    }, 0);
  }

  // 外部からアクセスできるプロパティを公開
  export function openFileDialog() {
    fileInput?.click();
  }
</script>

<div class="post-container">
  <div
    class="editor-container"
    class:drag-over={dragOver}
    on:keydown={handleEditorKeydown}
    on:dragover={handleDragOver}
    on:dragleave={handleDragLeave}
    on:drop={handleDrop}
    on:touchstart={handleTouchStart}
    on:touchmove={handleTouchMove}
    on:touchend={handleTouchEnd}
    aria-label="テキスト入力エリア"
    role="textbox"
    tabindex="0"
  >
    {#if editor && $editor}
      <EditorContent editor={$editor} class="editor-content" />
    {/if}
  </div>

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

<Dialog
  bind:show={showSecretKeyDialog}
  ariaLabel={$_("warning")}
  onClose={cancelSendWithSecretKey}
>
  <div class="secretkey-dialog-content">
    <div class="secretkey-dialog-message">
      {$_("secret_key_detected")}
    </div>
    <div class="secretkey-dialog-buttons">
      <Button className="btn cancel" on:click={cancelSendWithSecretKey}>
        {$_("cancel")}
      </Button>
      <Button className="btn danger" on:click={confirmSendWithSecretKey}>
        {$_("post")}
      </Button>
    </div>
  </div>
</Dialog>

<style>
  .post-container {
    max-width: 800px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
  }

  .upload-error {
    color: #c62828;
    font-size: 0.9rem;
    margin-bottom: 10px;
    width: 100%;
    text-align: left;
  }

  .editor-container {
    width: 100%;
    height: 100%;
    min-height: 200px;
    position: relative;
    cursor: text;
    outline: none;
    border: 1px solid var(--border);
    background: var(--bg-input);
    overflow: hidden;
    /* タッチスクロール最適化 */
    -webkit-overflow-scrolling: touch;
    touch-action: pan-y; /* 縦スクロールのみ許可 */
    /* ドラッグ中のスクロール制御を改善 */
    overscroll-behavior: contain;
  }

  .editor-container:focus {
    outline: 2px solid var(--theme);
    outline-offset: -2px;
  }

  .editor-container:focus-within {
    border-color: var(--theme);
  }

  .editor-container.drag-over {
    border: 3px dashed var(--theme);
  }

  :global(.editor-content) {
    width: 100%;
    height: 100%;
  }

  /* Tiptapエディターのスタイル */
  :global(.tiptap-editor) {
    width: 100%;
    height: 100%;
    min-height: 200px;
    padding: 10px;
    font-family: inherit;
    font-size: 1.1rem;
    line-height: 1.5;
    outline: none;
    white-space: pre-wrap;
    word-break: break-word;
    overflow-y: auto;
    overflow-x: hidden;
  }

  /* プレースホルダースタイル */
  :global(.tiptap-editor .is-editor-empty:first-child::before) {
    content: attr(data-placeholder);
    color: var(--text);
    pointer-events: none;
    height: 0;
    float: left;
    font-size: 1.1rem;
    line-height: 1.5;
    opacity: 0.4;
  }

  /* エディタ内の要素スタイル */
  :global(.tiptap-editor .editor-paragraph) {
    margin: 0;
    padding: 0;
    font-size: 1.1rem;
    line-height: 1.5;
    color: var(--text);
  }

  :global(.tiptap-editor .hashtag) {
    color: var(--hashtag-text);
    font-weight: 600;
    background: var(--hashtag-bg);
    padding: 2px 4px;
    border-radius: 4px;
  }

  :global(.tiptap-editor .preview-link) {
    color: var(--link);
    word-break: break-all;
  }

  :global(.tiptap-editor .preview-link:visited) {
    color: var(--link-visited);
  }

  .secretkey-dialog-content {
    text-align: center;
  }
  .secretkey-dialog-message {
    margin: 28px 0 58px 0;
    color: var(--text);
    font-size: 1.2rem;
    font-weight: bold;
  }
  .secretkey-dialog-buttons {
    display: flex;
    justify-content: center;
    height: 60px;
    gap: 16px;
  }

  :global(.btn.cancel) {
    width: 100%;
  }
  :global(.btn.danger) {
    background: #c62828;
    color: #fff;
    border: none;
    width: 100%;
  }

  /* ドロップゾーンのフェードアウトアニメーション（改善版） */
  :global(.drop-zone-fade-out) {
    animation: dropZoneFadeOut 0.3s ease-out forwards;
  }

  @keyframes dropZoneFadeOut {
    from {
      opacity: 0.9;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.8);
    }
  }

  /* タッチデバイス用の追加スタイル */
  @media (hover: none) and (pointer: coarse) {
    .editor-container {
      /* タッチデバイスでのタップ反応を改善 */
      -webkit-tap-highlight-color: transparent;
      /* ドラッグ中のパフォーマンス向上 */
      will-change: scroll-position;
    }

    /* ドラッグ中の視覚フィードバック強化 */
    :global(.editor-image-button[data-dragging="true"]) {
      z-index: 1;
    }

    :global(.tiptap-editor) {
      /* タッチデバイスでの選択を改善 */
      -webkit-user-select: text;
      user-select: text;
    }
  }

  /* ProseMirror のギャップカーソルの色を上書き（Light / Dark 対応） */
  :global(.tiptap-editor .ProseMirror-gapcursor):after,
  :global(.tiptap-editor .ProseMirror-gapcursor):before {
    border-top-color: black;
  }

  @media (prefers-color-scheme: dark) {
    :global(.tiptap-editor .ProseMirror-gapcursor):after,
    :global(.tiptap-editor .ProseMirror-gapcursor):before {
      border-top-color: white;
    }
  }
</style>
