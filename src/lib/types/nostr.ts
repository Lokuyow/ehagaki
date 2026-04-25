// --- Nostr, Auth, Relay, Profile, PostManager関連型定義 ---

import type { createRxNostr } from "rx-nostr";
import type { Editor as TipTapEditor } from "@tiptap/core";

// App Store types
export interface AuthState {
    type: 'none' | 'nsec' | 'nip07' | 'nip46' | 'parentClient';
    isAuthenticated: boolean;
    pubkey: string;
    npub: string;
    nprofile: string;
    isValid: boolean;
    isInitialized: boolean;
    isExtensionLogin?: boolean;
    serviceWorkerReady?: boolean;
}

export interface HashtagData {
    content: string;
    hashtags: string[];
    tags: string[][];
}

// NIP-46 session data
export interface Nip46SessionData {
    clientSecretKeyHex: string;
    remoteSignerPubkey: string;
    relays: string[];
    userPubkey: string;
}

export type ParentClientCapability =
    | 'signEvent'
    | 'nip44.encrypt'
    | 'nip44.decrypt';

export interface ParentClientSessionData {
    version: 1;
    pubkeyHex: string;
    parentOrigin: string;
    capabilities: ParentClientCapability[];
    connectedAt: number;
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

export interface AuthServiceDependencies {
    keyManager?: KeyManagerInterface;
    localStorage?: Storage;
    window?: Window;
    navigator?: Navigator;
    console?: Console;
    setNsecAuth?: (pubkey: string, npub: string, nprofile: string) => void;
    setNip07Auth?: (pubkey: string, npub: string, nprofile: string) => void;
    setNip46Auth?: (pubkey: string, npub: string, nprofile: string) => void;
    setParentClientAuth?: (pubkey: string, npub: string, nprofile: string) => void;
    clearAuthState?: () => void;
    secretKeyStore?: {
        value: string | null;
        set: (value: string | null) => void;
    };
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
    getNip46SignerFn?: () => any;
    getParentClientSignerFn?: () => any;
    extractContentWithImagesFn?: (editor: TipTapEditor) => string;
    extractImageBlurhashMapFn?: (editor: TipTapEditor) => Record<string, string>;
    resetEditorStateFn?: () => void;
    resetPostStatusFn?: () => void;
    iframeMessageService?: {
        notifyPostSuccess: (options?: {
            eventId?: string;
            replyToEventId?: string;
            quotedEventIds?: string[];
        }) => boolean;
        notifyPostError: (error?: string | { code: string; message?: string }) => boolean;
    };
    hashtagPinStore?: { value: boolean };
    saveHashtagsToHistoryFn?: (hashtags: string[]) => void;
    channelContextState?: { value: ChannelContextState | null };
    replyQuoteState?: { value: ReplyQuoteComposerState };
    replyQuoteService?: {
        buildReplyTags: (state: ReplyQuoteState) => string[][];
        buildQuoteTags: (state: ReplyQuoteState) => string[][];
        generateNostrUri: (eventId: string, relayHints: string[], authorPubkey?: string | null) => string;
        extractInlineQuoteTags?: (content: string) => string[][];
    };
    clearReplyQuoteFn?: () => void;
}

// マルチアカウント管理
export interface StoredAccount {
    pubkeyHex: string;
    type: 'nsec' | 'nip07' | 'nip46' | 'parentClient';
    addedAt: number;
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
    displayName: string;
    picture: string;
    npub: string;
    nprofile: string;
    profileRelays?: string[];
}

// Reply / Quote types (NIP-10, NIP-18, NIP-21)
export type ReplyQuoteMode = 'reply' | 'quote';

export interface ReplyQuoteState {
    mode: ReplyQuoteMode;
    eventId: string;
    relayHints: string[];
    authorPubkey: string | null;
    authorDisplayName: string | null;
    referencedEvent: NostrEvent | null;
    rootEventId: string | null;
    rootRelayHint: string | null;
    rootPubkey: string | null;
    loading: boolean;
    error: string | null;
}

export interface ReplyQuoteComposerState {
    reply: ReplyQuoteState | null;
    quotes: ReplyQuoteState[];
}

export interface ChannelContextState {
    eventId: string;
    relayHints: string[];
    channelRelays?: string[];
    name: string | null;
    about: string | null;
    picture: string | null;
    isMetadataLoading?: boolean;
}

export interface NostrEvent {
    id: string;
    pubkey: string;
    created_at: number;
    kind: number;
    tags: string[][];
    content: string;
    sig: string;
}

export interface ReplyQuoteQueryResult {
    reply: ReplyQuoteQueryTarget | null;
    quotes: ReplyQuoteQueryTarget[];
}

export interface ReplyQuoteQueryTarget {
    eventId: string;
    relayHints: string[];
    authorPubkey: string | null;
}

export interface ChannelContextQueryTarget {
    eventId: string;
    relayHints: string[];
    channelRelays?: string[];
    name?: string | null;
    about?: string | null;
    picture?: string | null;
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
