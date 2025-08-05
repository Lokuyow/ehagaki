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

export class NostrLoginManager {
    private initialized = false;
    private authHandler: NostrLoginEventHandler | null = null;
    private isLoggingOut = false;

    async init(options: NostrLoginOptions = {}): Promise<void> {
        if (this.initialized) return;
        try {
            const { init } = await import('nostr-login');
            const defaultOptions = {
                theme: 'default' as const,
                darkMode: false,
                noBanner: true,
                methods: ['connect', 'extension', 'readOnly', 'local'],
                perms: 'sign_event:1,sign_event:0',
                startScreen: 'welcome'
            };
            const mergedOptions = { ...defaultOptions, ...options };
            const bunkers = Array.isArray(mergedOptions.bunkers)
                ? mergedOptions.bunkers.join(',')
                : mergedOptions.bunkers;
            init({
                ...mergedOptions,
                bunkers,
                startScreen: mergedOptions.startScreen as any,
                noBanner: true
            });
            this.setupAuthListener();
            this.initialized = true;
            console.log('nostr-login初期化完了');
        } catch (error) {
            console.error('nostr-login初期化エラー:', error);
            throw error;
        }
    }

    private setupAuthListener(): void {
        document.addEventListener('nlAuth', async (event: Event) => {
            if (!this.authHandler || this.isLoggingOut) return;
            const detail = (event as CustomEvent).detail;
            if (detail.type === 'logout') {
                this.authHandler({ type: 'logout' });
            } else if (detail.type === 'login' || detail.type === 'signup') {
                const pubkey = detail.pubkey || (detail.npub ? await this.npubToPubkey(detail.npub) : '');
                this.authHandler({
                    type: detail.type,
                    pubkey,
                    npub: detail.npub,
                    otpData: detail.otpData
                });
            }
        });
    }

    setAuthHandler(handler: NostrLoginEventHandler): void {
        this.authHandler = handler;
    }

    showLogin(startScreen?: string): void {
        if (!this.initialized) {
            console.warn('nostr-loginが初期化されていません');
            return;
        }
        document.dispatchEvent(new CustomEvent('nlLaunch', {
            detail: startScreen || 'welcome'
        }));
    }

    logout(): void {
        if (!this.initialized) {
            console.warn('nostr-loginが初期化されていません');
            return;
        }
        this.isLoggingOut = true;
        document.dispatchEvent(new Event('nlLogout'));
        setTimeout(() => { this.isLoggingOut = false; }, 100);
    }

    setDarkMode(darkMode: boolean): void {
        if (!this.initialized) {
            console.warn('nostr-loginが初期化されていません');
            return;
        }
        document.dispatchEvent(new CustomEvent('nlDarkMode', { detail: darkMode }));
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
