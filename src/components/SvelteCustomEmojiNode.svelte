<script lang="ts">
    import type { NodeViewProps } from "@tiptap/core";
    import { NodeViewWrapper } from "svelte-tiptap";

    interface Props {
        node: NodeViewProps["node"];
        selected: boolean;
    }

    let { node, selected }: Props = $props();
    let shortcode = $derived(String(node.attrs.shortcode ?? ""));
    let label = $derived(shortcode ? `:${shortcode}:` : "Custom emoji");
</script>

<NodeViewWrapper
    as="span"
    class={`custom-emoji-wrapper${selected ? " is-selected" : ""}`}
>
    <img
        class="custom-emoji-image"
        data-custom-emoji="true"
        data-shortcode={shortcode}
        data-set-address={node.attrs.setAddress ?? undefined}
        src={node.attrs.src}
        alt={label}
        title={label}
        draggable="false"
    />
</NodeViewWrapper>

<style>
    :global(.custom-emoji-wrapper) {
        display: inline-flex;
        width: 1.45em;
        height: 1.45em;
        margin: 0 0.05em;
        vertical-align: -0.25em;
        border-radius: 4px;
    }

    :global(.custom-emoji-wrapper.is-selected) {
        outline: 2px solid var(--theme);
        outline-offset: 1px;
    }

    .custom-emoji-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        user-select: none;
        -webkit-user-drag: none;
    }
</style>
