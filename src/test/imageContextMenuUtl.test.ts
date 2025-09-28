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
            dispatch: vi.fn()
        };
        const editorObj = { view: mockView };

        const items = getImageContextMenuItems(src, alt, getPos, nodeSize, true, { editorObj, t });

        expect(items).toHaveLength(3);
        // fullscreen action dispatches an event on window (just call to ensure no throw)
        const fullscreenAction = items[0].action;
        fullscreenAction();
        // copy action uses navigator.clipboard
        await items[1].action();
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(src);

        // delete action should call view.state.tr.delete and view.dispatch when selected
        items[2].action();
        expect(mockTr.delete).toHaveBeenCalledWith(5, 5 + nodeSize);
        expect(mockView.dispatch).toHaveBeenCalledWith("TRANSACTION");
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

        const setShow = vi.fn();
        const setX = vi.fn();
        const setY = vi.fn();

        // immediate execution for setTimeout
        openContextMenuForImageNode(
            mockStore as any,
            "node-1",
            { x: 100, y: 200 },
            setShow,
            setX,
            setY,
            { setTimeoutFn: (fn: Function) => fn() }
        );

        // 最初に閉じるセット、その後開くセットが呼ばれる
        expect(calls.length).toBeGreaterThanOrEqual(2);
        expect(calls[0]).toEqual({ open: false, nodeId: undefined });
        expect(calls[calls.length - 1]).toEqual({ open: true, nodeId: "node-1" });

        // 位置設定と表示フラグも呼ばれる
        expect(setX).toHaveBeenCalledWith(100);
        expect(setY).toHaveBeenCalledWith(200);
        expect(setShow).toHaveBeenCalledWith(true);
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

        const setShow = vi.fn();
        const setX = vi.fn();
        const setY = vi.fn();

        openContextMenuForImageNode(
            mockStore as any,
            "node-2",
            { x: 150, y: 250 },
            setShow,
            setX,
            setY,
            { setTimeoutFn: (fn: Function) => fn() } // irrelevant here but keep sync
        );

        // store.set は一度呼ばれ、open を true にする
        expect(calls).toContainEqual({ open: true, nodeId: "node-2" });
        expect(setX).toHaveBeenCalledWith(150);
        expect(setY).toHaveBeenCalledWith(250);
        expect(setShow).toHaveBeenCalledWith(true);
    });
});

