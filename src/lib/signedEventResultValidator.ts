import { getEventHash, validateEvent, verifyEvent, type EventTemplate } from "nostr-tools";
import type { NostrEvent } from "./types";

type SignerEventTemplate = EventTemplate & Record<string, unknown>;

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

function snapshotEventTemplate(template: unknown): EventTemplate {
    if (!template || typeof template !== "object") {
        throw new Error("Invalid signed event result");
    }

    const source = template as Record<string, unknown>;
    if (typeof source.kind !== "number"
        || typeof source.content !== "string"
        || typeof source.created_at !== "number") {
        throw new Error("Invalid signed event result");
    }

    return {
        kind: source.kind,
        content: source.content,
        created_at: source.created_at,
        tags: cloneTags(source.tags),
    };
}

function cloneSignerEventTemplate(template: unknown): SignerEventTemplate {
    const signingFields = snapshotEventTemplate(template);
    return {
        ...(template as Record<string, unknown>),
        ...signingFields,
    } as SignerEventTemplate;
}

/**
 * Captures the caller's requested signing fields before an external signer can
 * mutate them, and provides the signer with a separate mutable copy.
 */
export function prepareSignedEventTemplate(template: unknown): {
    expectedTemplate: EventTemplate;
    signerTemplate: SignerEventTemplate;
} {
    return {
        expectedTemplate: snapshotEventTemplate(template),
        signerTemplate: cloneSignerEventTemplate(template),
    };
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

    const requested = snapshotEventTemplate(template);
    const returned = signedEvent as Record<string, unknown>;
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
            || !tagsEqual(returnedTags, requested.tags)) {
            throw new Error("Invalid signed event result");
        }
    } catch {
        throw new Error("Invalid signed event result");
    }

    return snapshot;
}
