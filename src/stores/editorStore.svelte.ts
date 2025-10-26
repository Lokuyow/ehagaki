import { createEditor } from 'svelte-tiptap';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { SvelteNodeViewRenderer } from 'svelte-tiptap';
import { NodeSelection, TextSelection } from '@tiptap/pm/state';
import SvelteImageNode from '../components/SvelteImageNode.svelte';
import { Video } from '../lib/editor/videoExtension';
import { validateAndNormalizeUrl, findAndExecuteOnNode, removePlaceholderNode } from '../lib/utils/editorUtils';
import { generateSimpleUUID } from '../lib/utils/appUtils';
import { ContentTrackingExtension, MediaPasteExtension, ImageDragDropExtension, SmartBackspaceExtension, ClipboardExtension } from '../lib/editor';
import { GapCursorNewlineExtension } from '../lib/editor/gapCursorNewline';
import type { PostStatus, EditorState, InitializeEditorParams, InitializeEditorResult, CleanupEditorParams, PlaceholderEntry, FileUploadResponse, ImageDimensions } from '../lib/types';
import { updateHashtagData } from '../lib/tags/hashtagManager';
import { setupEventListeners, cleanupEventListeners, setupGboardHandler } from '../lib/editor/editorDomActions.svelte';
import { processPastedText } from '../lib/editor/clipboardExtension';
import type { Editor as TipTapEditor } from '@tiptap/core';
import { uploadAbortFlagStore } from './appStore.svelte';

/**
 * Tiptap v2のエディターストアを作成
 */
