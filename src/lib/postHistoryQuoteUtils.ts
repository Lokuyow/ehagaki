import { nip19 } from "nostr-tools";
import { RelayConfigUtils } from "./relayConfigUtils";
import type { NostrEvent } from "./types";

export interface PostHistoryQuoteReference {
    eventId: string;
    relayHint: string | null;
    authorHint: string | null;
}

const HEX_64_PATTERN = /^[0-9a-f]{64}$/i;
const INLINE_NOSTR_URI_PATTERN = /nostr:[^\s<>"']+/gi;
const TRAILING_INLINE_NOSTR_URI_PUNCTUATION_PATTERN =
    /[),.!?:;\]\u3001\u3002\uff01\uff08\uff09\uff0c\uff0e\uff1a\uff1b\u300d\u300f\u3011]+$/u;
const PUNCTUATION_ONLY_LINE_PATTERN =
    /^[\s),.!?:;\]\u3001\u3002\uff01\uff08\uff09\uff0c\uff0e\uff1a\uff1b\u300d\u300f\u3011]+$/u;

function isValidHexId(value: unknown): value is string {
    return typeof value === "string" && HEX_64_PATTERN.test(value);
}

function parseRelayHint(value: unknown): string | null {
    return RelayConfigUtils.sanitizeExternalRelayUrls(
        typeof value === "string" && value.length > 0 ? [value] : [],
        { limit: 1 },
    )[0] ?? null;
}

function splitInlineQuoteUriToken(rawToken: string): {
    uri: string;
    trailingText: string;
} {
    const match = rawToken.match(TRAILING_INLINE_NOSTR_URI_PUNCTUATION_PATTERN);
    if (!match) {
        return {
            uri: rawToken,
            trailingText: "",
        };
    }

    const trailingText = match[0];
    return {
        uri: rawToken.slice(0, -trailingText.length),
        trailingText,
    };
}

function resolveInlineQuoteUriEventId(uri: string): string | null {
    if (!uri.toLowerCase().startsWith("nostr:")) {
        return null;
    }

    try {
        const decoded = nip19.decode(uri.slice("nostr:".length));
        if (decoded.type === "note") {
            return decoded.data;
        }

        if (decoded.type === "nevent") {
            return decoded.data.id;
        }

        return null;
    } catch {
        return null;
    }
}

function normalizeStrippedQuoteLine(line: string): string | null {
    const normalized = line.replace(/[ \t]{2,}/g, " ").trim();
    if (normalized.length === 0) {
        return null;
    }

    if (PUNCTUATION_ONLY_LINE_PATTERN.test(normalized)) {
        return null;
    }

    return normalized;
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

export function stripPostHistoryInlineQuoteUrisForDisplay(
    event: Pick<NostrEvent, "content" | "tags"> | null | undefined,
): string {
    if (!event || typeof event.content !== "string" || event.content.length === 0) {
        return event?.content ?? "";
    }

    const quoteReferences = parsePostHistoryQuoteReferences(event);
    if (quoteReferences.length === 0) {
        return event.content;
    }

    const quoteEventIds = new Set(
        quoteReferences.map((reference) => reference.eventId),
    );
    let changed = false;

    const strippedLines = event.content
        .split(/\r?\n/)
        .map((line) => {
            if (!line) {
                return line;
            }

            let nextLine = "";
            let lastIndex = 0;
            let removedInlineQuote = false;

            for (const match of line.matchAll(INLINE_NOSTR_URI_PATTERN)) {
                const matchIndex = match.index ?? -1;
                const rawToken = match[0] ?? "";
                if (matchIndex < 0 || !rawToken) {
                    continue;
                }

                const { uri, trailingText } = splitInlineQuoteUriToken(rawToken);
                const eventId = resolveInlineQuoteUriEventId(uri);
                if (!eventId || !quoteEventIds.has(eventId)) {
                    continue;
                }

                removedInlineQuote = true;
                changed = true;
                nextLine += line.slice(lastIndex, matchIndex);
                nextLine += trailingText;
                lastIndex = matchIndex + rawToken.length;
            }

            if (!removedInlineQuote) {
                return line;
            }

            nextLine += line.slice(lastIndex);
            return normalizeStrippedQuoteLine(nextLine);
        });

    if (!changed) {
        return event.content;
    }

    return strippedLines.filter((line): line is string => line !== null).join("\n");
}