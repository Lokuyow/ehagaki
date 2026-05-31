import { describe, expect, it, vi } from 'vitest';

import { createAppAuthInteractionController } from '../../lib/appAuthInteractionController';

function createController(overrides: Record<string, unknown> = {}) {
    let authType: string | undefined = 'nip46';
    let pubkeyHex: string | undefined = 'ab'.repeat(32);

    const deps = {
        getCurrentAuthType: () => authType,
        getCurrentPubkeyHex: () => pubkeyHex,
        authenticateWithNip07: vi.fn(async () => ({ success: true, pubkeyHex: 'cd'.repeat(32) })),
        authenticateWithNip46: vi.fn(async () => ({ success: true, pubkeyHex: 'ef'.repeat(32) })),
        cancelPendingNip46Auth: vi.fn(async () => undefined),
        clearNip46RuntimeForAuthChange: vi.fn(async () => undefined),
        handlePostAuth: vi.fn(async () => undefined),
        setNip07Loading: vi.fn(),
        setNip46Loading: vi.fn(),
        setNip46ConnectionCheckStatus: vi.fn(),
        nip46Service: {
            disconnect: vi.fn(async () => undefined),
            runManualConnectionCheck: vi.fn(async () => ({ success: true, skipped: false })),
        },
        logger: { error: vi.fn() },
        ...overrides,
    };

    return {
        deps,
        setAuthState: (nextType: string | undefined, nextPubkey: string | undefined) => {
            authType = nextType;
            pubkeyHex = nextPubkey;
        },
        controller: createAppAuthInteractionController(deps as never),
    };
}

describe('createAppAuthInteractionController', () => {
    it('NIP-07 login を実行する', async () => {
        const { controller, deps } = createController();

        await expect(controller.handleNip07Login()).resolves.toBeUndefined();

        expect(deps.authenticateWithNip07).toHaveBeenCalledTimes(1);
        expect(deps.handlePostAuth).toHaveBeenCalledTimes(1);
    });

    it('NIP-46 login を実行する', async () => {
        const { controller, deps } = createController();

        await expect(controller.handleNip46Login('bunker://test')).resolves.toBeUndefined();

        expect(deps.authenticateWithNip46).toHaveBeenCalledWith('bunker://test');
        expect(deps.handlePostAuth).toHaveBeenCalledTimes(1);
    });

    it('connection check は auth が nip46 で一致時のみ更新する', async () => {
        const { controller, deps } = createController();

        await controller.handleNip46ConnectionCheck('ab'.repeat(32));

        expect(deps.setNip46ConnectionCheckStatus).toHaveBeenNthCalledWith(1, 'idle');
        expect(deps.setNip46ConnectionCheckStatus).toHaveBeenNthCalledWith(2, 'success');
    });

    it('connection check は pubkey 不一致なら無視する', async () => {
        const { controller, deps, setAuthState } = createController();
        setAuthState('nip46', '11'.repeat(32));

        await controller.handleNip46ConnectionCheck('22'.repeat(32));

        expect(deps.nip46Service.runManualConnectionCheck).not.toHaveBeenCalled();
        expect(deps.setNip46ConnectionCheckStatus).not.toHaveBeenCalled();
    });

    it('connection check は skipped なら成功/失敗を更新しない', async () => {
        const { controller, deps } = createController({
            nip46Service: {
                disconnect: vi.fn(async () => undefined),
                runManualConnectionCheck: vi.fn(async () => ({ success: false, skipped: true })),
            },
        });

        await controller.handleNip46ConnectionCheck('ab'.repeat(32));

        expect(deps.setNip46ConnectionCheckStatus).toHaveBeenCalledTimes(1);
        expect(deps.setNip46ConnectionCheckStatus).toHaveBeenCalledWith('idle');
    });
});
