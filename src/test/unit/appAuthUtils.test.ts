import { describe, expect, it, vi } from 'vitest';

import {
    disposeNostrSession,
    handleSuccessfulAuthResult,
    resolveLogoutAccountAction,
    restoreManagedAccountSession,
} from '../../lib/appAuthUtils';

describe('disposeNostrSession', () => {
    it('session がある場合は dispose を呼んで undefined を返す', () => {
        const dispose = vi.fn();

        expect(disposeNostrSession({ dispose })).toBeUndefined();
        expect(dispose).toHaveBeenCalledOnce();
    });

    it('session がない場合も安全に undefined を返す', () => {
        expect(disposeNostrSession(undefined)).toBeUndefined();
    });
});

describe('handleSuccessfulAuthResult', () => {
    it('成功かつ pubkeyHex ありなら後続処理を呼ぶ', async () => {
        const onAuthenticated = vi.fn(async () => undefined);

        await expect(handleSuccessfulAuthResult({
            success: true,
            pubkeyHex: 'pubkey-1',
        }, onAuthenticated)).resolves.toBe(true);
        expect(onAuthenticated).toHaveBeenCalledWith('pubkey-1');
    });

    it('失敗または pubkeyHex なしなら false を返す', async () => {
        const onAuthenticated = vi.fn(async () => undefined);

        await expect(handleSuccessfulAuthResult({ success: false }, onAuthenticated)).resolves.toBe(false);
        await expect(handleSuccessfulAuthResult({ success: true }, onAuthenticated)).resolves.toBe(false);
        expect(onAuthenticated).not.toHaveBeenCalled();
    });
});

describe('resolveLogoutAccountAction', () => {
    it('次アカウントがあれば switch を返す', () => {
        expect(resolveLogoutAccountAction('pubkey-1')).toEqual({
            kind: 'switch',
            pubkeyHex: 'pubkey-1',
        });
    });

    it('null は guest、undefined は keep-current を返す', () => {
        expect(resolveLogoutAccountAction(null)).toEqual({ kind: 'guest' });
        expect(resolveLogoutAccountAction(undefined)).toEqual({ kind: 'keep-current' });
    });
});

describe('restoreManagedAccountSession', () => {
    it('account type があって restore に成功すれば post auth を呼ぶ', async () => {
        const handlePostAuth = vi.fn(async () => undefined);
        const accountManager = {
            setActiveAccount: vi.fn(),
            getAccountType: vi.fn(() => 'nip07' as const),
        };

        await expect(restoreManagedAccountSession({
            pubkeyHex: 'pubkey-1',
            accountManager,
            restoreAccount: vi.fn(async () => ({ hasAuth: true, pubkeyHex: 'pubkey-1' })),
            handlePostAuth,
        })).resolves.toBe(true);

        expect(accountManager.setActiveAccount).toHaveBeenCalledWith('pubkey-1');
        expect(handlePostAuth).toHaveBeenCalledWith('pubkey-1');
    });

    it('account type がなければ missing callback を呼ぶ', async () => {
        const onMissingAccountType = vi.fn();

        await expect(restoreManagedAccountSession({
            pubkeyHex: 'pubkey-1',
            accountManager: {
                setActiveAccount: vi.fn(),
                getAccountType: vi.fn(() => null),
            },
            restoreAccount: vi.fn(),
            handlePostAuth: vi.fn(async () => undefined),
            onMissingAccountType,
        })).resolves.toBe(false);

        expect(onMissingAccountType).toHaveBeenCalledOnce();
    });

    it('restore に失敗すれば failure callback を呼ぶ', async () => {
        const onRestoreFailure = vi.fn();

        await expect(restoreManagedAccountSession({
            pubkeyHex: 'pubkey-1',
            accountManager: {
                setActiveAccount: vi.fn(),
                getAccountType: vi.fn(() => 'nsec' as const),
            },
            restoreAccount: vi.fn(async () => ({ hasAuth: false })),
            handlePostAuth: vi.fn(async () => undefined),
            onRestoreFailure,
        })).resolves.toBe(false);

        expect(onRestoreFailure).toHaveBeenCalledOnce();
    });
});