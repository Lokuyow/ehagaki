import { describe, it, expect, vi, beforeEach, afterEach, type MockInstance } from 'vitest';
import type { AuthServiceDependencies, Nip46SessionData } from '../../lib/types';
import { MockStorage, MockKeyManager } from '../helpers';

// nip46Service をモック（authService.ts のモジュールレベルインポート対策）
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

function createMockDependencies(): AuthServiceDependencies {
    return {
        keyManager: new MockKeyManager() as any,
        localStorage: new MockStorage(),
        window: {
            location: { pathname: '/' }
        } as Window,
        navigator: {
            serviceWorker: {
                controller: {
                    postMessage: vi.fn()
                }
            }
        } as unknown as Navigator,
        console: {
            log: vi.fn(),
            error: vi.fn(),
            warn: vi.fn()
        } as unknown as Console,
        setNsecAuth: vi.fn(),
        setNip07Auth: vi.fn(),
        setNip46Auth: vi.fn(),
    };
}

// --- authenticateWithNsec テスト ---
describe('AuthService.authenticateWithNsec', () => {
    let authService: AuthService;
    let mockDependencies: AuthServiceDependencies;
    let mockKeyManager: MockKeyManager;
    let mockConsole: Console;

    beforeEach(() => {
        mockDependencies = createMockDependencies();
        mockKeyManager = mockDependencies.keyManager as any;
        mockConsole = mockDependencies.console!;
        authService = new AuthService(mockDependencies);
    });

    it('有効な秘密鍵で認証に成功する', async () => {
        mockKeyManager.isValidNsec.mockReturnValue(true);
        mockKeyManager.saveToStorage.mockReturnValue({ success: true });
        mockKeyManager.derivePublicKey.mockReturnValue({
            hex: 'test-pubkey',
            npub: 'npub123',
            nprofile: 'nprofile123'
        });

        const result = await authService.authenticateWithNsec('valid-nsec');

        expect(result.success).toBe(true);
        expect(result.pubkeyHex).toBe('test-pubkey');
        expect(mockDependencies.setNsecAuth).toHaveBeenCalledWith('test-pubkey', 'npub123', 'nprofile123');
    });

    it('無効な秘密鍵で認証に失敗する', async () => {
        mockKeyManager.isValidNsec.mockReturnValue(false);

        const result = await authService.authenticateWithNsec('invalid-nsec');

        expect(result.success).toBe(false);
        expect(result.error).toBe('invalid_secret');
    });

    it('保存に失敗した場合にエラーを返す', async () => {
        mockKeyManager.isValidNsec.mockReturnValue(true);
        mockKeyManager.derivePublicKey.mockReturnValue({
            hex: 'test-pubkey',
            npub: 'npub123',
            nprofile: 'nprofile123'
        });
        mockKeyManager.saveToStorage.mockReturnValue({ success: false });

        const result = await authService.authenticateWithNsec('valid-nsec');

        expect(result.success).toBe(false);
        expect(result.error).toBe('error_saving');
    });

    it('公開鍵の導出に失敗した場合にエラーを返す', async () => {
        mockKeyManager.isValidNsec.mockReturnValue(true);
        mockKeyManager.saveToStorage.mockReturnValue({ success: true });
        mockKeyManager.derivePublicKey.mockReturnValue({ hex: '' });

        const result = await authService.authenticateWithNsec('valid-nsec');

        expect(result.success).toBe(false);
        expect(result.error).toBe('derivation_failed');
    });

    it('例外が発生した場合にエラーを処理する', async () => {
        mockKeyManager.isValidNsec.mockReturnValue(true);
        mockKeyManager.saveToStorage.mockReturnValue({ success: true });
        mockKeyManager.derivePublicKey.mockImplementation(() => {
            throw new Error('Derivation error');
        });

        const result = await authService.authenticateWithNsec('valid-nsec');

        expect(result.success).toBe(false);
        expect(result.error).toBe('authentication_error');
        expect(mockConsole.error).toHaveBeenCalledWith('nsec認証処理中にエラー:', expect.any(Error));
    });

    it('短すぎるNsecが拒否される', async () => {
        mockKeyManager.isValidNsec.mockReturnValue(false);

        const result = await authService.authenticateWithNsec('nsec123');

        expect(result.success).toBe(false);
        expect(result.error).toBe('invalid_secret');
    });

    it('様々なNsecフォーマットが正しく検証される', async () => {
        const testCases = [
            { nsec: 'nsec1' + 'a'.repeat(58), shouldBeValid: true },
            { nsec: 'nsec1' + 'b'.repeat(59), shouldBeValid: true },
            { nsec: 'nsec1abc', shouldBeValid: false },
            { nsec: '', shouldBeValid: false },
            { nsec: 'npub1' + 'a'.repeat(58), shouldBeValid: false },
        ];

        for (const testCase of testCases) {
            const freshDeps = createMockDependencies();
            const freshKeyManager = freshDeps.keyManager as any as MockKeyManager;
            freshKeyManager.isValidNsec.mockReturnValue(testCase.shouldBeValid);
            if (testCase.shouldBeValid) {
                freshKeyManager.saveToStorage.mockReturnValue({ success: true });
                freshKeyManager.derivePublicKey.mockReturnValue({
                    hex: 'abcdef',
                    npub: 'npub1test',
                    nprofile: 'nprofile1test'
                });
            }

            const freshService = new AuthService(freshDeps);
            const result = await freshService.authenticateWithNsec(testCase.nsec);
            expect(result.success).toBe(testCase.shouldBeValid);
        }
    });

    it('未認証→Nsec認証→認証済みの状態遷移', async () => {
        // 1. 未認証状態
        expect(mockKeyManager.loadFromStorage()).toBeNull();

        // 2. Nsecを入力して認証
        mockKeyManager.isValidNsec.mockReturnValue(true);
        mockKeyManager.saveToStorage.mockReturnValue({ success: true });
        mockKeyManager.derivePublicKey.mockReturnValue({
            hex: '1234567890abcdef',
            npub: 'npub1test',
            nprofile: 'nprofile1test'
        });

        const result = await authService.authenticateWithNsec(
            'nsec1test1234567890abcdefghijklmnopqrstuvwxyz1234567890ab'
        );

        expect(result.success).toBe(true);
        expect(result.pubkeyHex).toBe('1234567890abcdef');
    });
});

