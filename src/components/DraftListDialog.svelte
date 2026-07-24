<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { _ } from "svelte-i18n";
    import { Dialog } from "bits-ui";
    import type { Draft } from "../lib/types";
    import { editorState } from "../stores/editorStore.svelte";
    import Button from "./Button.svelte";
    import DialogWrapper from "./DialogWrapper.svelte";
    import FloatingMessage from "./FloatingMessage.svelte";
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
        toggleDraftPinned,
        formatDraftTimestamp,
    } from "../lib/draftManager";
    import type {
        DraftSaveAttemptResult,
        DraftSaveCompletedEvent,
    } from "../lib/draftComposerController";

    interface Props {
        show: boolean;
        onClose: () => void;
        onApplyDraft: (draft: Draft) => void;
        onSaveDraft: () => Promise<DraftSaveAttemptResult>;
        subscribeToDraftSaveCompleted: (
            listener: (event: DraftSaveCompletedEvent) => void,
        ) => () => void;
        canSaveDraft: boolean;
        pubkeyHex?: string | null;
    }

    let {
        show = $bindable(false),
        onClose,
        onApplyDraft,
        onSaveDraft,
        subscribeToDraftSaveCompleted,
        canSaveDraft,
        pubkeyHex = null,
    }: Props = $props();

    // 下書きリスト
    let drafts = $state<Draft[]>([]);
    let operationPhase = $state<"idle" | "saving" | "mutating-list">("idle");
    let listLoadState = $state<"loading" | "ready" | "failed">("loading");
    let loadedPubkeyHex = $state<string | null | undefined>(undefined);
    let showSaveSuccessMessage = $state(false);
    let saveSuccessMessageTimeoutId: ReturnType<typeof setTimeout> | undefined;
    let draftLoadGeneration = 0;
    let operationGeneration = 0;
    let destroyed = false;

    function getDraftDisplayLabels(): DraftContextLabels {
        return {
            channel: $_("channelComposer.selected_label") || "チャンネル",
            reply: $_("replyQuote.reply_label") || "リプライ",
            quote: $_("replyQuote.quote_label") || "引用",
            image: $_("draft.media.image") || "[画像]",
            video: $_("draft.media.video") || "[動画]",
        };
    }

    let postStatus = $derived(editorState.postStatus);
    let isUploading = $derived(editorState.isUploading);
    let isListScopeCurrent = $derived(
        listLoadState === "ready" &&
            loadedPubkeyHex !== undefined &&
            loadedPubkeyHex === pubkeyHex,
    );
    let saveDisabled = $derived(
        !canSaveDraft ||
            postStatus.sending ||
            isUploading ||
            operationPhase !== "idle" ||
            !isListScopeCurrent,
    );
    let listActionsDisabled = $derived(
        operationPhase !== "idle" || !isListScopeCurrent,
    );

    // ダイアログを閉じるハンドラ
    function handleClose() {
        show = false;
        onClose?.();
    }

    // ブラウザ履歴統合
    useDialogHistory(() => show, handleClose, true);

    function clearSaveSuccessMessageTimeout() {
        if (saveSuccessMessageTimeoutId !== undefined) {
            clearTimeout(saveSuccessMessageTimeoutId);
            saveSuccessMessageTimeoutId = undefined;
        }
    }

    function showDraftSavedMessage() {
        clearSaveSuccessMessageTimeout();
        showSaveSuccessMessage = true;
        saveSuccessMessageTimeoutId = setTimeout(() => {
            if (destroyed) return;
            showSaveSuccessMessage = false;
            saveSuccessMessageTimeoutId = undefined;
        }, 2000);
    }

    async function refreshDrafts(
        expectedPubkeyHex: string | null,
        clearCurrentDrafts = false,
    ) {
        if (!show || expectedPubkeyHex !== pubkeyHex) return;

        const generation = ++draftLoadGeneration;
        listLoadState = "loading";
        if (clearCurrentDrafts) {
            drafts = [];
            loadedPubkeyHex = undefined;
        }
        try {
            const loadedDrafts = await loadDrafts({
                pubkeyHex: expectedPubkeyHex,
            });
            if (
                !destroyed &&
                show &&
                expectedPubkeyHex === pubkeyHex &&
                generation === draftLoadGeneration
            ) {
                drafts = loadedDrafts;
                loadedPubkeyHex = expectedPubkeyHex;
                listLoadState = "ready";
            }
        } catch (error) {
            if (
                !destroyed &&
                show &&
                expectedPubkeyHex === pubkeyHex &&
                generation === draftLoadGeneration
            ) {
                drafts = [];
                loadedPubkeyHex = undefined;
                listLoadState = "failed";
            }
            console.error("下書き一覧の読み込みに失敗:", error);
        }
    }

    function handleDraftSaveCompleted(event: DraftSaveCompletedEvent) {
        if (!show || event.pubkeyHex !== pubkeyHex) return;

        showDraftSavedMessage();
        void refreshDrafts(event.pubkeyHex);
    }

    onMount(() =>
        subscribeToDraftSaveCompleted(handleDraftSaveCompleted),
    );

    onDestroy(() => {
        destroyed = true;
        draftLoadGeneration += 1;
        operationGeneration += 1;
        clearSaveSuccessMessageTimeout();
    });

    // ダイアログが開かれたときに下書きを読み込む
    $effect(() => {
        const currentPubkeyHex = pubkeyHex;
        if (!show) {
            draftLoadGeneration += 1;
            operationGeneration += 1;
            drafts = [];
            loadedPubkeyHex = undefined;
            listLoadState = "loading";
            operationPhase = "idle";
            return;
        }

        operationGeneration += 1;
        operationPhase = "idle";
        void refreshDrafts(currentPubkeyHex, true);
    });

    // 下書きを適用
    function handleApplyDraft(draft: Draft) {
        if (listActionsDisabled || loadedPubkeyHex !== pubkeyHex) return;
        onApplyDraft(draft);
        handleClose();
    }

    async function handleSaveDraftClick() {
        if (saveDisabled) return;

        const savePubkeyHex = pubkeyHex;
        const generation = ++operationGeneration;
        operationPhase = "saving";
        try {
            await onSaveDraft();
        } finally {
            if (
                !destroyed &&
                generation === operationGeneration &&
                savePubkeyHex === pubkeyHex
            ) {
                operationPhase = "idle";
            }
        }
    }

    async function runListMutation(
        operation: (options: { pubkeyHex: string | null }) => Promise<unknown>,
    ) {
        if (
            listActionsDisabled ||
            loadedPubkeyHex === undefined ||
            loadedPubkeyHex !== pubkeyHex
        ) return;

        const mutationPubkeyHex = loadedPubkeyHex;
        const generation = ++operationGeneration;
        operationPhase = "mutating-list";
        try {
            await operation({ pubkeyHex: mutationPubkeyHex });
            if (
                destroyed ||
                generation !== operationGeneration ||
                mutationPubkeyHex !== pubkeyHex
            ) return;
            await refreshDrafts(mutationPubkeyHex);
        } catch (error) {
            console.error("下書き一覧の更新に失敗:", error);
        } finally {
            if (
                !destroyed &&
                generation === operationGeneration &&
                mutationPubkeyHex === pubkeyHex
            ) {
                operationPhase = "idle";
            }
        }
    }

    // 下書きを削除
    async function handleDeleteDraft(id: string) {
        await runListMutation((options) => deleteDraft(id, options));
    }

    async function handleTogglePinned(draft: Draft) {
        await runListMutation((options) =>
            toggleDraftPinned(draft.id, !draft.pinned, options),
        );
    }

    // 全ての下書きを削除
    async function handleDeleteAllDrafts() {
        await runListMutation((options) => deleteAllDrafts(options));
    }

    function handleRetryLoad() {
        if (!show || listLoadState !== "failed") return;
        void refreshDrafts(pubkeyHex, true);
    }
