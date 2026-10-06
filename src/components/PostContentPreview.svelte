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
    import { buildPostContentRenderModelWithBody } from "../lib/postContentPreview";

    type PreviewRefAction = (
        node: HTMLDivElement,
        eventId: string,
    ) => { destroy?: () => void } | void;
    type Density = "standard" | "compact" | "reply" | "dialog";

    interface Props {
        model: PostContentRenderModel;
        loadSensitiveBody?: () => Promise<string | null>;
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
        loadSensitiveBody = undefined,
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
    let sensitiveBody = $state<string | undefined>(undefined);
    let sensitiveBodyLoading = $state(false);
    let sensitiveBodyFailed = $state(false);
    let sensitiveBodyLoadGeneration = 0;
    let isContentWarningRevealed = $derived(
        contentWarningEventId === undefined
            ? contentWarningRevealedWithoutEventId
            : contentWarningRevealedForEventId === contentWarningEventId,
    );
    let previousContentWarningEventId: string | undefined;
    $effect(() => {
        if (contentWarningEventId === previousContentWarningEventId) return;
        previousContentWarningEventId = contentWarningEventId;
        sensitiveBodyLoadGeneration += 1;
        contentWarningRevealedForEventId = null;
        contentWarningRevealedWithoutEventId = false;
        sensitiveBody = undefined;
        sensitiveBodyLoading = false;
        sensitiveBodyFailed = false;
    });

    let displayModel = $derived(
        sensitiveBody === undefined
            ? model
            : buildPostContentRenderModelWithBody(model, sensitiveBody),
    );

    async function revealContentWarning(): Promise<void> {
        if (loadSensitiveBody) {
            const loadGeneration = sensitiveBodyLoadGeneration;
            sensitiveBodyLoading = true;
            sensitiveBodyFailed = false;
            try {
                const body = await loadSensitiveBody();
                if (loadGeneration !== sensitiveBodyLoadGeneration) return;
                if (body === null) {
                    sensitiveBodyFailed = true;
                    return;
                }
                sensitiveBody = body;
            } catch {
                if (loadGeneration !== sensitiveBodyLoadGeneration) return;
                sensitiveBodyFailed = true;
                return;
            } finally {
                if (loadGeneration === sensitiveBodyLoadGeneration) {
                    sensitiveBodyLoading = false;
                }
            }
        }
        if (contentWarningEventId === undefined) {
            contentWarningRevealedWithoutEventId = true;
        } else {
            contentWarningRevealedForEventId = contentWarningEventId;
        }
    }

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

{#if displayModel.hasRenderableText || displayModel.hasRenderableMedia || displayModel.contentWarning || renderWhenEmpty}
    <div
        class={`post-content-preview post-content-preview-${density}`}
        style={`--post-content-block-gap: ${presentation.gap}px;`}
    >
        {#if displayModel.contentWarning && !isContentWarningRevealed}
            <div class="content-warning-prompt" role="group" aria-label={$_("postContent.contentWarningTitle")}>
                <div class="content-warning-copy">
                    <strong>{$_("postContent.contentWarningTitle")}</strong>
                    {#if displayModel.contentWarning.reason}
                        <span>{displayModel.contentWarning.reason}</span>
                    {/if}
                </div>
                {#if sensitiveBodyLoading}
                    <span role="status">{$_("postContent.sensitivePayloadLoading")}</span>
                {:else if sensitiveBodyFailed}
                    <span role="status">{$_("postContent.sensitivePayloadUnavailable")}</span>
                {/if}
                <button
                    type="button"
                    class="content-warning-reveal-button"
                    disabled={sensitiveBodyLoading}
                    onclick={() => void revealContentWarning()}
                >
                    {$_(sensitiveBodyFailed ? "postContent.retrySensitivePayload" : "postContent.showContentWarningBody")}
                </button>
            </div>
        {:else}
            {#if displayModel.hasRenderableText}
                <div class="post-preview-content">
                    <PostHistoryPreviewContent
                        previewContent={displayModel.previewContent}
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

            {#if displayModel.hasRenderableMedia}
                <div class="post-preview-media">
                    <PostHistoryMediaList
                        media={displayModel.media}
                        mediaLayout={displayModel.mediaLayout}
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
