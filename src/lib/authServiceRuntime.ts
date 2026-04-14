import { KeyManager, PublicKeyState } from './keyManager.svelte';
import { clearAuthState, secretKeyStore, setNip07Auth, setNip46Auth, setNsecAuth, setParentClientAuth } from '../stores/authStore.svelte';
import type { AuthServiceDependencies, PublicKeyData } from './types';
import { Nip07AuthService } from './nip07AuthService';
import { nip46Service, type Nip46Service } from './nip46Service';
import { parentClientAuthService, type ParentClientAuthService } from './parentClientAuthService';

type AuthSetter = (pubkey: string, npub: string, nprofile: string) => void;

interface AuthServiceKeyManager {
    isValidNsec(secretKey: string): boolean;
    derivePublicKey(secretKey: string): PublicKeyData;
    saveToStorage(secretKey: string, pubkeyHex?: string): unknown;
    loadFromStorage(pubkeyHex?: string): string | null;
}

export interface AuthServiceRuntime {
    publicKeyState: PublicKeyState;
    nip07Service: Nip07AuthService;
    keyManager: AuthServiceKeyManager;
    localStorage: Storage;
    navigator: Navigator;
    console: Console;
    nip46Svc: Nip46Service;
    parentClientSvc: ParentClientAuthService;
    setNsecAuthFn: AuthSetter;
    setNip07AuthFn: AuthSetter;
    setNip46AuthFn: AuthSetter;
    setParentClientAuthFn: AuthSetter;
}

export function createAuthServiceRuntime(dependencies: AuthServiceDependencies = {}): AuthServiceRuntime {
    const localStorage = dependencies.localStorage ?? (typeof window !== 'undefined' ? window.localStorage : {} as Storage);
    const clearAuthStateFn = dependencies.clearAuthState ?? clearAuthState;
    const keyManager = (dependencies.keyManager ?? new KeyManager({
        secretKeyStore: dependencies.secretKeyStore ?? secretKeyStore,
        clearAuthStateFn,
        localStorage,
    })) as AuthServiceKeyManager;
    const windowObj = dependencies.window ?? (typeof window !== 'undefined' ? window : {} as Window);
    const navigator = dependencies.navigator ?? (typeof window !== 'undefined' ? window.navigator : {} as Navigator);
    const consoleObj = dependencies.console ?? (typeof window !== 'undefined' ? window.console : {} as Console);

    return {
        localStorage,
        navigator,
        console: consoleObj,
        keyManager,
        nip46Svc: nip46Service,
        parentClientSvc: parentClientAuthService,
        setNsecAuthFn: dependencies.setNsecAuth ?? setNsecAuth,
        setNip07AuthFn: dependencies.setNip07Auth ?? setNip07Auth,
        setNip46AuthFn: dependencies.setNip46Auth ?? setNip46Auth,
        setParentClientAuthFn: dependencies.setParentClientAuth ?? setParentClientAuth,
        publicKeyState: new PublicKeyState({
            clearAuthStateFn,
        }),
        nip07Service: new Nip07AuthService(windowObj, consoleObj),
    };
}