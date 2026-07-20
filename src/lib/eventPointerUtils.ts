import { nip19 } from "nostr-tools";
import { RelayConfigUtils } from "./relayConfigUtils";

function isStrictRelayUrl(value: unknown): value is string {
    if (typeof value !== "string" || !value.trim().includes("://")) {
        return false;
    }
    try {
        const parsed = new URL(value.trim());
        return (parsed.protocol === "ws:" || parsed.protocol === "wss:")
            && !parsed.username
            && !parsed.password
            && RelayConfigUtils.normalizeExternalRelayUrl(value) !== null;
    } catch {
        return false;
    }
}

export function decodeEventPointerValue(
    value: string,
    options: { relayValidation?: "permissive" | "strict" } = {},
): {
    eventId: string;
    relayHints: string[];
    authorPubkey: string | null;
} | null {
    try {
        const decoded = nip19.decode(value);

        if (decoded.type === "nevent") {
            const data = decoded.data as nip19.EventPointer;
            const rawRelays: unknown[] = Array.isArray(data.relays)
                ? data.relays
                : [];
            if (
                options.relayValidation === "strict"
                && rawRelays.some((relay) => !isStrictRelayUrl(relay))
            ) {
                return null;
            }
            return {
                eventId: data.id,
                relayHints: RelayConfigUtils.sanitizeExternalRelayUrls(
                    rawRelays.filter((relay): relay is string => typeof relay === "string"),
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
    } catch {
        return null;
    }
}
