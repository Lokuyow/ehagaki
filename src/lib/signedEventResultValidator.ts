import { getEventHash, validateEvent, verifyEvent } from "nostr-tools";
import type { NostrEvent } from "./types";

function cloneTags(tags: unknown): string[][] {
    if (!Array.isArray(tags)) {
        throw new Error("Invalid signed event result");
    }

    return tags.map((tag) => {
        if (!Array.isArray(tag) || !tag.every((value) => typeof value === "string")) {
            throw new Error("Invalid signed event result");
        }
        return [...tag];
    });
}

function tagsEqual(left: string[][], right: string[][]): boolean {
    return left.length === right.length
        && left.every((tag, tagIndex) => (
            tag.length === right[tagIndex]?.length
            && tag.every((value, valueIndex) => value === right[tagIndex][valueIndex])
        ));
}

/**
 * Verifies that a signer returned the exact Nostr signing fields requested by
 * the caller, signed by the active operation's expected public key.
 */
export function validateSignedEventResult(
    template: unknown,
    signedEvent: unknown,
    expectedPubkey: string,
): NostrEvent {
    if (!template || typeof template !== "object"
        || !signedEvent || typeof signedEvent !== "object"
        || typeof expectedPubkey !== "string" || !expectedPubkey) {
        throw new Error("Invalid signed event result");
    }

    const requested = template as Record<string, unknown>;
    const returned = signedEvent as Record<string, unknown>;
    const requestedTags = cloneTags(requested.tags);
    const returnedTags = cloneTags(returned.tags);
    const snapshot = {
        id: returned.id,
        pubkey: returned.pubkey,
        created_at: returned.created_at,
        kind: returned.kind,
        tags: returnedTags,
        content: returned.content,
        sig: returned.sig,
    } as NostrEvent;

    try {
        if (!validateEvent(snapshot as never)
            || snapshot.id !== getEventHash(snapshot as never)
            || !verifyEvent(snapshot as never)
            || snapshot.pubkey !== expectedPubkey
            || snapshot.kind !== requested.kind
            || snapshot.content !== requested.content
            || snapshot.created_at !== requested.created_at
            || !tagsEqual(returnedTags, requestedTags)) {
            throw new Error("Invalid signed event result");
        }
    } catch {
        throw new Error("Invalid signed event result");
    }

    return snapshot;
}
