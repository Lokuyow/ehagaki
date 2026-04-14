import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { readable } from 'svelte/store';

const mockTranslate = vi.hoisted(() => (key: string) => {
    const translations: Record<string, string> = {
        'loginDialog.input_secret': '秘密鍵の入力',
        'loginDialog.hint_input_secret': 'nsec1から始まる秘密鍵を入力',
        'loginDialog.add_account_title': 'アカウントを追加',
        'loginDialog.add_account_hint': '追加するアカウントでログイン',
        'loginDialog.login_with_parent_client': '親クライアント連携でログイン',
        'loginDialog.parent_client_hint': '親ページ側でログインを許可すると接続します',
        'loginDialog.parent_client_timeout': '親ページからの応答がありませんでした',
        'loginDialog.parent_client_auth_error': '親クライアント連携に失敗しました',
        'loginDialog.login_with_extension': 'ブラウザ拡張機能でログイン',
        'loginDialog.extension_login_failed': 'ブラウザ拡張機能でのログインに失敗しました',
        'loginDialog.extension_not_found': 'NIP-07対応の拡張機能が見つかりません',
        'loginDialog.bunker_input_title': 'バンカーURLを入力',
        'loginDialog.bunker_connect': '接続',
        'loginDialog.bunker_connection_failed': '接続に失敗しました',
        'loginDialog.bunker_invalid': '無効なbunker URLです',
        'loginDialog.bunker_url_required': 'バンカーURLを入力してください',
        'loginDialog.save': '保存',
        'loadingPlaceholder.loading': '読み込み中...',
    };

    return translations[key] || key;
});

vi.mock('svelte-i18n', () => ({
    _: readable(mockTranslate),
}));

vi.mock('../../lib/hooks/useDialogHistory.svelte', () => ({
    useDialogHistory: vi.fn(),
}));

vi.mock('../../lib/nip46Service', () => ({
    BUNKER_REGEX: /^bunker:\/\/.+$/,
}));

vi.mock('../../lib/keyManager.svelte', () => ({
    PublicKeyState: class MockPublicKeyState {
        private valid = false;
        private npubValue = '';
        private nprofileValue = '';

        setNsec(value: string) {
            this.valid = value.startsWith('nsec1');
            this.npubValue = this.valid ? 'npub1test' : '';
            this.nprofileValue = this.valid ? 'nprofile1test' : '';
        }

        get isValid() {
            return this.valid;
        }

        get npub() {
            return this.npubValue;
        }

        get nprofile() {
            return this.nprofileValue;
        }
    },
}));

import LoginDialog from '../../components/LoginDialog.svelte';

describe('LoginDialog', () => {
    const defaultProps = {
        show: true,
        secretKey: '',
        onClose: vi.fn(),
        onSave: vi.fn(),
        onParentClientLogin: vi.fn().mockResolvedValue(undefined),
        onNip07Login: vi.fn(),
        onNip46Login: vi.fn().mockResolvedValue(undefined),
        isParentClientAvailable: true,
        isLoadingParentClient: false,
        isNip07ExtensionAvailable: true,
        isLoadingNip07: false,
        isLoadingNip46: false,
        isAddAccountMode: false,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('親クライアント連携が利用可能なとき案内文を表示する', () => {
        render(LoginDialog, {
            props: defaultProps,
        });

        expect(screen.getByText('親クライアント連携でログイン')).toBeTruthy();
        expect(
            screen.getByText('親ページ側でログインを許可すると接続します'),
        ).toBeTruthy();
    });

    it('親クライアント連携ログイン失敗時にローカライズ済みエラーを表示する', async () => {
        const onParentClientLogin = vi
            .fn<() => Promise<string | undefined>>()
            .mockResolvedValue('parent_client_timeout');

        render(LoginDialog, {
            props: {
                ...defaultProps,
                onParentClientLogin,
            },
        });

        await fireEvent.click(
            screen.getByText('親クライアント連携でログイン'),
        );

        expect(onParentClientLogin).toHaveBeenCalledTimes(1);
        expect(
            await screen.findByText('親ページからの応答がありませんでした'),
        ).toBeTruthy();
    });

    it('親クライアント連携エラーはダイアログ再表示でクリアされる', async () => {
        const onParentClientLogin = vi
            .fn<() => Promise<string | undefined>>()
            .mockResolvedValue('parent_client_timeout');

        const { rerender } = render(LoginDialog, {
            props: {
                ...defaultProps,
                onParentClientLogin,
            },
        });

        await fireEvent.click(
            screen.getByText('親クライアント連携でログイン'),
        );
        expect(
            await screen.findByText('親ページからの応答がありませんでした'),
        ).toBeTruthy();

        await rerender({
            ...defaultProps,
            onParentClientLogin,
            show: false,
        });

        await rerender({
            ...defaultProps,
            onParentClientLogin,
            show: true,
        });

        expect(
            screen.queryByText('親ページからの応答がありませんでした'),
        ).toBeFalsy();
        expect(
            screen.getByText('親ページ側でログインを許可すると接続します'),
        ).toBeTruthy();
    });

    it('NIP-07 が利用不可のとき未検出メッセージを表示する', () => {
        render(LoginDialog, {
            props: {
                ...defaultProps,
                isNip07ExtensionAvailable: false,
            },
        });

        expect(
            screen.getByText('NIP-07対応の拡張機能が見つかりません'),
        ).toBeTruthy();
    });

    it('NIP-07 ログイン失敗時にエラーを表示する', async () => {
        const onNip07Login = vi
            .fn<() => Promise<string | undefined>>()
            .mockResolvedValue('nip07_auth_error');

        render(LoginDialog, {
            props: {
                ...defaultProps,
                onNip07Login,
            },
        });

        await fireEvent.click(screen.getByText('ブラウザ拡張機能でログイン'));

        expect(onNip07Login).toHaveBeenCalledTimes(1);
        expect(
            await screen.findByText('ブラウザ拡張機能でのログインに失敗しました'),
        ).toBeTruthy();
    });

    it('NIP-46 ログイン失敗時にエラーを表示する', async () => {
        const onNip46Login = vi
            .fn<(bunkerUrl: string) => Promise<string | undefined>>()
            .mockResolvedValue('nip46_connection_failed');

        render(LoginDialog, {
            props: {
                ...defaultProps,
                onNip46Login,
            },
        });

        const bunkerInput = screen.getByPlaceholderText('bunker://...');
        await fireEvent.input(bunkerInput, {
            target: { value: 'bunker://example?relay=wss://relay.example.com' },
        });
        await fireEvent.click(screen.getByText('接続'));

        expect(onNip46Login).toHaveBeenCalledTimes(1);
        expect(await screen.findByText('接続に失敗しました')).toBeTruthy();
    });
});