import { isHex64 } from "./utils/nostrHexUtils";
import type { NostrEvent } from "./types";
import { isFullyVerifiedEvent } from "./sensitiveEventUtils";

export const SENSITIVE_CONTENT_PAYLOAD_KIND = 36;
export const SENSITIVE_CONTENT_STRUCTURE_KINDS = [1, 42, 1111] as const;

export type SensitiveContentStructureKind =
    (typeof SENSITIVE_CONTENT_STRUCTURE_KINDS)[number];

export interface SensitivePayloadReference {
    eventId: string;
    relayHint: string | null;
}

/** A candidate reference is only a lookup key; it is not a verified association. */
export function getSensitivePayloadReference(
    structure: Pick<NostrEvent, "kind" | "content" | "tags">,
): SensitivePayloadReference | null {
    if (
        !SENSITIVE_CONTENT_STRUCTURE_KINDS.includes(
            structure.kind as SensitiveContentStructureKind,
        )
        || structure.content !== ""
        || !structure.tags.some((tag) => tag[0] === "content-warning")
    ) {
        return null;
    }

    const references = structure.tags.filter((tag) => tag[0] === "c");
    if (references.length !== 1) return null;
    const reference = references[0]!;
    if (
        !isHex64(reference[1])
        || reference.length > 3
    ) {
        return null;
    }

    return {
        eventId: reference[1]!,
        relayHint: reference[2] || null,
    };
}

export function isSensitivePayloadStructure(event: NostrEvent): boolean {
    return getSensitivePayloadReference(event) !== null
        && isFullyVerifiedEvent(event);
}

export function buildSensitivePayloadEvent(
    structureKind: SensitiveContentStructureKind,
    content: string,
    pubkey: string,
    createdAt: number,
): Omit<NostrEvent, "id" | "sig"> {
    return {
        kind: SENSITIVE_CONTENT_PAYLOAD_KIND,
        pubkey,
        created_at: createdAt,
        content,
        tags: [["k", String(structureKind)]],
    } as Omit<NostrEvent, "id" | "sig">;
}

export function buildSensitiveStructureEvent(
    original: Omit<NostrEvent, "id" | "sig">,
    payloadId: string,
    relayHint?: string | null,
): Omit<NostrEvent, "id" | "sig"> {
    return {
        ...original,
        content: "",
        tags: [
            ...original.tags.map((tag) => [...tag]),
            ["c", payloadId, ...(relayHint ? [relayHint] : [])],
        ],
    };
}

export function verifySensitivePayloadLink(
    structure: NostrEvent,
    payload: NostrEvent | null | undefined,
    expectedPayloadId = getSensitivePayloadReference(structure)?.eventId,
): payload is NostrEvent {
    if (
        !expectedPayloadId
        || !isSensitivePayloadStructure(structure)
        || !payload
        || payload.id !== expectedPayloadId
        || payload.kind !== SENSITIVE_CONTENT_PAYLOAD_KIND
        || payload.pubkey !== structure.pubkey
        || !isFullyVerifiedEvent(payload)
    ) {
        return false;
    }

    const kindTags = payload.tags.filter((tag) => tag[0] === "k");
    return kindTags.length === 1
        && kindTags[0]!.length >= 2
        && kindTags[0]![1] === String(structure.kind);
}
