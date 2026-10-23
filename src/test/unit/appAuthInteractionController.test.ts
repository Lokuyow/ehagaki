import { describe, expect, it, vi } from 'vitest';

import { createAppAuthInteractionController } from '../../lib/appAuthInteractionController';

function createController() {
    const authType: string | undefined = 'nip46';
    const pubkeyHex: string | undefined = 'ab'.repeat(32);

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
        nip46Service: {
            disconnect: vi.fn(async () => undefined),
        },
        logger: { error: vi.fn() },
    };

    return {
        deps,
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
});
