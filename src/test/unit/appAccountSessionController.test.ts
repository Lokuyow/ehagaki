import { describe, expect, it, vi } from 'vitest';

import { createAppAccountSessionController } from '../../lib/appAccountSessionController';
import { restoreManagedAccountSession } from '../../lib/appAuthUtils';

const CURRENT_PUBKEY = 'aa'.repeat(32);
const TARGET_PUBKEY = 'bb'.repeat(32);
const OTHER_PUBKEY = 'cc'.repeat(32);

type ManagedSessionRestoreResult =
    | { success: true; pubkeyHex: string }
    | {
        success: false;
        reason: 'restore-failed' | 'missing-pubkey' | 'pubkey-mismatch' | 'post-auth-failed';
    };

function createController(overrides: Record<string, unknown> = {}) {
    let isSwitchingAccount = false;
    let isLoggingOut = false;
    let currentRxNostr: unknown = { dispose: vi.fn() };
    let activePubkey: string | null = CURRENT_PUBKEY;
    let authSnapshot: { type?: string; pubkey?: string } = {
        type: 'parentClient',
        pubkey: CURRENT_PUBKEY,
    };
    const accounts = new Map<string, 'nsec' | 'nip07' | 'nip46' | 'parentClient'>([
        [CURRENT_PUBKEY, 'parentClient'],
        [TARGET_PUBKEY, 'nip07'],
        [OTHER_PUBKEY, 'nsec'],
    ]);
    const switchingAccountStateHistory: boolean[] = [];
    const loggingOutStateHistory: boolean[] = [];

    const accountManager = {
        getAccountType: vi.fn((pubkeyHex: string) => accounts.get(pubkeyHex) ?? null),
        hasAccount: vi.fn((pubkeyHex: string) => accounts.has(pubkeyHex)),
        setActiveAccount: vi.fn((pubkeyHex: string) => {
            if (accounts.has(pubkeyHex)) {
                activePubkey = pubkeyHex;
            }
        }),
        getActiveAccountPubkey: vi.fn(() => activePubkey),
        clearActiveAccount: vi.fn(() => {
            activePubkey = null;
        }),
    };
    const restoreManagedAccountSession = vi.fn(async (params: {
        requestedPubkeyHex: string;
    }): Promise<ManagedSessionRestoreResult> => ({
        success: true,
        pubkeyHex: params.requestedPubkeyHex,
    }));
    const accountManagerOverride = overrides.accountManager as Partial<typeof accountManager> | undefined;
    const { accountManager: _ignoredAccountManager, ...otherOverrides } = overrides;
    const deps = {
        getIsSwitchingAccount: () => isSwitchingAccount,
        setIsSwitchingAccount: vi.fn((next: boolean) => {
            isSwitchingAccount = next;
            switchingAccountStateHistory.push(next);
        }),
        getIsLoggingOut: () => isLoggingOut,
        setIsLoggingOut: vi.fn((next: boolean) => {
            isLoggingOut = next;
            loggingOutStateHistory.push(next);
        }),
        setProfileLoading: vi.fn(),
        getAuthStateSnapshot: () => authSnapshot,
        getCurrentRxNostr: () => currentRxNostr,
        setCurrentRxNostr: vi.fn((next: undefined) => {
            currentRxNostr = next;
        }),
        disposeNostrSession: vi.fn(() => undefined),
        nip46Service: {
            disconnect: vi.fn(async () => undefined),
        },
        parentClientService: {
            disconnect: vi.fn(),
        },
        accountManager: { ...accountManager, ...accountManagerOverride },
        restoreManagedAccountSession,
        restoreAccount: vi.fn(async (pubkeyHex: string): Promise<{ hasAuth: boolean; pubkeyHex?: string }> => ({
            hasAuth: true,
            pubkeyHex,
        })),
        handlePostAuth: vi.fn(async () => undefined),
        resetUploadDisplayState: vi.fn(),
        invalidatePendingAccountScopedAsyncState: vi.fn(),
        clearAccountScopedAsyncState: vi.fn(),
        logoutAccountFromAuthService: vi.fn(async () => null),
        resolveLogoutAccountAction: vi.fn((nextPubkey: string | null | undefined) => {
            if (typeof nextPubkey === 'string') {
                return { kind: 'switch', pubkeyHex: nextPubkey };
            }
            if (nextPubkey === null) {
                return { kind: 'guest' };
            }
            return { kind: 'keep-current' };
        }),
        clearAuthState: vi.fn(() => {
            authSnapshot = { type: 'none', pubkey: '' };
        }),
        setGuestProfile: vi.fn(),
        setProfileLoaded: vi.fn(),
        initializeNostr: vi.fn(async () => undefined),
        setSecretKey: vi.fn(),
        setErrorMessage: vi.fn(),
        refreshAccountList: vi.fn(),
        reloadWindow: vi.fn(),
        closeLogoutDialog: vi.fn(),
        logger: { error: vi.fn() },
        ...otherOverrides,
    };

    return {
        deps,
        controller: createAppAccountSessionController(deps as never),
        switchingAccountStateHistory,
        loggingOutStateHistory,
        getActivePubkey: () => activePubkey,
        setActivePubkey: (next: string | null) => {
            activePubkey = next;
        },
        setCurrentRuntime: (next: unknown) => {
            currentRxNostr = next;
        },
        setAuthSnapshot: (next: { type?: string; pubkey?: string }) => {
            authSnapshot = next;
        },
        accounts,
    };
}

