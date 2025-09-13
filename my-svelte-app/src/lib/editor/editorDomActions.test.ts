import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
    fileDropAction,
    pasteAction,
    touchAction,
    keydownAction,
} from "./editorDomActions";

// extractContentWithImages をモック
vi.mock("./editorUtils", () => ({
    extractContentWithImages: vi.fn(),
}));

import { extractContentWithImages } from "./editorUtils";

// Helper to create a mock HTMLElement
function createMockNode(): HTMLElement {
    const node = document.createElement("div");
    // @ts-ignore
    node.__uploadFiles = vi.fn();
    // @ts-ignore
    node.__submitPost = vi.fn();
    // @ts-ignore
    node.__currentEditor = { /* dummy */ };
    // @ts-ignore
    node.__hasStoredKey = true;
    // @ts-ignore
    node.__postStatus = { sending: false };
    return node;
}

describe("fileDropAction", () => {
    let node: HTMLElement;
    let destroy: () => void;

    beforeEach(() => {
        node = createMockNode();
        destroy = fileDropAction(node).destroy;
    });

    afterEach(() => {
        destroy();
    });

    it("adds drag-over class on external dragover", () => {
        const event = new DragEvent("dragover", {
            bubbles: true,
            cancelable: true,
        });
        Object.defineProperty(event, "dataTransfer", {
            value: { types: ["Files"] }, // "Files" を含める
        });
        node.dispatchEvent(event);
        expect(node.classList.contains("drag-over")).toBe(true);
    });

    it("removes drag-over class on dragleave", () => {
        // まず dragover で drag-over クラスを付与
        const dragOverEvent = new DragEvent("dragover", {
            bubbles: true,
            cancelable: true,
        });
        Object.defineProperty(dragOverEvent, "dataTransfer", {
            value: { types: ["Files"] },
        });
        node.dispatchEvent(dragOverEvent);
        expect(node.classList.contains("drag-over")).toBe(true);

        // 次に dragleave で types: []（外部ファイルが無い状態）を渡す
        const dragLeaveEvent = new DragEvent("dragleave", {
            bubbles: true,
            cancelable: true,
        });
        Object.defineProperty(dragLeaveEvent, "dataTransfer", {
            value: { types: [] },
        });
        node.dispatchEvent(dragLeaveEvent);
        expect(node.classList.contains("drag-over")).toBe(false);
    });

    it("calls __uploadFiles on drop with files", async () => {
        const file = new File(["foo"], "foo.png", { type: "image/png" });
        const files = [file];
        const event = new DragEvent("drop", {
            bubbles: true,
            cancelable: true,
        });
        Object.defineProperty(event, "dataTransfer", {
            value: {
                getData: vi.fn().mockReturnValue(""),
                files,
                types: ["Files"], // 修正: types: [] → types: ["Files"]
            },
        });
        node.dispatchEvent(event);
        // @ts-ignore
        expect(node.__uploadFiles).toHaveBeenCalledWith(files);
    });

    it("does not call __uploadFiles on internal drag", () => {
        const event = new DragEvent("drop", {
            bubbles: true,
            cancelable: true,
        });
        Object.defineProperty(event, "dataTransfer", {
            value: {
                getData: vi.fn().mockReturnValue("some-data"),
                files: [],
                types: ["application/x-tiptap-node"],
            },
        });
        node.dispatchEvent(event);
        // @ts-ignore
        expect(node.__uploadFiles).not.toHaveBeenCalled();
    });
});

describe("pasteAction", () => {
    let node: HTMLElement;
    let destroy: () => void;

    beforeEach(() => {
        node = createMockNode();
        destroy = pasteAction(node).destroy;
    });

    afterEach(() => {
        destroy();
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
        const event = new ClipboardEvent("paste", { bubbles: true });
        Object.defineProperty(event, "clipboardData", {
            value: clipboardData,
        });
        node.dispatchEvent(event);
        // @ts-ignore
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
        const event = new ClipboardEvent("paste", { bubbles: true });
        Object.defineProperty(event, "clipboardData", {
            value: clipboardData,
        });
        node.dispatchEvent(event);
        // @ts-ignore
        expect(node.__uploadFiles).not.toHaveBeenCalled();
    });
});

