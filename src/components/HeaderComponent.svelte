<script lang="ts">
    import { _ } from "svelte-i18n";
    import { onDestroy } from "svelte";
    import { Tooltip } from "bits-ui";
    import { editorState } from "../stores/editorStore.svelte";
    import Button from "./Button.svelte";
    import BalloonMessage from "./BalloonMessage.svelte";
    import FloatingMessage from "./FloatingMessage.svelte";
    import { type BalloonMessage as BalloonMessageType } from "../lib/types";
    import { resolveCompactMessageText } from "../lib/utils/headerComponentUtils";
    import { preventKeyboardFocusChange } from "../lib/utils/keyboardFocusUtils";

    interface Props {
        onResetPostContent: () => void;
        onSaveDraft: () => Promise<boolean>;
        onShowDraftList: () => void;
        canSaveDraft?: boolean;
        canResetPostContent?: boolean;
        balloonMessage?: BalloonMessageType | null;
        compactMessage?: BalloonMessageType | null;
        showMascot?: boolean;
        showFlavorText?: boolean;
    }

    let {
        onResetPostContent,
        onSaveDraft,
        onShowDraftList,
        canSaveDraft = undefined,
        canResetPostContent = undefined,
        balloonMessage = null,
        compactMessage = null,
        showMascot = true,
        showFlavorText = true,
    }: Props = $props();

    // 下書き保存メッセージの状態
    let showDraftSavedMessage = $state(false);
    let draftMessageX = $state(0);
    let draftMessageY = $state(0);
    let isSavingDraft = $state(false);
    let draftSavedMessageTimeoutId: ReturnType<typeof setTimeout> | undefined;

    function clearDraftSavedMessageTimeout() {
        if (draftSavedMessageTimeoutId !== undefined) {
            clearTimeout(draftSavedMessageTimeoutId);
            draftSavedMessageTimeoutId = undefined;
        }
    }

    onDestroy(clearDraftSavedMessageTimeout);

    async function handleSaveDraft(e: MouseEvent) {
        if (isSavingDraft) return;

        const target = e.currentTarget as HTMLElement | null;
        const rect = target?.getBoundingClientRect();

        isSavingDraft = true;
        let success = false;
        try {
            success = await onSaveDraft();
        } finally {
            isSavingDraft = false;
        }

        if (success && rect) {
            clearDraftSavedMessageTimeout();
            // ボタンの位置を基準にメッセージを表示
            draftMessageX = rect.left + rect.width / 2;
            draftMessageY = rect.bottom + 8;
            showDraftSavedMessage = true;

            // 2秒後に自動で閉じる
            draftSavedMessageTimeoutId = setTimeout(() => {
                showDraftSavedMessage = false;
                draftSavedMessageTimeoutId = undefined;
            }, 2000);
        }
    }

    let postStatus = $derived(editorState.postStatus);
    let isUploading = $derived(editorState.isUploading);
    let canPost = $derived(editorState.canPost);
    let canSaveCurrentDraft = $derived(canSaveDraft ?? canPost);
    let canResetCurrentPostContent = $derived(canResetPostContent ?? canPost);
    let compactSuccessText = $derived(
        $_("balloonMessage.success.compact_post_success") || "投稿完了",
    );
    let compactMessageText = $derived(
        resolveCompactMessageText(compactMessage, compactSuccessText),
    );

</script>

