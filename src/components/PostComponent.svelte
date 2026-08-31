<script lang="ts">
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import { untrack } from "svelte";
  import { EditorContent } from "svelte-tiptap";
  import type { Editor as TipTapEditor } from "@tiptap/core";
  import { Selection } from "@tiptap/pm/state";
  import type { RxNostr } from "rx-nostr";
  import type {
    FullscreenMediaItem,
    PostResult,
    UploadHelperResult,
  } from "../lib/types";
  import type { MediaGalleryItem } from "../lib/types";
  import { mediaFreePlacementStore } from "../stores/uploadStore.svelte";
  import { PostManager } from "../lib/postManager";
  import { nip46Service } from "../lib/nip46Service";
  import { parentClientAuthService } from "../lib/parentClientAuthService";
  import { sanitizeDraftHtml } from "../lib/draftHtmlSanitizer";
  import {
    createPostUploadHandlers,
    type UploadFilesExecutor,
    updateEditorUploadState,
  } from "../lib/postUploadUtils";
  import FloatingMessage from "./FloatingMessage.svelte";
  import ConfirmDialog from "./ConfirmDialog.svelte";
  import MediaGallery from "./MediaGallery.svelte";
  import { mediaGalleryStore } from "../stores/mediaGalleryStore.svelte";
  import {
    fileDropAction as _fileDropAction,
    pasteAction,
    touchAction,
    keydownAction,
    fileDropActionWithDragState,
    hasMediaInDoc,
  } from "../lib/editor/editorDomActions.svelte";
  import { generateMediaItemId } from "../lib/utils/appUtils";
  import type { CustomEmojiAttrs } from "../lib/editor";
  import type { CustomEmojiSelection } from "../lib/customEmojiUsage";
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
  import { effectiveChannelContextState } from "../stores/channelContextStore.svelte";
  import { ReplyQuoteService } from "../lib/replyQuoteService";
  import { savePostedEventWithMediaCacheLink } from "../lib/postHistoryMediaPersistence";
  import { postHistoryRepository } from "../lib/storage/postHistoryRepository";
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
  import { showToolbarCaret } from "../lib/editor/toolbarCaretExtension";
  import { insertCustomEmojiWithoutUnwantedKeyboard } from "../lib/editor/customEmojiInsertion";
  import { focusEditorWithoutKeyboardForCurrentTap } from "../lib/utils/keyboardFocusUtils";
  import { isEditorElement } from "../lib/utils/appDomUtils";
  import {
    profileDataStore,
    isLoadingProfileStore,
    profileLoadedStore,
  } from "../stores/profileStore.svelte";
  import { POST_EDITOR_MIN_HEIGHT } from "../lib/postLayoutUtils";
  import {
    measureElementOuterHeight,
    resolvePostEditorTargetHeight,
  } from "../lib/utils/composerLayoutUtils";
  import ImageFullscreen from "./ImageFullscreen.svelte";
  import ProfileAvatar from "./ProfileAvatar.svelte";
  import Button from "./Button.svelte";
  import type { InitializeEditorResult, MenuItem } from "../lib/types";
  import type { AppPostNotificationPort } from "../lib/appNotificationPort";
  import type { EHagakiHostOwnedComposerOptions } from "../web-component/types";
  import type { CustomEmojiItem } from "../lib/customEmoji";
  import {
    buildHostOwnedComposerOutput,
    getHostSubmissionEventId,
  } from "../lib/hostOwnedComposer";
  import {
    createHostOwnedUploadDependencies,
    createHostOwnedUploadExecutor,
  } from "../lib/hostOwnedUpload";
  import { uploadHelper, showUploadErrorMessage } from "../lib/uploadHelper";
  import { extractPostContentWithEmojiTags } from "../lib/utils/editorDocumentUtils";
  import {
    contentWarningStore,
    contentWarningReasonStore,
    getHashtagDataSnapshot,
    hashtagPinStore,
  } from "../stores/tagsStore.svelte";

  interface Props {
    rxNostr?: RxNostr;
    hasStoredKey: boolean;
    hasPostingCapability?: boolean;
    isSwitchingAccount?: boolean;
    onPostSuccess?: (result?: PostResult) => void;
    availableComposerHeight?: number;
    minEditorHeight?: number;
    onCustomEmojiSelect?: (emoji: CustomEmojiSelection) => void;
    onEditorEmptyChange?: (isEmpty: boolean) => void;
    notificationPort?: AppPostNotificationPort;
    hostOwnedConfig?: EHagakiHostOwnedComposerOptions & { signal: AbortSignal };
    hostCustomEmojiItems?: CustomEmojiItem[];
    /** The full composition root supplies the normal authenticated uploader. */
    normalUploadFiles?: UploadFilesExecutor;
  }

  let {
    rxNostr,
    hasStoredKey,
    hasPostingCapability = hasStoredKey,
    isSwitchingAccount = false,
    onPostSuccess,
    availableComposerHeight = POST_EDITOR_MIN_HEIGHT,
    minEditorHeight = POST_EDITOR_MIN_HEIGHT,
    onCustomEmojiSelect,
    onEditorEmptyChange,
    notificationPort,
    hostOwnedConfig,
    hostCustomEmojiItems = [],
    normalUploadFiles,
  }: Props = $props();
  const isHostOwnedLiteBuild =
    typeof __EHAGAKI_COMPOSER_LITE__ !== "undefined" &&
    __EHAGAKI_COMPOSER_LITE__;
  // Host-owned behavior is a build-time capability. The full distribution
  // never accepts the host config, allowing Rollup to remove this branch and
  // its dedicated output/upload modules from the full graph.
  const isHostOwned =
    isHostOwnedLiteBuild && (() => Boolean(hostOwnedConfig))();
  let mediaEnabled = $derived(!isHostOwned || !!hostOwnedConfig?.uploadMedia);
  let isUploading = $derived(editorState.isUploading);
  let canPost = $derived(editorState.canPost);
  let showEditorSubmitButton = $derived(
    isHostOwned && hostOwnedConfig?.editorSubmitButtonEnabled === true,
  );
  let hostMountActive = true;
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
  let profileData = $derived(profileDataStore.value);
  let profileLoaded = $derived(profileLoadedStore.value);
  let isLoadingProfile = $derived(isLoadingProfileStore.value);
  let editorIsEmpty = $state(true);
  let editorEmptyStateInitialized = false;
  let showAccountPlaceholder = $derived(
    !isHostOwnedLiteBuild &&
      hasStoredKey &&
      !isSwitchingAccount &&
      profileLoaded &&
      !isLoadingProfile &&
      editorIsEmpty,
  );
  let postContainerEl: HTMLDivElement | null = null;
  let editorContainerEl: HTMLElement | null = null;
  let editorResources: InitializeEditorResult | null = null;
  let editorSubscriptionUnsubscribe: (() => void) | null = null;
  let editorTargetHeight = $state(POST_EDITOR_MIN_HEIGHT);
  let editorAutoGrow = $derived(
    isHostOwned &&
      hostOwnedConfig?.editorMinLines !== undefined &&
      hostOwnedConfig.editorMaxLines !== undefined,
  );
  let postContainerStyle = $derived(
    editorAutoGrow
      ? `--post-editor-auto-grow-min-lines: ${hostOwnedConfig!.editorMinLines}lh; --post-editor-auto-grow-max-lines: ${hostOwnedConfig!.editorMaxLines}lh;`
      : `--post-editor-min-height: ${minEditorHeight}px; --post-editor-target-height: ${editorTargetHeight}px;`,
  );
  let editorPlaceholderText = $derived(
    $_("postComponent.enter_your_text") || "テキストを入力してください",
  );

  $effect(() => {
    currentEditor;
    updatePlaceholderText(editorPlaceholderText);
  });

  $effect(() => {
    const editorInstance = currentEditor;
    // The inline Lite submit surface must leave the already-focused editor in
    // place while its host callback is pending. The sending handlers below
    // still block editor input and other editor actions for this local mode.
    const editable = !postStatus.sending || showEditorSubmitButton;

    if (editorInstance && editorInstance.isEditable !== editable) {
      // Tiptap v3 supports suppressing the update event for this option-only change.
      editorInstance.setEditable(editable, false);
    }
  });

  function syncEditorTargetHeight() {
    if (editorAutoGrow) return;

    const minHeight = minEditorHeight;

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
    if (postStatus.sending) {
      event.preventDefault();
      return;
    }

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

  function handleEditorContainerKeydownCapture(event: KeyboardEvent) {
    if (!postStatus.sending) return;

    // Keep the focused contenteditable surface during an inline submit, but
    // stop the event before Tiptap's target keymap can create a transaction.
    event.preventDefault();
    event.stopPropagation();
  }

  function handleEditorContainerBeforeInput(event: InputEvent) {
    if (postStatus.sending) {
      event.preventDefault();
    }
  }

  function handleEditorSubmitButtonPointerDown(event: PointerEvent): void {
    event.preventDefault();
  }

  function restoreEditorFocusAfterEditorSubmitButtonFocus(
    event: FocusEvent,
  ): void {
    const editorElement = currentEditor?.view.dom;
    if (
      !showEditorSubmitButton ||
      !editorElement ||
      event.relatedTarget !== editorElement
    ) {
      return;
    }

    // Android may focus a native button after its touch press even when the
    // press default was cancelled. Return focus synchronously to the editor
    // that was active before this button press so its soft keyboard remains.
    editorElement.focus({ preventScroll: true });
  }

  // UI状態をストアから取得
  let postComponentUI = $derived(postComponentUIStore.value);
  let showSecretKeyDialog = $derived(postComponentUI.showSecretKeyDialog);
  let showImageFullscreen = $derived(postComponentUI.showImageFullscreen);
  let fullscreenMediaId = $derived(postComponentUI.fullscreenMediaId);
  let fullscreenImageSrc = $derived(postComponentUI.fullscreenImageSrc);
  let fullscreenImageAlt = $derived(postComponentUI.fullscreenImageAlt);
  let showFloatingMessage = $derived(postComponentUI.showFloatingMessage);
  let floatingMessageX = $derived(postComponentUI.floatingMessageX);
  let floatingMessageY = $derived(postComponentUI.floatingMessageY);
  let floatingMessageText = $derived(postComponentUI.floatingMessageText);

  // --- PostManager初期化 ---
  $effect(() => {
    if (!isHostOwnedLiteBuild && rxNostr) {
      if (!postManager)
        postManager = new PostManager(rxNostr as RxNostr, {
          getNip46SignerForSessionFn: (expectedPubkey) =>
            nip46Service.getSignerForSession(expectedPubkey),
          getParentClientSignerFn: () => parentClientAuthService.getSigner(),
          channelContextState: effectiveChannelContextState,
          replyQuoteState,
          replyQuoteService: new ReplyQuoteService(),
          clearReplyQuoteFn: clearReplyQuote,
          savePostHistoryFn: (input) =>
            savePostedEventWithMediaCacheLink({
              input,
              postHistoryRepositoryImpl: postHistoryRepository,
            }),
          notificationPort,
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
      if (isHostOwned && !hostMountActive) return;
      updateEditorUploadState(editorState, isUploading, message);
    },
    setUploadErrorMessage: (message: string) => {
      if (isHostOwned && !hostMountActive) return;
      editorState.uploadErrorMessage = message;
    },
    uploadFiles: async (params) => {
      if (
        postStatus.sending ||
        editorState.isUploading ||
        (isHostOwned && !hostMountActive)
      ) {
        return null;
      }
      if (!isHostOwned) {
        if (normalUploadFiles) return await normalUploadFiles(params);
        if (isHostOwnedLiteBuild) return null;
        const { uploadFiles } = await import("../lib/normalUploadHelper");
        return await uploadFiles(params);
      }
      if (!hostOwnedConfig?.uploadMedia) {
        updateEditorUploadState(
          editorState,
          false,
          $_("postComponent.media_not_supported"),
        );
        return null;
      }
      updateEditorUploadState(editorState, true, "");
      const executor = createHostOwnedUploadExecutor({
        uploadMedia: hostOwnedConfig.uploadMedia,
        signal: hostOwnedConfig.signal,
      });
      try {
        return await uploadHelper({
          ...params,
          showUploadError: (message, duration) =>
            showUploadErrorMessage(message, duration, {
              updateUploadState: (nextIsUploading, nextMessage) => {
                if (hostMountActive) {
                  updateEditorUploadState(
                    editorState,
                    nextIsUploading,
                    nextMessage,
                  );
                }
              },
              setUploadErrorMessage: (nextMessage) => {
                if (hostMountActive)
                  editorState.uploadErrorMessage = nextMessage;
              },
              keepUploading: true,
            }),
          setUploadErrorMessage: (message) => {
            if (hostMountActive) editorState.uploadErrorMessage = message;
          },
          devMode: false,
          dependencies: createHostOwnedUploadDependencies(
            executor.fileUploadManager,
          ),
          prepareFiles: executor.prepareFiles,
          uploadPreparedFiles: executor.uploadPreparedFiles,
          fileUploadManager: executor.fileUploadManager,
          fileUploadManagerInstance: new executor.fileUploadManager(),
          deferUploadStateClear: true,
          isUploadAborted: () =>
            !hostMountActive || !!hostOwnedConfig.signal.aborted,
        });
      } finally {
        if (hostMountActive) updateEditorUploadState(editorState, false);
      }
    },
  });
  const postStatusHandlers = createPostStatusHandlers({
    updatePostStatus,
    clearContentAfterSuccess,
    onPostSuccess: (result) => onPostSuccess?.(result),
  });

  $effect(() => {
    if (editorAutoGrow) return;

    availableComposerHeight;
    minEditorHeight;
    mediaFreePlacement;
    uploadErrorMessage;
    currentEditor;
    if (!mediaFreePlacement) {
      mediaGalleryStore.items.length;
    }

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
    if (editorAutoGrow) return;

    availableComposerHeight;
    minEditorHeight;
    currentEditor;
    mediaFreePlacement;
    uploadErrorMessage;

    if (!postContainerEl || typeof ResizeObserver === "undefined") {
      return;
    }

    let resizeSyncRaf: number | null = null;
    const scheduleEditorTargetHeightSync = () => {
      if (resizeSyncRaf !== null) return;
      resizeSyncRaf = window.requestAnimationFrame(() => {
        resizeSyncRaf = null;
        syncEditorTargetHeight();
      });
    };

    const resizeObserver = new ResizeObserver(scheduleEditorTargetHeightSync);
    scheduleEditorTargetHeightSync();

    resizeObserver.observe(postContainerEl);

    for (const child of Array.from(postContainerEl.children)) {
      if (child !== editorContainerEl) {
        resizeObserver.observe(child);
      }
    }

    return () => {
      resizeObserver.disconnect();
      if (resizeSyncRaf !== null) {
        window.cancelAnimationFrame(resizeSyncRaf);
      }
    };
  });

  // --- Editor初期化・クリーンアップ ---
  onMount(() => {
    editorResources = initializeEditor({
      placeholderText: editorPlaceholderText,
      editorContainerEl,
      currentEditor,
      hasStoredKey,
      hasPostingCapability,
      submitPost,
      onCustomEmojiSelect,
      getCustomEmojiItems: isHostOwned ? () => hostCustomEmojiItems : undefined,
      enterKeyBehavior: isHostOwned
        ? hostOwnedConfig?.enterKeyBehavior
        : undefined,
      uploadFiles: mediaEnabled
        ? (files: File[] | FileList) => {
            void uploadHandlers.performUpload(files);
          }
        : undefined,
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
    let subscribedEditor: TipTapEditor | null = null;
    const syncEditorEmptyState = (editorInstance: TipTapEditor): void => {
      const nextIsEmpty = editorInstance.isEmpty;
      const changed =
        !editorEmptyStateInitialized || editorIsEmpty !== nextIsEmpty;
      editorIsEmpty = nextIsEmpty;
      editorEmptyStateInitialized = true;
      if (changed) onEditorEmptyChange?.(nextIsEmpty);
    };
    const handleEditorTransaction = ({
      editor: editorInstance,
    }: {
      editor: TipTapEditor;
    }) => {
      syncEditorEmptyState(editorInstance);
    };

    editorSubscriptionUnsubscribe = editor.subscribe(
      (editorInstance: TipTapEditor | null) => {
        if (subscribedEditor) {
          subscribedEditor.off("transaction", handleEditorTransaction);
        }

        subscribedEditor = editorInstance;
        currentEditor = editorInstance;
        if (editorInstance) {
          syncEditorEmptyState(editorInstance);
        }
        editorInstance?.on("transaction", handleEditorTransaction);
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
        if (subscribedEditor) {
          subscribedEditor.off("transaction", handleEditorTransaction);
        }
        cleanupEditor({
          unsubscribe: editorResources.unsubscribe,
          componentUnsubscribe: editorSubscriptionUnsubscribe ?? (() => {}),
          handlers: editorResources.handlers,
          currentEditor,
          editorContainerEl,
          submitPost,
        });
        editorSubscriptionUnsubscribe = null;
      }
      if (isHostOwned) {
        hostMountActive = false;
        updateEditorUploadState(editorState, false, "");
        updatePostStatus({
          sending: false,
          success: false,
          error: false,
          message: "",
          completed: false,
        });
      }
    };
  });

  const handleFileSelect = uploadHandlers.handleFileSelect;

  export async function uploadFiles(
    files: File[] | FileList,
  ): Promise<UploadHelperResult | null> {
    return await uploadHandlers.performUpload(files);
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

  export function appendSharedTextContent(content: string): boolean {
    if (!currentEditor || !content) return false;

    const lines = content.split("\n");
    const paragraphs = lines.map((line) => ({
      type: "paragraph",
      content: line ? [{ type: "text", text: line }] : undefined,
    }));

    if (currentEditor.isEmpty) {
      currentEditor.commands.setContent({ type: "doc", content: paragraphs });
    } else {
      currentEditor
        .chain()
        .focus("end")
        .insertContent([{ type: "paragraph" }, ...paragraphs])
        .run();
    }

    currentEditor.commands.focus("end");
    return true;
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
          size: item.size ?? null,
          uploadProtocol: item.uploadProtocol ?? null,
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
    if (!currentEditor || postStatus.sending) return;
    insertCustomEmojiWithoutUnwantedKeyboard(currentEditor, emoji);
  }

  function revealToolbarCaret(): void {
    if (!currentEditor) return;
    const focusedWithoutKeyboard = focusEditorWithoutKeyboardForCurrentTap(
      currentEditor.view.dom,
    );
    if (!focusedWithoutKeyboard) {
      showToolbarCaret(currentEditor);
    }
  }

  function moveCaret(direction: -1 | 1): void {
    if (!currentEditor || postStatus.sending) return;

    revealToolbarCaret();
    const { state, view } = currentEditor;
    const currentPos =
      direction < 0 ? state.selection.from : state.selection.to;
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
    if (!currentEditor || postStatus.sending) return;

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
        ? (Array.from(nodeBefore.text ?? "").at(-1)?.length ?? 0)
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
    if (!currentEditor || postStatus.sending) return;
    revealToolbarCaret();
    currentEditor.commands.keyboardShortcut("Enter");
  }

  function canStartSubmit(): boolean {
    return (
      !!currentEditor &&
      editorState.canPost &&
      !postStatus.sending &&
      !editorState.isUploading &&
      !postStatus.completed &&
      (hasPostingCapability || !!postManager)
    );
  }

  function canStartHostOwnedSubmit(editorInstance: TipTapEditor): boolean {
    const extraction = extractPostContentWithEmojiTags(editorInstance);
    const hasLivePostableContent =
      !!extraction.content.trim() ||
      hasMediaInDoc(editorInstance.state.doc) ||
      mediaGalleryStore.hasNonPlaceholderItems();

    return (
      hasLivePostableContent &&
      !postStatus.sending &&
      !editorState.isUploading &&
      !postStatus.completed &&
      (hasPostingCapability || !!postManager)
    );
  }

  function createHostOwnedMediaImetaMap(
    editorInstance: TipTapEditor,
  ): Record<string, any> {
    if (!mediaFreePlacement) {
      return mediaGalleryStore.getMediaImetaMap();
    }
    const mediaMetadata: Record<string, any> = {};
    editorInstance.state.doc.descendants((node: any) => {
      if (
        (node.type?.name !== "image" && node.type?.name !== "video") ||
        !node.attrs?.src ||
        node.attrs?.isPlaceholder
      )
        return;
      const m = node.attrs.m ?? node.attrs.mimeType;
      if (typeof m !== "string" || !m) return;
      const size = Number(node.attrs.size);
      mediaMetadata[node.attrs.src] = {
        m,
        blurhash: node.attrs.blurhash ?? undefined,
        dim: node.attrs.dim ?? undefined,
        alt: node.attrs.alt ?? undefined,
        ...(Number.isFinite(size) && size > 0 ? { size } : {}),
        ox: node.attrs.ox ?? imageOxMap[node.attrs.src],
        x: node.attrs.x ?? imageXMap[node.attrs.src],
        uploadProtocol: node.attrs.uploadProtocol ?? undefined,
      };
    });
    return mediaMetadata;
  }

  async function submitHostOwned(editorInstance: TipTapEditor): Promise<void> {
    const config = hostOwnedConfig;
    if (!config || !canStartHostOwnedSubmit(editorInstance)) return;

    // Capture every mutable input before entering the host handler. The handler
    // is then free to await without observing later editor/context mutations.
    const extraction = extractPostContentWithEmojiTags(editorInstance);
    const content =
      !mediaFreePlacement && mediaGalleryStore.getContentUrls().length > 0
        ? [extraction.content.trim(), ...mediaGalleryStore.getContentUrls()]
            .filter(Boolean)
            .join("\n")
        : extraction.content;
    const hashtagSnapshot = getHashtagDataSnapshot();
    const snapshot = {
      content,
      hashtagTags: hashtagSnapshot.tags.map((tag) => [...tag]),
      hashtags: [...hashtagSnapshot.hashtags],
      contentWarningAvailable: hostOwnedConfig.contentWarningEnabled === true,
      contentWarningEnabled:
        hostOwnedConfig.contentWarningEnabled === true &&
        contentWarningStore.value,
      contentWarningReason:
        hostOwnedConfig.contentWarningEnabled === true
          ? contentWarningReasonStore.value
          : "",
      emojiTags: extraction.emojiTags.map((tag) => [...tag]),
      mediaImetaMap: createHostOwnedMediaImetaMap(editorInstance),
      replyQuote: $state.snapshot(replyQuoteState.value),
      channel: $state.snapshot(effectiveChannelContextState.value),
    };

    postStatusHandlers.markSending();
    try {
      const output = await buildHostOwnedComposerOutput(snapshot);
      const result = await config.submit(output, { signal: config.signal });
      if (config.signal.aborted) return;
      const eventId = getHostSubmissionEventId(result);
      notificationPort?.notifyPostSuccess({
        ...(eventId ? { eventId } : {}),
        ...(output.context.reply
          ? { replyToEventId: output.context.reply.eventId }
          : {}),
        ...(output.context.quotes.length
          ? {
              quotedEventIds: output.context.quotes.map(
                (quote) => quote.eventId,
              ),
            }
          : {}),
      });
      postStatusHandlers.markSuccess({
        success: true,
        ...(eventId ? { eventId } : {}),
      });
      if (isHostOwnedLiteBuild) {
        updatePostStatus({
          sending: false,
          success: false,
          error: false,
          message: "",
          completed: false,
        });
      }
    } catch {
      if (config.signal.aborted) return;
      notificationPort?.notifyPostError("post_error");
      postStatusHandlers.markFailure("postComponent.post_error");
    }
  }

  export async function submitPost() {
    if (!currentEditor) return;
    if (isHostOwned) {
      await submitHostOwned(currentEditor);
      return;
    }
    if (!canStartSubmit()) return;
    if (isHostOwnedLiteBuild) return;
    if (!postManager) return;
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
    if (!currentEditor) return;
    if (!isHostOwnedLiteBuild && postManager) {
      postManager.resetPostContent(currentEditor);
      return;
    }
    currentEditor.chain().clearContent().run();
  }

  export function clearContentAfterSuccess() {
    if (!isHostOwnedLiteBuild && postManager && currentEditor) {
      postManager.clearContentAfterSuccess(currentEditor);
      return;
    }
    if (currentEditor) {
      const pinnedHashtags =
        hostOwnedConfig?.hashtagPinEnabled === true && hashtagPinStore.value
          ? [...getHashtagDataSnapshot().hashtags]
          : [];
      currentEditor.chain().clearContent().run();
      contentWarningStore.reset();
      contentWarningReasonStore.reset();
      mediaGalleryStore.clearAll();
      imageOxMap = {};
      imageXMap = {};
      clearReplyQuote();
      if (pinnedHashtags.length > 0) {
        currentEditor.commands.insertContent(
          ` ${pinnedHashtags.map((hashtag) => `#${hashtag}`).join(" ")}`,
        );
      }
      currentEditor.commands.focus("start");
    }
  }

  // UI状態管理をストアから取得して使用
  async function confirmSendWithSecretKey() {
    if (!canStartSubmit()) return;
    const pendingPost = postComponentUIStore.getPendingPost();
    const pendingEmojiTags = postComponentUIStore.getPendingEmojiTags();
    postComponentUIStore.hideSecretKeyDialog();
    if (!isHostOwnedLiteBuild && postManager && currentEditor) {
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
      !isHostOwnedLiteBuild &&
      currentEditor &&
      postManager &&
      postManager.preparePostContent(currentEditor) !== editorState.content &&
      postStatus.error
    ) {
      updatePostStatus({ ...postStatus, error: false, message: "" });
    }
  });

  export function openFileDialog() {
    if (!mediaEnabled || postStatus.sending || editorState.isUploading) return;
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
  class:editor-auto-grow={editorAutoGrow}
  data-post-editor-root
  style={postContainerStyle}
  bind:this={postContainerEl}
>
  <div
    class="editor-container"
    class:drag-over={dragOver}
    class:gallery-mode={!mediaFreePlacement}
    class:sending={postStatus.sending}
    class:editor-submit-enabled={showEditorSubmitButton}
    class:account-avatar-placeholder={showAccountPlaceholder}
    onclick={handleEditorContainerClick}
    onkeydowncapture={handleEditorContainerKeydownCapture}
    onkeydown={handleEditorContainerKeydown}
    onbeforeinput={handleEditorContainerBeforeInput}
    use:fileDropActionWithDragState={{
      dragOver: (v: boolean) => (dragOver = v),
    }}
    use:pasteAction
    use:touchAction
    use:keydownAction
    aria-label={$_("postComponent.editor_label")}
    aria-disabled={postStatus.sending ? "true" : undefined}
    role="textbox"
    tabindex="-1"
    bind:this={editorContainerEl}
  >
    {#if !isHostOwnedLiteBuild && showAccountPlaceholder}
      <div class="editor-account-placeholder" aria-hidden="true">
        <ProfileAvatar
          src={profileData?.picture || ""}
          alt=""
          fallbackAriaLabel=""
          rootClassName="editor-account-placeholder-avatar"
          imageClassName="editor-account-placeholder-image"
          fallbackClassName="editor-account-placeholder-fallback"
        />
      </div>
    {/if}
    {#if editor && currentEditor}
      <!-- svelte-tiptap の Editor 型差異を回避するためここでは any キャスト -->
      <EditorContent editor={currentEditor as any} class="editor-content" />
    {/if}
    {#if showEditorSubmitButton}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="editor-submit-button-container"
        onpointerdowncapture={handleEditorSubmitButtonPointerDown}
      >
        <Button
          variant="primary"
          shape="circle"
          contentLayout="icon"
          className="editor-submit-button"
          disabled={!canPost ||
            postStatus.sending ||
            isUploading ||
            !hasPostingCapability ||
            postStatus.completed}
          onClick={() => {
            if (
              !canPost ||
              postStatus.sending ||
              isUploading ||
              !hasPostingCapability ||
              postStatus.completed
            )
              return;
            void submitPost();
          }}
          onfocus={restoreEditorFocusAfterEditorSubmitButtonFocus}
          ariaLabel={$_("postComponent.post")}
        >
          <div class="plane-icon svg-icon"></div>
        </Button>
      </div>
    {/if}
  </div>

  {#if !mediaFreePlacement}
    <MediaGallery />
  {/if}

  {#if mediaEnabled}
    <input
      type="file"
      accept="image/*,video/*"
      multiple
      onchange={handleFileSelect}
      bind:this={fileInput}
      style="display: none;"
    />
  {/if}

  {#if uploadErrorMessage}
    <div class="upload-error">{uploadErrorMessage}</div>
  {/if}
</div>

{#if !isHostOwnedLiteBuild}
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
{/if}

<ImageFullscreen
  bind:show={showImageFullscreen}
  src={fullscreenImageSrc}
  alt={fullscreenImageAlt}
  onClose={closeFullscreen}
  mediaList={fullscreenMediaList}
  currentIndex={fullscreenMediaIndex}
  onNavigate={handleFullscreenNavigate}
/>

{#if showFloatingMessage}
  <FloatingMessage
    show={showFloatingMessage}
    x={floatingMessageX}
    y={floatingMessageY}
  >
    <div>{floatingMessageText}</div>
  </FloatingMessage>
{/if}

<style>
  .post-container,
  .editor-container,
  :global(.editor-content),
  :global(.tiptap-editor) {
    width: 100%;
    flex: 1 1 auto;
  }

  .post-container,
  .editor-container,
  :global(.editor-content) {
    display: flex;
    flex-direction: column;
  }

  .post-container,
  :global(.editor-content),
  :global(.tiptap-editor) {
    min-height: 0;
  }

  :global(.editor-content),
  :global(.tiptap-editor) {
    height: 100%;
  }

  .post-container {
    max-width: 800px;
    align-items: stretch;
    overflow: visible;
    --post-editor-block-padding: 10px;
    --post-editor-line-height: 30px;
    --post-editor-submit-button-size: 40px;
  }

  .upload-error {
    color: #c62828;
    font-size: 0.9rem;
    margin-bottom: 10px;
    width: 100%;
    text-align: left;
  }

  .editor-container {
    min-height: var(--post-editor-min-height, 92px);
    height: var(--post-editor-target-height, auto);
    max-height: var(--post-editor-target-height, auto);
    position: relative;
    cursor: text;
    outline: none;
    background: var(--surface-editor);
    -webkit-tap-highlight-color: transparent;
    overflow: hidden;
  }

  .post-container.editor-auto-grow,
  .post-container.editor-auto-grow .editor-container,
  .post-container.editor-auto-grow :global(.editor-content),
  .post-container.editor-auto-grow :global(.tiptap-editor) {
    flex: 0 0 auto;
  }

  .post-container.editor-auto-grow .editor-container,
  .post-container.editor-auto-grow :global(.editor-content),
  .post-container.editor-auto-grow :global(.tiptap-editor) {
    height: auto;
  }

  .post-container.editor-auto-grow .editor-container {
    min-height: 0;
    max-height: none;
  }

  .post-container.editor-auto-grow :global(.tiptap-editor) {
    min-height: calc(
      var(--post-editor-auto-grow-min-lines) + var(--post-editor-block-padding) +
        var(--post-editor-block-padding)
    );
    max-height: calc(
      var(--post-editor-auto-grow-max-lines) + var(--post-editor-block-padding) +
        var(--post-editor-block-padding)
    );
  }

  :global(.editor-account-placeholder) {
    position: absolute;
    top: 11px;
    left: 14px;
    z-index: 3;
    width: 28px;
    height: 28px;
    opacity: 0.5;
    pointer-events: none;
    user-select: none;
    -webkit-user-select: none;
  }

  :global(.editor-account-placeholder-avatar) {
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 50%;
  }

  :global(.editor-account-placeholder-image),
  :global(.editor-account-placeholder-fallback) {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  :global(.editor-account-placeholder-image) {
    object-fit: cover;
  }

  .editor-container.account-avatar-placeholder
    :global(p.is-editor-empty:first-child::before) {
    padding-left: 38px;
  }

  .editor-container.sending {
    background: color-mix(
      in srgb,
      var(--surface-editor) 82%,
      var(--surface-button) 18%
    );
    cursor: not-allowed;
  }

  .editor-container.sending :global(.tiptap-editor) {
    cursor: not-allowed;
    opacity: 0.72;
  }

  .editor-container.editor-submit-enabled.sending :global(.tiptap-editor) {
    pointer-events: none;
  }

  .editor-container.sending :global(.editor-image-button),
  .editor-container.sending :global(.custom-emoji-drag-target),
  .editor-container.sending :global(.media-delete-btn) {
    pointer-events: none;
  }

  .editor-container.editor-submit-enabled :global(.tiptap-editor) {
    padding-inline-end: calc(var(--post-editor-block-padding) + 40px);
  }

  .editor-submit-button-container {
    position: absolute;
    inset-inline-end: var(--post-editor-block-padding);
    bottom: var(--post-editor-block-padding);
    z-index: 4;
    inset-inline-end: 14px;
  }

  .post-container.editor-auto-grow .editor-submit-button-container {
    bottom: calc(
      var(--post-editor-block-padding) +
        (var(--post-editor-line-height) - var(--post-editor-submit-button-size)) /
        2
    );
  }

  :global(.editor-submit-button) {
    width: var(--post-editor-submit-button-size);
    height: var(--post-editor-submit-button-size);
    flex: 0 0 var(--post-editor-submit-button-size);
  }

  :global(button.editor-submit-button .plane-icon.svg-icon) {
    width: 22px;
    height: 22px;
    mask-image: url("/icons/paper-plane-solid-full.svg");
    margin-inline-end: 1px;
    margin-top: 1px;
  }

  .editor-container.drag-over {
    border: 3px dashed var(--theme);
  }

  /* ギャラリーモード時はドロップカーソル（差し込み位置バー）を常に非表示 */
  .editor-container.gallery-mode :global(.tiptap-dropcursor) {
    display: none !important;
  }

  /* Tiptapエディターのスタイル */
  :global(.tiptap-editor) {
    display: block;
    padding: var(--post-editor-block-padding);
    font-family: inherit;
    font-size: 1.25rem;
    line-height: var(--post-editor-line-height);
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

    :global(.toolbar-caret) {
      display: inline-block;
      width: 0;
      height: 1.5em;
      margin-left: -1px;
      border-left: 2px solid var(--text);
      vertical-align: -0.25em;
      pointer-events: none;
      animation: toolbar-caret-blink 1s steps(1) infinite;
    }
  }

  @keyframes toolbar-caret-blink {
    0%,
    49% {
      opacity: 1;
    }
    50%,
    100% {
      opacity: 0;
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
    border-top-color: light-dark(black, white);
  }
</style>
