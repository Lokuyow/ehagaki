import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { readable } from 'svelte/store';

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

const mockTranslate = vi.hoisted(() => (key: string) => {
    const translations: Record<string, string> = {
        'draft.list_title': '下書き一覧',
        'draft.list_description': '保存した下書きを選択して復元',
        'draft.title': '下書き',
        'draft.info': '下書き情報',
        'draft.delete_all': '全て削除',
        'draft.no_drafts': '下書きがありません',
        'draft.media.image': '[画像]',
        'draft.media.video': '[動画]',
        'channelComposer.selected_label': 'チャンネル',
        'replyQuote.reply_label': 'リプライ',
        'replyQuote.quote_label': '引用',
        'draft.save': '下書き保存',
        'draft.saved': '下書きを保存しました',
        'global.close': '閉じる',
    };

    return translations[key] || key;
});

vi.mock('svelte-i18n', () => ({
    _: readable(mockTranslate),
}));

const mockLoadDrafts = vi.hoisted(() => vi.fn());
const mockDeleteDraft = vi.hoisted(() => vi.fn());
const mockDeleteAllDrafts = vi.hoisted(() => vi.fn());
const mockToggleDraftPinned = vi.hoisted(() => vi.fn());
const mockSaveDraftWithReplaceOldest = vi.hoisted(() => vi.fn());
const mockSaveDraft = vi.hoisted(() => vi.fn());

vi.mock('../../lib/draftManager', () => ({
    loadDrafts: mockLoadDrafts,
    deleteDraft: mockDeleteDraft,
    deleteAllDrafts: mockDeleteAllDrafts,
    toggleDraftPinned: mockToggleDraftPinned,
    formatDraftTimestamp: (value: number) => new Date(value).toISOString(),
    saveDraft: mockSaveDraft,
    saveDraftWithReplaceOldest: mockSaveDraftWithReplaceOldest,
}));

import DraftListDialog from '../../components/DraftListDialog.svelte';

