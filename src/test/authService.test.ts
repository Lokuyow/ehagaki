import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    AuthService,
    AuthValidator,
    NsecAuthenticator,
    NostrLoginAuthenticator,
    ExternalAuthWaiter,
    ProfileCacheCleaner,
    NostrLoginStorageManager,
    AuthInitializer,
    type AuthServiceDependencies,
    type NostrLoginManagerInterface
} from '../lib/authService';
import { type NostrLoginAuth } from '../lib/keyManager';

// PWA関連のモック
vi.mock("virtual:pwa-register/svelte", () => ({
    useRegisterSW: () => ({
        needRefresh: false,
        updateServiceWorker: vi.fn()
    })
}));

// appStore.svelte.tsのモック
vi.mock("../stores/appStore.svelte.ts", () => ({
    setAuthInitialized: vi.fn(),
    setNsecAuth: vi.fn()
}));

// その他の依存関係をモック
vi.mock("../lib/keyManager", () => ({
    keyManager: {
        isValidNsec: vi.fn(),
        saveToStorage: vi.fn(),
        derivePublicKey: vi.fn(),
        loadFromStorage: vi.fn()
    },
    PublicKeyState: vi.fn().mockImplementation(() => ({
        setNsec: vi.fn(),
        setNostrLoginAuth: vi.fn()
    }))
}));

vi.mock("../lib/nostrLogin", () => ({
    nostrLoginManager: {
        isInitialized: false,
        init: vi.fn(),
        showLogin: vi.fn(),
        logout: vi.fn(),
        getCurrentUser: vi.fn(),
        setAuthHandler: vi.fn()
    }
}));

vi.mock("../lib/debug", () => ({
    debugLog: vi.fn()
}));

// --- モッククラス定義 ---
class MockStorage implements Storage {
    private store: Record<string, string> = {};

    get length() { return Object.keys(this.store).length; }

    getItem(key: string): string | null {
        return this.store[key] || null;
    }

    setItem(key: string, value: string): void {
        this.store[key] = value;
    }

    removeItem(key: string): void {
        delete this.store[key];
    }

    clear(): void {
        this.store = {};
    }

    key(index: number): string | null {
        const keys = Object.keys(this.store);
        return keys[index] || null;
    }
}

class MockPublicKeyState {
    setNsec = vi.fn();
    setNostrLoginAuth = vi.fn();
}

// KeyManagerと完全に互換性のあるモッククラス
class MockKeyManager {
    // 実際のKeyManagerと同じ構造でプライベートプロパティを定義
    private storage: any;
    private externalAuth: any;

    // パブリックメソッド
    isValidNsec = vi.fn();
    saveToStorage = vi.fn();
    derivePublicKey = vi.fn();
    loadFromStorage = vi.fn();
    pubkeyToNpub = vi.fn();
    getFromStore = vi.fn();
    hasStoredKey = vi.fn().mockReturnValue(false);
    isWindowNostrAvailable = vi.fn().mockReturnValue(false);
    getPublicKeyFromWindowNostr = vi.fn();

    constructor() {
        this.storage = {};
        this.externalAuth = {};
    }

    // プライベートプロパティにアクセスするためのゲッター
    getStorage = vi.fn().mockImplementation(() => this.storage);
    getExternalAuth = vi.fn().mockImplementation(() => this.externalAuth);
}

class MockNostrLoginManager implements NostrLoginManagerInterface {
    isInitialized = false;
    initialized = false;
    authHandler: any = null;
    isLoggingOut = false;
    initPromise: Promise<void> = Promise.resolve();
    init = vi.fn();
    showLogin = vi.fn();
    logout = vi.fn();
    getCurrentUser = vi.fn();
    setAuthHandler = vi.fn();
}

function createMockDependencies(): AuthServiceDependencies {
    return {
        keyManager: new MockKeyManager() as any, // 型アサーションでエラーを回避
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
        debugLog: vi.fn(),
        setNsecAuth: vi.fn(),
        setAuthInitialized: vi.fn(),
        nostrLoginManager: new MockNostrLoginManager() as any,
        setTimeout: vi.fn()
    };
}

