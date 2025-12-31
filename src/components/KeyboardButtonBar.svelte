<script lang="ts">
    import { _ } from "svelte-i18n";
    import Button from "./Button.svelte";
    import {
        contentWarningStore,
        contentWarningReasonStore,
    } from "../stores/tagsStore.svelte";

    // Content Warning状態を取得
    let contentWarningEnabled = $derived(contentWarningStore.value);
    let contentWarningReason = $derived(contentWarningReasonStore.value);
    let showReasonInput = $derived(contentWarningEnabled);

    // Content Warningトグル
    function toggleContentWarning() {
        contentWarningStore.toggle();
        if (!contentWarningStore.value) {
            // disabledになった時はreasonをクリア
            contentWarningReasonStore.reset();
        }
    }

    // Reasonテキスト変更時
    function handleReasonInput(event: Event) {
        const target = event.target as HTMLInputElement;
        contentWarningReasonStore.set(target.value);
    }

    // キーボード追従のための位置調整
    let bottomPosition = $state(66); // 初期値: フッターの高さ(66px)

    $effect(() => {
        if (typeof window === "undefined" || !window.visualViewport) return;

        function handleResize() {
            const viewport = window.visualViewport;
            if (!viewport) return;

            // キーボードが開いている場合、viewportの高さが変わる
            const keyboardHeight = window.innerHeight - viewport.height;

            // キーボードが開いている時はキーボードの直上、閉じている時はフッターの直上
            bottomPosition = keyboardHeight > 0 ? keyboardHeight : 66;
        }

        // 初期値を設定
        handleResize();

        window.visualViewport.addEventListener("resize", handleResize);
        window.visualViewport.addEventListener("scroll", handleResize);

        return () => {
            window.visualViewport?.removeEventListener("resize", handleResize);
            window.visualViewport?.removeEventListener("scroll", handleResize);
        };
    });
</script>

<div class="footer-button-bar" style="bottom: {bottomPosition}px;">
    <div class="button-container">
        <Button
            variant="footer"
            shape="square"
            selected={contentWarningEnabled}
            onClick={toggleContentWarning}
            ariaLabel="Content Warning切り替え"
        >
            <div class="content-warning-icon svg-icon"></div>
        </Button>
    </div>

    {#if showReasonInput}
        <div class="reason-input-area">
            <input
                id="content-warning-reason-input"
                type="text"
                placeholder={$_(
                    "postComponent.content_warning_reason_placeholder",
                )}
                value={contentWarningReason}
                onchange={handleReasonInput}
                oninput={handleReasonInput}
                aria-label={$_("postComponent.content_warning_reason_label")}
                class="reason-input"
            />
        </div>
    {/if}
</div>

<style>
    .footer-button-bar {
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
        z-index: 98;
        transition: bottom 0.2s ease;
    }

    .button-container {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 8px;
        width: auto;
    }

    :global(.footer-button-bar .footer) {
        width: 50px;
        height: 50px;
    }

    .content-warning-icon {
        mask-image: url("/icons/eye-slash-solid-full.svg");
    }

    .reason-input-area {
        flex: 1;
        display: flex;
        align-items: center;
        height: 100%;
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
