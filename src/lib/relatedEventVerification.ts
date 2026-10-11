import { attestFullyVerifiedPostHistoryRawEvent } from "./postHistoryRawEventVerification";

export interface RelatedEventReference {
    eventId: string;
    authorHint: string | null;
    authorHints?: string[];
    targetKindHint?: number | null;
    relayHints: string[];
}

/** Verify the signed wire event independently of presentation or persistence. */
export function verifyRelatedEvent(event: unknown, reference?: RelatedEventReference | null) {
    const verified = attestFullyVerifiedPostHistoryRawEvent(event);
    if (!verified) return null;
    if (reference && (verified.event.id !== reference.eventId
        || (reference.authorHint && verified.event.pubkey !== reference.authorHint)
        || (reference.authorHints?.length && !reference.authorHints.includes(verified.event.pubkey))
        || (reference.targetKindHint != null && verified.event.kind !== reference.targetKindHint))) return null;
    return verified;
}
