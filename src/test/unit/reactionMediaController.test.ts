import { afterEach, describe, expect, it, vi } from 'vitest';
import { Editor } from '@tiptap/core';
import { Plugin } from '@tiptap/pm/state';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { finalizeEvent, generateSecretKey } from 'nostr-tools';
import { createReactionMediaController } from '../../lib/reactionMediaController';
import { mediaGalleryStore } from '../../stores/mediaGalleryStore.svelte';
import { clearReactionTarget, reactionComposerState, setReactionTarget } from '../../stores/reactionComposerStore.svelte';
import { moveGalleryMediaToEditor } from '../../lib/postComponentUtils';
import { replacePlaceholdersInGallery } from '../../lib/editor/placeholderManager';
const disposers: (() => void)[] = [];
afterEach(() => { disposers.splice(0).forEach(dispose => dispose()); clearReactionTarget('reset'); mediaGalleryStore.clearAll(); });
const target = () => finalizeEvent({ kind: 1, content: 'Target', tags: [], created_at: 1 }, generateSecretKey());
function fixture(free = false) {
    const editor = new Editor({ element: document.createElement('div'), extensions: [StarterKit, Image.extend({ addAttributes: () => ({ src: {}, m: {}, ox: {}, x: {}, dim: {}, size: {}, blurhash: {}, uploadProtocol: {}, alt: {} }) })], content: '<p>Original</p>' });
    let current: Editor | null = editor; let auth: object = {}; let runtime: object = {};
    const restore = vi.fn((owner: Editor, items: Parameters<typeof moveGalleryMediaToEditor>[0]['items']) => moveGalleryMediaToEditor({ currentEditor: owner, items }).movedItemIds);
    const uploadEnd = vi.fn();
    const controller = createReactionMediaController({ getEditor: () => current, getAuth: () => auth, getRuntime: () => runtime,
        addItem: mediaGalleryStore.addItem, isFreePlacement: () => free, getItems: mediaGalleryStore.getItems, removeItem: mediaGalleryStore.removeItem,
        removePlaceholderSize: vi.fn(), restoreItems: restore, onChange: vi.fn(), onUploadEnd: uploadEnd });
    disposers.push(() => { controller.dispose(); if (!editor.isDestroyed) editor.destroy(); });
    setReactionTarget(target(), []);
    const upload = controller.beginUpload()!;
    const owned = { id: 'owned', src: 'https://upload.example/cat.png', type: 'image' as const, isPlaceholder: false,
        mimeType: 'image/png', ox: 'original-hash', x: 'uploaded-hash', dim: '128x256', size: 999, blurhash: 'fixture', alt: 'Cat', uploadProtocol: 'nip96' as const };
    mediaGalleryStore.addItem({ ...owned, isPlaceholder: true });
    upload.onPlaceholdersCreated([{ placeholderId: owned.id, file: new File(['x'], 'cat.png', { type: 'image/png' }) }]);
    const complete = () => { mediaGalleryStore.updateItem(owned.id, owned); controller.endUpload(upload); };
    return { editor, controller, upload, owned, restore, complete, uploadEnd, changeAuth: () => { auth = {}; }, changeRuntime: () => { runtime = {}; }, replaceEditor: () => { current = null; } };
}
describe('Reaction media session ownership', () => {
    it('keeps target-only changes in the same session including pending upload', () => {
        const f = fixture(); const session = reactionComposerState.value!.sessionToken;
        const targetOwner = reactionComposerState.value!.ownerToken;
        setReactionTarget(target(), []);
        expect(reactionComposerState.value!.sessionToken).toBe(session);
        expect(reactionComposerState.value!.ownerToken).not.toBe(targetOwner);
        expect(f.upload.isCurrent()).toBe(true); expect(f.controller.getInputMode()).toBe('uploadedShortcode');
        expect(f.upload.signal.aborted).toBe(false);
    });
    it.each(['cancel', 'ownership'] as const)('restores only completed owned images with metadata on %s in free placement', reason => {
        const f = fixture(true); f.complete();
        mediaGalleryStore.addItem({ ...f.owned, id: 'existing' });
        clearReactionTarget(reason);
        expect(f.editor.state.doc.firstChild?.textContent).toBe('Original');
        let attrs: Record<string, unknown> = {};
        f.editor.state.doc.descendants(node => { if (node.type.name === 'image') attrs = node.attrs; });
        expect(attrs).toMatchObject({ src: f.owned.src, m: 'image/png', ox: 'original-hash', x: 'uploaded-hash', dim: '128x256', size: 999, uploadProtocol: 'nip96', alt: 'Cat' });
        expect(mediaGalleryStore.items.map(item => item.id)).toEqual(['existing']);
    });
    it.each(['auth', 'runtime'])('ownership %s change restores to the same living current editor', change => {
        const f = fixture(true); f.complete();
        if (change === 'auth') f.changeAuth(); else f.changeRuntime();
        f.controller.sync();
        expect(reactionComposerState.value).toBeNull(); expect(f.restore).toHaveBeenCalledOnce(); expect(mediaGalleryStore.items).toEqual([]);
    });
    it.each(['replaced', 'destroyed'])('removes old session items after editor is %s, preserving preexisting items', change => {
        const f = fixture(); f.complete(); mediaGalleryStore.addItem({ ...f.owned, id: 'existing' });
        if (change === 'replaced') f.replaceEditor(); else f.editor.destroy();
        f.controller.sync();
        expect(f.restore).not.toHaveBeenCalled(); expect(mediaGalleryStore.items.map(item => item.id)).toEqual(['existing']);
    });
    it('aborts pending upload and late placeholder notifications cannot enter a new session', () => {
        const f = fixture(true); clearReactionTarget('ownership');
        expect(f.upload.signal.aborted).toBe(true); expect(mediaGalleryStore.items).toEqual([]);
        setReactionTarget(target(), []); f.upload.onPlaceholdersCreated([{ placeholderId: 'late', file: new File(['x'], 'late.png') }]);
        expect(f.upload.isCurrent()).toBe(false); expect(f.controller.getContext().ownedItemIds.size).toBe(0);
    });
    it('blocks a late hash result from recreating an old item after editor replacement', async () => {
        const f = fixture();
        let resolveHash!: (value: string) => void;
        const hash = new Promise<string>(resolve => resolveHash = resolve);
        const replacement = replacePlaceholdersInGallery([{ success: true, url: f.owned.src }],
            [{ placeholderId: f.owned.id, file: new File(['x'], 'cat.png', { type: 'image/png' }) }],
            {}, {}, { update: vi.fn() }, () => hash, () => 'image/png', false, { isCurrent: f.upload.isCurrent });
        await vi.waitFor(() => expect(mediaGalleryStore.items[0].isPlaceholder).toBe(false));
        f.replaceEditor(); f.controller.sync();
        resolveHash('late-hash'); await replacement;
        expect(mediaGalleryStore.items).toEqual([]); expect(f.restore).not.toHaveBeenCalled();
    });
    it('connects cancellation before a compression service has been prepared', () => {
        const f = fixture(); f.controller.abortUpload();
        expect(f.upload.signal.aborted).toBe(true);
        expect(f.controller.beginUpload()).toBeNull();
    });
    it('keeps completed images in normal Gallery but does not adopt them on reentry', () => {
        const f = fixture(); f.complete(); clearReactionTarget();
        expect(mediaGalleryStore.items).toHaveLength(1);
        setReactionTarget(target(), []); expect(f.controller.getInputMode()).toBe('singleValue');
    });
    it('retains completed items if their restoration transaction is rejected', () => {
        const f = fixture(true); f.complete();
        f.editor.registerPlugin(new Plugin({ filterTransaction: tr => !tr.docChanged }));
        clearReactionTarget();
        expect(mediaGalleryStore.items.map(item => item.id)).toEqual(['owned']);
        expect(f.editor.getText()).toBe('Original');
    });
    it('releases the pending upload UI when its original editor has been replaced', () => {
        const f = fixture(); f.replaceEditor(); f.controller.sync();
        expect(f.upload.signal.aborted).toBe(true); expect(f.uploadEnd).toHaveBeenCalledOnce();
        expect(mediaGalleryStore.items).toEqual([]);
        f.controller.sync(); expect(f.uploadEnd).toHaveBeenCalledOnce();
    });
    it.each(['success', 'reset'] as const)('%s removes owned media without cancel restoration', reason => {
        const f = fixture(true); f.complete(); clearReactionTarget(reason);
        expect(f.restore).not.toHaveBeenCalled(); expect(f.editor.getText()).toBe('Original'); expect(mediaGalleryStore.items).toEqual([]);
    });
});

