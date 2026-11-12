import { DOMParser } from '@tiptap/pm/model';
import type { EditorView } from '@tiptap/pm/view';
import { isImeCompositionKeydown } from './imeCompositionKey';

const pending = new WeakSet<EditorView>();
const handled = new WeakSet<KeyboardEvent>();

/** Both normal-editor keydown routes must consume the same physical shortcut. */
export function submitEditorShortcut(
    event: KeyboardEvent,
    view: EditorView | undefined,
    submit: () => unknown,
): void {
    if (handled.has(event) || event.defaultPrevented) return;
    handled.add(event);
    event.preventDefault();
    if (view && pending.has(view)) return;
    if (!isImeCompositionKeydown(event, view)) {
        submit();
        return;
    }
    // A candidate window is owned by the IME. Never construct a post from a
    // guessed candidate or from stale application state. Blur asks the browser
    // to commit; only an observed end with the same visible document is safe.
    if (!view?.dom || view.isDestroyed) return;
    const win = view.dom.ownerDocument.defaultView;
    if (!win) return;
    const parser = DOMParser.fromSchema(view.state.schema);
    const visible = parser.parse(view.dom);
    let ended = false;
    const onEnd = () => { ended = true; };
    pending.add(view);
    view.dom.addEventListener('compositionend', onEnd);
    view.dom.blur();
    // Let compositionend/input and ProseMirror's mutation observer finish.
    win.setTimeout(() => {
        view.dom.removeEventListener('compositionend', onEnd);
        pending.delete(view);
        if (view.isDestroyed) return;
        const committed = parser.parse(view.dom);
        if (ended && !view.composing && visible.eq(committed) && committed.eq(view.state.doc)) {
            submit();
        } else {
            // Some browsers cancel rather than commit on blur. Preserve the
            // visible draft in that case, but never submit the cancelled value.
            if (!visible.eq(committed)) {
                view.dispatch(view.state.tr.replaceWith(0, view.state.doc.content.size, visible.content));
            }
            view.dom.focus();
        }
    }, 0);
}
