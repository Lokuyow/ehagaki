<script lang="ts">
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import { untrack } from "svelte";
  import { EditorContent } from "svelte-tiptap";
  import type { Editor as TipTapEditor } from "@tiptap/core";
  import type { RxNostr } from "rx-nostr";
  import type { UploadProgress } from "../lib/types";
  import {
    videoCompressionProgressStore,
    imageCompressionProgressStore,
    mediaFreePlacementStore,
  } from "../stores/appStore.svelte";
  import { PostManager } from "../lib/postManager";
  import { uploadFiles as uploadFilesHelper } from "../lib/uploadHelper";
  import PopupModal from "./PopupModal.svelte";
  import SecretKeyWarningDialog from "./SecretKeyWarningDialog.svelte";
  import MediaGallery from "./MediaGallery.svelte";
  import { mediaGalleryStore } from "../stores/mediaGalleryStore.svelte";
  import {
    fileDropAction as _fileDropAction,
    pasteAction,
    touchAction,
    keydownAction,
    fileDropActionWithDragState,
  } from "../lib/editor/editorDomActions.svelte";
  import { containsSecretKey } from "../lib/utils/appUtils";
  import { domUtils, isTouchDevice } from "../lib/utils/appDomUtils";
  import { postComponentUIStore } from "../stores/appStore.svelte";
  import {
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
  let mediaFreePlacement = $derived(mediaFreePlacementStore.value);
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

  // --- PostManager初期化 ---
  $effect(() => {
    if (rxNostr) {
      if (!postManager) postManager = new PostManager(rxNostr as RxNostr);
      else postManager.setRxNostr(rxNostr as RxNostr);
    }
  });

  async function performUpload(
    files: File[] | FileList | null | undefined,
  ): Promise<void> {
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

    // 画像フルスクリーン表示イベントのリスナー
    const handleImageFullscreenRequest = (event: Event) => {
      const customEvent = event as CustomEvent<{ src: string; alt: string }>;
      const { src, alt } = customEvent.detail;
      postComponentUIStore.showImageFullscreen(src, alt);
    };
    window.addEventListener(
      "image-fullscreen-request",
      handleImageFullscreenRequest,
    );

    return () => {
      window.removeEventListener(
        "image-fullscreen-request",
        handleImageFullscreenRequest,
      );
      if (editorResources) {
        cleanupEditor({
          unsubscribe: editorResources.unsubscribe,
          handlers: editorResources.handlers,
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

  export function insertTextContent(content: string): void {
    if (!currentEditor || !content) return;

    const editor = currentEditor; // nullチェック済みのローカル変数

    // 改行で分割してパラグラフの配列を作成
    const lines = content.split("\n");

    // Tiptapのパラグラフノードとして構造化
    const paragraphNodes = lines.map((line) => ({
      type: "paragraph",
      content: line ? [{ type: "text", text: line }] : undefined,
    }));

    // アクセス時の処理なので、常に直接挿入（既存内容を置き換え）
    editor.commands.setContent({
      type: "doc",
      content: paragraphNodes,
    });

    // カーソルを末尾に移動
    editor.commands.focus("end");
  }

  export function loadDraftContent(htmlContent: string): void {
    if (!currentEditor || !htmlContent) return;

    // HTMLコンテンツをそのまま設定（下書き保存時のHTML構造を復元）
    currentEditor.commands.setContent(htmlContent);

    // カーソルを末尾に移動
    currentEditor.commands.focus("end");
  }

  export function getEditorHtml(): string {
    if (!currentEditor) return "";
    return currentEditor.getHTML();
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

  export function focusEditor() {
    domUtils.querySelector(".tiptap-editor")?.focus();
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
    // タッチデバイスではキーボードが立ち上がるのを防ぐためフォーカスしない
    if (!isTouchDevice()) {
      setTimeout(() => {
        domUtils.querySelector(".tiptap-editor")?.focus();
      }, 150);
    }
  }

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

  export function openFileDialog() {
    fileInput?.click();
  }

  // --- ギャラリーのメディア変更に応じてcanPostを再評価 ---
  $effect(() => {
    const hasGalleryMedia = mediaGalleryStore.items.some(
      (item) => !item.isPlaceholder,
    );
    const hasContent = !!editorState.content.trim();
    const hasEditorMedia = editorState.hasImage;
    editorState.canPost = hasContent || hasEditorMedia || hasGalleryMedia;
  });

  // --- モード切替時の自動整理 ---
  let isFirstModeRender = true;

  $effect(() => {
    const isGalleryMode = !mediaFreePlacementStore.value;

    if (isFirstModeRender) {
      isFirstModeRender = false;
      return;
    }
    if (!currentEditor) return;

    if (isGalleryMode) {
      // フリーモード → ギャラリーモード: エディタのメディアノードをギャラリーに移動
      const doc = currentEditor.state.doc;
      const mediaNodes: Array<{ node: any; pos: number }> = [];

      doc.descendants((node: any, pos: number) => {
        if (
          (node.type.name === "image" || node.type.name === "video") &&
          !node.attrs.isPlaceholder
        ) {
          mediaNodes.push({ node, pos });
        }
      });

      if (mediaNodes.length > 0) {
        // ギャラリーに追加 (untrack: 書き込みがエフェクトを再トリガーしないように)
        untrack(() => {
          mediaNodes.forEach(({ node }) => {
            const src = node.attrs.src as string;
            if (!src) return;
            mediaGalleryStore.addItem({
              id: src,
              type: node.type.name as "image" | "video",
              src,
              isPlaceholder: false,
              blurhash: node.attrs.blurhash ?? undefined,
              ox: imageOxMap[src] ?? undefined,
              x: imageXMap[src] ?? undefined,
              dim: node.attrs.dim ?? undefined,
              alt: node.attrs.alt ?? undefined,
            });
          });
        });

        // エディタからメディアノードを削除 (後ろから)
        let tr = currentEditor.state.tr;
        [...mediaNodes].reverse().forEach(({ node, pos }) => {
          tr = tr.delete(pos, pos + node.nodeSize);
        });
        currentEditor.view.dispatch(tr);

        untrack(() => {
          imageOxMap = {};
          imageXMap = {};
        });
      }
    } else {
      // ギャラリーモード → フリーモード: ギャラリーのメディアをエディタに移動
      // untrack: getItems()の読み取りとclearAll()の書き込みがループを起こさないように
      const items = untrack(() => mediaGalleryStore.getItems());
      if (items.length > 0) {
        const { schema } = currentEditor.state;
        let transaction = currentEditor.state.tr;
        let insertPos = currentEditor.state.doc.content.size;
        const newOxMap: Record<string, string> = {};
        const newXMap: Record<string, string> = {};

        items.forEach((item) => {
          if (item.isPlaceholder) return;
          const src = item.src;
          if (item.type === "image" && schema.nodes.image) {
            const imageNode = schema.nodes.image.create({
              src,
              alt: item.alt ?? "Image",
              blurhash: item.blurhash ?? null,
              dim: item.dim ?? null,
            });
            transaction = transaction.insert(insertPos, imageNode);
            insertPos += imageNode.nodeSize;
          } else if (item.type === "video" && schema.nodes.video) {
            const videoNode = schema.nodes.video.create({ src });
            transaction = transaction.insert(insertPos, videoNode);
            insertPos += videoNode.nodeSize;
          }
          if (item.ox) newOxMap[src] = item.ox;
          if (item.x) newXMap[src] = item.x;
        });

        currentEditor.view.dispatch(transaction);
        untrack(() => {
          imageOxMap = newOxMap;
          imageXMap = newXMap;
        });
      }
      untrack(() => mediaGalleryStore.clearAll());
    }
  });
</script>

<div class="post-container">
  <div
    class="editor-container"
    class:drag-over={dragOver}
    class:gallery-mode={!mediaFreePlacement}
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
  </div>

  {#if !mediaFreePlacement}
    <MediaGallery />
  {/if}

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
    /* キーボード表示時に高さを動的に調整 */
    /* --keyboard-height: キーボードの高さ（閉じている時は0px） */
    /* --reason-input-height: Content Warning理由入力欄の高さ（非表示時は0px） */
    max-height: calc(
      100% - var(--keyboard-height, 0px) - var(--reason-input-height, 0px) - 8px
    );
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    transition: max-height 0.25s ease-out;
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
    -webkit-tap-highlight-color: transparent;
  }

  .editor-container.drag-over {
    border: 3px dashed var(--theme);
  }

  /* ギャラリーモード時はドロップカーソル（差し込み位置バー）を常に非表示 */
  .editor-container.gallery-mode :global(.tiptap-dropcursor) {
    display: none !important;
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
    padding: 16px 10px 0 10px;
    font-family: inherit;
    font-size: 1.375rem;
    line-height: 1.5;
    outline: none;
    overflow-y: auto;
    overflow-x: hidden;
    scroll-behavior: auto;
    will-change: scroll-position;
    transform: translateZ(0);
    -webkit-tap-highlight-color: transparent;

    :global(.editor-paragraph) {
      margin: 0;
      padding: 0;
      color: var(--text);
      white-space: break-spaces;
      position: relative;
      z-index: 2;
    }

    :global(.hashtag) {
      color: var(--hashtag-text);
      font-weight: 600;
      background: var(--hashtag-bg);
      padding: 2px 4px;
      border-radius: 4px;
      word-break: break-all;
    }

    :global(.preview-link) {
      color: var(--link);
      word-break: break-all;
    }

    :global(.preview-link:visited) {
      color: var(--link-visited);
    }

    :global(p.is-editor-empty:first-child::before) {
      color: var(--text);
      content: attr(data-placeholder);
      float: left;
      height: 0;
      pointer-events: none;
      opacity: 0.6;
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
