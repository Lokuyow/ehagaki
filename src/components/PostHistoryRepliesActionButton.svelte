<script lang="ts">
    import Button from "./Button.svelte";

    interface RepliesActionState {
        status: "unloaded" | "loading" | "loaded" | "failed";
        visible: boolean;
        replies: unknown[];
        replyCount: number;
    }

    interface Props {
        state: RepliesActionState;
        ariaLabel: string;
        onClick: () => void;
    }

    let { state, ariaLabel, onClick }: Props = $props();
</script>

<Button
    type="button"
    class="post-preview-action-button post-preview-replies-action-button"
    {ariaLabel}
    title={ariaLabel}
    contentLayout="icon"
    shape="circle"
    selected={state.visible}
    disabled={state.status === "loading"}
    {onClick}
>
    {#if state.status === "loading"}
        <span class="post-preview-replies-spinner" aria-hidden="true"></span>
    {:else}
        <span class="post-preview-replies-icon-wrapper" aria-hidden="true">
            <span class="subdirectory-arrow-right-icon svg-icon"></span>
            {#if state.status === "loaded" && state.replyCount > 0}
                <span class="post-preview-replies-count">
                    {state.replyCount}
                </span>
            {/if}
        </span>
    {/if}
</Button>

<style>
    .post-preview-replies-icon-wrapper {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
        flex: 0 0 22px;
    }

    .subdirectory-arrow-right-icon.svg-icon {
        width: 22px;
        height: 22px;
        mask-image: url("/icons/subdirectory_arrow_right_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .post-preview-replies-spinner {
        width: 22px;
        height: 22px;
        border: 2px solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        animation: post-preview-replies-spinner 0.8s linear infinite;
    }

    .post-preview-replies-count {
        position: absolute;
        top: -4px;
        right: -5px;
        min-width: 14px;
        height: 14px;
        padding: 0 3px;
        border-radius: 999px;
        background: var(--btn-post-preview-action);
        color: var(--dialog-bg);
        font-size: 0.68rem;
        font-weight: 700;
        line-height: 14px;
        text-align: center;
    }

    @keyframes post-preview-replies-spinner {
        to {
            transform: rotate(360deg);
        }
    }

    :global(.post-preview-footer) {
        :global(
                .post-preview-action-button.post-preview-replies-action-button.selected
            ) {
            background: color-mix(in srgb, var(--theme) 12%, transparent);
            color: var(--theme);

            :global(.svg-icon) {
                --svg: var(--theme);
            }

            :global(.post-preview-replies-count) {
                background-color: var(--theme);
            }
        }

        @media (min-width: 601px) {
            :global(
                    .post-preview-action-button.post-preview-replies-action-button:hover:not(
                            :disabled
                        )
                ) {
                background: color-mix(in srgb, var(--theme) 10%, transparent);

                :global(.svg-icon) {
                    --svg: var(--theme);
                }

                :global(.post-preview-replies-count) {
                    background-color: var(--theme);
                }
            }
        }
    }
</style>
