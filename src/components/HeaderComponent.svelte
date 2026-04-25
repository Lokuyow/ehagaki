<script lang="ts">
    import { _ } from "svelte-i18n";
    import { Tooltip } from "bits-ui";
    import { editorState } from "../stores/editorStore.svelte";
    import Button from "./Button.svelte";
    import BalloonMessage from "./BalloonMessage.svelte";
    import PopupModal from "./PopupModal.svelte";
    import { type BalloonMessage as BalloonMessageType } from "../lib/types";
    import { resolveCompactMessageText } from "../lib/utils/headerComponentUtils";
    import { preventKeyboardFocusChange } from "../lib/utils/keyboardFocusUtils";

    interface Props {
        onResetPostContent: () => void;
        onSaveDraft: () => boolean;
        onShowDraftList: () => void;
        balloonMessage?: BalloonMessageType | null;
        compactMessage?: BalloonMessageType | null;
        showMascot?: boolean;
        showBalloonMessage?: boolean;
    }

    let {
        onResetPostContent,
        onSaveDraft,
        onShowDraftList,
        balloonMessage = null,
        compactMessage = null,
        showMascot = true,
        showBalloonMessage = true,
    }: Props = $props();

    // 下書き保存ポップアップの状態
    let showDraftSavedPopup = $state(false);
    let draftPopupX = $state(0);
    let draftPopupY = $state(0);

    function handleSaveDraft(e: MouseEvent) {
        const success = onSaveDraft();
        if (success) {
            // ボタンの位置を基準にポップアップを表示
            const target = e.currentTarget as HTMLElement;
            const rect = target.getBoundingClientRect();
            draftPopupX = rect.left + rect.width / 2;
            draftPopupY = rect.bottom + 8;
            showDraftSavedPopup = true;

            // 2秒後に自動で閉じる
            setTimeout(() => {
                showDraftSavedPopup = false;
            }, 2000);
        }
    }

    let postStatus = $derived(editorState.postStatus);
    let isUploading = $derived(editorState.isUploading);
    let canPost = $derived(editorState.canPost);
    let compactSuccessText = $derived(
        $_("balloonMessage.success.compact_post_success") || "投稿完了",
    );
    let compactMessageText = $derived(
        resolveCompactMessageText(compactMessage, compactSuccessText),
    );

    // iPhone用振動チェックボックスの参照
    let vibrateSwitchInput: HTMLInputElement | undefined = $state();

    // マウント時にswitch属性を設定
    $effect(() => {
        if (vibrateSwitchInput) {
            vibrateSwitchInput.setAttribute("switch", "");
        }
    });
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
        {#if showBalloonMessage && balloonMessage}
            <BalloonMessage
                type={balloonMessage.type}
                message={balloonMessage.message}
            />
        {/if}
        {#if (!showBalloonMessage || !showMascot) && compactMessage}
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
                                className="clear-button"
                                disabled={!canPost ||
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
                                className="draft-save-button"
                                disabled={!canPost ||
                                    postStatus.sending ||
                                    isUploading}
                                onClick={(e) => {
                                    handleSaveDraft(e);
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

<!-- iPhone用の振動トリガー（非表示） -->
<!-- svelte-ignore a11y_hidden -->
<!-- svelte-ignore a11y_label_has_associated_control -->
<label id="vibrateSwitch" style="display: none;" aria-hidden="true">
    <input type="checkbox" checked bind:this={vibrateSwitchInput} />
</label>

<!-- 下書き保存成功ポップアップ -->
<PopupModal
    show={showDraftSavedPopup}
    x={draftPopupX}
    y={draftPopupY}
    onClose={() => (showDraftSavedPopup = false)}
>
    <div class="copy-success-message">{$_("draft.saved")}</div>
</PopupModal>

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

        &:hover {
            filter: brightness(100%);
        }
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
        background: color-mix(in srgb, var(--dialog) 82%, var(--base) 18%);
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
        mask-image: url("/icons/trash-solid-full.svg");
        width: 30px;
        height: 30px;
    }

    .list-icon {
        mask-image: url("/icons/list-solid-full.svg");
        width: 30px;
        height: 30px;
    }

    .floppy-disk-icon {
        mask-image: url("/icons/floppy-disk-solid-full.svg");
        width: 30px;
        height: 30px;
    }

    :global(.tooltip-content) {
        background: var(--dialog);
        color: var(--text);
        border: 1px solid var(--border);
        border-radius: 6px;
        padding: 12px;
        font-size: 1rem;
        font-weight: 600;
        z-index: 100;
    }
</style>
