import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { readable } from 'svelte/store';

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

    it('フッターに保存ボタンが表示され、保存コールバックを1回呼び出す', async () => {
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

        const saveButton = screen.getByRole('button', { name: '下書き保存' });
        expect(saveButton).toBeTruthy();
        await fireEvent.click(saveButton);

        expect(onSaveDraft).toHaveBeenCalledOnce();
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
