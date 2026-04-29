<script lang="ts">
    import { _ } from "svelte-i18n";
    import { Dialog } from "bits-ui";
    import type { Draft } from "../lib/types";
    import Button from "./Button.svelte";
    import DialogWrapper from "./DialogWrapper.svelte";
    import InfoPopoverButton from "./InfoPopoverButton.svelte";
    import { useDialogHistory } from "../lib/hooks/useDialogHistory.svelte";
    import {
        createDraftListDisplay,
        type DraftContextLabels,
    } from "../lib/draftDisplayUtils";
    import {
        loadDrafts,
        deleteDraft,
        deleteAllDrafts,
        formatDraftTimestamp,
    } from "../lib/draftManager";

    interface Props {
        show: boolean;
        onClose: () => void;
        onApplyDraft: (draft: Draft) => void;
        pubkeyHex?: string | null;
    }

    let {
        show = $bindable(false),
        onClose,
        onApplyDraft,
        pubkeyHex = null,
    }: Props = $props();

    // 下書きリスト
    let drafts = $state<Draft[]>([]);

    const getDraftOptions = () => ({
        pubkeyHex,
    });

    function getDraftDisplayLabels(): DraftContextLabels {
        return {
            channel: $_("channelComposer.selected_label") || "チャンネル",
            reply: $_("replyQuote.reply_label") || "リプライ",
            quote: $_("replyQuote.quote_label") || "引用",
            image: $_("draft.media.image") || "[画像]",
            video: $_("draft.media.video") || "[動画]",
        };
    }

    // ダイアログを閉じるハンドラ
    function handleClose() {
        show = false;
        onClose?.();
    }

    // ブラウザ履歴統合
    useDialogHistory(() => show, handleClose, true);

    // ダイアログが開かれたときに下書きを読み込む
    $effect(() => {
        if (show) {
            void loadDrafts(getDraftOptions()).then((loadedDrafts) => {
                if (show) {
                    drafts = loadedDrafts;
                }
            });
        }
    });

    // 下書きを適用
    function handleApplyDraft(draft: Draft) {
        onApplyDraft(draft);
        handleClose();
    }

    // 下書きを削除
    async function handleDeleteDraft(id: string) {
        drafts = await deleteDraft(id, getDraftOptions());
    }

    // 全ての下書きを削除
    async function handleDeleteAllDrafts() {
        drafts = await deleteAllDrafts(getDraftOptions());
    }
</script>

<DialogWrapper
    bind:open={show}
    onOpenChange={(open) => !open && handleClose()}
    title={$_("draft.list_title") || "下書き一覧"}
    description={$_("draft.list_description") || "保存した下書きを選択して復元"}
    contentClass="draft-list-dialog"
    footerVariant="close-button"
