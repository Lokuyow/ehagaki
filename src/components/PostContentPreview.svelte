<script lang="ts">
    import type { Snippet } from "svelte";
    import { _ } from "svelte-i18n";
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
        contentWarningEventId?: string;
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
        renderWhenEmpty?: boolean;
        onImageOpen?: (params: {
            index: number;
            mediaList: FullscreenMediaItem[];
            focusOrigin: HTMLElement | null;
        }) => void;
        betweenContentAndMedia?: Snippet;
        textOverlay?: Snippet;
    }

    let {
        model,
        contentWarningEventId = undefined,
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
        renderWhenEmpty = false,
        onImageOpen = undefined,
        betweenContentAndMedia = undefined,
        textOverlay = undefined,
    }: Props = $props();

    let contentWarningRevealedForEventId = $state<string | null>(null);
    let contentWarningRevealedWithoutEventId = $state(false);
    let isContentWarningRevealed = $derived(
        contentWarningEventId === undefined
            ? contentWarningRevealedWithoutEventId
            : contentWarningRevealedForEventId === contentWarningEventId,
    );
    let previousContentWarningEventId: string | undefined;
    $effect(() => {
        if (contentWarningEventId === previousContentWarningEventId) return;
        previousContentWarningEventId = contentWarningEventId;
        contentWarningRevealedForEventId = null;
        contentWarningRevealedWithoutEventId = false;
    });

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

{#if model.hasRenderableText || model.hasRenderableMedia || model.contentWarning || renderWhenEmpty}
    <div
        class={`post-content-preview post-content-preview-${density}`}
        style={`--post-content-block-gap: ${presentation.gap}px;`}
    >
        {#if model.contentWarning && !isContentWarningRevealed}
            <div class="content-warning-prompt" role="group" aria-label={$_("postContent.contentWarningTitle")}>
                <div class="content-warning-copy">
                    <strong>{$_("postContent.contentWarningTitle")}</strong>
                    {#if model.contentWarning.reason}
                        <span>{model.contentWarning.reason}</span>
                    {/if}
                </div>
                <button
                    type="button"
                    class="content-warning-reveal-button"
                    onclick={() => {
                        if (contentWarningEventId === undefined) {
                            contentWarningRevealedWithoutEventId = true;
                        } else {
                            contentWarningRevealedForEventId = contentWarningEventId;
                        }
                    }}
                >
                    {$_("postContent.showContentWarningBody")}
                </button>
            </div>
        {:else}
            {#if model.hasRenderableText}
                <div class="post-preview-content">
                    <PostHistoryPreviewContent
                        previewContent={model.previewContent}
                        {emojiLoadStateByUrl}
                        {emojiImageMetaByUrl}
                        {previewCollapseAction}
                        {previewCollapseEventId}
                        {previewContentId}
                        {textOverlay}
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

    .content-warning-prompt {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        max-width: 100%;
        min-width: 0;
        padding: 10px 12px;
        border: 1px solid var(--border);
        border-radius: 8px;
        background: color-mix(in srgb, var(--dialog-bg), var(--border-hr) 16%);
        color: var(--text);
    }

    .content-warning-copy {
        display: flex;
        flex-direction: column;
        gap: 3px;
        min-width: 0;
        overflow-wrap: anywhere;
    }

    .content-warning-copy span {
        color: var(--text-muted);
        font-size: 0.9em;
    }

    .content-warning-reveal-button {
        flex: 0 0 auto;
        min-height: 40px;
        padding: 6px 10px;
        border: 1px solid var(--border);
        border-radius: 6px;
        background: var(--dialog-bg);
        color: var(--text);
        font: inherit;
        cursor: pointer;
    }

    .content-warning-reveal-button:hover {
        border-color: var(--theme);
    }

    @media (max-width: 380px) {
        .content-warning-prompt {
            align-items: flex-start;
            flex-direction: column;
        }
    }
</style>
