import type { Editor as TipTapEditor } from '@tiptap/core';
import type { PostStatus } from '../types';
import type { SubmittedCompositionController } from '../editor/submittedComposition';
import { editorInputGuardKey } from '../editor/editorInputGuard';

type Recorder = (label: string, event?: Event, extra?: Record<string, unknown>) => void;

const activeRecorders = new Set<Recorder>();

export function recordImeDebugLifecycle(
    label: string,
    extra?: Record<string, unknown>,
): void {
    for (const recorder of activeRecorders) recorder(label, undefined, extra);
}

interface ImeDebugOptions {
    editor: TipTapEditor;
    controller: SubmittedCompositionController;
    getPostStatus: () => PostStatus;
    getSubmitPending: () => boolean;
    getIsUploading: () => boolean;
    getGalleryCount: () => number;
    getSubmittedReadOnly: () => boolean;
}

interface DebugRecord {
    t: number;
    label: string;
    event?: {
        type: string;
        defaultPrevented: boolean;
        cancelable: boolean;
        pointerType?: string;
        button?: number;
        inputType?: string;
        isComposing?: boolean;
    };
    activeElement: string;
    button: { present: boolean; disabled: boolean };
    postStatus: PostStatus & { submitPending: boolean; uploading: boolean };
    composition: {
        viewComposing: boolean;
        submittedReadOnly: boolean;
        ariaReadonly: string | null;
        generation: number;
        domActive: boolean;
        phase: string | null;
        capturedGeneration: number | null;
        capturedId: string | number | boolean | null;
        observedIds: Array<{ generation: number; id: string | number | boolean }>;
    };
    document: { pmTextLength: number; domTextLength: number; galleryCount: number };
}

function enabled(): boolean {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('ehagakiImeDebug') === '1';
}

function describeElement(element: Element | null, editorElement: Element, button: Element | null): string {
    if (!element) return 'none';
    if (element === editorElement || editorElement.contains(element)) return 'editor';
    if (element === button || button?.contains(element)) return 'post-button';
    return element.tagName.toLowerCase();
}

function safeCompositionId(id: unknown): string | number | boolean | null {
    if (typeof id === 'string' || typeof id === 'number' || typeof id === 'boolean') return id;
    return id == null ? null : typeof id;
}

function eventSnapshot(event?: Event): DebugRecord['event'] {
    if (!event) return undefined;
    const inputEvent = event as InputEvent;
    const pointerEvent = event as PointerEvent;
    return {
        type: event.type,
        defaultPrevented: event.defaultPrevented,
        cancelable: event.cancelable,
        ...(typeof pointerEvent.pointerType === 'string' ? { pointerType: pointerEvent.pointerType } : {}),
        ...(typeof pointerEvent.button === 'number' ? { button: pointerEvent.button } : {}),
        ...(typeof inputEvent.inputType === 'string' ? { inputType: inputEvent.inputType } : {}),
        ...(typeof inputEvent.isComposing === 'boolean' ? { isComposing: inputEvent.isComposing } : {}),
    };
}

