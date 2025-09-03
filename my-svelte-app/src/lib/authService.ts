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
     * 初期化時の認証状態チェック
     */
    async initializeAuth(): Promise<{ hasAuth: boolean; pubkeyHex?: string; isNostrLogin?: boolean }> {
        try {
            // nostr-loginの初期化と認証チェック
            await nostrLoginManager.init(this.nostrLoginOptions);

            // --- リトライ回数・間隔を短縮 ---
            let retries = 10; // 20→10
            let currentUser = null;
            while (retries-- > 0) {
                currentUser = nostrLoginManager.getCurrentUser();
                if (currentUser?.pubkey) break;
                await new Promise(resolve => setTimeout(resolve, 50)); // 100ms→50ms
            }
            // --- ここまで ---

            // --- localStorageから直接復元 ---
            if (!currentUser?.pubkey) {
                try {
                    const nip46Raw = localStorage.getItem('__nostrlogin_nip46');
                    if (nip46Raw) {
                        const nip46 = JSON.parse(nip46Raw);
                        if (nip46?.pubkey) {
                            // window.nostrLoginがセットされるまでさらに待つ
                            let waitNostrLogin = 5; // 10→5
                            while (waitNostrLogin-- > 0) {
                                currentUser = nostrLoginManager.getCurrentUser();
                                if (currentUser?.pubkey) break;
                                await new Promise(resolve => setTimeout(resolve, 50)); // 100ms→50ms
                            }
                            if (!currentUser?.pubkey) {
                                currentUser = { pubkey: nip46.pubkey, npub: undefined };
                            }
                        }
                    }
                } catch (e) {
                    // ignore
                }
            }
            // --- ここまで ---

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
        } catch (error) {
            console.error('nostr-login初期化失敗:', error);
        }

        // nostr-loginでの認証がない場合、ストレージからnsecをチェック
        const storedKey = keyManager.loadFromStorage();
        if (storedKey) {
            this.publicKeyState.setNsec(storedKey);
            try {
                const derived = keyManager.derivePublicKey(storedKey);
                if (derived.hex) {
                    setNsecAuth(derived.hex, derived.npub, derived.nprofile);
                    return {
                        hasAuth: true,
                        pubkeyHex: derived.hex,
                        isNostrLogin: false
                    };
                }
            } catch (error) {
                console.error('ストレージキーの処理中にエラー:', error);
            }
        }

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
