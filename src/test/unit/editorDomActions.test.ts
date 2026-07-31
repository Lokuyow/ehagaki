// --- JSDOM用ポリフィル ---
if (typeof globalThis.DragEvent === "undefined") {
    Object.defineProperty(globalThis, "DragEvent", {
        configurable: true,
        writable: true,
        value: class extends Event {
            dataTransfer: { [key: string]: unknown };
            constructor(type: string, eventInitDict: EventInit & { dataTransfer?: { [key: string]: unknown } } = {}) {
                super(type, eventInitDict);
                this.dataTransfer = eventInitDict.dataTransfer || {};
            }
        },
    });
}
if (typeof globalThis.ClipboardEvent === "undefined") {
    Object.defineProperty(globalThis, "ClipboardEvent", {
        configurable: true,
        writable: true,
        value: class extends Event {
            clipboardData: { [key: string]: unknown };
            constructor(type: string, eventInitDict: EventInit & { clipboardData?: { [key: string]: unknown } } = {}) {
                super(type, eventInitDict);
                this.clipboardData = eventInitDict.clipboardData || {};
            }
        },
    });
}

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
    fileDropAction,
    pasteAction,
    touchAction,
    keydownAction,
    fileDropActionWithDragState,
    hasImageInDoc,
    hasVideoInDoc,
    hasMediaInDoc,
} from "../../lib/editor/editorDomActions.svelte";

// extractContentWithImages をモック
vi.mock("../../lib/utils/editorDocumentUtils", () => ({
    extractContentWithImages: vi.fn(),
}));

import { extractContentWithImages } from "../../lib/utils/editorDocumentUtils";

// extractContentWithImagesをMocked型にキャスト
const mockedExtractContentWithImages = vi.mocked(extractContentWithImages);

type MockFn = ReturnType<typeof vi.fn>;

type EditorDomActionTestElement = HTMLElement & {
    __uploadFiles: MockFn;
    __submitPost?: MockFn;
    __currentEditor: unknown;
    __hasStoredKey: boolean | ((...args: unknown[]) => boolean);
    __postStatus: { sending: boolean } | ((...args: unknown[]) => { sending: boolean });
};

type DragEventDataTransferLike = {
    getData?: MockFn;
    files?: File[];
    types?: string[];
};

type ClipboardItemLike = {
    kind: string;
    type: string;
    getAsFile: () => File | null;
};

type ClipboardDataLike = {
    items: ClipboardItemLike[];
};

function createMockNode(): EditorDomActionTestElement {
    const node: HTMLElement = document.createElement("div");
    const mockNode = node as EditorDomActionTestElement;
    mockNode.__uploadFiles = vi.fn();
    mockNode.__submitPost = vi.fn();
    mockNode.__currentEditor = { /* dummy */ };
    mockNode.__hasStoredKey = true;
    mockNode.__postStatus = { sending: false };
    return mockNode;
}

function createDragEvent(type: string, dataTransfer?: DragEventDataTransferLike): DragEvent {
    const event = new DragEvent(type, {
        bubbles: true,
        cancelable: true,
    });
    Object.defineProperty(event, "dataTransfer", {
        value: dataTransfer ?? { types: [] },
    });
    return event;
}

function createClipboardEvent(type: string, clipboardData: ClipboardDataLike): ClipboardEvent {
    const event = new ClipboardEvent(type, { bubbles: true });
    Object.defineProperty(event, "clipboardData", {
        value: clipboardData,
    });
    return event;
}

