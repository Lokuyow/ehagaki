import { _ } from "svelte-i18n";
import { get as getStore } from "svelte/store";
import type { MenuItem, ImageContextMenuStore, ImageContextMenuState } from "../types";
import { calculateContextMenuPosition } from "./appUtils";
import { copyToClipboard } from "./clipboardUtils";

// getImageContextMenuItems: 依存関係を引数で注入可能に
export function getImageContextMenuItems(
    src: string,
    alt: string,
    getPos: () => number,
    nodeSize: number,
    isSelected: boolean,
    nodeId: string,  // 追加: nodeIdパラメータ
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

                // clipboardUtils.tsのcopyToClipboard関数を使用
                copyToClipboard(src, "image URL", navigatorObj, windowObj);
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
                    // 変更: ID属性でノードを特定して削除
                    let found = false;
                    interface DescendantNode {
                        type: { name: string };
                        attrs: { id: string };
                        nodeSize: number;
                    }

                    (view.state.doc as {
                        descendants: (
                            callback: (node: DescendantNode, pos: number) => boolean | void
                        ) => void;
                    }).descendants((node: DescendantNode, pos: number) => {
                        if (!found && node.type.name === 'image' && node.attrs.id === nodeId) {
                            view.dispatch(view.state.tr.delete(pos, pos + node.nodeSize));
                            found = true;
                            return false; // 走査停止
                        }
                    });
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

// prepareGlobalContextMenuItems: グローバルコンテキストメニューのアイテムと位置を生成
export function prepareGlobalContextMenuItems(
    globalContextMenuState: ImageContextMenuState,
    currentEditor: any,
    lastClickPosition: { x: number; y: number } | null,
    options?: {
        windowObj?: Window;
        navigatorObj?: Navigator;
        t?: typeof _;
    }
): { items: MenuItem[]; x: number; y: number } | null {
    if (!globalContextMenuState.open || !globalContextMenuState.nodeId) {
        return null;
    }

    const nodeId = globalContextMenuState.nodeId;
    const src = globalContextMenuState.src || "";
    const alt = "Image";
    
    // nodeIdを使って実際のノードを探す
    let nodePos = 0;
    let nodeSize = 1;
    if (currentEditor?.state?.doc) {
        interface DescendantNode {
            type: { name: string };
            attrs: { id?: string };
            nodeSize: number;
        }
        (currentEditor.state.doc as {
            descendants: (
                callback: (node: DescendantNode, pos: number) => boolean | void
            ) => void;
        }).descendants((node: DescendantNode, pos: number) => {
            if (node.attrs.id === nodeId) {
                nodePos = pos;
                nodeSize = node.nodeSize;
                return false; // 見つかったので走査停止
            }
        });
    }
    
    const isSelected = true;

    const items = getImageContextMenuItems(
        src,
        alt,
        () => nodePos,
        nodeSize,
        isSelected,
        nodeId,
        {
            windowObj: options?.windowObj,
            navigatorObj: options?.navigatorObj,
            editorObj: currentEditor,
            t: options?.t
        }
    );

    let menuPos = { x: 0, y: 0 };
    if (lastClickPosition) {
        menuPos = calculateContextMenuPosition(lastClickPosition.x, lastClickPosition.y);
    }

    return {
        items,
        x: menuPos.x,
        y: menuPos.y
    };
}
