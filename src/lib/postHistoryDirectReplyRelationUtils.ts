import {
    hasUnambiguousPostHistoryParentReference,
    parsePostHistoryThreadReferences,
} from "./postHistoryNip10Utils";
import type { NostrEvent } from "./types";

export type PostHistoryDirectReplyEventKind = 1 | 36 | 42 | 1111 | 3636;

export interface PostHistoryDirectReplyParentContext {
    eventId: string;
    eventKind: PostHistoryDirectReplyEventKind;
    channelEventId: string | null;
    rootEventId?: string;
    rootKind?: number | string;
    rootPubkey?: string | null;
    eventPubkey?: string | null;
    rootReferenceTags?: string[][];
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
    return kind === 1 || kind === 36 || kind === 42 || kind === 1111 || kind === 3636;
}

export function buildPostHistoryDirectReplyParentContext(input: {
    event: Pick<NostrEvent, "id" | "kind" | "tags" | "created_at"> & Partial<Pick<NostrEvent, "pubkey">>;
    relayHints?: string[];
}): PostHistoryDirectReplyParentContext | null {
    if (!isPostHistoryDirectReplyEventKind(input.event.kind) || !input.event.id) {
        return null;
    }

    const references = parsePostHistoryThreadReferences(input.event);
    if (input.event.kind === 42 && !references.channelEventId) {
        return null;
    }

    if ((input.event.kind === 1111 || input.event.kind === 3636)
        && (!(references.rootReferenceTags?.length) || references.rootKind == null
            || (!references.rootPubkey && references.rootReferenceTags[0]?.[0] !== "I")
            || (!references.parentId && references.parentReferenceTags?.[0]?.[0] !== "i")
            || references.parentKind == null
            || (!references.parentPubkey && references.parentReferenceTags?.[0]?.[0] !== "i")
            || references.issues.length > 0)) return null;

    const isComment = input.event.kind === 1111 || input.event.kind === 3636;
    const rootEventId = isComment
        ? references.rootId ?? input.event.id
        : input.event.kind === 1
            ? references.rootId ?? input.event.id
            : input.event.id;
    const rootKind = isComment
        ? references.rootKind!
        : input.event.kind === 1 ? 1 : input.event.kind;
    const rootPubkey = isComment
        ? references.rootPubkey!
        : input.event.kind === 1 && rootEventId !== input.event.id
            ? references.rootAuthorHint
            : input.event.pubkey ?? null;
    const rootReferenceTags = isComment
        ? references.rootReferenceTags ?? []
        : input.event.kind === 1 && rootEventId !== input.event.id
            ? [["E", rootEventId, references.rootRelayHint ?? "", rootPubkey ?? ""]]
            : [["E", rootEventId, "", rootPubkey ?? ""]];

    return {
        eventId: input.event.id,
        eventKind: input.event.kind,
        channelEventId: input.event.kind === 42 ? references.channelEventId : null,
        rootEventId,
        rootKind,
        rootPubkey,
        eventPubkey: input.event.pubkey ?? null,
        rootReferenceTags,
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
    const childIsComment = input.child.kind === 1111 || input.child.kind === 3636;
    if (!childIsComment && input.child.kind !== input.parent.eventKind) {
        return { valid: false, reason: "kind-mismatch" };
    }
    if (childIsComment) {
        if (input.parent.eventKind === 42) return { valid: false, reason: "kind-mismatch" };
        const sameRootReference = (left: string[][], right: string[][]): boolean => {
            const l = left[0];
            const r = right[0];
            return !!l && !!r && l[0] === r[0] && l[1] === r[1];
        };
        if (
            references.parentKind !== String(input.parent.eventKind)
            || references.rootKind !== String(input.parent.rootKind ?? input.parent.eventKind)
            || !sameRootReference(
                references.rootReferenceTags ?? [],
                input.parent.rootReferenceTags ?? [["E", input.parent.rootEventId ?? input.parent.eventId]],
            )
            || (input.parent.eventPubkey && references.parentPubkey !== input.parent.eventPubkey)
            || (input.parent.rootPubkey && references.rootPubkey !== input.parent.rootPubkey)
        ) {
            return { valid: false, reason: "kind-mismatch" };
        }
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