>
    <div class="dialog-heading-container">
        <div class="dialog-heading-wrapper">
            <h3 class="dialog-heading">{$_("draft.title") || "下書き"}</h3>
            <InfoPopoverButton
                side="bottom"
                sideOffset={8}
                ariaLabel={$_("draft.info") || "下書き情報"}
            >
                {$_("draft.info") ||
                    "下書きはブラウザに保存されます。ブラウザのデータを削除したり、ログアウトすると下書きは削除されます。"}
            </InfoPopoverButton>
        </div>
        <Button
            className="delete-all-button"
            variant="default"
            shape="rounded"
            ariaLabel={$_("draft.delete_all") || "全て削除"}
            onClick={handleDeleteAllDrafts}
        >
            <div class="trash-icon svg-icon"></div>
            <span class="delete-all-label"
                >{$_("draft.delete_all") || "全て削除"}</span
            >
        </Button>
    </div>

    <div class="draft-list-container">
        {#if drafts.length === 0}
            <div class="empty-message">
                {$_("draft.no_drafts") || "下書きがありません"}
            </div>
        {:else}
            <ul class="draft-list">
                {#each drafts as draft (draft.id)}
                    {@const display = createDraftListDisplay(
                        draft,
                        getDraftDisplayLabels(),
                        document,
                    )}
                    <li class="draft-item">
                        <button
                            type="button"
                            class="draft-content"
                            onclick={() => handleApplyDraft(draft)}
                        >
                            <span class="draft-main">
                                {#if display.contexts.length > 0}
                                    <span class="draft-context-list">
                                        {#each display.contexts as context}
                                            <span
                                                class="draft-context-row"
                                                class:channel-context={context.kind ===
                                                    "channel"}
                                                class:reply-context={context.kind ===
                                                    "reply"}
                                                class:quote-context={context.kind ===
                                                    "quote"}
                                            >
                                                <span
                                                    class="preview-mode-icon svg-icon"
                                                ></span>
                                                <span class="context-label"
                                                    >{context.label}</span
                                                >
                                                <span class="context-name"
                                                    >{context.name}</span
                                                >
                                                {#if context.detail}
                                                    <span class="context-detail"
                                                        >{context.detail}</span
                                                    >
                                                {/if}
                                            </span>
                                        {/each}
                                    </span>
                                    {#if display.bodyPreview}
                                        <span class="draft-preview"
                                            >{display.bodyPreview}</span
                                        >
                                    {/if}
                                {:else}
                                    <span class="draft-preview"
                                        >{display.title}</span
                                    >
                                {/if}
                            </span>
                            <span class="draft-timestamp"
                                >{formatDraftTimestamp(draft.timestamp)}</span
                            >
                        </button>
                        <Button
                            className="delete-button"
                            variant="default"
                            shape="square"
                            ariaLabel={$_("draft.delete") || "削除"}
                            onClick={() => void handleDeleteDraft(draft.id)}
                        >
                            <div class="trash-icon svg-icon"></div>
                        </Button>
                    </li>
                {/each}
            </ul>
        {/if}
    </div>

    {#snippet footer()}
        <Dialog.Close>
            {#snippet child({ props })}
                <Button
                    {...props}
                    className="modal-close"
                    variant="default"
                    shape="square"
                    ariaLabel={$_("global.close") || "閉じる"}
                >
                    <div
                        class="xmark-icon svg-icon"
                        aria-label={$_("global.close") || "閉じる"}
                    ></div>
                </Button>
            {/snippet}
        </Dialog.Close>
    {/snippet}
</DialogWrapper>

<style>
    :global(.draft-list-dialog .dialog-content) {
        padding: 0;
    }

    .dialog-heading-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0;
        padding: 18px 16px;
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text);
        width: 100%;
        border-bottom: 1px solid var(--border-hr);
    }

    .dialog-heading-wrapper {
        display: flex;
        align-items: center;
    }

    .dialog-heading {
        margin: 0;
    }

    .draft-list-container {
        width: 100%;
        min-height: 100px;
        overflow-y: auto;
    }

    .empty-message {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100px;
        color: var(--text-muted);
        font-size: 1rem;
    }

    .draft-list {
        list-style: none;
        margin: 0;
        padding: 0;
        width: 100%;
    }

    .draft-item {
        display: flex;
        align-items: stretch;
        min-height: 50px;
        border-bottom: 1px solid var(--border-hr);

        &:last-child {
            border-bottom: none;
        }

        :global(.delete-button) {
            width: 50px;
            height: auto;
            --btn-bg: var(--dialog);

            .trash-icon {
                width: 24px;
                height: 24px;
            }
        }
    }

    .draft-content {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
        padding: 12px;
        --btn-bg: var(--dialog);
        border: none;
        cursor: pointer;
        text-align: left;
        color: var(--text);
        font-size: 1rem;
        min-width: 0;
        height: auto;
    }

    .draft-main {
        flex: 1;
        display: grid;
        gap: 6px;
        min-width: 0;
    }

    .draft-preview {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .draft-preview {
        font-size: 1rem;
        color: var(--text);
    }

    .draft-context-list {
        display: grid;
        gap: 4px;
        min-width: 0;
    }

    .draft-context-row {
        display: flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
        color: var(--text-light);
        font-size: 0.9rem;
        line-height: 1.3;
    }

    .preview-mode-icon {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        color: var(--theme);
    }

    .channel-context .preview-mode-icon {
        mask-image: url("/icons/comments-solid-full.svg");
    }

    .reply-context .preview-mode-icon {
        mask-image: url("/icons/reply-solid-full.svg");
    }

    .quote-context .preview-mode-icon {
        mask-image: url("/icons/quote-right-solid-full.svg");
    }

    .context-label {
        flex-shrink: 0;
        color: var(--theme);
        font-weight: 600;
    }

    .context-name,
    .context-detail {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .context-name {
        flex: 0 1 auto;
        min-width: 3em;
    }

    .context-detail {
        flex: 1 1 auto;
        min-width: 0;
        color: var(--text-muted);
    }

    .draft-timestamp {
        flex-shrink: 0;
        font-size: 1rem;
        font-weight: 400;
        color: var(--text-muted);
    }

    .trash-icon {
        mask-image: url("/icons/trash-solid-full.svg");
    }

    .xmark-icon {
        mask-image: url("/icons/xmark-solid-full.svg");
        width: 20px;
        height: 20px;
    }
</style>
