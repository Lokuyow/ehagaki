/**
 * IME 変換中の keydown か。
 * `isComposing` に加えて、変換中に keyCode 229 を出すブラウザと
 * ProseMirror の `view.composing` を同じ条件で扱う。
 */
export function isImeCompositionKeydown(
    event: Pick<KeyboardEvent, 'isComposing' | 'keyCode'>,
    view?: { readonly composing?: boolean } | null,
): boolean {
    return event.isComposing || event.keyCode === 229 || !!view?.composing;
}
