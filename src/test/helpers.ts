// Common test helpers and mocks

import { vi } from 'vitest';
import type { RxNostr } from 'rx-nostr';
import type { KeyManagerInterface } from '../lib/types';

// Mock Storage implementation
export class MockStorage implements Storage {
    private store: Record<string, string> = {};

    get length() { return Object.keys(this.store).length; }

    getItem(key: string): string | null {
        return this.store[key] || null;
    }

    setItem(key: string, value: string): void {
        this.store[key] = value;
    }

    removeItem(key: string): void {
        delete this.store[key];
    }

    clear(): void {
        this.store = {};
    }

    key(index: number): string | null {
        const keys = Object.keys(this.store);
        return keys[index] || null;
    }
}

// Mock RxNostr
export const createMockRxNostr = (): RxNostr => ({
    send: vi.fn(),
    use: vi.fn().mockReturnValue({
        subscribe: vi.fn()
    }),
    setDefaultRelays: vi.fn(),
    // Add other necessary methods as needed
} as any);

// Mock KeyManager
export class MockKeyManager implements KeyManagerInterface {
    constructor(
        private storedKey: string | null = null,
        private storageKey: string | null = null,
        private windowNostrAvailable = false
    ) { }

    getFromStore = vi.fn(() => this.storedKey);
    loadFromStorage = vi.fn(() => this.storageKey);
    isWindowNostrAvailable = vi.fn(() => this.windowNostrAvailable);

    // Additional methods for authService tests
    isValidNsec = vi.fn();
    saveToStorage = vi.fn();
    derivePublicKey = vi.fn();
    pubkeyToNpub = vi.fn();
    hasStoredKey = vi.fn().mockReturnValue(false);
    getPublicKeyFromWindowNostr = vi.fn();
    getStorage = vi.fn();
    getExternalAuth = vi.fn();
}

// Mock Observable helper
export function createMockObservable(nextData?: any, shouldError = false, delay = 0) {
    return {
        subscribe: vi.fn((observer) => {
            if (delay > 0) {
                setTimeout(() => {
                    if (shouldError) {
                        observer.error?.(new Error('Mock error'));
                    } else {
                        observer.next?.(nextData);
                        observer.complete?.();
                    }
                }, delay);
            } else {
                if (shouldError) {
                    observer.error?.(new Error('Mock error'));
                } else {
                    observer.next?.(nextData);
                    observer.complete?.();
                }
            }
            return { unsubscribe: vi.fn() };
        })
    };
}