export function createEditorStore(placeholderText: string) {
    let placeholderExtension = Placeholder.configure({
        placeholder: placeholderText,
        emptyEditorClass: 'is-editor-empty',
        showOnlyWhenEditable: true,
        showOnlyCurrent: true,  // 変更: 現在の段落のみに表示
        includeChildren: false, // 変更: 子要素には表示しない
    });

    const editorStore = createEditor({
        extensions: [
            StarterKit.configure({
                paragraph: {
                    HTMLAttributes: {
                        class: 'editor-paragraph',
                    },
                },
            }),
            Link.configure({
                HTMLAttributes: {
                    class: 'preview-link',
                    target: '_blank',
                    rel: 'noopener noreferrer',
                },
                autolink: true,
                linkOnPaste: true,
                validate: (url) => {
                    // utilsのバリデーション関数を利用
                    return !!validateAndNormalizeUrl(url);
                }
            }),
            // Image拡張の設定
            Image.configure({
                HTMLAttributes: {
                    class: 'editor-image',
                },
                allowBase64: false,
            }).extend({
                addAttributes() {
                    return {
                        src: { default: null },
                        blurhash: { default: null },
                        isPlaceholder: { default: false },
                        id: {
                            default: () => generateSimpleUUID(),  // 変更: 簡易UUIDのみ使用
                        },
                    };
                },
                addNodeView() {
                    return SvelteNodeViewRenderer(SvelteImageNode as any);
                },
            }),
            ContentTrackingExtension,
            Video,
            ClipboardExtension, // ← クリップボード処理を追加（MediaPasteExtensionの前に配置）
            MediaPasteExtension,
            ImageDragDropExtension,
            SmartBackspaceExtension, // ←追加
            GapCursorNewlineExtension,
            placeholderExtension,
        ],
        // HTMLではなくJSONノード構造で初期化
        content: {
            type: 'doc',
            content: [
                {
                    type: 'paragraph'
                }
            ]
        },
        editorProps: {
            attributes: {
                class: 'tiptap-editor',
                'data-placeholder': placeholderText,
            },
            // タッチデバイス対応のイベントハンドリング
            handleClickOn(view, pos, _node, _nodePos, event, _direct) {
                // クリックターゲットがリンクかどうか判定
                let target = event.target as HTMLElement | null;
                while (target && target !== view.dom) {
                    if (target.tagName === 'A' && target.hasAttribute('href')) {
                        // Ctrl（またはCmd）+クリック時のみ遷移許可
                        if (event.ctrlKey || event.metaKey) {
                            return false;
                        }

                        // 通常タップ/クリックは編集モードで扱う
                        event.preventDefault();

                        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
                        const mouseEvent = event as MouseEvent;
                        const coords = {
                            left: mouseEvent.clientX,
                            top: mouseEvent.clientY
                        };

                        const resolvedPos = (Number.isFinite(coords.left) && Number.isFinite(coords.top))
                            ? view.posAtCoords(coords)
                            : null;

                        const selectionPos = resolvedPos?.pos ?? pos;
                        const docSize = view.state.doc.content.size;
                        const clampedPos = Math.max(0, Math.min(selectionPos, docSize));
                        const textSelection = TextSelection.near(view.state.doc.resolve(clampedPos));

                        view.dispatch(view.state.tr.setSelection(textSelection).scrollIntoView());
                        view.focus();

                        // タッチ端末では直後にキーボードが表示されないことがあるため、リクエストを遅延
                        if (isTouchDevice && typeof requestAnimationFrame === 'function') {
                            requestAnimationFrame(() => view.focus());
                        }

                        return true;
                    }
                    target = target.parentElement;
                }
                return false;
            },
            handleKeyDown: (_view, event) => {
                if ((event.ctrlKey || event.metaKey) && (event.key === 'Enter' || event.key === 'NumpadEnter')) {
                    event.preventDefault();
                    submitPost();
                    return true;
                }
                return false;
            },
        },
        onCreate({ editor }) {
            // エディター作成時にグローバル参照を設定
            (window as any).__currentEditor = editor;

            // プレースホルダー属性を設定
            const editorElement = editor.view.dom as HTMLElement;
            if (editorElement) {
                // 初期状態では空なのでis-editor-emptyクラスを追加
                editorElement.classList.add('is-editor-empty');
                editorElement.setAttribute('data-placeholder', placeholderText);

                // 最初の段落要素にのみプレースホルダー属性を設定（以降、onUpdateで管理）
                const firstParagraph = editorElement.querySelector('p:first-child') as HTMLElement | null;
                if (firstParagraph) {
                    firstParagraph.setAttribute('data-placeholder', placeholderText);
                }
            }
        },
        onUpdate({ editor }) {
            // 更新時にエディタ全体が空かどうかを判定
            const editorElement = editor.view.dom as HTMLElement;
            if (editorElement) {
                // エディタの内容を確認（テキストまたは画像/動画があるか）
                const doc = editor.state.doc;
                let isEmpty = true;

                doc.descendants((node) => {
                    // テキストがある、または画像/動画ノードがある場合は空ではない
                    if (node.isText && node.text && node.text.trim().length > 0) {
                        isEmpty = false;
                        return false; // 探索を中止
                    }
                    if (node.type.name === 'image' || node.type.name === 'video') {
                        isEmpty = false;
                        return false; // 探索を中止
                    }
                    return true;
                });

                // is-editor-emptyクラスの現在の状態を確認
                const currentHasEmptyClass = editorElement.classList.contains('is-editor-empty');
                const shouldHaveEmptyClass = isEmpty;

                // 明示的な変更がある場合のみクラスを操作（点滅防止）
                if (currentHasEmptyClass !== shouldHaveEmptyClass) {
                    if (isEmpty) {
                        editorElement.classList.add('is-editor-empty');
                    } else {
                        editorElement.classList.remove('is-editor-empty');
                    }
                }

                // 段落要素のis-editor-emptyクラスを設定（最初の段落のみ対象）
                const firstParagraph = editorElement.querySelector('p:first-child') as HTMLElement | null;
                if (firstParagraph) {
                    const currentHasEmptyClass = firstParagraph.classList.contains('is-editor-empty');
                    const shouldHaveEmptyClass = isEmpty;

                    // 明示的な変更がある場合のみクラスを操作
                    if (currentHasEmptyClass !== shouldHaveEmptyClass) {
                        if (isEmpty) {
                            firstParagraph.classList.add('is-editor-empty');
                        } else {
                            firstParagraph.classList.remove('is-editor-empty');
                        }
                    }

                    // プレースホルダー属性は初回のみ設定（以降は不変）
                    if (!firstParagraph.getAttribute('data-placeholder')) {
                        const placeholder = editorElement.getAttribute('data-placeholder') || placeholderText;
                        firstParagraph.setAttribute('data-placeholder', placeholder);
                    }
                }
            }
        },
        onDestroy() {
            // エディター破棄時にグローバル参照をクリア
            delete (window as any).__currentEditor;
        }
    });

    // プレースホルダー更新機能を修正
    const updatePlaceholder = (newPlaceholder: string) => {
        const currentEditor = (window as any).__currentEditor;
        if (currentEditor && currentEditor.view) {
            // エディターDOM要素のdata-placeholder属性を更新（現在の値と異なる場合のみ）
            const editorElement = currentEditor.view.dom as HTMLElement;
            if (editorElement) {
                const currentPlaceholder = editorElement.getAttribute('data-placeholder');
                if (currentPlaceholder !== newPlaceholder) {
                    editorElement.setAttribute('data-placeholder', newPlaceholder);
                }

                // 最初の段落要素のプレースホルダー属性も更新（現在の値と異なる場合のみ）
                const firstParagraph = editorElement.querySelector('p:first-child') as HTMLElement | null;
                if (firstParagraph) {
                    const currentAttr = firstParagraph.getAttribute('data-placeholder');
                    if (currentAttr !== newPlaceholder) {
                        firstParagraph.setAttribute('data-placeholder', newPlaceholder);
                    }
                }
            }

            // Placeholder拡張の設定も更新
            const placeholderExt = currentEditor.extensionManager.extensions.find(
                (ext: any) => ext.name === 'placeholder'
            );
            if (placeholderExt) {
                const currentPlaceholder = placeholderExt.options.placeholder;
                if (currentPlaceholder !== newPlaceholder) {
                    placeholderExt.options.placeholder = newPlaceholder;
                    // 強制的に再描画
                    currentEditor.view.dispatch(
                        currentEditor.state.tr.setMeta('addToHistory', false)
                    );
                }
            }
        }
    };

    // ストアにメソッドを追加
    (editorStore as any).updatePlaceholder = updatePlaceholder;

    return editorStore;
}

