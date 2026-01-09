<script lang="ts">
    import { _ } from "svelte-i18n";
    import { Dialog } from "bits-ui";
    import type { Draft } from "../lib/types";
    import Button from "./Button.svelte";
    import DialogWrapper from "./DialogWrapper.svelte";
    import { useDialogHistory } from "../lib/hooks/useDialogHistory.svelte";
    import {
        loadDrafts,
        deleteDraft,
        deleteAllDrafts,
        formatDraftTimestamp,
    } from "../lib/draftManager";

    interface Props {
        show: boolean;
        onClose: () => void;
        onApplyDraft: (content: string) => void;
    }

    let { show = $bindable(false), onClose, onApplyDraft }: Props = $props();

    // 下書きリスト
    let drafts = $state<Draft[]>([]);

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
            drafts = loadDrafts();
        }
    });

    // 下書きを適用
    function handleApplyDraft(draft: Draft) {
        onApplyDraft(draft.content);
        handleClose();
    }

    // 下書きを削除
    function handleDeleteDraft(id: string) {
        drafts = deleteDraft(id);
    }

    // 全ての下書きを削除
    function handleDeleteAllDrafts() {
        drafts = deleteAllDrafts();
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
        <h3 class="dialog-heading">{$_("draft.title") || "下書き"}</h3>
        <div class="delete-all-section">
            <button
                type="button"
                class="delete-all-button"
                onclick={handleDeleteAllDrafts}
                aria-label={$_("draft.delete_all") || "全て削除"}
            >
                <span class="delete-all-label"
                    >{$_("draft.delete_all") || "全て削除"}</span
                >
                <div class="trash-icon svg-icon"></div>
            </button>
        </div>
    </div>

    <div class="draft-list-container">
        {#if drafts.length === 0}
            <div class="empty-message">
                {$_("draft.no_drafts") || "下書きがありません"}
            </div>
        {:else}
            <ul class="draft-list">
                {#each drafts as draft (draft.id)}
                    <li class="draft-item">
                        <button
                            type="button"
                            class="draft-content"
                            onclick={() => handleApplyDraft(draft)}
                        >
                            <span class="draft-preview">{draft.preview}</span>
                            <span class="draft-timestamp"
                                >{formatDraftTimestamp(draft.timestamp)}</span
                            >
                        </button>
                        <button
                            type="button"
                            class="delete-button"
                            onclick={() => handleDeleteDraft(draft.id)}
                            aria-label={$_("draft.delete") || "削除"}
                        >
                            <div class="trash-icon svg-icon"></div>
                        </button>
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

    .dialog-heading {
        margin: 0;
    }

    .delete-all-label {
        font-size: 0.875rem;
        font-weight: 400;
        color: var(--text-muted);
    }

    .delete-all-button {
        display: flex;
        align-items: center;
        gap: 8px;
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-muted);
        padding: 8px 12px;

        &:hover {
            background-color: var(--bg-hover);
        }

        &:active {
            background-color: var(--bg-active);
        }
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
        align-items: center;
        min-height: 50px;
        padding: 0 8px;
        border-bottom: 1px solid var(--border-hr);

        &:last-child {
            border-bottom: none;
        }
    }

    .draft-content {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 8px;
        background: none;
        border: none;
        cursor: pointer;
        text-align: left;
        color: var(--text);
        font-size: 1.125rem;
        min-width: 0;

        &:hover {
            background-color: var(--bg-hover);
        }

        &:active {
            background-color: var(--bg-active);
        }
    }

    .draft-preview {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 8px;
    }

    .draft-timestamp {
        flex-shrink: 0;
        font-size: 1rem;
        font-weight: 400;
        color: var(--text-muted);
    }

    .delete-button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50px;
        height: 50px;
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-muted);

        &:hover {
            background-color: var(--bg-hover);
        }

        &:active {
            background-color: var(--bg-active);
        }
    }

    .trash-icon {
        mask-image: url("/icons/trash-solid-full.svg");
        width: 24px;
        height: 24px;
    }

    .xmark-icon {
        mask-image: url("/icons/xmark-solid-full.svg");
        width: 20px;
        height: 20px;
    }
</style>
