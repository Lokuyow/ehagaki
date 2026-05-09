<script lang="ts">
    import type {
        PostHistoryPreviewContent as PostHistoryPreviewContentData,
        PostHistoryPreviewSegment,
    } from "../lib/postHistoryDialogUtils";
    import type { PostHistoryRecord } from "../lib/storage/ehagakiDb";
    import PostHistoryMediaList from "./PostHistoryMediaList.svelte";

    type EmojiLoadState = "loading" | "ready" | "failed";
    type PreviewRefAction = (
        node: HTMLDivElement,
        eventId: string,
    ) => { destroy?: () => void } | void;

    interface Props {
        previewContent: PostHistoryPreviewContentData;
        emojiLoadStateByUrl?: Record<string, EmojiLoadState | undefined>;
        previewCollapseAction?: PreviewRefAction;
        previewCollapseEventId?: string;
        previewContentId?: string;
        isCollapsed?: boolean;
    }

    let {
        previewContent,
        emojiLoadStateByUrl = {},
        previewCollapseAction = (() => ({})) as PreviewRefAction,
        previewCollapseEventId = "",
        previewContentId = undefined,
        isCollapsed = false,
    }: Props = $props();

    function isMediaSegment(
        segment: PostHistoryPreviewSegment,
    ): segment is Extract<PostHistoryPreviewSegment, { type: "media" }> {
        return segment.type === "media";
    }

    function isTextOrEmojiSegment(
        segment: PostHistoryPreviewSegment,
    ): segment is Exclude<PostHistoryPreviewSegment, { type: "media" }> {
        return segment.type !== "media";
    }

    const textSegments = $derived.by(() =>
        previewContent.segments.filter(isTextOrEmojiSegment),
    );
    const mediaSegments = $derived.by(() =>
        previewContent.segments.filter(isMediaSegment),
    );

    function isEmojiReady(url: string): boolean {
        return emojiLoadStateByUrl[url] === "ready";
    }
</script>

<div class="post-history-preview-content">
    <div
        id={previewContentId}
        class="post-history-preview-text"
        class:post-history-preview-text-collapsed={isCollapsed}
        use:previewCollapseAction={previewCollapseEventId}
    >
        {#each textSegments as segment, index (index)}
            {#if segment.type === "text"}
                <span>{segment.text}</span>
            {:else if isEmojiReady(segment.url)}
                <img
                    src={segment.url}
                    alt={segment.rawShortcodeText}
                    title={segment.rawShortcodeText}
                    class="post-history-custom-emoji"
                    draggable="false"
                    loading="lazy"
                    decoding="async"
                />
            {:else}
                <span>{segment.rawShortcodeText}</span>
            {/if}
        {/each}
    </div>

    {#each mediaSegments as segment, index (index)}
        <div class="post-history-inline-media">
            <PostHistoryMediaList media={[segment.media]} />
        </div>
    {/each}
</div>

<style>
    .post-history-preview-content {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .post-history-preview-text {
        overflow-wrap: anywhere;
        white-space: pre-wrap;
        font-size: 1rem;
        line-height: 1.5;
        word-break: break-word;
    }

    .post-history-preview-text-collapsed {
        max-height: calc(5 * 1.5em);
        overflow: hidden;
    }

    .post-history-inline-media {
        display: block;
    }

    .post-history-custom-emoji {
        display: inline-block;
        width: auto;
        height: 30px;
        vertical-align: bottom;
        margin: 0;
        padding: 0;
        object-fit: contain;
        user-select: none;
        -webkit-user-drag: none;
    }
</style>
