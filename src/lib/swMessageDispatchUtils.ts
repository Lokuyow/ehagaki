import type { ServiceWorkerMessageRoute } from './swRoutingUtils';

export type ServiceWorkerMessageHandler = () => void | Promise<void>;

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