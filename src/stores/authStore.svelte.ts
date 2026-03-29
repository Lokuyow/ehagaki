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
    }
};

export function updateAuthState(newState: Partial<AuthState>): void {
    const current = authStateValue;
    const updated = { ...current, ...newState };
    updated.isAuthenticated = updated.type !== 'none' && updated.isValid;
    updated.isExtensionLogin = updated.type === 'nip07';

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

export function setNip07Auth(pubkey: string, npub: string, nprofile: string): void {
    if (!pubkey || !npub || !nprofile) {
        console.warn('setNip07Auth: All parameters are required');
        return;
    }
    updateAuthState({ type: 'nip07', pubkey, npub, nprofile, isValid: true });
}

export function setNip46Auth(pubkey: string, npub: string, nprofile: string): void {
    if (!pubkey || !npub || !nprofile) {
        console.warn('setNip46Auth: All parameters are required');
        return;
    }
    updateAuthState({ type: 'nip46', pubkey, npub, nprofile, isValid: true });
}

export function setAuthInitialized(): void {
    updateAuthState({ isInitialized: true });
}

// --- 秘密鍵管理 ---
let secretKey = $state<string | null>(null);

export const secretKeyStore = {
    get value() { return secretKey; },
    set: (value: string | null) => { secretKey = value; }
};
