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
        showHeaderDate?: boolean;
        topActions?: Snippet;
        children?: Snippet;
    }

    let {
        node,
        scrollRoot = null,
        onImageOpen = undefined,
        showHeaderDate = true,
        topActions = undefined,
        children = undefined,
    }: Props = $props();

    let media = $derived.by(() => extractPostHistoryMedia(node.event));
</script>

<PostHistoryRelatedEventCard
    event={node.event}
    profile={node.profile}
    {media}
    {scrollRoot}
    {onImageOpen}
    {showHeaderDate}
    {topActions}
>
    {@render children?.()}
</PostHistoryRelatedEventCard>
