<script lang="ts">
    import { Dialog } from "bits-ui";
    import { _ } from "svelte-i18n";
    import Button from "./Button.svelte";
    import DialogWrapper from "./DialogWrapper.svelte";

    interface Props {
        open?: boolean;
        rawEvent: unknown;
        onOpenChange?: (open: boolean) => void;
    }

    let {
        open = $bindable(false),
        rawEvent,
        onOpenChange = undefined,
    }: Props = $props();

    let rawJson = $derived(JSON.stringify(rawEvent, null, 2) ?? "");

    function handleOpenChange(nextOpen: boolean): void {
        if (!nextOpen) {
            onOpenChange?.(false);
        }
    }
</script>

<DialogWrapper
    bind:open
    onOpenChange={handleOpenChange}
    title={$_("postHistory.rawJsonTitle")}
    description={$_("postHistory.rawJsonDescription")}
    contentClass="post-history-raw-json-dialog"
    footerVariant="close-button"
    initialFocus="content"
>
    <div class="raw-json-heading">
        <h2>{$_("postHistory.rawJsonTitle")}</h2>
    </div>
    <pre class="raw-json-content"><code>{rawJson}</code></pre>

    {#snippet footer()}
        <Dialog.Close>
            {#snippet child({ props })}
                <Button
                    {...props}
                    className="modal-close raw-json-close-button"
                >
                    {$_("global.close")}
                </Button>
            {/snippet}
        </Dialog.Close>
    {/snippet}
</DialogWrapper>

<style>
    :global(.post-history-raw-json-dialog .dialog-content) {
        padding: 8px;
    }
    .raw-json-heading {
        width: 100%;
    }

    .raw-json-heading h2 {
        margin: 0;
        font-size: 1.1rem;
    }

    .raw-json-content {
        width: 100%;
        height: 100%;
        margin: 10px 0 0;
        padding: 8px;
        box-sizing: border-box;
        overflow: auto;
        border: 1px solid var(--border-hr);
        border-radius: 8px;
        background: color-mix(in srgb, var(--dialog-bg), var(--text) 4%);
        color: var(--text);
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
            "Liberation Mono", monospace;
        font-size: 0.82rem;
        line-height: 1.45;
        text-align: left;
        white-space: pre;
    }

    :global(.post-history-raw-json-dialog) {
        max-width: min(760px, calc(100% - 10px));
    }
</style>
