import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {

    fileDropAction,
    pasteAction,
    touchAction,
    keydownAction,
} from "./editorDomActions";

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
            value: { types: ["text/plain"] },
        });
        node.dispatchEvent(event);
        expect(node.classList.contains("drag-over")).toBe(true);
    });

    it("removes drag-over class on dragleave", () => {
        node.classList.add("drag-over");
        const event = new DragEvent("dragleave", {
            bubbles: true,
            cancelable: true,
        });
        Object.defineProperty(event, "dataTransfer", {
            value: { types: ["text/plain"] },
        });
        node.dispatchEvent(event);
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
                types: [],
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
    });

    afterEach(() => {
        destroy();
    });

    it("calls __submitPost on Ctrl+Enter if conditions met", () => {
        // Mock extractContentWithImages to return non-empty string
        vi.mock("./editorUtils", () => ({
            extractContentWithImages: () => "content",
        }));

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
        const event = new KeyboardEvent("keydown", {
            bubbles: true,
            ctrlKey: true,
            key: "Enter",
        });
        node.dispatchEvent(event);
        // @ts-ignore
        expect(node.__submitPost).not.toHaveBeenCalled();
    });
});