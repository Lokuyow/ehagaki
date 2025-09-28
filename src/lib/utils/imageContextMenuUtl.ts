import { _ } from "svelte-i18n";
import { get as getStore } from "svelte/store";
import type { MenuItem, ImageContextMenuStore, ImageContextMenuState } from "../types";
import { calculateContextMenuPosition } from "./appUtils";

export function getImageContextMenuItems(
    src: string,
    alt: string,
    getPos: () => number,
    nodeSize: number,
    isSelected: boolean,
): MenuItem[] {
    return [
        {
            label: getStore(_)("imageContextMenu.fullscreen"),
            action: () => {
                // 全画面表示イベント発火
                window.dispatchEvent(
                    new CustomEvent("image-fullscreen-request", {
                        detail: { src, alt },
                    }),
                );
            },
            src, // 画像URLをMenuItemに追加
            icon: "/icons/expand-solid-full.svg", // アイコン追加
        },
        {
            label: getStore(_)("imageContextMenu.copyUrl"),
            action: async () => {
                try {
                    await navigator.clipboard.writeText(src);
                } catch (error) {
                    console.warn("Failed to copy URL:", error);
                }
            },
            src,
            icon: "/icons/copy-solid-full.svg", // アイコン追加
        },
        {
            label: getStore(_)("imageContextMenu.delete"),
            action: () => {
                if (!isSelected) return;
                // 画像ノード削除（選択ノードのみ）
                const editor = (window as any).__currentEditor;
                const view = editor?.view;
                if (view?.state && view?.dispatch) {
                    const pos = getPos();
                    // ノードサイズが正しいか確認
                    view.dispatch(view.state.tr.delete(pos, pos + nodeSize));
                    // 追加のfocus/blurは不要
                }
            },
            disabled: !isSelected,
            src,
            icon: "/icons/trash-solid-full.svg", // アイコン追加
        },
    ];
}

/**
 * ボタン要素からコンテキストメニューを開く位置を計算
 */
export function openContextMenuAtButton(buttonElement: HTMLButtonElement): { x: number; y: number } {
    const rect = buttonElement.getBoundingClientRect();
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.bottom + 8;
    return calculateContextMenuPosition(targetX, targetY);
}

/**
 * 指定位置からコンテキストメニューを開く位置を計算
 */
export function openContextMenuAtPosition(position: { x: number; y: number }): { x: number; y: number } {
    return calculateContextMenuPosition(position.x, position.y);
}

/**
 * コンテキストメニューを閉じる（ユーティリティとしてコールバックを返す）
 * グローバルストアも閉じるのは呼び出し側で対応
 */
export function createCloseContextMenuHandler(setShowContextMenu: (value: boolean) => void): () => void {
    return () => {
        setShowContextMenu(false);
    };
}

/**
 * 画像ノード用コンテキストメニューをグローバルストアと連携して開く
 * - ノードID管理
 * - 既存メニューが他ノードで開いていれば閉じてから開く
 * - 位置計算も含む
 */
export function openContextMenuForImageNode(
    globalContextMenuStore: ImageContextMenuStore,
    nodeId: string,
    clickPosition: { x: number; y: number },
    setShowContextMenu: (value: boolean) => void,
    setContextMenuX: (value: number) => void,
    setContextMenuY: (value: number) => void,
) {
    let alreadyOpen = false;
    let prevNodeId: string | undefined;
    globalContextMenuStore.update((state: ImageContextMenuState) => {
        alreadyOpen = state.open && state.nodeId !== nodeId;
        prevNodeId = state.nodeId;
        return state;
    });
    if (alreadyOpen && prevNodeId) {
        // 他ノードのメニューを閉じる
        globalContextMenuStore.set({ open: false, nodeId: undefined });
        // 少し待ってから自分のメニューを開く（DOM更新のため）
        setTimeout(() => {
            const pos = calculateContextMenuPosition(clickPosition.x, clickPosition.y);
            setContextMenuX(pos.x);
            setContextMenuY(pos.y);
            setShowContextMenu(true);
            globalContextMenuStore.set({ open: true, nodeId });
        }, 0);
        return;
    }
    // 通常通り開く
    const pos = calculateContextMenuPosition(clickPosition.x, clickPosition.y);
    setContextMenuX(pos.x);
    setContextMenuY(pos.y);
    setShowContextMenu(true);
    globalContextMenuStore.set({ open: true, nodeId });
}