// --- エディター専用状態管理 ---
export let placeholderTextStore = $state({ value: '' });

// エディターインスタンスの管理
let currentEditorInstance = $state<TipTapEditor | null>(null);

export const currentEditorStore = {
    get value() { return currentEditorInstance; },
    set: (editor: TipTapEditor | null) => { currentEditorInstance = editor; }
};

export let editorState = $state<EditorState>({
    content: '',
    canPost: false,
    isUploading: false,
    uploadErrorMessage: '',
    postStatus: {
        sending: false,
        success: false,
        error: false,
        message: ''
    },
    hasImage: false
});

// SvelteImageNode用状態管理
export const imageDragState = $state({
    isDragging: false,
    startPos: { x: 0, y: 0 },
    longPressTimeout: null as ReturnType<typeof setTimeout> | null,
    startTarget: null as HTMLElement | null,
    preview: null as HTMLElement | null,
});

export const imageSelectionState = $state({
    justSelected: false,
    justSelectedTimeout: null as ReturnType<typeof setTimeout> | null,
});

// --- エディター状態更新関数 ---
function canPostByContent(content: string, hasMedia: boolean): boolean {
    return !!content.trim() || hasMedia;
}

export function updateEditorContent(content: string, hasMedia: boolean = false): void {
    editorState.content = content;
    editorState.hasImage = hasMedia;
    editorState.canPost = canPostByContent(content, hasMedia);
}

