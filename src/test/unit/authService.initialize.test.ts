import { afterEach, describe, it, expect, vi, beforeEach } from 'vitest';
import type { AuthServiceDependencies } from '../../lib/types';
import { MockStorage, type MockKeyManager } from '../helpers';
import './authServiceModuleMocks';

import { AuthService } from '../../lib/authService';
import { MANAGED_NIP07_IDENTITY_READ_TIMEOUT_MS } from '../../lib/authRestoreUtils';
import {
    createMockAccountManager,
    createMockDependencies,
    createMockNip07Dependencies,
    createMockNip46Session,
} from './authServiceTestUtils';

const ACTIVE_PUBKEY = 'aa'.repeat(32);
const FALLBACK_PUBKEY = 'bb'.repeat(32);
const NIP07_PUBKEY = 'cc'.repeat(32);

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

    afterEach(() => {
        vi.useRealTimers();
    });

    it('マルチアカウント: アクティブアカウント復元成功', async () => {
        mockAccountManager.getActiveAccountPubkey.mockReturnValue(ACTIVE_PUBKEY);
        mockAccountManager.getAccountType.mockReturnValue('nsec');

        mockKeyManager.readStoredKey.mockReturnValue({ status: 'found', secretKey: 'valid-nsec' });
        mockKeyManager.isValidNsec.mockReturnValue(true);
        mockKeyManager.derivePublicKey.mockReturnValue({
            hex: ACTIVE_PUBKEY,
            npub: 'npub1active',
            nprofile: 'nprofile1active',
        });

        const service = new AuthService(mockDependencies);
        service.setAccountManager(mockAccountManager as any);

        const result = await service.initializeAuth();

        expect(result.hasAuth).toBe(true);
        expect(result.pubkeyHex).toBe(ACTIVE_PUBKEY);
    });

    it('マルチアカウント: アクティブ失敗→他アカウントフォールバック成功', async () => {
        mockAccountManager.getActiveAccountPubkey.mockReturnValue(ACTIVE_PUBKEY);
        mockAccountManager.getAccountType.mockReturnValue('nsec');
        mockAccountManager.getAccounts.mockReturnValue([
            { pubkeyHex: ACTIVE_PUBKEY, type: 'nsec', addedAt: 1000 },
            { pubkeyHex: FALLBACK_PUBKEY, type: 'nsec', addedAt: 2000 },
        ]);

        mockKeyManager.readStoredKey.mockImplementation((pubkey: string) => {
            if (pubkey === FALLBACK_PUBKEY) return { status: 'found', secretKey: 'fallback-nsec' };
            return { status: 'missing' };
        });
        mockKeyManager.isValidNsec.mockReturnValue(true);
        mockKeyManager.derivePublicKey.mockReturnValue({
            hex: FALLBACK_PUBKEY,
            npub: 'npub1fallback',
            nprofile: 'nprofile1fallback',
        });

        const service = new AuthService(mockDependencies);
        service.setAccountManager(mockAccountManager as any);

        const result = await service.initializeAuth();

        expect(result.hasAuth).toBe(true);
        expect(result.pubkeyHex).toBe(FALLBACK_PUBKEY);
        expect(mockAccountManager.setActiveAccount).toHaveBeenCalledWith(FALLBACK_PUBKEY);
    });

    it('マルチアカウント: 全アカウント復元失敗', async () => {
        mockAccountManager.getActiveAccountPubkey.mockReturnValue(ACTIVE_PUBKEY);
        mockAccountManager.getAccountType.mockReturnValue('nsec');
        mockAccountManager.getAccounts.mockReturnValue([
            { pubkeyHex: ACTIVE_PUBKEY, type: 'nsec', addedAt: 1000 },
        ]);

        mockKeyManager.readStoredKey.mockReturnValue({ status: 'missing' });

        const service = new AuthService(mockDependencies);
        service.setAccountManager(mockAccountManager as any);

        const result = await service.initializeAuth();

        expect(result.hasAuth).toBe(false);
    });

    it('マルチアカウント: parentClient は起動時自動復元せず他アカウントへフォールバックする', async () => {
        const parentPubkey = 'dd'.repeat(32);
        mockAccountManager.getActiveAccountPubkey.mockReturnValue(parentPubkey);
        mockAccountManager.getAccountType.mockImplementation((pubkeyHex: string) => {
            if (pubkeyHex === parentPubkey) return 'parentClient';
            if (pubkeyHex === FALLBACK_PUBKEY) return 'nsec';
            return null;
        });
        mockAccountManager.getAccounts.mockReturnValue([
            { pubkeyHex: parentPubkey, type: 'parentClient', addedAt: 1000 },
            { pubkeyHex: FALLBACK_PUBKEY, type: 'nsec', addedAt: 2000 },
        ]);

        mockKeyManager.readStoredKey.mockImplementation((pubkey: string) => {
            if (pubkey === FALLBACK_PUBKEY) return { status: 'found', secretKey: 'fallback-nsec' };
            return { status: 'missing' };
        });
        mockKeyManager.isValidNsec.mockReturnValue(true);
        mockKeyManager.derivePublicKey.mockReturnValue({
            hex: FALLBACK_PUBKEY,
            npub: 'npub1fallback',
            nprofile: 'nprofile1fallback',
        });

        const { parentClientAuthService } = await import('../../lib/parentClientAuthService');

        const service = new AuthService(mockDependencies);
        service.setAccountManager(mockAccountManager as any);

        const result = await service.initializeAuth();

        expect(result.hasAuth).toBe(true);
        expect(result.pubkeyHex).toBe(FALLBACK_PUBKEY);
        expect(parentClientAuthService.reconnect).not.toHaveBeenCalled();
        expect(mockAccountManager.setActiveAccount).toHaveBeenCalledWith(FALLBACK_PUBKEY);
    });

    it('NIP-07 identity read timeout後に次のmanaged candidateを試す', async () => {
        vi.useFakeTimers();
        mockAccountManager.getActiveAccountPubkey.mockReturnValue(NIP07_PUBKEY);
        mockAccountManager.getAccountType.mockImplementation((pubkeyHex: string) => {
            if (pubkeyHex === NIP07_PUBKEY) return 'nip07';
            if (pubkeyHex === FALLBACK_PUBKEY) return 'nsec';
            return null;
        });
        mockAccountManager.getAccounts.mockReturnValue([
            { pubkeyHex: NIP07_PUBKEY, type: 'nip07', addedAt: 1000 },
            { pubkeyHex: FALLBACK_PUBKEY, type: 'nsec', addedAt: 2000 },
        ]);
        mockKeyManager.readStoredKey.mockImplementation((pubkey: string) =>
            pubkey === FALLBACK_PUBKEY
                ? { status: 'found', secretKey: 'fallback-nsec' }
                : { status: 'missing' },
        );
        mockKeyManager.isValidNsec.mockReturnValue(true);
        mockKeyManager.derivePublicKey.mockReturnValue({
            hex: FALLBACK_PUBKEY,
            npub: 'npub1fallback',
            nprofile: 'nprofile1fallback',
        });

        const deferred = new Promise<string>(() => undefined);
        mockDependencies.window = {
            nostr: {
                getPublicKey: vi.fn(() => deferred),
                signEvent: vi.fn(),
            },
        } as unknown as Window;
        const service = new AuthService(mockDependencies);
        service.setAccountManager(mockAccountManager as any);

        const initialize = service.initializeAuth();
        await vi.advanceTimersByTimeAsync(MANAGED_NIP07_IDENTITY_READ_TIMEOUT_MS);

        await expect(initialize).resolves.toMatchObject({
            hasAuth: true,
            pubkeyHex: FALLBACK_PUBKEY,
        });
        expect(mockDependencies.setNip07Auth).not.toHaveBeenCalled();
        expect(mockAccountManager.setActiveAccount).toHaveBeenCalledWith(FALLBACK_PUBKEY);
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
