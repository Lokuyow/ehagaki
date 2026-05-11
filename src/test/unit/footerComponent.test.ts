import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { readable } from 'svelte/store';

const mockTranslate = vi.hoisted(() => (key: string) => {
    const translations: Record<string, string> = {
        'app.login': 'ログイン',
        'postHistory.open': '投稿履歴を開く',
    };

    return translations[key] || key;
});

const footerDisplayState = vi.hoisted(() => ({
    sharedMediaError: null as string | null,
    progressDisplay: null as any,
    imageSizeDisplay: null as any,
    showingInfo: false,
    handleAbortAll: vi.fn(),
}));

vi.mock('svelte-i18n', () => ({
    _: readable(mockTranslate),
}));

vi.mock('../../lib/hooks/useFooterMiddleDisplay.svelte', () => ({
    useFooterMiddleDisplay: vi.fn(() => footerDisplayState),
}));

import FooterComponent from '../../components/FooterComponent.svelte';

describe('FooterComponent', () => {
    beforeEach(() => {
        footerDisplayState.sharedMediaError = null;
        footerDisplayState.progressDisplay = null;
        footerDisplayState.imageSizeDisplay = null;
        footerDisplayState.showingInfo = false;
        footerDisplayState.handleAbortAll.mockClear();
    });

    function renderFooter(props?: Partial<Parameters<typeof render>[1]['props']>) {
        return render(FooterComponent, {
            props: {
                isAuthenticated: true,
                isAuthInitialized: true,
                swNeedRefresh: false,
                onShowLoginDialog: vi.fn(),
                onWarmPostHistoryDialog: vi.fn(),
                onOpenPostHistoryDialog: vi.fn(),
                onOpenSettingsDialog: vi.fn(),
                onOpenLogoutDialog: vi.fn(),
                ...props,
            },
        });
    }

    it('FooterMiddleDisplay が情報表示中なら投稿履歴ボタンを表示しない', () => {
        footerDisplayState.sharedMediaError = '共有メディアエラー';
        footerDisplayState.showingInfo = true;

        renderFooter();

        expect(screen.queryByRole('button', { name: '投稿履歴を開く' })).toBeNull();
        expect(screen.getByText('共有メディアエラー')).toBeTruthy();
    });

    it('情報表示なし、かつ認証済みなら投稿履歴ボタンを表示して押下できる', async () => {
        const onOpenPostHistoryDialog = vi.fn();

        renderFooter({ onOpenPostHistoryDialog });

        const button = screen.getByRole('button', { name: '投稿履歴を開く' });
        expect(button.className).toContain('post-history-btn');
        expect(button.querySelector('.post-history-icon')).toBeTruthy();

        await fireEvent.click(button);

        expect(onOpenPostHistoryDialog).toHaveBeenCalledOnce();
    });

    it('投稿履歴ボタンの hover focus pointerdown で warmup callback を呼ぶ', async () => {
        const onWarmPostHistoryDialog = vi.fn();

        renderFooter({ onWarmPostHistoryDialog });

        const button = screen.getByRole('button', { name: '投稿履歴を開く' });

        await fireEvent.mouseEnter(button);
        await fireEvent.focus(button);
        await fireEvent.pointerDown(button);

        expect(onWarmPostHistoryDialog).toHaveBeenCalledTimes(3);
    });

    it('未認証なら情報表示なしでも投稿履歴ボタンを表示しない', () => {
        renderFooter({ isAuthenticated: false });

        expect(screen.queryByRole('button', { name: '投稿履歴を開く' })).toBeNull();
    });
});
