/*
 * editorDomActions.ts: Svelte アプリケーションのエディタ DOM 操作を管理。
 * TipTap エディタのドラッグ＆ドロップ、ペースト、タッチ、キーボードイベントを Svelte アクションで処理。
 * Svelte5 のアクション機能を有効活用。
 */

import { extractContentWithImages } from "../utils/editorUtils";
import type { Editor as TipTapEditor } from "@tiptap/core";
import { domUtils } from "../utils/appDomUtils";
import type { Node as PMNode } from "prosemirror-model"; // 追加
import { NodeSelection } from "prosemirror-state";
import type {
    SetupEventListenersParams,
    EditorEventHandlers,
    GboardHandlerParams
} from "../types";

// ヘルパー: dataTransfer から「内部ドラッグ（エディタ内ノード移動）」か「外部ファイルドラッグ」か判定
function isInternalTiptapDrag(dt: DataTransfer | null | undefined): boolean {
    if (!dt || !dt.types) return false;
    try {
        return Array.from(dt.types as string[]).some((t) => t === "application/x-tiptap-node");
    } catch {
        return false;
    }
}
function hasExternalFiles(dt: DataTransfer | null | undefined): boolean {
    if (!dt) return false;
    // types に "Files" が含まれるか、実際に files が存在するかで判定
    try {
        const types = Array.from(dt.types as any);
        return types.includes("Files") || (dt.files && dt.files.length > 0);
    } catch {
        return !!(dt.files && dt.files.length > 0);
    }
}

// fileDropAction
export function fileDropAction(node: HTMLElement) {
    let dragOver = $state(false);
    function handleDragOver(event: DragEvent) {
        const dt = event.dataTransfer;
        const internal = isInternalTiptapDrag(dt);
        const externalFiles = hasExternalFiles(dt);

        // 内部ドラッグ（エディタ内ノード移動）はエディタ側に委譲するため preventDefaultしない
        if (externalFiles && !internal) {
            // 外部ファイルがあるドラッグのみ許可してビジュアルを出す
            event.preventDefault();
            if (!dragOver) {
                dragOver = true;
                node.classList.add("drag-over");
            }
        } else {
            // 内部ドラッグやファイルが無ければ drag-over を消す（何も阻害しない）
            if (dragOver) {
                dragOver = false;
                node.classList.remove("drag-over");
            }
        }
    }
    function handleDragLeave(event: DragEvent) {
        // 外部ファイルドラッグ離脱時は必ず drag-over を消す
        if (dragOver) {
            dragOver = false;
            node.classList.remove("drag-over");
        }
    }
    async function handleDrop(event: DragEvent) {
        // 常に drag-over をリセット
        dragOver = false;
        node.classList.remove("drag-over");

        const dt = event.dataTransfer;
        // 内部ドラッグ（エディタ内ノード）なら何もしない — ProseMirror が処理する
        if (isInternalTiptapDrag(dt)) {
            return;
        }

        // 外部のファイルがあればアップロード処理を呼ぶ
        if (dt?.files && dt.files.length > 0) {
            // node.__uploadFilesが関数なら呼び出す
            if (typeof (node as any).__uploadFiles === "function") {
                event.preventDefault(); // 外部ファイルドロップは preventDefault して処理を受け取る
                (node as any).__uploadFiles(dt.files);
            }
        } else {
            // もし text/uri-list などの URL ドロップを検出したい場合はここで処理を追加
        }
    }
    node.addEventListener("dragover", handleDragOver);
    node.addEventListener("dragleave", handleDragLeave);
    node.addEventListener("drop", handleDrop);
    return {
        destroy() {
            node.removeEventListener("dragover", handleDragOver);
            node.removeEventListener("dragleave", handleDragLeave);
            node.removeEventListener("drop", handleDrop);
        },
    };
}

// dragOver状態を外部制御できるfileDropActionのラッパー
export function fileDropActionWithDragState(
    node: HTMLElement,
    params: { dragOver: (v: boolean) => void }
) {
    const action = fileDropAction(node);
    function handleDragOver(event: DragEvent) {
        const dt = event.dataTransfer;
        const internal = isInternalTiptapDrag(dt);
        const externalFiles = hasExternalFiles(dt);

        // 内部ドラッグ（エディタ内ノード移動）は dragOver を false に
        if (externalFiles && !internal) {
            params.dragOver(true);
        } else {
            params.dragOver(false);
        }
    }
    function handleDragLeave(event: DragEvent) {
        params.dragOver(false);
    }
    function handleDrop(event: DragEvent) {
        params.dragOver(false);
    }
    node.addEventListener("dragover", handleDragOver);
    node.addEventListener("dragleave", handleDragLeave);
    node.addEventListener("drop", handleDrop);
    return {
        destroy() {
            action?.destroy?.();
            node.removeEventListener("dragover", handleDragOver);
            node.removeEventListener("dragleave", handleDragLeave);
            node.removeEventListener("drop", handleDrop);
        },
    };
}

