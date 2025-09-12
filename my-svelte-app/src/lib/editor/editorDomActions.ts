import { extractContentWithImages } from "./editorUtils";
import type { Editor as TipTapEditor } from "@tiptap/core";

// fileDropAction
export function fileDropAction(node: HTMLElement) {
    let dragOver = false;
    function handleDragOver(event: DragEvent) {
        event.preventDefault();
        const dt = event.dataTransfer;
        const isInternalDrag =
            !!dt &&
            Array.from(dt.types || []).some(
                (t) => t === "application/x-tiptap-node",
            );
        if (!isInternalDrag) {
            dragOver = true;
            node.classList.add("drag-over");
        } else {
            dragOver = false;
            node.classList.remove("drag-over");
        }
    }
    function handleDragLeave(event: DragEvent) {
        event.preventDefault();
        const dt = event.dataTransfer;
        const isInternalDrag =
            !!dt &&
            Array.from(dt.types || []).some(
                (t) => t === "application/x-tiptap-node",
            );
        if (!isInternalDrag) {
            dragOver = false;
            node.classList.remove("drag-over");
        }
    }
    async function handleDrop(event: DragEvent) {
        event.preventDefault();
        dragOver = false;
        node.classList.remove("drag-over");
        const dragData = event.dataTransfer?.getData("application/x-tiptap-node");
        if (dragData) return;
        if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
            // node.__uploadFilesが関数なら呼び出す
            if (typeof (node as any).__uploadFiles === "function") {
                (node as any).__uploadFiles(event.dataTransfer.files);
            }
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

// pasteAction
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

            const tiptapEditor = document.querySelector(
                ".tiptap-editor",
            ) as HTMLElement;
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
        const dropZones = document.querySelectorAll(".drop-zone-indicator");
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
            const currentEditor = (node as any).__currentEditor as TipTapEditor | undefined;
            const hasStoredKey = (node as any).__hasStoredKey as boolean | undefined;
            const postStatus = (node as any).__postStatus as { sending: boolean } | undefined;
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
