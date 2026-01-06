<script lang="ts">
    import { _ } from "svelte-i18n";
    import {
        contentWarningStore,
        contentWarningReasonStore,
    } from "../stores/tagsStore.svelte";
    import {
        bottomPositionStore,
        KEYBOARD_BUTTON_BAR_HEIGHT,
    } from "../stores/uiStore.svelte";

    // Content Warning状態を取得
    let contentWarningEnabled = $derived(contentWarningStore.value);
    let contentWarningReason = $derived(contentWarningReasonStore.value);

    // 表示判定
    let showReasonInput = $derived(contentWarningEnabled);

    // バーの直上に配置するための位置計算
    let inputBottomPosition = $derived(
        bottomPositionStore.value + KEYBOARD_BUTTON_BAR_HEIGHT,
    );

    // Reasonテキスト変更時
    function handleReasonInput(event: Event) {
        const target = event.target as HTMLInputElement;
        contentWarningReasonStore.set(target.value);
    }
</script>

{#if showReasonInput}
    <div
        class="reason-input-container"
        style="bottom: {inputBottomPosition}px;"
    >
        <input
            id="content-warning-reason-input"
            type="text"
            placeholder={$_("postComponent.content_warning_reason_placeholder")}
            value={contentWarningReason}
            onchange={handleReasonInput}
            oninput={handleReasonInput}
            aria-label={$_("postComponent.content_warning_reason_label")}
            class="reason-input"
        />
    </div>
{/if}

<style>
    .reason-input-container {
        display: flex;
        align-items: center;
        width: 100%;
        max-width: 800px;
        height: 50px;
        padding: 0 8px;
        margin: auto;
        background: var(--bg-buttonbar);
        position: fixed;
        left: 0;
        right: 0;
        z-index: 97;
        transition: bottom 0.2s ease;
    }

    .reason-input {
        width: 100%;
        height: 38px;
        padding: 0 10px;
        border: 1px solid var(--border-color, #ccc);
        border-radius: 4px;
        background: var(--bg-input, #fff);
        color: var(--text-primary);
        font-size: 1.125rem;
        font-family: inherit;
    }

    .reason-input::placeholder {
        color: var(--text-secondary, #999);
    }

    .reason-input:focus {
        outline: none;
        border-color: var(--border-active, #2196f3);
        box-shadow: 0 0 4px rgba(33, 150, 243, 0.3);
    }
</style>
