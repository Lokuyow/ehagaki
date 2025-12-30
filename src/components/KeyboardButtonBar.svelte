<script lang="ts">
    import Button from "./Button.svelte";
    import { contentWarningStore } from "../stores/tagsStore.svelte";

    // Content Warning状態を取得
    let contentWarningEnabled = $derived(contentWarningStore.value);

    // Content Warningトグル
    function toggleContentWarning() {
        contentWarningStore.toggle();
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
</div>

<style>
    .footer-button-bar {
        display: flex;
        align-items: center;
        width: 100%;
        max-width: 800px;
        height: 58px;
        padding: 4px 8px;
        margin: auto;
        background: var(--bg-footer);
        position: fixed;
        left: 0;
        right: 0;
        box-shadow: 0 -2px 8px var(--shadow);
        z-index: 98;
        transition: bottom 0.2s ease;
    }

    .button-container {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 8px;
        width: 100%;
    }

    :global(.footer-button-bar .footer) {
        width: 50px;
        height: 50px;
    }

    .content-warning-icon {
        mask-image: url("/icons/eye-slash-solid-full.svg");
    }
</style>
