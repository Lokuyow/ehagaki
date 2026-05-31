import { describe, expect, it, vi } from 'vitest';

import { createAppAccountSessionController } from '../../lib/appAccountSessionController';

function createController(overrides: Record<string, unknown> = {}) {
    let isSwitchingAccount = false;
    let isLoggingOut = false;
    let currentRxNostr: unknown = { dispose: vi.fn() };

    const deps = {
        getIsSwitchingAccount: () => isSwitchingAccount,
        setIsSwitchingAccount: (next: boolean) => {
            isSwitchingAccount = next;
        },
        getIsLoggingOut: () => isLoggingOut,
        setIsLoggingOut: (next: boolean) => {
            isLoggingOut = next;
        },
            setProfileLoading: vi.fn(),
        getAuthStateSnapshot: () => ({
            type: 'parentClient',
            pubkey: 'aa'.repeat(32),
        }),
        getCurrentRxNostr: () => currentRxNostr,
        setCurrentRxNostr: (next: undefined) => {
            currentRxNostr = next;
        },
        disposeNostrSession: vi.fn(() => undefined),
        clearNip46RuntimeForAuthChange: vi.fn(async () => undefined),
        nip46Service: {
            disconnect: vi.fn(async () => undefined),
        },
        accountManager: {
            getAccountType: vi.fn(() => 'nsec'),
            setActiveAccount: vi.fn(),
        },
        restoreManagedAccountSession: vi.fn(async () => true),
        restoreAccount: vi.fn(async () => ({ hasAuth: true, pubkeyHex: 'bb'.repeat(32) })),
        handlePostAuth: vi.fn(async () => undefined),
        resetUploadDisplayState: vi.fn(),
        logoutAccountFromAuthService: vi.fn(() => null),
        resolveLogoutAccountAction: vi.fn((nextPubkey: string | null | undefined) => {
            if (typeof nextPubkey === 'string') {
                return { kind: 'switch', pubkeyHex: nextPubkey };
            }
            if (nextPubkey === null) {
                return { kind: 'guest' };
            }
            return { kind: 'keep-current' };
        }),
        clearAuthState: vi.fn(),
        setGuestProfile: vi.fn(),
        setProfileLoaded: vi.fn(),
        initializeNostr: vi.fn(async () => undefined),
        setSecretKey: vi.fn(),
        setErrorMessage: vi.fn(),
        refreshAccountList: vi.fn(),
        reloadWindow: vi.fn(),
        closeLogoutDialog: vi.fn(),
        logger: { error: vi.fn() },
        ...overrides,
    };

    return {
        deps,
        controller: createAppAccountSessionController(deps as never),
    };
}

describe('createAppAccountSessionController', () => {
    it('switchAccount は restoreManagedAccountSession を実行する', async () => {
        const { deps, controller } = createController();

        await expect(controller.switchAccount('bb'.repeat(32))).resolves.toBe(true);

        expect(deps.setProfileLoading).toHaveBeenCalledWith(false);
        expect(deps.clearNip46RuntimeForAuthChange).toHaveBeenCalledTimes(1);
        expect(deps.disposeNostrSession).toHaveBeenCalledTimes(1);
        expect(deps.restoreManagedAccountSession).toHaveBeenCalledTimes(1);
    });

    it('logoutAccount guest 分岐では認証情報を初期化する', async () => {
        const { deps, controller } = createController({
            logoutAccountFromAuthService: vi.fn(() => null),
        });

        await controller.logoutAccount('aa'.repeat(32));

        expect(deps.resetUploadDisplayState).toHaveBeenCalledTimes(1);
        expect(deps.clearAuthState).toHaveBeenCalledTimes(1);
        expect(deps.setGuestProfile).toHaveBeenCalledTimes(1);
        expect(deps.initializeNostr).toHaveBeenCalledTimes(1);
        expect(deps.refreshAccountList).toHaveBeenCalledTimes(1);
        expect(deps.closeLogoutDialog).toHaveBeenCalledTimes(1);
    });

    it('handleRemoteParentClientLogout は non-parentClient auth を無視する', async () => {
        const { deps, controller } = createController({
            getAuthStateSnapshot: () => ({
                type: 'nip07',
                pubkey: 'aa'.repeat(32),
            }),
        });

        await controller.handleRemoteParentClientLogout('aa'.repeat(32));

        expect(deps.logoutAccountFromAuthService).not.toHaveBeenCalled();
        expect(deps.restoreManagedAccountSession).not.toHaveBeenCalled();
    });

    it('handleRemoteParentClientLogout は復帰成功時に logout せず refresh する', async () => {
        const restoreManagedAccountSession = vi.fn(async () => true);
        const { deps, controller } = createController({
            accountManager: {
                getAccountType: vi.fn(() => 'nsec'),
                setActiveAccount: vi.fn(),
            },
            restoreManagedAccountSession,
        });

        await controller.handleRemoteParentClientLogout('aa'.repeat(32));

        expect(restoreManagedAccountSession).toHaveBeenCalledTimes(1);
        expect(deps.logoutAccountFromAuthService).not.toHaveBeenCalled();
        expect(deps.refreshAccountList).toHaveBeenCalledTimes(1);
    });

    it('logoutAccount の switch 分岐では再読み込みする', async () => {
        const { deps, controller } = createController({
            accountManager: {
                getAccountType: vi.fn(() => 'nsec'),
                setActiveAccount: vi.fn(),
            },
            logoutAccountFromAuthService: vi.fn(() => 'bb'.repeat(32)),
        });

        await controller.logoutAccount('aa'.repeat(32));

        expect(deps.reloadWindow).toHaveBeenCalledTimes(1);
        expect(deps.restoreManagedAccountSession).not.toHaveBeenCalled();
        expect(deps.closeLogoutDialog).not.toHaveBeenCalled();
    });
});