it('owns pasted URL images and preserves document and selection', () => {
    const f = fixture(true); f.complete(); mediaGalleryStore.clearAll();
    const doc = f.editor.state.doc; const selection = f.editor.state.selection;
    expect(f.controller.addImageUrls(['https://example.com/cat.svg?x=1'])).toBe(true);
    expect(f.controller.getInputMode()).toBe('uploadedShortcode');
    expect(f.editor.state.doc.eq(doc)).toBe(true);
    expect(f.editor.state.selection.eq(selection)).toBe(true);
    setReactionTarget(target(), []);
    expect(f.controller.getInputMode()).toBe('uploadedShortcode');
    clearReactionTarget('success');
    expect(mediaGalleryStore.items).toEqual([]);
});
it('rejects URL images during upload and after ownership loss', () => {
    const f = fixture();
    expect(f.controller.addImageUrls(['https://example.com/cat.png'])).toBe(false);
    f.complete(); f.changeAuth();
    expect(f.controller.addImageUrls(['https://example.com/cat.png'])).toBe(false);
});

it.each([false, true])('restores pasted images on cancel, free placement=%s', free => {
    const f = fixture(free); f.complete(); mediaGalleryStore.clearAll();
    expect(f.controller.addImageUrls(['https://example.com/a.gif', 'https://example.com/b.webp'])).toBe(true);
    expect(f.controller.getInputMode()).toBe('singleValue');
    mediaGalleryStore.removeItem(mediaGalleryStore.items[1].id);
    expect(f.controller.getInputMode()).toBe('uploadedShortcode');
    clearReactionTarget();
    if (free) {
        expect(f.restore).toHaveBeenCalledOnce();
        expect(mediaGalleryStore.items).toEqual([]);
    } else {
        expect(mediaGalleryStore.items.map(item => item.src)).toEqual(['https://example.com/a.gif']);
    }
    setReactionTarget(target(), []);
    expect(f.controller.getInputMode()).toBe('singleValue');
});
