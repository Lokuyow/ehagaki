import { describe, expect, it, vi } from 'vitest';

import { dispatchServiceWorkerMessageRoute } from '../../lib/swMessageDispatchUtils';

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
});