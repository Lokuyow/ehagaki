<script lang="ts">
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import { EditorContent } from "svelte-tiptap";
  import type { Readable } from "svelte/store";
  import type { Editor as TipTapEditor } from "@tiptap/core";
  import type { Node as PMNode } from "prosemirror-model";
  import { NodeSelection } from "prosemirror-state";
  import type { RxNostr } from "rx-nostr";
  import type {
    UploadInfoCallbacks,
    UploadHelperResult,
    UploadProgress,
  } from "../lib/types";
  import { PostManager } from "../lib/postManager";
  import { uploadHelper } from "../lib/uploadHelper";
  import { getShareHandler } from "../lib/shareHandler";
  import Button from "./Button.svelte";
  import Dialog from "./Dialog.svelte";
  import ContextMenu from "./ContextMenu.svelte";
  import PopupModal from "./PopupModal.svelte";
  import {
    extractImageBlurhashMap,
    getMimeTypeFromUrl,
  } from "../lib/tags/imetaTag";
  import {
    fileDropAction,
    pasteAction,
    touchAction,
    keydownAction,
  } from "../lib/editor/editorDomActions";
  import {
    containsSecretKey,
    calculateContextMenuPosition,
  } from "../lib/utils/appUtils";
  import { extractContentWithImages } from "../lib/utils/editorUtils";
  import { domUtils } from "../lib/utils/appDomUtils";
  import { getImageContextMenuItems } from "../lib/utils/imageContextMenuUtils";
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
        // スマートフォン（タッチデバイス）ではキーボードを立ち上げない
        if (!("ontouchstart" in window || navigator.maxTouchPoints > 0)) {
          currentEditor.view.focus();
        }
        const sel = NodeSelection.create(currentEditor.state.doc, pos);
        currentEditor.view.dispatch(
          currentEditor.state.tr.setSelection(sel).scrollIntoView(),
        );
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
    // 追加: editorContainerEl にもイベントリスナーを追加
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
      // 追加: editorContainerEl のイベントリスナーも削除
      if (editorContainerEl) {
        editorContainerEl.removeEventListener(
          "image-fullscreen-request",
          handleImageFullscreenRequest as EventListener,
        );
        editorContainerEl.removeEventListener(
          "select-image-node",
          handleSelectImageNode as EventListener,
        );
      }
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

  // 共有画像処理の統一
  onMount(async () => {
    // 共有画像の処理
    try {
      const shareHandler = getShareHandler();
      const result = await shareHandler.checkForSharedImageOnLaunch();

      if (result.success && result.data?.image) {
        // 共有画像を自動アップロード
        await uploadFiles([result.data.image]);
      }
    } catch (error) {
      console.error("共有画像の処理に失敗:", error);
    }
  });

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

  // ポップアップ表示用の状態を追加
  let showPopupModal = $state(false);
  let popupX = $state(0);
  let popupY = $state(0);
  let popupMessage = $state("");

  // ポップアップ表示ハンドラー
  function handleShowPopup(x: number, y: number, message: string) {
    popupX = x;
    popupY = y;
    popupMessage = message;
    showPopupModal = true;
    setTimeout(() => {
      showPopupModal = false;
    }, 1800);
  }

  // グローバルコンテキストメニューの位置とアイテムを更新
  $effect(() => {
    if (showGlobalContextMenu && globalContextMenuState.nodeId) {
      // nodeIdから src, getPos, nodeSize, isSelected を復元 -> 変更: ストアから直接取得
      const nodeId = globalContextMenuState.nodeId;
      const src = globalContextMenuState.src || "";  // 変更: ストアからsrcを取得
      // nodeIdは pos の文字列なので数値化
      const pos = Number(nodeId) || 0;
      // altは仮で "Image"（必要ならストアから取得）
      const alt = "Image";
      // nodeSizeは仮で 1（必要ならストアから取得）
      // 変更: メニューを開く時点で正確なノードサイズを取得
      const node = currentEditor?.state?.doc?.nodeAt(pos);
      const nodeSize = node ? node.nodeSize : 1;
      // isSelectedは true（必要ならストアから取得）
      const isSelected = true;

      const items = getImageContextMenuItems(
        src,
        alt,
        () => pos,
        nodeSize,
        isSelected,
        nodeId,  // 追加: nodeIdを渡す
        { editorObj: currentEditor },
      );
      globalContextMenuItems = items;
      // 位置計算を一度だけ実行し、両方の変数にセット
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
      // document.querySelector<HTMLElement>(".tiptap-editor")?.focus();
      domUtils.querySelector(".tiptap-editor")?.focus();
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
    <!-- ImagePlaceholderは文字プレースホルダーと重複するため削除 -->
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

{#if showGlobalContextMenu}
  <ContextMenu
    x={globalContextMenuX}
    y={globalContextMenuY}
    items={globalContextMenuItems}
    onClose={() =>
      globalContextMenuStore.set({ open: false, nodeId: undefined, src: undefined })}
    onShowPopup={handleShowPopup}
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

  /* カスタムプレースホルダーの表示 - より具体的なセレクター */
  :global(.tiptap-editor p.is-editor-empty::before) {
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
  :global(.tiptap-editor:focus p.is-editor-empty::before),
  :global(.tiptap-editor:focus p.editor-paragraph.is-editor-empty::before),
  :global(.tiptap-editor.is-editor-empty:focus::before) {
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
