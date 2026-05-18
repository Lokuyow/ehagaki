<script lang="ts">
    import type { Snippet } from "svelte";
    import PostHistoryRelatedEventCard from "./PostHistoryRelatedEventCard.svelte";
    import type { PostHistoryThreadGraphNode } from "../lib/postHistoryThreadGraphUtils";

    interface Props {
        node: PostHistoryThreadGraphNode;
        showHeaderDate?: boolean;
        parentOffsetRem?: number;
        topActions?: Snippet;
        children?: Snippet;
    }

    let {
        node,
        showHeaderDate = true,
        parentOffsetRem = 0,
        topActions = undefined,
        children = undefined,
    }: Props = $props();
</script>

<PostHistoryRelatedEventCard
    event={node.event}
    profile={node.profile}
    {showHeaderDate}
    {parentOffsetRem}
    {topActions}
>
    {@render children?.()}
</PostHistoryRelatedEventCard>
