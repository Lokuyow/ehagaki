import { describe, expect, it, vi } from 'vitest';

import {
    processServiceWorkerActivate,
    processServiceWorkerInstall,
} from '../../lib/swLifecycleUtils';

describe('swLifecycleUtils', () => {
    it('processServiceWorkerInstall は install log を出す', async () => {
        const logger = { log: vi.fn() };

        await processServiceWorkerInstall({
            logger,
            version: '1.2.3',
            installPrecache: async () => {},
        });

        expect(logger.log).toHaveBeenCalledWith('SW installing...', '1.2.3');
        expect(logger.log).toHaveBeenCalledWith('SW installed, waiting for user action');
    });

    it('does not report installed before precache saves complete', async () => {
        const logger = { log: vi.fn() };
        let complete!: () => void;
        const precache = new Promise<void>((resolve) => { complete = resolve; });
        const installation = processServiceWorkerInstall({
            logger,
            version: '1.2.3',
            installPrecache: () => precache,
        });
        expect(logger.log).toHaveBeenCalledTimes(1);
        complete();
        await installation;
        expect(logger.log).toHaveBeenLastCalledWith('SW installed, waiting for user action');
    });

    it('propagates a failed precache installation without reporting installed', async () => {
        const logger = { log: vi.fn() };
        const error = new Error('precache failed');
        await expect(processServiceWorkerInstall({
            logger,
            version: '1.2.3',
            installPrecache: async () => { throw error; },
        })).rejects.toBe(error);
        expect(logger.log).toHaveBeenCalledTimes(1);
    });

    it('processServiceWorkerActivate は cleanup と claim を順に実行する', async () => {
        const logger = { log: vi.fn() };
        const cleanupOldCaches = vi.fn(async () => undefined);
        const claimClients = vi.fn(async () => undefined);

        await processServiceWorkerActivate({
            logger,
            version: '1.2.3',
            cleanupOldCaches,
            claimClients,
        });

        expect(logger.log).toHaveBeenCalledWith('SW activating...', '1.2.3');
        expect(cleanupOldCaches).toHaveBeenCalledOnce();
        expect(claimClients).toHaveBeenCalledOnce();
    });
});
