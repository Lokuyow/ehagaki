import { keyManager, PublicKeyState, type NostrLoginAuth } from './keyManager';
import { nostrLoginManager, type NostrLoginOptions } from './nostrLogin';
import { setAuthInitialized, setNsecAuth } from '../stores/appStore.svelte';
import { debugLog } from './debug';
import type { AuthResult } from './types';

// --- 依存関係注入用のインターフェース ---
export interface AuthServiceDependencies {
    keyManager?: typeof keyManager;
    localStorage?: Storage;
    window?: Window;
    navigator?: Navigator;
    console?: Console;
    debugLog?: typeof debugLog;
    setNsecAuth?: typeof setNsecAuth;
    setAuthInitialized?: typeof setAuthInitialized;
    nostrLoginManager?: typeof nostrLoginManager;
    setTimeout?: (callback: () => void, delay: number) => void;
}

export interface NostrLoginManagerInterface {
    isInitialized: boolean;
    init(options: NostrLoginOptions): Promise<void>;
    showLogin(): Promise<void>;
    logout(): void;
    getCurrentUser(): { pubkey?: string; npub?: string } | null;
    setAuthHandler(handler: (auth: NostrLoginAuth) => void): void;
}

export interface LocalStorageData {
    pubkey?: string;
    npub?: string;
}

// --- 純粋関数: バリデーション ---
export class AuthValidator {
    static isValidSecretKey(secretKey: string, keyManager: any): boolean {
        return keyManager.isValidNsec(secretKey);
    }

    static hasRequiredPubkey(auth: NostrLoginAuth): boolean {
        return auth.type !== 'logout' && !!auth.pubkey;
    }

    static isLogoutAuth(auth: NostrLoginAuth): boolean {
        return auth.type === 'logout';
    }
}

// --- 秘密鍵認証処理の分離 ---
export class NsecAuthenticator {
    constructor(
        private keyManager: any,
        private setNsecAuth: (pubkey: string, npub: string, nprofile: string) => void,
        private console: Console
    ) { }

    async authenticate(secretKey: string): Promise<AuthResult> {
        if (!AuthValidator.isValidSecretKey(secretKey, this.keyManager)) {
            return { success: false, error: 'invalid_secret' };
        }

        const { success } = this.keyManager.saveToStorage(secretKey);
        if (!success) {
            return { success: false, error: 'error_saving' };
        }

        try {
            const derived = this.keyManager.derivePublicKey(secretKey);
            if (derived.hex) {
                this.setNsecAuth(derived.hex, derived.npub, derived.nprofile);
                return { success: true, pubkeyHex: derived.hex };
            } else {
                return { success: false, error: 'derivation_failed' };
            }
        } catch (error) {
            this.console.error('nsec認証処理中にエラー:', error);
            return { success: false, error: 'authentication_error' };
        }
    }
}

// --- nostr-login認証処理の分離 ---
export class NostrLoginAuthenticator {
    constructor(
        private publicKeyState: PublicKeyState,
        private console: Console
    ) { }

    async authenticate(auth: NostrLoginAuth): Promise<AuthResult> {
        if (AuthValidator.isLogoutAuth(auth)) {
            return { success: true };
        }

        if (!AuthValidator.hasRequiredPubkey(auth)) {
            this.console.warn('NostrLoginAuth: pubkey is required for login/signup');
            return { success: false, error: 'missing_pubkey' };
        }

        try {
            this.publicKeyState.setNostrLoginAuth(auth);
            return { success: true, pubkeyHex: auth.pubkey };
        } catch (error) {
            this.console.error('nostr-login認証処理中にエラー:', error);
            return { success: false, error: 'nostr_login_error' };
        }
    }
}

// --- 外部認証チェッカー ---
export class ExternalAuthWaiter {
    constructor(
        private window: Window,
        private debugLog: (...args: any[]) => void
    ) { }