describe("fileDropAction", () => {
    let node: EditorDomActionTestElement;
    let destroy: () => void;

    beforeEach(() => {
        node = createMockNode();
        destroy = fileDropAction(node).destroy;
    });

    afterEach(() => {
        destroy();
        vi.clearAllMocks();
    });

    it("adds drag-over class on external dragover", () => {
        const event = createDragEvent("dragover", { types: ["Files"] });
        node.dispatchEvent(event);
        expect(node.classList.contains("drag-over")).toBe(true);
    });

    it("removes drag-over class on dragleave", () => {
        // まず dragover で drag-over クラスを付与
        const dragOverEvent = createDragEvent("dragover", { types: ["Files"] });
        node.dispatchEvent(dragOverEvent);
        expect(node.classList.contains("drag-over")).toBe(true);

        // 次に dragleave で types: []（外部ファイルが無い状態）を渡す
        const dragLeaveEvent = createDragEvent("dragleave", { types: [] });
        node.dispatchEvent(dragLeaveEvent);
        expect(node.classList.contains("drag-over")).toBe(false);
    });

    it("calls __uploadFiles on drop with files", async () => {
        const file = new File(["foo"], "foo.png", { type: "image/png" });
        const files = [file];
        const event = createDragEvent("drop", {
            getData: vi.fn().mockReturnValue(""),
            files,
            types: ["Files"],
        });
        node.dispatchEvent(event);
        expect(node.__uploadFiles).toHaveBeenCalledWith(files);
    });

    it("does not call __uploadFiles on internal drag", () => {
        const event = createDragEvent("drop", {
            getData: vi.fn().mockReturnValue("some-data"),
            files: [],
            types: ["application/x-tiptap-node"],
        });
        node.dispatchEvent(event);
        expect(node.__uploadFiles).not.toHaveBeenCalled();
    });
});

describe("pasteAction", () => {
    let node: EditorDomActionTestElement;
    let destroy: () => void;

    beforeEach(() => {
        node = createMockNode();
        destroy = pasteAction(node).destroy;
    });

    afterEach(() => {
        destroy();
        vi.clearAllMocks();
    });

    it("calls __uploadFiles with pasted image files", () => {
        const file = new File(["foo"], "foo.png", { type: "image/png" });
        const item = {
            kind: "file",
            type: "image/png",
            getAsFile: () => file,
        };
        const clipboardData = {
            items: [item],
        };
        const event = createClipboardEvent("paste", clipboardData);
        node.dispatchEvent(event);
        expect(node.__uploadFiles).toHaveBeenCalledWith([file]);
    });

    it("does not call __uploadFiles if no image files", () => {
        const item = {
            kind: "string",
            type: "text/plain",
            getAsFile: () => null,
        };
        const clipboardData = {
            items: [item],
        };
        const event = createClipboardEvent("paste", clipboardData);
        node.dispatchEvent(event);
        expect(node.__uploadFiles).not.toHaveBeenCalled();
    });
});

describe("touchAction", () => {
    let node: EditorDomActionTestElement;
    let destroy: () => void;

    beforeEach(() => {
        node = createMockNode();
        destroy = touchAction(node).destroy;
    });

    afterEach(() => {
        destroy();
        vi.clearAllMocks();
    });

    it("removes drop-zone-hover and adds drop-zone-fade-out on touchend", () => {
        const dropZone = document.createElement("div");
        dropZone.classList.add("drop-zone-indicator", "drop-zone-hover");
        document.body.appendChild(dropZone);

        const event = new TouchEvent("touchend", { bubbles: true });
        node.dispatchEvent(event);

        expect(dropZone.classList.contains("drop-zone-hover")).toBe(false);
        expect(dropZone.classList.contains("drop-zone-fade-out")).toBe(true);

        // Clean up after setTimeout
        vi.useFakeTimers();
        node.dispatchEvent(event);
        vi.advanceTimersByTime(300);
        expect(document.body.contains(dropZone)).toBe(false);
        vi.useRealTimers();
    });

    it("prevents default on touchmove if dragging image button and not near top/bottom", () => {
        // Setup DOM for .tiptap-editor
        const editor = document.createElement("div");
        editor.className = "tiptap-editor";
        Object.defineProperty(editor, "getBoundingClientRect", {
            value: () => ({
                top: 100,
                bottom: 500,
                left: 0,
                right: 0,
                width: 100,
                height: 400,
            }),
        });
        document.body.appendChild(editor);

        const button = document.createElement("button");
        button.className = "editor-image-button";
        button.setAttribute("data-dragging", "true");
        document.body.appendChild(button);

        const touch = { clientY: 300 };
        const event = new TouchEvent("touchmove", { bubbles: true });
        Object.defineProperty(event, "target", { value: button });
        Object.defineProperty(event, "touches", { value: [touch] });

        const preventDefault = vi.fn();
        event.preventDefault = preventDefault;

        node.dispatchEvent(event);

        expect(preventDefault).toHaveBeenCalled();

        document.body.removeChild(editor);
        document.body.removeChild(button);
    });
});