// --- AuthValidator テスト ---
describe('AuthValidator', () => {
    let mockKeyManager: MockKeyManager;

    beforeEach(() => {
        mockKeyManager = new MockKeyManager();
    });

    it('有効な秘密鍵を正しく検証する', () => {
        mockKeyManager.isValidNsec.mockReturnValue(true);

        const result = AuthValidator.isValidSecretKey('valid-nsec', mockKeyManager);

        expect(result).toBe(true);
        expect(mockKeyManager.isValidNsec).toHaveBeenCalledWith('valid-nsec');
    });

    it('無効な秘密鍵を正しく拒否する', () => {
        mockKeyManager.isValidNsec.mockReturnValue(false);

        const result = AuthValidator.isValidSecretKey('invalid-nsec', mockKeyManager);

        expect(result).toBe(false);
    });

    it('pubkeyが必要な認証を正しく検証する', () => {
        const auth: NostrLoginAuth = { type: 'login', pubkey: 'test-pubkey' };

        expect(AuthValidator.hasRequiredPubkey(auth)).toBe(true);
    });

    it('pubkeyが不足している認証を正しく拒否する', () => {
        const auth: NostrLoginAuth = { type: 'login' };

        expect(AuthValidator.hasRequiredPubkey(auth)).toBe(false);
    });

    it('ログアウト認証を正しく識別する', () => {
        const auth: NostrLoginAuth = { type: 'logout' };

        expect(AuthValidator.isLogoutAuth(auth)).toBe(true);
    });
});

// --- NsecAuthenticator テスト ---
describe('NsecAuthenticator', () => {
    let authenticator: NsecAuthenticator;
    let mockKeyManager: MockKeyManager;
    let mockSetNsecAuth: ReturnType<typeof vi.fn>;
    let mockConsole: Console;

    beforeEach(() => {
        mockKeyManager = new MockKeyManager();
        mockSetNsecAuth = vi.fn();
        mockConsole = {
            log: vi.fn(),
            error: vi.fn(),
            warn: vi.fn()
        } as unknown as Console;

        authenticator = new NsecAuthenticator(mockKeyManager, mockSetNsecAuth, mockConsole);
    });

    it('有効な秘密鍵で認証に成功する', async () => {
        mockKeyManager.isValidNsec.mockReturnValue(true);
        mockKeyManager.saveToStorage.mockReturnValue({ success: true });
        mockKeyManager.derivePublicKey.mockReturnValue({
            hex: 'test-pubkey',
            npub: 'npub123',
            nprofile: 'nprofile123'
        });

        const result = await authenticator.authenticate('valid-nsec');

        expect(result.success).toBe(true);
        expect(result.pubkeyHex).toBe('test-pubkey');
        expect(mockSetNsecAuth).toHaveBeenCalledWith('test-pubkey', 'npub123', 'nprofile123');
    });

    it('無効な秘密鍵で認証に失敗する', async () => {
        mockKeyManager.isValidNsec.mockReturnValue(false);

        const result = await authenticator.authenticate('invalid-nsec');

        expect(result.success).toBe(false);
        expect(result.error).toBe('invalid_secret');
    });

    it('保存に失敗した場合にエラーを返す', async () => {
        mockKeyManager.isValidNsec.mockReturnValue(true);
        mockKeyManager.saveToStorage.mockReturnValue({ success: false });

        const result = await authenticator.authenticate('valid-nsec');

        expect(result.success).toBe(false);
        expect(result.error).toBe('error_saving');
    });

    it('公開鍵の導出に失敗した場合にエラーを返す', async () => {
        mockKeyManager.isValidNsec.mockReturnValue(true);
        mockKeyManager.saveToStorage.mockReturnValue({ success: true });
        mockKeyManager.derivePublicKey.mockReturnValue({ hex: '' });

        const result = await authenticator.authenticate('valid-nsec');

        expect(result.success).toBe(false);
        expect(result.error).toBe('derivation_failed');
    });

    it('例外が発生した場合にエラーを処理する', async () => {
        mockKeyManager.isValidNsec.mockReturnValue(true);
        mockKeyManager.saveToStorage.mockReturnValue({ success: true });
        mockKeyManager.derivePublicKey.mockImplementation(() => {
            throw new Error('Derivation error');
        });

        const result = await authenticator.authenticate('valid-nsec');

        expect(result.success).toBe(false);
        expect(result.error).toBe('authentication_error');
        expect(mockConsole.error).toHaveBeenCalledWith('nsec認証処理中にエラー:', expect.any(Error));
    });
});