export function updatePostStatus(postStatus: PostStatus): void {
    editorState.postStatus = postStatus;
}

export function updateUploadState(isUploading: boolean, errorMessage: string = ''): void {
    editorState.isUploading = isUploading;
    editorState.uploadErrorMessage = errorMessage;
}

export function resetEditorState(): void {
    editorState.content = '';
    editorState.canPost = false;
    editorState.uploadErrorMessage = '';
    editorState.postStatus = {
        sending: false,
        success: false,
        error: false,
        message: '',
        completed: false
    };
    editorState.hasImage = false;
}

export function resetPostStatus(): void {
    editorState.postStatus = {
        sending: false,
        success: false,
        error: false,
        message: '',
        completed: false
    };
}

export function updatePlaceholderText(text: string): void {
    placeholderTextStore.value = text;
}

// --- 投稿機能の統合 ---
let postComponentSubmit: (() => Promise<void>) | undefined = undefined;

export function setPostSubmitter(submitter: () => Promise<void>) {
    postComponentSubmit = submitter;
}

export async function submitPost() {
    if (postComponentSubmit) {
        await postComponentSubmit();
    }
}

// --- エディター初期化・クリーンアップ関数 ---
export function initializeEditor(params: InitializeEditorParams): InitializeEditorResult {
    const {
        placeholderText,
        editorContainerEl,
        currentEditor,
        hasStoredKey,
        submitPost,
        uploadFiles,
        eventCallbacks
    } = params;

    // プレースホルダーの設定
    placeholderTextStore.value = placeholderText;

    // エディターストアの作成
    const editor = createEditorStore(placeholderText);

    // エディターインスタンスの購読
    let latestEditor: any = null;
    const unsubscribe = editor.subscribe((editorInstance: any) => {
        latestEditor = editorInstance;
    });

    // イベントリスナーのセットアップ
    const handlers = setupEventListeners({
        currentEditor: latestEditor,
        editorContainerEl,
        callbacks: eventCallbacks,
    });

    // ポスト送信関数の登録
    setPostSubmitter(submitPost);

    // エディターコンテナに必要なプロパティを設定
    if (editorContainerEl) {
        Object.assign(editorContainerEl, {
            __uploadFiles: uploadFiles,
            __currentEditor: () => latestEditor,
            __hasStoredKey: () => hasStoredKey,
            __postStatus: () => editorState.postStatus,
            __submitPost: submitPost,
        });
    }

    // Android Gboard対応のセットアップ
    let gboardCleanup: (() => void) | undefined;
    if (editorContainerEl) {
        gboardCleanup = setupGboardHandler({
            editorContainerEl,
            getCurrentEditor: () => latestEditor,
            processPastedText,
        });
    }

    return { editor, unsubscribe, handlers, gboardCleanup };
}

export function cleanupEditor(params: CleanupEditorParams): void {
    const { unsubscribe, handlers, gboardCleanup, currentEditor, editorContainerEl } = params;

    // イベントリスナーのクリーンアップ
    cleanupEventListeners(handlers, editorContainerEl);

    // Gboardハンドラーのクリーンアップ
    if (gboardCleanup) {
        gboardCleanup();
    }

    // エディターの購読解除
    unsubscribe();

    // エディターの破棄
    currentEditor?.destroy?.();

    // エディターコンテナのプロパティをクリア
    if (editorContainerEl) {
        delete (editorContainerEl as any).__uploadFiles;
        delete (editorContainerEl as any).__currentEditor;
        delete (editorContainerEl as any).__hasStoredKey;
        delete (editorContainerEl as any).__postStatus;
        delete (editorContainerEl as any).__submitPost;
    }
}

// --- プレースホルダー管理関数 ---

/**
 * プレースホルダーノードをエディターに挿入
 */
