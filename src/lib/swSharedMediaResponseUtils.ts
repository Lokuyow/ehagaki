import {
    createSharedMediaMessage,
    postSharedMediaMessage,
    type SharedMediaMessageTarget,
} from './swMessageUtils';

export interface SharedMediaResponseEvent extends SharedMediaMessageTarget {
    data?: {
        requestId?: string | null;
    } | null;
}

export function postServiceWorkerSharedMediaResponse({
    event,
    sharedMedia,
    fallbackRequired = false,
    clearAfterSend = false,
    clearSharedMediaCache,
    clearPersistedSharedMedia,
}: {
    event: SharedMediaResponseEvent;
    sharedMedia: unknown;
    fallbackRequired?: boolean;
    clearAfterSend?: boolean;
    clearSharedMediaCache: () => void;
    clearPersistedSharedMedia?: () => void | Promise<void>;
}): unknown {
    const message = createSharedMediaMessage({
        data: sharedMedia,
        requestId: event.data?.requestId ?? null,
        fallbackRequired,
    });

    postSharedMediaMessage(event, message);

    if (clearAfterSend && sharedMedia) {
        clearSharedMediaCache();
        clearPersistedSharedMedia?.();
    }

    return sharedMedia;
}