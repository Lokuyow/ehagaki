<script lang="ts">
    import type { TextLinkSegment } from "../lib/utils/linkifiedText";

    interface Props {
        segments: ReadonlyArray<TextLinkSegment>;
    }

    let { segments }: Props = $props();
</script>

{#each segments as segment, index (index)}
    {#if segment.type === "link"}
        <a
            class="reference-content-link"
            href={segment.href}
            target="_blank"
            rel="noopener noreferrer"
        >
            {segment.text}
        </a>
    {:else}
        <span>{segment.text}</span>
    {/if}
{/each}

<style>
    .reference-content-link {
        overflow-wrap: anywhere;
        word-break: break-word;
    }

    .reference-content-link:visited {
        color: var(--link-visited);
    }
</style>
