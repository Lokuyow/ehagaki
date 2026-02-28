import { KeyManager, PublicKeyState } from './keyManager.svelte';
import type { NostrLoginAuth, NostrLoginOptions } from './types';
import { nostrLoginManager } from './nostrLogin';
import { setAuthInitialized, setNsecAuth, setNostrLoginAuth, clearAuthState, secretKeyStore } from '../stores/appStore.svelte';
import type { AuthResult, AuthServiceDependencies, NostrLoginManagerInterface, LocalStorageData } from './types';

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
        private window: Window
    ) { }

    async waitForExternalAuth(timeoutMs: number = 5000): Promise<boolean> {
        const startTime = Date.now();
        const pollInterval = 100;

        return new Promise((resolve) => {
            const checkAuth = () => {
                if (this.isWindowNostrAvailable()) {
                    resolve(true);
                    return;
                }

                if (Date.now() - startTime >= timeoutMs) {
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
        private localStorage: Storage
    ) { }

    getStoredNostrLoginData(): LocalStorageData | null {
        try {
            const nip46Raw = this.localStorage.getItem('__nostrlogin_nip46');
            if (!nip46Raw) return null;

            const nip46 = JSON.parse(nip46Raw);

            return nip46?.pubkey ? {
                pubkey: nip46.pubkey,
                npub: nip46.npub
            } : null;
        } catch (error) {
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
        private console: Console
    ) { }

    async initialize(nostrLoginOptions: NostrLoginOptions): Promise<{ hasAuth: boolean; pubkeyHex?: string; isNostrLogin?: boolean }> {
        try {
            // まずnsecストレージキーを優先的にチェック
            const nsecResult = await this.checkNsecAuth();
            if (nsecResult.hasAuth) return nsecResult;

            // 外部認証の確認
            await this.externalAuthWaiter.waitForExternalAuth(100);

            // nostr-loginの初期化とチェック
            const nostrLoginResult = await this.checkNostrLoginAuth(nostrLoginOptions);
            if (nostrLoginResult.hasAuth) return nostrLoginResult;

        } catch (error) {
            this.console.error('nostr-login初期化失敗:', error);
        }

        return { hasAuth: false };
    }

    private async checkNsecAuth(): Promise<{ hasAuth: boolean; pubkeyHex?: string; isNostrLogin?: boolean }> {
        const storedKey = this.keyManager.loadFromStorage();
        if (!storedKey) return { hasAuth: false };

        this.publicKeyState.setNsec(storedKey);

        try {
            const derived = this.keyManager.derivePublicKey(storedKey);
            if (derived.hex) {
                this.setNsecAuth(derived.hex, derived.npub, derived.nprofile);
                return {
                    hasAuth: true,
                    pubkeyHex: derived.hex,
                    isNostrLogin: false
                };
            } else {
                this.keyManager.saveToStorage(''); // 無効なキーを削除
                return { hasAuth: false };
            }
        } catch (error) {
            this.keyManager.saveToStorage(''); // エラーの場合も削除
            return { hasAuth: false };
        }
    }

    private async checkNostrLoginAuth(nostrLoginOptions: NostrLoginOptions): Promise<{ hasAuth: boolean; pubkeyHex?: string; isNostrLogin?: boolean }> {
        // nostr-loginの初期化（UIは起動しない）
        await this.nostrLoginManager.init(nostrLoginOptions);

        // 初期化完了後に少し待ってからユーザー取得を試行
        await new Promise(resolve => setTimeout(resolve, 100));

        // 1. まずwindow.nostrLoginから即時取得
        const currentUser = this.nostrLoginManager.getCurrentUser();
        if (currentUser?.pubkey) {
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
    private nostrLoginMgr: NostrLoginManagerInterface;
    private keyManager: any;

    // 設定プロパティ
    nostrLoginOptions: NostrLoginOptions = {
        theme: 'default',
        noBanner: true,
        methods: 'connect, extension, local',
    };

    constructor(dependencies: AuthServiceDependencies = {}) {
        // デフォルト依存関係の設定
        const localStorage = dependencies.localStorage || (typeof window !== 'undefined' ? window.localStorage : {} as Storage);
        const keyMgr = dependencies.keyManager || new KeyManager({
            secretKeyStore: dependencies.secretKeyStore || secretKeyStore,
            setNostrLoginAuthFn: dependencies.setNostrLoginAuth || setNostrLoginAuth,
            clearAuthStateFn: dependencies.clearAuthState || clearAuthState,
            localStorage
        });
        const windowObj = dependencies.window || (typeof window !== 'undefined' ? window : {} as Window);
        const navigator = dependencies.navigator || (typeof window !== 'undefined' ? window.navigator : {} as Navigator);
        const console = dependencies.console || (typeof window !== 'undefined' ? window.console : {} as Console);
        const setNsecAuthFn = dependencies.setNsecAuth || setNsecAuth;

        // nostrLoginManagerは依存性から取得、なければデフォルト
        this.nostrLoginMgr = dependencies.nostrLoginManager || nostrLoginManager;

        // 内部コンポーネントの初期化
        this.publicKeyState = new PublicKeyState({
            setNostrLoginAuthFn: dependencies.setNostrLoginAuth || setNostrLoginAuth,
            clearAuthStateFn: dependencies.clearAuthState || clearAuthState,
            localStorage
        });
        this.nsecAuthenticator = new NsecAuthenticator(keyMgr, setNsecAuthFn, console);
        this.nostrLoginAuthenticator = new NostrLoginAuthenticator(this.publicKeyState, console);
        this.profileCacheCleaner = new ProfileCacheCleaner(navigator, console);

        const externalAuthWaiter = new ExternalAuthWaiter(windowObj);
        const storageManager = new NostrLoginStorageManager(localStorage);

        this.authInitializer = new AuthInitializer(
            keyMgr,
            this.publicKeyState,
            this.nostrLoginMgr,
            externalAuthWaiter,
            storageManager,
            setNsecAuthFn,
            console
        );

        this.keyManager = keyMgr;
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
        try {
            // nostr-login認証の場合のみ、nostr-loginのログアウトを実行
            if (this.publicKeyState.currentIsNostrLogin && this.nostrLoginMgr.isInitialized) {
                try {
                    this.nostrLoginMgr.logout();
                } catch (error) {
                    console.error('nostr-loginログアウト中にエラー:', error);
                }
            }

            // ストレージをクリア（firstVisitフラグは残す）
            try {
                const firstVisit = localStorage.getItem("firstVisit");
                localStorage.clear();
                if (firstVisit) {
                    localStorage.setItem("firstVisit", firstVisit);
                }
            } catch (error) {
                console.error('ローカルストレージクリア中にエラー:', error);
            }

            // プロフィール画像キャッシュをクリア
            this.profileCacheCleaner.clearProfileImageCache().catch(error => {
                console.error('プロフィール画像キャッシュクリア中にエラー:', error);
            });

            // ページをリロード（遅延させて確実に反映）
            setTimeout(() => {
                try {
                    // Check if location.replace is available and is a function
                    if (typeof window !== 'undefined' &&
                        window.location &&
                        typeof window.location.replace === 'function') {
                        window.location.replace(window.location.pathname);
                    } else if (typeof window !== 'undefined' && window.location) {
                        // Fallback to href assignment
                        window.location.href = window.location.pathname;
                    }
                } catch (error) {
                    console.error('ページリロード中にエラー:', error);
                    // Additional fallback - do nothing in test environments
                }
            }, 500);
        } catch (error) {
            console.error('ログアウト処理中に予期しないエラー:', error);
            // エラーが発生してもページリロードは実行
            setTimeout(() => {
                try {
                    if (typeof window !== 'undefined' && window.location) {
                        window.location.href = window.location.pathname;
                    }
                } catch (reloadError) {
                    console.error('ページリロード中にエラー:', reloadError);
                }
            }, 2000);
        }
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
        this.nostrLoginMgr.setAuthHandler(handler);
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
