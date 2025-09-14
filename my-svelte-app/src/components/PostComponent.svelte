<script lang="ts">
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import { EditorContent } from "svelte-tiptap";
  import { PostManager } from "../lib/postManager";
  import type {
    UploadInfoCallbacks,
    Props,
    UploadHelperResult,
  } from "../lib/types";
  import { containsSecretKey } from "../lib/appUtils";
  import { uploadHelper } from "../lib/uploadHelper";
  import type { Readable } from "svelte/store";
  import type { Editor as TipTapEditor } from "@tiptap/core";
  import type { Node as PMNode } from "prosemirror-model";
  import type { RxNostr } from "rx-nostr";
  import { NodeSelection } from "prosemirror-state"; // 追加

  import {
    createEditorStore,
    placeholderTextStore,
    editorState,
    updateEditorContent,
    updatePostStatus,
    updateUploadState,
    resetEditorState,
    resetPostStatus,
    setPostSubmitter,
  } from "../stores/editorStore.svelte";

  import { extractContentWithImages } from "../lib/editor/editorUtils";
  import { extractImageBlurhashMap, getMimeTypeFromUrl } from "../lib/tags/imetaTag";
  import Button from "./Button.svelte";
  import Dialog from "./Dialog.svelte";
  import ImageFullscreen from "./ImageFullscreen.svelte";
  import ImagePlaceholder from "./ImagePlaceholder.svelte";
  import {
    fileDropAction,
    pasteAction,
    touchAction,
    keydownAction,
  } from "../lib/editor/editorDomActions";
  import { getPlaceholderDefaultSize } from "../lib/imageUtils";

  // EditorStore型
  type EditorStore = Readable<TipTapEditor | null> & {
    updatePlaceholder?: (s: string) => void;
  };

  let { rxNostr, hasStoredKey, onPostSuccess, onUploadProgress }: Props =
    $props();
  let editor: EditorStore | null = $state(null);
  let currentEditor: TipTapEditor | null = $state(null);
  let dragOver = $state(false);
  let fileInput: HTMLInputElement | undefined = $state();
  let postManager: PostManager | undefined = $state();
  let showSecretKeyDialog = $state(false);
  let pendingPost = "";
  let showImageFullscreen = $state(false);
  let fullscreenImageSrc = $state("");
  let fullscreenImageAlt = $state("");
  let imageOxMap: Record<string, string> = $state({});
  let imageXMap: Record<string, string> = $state({});
  let postStatus = $derived(editorState.postStatus);
  let uploadErrorMessage = $derived(editorState.uploadErrorMessage);
  let editorContainerEl: HTMLElement | null = null;
  const placeholderDimensions = getPlaceholderDefaultSize();

  // --- PostManager初期化 ---
  $effect(() => {
    if (rxNostr) {
      if (!postManager) postManager = new PostManager(rxNostr as RxNostr);
      else postManager.setRxNostr(rxNostr as RxNostr);
    }
  });

  // --- Editor初期化・クリーンアップ ---
  function hasImageInDoc(doc: PMNode | undefined | null): boolean {
    let found = false;
    doc?.descendants((node: PMNode) => {
      if ((node as any).type?.name === "image") found = true;
    });
    return found;
  }

  onMount(() => {
    const initialPlaceholder =
      $_("postComponent.enter_your_text") || "テキストを入力してください";
    editor = createEditorStore(initialPlaceholder) as EditorStore;
    const unsubscribe = editor.subscribe(
      (editorInstance) => (currentEditor = editorInstance),
    );

    function handleContentUpdate(event: CustomEvent<{ plainText: string }>) {
      const plainText = event.detail.plainText;
      let hasImage = currentEditor
        ? hasImageInDoc(currentEditor.state?.doc as PMNode | undefined)
        : false;
      updateEditorContent(plainText, hasImage);
    }
    function handleImageFullscreenRequest(
      event: CustomEvent<{ src: string; alt?: string }>,
    ) {
      fullscreenImageSrc = event.detail.src;
      fullscreenImageAlt = event.detail.alt || "";
      showImageFullscreen = true;
    }

    // 追加: 画像ノード選択要求を受け取り、エディタをフォーカスして NodeSelection をセットする
    function handleSelectImageNode(e: CustomEvent<{ pos: number }>) {
      const pos = e?.detail?.pos;
      if (pos == null) return;
      if (!currentEditor || !currentEditor.view) return;
      try {
        // フォーカスして選択を設定
        currentEditor.view.focus();
        const sel = NodeSelection.create(
          currentEditor.state.doc,
          pos,
        );
        currentEditor.view.dispatch(currentEditor.state.tr.setSelection(sel).scrollIntoView());
      } catch (err) {
        // ignore
        console.warn("select-image-node handler failed:", err);
      }
    }

    window.addEventListener(
      "editor-content-changed",
      handleContentUpdate as EventListener,
    );
    window.addEventListener(
      "image-fullscreen-request",
      handleImageFullscreenRequest as EventListener,
    );
    window.addEventListener(
      "select-image-node",
      handleSelectImageNode as EventListener,
    );

    setPostSubmitter(submitPost);

    if (editorContainerEl) {
      Object.assign(editorContainerEl, {
        __uploadFiles: uploadFiles,
        __currentEditor: () => currentEditor,
        __hasStoredKey: () => hasStoredKey,
        __postStatus: () => postStatus,
        __submitPost: submitPost,
      });
    }

    return () => {
      window.removeEventListener(
        "editor-content-changed",
        handleContentUpdate as EventListener,
      );
      window.removeEventListener(
        "image-fullscreen-request",
        handleImageFullscreenRequest as EventListener,
      );
      window.removeEventListener(
        "select-image-node",
        handleSelectImageNode as EventListener,
      );
      unsubscribe();
      currentEditor?.destroy?.();
      if (editorContainerEl) {
        delete (editorContainerEl as any).__uploadFiles;
        delete (editorContainerEl as any).__currentEditor;
        delete (editorContainerEl as any).__hasStoredKey;
        delete (editorContainerEl as any).__postStatus;
        delete (editorContainerEl as any).__submitPost;
      }
    };
  });

  function clearEditorContent() {
    currentEditor?.chain().clearContent().run();
  }

  function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) uploadFiles(input.files);
  }

  const uploadCallbacks: UploadInfoCallbacks | undefined = onUploadProgress
    ? {
        onProgress: onUploadProgress as (
          p: import("../lib/types").UploadProgress,
        ) => void,
      }
    : undefined;

  function showUploadError(message: string, duration = 3000) {
    updateUploadState(editorState.isUploading, message);
    setTimeout(() => updateUploadState(editorState.isUploading, ""), duration);
  }

  export async function uploadFiles(files: File[] | FileList) {
    if (!files || files.length === 0) return;
    const result: UploadHelperResult = await uploadHelper({
      files,
      currentEditor,
      fileInput,
      uploadCallbacks,
      showUploadError,
      updateUploadState,
      devMode: import.meta.env.MODE === "development",
    });
    Object.assign(imageOxMap, result.imageOxMap);
    Object.assign(imageXMap, result.imageXMap);
    if (result.failedResults?.length) {
      showUploadError(
        result.errorMessage ||
          (result.failedResults.length === 1
            ? result.failedResults[0].error || $_("postComponent.upload_failed")
            : `${result.failedResults.length}個のファイルのアップロードに失敗しました`),
        5000,
      );
    }
    if (fileInput) fileInput.value = "";
  }

  export async function submitPost() {
    if (!postManager) return console.error("PostManager is not initialized");
    const postContent = extractContentWithImages(currentEditor) || "";
    if (containsSecretKey(postContent)) {
      pendingPost = postContent;
      showSecretKeyDialog = true;
      return;
    }
    await executePost(postContent);
  }

  async function executePost(content?: string) {
    if (!postManager) return console.error("PostManager is not initialized");
    const postContent =
      content || extractContentWithImages(currentEditor) || "";
    const rawImageBlurhashMap = extractImageBlurhashMap(currentEditor);
    const imageBlurhashMap: Record<string, any> = {};
    for (const [url, blurhash] of Object.entries(rawImageBlurhashMap)) {
      imageBlurhashMap[url] = {
        m: getMimeTypeFromUrl(url),
        blurhash,
        ox: imageOxMap[url],
        x: imageXMap[url],
      };
    }
    updatePostStatus({
      sending: true,
      success: false,
      error: false,
      message: "",
      completed: false,
    });
    try {
      const result = await postManager.submitPost(
        postContent,
        imageBlurhashMap,
      );
      if (result.success) {
        updatePostStatus({
          sending: false,
          success: true,
          error: false,
          message: "postComponent.post_success",
          completed: true,
        });
        clearEditorContent();
        onPostSuccess?.();
      } else {
        updatePostStatus({
          sending: false,
          success: false,
          error: true,
          message: result.error || "postComponent.post_error",
          completed: false,
        });
      }
    } catch (error) {
      updatePostStatus({
        sending: false,
        success: false,
        error: true,
        message: "postComponent.post_error",
        completed: false,
      });
      console.error("投稿処理でエラーが発生:", error);
    }
  }

  export function resetPostContent() {
    resetEditorState();
    clearEditorContent();
  }

  export function clearContentAfterSuccess() {
    clearEditorContent();
    resetPostStatus();
  }

  async function confirmSendWithSecretKey() {
    showSecretKeyDialog = false;
    await executePost(pendingPost);
    pendingPost = "";
  }
  function cancelSendWithSecretKey() {
    showSecretKeyDialog = false;
    pendingPost = "";
  }

  $effect(() => {
    if (
      currentEditor &&
      extractContentWithImages(currentEditor) !== editorState.content &&
      postStatus.error
    ) {
      updatePostStatus({ ...postStatus, error: false, message: "" });
    }
  });
  $effect(() => {
    if (placeholderTextStore.value && editor?.updatePlaceholder) {
      setTimeout(
        () => editor && editor.updatePlaceholder?.(placeholderTextStore.value),
        0,
      );
    }
  });

  export function openFileDialog() {
    fileInput?.click();
  }

  function handleImageFullscreenClose() {
    showImageFullscreen = false;
    fullscreenImageSrc = "";
    fullscreenImageAlt = "";
    setTimeout(() => {
      document.querySelector<HTMLElement>(".tiptap-editor")?.focus();
    }, 150);
  }
