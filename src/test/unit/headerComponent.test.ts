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
    it('ヘッダーに下書き保存ボタンがなく、宛先指定ボタンが最右に表示される', async () => {
        const onChooseTarget = vi.fn();
        const { container } = render(HeaderComponent, {
            props: {
                onResetPostContent: vi.fn(),
                onShowDraftList: vi.fn(),
                onChooseTarget,
                showMascot: false,
                showFlavorText: false,
            },
        });

        const buttons = Array.from(
            container.querySelectorAll('.buttons-container button'),
        );
        expect(screen.queryByRole('button', { name: '下書き保存' })).toBeNull();
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

    it('投稿できない空本文でも canResetPostContent が true ならクリアできる', async () => {
        const onResetPostContent = vi.fn();

        render(HeaderComponent, {
            props: {
                onResetPostContent,
                onShowDraftList: vi.fn(),
                canResetPostContent: true,
                showMascot: false,
                showFlavorText: false,
            },
        });

        await fireEvent.click(screen.getByRole('button', { name: 'エディターをクリア' }));

        expect(onResetPostContent).toHaveBeenCalledOnce();
    });
});
