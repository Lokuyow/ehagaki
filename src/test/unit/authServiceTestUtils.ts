import { vi } from 'vitest';
import type { AuthServiceDependencies } from '../../lib/types';
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