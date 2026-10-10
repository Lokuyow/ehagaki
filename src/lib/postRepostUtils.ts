import { createPlainNostrEventSnapshot, extractPostHistoryChannelReference } from "./postHistoryEventUtils";
import { extractPostHistoryMedia } from "./postHistoryMediaUtils";
import { attestFullyVerifiedPostHistoryRawEvent, RAW_EVENT_VERIFICATION_RULE_VERSION } from "./postHistoryRawEventVerification";
import { RelayConfigUtils } from "./relayConfigUtils";
import type { NostrEvent } from "./types";
import type { PostHistoryRecord, PostHistoryRepostTarget } from "./storage/ehagakiDb";
import { isHex64 } from "./utils/nostrHexUtils";

export interface RepostReference {
    outerKind: 6 | 16;
    targetKindHint: number | null;
    eventId: string;
    authorHint: string | null;
    authorHints?: string[];
    relayHints: string[];
}

export function isRepostOuterKind(kind: number): kind is 6 | 16 {
    return kind === 6 || kind === 16;
}

export function isRepostTargetKind(kind: number): kind is 1 | 42 | 1111 {
    return kind === 1 || kind === 42 || kind === 1111;
}

export function classifyRepostTargetKind(outerKind: 6 | 16, targetKind: number) {
    if (outerKind === 6) return targetKind === 1 ? "supported" : "outer-target-kind-mismatch";
    if (targetKind === 1) return "outer-target-kind-mismatch";
    return targetKind === 42 || targetKind === 1111 ? "supported" : "unsupported-target-kind";
}

type RepostReferenceResult = { status: "valid"; reference: RepostReference }
    | { status: "invalid-reference" | "unsupported-reference"; reference: null };

/** Content is opaque: even valid embedded JSON is never a target source. */
export function parseRepostReference(event: Pick<NostrEvent, "kind" | "tags">): RepostReferenceResult {
    const invalid = { status: "invalid-reference", reference: null } as const;
    if (!isRepostOuterKind(event.kind)) return invalid;
    const references = event.tags.filter((tag) => tag[0] === "e");
    if (references.some((tag) => !isHex64(tag[1]))) return invalid;
    const ids = new Set(references.map((tag) => tag[1]));
    const authors = event.tags.filter((tag) => tag[0] === "p");
    if (ids.size > 1 || authors.some((tag) => !isHex64(tag[1]))) return invalid;
    const kindTags = event.kind === 16 ? event.tags.filter((tag) => tag[0] === "k") : [];
    const kinds = new Set<number>();
    for (const tag of kindTags) {
        const value = tag[1];
        const kind = Number(value);
        if (value === undefined || !Number.isInteger(kind) || kind < 0 || kind > 65535 || value !== String(kind)) return invalid;
        kinds.add(kind);
    }
    if (kinds.size > 1) return invalid;
    if (!references.length) return event.kind === 16 && event.tags.some((tag) => tag[0] === "a")
        ? { status: "unsupported-reference", reference: null } : invalid;
    const pubkeys = new Set(authors.map((tag) => tag[1]!));
    return { status: "valid", reference: { outerKind: event.kind, targetKindHint: [...kinds][0] ?? null,
        eventId: references[0]![1]!, authorHint: pubkeys.size === 1 ? authors[0]![1]! : null,
        ...(pubkeys.size > 1 ? { authorHints: [...pubkeys] } : {}),
        relayHints: RelayConfigUtils.sanitizeExternalRelayUrls(references.map((tag) => tag[2] ?? "")) } };
}

export function getRepostReference(event: Pick<NostrEvent, "kind" | "tags">): RepostReference | null {
    return parseRepostReference(event).reference;
}

/** Integrity is independent of a particular outer's product support. */
export function verifyRepostTarget(event: unknown, reference?: Pick<RepostReference, "eventId" | "authorHint" | "relayHints"> & Partial<Pick<RepostReference, "authorHints" | "targetKindHint">> | null) {
    const verified = attestFullyVerifiedPostHistoryRawEvent(event);
    if (!verified) return null;
    if (reference && (verified.event.id !== reference.eventId
        || (reference.authorHint && verified.event.pubkey !== reference.authorHint)
        || (reference.authorHints?.length && !reference.authorHints.includes(verified.event.pubkey))
        || (reference.targetKindHint != null && verified.event.kind !== reference.targetKindHint))) return null;
    return verified;
}

export function verifySupportedRepostTarget(event: unknown, reference: RepostReference) {
    const verified = verifyRepostTarget(event, reference);
    return verified && classifyRepostTargetKind(reference.outerKind, verified.event.kind) === "supported" ? verified : null;
}

export function createRepostTargetSnapshot(event: unknown, relayHints: string[] = [], reference?: RepostReference | null): PostHistoryRepostTarget | null {
    const verified = reference ? verifySupportedRepostTarget(event, reference) : verifyRepostTarget(event);
    if (!verified || !isRepostTargetKind(verified.event.kind)) return null;
    return { rawEvent: createPlainNostrEventSnapshot(verified.event),
        rawEventVerification: { status: "valid", ruleVersion: RAW_EVENT_VERIFICATION_RULE_VERSION },
        relayHints: RelayConfigUtils.sanitizeExternalRelayUrls(relayHints) };
}

export function buildRepostEvent(target: NostrEvent, pubkey: string, relayUrl: string, createdAt: number, clientTag?: string[] | null) {
    const verified = verifyRepostTarget(target);
    const relay = RelayConfigUtils.sanitizeExternalRelayUrls([relayUrl])[0];
    if (!verified || !isRepostTargetKind(verified.event.kind) || !relay) throw new Error("invalid_repost_target");
    const kind = verified.event.kind === 1 ? 6 : 16;
    return { kind, pubkey, created_at: createdAt, content: "" as const,
        tags: [["e", verified.event.id, relay], ["p", verified.event.pubkey],
            ...(kind === 16 ? [["k", String(verified.event.kind)]] : []), ...(clientTag ? [clientTag] : [])] };
}

/** An action/render adapter only, never an authored persistence write. */
export function repostTargetToPost(event: NostrEvent, relayHints: string[] = []): PostHistoryRecord {
    return { id: event.id, eventId: event.id, pubkeyHex: event.pubkey, kind: event.kind,
        content: event.content, tags: event.tags, createdAt: event.created_at,
        postedAt: event.created_at * 1000, relayHints, acceptedRelays: [], media: extractPostHistoryMedia(event),
        ...extractPostHistoryChannelReference(event),
        rawEvent: event, updatedAt: 0, schemaVersion: 2 };
}
