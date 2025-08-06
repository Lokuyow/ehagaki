<script lang="ts">
  import { _ } from "svelte-i18n";
  import type { PostStatus } from "../lib/postManager";
  import { PostManager } from "../lib/postManager";
  import {
    FileUploadManager,
    type UploadInfoCallbacks,
  } from "../lib/fileUploadManager";
  import { containsSecretKey } from "../lib/utils";
  import ContentPreview from "./ContentPreview.svelte";
  import { onMount, onDestroy } from "svelte";
  import Button from "./Button.svelte";
  import Dialog from "./Dialog.svelte";

  export let rxNostr: any;
  export let hasStoredKey: boolean;
  export const isNostrLoginAuth: boolean = false;
  export let onPostSuccess: (() => void) | undefined;
  export let onUploadStatusChange: ((isUploading: boolean) => void) | undefined;
  export let onUploadProgress: ((progress: any) => void) | undefined;

  let postContent = "";
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

  $: if (rxNostr) {
    if (!postManager) {
      postManager = new PostManager(rxNostr);
    } else {
      postManager.setRxNostr(rxNostr);
    }
  }

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

  async function uploadFiles(files: File[] | FileList) {
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
      const successResults = results.filter((r) => r.success);
      const failedResults = results.filter((r) => !r.success);
      if (successResults.length)
        insertImageUrl(successResults.map((r) => r.url!).join("\n"));
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
      setTimeout(() => {
        textArea.focus();
        const newCursorPos =
          startPos + imageUrl.length + (needsNewlineBefore ? 1 : 0);
        textArea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    } else {
      const needsNewline = postContent && !postContent.endsWith("\n");
      postContent += (needsNewline ? "\n" : "") + imageUrl + "\n";
    }
  }

  function openFileDialog() {
    fileInput?.click();
  }

  async function handleFileSelect(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files?.length) await uploadFiles(files);
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
    if (files?.length) await uploadFiles(files);
  }

  async function submitPost() {
    if (!postManager) return console.error("PostManager is not initialized");
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
  }

  function showSuccessMessage() {
    setTimeout(
      () => (postStatus = { ...postStatus, success: false, message: "" }),
      3000,
    );
  }

  function handleTextareaKeydown(event: KeyboardEvent) {
    if (
      (event.ctrlKey || event.metaKey) &&
      (event.key === "Enter" || event.key === "NumpadEnter")
    ) {
      event.preventDefault();
      if (!postStatus.sending && postContent.trim() && hasStoredKey)
        submitPost();
    }
  }

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

  $: if (postContent && postStatus.error) {
    postStatus = { ...postStatus, error: false, message: "" };
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

  <div class="input-preview-wrapper">
    <ContentPreview content={postContent} />
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
        on:keydown={handleTextareaKeydown}
      ></textarea>
    </div>
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
    background: var(--bg-input);
    width: 100%;
    max-width: 800px;
    min-width: 300px;
    min-height: 80px;
    height: 100%;
    padding: 10px;
    border: 1px solid var(--border);
    resize: none;
    font-family: inherit;
    font-size: 1.1rem;
    transition: border-color 0.2s;
  }

  .post-input:focus {
    outline: none;
    border-color: var(--theme);
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
