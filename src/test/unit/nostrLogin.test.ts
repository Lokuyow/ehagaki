import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    NostrLoginManager,
    NostrLoginUtils,
    NostrLoginAuthHandler,
    NostrLoginInitializer,
    NostrLoginLauncher,
    NostrLoginEventEmitter
} from '../../lib/nostrLogin';
import type { NostrLoginOptions, NostrLoginDependencies, NostrLoginEventHandler } from '../../lib/types';

// --- モッククラス定義 ---
class MockDocument {
    dispatchEvent = vi.fn();
}

class MockWindow {
    nostrLogin: any = null;
    document: MockDocument = new MockDocument();
    setTimeout = vi.fn();
    console = {
        log: vi.fn(),
        error: vi.fn(),
        warn: vi.fn()
    };
}

class MockConsole {
    log = vi.fn();
    error = vi.fn();
    warn = vi.fn();
}

function createMockDependencies(): NostrLoginDependencies {
    return {
        window: new MockWindow() as any,
        document: new MockDocument() as any,
        console: new MockConsole() as any,
        setTimeout: vi.fn(),
        importNostrLogin: vi.fn().mockResolvedValue({
            init: vi.fn(),
            launch: vi.fn()
        })
    };
}

// --- NostrLoginUtils テスト ---
describe('NostrLoginUtils', () => {
    describe('createMergedOptions', () => {
        it('デフォルト設定とカスタム設定をマージする', () => {
            const options: NostrLoginOptions = {
                theme: 'ocean',
                bunkers: ['bunker1', 'bunker2']
            };

            const result = NostrLoginUtils.createMergedOptions(options);

            expect(result).toEqual({
                theme: 'ocean',
                noBanner: true,
                methods: 'connect, extension, local',
                perms: 'get_public_key,sign_event:1,sign_event:27235',
                startScreen: 'welcome',
                bunkers: ['bunker1', 'bunker2']
            });
        });

        it('空のオプションでデフォルト設定を返す', () => {
            const result = NostrLoginUtils.createMergedOptions({});

            expect(result).toEqual({
                theme: 'default',
                noBanner: true,
                methods: 'connect, extension, local',
                perms: 'get_public_key,sign_event:1,sign_event:27235',
                startScreen: 'welcome'
            });
        });
    });

    describe('processBunkers', () => {
        it('配列を文字列に変換する', () => {
            const bunkers = ['bunker1', 'bunker2', 'bunker3'];

            const result = NostrLoginUtils.processBunkers(bunkers);

            expect(result).toBe('bunker1,bunker2,bunker3');
        });

        it('undefinedの場合はundefinedを返す', () => {
            const result = NostrLoginUtils.processBunkers(undefined);

            expect(result).toBeUndefined();
        });

        it('空配列の場合は空文字列を返す', () => {
            const result = NostrLoginUtils.processBunkers([]);

            expect(result).toBe('');
        });
    });

    describe('npubToPubkey', () => {
        it('有効なnpubを公開鍵に変換する', async () => {
            // 実際の有効なnpubを使用（テスト用）
            const npub = 'npub1w0rthyjyp2f5gful0gm2500pwyxfrx93a85289xdz0sd6hyef33sh2cu4x';

            const result = await NostrLoginUtils.npubToPubkey(npub);

            expect(result.success).toBe(true);
            expect(result.pubkey).toBeDefined();
            expect(typeof result.pubkey).toBe('string');
        });

        it('空のnpubでエラーを返す', async () => {
            const result = await NostrLoginUtils.npubToPubkey('');

            expect(result.success).toBe(false);
            expect(result.error).toEqual({
                type: 'decode',
                message: 'npub is empty or null'
            });
        });

        it('無効なnpubフォーマットでエラーを返す', async () => {
            const result = await NostrLoginUtils.npubToPubkey('invalid-npub');

            expect(result.success).toBe(false);
            expect(result.error?.type).toBe('decode');
        });
    });

    describe('getCurrentUserFromWindow', () => {
        it('windowからユーザー情報を取得する', () => {
            const mockWindow = {
                nostrLogin: {
                    pubkey: 'test-pubkey',
                    npub: 'npub123'
                }
            } as any;

            const result = NostrLoginUtils.getCurrentUserFromWindow(mockWindow);

            expect(result).toEqual({
                pubkey: 'test-pubkey',
                npub: 'npub123'
            });
        });

        it('nostrLoginが存在しない場合はnullを返す', () => {
            const mockWindow = {} as any;

            const result = NostrLoginUtils.getCurrentUserFromWindow(mockWindow);

            expect(result).toBeNull();
        });

        it('pubkeyが存在しない場合はnullを返す', () => {
            const mockWindow = {
                nostrLogin: { npub: 'npub123' }
            } as any;

            const result = NostrLoginUtils.getCurrentUserFromWindow(mockWindow);

            expect(result).toBeNull();
        });
    });
});

