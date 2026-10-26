import { describe, expect, it, vi } from 'vitest';

import { createAppAuthLoginController } from '../../lib/appAuthLoginController';

function createController(overrides: Record<string, unknown> = {}) {
    let rxNostr: unknown = { dispose: vi.fn() };

    const deps = {
        beginParentClientTransition: vi.fn(() => 1),
        isAuthTransitionCurrent: vi.fn(() => true),
        finishParentClientTransition: vi.fn(),
        parentClientAuthCoordinator: {
            synchronizeParentClientAuth: vi.fn(async () => ({
                success: true,
                pubkeyHex: 'ab'.repeat(32),
            })),
        },
        getCurrentAuthType: () => 'nip46',
        getCurrentPubkeyHex: () => 'cd'.repeat(32),
        getCurrentRxNostr: () => rxNostr,
        setCurrentRxNostr: (next: undefined) => {
            rxNostr = next;
        },
        clearNip46RuntimeForAuthChange: vi.fn(async () => undefined),
        nip46Service: {
            disconnect: vi.fn(async () => undefined),
        },
        disposeNostrSession: vi.fn(() => undefined),
        handlePostAuth: vi.fn(async () => undefined),
        cancelPendingNip46Auth: vi.fn(async () => undefined),
        authenticateWithNsec: vi.fn(async () => ({ success: true, pubkeyHex: 'ef'.repeat(32) })),
        handleSuccessfulAuthResult: vi.fn(async () => true),
        setErrorMessage: vi.fn(),
        setProfileLoading: vi.fn(),
        logger: { error: vi.fn() },
        ...overrides,
    };

    return {
        deps,
        controller: createAppAuthLoginController(deps as never),
    };
}

describe('createAppAuthLoginController', () => {
    it('activateParentClientAuth success で session を更新し post auth する', async () => {
        const { deps, controller } = createController();

        await expect(controller.activateParentClientAuth()).resolves.toBeUndefined();

        expect(
            deps.parentClientAuthCoordinator.synchronizeParentClientAuth,
        ).toHaveBeenCalledTimes(1);
        expect(deps.clearNip46RuntimeForAuthChange).toHaveBeenCalledTimes(1);
        expect(deps.disposeNostrSession).toHaveBeenCalledTimes(1);
        expect(deps.handlePostAuth).toHaveBeenCalledWith('ab'.repeat(32), { generation: 1 });
    });

    it('activateParentClientAuth failure は error code を返す', async () => {
        const { controller } = createController({
            parentClientAuthCoordinator: {
                synchronizeParentClientAuth: vi.fn(async () => ({
                    success: false,
                    error: 'parent_sync_failed',
                })),
            },
        });

        await expect(controller.activateParentClientAuth()).resolves.toBe('parent_sync_failed');
    });

    it('手動・自動ログインが重なってもpost-auth完了まで同じ処理を共有する', async () => {
        let finishPostAuth!: () => void;
        const { deps, controller } = createController({
            handlePostAuth: vi.fn(() => new Promise<void>(resolve => { finishPostAuth = resolve; })),
        });
        const automatic = controller.activateParentClientAuth({ silent: true });
        await vi.waitFor(() => expect(deps.handlePostAuth).toHaveBeenCalledTimes(1));
        const repeated = controller.activateParentClientAuth({ silent: true });
        const manual = controller.handleParentClientLogin();
        expect(repeated).toBe(automatic);
        expect(controller.hasPendingParentClientTransition()).toBe(true);
        expect(deps.beginParentClientTransition).toHaveBeenCalledTimes(1);
        expect(deps.disposeNostrSession).toHaveBeenCalledTimes(1);
        finishPostAuth();
        await Promise.all([automatic, repeated, manual]);
        expect(deps.handlePostAuth).toHaveBeenCalledTimes(1);
        expect(deps.cancelPendingNip46Auth).toHaveBeenCalledTimes(1);
        expect(deps.finishParentClientTransition).toHaveBeenCalledTimes(1);
        expect(controller.hasPendingParentClientTransition()).toBe(false);
    });

    it('認証応答前の遷移で無効になったログインはruntimeを置き換えない', async () => {
        let current = true;
        let authenticate!: (value: { success: boolean; pubkeyHex: string }) => void;
        const { deps, controller } = createController({
            isAuthTransitionCurrent: () => current,
            parentClientAuthCoordinator: {
                synchronizeParentClientAuth: vi.fn(() => new Promise(resolve => { authenticate = resolve; })),
            },
        });
        const task = controller.activateParentClientAuth();
        await vi.waitFor(() => expect(authenticate).toBeTypeOf('function'));
        current = false;
        authenticate({ success: true, pubkeyHex: 'ab'.repeat(32) });
        await task;
        expect(deps.disposeNostrSession).not.toHaveBeenCalled();
        expect(deps.handlePostAuth).not.toHaveBeenCalled();
        expect(deps.finishParentClientTransition).toHaveBeenCalledTimes(1);
    });

    it('失敗した処理を解放し、次の明示的なログインを受け付ける', async () => {
        const { deps, controller } = createController({
            handlePostAuth: vi.fn().mockRejectedValueOnce(new Error('bootstrap failed')).mockResolvedValue(undefined),
        });
        await expect(controller.activateParentClientAuth()).rejects.toThrow('bootstrap failed');
        expect(controller.hasPendingParentClientTransition()).toBe(false);
        await controller.activateParentClientAuth();
        expect(deps.handlePostAuth).toHaveBeenCalledTimes(2);
        expect(deps.finishParentClientTransition).toHaveBeenCalledTimes(2);
    });

    it('saveSecretKey failure はエラーを設定する', async () => {
        const setErrorMessage = vi.fn();
        const { deps, controller } = createController({
            authenticateWithNsec: vi.fn(async () => ({ success: false, error: 'authentication_error' })),
            setErrorMessage,
        });

        await controller.saveSecretKey('nsec1...');

        expect(deps.cancelPendingNip46Auth).toHaveBeenCalledTimes(1);
        expect(setErrorMessage).toHaveBeenCalledWith('authentication_error');
        expect(deps.handleSuccessfulAuthResult).not.toHaveBeenCalled();
    });

    it('saveSecretKey success は auth result を処理する', async () => {
        const { deps, controller } = createController();

        await controller.saveSecretKey('nsec1...');

        expect(deps.setErrorMessage).toHaveBeenCalledWith('');
        expect(deps.clearNip46RuntimeForAuthChange).toHaveBeenCalledTimes(1);
        expect(deps.handleSuccessfulAuthResult).toHaveBeenCalledTimes(1);
    });

    it('handleParentClientLogin は pending auth を cancel して activate する', async () => {
        const { deps, controller } = createController();

        await expect(controller.handleParentClientLogin()).resolves.toBeUndefined();

        expect(deps.cancelPendingNip46Auth).toHaveBeenCalledTimes(1);
        expect(
            deps.parentClientAuthCoordinator.synchronizeParentClientAuth,
        ).toHaveBeenCalledTimes(1);
    });
});
