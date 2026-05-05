import {
    createServiceWorkerActionHandlers,
    createServiceWorkerTypeMessageHandlers,
    type CacheActionHandler,
    type SharedMediaActionHandler,
} from './swMessageHandlerFactories';
import type { EventResponseTarget } from './swEventResponseUtils';
import type { ServiceWorkerMessageRoute } from './swRoutingUtils';
import { resolveServiceWorkerMessageRoute } from './swRoutingUtils';

export type ServiceWorkerMessageHandler = () => void | Promise<void>;

export type ServiceWorkerMessageEvent = EventResponseTarget & {
    data?: {
        type?: string;
        action?: string;
        urls?: string[];
    } | null;
};

export async function dispatchServiceWorkerMessageRoute({
    route,
    messageHandlers,
    actionHandlers,
}: {
    route: ServiceWorkerMessageRoute;
    messageHandlers: Record<string, ServiceWorkerMessageHandler | undefined>;
    actionHandlers: Record<string, ServiceWorkerMessageHandler | undefined>;
}): Promise<boolean> {
    if (route?.kind === 'type' && messageHandlers[route.name]) {
        await messageHandlers[route.name]!();
        return true;
    }

    if (route?.kind === 'action' && actionHandlers[route.name]) {
        await actionHandlers[route.name]!();
        return true;
    }

    return false;
}

export async function processServiceWorkerMessageEvent({
    event,
    version,
    skipWaiting,
    logger,
    messageHandler,
    cacheManager,
}: {
    event: ServiceWorkerMessageEvent;
    version: string;
    skipWaiting: () => void;
    logger: Pick<Console, 'log' | 'warn' | 'error'>;
    messageHandler: SharedMediaActionHandler;
    cacheManager: CacheActionHandler;
}): Promise<boolean> {
    const route = resolveServiceWorkerMessageRoute(event.data);

    return await dispatchServiceWorkerMessageRoute({
        route,
        messageHandlers: createServiceWorkerTypeMessageHandlers({
            event,
            version,
            skipWaiting,
            logger,
        }),
        actionHandlers: createServiceWorkerActionHandlers({
            event,
            messageHandler,
            cacheManager,
        }),
    });
}