// --- NostrLoginAuthHandler テスト ---
describe('NostrLoginAuthHandler', () => {
    let handler: NostrLoginAuthHandler;
    let mockConsole: MockConsole;
    let mockAuthHandler: ReturnType<typeof vi.fn>;
    let mockIsLoggingOut: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockConsole = new MockConsole();
        mockAuthHandler = vi.fn();
        mockIsLoggingOut = vi.fn().mockReturnValue(false);

        handler = new NostrLoginAuthHandler(
            mockConsole as any,
            () => mockAuthHandler,
            mockIsLoggingOut
        );
    });

    it('ログアウトコールバックを処理する', async () => {
        await handler.handleAuthCallback('', {});

        expect(mockAuthHandler).toHaveBeenCalledWith({ type: 'logout' });
    });

    it('有効なnpubでログインコールバックを処理する', async () => {
        const npub = 'npub1w0rthyjyp2f5gful0gm2500pwyxfrx93a85289xdz0sd6hyef33sh2cu4x';

        await handler.handleAuthCallback(npub, { type: 'login' });

        expect(mockAuthHandler).toHaveBeenCalledWith({
            type: 'login',
            pubkey: expect.any(String),
            npub,
            otpData: undefined
        });
    });

    it('ログアウト中はコールバックを実行しない', async () => {
        mockIsLoggingOut.mockReturnValue(true);

        await handler.handleAuthCallback('npub123', {});

        expect(mockAuthHandler).not.toHaveBeenCalled();
    });

    it('authHandlerが存在しない場合は何もしない', async () => {
        handler = new NostrLoginAuthHandler(
            mockConsole as any,
            () => null,
            mockIsLoggingOut
        );

        await handler.handleAuthCallback('npub123', {});

        expect(mockConsole.warn).not.toHaveBeenCalled();
    });

    it('無効なnpubの場合は警告を出力する', async () => {
        await handler.handleAuthCallback('invalid-npub', { type: 'login' });

        expect(mockConsole.warn).toHaveBeenCalledWith(
            'NostrLogin: Failed to get pubkey from npub',
            expect.any(Object)
        );
    });
});

// --- NostrLoginInitializer テスト ---
describe('NostrLoginInitializer', () => {
    let initializer: NostrLoginInitializer;
    let mockConsole: MockConsole;
    let mockImportNostrLogin: ReturnType<typeof vi.fn>;
    let mockAuthHandler: NostrLoginAuthHandler;

    beforeEach(() => {
        mockConsole = new MockConsole();
        mockImportNostrLogin = vi.fn().mockResolvedValue({
            init: vi.fn(),
            launch: vi.fn()
        });
        // 修正: vi.fn() を渡すことで onAuth の呼び出しで例外が出ないようにする
        mockAuthHandler = { handleAuthCallback: vi.fn() } as any;

        initializer = new NostrLoginInitializer(
            mockConsole as any,
            mockImportNostrLogin,
            mockAuthHandler
        );
    });

    it('正常に初期化する', async () => {
        const options: NostrLoginOptions = { theme: 'ocean' };

        const result = await initializer.initialize(options);

        expect(result.success).toBe(true);
        expect(mockImportNostrLogin).toHaveBeenCalled();
        expect(mockConsole.log).toHaveBeenCalledWith('nostr-login初期化完了');
    });

    it('初期化に失敗した場合にエラーを返す', async () => {
        mockImportNostrLogin.mockRejectedValue(new Error('Import failed'));

        const result = await initializer.initialize({});

        expect(result.success).toBe(false);
        expect(result.error).toEqual({
            type: 'initialization',
            message: 'Failed to initialize nostr-login',
            originalError: expect.any(Error)
        });
        expect(mockConsole.error).toHaveBeenCalled();
    });

    it('オプションを正しくマージして初期化する', async () => {
        const mockInit = vi.fn();
        mockImportNostrLogin.mockResolvedValue({ init: mockInit, launch: vi.fn() });

        const options: NostrLoginOptions = {
            theme: 'purple',
            bunkers: ['bunker1', 'bunker2']
        };

        await initializer.initialize(options);

        expect(mockInit).toHaveBeenCalledWith({
            theme: 'purple',
            noBanner: true,
            methods: 'connect, extension, local',
            perms: 'get_public_key,sign_event:1,sign_event:27235',
            startScreen: 'welcome',
            bunkers: 'bunker1,bunker2',
            onAuth: expect.any(Function)
        });
    });
});

