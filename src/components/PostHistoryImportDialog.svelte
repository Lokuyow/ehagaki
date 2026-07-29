<script lang="ts">
    import { Dialog } from "bits-ui";
    import { _ } from "svelte-i18n";
    import Button from "./Button.svelte";
    import DialogWrapper from "./DialogWrapper.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import {
        postHistoryJsonlImportService,
        type PostHistoryJsonlImportResult,
    } from "../lib/postHistoryJsonlImportService";

    interface Props {
        open?: boolean;
        ownerPubkeyHex: string | null | undefined;
        getCurrentPubkeyHex: () => string | null | undefined;
        onOpenChange?: (open: boolean) => void;
        onImported?: () => void | Promise<void>;
    }

    let {
        open = $bindable(false),
        ownerPubkeyHex,
        getCurrentPubkeyHex,
        onOpenChange = undefined,
        onImported = undefined,
    }: Props = $props();

    let fileInput = $state<HTMLInputElement | null>(null);
    let running = $state(false);
    let result = $state<PostHistoryJsonlImportResult | null>(null);
    let abortController: AbortController | null = null;
    let requestId = 0;
    let wasOpen = false;

    let statusKey = $derived.by(() => {
        if (running) return "postHistory.importReading";
        if (!result) return null;
        if (result.status === "completed") return "postHistory.importComplete";
        if (result.status === "partial") return "postHistory.importPartial";
        if (result.status === "account-changed") return "postHistory.importAccountChanged";
        if (result.status === "cancelled") return "postHistory.importCancelled";
        return "postHistory.importFailed";
    });

    function resetState(): void {
        result = null;
        running = false;
        abortController = null;
        if (fileInput) {
            fileInput.value = "";
        }
    }

    function cancelImport(): void {
        requestId += 1;
        abortController?.abort();
        abortController = null;
        running = false;
    }

    function handleOpenChange(nextOpen: boolean): void {
        if (!nextOpen) {
            cancelImport();
        }
        onOpenChange?.(nextOpen);
    }

    function chooseFile(): void {
        if (!running && ownerPubkeyHex) {
            fileInput?.click();
        }
    }

    async function handleFileChange(event: Event): Promise<void> {
        if (running || !ownerPubkeyHex) {
            return;
        }
        const input = event.currentTarget as HTMLInputElement;
        const file = input.files?.[0];
        input.value = "";
        if (!file) {
            return;
        }

        const currentRequestId = ++requestId;
        const controller = new AbortController();
        abortController = controller;
        running = true;
        result = null;
        try {
            const importResult = await postHistoryJsonlImportService.importFile({
                file,
                ownerPubkeyHex,
                getCurrentPubkeyHex,
                signal: controller.signal,
                onProgress: (progress) => {
                    if (currentRequestId === requestId && open) {
                        result = { ...progress };
                    }
                },
            });
            if (currentRequestId !== requestId || !open) {
                return;
            }

            result = importResult;
            const changedPostCount = importResult.insertedPostCount
                + importResult.updatedPostCount
                + importResult.appliedDeletionPostCount;
            if (changedPostCount > 0) {
                await onImported?.();
            }
        } finally {
            if (currentRequestId === requestId) {
                running = false;
                abortController = null;
            }
        }
    }

    $effect(() => {
        if (open && !wasOpen) {
            resetState();
        } else if (!open && wasOpen) {
            cancelImport();
        }
        wasOpen = open;
    });
</script>

<DialogWrapper
    bind:open
    onOpenChange={handleOpenChange}
    title={$_("postHistory.importTitle")}
    description={$_("postHistory.importDescription")}
    contentClass="post-history-import-dialog"
    footerVariant="close-button"
    initialFocus="content"
