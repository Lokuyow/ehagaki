import type { AuthState } from '../lib/types';

// --- 認証状態管理 ---
const initialAuthState: AuthState = {
    type: 'none',
    isAuthenticated: false,
    pubkey: '',
    npub: '',
    nprofile: '',
    isValid: false,
    isInitialized: false,
    isExtensionLogin: false
};

let authStateValue = $state<AuthState>({ ...initialAuthState });

export const authState = {
    get value() {
        return authStateValue || initialAuthState;
    },
    subscribe: (callback: (value: AuthState) => void) => {
        $effect(() => {
            callback(authStateValue || initialAuthState);
        });
    }
};

export function updateAuthState(newState: Partial<AuthState>): void {
    const current = authStateValue;
    const updated = { ...current, ...newState };
    updated.isAuthenticated = updated.type !== 'none' && updated.isValid;
    updated.isExtensionLogin =
        updated.isAuthenticated &&
        updated.type === 'nostr-login' &&
        typeof window !== 'undefined' &&
        typeof (window as any).nostr === 'object' &&
        typeof (window as any).nostr.signEvent === 'function';

    authStateValue = updated;

    console.log('[updateAuthState] 認証状態を更新:', {
        type: updated.type,
        isAuthenticated: updated.isAuthenticated,
        isValid: updated.isValid,
        pubkey: updated.pubkey ? updated.pubkey.substring(0, 8) + '...' : 'empty'
    });
}

export function clearAuthState(preserveInitialized: boolean = true): void {
    authStateValue = {
        ...initialAuthState,
        isInitialized: preserveInitialized ? authStateValue.isInitialized : false
    };
}

export function setNsecAuth(pubkey: string, npub: string, nprofile: string): void {
    if (!pubkey || !npub || !nprofile) {
        console.warn('setNsecAuth: All parameters are required');
        return;
    }
    updateAuthState({ type: 'nsec', pubkey, npub, nprofile, isValid: true });
}

export function setNostrLoginAuth(pubkey: string, npub: string, nprofile: string, nostrLoginAuthMethod?: 'connect' | 'extension' | 'local'): void {
    if (!pubkey || !npub || !nprofile) {
        console.warn('setNostrLoginAuth: All parameters are required');
        return;
    }

    console.log('[setNostrLoginAuth] NostrLogin認証状態を更新:', {
        pubkey: pubkey.substring(0, 8) + '...',
        npub: npub.substring(0, 12) + '...',
        type: 'nostr-login',
        nostrLoginAuthMethod
    });

    updateAuthState({
        type: 'nostr-login',
        pubkey,
        npub,
        nprofile,
        isValid: true,
        nostrLoginAuthMethod
    });
}

export function setAuthInitialized(): void {
    updateAuthState({ isInitialized: true });
}

// --- 秘密鍵管理 ---
let secretKey = $state<string | null>(null);

export const secretKeyStore = {
    get value() { return secretKey; },
    set: (value: string | null) => { secretKey = value; },
    subscribe: (callback: (value: string | null) => void) => {
        $effect(() => {
            callback(secretKey);
        });
    }
};
