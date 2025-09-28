import { _ } from "svelte-i18n";
import { get as getStore } from "svelte/store";
import type { MenuItem } from "../types";

export function getImageContextMenuItems(
    src: string,
    alt: string,
    getPos: () => number,
    nodeSize: number,
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
                // 画像ノード削除
                const { state, dispatch } =
                    (window as any).__currentEditor?.view || {};
                if (state && dispatch) {
                    const pos = getPos();
                    const tr = state.tr.delete(pos, pos + nodeSize);
                    dispatch(tr);
                }
            },
        },
    ];
}