describe("keydownAction", () => {
    let node: EditorDomActionTestElement;
    let destroy: () => void;

    beforeEach(() => {
        node = createMockNode();
        destroy = keydownAction(node).destroy;
        // デフォルトは空文字列
        mockedExtractContentWithImages.mockReturnValue("");
    });

    afterEach(() => {
        destroy();
        vi.clearAllMocks();
    });

    it.each([
        { key: "Enter", ctrlKey: true, metaKey: false, description: "Ctrl+Enter" },
        { key: "Enter", ctrlKey: false, metaKey: true, description: "Meta+Enter" },
        { key: "NumpadEnter", ctrlKey: true, metaKey: false, description: "Ctrl+NumpadEnter" },
    ])("calls __submitPost on $description if conditions met", ({ key, ctrlKey, metaKey }) => {
        // extractContentWithImages を非空に
        mockedExtractContentWithImages.mockReturnValue("content");

        const event = new KeyboardEvent("keydown", {
            bubbles: true,
            ctrlKey,
            metaKey,
            key,
        });
        node.dispatchEvent(event);
        expect(node.__submitPost).toHaveBeenCalled();
    });

    it("does not call __submitPost if postStatus.sending is true", () => {
        node.__postStatus = { sending: true };
        mockedExtractContentWithImages.mockReturnValue("content");
        const event = new KeyboardEvent("keydown", {
            bubbles: true,
            ctrlKey: true,
            key: "Enter",
        });
        node.dispatchEvent(event);
        expect(node.__submitPost).not.toHaveBeenCalled();
    });

    it("does not call __submitPost if content is empty", () => {
        node.__currentEditor = () => undefined;
        mockedExtractContentWithImages.mockReturnValue("");
        const event = new KeyboardEvent("keydown", {
            bubbles: true,
            ctrlKey: true,
            key: "Enter",
        });
        node.dispatchEvent(event);
        expect(node.__submitPost).not.toHaveBeenCalled();
    });

    it("does not call __submitPost if hasStoredKey is false", () => {
        node.__hasStoredKey = () => false;
        mockedExtractContentWithImages.mockReturnValue("content");
        const event = new KeyboardEvent("keydown", {
            bubbles: true,
            ctrlKey: true,
            key: "Enter",
        });
        node.dispatchEvent(event);
        expect(node.__submitPost).not.toHaveBeenCalled();
    });

    it("does not call __submitPost if content is whitespace", () => {
        mockedExtractContentWithImages.mockReturnValue("   ");
        const event = new KeyboardEvent("keydown", {
            bubbles: true,
            ctrlKey: true,
            key: "Enter",
        });
        node.dispatchEvent(event);
        expect(node.__submitPost).not.toHaveBeenCalled();
    });

    it("supports function wrappers for __currentEditor, __hasStoredKey, __postStatus", () => {
        node.__currentEditor = vi.fn(() => ({}));
        node.__hasStoredKey = vi.fn(() => true);
        node.__postStatus = vi.fn(() => ({ sending: false }));
        mockedExtractContentWithImages.mockReturnValue("content");
        const event = new KeyboardEvent("keydown", {
            bubbles: true,
            ctrlKey: true,
            key: "Enter",
        });
        node.dispatchEvent(event);
        expect(node.__submitPost).toHaveBeenCalled();
    });

    it("does not call __submitPost if __submitPost is not defined", () => {
        node.__submitPost = undefined;
        mockedExtractContentWithImages.mockReturnValue("content");
        const event = new KeyboardEvent("keydown", {
            bubbles: true,
            ctrlKey: true,
            key: "Enter",
        });
        expect(() => node.dispatchEvent(event)).not.toThrow();
    });
});

