<script lang="ts">
    import { _ } from "svelte-i18n";
    import {
        contentWarningStore,
        contentWarningReasonStore,
    } from "../stores/tagsStore.svelte";
    import { reasonInputVisibleStore } from "../stores/uiStore.svelte";

    // Content Warning状態を取得
    let contentWarningEnabled = $derived(contentWarningStore.value);
    let contentWarningReason = $derived(contentWarningReasonStore.value);

    // 表示判定
    let showReasonInput = $derived(contentWarningEnabled);

    // 表示状態をストアに反映（CSS変数の更新をトリガー）
    $effect(() => {
        reasonInputVisibleStore.set(showReasonInput);
    });

    // Reasonテキスト変更時
    function handleReasonInput(event: Event) {
        const target = event.target as HTMLInputElement;
        contentWarningReasonStore.set(target.value);
    }
</script>

{#if showReasonInput}
    <div class="reason-input-container">
        <input
            id="content-warning-reason-input"
            type="text"
            placeholder={$_("postComponent.content_warning_reason_placeholder")}
            value={contentWarningReason}
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
        height: var(--reason-input-base-height);
        padding: 0 8px;
        margin: auto;
        background: var(--bg-buttonbar);
        position: var(--app-overlay-position);
        left: 0;
        right: 0;
        bottom: var(--reason-input-bottom);
        z-index: 97;
        transition: bottom 0.2s ease;
    }

    .reason-input {
        width: 100%;
        height: 38px;
        padding: 0 10px;
        border: 1px solid var(--border);
        border-radius: 4px;
        background: var(--bg-input);
        color: var(--text);
        font-size: 1.125rem;
        font-family: inherit;
        outline: none;
    }

    .reason-input::placeholder {
        color: var(--text-muted);
    }

    .reason-input:focus-visible {
        outline: 2px solid var(--theme);
        outline-offset: -1px;
    }

    @media (prefers-reduced-motion: reduce) {
        .reason-input-container {
            transition: none;
        }
    }
</style>
