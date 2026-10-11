import { resolveKind7ReactionTargetEventId } from "./postHistoryNip10Utils";
import { resolvePostHistoryReactionDisplayContent } from "./postHistoryDialogPresentation";
import { buildPostContentRenderModel } from "./postContentPreview";
import { isRepostOuterKind } from "./postRepostUtils";
import { RelayConfigUtils } from "./relayConfigUtils";
import type { RelatedEventReference } from "./relatedEventVerification";
import type { NostrEvent } from "./types";
import { isHex64 } from "./utils/nostrHexUtils";

// This only limits related presentation, never the generic main preview.
export const COMPOSER_RELATED_PREVIEW_KINDS = [1, 6, 7, 16, 42, 1111] as const;

export function parseReactionReference(event: Pick<NostrEvent, "kind" | "tags">):
    { status: "valid"; reference: RelatedEventReference }
    | { status: "invalid-reference" | "unsupported-reference"; reference: null } {
    const invalid = { status: "invalid-reference", reference: null } as const;
    if (event.kind !== 7) return invalid;
    const e = event.tags.filter(tag => tag[0] === "e").at(-1);
    if (!e) return event.tags.some(tag => tag[0] === "a")
        ? { status: "unsupported-reference", reference: null } : invalid;
    if (!isHex64(e[1]) || resolveKind7ReactionTargetEventId(event) !== e[1]) return invalid;
    // NIP-25's fourth element is an author, whereas legacy markers use the fifth.
    const fourth = e[3];
    const marker = fourth?.trim().toLowerCase();
    const eAuthor = isHex64(fourth) ? fourth
        : marker === "root" || marker === "reply" || marker === "mention" ? e[4] || null : null;
    if (fourth && !isHex64(fourth) && !["root", "reply", "mention"].includes(marker ?? "")) return invalid;
    if (eAuthor && !isHex64(eAuthor)) return invalid;
    const p = event.tags.filter(tag => tag[0] === "p").at(-1);
    if (p && !isHex64(p[1])) return invalid;
    const pAuthor = p?.[1] ?? null;
    if (eAuthor && pAuthor && eAuthor !== pAuthor) return invalid;
    const kinds = new Set<number>();
    for (const tag of event.tags.filter(tag => tag[0] === "k")) {
        const kind = Number(tag[1]);
        if (tag[1] === undefined || !Number.isInteger(kind) || kind < 0 || kind > 65535 || tag[1] !== String(kind)) return invalid;
        kinds.add(kind);
    }
    if (kinds.size > 1) return invalid;
    return { status: "valid", reference: { eventId: e[1], authorHint: eAuthor ?? pAuthor,
        targetKindHint: [...kinds][0] ?? null,
        relayHints: RelayConfigUtils.sanitizeExternalRelayUrls([e[2] ?? "", p?.[2] ?? ""]) } };
}

/** Repost content is opaque even when it contains a signed embedded event. */
export function buildComposerInteractionRenderModel(event: NostrEvent) {
    if (isRepostOuterKind(event.kind)) {
        return buildPostContentRenderModel({ kind: event.kind, sourceContent: "", tags: [], media: [] });
    }
    const content = resolvePostHistoryReactionDisplayContent(event.content);
    return buildPostContentRenderModel({ kind: event.kind, sourceContent: event.content,
        displayContent: content === "+" ? "❤️" : content, tags: event.tags, media: [] });
}
