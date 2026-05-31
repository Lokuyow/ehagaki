import { describe, expect, it, vi } from 'vitest';

import { createAppAuthLoginController } from '../../lib/appAuthLoginController';

function createController(overrides: Record<string, unknown> = {}) {
    let rxNostr: unknown = { dispose: vi.fn() };

    const deps = {
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
        expect(deps.handlePostAuth).toHaveBeenCalledWith('ab'.repeat(32));
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
