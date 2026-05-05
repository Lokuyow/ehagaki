import { createClientSharedMediaNotification } from './swMessageUtils';

export function createSharedClientUrl(basePath: string, origin: string): string {
    const url = new URL(basePath, origin);
    url.searchParams.set('shared', 'true');
    return url.href;
}

interface ClientActionLogger {
    log: (...args: unknown[]) => void;
    warn: (...args: unknown[]) => void;
    error: (...args: unknown[]) => void;
}

interface ClientLike {
    id?: string;
    focus?: () => Promise<void> | void;
    postMessage?: (message: unknown) => void;
}

interface MatchAllClientSet<TClient> {
    matchAll: (options: { type: 'window'; includeUncontrolled: true }) => Promise<TClient[]>;
}

export async function redirectToAvailableSharedClient<TClient, TResponse>({
    clientSet,
    focusAndNotifyClient,
    openNewClient,
    logger,
    createErrorRedirectResponse,
}: {
    clientSet: MatchAllClientSet<TClient>;
    focusAndNotifyClient: (client: TClient) => Promise<TResponse>;
    openNewClient: () => Promise<TResponse>;
    logger: ClientActionLogger;
    createErrorRedirectResponse: () => TResponse;
}): Promise<TResponse> {
    try {
        const clients = await clientSet.matchAll({
            type: 'window',
            includeUncontrolled: true,
        });

        if (clients.length > 0) {
            return await focusAndNotifyClient(clients[0]);
        }

        return await openNewClient();
    } catch (error) {
        logger.error('クライアント処理エラー:', error);
        return createErrorRedirectResponse();
    }
}

export async function focusAndNotifySharedClient<TSharedCache, TResponse>({
    client,
    sharedCache,
    persistSharedMedia,
    logger,
    createRedirectResponse,
}: {
    client: ClientLike;
    sharedCache: TSharedCache | null | undefined;
    persistSharedMedia: (sharedCache: TSharedCache) => Promise<void>;
    logger: ClientActionLogger;
    createRedirectResponse: () => TResponse;
}): Promise<TResponse> {
    await persistSharedMediaIfPresent({
        sharedCache,
        persist: persistSharedMedia,
        onPersisted: () => {
            logger.log('SW: Shared media persisted to IndexedDB for fallback');
        },
        onError: (dbError) => {
            logger.warn('SW: Failed to persist shared media to IndexedDB:', dbError);
        },
    });

    try {
        await client.focus?.();
    } catch (focusError) {
        logger.warn('SW: Client focus failed (may be backgrounded):', focusError);
    }

    logger.log('SW: Attempting to notify client', {
        hasClient: Boolean(client),
        hasPostMessage: typeof client.postMessage === 'function',
        hasSharedCache: Boolean(sharedCache),
        clientId: client.id || 'unknown',
    });

    if (typeof client.postMessage === 'function') {
        try {
            client.postMessage(createClientSharedMediaNotification(sharedCache));
            logger.log('SW: Message sent to client successfully');
        } catch (messageError) {
            logger.warn(
                'SW: Failed to send message to client (will rely on IndexedDB fallback):',
                messageError,
            );
        }
    }

    return createRedirectResponse();
}

export async function openNewSharedClientWindow<TSharedCache, TResponse>({
    sharedCache,
    persistSharedMedia,
    logger,
    basePath,
    origin,
    openWindow,
    createRedirectResponse,
}: {
    sharedCache: TSharedCache | null | undefined;
    persistSharedMedia: (sharedCache: TSharedCache) => Promise<void>;
    logger: ClientActionLogger;
    basePath: string;
    origin: string;
    openWindow: (url: string) => Promise<unknown>;
    createRedirectResponse: () => TResponse;
}): Promise<TResponse> {
    await persistSharedMediaIfPresent({
        sharedCache,
        persist: persistSharedMedia,
        onPersisted: () => {
            logger.log('SW: Shared media persisted to IndexedDB for new client');
        },
        onError: (dbError) => {
            logger.warn('SW: Failed to persist shared media to IndexedDB:', dbError);
        },
    });

    const url = createSharedClientUrl(basePath, origin);
    try {
        await openWindow(url);
        logger.log('SW: New client window opened:', url);
    } catch (openError) {
        logger.warn('SW: Failed to open new window:', openError);
    }

    return createRedirectResponse();
}

export async function persistSharedMediaIfPresent<T>(params: {
    sharedCache: T | null | undefined;
    persist: (sharedCache: T) => Promise<void>;
    onPersisted?: () => void;
    onError?: (error: unknown) => void;
}): Promise<boolean> {
    const { sharedCache, persist, onPersisted, onError } = params;

    if (!sharedCache) {
        return false;
    }

    try {
        await persist(sharedCache);
        onPersisted?.();
        return true;
    } catch (error) {
        onError?.(error);
        return false;
    }
}