// --- AuthService 統合テスト ---
describe('AuthService統合テスト', () => {
    let authService: AuthService;
    let mockDependencies: AuthServiceDependencies;
    let mockKeyManager: MockKeyManager;

    beforeEach(() => {
        mockDependencies = createMockDependencies();
        mockKeyManager = mockDependencies.keyManager as any;
        authService = new AuthService(mockDependencies);

        // localStorageのモック
        const mockLocalStorage = {
            getItem: vi.fn(),
            setItem: vi.fn(),
            clear: vi.fn(),
            removeItem: vi.fn(),
            key: vi.fn(),
            length: 0
        };

        Object.defineProperty(window, 'localStorage', {
            value: mockLocalStorage,
            writable: true
        });

        // window.locationのモック
        Object.defineProperty(window, 'location', {
            value: {
                pathname: '/test',
                href: '',
                replace: vi.fn()
            },
            writable: true
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('nsec認証が正常に動作する', async () => {
        mockKeyManager.isValidNsec.mockReturnValue(true);
        mockKeyManager.saveToStorage.mockReturnValue({ success: true });
        mockKeyManager.derivePublicKey.mockReturnValue({
            hex: 'test-pubkey',
            npub: 'npub123',
            nprofile: 'nprofile123'
        });

        const result = await authService.authenticateWithNsec('valid-nsec');

        expect(result.success).toBe(true);
        expect(result.pubkeyHex).toBe('test-pubkey');
    });

    it('初期化でnsec認証を正しく検出する', async () => {
        mockKeyManager.loadFromStorage.mockReturnValue('valid-nsec');
        mockKeyManager.derivePublicKey.mockReturnValue({
            hex: 'test-pubkey',
            npub: 'npub123',
            nprofile: 'nprofile123'
        });

        const result = await authService.initializeAuth();

        expect(result.hasAuth).toBe(true);
        expect(result.pubkeyHex).toBe('test-pubkey');
    });

    it('初期化で認証情報が見つからない場合', async () => {
        mockKeyManager.loadFromStorage.mockReturnValue(null);

        const result = await authService.initializeAuth();

        expect(result.hasAuth).toBe(false);
    });

    it('isNip07Availableが利用可能', () => {
        // デフォルトのwindowモックにはnostrがないのでfalse
        expect(authService.isNip07Available()).toBe(false);
    });

    it('ログアウト処理が正常に動作する', () => {
        const mockStorage = mockDependencies.localStorage as MockStorage;
        mockStorage.setItem('testKey', 'testValue');

        expect(() => {
            authService.logout();
        }).not.toThrow();

        // ストレージがクリアされたことを確認
        expect(mockStorage.getItem('testKey')).toBeNull();
    });
});

// --- authenticateWithNip07 テスト ---
describe('AuthService.authenticateWithNip07', () => {
    let authService: AuthService;
    let mockDependencies: AuthServiceDependencies;
    let mockConsole: Console;

    beforeEach(() => {
        mockDependencies = createMockDependencies();
        mockConsole = mockDependencies.console!;
        authService = new AuthService(mockDependencies);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('NIP-07拡張機能未検出でエラーを返す', async () => {
        // デフォルトのwindowモックにはnostrがないので waitForExtension → false
        const result = await authService.authenticateWithNip07();
        expect(result.success).toBe(false);
        expect(result.error).toBe('nip07_not_available');
    });

    it('認証成功でsetNip07Auth呼出', async () => {
        // nip07 が利用可能な window を持つ依存を作成
        const nip07Deps = createMockDependencies();
        nip07Deps.window = {
            nostr: {
                getPublicKey: vi.fn().mockResolvedValue('abcdef1234567890'),
                signEvent: vi.fn(),
            }
        } as any;
        const service = new AuthService(nip07Deps);

        const result = await service.authenticateWithNip07();

        expect(result.success).toBe(true);
        expect(result.pubkeyHex).toBe('abcdef1234567890');
        expect(nip07Deps.setNip07Auth).toHaveBeenCalled();
    });

    it('認証成功でaccountManager.addAccount呼出', async () => {
        const nip07Deps = createMockDependencies();
        nip07Deps.window = {
            nostr: {
                getPublicKey: vi.fn().mockResolvedValue('abcdef1234567890'),
                signEvent: vi.fn(),
            }
        } as any;
        const service = new AuthService(nip07Deps);
        const mockAccountManager = {
            addAccount: vi.fn(),
            getAccountType: vi.fn(),
            removeAccount: vi.fn(),
            cleanupAccountData: vi.fn(),
            getActiveAccountPubkey: vi.fn(),
            getAccounts: vi.fn().mockReturnValue([]),
            setActiveAccount: vi.fn(),
            migrateFromSingleAccount: vi.fn(),
            hasAccount: vi.fn(),
        };
        service.setAccountManager(mockAccountManager as any);

        const result = await service.authenticateWithNip07();

        expect(result.success).toBe(true);
        expect(mockAccountManager.addAccount).toHaveBeenCalledWith('abcdef1234567890', 'nip07');
    });

    it('authenticate失敗でエラーを返す', async () => {
        const nip07Deps = createMockDependencies();
        nip07Deps.window = {
            nostr: {
                getPublicKey: vi.fn().mockResolvedValue(''),
                signEvent: vi.fn(),
            }
        } as any;
        const service = new AuthService(nip07Deps);

        const result = await service.authenticateWithNip07();

        expect(result.success).toBe(false);
    });
});

// --- authenticateWithNip46 テスト ---
describe('AuthService.authenticateWithNip46', () => {
    let mockDependencies: AuthServiceDependencies;

    beforeEach(() => {
        mockDependencies = createMockDependencies();
        vi.clearAllMocks();
    });

    it('Bunker URL接続成功でsetNip46Auth + session保存 + addAccount', async () => {
        const validPubkey = 'ab'.repeat(32); // 64文字hex
        const { nip46Service } = await import('../../lib/nip46Service');
        vi.mocked(nip46Service.connect).mockResolvedValue(validPubkey);
        vi.mocked(nip46Service.saveSession).mockImplementation(() => { });

        const service = new AuthService(mockDependencies);
        const mockAccountManager = {
            addAccount: vi.fn(),
            getAccountType: vi.fn(),
            removeAccount: vi.fn(),
            cleanupAccountData: vi.fn(),
            getActiveAccountPubkey: vi.fn(),
            getAccounts: vi.fn().mockReturnValue([]),
            setActiveAccount: vi.fn(),
            migrateFromSingleAccount: vi.fn(),
            hasAccount: vi.fn(),
        };
        service.setAccountManager(mockAccountManager as any);

        const result = await service.authenticateWithNip46('bunker://' + validPubkey + '?relay=wss://relay');

        expect(result.success).toBe(true);
        expect(result.pubkeyHex).toBe(validPubkey);
        expect(mockDependencies.setNip46Auth).toHaveBeenCalled();
        expect(nip46Service.saveSession).toHaveBeenCalled();
        expect(mockAccountManager.addAccount).toHaveBeenCalledWith(validPubkey, 'nip46');
    });

    it('接続失敗でエラーを返す', async () => {
        const { nip46Service } = await import('../../lib/nip46Service');
        vi.mocked(nip46Service.connect).mockRejectedValue(new Error('Connection timeout'));

        const service = new AuthService(mockDependencies);
        const result = await service.authenticateWithNip46('bunker://invalid');

        expect(result.success).toBe(false);
        expect(result.error).toBe('Connection timeout');
    });
});

// --- logoutAccount テスト ---
describe('AuthService.logoutAccount', () => {
    let authService: AuthService;
    let mockDependencies: AuthServiceDependencies;
    let mockAccountManager: any;

    beforeEach(() => {
        mockDependencies = createMockDependencies();
        authService = new AuthService(mockDependencies);
        mockAccountManager = {
            addAccount: vi.fn(),
            getAccountType: vi.fn().mockReturnValue('nsec'),
            removeAccount: vi.fn().mockReturnValue('next-pubkey'),
            cleanupAccountData: vi.fn(),
            getActiveAccountPubkey: vi.fn(),
            getAccounts: vi.fn().mockReturnValue([]),
            setActiveAccount: vi.fn(),
            migrateFromSingleAccount: vi.fn(),
            hasAccount: vi.fn(),
        };
        authService.setAccountManager(mockAccountManager);
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
        // setAccountManager 呼ばず
        expect(() => service.logoutAccount('pubkey1')).not.toThrow();
    });
});

// --- initializeAuth テスト ---
describe('AuthService.initializeAuth', () => {
    let mockDependencies: AuthServiceDependencies;
    let mockKeyManager: MockKeyManager;
    let mockAccountManager: any;

    beforeEach(() => {
        mockDependencies = createMockDependencies();
        mockKeyManager = mockDependencies.keyManager as any;
        mockAccountManager = {
            addAccount: vi.fn(),
            getAccountType: vi.fn(),
            removeAccount: vi.fn(),
            cleanupAccountData: vi.fn(),
            getActiveAccountPubkey: vi.fn().mockReturnValue(null),
            getAccounts: vi.fn().mockReturnValue([]),
            setActiveAccount: vi.fn(),
            migrateFromSingleAccount: vi.fn(),
            hasAccount: vi.fn(),
        };
        vi.clearAllMocks();
    });

    it('マルチアカウント: アクティブアカウント復元成功', async () => {
        mockAccountManager.getActiveAccountPubkey.mockReturnValue('active-pub');
        mockAccountManager.getAccountType.mockReturnValue('nsec');

        mockKeyManager.loadFromStorage.mockReturnValue('valid-nsec');
        mockKeyManager.derivePublicKey.mockReturnValue({
            hex: 'active-pub',
            npub: 'npub1active',
            nprofile: 'nprofile1active'
        });

        const service = new AuthService(mockDependencies);
        service.setAccountManager(mockAccountManager);

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

        // active-pub は復元失敗（秘密鍵なし）
        mockKeyManager.loadFromStorage.mockImplementation((pubkey?: string) => {
            if (pubkey === 'fallback-pub') return 'fallback-nsec';
            return null;
        });
        mockKeyManager.derivePublicKey.mockReturnValue({
            hex: 'fallback-pub',
            npub: 'npub1fallback',
            nprofile: 'nprofile1fallback'
        });

        const service = new AuthService(mockDependencies);
        service.setAccountManager(mockAccountManager);

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
        service.setAccountManager(mockAccountManager);

        const result = await service.initializeAuth();

        expect(result.hasAuth).toBe(false);
    });

    it('アカウントなし→レガシーnsec検出', async () => {
        mockKeyManager.loadFromStorage.mockReturnValue('legacy-nsec');
        mockKeyManager.derivePublicKey.mockReturnValue({
            hex: 'legacy-pubkey',
            npub: 'npub1legacy',
            nprofile: 'nprofile1legacy'
        });

        const service = new AuthService(mockDependencies);
        // accountManager未設定
        const result = await service.initializeAuth();

        expect(result.hasAuth).toBe(true);
        expect(result.pubkeyHex).toBe('legacy-pubkey');
    });

    it('アカウントなし→レガシーNIP-07検出', async () => {
        const validPubkey = 'ab'.repeat(32); // 64文字hex
        mockKeyManager.loadFromStorage.mockReturnValue(null);
        const storage = mockDependencies.localStorage as MockStorage;
        storage.setItem('nostr-nip07-pubkey', validPubkey);

        // NIP-07利用可能なwindowを注入
        const nip07Deps = { ...mockDependencies };
        nip07Deps.window = {
            nostr: {
                getPublicKey: vi.fn().mockResolvedValue(validPubkey),
                signEvent: vi.fn(),
            }
        } as any;

        const service = new AuthService(nip07Deps);
        const result = await service.initializeAuth();

        expect(result.hasAuth).toBe(true);
        expect(result.pubkeyHex).toBe(validPubkey);
    });

    it('アカウントなし→レガシーNIP-46検出', async () => {
        const validPubkey = 'cd'.repeat(32); // 64文字hex
        const { nip46Service, Nip46Service: Nip46ServiceClass } = await import('../../lib/nip46Service');
        mockKeyManager.loadFromStorage.mockReturnValue(null);

        const session: Nip46SessionData = {
            clientSecretKeyHex: 'abc',
            remoteSignerPubkey: 'remote',
            relays: ['wss://relay'],
            userPubkey: validPubkey
        };
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
        service.setAccountManager(mockAccountManager);

        const result = await service.initializeAuth();

        expect(result.hasAuth).toBe(false);
    });
});

// --- restoreAccount テスト ---
describe('AuthService.restoreAccount', () => {
    let mockDependencies: AuthServiceDependencies;
    let mockKeyManager: MockKeyManager;

    beforeEach(() => {
        mockDependencies = createMockDependencies();
        mockKeyManager = mockDependencies.keyManager as any;
        vi.clearAllMocks();
    });

    it('restoreNsecAccount: 秘密鍵存在→公開鍵導出→認証復元', async () => {
        mockKeyManager.loadFromStorage.mockReturnValue('stored-nsec');
        mockKeyManager.derivePublicKey.mockReturnValue({
            hex: 'restored-pubkey',
            npub: 'npub1restored',
            nprofile: 'nprofile1restored'
        });

        const service = new AuthService(mockDependencies);
        const result = await service.restoreAccount('restored-pubkey', 'nsec');

        expect(result.hasAuth).toBe(true);
        expect(result.pubkeyHex).toBe('restored-pubkey');
        expect(mockDependencies.setNsecAuth).toHaveBeenCalledWith('restored-pubkey', 'npub1restored', 'nprofile1restored');
    });

    it('restoreNsecAccount: 秘密鍵なし→失敗', async () => {
        mockKeyManager.loadFromStorage.mockReturnValue(null);

        const service = new AuthService(mockDependencies);
        const result = await service.restoreAccount('some-pubkey', 'nsec');

        expect(result.hasAuth).toBe(false);
    });

    it('restoreNip07Account: 拡張機能待機→認証成功', async () => {
        const validPubkey = 'ef'.repeat(32); // 64文字hex
        const nip07Deps = createMockDependencies();
        nip07Deps.window = {
            nostr: {
                getPublicKey: vi.fn().mockResolvedValue(validPubkey),
                signEvent: vi.fn(),
            }
        } as any;

        const service = new AuthService(nip07Deps);
        const result = await service.restoreAccount(validPubkey, 'nip07');

        expect(result.hasAuth).toBe(true);
        expect(result.pubkeyHex).toBe(validPubkey);
        expect(nip07Deps.setNip07Auth).toHaveBeenCalled();
    });

    it('restoreNip07Account: 拡張機能なし→失敗', async () => {
        const service = new AuthService(mockDependencies);
        const result = await service.restoreAccount('some-pubkey', 'nip07');

        expect(result.hasAuth).toBe(false);
    });

    it('restoreNip46Account: セッション復元→再接続成功', async () => {
        const validPubkey = 'ab'.repeat(32); // 64文字hex
        const { nip46Service, Nip46Service: Nip46ServiceClass } = await import('../../lib/nip46Service');
        const session: Nip46SessionData = {
            clientSecretKeyHex: 'abc',
            remoteSignerPubkey: 'remote',
            relays: ['wss://relay'],
            userPubkey: validPubkey
        };
        vi.mocked(Nip46ServiceClass.loadSession).mockReturnValue(session);
        vi.mocked(nip46Service.reconnect).mockResolvedValue(validPubkey);

        const service = new AuthService(mockDependencies);
        const result = await service.restoreAccount(validPubkey, 'nip46');

        expect(result.hasAuth).toBe(true);
        expect(result.pubkeyHex).toBe(validPubkey);
        expect(mockDependencies.setNip46Auth).toHaveBeenCalled();
    });

    it('restoreNip46Account: セッションなし→失敗', async () => {
        const validPubkey = 'cd'.repeat(32);
        const { Nip46Service: Nip46ServiceClass } = await import('../../lib/nip46Service');
        vi.mocked(Nip46ServiceClass.loadSession).mockReturnValue(null);

        const service = new AuthService(mockDependencies);
        const result = await service.restoreAccount(validPubkey, 'nip46');

        expect(result.hasAuth).toBe(false);
    });

    it('restoreNip46Account: 再接続失敗→失敗', async () => {
        const validPubkey = 'cd'.repeat(32);
        const { nip46Service, Nip46Service: Nip46ServiceClass } = await import('../../lib/nip46Service');
        const session: Nip46SessionData = {
            clientSecretKeyHex: 'abc',
            remoteSignerPubkey: 'remote',
            relays: ['wss://relay'],
            userPubkey: validPubkey
        };
        vi.mocked(Nip46ServiceClass.loadSession).mockReturnValue(session);
        vi.mocked(nip46Service.reconnect).mockRejectedValue(new Error('reconnect failed'));

        const service = new AuthService(mockDependencies);
        const result = await service.restoreAccount(validPubkey, 'nip46');

        expect(result.hasAuth).toBe(false);
    });

    it('不明なタイプ→失敗', async () => {
        const service = new AuthService(mockDependencies);
        const result = await service.restoreAccount('some-pubkey', 'unknown' as any);

        expect(result.hasAuth).toBe(false);
    });
});