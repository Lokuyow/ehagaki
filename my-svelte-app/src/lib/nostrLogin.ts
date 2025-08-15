import type { NostrLoginAuth } from './keyManager';

export interface NostrLoginOptions {
    theme?: 'default' | 'ocean' | 'lemonade' | 'purple';
    bunkers?: string[];
    perms?: string;
    noBanner?: boolean;
    startScreen?: string;
}

export type NostrLoginEventHandler = (auth: NostrLoginAuth) => void;

interface NostrLoginDetail {
    type: 'login' | 'signup' | 'logout';
    pubkey?: string;
    npub?: string;
    otpData?: unknown;
}

export class NostrLoginManager {
    private initialized = false;
    private authHandler: NostrLoginEventHandler | null = null;
    private isLoggingOut = false;
    private initPromise: Promise<void> | null = null;

    async init(options: NostrLoginOptions = {}): Promise<void> {
        if (this.initialized) return;
        if (this.initPromise) return this.initPromise;

        this.initPromise = this._performInit(options);
        return this.initPromise;
    }

    private async _performInit(options: NostrLoginOptions): Promise<void> {
        try {
            const { init } = await import('nostr-login');
            const mergedOptions = this._createMergedOptions(options);

            init({
                ...mergedOptions,
                bunkers: this._processBunkers(mergedOptions.bunkers),
                startScreen: mergedOptions.startScreen as any,
                onAuth: this._handleAuthCallback.bind(this)
            });

            this.initialized = true;
            console.log('nostr-login初期化完了');
        } catch (error) {
            console.error('nostr-login初期化エラー:', error);
            this.initPromise = null;
            throw error;
        }
    }

    private _createMergedOptions(options: NostrLoginOptions): NostrLoginOptions {
        return {
            theme: 'default',
            noBanner: true,
            perms: 'sign_event:1,sign_event:0',
            startScreen: 'welcome',
            ...options
        };
    }

    private _processBunkers(bunkers?: string[]): string | undefined {
        return Array.isArray(bunkers) ? bunkers.join(',') : undefined;
    }

    private async _handleAuthCallback(npub: string, options: any): Promise<void> {
        if (!this.authHandler || this.isLoggingOut) return;

        try {
            // ログアウトの場合
            if (!npub) {
                this.authHandler({ type: 'logout' });
                return;
            }

            const pubkey = await this.npubToPubkey(npub);
            if (!pubkey) {
                console.warn('NostrLogin: Failed to get pubkey from npub');
                return;
            }

            // ログインまたはサインアップ
            const authType = options?.type || 'login';
            this.authHandler({
                type: authType,
                pubkey,
                npub,
                otpData: options?.otpData
            });
        } catch (error) {
            console.error('NostrLogin auth callback error:', error);
        }
    }

    setAuthHandler(handler: NostrLoginEventHandler): void {
        this.authHandler = handler;
    }

    async showLogin(startScreen?: string): Promise<void> {
        if (!this._ensureInitialized()) {
            throw new Error('nostr-login is not initialized');
        }

        try {
            const { launch } = await import('nostr-login');
            await launch((startScreen || 'welcome') as any);
        } catch (error) {
            // エラーを再スローして呼び出し元で処理できるようにする
            throw error;
        }
    }

    logout(): void {
        if (!this._ensureInitialized()) return;

        this.isLoggingOut = true;
        document.dispatchEvent(new Event('nlLogout'));

        setTimeout(() => { this.isLoggingOut = false; }, 100);
    }

    setDarkMode(darkMode: boolean): void {
        if (!this._ensureInitialized()) return;

        document.dispatchEvent(new CustomEvent('nlDarkMode', { detail: darkMode }));
    }

    private _ensureInitialized(): boolean {
        if (!this.initialized) {
            console.warn('nostr-loginが初期化されていません');
            return false;
        }
        return true;
    }

    private async npubToPubkey(npub: string): Promise<string> {
        try {
            const { generatePublicKeyFormats } = await import('./utils');
            const pubkeyData = generatePublicKeyFormats(npub);
            return pubkeyData.hex || '';
        } catch (error) {
            console.error('npubのデコードエラー:', error);
            return '';
        }
    }

    async checkAuthState(): Promise<NostrLoginAuth | null> {
        if (!this._ensureInitialized()) return null;

        try {
            // nostr-loginの実際の認証状態を取得
            const authEvent = new CustomEvent('nlCheckAuth');

            return new Promise((resolve) => {
                const handleAuthCheck = (event: Event) => {
                    document.removeEventListener('nlAuthResponse', handleAuthCheck);
                    const detail = (event as CustomEvent).detail;

                    if (detail && detail.pubkey) {
                        resolve({
                            type: 'login',
                            pubkey: detail.pubkey,
                            npub: detail.npub
                        });
                    } else {
                        resolve(null);
                    }
                };

                // タイムアウト設定
                const timeout = setTimeout(() => {
                    document.removeEventListener('nlAuthResponse', handleAuthCheck);
                    resolve(null);
                }, 1000);

                document.addEventListener('nlAuthResponse', handleAuthCheck);
                document.dispatchEvent(authEvent);
            });
        } catch (error) {
            console.error('nostr-login認証状態チェックエラー:', error);
            return null;
        }
    }

    // より確実な認証状態チェック（nostr-loginの内部状態を直接確認）
    isLoggedIn(): boolean {
        try {
            // nostr-loginの内部状態を確認する方法
            const nlData = (window as any).nostrLogin;
            return !!(nlData && nlData.pubkey);
        } catch (error) {
            return false;
        }
    }

    getCurrentUser(): { pubkey?: string; npub?: string } | null {
        try {
            const nlData = (window as any).nostrLogin;
            if (nlData && nlData.pubkey) {
                return {
                    pubkey: nlData.pubkey,
                    npub: nlData.npub
                };
            }
        } catch (error) {
            console.error('getCurrentUser error:', error);
        }
        return null;
    }

    get isInitialized(): boolean {
        return this.initialized;
    }
}

export const nostrLoginManager = new NostrLoginManager();
