import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { readable } from 'svelte/store';

const mockTranslate = vi.hoisted(() => (key: string) => {
    const translations: Record<string, string> = {
        'postComponent.clear_editor': 'エディターをクリア',
        'draft.list_title': '下書き一覧',
        'draft.save': '下書き保存',
        'draft.saved': '下書きを保存しました',
        'balloonMessage.success.compact_post_success': '投稿完了',
        'composerTarget.title': '宛先を指定',
    };

    return translations[key] || key;
});

vi.mock('svelte-i18n', () => ({
    _: readable(mockTranslate),
}));

import HeaderComponent from '../../components/HeaderComponent.svelte';

describe('HeaderComponent', () => {
    it('下書き保存の後ろに宛先指定ボタンを表示してcallbackを呼ぶ', async () => {
        const onChooseTarget = vi.fn();
        const { container } = render(HeaderComponent, {
            props: {
                onResetPostContent: vi.fn(),
                onSaveDraft: vi.fn(async () => true),
                onShowDraftList: vi.fn(),
                onChooseTarget,
                showMascot: false,
                showFlavorText: false,
            },
        });

        const buttons = Array.from(
            container.querySelectorAll('.buttons-container button'),
        );
        expect(buttons.at(-1)?.getAttribute('aria-label')).toBe('宛先を指定');
        expect(container.querySelector('.choose-target-icon')).toBeTruthy();
        expect(container.textContent).not.toContain('@');

        await fireEvent.click(screen.getByRole('button', { name: '宛先を指定' }));
        expect(onChooseTarget).toHaveBeenCalledOnce();
    });

    it('header actions button 押下前に focus 移動を抑止し、activeElement を維持する', () => {
        const editor = document.createElement('textarea');
        document.body.append(editor);
        editor.focus();

        const { container } = render(HeaderComponent, {
            props: {
                onResetPostContent: vi.fn(),
                onSaveDraft: vi.fn(async () => true),
                onShowDraftList: vi.fn(),
                showMascot: false,
                showFlavorText: false,
            },
        });

        expect(container.querySelector('.header-actions')).toBeTruthy();

        const button = screen.getByRole('button', { name: '下書き一覧' });
        const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true });

        expect(button.dispatchEvent(event)).toBe(false);
        expect(event.defaultPrevented).toBe(true);
        expect(document.activeElement).toBe(editor);
    });

    it('async な下書き保存後も保存ポップアップを表示できる', async () => {
        let resolveSave: (value: boolean) => void = () => { };
        const onSaveDraft = vi.fn(() => new Promise<boolean>((resolve) => {
            resolveSave = resolve;
        }));

        render(HeaderComponent, {
            props: {
                onResetPostContent: vi.fn(),
                onSaveDraft,
                onShowDraftList: vi.fn(),
                showMascot: false,
                showFlavorText: false,
            },
        });

        await fireEvent.click(screen.getByRole('button', { name: '下書き保存' }));
        resolveSave(true);

        await waitFor(() => {
            expect(screen.getByText('下書きを保存しました')).toBeTruthy();
        });
    });

    it('投稿できない空本文でも canSaveDraft が true なら下書き保存できる', async () => {
        const onSaveDraft = vi.fn(async () => true);

        render(HeaderComponent, {
            props: {
                onResetPostContent: vi.fn(),
                onSaveDraft,
                onShowDraftList: vi.fn(),
                canSaveDraft: true,
                showMascot: false,
                showFlavorText: false,
            },
        });

        await fireEvent.click(screen.getByRole('button', { name: '下書き保存' }));

        expect(onSaveDraft).toHaveBeenCalledOnce();
    });

    it('投稿できない空本文でも canResetPostContent が true ならクリアできる', async () => {
        const onResetPostContent = vi.fn();

        render(HeaderComponent, {
            props: {
                onResetPostContent,
                onSaveDraft: vi.fn(async () => true),
                onShowDraftList: vi.fn(),
                canResetPostContent: true,
                showMascot: false,
                showFlavorText: false,
            },
        });

        await fireEvent.click(screen.getByRole('button', { name: 'エディターをクリア' }));

        expect(onResetPostContent).toHaveBeenCalledOnce();
    });

    it('canSaveDraft が false なら下書き保存ボタンを無効化する', () => {
        render(HeaderComponent, {
            props: {
                onResetPostContent: vi.fn(),
                onSaveDraft: vi.fn(async () => true),
                onShowDraftList: vi.fn(),
                canSaveDraft: false,
                showMascot: false,
                showFlavorText: false,
            },
        });

        expect(screen.getByRole<HTMLButtonElement>('button', { name: '下書き保存' }).disabled).toBe(true);
    });
});
