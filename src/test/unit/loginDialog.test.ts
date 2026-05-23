import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
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
        'loginDialog.parent_client_not_logged_in': '親ページ側でログインしてから再度お試しください',
        'loginDialog.parent_client_auth_error': '親クライアント連携に失敗しました',
        'loginDialog.login_with_extension': 'ブラウザ拡張機能でログイン',
        'loginDialog.extension_login_failed': 'ブラウザ拡張機能でのログインに失敗しました',
        'loginDialog.extension_not_found': 'NIP-07対応の拡張機能が見つかりません',
        'loginDialog.bunker_input_title': 'バンカーURLを入力',
        'loginDialog.bunker_connect': '接続',
        'loginDialog.bunker_connection_failed': '接続に失敗しました',
        'loginDialog.bunker_invalid': '無効なbunker URLです',
        'loginDialog.bunker_url_required': 'バンカーURLを入力してください',
        'loginDialog.remote_signer_title': 'リモートサイナーで接続',
        'loginDialog.nostrconnect_qr_tab': 'QRコード',
        'loginDialog.nostrconnect_bunker_tab': 'bunker:// を入力',
        'loginDialog.nostrconnect_qr_alt': 'Nostr Connect QR コード',
        'loginDialog.nostrconnect_scan_hint': '対応するリモートサイナーで QR コードを読み取るか、接続 URI を開いてください。',
        'loginDialog.nostrconnect_uri_label': '接続 URI',
        'loginDialog.nostrconnect_relay_label': 'NIP-46 接続 relay',
        'loginDialog.nostrconnect_input_title': 'Nostr Connect コードを作成',
        'loginDialog.nostrconnect_relay_hint': 'この relay は、eHagaki とリモートサイナーが接続するために使用します。',
        'loginDialog.nostrconnect_relay_switch_hint': 'リモートサイナーが relay 切替に対応している場合、接続後に別の relay へ切り替わることがあります。',
        'loginDialog.nostrconnect_relay_update_hint': 'relay を変更すると、QR コードと接続 URI が更新されます。',
        'loginDialog.nostrconnect_relay_placeholder': 'wss://relay.example.com',
        'loginDialog.nostrconnect_relay_required': 'NIP-46 接続には1件以上の relay が必要です。',
        'loginDialog.nostrconnect_relay_invalid': 'relay の形式が正しくありません。',
        'loginDialog.nostrconnect_generate': '接続コードを表示',
        'loginDialog.nostrconnect_waiting': '接続を待っています...',
        'loginDialog.nostrconnect_idle': '接続待機は停止しています。',
        'loginDialog.nostrconnect_copy': '接続 URI をコピー',
        'loginDialog.nostrconnect_copied': '接続 URI をコピーしました',
        'loginDialog.nostrconnect_open': 'リモートサイナーで開く',
        'loginDialog.nostrconnect_edit_relays': '接続 relay を変更',
        'loginDialog.nostrconnect_add_relay': 'relay を追加',
        'loginDialog.nostrconnect_remove_relay': 'relay を削除',
        'loginDialog.nostrconnect_reset_relays': '初期値に戻す',
        'loginDialog.nostrconnect_cancel_waiting': '接続をキャンセル',
        'loginDialog.nostrconnect_timeout': 'リモートサイナーからの接続が時間内に完了しませんでした',
        'loginDialog.nostrconnect_relay_reconciliation_failed': '接続後の final relay を確定できませんでした',
        'loginDialog.nostrconnect_connection_failed': 'リモートサイナーとの接続に失敗しました。接続 relay またはリモートサイナーの状態を確認してください。',
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
    sanitizeNip46NostrConnectRelays: vi.fn((relays: string[]) =>
        relays.filter((relay) => relay.startsWith('wss://')),
    ),
}));

