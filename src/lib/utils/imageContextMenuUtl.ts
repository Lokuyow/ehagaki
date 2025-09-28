import { _ } from "svelte-i18n";
import { get as getStore } from "svelte/store";
import type { MenuItem } from "../types";
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
