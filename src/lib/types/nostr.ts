// --- Nostr, Auth, Relay, Profile, PostManager関連型定義 ---

import type { createRxNostr } from "rx-nostr";
import type { Editor as TipTapEditor } from "@tiptap/core";

// App Store types
export type NostrLoginAuthMethod = 'connect' | 'extension' | 'local' | undefined;

export interface AuthState {
    type: 'none' | 'nsec' | 'nostr-login';
    isAuthenticated: boolean;
    pubkey: string;
    npub: string;
    nprofile: string;
    isValid: boolean;
    isInitialized: boolean;
    isExtensionLogin?: boolean;
    nostrLoginAuthMethod?: NostrLoginAuthMethod;
    serviceWorkerReady?: boolean;
}

export interface HashtagData {
    content: string;
    hashtags: string[];
    tags: string[][];
}

// Auth-related types
export interface AuthResult {
    success: boolean;
    error?: string;
    pubkeyHex?: string;
}

export interface PublicKeyData {
    hex: string;
    npub: string;
    nprofile: string;
}

export interface NostrLoginAuth {
    type: 'login' | 'signup' | 'logout';
    pubkey?: string;
    npub?: string;
    otpData?: unknown;
}

export interface NostrLoginOptions {
    theme?: 'default' | 'ocean' | 'lemonade' | 'purple';
    bunkers?: string[];
    perms?: string;
    noBanner?: boolean;
    startScreen?: string;
    methods?: string;
}

export type NostrLoginEventHandler = (auth: NostrLoginAuth) => void;

export interface NostrLoginError {
    type: 'initialization' | 'auth' | 'launch' | 'decode';
    message: string;
    originalError?: unknown;
}

export interface NostrLoginDependencies {
    window?: Window & { nostrLogin?: any };
    document?: Document;
    console?: Console;
    setTimeout?: (callback: () => void, delay: number) => void;
    importNostrLogin?: () => Promise<{ init: Function; launch: Function }>;
}

export interface NostrLoginManagerInterface {
    isInitialized: boolean;
    init(options: NostrLoginOptions): Promise<void>;
    showLogin(): Promise<void>;
    logout(): void;
    getCurrentUser(): { pubkey?: string; npub?: string } | null;
    setAuthHandler(handler: (auth: NostrLoginAuth) => void): void;
}

export interface LocalStorageData {
    pubkey?: string;
    npub?: string;
}

export interface AuthServiceDependencies {
    keyManager?: KeyManagerInterface;
    nostrLoginManager?: NostrLoginManagerInterface;
    localStorage?: Storage;
    window?: Window;
    navigator?: Navigator;
    console?: Console;
    setTimeout?: (callback: () => void, delay: number) => void;
    setNsecAuth?: (pubkey: string, npub: string, nprofile: string) => void;
    setAuthInitialized?: () => void;
    clearAuthState?: () => void;
    setNostrLoginAuth?: (pubkey: string, npub: string, nprofile: string, nostrLoginAuthMethod?: NostrLoginAuthMethod) => void;
    secretKeyStore?: {
        value: string | null;
        set: (value: string | null) => void;
        subscribe: (callback: (value: string | null) => void) => void;
    };
    debugLog?: (...args: any[]) => void;
}

export interface KeyManagerInterface {
    getFromStore(): string | null;
    loadFromStorage(): string | null;
    isWindowNostrAvailable(): boolean;
}

export interface KeyManagerDeps {
    localStorage?: Storage;
    console?: Console;
    secretKeyStore?: {
        value: string | null;
        set: (value: string | null) => void;
    };
    window?: Window;
    setNostrLoginAuthFn?: (pubkey: string, npub: string, nprofile: string, nostrLoginAuthMethod?: NostrLoginAuthMethod) => void;
    clearAuthStateFn?: () => void;
}

export interface KeyManagerError {
    type: 'storage' | 'network' | 'validation';
    message: string;
    originalError?: unknown;
}

// Relay and Profile types
export type RelayConfig = { [url: string]: { read: boolean; write: boolean } } | string[];

export interface RelayManagerDeps {
    localStorage?: Storage;
    console?: Console;
    setTimeoutFn?: (fn: (...args: any[]) => void, ms?: number, ...args: any[]) => any;
    clearTimeoutFn?: (timeoutId: any) => void;
    relayListUpdatedStore?: {
        value: number;
        set: (value: number) => void;
    };
}

export interface RelayFetchOptions {
    forceRemote?: boolean;
    timeoutMs?: number;
}

export interface RelayFetchResult {
    success: boolean;
    relayConfig?: RelayConfig;
    source?: 'localStorage' | 'kind10002' | 'kind3' | 'fallback';
    error?: string;
}

export interface UserRelaysFetchResult {
    success: boolean;
    relayConfig: RelayConfig;
    source: 'localStorage' | 'kind10002' | 'kind3' | 'fallback';
}

// Post Manager types
export interface HashtagStore {
    hashtags: string[];
    tags: string[][];
}

// Hashtag History types
export interface HashtagHistoryEntry {
    tag: string;
    lastUsed: number;
}

export interface PostManagerDeps {
    authStateStore?: {
        value: AuthState;
    };
    hashtagStore?: HashtagStore;
    hashtagSnapshotFn?: (store: HashtagStore) => HashtagData;
    keyManager?: KeyManagerInterface;
    window?: {
        nostr?: {
            signEvent: (event: any) => Promise<any>;
        };
    };
    console?: Console;
    createImetaTagFn?: (meta: any) => Promise<string[]>;
    getClientTagFn?: () => string[] | null;
    seckeySignerFn?: (key: string) => any;
    extractContentWithImagesFn?: (editor: TipTapEditor) => string;
    extractImageBlurhashMapFn?: (editor: TipTapEditor) => Record<string, string>;
    resetEditorStateFn?: () => void;
    resetPostStatusFn?: () => void;
    iframeMessageService?: {
        notifyPostSuccess: () => boolean;
        notifyPostError: (error?: string) => boolean;
    };
    hashtagPinStore?: { value: boolean };
    saveHashtagsToHistoryFn?: (hashtags: string[]) => void;
}

// profileManager.ts から移動した型定義
export interface ProfileManagerDeps {
    localStorage?: Storage;
    navigator?: Navigator;
    setTimeoutFn?: (fn: (...args: any[]) => void, ms?: number, ...args: any[]) => any;
    clearTimeoutFn?: (timeoutId: any) => void;
    console?: Console;
    rxNostrFactory?: () => ReturnType<typeof createRxNostr>;
}

export interface ProfileData {
    name: string;
    picture: string;
    npub: string;
    nprofile: string;
    profileRelays?: string[];
}

// Global Window extensions
declare global {
    interface Window {
        nostr?: {
            getPublicKey(): Promise<string>;
            signEvent: (event: any) => Promise<any>;
        };
        nostrZap?: {
            initTargets: () => void;
        };
    }
}
