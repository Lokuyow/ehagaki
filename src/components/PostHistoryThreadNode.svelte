<script lang="ts">
    import PostHistoryRelatedEventCard from "./PostHistoryRelatedEventCard.svelte";
    import type { PostHistoryThreadGraphNode } from "../lib/postHistoryThreadGraphUtils";

    interface Props {
        node: PostHistoryThreadGraphNode;
        label: string;
    }

    let { node, label }: Props = $props();
</script>

<PostHistoryRelatedEventCard
    event={node.event}
    profile={node.profile}
    {label}
/>
