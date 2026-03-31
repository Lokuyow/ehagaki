import { nip19 } from 'nostr-tools';
import { KeyManager, PublicKeyState } from './keyManager.svelte';
import { setAuthInitialized, setNsecAuth, setNip07Auth, setNip46Auth, clearAuthState, secretKeyStore } from '../stores/appStore.svelte';
import type { AuthResult, AuthServiceDependencies } from './types';
import { Nip07AuthService } from './nip07AuthService';
import { nip46Service, Nip46Service } from './nip46Service';

const NIP07_STORAGE_KEY = 'nostr-nip07-pubkey';

// --- メインのAuthServiceクラス ---
export class AuthService {
    private publicKeyState: PublicKeyState;
    private nip07Service: Nip07AuthService;
    private keyManager: any;
    private localStorage: Storage;
    private navigator: Navigator;
    private console: Console;
    private nip46Svc: Nip46Service;
    private setNsecAuthFn: (pubkey: string, npub: string, nprofile: string) => void;
    private setNip07AuthFn: (pubkey: string, npub: string, nprofile: string) => void;
    private setNip46AuthFn: (pubkey: string, npub: string, nprofile: string) => void;

    constructor(dependencies: AuthServiceDependencies = {}) {
        const localStorage = dependencies.localStorage || (typeof window !== 'undefined' ? window.localStorage : {} as Storage);
        const keyMgr = dependencies.keyManager || new KeyManager({
            secretKeyStore: dependencies.secretKeyStore || secretKeyStore,
            clearAuthStateFn: dependencies.clearAuthState || clearAuthState,
            localStorage
        });
        const windowObj = dependencies.window || (typeof window !== 'undefined' ? window : {} as Window);
        const navigator = dependencies.navigator || (typeof window !== 'undefined' ? window.navigator : {} as Navigator);
        const consoleObj = dependencies.console || (typeof window !== 'undefined' ? window.console : {} as Console);

        this.localStorage = localStorage;
        this.navigator = navigator;
        this.console = consoleObj;
        this.keyManager = keyMgr;
        this.nip46Svc = nip46Service;
        this.setNsecAuthFn = dependencies.setNsecAuth || setNsecAuth;
        this.setNip07AuthFn = dependencies.setNip07Auth || setNip07Auth;
        this.setNip46AuthFn = dependencies.setNip46Auth || setNip46Auth;
        this.publicKeyState = new PublicKeyState({
            clearAuthStateFn: dependencies.clearAuthState || clearAuthState,
        });
        this.nip07Service = new Nip07AuthService(windowObj, consoleObj);
    }

    // --- nsec認証 ---

    async authenticateWithNsec(secretKey: string): Promise<AuthResult> {
        if (!this.keyManager.isValidNsec(secretKey)) {
            return { success: false, error: 'invalid_secret' };
        }

        const { success } = this.keyManager.saveToStorage(secretKey);
        if (!success) {
            return { success: false, error: 'error_saving' };
        }

        try {
            const derived = this.keyManager.derivePublicKey(secretKey);
            if (derived.hex) {
                this.setNsecAuthFn(derived.hex, derived.npub, derived.nprofile);
                return { success: true, pubkeyHex: derived.hex };
            } else {
                return { success: false, error: 'derivation_failed' };
            }
        } catch (error) {
            this.console.error('nsec認証処理中にエラー:', error);
            return { success: false, error: 'authentication_error' };
        }
    }

    // --- NIP-07認証 ---

    isNip07Available(): boolean {
        return this.nip07Service.isAvailable();
    }

    async authenticateWithNip07(): Promise<AuthResult> {
        const available = await this.nip07Service.waitForExtension(3000);
        if (!available) {
            return { success: false, error: 'nip07_not_available' };
        }

        const result = await this.nip07Service.authenticate();
        if (!result.success || !result.pubkeyHex || !result.pubkeyData) {
            return { success: false, error: result.error || 'nip07_auth_error' };
        }

        this.setNip07AuthFn(result.pubkeyData.hex, result.pubkeyData.npub, result.pubkeyData.nprofile);

        try {
            this.localStorage.setItem(NIP07_STORAGE_KEY, result.pubkeyHex);
        } catch (e) {
            this.console.error('NIP-07セッション保存エラー:', e);
        }
        return { success: true, pubkeyHex: result.pubkeyHex };
    }

    // --- NIP-46認証 ---

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

    // --- ログアウト ---

