import { describe, expect, it, vi } from 'vitest';

import { createMockConsole } from '../helpers';
import {
    createSharedClientUrl,
    focusAndNotifySharedClient,
    openNewSharedClientWindow,
    persistSharedMediaIfPresent,
    redirectToAvailableSharedClient,
} from '../../lib/swClientUtils';

const SHARED_CLIENT_ORIGIN = 'https://example.com';
const SHARED_CLIENT_BASE_PATH = '/ehagaki/';
const SHARED_CLIENT_URL = `${SHARED_CLIENT_ORIGIN}${SHARED_CLIENT_BASE_PATH}?shared=true`;
const SHARED_MEDIA_FIXTURE = { image: 'x' };

describe('swClientUtils', () => {
    it('createSharedClientUrl は shared=true を付けた URL を返す', () => {
        expect(createSharedClientUrl(SHARED_CLIENT_BASE_PATH, SHARED_CLIENT_ORIGIN)).toBe(
            SHARED_CLIENT_URL,
        );
    });

    it('persistSharedMediaIfPresent は cache がない時に何もしない', async () => {
        const persist = vi.fn();

        const result = await persistSharedMediaIfPresent({
            sharedCache: null,
            persist,
        });

        expect(result).toBe(false);
        expect(persist).not.toHaveBeenCalled();
    });

    it('persistSharedMediaIfPresent は成功時に callback を呼ぶ', async () => {
        const persist = vi.fn(async () => { });
        const onPersisted = vi.fn();

        const result = await persistSharedMediaIfPresent({
            sharedCache: SHARED_MEDIA_FIXTURE,
            persist,
            onPersisted,
        });

        expect(result).toBe(true);
        expect(persist).toHaveBeenCalledWith(SHARED_MEDIA_FIXTURE);
        expect(onPersisted).toHaveBeenCalledOnce();
    });

    it('persistSharedMediaIfPresent は失敗時に onError を呼ぶ', async () => {
        const error = new Error('persist failed');
        const onError = vi.fn();

        const result = await persistSharedMediaIfPresent({
            sharedCache: SHARED_MEDIA_FIXTURE,
            persist: vi.fn(async () => {
                throw error;
            }),
            onError,
        });

        expect(result).toBe(false);
        expect(onError).toHaveBeenCalledWith(error);
    });

    it('redirectToAvailableSharedClient は既存 client を優先する', async () => {
        const client = { id: 'client-1' };
        const focusAndNotifyClient = vi.fn(async () => 'focused');
        const openNewClient = vi.fn(async () => 'opened');
        const logger = createMockConsole();

        const result = await redirectToAvailableSharedClient({
            clientSet: {
                matchAll: vi.fn().mockResolvedValue([client]),
            },
            focusAndNotifyClient,
            openNewClient,
            logger,
            createErrorRedirectResponse: () => 'error',
        });

        expect(result).toBe('focused');
        expect(focusAndNotifyClient).toHaveBeenCalledWith(client);
        expect(openNewClient).not.toHaveBeenCalled();
    });

    it('focusAndNotifySharedClient は client を focus して shared media を通知する', async () => {
        const client = {
            id: 'client-1',
            focus: vi.fn(),
            postMessage: vi.fn(),
        };
        const persistSharedMedia = vi.fn(async () => { });
        const logger = createMockConsole();

        const result = await focusAndNotifySharedClient({
            client,
            sharedCache: SHARED_MEDIA_FIXTURE,
            persistSharedMedia,
            logger,
            createRedirectResponse: () => 'redirected',
        });

        expect(result).toBe('redirected');
        expect(persistSharedMedia).toHaveBeenCalledWith(SHARED_MEDIA_FIXTURE);
        expect(client.focus).toHaveBeenCalledTimes(1);
        expect(client.postMessage).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'SHARED_MEDIA',
                data: SHARED_MEDIA_FIXTURE,
                requestId: expect.stringMatching(/^sw-/),
            }),
        );
    });

    it('openNewSharedClientWindow は shared=true 付き URL を開く', async () => {
        const openWindow = vi.fn(async () => { });
        const logger = createMockConsole();

        const result = await openNewSharedClientWindow({
            sharedCache: SHARED_MEDIA_FIXTURE,
            persistSharedMedia: vi.fn(async () => { }),
            logger,
            basePath: SHARED_CLIENT_BASE_PATH,
            origin: SHARED_CLIENT_ORIGIN,
            openWindow,
            createRedirectResponse: () => 'redirected',
        });

        expect(result).toBe('redirected');
        expect(openWindow).toHaveBeenCalledWith(SHARED_CLIENT_URL);
    });
});
