<script lang="ts">
    import type { Snippet } from "svelte";
    import PostHistoryRelatedEventCard from "./PostHistoryRelatedEventCard.svelte";
    import type {
        PostContentEmojiImageMeta,
        PostContentEmojiLoadState,
        PostContentRenderModel,
    } from "../lib/postContentPreview";
    import type { PostHistoryThreadGraphNode } from "../lib/postHistoryThreadGraphUtils";
    import type { FullscreenMediaItem } from "../lib/types";

    interface Props {
        node: PostHistoryThreadGraphNode;
        model?: PostContentRenderModel;
        emojiLoadStateByUrl?: Record<
            string,
            PostContentEmojiLoadState | undefined
        >;
        emojiImageMetaByUrl?: Record<
            string,
            PostContentEmojiImageMeta | undefined
        >;
        scrollRoot?: HTMLElement | null;
        onImageOpen?: (params: {
            index: number;
            mediaList: FullscreenMediaItem[];
        }) => void;
        topActions?: Snippet;
        footerLeftExtras?: Snippet;
        footerActions?: Snippet;
        footerMenu?: Snippet;
    }

    let {
        node,
        model = undefined,
        emojiLoadStateByUrl = {},
        emojiImageMetaByUrl = {},
        scrollRoot = null,
        onImageOpen = undefined,
        topActions = undefined,
        footerLeftExtras = undefined,
        footerActions = undefined,
        footerMenu = undefined,
    }: Props = $props();

</script>

<PostHistoryRelatedEventCard
    event={node.event}
    profile={node.profile}
    {model}
    {emojiLoadStateByUrl}
    {emojiImageMetaByUrl}
    {scrollRoot}
    {onImageOpen}
    {topActions}
    {footerLeftExtras}
    {footerActions}
    {footerMenu}
/>
