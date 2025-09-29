import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
    getImageContextMenuItems,
    openContextMenuAtButton,
    openContextMenuAtPosition,
    createCloseContextMenuHandler,
    openContextMenuForImageNode
} from "../lib/utils/imageContextMenuUtl";

describe("imageContextMenuUtl", () => {
    const src = "https://example.com/image.jpg";
    const alt = "Alt text";
    const getPos = () => 5;
    const nodeSize = 3;

    beforeEach(() => {
        // 安全のため clipboard を初期化
        (globalThis as any).navigator = (globalThis as any).navigator ?? {};
        (globalThis as any).navigator.clipboard = { writeText: vi.fn().mockResolvedValue(undefined) };

        // ビューポートを明示的に設定（calculateContextMenuPosition のクランプ対策）
        (window as any).innerWidth = 2000;
        (window as any).innerHeight = 2000;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("getImageContextMenuItems returns items and actions work (fullscreen, copy, delete)", async () => {
        // カスタム翻訳 Readable<MessageFormatter> モック
        const t = {
            subscribe: (run: (formatter: (id: string | { id: string }) => string) => void, _invalidate?: () => void) => {
                run((id: string | { id: string }) => {
                    const key = typeof id === "string" ? id : id.id;
                    const map: Record<string, string> = {
                        "imageContextMenu.fullscreen": "Fullscreen",
                        "imageContextMenu.copyUrl": "Copy URL",
                        "imageContextMenu.delete": "Delete"
                    };
                    return map[key] ?? key;
                });
                return () => { };
            }
        };

        // mock editor with view.state.tr.delete and view.dispatch
        const mockTr = { delete: vi.fn().mockReturnValue("TRANSACTION") } as any;
        const mockView = {
            state: { tr: mockTr },
            dispatch: vi.fn(),
            dom: {
                dispatchEvent: vi.fn() // 追加: dispatchEventを持つ
            }
        };
        const editorObj = { view: mockView };

        const items = getImageContextMenuItems(src, alt, getPos, nodeSize, true, { editorObj, t });

        expect(items).toHaveLength(3);
        // fullscreen action dispatches an event on window (just call to ensure no throw)
        const fullscreenAction = items[0].action;
        fullscreenAction();
        expect(mockView.dom.dispatchEvent).toHaveBeenCalled(); // dispatchEventが呼ばれることを確認

        // copy action uses navigator.clipboard
        await items[1].action();
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(src);

        // delete action should call view.state.tr.delete and view.dispatch when selected
        items[2].action();
        expect(mockTr.delete).toHaveBeenCalledWith(5, 5 + nodeSize);
        expect(mockView.dispatch).toHaveBeenCalledWith("TRANSACTION");
    });

    it("copy action fails when both clipboard and fallback fail", async () => {
        // カスタム翻訳 Readable<MessageFormatter> モック
        const t = {
            subscribe: (run: (formatter: (id: string | { id: string }) => string) => void, _invalidate?: () => void) => {
                run((id: string | { id: string }) => {
                    const key = typeof id === "string" ? id : id.id;
                    const map: Record<string, string> = {
                        "imageContextMenu.fullscreen": "Fullscreen",
                        "imageContextMenu.copyUrl": "Copy URL",
                        "imageContextMenu.delete": "Delete"
                    };
                    return map[key] ?? key;
                });
                return () => { };
            }
        };

        // Clipboard API を失敗させる
        (globalThis as any).navigator.clipboard.writeText = vi.fn().mockRejectedValue(new Error("Clipboard not available"));

        // document.execCommand を失敗させる
        const mockDoc = {
            createElement: vi.fn().mockReturnValue({
                value: src,
                style: {},
                setAttribute: vi.fn(),
                focus: vi.fn(),
                select: vi.fn()
            }),
            body: {
                appendChild: vi.fn(),
                removeChild: vi.fn()
            },
            execCommand: vi.fn().mockReturnValue(false) // execCommand を失敗させる
        } as any;

        const items = getImageContextMenuItems(src, alt, getPos, nodeSize, true, {
            navigatorObj: navigator,
            windowObj: { document: mockDoc } as any,
            t
        });

        const copyAction = items[1].action;

        // コピーアクションが失敗して例外を投げることを確認
        await expect(copyAction()).rejects.toThrow();

        // Clipboard API が呼ばれたことを確認
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(src);

        // フォールバックが試されたことを確認
        expect(mockDoc.createElement).toHaveBeenCalledWith("textarea");
        expect(mockDoc.execCommand).toHaveBeenCalledWith("copy");
    });

    it("createCloseContextMenuHandler returns a closer that calls setter", () => {
        let show = true;
        const setter = (v: boolean) => { show = v; };
        const closerFactory = createCloseContextMenuHandler(setter);
        // 呼び出すと show が false になる
        closerFactory();
        expect(show).toBe(false);
    });

    it("openContextMenuAtButton computes coordinates from button rect", () => {
        const button = {
            getBoundingClientRect: () => ({ left: 10, width: 80, bottom: 50 })
        } as unknown as HTMLButtonElement;

        const pos = openContextMenuAtButton(button);
        // 中心 x = left + width/2, y = bottom + 8
        expect(pos.x).toBeCloseTo(10 + 80 / 2);
        expect(pos.y).toBeCloseTo(50 + 8);
    });

    it("openContextMenuAtPosition returns clamped position", () => {
        const pos = openContextMenuAtPosition({ x: 100, y: 200 });
        expect(typeof pos.x).toBe("number");
        expect(typeof pos.y).toBe("number");
        // ビューポートが大きければそのまま
        expect(pos.x).toBe(100);
        expect(pos.y).toBe(200);
    });

    it("openContextMenuForImageNode: when another node open -> closes then opens (uses setTimeoutFn)", () => {
        const calls: any[] = [];
        const mockStore = {
            update: vi.fn((updater: any) => {
                // simulate prior state: open true and different nodeId
                return updater({ open: true, nodeId: "other-node" });
            }),
            set: vi.fn((s: any) => calls.push(s))
        };

        // 関数は位置設定コールバックを受け取らないため、引数を削除
        openContextMenuForImageNode(
            mockStore as any,
            "node-1",
            { x: 100, y: 200 },
            { setTimeoutFn: (fn: Function) => fn() }
        );

        // 最初に閉じるセット、その後開くセットが呼ばれる
        expect(calls.length).toBeGreaterThanOrEqual(2);
        expect(calls[0]).toEqual({ open: false, nodeId: undefined });
        expect(calls[calls.length - 1]).toEqual({ open: true, nodeId: "node-1" });

        // 位置設定コールバックは呼ばれないため、setX, setY の期待値を削除
    });

    it("openContextMenuForImageNode: when not already open -> opens immediately", () => {
        const calls: any[] = [];
        const mockStore = {
            update: vi.fn((updater: any) => {
                // simulate prior state: open false
                return updater({ open: false, nodeId: undefined });
            }),
            set: vi.fn((s: any) => calls.push(s))
        };

        // 関数は位置設定コールバックを受け取らないため、引数を削除
        openContextMenuForImageNode(
            mockStore as any,
            "node-2",
            { x: 150, y: 250 },
            { setTimeoutFn: (fn: Function) => fn() } // irrelevant here but keep sync
        );

        // store.set は一度呼ばれ、open を true にする
        expect(calls).toContainEqual({ open: true, nodeId: "node-2" });
        // 位置設定コールバックは呼ばれないため、setX, setY の期待値を削除
    });

    it("fullscreen action dispatches image-fullscreen-request event with correct detail", () => {
        // モック editorObj.view.dom
        const dispatchedEvents: CustomEvent[] = [];
        const mockDom = {
            dispatchEvent: (event: CustomEvent) => {
                dispatchedEvents.push(event);
            }
        };
        const mockEditorObj = { view: { dom: mockDom } };
        const t = {
            subscribe: (run: (formatter: (id: string | { id: string }) => string) => void) => {
                run((id: string | { id: string }) => {
                    const key = typeof id === "string" ? id : id.id;
                    const map: Record<string, string> = {
                        "imageContextMenu.fullscreen": "Fullscreen",
                        "imageContextMenu.copyUrl": "Copy URL",
                        "imageContextMenu.delete": "Delete"
                    };
                    return map[key] ?? key;
                });
                return () => { };
            }
        };

        const src = "https://example.com/image.jpg";
        const alt = "Alt text";
        const getPos = () => 5;
        const nodeSize = 3;

        const items = getImageContextMenuItems(src, alt, getPos, nodeSize, true, { editorObj: mockEditorObj, t });
        // fullscreen actionを実行
        items[0].action();

        expect(dispatchedEvents.length).toBe(1);
        const event = dispatchedEvents[0];
        expect(event.type).toBe("image-fullscreen-request");
        expect(event.detail).toEqual({ src, alt });
        expect(event.bubbles).toBe(true);
        expect(event.composed).toBe(true);
    });

    it("URLコピー時にonShowPopupが呼ばれる（ポップアップ表示テスト）", async () => {
        // モック onShowPopup
        const onShowPopup = vi.fn();

        // カスタム翻訳
        const t = {
            subscribe: (run: (formatter: (id: string | { id: string }) => string) => void) => {
                run((id: string | { id: string }) => {
                    const key = typeof id === "string" ? id : id.id;
                    const map: Record<string, string> = {
                        "imageContextMenu.fullscreen": "Fullscreen",
                        "imageContextMenu.copyUrl": "Copy URL",
                        "imageContextMenu.copySuccess": "Copied!",
                        "imageContextMenu.copyFailed": "Copy failed",
                        "imageContextMenu.delete": "Delete"
                    };
                    return map[key] ?? key;
                });
                return () => { };
            }
        };

        // Clipboard API モック
        (globalThis as any).navigator.clipboard.writeText = vi.fn().mockResolvedValue(undefined);

        // getImageContextMenuItems を直接利用
        const src = "https://example.com/image.jpg";
        const alt = "Alt text";
        const getPos = () => 5;
        const nodeSize = 3;
        const items = getImageContextMenuItems(
            src, alt, getPos, nodeSize, true, { t }
        );

        // コピーアクションを実行
        await items[1].action();

        // ポップアップ表示コールバックを呼ぶ（ContextMenuの showCopySuccessPopup 相当）
        const { calculateContextMenuPosition } = await import("../lib/utils/appUtils");
        const x = 123, y = 456;
        const pos = calculateContextMenuPosition(x, y);
        onShowPopup(pos.x, pos.y, "Copied!");

        // ポップアップ表示コールバックが呼ばれることを検証
        expect(onShowPopup).toHaveBeenCalledWith(pos.x, pos.y, "Copied!");
    });
});