// --- NostrLoginAuthenticator テスト ---
describe('NostrLoginAuthenticator', () => {
    let authenticator: NostrLoginAuthenticator;
    let mockPublicKeyState: MockPublicKeyState;
    let mockConsole: Console;

    beforeEach(() => {
        mockPublicKeyState = new MockPublicKeyState();
        mockConsole = {
            log: vi.fn(),
            error: vi.fn(),
            warn: vi.fn()
        } as unknown as Console;

        authenticator = new NostrLoginAuthenticator(mockPublicKeyState as any, mockConsole);
    });

    it('ログアウト認証を正しく処理する', async () => {
        const auth: NostrLoginAuth = { type: 'logout' };

        const result = await authenticator.authenticate(auth);

        expect(result.success).toBe(true);
    });

    it('有効なログイン認証を処理する', async () => {
        const auth: NostrLoginAuth = {
            type: 'login',
            pubkey: 'test-pubkey',
            npub: 'npub123'
        };

        const result = await authenticator.authenticate(auth);

        expect(result.success).toBe(true);
        expect(result.pubkeyHex).toBe('test-pubkey');
        expect(mockPublicKeyState.setNostrLoginAuth).toHaveBeenCalledWith(auth);
    });

    it('pubkeyが不足している場合にエラーを返す', async () => {
        const auth: NostrLoginAuth = { type: 'login' };

        const result = await authenticator.authenticate(auth);

        expect(result.success).toBe(false);
        expect(result.error).toBe('missing_pubkey');
        expect(mockConsole.warn).toHaveBeenCalledWith('NostrLoginAuth: pubkey is required for login/signup');
    });

    it('例外が発生した場合にエラーを処理する', async () => {
        const auth: NostrLoginAuth = { type: 'login', pubkey: 'test-pubkey' };
        mockPublicKeyState.setNostrLoginAuth.mockImplementation(() => {
            throw new Error('SetAuth error');
        });

        const result = await authenticator.authenticate(auth);

        expect(result.success).toBe(false);
        expect(result.error).toBe('nostr_login_error');
        expect(mockConsole.error).toHaveBeenCalledWith('nostr-login認証処理中にエラー:', expect.any(Error));
    });
});

// --- ExternalAuthWaiter テスト ---
describe('ExternalAuthWaiter', () => {
    let waiter: ExternalAuthWaiter;
    let mockWindow: any;
    let mockDebugLog: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockDebugLog = vi.fn();
        mockWindow = {};
        waiter = new ExternalAuthWaiter(mockWindow, mockDebugLog);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('window.nostrが利用可能な場合はtrueを返す', async () => {
        mockWindow.nostr = {
            getPublicKey: vi.fn()
        };

        const result = await waiter.waitForExternalAuth(100);

        expect(result).toBe(true);
        expect(mockDebugLog).toHaveBeenCalledWith('[waitForExternalAuth] window.nostr利用可能');
    });

    it('タイムアウトした場合はfalseを返す', async () => {
        vi.useFakeTimers();

        const promise = waiter.waitForExternalAuth(1000);

        // 時間を進める
        vi.advanceTimersByTime(1100);

        const result = await promise;

        expect(result).toBe(false);
        expect(mockDebugLog).toHaveBeenCalledWith('[waitForExternalAuth] タイムアウト');
    });
});

// --- ProfileCacheCleaner テスト ---
describe('ProfileCacheCleaner', () => {
    let cleaner: ProfileCacheCleaner;
    let mockNavigator: any;
    let mockConsole: Console;

    beforeEach(() => {
        mockConsole = {
            log: vi.fn(),
            error: vi.fn(),
            warn: vi.fn()
        } as unknown as Console;

        mockNavigator = {
            serviceWorker: {
                controller: {
                    postMessage: vi.fn()
                }
            }
        };

        cleaner = new ProfileCacheCleaner(mockNavigator, mockConsole);
    });

    it('プロフィールキャッシュクリアに成功する', async () => {
        // MessageChannelのモック
        const mockMessageChannel = {
            port1: { onmessage: null as any },
            port2: {}
        };

        Object.defineProperty(globalThis, 'MessageChannel', {
            value: vi.fn().mockImplementation(() => mockMessageChannel),
            writable: true
        });

        const promise = cleaner.clearProfileImageCache();

        // 成功メッセージをシミュレート
        setTimeout(() => {
            if (mockMessageChannel.port1.onmessage) {
                mockMessageChannel.port1.onmessage({
                    data: { success: true }
                } as any);
            }
        }, 10);

        await expect(promise).resolves.toBeUndefined();
        expect(mockConsole.log).toHaveBeenCalledWith('プロフィール画像キャッシュをクリアしました');
    });

    it('Service Workerが利用できない場合は何もしない', async () => {
        cleaner = new ProfileCacheCleaner({ serviceWorker: {} } as any, mockConsole);

        await cleaner.clearProfileImageCache();

        // エラーログは出力されない
        expect(mockConsole.error).not.toHaveBeenCalled();
    });
});

