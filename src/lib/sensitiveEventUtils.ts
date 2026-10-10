import { validateEvent, verifyEvent } from "nostr-tools";
import { RelayConfigUtils } from "./relayConfigUtils";
import { parseNip22CommentReferences } from "./postHistoryNip22Utils";
import { createPlainNostrEventSnapshot, isSignedNostrEvent } from "./postHistoryEventUtils";
import type { NostrEvent } from "./types";

export const NIP22_COMMENT_KIND = 1111;

export type SensitivePostKind = 1 | 42 | typeof NIP22_COMMENT_KIND;

export function resolveSubmissionKind(input: {
    channel: boolean;
    hasReply: boolean;
    replyKind?: number;
}): SensitivePostKind | null {
    if (input.channel) return 42;
    if (input.hasReply) {
        if (input.replyKind === 1) return 1;
        if (input.replyKind === NIP22_COMMENT_KIND) return NIP22_COMMENT_KIND;
        return null;
    }
    return 1;
}

/** Build NIP-22 root and direct-parent tags from a verified selected event. */
export function buildNip22ReplyTags(
    parent: NostrEvent,
    parentRelayHint = "",
): string[][] | null {
    const sanitizedParentHint = RelayConfigUtils.sanitizeExternalRelayUrls(
        parentRelayHint ? [parentRelayHint] : [], { limit: 1 },
    )[0] ?? "";
    if (parent.kind !== NIP22_COMMENT_KIND) return null;
    const parsed = parseNip22CommentReferences(parent);
    if (!parsed.valid || !parsed.rootKind || !parsed.parentKind) return null;
    return [
        ...parsed.rootTags.map((tag) => [...tag]),
        ["K", parsed.rootKind],
        ...(parsed.rootPubkey ? [["P", parsed.rootPubkey]] : []),
        ["e", parent.id, sanitizedParentHint, parent.pubkey],
        ["k", String(parent.kind)],
        ["p", parent.pubkey],
    ];
}

export function isFullyVerifiedEvent(event: unknown): event is NostrEvent {
    try {
        if (!isSignedNostrEvent(event)) return false;
        const snapshot = createPlainNostrEventSnapshot(event);
        return validateEvent(snapshot as never) && verifyEvent(snapshot as never);
    } catch {
        return false;
    }
}
