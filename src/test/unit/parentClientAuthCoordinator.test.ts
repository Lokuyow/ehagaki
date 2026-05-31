import { describe, expect, it, vi } from 'vitest';

import { createParentClientAuthCoordinator } from '../../lib/parentClientAuthCoordinator';

describe('createParentClientAuthCoordinator', () => {
    it('requestParentClientAuth は多重呼び出しをまとめ、完了時に loading を戻す', async () => {
        let resolveAuth: ((value: { success: true; pubkeyHex: string }) => void) | undefined;
        const authenticateWithParentClient = vi.fn(
            () => new Promise<{ success: true; pubkeyHex: string }>((resolve) => {
                resolveAuth = resolve;
            }),
        );
        const setLoading = vi.fn();
        const onRequestSettled = vi.fn();

        const coordinator = createParentClientAuthCoordinator({
            authenticateWithParentClient,
            syncParentClientAccount: vi.fn(),
            setLoading,
            onRequestSettled,
        });

        const firstRequest = coordinator.requestParentClientAuth({ silent: true });
        const secondRequest = coordinator.requestParentClientAuth({ timeoutMs: 1000 });

        expect(authenticateWithParentClient).toHaveBeenCalledTimes(1);
        expect(coordinator.hasPendingRequest()).toBe(true);

        resolveAuth?.({ success: true, pubkeyHex: 'pubkey-1' });
        await expect(firstRequest).resolves.toEqual({ success: true, pubkeyHex: 'pubkey-1' });
        await expect(secondRequest).resolves.toEqual({ success: true, pubkeyHex: 'pubkey-1' });

        expect(setLoading).toHaveBeenNthCalledWith(1, true);
        expect(setLoading).toHaveBeenLastCalledWith(false);
        expect(onRequestSettled).toHaveBeenCalledOnce();
        expect(coordinator.hasPendingRequest()).toBe(false);
    });

    it('synchronizeParentClientAuth は成功時に active account を同期する', async () => {
        const authenticateWithParentClient = vi.fn().mockResolvedValue({
            success: true,
            pubkeyHex: 'pubkey-2',
        });
        const syncParentClientAccount = vi.fn();

        const coordinator = createParentClientAuthCoordinator({
            authenticateWithParentClient,
            syncParentClientAccount,
            setLoading: vi.fn(),
            onRequestSettled: vi.fn(),
        });

        await expect(coordinator.synchronizeParentClientAuth()).resolves.toEqual({
            success: true,
            pubkeyHex: 'pubkey-2',
        });

        expect(syncParentClientAccount).toHaveBeenCalledWith('pubkey-2');
    });
});
