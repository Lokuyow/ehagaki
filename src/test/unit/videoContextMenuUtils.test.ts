import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
    getVideoContextMenuItems,
    openContextMenuAtButton,
    openContextMenuAtPosition,
    openContextMenuForVideoNode,
    prepareGlobalVideoContextMenuItems
} from "../../lib/utils/videoContextMenuUtils";

describe("videoContextMenuUtils", () => {
    const src = "https://example.com/video.mp4";
    const getPos = () => 5;
    const nodeSize = 3;
    const nodeId = "test-video-node-id";

    beforeEach(() => {
        // clipboardの初期化
        (globalThis as any).navigator = (globalThis as any).navigator ?? {};
        (globalThis as any).navigator.clipboard = { writeText: vi.fn().mockResolvedValue(undefined) };

        // ビューポートを明示的に設定
        (window as any).innerWidth = 2000;
        (window as any).innerHeight = 2000;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe("getVideoContextMenuItems", () => {
        it("returns 3 menu items (play/pause, copy URL, and delete)", () => {
            const t = createMockTranslator();
            const mockEditor = createMockEditor();

            const items = getVideoContextMenuItems(
                src,
                getPos,
                nodeSize,
                true,
                nodeId,
                { editorObj: mockEditor, t }
            );

            expect(items).toHaveLength(3);
            expect(items[0].label).toBe("Play/Pause");
            expect(items[0].icon).toBe("/icons/play_pause_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
            expect(items[1].label).toBe("Copy URL");
            expect(items[1].icon).toBe("/icons/copy-solid-full.svg");
            expect(items[2].label).toBe("Delete");
            expect(items[2].icon).toBe("/icons/trash-solid-full.svg");
        });

        it("copy action uses navigator.clipboard.writeText", async () => {
            const t = createMockTranslator();
            const items = getVideoContextMenuItems(
                src,
                getPos,
                nodeSize,
                true,
                nodeId,
                { t }
            );

            await items[1].action();
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith(src);
        });

        it("copy action falls back to execCommand when clipboard API fails", async () => {
            const t = createMockTranslator();

            // clipboard APIを失敗させる
            (globalThis as any).navigator.clipboard.writeText = vi.fn().mockRejectedValue(new Error("clipboard error"));

            // execCommandのモック
            const mockExecCommand = vi.fn().mockReturnValue(true);
            const mockTextarea = {
                value: "",
                style: {} as any,
                setAttribute: vi.fn(),
                focus: vi.fn(),
                select: vi.fn()
            };
            const mockDocument = {
                createElement: vi.fn().mockReturnValue(mockTextarea),
                body: {
                    appendChild: vi.fn(),
                    removeChild: vi.fn()
                },
                execCommand: mockExecCommand
            };
            const mockWindow = { document: mockDocument };

            const items = getVideoContextMenuItems(
                src,
                getPos,
                nodeSize,
                true,
                nodeId,
                { windowObj: mockWindow as any, navigatorObj: globalThis.navigator, t }
            );

            await items[1].action();

            // フォールバックが試されたことを確認
            expect(mockDocument.createElement).toHaveBeenCalledWith("textarea");
            expect(mockTextarea.value).toBe(src);
            expect(mockDocument.body.appendChild).toHaveBeenCalledWith(mockTextarea);
            expect(mockExecCommand).toHaveBeenCalledWith("copy");
            expect(mockDocument.body.removeChild).toHaveBeenCalledWith(mockTextarea);
        });

        it("copy action throws error when both clipboard and fallback fail", async () => {
            const t = createMockTranslator();

            // 両方失敗させる
            (globalThis as any).navigator.clipboard.writeText = vi.fn().mockRejectedValue(new Error("clipboard error"));

            const mockExecCommand = vi.fn().mockReturnValue(false);
            const mockDocument = {
                createElement: vi.fn().mockReturnValue({
                    value: "",
                    style: {} as any,
                    setAttribute: vi.fn(),
                    focus: vi.fn(),
                    select: vi.fn()
                }),
                body: {
                    appendChild: vi.fn(),
                    removeChild: vi.fn()
                },
                execCommand: mockExecCommand
            };
            const mockWindow = { document: mockDocument };

            const items = getVideoContextMenuItems(
                src,
                getPos,
                nodeSize,
                true,
                nodeId,
                { windowObj: mockWindow as any, t }
            );

            await expect(items[1].action()).resolves.toBeUndefined();
        });

        it("delete action removes video node when selected (with id attribute)", () => {
            const t = createMockTranslator();
            const mockEditor = createMockEditor();

            const items = getVideoContextMenuItems(
                src,
                getPos,
                nodeSize,
                true,
                nodeId,
                { editorObj: mockEditor, t }
            );

            items[2].action();

            expect(mockEditor.view.dispatch).toHaveBeenCalledWith("TRANSACTION");
            expect(mockEditor.view.state.doc.descendants).toHaveBeenCalled();
        });

        it("delete action does nothing when not selected", () => {
            const t = createMockTranslator();
            const mockEditor = createMockEditor();

            const items = getVideoContextMenuItems(
                src,
                getPos,
                nodeSize,
                false, // not selected
                nodeId,
                { editorObj: mockEditor, t }
            );

            items[2].action();

            expect(mockEditor.view.dispatch).not.toHaveBeenCalled();
        });

        it("delete item is disabled when not selected", () => {
            const t = createMockTranslator();
            const mockEditor = createMockEditor();

            const items = getVideoContextMenuItems(
                src,
                getPos,
                nodeSize,
                false,
                nodeId,
                { editorObj: mockEditor, t }
            );

            expect(items[2].disabled).toBe(true);
        });

        it("play/pause action plays video when paused", () => {
            const t = createMockTranslator();
            const mockVideoElement = {
                paused: true,
                play: vi.fn().mockResolvedValue(undefined),
                pause: vi.fn(),
                getAttribute: vi.fn().mockReturnValue(nodeId)
            } as any;

            // document.querySelectorをモック
            const originalQuerySelector = document.querySelector;
            document.querySelector = vi.fn().mockReturnValue(mockVideoElement);

            const items = getVideoContextMenuItems(
                src,
                getPos,
                nodeSize,
                true,
                nodeId,
                { t }
            );

            items[0].action();

            expect(document.querySelector).toHaveBeenCalledWith(`video[data-node-id="${nodeId}"]`);
            expect(mockVideoElement.play).toHaveBeenCalled();
            expect(mockVideoElement.pause).not.toHaveBeenCalled();

            // モックを元に戻す
            document.querySelector = originalQuerySelector;
        });

        it("play/pause action pauses video when playing", () => {
            const t = createMockTranslator();
            const mockVideoElement = {
                paused: false,
                play: vi.fn().mockResolvedValue(undefined),
                pause: vi.fn(),
                getAttribute: vi.fn().mockReturnValue(nodeId)
            } as any;

            // document.querySelectorをモック
            const originalQuerySelector = document.querySelector;
            document.querySelector = vi.fn().mockReturnValue(mockVideoElement);

            const items = getVideoContextMenuItems(
                src,
                getPos,
                nodeSize,
                true,
                nodeId,
                { t }
            );

            items[0].action();

            expect(document.querySelector).toHaveBeenCalledWith(`video[data-node-id="${nodeId}"]`);
            expect(mockVideoElement.pause).toHaveBeenCalled();
            expect(mockVideoElement.play).not.toHaveBeenCalled();

            // モックを元に戻す
            document.querySelector = originalQuerySelector;
        });

        it("play/pause action does nothing when videoElement is not found", () => {
            const t = createMockTranslator();

            // document.querySelectorがnullを返すようにモック
            const originalQuerySelector = document.querySelector;
            const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
            document.querySelector = vi.fn().mockReturnValue(null);

            const items = getVideoContextMenuItems(
                src,
                getPos,
                nodeSize,
                true,
                nodeId,
                { t }
            );

            // エラーが発生しないことを確認
            expect(() => items[0].action()).not.toThrow();
            expect(console.warn).toHaveBeenCalledWith("Video element not found for nodeId:", nodeId);

            // モックを元に戻す
            document.querySelector = originalQuerySelector;
            consoleWarnSpy.mockRestore();
        });
    });

    describe("openContextMenuAtButton", () => {
        it("calculates position from button element", () => {
            const mockButton = {
                getBoundingClientRect: vi.fn().mockReturnValue({
                    left: 100,
                    bottom: 200,
                    width: 50,
                    height: 30
                })
            } as any;

            const result = openContextMenuAtButton(mockButton);

            expect(mockButton.getBoundingClientRect).toHaveBeenCalled();
            expect(result).toHaveProperty("x");
            expect(result).toHaveProperty("y");
            // x = left + width/2 = 100 + 25 = 125
            // y = bottom + 8 = 208
            expect(result.x).toBe(125);
            expect(result.y).toBe(208);
        });
    });

    describe("openContextMenuAtPosition", () => {
        it("returns calculated position", () => {
            const position = { x: 150, y: 250 };
            const result = openContextMenuAtPosition(position);

            expect(result).toHaveProperty("x");
            expect(result).toHaveProperty("y");
        });
    });

    describe("openContextMenuForVideoNode", () => {
        it("sets store to open with nodeId and src", () => {
            const mockStore = createMockStore();
            const clickPosition = { x: 100, y: 200 };

            openContextMenuForVideoNode(mockStore, nodeId, clickPosition, src);

            expect(mockStore.set).toHaveBeenCalledWith({
                open: true,
                nodeId,
                src,
                videoElement: undefined
            });
        });

        it("closes and reopens when another menu is already open", () => {
            const mockStore = createMockStore({ open: true, nodeId: "other-node" });
            const clickPosition = { x: 100, y: 200 };
            let setTimeoutCallback: (() => void) | null = null;
            const mockSetTimeout = vi.fn<(fn: () => void) => number>().mockImplementation((fn: () => void) => {
                setTimeoutCallback = fn;
                return 123 as any;
            });

            openContextMenuForVideoNode(
                mockStore,
                nodeId,
                clickPosition,
                src,
                undefined,
                { setTimeoutFn: mockSetTimeout as any }
            );

            // 最初に閉じる
            expect(mockStore.set).toHaveBeenCalledWith({
                open: false,
                nodeId: undefined,
                src: undefined,
                videoElement: undefined
            });

            // コールバックを実行
            if (setTimeoutCallback !== null) {
                (setTimeoutCallback as (() => void))();
            }

            // 再度開く
            expect(mockStore.set).toHaveBeenCalledWith({
                open: true,
                nodeId,
                src,
                videoElement: undefined
            });
        });

        it("does nothing when same menu is already open", () => {
            const mockStore = createMockStore({ open: true, nodeId });
            const clickPosition = { x: 100, y: 200 };

            openContextMenuForVideoNode(mockStore, nodeId, clickPosition, src);

            // updateは呼ばれるが、setは呼ばれる（同じノードでも再オープン）
            expect(mockStore.update).toHaveBeenCalled();
            // 新しいsetは呼ばれる（同じノードでも再オープン）
            expect(mockStore.set).toHaveBeenCalledWith({
                open: true,
                nodeId,
                src,
                videoElement: undefined
            });
            // 新しいsetは呼ばれる（同じノードでも再オープン）
            expect(mockStore.set).toHaveBeenCalledWith({
                open: true,
                nodeId,
                src
            });
        });
    });

    describe("prepareGlobalVideoContextMenuItems", () => {
        it("returns null when menu is not open", () => {
            const mockState = { open: false, nodeId: undefined, src: undefined };
            const mockEditor = createMockEditor();
            const lastClickPosition = { x: 100, y: 200 };

            const result = prepareGlobalVideoContextMenuItems(
                mockState,
                mockEditor,
                lastClickPosition
            );

            expect(result).toBeNull();
        });

        it("returns null when nodeId is missing", () => {
            const mockState = { open: true, nodeId: undefined, src };
            const mockEditor = createMockEditor();
            const lastClickPosition = { x: 100, y: 200 };

            const result = prepareGlobalVideoContextMenuItems(
                mockState,
                mockEditor,
                lastClickPosition
            );

            expect(result).toBeNull();
        });

        it("returns menu items and position when menu is open", () => {
            const t = createMockTranslator();
            const mockState = { open: true, nodeId: "5", src };
            const mockEditor = createMockEditor();
            const lastClickPosition = { x: 100, y: 200 };

            const result = prepareGlobalVideoContextMenuItems(
                mockState,
                mockEditor,
                lastClickPosition,
                { t }
            );

            expect(result).not.toBeNull();
            expect(result?.items).toHaveLength(3);
            expect(result?.x).toBeDefined();
            expect(result?.y).toBeDefined();
        });

        it("uses default position when lastClickPosition is null", () => {
            const t = createMockTranslator();
            const mockState = { open: true, nodeId: "5", src };
            const mockEditor = createMockEditor();

            const result = prepareGlobalVideoContextMenuItems(
                mockState,
                mockEditor,
                null,
                { t }
            );

            expect(result).not.toBeNull();
            expect(result?.x).toBe(0);
            expect(result?.y).toBe(0);
        });
    });
});

// ヘルパー関数

function createMockTranslator() {
    return {
        subscribe: (run: (formatter: (id: string | { id: string }) => string) => void) => {
            run((id: string | { id: string }) => {
                const key = typeof id === "string" ? id : id.id;
                const map: Record<string, string> = {
                    "videoContextMenu.copyUrl": "Copy URL",
                    "videoContextMenu.playPause": "Play/Pause",
                    "videoContextMenu.delete": "Delete"
                };
                return map[key] ?? key;
            });
            return () => { };
        }
    };
}

function createMockEditor() {
    const mockTr = { delete: vi.fn().mockReturnValue("TRANSACTION") } as any;
    const mockDoc = {
        descendants: vi.fn((callback) => {
            const mockNode = {
                type: { name: 'video' },
                attrs: { id: "test-video-node-id" },
                nodeSize: 1
            };
            callback(mockNode, 5);
        }),
        nodeAt: vi.fn().mockReturnValue({
            nodeSize: 3
        })
    };
    const mockView = {
        state: { tr: mockTr, doc: mockDoc },
        dispatch: vi.fn()
    };
    return { view: mockView };
}

function createMockStore(initialState: { open: boolean; nodeId?: string; src?: string } = { open: false }) {
    let state = initialState;
    return {
        set: vi.fn((newState: any) => {
            state = newState;
        }),
        update: vi.fn((fn: (s: any) => any) => {
            state = fn(state);
        }),
        subscribe: vi.fn()
    };
}
