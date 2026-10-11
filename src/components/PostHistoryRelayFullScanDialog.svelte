<script lang="ts">
    import { Dialog } from "bits-ui";
    import { _ } from "svelte-i18n";
    import Button from "./Button.svelte";
    import DialogWrapper from "./DialogWrapper.svelte";
    import InfoPopoverButton from "./InfoPopoverButton.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import { hasOnlyPostHistoryFullScanAmbiguity, type PostHistoryFullScanProgress, type PostHistoryFullScanResult, type PostHistoryFullScanRelayProgress } from "../lib/postHistoryRelayFullScanService";
    interface Props {
        open: boolean; running: boolean; canStart: boolean; elapsedMs: number;
        progress: PostHistoryFullScanProgress | null; result: PostHistoryFullScanResult | null;
        onOpenChange: (open: boolean) => void; onStart: () => void; onCancel: () => void;
    }
    let { open = $bindable(), running, canStart, elapsedMs, progress, result, onOpenChange, onStart, onCancel }: Props = $props();
    let metrics = $derived(result ?? progress);
    let statusKey = $derived(running ? `postHistory.fullScanPhase.${progress?.phase ?? "fetching"}`
        : result ? `postHistory.fullScanStatus.${result.status}` : null);
    let issueCounts = $derived.by(() => {
        const counts: Record<string, number> = {};
        for (const relay of result?.relays ?? []) {
            if (relay.status === "completed" && hasOnlyPostHistoryFullScanAmbiguity(relay)) continue;
            for (const [issue, count] of Object.entries(relay.issueCounts)) {
                counts[issue] = (counts[issue] ?? 0) + (count ?? 0);
            }
        }
        return Object.entries(counts);
    });
    function duration(ms: number) {
        const seconds = Math.floor(ms / 1000);
        return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
    }
    function relayHost(relayUrl: string) {
        try { return new URL(relayUrl).host; } catch { return relayUrl; }
    }
    function relayStatus(relay: PostHistoryFullScanRelayProgress) {
        if (relay.status === "running") return relay.phase;
        if (relay.status === "completed") return relay.receivedCount === 0 && !hasOnlyPostHistoryFullScanAmbiguity(relay) ? "empty" : "completed";
        if (relay.status === "cancelled") return "cancelled";
        const issues = Object.entries(relay.issueCounts).filter(([, count]) => (count ?? 0) > 0).map(([issue]) => issue);
        if (issues.length && issues.every((issue) => issue === "timeout" || issue === "auth-timeout")) return "timeout";
        if (issues.length === 1 && issues[0] === "error") return "error";
        return "partial";
    }
    function relayReason(relay: PostHistoryFullScanRelayProgress) {
        if (relay.status !== "partial" || relayStatus(relay) !== "partial") return null;
        const issues = Object.entries(relay.issueCounts).filter(([, count]) => (count ?? 0) > 0);
        return issues.length === 1 ? issues[0][0] : null;
    }
</script>

