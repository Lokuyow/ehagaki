import {
    isEmbedMessageEnvelope,
    type EmbedMessageEnvelope,
} from "./embedProtocol";

/**
 * Returns an embed message only when it came from this iframe's trusted parent.
 * Routing and message-specific validation remain owned by each receiving service.
 */
export function getTrustedParentEmbedMessage(
    event: MessageEvent,
    windowObj: Window | undefined,
    trustedParentOrigin: string | null,
): EmbedMessageEnvelope | null {
    if (!windowObj) return null;
    if (!isEmbedMessageEnvelope(event.data)) return null;
    if (event.source !== windowObj.parent) return null;
    if (trustedParentOrigin && event.origin !== trustedParentOrigin) return null;

    return event.data;
}