describe('createAppAccountSessionController', () => {
    it('switching中の再入を拒否する', async () => {
        let resolveRestore: ((value: { success: true; pubkeyHex: string }) => void) | undefined;
        const restoreManagedAccountSession = vi.fn(() => new Promise<{ success: true; pubkeyHex: string }>((resolve) => {
            resolveRestore = resolve;
        }));
        const { controller } = createController({ restoreManagedAccountSession });

        const first = controller.switchAccount(TARGET_PUBKEY);
        await expect(controller.switchAccount(OTHER_PUBKEY)).resolves.toBe(false);
        resolveRestore?.({ success: true, pubkeyHex: TARGET_PUBKEY });
        await expect(first).resolves.toBe(true);
        expect(restoreManagedAccountSession).toHaveBeenCalledOnce();
    });

    it('target type確認をcurrent runtime cleanupより先に行う', async () => {
        const order: string[] = [];
        const { deps, controller } = createController({
            accountManager: {
                getAccountType: vi.fn((pubkeyHex: string) => {
                    order.push(`type:${pubkeyHex}`);
                    return pubkeyHex === TARGET_PUBKEY ? 'nip07' : 'parentClient';
                }),
                setActiveAccount: vi.fn(),
                clearActiveAccount: vi.fn(),
            },
            parentClientService: { disconnect: vi.fn(() => order.push('parent-disconnect')) },
        });

        await controller.switchAccount(TARGET_PUBKEY);

        expect(order.indexOf(`type:${TARGET_PUBKEY}`)).toBeLessThan(order.indexOf('parent-disconnect'));
        expect(deps.disposeNostrSession).toHaveBeenCalled();
    });

    it('target type欠落ではruntime、auth state、active pointerへ触れない', async () => {
        const { deps, controller, getActivePubkey } = createController({
            accountManager: {
                getAccountType: vi.fn(() => null),
                setActiveAccount: vi.fn(),
                clearActiveAccount: vi.fn(),
            },
        });

        await expect(controller.switchAccount(TARGET_PUBKEY)).resolves.toBe(false);

        expect(deps.disposeNostrSession).not.toHaveBeenCalled();
        expect(deps.clearAuthState).not.toHaveBeenCalled();
        expect(deps.accountManager.setActiveAccount).not.toHaveBeenCalled();
        expect(deps.accountManager.clearActiveAccount).not.toHaveBeenCalled();
        expect(getActivePubkey()).toBe(CURRENT_PUBKEY);
    });

    it('current parent client runtimeを通知なしでcleanupする', async () => {
        const { deps, controller } = createController();

        await controller.switchAccount(TARGET_PUBKEY);

        expect(deps.parentClientService.disconnect).toHaveBeenCalledWith(false);
        expect(deps.nip46Service.disconnect).not.toHaveBeenCalled();
        expect(deps.clearAccountScopedAsyncState).toHaveBeenCalledOnce();
    });

    it('current NIP-46 runtimeをcleanupする', async () => {
        const { deps, controller, setAuthSnapshot, accounts } = createController();
        accounts.set(CURRENT_PUBKEY, 'nip46');
        setAuthSnapshot({ type: 'nip46', pubkey: CURRENT_PUBKEY });

        await controller.switchAccount(TARGET_PUBKEY);

        expect(deps.nip46Service.disconnect).toHaveBeenCalledOnce();
        expect(deps.parentClientService.disconnect).not.toHaveBeenCalled();
    });

    it.each(['nsec', 'nip07'] as const)('current %sではremote signer cleanupを行わない', async (type) => {
        const { deps, controller, setAuthSnapshot, accounts } = createController();
        accounts.set(CURRENT_PUBKEY, type);
        setAuthSnapshot({ type, pubkey: CURRENT_PUBKEY });

        await controller.switchAccount(TARGET_PUBKEY);

        expect(deps.nip46Service.disconnect).not.toHaveBeenCalled();
        expect(deps.parentClientService.disconnect).not.toHaveBeenCalled();
    });

    it('正常targetではrestore、post-auth完了後の結果、active pointerが同じpubkeyになる', async () => {
        const {
            deps,
            controller,
            getActivePubkey,
            switchingAccountStateHistory,
        } = createController();

        await expect(controller.switchAccount(TARGET_PUBKEY)).resolves.toBe(true);

        expect(deps.restoreManagedAccountSession).toHaveBeenCalledWith(expect.objectContaining({
            requestedPubkeyHex: TARGET_PUBKEY,
            accountType: 'nip07',
        }));
        expect(deps.accountManager.setActiveAccount).toHaveBeenCalledWith(TARGET_PUBKEY);
        expect(deps.accountManager.getActiveAccountPubkey).toHaveBeenCalled();
        expect(getActivePubkey()).toBe(TARGET_PUBKEY);
        expect(deps.disposeNostrSession).toHaveBeenCalledOnce();
        expect(switchingAccountStateHistory).toEqual([true, false]);
    });

    it('target commit時に対象アカウントが消えた場合は失敗扱いにしてrollbackする', async () => {
        const {
            deps,
            controller,
            accounts,
            getActivePubkey,
            setCurrentRuntime,
        } = createController({
            restoreManagedAccountSession,
        });
        const targetPartialRuntime = { dispose: vi.fn() };
        deps.restoreAccount.mockImplementation(async (pubkeyHex: string): Promise<{ hasAuth: boolean; pubkeyHex?: string }> => {
            if (pubkeyHex === TARGET_PUBKEY) {
                accounts.delete(TARGET_PUBKEY);
                setCurrentRuntime(targetPartialRuntime);
            }
            return { hasAuth: true, pubkeyHex };
        });

        await expect(controller.switchAccount(TARGET_PUBKEY)).resolves.toBe(true);

        expect(deps.handlePostAuth).toHaveBeenNthCalledWith(1, TARGET_PUBKEY);
        expect(deps.handlePostAuth).toHaveBeenNthCalledWith(2, CURRENT_PUBKEY);
        expect(deps.accountManager.setActiveAccount).toHaveBeenCalledTimes(1);
        expect(deps.accountManager.setActiveAccount).toHaveBeenCalledWith(CURRENT_PUBKEY);
        expect(deps.disposeNostrSession).toHaveBeenCalledWith(targetPartialRuntime);
        expect(getActivePubkey()).toBe(CURRENT_PUBKEY);
    });

    it('rollback commit時にcurrent accountが消えた場合はguestへ収束する', async () => {
        const {
            deps,
            controller,
            accounts,
            getActivePubkey,
            setCurrentRuntime,
        } = createController({
            restoreManagedAccountSession,
        });
        const rollbackPartialRuntime = { dispose: vi.fn() };
        deps.restoreAccount.mockImplementation(async (pubkeyHex: string): Promise<{ hasAuth: boolean; pubkeyHex?: string }> => {
            if (pubkeyHex === CURRENT_PUBKEY) {
                accounts.delete(CURRENT_PUBKEY);
                setCurrentRuntime(rollbackPartialRuntime);
                return { hasAuth: true, pubkeyHex };
            }
            return { hasAuth: false };
        });

        await expect(controller.switchAccount(TARGET_PUBKEY)).resolves.toBe(false);

        expect(deps.handlePostAuth).toHaveBeenCalledWith(CURRENT_PUBKEY);
        expect(deps.accountManager.setActiveAccount).not.toHaveBeenCalled();
        expect(deps.disposeNostrSession).toHaveBeenCalledWith(rollbackPartialRuntime);
        expect(deps.accountManager.clearActiveAccount).toHaveBeenCalledOnce();
        expect(getActivePubkey()).toBeNull();
        expect(accounts.has(OTHER_PUBKEY)).toBe(true);
        expect(deps.restoreAccount).toHaveBeenCalledTimes(2);
    });

    it('target mismatchをcleanupしてcurrent authenticated accountを一度だけrollbackする', async () => {
        const events: string[] = [];
        const {
            deps,
            controller,
            getActivePubkey,
            setActivePubkey,
            setCurrentRuntime,
        } = createController();
        setActivePubkey(OTHER_PUBKEY);
        deps.disposeNostrSession.mockImplementation(() => {
            events.push('dispose');
            return undefined;
        });
        deps.restoreManagedAccountSession
            .mockImplementationOnce(async () => {
                events.push('target');
                setCurrentRuntime({ dispose: vi.fn() });
                return { success: false, reason: 'pubkey-mismatch' } as const;
            })
            .mockImplementationOnce(async () => {
                events.push('rollback');
                return { success: true, pubkeyHex: CURRENT_PUBKEY } as const;
            });

        await expect(controller.switchAccount(TARGET_PUBKEY)).resolves.toBe(true);

        expect(deps.restoreManagedAccountSession).toHaveBeenNthCalledWith(1, expect.objectContaining({ requestedPubkeyHex: TARGET_PUBKEY }));
        expect(deps.restoreManagedAccountSession).toHaveBeenNthCalledWith(2, expect.objectContaining({ requestedPubkeyHex: CURRENT_PUBKEY }));
        expect(events.indexOf('dispose', 1)).toBeLessThan(events.indexOf('rollback'));
        expect(deps.accountManager.setActiveAccount).toHaveBeenCalledTimes(1);
        expect(getActivePubkey()).toBe(CURRENT_PUBKEY);
    });

    it('NIP-07 targetのidentity read失敗後はcurrent accountを一度だけrollbackする', async () => {
        const { deps, controller, getActivePubkey } = createController({
            restoreManagedAccountSession,
        });
        deps.restoreAccount.mockImplementation(async (pubkeyHex: string) =>
            pubkeyHex === TARGET_PUBKEY
                ? { hasAuth: false, reason: 'identity-read-failed' }
                : { hasAuth: true, pubkeyHex },
        );

        await expect(controller.switchAccount(TARGET_PUBKEY)).resolves.toBe(true);

        expect(deps.restoreAccount).toHaveBeenCalledTimes(2);
        expect(deps.restoreAccount).toHaveBeenNthCalledWith(1, TARGET_PUBKEY, 'nip07');
        expect(deps.restoreAccount).toHaveBeenNthCalledWith(2, CURRENT_PUBKEY, 'parentClient');
        expect(deps.handlePostAuth).toHaveBeenCalledTimes(1);
        expect(deps.handlePostAuth).toHaveBeenCalledWith(CURRENT_PUBKEY);
        expect(getActivePubkey()).toBe(CURRENT_PUBKEY);
    });

    it('rollback mismatch後は再rollbackせずguestへ収束する', async () => {
        const { deps, controller, getActivePubkey } = createController();
        deps.restoreManagedAccountSession
            .mockResolvedValueOnce({ success: false, reason: 'pubkey-mismatch' })
            .mockResolvedValueOnce({ success: false, reason: 'pubkey-mismatch' });

        await expect(controller.switchAccount(TARGET_PUBKEY)).resolves.toBe(false);

        expect(deps.restoreManagedAccountSession).toHaveBeenCalledTimes(2);
        expect(deps.restoreManagedAccountSession).toHaveBeenNthCalledWith(2, expect.objectContaining({ requestedPubkeyHex: CURRENT_PUBKEY }));
        expect(deps.accountManager.setActiveAccount).not.toHaveBeenCalled();
        expect(deps.accountManager.clearActiveAccount).toHaveBeenCalledOnce();
        expect(getActivePubkey()).toBeNull();
        expect(deps.initializeNostr).toHaveBeenCalledOnce();
    });

    it('rollback不能時はguestへ収束する', async () => {
        const { deps, controller, setAuthSnapshot, accounts } = createController();
        accounts.delete(CURRENT_PUBKEY);
        setAuthSnapshot({ type: 'parentClient', pubkey: CURRENT_PUBKEY });
        deps.restoreManagedAccountSession.mockResolvedValueOnce({ success: false, reason: 'restore-failed' });

        await expect(controller.switchAccount(TARGET_PUBKEY)).resolves.toBe(false);

        expect(deps.restoreManagedAccountSession).toHaveBeenCalledOnce();
        expect(deps.accountManager.clearActiveAccount).toHaveBeenCalledOnce();
        expect(deps.initializeNostr).toHaveBeenCalledOnce();
    });

    it('guest開始時は保存active pointerがあってもaccount rollbackを行わない', async () => {
        const { deps, controller, setAuthSnapshot } = createController();
        setAuthSnapshot({ type: 'none', pubkey: CURRENT_PUBKEY });
        deps.restoreManagedAccountSession.mockResolvedValueOnce({ success: false, reason: 'restore-failed' });

        await expect(controller.switchAccount(TARGET_PUBKEY)).resolves.toBe(false);

        expect(deps.restoreManagedAccountSession).toHaveBeenCalledOnce();
        expect(deps.accountManager.clearActiveAccount).toHaveBeenCalledOnce();
    });

    it('guest初期化が失敗した場合もpartial runtimeを破棄する', async () => {
        const { deps, controller, setAuthSnapshot, setCurrentRuntime } = createController();
        const guestRuntime = { dispose: vi.fn() };
        setAuthSnapshot({ type: 'none', pubkey: '' });
        deps.restoreManagedAccountSession.mockResolvedValueOnce({ success: false, reason: 'restore-failed' });
        deps.initializeNostr.mockImplementation(async () => {
            setCurrentRuntime(guestRuntime);
            throw new Error('guest initialization failed');
        });

        await expect(controller.switchAccount(TARGET_PUBKEY)).resolves.toBe(false);

        expect(deps.disposeNostrSession).toHaveBeenLastCalledWith(guestRuntime);
        expect(deps.setSecretKey).toHaveBeenCalledWith('');
        expect(deps.setErrorMessage).toHaveBeenCalledWith('');
    });

    it('cleanup失敗後も残りcleanupを続け、再帰せずguestへ収束する', async () => {
        const { deps, controller, getActivePubkey } = createController({
            parentClientService: {
                disconnect: vi.fn(() => {
                    throw new Error('disconnect failed');
                }),
            },
        });
        deps.restoreManagedAccountSession.mockResolvedValueOnce({ success: false, reason: 'restore-failed' });
        deps.accountManager.getAccountType.mockImplementation((pubkeyHex: string) =>
            pubkeyHex === TARGET_PUBKEY ? 'nip07' : null,
        );

        await expect(controller.switchAccount(TARGET_PUBKEY)).resolves.toBe(false);

        expect(deps.clearAuthState).toHaveBeenCalled();
        expect(deps.accountManager.clearActiveAccount).toHaveBeenCalledOnce();
        expect(getActivePubkey()).toBeNull();
        expect(deps.restoreManagedAccountSession).toHaveBeenCalledOnce();
    });

    it('logoutAccount guest 分岐では認証情報を初期化する', async () => {
        const { deps, controller } = createController({
            logoutAccountFromAuthService: vi.fn(async () => null),
        });

        await controller.logoutAccount(CURRENT_PUBKEY);

        expect(deps.resetUploadDisplayState).toHaveBeenCalledOnce();
        expect(deps.invalidatePendingAccountScopedAsyncState).toHaveBeenCalledOnce();
        expect(deps.clearAccountScopedAsyncState).toHaveBeenCalledOnce();
        expect(deps.clearAuthState).toHaveBeenCalledOnce();
        expect(deps.setGuestProfile).toHaveBeenCalledOnce();
        expect(deps.initializeNostr).toHaveBeenCalledOnce();
        expect(deps.refreshAccountList).toHaveBeenCalledOnce();
        expect(deps.closeLogoutDialog).toHaveBeenCalledOnce();
    });

    it('cleanup完了までlogout actionとreloadを実行せず、isLoggingOutを維持する', async () => {
        let resolveLogout: ((value: string) => void) | undefined;
        const { deps, controller, loggingOutStateHistory } = createController({
            logoutAccountFromAuthService: vi.fn(() => new Promise<string>((resolve) => {
                resolveLogout = resolve;
            })),
        });

        const logoutPromise = controller.logoutAccount(CURRENT_PUBKEY);
        await Promise.resolve();

        expect(deps.resolveLogoutAccountAction).not.toHaveBeenCalled();
        expect(deps.reloadWindow).not.toHaveBeenCalled();
        expect(loggingOutStateHistory).toEqual([true]);

        resolveLogout?.(TARGET_PUBKEY);
        await logoutPromise;

        expect(deps.resolveLogoutAccountAction).toHaveBeenCalledWith(TARGET_PUBKEY);
        expect(deps.reloadWindow).toHaveBeenCalledOnce();
        expect(loggingOutStateHistory).toEqual([true, false]);
    });

    it('cleanup完了後にguest遷移、refresh、dialog closeを実行する', async () => {
        let resolveLogout: ((value: null) => void) | undefined;
        const { deps, controller } = createController({
            logoutAccountFromAuthService: vi.fn(() => new Promise<null>((resolve) => {
                resolveLogout = resolve;
            })),
        });

        const logoutPromise = controller.logoutAccount(CURRENT_PUBKEY);
        await Promise.resolve();

        expect(deps.resolveLogoutAccountAction).not.toHaveBeenCalled();
        expect(deps.initializeNostr).not.toHaveBeenCalled();
        expect(deps.refreshAccountList).not.toHaveBeenCalled();
        expect(deps.closeLogoutDialog).not.toHaveBeenCalled();

        resolveLogout?.(null);
        await logoutPromise;

        expect(deps.initializeNostr).toHaveBeenCalledOnce();
        expect(deps.refreshAccountList).toHaveBeenCalledOnce();
        expect(deps.closeLogoutDialog).toHaveBeenCalledOnce();
    });

    it('handleRemoteParentClientLogout はnon-parentClient authを無視する', async () => {
        const { deps, controller, setAuthSnapshot } = createController();
        setAuthSnapshot({ type: 'nip07', pubkey: CURRENT_PUBKEY });

        await controller.handleRemoteParentClientLogout(CURRENT_PUBKEY);

        expect(deps.logoutAccountFromAuthService).not.toHaveBeenCalled();
        expect(deps.restoreManagedAccountSession).not.toHaveBeenCalled();
    });

    it('handleRemoteParentClientLogout は復帰成功時にlogoutせずrefreshする', async () => {
        const { deps, controller, accounts } = createController();
        accounts.set(CURRENT_PUBKEY, 'nsec');

        await controller.handleRemoteParentClientLogout(CURRENT_PUBKEY);

        expect(deps.restoreManagedAccountSession).toHaveBeenCalledOnce();
        expect(deps.logoutAccountFromAuthService).not.toHaveBeenCalled();
        expect(deps.refreshAccountList).toHaveBeenCalledOnce();
    });

    it('logoutAccount のswitch分岐では再読み込みする', async () => {
        const { deps, controller } = createController({
            logoutAccountFromAuthService: vi.fn(async () => TARGET_PUBKEY),
        });

        await controller.logoutAccount(CURRENT_PUBKEY);

        expect(deps.reloadWindow).toHaveBeenCalledOnce();
        expect(deps.restoreManagedAccountSession).not.toHaveBeenCalled();
        expect(deps.closeLogoutDialog).not.toHaveBeenCalled();
    });

    it('remote Parent client logoutもcleanup await後に完了する', async () => {
        let resolveLogout: ((value: null) => void) | undefined;
        const { deps, controller } = createController({
            logoutAccountFromAuthService: vi.fn(() => new Promise<null>((resolve) => {
                resolveLogout = resolve;
            })),
        });

        const logoutPromise = controller.handleRemoteParentClientLogout(CURRENT_PUBKEY);
        await Promise.resolve();

        expect(deps.resolveLogoutAccountAction).not.toHaveBeenCalled();
        expect(deps.refreshAccountList).not.toHaveBeenCalled();

        resolveLogout?.(null);
        await logoutPromise;

        expect(deps.logoutAccountFromAuthService).toHaveBeenCalledWith(
            CURRENT_PUBKEY,
            { notifyParentClient: false },
        );
        expect(deps.refreshAccountList).toHaveBeenCalledOnce();
    });

    it('logoutの予期しないreject時にerrorを記録してisLoggingOutを解除する', async () => {
        const { deps, controller, loggingOutStateHistory } = createController({
            logoutAccountFromAuthService: vi.fn(async () => {
                throw new Error('logout failed');
            }),
        });

        await controller.logoutAccount(CURRENT_PUBKEY);

        expect(deps.logger.error).toHaveBeenCalledWith('ログアウト処理中にエラー', {
            stage: 'logout-account',
            reason: 'unexpected',
        });
        expect(deps.invalidatePendingAccountScopedAsyncState).toHaveBeenCalledOnce();
        expect(deps.clearAccountScopedAsyncState).not.toHaveBeenCalled();
        expect(loggingOutStateHistory).toEqual([true, false]);
    });
});
