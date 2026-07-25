import { afterEach, describe, expect, it, vi } from "vitest";
import { get } from "svelte/store";

vi.mock("virtual:pwa-register/svelte", () => ({
    useRegisterSW: () => ({
        needRefresh: false,
        updateServiceWorker: vi.fn(),
    }),
}));

import { createEditorStore } from "../../lib/editor/editorConfig";

describe("editorConfig link click behavior", () => {
    let unsubscribe: (() => void) | undefined;

    afterEach(() => {
        unsubscribe?.();
        unsubscribe = undefined;
        document.body.innerHTML = "";
    });

    function setupHandler() {
        const store = createEditorStore({
            placeholderText: "",
            onSubmitPost: vi.fn(async () => undefined),
        });
        unsubscribe = store.subscribe(() => undefined);
        const editor = get(store);
        document.body.append(editor.view.dom);
        const anchor = document.createElement("a");
        anchor.href = "https://example.com/";
        editor.view.dom.append(anchor);
        const handler = editor.options.editorProps.handleClickOn;
        if (!handler) {
            throw new Error("editor link click handler is unavailable");
        }
        return { editor, anchor, handler };
    }

    it("prevents ordinary link navigation while editing", () => {
        const { editor, anchor, handler } = setupHandler();
        const event = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
        });
        Object.defineProperty(event, "target", { value: anchor });

        expect(
            handler(
                editor.view,
                0,
                editor.state.doc,
                0,
                event,
                true,
            ),
        ).toBe(true);
        expect(event.defaultPrevented).toBe(true);
    });

    it.each([
        { ctrlKey: true, metaKey: false },
        { ctrlKey: false, metaKey: true },
    ])("allows Ctrl/Cmd modified link navigation", ({ ctrlKey, metaKey }) => {
        const { editor, anchor, handler } = setupHandler();
        const event = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            ctrlKey,
            metaKey,
        });
        Object.defineProperty(event, "target", { value: anchor });

        expect(
            handler(
                editor.view,
                0,
                editor.state.doc,
                0,
                event,
                true,
            ),
        ).toBe(false);
        expect(event.defaultPrevented).toBe(false);
    });
});
