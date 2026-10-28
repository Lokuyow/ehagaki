import type { Editor } from '@tiptap/core';
import type { MediaGalleryItem } from './types/media';
import type { ReactionUploadOperation } from './types/upload';
import { getReactionInputMode, type ReactionMediaContext } from './reactionValue';
import { clearReactionTarget, onReactionComposerChanged, reactionComposerState,
    type ReactionComposerState, type ReactionSessionEndReason } from '../stores/reactionComposerStore.svelte';

interface Dependencies {
    getEditor: () => Editor | null;
    getAuth: () => object;
    getRuntime: () => unknown;
    getEnvironment?: () => object;
    isFreePlacement: () => boolean;
    getItems: () => MediaGalleryItem[];
    removeItem: (id: string) => void;
    removePlaceholderSize: (id: string) => void;
    restoreItems: (editor: Editor, items: MediaGalleryItem[]) => readonly string[];
    onChange: () => void;
    onUploadEnd: () => void;
}
interface Session {
    token: symbol; editor: Editor; auth: object; runtime: unknown; environment?: object; ownedIds: Set<string>; originalFileNames: Map<string, string>;
}

/** App-owned media lifecycle. Store transitions notify it synchronously before editor disposal. */
export function createReactionMediaController(deps: Dependencies) {
    let session: Session | null = null;
    let upload: ReactionUploadOperation | null = null;
    const ownsEditor = (value: Session) => deps.getEditor() === value.editor && !value.editor.isDestroyed;
    const ownsSession = (value: Session) => ownsEditor(value) && deps.getAuth() === value.auth
        && deps.getRuntime() === value.runtime && deps.getEnvironment?.() === value.environment
        && reactionComposerState.value?.sessionToken === value.token;
    const finish = (reason: ReactionSessionEndReason) => {
        const previous = session;
        if (!previous) return;
        session = null;
        const pending = upload;
        upload = null;
        pending?.abort();
        if (pending) deps.onUploadEnd();
        const items = deps.getItems().filter(item => previous.ownedIds.has(item.id));
        const restore = (reason === 'cancel' || reason === 'ownership') && ownsEditor(previous);
        const completed = items.filter(item => !item.isPlaceholder);
        const moved = new Set(restore && deps.isFreePlacement() && completed.length
            ? deps.restoreItems(previous.editor, completed) : []);
        for (const item of items) {
            if (!restore || moved.has(item.id) || item.isPlaceholder) {
                deps.removeItem(item.id);
                deps.removePlaceholderSize(item.id);
            }
        }
        deps.onChange();
    };
    const sync = (state: ReactionComposerState | null = reactionComposerState.value, reason: ReactionSessionEndReason = 'cancel') => {
        if (session && (!state || state.sessionToken !== session.token)) finish(reason);
        if (session && !ownsSession(session)) {
            clearReactionTarget('ownership');
            finish('ownership');
            return;
        }
        const editor = deps.getEditor();
        if (!session && state && editor && !editor.isDestroyed) {
            session = { token: state.sessionToken, editor, auth: deps.getAuth(), runtime: deps.getRuntime(),
                environment: deps.getEnvironment?.(), ownedIds: new Set(), originalFileNames: new Map() };
            deps.onChange();
        }
    };
    const unsubscribe = onReactionComposerChanged((state, reason) => sync(state, reason));
    return {
        sync,
        getContext(): ReactionMediaContext {
            return { items: deps.getItems(), ownedItemIds: session?.ownedIds ?? new Set<string>(), originalFileNames: session?.originalFileNames ?? new Map<string, string>() };
        },
        getInputMode() { return getReactionInputMode(this.getContext()); },
        abortUpload() { upload?.abort(); },
        beginUpload(): ReactionUploadOperation | null {
            sync();
            const owner = session;
            if (!owner || upload) return null;
            const abortController = new AbortController();
            const operation: ReactionUploadOperation = {
                signal: abortController.signal,
                abort: () => abortController.abort(),
                isCurrent: () => session === owner && upload === operation && ownsSession(owner),
                onPlaceholdersCreated: entries => {
                    if (!operation.isCurrent()) return;
                    entries.forEach(entry => {
                        owner.ownedIds.add(entry.placeholderId);
                        owner.originalFileNames.set(entry.placeholderId, entry.file.name);
                    });
                    deps.onChange();
                },
            };
            upload = operation;
            return operation;
        },
        endUpload(operation: ReactionUploadOperation) {
            if (upload !== operation) return;
            upload = null;
            deps.onChange();
        },
        dispose() {
            if (session && reactionComposerState.value?.sessionToken === session.token) clearReactionTarget('ownership');
            finish('ownership');
            unsubscribe();
        },
    };
}
