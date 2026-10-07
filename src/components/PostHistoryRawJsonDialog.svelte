<script lang="ts">
    import { onDestroy } from "svelte";
    import { Dialog, Tabs } from "bits-ui";
    import { _ } from "svelte-i18n";
    import { isSensitivePayloadStructure } from "../lib/sensitiveContentPayload";
    import { isFullyVerifiedEvent } from "../lib/sensitiveEventUtils";
    import type { SensitiveBodyCacheStatus } from "../lib/postContentPreview";
    import type { NostrEvent } from "../lib/types";
    import Button from "./Button.svelte";
    import DialogWrapper from "./DialogWrapper.svelte";

    interface Props {
        open?: boolean;
        rawEvent: unknown;
        resetKey?: number;
        loadPayloadEvent?: (
            structure: NostrEvent,
            signal: AbortSignal,
        ) => Promise<NostrEvent | null>;
        observePayloadStatus?: (
            structure: NostrEvent,
            onChange: (status: SensitiveBodyCacheStatus) => void,
        ) => () => void;
        onOpenChange?: (open: boolean) => void;
    }

    let {
        open = $bindable(false),
        rawEvent,
        resetKey = 0,
        loadPayloadEvent = undefined,
        observePayloadStatus = undefined,
        onOpenChange = undefined,
    }: Props = $props();

    let activeTab = $state<"structure" | "payload">("structure");
    let payloadEvent = $state<NostrEvent | null | undefined>(undefined);
    let payloadAbortController: AbortController | undefined;
    let stopPayloadObservation: (() => void) | undefined;
    let loadGeneration = 0;
    let lastResetKey = -1;
    let sensitiveStructure = $derived(
        isFullyVerifiedEvent(rawEvent) && isSensitivePayloadStructure(rawEvent)
            ? rawEvent
            : null,
    );
    let showPayloadTabs = $derived(
        loadPayloadEvent !== undefined && sensitiveStructure !== null,
    );
    let structureJson = $derived(JSON.stringify(rawEvent, null, 2) ?? "");
    let payloadJson = $derived(
        payloadEvent ? JSON.stringify(payloadEvent, null, 2) ?? "" : "",
    );

    function resetPayloadSelection(): void {
        loadGeneration += 1;
        payloadAbortController?.abort();
        payloadAbortController = undefined;
        stopPayloadObservation?.();
        stopPayloadObservation = undefined;
        activeTab = "structure";
        payloadEvent = undefined;
    }

    onDestroy(resetPayloadSelection);

    $effect(() => {
        const nextResetKey = resetKey;
        if (nextResetKey !== lastResetKey) {
            resetPayloadSelection();
        }
        lastResetKey = nextResetKey;
    });

    async function selectTab(tab: "structure" | "payload"): Promise<void> {
        activeTab = tab;
        if (
            tab !== "payload"
            || payloadEvent !== undefined
            || !sensitiveStructure
            || !loadPayloadEvent
        ) {
            return;
        }

        const controller = new AbortController();
        payloadAbortController?.abort();
        payloadAbortController = controller;
        const generation = ++loadGeneration;
        const structureId = sensitiveStructure.id;
        stopPayloadObservation?.();
        stopPayloadObservation = observePayloadStatus?.(
            sensitiveStructure,
            (status) => {
                if (
                    (status === "deleted" || status === "invalid")
                    && open
                    && sensitiveStructure?.id === structureId
                ) {
                    payloadEvent = null;
                }
            },
        );
        try {
            const payload = await loadPayloadEvent(
                sensitiveStructure,
                controller.signal,
            );
            if (!controller.signal.aborted && generation === loadGeneration) {
                payloadEvent = payload;
            }
        } catch {
            if (!controller.signal.aborted && generation === loadGeneration) {
                payloadEvent = null;
            }
        } finally {
            if (generation === loadGeneration) {
                payloadAbortController = undefined;
            }
        }
    }

    function handleOpenChange(nextOpen: boolean): void {
        if (!nextOpen) {
            resetPayloadSelection();
            onOpenChange?.(false);
        }
    }
