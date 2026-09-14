import type { Editor as TipTapEditor } from '@tiptap/core';

export type SubmittedCompositionPhase = 'continuing' | 'stale' | 'disposed';

export interface CompositionObserverState {
    idsByGeneration: ReadonlyMap<number, unknown>;
}

export interface CompositionTransactionContext {
    transaction: { getMeta: (key: string) => unknown };
    observerState: CompositionObserverState;
}

export type CompositionTransactionDecision = 'allow' | 'reject' | 'default';

/** Owns the DOM composition generation and the submitted session lifecycle. */
export class SubmittedCompositionController {
    private readonly onPhaseChange?: (phase: SubmittedCompositionPhase | null) => void;
    private editor: TipTapEditor | null = null;
    private cleanupListeners: (() => void) | undefined;
    private frame: number | undefined;
    private generation = 0;
    private domCompositionActive = false;
    private phase: SubmittedCompositionPhase | null = null;
    private capturedGeneration: number | undefined;
    private capturedId: unknown;

    constructor(onPhaseChange?: (phase: SubmittedCompositionPhase | null) => void) {
        this.onPhaseChange = onPhaseChange;
    }

    private setPhase(phase: SubmittedCompositionPhase | null): void {
        this.phase = phase;
        this.onPhaseChange?.(phase);
    }

    private scheduleRetire(): void {
        const ownerWindow = this.editor?.view?.dom?.ownerDocument.defaultView;
        if (!ownerWindow) {
            this.retire();
            return;
        }
        if (this.frame !== undefined) ownerWindow.cancelAnimationFrame(this.frame);
        this.frame = ownerWindow.requestAnimationFrame(() => {
            this.frame = undefined;
            if (this.phase === 'stale' && !this.domCompositionActive && !this.editor?.view.composing) {
                this.retire();
            }
        });
    }

    attach(editor: TipTapEditor): void {
        this.cleanupListeners?.();
        this.editor = editor;
        const element = editor.view?.dom;
        if (!element) return;
        const ownerWindow = element.ownerDocument.defaultView;
        if (!ownerWindow) return;

        const handleCompositionStart = () => {
            this.domCompositionActive = true;
            this.generation += 1;
            if (this.phase === 'stale') {
                this.retire();
            }
        };
        const handleCompositionEnd = () => {
            this.domCompositionActive = false;
            if (this.phase !== 'stale') return;
            this.scheduleRetire();
        };

        element.addEventListener('compositionstart', handleCompositionStart);
        element.addEventListener('compositionend', handleCompositionEnd);
        this.cleanupListeners = () => {
            element.removeEventListener('compositionstart', handleCompositionStart);
            element.removeEventListener('compositionend', handleCompositionEnd);
            if (this.frame !== undefined) ownerWindow.cancelAnimationFrame(this.frame);
            this.frame = undefined;
            this.cleanupListeners = undefined;
        };
    }

    getCurrentGeneration(): number {
        return this.generation;
    }

    startSession(observerState: CompositionObserverState): void {
        this.setPhase('continuing');
        this.capturedGeneration = this.generation;
        this.capturedId = observerState.idsByGeneration.get(this.generation);
    }

    decideTransaction({ transaction, observerState }: CompositionTransactionContext): CompositionTransactionDecision {
        if (!this.phase) return 'default';
        const compositionId = transaction.getMeta('composition');

        if (this.phase === 'stale') return 'reject';
        if (compositionId === undefined || this.capturedGeneration !== this.generation) return 'reject';

        if (this.capturedId === undefined) {
            const observedId = observerState.idsByGeneration.get(this.capturedGeneration);
            if (observedId !== undefined) this.capturedId = observedId;
            else return 'allow';
        }

        return Object.is(this.capturedId, compositionId) ? 'allow' : 'reject';
    }

    isCompositionInputAllowed(): boolean {
        return this.phase === 'continuing' && this.capturedGeneration === this.generation;
    }

    isReadOnly(): boolean {
        return this.phase === 'stale';
    }

    markStale(): void {
        if (this.phase !== 'continuing') return;
        this.setPhase('stale');
        if (!this.domCompositionActive && !this.editor?.view.composing) this.scheduleRetire();
    }

    markFailure(): void {
        this.retire();
    }

    retire(): void {
        this.setPhase(null);
        this.capturedGeneration = undefined;
        this.capturedId = undefined;
        if (this.frame !== undefined) {
            const ownerWindow = this.editor?.view.dom.ownerDocument.defaultView;
            ownerWindow?.cancelAnimationFrame(this.frame);
            this.frame = undefined;
        }
    }

    destroy(): void {
        this.retire();
        this.setPhase('disposed');
        this.cleanupListeners?.();
        this.cleanupListeners = undefined;
        this.editor = null;
    }
}
