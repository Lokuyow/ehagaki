import { vi } from 'vitest';

const DEFAULT_PARENT_ORIGIN_SEARCH = '?parentOrigin=https%3A%2F%2Fparent.example.com';

export interface MockWindowHarness {
    windowObj: Window;
    parent: { postMessage: ReturnType<typeof vi.fn> };
    listeners: Map<string, (event: MessageEvent) => void>;
}

export function createMockWindow(search = DEFAULT_PARENT_ORIGIN_SEARCH): MockWindowHarness {
    const listeners = new Map<string, (event: MessageEvent) => void>();
    const parent = {
        postMessage: vi.fn(),
    };

    const windowObj = {
        self: {},
        top: {},
        parent,
        location: { search },
        document: { referrer: '' },
        addEventListener: vi.fn((type: string, handler: (event: MessageEvent) => void) => {
            listeners.set(type, handler);
        }),
        removeEventListener: vi.fn((type: string) => {
            listeners.delete(type);
        }),
    } as unknown as Window;

    return { windowObj, parent, listeners };
}