>
    <div class="import-heading">
        <h2>{$_("postHistory.importTitle")}</h2>
        <p>{$_("postHistory.importDescription")}</p>
    </div>

    <input
        bind:this={fileInput}
        class="visually-hidden import-file-input"
        type="file"
        accept=".jsonl,application/json,application/x-ndjson"
        aria-label={$_("postHistory.importChooseFile")}
        onchange={handleFileChange}
    />
    <Button
        className="post-history-import-file-button"
        variant="default"
        shape="pill"
        disabled={running || !ownerPubkeyHex}
        ariaLabel={$_("postHistory.importChooseFile")}
        onClick={chooseFile}
    >
        <span class="import-icon svg-icon" aria-hidden="true"></span>
        <span>{$_("postHistory.importChooseFile")}</span>
    </Button>

    {#if statusKey}
        <div
            class="import-status"
            class:import-status-error={result?.status === "failed"}
            aria-live="polite"
        >
            {#if running}
                <LoadingPlaceholder
                    showLoader={true}
                    loaderSize={24}
                    state="loading"
                    customClass="post-history-import-loading"
                />
            {/if}
            <span>{$_(statusKey)}</span>
        </div>
    {/if}

    {#if result}
        <div class="import-results">
            <section aria-labelledby="post-history-import-input-heading">
                <h3 id="post-history-import-input-heading">
                    {$_("postHistory.importInputResults")}
                </h3>
                <dl>
                    <div><dt>{$_("postHistory.importNonEmptyLines")}</dt><dd>{result.nonEmptyLineCount}</dd></div>
                    <div><dt>{$_("postHistory.importFileDuplicates")}</dt><dd>{result.fileDuplicateCount}</dd></div>
                    <div><dt>{$_("postHistory.importOtherAccount")}</dt><dd>{result.otherAccountCount}</dd></div>
                    <div><dt>{$_("postHistory.importUnsupportedKind")}</dt><dd>{result.unsupportedKindCount}</dd></div>
                    <div><dt>{$_("postHistory.importInvalidJson")}</dt><dd>{result.invalidJsonCount}</dd></div>
                    <div><dt>{$_("postHistory.importInvalidStructure")}</dt><dd>{result.invalidStructureCount}</dd></div>
                    <div><dt>{$_("postHistory.importInvalidCrypto")}</dt><dd>{result.invalidIdOrSignatureCount}</dd></div>
                </dl>
            </section>
            <section aria-labelledby="post-history-import-post-heading">
                <h3 id="post-history-import-post-heading">
                    {$_("postHistory.importPostResults")}
                </h3>
                <dl>
                    <div><dt>{$_("postHistory.importPostEvents")}</dt><dd>{result.uniquePostEventCount}</dd></div>
                    <div><dt>{$_("postHistory.importInserted")}</dt><dd>{result.insertedPostCount}</dd></div>
                    <div><dt>{$_("postHistory.importUpdated")}</dt><dd>{result.updatedPostCount}</dd></div>
                    <div><dt>{$_("postHistory.importUnchanged")}</dt><dd>{result.unchangedPostCount}</dd></div>
                    <div><dt>{$_("postHistory.importPostFailures")}</dt><dd>{result.failedPostEventCount}</dd></div>
                    <div><dt>{$_("postHistory.importDeletionApplied")}</dt><dd>{result.appliedDeletionPostCount}</dd></div>
                </dl>
            </section>
            <section aria-labelledby="post-history-import-deletion-heading">
                <h3 id="post-history-import-deletion-heading">
                    {$_("postHistory.importDeletionResults")}
                </h3>
                <dl>
                    <div><dt>{$_("postHistory.importDeletionEvents")}</dt><dd>{result.uniqueDeletionEventCount}</dd></div>
                    <div><dt>{$_("postHistory.importDeletionTags")}</dt><dd>{result.validDeletionETagCount}</dd></div>
                    <div><dt>{$_("postHistory.importDeletionRequestsInserted")}</dt><dd>{result.insertedDeletionRequestCount}</dd></div>
                    <div><dt>{$_("postHistory.importDeletionRequestsUpdated")}</dt><dd>{result.updatedDeletionRequestCount}</dd></div>
                    <div><dt>{$_("postHistory.importDeletionRequestsUnchanged")}</dt><dd>{result.unchangedDeletionRequestCount}</dd></div>
                    <div><dt>{$_("postHistory.importUnsupportedDeletion")}</dt><dd>{result.unsupportedDeletionEventCount}</dd></div>
                    <div><dt>{$_("postHistory.importDeletionFailures")}</dt><dd>{result.failedDeletionEventCount}</dd></div>
                </dl>
            </section>
        </div>
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
                    <div class="xmark-icon svg-icon" aria-hidden="true"></div>
                </Button>
            {/snippet}
        </Dialog.Close>
    {/snippet}
</DialogWrapper>

<style>
    .import-heading {
        width: 100%;
        text-align: left;
    }

    .import-heading h2,
    .import-heading p {
        margin: 0;
    }

    .import-heading h2 {
        font-size: 1.1rem;
    }

    .import-heading p {
        margin-top: 6px;
        color: var(--text-muted);
        font-size: 0.88rem;
        line-height: 1.5;
    }

    :global(.post-history-import-file-button) {
        margin-top: 16px;
    }

    .import-icon {
        mask-image: url("/icons/cloud_download_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .xmark-icon {
        mask-image: url("/icons/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .import-status {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        margin-top: 14px;
        padding: 10px;
        border-radius: 8px;
        background: color-mix(in srgb, var(--dialog-bg), var(--text) 5%);
    }

    .import-status-error {
        color: var(--error-color, #d32f2f);
    }

    :global(.post-history-import-loading) {
        flex: 0 0 auto;
    }

    .import-results {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
        width: 100%;
        margin-top: 12px;
    }

    .import-results section {
        min-width: 0;
        padding: 10px;
        border: 1px solid var(--border-hr);
        border-radius: 8px;
    }

    .import-results h3 {
        margin: 0 0 8px;
        font-size: 0.9rem;
    }

    .import-results dl,
    .import-results dl div {
        margin: 0;
    }

    .import-results dl div {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        padding-block: 3px;
        font-size: 0.8rem;
    }

    .import-results dt {
        min-width: 0;
        color: var(--text-muted);
    }

    .import-results dd {
        flex: 0 0 auto;
        font-variant-numeric: tabular-nums;
    }

    :global(.post-history-import-dialog) {
        max-width: min(760px, calc(100% - 10px));
    }

    @media (max-width: 680px) {
        .import-results {
            grid-template-columns: 1fr;
        }
    }
</style>
