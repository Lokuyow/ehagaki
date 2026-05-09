<script lang="ts">
    import type { PostHistoryPreviewContent as PostHistoryPreviewContentData } from "../lib/postHistoryDialogUtils";

    type EmojiLoadState = "loading" | "ready" | "failed";

    interface Props {
        previewContent: PostHistoryPreviewContentData;
        emojiLoadStateByUrl?: Record<string, EmojiLoadState | undefined>;
    }

    let { previewContent, emojiLoadStateByUrl = {} }: Props = $props();

    function isEmojiReady(url: string): boolean {
        return emojiLoadStateByUrl[url] === "ready";
    }
</script>

{#each previewContent.segments as segment, index (index)}
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

<style>
    .post-history-custom-emoji {
        display: inline-block;
        width: auto;
        height: 1.25em;
        max-width: none;
        vertical-align: -0.22em;
        object-fit: contain;
        user-select: none;
        -webkit-user-drag: none;
    }
</style>