export function insertPlaceholdersIntoEditor(
    fileArray: File[],
    fileProcessingResults: Array<{ file: File; index: number; ox?: string; dimensions?: ImageDimensions }>,
    currentEditor: TipTapEditor | null,
    showUploadError: (msg: string, duration?: number) => void,
    imageSizeMapStore: { update: (fn: (map: Record<string, any>) => Record<string, any>) => void },
    FileUploadManager: any,
    devMode: boolean = false
): PlaceholderEntry[] {
    const placeholderMap: PlaceholderEntry[] = [];
    const fileUploadManager = new FileUploadManager();
    const timestamp = Date.now();

    if (!currentEditor) return placeholderMap;

    const state = currentEditor.state;
    const selection = state.selection;

    const isImageNodeSelected = selection instanceof NodeSelection && selection.node?.type?.name === 'image';

    if (devMode) {
        console.log('[dev] insertPlaceholdersIntoEditor:', {
            fileCount: fileArray.length,
            isImageNodeSelected,
            selectionType: selection.constructor.name,
            selectionFrom: selection.from,
            selectionTo: (selection as any).to,
            docSize: state.doc.content.size
        });
    }

    const isOnlyEmptyParagraph = state.doc.childCount === 1 &&
        state.doc.firstChild?.type.name === 'paragraph' &&
        state.doc.firstChild.content.size === 0;

    let tr = state.tr;
    let currentInsertPos = isImageNodeSelected ? (selection as NodeSelection).to : selection.from;

    fileArray.forEach((file, index) => {
        const isVideo = file.type.startsWith('video/');
        const validation = fileUploadManager.validateMediaFile(file);
        if (!validation.isValid) {
            showUploadError(validation.errorMessage || "postComponent.upload_failed");
            return;
        }

        const placeholderId = `placeholder-${timestamp}-${index}-${generateSimpleUUID()}`;
        const processingResult = fileProcessingResults[index];
        const ox = processingResult?.ox;
        const dimensions = processingResult?.dimensions;

        try {
            let node;

            if (isVideo) {
                const videoAttrs: any = {
                    src: placeholderId,
                    id: placeholderId,
                    isPlaceholder: true
                };
                node = state.schema.nodes.video.create(videoAttrs);
            } else {
                const imageAttrs: any = {
                    src: placeholderId,
                    isPlaceholder: true
                };

                if (dimensions) {
                    imageAttrs.dim = `${dimensions.width}x${dimensions.height}`;
                    imageSizeMapStore.update(map => ({
                        ...map,
                        [placeholderId]: dimensions
                    }));
                }
                node = state.schema.nodes.image.create(imageAttrs);
            }

            if (isOnlyEmptyParagraph && index === 0) {
                tr = tr.replaceWith(0, state.doc.content.size, node);
                currentInsertPos = node.nodeSize;
            } else {
                tr = tr.insert(currentInsertPos, node);
                currentInsertPos += node.nodeSize;
            }

            placeholderMap.push({ file, placeholderId, ox, dimensions });
        } catch (error) {
            if (devMode) {
                console.error("[uploadHelper] failed to insert media node", {
                    placeholderId,
                    file: file.name,
                    isVideo,
                    error,
                    insertPos: currentInsertPos,
                    docSize: state.doc.content.size
                });
            }
            showUploadError(isVideo ? "動画の挿入に失敗しました" : "画像の挿入に失敗しました");
        }
    });

    if (placeholderMap.length > 0) {
        currentEditor.view.dispatch(tr);
    }

    return placeholderMap;
}

/**
 * プレースホルダーのBlurhash生成
 */
