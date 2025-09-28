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
                windowObj.dispatchEvent(
                    new CustomEvent("image-fullscreen-request", {
                        detail: { src, alt },
                    }),
                );
            },
            src,
            icon: "/icons/expand-solid-full.svg",
        },
        {
            label: t("imageContextMenu.copyUrl"),
            action: async () => {
                try {
                    if (import.meta.env.MODE === "development") {
                        console.log("[dev] imageContextMenu.copyUrl action", { src });
                    }
                    await navigatorObj.clipboard.writeText(src);
                } catch (error) {
                    // テスト時はconsole.warnを直接利用
                    console.warn("Failed to copy URL:", error);
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

// openContextMenuForImageNode: setTimeout, store依存を引数化
export function openContextMenuForImageNode(
    globalContextMenuStore: ImageContextMenuStore,
    nodeId: string,
    clickPosition: { x: number; y: number },
    setShowContextMenu: (value: boolean) => void,
    setContextMenuX: (value: number) => void,
    setContextMenuY: (value: number) => void,
    options?: {
        // 変更: 厳密な typeof setTimeout を避け、テストから渡される簡易実行関数も受け取れる汎用型にする
        setTimeoutFn?: (fn: (...args: any[]) => void, ms?: number, ...args: any[]) => any
    }
) {
    if (import.meta.env.MODE === "development") {
        console.log("[dev] openContextMenuForImageNode called", { nodeId, clickPosition });
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
        if (import.meta.env.MODE === "development") {
            console.log("[dev] openContextMenuForImageNode already open, closing then reopening", { prevNodeId, nodeId });
        }
        globalContextMenuStore.set({ open: false, nodeId: undefined });
        setTimeoutFn(() => {
            const pos = calculateContextMenuPosition(clickPosition.x, clickPosition.y);
            if (import.meta.env.MODE === "development") {
                console.log("[dev] openContextMenuForImageNode delayed pos", pos);
            }
            setContextMenuX(pos.x);
            setContextMenuY(pos.y);
            setShowContextMenu(true);
            globalContextMenuStore.set({ open: true, nodeId });
        }, 0);
        return;
    }
    const pos = calculateContextMenuPosition(clickPosition.x, clickPosition.y);
    if (import.meta.env.MODE === "development") {
        console.log("[dev] openContextMenuForImageNode immediate pos", pos);
    }
    setContextMenuX(pos.x);
    setContextMenuY(pos.y);
    setShowContextMenu(true);
    globalContextMenuStore.set({ open: true, nodeId });
}