</script>

<DialogWrapper
    bind:open
    onOpenChange={handleOpenChange}
    title={$_("postHistory.rawJsonTitle")}
    description={$_("postHistory.rawJsonDescription")}
    contentClass={showPayloadTabs
        ? "post-history-raw-json-dialog post-history-raw-json-dialog--tabs"
        : "post-history-raw-json-dialog"}
    footerVariant="close-button"
    initialFocus="content"
>
    <div class="raw-json-heading">
        <h2>{$_("postHistory.rawJsonTitle")}</h2>
    </div>
    {#if showPayloadTabs}
        <Tabs.Root
            value={activeTab}
            onValueChange={(value) => void selectTab(value as "structure" | "payload")}
            class="raw-json-tabs-root"
        >
            <Tabs.List class="raw-json-tabs">
                <Tabs.Trigger value="structure">Structure</Tabs.Trigger>
                <Tabs.Trigger value="payload">Payload</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="structure" class="raw-json-panel">
                <pre class="raw-json-content"><code>{structureJson}</code></pre>
            </Tabs.Content>
            <Tabs.Content value="payload" class="raw-json-panel">
                <pre class="raw-json-content"><code>{payloadJson}</code></pre>
            </Tabs.Content>
        </Tabs.Root>
    {:else}
        <pre class="raw-json-content"><code>{structureJson}</code></pre>
    {/if}

    {#snippet footer()}
        <Dialog.Close>
            {#snippet child({ props })}
                <Button
                    {...props}
                    className="modal-close"
                    shape="square"
                    ariaLabel={$_("global.close")}
                >
                    <div
                        class="xmark-icon svg-icon"
                        aria-label={$_("global.close")}
                    ></div>
                </Button>
            {/snippet}
        </Dialog.Close>
    {/snippet}
</DialogWrapper>

<style>
    .xmark-icon {
        mask-image: url("/icons/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    :global(.post-history-raw-json-dialog .dialog-content) {
        padding: 8px;
    }

    :global(.post-history-raw-json-dialog--tabs) {
        height: min(80svh, 720px);
        max-height: calc(100svh - 24px);
    }

    :global(.post-history-raw-json-dialog--tabs .dialog-content) {
        flex: 1 1 0;
        min-height: 0;
        max-height: none;
        overflow: hidden;
        box-sizing: border-box;
        align-items: stretch;
    }

    .raw-json-heading {
        width: 100%;
        flex: 0 0 auto;
    }

    .raw-json-heading h2 {
        margin: 0;
        font-size: 1.1rem;
    }

    :global(.raw-json-tabs) {
        display: flex;
        width: 100%;
        box-sizing: border-box;
        gap: 4px;
        margin-top: 8px;
        border-bottom: 1px solid var(--border-hr);
    }

    :global(.raw-json-tabs-root),
    :global(.raw-json-panel) {
        width: 100%;
        min-width: 0;
    }

    :global(.raw-json-tabs-root) {
        display: flex;
        flex: 1 1 0;
        flex-direction: column;
        min-height: 0;
        overflow: hidden;
    }

    :global(.raw-json-panel[data-state="active"]) {
        display: flex;
        flex: 1 1 0;
        min-height: 0;
        overflow: hidden;
    }

    :global(.post-history-raw-json-dialog--tabs .raw-json-content) {
        flex: 1 1 0;
        min-height: 0;
        height: auto;
    }

    :global(.raw-json-tabs button) {
        border: 0;
        border-bottom: 2px solid transparent;
        padding: 6px 10px;
        background: transparent;
        color: var(--text);
        font: inherit;
        cursor: pointer;
    }

    :global(.raw-json-tabs button[data-state="active"]) {
        border-bottom-color: var(--accent-color);
    }

    .raw-json-content {
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
        height: 100%;
        margin: 10px 0 0;
        padding: 8px;
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
        white-space: pre-wrap;
        overflow-wrap: anywhere;
    }

    :global(.post-history-raw-json-dialog) {
        max-width: min(760px, calc(100% - 10px));
    }
</style>
