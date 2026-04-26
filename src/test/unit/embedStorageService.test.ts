import { beforeEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEYS } from '../../lib/constants';
import {
    EMBED_MESSAGE_NAMESPACE,
    EMBED_MESSAGE_VERSION,
} from '../../lib/embedProtocol';
import { EmbedStorageService } from '../../lib/embedStorageService';
import { MockStorage } from '../helpers';

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
    } as unknown as Window;

    return { windowObj, parent, listeners };
}

describe('EmbedStorageService', () => {
    let mockConsole: Console;

    beforeEach(() => {
        mockConsole = {
            log: vi.fn(),
            warn: vi.fn(),
            error: vi.fn(),
        } as unknown as Console;
    });

    it('iframe と parentOrigin がない場合は初期化しない', () => {
        const { windowObj } = createMockWindow('');
        const service = new EmbedStorageService(windowObj, mockConsole);

        expect(service.initialize()).toBe(false);
    });

    it('storage.get を送信し、storage.result を返す', async () => {
        const { windowObj, parent, listeners } = createMockWindow();
        const service = new EmbedStorageService(windowObj, mockConsole);
        service.initialize();

        const pending = service.get([STORAGE_KEYS.LOCALE, 'nostr-secret-key']);
        const sentMessage = parent.postMessage.mock.calls[0][0];

        expect(sentMessage).toMatchObject({
            namespace: EMBED_MESSAGE_NAMESPACE,
            version: EMBED_MESSAGE_VERSION,
            type: 'storage.get',
            payload: { keys: [STORAGE_KEYS.LOCALE] },
        });
        expect(parent.postMessage.mock.calls[0][1]).toBe('https://parent.example.com');

        listeners.get('message')?.({
            data: {
                namespace: EMBED_MESSAGE_NAMESPACE,
                version: EMBED_MESSAGE_VERSION,
                type: 'storage.result',
                requestId: sentMessage.requestId,
                payload: {
                    timestamp: Date.now(),
                    values: {
                        [STORAGE_KEYS.LOCALE]: 'en',
                    },
                },
            },
            origin: 'https://parent.example.com',
            source: parent,
        } as unknown as MessageEvent);

        await expect(pending).resolves.toMatchObject({
            values: {
                [STORAGE_KEYS.LOCALE]: 'en',
            },
        });
    });

    it('origin が一致しない storage.result は無視して timeout する', async () => {
        const { windowObj, parent, listeners } = createMockWindow();
        const service = new EmbedStorageService(windowObj, mockConsole, 10);
        service.initialize();

        const pending = service.get([STORAGE_KEYS.THEME_MODE]);
        const sentMessage = parent.postMessage.mock.calls[0][0];

        listeners.get('message')?.({
            data: {
                namespace: EMBED_MESSAGE_NAMESPACE,
                version: EMBED_MESSAGE_VERSION,
                type: 'storage.result',
                requestId: sentMessage.requestId,
                payload: {
                    timestamp: Date.now(),
                    values: {
                        [STORAGE_KEYS.THEME_MODE]: 'dark',
                    },
                },
            },
            origin: 'https://other.example.com',
            source: parent,
        } as unknown as MessageEvent);

        await expect(pending).rejects.toMatchObject({
            code: 'storage_request_timeout',
        });
    });

    it('localStorage の値と削除状態を親へ保存要求する', () => {
        const { windowObj, parent } = createMockWindow();
        const storage = new MockStorage();
        storage.setItem(STORAGE_KEYS.THEME_MODE, 'dark');

        const service = new EmbedStorageService(windowObj, mockConsole);
        service.initialize();
        service.persistLocalStorageKeys(
            [STORAGE_KEYS.THEME_MODE, STORAGE_KEYS.DARK_MODE, 'nostr-drafts'],
            storage,
        );

        expect(parent.postMessage).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
                type: 'storage.set',
                payload: {
                    values: {
                        [STORAGE_KEYS.THEME_MODE]: 'dark',
                    },
                },
            }),
            'https://parent.example.com',
        );
        expect(parent.postMessage).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({
                type: 'storage.remove',
                payload: {
                    keys: [STORAGE_KEYS.DARK_MODE],
                },
            }),
            'https://parent.example.com',
        );
    });

    it('親 snapshot は allow-list の非 null 値だけ localStorage に反映する', () => {
        const storage = new MockStorage();
        const service = new EmbedStorageService({} as Window, mockConsole);

        const applied = service.applySnapshotToLocalStorage(
            {
                [STORAGE_KEYS.LOCALE]: 'ja',
                [STORAGE_KEYS.THEME_MODE]: null,
                'nostr-secret-key': 'secret',
            },
            storage,
        );

        expect(applied).toEqual([STORAGE_KEYS.LOCALE]);
        expect(storage.getItem(STORAGE_KEYS.LOCALE)).toBe('ja');
        expect(storage.getItem(STORAGE_KEYS.THEME_MODE)).toBeNull();
        expect(storage.getItem('nostr-secret-key')).toBeNull();
    });
});
