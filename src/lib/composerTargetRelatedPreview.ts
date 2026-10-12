import { resolvePostHistoryReactionDisplayContent } from "./postHistoryDialogPresentation";
import { buildPostContentRenderModel } from "./postContentPreview";
import { isRepostOuterKind } from "./postRepostUtils";
import type { NostrEvent } from "./types";

// This only limits related presentation, never the generic main preview.
export const COMPOSER_RELATED_PREVIEW_KINDS = [1, 6, 7, 16, 42, 1111] as const;

/** Repost content is opaque even when it contains a signed embedded event. */
export function buildComposerInteractionRenderModel(event: NostrEvent) {
    if (isRepostOuterKind(event.kind)) {
        return buildPostContentRenderModel({ kind: event.kind, sourceContent: "", tags: [], media: [] });
    }
    const content = resolvePostHistoryReactionDisplayContent(event.content);
    return buildPostContentRenderModel({ kind: event.kind, sourceContent: event.content,
        displayContent: content === "+" ? "❤️" : content, tags: event.tags, media: [] });
}
