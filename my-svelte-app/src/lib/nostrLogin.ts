import type { NostrLoginAuth } from './keyManager';

export interface NostrLoginOptions {
    theme?: 'default' | 'ocean' | 'lemonade' | 'purple';
    darkMode?: boolean;
    bunkers?: string[];
    perms?: string;
    noBanner?: boolean;
    methods?: string[];
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
                noBanner: true
            });

            this.setupAuthListener();
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
            darkMode: false,
            noBanner: true,
            methods: ['connect', 'extension', 'readOnly', 'local'],
            perms: 'sign_event:1,sign_event:0',
            startScreen: 'welcome',
            ...options
        };
    }

    private _processBunkers(bunkers?: string[]): string | undefined {
        return Array.isArray(bunkers) ? bunkers.join(',') : undefined;
    }

    private setupAuthListener(): void {
        document.addEventListener('nlAuth', this._handleAuthEvent.bind(this));
    }

    private async _handleAuthEvent(event: Event): Promise<void> {
        if (!this.authHandler || this.isLoggingOut) return;

        try {
            const detail = (event as CustomEvent<NostrLoginDetail>).detail;

            if (detail.type === 'logout') {
                this.authHandler({ type: 'logout' });
                return;
            }

            if (detail.type === 'login' || detail.type === 'signup') {
                const pubkey = detail.pubkey ||
                    (detail.npub ? await this.npubToPubkey(detail.npub) : '');

                if (!pubkey) {
                    console.warn('NostrLogin: Failed to get pubkey');
                    return;
                }

                this.authHandler({
                    type: detail.type,
                    pubkey,
                    npub: detail.npub,
                    otpData: detail.otpData
                });
            }
        } catch (error) {
            console.error('NostrLogin auth event error:', error);
        }
    }

    setAuthHandler(handler: NostrLoginEventHandler): void {
        this.authHandler = handler;
    }

    showLogin(startScreen?: string): void {
        if (!this._ensureInitialized()) return;

        document.dispatchEvent(new CustomEvent('nlLaunch', {
            detail: startScreen || 'welcome'
        }));
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

    get isInitialized(): boolean {
        return this.initialized;
    }
}

export const nostrLoginManager = new NostrLoginManager();
