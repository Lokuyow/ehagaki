import type { NostrLoginAuth } from './keyManager';
import { nip19 } from "nostr-tools";

export interface NostrLoginOptions {
    theme?: 'default' | 'ocean' | 'lemonade' | 'purple';
    bunkers?: string[];
    perms?: string;
    noBanner?: boolean;
    startScreen?: string;
}

export type NostrLoginEventHandler = (auth: NostrLoginAuth) => void;

// --- 依存性注入用のインターフェース ---
export interface NostrLoginDependencies {
    window?: Window & { nostrLogin?: any };
    document?: Document;
    console?: Console;
    setTimeout?: (callback: () => void, delay: number) => void;
    importNostrLogin?: () => Promise<{ init: Function; launch: Function }>;
}

export interface NostrLoginError {
    type: 'initialization' | 'auth' | 'launch' | 'decode';
    message: string;
    originalError?: unknown;
}

// --- 純粋関数: オプション処理とデータ変換 ---
export class NostrLoginUtils {
    static createMergedOptions(options: NostrLoginOptions): NostrLoginOptions {
        return {
            theme: 'default',
            noBanner: true,
            perms: 'get_public_key,sign_event:1,sign_event:27235',
            startScreen: 'welcome',
            ...options
        };
    }

    static processBunkers(bunkers?: string[]): string | undefined {
        return Array.isArray(bunkers) ? bunkers.join(',') : undefined;
    }

    static async npubToPubkey(npub: string): Promise<{ success: boolean; pubkey?: string; error?: NostrLoginError }> {
        try {
            if (!npub) {
                return {
                    success: false,
                    error: { type: 'decode', message: 'npub is empty or null' }
                };
            }

            const decoded = nip19.decode(npub);
            if (decoded.type === "npub") {
                return { success: true, pubkey: decoded.data as string };
            }

            return {
                success: false,
                error: { type: 'decode', message: 'Invalid npub format' }
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'decode',
                    message: 'Failed to decode npub',
                    originalError: error
                }
            };
        }
    }

    static getCurrentUserFromWindow(window: Window & { nostrLogin?: any }): { pubkey?: string; npub?: string } | null {
        try {
            const nlData = window.nostrLogin;
            if (nlData && nlData.pubkey) {
                return {
                    pubkey: nlData.pubkey,
                    npub: nlData.npub
                };
            }
        } catch (error) {
            // エラーログは呼び出し元で処理
            return null;
        }
        return null;
    }
}

// --- 認証コールバック処理の分離 ---
export class NostrLoginAuthHandler {
    constructor(
        private console: Console,
        private getAuthHandler: () => NostrLoginEventHandler | null,
        private isLoggingOut: () => boolean
    ) { }

    async handleAuthCallback(npub: string, options: any): Promise<void> {
        const authHandler = this.getAuthHandler();
        if (!authHandler || this.isLoggingOut()) return;

        try {
            // ログアウトの場合
            if (!npub) {
                authHandler({ type: 'logout' });
                return;
            }

            const pubkeyResult = await NostrLoginUtils.npubToPubkey(npub);
            if (!pubkeyResult.success || !pubkeyResult.pubkey) {
                this.console.warn('NostrLogin: Failed to get pubkey from npub', pubkeyResult.error);
                return;
            }

            // ログインまたはサインアップ
            const authType = options?.type || 'login';
            authHandler({
                type: authType,
                pubkey: pubkeyResult.pubkey,
                npub,
                otpData: options?.otpData
            });
        } catch (error) {
            this.console.error('NostrLogin auth callback error:', error);
        }
    }
}

// --- 初期化処理の分離 ---
export class NostrLoginInitializer {
    constructor(
        private console: Console,
        private importNostrLogin: () => Promise<{ init: Function; launch: Function }>,
        private authHandler: NostrLoginAuthHandler
    ) { }

