<script lang="ts">
    import type { Snippet } from "svelte";
    import PostHistoryRelatedEventCard from "./PostHistoryRelatedEventCard.svelte";
    import type { PostHistoryThreadGraphNode } from "../lib/postHistoryThreadGraphUtils";

    interface Props {
        node: PostHistoryThreadGraphNode;
        topActions?: Snippet;
        children?: Snippet;
    }

    let {
        node,
        topActions = undefined,
        children = undefined,
    }: Props = $props();
</script>

<PostHistoryRelatedEventCard
    event={node.event}
    profile={node.profile}
    {topActions}
>
    {@render children?.()}
</PostHistoryRelatedEventCard>
