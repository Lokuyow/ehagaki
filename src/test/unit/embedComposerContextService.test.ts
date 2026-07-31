import { beforeEach, describe, expect, it } from 'vitest';
import { EMBED_MESSAGE_NAMESPACE } from '../../lib/embedProtocol';
import { EmbedComposerContextService } from '../../lib/embedComposerContextService';
import { createEmbedTestWindow, createMockConsole, type MockConsole } from '../helpers';

describe('EmbedComposerContextService', () => {
    let mockConsole: MockConsole;

    beforeEach(() => {
        mockConsole = createMockConsole();
    });

    it('composer.setContext を受け取ると listener を呼ぶ', () => {
        const { windowObj, parent, listeners } = createEmbedTestWindow();
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

    it('quotes が null の composer.setContext を受け取ると listener を呼ぶ', () => {
        const { windowObj, parent, listeners } = createEmbedTestWindow();
        const service = new EmbedComposerContextService(windowObj, mockConsole);
        const onRemoteSetContext = vi.fn();
        service.onRemoteSetContext(onRemoteSetContext);
        service.initialize();

        listeners.get('message')?.({
            data: {
                namespace: EMBED_MESSAGE_NAMESPACE,
                version: 1,
                type: 'composer.setContext',
                requestId: 'composer-request-2',
                payload: {
                    reply: null,
                    quotes: null,
                },
            },
            origin: 'https://parent.example.com',
            source: parent,
        } as unknown as MessageEvent);

        expect(onRemoteSetContext).toHaveBeenCalledWith(
            {
                reply: null,
                quotes: null,
            },
            'composer-request-2',
        );
    });

    it('origin が一致しないメッセージは無視する', () => {
        const { windowObj, parent, listeners } = createEmbedTestWindow();
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

    it('有効requestIdの不正payloadもControllerがerror ackできるようlistenerへ渡す', () => {
        const { windowObj, parent, listeners } = createEmbedTestWindow();
        const service = new EmbedComposerContextService(windowObj, mockConsole);
        const onRemoteSetContext = vi.fn();
        service.onRemoteSetContext(onRemoteSetContext);
        service.initialize();

        listeners.get('message')?.({
            data: {
                namespace: EMBED_MESSAGE_NAMESPACE,
                version: 1,
                type: 'composer.setContext',
                requestId: 'invalid-payload-1',
                payload: {
                    content: 123,
                },
            },
            origin: 'https://parent.example.com',
            source: parent,
        } as unknown as MessageEvent);

        expect(onRemoteSetContext).toHaveBeenCalledWith(
            { content: 123 },
            'invalid-payload-1',
        );
    });

    it('requestId がない composer.setContext は無視する', () => {
        const { windowObj, parent, listeners } = createEmbedTestWindow();
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
                    reply: null,
                    quotes: [],
                },
            },
            origin: 'https://parent.example.com',
            source: parent,
        } as unknown as MessageEvent);

        expect(onRemoteSetContext).not.toHaveBeenCalled();
        expect(mockConsole.warn).toHaveBeenCalled();
    });
});