// --- NostrLoginLauncher テスト ---
describe('NostrLoginLauncher', () => {
    let launcher: NostrLoginLauncher;
    let mockImportNostrLogin: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockImportNostrLogin = vi.fn().mockResolvedValue({
            init: vi.fn(),
            launch: vi.fn()
        });

        launcher = new NostrLoginLauncher(mockImportNostrLogin);
    });

    it('正常にローンチする', async () => {
        const mockLaunch = vi.fn();
        mockImportNostrLogin.mockResolvedValue({ init: vi.fn(), launch: mockLaunch });

        const result = await launcher.launch('login');

        expect(result.success).toBe(true);
        expect(mockLaunch).toHaveBeenCalledWith('login');
    });

    it('startScreenが指定されていない場合はwelcomeを使用する', async () => {
        const mockLaunch = vi.fn();
        mockImportNostrLogin.mockResolvedValue({ init: vi.fn(), launch: mockLaunch });

        await launcher.launch();

        expect(mockLaunch).toHaveBeenCalledWith('welcome');
    });

    it('ローンチに失敗した場合にエラーを返す', async () => {
        const mockLaunch = vi.fn().mockRejectedValue(new Error('Launch failed'));
        mockImportNostrLogin.mockResolvedValue({ init: vi.fn(), launch: mockLaunch });

        const result = await launcher.launch();

        expect(result.success).toBe(false);
        expect(result.error).toEqual({
            type: 'launch',
            message: 'Failed to launch nostr-login',
            originalError: expect.any(Error)
        });
    });
});

// --- NostrLoginEventEmitter テスト ---
describe('NostrLoginEventEmitter', () => {
    let eventEmitter: NostrLoginEventEmitter;
    let mockDocument: MockDocument;
    let mockSetTimeout: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockDocument = new MockDocument();
        mockSetTimeout = vi.fn();

        eventEmitter = new NostrLoginEventEmitter(
            mockDocument as any,
            mockSetTimeout
        );
    });

    it('ログアウトイベントを発行する', () => {
        const mockSetLoggingOutFlag = vi.fn();

        eventEmitter.logout(mockSetLoggingOutFlag);

        expect(mockDocument.dispatchEvent).toHaveBeenCalledWith(
            expect.objectContaining({ type: 'nlLogout' })
        );
        expect(mockSetLoggingOutFlag).toHaveBeenCalledWith(true);
        expect(mockSetTimeout).toHaveBeenCalled();

        // setTimeout のコールバックを実行
        const timeoutCallback = mockSetTimeout.mock.calls[0][0];
        timeoutCallback();
        expect(mockSetLoggingOutFlag).toHaveBeenCalledWith(false);
    });

    it('ダークモードイベントを発行する', () => {
        eventEmitter.setDarkMode(true);

        expect(mockDocument.dispatchEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'nlDarkMode',
                detail: true
            })
        );
    });

    it('ログアウトイベント発行エラーを適切に処理する', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        mockDocument.dispatchEvent.mockImplementation(() => {
            throw new Error('dispatchEvent failed');
        });

        const mockSetLoggingOutFlag = vi.fn();

        // エラーが発生してもクラッシュしないことを確認
        expect(() => {
            eventEmitter.logout(mockSetLoggingOutFlag);
        }).not.toThrow();

        expect(consoleSpy).toHaveBeenCalledWith('Failed to dispatch nlLogout event:', expect.any(Error));
        expect(mockSetLoggingOutFlag).toHaveBeenCalledWith(true);

        consoleSpy.mockRestore();
    });

    it('ダークモードイベント発行エラーを適切に処理する', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        mockDocument.dispatchEvent.mockImplementation(() => {
            throw new Error('dispatchEvent failed');
        });

        // エラーが発生してもクラッシュしないことを確認
        expect(() => {
            eventEmitter.setDarkMode(true);
        }).not.toThrow();

        expect(consoleSpy).toHaveBeenCalledWith('Failed to dispatch nlDarkMode event:', expect.any(Error));

        consoleSpy.mockRestore();
    });
});