</script>

<div class="post-container">
  <div
    class="editor-container"
    class:drag-over={dragOver}
    use:fileDropAction
    use:pasteAction
    use:touchAction
    use:keydownAction
    aria-label="テキスト入力エリア"
    role="textbox"
    tabindex="0"
    bind:this={editorContainerEl}
  >
    {#if editor && currentEditor}
      <!-- svelte-tiptap の Editor 型差異を回避するためここでは any キャスト -->
      <EditorContent editor={currentEditor as any} class="editor-content" />
    {/if}
    <!-- プレースホルダー表示をImagePlaceholderに置き換え -->
    {#if !editorState.content && !editorState.hasImage}
      <ImagePlaceholder
        blurhash=""
        dimensions={placeholderDimensions}
        alt={$_("postComponent.enter_your_text") ||
          "テキストを入力してください"}
        showLoadingIndicator={false}
      />
    {/if}
  </div>

  <input
    type="file"
    accept="image/*"
    multiple
    onchange={handleFileSelect}
    bind:this={fileInput}
    style="display: none;"
  />

  {#if uploadErrorMessage}
    <div class="upload-error">{uploadErrorMessage}</div>
  {/if}
</div>

<Dialog
  bind:show={showSecretKeyDialog}
  ariaLabel={$_("postComponent.warning")}
  onClose={cancelSendWithSecretKey}
>
  <div class="secretkey-dialog-content">
    <div class="secretkey-dialog-message">
      {$_("postComponent.secret_key_detected")}
    </div>
    <div class="secretkey-dialog-buttons">
      <Button
        className="btn-confirm"
        variant="danger"
        shape="square"
        onClick={confirmSendWithSecretKey}
      >
        {$_("postComponent.post")}
      </Button>
      <Button
        className="btn-cancel"
        variant="secondary"
        shape="square"
        onClick={cancelSendWithSecretKey}
      >
        {$_("postComponent.cancel")}
      </Button>
    </div>
  </div>
</Dialog>

<ImageFullscreen
  bind:show={showImageFullscreen}
  src={fullscreenImageSrc}
  alt={fullscreenImageAlt}
  onClose={handleImageFullscreenClose}
/>

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
    background: var(--bg-input);
    overflow: hidden;
    touch-action: pan-y; /* 縦スクロールのみ許可 */
    /* ドラッグ中のスクロール制御を改善 */
    overscroll-behavior: contain;
    /* 自動スクロール時はスムーズスクロールを無効化 */
    scroll-behavior: auto;
    /* タッチデバイスでのフォーカス処理改善 */
    -webkit-tap-highlight-color: transparent;
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
    font-size: 1.25rem;
    line-height: 1.4;
    outline: none;
    overflow-y: auto;
    overflow-x: hidden;
    /* スクロール最適化 */
    scroll-behavior: auto;
    /* GPU加速を有効化 */
    will-change: scroll-position;
    transform: translateZ(0);
    /* タッチデバイスでのフォーカス処理改善 */
    -webkit-tap-highlight-color: transparent;
  }

  /* エディタ内の要素スタイル */
  :global(.tiptap-editor .editor-paragraph) {
    margin: 0;
    padding: 0;
    color: var(--text);
    white-space: break-spaces;
  }

  :global(.tiptap-editor .hashtag) {
    color: var(--hashtag-text);
    font-weight: 600;
    background: var(--hashtag-bg);
    padding: 2px 4px;
    border-radius: 4px;
    word-break: break-all;
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
    margin: 46px 0;
    color: var(--text);
    font-size: 1.2rem;
    font-weight: bold;
  }
  .secretkey-dialog-buttons {
    display: flex;
    justify-content: center;
    height: 60px;
    gap: 8px;

    :global(button) {
      flex: 1;
      font-size: 1.2rem;
    }
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
      /* スクロールパフォーマンス最適化 */
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
      backface-visibility: hidden;
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