<DialogWrapper bind:open {onOpenChange} title={$_("postHistory.fullScanTitle")}
    description={$_("postHistory.fullScanDescription")} contentClass="post-history-full-scan-dialog"
    footerVariant="close-button" initialFocus="content">
    <div class="scan-heading">
        <h2>{$_("postHistory.fullScanTitle")}</h2>
        <p>{$_("postHistory.fullScanDescription")}</p>
    </div>
    <div class="scan-actions">
        <Button variant="primary" shape="square" className="scan-action" disabled={running || !canStart} onClick={onStart}>{$_("postHistory.fullScanStart")}</Button>
        {#if running}<Button variant="default" shape="square" className="scan-action" onClick={onCancel}>{$_("postHistory.fullScanCancel")}</Button>{/if}
    </div>
    {#if statusKey}
        <div class="scan-status" role="status">
            {#if running}<LoadingPlaceholder showLoader={true} loaderSize={20} />{/if}
            <span>{$_(statusKey)}</span>
        </div>
    {/if}
    {#if metrics}
        <div class="scan-results">
            <section>
                <h3>{$_("postHistory.fullScanRetrieval")}</h3>
                <dl>
                    <div><dt>{$_("postHistory.fullScanRelays")}</dt><dd>{metrics.finishedRelayCount} / {metrics.targetRelayCount}</dd></div>
                    <div><dt>{$_("postHistory.fullScanReceived")}</dt><dd>{metrics.receivedCount}</dd></div>
                    <div><dt>{$_("postHistory.importElapsedTime")}</dt><dd>{duration(elapsedMs)}</dd></div>
                </dl>
            </section>
            <section>
                <h3>{$_("postHistory.fullScanSaved")}</h3>
                <dl>
                    <div><dt>{$_("postHistory.importInserted")}</dt><dd>{metrics.insertedCount}</dd></div>
                    <div><dt>{$_("postHistory.fullScanUpdated")}</dt><dd>{metrics.updatedCount}</dd></div>
                    {#if result}
                        <div><dt>{$_("postHistory.fullScanCompletedRelays")}</dt><dd>{result.relays.filter((relay) => relay.status === "completed").length}</dd></div>
                        <div><dt>{$_("postHistory.fullScanIncompleteRelays")}</dt><dd>{result.relays.filter((relay) => relay.status !== "completed").length}</dd></div>
                        {#each issueCounts as [issue, count]}
                            <div><dt>{$_(`postHistory.fullScanIssue.${issue}`)}</dt><dd>{count}</dd></div>
                        {/each}
                    {/if}
                </dl>
            </section>
        </div>
        <section class="scan-relays">
            <table>
                <caption>{$_("postHistory.fullScanRelayProgress")}</caption>
                <thead><tr>
                    <th scope="col">{$_("postHistory.fullScanRelayHost")}</th>
                    <th scope="col">{$_("postHistory.fullScanRelayState")}</th>
                    <th scope="col">{$_("postHistory.fullScanReceived")}</th>
                </tr></thead>
                <tbody>
                    {#each metrics.relays as relay (relay.relayUrl)}
                        {@const reason = relayReason(relay)}
                        {@const ambiguityOnly = relay.status === "completed" && hasOnlyPostHistoryFullScanAmbiguity(relay)}
                        <tr class="scan-relay-row" data-relay-url={relay.relayUrl}>
                            <td><span class="scan-relay-host" title={relay.relayUrl}>{relayHost(relay.relayUrl)}</span></td>
                            <td class="scan-relay-state">
                                <div class="scan-relay-state-line">
                                    <span>{$_(`postHistory.fullScanRelayStatus.${relayStatus(relay)}`)}</span>
                                    {#if ambiguityOnly}
                                        <InfoPopoverButton side="top" sideOffset={4} ariaLabel={$_("postHistory.fullScanAmbiguityInfo.label")}>
                                            <div class="scan-relay-ambiguity-popover">
                                                <h3>{$_("postHistory.fullScanAmbiguityInfo.title")}</h3>
                                                <p>{$_("postHistory.fullScanAmbiguityInfo.bodyCompletion")}</p>
                                                <p>{$_("postHistory.fullScanAmbiguityInfo.bodyEose")}</p>
                                                <p>{$_("postHistory.fullScanAmbiguityInfo.bodyStatus")}</p>
                                            </div>
                                        </InfoPopoverButton>
                                    {/if}
                                </div>
                                {#if reason}<span class="scan-relay-reason">{$_(`postHistory.fullScanIssue.${reason}`)}</span>{/if}
                            </td>
                            <td class="scan-relay-count">{relay.receivedCount}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </section>
    {/if}
    {#snippet footer()}
        <Dialog.Close>
            {#snippet child({ props })}
                <Button {...props} className="modal-close scan-close-action" shape="square" ariaLabel={$_("global.close")}>
                    <span class="close-icon svg-icon" aria-hidden="true"></span>
                </Button>
            {/snippet}
        </Dialog.Close>
    {/snippet}
</DialogWrapper>

<style>
    .scan-heading, .scan-status, .scan-results { width: 100%; }
    .scan-heading { text-align: center; }
    .scan-heading h2, .scan-heading p { margin: 0; }
    .scan-heading h2 { font-size: 1.25rem; }
    .scan-heading p { margin-top: 16px; font-size: 0.88rem; line-height: 1.5; white-space: pre-line; }
    .scan-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
    .scan-status { display: flex; align-items: center; gap: 8px; margin-top: 12px; font-size: 0.9rem; }
    :global(.post-history-full-scan-dialog .scan-action) { box-sizing: border-box; min-width: 50px; min-height: 50px; padding: 8px 12px; }
    :global(.post-history-full-scan-dialog .scan-close-action) { box-sizing: border-box; min-width: 50px; min-height: 50px; }
    :global(.post-history-full-scan-dialog .scan-status .loading-placeholder) { width: auto; flex: 0 0 auto; justify-content: flex-start; }
    .close-icon { mask-image: url("/icons/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"); }
    .scan-results { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-top: 12px; }
    .scan-results section { min-width: 0; padding: 10px; border: 1px solid var(--border-hr); border-radius: 8px; }
    .scan-results h3 { margin: 0 0 8px; font-size: 0.9rem; }
    .scan-results dl, .scan-results dl div { margin: 0; }
    .scan-results dl div { display: flex; justify-content: space-between; gap: 8px; padding-block: 3px; font-size: 0.8rem; }
    .scan-results dt { min-width: 0; color: var(--text-muted); overflow-wrap: anywhere; }
    .scan-results dd { margin: 0; flex: 0 0 auto; font-variant-numeric: tabular-nums; }
    .scan-relays { width: 100%; min-width: 0; box-sizing: border-box; margin-top: 12px; padding: 10px; border: 1px solid var(--border-hr); border-radius: 8px; }
    .scan-relays table { width: 100%; table-layout: fixed; border-collapse: collapse; font-size: 0.8rem; }
    .scan-relays caption { margin-bottom: 8px; text-align: left; font-size: 0.9rem; font-weight: 600; }
    .scan-relays th, .scan-relays td { padding: 6px 4px; text-align: left; overflow-wrap: anywhere; }
    .scan-relays th { color: var(--text-muted); font-weight: 500; }
    .scan-relays th:first-child { width: 45%; }
    .scan-relays th:nth-child(2) { width: 28%; }
    .scan-relays th:last-child, .scan-relays td:last-child { text-align: right; }
    .scan-relay-row { border-top: 1px solid var(--border-hr); }
    .scan-relay-host { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .scan-relay-state-line { display: flex; align-items: center; flex-wrap: wrap; gap: 2px; min-width: 0; min-height: 44px; box-sizing: border-box; }
    .scan-relay-state-line > span { min-width: 0; overflow-wrap: anywhere; }
    .scan-relay-count { font-variant-numeric: tabular-nums; }
    .scan-relay-reason { display: block; margin-top: 4px; color: var(--text-muted); font-size: 0.75rem; }
    :global(.popover-content:has(.scan-relay-ambiguity-popover)) {
        box-sizing: border-box;
        inline-size: min(320px, calc(100vw - 24px));
        max-inline-size: calc(100vw - 24px);
        max-block-size: min(var(--bits-popover-content-available-height, calc(100vh - 24px)), calc(100vh - 24px));
        overflow: auto;
    }
    .scan-relay-ambiguity-popover { overflow-wrap: anywhere; }
    .scan-relay-ambiguity-popover h3 { margin: 0 0 8px; font-size: 1rem; }
    .scan-relay-ambiguity-popover p { margin: 0 0 8px; }
    .scan-relay-ambiguity-popover p:last-child { margin-bottom: 0; }
    :global(.post-history-full-scan-dialog) { max-width: min(760px, calc(100% - 10px)); }
    @media (max-width: 680px) { .scan-results { grid-template-columns: 1fr; } }
</style>
