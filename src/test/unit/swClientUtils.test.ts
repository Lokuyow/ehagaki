import { describe, expect, it, vi } from 'vitest';

import {
    createSharedClientUrl,
    focusAndNotifySharedClient,
    openNewSharedClientWindow,
    persistSharedMediaIfPresent,
    redirectToAvailableSharedClient,
} from '../../lib/swClientUtils';

describe('swClientUtils', () => {
    it('createSharedClientUrl は shared=true を付けた URL を返す', () => {
        expect(createSharedClientUrl('/ehagaki/', 'https://example.com')).toBe(
            'https://example.com/ehagaki/?shared=true',
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
            sharedCache: { image: 'x' },
            persist,
            onPersisted,
        });

        expect(result).toBe(true);
        expect(persist).toHaveBeenCalledWith({ image: 'x' });
        expect(onPersisted).toHaveBeenCalledOnce();
    });

    it('persistSharedMediaIfPresent は失敗時に onError を呼ぶ', async () => {
        const error = new Error('persist failed');
        const onError = vi.fn();

        const result = await persistSharedMediaIfPresent({
            sharedCache: { image: 'x' },
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

        const result = await redirectToAvailableSharedClient({
            clientSet: {
                matchAll: vi.fn().mockResolvedValue([client]),
            },
            focusAndNotifyClient,
            openNewClient,
            logger: {
                log: vi.fn(),
                warn: vi.fn(),
                error: vi.fn(),
            },
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

        const result = await focusAndNotifySharedClient({
            client,
            sharedCache: { image: 'x' },
            persistSharedMedia,
            logger: {
                log: vi.fn(),
                warn: vi.fn(),
                error: vi.fn(),
            },
            createRedirectResponse: () => 'redirected',
        });

        expect(result).toBe('redirected');
        expect(persistSharedMedia).toHaveBeenCalledWith({ image: 'x' });
        expect(client.focus).toHaveBeenCalledTimes(1);
        expect(client.postMessage).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'SHARED_MEDIA',
                data: { image: 'x' },
                requestId: expect.stringMatching(/^sw-/),
            }),
        );
    });

    it('openNewSharedClientWindow は shared=true 付き URL を開く', async () => {
        const openWindow = vi.fn(async () => { });

        const result = await openNewSharedClientWindow({
            sharedCache: { image: 'x' },
            persistSharedMedia: vi.fn(async () => { }),
            logger: {
                log: vi.fn(),
                warn: vi.fn(),
                error: vi.fn(),
            },
            basePath: '/ehagaki/',
            origin: 'https://example.com',
            openWindow,
            createRedirectResponse: () => 'redirected',
        });

        expect(result).toBe('redirected');
        expect(openWindow).toHaveBeenCalledWith('https://example.com/ehagaki/?shared=true');
    });
});