import { parseKind42ThreadReferences } from "./postHistoryNip10Utils";
import type { NostrEvent } from "./types";
import type { PostHistoryRecord } from "./storage/ehagakiDb";

export interface PostHistoryChannelReference {
    channelEventId?: string;
    channelRelayHints?: string[];
}

function cloneTags(tags: string[][]): string[][] {
    return tags.map((tag) => [...tag]);
}

function isSameTagList(left: unknown, right: string[][]): boolean {
    if (!Array.isArray(left) || left.length !== right.length) {
        return false;
    }

    return left.every((tag, tagIndex) => {
        if (!Array.isArray(tag) || tag.length !== right[tagIndex].length) {
            return false;
        }

        return tag.every((value, valueIndex) => value === right[tagIndex][valueIndex]);
    });
}

export function cloneNostrEvent(event: NostrEvent): NostrEvent {
    return {
        ...event,
        tags: cloneTags(event.tags),
    };
}

/**
 * Creates a NIP-01 event snapshot for cryptographic verification. Unlike the
 * general clone above, this deliberately drops symbols, library caches, and
 * non-wire properties such as nostr-tools' verifiedSymbol.
 */
export function createPlainNostrEventSnapshot(event: NostrEvent): NostrEvent {
    return {
        id: event.id,
        pubkey: event.pubkey,
        created_at: event.created_at,
        kind: event.kind,
        tags: cloneTags(event.tags),
        content: event.content,
        sig: event.sig,
    };
}

export function isSignedNostrEvent(rawEvent: unknown): rawEvent is NostrEvent {
    if (!rawEvent || typeof rawEvent !== "object") {
        return false;
    }

    const candidate = rawEvent as Partial<NostrEvent>;
    return typeof candidate.id === "string"
        && typeof candidate.pubkey === "string"
        && typeof candidate.kind === "number"
        && typeof candidate.content === "string"
        && typeof candidate.created_at === "number"
        && typeof candidate.sig === "string"
        && Array.isArray(candidate.tags)
        && candidate.tags.every((tag) =>
            Array.isArray(tag)
            && tag.every((value) => typeof value === "string"),
        );
}

export function isSameSignedNostrEvent(rawEvent: unknown, event: NostrEvent): boolean {
    if (!rawEvent || typeof rawEvent !== "object") {
        return false;
    }

    const candidate = rawEvent as Partial<NostrEvent>;
    return candidate.id === event.id
        && candidate.pubkey === event.pubkey
        && candidate.kind === event.kind
        && candidate.content === event.content
        && candidate.created_at === event.created_at
        && candidate.sig === event.sig
        && isSameTagList(candidate.tags, event.tags);
}

export function extractPostHistoryChannelReference(
    event: Pick<NostrEvent, "kind" | "tags">,
): PostHistoryChannelReference {
    if (event.kind !== 42) {
        return {};
    }

    const references = parseKind42ThreadReferences(event);
    if (!references.channelEventId) {
        return {};
    }

    return {
        channelEventId: references.channelEventId,
        ...(references.channelRelayHints.length > 0
            ? { channelRelayHints: references.channelRelayHints }
            : {}),
    };
}

export function isPostHistoryRawEventConsistent(
    rawEvent: unknown,
    record: {
        eventId: string;
        pubkeyHex: string;
        kind: number;
        content: string;
        tags: string[][];
        createdAt: number;
    },
): rawEvent is NostrEvent {
    return isSignedNostrEvent(rawEvent)
        && rawEvent.id === record.eventId
        && rawEvent.pubkey === record.pubkeyHex
        && rawEvent.kind === record.kind
        && rawEvent.content === record.content
        && rawEvent.created_at === record.createdAt
        && isSameTagList(rawEvent.tags, record.tags);
}

/**
 * Builds an in-memory history record for an event shown in the dialog
 * (thread graph node, quote preview). It is an action/render adapter only and
 * is never persisted.
 */
export function createTransientPostHistoryRecord(
    event: NostrEvent,
    relayUrls: readonly string[] = [],
    now: number = Date.now(),
): PostHistoryRecord {
    return {
        id: event.id,
        eventId: event.id,
        pubkeyHex: event.pubkey,
        kind: event.kind,
        content: event.content,
        tags: cloneTags(event.tags),
        createdAt: event.created_at,
        postedAt: event.created_at * 1000,
        relayHints: [...relayUrls],
        acceptedRelays: [...relayUrls],
        fetchedRelays: [...relayUrls],
        media: [],
        rawEvent: event,
        updatedAt: now,
        schemaVersion: 1,
    };
}