export async function generateBlurhashesForPlaceholders(
    placeholderMap: PlaceholderEntry[],
    currentEditor: TipTapEditor | null,
    FileUploadManager: any,
    devMode: boolean = false
): Promise<void> {
    // 中止フラグをチェック
    if (uploadAbortFlagStore.value) {
        if (devMode) console.log('[generateBlurhashesForPlaceholders] Aborted before blurhash generation');
        return;
    }

    const fileUploadManager = new FileUploadManager();

    const blurhashPromises = placeholderMap.map(async (item) => {
        // 各ファイルごとに中止チェック
        if (uploadAbortFlagStore.value) {
            if (devMode) console.log('[generateBlurhashesForPlaceholders] Aborted during blurhash generation');
            return;
        }

        try {
            const blurhash = await fileUploadManager.generateBlurhashForFile(item.file);

            // Blurhash生成後に中止チェック
            if (uploadAbortFlagStore.value) {
                if (devMode) console.log('[generateBlurhashesForPlaceholders] Aborted after blurhash generation');
                return;
            }

            if (blurhash) {
                item.blurhash = blurhash;
                if (currentEditor) {
                    findAndExecuteOnNode(
                        currentEditor,
                        (node: any, _pos: number) => {
                            const nodeType = node.type?.name;
                            const isVideoNode = item.file.type.startsWith('video/') && nodeType === 'video';
                            const isImageNode = !item.file.type.startsWith('video/') && nodeType === 'image';
                            return (isVideoNode || isImageNode) && (node.attrs?.src === item.placeholderId || node.attrs?.id === item.placeholderId);
                        },
                        (node: any, pos: number) => {
                            const tr = currentEditor!.state.tr.setNodeMarkup(pos, undefined, {
                                ...node.attrs,
                                blurhash: blurhash,
                            });
                            currentEditor!.view.dispatch(tr);
                        }
                    );
                }
            }
        } catch (error) {
            if (devMode) {
                console.warn("[uploadHelper] blurhash generation failed", {
                    file: item.file.name,
                    error
                });
            }
        }
    });

    await Promise.all(blurhashPromises);
}

/**
 * プレースホルダーを実際のURLに置換
 */
