import { nip19 } from "nostr-tools";
import { RelayConfigUtils } from "./relayConfigUtils";

export function decodeEventPointerValue(
    value: string,
): {
    eventId: string;
    relayHints: string[];
    authorPubkey: string | null;
} | null {
    try {
        const decoded = nip19.decode(value);

        if (decoded.type === "nevent") {
            const data = decoded.data as nip19.EventPointer;
            return {
                eventId: data.id,
                relayHints: RelayConfigUtils.sanitizeExternalRelayUrls(
                    data.relays ? [...data.relays] : [],
                    { limit: RelayConfigUtils.EXTERNAL_INPUT_RELAY_LIMIT },
                ),
                authorPubkey: data.author ?? null,
            };
        }

        if (decoded.type === "note") {
            return {
                eventId: decoded.data as string,
                relayHints: [],
                authorPubkey: null,
            };
        }

        return null;
    } catch (error) {
        console.error("リプライ/引用パラメータのデコードに失敗:", error);
        return null;
    }
}
