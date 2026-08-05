import { describe, expect, it, vi } from 'vitest';

import {
    clearNip46RuntimeForAuthChange,
    disposeNostrSession,
    handleSuccessfulAuthResult,
    resolveLogoutAccountAction,
    restoreManagedAccountSession,
    runNip07Login,
    runNip46Login,
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

describe('clearNip46RuntimeForAuthChange', () => {
    it('現在がnip46で別の認証方式へ切り替わるとruntimeをclearする', async () => {
        const disconnect = vi.fn().mockResolvedValue(undefined);

        await clearNip46RuntimeForAuthChange({
            currentAuthType: 'nip46',
            currentPubkeyHex: 'pubkey-1',
            nextAuthType: 'nip07',
            nextPubkeyHex: 'pubkey-2',
            nip46Service: { disconnect },
        });

        expect(disconnect).toHaveBeenCalledOnce();
    });

    it('同じnip46アカウント継続ならruntimeをclearしない', async () => {
        const disconnect = vi.fn().mockResolvedValue(undefined);

        await clearNip46RuntimeForAuthChange({
            currentAuthType: 'nip46',
            currentPubkeyHex: 'pubkey-1',
            nextAuthType: 'nip46',
            nextPubkeyHex: 'pubkey-1',
            nip46Service: { disconnect },
        });

        expect(disconnect).not.toHaveBeenCalled();
    });

    it('現在がnip46でなければ何もしない', async () => {
        const disconnect = vi.fn().mockResolvedValue(undefined);

        await clearNip46RuntimeForAuthChange({
            currentAuthType: 'nsec',
            currentPubkeyHex: 'pubkey-1',
            nextAuthType: 'parentClient',
            nextPubkeyHex: 'pubkey-2',
            nip46Service: { disconnect },
        });

        expect(disconnect).not.toHaveBeenCalled();
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
    it('要求pubkeyとrestore結果が一致すればpost-auth後に同じpubkeyを返す', async () => {
        const handlePostAuth = vi.fn(async () => undefined);

        await expect(restoreManagedAccountSession({
            requestedPubkeyHex: 'pubkey-1',
            accountType: 'nip07',
            restoreAccount: vi.fn(async () => ({ hasAuth: true, pubkeyHex: 'pubkey-1' })),
            handlePostAuth,
        })).resolves.toEqual({ success: true, pubkeyHex: 'pubkey-1' });

        expect(handlePostAuth).toHaveBeenCalledWith('pubkey-1');
    });

    it('restore失敗ではpost-authを呼ばない', async () => {
        const handlePostAuth = vi.fn(async () => undefined);

        await expect(restoreManagedAccountSession({
            requestedPubkeyHex: 'pubkey-1',
            accountType: 'nsec',
            restoreAccount: vi.fn(async () => ({ hasAuth: false })),
            handlePostAuth,
        })).resolves.toEqual({ success: false, reason: 'restore-failed' });

        expect(handlePostAuth).not.toHaveBeenCalled();
    });

    it('結果pubkeyがなければpost-authを呼ばない', async () => {
        const handlePostAuth = vi.fn(async () => undefined);

        await expect(restoreManagedAccountSession({
            requestedPubkeyHex: 'pubkey-1',
            accountType: 'nsec',
            restoreAccount: vi.fn(async () => ({ hasAuth: true })),
            handlePostAuth,
        })).resolves.toEqual({ success: false, reason: 'missing-pubkey' });

        expect(handlePostAuth).not.toHaveBeenCalled();
    });

    it.each([
        ['未登録の結果pubkey', 'pubkey-unregistered'],
        ['別の登録済み結果pubkey', 'pubkey-2'],
    ])('%sでも一致しなければpost-authを呼ばない', async (_label, resultPubkeyHex) => {
        const handlePostAuth = vi.fn(async () => undefined);

        await expect(restoreManagedAccountSession({
            requestedPubkeyHex: 'pubkey-1',
            accountType: 'nip07',
            restoreAccount: vi.fn(async () => ({ hasAuth: true, pubkeyHex: resultPubkeyHex })),
            handlePostAuth,
        })).resolves.toEqual({ success: false, reason: 'pubkey-mismatch' });

        expect(handlePostAuth).not.toHaveBeenCalled();
    });

    it('post-auth失敗を成功扱いしない', async () => {
        await expect(restoreManagedAccountSession({
            requestedPubkeyHex: 'pubkey-1',
            accountType: 'nip07',
            restoreAccount: vi.fn(async () => ({ hasAuth: true, pubkeyHex: 'pubkey-1' })),
            handlePostAuth: vi.fn(async () => {
                throw new Error('post-auth failed');
            }),
        })).resolves.toEqual({ success: false, reason: 'post-auth-failed' });
    });
});

describe('runNip07Login', () => {
    it('成功時は NIP-46 runtime を必要に応じて切り替え、後続処理を呼ぶ', async () => {
        const authenticateWithNip07 = vi.fn().mockResolvedValue({
            success: true,
            pubkeyHex: 'pubkey-1',
        });
        const cancelPendingNip46Auth = vi.fn().mockResolvedValue(undefined);
        const clearNip46RuntimeForAuthChange = vi.fn().mockResolvedValue(undefined);
        const handlePostAuth = vi.fn().mockResolvedValue(undefined);
        const setLoading = vi.fn();

        await expect(runNip07Login({
            currentAuthType: 'nsec',
            currentPubkeyHex: 'current-pubkey',
            authenticateWithNip07,
            cancelPendingNip46Auth,
            clearNip46RuntimeForAuthChange,
            handlePostAuth,
            setLoading,
            nip46Service: { disconnect: vi.fn().mockResolvedValue(undefined) },
            console: { error: vi.fn() },
        })).resolves.toBeUndefined();

        expect(cancelPendingNip46Auth).toHaveBeenCalledOnce();
        expect(authenticateWithNip07).toHaveBeenCalledOnce();
        expect(clearNip46RuntimeForAuthChange).toHaveBeenCalledWith(expect.objectContaining({
            currentAuthType: 'nsec',
            currentPubkeyHex: 'current-pubkey',
            nextAuthType: 'nip07',
            nextPubkeyHex: 'pubkey-1',
        }));
        expect(handlePostAuth).toHaveBeenCalledWith('pubkey-1');
        expect(setLoading).toHaveBeenNthCalledWith(1, true);
        expect(setLoading).toHaveBeenLastCalledWith(false);
    });

    it('失敗時はエラーコードを返す', async () => {
        const consoleError = vi.fn();

        await expect(runNip07Login({
            authenticateWithNip07: vi.fn().mockResolvedValue({ success: false, error: 'nip07_auth_error' }),
            cancelPendingNip46Auth: vi.fn().mockResolvedValue(undefined),
            clearNip46RuntimeForAuthChange: vi.fn(),
            handlePostAuth: vi.fn(),
            setLoading: vi.fn(),
            nip46Service: { disconnect: vi.fn().mockResolvedValue(undefined) },
            console: { error: consoleError },
        })).resolves.toBe('nip07_auth_error');

        expect(consoleError).toHaveBeenCalledWith('NIP-07認証失敗:', 'nip07_auth_error');
    });
});

describe('runNip46Login', () => {
    it('成功時は後続処理を呼ぶ', async () => {
        const authenticateWithNip46 = vi.fn().mockResolvedValue({
            success: true,
            pubkeyHex: 'pubkey-2',
        });
        const handlePostAuth = vi.fn().mockResolvedValue(undefined);
        const setLoading = vi.fn();

        await expect(runNip46Login({
            authenticateWithNip46,
            handlePostAuth,
            setLoading,
            console: { error: vi.fn() },
        }, 'bunker://example')).resolves.toBeUndefined();

        expect(authenticateWithNip46).toHaveBeenCalledWith('bunker://example');
        expect(handlePostAuth).toHaveBeenCalledWith('pubkey-2');
        expect(setLoading).toHaveBeenNthCalledWith(1, true);
        expect(setLoading).toHaveBeenLastCalledWith(false);
    });
});