    async initialize(options: NostrLoginOptions): Promise<{ success: boolean; error?: NostrLoginError }> {
        try {
            const imported = await this.importNostrLogin();
            const init = imported.init;

            if (!init) {
                throw new TypeError('nostr-login: init function is missing');
            }

            const mergedOptions = NostrLoginUtils.createMergedOptions(options);

            // onAuthをFunction型で渡すことでspyの引数一致を保証
            const onAuth = this.authHandler.handleAuthCallback.bind(this.authHandler);
            // bunkersは空配列なら空文字列、undefinedならundefined
            const bunkersProcessed = mergedOptions.bunkers !== undefined
                ? NostrLoginUtils.processBunkers(mergedOptions.bunkers)
                : undefined;
            const callOptions = {
                ...mergedOptions,
                bunkers: bunkersProcessed, // 常にプロパティとして含める
                startScreen: mergedOptions.startScreen,
                onAuth
            };

            // init関数を必ず呼び出す
            await Promise.resolve(init(callOptions));
            this.console.log('nostr-login初期化完了');
            return { success: true };
        } catch (error) {
            const nostrError: NostrLoginError = {
                type: 'initialization',
                message: 'Failed to initialize nostr-login',
                originalError: error
            };
            this.console.error('nostr-login初期化エラー:', error);
            return { success: false, error: nostrError };
        }
    }
}

// --- ローンチ処理の分離 ---
export class NostrLoginLauncher {
    constructor(
        private importNostrLogin: () => Promise<{ init: Function; launch: Function }>
    ) { }

    async launch(startScreen?: string): Promise<{ success: boolean; error?: NostrLoginError }> {
        try {
            const { launch } = await this.importNostrLogin();
            await launch((startScreen || 'welcome') as any);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'launch',
                    message: 'Failed to launch nostr-login',
                    originalError: error
                }
            };
        }
    }
}

// --- イベント発行処理の分離 ---
export class NostrLoginEventEmitter {
    constructor(
        private document: Document,
        private setTimeout: (callback: () => void, delay: number) => void
    ) { }

    logout(setLoggingOutFlag: (flag: boolean) => void): void {
        setLoggingOutFlag(true);

        try {
            const event = new Event('nlLogout');
            this.document.dispatchEvent(event);
        } catch (error) {
            console.error('Failed to dispatch nlLogout event:', error);
        }

        try {
            this.setTimeout(() => {
                setLoggingOutFlag(false);
            }, 100);
        } catch (error) {
            console.error('Failed to set logout flag timeout:', error);
            setLoggingOutFlag(false);
        }
    }

    setDarkMode(darkMode: boolean): void {
        try {
            const event = new CustomEvent('nlDarkMode', { detail: darkMode });
            this.document.dispatchEvent(event);
        } catch (error) {
            console.error('Failed to dispatch nlDarkMode event:', error);
        }
    }
}

// --- メインのNostrLoginManagerクラス ---
export class NostrLoginManager {
    private initialized = false;
    private authHandler: NostrLoginEventHandler | null = null;
    private isLoggingOutFlag = false;
    private initPromise: Promise<void> | null = null;
    private resolvedPromise: Promise<void> | null = null;

    private initializer: NostrLoginInitializer;
    private launcher: NostrLoginLauncher;
    private eventEmitter: NostrLoginEventEmitter;
    private authCallbackHandler: NostrLoginAuthHandler;

    // 依存性をプロパティとして保持
    private windowObj: Window & { nostrLogin?: any };
    private documentObj: Document;
    private consoleObj: Console;
    private setTimeoutFn: (callback: () => void, delay: number) => void;

    constructor(dependencies: NostrLoginDependencies = {}) {
        // デフォルト依存関係の設定
        this.windowObj = dependencies.window || (typeof window !== 'undefined' ? window : {} as any);
        this.documentObj = dependencies.document || (typeof window !== 'undefined' ? window.document : {} as Document);
        this.consoleObj = dependencies.console || (typeof window !== 'undefined' ? window.console : {} as Console);
        this.setTimeoutFn = dependencies.setTimeout || (typeof window !== 'undefined' ? window.setTimeout.bind(window) : (() => { }) as any);
        const importNostrLogin = dependencies.importNostrLogin || (() => import('nostr-login'));

        // 内部コンポーネントの初期化
        this.authCallbackHandler = new NostrLoginAuthHandler(
            this.consoleObj,
            () => this.authHandler,
            () => this.isLoggingOutFlag
        );

        this.initializer = new NostrLoginInitializer(this.consoleObj, importNostrLogin, this.authCallbackHandler);
        this.launcher = new NostrLoginLauncher(importNostrLogin);
        this.eventEmitter = new NostrLoginEventEmitter(this.documentObj, this.setTimeoutFn);
    }

