import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { readable } from 'svelte/store';

// svelte-i18nのモック（vi.hoistedで先に定義）
const mockTranslate = vi.hoisted(() => (key: string) => {
    const translations: Record<string, string> = {
        'common.ok': 'OK',
        'common.cancel': 'キャンセル',
        'common.confirm': '確認',
        'test.message': 'テストメッセージ'
    };
    return translations[key] || key;
});

vi.mock('svelte-i18n', () => ({
    _: readable(mockTranslate)
}));

// useDialogHistoryのモック
vi.mock('../../lib/hooks/useDialogHistory.svelte', () => ({
    useDialogHistory: vi.fn()
}));

import ConfirmDialog from '../../components/ConfirmDialog.svelte';

describe('ConfirmDialog', () => {
    const mockOnConfirm = vi.fn();
    const mockOnCancel = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('デフォルトのラベルで正しくレンダリングされる', () => {
        render(ConfirmDialog, {
            props: {
                open: true,
                description: 'テストメッセージ',
                onConfirm: mockOnConfirm,
                onCancel: mockOnCancel
            }
        });

        // デフォルトのボタンラベルが表示される
        expect(screen.getByText('OK')).toBeTruthy();
        expect(screen.getByText('キャンセル')).toBeTruthy();
    });

    it('カスタムラベルで正しくレンダリングされる', () => {
        render(ConfirmDialog, {
            props: {
                open: true,
                description: 'テストメッセージ',
                confirmLabel: '実行',
                cancelLabel: '戻る',
                onConfirm: mockOnConfirm,
                onCancel: mockOnCancel
            }
        });

        expect(screen.getByText('実行')).toBeTruthy();
        expect(screen.getByText('戻る')).toBeTruthy();
    });

    it('descriptionが表示される', () => {
        render(ConfirmDialog, {
            props: {
                open: true,
                description: 'これは確認メッセージです',
                onConfirm: mockOnConfirm
            }
        });

        // descriptionはvisually-hiddenとconfirm-dialog-messageの2箇所に表示される
        const elements = screen.getAllByText('これは確認メッセージです');
        expect(elements.length).toBeGreaterThanOrEqual(1);
    });

    it('確認ボタンをクリックするとonConfirmが呼ばれる', async () => {
        render(ConfirmDialog, {
            props: {
                open: true,
                description: 'テストメッセージ',
                onConfirm: mockOnConfirm,
                onCancel: mockOnCancel
            }
        });

        const confirmButton = screen.getByText('OK');
        await fireEvent.click(confirmButton);

        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    it('キャンセルボタンをクリックするとonCancelが呼ばれる', async () => {
        render(ConfirmDialog, {
            props: {
                open: true,
                description: 'テストメッセージ',
                onConfirm: mockOnConfirm,
                onCancel: mockOnCancel
            }
        });

        const cancelButton = screen.getByText('キャンセル');
        await fireEvent.click(cancelButton);

        expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('confirmVariant="danger"が正しく適用される', () => {
        const { container } = render(ConfirmDialog, {
            props: {
                open: true,
                description: 'テストメッセージ',
                confirmVariant: 'danger',
                onConfirm: mockOnConfirm
            }
        });

        const confirmButton = screen.getByText('OK');
        // Buttonコンポーネントが"danger"クラスを持つことを確認
        expect(confirmButton.classList.contains('danger')).toBe(true);
    });

    it('confirmDisabledがtrueの場合、確認ボタンが無効化される', () => {
        render(ConfirmDialog, {
            props: {
                open: true,
                description: 'テストメッセージ',
                confirmDisabled: true,
                onConfirm: mockOnConfirm
            }
        });

        const confirmButton = screen.getByText('OK') as HTMLButtonElement;
        expect(confirmButton.disabled).toBe(true);
    });

    it('contentClassが正しく適用される', () => {
        render(ConfirmDialog, {
            props: {
                open: true,
                description: 'テストメッセージ',
                contentClass: 'custom-confirm-dialog',
                onConfirm: mockOnConfirm
            }
        });

        // DialogWrapperに渡されたcontentClassが適用されることを確認
        // ポータルでbodyに直接レンダリングされるためdocument.bodyから検索
        const dialog = document.body.querySelector('.custom-confirm-dialog');
        expect(dialog).toBeTruthy();
    });

    it('open=falseの場合、ダイアログが表示されない', () => {
        render(ConfirmDialog, {
            props: {
                open: false,
                description: 'テストメッセージ',
                onConfirm: mockOnConfirm
            }
        });

        // メッセージが表示されないことを確認
        expect(screen.queryByText('テストメッセージ')).toBeFalsy();
    });

    it('titleがスクリーンリーダー用に設定される', () => {
        render(ConfirmDialog, {
            props: {
                open: true,
                title: 'カスタムタイトル',
                description: 'テストメッセージ',
                onConfirm: mockOnConfirm
            }
        });

        // titleはvisually-hiddenクラスで隠されているがDOMには存在
        const title = screen.getByText('カスタムタイトル');
        expect(title).toBeTruthy();
        expect(title.classList.contains('visually-hidden')).toBe(true);
    });

    it('titleが指定されない場合、デフォルトで"common.confirm"が使用される', () => {
        render(ConfirmDialog, {
            props: {
                open: true,
                description: 'テストメッセージ',
                onConfirm: mockOnConfirm
            }
        });

        // デフォルトのタイトル"確認"が使用される
        const title = screen.getByText('確認');
        expect(title).toBeTruthy();
    });
});
