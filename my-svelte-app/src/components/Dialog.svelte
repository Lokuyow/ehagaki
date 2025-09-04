<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import Button from "./Button.svelte";

    export let show: boolean = false;
    export let onClose: () => void;
    export let ariaLabel: string = "Dialog";
    export let className: string = "";
    export let showFooter: boolean = false;
    export let useHistory: boolean = true;

    let isModalVisible = false;

    function closeModal() {
        show = false;
        onClose?.();
    }

    function handlePopState() {
        if (isModalVisible && window.location.hash !== "#modal") {
            closeModal();
        }
    }

    $: {
        if (typeof window !== "undefined" && useHistory) {
            if (show) {
                isModalVisible = true;
                if (window.location.hash !== "#modal") {
                    history.pushState(null, "", "#modal");
                }
            } else {
                isModalVisible = false;
                if (window.location.hash === "#modal") {
                    history.back();
                }
            }
        } else {
            isModalVisible = show;
        }
    }

    onMount(() => {
        window.addEventListener("popstate", handlePopState);
    });

    onDestroy(() => {
        window.removeEventListener("popstate", handlePopState);
    });
</script>

{#if isModalVisible}
    <div
        class="dialog-overlay"
        role="presentation"
        on:click={closeModal}
        aria-label={ariaLabel}
    >
        <div
            class="dialog {className} {$$props.class || ''}"
            role="dialog"
            aria-modal="true"
            tabindex="0"
            on:click|stopPropagation
            on:keydown={(e) => {
                if (e.key === "Escape") closeModal();
            }}
        >
            <div class="dialog-content">
                <slot />
            </div>
            {#if showFooter}
                <div class="dialog-footer">
                    <slot name="footer">
                        <Button
                            className="modal-close btn-circle"
                            on:click={closeModal}
                            ariaLabel="閉じる"
                        >
                            <div
                                class="xmark-icon svg-icon"
                                aria-label="閉じる"
                            ></div>
                        </Button>
                    </slot>
                </div>
            {/if}
        </div>
    </div>
{/if}

<style>
    .dialog-overlay {
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

    .dialog {
        background: var(--dialog);
        color: var(--text);
        width: 100%;
        max-width: 500px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .dialog-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-height: 85svh;
        padding: 16px;
        box-sizing: border-box;
    }

    .dialog-footer {
        width: 100%;
        height: 48px;
        border-top: 1px solid var(--border-hr);
        display: flex;
        justify-content: center;
        align-items: center;

        :global(.modal-close) {
            background-color: transparent;
            border: none;
            border-radius: 0;
            width: 100%;
            height: 47px;

            .xmark-icon {
                mask-image: url("/ehagaki/icons/xmark-solid-full.svg");
            }
        }
    }
</style>
