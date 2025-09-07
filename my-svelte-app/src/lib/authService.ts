import { keyManager, PublicKeyState, type NostrLoginAuth } from './keyManager';
import { nostrLoginManager, type NostrLoginOptions } from './nostrLogin';
import { setAuthInitialized, setNsecAuth, clearAuthState } from './stores';
import { debugLog } from './debug';

export interface AuthResult {
    success: boolean;
    error?: string;
    pubkeyHex?: string;
}

export class AuthService {
    private publicKeyState: PublicKeyState;
    // ハードコードで設定できるようにプロパティ追加
    nostrLoginOptions: NostrLoginOptions = {
        theme: 'default',
        noBanner: true,
    };

    constructor() {
        this.publicKeyState = new PublicKeyState();
    }

    /**
     * nsecを使った認証処理
     */
    async authenticateWithNsec(secretKey: string): Promise<AuthResult> {
        if (!keyManager.isValidNsec(secretKey)) {
            return { success: false, error: 'invalid_secret' };
        }

        const { success } = keyManager.saveToStorage(secretKey);
        if (!success) {
            this.publicKeyState.clear();
            return { success: false, error: 'error_saving' };
        }

        try {
            const derived = keyManager.derivePublicKey(secretKey);
            if (derived.hex) {
                setNsecAuth(derived.hex, derived.npub, derived.nprofile);
                return { success: true, pubkeyHex: derived.hex };
            } else {
                return { success: false, error: 'derivation_failed' };
            }
        } catch (error) {
            console.error('nsec認証処理中にエラー:', error);
            return { success: false, error: 'authentication_error' };
        }
    }

    /**
     * nostr-loginを使った認証処理
     */
    async authenticateWithNostrLogin(auth: NostrLoginAuth): Promise<AuthResult> {
        if (auth.type === 'logout') {
            this.logout();
            return { success: true };
        }

        if (!auth.pubkey) {
            console.warn('NostrLoginAuth: pubkey is required for login/signup');
            return { success: false, error: 'missing_pubkey' };
        }

        try {
            this.publicKeyState.setNostrLoginAuth(auth);
            return { success: true, pubkeyHex: auth.pubkey };
        } catch (error) {
            console.error('nostr-login認証処理中にエラー:', error);
            return { success: false, error: 'nostr_login_error' };
        }
    }

    /**
     * nostr-loginダイアログを表示
     */
    async showNostrLoginDialog(): Promise<void> {
        if (!nostrLoginManager.isInitialized) {
            throw new Error('nostr-login is not initialized');
        }

        try {
            await nostrLoginManager.showLogin();
        } catch (error) {
            if (!(error instanceof Error && error.message === 'Cancelled')) {
                console.error('nostr-loginでエラー:', error);
                throw error;
            }
        }
    }

