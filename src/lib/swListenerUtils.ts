import type { ServiceWorkerFetchRoute } from './swRoutingUtils';

export interface ServiceWorkerLifecycleEventLike {
    waitUntil: (promise: Promise<unknown>) => void;
}

export interface ServiceWorkerFetchEventLike {
    request: Request;
    respondWith: (response: Promise<Response | undefined>) => void;
}

export interface ServiceWorkerMessageEventLike {
    data?: unknown;
}

export function createInstallEventListener(
    handleInstall: (event: ServiceWorkerLifecycleEventLike) => Promise<void>,
) {
    return (event: ServiceWorkerLifecycleEventLike) => {
        event.waitUntil(handleInstall(event));
    };
}

export function createActivateEventListener(
    handleActivate: (event: ServiceWorkerLifecycleEventLike) => Promise<void>,
) {
    return (event: ServiceWorkerLifecycleEventLike) => {
        event.waitUntil(handleActivate(event));
    };
}

export function createFetchEventListener({
    handleFetch,
    currentOrigin,
    isUploadRequest,
    isProfileImageRequest,
    resolveServiceWorkerFetchRoute,
}: {
    handleFetch: (event: ServiceWorkerFetchEventLike) => Promise<Response | undefined>;
    currentOrigin: string;
    isUploadRequest: (request: Request, url: URL) => boolean;
    isProfileImageRequest: (request: Request) => boolean;
    resolveServiceWorkerFetchRoute: (params: {
        request: Request;
        url: URL;
        currentOrigin: string;
        isUploadRequest: (request: Request, url: URL) => boolean;
        isProfileImageRequest: (request: Request) => boolean;
    }) => ServiceWorkerFetchRoute;
}) {
    return (event: ServiceWorkerFetchEventLike) => {
        const url = new URL(event.request.url);
        const route = resolveServiceWorkerFetchRoute({
            request: event.request,
            url,
            currentOrigin,
            isUploadRequest,
            isProfileImageRequest,
        });

        if (route) {
            event.respondWith(handleFetch(event));
        }
    };
}

export function createMessageEventListener(
    handleMessage: (event: ServiceWorkerMessageEventLike) => Promise<void> | void,
) {
    return (event: ServiceWorkerMessageEventLike) => {
        void handleMessage(event);
    };
}

export function registerServiceWorkerEventListeners({
    serviceWorkerGlobal,
    installListener,
    activateListener,
    fetchListener,
    messageListener,
}: {
    serviceWorkerGlobal: {
        addEventListener: (type: string, listener: EventListenerOrEventListenerObject) => void;
    };
    installListener: EventListenerOrEventListenerObject;
    activateListener: EventListenerOrEventListenerObject;
    fetchListener: EventListenerOrEventListenerObject;
    messageListener: EventListenerOrEventListenerObject;
}) {
    serviceWorkerGlobal.addEventListener('install', installListener);
    serviceWorkerGlobal.addEventListener('activate', activateListener);
    serviceWorkerGlobal.addEventListener('fetch', fetchListener);
    serviceWorkerGlobal.addEventListener('message', messageListener);
}