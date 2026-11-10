export interface DialogCloseFocusOptions {
    restore: boolean;
    explicit?: HTMLElement | null;
    opener: HTMLElement | null;
    container: HTMLElement | null;
}

function isOutsideDialog(
    target: HTMLElement,
    container: HTMLElement | null,
): boolean {
    return !container || (target !== container && !container.contains(target));
}

export function readDialogOpener(
    doc: Document | null | undefined,
): HTMLElement | null {
    if (!doc) return null;

    let active: Element | null = doc.activeElement;
    while (active?.shadowRoot) {
        const next = active.shadowRoot.activeElement;
        if (!next || next === active) break;
        active = next;
    }

    if (!(active instanceof HTMLElement)) return null;
    if (active === doc.body || active === doc.documentElement) return null;
    return active;
}

export function rememberDialogOpener(
    current: HTMLElement | null,
    candidate: HTMLElement | null,
    container: HTMLElement | null,
): HTMLElement | null {
    if (!candidate || !isOutsideDialog(candidate, container)) return current;
    return candidate;
}

export function resolveDialogCloseFocusTarget(
    explicit: HTMLElement | null | undefined,
    opener: HTMLElement | null,
    container: HTMLElement | null,
): HTMLElement | null {
    const candidates = explicit ? [explicit, opener] : [opener];
    for (const target of candidates) {
        if (!(target instanceof HTMLElement)) continue;
        if (!target.isConnected) continue;
        if (!isOutsideDialog(target, container)) continue;
        return target;
    }
    return null;
}

export function restoreDialogCloseFocus(target: HTMLElement): void {
    try {
        target.focus({ preventScroll: true });
    } catch {
        // The node can disconnect between the connection check and focus.
    }
}

/**
 * bits-ui の close auto focus はキャンセルする。
 * 接続中でダイアログ外の戻り先へ、こちらで一度だけ戻す。
 */
export function applyDialogCloseAutoFocus(
    event: Event,
    options: DialogCloseFocusOptions,
): void {
    event.preventDefault();
    if (!options.restore) return;

    const target = resolveDialogCloseFocusTarget(
        options.explicit,
        options.opener,
        options.container,
    );
    if (!target) return;
    restoreDialogCloseFocus(target);
}
