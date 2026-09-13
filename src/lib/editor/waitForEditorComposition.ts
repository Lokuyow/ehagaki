import type { Editor } from '@tiptap/core';

/** Wait for a natural IME end; never finish composition or move focus ourselves. */
export function waitForEditorComposition(editor: Editor) {
    const element = editor.view.dom;
    const ownerWindow = element.ownerDocument.defaultView!;
    let frame: number | undefined;
    let resolve: (ready: boolean) => void;
    const settled = new Promise<boolean>((done) => { resolve = done; });
    const finish = (ready: boolean) => {
        element.removeEventListener('compositionend', handleEnd);
        if (frame !== undefined) ownerWindow.cancelAnimationFrame(frame);
        frame = undefined;
        resolve(ready);
    };
    function handleEnd() {
        if (frame !== undefined) ownerWindow.cancelAnimationFrame(frame);
        // A tested DOM/ProseMirror synchronization boundary, not a platform
        // guarantee. Do not replace a failing boundary with timed retries.
        frame = ownerWindow.requestAnimationFrame(() => {
            frame = undefined;
            if (editor.isDestroyed) finish(false);
            else if (!editor.view.composing) finish(true);
        });
    }
    element.addEventListener('compositionend', handleEnd);
    return { settled, cancel: () => finish(false) };
}
