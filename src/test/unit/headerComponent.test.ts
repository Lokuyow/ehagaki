import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { readable } from 'svelte/store';

const mockTranslate = vi.hoisted(() => (key: string) => {
    const translations: Record<string, string> = {
        'postComponent.clear_editor': 'エディターをクリア',
        'draft.list_title': '下書き',
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
import { configureAppRuntimeEnvironment } from '../../lib/appRuntimeEnvironment';

describe('HeaderComponent', () => {
    afterEach(() => {
        configureAppRuntimeEnvironment({
            runtimeKind: 'standalone',
            appHomeHref: './',
        });
    });

    it('通常版では runtime の配信元ホームへ同じタブで戻る', () => {
        configureAppRuntimeEnvironment({
            runtimeKind: 'standalone',
            appHomeHref: '/custom-app/',
        });

        const { container } = render(HeaderComponent, {
            props: {
                onResetPostContent: vi.fn(),
                onShowDraftList: vi.fn(),
                showFlavorText: false,
            },
        });

        const link = container.querySelector<HTMLAnchorElement>('.site-icon-link')!;
        expect(link.getAttribute('href')).toBe('/custom-app/');
        expect(link.getAttribute('target')).toBeNull();
        expect(link.getAttribute('rel')).toBeNull();
        expect(link.getAttribute('href')).not.toBe('https://lokuyow.github.io/ehagaki/');
    });

    it('Web Component では公式サイトを新しいタブで開く', () => {
        configureAppRuntimeEnvironment({ runtimeKind: 'web-component' });

        const { container } = render(HeaderComponent, {
            props: {
                onResetPostContent: vi.fn(),
                onShowDraftList: vi.fn(),
                showFlavorText: false,
            },
        });

        const link = container.querySelector<HTMLAnchorElement>('.site-icon-link')!;
        expect(link.getAttribute('href')).toBe('https://lokuyow.github.io/ehagaki/');
        expect(link.getAttribute('target')).toBe('_blank');
        expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    });

    it('showMascot=false ではサイトアイコンリンクを表示しない', () => {
        const { container } = render(HeaderComponent, {
            props: {
                onResetPostContent: vi.fn(),
                onShowDraftList: vi.fn(),
                showMascot: false,
                showFlavorText: false,
            },
        });

        expect(container.querySelector('.site-icon-link')).toBeNull();
    });

    it('ヘッダーに下書き保存ボタンがなく、宛先指定ボタンが最右に表示される', async () => {
        const onChooseTarget = vi.fn();
        const onShowDraftList = vi.fn();
        const { container } = render(HeaderComponent, {
            props: {
                onResetPostContent: vi.fn(),
                onShowDraftList,
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

        await fireEvent.click(screen.getByRole('button', { name: '下書き' }));
        expect(onShowDraftList).toHaveBeenCalledOnce();

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

        const button = screen.getByRole('button', { name: '下書き' });
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
