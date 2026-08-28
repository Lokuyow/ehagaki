import { afterEach, describe, expect, it, vi } from "vitest";
import { get } from "svelte/store";
import { createEditorStore } from "../../lib/editor/editorConfig";

describe("editorConfig submit-on-plain-Enter", () => {
    let unsubscribe: (() => void) | undefined;

    afterEach(() => {
        unsubscribe?.();
        unsubscribe = undefined;
    });

    function createEditor(enterKeyBehavior?: "newline" | "submit") {
        const onSubmitPost = vi.fn(async () => undefined);
        const store = createEditorStore({
            placeholderText: "",
            onSubmitPost,
            enterKeyBehavior,
        });
        unsubscribe = store.subscribe(() => undefined);
        const editor = get(store);
        return { editor, onSubmitPost };
    }

    function runKeydown(editor: any, event: KeyboardEvent): boolean {
        let handled = false;
        editor.view.someProp("handleKeyDown", (handler: (view: any, event: KeyboardEvent) => boolean) => {
            if (handler(editor.view, event)) {
                handled = true;
                return true;
            }
            return false;
        });
        return handled;
    }

    it("uses newline defaults without adding an enterkeyhint", () => {
        const { editor, onSubmitPost } = createEditor();

        const attributes = editor.options.editorProps.attributes as Record<string, string>;
        expect(attributes).not.toHaveProperty("enterkeyhint");
        const event = new KeyboardEvent("keydown", { key: "Enter", cancelable: true });
        runKeydown(editor, event);

        expect(onSubmitPost).not.toHaveBeenCalled();
    });

    it("submits plain Enter before the normal paragraph keymap", () => {
        const { editor, onSubmitPost } = createEditor("submit");

        const attributes = editor.options.editorProps.attributes as Record<string, string>;
        expect(attributes.enterkeyhint).toBe("send");
        const event = new KeyboardEvent("keydown", { key: "Enter", cancelable: true });

        expect(runKeydown(editor, event)).toBe(true);
        expect(event.defaultPrevented).toBe(true);
        expect(onSubmitPost).toHaveBeenCalledOnce();
        expect(editor.getText()).toBe("");
    });

    it.each([
        { name: "Shift+Enter", shiftKey: true, submits: false },
        { name: "Ctrl+Enter", ctrlKey: true, submits: true },
        { name: "Cmd+Enter", metaKey: true, submits: true },
        { name: "Alt+Enter", altKey: true, submits: false },
    ])("leaves $name to the existing editor handling", ({ shiftKey, ctrlKey, metaKey, altKey, submits }) => {
        const { editor, onSubmitPost } = createEditor("submit");
        const event = new KeyboardEvent("keydown", {
            key: "Enter",
            cancelable: true,
            shiftKey,
            ctrlKey,
            metaKey,
            altKey,
        });

        runKeydown(editor, event);
        expect(onSubmitPost).toHaveBeenCalledTimes(submits ? 1 : 0);
    });

    it.each([
        { name: "isComposing", isComposing: true },
        { name: "229 keyCode", keyCode: 229 },
    ])("does not submit composition $name", ({ isComposing, keyCode }) => {
        const { editor, onSubmitPost } = createEditor("submit");
        const event = new KeyboardEvent("keydown", {
            key: "Enter",
            cancelable: true,
            ...(isComposing !== undefined ? { isComposing } : {}),
        });
        if (keyCode !== undefined) {
            Object.defineProperty(event, "keyCode", { configurable: true, value: keyCode });
        }

        runKeydown(editor, event);
        expect(onSubmitPost).not.toHaveBeenCalled();
    });

    it("does not submit while the editor view is composing", () => {
        const { editor, onSubmitPost } = createEditor("submit");
        Object.defineProperty(editor.view, "composing", { configurable: true, value: true });
        const event = new KeyboardEvent("keydown", { key: "Enter", cancelable: true });

        runKeydown(editor, event);
        expect(onSubmitPost).not.toHaveBeenCalled();
    });
});
