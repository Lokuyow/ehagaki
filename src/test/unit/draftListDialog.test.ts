import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { readable } from 'svelte/store';

import type { DraftSaveCompletedEvent } from '../../lib/draftComposerController';
import type { Draft } from '../../lib/types';
import { editorState } from '../../stores/editorStore.svelte';

const mockTranslate = vi.hoisted(() => (key: string) => {
    const translations: Record<string, string> = {
        'draft.list_title': '下書き一覧',
        'draft.list_description': '保存した下書きを選択して復元',
        'draft.title': '下書き',
        'draft.info': '下書き情報',
        'draft.delete_all': '全て削除',
        'draft.delete': '削除',
        'draft.no_drafts': '下書きがありません',
        'draft.pin': 'ピン留め',
        'draft.unpin': 'ピン留めを解除',
        'draft.media.image': '[画像]',
        'draft.media.video': '[動画]',
        'channelComposer.selected_label': 'チャンネル',
        'replyQuote.reply_label': 'リプライ',
        'replyQuote.quote_label': '引用',
        'draft.save': '下書き保存',
        'draft.saved': '下書きを保存しました',
        'draft.load_failed': '下書き一覧を読み込めませんでした。',
        'draft.retry_load': '再試行',
        'global.close': '閉じる',
        'loadingPlaceholder.loading': '読み込み中...',
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

vi.mock('../../lib/draftManager', () => ({
    loadDrafts: mockLoadDrafts,
    deleteDraft: mockDeleteDraft,
    deleteAllDrafts: mockDeleteAllDrafts,
    toggleDraftPinned: mockToggleDraftPinned,
    formatDraftTimestamp: (value: number) => new Date(value).toISOString(),
}));

import DraftListDialog from '../../components/DraftListDialog.svelte';

function createDraft(id: string, preview = id): Draft {
    return {
        id,
        content: `<p>${preview}</p>`,
        preview,
        timestamp: 1,
    };
}

function createCompletionSource() {
    const listeners = new Set<(event: DraftSaveCompletedEvent) => void>();
    return {
        subscribe: (
            listener: (event: DraftSaveCompletedEvent) => void,
        ) => {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
        emit: (event: DraftSaveCompletedEvent) => {
            for (const listener of listeners) listener(event);
        },
        get size() {
            return listeners.size;
        },
    };
}

function createProps(
    source = createCompletionSource(),
    overrides: Record<string, unknown> = {},
) {
    return {
        show: true,
        onClose: vi.fn(),
        onApplyDraft: vi.fn(),
        onSaveDraft: vi.fn(async () => ({ status: 'saved' as const })),
        subscribeToDraftSaveCompleted: source.subscribe,
        canSaveDraft: true,
        pubkeyHex: 'pubkey',
        ...overrides,
    };
}

describe('DraftListDialog', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockLoadDrafts.mockResolvedValue([]);
        mockDeleteDraft.mockResolvedValue([]);
        mockDeleteAllDrafts.mockResolvedValue([]);
        mockToggleDraftPinned.mockResolvedValue([]);
        editorState.postStatus = {
            sending: false,
            success: false,
            error: false,
            message: '',
        };
        editorState.isUploading = false;
        editorState.canPost = false;
    });

    it('primaryの保存ボタンをアイコン・ラベル付きで閉じるボタンより前に表示する', () => {
        render(DraftListDialog, {
            props: createProps(),
        });

        const footer = screen
            .getByRole('button', { name: '閉じる' })
            .closest('.dialog-footer-actions');
        const saveButton = screen.getByRole('button', { name: '下書き保存' });
        const closeButton = screen.getByRole('button', { name: '閉じる' });

        expect(saveButton.className).toContain('primary');
        expect(saveButton.textContent).toContain('下書き保存');
        expect(saveButton.querySelector('.save-draft-icon')).toBeTruthy();
        expect(footer?.firstElementChild).toBe(saveButton);
        expect(footer?.lastElementChild).toBe(closeButton);
    });

    it('保存対象なし・投稿中・アップロード中は保存できない', async () => {
        const source = createCompletionSource();
        const { rerender } = render(DraftListDialog, {
            props: createProps(source, { canSaveDraft: false }),
        });
        const saveButton = screen.getByRole<HTMLButtonElement>('button', {
            name: '下書き保存',
        });

        expect(saveButton.disabled).toBe(true);

        editorState.postStatus.sending = true;
        await rerender(createProps(source, { canSaveDraft: true }));
        expect(saveButton.disabled).toBe(true);

        editorState.postStatus.sending = false;
        editorState.isUploading = true;
        await rerender(createProps(source, { canSaveDraft: true }));
        expect(saveButton.disabled).toBe(true);
    });

    it('保存中は連打できない', async () => {
        let resolveSave: (() => void) | undefined;
        const onSaveDraft = vi.fn(
            () =>
                new Promise<{ status: 'saved' }>((resolve) => {
                    resolveSave = () => resolve({ status: 'saved' });
                }),
        );
        render(DraftListDialog, {
            props: createProps(createCompletionSource(), { onSaveDraft }),
        });
        const saveButton = screen.getByRole('button', { name: '下書き保存' });

        await fireEvent.click(saveButton);
        await fireEvent.click(saveButton);

        expect(onSaveDraft).toHaveBeenCalledOnce();
        expect(
            (saveButton as HTMLButtonElement).disabled,
        ).toBe(true);
        resolveSave?.();
        await waitFor(() =>
            expect((saveButton as HTMLButtonElement).disabled).toBe(false),
        );
    });

    it('一覧読込失敗時はエラーと再試行を表示し、loading表示と操作可能状態を残さない', async () => {
        mockLoadDrafts.mockRejectedValueOnce(new Error('load failed'));
        render(DraftListDialog, {
            props: createProps(),
        });

        await waitFor(() =>
            expect(
                screen.getByText('下書き一覧を読み込めませんでした。'),
            ).toBeTruthy(),
        );

        expect(screen.queryByText('読み込み中...')).toBeNull();
        expect(screen.getByRole('button', { name: '再試行' })).toBeTruthy();
        expect(
            screen.getByRole<HTMLButtonElement>('button', { name: '下書き保存' }).disabled,
        ).toBe(true);
        expect(
            screen.getByRole<HTMLButtonElement>('button', { name: '全て削除' }).disabled,
        ).toBe(true);
    });

    it('再試行は現在のアカウントを読み込み、成功後だけ一覧操作を有効にする', async () => {
        let resolveRetry: ((drafts: Draft[]) => void) | undefined;
        mockLoadDrafts
            .mockRejectedValueOnce(new Error('load failed'))
            .mockImplementationOnce(
                () =>
                    new Promise<Draft[]>((resolve) => {
                        resolveRetry = resolve;
                    }),
            );
        render(DraftListDialog, {
            props: createProps(createCompletionSource(), {
                pubkeyHex: 'retry-account',
            }),
        });
        const retryButton = await screen.findByRole('button', { name: '再試行' });

        await fireEvent.click(retryButton);

        expect(mockLoadDrafts).toHaveBeenNthCalledWith(2, {
            pubkeyHex: 'retry-account',
        });
        expect(screen.getByText('読み込み中...')).toBeTruthy();
        expect(
            screen.getByRole<HTMLButtonElement>('button', { name: '下書き保存' }).disabled,
        ).toBe(true);

        resolveRetry?.([createDraft('retry', 'Retry success')]);
        await waitFor(() => expect(screen.getByText('Retry success')).toBeTruthy());
        expect(
            screen.getByRole<HTMLButtonElement>('button', { name: '下書き保存' }).disabled,
        ).toBe(false);
        expect(
            screen.getByRole<HTMLButtonElement>('button', { name: '削除' }).disabled,
        ).toBe(false);
    });

    it('再試行も失敗した場合はエラー表示と無効状態を維持する', async () => {
        mockLoadDrafts.mockRejectedValue(new Error('load failed'));
        render(DraftListDialog, {
            props: createProps(),
        });
        const retryButton = await screen.findByRole('button', { name: '再試行' });

        await fireEvent.click(retryButton);

        await waitFor(() =>
            expect(
                screen.getByText('下書き一覧を読み込めませんでした。'),
            ).toBeTruthy(),
        );
        expect(mockLoadDrafts).toHaveBeenCalledTimes(2);
        expect(screen.queryByText('読み込み中...')).toBeNull();
        expect(
            screen.getByRole<HTMLButtonElement>('button', { name: '下書き保存' }).disabled,
        ).toBe(true);
    });

    it('再試行中にアカウントが切り替わっても古い結果を反映しない', async () => {
        let resolveAccountA: ((drafts: Draft[]) => void) | undefined;
        mockLoadDrafts
            .mockRejectedValueOnce(new Error('load failed'))
            .mockImplementationOnce(
                () =>
                    new Promise<Draft[]>((resolve) => {
                        resolveAccountA = resolve;
                    }),
            )
            .mockResolvedValueOnce([createDraft('b', 'Account B')]);
        const source = createCompletionSource();
        const { rerender } = render(DraftListDialog, {
            props: createProps(source, { pubkeyHex: 'account-a' }),
        });
        await fireEvent.click(
            await screen.findByRole('button', { name: '再試行' }),
        );

        await rerender(createProps(source, { pubkeyHex: 'account-b' }));
        await waitFor(() => expect(screen.getByText('Account B')).toBeTruthy());
        resolveAccountA?.([createDraft('a', 'Account A')]);
        await Promise.resolve();

        expect(screen.queryByText('Account A')).toBeNull();
        expect(screen.getByText('Account B')).toBeTruthy();
    });

    it('保存完了イベントだけが一覧更新と成功表示を行う', async () => {
        const source = createCompletionSource();
        mockLoadDrafts
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([createDraft('draft-1', '新しい下書き')]);
        render(DraftListDialog, {
            props: createProps(source),
        });
        await waitFor(() => expect(mockLoadDrafts).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(source.size).toBe(1));

        source.emit({ draftId: 'draft-1', pubkeyHex: 'pubkey' });

        await waitFor(() =>
            expect(screen.getByText('下書きを保存しました')).toBeTruthy(),
        );
        await waitFor(() =>
            expect(screen.getByText('新しい下書き')).toBeTruthy(),
        );
        expect(mockLoadDrafts).toHaveBeenCalledTimes(2);
    });

    it.each([
        ['confirmation-required'],
        ['not-saveable'],
        ['failed'],
    ] as const)(
        '%sを返しただけでは一覧更新も成功表示もしない',
        async (status) => {
            const onSaveDraft = vi.fn(async () => ({ status }));
            render(DraftListDialog, {
                props: createProps(createCompletionSource(), { onSaveDraft }),
            });
            await waitFor(() =>
                expect(mockLoadDrafts).toHaveBeenCalledTimes(1),
            );

            await fireEvent.click(
                screen.getByRole('button', { name: '下書き保存' }),
            );

            expect(
                screen.queryByText('下書きを保存しました'),
            ).toBeNull();
            expect(mockLoadDrafts).toHaveBeenCalledTimes(1);
        },
    );

    it('別々の保存完了を取りこぼさず、それぞれ一度だけ処理する', async () => {
        const source = createCompletionSource();
        mockLoadDrafts.mockResolvedValue([]);
        render(DraftListDialog, {
            props: createProps(source),
        });
        await waitFor(() => expect(mockLoadDrafts).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(source.size).toBe(1));

        source.emit({ draftId: 'draft-1', pubkeyHex: 'pubkey' });
        source.emit({ draftId: 'draft-2', pubkeyHex: 'pubkey' });

        await waitFor(() => expect(mockLoadDrafts).toHaveBeenCalledTimes(3));
        expect(screen.getByText('下書きを保存しました')).toBeTruthy();
    });

    it('別アカウントの保存完了通知を無視する', async () => {
        const source = createCompletionSource();
        render(DraftListDialog, {
            props: createProps(source),
        });
        await waitFor(() => expect(mockLoadDrafts).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(source.size).toBe(1));

        source.emit({ draftId: 'other-draft', pubkeyHex: 'other-pubkey' });

        expect(mockLoadDrafts).toHaveBeenCalledTimes(1);
        expect(screen.queryByText('下書きを保存しました')).toBeNull();
    });

    it('アカウント切替後に古いアカウントの読み込み結果で上書きしない', async () => {
        let resolveAccountA:
            | ((drafts: Draft[]) => void)
            | undefined;
        let resolveAccountB:
            | ((drafts: Draft[]) => void)
            | undefined;
        mockLoadDrafts.mockImplementation(
            ({ pubkeyHex }: { pubkeyHex: string | null }) =>
                new Promise<Draft[]>((resolve) => {
                    if (pubkeyHex === 'account-a') resolveAccountA = resolve;
                    if (pubkeyHex === 'account-b') resolveAccountB = resolve;
                }),
        );
        const source = createCompletionSource();
        const { rerender } = render(DraftListDialog, {
            props: createProps(source, { pubkeyHex: 'account-a' }),
        });
        await waitFor(() => expect(resolveAccountA).toBeTypeOf('function'));

        await rerender(
            createProps(source, { pubkeyHex: 'account-b' }),
        );
        await waitFor(() => expect(resolveAccountB).toBeTypeOf('function'));
        resolveAccountB?.([createDraft('b', 'Account B')]);
        await waitFor(() => expect(screen.getByText('Account B')).toBeTruthy());

        resolveAccountA?.([createDraft('a', 'Account A')]);

        await Promise.resolve();
        expect(screen.queryByText('Account A')).toBeNull();
        expect(screen.getByText('Account B')).toBeTruthy();
    });

    it('アカウント切替時は旧一覧を即座に消し、新一覧の読込完了まで全操作と保存を無効にする', async () => {
        let resolveAccountB: ((drafts: Draft[]) => void) | undefined;
        mockLoadDrafts.mockImplementation(
            ({ pubkeyHex }: { pubkeyHex: string | null }) => {
                if (pubkeyHex === 'account-a') {
                    return Promise.resolve([createDraft('a', 'Account A')]);
                }
                return new Promise<Draft[]>((resolve) => {
                    resolveAccountB = resolve;
                });
            },
        );
        const source = createCompletionSource();
        const onApplyDraft = vi.fn();
        const { rerender } = render(DraftListDialog, {
            props: createProps(source, {
                pubkeyHex: 'account-a',
                onApplyDraft,
            }),
        });
        await waitFor(() => expect(screen.getByText('Account A')).toBeTruthy());

        const oldApplyButton = screen.getByRole('button', { name: /Account A/ });
        const oldDeleteButton = screen.getByRole('button', { name: '削除' });
        const oldPinButton = screen.getByRole('button', { name: 'ピン留め' });

        await rerender(createProps(source, {
            pubkeyHex: 'account-b',
            onApplyDraft,
        }));

        expect(screen.queryByText('Account A')).toBeNull();
        expect(screen.getByText('読み込み中...')).toBeTruthy();
        expect(
            screen.getByRole<HTMLButtonElement>('button', { name: '下書き保存' }).disabled,
        ).toBe(true);
        expect(
            screen.getByRole<HTMLButtonElement>('button', { name: '全て削除' }).disabled,
        ).toBe(true);

        await fireEvent.click(oldApplyButton);
        await fireEvent.click(oldDeleteButton);
        await fireEvent.click(oldPinButton);
        expect(onApplyDraft).not.toHaveBeenCalled();
        expect(mockDeleteDraft).not.toHaveBeenCalled();
        expect(mockToggleDraftPinned).not.toHaveBeenCalled();
        expect(mockDeleteAllDrafts).not.toHaveBeenCalled();

        resolveAccountB?.([createDraft('b', 'Account B')]);
        await waitFor(() => expect(screen.getByText('Account B')).toBeTruthy());
        expect(
            screen.getByRole<HTMLButtonElement>('button', { name: '下書き保存' }).disabled,
        ).toBe(false);
        expect(
            screen.getByRole<HTMLButtonElement>('button', { name: '削除' }).disabled,
        ).toBe(false);
        expect(
            screen.getByRole<HTMLButtonElement>('button', { name: 'ピン留め' }).disabled,
        ).toBe(false);
        expect(
            screen.getByRole<HTMLButtonElement>('button', { name: '全て削除' }).disabled,
        ).toBe(false);
    });

    it('アカウント切替前に開始したmutation完了結果を新アカウントへ反映しない', async () => {
        let resolveDelete: (() => void) | undefined;
        mockDeleteDraft.mockImplementation(
            () =>
                new Promise<void>((resolve) => {
                    resolveDelete = resolve;
                }),
        );
        mockLoadDrafts.mockImplementation(
            ({ pubkeyHex }: { pubkeyHex: string | null }) =>
                Promise.resolve(
                    pubkeyHex === 'account-a'
                        ? [createDraft('a', 'Account A')]
                        : [createDraft('b', 'Account B')],
                ),
        );
        const source = createCompletionSource();
        const { rerender } = render(DraftListDialog, {
            props: createProps(source, { pubkeyHex: 'account-a' }),
        });
        await waitFor(() => expect(screen.getByText('Account A')).toBeTruthy());

        await fireEvent.click(screen.getByRole('button', { name: '削除' }));
        await rerender(createProps(source, { pubkeyHex: 'account-b' }));
        await waitFor(() => expect(screen.getByText('Account B')).toBeTruthy());
        expect(
            screen.getByRole<HTMLButtonElement>('button', { name: '削除' }).disabled,
        ).toBe(false);

        resolveDelete?.();
        await Promise.resolve();
        await Promise.resolve();

        expect(screen.getByText('Account B')).toBeTruthy();
        expect(screen.queryByText('Account A')).toBeNull();
        expect(mockLoadDrafts).toHaveBeenCalledTimes(2);
    });

    it('現在のpubkeyで読み込み、削除後も同じ一覧更新経路を使う', async () => {
        const source = createCompletionSource();
        mockLoadDrafts
            .mockResolvedValueOnce([createDraft('draft-1', '削除対象')])
            .mockResolvedValueOnce([]);
        render(DraftListDialog, {
            props: createProps(source, { pubkeyHex: 'pubkey-2' }),
        });
        await waitFor(() => expect(screen.getByText('削除対象')).toBeTruthy());

        await fireEvent.click(screen.getByRole('button', { name: '削除' }));

        await waitFor(() =>
            expect(screen.getByText('下書きがありません')).toBeTruthy(),
        );
        expect(mockLoadDrafts).toHaveBeenNthCalledWith(1, {
            pubkeyHex: 'pubkey-2',
        });
        expect(mockLoadDrafts).toHaveBeenNthCalledWith(2, {
            pubkeyHex: 'pubkey-2',
        });
    });

    it('破棄時に保存完了購読を解除する', async () => {
        const source = createCompletionSource();
        const { unmount } = render(DraftListDialog, {
            props: createProps(source),
        });
        await waitFor(() => expect(source.size).toBe(1));

        unmount();

        expect(source.size).toBe(0);
        source.emit({ draftId: 'late-draft', pubkeyHex: 'pubkey' });
        expect(screen.queryByText('下書きを保存しました')).toBeNull();
    });
});
