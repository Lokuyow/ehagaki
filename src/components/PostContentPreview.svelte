<script lang="ts">
    import type { Snippet } from "svelte";
    import PostHistoryMediaList from "./PostHistoryMediaList.svelte";
    import PostHistoryPreviewContent from "./PostHistoryPreviewContent.svelte";
    import type {
        PostContentEmojiImageMeta,
        PostContentEmojiLoadState,
        PostContentRenderModel,
    } from "../lib/postContentPreview";
    import type { FullscreenMediaItem } from "../lib/types";

    type PreviewRefAction = (
        node: HTMLDivElement,
        eventId: string,
    ) => { destroy?: () => void } | void;
    type Density = "standard" | "compact" | "reply" | "dialog";

    interface Props {
        model: PostContentRenderModel;
        density?: Density;
        emojiLoadStateByUrl?: Record<
            string,
            PostContentEmojiLoadState | undefined
        >;
        emojiImageMetaByUrl?: Record<
            string,
            PostContentEmojiImageMeta | undefined
        >;
        scrollRoot?: HTMLElement | null;
        previewContentId?: string;
        isTextCollapsed?: boolean;
        previewCollapseAction?: PreviewRefAction;
        previewCollapseEventId?: string;
        contentClass?: string;
        collapsedContentClass?: string;
        onImageOpen?: (params: {
            index: number;
            mediaList: FullscreenMediaItem[];
        }) => void;
        betweenContentAndMedia?: Snippet;
    }

    let {
        model,
        density = "standard",
        emojiLoadStateByUrl = {},
        emojiImageMetaByUrl = {},
        scrollRoot = null,
        previewContentId = undefined,
        isTextCollapsed = false,
        previewCollapseAction = (() => ({})) as PreviewRefAction,
        previewCollapseEventId = "",
        contentClass = "",
        collapsedContentClass = "",
        onImageOpen = undefined,
        betweenContentAndMedia = undefined,
    }: Props = $props();

    const presentation = $derived.by(() => {
        switch (density) {
            case "compact":
                return {
                    emojiSize: 24,
                    fontSize: "inherit",
                    lineHeight: 1.45,
                    gap: 4,
                };
            case "reply":
                return {
                    emojiSize: 30,
                    fontSize: "inherit",
                    lineHeight: 1.4,
                    gap: 6,
                };
            case "dialog":
                return {
                    emojiSize: 30,
                    fontSize: "inherit",
                    lineHeight: 1.45,
                    gap: 6,
                };
            default:
                return {
                    emojiSize: 30,
                    fontSize: "1rem",
                    lineHeight: 1.5,
                    gap: 6,
                };
        }
    });
</script>

{#if model.hasRenderableText || model.hasRenderableMedia}
    <div
        class={`post-content-preview post-content-preview-${density}`}
        style={`--post-content-block-gap: ${presentation.gap}px;`}
    >
        {#if model.hasRenderableText}
            <div class="post-preview-content">
                <PostHistoryPreviewContent
                    previewContent={model.previewContent}
                    {emojiLoadStateByUrl}
                    {emojiImageMetaByUrl}
                    {previewCollapseAction}
                    {previewCollapseEventId}
                    {previewContentId}
                    {contentClass}
                    {collapsedContentClass}
                    isCollapsed={isTextCollapsed}
                    emojiSize={presentation.emojiSize}
                    fontSize={presentation.fontSize}
                    lineHeight={presentation.lineHeight}
                />
            </div>
        {/if}

        {@render betweenContentAndMedia?.()}

        {#if model.hasRenderableMedia}
            <div class="post-preview-media">
                <PostHistoryMediaList
                    media={model.media}
                    mediaLayout={model.mediaLayout}
                    {scrollRoot}
                    {onImageOpen}
                />
            </div>
        {/if}
    </div>
{/if}

<style>
    .post-content-preview {
        display: flex;
        flex-direction: column;
        gap: var(--post-content-block-gap, 6px);
        width: 100%;
        max-width: 100%;
        min-width: 0;
    }
</style>
