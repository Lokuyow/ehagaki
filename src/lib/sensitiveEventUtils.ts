import { validateEvent, verifyEvent } from "nostr-tools";
import { RelayConfigUtils } from "./relayConfigUtils";
import { parsePostHistoryThreadReferences } from "./postHistoryNip10Utils";
import { parseNip22CommentReferences } from "./postHistoryNip22Utils";
import { createPlainNostrEventSnapshot, isSignedNostrEvent } from "./postHistoryEventUtils";
import type { NostrEvent } from "./types";
import { isHex64 } from "./utils/nostrHexUtils";

export const SENSITIVE_TEXT_NOTE_KIND = 36;
export const NIP22_COMMENT_KIND = 1111;
export const SENSITIVE_COMMENT_KIND = 3636;

export type SensitivePostKind =
    | 1
    | typeof SENSITIVE_TEXT_NOTE_KIND
    | 42
    | typeof NIP22_COMMENT_KIND
    | typeof SENSITIVE_COMMENT_KIND;

export function resolveSubmissionKind(input: {
    channel: boolean;
    hasReply: boolean;
    replyKind?: number;
    failClosedContentWarning: boolean;
    contentWarningEnabled: boolean;
}): SensitivePostKind | null {
    if (input.channel) return 42;
    if (input.hasReply) {
        if (input.replyKind === 1) {
            return input.failClosedContentWarning && input.contentWarningEnabled
                ? SENSITIVE_COMMENT_KIND
                : 1;
        }
        if (
            input.replyKind === SENSITIVE_TEXT_NOTE_KIND
            || input.replyKind === NIP22_COMMENT_KIND
            || input.replyKind === SENSITIVE_COMMENT_KIND
        ) {
            return input.failClosedContentWarning && input.contentWarningEnabled
                ? SENSITIVE_COMMENT_KIND
                : NIP22_COMMENT_KIND;
        }
        return null;
    }
    return input.failClosedContentWarning && input.contentWarningEnabled
        ? SENSITIVE_TEXT_NOTE_KIND
        : 1;
}

function resolveNip10RootEvent(event: NostrEvent): {
    id: string;
    relayHint: string;
    pubkey: string | null;
} | null {
    const references = parsePostHistoryThreadReferences(event);
    const rootCount = event.tags.filter((tag) => tag[0] === "e" && tag[3]?.toLowerCase() === "root").length;
    const replyCount = event.tags.filter((tag) => tag[0] === "e" && tag[3]?.toLowerCase() === "reply").length;
    if (
        references.issues.includes("conflicting-reply-targets")
        || rootCount > 1
        || replyCount > 1
    ) return null;
    const id = references.rootId ?? event.id;
    const relayHint = id === event.id
        ? references.replyRelayHint ?? ""
        : references.rootRelayHint ?? "";
    const pubkey = id === event.id
        ? event.pubkey
        : references.rootAuthorHint;
    return { id, relayHint, pubkey };
}

