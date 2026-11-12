import { DOMParser, type Fragment, type Node as ProseMirrorNode, type TagParseRule } from '@tiptap/pm/model';
import type { EditorView } from '@tiptap/pm/view';
import { isImeCompositionKeydown } from './imeCompositionKey';

const pending = new WeakSet<EditorView>();
const handled = new WeakSet<KeyboardEvent>();

function readCompositionBlock(view: EditorView, dom: HTMLElement, block: ProseMirrorNode, from: number) {
    // The block is the only place the IME edits. Inline NodeViews inside it
    // still get their attributes from the document rather than rendered UI.
    const inlineNodes = new Map<Node, ProseMirrorNode>();
    const inlineTypes = new Set<string>();
    block.forEach((node, offset) => {
        if (node.isText) return;
        const nodeDOM = view.nodeDOM(from + offset);
        if (!nodeDOM) return;
        inlineNodes.set(nodeDOM, node);
        inlineTypes.add(node.type.name);
    });
    const baseParser = view.someProp('domParser') ?? DOMParser.fromSchema(view.state.schema);
    const inlineRules = Array.from(inlineTypes, (type): TagParseRule => ({
        tag: '*',
        node: type,
        getAttrs(element) {
            const node = inlineNodes.get(element);
            return node?.type.name === type ? node.attrs : false;
        },
        getContent: (element) => inlineNodes.get(element)!.content,
    }));
    const parser = new DOMParser(baseParser.schema, [
        ...inlineRules,
        { tag: 'br.ProseMirror-trailingBreak', ignore: true },
        ...baseParser.rules,
    ]);
    return parser.parse(dom, {
        topNode: block,
        preserveWhitespace: block.type.whitespace === 'pre' ? 'full' : true,
    }).content;
}

function restorePreedit(view: EditorView, from: number, committed: Fragment, visible: Fragment) {
    const start = committed.findDiffStart(visible);
    if (start === null) return;
    const end = committed.findDiffEnd(visible)!;
    // In repeated text, the matching prefix and suffix can overlap.
    const overlap = Math.max(0, start - Math.min(end.a, end.b));
    const removed = committed.cut(start, end.a + overlap);
    const inserted = visible.cut(start, end.b + overlap);
    const textOnly = (fragment: Fragment) => {
        for (let i = 0; i < fragment.childCount; i++) {
            if (!fragment.child(i).isText) return false;
        }
        return true;
    };
    if (!textOnly(removed) || !textOnly(inserted)) return;
    view.dispatch(view.state.tr.replaceWith(from + start, from + end.a + overlap, inserted));
}

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
    // to commit; only an observed end with the same visible text is safe.
    if (!view?.dom || view.isDestroyed) return;
    const win = view.dom.ownerDocument.defaultView;
    if (!win) return;
    const { $head } = view.state.selection;
    if (!$head.parent.isTextblock) return;
    const blockDOM = view.nodeDOM($head.before());
    if (blockDOM?.nodeType !== 1) return;
    const blockElement = blockDOM as HTMLElement;
    const visible = readCompositionBlock(view, blockElement, $head.parent, $head.start());
    const wasFocused = view.hasFocus();
    let ended = false;
    const onEnd = () => { ended = true; };
    pending.add(view);
    view.dom.addEventListener('compositionend', onEnd);
    view.dom.blur();
    // Let compositionend/input and ProseMirror's mutation observer finish.
    win.setTimeout(() => {
        view.dom.removeEventListener('compositionend', onEnd);
        let shouldSubmit = false;
        try {
            if (view.isDestroyed) return;
            if (view.dom.contains(blockElement)) {
                const $start = view.state.doc.resolve(view.posAtDOM(blockElement, 0));
                if ($start.parent.type === $head.parent.type && view.nodeDOM($start.before()) === blockElement) {
                    const committed = readCompositionBlock(view, blockElement, $start.parent, $start.start());
                    if (committed.eq($start.parent.content)) {
                        shouldSubmit = ended && !view.composing && visible.eq(committed);
                        // A cancelled preedit stays in the draft and never triggers a post.
                        if (!shouldSubmit && !view.composing) restorePreedit(view, $start.start(), committed, visible);
                    }
                }
            }
            const active = view.root.activeElement;
            if (wasFocused && !view.isDestroyed && (!active || active === view.dom.ownerDocument.body)) {
                view.focus();
            }
        } finally {
            pending.delete(view);
        }
        if (shouldSubmit && !view.isDestroyed) submit();
    }, 0);
}
