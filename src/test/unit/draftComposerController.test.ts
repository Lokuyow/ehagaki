import { describe, expect, it, vi } from 'vitest';

import { createDraftComposerController } from '../../lib/draftComposerController';
import type { Draft } from '../../lib/types';

function createDraft(id: string): Draft {
    return {
        id,
        content: '<p>hello</p>',
        preview: 'hello',
        timestamp: 1,
    };
}

function createController(
    overrides: Partial<Parameters<typeof createDraftComposerController>[0]> = {},
) {
    const savedDraft = createDraft('draft-1');
    const deps = {
        getEditorHtml: () => '<p>hello</p>',
        getGalleryItems: () => [],
        getChannelContextState: () => null,
        getReplyQuoteState: () => ({ reply: null, quotes: [] }) as any,
        getPubkeyHex: () => 'a'.repeat(64),
        saveDraft: vi.fn(async () => ({
            status: 'saved' as const,
            draft: savedDraft,
            drafts: [savedDraft],
        })),
        saveDraftWithReplaceOldest: vi.fn(async () => ({
            status: 'saved' as const,
            draft: savedDraft,
            drafts: [savedDraft],
        })),
        openDraftLimitConfirm: vi.fn(),
        closeDraftLimitConfirm: vi.fn(),
        logger: { error: vi.fn() },
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
    it('保存対象がない場合は not-saveable を返し、永続化しない', async () => {
        const missingEditor = createController({
            getEditorHtml: () => undefined,
        });
        const emptyPayload = createController({
            getEditorHtml: () => '<p></p>',
        });

        await expect(
            missingEditor.controller.saveDraftFromComposer(),
        ).resolves.toEqual({ status: 'not-saveable' });
        await expect(
            emptyPayload.controller.saveDraftFromComposer(),
        ).resolves.toEqual({ status: 'not-saveable' });
        expect(missingEditor.deps.saveDraft).not.toHaveBeenCalled();
        expect(emptyPayload.deps.saveDraft).not.toHaveBeenCalled();
    });

    it('通常保存成功を一度だけ意味付きイベントで通知する', async () => {
        const { controller } = createController();
        const listener = vi.fn();
        controller.subscribeToDraftSaveCompleted(listener);

        await expect(controller.saveDraftFromComposer()).resolves.toEqual({
            status: 'saved',
        });

        expect(listener).toHaveBeenCalledOnce();
        expect(listener).toHaveBeenCalledWith({
            draftId: 'draft-1',
            pubkeyHex: 'a'.repeat(64),
        });
    });

    it('上限時は確認待ちにし、確認だけでは保存完了を通知しない', async () => {
        const openDraftLimitConfirm = vi.fn();
        const { controller } = createController({
            saveDraft: vi.fn(async () => ({
                status: 'confirmation-required' as const,
                drafts: [],
            })),
            openDraftLimitConfirm,
        });
        const listener = vi.fn();
        controller.subscribeToDraftSaveCompleted(listener);

        await expect(controller.saveDraftFromComposer()).resolves.toEqual({
            status: 'confirmation-required',
        });

        expect(openDraftLimitConfirm).toHaveBeenCalledOnce();
        expect(listener).not.toHaveBeenCalled();
    });

    it('置換保存も通常保存と同じ完了イベントを一度だけ通知し、保存開始時のpubkeyを使う', async () => {
        let currentPubkey = 'account-a';
        const saveDraftWithReplaceOldest = vi.fn(async () => ({
            status: 'saved' as const,
            draft: createDraft('replacement-draft'),
            drafts: [createDraft('replacement-draft')],
        }));
        const { controller } = createController({
            getPubkeyHex: () => currentPubkey,
            saveDraft: vi.fn(async () => ({
                status: 'confirmation-required' as const,
                drafts: [],
            })),
            saveDraftWithReplaceOldest,
        });
        const listener = vi.fn();
        controller.subscribeToDraftSaveCompleted(listener);

        await controller.saveDraftFromComposer();
        currentPubkey = 'account-b';
        await expect(controller.confirmPendingDraftSave()).resolves.toEqual({
            status: 'saved',
        });

        expect(saveDraftWithReplaceOldest).toHaveBeenCalledWith(
            '<p>hello</p>',
            [],
            undefined,
            undefined,
            { pubkeyHex: 'account-a' },
        );
        expect(listener).toHaveBeenCalledOnce();
        expect(listener).toHaveBeenCalledWith({
            draftId: 'replacement-draft',
            pubkeyHex: 'account-a',
        });
    });

    it('確認キャンセル後は置換保存も完了通知も行わない', async () => {
        const { controller, deps } = createController({
            saveDraft: vi.fn(async () => ({
                status: 'confirmation-required' as const,
                drafts: [],
            })),
        });
        const listener = vi.fn();
        controller.subscribeToDraftSaveCompleted(listener);

        await controller.saveDraftFromComposer();
        controller.cancelPendingDraftSave();
        await expect(controller.confirmPendingDraftSave()).resolves.toEqual({
            status: 'not-saveable',
        });

        expect(deps.saveDraftWithReplaceOldest).not.toHaveBeenCalled();
        expect(listener).not.toHaveBeenCalled();
    });

    it('通常保存と置換保存の失敗では完了通知しない', async () => {
        const normalFailure = createController({
            saveDraft: vi.fn(async () => {
                throw new Error('save failed');
            }),
        });
        const replacementFailure = createController({
            saveDraft: vi.fn(async () => ({
                status: 'confirmation-required' as const,
                drafts: [],
            })),
            saveDraftWithReplaceOldest: vi.fn(async () => {
                throw new Error('replacement failed');
            }),
        });
        const normalListener = vi.fn();
        const replacementListener = vi.fn();
        normalFailure.controller.subscribeToDraftSaveCompleted(normalListener);
        replacementFailure.controller.subscribeToDraftSaveCompleted(
            replacementListener,
        );

        await expect(
            normalFailure.controller.saveDraftFromComposer(),
        ).resolves.toEqual({ status: 'failed' });
        await replacementFailure.controller.saveDraftFromComposer();
        await expect(
            replacementFailure.controller.confirmPendingDraftSave(),
        ).resolves.toEqual({ status: 'failed' });

        expect(normalListener).not.toHaveBeenCalled();
        expect(replacementListener).not.toHaveBeenCalled();
        expect(replacementFailure.deps.closeDraftLimitConfirm).not.toHaveBeenCalled();
    });

    it('置換失敗後も同じpayloadとpubkeyを保持し、再試行成功時だけ閉じて通知する', async () => {
        let currentPubkey = 'account-a';
        const replacementDraft = createDraft('replacement-draft');
        const saveDraftWithReplaceOldest = vi.fn()
            .mockRejectedValueOnce(new Error('replacement failed'))
            .mockResolvedValueOnce({
                status: 'saved' as const,
                draft: replacementDraft,
                drafts: [replacementDraft],
            });
        const { controller, deps } = createController({
            getPubkeyHex: () => currentPubkey,
            saveDraft: vi.fn(async () => ({
                status: 'confirmation-required' as const,
                drafts: [],
            })),
            saveDraftWithReplaceOldest,
        });
        const listener = vi.fn();
        controller.subscribeToDraftSaveCompleted(listener);

        await controller.saveDraftFromComposer();
        currentPubkey = 'account-b';
        await expect(controller.confirmPendingDraftSave()).resolves.toEqual({
            status: 'failed',
        });
        expect(deps.closeDraftLimitConfirm).not.toHaveBeenCalled();
        expect(listener).not.toHaveBeenCalled();

        await expect(controller.confirmPendingDraftSave()).resolves.toEqual({
            status: 'saved',
        });

        expect(saveDraftWithReplaceOldest).toHaveBeenCalledTimes(2);
        expect(saveDraftWithReplaceOldest.mock.calls[0]).toEqual(
            saveDraftWithReplaceOldest.mock.calls[1],
        );
        expect(saveDraftWithReplaceOldest).toHaveBeenLastCalledWith(
            '<p>hello</p>',
            [],
            undefined,
            undefined,
            { pubkeyHex: 'account-a' },
        );
        expect(deps.closeDraftLimitConfirm).toHaveBeenCalledOnce();
        expect(listener).toHaveBeenCalledOnce();
    });

    it('確認処理中の再呼び出しは同じPromiseを共有し、置換を二重実行しない', async () => {
        let resolveReplacement:
            | ((value: { status: 'saved'; draft: Draft; drafts: Draft[] }) => void)
            | undefined;
        const saveDraftWithReplaceOldest = vi.fn(
            () =>
                new Promise<{ status: 'saved'; draft: Draft; drafts: Draft[] }>(
                    (resolve) => {
                        resolveReplacement = resolve;
                    },
                ),
        );
        const { controller, deps } = createController({
            saveDraft: vi.fn(async () => ({
                status: 'confirmation-required' as const,
                drafts: [],
            })),
            saveDraftWithReplaceOldest,
        });

        await controller.saveDraftFromComposer();
        const listener = vi.fn();
        controller.subscribeToDraftSaveCompleted(listener);
        const firstConfirm = controller.confirmPendingDraftSave();
        const secondConfirm = controller.confirmPendingDraftSave();
        controller.cancelPendingDraftSave();

        expect(saveDraftWithReplaceOldest).toHaveBeenCalledOnce();
        expect(deps.closeDraftLimitConfirm).not.toHaveBeenCalled();
        resolveReplacement?.({
            status: 'saved',
            draft: createDraft('replacement'),
            drafts: [createDraft('replacement')],
        });
        await expect(Promise.all([firstConfirm, secondConfirm])).resolves.toEqual([
            { status: 'saved' },
            { status: 'saved' },
        ]);
        expect(listener).toHaveBeenCalledOnce();
        expect(deps.closeDraftLimitConfirm).toHaveBeenCalledOnce();
    });

    it('別々の連続保存をそれぞれ通知し、購読解除後は通知しない', async () => {
        let sequence = 0;
        const { controller } = createController({
            saveDraft: vi.fn(async () => {
                sequence += 1;
                const draft = createDraft(`draft-${sequence}`);
                return {
                    status: 'saved' as const,
                    draft,
                    drafts: [draft],
                };
            }),
        });
        const listener = vi.fn();
        const unsubscribe = controller.subscribeToDraftSaveCompleted(listener);

        await controller.saveDraftFromComposer();
        await controller.saveDraftFromComposer();
        unsubscribe();
        await controller.saveDraftFromComposer();

        expect(listener).toHaveBeenCalledTimes(2);
        expect(listener.mock.calls.map(([event]) => event.draftId)).toEqual([
            'draft-1',
            'draft-2',
        ]);
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

        controller.applyDraftToComposer(createDraft('draft-1'));

        expect(loadDraftContent).toHaveBeenCalledWith('<p>hello</p>');
        expect(appendMediaToEditor).not.toHaveBeenCalled();
    });
});
