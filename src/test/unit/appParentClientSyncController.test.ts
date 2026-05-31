import { describe, expect, it, vi } from 'vitest';

import { createAppParentClientSyncController } from '../../lib/appParentClientSyncController';

function createController(overrides: Record<string, unknown> = {}) {
    let isBootstrapping = false;
    const deps = {
        isBootstrappingApp: () => isBootstrapping,
        hasPendingParentAuth: () => false,
        isCurrentParentClientRuntime: vi.fn(() => false),
        activateParentClientAuth: vi.fn(async () => undefined),
        flushPendingComposerAction: vi.fn(async () => undefined),
        logger: { error: vi.fn() },
        remoteSyncTimeoutMs: 5000,
        ...overrides,
    };

    return {
        deps,
        setBootstrapping: (next: boolean) => {
            isBootstrapping = next;
        },
        controller: createAppParentClientSyncController(deps as never),
    };
}

describe('createAppParentClientSyncController', () => {
    it('bootstrapping 中の remote login は保留され、flush で実行される', async () => {
        const { controller, deps, setBootstrapping } = createController();

        setBootstrapping(true);
        await controller.handleRemoteParentClientLogin('ab'.repeat(32));

        expect(deps.activateParentClientAuth).not.toHaveBeenCalled();

        setBootstrapping(false);
        await controller.flushPendingRemoteParentClientAndEmbedActions();

        expect(deps.activateParentClientAuth).toHaveBeenCalledTimes(1);
        expect(deps.flushPendingComposerAction).toHaveBeenCalledTimes(2);
    });

    it('current runtime と一致する場合は同期しない', async () => {
        const { controller, deps } = createController({
            isCurrentParentClientRuntime: vi.fn(() => true),
        });

        await controller.handleRemoteParentClientLogin('ab'.repeat(32));

        expect(deps.activateParentClientAuth).not.toHaveBeenCalled();
        expect(deps.flushPendingComposerAction).not.toHaveBeenCalled();
    });

    it('activate 失敗時は error を記録して flush する', async () => {
        const { controller, deps } = createController({
            activateParentClientAuth: vi.fn(async () => 'parent_client_auth_error'),
        });

        await controller.handleRemoteParentClientLogin('ab'.repeat(32));

        expect(deps.logger.error).toHaveBeenCalledTimes(1);
        expect(deps.flushPendingComposerAction).toHaveBeenCalledTimes(1);
    });

    it('pending parent auth 中の flush は何もしない', async () => {
        const { controller, deps } = createController({
            hasPendingParentAuth: () => true,
        });

        await controller.flushPendingRemoteParentClientAndEmbedActions();

        expect(deps.flushPendingComposerAction).not.toHaveBeenCalled();
    });
});
