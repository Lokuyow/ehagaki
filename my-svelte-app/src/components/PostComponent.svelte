<script lang="ts">
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import { EditorContent } from "svelte-tiptap";
  import { PostManager } from "../lib/postManager";
  import type { UploadInfoCallbacks } from "../lib/types";
  import type { Props } from "../lib/types"; // 追加: Props型をtypes.tsからimport
  import { containsSecretKey } from "../lib/utils";
  import { uploadHelper } from "../lib/uploadHelper"; // 追加
  import type { Readable } from "svelte/store";
  import type { Editor as TipTapEditor } from "@tiptap/core";
  import type { Node as PMNode } from "prosemirror-model";
  import type { RxNostr } from "rx-nostr";
  import type { UploadHelperResult } from "../lib/types";

  // editorStore からの import を一箇所に統合（重複削除）
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
  } from "../lib/editor/stores/editorStore.svelte";

  import { extractContentWithImages } from "../lib/editor/editorUtils";
  import { extractImageBlurhashMap, getMimeTypeFromUrl } from "../lib/imeta";
  import Button from "./Button.svelte";
  import Dialog from "./Dialog.svelte";
  import ImageFullscreen from "./ImageFullscreen.svelte";
  // actionsをインポート
  import {
    fileDropAction,
    pasteAction,
    touchAction,
    keydownAction,
  } from "../lib/editor/editorDomActions";

  let { rxNostr, hasStoredKey, onPostSuccess, onUploadProgress }: Props =
    $props();

  // EditorStore は createEditorStore が返すストア（subscribe を持ち、updatePlaceholder 等のメソッドを持つ可能性がある）
  type EditorStore = Readable<TipTapEditor | null> & {
    updatePlaceholder?: (s: string) => void;
    // 他に必要なメソッドがあれば追加可能
  };

  // ストアと実エディターを分けて保持
  let editor: EditorStore | null = $state(null); // createEditorStore の戻り値（ストア）
  let currentEditor: TipTapEditor | null = $state(null); // 実際の Editor インスタンス
  let dragOver = $state(false);
  let fileInput: HTMLInputElement | undefined = $state();

  let postManager: PostManager | undefined = $state();
  let showSecretKeyDialog = $state(false);
  let pendingPost = "";

  // 全画面表示用の状態
  let showImageFullscreen = $state(false);
  let fullscreenImageSrc = $state("");
  let fullscreenImageAlt = $state("");

  // 画像URLとox、xのマッピングを保持
  let imageOxMap: Record<string, string> = $state({});
  let imageXMap: Record<string, string> = $state({}); // アップロード後画像のSHA-256ハッシュ

  // ストアから状態を取得
  let postStatus = $derived(editorState.postStatus);
  let uploadErrorMessage = $derived(editorState.uploadErrorMessage);

  // --- PostManager初期化 ---
  $effect(() => {
    if (rxNostr) {
      if (!postManager) {
        // rxNostr は Props で RxNostr 型になったためそのまま渡す
        postManager = new PostManager(rxNostr as RxNostr);
      } else {
        postManager.setRxNostr(rxNostr as RxNostr);
      }
    }
  });

  // --- Editor初期化・クリーンアップ ---
  // 画像ノードが含まれているか判定する共通関数
  function hasImageInDoc(doc: PMNode | undefined | null): boolean {
    let found = false;
    if (doc) {
      // ProseMirror の Node を想定して型を使う
      doc.descendants((node: PMNode) => {
        if ((node as any).type?.name === "image") found = true;
      });
    }
    return found;
  }

  // editor-containerノード参照
  let editorContainerEl: HTMLElement | null = null;

  onMount(() => {
    const initialPlaceholder =
      $_("postComponent.enter_your_text") || "テキストを入力してください";
    // createEditorStore の戻り値を EditorStore として扱う
    editor = createEditorStore(initialPlaceholder) as EditorStore;

    // ストアから Editor インスタンスを購読して currentEditor に格納
    const unsubscribe = editor.subscribe(
      (editorInstance: TipTapEditor | null) => {
        currentEditor = editorInstance;
      },
    );

    const handleContentUpdate = (event: CustomEvent<{ plainText: string }>) => {
      const plainText = event.detail.plainText;
      let hasImage = false;
      if (currentEditor) {
        hasImage = hasImageInDoc(
          currentEditor.state?.doc as PMNode | undefined,
        );
      }
      updateEditorContent(plainText, hasImage);
    };

    const handleImageFullscreenRequest = (
      event: CustomEvent<{ src: string; alt?: string }>,
    ) => {
      fullscreenImageSrc = event.detail.src;
      fullscreenImageAlt = event.detail.alt || "";
      showImageFullscreen = true;
    };

    window.addEventListener(
      "editor-content-changed",
      handleContentUpdate as EventListener,
    );
    window.addEventListener(
      "image-fullscreen-request",
      handleImageFullscreenRequest as EventListener,
    );

    setPostSubmitter(submitPost);

    // editor-containerノードにuploadFiles等をセット
    if (editorContainerEl) {
      (editorContainerEl as any).__uploadFiles = uploadFiles;
      (editorContainerEl as any).__currentEditor = () => currentEditor;
      (editorContainerEl as any).__hasStoredKey = () => hasStoredKey;
      (editorContainerEl as any).__postStatus = () => postStatus;
      (editorContainerEl as any).__submitPost = submitPost;
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
      try {
        unsubscribe();
        if (currentEditor && typeof currentEditor.destroy === "function") {
          currentEditor.destroy();
        }
      } catch (e) {
        console.warn("Editor cleanup failed:", e);
      }

      if (editorContainerEl) {
        delete (editorContainerEl as any).__uploadFiles;
        delete (editorContainerEl as any).__currentEditor;
        delete (editorContainerEl as any).__hasStoredKey;
        delete (editorContainerEl as any).__postStatus;
        delete (editorContainerEl as any).__submitPost;
      }
    };
  });

  // --- 投稿成功時のエディタクリア ---
  function clearEditorContent() {
    if (currentEditor) {
      currentEditor.chain().clearContent().run();
    }
  }

  // --- ファイル選択時の処理 ---
  function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      uploadFiles(input.files);
    }
  }

  // --- ファイルアップロード関連 ---
  // onUploadProgress が未定義の場合は callbacks 自体を undefined にする
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

  // uploadHelper 呼び出し時は currentEditor をそのまま渡す（戻り型は UploadHelperResult）
  export async function uploadFiles(files: File[] | FileList) {
    const devMode = import.meta.env.MODE === "development";
    if (!files || files.length === 0) return;
    const result: UploadHelperResult = await uploadHelper({
      files,
      currentEditor: currentEditor as TipTapEditor | null,
      fileInput,
      uploadCallbacks,
      showUploadError,
      updateUploadState,
      devMode,
    });

    const {
      imageOxMap: newImageOxMap,
      imageXMap: newImageXMap,
      failedResults,
      errorMessage,
    } = result;

    // 結果を state に反映
    Object.assign(imageOxMap, newImageOxMap);
    Object.assign(imageXMap, newImageXMap);

    if (failedResults?.length) {
      showUploadError(
        errorMessage ||
          (failedResults.length === 1
            ? failedResults[0].error || $_("postComponent.upload_failed")
            : `${failedResults.length}個のファイルのアップロードに失敗しました`),
        5000,
      );
    }

    if (fileInput) fileInput.value = "";
  }

  // --- 投稿処理 ---
  export async function submitPost() {
    if (!postManager) return console.error("PostManager is not initialized");
    const postContent =
      extractContentWithImages(currentEditor as TipTapEditor | null) || "";
    if (containsSecretKey(postContent)) {
      pendingPost = postContent;
      showSecretKeyDialog = true;
      return;
    }
    await executePost(postContent);
  }

  // executePost 内で ProseMirror doc 取得時の型注釈
  async function executePost(content?: string) {
    if (!postManager) return console.error("PostManager is not initialized");
    const postContent =
      content ||
      extractContentWithImages(currentEditor as TipTapEditor | null) ||
      "";

    const rawImageBlurhashMap = extractImageBlurhashMap(
      currentEditor as TipTapEditor | null,
    );
    const imageBlurhashMap: Record<
      string,
      {
        [key: string]: any;
        m: string;
        blurhash?: string;
        dim?: string;
        alt?: string;
        ox?: string;
        x?: string;
      }
    > = {};
    for (const [url, blurhash] of Object.entries(rawImageBlurhashMap)) {
      const m = getMimeTypeFromUrl(url);
      const ox = imageOxMap[url];
      const x = imageXMap[url];
      imageBlurhashMap[url] = { m, blurhash, ox, x };
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

  // 投稿成功後のコンテンツクリア（遅延実行）
  export function clearContentAfterSuccess() {
    clearEditorContent();
    resetPostStatus();
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

  // --- リアクティブ: エディタ・プレースホルダー・エラー ---
  $effect(() => {
    if (
      currentEditor &&
      extractContentWithImages(currentEditor) !== editorState.content
    ) {
      if (postStatus.error) {
        updatePostStatus({ ...postStatus, error: false, message: "" });
      }
    }
  });
  // placeholder 更新処理: editor がストアで updatePlaceholder がある場合に呼ぶ
  $effect(() => {
    if (placeholderTextStore.value && editor) {
      setTimeout(() => {
        if (editor && editor.updatePlaceholder) {
          editor.updatePlaceholder(placeholderTextStore.value);
        }
      }, 0);
    }
  });

  // 外部からアクセスできるプロパティを公開
  export function openFileDialog() {
    fileInput?.click();
  }

  function handleImageFullscreenClose() {
    showImageFullscreen = false;
    fullscreenImageSrc = "";
    fullscreenImageAlt = "";

    // 全画面表示を閉じた後、エディターにフォーカスを戻す
    setTimeout(() => {
      const editorElement = document.querySelector(
        ".tiptap-editor",
      ) as HTMLElement;
      if (editorElement) {
        editorElement.focus();
      }
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
    /* タッチスクロール最適化 */
    -webkit-overflow-scrolling: touch;
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
    -webkit-overflow-scrolling: touch;
    /* GPU加速を有効化 */
    will-change: scroll-position;
    transform: translateZ(0);
    /* タッチデバイスでのフォーカス処理改善 */
    -webkit-tap-highlight-color: transparent;
  }

  /* プレースホルダースタイル */
  :global(.tiptap-editor .is-editor-empty:first-child::before) {
    content: attr(data-placeholder);
    color: var(--text);
    pointer-events: none;
    height: 0;
    float: left;
    font-size: 1.25rem;
    opacity: 0.4;
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
      perspective: 1000;
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
