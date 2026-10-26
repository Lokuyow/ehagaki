import { describe, expect, it, vi } from 'vitest';

import { createAppParentClientSyncController } from '../../lib/appParentClientSyncController';

function createController(overrides: Record<string, unknown> = {}) {
    let isBootstrapping = false;
    const deps = {
        isBootstrappingApp: () => isBootstrapping,
        hasPendingParentAuth: () => false,
        hasPendingParentClientTransition: () => false,
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

    it('初期化中の同一通知をまとめ、別アカウントの最新通知だけを再認証する', async () => {
        let finish!: () => void;
        let current: string | null = null;
        const activate = vi.fn().mockImplementationOnce(() => new Promise<void>(resolve => { finish = resolve; }))
            .mockResolvedValue(undefined);
        const { controller, deps } = createController({
            activateParentClientAuth: activate,
            isCurrentParentClientRuntime: (pubkey: string) => pubkey === current,
        });
        const task = controller.handleRemoteParentClientLogin('aa'.repeat(32));
        await controller.handleRemoteParentClientLogin('aa'.repeat(32));
        await controller.handleRemoteParentClientLogin('bb'.repeat(32));
        await controller.handleRemoteParentClientLogin('cc'.repeat(32));
        expect(activate).toHaveBeenCalledTimes(1);
        current = 'aa'.repeat(32);
        finish();
        await task;
        expect(activate).toHaveBeenCalledTimes(2);
        expect(deps.logger.error).not.toHaveBeenCalled();
    });

    it('重複したreadyの通知で失敗した認証を繰り返さない', async () => {
        let finish!: (error: string) => void;
        const { controller, deps } = createController({
            activateParentClientAuth: vi.fn(() => new Promise<string>(resolve => { finish = resolve; })),
        });
        const task = controller.handleRemoteParentClientLogin('aa'.repeat(32));
        await controller.handleRemoteParentClientLogin('aa'.repeat(32));
        finish('parent_client_timeout');
        await task;
        expect(deps.activateParentClientAuth).toHaveBeenCalledTimes(1);
        expect(deps.logger.error).toHaveBeenCalledTimes(1);
    });

    it('ログアウト時に保留通知を破棄し、旧処理の完了で再ログインしない', async () => {
        let finish!: () => void;
        const { controller, deps } = createController({
            activateParentClientAuth: vi.fn(() => new Promise<void>(resolve => { finish = resolve; })),
        });
        const task = controller.handleRemoteParentClientLogin('aa'.repeat(32));
        await controller.handleRemoteParentClientLogin('bb'.repeat(32));
        controller.clearPendingRemoteLogin();
        finish();
        await task;
        await controller.flushPendingRemoteParentClientAndEmbedActions();
        expect(deps.activateParentClientAuth).toHaveBeenCalledTimes(1);
        expect(deps.logger.error).not.toHaveBeenCalled();
    });

    it('通知が元のアカウントへ戻った場合は古い切替予約を破棄する', async () => {
        let finish!: () => void;
        const { controller, deps } = createController({
            activateParentClientAuth: vi.fn(() => new Promise<void>(resolve => { finish = resolve; })),
        });
        const task = controller.handleRemoteParentClientLogin('aa'.repeat(32));
        await controller.handleRemoteParentClientLogin('bb'.repeat(32));
        await controller.handleRemoteParentClientLogin('aa'.repeat(32));
        finish();
        await task;
        expect(deps.activateParentClientAuth).toHaveBeenCalledTimes(1);
    });

    it('pubkeyなしの開始後に届く同一ready通知でも失敗後の再試行を予約しない', async () => {
        let finish!: (error: string) => void;
        const { controller, deps } = createController({
            activateParentClientAuth: vi.fn(() => new Promise<string>(resolve => { finish = resolve; })),
        });
        const task = controller.handleRemoteParentClientLogin(null);
        await controller.handleRemoteParentClientLogin('aa'.repeat(32));
        finish('parent_client_timeout');
        await task;
        expect(deps.activateParentClientAuth).toHaveBeenCalledTimes(1);
    });

    it('手動Aへの合流時に届いたB通知を、A完了後に再認証する', async () => {
        let finishManual!: () => void;
        let manualPending = true;
        let current = 'aa'.repeat(32);
        const activate = vi.fn()
            .mockImplementationOnce(() => new Promise<void>(resolve => { finishManual = resolve; }))
            .mockImplementationOnce(async () => { current = 'bb'.repeat(32); });
        const { controller } = createController({
            hasPendingParentClientTransition: () => manualPending,
            isCurrentParentClientRuntime: (pubkey: string) => !manualPending && pubkey === current,
            activateParentClientAuth: activate,
        });
        const task = controller.handleRemoteParentClientLogin('bb'.repeat(32));
        expect(activate).toHaveBeenCalledTimes(1);
        manualPending = false;
        finishManual();
        await task;
        expect(activate).toHaveBeenCalledTimes(2);
        expect(current).toBe('bb'.repeat(32));
    });

    it.each(['same-account', 'failed'] as const)('手動ログインへの%s合流で余分な再認証をしない', async (outcome) => {
        let finishManual!: (error?: string) => void;
        const { controller, deps } = createController({
            hasPendingParentClientTransition: () => true,
            isCurrentParentClientRuntime: vi.fn(() => outcome === 'same-account'),
            activateParentClientAuth: vi.fn(() => new Promise<string | undefined>(resolve => { finishManual = resolve; })),
        });
        // An existing manual transition has not exposed its runtime yet.
        vi.mocked(deps.isCurrentParentClientRuntime).mockReturnValueOnce(false);
        const task = controller.handleRemoteParentClientLogin('aa'.repeat(32));
        finishManual(outcome === 'failed' ? 'parent_client_timeout' : undefined);
        await task;
        expect(deps.activateParentClientAuth).toHaveBeenCalledTimes(1);
    });
});
