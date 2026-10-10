import { createPlainNostrEventSnapshot } from "./postHistoryEventUtils";
import { attestFullyVerifiedPostHistoryRawEvent, RAW_EVENT_VERIFICATION_RULE_VERSION } from "./postHistoryRawEventVerification";
import { RelayConfigUtils } from "./relayConfigUtils";
import type { NostrEvent } from "./types";
import type { PostHistoryRecord, PostHistoryRepostTarget } from "./storage/ehagakiDb";
import { isHex64 } from "./utils/nostrHexUtils";

export interface RepostReference {
    eventId: string;
    authorHint: string | null;
    relayHints: string[];
}

/** Content is opaque: even valid embedded JSON is never a target source. */
export function getRepostReference(event: Pick<NostrEvent, "kind" | "tags">): RepostReference | null {
    if (event.kind !== 6) return null;
    const references = event.tags.filter((tag) => tag[0] === "e");
    if (!references.length || references.some((tag) => !isHex64(tag[1]))) return null;
    const ids = new Set(references.map((tag) => tag[1]));
    const authors = event.tags.filter((tag) => tag[0] === "p");
    if (ids.size !== 1 || authors.some((tag) => !isHex64(tag[1]))) return null;
    const pubkeys = new Set(authors.map((tag) => tag[1]));
    if (pubkeys.size > 1) return null;
    return { eventId: references[0]![1]!, authorHint: authors[0]?.[1] ?? null,
        relayHints: RelayConfigUtils.sanitizeExternalRelayUrls(references.map((tag) => tag[2] ?? "")) };
}

export function verifyRepostTarget(event: unknown, reference?: RepostReference | null) {
    const verified = attestFullyVerifiedPostHistoryRawEvent(event);
    if (!verified || verified.event.kind !== 1) return null;
    if (reference && (verified.event.id !== reference.eventId
        || (reference.authorHint && verified.event.pubkey !== reference.authorHint))) return null;
    return verified;
}

export function createRepostTargetSnapshot(event: unknown, relayHints: string[] = [], reference?: RepostReference | null): PostHistoryRepostTarget | null {
    const verified = verifyRepostTarget(event, reference);
    return verified ? { rawEvent: createPlainNostrEventSnapshot(verified.event),
        rawEventVerification: { status: "valid", ruleVersion: RAW_EVENT_VERIFICATION_RULE_VERSION },
        relayHints: RelayConfigUtils.sanitizeExternalRelayUrls(relayHints) } : null;
}

export function buildRepostEvent(target: NostrEvent, pubkey: string, relayUrl: string, createdAt: number, clientTag?: string[] | null) {
    const verified = verifyRepostTarget(target);
    const relay = RelayConfigUtils.sanitizeExternalRelayUrls([relayUrl])[0];
    if (!verified || !relay) throw new Error("invalid_repost_target");
    return { kind: 6 as const, pubkey, created_at: createdAt, content: "" as const,
        tags: [["e", verified.event.id, relay], ["p", verified.event.pubkey], ...(clientTag ? [clientTag] : [])] };
}

/** An action/render adapter only, never an authored persistence write. */
export function repostTargetToPost(event: NostrEvent, relayHints: string[] = []): PostHistoryRecord {
    return { id: event.id, eventId: event.id, pubkeyHex: event.pubkey, kind: event.kind,
        content: event.content, tags: event.tags, createdAt: event.created_at,
        postedAt: event.created_at * 1000, relayHints, acceptedRelays: [], media: [],
        rawEvent: event, updatedAt: 0, schemaVersion: 2 };
}
