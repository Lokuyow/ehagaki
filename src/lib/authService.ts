import { nip19 } from 'nostr-tools';
import { KeyManager, PublicKeyState } from './keyManager.svelte';
import { setAuthInitialized, setNsecAuth, setNip07Auth, setNip46Auth, clearAuthState, secretKeyStore } from '../stores/appStore.svelte';
import type { AuthResult, AuthServiceDependencies } from './types';
import { Nip07AuthService } from './nip07AuthService';
import { nip46Service, Nip46Service } from './nip46Service';
import type { AccountManager } from './accountManager';

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
    private accountManager: AccountManager | null = null;
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

    // --- AccountManager設定 ---

    setAccountManager(accountManager: AccountManager): void {
        this.accountManager = accountManager;
    }

    // --- nsec認証 ---

    async authenticateWithNsec(secretKey: string): Promise<AuthResult> {
        if (!this.keyManager.isValidNsec(secretKey)) {
            return { success: false, error: 'invalid_secret' };
        }

        try {
            const derived = this.keyManager.derivePublicKey(secretKey);
            if (!derived.hex) {
                return { success: false, error: 'derivation_failed' };
            }

            // per-accountストレージに保存
            const { success } = this.keyManager.saveToStorage(secretKey, derived.hex);
            if (!success) {
                return { success: false, error: 'error_saving' };
            }

            this.setNsecAuthFn(derived.hex, derived.npub, derived.nprofile);
            this.accountManager?.addAccount(derived.hex, 'nsec');
            return { success: true, pubkeyHex: derived.hex };
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
        this.accountManager?.addAccount(result.pubkeyHex, 'nip07');
        return { success: true, pubkeyHex: result.pubkeyHex };
    }

    // --- NIP-46認証 ---

    async authenticateWithNip46(bunkerUrl: string): Promise<AuthResult> {
        try {
            const pubkeyHex = await this.nip46Svc.connect(bunkerUrl);
            const npub = nip19.npubEncode(pubkeyHex);
            const nprofile = nip19.nprofileEncode({ pubkey: pubkeyHex, relays: [] });
            this.setNip46AuthFn(pubkeyHex, npub, nprofile);
            this.nip46Svc.saveSession(this.localStorage, pubkeyHex);
            this.accountManager?.addAccount(pubkeyHex, 'nip46');
            return { success: true, pubkeyHex };
        } catch (error) {
            this.console.error('NIP-46認証エラー:', error);
            const msg = error instanceof Error ? error.message : 'nip46_connection_failed';
            return { success: false, error: msg };
        }
    }

    // --- ログアウト ---

    /**
     * 指定アカウントをログアウトする。
     * @returns 次のアクティブアカウントのpubkeyHex。アカウントが残っていない場合はnull。
     */
    logoutAccount(pubkeyHex: string): string | null | undefined {
        try {
            // NIP-46の場合は接続を切断
            const accountType = this.accountManager?.getAccountType(pubkeyHex);
            if (accountType === 'nip46') {
                this.nip46Svc.disconnect().catch(e => {
                    this.console.error('NIP-46切断エラー:', e);
                });
            }

            // per-accountデータを削除
            this.accountManager?.cleanupAccountData(pubkeyHex);

            // アカウントリストから削除
            const nextPubkey = this.accountManager?.removeAccount(pubkeyHex);

            this.clearProfileImageCache();

            // string: 次のアクティブアカウント, null: アカウント残なし, undefined: 非アクティブ削除
            return nextPubkey;
        } catch (error) {
            this.console.error('ログアウト処理中に予期しないエラー:', error);
            return null;
        }
    }

    /**
     * @deprecated Use logoutAccount() instead. Kept for backward compatibility.
     */
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
            // nostr-loginライブラリの残留データをクリーンアップ
            this.accountManager?.cleanupNostrLoginData();

            // マイグレーション実行（旧→マルチアカウント形式）
            this.accountManager?.migrateFromSingleAccount();

            // マルチアカウント: アクティブアカウントを復元
            const activePubkey = this.accountManager?.getActiveAccountPubkey();
            if (activePubkey) {
                const accountType = this.accountManager?.getAccountType(activePubkey);
                if (accountType) {
                    const result = await this.restoreAccount(activePubkey, accountType);
                    if (result.hasAuth) return result;
                }
            }

            // アクティブアカウントの復元に失敗した場合、他のアカウントを試行
            const accounts = this.accountManager?.getAccounts() ?? [];
            for (const account of accounts) {
                if (account.pubkeyHex === activePubkey) continue;
                const result = await this.restoreAccount(account.pubkeyHex, account.type);
                if (result.hasAuth) {
                    this.accountManager?.setActiveAccount(account.pubkeyHex);
                    return result;
                }
            }

            // フォールバック: レガシー形式のチェック（マイグレーション失敗時）
            const nsecResult = await this.checkNsecAuth();
            if (nsecResult.hasAuth) return nsecResult;

            const nip07Result = await this.checkNip07Auth();
            if (nip07Result.hasAuth) return nip07Result;

            const nip46Result = await this.checkNip46Auth();
            if (nip46Result.hasAuth) return nip46Result;
        } catch (error) {
            this.console.error('認証初期化失敗:', error);
        }

        return { hasAuth: false };
    }

    /**
     * 指定アカウントの認証を復元する。
     */
    async restoreAccount(pubkeyHex: string, type: 'nsec' | 'nip07' | 'nip46'): Promise<{ hasAuth: boolean; pubkeyHex?: string }> {
        switch (type) {
            case 'nsec':
                return this.restoreNsecAccount(pubkeyHex);
            case 'nip07':
                return this.restoreNip07Account(pubkeyHex);
            case 'nip46':
                return this.restoreNip46Account(pubkeyHex);
            default:
                return { hasAuth: false };
        }
    }

    private async restoreNsecAccount(pubkeyHex: string): Promise<{ hasAuth: boolean; pubkeyHex?: string }> {
        const storedKey = this.keyManager.loadFromStorage(pubkeyHex);
        if (!storedKey) return { hasAuth: false };

        this.publicKeyState.setNsec(storedKey);

        try {
            const derived = this.keyManager.derivePublicKey(storedKey);
            if (derived.hex) {
                this.setNsecAuthFn(derived.hex, derived.npub, derived.nprofile);
                return { hasAuth: true, pubkeyHex: derived.hex };
            }
        } catch {
            // derivation failed
        }
        return { hasAuth: false };
    }

    private async restoreNip07Account(pubkeyHex: string): Promise<{ hasAuth: boolean; pubkeyHex?: string }> {
        const available = await this.nip07Service.waitForExtension(1000);
        if (!available) return { hasAuth: false };

        try {
            const npub = nip19.npubEncode(pubkeyHex);
            const nprofile = nip19.nprofileEncode({ pubkey: pubkeyHex, relays: [] });
            this.setNip07AuthFn(pubkeyHex, npub, nprofile);
            return { hasAuth: true, pubkeyHex };
        } catch (error) {
            this.console.error('NIP-07アカウント復元エラー:', error);
            return { hasAuth: false };
        }
    }

    private async restoreNip46Account(pubkeyHex: string): Promise<{ hasAuth: boolean; pubkeyHex?: string }> {
        const session = Nip46Service.loadSession(this.localStorage, pubkeyHex);
        if (!session) return { hasAuth: false };

        try {
            await this.nip46Svc.reconnect(session);
            const npub = nip19.npubEncode(pubkeyHex);
            const nprofile = nip19.nprofileEncode({ pubkey: pubkeyHex, relays: [] });
            this.setNip46AuthFn(pubkeyHex, npub, nprofile);
            return { hasAuth: true, pubkeyHex };
        } catch (error) {
            this.console.error('NIP-46アカウント復元エラー:', error);
            return { hasAuth: false };
        }
    }

    private async checkNsecAuth(): Promise<{ hasAuth: boolean; pubkeyHex?: string }> {
        const storedKey = this.keyManager.loadFromStorage();
        if (!storedKey) return { hasAuth: false };

        this.publicKeyState.setNsec(storedKey);

        try {
            const derived = this.keyManager.derivePublicKey(storedKey);
            if (derived.hex) {
                this.setNsecAuthFn(derived.hex, derived.npub, derived.nprofile);
                // レガシーログインをマルチアカウントに移行
                this.accountManager?.addAccount(derived.hex, 'nsec');
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
            // レガシーログインをマルチアカウントに移行
            this.accountManager?.addAccount(storedPubkey, 'nip07');
            this.localStorage.removeItem(NIP07_STORAGE_KEY);
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
            // レガシーログインをマルチアカウントに移行
            this.accountManager?.addAccount(pubkey, 'nip46');
            this.nip46Svc.saveSession(this.localStorage, pubkey);
            Nip46Service.clearSession(this.localStorage); // レガシーキー削除
            return { hasAuth: true, pubkeyHex: pubkey };
        } catch (error) {
            this.console.error('NIP-46セッション復元エラー:', error);
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
