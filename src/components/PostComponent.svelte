<script lang="ts">
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import { EditorContent } from "svelte-tiptap";
  import type { Editor as TipTapEditor } from "@tiptap/core";
  import type { RxNostr } from "rx-nostr";
  import type { UploadProgress } from "../lib/types";
  import { videoCompressionProgressStore, imageCompressionProgressStore } from "../stores/appStore.svelte";
  import { PostManager } from "../lib/postManager";
  import { uploadFiles as uploadFilesHelper } from "../lib/uploadHelper";
  import ContextMenu from "./ContextMenu.svelte";
  import PopupModal from "./PopupModal.svelte";
  import SecretKeyWarningDialog from "./SecretKeyWarningDialog.svelte";
  import {
    fileDropAction as _fileDropAction,
    pasteAction,
    touchAction,
    keydownAction,
    fileDropActionWithDragState,
  } from "../lib/editor/editorDomActions.svelte";
  import { containsSecretKey } from "../lib/utils/appUtils";
  import { domUtils } from "../lib/utils/appDomUtils";
  import { prepareGlobalContextMenuItems } from "../lib/utils/imageContextMenuUtils";
  import {
    globalContextMenuStore,
    lastClickPositionStore,
    postComponentUIStore,
  } from "../stores/appStore.svelte";
  import {
    placeholderTextStore,
    editorState,
    updateEditorContent,
    updatePostStatus,
    initializeEditor,
    cleanupEditor,
    currentEditorStore,
  } from "../stores/editorStore.svelte";
  import ImageFullscreen from "./ImageFullscreen.svelte";
  import type { InitializeEditorResult, MenuItem } from "../lib/types";

  interface Props {
    rxNostr?: RxNostr;
    hasStoredKey: boolean;
    onPostSuccess?: () => void;
    onUploadStatusChange?: (isUploading: boolean) => void;
    onUploadProgress?: (progress: UploadProgress) => void;
  }

  let { rxNostr, hasStoredKey, onPostSuccess, onUploadProgress }: Props =
    $props();
  let editor: any = $state(null);
  let currentEditor: TipTapEditor | null = $state(null);
  let dragOver = $state(false);
  let fileInput: HTMLInputElement | undefined = $state();
  let postManager: PostManager | undefined = $state();
  let imageOxMap: Record<string, string> = $state({});
  let imageXMap: Record<string, string> = $state({});
  let postStatus = $derived(editorState.postStatus);
  let uploadErrorMessage = $derived(editorState.uploadErrorMessage);
  let editorContainerEl: HTMLElement | null = null;
  let editorResources: InitializeEditorResult | null = null;

  // UI状態をストアから取得
  let postComponentUI = $derived(postComponentUIStore.value);
  let showSecretKeyDialog = $derived(postComponentUI.showSecretKeyDialog);
  let showImageFullscreen = $derived(postComponentUI.showImageFullscreen);
  let fullscreenImageSrc = $derived(postComponentUI.fullscreenImageSrc);
  let fullscreenImageAlt = $derived(postComponentUI.fullscreenImageAlt);
  let showPopupModal = $derived(postComponentUI.showPopupModal);
  let popupX = $derived(postComponentUI.popupX);
  let popupY = $derived(postComponentUI.popupY);
  let popupMessage = $derived(postComponentUI.popupMessage);

  // グローバルコンテキストメニューの状態
  let globalContextMenuState = $derived($globalContextMenuStore);
  let showGlobalContextMenu = $derived(globalContextMenuState.open);
  let globalContextMenuX = $state(0);
  let globalContextMenuY = $state(0);
  let globalContextMenuItems = $state<MenuItem[]>([]);

  // --- PostManager初期化 ---
  $effect(() => {
    if (rxNostr) {
      if (!postManager) postManager = new PostManager(rxNostr as RxNostr);
      else postManager.setRxNostr(rxNostr as RxNostr);
    }
  });

  async function performUpload(files: File[] | FileList | null | undefined): Promise<void> {
    if (!files || files.length === 0) return;

    await uploadFilesHelper({
      files,
      currentEditor,
      fileInput,
      onUploadProgress,
      updateUploadState: (isUploading: boolean, message?: string) => {
        editorState.isUploading = isUploading;
        editorState.uploadErrorMessage = message || "";
      },
      imageOxMap,
      imageXMap,
      videoCompressionProgressStore,
      imageCompressionProgressStore,
      getUploadFailedText: (key: string) => $_(key),
    });
  }

  // --- Editor初期化・クリーンアップ ---
  onMount(() => {
    const initialPlaceholder =
      $_("postComponent.enter_your_text") || "テキストを入力してください";

    editorResources = initializeEditor({
      placeholderText: initialPlaceholder,
      editorContainerEl,
      currentEditor,
      hasStoredKey,
      submitPost,
      uploadFiles: (files: File[] | FileList) => {
        void performUpload(files);
      },
      eventCallbacks: {
        onContentUpdate: updateEditorContent,
        onImageFullscreenRequest: (src: string, alt: string) => {
          postComponentUIStore.showImageFullscreen(src, alt);
        },
        onSelectImageNode: (pos: number) => {
          // 既に handleSelectImageNode 内で処理済み
        },
      },
    });

    editor = editorResources.editor;

    // エディターの購読
    const unsubscribe = editor.subscribe(
      (editorInstance: TipTapEditor | null) => {
        currentEditor = editorInstance;
        // ストアにも設定
        currentEditorStore.set(editorInstance);
      },
    );

    return () => {
      if (editorResources) {
        cleanupEditor({
          unsubscribe: editorResources.unsubscribe,
          handlers: editorResources.handlers,
          gboardCleanup: editorResources.gboardCleanup,
          currentEditor,
          editorContainerEl,
        });
      }
    };
  });

  function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      void performUpload(input.files);
    }
  }

  export async function uploadFiles(files: File[] | FileList): Promise<void> {
    await performUpload(files);
  }

  export async function submitPost() {
    if (!postManager || !currentEditor) return;
    const postContent = postManager.preparePostContent(currentEditor);
    if (containsSecretKey(postContent)) {
      postComponentUIStore.showSecretKeyDialog(postContent);
      return;
    }
    await postManager.performPostSubmission(
      currentEditor,
      imageOxMap,
      imageXMap,
      () =>
        updatePostStatus({
          sending: true,
          success: false,
          error: false,
          message: "",
          completed: false,
        }),
      () => {
        updatePostStatus({
          sending: false,
          success: true,
          error: false,
          message: "postComponent.post_success",
          completed: true,
        });
        clearContentAfterSuccess();
        onPostSuccess?.();
      },
      (error) =>
        updatePostStatus({
          sending: false,
          success: false,
          error: true,
          message: error || "postComponent.post_error",
          completed: false,
        }),
    );
  }

  export function resetPostContent() {
    if (postManager && currentEditor)
      postManager.resetPostContent(currentEditor);
  }

  export function clearContentAfterSuccess() {
    if (postManager && currentEditor)
      postManager.clearContentAfterSuccess(currentEditor);
  }

  // UI状態管理をストアから取得して使用
  async function confirmSendWithSecretKey() {
    const pendingPost = postComponentUIStore.getPendingPost();
    postComponentUIStore.hideSecretKeyDialog();
    if (postManager && currentEditor) {
      const imageBlurhashMap = postManager.prepareImageBlurhashMap(
        currentEditor,
        imageOxMap,
        imageXMap,
      );
      updatePostStatus({
        sending: true,
        success: false,
        error: false,
        message: "",
        completed: false,
      });
      try {
        const result = await postManager.submitPost(
          pendingPost,
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
          clearContentAfterSuccess();
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
      }
    }
  }

  function cancelSendWithSecretKey() {
    postComponentUIStore.hideSecretKeyDialog();
  }

  function closeFullscreen() {
    postComponentUIStore.hideImageFullscreen();
    setTimeout(() => {
      domUtils.querySelector(".tiptap-editor")?.focus();
    }, 150);
  }

  // グローバルコンテキストメニューの位置とアイテムを更新
  $effect(() => {
    if (showGlobalContextMenu && globalContextMenuState.nodeId) {
      const result = prepareGlobalContextMenuItems(
        globalContextMenuState,
        currentEditor,
        lastClickPositionStore.value,
      );

      if (result) {
        globalContextMenuItems = result.items;
        globalContextMenuX = result.x;
        globalContextMenuY = result.y;
      }
    }
  });

  $effect(() => {
    if (
      currentEditor &&
      postManager &&
      postManager.preparePostContent(currentEditor) !== editorState.content &&
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
</script>

<div class="post-container">
  <div
    class="editor-container"
    class:drag-over={dragOver}
    use:fileDropActionWithDragState={{
      dragOver: (v: boolean) => (dragOver = v),
    }}
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
    <!-- ImagePlaceholderは文字プレースホルダーと重複するため削除 -->
  </div>

  <input
    type="file"
    accept="image/*,video/*"
    multiple
    onchange={handleFileSelect}
    bind:this={fileInput}
    style="display: none;"
  />

  {#if uploadErrorMessage}
    <div class="upload-error">{uploadErrorMessage}</div>
  {/if}
</div>

<SecretKeyWarningDialog
  bind:show={showSecretKeyDialog}
  onConfirm={confirmSendWithSecretKey}
  onCancel={cancelSendWithSecretKey}
/>

<ImageFullscreen
  bind:show={showImageFullscreen}
  src={fullscreenImageSrc}
  alt={fullscreenImageAlt}
  onClose={closeFullscreen}
/>

{#if showGlobalContextMenu}
  <ContextMenu
    x={globalContextMenuX}
    y={globalContextMenuY}
    items={globalContextMenuItems}
    onClose={() =>
      globalContextMenuStore.set({
        open: false,
        nodeId: undefined,
        src: undefined,
      })}
    onShowPopup={postComponentUIStore.showPopupMessage}
  />
{/if}

{#if showPopupModal}
  <PopupModal
    show={showPopupModal}
    x={popupX}
    y={popupY}
    onClose={() => postComponentUIStore.hidePopupMessage()}
  >
    <div class="copy-success-message">{popupMessage}</div>
  </PopupModal>
{/if}

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
    touch-action: pan-y;
    overscroll-behavior: contain;
    scroll-behavior: auto;
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
    scroll-behavior: auto;
    will-change: scroll-position;
    transform: translateZ(0);
    -webkit-tap-highlight-color: transparent;
    position: relative;
  }

  /* Tiptap標準のプレースホルダーを完全に無効化 */
  :global(.tiptap-editor .is-empty::before),
  :global(.tiptap-editor p.is-empty::before),
  :global(.tiptap-editor .ProseMirror-placeholder::before) {
    display: none !important;
    content: none !important;
  }

  /* カスタムプレースホルダーの表示 - 最初の段落のみ、かつエディタが完全に空の場合のみ */
  :global(
      .tiptap-editor.is-editor-empty > p.is-editor-empty:first-child::before
    ) {
    content: attr(data-placeholder) !important;
    position: absolute;
    top: 0;
    left: 0;
    color: var(--text-placeholder, #999) !important;
    pointer-events: none;
    font-size: 1.25rem;
    line-height: 1.4;
    opacity: 0.6;
    z-index: 1;
    display: block !important;
  }

  /* フォーカス時のプレースホルダー表示を継続（薄く表示） */
  :global(
      .tiptap-editor.is-editor-empty:focus
        > p.is-editor-empty:first-child::before
    ) {
    opacity: 0.6 !important;
  }

  /* エディタ内の要素スタイル */
  :global(.tiptap-editor .editor-paragraph) {
    margin: 0;
    padding: 0;
    color: var(--text);
    white-space: break-spaces;
    position: relative;
    z-index: 2;
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
      -webkit-tap-highlight-color: transparent;
      will-change: scroll-position;
    }

    /* ドラッグ中の視覚フィードバック強化 */
    :global(.editor-image-button[data-dragging="true"]) {
      z-index: 1;
    }

    :global(.tiptap-editor) {
      -webkit-user-select: text;
      user-select: text;
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
