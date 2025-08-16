<script lang="ts">
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import { EditorContent } from "svelte-tiptap";
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
  export let onPostSuccess: (() => void) | undefined;
  export let onUploadStatusChange: ((isUploading: boolean) => void) | undefined;
  export let onUploadProgress: ((progress: any) => void) | undefined;

  let postContent = "";
  let editor: any;
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

  let postManager: PostManager;
  let showSecretKeyDialog = false;
  let pendingPost = "";

  // --- PostManager初期化 ---
  $: if (rxNostr) {
    if (!postManager) {
      postManager = new PostManager(rxNostr);
    } else {
      postManager.setRxNostr(rxNostr);
    }
  }

  // --- Editor初期化・クリーンアップ ---
  onMount(() => {
    const initialPlaceholder =
      $_("enter_your_text") || "テキストを入力してください";
    editor = createEditorStore(initialPlaceholder);

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

  // --- 投稿処理 ---
  async function submitPost() {
    if (!postManager) return console.error("PostManager is not initialized");
    postContent = $editor?.getText() || "";
    if (containsSecretKey(postContent)) {
      pendingPost = postContent;
      showSecretKeyDialog = true;
      return;
    }
    await executePost();
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

  // --- シークレットキー警告ダイアログ ---
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

  // --- UIイベントハンドラ ---
  function openFileDialog() {
    fileInput?.click();
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

  // --- リアクティブ: エディタ・プレースホルダー・エラー ---
  $: if ($editor && $editor.getText() !== postContent) {
    if (postStatus.error) {
      postStatus = { ...postStatus, error: false, message: "" };
    }
  }
  $: if ($placeholderTextStore && editor) {
    setTimeout(() => {
      if (editor.updatePlaceholder) {
        editor.updatePlaceholder($placeholderTextStore);
      }
    }, 0);
  }
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
    on:keydown={handleEditorKeydown}
    on:dragover={handleDragOver}
    on:dragleave={handleDragLeave}
    on:drop={handleDrop}
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
    border: 1px solid var(--border);
    background: var(--bg-input);
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
</style>
