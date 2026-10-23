import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { locale, waitLocale } from 'svelte-i18n';

const clipboardMock = vi.hoisted(() => ({
    tryCopyToClipboard: vi.fn().mockResolvedValue(true),
}));

vi.mock('../../lib/utils/clipboardUtils', () => clipboardMock);

import '../../i18n';
import ProfileComponent from '../../components/ProfileComponent.svelte';
import { authState } from '../../stores/authStore.svelte';
import { profileDataStore } from '../../stores/profileStore.svelte';

const ACTIVE_PUBKEY = 'a'.repeat(64);

function createAccounts() {
    return [{
        pubkeyHex: ACTIVE_PUBKEY,
        type: 'nip46' as const,
        addedAt: Date.now(),
    }];
}

describe('ProfileComponent', () => {
    beforeEach(async () => {
        locale.set('ja');
        await waitLocale();
        (authState as any).value = {
            ...authState.value,
            isAuthenticated: true,
            type: 'nip46',
            pubkey: ACTIVE_PUBKEY,
            npub: 'npub1testprofile',
            nprofile: 'nprofile1testprofile',
        };
        (profileDataStore as any).value = {
            name: 'tester',
            displayName: 'Tester',
            picture: '',
            npub: 'npub1testprofile',
            nprofile: 'nprofile1testprofile',
        };
    });

    afterEach(() => {
        (authState as any).value = {
            ...authState.value,
            isAuthenticated: false,
            type: 'none',
            pubkey: '',
            npub: '',
            nprofile: '',
        };
        (profileDataStore as any).value = {
            name: '',
            displayName: '',
            picture: '',
            npub: '',
            nprofile: '',
        };
    });

    it.each(['ja', 'en'])('%s: NIP-46アカウントに接続確認セクションを表示しない', async (language) => {
        locale.set(language);
        await waitLocale();
        render(ProfileComponent, {
            show: true,
            onClose: vi.fn(),
            onLogout: vi.fn(),
            accounts: createAccounts(),
            accountProfiles: new Map([
                [ACTIVE_PUBKEY, { name: 'tester', displayName: 'Tester', picture: '' }],
            ]),
        });

        expect(screen.getByText(language === 'ja' ? 'リモート署名（NIP-46）' : 'Remote Signing (NIP-46)')).toBeTruthy();
        expect(screen.queryByText(/NIP-46 接続|NIP-46 Connection/)).toBeNull();
        expect(screen.queryByRole('button', { name: /リモートサイナー接続確認|Check Remote Signer Connection/ })).toBeNull();
    });

    it('NIP-46アカウントのログアウトとアカウント追加を実行できる', async () => {
        const onLogout = vi.fn();
        const onAddAccount = vi.fn();
        render(ProfileComponent, {
            show: true,
            onClose: vi.fn(),
            onLogout,
            onAddAccount,
            accounts: createAccounts(),
            accountProfiles: new Map(),
        });

        await fireEvent.click(screen.getByRole('button', { name: 'ログアウト' }));
        expect(onLogout).toHaveBeenCalledWith(ACTIVE_PUBKEY);
        await fireEvent.click(screen.getByRole('button', { name: 'アカウントを追加' }));
        expect(onAddAccount).toHaveBeenCalledOnce();
    });

    it('非アクティブなNIP-46アカウントへ切り替えてダイアログを閉じる', async () => {
        const nextPubkey = 'b'.repeat(64);
        const onSwitchAccount = vi.fn();
        const onClose = vi.fn();
        render(ProfileComponent, {
            show: true,
            onClose,
            onLogout: vi.fn(),
            onSwitchAccount,
            accounts: [...createAccounts(), { pubkeyHex: nextPubkey, type: 'nip46', addedAt: 1 }],
            accountProfiles: new Map([[nextPubkey, { name: 'next', displayName: 'Next account', picture: '' }]]),
        });

        await fireEvent.click(screen.getByRole('button', { name: /Next account/ }));
        expect(onSwitchAccount).toHaveBeenCalledWith(nextPubkey);
        expect(onClose).toHaveBeenCalledOnce();
    });

    it('npub コピーボタンで共通のコピー通知を表示する', async () => {
        render(ProfileComponent, {
            show: true,
            onClose: vi.fn(),
            onLogout: vi.fn(),
            accounts: createAccounts(),
            accountProfiles: new Map(),
        });

        await fireEvent.click(screen.getByRole('button', { name: 'npubをコピー' }));

        expect(clipboardMock.tryCopyToClipboard).toHaveBeenCalledWith(
            'npub1testprofile',
            'npub',
            navigator,
            window,
        );
        expect(screen.getByText('コピーしました')).toBeTruthy();
    });

    it('アカウント一覧が空でも復旧用ログアウト操作を表示して実行できる', async () => {
        const onLogout = vi.fn();

        render(ProfileComponent, {
            show: true,
            onClose: vi.fn(),
            onLogout,
            accounts: [],
            accountProfiles: new Map(),
        });

        expect(screen.getByText('アカウント復旧')).toBeTruthy();

        await fireEvent.click(
            screen.getByRole('button', { name: '現在のアカウントをログアウト' }),
        );

        expect(onLogout).toHaveBeenCalledWith(ACTIVE_PUBKEY);
    });

    it('auth pubkey が空でも fallbackRecoveryPubkeyHex があれば復旧用ログアウト操作を表示できる', async () => {
        const onLogout = vi.fn();
        (authState as any).value = {
            ...authState.value,
            pubkey: '',
            npub: '',
            nprofile: '',
        };
        (profileDataStore as any).value = {
            ...profileDataStore.value,
            npub: '',
            nprofile: '',
        };

        render(ProfileComponent, {
            show: true,
            onClose: vi.fn(),
            onLogout,
            fallbackRecoveryPubkeyHex: ACTIVE_PUBKEY,
            accounts: [],
            accountProfiles: new Map(),
        });

        expect(screen.getByText('アカウント復旧')).toBeTruthy();
        expect(screen.getByText(/^npub1/)).toBeTruthy();

        await fireEvent.click(
            screen.getByRole('button', { name: '現在のアカウントをログアウト' }),
        );

        expect(onLogout).toHaveBeenCalledWith(ACTIVE_PUBKEY);
    });
});
