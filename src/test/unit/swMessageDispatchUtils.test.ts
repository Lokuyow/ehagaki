import { describe, expect, it, vi } from 'vitest';

import {
    dispatchServiceWorkerMessageRoute,
    processServiceWorkerMessageEvent,
} from '../../lib/swMessageDispatchUtils';
import { createMockConsole } from '../helpers';

function createProcessServiceWorkerEventDependencies() {
    return {
        skipWaiting: vi.fn(),
        logger: createMockConsole(),
        messageHandler: {
            respondSharedMedia: vi.fn(),
            respondSharedMediaForce: vi.fn(),
        },
        cacheManager: {
            clearProfileCache: vi.fn(),
            cleanupDuplicateProfileCache: vi.fn(),
            cacheCustomEmojiImages: vi.fn(),
        },
    };
}

describe('swMessageDispatchUtils', () => {
    it('type route の handler を実行する', async () => {
        const handler = vi.fn(async () => {});

        const result = await dispatchServiceWorkerMessageRoute({
            route: { kind: 'type', name: 'GET_VERSION' },
            messageHandlers: {
                GET_VERSION: handler,
            },
            actionHandlers: {},
        });

        expect(result).toBe(true);
        expect(handler).toHaveBeenCalledOnce();
    });

    it('action route の handler を実行する', async () => {
        const handler = vi.fn(async () => {});

        const result = await dispatchServiceWorkerMessageRoute({
            route: { kind: 'action', name: 'getSharedMedia' },
            messageHandlers: {},
            actionHandlers: {
                getSharedMedia: handler,
            },
        });

        expect(result).toBe(true);
        expect(handler).toHaveBeenCalledOnce();
    });

    it('unknown route では false を返す', async () => {
        const result = await dispatchServiceWorkerMessageRoute({
            route: { kind: 'action', name: 'unknown' },
            messageHandlers: {},
            actionHandlers: {},
        });

        expect(result).toBe(false);
    });

    it('processServiceWorkerMessageEvent は type message を処理する', async () => {
        const port = { postMessage: vi.fn() };
        const { skipWaiting, logger, messageHandler, cacheManager } = createProcessServiceWorkerEventDependencies();

        const result = await processServiceWorkerMessageEvent({
            event: {
                data: { type: 'GET_VERSION' },
                ports: [port],
            },
            version: '1.2.3',
            skipWaiting,
            logger,
            messageHandler,
            cacheManager,
        });

        expect(result).toBe(true);
        expect(port.postMessage).toHaveBeenCalledWith({ version: '1.2.3' });
    });

    it('processServiceWorkerMessageEvent は action message を処理する', async () => {
        const { skipWaiting, logger, messageHandler, cacheManager } = createProcessServiceWorkerEventDependencies();

        const result = await processServiceWorkerMessageEvent({
            event: {
                data: { action: 'getSharedMedia' },
            },
            version: '1.2.3',
            skipWaiting,
            logger,
            messageHandler,
            cacheManager,
        });

        expect(result).toBe(true);
        expect(messageHandler.respondSharedMedia).toHaveBeenCalledOnce();
    });

    it('processServiceWorkerMessageEvent は unknown message を処理しない', async () => {
        const { skipWaiting, logger, messageHandler, cacheManager } = createProcessServiceWorkerEventDependencies();

        const result = await processServiceWorkerMessageEvent({
            event: {
                data: { action: 'unknownAction' },
            },
            version: '1.2.3',
            skipWaiting,
            logger,
            messageHandler,
            cacheManager,
        });

        expect(result).toBe(false);
        expect(skipWaiting).not.toHaveBeenCalled();
        expect(messageHandler.respondSharedMedia).not.toHaveBeenCalled();
        expect(messageHandler.respondSharedMediaForce).not.toHaveBeenCalled();
        expect(cacheManager.clearProfileCache).not.toHaveBeenCalled();
        expect(cacheManager.cleanupDuplicateProfileCache).not.toHaveBeenCalled();
        expect(cacheManager.cacheCustomEmojiImages).not.toHaveBeenCalled();
    });
});