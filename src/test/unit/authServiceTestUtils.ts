import { vi } from 'vitest';
import type { AuthServiceDependencies, Nip46SessionData, ParentClientSessionData } from '../../lib/types';
import { MockStorage, MockKeyManager } from '../helpers';

export function createMockDependencies(): AuthServiceDependencies {
    return {
        keyManager: new MockKeyManager() as any,
        localStorage: new MockStorage(),
        window: {
            location: { pathname: '/' },
        } as Window,
        navigator: {
            serviceWorker: {
                controller: {
                    postMessage: vi.fn(),
                },
            },
        } as unknown as Navigator,
        console: {
            log: vi.fn(),
            error: vi.fn(),
            warn: vi.fn(),
        } as unknown as Console,
        setNsecAuth: vi.fn(),
        setNip07Auth: vi.fn(),
        setNip46Auth: vi.fn(),
        setParentClientAuth: vi.fn(),
    };
}

export function createMockNip07Window(pubkeyHex: string): Window {
    return {
        nostr: {
            getPublicKey: vi.fn().mockResolvedValue(pubkeyHex),
            signEvent: vi.fn(),
        },
    } as unknown as Window;
}

export function createMockNip07Dependencies(
    pubkeyHex: string,
    dependencies: AuthServiceDependencies = createMockDependencies(),
): AuthServiceDependencies {
    return {
        ...dependencies,
        window: createMockNip07Window(pubkeyHex),
    };
}

export function createMockNip46Session(
    pubkeyHex: string,
    overrides: Partial<Nip46SessionData> = {},
): Nip46SessionData {
    return {
        clientSecretKeyHex: 'abc',
        remoteSignerPubkey: 'remote',
        relays: ['wss://relay'],
        userPubkey: pubkeyHex,
        ...overrides,
    };
}

export function createMockParentClientSession(
    pubkeyHex: string,
    overrides: Partial<ParentClientSessionData> = {},
): ParentClientSessionData {
    return {
        version: 1,
        pubkeyHex,
        parentOrigin: 'https://parent.example.com',
        capabilities: ['signEvent'],
        connectedAt: Date.now(),
        ...overrides,
    };
}

export function createMockAccountManager(overrides: Record<string, unknown> = {}) {
    return {
        addAccount: vi.fn(),
        getAccountType: vi.fn(),
        removeAccount: vi.fn(),
        cleanupAccountData: vi.fn(),
        cleanupNostrLoginData: vi.fn(),
        getActiveAccountPubkey: vi.fn().mockReturnValue(null),
        getAccounts: vi.fn().mockReturnValue([]),
        setActiveAccount: vi.fn(),
        migrateFromSingleAccount: vi.fn(),
        hasAccount: vi.fn(),
        ...overrides,
    };
}