// --- NostrLoginManager 統合テスト ---
describe('NostrLoginManager統合テスト', () => {
    let manager: NostrLoginManager;
    let mockDependencies: NostrLoginDependencies;

    beforeEach(() => {
        mockDependencies = createMockDependencies();
        manager = new NostrLoginManager(mockDependencies);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('初期化が正常に動作する', async () => {
        const options: NostrLoginOptions = { theme: 'ocean' };

        await manager.init(options);

        expect(manager.isInitialized).toBe(true);
        expect(mockDependencies.importNostrLogin).toHaveBeenCalled();
    });

    it('重複初期化を防ぐ', async () => {
        await manager.init({});
        await manager.init({}); // 2回目

        expect(mockDependencies.importNostrLogin).toHaveBeenCalledTimes(1);
    });

    it('初期化失敗時にエラーをスローする', async () => {
        mockDependencies.importNostrLogin = vi.fn().mockRejectedValue(new Error('Import failed'));
        manager = new NostrLoginManager(mockDependencies);

        // awaitでエラーをキャッチするため、未処理例外は発生しない
        await expect(manager.init({})).rejects.toThrow('Import failed');
        expect(manager.isInitialized).toBe(false);
    });

    it('authHandlerを設定できる', () => {
        const handler: NostrLoginEventHandler = vi.fn();

        manager.setAuthHandler(handler);

        // プライベートプロパティにアクセスするため、内部テスト用メソッドを使用
        const authCallbackHandler = manager.getAuthCallbackHandler();
        expect(authCallbackHandler).toBeDefined();
    });

    it('初期化前のshowLoginでエラーをスローする', async () => {
        await expect(manager.showLogin()).rejects.toThrow('nostr-login is not initialized');
    });

    it('初期化後のshowLoginが正常に動作する', async () => {
        await manager.init({});

        await expect(manager.showLogin('login')).resolves.toBeUndefined();
    });

    it('getCurrentUserが正しく動作する', async () => {
        const mockWindow = mockDependencies.window as any;
        mockWindow.nostrLogin = {
            pubkey: 'test-pubkey',
            npub: 'npub123'
        };

        // 初期化してから実行
        await manager.init({});

        const result = manager.getCurrentUser();

        expect(result).toEqual({
            pubkey: 'test-pubkey',
            npub: 'npub123'
        });
    });

    it('getCurrentUserでデータが存在しない場合はnullを返す', () => {
        const result = manager.getCurrentUser();

        expect(result).toBeNull();
    });

    it('初期化前のlogoutで警告を出力する', () => {
        manager.logout();

        expect(mockDependencies.console?.warn).toHaveBeenCalledWith(
            'nostr-loginが初期化されていません'
        );
    });

    it('初期化後のlogoutが正常に動作する', async () => {
        await manager.init({});

        manager.logout();

        expect(mockDependencies.document?.dispatchEvent).toHaveBeenCalledWith(
            expect.objectContaining({ type: 'nlLogout' })
        );
    });

    it('setDarkModeが正常に動作する', async () => {
        await manager.init({});

        manager.setDarkMode(true);

        expect(mockDependencies.document?.dispatchEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'nlDarkMode',
                detail: true
            })
        );
    });

    it('内部コンポーネントへのアクセスが可能', () => {
        expect(manager.getInitializer()).toBeDefined();
        expect(manager.getLauncher()).toBeDefined();
        expect(manager.getEventEmitter()).toBeDefined();
        expect(manager.getAuthCallbackHandler()).toBeDefined();
    });

    it('同じ初期化プロミスを再利用する', async () => {
        const promise1 = manager.init({});
        const promise2 = manager.init({});

        // 初期化中は同じプロミスを返す
        expect(promise1).toBe(promise2);
        await promise1;
        expect(manager.isInitialized).toBe(true);

        // 初期化完了後は解決済みプロミスを返すが、同じインスタンスである必要はない
        const promise3 = manager.init({});
        const promise4 = manager.init({});

        // すべてのプロミスが正常に完了することを確認
        await expect(promise3).resolves.toBeUndefined();
        await expect(promise4).resolves.toBeUndefined();

        // 初期化完了後の呼び出しでも同じ結果が得られることを確認
        expect(promise3).toBe(promise4); // 初期化済み状態では同じプロミスを返すことを確認
    });
});

// --- エラーハンドリングテスト ---
describe('NostrLoginManager エラーハンドリング', () => {
    it('importエラーを適切に処理する', async () => {
        const mockDeps = createMockDependencies();
        mockDeps.importNostrLogin = vi.fn().mockRejectedValue(new Error('Network error'));

        const manager = new NostrLoginManager(mockDeps);

        // awaitでエラーをキャッチするため、未処理例外は発生しない
        await expect(manager.init({})).rejects.toThrow('Network error');
        expect(manager.isInitialized).toBe(false);
    });

    it('launchエラーを適切に処理する', async () => {
        const mockDeps = createMockDependencies();
        const mockLaunch = vi.fn().mockRejectedValue(new Error('Launch error'));
        mockDeps.importNostrLogin = vi.fn().mockResolvedValue({
            init: vi.fn(),
            launch: mockLaunch
        });

        const manager = new NostrLoginManager(mockDeps);
        await manager.init({});

        await expect(manager.showLogin()).rejects.toThrow('Launch error');
    });
});
