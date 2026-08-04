import { describe, expect, it, vi } from 'vitest';

import { createAppAccountSessionController } from '../../lib/appAccountSessionController';

function createController(overrides: Record<string, unknown> = {}) {
    let isSwitchingAccount = false;
    let isLoggingOut = false;
    let currentRxNostr: unknown = { dispose: vi.fn() };
    const switchingAccountStateHistory: boolean[] = [];

    const deps = {
        getIsSwitchingAccount: () => isSwitchingAccount,
        setIsSwitchingAccount: vi.fn((next: boolean) => {
            isSwitchingAccount = next;
            switchingAccountStateHistory.push(next);
        }),
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
        switchingAccountStateHistory,
    };
}

describe('createAppAccountSessionController', () => {
    it('switchAccount は restoreManagedAccountSession を実行する', async () => {
        const {
            deps,
            controller,
            switchingAccountStateHistory,
        } = createController();

        await expect(controller.switchAccount('bb'.repeat(32))).resolves.toBe(true);

        expect(switchingAccountStateHistory).toEqual([true, false]);
        expect(deps.setProfileLoading).toHaveBeenCalledWith(false);
        expect(deps.clearNip46RuntimeForAuthChange).toHaveBeenCalledTimes(1);
        expect(deps.disposeNostrSession).toHaveBeenCalledTimes(1);
        expect(deps.restoreManagedAccountSession).toHaveBeenCalledTimes(1);
    });

    it('switchAccount は非同期処理の開始前に切替状態を有効化する', async () => {
        let resolveRestore: ((result: boolean) => void) | undefined;
        let resolveRestoreStarted: (() => void) | undefined;
        const restoreStarted = new Promise<void>((resolve) => {
            resolveRestoreStarted = resolve;
        });
        const restoreManagedAccountSession = vi.fn(() => {
            resolveRestoreStarted?.();
            return new Promise<boolean>((resolve) => {
                resolveRestore = resolve;
            });
        });
        const { controller, switchingAccountStateHistory } = createController({
            restoreManagedAccountSession,
        });

        const switchPromise = controller.switchAccount('bb'.repeat(32));

        await restoreStarted;
        expect(switchingAccountStateHistory).toEqual([true]);
        resolveRestore?.(true);
        await expect(switchPromise).resolves.toBe(true);
        expect(switchingAccountStateHistory).toEqual([true, false]);
    });

    it('switchAccount は復元失敗時も切替状態を解除する', async () => {
        const { controller, switchingAccountStateHistory } = createController({
            restoreManagedAccountSession: vi.fn(async () => false),
        });

        await expect(controller.switchAccount('bb'.repeat(32))).resolves.toBe(false);

        expect(switchingAccountStateHistory).toEqual([true, false]);
    });

    it('switchAccount は例外時も切替状態を解除する', async () => {
        const { controller, switchingAccountStateHistory } = createController({
            restoreManagedAccountSession: vi.fn(async () => {
                throw new Error('restore failed');
            }),
        });

        await expect(controller.switchAccount('bb'.repeat(32))).resolves.toBe(false);

        expect(switchingAccountStateHistory).toEqual([true, false]);
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
