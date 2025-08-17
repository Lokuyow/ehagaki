<script lang="ts">
    import type { NodeViewProps } from "@tiptap/core";
    import { NodeViewWrapper } from "svelte-tiptap";

    export let node: NodeViewProps["node"];
    export let selected: boolean;
    export let getPos: NodeViewProps["getPos"];

    // 画像クリック時の例（必要に応じて拡張）
    function handleClick() {
        // 例: 画像クリックで何かする
    }

    // ドラッグ開始処理
    function handleDragStart(event: DragEvent) {
        if (!event.dataTransfer) return;
        
        // ドラッグデータにノード情報と位置を設定
        event.dataTransfer.setData('application/x-tiptap-node', JSON.stringify({
            type: 'image',
            attrs: node.attrs,
            pos: getPos()
        }));
        event.dataTransfer.effectAllowed = 'move';
    }
</script>

<NodeViewWrapper>
    <div class="editor-image-wrapper" data-selected={selected}>
        <button
            type="button"
            class="editor-image-button"
            on:click={handleClick}
            tabindex="0"
            aria-label={node.attrs.alt || "Image"}
            draggable="true"
            on:dragstart={handleDragStart}
        >
            <img
                src={node.attrs.src}
                alt={node.attrs.alt || ""}
                class="editor-image"
                draggable="false"
            />
        </button>
    </div>
</NodeViewWrapper>

<style>
    .editor-image-wrapper {
        display: block;
        position: relative;
        margin: 0;
        padding: 0;
    }
    .editor-image {
        max-width: 100%;
        max-height: 160px;
        border-radius: 6px;
        box-shadow: 0 1px 4px #0001;
        background: #fff;
        cursor: pointer;
        outline: none;
    }
    .editor-image-wrapper[data-selected="true"] .editor-image {
        outline: 2px solid var(--theme, #2196f3);
    }
    .editor-image-button {
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        cursor: grab;
        display: inline-block;
    }
    .editor-image-button:active {
        cursor: grabbing;
    }
    .editor-image-button:focus .editor-image {
        outline: 2px solid var(--theme, #2196f3);
    }
</style>
