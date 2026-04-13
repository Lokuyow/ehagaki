import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { AuthServiceDependencies } from '../../lib/types';

vi.mock('nip07-awaiter', () => ({
    waitNostr: vi.fn().mockResolvedValue(undefined),
    getNostr: vi.fn().mockReturnValue(undefined),
    isNostr: vi.fn().mockReturnValue(false),
}));

vi.mock('../../lib/nip46Service', () => ({
    nip46Service: {
        connect: vi.fn(),
        reconnect: vi.fn(),
        disconnect: vi.fn().mockResolvedValue(undefined),
        isConnected: vi.fn().mockReturnValue(false),
        getSigner: vi.fn().mockReturnValue(null),
        getUserPubkey: vi.fn().mockReturnValue(null),
        saveSession: vi.fn(),
    },
    Nip46Service: {
        loadSession: vi.fn().mockReturnValue(null),
        clearSession: vi.fn(),
    },
    BUNKER_REGEX: /^bunker:\/\/[0-9a-f]{64}\??[?\/\w:.=&%-]*$/,
}));

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