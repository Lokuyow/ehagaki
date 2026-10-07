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
    kind?: number;
    resolvedBody?: boolean;
}

export type SensitiveBodyCacheStatus = "available" | "missing" | "invalid" | "deleted";
export interface SensitiveBodyLoader {
    (signal?: AbortSignal): Promise<string | null>;
    scope?: { runtime: unknown; ownerPubkey?: string | null };
    observe?: (onChange: (status: SensitiveBodyCacheStatus) => void) => () => void;
    loadEmoji?: (url: string) => Promise<{ ready: boolean; aspectRatio?: number }>;
}

export interface PostContentRenderModel {
    previewContent: PostHistoryPreviewContent;
    media: PostHistoryMediaRecord[];
    mediaLayout: PostHistoryMediaLayout;
    hasRenderableText: boolean;
    hasRenderableMedia: boolean;
    contentWarning: { reason: string } | null;
    sourceTags: string[][];
    kind?: number;
}

export function resolveEventContentBody(
    content: string,
    tags: string[][],
): string {
    const contentWarningTag = tags.find((tag) => tag[0] === "content-warning");
    return contentWarningTag && contentWarningTag.length > 2
        ? contentWarningTag[2]!
        : content;
}

export type PostContentEmojiLoadState = "loading" | "ready" | "failed";

export interface PostContentEmojiImageMeta {
    aspectRatio: number;
}

export function buildPostContentRenderModel(
    input: PostContentRenderInput,
): PostContentRenderModel {
    const contentWarningTag = input.tags.find(
        (tag) => tag[0] === "content-warning",
    );
    const hasTaggedBody = contentWarningTag !== undefined && contentWarningTag.length > 2;
    const resolvedSourceContent = input.resolvedBody ? input.sourceContent : resolveEventContentBody(
        input.sourceContent,
        input.tags,
    );
    const resolvedDisplayContent = input.displayContent ?? resolvedSourceContent;
    const extractedMedia = extractPostHistoryMedia({
        content: resolvedSourceContent,
        tags: input.tags,
    });
    const media = input.media === undefined
        ? extractedMedia
        : hasTaggedBody
          ? [
                ...input.media,
                ...extractedMedia.filter(
                    (item) => !input.media!.some((existing) => existing.url === item.url),
                ),
            ]
          : input.media;
    const previewContent = buildPreviewContent({
        content: resolvedDisplayContent,
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
        contentWarning: contentWarningTag
            ? { reason: contentWarningTag?.[1] ?? "" }
            : null,
        sourceTags: input.tags.map((tag) => [...tag]),
        kind: input.kind,
    };
}

export function buildPostContentRenderModelWithBody(
    model: PostContentRenderModel,
    body: string,
    displayContent: string = body,
): PostContentRenderModel {
    return buildPostContentRenderModel({
        kind: model.kind,
        sourceContent: body,
        displayContent,
        tags: model.sourceTags,
        resolvedBody: true,
    });
}
