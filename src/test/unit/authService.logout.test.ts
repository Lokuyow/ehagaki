import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { AuthServiceDependencies } from '../../lib/types';
import './authServiceModuleMocks';

import { AuthService } from '../../lib/authService';
import { createMockAccountManager, createMockDependencies } from './authServiceTestUtils';

describe('AuthService.logoutAccount', () => {
    let authService: AuthService;
    let mockDependencies: AuthServiceDependencies;
    let mockAccountManager: ReturnType<typeof createMockAccountManager>;

    beforeEach(() => {
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

    it('nsecアカウントのログアウト → cleanupAccountData + removeAccount', () => {
        mockAccountManager.getAccountType.mockReturnValue('nsec');

        const result = authService.logoutAccount('pubkey1');

        expect(mockAccountManager.cleanupAccountData).toHaveBeenCalledWith('pubkey1');
        expect(mockAccountManager.removeAccount).toHaveBeenCalledWith('pubkey1');
        expect(result).toBe('next-pubkey');
    });

    it('nip46アカウントのログアウト → nip46Service.disconnect呼出', async () => {
        const { nip46Service } = await import('../../lib/nip46Service');
        mockAccountManager.getAccountType.mockReturnValue('nip46');

        authService.logoutAccount('pubkey1');

        expect(nip46Service.disconnect).toHaveBeenCalled();
    });

    it('parentClientアカウントのログアウト → parentClientAuthService.disconnect(true)呼出', async () => {
        const { parentClientAuthService } = await import('../../lib/parentClientAuthService');
        mockAccountManager.getAccountType.mockReturnValue('parentClient');

        authService.logoutAccount('pubkey1');

        expect(parentClientAuthService.disconnect).toHaveBeenCalledWith(true);
    });

    it('parentClientアカウントのリモートログアウト → notifyなしで切断', async () => {
        const { parentClientAuthService } = await import('../../lib/parentClientAuthService');
        mockAccountManager.getAccountType.mockReturnValue('parentClient');

        authService.logoutAccount('pubkey1', { notifyParentClient: false });

        expect(parentClientAuthService.disconnect).toHaveBeenCalledWith(false);
    });

    it('保存済みtypeがparentClientでなくてもruntime parentClientなら切断する', async () => {
        const { parentClientAuthService } = await import('../../lib/parentClientAuthService');
        mockAccountManager.getAccountType.mockReturnValue('nsec');
        vi.mocked(parentClientAuthService.isConnected).mockReturnValue(true);
        vi.mocked(parentClientAuthService.getUserPubkey).mockReturnValue('pubkey1');

        authService.logoutAccount('pubkey1', { notifyParentClient: false });

        expect(parentClientAuthService.disconnect).toHaveBeenCalledWith(false);
    });

    it('次のアクティブアカウント返却', () => {
        mockAccountManager.removeAccount.mockReturnValue('next-active');
        const result = authService.logoutAccount('pubkey1');
        expect(result).toBe('next-active');
    });

    it('最後のアカウント削除でnull返却', () => {
        mockAccountManager.removeAccount.mockReturnValue(null);
        const result = authService.logoutAccount('pubkey1');
        expect(result).toBeNull();
    });

    it('accountManager未設定時もエラーにならない', () => {
        const service = new AuthService(mockDependencies);
        expect(() => service.logoutAccount('pubkey1')).not.toThrow();
    });
});