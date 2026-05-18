<script lang="ts">
    import type { Snippet } from "svelte";
    import PostHistoryRelatedEventCard from "./PostHistoryRelatedEventCard.svelte";
    import type { PostHistoryThreadGraphNode } from "../lib/postHistoryThreadGraphUtils";

    interface Props {
        node: PostHistoryThreadGraphNode;
        children?: Snippet;
    }

    let { node, children = undefined }: Props = $props();
</script>

<PostHistoryRelatedEventCard
    event={node.event}
    profile={node.profile}
>
    {@render children?.()}
</PostHistoryRelatedEventCard>
