import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { locale, waitLocale } from 'svelte-i18n';

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

    it('activeなNIP-46アカウントにAmber接続確認UIを表示してハンドラを呼ぶ', async () => {
        const onCheckNip46Connection = vi.fn();

        render(ProfileComponent, {
            show: true,
            onClose: vi.fn(),
            onLogout: vi.fn(),
            onCheckNip46Connection,
            accounts: createAccounts(),
            accountProfiles: new Map([
                [ACTIVE_PUBKEY, { name: 'tester', displayName: 'Tester', picture: '' }],
            ]),
            nip46ConnectionOperationState: 'idle',
            nip46ConnectionStatus: 'idle',
        });

        expect(screen.getByText('Amber 接続確認')).toBeTruthy();

        await fireEvent.click(screen.getByRole('button', { name: '接続を確認' }));

        expect(onCheckNip46Connection).toHaveBeenCalledWith(ACTIVE_PUBKEY);
    });

    it('auto recovery中はAmber接続確認ボタンを無効化して案内を出す', () => {
        render(ProfileComponent, {
            show: true,
            onClose: vi.fn(),
            onLogout: vi.fn(),
            accounts: createAccounts(),
            accountProfiles: new Map(),
            nip46ConnectionOperationState: 'auto-recovery',
            nip46ConnectionStatus: 'idle',
        });

        expect(
            screen.getByText('バックグラウンド復帰の再接続中です。完了後に再試行してください。'),
        ).toBeTruthy();
        expect(
            screen.getByRole('button', { name: '接続を確認' }).hasAttribute('disabled'),
        ).toBe(true);
    });
});