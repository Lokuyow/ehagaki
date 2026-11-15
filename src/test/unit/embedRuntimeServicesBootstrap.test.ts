import { describe, expect, it, vi } from 'vitest';

import { initializeEmbedRuntimeServices } from '../../lib/bootstrap/embedRuntimeServicesBootstrap';

function createServices(calls: string[], results: Partial<Record<string, boolean>> = {}) {
    const service = (name: string) => ({
        initialize: vi.fn((options: { locationSearch?: string }) => {
            calls.push(`${name}:${options.locationSearch}`);
            return results[name] ?? false;
        }),
    });
    return {
        parentClientAuthService: service('parentClient'),
        embedComposerContextService: service('composerContext'),
        embedSettingsService: service('settings'),
        embedStorageService: service('storage'),
        embedIndexedDbService: service('indexedDb'),
    };
}

describe('initializeEmbedRuntimeServices', () => {
    it('各サービスを同じクエリで順に初期化し、storage が有効なら IndexedDB より前に通知する', () => {
        const calls: string[] = [];
        const services = createServices(calls, { parentClient: true, storage: true });

        const result = initializeEmbedRuntimeServices({
            locationSearch: '?parentOrigin=x',
            ...services,
            onEmbedStorageReady: () => calls.push('storageReady'),
        });

        expect(result).toEqual({ parentClientAvailable: true });
        expect(calls).toEqual([
            'parentClient:?parentOrigin=x',
            'composerContext:?parentOrigin=x',
            'settings:?parentOrigin=x',
            'storage:?parentOrigin=x',
            'storageReady',
            'indexedDb:?parentOrigin=x',
        ]);
    });

    it('storage が初期化されなければ通知せず、親クライアントなしを返す', () => {
        const calls: string[] = [];
        const onEmbedStorageReady = vi.fn();

        const result = initializeEmbedRuntimeServices({
            locationSearch: '',
            ...createServices(calls),
            onEmbedStorageReady,
        });

        expect(result).toEqual({ parentClientAvailable: false });
        expect(onEmbedStorageReady).not.toHaveBeenCalled();
        expect(calls).toHaveLength(5);
    });
});
