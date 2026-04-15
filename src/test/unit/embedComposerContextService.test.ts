import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EMBED_MESSAGE_NAMESPACE } from '../../lib/embedProtocol';
import { EmbedComposerContextService } from '../../lib/embedComposerContextService';

function createMockWindow(search = '?parentOrigin=https%3A%2F%2Fparent.example.com') {
    const listeners = new Map<string, (event: MessageEvent) => void>();
    const parent = {
        postMessage: vi.fn(),
    };

    const windowObj = {
        self: {},
        top: {},
        parent,
        location: { search },
        addEventListener: vi.fn((type: string, handler: (event: MessageEvent) => void) => {
            listeners.set(type, handler);
        }),
        removeEventListener: vi.fn((type: string) => {
            listeners.delete(type);
        }),
    } as unknown as Window;

    return { windowObj, parent, listeners };
}

describe('EmbedComposerContextService', () => {
    let mockConsole: Console;

    beforeEach(() => {
        mockConsole = {
            log: vi.fn(),
            warn: vi.fn(),
            error: vi.fn(),
        } as unknown as Console;
    });

    it('composer.setContext を受け取ると listener を呼ぶ', () => {
        const { windowObj, parent, listeners } = createMockWindow();
        const service = new EmbedComposerContextService(windowObj, mockConsole);
        const onRemoteSetContext = vi.fn();
        service.onRemoteSetContext(onRemoteSetContext);
        service.initialize();

        listeners.get('message')?.({
            data: {
                namespace: EMBED_MESSAGE_NAMESPACE,
                version: 1,
                type: 'composer.setContext',
                requestId: 'composer-request-1',
                payload: {
                    reply: 'note1424242424242424242424242424242424242424242424242424qv3q9y6',
                    quotes: [],
                    content: 'runtime content',
                },
            },
            origin: 'https://parent.example.com',
            source: parent,
        } as unknown as MessageEvent);

        expect(onRemoteSetContext).toHaveBeenCalledWith(
            {
                reply: 'note1424242424242424242424242424242424242424242424242424qv3q9y6',
                quotes: [],
                content: 'runtime content',
            },
            'composer-request-1',
        );
    });

    it('composer.clearContext を受け取ると clear listener を呼ぶ', () => {
        const { windowObj, parent, listeners } = createMockWindow();
        const service = new EmbedComposerContextService(windowObj, mockConsole);
        const onRemoteClearContext = vi.fn();
        service.onRemoteClearContext(onRemoteClearContext);
        service.initialize();

        listeners.get('message')?.({
            data: {
                namespace: EMBED_MESSAGE_NAMESPACE,
                version: 1,
                type: 'composer.clearContext',
                requestId: 'composer-request-2',
            },
            origin: 'https://parent.example.com',
            source: parent,
        } as unknown as MessageEvent);

        expect(onRemoteClearContext).toHaveBeenCalledWith('composer-request-2');
    });

    it('origin が一致しないメッセージは無視する', () => {
        const { windowObj, parent, listeners } = createMockWindow();
        const service = new EmbedComposerContextService(windowObj, mockConsole);
        const onRemoteSetContext = vi.fn();
        service.onRemoteSetContext(onRemoteSetContext);
        service.initialize();

        listeners.get('message')?.({
            data: {
                namespace: EMBED_MESSAGE_NAMESPACE,
                version: 1,
                type: 'composer.setContext',
                payload: {
                    reply: 'note1424242424242424242424242424242424242424242424242424qv3q9y6',
                },
            },
            origin: 'https://other.example.com',
            source: parent,
        } as unknown as MessageEvent);

        expect(onRemoteSetContext).not.toHaveBeenCalled();
    });

    it('不正な content を含む composer.setContext は無視する', () => {
        const { windowObj, parent, listeners } = createMockWindow();
        const service = new EmbedComposerContextService(windowObj, mockConsole);
        const onRemoteSetContext = vi.fn();
        service.onRemoteSetContext(onRemoteSetContext);
        service.initialize();

        listeners.get('message')?.({
            data: {
                namespace: EMBED_MESSAGE_NAMESPACE,
                version: 1,
                type: 'composer.setContext',
                payload: {
                    content: 123,
                },
            },
            origin: 'https://parent.example.com',
            source: parent,
        } as unknown as MessageEvent);

        expect(onRemoteSetContext).not.toHaveBeenCalled();
    });
});