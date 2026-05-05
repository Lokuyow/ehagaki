import type { ServiceWorkerFetchRoute } from './swRoutingUtils';

interface FetchRouteLogger {
    log: (...args: unknown[]) => void;
}

export function logServiceWorkerFetchRoute({
    route,
    url,
    requestUrl,
    currentOrigin,
    logger,
}: {
    route: ServiceWorkerFetchRoute;
    url: URL;
    requestUrl: string;
    currentOrigin: string;
    logger: FetchRouteLogger;
}): void {
    if (route === 'upload') {
        logger.log('SW: 内部アップロードリクエストを処理', url.href);
        return;
    }

    if (route === 'profile-image' && url.origin !== currentOrigin) {
        logger.log('SW: 外部プロフィール画像リクエストを処理:', requestUrl);
    }
}