export function installImeDebugInstrumentation(options: ImeDebugOptions): (() => void) | null {
    if (!enabled()) return null;

    const editorElement = options.editor.view.dom;
    const root = editorElement.closest<HTMLElement>('[data-post-editor-root]')
        ?? document.querySelector<HTMLElement>('[data-post-editor-root]')
        ?? editorElement.parentElement
        ?? editorElement;
    const panel = document.createElement('details');
    panel.id = 'ehagaki-ime-debug';
    panel.open = false;
    panel.style.cssText = 'position:fixed;z-index:2147483647;left:0;right:0;bottom:0;max-height:32px;background:#111;color:#eee;font:12px/1.35 monospace;padding:6px;opacity:.96;';
    const resizePanel = () => { panel.style.maxHeight = panel.open ? '45vh' : '32px'; };
    panel.addEventListener('toggle', resizePanel);
    const summary = document.createElement('summary');
    summary.textContent = 'eHagaki IME debug (本文は記録しません)';
    const controls = document.createElement('div');
    const copyButton = document.createElement('button');
    copyButton.type = 'button';
    copyButton.textContent = 'Copy JSON';
    const clearButton = document.createElement('button');
    clearButton.type = 'button';
    clearButton.textContent = 'Clear';
    const output = document.createElement('pre');
    output.style.cssText = 'white-space:pre-wrap;overflow:auto;max-height:35vh;margin:4px 0 0;';
    controls.append(copyButton, ' ', clearButton);
    panel.append(summary, controls, output);
    document.body.append(panel);

    const records: DebugRecord[] = [];
    let button: HTMLButtonElement | null = null;
    let buttonCleanup: (() => void) | undefined;
    let lastTouchPointerDownAt: number | null = null;
    let lastStateKey = '';
    let frame: number | undefined;

    const render = () => {
        output.textContent = records.map((record) => JSON.stringify(record)).join('\n');
        output.scrollTop = output.scrollHeight;
    };
    const record: Recorder = (label, event, extra) => {
        const status = options.getPostStatus();
        const controller = options.controller.getDebugState();
        const editorContainer = editorElement.closest<HTMLElement>('[role="textbox"]');
        const activeElement = document.activeElement;
        const eventData = eventSnapshot(event);
        const observerState = editorInputGuardKey.getState(options.editor.state);
        const entry: DebugRecord = {
            t: Number(performance.now().toFixed(1)),
            label,
            ...(eventData ? { event: eventData } : {}),
            activeElement: describeElement(activeElement, editorElement, button),
            button: { present: button !== null, disabled: button?.disabled ?? false },
            postStatus: {
                ...status,
                submitPending: options.getSubmitPending(),
                uploading: options.getIsUploading(),
            },
            composition: {
                viewComposing: options.editor.view.composing,
                submittedReadOnly: options.getSubmittedReadOnly(),
                ariaReadonly: editorContainer?.getAttribute('aria-readonly') ?? null,
                generation: controller.generation,
                domActive: controller.domCompositionActive,
                phase: controller.phase,
                capturedGeneration: controller.capturedGeneration,
                capturedId: safeCompositionId(controller.capturedId),
                observedIds: Array.from(observerState?.idsByGeneration.entries() ?? []).map(([generation, id]) => ({ generation, id: safeCompositionId(id)! })),
            },
            document: {
                pmTextLength: options.editor.state.doc.textContent.length,
                domTextLength: editorElement.textContent?.length ?? 0,
                galleryCount: options.getGalleryCount(),
            },
        };
        if (extra) Object.assign(entry as unknown as Record<string, unknown>, extra);
        records.push(entry);
        if (records.length > 500) records.splice(0, records.length - 500);
        render();
    };

    const bindButton = () => {
        const nextButton = root.querySelector<HTMLButtonElement>('button.post-button')
            ?? editorElement.ownerDocument.querySelector<HTMLButtonElement>('button.post-button');
        if (nextButton === button) return;
        buttonCleanup?.();
        button = nextButton;
        if (!button) return;
        const events = ['touchstart', 'pointerdown', 'pointerup', 'touchend', 'pointercancel', 'mousedown', 'mouseup', 'click', 'contextmenu', 'focus', 'blur'];
        const listeners = events.map((type) => {
            const listener = (event: Event) => {
                if (type === 'pointerdown' && (event as PointerEvent).pointerType === 'touch') {
                    lastTouchPointerDownAt = performance.now();
                }
                record(`button:${type}`, event, type === 'pointerdown' && lastTouchPointerDownAt !== null
                    ? { pointerDownAt: lastTouchPointerDownAt }
                    : undefined);
            };
            const boundButton = button!;
            boundButton.addEventListener(type, listener, type === 'focus' || type === 'blur');
            return () => boundButton.removeEventListener(type, listener, type === 'focus' || type === 'blur');
        });
        buttonCleanup = () => listeners.forEach((cleanup) => cleanup());
        const buttonMutationObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                record('button:disabled-change', undefined, { attributeName: mutation.attributeName ?? 'disabled' });
            }
        });
        buttonMutationObserver.observe(button, { attributes: true, attributeFilter: ['disabled'] });
        const listenerCleanup = buttonCleanup;
        buttonCleanup = () => {
            listenerCleanup?.();
            buttonMutationObserver.disconnect();
        };
    };
    bindButton();

    const editorEvents = ['compositionstart', 'compositionupdate', 'compositionend', 'beforeinput', 'input', 'focus', 'blur'];
    const editorCleanup = editorEvents.map((type) => {
        const listener = (event: Event) => {
            if (!(event.target instanceof Node) || !editorElement.contains(event.target)) return;
            const inputEvent = event as InputEvent;
            record(`editor:${type}`, event, type === 'beforeinput' || type === 'input'
                ? { inputDataLength: typeof inputEvent.data === 'string' ? inputEvent.data.length : 0 }
                : undefined);
        };
        document.addEventListener(type, listener, true);
        return () => document.removeEventListener(type, listener, true);
    });
    const documentCleanup = ['focusin', 'focusout'].map((type) => {
        const listener = (event: Event) => record(`document:${type}`, event);
        document.addEventListener(type, listener, true);
        return () => document.removeEventListener(type, listener, true);
    });

    const mutationObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            const target = mutation.target as Element;
            const label = target === button && mutation.attributeName === 'disabled'
                ? 'button:disabled-change'
                : target === editorElement.closest('[role="textbox"]') && mutation.attributeName === 'aria-readonly'
                    ? 'editor:aria-readonly-change'
                    : mutation.type === 'attributes'
                        ? 'editor:attribute-change'
                        : 'editor:dom-mutation';
            record(label, undefined, mutation.attributeName ? { attributeName: mutation.attributeName } : undefined);
        }
    });
    mutationObserver.observe(root, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['disabled', 'aria-readonly', 'contenteditable'] });

    const lifecycleRecorder: Recorder = (label, event, extra) => record(label, event, extra);
    activeRecorders.add(lifecycleRecorder);
    const harnessEventListener = (event: Event) => {
        const detail = (event as CustomEvent<Record<string, unknown>>).detail;
        if (!detail || typeof detail.label !== 'string') return;
        const { label, ...extra } = detail;
        record(label, undefined, extra);
    };
    window.addEventListener('ehagaki-ime-debug-harness', harnessEventListener);
    record('instrumentation-enabled');
    copyButton.addEventListener('click', () => {
        void navigator.clipboard?.writeText(JSON.stringify(records, null, 2));
    });
    clearButton.addEventListener('click', () => {
        records.length = 0;
        render();
    });

    const sampleState = () => {
        const status = options.getPostStatus();
        const controller = options.controller.getDebugState();
        const stateKey = JSON.stringify({
            sending: status.sending,
            success: status.success,
            error: status.error,
            completed: status.completed,
            disabled: button?.disabled,
            composing: options.editor.view.composing,
            phase: controller.phase,
            generation: controller.generation,
            capturedId: safeCompositionId(controller.capturedId),
            readOnly: options.getSubmittedReadOnly(),
        });
        if (stateKey !== lastStateKey) {
            const previous = JSON.parse(lastStateKey || '{}') as { sending?: boolean; success?: boolean };
            lastStateKey = stateKey;
            const elapsed = lastTouchPointerDownAt === null
                ? null
                : Number((performance.now() - lastTouchPointerDownAt).toFixed(1));
            if (status.sending && !previous.sending) {
                if (elapsed !== null && elapsed >= 250) record('long-press-250ms', undefined, { elapsedMs: elapsed });
                record('submit-start', undefined, elapsed === null ? undefined : { elapsedMs: elapsed });
            }
            if (status.success && !previous.success) record('network-success');
            record('state-change');
        }
        bindButton();
        frame = window.requestAnimationFrame(sampleState);
    };
    frame = window.requestAnimationFrame(sampleState);

    return () => {
        activeRecorders.delete(lifecycleRecorder);
        if (frame !== undefined) window.cancelAnimationFrame(frame);
        mutationObserver.disconnect();
        buttonCleanup?.();
        editorCleanup.forEach((cleanup) => cleanup());
        documentCleanup.forEach((cleanup) => cleanup());
        window.removeEventListener('ehagaki-ime-debug-harness', harnessEventListener);
        panel.removeEventListener('toggle', resizePanel);
        panel.remove();
    };
}
