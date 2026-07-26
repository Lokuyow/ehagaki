import {
    buildPostHistoryMediaLayout,
    buildPreviewContent,
    type PostHistoryMediaLayout,
    type PostHistoryPreviewContent,
} from "./postHistoryDialogUtils";
import { extractPostHistoryMedia } from "./postHistoryMediaUtils";
import type { PostHistoryMediaRecord } from "./storage/ehagakiDb";

export interface PostContentRenderInput {
    sourceContent: string;
    displayContent?: string;
    tags: string[][];
    media?: PostHistoryMediaRecord[];
}

export interface PostContentRenderModel {
    previewContent: PostHistoryPreviewContent;
    media: PostHistoryMediaRecord[];
    mediaLayout: PostHistoryMediaLayout;
    hasRenderableText: boolean;
    hasRenderableMedia: boolean;
}

export type PostContentEmojiLoadState = "loading" | "ready" | "failed";

export interface PostContentEmojiImageMeta {
    aspectRatio: number;
}

export function buildPostContentRenderModel(
    input: PostContentRenderInput,
): PostContentRenderModel {
    const media = input.media === undefined
        ? extractPostHistoryMedia({
              content: input.sourceContent,
              tags: input.tags,
          })
        : input.media;
    const previewContent = buildPreviewContent({
        content: input.displayContent ?? input.sourceContent,
        tags: input.tags,
        media,
    });
    const mediaLayout = buildPostHistoryMediaLayout(media);

    return {
        previewContent,
        media,
        mediaLayout,
        hasRenderableText: previewContent.segments.some(
            (segment) =>
                segment.type === "emoji" ||
                segment.type === "link" ||
                (segment.type === "text" && segment.text.trim().length > 0),
        ),
        hasRenderableMedia: mediaLayout.items.length > 0,
    };
}
