export type ServiceWorkerFetchRoute =
    | 'upload'
    | 'profile-image'
    | 'custom-emoji-image'
    | null;

export interface ResolveServiceWorkerFetchRouteParams {
    request: Pick<Request, 'method' | 'destination'>;
    url: Pick<URL, 'origin'>;
    currentOrigin: string;
    isUploadRequest: (request: Request, url: URL) => boolean;
    isProfileImageRequest: (request: Request) => boolean;
}

export function resolveServiceWorkerFetchRoute({
    request,
    url,
    currentOrigin,
    isUploadRequest,
    isProfileImageRequest,
}: ResolveServiceWorkerFetchRouteParams): ServiceWorkerFetchRoute {
    if (url.origin === currentOrigin && isUploadRequest(request as Request, url as URL)) {
        return 'upload';
    }

    if (isProfileImageRequest(request as Request)) {
        return 'profile-image';
    }

    if (request.method === 'GET' && request.destination === 'image') {
        return 'custom-emoji-image';
    }

    return null;
}

export type ServiceWorkerMessageRoute =
    | { kind: 'type'; name: string }
    | { kind: 'action'; name: string }
    | null;

export function resolveServiceWorkerMessageRoute(
    data: { type?: string; action?: string } | null | undefined,
): ServiceWorkerMessageRoute {
    if (!data) {
        return null;
    }

    if (data.type) {
        return { kind: 'type', name: data.type };
    }

    if (data.action) {
        return { kind: 'action', name: data.action };
    }

    return null;
}