describe("fileDropActionWithDragState", () => {
    let node: HTMLElement;
    let dragOverState: boolean | null;
    let destroy: () => void;

    beforeEach(() => {
        node = document.createElement("div");
        dragOverState = null;
        destroy = fileDropActionWithDragState(node, {
            dragOver: (v) => { dragOverState = v; },
        }).destroy;
    });

    afterEach(() => {
        destroy();
        vi.clearAllMocks();
    });

    it("calls dragOver(true) on dragover", () => {
        const event = createDragEvent("dragover", { types: ["Files"] });
        node.dispatchEvent(event);
        expect(dragOverState).toBe(true);
    });

    it("calls dragOver(false) on dragleave", () => {
        const event = createDragEvent("dragleave");
        node.dispatchEvent(event);
        expect(dragOverState).toBe(false);
    });

    it("calls dragOver(false) on drop", () => {
        const event = createDragEvent("drop");
        node.dispatchEvent(event);
        expect(dragOverState).toBe(false);
    });
});

describe("hasImageInDoc", () => {
    afterEach(() => {
        vi.clearAllMocks();
    });
    it("returns false if doc is undefined", () => {
        expect(hasImageInDoc(undefined)).toBe(false);
    });

    it("returns false if doc is null", () => {
        expect(hasImageInDoc(null)).toBe(false);
    });

    it("returns false if doc has no image node", () => {
        const doc = {
            descendants: (cb: (node: any) => void) => {
                cb({ type: { name: "paragraph" } });
            },
        };
        expect(hasImageInDoc(doc as any)).toBe(false);
    });

    it("returns true if doc has image node", () => {
        const doc = {
            descendants: (cb: (node: any) => void) => {
                cb({ type: { name: "image" } });
            },
        };
        expect(hasImageInDoc(doc as any)).toBe(true);
    });

    it("returns true if doc has image node among others", () => {
        const doc = {
            descendants: (cb: (node: any) => void) => {
                cb({ type: { name: "paragraph" } });
                cb({ type: { name: "image" } });
            },
        };
        expect(hasImageInDoc(doc as any)).toBe(true);
    });
});

describe("hasVideoInDoc", () => {
    afterEach(() => {
        vi.clearAllMocks();
    });
    it("returns false if doc is undefined", () => {
        expect(hasVideoInDoc(undefined)).toBe(false);
    });

    it("returns false if doc is null", () => {
        expect(hasVideoInDoc(null)).toBe(false);
    });

    it("returns false if doc has no video node", () => {
        const doc = {
            descendants: (cb: (node: any) => void) => {
                cb({ type: { name: "paragraph" } });
            },
        };
        expect(hasVideoInDoc(doc as any)).toBe(false);
    });

    it("returns true if doc has video node", () => {
        const doc = {
            descendants: (cb: (node: any) => void) => {
                cb({ type: { name: "video" } });
            },
        };
        expect(hasVideoInDoc(doc as any)).toBe(true);
    });

    it("returns true if doc has video node among others", () => {
        const doc = {
            descendants: (cb: (node: any) => void) => {
                cb({ type: { name: "paragraph" } });
                cb({ type: { name: "video" } });
            },
        };
        expect(hasVideoInDoc(doc as any)).toBe(true);
    });
});

describe("hasMediaInDoc", () => {
    afterEach(() => {
        vi.clearAllMocks();
    });
    it("returns false if doc is undefined", () => {
        expect(hasMediaInDoc(undefined)).toBe(false);
    });

    it("returns false if doc is null", () => {
        expect(hasMediaInDoc(null)).toBe(false);
    });

    it("returns false if doc has no media nodes", () => {
        const doc = {
            descendants: (cb: (node: any) => void) => {
                cb({ type: { name: "paragraph" } });
            },
        };
        expect(hasMediaInDoc(doc as any)).toBe(false);
    });

    it("returns true if doc has image node", () => {
        const doc = {
            descendants: (cb: (node: any) => void) => {
                cb({ type: { name: "image" } });
            },
        };
        expect(hasMediaInDoc(doc as any)).toBe(true);
    });

    it("returns true if doc has video node", () => {
        const doc = {
            descendants: (cb: (node: any) => void) => {
                cb({ type: { name: "video" } });
            },
        };
        expect(hasMediaInDoc(doc as any)).toBe(true);
    });

    it("returns true if doc has both image and video nodes", () => {
        const doc = {
            descendants: (cb: (node: any) => void) => {
                cb({ type: { name: "image" } });
                cb({ type: { name: "video" } });
            },
        };
        expect(hasMediaInDoc(doc as any)).toBe(true);
    });
});