/** Build NIP-22 root and direct-parent tags from a verified selected event. */
export function buildNip22ReplyTags(
    parent: NostrEvent,
    parentRelayHint = "",
    verifiedRoot?: NostrEvent,
): string[][] | null {
    const sanitizedParentHint = RelayConfigUtils.sanitizeExternalRelayUrls(
        parentRelayHint ? [parentRelayHint] : [], { limit: 1 },
    )[0] ?? "";
    if (parent.kind === SENSITIVE_TEXT_NOTE_KIND) {
        return [
            ["E", parent.id, sanitizedParentHint, parent.pubkey],
            ["K", String(SENSITIVE_TEXT_NOTE_KIND)],
            ["P", parent.pubkey],
            ["e", parent.id, sanitizedParentHint, parent.pubkey],
            ["k", String(SENSITIVE_TEXT_NOTE_KIND)],
            ["p", parent.pubkey],
        ];
    }

    if (parent.kind === 1) {
        const root = resolveNip10RootEvent(parent);
        const verifiedRootAuthor = verifiedRoot
            && verifiedRoot.id === root?.id
            && verifiedRoot.kind === 1
            && isFullyVerifiedEvent(verifiedRoot)
            ? verifiedRoot.pubkey
            : null;
        if (!root || (root.id !== parent.id && !root.pubkey && !verifiedRootAuthor)) return null;
        const rootPubkey = root.pubkey ?? verifiedRootAuthor;
        const rootHint = RelayConfigUtils.sanitizeExternalRelayUrls(
            root.relayHint ? [root.relayHint] : [], { limit: 1 },
        )[0] ?? "";
        return [
            ["E", root.id, rootHint, ...(rootPubkey ? [rootPubkey] : [])],
            ["K", "1"],
            ...(rootPubkey ? [["P", rootPubkey]] : []),
            ["e", parent.id, sanitizedParentHint, parent.pubkey],
            ["k", "1"],
            ["p", parent.pubkey],
        ];
    }

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

export function getSensitiveCompanionReference(event: NostrEvent): string | null {
    if (event.kind !== 1 || event.content !== "" || !Array.isArray(event.tags)) return null;
    const contentWarnings = event.tags.filter((tag) => tag[0] === "content-warning");
    const references = event.tags.filter((tag) => tag[0] === "c");
    if (
        contentWarnings.length !== 1
        || contentWarnings[0]!.length > 2
        || references.length !== 1
        || event.tags.some((tag) => tag[0] !== "content-warning" && tag[0] !== "c")
        || !isHex64(references[0]![1])
        || references[0]!.length > 3
    ) return null;
    return references[0]![1]!;
}

export function verifySensitiveCompanionLink(
    companion: NostrEvent,
    target: NostrEvent | null | undefined,
): target is NostrEvent {
    const referenceId = getSensitiveCompanionReference(companion);
    return !!referenceId
        && isFullyVerifiedEvent(companion)
        && !!target
        && target.id === referenceId
        && target.kind === SENSITIVE_TEXT_NOTE_KIND
        && target.pubkey === companion.pubkey
        && isFullyVerifiedEvent(target);
}

/** Relay evidence for a canonical event never includes the companion's fetch provenance. */
export function getSensitiveCanonicalRelayHints(
    companion: NostrEvent,
    options: {
        fetchedRelayUrl?: string | null;
        localRelayHints?: string[];
        limit?: number;
    } = {},
): string[] {
    const canonicalHint = companion.tags
        .filter((tag) => tag[0] === "c")
        .map((tag) => tag[2] ?? "");
    return RelayConfigUtils.sanitizeExternalRelayUrls([
        ...(options.fetchedRelayUrl ? [options.fetchedRelayUrl] : []),
        ...canonicalHint,
        ...(options.localRelayHints ?? []),
    ], {
        limit: options.limit ?? RelayConfigUtils.EXTERNAL_INPUT_RELAY_LIMIT,
    });
}

export async function resolveSensitiveCompanionCanonicalEvent(
    companion: NostrEvent,
    fetchCanonical: (eventId: string, relayHints: string[]) => Promise<NostrEvent | null>,
    isDeleted?: (event: NostrEvent) => Promise<boolean>,
): Promise<NostrEvent | null> {
    const eventId = getSensitiveCompanionReference(companion);
    if (!eventId || !isFullyVerifiedEvent(companion)) return null;
    const relayHints = RelayConfigUtils.sanitizeExternalRelayUrls(
        companion.tags.filter((tag) => tag[0] === "c").map((tag) => tag[2] ?? ""),
        { limit: 1 },
    );
    const target = await fetchCanonical(eventId, relayHints);
    if (!verifySensitiveCompanionLink(companion, target)) return null;
    if (isDeleted && await isDeleted(target)) return null;
    return target;
}

export function createSensitiveTextNoteCompanion(
    canonical: NostrEvent,
    acceptedRelayUrls: string[],
): NostrEvent | null {
    if (!isFullyVerifiedEvent(canonical) || canonical.kind !== SENSITIVE_TEXT_NOTE_KIND) {
        return null;
    }
    const contentWarning = canonical.tags.find(
        (tag) => tag[0] === "content-warning" && tag.length <= 2,
    );
    if (!contentWarning) return null;
    const hint = RelayConfigUtils.sanitizeExternalRelayUrls(acceptedRelayUrls, { limit: 1 })[0];
    return {
        kind: 1,
        pubkey: canonical.pubkey,
        created_at: canonical.created_at,
        content: "",
        tags: [
            [...contentWarning],
            ["c", canonical.id, ...(hint ? [hint] : [])],
        ],
    } as NostrEvent;
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
