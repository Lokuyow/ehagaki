import { describe, expect, it, vi } from 'vitest';

import {
    createActivateEventListener,
    createFetchEventListener,
    createInstallEventListener,
    createMessageEventListener,
    registerServiceWorkerEventListeners,
    type ServiceWorkerFetchEventLike,
    type ServiceWorkerLifecycleEventLike,
    type ServiceWorkerMessageEventLike,
} from '../../lib/swListenerUtils';

describe('swListenerUtils', () => {
    it('createInstallEventListener は waitUntil に handler を渡す', () => {
        const promise = Promise.resolve();
        const waitUntil = vi.fn();

        createInstallEventListener(vi.fn(async () => { }))({
            waitUntil,
        } as ServiceWorkerLifecycleEventLike);

        expect(waitUntil).toHaveBeenCalledTimes(1);
        expect(waitUntil.mock.calls[0][0]).toBeInstanceOf(Promise);
    });

    it('createActivateEventListener は waitUntil に handler を渡す', () => {
        const waitUntil = vi.fn();

        createActivateEventListener(vi.fn(async () => { }))({
            waitUntil,
        } as ServiceWorkerLifecycleEventLike);

        expect(waitUntil).toHaveBeenCalledTimes(1);
    });

    it('createFetchEventListener は route がある時だけ respondWith する', () => {
        const respondWith = vi.fn();
        const handleFetch = vi.fn(async () => new Response(null, { status: 200 }));
        const request = new Request('https://example.com/upload', { method: 'POST' });

        const listener = createFetchEventListener({
            handleFetch,
            currentOrigin: 'https://example.com',
            isUploadRequest: vi.fn(() => true),
            isProfileImageRequest: vi.fn(() => false),
            resolveServiceWorkerFetchRoute: vi.fn(() => 'upload' as const),
        });

        listener({ request, respondWith } as ServiceWorkerFetchEventLike);

        expect(respondWith).toHaveBeenCalledTimes(1);
        expect(handleFetch).toHaveBeenCalledTimes(1);
    });

    it('createFetchEventListener は route が無い時に respondWith しない', () => {
        const respondWith = vi.fn();

        const listener = createFetchEventListener({
            handleFetch: vi.fn(async () => undefined),
            currentOrigin: 'https://example.com',
            isUploadRequest: vi.fn(() => false),
            isProfileImageRequest: vi.fn(() => false),
            resolveServiceWorkerFetchRoute: vi.fn(() => null),
        });

        listener({
            request: new Request('https://example.com/index.html'),
            respondWith,
        } as ServiceWorkerFetchEventLike);

        expect(respondWith).not.toHaveBeenCalled();
    });

    it('registerServiceWorkerEventListeners は 4 種類の listener を登録する', () => {
        const addEventListener = vi.fn<(type: string, listener: EventListenerOrEventListenerObject) => void>();

        registerServiceWorkerEventListeners({
            serviceWorkerGlobal: { addEventListener },
            installListener: vi.fn<EventListener>(),
            activateListener: vi.fn<EventListener>(),
            fetchListener: vi.fn<EventListener>(),
            messageListener: vi.fn<EventListener>(),
        });

        expect(addEventListener).toHaveBeenCalledTimes(4);
        expect(addEventListener).toHaveBeenCalledWith('install', expect.any(Function));
        expect(addEventListener).toHaveBeenCalledWith('activate', expect.any(Function));
        expect(addEventListener).toHaveBeenCalledWith('fetch', expect.any(Function));
        expect(addEventListener).toHaveBeenCalledWith('message', expect.any(Function));
    });

    it('createMessageEventListener は handler を呼ぶ', async () => {
        const handler = vi.fn(async () => { });
        const event = { data: { type: 'GET_VERSION' } } as ServiceWorkerMessageEventLike;

        createMessageEventListener(handler)(event);

        expect(handler).toHaveBeenCalledWith(event);
    });
});
