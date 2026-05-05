import { describe, expect, it, vi } from 'vitest';

import {
    dispatchServiceWorkerMessageRoute,
    processServiceWorkerMessageEvent,
} from '../../lib/swMessageDispatchUtils';

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

        const result = await processServiceWorkerMessageEvent({
            event: {
                data: { type: 'GET_VERSION' },
                ports: [port],
            },
            version: '1.2.3',
            skipWaiting: vi.fn(),
            logger: {
                log: vi.fn(),
                warn: vi.fn(),
                error: vi.fn(),
            },
            messageHandler: {
                respondSharedMedia: vi.fn(),
                respondSharedMediaForce: vi.fn(),
            },
            cacheManager: {
                clearProfileCache: vi.fn(),
                cleanupDuplicateProfileCache: vi.fn(),
                cacheCustomEmojiImages: vi.fn(),
            },
        });

        expect(result).toBe(true);
        expect(port.postMessage).toHaveBeenCalledWith({ version: '1.2.3' });
    });

    it('processServiceWorkerMessageEvent は action message を処理する', async () => {
        const respondSharedMedia = vi.fn();

        const result = await processServiceWorkerMessageEvent({
            event: {
                data: { action: 'getSharedMedia' },
            },
            version: '1.2.3',
            skipWaiting: vi.fn(),
            logger: {
                log: vi.fn(),
                warn: vi.fn(),
                error: vi.fn(),
            },
            messageHandler: {
                respondSharedMedia,
                respondSharedMediaForce: vi.fn(),
            },
            cacheManager: {
                clearProfileCache: vi.fn(),
                cleanupDuplicateProfileCache: vi.fn(),
                cacheCustomEmojiImages: vi.fn(),
            },
        });

        expect(result).toBe(true);
        expect(respondSharedMedia).toHaveBeenCalledOnce();
    });
});