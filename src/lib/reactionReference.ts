import { RelayConfigUtils } from "./relayConfigUtils";
import type { RelatedEventReference } from "./relatedEventVerification";
import type { NostrEvent } from "./types";
import { isHex64 } from "./utils/nostrHexUtils";

export interface ReactionReferenceTarget {
    eventId: string;
    targetAuthorPubkey?: string;
    targetKind?: number;
}

export function parseReactionReference(event: Pick<NostrEvent, "kind" | "tags">):
    { status: "valid"; reference: RelatedEventReference }
    | { status: "invalid-reference" | "unsupported-reference"; reference: null } {
    const invalid = { status: "invalid-reference", reference: null } as const;
    if (event.kind !== 7) return invalid;
    // Select raw trailing tags before validation: invalid trailing tags never
    // permit a fallback to an earlier event or author.
    const e = event.tags.filter(tag => tag[0] === "e").at(-1);
    if (!e) return event.tags.some(tag => tag[0] === "a")
        ? { status: "unsupported-reference", reference: null } : invalid;
    if (!isHex64(e[1])) return invalid;
    // NIP-25's fourth element is an author; legacy NIP-10-style markers
    // only affect where an auxiliary author hint is read, never selection.
    const fourth = e[3];
    const marker = fourth?.trim().toLowerCase();
    const eAuthor = isHex64(fourth) ? fourth
        : marker === "root" || marker === "reply" || marker === "mention" ? e[4] || null : null;
    if (fourth && !isHex64(fourth) && !["root", "reply", "mention"].includes(marker ?? "")) return invalid;
    if (eAuthor && !isHex64(eAuthor)) return invalid;
    const p = event.tags.filter(tag => tag[0] === "p").at(-1);
    if (p && !isHex64(p[1])) return invalid;
    const pAuthor = p?.[1] ?? null;
    if (eAuthor && pAuthor && eAuthor !== pAuthor) return invalid;
    const kinds = new Set<number>();
    for (const tag of event.tags.filter(tag => tag[0] === "k")) {
        const kind = Number(tag[1]);
        if (tag[1] === undefined || !Number.isInteger(kind) || kind < 0 || kind > 65535 || tag[1] !== String(kind)) return invalid;
        kinds.add(kind);
    }
    if (kinds.size > 1) return invalid;
    return { status: "valid", reference: { eventId: e[1], authorHint: pAuthor ?? eAuthor,
        targetKindHint: [...kinds][0] ?? null,
        relayHints: RelayConfigUtils.sanitizeExternalRelayUrls([e[2] ?? "", p?.[2] ?? ""]) } };
}

/** Compare only known target facts; reference hints are never target evidence. */
export function matchesReactionReferenceTarget(
    reference: RelatedEventReference,
    target: ReactionReferenceTarget,
): boolean {
    return reference.eventId === target.eventId
        && (!reference.authorHint || target.targetAuthorPubkey == null
            || reference.authorHint === target.targetAuthorPubkey)
        && (reference.targetKindHint == null || target.targetKind == null
            || reference.targetKindHint === target.targetKind);
}
