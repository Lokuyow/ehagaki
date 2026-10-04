import { beforeEach, describe, expect, it } from 'vitest';
import { STORAGE_KEYS } from '../../lib/constants';
import {
    EMBED_MESSAGE_NAMESPACE,
    EMBED_MESSAGE_VERSION,
} from '../../lib/embedProtocol';
import { EmbedStorageService } from '../../lib/embedStorageService';
import { EMBED_SETTING_STORAGE_KEYS, EMBED_STORAGE_KEYS, EMBED_STORAGE_OPTIONAL_KEYS } from '../../lib/embedStorageKeys';
import { createMockConsole, type MockConsole, MockStorage } from '../helpers';
import { createMockWindow } from '../embedWindowTestUtils';

describe('EmbedStorageService', () => {
    let mockConsole: MockConsole;

    beforeEach(() => {
        mockConsole = createMockConsole();
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

    it('追加 key を無視する strict v1 Host でも既存 snapshot を取得する', async () => {
        const { windowObj, parent, listeners } = createMockWindow();
        const service = new EmbedStorageService(windowObj, mockConsole, 10);
        service.initialize();

        const pending = service.get([
            STORAGE_KEYS.ACCENT_COLOR,
            STORAGE_KEYS.BASE_COLOR,
            STORAGE_KEYS.FAIL_CLOSED_CONTENT_WARNING,
        ]);
        const legacyRequest = parent.postMessage.mock.calls.find(([message]) =>
            message.type === 'storage.get' && message.payload.keys.includes(STORAGE_KEYS.ACCENT_COLOR),
        )?.[0];
        const optionalRequest = parent.postMessage.mock.calls.find(([message]) =>
            message.type === 'storage.get' && message.payload.keys.includes(STORAGE_KEYS.FAIL_CLOSED_CONTENT_WARNING),
        )?.[0];
        expect(legacyRequest.payload.keys).toEqual([STORAGE_KEYS.ACCENT_COLOR, STORAGE_KEYS.BASE_COLOR]);
        expect(optionalRequest.payload.keys).toEqual([STORAGE_KEYS.FAIL_CLOSED_CONTENT_WARNING]);

        listeners.get('message')?.({
            data: {
                namespace: EMBED_MESSAGE_NAMESPACE,
                version: EMBED_MESSAGE_VERSION,
                type: 'storage.result',
                requestId: legacyRequest.requestId,
                payload: {
                    timestamp: Date.now(),
                    values: {
                        [STORAGE_KEYS.ACCENT_COLOR]: '#112233',
                        [STORAGE_KEYS.BASE_COLOR]: '#223344',
                    },
                },
            },
            origin: 'https://parent.example.com',
            source: parent,
        } as unknown as MessageEvent);

        await expect(pending).resolves.toMatchObject({
            values: {
                [STORAGE_KEYS.ACCENT_COLOR]: '#112233',
                [STORAGE_KEYS.BASE_COLOR]: '#223344',
            },
        });
    });

    it('strict v1 Host の追加 key 拒否で既存 key の persist/remove を失わない', async () => {
        const { windowObj, parent, listeners } = createMockWindow();
        const service = new EmbedStorageService(windowObj, mockConsole);
        service.initialize();

        const setPending = service.set({
            [STORAGE_KEYS.ACCENT_COLOR]: '#112233',
            [STORAGE_KEYS.FAIL_CLOSED_CONTENT_WARNING]: 'true',
        });
        const setRequests = parent.postMessage.mock.calls.map(([message]) => message);
        expect(setRequests.map((message) => message.payload)).toEqual([
            { values: { [STORAGE_KEYS.ACCENT_COLOR]: '#112233' } },
            { values: { [STORAGE_KEYS.FAIL_CLOSED_CONTENT_WARNING]: 'true' } },
        ]);
        const respond = (message: any, type: 'storage.result' | 'storage.error', payload: unknown) => {
            listeners.get('message')?.({
                data: {
                    namespace: EMBED_MESSAGE_NAMESPACE,
                    version: EMBED_MESSAGE_VERSION,
                    type,
                    requestId: message.requestId,
                    payload: type === 'storage.result'
                        ? { timestamp: Date.now(), ...payload as object }
                        : { timestamp: Date.now(), code: 'unsupported_key' },
                },
                origin: 'https://parent.example.com',
                source: parent,
            } as unknown as MessageEvent);
        };
        respond(setRequests[0], 'storage.result', { applied: [STORAGE_KEYS.ACCENT_COLOR] });
        respond(setRequests[1], 'storage.error', {});
        await expect(setPending).resolves.toMatchObject({ applied: [STORAGE_KEYS.ACCENT_COLOR] });

        const removePending = service.remove([
            STORAGE_KEYS.BASE_COLOR,
            STORAGE_KEYS.FAIL_CLOSED_CONTENT_WARNING,
        ]);
        const removeRequests = parent.postMessage.mock.calls.slice(2).map(([message]) => message);
        expect(removeRequests.map((message) => message.payload)).toEqual([
            { keys: [STORAGE_KEYS.BASE_COLOR] },
            { keys: [STORAGE_KEYS.FAIL_CLOSED_CONTENT_WARNING] },
        ]);
        respond(removeRequests[0], 'storage.result', { removed: [STORAGE_KEYS.BASE_COLOR] });
        respond(removeRequests[1], 'storage.error', {});
        await expect(removePending).resolves.toMatchObject({ removed: [STORAGE_KEYS.BASE_COLOR] });
    });

    it('新 Host では追加 key を get / set / remove できる', async () => {
        const { windowObj, parent, listeners } = createMockWindow();
        const service = new EmbedStorageService(windowObj, mockConsole);
        service.initialize();
        const key = STORAGE_KEYS.FAIL_CLOSED_CONTENT_WARNING;
        expect(EMBED_STORAGE_OPTIONAL_KEYS).toContain(key);

        const sendResult = (message: any, payload: unknown) => listeners.get('message')?.({
            data: {
                namespace: EMBED_MESSAGE_NAMESPACE,
                version: EMBED_MESSAGE_VERSION,
                type: 'storage.result',
                requestId: message.requestId,
                payload: { timestamp: Date.now(), ...payload as object },
            },
            origin: 'https://parent.example.com',
            source: parent,
        } as unknown as MessageEvent);
        const latestRequest = () => {
            const latest = parent.postMessage.mock.calls.at(-1)?.[0];
            if (!latest) throw new Error('expected a storage request');
            return latest;
        };

        const setPending = service.set({ [key]: 'true' });
        sendResult(latestRequest(), { applied: [key] });
        await expect(setPending).resolves.toMatchObject({ applied: [key] });

        const getPending = service.get([key]);
        sendResult(latestRequest(), { values: { [key]: 'true' } });
        const snapshot = await getPending;
        const storage = new MockStorage();
        expect(service.applySnapshotToLocalStorage(snapshot.values, storage)).toEqual([key]);
        expect(storage.getItem(key)).toBe('true');

        const removePending = service.remove([key]);
        sendResult(latestRequest(), { removed: [key] });
        await expect(removePending).resolves.toMatchObject({ removed: [key] });
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

    it('sourceまたはenvelopeが不正なresponseではpendingを消費しない', async () => {
        const { windowObj, parent, listeners } = createMockWindow();
        const service = new EmbedStorageService(windowObj, mockConsole);
        service.initialize();

        const pending = service.get([STORAGE_KEYS.THEME_MODE]);
        const sentMessage = parent.postMessage.mock.calls[0][0];
        const response = {
            namespace: EMBED_MESSAGE_NAMESPACE,
            version: EMBED_MESSAGE_VERSION,
            type: 'storage.result',
            requestId: sentMessage.requestId,
            payload: {
                timestamp: Date.now(),
                values: { [STORAGE_KEYS.THEME_MODE]: 'dark' },
            },
        };

        listeners.get('message')?.({
            data: response,
            origin: 'https://parent.example.com',
            source: {},
        } as unknown as MessageEvent);
        listeners.get('message')?.({
            data: { ...response, namespace: 'other.embed' },
            origin: 'https://parent.example.com',
            source: parent,
        } as unknown as MessageEvent);
        listeners.get('message')?.({
            data: { ...response, type: 'settings.set' },
            origin: 'https://parent.example.com',
            source: parent,
        } as unknown as MessageEvent);
        listeners.get('message')?.({
            data: response,
            origin: 'https://parent.example.com',
            source: parent,
        } as unknown as MessageEvent);

        await expect(pending).resolves.toMatchObject({
            values: { [STORAGE_KEYS.THEME_MODE]: 'dark' },
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

    it('Footer shortcut preference はstorage委譲を許可し、settings.setの設定対象には含めない', () => {
        expect(EMBED_STORAGE_KEYS).toContain(STORAGE_KEYS.FOOTER_SETTING_SHORTCUTS);
        expect(EMBED_SETTING_STORAGE_KEYS).not.toContain(STORAGE_KEYS.FOOTER_SETTING_SHORTCUTS);
        expect(EMBED_STORAGE_KEYS).not.toContain('nostr-secret-key');
    });

    it('fail-closed CW preference は既存のembed設定storage委譲を使う', () => {
        expect(EMBED_SETTING_STORAGE_KEYS).toContain(STORAGE_KEYS.FAIL_CLOSED_CONTENT_WARNING);
        expect(EMBED_STORAGE_KEYS).toContain(STORAGE_KEYS.FAIL_CLOSED_CONTENT_WARNING);
    });
});
