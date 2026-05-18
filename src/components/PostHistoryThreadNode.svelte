<script lang="ts">
    import PostHistoryRelatedEventCard from "./PostHistoryRelatedEventCard.svelte";
    import type { PostHistoryThreadGraphNode } from "../lib/postHistoryThreadGraphUtils";

    interface Props {
        node: PostHistoryThreadGraphNode;
    }

    let { node }: Props = $props();
</script>

<PostHistoryRelatedEventCard
    event={node.event}
    profile={node.profile}
/>
