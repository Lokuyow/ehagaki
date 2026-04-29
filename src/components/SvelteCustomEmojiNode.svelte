<script lang="ts">
    import type { NodeViewProps } from "@tiptap/core";
    import { NodeViewWrapper } from "svelte-tiptap";
    import { onDestroy } from "svelte";
    import { customEmojiDragState } from "../stores/editorStore.svelte";
    import { isTouchDevice } from "../lib/utils/appDomUtils";
    import { useCustomEmojiDrag } from "../lib/hooks/useCustomEmojiDrag.svelte";

    interface Props {
        node: NodeViewProps["node"];
        selected: boolean;
        getPos: NodeViewProps["getPos"];
    }

    let { node, selected, getPos }: Props = $props();
    let shortcode = $derived(String(node.attrs.shortcode ?? ""));
    let label = $derived(shortcode ? `:${shortcode}:` : "Custom emoji");
    let dragElement: HTMLSpanElement | undefined = $state();
    let dragState = customEmojiDragState;
    const isTouchCapable = isTouchDevice();

    const { cleanup: cleanupDrag } = useCustomEmojiDrag({
        getElement: () => dragElement,
        getPos: () => getPos(),
        dragState,
        getNodeAttrs: () => node.attrs,
    });

    function handleDragStart(event: DragEvent): void {
        if (isTouchCapable) {
            event.preventDefault();
            return;
        }

        if (!event.dataTransfer) return;
        event.dataTransfer.setData(
            "application/x-tiptap-node",
            JSON.stringify({
                type: "customEmoji",
                attrs: node.attrs,
                pos: getPos(),
            }),
        );
        event.dataTransfer.effectAllowed = "move";
        dragState.isDragging = true;
        window.dispatchEvent(
            new CustomEvent("custom-emoji-native-drag-start", {
                detail: { nodePos: getPos() },
            }),
        );
    }

    function handleDragEnd(): void {
        dragState.isDragging = false;
        window.dispatchEvent(new CustomEvent("custom-emoji-native-drag-end"));
    }

    onDestroy(() => {
        cleanupDrag();
        Object.assign(customEmojiDragState, {
            isDragging: false,
            longPressTimeout: null,
            startTarget: null,
            preview: null,
        });
    });
</script>

<NodeViewWrapper
    as="span"
    class={`custom-emoji-wrapper${selected ? " is-selected" : ""}`}
>
    <!-- svelte-ignore a11y_no_static_element_interactions - ProseMirror manages node selection and keyboard editing. -->
    <span
        bind:this={dragElement}
        class="custom-emoji-drag-target"
        data-dragging={dragState.isDragging}
        draggable={!isTouchCapable}
        ondragstart={handleDragStart}
        ondragend={handleDragEnd}
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
    </span>
</NodeViewWrapper>

<style>
    :global(.custom-emoji-wrapper),
    :global(.custom-emoji-wrapper[data-node-view-wrapper]) {
        display: inline-flex;
        width: auto;
        height: 1.6em;
        margin: 0;
        vertical-align: -0.44em;
        border-radius: 4px;
    }

    :global(.custom-emoji-wrapper.is-selected) {
        outline: 2px solid var(--theme);
        outline-offset: 1px;
    }

    .custom-emoji-image {
        width: auto;
        height: 100%;
        max-width: none;
        user-select: none;
        -webkit-user-drag: none;
    }

    .custom-emoji-drag-target {
        display: inline-flex;
        height: 100%;
        cursor: grab;
        touch-action: pan-y;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
    }

    .custom-emoji-drag-target[data-dragging="true"] {
        opacity: 0.35;
    }

    :global(.drop-zone-indicator.custom-emoji-drop-zone) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 10px;
        height: 1.7em;
        min-height: 0;
        padding: 0;
        margin: 0 1px;
        vertical-align: -0.44em;
        background: none;
        border: 0;
        box-shadow: none;
        position: relative;
        cursor: pointer;
    }

    :global(.drop-zone-indicator.custom-emoji-drop-zone .drop-zone-bar) {
        width: 4px;
        max-width: 4px;
        height: 1.35em;
        min-height: 18px;
        border-radius: 999px;
        background: dodgerblue;
        margin: 0;
    }

    :global(.drop-zone-indicator.custom-emoji-drop-zone.drop-zone-hover .drop-zone-bar) {
        background: var(--yellow);
        outline: 2px solid var(--yellow);
    }

    @media (hover: none) {
        .custom-emoji-drag-target {
            cursor: default;
        }
    }
</style>
