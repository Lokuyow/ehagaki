<script lang="ts">
    import type {
        PostHistoryPreviewContent as PostHistoryPreviewContentData,
        PostHistoryPreviewSegment,
    } from "../lib/postHistoryDialogUtils";
    import TextLinkSegments from "./TextLinkSegments.svelte";

    type EmojiLoadState = "loading" | "ready" | "failed";
    type EmojiImageMeta = {
        aspectRatio: number;
    };
    type PreviewRefAction = (
        node: HTMLDivElement,
        eventId: string,
    ) => { destroy?: () => void } | void;

    interface Props {
        previewContent: PostHistoryPreviewContentData;
        emojiLoadStateByUrl?: Record<string, EmojiLoadState | undefined>;
        emojiImageMetaByUrl?: Record<string, EmojiImageMeta | undefined>;
        previewCollapseAction?: PreviewRefAction;
        previewCollapseEventId?: string;
        previewContentId?: string;
        isCollapsed?: boolean;
        emojiSize?: number;
        fontSize?: string;
        lineHeight?: number;
        contentClass?: string;
        collapsedContentClass?: string;
    }

    let {
        previewContent,
        emojiLoadStateByUrl = {},
        emojiImageMetaByUrl = {},
        previewCollapseAction = (() => ({})) as PreviewRefAction,
        previewCollapseEventId = "",
        previewContentId = undefined,
        isCollapsed = false,
        emojiSize = 30,
        fontSize = "1rem",
        lineHeight = 1.5,
        contentClass = "",
        collapsedContentClass = "",
    }: Props = $props();

    function isTextOrEmojiSegment(
        segment: PostHistoryPreviewSegment,
    ): segment is Exclude<PostHistoryPreviewSegment, { type: "media" }> {
        return segment.type !== "media";
    }

    const textSegments = $derived.by(() =>
        previewContent.segments.filter(isTextOrEmojiSegment),
    );

    const hasRenderableText = $derived.by(() =>
        textSegments.some(
            (segment) =>
                segment.type === "emoji" ||
                segment.type === "link" ||
                (segment.type === "text" && segment.text.trim().length > 0),
        ),
    );

    function isEmojiReady(url: string): boolean {
        return emojiLoadStateByUrl[url] === "ready";
    }

    function hasEmojiFailed(url: string): boolean {
        return emojiLoadStateByUrl[url] === "failed";
    }

    function formatPixelValue(value: number): string {
        return Number.isInteger(value)
            ? `${value}`
            : value
                  .toFixed(6)
                  .replace(/\.0+$/, "")
                  .replace(/(\.\d*?)0+$/, "$1");
    }

    function getEmojiSlotStyle(url: string): string {
        const aspectRatio = emojiImageMetaByUrl[url]?.aspectRatio;
        const hasAspectRatio =
            typeof aspectRatio === "number" &&
            Number.isFinite(aspectRatio) &&
            aspectRatio > 0;
        const slotWidth = hasAspectRatio
            ? emojiSize * aspectRatio
            : emojiSize;

        return [
            `width: ${formatPixelValue(slotWidth)}px;`,
            `height: ${emojiSize}px;`,
            "vertical-align: bottom;",
        ].join(" ");
    }
</script>

<div
    class="post-history-preview-content"
    style={`--post-content-font-size: ${fontSize}; --post-content-line-height: ${lineHeight};`}
>
    {#if hasRenderableText}
        <div
            id={previewContentId}
            class={[
                "post-history-preview-text",
                contentClass,
                isCollapsed ? "post-history-preview-text-collapsed" : "",
                isCollapsed ? collapsedContentClass : "",
            ]
                .filter(Boolean)
                .join(" ")}
            use:previewCollapseAction={previewCollapseEventId}
        >
            {#each textSegments as segment, index (index)}
                {#if segment.type === "text" || segment.type === "link"}
                    <TextLinkSegments segments={[segment]} />
                {:else if hasEmojiFailed(segment.url)}
                    <span>{segment.rawShortcodeText}</span>
                {:else}
                    <span
                        class="post-history-custom-emoji-slot"
                        style={getEmojiSlotStyle(segment.url)}
                    >
                        {#if isEmojiReady(segment.url)}
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
                            <span
                                class="post-history-custom-emoji-placeholder"
                                aria-hidden="true"
                            ></span>
                        {/if}
                    </span>
                {/if}
            {/each}
        </div>
    {/if}
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
        font-size: var(--post-content-font-size, 1rem);
        line-height: var(--post-content-line-height, 1.5);
    }

    .post-history-preview-text-collapsed {
        max-height: calc(5 * var(--post-content-line-height, 1.5) * 1em);
        overflow: hidden;
    }

    .post-history-custom-emoji-slot {
        display: inline-grid;
        margin: 0;
        padding: 0;
    }

    .post-history-custom-emoji,
    .post-history-custom-emoji-placeholder {
        width: 100%;
        height: 100%;
    }

    .post-history-custom-emoji {
        display: block;
        margin: 0;
        padding: 0;
        object-fit: contain;
        user-select: none;
        -webkit-user-drag: none;
    }

    .post-history-custom-emoji-placeholder {
        display: block;
        border-radius: 4px;
        background: rgba(127, 127, 127, 0.18);
    }
</style>
