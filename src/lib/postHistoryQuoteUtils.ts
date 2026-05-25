import { RelayConfigUtils } from "./relayConfigUtils";
import type { NostrEvent } from "./types";

export interface PostHistoryQuoteReference {
    eventId: string;
    relayHint: string | null;
    authorHint: string | null;
}

const HEX_64_PATTERN = /^[0-9a-f]{64}$/i;

function isValidHexId(value: unknown): value is string {
    return typeof value === "string" && HEX_64_PATTERN.test(value);
}

function parseRelayHint(value: unknown): string | null {
    return RelayConfigUtils.sanitizeExternalRelayUrls(
        typeof value === "string" && value.length > 0 ? [value] : [],
        { limit: 1 },
    )[0] ?? null;
}

export function parsePostHistoryQuoteReferences(
    event: Pick<NostrEvent, "tags"> | null | undefined,
): PostHistoryQuoteReference[] {
    if (!event) {
        return [];
    }

    const quotesByEventId = new Map<string, PostHistoryQuoteReference>();

    for (const tag of event.tags) {
        if (!Array.isArray(tag) || tag[0] !== "q") {
            continue;
        }

        const eventId = tag[1];
        if (!isValidHexId(eventId)) {
            continue;
        }

        const relayHint = parseRelayHint(tag[2]);
        const authorHint = isValidHexId(tag[3]) ? tag[3] : null;
        const existing = quotesByEventId.get(eventId);

        if (!existing) {
            quotesByEventId.set(eventId, {
                eventId,
                relayHint,
                authorHint,
            });
            continue;
        }

        if (!existing.relayHint && relayHint) {
            existing.relayHint = relayHint;
        }
        if (!existing.authorHint && authorHint) {
            existing.authorHint = authorHint;
        }
    }

    return Array.from(quotesByEventId.values());
}