describe('DraftListDialog', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockLoadDrafts.mockResolvedValue([]);
    });

    it('保存ボタンに primary クラスがあり、閉じるボタンより前に配置される', () => {
        render(DraftListDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onApplyDraft: vi.fn(),
                onSaveDraft: vi.fn(async () => true),
                canSaveDraft: true,
                pubkeyHex: 'pubkey',
            },
        });

        const footer = screen.getByRole('button', { name: '閉じる' }).closest('.dialog-footer-actions');
        const saveButton = screen.getByRole('button', { name: '下書き保存' });
        const closeButton = screen.getByRole('button', { name: '閉じる' });

        expect(saveButton.className).toContain('primary');
        expect(footer?.firstElementChild).toBe(saveButton);
        expect(footer?.lastElementChild).toBe(closeButton);
    });

    it('通常保存が成功した場合だけ成功メッセージが表示される', async () => {
        const onSaveDraft = vi.fn(async () => true);
        render(DraftListDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onApplyDraft: vi.fn(),
                onSaveDraft,
                canSaveDraft: true,
                pubkeyHex: 'pubkey',
            },
        });

        await fireEvent.click(screen.getByRole('button', { name: '下書き保存' }));
        await flushPromises();

        expect(screen.getByText('下書きを保存しました')).toBeTruthy();
    });

    it('onSaveDraft が false を返した場合は成功メッセージが表示されない', async () => {
        const onSaveDraft = vi.fn(async () => false);
        render(DraftListDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onApplyDraft: vi.fn(),
                onSaveDraft,
                canSaveDraft: true,
                pubkeyHex: 'pubkey',
            },
        });

        await fireEvent.click(screen.getByRole('button', { name: '下書き保存' }));
        await flushPromises();

        expect(screen.queryByText('下書きを保存しました')).toBeNull();
    });

    it('保存処理が失敗した場合は一覧を再読み込みしない', async () => {
        const onSaveDraft = vi.fn(async () => false);
        render(DraftListDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onApplyDraft: vi.fn(),
                onSaveDraft,
                canSaveDraft: true,
                pubkeyHex: 'pubkey',
            },
        });

        await fireEvent.click(screen.getByRole('button', { name: '下書き保存' }));
        await flushPromises();

        expect(mockLoadDrafts).toHaveBeenCalledTimes(1);
    });

    it('保存中は連打できず、成功時に一覧を再読み込みする', async () => {
        let resolveSave: (value: boolean) => void = () => { };
        const onSaveDraft = vi.fn(() => new Promise<boolean>((resolve) => {
            resolveSave = resolve;
        }));
        mockLoadDrafts.mockResolvedValueOnce([]).mockResolvedValueOnce([{ id: 'draft-1', timestamp: 1 } as never]);

        render(DraftListDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onApplyDraft: vi.fn(),
                onSaveDraft,
                canSaveDraft: true,
                pubkeyHex: 'pubkey',
            },
        });

        const saveButton = screen.getByRole('button', { name: '下書き保存' });
        await fireEvent.click(saveButton);
        await fireEvent.click(saveButton);

        expect(onSaveDraft).toHaveBeenCalledTimes(1);
        resolveSave(true);

        await waitFor(() => {
            expect(mockLoadDrafts).toHaveBeenCalledTimes(2);
        });
    });

    it('上限確認後の置換保存完了通知を受けると一覧を再読み込みする', async () => {
        mockLoadDrafts.mockResolvedValue([]);
        const { rerender } = render(DraftListDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onApplyDraft: vi.fn(),
                onSaveDraft: vi.fn(async () => true),
                canSaveDraft: true,
                draftListRefreshRevision: 0,
                pubkeyHex: 'pubkey',
            },
        });

        await flushPromises();
        rerender({
            show: true,
            onClose: vi.fn(),
            onApplyDraft: vi.fn(),
            onSaveDraft: vi.fn(async () => true),
            canSaveDraft: true,
            draftListRefreshRevision: 1,
            pubkeyHex: 'pubkey',
        });

        await waitFor(() => {
            expect(mockLoadDrafts).toHaveBeenCalledTimes(2);
        });
    });

    it('確認をキャンセルした場合は再読み込みしない', async () => {
        const { rerender } = render(DraftListDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onApplyDraft: vi.fn(),
                onSaveDraft: vi.fn(async () => true),
                canSaveDraft: true,
                draftListRefreshRevision: 0,
                pubkeyHex: 'pubkey',
            },
        });

        await flushPromises();
        rerender({
            show: true,
            onClose: vi.fn(),
            onApplyDraft: vi.fn(),
            onSaveDraft: vi.fn(async () => true),
            canSaveDraft: true,
            draftListRefreshRevision: 0,
            pubkeyHex: 'pubkey',
        });

        expect(mockLoadDrafts).toHaveBeenCalledTimes(1);
    });

    it('保存完了通知が一度だけ処理される', async () => {
        const { rerender } = render(DraftListDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onApplyDraft: vi.fn(),
                onSaveDraft: vi.fn(async () => true),
                canSaveDraft: true,
                draftListRefreshRevision: 0,
                pubkeyHex: 'pubkey',
            },
        });

        await flushPromises();
        rerender({
            show: true,
            onClose: vi.fn(),
            onApplyDraft: vi.fn(),
            onSaveDraft: vi.fn(async () => true),
            canSaveDraft: true,
            draftListRefreshRevision: 1,
            pubkeyHex: 'pubkey',
        });
        rerender({
            show: true,
            onClose: vi.fn(),
            onApplyDraft: vi.fn(),
            onSaveDraft: vi.fn(async () => true),
            canSaveDraft: true,
            draftListRefreshRevision: 2,
            pubkeyHex: 'pubkey',
        });

        await waitFor(() => {
            expect(mockLoadDrafts).toHaveBeenCalledTimes(3);
        });
    });

    it('現在の pubkeyHex で一覧を読み込む', async () => {
        render(DraftListDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onApplyDraft: vi.fn(),
                onSaveDraft: vi.fn(async () => true),
                canSaveDraft: true,
                pubkeyHex: 'pubkey-2',
            },
        });

        await waitFor(() => {
            expect(mockLoadDrafts).toHaveBeenCalledWith({ pubkeyHex: 'pubkey-2' });
        });
    });

    it('canSaveDraft が false のときは保存ボタンを無効化する', () => {
        render(DraftListDialog, {
            props: {
                show: true,
                onClose: vi.fn(),
                onApplyDraft: vi.fn(),
                onSaveDraft: vi.fn(async () => true),
                canSaveDraft: false,
                pubkeyHex: 'pubkey',
            },
        });

        expect(screen.getByRole<HTMLButtonElement>('button', { name: '下書き保存' }).disabled).toBe(true);
    });
});