    async waitForExternalAuth(timeoutMs: number = 5000): Promise<boolean> {
        const startTime = Date.now();
        const pollInterval = 100;

        return new Promise((resolve) => {
            const checkAuth = () => {
                if (this.isWindowNostrAvailable()) {
                    this.debugLog('[waitForExternalAuth] window.nostr利用可能');
                    resolve(true);
                    return;
                }

                if (Date.now() - startTime >= timeoutMs) {
                    this.debugLog('[waitForExternalAuth] タイムアウト');
                    resolve(false);
                    return;
                }

                setTimeout(checkAuth, pollInterval);
            };

            checkAuth();
        });
    }

    private isWindowNostrAvailable(): boolean {
        return typeof this.window !== 'undefined' &&
            typeof (this.window as any).nostr === 'object' &&
            (this.window as any).nostr !== null &&
            typeof (this.window as any).nostr.getPublicKey === 'function';
    }
}

// --- プロフィールキャッシュクリア処理 ---
export class ProfileCacheCleaner {
    constructor(
        private navigator: Navigator,
        private console: Console
    ) { }

    async clearProfileImageCache(): Promise<void> {
        try {
            if (!this.hasServiceWorker()) return;

            const messageChannel = new MessageChannel();
            return new Promise((resolve, reject) => {
                messageChannel.port1.onmessage = (event) => {
                    if (event.data.success) {
                        this.console.log('プロフィール画像キャッシュをクリアしました');
                        resolve();
                    } else {
                        this.console.error('プロフィール画像キャッシュクリア失敗:', event.data.error);
                        reject(new Error(event.data.error));
                    }
                };

                if (this.navigator.serviceWorker.controller) {
                    this.navigator.serviceWorker.controller.postMessage(
                        { action: 'clearProfileCache' },
                        [messageChannel.port2]
                    );
                } else {
                    reject(new Error('Service worker controller is null.'));
                }
            });
        } catch (error) {
            this.console.error('プロフィール画像キャッシュクリア中にエラー:', error);
        }
    }

    private hasServiceWorker(): boolean {
        return 'serviceWorker' in this.navigator && !!this.navigator.serviceWorker.controller;
    }
}

// --- LocalStorage処理の分離 ---
export class NostrLoginStorageManager {
    constructor(
        private localStorage: Storage,
        private debugLog: (...args: any[]) => void
    ) { }

    getStoredNostrLoginData(): LocalStorageData | null {
        try {
            const nip46Raw = this.localStorage.getItem('__nostrlogin_nip46');
            if (!nip46Raw) return null;

            const nip46 = JSON.parse(nip46Raw);
            this.debugLog('[getStoredNostrLoginData] localStorageからnip46取得', { nip46 });

            return nip46?.pubkey ? {
                pubkey: nip46.pubkey,
                npub: nip46.npub
            } : null;
        } catch (error) {
            this.debugLog('[getStoredNostrLoginData] localStorage復元中に例外', error);
            return null;
        }
    }
}

// --- 初期化処理の分離 ---
export class AuthInitializer {
    constructor(
        private keyManager: any,
        private publicKeyState: PublicKeyState,
        private nostrLoginManager: NostrLoginManagerInterface,
        private externalAuthWaiter: ExternalAuthWaiter,
        private storageManager: NostrLoginStorageManager,
        private setNsecAuth: (pubkey: string, npub: string, nprofile: string) => void,
        private debugLog: (...args: any[]) => void,
        private console: Console
    ) { }

    async initialize(nostrLoginOptions: NostrLoginOptions): Promise<{ hasAuth: boolean; pubkeyHex?: string; isNostrLogin?: boolean }> {
        try {
            // まずnsecストレージキーを優先的にチェック
            const nsecResult = await this.checkNsecAuth();
            if (nsecResult.hasAuth) return nsecResult;

            // 外部認証の確認
            const hasExternalAuth = await this.externalAuthWaiter.waitForExternalAuth(100);
            if (hasExternalAuth) {
                this.debugLog('[initializeAuth] 外部認証オブジェクト検出済み');
            }

            // nostr-loginの初期化とチェック
            const nostrLoginResult = await this.checkNostrLoginAuth(nostrLoginOptions);
            if (nostrLoginResult.hasAuth) return nostrLoginResult;

        } catch (error) {
            this.console.error('nostr-login初期化失敗:', error);
        }

        this.debugLog('[initializeAuth] 認証情報なし');
        return { hasAuth: false };
    }

