<script lang="ts">
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import { EditorContent } from "svelte-tiptap";
  import type { Readable } from "svelte/store";
  import type { Editor as TipTapEditor } from "@tiptap/core";
  import type { Node as PMNode } from "prosemirror-model";
  import { NodeSelection } from "prosemirror-state";
  import type { RxNostr } from "rx-nostr";
  import type { UploadProgress } from "../lib/types";
  import { videoCompressionProgressStore } from "../stores/appStore.svelte";
  import { PostManager } from "../lib/postManager";
  import { uploadFiles } from "../lib/uploadHelper";
  import Button from "./Button.svelte";
  import Dialog from "./Dialog.svelte";
  import ContextMenu from "./ContextMenu.svelte";
  import PopupModal from "./PopupModal.svelte";
  import {
    fileDropAction as _fileDropAction,
    pasteAction,
    touchAction,
    keydownAction,
    fileDropActionWithDragState,
    hasMediaInDoc,
  } from "../lib/editor/editorDomActions.svelte";
  import {
    containsSecretKey,
    calculateContextMenuPosition,
  } from "../lib/utils/appUtils";
  import { domUtils } from "../lib/utils/appDomUtils";
  import { getImageContextMenuItems } from "../lib/utils/imageContextMenuUtils";
  import { processPastedText } from "../lib/editor/clipboardExtension";
  import {
    globalContextMenuStore,
    lastClickPositionStore,
  } from "../stores/appStore.svelte";
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
  import ImageFullscreen from "./ImageFullscreen.svelte";

  interface Props {
    rxNostr?: RxNostr;
    hasStoredKey: boolean;
    onPostSuccess?: () => void;
    onUploadStatusChange?: (isUploading: boolean) => void;
    onUploadProgress?: (progress: UploadProgress) => void;
  }

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

  // グローバルコンテキストメニューの状態
  let globalContextMenuState = $derived($globalContextMenuStore);
  let showGlobalContextMenu = $derived(globalContextMenuState.open);
  let globalContextMenuX = $state(0);
  let globalContextMenuY = $state(0);
  import type { MenuItem } from "../lib/types";
  let globalContextMenuItems = $state<MenuItem[]>([]);

  // --- PostManager初期化 ---
  $effect(() => {
    if (rxNostr) {
      if (!postManager) postManager = new PostManager(rxNostr as RxNostr);
      else postManager.setRxNostr(rxNostr as RxNostr);
    }
  });

  // --- Editor初期化・クリーンアップ ---
  onMount(() => {
    const editorResources = initializeEditor();
    return () => cleanupEditor(editorResources);
  });

  // Android Gboard対応: inputイベントでペースト検出
  $effect(() => {
    const cleanup = setupGboardHandler();
    return cleanup;
  });

  function clearEditorContent() {
    currentEditor?.chain().clearContent().run();
  }

  function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      uploadFiles({
        files: input.files,
        currentEditor,
        fileInput,
        onUploadProgress,
        updateUploadState,
        imageOxMap,
        imageXMap,
        videoCompressionProgressStore,
        getUploadFailedText: (key: string) => $_(key),
      });
    }
  }

  export async function submitPost() {
    if (!postManager || !currentEditor) return;
    const postContent = postManager.preparePostContent(currentEditor);
    if (containsSecretKey(postContent)) {
      pendingPost = postContent;
      showSecretKeyDialog = true;
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

  // UI状態管理関連の変数
  let showPopupModal = $state(false);
  let popupX = $state(0);
  let popupY = $state(0);
  let popupMessage = $state("");

  // UI状態管理関連の処理をまとめる
  function handleSecretKeyDialog() {
    async function confirmSendWithSecretKey() {
      showSecretKeyDialog = false;
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
      pendingPost = "";
    }

    function cancelSendWithSecretKey() {
      showSecretKeyDialog = false;
      pendingPost = "";
    }

    return { confirmSendWithSecretKey, cancelSendWithSecretKey };
  }

  function handlePopup() {
    function showPopupMessage(x: number, y: number, message: string) {
      popupX = x;
      popupY = y;
      popupMessage = message;
      showPopupModal = true;
      setTimeout(() => {
        showPopupModal = false;
      }, 1800);
    }

    return { showPopupMessage };
  }

  function handleImageFullscreen() {
    function closeFullscreen() {
      showImageFullscreen = false;
      fullscreenImageSrc = "";
      fullscreenImageAlt = "";
      setTimeout(() => {
        domUtils.querySelector(".tiptap-editor")?.focus();
      }, 150);
    }

    return { closeFullscreen };
  }

  const secretKeyHandlers = handleSecretKeyDialog();
  const popupHandlers = handlePopup();
  const fullscreenHandlers = handleImageFullscreen();

  // グローバルコンテキストメニューの位置とアイテムを更新
  $effect(() => {
    if (showGlobalContextMenu && globalContextMenuState.nodeId) {
      const nodeId = globalContextMenuState.nodeId;
      const src = globalContextMenuState.src || "";
      const pos = Number(nodeId) || 0;
      const alt = "Image";
      const node = currentEditor?.state?.doc?.nodeAt(pos);
      const nodeSize = node ? node.nodeSize : 1;
      const isSelected = true;

      const items = getImageContextMenuItems(
        src,
        alt,
        () => pos,
        nodeSize,
        isSelected,
        nodeId,
        { editorObj: currentEditor },
      );
      globalContextMenuItems = items;

      const lastPos = lastClickPositionStore.value;
      let menuPos = { x: 0, y: 0 };
      if (lastPos) {
        menuPos = calculateContextMenuPosition(lastPos.x, lastPos.y);
      }
      globalContextMenuX = menuPos.x;
      globalContextMenuY = menuPos.y;
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

  // エディター初期化関数
  function initializeEditor() {
    const initialPlaceholder =
      $_("postComponent.enter_your_text") || "テキストを入力してください";
    placeholderTextStore.value = initialPlaceholder;
    editor = createEditorStore(initialPlaceholder) as EditorStore;
    const unsubscribe = editor.subscribe(
      (editorInstance) => (currentEditor = editorInstance),
    );

    const handlers = setupEventListeners();
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

    return { unsubscribe, handlers };
  }

  // エディタークリーンアップ関数
  function cleanupEditor({
    unsubscribe,
    handlers,
  }: {
    unsubscribe: () => void;
    handlers: any;
  }) {
    cleanupEventListeners(handlers);
    unsubscribe();
    currentEditor?.destroy?.();
    if (editorContainerEl) {
      delete (editorContainerEl as any).__uploadFiles;
      delete (editorContainerEl as any).__currentEditor;
      delete (editorContainerEl as any).__hasStoredKey;
      delete (editorContainerEl as any).__postStatus;
      delete (editorContainerEl as any).__submitPost;
    }
  }

  // Android Gboard対応処理
  function setupGboardHandler() {
    if (!editorContainerEl) return;

    let lastContent = currentEditor ? currentEditor.getText() : "";
    let isProcessingPaste = false;

    const handleInput = (event: Event) => {
      if (isProcessingPaste) return;

      if (currentEditor) {
        const currentContent = currentEditor.getText();
        const addedLength = currentContent.length - lastContent.length;

        if (addedLength > 10 && currentContent.length > lastContent.length) {
          const addedText = currentContent.substring(lastContent.length);

          if (addedText.includes("\n")) {
            isProcessingPaste = true;

            currentEditor.chain().focus().clearContent().run();

            setTimeout(() => {
              if (currentEditor) {
                const cleanedText = addedText.replace(/\n\n/g, "\n");
                processPastedText(currentEditor, cleanedText);
              }
              isProcessingPaste = false;

              setTimeout(() => {
                if (currentEditor) {
                  lastContent = currentEditor.getText();
                }
              }, 100);
            }, 10);

            return;
          }
        }

        lastContent = currentContent;
      }
    };

    editorContainerEl.addEventListener("input", handleInput);

    return () => {
      if (editorContainerEl) {
        editorContainerEl.removeEventListener("input", handleInput);
      }
    };
  }

  // イベントリスナーのセットアップとクリーンアップをヘルパー関数に抽出
  function setupEventListeners() {
    const handleContentUpdate = (event: CustomEvent<{ plainText: string }>) => {
      const plainText = event.detail.plainText;
      let hasMedia = currentEditor
        ? hasMediaInDoc(currentEditor.state?.doc as PMNode | undefined)
        : false;
      updateEditorContent(plainText, hasMedia);
    };

    const handleImageFullscreenRequest = (
      event: CustomEvent<{ src: string; alt?: string }>,
    ) => {
      fullscreenImageSrc = event.detail.src;
      fullscreenImageAlt = event.detail.alt || "";
      showImageFullscreen = true;
    };

    const handleSelectImageNode = (e: CustomEvent<{ pos: number }>) => {
      const pos = e?.detail?.pos;
      if (pos == null) return;
      if (!currentEditor || !currentEditor.view) return;
      try {
        if (!("ontouchstart" in window || navigator.maxTouchPoints > 0)) {
          currentEditor.view.focus();
        }
        const sel = NodeSelection.create(currentEditor.state.doc, pos);
        currentEditor.view.dispatch(
          currentEditor.state.tr.setSelection(sel).scrollIntoView(),
        );
      } catch (err) {
        console.warn("select-image-node handler failed:", err);
      }
    };

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

    if (editorContainerEl) {
      editorContainerEl.addEventListener(
        "image-fullscreen-request",
        handleImageFullscreenRequest as EventListener,
      );
      editorContainerEl.addEventListener(
        "select-image-node",
        handleSelectImageNode as EventListener,
      );
    }

    return {
      handleContentUpdate,
      handleImageFullscreenRequest,
      handleSelectImageNode,
    };
  }

  function cleanupEventListeners(handlers: {
    handleContentUpdate: EventListener;
    handleImageFullscreenRequest: EventListener;
    handleSelectImageNode: EventListener;
  }) {
    window.removeEventListener(
      "editor-content-changed",
      handlers.handleContentUpdate,
    );
    window.removeEventListener(
      "image-fullscreen-request",
      handlers.handleImageFullscreenRequest,
    );
    window.removeEventListener(
      "select-image-node",
      handlers.handleSelectImageNode,
    );

    if (editorContainerEl) {
      editorContainerEl.removeEventListener(
        "image-fullscreen-request",
        handlers.handleImageFullscreenRequest,
      );
      editorContainerEl.removeEventListener(
        "select-image-node",
        handlers.handleSelectImageNode,
      );
    }
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

<Dialog
  bind:show={showSecretKeyDialog}
  ariaLabel={$_("postComponent.warning")}
  onClose={secretKeyHandlers.cancelSendWithSecretKey}
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
        onClick={secretKeyHandlers.confirmSendWithSecretKey}
      >
        {$_("postComponent.post")}
      </Button>
      <Button
        className="btn-cancel"
        variant="secondary"
        shape="square"
        onClick={secretKeyHandlers.cancelSendWithSecretKey}
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
  onClose={fullscreenHandlers.closeFullscreen}
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
    onShowPopup={popupHandlers.showPopupMessage}
  />
{/if}

{#if showPopupModal}
  <PopupModal
    show={showPopupModal}
    x={popupX}
    y={popupY}
    onClose={() => (showPopupModal = false)}
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
    /* プレースホルダー用の相対配置 */
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
