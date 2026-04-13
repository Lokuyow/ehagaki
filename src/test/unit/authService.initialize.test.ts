import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AuthServiceDependencies } from '../../lib/types';
import { MockStorage, type MockKeyManager } from '../helpers';
import './authServiceModuleMocks';

import { AuthService } from '../../lib/authService';
import {
    createMockAccountManager,
    createMockDependencies,
    createMockNip07Dependencies,
    createMockNip46Session,
} from './authServiceTestUtils';

describe('AuthService.initializeAuth', () => {
    let mockDependencies: AuthServiceDependencies;
    let mockKeyManager: MockKeyManager;
    let mockAccountManager: ReturnType<typeof createMockAccountManager>;

    beforeEach(() => {
        mockDependencies = createMockDependencies();
        mockKeyManager = mockDependencies.keyManager as any;
        mockAccountManager = createMockAccountManager();
        vi.clearAllMocks();
    });

    it('マルチアカウント: アクティブアカウント復元成功', async () => {
        mockAccountManager.getActiveAccountPubkey.mockReturnValue('active-pub');
        mockAccountManager.getAccountType.mockReturnValue('nsec');

        mockKeyManager.loadFromStorage.mockReturnValue('valid-nsec');
        mockKeyManager.derivePublicKey.mockReturnValue({
            hex: 'active-pub',
            npub: 'npub1active',
            nprofile: 'nprofile1active',
        });

        const service = new AuthService(mockDependencies);
        service.setAccountManager(mockAccountManager as any);

        const result = await service.initializeAuth();

        expect(result.hasAuth).toBe(true);
        expect(result.pubkeyHex).toBe('active-pub');
    });

    it('マルチアカウント: アクティブ失敗→他アカウントフォールバック成功', async () => {
        mockAccountManager.getActiveAccountPubkey.mockReturnValue('active-pub');
        mockAccountManager.getAccountType.mockReturnValue('nsec');
        mockAccountManager.getAccounts.mockReturnValue([
            { pubkeyHex: 'active-pub', type: 'nsec', addedAt: 1000 },
            { pubkeyHex: 'fallback-pub', type: 'nsec', addedAt: 2000 },
        ]);

        mockKeyManager.loadFromStorage.mockImplementation((pubkey?: string) => {
            if (pubkey === 'fallback-pub') return 'fallback-nsec';
            return null;
        });
        mockKeyManager.derivePublicKey.mockReturnValue({
            hex: 'fallback-pub',
            npub: 'npub1fallback',
            nprofile: 'nprofile1fallback',
        });

        const service = new AuthService(mockDependencies);
        service.setAccountManager(mockAccountManager as any);

        const result = await service.initializeAuth();

        expect(result.hasAuth).toBe(true);
        expect(result.pubkeyHex).toBe('fallback-pub');
        expect(mockAccountManager.setActiveAccount).toHaveBeenCalledWith('fallback-pub');
    });

    it('マルチアカウント: 全アカウント復元失敗', async () => {
        mockAccountManager.getActiveAccountPubkey.mockReturnValue('active-pub');
        mockAccountManager.getAccountType.mockReturnValue('nsec');
        mockAccountManager.getAccounts.mockReturnValue([
            { pubkeyHex: 'active-pub', type: 'nsec', addedAt: 1000 },
        ]);

        mockKeyManager.loadFromStorage.mockReturnValue(null);

        const service = new AuthService(mockDependencies);
        service.setAccountManager(mockAccountManager as any);

        const result = await service.initializeAuth();

        expect(result.hasAuth).toBe(false);
    });

    it('アカウントなし→レガシーnsec検出', async () => {
        mockKeyManager.loadFromStorage.mockReturnValue('legacy-nsec');
        mockKeyManager.derivePublicKey.mockReturnValue({
            hex: 'legacy-pubkey',
            npub: 'npub1legacy',
            nprofile: 'nprofile1legacy',
        });

        const service = new AuthService(mockDependencies);
        const result = await service.initializeAuth();

        expect(result.hasAuth).toBe(true);
        expect(result.pubkeyHex).toBe('legacy-pubkey');
    });

    it('アカウントなし→レガシーNIP-07検出', async () => {
        const validPubkey = 'ab'.repeat(32);
        mockKeyManager.loadFromStorage.mockReturnValue(null);
        const storage = mockDependencies.localStorage as MockStorage;
        storage.setItem('nostr-nip07-pubkey', validPubkey);

        const nip07Deps = createMockNip07Dependencies(validPubkey, mockDependencies);

        const service = new AuthService(nip07Deps);
        const result = await service.initializeAuth();

        expect(result.hasAuth).toBe(true);
        expect(result.pubkeyHex).toBe(validPubkey);
    });

    it('アカウントなし→レガシーNIP-46検出', async () => {
        const validPubkey = 'cd'.repeat(32);
        const { nip46Service, Nip46Service: Nip46ServiceClass } = await import('../../lib/nip46Service');
        mockKeyManager.loadFromStorage.mockReturnValue(null);

        const session = createMockNip46Session(validPubkey);
        vi.mocked(Nip46ServiceClass.loadSession).mockReturnValue(session);
        vi.mocked(nip46Service.reconnect).mockResolvedValue(validPubkey);
        vi.mocked(nip46Service.saveSession).mockImplementation(() => { });

        const service = new AuthService(mockDependencies);
        const result = await service.initializeAuth();

        expect(result.hasAuth).toBe(true);
        expect(result.pubkeyHex).toBe(validPubkey);
    });

    it('例外処理→hasAuth: false返却', async () => {
        mockAccountManager.migrateFromSingleAccount.mockImplementation(() => {
            throw new Error('migration error');
        });

        const service = new AuthService(mockDependencies);
        service.setAccountManager(mockAccountManager as any);

        const result = await service.initializeAuth();

        expect(result.hasAuth).toBe(false);
    });
});