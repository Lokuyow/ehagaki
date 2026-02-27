<script lang="ts">
    import Button from "./Button.svelte";
    import { copyToClipboard } from "../lib/utils/clipboardUtils";
    import { postComponentUIStore } from "../stores/appStore.svelte";

    interface Props {
        src: string;
        onDelete: () => void;
        deleteAriaLabel: string;
        copyAriaLabel: string;
        copySuccessMessage: string;
        /**
         * レイアウト種別: 各コンテナに応じたボタン配置・サイズを制御する
         * - editor-image: 画像エディタノード (40x40px, copy=bottom-right, delete=top-right)
         * - editor-video: 動画エディタノード (40x40px, copy=top:52px-right, delete=top-right)
         * - gallery: ギャラリーアイテム (28x28px, copy=bottom-right, delete=top-right)
         */
        layout?: "editor-image" | "editor-video" | "gallery";
    }

    let {
        src,
        onDelete,
        deleteAriaLabel,
        copyAriaLabel,
        copySuccessMessage,
        layout = "editor-image",
    }: Props = $props();

    function handleCopy(event: MouseEvent) {
        event.stopPropagation();
        copyToClipboard(src, "URL");
        postComponentUIStore.showPopupMessage(
            event.clientX,
            event.clientY,
            copySuccessMessage,
        );
    }

    function handleDelete(event: MouseEvent) {
        event.stopPropagation();
        onDelete();
    }
</script>

<Button
    variant="copy"
    shape="circle"
    className="media-copy-btn media-copy-btn--{layout}"
    ariaLabel={copyAriaLabel}
    onClick={handleCopy}
>
    <div class="copy-icon svg-icon"></div>
</Button>
<Button
    variant="close"
    shape="circle"
    className="media-delete-btn media-delete-btn--{layout}"
    ariaLabel={deleteAriaLabel}
    onClick={handleDelete}
>
    <div class="close-icon svg-icon"></div>
</Button>

<style>
    /* --- 削除ボタン共通 --- */
    :global(.media-delete-btn) {
        position: absolute;
        top: 2px;
        right: 2px;
        z-index: 10;
    }
    :global(.media-delete-btn--editor-image),
    :global(.media-delete-btn--editor-video) {
        width: 40px;
        height: 40px;
    }
    :global(.media-delete-btn--gallery) {
        width: 28px;
        height: 28px;
    }

    /* --- コピーボタン共通 --- */
    :global(.media-copy-btn) {
        position: absolute;
        right: 2px;
        z-index: 10;
    }
    /* editor-image: 下右 */
    :global(.media-copy-btn--editor-image) {
        bottom: 2px;
        width: 40px;
        height: 40px;
    }
    /* editor-video: 削除ボタンの下 */
    :global(.media-copy-btn--editor-video) {
        top: 52px;
        width: 40px;
        height: 40px;
    }
    /* gallery: 下右（小さめ） */
    :global(.media-copy-btn--gallery) {
        bottom: 2px;
        width: 28px;
        height: 28px;
    }
</style>