    private async checkNsecAuth(): Promise<{ hasAuth: boolean; pubkeyHex?: string; isNostrLogin?: boolean }> {
        const storedKey = this.keyManager.loadFromStorage();
        if (!storedKey) return { hasAuth: false };

        this.debugLog('[checkNsecAuth] nsecストレージキーを検出', { storedKey });
        this.publicKeyState.setNsec(storedKey);

        try {
            const derived = this.keyManager.derivePublicKey(storedKey);
            if (derived.hex) {
                this.debugLog('[checkNsecAuth] nsecからpubkey導出成功', { hex: derived.hex });
                this.setNsecAuth(derived.hex, derived.npub, derived.nprofile);
                return {
                    hasAuth: true,
                    pubkeyHex: derived.hex,
                    isNostrLogin: false
                };
            }
        } catch (error) {
            this.debugLog('[checkNsecAuth] ストレージキーの処理中にエラー', error);
            this.console.error('ストレージキーの処理中にエラー:', error);
        }

        return { hasAuth: false };
    }

    private async checkNostrLoginAuth(nostrLoginOptions: NostrLoginOptions): Promise<{ hasAuth: boolean; pubkeyHex?: string; isNostrLogin?: boolean }> {
        // nostr-loginの初期化（UIは起動しない）
        await this.nostrLoginManager.init(nostrLoginOptions);

        // 1. まずwindow.nostrLoginから即時取得
        const currentUser = this.nostrLoginManager.getCurrentUser();
        if (currentUser?.pubkey) {
            this.debugLog('[checkNostrLoginAuth] nostr-login認証成功', { pubkey: currentUser.pubkey });
            this.publicKeyState.setNostrLoginAuth({
                type: 'login',
                pubkey: currentUser.pubkey,
                npub: currentUser.npub
            });
            return {
                hasAuth: true,
                pubkeyHex: currentUser.pubkey,
                isNostrLogin: true
            };
        }

        // 2. localStorage復元
        const storedData = this.storageManager.getStoredNostrLoginData();
        if (storedData?.pubkey) {
            this.publicKeyState.setNostrLoginAuth({
                type: 'login',
                pubkey: storedData.pubkey,
                npub: storedData.npub
            });
            return {
                hasAuth: true,
                pubkeyHex: storedData.pubkey,
                isNostrLogin: true
            };
        }

        return { hasAuth: false };
    }
}

// --- メインのAuthServiceクラス ---
export class AuthService {
    private publicKeyState: PublicKeyState;
    private nsecAuthenticator: NsecAuthenticator;
    private nostrLoginAuthenticator: NostrLoginAuthenticator;
    private profileCacheCleaner: ProfileCacheCleaner;
    private authInitializer: AuthInitializer;

    // 設定プロパティ
    nostrLoginOptions: NostrLoginOptions = {
        theme: 'default',
        noBanner: true,
    };

    constructor(dependencies: AuthServiceDependencies = {}) {
        // デフォルト依存関係の設定
        const keyMgr = dependencies.keyManager || keyManager;
        const localStorage = dependencies.localStorage || (typeof window !== 'undefined' ? window.localStorage : {} as Storage);
        const windowObj = dependencies.window || (typeof window !== 'undefined' ? window : {} as Window);
        const navigator = dependencies.navigator || (typeof window !== 'undefined' ? window.navigator : {} as Navigator);
        const console = dependencies.console || (typeof window !== 'undefined' ? window.console : {} as Console);
        const debugLog = dependencies.debugLog || (typeof window !== 'undefined' ? window.console.log : () => { });
        const setNsecAuthFn = dependencies.setNsecAuth || setNsecAuth;
        const setAuthInitializedFn = dependencies.setAuthInitialized || setAuthInitialized;
        const nostrLoginMgr = dependencies.nostrLoginManager || nostrLoginManager;
        const setTimeoutFn = dependencies.setTimeout || setTimeout;

        // 内部コンポーネントの初期化
        this.publicKeyState = new PublicKeyState();
        this.nsecAuthenticator = new NsecAuthenticator(keyMgr, setNsecAuthFn, console);
        this.nostrLoginAuthenticator = new NostrLoginAuthenticator(this.publicKeyState, console);
        this.profileCacheCleaner = new ProfileCacheCleaner(navigator, console);

        const externalAuthWaiter = new ExternalAuthWaiter(windowObj, debugLog);
        const storageManager = new NostrLoginStorageManager(localStorage, debugLog);

        this.authInitializer = new AuthInitializer(
            keyMgr,
            this.publicKeyState,
            nostrLoginMgr,
            externalAuthWaiter,
            storageManager,
            setNsecAuthFn,
            debugLog,
            console
        );
    }

