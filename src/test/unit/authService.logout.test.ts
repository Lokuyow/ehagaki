import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { AuthServiceDependencies } from '../../lib/types';
import './authServiceModuleMocks';

vi.mock('../../lib/accountDataReset', () => ({
    resetManagedAccountData: vi.fn().mockResolvedValue(undefined),
}));

import { AuthService } from '../../lib/authService';
import { resetManagedAccountData } from '../../lib/accountDataReset';
import { nip46Service } from '../../lib/nip46Service';
import {
    parentClientAuthService,
    ParentClientAuthService,
} from '../../lib/parentClientAuthService';
import { createMockAccountManager, createMockDependencies } from './authServiceTestUtils';

describe('AuthService.logoutAccount', () => {
    let authService: AuthService;
    let mockDependencies: AuthServiceDependencies;
    let mockAccountManager: ReturnType<typeof createMockAccountManager>;

    beforeEach(() => {
        vi.mocked(nip46Service.disconnect).mockReset().mockResolvedValue(undefined);
        vi.mocked(parentClientAuthService.disconnect).mockReset();
        vi.mocked(parentClientAuthService.isConnected).mockReset().mockReturnValue(false);
        vi.mocked(parentClientAuthService.getUserPubkey).mockReset().mockReturnValue(null);
        vi.mocked(ParentClientAuthService.clearSession).mockReset();
        mockDependencies = createMockDependencies();
        authService = new AuthService(mockDependencies);
        mockAccountManager = createMockAccountManager({
            getAccountType: vi.fn().mockReturnValue('nsec'),
            removeAccount: vi.fn().mockReturnValue('next-pubkey'),
        });
        authService.setAccountManager(mockAccountManager as any);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('nsecアカウントのログアウト → cleanupAccountData + removeAccount', async () => {
        mockAccountManager.getAccountType.mockReturnValue('nsec');

        const result = await authService.logoutAccount('pubkey1');

        expect(mockAccountManager.cleanupAccountData).toHaveBeenCalledWith('pubkey1');
        expect(mockAccountManager.removeAccount).toHaveBeenCalledWith('pubkey1');
        expect(result).toBe('next-pubkey');
    });

    it('cleanup完了後にaccount registryから削除する', async () => {
        let resolveCleanup!: () => void;
        mockAccountManager.cleanupAccountData.mockReturnValue(new Promise<void>((resolve) => {
            resolveCleanup = resolve;
        }));

        const logoutPromise = authService.logoutAccount('pubkey1');
        await Promise.resolve();

        expect(mockAccountManager.removeAccount).not.toHaveBeenCalled();
        resolveCleanup();
        await expect(logoutPromise).resolves.toBe('next-pubkey');
        expect(mockAccountManager.removeAccount).toHaveBeenCalledWith('pubkey1');
    });

    it('nip46アカウントのログアウト → nip46Service.disconnect呼出', async () => {
        const { nip46Service } = await import('../../lib/nip46Service');
        mockAccountManager.getAccountType.mockReturnValue('nip46');

        await authService.logoutAccount('pubkey1');

        expect(nip46Service.disconnect).toHaveBeenCalled();
    });

    it('parentClientアカウントのログアウト → parentClientAuthService.disconnect(true)呼出', async () => {
        const { parentClientAuthService } = await import('../../lib/parentClientAuthService');
        mockAccountManager.getAccountType.mockReturnValue('parentClient');

        await authService.logoutAccount('pubkey1');

        expect(parentClientAuthService.disconnect).toHaveBeenCalledWith(true);
    });

    it('parentClientアカウントのリモートログアウト → notifyなしで切断', async () => {
        const { parentClientAuthService } = await import('../../lib/parentClientAuthService');
        mockAccountManager.getAccountType.mockReturnValue('parentClient');

        await authService.logoutAccount('pubkey1', { notifyParentClient: false });

        expect(parentClientAuthService.disconnect).toHaveBeenCalledWith(false);
    });

    it('保存済みtypeがparentClientでなくてもruntime parentClientなら切断する', async () => {
        const { parentClientAuthService } = await import('../../lib/parentClientAuthService');
        mockAccountManager.getAccountType.mockReturnValue('nsec');
        vi.mocked(parentClientAuthService.isConnected).mockReturnValue(true);
        vi.mocked(parentClientAuthService.getUserPubkey).mockReturnValue('pubkey1');

        await authService.logoutAccount('pubkey1', { notifyParentClient: false });

        expect(parentClientAuthService.disconnect).toHaveBeenCalledWith(false);
    });

    it.each([true, false])(
        'Parent client session削除失敗後もcleanupとregistry削除を継続する（notify=%s）',
        async (notifyParentClient) => {
            const events: string[] = [];
            mockAccountManager.getAccountType.mockReturnValue('parentClient');
            vi.mocked(parentClientAuthService.disconnect).mockImplementation((notify) => {
                events.push(`disconnect:${notify}`);
            });
            vi.mocked(ParentClientAuthService.clearSession).mockImplementation(() => {
                events.push('clearSession');
                throw new Error('session deletion failed');
            });
            mockAccountManager.cleanupAccountData.mockImplementation(async () => {
                events.push('cleanup');
            });
            mockAccountManager.removeAccount.mockImplementation(() => {
                events.push('removeAccount');
                return 'next-pubkey';
            });

            await expect(authService.logoutAccount('pubkey1', { notifyParentClient }))
                .resolves.toBe('next-pubkey');

            expect(events).toEqual([
                `disconnect:${notifyParentClient}`,
                'clearSession',
                'cleanup',
                'removeAccount',
            ]);
            expect(parentClientAuthService.disconnect).toHaveBeenCalledWith(notifyParentClient);
            expect(mockAccountManager.cleanupAccountData).toHaveBeenCalledWith('pubkey1');
            expect(mockAccountManager.removeAccount).toHaveBeenCalledWith('pubkey1');
            expect(mockDependencies.console?.error).toHaveBeenCalledWith(
                'アカウントデータ削除に失敗しました',
                {
                    stage: 'local-storage',
                    target: 'parent-client-session',
                    reason: 'unexpected',
                },
            );
            expect(mockDependencies.console?.error).not.toHaveBeenCalledWith(
                expect.anything(),
                expect.any(Error),
            );
        },
    );

    it('NIP-46 disconnect errorでもlogoutを完了する', async () => {
        const { nip46Service } = await import('../../lib/nip46Service');
        mockAccountManager.getAccountType.mockReturnValue('nip46');
        vi.mocked(nip46Service.disconnect).mockRejectedValue(new Error('disconnect failed'));

        await expect(authService.logoutAccount('pubkey1')).resolves.toBe('next-pubkey');

        expect(mockAccountManager.cleanupAccountData).toHaveBeenCalledWith('pubkey1');
        expect(mockAccountManager.removeAccount).toHaveBeenCalledWith('pubkey1');
        expect(mockDependencies.console?.error).toHaveBeenCalledWith('NIP-46切断エラー', {
            stage: 'disconnect',
            reason: 'unexpected',
        });
    });

    it('次のアクティブアカウント返却', async () => {
        mockAccountManager.removeAccount.mockReturnValue('next-active');
        const result = await authService.logoutAccount('pubkey1');
        expect(result).toBe('next-active');
    });

    it('最後のアカウント削除でnull返却', async () => {
        mockAccountManager.removeAccount.mockReturnValue(null);
        const result = await authService.logoutAccount('pubkey1');
        expect(result).toBeNull();
    });

    it('accountManager未設定時もエラーにならない', async () => {
        const service = new AuthService(mockDependencies);
        await expect(service.logoutAccount('pubkey1')).resolves.toBeUndefined();
    });

    it('最後のアカウントログアウトは await 可能な全体リセットを呼ぶ', async () => {
        mockAccountManager.getAccountType.mockReturnValue('nsec');

        await authService.logoutLastAccount('pubkey1');

        expect(resetManagedAccountData).toHaveBeenCalledWith({
            localStorage: mockDependencies.localStorage,
            indexedDB: mockDependencies.indexedDB,
            caches: mockDependencies.caches,
            console: mockDependencies.console,
        });
        expect(mockAccountManager.cleanupAccountData).not.toHaveBeenCalled();
        expect(mockAccountManager.removeAccount).not.toHaveBeenCalled();
    });

    it('最後の nip46 アカウントログアウトでは切断を await してから全体リセットする', async () => {
        const { nip46Service } = await import('../../lib/nip46Service');
        const { parentClientAuthService } = await import('../../lib/parentClientAuthService');
        mockAccountManager.getAccountType.mockReturnValue('nip46');
        vi.mocked(parentClientAuthService.isConnected).mockReturnValue(false);

        await authService.logoutLastAccount('pubkey1');

        expect(nip46Service.disconnect).toHaveBeenCalled();
        expect(resetManagedAccountData).toHaveBeenCalled();
    });
});
