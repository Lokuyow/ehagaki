<script lang="ts">
    import type { Snippet } from "svelte";
    import PostHistoryRelatedEventCard from "./PostHistoryRelatedEventCard.svelte";
    import { extractPostHistoryMedia } from "../lib/postHistoryMediaUtils";
    import type { PostHistoryThreadGraphNode } from "../lib/postHistoryThreadGraphUtils";
    import type { FullscreenMediaItem } from "../lib/types";

    interface Props {
        node: PostHistoryThreadGraphNode;
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
        scrollRoot = null,
        onImageOpen = undefined,
        topActions = undefined,
        footerLeftExtras = undefined,
        footerActions = undefined,
        footerMenu = undefined,
    }: Props = $props();

    let media = $derived.by(() => extractPostHistoryMedia(node.event));
</script>

<PostHistoryRelatedEventCard
    event={node.event}
    profile={node.profile}
    {media}
    {scrollRoot}
    {onImageOpen}
    {topActions}
    {footerLeftExtras}
    {footerActions}
    {footerMenu}
/>