    // 変更: async を外して、同一の Promise インスタンスを確実に返す実装に置き換え
    init(options: NostrLoginOptions = {}): Promise<void> {
        // 初期化中の場合: 既存のプロミスを返す
        if (this.initPromise !== null) {
            return this.initPromise;
        }

        // 初期化済みの場合: 必ず同じresolvedPromiseを返す
        if (this.initialized) {
            return this.resolvedPromise!;
        }

        // 新しい初期化プロミスを作成（executor内で非同期処理を扱う）
        this.initPromise = new Promise<void>((resolve, reject) => {
            // 初期化の非同期処理を開始
            this.initializer.initialize(options)
                .then(result => {
                    if (result.success) {
                        this.initialized = true;
                        // 初期化完了時のPromiseをキャッシュ（同一インスタンス）
                        this.resolvedPromise = this.initPromise!;
                        resolve();
                    } else {
                        this._resetInitializationState();
                        const errorMessage = result.error?.message || 'Initialization failed';
                        const originalError = result.error?.originalError;
                        if (originalError instanceof Error) {
                            reject(originalError);
                        } else {
                            reject(new Error(errorMessage));
                        }
                    }
                })
                .catch(error => {
                    this._resetInitializationState();
                    reject(error);
                });
        });

        return this.initPromise;
    }

    private _resetInitializationState(): void {
        this.initialized = false;
        this.initPromise = null;
        this.resolvedPromise = null;
    }

    setAuthHandler(handler: NostrLoginEventHandler): void {
        this.authHandler = handler;
    }

    async showLogin(startScreen?: string): Promise<void> {
        if (!this._ensureInitialized()) {
            throw new Error('nostr-login is not initialized');
        }

        const result = await this.launcher.launch(startScreen);
        if (!result.success) {
            // originalErrorがあればそれをthrow、なければmessage
            if (result.error?.originalError instanceof Error) {
                throw result.error.originalError;
            }
            throw new Error(result.error?.message || 'Failed to launch login');
        }
    }

    logout(): void {
        try {
            if (!this._ensureInitialized()) return;

            this.eventEmitter.logout((flag: boolean) => {
                this.isLoggingOutFlag = flag;
            });
        } catch (error) {
            this.consoleObj.error('NostrLogin logout error:', error);
        }
    }

    setDarkMode(darkMode: boolean): void {
        if (!this._ensureInitialized()) return;
        this.eventEmitter.setDarkMode(darkMode);
    }

    getCurrentUser(): { pubkey?: string; npub?: string } | null {
        // 初期化されていない場合は早期リターン（エラーログなし）
        if (!this.initialized) {
            return null;
        }

        // 依存性注入されたwindowオブジェクトを参照
        const result = NostrLoginUtils.getCurrentUserFromWindow(this.windowObj);

        return result;
    }

    private _ensureInitialized(): boolean {
        if (!this.initialized) {
            this.consoleObj.warn('nostr-loginが初期化されていません');
            return false;
        }
        return true;
    }

    get isInitialized(): boolean {
        return this.initialized;
    }

    // --- テスト用の内部コンポーネントへのアクセス ---
    getInitializer(): NostrLoginInitializer {
        return this.initializer;
    }

    getLauncher(): NostrLoginLauncher {
        return this.launcher;
    }

    getEventEmitter(): NostrLoginEventEmitter {
        return this.eventEmitter;
    }

    getAuthCallbackHandler(): NostrLoginAuthHandler {
        return this.authCallbackHandler;
    }
}

export const nostrLoginManager = new NostrLoginManager();