vi.mock('../../lib/utils/clipboardUtils', () => ({
    tryCopyToClipboard: vi.fn().mockResolvedValue(true),
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
import { DEFAULT_NIP46_CONNECTION_RELAYS } from '../../lib/nip46ConnectUiUtils';

describe('LoginDialog', () => {
    const defaultProps = {
        show: true,
        secretKey: '',
        onClose: vi.fn(),
        onSave: vi.fn(),
        onParentClientLogin: vi.fn().mockResolvedValue(undefined),
        onNip07Login: vi.fn(),
        onNip46Login: vi.fn().mockResolvedValue(undefined),
        onNostrConnectStart: undefined,
        onNostrConnectCancel: undefined,
        isParentClientAvailable: true,
        isLoadingParentClient: false,
        isNip07ExtensionAvailable: true,
        isLoadingNip07: false,
        isLoadingNip46: false,
        isWaitingNip46NostrConnect: false,
        nip46NostrConnectUri: null,
        nip46NostrConnectErrorMessage: '',
        initialNostrConnectRelays: [...DEFAULT_NIP46_CONNECTION_RELAYS],
        isAddAccountMode: false,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
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

    it('親クライアント未ログイン時に専用メッセージを表示する', async () => {
        const onParentClientLogin = vi
            .fn<() => Promise<string | undefined>>()
            .mockResolvedValue('parent_client_not_logged_in');

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
            await screen.findByText('親ページ側でログインしてから再度お試しください'),
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

        await fireEvent.click(screen.getByText('bunker:// を入力'));
        const bunkerInput = screen.getByPlaceholderText('bunker://...');
        await fireEvent.input(bunkerInput, {
            target: { value: 'bunker://example?relay=wss://relay.example.com' },
        });
        await fireEvent.click(screen.getByText('接続'));

        expect(onNip46Login).toHaveBeenCalledTimes(1);
        expect(await screen.findByText('接続に失敗しました')).toBeTruthy();
    });

    it('QR タブ初期表示で default relay を使った nostrconnect 開始を呼び URI と QR を表示する', async () => {
        const onNostrConnectStart = vi
            .fn<(relays: string[]) => Promise<string | undefined>>()
            .mockResolvedValue(undefined);
        const uri =
            'nostrconnect://client?relay=wss%3A%2F%2Fnostr.oxtr.dev%2F&relay=wss%3A%2F%2Ftheforest.nostr1.com%2F&relay=wss%3A%2F%2Frelay.primal.net%2F&relay=wss%3A%2F%2Fephemeral.snowflare.cc%2F';

        const { rerender } = render(LoginDialog, {
            props: {
                ...defaultProps,
                onNostrConnectStart,
            },
        });

        await waitFor(() => {
            expect(onNostrConnectStart).toHaveBeenCalledWith([
                'wss://nostr.oxtr.dev/',
                'wss://theforest.nostr1.com/',
                'wss://relay.primal.net/',
                'wss://ephemeral.snowflare.cc/',
            ]);
        });

        await rerender({
            ...defaultProps,
            onNostrConnectStart,
            isWaitingNip46NostrConnect: true,
            nip46NostrConnectUri: uri,
        });

        expect(screen.getByText('リモートサイナーで接続')).toBeTruthy();
        expect(screen.getByText(uri)).toBeTruthy();
        await waitFor(() => {
            expect(
                screen
                    .getByTestId('nostrconnect-qr-code')
                    .querySelector('[data-qr-value]')
                    ?.getAttribute('data-qr-value'),
            ).toBe(uri);
        });
        expect(uri.indexOf('relay=wss%3A%2F%2Fnostr.oxtr.dev%2F')).toBeLessThan(
            uri.indexOf('relay=wss%3A%2F%2Ftheforest.nostr1.com%2F'),
        );
        expect(
            uri.indexOf('relay=wss%3A%2F%2Ftheforest.nostr1.com%2F'),
        ).toBeLessThan(uri.indexOf('relay=wss%3A%2F%2Frelay.primal.net%2F'));
    });

    it('QR / 表示 URI / コピー / direct-open が同じ URI を使う', async () => {
        const onNostrConnectStart = vi
            .fn<(relays: string[]) => Promise<string | undefined>>()
            .mockResolvedValue(undefined);
        const onNostrConnectCancel = vi.fn();
        const assign = vi.fn();
        vi.stubGlobal('location', { assign });
        const { tryCopyToClipboard } = await import('../../lib/utils/clipboardUtils');
        const uri = 'nostrconnect://client?relay=wss://relay.example.com';

        render(LoginDialog, {
            props: {
                ...defaultProps,
                onNostrConnectStart,
                onNostrConnectCancel,
                isWaitingNip46NostrConnect: true,
                nip46NostrConnectUri: uri,
            },
        });

        await waitFor(() => {
            expect(onNostrConnectStart).toHaveBeenCalledTimes(1);
        });

        await fireEvent.click(screen.getByTestId('nostrconnect-copy-button'));
        expect(tryCopyToClipboard).toHaveBeenCalledWith(uri, 'nostrconnect');

        await fireEvent.click(screen.getByTestId('nostrconnect-open-button'));
        expect(assign).toHaveBeenCalledWith(uri);

        await fireEvent.click(screen.getByText('接続をキャンセル'));
        expect(onNostrConnectCancel).toHaveBeenCalledTimes(1);
        expect(screen.getByTestId('nostrconnect-copy-button')).toBeTruthy();
    });

    it('relay を変更すると新しい relay 一覧で再開始する', async () => {
        const onNostrConnectStart = vi
            .fn<(relays: string[]) => Promise<string | undefined>>()
            .mockResolvedValue(undefined);

        render(LoginDialog, {
            props: {
                ...defaultProps,
                onNostrConnectStart,
            },
        });

        await waitFor(() => {
            expect(onNostrConnectStart).toHaveBeenCalledTimes(1);
        });

        await fireEvent.click(screen.getByText('接続 relay を変更'));
        const relayInputs = screen.getAllByPlaceholderText('wss://relay.example.com');
        await fireEvent.input(relayInputs[0], {
            target: { value: 'wss://relay.changed.example.com/' },
        });

        await waitFor(() => {
            expect(onNostrConnectStart).toHaveBeenLastCalledWith([
                'wss://relay.changed.example.com/',
                'wss://theforest.nostr1.com/',
                'wss://relay.primal.net/',
                'wss://ephemeral.snowflare.cc/',
            ]);
        });
    });

    it('初期値に戻すで default relay 一覧に戻して再開始する', async () => {
        const onNostrConnectStart = vi
            .fn<(relays: string[]) => Promise<string | undefined>>()
            .mockResolvedValue(undefined);

        render(LoginDialog, {
            props: {
                ...defaultProps,
                onNostrConnectStart,
            },
        });

        await waitFor(() => {
            expect(onNostrConnectStart).toHaveBeenCalledTimes(1);
        });

        await fireEvent.click(screen.getByText('接続 relay を変更'));
        const relayInputs = screen.getAllByPlaceholderText('wss://relay.example.com');
        await fireEvent.input(relayInputs[0], {
            target: { value: 'wss://relay.changed.example.com/' },
        });

        await waitFor(() => {
            expect(onNostrConnectStart).toHaveBeenCalledTimes(2);
        });

        await fireEvent.click(screen.getByText('初期値に戻す'));

        await waitFor(() => {
            expect(onNostrConnectStart).toHaveBeenLastCalledWith([
                'wss://nostr.oxtr.dev/',
                'wss://theforest.nostr1.com/',
                'wss://relay.primal.net/',
                'wss://ephemeral.snowflare.cc/',
            ]);
        });
    });

    it('invalid relay では validation error を表示して待機を cancel する', async () => {
        const onNostrConnectStart = vi
            .fn<(relays: string[]) => Promise<string | undefined>>()
            .mockResolvedValue(undefined);
        const onNostrConnectCancel = vi.fn();

        render(LoginDialog, {
            props: {
                ...defaultProps,
                onNostrConnectStart,
                onNostrConnectCancel,
            },
        });

        await waitFor(() => {
            expect(onNostrConnectStart).toHaveBeenCalledTimes(1);
        });

        await fireEvent.click(screen.getByText('接続 relay を変更'));
        const relayInputs = screen.getAllByPlaceholderText('wss://relay.example.com');
        await fireEvent.input(relayInputs[0], {
            target: { value: 'https://invalid.example.com' },
        });

        expect(
            await screen.findByText('relay の形式が正しくありません。'),
        ).toBeTruthy();
        expect(onNostrConnectCancel).toHaveBeenCalledTimes(1);
        expect(onNostrConnectStart).toHaveBeenCalledTimes(1);
    });

    it('relay が 0件になると required error を表示して URI を再生成しない', async () => {
        const onNostrConnectStart = vi
            .fn<(relays: string[]) => Promise<string | undefined>>()
            .mockResolvedValue(undefined);
        const onNostrConnectCancel = vi.fn();

        render(LoginDialog, {
            props: {
                ...defaultProps,
                onNostrConnectStart,
                onNostrConnectCancel,
            },
        });

        await waitFor(() => {
            expect(onNostrConnectStart).toHaveBeenCalledTimes(1);
        });

        await fireEvent.click(screen.getByText('接続 relay を変更'));
        for (const relayInput of screen.getAllByPlaceholderText('wss://relay.example.com')) {
            await fireEvent.input(relayInput, {
                target: { value: '' },
            });
        }

        expect(
            await screen.findByText('NIP-46 接続には1件以上の relay が必要です。'),
        ).toBeTruthy();
        expect(onNostrConnectCancel).toHaveBeenCalledTimes(1);
    });

    it('QR タブから bunker タブへ切り替えると待機を cancel し、戻ると再生成する', async () => {
        const onNostrConnectStart = vi
            .fn<(relays: string[]) => Promise<string | undefined>>()
            .mockResolvedValue(undefined);
        const onNostrConnectCancel = vi.fn();

        render(LoginDialog, {
            props: {
                ...defaultProps,
                onNostrConnectStart,
                onNostrConnectCancel,
            },
        });

        await waitFor(() => {
            expect(onNostrConnectStart).toHaveBeenCalledTimes(1);
        });

        await fireEvent.click(screen.getByText('bunker:// を入力'));
        expect(onNostrConnectCancel).toHaveBeenCalledTimes(1);
        expect(screen.getByPlaceholderText('bunker://...')).toBeTruthy();

        await fireEvent.click(screen.getByText('QRコード'));

        await waitFor(() => {
            expect(onNostrConnectStart).toHaveBeenCalledTimes(2);
        });
        expect(screen.queryByPlaceholderText('bunker://...')).toBeNull();
    });

    it('bunker:// 入力導線は維持される', async () => {
        render(LoginDialog, {
            props: defaultProps,
        });

        await fireEvent.click(screen.getByText('bunker:// を入力'));

        expect(screen.getByPlaceholderText('bunker://...')).toBeTruthy();
        expect(screen.getByText('接続')).toBeTruthy();
    });

    it('表示中の remote error を QR タブに表示する', async () => {
        render(LoginDialog, {
            props: {
                ...defaultProps,
                nip46NostrConnectErrorMessage:
                    'Timed out waiting for switch_relays response',
            },
        });

        expect(
            screen.getByText(
                'リモートサイナーとの接続に失敗しました。接続 relay またはリモートサイナーの状態を確認してください。',
            ),
        ).toBeTruthy();
    });
});