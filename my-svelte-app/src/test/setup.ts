import { vi } from 'vitest';

// テスト環境の識別子を設定
(globalThis as any).__VITEST__ = true;

// Svelte runesのモック（テスト環境でのみ必要）
(globalThis as any).$state = vi.fn((initialValue: any) => {
    if (typeof initialValue === 'object' && initialValue !== null) {
        return { ...initialValue };
    }
    return initialValue;
});

(globalThis as any).$effect = vi.fn((fn: () => void) => {
    // テスト環境では即座に実行
    fn();
    return () => {}; // cleanup function
});

// DOM APIのモック
Object.defineProperty(window, 'crypto', {
    value: {
        subtle: {
            digest: vi.fn()
        }
    }
});

Object.defineProperty(window, 'localStorage', {
    value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
        key: vi.fn(),
        length: 0
    }
});
