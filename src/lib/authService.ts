import { nip19 } from 'nostr-tools';
import { KeyManager, PublicKeyState } from './keyManager.svelte';
import { setAuthInitialized, setNsecAuth, setNip07Auth, setNip46Auth, clearAuthState, secretKeyStore } from '../stores/appStore.svelte';
import type { AuthResult, AuthServiceDependencies } from './types';
import { Nip07AuthService } from './nip07AuthService';
import { nip46Service, Nip46Service } from './nip46Service';

const NIP07_STORAGE_KEY = 'nostr-nip07-pubkey';

// --- 純粋関数: バリデーション ---
export class AuthValidator {
    static isValidSecretKey(secretKey: string, keyManager: any): boolean {
        return keyManager.isValidNsec(secretKey);
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

// --- NIP-07認証処理の分離 ---
export class Nip07Authenticator {
    private nip07Service: Nip07AuthService;

    constructor(
        private setNip07Auth: (pubkey: string, npub: string, nprofile: string) => void,
        private console: Console,
        windowObj?: Window,
    ) {
        this.nip07Service = new Nip07AuthService(windowObj, console);
    }

    /**
     * NIP-07拡張機能が利用可能かチェック
     */
    isAvailable(): boolean {
        return this.nip07Service.isAvailable();
    }

    /**
     * NIP-07拡張機能が利用可能になるまで待機してから認証
     */
    async authenticate(waitMs: number = 3000): Promise<AuthResult> {
        const available = await this.nip07Service.waitForExtension(waitMs);
        if (!available) {
            return { success: false, error: 'nip07_not_available' };
        }

        const result = await this.nip07Service.authenticate();
        if (!result.success || !result.pubkeyHex || !result.pubkeyData) {
            return { success: false, error: result.error || 'nip07_auth_error' };
        }

        this.setNip07Auth(result.pubkeyData.hex, result.pubkeyData.npub, result.pubkeyData.nprofile);
        return { success: true, pubkeyHex: result.pubkeyHex };
    }

    getNip07Service(): Nip07AuthService {
        return this.nip07Service;
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

// --- 初期化処理の分離 ---
export class AuthInitializer {
    constructor(
        private keyManager: any,
        private publicKeyState: PublicKeyState,
        private setNsecAuth: (pubkey: string, npub: string, nprofile: string) => void,
        private console: Console,
        private nip07Opts?: {
            localStorage: Storage;
            setNip07Auth: (pubkey: string, npub: string, nprofile: string) => void;
            nip07Service: Nip07AuthService;
        },
        private nip46Opts?: {
            localStorage: Storage;
            setNip46Auth: (pubkey: string, npub: string, nprofile: string) => void;
            nip46Service: Nip46Service;
        }
    ) { }

    async initialize(): Promise<{ hasAuth: boolean; pubkeyHex?: string }> {
        try {
            // nsecストレージキーを優先的にチェック
            const nsecResult = await this.checkNsecAuth();
            if (nsecResult.hasAuth) return nsecResult;

            // NIP-07セッションの復元（前回NIP-07でログインしていた場合）
            if (this.nip07Opts) {
                const nip07Result = await this.checkNip07Auth();
                if (nip07Result.hasAuth) return nip07Result;
            }

            // NIP-46セッションの復元（前回NIP-46でログインしていた場合）
            if (this.nip46Opts) {
                const nip46Result = await this.checkNip46Auth();
                if (nip46Result.hasAuth) return nip46Result;
            }

        } catch (error) {
            this.console.error('認証初期化失敗:', error);
        }

        return { hasAuth: false };
    }

    private async checkNsecAuth(): Promise<{ hasAuth: boolean; pubkeyHex?: string }> {
        const storedKey = this.keyManager.loadFromStorage();
        if (!storedKey) return { hasAuth: false };

        this.publicKeyState.setNsec(storedKey);

        try {
            const derived = this.keyManager.derivePublicKey(storedKey);
            if (derived.hex) {
                this.setNsecAuth(derived.hex, derived.npub, derived.nprofile);
                return {
                    hasAuth: true,
                    pubkeyHex: derived.hex
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

    private async checkNip07Auth(): Promise<{ hasAuth: boolean; pubkeyHex?: string }> {
        const { localStorage, setNip07Auth, nip07Service } = this.nip07Opts!;

        const storedPubkey = localStorage.getItem(NIP07_STORAGE_KEY);
        if (!storedPubkey) return { hasAuth: false };

        // 拡張機能が引き続き利用可能か確認（最大1秒待機）
        const available = await nip07Service.waitForExtension(1000);
        if (!available) {
            // 拡張機能が無効化されたのでセッションマーカーをクリア
            localStorage.removeItem(NIP07_STORAGE_KEY);
            return { hasAuth: false };
        }

        try {
            const npub = nip19.npubEncode(storedPubkey);
            const nprofile = nip19.nprofileEncode({ pubkey: storedPubkey, relays: [] });
            setNip07Auth(storedPubkey, npub, nprofile);
            return { hasAuth: true, pubkeyHex: storedPubkey };
        } catch (error) {
            this.console.error('NIP-07セッション復元エラー:', error);
            localStorage.removeItem(NIP07_STORAGE_KEY);
            return { hasAuth: false };
        }
    }

    private async checkNip46Auth(): Promise<{ hasAuth: boolean; pubkeyHex?: string }> {
        const { localStorage, setNip46Auth, nip46Service: svc } = this.nip46Opts!;

        const session = Nip46Service.loadSession(localStorage);
        if (!session) return { hasAuth: false };

        try {
            await svc.reconnect(session);
            const pubkey = session.userPubkey;
            const npub = nip19.npubEncode(pubkey);
            const nprofile = nip19.nprofileEncode({ pubkey, relays: [] });
            setNip46Auth(pubkey, npub, nprofile);
            return { hasAuth: true, pubkeyHex: pubkey };
        } catch (error) {
            this.console.error('NIP-46セッション復元エラー:', error);
            Nip46Service.clearSession(localStorage);
            return { hasAuth: false };
        }
    }
}

// --- メインのAuthServiceクラス ---
export class AuthService {
    private publicKeyState: PublicKeyState;
    private nsecAuthenticator: NsecAuthenticator;
    private nip07Authenticator: Nip07Authenticator;
    private profileCacheCleaner: ProfileCacheCleaner;
    private authInitializer: AuthInitializer;
    private keyManager: any;
    private localStorage: Storage;
    private console: Console;
    private nip46Svc: Nip46Service;
    private setNip46AuthFn: (pubkey: string, npub: string, nprofile: string) => void;

    constructor(dependencies: AuthServiceDependencies = {}) {
        // デフォルト依存関係の設定
        const localStorage = dependencies.localStorage || (typeof window !== 'undefined' ? window.localStorage : {} as Storage);
        const keyMgr = dependencies.keyManager || new KeyManager({
            secretKeyStore: dependencies.secretKeyStore || secretKeyStore,
            clearAuthStateFn: dependencies.clearAuthState || clearAuthState,
            localStorage
        });
        const windowObj = dependencies.window || (typeof window !== 'undefined' ? window : {} as Window);
        const navigator = dependencies.navigator || (typeof window !== 'undefined' ? window.navigator : {} as Navigator);
        const console = dependencies.console || (typeof window !== 'undefined' ? window.console : {} as Console);
        const setNsecAuthFn = dependencies.setNsecAuth || setNsecAuth;
        const setNip07AuthFn = dependencies.setNip07Auth || setNip07Auth;
        const setNip46AuthFn = dependencies.setNip46Auth || setNip46Auth;

        // 内部コンポーネントの初期化
        this.localStorage = localStorage;
        this.console = console;
        this.nip46Svc = nip46Service;
        this.setNip46AuthFn = setNip46AuthFn;
        this.publicKeyState = new PublicKeyState({
            clearAuthStateFn: dependencies.clearAuthState || clearAuthState,
        });
        this.nsecAuthenticator = new NsecAuthenticator(keyMgr, setNsecAuthFn, console);
        this.nip07Authenticator = new Nip07Authenticator(setNip07AuthFn, console, windowObj);
        this.profileCacheCleaner = new ProfileCacheCleaner(navigator, console);

        this.authInitializer = new AuthInitializer(
            keyMgr,
            this.publicKeyState,
            setNsecAuthFn,
            console,
            {
                localStorage,
                setNip07Auth: setNip07AuthFn,
                nip07Service: this.nip07Authenticator.getNip07Service(),
            },
            {
                localStorage,
                setNip46Auth: setNip46AuthFn,
                nip46Service: this.nip46Svc,
            }
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
     * NIP-07拡張機能を使った認証処理
     */
    async authenticateWithNip07(): Promise<AuthResult> {
        const result = await this.nip07Authenticator.authenticate();
        if (result.success && result.pubkeyHex) {
            try {
                this.localStorage.setItem(NIP07_STORAGE_KEY, result.pubkeyHex);
            } catch (e) {
                this.console.error('NIP-07セッション保存エラー:', e);
            }
        }
        return result;
    }

    /**
     * NIP-46リモートサイナーを使った認証処理
     */
    async authenticateWithNip46(bunkerUrl: string): Promise<AuthResult> {
        try {
            const pubkeyHex = await this.nip46Svc.connect(bunkerUrl);
            const npub = nip19.npubEncode(pubkeyHex);
            const nprofile = nip19.nprofileEncode({ pubkey: pubkeyHex, relays: [] });
            this.setNip46AuthFn(pubkeyHex, npub, nprofile);
            this.nip46Svc.saveSession(this.localStorage);
            return { success: true, pubkeyHex };
        } catch (error) {
            this.console.error('NIP-46認証エラー:', error);
            const msg = error instanceof Error ? error.message : 'nip46_connection_failed';
            return { success: false, error: msg };
        }
    }

    /**
     * ログアウト処理
     */
    logout(): void {
        try {
            // NIP-46切断
            this.nip46Svc.disconnect().catch(e => {
                this.console.error('NIP-46切断エラー:', e);
            });

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
    async initializeAuth(): Promise<{ hasAuth: boolean; pubkeyHex?: string }> {
        return await this.authInitializer.initialize();
    }

    /**
     * PublicKeyStateインスタンスを取得
     */
    getPublicKeyState(): PublicKeyState {
        return this.publicKeyState;
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

    getNip07Authenticator(): Nip07Authenticator {
        return this.nip07Authenticator;
    }

    getProfileCacheCleaner(): ProfileCacheCleaner {
        return this.profileCacheCleaner;
    }

    getAuthInitializer(): AuthInitializer {
        return this.authInitializer;
    }
}

export const authService = new AuthService();
