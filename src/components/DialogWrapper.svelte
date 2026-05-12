<script lang="ts">
    import type { Snippet } from "svelte";
    import { Dialog } from "bits-ui";
    import Button from "./Button.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";

    interface Props {
        /** ダイアログの開閉状態 */
        open?: boolean;
        /** open状態変更時のコールバック */
        onOpenChange?: (open: boolean) => void;
        /** 外側インタラクション発生時のコールバック */
        onInteractOutside?: (event: PointerEvent) => void;
        /** フォーカストラップを有効にするか */
        trapFocus?: boolean;
        /** ダイアログのタイトル（スクリーンリーダー用） */
        title: string;
        /** ダイアログの説明（スクリーンリーダー用） */
        description: string;
        /** Dialog.Contentに追加するCSSクラス */
        contentClass?: string;
        /** フッターのバリエーション: "default" = シンプル, "close-button" = 閉じるボタン付き */
        footerVariant?: "default" | "close-button";
        /** フッターにページ送りを表示するか */
        showPagination?: boolean;
        /** ページ送りの現在表示テキスト */
        paginationLabel?: string;
        /** 前ページボタンのラベル */
        previousPageLabel?: string;
        /** 次ページボタンのラベル */
        nextPageLabel?: string;
        /** 前ページへ移動できるか */
        canGoPrevious?: boolean;
        /** 次ページへ移動できるか */
        canGoNext?: boolean;
        /** 次ページ読み込み中か */
        nextPageLoading?: boolean;
        /** 前ページボタン押下時のコールバック */
        onPreviousPage?: () => void;
        /** 次ページボタン押下時のコールバック */
        onNextPage?: () => void;
        /** 開いた直後のフォーカス先 */
        initialFocus?: "default" | "content";
        /** ダイアログのメインコンテンツ */
        children?: Snippet;
        /** ダイアログのフッター（閉じるボタン等） */
        footer?: Snippet;
    }

    let {
        open = $bindable(false),
        onOpenChange,
        onInteractOutside = undefined,
        trapFocus = true,
        title,
        description,
        contentClass = "",
        footerVariant = "default",
        showPagination = false,
        paginationLabel = "",
        previousPageLabel = "",
        nextPageLabel = "",
        canGoPrevious = false,
        canGoNext = false,
        nextPageLoading = false,
        onPreviousPage,
        onNextPage,
        initialFocus = "default",
        children,
        footer,
    }: Props = $props();

    let contentRef: HTMLElement | null = $state(null);
    let shouldFocusContent = $derived(initialFocus === "content");

    function handleOpenChange(newOpen: boolean) {
        if (!newOpen) {
            onOpenChange?.(false);
        }
    }

    function handleOpenAutoFocus(e: Event) {
        if (!shouldFocusContent) return;

        e.preventDefault();
        contentRef?.focus({ preventScroll: true });
    }

    // ダイアログを閉じる際のフォーカス復元を防ぐ
    function handleCloseAutoFocus(e: Event) {
        e.preventDefault();
    }
</script>

<Dialog.Root bind:open onOpenChange={handleOpenChange}>
    <Dialog.Portal>
        <Dialog.Overlay class="dialog-overlay" />
        <Dialog.Content
            bind:ref={contentRef}
            class="dialog {contentClass}"
            tabindex={shouldFocusContent ? -1 : undefined}
            {trapFocus}
            preventScroll={false}
            {onInteractOutside}
            onOpenAutoFocus={handleOpenAutoFocus}
            onCloseAutoFocus={handleCloseAutoFocus}
        >
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

            {#if footer || showPagination}
                <div
                    class="dialog-footer"
                    class:close-button-footer={footerVariant === "close-button"}
                    class:has-pagination={showPagination}
                >
                    {#if showPagination}
                        <div
                            class="dialog-pagination"
                            aria-label={paginationLabel}
                        >
                            <Button
                                className="dialog-page-button"
                                variant="default"
                                shape="pill"
                                disabled={!canGoPrevious}
                                ariaLabel={previousPageLabel}
                                onClick={onPreviousPage}
                            >
                                <span class="btn-text">{previousPageLabel}</span
                                >
                            </Button>

                            <div class="dialog-page-center">
                                {#key paginationLabel}
                                    <div class="dialog-page-indicator">
                                        {paginationLabel}
                                    </div>
                                {/key}
                                {@render footer?.()}
                            </div>

                            <Button
                                className={`dialog-page-button ${nextPageLoading ? "loading" : ""}`}
                                variant="default"
                                shape="pill"
                                disabled={!canGoNext || nextPageLoading}
                                ariaLabel={nextPageLabel}
                                onClick={onNextPage}
                            >
                                {#if nextPageLoading}
                                    <LoadingPlaceholder
                                        showLoader={true}
                                        loaderSize={30}
                                        state="loading"
                                        customClass="dialog-page-loading-placeholder"
                                    />
                                {:else}
                                    <span class="btn-text">{nextPageLabel}</span
                                    >
                                {/if}
                            </Button>
                        </div>
                    {:else}
                        {@render footer?.()}
                    {/if}
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
        max-width: 600px;
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 101;
    }

    :global(.dialog:focus) {
        outline: none;
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
        box-sizing: content-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .dialog-pagination {
        display: flex;
        align-items: stretch;
        justify-content: space-between;
        gap: 8px;
        width: 100%;
        box-sizing: border-box;
        padding: 8px 10px;
        border-top: 1px solid var(--border-hr);
    }

    .dialog-page-center {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        min-width: 0;
        flex: 1 0 auto;
    }

    .dialog-page-indicator {
        min-width: 0;
        color: var(--text-muted);
        font-size: 0.82rem;
        text-align: center;
        white-space: nowrap;
    }

    :global(.dialog-page-button) {
        min-width: 88px;
        height: auto;
        min-height: 40px;
        flex: 1 0 auto;
    }

    :global(.dialog-page-loading-placeholder) {
        color: var(--text);
        column-gap: 2px;
    }

    :global(.dialog-page-loading-placeholder .placeholder-text) {
        color: inherit;
        font-size: 1rem;
    }

    :global(.dialog-page-loading-placeholder .loader-container .square) {
        background-color: currentColor;
    }

    /* 閉じるボタン付きフッター用スタイル */
    .dialog-footer.close-button-footer {
        border-top: 1px solid var(--border-hr);

        :global(.modal-close) {
            --btn-bg: var(--dialog);
            border: none;
            border-radius: 0;
            width: 100%;
        }
    }

    .dialog-footer.close-button-footer.has-pagination {
        border-top: none;

        :global(.modal-close) {
            border: 1px solid var(--btn-border);
            border-radius: 50px;
            width: 100%;
            min-width: 72px;
            min-height: 34px;
        }

        :global(.modal-close .svg-icon) {
            width: 20px;
            height: 20px;
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