</script>

<DialogWrapper
    bind:open={show}
    onOpenChange={(open) => !open && handleClose()}
    title={$_("draft.list_title") || "下書き一覧"}
    description={$_("draft.list_description") || "保存した下書きを選択して復元"}
    contentClass="draft-list-dialog"
    footerVariant="close-button"
    initialFocus="content"
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
            disabled={listActionsDisabled}
            onClick={handleDeleteAllDrafts}
        >
            <div class="trash-icon svg-icon"></div>
            <span class="delete-all-label"
                >{$_("draft.delete_all") || "全て削除"}</span
            >
        </Button>
    </div>

    <div class="draft-list-container">
        {#if listLoadState === "failed"}
            <div class="load-error">
                <div role="alert">
                    {$_("draft.load_failed") ||
                        "下書き一覧を読み込めませんでした。"}
                </div>
                <Button
                    className="retry-load-button"
                    variant="secondary"
                    shape="square"
                    ariaLabel={$_("draft.retry_load") || "再試行"}
                    onClick={handleRetryLoad}
                >
                    {$_("draft.retry_load") || "再試行"}
                </Button>
            </div>
        {:else if listLoadState === "loading" ||
            loadedPubkeyHex !== pubkeyHex}
            <div class="empty-message">
                {$_("loadingPlaceholder.loading") || "読み込み中..."}
            </div>
        {:else if listLoadState === "ready" &&
            loadedPubkeyHex === pubkeyHex &&
            drafts.length === 0}
            <div class="empty-message">
                {$_("draft.no_drafts") || "下書きがありません"}
            </div>
        {:else if listLoadState === "ready" &&
            loadedPubkeyHex === pubkeyHex}
            <ul class="draft-list">
                {#each drafts as draft (draft.id)}
                    {@const display = createDraftListDisplay(
                        draft,
                        getDraftDisplayLabels(),
                        document,
                    )}
                    <li class="draft-item">
                        <Button
                            className={`pin-button ${draft.pinned ? "pinned" : ""}`}
                            variant="default"
                            shape="square"
                            ariaLabel={draft.pinned
                                ? $_("draft.unpin") || "ピン留めを解除"
                                : $_("draft.pin") || "ピン留め"}
                            aria-pressed={draft.pinned ? "true" : "false"}
                            disabled={listActionsDisabled}
                            onClick={() => void handleTogglePinned(draft)}
                        >
                            <div class="thumbtack-icon svg-icon"></div>
                        </Button>
                        <button
                            type="button"
                            class="draft-content"
                            disabled={listActionsDisabled}
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
                            disabled={listActionsDisabled}
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
        <div class="dialog-footer-actions">
            <Button
                className="save-draft-button"
                variant="primary"
                shape="square"
                contentLayout="iconText"
                ariaLabel={$_("draft.save") || "下書き保存"}
                disabled={saveDisabled}
                onClick={handleSaveDraftClick}
            >
                <div class="save-draft-icon svg-icon"></div>
                <span class="btn-text">{$_("draft.save") || "下書き保存"}</span>
            </Button>
            <Dialog.Close>
                {#snippet child({ props })}
                    <Button
                        {...props}
                        className="modal-close"
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
        </div>
    {/snippet}
</DialogWrapper>

<FloatingMessage
    show={showSaveSuccessMessage}
    variant="top-right"
>
    <div>{$_("draft.saved") || "下書きを保存しました"}</div>
</FloatingMessage>

<style>
    :global(.draft-list-dialog) {
        max-height: calc(100svh - 32px);
        overflow: hidden;
    }

    :global(.draft-list-dialog .dialog-content) {
        padding: 0;
        flex: 1 1 auto;
        min-height: 0;
        overflow: hidden;
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
        flex: 1 1 auto;
        min-height: 0;
        overflow-y: auto;
    }

    .dialog-footer-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
    }

    :global(.save-draft-button) {
        width: 100%;
        height: 50px;
        justify-content: center;
    }

    .save-draft-icon {
        width: 24px;
        height: 24px;
        mask-image: url("/icons/save_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .empty-message {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100px;
        color: var(--text-muted);
        font-size: 1rem;
    }

    .load-error {
        display: grid;
        justify-items: center;
        gap: 12px;
        padding: 24px 16px;
        color: var(--text-muted);
        text-align: center;
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
            --btn-bg: var(--dialog-bg);

            .trash-icon {
                width: 24px;
                height: 24px;
            }
        }

        :global(.pin-button) {
            width: 44px;
            height: auto;
            --btn-bg: var(--dialog-bg);

            .thumbtack-icon {
                width: 20px;
                height: 20px;
                opacity: 0.38;
                transition: opacity 0.15s ease;
            }

            &.pinned .thumbtack-icon {
                opacity: 1;
            }
        }

        button.draft-content {
            flex: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 8px;
            padding: 10px;
            --btn-bg: var(--dialog-bg);
            border: none;
            cursor: pointer;
            text-align: start;
            color: var(--text);
            font-size: 1rem;
            min-width: 0;
            height: auto;
        }
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
        mask-image: url("/icons/forum_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg");
    }

    .reply-context .preview-mode-icon {
        mask-image: url("/icons/chat_bubble_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg");
    }

    .quote-context .preview-mode-icon {
        mask-image: url("/icons/format_quote_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg");
    }

    .context-name,
    .context-detail {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .context-name {
        flex: 1 0 auto;
        min-width: 3em;
    }

    .context-detail {
        flex: 0 1 auto;
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
        mask-image: url("/icons/delete_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .thumbtack-icon {
        mask-image: url("/icons/keep_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .xmark-icon {
        mask-image: url("/icons/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        width: 20px;
        height: 20px;
    }
</style>
