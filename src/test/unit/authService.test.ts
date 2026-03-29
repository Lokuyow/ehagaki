import { describe, it, expect, vi, beforeEach, afterEach, type MockInstance } from 'vitest';
import type { AuthServiceDependencies } from '../../lib/types';
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

import {
    AuthService,
    AuthValidator,
    NsecAuthenticator,
    Nip07Authenticator,
    ProfileCacheCleaner,
    AuthInitializer
} from '../../lib/authService';

// --- モッククラス定義 ---

class MockPublicKeyState {
    setNsec = vi.fn();
}

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
        setAuthInitialized: vi.fn(),
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

// --- ExternalAuthWaiter is no longer used ---

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

// --- AuthService 統合テスト ---
describe('AuthService統合テスト', () => {
    let authService: AuthService;
    let mockDependencies: AuthServiceDependencies;
    let mockKeyManager: MockKeyManager;
    let consoleSpy: MockInstance;

    beforeEach(() => {
        mockDependencies = createMockDependencies();
        mockKeyManager = mockDependencies.keyManager as any;

        consoleSpy = vi.spyOn(mockDependencies.console!, 'error');

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

    it('内部コンポーネントへのアクセスが可能', () => {
        expect(authService.getNsecAuthenticator()).toBeInstanceOf(NsecAuthenticator);
        expect(authService.getProfileCacheCleaner()).toBeInstanceOf(ProfileCacheCleaner);
        expect(authService.getAuthInitializer()).toBeInstanceOf(AuthInitializer);
    });

    it('ログアウト処理が正常に動作する', () => {
        expect(() => {
            authService.logout();
        }).not.toThrow();

        expect(localStorage.clear).toHaveBeenCalled();
    });
});