// pasteAction
// 画像ファイルのペーストのみを処理（テキストペーストはClipboardExtensionで処理）
export function pasteAction(node: HTMLElement) {
    function handlePaste(event: ClipboardEvent) {
        if (!event.clipboardData) return;
        const files: File[] = [];
        for (const item of event.clipboardData.items) {
            if (item.kind === "file" && item.type.startsWith("image/")) {
                const file = item.getAsFile();
                if (file) files.push(file);
            }
        }
        if (files.length > 0) {
            event.preventDefault();
            (node as any).__uploadFiles?.(files);
        }
        // テキストペーストはClipboardExtensionに委譲
    }
    node.addEventListener("paste", handlePaste as EventListener);
    return {
        destroy() {
            node.removeEventListener("paste", handlePaste as EventListener);
        },
    };
}

// touchAction
export function touchAction(node: HTMLElement) {
    function handleTouchMove(event: TouchEvent) {
        const target = event.target as HTMLElement;
        if (
            target &&
            target.closest('.editor-image-button[data-dragging="true"]')
        ) {
            const touch = event.touches[0];
            const scrollThreshold = 120;

            const tiptapEditor = domUtils.querySelector(".tiptap-editor");
            if (tiptapEditor) {
                const editorRect = tiptapEditor.getBoundingClientRect();
                const isNearTop = touch.clientY < editorRect.top + scrollThreshold;
                const isNearBottom =
                    touch.clientY > editorRect.bottom - scrollThreshold;

                if (!isNearTop && !isNearBottom) {
                    event.preventDefault();
                    return false;
                }
            }
        }
    }
    function handleTouchEnd(event: TouchEvent) {
        // ドロップゾーンのクリーンアップ
        const dropZones = domUtils.querySelectorAll(".drop-zone-indicator");
        dropZones.forEach((zone) => {
            zone.classList.remove("drop-zone-hover");
            zone.classList.add("drop-zone-fade-out");
        });
        setTimeout(() => {
            dropZones.forEach((zone) => {
                if (zone.parentNode) {
                    zone.parentNode.removeChild(zone);
                }
            });
        }, 300);
    }
    node.addEventListener("touchmove", handleTouchMove as EventListener);
    node.addEventListener("touchend", handleTouchEnd as EventListener);
    return {
        destroy() {
            node.removeEventListener("touchmove", handleTouchMove as EventListener);
            node.removeEventListener("touchend", handleTouchEnd as EventListener);
        },
    };
}

// keydownAction
export function keydownAction(node: HTMLElement) {
    function handleEditorKeydown(event: KeyboardEvent) {
        if (
            (event.ctrlKey || event.metaKey) &&
            (event.key === "Enter" || event.key === "NumpadEnter")
        ) {
            event.preventDefault();

            // node.__currentEditor 等はコンポーネント側で関数ラッパーとして渡されることがあるため、
            // 関数なら実行して実体を取得する
            const rawCurrentEditor = (node as any).__currentEditor;
            const currentEditor = typeof rawCurrentEditor === 'function' ? rawCurrentEditor() : rawCurrentEditor as TipTapEditor | undefined;

            const rawHasStoredKey = (node as any).__hasStoredKey;
            const hasStoredKey = typeof rawHasStoredKey === 'function' ? rawHasStoredKey() : rawHasStoredKey as boolean | undefined;

            const rawPostStatus = (node as any).__postStatus;
            const postStatus = typeof rawPostStatus === 'function' ? rawPostStatus() : rawPostStatus as { sending: boolean } | undefined;

            const content = currentEditor ? extractContentWithImages(currentEditor) : "";
            if (!postStatus?.sending && content.trim() && hasStoredKey) {
                (node as any).__submitPost?.();
            }
        }
    }
    node.addEventListener("keydown", handleEditorKeydown);
    return {
        destroy() {
            node.removeEventListener("keydown", handleEditorKeydown);
        },
    };
}

// ドキュメント内に画像ノードが存在するか判定
export function hasImageInDoc(doc: PMNode | undefined | null): boolean {
    let found = false;
    doc?.descendants((node: PMNode) => {
        if ((node as any).type?.name === "image") found = true;
    });
    return found;
}

// ドキュメント内に動画ノードが存在するか判定
export function hasVideoInDoc(doc: PMNode | undefined | null): boolean {
    let found = false;
    doc?.descendants((node: PMNode) => {
        if ((node as any).type?.name === "video") found = true;
    });
    return found;
}