describe("touchAction", () => {
    let node: HTMLElement;
    let destroy: () => void;

    beforeEach(() => {
        node = createMockNode();
        destroy = touchAction(node).destroy;
    });

    afterEach(() => {
        destroy();
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
    let node: HTMLElement;
    let destroy: () => void;

    beforeEach(() => {
        node = createMockNode();
        destroy = keydownAction(node).destroy;
        // デフォルトは空文字列
        (extractContentWithImages as any).mockReturnValue("");
    });

    afterEach(() => {
        destroy();
    });

    it("calls __submitPost on Ctrl+Enter if conditions met", () => {
        // extractContentWithImages を非空に
        (extractContentWithImages as any).mockReturnValue("content");

        const event = new KeyboardEvent("keydown", {
            bubbles: true,
            ctrlKey: true,
            key: "Enter",
        });
        node.dispatchEvent(event);
        // @ts-ignore
        expect(node.__submitPost).toHaveBeenCalled();
    });

    it("does not call __submitPost if postStatus.sending is true", () => {
        // @ts-ignore
        node.__postStatus = { sending: true };
        (extractContentWithImages as any).mockReturnValue("content");
        const event = new KeyboardEvent("keydown", {
            bubbles: true,
            ctrlKey: true,
            key: "Enter",
        });
        node.dispatchEvent(event);
        // @ts-ignore
        expect(node.__submitPost).not.toHaveBeenCalled();
    });

    it("does not call __submitPost if content is empty", () => {
        // @ts-ignore
        node.__currentEditor = undefined;
        (extractContentWithImages as any).mockReturnValue("");
        const event = new KeyboardEvent("keydown", {
            bubbles: true,
            ctrlKey: true,
            key: "Enter",
        });
        node.dispatchEvent(event);
        // @ts-ignore
        expect(node.__submitPost).not.toHaveBeenCalled();
    });

    it("calls __submitPost on Meta+Enter if conditions met", () => {
        (extractContentWithImages as any).mockReturnValue("content");
        const event = new KeyboardEvent("keydown", {
            bubbles: true,
            metaKey: true,
            key: "Enter",
        });
        node.dispatchEvent(event);
        // @ts-ignore
        expect(node.__submitPost).toHaveBeenCalled();
    });

    it("calls __submitPost on Ctrl+NumpadEnter if conditions met", () => {
        (extractContentWithImages as any).mockReturnValue("content");
        const event = new KeyboardEvent("keydown", {
            bubbles: true,
            ctrlKey: true,
            key: "NumpadEnter",
        });
        node.dispatchEvent(event);
        // @ts-ignore
        expect(node.__submitPost).toHaveBeenCalled();
    });

    it("does not call __submitPost if hasStoredKey is false", () => {
        // @ts-ignore
        node.__hasStoredKey = false;
        (extractContentWithImages as any).mockReturnValue("content");
        const event = new KeyboardEvent("keydown", {
            bubbles: true,
            ctrlKey: true,
            key: "Enter",
        });
        node.dispatchEvent(event);
        // @ts-ignore
        expect(node.__submitPost).not.toHaveBeenCalled();
    });

    it("does not call __submitPost if content is whitespace", () => {
        (extractContentWithImages as any).mockReturnValue("   ");
        const event = new KeyboardEvent("keydown", {
            bubbles: true,
            ctrlKey: true,
            key: "Enter",
        });
        node.dispatchEvent(event);
        // @ts-ignore
        expect(node.__submitPost).not.toHaveBeenCalled();
    });

    it("supports function wrappers for __currentEditor, __hasStoredKey, __postStatus", () => {
        // @ts-ignore
        node.__currentEditor = vi.fn(() => ({}));
        // @ts-ignore
        node.__hasStoredKey = vi.fn(() => true);
        // @ts-ignore
        node.__postStatus = vi.fn(() => ({ sending: false }));
        (extractContentWithImages as any).mockReturnValue("content");
        const event = new KeyboardEvent("keydown", {
            bubbles: true,
            ctrlKey: true,
            key: "Enter",
        });
        node.dispatchEvent(event);
        // @ts-ignore
        expect(node.__submitPost).toHaveBeenCalled();
    });

    it("does not call __submitPost if __submitPost is not defined", () => {
        // @ts-ignore
        node.__submitPost = undefined;
        (extractContentWithImages as any).mockReturnValue("content");
        const event = new KeyboardEvent("keydown", {
            bubbles: true,
            ctrlKey: true,
            key: "Enter",
        });
        expect(() => node.dispatchEvent(event)).not.toThrow();
    });
});