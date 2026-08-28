<script lang="ts">
    import { usePostHistoryPreviewCollapse } from "../../../lib/hooks/usePostHistoryPreviewCollapse.svelte";

    interface PreviewItem {
        eventId: string;
        content: string;
        forceCollapsible?: boolean;
    }

    interface Props {
        content?: string;
        forceCollapsible?: boolean;
        items?: PreviewItem[];
    }

    let { content = "", forceCollapsible = false, items: inputItems }: Props = $props();
    let container = $state<HTMLElement | null>(null);
    let items = $derived(
        inputItems ?? [
            {
                eventId: "preview-collapse-harness-event",
                content,
                forceCollapsible,
            },
        ],
    );
    const collapse = usePostHistoryPreviewCollapse({
        getShow: () => true,
        getPosts: () => items,
        getContainer: () => container,
    });
    const previewRef = collapse.previewRef;
    const getContentId = (eventId: string) =>
        `preview-collapse-harness-content-${eventId}`;
</script>

<div bind:this={container}>
    <button type="button" data-testid="remeasure" onclick={() => collapse.remeasure()}>
        再測定
    </button>
    {#each items as item (item.eventId)}
        {@const expanded = collapse.isPostExpanded(item)}
        {@const shouldCollapse = collapse.shouldCollapsePost(item)}
        {@const contentId = getContentId(item.eventId)}
        <p
            id={contentId}
            class="event-content"
            data-testid={`preview-${item.eventId}`}
            class:event-content-collapsed={shouldCollapse && !expanded}
            style={shouldCollapse && !expanded
                ? "max-height: calc(7.25em); overflow: hidden;"
                : undefined}
            use:previewRef={item.eventId}
        >
            {item.content}
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
    {/each}
</div>

<style>
    .event-content {
        white-space: pre-wrap;
        line-height: 1.45;
    }
</style>