    /**
     * プロフィール画像キャッシュをクリア
     */
    private async clearProfileImageCache(): Promise<void> {
        try {
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                const messageChannel = new MessageChannel();
                return new Promise((resolve, reject) => {
                    messageChannel.port1.onmessage = (event) => {
                        if (event.data.success) {
                            console.log('プロフィール画像キャッシュをクリアしました');
                            resolve();
                        } else {
                            console.error('プロフィール画像キャッシュクリア失敗:', event.data.error);
                            reject(new Error(event.data.error));
                        }
                    };

                    if (navigator.serviceWorker.controller) {
                        navigator.serviceWorker.controller.postMessage(
                            { action: 'clearProfileCache' },
                            [messageChannel.port2]
                        );
                    } else {
                        reject(new Error('Service worker controller is null.'));
                    }
                });
            }
        } catch (error) {
            console.error('プロフィール画像キャッシュクリア中にエラー:', error);
        }
    }

    /**
     * ログアウト処理
     */
    logout(): void {
        debugLog('ログアウト処理開始');

        // ローカルストレージから特定の値を保持
        const localeValue = localStorage.getItem('locale');
        const uploadEndpointValue = localStorage.getItem('uploadEndpoint');

        // ストレージをクリア
        localStorage.clear();

        // 保持すべき値を復元
        if (localeValue !== null) localStorage.setItem('locale', localeValue);
        if (uploadEndpointValue !== null) localStorage.setItem('uploadEndpoint', uploadEndpointValue);

        // 状態をクリア（初期化状態は保持）
        this.publicKeyState.clear();
        clearAuthState(true);

        // nostr-loginからもログアウト
        if (nostrLoginManager.isInitialized) {
            nostrLoginManager.logout();
        }

        // プロフィール画像キャッシュをクリア
        this.clearProfileImageCache().catch(error => {
            console.error('プロフィール画像キャッシュクリア中にエラー:', error);
        });

        debugLog('ログアウト処理完了');
    }

    /**
     * 外部認証オブジェクト（window.nostrなど）の利用可能性を待機
     */
    private async waitForExternalAuth(timeoutMs: number = 5000): Promise<boolean> {
        const startTime = Date.now();
        const pollInterval = 100;

        return new Promise((resolve) => {
            const checkAuth = () => {
                // window.nostrの存在チェック
                if (typeof window !== 'undefined' &&
                    typeof (window as any).nostr === 'object' &&
                    (window as any).nostr !== null &&
                    typeof (window as any).nostr.getPublicKey === 'function') {
                    debugLog('[waitForExternalAuth] window.nostr利用可能');
                    resolve(true);
                    return;
                }

                // タイムアウトチェック
                if (Date.now() - startTime >= timeoutMs) {
                    debugLog('[waitForExternalAuth] タイムアウト');
                    resolve(false);
                    return;
                }

                // 次回チェックをスケジュール
                setTimeout(checkAuth, pollInterval);
            };

            checkAuth();
        });
    }

    /**
     * 初期化時の認証状態チェック
     */
    async initializeAuth(): Promise<{ hasAuth: boolean; pubkeyHex?: string; isNostrLogin?: boolean }> {
        try {
            // --- まずnsecストレージキーを優先的にチェック ---
            const storedKey = keyManager.loadFromStorage();
            if (storedKey) {
                debugLog('[initializeAuth] nsecストレージキーを検出', { storedKey });
                this.publicKeyState.setNsec(storedKey);
                try {
                    const derived = keyManager.derivePublicKey(storedKey);
                    if (derived.hex) {
                        debugLog('[initializeAuth] nsecからpubkey導出成功', { hex: derived.hex });
                        setNsecAuth(derived.hex, derived.npub, derived.nprofile);
                        return {
                            hasAuth: true,
                            pubkeyHex: derived.hex,
                            isNostrLogin: false
                        };
                    }
                } catch (error) {
                    debugLog('[initializeAuth] ストレージキーの処理中にエラー', error);
                    console.error('ストレージキーの処理中にエラー:', error);
                }
            }

            // --- nsecがなければ外部認証やnostr-loginをチェック ---
            // 外部認証オブジェクトの待機（非ブロッキング）
            const hasExternalAuth = await this.waitForExternalAuth(100);
            if (hasExternalAuth) {
                debugLog('[initializeAuth] 外部認証オブジェクト検出済み');
            }

            // nostr-loginの初期化
            await nostrLoginManager.init(this.nostrLoginOptions);

            // 1. まずwindow.nostrLoginから即時取得
            const currentUser = nostrLoginManager.getCurrentUser();
            if (currentUser?.pubkey) {
                debugLog('[initializeAuth] nostr-login認証成功', { pubkey: currentUser.pubkey });
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
            const nip46Raw = localStorage.getItem('__nostrlogin_nip46');
            if (nip46Raw) {
                try {
                    const nip46 = JSON.parse(nip46Raw);
                    debugLog('[initializeAuth] localStorageからnip46取得', { nip46 });
                    if (nip46?.pubkey) {
                        this.publicKeyState.setNostrLoginAuth({
                            type: 'login',
                            pubkey: nip46.pubkey,
                            npub: nip46.npub
                        });
                        return {
                            hasAuth: true,
                            pubkeyHex: nip46.pubkey,
                            isNostrLogin: true
                        };
                    }
                } catch (e) {
                    debugLog('[initializeAuth] localStorage復元中に例外', e);
                    // ignore
                }
            }

            // 3. 外部認証オブジェクトが利用可能な場合、追加チェック
            if (hasExternalAuth) {
                try {
                    const result = await keyManager.getPublicKeyFromWindowNostr();
                    if (result.success && result.pubkey) {
                        debugLog('[initializeAuth] window.nostrから公開鍵取得成功', { pubkey: result.pubkey });
                        // window.nostrからの認証情報をnostr-login形式で処理
                        const npub = keyManager.pubkeyToNpub(result.pubkey);
                        this.publicKeyState.setNostrLoginAuth({
                            type: 'login',
                            pubkey: result.pubkey,
                            npub: npub
                        });
                        return {
                            hasAuth: true,
                            pubkeyHex: result.pubkey,
                            isNostrLogin: true
                        };
                    }
                } catch (error) {
                    debugLog('[initializeAuth] window.nostr認証チェック中にエラー', error);
                }
            }
        } catch (error) {
            console.error('nostr-login初期化失敗:', error);
        }

        debugLog('[initializeAuth] 認証情報なし');
        return { hasAuth: false };
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
        nostrLoginManager.setAuthHandler(handler);
    }

    /**
     * 認証初期化完了をマーク
     */
    markAuthInitialized(): void {
        setAuthInitialized();
    }
}

export const authService = new AuthService();
