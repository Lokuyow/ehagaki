<script lang="ts">
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import { untrack } from "svelte";
  import { EditorContent } from "svelte-tiptap";
  import type { Editor as TipTapEditor } from "@tiptap/core";
  import { Selection } from "@tiptap/pm/state";
  import type { RxNostr } from "rx-nostr";
  import type { FullscreenMediaItem } from "../lib/types";
  import type { MediaGalleryItem } from "../lib/types";
  import { mediaFreePlacementStore } from "../stores/uploadStore.svelte";
  import { PostManager } from "../lib/postManager";
  import { nip46Service } from "../lib/nip46Service";
  import { parentClientAuthService } from "../lib/parentClientAuthService";
  import { sanitizeDraftHtml } from "../lib/draftHtmlSanitizer";
  import {
    createPostUploadHandlers,
    updateEditorUploadState,
  } from "../lib/postUploadUtils";
  import PopupModal from "./PopupModal.svelte";
  import ConfirmDialog from "./ConfirmDialog.svelte";
  import MediaGallery from "./MediaGallery.svelte";
  import { mediaGalleryStore } from "../stores/mediaGalleryStore.svelte";
  import {
    fileDropAction as _fileDropAction,
    pasteAction,
    touchAction,
    keydownAction,
    fileDropActionWithDragState,
  } from "../lib/editor/editorDomActions.svelte";
  import { generateMediaItemId } from "../lib/utils/appUtils";
  import type { CustomEmojiAttrs } from "../lib/editor";
  import { containsSecretKey } from "../lib/utils/nostrUtils";
  import {
    collectFullscreenMediaItems,
    createPostStatusHandlers,
    findFullscreenMediaIndex,
    getFullscreenMediaItemAt,
    moveEditorMediaToGallery,
    moveGalleryMediaToEditor,
    submitPendingPostWithSecretKey,
  } from "../lib/postComponentUtils";

  import { postComponentUIStore } from "../stores/postUIStore.svelte";
  import {
    replyQuoteState,
    clearReplyQuote,
  } from "../stores/replyQuoteStore.svelte";
  import { channelContextState } from "../stores/channelContextStore.svelte";
  import { ReplyQuoteService } from "../lib/replyQuoteService";
  import {
    editorState,
    updateEditorContent,
    updatePostStatus,
    currentEditorStore,
    updatePlaceholderText,
  } from "../stores/editorStore.svelte";
  import {
    initializeEditor,
    cleanupEditor,
  } from "../lib/editor/editorLifecycle";
  import { insertCustomEmojiWithoutUnwantedKeyboard } from "../lib/editor/customEmojiInsertion";
  import { focusEditorWithoutKeyboardForCurrentTap } from "../lib/utils/keyboardFocusUtils";
  import { isEditorElement } from "../lib/utils/appDomUtils";
  import { POST_EDITOR_MIN_HEIGHT } from "../lib/postLayoutUtils";
  import {
    measureElementOuterHeight,
    resolvePostEditorTargetHeight,
  } from "../lib/utils/composerLayoutUtils";
  import ImageFullscreen from "./ImageFullscreen.svelte";
  import type { InitializeEditorResult, MenuItem } from "../lib/types";

  interface Props {
    rxNostr?: RxNostr;
    hasStoredKey: boolean;
    onPostSuccess?: () => void;
    availableComposerHeight?: number;
  }

  let {
    rxNostr,
    hasStoredKey,
    onPostSuccess,
    availableComposerHeight = POST_EDITOR_MIN_HEIGHT,
  }: Props = $props();
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
  let postContainerEl: HTMLDivElement | null = null;
  let editorContainerEl: HTMLElement | null = null;
  let editorResources: InitializeEditorResult | null = null;
  let editorTargetHeight = $state(POST_EDITOR_MIN_HEIGHT);
  let postContainerStyle = $derived(
    `--post-editor-min-height: ${POST_EDITOR_MIN_HEIGHT}px; --post-editor-target-height: ${editorTargetHeight}px;`,
  );
  let editorPlaceholderText = $derived(
    $_("postComponent.enter_your_text") || "テキストを入力してください",
  );

  $effect(() => {
    currentEditor;
    updatePlaceholderText(editorPlaceholderText);
  });

  function syncEditorTargetHeight() {
    const minHeight = POST_EDITOR_MIN_HEIGHT;

    if (!postContainerEl || !editorContainerEl) {
      editorTargetHeight = minHeight;
      return;
    }

    const nonEditorHeight = Array.from(postContainerEl.children).reduce(
      (totalHeight, child) =>
        child === editorContainerEl
          ? totalHeight
          : totalHeight + measureElementOuterHeight(child),
      0,
    );
    const nextTargetHeight = resolvePostEditorTargetHeight({
      availableComposerHeight,
      nonEditorHeight,
      minHeight,
    });

    if (editorTargetHeight !== nextTargetHeight) {
      editorTargetHeight = nextTargetHeight;
    }
  }

  function handleEditorContainerClick(event: MouseEvent) {
    if (!(event.target instanceof HTMLElement) || !currentEditor) {
      return;
    }

    if (isEditorElement(event.target)) {
      return;
    }

    currentEditor.commands.focus("end");
  }

  function handleEditorContainerKeydown(event: KeyboardEvent) {
    if (
      !currentEditor ||
      event.currentTarget !== event.target ||
      (event.key !== "Enter" && event.key !== " ")
    ) {
      return;
    }

    event.preventDefault();
    currentEditor.commands.focus("end");
  }

  // UI状態をストアから取得
  let postComponentUI = $derived(postComponentUIStore.value);
  let showSecretKeyDialog = $derived(postComponentUI.showSecretKeyDialog);
  let showImageFullscreen = $derived(postComponentUI.showImageFullscreen);
  let fullscreenMediaId = $derived(postComponentUI.fullscreenMediaId);
  let fullscreenImageSrc = $derived(postComponentUI.fullscreenImageSrc);
  let fullscreenImageAlt = $derived(postComponentUI.fullscreenImageAlt);
  let showPopupModal = $derived(postComponentUI.showPopupModal);
  let popupX = $derived(postComponentUI.popupX);
  let popupY = $derived(postComponentUI.popupY);
  let popupMessage = $derived(postComponentUI.popupMessage);

  // --- PostManager初期化 ---
  $effect(() => {
    if (rxNostr) {
      if (!postManager)
        postManager = new PostManager(rxNostr as RxNostr, {
          getNip46SignerFn: () => nip46Service.getSigner(),
          getParentClientSignerFn: () => parentClientAuthService.getSigner(),
          channelContextState,
          replyQuoteState,
          replyQuoteService: new ReplyQuoteService(),
          clearReplyQuoteFn: clearReplyQuote,
        });
      else postManager.setRxNostr(rxNostr as RxNostr);
    }
  });

  const uploadHandlers = createPostUploadHandlers({
    getCurrentEditor: () => currentEditor,
    getFileInput: () => fileInput,
    getImageOxMap: () => imageOxMap,
    getImageXMap: () => imageXMap,
    getUploadFailedText: (key: string) => $_(key),
    updateUploadState: (isUploading: boolean, message?: string) => {
      updateEditorUploadState(editorState, isUploading, message);
    },
  });
  const postStatusHandlers = createPostStatusHandlers({
    updatePostStatus,
    clearContentAfterSuccess,
    onPostSuccess: () => onPostSuccess?.(),
  });

  $effect(() => {
    availableComposerHeight;
    mediaFreePlacement;
    uploadErrorMessage;
    currentEditor;

    if (typeof window === "undefined") {
      editorTargetHeight = POST_EDITOR_MIN_HEIGHT;
      return;
    }

    const rafId = window.requestAnimationFrame(() => {
      syncEditorTargetHeight();
    });

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  });

  $effect(() => {
    availableComposerHeight;
    currentEditor;
    mediaFreePlacement;
    uploadErrorMessage;

    if (!postContainerEl || typeof ResizeObserver === "undefined") {
      return;
    }

    syncEditorTargetHeight();

    const resizeObserver = new ResizeObserver(() => {
      syncEditorTargetHeight();
    });

    resizeObserver.observe(postContainerEl);

    for (const child of Array.from(postContainerEl.children)) {
      if (child !== editorContainerEl) {
        resizeObserver.observe(child);
      }
    }

    return () => {
      resizeObserver.disconnect();
    };
  });

  // --- Editor初期化・クリーンアップ ---
  onMount(() => {
    editorResources = initializeEditor({
      placeholderText: editorPlaceholderText,
      editorContainerEl,
      currentEditor,
      hasStoredKey,
      submitPost,
      uploadFiles: (files: File[] | FileList) => {
        void uploadHandlers.performUpload(files);
      },
      eventCallbacks: {
        onContentUpdate: updateEditorContent,
        onImageFullscreenRequest: (
          src: string,
          alt: string,
          mediaId?: string,
        ) => {
          postComponentUIStore.showImageFullscreen(src, alt, mediaId || "");
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
      const customEvent = event as CustomEvent<{
        src: string;
        alt: string;
        mediaId?: string;
      }>;
      const { src, alt, mediaId } = customEvent.detail;
      postComponentUIStore.showImageFullscreen(src, alt, mediaId || "");
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

  const handleFileSelect = uploadHandlers.handleFileSelect;

  export async function uploadFiles(files: File[] | FileList): Promise<void> {
    await uploadHandlers.performUpload(files);
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

    const sanitizedHtmlContent = sanitizeDraftHtml(htmlContent);

    // HTMLコンテンツをそのまま設定（下書き保存時のHTML構造を復元）
    currentEditor.commands.setContent(sanitizedHtmlContent || "<p></p>");

    // カーソルを末尾に移動
    currentEditor.commands.focus("end");
  }

  export function getEditorHtml(): string {
    if (!currentEditor) return "";
    return currentEditor.getHTML();
  }

  export function appendMediaToEditor(items: MediaGalleryItem[]): void {
    if (!currentEditor || items.length === 0) return;
    const { schema } = currentEditor.state;
    let transaction = currentEditor.state.tr;
    let insertPos = currentEditor.state.doc.content.size;

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
        if (item.ox) imageOxMap = { ...imageOxMap, [src]: item.ox };
        if (item.x) imageXMap = { ...imageXMap, [src]: item.x };
      } else if (item.type === "video" && schema.nodes.video) {
        const videoNode = schema.nodes.video.create({ src });
        transaction = transaction.insert(insertPos, videoNode);
        insertPos += videoNode.nodeSize;
      }
    });

    currentEditor.view.dispatch(transaction);
    currentEditor.commands.focus("end");
  }

  export function insertCustomEmoji(emoji: CustomEmojiAttrs): void {
    if (!currentEditor) return;
    insertCustomEmojiWithoutUnwantedKeyboard(currentEditor, emoji);
  }

  function revealToolbarCaret(): void {
    if (!currentEditor) return;
    focusEditorWithoutKeyboardForCurrentTap(currentEditor.view.dom);
  }

  function moveCaret(direction: -1 | 1): void {
    if (!currentEditor) return;

    revealToolbarCaret();
    const { state, view } = currentEditor;
    const currentPos = direction < 0 ? state.selection.from : state.selection.to;
    const nextPos = Math.max(
      0,
      Math.min(state.doc.content.size, currentPos + direction),
    );

    if (nextPos === currentPos) return;

    const selection = Selection.near(state.doc.resolve(nextPos), direction);
    view.dispatch(
      state.tr
        .setSelection(selection)
        .scrollIntoView()
        .setMeta("addToHistory", false),
    );
  }

  export function moveCaretLeft(): void {
    moveCaret(-1);
  }

  export function moveCaretRight(): void {
    moveCaret(1);
  }

  export function deleteBackward(): void {
    if (!currentEditor) return;

    revealToolbarCaret();
    const { state, view } = currentEditor;
    const { selection } = state;

    if (!selection.empty) {
      currentEditor.commands.deleteSelection();
      return;
    }

    const resolvedFrom = selection.$from;
    const nodeBefore = resolvedFrom.nodeBefore;

    if (nodeBefore) {
      const deleteSize = nodeBefore.isText
        ? Array.from(nodeBefore.text ?? "").at(-1)?.length ?? 0
        : nodeBefore.nodeSize;

      if (deleteSize > 0) {
        view.dispatch(
          state.tr
            .delete(selection.from - deleteSize, selection.from)
            .scrollIntoView(),
        );
      }
      return;
    }

    currentEditor.commands.first(({ commands }) => [
      () => commands.joinBackward(),
      () => commands.selectNodeBackward(),
    ]);
  }

  export function insertLineBreak(): void {
    if (!currentEditor) return;
    revealToolbarCaret();
    currentEditor.commands.keyboardShortcut("Enter");
  }

  export async function submitPost() {
    if (!postManager || !currentEditor) return;
    const postPayload = postManager.preparePostPayload(currentEditor);
    if (containsSecretKey(postPayload.content)) {
      postComponentUIStore.showSecretKeyDialog(
        postPayload.content,
        postPayload.emojiTags,
      );
      return;
    }
    await postManager.performPostSubmission(
      currentEditor,
      imageOxMap,
      imageXMap,
      postStatusHandlers.markSending,
      postStatusHandlers.markSuccess,
      postStatusHandlers.markFailure,
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
    const pendingEmojiTags = postComponentUIStore.getPendingEmojiTags();
    postComponentUIStore.hideSecretKeyDialog();
    if (postManager && currentEditor) {
      await submitPendingPostWithSecretKey({
        postManager,
        currentEditor,
        imageOxMap,
        imageXMap,
        pendingPost,
        pendingEmojiTags,
        onStart: postStatusHandlers.markSending,
        onSuccess: postStatusHandlers.markSuccess,
        onFailure: postStatusHandlers.markFailure,
      });
    }
  }

  const cancelSendWithSecretKey = postComponentUIStore.hideSecretKeyDialog;
  const closeFullscreen = postComponentUIStore.hideImageFullscreen;

  // --- フルスクリーンメディアリスト ---
  let fullscreenMediaList = $derived.by<FullscreenMediaItem[]>(() => {
    return collectFullscreenMediaItems({
      mediaFreePlacement,
      galleryItems: mediaGalleryStore.items,
      currentEditor,
    });
  });

  let fullscreenMediaIndex = $derived(
    findFullscreenMediaIndex(
      fullscreenMediaList,
      fullscreenMediaId,
      fullscreenImageSrc,
    ),
  );

  function handleFullscreenNavigate(index: number): void {
    const item = getFullscreenMediaItemAt(fullscreenMediaList, index);
    if (!item) return;
    postComponentUIStore.showImageFullscreen(
      item.src,
      item.alt ?? "",
      item.id ?? "",
    );
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
    const editorInstance = currentEditor;

    if (isGalleryMode) {
      const moved = untrack(() =>
        moveEditorMediaToGallery({
          currentEditor: editorInstance,
          imageOxMap,
          imageXMap,
          addGalleryItem: (item: MediaGalleryItem) =>
            mediaGalleryStore.addItem(item),
          createMediaItemId: generateMediaItemId,
        }),
      );

      if (moved) {
        untrack(() => {
          imageOxMap = {};
          imageXMap = {};
        });
      }
    } else {
      const items = untrack(() => mediaGalleryStore.getItems());
      const transferResult = moveGalleryMediaToEditor({
        currentEditor: editorInstance,
        items,
      });

      if (transferResult.hadItems) {
        untrack(() => {
          imageOxMap = transferResult.imageOxMap;
          imageXMap = transferResult.imageXMap;
        });
      }

      untrack(() => mediaGalleryStore.clearAll());
    }
  });
</script>

<div
  class="post-container"
  style={postContainerStyle}
  bind:this={postContainerEl}
>
  <div
    class="editor-container"
    class:drag-over={dragOver}
    class:gallery-mode={!mediaFreePlacement}
    onclick={handleEditorContainerClick}
    onkeydown={handleEditorContainerKeydown}
    use:fileDropActionWithDragState={{
      dragOver: (v: boolean) => (dragOver = v),
    }}
    use:pasteAction
    use:touchAction
    use:keydownAction
    aria-label="テキスト入力エリア"
    role="textbox"
    tabindex="-1"
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

<ConfirmDialog
  open={showSecretKeyDialog}
  title={$_("postComponent.warning")}
  description={$_("postComponent.secret_key_detected")}
  confirmLabel={$_("postComponent.post")}
  cancelLabel={$_("postComponent.cancel")}
  confirmVariant="danger"
  onConfirm={confirmSendWithSecretKey}
  onCancel={cancelSendWithSecretKey}
  contentClass="secretkey-warning-dialog"
/>

<ImageFullscreen
  bind:show={showImageFullscreen}
  src={fullscreenImageSrc}
  alt={fullscreenImageAlt}
  onClose={closeFullscreen}
  mediaList={fullscreenMediaList}
  currentIndex={fullscreenMediaIndex}
  onNavigate={handleFullscreenNavigate}
/>

{#if showPopupModal}
  <PopupModal
    show={showPopupModal}
    x={popupX}
    y={popupY}
    onClose={postComponentUIStore.hidePopupMessage}
  >
    <div class="copy-success-message">{popupMessage}</div>
  </PopupModal>
{/if}

<style>
  .post-container {
    max-width: 800px;
    width: 100%;
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    overflow: visible;
    transition: flex-basis 0.25s ease-out;
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
    flex: 1 1 auto;
    min-height: var(--post-editor-min-height, 92px);
    height: var(--post-editor-target-height, auto);
    max-height: var(--post-editor-target-height, auto);
    position: relative;
    display: flex;
    flex-direction: column;
    cursor: text;
    outline: none;
    background: var(--bg-input);
    -webkit-tap-highlight-color: transparent;
    overflow: hidden;
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
    min-height: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
  }

  /* Tiptapエディターのスタイル */
  :global(.tiptap-editor) {
    display: block;
    width: 100%;
    min-height: 0;
    height: 100%;
    flex: 1 1 auto;
    padding: 10px;
    font-family: inherit;
    font-size: 1.25rem;
    line-height: 1.5;
    outline: none;
    overflow-y: auto;
    overflow-x: hidden;
    scroll-padding-bottom: 16px;
    scroll-behavior: auto;
    will-change: scroll-position;
    transform: translateZ(0);
    -webkit-tap-highlight-color: transparent;

    :global(.editor-paragraph) {
      margin: 0;
      padding: 0;
      color: var(--text);
      position: relative;
      z-index: 2;
      word-break: normal;
      overflow-wrap: anywhere;
      line-break: loose;
      white-space: break-spaces;
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
  :global(:root.light .tiptap-editor .ProseMirror-gapcursor):after,
  :global(:root.light .tiptap-editor .ProseMirror-gapcursor):before {
    border-top-color: black;
  }

  :global(:root.dark .tiptap-editor .ProseMirror-gapcursor):after,
  :global(:root.dark .tiptap-editor .ProseMirror-gapcursor):before {
    border-top-color: white;
  }
</style>
