import { vi } from 'vitest';

export type EmbedTestWindowMock = {
    windowObj: Window;
    parent: {
        postMessage: ReturnType<typeof vi.fn>;
    };
    listeners: Map<string, (event: MessageEvent) => void>;
};

const DEFAULT_EMBED_TEST_SEARCH = '?parentOrigin=https%3A%2F%2Fparent.example.com';

export function createEmbedTestWindow(
    search = DEFAULT_EMBED_TEST_SEARCH,
    options?: { documentReferrer?: string },
): EmbedTestWindowMock {
    const listeners = new Map<string, (event: MessageEvent) => void>();
    const parent = {
        postMessage: vi.fn(),
    };

    const windowObj = {
        self: {} as Window,
        top: {} as Window,
        parent,
        location: { search },
        addEventListener: vi.fn((type: string, handler: (event: MessageEvent) => void) => {
            listeners.set(type, handler);
        }),
        removeEventListener: vi.fn((type: string) => {
            listeners.delete(type);
        }),
        document: { referrer: options?.documentReferrer ?? '' },
    } as unknown as Window;

    return { windowObj, parent, listeners };
}
