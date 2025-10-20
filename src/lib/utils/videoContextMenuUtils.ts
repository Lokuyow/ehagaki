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
        videoElement?: HTMLVideoElement;
        t?: typeof _;
    }
): MenuItem[] {
    const windowObj = options?.windowObj ?? window;
    const navigatorObj = options?.navigatorObj ?? navigator;
    const editorObj = options?.editorObj ?? (window as any).__currentEditor;
    const videoElement = options?.videoElement;
    const tRaw = options?.t ?? _;
    const t = typeof tRaw === "function" ? tRaw : getStore(tRaw);

    return [
        {
            label: t("videoContextMenu.playPause"),
            action: () => {
                // 実行時にDOM検索でvideo要素を取得（モバイル対応）
                const video = document.querySelector<HTMLVideoElement>(
                    `video[data-node-id="${nodeId}"]`
                );
                if (video) {
                    if (video.paused) {
                        video.play().catch((error) => {
                            console.warn("Failed to play video:", error);
                        });
                    } else {
                        video.pause();
                    }
                } else {
                    console.warn("Video element not found for nodeId:", nodeId);
                }
            },
            src,
            icon: "/icons/play_pause_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg",
        },
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
                    // 変更: ID属性でノードを特定して削除
                    let found = false;
                    interface DescendantNode {
                        type: { name: string };
                        attrs: { id?: string };
                        nodeSize: number;
                    }

                    (view.state.doc as {
                        descendants: (
                            callback: (node: DescendantNode, pos: number) => boolean | void
                        ) => void;
                    }).descendants((node: DescendantNode, pos: number) => {
                        if (!found && node.type.name === 'video' && node.attrs.id === nodeId) {
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
    videoElement?: HTMLVideoElement,
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
        globalContextMenuStore.set({ open: false, nodeId: undefined, src: undefined, videoElement: undefined });
        setTimeoutFn(() => {
            globalContextMenuStore.set({ open: true, nodeId, src, videoElement });
        }, 0);
        return;
    }

    globalContextMenuStore.set({ open: true, nodeId, src, videoElement });
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
    const videoElement = globalContextMenuState.videoElement;
    
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

    const items = getVideoContextMenuItems(
        src,
        () => nodePos,
        nodeSize,
        isSelected,
        nodeId,
        {
            windowObj: options?.windowObj,
            navigatorObj: options?.navigatorObj,
            editorObj: currentEditor,
            videoElement,
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
