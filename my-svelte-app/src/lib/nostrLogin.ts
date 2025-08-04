import type { NostrLoginAuth } from './keyManager';

// nostr-loginの初期化オプション
export interface NostrLoginOptions {
    theme?: 'default' | 'ocean' | 'lemonade' | 'purple';
    darkMode?: boolean;
    bunkers?: string[];
    perms?: string;
    noBanner?: boolean;
    methods?: string[];
    startScreen?: string;
}

// nostr-loginのイベントハンドラー
export type NostrLoginEventHandler = (auth: NostrLoginAuth) => void;

export class NostrLoginManager {
    private initialized = false;
    private authHandler: NostrLoginEventHandler | null = null;
    private isLoggingOut = false; // ログアウト処理中フラグを追加

    /**
     * nostr-loginを初期化
     */
    async init(options: NostrLoginOptions = {}): Promise<void> {
        if (this.initialized) {
            return;
        }

        try {
            // nostr-loginライブラリを動的にインポート
            const { init } = await import('nostr-login');

            // デフォルトオプション
            const defaultOptions = {
                theme: 'default' as const,
                darkMode: false,
                noBanner: true, // バナーは独自UIで制御するため無効化
                methods: ['connect', 'extension', 'readOnly', 'local'],
                perms: 'sign_event:1,sign_event:0',
                startScreen: 'welcome'
            };

            // オプションをマージ
            const mergedOptions = { ...defaultOptions, ...options };

            // bunkersが配列の場合はカンマ区切りの文字列に変換
            const bunkers =
                Array.isArray(mergedOptions.bunkers)
                    ? mergedOptions.bunkers.join(',')
                    : mergedOptions.bunkers;

            // startScreenを型に合わせてキャスト
            const startScreen = mergedOptions.startScreen as any;

            // nostr-loginを初期化（onAuthコールバックなしで初期化）
            init({
                ...mergedOptions,
                bunkers,
                startScreen,
                noBanner: true // 確実にバナーを無効化
            });

            // 初期化後に認証ハンドラーを設定
            this.setupAuthListener();

            this.initialized = true;
            console.log('nostr-login初期化完了');
        } catch (error) {
            console.error('nostr-login初期化エラー:', error);
            throw error;
        }
    }

    /**
     * 認証イベントリスナーを設定
     */
    private setupAuthListener(): void {
        document.addEventListener('nlAuth', (event: Event) => {
            if (this.authHandler && !this.isLoggingOut) {
                const detail = (event as CustomEvent).detail;
                if (detail.type === 'logout') {
                    this.authHandler({ type: 'logout' });
                } else if (detail.type === 'login' || detail.type === 'signup') {
                    // pubkeyがあればそれを使い、なければnpubから変換
                    const handleAuth = (pubkey: string) => {
                        const auth: NostrLoginAuth = {
                            type: detail.type,
                            pubkey,
                            npub: detail.npub,
                            otpData: detail.otpData
                        };
                        this.authHandler!(auth);
                    };
                    if (detail.pubkey) {
                        handleAuth(detail.pubkey);
                    } else if (detail.npub) {
                        this.npubToPubkey(detail.npub).then(handleAuth);
                    }
                }
            }
        });
    }

    /**
     * 認証イベントハンドラーを設定
     */
    setAuthHandler(handler: NostrLoginEventHandler): void {
        this.authHandler = handler;
    }

    /**
     * ログインダイアログを表示
     */
    showLogin(startScreen?: string): void {
        if (!this.initialized) {
            console.warn('nostr-loginが初期化されていません');
            return;
        }

        document.dispatchEvent(new CustomEvent('nlLaunch', {
            detail: startScreen || 'welcome'
        }));
    }

    /**
     * ログアウト
     */
    logout(): void {
        if (!this.initialized) {
            console.warn('nostr-loginが初期化されていません');
            return;
        }

        this.isLoggingOut = true;
        document.dispatchEvent(new Event('nlLogout'));
        
        // フラグをリセット（少し遅延させる）
        setTimeout(() => {
            this.isLoggingOut = false;
        }, 100);
    }

    /**
     * ダークモードを切り替え
     */
    setDarkMode(darkMode: boolean): void {
        if (!this.initialized) {
            console.warn('nostr-loginが初期化されていません');
            return;
        }

        document.dispatchEvent(new CustomEvent('nlDarkMode', {
            detail: darkMode
        }));
    }

    /**
     * npubから公開鍵を抽出
     */
    private async npubToPubkey(npub: string): Promise<string> {
        try {
            // nostr-toolsのnip19を使ってデコード
            const { nip19 } = await import('nostr-tools');
            const { type, data } = nip19.decode(npub);
            return type === 'npub' ? data as string : '';
        } catch (error) {
            console.error('npubのデコードエラー:', error);
            return '';
        }
    }

    /**
     * 初期化状態を取得
     */
    get isInitialized(): boolean {
        return this.initialized;
    }
}

// シングルトンインスタンス
export const nostrLoginManager = new NostrLoginManager();
