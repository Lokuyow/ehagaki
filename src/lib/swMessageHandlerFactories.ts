import {
    createPingTestResponse,
    createVersionResponse,
    postMessageEventResponse,
    postPortEventResponse,
    type EventResponseTarget,
} from './swEventResponseUtils';
import type { ServiceWorkerMessageHandler } from './swMessageDispatchUtils';

type MessageLogger = Pick<Console, 'log' | 'warn' | 'error'>;

export interface ServiceWorkerActionEvent extends EventResponseTarget {
    data?: {
        urls?: string[];
        shareId?: string;
    } | null;
}

export interface SharedMediaActionHandler {
    respondSharedMedia: (event: ServiceWorkerActionEvent) => void | Promise<void>;
    respondSharedMediaForce: (event: ServiceWorkerActionEvent) => void | Promise<void>;
    acknowledgeSharedMedia?: (event: ServiceWorkerActionEvent) => void | Promise<void>;
}

export interface CacheActionHandler {
    clearProfileCache: () => Promise<unknown>;
    cleanupDuplicateProfileCache: () => Promise<unknown>;
    cacheCustomEmojiImages: (urls: string[] | undefined) => Promise<unknown>;
}

export function createServiceWorkerTypeMessageHandlers({
    event,
    version,
    skipWaiting,
    logger,
    createVersion = createVersionResponse,
    createPingTest = createPingTestResponse,
    postPortResponse = postPortEventResponse,
    postMessageResponse = postMessageEventResponse,
}: {
    event: EventResponseTarget;
    version: string;
    skipWaiting: () => void;
    logger: MessageLogger;
    createVersion?: typeof createVersionResponse;
    createPingTest?: typeof createPingTestResponse;
    postPortResponse?: typeof postPortEventResponse;
    postMessageResponse?: typeof postMessageEventResponse;
}): Record<string, ServiceWorkerMessageHandler> {
    return {
        SKIP_WAITING: () => {
            logger.log('SW received SKIP_WAITING, updating...');
            skipWaiting();
        },
        GET_VERSION: () => {
            postPortResponse(event, createVersion(version));
        },
        PING_TEST: () => {
            const response = createPingTest(version);

            try {
                const channel = postMessageResponse(event, response);
                if (channel === 'port') {
                    logger.log('SW: PING_TEST responded via MessageChannel');
                } else if (channel === 'source') {
                    logger.log('SW: PING_TEST responded via source');
                } else {
                    logger.warn('SW: PING_TEST no response channel available');
                }
            } catch (error) {
                logger.error('SW: PING_TEST response error:', error);
            }
        },
    };
}

export function createServiceWorkerActionHandlers({
    event,
    messageHandler,
    cacheManager,
    postPortResponse = postPortEventResponse,
}: {
    event: ServiceWorkerActionEvent;
    messageHandler: SharedMediaActionHandler;
    cacheManager: CacheActionHandler;
    postPortResponse?: typeof postPortEventResponse;
}): Record<string, ServiceWorkerMessageHandler> {
    return {
        getSharedMedia: () => messageHandler.respondSharedMedia(event),
        getSharedMediaForce: () => messageHandler.respondSharedMediaForce(event),
        acknowledgeSharedMedia: () => messageHandler.acknowledgeSharedMedia?.(event),
        clearProfileCache: async () => {
            const result = await cacheManager.clearProfileCache();
            postPortResponse(event, result);
        },
        cleanupDuplicateProfileCache: async () => {
            const result = await cacheManager.cleanupDuplicateProfileCache();
            postPortResponse(event, result);
        },
        cacheCustomEmojiImages: async () => {
            const result = await cacheManager.cacheCustomEmojiImages(event.data?.urls);
            postPortResponse(event, result);
        },
    };
}
