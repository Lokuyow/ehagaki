import { describe, expect, it, vi, beforeEach } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import '../../i18n';
import { locale, waitLocale } from 'svelte-i18n';

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

const profileDataState = vi.hoisted(() => ({
    profileData: {
        name: '',
        displayName: '',
        picture: '',
        npub: '',
        nprofile: '',
    },
}));

vi.mock('../../lib/hooks/useFooterMiddleDisplay.svelte', () => ({
    useFooterMiddleDisplay: vi.fn(() => footerDisplayState),
}));

vi.mock('../../stores/profileStore.svelte', () => ({
    profileDataStore: {
        get value() {
            return profileDataState.profileData;
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
    beforeEach(async () => {
        footerDisplayState.sharedMediaError = null;
        footerDisplayState.progressDisplay = null;
        footerDisplayState.imageSizeDisplay = null;
        footerDisplayState.showingInfo = false;
        footerDisplayState.handleAbortAll.mockClear();
        profileStoreState.isLoadingProfile = false;
        profileStoreState.profileLoaded = false;
        profileDataState.profileData = {
            name: '',
            displayName: '',
            picture: '',
            npub: '',
            nprofile: '',
        };
        isLoadingProfileStore.set(false);
        profileLoadedStore.set(false);
        locale.set('ja');
        await waitLocale();
    });

    function renderFooter(props?: Partial<Parameters<typeof render>[1]['props']>) {
        return render(FooterComponent, {
            props: {
                isAuthenticated: true,
                isAuthInitialized: true,
                isSwitchingAccount: false,
                swNeedRefresh: false,
                onShowLoginDialog: vi.fn(),
                onPreloadPostHistoryDialog: vi.fn(),
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

    it('更新通知がないときの設定ボタンは通常のアクセシブルネームを持つ', () => {
        const { container } = renderFooter();

        const button = screen.getByRole('button', { name: '設定' });
        expect(button).toBeTruthy();
        expect(button.getAttribute('aria-label')).toBe('設定');
        expect(container.querySelector('.update-indicator')).toBeNull();
    });

    it('更新通知があるときの設定ボタンは更新通知を含むアクセシブルネームを持つ', async () => {
        const onOpenSettingsDialog = vi.fn();
        const { container } = renderFooter({
            swNeedRefresh: true,
            onOpenSettingsDialog,
        });

        const button = screen.getByRole('button', {
            name: '設定, アプリの更新があります',
        });
        expect(button).toBeTruthy();
        expect(button.getAttribute('aria-label')).toBe(
            '設定, アプリの更新があります',
        );
        expect(container.querySelector('.update-indicator')).toBeTruthy();

        await fireEvent.click(button);

        expect(onOpenSettingsDialog).toHaveBeenCalledOnce();
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

    it('投稿履歴ボタンの hover focus pointerdown で module preload callback を呼ぶ', async () => {
        const onPreloadPostHistoryDialog = vi.fn();

        renderFooter({ onPreloadPostHistoryDialog });

        const button = screen.getByRole('button', { name: '投稿履歴を開く' });

        await fireEvent.mouseEnter(button);
        await fireEvent.focus(button);
        await fireEvent.pointerDown(button);

        expect(onPreloadPostHistoryDialog).toHaveBeenCalledTimes(3);
    });

    it('未認証なら情報表示なしでも投稿履歴ボタンを表示しない', () => {
        renderFooter({ isAuthenticated: false });

        expect(screen.queryByRole('button', { name: '投稿履歴を開く' })).toBeNull();
    });

    it('プロフィールボタンは初期化中・読込中・読込済みでローカライズされた名前を持つ', async () => {
        renderFooter({
            isAuthInitialized: false,
            isAuthenticated: true,
        });

        expect(screen.getByRole('button', { name: 'プロフィール' })).toBeTruthy();

        profileStoreState.isLoadingProfile = true;
        profileStoreState.profileLoaded = true;
        isLoadingProfileStore.set(true);
        profileLoadedStore.set(true);
        cleanup();
        renderFooter({
            isAuthenticated: true,
            isAuthInitialized: true,
        });

        expect(screen.getByRole('button', { name: 'プロフィール' })).toBeTruthy();

        profileStoreState.isLoadingProfile = false;
        profileStoreState.profileLoaded = true;
        isLoadingProfileStore.set(false);
        profileLoadedStore.set(true);
        cleanup();
        renderFooter({
            isAuthenticated: true,
            isAuthInitialized: true,
        });

        expect(screen.getByRole('button', { name: 'プロフィール' })).toBeTruthy();
        expect(screen.getByLabelText('プロフィール画像')).toBeTruthy();

        locale.set('en');
        await waitLocale();
        cleanup();
        renderFooter({
            isAuthenticated: true,
            isAuthInitialized: true,
        });

        expect(screen.getByRole('button', { name: 'Profile' })).toBeTruthy();
        expect(screen.getByLabelText('Profile image')).toBeTruthy();
    });

    it('プロフィール名・画像名が日本語と英語で切り替わる', async () => {
        profileDataState.profileData = {
            name: '',
            displayName: '',
            picture: 'https://example.com/avatar.png',
            npub: '',
            nprofile: '',
        };

        profileStoreState.isLoadingProfile = false;
        profileStoreState.profileLoaded = true;
        isLoadingProfileStore.set(false);
        profileLoadedStore.set(true);
        cleanup();
        renderFooter({
            isAuthenticated: true,
            isAuthInitialized: true,
        });

        expect(screen.getByAltText('プロフィール')).toBeTruthy();

        locale.set('en');
        await waitLocale();
        cleanup();
        renderFooter({
            isAuthenticated: true,
            isAuthInitialized: true,
        });

        expect(screen.getByAltText('Profile')).toBeTruthy();
        expect(screen.queryByAltText('User')).toBeNull();
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

    it('アカウント切替中はスピナーを優先し、profile-display を無効化する', async () => {
        const onOpenLogoutDialog = vi.fn();
        profileDataState.profileData.picture = 'https://example.com/avatar.png';
        isLoadingProfileStore.set(false);
        profileLoadedStore.set(true);

        const { container } = renderFooter({
            isSwitchingAccount: true,
            onOpenLogoutDialog,
        });
        const button = screen.getByRole('button', {
            name: 'アカウントを切り替えています',
        });

        expect(button).toBeTruthy();
        expect(button).toBe(container.querySelector('button.profile-display'));
        expect(button.hasAttribute('disabled')).toBe(true);
        expect(button.getAttribute('aria-busy')).toBe('true');
        expect(container.querySelector('.inline-spinner')).toBeTruthy();
        expect(container.querySelector('.loader-container')).toBeNull();
        expect(container.querySelector('.profile-picture')).toBeNull();

        await fireEvent.click(button);

        expect(onOpenLogoutDialog).not.toHaveBeenCalled();
    });

    it('アカウント切替中のアクセシブルネームを英語でも表示する', async () => {
        locale.set('en');
        await waitLocale();

        renderFooter({ isSwitchingAccount: true });

        const button = screen.getByRole('button', { name: 'Switching account' });
        expect(button.getAttribute('aria-label')).toBe('Switching account');
        expect(button.getAttribute('aria-busy')).toBe('true');
    });

    it('プロフィール読込中の profile-display はアバターではなくローダーを表示する', () => {
        isLoadingProfileStore.set(true);
        profileLoadedStore.set(true);

        const { container } = renderFooter();

        expect(container.querySelector('.loading-placeholder')).toBeTruthy();
        expect(container.querySelector('.profile-picture')).toBeNull();
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