// ドキュメント内に画像または動画ノードが存在するか判定
export function hasMediaInDoc(doc: PMNode | undefined | null): boolean {
    return hasImageInDoc(doc) || hasVideoInDoc(doc);
}

// --- イベントリスナーのセットアップとクリーンアップ ---
export function setupEventListeners(params: SetupEventListenersParams): EditorEventHandlers {
    const { currentEditor, editorContainerEl, callbacks } = params;

    const handleContentUpdate = (event: Event) => {
        const customEvent = event as CustomEvent<{ plainText: string }>;
        const plainText = customEvent.detail.plainText;
        const hasMedia = currentEditor
            ? hasMediaInDoc(currentEditor.state?.doc as PMNode | undefined)
            : false;
        callbacks.onContentUpdate?.(plainText, hasMedia);
    };

    const handleImageFullscreenRequest = (event: Event) => {
        const customEvent = event as CustomEvent<{ src: string; alt?: string }>;
        callbacks.onImageFullscreenRequest?.(
            customEvent.detail.src,
            customEvent.detail.alt || ""
        );
    };

    const handleSelectImageNode = (event: Event) => {
        const customEvent = event as CustomEvent<{ pos: number }>;
        const pos = customEvent?.detail?.pos;
        if (pos == null) return;
        if (!currentEditor || !currentEditor.view) return;

        try {
            if (!("ontouchstart" in window || navigator.maxTouchPoints > 0)) {
                currentEditor.view.focus();
            }
            const sel = NodeSelection.create(currentEditor.state.doc, pos);
            currentEditor.view.dispatch(
                currentEditor.state.tr.setSelection(sel).scrollIntoView()
            );
        } catch (err) {
            console.warn("select-image-node handler failed:", err);
        }

        callbacks.onSelectImageNode?.(pos);
    };

    // イベントリスナーを登録
    window.addEventListener("editor-content-changed", handleContentUpdate);
    window.addEventListener("image-fullscreen-request", handleImageFullscreenRequest);
    window.addEventListener("select-image-node", handleSelectImageNode);

    if (editorContainerEl) {
        editorContainerEl.addEventListener("image-fullscreen-request", handleImageFullscreenRequest);
        editorContainerEl.addEventListener("select-image-node", handleSelectImageNode);
    }

    return {
        handleContentUpdate: handleContentUpdate as EventListener,
        handleImageFullscreenRequest: handleImageFullscreenRequest as EventListener,
        handleSelectImageNode: handleSelectImageNode as EventListener,
    };
}

export function cleanupEventListeners(
    handlers: EditorEventHandlers,
    editorContainerEl: HTMLElement | null
): void {
    window.removeEventListener("editor-content-changed", handlers.handleContentUpdate);
    window.removeEventListener("image-fullscreen-request", handlers.handleImageFullscreenRequest);
    window.removeEventListener("select-image-node", handlers.handleSelectImageNode);

    if (editorContainerEl) {
        editorContainerEl.removeEventListener("image-fullscreen-request", handlers.handleImageFullscreenRequest);
        editorContainerEl.removeEventListener("select-image-node", handlers.handleSelectImageNode);
    }
}

// --- Android Gboard対応処理 ---
export function setupGboardHandler(params: GboardHandlerParams): () => void {
    const { editorContainerEl, getCurrentEditor, processPastedText: processFn } = params;

    let lastContent = "";
    let isProcessingPaste = false;

    // 初期コンテンツを取得
    const editor = getCurrentEditor();
    if (editor) {
        lastContent = editor.getText();
    }

    const handleInput = () => {
        if (isProcessingPaste) return;

        const currentEditor = getCurrentEditor();
        if (!currentEditor) return;

        const currentContent = currentEditor.getText();
        const addedLength = currentContent.length - lastContent.length;

        if (addedLength > 10 && currentContent.length > lastContent.length) {
            const addedText = currentContent.substring(lastContent.length);

            if (addedText.includes("\n")) {
                isProcessingPaste = true;

                currentEditor.chain().focus().clearContent().run();

                setTimeout(() => {
                    const editor = getCurrentEditor();
                    if (editor) {
                        const cleanedText = addedText.replace(/\n\n/g, "\n");
                        processFn(editor, cleanedText);
                    }
                    isProcessingPaste = false;

                    setTimeout(() => {
                        const editor = getCurrentEditor();
                        if (editor) {
                            lastContent = editor.getText();
                        }
                    }, 100);
                }, 10);

                return;
            }
        }

        lastContent = currentContent;
    };

    editorContainerEl.addEventListener("input", handleInput);

    return () => {
        editorContainerEl.removeEventListener("input", handleInput);
    };
}