<div class="header-container">
    <div class="header-left">
        {#if showMascot}
            <a
                href="https://lokuyow.github.io/ehagaki/"
                class="site-icon-link"
                aria-label="ehagaki"
            >
                <img
                    src="./ehagaki_icon.svg"
                    alt="ehagaki icon"
                    class="site-icon"
                />
            </a>
        {/if}
        {#if showFlavorText && balloonMessage}
            <BalloonMessage
                type={balloonMessage.type}
                message={balloonMessage.message}
            />
        {/if}
        {#if (!showFlavorText || !showMascot) && compactMessage}
            <div class="compact-message {compactMessage.type}">
                <span class="compact-message-text">{compactMessageText}</span>
            </div>
        {/if}
    </div>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="header-actions"
        onmousedown={preventKeyboardFocusChange}
        ontouchstart={preventKeyboardFocusChange}
    >
        <Tooltip.Provider>
            <div class="buttons-container">
                <Tooltip.Root delayDuration={500}>
                    <Tooltip.Trigger>
                        {#snippet child({ props })}
                            {@const { onclick: tooltipOnclick, ...restProps } =
                                props}
                            <Button
                                variant="header"
                                shape="square"
                                contentLayout="icon"
                                className="clear-button"
                                disabled={!canResetCurrentPostContent ||
                                    postStatus.sending ||
                                    isUploading}
                                onClick={(e) => {
                                    onResetPostContent();
                                    if (typeof tooltipOnclick === "function") {
                                        tooltipOnclick(e);
                                    }
                                }}
                                ariaLabel={$_("postComponent.clear_editor")}
                                {...restProps}
                            >
                                <div class="trash-icon svg-icon"></div>
                            </Button>
                        {/snippet}
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Content sideOffset={8} class="tooltip-content">
                            {$_("postComponent.clear_editor")}
                        </Tooltip.Content>
                    </Tooltip.Portal>
                </Tooltip.Root>
                <Tooltip.Root delayDuration={500}>
                    <Tooltip.Trigger>
                        {#snippet child({ props })}
                            {@const { onclick: tooltipOnclick, ...restProps } =
                                props}
                            <Button
                                variant="header"
                                shape="square"
                                contentLayout="icon"
                                className="draft-list-button"
                                onClick={(e) => {
                                    onShowDraftList();
                                    if (typeof tooltipOnclick === "function") {
                                        tooltipOnclick(e);
                                    }
                                }}
                                ariaLabel={$_("draft.list_title") ||
                                    "下書き一覧"}
                                {...restProps}
                            >
                                <div class="list-icon svg-icon"></div>
                            </Button>
                        {/snippet}
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Content sideOffset={8} class="tooltip-content">
                            {$_("draft.list_title") || "下書き一覧"}
                        </Tooltip.Content>
                    </Tooltip.Portal>
                </Tooltip.Root>
                <Tooltip.Root delayDuration={500}>
                    <Tooltip.Trigger>
                        {#snippet child({ props })}
                            {@const { onclick: tooltipOnclick, ...restProps } =
                                props}
                            <Button
                                variant="header"
                                shape="square"
                                contentLayout="icon"
                                className="draft-save-button"
                                disabled={!canSaveCurrentDraft ||
                                    postStatus.sending ||
                                    isUploading ||
                                    isSavingDraft}
                                onClick={(e) => {
                                    void handleSaveDraft(e);
                                    if (typeof tooltipOnclick === "function") {
                                        tooltipOnclick(e);
                                    }
                                }}
                                ariaLabel={$_("draft.save") || "下書き保存"}
                                {...restProps}
                            >
                                <div class="floppy-disk-icon svg-icon"></div>
                            </Button>
                        {/snippet}
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Content sideOffset={8} class="tooltip-content">
                            {$_("draft.save") || "下書き保存"}
                        </Tooltip.Content>
                    </Tooltip.Portal>
                </Tooltip.Root>
            </div>
        </Tooltip.Provider>
    </div>
</div>

<!-- 下書き保存成功メッセージ -->
<FloatingMessage
    show={showDraftSavedMessage}
    x={draftMessageX}
    y={draftMessageY}
>
    <div>{$_("draft.saved")}</div>
</FloatingMessage>

<style>
    .header-container {
        max-width: 800px;
        width: 100%;
        height: 58px;
        margin-bottom: 6px;
        padding: 0 8px;
        display: flex;
        flex-direction: row;
        align-items: center;

        @media (min-width: 801px) {
            padding: 0;
        }
    }

    .header-left {
        display: flex;
        align-items: center;
        height: 100%;
        width: 100%;
        min-width: 0;
    }

    a.site-icon-link {
        display: flex;
        height: 100%;
    }

    .site-icon {
        width: 52px;
        height: 52px;
        margin-top: auto;
    }

    .compact-message {
        display: flex;
        align-items: center;
        min-width: 0;
        max-width: min(100%, 280px);
        margin: 0 6px;
        padding: 8px 10px;
        background: color-mix(in srgb, var(--dialog-bg) 82%, var(--base) 18%);
        color: var(--text);
        font-size: 1rem;
        line-height: 1.2;
        border: 1px solid var(--border-hr);
    }

    .compact-message.success {
        background: var(--balloon-success-bg);
        color: var(--balloon-success-color);
        border-color: var(--balloon-success-border);
    }

    .compact-message.error,
    .compact-message.warning {
        background: var(--balloon-error-bg);
        color: var(--balloon-error-color);
        border-color: var(--balloon-error-border);
    }

    .compact-message.tips {
        background: var(--balloon-tips-bg);
        color: var(--balloon-tips-color);
        border-color: var(--balloon-tips-border);
    }

    .compact-message.flavor {
        background: var(--balloon-flavor-bg);
        color: var(--balloon-flavor-color);
        border-color: var(--balloon-flavor-border);
    }

    .compact-message-text {
        min-width: 0;
        overflow-wrap: anywhere;
    }

    .header-actions {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: fit-content;
        height: 100%;
        margin-left: auto;
    }

    .buttons-container {
        display: flex;
        gap: 4px;
        align-items: center;
        height: 100%;
    }

    :global(.header.clear-button),
    :global(.header.draft-save-button),
    :global(.header.draft-list-button) {
        width: 50px;
    }

    .trash-icon {
        mask-image: url("/icons/delete_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        width: 30px;
        height: 30px;
    }

    .list-icon {
        mask-image: url("/icons/edit_note_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        width: 30px;
        height: 30px;
    }

    .floppy-disk-icon {
        mask-image: url("/icons/save_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        width: 30px;
        height: 30px;
    }

    :global(.tooltip-content) {
        background: var(--dialog-bg);
        color: var(--text);
        border: 1px solid var(--border);
        border-radius: 6px;
        padding: 12px;
        font-size: 1rem;
        font-weight: 600;
        z-index: 100;
    }
</style>