// --- NostrLoginStorageManager テスト ---
describe('NostrLoginStorageManager', () => {
    let manager: NostrLoginStorageManager;
    let mockStorage: MockStorage;
    let mockDebugLog: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockStorage = new MockStorage();
        mockDebugLog = vi.fn();
        manager = new NostrLoginStorageManager(mockStorage, mockDebugLog);
    });

    it('保存されたnostr-loginデータを取得する', () => {
        const testData = { pubkey: 'test-pubkey', npub: 'npub123' };
        mockStorage.setItem('__nostrlogin_nip46', JSON.stringify(testData));

        const result = manager.getStoredNostrLoginData();

        expect(result).toEqual(testData);
        expect(mockDebugLog).toHaveBeenCalledWith(
            '[getStoredNostrLoginData] localStorageからnip46取得',
            { nip46: testData }
        );
    });

    it('データが存在しない場合はnullを返す', () => {
        const result = manager.getStoredNostrLoginData();

        expect(result).toBeNull();
    });

    it('無効なJSONの場合はnullを返す', () => {
        mockStorage.setItem('__nostrlogin_nip46', 'invalid-json');

        const result = manager.getStoredNostrLoginData();

        expect(result).toBeNull();
        expect(mockDebugLog).toHaveBeenCalledWith(
            '[getStoredNostrLoginData] localStorage復元中に例外',
            expect.any(SyntaxError)
        );
    });

    it('pubkeyが不足している場合はnullを返す', () => {
        const testData = { npub: 'npub123' }; // pubkey なし
        mockStorage.setItem('__nostrlogin_nip46', JSON.stringify(testData));

        const result = manager.getStoredNostrLoginData();

        expect(result).toBeNull();
    });
});

// --- AuthService 統合テスト ---
describe('AuthService統合テスト', () => {
    let authService: AuthService;
    let mockDependencies: AuthServiceDependencies;
    let mockKeyManager: MockKeyManager;
    let mockNostrLoginManager: MockNostrLoginManager;

    beforeEach(() => {
        mockDependencies = createMockDependencies();
        mockKeyManager = mockDependencies.keyManager as any; // 型エラー回避: anyで渡す
        mockNostrLoginManager = mockDependencies.nostrLoginManager as any;

        authService = new AuthService(mockDependencies);
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

    it('nostr-login認証が正常に動作する', async () => {
        const auth: NostrLoginAuth = {
            type: 'login',
            pubkey: 'test-pubkey',
            npub: 'npub123'
        };

        const result = await authService.authenticateWithNostrLogin(auth);

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
        expect(result.isNostrLogin).toBe(false);
    });

    it('初期化でnostr-login認証を正しく検出する', async () => {
        // nsecは存在しない
        mockKeyManager.loadFromStorage.mockReturnValue(null);

        // nostr-loginからユーザー取得
        mockNostrLoginManager.getCurrentUser.mockReturnValue({
            pubkey: 'nostr-login-pubkey',
            npub: 'npub456'
        });

        const result = await authService.initializeAuth();

        expect(result.hasAuth).toBe(true);
        expect(result.pubkeyHex).toBe('nostr-login-pubkey');
        expect(result.isNostrLogin).toBe(true);
    });

    it('初期化で認証情報が見つからない場合', async () => {
        mockKeyManager.loadFromStorage.mockReturnValue(null);
        mockNostrLoginManager.getCurrentUser.mockReturnValue(null);

        const storage = mockDependencies.localStorage as MockStorage;
        storage.clear(); // localStorageも空にする

        const result = await authService.initializeAuth();

        expect(result.hasAuth).toBe(false);
    });

    it('内部コンポーネントへのアクセスが可能', () => {
        expect(authService.getNsecAuthenticator()).toBeInstanceOf(NsecAuthenticator);
        expect(authService.getNostrLoginAuthenticator()).toBeInstanceOf(NostrLoginAuthenticator);
        expect(authService.getProfileCacheCleaner()).toBeInstanceOf(ProfileCacheCleaner);
        expect(authService.getAuthInitializer()).toBeInstanceOf(AuthInitializer);
    });
});