    logout(onReload?: () => void): void {
        try {
            this.nip46Svc.disconnect().catch(e => {
                this.console.error('NIP-46切断エラー:', e);
            });

            try {
                const firstVisit = this.localStorage.getItem("firstVisit");
                this.localStorage.clear();
                if (firstVisit) {
                    this.localStorage.setItem("firstVisit", firstVisit);
                }
            } catch (error) {
                this.console.error('ローカルストレージクリア中にエラー:', error);
            }

            this.clearProfileImageCache();

            if (onReload) {
                onReload();
            } else {
                setTimeout(() => {
                    try {
                        if (typeof window !== 'undefined' &&
                            window.location &&
                            typeof window.location.replace === 'function') {
                            window.location.replace(window.location.pathname);
                        } else if (typeof window !== 'undefined' && window.location) {
                            window.location.href = window.location.pathname;
                        }
                    } catch (error) {
                        this.console.error('ページリロード中にエラー:', error);
                    }
                }, 500);
            }
        } catch (error) {
            this.console.error('ログアウト処理中に予期しないエラー:', error);
            setTimeout(() => {
                try {
                    if (typeof window !== 'undefined' && window.location) {
                        window.location.href = window.location.pathname;
                    }
                } catch (reloadError) {
                    this.console.error('ページリロード中にエラー:', reloadError);
                }
            }, 2000);
        }
    }

    // --- 初期化 ---

    async initializeAuth(): Promise<{ hasAuth: boolean; pubkeyHex?: string }> {
        try {
            // nsecストレージキーを優先的にチェック
            const nsecResult = await this.checkNsecAuth();
            if (nsecResult.hasAuth) return nsecResult;

            // NIP-07セッションの復元
            const nip07Result = await this.checkNip07Auth();
            if (nip07Result.hasAuth) return nip07Result;

            // NIP-46セッションの復元
            const nip46Result = await this.checkNip46Auth();
            if (nip46Result.hasAuth) return nip46Result;
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
                this.setNsecAuthFn(derived.hex, derived.npub, derived.nprofile);
                return { hasAuth: true, pubkeyHex: derived.hex };
            } else {
                this.keyManager.saveToStorage('');
                return { hasAuth: false };
            }
        } catch (error) {
            this.keyManager.saveToStorage('');
            return { hasAuth: false };
        }
    }

    private async checkNip07Auth(): Promise<{ hasAuth: boolean; pubkeyHex?: string }> {
        const storedPubkey = this.localStorage.getItem(NIP07_STORAGE_KEY);
        if (!storedPubkey) return { hasAuth: false };

        const available = await this.nip07Service.waitForExtension(1000);
        if (!available) {
            this.localStorage.removeItem(NIP07_STORAGE_KEY);
            return { hasAuth: false };
        }

        try {
            const npub = nip19.npubEncode(storedPubkey);
            const nprofile = nip19.nprofileEncode({ pubkey: storedPubkey, relays: [] });
            this.setNip07AuthFn(storedPubkey, npub, nprofile);
            return { hasAuth: true, pubkeyHex: storedPubkey };
        } catch (error) {
            this.console.error('NIP-07セッション復元エラー:', error);
            this.localStorage.removeItem(NIP07_STORAGE_KEY);
            return { hasAuth: false };
        }
    }

    private async checkNip46Auth(): Promise<{ hasAuth: boolean; pubkeyHex?: string }> {
        const session = Nip46Service.loadSession(this.localStorage);
        if (!session) return { hasAuth: false };

        try {
            await this.nip46Svc.reconnect(session);
            const pubkey = session.userPubkey;
            const npub = nip19.npubEncode(pubkey);
            const nprofile = nip19.nprofileEncode({ pubkey, relays: [] });
            this.setNip46AuthFn(pubkey, npub, nprofile);
            return { hasAuth: true, pubkeyHex: pubkey };
        } catch (error) {
            this.console.error('NIP-46セッション復元エラー:', error);
            Nip46Service.clearSession(this.localStorage);
            return { hasAuth: false };
        }
    }

    // --- プロフィール画像キャッシュクリア ---

    private clearProfileImageCache(): void {
        try {
            if (!('serviceWorker' in this.navigator) || !this.navigator.serviceWorker.controller) return;

            const messageChannel = new MessageChannel();
            messageChannel.port1.onmessage = (event) => {
                if (event.data.success) {
                    this.console.log('プロフィール画像キャッシュをクリアしました');
                } else {
                    this.console.error('プロフィール画像キャッシュクリア失敗:', event.data.error);
                }
            };

            this.navigator.serviceWorker.controller.postMessage(
                { action: 'clearProfileCache' },
                [messageChannel.port2]
            );
        } catch (error) {
            this.console.error('プロフィール画像キャッシュクリア中にエラー:', error);
        }
    }

    // --- ユーティリティ ---

    getPublicKeyState(): PublicKeyState {
        return this.publicKeyState;
    }

    markAuthInitialized(): void {
        setAuthInitialized();
    }
}

export const authService = new AuthService();
