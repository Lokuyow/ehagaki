import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../lib/editor/editorConfig", () => ({
    createEditorStore: vi.fn(),
}));

vi.mock("../../lib/editor/editorDomActions.svelte", () => ({
    setupEventListeners: vi.fn(),
    cleanupEventListeners: vi.fn(),
}));

vi.mock("../../lib/editor", () => ({
    updateEditorPlaceholder: vi.fn(),
}));

import { cleanupEditor } from "../../lib/editor/editorLifecycle";
import {
    clearPostSubmitter,
    currentEditorStore,
    setPostSubmitter,
    submitPost,
    updatePlaceholderText,
} from "../../stores/editorStore.svelte";
import { updateEditorPlaceholder } from "../../lib/editor";

class TestEditor {
    isDestroyed = false;
    destroy = vi.fn(() => {
        this.isDestroyed = true;
    });
}

function createEditor(): TestEditor {
    return new TestEditor();
}

describe("editor lifecycle cleanup", () => {
    beforeEach(() => {
        currentEditorStore.set(null);
        clearPostSubmitter();
        vi.clearAllMocks();
    });

    it("releases the destroyed editor and its submitter before a subsequent mount", async () => {
        const editor = createEditor();
        const submitter = vi.fn(async () => {});
        const unsubscribe = vi.fn();
        const componentUnsubscribe = vi.fn();
        currentEditorStore.set(editor as any);
        setPostSubmitter(submitter);

        cleanupEditor({
            unsubscribe,
            componentUnsubscribe,
            handlers: {} as any,
            currentEditor: editor as any,
            editorContainerEl: document.createElement("div"),
            submitPost: submitter,
        });

        expect(currentEditorStore.value).toBeNull();
        expect(componentUnsubscribe).toHaveBeenCalledOnce();
        expect(unsubscribe).toHaveBeenCalledOnce();
        expect(editor.destroy).toHaveBeenCalledOnce();
        await submitPost();
        expect(submitter).not.toHaveBeenCalled();
        updatePlaceholderText("next mount placeholder");
        expect(updateEditorPlaceholder).not.toHaveBeenCalled();
    });

    it("does not clear a newer editor or submitter during stale cleanup", async () => {
        const oldEditor = createEditor();
        const newEditor = createEditor();
        const oldSubmitter = vi.fn(async () => {});
        const newSubmitter = vi.fn(async () => {});
        currentEditorStore.set(newEditor as any);
        setPostSubmitter(newSubmitter);

        cleanupEditor({
            unsubscribe: vi.fn(),
            componentUnsubscribe: vi.fn(),
            handlers: {} as any,
            currentEditor: oldEditor as any,
            editorContainerEl: null,
            submitPost: oldSubmitter,
        });

        expect(currentEditorStore.value).toBe(newEditor);
        await submitPost();
        expect(newSubmitter).toHaveBeenCalledOnce();
        expect(oldSubmitter).not.toHaveBeenCalled();
    });
});
