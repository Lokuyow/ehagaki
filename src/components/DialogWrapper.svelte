<script lang="ts">
    import type { Snippet } from "svelte";
    import { Dialog } from "bits-ui";

    interface Props {
        /** ダイアログの開閉状態 */
        open?: boolean;
        /** open状態変更時のコールバック */
        onOpenChange?: (open: boolean) => void;
        /** ダイアログのタイトル（スクリーンリーダー用） */
        title: string;
        /** ダイアログの説明（スクリーンリーダー用） */
        description: string;
        /** Dialog.Contentに追加するCSSクラス */
        contentClass?: string;
        /** フッターのバリエーション: "default" = シンプル, "close-button" = 閉じるボタン付き */
        footerVariant?: "default" | "close-button";
        /** ダイアログのメインコンテンツ */
        children?: Snippet;
        /** ダイアログのフッター（閉じるボタン等） */
        footer?: Snippet;
    }

    let {
        open = $bindable(false),
        onOpenChange,
        title,
        description,
        contentClass = "",
        footerVariant = "default",
        children,
        footer,
    }: Props = $props();

    function handleOpenChange(newOpen: boolean) {
        if (!newOpen) {
            onOpenChange?.(false);
        }
    }
</script>

<Dialog.Root bind:open onOpenChange={handleOpenChange}>
    <Dialog.Portal>
        <Dialog.Overlay class="dialog-overlay" />
        <Dialog.Content class="dialog {contentClass}">
            <!-- スクリーンリーダー用タイトル -->
            <Dialog.Title class="visually-hidden">
                {title}
            </Dialog.Title>

            <!-- スクリーンリーダー用説明 -->
            <Dialog.Description class="visually-hidden">
                {description}
            </Dialog.Description>

            <div class="dialog-content">
                {@render children?.()}
            </div>

            {#if footer}
                <div
                    class="dialog-footer"
                    class:close-button-footer={footerVariant === "close-button"}
                >
                    {@render footer()}
                </div>
            {/if}
        </Dialog.Content>
    </Dialog.Portal>
</Dialog.Root>

<style>
    /* ダイアログ共通スタイル */
    :global(.dialog-overlay) {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--dialog-overlay);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 100;
    }

    :global(.dialog) {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--dialog);
        color: var(--text);
        width: 100%;
        max-width: 500px;
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 101;
    }

    .dialog-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-height: 85svh;
        padding: 16px;
        box-sizing: border-box;
        overflow-y: auto;
    }

    .dialog-footer {
        width: 100%;
        height: 58px;
        box-sizing: content-box;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /* 閉じるボタン付きフッター用スタイル */
    .dialog-footer.close-button-footer {
        height: 50px;
        border-top: 1px solid var(--border-hr);

        :global(.modal-close) {
            background-color: var(--dialog);
            border: none;
            border-radius: 0;
            width: 100%;
        }
    }

    :global(.modal-close:active:not(:disabled)) {
        transform: scale(1);
    }

    :global(.visually-hidden) {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
</style>
