<script lang="ts">
  import { _ } from "svelte-i18n";
  import { onMount, onDestroy } from "svelte";
  import type { Readable } from "svelte/store";
  import { EditorContent, Editor } from "svelte-tiptap";
  import type { PostStatus } from "../lib/postManager";
  import { PostManager } from "../lib/postManager";
  import {
    FileUploadManager,
    type UploadInfoCallbacks,
  } from "../lib/fileUploadManager";
  import { containsSecretKey } from "../lib/utils";
  import {
    createEditorStore,
    insertImagesToEditor,
  } from "../lib/editorController";
  import { placeholderTextStore } from "../lib/stores";
  import Button from "./Button.svelte";
  import Dialog from "./Dialog.svelte";

  export let rxNostr: any;
  export let hasStoredKey: boolean;
  export const isNostrLoginAuth: boolean = false;
  export let onPostSuccess: (() => void) | undefined;
  export let onUploadStatusChange: ((isUploading: boolean) => void) | undefined;
  export let onUploadProgress: ((progress: any) => void) | undefined;

  let postContent = "";
  let editor: any; // 型を変更してupdatePlaceholderメソッドにアクセス
  let postStatus: PostStatus = {
    sending: false,
    success: false,
    error: false,
    message: "",
  };

  let isUploading = false;
  let uploadErrorMessage = "";
  let dragOver = false;
  let fileInput: HTMLInputElement;

  function openFileDialog() {
    fileInput?.click();
  }

  let postManager: PostManager;
  let showSecretKeyDialog = false;
  let pendingPost = "";

  $: if (rxNostr) {
    if (!postManager) {
      postManager = new PostManager(rxNostr);
    } else {
      postManager.setRxNostr(rxNostr);
    }
  }

  onMount(() => {
    // エディタを初期化
    const initialPlaceholder =
      $_("enter_your_text") || "テキストを入力してください";
    editor = createEditorStore(initialPlaceholder);

    // Tiptap v2のコンテンツ変更イベントを直接監視
    const handleContentUpdate = (event: CustomEvent) => {
      postContent = event.detail.plainText;
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
    };
  });

  onDestroy(() => {
    // ...existing cleanup code...
  });

  const uploadCallbacks: UploadInfoCallbacks = {
    onProgress: onUploadProgress,
  };

  async function withUploadState<T>(
    uploadPromise: Promise<T>,
    minDuration = 1500,
  ): Promise<T> {
    isUploading = true;
    onUploadStatusChange?.(true);
    try {
      const result = await uploadPromise;
      await new Promise<void>((resolve) => setTimeout(resolve, minDuration));
      return result;
    } finally {
      isUploading = false;
      onUploadStatusChange?.(false);
    }
  }

  function showUploadError(message: string, duration = 3000) {
    uploadErrorMessage = message;
    setTimeout(() => (uploadErrorMessage = ""), duration);
  }

  export async function uploadFiles(files: File[] | FileList) {
    const fileArray = Array.from(files);
    if (!fileArray.length) return;
    const endpoint = localStorage.getItem("uploadEndpoint") || "";
    const results = await withUploadState(
      (async () => {
        uploadErrorMessage = "";
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
      const successResults: { url: string }[] = [];
      const failedResults = [];
      for (let i = 0; i < results.length; i++) {
        const r = results[i];
        if (r.success && r.url) {
          successResults.push({ url: r.url });
        } else if (!r.success) {
          failedResults.push(r);
        }
      }
      if (successResults.length) {
        // Tiptap v2のコマンドを直接使用
        insertImagesToEditor(
          $editor,
          successResults.map((r) => r.url).join("\n"),
        );
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

  async function handleSharedImage(event: Event) {
    const detail = (event as CustomEvent)?.detail;
    if (detail?.file) await uploadFiles([detail.file]);
  }

  async function submitPost() {
    if (!postManager) return console.error("PostManager is not initialized");

    // Tiptap v2から直接テキストを取得
    postContent = $editor?.getText() || "";

    if (containsSecretKey(postContent)) {
      pendingPost = postContent;
      showSecretKeyDialog = true;
      return;
    }
    await executePost();
  }

  async function confirmSendWithSecretKey() {
    showSecretKeyDialog = false;
    postContent = pendingPost;
    await executePost();
    pendingPost = "";
  }

  function cancelSendWithSecretKey() {
    showSecretKeyDialog = false;
    pendingPost = "";
  }

  async function executePost() {
    if (!postManager) return console.error("PostManager is not initialized");
    postStatus = { sending: true, success: false, error: false, message: "" };
    try {
      const result = await postManager.submitPost(postContent);
      if (result.success) {
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
        postStatus = {
          sending: false,
          success: false,
          error: true,
          message: result.error || "post_error",
        };
      }
    } catch (error) {
      postStatus = {
        sending: false,
        success: false,
        error: true,
        message: "post_error",
      };
      console.error("投稿処理でエラーが発生:", error);
    }
  }

  export function resetPostContent() {
    postContent = "";
    // Tiptap v2のコマンドを使用
    if ($editor) {
      $editor.chain().clearContent().run();
    }
  }

  function showSuccessMessage() {
    setTimeout(
      () => (postStatus = { ...postStatus, success: false, message: "" }),
      3000,
    );
  }

  function handleEditorKeydown(event: KeyboardEvent) {
    if (
      (event.ctrlKey || event.metaKey) &&
      (event.key === "Enter" || event.key === "NumpadEnter")
    ) {
      event.preventDefault();
      const content = $editor?.getText() || "";
      if (!postStatus.sending && content.trim() && hasStoredKey) submitPost();
    }
  }

  function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      uploadFiles(input.files);
    }
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    dragOver = true;
  }

  function handleDragLeave(event: DragEvent) {
    event.preventDefault();
    dragOver = false;
  }

  async function handleDrop(event: DragEvent) {
    event.preventDefault();
    dragOver = false;
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      await uploadFiles(event.dataTransfer.files);
    }
  }

  function handleContainerClick() {
    // Tiptap v2のfocusコマンドを使用
    if ($editor) {
      $editor.chain().focus("end").run();
    }
  }

  // Tiptap v2の状態変更を直接監視
  $: if ($editor && $editor.getText() !== postContent) {
    if (postStatus.error) {
      postStatus = { ...postStatus, error: false, message: "" };
    }
  }

  // プレースホルダーテキストの変更を監視して動的更新（安全性を向上）
  $: if ($placeholderTextStore && editor) {
    // エディターが完全に初期化されてから更新
    setTimeout(() => {
      if (editor.updatePlaceholder) {
        editor.updatePlaceholder($placeholderTextStore);
      }
    }, 0);
  }

  // プレースホルダー文言をストアから取得
  $: placeholderText = $placeholderTextStore || $_("enter_your_text");
</script>

<div class="post-container">
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
        className="image-button btn-angular"
        disabled={!hasStoredKey || postStatus.sending || isUploading}
        on:click={openFileDialog}
        ariaLabel={$_("upload_image")}
      >
        <div class="image-icon svg-icon"></div>
      </Button>
      <Button
        className="post-button btn-angular"
        disabled={!postContent.trim() || postStatus.sending || !hasStoredKey}
        on:click={submitPost}
        ariaLabel={$_("post")}
      >
        <div class="plane-icon svg-icon"></div>
      </Button>
    </div>
  </div>

  <div
    class="editor-container"
    class:drag-over={dragOver}
    on:click={handleContainerClick}
    on:keydown={handleEditorKeydown}
    on:dragover={handleDragOver}
    on:dragleave={handleDragLeave}
    on:drop={handleDrop}
    aria-label="テキスト入力エリア"
    role="textbox"
    tabindex="0"
  >
    {#if editor && $editor}
      <div class="tiptap-wrapper">
        <EditorContent editor={$editor} />
      </div>
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
    gap: 8px;
  }

  .post-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    padding: 0 16px;
  }

  .buttons-container {
    display: flex;
    gap: 6px;
    align-items: center;
    height: 64px;
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
    width: 30px;
    height: 30px;
  }
  .image-icon {
    mask-image: url("/ehagaki/icons/image-solid-full.svg");
    width: 32px;
    height: 32px;
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

  .editor-container {
    width: 100%;
    height: 100%;
    min-height: 200px;
    position: relative;
    cursor: text;
    outline: none;
  }

  .editor-container:focus {
    outline: 2px solid var(--theme);
    outline-offset: -2px;
  }

  .editor-container.drag-over {
    border-color: var(--theme);
    background-color: rgba(var(--theme-rgb), 0.05);
  }

  .tiptap-wrapper {
    width: 100%;
    height: 100%;
    border: 1px solid var(--border);
    background: var(--bg-input);
    position: relative;
  }

  .editor-container:focus-within .tiptap-wrapper {
    border-color: var(--theme);
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
  }

  /* プレースホルダースタイル */
  :global(.tiptap-editor .is-editor-empty:first-child::before) {
    content: attr(data-placeholder);
    color: var(--text-light, #999);
    pointer-events: none;
    height: 0;
    float: left;
    font-size: 1.1rem;
    line-height: 1.5;
  }

  :global(.tiptap-editor.is-editor-empty .ProseMirror-widget::before) {
    content: "{placeholderText}"; /* ここを変数展開に変更 */
    color: var(--text-light, #999);
    pointer-events: none;
    position: absolute;
    font-size: 1.1rem;
    line-height: 1.5;
  }

  /* エディタ内の要素スタイル */
  :global(.tiptap-editor .editor-image) {
    max-width: 100%;
    max-height: 160px;
    display: block;
    margin: 8px 0;
    border-radius: 6px;
    box-shadow: 0 1px 4px #0001;
    background: #fff;
  }

  :global(.tiptap-editor .editor-paragraph) {
    margin: 0;
    padding: 0;
    font-size: 1.1rem;
    line-height: 1.5;
    color: var(--text);
  }

  :global(.tiptap-editor .hashtag) {
    color: #1976d2;
    font-weight: 600;
    background: rgba(25, 118, 210, 0.1);
    padding: 2px 4px;
    border-radius: 4px;
  }

  :global(.tiptap-editor .preview-link) {
    color: #1da1f2;
    text-decoration: underline;
    word-break: break-all;
  }

  :global(.tiptap-editor .preview-link:hover) {
    color: #0d8bd9;
    text-decoration: none;
  }

  :global(.tiptap-editor .preview-link:visited) {
    color: #9c27b0;
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
</style>
