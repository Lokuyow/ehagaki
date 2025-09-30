import { _ } from "svelte-i18n";
import { get as getStore } from "svelte/store";
import type { MenuItem, ImageContextMenuStore, ImageContextMenuState } from "../types";
import { calculateContextMenuPosition } from "./appUtils";

// getImageContextMenuItems: 依存関係を引数で注入可能に
export function getImageContextMenuItems(
    src: string,
    alt: string,
    getPos: () => number,
    nodeSize: number,
    isSelected: boolean,
    options?: {
        windowObj?: Window;
        navigatorObj?: Navigator;
        editorObj?: any;
        t?: typeof _;
    }
): MenuItem[] {
    const windowObj = options?.windowObj ?? window;
    const navigatorObj = options?.navigatorObj ?? navigator;
    const editorObj = options?.editorObj ?? (window as any).__currentEditor;
    const tRaw = options?.t ?? _;
    const t = typeof tRaw === "function" ? tRaw : getStore(tRaw);
    if (import.meta.env.MODE === "development") {
        console.log("[dev] getImageContextMenuItems", { src, alt, nodeSize, isSelected });
    }

    return [
        {
            label: t("imageContextMenu.fullscreen"),
            action: () => {
                if (import.meta.env.MODE === "development") {
                    console.log("[dev] imageContextMenu.fullscreen action", { src, alt });
                }
                // 変更: dispatchEventがなければwindowにフォールバック
                let target =
                    editorObj?.view?.dom ||
                    document.querySelector(".editor-container") ||
                    windowObj;
                if (typeof target.dispatchEvent !== "function") {
                    target = window;
                }
                target.dispatchEvent(
                    new CustomEvent("image-fullscreen-request", {
                        detail: { src, alt },
                        bubbles: true,
                        composed: true,
                    }),
                );
            },
            src,
            icon: "/icons/expand-solid-full.svg",
        },
        {
            label: t("imageContextMenu.copyUrl"),
            // 変更: 失敗時は例外を投げる（ContextMenuの try/catch で検知してポップアップ表示制御するため）
            action: async () => {
                if (import.meta.env.MODE === "development") {
                    console.log("[dev] imageContextMenu.copyUrl action", { src });
                }

                // 1) 標準Clipboard APIをまず試す
                try {
                    if (navigatorObj?.clipboard && typeof navigatorObj.clipboard.writeText === "function") {
                        await navigatorObj.clipboard.writeText(src);
                        return true;
                    }
                } catch (err) {
                    // 明示的に続行してフォールバックへ（最終的に失敗なら throw する）
                    if (import.meta.env.MODE === "development") {
                        console.warn("[dev] clipboard.writeText failed, trying fallback:", err);
                    }
                }

                // 2) フォールバック: textarea + execCommand('copy')
                try {
                    const doc = (windowObj && (windowObj as any).document) || document;
                    const textarea = doc.createElement("textarea");
                    textarea.value = src;
                    // ページ表示を汚さないため off-screen に配置
                    textarea.style.position = "fixed";
                    textarea.style.left = "-9999px";
                    textarea.style.top = "0";
                    textarea.setAttribute("readonly", "true");
                    doc.body.appendChild(textarea);
                    textarea.focus();
                    textarea.select();

                    // execCommandの戻りを確認
                    const successful = doc.execCommand && doc.execCommand("copy");
                    doc.body.removeChild(textarea);

                    if (!successful) {
                        throw new Error("fallback_copy_failed");
                    }
                    return true;
                } catch (error) {
                    // ここで失敗を握りつぶさず伝播させる
                    console.warn("Failed to copy URL (both clipboard API and fallback failed):", error);
                    throw error;
                }
            },
            src,
            icon: "/icons/copy-solid-full.svg",
        },
        {
            label: t("imageContextMenu.delete"),
            action: () => {
                if (!isSelected) return;
                const view = editorObj?.view;
                if (view?.state && view?.dispatch) {
                    const pos = getPos();
                    view.dispatch(view.state.tr.delete(pos, pos + nodeSize));
                }
            },
            disabled: !isSelected,
            src,
            icon: "/icons/trash-solid-full.svg",
        },
    ];
}

// openContextMenuAtButton: window依存を引数化
export function openContextMenuAtButton(
    buttonElement: HTMLButtonElement,
    options?: { windowObj?: Window }
): { x: number; y: number } {
    const windowObj = options?.windowObj ?? window;
    const rect = buttonElement.getBoundingClientRect();
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.bottom + 8;
    if (import.meta.env.MODE === "development") {
        console.log("[dev] openContextMenuAtButton rect, target", { rect, targetX, targetY });
    }
    return calculateContextMenuPosition(targetX, targetY);
}

// openContextMenuAtPosition: そのまま
export function openContextMenuAtPosition(position: { x: number; y: number }): { x: number; y: number } {
    return calculateContextMenuPosition(position.x, position.y);
}

// createCloseContextMenuHandler: 副作用なし
export function createCloseContextMenuHandler(setShowContextMenu: (value: boolean) => void): () => void {
    return () => {
        setShowContextMenu(false);
    };
}

// openContextMenuForImageNode: 位置設定コールバックを削除し、ストアのみ更新
export function openContextMenuForImageNode(
    globalContextMenuStore: ImageContextMenuStore,
    nodeId: string,
    clickPosition: { x: number; y: number },
    src: string,  // 追加: srcパラメータ
    options?: {
        setTimeoutFn?: (fn: (...args: any[]) => void, ms?: number, ...args: any[]) => any
    }
) {
    if (import.meta.env.MODE === "development") {
        console.log("[dev] openContextMenuForImageNode called", { nodeId, clickPosition, src });
    }
    const setTimeoutFn = options?.setTimeoutFn ?? ((fn: (...args: any[]) => void, ms?: number, ...args: any[]) => {
        return setTimeout(fn as TimerHandler, ms, ...args);
    });
    let alreadyOpen = false;
    let prevNodeId: string | undefined;
    globalContextMenuStore.update((state: ImageContextMenuState) => {
        alreadyOpen = state.open && state.nodeId !== nodeId;
        prevNodeId = state.nodeId;
        return state;
    });
    if (alreadyOpen && prevNodeId) {
        globalContextMenuStore.set({ open: false, nodeId: undefined, src: undefined });
        setTimeoutFn(() => {
            globalContextMenuStore.set({ open: true, nodeId, src });
        }, 0);
        return;
    }
    globalContextMenuStore.set({ open: true, nodeId, src });
}
