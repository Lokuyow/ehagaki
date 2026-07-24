<script lang="ts">
    import { usePostHistoryPreviewCollapse } from "../../../lib/hooks/usePostHistoryPreviewCollapse.svelte";

    interface Props {
        content: string;
        forceCollapsible?: boolean;
    }

    let { content, forceCollapsible = false }: Props = $props();
    let container = $state<HTMLElement | null>(null);
    let item = $derived({
        eventId: "preview-collapse-harness-event",
        content,
        forceCollapsible,
    });
    let items = $derived([item]);
    const collapse = usePostHistoryPreviewCollapse({
        getShow: () => true,
        getPosts: () => items,
        getContainer: () => container,
    });
    const previewRef = collapse.previewRef;
    let expanded = $derived(collapse.isPostExpanded(item));
    let shouldCollapse = $derived(collapse.shouldCollapsePost(item));
    const contentId = "preview-collapse-harness-content";
</script>

<div bind:this={container}>
    <p
        id={contentId}
        class="event-content"
        class:event-content-collapsed={shouldCollapse && !expanded}
        style={shouldCollapse && !expanded
            ? "max-height: calc(7.25em); overflow: hidden;"
            : undefined}
        use:previewRef={item.eventId}
    >
        {content}
    </p>
    {#if shouldCollapse}
        <button
            type="button"
            aria-expanded={expanded}
            aria-controls={contentId}
            onclick={() => collapse.togglePostExpanded(item.eventId)}
        >
            {expanded ? "折りたたむ" : "もっと見る"}
        </button>
    {/if}
</div>

<style>
    .event-content {
        white-space: pre-wrap;
        line-height: 1.45;
    }
</style>