export async function replacePlaceholdersWithResults(
    results: FileUploadResponse[],
    placeholderMap: PlaceholderEntry[],
    currentEditor: TipTapEditor | null,
    imageOxMap: Record<string, string>,
    imageXMap: Record<string, string>,
    imageSizeMapStore: { update: (fn: (map: Record<string, any>) => Record<string, any>) => void },
    _extractImageBlurhashMap: (editor: TipTapEditor) => Record<string, string>,
    _getMimeTypeFromUrl: (url: string) => string,
    calculateImageHash: (url: string) => Promise<string | null>,
    _createImetaTag: (params: any) => Promise<string[]>,
    devMode: boolean = false
): Promise<{ failedResults: FileUploadResponse[]; errorMessage: string; imageServerBlurhashMap: Record<string, string> }> {
    const failedResults: FileUploadResponse[] = [];
    const imageServerBlurhashMap: Record<string, string> = {};
    let errorMessage = "";

    const remainingPlaceholders = [...placeholderMap];

    for (let i = 0; i < results.length; i++) {
        const result = results[i];

        if (devMode) {
            console.log('[uploadHelper] Processing result', i, ':', {
                success: result.success,
                url: result.url,
                filename: result.filename,
                sizeInfo: result.sizeInfo,
                aborted: result.aborted
            });
        }

        if (result.aborted) {
            const aborted = remainingPlaceholders.shift();
            if (aborted) {
                const isVideo = aborted.file.type.startsWith('video/');
                removePlaceholderNode(aborted.placeholderId, isVideo, currentEditor, imageSizeMapStore, devMode);
            }
            continue;
        }

        if (result.success && result.url) {
            let matched: PlaceholderEntry | undefined = undefined;
            let matchedIndex = -1;

            if (result.sizeInfo && result.sizeInfo.originalFilename) {
                matchedIndex = remainingPlaceholders.findIndex(
                    (p) => p.file.name === result.sizeInfo!.originalFilename,
                );
                if (matchedIndex !== -1) {
                    matched = remainingPlaceholders[matchedIndex];
                }
            }

            if (!matched && remainingPlaceholders.length > 0) {
                matched = remainingPlaceholders[0];
                matchedIndex = 0;
            }

            if (matched && matchedIndex !== -1 && currentEditor) {
                remainingPlaceholders.splice(matchedIndex, 1);
                const isVideo = matched.file.type.startsWith('video/');

                if (devMode) {
                    console.log('[uploadHelper] Replacing placeholder', {
                        placeholderId: matched.placeholderId,
                        url: result.url,
                        isVideo
                    });
                }

                findAndExecuteOnNode(
                    currentEditor,
                    (node: any, _pos: number) => {
                        const nodeType = node.type?.name;
                        const isSameNode = (isVideo && nodeType === "video") || (!isVideo && nodeType === "image");
                        return isSameNode && (node.attrs?.src === matched!.placeholderId || node.attrs?.id === matched!.placeholderId);
                    },
                    (node: any, pos: number) => {
                        if (isVideo) {
                            const newAttrs: any = {
                                ...node.attrs,
                                src: result.url,
                                id: result.url,
                                isPlaceholder: false,
                            };
                            const tr = currentEditor!.state.tr.setNodeMarkup(pos, undefined, newAttrs);
                            currentEditor!.view.dispatch(tr);
                        } else {
                            const newAttrs: any = {
                                ...node.attrs,
                                src: result.url,
                                isPlaceholder: false,
                                blurhash: matched!.blurhash ?? undefined,
                            };

                            if (matched!.dimensions) {
                                newAttrs.dim = `${matched!.dimensions.width}x${matched!.dimensions.height}`;
                            }

                            const tr = currentEditor!.state.tr.setNodeMarkup(pos, undefined, newAttrs);
                            currentEditor!.view.dispatch(tr);

                            imageSizeMapStore.update(map => {
                                const newMap = { ...map };
                                delete newMap[matched!.placeholderId];
                                if (matched!.dimensions) {
                                    newMap[result.url!] = matched!.dimensions;
                                }
                                return newMap;
                            });
                        }
                    }
                );

                if (!isVideo) {
                    const nip94 = result.nip94 || {};
                    const serverBlurhash = nip94['blurhash'] ?? nip94['b'] ?? undefined;
                    if (serverBlurhash && result.url) {
                        imageServerBlurhashMap[result.url] = serverBlurhash;
                    }
                    const oxFromServer = nip94['ox'] ?? nip94['o'] ?? undefined;
                    const xFromServer = nip94['x'] ?? undefined;

                    if (oxFromServer && result.url) {
                        imageOxMap[result.url] = oxFromServer;
                    } else if (matched.ox && result.url) {
                        imageOxMap[result.url] = matched.ox;
                    }

                    if (result.url) {
                        if (xFromServer) {
                            imageXMap[result.url] = xFromServer;
                        } else {
                            try {
                                const x = await calculateImageHash(result.url);
                                if (x) imageXMap[result.url] = x;
                            } catch (error) {
                                if (devMode) {
                                    console.warn("[uploadHelper] failed to calculate x hash (fallback)", {
                                        url: result.url,
                                        error
                                    });
                                }
                            }
                        }
                    }
                }
            }
        } else if (!result.success) {
            failedResults.push(result);
            const failed = remainingPlaceholders.shift();
            if (failed) {
                const isVideo = failed.file.type.startsWith('video/');
                removePlaceholderNode(failed.placeholderId, isVideo, currentEditor, imageSizeMapStore, devMode);
            }
        }
    }

    for (const remaining of remainingPlaceholders) {
        const isVideo = remaining.file.type.startsWith('video/');
        removePlaceholderNode(remaining.placeholderId, isVideo, currentEditor, imageSizeMapStore, devMode);
    }

    if (failedResults.length) {
        errorMessage = failedResults.length === 1
            ? failedResults[0].error || "postComponent.upload_failed"
            : `${failedResults.length}個のファイルのアップロードに失敗しました`;
    }

    return { failedResults, errorMessage, imageServerBlurhashMap };
}
