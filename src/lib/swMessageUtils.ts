export interface SharedMediaMessage {
    type: 'SHARED_MEDIA';
    data: unknown;
    requestId: string | null;
    timestamp: number;
    fallbackRequired?: boolean;
}

export interface SharedMediaMessageTarget {
    ports?: Array<{ postMessage: (message: SharedMediaMessage) => void }> | null;
    source?: { postMessage: (message: SharedMediaMessage) => void } | null;
}

export function createSharedMediaMessage({
    data,
    requestId = null,
    timestamp = Date.now(),
    fallbackRequired = false,
}: {
    data: unknown;
    requestId?: string | null;
    timestamp?: number;
    fallbackRequired?: boolean;
}): SharedMediaMessage {
    return {
        type: 'SHARED_MEDIA',
        data,
        requestId,
        timestamp,
        ...(fallbackRequired ? { fallbackRequired: true } : {}),
    };
}

export function createClientSharedMediaNotification(
    data: unknown,
    timestamp = Date.now(),
): SharedMediaMessage {
    return createSharedMediaMessage({
        data,
        requestId: `sw-${timestamp}`,
        timestamp,
    });
}

export function postSharedMediaMessage(
    target: SharedMediaMessageTarget,
    message: SharedMediaMessage,
): 'port' | 'source' | 'none' {
    if (target.ports?.[0]) {
        target.ports[0].postMessage(message);
        return 'port';
    }

    if (target.source) {
        target.source.postMessage(message);
        return 'source';
    }

    return 'none';
}