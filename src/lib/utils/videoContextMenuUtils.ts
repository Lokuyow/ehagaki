import { _ } from "svelte-i18n";
import { get as getStore } from "svelte/store";
import type { MenuItem } from "../types";
import { calculateContextMenuPosition } from "./appUtils";

/**
 * 動画ノード用のコンテキストメニューアイテムを生成
 */
export function getVideoContextMenuItems(
    src: string,
    getPos: () => number,
    nodeSize: number,
    isSelected: boolean,
    nodeId: string,
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
            label: t("videoContextMenu.copyUrl"),
            action: async () => {
                // 1) 標準Clipboard APIをまず試す
                try {
                    if (navigatorObj?.clipboard && typeof navigatorObj.clipboard.writeText === "function") {
                        await navigatorObj.clipboard.writeText(src);
                        return true;
                    }
                } catch (err) {
                    // フォールバックへ
                }

                // 2) フォールバック: textarea + execCommand('copy')
                try {
                    const doc = (windowObj && (windowObj as any).document) || document;
                    const textarea = doc.createElement("textarea");
                    textarea.value = src;
                    textarea.style.position = "fixed";
                    textarea.style.left = "-9999px";
                    textarea.style.top = "0";
                    textarea.setAttribute("readonly", "true");
                    doc.body.appendChild(textarea);
                    textarea.focus();
                    textarea.select();

                    const successful = doc.execCommand && doc.execCommand("copy");
                    doc.body.removeChild(textarea);

                    if (!successful) {
                        throw new Error("fallback_copy_failed");
                    }
                    return true;
                } catch (error) {
                    console.warn("Failed to copy URL (both clipboard API and fallback failed):", error);
                    throw error;
                }
            },
            src,
            icon: "/icons/copy-solid-full.svg",
        },
        {
            label: t("videoContextMenu.delete"),
            action: () => {
                if (!isSelected) return;
                const view = editorObj?.view;
                if (view?.state && view?.dispatch) {
                    let found = false;
                    interface DescendantNode {
                        type: { name: string };
                        attrs: { id?: string };
                        nodeSize: number;
                    }

                    const targetPos = Number(nodeId);

                    (view.state.doc as {
                        descendants: (
                            callback: (node: DescendantNode, pos: number) => boolean | void
                        ) => void;
                    }).descendants((node: DescendantNode, pos: number) => {
                        if (!found && node.type.name === 'video') {
                            // id属性がある場合はidで照合、ない場合は位置で照合
                            const matchById = node.attrs.id && node.attrs.id === nodeId;
                            const matchByPos = !node.attrs.id && pos === targetPos;
                            
                            if (matchById || matchByPos) {
                                view.dispatch(view.state.tr.delete(pos, pos + node.nodeSize));
                                found = true;
                                return false;
                            }
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

/**
 * ボタン要素の位置に基づいてコンテキストメニューを開く
 */
export function openContextMenuAtButton(
    buttonElement: HTMLButtonElement,
    options?: { windowObj?: Window }
): { x: number; y: number } {
    const windowObj = options?.windowObj ?? window;
    const rect = buttonElement.getBoundingClientRect();
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.bottom + 8;
    
    return calculateContextMenuPosition(targetX, targetY);
}

/**
 * 指定位置でコンテキストメニューを開く
 */
export function openContextMenuAtPosition(position: { x: number; y: number }): { x: number; y: number } {
    return calculateContextMenuPosition(position.x, position.y);
}

/**
 * 動画ノード用のコンテキストメニューを開く
 */
export function openContextMenuForVideoNode(
    globalContextMenuStore: any,
    nodeId: string,
    clickPosition: { x: number; y: number },
    src: string,
    options?: {
        setTimeoutFn?: (fn: (...args: any[]) => void, ms?: number, ...args: any[]) => any
    }
) {
    const setTimeoutFn = options?.setTimeoutFn ?? ((fn: (...args: any[]) => void, ms?: number, ...args: any[]) => {
        return setTimeout(fn as TimerHandler, ms, ...args);
    });
    
    let alreadyOpen = false;
    let prevNodeId: string | undefined;
    
    globalContextMenuStore.update((state: any) => {
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

/**
 * グローバルコンテキストメニューのアイテムと位置を生成
 */
export function prepareGlobalVideoContextMenuItems(
    globalContextMenuState: any,
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
    const pos = Number(nodeId) || 0;
    const node = currentEditor?.state?.doc?.nodeAt(pos);
    const nodeSize = node ? node.nodeSize : 1;
    const isSelected = true;

    const items = getVideoContextMenuItems(
        src,
        () => pos,
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