    /**
     * nsecを使った認証処理
     */
    async authenticateWithNsec(secretKey: string): Promise<AuthResult> {
        return await this.nsecAuthenticator.authenticate(secretKey);
    }

    /**
     * nostr-loginを使った認証処理
     */
    async authenticateWithNostrLogin(auth: NostrLoginAuth): Promise<AuthResult> {
        if (AuthValidator.isLogoutAuth(auth)) {
            this.logout();
            return { success: true };
        }
        return await this.nostrLoginAuthenticator.authenticate(auth);
    }

    /**
     * nostr-loginダイアログを表示
     */
    async showNostrLoginDialog(): Promise<void> {
        const nostrLoginMgr = nostrLoginManager; // 実際のインスタンスを使用
        if (!nostrLoginMgr.isInitialized) {
            throw new Error('nostr-login is not initialized');
        }

        try {
            await nostrLoginMgr.showLogin();
        } catch (error) {
            if (!(error instanceof Error && error.message === 'Cancelled')) {
                console.error('nostr-loginでエラー:', error);
                throw error;
            }
        }
    }

    /**
     * ログアウト処理
     */
    logout(): void {
        const debugLog = this.authInitializer['debugLog'] || console.log; // 依存関係から取得
        debugLog('ログアウト処理開始');

        // ストレージをクリア
        localStorage.clear();

        // nostr-loginからもログアウト
        const nostrLoginMgr = nostrLoginManager; // 実際のインスタンスを使用
        if (nostrLoginMgr.isInitialized) {
            nostrLoginMgr.logout();
        }

        // プロフィール画像キャッシュをクリア
        this.profileCacheCleaner.clearProfileImageCache().catch(error => {
            console.error('プロフィール画像キャッシュクリア中にエラー:', error);
        });

        debugLog('ログアウト処理完了');

        // ページをリロード（遅延させて確実に反映）
        setTimeout(() => {
            window.location.replace(window.location.pathname);
        }, 500);
    }

    /**
     * 初期化時の認証状態チェック
     */
    async initializeAuth(): Promise<{ hasAuth: boolean; pubkeyHex?: string; isNostrLogin?: boolean }> {
        return await this.authInitializer.initialize(this.nostrLoginOptions);
    }

    /**
     * PublicKeyStateインスタンスを取得
     */
    getPublicKeyState(): PublicKeyState {
        return this.publicKeyState;
    }

    /**
     * nostr-loginの認証ハンドラーを設定
     */
    setNostrLoginHandler(handler: (auth: NostrLoginAuth) => void): void {
        const nostrLoginMgr = nostrLoginManager; // 実際のインスタンスを使用
        nostrLoginMgr.setAuthHandler(handler);
    }

    /**
     * 認証初期化完了をマーク
     */
    markAuthInitialized(): void {
        setAuthInitialized();
    }

    // --- テスト用の内部コンポーネントへのアクセス ---
    getNsecAuthenticator(): NsecAuthenticator {
        return this.nsecAuthenticator;
    }

    getNostrLoginAuthenticator(): NostrLoginAuthenticator {
        return this.nostrLoginAuthenticator;
    }

    getProfileCacheCleaner(): ProfileCacheCleaner {
        return this.profileCacheCleaner;
    }

    getAuthInitializer(): AuthInitializer {
        return this.authInitializer;
    }
}

export const authService = new AuthService();
