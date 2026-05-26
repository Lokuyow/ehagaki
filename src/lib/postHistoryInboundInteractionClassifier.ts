import {
    parseKind1ThreadReferences,
    resolveKind7ReactionTargetEventId,
    type PostHistoryThreadReferences,
} from "./postHistoryNip10Utils";
import type { NostrEvent } from "./types";

export type PostHistoryInboundInteractionType =
    | "direct-reply"
    | "direct-reply-candidate"
    | "mention-like"
    | "reaction"
    | "unsupported";

export interface PostHistoryInboundInteractionClassification {
    type: PostHistoryInboundInteractionType;
    event: NostrEvent;
    references: PostHistoryThreadReferences | null;
    parentEventId: string | null;
    rootEventId: string | null;
    targetEventId: string | null;
    targetAuthorPubkey: string | null;
    reason: string;
}

const HEX_64_PATTERN = /^[0-9a-f]{64}$/i;

function isHex64(value: unknown): value is string {
    return typeof value === "string" && HEX_64_PATTERN.test(value);
}

function eventHasPTag(event: NostrEvent, pubkeyHex: string): boolean {
    return event.tags.some((tag) => tag[0] === "p" && tag[1] === pubkeyHex);
}

function findFirstTagValue(event: NostrEvent, tagName: string): string | null {
    for (const tag of event.tags) {
        if (tag[0] === tagName && isHex64(tag[1])) {
            return tag[1];
        }
    }

    return null;
}

export function classifyPostHistoryInboundInteraction(input: {
    event: NostrEvent;
    ownerPubkeyHex: string;
    ownerPostEventIds: ReadonlySet<string>;
}): PostHistoryInboundInteractionClassification {
    const { event, ownerPubkeyHex, ownerPostEventIds } = input;

    if (event.kind === 7) {
        // TODO(PR5): Store reactions in postHistoryReactionEvents with ownerPubkeyHex scope.
        const targetEventId = resolveKind7ReactionTargetEventId(event);
        const targetAuthorPubkey = findFirstTagValue(event, "p");

        return {
            type: "reaction",
            event,
            references: null,
            parentEventId: null,
            rootEventId: null,
            targetEventId,
            targetAuthorPubkey,
            reason: "reaction-not-implemented",
        };
    }

    if (event.kind !== 1) {
        return {
            type: "unsupported",
            event,
            references: null,
            parentEventId: null,
            rootEventId: null,
            targetEventId: null,
            targetAuthorPubkey: null,
            reason: "unsupported-kind",
        };
    }

    const references = parseKind1ThreadReferences(event);
    const includesOwnerPTag = eventHasPTag(event, ownerPubkeyHex);
    if (!includesOwnerPTag) {
        return {
            type: "unsupported",
            event,
            references,
            parentEventId: references.parentId,
            rootEventId: references.rootId,
            targetEventId: references.parentId,
            targetAuthorPubkey: ownerPubkeyHex,
            reason: "missing-owner-p-tag",
        };
    }

    if (
        references.parentId
        && references.parentId !== event.id
    ) {
        const ownerPostParentConfirmed = ownerPostEventIds.has(references.parentId);
        return {
            type: ownerPostParentConfirmed ? "direct-reply" : "direct-reply-candidate",
            event,
            references,
            parentEventId: references.parentId,
            rootEventId: references.rootId,
            targetEventId: references.parentId,
            targetAuthorPubkey: ownerPubkeyHex,
            reason: ownerPostParentConfirmed
                ? "owner-post-parent"
                : "owner-post-parent-unconfirmed",
        };
    }

    return {
        type: "mention-like",
        event,
        references,
        parentEventId: references.parentId,
        rootEventId: references.rootId,
        targetEventId: references.parentId ?? references.rootId,
        targetAuthorPubkey: ownerPubkeyHex,
        reason: references.rootId
                ? "root-only-or-parent-missing"
                : "mention-without-thread-parent",
    };
}
