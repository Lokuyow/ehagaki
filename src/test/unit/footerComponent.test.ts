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

const profileStoreState = vi.hoisted(() => ({
    isLoadingProfile: false,
    profileLoaded: false,
}));

vi.mock('svelte-i18n', () => ({
    _: readable(mockTranslate),
}));

vi.mock('../../lib/hooks/useFooterMiddleDisplay.svelte', () => ({
    useFooterMiddleDisplay: vi.fn(() => footerDisplayState),
}));

vi.mock('../../stores/profileStore.svelte', () => ({
    profileDataStore: {
        get value() {
            return { name: '', displayName: '', picture: '', npub: '', nprofile: '' };
        },
        set: vi.fn(),
    },
    profileLoadedStore: {
        get value() {
            return profileStoreState.profileLoaded;
        },
        set: (value: boolean) => {
            profileStoreState.profileLoaded = value;
        },
    },
    isLoadingProfileStore: {
        get value() {
            return profileStoreState.isLoadingProfile;
        },
        set: (value: boolean) => {
            profileStoreState.isLoadingProfile = value;
        },
    },
}));

import { isLoadingProfileStore, profileLoadedStore } from '../../stores/profileStore.svelte';

import FooterComponent from '../../components/FooterComponent.svelte';

describe('FooterComponent', () => {
    beforeEach(() => {
        footerDisplayState.sharedMediaError = null;
        footerDisplayState.progressDisplay = null;
        footerDisplayState.imageSizeDisplay = null;
        footerDisplayState.showingInfo = false;
        footerDisplayState.handleAbortAll.mockClear();
        profileStoreState.isLoadingProfile = false;
        profileStoreState.profileLoaded = false;
        isLoadingProfileStore.set(false);
        profileLoadedStore.set(false);
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

    it('プロフィール読込中でも profile-display ボタン押下でログアウトダイアログを開ける', async () => {
        const onOpenLogoutDialog = vi.fn();
        isLoadingProfileStore.set(true);
        profileLoadedStore.set(true);

        const { container } = renderFooter({ onOpenLogoutDialog });
        const button = container.querySelector('button.profile-display');

        expect(button).toBeTruthy();
        expect(button?.className).toContain('loading');
        expect(button?.hasAttribute('disabled')).toBe(false);

        await fireEvent.click(button as HTMLButtonElement);

        expect(onOpenLogoutDialog).toHaveBeenCalledOnce();
    });

    it('初期化中でも認証済みなら profile-display ボタン押下でログアウトダイアログを開ける', async () => {
        const onOpenLogoutDialog = vi.fn();

        const { container } = renderFooter({
            isAuthInitialized: false,
            isAuthenticated: true,
            onOpenLogoutDialog,
        });
        const button = container.querySelector('button.profile-display');

        expect(button).toBeTruthy();
        expect(button?.className).toContain('loading');
        expect(button?.className).toContain('default');
        expect(button?.hasAttribute('disabled')).toBe(false);

        await fireEvent.click(button as HTMLButtonElement);

        expect(onOpenLogoutDialog).toHaveBeenCalledOnce();
    });

    it('初期化中かつ未認証でも profile-display ボタン押下でログアウトダイアログを開ける', async () => {
        const onOpenLogoutDialog = vi.fn();

        const { container } = renderFooter({
            isAuthInitialized: false,
            isAuthenticated: false,
            onOpenLogoutDialog,
        });
        const button = container.querySelector('button.profile-display');

        expect(button).toBeTruthy();
        expect(button?.className).toContain('loading');
        expect(button?.className).toContain('default');
        expect(button?.hasAttribute('disabled')).toBe(false);

        await fireEvent.click(button as HTMLButtonElement);

        expect(onOpenLogoutDialog).toHaveBeenCalledOnce();
    });
});
