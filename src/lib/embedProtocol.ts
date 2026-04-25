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
    | "composer.contextApplied"
    | "composer.contextError"
    | "composer.contextUpdated"
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

export interface EmbedChannelContextPayload {
    reference: string;
    relays?: string[];
    name?: string | null;
    about?: string | null;
    picture?: string | null;
}

export interface EmbedComposerSetContextPayload {
    reply?: string | null;
    quotes?: string[] | null;
    content?: string | null;
    channel?: EmbedChannelContextPayload | null;
}

export interface EmbedComposerContextAppliedPayload {
    timestamp: number;
}

export interface EmbedComposerContextErrorPayload extends EmbedErrorPayload {
    timestamp: number;
}

export interface EmbedComposerContextUpdatedPayload {
    timestamp: number;
    reply: string | null;
    quotes: string[];
    channel?: EmbedChannelContextPayload | null;
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

const EMBED_REQUEST_ID_REQUIRED_TYPES = new Set<EmbedMessageType>([
    "auth.request",
    "auth.error",
    "auth.result",
    "composer.setContext",
    "composer.contextApplied",
    "composer.contextError",
    "rpc.request",
    "rpc.result",
    "rpc.error",
]);

export function embedMessageRequiresRequestId(type: EmbedMessageType): boolean {
    return EMBED_REQUEST_ID_REQUIRED_TYPES.has(type);
}

export function isValidEmbedRequestId(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
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