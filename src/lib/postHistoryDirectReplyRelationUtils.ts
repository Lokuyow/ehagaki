import {
    hasUnambiguousPostHistoryParentReference,
    parsePostHistoryThreadReferences,
} from "./postHistoryNip10Utils";
import type { NostrEvent } from "./types";

export type PostHistoryDirectReplyEventKind = 1 | 42;

export interface PostHistoryDirectReplyParentContext {
    eventId: string;
    eventKind: PostHistoryDirectReplyEventKind;
    channelEventId: string | null;
    createdAt: number;
    relayHints: string[];
}

export type PostHistoryDirectReplyRelationFailureReason =
    | "unsupported-child-kind"
    | "parent-reference-missing-or-ambiguous"
    | "parent-id-mismatch"
    | "kind-mismatch"
    | "channel-missing"
    | "channel-mismatch"
    | "self-reference";

export type PostHistoryDirectReplyRelationValidation =
    | { valid: true; parentEventId: string }
    | { valid: false; reason: PostHistoryDirectReplyRelationFailureReason };

export function isPostHistoryDirectReplyEventKind(
    kind: unknown,
): kind is PostHistoryDirectReplyEventKind {
    return kind === 1 || kind === 42;
}

export function buildPostHistoryDirectReplyParentContext(input: {
    event: Pick<NostrEvent, "id" | "kind" | "tags" | "created_at">;
    relayHints?: string[];
}): PostHistoryDirectReplyParentContext | null {
    if (!isPostHistoryDirectReplyEventKind(input.event.kind) || !input.event.id) {
        return null;
    }

    const references = parsePostHistoryThreadReferences(input.event);
    if (input.event.kind === 42 && !references.channelEventId) {
        return null;
    }

    return {
        eventId: input.event.id,
        eventKind: input.event.kind,
        channelEventId: input.event.kind === 42 ? references.channelEventId : null,
        createdAt: input.event.created_at,
        relayHints: [...(input.relayHints ?? [])],
    };
}

export function validatePostHistoryDirectReplyRelation(input: {
    child: Pick<NostrEvent, "id" | "kind" | "tags">;
    parent: PostHistoryDirectReplyParentContext;
}): PostHistoryDirectReplyRelationValidation {
    if (!isPostHistoryDirectReplyEventKind(input.child.kind)) {
        return { valid: false, reason: "unsupported-child-kind" };
    }
    if (input.child.id === input.parent.eventId) {
        return { valid: false, reason: "self-reference" };
    }

    const references = parsePostHistoryThreadReferences(input.child);
    if (!hasUnambiguousPostHistoryParentReference(references)) {
        return { valid: false, reason: "parent-reference-missing-or-ambiguous" };
    }
    if (references.parentId !== input.parent.eventId) {
        return { valid: false, reason: "parent-id-mismatch" };
    }
    if (input.child.kind !== input.parent.eventKind) {
        return { valid: false, reason: "kind-mismatch" };
    }
    if (input.child.kind === 42) {
        if (!references.channelEventId || !input.parent.channelEventId) {
            return { valid: false, reason: "channel-missing" };
        }
        if (references.channelEventId !== input.parent.channelEventId) {
            return { valid: false, reason: "channel-mismatch" };
        }
    }

    return { valid: true, parentEventId: input.parent.eventId };
}
