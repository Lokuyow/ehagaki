export const EMBED_MESSAGE_NAMESPACE = "ehagaki.embed" as const;
export const EMBED_MESSAGE_VERSION = 1 as const;

export type EmbedMessageType =
    | "ready"
    | "auth.login"
    | "auth.request"
    | "auth.error"
    | "auth.result"
    | "auth.logout"
    | "composer.setContext"
    | "composer.clearContext"
    | "rpc.request"
    | "rpc.result"
    | "rpc.error"
    | "post.success"
    | "post.error";

export interface EmbedMessageEnvelope<TPayload = unknown> {
    namespace: typeof EMBED_MESSAGE_NAMESPACE;
    version: typeof EMBED_MESSAGE_VERSION;
    type: EmbedMessageType;
    requestId?: string;
    payload?: TPayload;
}

export interface EmbedErrorPayload {
    code: string;
    message?: string;
}

export interface EmbedPostSuccessPayload {
    timestamp: number;
    eventId?: string;
    replyToEventId?: string;
    quotedEventIds?: string[];
}

export interface EmbedPostErrorPayload extends EmbedErrorPayload {
    timestamp: number;
}

export interface EmbedComposerSetContextPayload {
    reply?: string | null;
    quotes?: string[];
}

export function isEmbedMessageEnvelope(
    value: unknown,
): value is EmbedMessageEnvelope {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const message = value as Record<string, unknown>;
    return (
        message.namespace === EMBED_MESSAGE_NAMESPACE
        && message.version === EMBED_MESSAGE_VERSION
        && typeof message.type === "string"
    );
}

export function getParentOriginFromSearch(
    locationSearch: string | undefined,
): string | null {
    if (!locationSearch) {
        return null;
    }

    const params = new URLSearchParams(locationSearch);
    const parentOrigin = params.get("parentOrigin");
    if (!parentOrigin) {
        return null;
    }

    try {
        return new URL(parentOrigin).origin;
    } catch {
        return null;
    }
}