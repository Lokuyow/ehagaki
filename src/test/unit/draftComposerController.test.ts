import { describe, expect, it, vi } from 'vitest';

import { createDraftComposerController } from '../../lib/draftComposerController';

function createController(overrides: Partial<Parameters<typeof createDraftComposerController>[0]> = {}) {
    const deps = {
        getEditorHtml: () => '<p>hello</p>',
        getGalleryItems: () => [],
        getChannelContextState: () => null,
        getReplyQuoteState: () => ({ reply: null, quotes: [] }) as any,
        getPubkeyHex: () => 'a'.repeat(64),
        saveDraft: vi.fn(async () => ({ success: true, needsConfirmation: false })),
        stageDraftLimitConfirm: vi.fn(),
        isGalleryMode: () => false,
        document,
        clearGallery: vi.fn(),
        addGalleryItem: vi.fn(),
        loadDraftContent: vi.fn(),
        appendMediaToEditor: vi.fn(),
        generateMediaItemId: () => 'media-item-id',
        restoreChannelContext: vi.fn(),
        clearChannelContext: vi.fn(),
        restoreReplyQuote: vi.fn(),
        clearReplyQuote: vi.fn(),
        ...overrides,
    };

    return {
        deps,
        controller: createDraftComposerController(deps),
    };
}

describe('createDraftComposerController', () => {
    it('editor html が取れない場合は保存しない', async () => {
        const { controller, deps } = createController({
            getEditorHtml: () => undefined,
        });

        await expect(controller.saveDraftFromComposer()).resolves.toBe(false);
        expect(deps.saveDraft).not.toHaveBeenCalled();
    });

    it('payload が空の場合は保存しない', async () => {
        const { controller, deps } = createController({
            getEditorHtml: () => '<p></p>',
        });

        await expect(controller.saveDraftFromComposer()).resolves.toBe(false);
        expect(deps.saveDraft).not.toHaveBeenCalled();
    });

    it('needsConfirmation の場合は確認ステージへ積む', async () => {
        const stageDraftLimitConfirm = vi.fn();
        const { controller, deps } = createController({
            saveDraft: vi.fn(async () => ({ success: false, needsConfirmation: true })),
            stageDraftLimitConfirm,
        });

        await expect(controller.saveDraftFromComposer()).resolves.toBe(false);
        expect(deps.saveDraft).toHaveBeenCalledTimes(1);
        expect(stageDraftLimitConfirm).toHaveBeenCalledTimes(1);
    });

    it('保存成功時は true を返す', async () => {
        const { controller, deps } = createController({
            saveDraft: vi.fn(async () => ({ success: true, needsConfirmation: false })),
        });

        await expect(controller.saveDraftFromComposer()).resolves.toBe(true);
        expect(deps.saveDraft).toHaveBeenCalledTimes(1);
    });

    it('applyDraftToComposer は draft を composer に適用する', () => {
        const loadDraftContent = vi.fn();
        const appendMediaToEditor = vi.fn();
        const controller = createDraftComposerController({
            ...createController().deps,
            loadDraftContent,
            appendMediaToEditor,
            isGalleryMode: () => false,
        });

        controller.applyDraftToComposer({
            id: 'draft-1',
            content: '<p>hello</p>',
            preview: 'hello',
            timestamp: 1,
            updatedAt: 1,
            schemaVersion: 2,
            galleryItems: [],
        } as any);

        expect(loadDraftContent).toHaveBeenCalledWith('<p>hello</p>');
        expect(appendMediaToEditor).not.toHaveBeenCalled();
    });
});
