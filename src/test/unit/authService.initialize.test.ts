import { afterEach, describe, it, expect, vi, beforeEach } from 'vitest';
import type { AuthServiceDependencies } from '../../lib/types';
import { MockStorage, type MockKeyManager } from '../helpers';
import './authServiceModuleMocks';

import { AuthService } from '../../lib/authService';
import { MANAGED_NIP07_IDENTITY_READ_TIMEOUT_MS } from '../../lib/authRestoreUtils';
import { AccountManager } from '../../lib/accountManager';
import { getNsecStorageKey } from '../../lib/authStorageKeys';
import { STORAGE_KEYS } from '../../lib/constants';
import {
    createWebComponentStorage,
    EHAGAKI_WEB_COMPONENT_STORAGE_PREFIX,
} from '../../lib/appStorage';
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
        mockAccountManager.getAccounts.mockReturnValue([
            { pubkeyHex: ACTIVE_PUBKEY, type: 'nsec', addedAt: 1000 },
        ]);

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

        mockKeyManager.readStoredKey.mockImplementation((pubkey?: string) => {
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

        mockKeyManager.readStoredKey.mockImplementation((pubkey?: string) => {
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
        mockKeyManager.readStoredKey.mockImplementation((pubkey?: string) =>
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

    it('保存済みNIP-07 mismatchのidentityを保持し、後続候補を最後まで試す', async () => {
        const nip07Deps = createMockNip07Dependencies(FALLBACK_PUBKEY, mockDependencies);
        const getPublicKey = (nip07Deps.window as any).nostr.getPublicKey as ReturnType<typeof vi.fn>;
        mockAccountManager.getActiveAccountPubkey.mockReturnValue(NIP07_PUBKEY);
        mockAccountManager.getAccountType.mockImplementation((pubkeyHex: string) => {
            if (pubkeyHex === NIP07_PUBKEY) return 'nip07';
            if (pubkeyHex === ACTIVE_PUBKEY) return 'nsec';
            return null;
        });
        mockAccountManager.getAccounts.mockReturnValue([
            { pubkeyHex: NIP07_PUBKEY, type: 'nip07', addedAt: 1000 },
            { pubkeyHex: ACTIVE_PUBKEY, type: 'nsec', addedAt: 2000 },
        ]);
        mockKeyManager.readStoredKey.mockReturnValue({ status: 'missing' });

        const service = new AuthService(nip07Deps);
        service.setAccountManager(mockAccountManager as any);

        await expect(service.initializeAuth()).resolves.toMatchObject({
            hasAuth: false,
            restoreOutcome: 'completed',
            nip07Identity: { hex: FALLBACK_PUBKEY },
        });
        expect(mockKeyManager.readStoredKey).toHaveBeenCalledWith(ACTIVE_PUBKEY);
        expect(getPublicKey).toHaveBeenCalledOnce();
    });

    it('保存済みNIP-07 mismatch identityが後続の保存済みNIP-07に一致すれば再問い合わせせず復元する', async () => {
        const nip07Deps = createMockNip07Dependencies(FALLBACK_PUBKEY, mockDependencies);
        const getPublicKey = (nip07Deps.window as any).nostr.getPublicKey as ReturnType<typeof vi.fn>;
        mockAccountManager.getActiveAccountPubkey.mockReturnValue(NIP07_PUBKEY);
        mockAccountManager.getAccountType.mockImplementation((pubkeyHex: string) =>
            pubkeyHex === NIP07_PUBKEY || pubkeyHex === FALLBACK_PUBKEY ? 'nip07' : null,
        );
        mockAccountManager.getAccounts.mockReturnValue([
            { pubkeyHex: NIP07_PUBKEY, type: 'nip07', addedAt: 1000 },
            { pubkeyHex: FALLBACK_PUBKEY, type: 'nip07', addedAt: 2000 },
        ]);

        const service = new AuthService(nip07Deps);
        service.setAccountManager(mockAccountManager as any);

        await expect(service.initializeAuth()).resolves.toEqual({
            hasAuth: true,
            pubkeyHex: FALLBACK_PUBKEY,
        });
        expect(getPublicKey).toHaveBeenCalledOnce();
        expect(mockAccountManager.setActiveAccount).toHaveBeenCalledWith(FALLBACK_PUBKEY);
    });

    it('NIP-46 managed restore失敗は正常評価済み未認証として返す', async () => {
        mockAccountManager.getActiveAccountPubkey.mockReturnValue(ACTIVE_PUBKEY);
        mockAccountManager.getAccountType.mockReturnValue('nip46');
        mockAccountManager.getAccounts.mockReturnValue([
            { pubkeyHex: ACTIVE_PUBKEY, type: 'nip46', addedAt: 1000 },
        ]);

        const service = new AuthService(mockDependencies);
        service.setAccountManager(mockAccountManager as any);

        await expect(service.initializeAuth()).resolves.toEqual({
            hasAuth: false,
            restoreOutcome: 'completed',
        });
    });

    it('保存credential読み取り異常は通常候補失敗と区別する', async () => {
        mockAccountManager.getActiveAccountPubkey.mockReturnValue(ACTIVE_PUBKEY);
        mockAccountManager.getAccountType.mockReturnValue('nsec');
        mockAccountManager.getAccounts.mockReturnValue([
            { pubkeyHex: ACTIVE_PUBKEY, type: 'nsec', addedAt: 1000 },
        ]);
        mockKeyManager.readStoredKey.mockReturnValue({ status: 'error' });

        const service = new AuthService(mockDependencies);
        service.setAccountManager(mockAccountManager as any);

        await expect(service.initializeAuth()).resolves.toEqual({
            hasAuth: false,
            restoreOutcome: 'infrastructure-failure',
        });
    });

    it('account listがない場合はlegacy NIP-07移行後にderived nsecをactiveとしてmanaged restoreする', async () => {
        const storage = new MockStorage();
        const derivedPubkey = 'ef'.repeat(32);
        storage.setItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY, 'legacy-credential');
        storage.setItem(STORAGE_KEYS.NOSTR_NIP07_PUBKEY, 'ab'.repeat(32));

        const keyManager = {
            isValidNsec: vi.fn(() => true),
            derivePublicKey: vi.fn(() => ({
                hex: derivedPubkey,
                npub: 'npub1derived',
                nprofile: 'nprofile1derived',
            })),
            saveToStorage: vi.fn(),
            loadFromStorage: vi.fn(() => storage.getItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY)),
            readStoredKey: vi.fn((pubkeyHex?: string) => {
                const secretKey = storage.getItem(getNsecStorageKey(pubkeyHex));
                return secretKey ? { status: 'found' as const, secretKey } : { status: 'missing' as const };
            }),
            writeStoredKeyForMigration: vi.fn((pubkeyHex: string, secretKey: string) => {
                storage.setItem(getNsecStorageKey(pubkeyHex), secretKey);
                return storage.getItem(getNsecStorageKey(pubkeyHex)) === secretKey
                    ? { status: 'saved' as const }
                    : { status: 'error' as const };
            }),
            removeStoredKeyForMigration: vi.fn((pubkeyHex?: string) => {
                storage.removeItem(getNsecStorageKey(pubkeyHex));
                return storage.getItem(getNsecStorageKey(pubkeyHex)) === null
                    ? { status: 'removed' as const }
                    : { status: 'error' as const };
            }),
            setCurrentSecretKey: vi.fn(),
        };
        const service = new AuthService({
            ...createMockDependencies(),
            localStorage: storage,
            keyManager: keyManager as any,
        });
        const accountManager = new AccountManager({ localStorage: storage });
        service.setAccountManager(accountManager);

        await expect(service.initializeAuth()).resolves.toEqual({ hasAuth: true, pubkeyHex: derivedPubkey });
        expect(accountManager.getActiveAccountPubkey()).toBe(derivedPubkey);
        expect(accountManager.getAccounts()).toEqual([
            expect.objectContaining({ pubkeyHex: 'ab'.repeat(32), type: 'nip07' }),
            expect.objectContaining({ pubkeyHex: derivedPubkey, type: 'nsec' }),
        ]);
        expect(storage.getItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY)).toBeNull();
        expect(keyManager.setCurrentSecretKey).toHaveBeenCalledTimes(1);
    });

    it('migration snapshot失敗時はlegacy migrationとmanaged restoreを開始しない', async () => {
        const storage = new MockStorage();
        storage.getItem = vi.fn(() => {
            throw new Error('storage unavailable');
        });
        mockDependencies.localStorage = storage;
        const service = new AuthService(mockDependencies);
        service.setAccountManager(mockAccountManager as any);

        await expect(service.initializeAuth()).resolves.toEqual({
            hasAuth: false,
            restoreOutcome: 'infrastructure-failure',
        });
        expect(mockAccountManager.cleanupNostrLoginData).not.toHaveBeenCalled();
        expect(mockAccountManager.migrateFromSingleAccount).not.toHaveBeenCalled();
        expect(mockDependencies.setNsecAuth).not.toHaveBeenCalled();
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

    it('ローカルnsec認証が無効なruntimeではaccount managerなしでもlegacy nsec restoreを開始しない', async () => {
        mockKeyManager.loadFromStorage.mockReturnValue('legacy-nsec');
        const service = new AuthService({
            ...mockDependencies,
            localNsecAuthEnabled: false,
        });

        await expect(service.initializeAuth()).resolves.toEqual({
            hasAuth: false,
            restoreOutcome: 'completed',
        });
        expect(mockKeyManager.loadFromStorage).not.toHaveBeenCalled();
        expect(mockDependencies.setNsecAuth).not.toHaveBeenCalled();
    });

    it('Web Component storage内のnsecだけをcleanupし、NIP-07復元とNIP-46・hostデータを維持する', async () => {
        const hostStorage = new MockStorage();
        const componentStorage = createWebComponentStorage(hostStorage);
        const nsecPubkey = '12'.repeat(32);
        const nip07Pubkey = '34'.repeat(32);
        const nip46Pubkey = '56'.repeat(32);
        const hostSentinels = {
            'host-sentinel': 'unchanged',
            [STORAGE_KEYS.NOSTR_ACCOUNTS]: 'host-accounts',
            [STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY]: 'host-credential-sentinel',
        };
        for (const [key, value] of Object.entries(hostSentinels)) {
            hostStorage.setItem(key, value);
        }
        componentStorage.setItem(STORAGE_KEYS.NOSTR_ACCOUNTS, JSON.stringify([
            { pubkeyHex: nsecPubkey, type: 'nsec', addedAt: 1 },
            { pubkeyHex: nip07Pubkey, type: 'nip07', addedAt: 2 },
            { pubkeyHex: nip46Pubkey, type: 'nip46', addedAt: 3 },
        ]));
        componentStorage.setItem(STORAGE_KEYS.NOSTR_ACTIVE_ACCOUNT, nsecPubkey);
        componentStorage.setItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY, 'legacy-component-credential');
        componentStorage.setItem(getNsecStorageKey(nsecPubkey), 'managed-component-credential');
        componentStorage.setItem(
            `${STORAGE_KEYS.NOSTR_NIP46_SESSION_PREFIX}${nip46Pubkey}`,
            'nip46-session-sentinel',
        );
        componentStorage.setItem('component-sentinel', 'keep');

        const service = new AuthService({
            ...createMockNip07Dependencies(nip07Pubkey),
            localStorage: componentStorage,
            localNsecAuthEnabled: false,
        });
        const accountManager = new AccountManager({ localStorage: componentStorage });
        service.setAccountManager(accountManager);

        await expect(service.initializeAuth()).resolves.toEqual({
            hasAuth: true,
            pubkeyHex: nip07Pubkey,
        });
        expect(accountManager.getAccounts()).toEqual([
            { pubkeyHex: nip07Pubkey, type: 'nip07', addedAt: 2 },
            { pubkeyHex: nip46Pubkey, type: 'nip46', addedAt: 3 },
        ]);
        expect(accountManager.getActiveAccountPubkey()).toBe(nip07Pubkey);
        expect(componentStorage.getItem(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY)).toBeNull();
        expect(componentStorage.getItem(getNsecStorageKey(nsecPubkey))).toBeNull();
        expect(componentStorage.getItem(
            `${STORAGE_KEYS.NOSTR_NIP46_SESSION_PREFIX}${nip46Pubkey}`,
        )).toBe('nip46-session-sentinel');
        expect(componentStorage.getItem('component-sentinel')).toBe('keep');
        for (const [key, value] of Object.entries(hostSentinels)) {
            expect(hostStorage.getItem(key)).toBe(value);
        }
        expect(Array.from({ length: hostStorage.length }, (_, index) => hostStorage.key(index)))
            .toContain(`${EHAGAKI_WEB_COMPONENT_STORAGE_PREFIX}component-sentinel`);
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
