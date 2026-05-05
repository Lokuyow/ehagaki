import { describe, expect, it, vi } from 'vitest';
import {
    createServiceWorkerActionHandlers,
    createServiceWorkerTypeMessageHandlers,
} from '../../lib/swMessageHandlerFactories';

describe('swMessageHandlerFactories', () => {
    it('creates type handlers that skip waiting and post version responses', async () => {
        const postMessage = vi.fn();
        const skipWaiting = vi.fn();
        const logger = {
            log: vi.fn(),
            warn: vi.fn(),
            error: vi.fn(),
        };
        const event = {
            ports: [{ postMessage }],
        };

        const handlers = createServiceWorkerTypeMessageHandlers({
            event,
            version: '1.2.3',
            skipWaiting,
            logger,
        });

        await handlers.SKIP_WAITING?.();
        await handlers.GET_VERSION?.();

        expect(skipWaiting).toHaveBeenCalledTimes(1);
        expect(logger.log).toHaveBeenCalledWith('SW received SKIP_WAITING, updating...');
        expect(postMessage).toHaveBeenCalledWith({ version: '1.2.3' });
    });

    it('creates ping handlers that respond through source channels', async () => {
        const postMessage = vi.fn();
        const logger = {
            log: vi.fn(),
            warn: vi.fn(),
            error: vi.fn(),
        };

        const handlers = createServiceWorkerTypeMessageHandlers({
            event: {
                source: { postMessage },
            },
            version: '9.9.9',
            skipWaiting: vi.fn(),
            logger,
            createPingTest: (version) => ({ type: 'PONG', timestamp: 123, version }),
        });

        await handlers.PING_TEST?.();

        expect(postMessage).toHaveBeenCalledWith({
            type: 'PONG',
            timestamp: 123,
            version: '9.9.9',
        });
        expect(logger.log).toHaveBeenCalledWith('SW: PING_TEST responded via source');
    });

    it('warns when ping handlers have no available response channel', async () => {
        const logger = {
            log: vi.fn(),
            warn: vi.fn(),
            error: vi.fn(),
        };

        const handlers = createServiceWorkerTypeMessageHandlers({
            event: {},
            version: '0.0.1',
            skipWaiting: vi.fn(),
            logger,
            createPingTest: (version) => ({ type: 'PONG', timestamp: 1, version }),
        });

        await handlers.PING_TEST?.();

        expect(logger.warn).toHaveBeenCalledWith('SW: PING_TEST no response channel available');
    });

    it('creates action handlers for shared media and cache actions', async () => {
        const postMessage = vi.fn();
        const messageHandler = {
            respondSharedMedia: vi.fn(),
            respondSharedMediaForce: vi.fn(),
        };
        const cacheManager = {
            clearProfileCache: vi.fn().mockResolvedValue({ success: true }),
            cleanupDuplicateProfileCache: vi.fn().mockResolvedValue({ success: true, deletedCount: 2 }),
            cacheCustomEmojiImages: vi.fn().mockResolvedValue({ success: true, cached: 1, failed: 0 }),
        };
        const event = {
            data: {
                urls: ['https://example.com/emoji.webp'],
            },
            ports: [{ postMessage }],
        };

        const handlers = createServiceWorkerActionHandlers({
            event,
            messageHandler,
            cacheManager,
        });

        await handlers.getSharedMedia?.();
        await handlers.getSharedMediaForce?.();
        await handlers.clearProfileCache?.();
        await handlers.cleanupDuplicateProfileCache?.();
        await handlers.cacheCustomEmojiImages?.();

        expect(messageHandler.respondSharedMedia).toHaveBeenCalledWith(event);
        expect(messageHandler.respondSharedMediaForce).toHaveBeenCalledWith(event);
        expect(cacheManager.clearProfileCache).toHaveBeenCalledTimes(1);
        expect(cacheManager.cleanupDuplicateProfileCache).toHaveBeenCalledTimes(1);
        expect(cacheManager.cacheCustomEmojiImages).toHaveBeenCalledWith([
            'https://example.com/emoji.webp',
        ]);
        expect(postMessage).toHaveBeenNthCalledWith(1, { success: true });
        expect(postMessage).toHaveBeenNthCalledWith(2, { success: true, deletedCount: 2 });
        expect(postMessage).toHaveBeenNthCalledWith(3, { success: true, cached: 1, failed: 0 });
    });
});